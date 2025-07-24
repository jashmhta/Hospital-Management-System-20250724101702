package com.hospital.hms.registry.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * DTO for amendment requests
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AmendmentRequestDto {

    @NotBlank(message = "Amendment reason is required")
    @Size(max = 500, message = "Amendment reason cannot exceed 500 characters")
    private String amendmentReason;

    private String updatedTitle;
    private String updatedSummary;
    private String updatedClinicalFindings;
    private String updatedReportData;

    @Builder.Default
    private Boolean submitImmediately = false;
}
