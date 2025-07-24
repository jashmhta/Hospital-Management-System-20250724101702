package com.hospital.hms.pacs.controller;

import com.hospital.hms.pacs.dto.*;
import com.hospital.hms.pacs.service.PacsIntegrationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

/**
 * PACS Integration REST Controller
 * 
 * Provides REST endpoints for Picture Archiving and Communication System functionality
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@RestController
@RequestMapping("/api/v1/pacs")
@RequiredArgsConstructor
@Validated
@Slf4j
@Tag(name = "PACS Integration", description = "Picture Archiving and Communication System API")
public class PacsIntegrationController {

    private final PacsIntegrationService pacsIntegrationService;

    // ===== STUDY MANAGEMENT =====

    @Operation(
        summary = "Create DICOM study",
        description = "Creates a new DICOM study in the PACS system"
    )
    @PostMapping("/studies")
    @PreAuthorize("hasRole('RADIOLOGIST') or hasRole('TECHNICIAN') or hasRole('ADMIN')")
    public ResponseEntity<DicomStudyResponseDto> createStudy(
            @Valid @RequestBody DicomStudyCreateRequestDto request) {
        log.info("Creating DICOM study for patient: {}", request.getPatientId());
        
        DicomStudyResponseDto response = pacsIntegrationService.createStudy(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Operation(
        summary = "Get DICOM study",
        description = "Retrieves a DICOM study by ID"
    )
    @GetMapping("/studies/{studyId}")
    @PreAuthorize("hasRole('RADIOLOGIST') or hasRole('TECHNICIAN') or hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<DicomStudyResponseDto> getStudy(
            @Parameter(description = "Study ID") @PathVariable UUID studyId) {
        log.debug("Retrieving DICOM study: {}", studyId);
        
        DicomStudyResponseDto response = pacsIntegrationService.getStudy(studyId);
        return ResponseEntity.ok(response);
    }

    @Operation(
        summary = "Get DICOM study by UID",
        description = "Retrieves a DICOM study by Study Instance UID"
    )
    @GetMapping("/studies/uid/{studyInstanceUid}")
    @PreAuthorize("hasRole('RADIOLOGIST') or hasRole('TECHNICIAN') or hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<DicomStudyResponseDto> getStudyByUid(
            @Parameter(description = "Study Instance UID") @PathVariable String studyInstanceUid) {
        log.debug("Retrieving DICOM study by UID: {}", studyInstanceUid);
        
        DicomStudyResponseDto response = pacsIntegrationService.getStudyByUid(studyInstanceUid);
        return ResponseEntity.ok(response);
    }

    @Operation(
        summary = "Update DICOM study",
        description = "Updates an existing DICOM study"
    )
    @PutMapping("/studies/{studyId}")
    @PreAuthorize("hasRole('RADIOLOGIST') or hasRole('ADMIN')")
    public ResponseEntity<DicomStudyResponseDto> updateStudy(
            @Parameter(description = "Study ID") @PathVariable UUID studyId,
            @Valid @RequestBody DicomStudyUpdateRequestDto request) {
        log.info("Updating DICOM study: {}", studyId);
        
        DicomStudyResponseDto response = pacsIntegrationService.updateStudy(studyId, request);
        return ResponseEntity.ok(response);
    }

    @Operation(
        summary = "Search DICOM studies",
        description = "Searches DICOM studies with multiple criteria"
    )
    @PostMapping("/studies/search")
    @PreAuthorize("hasRole('RADIOLOGIST') or hasRole('TECHNICIAN') or hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<Page<DicomStudyResponseDto>> searchStudies(
            @Valid @RequestBody DicomStudySearchCriteria criteria,
            Pageable pageable) {
        log.debug("Searching DICOM studies with criteria: {}", criteria);
        
        Page<DicomStudyResponseDto> response = pacsIntegrationService.searchStudies(criteria, pageable);
        return ResponseEntity.ok(response);
    }

    @Operation(
        summary = "Get patient studies",
        description = "Retrieves all DICOM studies for a specific patient"
    )
    @GetMapping("/patients/{patientId}/studies")
    @PreAuthorize("hasRole('RADIOLOGIST') or hasRole('TECHNICIAN') or hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<Page<DicomStudyResponseDto>> getPatientStudies(
            @Parameter(description = "Patient ID") @PathVariable UUID patientId,
            Pageable pageable) {
        log.debug("Retrieving studies for patient: {}", patientId);
        
        Page<DicomStudyResponseDto> response = pacsIntegrationService.getStudiesForPatient(patientId, pageable);
        return ResponseEntity.ok(response);
    }

    // ===== DICOM FILE OPERATIONS =====

    @Operation(
        summary = "Upload DICOM file",
        description = "Uploads and processes a DICOM file"
    )
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('RADIOLOGIST') or hasRole('TECHNICIAN') or hasRole('ADMIN')")
    public ResponseEntity<DicomUploadResponseDto> uploadDicomFile(
            @Parameter(description = "DICOM file") @RequestParam("file") MultipartFile file,
            @Parameter(description = "Upload options") @ModelAttribute DicomUploadRequestDto request) {
        log.info("Processing DICOM file upload: {}", file.getOriginalFilename());
        
        DicomUploadResponseDto response = pacsIntegrationService.uploadDicomFile(file, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Operation(
        summary = "Download DICOM instance",
        description = "Downloads DICOM instance data by SOP Instance UID"
    )
    @GetMapping("/instances/{sopInstanceUid}/download")
    @PreAuthorize("hasRole('RADIOLOGIST') or hasRole('TECHNICIAN') or hasRole('DOCTOR')")
    public ResponseEntity<byte[]> downloadDicomInstance(
            @Parameter(description = "SOP Instance UID") @PathVariable String sopInstanceUid) {
        log.debug("Downloading DICOM instance: {}", sopInstanceUid);
        
        DicomInstanceDataDto instanceData = pacsIntegrationService.getDicomInstanceData(sopInstanceUid);
        
        return ResponseEntity.ok()
            .contentType(MediaType.parseMediaType(instanceData.getContentType()))
            .contentLength(instanceData.getFileSizeBytes())
            .header("Content-Disposition", "attachment; filename=\"" + sopInstanceUid + ".dcm\"")
            .body(instanceData.getDicomData());
    }

    // ===== ANNOTATIONS =====

    @Operation(
        summary = "Create study annotation",
        description = "Creates a new annotation for a DICOM study"
    )
    @PostMapping("/studies/{studyId}/annotations")
    @PreAuthorize("hasRole('RADIOLOGIST') or hasRole('DOCTOR')")
    public ResponseEntity<StudyAnnotationResponseDto> createAnnotation(
            @Parameter(description = "Study ID") @PathVariable UUID studyId,
            @Valid @RequestBody StudyAnnotationCreateRequestDto request) {
        log.info("Creating annotation for study: {}", studyId);
        
        request.setStudyId(studyId);
        StudyAnnotationResponseDto response = pacsIntegrationService.createAnnotation(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Operation(
        summary = "Get study annotations",
        description = "Retrieves all annotations for a DICOM study"
    )
    @GetMapping("/studies/{studyId}/annotations")
    @PreAuthorize("hasRole('RADIOLOGIST') or hasRole('TECHNICIAN') or hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<List<StudyAnnotationResponseDto>> getStudyAnnotations(
            @Parameter(description = "Study ID") @PathVariable UUID studyId) {
        log.debug("Retrieving annotations for study: {}", studyId);
        
        List<StudyAnnotationResponseDto> response = pacsIntegrationService.getStudyAnnotations(studyId);
        return ResponseEntity.ok(response);
    }

    // ===== DASHBOARD AND STATISTICS =====

    @Operation(
        summary = "Get PACS dashboard statistics",
        description = "Retrieves dashboard statistics for PACS system"
    )
    @GetMapping("/dashboard/stats")
    @PreAuthorize("hasRole('RADIOLOGIST') or hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<PacsDashboardStatsDto> getDashboardStats() {
        log.debug("Retrieving PACS dashboard statistics");
        
        PacsDashboardStatsDto response = pacsIntegrationService.getDashboardStats();
        return ResponseEntity.ok(response);
    }

    // ===== HEALTH CHECK =====

    @Operation(
        summary = "Health check",
        description = "Checks the health status of PACS integration service"
    )
    @GetMapping("/health")
    public ResponseEntity<HealthCheckResponseDto> healthCheck() {
        return ResponseEntity.ok(HealthCheckResponseDto.builder()
            .service("PACS Integration Service")
            .status("UP")
            .timestamp(java.time.LocalDateTime.now())
            .version("1.0.0")
            .build());
    }
}
