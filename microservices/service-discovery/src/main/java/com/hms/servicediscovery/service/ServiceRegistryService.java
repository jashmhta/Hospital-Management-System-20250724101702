package com.hms.servicediscovery.service;

import com.netflix.eureka.EurekaServerContext;
import com.netflix.eureka.EurekaServerContextHolder;
import com.netflix.eureka.registry.PeerAwareInstanceRegistry;
import com.netflix.appinfo.InstanceInfo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.netflix.eureka.server.event.EurekaInstanceRegisteredEvent;
import org.springframework.cloud.netflix.eureka.server.event.EurekaInstanceCanceledEvent;
import org.springframework.cloud.netflix.eureka.server.event.EurekaServerStartedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;

import jakarta.annotation.PostConstruct;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * Service Registry Management Service
 * 
 * Provides comprehensive monitoring and management capabilities for
 * the Eureka service registry including:
 * - Service health monitoring
 * - Registration/deregistration tracking
 * - Performance metrics collection
 * - Cluster synchronization monitoring
 * - Healthcare service-specific validations
 * 
 * This service ensures high availability and reliability of the
 * service discovery infrastructure for the HMS ecosystem.
 */
@Service
public class ServiceRegistryService implements HealthIndicator {

    private static final Logger logger = LoggerFactory.getLogger(ServiceRegistryService.class);
    
    // Service metrics tracking
    private final AtomicInteger totalRegistrations = new AtomicInteger(0);
    private final AtomicInteger totalCancellations = new AtomicInteger(0);
    private final AtomicLong lastHeartbeat = new AtomicLong(System.currentTimeMillis());
    private final Map<String, ServiceMetrics> serviceMetrics = new ConcurrentHashMap<>();
    private final Map<String, LocalDateTime> serviceRegistrationTimes = new ConcurrentHashMap<>();
    
    // Healthcare service criticality levels
    private static final Map<String, String> CRITICAL_SERVICES = Map.of(
        "patient-management", "CRITICAL",
        "emergency-service", "CRITICAL", 
        "clinical-documentation", "HIGH",
        "pharmacy-service", "HIGH",
        "billing-service", "MEDIUM",
        "appointment-scheduling", "MEDIUM",
        "analytics-service", "LOW"
    );
    
    // Cluster health monitoring
    private boolean clusterHealthy = true;
    private List<String> clusterIssues = new ArrayList<>();
    
    @PostConstruct
    public void init() {
        logger.info("=== HMS Service Registry Service Initialized ===");
        logger.info("Critical Healthcare Services Monitoring: {}", CRITICAL_SERVICES.keySet());
        logger.info("Service Discovery Health Monitoring: ENABLED");
        logger.info("Cluster Synchronization Monitoring: ENABLED");
    }

    /**
     * Handle service registration events
     * Tracks registration metrics and validates healthcare service requirements
     */
    @EventListener
    public void handleServiceRegistration(EurekaInstanceRegisteredEvent event) {
        InstanceInfo instanceInfo = event.getInstanceInfo();
        String serviceName = instanceInfo.getAppName().toLowerCase();
        String instanceId = instanceInfo.getInstanceId();
        
        totalRegistrations.incrementAndGet();
        serviceRegistrationTimes.put(instanceId, LocalDateTime.now());
        
        // Update service metrics
        ServiceMetrics metrics = serviceMetrics.computeIfAbsent(serviceName, k -> new ServiceMetrics());
        metrics.incrementRegistrations();
        metrics.setLastRegistration(LocalDateTime.now());
        
        // Validate healthcare service requirements
        validateHealthcareServiceRegistration(instanceInfo);
        
        logger.info("Healthcare Service Registered: {} [{}] - Status: {} - Critical Level: {}", 
            serviceName, instanceId, instanceInfo.getStatus(),
            CRITICAL_SERVICES.getOrDefault(serviceName, "STANDARD"));
        
        // Check for critical service availability
        if (CRITICAL_SERVICES.containsKey(serviceName)) {
            checkCriticalServiceHealth(serviceName);
        }
        
        // Update cluster health
        updateClusterHealth();
    }

    /**
     * Handle service cancellation/deregistration events
     */
    @EventListener
    public void handleServiceCancellation(EurekaInstanceCanceledEvent event) {
        String serviceName = event.getAppName().toLowerCase();
        String serverId = event.getServerId();
        
        totalCancellations.incrementAndGet();
        serviceRegistrationTimes.remove(serverId);
        
        // Update service metrics
        ServiceMetrics metrics = serviceMetrics.get(serviceName);
        if (metrics != null) {
            metrics.incrementCancellations();
            metrics.setLastCancellation(LocalDateTime.now());
        }
        
        logger.warn("Healthcare Service Deregistered: {} [{}] - Critical Level: {}", 
            serviceName, serverId, CRITICAL_SERVICES.getOrDefault(serviceName, "STANDARD"));
        
        // Alert if critical service goes down
        if (CRITICAL_SERVICES.containsKey(serviceName)) {
            handleCriticalServiceDown(serviceName, serverId);
        }
        
        // Update cluster health
        updateClusterHealth();
    }

    /**
     * Handle Eureka server startup
     */
    @EventListener
    public void handleServerStartup(EurekaServerStartedEvent event) {
        logger.info("=== HMS Eureka Server Started Successfully ===");
        logger.info("Healthcare Service Discovery Ready");
        logger.info("Monitoring {} critical healthcare services", CRITICAL_SERVICES.size());
        
        // Initialize cluster health monitoring
        scheduleClusterHealthCheck();
    }

    /**
     * Validate healthcare service registration requirements
     */
    private void validateHealthcareServiceRegistration(InstanceInfo instanceInfo) {
        String serviceName = instanceInfo.getAppName().toLowerCase();
        Map<String, String> metadata = instanceInfo.getMetadata();
        
        // Validate required metadata for healthcare services
        List<String> missingMetadata = new ArrayList<>();
        
        if (!metadata.containsKey("environment")) {
            missingMetadata.add("environment");
        }
        
        if (!metadata.containsKey("version")) {
            missingMetadata.add("version");
        }
        
        if (CRITICAL_SERVICES.containsKey(serviceName)) {
            // Additional validation for critical services
            if (!metadata.containsKey("health-check-url")) {
                missingMetadata.add("health-check-url");
            }
            
            if (!metadata.containsKey("hipaa-compliant")) {
                missingMetadata.add("hipaa-compliant");
            }
            
            if (!metadata.containsKey("security-level")) {
                missingMetadata.add("security-level");
            }
        }
        
        if (!missingMetadata.isEmpty()) {
            logger.warn("Healthcare Service {} missing required metadata: {}", 
                serviceName, missingMetadata);
        }
        
        // Validate HIPAA compliance for healthcare services
        if (metadata.containsKey("hipaa-compliant") && 
            !"true".equals(metadata.get("hipaa-compliant"))) {
            logger.error("CRITICAL: Healthcare Service {} is not HIPAA compliant!", serviceName);
        }
    }

    /**
     * Check critical service health and availability
     */
    private void checkCriticalServiceHealth(String serviceName) {
        EurekaServerContext serverContext = EurekaServerContextHolder.getInstance().getServerContext();
        if (serverContext != null) {
            PeerAwareInstanceRegistry registry = serverContext.getRegistry();
            List<InstanceInfo> instances = registry.getInstancesByAppName(serviceName.toUpperCase());
            
            long healthyInstances = instances.stream()
                .filter(instance -> instance.getStatus() == InstanceInfo.InstanceStatus.UP)
                .count();
            
            logger.info("Critical Healthcare Service {} - Healthy Instances: {}/{}", 
                serviceName, healthyInstances, instances.size());
            
            // Alert if no healthy instances for critical service
            if (healthyInstances == 0 && !instances.isEmpty()) {
                logger.error("ALERT: Critical Healthcare Service {} has NO healthy instances!", serviceName);
                handleCriticalServiceFailure(serviceName);
            }
        }
    }

    /**
     * Handle critical service failure
     */
    private void handleCriticalServiceFailure(String serviceName) {
        String criticality = CRITICAL_SERVICES.get(serviceName);
        
        logger.error("=== CRITICAL HEALTHCARE SERVICE FAILURE ===");
        logger.error("Service: {} - Criticality: {}", serviceName, criticality);
        logger.error("Immediate attention required for patient safety!");
        
        // Add to cluster issues
        clusterIssues.add(String.format("Critical service %s is down - Criticality: %s", 
            serviceName, criticality));
        
        clusterHealthy = false;
        
        // TODO: Integrate with alerting system (Slack, email, SMS)
        // TODO: Trigger automated failover procedures if available
    }

    /**
     * Handle critical service going down
     */
    private void handleCriticalServiceDown(String serviceName, String instanceId) {
        String criticality = CRITICAL_SERVICES.get(serviceName);
        
        if ("CRITICAL".equals(criticality)) {
            logger.error("ALERT: Critical Healthcare Service instance down - {} [{}]", 
                serviceName, instanceId);
            
            // Check if any instances are still available
            checkCriticalServiceHealth(serviceName);
        }
    }

    /**
     * Scheduled cluster health monitoring
     */
    @Scheduled(fixedRate = 30000) // Every 30 seconds
    public void monitorClusterHealth() {
        try {
            updateClusterHealth();
            monitorServiceMetrics();
            checkServiceAvailability();
            logHealthMetrics();
        } catch (Exception e) {
            logger.error("Error during cluster health monitoring", e);
        }
    }

    /**
     * Update overall cluster health status
     */
    private void updateClusterHealth() {
        clusterIssues.clear();
        clusterHealthy = true;
        
        // Check critical services availability
        for (String criticalService : CRITICAL_SERVICES.keySet()) {
            if (!isServiceAvailable(criticalService)) {
                clusterIssues.add("Critical service unavailable: " + criticalService);
                clusterHealthy = false;
            }
        }
        
        // Check Eureka server health
        EurekaServerContext serverContext = EurekaServerContextHolder.getInstance().getServerContext();
        if (serverContext == null) {
            clusterIssues.add("Eureka server context unavailable");
            clusterHealthy = false;
        }
        
        lastHeartbeat.set(System.currentTimeMillis());
    }

    /**
     * Check if a service is available
     */
    private boolean isServiceAvailable(String serviceName) {
        try {
            EurekaServerContext serverContext = EurekaServerContextHolder.getInstance().getServerContext();
            if (serverContext != null) {
                PeerAwareInstanceRegistry registry = serverContext.getRegistry();
                List<InstanceInfo> instances = registry.getInstancesByAppName(serviceName.toUpperCase());
                
                return instances.stream()
                    .anyMatch(instance -> instance.getStatus() == InstanceInfo.InstanceStatus.UP);
            }
        } catch (Exception e) {
            logger.error("Error checking service availability for {}", serviceName, e);
        }
        return false;
    }

    /**
     * Monitor service-specific metrics
     */
    private void monitorServiceMetrics() {
        for (Map.Entry<String, ServiceMetrics> entry : serviceMetrics.entrySet()) {
            String serviceName = entry.getKey();
            ServiceMetrics metrics = entry.getValue();
            
            // Calculate service uptime
            long uptime = metrics.calculateUptime();
            
            // Check for service instability (frequent registrations/cancellations)
            if (metrics.getRegistrations() > 10 && 
                metrics.getCancellations() > metrics.getRegistrations() * 0.5) {
                logger.warn("Service {} shows instability - Registrations: {}, Cancellations: {}", 
                    serviceName, metrics.getRegistrations(), metrics.getCancellations());
            }
            
            // Log metrics for critical services
            if (CRITICAL_SERVICES.containsKey(serviceName)) {
                logger.debug("Critical Service Metrics - {}: Registrations={}, Cancellations={}, Uptime={}ms", 
                    serviceName, metrics.getRegistrations(), metrics.getCancellations(), uptime);
            }
        }
    }

    /**
     * Check availability of all registered services
     */
    private void checkServiceAvailability() {
        try {
            EurekaServerContext serverContext = EurekaServerContextHolder.getInstance().getServerContext();
            if (serverContext != null) {
                PeerAwareInstanceRegistry registry = serverContext.getRegistry();
                Set<String> allServices = registry.getAllApplicationNames();
                
                for (String serviceName : allServices) {
                    List<InstanceInfo> instances = registry.getInstancesByAppName(serviceName);
                    long healthyCount = instances.stream()
                        .filter(instance -> instance.getStatus() == InstanceInfo.InstanceStatus.UP)
                        .count();
                    
                    if (healthyCount == 0 && CRITICAL_SERVICES.containsKey(serviceName.toLowerCase())) {
                        logger.error("Critical healthcare service {} has no healthy instances!", serviceName);
                    }
                }
            }
        } catch (Exception e) {
            logger.error("Error checking service availability", e);
        }
    }

    /**
     * Log comprehensive health metrics
     */
    private void logHealthMetrics() {
        if (logger.isInfoEnabled()) {
            logger.info("=== HMS Service Registry Health Status ===");
            logger.info("Cluster Healthy: {}", clusterHealthy);
            logger.info("Total Registrations: {}", totalRegistrations.get());
            logger.info("Total Cancellations: {}", totalCancellations.get());
            logger.info("Active Services: {}", serviceMetrics.size());
            logger.info("Critical Services Monitored: {}", CRITICAL_SERVICES.size());
            
            if (!clusterHealthy && !clusterIssues.isEmpty()) {
                logger.warn("Cluster Issues: {}", clusterIssues);
            }
        }
    }

    /**
     * Schedule cluster health checks
     */
    private void scheduleClusterHealthCheck() {
        logger.info("Cluster health monitoring scheduled - Interval: 30 seconds");
        logger.info("Critical service monitoring enabled for: {}", CRITICAL_SERVICES.keySet());
    }

    /**
     * Get comprehensive service registry status
     */
    public Map<String, Object> getRegistryStatus() {
        Map<String, Object> status = new HashMap<>();
        status.put("clusterHealthy", clusterHealthy);
        status.put("totalRegistrations", totalRegistrations.get());
        status.put("totalCancellations", totalCancellations.get());
        status.put("activeServices", serviceMetrics.size());
        status.put("lastHeartbeat", new Date(lastHeartbeat.get()));
        status.put("clusterIssues", new ArrayList<>(clusterIssues));
        status.put("criticalServices", CRITICAL_SERVICES);
        
        // Add detailed service metrics
        Map<String, Object> detailedMetrics = new HashMap<>();
        for (Map.Entry<String, ServiceMetrics> entry : serviceMetrics.entrySet()) {
            ServiceMetrics metrics = entry.getValue();
            Map<String, Object> serviceInfo = new HashMap<>();
            serviceInfo.put("registrations", metrics.getRegistrations());
            serviceInfo.put("cancellations", metrics.getCancellations());
            serviceInfo.put("lastRegistration", metrics.getLastRegistration());
            serviceInfo.put("lastCancellation", metrics.getLastCancellation());
            serviceInfo.put("uptime", metrics.calculateUptime());
            serviceInfo.put("criticalityLevel", CRITICAL_SERVICES.getOrDefault(entry.getKey(), "STANDARD"));
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
        Health.Builder builder = clusterHealthy ? Health.up() : Health.down();
        
        builder.withDetail("totalRegistrations", totalRegistrations.get())
               .withDetail("totalCancellations", totalCancellations.get())
               .withDetail("activeServices", serviceMetrics.size())
               .withDetail("lastHeartbeat", new Date(lastHeartbeat.get()))
               .withDetail("criticalServicesCount", CRITICAL_SERVICES.size());
        
        if (!clusterHealthy) {
            builder.withDetail("issues", clusterIssues);
        }
        
        return builder.build();
    }

    /**
     * Inner class to track service-specific metrics
     */
    private static class ServiceMetrics {
        private final AtomicInteger registrations = new AtomicInteger(0);
        private final AtomicInteger cancellations = new AtomicInteger(0);
        private LocalDateTime lastRegistration;
        private LocalDateTime lastCancellation;
        private final LocalDateTime creationTime = LocalDateTime.now();
        
        public void incrementRegistrations() {
            registrations.incrementAndGet();
        }
        
        public void incrementCancellations() {
            cancellations.incrementAndGet();
        }
        
        public int getRegistrations() {
            return registrations.get();
        }
        
        public int getCancellations() {
            return cancellations.get();
        }
        
        public LocalDateTime getLastRegistration() {
            return lastRegistration;
        }
        
        public void setLastRegistration(LocalDateTime lastRegistration) {
            this.lastRegistration = lastRegistration;
        }
        
        public LocalDateTime getLastCancellation() {
            return lastCancellation;
        }
        
        public void setLastCancellation(LocalDateTime lastCancellation) {
            this.lastCancellation = lastCancellation;
        }
        
        public long calculateUptime() {
            return java.time.Duration.between(creationTime, LocalDateTime.now()).toMillis();
        }
    }
}
