package com.hospital.hms.pacs.dto;

import com.hospital.hms.pacs.entity.DicomModality;
import com.hospital.hms.pacs.entity.StudyPriority;
import jakarta.validation.constraints.*;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * DTO for creating DICOM study
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Data
@Builder
public class DicomStudyCreateRequestDto {

    @NotBlank(message = "Study Instance UID is required")
    @Size(max = 100, message = "Study Instance UID must not exceed 100 characters")
    private String studyInstanceUid;

    @NotNull(message = "Patient ID is required")
    private UUID patientId;

    @Size(max = 200, message = "Patient name must not exceed 200 characters")
    private String patientName;

    private LocalDateTime patientBirthDate;

    @Pattern(regexp = "^[MFO]$", message = "Patient sex must be M, F, or O")
    private String patientSex;

    @Size(max = 50, message = "Accession number must not exceed 50 characters")
    private String accessionNumber;

    @Size(max = 50, message = "Study ID must not exceed 50 characters")
    private String studyId;

    @NotNull(message = "Study date is required")
    private LocalDateTime studyDate;

    @Size(max = 500, message = "Study description must not exceed 500 characters")
    private String studyDescription;

    private DicomModality modality;

    @Size(max = 100, message = "Body part examined must not exceed 100 characters")
    private String bodyPartExamined;

    @Size(max = 200, message = "Referring physician name must not exceed 200 characters")
    private String referringPhysicianName;

    @Size(max = 200, message = "Institution name must not exceed 200 characters")
    private String institutionName;

    @Size(max = 200, message = "Department name must not exceed 200 characters")
    private String departmentName;

    private StudyPriority priority;

    private Boolean isUrgent = false;

    private UUID orderId;

    private UUID appointmentId;

    private UUID encounterId;

    private Boolean createFhirResource = false;
}
