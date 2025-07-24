package com.hospital.hms.appointmentscheduling.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Appointment Status History Entity
 * 
 * Tracks the status changes and lifecycle of healthcare appointments.
 * Provides audit trail for appointment modifications and state transitions.
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Entity
@Table(name = "appointment_status_history", indexes = {
    @Index(name = "idx_status_history_appointment", columnList = "appointment_id"),
    @Index(name = "idx_status_history_status", columnList = "status"),
    @Index(name = "idx_status_history_date", columnList = "status_date"),
    @Index(name = "idx_status_history_changed_by", columnList = "changed_by")
})
@EntityListeners(AuditingEntityListener.class)
public class AppointmentStatusHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "appointment_id", nullable = false)
    private Appointment appointment;

    @Column(name = "status", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    @NotNull(message = "Status is required")
    private AppointmentStatus status;

    @Column(name = "previous_status", length = 20)
    @Enumerated(EnumType.STRING)
    private AppointmentStatus previousStatus;

    @Column(name = "status_date", nullable = false)
    @NotNull(message = "Status date is required")
    private LocalDateTime statusDate;

    @Column(name = "changed_by", nullable = false)
    @NotNull(message = "Changed by is required")
    private UUID changedBy;

    @Column(name = "changed_by_name", nullable = false, length = 200)
    @NotBlank(message = "Changed by name is required")
    @Size(max = 200, message = "Changed by name must not exceed 200 characters")
    private String changedByName;

    @Column(name = "changed_by_role", length = 100)
    @Size(max = 100, message = "Changed by role must not exceed 100 characters")
    private String changedByRole;

    @Column(name = "change_reason", length = 20)
    @Enumerated(EnumType.STRING)
    private StatusChangeReason changeReason;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @Column(name = "system_generated", nullable = false)
    private Boolean systemGenerated = false;

    @Column(name = "notification_sent", nullable = false)
    private Boolean notificationSent = false;

    @Column(name = "notification_sent_date")
    private LocalDateTime notificationSentDate;

    @Column(name = "patient_notified", nullable = false)
    private Boolean patientNotified = false;

    @Column(name = "provider_notified", nullable = false)
    private Boolean providerNotified = false;

    @Column(name = "additional_data", columnDefinition = "TEXT")
    private String additionalData; // JSON for storing additional context

    @Column(name = "source_system", length = 100)
    @Size(max = 100, message = "Source system must not exceed 100 characters")
    private String sourceSystem;

    @Column(name = "transaction_id", length = 100)
    @Size(max = 100, message = "Transaction ID must not exceed 100 characters")
    private String transactionId;

    @Column(name = "ip_address", length = 45)
    @Size(max = 45, message = "IP address must not exceed 45 characters")
    private String ipAddress;

    @Column(name = "user_agent", length = 500)
    @Size(max = 500, message = "User agent must not exceed 500 characters")
    private String userAgent;

    // Audit fields
    @CreatedDate
    @Column(name = "created_date", nullable = false, updatable = false)
    private LocalDateTime createdDate;

    // Constructors
    public AppointmentStatusHistory() {
        this.id = UUID.randomUUID();
    }

    public AppointmentStatusHistory(Appointment appointment, AppointmentStatus status, 
                                   AppointmentStatus previousStatus, UUID changedBy, String changedByName) {
        this();
        this.appointment = appointment;
        this.status = status;
        this.previousStatus = previousStatus;
        this.statusDate = LocalDateTime.now();
        this.changedBy = changedBy;
        this.changedByName = changedByName;
    }

    // Business Methods
    
    /**
     * Mark notification as sent
     */
    public void markNotificationSent() {
        this.notificationSent = true;
        this.notificationSentDate = LocalDateTime.now();
    }

    /**
     * Mark patient as notified
     */
    public void markPatientNotified() {
        this.patientNotified = true;
    }

    /**
     * Mark provider as notified
     */
    public void markProviderNotified() {
        this.providerNotified = true;
    }

    /**
     * Check if this is a status upgrade (positive progression)
     */
    public boolean isStatusUpgrade() {
        if (previousStatus == null) {
            return true; // First status is considered an upgrade
        }
        
        return getStatusPriority(status) > getStatusPriority(previousStatus);
    }

    /**
     * Check if this is a status downgrade (negative progression)
     */
    public boolean isStatusDowngrade() {
        if (previousStatus == null) {
            return false;
        }
        
        return getStatusPriority(status) < getStatusPriority(previousStatus);
    }

    /**
     * Get priority value for status comparison
     */
    private int getStatusPriority(AppointmentStatus status) {
        switch (status) {
            case PROPOSED: return 1;
            case PENDING: return 2;
            case BOOKED: return 3;
            case SCHEDULED: return 4;
            case CONFIRMED: return 5;
            case CHECKED_IN: return 6;
            case ARRIVED: return 7;
            case READY: return 8;
            case IN_PROGRESS: return 9;
            case COMPLETED: return 10;
            case FULFILLED: return 11;
            case NEEDS_FOLLOWUP: return 12;
            case CANCELLED: return -1;
            case NO_SHOW: return -2;
            case ENTERED_IN_ERROR: return -3;
            case WAITLIST: return 0;
            case RESCHEDULED: return 0;
            default: return 0;
        }
    }

    /**
     * Check if status change requires notification
     */
    public boolean requiresNotification() {
        return status == AppointmentStatus.CONFIRMED ||
               status == AppointmentStatus.CANCELLED ||
               status == AppointmentStatus.RESCHEDULED ||
               status == AppointmentStatus.READY ||
               status == AppointmentStatus.COMPLETED;
    }

    /**
     * Get time since status change
     */
    public java.time.Duration getTimeSinceChange() {
        return java.time.Duration.between(statusDate, LocalDateTime.now());
    }

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Appointment getAppointment() { return appointment; }
    public void setAppointment(Appointment appointment) { this.appointment = appointment; }

    public AppointmentStatus getStatus() { return status; }
    public void setStatus(AppointmentStatus status) { this.status = status; }

    public AppointmentStatus getPreviousStatus() { return previousStatus; }
    public void setPreviousStatus(AppointmentStatus previousStatus) { this.previousStatus = previousStatus; }

    public LocalDateTime getStatusDate() { return statusDate; }
    public void setStatusDate(LocalDateTime statusDate) { this.statusDate = statusDate; }

    public UUID getChangedBy() { return changedBy; }
    public void setChangedBy(UUID changedBy) { this.changedBy = changedBy; }

    public String getChangedByName() { return changedByName; }
    public void setChangedByName(String changedByName) { this.changedByName = changedByName; }

    public String getChangedByRole() { return changedByRole; }
    public void setChangedByRole(String changedByRole) { this.changedByRole = changedByRole; }

    public StatusChangeReason getChangeReason() { return changeReason; }
    public void setChangeReason(StatusChangeReason changeReason) { this.changeReason = changeReason; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public Boolean getSystemGenerated() { return systemGenerated; }
    public void setSystemGenerated(Boolean systemGenerated) { this.systemGenerated = systemGenerated; }

    public Boolean getNotificationSent() { return notificationSent; }
    public void setNotificationSent(Boolean notificationSent) { this.notificationSent = notificationSent; }

    public LocalDateTime getNotificationSentDate() { return notificationSentDate; }
    public void setNotificationSentDate(LocalDateTime notificationSentDate) { this.notificationSentDate = notificationSentDate; }

    public Boolean getPatientNotified() { return patientNotified; }
    public void setPatientNotified(Boolean patientNotified) { this.patientNotified = patientNotified; }

    public Boolean getProviderNotified() { return providerNotified; }
    public void setProviderNotified(Boolean providerNotified) { this.providerNotified = providerNotified; }

    public String getAdditionalData() { return additionalData; }
    public void setAdditionalData(String additionalData) { this.additionalData = additionalData; }

    public String getSourceSystem() { return sourceSystem; }
    public void setSourceSystem(String sourceSystem) { this.sourceSystem = sourceSystem; }

    public String getTransactionId() { return transactionId; }
    public void setTransactionId(String transactionId) { this.transactionId = transactionId; }

    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }

    public String getUserAgent() { return userAgent; }
    public void setUserAgent(String userAgent) { this.userAgent = userAgent; }

    public LocalDateTime getCreatedDate() { return createdDate; }
    public void setCreatedDate(LocalDateTime createdDate) { this.createdDate = createdDate; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof AppointmentStatusHistory)) return false;
        AppointmentStatusHistory that = (AppointmentStatusHistory) o;
        return id != null && id.equals(that.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    @Override
    public String toString() {
        return "AppointmentStatusHistory{" +
                "id=" + id +
                ", status=" + status +
                ", previousStatus=" + previousStatus +
                ", statusDate=" + statusDate +
                ", changedByName='" + changedByName + '\'' +
                ", systemGenerated=" + systemGenerated +
                '}';
    }
}

/**
 * Status Change Reason enumeration
 */
enum StatusChangeReason {
    USER_ACTION("user-action", "User Action"),
    SYSTEM_AUTOMATIC("system-automatic", "System Automatic"),
    SCHEDULED_EVENT("scheduled-event", "Scheduled Event"),
    EXTERNAL_SYSTEM("external-system", "External System"),
    PATIENT_REQUEST("patient-request", "Patient Request"),
    PROVIDER_ACTION("provider-action", "Provider Action"),
    ADMINISTRATIVE("administrative", "Administrative"),
    EMERGENCY("emergency", "Emergency"),
    TECHNICAL_ISSUE("technical-issue", "Technical Issue"),
    POLICY_ENFORCEMENT("policy-enforcement", "Policy Enforcement"),
    WORKFLOW_AUTOMATION("workflow-automation", "Workflow Automation"),
    INTEGRATION("integration", "System Integration"),
    DATA_CORRECTION("data-correction", "Data Correction"),
    BULK_OPERATION("bulk-operation", "Bulk Operation"),
    OTHER("other", "Other");

    private final String code;
    private final String display;

    StatusChangeReason(String code, String display) {
        this.code = code;
        this.display = display;
    }

    public String getCode() { return code; }
    public String getDisplay() { return display; }
}
