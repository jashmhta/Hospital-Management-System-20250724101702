package com.hospital.hms.pacs.service;

import com.hospital.hms.pacs.dto.DicomMetadata;
import com.hospital.hms.pacs.entity.DicomModality;
import com.hospital.hms.pacs.exception.DicomProcessingException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.dcm4che3.data.Attributes;
import org.dcm4che3.data.Tag;
import org.dcm4che3.io.DicomInputStream;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * DICOM Processing Service
 * 
 * Handles DICOM file parsing and metadata extraction
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class DicomProcessingService {

    private static final DateTimeFormatter DICOM_DATE_FORMAT = DateTimeFormatter.ofPattern("yyyyMMdd");
    private static final DateTimeFormatter DICOM_TIME_FORMAT = DateTimeFormatter.ofPattern("HHmmss");

    /**
     * Parse DICOM file and extract metadata
     */
    public DicomMetadata parseDicomFile(MultipartFile file) {
        log.debug("Parsing DICOM file: {}", file.getOriginalFilename());
        
        try (DicomInputStream dis = new DicomInputStream(file.getInputStream())) {
            Attributes attrs = dis.readDataset(-1, -1);
            
            return DicomMetadata.builder()
                .studyInstanceUid(attrs.getString(Tag.StudyInstanceUID))
                .seriesInstanceUid(attrs.getString(Tag.SeriesInstanceUID))
                .sopInstanceUid(attrs.getString(Tag.SOPInstanceUID))
                .sopClassUid(attrs.getString(Tag.SOPClassUID))
                .patientName(attrs.getString(Tag.PatientName))
                .patientId(attrs.getString(Tag.PatientID))
                .patientBirthDate(parseDate(attrs.getString(Tag.PatientBirthDate)))
                .patientSex(attrs.getString(Tag.PatientSex))
                .studyDate(parseDate(attrs.getString(Tag.StudyDate)))
                .studyTime(parseTime(attrs.getString(Tag.StudyTime)))
                .studyDescription(attrs.getString(Tag.StudyDescription))
                .seriesDate(parseDate(attrs.getString(Tag.SeriesDate)))
                .seriesTime(parseTime(attrs.getString(Tag.SeriesTime)))
                .seriesDescription(attrs.getString(Tag.SeriesDescription))
                .seriesNumber(attrs.getInt(Tag.SeriesNumber, 0))
                .instanceNumber(attrs.getInt(Tag.InstanceNumber, 0))
                .modality(parseModality(attrs.getString(Tag.Modality)))
                .bodyPartExamined(attrs.getString(Tag.BodyPartExamined))
                .protocolName(attrs.getString(Tag.ProtocolName))
                .accessionNumber(attrs.getString(Tag.AccessionNumber))
                .referringPhysicianName(attrs.getString(Tag.ReferringPhysicianName))
                .institutionName(attrs.getString(Tag.InstitutionName))
                .rows(attrs.getInt(Tag.Rows, 0))
                .columns(attrs.getInt(Tag.Columns, 0))
                .bitsAllocated(attrs.getInt(Tag.BitsAllocated, 0))
                .bitsStored(attrs.getInt(Tag.BitsStored, 0))
                .photometricInterpretation(attrs.getString(Tag.PhotometricInterpretation))
                .pixelSpacing(attrs.getString(Tag.PixelSpacing))
                .sliceThickness(attrs.getDouble(Tag.SliceThickness, 0.0))
                .transferSyntaxUid(attrs.getString(Tag.TransferSyntaxUID))
                .contentDate(parseDate(attrs.getString(Tag.ContentDate)))
                .contentTime(parseTime(attrs.getString(Tag.ContentTime)))
                .build();
                
        } catch (IOException e) {
            log.error("Error parsing DICOM file", e);
            throw new DicomProcessingException("Failed to parse DICOM file", e);
        }
    }

    private LocalDateTime parseDate(String dateStr) {
        if (dateStr == null || dateStr.trim().isEmpty()) {
            return null;
        }
        try {
            return LocalDateTime.parse(dateStr, DICOM_DATE_FORMAT);
        } catch (Exception e) {
            log.warn("Failed to parse DICOM date: {}", dateStr);
            return null;
        }
    }

    private LocalDateTime parseTime(String timeStr) {
        if (timeStr == null || timeStr.trim().isEmpty()) {
            return null;
        }
        try {
            return LocalDateTime.parse(timeStr, DICOM_TIME_FORMAT);
        } catch (Exception e) {
            log.warn("Failed to parse DICOM time: {}", timeStr);
            return null;
        }
    }

    private DicomModality parseModality(String modalityStr) {
        if (modalityStr == null || modalityStr.trim().isEmpty()) {
            return DicomModality.OT;
        }
        try {
            return DicomModality.valueOf(modalityStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            log.warn("Unknown DICOM modality: {}", modalityStr);
            return DicomModality.OT;
        }
    }
}
