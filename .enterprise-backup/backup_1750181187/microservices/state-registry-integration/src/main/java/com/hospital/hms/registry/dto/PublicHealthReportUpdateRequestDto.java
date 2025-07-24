package com.hospital.hms.registry.dto;

import com.hospital.hms.registry.entity.PriorityLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.Size;

/**
 * DTO for updating public health reports
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PublicHealthReportUpdateRequestDto {

    @Size(max = 500, message = "Report title cannot exceed 500 characters")
    private String reportTitle;

    @Size(max = 2000, message = "Report summary cannot exceed 2000 characters")
    private String reportSummary;

    private String clinicalFindings;

    private String reportData;

    private PriorityLevel priorityLevel;

    private String notes;

    @Builder.Default
    private Boolean revalidateOnUpdate = true;
}
