package com.hospital.hms.appointmentscheduling.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Appointment Participant Entity
 * 
 * Represents participants in healthcare appointments.
 * Based on FHIR R4 Appointment.participant structure.
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Entity
@Table(name = "appointment_participants", indexes = {
    @Index(name = "idx_participant_appointment", columnList = "appointment_id"),
    @Index(name = "idx_participant_actor", columnList = "actor_id"),
    @Index(name = "idx_participant_type", columnList = "participant_type"),
    @Index(name = "idx_participant_status", columnList = "status")
})
@EntityListeners(AuditingEntityListener.class)
public class AppointmentParticipant {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "appointment_id", nullable = false)
    private Appointment appointment;

    @Column(name = "participant_type", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    @NotNull(message = "Participant type is required")
    private ParticipantType participantType;

    @Column(name = "actor_id", nullable = false)
    @NotNull(message = "Actor ID is required")
    private UUID actorId;

    @Column(name = "actor_name", nullable = false, length = 200)
    @NotBlank(message = "Actor name is required")
    @Size(max = 200, message = "Actor name must not exceed 200 characters")
    private String actorName;

    @Column(name = "actor_email", length = 100)
    @Email(message = "Invalid actor email format")
    @Size(max = 100, message = "Actor email must not exceed 100 characters")
    private String actorEmail;

    @Column(name = "actor_phone", length = 20)
    @Pattern(regexp = "^[\\+]?[1-9][\\d\\s\\-\\(\\)]{7,15}$", message = "Invalid actor phone format")
    private String actorPhone;

    @Column(name = "role", length = 100)
    @Size(max = 100, message = "Role must not exceed 100 characters")
    private String role;

    @Column(name = "specialty", length = 100)
    @Size(max = 100, message = "Specialty must not exceed 100 characters")
    private String specialty;

    @Column(name = "status", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    @NotNull(message = "Participant status is required")
    private ParticipantStatus status;

    @Column(name = "required", nullable = false)
    private Boolean required = true;

    @Column(name = "response_date")
    private LocalDateTime responseDate;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @Column(name = "invitation_sent", nullable = false)
    private Boolean invitationSent = false;

    @Column(name = "invitation_sent_date")
    private LocalDateTime invitationSentDate;

    @Column(name = "reminder_sent", nullable = false)
    private Boolean reminderSent = false;

    @Column(name = "reminder_sent_date")
    private LocalDateTime reminderSentDate;

    @Column(name = "checked_in", nullable = false)
    private Boolean checkedIn = false;

    @Column(name = "check_in_time")
    private LocalDateTime checkInTime;

    // Audit fields
    @CreatedDate
    @Column(name = "created_date", nullable = false, updatable = false)
    private LocalDateTime createdDate;

    @LastModifiedDate
    @Column(name = "last_modified_date")
    private LocalDateTime lastModifiedDate;

    @Version
    @Column(name = "version")
    private Long version;

    // Constructors
    public AppointmentParticipant() {
        this.id = UUID.randomUUID();
    }

    public AppointmentParticipant(Appointment appointment, ParticipantType participantType, 
                                 UUID actorId, String actorName) {
        this();
        this.appointment = appointment;
        this.participantType = participantType;
        this.actorId = actorId;
        this.actorName = actorName;
        this.status = ParticipantStatus.NEEDS_ACTION;
    }

    // Business Methods
    
    /**
     * Accept participation in the appointment
     */
    public void accept() {
        this.status = ParticipantStatus.ACCEPTED;
        this.responseDate = LocalDateTime.now();
    }

    /**
     * Decline participation in the appointment
     */
    public void decline() {
        this.status = ParticipantStatus.DECLINED;
        this.responseDate = LocalDateTime.now();
    }

    /**
     * Mark as tentative participation
     */
    public void markTentative() {
        this.status = ParticipantStatus.TENTATIVE;
        this.responseDate = LocalDateTime.now();
    }

    /**
     * Check in the participant
     */
    public void checkIn() {
        this.checkedIn = true;
        this.checkInTime = LocalDateTime.now();
    }

    /**
     * Send invitation to participant
     */
    public void sendInvitation() {
        this.invitationSent = true;
        this.invitationSentDate = LocalDateTime.now();
    }

    /**
     * Send reminder to participant
     */
    public void sendReminder() {
        this.reminderSent = true;
        this.reminderSentDate = LocalDateTime.now();
    }

    /**
     * Check if participant has responded
     */
    public boolean hasResponded() {
        return status != ParticipantStatus.NEEDS_ACTION;
    }

    /**
     * Check if participant is available for the appointment
     */
    public boolean isAvailable() {
        return status == ParticipantStatus.ACCEPTED || status == ParticipantStatus.TENTATIVE;
    }

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Appointment getAppointment() { return appointment; }
    public void setAppointment(Appointment appointment) { this.appointment = appointment; }

    public ParticipantType getParticipantType() { return participantType; }
    public void setParticipantType(ParticipantType participantType) { this.participantType = participantType; }

    public UUID getActorId() { return actorId; }
    public void setActorId(UUID actorId) { this.actorId = actorId; }

    public String getActorName() { return actorName; }
    public void setActorName(String actorName) { this.actorName = actorName; }

    public String getActorEmail() { return actorEmail; }
    public void setActorEmail(String actorEmail) { this.actorEmail = actorEmail; }

    public String getActorPhone() { return actorPhone; }
    public void setActorPhone(String actorPhone) { this.actorPhone = actorPhone; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getSpecialty() { return specialty; }
    public void setSpecialty(String specialty) { this.specialty = specialty; }

    public ParticipantStatus getStatus() { return status; }
    public void setStatus(ParticipantStatus status) { this.status = status; }

    public Boolean getRequired() { return required; }
    public void setRequired(Boolean required) { this.required = required; }

    public LocalDateTime getResponseDate() { return responseDate; }
    public void setResponseDate(LocalDateTime responseDate) { this.responseDate = responseDate; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public Boolean getInvitationSent() { return invitationSent; }
    public void setInvitationSent(Boolean invitationSent) { this.invitationSent = invitationSent; }

    public LocalDateTime getInvitationSentDate() { return invitationSentDate; }
    public void setInvitationSentDate(LocalDateTime invitationSentDate) { this.invitationSentDate = invitationSentDate; }

    public Boolean getReminderSent() { return reminderSent; }
    public void setReminderSent(Boolean reminderSent) { this.reminderSent = reminderSent; }

    public LocalDateTime getReminderSentDate() { return reminderSentDate; }
    public void setReminderSentDate(LocalDateTime reminderSentDate) { this.reminderSentDate = reminderSentDate; }

    public Boolean getCheckedIn() { return checkedIn; }
    public void setCheckedIn(Boolean checkedIn) { this.checkedIn = checkedIn; }

    public LocalDateTime getCheckInTime() { return checkInTime; }
    public void setCheckInTime(LocalDateTime checkInTime) { this.checkInTime = checkInTime; }

    public LocalDateTime getCreatedDate() { return createdDate; }
    public void setCreatedDate(LocalDateTime createdDate) { this.createdDate = createdDate; }

    public LocalDateTime getLastModifiedDate() { return lastModifiedDate; }
    public void setLastModifiedDate(LocalDateTime lastModifiedDate) { this.lastModifiedDate = lastModifiedDate; }

    public Long getVersion() { return version; }
    public void setVersion(Long version) { this.version = version; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof AppointmentParticipant)) return false;
        AppointmentParticipant that = (AppointmentParticipant) o;
        return id != null && id.equals(that.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    @Override
    public String toString() {
        return "AppointmentParticipant{" +
                "id=" + id +
                ", participantType=" + participantType +
                ", actorName='" + actorName + '\'' +
                ", status=" + status +
                ", required=" + required +
                '}';
    }
}
