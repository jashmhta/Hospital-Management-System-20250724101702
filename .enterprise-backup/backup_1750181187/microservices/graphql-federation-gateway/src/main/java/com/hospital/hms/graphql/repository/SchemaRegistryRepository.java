package com.hospital.hms.graphql.repository;

import com.hospital.hms.graphql.entity.SchemaRegistryEntity;
import com.hospital.hms.graphql.entity.SchemaRegistryEntity.SchemaStatus;
import com.hospital.hms.graphql.entity.SchemaRegistryEntity.HealthStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Schema Registry Repository for GraphQL Federation
 * 
 * Advanced repository with custom queries for schema management,
 * health monitoring, and federation optimization.
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Repository
public interface SchemaRegistryRepository extends JpaRepository<SchemaRegistryEntity, Long> {

    /**
     * Find schema by service name
     */
    Optional<SchemaRegistryEntity> findByServiceName(String serviceName);

    /**
     * Find all active schemas available for federation
     */
    @Query("SELECT s FROM SchemaRegistryEntity s WHERE s.status = :status AND s.healthStatus != :excludeHealth")
    List<SchemaRegistryEntity> findActiveSchemas(
            @Param("status") SchemaStatus status, 
            @Param("excludeHealth") HealthStatus excludeHealth);

    /**
     * Find schemas by health status with pagination
     */
    Page<SchemaRegistryEntity> findByHealthStatusOrderByLastHealthCheckDesc(
            HealthStatus healthStatus, Pageable pageable);

    /**
     * Find schemas with high priority for critical services
     */
    @Query("SELECT s FROM SchemaRegistryEntity s WHERE s.priorityLevel >= :minPriority AND s.status = 'ACTIVE' ORDER BY s.priorityLevel DESC")
    List<SchemaRegistryEntity> findHighPrioritySchemas(@Param("minPriority") Integer minPriority);

    /**
     * Find schemas requiring health check
     */
    @Query("SELECT s FROM SchemaRegistryEntity s WHERE s.lastHealthCheck IS NULL OR s.lastHealthCheck < :cutoffTime")
    List<SchemaRegistryEntity> findSchemasRequiringHealthCheck(@Param("cutoffTime") LocalDateTime cutoffTime);

    /**
     * Find schemas by version pattern
     */
    @Query("SELECT s FROM SchemaRegistryEntity s WHERE s.schemaVersion LIKE :versionPattern")
    List<SchemaRegistryEntity> findByVersionPattern(@Param("versionPattern") String versionPattern);

    /**
     * Find outdated schemas that need updates
     */
    @Query("SELECT s FROM SchemaRegistryEntity s WHERE s.updatedAt < :cutoffDate AND s.status = 'ACTIVE'")
    List<SchemaRegistryEntity> findOutdatedSchemas(@Param("cutoffDate") LocalDateTime cutoffDate);

    /**
     * Find schemas with high error rates
     */
    @Query("SELECT s FROM SchemaRegistryEntity s WHERE s.errorCount > 0 AND (s.errorCount * 100.0 / (s.errorCount + s.successCount)) > :errorThreshold")
    List<SchemaRegistryEntity> findSchemasWithHighErrorRate(@Param("errorThreshold") Double errorThreshold);

    /**
     * Find schemas with slow response times
     */
    @Query("SELECT s FROM SchemaRegistryEntity s WHERE s.averageResponseTime > :maxResponseTime")
    List<SchemaRegistryEntity> findSlowSchemas(@Param("maxResponseTime") Double maxResponseTime);

    /**
     * Update health status for a service
     */
    @Modifying
    @Transactional
    @Query("UPDATE SchemaRegistryEntity s SET s.healthStatus = :healthStatus, s.lastHealthCheck = :checkTime WHERE s.serviceName = :serviceName")
    int updateHealthStatus(
            @Param("serviceName") String serviceName,
            @Param("healthStatus") HealthStatus healthStatus,
            @Param("checkTime") LocalDateTime checkTime);

    /**
     * Update performance metrics
     */
    @Modifying
    @Transactional
    @Query("UPDATE SchemaRegistryEntity s SET s.successCount = s.successCount + :successIncrement, s.errorCount = s.errorCount + :errorIncrement, s.averageResponseTime = :newAvgTime WHERE s.serviceName = :serviceName")
    int updatePerformanceMetrics(
            @Param("serviceName") String serviceName,
            @Param("successIncrement") Long successIncrement,
            @Param("errorIncrement") Long errorIncrement,
            @Param("newAvgTime") Double newAvgTime);

    /**
     * Increment error count for a service
     */
    @Modifying
    @Transactional
    @Query("UPDATE SchemaRegistryEntity s SET s.errorCount = s.errorCount + 1 WHERE s.serviceName = :serviceName")
    int incrementErrorCount(@Param("serviceName") String serviceName);

    /**
     * Increment success count for a service
     */
    @Modifying
    @Transactional
    @Query("UPDATE SchemaRegistryEntity s SET s.successCount = s.successCount + 1 WHERE s.serviceName = :serviceName")
    int incrementSuccessCount(@Param("serviceName") String serviceName);

    /**
     * Find schemas available for federation with health check
     */
    @Query("SELECT s FROM SchemaRegistryEntity s WHERE s.status = 'ACTIVE' AND s.healthStatus IN ('HEALTHY', 'DEGRADED') AND (s.successCount * 100.0 / NULLIF(s.errorCount + s.successCount, 0)) > :minSuccessRate")
    List<SchemaRegistryEntity> findHealthySchemasForFederation(@Param("minSuccessRate") Double minSuccessRate);

    /**
     * Count schemas by status
     */
    @Query("SELECT s.status, COUNT(s) FROM SchemaRegistryEntity s GROUP BY s.status")
    List<Object[]> countSchemasByStatus();

    /**
     * Count schemas by health status
     */
    @Query("SELECT s.healthStatus, COUNT(s) FROM SchemaRegistryEntity s GROUP BY s.healthStatus")
    List<Object[]> countSchemasByHealthStatus();

    /**
     * Find schemas with metadata key-value
     */
    @Query("SELECT s FROM SchemaRegistryEntity s JOIN s.metadata m WHERE KEY(m) = :key AND VALUE(m) = :value")
    List<SchemaRegistryEntity> findByMetadata(@Param("key") String key, @Param("value") String value);

    /**
     * Find schemas containing metadata key
     */
    @Query("SELECT s FROM SchemaRegistryEntity s JOIN s.metadata m WHERE KEY(m) = :key")
    List<SchemaRegistryEntity> findByMetadataKey(@Param("key") String key);

    /**
     * Calculate average response time for healthy services
     */
    @Query("SELECT AVG(s.averageResponseTime) FROM SchemaRegistryEntity s WHERE s.healthStatus = 'HEALTHY' AND s.status = 'ACTIVE'")
    Double calculateAverageResponseTimeForHealthyServices();

    /**
     * Find top performing schemas by success rate
     */
    @Query("SELECT s FROM SchemaRegistryEntity s WHERE s.successCount > 0 ORDER BY (s.successCount * 100.0 / (s.errorCount + s.successCount)) DESC")
    List<SchemaRegistryEntity> findTopPerformingSchemas(Pageable pageable);

    /**
     * Reset performance counters for maintenance
     */
    @Modifying
    @Transactional
    @Query("UPDATE SchemaRegistryEntity s SET s.errorCount = 0, s.successCount = 0, s.averageResponseTime = 0.0 WHERE s.serviceName = :serviceName")
    int resetPerformanceCounters(@Param("serviceName") String serviceName);

    /**
     * Find services that haven't been updated recently
     */
    @Query("SELECT s FROM SchemaRegistryEntity s WHERE s.updatedAt < :staleDate ORDER BY s.updatedAt ASC")
    List<SchemaRegistryEntity> findStaleSchemas(@Param("staleDate") LocalDateTime staleDate);

    /**
     * Bulk update status for maintenance
     */
    @Modifying
    @Transactional
    @Query("UPDATE SchemaRegistryEntity s SET s.status = :newStatus WHERE s.serviceName IN :serviceNames")
    int bulkUpdateStatus(@Param("serviceNames") List<String> serviceNames, @Param("newStatus") SchemaStatus newStatus);

    /**
     * Find schemas with specific schema hash for duplicate detection
     */
    List<SchemaRegistryEntity> findBySchemaHash(String schemaHash);

    /**
     * Check if service name already exists
     */
    boolean existsByServiceName(String serviceName);

    /**
     * Find schemas created within date range
     */
    @Query("SELECT s FROM SchemaRegistryEntity s WHERE s.createdAt BETWEEN :startDate AND :endDate ORDER BY s.createdAt DESC")
    List<SchemaRegistryEntity> findSchemasCreatedBetween(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);
}
