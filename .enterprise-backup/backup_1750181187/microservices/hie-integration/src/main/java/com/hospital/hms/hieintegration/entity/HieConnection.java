package com.hospital.hms.hieintegration.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * HIE Connection Entity
 * 
 * Represents connection test results and monitoring data
 * for Health Information Exchange networks.
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Entity
@Table(name = "hie_connections", indexes = {
    @Index(name = "idx_connection_hie", columnList = "hie_id"),
    @Index(name = "idx_connection_status", columnList = "connection_status"),
    @Index(name = "idx_connection_test_date", columnList = "test_date"),
    @Index(name = "idx_connection_endpoint", columnList = "endpoint_type")
})
@EntityListeners(AuditingEntityListener.class)
public class HieConnection {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hie_id", nullable = false)
    @NotNull(message = "HIE is required")
    private HealthInformationExchange hie;

    @Column(name = "endpoint_type", nullable = false, length = 30)
    @Enumerated(EnumType.STRING)
    @NotNull(message = "Endpoint type is required")
    private EndpointType endpointType;

    @Column(name = "endpoint_url", nullable = false, length = 500)
    @NotBlank(message = "Endpoint URL is required")
    @Size(max = 500, message = "Endpoint URL must not exceed 500 characters")
    private String endpointUrl;

    @Column(name = "connection_status", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    @NotNull(message = "Connection status is required")
    private ConnectionStatus connectionStatus;

    @Column(name = "test_date", nullable = false)
    @NotNull(message = "Test date is required")
    private LocalDateTime testDate;

    @Column(name = "response_time_ms")
    @Min(value = 0, message = "Response time must be non-negative")
    private Long responseTimeMs;

    @Column(name = "status_code")
    private Integer statusCode;

    @Column(name = "error_message", columnDefinition = "TEXT")
    private String errorMessage;

    @Column(name = "success")
    private Boolean success;

    @Column(name = "test_payload", columnDefinition = "TEXT")
    private String testPayload;

    @Column(name = "response_payload", columnDefinition = "TEXT")
    private String responsePayload;

    @Column(name = "ssl_certificate_valid")
    private Boolean sslCertificateValid;

    @Column(name = "ssl_certificate_expiry")
    private LocalDateTime sslCertificateExpiry;

    @Column(name = "authentication_successful")
    private Boolean authenticationSuccessful;

    @Column(name = "data_returned")
    private Boolean dataReturned;

    @Column(name = "records_count")
    @Min(value = 0, message = "Records count must be non-negative")
    private Integer recordsCount;

    @CreatedDate
    @Column(name = "created_date", nullable = false, updatable = false)
    private LocalDateTime createdDate;

    @Column(name = "created_by", length = 100)
    @Size(max = 100, message = "Created by must not exceed 100 characters")
    private String createdBy;

    // Constructors
    public HieConnection() {}

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public HealthInformationExchange getHie() {
        return hie;
    }

    public void setHie(HealthInformationExchange hie) {
        this.hie = hie;
    }

    public EndpointType getEndpointType() {
        return endpointType;
    }

    public void setEndpointType(EndpointType endpointType) {
        this.endpointType = endpointType;
    }

    public String getEndpointUrl() {
        return endpointUrl;
    }

    public void setEndpointUrl(String endpointUrl) {
        this.endpointUrl = endpointUrl;
    }

    public ConnectionStatus getConnectionStatus() {
        return connectionStatus;
    }

    public void setConnectionStatus(ConnectionStatus connectionStatus) {
        this.connectionStatus = connectionStatus;
    }

    public LocalDateTime getTestDate() {
        return testDate;
    }

    public void setTestDate(LocalDateTime testDate) {
        this.testDate = testDate;
    }

    public Long getResponseTimeMs() {
        return responseTimeMs;
    }

    public void setResponseTimeMs(Long responseTimeMs) {
        this.responseTimeMs = responseTimeMs;
    }

    public Integer getStatusCode() {
        return statusCode;
    }

    public void setStatusCode(Integer statusCode) {
        this.statusCode = statusCode;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }

    public Boolean getSuccess() {
        return success;
    }

    public void setSuccess(Boolean success) {
        this.success = success;
    }

    public String getTestPayload() {
        return testPayload;
    }

    public void setTestPayload(String testPayload) {
        this.testPayload = testPayload;
    }

    public String getResponsePayload() {
        return responsePayload;
    }

    public void setResponsePayload(String responsePayload) {
        this.responsePayload = responsePayload;
    }

    public Boolean getSslCertificateValid() {
        return sslCertificateValid;
    }

    public void setSslCertificateValid(Boolean sslCertificateValid) {
        this.sslCertificateValid = sslCertificateValid;
    }

    public LocalDateTime getSslCertificateExpiry() {
        return sslCertificateExpiry;
    }

    public void setSslCertificateExpiry(LocalDateTime sslCertificateExpiry) {
        this.sslCertificateExpiry = sslCertificateExpiry;
    }

    public Boolean getAuthenticationSuccessful() {
        return authenticationSuccessful;
    }

    public void setAuthenticationSuccessful(Boolean authenticationSuccessful) {
        this.authenticationSuccessful = authenticationSuccessful;
    }

    public Boolean getDataReturned() {
        return dataReturned;
    }

    public void setDataReturned(Boolean dataReturned) {
        this.dataReturned = dataReturned;
    }

    public Integer getRecordsCount() {
        return recordsCount;
    }

    public void setRecordsCount(Integer recordsCount) {
        this.recordsCount = recordsCount;
    }

    public LocalDateTime getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(LocalDateTime createdDate) {
        this.createdDate = createdDate;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }
}
