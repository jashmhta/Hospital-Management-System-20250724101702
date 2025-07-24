package com.hospital.hms.registry.dto;

import com.hospital.hms.registry.entity.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * DTO for public health report responses
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PublicHealthReportResponseDto {

    private UUID id;
    private ReportType reportType;
    private RegistryType registryType;
    private UUID patientId;
    private UUID encounterId;
    private LocalDateTime reportDate;
    private LocalDateTime incidentDate;
    private String reportTitle;
    private String reportSummary;
    private String clinicalFindings;
    private String conditionCode;
    private String conditionName;
    private String icd10Code;
    private String snomedCode;

    // Patient Demographics
    private Integer patientAge;
    private String patientGender;
    private String patientRace;
    private String patientEthnicity;
    private String patientZipCode;
    private String patientCounty;
    private String patientState;

    // Provider Information
    private UUID reportingProviderId;
    private String reportingProviderName;
    private String reportingFacility;
    private String reportingFacilityNpi;

    // Submission Information
    private SubmissionStatus submissionStatus;
    private LocalDateTime submissionDate;
    private String submissionMethod;
    private String submissionEndpoint;
    private String externalReferenceId;
    private String acknowledgmentId;
    private LocalDateTime acknowledgmentDate;

    // Validation Information
    private ValidationStatus validationStatus;
    private String validationErrors;
    private LocalDateTime validationDate;
    private Double qualityScore;

    // Priority and Compliance
    private PriorityLevel priorityLevel;
    private Boolean isMandatory;
    private LocalDateTime reportingDeadline;
    private ConfidentialityLevel confidentialityLevel;
    private Boolean requiresFollowup;

    // Registry Information
    private String registryJurisdiction;
    private String registryCaseId;
    private String registryContactInfo;

    // Laboratory Information
    private String labOrderNumber;
    private String labSpecimenId;
    private LocalDateTime specimenCollectionDate;
    private String testMethodology;
    private String labResultValue;
    private String labResultUnit;
    private String labReferenceRange;
    private LocalDateTime resultDate;

    // Immunization Information
    private String vaccineType;
    private String vaccineManufacturer;
    private String vaccineLotNumber;
    private LocalDateTime administrationDate;
    private String administrationSite;
    private String administrationRoute;
    private String vaccineDose;
    private String vaccineReaction;

    // Birth Registration Information
    private String birthCertificateNumber;
    private String birthHospital;
    private String motherName;
    private String fatherName;
    private Double birthWeight;
    private Integer gestationalAge;
    private String attendingPhysician;

    // Death Registration Information
    private String deathCertificateNumber;
    private LocalDateTime deathDate;
    private String deathLocation;
    private String causeOfDeath;
    private String immediateCoD;
    private String underlyingCoD;
    private String contributingFactors;
    private String mannerOfDeath;

    // Amendment Information
    private Boolean isAmendment;
    private UUID originalReportId;
    private String amendmentReason;

    // FHIR Integration
    private String fhirResourceId;
    private String fhirResourceType;

    // Audit Information
    private String createdBy;
    private LocalDateTime createdDate;
    private String lastModifiedBy;
    private LocalDateTime lastModifiedDate;

    // Status Indicators
    private Boolean isSubmitted;
    private Boolean isAcknowledged;
    private Boolean isProcessed;
    private Boolean isOverdue;

    // Additional Metadata
    private String externalSystemId;
    private String sourceSystem;
    private String messageControlId;
    private String notes;
}
