package com.hospital.hms.hieintegration.repository;

import com.hospital.hms.hieintegration.entity.HieDataExchange;
import com.hospital.hms.hieintegration.entity.ExchangeStatus;
import com.hospital.hms.hieintegration.entity.ExchangeType;
import com.hospital.hms.hieintegration.entity.ExchangeDirection;
import com.hospital.hms.hieintegration.entity.ExchangePriority;
import com.hospital.hms.hieintegration.entity.DataFormat;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Repository interface for HieDataExchange entity operations
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Repository
public interface HieDataExchangeRepository extends JpaRepository<HieDataExchange, UUID> {

    /**
     * Find exchange by transaction ID
     */
    Optional<HieDataExchange> findByTransactionId(String transactionId);

    /**
     * Find exchanges by HIE ID
     */
    List<HieDataExchange> findByHieId(UUID hieId);

    /**
     * Find exchanges by HIE ID with pagination
     */
    Page<HieDataExchange> findByHieId(UUID hieId, Pageable pageable);

    /**
     * Find exchanges by patient ID
     */
    List<HieDataExchange> findByPatientId(String patientId);

    /**
     * Find exchanges by external patient ID
     */
    List<HieDataExchange> findByExternalPatientId(String externalPatientId);

    /**
     * Find exchanges by status
     */
    List<HieDataExchange> findByExchangeStatus(ExchangeStatus status);

    /**
     * Find exchanges by type
     */
    List<HieDataExchange> findByExchangeType(ExchangeType type);

    /**
     * Find exchanges by direction
     */
    List<HieDataExchange> findByExchangeDirection(ExchangeDirection direction);

    /**
     * Find exchanges by priority
     */
    List<HieDataExchange> findByPriority(ExchangePriority priority);

    /**
     * Find exchanges by data format
     */
    List<HieDataExchange> findByDataFormat(DataFormat dataFormat);

    /**
     * Find exchanges by HIE and status
     */
    List<HieDataExchange> findByHieIdAndExchangeStatus(UUID hieId, ExchangeStatus status);

    /**
     * Find exchanges by HIE and type
     */
    List<HieDataExchange> findByHieIdAndExchangeType(UUID hieId, ExchangeType type);

    /**
     * Find exchanges by patient and status
     */
    List<HieDataExchange> findByPatientIdAndExchangeStatus(String patientId, ExchangeStatus status);

    /**
     * Find exchanges by correlation ID
     */
    List<HieDataExchange> findByCorrelationId(String correlationId);

    /**
     * Find exchanges by source system
     */
    List<HieDataExchange> findBySourceSystem(String sourceSystem);

    /**
     * Find exchanges by target system
     */
    List<HieDataExchange> findByTargetSystem(String targetSystem);

    /**
     * Find exchanges within date range
     */
    @Query("SELECT e FROM HieDataExchange e WHERE e.exchangeDate >= :startDate AND e.exchangeDate <= :endDate")
    List<HieDataExchange> findByExchangeDateBetween(@Param("startDate") LocalDateTime startDate, 
                                                    @Param("endDate") LocalDateTime endDate);

    /**
     * Find exchanges created within date range
     */
    @Query("SELECT e FROM HieDataExchange e WHERE e.createdDate >= :startDate AND e.createdDate <= :endDate")
    List<HieDataExchange> findByCreatedDateBetween(@Param("startDate") LocalDateTime startDate, 
                                                  @Param("endDate") LocalDateTime endDate);

    /**
     * Find pending exchanges older than specified minutes
     */
    @Query("SELECT e FROM HieDataExchange e WHERE e.exchangeStatus = 'PENDING' AND e.createdDate <= :cutoffTime")
    List<HieDataExchange> findPendingExchangesOlderThan(@Param("cutoffTime") LocalDateTime cutoffTime);

    /**
     * Find failed exchanges eligible for retry
     */
    @Query("SELECT e FROM HieDataExchange e WHERE " +
           "e.exchangeStatus = 'FAILED' AND " +
           "e.retryCount < e.maxRetries AND " +
           "(e.nextRetryDate IS NULL OR e.nextRetryDate <= CURRENT_TIMESTAMP)")
    List<HieDataExchange> findFailedExchangesForRetry();

    /**
     * Find exchanges with response time above threshold
     */
    @Query("SELECT e FROM HieDataExchange e WHERE e.responseTimeMs > :threshold")
    List<HieDataExchange> findSlowExchanges(@Param("threshold") Long threshold);

    /**
     * Find exchanges by message type
     */
    List<HieDataExchange> findByMessageType(String messageType);

    /**
     * Find exchanges by resource type
     */
    List<HieDataExchange> findByResourceType(String resourceType);

    /**
     * Find exchanges with errors
     */
    @Query("SELECT e FROM HieDataExchange e WHERE e.errorMessage IS NOT NULL OR e.errorCode IS NOT NULL")
    List<HieDataExchange> findExchangesWithErrors();

    /**
     * Find exchanges by error code
     */
    List<HieDataExchange> findByErrorCode(String errorCode);

    /**
     * Count exchanges by status
     */
    long countByExchangeStatus(ExchangeStatus status);

    /**
     * Count exchanges by HIE and status
     */
    long countByHieIdAndExchangeStatus(UUID hieId, ExchangeStatus status);

    /**
     * Count exchanges by type
     */
    long countByExchangeType(ExchangeType type);

    /**
     * Count exchanges by priority
     */
    long countByPriority(ExchangePriority priority);

    /**
     * Get exchange statistics by status
     */
    @Query("SELECT COUNT(e), e.exchangeStatus FROM HieDataExchange e GROUP BY e.exchangeStatus")
    List<Object[]> getExchangeStatisticsByStatus();

    /**
     * Get exchange statistics by type
     */
    @Query("SELECT COUNT(e), e.exchangeType FROM HieDataExchange e GROUP BY e.exchangeType")
    List<Object[]> getExchangeStatisticsByType();

    /**
     * Get exchange statistics by HIE
     */
    @Query("SELECT COUNT(e), e.hie.hieName FROM HieDataExchange e GROUP BY e.hie.hieName")
    List<Object[]> getExchangeStatisticsByHie();

    /**
     * Get daily exchange volume
     */
    @Query("SELECT DATE(e.exchangeDate), COUNT(e) FROM HieDataExchange e " +
           "WHERE e.exchangeDate >= :startDate " +
           "GROUP BY DATE(e.exchangeDate) " +
           "ORDER BY DATE(e.exchangeDate)")
    List<Object[]> getDailyExchangeVolume(@Param("startDate") LocalDateTime startDate);

    /**
     * Get average response time by HIE
     */
    @Query("SELECT e.hie.hieName, AVG(e.responseTimeMs) FROM HieDataExchange e " +
           "WHERE e.responseTimeMs IS NOT NULL " +
           "GROUP BY e.hie.hieName")
    List<Object[]> getAverageResponseTimeByHie();

    /**
     * Get success rate by HIE
     */
    @Query("SELECT e.hie.hieName, " +
           "SUM(CASE WHEN e.exchangeStatus = 'COMPLETED' THEN 1 ELSE 0 END) * 100.0 / COUNT(e) " +
           "FROM HieDataExchange e " +
           "GROUP BY e.hie.hieName")
    List<Object[]> getSuccessRateByHie();

    /**
     * Find exchanges requiring cleanup (expired)
     */
    @Query("SELECT e FROM HieDataExchange e WHERE e.expiryDate IS NOT NULL AND e.expiryDate <= CURRENT_TIMESTAMP")
    List<HieDataExchange> findExpiredExchanges();

    /**
     * Find exchanges by tags (contains)
     */
    @Query("SELECT e FROM HieDataExchange e WHERE e.tags LIKE %:tag%")
    List<HieDataExchange> findByTagsContaining(@Param("tag") String tag);

    /**
     * Search exchanges by patient or transaction ID
     */
    @Query("SELECT e FROM HieDataExchange e WHERE " +
           "e.patientId LIKE %:searchTerm% OR " +
           "e.externalPatientId LIKE %:searchTerm% OR " +
           "e.transactionId LIKE %:searchTerm%")
    Page<HieDataExchange> searchByPatientOrTransactionId(@Param("searchTerm") String searchTerm, Pageable pageable);

    /**
     * Find recent exchanges for HIE
     */
    @Query("SELECT e FROM HieDataExchange e WHERE e.hie.id = :hieId AND e.exchangeDate >= :since ORDER BY e.exchangeDate DESC")
    List<HieDataExchange> findRecentExchangesForHie(@Param("hieId") UUID hieId, @Param("since") LocalDateTime since);

    /**
     * Update exchange status
     */
    @Query("UPDATE HieDataExchange e SET " +
           "e.exchangeStatus = :status, " +
           "e.completedDate = :completedDate " +
           "WHERE e.id = :exchangeId")
    int updateExchangeStatus(@Param("exchangeId") UUID exchangeId, 
                           @Param("status") ExchangeStatus status,
                           @Param("completedDate") LocalDateTime completedDate);

    /**
     * Update exchange error information
     */
    @Query("UPDATE HieDataExchange e SET " +
           "e.exchangeStatus = 'FAILED', " +
           "e.errorMessage = :errorMessage, " +
           "e.errorCode = :errorCode, " +
           "e.completedDate = CURRENT_TIMESTAMP " +
           "WHERE e.id = :exchangeId")
    int updateExchangeError(@Param("exchangeId") UUID exchangeId,
                          @Param("errorMessage") String errorMessage,
                          @Param("errorCode") String errorCode);

    /**
     * Increment retry count
     */
    @Query("UPDATE HieDataExchange e SET " +
           "e.retryCount = e.retryCount + 1, " +
           "e.nextRetryDate = :nextRetryDate " +
           "WHERE e.id = :exchangeId")
    int incrementRetryCount(@Param("exchangeId") UUID exchangeId, @Param("nextRetryDate") LocalDateTime nextRetryDate);

    /**
     * Update response metrics
     */
    @Query("UPDATE HieDataExchange e SET " +
           "e.responseTimeMs = :responseTimeMs, " +
           "e.fileSizeBytes = :fileSizeBytes, " +
           "e.recordsCount = :recordsCount " +
           "WHERE e.id = :exchangeId")
    int updateResponseMetrics(@Param("exchangeId") UUID exchangeId,
                            @Param("responseTimeMs") Long responseTimeMs,
                            @Param("fileSizeBytes") Long fileSizeBytes,
                            @Param("recordsCount") Integer recordsCount);

    /**
     * Check if transaction ID exists
     */
    boolean existsByTransactionId(String transactionId);

    /**
     * Delete expired exchanges
     */
    @Query("DELETE FROM HieDataExchange e WHERE e.expiryDate IS NOT NULL AND e.expiryDate <= :cutoffDate")
    int deleteExpiredExchanges(@Param("cutoffDate") LocalDateTime cutoffDate);
}