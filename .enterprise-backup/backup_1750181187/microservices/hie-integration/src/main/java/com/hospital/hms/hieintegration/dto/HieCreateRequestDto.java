package com.hospital.hms.hieintegration.dto;

import com.hospital.hms.hieintegration.entity.AuthenticationType;
import com.hospital.hms.hieintegration.entity.HieStatus;
import com.hospital.hms.hieintegration.entity.HieType;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * DTO for creating Health Information Exchange records
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Data
public class HieCreateRequestDto {

    @NotBlank(message = "HIE code is required")
    @Size(max = 50, message = "HIE code must not exceed 50 characters")
    @Pattern(regexp = "^[A-Z0-9_-]+$", message = "HIE code must contain only uppercase letters, numbers, underscores, and hyphens")
    private String hieCode;

    @NotBlank(message = "HIE name is required")
    @Size(max = 200, message = "HIE name must not exceed 200 characters")
    private String hieName;

    @Size(max = 1000, message = "Description must not exceed 1000 characters")
    private String description;

    @NotNull(message = "HIE type is required")
    private HieType hieType;

    private HieStatus status = HieStatus.ACTIVE;

    // Contact Information
    @Size(max = 100, message = "Primary contact name must not exceed 100 characters")
    private String primaryContactName;

    @Email(message = "Invalid email format")
    @Size(max = 100, message = "Email must not exceed 100 characters")
    private String primaryContactEmail;

    @Pattern(regexp = "^[\\+]?[1-9][\\d\\s\\-\\(\\)]{7,15}$", message = "Invalid phone format")
    private String primaryContactPhone;

    @Size(max = 100, message = "Technical contact name must not exceed 100 characters")
    private String technicalContactName;

    @Email(message = "Invalid email format")
    @Size(max = 100, message = "Email must not exceed 100 characters")
    private String technicalContactEmail;

    @Pattern(regexp = "^[\\+]?[1-9][\\d\\s\\-\\(\\)]{7,15}$", message = "Invalid phone format")
    private String technicalContactPhone;

    // Geographic Information
    @Size(max = 100, message = "Geographic region must not exceed 100 characters")
    private String geographicRegion;

    @Size(max = 1000, message = "Service area must not exceed 1000 characters")
    private String serviceArea;

    @Size(max = 50, message = "Time zone must not exceed 50 characters")
    private String timeZone;

    // Technical Configuration
    @Size(max = 500, message = "Base URL must not exceed 500 characters")
    @Pattern(regexp = "^https?://.*", message = "Base URL must be a valid HTTP/HTTPS URL")
    private String baseUrl;

    @Size(max = 500, message = "FHIR endpoint must not exceed 500 characters")
    @Pattern(regexp = "^https?://.*", message = "FHIR endpoint must be a valid HTTP/HTTPS URL")
    private String fhirEndpoint;

    @Size(max = 500, message = "HL7 endpoint must not exceed 500 characters")
    private String hl7Endpoint;

    @Size(max = 500, message = "SOAP endpoint must not exceed 500 characters")
    @Pattern(regexp = "^https?://.*", message = "SOAP endpoint must be a valid HTTP/HTTPS URL")
    private String soapEndpoint;

    @Size(max = 500, message = "REST endpoint must not exceed 500 characters")
    @Pattern(regexp = "^https?://.*", message = "REST endpoint must be a valid HTTP/HTTPS URL")
    private String restEndpoint;

    // Security Configuration
    private AuthenticationType authenticationType;

    @Size(max = 100, message = "Client ID must not exceed 100 characters")
    private String clientId;

    @Size(max = 500, message = "Client secret must not exceed 500 characters")
    private String clientSecret;

    @Size(max = 500, message = "OAuth token URL must not exceed 500 characters")
    @Pattern(regexp = "^https?://.*", message = "OAuth token URL must be a valid HTTP/HTTPS URL")
    private String oauthTokenUrl;

    @Size(max = 100, message = "Certificate thumbprint must not exceed 100 characters")
    private String certificateThumbprint;

    // Supported Standards
    @Size(max = 100, message = "Supported FHIR versions must not exceed 100 characters")
    private String supportedFhirVersions;

    @Size(max = 100, message = "Supported HL7 versions must not exceed 100 characters")
    private String supportedHl7Versions;

    @Size(max = 1000, message = "Supported profiles must not exceed 1000 characters")
    private String supportedProfiles;

    // Data Exchange Configuration
    @Size(max = 100, message = "Data sharing agreement ID must not exceed 100 characters")
    private String dataSharingAgreementId;

    private LocalDateTime dataSharingStartDate;

    private LocalDateTime dataSharingEndDate;

    @Min(value = 1, message = "Max records per request must be at least 1")
    @Max(value = 10000, message = "Max records per request must not exceed 10000")
    private Integer maxRecordsPerRequest = 100;

    @Min(value = 1, message = "Request timeout must be at least 1 second")
    @Max(value = 300, message = "Request timeout must not exceed 300 seconds")
    private Integer requestTimeoutSeconds = 30;

    @Min(value = 1, message = "Connection test frequency must be at least 1 minute")
    @Max(value = 1440, message = "Connection test frequency must not exceed 1440 minutes (24 hours)")
    private Integer connectionTestFrequencyMinutes = 15;

    // Performance Thresholds
    @DecimalMin(value = "0.0", message = "Uptime percentage must be non-negative")
    @DecimalMax(value = "100.0", message = "Uptime percentage must not exceed 100")
    private Double expectedUptimePercentage = 99.0;

    @Min(value = 0, message = "Expected response time must be non-negative")
    private Long expectedResponseTimeMs = 5000L;

    @DecimalMin(value = "0.0", message = "Success rate must be non-negative")
    @DecimalMax(value = "100.0", message = "Success rate must not exceed 100")
    private Double expectedSuccessRatePercentage = 95.0;
}