package com.hospital.hms.hieintegration.service;

import com.hospital.hms.hieintegration.dto.HieCreateRequestDto;
import com.hospital.hms.hieintegration.dto.HieResponseDto;
import com.hospital.hms.hieintegration.entity.HieStatus;
import com.hospital.hms.hieintegration.entity.HieType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Service interface for Health Information Exchange operations
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
public interface HealthInformationExchangeService {

    /**
     * Create a new HIE record
     */
    HieResponseDto createHie(HieCreateRequestDto createRequest);

    /**
     * Update an existing HIE record
     */
    HieResponseDto updateHie(UUID hieId, HieCreateRequestDto updateRequest);

    /**
     * Get HIE by ID
     */
    HieResponseDto getHieById(UUID hieId);

    /**
     * Get HIE by code
     */
    HieResponseDto getHieByCode(String hieCode);

    /**
     * Get HIE by name
     */
    HieResponseDto getHieByName(String hieName);

    /**
     * Get all HIEs with pagination
     */
    Page<HieResponseDto> getAllHies(Pageable pageable);

    /**
     * Get HIEs by status
     */
    List<HieResponseDto> getHiesByStatus(HieStatus status);

    /**
     * Get HIEs by type
     */
    List<HieResponseDto> getHiesByType(HieType hieType);

    /**
     * Get HIEs by geographic region
     */
    List<HieResponseDto> getHiesByGeographicRegion(String geographicRegion);

    /**
     * Search HIEs by name or description
     */
    Page<HieResponseDto> searchHies(String searchTerm, Pageable pageable);

    /**
     * Get HIEs with active data sharing agreements
     */
    List<HieResponseDto> getHiesWithActiveDataSharingAgreements();

    /**
     * Get HIEs supporting specific FHIR version
     */
    List<HieResponseDto> getHiesSupportingFhirVersion(String fhirVersion);

    /**
     * Get HIEs supporting specific HL7 version
     */
    List<HieResponseDto> getHiesSupportingHl7Version(String hl7Version);

    /**
     * Get HIEs with good performance (above thresholds)
     */
    List<HieResponseDto> getHighPerformanceHies();

    /**
     * Get HIEs with performance issues
     */
    List<HieResponseDto> getHiesWithPerformanceIssues();

    /**
     * Get HIEs due for connection testing
     */
    List<HieResponseDto> getHiesDueForConnectionTest();

    /**
     * Update HIE status
     */
    HieResponseDto updateHieStatus(UUID hieId, HieStatus status);

    /**
     * Update HIE performance metrics
     */
    void updatePerformanceMetrics(UUID hieId, Double uptimePercentage, 
                                 Long averageResponseTimeMs, Double successRatePercentage);

    /**
     * Record successful connection
     */
    void recordSuccessfulConnection(UUID hieId);

    /**
     * Record failed connection
     */
    void recordFailedConnection(UUID hieId);

    /**
     * Test HIE connectivity
     */
    Map<String, Object> testHieConnectivity(UUID hieId);

    /**
     * Test all HIE endpoints
     */
    Map<String, Object> testAllHieEndpoints(UUID hieId);

    /**
     * Validate HIE configuration
     */
    Map<String, Object> validateHieConfiguration(UUID hieId);

    /**
     * Get HIE statistics
     */
    Map<String, Object> getHieStatistics();

    /**
     * Get HIE status distribution
     */
    Map<HieStatus, Long> getHieStatusDistribution();

    /**
     * Get HIE type distribution
     */
    Map<HieType, Long> getHieTypeDistribution();

    /**
     * Get HIE performance summary
     */
    Map<String, Object> getHiePerformanceSummary(UUID hieId, LocalDateTime startDate, LocalDateTime endDate);

    /**
     * Get HIE uptime report
     */
    Map<String, Object> getHieUptimeReport(UUID hieId, LocalDateTime startDate, LocalDateTime endDate);

    /**
     * Refresh HIE performance metrics
     */
    void refreshPerformanceMetrics(UUID hieId);

    /**
     * Refresh all HIE performance metrics
     */
    void refreshAllPerformanceMetrics();

    /**
     * Archive inactive HIE
     */
    void archiveHie(UUID hieId);

    /**
     * Reactivate archived HIE
     */
    void reactivateHie(UUID hieId);

    /**
     * Delete HIE (soft delete)
     */
    void deleteHie(UUID hieId);

    /**
     * Export HIE configuration
     */
    Map<String, Object> exportHieConfiguration(UUID hieId);

    /**
     * Import HIE configuration
     */
    HieResponseDto importHieConfiguration(Map<String, Object> configuration);

    /**
     * Bulk update HIE status
     */
    int bulkUpdateHieStatus(List<UUID> hieIds, HieStatus status);

    /**
     * Get HIE health status
     */
    String getHieHealthStatus(UUID hieId);

    /**
     * Check HIE name availability
     */
    boolean isHieNameAvailable(String hieName);

    /**
     * Check HIE code availability
     */
    boolean isHieCodeAvailable(String hieCode);

    /**
     * Generate HIE connectivity report
     */
    Map<String, Object> generateConnectivityReport(LocalDateTime startDate, LocalDateTime endDate);

    /**
     * Schedule connectivity tests for all HIEs
     */
    void scheduleConnectivityTests();

    /**
     * Process connectivity test results
     */
    void processConnectivityTestResults(UUID hieId, Map<String, Object> testResults);
}