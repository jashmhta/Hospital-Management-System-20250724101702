package com.hospital.hms.analytics.repository;

import com.hospital.hms.analytics.entity.DataRetentionPolicyEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Data Retention Policy Repository
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Repository
public interface DataRetentionPolicyRepository extends JpaRepository<DataRetentionPolicyEntity, String> {

    /**
     * Find by source type
     */
    Optional<DataRetentionPolicyEntity> findBySourceTypeAndIsActiveTrue(String sourceType);

    /**
     * Find all active policies
     */
    List<DataRetentionPolicyEntity> findByIsActiveTrueOrderBySourceTypeAsc();

    /**
     * Find policies by retention days range
     */
    @Query("SELECT drp FROM DataRetentionPolicyEntity drp WHERE " +
           "drp.retentionDays BETWEEN :minDays AND :maxDays AND " +
           "drp.isActive = true " +
           "ORDER BY drp.retentionDays ASC")
    List<DataRetentionPolicyEntity> findByRetentionDaysRange(
        @Param("minDays") Integer minDays,
        @Param("maxDays") Integer maxDays
    );

    /**
     * Find policies ready for execution
     */
    @Query("SELECT drp FROM DataRetentionPolicyEntity drp WHERE " +
           "drp.isActive = true AND " +
           "(drp.nextExecution IS NULL OR drp.nextExecution <= :currentTime) " +
           "ORDER BY drp.nextExecution ASC")
    List<DataRetentionPolicyEntity> findPoliciesReadyForExecution(@Param("currentTime") LocalDateTime currentTime);

    /**
     * Find policies by archive location
     */
    List<DataRetentionPolicyEntity> findByArchiveLocationAndIsActiveTrueOrderBySourceTypeAsc(String archiveLocation);

    /**
     * Find policies with compression enabled
     */
    List<DataRetentionPolicyEntity> findByCompressDataTrueAndIsActiveTrueOrderBySourceTypeAsc();

    /**
     * Find policies with encryption enabled
     */
    List<DataRetentionPolicyEntity> findByEncryptArchiveTrueAndIsActiveTrueOrderBySourceTypeAsc();

    /**
     * Count active policies
     */
    long countByIsActiveTrue();

    /**
     * Count policies by archive location
     */
    long countByArchiveLocationAndIsActiveTrue(String archiveLocation);

    /**
     * Find overdue policies
     */
    @Query("SELECT drp FROM DataRetentionPolicyEntity drp WHERE " +
           "drp.isActive = true AND " +
           "drp.nextExecution IS NOT NULL AND " +
           "drp.nextExecution < :threshold " +
           "ORDER BY drp.nextExecution ASC")
    List<DataRetentionPolicyEntity> findOverduePolicies(@Param("threshold") LocalDateTime threshold);

    /**
     * Get policy statistics
     */
    @Query("SELECT drp.archiveLocation, COUNT(drp), AVG(drp.retentionDays), SUM(drp.executionCount) " +
           "FROM DataRetentionPolicyEntity drp WHERE " +
           "drp.isActive = true " +
           "GROUP BY drp.archiveLocation " +
           "ORDER BY COUNT(drp) DESC")
    List<Object[]> getPolicyStatisticsByArchiveLocation();

    /**
     * Find policies by execution count range
     */
    @Query("SELECT drp FROM DataRetentionPolicyEntity drp WHERE " +
           "drp.executionCount BETWEEN :minCount AND :maxCount AND " +
           "drp.isActive = true " +
           "ORDER BY drp.executionCount DESC")
    List<DataRetentionPolicyEntity> findByExecutionCountRange(
        @Param("minCount") Integer minCount,
        @Param("maxCount") Integer maxCount
    );

    /**
     * Find policies never executed
     */
    @Query("SELECT drp FROM DataRetentionPolicyEntity drp WHERE " +
           "drp.lastExecuted IS NULL AND " +
           "drp.isActive = true " +
           "ORDER BY drp.createdAt ASC")
    List<DataRetentionPolicyEntity> findNeverExecutedPolicies();

    /**
     * Find policies by created by user
     */
    List<DataRetentionPolicyEntity> findByCreatedByAndIsActiveTrueOrderByCreatedAtDesc(String createdBy);

    /**
     * Search policies by description
     */
    @Query("SELECT drp FROM DataRetentionPolicyEntity drp WHERE " +
           "LOWER(drp.description) LIKE LOWER(CONCAT('%', :searchTerm, '%')) AND " +
           "drp.isActive = true " +
           "ORDER BY drp.sourceType ASC")
    List<DataRetentionPolicyEntity> searchByDescription(@Param("searchTerm") String searchTerm);

    /**
     * Find policies by source type pattern
     */
    @Query("SELECT drp FROM DataRetentionPolicyEntity drp WHERE " +
           "LOWER(drp.sourceType) LIKE LOWER(CONCAT('%', :pattern, '%')) AND " +
           "drp.isActive = true " +
           "ORDER BY drp.sourceType ASC")
    List<DataRetentionPolicyEntity> findBySourceTypePattern(@Param("pattern") String pattern);

    /**
     * Get execution frequency statistics
     */
    @Query("SELECT " +
           "COUNT(drp) as totalPolicies, " +
           "AVG(drp.executionCount) as avgExecutions, " +
           "MAX(drp.executionCount) as maxExecutions, " +
           "COUNT(CASE WHEN drp.lastExecuted IS NULL THEN 1 END) as neverExecuted " +
           "FROM DataRetentionPolicyEntity drp WHERE " +
           "drp.isActive = true")
    Object[] getExecutionFrequencyStatistics();

    /**
     * Find policies with specific retention period
     */
    List<DataRetentionPolicyEntity> findByRetentionDaysAndIsActiveTrueOrderByCreatedAtDesc(Integer retentionDays);

    /**
     * Find recently created policies
     */
    @Query("SELECT drp FROM DataRetentionPolicyEntity drp WHERE " +
           "drp.createdAt >= :since AND " +
           "drp.isActive = true " +
           "ORDER BY drp.createdAt DESC")
    List<DataRetentionPolicyEntity> findRecentlyCreatedPolicies(@Param("since") LocalDateTime since);

    /**
     * Find recently updated policies
     */
    @Query("SELECT drp FROM DataRetentionPolicyEntity drp WHERE " +
           "drp.updatedAt >= :since AND " +
           "drp.isActive = true " +
           "ORDER BY drp.updatedAt DESC")
    List<DataRetentionPolicyEntity> findRecentlyUpdatedPolicies(@Param("since") LocalDateTime since);

    /**
     * Find policies due for execution within timeframe
     */
    @Query("SELECT drp FROM DataRetentionPolicyEntity drp WHERE " +
           "drp.isActive = true AND " +
           "drp.nextExecution BETWEEN :startTime AND :endTime " +
           "ORDER BY drp.nextExecution ASC")
    List<DataRetentionPolicyEntity> findPoliciesDueForExecution(
        @Param("startTime") LocalDateTime startTime,
        @Param("endTime") LocalDateTime endTime
    );

    /**
     * Check if policy exists for source type
     */
    boolean existsBySourceTypeAndIsActiveTrue(String sourceType);

    /**
     * Find policies with high execution count
     */
    @Query("SELECT drp FROM DataRetentionPolicyEntity drp WHERE " +
           "drp.executionCount >= :minExecutionCount AND " +
           "drp.isActive = true " +
           "ORDER BY drp.executionCount DESC")
    List<DataRetentionPolicyEntity> findHighExecutionCountPolicies(@Param("minExecutionCount") Integer minExecutionCount);
}
