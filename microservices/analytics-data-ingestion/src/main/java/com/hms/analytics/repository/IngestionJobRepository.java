package com.hms.analytics.repository;

import com.hms.analytics.entity.DataSource;
import com.hms.analytics.entity.IngestionJob;
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
 * Ingestion Job Repository
 * 
 * Comprehensive repository for managing analytics ingestion jobs with
 * advanced querying capabilities for monitoring and performance tracking.
 */
@Repository
public interface IngestionJobRepository extends JpaRepository<IngestionJob, Long> {

    /**
     * Find job by unique job ID
     */
    Optional<IngestionJob> findByJobId(String jobId);

    /**
     * Find jobs by data source
     */
    List<IngestionJob> findByDataSource(DataSource dataSource);

    /**
     * Find recent jobs by data source
     */
    List<IngestionJob> findTop10ByDataSourceOrderByCreatedAtDesc(DataSource dataSource);

    /**
     * Find jobs by status
     */
    List<IngestionJob> findByStatus(IngestionJob.JobStatus status);

    /**
     * Find jobs by job type
     */
    List<IngestionJob> findByJobType(IngestionJob.JobType jobType);

    /**
     * Find jobs by data source and status
     */
    List<IngestionJob> findByDataSourceAndStatus(DataSource dataSource, IngestionJob.JobStatus status);

    /**
     * Find jobs by data source and multiple statuses
     */
    List<IngestionJob> findByDataSourceAndStatusIn(DataSource dataSource, List<IngestionJob.JobStatus> statuses);

    /**
     * Count jobs by data source and statuses
     */
    long countByDataSourceAndStatusIn(DataSource dataSource, List<IngestionJob.JobStatus> statuses);

    /**
     * Find running jobs
     */
    @Query("SELECT j FROM IngestionJob j WHERE j.status IN ('RUNNING', 'PROCESSING')")
    List<IngestionJob> findRunningJobs();

    /**
     * Find pending jobs
     */
    @Query("SELECT j FROM IngestionJob j WHERE j.status = 'PENDING' ORDER BY j.priority ASC, j.createdAt ASC")
    List<IngestionJob> findPendingJobs();

    /**
     * Find failed jobs that can be retried
     */
    @Query("SELECT j FROM IngestionJob j WHERE j.status = 'FAILED' AND j.retryCount < j.maxRetries")
    List<IngestionJob> findRetryableFailedJobs();

    /**
     * Find jobs ready for retry
     */
    @Query("SELECT j FROM IngestionJob j WHERE j.status = 'RETRY_SCHEDULED' AND " +
           "(j.nextRetryAt IS NULL OR j.nextRetryAt <= :currentTime)")
    List<IngestionJob> findJobsReadyForRetry(@Param("currentTime") LocalDateTime currentTime);

    /**
     * Find long-running jobs
     */
    @Query("SELECT j FROM IngestionJob j WHERE j.status IN ('RUNNING', 'PROCESSING') AND " +
           "j.startedAt < :cutoffTime")
    List<IngestionJob> findLongRunningJobs(@Param("cutoffTime") LocalDateTime cutoffTime);

    /**
     * Find completed jobs older than specified date
     */
    @Query("SELECT j FROM IngestionJob j WHERE j.status IN ('COMPLETED', 'FAILED', 'CANCELLED') AND " +
           "j.completedAt < :cutoffDate")
    List<IngestionJob> findCompletedJobsOlderThan(@Param("cutoffDate") LocalDateTime cutoffDate);

    /**
     * Find jobs by created date range
     */
    @Query("SELECT j FROM IngestionJob j WHERE j.createdAt BETWEEN :startDate AND :endDate")
    List<IngestionJob> findByCreatedAtBetween(@Param("startDate") LocalDateTime startDate,
                                             @Param("endDate") LocalDateTime endDate);

    /**
     * Find jobs by completion date range
     */
    @Query("SELECT j FROM IngestionJob j WHERE j.completedAt BETWEEN :startDate AND :endDate")
    List<IngestionJob> findByCompletedAtBetween(@Param("startDate") LocalDateTime startDate,
                                               @Param("endDate") LocalDateTime endDate);

    /**
     * Find jobs with high success rate
     */
    @Query("SELECT j FROM IngestionJob j WHERE j.recordsTotal > 0 AND " +
           "(CAST(j.recordsProcessed AS double) / CAST(j.recordsTotal AS double)) * 100 > :successThreshold")
    List<IngestionJob> findJobsWithHighSuccessRate(@Param("successThreshold") double successThreshold);

    /**
     * Find jobs with high failure rate
     */
    @Query("SELECT j FROM IngestionJob j WHERE j.recordsTotal > 0 AND " +
           "(CAST(j.recordsFailed AS double) / CAST(j.recordsTotal AS double)) * 100 > :failureThreshold")
    List<IngestionJob> findJobsWithHighFailureRate(@Param("failureThreshold") double failureThreshold);

    /**
     * Find jobs by triggered user
     */
    List<IngestionJob> findByTriggeredBy(String triggeredBy);

    /**
     * Find jobs by trigger type
     */
    List<IngestionJob> findByTriggerType(String triggerType);

    /**
     * Find jobs with HIPAA compliance issues
     */
    @Query("SELECT j FROM IngestionJob j WHERE j.hipaaComplianceChecked = true AND " +
           "(j.phiDetected = true AND j.phiAnonymized = false)")
    List<IngestionJob> findJobsWithHipaaIssues();

    /**
     * Find jobs with PHI detected
     */
    List<IngestionJob> findByPhiDetectedTrue();

    /**
     * Find jobs with low quality scores
     */
    @Query("SELECT j FROM IngestionJob j WHERE j.qualityScore IS NOT NULL AND j.qualityScore < :qualityThreshold")
    List<IngestionJob> findJobsWithLowQuality(@Param("qualityThreshold") double qualityThreshold);

    /**
     * Search jobs by name
     */
    @Query("SELECT j FROM IngestionJob j WHERE LOWER(j.jobName) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    Page<IngestionJob> searchJobsByName(@Param("searchTerm") String searchTerm, Pageable pageable);

    /**
     * Get job statistics by status
     */
    @Query("SELECT j.status, COUNT(j) FROM IngestionJob j GROUP BY j.status")
    List<Object[]> getJobCountByStatus();

    /**
     * Get job statistics by job type
     */
    @Query("SELECT j.jobType, COUNT(j) FROM IngestionJob j GROUP BY j.jobType")
    List<Object[]> getJobCountByJobType();

    /**
     * Get job statistics by data source
     */
    @Query("SELECT j.dataSource.sourceName, COUNT(j) FROM IngestionJob j GROUP BY j.dataSource.sourceName")
    List<Object[]> getJobCountByDataSource();

    /**
     * Get total records processed across all jobs
     */
    @Query("SELECT COALESCE(SUM(j.recordsProcessed), 0) FROM IngestionJob j")
    Long getTotalRecordsProcessed();

    /**
     * Get total records failed across all jobs
     */
    @Query("SELECT COALESCE(SUM(j.recordsFailed), 0) FROM IngestionJob j")
    Long getTotalRecordsFailed();

    /**
     * Get average job duration
     */
    @Query("SELECT AVG(j.durationMs) FROM IngestionJob j WHERE j.durationMs > 0")
    Double getAverageJobDuration();

    /**
     * Get average quality score
     */
    @Query("SELECT AVG(j.qualityScore) FROM IngestionJob j WHERE j.qualityScore IS NOT NULL")
    Double getAverageQualityScore();

    /**
     * Find fastest jobs
     */
    @Query("SELECT j FROM IngestionJob j WHERE j.durationMs IS NOT NULL ORDER BY j.durationMs ASC")
    Page<IngestionJob> findFastestJobs(Pageable pageable);

    /**
     * Find slowest jobs
     */
    @Query("SELECT j FROM IngestionJob j WHERE j.durationMs IS NOT NULL ORDER BY j.durationMs DESC")
    Page<IngestionJob> findSlowestJobs(Pageable pageable);

    /**
     * Find most successful jobs
     */
    @Query("SELECT j FROM IngestionJob j WHERE j.recordsTotal > 0 " +
           "ORDER BY (CAST(j.recordsProcessed AS double) / CAST(j.recordsTotal AS double)) DESC")
    Page<IngestionJob> findMostSuccessfulJobs(Pageable pageable);

    /**
     * Find jobs by priority
     */
    List<IngestionJob> findByPriorityOrderByCreatedAtAsc(Integer priority);

    /**
     * Find high priority jobs
     */
    @Query("SELECT j FROM IngestionJob j WHERE j.priority <= :priorityThreshold ORDER BY j.priority ASC, j.createdAt ASC")
    List<IngestionJob> findHighPriorityJobs(@Param("priorityThreshold") Integer priorityThreshold);

    /**
     * Update job status
     */
    @Modifying
    @Query("UPDATE IngestionJob j SET j.status = :status WHERE j.id = :jobId")
    int updateJobStatus(@Param("jobId") Long jobId, @Param("status") IngestionJob.JobStatus status);

    /**
     * Update job progress
     */
    @Modifying
    @Query("UPDATE IngestionJob j SET j.recordsProcessed = :processed, j.progressPercentage = :progress " +
           "WHERE j.id = :jobId")
    int updateJobProgress(@Param("jobId") Long jobId, 
                         @Param("processed") Long processed,
                         @Param("progress") Double progress);

    /**
     * Update job completion
     */
    @Modifying
    @Query("UPDATE IngestionJob j SET j.status = :status, j.completedAt = :completedAt, " +
           "j.durationMs = :duration, j.progressPercentage = 100.0 WHERE j.id = :jobId")
    int updateJobCompletion(@Param("jobId") Long jobId,
                           @Param("status") IngestionJob.JobStatus status,
                           @Param("completedAt") LocalDateTime completedAt,
                           @Param("duration") Long duration);

    /**
     * Update job error information
     */
    @Modifying
    @Query("UPDATE IngestionJob j SET j.status = 'FAILED', j.completedAt = :completedAt, " +
           "j.durationMs = :duration, j.errorMessage = :errorMessage, j.errorDetails = :errorDetails " +
           "WHERE j.id = :jobId")
    int updateJobError(@Param("jobId") Long jobId,
                      @Param("completedAt") LocalDateTime completedAt,
                      @Param("duration") Long duration,
                      @Param("errorMessage") String errorMessage,
                      @Param("errorDetails") String errorDetails);

    /**
     * Increment retry count
     */
    @Modifying
    @Query("UPDATE IngestionJob j SET j.retryCount = j.retryCount + 1, j.nextRetryAt = :nextRetryAt, " +
           "j.status = 'RETRY_SCHEDULED' WHERE j.id = :jobId")
    int incrementRetryCount(@Param("jobId") Long jobId, @Param("nextRetryAt") LocalDateTime nextRetryAt);

    /**
     * Find jobs scheduled for specific time
     */
    @Query("SELECT j FROM IngestionJob j WHERE j.scheduledFor BETWEEN :startTime AND :endTime")
    List<IngestionJob> findJobsScheduledBetween(@Param("startTime") LocalDateTime startTime,
                                               @Param("endTime") LocalDateTime endTime);

    /**
     * Find recently completed jobs
     */
    @Query("SELECT j FROM IngestionJob j WHERE j.status = 'COMPLETED' AND " +
           "j.completedAt > :cutoffTime ORDER BY j.completedAt DESC")
    List<IngestionJob> findRecentlyCompleted(@Param("cutoffTime") LocalDateTime cutoffTime);

    /**
     * Find recently failed jobs
     */
    @Query("SELECT j FROM IngestionJob j WHERE j.status = 'FAILED' AND " +
           "j.completedAt > :cutoffTime ORDER BY j.completedAt DESC")
    List<IngestionJob> findRecentlyFailed(@Param("cutoffTime") LocalDateTime cutoffTime);

    /**
     * Count jobs by data source and time range
     */
    @Query("SELECT COUNT(j) FROM IngestionJob j WHERE j.dataSource = :dataSource AND " +
           "j.createdAt BETWEEN :startDate AND :endDate")
    long countJobsByDataSourceAndDateRange(@Param("dataSource") DataSource dataSource,
                                          @Param("startDate") LocalDateTime startDate,
                                          @Param("endDate") LocalDateTime endDate);

    /**
     * Find jobs with specific configuration
     */
    @Query("SELECT j FROM IngestionJob j WHERE j.configurationJson LIKE %:configKey%")
    List<IngestionJob> findJobsWithConfiguration(@Param("configKey") String configKey);

    /**
     * Advanced search with multiple criteria
     */
    @Query("SELECT j FROM IngestionJob j WHERE " +
           "(:dataSourceId IS NULL OR j.dataSource.id = :dataSourceId) AND " +
           "(:status IS NULL OR j.status = :status) AND " +
           "(:jobType IS NULL OR j.jobType = :jobType) AND " +
           "(:triggeredBy IS NULL OR j.triggeredBy = :triggeredBy) AND " +
           "(:startDate IS NULL OR j.createdAt >= :startDate) AND " +
           "(:endDate IS NULL OR j.createdAt <= :endDate)")
    Page<IngestionJob> findWithCriteria(@Param("dataSourceId") Long dataSourceId,
                                       @Param("status") IngestionJob.JobStatus status,
                                       @Param("jobType") IngestionJob.JobType jobType,
                                       @Param("triggeredBy") String triggeredBy,
                                       @Param("startDate") LocalDateTime startDate,
                                       @Param("endDate") LocalDateTime endDate,
                                       Pageable pageable);

    /**
     * Check if job ID exists
     */
    boolean existsByJobId(String jobId);

    /**
     * Get performance metrics for completed jobs
     */
    @Query("SELECT AVG(j.durationMs), AVG(j.qualityScore), " +
           "AVG(CAST(j.recordsProcessed AS double) / CAST(j.recordsTotal AS double) * 100) " +
           "FROM IngestionJob j WHERE j.status = 'COMPLETED' AND j.recordsTotal > 0")
    List<Object[]> getPerformanceMetrics();

    /**
     * Get daily job completion trends
     */
    @Query("SELECT DATE(j.completedAt), COUNT(j) FROM IngestionJob j " +
           "WHERE j.status = 'COMPLETED' AND j.completedAt >= :startDate " +
           "GROUP BY DATE(j.completedAt) ORDER BY DATE(j.completedAt)")
    List<Object[]> getDailyCompletionTrends(@Param("startDate") LocalDateTime startDate);
}
