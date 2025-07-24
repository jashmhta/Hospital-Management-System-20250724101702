package com.hms.configserver.controller;

import com.hms.configserver.service.ConfigurationManagementService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.config.environment.Environment;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

/**
 * Configuration Management Controller
 * 
 * Provides REST endpoints for configuration management and monitoring
 * including healthcare-specific configuration validation and HIPAA
 * compliance checking.
 * 
 * Endpoints:
 * - GET /config/status - Overall configuration health and status
 * - GET /config/services - List all monitored services
 * - GET /config/services/{serviceName}/validate - Validate specific service config
 * - GET /config/healthcare/compliance - HIPAA compliance status
 * - GET /config/encryption/status - Encryption status and metrics
 * - POST /config/services/{serviceName}/refresh - Force configuration refresh
 * - GET /config/metrics - Comprehensive configuration metrics
 */
@RestController
@RequestMapping("/config")
@CrossOrigin(origins = "*")
public class ConfigurationController {

    private static final Logger logger = LoggerFactory.getLogger(ConfigurationController.class);

    @Autowired
    private ConfigurationManagementService configurationManagementService;

    /**
     * Get comprehensive configuration status and health information
     * 
     * @return Configuration status including health, metrics, and service information
     */
    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getConfigurationStatus() {
        try {
            logger.info("Configuration status requested");
            
            Map<String, Object> status = configurationManagementService.getConfigurationStatus();
            status.put("timestamp", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
            status.put("serverType", "Spring Cloud Config Server");
            status.put("version", "3.2.0");
            
            return ResponseEntity.ok(status);
            
        } catch (Exception e) {
            logger.error("Error retrieving configuration status", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to retrieve configuration status");
            errorResponse.put("message", e.getMessage());
            errorResponse.put("timestamp", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    /**
     * Get list of all monitored services with their configuration metrics
     * 
     * @return List of services with configuration access patterns and health
     */
    @GetMapping("/services")
    public ResponseEntity<Map<String, Object>> getMonitoredServices() {
        try {
            logger.info("Monitored services list requested");
            
            Map<String, Object> configStatus = configurationManagementService.getConfigurationStatus();
            
            Map<String, Object> response = new HashMap<>();
            response.put("services", configStatus.get("serviceMetrics"));
            response.put("totalServices", ((Map<?, ?>) configStatus.get("serviceMetrics")).size());
            response.put("healthcareServices", configStatus.get("healthcareServices"));
            response.put("configurationHealthy", configStatus.get("configurationHealthy"));
            response.put("timestamp", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error retrieving monitored services", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to retrieve monitored services");
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    /**
     * Validate configuration for a specific service
     * 
     * @param serviceName Name of the service to validate
     * @param profile Profile to validate (optional, defaults to "default")
     * @param label Label to validate (optional, defaults to "master")
     * @return Configuration validation results
     */
    @GetMapping("/services/{serviceName}/validate")
    public ResponseEntity<Map<String, Object>> validateServiceConfiguration(
            @PathVariable String serviceName,
            @RequestParam(defaultValue = "default") String profile,
            @RequestParam(defaultValue = "master") String label) {
        try {
            logger.info("Configuration validation requested for service: {} - Profile: {} - Label: {}", 
                serviceName, profile, label);
            
            // Get configuration and trigger validation
            Environment environment = configurationManagementService.getServiceConfiguration(serviceName, profile, label);
            
            Map<String, Object> validationResult = new HashMap<>();
            validationResult.put("serviceName", serviceName);
            validationResult.put("profile", profile);
            validationResult.put("label", label);
            validationResult.put("validationStatus", "COMPLETED");
            validationResult.put("propertySourcesCount", environment.getPropertySources().size());
            
            // Get current service metrics for validation details
            Map<String, Object> configStatus = configurationManagementService.getConfigurationStatus();
            @SuppressWarnings("unchecked")
            Map<String, Object> serviceMetrics = (Map<String, Object>) configStatus.get("serviceMetrics");
            
            if (serviceMetrics.containsKey(serviceName)) {
                @SuppressWarnings("unchecked")
                Map<String, Object> metrics = (Map<String, Object>) serviceMetrics.get(serviceName);
                validationResult.put("validationFailures", metrics.get("validationFailures"));
                validationResult.put("sensitivePropertiesCount", metrics.get("sensitivePropertiesCount"));
                validationResult.put("encryptedSensitiveProperties", metrics.get("encryptedSensitiveProperties"));
                validationResult.put("hipaaPropertiesCount", metrics.get("hipaaPropertiesCount"));
                validationResult.put("encryptedHipaaProperties", metrics.get("encryptedHipaaProperties"));
                validationResult.put("isHealthcareService", metrics.get("isHealthcareService"));
            }
            
            // Add configuration issues if any
            @SuppressWarnings("unchecked")
            List<String> configIssues = (List<String>) configStatus.get("configurationIssues");
            List<String> serviceSpecificIssues = configIssues.stream()
                .filter(issue -> issue.contains(serviceName))
                .toList();
            validationResult.put("issues", serviceSpecificIssues);
            
            validationResult.put("timestamp", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
            
            return ResponseEntity.ok(validationResult);
            
        } catch (Exception e) {
            logger.error("Error validating configuration for service {}", serviceName, e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Configuration validation failed");
            errorResponse.put("serviceName", serviceName);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    /**
     * Get HIPAA compliance status for healthcare services
     * 
     * @return HIPAA compliance assessment for all healthcare services
     */
    @GetMapping("/healthcare/compliance")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getHipaaComplianceStatus() {
        try {
            logger.info("HIPAA compliance status requested");
            
            Map<String, Object> configStatus = configurationManagementService.getConfigurationStatus();
            
            Map<String, Object> complianceStatus = new HashMap<>();
            complianceStatus.put("hipaaComplianceEnabled", configStatus.get("hipaaComplianceEnabled"));
            complianceStatus.put("overallConfigurationHealthy", configStatus.get("configurationHealthy"));
            
            // Analyze HIPAA compliance for healthcare services
            @SuppressWarnings("unchecked")
            Set<String> healthcareServices = (Set<String>) configStatus.get("healthcareServices");
            @SuppressWarnings("unchecked")
            Map<String, Object> serviceMetrics = (Map<String, Object>) configStatus.get("serviceMetrics");
            
            List<Map<String, Object>> serviceCompliance = new ArrayList<>();
            int compliantServices = 0;
            int totalHipaaProperties = 0;
            int totalEncryptedHipaaProperties = 0;
            
            for (String serviceName : healthcareServices) {
                if (serviceMetrics.containsKey(serviceName)) {
                    @SuppressWarnings("unchecked")
                    Map<String, Object> metrics = (Map<String, Object>) serviceMetrics.get(serviceName);
                    
                    Map<String, Object> serviceComplianceInfo = new HashMap<>();
                    serviceComplianceInfo.put("serviceName", serviceName);
                    
                    Integer hipaaPropsCount = (Integer) metrics.get("hipaaPropertiesCount");
                    Integer encryptedHipaaProps = (Integer) metrics.get("encryptedHipaaProperties");
                    Integer validationFailures = (Integer) metrics.get("validationFailures");
                    
                    hipaaPropsCount = hipaaPropsCount != null ? hipaaPropsCount : 0;
                    encryptedHipaaProps = encryptedHipaaProps != null ? encryptedHipaaProps : 0;
                    validationFailures = validationFailures != null ? validationFailures : 0;
                    
                    serviceComplianceInfo.put("hipaaPropertiesCount", hipaaPropsCount);
                    serviceComplianceInfo.put("encryptedHipaaProperties", encryptedHipaaProps);
                    serviceComplianceInfo.put("validationFailures", validationFailures);
                    
                    // Calculate compliance percentage
                    double compliancePercentage = hipaaPropsCount > 0 ? 
                        (double) encryptedHipaaProps / hipaaPropsCount * 100 : 100.0;
                    serviceComplianceInfo.put("compliancePercentage", Math.round(compliancePercentage * 100.0) / 100.0);
                    
                    // Determine compliance status
                    String complianceLevel;
                    if (validationFailures == 0 && compliancePercentage >= 100.0) {
                        complianceLevel = "FULLY_COMPLIANT";
                        compliantServices++;
                    } else if (compliancePercentage >= 80.0) {
                        complianceLevel = "MOSTLY_COMPLIANT";
                    } else if (compliancePercentage >= 50.0) {
                        complianceLevel = "PARTIALLY_COMPLIANT";
                    } else {
                        complianceLevel = "NON_COMPLIANT";
                    }
                    serviceComplianceInfo.put("complianceLevel", complianceLevel);
                    
                    totalHipaaProperties += hipaaPropsCount;
                    totalEncryptedHipaaProperties += encryptedHipaaProps;
                    
                    serviceCompliance.add(serviceComplianceInfo);
                }
            }
            
            complianceStatus.put("serviceCompliance", serviceCompliance);
            complianceStatus.put("totalHealthcareServices", healthcareServices.size());
            complianceStatus.put("compliantServices", compliantServices);
            complianceStatus.put("complianceRate", healthcareServices.size() > 0 ? 
                Math.round((double) compliantServices / healthcareServices.size() * 100.0) : 0.0);
            complianceStatus.put("totalHipaaProperties", totalHipaaProperties);
            complianceStatus.put("totalEncryptedHipaaProperties", totalEncryptedHipaaProperties);
            complianceStatus.put("encryptionRate", totalHipaaProperties > 0 ? 
                Math.round((double) totalEncryptedHipaaProperties / totalHipaaProperties * 100.0) : 0.0);
            
            // Add configuration issues related to HIPAA
            @SuppressWarnings("unchecked")
            List<String> configIssues = (List<String>) configStatus.get("configurationIssues");
            List<String> hipaaIssues = configIssues.stream()
                .filter(issue -> issue.toLowerCase().contains("hipaa"))
                .toList();
            complianceStatus.put("hipaaIssues", hipaaIssues);
            
            complianceStatus.put("timestamp", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
            
            return ResponseEntity.ok(complianceStatus);
            
        } catch (Exception e) {
            logger.error("Error retrieving HIPAA compliance status", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to retrieve HIPAA compliance status");
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    /**
     * Get encryption status and metrics
     * 
     * @return Encryption status for sensitive properties across all services
     */
    @GetMapping("/encryption/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getEncryptionStatus() {
        try {
            logger.info("Encryption status requested");
            
            Map<String, Object> configStatus = configurationManagementService.getConfigurationStatus();
            
            Map<String, Object> encryptionStatus = new HashMap<>();
            encryptionStatus.put("encryptionKeyAvailable", configStatus.get("encryptionKeyAvailable"));
            encryptionStatus.put("totalEncryptedProperties", configStatus.get("encryptedPropertiesCount"));
            
            // Analyze encryption across all services
            @SuppressWarnings("unchecked")
            Map<String, Object> serviceMetrics = (Map<String, Object>) configStatus.get("serviceMetrics");
            
            List<Map<String, Object>> serviceEncryption = new ArrayList<>();
            int totalSensitiveProperties = 0;
            int totalEncryptedSensitiveProperties = 0;
            
            for (Map.Entry<String, Object> entry : serviceMetrics.entrySet()) {
                String serviceName = entry.getKey();
                @SuppressWarnings("unchecked")
                Map<String, Object> metrics = (Map<String, Object>) entry.getValue();
                
                Map<String, Object> serviceEncryptionInfo = new HashMap<>();
                serviceEncryptionInfo.put("serviceName", serviceName);
                
                Integer sensitivePropsCount = (Integer) metrics.get("sensitivePropertiesCount");
                Integer encryptedSensitiveProps = (Integer) metrics.get("encryptedSensitiveProperties");
                Boolean isHealthcareService = (Boolean) metrics.get("isHealthcareService");
                
                sensitivePropsCount = sensitivePropsCount != null ? sensitivePropsCount : 0;
                encryptedSensitiveProps = encryptedSensitiveProps != null ? encryptedSensitiveProps : 0;
                isHealthcareService = isHealthcareService != null ? isHealthcareService : false;
                
                serviceEncryptionInfo.put("sensitivePropertiesCount", sensitivePropsCount);
                serviceEncryptionInfo.put("encryptedSensitiveProperties", encryptedSensitiveProps);
                serviceEncryptionInfo.put("isHealthcareService", isHealthcareService);
                
                // Calculate encryption percentage
                double encryptionPercentage = sensitivePropsCount > 0 ? 
                    (double) encryptedSensitiveProps / sensitivePropsCount * 100 : 100.0;
                serviceEncryptionInfo.put("encryptionPercentage", Math.round(encryptionPercentage * 100.0) / 100.0);
                
                // Determine encryption status
                String encryptionLevel;
                if (encryptionPercentage >= 100.0) {
                    encryptionLevel = "FULLY_ENCRYPTED";
                } else if (encryptionPercentage >= 80.0) {
                    encryptionLevel = "MOSTLY_ENCRYPTED";
                } else if (encryptionPercentage >= 50.0) {
                    encryptionLevel = "PARTIALLY_ENCRYPTED";
                } else {
                    encryptionLevel = "UNENCRYPTED";
                }
                serviceEncryptionInfo.put("encryptionLevel", encryptionLevel);
                
                totalSensitiveProperties += sensitivePropsCount;
                totalEncryptedSensitiveProperties += encryptedSensitiveProps;
                
                serviceEncryption.add(serviceEncryptionInfo);
            }
            
            encryptionStatus.put("serviceEncryption", serviceEncryption);
            encryptionStatus.put("totalSensitiveProperties", totalSensitiveProperties);
            encryptionStatus.put("totalEncryptedSensitiveProperties", totalEncryptedSensitiveProperties);
            encryptionStatus.put("overallEncryptionRate", totalSensitiveProperties > 0 ? 
                Math.round((double) totalEncryptedSensitiveProperties / totalSensitiveProperties * 100.0) : 0.0);
            
            encryptionStatus.put("timestamp", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
            
            return ResponseEntity.ok(encryptionStatus);
            
        } catch (Exception e) {
            logger.error("Error retrieving encryption status", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to retrieve encryption status");
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    /**
     * Force configuration refresh for a specific service
     * 
     * @param serviceName Name of the service to refresh
     * @param profile Profile to refresh (optional)
     * @param label Label to refresh (optional)
     * @return Refresh operation result
     */
    @PostMapping("/services/{serviceName}/refresh")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> refreshServiceConfiguration(
            @PathVariable String serviceName,
            @RequestParam(required = false, defaultValue = "default") String profile,
            @RequestParam(required = false, defaultValue = "master") String label) {
        try {
            logger.info("Configuration refresh requested for service: {} - Profile: {} - Label: {}", 
                serviceName, profile, label);
            
            // Trigger configuration refresh by requesting it again
            Environment environment = configurationManagementService.getServiceConfiguration(serviceName, profile, label);
            
            Map<String, Object> refreshResult = new HashMap<>();
            refreshResult.put("serviceName", serviceName);
            refreshResult.put("profile", profile);
            refreshResult.put("label", label);
            refreshResult.put("refreshStatus", "COMPLETED");
            refreshResult.put("propertySourcesCount", environment.getPropertySources().size());
            refreshResult.put("timestamp", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
            
            logger.info("Configuration refresh completed for service: {}", serviceName);
            return ResponseEntity.ok(refreshResult);
            
        } catch (Exception e) {
            logger.error("Error refreshing configuration for service {}", serviceName, e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Configuration refresh failed");
            errorResponse.put("serviceName", serviceName);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    /**
     * Get comprehensive configuration metrics and analytics
     * 
     * @return Detailed metrics about configuration usage and performance
     */
    @GetMapping("/metrics")
    public ResponseEntity<Map<String, Object>> getConfigurationMetrics() {
        try {
            logger.info("Configuration metrics requested");
            
            Map<String, Object> configStatus = configurationManagementService.getConfigurationStatus();
            
            Map<String, Object> metrics = new HashMap<>();
            metrics.put("overview", Map.of(
                "configurationHealthy", configStatus.get("configurationHealthy"),
                "totalConfigRequests", configStatus.get("totalConfigRequests"),
                "encryptedPropertiesCount", configStatus.get("encryptedPropertiesCount"),
                "monitoredServices", configStatus.get("monitoredServices"),
                "lastConfigUpdate", configStatus.get("lastConfigUpdate")
            ));
            
            metrics.put("security", Map.of(
                "encryptionKeyAvailable", configStatus.get("encryptionKeyAvailable"),
                "hipaaComplianceEnabled", configStatus.get("hipaaComplianceEnabled")
            ));
            
            metrics.put("healthcare", Map.of(
                "healthcareServices", configStatus.get("healthcareServices"),
                "configurationIssues", configStatus.get("configurationIssues")
            ));
            
            metrics.put("serviceMetrics", configStatus.get("serviceMetrics"));
            metrics.put("timestamp", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
            
            return ResponseEntity.ok(metrics);
            
        } catch (Exception e) {
            logger.error("Error retrieving configuration metrics", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to retrieve configuration metrics");
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }
}
