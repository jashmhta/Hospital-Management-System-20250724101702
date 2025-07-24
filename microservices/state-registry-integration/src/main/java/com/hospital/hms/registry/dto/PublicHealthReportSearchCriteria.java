package com.hospital.hms.registry.dto;

import com.hospital.hms.registry.entity.ReportType;
import com.hospital.hms.registry.entity.RegistryType;
import com.hospital.hms.registry.entity.SubmissionStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * DTO for public health report search criteria
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PublicHealthReportSearchCriteria {

    private ReportType reportType;
    private RegistryType registryType;
    private SubmissionStatus submissionStatus;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private UUID patientId;
    private UUID encounterId;
    private String conditionCode;
    private String jurisdiction;
    private Boolean isMandatory;
    private Boolean requiresFollowup;
    private Boolean isOverdue;
}
