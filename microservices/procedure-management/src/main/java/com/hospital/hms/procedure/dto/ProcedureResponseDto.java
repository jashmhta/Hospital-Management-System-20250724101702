package com.hospital.hms.procedure.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * Procedure Response DTO
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProcedureResponseDto {

    private String procedureId;

    private String patientId;

    private String patientName;

    private String procedureType;

    private String procedureName;

    private String description;

    private String status; // SCHEDULED, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED, etc.

    private String priority; // ROUTINE, SEMI_URGENT, URGENT, EMERGENCY

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime scheduledDateTime;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime actualStartTime;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime actualEndTime;

    private Integer estimatedDurationMinutes;

    private Integer actualDurationMinutes;

    private String assignedRoom;

    private String primaryPhysician;

    private String primaryPhysicianName;

    private List<String> assignedStaff;

    private List<String> requiredEquipment;

    private String preProcedureNotes;

    private String postProcedureNotes;

    private String complications;

    private Boolean consentObtained;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime consentDateTime;

    private String department;

    private String specialty;

    private Boolean urgent;

    private String cancellationReason;

    private String rescheduledFrom;

    private String workflowId;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime createdAt;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime updatedAt;

    private String createdBy;

    private String updatedBy;

    // Related data
    private List<ProcedureResourceDto> allocatedResources;

    private List<ProcedureEventDto> events;

    private Map<String, Object> metadata;

    // Computed fields
    private String statusDisplayName;

    private String priorityDisplayName;

    private Boolean isOverdue;

    private Boolean canStart;

    private Boolean canComplete;

    private Boolean canCancel;

    private Integer progressPercentage;

    private String nextAction;

    private Boolean hasAlerts;

    private List<String> alertMessages;

    // Helper methods
    public boolean isCompleted() {
        return "COMPLETED".equals(status);
    }

    public boolean isInProgress() {
        return "IN_PROGRESS".equals(status);
    }

    public boolean isCancelled() {
        return "CANCELLED".equals(status);
    }

    public boolean isScheduled() {
        return "SCHEDULED".equals(status) || "CONFIRMED".equals(status);
    }

    public boolean requiresImmedateAttention() {
        return urgent || "EMERGENCY".equals(priority) || 
               (isOverdue != null && isOverdue) ||
               (hasAlerts != null && hasAlerts);
    }

    public String getDisplayStatus() {
        if (statusDisplayName != null) {
            return statusDisplayName;
        }
        
        return switch (status != null ? status : "UNKNOWN") {
            case "SCHEDULED" -> "Scheduled";
            case "CONFIRMED" -> "Confirmed";
            case "IN_PROGRESS" -> "In Progress";
            case "COMPLETED" -> "Completed";
            case "CANCELLED" -> "Cancelled";
            case "POSTPONED" -> "Postponed";
            case "NO_SHOW" -> "No Show";
            case "WAITING" -> "Waiting";
            case "PREP" -> "Preparation";
            case "RECOVERY" -> "Recovery";
            default -> "Unknown";
        };
    }

    public String getDisplayPriority() {
        if (priorityDisplayName != null) {
            return priorityDisplayName;
        }
        
        return switch (priority != null ? priority : "ROUTINE") {
            case "EMERGENCY" -> "Emergency";
            case "URGENT" -> "Urgent";
            case "SEMI_URGENT" -> "Semi-Urgent";
            case "ROUTINE" -> "Routine";
            default -> "Routine";
        };
    }

    public long getDurationInMinutes() {
        if (actualStartTime != null && actualEndTime != null) {
            return java.time.Duration.between(actualStartTime, actualEndTime).toMinutes();
        }
        return estimatedDurationMinutes != null ? estimatedDurationMinutes : 0;
    }

    // Nested DTOs
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProcedureResourceDto {
        private String resourceId;
        private String resourceType;
        private String resourceName;
        private String resourceIdentifier;
        private String allocationStatus;
        private LocalDateTime allocatedFrom;
        private LocalDateTime allocatedTo;
        private Integer quantity;
        private String notes;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProcedureEventDto {
        private String eventId;
        private String eventType;
        private String eventDescription;
        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
        private LocalDateTime eventTime;
        private String performedBy;
        private String severity;
        private String location;
        private String patientCondition;
        private Boolean notificationSent;
    }
}
