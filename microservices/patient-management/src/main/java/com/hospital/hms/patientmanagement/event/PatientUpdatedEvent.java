package com.hospital.hms.patientmanagement.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Event published when a patient is updated
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PatientUpdatedEvent {
    
    private UUID eventId;
    private UUID patientId;
    private String medicalRecordNumber;
    private String patientName;
    private String changes;
    private LocalDateTime timestamp;
    private String userId;
    private String eventType = "PATIENT_UPDATED";
    private String serviceName = "patient-management";
}
