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
 * Service Instance Data Transfer Object
 * 
 * Represents a service instance registered in the service discovery registry.
 * Contains comprehensive information about service health, status, and metadata.
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ServiceInstanceDto {

    /**
     * Unique instance identifier
     */
    private String instanceId;

    /**
     * Service name/application name
     */
    private String serviceName;

    /**
     * Host/IP address of the service instance
     */
    private String hostName;

    /**
     * IP address of the service instance
     */
    private String ipAddress;

    /**
     * Port number where the service is running
     */
    private Integer port;

    /**
     * Secure port for HTTPS communication
     */
    private Integer securePort;

    /**
     * Current status of the service instance
     * Values: UP, DOWN, STARTING, OUT_OF_SERVICE, UNKNOWN
     */
    private String status;

    /**
     * Health check status
     */
    private String healthStatus;

    /**
     * Whether the instance is healthy
     */
    private Boolean healthy;

    /**
     * Home page URL of the service
     */
    private String homePageUrl;

    /**
     * Status page URL for health checks
     */
    private String statusPageUrl;

    /**
     * Health check URL
     */
    private String healthCheckUrl;

    /**
     * Virtual IP address (VIP)
     */
    private String vipAddress;

    /**
     * Secure virtual IP address
     */
    private String secureVipAddress;

    /**
     * Data center information
     */
    private String dataCenterInfo;

    /**
     * Instance registration timestamp
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime registrationTime;

    /**
     * Last heartbeat timestamp
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime lastHeartbeat;

    /**
     * Last status update timestamp
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime lastStatusUpdate;

    /**
     * Service uptime in milliseconds
     */
    private Long uptimeInMs;

    /**
     * Whether secure communication is enabled
     */
    private Boolean securePortEnabled;

    /**
     * Whether non-secure communication is enabled
     */
    private Boolean nonSecurePortEnabled;

    /**
     * Application version
     */
    private String version;

    /**
     * Application build information
     */
    private String buildInfo;

    /**
     * Instance metadata
     */
    private Map<String, String> metadata;

    /**
     * Lease information
     */
    private LeaseInfoDto leaseInfo;

    /**
     * Performance metrics
     */
    private Map<String, Object> metrics;

    /**
     * Service dependencies
     */
    private java.util.List<String> dependencies;

    /**
     * Service tags/labels
     */
    private java.util.List<String> tags;

    /**
     * Environment information
     */
    private String environment;

    /**
     * Service zone/region
     */
    private String zone;

    /**
     * Nested class for lease information
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class LeaseInfoDto {
        
        /**
         * Lease renewal interval in seconds
         */
        private Integer renewalIntervalInSecs;
        
        /**
         * Lease duration in seconds
         */
        private Integer durationInSecs;
        
        /**
         * Registration timestamp
         */
        @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
        private LocalDateTime registrationTimestamp;
        
        /**
         * Last renewal timestamp
         */
        @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
        private LocalDateTime lastRenewalTimestamp;
        
        /**
         * Eviction timestamp
         */
        @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
        private LocalDateTime evictionTimestamp;
        
        /**
         * Service up timestamp
         */
        @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
        private LocalDateTime serviceUpTimestamp;
    }
}
