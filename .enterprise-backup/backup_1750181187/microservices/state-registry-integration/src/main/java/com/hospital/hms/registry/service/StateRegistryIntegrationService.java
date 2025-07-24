package com.hospital.hms.registry.service;

import com.hospital.hms.registry.dto.*;
import com.hospital.hms.registry.entity.*;
import com.hospital.hms.registry.repository.PublicHealthReportRepository;
import com.hospital.hms.registry.mapper.PublicHealthReportMapper;
import com.hospital.hms.registry.exception.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * State Registry Integration Service
 * 
 * Provides comprehensive public health reporting and state registry integration:
 * - Birth and death registration
 * - Disease surveillance reporting
 * - Immunization registry submissions
 * - Cancer registry reporting
 * - Vital statistics compilation
 * - Public health compliance monitoring
 * - Automated registry submissions
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class StateRegistryIntegrationService {

    private final PublicHealthReportRepository publicHealthReportRepository;
    private final PublicHealthReportMapper publicHealthReportMapper;
    
    private final RegistrySubmissionService registrySubmissionService;
    private final ReportValidationService reportValidationService;
    private final ComplianceMonitoringService complianceMonitoringService;
    private final FhirPublicHealthService fhirPublicHealthService;
    
    private final KafkaTemplate<String, Object> kafkaTemplate;

    // ===== REPORT CREATION AND MANAGEMENT =====

    /**
     * Create a new public health report
     */
    public PublicHealthReportResponseDto createReport(PublicHealthReportCreateRequestDto request) {
        log.info("Creating public health report of type: {} for patient: {}", 
                request.getReportType(), request.getPatientId());
        
        try {
            // Validate report requirements
            validateReportRequirements(request);
            
            // Create report entity
            PublicHealthReport report = new PublicHealthReport();
            report.setReportType(request.getReportType());
            report.setRegistryType(request.getRegistryType());
            report.setPatientId(request.getPatientId());
            report.setEncounterId(request.getEncounterId());
            report.setReportDate(request.getReportDate());
            report.setIncidentDate(request.getIncidentDate());
            report.setReportTitle(request.getReportTitle());
            report.setReportData(request.getReportData());
            report.setReportSummary(request.getReportSummary());
            report.setClinicalFindings(request.getClinicalFindings());
            report.setConditionCode(request.getConditionCode());
            report.setConditionName(request.getConditionName());
            report.setIcd10Code(request.getIcd10Code());
            report.setSnomedCode(request.getSnomedCode());
            
            // Set patient demographics
            populatePatientDemographics(report, request);
            
            // Set provider information
            populateProviderInformation(report, request);
            
            // Determine priority and compliance requirements
            determinePriorityAndCompliance(report);
            
            report.setCreatedBy(getCurrentUser());
            
            // Save report
            report = publicHealthReportRepository.save(report);
            
            // Create FHIR resource if enabled
            if (request.getCreateFhirResource()) {
                String fhirId = fhirPublicHealthService.createPublicHealthResource(report);
                report.setFhirResourceId(fhirId);
                report = publicHealthReportRepository.save(report);
            }
            
            // Perform initial validation
            if (request.getValidateOnCreate()) {
                ValidationResult validation = reportValidationService.validateReport(report);
                updateValidationStatus(report, validation);
            }
            
            // Check if immediate submission is required
            if (isImmediateSubmissionRequired(report)) {
                scheduleImmediateSubmission(report);
            }
            
            // Publish report created event
            publishReportEvent("REPORT_CREATED", report);
            
            log.info("Successfully created public health report: {}", report.getId());
            return publicHealthReportMapper.toResponseDto(report);
            
        } catch (Exception e) {
            log.error("Error creating public health report", e);
            throw new RegistryServiceException("Failed to create public health report", e);
        }
    }

    /**
     * Retrieve report by ID
     */
    @Cacheable(value = "public-health-reports", key = "#reportId")
    @Transactional(readOnly = true)
    public PublicHealthReportResponseDto getReport(UUID reportId) {
        log.debug("Retrieving public health report: {}", reportId);
        
        PublicHealthReport report = publicHealthReportRepository.findById(reportId)
            .orElseThrow(() -> new ReportNotFoundException("Report not found: " + reportId));
            
        return publicHealthReportMapper.toResponseDto(report);
    }

    /**
     * Update report information
     */
    @CacheEvict(value = "public-health-reports", key = "#reportId")
    public PublicHealthReportResponseDto updateReport(UUID reportId, PublicHealthReportUpdateRequestDto request) {
        log.info("Updating public health report: {}", reportId);
        
        PublicHealthReport report = publicHealthReportRepository.findById(reportId)
            .orElseThrow(() -> new ReportNotFoundException("Report not found: " + reportId));
            
        // Validate report can be updated
        if (report.isSubmitted()) {
            throw new ReportUpdateNotAllowedException("Cannot update submitted report: " + reportId);
        }
        
        // Update report fields
        updateReportFields(report, request);
        
        report.setLastModifiedBy(getCurrentUser());
        report = publicHealthReportRepository.save(report);
        
        // Re-validate if requested
        if (request.getRevalidateOnUpdate()) {
            ValidationResult validation = reportValidationService.validateReport(report);
            updateValidationStatus(report, validation);
        }
        
        // Update FHIR resource if exists
        if (report.getFhirResourceId() != null) {
            fhirPublicHealthService.updatePublicHealthResource(report);
        }
        
        // Publish report updated event
        publishReportEvent("REPORT_UPDATED", report);
        
        return publicHealthReportMapper.toResponseDto(report);
    }

    /**
     * Submit report to registry
     */
    public SubmissionResponseDto submitReport(UUID reportId, SubmissionRequestDto request) {
        log.info("Submitting public health report: {} to registry: {}", reportId, request.getRegistryEndpoint());
        
        PublicHealthReport report = publicHealthReportRepository.findById(reportId)
            .orElseThrow(() -> new ReportNotFoundException("Report not found: " + reportId));
            
        // Validate report is ready for submission
        if (!isReadyForSubmission(report)) {
            throw new ReportNotReadyForSubmissionException("Report not ready for submission: " + reportId);
        }
        
        try {
            // Perform final validation
            ValidationResult validation = reportValidationService.validateReport(report);
            if (!validation.isValid()) {
                throw new ReportValidationException("Report validation failed: " + validation.getErrorsAsString());
            }
            
            // Submit to registry
            SubmissionResult result = registrySubmissionService.submitReport(report, request);
            
            // Update submission status
            report.setSubmissionStatus(SubmissionStatus.SUBMITTED);
            report.setSubmissionDate(LocalDateTime.now());
            report.setSubmissionMethod(request.getSubmissionMethod());
            report.setSubmissionEndpoint(request.getRegistryEndpoint());
            report.setExternalReferenceId(result.getExternalReferenceId());
            
            if (result.getAcknowledgmentId() != null) {
                report.setAcknowledgmentId(result.getAcknowledgmentId());
                report.setAcknowledgmentDate(LocalDateTime.now());
                report.setSubmissionStatus(SubmissionStatus.ACKNOWLEDGED);
            }
            
            publicHealthReportRepository.save(report);
            
            // Publish submission event
            publishSubmissionEvent(report, result);
            
            return SubmissionResponseDto.builder()
                .reportId(reportId)
                .submissionId(result.getSubmissionId())
                .externalReferenceId(result.getExternalReferenceId())
                .acknowledgmentId(result.getAcknowledgmentId())
                .submissionStatus(report.getSubmissionStatus())
                .submissionDate(report.getSubmissionDate())
                .build();
                
        } catch (Exception e) {
            log.error("Error submitting report to registry", e);
            
            // Update submission status to error
            report.setSubmissionStatus(SubmissionStatus.ERROR);
            publicHealthReportRepository.save(report);
            
            throw new RegistrySubmissionException("Failed to submit report to registry", e);
        }
    }

    /**
     * Create amendment to existing report
     */
    public PublicHealthReportResponseDto createAmendment(UUID originalReportId, AmendmentRequestDto request) {
        log.info("Creating amendment for report: {}", originalReportId);
        
        PublicHealthReport originalReport = publicHealthReportRepository.findById(originalReportId)
            .orElseThrow(() -> new ReportNotFoundException("Original report not found: " + originalReportId));
            
        if (!originalReport.isSubmitted()) {
            throw new AmendmentNotAllowedException("Cannot amend report that has not been submitted");
        }
        
        // Create amendment report
        PublicHealthReport amendment = createAmendmentFromOriginal(originalReport, request);
        amendment = publicHealthReportRepository.save(amendment);
        
        // Submit amendment if required
        if (request.getSubmitImmediately()) {
            SubmissionRequestDto submissionRequest = SubmissionRequestDto.builder()
                .registryEndpoint(originalReport.getSubmissionEndpoint())
                .submissionMethod("AMENDMENT")
                .build();
            submitReport(amendment.getId(), submissionRequest);
        }
        
        return publicHealthReportMapper.toResponseDto(amendment);
    }

    // ===== SEARCH AND QUERY OPERATIONS =====

    /**
     * Search reports with multiple criteria
     */
    @Transactional(readOnly = true)
    public Page<PublicHealthReportResponseDto> searchReports(PublicHealthReportSearchCriteria criteria, Pageable pageable) {
        log.debug("Searching public health reports with criteria: {}", criteria);
        
        Page<PublicHealthReport> reports = publicHealthReportRepository.findByMultipleCriteria(
            criteria.getReportType(),
            criteria.getRegistryType(),
            criteria.getSubmissionStatus(),
            criteria.getStartDate(),
            criteria.getEndDate(),
            criteria.getPatientId(),
            pageable
        );
        
        return reports.map(publicHealthReportMapper::toResponseDto);
    }

    /**
     * Get reports for patient
     */
    @Transactional(readOnly = true)
    public Page<PublicHealthReportResponseDto> getReportsForPatient(UUID patientId, Pageable pageable) {
        log.debug("Retrieving reports for patient: {}", patientId);
        
        Page<PublicHealthReport> reports = publicHealthReportRepository.findByPatientId(patientId, pageable);
        return reports.map(publicHealthReportMapper::toResponseDto);
    }

    /**
     * Get overdue reports
     */
    @Transactional(readOnly = true)
    public List<PublicHealthReportResponseDto> getOverdueReports() {
        log.debug("Retrieving overdue public health reports");
        
        List<PublicHealthReport> reports = publicHealthReportRepository.findOverdueReports(LocalDateTime.now());
        return reports.stream()
            .map(publicHealthReportMapper::toResponseDto)
            .toList();
    }

    /**
     * Get high priority pending reports
     */
    @Transactional(readOnly = true)
    public List<PublicHealthReportResponseDto> getHighPriorityPendingReports() {
        log.debug("Retrieving high priority pending reports");
        
        List<PublicHealthReport> reports = publicHealthReportRepository.findHighPriorityReportsPending();
        return reports.stream()
            .map(publicHealthReportMapper::toResponseDto)
            .toList();
    }

    // ===== DASHBOARD AND ANALYTICS =====

    /**
     * Get registry dashboard statistics
     */
    @Transactional(readOnly = true)
    public RegistryDashboardStatsDto getDashboardStats() {
        log.debug("Retrieving registry dashboard statistics");
        
        LocalDateTime today = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
        LocalDateTime weekAgo = today.minusDays(7);
        LocalDateTime monthAgo = today.minusDays(30);
        
        return RegistryDashboardStatsDto.builder()
            .totalReports(publicHealthReportRepository.count())
            .submittedReports(publicHealthReportRepository.countBySubmissionStatus(SubmissionStatus.SUBMITTED))
            .overdueReports(publicHealthReportRepository.countOverdueReports(LocalDateTime.now()))
            .mandatoryReportsNotSubmitted(publicHealthReportRepository.findMandatoryReportsNotSubmitted().size())
            .reportsThisWeek(publicHealthReportRepository.findByReportDateBetween(weekAgo, LocalDateTime.now(), Pageable.unpaged()).getTotalElements())
            .reportsThisMonth(publicHealthReportRepository.findByReportDateBetween(monthAgo, LocalDateTime.now(), Pageable.unpaged()).getTotalElements())
            .highPriorityPending(publicHealthReportRepository.findHighPriorityReportsPending().size())
            .requiresFollowup(publicHealthReportRepository.findByRequiresFollowupTrue().size())
            .build();
    }

    // ===== HELPER METHODS =====

    private void validateReportRequirements(PublicHealthReportCreateRequestDto request) {
        if (request.getReportType() == null) {
            throw new IllegalArgumentException("Report type is required");
        }
        if (request.getRegistryType() == null) {
            throw new IllegalArgumentException("Registry type is required");
        }
        if (request.getReportDate() == null) {
            throw new IllegalArgumentException("Report date is required");
        }
        
        // Validate specific requirements based on report type
        reportValidationService.validateReportTypeRequirements(request);
    }

    private void populatePatientDemographics(PublicHealthReport report, PublicHealthReportCreateRequestDto request) {
        report.setPatientAge(request.getPatientAge());
        report.setPatientGender(request.getPatientGender());
        report.setPatientRace(request.getPatientRace());
        report.setPatientEthnicity(request.getPatientEthnicity());
        report.setPatientZipCode(request.getPatientZipCode());
        report.setPatientCounty(request.getPatientCounty());
        report.setPatientState(request.getPatientState());
    }

    private void populateProviderInformation(PublicHealthReport report, PublicHealthReportCreateRequestDto request) {
        report.setReportingProviderId(request.getReportingProviderId());
        report.setReportingProviderName(request.getReportingProviderName());
        report.setReportingFacility(request.getReportingFacility());
        report.setReportingFacilityNpi(request.getReportingFacilityNpi());
    }

    private void determinePriorityAndCompliance(PublicHealthReport report) {
        // Determine priority based on report type and condition
        report.setPriorityLevel(complianceMonitoringService.determinePriority(report));
        
        // Check if report is mandatory
        report.setIsMandatory(complianceMonitoringService.isMandatoryReport(report));
        
        // Set reporting deadline
        report.setReportingDeadline(complianceMonitoringService.calculateReportingDeadline(report));
        
        // Set confidentiality level
        report.setConfidentialityLevel(complianceMonitoringService.determineConfidentialityLevel(report));
    }

    private void updateValidationStatus(PublicHealthReport report, ValidationResult validation) {
        report.setValidationStatus(validation.getStatus());
        report.setValidationErrors(validation.getErrorsAsString());
        report.setValidationDate(LocalDateTime.now());
        report.setQualityScore(validation.getQualityScore());
        publicHealthReportRepository.save(report);
    }

    private boolean isReadyForSubmission(PublicHealthReport report) {
        return report.getValidationStatus() == ValidationStatus.VALID &&
               (report.getSubmissionStatus() == SubmissionStatus.READY_FOR_SUBMISSION ||
                report.getSubmissionStatus() == SubmissionStatus.DRAFT);
    }

    private boolean isImmediateSubmissionRequired(PublicHealthReport report) {
        return report.getPriorityLevel() == PriorityLevel.IMMEDIATE ||
               report.getPriorityLevel() == PriorityLevel.STAT;
    }

    private void scheduleImmediateSubmission(PublicHealthReport report) {
        // Schedule immediate submission for high priority reports
        complianceMonitoringService.scheduleImmediateSubmission(report);
    }

    private void updateReportFields(PublicHealthReport report, PublicHealthReportUpdateRequestDto request) {
        if (request.getReportTitle() != null) {
            report.setReportTitle(request.getReportTitle());
        }
        if (request.getReportSummary() != null) {
            report.setReportSummary(request.getReportSummary());
        }
        if (request.getClinicalFindings() != null) {
            report.setClinicalFindings(request.getClinicalFindings());
        }
        if (request.getReportData() != null) {
            report.setReportData(request.getReportData());
        }
        if (request.getPriorityLevel() != null) {
            report.setPriorityLevel(request.getPriorityLevel());
        }
    }

    private PublicHealthReport createAmendmentFromOriginal(PublicHealthReport original, AmendmentRequestDto request) {
        PublicHealthReport amendment = new PublicHealthReport();
        
        // Copy all fields from original
        amendment.setReportType(original.getReportType());
        amendment.setRegistryType(original.getRegistryType());
        amendment.setPatientId(original.getPatientId());
        amendment.setEncounterId(original.getEncounterId());
        amendment.setReportDate(LocalDateTime.now());
        amendment.setIncidentDate(original.getIncidentDate());
        
        // Apply amendment changes
        amendment.setReportTitle(request.getUpdatedTitle());
        amendment.setReportSummary(request.getUpdatedSummary());
        amendment.setClinicalFindings(request.getUpdatedClinicalFindings());
        amendment.setReportData(request.getUpdatedReportData());
        
        // Set amendment-specific fields
        amendment.setIsAmendment(true);
        amendment.setOriginalReportId(original.getId());
        amendment.setAmendmentReason(request.getAmendmentReason());
        amendment.setCreatedBy(getCurrentUser());
        
        return amendment;
    }

    private void publishReportEvent(String eventType, PublicHealthReport report) {
        try {
            ReportEventDto event = ReportEventDto.builder()
                .eventType(eventType)
                .reportId(report.getId())
                .reportType(report.getReportType())
                .registryType(report.getRegistryType())
                .patientId(report.getPatientId())
                .priorityLevel(report.getPriorityLevel())
                .timestamp(LocalDateTime.now())
                .build();
                
            kafkaTemplate.send("registry-report-events", event);
        } catch (Exception e) {
            log.warn("Failed to publish report event", e);
        }
    }

    private void publishSubmissionEvent(PublicHealthReport report, SubmissionResult result) {
        try {
            SubmissionEventDto event = SubmissionEventDto.builder()
                .eventType("REPORT_SUBMITTED")
                .reportId(report.getId())
                .submissionId(result.getSubmissionId())
                .registryType(report.getRegistryType())
                .externalReferenceId(result.getExternalReferenceId())
                .timestamp(LocalDateTime.now())
                .build();
                
            kafkaTemplate.send("registry-submission-events", event);
        } catch (Exception e) {
            log.warn("Failed to publish submission event", e);
        }
    }

    private String getCurrentUser() {
        // Implementation would get current user from security context
        return "system";
    }
}
