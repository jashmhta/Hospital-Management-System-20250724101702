package com.hospital.hms.registry.service;

import com.hospital.hms.registry.entity.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

/**
 * Service for monitoring public health compliance
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ComplianceMonitoringService {

    /**
     * Determine priority level for a report
     */
    public PriorityLevel determinePriority(PublicHealthReport report) {
        // Determine priority based on report type and condition
        switch (report.getReportType()) {
            case DISEASE_SURVEILLANCE:
                return determineDiseaseControlPriority(report);
            case BIRTH_REGISTRATION:
            case DEATH_REGISTRATION:
                return PriorityLevel.ROUTINE;
            case IMMUNIZATION_RECORD:
                return PriorityLevel.NORMAL;
            case CANCER_REGISTRY:
                return PriorityLevel.NORMAL;
            case VITAL_STATISTICS:
                return PriorityLevel.ROUTINE;
            default:
                return PriorityLevel.NORMAL;
        }
    }

    /**
     * Check if report is mandatory
     */
    public boolean isMandatoryReport(PublicHealthReport report) {
        // Most public health reports are mandatory
        switch (report.getReportType()) {
            case BIRTH_REGISTRATION:
            case DEATH_REGISTRATION:
            case DISEASE_SURVEILLANCE:
                return true;
            case IMMUNIZATION_RECORD:
            case CANCER_REGISTRY:
            case VITAL_STATISTICS:
                return true; // Usually mandatory
            default:
                return false;
        }
    }

    /**
     * Calculate reporting deadline
     */
    public LocalDateTime calculateReportingDeadline(PublicHealthReport report) {
        LocalDateTime baseDate = report.getIncidentDate() != null ? 
                                report.getIncidentDate() : report.getReportDate();
        
        switch (report.getReportType()) {
            case DISEASE_SURVEILLANCE:
                return calculateDiseaseReportingDeadline(report, baseDate);
            case BIRTH_REGISTRATION:
                return baseDate.plusDays(5); // 5 days for birth registration
            case DEATH_REGISTRATION:
                return baseDate.plusDays(3); // 3 days for death registration
            case IMMUNIZATION_RECORD:
                return baseDate.plusDays(30); // 30 days for immunization
            case CANCER_REGISTRY:
                return baseDate.plusDays(180); // 180 days for cancer registry
            case VITAL_STATISTICS:
                return baseDate.plusDays(30); // 30 days for vital statistics
            default:
                return baseDate.plusDays(7); // Default 7 days
        }
    }

    /**
     * Determine confidentiality level
     */
    public ConfidentialityLevel determineConfidentialityLevel(PublicHealthReport report) {
        switch (report.getReportType()) {
            case DISEASE_SURVEILLANCE:
                return ConfidentialityLevel.RESTRICTED; // Disease surveillance is usually restricted
            case BIRTH_REGISTRATION:
            case DEATH_REGISTRATION:
                return ConfidentialityLevel.CONFIDENTIAL; // Vital records are confidential
            case IMMUNIZATION_RECORD:
                return ConfidentialityLevel.NORMAL; // Immunization records are normal
            case CANCER_REGISTRY:
                return ConfidentialityLevel.RESTRICTED; // Cancer data is restricted
            case VITAL_STATISTICS:
                return ConfidentialityLevel.NORMAL; // Aggregated vital stats are normal
            default:
                return ConfidentialityLevel.NORMAL;
        }
    }

    /**
     * Schedule immediate submission for high priority reports
     */
    public void scheduleImmediateSubmission(PublicHealthReport report) {
        log.info("Scheduling immediate submission for high priority report: {}\", report.getId());
        // Implementation would trigger immediate submission workflow
        // This could involve:
        // - Sending to priority queue
        // - Triggering async submission
        // - Sending alerts to public health officials
    }

    private PriorityLevel determineDiseaseControlPriority(PublicHealthReport report) {
        // Check for reportable diseases that require immediate notification
        String conditionCode = report.getConditionCode();
        String conditionName = report.getConditionName();
        
        if (conditionCode != null) {
            // High priority conditions (CDC Category A)
            if (isHighPriorityCondition(conditionCode, conditionName)) {
                return PriorityLevel.IMMEDIATE;
            }
            
            // Urgent conditions (CDC Category B)
            if (isUrgentCondition(conditionCode, conditionName)) {
                return PriorityLevel.URGENT;
            }
        }
        
        return PriorityLevel.NORMAL;
    }

    private LocalDateTime calculateDiseaseReportingDeadline(PublicHealthReport report, LocalDateTime baseDate) {
        String conditionCode = report.getConditionCode();
        String conditionName = report.getConditionName();
        
        // Immediate reporting required (within 24 hours)
        if (isImmediateReportingRequired(conditionCode, conditionName)) {
            return baseDate.plusHours(24);
        }
        
        // Urgent reporting (within 3 days)
        if (isUrgentReportingRequired(conditionCode, conditionName)) {
            return baseDate.plusDays(3);
        }
        
        // Standard reporting (within 7 days)
        return baseDate.plusDays(7);
    }

    private boolean isHighPriorityCondition(String conditionCode, String conditionName) {
        if (conditionCode != null) {
            // Examples of high priority conditions
            return conditionCode.equals("A00") || // Cholera
                   conditionCode.equals("A20") || // Plague
                   conditionCode.equals("A22") || // Anthrax
                   conditionCode.startsWith("A98") || // Viral hemorrhagic fevers
                   conditionCode.equals("Z87.891"); // Personal history of nicotine dependence
        }
        
        if (conditionName != null) {
            String lowerName = conditionName.toLowerCase();
            return lowerName.contains("ebola") ||
                   lowerName.contains("anthrax") ||
                   lowerName.contains("smallpox") ||
                   lowerName.contains("plague");
        }
        
        return false;
    }

    private boolean isUrgentCondition(String conditionCode, String conditionName) {
        if (conditionCode != null) {
            return conditionCode.startsWith("A15") || // Tuberculosis
                   conditionCode.startsWith("A50") || // Syphilis
                   conditionCode.equals("B20") ||     // HIV
                   conditionCode.startsWith("A39");   // Meningococcal infection
        }
        
        if (conditionName != null) {
            String lowerName = conditionName.toLowerCase();
            return lowerName.contains("tuberculosis") ||
                   lowerName.contains("meningitis") ||
                   lowerName.contains("hepatitis");
        }
        
        return false;
    }

    private boolean isImmediateReportingRequired(String conditionCode, String conditionName) {
        return isHighPriorityCondition(conditionCode, conditionName);
    }

    private boolean isUrgentReportingRequired(String conditionCode, String conditionName) {
        return isUrgentCondition(conditionCode, conditionName);
    }
}
