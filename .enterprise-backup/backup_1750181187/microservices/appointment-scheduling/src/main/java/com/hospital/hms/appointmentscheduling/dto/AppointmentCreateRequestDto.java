package com.hospital.hms.appointmentscheduling.dto;

import com.hospital.hms.appointmentscheduling.entity.AppointmentStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * DTO for creating new appointments
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Schema(description = "Request DTO for creating a new appointment")
public class AppointmentCreateRequestDto {

    @Schema(description = "Patient ID", example = "550e8400-e29b-41d4-a716-446655440000", required = true)
    @NotNull(message = "Patient ID is required")
    private UUID patientId;

    @Schema(description = "Patient name", example = "John Smith", required = true)
    @NotBlank(message = "Patient name is required")
    @Size(max = 200, message = "Patient name must not exceed 200 characters")
    private String patientName;

    @Schema(description = "Patient phone", example = "+1-555-123-4567")
    @Pattern(regexp = "^[\\+]?[1-9][\\d\\s\\-\\(\\)]{7,15}$", message = "Invalid patient phone format")
    private String patientPhone;

    @Schema(description = "Patient email", example = "john.smith@email.com")
    @Email(message = "Invalid patient email format")
    @Size(max = 100, message = "Patient email must not exceed 100 characters")
    private String patientEmail;

    @Schema(description = "Provider ID", example = "550e8400-e29b-41d4-a716-446655440001", required = true)
    @NotNull(message = "Provider ID is required")
    private UUID providerId;

    @Schema(description = "Provider name", example = "Dr. Jane Doe", required = true)
    @NotBlank(message = "Provider name is required")
    @Size(max = 200, message = "Provider name must not exceed 200 characters")
    private String providerName;

    @Schema(description = "Provider specialty", example = "Cardiology")
    @Size(max = 100, message = "Provider specialty must not exceed 100 characters")
    private String providerSpecialty;

    @Schema(description = "Appointment date and time", example = "2025-06-15T10:30:00", required = true)
    @NotNull(message = "Appointment date and time is required")
    @Future(message = "Appointment must be scheduled for a future date and time")
    private LocalDateTime appointmentDateTime;

    @Schema(description = "Duration in minutes", example = "30", required = true)
    @NotNull(message = "Duration is required")
    @Min(value = 5, message = "Duration must be at least 5 minutes")
    @Max(value = 480, message = "Duration must not exceed 8 hours")
    private Integer durationMinutes;

    @Schema(description = "Appointment type", example = "CONSULTATION")
    @Size(max = 50, message = "Appointment type must not exceed 50 characters")
    private String appointmentType;

    @Schema(description = "Location ID", example = "550e8400-e29b-41d4-a716-446655440002")
    private UUID locationId;

    @Schema(description = "Location name", example = "Consultation Room 1")
    @Size(max = 200, message = "Location name must not exceed 200 characters")
    private String locationName;

    @Schema(description = "Appointment reason", example = "Annual checkup")
    @Size(max = 500, message = "Reason must not exceed 500 characters")
    private String reason;

    @Schema(description = "Additional notes", example = "Patient prefers morning appointments")
    private String notes;

    @Schema(description = "Priority level", example = "ROUTINE")
    @Size(max = 20, message = "Priority must not exceed 20 characters")
    private String priority;

    @Schema(description = "Is virtual appointment", example = "false")
    private Boolean isVirtual = false;

    @Schema(description = "Virtual meeting URL")
    @Size(max = 500, message = "Virtual meeting URL must not exceed 500 characters")
    private String virtualMeetingUrl;

    @Schema(description = "Initial appointment status", example = "SCHEDULED")
    private AppointmentStatus status = AppointmentStatus.SCHEDULED;

    // Constructors
    public AppointmentCreateRequestDto() {}

    public AppointmentCreateRequestDto(UUID patientId, String patientName, UUID providerId, 
                                     String providerName, LocalDateTime appointmentDateTime, Integer durationMinutes) {
        this.patientId = patientId;
        this.patientName = patientName;
        this.providerId = providerId;
        this.providerName = providerName;
        this.appointmentDateTime = appointmentDateTime;
        this.durationMinutes = durationMinutes;
    }

    // Getters and Setters
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

    public AppointmentStatus getStatus() {
        return status;
    }

    public void setStatus(AppointmentStatus status) {
        this.status = status;
    }
}
