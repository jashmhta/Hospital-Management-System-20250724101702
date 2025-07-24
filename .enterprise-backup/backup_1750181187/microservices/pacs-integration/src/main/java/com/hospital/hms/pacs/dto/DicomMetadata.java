package com.hospital.hms.pacs.dto;

import com.hospital.hms.pacs.entity.DicomModality;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * DTO for DICOM metadata extracted from files
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Data
@Builder
public class DicomMetadata {

    // Study level
    private String studyInstanceUid;
    private String patientName;
    private String patientId;
    private LocalDateTime patientBirthDate;
    private String patientSex;
    private LocalDateTime studyDate;
    private LocalDateTime studyTime;
    private String studyDescription;
    private String accessionNumber;
    private String referringPhysicianName;
    private String institutionName;

    // Series level
    private String seriesInstanceUid;
    private Integer seriesNumber;
    private LocalDateTime seriesDate;
    private LocalDateTime seriesTime;
    private String seriesDescription;
    private DicomModality modality;
    private String bodyPartExamined;
    private String protocolName;

    // Instance level
    private String sopInstanceUid;
    private String sopClassUid;
    private Integer instanceNumber;
    private LocalDateTime contentDate;
    private LocalDateTime contentTime;

    // Image characteristics
    private Integer rows;
    private Integer columns;
    private Integer bitsAllocated;
    private Integer bitsStored;
    private String photometricInterpretation;
    private String pixelSpacing;
    private Double sliceThickness;
    private String transferSyntaxUid;
}
