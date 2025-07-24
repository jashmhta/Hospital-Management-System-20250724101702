package com.hospital.hms.hieintegration.repository;

import com.hospital.hms.hieintegration.entity.HealthInformationExchange;
import com.hospital.hms.hieintegration.entity.HieStatus;
import com.hospital.hms.hieintegration.entity.HieType;
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
 * Repository interface for HealthInformationExchange entity operations
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Repository
public interface HealthInformationExchangeRepository extends JpaRepository<HealthInformationExchange, UUID> {

    /**
     * Find HIE by unique HIE code
     */
    Optional<HealthInformationExchange> findByHieCode(String hieCode);

    /**
     * Find HIE by name (case-insensitive)
     */
    Optional<HealthInformationExchange> findByHieNameIgnoreCase(String hieName);

    /**
     * Find HIEs by status
     */
    List<HealthInformationExchange> findByStatus(HieStatus status);

    /**
     * Find HIEs by type
     */
    List<HealthInformationExchange> findByHieType(HieType hieType);

    /**
     * Find HIEs by geographic region
     */
    List<HealthInformationExchange> findByGeographicRegionIgnoreCase(String geographicRegion);

    /**
     * Find HIEs by status and type
     */
    List<HealthInformationExchange> findByStatusAndHieType(HieStatus status, HieType hieType);

    /**
     * Find HIEs with uptime percentage above threshold
     */
    @Query("SELECT h FROM HealthInformationExchange h WHERE h.uptimePercentage >= :threshold")
    List<HealthInformationExchange> findByUptimePercentageGreaterThanEqual(@Param("threshold") Double threshold);

    /**
     * Find HIEs with average response time below threshold
     */
    @Query("SELECT h FROM HealthInformationExchange h WHERE h.averageResponseTimeMs <= :maxResponseTime")
    List<HealthInformationExchange> findByAverageResponseTimeMsLessThanEqual(@Param("maxResponseTime") Long maxResponseTime);

    /**
     * Find HIEs by success rate percentage above threshold
     */
    @Query("SELECT h FROM HealthInformationExchange h WHERE h.successRatePercentage >= :threshold")
    List<HealthInformationExchange> findBySuccessRatePercentageGreaterThanEqual(@Param("threshold") Double threshold);

    /**
     * Find HIEs with last successful connection within timeframe
     */
    @Query("SELECT h FROM HealthInformationExchange h WHERE h.lastSuccessfulConnection >= :since")
    List<HealthInformationExchange> findByLastSuccessfulConnectionAfter(@Param("since") LocalDateTime since);

    /**
     * Find HIEs with last failed connection within timeframe
     */
    @Query("SELECT h FROM HealthInformationExchange h WHERE h.lastFailedConnection >= :since")
    List<HealthInformationExchange> findByLastFailedConnectionAfter(@Param("since") LocalDateTime since);

    /**
     * Find HIEs by data sharing agreement status
     */
    @Query("SELECT h FROM HealthInformationExchange h WHERE h.dataSharingStartDate <= :currentDate AND (h.dataSharingEndDate IS NULL OR h.dataSharingEndDate >= :currentDate)")
    List<HealthInformationExchange> findByActiveDataSharingAgreement(@Param("currentDate") LocalDateTime currentDate);

    /**
     * Find HIEs by primary contact email
     */
    Optional<HealthInformationExchange> findByPrimaryContactEmail(String primaryContactEmail);

    /**
     * Find HIEs by technical contact email
     */
    Optional<HealthInformationExchange> findByTechnicalContactEmail(String technicalContactEmail);

    /**
     * Find HIEs supporting specific FHIR version
     */
    @Query("SELECT h FROM HealthInformationExchange h WHERE h.supportedFhirVersions LIKE %:fhirVersion%")
    List<HealthInformationExchange> findBySupportedFhirVersionsContaining(@Param("fhirVersion") String fhirVersion);

    /**
     * Find HIEs supporting specific HL7 version
     */
    @Query("SELECT h FROM HealthInformationExchange h WHERE h.supportedHl7Versions LIKE %:hl7Version%")
    List<HealthInformationExchange> findBySupportedHl7VersionsContaining(@Param("hl7Version") String hl7Version);

    /**
     * Find HIEs by service area (contains search)
     */
    @Query("SELECT h FROM HealthInformationExchange h WHERE LOWER(h.serviceArea) LIKE LOWER(CONCAT('%', :serviceArea, '%'))")
    List<HealthInformationExchange> findByServiceAreaContainingIgnoreCase(@Param("serviceArea") String serviceArea);

    /**
     * Search HIEs by name or description
     */
    @Query("SELECT h FROM HealthInformationExchange h WHERE " +
           "LOWER(h.hieName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(h.description) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    Page<HealthInformationExchange> searchByNameOrDescription(@Param("searchTerm") String searchTerm, Pageable pageable);

    /**
     * Find HIEs created by specific user
     */
    List<HealthInformationExchange> findByCreatedBy(String createdBy);

    /**
     * Find HIEs created within date range
     */
    @Query("SELECT h FROM HealthInformationExchange h WHERE h.createdDate >= :startDate AND h.createdDate <= :endDate")
    List<HealthInformationExchange> findByCreatedDateBetween(@Param("startDate") LocalDateTime startDate, 
                                                           @Param("endDate") LocalDateTime endDate);

    /**
     * Count HIEs by status
     */
    long countByStatus(HieStatus status);

    /**
     * Count HIEs by type
     */
    long countByHieType(HieType hieType);

    /**
     * Get HIE statistics
     */
    @Query("SELECT COUNT(h), h.status FROM HealthInformationExchange h GROUP BY h.status")
    List<Object[]> getHieStatisticsByStatus();

    /**
     * Get HIE type distribution
     */
    @Query("SELECT COUNT(h), h.hieType FROM HealthInformationExchange h GROUP BY h.hieType")
    List<Object[]> getHieTypeDistribution();

    /**
     * Find HIEs with connection test frequency
     */
    @Query("SELECT h FROM HealthInformationExchange h WHERE h.connectionTestFrequencyMinutes = :frequency")
    List<HealthInformationExchange> findByConnectionTestFrequencyMinutes(@Param("frequency") Integer frequency);

    /**
     * Find HIEs due for connection testing
     */
    @Query("SELECT h FROM HealthInformationExchange h WHERE " +
           "h.lastSuccessfulConnection IS NULL OR " +
           "h.lastSuccessfulConnection <= :testDueTime")
    List<HealthInformationExchange> findHiesDueForConnectionTest(@Param("testDueTime") LocalDateTime testDueTime);

    /**
     * Find HIEs with performance issues
     */
    @Query("SELECT h FROM HealthInformationExchange h WHERE " +
           "h.uptimePercentage < :minUptime OR " +
           "h.averageResponseTimeMs > :maxResponseTime OR " +
           "h.successRatePercentage < :minSuccessRate")
    List<HealthInformationExchange> findHiesWithPerformanceIssues(
        @Param("minUptime") Double minUptime,
        @Param("maxResponseTime") Long maxResponseTime,
        @Param("minSuccessRate") Double minSuccessRate);

    /**
     * Find HIEs by time zone
     */
    List<HealthInformationExchange> findByTimeZone(String timeZone);

    /**
     * Check if HIE code exists
     */
    boolean existsByHieCode(String hieCode);

    /**
     * Check if HIE name exists (case-insensitive)
     */
    @Query("SELECT CASE WHEN COUNT(h) > 0 THEN true ELSE false END FROM HealthInformationExchange h WHERE LOWER(h.hieName) = LOWER(:hieName)")
    boolean existsByHieNameIgnoreCase(@Param("hieName") String hieName);

    /**
     * Update HIE performance metrics
     */
    @Query("UPDATE HealthInformationExchange h SET " +
           "h.uptimePercentage = :uptimePercentage, " +
           "h.averageResponseTimeMs = :averageResponseTimeMs, " +
           "h.successRatePercentage = :successRatePercentage, " +
           "h.lastModifiedDate = CURRENT_TIMESTAMP " +
           "WHERE h.id = :hieId")
    int updatePerformanceMetrics(@Param("hieId") UUID hieId,
                                @Param("uptimePercentage") Double uptimePercentage,
                                @Param("averageResponseTimeMs") Long averageResponseTimeMs,
                                @Param("successRatePercentage") Double successRatePercentage);

    /**
     * Update last successful connection
     */
    @Query("UPDATE HealthInformationExchange h SET " +
           "h.lastSuccessfulConnection = :connectionTime, " +
           "h.lastModifiedDate = CURRENT_TIMESTAMP " +
           "WHERE h.id = :hieId")
    int updateLastSuccessfulConnection(@Param("hieId") UUID hieId, @Param("connectionTime") LocalDateTime connectionTime);

    /**
     * Update last failed connection
     */
    @Query("UPDATE HealthInformationExchange h SET " +
           "h.lastFailedConnection = :connectionTime, " +
           "h.lastModifiedDate = CURRENT_TIMESTAMP " +
           "WHERE h.id = :hieId")
    int updateLastFailedConnection(@Param("hieId") UUID hieId, @Param("connectionTime") LocalDateTime connectionTime);
}