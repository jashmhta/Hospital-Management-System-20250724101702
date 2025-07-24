package com.hms.patientportal.entity;

import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

/**
 * Appointment Request Entity
 * 
 * Represents patient appointment requests made through the portal
 * including scheduling preferences, reasons, and approval workflow.
 */
@Entity
@Table(name = "appointment_requests",
    indexes = {
        @Index(name = "idx_appointment_patient", columnList = "patient_id"),
        @Index(name = "idx_appointment_status", columnList = "status"),
        @Index(name = "idx_appointment_requested_date", columnList = "requested_date"),
        @Index(name = "idx_appointment_provider", columnList = "requested_provider_id")
    }
)
@EntityListeners(AuditingEntityListener.class)
public class AppointmentRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private PatientPortalUser patient;

    @Column(name = "requested_provider_id")
    private Long requestedProviderId;

    @Column(name = "requested_provider_name", length = 200)
    private String requestedProviderName;

    @Column(name = "requested_specialty", length = 100)
    private String requestedSpecialty;

    @Column(name = "requested_date")
    private LocalDateTime requestedDate;

    @Column(name = "preferred_time_slot", length = 50)
    private String preferredTimeSlot;

    @Enumerated(EnumType.STRING)
    @Column(name = "appointment_type", nullable = false)
    private AppointmentType appointmentType;

    @Enumerated(EnumType.STRING)
    @Column(name = "priority", nullable = false)
    private Priority priority = Priority.ROUTINE;

    @Column(name = "reason_for_visit", columnDefinition = "TEXT")
    private String reasonForVisit;

    @Column(name = "symptoms", columnDefinition = "TEXT")
    private String symptoms;

    @Column(name = "preferred_language", length = 50)
    private String preferredLanguage;

    @Column(name = "insurance_information", columnDefinition = "TEXT")
    private String insuranceInformation;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private RequestStatus status = RequestStatus.PENDING;

    @Column(name = "approved_appointment_id")
    private Long approvedAppointmentId;

    @Column(name = "approved_date")
    private LocalDateTime approvedDate;

    @Column(name = "approved_by")
    private String approvedBy;

    @Column(name = "rejection_reason", columnDefinition = "TEXT")
    private String rejectionReason;

    @Column(name = "staff_notes", columnDefinition = "TEXT")
    private String staffNotes;

    @Column(name = "patient_phone", length = 20)
    private String patientPhone;

    @Column(name = "patient_email", length = 255)
    private String patientEmail;

    @Column(name = "emergency_contact_name", length = 200)
    private String emergencyContactName;

    @Column(name = "emergency_contact_phone", length = 20)
    private String emergencyContactPhone;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Version
    private Long version;

    // Constructors
    public AppointmentRequest() {}

    public AppointmentRequest(PatientPortalUser patient, AppointmentType appointmentType, 
                            String reasonForVisit, LocalDateTime requestedDate) {
        this.patient = patient;
        this.appointmentType = appointmentType;
        this.reasonForVisit = reasonForVisit;
        this.requestedDate = requestedDate;
    }

    // Utility methods
    public boolean isPending() {
        return status == RequestStatus.PENDING;
    }

    public boolean isApproved() {
        return status == RequestStatus.APPROVED;
    }

    public boolean isRejected() {
        return status == RequestStatus.REJECTED;
    }

    public boolean isUrgent() {
        return priority == Priority.URGENT || priority == Priority.EMERGENCY;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public PatientPortalUser getPatient() { return patient; }
    public void setPatient(PatientPortalUser patient) { this.patient = patient; }

    public Long getRequestedProviderId() { return requestedProviderId; }
    public void setRequestedProviderId(Long requestedProviderId) { this.requestedProviderId = requestedProviderId; }

    public String getRequestedProviderName() { return requestedProviderName; }
    public void setRequestedProviderName(String requestedProviderName) { this.requestedProviderName = requestedProviderName; }

    public String getRequestedSpecialty() { return requestedSpecialty; }
    public void setRequestedSpecialty(String requestedSpecialty) { this.requestedSpecialty = requestedSpecialty; }

    public LocalDateTime getRequestedDate() { return requestedDate; }
    public void setRequestedDate(LocalDateTime requestedDate) { this.requestedDate = requestedDate; }

    public String getPreferredTimeSlot() { return preferredTimeSlot; }
    public void setPreferredTimeSlot(String preferredTimeSlot) { this.preferredTimeSlot = preferredTimeSlot; }

    public AppointmentType getAppointmentType() { return appointmentType; }
    public void setAppointmentType(AppointmentType appointmentType) { this.appointmentType = appointmentType; }

    public Priority getPriority() { return priority; }
    public void setPriority(Priority priority) { this.priority = priority; }

    public String getReasonForVisit() { return reasonForVisit; }
    public void setReasonForVisit(String reasonForVisit) { this.reasonForVisit = reasonForVisit; }

    public String getSymptoms() { return symptoms; }
    public void setSymptoms(String symptoms) { this.symptoms = symptoms; }

    public String getPreferredLanguage() { return preferredLanguage; }
    public void setPreferredLanguage(String preferredLanguage) { this.preferredLanguage = preferredLanguage; }

    public String getInsuranceInformation() { return insuranceInformation; }
    public void setInsuranceInformation(String insuranceInformation) { this.insuranceInformation = insuranceInformation; }

    public RequestStatus getStatus() { return status; }
    public void setStatus(RequestStatus status) { this.status = status; }

    public Long getApprovedAppointmentId() { return approvedAppointmentId; }
    public void setApprovedAppointmentId(Long approvedAppointmentId) { this.approvedAppointmentId = approvedAppointmentId; }

    public LocalDateTime getApprovedDate() { return approvedDate; }
    public void setApprovedDate(LocalDateTime approvedDate) { this.approvedDate = approvedDate; }

    public String getApprovedBy() { return approvedBy; }
    public void setApprovedBy(String approvedBy) { this.approvedBy = approvedBy; }

    public String getRejectionReason() { return rejectionReason; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }

    public String getStaffNotes() { return staffNotes; }
    public void setStaffNotes(String staffNotes) { this.staffNotes = staffNotes; }

    public String getPatientPhone() { return patientPhone; }
    public void setPatientPhone(String patientPhone) { this.patientPhone = patientPhone; }

    public String getPatientEmail() { return patientEmail; }
    public void setPatientEmail(String patientEmail) { this.patientEmail = patientEmail; }

    public String getEmergencyContactName() { return emergencyContactName; }
    public void setEmergencyContactName(String emergencyContactName) { this.emergencyContactName = emergencyContactName; }

    public String getEmergencyContactPhone() { return emergencyContactPhone; }
    public void setEmergencyContactPhone(String emergencyContactPhone) { this.emergencyContactPhone = emergencyContactPhone; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public Long getVersion() { return version; }
    public void setVersion(Long version) { this.version = version; }

    // Enums
    public enum AppointmentType {
        NEW_PATIENT,
        FOLLOW_UP,
        CONSULTATION,
        PROCEDURE,
        PREVENTIVE_CARE,
        EMERGENCY,
        TELEMEDICINE,
        SECOND_OPINION
    }

    public enum Priority {
        ROUTINE,
        URGENT,
        EMERGENCY,
        SAME_DAY
    }

    public enum RequestStatus {
        PENDING,
        APPROVED,
        REJECTED,
        CANCELLED,
        COMPLETED
    }
}
