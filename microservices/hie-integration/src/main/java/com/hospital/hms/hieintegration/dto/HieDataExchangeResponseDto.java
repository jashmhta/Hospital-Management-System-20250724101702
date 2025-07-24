package com.hospital.hms.hieintegration.dto;

import com.hospital.hms.hieintegration.entity.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * DTO for HIE Data Exchange response data
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Data
public class HieDataExchangeResponseDto {

    private UUID id;
    private String transactionId;
    private String patientId;
    private String externalPatientId;
    private ExchangeType exchangeType;
    private ExchangeDirection exchangeDirection;
    private ExchangeStatus exchangeStatus;
    private DataFormat dataFormat;
    private String messageType;
    private String resourceType;

    // Payload data (may be truncated or masked for security)
    private String requestPayload;
    private String responsePayload;
    private boolean hasRequestPayload;
    private boolean hasResponsePayload;
    private Integer requestPayloadSize;
    private Integer responsePayloadSize;

    // Error information
    private String errorMessage;
    private String errorCode;

    // Retry information
    private Integer retryCount;
    private Integer maxRetries;
    private LocalDateTime nextRetryDate;

    // Performance metrics
    private Long responseTimeMs;
    private Long fileSizeBytes;
    private Integer recordsCount;

    // Timing information
    private LocalDateTime exchangeDate;
    private LocalDateTime startedDate;
    private LocalDateTime completedDate;
    private LocalDateTime expiryDate;
    private Long durationMs; // computed: completedDate - startedDate

    // Audit and tracking
    private String correlationId;
    private String sourceSystem;
    private String targetSystem;
    private ExchangePriority priority;
    private String tags;
    private String metadata;

    // HIE Information
    private HieSummaryDto hie;

    // Status information
    private String statusDescription;
    private Boolean isActive;
    private Boolean canRetry;
    private Boolean hasExpired;

    // Audit fields
    private LocalDateTime createdDate;
    private String createdBy;

    /**
     * Nested DTO for HIE Summary in exchange response
     */
    @Data
    public static class HieSummaryDto {
        private UUID id;
        private String hieCode;
        private String hieName;
        private HieType hieType;
        private HieStatus status;
    }
}