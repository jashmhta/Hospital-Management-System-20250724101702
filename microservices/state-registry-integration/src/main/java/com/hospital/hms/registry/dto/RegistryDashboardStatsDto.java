package com.hospital.hms.registry.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for registry dashboard statistics
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegistryDashboardStatsDto {

    private Long totalReports;
    private Long submittedReports;
    private Long overdueReports;
    private Long mandatoryReportsNotSubmitted;
    private Long reportsThisWeek;
    private Long reportsThisMonth;
    private Long highPriorityPending;
    private Long requiresFollowup;
    private Double complianceRate;
    private Double submissionRate;
}
