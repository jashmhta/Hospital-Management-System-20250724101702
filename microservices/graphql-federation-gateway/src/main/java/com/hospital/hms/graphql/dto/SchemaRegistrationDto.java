package com.hospital.hms.graphql.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * Schema Registration Data Transfer Object
 * 
 * Represents a GraphQL schema registration for a microservice in the federation.
 * Contains schema definition, service endpoint, and federation configuration.
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class SchemaRegistrationDto {

    /**
     * Service name identifier
     */
    @NotBlank(message = "Service name is required")
    private String serviceName;

    /**
     * GraphQL schema definition (SDL)
     */
    @NotBlank(message = "Schema definition is required")
    private String schemaDefinition;

    /**
     * Service endpoint URL
     */
    @NotBlank(message = "Service URL is required")
    private String serviceUrl;

    /**
     * Service version
     */
    private String version;

    /**
     * Schema version
     */
    private String schemaVersion;

    /**
     * Service health check URL
     */
    private String healthCheckUrl;

    /**
     * Service description
     */
    private String description;

    /**
     * Service tags for categorization
     */
    private List<String> tags;

    /**
     * Service owner/team
     */
    private String owner;

    /**
     * Service environment (dev/test/prod)
     */
    private String environment;

    /**
     * Service priority for load balancing
     */
    private Integer priority;

    /**
     * Service weight for load balancing
     */
    private Double weight;

    /**
     * Whether service is enabled in federation
     */
    private Boolean enabled;

    /**
     * Schema registration timestamp
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime registeredAt;

    /**
     * Last schema update timestamp
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime lastUpdated;

    /**
     * Federation configuration
     */
    private FederationConfig federationConfig;

    /**
     * Service configuration
     */
    private ServiceConfig serviceConfig;

    /**
     * Schema validation status
     */
    private ValidationStatus validationStatus;

    /**
     * Schema capabilities and features
     */
    private SchemaCapabilities capabilities;

    /**
     * Service dependencies
     */
    private List<String> dependencies;

    /**
     * Federation directives used
     */
    private List<String> federationDirectives;

    /**
     * Schema metadata
     */
    private Map<String, Object> metadata;

    /**
     * Federation configuration nested class
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class FederationConfig {
        
        /**
         * Entity types provided by this service
         */
        private List<String> entities;
        
        /**
         * Fields extended by this service
         */
        private List<String> extendedFields;
        
        /**
         * External references used
         */
        private List<String> externalReferences;
        
        /**
         * Key fields for entity resolution
         */
        private Map<String, List<String>> keyFields;
        
        /**
         * Whether service requires authentication
         */
        private Boolean requiresAuth;
        
        /**
         * Service timeout in milliseconds
         */
        private Integer timeoutMs;
        
        /**
         * Maximum query depth allowed
         */
        private Integer maxQueryDepth;
        
        /**
         * Maximum query complexity
         */
        private Integer maxQueryComplexity;
        
        /**
         * Rate limiting configuration
         */
        private RateLimitConfig rateLimiting;
        
        /**
         * Caching configuration
         */
        private CacheConfig caching;
    }

    /**
     * Service configuration nested class
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class ServiceConfig {
        
        /**
         * Connection timeout in milliseconds
         */
        private Integer connectionTimeoutMs;
        
        /**
         * Read timeout in milliseconds
         */
        private Integer readTimeoutMs;
        
        /**
         * Maximum connections
         */
        private Integer maxConnections;
        
        /**
         * Retry policy
         */
        private RetryPolicy retryPolicy;
        
        /**
         * Circuit breaker configuration
         */
        private CircuitBreakerConfig circuitBreaker;
        
        /**
         * Load balancing strategy
         */
        private String loadBalancingStrategy;
        
        /**
         * Health check interval in seconds
         */
        private Integer healthCheckIntervalSeconds;
        
        /**
         * Authentication configuration
         */
        private AuthConfig authentication;
    }

    /**
     * Schema capabilities nested class
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class SchemaCapabilities {
        
        /**
         * Supported GraphQL features
         */
        private List<String> supportedFeatures;
        
        /**
         * Subscription support
         */
        private Boolean supportsSubscriptions;
        
        /**
         * File upload support
         */
        private Boolean supportsFileUploads;
        
        /**
         * Real-time features
         */
        private Boolean supportsRealTime;
        
        /**
         * Batching support
         */
        private Boolean supportsBatching;
        
        /**
         * Persisted queries support
         */
        private Boolean supportsPersistedQueries;
        
        /**
         * Schema introspection allowed
         */
        private Boolean allowsIntrospection;
        
        /**
         * Schema extensions supported
         */
        private List<String> supportedExtensions;
    }

    /**
     * Rate limiting configuration nested class
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class RateLimitConfig {
        
        /**
         * Requests per minute
         */
        private Integer requestsPerMinute;
        
        /**
         * Burst capacity
         */
        private Integer burstCapacity;
        
        /**
         * Rate limiting strategy
         */
        private String strategy;
        
        /**
         * Rate limiting scope
         */
        private String scope;
    }

    /**
     * Cache configuration nested class
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class CacheConfig {
        
        /**
         * Cache TTL in seconds
         */
        private Integer ttlSeconds;
        
        /**
         * Cache size limit
         */
        private Integer sizeLimit;
        
        /**
         * Cache strategy
         */
        private String strategy;
        
        /**
         * Cacheable operations
         */
        private List<String> cacheableOperations;
    }

    /**
     * Retry policy nested class
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class RetryPolicy {
        
        /**
         * Maximum retry attempts
         */
        private Integer maxAttempts;
        
        /**
         * Initial delay in milliseconds
         */
        private Integer initialDelayMs;
        
        /**
         * Maximum delay in milliseconds
         */
        private Integer maxDelayMs;
        
        /**
         * Backoff multiplier
         */
        private Double backoffMultiplier;
        
        /**
         * Retryable exceptions
         */
        private List<String> retryableExceptions;
    }

    /**
     * Circuit breaker configuration nested class
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class CircuitBreakerConfig {
        
        /**
         * Failure threshold percentage
         */
        private Double failureThreshold;
        
        /**
         * Minimum number of calls
         */
        private Integer minimumNumberOfCalls;
        
        /**
         * Wait duration in open state (milliseconds)
         */
        private Integer waitDurationInOpenStateMs;
        
        /**
         * Sliding window size
         */
        private Integer slidingWindowSize;
        
        /**
         * Sliding window type
         */
        private String slidingWindowType;
    }

    /**
     * Authentication configuration nested class
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class AuthConfig {
        
        /**
         * Authentication type
         */
        private String type;
        
        /**
         * Authentication headers
         */
        private Map<String, String> headers;
        
        /**
         * Token endpoint
         */
        private String tokenEndpoint;
        
        /**
         * Client credentials
         */
        private Map<String, String> credentials;
    }

    /**
     * Validation status enumeration
     */
    public enum ValidationStatus {
        VALID,
        INVALID,
        WARNING,
        NOT_VALIDATED,
        VALIDATING
    }
}
