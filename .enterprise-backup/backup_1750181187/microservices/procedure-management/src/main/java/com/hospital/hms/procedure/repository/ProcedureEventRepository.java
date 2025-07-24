package com.hospital.hms.procedure.repository;

import com.hospital.hms.procedure.entity.ProcedureEventEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Procedure Event Repository
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Repository
public interface ProcedureEventRepository extends JpaRepository<ProcedureEventEntity, String> {

    /**
     * Find events by procedure ID
     */
    List<ProcedureEventEntity> findByProcedure_ProcedureIdOrderByEventTimeDesc(String procedureId);

    /**
     * Find events by event type
     */
    List<ProcedureEventEntity> findByEventTypeOrderByEventTimeDesc(ProcedureEventEntity.EventType eventType);

    /**
     * Find events by performed by (staff member)
     */
    List<ProcedureEventEntity> findByPerformedByOrderByEventTimeDesc(String performedBy);

    /**
     * Find events by date range
     */
    @Query("SELECT pe FROM ProcedureEventEntity pe WHERE " +
           "pe.eventTime BETWEEN :startTime AND :endTime " +
           "ORDER BY pe.eventTime DESC")
    List<ProcedureEventEntity> findByEventTimeBetween(
        @Param("startTime") LocalDateTime startTime,
        @Param("endTime") LocalDateTime endTime
    );

    /**
     * Find critical events (complications, emergencies)
     */
    @Query("SELECT pe FROM ProcedureEventEntity pe WHERE " +
           "pe.eventType IN ('COMPLICATION', 'EMERGENCY') OR " +
           "pe.severity IN ('HIGH', 'CRITICAL') " +
           "ORDER BY pe.eventTime DESC")
    List<ProcedureEventEntity> findCriticalEvents();

    /**
     * Find events requiring follow-up
     */
    @Query("SELECT pe FROM ProcedureEventEntity pe WHERE " +
           "pe.nextActionRequired IS NOT NULL AND " +
           "pe.nextActionRequired != '' " +
           "ORDER BY pe.eventTime DESC")
    List<ProcedureEventEntity> findEventsRequiringFollowUp();

    /**
     * Find events by procedure and event types
     */
    @Query("SELECT pe FROM ProcedureEventEntity pe WHERE " +
           "pe.procedure.procedureId = :procedureId AND " +
           "pe.eventType IN :eventTypes " +
           "ORDER BY pe.eventTime ASC")
    List<ProcedureEventEntity> findByProcedureAndEventTypes(
        @Param("procedureId") String procedureId,
        @Param("eventTypes") List<ProcedureEventEntity.EventType> eventTypes
    );

    /**
     * Find latest event by procedure and type
     */
    @Query("SELECT pe FROM ProcedureEventEntity pe WHERE " +
           "pe.procedure.procedureId = :procedureId AND " +
           "pe.eventType = :eventType " +
           "ORDER BY pe.eventTime DESC")
    Page<ProcedureEventEntity> findLatestEventByProcedureAndType(
        @Param("procedureId") String procedureId,
        @Param("eventType") ProcedureEventEntity.EventType eventType,
        Pageable pageable
    );

    /**
     * Count events by type for a procedure
     */
    long countByProcedure_ProcedureIdAndEventType(String procedureId, ProcedureEventEntity.EventType eventType);

    /**
     * Find events with complications
     */
    @Query("SELECT pe FROM ProcedureEventEntity pe WHERE " +
           "pe.complicationsNoted IS NOT NULL AND " +
           "pe.complicationsNoted != '' " +
           "ORDER BY pe.eventTime DESC")
    List<ProcedureEventEntity> findEventsWithComplications();

    /**
     * Find events by severity level
     */
    List<ProcedureEventEntity> findBySeverityOrderByEventTimeDesc(String severity);

    /**
     * Find events by location
     */
    List<ProcedureEventEntity> findByLocationOrderByEventTimeDesc(String location);

    /**
     * Get event statistics by type
     */
    @Query("SELECT pe.eventType, COUNT(pe) FROM ProcedureEventEntity pe WHERE " +
           "pe.eventTime BETWEEN :startDate AND :endDate " +
           "GROUP BY pe.eventType " +
           "ORDER BY COUNT(pe) DESC")
    List<Object[]> getEventStatisticsByType(
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );

    /**
     * Find events without notifications sent
     */
    @Query("SELECT pe FROM ProcedureEventEntity pe WHERE " +
           "pe.notificationSent = false AND " +
           "pe.severity IN ('HIGH', 'CRITICAL') " +
           "ORDER BY pe.eventTime ASC")
    List<ProcedureEventEntity> findEventsWithoutNotifications();

    /**
     * Find procedure timeline events
     */
    @Query("SELECT pe FROM ProcedureEventEntity pe WHERE " +
           "pe.procedure.procedureId = :procedureId " +
           "ORDER BY pe.eventTime ASC")
    List<ProcedureEventEntity> findProcedureTimeline(@Param("procedureId") String procedureId);

    /**
     * Get average event duration by type
     */
    @Query("SELECT pe.eventType, AVG(TIMESTAMPDIFF(MINUTE, LAG(pe.eventTime) OVER (PARTITION BY pe.procedure.procedureId ORDER BY pe.eventTime), pe.eventTime)) " +
           "FROM ProcedureEventEntity pe " +
           "GROUP BY pe.eventType")
    List<Object[]> getAverageEventDurationByType();

    /**
     * Find recent events for dashboard
     */
    @Query("SELECT pe FROM ProcedureEventEntity pe WHERE " +
           "pe.eventTime >= :since " +
           "ORDER BY pe.eventTime DESC")
    Page<ProcedureEventEntity> findRecentEvents(@Param("since") LocalDateTime since, Pageable pageable);
}
