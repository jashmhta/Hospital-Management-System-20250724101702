package com.hms.patientportal.repository;

import com.hms.patientportal.entity.PortalMessage;
import com.hms.patientportal.entity.PatientPortalUser;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Portal Message Repository
 * 
 * Repository for managing secure patient-provider messaging with comprehensive
 * features for communication, encryption, HIPAA compliance, and message threading.
 */
@Repository
public interface PortalMessageRepository extends JpaRepository<PortalMessage, Long>, JpaSpecificationExecutor<PortalMessage> {

    // Basic message queries
    List<PortalMessage> findByPatientId(Long patientId);
    
    Page<PortalMessage> findByPatient(PatientPortalUser patient, Pageable pageable);
    
    List<PortalMessage> findByPatientAndIsArchivedFalse(PatientPortalUser patient);
    
    Page<PortalMessage> findByPatientAndIsArchivedFalse(PatientPortalUser patient, Pageable pageable);

    // Sender and recipient queries
    @Query("SELECT pm FROM PortalMessage pm WHERE pm.senderId = :senderId ORDER BY pm.createdAt DESC")
    List<PortalMessage> findBySenderId(@Param("senderId") Long senderId);
    
    @Query("SELECT pm FROM PortalMessage pm WHERE pm.recipientId = :recipientId ORDER BY pm.createdAt DESC")
    List<PortalMessage> findByRecipientId(@Param("recipientId") Long recipientId);
    
    @Query("SELECT pm FROM PortalMessage pm WHERE (pm.senderId = :userId OR pm.recipientId = :userId) ORDER BY pm.createdAt DESC")
    Page<PortalMessage> findUserMessages(@Param("userId") Long userId, Pageable pageable);

    // Message thread queries
    List<PortalMessage> findByThreadIdOrderByCreatedAtAsc(String threadId);
    
    @Query("SELECT pm FROM PortalMessage pm WHERE pm.threadId = :threadId AND pm.readAt IS NULL")
    List<PortalMessage> findUnreadMessagesInThread(@Param("threadId") String threadId);
    
    @Query("SELECT DISTINCT pm.threadId FROM PortalMessage pm WHERE pm.patient.id = :patientId AND pm.isArchived = false")
    List<String> findActiveThreadsByPatient(@Param("patientId") Long patientId);

    // Read/unread message queries
    @Query("SELECT pm FROM PortalMessage pm WHERE pm.recipientId = :recipientId AND pm.readAt IS NULL ORDER BY pm.createdAt DESC")
    List<PortalMessage> findUnreadMessagesByRecipient(@Param("recipientId") Long recipientId);
    
    @Query("SELECT COUNT(pm) FROM PortalMessage pm WHERE pm.recipientId = :recipientId AND pm.readAt IS NULL")
    Long countUnreadMessagesByRecipient(@Param("recipientId") Long recipientId);
    
    @Query("SELECT pm FROM PortalMessage pm WHERE pm.patient.id = :patientId AND pm.readAt IS NULL")
    List<PortalMessage> findUnreadPatientMessages(@Param("patientId") Long patientId);

    // Message type and priority queries
    List<PortalMessage> findByMessageTypeAndIsArchivedFalse(PortalMessage.MessageType messageType);
    
    @Query("SELECT pm FROM PortalMessage pm WHERE pm.priority IN ('URGENT', 'CRITICAL') AND pm.readAt IS NULL ORDER BY pm.priority DESC, pm.createdAt ASC")
    List<PortalMessage> findUrgentUnreadMessages();
    
    @Query("SELECT pm FROM PortalMessage pm WHERE pm.priority = :priority AND pm.createdAt >= :since")
    List<PortalMessage> findByPriorityAndCreatedAfter(@Param("priority") PortalMessage.MessagePriority priority, @Param("since") LocalDateTime since);

    // Action required queries
    @Query("SELECT pm FROM PortalMessage pm WHERE pm.requiresAction = true AND pm.actionTaken = false ORDER BY pm.createdAt ASC")
    List<PortalMessage> findMessagesRequiringAction();
    
    @Query("SELECT pm FROM PortalMessage pm WHERE pm.recipientId = :recipientId AND pm.requiresAction = true AND pm.actionTaken = false")
    List<PortalMessage> findActionRequiredByRecipient(@Param("recipientId") Long recipientId);

    // Attachment queries
    @Query("SELECT pm FROM PortalMessage pm WHERE pm.attachmentCount > 0")
    List<PortalMessage> findMessagesWithAttachments();
    
    @Query("SELECT pm FROM PortalMessage pm WHERE pm.patient.id = :patientId AND pm.attachmentCount > 0")
    List<PortalMessage> findPatientMessagesWithAttachments(@Param("patientId") Long patientId);

    // Related entity queries
    @Query("SELECT pm FROM PortalMessage pm WHERE pm.relatedAppointmentId = :appointmentId")
    List<PortalMessage> findByRelatedAppointmentId(@Param("appointmentId") Long appointmentId);
    
    @Query("SELECT pm FROM PortalMessage pm WHERE pm.relatedTestResultId = :testResultId")
    List<PortalMessage> findByRelatedTestResultId(@Param("testResultId") Long testResultId);
    
    @Query("SELECT pm FROM PortalMessage pm WHERE pm.relatedVisitId = :visitId")
    List<PortalMessage> findByRelatedVisitId(@Param("visitId") Long visitId);

    // Expiration and cleanup queries
    @Query("SELECT pm FROM PortalMessage pm WHERE pm.expiresAt IS NOT NULL AND pm.expiresAt < :now")
    List<PortalMessage> findExpiredMessages(@Param("now") LocalDateTime now);
    
    @Query("SELECT pm FROM PortalMessage pm WHERE pm.createdAt < :threshold AND pm.isArchived = false")
    List<PortalMessage> findOldUnarchived(@Param("threshold") LocalDateTime threshold);

    // Security and compliance queries
    @Query("SELECT pm FROM PortalMessage pm WHERE pm.isEncrypted = false")
    List<PortalMessage> findUnencryptedMessages();
    
    @Query("SELECT pm FROM PortalMessage pm WHERE pm.hipaaLoggingId = :loggingId")
    Optional<PortalMessage> findByHipaaLoggingId(@Param("loggingId") String loggingId);
    
    @Query("SELECT pm FROM PortalMessage pm WHERE pm.isFlagged = true AND pm.flagReason IS NOT NULL")
    List<PortalMessage> findFlaggedMessages();

    // Provider communication queries
    @Query("SELECT pm FROM PortalMessage pm WHERE pm.senderType = 'PROVIDER' AND pm.recipientId = :patientId ORDER BY pm.createdAt DESC")
    List<PortalMessage> findProviderMessagesToPatient(@Param("patientId") Long patientId);
    
    @Query("SELECT pm FROM PortalMessage pm WHERE pm.recipientType = 'PROVIDER' AND pm.senderId = :patientId ORDER BY pm.createdAt DESC")
    List<PortalMessage> findPatientMessagesToProviders(@Param("patientId") Long patientId);

    // Analytics and reporting queries
    @Query("SELECT pm.messageType, COUNT(pm) FROM PortalMessage pm WHERE pm.createdAt >= :since GROUP BY pm.messageType ORDER BY COUNT(pm) DESC")
    List<Object[]> getMessageTypeCounts(@Param("since") LocalDateTime since);
    
    @Query("SELECT pm.priority, COUNT(pm) FROM PortalMessage pm WHERE pm.createdAt >= :since GROUP BY pm.priority")
    List<Object[]> getMessagePriorityCounts(@Param("since") LocalDateTime since);
    
    @Query("SELECT DATE(pm.createdAt) as messageDate, COUNT(pm) FROM PortalMessage pm WHERE pm.createdAt >= :since GROUP BY DATE(pm.createdAt) ORDER BY messageDate DESC")
    List<Object[]> getDailyMessageCounts(@Param("since") LocalDateTime since);
    
    @Query("SELECT pm.senderType, COUNT(pm) FROM PortalMessage pm WHERE pm.createdAt >= :since GROUP BY pm.senderType")
    List<Object[]> getMessageCountsBySenderType(@Param("since") LocalDateTime since);

    // Response time analytics
    @Query("SELECT AVG(EXTRACT(HOUR FROM (pm.repliedAt - pm.createdAt))) FROM PortalMessage pm WHERE pm.repliedAt IS NOT NULL AND pm.createdAt >= :since")
    Double getAverageResponseTimeHours(@Param("since") LocalDateTime since);
    
    @Query("SELECT COUNT(pm) FROM PortalMessage pm WHERE pm.createdAt >= :since AND pm.repliedAt IS NULL")
    Long getUnrepliedMessageCount(@Param("since") LocalDateTime since);

    // Search functionality
    @Query("SELECT pm FROM PortalMessage pm WHERE pm.patient.id = :patientId AND " +
           "(LOWER(pm.subject) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(pm.messageBody) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(pm.senderName) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    Page<PortalMessage> searchPatientMessages(@Param("patientId") Long patientId, @Param("searchTerm") String searchTerm, Pageable pageable);
    
    @Query("SELECT pm FROM PortalMessage pm WHERE " +
           "(LOWER(pm.subject) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(pm.messageBody) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) AND " +
           "pm.messageType = :messageType")
    Page<PortalMessage> searchMessagesByType(@Param("searchTerm") String searchTerm, @Param("messageType") PortalMessage.MessageType messageType, Pageable pageable);

    // Update operations
    @Modifying
    @Transactional
    @Query("UPDATE PortalMessage pm SET pm.readAt = :readAt WHERE pm.id = :messageId")
    int markAsRead(@Param("messageId") Long messageId, @Param("readAt") LocalDateTime readAt);
    
    @Modifying
    @Transactional
    @Query("UPDATE PortalMessage pm SET pm.readAt = :readAt WHERE pm.threadId = :threadId AND pm.recipientId = :recipientId AND pm.readAt IS NULL")
    int markThreadAsRead(@Param("threadId") String threadId, @Param("recipientId") Long recipientId, @Param("readAt") LocalDateTime readAt);
    
    @Modifying
    @Transactional
    @Query("UPDATE PortalMessage pm SET pm.isArchived = true, pm.archivedAt = :archivedAt WHERE pm.id = :messageId")
    int archiveMessage(@Param("messageId") Long messageId, @Param("archivedAt") LocalDateTime archivedAt);
    
    @Modifying
    @Transactional
    @Query("UPDATE PortalMessage pm SET pm.isFlagged = true, pm.flagReason = :reason WHERE pm.id = :messageId")
    int flagMessage(@Param("messageId") Long messageId, @Param("reason") String reason);
    
    @Modifying
    @Transactional
    @Query("UPDATE PortalMessage pm SET pm.actionTaken = true, pm.actionDescription = :description WHERE pm.id = :messageId")
    int markActionTaken(@Param("messageId") Long messageId, @Param("description") String description);

    // Bulk operations
    @Modifying
    @Transactional
    @Query("UPDATE PortalMessage pm SET pm.isArchived = true, pm.archivedAt = :archivedAt WHERE pm.patient.id = :patientId AND pm.createdAt < :threshold")
    int archiveOldPatientMessages(@Param("patientId") Long patientId, @Param("threshold") LocalDateTime threshold, @Param("archivedAt") LocalDateTime archivedAt);
    
    @Modifying
    @Transactional
    @Query("DELETE FROM PortalMessage pm WHERE pm.isArchived = true AND pm.archivedAt < :threshold")
    int deleteOldArchivedMessages(@Param("threshold") LocalDateTime threshold);

    // Notification preferences integration
    @Query("SELECT pm FROM PortalMessage pm WHERE pm.patient.preferences.emailNotifications = true AND pm.readAt IS NULL")
    List<PortalMessage> findUnreadForEmailNotification();
    
    @Query("SELECT pm FROM PortalMessage pm WHERE pm.patient.preferences.smsNotifications = true AND pm.priority IN ('URGENT', 'CRITICAL') AND pm.readAt IS NULL")
    List<PortalMessage> findUrgentUnreadForSmsNotification();

    // Threading and conversation management
    @Query("SELECT COUNT(DISTINCT pm.threadId) FROM PortalMessage pm WHERE pm.patient.id = :patientId AND pm.isArchived = false")
    Long countActiveConversations(@Param("patientId") Long patientId);
    
    @Query("SELECT pm.threadId, COUNT(pm), MAX(pm.createdAt) FROM PortalMessage pm WHERE pm.patient.id = :patientId AND pm.isArchived = false GROUP BY pm.threadId ORDER BY MAX(pm.createdAt) DESC")
    List<Object[]> getPatientConversationSummary(@Param("patientId") Long patientId);

    // Message validation
    @Query("SELECT COUNT(pm) > 0 FROM PortalMessage pm WHERE pm.patient.id = :patientId AND pm.recipientId = :recipientId AND pm.createdAt >= :since")
    boolean hasRecentMessageToRecipient(@Param("patientId") Long patientId, @Param("recipientId") Long recipientId, @Param("since") LocalDateTime since);
}
