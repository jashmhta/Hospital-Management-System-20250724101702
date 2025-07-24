package com.hospital.hms.appointmentscheduling.dto;

import com.hospital.hms.appointmentscheduling.entity.AppointmentStatus;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * DTO for appointment response data
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Schema(description = "Response DTO containing appointment information")
public class AppointmentResponseDto {

    @Schema(description = "Appointment unique identifier", example = "550e8400-e29b-41d4-a716-446655440000")
    private UUID id;

    @Schema(description = "FHIR resource ID")
    private String fhirId;

    @Schema(description = "Appointment number", example = "APT20250607001")
    private String appointmentNumber;

    @Schema(description = "Patient ID", example = "550e8400-e29b-41d4-a716-446655440001")
    private UUID patientId;

    @Schema(description = "Patient name", example = "John Smith")
    private String patientName;

    @Schema(description = "Patient phone", example = "+1-555-123-4567")
    private String patientPhone;

    @Schema(description = "Patient email", example = "john.smith@email.com")
    private String patientEmail;

    @Schema(description = "Provider ID", example = "550e8400-e29b-41d4-a716-446655440002")
    private UUID providerId;

    @Schema(description = "Provider name", example = "Dr. Jane Doe")
    private String providerName;

    @Schema(description = "Provider specialty", example = "Cardiology")
    private String providerSpecialty;

    @Schema(description = "Appointment date and time", example = "2025-06-15T10:30:00")
    private LocalDateTime appointmentDateTime;

    @Schema(description = "End date and time", example = "2025-06-15T11:00:00")
    private LocalDateTime endDateTime;

    @Schema(description = "Duration in minutes", example = "30")
    private Integer durationMinutes;

    @Schema(description = "Appointment type", example = "CONSULTATION")
    private String appointmentType;

    @Schema(description = "Location ID", example = "550e8400-e29b-41d4-a716-446655440003")
    private UUID locationId;

    @Schema(description = "Location name", example = "Consultation Room 1")
    private String locationName;

    @Schema(description = "Appointment reason", example = "Annual checkup")
    private String reason;

    @Schema(description = "Additional notes", example = "Patient prefers morning appointments")
    private String notes;

    @Schema(description = "Priority level", example = "ROUTINE")
    private String priority;

    @Schema(description = "Current appointment status")
    private AppointmentStatus status;

    @Schema(description = "Is virtual appointment", example = "false")
    private Boolean isVirtual;

    @Schema(description = "Virtual meeting URL")
    private String virtualMeetingUrl;

    @Schema(description = "Check-in time")
    private LocalDateTime checkinTime;

    @Schema(description = "Arrival time")
    private LocalDateTime arrivalTime;

    @Schema(description = "Start time")
    private LocalDateTime startTime;

    @Schema(description = "Completion time")
    private LocalDateTime completionTime;

    @Schema(description = "Cancellation reason")
    private String cancellationReason;

    @Schema(description = "Record creation date")
    private LocalDateTime createdDate;

    @Schema(description = "Last modification date")
    private LocalDateTime lastModifiedDate;

    @Schema(description = "Created by user")
    private String createdBy;

    @Schema(description = "Last modified by user")
    private String lastModifiedBy;

    // Constructors
    public AppointmentResponseDto() {}

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getFhirId() {
        return fhirId;
    }

    public void setFhirId(String fhirId) {
        this.fhirId = fhirId;
    }

    public String getAppointmentNumber() {
        return appointmentNumber;
    }

    public void setAppointmentNumber(String appointmentNumber) {
        this.appointmentNumber = appointmentNumber;
    }

    public UUID getPatientId() {
        return patientId;
    }

    public void setPatientId(UUID patientId) {
        this.patientId = patientId;
    }

    public String getPatientName() {
        return patientName;
    }

    public void setPatientName(String patientName) {
        this.patientName = patientName;
    }

    public String getPatientPhone() {
        return patientPhone;
    }

    public void setPatientPhone(String patientPhone) {
        this.patientPhone = patientPhone;
    }

    public String getPatientEmail() {
        return patientEmail;
    }

    public void setPatientEmail(String patientEmail) {
        this.patientEmail = patientEmail;
    }

    public UUID getProviderId() {
        return providerId;
    }

    public void setProviderId(UUID providerId) {
        this.providerId = providerId;
    }

    public String getProviderName() {
        return providerName;
    }

    public void setProviderName(String providerName) {
        this.providerName = providerName;
    }

    public String getProviderSpecialty() {
        return providerSpecialty;
    }

    public void setProviderSpecialty(String providerSpecialty) {
        this.providerSpecialty = providerSpecialty;
    }

    public LocalDateTime getAppointmentDateTime() {
        return appointmentDateTime;
    }

    public void setAppointmentDateTime(LocalDateTime appointmentDateTime) {
        this.appointmentDateTime = appointmentDateTime;
    }

    public LocalDateTime getEndDateTime() {
        return endDateTime;
    }

    public void setEndDateTime(LocalDateTime endDateTime) {
        this.endDateTime = endDateTime;
    }

    public Integer getDurationMinutes() {
        return durationMinutes;
    }

    public void setDurationMinutes(Integer durationMinutes) {
        this.durationMinutes = durationMinutes;
    }

    public String getAppointmentType() {
        return appointmentType;
    }

    public void setAppointmentType(String appointmentType) {
        this.appointmentType = appointmentType;
    }

    public UUID getLocationId() {
        return locationId;
    }

    public void setLocationId(UUID locationId) {
        this.locationId = locationId;
    }

    public String getLocationName() {
        return locationName;
    }

    public void setLocationName(String locationName) {
        this.locationName = locationName;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public AppointmentStatus getStatus() {
        return status;
    }

    public void setStatus(AppointmentStatus status) {
        this.status = status;
    }

    public Boolean getIsVirtual() {
        return isVirtual;
    }

    public void setIsVirtual(Boolean isVirtual) {
        this.isVirtual = isVirtual;
    }

    public String getVirtualMeetingUrl() {
        return virtualMeetingUrl;
    }

    public void setVirtualMeetingUrl(String virtualMeetingUrl) {
        this.virtualMeetingUrl = virtualMeetingUrl;
    }

    public LocalDateTime getCheckinTime() {
        return checkinTime;
    }

    public void setCheckinTime(LocalDateTime checkinTime) {
        this.checkinTime = checkinTime;
    }

    public LocalDateTime getArrivalTime() {
        return arrivalTime;
    }

    public void setArrivalTime(LocalDateTime arrivalTime) {
        this.arrivalTime = arrivalTime;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public LocalDateTime getCompletionTime() {
        return completionTime;
    }

    public void setCompletionTime(LocalDateTime completionTime) {
        this.completionTime = completionTime;
    }

    public String getCancellationReason() {
        return cancellationReason;
    }

    public void setCancellationReason(String cancellationReason) {
        this.cancellationReason = cancellationReason;
    }

    public LocalDateTime getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(LocalDateTime createdDate) {
        this.createdDate = createdDate;
    }

    public LocalDateTime getLastModifiedDate() {
        return lastModifiedDate;
    }

    public void setLastModifiedDate(LocalDateTime lastModifiedDate) {
        this.lastModifiedDate = lastModifiedDate;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public String getLastModifiedBy() {
        return lastModifiedBy;
    }

    public void setLastModifiedBy(String lastModifiedBy) {
        this.lastModifiedBy = lastModifiedBy;
    }
}
