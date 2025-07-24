package com.hms.analytics.repository;

import com.hms.analytics.entity.DataSource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Data Source Repository
 * 
 * Advanced repository for managing healthcare data sources with custom queries
 * for analytics ingestion, monitoring, and performance tracking.
 */
@Repository
public interface DataSourceRepository extends JpaRepository<DataSource, Long> {

    /**
     * Find data source by unique source code
     */
    Optional<DataSource> findBySourceCode(String sourceCode);

    /**
     * Find data sources by source type
     */
    List<DataSource> findBySourceType(DataSource.SourceType sourceType);

    /**
     * Find data sources by category
     */
    List<DataSource> findByCategory(DataSource.DataCategory category);

    /**
     * Find data sources by status
     */
    List<DataSource> findByStatus(DataSource.SourceStatus status);

    /**
     * Find active data sources
     */
    @Query("SELECT ds FROM DataSource ds WHERE ds.status = 'ACTIVE'")
    List<DataSource> findActiveDataSources();

    /**
     * Find data sources that are healthy and active
     */
    @Query("SELECT ds FROM DataSource ds WHERE ds.status = 'ACTIVE' AND " +
           "(ds.lastErrorAt IS NULL OR ds.lastErrorAt < :healthThreshold)")
    List<DataSource> findHealthyDataSources(@Param("healthThreshold") LocalDateTime healthThreshold);

    /**
     * Find data sources due for sync
     */
    @Query("SELECT ds FROM DataSource ds WHERE ds.status = 'ACTIVE' AND " +
           "(ds.nextSyncAt IS NULL OR ds.nextSyncAt <= :currentTime)")
    List<DataSource> findDueForSync(@Param("currentTime") LocalDateTime currentTime);

    /**
     * Find data sources with high error rates
     */
    @Query("SELECT ds FROM DataSource ds WHERE ds.recordsProcessed > 0 AND " +
           "(CAST(ds.recordsFailed AS double) / CAST(ds.recordsProcessed AS double)) * 100 > :errorThreshold")
    List<DataSource> findDataSourcesWithHighErrorRate(@Param("errorThreshold") double errorThreshold);

    /**
     * Find data sources by HIPAA compliance status
     */
    List<DataSource> findByHipaaCompliant(Boolean hipaaCompliant);

    /**
     * Find data sources with monitoring enabled
     */
    List<DataSource> findByMonitoringEnabled(Boolean monitoringEnabled);

    /**
     * Find data sources by created date range
     */
    @Query("SELECT ds FROM DataSource ds WHERE ds.createdAt BETWEEN :startDate AND :endDate")
    List<DataSource> findByCreatedAtBetween(@Param("startDate") LocalDateTime startDate, 
                                           @Param("endDate") LocalDateTime endDate);

    /**
     * Find data sources that haven't synced recently
     */
    @Query("SELECT ds FROM DataSource ds WHERE ds.lastSyncAt IS NULL OR " +
           "ds.lastSyncAt < :cutoffTime ORDER BY ds.lastSyncAt ASC")
    List<DataSource> findOverdueDataSources(@Param("cutoffTime") LocalDateTime cutoffTime);

    /**
     * Search data sources by name or description
     */
    @Query("SELECT ds FROM DataSource ds WHERE " +
           "LOWER(ds.sourceName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(ds.description) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    Page<DataSource> searchDataSources(@Param("searchTerm") String searchTerm, Pageable pageable);

    /**
     * Find data sources with configuration containing specific key
     */
    @Query("SELECT ds FROM DataSource ds WHERE ds.configurationJson LIKE %:configKey%")
    List<DataSource> findByConfigurationContaining(@Param("configKey") String configKey);

    /**
     * Count data sources by status
     */
    long countByStatus(DataSource.SourceStatus status);

    /**
     * Count data sources by category
     */
    long countByCategory(DataSource.DataCategory category);

    /**
     * Get total records processed across all sources
     */
    @Query("SELECT COALESCE(SUM(ds.recordsProcessed), 0) FROM DataSource ds")
    Long getTotalRecordsProcessed();

    /**
     * Get total records failed across all sources
     */
    @Query("SELECT COALESCE(SUM(ds.recordsFailed), 0) FROM DataSource ds")
    Long getTotalRecordsFailed();

    /**
     * Get average processing time across all sources
     */
    @Query("SELECT AVG(ds.averageProcessingTimeMs) FROM DataSource ds WHERE ds.averageProcessingTimeMs > 0")
    Double getAverageProcessingTime();

    /**
     * Find top performing data sources by success rate
     */
    @Query("SELECT ds FROM DataSource ds WHERE ds.recordsProcessed > 0 " +
           "ORDER BY (CAST(ds.recordsProcessed - ds.recordsFailed AS double) / CAST(ds.recordsProcessed AS double)) DESC")
    Page<DataSource> findTopPerformingDataSources(Pageable pageable);

    /**
     * Find data sources needing attention (high error rates or failures)
     */
    @Query("SELECT ds FROM DataSource ds WHERE " +
           "ds.status = 'ERROR' OR ds.errorCount > :errorThreshold OR " +
           "(ds.recordsProcessed > 0 AND (CAST(ds.recordsFailed AS double) / CAST(ds.recordsProcessed AS double)) * 100 > :failureThreshold)")
    List<DataSource> findDataSourcesNeedingAttention(@Param("errorThreshold") int errorThreshold, 
                                                     @Param("failureThreshold") double failureThreshold);

    /**
     * Update data source sync schedule
     */
    @Modifying
    @Query("UPDATE DataSource ds SET ds.nextSyncAt = :nextSyncTime WHERE ds.id = :dataSourceId")
    int updateSyncSchedule(@Param("dataSourceId") Long dataSourceId, @Param("nextSyncTime") LocalDateTime nextSyncTime);

    /**
     * Update data source error count
     */
    @Modifying
    @Query("UPDATE DataSource ds SET ds.errorCount = ds.errorCount + 1, " +
           "ds.lastErrorAt = :errorTime, ds.lastErrorMessage = :errorMessage WHERE ds.id = :dataSourceId")
    int incrementErrorCount(@Param("dataSourceId") Long dataSourceId, 
                           @Param("errorTime") LocalDateTime errorTime,
                           @Param("errorMessage") String errorMessage);

    /**
     * Reset data source error count
     */
    @Modifying
    @Query("UPDATE DataSource ds SET ds.errorCount = 0, ds.lastErrorAt = NULL, " +
           "ds.lastErrorMessage = NULL, ds.status = 'ACTIVE' WHERE ds.id = :dataSourceId")
    int resetErrorCount(@Param("dataSourceId") Long dataSourceId);

    /**
     * Update data source statistics
     */
    @Modifying
    @Query("UPDATE DataSource ds SET ds.recordsProcessed = ds.recordsProcessed + :processedCount, " +
           "ds.averageProcessingTimeMs = :avgProcessingTime, ds.lastSyncAt = :syncTime " +
           "WHERE ds.id = :dataSourceId")
    int updateStatistics(@Param("dataSourceId") Long dataSourceId,
                        @Param("processedCount") Long processedCount,
                        @Param("avgProcessingTime") Double avgProcessingTime,
                        @Param("syncTime") LocalDateTime syncTime);

    /**
     * Find data sources with specific transformation rules
     */
    @Query("SELECT ds FROM DataSource ds WHERE ds.transformationRulesJson IS NOT NULL AND " +
           "ds.transformationRulesJson != '' AND ds.transformationRulesJson != '{}'")
    List<DataSource> findDataSourcesWithTransformationRules();

    /**
     * Find data sources requiring schema validation
     */
    List<DataSource> findBySchemaValidationTrue();

    /**
     * Find data sources with encryption enabled
     */
    List<DataSource> findByDataEncryptionTrue();

    /**
     * Get data sources grouped by category with counts
     */
    @Query("SELECT ds.category, COUNT(ds) FROM DataSource ds GROUP BY ds.category")
    List<Object[]> getDataSourceCountByCategory();

    /**
     * Get data sources grouped by status with counts
     */
    @Query("SELECT ds.status, COUNT(ds) FROM DataSource ds GROUP BY ds.status")
    List<Object[]> getDataSourceCountByStatus();

    /**
     * Find recently created data sources
     */
    @Query("SELECT ds FROM DataSource ds WHERE ds.createdAt > :cutoffDate ORDER BY ds.createdAt DESC")
    List<DataSource> findRecentlyCreated(@Param("cutoffDate") LocalDateTime cutoffDate);

    /**
     * Find data sources by sync frequency range
     */
    @Query("SELECT ds FROM DataSource ds WHERE ds.syncFrequencyMinutes BETWEEN :minFreq AND :maxFreq")
    List<DataSource> findBySyncFrequencyRange(@Param("minFreq") Integer minFrequency, 
                                             @Param("maxFreq") Integer maxFrequency);

    /**
     * Find data sources with large batch sizes
     */
    @Query("SELECT ds FROM DataSource ds WHERE ds.batchSize > :batchSizeThreshold")
    List<DataSource> findLargeBatchDataSources(@Param("batchSizeThreshold") Integer batchSizeThreshold);

    /**
     * Find data sources needing configuration updates
     */
    @Query("SELECT ds FROM DataSource ds WHERE ds.updatedAt < :cutoffDate AND ds.status = 'ACTIVE'")
    List<DataSource> findDataSourcesNeedingConfigUpdate(@Param("cutoffDate") LocalDateTime cutoffDate);

    /**
     * Check if source code exists
     */
    boolean existsBySourceCode(String sourceCode);

    /**
     * Find data sources by multiple statuses
     */
    List<DataSource> findByStatusIn(List<DataSource.SourceStatus> statuses);

    /**
     * Find data sources by multiple categories
     */
    List<DataSource> findByCategoryIn(List<DataSource.DataCategory> categories);

    /**
     * Advanced search with multiple criteria
     */
    @Query("SELECT ds FROM DataSource ds WHERE " +
           "(:sourceType IS NULL OR ds.sourceType = :sourceType) AND " +
           "(:category IS NULL OR ds.category = :category) AND " +
           "(:status IS NULL OR ds.status = :status) AND " +
           "(:hipaaCompliant IS NULL OR ds.hipaaCompliant = :hipaaCompliant) AND " +
           "(:searchTerm IS NULL OR LOWER(ds.sourceName) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    Page<DataSource> findWithCriteria(@Param("sourceType") DataSource.SourceType sourceType,
                                     @Param("category") DataSource.DataCategory category,
                                     @Param("status") DataSource.SourceStatus status,
                                     @Param("hipaaCompliant") Boolean hipaaCompliant,
                                     @Param("searchTerm") String searchTerm,
                                     Pageable pageable);
}
