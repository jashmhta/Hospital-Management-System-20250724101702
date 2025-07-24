package com.hospital.hms.appointmentscheduling.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Appointment Entity
 * 
 * Represents a healthcare appointment between a patient and healthcare provider.
 * Based on FHIR R4 Appointment resource specification.
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
    @Index(name = "idx_appointment_location", columnList = "location_id"),
    @Index(name = "idx_appointment_type", columnList = "appointment_type"),
    @Index(name = "idx_appointment_created", columnList = "created_date"),
    @Index(name = "idx_appointment_fhir", columnList = "fhir_id")
})
@EntityListeners(AuditingEntityListener.class)
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "fhir_id", unique = true, length = 100)
    @Size(max = 100, message = "FHIR ID must not exceed 100 characters")
    private String fhirId;

    @Column(name = "appointment_number", unique = true, nullable = false, length = 50)
    @NotBlank(message = "Appointment number is required")
    @Size(max = 50, message = "Appointment number must not exceed 50 characters")
    private String appointmentNumber;

    // Patient Information
    @Column(name = "patient_id", nullable = false)
    @NotNull(message = "Patient ID is required")
    private UUID patientId;

    @Column(name = "patient_name", nullable = false, length = 200)
    @NotBlank(message = "Patient name is required")
    @Size(max = 200, message = "Patient name must not exceed 200 characters")
    private String patientName;

    @Column(name = "patient_phone", length = 20)
    @Pattern(regexp = "^[\\+]?[1-9][\\d\\s\\-\\(\\)]{7,15}$", message = "Invalid patient phone format")
    private String patientPhone;

    @Column(name = "patient_email", length = 100)
    @Email(message = "Invalid patient email format")
    @Size(max = 100, message = "Patient email must not exceed 100 characters")
    private String patientEmail;

    // Provider Information
    @Column(name = "provider_id", nullable = false)
    @NotNull(message = "Provider ID is required")
    private UUID providerId;

    @Column(name = "provider_name", nullable = false, length = 200)
    @NotBlank(message = "Provider name is required")
    @Size(max = 200, message = "Provider name must not exceed 200 characters")
    private String providerName;

    @Column(name = "provider_specialty", length = 100)
    @Size(max = 100, message = "Provider specialty must not exceed 100 characters")
    private String providerSpecialty;

    // Appointment Details
    @Column(name = "appointment_date_time", nullable = false)
    @NotNull(message = "Appointment date and time is required")
    @Future(message = "Appointment must be scheduled for a future date and time")
    private LocalDateTime appointmentDateTime;

    @Column(name = "end_date_time")
    private LocalDateTime endDateTime;

    @Column(name = "duration_minutes", nullable = false)
    @NotNull(message = "Duration is required")
    @Min(value = 5, message = "Duration must be at least 5 minutes")
    @Max(value = 480, message = "Duration must not exceed 8 hours")
    private Integer durationMinutes;

    @Column(name = "appointment_type", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    @NotNull(message = "Appointment type is required")
    private AppointmentType appointmentType;

    @Column(name = "visit_type", length = 20)
    @Enumerated(EnumType.STRING)
    private VisitType visitType;

    @Column(name = "status", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    @NotNull(message = "Status is required")
    private AppointmentStatus status;

    @Column(name = "priority", length = 20)
    @Enumerated(EnumType.STRING)
    private AppointmentPriority priority;

    // Location and Resources
    @Column(name = "location_id")
    private UUID locationId;

    @Column(name = "location_name", length = 200)
    @Size(max = 200, message = "Location name must not exceed 200 characters")
    private String locationName;

    @Column(name = "room_number", length = 50)
    @Size(max = 50, message = "Room number must not exceed 50 characters")
    private String roomNumber;

    @Column(name = "department", length = 100)
    @Size(max = 100, message = "Department must not exceed 100 characters")
    private String department;

    // Appointment Details
    @Column(name = "chief_complaint", length = 500)
    @Size(max = 500, message = "Chief complaint must not exceed 500 characters")
    private String chiefComplaint;

    @Column(name = "reason_for_visit", columnDefinition = "TEXT")
    private String reasonForVisit;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @Column(name = "special_instructions", columnDefinition = "TEXT")
    private String specialInstructions;

    // Scheduling Information
    @Column(name = "scheduled_by")
    private UUID scheduledBy;

    @Column(name = "scheduled_by_name", length = 200)
    @Size(max = 200, message = "Scheduled by name must not exceed 200 characters")
    private String scheduledByName;

    @Column(name = "booking_source", length = 50)
    @Enumerated(EnumType.STRING)
    private BookingSource bookingSource;

    // Status Management
    @Column(name = "confirmed", nullable = false)
    private Boolean confirmed = false;

    @Column(name = "confirmation_date")
    private LocalDateTime confirmationDate;

    @Column(name = "checked_in", nullable = false)
    private Boolean checkedIn = false;

    @Column(name = "check_in_time")
    private LocalDateTime checkInTime;

    @Column(name = "arrived", nullable = false)
    private Boolean arrived = false;

    @Column(name = "arrival_time")
    private LocalDateTime arrivalTime;

    @Column(name = "started", nullable = false)
    private Boolean started = false;

    @Column(name = "start_time")
    private LocalDateTime startTime;

    @Column(name = "completed", nullable = false)
    private Boolean completed = false;

    @Column(name = "completion_time")
    private LocalDateTime completionTime;

    // Cancellation Information
    @Column(name = "cancelled", nullable = false)
    private Boolean cancelled = false;

    @Column(name = "cancellation_date")
    private LocalDateTime cancellationDate;

    @Column(name = "cancelled_by")
    private UUID cancelledBy;

    @Column(name = "cancellation_reason", length = 20)
    @Enumerated(EnumType.STRING)
    private CancellationReason cancellationReason;

    @Column(name = "cancellation_notes", columnDefinition = "TEXT")
    private String cancellationNotes;

    // Rescheduling
    @Column(name = "rescheduled", nullable = false)
    private Boolean rescheduled = false;

    @Column(name = "reschedule_count", nullable = false)
    private Integer rescheduleCount = 0;

    @Column(name = "original_appointment_id")
    private UUID originalAppointmentId;

    @Column(name = "new_appointment_id")
    private UUID newAppointmentId;

    // No-show tracking
    @Column(name = "no_show", nullable = false)
    private Boolean noShow = false;

    @Column(name = "no_show_reason", length = 500)
    @Size(max = 500, message = "No-show reason must not exceed 500 characters")
    private String noShowReason;

    // Billing and Insurance
    @Column(name = "estimated_cost", precision = 10, scale = 2)
    private BigDecimal estimatedCost;

    @Column(name = "copay_amount", precision = 10, scale = 2)
    private BigDecimal copayAmount;

    @Column(name = "insurance_verification_required", nullable = false)
    private Boolean insuranceVerificationRequired = false;

    @Column(name = "insurance_verified", nullable = false)
    private Boolean insuranceVerified = false;

    @Column(name = "authorization_required", nullable = false)
    private Boolean authorizationRequired = false;

    @Column(name = "authorization_number", length = 100)
    @Size(max = 100, message = "Authorization number must not exceed 100 characters")
    private String authorizationNumber;

    // Reminders and Notifications
    @Column(name = "reminder_sent", nullable = false)
    private Boolean reminderSent = false;

    @Column(name = "reminder_sent_date")
    private LocalDateTime reminderSentDate;

    @Column(name = "sms_reminder_enabled", nullable = false)
    private Boolean smsReminderEnabled = true;

    @Column(name = "email_reminder_enabled", nullable = false)
    private Boolean emailReminderEnabled = true;

    @Column(name = "phone_reminder_enabled", nullable = false)
    private Boolean phoneReminderEnabled = false;

    // Waitlist Management
    @Column(name = "waitlist_position")
    private Integer waitlistPosition;

    @Column(name = "added_to_waitlist")
    private LocalDateTime addedToWaitlist;

    // Telehealth Support
    @Column(name = "telehealth_enabled", nullable = false)
    private Boolean telehealthEnabled = false;

    @Column(name = "telehealth_link", length = 500)
    @Size(max = 500, message = "Telehealth link must not exceed 500 characters")
    private String telehealthLink;

    @Column(name = "telehealth_platform", length = 50)
    @Size(max = 50, message = "Telehealth platform must not exceed 50 characters")
    private String telehealthPlatform;

    // Follow-up
    @Column(name = "follow_up_required", nullable = false)
    private Boolean followUpRequired = false;

    @Column(name = "follow_up_in_days")
    private Integer followUpInDays;

    @Column(name = "follow_up_instructions", columnDefinition = "TEXT")
    private String followUpInstructions;

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

    // Related entities
    @OneToMany(mappedBy = "appointment", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<AppointmentParticipant> participants = new ArrayList<>();

    @OneToMany(mappedBy = "appointment", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<AppointmentResource> resources = new ArrayList<>();

    @OneToMany(mappedBy = "appointment", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<AppointmentStatusHistory> statusHistory = new ArrayList<>();

    // Constructors
    public Appointment() {
        this.id = UUID.randomUUID();
    }

    public Appointment(UUID patientId, String patientName, UUID providerId, String providerName, 
                      LocalDateTime appointmentDateTime, Integer durationMinutes, AppointmentType appointmentType) {
        this();
        this.patientId = patientId;
        this.patientName = patientName;
        this.providerId = providerId;
        this.providerName = providerName;
        this.appointmentDateTime = appointmentDateTime;
        this.durationMinutes = durationMinutes;
        this.appointmentType = appointmentType;
        this.status = AppointmentStatus.SCHEDULED;
        this.endDateTime = appointmentDateTime.plusMinutes(durationMinutes);
    }

    // Business Methods
    
    /**
     * Get appointment duration as Duration object
     */
    public Duration getDuration() {
        return Duration.ofMinutes(durationMinutes);
    }

    /**
     * Check if appointment is in the past
     */
    public boolean isPastAppointment() {
        return appointmentDateTime.isBefore(LocalDateTime.now());
    }

    /**
     * Check if appointment is today
     */
    public boolean isTodayAppointment() {
        return appointmentDateTime.toLocalDate().equals(LocalDateTime.now().toLocalDate());
    }

    /**
     * Check if appointment is upcoming (within next 24 hours)
     */
    public boolean isUpcoming() {
        return appointmentDateTime.isAfter(LocalDateTime.now()) && 
               appointmentDateTime.isBefore(LocalDateTime.now().plusDays(1));
    }

    /**
     * Check if appointment can be cancelled
     */
    public boolean canBeCancelled() {
        return !cancelled && !completed && !noShow && 
               status != AppointmentStatus.CHECKED_IN &&
               appointmentDateTime.isAfter(LocalDateTime.now().plusHours(1));
    }

    /**
     * Check if appointment can be rescheduled
     */
    public boolean canBeRescheduled() {
        return !completed && !noShow && rescheduleCount < 3 &&
               appointmentDateTime.isAfter(LocalDateTime.now().plusHours(2));
    }

    /**
     * Calculate time until appointment
     */
    public Duration getTimeUntilAppointment() {
        return Duration.between(LocalDateTime.now(), appointmentDateTime);
    }

    /**
     * Check if appointment needs reminder
     */
    public boolean needsReminder() {
        if (reminderSent || cancelled || completed) {
            return false;
        }
        
        LocalDateTime reminderTime = appointmentDateTime.minusHours(24);
        return LocalDateTime.now().isAfter(reminderTime) && 
               LocalDateTime.now().isBefore(appointmentDateTime);
    }

    /**
     * Mark appointment as confirmed
     */
    public void confirm() {
        this.confirmed = true;
        this.confirmationDate = LocalDateTime.now();
        this.status = AppointmentStatus.CONFIRMED;
    }

    /**
     * Check in patient for appointment
     */
    public void checkIn() {
        this.checkedIn = true;
        this.checkInTime = LocalDateTime.now();
        this.status = AppointmentStatus.CHECKED_IN;
    }

    /**
     * Mark patient as arrived
     */
    public void markArrived() {
        this.arrived = true;
        this.arrivalTime = LocalDateTime.now();
        this.status = AppointmentStatus.ARRIVED;
    }

    /**
     * Start the appointment
     */
    public void start() {
        this.started = true;
        this.startTime = LocalDateTime.now();
        this.status = AppointmentStatus.IN_PROGRESS;
    }

    /**
     * Complete the appointment
     */
    public void complete() {
        this.completed = true;
        this.completionTime = LocalDateTime.now();
        this.status = AppointmentStatus.COMPLETED;
    }

    /**
     * Cancel the appointment
     */
    public void cancel(UUID cancelledBy, CancellationReason reason, String notes) {
        this.cancelled = true;
        this.cancellationDate = LocalDateTime.now();
        this.cancelledBy = cancelledBy;
        this.cancellationReason = reason;
        this.cancellationNotes = notes;
        this.status = AppointmentStatus.CANCELLED;
    }

    /**
     * Mark as no-show
     */
    public void markNoShow(String reason) {
        this.noShow = true;
        this.noShowReason = reason;
        this.status = AppointmentStatus.NO_SHOW;
    }

    /**
     * Calculate appointment window (start time to end time)
     */
    public boolean isInAppointmentWindow() {
        LocalDateTime now = LocalDateTime.now();
        return now.isAfter(appointmentDateTime.minusMinutes(15)) && 
               now.isBefore(getEndDateTime().plusMinutes(15));
    }

    /**
     * Get calculated end date time
     */
    public LocalDateTime getEndDateTime() {
        if (endDateTime != null) {
            return endDateTime;
        }
        return appointmentDateTime.plusMinutes(durationMinutes);
    }

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getFhirId() { return fhirId; }
    public void setFhirId(String fhirId) { this.fhirId = fhirId; }

    public String getAppointmentNumber() { return appointmentNumber; }
    public void setAppointmentNumber(String appointmentNumber) { this.appointmentNumber = appointmentNumber; }

    public UUID getPatientId() { return patientId; }
    public void setPatientId(UUID patientId) { this.patientId = patientId; }

    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }

    public String getPatientPhone() { return patientPhone; }
    public void setPatientPhone(String patientPhone) { this.patientPhone = patientPhone; }

    public String getPatientEmail() { return patientEmail; }
    public void setPatientEmail(String patientEmail) { this.patientEmail = patientEmail; }

    public UUID getProviderId() { return providerId; }
    public void setProviderId(UUID providerId) { this.providerId = providerId; }

    public String getProviderName() { return providerName; }
    public void setProviderName(String providerName) { this.providerName = providerName; }

    public String getProviderSpecialty() { return providerSpecialty; }
    public void setProviderSpecialty(String providerSpecialty) { this.providerSpecialty = providerSpecialty; }

    public LocalDateTime getAppointmentDateTime() { return appointmentDateTime; }
    public void setAppointmentDateTime(LocalDateTime appointmentDateTime) { 
        this.appointmentDateTime = appointmentDateTime; 
        if (this.durationMinutes != null) {
            this.endDateTime = appointmentDateTime.plusMinutes(this.durationMinutes);
        }
    }

    public void setEndDateTime(LocalDateTime endDateTime) { this.endDateTime = endDateTime; }

    public Integer getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(Integer durationMinutes) { 
        this.durationMinutes = durationMinutes; 
        if (this.appointmentDateTime != null) {
            this.endDateTime = this.appointmentDateTime.plusMinutes(durationMinutes);
        }
    }

    public AppointmentType getAppointmentType() { return appointmentType; }
    public void setAppointmentType(AppointmentType appointmentType) { this.appointmentType = appointmentType; }

    public VisitType getVisitType() { return visitType; }
    public void setVisitType(VisitType visitType) { this.visitType = visitType; }

    public AppointmentStatus getStatus() { return status; }
    public void setStatus(AppointmentStatus status) { this.status = status; }

    public AppointmentPriority getPriority() { return priority; }
    public void setPriority(AppointmentPriority priority) { this.priority = priority; }

    public UUID getLocationId() { return locationId; }
    public void setLocationId(UUID locationId) { this.locationId = locationId; }

    public String getLocationName() { return locationName; }
    public void setLocationName(String locationName) { this.locationName = locationName; }

    public String getRoomNumber() { return roomNumber; }
    public void setRoomNumber(String roomNumber) { this.roomNumber = roomNumber; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getChiefComplaint() { return chiefComplaint; }
    public void setChiefComplaint(String chiefComplaint) { this.chiefComplaint = chiefComplaint; }

    public String getReasonForVisit() { return reasonForVisit; }
    public void setReasonForVisit(String reasonForVisit) { this.reasonForVisit = reasonForVisit; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public String getSpecialInstructions() { return specialInstructions; }
    public void setSpecialInstructions(String specialInstructions) { this.specialInstructions = specialInstructions; }

    public UUID getScheduledBy() { return scheduledBy; }
    public void setScheduledBy(UUID scheduledBy) { this.scheduledBy = scheduledBy; }

    public String getScheduledByName() { return scheduledByName; }
    public void setScheduledByName(String scheduledByName) { this.scheduledByName = scheduledByName; }

    public BookingSource getBookingSource() { return bookingSource; }
    public void setBookingSource(BookingSource bookingSource) { this.bookingSource = bookingSource; }

    public Boolean getConfirmed() { return confirmed; }
    public void setConfirmed(Boolean confirmed) { this.confirmed = confirmed; }

    public LocalDateTime getConfirmationDate() { return confirmationDate; }
    public void setConfirmationDate(LocalDateTime confirmationDate) { this.confirmationDate = confirmationDate; }

    public Boolean getCheckedIn() { return checkedIn; }
    public void setCheckedIn(Boolean checkedIn) { this.checkedIn = checkedIn; }

    public LocalDateTime getCheckInTime() { return checkInTime; }
    public void setCheckInTime(LocalDateTime checkInTime) { this.checkInTime = checkInTime; }

    public Boolean getArrived() { return arrived; }
    public void setArrived(Boolean arrived) { this.arrived = arrived; }

    public LocalDateTime getArrivalTime() { return arrivalTime; }
    public void setArrivalTime(LocalDateTime arrivalTime) { this.arrivalTime = arrivalTime; }

    public Boolean getStarted() { return started; }
    public void setStarted(Boolean started) { this.started = started; }

    public LocalDateTime getStartTime() { return startTime; }
    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }

    public Boolean getCompleted() { return completed; }
    public void setCompleted(Boolean completed) { this.completed = completed; }

    public LocalDateTime getCompletionTime() { return completionTime; }
    public void setCompletionTime(LocalDateTime completionTime) { this.completionTime = completionTime; }

    public Boolean getCancelled() { return cancelled; }
    public void setCancelled(Boolean cancelled) { this.cancelled = cancelled; }

    public LocalDateTime getCancellationDate() { return cancellationDate; }
    public void setCancellationDate(LocalDateTime cancellationDate) { this.cancellationDate = cancellationDate; }

    public UUID getCancelledBy() { return cancelledBy; }
    public void setCancelledBy(UUID cancelledBy) { this.cancelledBy = cancelledBy; }

    public CancellationReason getCancellationReason() { return cancellationReason; }
    public void setCancellationReason(CancellationReason cancellationReason) { this.cancellationReason = cancellationReason; }

    public String getCancellationNotes() { return cancellationNotes; }
    public void setCancellationNotes(String cancellationNotes) { this.cancellationNotes = cancellationNotes; }

    public Boolean getRescheduled() { return rescheduled; }
    public void setRescheduled(Boolean rescheduled) { this.rescheduled = rescheduled; }

    public Integer getRescheduleCount() { return rescheduleCount; }
    public void setRescheduleCount(Integer rescheduleCount) { this.rescheduleCount = rescheduleCount; }

    public UUID getOriginalAppointmentId() { return originalAppointmentId; }
    public void setOriginalAppointmentId(UUID originalAppointmentId) { this.originalAppointmentId = originalAppointmentId; }

    public UUID getNewAppointmentId() { return newAppointmentId; }
    public void setNewAppointmentId(UUID newAppointmentId) { this.newAppointmentId = newAppointmentId; }

    public Boolean getNoShow() { return noShow; }
    public void setNoShow(Boolean noShow) { this.noShow = noShow; }

    public String getNoShowReason() { return noShowReason; }
    public void setNoShowReason(String noShowReason) { this.noShowReason = noShowReason; }

    public BigDecimal getEstimatedCost() { return estimatedCost; }
    public void setEstimatedCost(BigDecimal estimatedCost) { this.estimatedCost = estimatedCost; }

    public BigDecimal getCopayAmount() { return copayAmount; }
    public void setCopayAmount(BigDecimal copayAmount) { this.copayAmount = copayAmount; }

    public Boolean getInsuranceVerificationRequired() { return insuranceVerificationRequired; }
    public void setInsuranceVerificationRequired(Boolean insuranceVerificationRequired) { this.insuranceVerificationRequired = insuranceVerificationRequired; }

    public Boolean getInsuranceVerified() { return insuranceVerified; }
    public void setInsuranceVerified(Boolean insuranceVerified) { this.insuranceVerified = insuranceVerified; }

    public Boolean getAuthorizationRequired() { return authorizationRequired; }
    public void setAuthorizationRequired(Boolean authorizationRequired) { this.authorizationRequired = authorizationRequired; }

    public String getAuthorizationNumber() { return authorizationNumber; }
    public void setAuthorizationNumber(String authorizationNumber) { this.authorizationNumber = authorizationNumber; }

    public Boolean getReminderSent() { return reminderSent; }
    public void setReminderSent(Boolean reminderSent) { this.reminderSent = reminderSent; }

    public LocalDateTime getReminderSentDate() { return reminderSentDate; }
    public void setReminderSentDate(LocalDateTime reminderSentDate) { this.reminderSentDate = reminderSentDate; }

    public Boolean getSmsReminderEnabled() { return smsReminderEnabled; }
    public void setSmsReminderEnabled(Boolean smsReminderEnabled) { this.smsReminderEnabled = smsReminderEnabled; }

    public Boolean getEmailReminderEnabled() { return emailReminderEnabled; }
    public void setEmailReminderEnabled(Boolean emailReminderEnabled) { this.emailReminderEnabled = emailReminderEnabled; }

    public Boolean getPhoneReminderEnabled() { return phoneReminderEnabled; }
    public void setPhoneReminderEnabled(Boolean phoneReminderEnabled) { this.phoneReminderEnabled = phoneReminderEnabled; }

    public Integer getWaitlistPosition() { return waitlistPosition; }
    public void setWaitlistPosition(Integer waitlistPosition) { this.waitlistPosition = waitlistPosition; }

    public LocalDateTime getAddedToWaitlist() { return addedToWaitlist; }
    public void setAddedToWaitlist(LocalDateTime addedToWaitlist) { this.addedToWaitlist = addedToWaitlist; }

    public Boolean getTelehealthEnabled() { return telehealthEnabled; }
    public void setTelehealthEnabled(Boolean telehealthEnabled) { this.telehealthEnabled = telehealthEnabled; }

    public String getTelehealthLink() { return telehealthLink; }
    public void setTelehealthLink(String telehealthLink) { this.telehealthLink = telehealthLink; }

    public String getTelehealthPlatform() { return telehealthPlatform; }
    public void setTelehealthPlatform(String telehealthPlatform) { this.telehealthPlatform = telehealthPlatform; }

    public Boolean getFollowUpRequired() { return followUpRequired; }
    public void setFollowUpRequired(Boolean followUpRequired) { this.followUpRequired = followUpRequired; }

    public Integer getFollowUpInDays() { return followUpInDays; }
    public void setFollowUpInDays(Integer followUpInDays) { this.followUpInDays = followUpInDays; }

    public String getFollowUpInstructions() { return followUpInstructions; }
    public void setFollowUpInstructions(String followUpInstructions) { this.followUpInstructions = followUpInstructions; }

    public LocalDateTime getCreatedDate() { return createdDate; }
    public void setCreatedDate(LocalDateTime createdDate) { this.createdDate = createdDate; }

    public LocalDateTime getLastModifiedDate() { return lastModifiedDate; }
    public void setLastModifiedDate(LocalDateTime lastModifiedDate) { this.lastModifiedDate = lastModifiedDate; }

    public Long getVersion() { return version; }
    public void setVersion(Long version) { this.version = version; }

    public List<AppointmentParticipant> getParticipants() { return participants; }
    public void setParticipants(List<AppointmentParticipant> participants) { this.participants = participants; }

    public List<AppointmentResource> getResources() { return resources; }
    public void setResources(List<AppointmentResource> resources) { this.resources = resources; }

    public List<AppointmentStatusHistory> getStatusHistory() { return statusHistory; }
    public void setStatusHistory(List<AppointmentStatusHistory> statusHistory) { this.statusHistory = statusHistory; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Appointment)) return false;
        Appointment that = (Appointment) o;
        return id != null && id.equals(that.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    @Override
    public String toString() {
        return "Appointment{" +
                "id=" + id +
                ", appointmentNumber='" + appointmentNumber + '\'' +
                ", patientName='" + patientName + '\'' +
                ", providerName='" + providerName + '\'' +
                ", appointmentDateTime=" + appointmentDateTime +
                ", status=" + status +
                ", appointmentType=" + appointmentType +
                '}';
    }
}
