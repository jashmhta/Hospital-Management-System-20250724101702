package com.hms.configserver.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.config.environment.Environment;
import org.springframework.cloud.config.environment.PropertySource;
import org.springframework.cloud.config.server.environment.EnvironmentRepository;
import org.springframework.stereotype.Service;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;

import jakarta.annotation.PostConstruct;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.regex.Pattern;

/**
 * Configuration Management Service
 * 
 * Provides comprehensive configuration management capabilities for
 * the HMS ecosystem including:
 * - Healthcare-specific configuration validation
 * - HIPAA compliance checking for configuration properties
 * - Environment-specific configuration management
 * - Configuration audit and monitoring
 * - Encryption/Decryption management
 * - Configuration cache management
 * 
 * This service ensures secure and compliant configuration management
 * for all HMS microservices.
 */
@Service
public class ConfigurationManagementService implements HealthIndicator {

    private static final Logger logger = LoggerFactory.getLogger(ConfigurationManagementService.class);

    @Autowired
    private EnvironmentRepository environmentRepository;

    @Value("${hms.config.security.encryption-key:#{null}}")
    private String encryptionKey;

    @Value("${hms.config.validation.hipaa-compliance:true}")
    private boolean hipaaComplianceEnabled;

    @Value("${hms.config.monitoring.enabled:true}")
    private boolean monitoringEnabled;

    // Configuration access metrics
    private final AtomicInteger totalConfigRequests = new AtomicInteger(0);
    private final AtomicInteger encryptedPropertiesCount = new AtomicInteger(0);
    private final AtomicLong lastConfigUpdate = new AtomicLong(System.currentTimeMillis());
    private final Map<String, ConfigurationMetrics> serviceConfigMetrics = new ConcurrentHashMap<>();
    
    // Healthcare service configuration requirements
    private static final Map<String, Set<String>> REQUIRED_HEALTHCARE_CONFIGS = Map.of(
        "patient-management", Set.of(
            "spring.datasource.url", "spring.datasource.username", "spring.datasource.password",
            "hms.security.jwt.secret", "hms.hipaa.encryption.enabled", "hms.audit.enabled"
        ),
        "clinical-documentation", Set.of(
            "spring.datasource.url", "hms.fhir.server.url", "hms.hipaa.encryption.enabled",
            "hms.audit.enabled", "hms.security.jwt.secret"
        ),
        "pharmacy-service", Set.of(
            "spring.datasource.url", "hms.drug-database.url", "hms.security.jwt.secret",
            "hms.hipaa.encryption.enabled", "hms.audit.enabled"
        ),
        "emergency-service", Set.of(
            "spring.datasource.url", "hms.emergency.alert.enabled", "hms.security.jwt.secret",
            "hms.hipaa.encryption.enabled", "hms.audit.enabled", "hms.realtime.enabled"
        ),
        "billing-service", Set.of(
            "spring.datasource.url", "hms.payment.gateway.url", "hms.security.jwt.secret",
            "hms.hipaa.encryption.enabled", "hms.audit.enabled", "hms.billing.encryption.enabled"
        )
    );

    // Sensitive property patterns that should be encrypted
    private static final Set<Pattern> SENSITIVE_PROPERTY_PATTERNS = Set.of(
        Pattern.compile(".*password.*", Pattern.CASE_INSENSITIVE),
        Pattern.compile(".*secret.*", Pattern.CASE_INSENSITIVE),
        Pattern.compile(".*key.*", Pattern.CASE_INSENSITIVE),
        Pattern.compile(".*token.*", Pattern.CASE_INSENSITIVE),
        Pattern.compile(".*credential.*", Pattern.CASE_INSENSITIVE),
        Pattern.compile(".*api[_-]?key.*", Pattern.CASE_INSENSITIVE),
        Pattern.compile(".*private[_-]?key.*", Pattern.CASE_INSENSITIVE),
        Pattern.compile(".*encryption.*", Pattern.CASE_INSENSITIVE)
    );

    // HIPAA-related property patterns
    private static final Set<Pattern> HIPAA_PROPERTY_PATTERNS = Set.of(
        Pattern.compile(".*hipaa.*", Pattern.CASE_INSENSITIVE),
        Pattern.compile(".*phi.*encryption.*", Pattern.CASE_INSENSITIVE),
        Pattern.compile(".*patient.*data.*", Pattern.CASE_INSENSITIVE),
        Pattern.compile(".*medical.*record.*", Pattern.CASE_INSENSITIVE),
        Pattern.compile(".*health.*information.*", Pattern.CASE_INSENSITIVE)
    );

    // Configuration validation status
    private boolean configurationHealthy = true;
    private List<String> configurationIssues = new ArrayList<>();

    @PostConstruct
    public void init() {
        logger.info("=== HMS Configuration Management Service Initialized ===");
        logger.info("HIPAA Compliance Validation: {}", hipaaComplianceEnabled);
        logger.info("Configuration Monitoring: {}", monitoringEnabled);
        logger.info("Encryption Key Available: {}", encryptionKey != null);
        logger.info("Healthcare Services Monitored: {}", REQUIRED_HEALTHCARE_CONFIGS.keySet());
    }

    /**
     * Get configuration for a specific service with validation and monitoring
     */
    public Environment getServiceConfiguration(String application, String profile, String label) {
        totalConfigRequests.incrementAndGet();
        
        try {
            logger.info("Configuration requested for service: {} - Profile: {} - Label: {}", 
                application, profile, label);
            
            // Get configuration from repository
            Environment environment = environmentRepository.findOne(application, profile, label);
            
            // Update service metrics
            ConfigurationMetrics metrics = serviceConfigMetrics.computeIfAbsent(application, 
                k -> new ConfigurationMetrics());
            metrics.incrementRequests();
            metrics.setLastAccess(LocalDateTime.now());
            
            // Validate healthcare service configuration
            if (REQUIRED_HEALTHCARE_CONFIGS.containsKey(application)) {
                validateHealthcareServiceConfiguration(application, environment);
            }
            
            // Validate HIPAA compliance
            if (hipaaComplianceEnabled) {
                validateHipaaCompliance(application, environment);
            }
            
            // Check for sensitive properties
            validateSensitiveProperties(application, environment);
            
            // Update configuration cache
            updateConfigurationCache(application, profile, label, environment);
            
            lastConfigUpdate.set(System.currentTimeMillis());
            
            logger.info("Configuration successfully provided for service: {}", application);
            return environment;
            
        } catch (Exception e) {
            logger.error("Error retrieving configuration for service: {}", application, e);
            
            // Update metrics with error
            ConfigurationMetrics metrics = serviceConfigMetrics.computeIfAbsent(application, 
                k -> new ConfigurationMetrics());
            metrics.incrementErrors();
            
            throw new RuntimeException("Failed to retrieve configuration for service: " + application, e);
        }
    }

    /**
     * Validate healthcare service configuration requirements
     */
    private void validateHealthcareServiceConfiguration(String serviceName, Environment environment) {
        Set<String> requiredConfigs = REQUIRED_HEALTHCARE_CONFIGS.get(serviceName);
        if (requiredConfigs == null) {
            return;
        }
        
        List<String> missingConfigs = new ArrayList<>();
        Set<String> availableProperties = new HashSet<>();
        
        // Collect all available properties
        for (PropertySource propertySource : environment.getPropertySources()) {
            if (propertySource.getSource() instanceof Map) {
                @SuppressWarnings("unchecked")
                Map<String, Object> source = (Map<String, Object>) propertySource.getSource();
                availableProperties.addAll(source.keySet());
            }
        }
        
        // Check for missing required configurations
        for (String requiredConfig : requiredConfigs) {
            if (!availableProperties.contains(requiredConfig)) {
                missingConfigs.add(requiredConfig);
            }
        }
        
        if (!missingConfigs.isEmpty()) {
            String issue = String.format("Healthcare service %s missing required configurations: %s", 
                serviceName, missingConfigs);
            configurationIssues.add(issue);
            logger.error("CONFIGURATION VALIDATION FAILED: {}", issue);
            
            // Update metrics
            ConfigurationMetrics metrics = serviceConfigMetrics.get(serviceName);
            if (metrics != null) {
                metrics.incrementValidationFailures();
            }
            
            configurationHealthy = false;
        } else {
            logger.info("Healthcare service {} configuration validation passed", serviceName);
        }
    }

    /**
     * Validate HIPAA compliance for configuration properties
     */
    private void validateHipaaCompliance(String serviceName, Environment environment) {
        List<String> hipaaIssues = new ArrayList<>();
        int hipaaPropertiesCount = 0;
        int encryptedHipaaProperties = 0;
        
        for (PropertySource propertySource : environment.getPropertySources()) {
            if (propertySource.getSource() instanceof Map) {
                @SuppressWarnings("unchecked")
                Map<String, Object> source = (Map<String, Object>) propertySource.getSource();
                
                for (Map.Entry<String, Object> entry : source.entrySet()) {
                    String propertyName = entry.getKey();
                    Object propertyValue = entry.getValue();
                    
                    // Check if this is a HIPAA-related property
                    boolean isHipaaProperty = HIPAA_PROPERTY_PATTERNS.stream()
                        .anyMatch(pattern -> pattern.matcher(propertyName).matches());
                    
                    if (isHipaaProperty) {
                        hipaaPropertiesCount++;
                        
                        // Check if HIPAA property is encrypted
                        if (propertyValue instanceof String) {
                            String valueStr = (String) propertyValue;
                            if (valueStr.startsWith("{cipher}")) {
                                encryptedHipaaProperties++;
                            } else {
                                hipaaIssues.add(String.format("HIPAA property '%s' is not encrypted", propertyName));
                            }
                        }
                    }
                    
                    // Validate specific HIPAA requirements
                    if ("hms.hipaa.encryption.enabled".equals(propertyName)) {
                        if (!"true".equals(String.valueOf(propertyValue))) {
                            hipaaIssues.add("HIPAA encryption is not enabled for service: " + serviceName);
                        }
                    }
                    
                    if ("hms.audit.enabled".equals(propertyName)) {
                        if (!"true".equals(String.valueOf(propertyValue))) {
                            hipaaIssues.add("HIPAA audit logging is not enabled for service: " + serviceName);
                        }
                    }
                }
            }
        }
        
        // Log HIPAA compliance results
        if (!hipaaIssues.isEmpty()) {
            String issue = String.format("HIPAA compliance issues for service %s: %s", 
                serviceName, hipaaIssues);
            configurationIssues.add(issue);
            logger.error("HIPAA COMPLIANCE VALIDATION FAILED: {}", issue);
            configurationHealthy = false;
        } else {
            logger.info("HIPAA compliance validation passed for service: {} - HIPAA properties: {}, Encrypted: {}", 
                serviceName, hipaaPropertiesCount, encryptedHipaaProperties);
        }
        
        // Update metrics
        ConfigurationMetrics metrics = serviceConfigMetrics.get(serviceName);
        if (metrics != null) {
            metrics.setHipaaPropertiesCount(hipaaPropertiesCount);
            metrics.setEncryptedHipaaProperties(encryptedHipaaProperties);
        }
    }

    /**
     * Validate sensitive properties are properly encrypted
     */
    private void validateSensitiveProperties(String serviceName, Environment environment) {
        List<String> unencryptedSensitiveProps = new ArrayList<>();
        int totalSensitiveProps = 0;
        int encryptedSensitiveProps = 0;
        
        for (PropertySource propertySource : environment.getPropertySources()) {
            if (propertySource.getSource() instanceof Map) {
                @SuppressWarnings("unchecked")
                Map<String, Object> source = (Map<String, Object>) propertySource.getSource();
                
                for (Map.Entry<String, Object> entry : source.entrySet()) {
                    String propertyName = entry.getKey();
                    Object propertyValue = entry.getValue();
                    
                    // Check if this is a sensitive property
                    boolean isSensitive = SENSITIVE_PROPERTY_PATTERNS.stream()
                        .anyMatch(pattern -> pattern.matcher(propertyName).matches());
                    
                    if (isSensitive) {
                        totalSensitiveProps++;
                        
                        if (propertyValue instanceof String) {
                            String valueStr = (String) propertyValue;
                            if (valueStr.startsWith("{cipher}")) {
                                encryptedSensitiveProps++;
                                encryptedPropertiesCount.incrementAndGet();
                            } else {
                                unencryptedSensitiveProps.add(propertyName);
                            }
                        }
                    }
                }
            }
        }
        
        if (!unencryptedSensitiveProps.isEmpty()) {
            String issue = String.format("Service %s has unencrypted sensitive properties: %s", 
                serviceName, unencryptedSensitiveProps);
            configurationIssues.add(issue);
            logger.warn("SECURITY WARNING: {}", issue);
            
            // For healthcare services, this is more critical
            if (REQUIRED_HEALTHCARE_CONFIGS.containsKey(serviceName)) {
                configurationHealthy = false;
                logger.error("CRITICAL: Healthcare service {} has unencrypted sensitive properties!", serviceName);
            }
        }
        
        logger.info("Sensitive properties validation for {}: Total={}, Encrypted={}, Unencrypted={}", 
            serviceName, totalSensitiveProps, encryptedSensitiveProps, unencryptedSensitiveProps.size());
        
        // Update metrics
        ConfigurationMetrics metrics = serviceConfigMetrics.get(serviceName);
        if (metrics != null) {
            metrics.setSensitivePropertiesCount(totalSensitiveProps);
            metrics.setEncryptedSensitiveProperties(encryptedSensitiveProps);
        }
    }

    /**
     * Update configuration cache for monitoring
     */
    private void updateConfigurationCache(String application, String profile, String label, Environment environment) {
        ConfigurationMetrics metrics = serviceConfigMetrics.get(application);
        if (metrics != null) {
            metrics.setLastProfile(profile);
            metrics.setLastLabel(label);
            metrics.setPropertySourcesCount(environment.getPropertySources().size());
        }
    }

    /**
     * Scheduled configuration health monitoring
     */
    @Scheduled(fixedRate = 60000) // Every minute
    public void monitorConfigurationHealth() {
        if (!monitoringEnabled) {
            return;
        }
        
        try {
            validateConfigurationHealth();
            monitorServiceConfigurationsHealth();
            logConfigurationMetrics();
        } catch (Exception e) {
            logger.error("Error during configuration health monitoring", e);
        }
    }

    /**
     * Validate overall configuration health
     */
    private void validateConfigurationHealth() {
        configurationIssues.clear();
        configurationHealthy = true;
        
        // Check for required healthcare services configurations
        for (String serviceName : REQUIRED_HEALTHCARE_CONFIGS.keySet()) {
            ConfigurationMetrics metrics = serviceConfigMetrics.get(serviceName);
            if (metrics == null || metrics.getLastAccess() == null) {
                configurationIssues.add("No recent configuration access for critical service: " + serviceName);
                configurationHealthy = false;
            } else {
                // Check if configuration was accessed recently (within last hour)
                LocalDateTime oneHourAgo = LocalDateTime.now().minusHours(1);
                if (metrics.getLastAccess().isBefore(oneHourAgo)) {
                    configurationIssues.add("Stale configuration access for service: " + serviceName);
                }
            }
        }
        
        // Check encryption key availability
        if (encryptionKey == null) {
            configurationIssues.add("Encryption key not configured - sensitive properties cannot be encrypted");
            configurationHealthy = false;
        }
        
        lastConfigUpdate.set(System.currentTimeMillis());
    }

    /**
     * Monitor individual service configuration health
     */
    private void monitorServiceConfigurationsHealth() {
        for (Map.Entry<String, ConfigurationMetrics> entry : serviceConfigMetrics.entrySet()) {
            String serviceName = entry.getKey();
            ConfigurationMetrics metrics = entry.getValue();
            
            // Check error rate
            double errorRate = metrics.getErrors() > 0 ? 
                (double) metrics.getErrors() / metrics.getRequests() : 0.0;
            
            if (errorRate > 0.1) { // More than 10% error rate
                String issue = String.format("High configuration error rate for service %s: %.2f%%", 
                    serviceName, errorRate * 100);
                configurationIssues.add(issue);
                logger.warn("CONFIGURATION HEALTH WARNING: {}", issue);
            }
            
            // Check validation failure rate
            double validationFailureRate = metrics.getValidationFailures() > 0 ? 
                (double) metrics.getValidationFailures() / metrics.getRequests() : 0.0;
            
            if (validationFailureRate > 0.05) { // More than 5% validation failure rate
                String issue = String.format("High validation failure rate for service %s: %.2f%%", 
                    serviceName, validationFailureRate * 100);
                configurationIssues.add(issue);
                logger.error("CONFIGURATION VALIDATION WARNING: {}", issue);
            }
        }
    }

    /**
     * Log comprehensive configuration metrics
     */
    private void logConfigurationMetrics() {
        if (logger.isInfoEnabled()) {
            logger.info("=== HMS Configuration Management Health Status ===");
            logger.info("Configuration Healthy: {}", configurationHealthy);
            logger.info("Total Config Requests: {}", totalConfigRequests.get());
            logger.info("Encrypted Properties: {}", encryptedPropertiesCount.get());
            logger.info("Monitored Services: {}", serviceConfigMetrics.size());
            logger.info("Healthcare Services: {}", REQUIRED_HEALTHCARE_CONFIGS.size());
            
            if (!configurationHealthy && !configurationIssues.isEmpty()) {
                logger.warn("Configuration Issues: {}", configurationIssues);
            }
        }
    }

    /**
     * Get comprehensive configuration status
     */
    public Map<String, Object> getConfigurationStatus() {
        Map<String, Object> status = new HashMap<>();
        status.put("configurationHealthy", configurationHealthy);
        status.put("totalConfigRequests", totalConfigRequests.get());
        status.put("encryptedPropertiesCount", encryptedPropertiesCount.get());
        status.put("monitoredServices", serviceConfigMetrics.size());
        status.put("lastConfigUpdate", new Date(lastConfigUpdate.get()));
        status.put("configurationIssues", new ArrayList<>(configurationIssues));
        status.put("healthcareServices", REQUIRED_HEALTHCARE_CONFIGS.keySet());
        status.put("encryptionKeyAvailable", encryptionKey != null);
        status.put("hipaaComplianceEnabled", hipaaComplianceEnabled);
        
        // Add detailed service metrics
        Map<String, Object> detailedMetrics = new HashMap<>();
        for (Map.Entry<String, ConfigurationMetrics> entry : serviceConfigMetrics.entrySet()) {
            ConfigurationMetrics metrics = entry.getValue();
            Map<String, Object> serviceInfo = new HashMap<>();
            serviceInfo.put("requests", metrics.getRequests());
            serviceInfo.put("errors", metrics.getErrors());
            serviceInfo.put("validationFailures", metrics.getValidationFailures());
            serviceInfo.put("lastAccess", metrics.getLastAccess());
            serviceInfo.put("lastProfile", metrics.getLastProfile());
            serviceInfo.put("lastLabel", metrics.getLastLabel());
            serviceInfo.put("propertySourcesCount", metrics.getPropertySourcesCount());
            serviceInfo.put("sensitivePropertiesCount", metrics.getSensitivePropertiesCount());
            serviceInfo.put("encryptedSensitiveProperties", metrics.getEncryptedSensitiveProperties());
            serviceInfo.put("hipaaPropertiesCount", metrics.getHipaaPropertiesCount());
            serviceInfo.put("encryptedHipaaProperties", metrics.getEncryptedHipaaProperties());
            serviceInfo.put("isHealthcareService", REQUIRED_HEALTHCARE_CONFIGS.containsKey(entry.getKey()));
            detailedMetrics.put(entry.getKey(), serviceInfo);
        }
        status.put("serviceMetrics", detailedMetrics);
        
        return status;
    }

    /**
     * Spring Boot Actuator Health Indicator implementation
     */
    @Override
    public Health health() {
        Health.Builder builder = configurationHealthy ? Health.up() : Health.down();
        
        builder.withDetail("totalConfigRequests", totalConfigRequests.get())
               .withDetail("encryptedPropertiesCount", encryptedPropertiesCount.get())
               .withDetail("monitoredServices", serviceConfigMetrics.size())
               .withDetail("lastConfigUpdate", new Date(lastConfigUpdate.get()))
               .withDetail("encryptionKeyAvailable", encryptionKey != null)
               .withDetail("hipaaComplianceEnabled", hipaaComplianceEnabled);
        
        if (!configurationHealthy) {
            builder.withDetail("issues", configurationIssues);
        }
        
        return builder.build();
    }

    /**
     * Inner class to track service-specific configuration metrics
     */
    private static class ConfigurationMetrics {
        private final AtomicInteger requests = new AtomicInteger(0);
        private final AtomicInteger errors = new AtomicInteger(0);
        private final AtomicInteger validationFailures = new AtomicInteger(0);
        private LocalDateTime lastAccess;
        private String lastProfile;
        private String lastLabel;
        private int propertySourcesCount;
        private int sensitivePropertiesCount;
        private int encryptedSensitiveProperties;
        private int hipaaPropertiesCount;
        private int encryptedHipaaProperties;
        
        public void incrementRequests() {
            requests.incrementAndGet();
        }
        
        public void incrementErrors() {
            errors.incrementAndGet();
        }
        
        public void incrementValidationFailures() {
            validationFailures.incrementAndGet();
        }
        
        // Getters and Setters
        public int getRequests() { return requests.get(); }
        public int getErrors() { return errors.get(); }
        public int getValidationFailures() { return validationFailures.get(); }
        public LocalDateTime getLastAccess() { return lastAccess; }
        public void setLastAccess(LocalDateTime lastAccess) { this.lastAccess = lastAccess; }
        public String getLastProfile() { return lastProfile; }
        public void setLastProfile(String lastProfile) { this.lastProfile = lastProfile; }
        public String getLastLabel() { return lastLabel; }
        public void setLastLabel(String lastLabel) { this.lastLabel = lastLabel; }
        public int getPropertySourcesCount() { return propertySourcesCount; }
        public void setPropertySourcesCount(int propertySourcesCount) { this.propertySourcesCount = propertySourcesCount; }
        public int getSensitivePropertiesCount() { return sensitivePropertiesCount; }
        public void setSensitivePropertiesCount(int sensitivePropertiesCount) { this.sensitivePropertiesCount = sensitivePropertiesCount; }
        public int getEncryptedSensitiveProperties() { return encryptedSensitiveProperties; }
        public void setEncryptedSensitiveProperties(int encryptedSensitiveProperties) { this.encryptedSensitiveProperties = encryptedSensitiveProperties; }
        public int getHipaaPropertiesCount() { return hipaaPropertiesCount; }
        public void setHipaaPropertiesCount(int hipaaPropertiesCount) { this.hipaaPropertiesCount = hipaaPropertiesCount; }
        public int getEncryptedHipaaProperties() { return encryptedHipaaProperties; }
        public void setEncryptedHipaaProperties(int encryptedHipaaProperties) { this.encryptedHipaaProperties = encryptedHipaaProperties; }
    }
}
