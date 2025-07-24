package com.hospital.hms.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

/**
 * Data Retention Policy DTO
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DataRetentionPolicyDto {

    @NotBlank(message = "Source type is required")
    private String sourceType;

    @NotNull(message = "Retention days is required")
    @Min(value = 1, message = "Retention days must be at least 1")
    private Integer retentionDays;

    @Builder.Default
    private String archiveLocation = "COLD_STORAGE";

    @Builder.Default
    private Boolean compressData = true;

    @Builder.Default
    private Boolean encryptArchive = true;

    private String description;
}
