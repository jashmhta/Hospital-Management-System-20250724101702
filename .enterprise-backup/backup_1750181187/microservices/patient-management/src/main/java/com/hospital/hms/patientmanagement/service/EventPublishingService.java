package com.hospital.hms.patientmanagement.service;

import com.hospital.hms.patientmanagement.entity.Patient;
import com.hospital.hms.patientmanagement.event.PatientCreatedEvent;
import com.hospital.hms.patientmanagement.event.PatientUpdatedEvent;
import com.hospital.hms.patientmanagement.event.PatientDeactivatedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Service for publishing domain events
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class EventPublishingService {

    private final ApplicationEventPublisher eventPublisher;
    private final SecurityContextService securityContextService;

    /**
     * Publish patient created event
     * 
     * @param patient Created patient
     */
    public void publishPatientCreated(Patient patient) {
        try {
            PatientCreatedEvent event = PatientCreatedEvent.builder()
                .patientId(patient.getId())
                .medicalRecordNumber(patient.getMedicalRecordNumber())
                .patientName(patient.getGivenName() + " " + patient.getFamilyName())
                .eventId(UUID.randomUUID())
                .timestamp(LocalDateTime.now())
                .userId(securityContextService.getCurrentUser())
                .build();
            
            eventPublisher.publishEvent(event);
            log.info("Published PatientCreatedEvent for patient: {} (MRN: {})", 
                patient.getId(), patient.getMedicalRecordNumber());
                
        } catch (Exception e) {
            log.error("Failed to publish PatientCreatedEvent for patient: {}", patient.getId(), e);
        }
    }

    /**
     * Publish patient updated event
     * 
     * @param patient Updated patient
     * @param changes Map of changed fields
     */
    public void publishPatientUpdated(Patient patient, String changes) {
        try {
            PatientUpdatedEvent event = PatientUpdatedEvent.builder()
                .patientId(patient.getId())
                .medicalRecordNumber(patient.getMedicalRecordNumber())
                .patientName(patient.getGivenName() + " " + patient.getFamilyName())
                .changes(changes)
                .eventId(UUID.randomUUID())
                .timestamp(LocalDateTime.now())
                .userId(securityContextService.getCurrentUser())
                .build();
            
            eventPublisher.publishEvent(event);
            log.info("Published PatientUpdatedEvent for patient: {} (MRN: {})", 
                patient.getId(), patient.getMedicalRecordNumber());
                
        } catch (Exception e) {
            log.error("Failed to publish PatientUpdatedEvent for patient: {}", patient.getId(), e);
        }
    }

    /**
     * Publish patient deactivated event
     * 
     * @param patient Deactivated patient
     * @param reason Reason for deactivation
     */
    public void publishPatientDeactivated(Patient patient, String reason) {
        try {
            PatientDeactivatedEvent event = PatientDeactivatedEvent.builder()
                .patientId(patient.getId())
                .medicalRecordNumber(patient.getMedicalRecordNumber())
                .patientName(patient.getGivenName() + " " + patient.getFamilyName())
                .reason(reason)
                .eventId(UUID.randomUUID())
                .timestamp(LocalDateTime.now())
                .userId(securityContextService.getCurrentUser())
                .build();
            
            eventPublisher.publishEvent(event);
            log.info("Published PatientDeactivatedEvent for patient: {} (MRN: {})", 
                patient.getId(), patient.getMedicalRecordNumber());
                
        } catch (Exception e) {
            log.error("Failed to publish PatientDeactivatedEvent for patient: {}", patient.getId(), e);
        }
    }
}
