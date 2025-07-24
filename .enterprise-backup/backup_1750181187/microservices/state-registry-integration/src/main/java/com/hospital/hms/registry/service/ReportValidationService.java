package com.hospital.hms.registry.service;

import com.hospital.hms.registry.dto.PublicHealthReportCreateRequestDto;
import com.hospital.hms.registry.entity.PublicHealthReport;
import com.hospital.hms.registry.entity.ValidationStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * Service for validating public health reports
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ReportValidationService {

    /**
     * Validate a public health report
     */
    public ValidationResult validateReport(PublicHealthReport report) {
        log.debug("Validating public health report: {}", report.getId());
        
        List<String> errors = new ArrayList<>();
        
        // Validate required fields
        if (report.getReportType() == null) {
            errors.add("Report type is required");
        }
        
        if (report.getRegistryType() == null) {
            errors.add("Registry type is required");
        }
        
        if (report.getPatientId() == null) {
            errors.add("Patient ID is required");
        }
        
        if (report.getReportDate() == null) {
            errors.add("Report date is required");
        }
        
        // Validate report type specific requirements
        validateReportTypeSpecific(report, errors);
        
        // Calculate quality score
        double qualityScore = calculateQualityScore(report, errors);
        
        ValidationStatus status = errors.isEmpty() ? ValidationStatus.VALID : 
                                 errors.size() <= 2 ? ValidationStatus.WARNING : ValidationStatus.ERROR;
        
        return ValidationResult.builder()
            .valid(errors.isEmpty())
            .status(status)
            .errors(errors)
            .qualityScore(qualityScore)
            .build();
    }

    /**
     * Validate report type requirements
     */
    public void validateReportTypeRequirements(PublicHealthReportCreateRequestDto request) {
        // Implementation would validate specific requirements based on report type
        switch (request.getReportType()) {
            case BIRTH_REGISTRATION:
                validateBirthRegistrationRequirements(request);
                break;
            case DEATH_REGISTRATION:
                validateDeathRegistrationRequirements(request);
                break;
            case DISEASE_SURVEILLANCE:
                validateDiseaseSurveillanceRequirements(request);
                break;
            case IMMUNIZATION_RECORD:
                validateImmunizationRequirements(request);
                break;
            default:
                // General validation
                break;
        }
    }

    private void validateReportTypeSpecific(PublicHealthReport report, List<String> errors) {
        // Implementation would add specific validation based on report type
    }

    private void validateBirthRegistrationRequirements(PublicHealthReportCreateRequestDto request) {
        if (request.getBirthWeight() == null) {
            throw new IllegalArgumentException("Birth weight is required for birth registration");
        }
        if (request.getMotherName() == null || request.getMotherName().trim().isEmpty()) {
            throw new IllegalArgumentException("Mother name is required for birth registration");
        }
    }

    private void validateDeathRegistrationRequirements(PublicHealthReportCreateRequestDto request) {
        if (request.getDeathDate() == null) {
            throw new IllegalArgumentException("Death date is required for death registration");
        }
        if (request.getCauseOfDeath() == null || request.getCauseOfDeath().trim().isEmpty()) {
            throw new IllegalArgumentException("Cause of death is required for death registration");
        }
    }

    private void validateDiseaseSurveillanceRequirements(PublicHealthReportCreateRequestDto request) {
        if (request.getConditionCode() == null || request.getConditionCode().trim().isEmpty()) {
            throw new IllegalArgumentException("Condition code is required for disease surveillance");
        }
        if (request.getIncidentDate() == null) {
            throw new IllegalArgumentException("Incident date is required for disease surveillance");
        }
    }

    private void validateImmunizationRequirements(PublicHealthReportCreateRequestDto request) {
        if (request.getVaccineType() == null || request.getVaccineType().trim().isEmpty()) {
            throw new IllegalArgumentException("Vaccine type is required for immunization record");
        }
        if (request.getAdministrationDate() == null) {
            throw new IllegalArgumentException("Administration date is required for immunization record");
        }
    }

    private double calculateQualityScore(PublicHealthReport report, List<String> errors) {
        // Simple quality score calculation
        double baseScore = 100.0;
        double deduction = errors.size() * 10.0;
        
        // Additional quality factors
        if (report.getClinicalFindings() != null && !report.getClinicalFindings().trim().isEmpty()) {
            baseScore += 5.0;
        }
        
        if (report.getIcd10Code() != null && !report.getIcd10Code().trim().isEmpty()) {
            baseScore += 5.0;
        }
        
        return Math.max(0.0, Math.min(100.0, baseScore - deduction));
    }

    /**
     * Validation result
     */
    @lombok.Builder
    @lombok.Data
    public static class ValidationResult {
        private boolean valid;
        private ValidationStatus status;
        private List<String> errors;
        private double qualityScore;

        public String getErrorsAsString() {
            return errors != null ? String.join("; ", errors) : "";
        }
    }
}
