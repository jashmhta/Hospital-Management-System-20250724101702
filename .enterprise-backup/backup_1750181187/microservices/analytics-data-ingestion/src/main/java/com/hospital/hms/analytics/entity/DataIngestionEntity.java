package com.hospital.hms.analytics.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;

/**
 * Data Ingestion Entity
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Entity
@Table(name = "data_ingestion", indexes = {
    @Index(name = "idx_ingestion_batch_id", columnList = "batch_id"),
    @Index(name = "idx_ingestion_status", columnList = "status"),
    @Index(name = "idx_ingestion_source", columnList = "source_system"),
    @Index(name = "idx_ingestion_time", columnList = "ingestion_time")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DataIngestionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "ingestion_id")
    private String ingestionId;

    @Column(name = "batch_id")
    private String batchId;

    @NotNull
    @Column(name = "ingestion_time", nullable = false)
    private LocalDateTime ingestionTime;

    @Column(name = "data_list", columnDefinition = "TEXT")
    private String dataList; // JSON format

    @Column(name = "metadata", columnDefinition = "TEXT")
    private String metadata; // JSON format

    @Builder.Default
    @Column(name = "validate_data")
    private Boolean validateData = true;

    @Builder.Default
    @Column(name = "transform_data")
    private Boolean transformData = true;

    @Column(name = "correlation_id")
    private String correlationId;

    @Column(name = "source_system")
    private String sourceSystem;

    @Column(name = "processing_options", columnDefinition = "TEXT")
    private String processingOptions; // JSON format

    @NotBlank
    @Column(name = "status", nullable = false)
    private String status; // PENDING, PROCESSING, COMPLETED, FAILED

    @Column(name = "processed_at")
    private LocalDateTime processedAt;

    @Column(name = "processed_by")
    private String processedBy;

    @Column(name = "error_message", columnDefinition = "TEXT")
    private String errorMessage;

    @Builder.Default
    @Column(name = "retry_count")
    private Integer retryCount = 0;

    @Column(name = "priority")
    private Integer priority;

    @Column(name = "estimated_processing_time")
    private Integer estimatedProcessingTime; // in milliseconds

    @Column(name = "actual_processing_time")
    private Integer actualProcessingTime; // in milliseconds

    @Column(name = "record_count")
    private Integer recordCount;

    @Column(name = "success_count")
    private Integer successCount;

    @Column(name = "failure_count")
    private Integer failureCount;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
