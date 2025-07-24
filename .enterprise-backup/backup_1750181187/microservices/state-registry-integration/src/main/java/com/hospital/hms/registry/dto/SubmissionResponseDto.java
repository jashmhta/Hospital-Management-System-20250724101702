package com.hospital.hms.registry.dto;

import com.hospital.hms.registry.entity.SubmissionStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * DTO for registry submission responses
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubmissionResponseDto {

    private UUID reportId;
    private String submissionId;
    private String externalReferenceId;
    private String acknowledgmentId;
    private SubmissionStatus submissionStatus;
    private LocalDateTime submissionDate;
    private LocalDateTime acknowledgmentDate;
    private String responseMessage;
    private String errorDetails;
}
