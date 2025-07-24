package com.hospital.hms.patientmanagement.event;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Patient Status Changed Event
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
public class PatientStatusChangedEvent {

    private UUID patientId;
    private String oldStatus;
    private String newStatus;
    private LocalDateTime timestamp;
    private String reason;
    private String changedBy;

    // Constructors
    public PatientStatusChangedEvent() {}

    private PatientStatusChangedEvent(Builder builder) {
        this.patientId = builder.patientId;
        this.oldStatus = builder.oldStatus;
        this.newStatus = builder.newStatus;
        this.timestamp = builder.timestamp;
        this.reason = builder.reason;
        this.changedBy = builder.changedBy;
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

    public String getOldStatus() {
        return oldStatus;
    }

    public void setOldStatus(String oldStatus) {
        this.oldStatus = oldStatus;
    }

    public String getNewStatus() {
        return newStatus;
    }

    public void setNewStatus(String newStatus) {
        this.newStatus = newStatus;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getChangedBy() {
        return changedBy;
    }

    public void setChangedBy(String changedBy) {
        this.changedBy = changedBy;
    }

    // Builder Pattern
    public static class Builder {
        private UUID patientId;
        private String oldStatus;
        private String newStatus;
        private LocalDateTime timestamp;
        private String reason;
        private String changedBy;

        public Builder patientId(UUID patientId) {
            this.patientId = patientId;
            return this;
        }

        public Builder oldStatus(String oldStatus) {
            this.oldStatus = oldStatus;
            return this;
        }

        public Builder newStatus(String newStatus) {
            this.newStatus = newStatus;
            return this;
        }

        public Builder timestamp(LocalDateTime timestamp) {
            this.timestamp = timestamp;
            return this;
        }

        public Builder reason(String reason) {
            this.reason = reason;
            return this;
        }

        public Builder changedBy(String changedBy) {
            this.changedBy = changedBy;
            return this;
        }

        public PatientStatusChangedEvent build() {
            return new PatientStatusChangedEvent(this);
        }
    }
}
