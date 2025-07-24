package com.hms.analytics.entity;

import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Data Source Entity
 * 
 * Represents healthcare data sources for analytics ingestion including
 * EMR systems, medical devices, lab systems, and external APIs.
 */
@Entity
@Table(name = "data_sources",
    indexes = {
        @Index(name = "idx_data_source_type", columnList = "source_type"),
        @Index(name = "idx_data_source_status", columnList = "status"),
        @Index(name = "idx_data_source_category", columnList = "category"),
        @Index(name = "idx_data_source_last_sync", columnList = "last_sync_at")
    }
)
@EntityListeners(AuditingEntityListener.class)
public class DataSource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "source_name", nullable = false, length = 200)
    private String sourceName;

    @Column(name = "source_code", nullable = false, unique = true, length = 50)
    private String sourceCode;

    @Enumerated(EnumType.STRING)
    @Column(name = "source_type", nullable = false)
    private SourceType sourceType;

    @Enumerated(EnumType.STRING)
    @Column(name = "category", nullable = false)
    private DataCategory category;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "connection_string", length = 1000)
    private String connectionString;

    @Column(name = "api_endpoint", length = 500)
    private String apiEndpoint;

    @Column(name = "authentication_type", length = 50)
    private String authenticationType;

    @Column(name = "credentials_encrypted", columnDefinition = "TEXT")
    private String credentialsEncrypted;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private SourceStatus status = SourceStatus.ACTIVE;

    @Column(name = "sync_frequency_minutes", nullable = false)
    private Integer syncFrequencyMinutes = 60;

    @Column(name = "batch_size", nullable = false)
    private Integer batchSize = 1000;

    @Column(name = "retry_attempts", nullable = false)
    private Integer retryAttempts = 3;

    @Column(name = "timeout_seconds", nullable = false)
    private Integer timeoutSeconds = 300;

    @Column(name = "data_format", length = 50)
    private String dataFormat;

    @Column(name = "schema_validation", nullable = false)
    private Boolean schemaValidation = true;

    @Column(name = "data_encryption", nullable = false)
    private Boolean dataEncryption = true;

    @Column(name = "hipaa_compliant", nullable = false)
    private Boolean hipaaCompliant = true;

    @Column(name = "last_sync_at")
    private LocalDateTime lastSyncAt;

    @Column(name = "next_sync_at")
    private LocalDateTime nextSyncAt;

    @Column(name = "records_processed")
    private Long recordsProcessed = 0L;

    @Column(name = "records_failed")
    private Long recordsFailed = 0L;

    @Column(name = "average_processing_time_ms")
    private Double averageProcessingTimeMs = 0.0;

    @Column(name = "error_count")
    private Integer errorCount = 0;

    @Column(name = "last_error_message", columnDefinition = "TEXT")
    private String lastErrorMessage;

    @Column(name = "last_error_at")
    private LocalDateTime lastErrorAt;

    @Column(name = "configuration_json", columnDefinition = "JSONB")
    private String configurationJson;

    @Column(name = "mapping_rules_json", columnDefinition = "JSONB")
    private String mappingRulesJson;

    @Column(name = "transformation_rules_json", columnDefinition = "JSONB")
    private String transformationRulesJson;

    @Column(name = "quality_rules_json", columnDefinition = "JSONB")
    private String qualityRulesJson;

    @Column(name = "monitoring_enabled", nullable = false)
    private Boolean monitoringEnabled = true;

    @Column(name = "alerting_enabled", nullable = false)
    private Boolean alertingEnabled = true;

    @Column(name = "data_retention_days")
    private Integer dataRetentionDays = 2555; // 7 years default

    @OneToMany(mappedBy = "dataSource", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<IngestionJob> ingestionJobs;

    @OneToMany(mappedBy = "dataSource", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<DataQualityMetric> qualityMetrics;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "created_by", length = 100)
    private String createdBy;

    @Column(name = "updated_by", length = 100)
    private String updatedBy;

    @Version
    private Long version;

    // Constructors
    public DataSource() {}

    public DataSource(String sourceName, String sourceCode, SourceType sourceType, DataCategory category) {
        this.sourceName = sourceName;
        this.sourceCode = sourceCode;
        this.sourceType = sourceType;
        this.category = category;
    }

    // Utility methods
    public boolean isHealthy() {
        return status == SourceStatus.ACTIVE && 
               (lastErrorAt == null || lastErrorAt.isBefore(LocalDateTime.now().minusHours(1)));
    }

    public boolean isOverdue() {
        return nextSyncAt != null && LocalDateTime.now().isAfter(nextSyncAt.plusMinutes(syncFrequencyMinutes));
    }

    public double getErrorRate() {
        if (recordsProcessed == 0) return 0.0;
        return (recordsFailed.doubleValue() / recordsProcessed.doubleValue()) * 100.0;
    }

    public void updateSyncSchedule() {
        this.nextSyncAt = LocalDateTime.now().plusMinutes(syncFrequencyMinutes);
    }

    public void recordSuccess(long recordsCount, long processingTimeMs) {
        this.lastSyncAt = LocalDateTime.now();
        this.recordsProcessed += recordsCount;
        this.averageProcessingTimeMs = (averageProcessingTimeMs + processingTimeMs) / 2.0;
        this.errorCount = 0;
        updateSyncSchedule();
    }

    public void recordError(String errorMessage) {
        this.errorCount++;
        this.lastErrorMessage = errorMessage;
        this.lastErrorAt = LocalDateTime.now();
        if (errorCount >= 5) {
            this.status = SourceStatus.ERROR;
        }
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSourceName() { return sourceName; }
    public void setSourceName(String sourceName) { this.sourceName = sourceName; }

    public String getSourceCode() { return sourceCode; }
    public void setSourceCode(String sourceCode) { this.sourceCode = sourceCode; }

    public SourceType getSourceType() { return sourceType; }
    public void setSourceType(SourceType sourceType) { this.sourceType = sourceType; }

    public DataCategory getCategory() { return category; }
    public void setCategory(DataCategory category) { this.category = category; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getConnectionString() { return connectionString; }
    public void setConnectionString(String connectionString) { this.connectionString = connectionString; }

    public String getApiEndpoint() { return apiEndpoint; }
    public void setApiEndpoint(String apiEndpoint) { this.apiEndpoint = apiEndpoint; }

    public String getAuthenticationType() { return authenticationType; }
    public void setAuthenticationType(String authenticationType) { this.authenticationType = authenticationType; }

    public String getCredentialsEncrypted() { return credentialsEncrypted; }
    public void setCredentialsEncrypted(String credentialsEncrypted) { this.credentialsEncrypted = credentialsEncrypted; }

    public SourceStatus getStatus() { return status; }
    public void setStatus(SourceStatus status) { this.status = status; }

    public Integer getSyncFrequencyMinutes() { return syncFrequencyMinutes; }
    public void setSyncFrequencyMinutes(Integer syncFrequencyMinutes) { this.syncFrequencyMinutes = syncFrequencyMinutes; }

    public Integer getBatchSize() { return batchSize; }
    public void setBatchSize(Integer batchSize) { this.batchSize = batchSize; }

    public Integer getRetryAttempts() { return retryAttempts; }
    public void setRetryAttempts(Integer retryAttempts) { this.retryAttempts = retryAttempts; }

    public Integer getTimeoutSeconds() { return timeoutSeconds; }
    public void setTimeoutSeconds(Integer timeoutSeconds) { this.timeoutSeconds = timeoutSeconds; }

    public String getDataFormat() { return dataFormat; }
    public void setDataFormat(String dataFormat) { this.dataFormat = dataFormat; }

    public Boolean getSchemaValidation() { return schemaValidation; }
    public void setSchemaValidation(Boolean schemaValidation) { this.schemaValidation = schemaValidation; }

    public Boolean getDataEncryption() { return dataEncryption; }
    public void setDataEncryption(Boolean dataEncryption) { this.dataEncryption = dataEncryption; }

    public Boolean getHipaaCompliant() { return hipaaCompliant; }
    public void setHipaaCompliant(Boolean hipaaCompliant) { this.hipaaCompliant = hipaaCompliant; }

    public LocalDateTime getLastSyncAt() { return lastSyncAt; }
    public void setLastSyncAt(LocalDateTime lastSyncAt) { this.lastSyncAt = lastSyncAt; }

    public LocalDateTime getNextSyncAt() { return nextSyncAt; }
    public void setNextSyncAt(LocalDateTime nextSyncAt) { this.nextSyncAt = nextSyncAt; }

    public Long getRecordsProcessed() { return recordsProcessed; }
    public void setRecordsProcessed(Long recordsProcessed) { this.recordsProcessed = recordsProcessed; }

    public Long getRecordsFailed() { return recordsFailed; }
    public void setRecordsFailed(Long recordsFailed) { this.recordsFailed = recordsFailed; }

    public Double getAverageProcessingTimeMs() { return averageProcessingTimeMs; }
    public void setAverageProcessingTimeMs(Double averageProcessingTimeMs) { this.averageProcessingTimeMs = averageProcessingTimeMs; }

    public Integer getErrorCount() { return errorCount; }
    public void setErrorCount(Integer errorCount) { this.errorCount = errorCount; }

    public String getLastErrorMessage() { return lastErrorMessage; }
    public void setLastErrorMessage(String lastErrorMessage) { this.lastErrorMessage = lastErrorMessage; }

    public LocalDateTime getLastErrorAt() { return lastErrorAt; }
    public void setLastErrorAt(LocalDateTime lastErrorAt) { this.lastErrorAt = lastErrorAt; }

    public String getConfigurationJson() { return configurationJson; }
    public void setConfigurationJson(String configurationJson) { this.configurationJson = configurationJson; }

    public String getMappingRulesJson() { return mappingRulesJson; }
    public void setMappingRulesJson(String mappingRulesJson) { this.mappingRulesJson = mappingRulesJson; }

    public String getTransformationRulesJson() { return transformationRulesJson; }
    public void setTransformationRulesJson(String transformationRulesJson) { this.transformationRulesJson = transformationRulesJson; }

    public String getQualityRulesJson() { return qualityRulesJson; }
    public void setQualityRulesJson(String qualityRulesJson) { this.qualityRulesJson = qualityRulesJson; }

    public Boolean getMonitoringEnabled() { return monitoringEnabled; }
    public void setMonitoringEnabled(Boolean monitoringEnabled) { this.monitoringEnabled = monitoringEnabled; }

    public Boolean getAlertingEnabled() { return alertingEnabled; }
    public void setAlertingEnabled(Boolean alertingEnabled) { this.alertingEnabled = alertingEnabled; }

    public Integer getDataRetentionDays() { return dataRetentionDays; }
    public void setDataRetentionDays(Integer dataRetentionDays) { this.dataRetentionDays = dataRetentionDays; }

    public List<IngestionJob> getIngestionJobs() { return ingestionJobs; }
    public void setIngestionJobs(List<IngestionJob> ingestionJobs) { this.ingestionJobs = ingestionJobs; }

    public List<DataQualityMetric> getQualityMetrics() { return qualityMetrics; }
    public void setQualityMetrics(List<DataQualityMetric> qualityMetrics) { this.qualityMetrics = qualityMetrics; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }

    public String getUpdatedBy() { return updatedBy; }
    public void setUpdatedBy(String updatedBy) { this.updatedBy = updatedBy; }

    public Long getVersion() { return version; }
    public void setVersion(Long version) { this.version = version; }

    // Enums
    public enum SourceType {
        DATABASE,
        REST_API,
        FILE_SYSTEM,
        KAFKA_STREAM,
        MESSAGE_QUEUE,
        MEDICAL_DEVICE,
        FHIR_SERVER,
        HL7_INTERFACE,
        CLOUD_STORAGE,
        WEBHOOK
    }

    public enum DataCategory {
        PATIENT_DATA,
        CLINICAL_DATA,
        LABORATORY_DATA,
        RADIOLOGY_DATA,
        PHARMACY_DATA,
        BILLING_DATA,
        OPERATIONAL_DATA,
        DEVICE_DATA,
        QUALITY_METRICS,
        ADMINISTRATIVE_DATA
    }

    public enum SourceStatus {
        ACTIVE,
        INACTIVE,
        ERROR,
        MAINTENANCE,
        TESTING
    }
}
