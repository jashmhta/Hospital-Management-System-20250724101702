package com.hospital.hms.pacs.dto;

import com.hospital.hms.pacs.entity.*;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * DTO for DICOM study response
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Data
@Builder
public class DicomStudyResponseDto {

    private UUID id;
    private String studyInstanceUid;
    private UUID patientId;
    private String patientName;
    private LocalDateTime patientBirthDate;
    private String patientSex;
    private String accessionNumber;
    private String studyId;
    private LocalDateTime studyDate;
    private LocalDateTime studyTime;
    private String studyDescription;
    private DicomModality modality;
    private String bodyPartExamined;
    private StudyStatus studyStatus;
    private StudyPriority priority;
    private String referringPhysicianName;
    private String attendingPhysicianName;
    private String institutionName;
    private String departmentName;
    private Integer numberOfSeries;
    private Integer numberOfInstances;
    private Long studySizeBytes;
    private Double qualityScore;
    private Boolean isValidated;
    private String validationErrors;
    private ArchiveStatus archiveStatus;
    private LocalDateTime lastAccessedDate;
    private WorkflowState workflowState;
    private Boolean isUrgent;
    private Boolean isExternalStudy;
    private UUID orderId;
    private UUID appointmentId;
    private UUID encounterId;
    private String fhirImagingStudyId;
    private LocalDateTime createdDate;
    private LocalDateTime lastModifiedDate;
    private String createdBy;
    private String lastModifiedBy;
    private Long version;

    // Computed fields
    public double getSizeInMB() {
        return studySizeBytes != null ? studySizeBytes / (1024.0 * 1024.0) : 0.0;
    }

    public double getSizeInGB() {
        return studySizeBytes != null ? studySizeBytes / (1024.0 * 1024.0 * 1024.0) : 0.0;
    }

    public boolean isCompleted() {
        return StudyStatus.COMPLETED.equals(studyStatus);
    }

    public boolean requiresReview() {
        return WorkflowState.PENDING_REVIEW.equals(workflowState) ||
               WorkflowState.IN_REVIEW.equals(workflowState);
    }
}
