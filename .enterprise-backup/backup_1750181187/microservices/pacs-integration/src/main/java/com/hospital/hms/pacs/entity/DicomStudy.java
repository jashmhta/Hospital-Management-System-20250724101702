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
 * DICOM Study Entity
 * 
 * Represents a DICOM study containing one or more series of medical images
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Entity
@Table(name = "dicom_studies", indexes = {
    @Index(name = "idx_study_instance_uid", columnList = "study_instance_uid", unique = true),
    @Index(name = "idx_patient_id", columnList = "patient_id"),
    @Index(name = "idx_accession_number", columnList = "accession_number"),
    @Index(name = "idx_study_date", columnList = "study_date"),
    @Index(name = "idx_modality", columnList = "modality"),
    @Index(name = "idx_study_status", columnList = "study_status"),
    @Index(name = "idx_referring_physician", columnList = "referring_physician_name"),
    @Index(name = "idx_institution", columnList = "institution_name")
})
@EntityListeners(AuditingEntityListener.class)
@Data
@EqualsAndHashCode(of = "id")
public class DicomStudy {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "study_instance_uid", unique = true, nullable = false, length = 100)
    @NotBlank(message = "Study Instance UID is required")
    @Size(max = 100, message = "Study Instance UID must not exceed 100 characters")
    private String studyInstanceUid;

    @Column(name = "patient_id", nullable = false)
    @NotNull(message = "Patient ID is required")
    private UUID patientId;

    @Column(name = "patient_name", length = 200)
    @Size(max = 200, message = "Patient name must not exceed 200 characters")
    private String patientName;

    @Column(name = "patient_birth_date")
    private LocalDateTime patientBirthDate;

    @Column(name = "patient_sex", length = 1)
    @Pattern(regexp = "^[MFO]$", message = "Patient sex must be M, F, or O")
    private String patientSex;

    @Column(name = "accession_number", length = 50)
    @Size(max = 50, message = "Accession number must not exceed 50 characters")
    private String accessionNumber;

    @Column(name = "study_id", length = 50)
    @Size(max = 50, message = "Study ID must not exceed 50 characters")
    private String studyId;

    @Column(name = "study_date", nullable = false)
    @NotNull(message = "Study date is required")
    private LocalDateTime studyDate;

    @Column(name = "study_time")
    private LocalDateTime studyTime;

    @Column(name = "study_description", length = 500)
    @Size(max = 500, message = "Study description must not exceed 500 characters")
    private String studyDescription;

    @Column(name = "modality", length = 20)
    @Enumerated(EnumType.STRING)
    private DicomModality modality;

    @Column(name = "body_part_examined", length = 100)
    @Size(max = 100, message = "Body part examined must not exceed 100 characters")
    private String bodyPartExamined;

    @Column(name = "study_status", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    @NotNull(message = "Study status is required")
    private StudyStatus studyStatus = StudyStatus.SCHEDULED;

    @Column(name = "priority", length = 20)
    @Enumerated(EnumType.STRING)
    private StudyPriority priority = StudyPriority.ROUTINE;

    @Column(name = "referring_physician_name", length = 200)
    @Size(max = 200, message = "Referring physician name must not exceed 200 characters")
    private String referringPhysicianName;

    @Column(name = "attending_physician_name", length = 200)
    @Size(max = 200, message = "Attending physician name must not exceed 200 characters")
    private String attendingPhysicianName;

    @Column(name = "operator_name", length = 200)
    @Size(max = 200, message = "Operator name must not exceed 200 characters")
    private String operatorName;

    @Column(name = "institution_name", length = 200)
    @Size(max = 200, message = "Institution name must not exceed 200 characters")
    private String institutionName;

    @Column(name = "department_name", length = 200)
    @Size(max = 200, message = "Department name must not exceed 200 characters")
    private String departmentName;

    @Column(name = "station_name", length = 100)
    @Size(max = 100, message = "Station name must not exceed 100 characters")
    private String stationName;

    @Column(name = "manufacturer", length = 100)
    @Size(max = 100, message = "Manufacturer must not exceed 100 characters")
    private String manufacturer;

    @Column(name = "manufacturer_model_name", length = 100)
    @Size(max = 100, message = "Manufacturer model name must not exceed 100 characters")
    private String manufacturerModelName;

    @Column(name = "software_version", length = 50)
    @Size(max = 50, message = "Software version must not exceed 50 characters")
    private String softwareVersion;

    // Study metrics
    @Column(name = "number_of_series")
    @Min(value = 0, message = "Number of series must be non-negative")
    private Integer numberOfSeries = 0;

    @Column(name = "number_of_instances")
    @Min(value = 0, message = "Number of instances must be non-negative")
    private Integer numberOfInstances = 0;

    @Column(name = "study_size_bytes")
    @Min(value = 0, message = "Study size must be non-negative")
    private Long studySizeBytes = 0L;

    // Quality and validation
    @Column(name = "quality_score")
    @DecimalMin(value = "0.0", message = "Quality score must be non-negative")
    @DecimalMax(value = "100.0", message = "Quality score must not exceed 100")
    private Double qualityScore;

    @Column(name = "is_validated", nullable = false)
    private Boolean isValidated = false;

    @Column(name = "validation_errors", columnDefinition = "TEXT")
    private String validationErrors;

    // Archive and storage
    @Column(name = "storage_location", length = 500)
    @Size(max = 500, message = "Storage location must not exceed 500 characters")
    private String storageLocation;

    @Column(name = "archive_status", length = 20)
    @Enumerated(EnumType.STRING)
    private ArchiveStatus archiveStatus = ArchiveStatus.ONLINE;

    @Column(name = "backup_location", length = 500)
    @Size(max = 500, message = "Backup location must not exceed 500 characters")
    private String backupLocation;

    @Column(name = "last_accessed_date")
    private LocalDateTime lastAccessedDate;

    @Column(name = "retention_until_date")
    private LocalDateTime retentionUntilDate;

    // Integration
    @Column(name = "ris_study_id", length = 50)
    @Size(max = 50, message = "RIS study ID must not exceed 50 characters")
    private String risStudyId;

    @Column(name = "order_id")
    private UUID orderId;

    @Column(name = "appointment_id")
    private UUID appointmentId;

    @Column(name = "encounter_id")
    private UUID encounterId;

    // FHIR Integration
    @Column(name = "fhir_imaging_study_id", length = 100)
    @Size(max = 100, message = "FHIR ImagingStudy ID must not exceed 100 characters")
    private String fhirImagingStudyId;

    @Column(name = "fhir_diagnostic_report_id", length = 100)
    @Size(max = 100, message = "FHIR DiagnosticReport ID must not exceed 100 characters")
    private String fhirDiagnosticReportId;

    // Workflow
    @Column(name = "workflow_state", length = 30)
    @Enumerated(EnumType.STRING)
    private WorkflowState workflowState = WorkflowState.RECEIVED;

    @Column(name = "is_urgent", nullable = false)
    private Boolean isUrgent = false;

    @Column(name = "is_external_study", nullable = false)
    private Boolean isExternalStudy = false;

    // Relationships
    @OneToMany(mappedBy = "study", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<DicomSeries> series = new ArrayList<>();

    @OneToMany(mappedBy = "study", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<StudyAnnotation> annotations = new ArrayList<>();

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
    public boolean isCompleted() {
        return StudyStatus.COMPLETED.equals(studyStatus);
    }

    public boolean isArchived() {
        return ArchiveStatus.ARCHIVED.equals(archiveStatus) || 
               ArchiveStatus.NEARLINE.equals(archiveStatus);
    }

    public boolean requiresReview() {
        return WorkflowState.PENDING_REVIEW.equals(workflowState) ||
               WorkflowState.IN_REVIEW.equals(workflowState);
    }

    public void incrementSeries() {
        this.numberOfSeries = (this.numberOfSeries == null ? 0 : this.numberOfSeries) + 1;
    }

    public void incrementInstances(int count) {
        this.numberOfInstances = (this.numberOfInstances == null ? 0 : this.numberOfInstances) + count;
    }

    public void addToSize(long bytes) {
        this.studySizeBytes = (this.studySizeBytes == null ? 0L : this.studySizeBytes) + bytes;
    }

    public double getSizeInMB() {
        return studySizeBytes != null ? studySizeBytes / (1024.0 * 1024.0) : 0.0;
    }

    public double getSizeInGB() {
        return studySizeBytes != null ? studySizeBytes / (1024.0 * 1024.0 * 1024.0) : 0.0;
    }
}