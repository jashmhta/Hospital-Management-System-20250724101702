package com.hospital.hms.hieintegration.dto;

import com.hospital.hms.hieintegration.entity.AuthenticationType;
import com.hospital.hms.hieintegration.entity.HieStatus;
import com.hospital.hms.hieintegration.entity.HieType;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * DTO for Health Information Exchange response data
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Data
public class HieResponseDto {

    private UUID id;
    private String hieCode;
    private String hieName;
    private String description;
    private HieType hieType;
    private HieStatus status;

    // Contact Information
    private String primaryContactName;
    private String primaryContactEmail;
    private String primaryContactPhone;
    private String technicalContactName;
    private String technicalContactEmail;
    private String technicalContactPhone;

    // Geographic Information
    private String geographicRegion;
    private String serviceArea;
    private String timeZone;

    // Technical Configuration (sensitive data masked)
    private String baseUrl;
    private String fhirEndpoint;
    private String hl7Endpoint;
    private String soapEndpoint;
    private String restEndpoint;
    
    // Security Configuration (sensitive data masked)
    private AuthenticationType authenticationType;
    private String clientId; // Masked
    private boolean hasClientSecret; // Boolean indicator instead of actual secret
    private String oauthTokenUrl;
    private String certificateThumbprint; // Masked

    // Supported Standards
    private String supportedFhirVersions;
    private String supportedHl7Versions;
    private String supportedProfiles;

    // Data Exchange Configuration
    private String dataSharingAgreementId;
    private LocalDateTime dataSharingStartDate;
    private LocalDateTime dataSharingEndDate;
    private Integer maxRecordsPerRequest;
    private Integer requestTimeoutSeconds;

    // Quality and Performance Metrics
    private Double uptimePercentage;
    private Long averageResponseTimeMs;
    private Double successRatePercentage;
    private LocalDateTime lastSuccessfulConnection;
    private LocalDateTime lastFailedConnection;
    private Integer connectionTestFrequencyMinutes;

    // Connection Status
    private String currentConnectionStatus;
    private LocalDateTime lastConnectionTest;
    private Boolean isOperational;

    // Statistics
    private Long totalExchanges;
    private Long successfulExchanges;
    private Long failedExchanges;
    private Long pendingExchanges;

    // Recent Activity
    private List<HieDataExchangeSummaryDto> recentExchanges;
    private List<HieConnectionSummaryDto> recentConnections;

    // Audit Fields
    private LocalDateTime createdDate;
    private LocalDateTime lastModifiedDate;
    private String createdBy;
    private String lastModifiedBy;

    // Computed Fields
    private String healthStatus; // HEALTHY, DEGRADED, CRITICAL
    private Integer daysSinceLastSuccess;
    private Integer daysSinceLastFailure;
    private String performanceRating; // EXCELLENT, GOOD, FAIR, POOR

    /**
     * Nested DTO for HIE Data Exchange Summary
     */
    @Data
    public static class HieDataExchangeSummaryDto {
        private UUID id;
        private String transactionId;
        private String exchangeType;
        private String exchangeDirection;
        private String exchangeStatus;
        private String patientId;
        private LocalDateTime exchangeDate;
        private Long responseTimeMs;
        private String errorMessage;
    }

    /**
     * Nested DTO for HIE Connection Summary
     */
    @Data
    public static class HieConnectionSummaryDto {
        private UUID id;
        private String endpointType;
        private String endpointUrl;
        private String connectionStatus;
        private LocalDateTime testDate;
        private Long responseTimeMs;
        private Boolean success;
        private String errorMessage;
    }
}