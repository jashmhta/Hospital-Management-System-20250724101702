package com.hospital.hms.hieintegration.repository;

import com.hospital.hms.hieintegration.entity.HieConnection;
import com.hospital.hms.hieintegration.entity.ConnectionStatus;
import com.hospital.hms.hieintegration.entity.EndpointType;
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
 * Repository interface for HieConnection entity operations
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Repository
public interface HieConnectionRepository extends JpaRepository<HieConnection, UUID> {

    /**
     * Find connections by HIE ID
     */
    List<HieConnection> findByHieId(UUID hieId);

    /**
     * Find connections by HIE ID with pagination
     */
    Page<HieConnection> findByHieId(UUID hieId, Pageable pageable);

    /**
     * Find connections by endpoint type
     */
    List<HieConnection> findByEndpointType(EndpointType endpointType);

    /**
     * Find connections by connection status
     */
    List<HieConnection> findByConnectionStatus(ConnectionStatus connectionStatus);

    /**
     * Find connections by HIE and endpoint type
     */
    List<HieConnection> findByHieIdAndEndpointType(UUID hieId, EndpointType endpointType);

    /**
     * Find connections by HIE and status
     */
    List<HieConnection> findByHieIdAndConnectionStatus(UUID hieId, ConnectionStatus connectionStatus);

    /**
     * Find connections by endpoint URL
     */
    Optional<HieConnection> findByEndpointUrl(String endpointUrl);

    /**
     * Find successful connections
     */
    List<HieConnection> findBySuccess(Boolean success);

    /**
     * Find connections with response time above threshold
     */
    @Query("SELECT c FROM HieConnection c WHERE c.responseTimeMs > :threshold")
    List<HieConnection> findSlowConnections(@Param("threshold") Long threshold);

    /**
     * Find connections within date range
     */
    @Query("SELECT c FROM HieConnection c WHERE c.testDate >= :startDate AND c.testDate <= :endDate")
    List<HieConnection> findByTestDateBetween(@Param("startDate") LocalDateTime startDate, 
                                            @Param("endDate") LocalDateTime endDate);

    /**
     * Find latest connection test for HIE and endpoint type
     */
    @Query("SELECT c FROM HieConnection c WHERE c.hie.id = :hieId AND c.endpointType = :endpointType " +
           "ORDER BY c.testDate DESC")
    List<HieConnection> findLatestConnectionTestByHieAndEndpoint(@Param("hieId") UUID hieId, 
                                                               @Param("endpointType") EndpointType endpointType,
                                                               Pageable pageable);

    /**
     * Find latest connection test for HIE
     */
    @Query("SELECT c FROM HieConnection c WHERE c.hie.id = :hieId ORDER BY c.testDate DESC")
    List<HieConnection> findLatestConnectionTestsByHie(@Param("hieId") UUID hieId, Pageable pageable);

    /**
     * Find connections with SSL certificate issues
     */
    List<HieConnection> findBySslCertificateValid(Boolean sslCertificateValid);

    /**
     * Find connections with SSL certificates expiring soon
     */
    @Query("SELECT c FROM HieConnection c WHERE c.sslCertificateExpiry IS NOT NULL AND c.sslCertificateExpiry <= :expiryThreshold")
    List<HieConnection> findConnectionsWithExpiringSslCertificates(@Param("expiryThreshold") LocalDateTime expiryThreshold);

    /**
     * Find connections with authentication failures
     */
    List<HieConnection> findByAuthenticationSuccessful(Boolean authenticationSuccessful);

    /**
     * Find connections that returned data
     */
    List<HieConnection> findByDataReturned(Boolean dataReturned);

    /**
     * Find connections by status code
     */
    List<HieConnection> findByStatusCode(Integer statusCode);

    /**
     * Find connections with errors
     */
    @Query("SELECT c FROM HieConnection c WHERE c.errorMessage IS NOT NULL")
    List<HieConnection> findConnectionsWithErrors();

    /**
     * Find connections created by user
     */
    List<HieConnection> findByCreatedBy(String createdBy);

    /**
     * Find connections created within date range
     */
    @Query("SELECT c FROM HieConnection c WHERE c.createdDate >= :startDate AND c.createdDate <= :endDate")
    List<HieConnection> findByCreatedDateBetween(@Param("startDate") LocalDateTime startDate, 
                                               @Param("endDate") LocalDateTime endDate);

    /**
     * Count connections by status
     */
    long countByConnectionStatus(ConnectionStatus connectionStatus);

    /**
     * Count connections by HIE and status
     */
    long countByHieIdAndConnectionStatus(UUID hieId, ConnectionStatus connectionStatus);

    /**
     * Count successful connections for HIE
     */
    long countByHieIdAndSuccess(UUID hieId, Boolean success);

    /**
     * Count connections by endpoint type
     */
    long countByEndpointType(EndpointType endpointType);

    /**
     * Get connection statistics by status
     */
    @Query("SELECT COUNT(c), c.connectionStatus FROM HieConnection c GROUP BY c.connectionStatus")
    List<Object[]> getConnectionStatisticsByStatus();

    /**
     * Get connection statistics by endpoint type
     */
    @Query("SELECT COUNT(c), c.endpointType FROM HieConnection c GROUP BY c.endpointType")
    List<Object[]> getConnectionStatisticsByEndpointType();

    /**
     * Get connection statistics by HIE
     */
    @Query("SELECT COUNT(c), c.hie.hieName FROM HieConnection c GROUP BY c.hie.hieName")
    List<Object[]> getConnectionStatisticsByHie();

    /**
     * Get average response time by HIE
     */
    @Query("SELECT c.hie.hieName, AVG(c.responseTimeMs) FROM HieConnection c " +
           "WHERE c.responseTimeMs IS NOT NULL " +
           "GROUP BY c.hie.hieName")
    List<Object[]> getAverageResponseTimeByHie();

    /**
     * Get average response time by endpoint type
     */
    @Query("SELECT c.endpointType, AVG(c.responseTimeMs) FROM HieConnection c " +
           "WHERE c.responseTimeMs IS NOT NULL " +
           "GROUP BY c.endpointType")
    List<Object[]> getAverageResponseTimeByEndpointType();

    /**
     * Get success rate by HIE
     */
    @Query("SELECT c.hie.hieName, " +
           "SUM(CASE WHEN c.success = true THEN 1 ELSE 0 END) * 100.0 / COUNT(c) " +
           "FROM HieConnection c " +
           "GROUP BY c.hie.hieName")
    List<Object[]> getSuccessRateByHie();

    /**
     * Get success rate by endpoint type
     */
    @Query("SELECT c.endpointType, " +
           "SUM(CASE WHEN c.success = true THEN 1 ELSE 0 END) * 100.0 / COUNT(c) " +
           "FROM HieConnection c " +
           "GROUP BY c.endpointType")
    List<Object[]> getSuccessRateByEndpointType();

    /**
     * Get daily connection test volume
     */
    @Query("SELECT DATE(c.testDate), COUNT(c) FROM HieConnection c " +
           "WHERE c.testDate >= :startDate " +
           "GROUP BY DATE(c.testDate) " +
           "ORDER BY DATE(c.testDate)")
    List<Object[]> getDailyConnectionTestVolume(@Param("startDate") LocalDateTime startDate);

    /**
     * Find recent connection tests for HIE
     */
    @Query("SELECT c FROM HieConnection c WHERE c.hie.id = :hieId AND c.testDate >= :since ORDER BY c.testDate DESC")
    List<HieConnection> findRecentConnectionTestsForHie(@Param("hieId") UUID hieId, @Param("since") LocalDateTime since);

    /**
     * Find connection history for specific endpoint
     */
    @Query("SELECT c FROM HieConnection c WHERE c.endpointUrl = :endpointUrl ORDER BY c.testDate DESC")
    List<HieConnection> findConnectionHistoryForEndpoint(@Param("endpointUrl") String endpointUrl);

    /**
     * Find connection tests with high response times
     */
    @Query("SELECT c FROM HieConnection c WHERE c.responseTimeMs > :threshold ORDER BY c.responseTimeMs DESC")
    List<HieConnection> findHighResponseTimeConnections(@Param("threshold") Long threshold);

    /**
     * Find unique endpoint URLs for HIE
     */
    @Query("SELECT DISTINCT c.endpointUrl FROM HieConnection c WHERE c.hie.id = :hieId")
    List<String> findUniqueEndpointUrlsForHie(@Param("hieId") UUID hieId);

    /**
     * Check if endpoint URL exists
     */
    boolean existsByEndpointUrl(String endpointUrl);

    /**
     * Find connections needing cleanup (older than retention period)
     */
    @Query("SELECT c FROM HieConnection c WHERE c.createdDate <= :retentionCutoff")
    List<HieConnection> findConnectionsForCleanup(@Param("retentionCutoff") LocalDateTime retentionCutoff);

    /**
     * Delete old connection records
     */
    @Query("DELETE FROM HieConnection c WHERE c.createdDate <= :cutoffDate")
    int deleteOldConnections(@Param("cutoffDate") LocalDateTime cutoffDate);

    /**
     * Get uptime percentage for HIE in time period
     */
    @Query("SELECT " +
           "SUM(CASE WHEN c.connectionStatus = 'CONNECTED' THEN 1 ELSE 0 END) * 100.0 / COUNT(c) " +
           "FROM HieConnection c " +
           "WHERE c.hie.id = :hieId AND c.testDate >= :startDate AND c.testDate <= :endDate")
    Double getUptimePercentageForHie(@Param("hieId") UUID hieId, 
                                   @Param("startDate") LocalDateTime startDate,
                                   @Param("endDate") LocalDateTime endDate);

    /**
     * Get latest connection status for HIE
     */
    @Query("SELECT c.connectionStatus FROM HieConnection c " +
           "WHERE c.hie.id = :hieId " +
           "ORDER BY c.testDate DESC " +
           "LIMIT 1")
    Optional<ConnectionStatus> getLatestConnectionStatusForHie(@Param("hieId") UUID hieId);
}