package com.hospital.hms.registry.dto;

import com.hospital.hms.registry.entity.ReportType;
import com.hospital.hms.registry.entity.RegistryType;
import com.hospital.hms.registry.entity.PriorityLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.*;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * DTO for creating new public health reports
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PublicHealthReportCreateRequestDto {

    @NotNull(message = "Report type is required")
    private ReportType reportType;

    @NotNull(message = "Registry type is required")
    private RegistryType registryType;

    @NotNull(message = "Patient ID is required")
    private UUID patientId;

    private UUID encounterId;

    @NotNull(message = "Report date is required")
    private LocalDateTime reportDate;

    private LocalDateTime incidentDate;

    @NotBlank(message = "Report title is required")
    @Size(max = 500, message = "Report title cannot exceed 500 characters")
    private String reportTitle;

    @NotBlank(message = "Report data is required")
    private String reportData;

    @Size(max = 2000, message = "Report summary cannot exceed 2000 characters")
    private String reportSummary;

    private String clinicalFindings;

    @Size(max = 50, message = "Condition code cannot exceed 50 characters")
    private String conditionCode;

    @Size(max = 200, message = "Condition name cannot exceed 200 characters")
    private String conditionName;

    @Size(max = 20, message = "ICD-10 code cannot exceed 20 characters")
    private String icd10Code;

    @Size(max = 50, message = "SNOMED code cannot exceed 50 characters")
    private String snomedCode;

    // Patient Demographics
    @Min(value = 0, message = "Patient age must be non-negative")
    @Max(value = 200, message = "Patient age must be realistic")
    private Integer patientAge;

    @Size(max = 20, message = "Patient gender cannot exceed 20 characters")
    private String patientGender;

    @Size(max = 100, message = "Patient race cannot exceed 100 characters")
    private String patientRace;

    @Size(max = 100, message = "Patient ethnicity cannot exceed 100 characters")
    private String patientEthnicity;

    @Pattern(regexp = "\\d{5}(-\\d{4})?", message = "Invalid ZIP code format")
    private String patientZipCode;

    @Size(max = 100, message = "Patient county cannot exceed 100 characters")
    private String patientCounty;

    @Size(max = 2, message = "Patient state must be 2 characters")
    private String patientState;

    // Provider Information
    private UUID reportingProviderId;

    @Size(max = 200, message = "Provider name cannot exceed 200 characters")
    private String reportingProviderName;

    @Size(max = 200, message = "Facility name cannot exceed 200 characters")
    private String reportingFacility;

    @Pattern(regexp = "\\d{10}", message = "NPI must be 10 digits")
    private String reportingFacilityNpi;

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

    // Processing Options
    @Builder.Default
    private Boolean createFhirResource = false;

    @Builder.Default
    private Boolean validateOnCreate = true;

    private PriorityLevel priorityLevel;

    // Additional Metadata
    private String externalSystemId;
    private String sourceSystem;
    private String messageControlId;
    private String sendingApplication;
    private String receivingApplication;
}
