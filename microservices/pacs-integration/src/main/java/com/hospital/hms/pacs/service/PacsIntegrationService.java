package com.hospital.hms.pacs.service;

import com.hospital.hms.pacs.dto.*;
import com.hospital.hms.pacs.entity.*;
import com.hospital.hms.pacs.repository.*;
import com.hospital.hms.pacs.mapper.DicomStudyMapper;
import com.hospital.hms.pacs.exception.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * PACS Integration Service
 * 
 * Provides comprehensive Picture Archiving and Communication System functionality including:
 * - DICOM study/series/instance management
 * - Medical imaging storage and retrieval
 * - Image processing and quality assessment
 * - Annotations and measurements
 * - Integration with RIS/HIS systems
 * - FHIR R4 compliance for imaging data
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class PacsIntegrationService {

    private final DicomStudyRepository dicomStudyRepository;
    private final DicomSeriesRepository dicomSeriesRepository;
    private final DicomInstanceRepository dicomInstanceRepository;
    private final StudyAnnotationRepository studyAnnotationRepository;
    
    private final DicomStudyMapper dicomStudyMapper;
    
    private final DicomProcessingService dicomProcessingService;
    private final DicomStorageService dicomStorageService;
    private final DicomValidationService dicomValidationService;
    private final ImageAnalysisService imageAnalysisService;
    private final FhirImagingService fhirImagingService;
    
    private final KafkaTemplate<String, Object> kafkaTemplate;

    // ===== STUDY MANAGEMENT =====

    /**
     * Create a new DICOM study
     */
    public DicomStudyResponseDto createStudy(DicomStudyCreateRequestDto request) {
        log.info(\"Creating new DICOM study for patient: {}\", request.getPatientId());
        
        try {
            // Validate study doesn't already exist
            if (request.getStudyInstanceUid() != null && 
                dicomStudyRepository.findByStudyInstanceUid(request.getStudyInstanceUid()).isPresent()) {
                throw new StudyAlreadyExistsException(\"Study with UID already exists: \" + request.getStudyInstanceUid());
            }
            
            // Create study entity
            DicomStudy study = new DicomStudy();
            study.setStudyInstanceUid(request.getStudyInstanceUid());
            study.setPatientId(request.getPatientId());
            study.setPatientName(request.getPatientName());
            study.setPatientBirthDate(request.getPatientBirthDate());
            study.setPatientSex(request.getPatientSex());
            study.setAccessionNumber(request.getAccessionNumber());
            study.setStudyId(request.getStudyId());
            study.setStudyDate(request.getStudyDate());
            study.setStudyDescription(request.getStudyDescription());
            study.setModality(request.getModality());
            study.setBodyPartExamined(request.getBodyPartExamined());
            study.setReferringPhysicianName(request.getReferringPhysicianName());
            study.setInstitutionName(request.getInstitutionName());
            study.setDepartmentName(request.getDepartmentName());
            study.setPriority(request.getPriority());
            study.setIsUrgent(request.getIsUrgent());
            study.setOrderId(request.getOrderId());
            study.setAppointmentId(request.getAppointmentId());
            study.setEncounterId(request.getEncounterId());
            study.setCreatedBy(getCurrentUser());
            
            // Save study
            study = dicomStudyRepository.save(study);
            
            // Create FHIR ImagingStudy if enabled
            if (request.getCreateFhirResource()) {
                String fhirId = fhirImagingService.createImagingStudy(study);
                study.setFhirImagingStudyId(fhirId);
                study = dicomStudyRepository.save(study);
            }
            
            // Publish study created event
            publishStudyEvent(\"STUDY_CREATED\", study);
            
            log.info(\"Successfully created DICOM study: {}\", study.getId());
            return dicomStudyMapper.toResponseDto(study);
            
        } catch (Exception e) {
            log.error(\"Error creating DICOM study\", e);
            throw new PacsServiceException(\"Failed to create DICOM study\", e);
        }
    }

    /**
     * Retrieve study by ID
     */
    @Cacheable(value = \"dicom-studies\", key = \"#studyId\")
    @Transactional(readOnly = true)
    public DicomStudyResponseDto getStudy(UUID studyId) {
        log.debug(\"Retrieving DICOM study: {}\", studyId);
        
        DicomStudy study = dicomStudyRepository.findById(studyId)
            .orElseThrow(() -> new StudyNotFoundException(\"Study not found: \" + studyId));
            
        // Update last accessed date
        dicomStudyRepository.updateLastAccessedDate(studyId, LocalDateTime.now());
        
        return dicomStudyMapper.toResponseDto(study);
    }

    /**
     * Retrieve study by Study Instance UID
     */
    @Cacheable(value = \"dicom-studies-uid\", key = \"#studyInstanceUid\")
    @Transactional(readOnly = true)
    public DicomStudyResponseDto getStudyByUid(String studyInstanceUid) {
        log.debug(\"Retrieving DICOM study by UID: {}\", studyInstanceUid);
        
        DicomStudy study = dicomStudyRepository.findByStudyInstanceUid(studyInstanceUid)
            .orElseThrow(() -> new StudyNotFoundException(\"Study not found with UID: \" + studyInstanceUid));
            
        return dicomStudyMapper.toResponseDto(study);
    }

    /**
     * Update study information
     */
    @CacheEvict(value = {\"dicom-studies\", \"dicom-studies-uid\"}, key = \"#studyId\")
    public DicomStudyResponseDto updateStudy(UUID studyId, DicomStudyUpdateRequestDto request) {
        log.info(\"Updating DICOM study: {}\", studyId);
        
        DicomStudy study = dicomStudyRepository.findById(studyId)
            .orElseThrow(() -> new StudyNotFoundException(\"Study not found: \" + studyId));
            
        // Update study fields
        if (request.getStudyDescription() != null) {
            study.setStudyDescription(request.getStudyDescription());
        }
        if (request.getBodyPartExamined() != null) {
            study.setBodyPartExamined(request.getBodyPartExamined());
        }
        if (request.getStudyStatus() != null) {
            study.setStudyStatus(request.getStudyStatus());
        }
        if (request.getWorkflowState() != null) {
            study.setWorkflowState(request.getWorkflowState());
        }
        if (request.getPriority() != null) {
            study.setPriority(request.getPriority());
        }
        if (request.getIsUrgent() != null) {
            study.setIsUrgent(request.getIsUrgent());
        }
        if (request.getQualityScore() != null) {
            study.setQualityScore(request.getQualityScore());
        }
        
        study.setLastModifiedBy(getCurrentUser());
        study = dicomStudyRepository.save(study);
        
        // Update FHIR resource if exists
        if (study.getFhirImagingStudyId() != null) {
            fhirImagingService.updateImagingStudy(study);
        }
        
        // Publish study updated event
        publishStudyEvent(\"STUDY_UPDATED\", study);
        
        return dicomStudyMapper.toResponseDto(study);
    }

    /**
     * Search studies with multiple criteria
     */
    @Transactional(readOnly = true)
    public Page<DicomStudyResponseDto> searchStudies(DicomStudySearchCriteria criteria, Pageable pageable) {
        log.debug(\"Searching DICOM studies with criteria: {}\", criteria);
        
        Page<DicomStudy> studies = dicomStudyRepository.findByMultipleCriteria(
            criteria.getPatientId(),
            criteria.getModality(),
            criteria.getStudyStatus(),
            criteria.getStartDate(),
            criteria.getEndDate(),
            criteria.getIsUrgent(),
            pageable
        );
        
        return studies.map(dicomStudyMapper::toResponseDto);
    }

    /**
     * Get studies for patient
     */
    @Transactional(readOnly = true)
    public Page<DicomStudyResponseDto> getStudiesForPatient(UUID patientId, Pageable pageable) {
        log.debug(\"Retrieving studies for patient: {}\", patientId);
        
        Page<DicomStudy> studies = dicomStudyRepository.findByPatientId(patientId, pageable);
        return studies.map(dicomStudyMapper::toResponseDto);
    }

    // ===== DICOM FILE PROCESSING =====

    /**
     * Upload and process DICOM file
     */
    public DicomUploadResponseDto uploadDicomFile(MultipartFile file, DicomUploadRequestDto request) {
        log.info(\"Processing DICOM file upload: {}\", file.getOriginalFilename());
        
        try {
            // Validate file
            if (!isDicomFile(file)) {
                throw new InvalidDicomFileException(\"Invalid DICOM file format\");
            }
            
            // Parse DICOM header
            DicomMetadata metadata = dicomProcessingService.parseDicomFile(file);
            
            // Find or create study
            DicomStudy study = findOrCreateStudy(metadata);
            
            // Find or create series
            DicomSeries series = findOrCreateSeries(study, metadata);
            
            // Store DICOM file
            String storagePath = dicomStorageService.storeDicomFile(file, metadata);
            
            // Create instance
            DicomInstance instance = createDicomInstance(series, metadata, storagePath, file.getSize());
            
            // Validate DICOM compliance
            if (request.getValidateOnUpload()) {
                ValidationResult validation = dicomValidationService.validateInstance(instance);
                instance.setIsValidated(validation.isValid());
                instance.setValidationErrors(validation.getErrorsAsString());
                instance.setValidationDate(LocalDateTime.now());
                dicomInstanceRepository.save(instance);
            }
            
            // Perform image analysis if requested
            if (request.getPerformImageAnalysis()) {
                imageAnalysisService.analyzeImageAsync(instance);
            }
            
            // Update study/series metrics
            updateStudyMetrics(study);
            updateSeriesMetrics(series);
            
            // Publish upload event
            publishUploadEvent(instance);
            
            log.info(\"Successfully processed DICOM file: {}\", instance.getId());
            
            return DicomUploadResponseDto.builder()
                .instanceId(instance.getId())
                .studyId(study.getId())
                .seriesId(series.getId())
                .sopInstanceUid(instance.getSopInstanceUid())
                .storagePath(storagePath)
                .fileSizeBytes(file.getSize())
                .isValidated(instance.getIsValidated())
                .build();
                
        } catch (Exception e) {
            log.error(\"Error processing DICOM file upload\", e);
            throw new DicomProcessingException(\"Failed to process DICOM file\", e);
        }
    }

    /**
     * Retrieve DICOM instance data
     */
    @Transactional(readOnly = true)
    public DicomInstanceDataDto getDicomInstanceData(String sopInstanceUid) {
        log.debug(\"Retrieving DICOM instance data: {}\", sopInstanceUid);
        
        DicomInstance instance = dicomInstanceRepository.findBySopInstanceUid(sopInstanceUid)
            .orElseThrow(() -> new InstanceNotFoundException(\"Instance not found: \" + sopInstanceUid));
            
        // Update access count
        dicomInstanceRepository.updateAccessInfo(instance.getId(), LocalDateTime.now());
        
        // Retrieve file data
        byte[] dicomData = dicomStorageService.retrieveDicomFile(instance.getStorageLocation());
        
        return DicomInstanceDataDto.builder()
            .instanceId(instance.getId())
            .sopInstanceUid(instance.getSopInstanceUid())
            .dicomData(dicomData)
            .contentType(\"application/dicom\")
            .fileSizeBytes(instance.getFileSizeBytes())
            .lastAccessed(LocalDateTime.now())
            .build();
    }

    // ===== ANNOTATION MANAGEMENT =====

    /**
     * Create study annotation
     */
    public StudyAnnotationResponseDto createAnnotation(StudyAnnotationCreateRequestDto request) {
        log.info(\"Creating annotation for study: {}\", request.getStudyId());
        
        DicomStudy study = dicomStudyRepository.findById(request.getStudyId())
            .orElseThrow(() -> new StudyNotFoundException(\"Study not found: \" + request.getStudyId()));
            
        StudyAnnotation annotation = new StudyAnnotation();
        annotation.setStudy(study);
        annotation.setAnnotationType(request.getAnnotationType());
        annotation.setAnnotationTitle(request.getAnnotationTitle());
        annotation.setAnnotationContent(request.getAnnotationContent());
        annotation.setAnnotationData(request.getAnnotationData());
        annotation.setAnnotationDate(LocalDateTime.now());
        annotation.setSeriesInstanceUid(request.getSeriesInstanceUid());
        annotation.setSopInstanceUid(request.getSopInstanceUid());
        annotation.setFrameNumber(request.getFrameNumber());
        annotation.setCoordinates(request.getCoordinates());
        annotation.setShapeType(request.getShapeType());
        annotation.setMeasurementValue(request.getMeasurementValue());
        annotation.setMeasurementUnit(request.getMeasurementUnit());
        annotation.setClinicalFinding(request.getClinicalFinding());
        annotation.setDiagnosisCode(request.getDiagnosisCode());
        annotation.setSeverityLevel(request.getSeverityLevel());
        annotation.setConfidenceLevel(request.getConfidenceLevel());
        annotation.setIsKeyImage(request.getIsKeyImage());
        annotation.setRequiresApproval(request.getRequiresApproval());
        annotation.setCreatedBy(getCurrentUser());
        
        annotation = studyAnnotationRepository.save(annotation);
        
        // Publish annotation event
        publishAnnotationEvent(\"ANNOTATION_CREATED\", annotation);
        
        return mapAnnotationToResponseDto(annotation);
    }

    /**
     * Get annotations for study
     */
    @Transactional(readOnly = true)
    public List<StudyAnnotationResponseDto> getStudyAnnotations(UUID studyId) {
        log.debug(\"Retrieving annotations for study: {}\", studyId);
        
        List<StudyAnnotation> annotations = studyAnnotationRepository.findByStudyIdOrderByAnnotationDateDesc(studyId);
        return annotations.stream()
            .map(this::mapAnnotationToResponseDto)
            .toList();
    }

    // ===== STATISTICS AND ANALYTICS =====

    /**
     * Get PACS dashboard statistics
     */
    @Transactional(readOnly = true)
    public PacsDashboardStatsDto getDashboardStats() {
        log.debug(\"Retrieving PACS dashboard statistics\");
        
        LocalDateTime today = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
        LocalDateTime weekAgo = today.minusDays(7);
        LocalDateTime monthAgo = today.minusDays(30);
        
        return PacsDashboardStatsDto.builder()
            .totalStudies(dicomStudyRepository.count())
            .totalInstances(dicomInstanceRepository.count())
            .studiesRequiringValidation(dicomStudyRepository.countByIsValidatedFalse())
            .urgentStudies(dicomStudyRepository.countByIsUrgentTrue())
            .studiesThisWeek(dicomStudyRepository.findByStudyDateBetween(weekAgo, LocalDateTime.now(), Pageable.unpaged()).getTotalElements())
            .studiesThisMonth(dicomStudyRepository.findByStudyDateBetween(monthAgo, LocalDateTime.now(), Pageable.unpaged()).getTotalElements())
            .totalAnnotations(studyAnnotationRepository.count())
            .annotationsRequiringApproval(studyAnnotationRepository.countByRequiresApprovalTrueAndAnnotationStatus(AnnotationStatus.PENDING_APPROVAL))
            .build();
    }

    // ===== HELPER METHODS =====

    private boolean isDicomFile(MultipartFile file) {
        return file.getOriginalFilename() != null && 
               (file.getOriginalFilename().toLowerCase().endsWith(\".dcm\") || 
                file.getContentType() != null && file.getContentType().equals(\"application/dicom\"));
    }

    private DicomStudy findOrCreateStudy(DicomMetadata metadata) {
        Optional<DicomStudy> existingStudy = dicomStudyRepository.findByStudyInstanceUid(metadata.getStudyInstanceUid());
        if (existingStudy.isPresent()) {
            return existingStudy.get();
        }
        
        // Create new study from metadata
        DicomStudy study = new DicomStudy();
        study.setStudyInstanceUid(metadata.getStudyInstanceUid());
        study.setPatientName(metadata.getPatientName());
        study.setPatientBirthDate(metadata.getPatientBirthDate());
        study.setPatientSex(metadata.getPatientSex());
        study.setStudyDate(metadata.getStudyDate());
        study.setStudyDescription(metadata.getStudyDescription());
        study.setModality(metadata.getModality());
        study.setAccessionNumber(metadata.getAccessionNumber());
        study.setReferringPhysicianName(metadata.getReferringPhysicianName());
        study.setInstitutionName(metadata.getInstitutionName());
        study.setCreatedBy(getCurrentUser());
        
        return dicomStudyRepository.save(study);
    }

    private DicomSeries findOrCreateSeries(DicomStudy study, DicomMetadata metadata) {
        Optional<DicomSeries> existingSeries = dicomSeriesRepository.findBySeriesInstanceUid(metadata.getSeriesInstanceUid());
        if (existingSeries.isPresent()) {
            return existingSeries.get();
        }
        
        // Create new series from metadata
        DicomSeries series = new DicomSeries();
        series.setStudy(study);
        series.setSeriesInstanceUid(metadata.getSeriesInstanceUid());
        series.setSeriesNumber(metadata.getSeriesNumber());
        series.setSeriesDate(metadata.getSeriesDate());
        series.setSeriesDescription(metadata.getSeriesDescription());
        series.setModality(metadata.getModality());
        series.setBodyPartExamined(metadata.getBodyPartExamined());
        series.setProtocolName(metadata.getProtocolName());
        series.setCreatedBy(getCurrentUser());
        
        return dicomSeriesRepository.save(series);
    }

    private DicomInstance createDicomInstance(DicomSeries series, DicomMetadata metadata, String storagePath, long fileSize) {
        DicomInstance instance = new DicomInstance();
        instance.setSeries(series);
        instance.setSopInstanceUid(metadata.getSopInstanceUid());
        instance.setSopClassUid(metadata.getSopClassUid());
        instance.setInstanceNumber(metadata.getInstanceNumber());
        instance.setContentDate(metadata.getContentDate());
        instance.setRows(metadata.getRows());
        instance.setColumns(metadata.getColumns());
        instance.setBitsAllocated(metadata.getBitsAllocated());
        instance.setBitsStored(metadata.getBitsStored());
        instance.setPhotometricInterpretation(metadata.getPhotometricInterpretation());
        instance.setPixelSpacing(metadata.getPixelSpacing());
        instance.setSliceThickness(metadata.getSliceThickness());
        instance.setStorageLocation(storagePath);
        instance.setFileSizeBytes(fileSize);
        instance.setTransferSyntaxUid(metadata.getTransferSyntaxUid());
        instance.setProcessingStatus(InstanceProcessingStatus.STORED);
        instance.setCreatedBy(getCurrentUser());
        
        return dicomInstanceRepository.save(instance);
    }

    private void updateStudyMetrics(DicomStudy study) {
        study.incrementSeries();
        study.incrementInstances(1);
        dicomStudyRepository.save(study);
    }

    private void updateSeriesMetrics(DicomSeries series) {
        series.incrementInstances();
        dicomSeriesRepository.save(series);
    }

    private StudyAnnotationResponseDto mapAnnotationToResponseDto(StudyAnnotation annotation) {
        return StudyAnnotationResponseDto.builder()
            .id(annotation.getId())
            .studyId(annotation.getStudy().getId())
            .annotationType(annotation.getAnnotationType())
            .annotationTitle(annotation.getAnnotationTitle())
            .annotationContent(annotation.getAnnotationContent())
            .annotationDate(annotation.getAnnotationDate())
            .annotationStatus(annotation.getAnnotationStatus())
            .clinicalFinding(annotation.getClinicalFinding())
            .severityLevel(annotation.getSeverityLevel())
            .confidenceLevel(annotation.getConfidenceLevel())
            .isKeyImage(annotation.getIsKeyImage())
            .createdBy(annotation.getCreatedBy())
            .build();
    }

    private void publishStudyEvent(String eventType, DicomStudy study) {
        try {
            StudyEventDto event = StudyEventDto.builder()
                .eventType(eventType)
                .studyId(study.getId())
                .studyInstanceUid(study.getStudyInstanceUid())
                .patientId(study.getPatientId())
                .modality(study.getModality())
                .timestamp(LocalDateTime.now())
                .build();
                
            kafkaTemplate.send(\"pacs-study-events\", event);
        } catch (Exception e) {
            log.warn(\"Failed to publish study event\", e);
        }
    }

    private void publishUploadEvent(DicomInstance instance) {
        try {
            InstanceEventDto event = InstanceEventDto.builder()
                .eventType(\"INSTANCE_UPLOADED\")
                .instanceId(instance.getId())
                .sopInstanceUid(instance.getSopInstanceUid())
                .seriesId(instance.getSeries().getId())
                .studyId(instance.getSeries().getStudy().getId())
                .fileSizeBytes(instance.getFileSizeBytes())
                .timestamp(LocalDateTime.now())
                .build();
                
            kafkaTemplate.send(\"pacs-instance-events\", event);
        } catch (Exception e) {
            log.warn(\"Failed to publish upload event\", e);
        }
    }

    private void publishAnnotationEvent(String eventType, StudyAnnotation annotation) {
        try {
            AnnotationEventDto event = AnnotationEventDto.builder()
                .eventType(eventType)
                .annotationId(annotation.getId())
                .studyId(annotation.getStudy().getId())
                .annotationType(annotation.getAnnotationType())
                .severityLevel(annotation.getSeverityLevel())
                .timestamp(LocalDateTime.now())
                .build();
                
            kafkaTemplate.send(\"pacs-annotation-events\", event);
        } catch (Exception e) {
            log.warn(\"Failed to publish annotation event\", e);
        }
    }

    private String getCurrentUser() {
        // Implementation would get current user from security context
        return \"system\";
    }
}
