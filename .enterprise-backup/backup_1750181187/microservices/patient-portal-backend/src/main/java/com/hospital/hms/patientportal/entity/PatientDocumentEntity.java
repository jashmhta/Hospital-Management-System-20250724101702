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
 * Patient Document Entity
 * 
 * Manages patient uploaded documents and medical records.
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Entity
@Table(name = "patient_documents", indexes = {
    @Index(name = "idx_document_patient", columnList = "patient_id"),
    @Index(name = "idx_document_type", columnList = "document_type"),
    @Index(name = "idx_document_status", columnList = "status"),
    @Index(name = "idx_document_created", columnList = "created_at")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PatientDocumentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "document_id")
    private String documentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private PatientEntity patient;

    @Column(name = "document_name", nullable = false, length = 255)
    private String documentName;

    @Column(name = "original_filename", length = 255)
    private String originalFilename;

    @Enumerated(EnumType.STRING)
    @Column(name = "document_type", nullable = false)
    private DocumentType documentType;

    @Column(name = "document_category", length = 100)
    private String documentCategory;

    @Column(name = "file_path", nullable = false, length = 500)
    private String filePath;

    @Column(name = "file_size")
    private Long fileSize;

    @Column(name = "mime_type", length = 100)
    private String mimeType;

    @Column(name = "file_hash", length = 256)
    private String fileHash;

    @Column(name = "description", length = 1000)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    @Builder.Default
    private DocumentStatus status = DocumentStatus.ACTIVE;

    @Column(name = "is_sensitive")
    @Builder.Default
    private Boolean isSensitive = false;

    @Column(name = "requires_encryption")
    @Builder.Default
    private Boolean requiresEncryption = false;

    @Column(name = "is_encrypted")
    @Builder.Default
    private Boolean isEncrypted = false;

    @Column(name = "encryption_key_id")
    private String encryptionKeyId;

    @Column(name = "version", nullable = false)
    @Builder.Default
    private Integer version = 1;

    @Column(name = "parent_document_id")
    private String parentDocumentId;

    @Column(name = "is_public")
    @Builder.Default
    private Boolean isPublic = false;

    @Column(name = "shared_with_providers")
    @Builder.Default
    private Boolean sharedWithProviders = true;

    @Column(name = "document_date")
    private LocalDateTime documentDate;

    @Column(name = "provider_id")
    private String providerId;

    @Column(name = "provider_name", length = 200)
    private String providerName;

    @Column(name = "department", length = 100)
    private String department;

    @Column(name = "visit_id")
    private String visitId;

    @Column(name = "appointment_id")
    private String appointmentId;

    @Column(name = "tags", length = 500)
    private String tags;

    @Column(name = "expiration_date")
    private LocalDateTime expirationDate;

    @Column(name = "retention_period_days")
    private Integer retentionPeriodDays;

    @Column(name = "access_count")
    @Builder.Default
    private Integer accessCount = 0;

    @Column(name = "last_accessed")
    private LocalDateTime lastAccessed;

    @Column(name = "download_count")
    @Builder.Default
    private Integer downloadCount = 0;

    @Column(name = "last_downloaded")
    private LocalDateTime lastDownloaded;

    @Column(name = "is_verified")
    @Builder.Default
    private Boolean isVerified = false;

    @Column(name = "verified_by", length = 100)
    private String verifiedBy;

    @Column(name = "verified_at")
    private LocalDateTime verifiedAt;

    @Column(name = "verification_notes", length = 500)
    private String verificationNotes;

    @Column(name = "created_at", nullable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @Column(name = "uploaded_by", length = 100)
    private String uploadedBy;

    @Column(name = "updated_by", length = 100)
    private String updatedBy;

    // Enums
    public enum DocumentType {
        MEDICAL_RECORD,
        LAB_RESULT,
        IMAGING_REPORT,
        PRESCRIPTION,
        INSURANCE_CARD,
        ID_DOCUMENT,
        CONSENT_FORM,
        MEDICAL_HISTORY,
        VACCINATION_RECORD,
        DISCHARGE_SUMMARY,
        REFERRAL_LETTER,
        TREATMENT_PLAN,
        PROGRESS_NOTE,
        OPERATIVE_REPORT,
        PATHOLOGY_REPORT,
        RADIOLOGY_IMAGE,
        CORRESPONDENCE,
        BILLING_DOCUMENT,
        OTHER
    }

    public enum DocumentStatus {
        ACTIVE,
        ARCHIVED,
        DELETED,
        PENDING_REVIEW,
        REJECTED,
        EXPIRED
    }

    // Helper methods
    public boolean isExpired() {
        return expirationDate != null && expirationDate.isBefore(LocalDateTime.now());
    }

    public boolean isImage() {
        return mimeType != null && mimeType.startsWith("image/");
    }

    public boolean isPdf() {
        return "application/pdf".equals(mimeType);
    }

    public boolean isDocument() {
        return mimeType != null && (
            mimeType.contains("document") || 
            mimeType.contains("text") || 
            mimeType.contains("pdf")
        );
    }

    public String getFileExtension() {
        if (originalFilename != null && originalFilename.contains(".")) {
            return originalFilename.substring(originalFilename.lastIndexOf(".") + 1);
        }
        return "";
    }

    public String getFormattedFileSize() {
        if (fileSize == null) return "Unknown";
        
        long bytes = fileSize;
        if (bytes < 1024) return bytes + " B";
        
        int exp = (int) (Math.log(bytes) / Math.log(1024));
        String[] units = {"B", "KB", "MB", "GB", "TB"};
        return String.format("%.1f %s", bytes / Math.pow(1024, exp), units[exp]);
    }

    public boolean canBeDownloaded() {
        return status == DocumentStatus.ACTIVE && !isExpired();
    }

    public boolean requiresSpecialHandling() {
        return isSensitive || requiresEncryption || 
               documentType == DocumentType.ID_DOCUMENT ||
               documentType == DocumentType.INSURANCE_CARD;
    }

    public void incrementAccessCount() {
        this.accessCount++;
        this.lastAccessed = LocalDateTime.now();
    }

    public void incrementDownloadCount() {
        this.downloadCount++;
        this.lastDownloaded = LocalDateTime.now();
    }

    @PrePersist
    protected void onCreate() {
        if (documentDate == null) {
            documentDate = LocalDateTime.now();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}