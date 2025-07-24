package com.hospital.hms.servicediscovery.repository;

import com.hospital.hms.servicediscovery.entity.ServiceEventEntity;
import com.hospital.hms.servicediscovery.entity.ServiceRegistryEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Service Event Repository
 * 
 * Repository for managing service discovery events and audit trail.
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Repository
public interface ServiceEventRepository extends JpaRepository<ServiceEventEntity, String> {

    /**
     * Find events by service
     */
    List<ServiceEventEntity> findByServiceRegistryOrderByEventTimestampDesc(ServiceRegistryEntity serviceRegistry);

    /**
     * Find events by event type
     */
    List<ServiceEventEntity> findByEventTypeOrderByEventTimestampDesc(ServiceEventEntity.EventType eventType);

    /**
     * Find events by severity
     */
    List<ServiceEventEntity> findBySeverityOrderByEventTimestampDesc(String severity);

    /**
     * Find events in time range
     */
    @Query("SELECT e FROM ServiceEventEntity e WHERE e.eventTimestamp BETWEEN :startTime AND :endTime " +
           "ORDER BY e.eventTimestamp DESC")
    List<ServiceEventEntity> findEventsBetween(
            @Param("startTime") LocalDateTime startTime, 
            @Param("endTime") LocalDateTime endTime);

    /**
     * Find recent events
     */
    @Query("SELECT e FROM ServiceEventEntity e WHERE e.eventTimestamp > :threshold " +
           "ORDER BY e.eventTimestamp DESC")
    Page<ServiceEventEntity> findRecentEvents(@Param("threshold") LocalDateTime threshold, Pageable pageable);

    /**
     * Find events by multiple criteria
     */
    @Query("SELECT e FROM ServiceEventEntity e WHERE " +
           "(:eventType IS NULL OR e.eventType = :eventType) AND " +
           "(:severity IS NULL OR e.severity = :severity) AND " +
           "(:source IS NULL OR e.source = :source) AND " +
           "e.eventTimestamp BETWEEN :startTime AND :endTime " +
           "ORDER BY e.eventTimestamp DESC")
    Page<ServiceEventEntity> findEventsByCriteria(
            @Param("eventType") ServiceEventEntity.EventType eventType,
            @Param("severity") String severity,
            @Param("source") String source,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime,
            Pageable pageable);

    /**
     * Count events by type
     */
    @Query("SELECT e.eventType, COUNT(e) FROM ServiceEventEntity e GROUP BY e.eventType")
    List<Object[]> countEventsByType();

    /**
     * Count events by severity
     */
    @Query("SELECT e.severity, COUNT(e) FROM ServiceEventEntity e GROUP BY e.severity")
    List<Object[]> countEventsBySeverity();

    /**
     * Find error events
     */
    @Query("SELECT e FROM ServiceEventEntity e WHERE e.severity IN ('ERROR', 'CRITICAL') " +
           "ORDER BY e.eventTimestamp DESC")
    Page<ServiceEventEntity> findErrorEvents(Pageable pageable);

    /**
     * Find events by service name
     */
    @Query("SELECT e FROM ServiceEventEntity e JOIN e.serviceRegistry s " +
           "WHERE s.serviceName = :serviceName ORDER BY e.eventTimestamp DESC")
    List<ServiceEventEntity> findEventsByServiceName(@Param("serviceName") String serviceName);

    /**
     * Get event statistics
     */
    @Query("SELECT " +
           "COUNT(e) as totalEvents, " +
           "COUNT(CASE WHEN e.severity = 'ERROR' THEN 1 END) as errorEvents, " +
           "COUNT(CASE WHEN e.severity = 'WARNING' THEN 1 END) as warningEvents, " +
           "COUNT(CASE WHEN e.severity = 'INFO' THEN 1 END) as infoEvents " +
           "FROM ServiceEventEntity e WHERE e.eventTimestamp > :threshold")
    Object[] getEventStatistics(@Param("threshold") LocalDateTime threshold);

    /**
     * Delete old events
     */
    void deleteByEventTimestampBefore(LocalDateTime threshold);

    /**
     * Find frequent events
     */
    @Query("SELECT e.eventType, COUNT(e) as eventCount FROM ServiceEventEntity e " +
           "WHERE e.eventTimestamp > :threshold GROUP BY e.eventType " +
           "ORDER BY eventCount DESC")
    List<Object[]> findFrequentEvents(@Param("threshold") LocalDateTime threshold);
}
