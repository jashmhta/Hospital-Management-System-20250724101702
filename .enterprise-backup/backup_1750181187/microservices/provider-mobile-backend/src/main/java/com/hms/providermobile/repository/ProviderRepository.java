package com.hms.providermobile.repository;

import com.hms.providermobile.entity.Provider;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Provider Repository
 * 
 * Advanced repository for Provider entity with custom queries,
 * performance optimization, and healthcare-specific operations.
 */
@Repository
public interface ProviderRepository extends JpaRepository<Provider, Long>, JpaSpecificationExecutor<Provider> {

    // Basic finder methods
    Optional<Provider> findByEmployeeId(String employeeId);
    
    Optional<Provider> findByEmail(String email);
    
    Optional<Provider> findByLicenseNumber(String licenseNumber);
    
    Optional<Provider> findByEmployeeIdAndStatus(String employeeId, Provider.ProviderStatus status);

    // Provider authentication and mobile access
    @Query("SELECT p FROM Provider p WHERE p.email = :email AND p.status = 'ACTIVE' AND p.mobileDeviceRegistered = true")
    Optional<Provider> findActiveProviderWithMobileAccess(@Param("email") String email);
    
    @Query("SELECT p FROM Provider p WHERE p.employeeId = :employeeId AND p.status = 'ACTIVE'")
    Optional<Provider> findActiveProviderByEmployeeId(@Param("employeeId") String employeeId);

    // Specialty and department queries
    List<Provider> findBySpecialtyAndStatus(String specialty, Provider.ProviderStatus status);
    
    List<Provider> findByDepartmentIdAndStatus(Long departmentId, Provider.ProviderStatus status);
    
    @Query("SELECT p FROM Provider p WHERE p.specialty IN :specialties AND p.status = 'ACTIVE' ORDER BY p.lastName, p.firstName")
    List<Provider> findActiveProvidersBySpecialties(@Param("specialties") List<String> specialties);

    // Mobile device management
    @Query("SELECT p FROM Provider p WHERE p.mobileDeviceRegistered = true AND p.status = 'ACTIVE'")
    List<Provider> findProvidersWithMobileAccess();
    
    @Query("SELECT COUNT(p) FROM Provider p WHERE p.mobileDeviceRegistered = true AND p.status = 'ACTIVE'")
    Long countProvidersWithMobileAccess();

    // Recent activity and session management
    @Query("SELECT p FROM Provider p WHERE p.lastLogin >= :since AND p.status = 'ACTIVE' ORDER BY p.lastLogin DESC")
    List<Provider> findProvidersLoggedInSince(@Param("since") LocalDateTime since);
    
    @Query("SELECT p FROM Provider p WHERE p.lastLogin < :threshold AND p.status = 'ACTIVE'")
    List<Provider> findInactiveProviders(@Param("threshold") LocalDateTime threshold);

    // Department and organization queries
    @Query("SELECT p FROM Provider p WHERE p.departmentId = :departmentId AND p.status = 'ACTIVE' ORDER BY p.lastName, p.firstName")
    Page<Provider> findActiveProvidersByDepartment(@Param("departmentId") Long departmentId, Pageable pageable);
    
    @Query("SELECT DISTINCT p.specialty FROM Provider p WHERE p.status = 'ACTIVE' AND p.specialty IS NOT NULL ORDER BY p.specialty")
    List<String> findDistinctActiveSpecialties();
    
    @Query("SELECT DISTINCT p.departmentName FROM Provider p WHERE p.status = 'ACTIVE' AND p.departmentName IS NOT NULL ORDER BY p.departmentName")
    List<String> findDistinctActiveDepartments();

    // Provider type and role queries
    List<Provider> findByProviderTypeAndStatus(Provider.ProviderType providerType, Provider.ProviderStatus status);
    
    @Query("SELECT p FROM Provider p WHERE p.providerType IN :types AND p.status = 'ACTIVE' ORDER BY p.specialty, p.lastName")
    List<Provider> findActiveProvidersByTypes(@Param("types") List<Provider.ProviderType> types);

    // Search and filtering queries
    @Query("SELECT p FROM Provider p WHERE " +
           "(LOWER(p.firstName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(p.lastName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(p.email) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(p.employeeId) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(p.specialty) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) AND " +
           "p.status = 'ACTIVE'")
    Page<Provider> searchActiveProviders(@Param("searchTerm") String searchTerm, Pageable pageable);

    // Bulk operations and updates
    @Modifying
    @Transactional
    @Query("UPDATE Provider p SET p.lastLogin = :loginTime WHERE p.id = :providerId")
    int updateLastLogin(@Param("providerId") Long providerId, @Param("loginTime") LocalDateTime loginTime);
    
    @Modifying
    @Transactional
    @Query("UPDATE Provider p SET p.mobileDeviceRegistered = :registered WHERE p.id = :providerId")
    int updateMobileDeviceRegistration(@Param("providerId") Long providerId, @Param("registered") Boolean registered);
    
    @Modifying
    @Transactional
    @Query("UPDATE Provider p SET p.status = :status WHERE p.id IN :providerIds")
    int bulkUpdateStatus(@Param("providerIds") List<Long> providerIds, @Param("status") Provider.ProviderStatus status);

    // Analytics and reporting queries
    @Query("SELECT p.specialty, COUNT(p) FROM Provider p WHERE p.status = 'ACTIVE' GROUP BY p.specialty ORDER BY COUNT(p) DESC")
    List<Object[]> getProviderCountBySpecialty();
    
    @Query("SELECT p.departmentName, COUNT(p) FROM Provider p WHERE p.status = 'ACTIVE' GROUP BY p.departmentName ORDER BY COUNT(p) DESC")
    List<Object[]> getProviderCountByDepartment();
    
    @Query("SELECT p.providerType, COUNT(p) FROM Provider p WHERE p.status = 'ACTIVE' GROUP BY p.providerType ORDER BY COUNT(p) DESC")
    List<Object[]> getProviderCountByType();

    // Mobile app specific queries
    @Query("SELECT p FROM Provider p WHERE p.mobileDeviceRegistered = true AND " +
           "p.preferences.notificationEnabled = true AND p.status = 'ACTIVE'")
    List<Provider> findProvidersEligibleForNotifications();
    
    @Query("SELECT p FROM Provider p WHERE p.twoFactorEnabled = true AND p.status = 'ACTIVE'")
    List<Provider> findProvidersWithTwoFactorAuth();

    // Compliance and audit queries
    @Query("SELECT p FROM Provider p WHERE p.createdAt >= :startDate AND p.createdAt <= :endDate ORDER BY p.createdAt DESC")
    List<Provider> findProvidersCreatedBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT p FROM Provider p WHERE p.status = :status AND p.updatedAt >= :since ORDER BY p.updatedAt DESC")
    List<Provider> findProvidersByStatusUpdatedSince(@Param("status") Provider.ProviderStatus status, @Param("since") LocalDateTime since);

    // Performance optimized queries with fetch joins
    @Query("SELECT DISTINCT p FROM Provider p " +
           "LEFT JOIN FETCH p.mobileSessions ms " +
           "WHERE p.id = :providerId AND ms.status = 'ACTIVE'")
    Optional<Provider> findProviderWithActiveSessions(@Param("providerId") Long providerId);
    
    @Query("SELECT DISTINCT p FROM Provider p " +
           "LEFT JOIN FETCH p.schedules s " +
           "WHERE p.status = 'ACTIVE' AND s.startTime >= :startDate AND s.endTime <= :endDate")
    List<Provider> findActiveProvidersWithSchedulesBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    // Custom validation queries
    @Query("SELECT COUNT(p) > 0 FROM Provider p WHERE p.email = :email AND p.id != :providerId")
    boolean existsByEmailAndIdNot(@Param("email") String email, @Param("providerId") Long providerId);
    
    @Query("SELECT COUNT(p) > 0 FROM Provider p WHERE p.licenseNumber = :licenseNumber AND p.id != :providerId")
    boolean existsByLicenseNumberAndIdNot(@Param("licenseNumber") String licenseNumber, @Param("providerId") Long providerId);
    
    @Query("SELECT COUNT(p) > 0 FROM Provider p WHERE p.employeeId = :employeeId AND p.id != :providerId")
    boolean existsByEmployeeIdAndIdNot(@Param("employeeId") String employeeId, @Param("providerId") Long providerId);

    // Emergency and critical care queries
    @Query("SELECT p FROM Provider p WHERE p.specialty IN ('Emergency Medicine', 'Critical Care', 'Intensive Care') " +
           "AND p.status = 'ACTIVE' AND p.mobileDeviceRegistered = true ORDER BY p.lastLogin DESC")
    List<Provider> findEmergencyCareProvidersWithMobileAccess();
    
    @Query("SELECT p FROM Provider p WHERE p.providerType IN ('PHYSICIAN', 'NURSE') " +
           "AND p.status = 'ACTIVE' AND p.preferences.criticalAlertsOnly = true")
    List<Provider> findProvidersForCriticalAlerts();
}
