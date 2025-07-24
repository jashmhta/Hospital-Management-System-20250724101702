package com.hospital.hms.provider.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Map;

/**
 * Patient Summary DTO for Mobile Provider
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PatientSummaryDto {

    private String patientId;
    
    private String firstName;
    
    private String lastName;
    
    private String fullName;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dateOfBirth;
    
    private Integer age;
    
    private String gender;
    
    private String contactNumber;
    
    private String email;
    
    private String mrn; // Medical Record Number
    
    private String status; // ACTIVE, INACTIVE, DISCHARGED
    
    private String patientType; // INPATIENT, OUTPATIENT, EMERGENCY
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime lastVisit;
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime nextAppointment;
    
    private String primaryPhysician;
    
    private String currentLocation; // Room number for inpatients
    
    private String department;
    
    private Integer riskScore;
    
    private String riskLevel; // LOW, MEDIUM, HIGH, CRITICAL
    
    private String[] allergies;
    
    private String[] chronicConditions;
    
    private String[] currentMedications;
    
    private Boolean hasAlerts;
    
    private Integer alertCount;
    
    private String photoUrl;
    
    private String insuranceProvider;
    
    private String emergencyContact;
    
    private String emergencyContactPhone;
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime lastActivity;
    
    private Map<String, Object> vitals; // Latest vital signs
    
    private String notes; // Provider notes or patient instructions
    
    // Factory method to create from Map (for compatibility with service layer)
    public static PatientSummaryDto fromMap(Map<String, Object> data) {
        return PatientSummaryDto.builder()
            .patientId((String) data.get("patientId"))
            .firstName((String) data.get("firstName"))
            .lastName((String) data.get("lastName"))
            .fullName((String) data.get("fullName"))
            .mrn((String) data.get("mrn"))
            .status((String) data.get("status"))
            .patientType((String) data.get("patientType"))
            .contactNumber((String) data.get("contactNumber"))
            .email((String) data.get("email"))
            .primaryPhysician((String) data.get("primaryPhysician"))
            .currentLocation((String) data.get("currentLocation"))
            .department((String) data.get("department"))
            .hasAlerts((Boolean) data.getOrDefault("hasAlerts", false))
            .alertCount((Integer) data.getOrDefault("alertCount", 0))
            .riskLevel((String) data.getOrDefault("riskLevel", "LOW"))
            .lastActivity((LocalDateTime) data.get("lastActivity"))
            .build();
    }
}
