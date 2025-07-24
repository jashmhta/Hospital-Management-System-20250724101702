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
 * Study Annotation Entity
 * 
 * Represents annotations, measurements, and reports associated with DICOM studies
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Entity
@Table(name = "study_annotations", indexes = {
    @Index(name = "idx_study_id", columnList = "study_id"),
    @Index(name = "idx_annotation_type", columnList = "annotation_type"),
    @Index(name = "idx_created_by", columnList = "created_by"),
    @Index(name = "idx_annotation_date", columnList = "annotation_date"),
    @Index(name = "idx_annotation_status", columnList = "annotation_status")
})
@EntityListeners(AuditingEntityListener.class)
@Data
@EqualsAndHashCode(of = "id")
public class StudyAnnotation {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "study_id", nullable = false)
    @NotNull(message = "Study is required")
    private DicomStudy study;

    @Column(name = "annotation_type", nullable = false, length = 50)
    @Enumerated(EnumType.STRING)
    @NotNull(message = "Annotation type is required")
    private AnnotationType annotationType;

    @Column(name = "annotation_title", length = 200)
    @Size(max = 200, message = "Annotation title must not exceed 200 characters")
    private String annotationTitle;

    @Column(name = "annotation_content", columnDefinition = "TEXT")
    @NotBlank(message = "Annotation content is required")
    private String annotationContent;

    @Column(name = "annotation_data", columnDefinition = "TEXT")
    private String annotationData; // JSON data for complex annotations

    @Column(name = "annotation_date", nullable = false)
    @NotNull(message = "Annotation date is required")
    private LocalDateTime annotationDate;

    @Column(name = "annotation_status", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private AnnotationStatus annotationStatus = AnnotationStatus.DRAFT;

    // Associated entities
    @Column(name = "series_instance_uid", length = 100)
    @Size(max = 100, message = "Series Instance UID must not exceed 100 characters")
    private String seriesInstanceUid;

    @Column(name = "sop_instance_uid", length = 100)
    @Size(max = 100, message = "SOP Instance UID must not exceed 100 characters")
    private String sopInstanceUid;

    @Column(name = "frame_number")
    @Min(value = 1, message = "Frame number must be positive")
    private Integer frameNumber;

    // Geometric annotations
    @Column(name = "coordinate_type", length = 20)
    @Size(max = 20, message = "Coordinate type must not exceed 20 characters")
    private String coordinateType; // PIXEL, PHYSICAL, etc.

    @Column(name = "coordinates", columnDefinition = "TEXT")
    private String coordinates; // JSON array of coordinates

    @Column(name = "shape_type", length = 20)
    @Enumerated(EnumType.STRING)
    private ShapeType shapeType;

    // Measurements
    @Column(name = "measurement_value")
    private Double measurementValue;

    @Column(name = "measurement_unit", length = 20)
    @Size(max = 20, message = "Measurement unit must not exceed 20 characters")
    private String measurementUnit;

    @Column(name = "measurement_accuracy")
    @DecimalMin(value = "0.0", message = "Measurement accuracy must be non-negative")
    @DecimalMax(value = "100.0", message = "Measurement accuracy must not exceed 100%")
    private Double measurementAccuracy;

    // Textual annotations
    @Column(name = "text_position", length = 100)
    @Size(max = 100, message = "Text position must not exceed 100 characters")
    private String textPosition;

    @Column(name = "font_size")
    @Min(value = 1, message = "Font size must be positive")
    private Integer fontSize;

    @Column(name = "font_color", length = 10)
    @Size(max = 10, message = "Font color must not exceed 10 characters")
    private String fontColor;

    // Clinical context
    @Column(name = "clinical_finding", length = 500)
    @Size(max = 500, message = "Clinical finding must not exceed 500 characters")
    private String clinicalFinding;

    @Column(name = "diagnosis_code", length = 20)
    @Size(max = 20, message = "Diagnosis code must not exceed 20 characters")
    private String diagnosisCode;

    @Column(name = "severity_level", length = 20)
    @Enumerated(EnumType.STRING)
    private SeverityLevel severityLevel;

    @Column(name = "confidence_level")
    @DecimalMin(value = "0.0", message = "Confidence level must be non-negative")
    @DecimalMax(value = "100.0", message = "Confidence level must not exceed 100%")
    private Double confidenceLevel;

    // Review and approval
    @Column(name = "is_key_image", nullable = false)
    private Boolean isKeyImage = false;

    @Column(name = "is_teaching_file", nullable = false)
    private Boolean isTeachingFile = false;

    @Column(name = "requires_approval", nullable = false)
    private Boolean requiresApproval = false;

    @Column(name = "approved_by", length = 100)
    @Size(max = 100, message = "Approved by must not exceed 100 characters")
    private String approvedBy;

    @Column(name = "approved_date")
    private LocalDateTime approvedDate;

    @Column(name = "approval_notes", columnDefinition = "TEXT")
    private String approvalNotes;

    // Collaboration
    @Column(name = "is_shared", nullable = false)
    private Boolean isShared = false;

    @Column(name = "shared_with", columnDefinition = "TEXT")
    private String sharedWith; // JSON array of user IDs

    @Column(name = "sharing_permissions", length = 50)
    @Size(max = 50, message = "Sharing permissions must not exceed 50 characters")
    private String sharingPermissions;

    // Templates and standards
    @Column(name = "template_id")
    private UUID templateId;

    @Column(name = "template_version", length = 20)
    @Size(max = 20, message = "Template version must not exceed 20 characters")
    private String templateVersion;

    @Column(name = "coding_scheme", length = 50)
    @Size(max = 50, message = "Coding scheme must not exceed 50 characters")
    private String codingScheme; // SNOMED, ICD-10, etc.

    @Column(name = "coding_value", length = 50)
    @Size(max = 50, message = "Coding value must not exceed 50 characters")
    private String codingValue;

    // AI and automated annotations
    @Column(name = "is_ai_generated", nullable = false)
    private Boolean isAiGenerated = false;

    @Column(name = "ai_model_name", length = 100)
    @Size(max = 100, message = "AI model name must not exceed 100 characters")
    private String aiModelName;

    @Column(name = "ai_model_version", length = 20)
    @Size(max = 20, message = "AI model version must not exceed 20 characters")
    private String aiModelVersion;

    @Column(name = "ai_confidence_score")
    @DecimalMin(value = "0.0", message = "AI confidence score must be non-negative")
    @DecimalMax(value = "1.0", message = "AI confidence score must not exceed 1.0")
    private Double aiConfidenceScore;

    // Quality and validation
    @Column(name = "quality_score")
    @DecimalMin(value = "0.0", message = "Quality score must be non-negative")
    @DecimalMax(value = "100.0", message = "Quality score must not exceed 100")
    private Double qualityScore;

    @Column(name = "validation_status", length = 20)
    @Enumerated(EnumType.STRING)
    private ValidationStatus validationStatus = ValidationStatus.PENDING;

    @Column(name = "validation_errors", columnDefinition = "TEXT")
    private String validationErrors;

    @Column(name = "validation_date")
    private LocalDateTime validationDate;

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
    public boolean isApproved() {
        return AnnotationStatus.APPROVED.equals(annotationStatus);
    }

    public boolean isPending() {
        return AnnotationStatus.DRAFT.equals(annotationStatus) || 
               AnnotationStatus.PENDING_APPROVAL.equals(annotationStatus);
    }

    public boolean isGeometric() {
        return shapeType != null && coordinates != null;
    }

    public boolean isMeasurement() {
        return measurementValue != null && measurementUnit != null;
    }

    public boolean isHighSeverity() {
        return SeverityLevel.HIGH.equals(severityLevel) || 
               SeverityLevel.CRITICAL.equals(severityLevel);
    }

    public boolean isHighConfidence() {
        return confidenceLevel != null && confidenceLevel >= 80.0;
    }

    public boolean needsReview() {
        return requiresApproval && !isApproved();
    }
}

/**
 * Annotation Type enumeration
 */
enum AnnotationType {
    TEXT,
    MEASUREMENT,
    ARROW,
    SHAPE,
    MARKUP,
    FINDING,
    DIAGNOSIS,
    REPORT,
    COMPARISON,
    REFERENCE,
    TEACHING,
    AI_ANALYSIS
}

/**
 * Annotation Status enumeration
 */
enum AnnotationStatus {
    DRAFT,
    PENDING_APPROVAL,
    APPROVED,
    REJECTED,
    ARCHIVED,
    DELETED
}

/**
 * Shape Type enumeration for geometric annotations
 */
enum ShapeType {
    POINT,
    LINE,
    RECTANGLE,
    ELLIPSE,
    POLYGON,
    ARROW,
    CIRCLE,
    FREEHAND,
    RULER,
    ANGLE,
    ROI
}

/**
 * Severity Level enumeration for clinical findings
 */
enum SeverityLevel {
    LOW,
    MODERATE,
    HIGH,
    CRITICAL,
    UNKNOWN
}

/**
 * Validation Status enumeration
 */
enum ValidationStatus {
    PENDING,
    VALID,
    INVALID,
    WARNING,
    ERROR
}
