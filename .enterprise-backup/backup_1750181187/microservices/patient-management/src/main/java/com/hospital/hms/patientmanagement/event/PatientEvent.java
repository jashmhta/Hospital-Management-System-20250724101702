package com.hospital.hms.patientmanagement.event;

import com.hospital.hms.patientmanagement.dto.PatientResponseDto;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Base Patient Event class for inter-service communication
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
public class PatientEvent {

    private UUID eventId;
    private PatientEventType eventType;
    private UUID patientId;
    private LocalDateTime timestamp;
    private String source;
    
    // Event-specific data fields
    private PatientResponseDto patientData;
    private PatientStatusChangedEvent statusChangeData;
    private PatientAdmissionEvent admissionData;
    private PatientDischargeEvent dischargeData;

    // Constructors
    public PatientEvent() {}

    private PatientEvent(Builder builder) {
        this.eventId = builder.eventId;
        this.eventType = builder.eventType;
        this.patientId = builder.patientId;
        this.timestamp = builder.timestamp;
        this.source = builder.source;
        this.patientData = builder.patientData;
        this.statusChangeData = builder.statusChangeData;
        this.admissionData = builder.admissionData;
        this.dischargeData = builder.dischargeData;
    }

    public static Builder builder() {
        return new Builder();
    }

    // Getters and Setters
    public UUID getEventId() {
        return eventId;
    }

    public void setEventId(UUID eventId) {
        this.eventId = eventId;
    }

    public PatientEventType getEventType() {
        return eventType;
    }

    public void setEventType(PatientEventType eventType) {
        this.eventType = eventType;
    }

    public UUID getPatientId() {
        return patientId;
    }

    public void setPatientId(UUID patientId) {
        this.patientId = patientId;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public PatientResponseDto getPatientData() {
        return patientData;
    }

    public void setPatientData(PatientResponseDto patientData) {
        this.patientData = patientData;
    }

    public PatientStatusChangedEvent getStatusChangeData() {
        return statusChangeData;
    }

    public void setStatusChangeData(PatientStatusChangedEvent statusChangeData) {
        this.statusChangeData = statusChangeData;
    }

    public PatientAdmissionEvent getAdmissionData() {
        return admissionData;
    }

    public void setAdmissionData(PatientAdmissionEvent admissionData) {
        this.admissionData = admissionData;
    }

    public PatientDischargeEvent getDischargeData() {
        return dischargeData;
    }

    public void setDischargeData(PatientDischargeEvent dischargeData) {
        this.dischargeData = dischargeData;
    }

    // Builder Pattern
    public static class Builder {
        private UUID eventId;
        private PatientEventType eventType;
        private UUID patientId;
        private LocalDateTime timestamp;
        private String source;
        private PatientResponseDto patientData;
        private PatientStatusChangedEvent statusChangeData;
        private PatientAdmissionEvent admissionData;
        private PatientDischargeEvent dischargeData;

        public Builder eventId(UUID eventId) {
            this.eventId = eventId;
            return this;
        }

        public Builder eventType(PatientEventType eventType) {
            this.eventType = eventType;
            return this;
        }

        public Builder patientId(UUID patientId) {
            this.patientId = patientId;
            return this;
        }

        public Builder timestamp(LocalDateTime timestamp) {
            this.timestamp = timestamp;
            return this;
        }

        public Builder source(String source) {
            this.source = source;
            return this;
        }

        public Builder patientData(PatientResponseDto patientData) {
            this.patientData = patientData;
            return this;
        }

        public Builder statusChangeData(PatientStatusChangedEvent statusChangeData) {
            this.statusChangeData = statusChangeData;
            return this;
        }

        public Builder admissionData(PatientAdmissionEvent admissionData) {
            this.admissionData = admissionData;
            return this;
        }

        public Builder dischargeData(PatientDischargeEvent dischargeData) {
            this.dischargeData = dischargeData;
            return this;
        }

        public PatientEvent build() {
            return new PatientEvent(this);
        }
    }
}
