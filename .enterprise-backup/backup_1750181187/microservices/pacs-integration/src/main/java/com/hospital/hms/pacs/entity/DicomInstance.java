package com.hospital.hms.pacs.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * DICOM Instance Entity
 * 
 * Represents an individual DICOM image instance within a series
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Entity
@Table(name = "dicom_instances", indexes = {
    @Index(name = "idx_sop_instance_uid", columnList = "sop_instance_uid", unique = true),
    @Index(name = "idx_series_id", columnList = "series_id"),
    @Index(name = "idx_instance_number", columnList = "instance_number"),
    @Index(name = "idx_acquisition_number", columnList = "acquisition_number"),
    @Index(name = "idx_content_date", columnList = "content_date")
})
@EntityListeners(AuditingEntityListener.class)
@Data
@EqualsAndHashCode(of = "id")
public class DicomInstance {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "sop_instance_uid", unique = true, nullable = false, length = 100)
    @NotBlank(message = "SOP Instance UID is required")
    @Size(max = 100, message = "SOP Instance UID must not exceed 100 characters")
    private String sopInstanceUid;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "series_id", nullable = false)
    @NotNull(message = "Series is required")
    private DicomSeries series;

    @Column(name = "sop_class_uid", length = 100)
    @Size(max = 100, message = "SOP Class UID must not exceed 100 characters")
    private String sopClassUid;

    @Column(name = "instance_number")
    @Min(value = 1, message = "Instance number must be positive")
    private Integer instanceNumber;

    @Column(name = "acquisition_number")
    @Min(value = 0, message = "Acquisition number must be non-negative")
    private Integer acquisitionNumber;

    @Column(name = "content_date")
    private LocalDateTime contentDate;

    @Column(name = "content_time")
    private LocalDateTime contentTime;

    @Column(name = "acquisition_date")
    private LocalDateTime acquisitionDate;

    @Column(name = "acquisition_time")
    private LocalDateTime acquisitionTime;

    // Image characteristics
    @Column(name = "rows")
    @Min(value = 1, message = "Rows must be positive")
    private Integer rows;

    @Column(name = "columns")
    @Min(value = 1, message = "Columns must be positive")
    private Integer columns;

    @Column(name = "bits_allocated")
    @Min(value = 1, message = "Bits allocated must be positive")
    private Integer bitsAllocated;

    @Column(name = "bits_stored")
    @Min(value = 1, message = "Bits stored must be positive")
    private Integer bitsStored;

    @Column(name = "high_bit")
    @Min(value = 0, message = "High bit must be non-negative")
    private Integer highBit;

    @Column(name = "pixel_representation")
    @Min(value = 0, message = "Pixel representation must be non-negative")
    @Max(value = 1, message = "Pixel representation must be 0 or 1")
    private Integer pixelRepresentation;

    @Column(name = "samples_per_pixel")
    @Min(value = 1, message = "Samples per pixel must be positive")
    private Integer samplesPerPixel;

    @Column(name = "photometric_interpretation", length = 50)
    @Size(max = 50, message = "Photometric interpretation must not exceed 50 characters")
    private String photometricInterpretation;

    @Column(name = "planar_configuration")
    @Min(value = 0, message = "Planar configuration must be non-negative")
    @Max(value = 1, message = "Planar configuration must be 0 or 1")
    private Integer planarConfiguration;

    @Column(name = "number_of_frames")
    @Min(value = 1, message = "Number of frames must be positive")
    private Integer numberOfFrames;

    // Physical measurements
    @Column(name = "pixel_spacing", length = 100)
    @Size(max = 100, message = "Pixel spacing must not exceed 100 characters")
    private String pixelSpacing;

    @Column(name = "slice_thickness")
    @DecimalMin(value = "0.0", message = "Slice thickness must be non-negative")
    private Double sliceThickness;

    @Column(name = "slice_location")
    private Double sliceLocation;

    @Column(name = "image_position", columnDefinition = "TEXT")
    private String imagePosition;

    @Column(name = "image_orientation", columnDefinition = "TEXT")
    private String imageOrientation;

    @Column(name = "frame_of_reference_uid", length = 100)
    @Size(max = 100, message = "Frame of reference UID must not exceed 100 characters")
    private String frameOfReferenceUid;

    // Technical parameters
    @Column(name = "window_center")
    private Double windowCenter;

    @Column(name = "window_width")
    @DecimalMin(value = "0.0", message = "Window width must be non-negative")
    private Double windowWidth;

    @Column(name = "rescale_intercept")
    private Double rescaleIntercept;

    @Column(name = "rescale_slope")
    private Double rescaleSlope;

    @Column(name = "rescale_type", length = 20)
    @Size(max = 20, message = "Rescale type must not exceed 20 characters")
    private String rescaleType;

    // Quality and processing
    @Column(name = "image_quality", length = 20)
    @Size(max = 20, message = "Image quality must not exceed 20 characters")
    private String imageQuality;

    @Column(name = "lossy_image_compression", length = 5)
    @Pattern(regexp = "^(00|01)$", message = "Lossy image compression must be 00 or 01")
    private String lossyImageCompression;

    @Column(name = "lossy_image_compression_ratio")
    @DecimalMin(value = "1.0", message = "Lossy image compression ratio must be at least 1.0")
    private Double lossyImageCompressionRatio;

    @Column(name = "transfer_syntax_uid", length = 100)
    @Size(max = 100, message = "Transfer syntax UID must not exceed 100 characters")
    private String transferSyntaxUid;

    // Storage and file information
    @Column(name = "file_path", length = 1000)
    @Size(max = 1000, message = "File path must not exceed 1000 characters")
    private String filePath;

    @Column(name = "file_size_bytes")
    @Min(value = 0, message = "File size must be non-negative")
    private Long fileSizeBytes;

    @Column(name = "file_hash", length = 64)
    @Size(max = 64, message = "File hash must not exceed 64 characters")
    private String fileHash;

    @Column(name = "storage_location", length = 500)
    @Size(max = 500, message = "Storage location must not exceed 500 characters")
    private String storageLocation;

    @Column(name = "compression_method", length = 50)
    @Size(max = 50, message = "Compression method must not exceed 50 characters")
    private String compressionMethod;

    // Access and caching
    @Column(name = "last_accessed_date")
    private LocalDateTime lastAccessedDate;

    @Column(name = "access_count")
    @Min(value = 0, message = "Access count must be non-negative")
    private Long accessCount = 0L;

    @Column(name = "is_cached", nullable = false)
    private Boolean isCached = false;

    @Column(name = "cache_location", length = 500)
    @Size(max = 500, message = "Cache location must not exceed 500 characters")
    private String cacheLocation;

    // Processing status
    @Column(name = "processing_status", length = 20)
    @Enumerated(EnumType.STRING)
    private InstanceProcessingStatus processingStatus = InstanceProcessingStatus.RECEIVED;

    @Column(name = "processing_errors", columnDefinition = "TEXT")
    private String processingErrors;

    @Column(name = "processing_date")
    private LocalDateTime processingDate;

    // Validation
    @Column(name = "is_validated", nullable = false)
    private Boolean isValidated = false;

    @Column(name = "validation_errors", columnDefinition = "TEXT")
    private String validationErrors;

    @Column(name = "validation_date")
    private LocalDateTime validationDate;

    // Privacy and anonymization
    @Column(name = "is_anonymized", nullable = false)
    private Boolean isAnonymized = false;

    @Column(name = "anonymization_method", length = 100)
    @Size(max = 100, message = "Anonymization method must not exceed 100 characters")
    private String anonymizationMethod;

    @Column(name = "anonymization_date")
    private LocalDateTime anonymizationDate;

    // Burn-in annotations
    @Column(name = "burned_in_annotation", length = 5)
    @Pattern(regexp = "^(YES|NO)$", message = "Burned in annotation must be YES or NO")
    private String burnedInAnnotation;

    // Multi-frame specific
    @Column(name = "frame_time")
    @DecimalMin(value = "0.0", message = "Frame time must be non-negative")
    private Double frameTime;

    @Column(name = "frame_delay")
    @DecimalMin(value = "0.0", message = "Frame delay must be non-negative")
    private Double frameDelay;

    // Presentation state
    @Column(name = "presentation_lut_shape", length = 20)
    @Size(max = 20, message = "Presentation LUT shape must not exceed 20 characters")
    private String presentationLutShape;

    // Overlay information
    @Column(name = "overlay_data", columnDefinition = "TEXT")
    private String overlayData;

    @Column(name = "has_overlay", nullable = false)
    private Boolean hasOverlay = false;

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
    public void incrementAccessCount() {
        this.accessCount = (this.accessCount == null ? 0L : this.accessCount) + 1;
        this.lastAccessedDate = LocalDateTime.now();
    }

    public double getFileSizeInMB() {
        return fileSizeBytes != null ? fileSizeBytes / (1024.0 * 1024.0) : 0.0;
    }

    public boolean isMultiFrame() {
        return numberOfFrames != null && numberOfFrames > 1;
    }

    public boolean isColor() {
        return samplesPerPixel != null && samplesPerPixel > 1;
    }

    public boolean isCompressed() {
        return transferSyntaxUid != null && !transferSyntaxUid.equals("1.2.840.10008.1.2");
    }

    public boolean hasLossyCompression() {
        return "01".equals(lossyImageCompression);
    }

    public boolean isProcessed() {
        return InstanceProcessingStatus.PROCESSED.equals(processingStatus);
    }

    public double getCompressionRatio() {
        if (lossyImageCompressionRatio != null) {
            return lossyImageCompressionRatio;
        }
        return 1.0; // No compression
    }

    public int getTotalPixels() {
        if (rows != null && columns != null) {
            int frames = numberOfFrames != null ? numberOfFrames : 1;
            return rows * columns * frames;
        }
        return 0;
    }

    public long getUncompressedSizeBytes() {
        if (rows != null && columns != null && bitsAllocated != null) {
            int frames = numberOfFrames != null ? numberOfFrames : 1;
            int samples = samplesPerPixel != null ? samplesPerPixel : 1;
            return (long) rows * columns * frames * samples * (bitsAllocated / 8);
        }
        return 0L;
    }
}

/**
 * Instance Processing Status enumeration
 */
enum InstanceProcessingStatus {
    RECEIVED,
    PARSING,
    PARSED,
    VALIDATING,
    VALIDATED,
    PROCESSING,
    PROCESSED,
    STORING,
    STORED,
    FAILED,
    CORRUPTED
}
