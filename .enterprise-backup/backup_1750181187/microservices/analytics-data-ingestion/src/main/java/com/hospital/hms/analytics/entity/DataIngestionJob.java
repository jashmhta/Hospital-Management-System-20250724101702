package com.hospital.hms.analytics.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Data Ingestion Job Entity for Analytics Processing
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Entity
@Table(name = "data_ingestion_jobs", indexes = {
    @Index(name = "idx_job_status", columnList = "jobStatus"),
    @Index(name = "idx_data_source", columnList = "dataSource"),
    @Index(name = "idx_start_time", columnList = "startTime"),
    @Index(name = "idx_job_type", columnList = "jobType")
})
@EntityListeners(AuditingEntityListener.class)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DataIngestionJob {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotNull
    @Size(max = 100)
    @Column(name = "job_name", nullable = false)
    private String jobName;

    @Enumerated(EnumType.STRING)
    @Column(name = "job_type")
    private JobType jobType;

    @Enumerated(EnumType.STRING)
    @Column(name = "job_status")
    private JobStatus jobStatus;

    @Size(max = 100)
    @Column(name = "data_source")
    private String dataSource;

    @Size(max = 100)
    @Column(name = "data_target")
    private String dataTarget;

    @Column(name = "start_time")
    private LocalDateTime startTime;

    @Column(name = "end_time")
    private LocalDateTime endTime;

    @Column(name = "records_processed")
    private Long recordsProcessed;

    @Column(name = "records_failed")
    private Long recordsFailed;

    @Column(name = "data_size_bytes")
    private Long dataSizeBytes;

    @Size(max = 500)
    @Column(name = "configuration")
    private String configuration;

    @Column(name = "error_message", columnDefinition = "TEXT")
    private String errorMessage;

    @Column(name = "execution_log", columnDefinition = "TEXT")
    private String executionLog;

    @Enumerated(EnumType.STRING)
    @Column(name = "priority_level")
    private PriorityLevel priorityLevel;

    @Column(name = "retry_count")
    private Integer retryCount;

    @Column(name = "max_retries")
    private Integer maxRetries;

    @Column(name = "next_retry_time")
    private LocalDateTime nextRetryTime;

    @Column(name = "scheduled_time")
    private LocalDateTime scheduledTime;

    @Column(name = "is_recurring")
    private Boolean isRecurring;

    @Size(max = 100)
    @Column(name = "cron_expression")
    private String cronExpression;

    @CreatedBy
    @Size(max = 100)
    @Column(name = "created_by", updatable = false)
    private String createdBy;

    @CreatedDate
    @Column(name = "created_date", updatable = false)
    private LocalDateTime createdDate;

    @LastModifiedBy
    @Size(max = 100)
    @Column(name = "last_modified_by")
    private String lastModifiedBy;

    @LastModifiedDate
    @Column(name = "last_modified_date")
    private LocalDateTime lastModifiedDate;

    // Helper Methods
    public boolean isRunning() {
        return jobStatus == JobStatus.RUNNING;
    }

    public boolean isCompleted() {
        return jobStatus == JobStatus.COMPLETED;
    }

    public boolean isFailed() {
        return jobStatus == JobStatus.FAILED;
    }

    public Long getDurationSeconds() {
        if (startTime != null && endTime != null) {
            return java.time.Duration.between(startTime, endTime).getSeconds();
        }
        return null;
    }

    public Double getSuccessRate() {
        if (recordsProcessed != null && recordsProcessed > 0) {
            long successful = recordsProcessed - (recordsFailed != null ? recordsFailed : 0);
            return (successful * 100.0) / recordsProcessed;
        }
        return null;
    }
}
