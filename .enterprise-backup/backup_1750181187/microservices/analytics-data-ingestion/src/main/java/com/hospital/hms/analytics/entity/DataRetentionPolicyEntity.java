package com.hospital.hms.analytics.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;

/**
 * Data Retention Policy Entity
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Entity
@Table(name = "data_retention_policies", indexes = {
    @Index(name = "idx_retention_source_type", columnList = "source_type"),
    @Index(name = "idx_retention_active", columnList = "is_active"),
    @Index(name = "idx_retention_next_execution", columnList = "next_execution")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DataRetentionPolicyEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "policy_id")
    private String policyId;

    @NotBlank
    @Column(name = "source_type", nullable = false)
    private String sourceType;

    @NotNull
    @Min(1)
    @Column(name = "retention_days", nullable = false)
    private Integer retentionDays;

    @Builder.Default
    @Column(name = "archive_location")
    private String archiveLocation = "COLD_STORAGE";

    @Builder.Default
    @Column(name = "compress_data")
    private Boolean compressData = true;

    @Builder.Default
    @Column(name = "encrypt_archive")
    private Boolean encryptArchive = true;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Builder.Default
    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "created_by")
    private String createdBy;

    @Column(name = "updated_by")
    private String updatedBy;

    @Column(name = "last_executed")
    private LocalDateTime lastExecuted;

    @Column(name = "next_execution")
    private LocalDateTime nextExecution;

    @Builder.Default
    @Column(name = "execution_count")
    private Integer executionCount = 0;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
