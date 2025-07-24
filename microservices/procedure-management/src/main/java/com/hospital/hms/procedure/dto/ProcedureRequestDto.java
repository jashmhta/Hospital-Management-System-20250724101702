package com.hospital.hms.procedure.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Positive;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * Procedure Request DTO
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProcedureRequestDto {

    @NotBlank(message = "Patient ID is required")
    private String patientId;

    @NotBlank(message = "Procedure type is required")
    private String procedureType;

    @NotBlank(message = "Procedure name is required")
    private String procedureName;

    private String description;

    @NotNull(message = "Priority is required")
    @Pattern(regexp = "ROUTINE|SEMI_URGENT|URGENT|EMERGENCY", message = "Invalid priority level")
    private String priority;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime scheduledDateTime;

    @Positive(message = "Estimated duration must be positive")
    private Integer estimatedDurationMinutes;

    private String assignedRoom;

    @NotBlank(message = "Primary physician is required")
    private String primaryPhysician;

    private List<String> assignedStaff;

    private List<String> requiredEquipment;

    private String preProcedureNotes;

    @NotBlank(message = "Department is required")
    private String department;

    private String specialty;

    @Builder.Default
    private Boolean urgent = false;

    @Builder.Default
    private Boolean consentObtained = false;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime consentDateTime;

    private String workflowId;

    private Map<String, Object> metadata;

    private String createdBy;

    // Validation methods
    public boolean isValid() {
        return patientId != null && !patientId.trim().isEmpty() &&
               procedureType != null && !procedureType.trim().isEmpty() &&
               procedureName != null && !procedureName.trim().isEmpty() &&
               primaryPhysician != null && !primaryPhysician.trim().isEmpty() &&
               department != null && !department.trim().isEmpty();
    }

    // Helper methods
    public boolean requiresUrgentHandling() {
        return urgent || "EMERGENCY".equals(priority) || "URGENT".equals(priority);
    }

    public boolean isConsentRequired() {
        // Define procedures that require consent
        if (procedureType == null) return true;
        String type = procedureType.toUpperCase();
        return type.contains("SURGERY") || type.contains("INVASIVE") || 
               type.contains("BIOPSY") || type.contains("INTERVENTION");
    }

    public boolean hasValidScheduling() {
        return scheduledDateTime != null && scheduledDateTime.isAfter(LocalDateTime.now());
    }
}
