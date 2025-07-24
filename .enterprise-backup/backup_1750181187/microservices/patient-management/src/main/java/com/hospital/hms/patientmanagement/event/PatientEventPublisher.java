package com.hospital.hms.patientmanagement.event;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.stream.function.StreamBridge;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.stereotype.Component;

import com.hospital.hms.patientmanagement.dto.PatientResponseDto;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Event Publisher for Patient-related events
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Component
public class PatientEventPublisher {

    private final StreamBridge streamBridge;

    @Autowired
    public PatientEventPublisher(StreamBridge streamBridge) {
        this.streamBridge = streamBridge;
    }

    /**
     * Publish patient created event
     */
    public void publishPatientCreated(PatientResponseDto patient) {
        PatientEvent event = PatientEvent.builder()
                .eventId(UUID.randomUUID())
                .eventType(PatientEventType.PATIENT_CREATED)
                .patientId(patient.getId())
                .patientData(patient)
                .timestamp(LocalDateTime.now())
                .source("patient-management-service")
                .build();

        streamBridge.send("patient-events-out-0", 
            MessageBuilder.withPayload(event)
                .setHeader("eventType", event.getEventType().name())
                .setHeader("patientId", event.getPatientId().toString())
                .build());
    }

    /**
     * Publish patient updated event
     */
    public void publishPatientUpdated(PatientResponseDto patient) {
        PatientEvent event = PatientEvent.builder()
                .eventId(UUID.randomUUID())
                .eventType(PatientEventType.PATIENT_UPDATED)
                .patientId(patient.getId())
                .patientData(patient)
                .timestamp(LocalDateTime.now())
                .source("patient-management-service")
                .build();

        streamBridge.send("patient-events-out-0", 
            MessageBuilder.withPayload(event)
                .setHeader("eventType", event.getEventType().name())
                .setHeader("patientId", event.getPatientId().toString())
                .build());
    }

    /**
     * Publish patient status changed event
     */
    public void publishPatientStatusChanged(UUID patientId, String oldStatus, String newStatus) {
        PatientStatusChangedEvent statusEvent = PatientStatusChangedEvent.builder()
                .patientId(patientId)
                .oldStatus(oldStatus)
                .newStatus(newStatus)
                .timestamp(LocalDateTime.now())
                .build();

        PatientEvent event = PatientEvent.builder()
                .eventId(UUID.randomUUID())
                .eventType(PatientEventType.PATIENT_STATUS_CHANGED)
                .patientId(patientId)
                .statusChangeData(statusEvent)
                .timestamp(LocalDateTime.now())
                .source("patient-management-service")
                .build();

        streamBridge.send("patient-events-out-0", 
            MessageBuilder.withPayload(event)
                .setHeader("eventType", event.getEventType().name())
                .setHeader("patientId", event.getPatientId().toString())
                .build());
    }

    /**
     * Publish patient admitted event
     */
    public void publishPatientAdmitted(UUID patientId, UUID facilityId, String admissionType) {
        PatientAdmissionEvent admissionEvent = PatientAdmissionEvent.builder()
                .patientId(patientId)
                .facilityId(facilityId)
                .admissionType(admissionType)
                .admissionDateTime(LocalDateTime.now())
                .build();

        PatientEvent event = PatientEvent.builder()
                .eventId(UUID.randomUUID())
                .eventType(PatientEventType.PATIENT_ADMITTED)
                .patientId(patientId)
                .admissionData(admissionEvent)
                .timestamp(LocalDateTime.now())
                .source("patient-management-service")
                .build();

        streamBridge.send("patient-events-out-0", 
            MessageBuilder.withPayload(event)
                .setHeader("eventType", event.getEventType().name())
                .setHeader("patientId", event.getPatientId().toString())
                .build());
    }

    /**
     * Publish patient discharged event
     */
    public void publishPatientDischarged(UUID patientId, String dischargeType, String dischargeDisposition) {
        PatientDischargeEvent dischargeEvent = PatientDischargeEvent.builder()
                .patientId(patientId)
                .dischargeType(dischargeType)
                .dischargeDisposition(dischargeDisposition)
                .dischargeDateTime(LocalDateTime.now())
                .build();

        PatientEvent event = PatientEvent.builder()
                .eventId(UUID.randomUUID())
                .eventType(PatientEventType.PATIENT_DISCHARGED)
                .patientId(patientId)
                .dischargeData(dischargeEvent)
                .timestamp(LocalDateTime.now())
                .source("patient-management-service")
                .build();

        streamBridge.send("patient-events-out-0", 
            MessageBuilder.withPayload(event)
                .setHeader("eventType", event.getEventType().name())
                .setHeader("patientId", event.getPatientId().toString())
                .build());
    }
}
