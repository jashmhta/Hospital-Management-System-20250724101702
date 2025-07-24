package com.hospital.hms.registry.entity;

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
 * Public Health Report Entity
 * 
 * Represents public health reporting submissions to state registries
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Entity
@Table(name = "public_health_reports", indexes = {
    @Index(name = "idx_report_type", columnList = "report_type"),
    @Index(name = "idx_patient_id", columnList = "patient_id"),
    @Index(name = "idx_submission_status", columnList = "submission_status"),
    @Index(name = "idx_report_date", columnList = "report_date"),
    @Index(name = "idx_registry_type", columnList = "registry_type"),
    @Index(name = "idx_external_ref", columnList = "external_reference_id")
})
@EntityListeners(AuditingEntityListener.class)
@Data
@EqualsAndHashCode(of = "id")
public class PublicHealthReport {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "report_type", nullable = false, length = 50)
    @Enumerated(EnumType.STRING)
    @NotNull(message = "Report type is required")
    private ReportType reportType;

    @Column(name = "registry_type", nullable = false, length = 50)
    @Enumerated(EnumType.STRING)
    @NotNull(message = "Registry type is required")
    private RegistryType registryType;

    @Column(name = "patient_id")
    private UUID patientId;

    @Column(name = "encounter_id")
    private UUID encounterId;

    @Column(name = "report_date", nullable = false)
    @NotNull(message = "Report date is required")
    private LocalDateTime reportDate;

    @Column(name = "incident_date")
    private LocalDateTime incidentDate;

    @Column(name = "submission_status", nullable = false, length = 30)
    @Enumerated(EnumType.STRING)
    private SubmissionStatus submissionStatus = SubmissionStatus.DRAFT;

    @Column(name = "priority_level", length = 20)
    @Enumerated(EnumType.STRING)
    private PriorityLevel priorityLevel = PriorityLevel.ROUTINE;

    // Report Content
    @Column(name = "report_title", length = 300)
    @Size(max = 300, message = "Report title must not exceed 300 characters")
    private String reportTitle;

    @Column(name = "report_data", columnDefinition = "TEXT")
    private String reportData; // JSON format

    @Column(name = "report_summary", columnDefinition = "TEXT")
    private String reportSummary;

    @Column(name = "clinical_findings", columnDefinition = "TEXT")
    private String clinicalFindings;

    // Registry Specific Fields
    @Column(name = "registry_case_id", length = 100)
    @Size(max = 100, message = "Registry case ID must not exceed 100 characters")
    private String registryCaseId;

    @Column(name = "external_reference_id", length = 100)
    @Size(max = 100, message = "External reference ID must not exceed 100 characters")
    private String externalReferenceId;

    @Column(name = "registry_jurisdiction", length = 100)
    @Size(max = 100, message = "Registry jurisdiction must not exceed 100 characters")
    private String registryJurisdiction;

    // Disease/Condition Information
    @Column(name = "condition_code", length = 20)
    @Size(max = 20, message = "Condition code must not exceed 20 characters")
    private String conditionCode;

    @Column(name = "condition_name", length = 200)
    @Size(max = 200, message = "Condition name must not exceed 200 characters")
    private String conditionName;

    @Column(name = "icd_10_code", length = 10)
    @Size(max = 10, message = "ICD-10 code must not exceed 10 characters")
    private String icd10Code;

    @Column(name = "snomed_code", length = 20)
    @Size(max = 20, message = "SNOMED code must not exceed 20 characters")
    private String snomedCode;

    // Patient Demographics
    @Column(name = "patient_age")
    @Min(value = 0, message = "Patient age must be non-negative")
    @Max(value = 150, message = "Patient age must not exceed 150")
    private Integer patientAge;

    @Column(name = "patient_gender", length = 1)
    @Pattern(regexp = "^[MFO]$", message = "Patient gender must be M, F, or O")
    private String patientGender;

    @Column(name = "patient_race", length = 50)
    @Size(max = 50, message = "Patient race must not exceed 50 characters")
    private String patientRace;

    @Column(name = "patient_ethnicity", length = 50)
    @Size(max = 50, message = "Patient ethnicity must not exceed 50 characters")
    private String patientEthnicity;

    @Column(name = "patient_zip_code", length = 10)
    @Size(max = 10, message = "Patient ZIP code must not exceed 10 characters")
    private String patientZipCode;

    @Column(name = "patient_county", length = 100)
    @Size(max = 100, message = "Patient county must not exceed 100 characters")
    private String patientCounty;

    @Column(name = "patient_state", length = 50)
    @Size(max = 50, message = "Patient state must not exceed 50 characters")
    private String patientState;

    // Provider Information
    @Column(name = "reporting_provider_id")
    private UUID reportingProviderId;

    @Column(name = "reporting_provider_name", length = 200)
    @Size(max = 200, message = "Reporting provider name must not exceed 200 characters")
    private String reportingProviderName;

    @Column(name = "reporting_facility", length = 200)
    @Size(max = 200, message = "Reporting facility must not exceed 200 characters")
    private String reportingFacility;

    @Column(name = "reporting_facility_npi", length = 20)
    @Size(max = 20, message = "Reporting facility NPI must not exceed 20 characters")
    private String reportingFacilityNpi;

    // Submission Details
    @Column(name = "submission_date")
    private LocalDateTime submissionDate;

    @Column(name = "submission_method", length = 30)
    @Size(max = 30, message = "Submission method must not exceed 30 characters")
    private String submissionMethod;

    @Column(name = "submission_endpoint", length = 300)
    @Size(max = 300, message = "Submission endpoint must not exceed 300 characters")
    private String submissionEndpoint;

    @Column(name = "acknowledgment_id", length = 100)
    @Size(max = 100, message = "Acknowledgment ID must not exceed 100 characters")
    private String acknowledgmentId;

    @Column(name = "acknowledgment_date")
    private LocalDateTime acknowledgmentDate;

    // Validation and Quality
    @Column(name = "validation_status", length = 20)
    @Enumerated(EnumType.STRING)
    private ValidationStatus validationStatus = ValidationStatus.PENDING;

    @Column(name = "validation_errors", columnDefinition = "TEXT")
    private String validationErrors;

    @Column(name = "validation_date")
    private LocalDateTime validationDate;

    @Column(name = "quality_score")
    @DecimalMin(value = "0.0", message = "Quality score must be non-negative")
    @DecimalMax(value = "100.0", message = "Quality score must not exceed 100")
    private Double qualityScore;

    // Follow-up and Updates
    @Column(name = "requires_followup", nullable = false)
    private Boolean requiresFollowup = false;

    @Column(name = "followup_date")
    private LocalDateTime followupDate;

    @Column(name = "followup_notes", columnDefinition = "TEXT")
    private String followupNotes;

    @Column(name = "is_amendment", nullable = false)
    private Boolean isAmendment = false;

    @Column(name = "original_report_id")
    private UUID originalReportId;

    @Column(name = "amendment_reason", columnDefinition = "TEXT")
    private String amendmentReason;

    // Compliance and Legal
    @Column(name = "is_mandatory", nullable = false)
    private Boolean isMandatory = false;

    @Column(name = "reporting_deadline")
    private LocalDateTime reportingDeadline;

    @Column(name = "legal_requirement", columnDefinition = "TEXT")
    private String legalRequirement;

    @Column(name = "confidentiality_level", length = 20)
    @Enumerated(EnumType.STRING)
    private ConfidentialityLevel confidentialityLevel = ConfidentialityLevel.NORMAL;

    // FHIR Integration
    @Column(name = "fhir_resource_id", length = 100)
    @Size(max = 100, message = "FHIR resource ID must not exceed 100 characters")
    private String fhirResourceId;

    @Column(name = "fhir_resource_type", length = 50)
    @Size(max = 50, message = "FHIR resource type must not exceed 50 characters")
    private String fhirResourceType;

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
    public boolean isSubmitted() {
        return SubmissionStatus.SUBMITTED.equals(submissionStatus) ||
               SubmissionStatus.ACKNOWLEDGED.equals(submissionStatus) ||
               SubmissionStatus.PROCESSED.equals(submissionStatus);
    }

    public boolean isPending() {
        return SubmissionStatus.DRAFT.equals(submissionStatus) ||
               SubmissionStatus.PENDING_VALIDATION.equals(submissionStatus);
    }

    public boolean isOverdue() {
        return reportingDeadline != null && 
               LocalDateTime.now().isAfter(reportingDeadline) && 
               !isSubmitted();
    }

    public boolean isHighPriority() {
        return PriorityLevel.URGENT.equals(priorityLevel) ||
               PriorityLevel.STAT.equals(priorityLevel);
    }

    public boolean isValidated() {
        return ValidationStatus.VALID.equals(validationStatus);
    }

    public boolean needsAttention() {
        return isOverdue() || isHighPriority() || requiresFollowup ||
               ValidationStatus.INVALID.equals(validationStatus);
    }
}

/**
 * Report Type enumeration
 */
enum ReportType {
    BIRTH_REGISTRATION,
    DEATH_REGISTRATION,
    IMMUNIZATION_RECORD,
    DISEASE_SURVEILLANCE,
    CANCER_REGISTRATION,
    VITAL_STATISTICS,
    INFECTIOUS_DISEASE,
    INJURY_SURVEILLANCE,
    ENVIRONMENTAL_HEALTH,
    OCCUPATIONAL_HEALTH,
    MATERNAL_MORTALITY,
    CHILD_ABUSE,
    ELDER_ABUSE,
    DOMESTIC_VIOLENCE,
    SUBSTANCE_ABUSE,
    MENTAL_HEALTH,
    FOODBORNE_ILLNESS,
    HEALTHCARE_ACQUIRED_INFECTION,
    MEDICAL_DEVICE_ADVERSE_EVENT,
    DRUG_ADVERSE_EVENT
}

/**
 * Registry Type enumeration
 */
enum RegistryType {
    STATE_VITAL_RECORDS,
    CDC_SURVEILLANCE,
    IMMUNIZATION_REGISTRY,
    CANCER_REGISTRY,
    BIRTH_DEFECTS_REGISTRY,
    TRAUMA_REGISTRY,
    DISEASE_REGISTRY,
    ENVIRONMENTAL_HEALTH,
    OCCUPATIONAL_SAFETY,
    MATERNAL_MORTALITY_REVIEW,
    CHILD_DEATH_REVIEW,
    PRESCRIPTION_MONITORING,
    HEALTHCARE_QUALITY,
    PUBLIC_HEALTH_EMERGENCY
}

/**
 * Submission Status enumeration
 */
enum SubmissionStatus {
    DRAFT,
    PENDING_VALIDATION,
    VALIDATION_FAILED,
    READY_FOR_SUBMISSION,
    SUBMITTING,
    SUBMITTED,
    ACKNOWLEDGED,
    PROCESSED,
    REJECTED,
    ERROR,
    CANCELLED
}

/**
 * Priority Level enumeration
 */
enum PriorityLevel {
    ROUTINE,
    PRIORITY,
    URGENT,
    STAT,
    IMMEDIATE
}

/**
 * Validation Status enumeration
 */
enum ValidationStatus {
    PENDING,
    VALID,
    INVALID,
    WARNING,
    REQUIRES_REVIEW
}

/**
 * Confidentiality Level enumeration
 */
enum ConfidentialityLevel {
    PUBLIC,
    NORMAL,
    RESTRICTED,
    CONFIDENTIAL,
    SECRET
}
