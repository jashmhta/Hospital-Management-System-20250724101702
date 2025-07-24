package com.hospital.hms.registry.dto;

import com.hospital.hms.registry.entity.RegistryType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * DTO for submission events
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubmissionEventDto {

    private String eventType;
    private UUID reportId;
    private String submissionId;
    private RegistryType registryType;
    private String externalReferenceId;
    private LocalDateTime timestamp;
}
