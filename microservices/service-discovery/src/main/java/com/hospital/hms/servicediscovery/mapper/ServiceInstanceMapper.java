package com.hospital.hms.servicediscovery.mapper;

import com.hospital.hms.servicediscovery.dto.ServiceInstanceDto;
import com.netflix.appinfo.InstanceInfo;
import com.netflix.appinfo.LeaseInfo;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Service Instance Mapper
 * 
 * Maps between Netflix Eureka InstanceInfo and Service Instance DTOs.
 * Provides comprehensive mapping of all instance properties and metadata.
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Component
public class ServiceInstanceMapper {

    /**
     * Convert Netflix InstanceInfo to ServiceInstanceDto
     */
    public ServiceInstanceDto toDto(InstanceInfo instanceInfo) {
        if (instanceInfo == null) {
            return null;
        }

        ServiceInstanceDto.ServiceInstanceDtoBuilder builder = ServiceInstanceDto.builder()
                .instanceId(instanceInfo.getInstanceId())
                .serviceName(instanceInfo.getAppName().toLowerCase())
                .hostName(instanceInfo.getHostName())
                .ipAddress(instanceInfo.getIPAddr())
                .port(instanceInfo.getPort())
                .securePort(instanceInfo.getSecurePort())
                .status(instanceInfo.getStatus() != null ? instanceInfo.getStatus().name() : "UNKNOWN")
                .healthStatus(determineHealthStatus(instanceInfo))
                .healthy(isInstanceHealthy(instanceInfo))
                .homePageUrl(instanceInfo.getHomePageUrl())
                .statusPageUrl(instanceInfo.getStatusPageUrl())
                .healthCheckUrl(instanceInfo.getHealthCheckUrl())
                .vipAddress(instanceInfo.getVIPAddress())
                .secureVipAddress(instanceInfo.getSecureVIPAddress())
                .dataCenterInfo(instanceInfo.getDataCenterInfo() != null ? 
                        instanceInfo.getDataCenterInfo().getName().name() : "UNKNOWN")
                .securePortEnabled(instanceInfo.isPortEnabled(InstanceInfo.PortType.SECURE))
                .nonSecurePortEnabled(instanceInfo.isPortEnabled(InstanceInfo.PortType.UNSECURE))
                .version(getMetadataValue(instanceInfo, "version"))
                .buildInfo(getMetadataValue(instanceInfo, "buildInfo"))
                .metadata(instanceInfo.getMetadata() != null ? 
                        new HashMap<>(instanceInfo.getMetadata()) : Collections.emptyMap())
                .environment(getMetadataValue(instanceInfo, "environment"))
                .zone(getMetadataValue(instanceInfo, "zone"));

        // Set timestamps
        if (instanceInfo.getLeaseInfo() != null) {
            LeaseInfo leaseInfo = instanceInfo.getLeaseInfo();
            
            if (leaseInfo.getRegistrationTimestamp() > 0) {
                builder.registrationTime(timestampToLocalDateTime(leaseInfo.getRegistrationTimestamp()));
            }
            
            if (leaseInfo.getLastRenewalTimestamp() > 0) {
                builder.lastHeartbeat(timestampToLocalDateTime(leaseInfo.getLastRenewalTimestamp()));
            }

            // Calculate uptime
            if (leaseInfo.getServiceUpTimestamp() > 0) {
                long uptimeMs = System.currentTimeMillis() - leaseInfo.getServiceUpTimestamp();
                builder.uptimeInMs(uptimeMs);
            }

            // Set lease information
            builder.leaseInfo(mapLeaseInfo(leaseInfo));
        }

        // Set performance metrics (placeholder - would need actual metrics collection)
        Map<String, Object> metrics = new HashMap<>();
        metrics.put("cpu_usage", 0.0);
        metrics.put("memory_usage", 0.0);
        metrics.put("disk_usage", 0.0);
        metrics.put("network_io", 0.0);
        builder.metrics(metrics);

        // Set dependencies (would need to be tracked separately)
        builder.dependencies(Collections.emptyList());

        // Set tags (extract from metadata)
        builder.tags(extractTags(instanceInfo));

        return builder.build();
    }

    /**
     * Map LeaseInfo to LeaseInfoDto
     */
    private ServiceInstanceDto.LeaseInfoDto mapLeaseInfo(LeaseInfo leaseInfo) {
        if (leaseInfo == null) {
            return null;
        }

        return ServiceInstanceDto.LeaseInfoDto.builder()
                .renewalIntervalInSecs(leaseInfo.getRenewalIntervalInSecs())
                .durationInSecs(leaseInfo.getDurationInSecs())
                .registrationTimestamp(timestampToLocalDateTime(leaseInfo.getRegistrationTimestamp()))
                .lastRenewalTimestamp(timestampToLocalDateTime(leaseInfo.getLastRenewalTimestamp()))
                .evictionTimestamp(leaseInfo.getEvictionTimestamp() > 0 ? 
                        timestampToLocalDateTime(leaseInfo.getEvictionTimestamp()) : null)
                .serviceUpTimestamp(leaseInfo.getServiceUpTimestamp() > 0 ? 
                        timestampToLocalDateTime(leaseInfo.getServiceUpTimestamp()) : null)
                .build();
    }

    /**
     * Determine health status based on instance information
     */
    private String determineHealthStatus(InstanceInfo instanceInfo) {
        if (instanceInfo.getStatus() == InstanceInfo.InstanceStatus.UP) {
            // Check if instance is responding to health checks
            if (isHealthCheckResponsePositive(instanceInfo)) {
                return "HEALTHY";
            } else {
                return "UNHEALTHY";
            }
        } else if (instanceInfo.getStatus() == InstanceInfo.InstanceStatus.DOWN) {
            return "DOWN";
        } else if (instanceInfo.getStatus() == InstanceInfo.InstanceStatus.STARTING) {
            return "STARTING";
        } else if (instanceInfo.getStatus() == InstanceInfo.InstanceStatus.OUT_OF_SERVICE) {
            return "OUT_OF_SERVICE";
        } else {
            return "UNKNOWN";
        }
    }

    /**
     * Check if instance is healthy
     */
    private boolean isInstanceHealthy(InstanceInfo instanceInfo) {
        return instanceInfo.getStatus() == InstanceInfo.InstanceStatus.UP &&
               isHealthCheckResponsePositive(instanceInfo);
    }

    /**
     * Check health check response (placeholder implementation)
     */
    private boolean isHealthCheckResponsePositive(InstanceInfo instanceInfo) {
        // In a real implementation, this would make an actual health check call
        // For now, we assume UP status means healthy
        return instanceInfo.getStatus() == InstanceInfo.InstanceStatus.UP;
    }

    /**
     * Get metadata value safely
     */
    private String getMetadataValue(InstanceInfo instanceInfo, String key) {
        if (instanceInfo.getMetadata() != null) {
            return instanceInfo.getMetadata().get(key);
        }
        return null;
    }

    /**
     * Extract tags from metadata
     */
    private java.util.List<String> extractTags(InstanceInfo instanceInfo) {
        if (instanceInfo.getMetadata() != null) {
            return instanceInfo.getMetadata().entrySet().stream()
                    .filter(entry -> entry.getKey().startsWith("tag."))
                    .map(Map.Entry::getValue)
                    .collect(Collectors.toList());
        }
        return Collections.emptyList();
    }

    /**
     * Convert timestamp to LocalDateTime
     */
    private LocalDateTime timestampToLocalDateTime(long timestamp) {
        return LocalDateTime.ofInstant(
                Instant.ofEpochMilli(timestamp), 
                ZoneId.systemDefault()
        );
    }

    /**
     * Convert ServiceInstanceDto back to InstanceInfo (if needed)
     */
    public InstanceInfo toInstanceInfo(ServiceInstanceDto dto) {
        // This would be more complex and is typically not needed
        // since InstanceInfo is created by Eureka clients
        throw new UnsupportedOperationException("Converting DTO to InstanceInfo is not supported");
    }
}
