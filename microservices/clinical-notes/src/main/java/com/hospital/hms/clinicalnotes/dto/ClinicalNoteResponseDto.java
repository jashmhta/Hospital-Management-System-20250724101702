package com.hospital.hms.clinicalnotes.dto;

import com.hospital.hms.clinicalnotes.entity.NotePriority;
import com.hospital.hms.clinicalnotes.entity.NoteStatus;
import com.hospital.hms.clinicalnotes.entity.NoteType;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * DTO for clinical note responses
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Schema(description = "Response DTO for clinical note information")
public class ClinicalNoteResponseDto {

    @Schema(description = "Note ID")
    private UUID id;

    @Schema(description = "Note number")
    private String noteNumber;

    @Schema(description = "Patient ID")
    private UUID patientId;

    @Schema(description = "Patient name")
    private String patientName;

    @Schema(description = "Provider ID")
    private UUID providerId;

    @Schema(description = "Provider name")
    private String providerName;

    @Schema(description = "Note type")
    private NoteType noteType;

    @Schema(description = "Note date")
    private LocalDateTime noteDate;

    @Schema(description = "Note title")
    private String title;

    @Schema(description = "Note content")
    private String content;

    @Schema(description = "Note status")
    private NoteStatus status;

    @Schema(description = "Is signed")
    private Boolean signed;

    @Schema(description = "Signed date")
    private LocalDateTime signedDate;

    @Schema(description = "Priority")
    private NotePriority priority;

    @Schema(description = "Created date")
    private LocalDateTime createdDate;

    @Schema(description = "Last modified date")
    private LocalDateTime lastModifiedDate;

    @Schema(description = "Created by")
    private String createdBy;

    @Schema(description = "Last modified by")
    private String lastModifiedBy;

    // Constructors
    public ClinicalNoteResponseDto() {}

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getNoteNumber() {
        return noteNumber;
    }

    public void setNoteNumber(String noteNumber) {
        this.noteNumber = noteNumber;
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

    public NoteStatus getStatus() {
        return status;
    }

    public void setStatus(NoteStatus status) {
        this.status = status;
    }

    public Boolean getSigned() {
        return signed;
    }

    public void setSigned(Boolean signed) {
        this.signed = signed;
    }

    public LocalDateTime getSignedDate() {
        return signedDate;
    }

    public void setSignedDate(LocalDateTime signedDate) {
        this.signedDate = signedDate;
    }

    public NotePriority getPriority() {
        return priority;
    }

    public void setPriority(NotePriority priority) {
        this.priority = priority;
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
