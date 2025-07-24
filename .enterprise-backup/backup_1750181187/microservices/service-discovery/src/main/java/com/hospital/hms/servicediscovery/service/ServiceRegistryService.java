package com.hospital.hms.servicediscovery.service;

import com.hospital.hms.servicediscovery.dto.ServiceInstanceDto;
import com.hospital.hms.servicediscovery.dto.ServiceRegistryStatsDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Map;

/**
 * Service Registry Service Interface
 * 
 * Defines business operations for managing the service registry.
 * Provides enterprise-grade functionality for service discovery management.
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
public interface ServiceRegistryService {

    /**
     * Get all registered services with pagination
     */
    Page<ServiceInstanceDto> getAllServices(Pageable pageable);

    /**
     * Get instances for a specific service
     */
    List<ServiceInstanceDto> getServiceInstances(String serviceName);

    /**
     * Get comprehensive registry statistics
     */
    ServiceRegistryStatsDto getRegistryStatistics();

    /**
     * Force deregister a service instance
     */
    void deregisterServiceInstance(String serviceName, String instanceId);

    /**
     * Update service instance status
     */
    void updateInstanceStatus(String serviceName, String instanceId, String status);

    /**
     * Get health summary for all services
     */
    Map<String, Object> getHealthSummary();

    /**
     * Cleanup expired service instances
     */
    Map<String, Integer> cleanupExpiredInstances();

    /**
     * Get current registry configuration
     */
    Map<String, Object> getRegistryConfiguration();

    /**
     * Update registry configuration
     */
    void updateRegistryConfiguration(Map<String, Object> configUpdates);

    /**
     * Get registry events with filtering
     */
    Page<Map<String, Object>> getRegistryEvents(int page, int size, String serviceName, String eventType);

    /**
     * Get service instance by ID
     */
    ServiceInstanceDto getServiceInstance(String serviceName, String instanceId);

    /**
     * Check if service registry is healthy
     */
    boolean isRegistryHealthy();

    /**
     * Get service registry metrics
     */
    Map<String, Object> getRegistryMetrics();

    /**
     * Force refresh registry cache
     */
    void refreshRegistryCache();

    /**
     * Get service dependencies graph
     */
    Map<String, Object> getServiceDependenciesGraph();

    /**
     * Export registry configuration
     */
    Map<String, Object> exportRegistryConfiguration();

    /**
     * Import registry configuration
     */
    void importRegistryConfiguration(Map<String, Object> configuration);
}
