package com.hospital.hms.patientmanagement.event;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Patient Discharge Event
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
public class PatientDischargeEvent {

    private UUID patientId;
    private String dischargeType;
    private String dischargeDisposition;
    private LocalDateTime dischargeDateTime;
    private UUID dischargingPhysicianId;
    private String dischargeInstructions;

    // Constructors
    public PatientDischargeEvent() {}

    private PatientDischargeEvent(Builder builder) {
        this.patientId = builder.patientId;
        this.dischargeType = builder.dischargeType;
        this.dischargeDisposition = builder.dischargeDisposition;
        this.dischargeDateTime = builder.dischargeDateTime;
        this.dischargingPhysicianId = builder.dischargingPhysicianId;
        this.dischargeInstructions = builder.dischargeInstructions;
    }

    public static Builder builder() {
        return new Builder();
    }

    // Getters and Setters
    public UUID getPatientId() {
        return patientId;
    }

    public void setPatientId(UUID patientId) {
        this.patientId = patientId;
    }

    public String getDischargeType() {
        return dischargeType;
    }

    public void setDischargeType(String dischargeType) {
        this.dischargeType = dischargeType;
    }

    public String getDischargeDisposition() {
        return dischargeDisposition;
    }

    public void setDischargeDisposition(String dischargeDisposition) {
        this.dischargeDisposition = dischargeDisposition;
    }

    public LocalDateTime getDischargeDateTime() {
        return dischargeDateTime;
    }

    public void setDischargeDateTime(LocalDateTime dischargeDateTime) {
        this.dischargeDateTime = dischargeDateTime;
    }

    public UUID getDischargingPhysicianId() {
        return dischargingPhysicianId;
    }

    public void setDischargingPhysicianId(UUID dischargingPhysicianId) {
        this.dischargingPhysicianId = dischargingPhysicianId;
    }

    public String getDischargeInstructions() {
        return dischargeInstructions;
    }

    public void setDischargeInstructions(String dischargeInstructions) {
        this.dischargeInstructions = dischargeInstructions;
    }

    // Builder Pattern
    public static class Builder {
        private UUID patientId;
        private String dischargeType;
        private String dischargeDisposition;
        private LocalDateTime dischargeDateTime;
        private UUID dischargingPhysicianId;
        private String dischargeInstructions;

        public Builder patientId(UUID patientId) {
            this.patientId = patientId;
            return this;
        }

        public Builder dischargeType(String dischargeType) {
            this.dischargeType = dischargeType;
            return this;
        }

        public Builder dischargeDisposition(String dischargeDisposition) {
            this.dischargeDisposition = dischargeDisposition;
            return this;
        }

        public Builder dischargeDateTime(LocalDateTime dischargeDateTime) {
            this.dischargeDateTime = dischargeDateTime;
            return this;
        }

        public Builder dischargingPhysicianId(UUID dischargingPhysicianId) {
            this.dischargingPhysicianId = dischargingPhysicianId;
            return this;
        }

        public Builder dischargeInstructions(String dischargeInstructions) {
            this.dischargeInstructions = dischargeInstructions;
            return this;
        }

        public PatientDischargeEvent build() {
            return new PatientDischargeEvent(this);
        }
    }
}
