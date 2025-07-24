package com.hms.servicediscovery.controller;

import com.hms.servicediscovery.service.ServiceRegistryService;
import com.netflix.eureka.EurekaServerContext;
import com.netflix.eureka.EurekaServerContextHolder;
import com.netflix.eureka.registry.PeerAwareInstanceRegistry;
import com.netflix.appinfo.InstanceInfo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.boot.actuate.health.Health;

import java.util.*;
import java.util.stream.Collectors;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * Service Registry Management Controller
 * 
 * Provides REST endpoints for monitoring and managing the
 * HMS service registry. Includes healthcare-specific monitoring
 * capabilities and critical service management.
 * 
 * Endpoints:
 * - GET /registry/status - Overall registry health and status
 * - GET /registry/services - List all registered services
 * - GET /registry/services/{serviceName} - Get specific service details
 * - GET /registry/critical-services - Monitor critical healthcare services
 * - POST /registry/services/{serviceName}/health-check - Force health check
 * - GET /registry/metrics - Comprehensive metrics and analytics
 * - GET /registry/cluster-health - Cluster synchronization status
 */
@RestController
@RequestMapping("/registry")
@CrossOrigin(origins = "*")
public class ServiceRegistryController {

    private static final Logger logger = LoggerFactory.getLogger(ServiceRegistryController.class);

    @Autowired
    private ServiceRegistryService serviceRegistryService;

    /**
     * Get comprehensive registry status and health information
     * 
     * @return Registry status including health, metrics, and service information
     */
    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getRegistryStatus() {
        try {
            logger.info("Registry status requested");
            
            Map<String, Object> status = serviceRegistryService.getRegistryStatus();
            
            // Add Eureka server specific information
            EurekaServerContext serverContext = EurekaServerContextHolder.getInstance().getServerContext();
            if (serverContext != null) {
                PeerAwareInstanceRegistry registry = serverContext.getRegistry();
                status.put("totalInstancesRegistered", registry.getNumOfRenewsInLastMin());
                status.put("renewsPerMinute", registry.getNumOfRenewsPerMinThreshold());
                status.put("serverTime", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
            }
            
            return ResponseEntity.ok(status);
            
        } catch (Exception e) {
            logger.error("Error retrieving registry status", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to retrieve registry status");
            errorResponse.put("message", e.getMessage());
            errorResponse.put("timestamp", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    /**
     * Get list of all registered services with detailed information
     * 
     * @return List of all services with their instances and health status
     */
    @GetMapping("/services")
    public ResponseEntity<Map<String, Object>> getAllServices() {
        try {
            logger.info("All services list requested");
            
            Map<String, Object> response = new HashMap<>();
            List<Map<String, Object>> services = new ArrayList<>();
            
            EurekaServerContext serverContext = EurekaServerContextHolder.getInstance().getServerContext();
            if (serverContext != null) {
                PeerAwareInstanceRegistry registry = serverContext.getRegistry();
                Set<String> allApplications = registry.getAllApplicationNames();
                
                for (String appName : allApplications) {
                    List<InstanceInfo> instances = registry.getInstancesByAppName(appName);
                    
                    Map<String, Object> serviceInfo = new HashMap<>();
                    serviceInfo.put("serviceName", appName.toLowerCase());
                    serviceInfo.put("instanceCount", instances.size());
                    
                    // Calculate health statistics
                    long healthyInstances = instances.stream()
                        .filter(instance -> instance.getStatus() == InstanceInfo.InstanceStatus.UP)
                        .count();
                    
                    serviceInfo.put("healthyInstances", healthyInstances);
                    serviceInfo.put("healthPercentage", instances.isEmpty() ? 0 : 
                        Math.round((double) healthyInstances / instances.size() * 100));
                    
                    // Add instance details
                    List<Map<String, Object>> instanceDetails = instances.stream()
                        .map(this::buildInstanceInfo)
                        .collect(Collectors.toList());
                    
                    serviceInfo.put("instances", instanceDetails);
                    serviceInfo.put("lastUpdated", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
                    
                    services.add(serviceInfo);
                }
                
                response.put("services", services);
                response.put("totalServices", services.size());
                response.put("timestamp", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
                
                return ResponseEntity.ok(response);
            } else {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Eureka server context not available");
                return ResponseEntity.internalServerError().body(errorResponse);
            }
            
        } catch (Exception e) {
            logger.error("Error retrieving services list", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to retrieve services");
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    /**
     * Get detailed information about a specific service
     * 
     * @param serviceName Name of the service to query
     * @return Detailed service information including all instances
     */
    @GetMapping("/services/{serviceName}")
    public ResponseEntity<Map<String, Object>> getServiceDetails(@PathVariable String serviceName) {
        try {
            logger.info("Service details requested for: {}", serviceName);
            
            EurekaServerContext serverContext = EurekaServerContextHolder.getInstance().getServerContext();
            if (serverContext != null) {
                PeerAwareInstanceRegistry registry = serverContext.getRegistry();
                List<InstanceInfo> instances = registry.getInstancesByAppName(serviceName.toUpperCase());
                
                if (instances.isEmpty()) {
                    Map<String, Object> errorResponse = new HashMap<>();
                    errorResponse.put("error", "Service not found");
                    errorResponse.put("serviceName", serviceName);
                    return ResponseEntity.notFound().build();
                }
                
                Map<String, Object> serviceDetails = new HashMap<>();
                serviceDetails.put("serviceName", serviceName.toLowerCase());
                serviceDetails.put("instanceCount", instances.size());
                
                // Health statistics
                long healthyInstances = instances.stream()
                    .filter(instance -> instance.getStatus() == InstanceInfo.InstanceStatus.UP)
                    .count();
                
                serviceDetails.put("healthyInstances", healthyInstances);
                serviceDetails.put("unhealthyInstances", instances.size() - healthyInstances);
                serviceDetails.put("healthPercentage", Math.round((double) healthyInstances / instances.size() * 100));
                
                // Instance details
                List<Map<String, Object>> instanceDetails = instances.stream()
                    .map(this::buildInstanceInfo)
                    .collect(Collectors.toList());
                
                serviceDetails.put("instances", instanceDetails);
                
                // Service metadata aggregation
                Map<String, Object> aggregatedMetadata = aggregateServiceMetadata(instances);
                serviceDetails.put("metadata", aggregatedMetadata);
                
                serviceDetails.put("lastUpdated", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
                
                return ResponseEntity.ok(serviceDetails);
                
            } else {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Eureka server context not available");
                return ResponseEntity.internalServerError().body(errorResponse);
            }
            
        } catch (Exception e) {
            logger.error("Error retrieving service details for {}", serviceName, e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to retrieve service details");
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    /**
     * Monitor critical healthcare services
     * 
     * @return Status of all critical healthcare services
     */
    @GetMapping("/critical-services")
    public ResponseEntity<Map<String, Object>> getCriticalServicesStatus() {
        try {
            logger.info("Critical services status requested");
            
            Map<String, Object> response = new HashMap<>();
            List<Map<String, Object>> criticalServices = new ArrayList<>();
            
            // Define critical healthcare services
            Map<String, String> criticalServiceLevels = Map.of(
                "patient-management", "CRITICAL",
                "emergency-service", "CRITICAL",
                "clinical-documentation", "HIGH",
                "pharmacy-service", "HIGH",
                "billing-service", "MEDIUM",
                "appointment-scheduling", "MEDIUM"
            );
            
            EurekaServerContext serverContext = EurekaServerContextHolder.getInstance().getServerContext();
            if (serverContext != null) {
                PeerAwareInstanceRegistry registry = serverContext.getRegistry();
                
                for (Map.Entry<String, String> entry : criticalServiceLevels.entrySet()) {
                    String serviceName = entry.getKey();
                    String criticalityLevel = entry.getValue();
                    
                    List<InstanceInfo> instances = registry.getInstancesByAppName(serviceName.toUpperCase());
                    
                    Map<String, Object> serviceStatus = new HashMap<>();
                    serviceStatus.put("serviceName", serviceName);
                    serviceStatus.put("criticalityLevel", criticalityLevel);
                    serviceStatus.put("totalInstances", instances.size());
                    
                    long healthyInstances = instances.stream()
                        .filter(instance -> instance.getStatus() == InstanceInfo.InstanceStatus.UP)
                        .count();
                    
                    serviceStatus.put("healthyInstances", healthyInstances);
                    serviceStatus.put("status", healthyInstances > 0 ? "AVAILABLE" : "UNAVAILABLE");
                    serviceStatus.put("healthPercentage", instances.isEmpty() ? 0 : 
                        Math.round((double) healthyInstances / instances.size() * 100));
                    
                    // Risk assessment
                    String riskLevel = assessRiskLevel(criticalityLevel, healthyInstances, instances.size());
                    serviceStatus.put("riskLevel", riskLevel);
                    
                    criticalServices.add(serviceStatus);
                }
                
                // Overall critical services health
                long availableServices = criticalServices.stream()
                    .filter(service -> "AVAILABLE".equals(service.get("status")))
                    .count();
                
                response.put("criticalServices", criticalServices);
                response.put("totalCriticalServices", criticalServices.size());
                response.put("availableServices", availableServices);
                response.put("overallHealth", availableServices == criticalServices.size() ? "HEALTHY" : "AT_RISK");
                response.put("timestamp", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
                
                return ResponseEntity.ok(response);
                
            } else {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Eureka server context not available");
                return ResponseEntity.internalServerError().body(errorResponse);
            }
            
        } catch (Exception e) {
            logger.error("Error retrieving critical services status", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to retrieve critical services status");
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    /**
     * Force health check for a specific service
     * 
     * @param serviceName Name of the service to health check
     * @return Health check results
     */
    @PostMapping("/services/{serviceName}/health-check")
    public ResponseEntity<Map<String, Object>> forceHealthCheck(@PathVariable String serviceName) {
        try {
            logger.info("Forced health check requested for service: {}", serviceName);
            
            EurekaServerContext serverContext = EurekaServerContextHolder.getInstance().getServerContext();
            if (serverContext != null) {
                PeerAwareInstanceRegistry registry = serverContext.getRegistry();
                List<InstanceInfo> instances = registry.getInstancesByAppName(serviceName.toUpperCase());
                
                if (instances.isEmpty()) {
                    Map<String, Object> errorResponse = new HashMap<>();
                    errorResponse.put("error", "Service not found");
                    errorResponse.put("serviceName", serviceName);
                    return ResponseEntity.notFound().build();
                }
                
                Map<String, Object> healthCheckResults = new HashMap<>();
                List<Map<String, Object>> instanceResults = new ArrayList<>();
                
                for (InstanceInfo instance : instances) {
                    Map<String, Object> instanceResult = new HashMap<>();
                    instanceResult.put("instanceId", instance.getInstanceId());
                    instanceResult.put("status", instance.getStatus());
                    instanceResult.put("lastUpdatedTimestamp", new Date(instance.getLastUpdatedTimestamp()));
                    instanceResult.put("lastDirtyTimestamp", new Date(instance.getLastDirtyTimestamp()));
                    
                    // Additional health check details
                    instanceResult.put("homePageUrl", instance.getHomePageUrl());
                    instanceResult.put("healthCheckUrl", instance.getHealthCheckUrl());
                    instanceResult.put("statusPageUrl", instance.getStatusPageUrl());
                    
                    instanceResults.add(instanceResult);
                }
                
                healthCheckResults.put("serviceName", serviceName);
                healthCheckResults.put("totalInstances", instances.size());
                healthCheckResults.put("instances", instanceResults);
                healthCheckResults.put("timestamp", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
                
                return ResponseEntity.ok(healthCheckResults);
                
            } else {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Eureka server context not available");
                return ResponseEntity.internalServerError().body(errorResponse);
            }
            
        } catch (Exception e) {
            logger.error("Error performing health check for service {}", serviceName, e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Health check failed");
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    /**
     * Get comprehensive metrics and analytics
     * 
     * @return Detailed metrics about the service registry
     */
    @GetMapping("/metrics")
    public ResponseEntity<Map<String, Object>> getMetrics() {
        try {
            logger.info("Registry metrics requested");
            
            Map<String, Object> metrics = new HashMap<>();
            
            // Get basic registry metrics from service
            Map<String, Object> registryStatus = serviceRegistryService.getRegistryStatus();
            metrics.putAll(registryStatus);
            
            // Add Eureka-specific metrics
            EurekaServerContext serverContext = EurekaServerContextHolder.getInstance().getServerContext();
            if (serverContext != null) {
                PeerAwareInstanceRegistry registry = serverContext.getRegistry();
                
                Map<String, Object> eurekaMetrics = new HashMap<>();
                eurekaMetrics.put("renewsPerMinute", registry.getNumOfRenewsInLastMin());
                eurekaMetrics.put("renewsThreshold", registry.getNumOfRenewsPerMinThreshold());
                eurekaMetrics.put("selfPreservationMode", registry.isSelfPreservationModeEnabled());
                
                // Calculate service distribution metrics
                Set<String> allServices = registry.getAllApplicationNames();
                Map<String, Integer> serviceInstanceCounts = new HashMap<>();
                
                for (String serviceName : allServices) {
                    List<InstanceInfo> instances = registry.getInstancesByAppName(serviceName);
                    serviceInstanceCounts.put(serviceName.toLowerCase(), instances.size());
                }
                
                eurekaMetrics.put("serviceDistribution", serviceInstanceCounts);
                metrics.put("eurekaMetrics", eurekaMetrics);
            }
            
            // Add performance metrics
            Map<String, Object> performanceMetrics = new HashMap<>();
            Runtime runtime = Runtime.getRuntime();
            performanceMetrics.put("totalMemory", runtime.totalMemory());
            performanceMetrics.put("freeMemory", runtime.freeMemory());
            performanceMetrics.put("usedMemory", runtime.totalMemory() - runtime.freeMemory());
            performanceMetrics.put("maxMemory", runtime.maxMemory());
            performanceMetrics.put("availableProcessors", runtime.availableProcessors());
            
            metrics.put("performanceMetrics", performanceMetrics);
            metrics.put("timestamp", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
            
            return ResponseEntity.ok(metrics);
            
        } catch (Exception e) {
            logger.error("Error retrieving metrics", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to retrieve metrics");
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    /**
     * Get cluster health and synchronization status
     * 
     * @return Cluster health information
     */
    @GetMapping("/cluster-health")
    public ResponseEntity<Map<String, Object>> getClusterHealth() {
        try {
            logger.info("Cluster health status requested");
            
            Map<String, Object> clusterHealth = new HashMap<>();
            
            // Get health status from actuator
            Health health = serviceRegistryService.health();
            clusterHealth.put("status", health.getStatus().getCode());
            clusterHealth.put("details", health.getDetails());
            
            // Add cluster-specific information
            EurekaServerContext serverContext = EurekaServerContextHolder.getInstance().getServerContext();
            if (serverContext != null) {
                PeerAwareInstanceRegistry registry = serverContext.getRegistry();
                
                clusterHealth.put("selfPreservationMode", registry.isSelfPreservationModeEnabled());
                clusterHealth.put("renewsPerMinute", registry.getNumOfRenewsInLastMin());
                clusterHealth.put("expectedRenewsPerMin", registry.getNumOfRenewsPerMinThreshold());
                
                // Calculate cluster sync status
                boolean syncHealthy = registry.getNumOfRenewsInLastMin() >= registry.getNumOfRenewsPerMinThreshold();
                clusterHealth.put("synchronizationHealthy", syncHealthy);
            }
            
            clusterHealth.put("timestamp", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
            
            return ResponseEntity.ok(clusterHealth);
            
        } catch (Exception e) {
            logger.error("Error retrieving cluster health", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to retrieve cluster health");
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    /**
     * Build detailed instance information
     */
    private Map<String, Object> buildInstanceInfo(InstanceInfo instance) {
        Map<String, Object> instanceInfo = new HashMap<>();
        instanceInfo.put("instanceId", instance.getInstanceId());
        instanceInfo.put("hostName", instance.getHostName());
        instanceInfo.put("ipAddr", instance.getIPAddr());
        instanceInfo.put("port", instance.getPort());
        instanceInfo.put("status", instance.getStatus());
        instanceInfo.put("healthCheckUrl", instance.getHealthCheckUrl());
        instanceInfo.put("statusPageUrl", instance.getStatusPageUrl());
        instanceInfo.put("homePageUrl", instance.getHomePageUrl());
        instanceInfo.put("lastUpdated", new Date(instance.getLastUpdatedTimestamp()));
        instanceInfo.put("metadata", instance.getMetadata());
        
        return instanceInfo;
    }

    /**
     * Aggregate metadata from multiple service instances
     */
    private Map<String, Object> aggregateServiceMetadata(List<InstanceInfo> instances) {
        Map<String, Object> aggregated = new HashMap<>();
        
        // Collect unique metadata keys and values
        Set<String> allKeys = instances.stream()
            .flatMap(instance -> instance.getMetadata().keySet().stream())
            .collect(Collectors.toSet());
        
        for (String key : allKeys) {
            Set<String> values = instances.stream()
                .map(instance -> instance.getMetadata().get(key))
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());
            
            if (values.size() == 1) {
                aggregated.put(key, values.iterator().next());
            } else {
                aggregated.put(key, values);
            }
        }
        
        return aggregated;
    }

    /**
     * Assess risk level based on service criticality and health
     */
    private String assessRiskLevel(String criticalityLevel, long healthyInstances, int totalInstances) {
        if (healthyInstances == 0) {
            return "CRITICAL";
        }
        
        double healthPercentage = (double) healthyInstances / totalInstances;
        
        switch (criticalityLevel) {
            case "CRITICAL":
                if (healthPercentage < 0.5) return "HIGH";
                if (healthPercentage < 0.8) return "MEDIUM";
                return "LOW";
            case "HIGH":
                if (healthPercentage < 0.3) return "HIGH";
                if (healthPercentage < 0.6) return "MEDIUM";
                return "LOW";
            default:
                if (healthPercentage < 0.2) return "MEDIUM";
                return "LOW";
        }
    }
}
