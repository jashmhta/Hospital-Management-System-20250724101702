package com.hospital.hms.servicediscovery.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * Service Registry Statistics Data Transfer Object
 * 
 * Provides comprehensive statistics about the service registry including
 * service counts, health metrics, performance data, and operational statistics.
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ServiceRegistryStatsDto {

    /**
     * Total number of registered services
     */
    private Integer totalServices;

    /**
     * Total number of service instances
     */
    private Integer totalInstances;

    /**
     * Number of healthy service instances
     */
    private Integer healthyInstances;

    /**
     * Number of unhealthy service instances
     */
    private Integer unhealthyInstances;

    /**
     * Number of service instances with unknown status
     */
    private Integer unknownInstances;

    /**
     * Number of instances that are out of service
     */
    private Integer outOfServiceInstances;

    /**
     * Number of instances that are starting up
     */
    private Integer startingInstances;

    /**
     * Overall registry health percentage
     */
    private Double healthPercentage;

    /**
     * Registry uptime in milliseconds
     */
    private Long registryUptimeMs;

    /**
     * Registry start time
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime registryStartTime;

    /**
     * Last statistics update time
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime lastUpdated;

    /**
     * Number of service registrations in the last hour
     */
    private Integer registrationsLastHour;

    /**
     * Number of service deregistrations in the last hour
     */
    private Integer deregistrationsLastHour;

    /**
     * Number of heartbeat renewals in the last minute
     */
    private Integer heartbeatsLastMinute;

    /**
     * Number of failed heartbeats in the last minute
     */
    private Integer failedHeartbeatsLastMinute;

    /**
     * Average response time for registry operations in milliseconds
     */
    private Double averageResponseTimeMs;

    /**
     * Peak number of concurrent instances
     */
    private Integer peakConcurrentInstances;

    /**
     * Peak timestamp when max concurrent instances was recorded
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime peakTimestamp;

    /**
     * Self-preservation mode status
     */
    private Boolean selfPreservationEnabled;

    /**
     * Current renewal threshold
     */
    private Double renewalThreshold;

    /**
     * Expected number of renewing clients
     */
    private Integer expectedNumberOfRenewingClients;

    /**
     * Actual number of renewing clients
     */
    private Integer actualNumberOfRenewingClients;

    /**
     * Number of registry cache misses
     */
    private Long cacheMisses;

    /**
     * Number of registry cache hits
     */
    private Long cacheHits;

    /**
     * Cache hit ratio as percentage
     */
    private Double cacheHitRatio;

    /**
     * Memory usage statistics
     */
    private MemoryStatsDto memoryStats;

    /**
     * Network statistics
     */
    private NetworkStatsDto networkStats;

    /**
     * Service-wise instance count breakdown
     */
    private Map<String, Integer> serviceInstanceCounts;

    /**
     * Service-wise health status breakdown
     */
    private Map<String, Map<String, Integer>> serviceHealthBreakdown;

    /**
     * Zone-wise distribution of instances
     */
    private Map<String, Integer> zoneDistribution;

    /**
     * Recent error counts by type
     */
    private Map<String, Integer> recentErrors;

    /**
     * Performance metrics over time
     */
    private Map<String, Object> performanceMetrics;

    /**
     * Memory statistics nested class
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class MemoryStatsDto {
        
        /**
         * Total heap memory in bytes
         */
        private Long totalHeapBytes;
        
        /**
         * Used heap memory in bytes
         */
        private Long usedHeapBytes;
        
        /**
         * Free heap memory in bytes
         */
        private Long freeHeapBytes;
        
        /**
         * Maximum heap memory in bytes
         */
        private Long maxHeapBytes;
        
        /**
         * Heap utilization percentage
         */
        private Double heapUtilizationPercent;
        
        /**
         * Non-heap memory usage in bytes
         */
        private Long nonHeapUsedBytes;
        
        /**
         * Total memory usage in bytes
         */
        private Long totalMemoryBytes;
    }

    /**
     * Network statistics nested class
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class NetworkStatsDto {
        
        /**
         * Total number of requests processed
         */
        private Long totalRequests;
        
        /**
         * Number of successful requests
         */
        private Long successfulRequests;
        
        /**
         * Number of failed requests
         */
        private Long failedRequests;
        
        /**
         * Average request processing time in milliseconds
         */
        private Double averageRequestTimeMs;
        
        /**
         * Peak request processing time in milliseconds
         */
        private Double peakRequestTimeMs;
        
        /**
         * Current request rate per second
         */
        private Double requestsPerSecond;
        
        /**
         * Total bytes sent
         */
        private Long totalBytesSent;
        
        /**
         * Total bytes received
         */
        private Long totalBytesReceived;
        
        /**
         * Active connection count
         */
        private Integer activeConnections;
    }
}
