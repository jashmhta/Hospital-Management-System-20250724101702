package com.hospital.hms.procedure.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Procedure Search Criteria DTO
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProcedureSearchCriteriaDto {

    private String patientId;

    private String patientName;

    private String procedureType;

    private String procedureName;

    private List<String> statuses;

    private List<String> priorities;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate scheduledStartDate;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate scheduledEndDate;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime scheduledStartDateTime;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime scheduledEndDateTime;

    private String department;

    private String specialty;

    private String primaryPhysician;

    private String assignedRoom;

    private List<String> assignedStaff;

    private Boolean urgent;

    private Boolean consentObtained;

    private Boolean overdue;

    private Boolean hasComplications;

    private String workflowId;

    private String createdBy;

    private String updatedBy;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate createdStartDate;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate createdEndDate;

    // Search options
    @Builder.Default
    private Boolean includeResources = false;

    @Builder.Default
    private Boolean includeEvents = false;

    @Builder.Default
    private Boolean includePatientInfo = false;

    // Sorting options
    private String sortBy; // scheduledDateTime, createdAt, priority, status

    @Builder.Default
    private String sortDirection = "ASC"; // ASC, DESC

    // Pagination (backup in case not provided in controller)
    @Min(0)
    @Builder.Default
    private Integer page = 0;

    @Min(1)
    @Max(100)
    @Builder.Default
    private Integer size = 20;

    // Full-text search
    private String searchText; // Search across procedure name, description, notes

    // Filter by procedure characteristics
    private Integer minDurationMinutes;

    private Integer maxDurationMinutes;

    private List<String> requiredEquipment;

    // Date range helpers
    public boolean hasDateRange() {
        return (scheduledStartDate != null && scheduledEndDate != null) ||
               (scheduledStartDateTime != null && scheduledEndDateTime != null);
    }

    public boolean hasCreatedDateRange() {
        return createdStartDate != null && createdEndDate != null;
    }

    // Validation helpers
    public boolean isValid() {
        // Check if at least one search criteria is provided
        return patientId != null || patientName != null || procedureType != null ||
               procedureName != null || department != null || primaryPhysician != null ||
               hasDateRange() || searchText != null || urgent != null;
    }

    public boolean hasAdvancedFilters() {
        return hasComplications != null || overdue != null || consentObtained != null ||
               minDurationMinutes != null || maxDurationMinutes != null ||
               (requiredEquipment != null && !requiredEquipment.isEmpty());
    }

    // Convert to search parameters map for service layer
    public java.util.Map<String, Object> toSearchParameters() {
        java.util.Map<String, Object> params = new java.util.HashMap<>();
        
        if (patientId != null) params.put("patientId", patientId);
        if (patientName != null) params.put("patientName", patientName);
        if (procedureType != null) params.put("procedureType", procedureType);
        if (procedureName != null) params.put("procedureName", procedureName);
        if (statuses != null) params.put("statuses", statuses);
        if (priorities != null) params.put("priorities", priorities);
        if (department != null) params.put("department", department);
        if (specialty != null) params.put("specialty", specialty);
        if (primaryPhysician != null) params.put("primaryPhysician", primaryPhysician);
        if (assignedRoom != null) params.put("assignedRoom", assignedRoom);
        if (assignedStaff != null) params.put("assignedStaff", assignedStaff);
        if (urgent != null) params.put("urgent", urgent);
        if (consentObtained != null) params.put("consentObtained", consentObtained);
        if (overdue != null) params.put("overdue", overdue);
        if (hasComplications != null) params.put("hasComplications", hasComplications);
        if (workflowId != null) params.put("workflowId", workflowId);
        if (searchText != null) params.put("searchText", searchText);
        if (minDurationMinutes != null) params.put("minDurationMinutes", minDurationMinutes);
        if (maxDurationMinutes != null) params.put("maxDurationMinutes", maxDurationMinutes);
        if (requiredEquipment != null) params.put("requiredEquipment", requiredEquipment);
        
        // Date ranges
        if (scheduledStartDate != null) params.put("scheduledStartDate", scheduledStartDate);
        if (scheduledEndDate != null) params.put("scheduledEndDate", scheduledEndDate);
        if (scheduledStartDateTime != null) params.put("scheduledStartDateTime", scheduledStartDateTime);
        if (scheduledEndDateTime != null) params.put("scheduledEndDateTime", scheduledEndDateTime);
        if (createdStartDate != null) params.put("createdStartDate", createdStartDate);
        if (createdEndDate != null) params.put("createdEndDate", createdEndDate);
        
        // Options
        params.put("includeResources", includeResources);
        params.put("includeEvents", includeEvents);
        params.put("includePatientInfo", includePatientInfo);
        params.put("sortBy", sortBy != null ? sortBy : "scheduledDateTime");
        params.put("sortDirection", sortDirection);
        
        return params;
    }
}
