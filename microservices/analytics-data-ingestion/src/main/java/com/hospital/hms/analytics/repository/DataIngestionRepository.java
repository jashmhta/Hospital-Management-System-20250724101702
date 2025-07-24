package com.hospital.hms.analytics.repository;

import com.hospital.hms.analytics.entity.DataIngestionEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Data Ingestion Repository
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Repository
public interface DataIngestionRepository extends JpaRepository<DataIngestionEntity, String> {

    /**
     * Find by batch ID
     */
    List<DataIngestionEntity> findByBatchIdOrderByIngestionTimeAsc(String batchId);

    /**
     * Find by status
     */
    List<DataIngestionEntity> findByStatusOrderByIngestionTimeAsc(String status);

    /**
     * Find by source system
     */
    List<DataIngestionEntity> findBySourceSystemOrderByIngestionTimeDesc(String sourceSystem);

    /**
     * Find by correlation ID
     */
    Optional<DataIngestionEntity> findByCorrelationId(String correlationId);

    /**
     * Find by ingestion time range
     */
    @Query("SELECT di FROM DataIngestionEntity di WHERE " +
           "di.ingestionTime BETWEEN :startTime AND :endTime " +
           "ORDER BY di.ingestionTime DESC")
    List<DataIngestionEntity> findByIngestionTimeBetween(
        @Param("startTime") LocalDateTime startTime,
        @Param("endTime") LocalDateTime endTime
    );

    /**
     * Find failed ingestions
     */
    @Query("SELECT di FROM DataIngestionEntity di WHERE " +
           "di.status = 'FAILED' AND di.retryCount < 3 " +
           "ORDER BY di.ingestionTime ASC")
    List<DataIngestionEntity> findFailedIngestions();

    /**
     * Find pending ingestions by priority
     */
    @Query("SELECT di FROM DataIngestionEntity di WHERE " +
           "di.status = 'PENDING' " +
           "ORDER BY di.priority ASC, di.ingestionTime ASC")
    List<DataIngestionEntity> findPendingIngestionsByPriority();

    /**
     * Find processing ingestions
     */
    List<DataIngestionEntity> findByStatusAndProcessedAtIsNull(String status);

    /**
     * Find long-running ingestions
     */
    @Query("SELECT di FROM DataIngestionEntity di WHERE " +
           "di.status = 'PROCESSING' AND " +
           "di.processedAt IS NULL AND " +
           "di.ingestionTime < :threshold")
    List<DataIngestionEntity> findLongRunningIngestions(@Param("threshold") LocalDateTime threshold);

    /**
     * Count by status
     */
    long countByStatus(String status);

    /**
     * Count by source system and date range
     */
    @Query("SELECT COUNT(di) FROM DataIngestionEntity di WHERE " +
           "di.sourceSystem = :sourceSystem AND " +
           "di.ingestionTime BETWEEN :startDate AND :endDate")
    long countBySourceSystemAndDateRange(
        @Param("sourceSystem") String sourceSystem,
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );

    /**
     * Get ingestion statistics by source system
     */
    @Query("SELECT di.sourceSystem, di.status, COUNT(di), AVG(di.actualProcessingTime) " +
           "FROM DataIngestionEntity di WHERE " +
           "di.ingestionTime BETWEEN :startDate AND :endDate " +
           "GROUP BY di.sourceSystem, di.status " +
           "ORDER BY di.sourceSystem")
    List<Object[]> getIngestionStatisticsBySourceSystem(
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );

    /**
     * Find by status and batch ID
     */
    List<DataIngestionEntity> findByStatusAndBatchId(String status, String batchId);

    /**
     * Get average processing time by source system
     */
    @Query("SELECT di.sourceSystem, AVG(di.actualProcessingTime) " +
           "FROM DataIngestionEntity di WHERE " +
           "di.actualProcessingTime IS NOT NULL AND " +
           "di.ingestionTime BETWEEN :startDate AND :endDate " +
           "GROUP BY di.sourceSystem")
    List<Object[]> getAverageProcessingTimeBySourceSystem(
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );

    /**
     * Find ingestions with high retry count
     */
    @Query("SELECT di FROM DataIngestionEntity di WHERE " +
           "di.retryCount >= :minRetryCount " +
           "ORDER BY di.retryCount DESC, di.ingestionTime DESC")
    List<DataIngestionEntity> findIngestionsWithHighRetryCount(@Param("minRetryCount") Integer minRetryCount);

    /**
     * Find ingestions by priority range
     */
    @Query("SELECT di FROM DataIngestionEntity di WHERE " +
           "di.priority BETWEEN :minPriority AND :maxPriority " +
           "ORDER BY di.priority ASC, di.ingestionTime ASC")
    List<DataIngestionEntity> findByPriorityRange(
        @Param("minPriority") Integer minPriority,
        @Param("maxPriority") Integer maxPriority
    );

    /**
     * Search ingestions with multiple criteria
     */
    @Query("SELECT di FROM DataIngestionEntity di WHERE " +
           "(:batchId IS NULL OR di.batchId = :batchId) AND " +
           "(:sourceSystem IS NULL OR di.sourceSystem = :sourceSystem) AND " +
           "(:status IS NULL OR di.status = :status) AND " +
           "(:correlationId IS NULL OR di.correlationId = :correlationId) AND " +
           "(:startDate IS NULL OR di.ingestionTime >= :startDate) AND " +
           "(:endDate IS NULL OR di.ingestionTime <= :endDate) " +
           "ORDER BY di.ingestionTime DESC")
    Page<DataIngestionEntity> searchIngestions(
        @Param("batchId") String batchId,
        @Param("sourceSystem") String sourceSystem,
        @Param("status") String status,
        @Param("correlationId") String correlationId,
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate,
        Pageable pageable
    );

    /**
     * Get daily ingestion volume
     */
    @Query("SELECT DATE(di.ingestionTime), COUNT(di), SUM(di.recordCount) " +
           "FROM DataIngestionEntity di WHERE " +
           "di.ingestionTime BETWEEN :startDate AND :endDate " +
           "GROUP BY DATE(di.ingestionTime) " +
           "ORDER BY DATE(di.ingestionTime)")
    List<Object[]> getDailyIngestionVolume(
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );

    /**
     * Find recent ingestions for monitoring
     */
    @Query("SELECT di FROM DataIngestionEntity di WHERE " +
           "di.ingestionTime >= :since " +
           "ORDER BY di.ingestionTime DESC")
    Page<DataIngestionEntity> findRecentIngestions(@Param("since") LocalDateTime since, Pageable pageable);

    /**
     * Get processing performance metrics
     */
    @Query("SELECT " +
           "AVG(di.actualProcessingTime) as avgProcessingTime, " +
           "MIN(di.actualProcessingTime) as minProcessingTime, " +
           "MAX(di.actualProcessingTime) as maxProcessingTime, " +
           "COUNT(di) as totalIngestions " +
           "FROM DataIngestionEntity di WHERE " +
           "di.status = 'COMPLETED' AND " +
           "di.ingestionTime BETWEEN :startDate AND :endDate")
    Object[] getProcessingPerformanceMetrics(
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );

    /**
     * Find ingestions ready for cleanup
     */
    @Query("SELECT di FROM DataIngestionEntity di WHERE " +
           "di.status IN ('COMPLETED', 'FAILED') AND " +
           "di.processedAt < :cleanupThreshold " +
           "ORDER BY di.processedAt ASC")
    List<DataIngestionEntity> findIngestionsReadyForCleanup(@Param("cleanupThreshold") LocalDateTime cleanupThreshold);
}
