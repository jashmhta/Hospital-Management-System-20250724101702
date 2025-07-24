package com.hms.analytics.entity;

import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

/**
 * Ingestion Job Entity
 * 
 * Represents individual data ingestion jobs with processing status,
 * metrics, and error tracking for healthcare analytics pipeline.
 */
@Entity
@Table(name = "ingestion_jobs",
    indexes = {
        @Index(name = "idx_job_data_source", columnList = "data_source_id"),
        @Index(name = "idx_job_status", columnList = "status"),
        @Index(name = "idx_job_started_at", columnList = "started_at"),
        @Index(name = "idx_job_completed_at", columnList = "completed_at"),
        @Index(name = "idx_job_job_type", columnList = "job_type")
    }
)
@EntityListeners(AuditingEntityListener.class)
public class IngestionJob {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "data_source_id", nullable = false)
    private DataSource dataSource;

    @Column(name = "job_name", nullable = false, length = 200)
    private String jobName;

    @Column(name = "job_id", nullable = false, unique = true, length = 100)
    private String jobId;

    @Enumerated(EnumType.STRING)
    @Column(name = "job_type", nullable = false)
    private JobType jobType;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private JobStatus status = JobStatus.PENDING;

    @Column(name = "priority", nullable = false)
    private Integer priority = 5; // 1-10, 1 = highest

    @Column(name = "started_at")
    private LocalDateTime startedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "duration_ms")
    private Long durationMs;

    @Column(name = "records_total")
    private Long recordsTotal = 0L;

    @Column(name = "records_processed")
    private Long recordsProcessed = 0L;

    @Column(name = "records_failed")
    private Long recordsFailed = 0L;

    @Column(name = "records_skipped")
    private Long recordsSkipped = 0L;

    @Column(name = "bytes_processed")
    private Long bytesProcessed = 0L;

    @Column(name = "progress_percentage", nullable = false)
    private Double progressPercentage = 0.0;

    @Column(name = "current_batch")
    private Integer currentBatch = 0;

    @Column(name = "total_batches")
    private Integer totalBatches = 0;

    @Column(name = "error_message", columnDefinition = "TEXT")
    private String errorMessage;

    @Column(name = "error_details", columnDefinition = "TEXT")
    private String errorDetails;

    @Column(name = "retry_count", nullable = false)
    private Integer retryCount = 0;

    @Column(name = "max_retries", nullable = false)
    private Integer maxRetries = 3;

    @Column(name = "next_retry_at")
    private LocalDateTime nextRetryAt;

    @Column(name = "configuration_json", columnDefinition = "JSONB")
    private String configurationJson;

    @Column(name = "metrics_json", columnDefinition = "JSONB")
    private String metricsJson;

    @Column(name = "validation_results_json", columnDefinition = "JSONB")
    private String validationResultsJson;

    @Column(name = "transformation_log_json", columnDefinition = "JSONB")
    private String transformationLogJson;

    @Column(name = "quality_score")
    private Double qualityScore;

    @Column(name = "data_completeness_percentage")
    private Double dataCompletenessPercentage;

    @Column(name = "data_accuracy_percentage")
    private Double dataAccuracyPercentage;

    @Column(name = "hipaa_compliance_checked", nullable = false)
    private Boolean hipaaComplianceChecked = false;

    @Column(name = "phi_detected", nullable = false)
    private Boolean phiDetected = false;

    @Column(name = "phi_anonymized", nullable = false)
    private Boolean phiAnonymized = false;

    @Column(name = "audit_trail_json", columnDefinition = "JSONB")
    private String auditTrailJson;

    @Column(name = "scheduled_for")
    private LocalDateTime scheduledFor;

    @Column(name = "triggered_by", length = 100)
    private String triggeredBy;

    @Column(name = "trigger_type", length = 50)
    private String triggerType; // MANUAL, SCHEDULED, EVENT_DRIVEN

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Version
    private Long version;

    // Constructors
    public IngestionJob() {}

    public IngestionJob(DataSource dataSource, String jobName, JobType jobType) {
        this.dataSource = dataSource;
        this.jobName = jobName;
        this.jobType = jobType;
        this.jobId = generateJobId();
    }

    // Utility methods
    public boolean isRunning() {
        return status == JobStatus.RUNNING || status == JobStatus.PROCESSING;
    }

    public boolean isCompleted() {
        return status == JobStatus.COMPLETED || status == JobStatus.FAILED || status == JobStatus.CANCELLED;
    }

    public boolean canRetry() {
        return status == JobStatus.FAILED && retryCount < maxRetries;
    }

    public void start() {
        this.status = JobStatus.RUNNING;
        this.startedAt = LocalDateTime.now();
        this.progressPercentage = 0.0;
    }

    public void complete() {
        this.status = JobStatus.COMPLETED;
        this.completedAt = LocalDateTime.now();
        this.progressPercentage = 100.0;
        if (startedAt != null) {
            this.durationMs = java.time.Duration.between(startedAt, completedAt).toMillis();
        }
    }

    public void fail(String errorMessage, String errorDetails) {
        this.status = JobStatus.FAILED;
        this.completedAt = LocalDateTime.now();
        this.errorMessage = errorMessage;
        this.errorDetails = errorDetails;
        if (startedAt != null) {
            this.durationMs = java.time.Duration.between(startedAt, completedAt).toMillis();
        }
    }

    public void scheduleRetry() {
        this.retryCount++;
        this.nextRetryAt = LocalDateTime.now().plusMinutes((long) Math.pow(2, retryCount)); // Exponential backoff
        this.status = JobStatus.PENDING;
    }

    public void updateProgress(long processed, long total) {
        this.recordsProcessed = processed;
        this.recordsTotal = total;
        if (total > 0) {
            this.progressPercentage = (processed * 100.0) / total;
        }
    }

    public double getSuccessRate() {
        if (recordsTotal == 0) return 0.0;
        return (recordsProcessed.doubleValue() / recordsTotal.doubleValue()) * 100.0;
    }

    public double getFailureRate() {
        if (recordsTotal == 0) return 0.0;
        return (recordsFailed.doubleValue() / recordsTotal.doubleValue()) * 100.0;
    }

    private String generateJobId() {
        return "JOB_" + System.currentTimeMillis() + "_" + (int)(Math.random() * 1000);
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public DataSource getDataSource() { return dataSource; }
    public void setDataSource(DataSource dataSource) { this.dataSource = dataSource; }

    public String getJobName() { return jobName; }
    public void setJobName(String jobName) { this.jobName = jobName; }

    public String getJobId() { return jobId; }
    public void setJobId(String jobId) { this.jobId = jobId; }

    public JobType getJobType() { return jobType; }
    public void setJobType(JobType jobType) { this.jobType = jobType; }

    public JobStatus getStatus() { return status; }
    public void setStatus(JobStatus status) { this.status = status; }

    public Integer getPriority() { return priority; }
    public void setPriority(Integer priority) { this.priority = priority; }

    public LocalDateTime getStartedAt() { return startedAt; }
    public void setStartedAt(LocalDateTime startedAt) { this.startedAt = startedAt; }

    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }

    public Long getDurationMs() { return durationMs; }
    public void setDurationMs(Long durationMs) { this.durationMs = durationMs; }

    public Long getRecordsTotal() { return recordsTotal; }
    public void setRecordsTotal(Long recordsTotal) { this.recordsTotal = recordsTotal; }

    public Long getRecordsProcessed() { return recordsProcessed; }
    public void setRecordsProcessed(Long recordsProcessed) { this.recordsProcessed = recordsProcessed; }

    public Long getRecordsFailed() { return recordsFailed; }
    public void setRecordsFailed(Long recordsFailed) { this.recordsFailed = recordsFailed; }

    public Long getRecordsSkipped() { return recordsSkipped; }
    public void setRecordsSkipped(Long recordsSkipped) { this.recordsSkipped = recordsSkipped; }

    public Long getBytesProcessed() { return bytesProcessed; }
    public void setBytesProcessed(Long bytesProcessed) { this.bytesProcessed = bytesProcessed; }

    public Double getProgressPercentage() { return progressPercentage; }
    public void setProgressPercentage(Double progressPercentage) { this.progressPercentage = progressPercentage; }

    public Integer getCurrentBatch() { return currentBatch; }
    public void setCurrentBatch(Integer currentBatch) { this.currentBatch = currentBatch; }

    public Integer getTotalBatches() { return totalBatches; }
    public void setTotalBatches(Integer totalBatches) { this.totalBatches = totalBatches; }

    public String getErrorMessage() { return errorMessage; }
    public void setErrorMessage(String errorMessage) { this.errorMessage = errorMessage; }

    public String getErrorDetails() { return errorDetails; }
    public void setErrorDetails(String errorDetails) { this.errorDetails = errorDetails; }

    public Integer getRetryCount() { return retryCount; }
    public void setRetryCount(Integer retryCount) { this.retryCount = retryCount; }

    public Integer getMaxRetries() { return maxRetries; }
    public void setMaxRetries(Integer maxRetries) { this.maxRetries = maxRetries; }

    public LocalDateTime getNextRetryAt() { return nextRetryAt; }
    public void setNextRetryAt(LocalDateTime nextRetryAt) { this.nextRetryAt = nextRetryAt; }

    public String getConfigurationJson() { return configurationJson; }
    public void setConfigurationJson(String configurationJson) { this.configurationJson = configurationJson; }

    public String getMetricsJson() { return metricsJson; }
    public void setMetricsJson(String metricsJson) { this.metricsJson = metricsJson; }

    public String getValidationResultsJson() { return validationResultsJson; }
    public void setValidationResultsJson(String validationResultsJson) { this.validationResultsJson = validationResultsJson; }

    public String getTransformationLogJson() { return transformationLogJson; }
    public void setTransformationLogJson(String transformationLogJson) { this.transformationLogJson = transformationLogJson; }

    public Double getQualityScore() { return qualityScore; }
    public void setQualityScore(Double qualityScore) { this.qualityScore = qualityScore; }

    public Double getDataCompletenessPercentage() { return dataCompletenessPercentage; }
    public void setDataCompletenessPercentage(Double dataCompletenessPercentage) { this.dataCompletenessPercentage = dataCompletenessPercentage; }

    public Double getDataAccuracyPercentage() { return dataAccuracyPercentage; }
    public void setDataAccuracyPercentage(Double dataAccuracyPercentage) { this.dataAccuracyPercentage = dataAccuracyPercentage; }

    public Boolean getHipaaComplianceChecked() { return hipaaComplianceChecked; }
    public void setHipaaComplianceChecked(Boolean hipaaComplianceChecked) { this.hipaaComplianceChecked = hipaaComplianceChecked; }

    public Boolean getPhiDetected() { return phiDetected; }
    public void setPhiDetected(Boolean phiDetected) { this.phiDetected = phiDetected; }

    public Boolean getPhiAnonymized() { return phiAnonymized; }
    public void setPhiAnonymized(Boolean phiAnonymized) { this.phiAnonymized = phiAnonymized; }

    public String getAuditTrailJson() { return auditTrailJson; }
    public void setAuditTrailJson(String auditTrailJson) { this.auditTrailJson = auditTrailJson; }

    public LocalDateTime getScheduledFor() { return scheduledFor; }
    public void setScheduledFor(LocalDateTime scheduledFor) { this.scheduledFor = scheduledFor; }

    public String getTriggeredBy() { return triggeredBy; }
    public void setTriggeredBy(String triggeredBy) { this.triggeredBy = triggeredBy; }

    public String getTriggerType() { return triggerType; }
    public void setTriggerType(String triggerType) { this.triggerType = triggerType; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public Long getVersion() { return version; }
    public void setVersion(Long version) { this.version = version; }

    // Enums
    public enum JobType {
        FULL_SYNC,
        INCREMENTAL_SYNC,
        REAL_TIME_STREAM,
        BATCH_IMPORT,
        DATA_VALIDATION,
        DATA_TRANSFORMATION,
        DATA_QUALITY_CHECK,
        BACKUP_SYNC
    }

    public enum JobStatus {
        PENDING,
        RUNNING,
        PROCESSING,
        COMPLETED,
        FAILED,
        CANCELLED,
        RETRY_SCHEDULED
    }
}
