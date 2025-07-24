package com.hospital.hms.servicediscovery.controller;

import com.hospital.hms.servicediscovery.dto.ServiceInstanceDto;
import com.hospital.hms.servicediscovery.dto.ServiceRegistryStatsDto;
import com.hospital.hms.servicediscovery.service.ServiceRegistryService;
import com.netflix.eureka.EurekaServerContextHolder;
import com.netflix.eureka.registry.PeerAwareInstanceRegistry;
import io.micrometer.core.annotation.Timed;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.netflix.eureka.server.EurekaServerContext;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Service Registry Management Controller
 * 
 * Provides REST endpoints for managing and monitoring service registry.
 * Offers enterprise-grade features for service discovery administration.
 * 
 * Features:
 * - Service registration monitoring
 * - Health status tracking
 * - Registry statistics and metrics
 * - Manual service deregistration
 * - Service instance management
 * - Registry cleanup operations
 * - Performance monitoring
 * - Administrative operations
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/registry")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class ServiceRegistryController {

    private final ServiceRegistryService serviceRegistryService;

    /**
     * Get all registered services with their instances
     */
    @GetMapping("/services")
    @Timed(value = "eureka.registry.services.list", description = "Time taken to list all services")
    public ResponseEntity<Page<ServiceInstanceDto>> getAllServices(Pageable pageable) {
        log.info("Fetching all registered services - Page: {}, Size: {}", 
                pageable.getPageNumber(), pageable.getPageSize());
        
        Page<ServiceInstanceDto> services = serviceRegistryService.getAllServices(pageable);
        
        log.info("Retrieved {} services from registry", services.getTotalElements());
        return ResponseEntity.ok(services);
    }

    /**
     * Get specific service instances by service name
     */
    @GetMapping("/services/{serviceName}")
    @Timed(value = "eureka.registry.service.instances", description = "Time taken to get service instances")
    public ResponseEntity<List<ServiceInstanceDto>> getServiceInstances(
            @PathVariable String serviceName) {
        log.info("Fetching instances for service: {}", serviceName);
        
        List<ServiceInstanceDto> instances = serviceRegistryService.getServiceInstances(serviceName);
        
        log.info("Found {} instances for service: {}", instances.size(), serviceName);
        return ResponseEntity.ok(instances);
    }

    /**
     * Get registry statistics and health metrics
     */
    @GetMapping("/stats")
    @Timed(value = "eureka.registry.stats", description = "Time taken to get registry statistics")
    public ResponseEntity<ServiceRegistryStatsDto> getRegistryStats() {
        log.info("Fetching registry statistics");
        
        ServiceRegistryStatsDto stats = serviceRegistryService.getRegistryStatistics();
        
        log.info("Registry stats - Services: {}, Instances: {}, Healthy: {}", 
                stats.getTotalServices(), stats.getTotalInstances(), stats.getHealthyInstances());
        return ResponseEntity.ok(stats);
    }

    /**
     * Force deregister a service instance
     */
    @DeleteMapping("/services/{serviceName}/instances/{instanceId}")
    @Timed(value = "eureka.registry.deregister", description = "Time taken to deregister service instance")
    public ResponseEntity<Void> deregisterServiceInstance(
            @PathVariable String serviceName,
            @PathVariable String instanceId) {
        log.warn("Force deregistering service instance - Service: {}, Instance: {}", serviceName, instanceId);
        
        serviceRegistryService.deregisterServiceInstance(serviceName, instanceId);
        
        log.info("Successfully deregistered service instance - Service: {}, Instance: {}", serviceName, instanceId);
        return ResponseEntity.noContent().build();
    }

    /**
     * Update service instance status
     */
    @PutMapping("/services/{serviceName}/instances/{instanceId}/status")
    @Timed(value = "eureka.registry.status.update", description = "Time taken to update instance status")
    public ResponseEntity<Void> updateInstanceStatus(
            @PathVariable String serviceName,
            @PathVariable String instanceId,
            @RequestParam String status) {
        log.info("Updating service instance status - Service: {}, Instance: {}, Status: {}", 
                serviceName, instanceId, status);
        
        serviceRegistryService.updateInstanceStatus(serviceName, instanceId, status);
        
        log.info("Successfully updated service instance status - Service: {}, Instance: {}, Status: {}", 
                serviceName, instanceId, status);
        return ResponseEntity.ok().build();
    }

    /**
     * Get service health summary
     */
    @GetMapping("/health/summary")
    @Timed(value = "eureka.registry.health.summary", description = "Time taken to get health summary")
    public ResponseEntity<Map<String, Object>> getHealthSummary() {
        log.info("Fetching service health summary");
        
        Map<String, Object> healthSummary = serviceRegistryService.getHealthSummary();
        
        log.info("Retrieved health summary for {} services", healthSummary.size());
        return ResponseEntity.ok(healthSummary);
    }

    /**
     * Cleanup expired service instances
     */
    @PostMapping("/cleanup")
    @Timed(value = "eureka.registry.cleanup", description = "Time taken to cleanup expired instances")
    public ResponseEntity<Map<String, Integer>> cleanupExpiredInstances() {
        log.info("Starting cleanup of expired service instances");
        
        Map<String, Integer> cleanupResults = serviceRegistryService.cleanupExpiredInstances();
        
        log.info("Cleanup completed - Removed {} expired instances", 
                cleanupResults.getOrDefault("removedInstances", 0));
        return ResponseEntity.ok(cleanupResults);
    }

    /**
     * Get registry configuration
     */
    @GetMapping("/config")
    @Timed(value = "eureka.registry.config", description = "Time taken to get registry configuration")
    public ResponseEntity<Map<String, Object>> getRegistryConfiguration() {
        log.info("Fetching registry configuration");
        
        Map<String, Object> config = serviceRegistryService.getRegistryConfiguration();
        
        log.info("Retrieved registry configuration with {} properties", config.size());
        return ResponseEntity.ok(config);
    }

    /**
     * Update registry configuration
     */
    @PutMapping("/config")
    @Timed(value = "eureka.registry.config.update", description = "Time taken to update registry configuration")
    public ResponseEntity<Void> updateRegistryConfiguration(
            @Valid @RequestBody Map<String, Object> configUpdates) {
        log.info("Updating registry configuration with {} properties", configUpdates.size());
        
        serviceRegistryService.updateRegistryConfiguration(configUpdates);
        
        log.info("Successfully updated registry configuration");
        return ResponseEntity.ok().build();
    }

    /**
     * Get service discovery events
     */
    @GetMapping("/events")
    @Timed(value = "eureka.registry.events", description = "Time taken to get registry events")
    public ResponseEntity<Page<Map<String, Object>>> getRegistryEvents(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String serviceName,
            @RequestParam(required = false) String eventType) {
        log.info("Fetching registry events - Page: {}, Size: {}, Service: {}, Event Type: {}", 
                page, size, serviceName, eventType);
        
        Page<Map<String, Object>> events = serviceRegistryService.getRegistryEvents(
                page, size, serviceName, eventType);
        
        log.info("Retrieved {} registry events", events.getTotalElements());
        return ResponseEntity.ok(events);
    }
}
