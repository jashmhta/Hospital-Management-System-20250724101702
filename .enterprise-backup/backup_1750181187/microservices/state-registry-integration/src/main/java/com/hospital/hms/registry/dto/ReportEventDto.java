package com.hospital.hms.registry.dto;

import com.hospital.hms.registry.entity.ReportType;
import com.hospital.hms.registry.entity.RegistryType;
import com.hospital.hms.registry.entity.PriorityLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * DTO for report events
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReportEventDto {

    private String eventType;
    private UUID reportId;
    private ReportType reportType;
    private RegistryType registryType;
    private UUID patientId;
    private PriorityLevel priorityLevel;
    private LocalDateTime timestamp;
}
