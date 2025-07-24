package com.hospital.hms.graphql.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * Federation Statistics Data Transfer Object
 * 
 * Contains comprehensive statistics about the GraphQL federation gateway
 * including performance metrics, service health, and operational data.
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class FederationStatsDto {

    /**
     * Federation gateway uptime in milliseconds
     */
    private Long uptimeMs;

    /**
     * Total number of registered services
     */
    private Integer totalServices;

    /**
     * Number of active/healthy services
     */
    private Integer activeServices;

    /**
     * Number of inactive/unhealthy services
     */
    private Integer inactiveServices;

    /**
     * Total number of queries executed
     */
    private Long totalQueries;

    /**
     * Total number of mutations executed
     */
    private Long totalMutations;

    /**
     * Total number of subscriptions created
     */
    private Long totalSubscriptions;

    /**
     * Currently active subscriptions
     */
    private Integer activeSubscriptions;

    /**
     * Average query execution time in milliseconds
     */
    private Double averageQueryTimeMs;

    /**
     * Peak query execution time in milliseconds
     */
    private Double peakQueryTimeMs;

    /**
     * Queries per second (current rate)
     */
    private Double queriesPerSecond;

    /**
     * Total number of errors
     */
    private Long totalErrors;

    /**
     * Error rate percentage
     */
    private Double errorRate;

    /**
     * Cache hit ratio percentage
     */
    private Double cacheHitRatio;

    /**
     * Federation gateway start time
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime startTime;

    /**
     * Last statistics update time
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime lastUpdated;

    /**
     * Schema information
     */
    private SchemaStats schemaStats;

    /**
     * Performance metrics
     */
    private PerformanceStats performanceStats;

    /**
     * Service-specific statistics
     */
    private Map<String, ServiceStats> serviceStats;

    /**
     * Query complexity statistics
     */
    private ComplexityStats complexityStats;

    /**
     * Real-time subscription statistics
     */
    private SubscriptionStats subscriptionStats;

    /**
     * Error statistics breakdown
     */
    private ErrorStats errorStats;

    /**
     * Cache statistics
     */
    private CacheStats cacheStats;

    /**
     * Network statistics
     */
    private NetworkStats networkStats;

    /**
     * Resource utilization
     */
    private ResourceStats resourceStats;

    /**
     * Schema statistics nested class
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class SchemaStats {
        
        /**
         * Total number of types in federated schema
         */
        private Integer totalTypes;
        
        /**
         * Number of query fields
         */
        private Integer queryFields;
        
        /**
         * Number of mutation fields
         */
        private Integer mutationFields;
        
        /**
         * Number of subscription fields
         */
        private Integer subscriptionFields;
        
        /**
         * Number of federation entities
         */
        private Integer federationEntities;
        
        /**
         * Schema size in bytes
         */
        private Long schemaSizeBytes;
        
        /**
         * Last schema update time
         */
        @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
        private LocalDateTime lastSchemaUpdate;
        
        /**
         * Schema validation status
         */
        private String validationStatus;
    }

    /**
     * Performance statistics nested class
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class PerformanceStats {
        
        /**
         * 50th percentile response time
         */
        private Double p50ResponseTimeMs;
        
        /**
         * 95th percentile response time
         */
        private Double p95ResponseTimeMs;
        
        /**
         * 99th percentile response time
         */
        private Double p99ResponseTimeMs;
        
        /**
         * Minimum response time
         */
        private Double minResponseTimeMs;
        
        /**
         * Maximum response time
         */
        private Double maxResponseTimeMs;
        
        /**
         * Throughput (requests per second)
         */
        private Double throughput;
        
        /**
         * Concurrent requests
         */
        private Integer concurrentRequests;
        
        /**
         * Query planning time
         */
        private Double averageQueryPlanningTimeMs;
    }

    /**
     * Service-specific statistics nested class
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class ServiceStats {
        
        /**
         * Service name
         */
        private String serviceName;
        
        /**
         * Service health status
         */
        private String healthStatus;
        
        /**
         * Number of requests to this service
         */
        private Long requestCount;
        
        /**
         * Average response time for this service
         */
        private Double averageResponseTimeMs;
        
        /**
         * Error count for this service
         */
        private Long errorCount;
        
        /**
         * Service availability percentage
         */
        private Double availabilityPercentage;
        
        /**
         * Last successful request time
         */
        @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
        private LocalDateTime lastSuccessfulRequest;
        
        /**
         * Circuit breaker status
         */
        private String circuitBreakerStatus;
    }

    /**
     * Query complexity statistics nested class
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class ComplexityStats {
        
        /**
         * Average query complexity score
         */
        private Double averageComplexity;
        
        /**
         * Maximum query complexity score
         */
        private Double maxComplexity;
        
        /**
         * Number of queries exceeding complexity threshold
         */
        private Long complexQueriesCount;
        
        /**
         * Average query depth
         */
        private Double averageQueryDepth;
        
        /**
         * Maximum query depth
         */
        private Integer maxQueryDepth;
        
        /**
         * Number of queries exceeding depth limit
         */
        private Long deepQueriesCount;
    }

    /**
     * Subscription statistics nested class
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class SubscriptionStats {
        
        /**
         * Total subscription connections
         */
        private Integer totalConnections;
        
        /**
         * Active subscription connections
         */
        private Integer activeConnections;
        
        /**
         * Total events published
         */
        private Long totalEventsPublished;
        
        /**
         * Events per second rate
         */
        private Double eventsPerSecond;
        
        /**
         * Average connection duration
         */
        private Long averageConnectionDurationMs;
        
        /**
         * Subscription topics
         */
        private Map<String, Integer> topicSubscriptions;
        
        /**
         * Failed subscription attempts
         */
        private Long failedSubscriptions;
    }

    /**
     * Error statistics nested class
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class ErrorStats {
        
        /**
         * Errors by type
         */
        private Map<String, Long> errorsByType;
        
        /**
         * Errors by service
         */
        private Map<String, Long> errorsByService;
        
        /**
         * Recent errors (last 100)
         */
        private List<ErrorDetails> recentErrors;
        
        /**
         * Most common error messages
         */
        private Map<String, Long> commonErrors;
        
        /**
         * Error trends over time
         */
        private Map<String, Long> errorTrends;
    }

    /**
     * Cache statistics nested class
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class CacheStats {
        
        /**
         * Cache size (number of entries)
         */
        private Long cacheSize;
        
        /**
         * Cache memory usage in bytes
         */
        private Long cacheMemoryUsage;
        
        /**
         * Cache hit count
         */
        private Long cacheHits;
        
        /**
         * Cache miss count
         */
        private Long cacheMisses;
        
        /**
         * Cache eviction count
         */
        private Long cacheEvictions;
        
        /**
         * Average cache lookup time
         */
        private Double averageLookupTimeMs;
        
        /**
         * Cache hit ratio by query type
         */
        private Map<String, Double> hitRatioByType;
    }

    /**
     * Network statistics nested class
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class NetworkStats {
        
        /**
         * Total bytes sent
         */
        private Long totalBytesSent;
        
        /**
         * Total bytes received
         */
        private Long totalBytesReceived;
        
        /**
         * Average request size in bytes
         */
        private Double averageRequestSize;
        
        /**
         * Average response size in bytes
         */
        private Double averageResponseSize;
        
        /**
         * Connection pool statistics
         */
        private Map<String, Object> connectionPoolStats;
        
        /**
         * Network latency statistics
         */
        private Map<String, Double> latencyStats;
    }

    /**
     * Resource utilization statistics nested class
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class ResourceStats {
        
        /**
         * CPU utilization percentage
         */
        private Double cpuUtilization;
        
        /**
         * Memory utilization percentage
         */
        private Double memoryUtilization;
        
        /**
         * Heap memory usage in bytes
         */
        private Long heapMemoryUsage;
        
        /**
         * Non-heap memory usage in bytes
         */
        private Long nonHeapMemoryUsage;
        
        /**
         * Thread count
         */
        private Integer threadCount;
        
        /**
         * GC statistics
         */
        private Map<String, Object> gcStats;
    }

    /**
     * Error details nested class
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class ErrorDetails {
        
        /**
         * Error message
         */
        private String message;
        
        /**
         * Error type/classification
         */
        private String type;
        
        /**
         * Service that generated the error
         */
        private String service;
        
        /**
         * Query that caused the error
         */
        private String query;
        
        /**
         * Error timestamp
         */
        @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
        private LocalDateTime timestamp;
        
        /**
         * Error stack trace (if available)
         */
        private String stackTrace;
        
        /**
         * Request context
         */
        private Map<String, Object> context;
    }
}
