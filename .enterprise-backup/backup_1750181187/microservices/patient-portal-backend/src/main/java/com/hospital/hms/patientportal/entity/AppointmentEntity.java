package com.hospital.hms.patientportal.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * Appointment Entity for Patient Portal
 * 
 * Manages patient appointments and scheduling information.
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Entity
@Table(name = "appointments", indexes = {
    @Index(name = "idx_appointment_patient", columnList = "patient_id"),
    @Index(name = "idx_appointment_provider", columnList = "provider_id"),
    @Index(name = "idx_appointment_datetime", columnList = "appointment_date_time"),
    @Index(name = "idx_appointment_status", columnList = "status"),
    @Index(name = "idx_appointment_type", columnList = "appointment_type")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AppointmentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "appointment_id")
    private String appointmentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private PatientEntity patient;

    @Column(name = "provider_id", nullable = false)
    private String providerId;

    @Column(name = "provider_name", length = 200)
    private String providerName;

    @Column(name = "department", length = 100)
    private String department;

    @Column(name = "specialty", length = 100)
    private String specialty;

    @Column(name = "appointment_date_time", nullable = false)
    private LocalDateTime appointmentDateTime;

    @Column(name = "duration_minutes", nullable = false)
    @Builder.Default
    private Integer durationMinutes = 30;

    @Enumerated(EnumType.STRING)
    @Column(name = "appointment_type", nullable = false)
    private AppointmentType appointmentType;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    @Builder.Default
    private AppointmentStatus status = AppointmentStatus.SCHEDULED;

    @Column(name = "chief_complaint", length = 500)
    private String chiefComplaint;

    @Column(name = "reason_for_visit", length = 1000)
    private String reasonForVisit;

    @Column(name = "appointment_notes", length = 2000)
    private String appointmentNotes;

    @Column(name = "provider_notes", length = 2000)
    private String providerNotes;

    @Column(name = "location", length = 200)
    private String location;

    @Column(name = "room_number", length = 20)
    private String roomNumber;

    @Column(name = "is_telehealth")
    @Builder.Default
    private Boolean isTelehealth = false;

    @Column(name = "telehealth_link", length = 500)
    private String telehealthLink;

    @Column(name = "is_follow_up")
    @Builder.Default
    private Boolean isFollowUp = false;

    @Column(name = "previous_appointment_id")
    private String previousAppointmentId;

    @Column(name = "confirmation_code", length = 20)
    private String confirmationCode;

    @Column(name = "check_in_time")
    private LocalDateTime checkInTime;

    @Column(name = "check_out_time")
    private LocalDateTime checkOutTime;

    @Column(name = "wait_time_minutes")
    private Integer waitTimeMinutes;

    @Column(name = "cancellation_reason", length = 500)
    private String cancellationReason;

    @Column(name = "cancelled_at")
    private LocalDateTime cancelledAt;

    @Column(name = "cancelled_by", length = 100)
    private String cancelledBy;

    @Column(name = "rescheduled_from_id")
    private String rescheduledFromId;

    @Column(name = "rescheduled_to_id")
    private String rescheduledToId;

    @Column(name = "no_show")
    @Builder.Default
    private Boolean noShow = false;

    @Column(name = "reminder_sent")
    @Builder.Default
    private Boolean reminderSent = false;

    @Column(name = "reminder_sent_at")
    private LocalDateTime reminderSentAt;

    @Column(name = "insurance_authorization_required")
    @Builder.Default
    private Boolean insuranceAuthorizationRequired = false;

    @Column(name = "insurance_authorization_number", length = 50)
    private String insuranceAuthorizationNumber;

    @Column(name = "copay_amount")
    private Double copayAmount;

    @Column(name = "copay_collected")
    @Builder.Default
    private Boolean copayCollected = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "priority")
    @Builder.Default
    private Priority priority = Priority.NORMAL;

    @Column(name = "special_instructions", length = 1000)
    private String specialInstructions;

    @Column(name = "created_at", nullable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @Column(name = "created_by", length = 100)
    private String createdBy;

    @Column(name = "updated_by", length = 100)
    private String updatedBy;

    // Enums
    public enum AppointmentType {
        CONSULTATION,
        FOLLOW_UP,
        PROCEDURE,
        DIAGNOSTIC,
        VACCINATION,
        PHYSICAL_EXAM,
        MENTAL_HEALTH,
        EMERGENCY,
        TELEHEALTH,
        GROUP_THERAPY
    }

    public enum AppointmentStatus {
        SCHEDULED,
        CONFIRMED,
        CHECKED_IN,
        IN_PROGRESS,
        COMPLETED,
        CANCELLED,
        NO_SHOW,
        RESCHEDULED,
        PENDING_CONFIRMATION
    }

    public enum Priority {
        LOW,
        NORMAL,
        HIGH,
        URGENT,
        EMERGENCY
    }

    // Helper methods
    public boolean isUpcoming() {
        return appointmentDateTime.isAfter(LocalDateTime.now()) && 
               (status == AppointmentStatus.SCHEDULED || status == AppointmentStatus.CONFIRMED);
    }

    public boolean isPast() {
        return appointmentDateTime.isBefore(LocalDateTime.now());
    }

    public boolean canBeCancelled() {
        return (status == AppointmentStatus.SCHEDULED || status == AppointmentStatus.CONFIRMED) &&
               appointmentDateTime.isAfter(LocalDateTime.now().plusHours(24));
    }

    public boolean canBeRescheduled() {
        return (status == AppointmentStatus.SCHEDULED || status == AppointmentStatus.CONFIRMED) &&
               appointmentDateTime.isAfter(LocalDateTime.now().plusHours(24));
    }

    public long getMinutesUntilAppointment() {
        return java.time.Duration.between(LocalDateTime.now(), appointmentDateTime).toMinutes();
    }

    public boolean isToday() {
        return appointmentDateTime.toLocalDate().equals(java.time.LocalDate.now());
    }

    public boolean requiresReminder() {
        return !reminderSent && 
               appointmentDateTime.isAfter(LocalDateTime.now()) &&
               appointmentDateTime.isBefore(LocalDateTime.now().plusDays(1));
    }

    @PrePersist
    protected void onCreate() {
        if (confirmationCode == null) {
            confirmationCode = generateConfirmationCode();
        }
    }

    private String generateConfirmationCode() {
        return "APT" + System.currentTimeMillis() % 1000000;
    }
}