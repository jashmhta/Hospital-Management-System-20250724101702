package com.hospital.hms.clinicalnotes.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Clinical Note Entity
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Entity
@Table(name = "clinical_notes", indexes = {
    @Index(name = "idx_note_patient", columnList = "patient_id"),
    @Index(name = "idx_note_provider", columnList = "provider_id"),
    @Index(name = "idx_note_type", columnList = "note_type"),
    @Index(name = "idx_note_date", columnList = "note_date"),
    @Index(name = "idx_note_created", columnList = "created_date")
})
@EntityListeners(AuditingEntityListener.class)
public class ClinicalNote {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "note_number", unique = true, nullable = false, length = 50)
    @NotBlank(message = "Note number is required")
    private String noteNumber;

    @Column(name = "patient_id", nullable = false)
    @NotNull(message = "Patient ID is required")
    private UUID patientId;

    @Column(name = "patient_name", nullable = false, length = 200)
    @NotBlank(message = "Patient name is required")
    private String patientName;

    @Column(name = "provider_id", nullable = false)
    @NotNull(message = "Provider ID is required")
    private UUID providerId;

    @Column(name = "provider_name", nullable = false, length = 200)
    @NotBlank(message = "Provider name is required")
    private String providerName;

    @Column(name = "note_type", nullable = false, length = 50)
    @Enumerated(EnumType.STRING)
    @NotNull(message = "Note type is required")
    private NoteType noteType;

    @Column(name = "note_date", nullable = false)
    @NotNull(message = "Note date is required")
    private LocalDateTime noteDate;

    @Column(name = "title", nullable = false, length = 500)
    @NotBlank(message = "Note title is required")
    private String title;

    @Column(name = "content", columnDefinition = "TEXT", nullable = false)
    @NotBlank(message = "Note content is required")
    private String content;

    @Column(name = "status", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private NoteStatus status = NoteStatus.DRAFT;

    @Column(name = "signed")
    private Boolean signed = false;

    @Column(name = "signed_date")
    private LocalDateTime signedDate;

    @Column(name = "priority", length = 20)
    @Enumerated(EnumType.STRING)
    private NotePriority priority = NotePriority.NORMAL;

    @CreatedDate
    @Column(name = "created_date", nullable = false, updatable = false)
    private LocalDateTime createdDate;

    @LastModifiedDate
    @Column(name = "last_modified_date")
    private LocalDateTime lastModifiedDate;

    @Column(name = "created_by", length = 100)
    private String createdBy;

    @Column(name = "last_modified_by", length = 100)
    private String lastModifiedBy;

    // Constructors
    public ClinicalNote() {}

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
