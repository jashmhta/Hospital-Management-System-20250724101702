package com.hms.patientportal.repository;

import com.hms.patientportal.entity.AppointmentRequest;
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
 * Appointment Request Repository
 * 
 * Repository for managing patient appointment requests with comprehensive
 * query capabilities for scheduling, approval workflow, and analytics.
 */
@Repository
public interface AppointmentRequestRepository extends JpaRepository<AppointmentRequest, Long>, JpaSpecificationExecutor<AppointmentRequest> {

    // Basic queries by patient and status
    List<AppointmentRequest> findByPatientId(Long patientId);
    
    List<AppointmentRequest> findByPatientAndStatus(PatientPortalUser patient, AppointmentRequest.RequestStatus status);
    
    Page<AppointmentRequest> findByPatient(PatientPortalUser patient, Pageable pageable);
    
    List<AppointmentRequest> findByStatus(AppointmentRequest.RequestStatus status);
    
    Page<AppointmentRequest> findByStatus(AppointmentRequest.RequestStatus status, Pageable pageable);

    // Provider-specific queries
    List<AppointmentRequest> findByRequestedProviderId(Long providerId);
    
    @Query("SELECT ar FROM AppointmentRequest ar WHERE ar.requestedProviderId = :providerId AND ar.status = :status ORDER BY ar.createdAt DESC")
    List<AppointmentRequest> findByProviderIdAndStatus(@Param("providerId") Long providerId, @Param("status") AppointmentRequest.RequestStatus status);
    
    @Query("SELECT ar FROM AppointmentRequest ar WHERE ar.requestedSpecialty = :specialty AND ar.status = 'PENDING' ORDER BY ar.priority DESC, ar.createdAt ASC")
    List<AppointmentRequest> findPendingRequestsBySpecialty(@Param("specialty") String specialty);

    // Priority and urgent requests
    @Query("SELECT ar FROM AppointmentRequest ar WHERE ar.priority IN ('URGENT', 'EMERGENCY') AND ar.status = 'PENDING' ORDER BY ar.priority DESC, ar.createdAt ASC")
    List<AppointmentRequest> findUrgentPendingRequests();
    
    @Query("SELECT ar FROM AppointmentRequest ar WHERE ar.priority = :priority AND ar.status = :status")
    List<AppointmentRequest> findByPriorityAndStatus(@Param("priority") AppointmentRequest.Priority priority, @Param("status") AppointmentRequest.RequestStatus status);

    // Date-based queries
    @Query("SELECT ar FROM AppointmentRequest ar WHERE ar.requestedDate >= :startDate AND ar.requestedDate <= :endDate")
    List<AppointmentRequest> findByRequestedDateBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT ar FROM AppointmentRequest ar WHERE ar.createdAt >= :since AND ar.status = 'PENDING'")
    List<AppointmentRequest> findRecentPendingRequests(@Param("since") LocalDateTime since);
    
    @Query("SELECT ar FROM AppointmentRequest ar WHERE ar.requestedDate < :threshold AND ar.status = 'PENDING'")
    List<AppointmentRequest> findOverdueRequests(@Param("threshold") LocalDateTime threshold);

    // Appointment type queries
    List<AppointmentRequest> findByAppointmentTypeAndStatus(AppointmentRequest.AppointmentType type, AppointmentRequest.RequestStatus status);
    
    @Query("SELECT ar FROM AppointmentRequest ar WHERE ar.appointmentType = 'EMERGENCY' AND ar.status IN ('PENDING', 'APPROVED') ORDER BY ar.createdAt DESC")
    List<AppointmentRequest> findEmergencyRequests();

    // Patient-specific duplicate and history queries
    @Query("SELECT ar FROM AppointmentRequest ar WHERE ar.patient.id = :patientId AND ar.requestedProviderId = :providerId " +
           "AND ar.createdAt >= :since AND ar.status = 'PENDING'")
    List<AppointmentRequest> findRecentDuplicateRequests(@Param("patientId") Long patientId, 
                                                        @Param("providerId") Long providerId, 
                                                        @Param("since") LocalDateTime since);
    
    @Query("SELECT ar FROM AppointmentRequest ar WHERE ar.patient.id = :patientId ORDER BY ar.createdAt DESC")
    Page<AppointmentRequest> findPatientRequestHistory(@Param("patientId") Long patientId, Pageable pageable);

    // Approval workflow queries
    @Query("SELECT ar FROM AppointmentRequest ar WHERE ar.status = 'APPROVED' AND ar.approvedAppointmentId IS NOT NULL")
    List<AppointmentRequest> findApprovedWithAppointments();
    
    @Query("SELECT ar FROM AppointmentRequest ar WHERE ar.approvedBy = :approver ORDER BY ar.approvedDate DESC")
    List<AppointmentRequest> findRequestsApprovedBy(@Param("approver") String approver);
    
    @Query("SELECT ar FROM AppointmentRequest ar WHERE ar.status = 'REJECTED' AND ar.rejectionReason IS NOT NULL")
    List<AppointmentRequest> findRejectedWithReasons();

    // Analytics and reporting queries
    @Query("SELECT ar.status, COUNT(ar) FROM AppointmentRequest ar WHERE ar.createdAt >= :since GROUP BY ar.status")
    List<Object[]> getRequestStatusCounts(@Param("since") LocalDateTime since);
    
    @Query("SELECT ar.appointmentType, COUNT(ar) FROM AppointmentRequest ar WHERE ar.createdAt >= :since GROUP BY ar.appointmentType ORDER BY COUNT(ar) DESC")
    List<Object[]> getRequestTypeCounts(@Param("since") LocalDateTime since);
    
    @Query("SELECT ar.priority, COUNT(ar) FROM AppointmentRequest ar WHERE ar.createdAt >= :since GROUP BY ar.priority")
    List<Object[]> getPriorityCounts(@Param("since") LocalDateTime since);
    
    @Query("SELECT ar.requestedSpecialty, COUNT(ar) FROM AppointmentRequest ar WHERE ar.createdAt >= :since AND ar.requestedSpecialty IS NOT NULL GROUP BY ar.requestedSpecialty ORDER BY COUNT(ar) DESC")
    List<Object[]> getSpecialtyRequestCounts(@Param("since") LocalDateTime since);

    // Performance metrics
    @Query("SELECT AVG(EXTRACT(HOUR FROM (ar.approvedDate - ar.createdAt))) FROM AppointmentRequest ar WHERE ar.status = 'APPROVED' AND ar.approvedDate IS NOT NULL AND ar.createdAt >= :since")
    Double getAverageApprovalTimeHours(@Param("since") LocalDateTime since);
    
    @Query("SELECT COUNT(ar) FROM AppointmentRequest ar WHERE ar.createdAt >= :since")
    Long getTotalRequestsCount(@Param("since") LocalDateTime since);
    
    @Query("SELECT COUNT(ar) FROM AppointmentRequest ar WHERE ar.status = 'PENDING' AND ar.createdAt < :threshold")
    Long getOldPendingRequestsCount(@Param("threshold") LocalDateTime threshold);

    // Update operations
    @Modifying
    @Transactional
    @Query("UPDATE AppointmentRequest ar SET ar.status = :status, ar.approvedBy = :approvedBy, ar.approvedDate = :approvedDate WHERE ar.id = :requestId")
    int approveRequest(@Param("requestId") Long requestId, @Param("status") AppointmentRequest.RequestStatus status, 
                      @Param("approvedBy") String approvedBy, @Param("approvedDate") LocalDateTime approvedDate);
    
    @Modifying
    @Transactional
    @Query("UPDATE AppointmentRequest ar SET ar.status = 'REJECTED', ar.rejectionReason = :reason WHERE ar.id = :requestId")
    int rejectRequest(@Param("requestId") Long requestId, @Param("reason") String reason);
    
    @Modifying
    @Transactional
    @Query("UPDATE AppointmentRequest ar SET ar.approvedAppointmentId = :appointmentId WHERE ar.id = :requestId")
    int linkToAppointment(@Param("requestId") Long requestId, @Param("appointmentId") Long appointmentId);

    // Search and filtering
    @Query("SELECT ar FROM AppointmentRequest ar WHERE " +
           "(LOWER(ar.patient.firstName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(ar.patient.lastName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(ar.reasonForVisit) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(ar.requestedProviderName) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) AND " +
           "ar.status = :status")
    Page<AppointmentRequest> searchRequestsByStatus(@Param("searchTerm") String searchTerm, 
                                                   @Param("status") AppointmentRequest.RequestStatus status, 
                                                   Pageable pageable);

    // Patient communication preferences
    @Query("SELECT ar FROM AppointmentRequest ar WHERE ar.patient.preferences.appointmentReminders = true AND ar.status = 'APPROVED'")
    List<AppointmentRequest> findRequestsForReminders();
    
    @Query("SELECT ar FROM AppointmentRequest ar WHERE ar.patient.preferences.smsNotifications = true AND ar.status = 'PENDING'")
    List<AppointmentRequest> findRequestsForSmsNotification();

    // Insurance and billing related
    @Query("SELECT ar FROM AppointmentRequest ar WHERE ar.insuranceInformation IS NOT NULL AND ar.status = 'APPROVED'")
    List<AppointmentRequest> findApprovedRequestsWithInsurance();

    // Emergency contact queries
    @Query("SELECT ar FROM AppointmentRequest ar WHERE ar.emergencyContactPhone IS NOT NULL AND ar.priority IN ('URGENT', 'EMERGENCY')")
    List<AppointmentRequest> findUrgentRequestsWithEmergencyContact();

    // Custom validation queries
    @Query("SELECT COUNT(ar) > 0 FROM AppointmentRequest ar WHERE ar.patient.id = :patientId AND ar.requestedProviderId = :providerId " +
           "AND ar.requestedDate = :requestedDate AND ar.status = 'PENDING'")
    boolean existsPendingRequestForDateTime(@Param("patientId") Long patientId, 
                                          @Param("providerId") Long providerId, 
                                          @Param("requestedDate") LocalDateTime requestedDate);

    // Batch operations for cleanup
    @Modifying
    @Transactional
    @Query("UPDATE AppointmentRequest ar SET ar.status = 'CANCELLED' WHERE ar.status = 'PENDING' AND ar.createdAt < :threshold")
    int cancelOldPendingRequests(@Param("threshold") LocalDateTime threshold);
    
    @Modifying
    @Transactional
    @Query("DELETE FROM AppointmentRequest ar WHERE ar.status IN ('COMPLETED', 'CANCELLED') AND ar.createdAt < :threshold")
    int deleteOldCompletedRequests(@Param("threshold") LocalDateTime threshold);
}
