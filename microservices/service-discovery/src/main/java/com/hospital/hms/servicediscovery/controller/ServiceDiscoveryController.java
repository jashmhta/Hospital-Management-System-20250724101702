package com.hospital.hms.servicediscovery.controller;

import com.hospital.hms.servicediscovery.dto.ServiceRegistryDto;
import com.hospital.hms.servicediscovery.dto.ServiceMetadataDto;
import com.hospital.hms.servicediscovery.dto.ServiceEventDto;
import com.hospital.hms.servicediscovery.service.ServiceDiscoveryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import java.util.List;
import java.util.Map;

/**
 * Service Discovery REST Controller
 * 
 * Provides comprehensive REST API for service discovery, registration,
 * health monitoring, and load balancing operations.
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/service-discovery")
@RequiredArgsConstructor
@Validated
@CrossOrigin(origins = "*", maxAge = 3600)
public class ServiceDiscoveryController {

    private final ServiceDiscoveryService serviceDiscoveryService;

    /**
     * Register a new service with the discovery server
     */
    @PostMapping("/services")
    @PreAuthorize("hasAuthority('SERVICE_ADMIN')")
    public ResponseEntity<ServiceRegistryDto> registerService(
            @Valid @RequestBody ServiceRegistryDto serviceDto) {
        try {
            log.info("Registering new service: {}", serviceDto.getServiceName());
            ServiceRegistryDto registeredService = serviceDiscoveryService.registerService(serviceDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(registeredService);
        } catch (Exception e) {
            log.error("Error registering service: {}", serviceDto.getServiceName(), e);
            throw e;
        }
    }

    /**
     * Unregister a service from discovery
     */
    @DeleteMapping("/services/{serviceId}")
    @PreAuthorize("hasAuthority('SERVICE_ADMIN')")
    public ResponseEntity<Void> unregisterService(
            @PathVariable @NotBlank String serviceId) {
        try {
            log.info("Unregistering service: {}", serviceId);
            serviceDiscoveryService.unregisterService(serviceId);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            log.error("Error unregistering service: {}", serviceId, e);
            throw e;
        }
    }

    /**
     * Get all registered services
     */
    @GetMapping("/services")
    @PreAuthorize("hasAuthority('SERVICE_READ')")
    public ResponseEntity<Page<ServiceRegistryDto>> getAllServices(Pageable pageable) {
        try {
            log.debug("Retrieving all registered services");
            Page<ServiceRegistryDto> services = serviceDiscoveryService.getAllServices(pageable);
            return ResponseEntity.ok(services);
        } catch (Exception e) {
            log.error("Error retrieving services", e);
            throw e;
        }
    }

    /**
     * Get service by ID
     */
    @GetMapping("/services/{serviceId}")
    @PreAuthorize("hasAuthority('SERVICE_READ')")
    public ResponseEntity<ServiceRegistryDto> getServiceById(
            @PathVariable @NotBlank String serviceId) {
        try {
            log.debug("Retrieving service: {}", serviceId);
            ServiceRegistryDto service = serviceDiscoveryService.getServiceById(serviceId);
            return ResponseEntity.ok(service);
        } catch (Exception e) {
            log.error("Error retrieving service: {}", serviceId, e);
            throw e;
        }
    }

    /**
     * Discover services by name
     */
    @GetMapping("/discover/{serviceName}")
    @PreAuthorize("hasAuthority('SERVICE_READ')")
    public ResponseEntity<List<ServiceRegistryDto>> discoverServices(
            @PathVariable @NotBlank String serviceName) {
        try {
            log.debug("Discovering services: {}", serviceName);
            List<ServiceRegistryDto> services = serviceDiscoveryService.discoverServices(serviceName);
            return ResponseEntity.ok(services);
        } catch (Exception e) {
            log.error("Error discovering services: {}", serviceName, e);
            throw e;
        }
    }

    /**
     * Update service health status
     */
    @PutMapping("/services/{serviceId}/health")
    @PreAuthorize("hasAuthority('SERVICE_WRITE')")
    public ResponseEntity<ServiceRegistryDto> updateServiceHealth(
            @PathVariable @NotBlank String serviceId,
            @RequestParam String status) {
        try {
            log.debug("Updating health status for service: {} to {}", serviceId, status);
            ServiceRegistryDto updatedService = serviceDiscoveryService.updateServiceHealth(serviceId, status);
            return ResponseEntity.ok(updatedService);
        } catch (Exception e) {
            log.error("Error updating service health: {}", serviceId, e);
            throw e;
        }
    }

    /**
     * Get service health check
     */
    @GetMapping("/services/{serviceId}/health")
    @PreAuthorize("hasAuthority('SERVICE_READ')")
    public ResponseEntity<Map<String, Object>> getServiceHealth(
            @PathVariable @NotBlank String serviceId) {
        try {
            log.debug("Checking health for service: {}", serviceId);
            Map<String, Object> healthStatus = serviceDiscoveryService.checkServiceHealth(serviceId);
            return ResponseEntity.ok(healthStatus);
        } catch (Exception e) {
            log.error("Error checking service health: {}", serviceId, e);
            throw e;
        }
    }

    /**
     * Get service metadata
     */
    @GetMapping("/services/{serviceId}/metadata")
    @PreAuthorize("hasAuthority('SERVICE_READ')")
    public ResponseEntity<List<ServiceMetadataDto>> getServiceMetadata(
            @PathVariable @NotBlank String serviceId) {
        try {
            log.debug("Retrieving metadata for service: {}", serviceId);
            List<ServiceMetadataDto> metadata = serviceDiscoveryService.getServiceMetadata(serviceId);
            return ResponseEntity.ok(metadata);
        } catch (Exception e) {
            log.error("Error retrieving service metadata: {}", serviceId, e);
            throw e;
        }
    }

    /**
     * Update service metadata
     */
    @PutMapping("/services/{serviceId}/metadata")
    @PreAuthorize("hasAuthority('SERVICE_WRITE')")
    public ResponseEntity<ServiceMetadataDto> updateServiceMetadata(
            @PathVariable @NotBlank String serviceId,
            @Valid @RequestBody ServiceMetadataDto metadataDto) {
        try {
            log.info("Updating metadata for service: {}", serviceId);
            ServiceMetadataDto updatedMetadata = serviceDiscoveryService.updateServiceMetadata(serviceId, metadataDto);
            return ResponseEntity.ok(updatedMetadata);
        } catch (Exception e) {
            log.error("Error updating service metadata: {}", serviceId, e);
            throw e;
        }
    }

    /**
     * Get service events
     */
    @GetMapping("/services/{serviceId}/events")
    @PreAuthorize("hasAuthority('SERVICE_READ')")
    public ResponseEntity<Page<ServiceEventDto>> getServiceEvents(
            @PathVariable @NotBlank String serviceId,
            Pageable pageable) {
        try {
            log.debug("Retrieving events for service: {}", serviceId);
            Page<ServiceEventDto> events = serviceDiscoveryService.getServiceEvents(serviceId, pageable);
            return ResponseEntity.ok(events);
        } catch (Exception e) {
            log.error("Error retrieving service events: {}", serviceId, e);
            throw e;
        }
    }

    /**
     * Get load balancing information
     */
    @GetMapping("/load-balancer/{serviceName}")
    @PreAuthorize("hasAuthority('SERVICE_READ')")
    public ResponseEntity<ServiceRegistryDto> getLoadBalancedService(
            @PathVariable @NotBlank String serviceName,
            @RequestParam(defaultValue = "ROUND_ROBIN") String algorithm) {
        try {
            log.debug("Getting load balanced service: {} with algorithm: {}", serviceName, algorithm);
            ServiceRegistryDto service = serviceDiscoveryService.getLoadBalancedService(serviceName, algorithm);
            return ResponseEntity.ok(service);
        } catch (Exception e) {
            log.error("Error getting load balanced service: {}", serviceName, e);
            throw e;
        }
    }

    /**
     * Get discovery server statistics
     */
    @GetMapping("/statistics")
    @PreAuthorize("hasAuthority('SERVICE_ADMIN')")
    public ResponseEntity<Map<String, Object>> getDiscoveryStatistics() {
        try {
            log.debug("Retrieving discovery server statistics");
            Map<String, Object> statistics = serviceDiscoveryService.getDiscoveryStatistics();
            return ResponseEntity.ok(statistics);
        } catch (Exception e) {
            log.error("Error retrieving discovery statistics", e);
            throw e;
        }
    }

    /**
     * Perform service discovery health check
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        try {
            Map<String, Object> health = serviceDiscoveryService.performHealthCheck();
            return ResponseEntity.ok(health);
        } catch (Exception e) {
            log.error("Error performing health check", e);
            throw e;
        }
    }

    /**
     * Refresh service registry
     */
    @PostMapping("/refresh")
    @PreAuthorize("hasAuthority('SERVICE_ADMIN')")
    public ResponseEntity<Map<String, Object>> refreshRegistry() {
        try {
            log.info("Refreshing service registry");
            Map<String, Object> result = serviceDiscoveryService.refreshServiceRegistry();
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("Error refreshing service registry", e);
            throw e;
        }
    }
}
