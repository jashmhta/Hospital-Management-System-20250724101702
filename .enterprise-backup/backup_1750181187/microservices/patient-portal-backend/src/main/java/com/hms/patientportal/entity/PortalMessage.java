package com.hms.patientportal.entity;

import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

/**
 * Portal Message Entity
 * 
 * Represents secure messages between patients and healthcare providers
 * through the patient portal system.
 */
@Entity
@Table(name = "portal_messages",
    indexes = {
        @Index(name = "idx_message_patient", columnList = "patient_id"),
        @Index(name = "idx_message_sender", columnList = "sender_id"),
        @Index(name = "idx_message_recipient", columnList = "recipient_id"),
        @Index(name = "idx_message_thread", columnList = "thread_id"),
        @Index(name = "idx_message_read", columnList = "read_at"),
        @Index(name = "idx_message_priority", columnList = "priority")
    }
)
@EntityListeners(AuditingEntityListener.class)
public class PortalMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private PatientPortalUser patient;

    @Column(name = "thread_id")
    private String threadId;

    @Column(name = "sender_id", nullable = false)
    private Long senderId;

    @Column(name = "sender_name", length = 200)
    private String senderName;

    @Enumerated(EnumType.STRING)
    @Column(name = "sender_type", nullable = false)
    private SenderType senderType;

    @Column(name = "recipient_id", nullable = false)
    private Long recipientId;

    @Column(name = "recipient_name", length = 200)
    private String recipientName;

    @Enumerated(EnumType.STRING)
    @Column(name = "recipient_type", nullable = false)
    private RecipientType recipientType;

    @Column(name = "subject", length = 500)
    private String subject;

    @Column(name = "message_body", columnDefinition = "TEXT", nullable = false)
    private String messageBody;

    @Enumerated(EnumType.STRING)
    @Column(name = "message_type", nullable = false)
    private MessageType messageType;

    @Enumerated(EnumType.STRING)
    @Column(name = "priority", nullable = false)
    private MessagePriority priority = MessagePriority.NORMAL;

    @Column(name = "is_encrypted", nullable = false)
    private Boolean isEncrypted = true;

    @Column(name = "encryption_key_id")
    private String encryptionKeyId;

    @Column(name = "read_at")
    private LocalDateTime readAt;

    @Column(name = "replied_at")
    private LocalDateTime repliedAt;

    @Column(name = "reply_message_id")
    private Long replyMessageId;

    @Column(name = "attachment_count", nullable = false)
    private Integer attachmentCount = 0;

    @Column(name = "attachment_names", columnDefinition = "TEXT")
    private String attachmentNames;

    @Column(name = "requires_action", nullable = false)
    private Boolean requiresAction = false;

    @Column(name = "action_taken", nullable = false)
    private Boolean actionTaken = false;

    @Column(name = "action_description", length = 500)
    private String actionDescription;

    @Column(name = "expires_at")
    private LocalDateTime expiresAt;

    @Column(name = "is_archived", nullable = false)
    private Boolean isArchived = false;

    @Column(name = "archived_at")
    private LocalDateTime archivedAt;

    @Column(name = "is_flagged", nullable = false)
    private Boolean isFlagged = false;

    @Column(name = "flag_reason", length = 500)
    private String flagReason;

    @Column(name = "related_appointment_id")
    private Long relatedAppointmentId;

    @Column(name = "related_visit_id")
    private Long relatedVisitId;

    @Column(name = "related_test_result_id")
    private Long relatedTestResultId;

    @Column(name = "hipaa_logging_id")
    private String hipaaLoggingId;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Version
    private Long version;

    // Constructors
    public PortalMessage() {}

    public PortalMessage(PatientPortalUser patient, Long senderId, String senderName, 
                        SenderType senderType, String subject, String messageBody, MessageType messageType) {
        this.patient = patient;
        this.senderId = senderId;
        this.senderName = senderName;
        this.senderType = senderType;
        this.subject = subject;
        this.messageBody = messageBody;
        this.messageType = messageType;
        this.recipientId = patient.getId();
        this.recipientName = patient.getFullName();
        this.recipientType = RecipientType.PATIENT;
    }

    // Utility methods
    public boolean isRead() {
        return readAt != null;
    }

    public boolean isReplied() {
        return repliedAt != null;
    }

    public boolean isExpired() {
        return expiresAt != null && LocalDateTime.now().isAfter(expiresAt);
    }

    public boolean isUrgent() {
        return priority == MessagePriority.URGENT || priority == MessagePriority.CRITICAL;
    }

    public boolean hasAttachments() {
        return attachmentCount != null && attachmentCount > 0;
    }

    public void markAsRead() {
        this.readAt = LocalDateTime.now();
    }

    public void markAsReplied(Long replyMessageId) {
        this.repliedAt = LocalDateTime.now();
        this.replyMessageId = replyMessageId;
    }

    public void archive() {
        this.isArchived = true;
        this.archivedAt = LocalDateTime.now();
    }

    public void flag(String reason) {
        this.isFlagged = true;
        this.flagReason = reason;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public PatientPortalUser getPatient() { return patient; }
    public void setPatient(PatientPortalUser patient) { this.patient = patient; }

    public String getThreadId() { return threadId; }
    public void setThreadId(String threadId) { this.threadId = threadId; }

    public Long getSenderId() { return senderId; }
    public void setSenderId(Long senderId) { this.senderId = senderId; }

    public String getSenderName() { return senderName; }
    public void setSenderName(String senderName) { this.senderName = senderName; }

    public SenderType getSenderType() { return senderType; }
    public void setSenderType(SenderType senderType) { this.senderType = senderType; }

    public Long getRecipientId() { return recipientId; }
    public void setRecipientId(Long recipientId) { this.recipientId = recipientId; }

    public String getRecipientName() { return recipientName; }
    public void setRecipientName(String recipientName) { this.recipientName = recipientName; }

    public RecipientType getRecipientType() { return recipientType; }
    public void setRecipientType(RecipientType recipientType) { this.recipientType = recipientType; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getMessageBody() { return messageBody; }
    public void setMessageBody(String messageBody) { this.messageBody = messageBody; }

    public MessageType getMessageType() { return messageType; }
    public void setMessageType(MessageType messageType) { this.messageType = messageType; }

    public MessagePriority getPriority() { return priority; }
    public void setPriority(MessagePriority priority) { this.priority = priority; }

    public Boolean getIsEncrypted() { return isEncrypted; }
    public void setIsEncrypted(Boolean isEncrypted) { this.isEncrypted = isEncrypted; }

    public String getEncryptionKeyId() { return encryptionKeyId; }
    public void setEncryptionKeyId(String encryptionKeyId) { this.encryptionKeyId = encryptionKeyId; }

    public LocalDateTime getReadAt() { return readAt; }
    public void setReadAt(LocalDateTime readAt) { this.readAt = readAt; }

    public LocalDateTime getRepliedAt() { return repliedAt; }
    public void setRepliedAt(LocalDateTime repliedAt) { this.repliedAt = repliedAt; }

    public Long getReplyMessageId() { return replyMessageId; }
    public void setReplyMessageId(Long replyMessageId) { this.replyMessageId = replyMessageId; }

    public Integer getAttachmentCount() { return attachmentCount; }
    public void setAttachmentCount(Integer attachmentCount) { this.attachmentCount = attachmentCount; }

    public String getAttachmentNames() { return attachmentNames; }
    public void setAttachmentNames(String attachmentNames) { this.attachmentNames = attachmentNames; }

    public Boolean getRequiresAction() { return requiresAction; }
    public void setRequiresAction(Boolean requiresAction) { this.requiresAction = requiresAction; }

    public Boolean getActionTaken() { return actionTaken; }
    public void setActionTaken(Boolean actionTaken) { this.actionTaken = actionTaken; }

    public String getActionDescription() { return actionDescription; }
    public void setActionDescription(String actionDescription) { this.actionDescription = actionDescription; }

    public LocalDateTime getExpiresAt() { return expiresAt; }
    public void setExpiresAt(LocalDateTime expiresAt) { this.expiresAt = expiresAt; }

    public Boolean getIsArchived() { return isArchived; }
    public void setIsArchived(Boolean isArchived) { this.isArchived = isArchived; }

    public LocalDateTime getArchivedAt() { return archivedAt; }
    public void setArchivedAt(LocalDateTime archivedAt) { this.archivedAt = archivedAt; }

    public Boolean getIsFlagged() { return isFlagged; }
    public void setIsFlagged(Boolean isFlagged) { this.isFlagged = isFlagged; }

    public String getFlagReason() { return flagReason; }
    public void setFlagReason(String flagReason) { this.flagReason = flagReason; }

    public Long getRelatedAppointmentId() { return relatedAppointmentId; }
    public void setRelatedAppointmentId(Long relatedAppointmentId) { this.relatedAppointmentId = relatedAppointmentId; }

    public Long getRelatedVisitId() { return relatedVisitId; }
    public void setRelatedVisitId(Long relatedVisitId) { this.relatedVisitId = relatedVisitId; }

    public Long getRelatedTestResultId() { return relatedTestResultId; }
    public void setRelatedTestResultId(Long relatedTestResultId) { this.relatedTestResultId = relatedTestResultId; }

    public String getHipaaLoggingId() { return hipaaLoggingId; }
    public void setHipaaLoggingId(String hipaaLoggingId) { this.hipaaLoggingId = hipaaLoggingId; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public Long getVersion() { return version; }
    public void setVersion(Long version) { this.version = version; }

    // Enums
    public enum SenderType {
        PATIENT,
        PROVIDER,
        NURSE,
        ADMIN_STAFF,
        SYSTEM
    }

    public enum RecipientType {
        PATIENT,
        PROVIDER,
        NURSE,
        ADMIN_STAFF,
        FAMILY_MEMBER
    }

    public enum MessageType {
        GENERAL_INQUIRY,
        APPOINTMENT_REQUEST,
        TEST_RESULT_NOTIFICATION,
        PRESCRIPTION_REFILL,
        BILLING_INQUIRY,
        INSURANCE_QUESTION,
        MEDICAL_ADVICE,
        APPOINTMENT_REMINDER,
        SYSTEM_NOTIFICATION,
        EMERGENCY_COMMUNICATION
    }

    public enum MessagePriority {
        LOW,
        NORMAL,
        HIGH,
        URGENT,
        CRITICAL
    }
}
