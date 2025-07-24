package com.hospital.hms.procedure.repository;

import com.hospital.hms.procedure.entity.ProcedureEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Procedure Repository
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Repository
public interface ProcedureRepository extends JpaRepository<ProcedureEntity, String> {

    /**
     * Find procedures by patient ID
     */
    List<ProcedureEntity> findByPatientIdOrderByScheduledDateTimeDesc(String patientId);

    /**
     * Find procedures by status
     */
    List<ProcedureEntity> findByStatusOrderByScheduledDateTimeAsc(ProcedureEntity.ProcedureStatus status);

    /**
     * Find procedures by date range
     */
    @Query("SELECT p FROM ProcedureEntity p WHERE p.scheduledDateTime BETWEEN :startDate AND :endDate ORDER BY p.scheduledDateTime ASC")
    List<ProcedureEntity> findByScheduledDateTimeBetween(
        @Param("startDate") LocalDateTime startDate, 
        @Param("endDate") LocalDateTime endDate
    );

    /**
     * Find procedures by department and date
     */
    @Query("SELECT p FROM ProcedureEntity p WHERE p.department = :department AND DATE(p.scheduledDateTime) = :date ORDER BY p.scheduledDateTime ASC")
    List<ProcedureEntity> findByDepartmentAndDate(
        @Param("department") String department, 
        @Param("date") LocalDate date
    );

    /**
     * Find procedures by room and date range
     */
    @Query("SELECT p FROM ProcedureEntity p WHERE p.assignedRoom = :room AND p.scheduledDateTime BETWEEN :startDateTime AND :endDateTime ORDER BY p.scheduledDateTime ASC")
    List<ProcedureEntity> findByAssignedRoomAndScheduledDateTimeBetween(
        @Param("room") String room,
        @Param("startDateTime") LocalDateTime startDateTime,
        @Param("endDateTime") LocalDateTime endDateTime
    );

    /**
     * Find procedures by primary physician
     */
    List<ProcedureEntity> findByPrimaryPhysicianOrderByScheduledDateTimeAsc(String primaryPhysician);

    /**
     * Find urgent procedures
     */
    @Query("SELECT p FROM ProcedureEntity p WHERE p.urgent = true AND p.status IN :statuses ORDER BY p.priority ASC, p.scheduledDateTime ASC")
    List<ProcedureEntity> findUrgentProceduresByStatus(@Param("statuses") List<ProcedureEntity.ProcedureStatus> statuses);

    /**
     * Find procedures by priority
     */
    List<ProcedureEntity> findByPriorityOrderByScheduledDateTimeAsc(ProcedureEntity.ProcedurePriority priority);

    /**
     * Find procedures by procedure type
     */
    Page<ProcedureEntity> findByProcedureTypeOrderByScheduledDateTimeDesc(String procedureType, Pageable pageable);

    /**
     * Find overdue procedures
     */
    @Query("SELECT p FROM ProcedureEntity p WHERE p.scheduledDateTime < :currentTime AND p.status IN ('SCHEDULED', 'CONFIRMED', 'WAITING') ORDER BY p.scheduledDateTime ASC")
    List<ProcedureEntity> findOverdueProcedures(@Param("currentTime") LocalDateTime currentTime);

    /**
     * Find procedures scheduled for today
     */
    @Query("SELECT p FROM ProcedureEntity p WHERE DATE(p.scheduledDateTime) = CURRENT_DATE ORDER BY p.scheduledDateTime ASC")
    List<ProcedureEntity> findTodaysProcedures();

    /**
     * Count procedures by status
     */
    long countByStatus(ProcedureEntity.ProcedureStatus status);

    /**
     * Count procedures by department and date range
     */
    @Query("SELECT COUNT(p) FROM ProcedureEntity p WHERE p.department = :department AND p.scheduledDateTime BETWEEN :startDate AND :endDate")
    long countByDepartmentAndDateRange(
        @Param("department") String department,
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );

    /**
     * Find procedures with conflicts in room scheduling
     */
    @Query("SELECT p FROM ProcedureEntity p WHERE p.assignedRoom = :room AND p.status IN ('SCHEDULED', 'CONFIRMED', 'IN_PROGRESS') AND " +
           "((p.scheduledDateTime BETWEEN :startTime AND :endTime) OR " +
           "(p.actualStartTime BETWEEN :startTime AND :endTime) OR " +
           "(p.scheduledDateTime <= :startTime AND COALESCE(p.actualEndTime, DATEADD('MINUTE', p.estimatedDurationMinutes, p.scheduledDateTime)) >= :endTime))")
    List<ProcedureEntity> findConflictingProcedures(
        @Param("room") String room,
        @Param("startTime") LocalDateTime startTime,
        @Param("endTime") LocalDateTime endTime
    );

    /**
     * Search procedures by multiple criteria
     */
    @Query("SELECT p FROM ProcedureEntity p WHERE " +
           "(:patientId IS NULL OR p.patientId = :patientId) AND " +
           "(:procedureType IS NULL OR p.procedureType = :procedureType) AND " +
           "(:status IS NULL OR p.status = :status) AND " +
           "(:department IS NULL OR p.department = :department) AND " +
           "(:primaryPhysician IS NULL OR p.primaryPhysician = :primaryPhysician) AND " +
           "(:startDate IS NULL OR p.scheduledDateTime >= :startDate) AND " +
           "(:endDate IS NULL OR p.scheduledDateTime <= :endDate) " +
           "ORDER BY p.scheduledDateTime ASC")
    Page<ProcedureEntity> searchProcedures(
        @Param("patientId") String patientId,
        @Param("procedureType") String procedureType,
        @Param("status") ProcedureEntity.ProcedureStatus status,
        @Param("department") String department,
        @Param("primaryPhysician") String primaryPhysician,
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate,
        Pageable pageable
    );

    /**
     * Find procedures requiring follow-up
     */
    @Query("SELECT p FROM ProcedureEntity p WHERE p.status = 'COMPLETED' AND p.postProcedureNotes IS NOT NULL AND p.actualEndTime >= :since ORDER BY p.actualEndTime DESC")
    List<ProcedureEntity> findProceduresRequiringFollowUp(@Param("since") LocalDateTime since);

    /**
     * Get procedure statistics by department
     */
    @Query("SELECT p.department, COUNT(p), AVG(p.actualDurationMinutes) FROM ProcedureEntity p WHERE p.scheduledDateTime BETWEEN :startDate AND :endDate GROUP BY p.department")
    List<Object[]> getProcedureStatisticsByDepartment(
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );

    /**
     * Find procedures by workflow ID
     */
    Optional<ProcedureEntity> findByWorkflowId(String workflowId);

    /**
     * Find procedures without consent
     */
    @Query("SELECT p FROM ProcedureEntity p WHERE p.consentObtained = false AND p.status IN ('SCHEDULED', 'CONFIRMED') AND p.scheduledDateTime <= :upcomingTime ORDER BY p.scheduledDateTime ASC")
    List<ProcedureEntity> findProceduresWithoutConsent(@Param("upcomingTime") LocalDateTime upcomingTime);

    /**
     * Get average duration by procedure type
     */
    @Query("SELECT p.procedureType, AVG(p.actualDurationMinutes) FROM ProcedureEntity p WHERE p.actualDurationMinutes IS NOT NULL GROUP BY p.procedureType")
    List<Object[]> getAverageDurationByProcedureType();
}
