package com.hospital.hms.appointmentscheduling.entity;

/**
 * Appointment Status enumeration
 * 
 * Defines the lifecycle states of healthcare appointments.
 * Based on FHIR R4 AppointmentStatus value set.
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
public enum AppointmentStatus {
    PROPOSED("proposed", "Proposed", "None of the participant(s) have finalized their acceptance"),
    PENDING("pending", "Pending", "Some or all of the participant(s) have not/did not finalize their acceptance"),
    BOOKED("booked", "Booked", "All participant(s) have been considered and the appointment is confirmed"),
    ARRIVED("arrived", "Arrived", "The patient has arrived for the appointment"),
    FULFILLED("fulfilled", "Fulfilled", "The appointment has been completed"),
    CANCELLED("cancelled", "Cancelled", "The appointment has been cancelled"),
    NO_SHOW("noshow", "No Show", "Some or all of the participant(s) did not show up for the appointment"),
    ENTERED_IN_ERROR("entered-in-error", "Entered in Error", "This instance should not have been part of this patient's medical record"),
    CHECKED_IN("checked-in", "Checked In", "When checked in, all pre-encounter administrative work is complete"),
    WAITLIST("waitlist", "Waitlist", "The appointment has been placed on a waitlist"),
    
    // Extended statuses for better workflow management
    SCHEDULED("scheduled", "Scheduled", "Appointment has been scheduled"),
    CONFIRMED("confirmed", "Confirmed", "Appointment has been confirmed by patient"),
    RESCHEDULED("rescheduled", "Rescheduled", "Appointment has been rescheduled"),
    IN_PROGRESS("in-progress", "In Progress", "Appointment is currently in progress"),
    COMPLETED("completed", "Completed", "Appointment has been completed"),
    NEEDS_FOLLOWUP("needs-followup", "Needs Follow-up", "Appointment completed but requires follow-up"),
    READY("ready", "Ready", "Provider is ready to see the patient");

    private final String code;
    private final String display;
    private final String description;

    AppointmentStatus(String code, String display, String description) {
        this.code = code;
        this.display = display;
        this.description = description;
    }

    public String getCode() {
        return code;
    }

    public String getDisplay() {
        return display;
    }

    public String getDescription() {
        return description;
    }

    public static AppointmentStatus fromCode(String code) {
        for (AppointmentStatus status : AppointmentStatus.values()) {
            if (status.code.equals(code)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Unknown appointment status code: " + code);
    }

    /**
     * Check if status represents an active appointment
     */
    public boolean isActive() {
        return this == SCHEDULED || this == CONFIRMED || this == CHECKED_IN || 
               this == ARRIVED || this == READY || this == IN_PROGRESS;
    }

    /**
     * Check if status represents a completed appointment
     */
    public boolean isCompleted() {
        return this == COMPLETED || this == FULFILLED || this == NEEDS_FOLLOWUP;
    }

    /**
     * Check if status represents a cancelled appointment
     */
    public boolean isCancelled() {
        return this == CANCELLED || this == NO_SHOW || this == ENTERED_IN_ERROR;
    }

    /**
     * Check if status can transition to another status
     */
    public boolean canTransitionTo(AppointmentStatus newStatus) {
        switch (this) {
            case PROPOSED:
                return newStatus == PENDING || newStatus == BOOKED || newStatus == CANCELLED;
            case PENDING:
                return newStatus == BOOKED || newStatus == CANCELLED || newStatus == SCHEDULED;
            case BOOKED:
            case SCHEDULED:
                return newStatus == CONFIRMED || newStatus == CANCELLED || newStatus == RESCHEDULED || 
                       newStatus == CHECKED_IN || newStatus == NO_SHOW;
            case CONFIRMED:
                return newStatus == CHECKED_IN || newStatus == CANCELLED || newStatus == RESCHEDULED || 
                       newStatus == NO_SHOW || newStatus == WAITLIST;
            case CHECKED_IN:
                return newStatus == ARRIVED || newStatus == CANCELLED || newStatus == NO_SHOW;
            case ARRIVED:
                return newStatus == READY || newStatus == IN_PROGRESS || newStatus == CANCELLED;
            case READY:
                return newStatus == IN_PROGRESS || newStatus == CANCELLED;
            case IN_PROGRESS:
                return newStatus == COMPLETED || newStatus == FULFILLED || newStatus == NEEDS_FOLLOWUP;
            case COMPLETED:
            case FULFILLED:
                return newStatus == NEEDS_FOLLOWUP;
            case WAITLIST:
                return newStatus == SCHEDULED || newStatus == CANCELLED;
            case RESCHEDULED:
                return newStatus == SCHEDULED || newStatus == CANCELLED;
            default:
                return false;
        }
    }

    /**
     * Get the next logical status in the appointment workflow
     */
    public AppointmentStatus getNextStatus() {
        switch (this) {
            case PROPOSED:
                return PENDING;
            case PENDING:
                return BOOKED;
            case BOOKED:
            case SCHEDULED:
                return CONFIRMED;
            case CONFIRMED:
                return CHECKED_IN;
            case CHECKED_IN:
                return ARRIVED;
            case ARRIVED:
                return READY;
            case READY:
                return IN_PROGRESS;
            case IN_PROGRESS:
                return COMPLETED;
            case COMPLETED:
                return NEEDS_FOLLOWUP;
            default:
                return this; // No next status for terminal states
        }
    }
}
