package com.hospital.hms.patientmanagement.event;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Patient Admission Event
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
public class PatientAdmissionEvent {

    private UUID patientId;
    private UUID facilityId;
    private String admissionType;
    private LocalDateTime admissionDateTime;
    private String department;
    private UUID admittingPhysicianId;

    // Constructors
    public PatientAdmissionEvent() {}

    private PatientAdmissionEvent(Builder builder) {
        this.patientId = builder.patientId;
        this.facilityId = builder.facilityId;
        this.admissionType = builder.admissionType;
        this.admissionDateTime = builder.admissionDateTime;
        this.department = builder.department;
        this.admittingPhysicianId = builder.admittingPhysicianId;
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

    public UUID getFacilityId() {
        return facilityId;
    }

    public void setFacilityId(UUID facilityId) {
        this.facilityId = facilityId;
    }

    public String getAdmissionType() {
        return admissionType;
    }

    public void setAdmissionType(String admissionType) {
        this.admissionType = admissionType;
    }

    public LocalDateTime getAdmissionDateTime() {
        return admissionDateTime;
    }

    public void setAdmissionDateTime(LocalDateTime admissionDateTime) {
        this.admissionDateTime = admissionDateTime;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public UUID getAdmittingPhysicianId() {
        return admittingPhysicianId;
    }

    public void setAdmittingPhysicianId(UUID admittingPhysicianId) {
        this.admittingPhysicianId = admittingPhysicianId;
    }

    // Builder Pattern
    public static class Builder {
        private UUID patientId;
        private UUID facilityId;
        private String admissionType;
        private LocalDateTime admissionDateTime;
        private String department;
        private UUID admittingPhysicianId;

        public Builder patientId(UUID patientId) {
            this.patientId = patientId;
            return this;
        }

        public Builder facilityId(UUID facilityId) {
            this.facilityId = facilityId;
            return this;
        }

        public Builder admissionType(String admissionType) {
            this.admissionType = admissionType;
            return this;
        }

        public Builder admissionDateTime(LocalDateTime admissionDateTime) {
            this.admissionDateTime = admissionDateTime;
            return this;
        }

        public Builder department(String department) {
            this.department = department;
            return this;
        }

        public Builder admittingPhysicianId(UUID admittingPhysicianId) {
            this.admittingPhysicianId = admittingPhysicianId;
            return this;
        }

        public PatientAdmissionEvent build() {
            return new PatientAdmissionEvent(this);
        }
    }
}
