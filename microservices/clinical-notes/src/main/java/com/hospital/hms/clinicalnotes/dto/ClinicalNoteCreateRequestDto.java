package com.hospital.hms.clinicalnotes.dto;

import com.hospital.hms.clinicalnotes.entity.NotePriority;
import com.hospital.hms.clinicalnotes.entity.NoteType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * DTO for creating new clinical notes
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Schema(description = "Request DTO for creating a new clinical note")
public class ClinicalNoteCreateRequestDto {

    @Schema(description = "Patient ID", required = true)
    @NotNull(message = "Patient ID is required")
    private UUID patientId;

    @Schema(description = "Patient name", required = true)
    @NotBlank(message = "Patient name is required")
    @Size(max = 200, message = "Patient name must not exceed 200 characters")
    private String patientName;

    @Schema(description = "Provider ID", required = true)
    @NotNull(message = "Provider ID is required")
    private UUID providerId;

    @Schema(description = "Provider name", required = true)
    @NotBlank(message = "Provider name is required")
    @Size(max = 200, message = "Provider name must not exceed 200 characters")
    private String providerName;

    @Schema(description = "Note type", required = true)
    @NotNull(message = "Note type is required")
    private NoteType noteType;

    @Schema(description = "Note date", required = true)
    @NotNull(message = "Note date is required")
    private LocalDateTime noteDate;

    @Schema(description = "Note title", required = true)
    @NotBlank(message = "Note title is required")
    @Size(max = 500, message = "Title must not exceed 500 characters")
    private String title;

    @Schema(description = "Note content", required = true)
    @NotBlank(message = "Note content is required")
    private String content;

    @Schema(description = "Priority")
    private NotePriority priority;

    // Constructors
    public ClinicalNoteCreateRequestDto() {}

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

    public NoteType getNoteType() {
        return noteType;
    }

    public void setNoteType(NoteType noteType) {
        this.noteType = noteType;
    }

    public LocalDateTime getNoteDate() {
        return noteDate;
    }

    public void setNoteDate(LocalDateTime noteDate) {
        this.noteDate = noteDate;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public NotePriority getPriority() {
        return priority;
    }

    public void setPriority(NotePriority priority) {
        this.priority = priority;
    }
}
