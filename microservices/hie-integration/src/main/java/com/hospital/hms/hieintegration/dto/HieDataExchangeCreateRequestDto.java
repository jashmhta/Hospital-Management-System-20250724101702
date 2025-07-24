package com.hospital.hms.hieintegration.dto;

import com.hospital.hms.hieintegration.entity.*;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * DTO for creating HIE Data Exchange records
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Data
public class HieDataExchangeCreateRequestDto {

    @NotNull(message = "HIE ID is required")
    private UUID hieId;

    @NotBlank(message = "Transaction ID is required")
    @Size(max = 100, message = "Transaction ID must not exceed 100 characters")
    private String transactionId;

    @Size(max = 100, message = "Patient ID must not exceed 100 characters")
    private String patientId;

    @Size(max = 100, message = "External patient ID must not exceed 100 characters")
    private String externalPatientId;

    @NotNull(message = "Exchange type is required")
    private ExchangeType exchangeType;

    @NotNull(message = "Exchange direction is required")
    private ExchangeDirection exchangeDirection;

    private ExchangeStatus exchangeStatus = ExchangeStatus.PENDING;

    private DataFormat dataFormat;

    @Size(max = 50, message = "Message type must not exceed 50 characters")
    private String messageType;

    @Size(max = 50, message = "Resource type must not exceed 50 characters")
    private String resourceType;

    private String requestPayload;

    @Min(value = 0, message = "Max retries must be non-negative")
    @Max(value = 10, message = "Max retries must not exceed 10")
    private Integer maxRetries = 3;

    @NotNull(message = "Exchange date is required")
    private LocalDateTime exchangeDate;

    private LocalDateTime expiryDate;

    // Audit and tracking
    @Size(max = 100, message = "Correlation ID must not exceed 100 characters")
    private String correlationId;

    @Size(max = 100, message = "Source system must not exceed 100 characters")
    private String sourceSystem;

    @Size(max = 100, message = "Target system must not exceed 100 characters")
    private String targetSystem;

    private ExchangePriority priority = ExchangePriority.NORMAL;

    @Size(max = 500, message = "Tags must not exceed 500 characters")
    private String tags;

    private String metadata;
}