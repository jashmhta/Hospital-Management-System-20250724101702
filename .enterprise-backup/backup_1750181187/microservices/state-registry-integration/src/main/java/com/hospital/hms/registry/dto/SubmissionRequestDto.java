package com.hospital.hms.registry.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

/**
 * DTO for registry submission requests
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubmissionRequestDto {

    @NotBlank(message = "Registry endpoint is required")
    private String registryEndpoint;

    @Pattern(regexp = "HL7|FHIR|XML|JSON|EDI|AMENDMENT", message = "Invalid submission method")
    private String submissionMethod;

    private String authenticationToken;
    
    private String submissionFormat;
    
    private Boolean requireAcknowledgment;
    
    private Integer timeoutSeconds;
    
    private String priority;
}
