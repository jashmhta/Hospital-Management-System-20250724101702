package com.hospital.hms.procedure.repository;

import com.hospital.hms.procedure.entity.ProcedureResourceEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Procedure Resource Repository
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Repository
public interface ProcedureResourceRepository extends JpaRepository<ProcedureResourceEntity, String> {

    /**
     * Find resources by procedure ID
     */
    List<ProcedureResourceEntity> findByProcedure_ProcedureIdOrderByAllocatedAtAsc(String procedureId);

    /**
     * Find resources by allocation status
     */
    List<ProcedureResourceEntity> findByAllocationStatusOrderByAllocatedAtAsc(ProcedureResourceEntity.AllocationStatus status);

    /**
     * Find resources by type and status
     */
    List<ProcedureResourceEntity> findByResourceTypeAndAllocationStatusOrderByAllocatedAtAsc(
        String resourceType, 
        ProcedureResourceEntity.AllocationStatus status
    );

    /**
     * Find conflicting resource allocations
     */
    @Query("SELECT pr FROM ProcedureResourceEntity pr WHERE " +
           "pr.resourceIdentifier = :resourceIdentifier AND " +
           "pr.allocationStatus IN ('RESERVED', 'ALLOCATED', 'IN_USE') AND " +
           "((pr.allocatedFrom BETWEEN :startTime AND :endTime) OR " +
           "(pr.allocatedTo BETWEEN :startTime AND :endTime) OR " +
           "(pr.allocatedFrom <= :startTime AND pr.allocatedTo >= :endTime))")
    List<ProcedureResourceEntity> findConflictingAllocations(
        @Param("resourceIdentifier") String resourceIdentifier,
        @Param("startTime") LocalDateTime startTime,
        @Param("endTime") LocalDateTime endTime
    );

    /**
     * Find resources allocated to specific staff member
     */
    @Query("SELECT pr FROM ProcedureResourceEntity pr WHERE " +
           "pr.resourceType = 'STAFF' AND " +
           "pr.resourceIdentifier = :staffId AND " +
           "pr.allocationStatus IN ('ALLOCATED', 'IN_USE') " +
           "ORDER BY pr.allocatedFrom ASC")
    List<ProcedureResourceEntity> findStaffAllocations(@Param("staffId") String staffId);

    /**
     * Find available resources by type
     */
    @Query("SELECT pr FROM ProcedureResourceEntity pr WHERE " +
           "pr.resourceType = :resourceType AND " +
           "pr.allocationStatus = 'AVAILABLE' " +
           "ORDER BY pr.allocatedAt ASC")
    List<ProcedureResourceEntity> findAvailableResourcesByType(@Param("resourceType") String resourceType);

    /**
     * Count allocated resources by type
     */
    long countByResourceTypeAndAllocationStatus(String resourceType, ProcedureResourceEntity.AllocationStatus status);

    /**
     * Find overdue resource releases
     */
    @Query("SELECT pr FROM ProcedureResourceEntity pr WHERE " +
           "pr.allocatedTo < :currentTime AND " +
           "pr.allocationStatus IN ('ALLOCATED', 'IN_USE') AND " +
           "pr.releasedAt IS NULL " +
           "ORDER BY pr.allocatedTo ASC")
    List<ProcedureResourceEntity> findOverdueReleases(@Param("currentTime") LocalDateTime currentTime);

    /**
     * Find resources by allocation date range
     */
    @Query("SELECT pr FROM ProcedureResourceEntity pr WHERE " +
           "pr.allocatedAt BETWEEN :startDate AND :endDate " +
           "ORDER BY pr.allocatedAt ASC")
    List<ProcedureResourceEntity> findByAllocationDateRange(
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );

    /**
     * Get resource utilization statistics
     */
    @Query("SELECT pr.resourceType, COUNT(pr), AVG(TIMESTAMPDIFF(MINUTE, pr.allocatedFrom, pr.allocatedTo)) " +
           "FROM ProcedureResourceEntity pr WHERE " +
           "pr.allocatedAt BETWEEN :startDate AND :endDate " +
           "GROUP BY pr.resourceType")
    List<Object[]> getResourceUtilizationStats(
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );

    /**
     * Find resource by identifier and procedure
     */
    Optional<ProcedureResourceEntity> findByResourceIdentifierAndProcedure_ProcedureId(
        String resourceIdentifier, 
        String procedureId
    );
}
