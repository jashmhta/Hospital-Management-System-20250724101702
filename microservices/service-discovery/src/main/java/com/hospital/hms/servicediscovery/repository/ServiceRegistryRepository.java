package com.hospital.hms.servicediscovery.repository;

import com.hospital.hms.servicediscovery.entity.ServiceRegistryEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Service Registry Repository
 * 
 * Advanced repository patterns with custom queries for service discovery operations.
 * Provides comprehensive data access layer for service registry management.
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Repository
public interface ServiceRegistryRepository extends JpaRepository<ServiceRegistryEntity, String> {

    /**
     * Find service by instance ID
     */
    Optional<ServiceRegistryEntity> findByInstanceId(String instanceId);

    /**
     * Find all services by service name
     */
    List<ServiceRegistryEntity> findByServiceNameIgnoreCase(String serviceName);

    /**
     * Find services by status
     */
    List<ServiceRegistryEntity> findByStatus(ServiceRegistryEntity.ServiceStatus status);

    /**
     * Find services by environment
     */
    List<ServiceRegistryEntity> findByEnvironment(String environment);

    /**
     * Find healthy services by service name
     */
    @Query("SELECT s FROM ServiceRegistryEntity s WHERE s.serviceName = :serviceName AND s.status = 'UP'")
    List<ServiceRegistryEntity> findHealthyServicesByName(@Param("serviceName") String serviceName);

    /**
     * Find services with recent heartbeat
     */
    @Query("SELECT s FROM ServiceRegistryEntity s WHERE s.lastHeartbeat > :threshold")
    List<ServiceRegistryEntity> findServicesWithRecentHeartbeat(@Param("threshold") LocalDateTime threshold);

    /**
     * Find expired services
     */
    @Query("SELECT s FROM ServiceRegistryEntity s WHERE s.lastHeartbeat < :threshold AND s.status != 'DOWN'")
    List<ServiceRegistryEntity> findExpiredServices(@Param("threshold") LocalDateTime threshold);

    /**
     * Count services by status
     */
    @Query("SELECT s.status, COUNT(s) FROM ServiceRegistryEntity s GROUP BY s.status")
    List<Object[]> countServicesByStatus();

    /**
     * Count services by environment
     */
    @Query("SELECT s.environment, COUNT(s) FROM ServiceRegistryEntity s GROUP BY s.environment")
    List<Object[]> countServicesByEnvironment();

    /**
     * Find services by zone
     */
    List<ServiceRegistryEntity> findByZone(String zone);

    /**
     * Find services registered in time range
     */
    @Query("SELECT s FROM ServiceRegistryEntity s WHERE s.createdAt BETWEEN :startTime AND :endTime")
    List<ServiceRegistryEntity> findServicesRegisteredBetween(
            @Param("startTime") LocalDateTime startTime, 
            @Param("endTime") LocalDateTime endTime);

    /**
     * Find services with uptime greater than threshold
     */
    @Query("SELECT s FROM ServiceRegistryEntity s WHERE s.uptimeMs > :uptimeThreshold")
    List<ServiceRegistryEntity> findServicesWithUptimeGreaterThan(@Param("uptimeThreshold") Long uptimeThreshold);

    /**
     * Search services by multiple criteria
     */
    @Query("SELECT s FROM ServiceRegistryEntity s WHERE " +
           "(:serviceName IS NULL OR s.serviceName LIKE %:serviceName%) AND " +
           "(:status IS NULL OR s.status = :status) AND " +
           "(:environment IS NULL OR s.environment = :environment) AND " +
           "(:zone IS NULL OR s.zone = :zone)")
    Page<ServiceRegistryEntity> findServicesByCriteria(
            @Param("serviceName") String serviceName,
            @Param("status") ServiceRegistryEntity.ServiceStatus status,
            @Param("environment") String environment,
            @Param("zone") String zone,
            Pageable pageable);

    /**
     * Update service status
     */
    @Modifying
    @Query("UPDATE ServiceRegistryEntity s SET s.status = :status, s.lastStatusUpdate = :updateTime WHERE s.instanceId = :instanceId")
    int updateServiceStatus(
            @Param("instanceId") String instanceId,
            @Param("status") ServiceRegistryEntity.ServiceStatus status,
            @Param("updateTime") LocalDateTime updateTime);

    /**
     * Update heartbeat timestamp
     */
    @Modifying
    @Query("UPDATE ServiceRegistryEntity s SET s.lastHeartbeat = :heartbeatTime WHERE s.instanceId = :instanceId")
    int updateHeartbeat(@Param("instanceId") String instanceId, @Param("heartbeatTime") LocalDateTime heartbeatTime);

    /**
     * Delete services by status
     */
    @Modifying
    @Query("DELETE FROM ServiceRegistryEntity s WHERE s.status = :status")
    int deleteServicesByStatus(@Param("status") ServiceRegistryEntity.ServiceStatus status);

    /**
     * Find services needing renewal
     */
    @Query("SELECT s FROM ServiceRegistryEntity s WHERE " +
           "s.lastHeartbeat < :renewalThreshold AND s.status = 'UP'")
    List<ServiceRegistryEntity> findServicesNeedingRenewal(@Param("renewalThreshold") LocalDateTime renewalThreshold);

    /**
     * Get service statistics
     */
    @Query("SELECT " +
           "COUNT(s) as totalServices, " +
           "COUNT(CASE WHEN s.status = 'UP' THEN 1 END) as upServices, " +
           "COUNT(CASE WHEN s.status = 'DOWN' THEN 1 END) as downServices, " +
           "AVG(s.uptimeMs) as averageUptime " +
           "FROM ServiceRegistryEntity s")
    Object[] getServiceStatistics();

    /**
     * Find duplicate service instances
     */
    @Query("SELECT s.serviceName, COUNT(s) FROM ServiceRegistryEntity s " +
           "WHERE s.status = 'UP' GROUP BY s.serviceName HAVING COUNT(s) > 1")
    List<Object[]> findDuplicateServiceInstances();

    /**
     * Find services by IP address range
     */
    @Query("SELECT s FROM ServiceRegistryEntity s WHERE s.ipAddress LIKE :ipPattern")
    List<ServiceRegistryEntity> findServicesByIpPattern(@Param("ipPattern") String ipPattern);

    /**
     * Find services with specific metadata
     */
    @Query("SELECT DISTINCT s FROM ServiceRegistryEntity s JOIN s.metadata m " +
           "WHERE m.metadataKey = :key AND m.metadataValue = :value")
    List<ServiceRegistryEntity> findServicesByMetadata(
            @Param("key") String key, 
            @Param("value") String value);

    /**
     * Get service health summary
     */
    @Query("SELECT s.serviceName, s.status, COUNT(s) as instanceCount " +
           "FROM ServiceRegistryEntity s GROUP BY s.serviceName, s.status")
    List<Object[]> getServiceHealthSummary();

    /**
     * Find oldest services
     */
    @Query("SELECT s FROM ServiceRegistryEntity s ORDER BY s.createdAt ASC")
    Page<ServiceRegistryEntity> findOldestServices(Pageable pageable);

    /**
     * Find most recently updated services
     */
    @Query("SELECT s FROM ServiceRegistryEntity s ORDER BY s.updatedAt DESC")
    Page<ServiceRegistryEntity> findRecentlyUpdatedServices(Pageable pageable);

    /**
     * Clean up stale services
     */
    @Modifying
    @Query("DELETE FROM ServiceRegistryEntity s WHERE s.lastHeartbeat < :staleThreshold")
    int cleanupStaleServices(@Param("staleThreshold") LocalDateTime staleThreshold);
}
