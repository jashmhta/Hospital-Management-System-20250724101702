package com.hospital.hms.pacs.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * DICOM Series Entity
 * 
 * Represents a series of DICOM instances within a study
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Entity
@Table(name = "dicom_series", indexes = {
    @Index(name = "idx_series_instance_uid", columnList = "series_instance_uid", unique = true),
    @Index(name = "idx_study_id", columnList = "study_id"),
    @Index(name = "idx_series_number", columnList = "series_number"),
    @Index(name = "idx_series_date", columnList = "series_date"),
    @Index(name = "idx_series_modality", columnList = "modality")
})
@EntityListeners(AuditingEntityListener.class)
@Data
@EqualsAndHashCode(of = "id")
public class DicomSeries {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "series_instance_uid", unique = true, nullable = false, length = 100)
    @NotBlank(message = "Series Instance UID is required")
    @Size(max = 100, message = "Series Instance UID must not exceed 100 characters")
    private String seriesInstanceUid;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "study_id", nullable = false)
    @NotNull(message = "Study is required")
    private DicomStudy study;

    @Column(name = "series_number")
    @Min(value = 1, message = "Series number must be positive")
    private Integer seriesNumber;

    @Column(name = "series_date")
    private LocalDateTime seriesDate;

    @Column(name = "series_time")
    private LocalDateTime seriesTime;

    @Column(name = "series_description", length = 500)
    @Size(max = 500, message = "Series description must not exceed 500 characters")
    private String seriesDescription;

    @Column(name = "modality", length = 20)
    @Enumerated(EnumType.STRING)
    private DicomModality modality;

    @Column(name = "body_part_examined", length = 100)
    @Size(max = 100, message = "Body part examined must not exceed 100 characters")
    private String bodyPartExamined;

    @Column(name = "patient_position", length = 20)
    @Size(max = 20, message = "Patient position must not exceed 20 characters")
    private String patientPosition;

    @Column(name = "view_position", length = 50)
    @Size(max = 50, message = "View position must not exceed 50 characters")
    private String viewPosition;

    @Column(name = "laterality", length = 1)
    @Pattern(regexp = "^[LR]$", message = "Laterality must be L or R")
    private String laterality;

    @Column(name = "protocol_name", length = 200)
    @Size(max = 200, message = "Protocol name must not exceed 200 characters")
    private String protocolName;

    @Column(name = "operator_name", length = 200)
    @Size(max = 200, message = "Operator name must not exceed 200 characters")
    private String operatorName;

    @Column(name = "performing_physician_name", length = 200)
    @Size(max = 200, message = "Performing physician name must not exceed 200 characters")
    private String performingPhysicianName;

    // Technical parameters
    @Column(name = "slice_thickness")
    @DecimalMin(value = "0.0", message = "Slice thickness must be non-negative")
    private Double sliceThickness;

    @Column(name = "spacing_between_slices")
    @DecimalMin(value = "0.0", message = "Spacing between slices must be non-negative")
    private Double spacingBetweenSlices;

    @Column(name = "repetition_time")
    @DecimalMin(value = "0.0", message = "Repetition time must be non-negative")
    private Double repetitionTime;

    @Column(name = "echo_time")
    @DecimalMin(value = "0.0", message = "Echo time must be non-negative")
    private Double echoTime;

    @Column(name = "magnetic_field_strength")
    @DecimalMin(value = "0.0", message = "Magnetic field strength must be non-negative")
    private Double magneticFieldStrength;

    @Column(name = "kvp")
    @DecimalMin(value = "0.0", message = "KVP must be non-negative")
    private Double kvp;

    @Column(name = "exposure_time")
    @DecimalMin(value = "0.0", message = "Exposure time must be non-negative")
    private Double exposureTime;

    @Column(name = "x_ray_tube_current")
    @DecimalMin(value = "0.0", message = "X-ray tube current must be non-negative")
    private Double xRayTubeCurrent;

    @Column(name = "contrast_agent", length = 200)
    @Size(max = 200, message = "Contrast agent must not exceed 200 characters")
    private String contrastAgent;

    @Column(name = "contrast_dose")
    @DecimalMin(value = "0.0", message = "Contrast dose must be non-negative")
    private Double contrastDose;

    // Series metrics
    @Column(name = "number_of_instances")
    @Min(value = 0, message = "Number of instances must be non-negative")
    private Integer numberOfInstances = 0;

    @Column(name = "series_size_bytes")
    @Min(value = 0, message = "Series size must be non-negative")
    private Long seriesSizeBytes = 0L;

    @Column(name = "compression_type", length = 50)
    @Size(max = 50, message = "Compression type must not exceed 50 characters")
    private String compressionType;

    // Quality metrics
    @Column(name = "image_quality_score")
    @DecimalMin(value = "0.0", message = "Image quality score must be non-negative")
    @DecimalMax(value = "100.0", message = "Image quality score must not exceed 100")
    private Double imageQualityScore;

    @Column(name = "is_key_series", nullable = false)
    private Boolean isKeySeries = false;

    @Column(name = "is_for_presentation", nullable = false)
    private Boolean isForPresentation = false;

    // Storage and processing
    @Column(name = "storage_path", length = 500)
    @Size(max = 500, message = "Storage path must not exceed 500 characters")
    private String storagePath;

    @Column(name = "processing_status", length = 20)
    @Enumerated(EnumType.STRING)
    private ProcessingStatus processingStatus = ProcessingStatus.PENDING;

    @Column(name = "reconstruction_type", length = 50)
    @Size(max = 50, message = "Reconstruction type must not exceed 50 characters")
    private String reconstructionType;

    @Column(name = "image_orientation", columnDefinition = "TEXT")
    private String imageOrientation;

    @Column(name = "pixel_spacing", length = 100)
    @Size(max = 100, message = "Pixel spacing must not exceed 100 characters")
    private String pixelSpacing;

    // Relationships
    @OneToMany(mappedBy = "series", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<DicomInstance> instances = new ArrayList<>();

    // Audit Fields
    @CreatedDate
    @Column(name = "created_date", nullable = false, updatable = false)
    private LocalDateTime createdDate;

    @LastModifiedDate
    @Column(name = "last_modified_date")
    private LocalDateTime lastModifiedDate;

    @Column(name = "created_by", length = 100)
    @Size(max = 100, message = "Created by must not exceed 100 characters")
    private String createdBy;

    @Column(name = "last_modified_by", length = 100)
    @Size(max = 100, message = "Last modified by must not exceed 100 characters")
    private String lastModifiedBy;

    @Column(name = "version")
    @Version
    private Long version;

    // Helper methods
    public void incrementInstances() {
        this.numberOfInstances = (this.numberOfInstances == null ? 0 : this.numberOfInstances) + 1;
    }

    public void addToSize(long bytes) {
        this.seriesSizeBytes = (this.seriesSizeBytes == null ? 0L : this.seriesSizeBytes) + bytes;
    }

    public double getSizeInMB() {
        return seriesSizeBytes != null ? seriesSizeBytes / (1024.0 * 1024.0) : 0.0;
    }

    public boolean isProcessed() {
        return ProcessingStatus.COMPLETED.equals(processingStatus);
    }

    public boolean isMultiFrame() {
        return numberOfInstances != null && numberOfInstances == 1 && seriesDescription != null && 
               seriesDescription.toLowerCase().contains("multiframe");
    }
}

/**
 * Processing Status enumeration for series processing lifecycle
 */
enum ProcessingStatus {
    PENDING,
    IN_PROGRESS,
    COMPLETED,
    FAILED,
    CANCELLED
}