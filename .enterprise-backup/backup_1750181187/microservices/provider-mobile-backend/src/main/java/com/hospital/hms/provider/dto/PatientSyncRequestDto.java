package com.hospital.hms.provider.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.Size;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Patient Sync Request DTO
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PatientSyncRequestDto {

    @Size(max = 100, message = "Maximum 100 patient IDs per sync request")
    private List<String> patientIds;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime lastSyncTime;

    @Builder.Default
    private Boolean fullSync = false;

    @Builder.Default
    private Boolean includeVitals = true;

    @Builder.Default
    private Boolean includeMedications = true;

    @Builder.Default
    private Boolean includeAllergies = true;

    @Builder.Default
    private Boolean includeLabResults = false;

    @Builder.Default
    private Boolean includeImagingResults = false;

    private String[] dataTypes; // DEMOGRAPHICS, VITALS, MEDICATIONS, ALLERGIES, LAB_RESULTS, etc.

    private String syncScope; // ASSIGNED_PATIENTS, DEPARTMENT_PATIENTS, RECENT_PATIENTS

    private Map<String, Object> filterCriteria;

    @Builder.Default
    private Integer maxRecords = 50;

    private String correlationId;

    // Convert to Map for service layer compatibility
    public Map<String, Object> toMap() {
        Map<String, Object> map = new HashMap<>();
        map.put("patientIds", patientIds != null ? patientIds : new ArrayList<>());
        map.put("lastSyncTime", lastSyncTime != null ? lastSyncTime.toString() : null);
        map.put("fullSync", fullSync);
        map.put("includeVitals", includeVitals);
        map.put("includeMedications", includeMedications);
        map.put("includeAllergies", includeAllergies);
        map.put("includeLabResults", includeLabResults);
        map.put("includeImagingResults", includeImagingResults);
        map.put("dataTypes", dataTypes);
        map.put("syncScope", syncScope);
        map.put("filterCriteria", filterCriteria);
        map.put("maxRecords", maxRecords);
        map.put("correlationId", correlationId);
        return map;
    }
}
