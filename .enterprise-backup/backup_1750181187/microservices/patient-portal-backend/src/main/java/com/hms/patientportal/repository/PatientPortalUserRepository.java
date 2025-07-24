package com.hms.patientportal.repository;

import com.hms.patientportal.entity.PatientPortalUser;
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
 * Patient Portal User Repository
 * 
 * Advanced repository for patient portal user management with comprehensive
 * security, authentication, and patient data access capabilities.
 */
@Repository
public interface PatientPortalUserRepository extends JpaRepository<PatientPortalUser, Long>, JpaSpecificationExecutor<PatientPortalUser> {

    // Authentication and basic lookup methods
    Optional<PatientPortalUser> findByEmail(String email);
    
    Optional<PatientPortalUser> findByPortalUsername(String portalUsername);
    
    Optional<PatientPortalUser> findByPatientId(Long patientId);
    
    Optional<PatientPortalUser> findByEmailAndAccountStatus(String email, PatientPortalUser.AccountStatus status);

    // Active user authentication
    @Query("SELECT p FROM PatientPortalUser p WHERE p.email = :email AND p.accountStatus = 'ACTIVE' " +
           "AND p.accountLocked = false AND p.emailVerified = true")
    Optional<PatientPortalUser> findActiveUserByEmail(@Param("email") String email);
    
    @Query("SELECT p FROM PatientPortalUser p WHERE p.portalUsername = :username AND p.accountStatus = 'ACTIVE' " +
           "AND p.accountLocked = false AND p.emailVerified = true")
    Optional<PatientPortalUser> findActiveUserByUsername(@Param("username") String username);

    // Security and account management
    @Query("SELECT p FROM PatientPortalUser p WHERE p.accountLocked = true AND p.lockedUntil < :now")
    List<PatientPortalUser> findAccountsToUnlock(@Param("now") LocalDateTime now);
    
    @Query("SELECT p FROM PatientPortalUser p WHERE p.failedLoginAttempts >= :threshold AND p.accountLocked = false")
    List<PatientPortalUser> findUsersWithHighFailedAttempts(@Param("threshold") Integer threshold);
    
    @Query("SELECT p FROM PatientPortalUser p WHERE p.emailVerified = false AND p.createdAt < :threshold")
    List<PatientPortalUser> findUnverifiedUsersOlderThan(@Param("threshold") LocalDateTime threshold);

    // Token management for password reset and activation
    Optional<PatientPortalUser> findByActivationToken(String activationToken);
    
    Optional<PatientPortalUser> findByPasswordResetToken(String passwordResetToken);
    
    @Query("SELECT p FROM PatientPortalUser p WHERE p.activationToken = :token AND p.activationTokenExpiresAt > :now")
    Optional<PatientPortalUser> findByValidActivationToken(@Param("token") String token, @Param("now") LocalDateTime now);
    
    @Query("SELECT p FROM PatientPortalUser p WHERE p.passwordResetToken = :token AND p.passwordResetTokenExpiresAt > :now")
    Optional<PatientPortalUser> findByValidPasswordResetToken(@Param("token") String token, @Param("now") LocalDateTime now);

    // User activity and login tracking
    @Query("SELECT p FROM PatientPortalUser p WHERE p.lastLoginAt >= :since AND p.accountStatus = 'ACTIVE' ORDER BY p.lastLoginAt DESC")
    List<PatientPortalUser> findUsersLoggedInSince(@Param("since") LocalDateTime since);
    
    @Query("SELECT p FROM PatientPortalUser p WHERE p.lastLoginAt < :threshold AND p.accountStatus = 'ACTIVE'")
    List<PatientPortalUser> findInactiveUsers(@Param("threshold") LocalDateTime threshold);
    
    @Query("SELECT COUNT(p) FROM PatientPortalUser p WHERE p.lastLoginAt >= :since AND p.accountStatus = 'ACTIVE'")
    Long countActiveUsersInTimeRange(@Param("since") LocalDateTime since);

    // Patient demographic queries
    @Query("SELECT p FROM PatientPortalUser p WHERE p.city = :city AND p.accountStatus = 'ACTIVE'")
    List<PatientPortalUser> findActiveUsersByCity(@Param("city") String city);
    
    @Query("SELECT p FROM PatientPortalUser p WHERE p.state = :state AND p.accountStatus = 'ACTIVE'")
    List<PatientPortalUser> findActiveUsersByState(@Param("state") String state);
    
    @Query("SELECT p FROM PatientPortalUser p WHERE p.zipCode = :zipCode AND p.accountStatus = 'ACTIVE'")
    List<PatientPortalUser> findActiveUsersByZipCode(@Param("zipCode") String zipCode);

    // Search functionality
    @Query("SELECT p FROM PatientPortalUser p WHERE " +
           "(LOWER(p.firstName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(p.lastName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(p.email) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(p.portalUsername) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) AND " +
           "p.accountStatus = 'ACTIVE'")
    Page<PatientPortalUser> searchActiveUsers(@Param("searchTerm") String searchTerm, Pageable pageable);

    // Bulk operations
    @Modifying
    @Transactional
    @Query("UPDATE PatientPortalUser p SET p.lastLoginAt = :loginTime, p.lastLoginIp = :ipAddress WHERE p.id = :userId")
    int updateLastLogin(@Param("userId") Long userId, @Param("loginTime") LocalDateTime loginTime, @Param("ipAddress") String ipAddress);
    
    @Modifying
    @Transactional
    @Query("UPDATE PatientPortalUser p SET p.failedLoginAttempts = 0, p.accountLocked = false, p.lockedUntil = null WHERE p.id = :userId")
    int resetFailedLoginAttempts(@Param("userId") Long userId);
    
    @Modifying
    @Transactional
    @Query("UPDATE PatientPortalUser p SET p.emailVerified = true WHERE p.id = :userId")
    int markEmailAsVerified(@Param("userId") Long userId);

    // Analytics and reporting
    @Query("SELECT p.state, COUNT(p) FROM PatientPortalUser p WHERE p.accountStatus = 'ACTIVE' GROUP BY p.state ORDER BY COUNT(p) DESC")
    List<Object[]> getUserCountByState();
    
    @Query("SELECT p.city, COUNT(p) FROM PatientPortalUser p WHERE p.accountStatus = 'ACTIVE' GROUP BY p.city ORDER BY COUNT(p) DESC")
    List<Object[]> getUserCountByCity();
    
    @Query("SELECT DATE(p.createdAt) as registrationDate, COUNT(p) FROM PatientPortalUser p WHERE p.createdAt >= :since GROUP BY DATE(p.createdAt) ORDER BY registrationDate DESC")
    List<Object[]> getDailyRegistrationCounts(@Param("since") LocalDateTime since);

    // Notification preferences
    @Query("SELECT p FROM PatientPortalUser p WHERE p.preferences.emailNotifications = true AND p.accountStatus = 'ACTIVE'")
    List<PatientPortalUser> findUsersWithEmailNotificationsEnabled();
    
    @Query("SELECT p FROM PatientPortalUser p WHERE p.preferences.smsNotifications = true AND p.accountStatus = 'ACTIVE' AND p.phoneVerified = true")
    List<PatientPortalUser> findUsersWithSmsNotificationsEnabled();
    
    @Query("SELECT p FROM PatientPortalUser p WHERE p.preferences.appointmentReminders = true AND p.accountStatus = 'ACTIVE'")
    List<PatientPortalUser> findUsersWithAppointmentRemindersEnabled();

    // Compliance and audit queries
    @Query("SELECT p FROM PatientPortalUser p WHERE p.createdAt >= :startDate AND p.createdAt <= :endDate ORDER BY p.createdAt DESC")
    List<PatientPortalUser> findUsersCreatedBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT p FROM PatientPortalUser p WHERE p.passwordChangedAt < :threshold AND p.accountStatus = 'ACTIVE'")
    List<PatientPortalUser> findUsersWithExpiredPasswords(@Param("threshold") LocalDateTime threshold);
    
    @Query("SELECT p FROM PatientPortalUser p WHERE p.preferences.dataSharingConsent = true")
    List<PatientPortalUser> findUsersWithDataSharingConsent();

    // Two-factor authentication
    @Query("SELECT p FROM PatientPortalUser p WHERE p.twoFactorEnabled = true AND p.accountStatus = 'ACTIVE'")
    List<PatientPortalUser> findUsersWithTwoFactorEnabled();
    
    @Query("SELECT COUNT(p) FROM PatientPortalUser p WHERE p.twoFactorEnabled = true AND p.accountStatus = 'ACTIVE'")
    Long countUsersWithTwoFactorEnabled();

    // Family member management
    @Query("SELECT p FROM PatientPortalUser p JOIN p.familyMembers fm WHERE fm.linkedPatientId = :patientId")
    List<PatientPortalUser> findUsersWithFamilyMember(@Param("patientId") Long patientId);

    // Performance optimized queries with fetch joins
    @Query("SELECT DISTINCT p FROM PatientPortalUser p " +
           "LEFT JOIN FETCH p.appointmentRequests ar " +
           "WHERE p.id = :userId AND ar.status = 'PENDING'")
    Optional<PatientPortalUser> findUserWithPendingAppointments(@Param("userId") Long userId);
    
    @Query("SELECT DISTINCT p FROM PatientPortalUser p " +
           "LEFT JOIN FETCH p.messages m " +
           "WHERE p.id = :userId AND m.readAt IS NULL")
    Optional<PatientPortalUser> findUserWithUnreadMessages(@Param("userId") Long userId);

    // Custom validation queries
    @Query("SELECT COUNT(p) > 0 FROM PatientPortalUser p WHERE p.email = :email AND p.id != :userId")
    boolean existsByEmailAndIdNot(@Param("email") String email, @Param("userId") Long userId);
    
    @Query("SELECT COUNT(p) > 0 FROM PatientPortalUser p WHERE p.portalUsername = :username AND p.id != :userId")
    boolean existsByPortalUsernameAndIdNot(@Param("username") String username, @Param("userId") Long userId);
    
    @Query("SELECT COUNT(p) > 0 FROM PatientPortalUser p WHERE p.patientId = :patientId AND p.id != :userId")
    boolean existsByPatientIdAndIdNot(@Param("patientId") Long patientId, @Param("userId") Long userId);

    // Emergency contact and critical information access
    @Query("SELECT p FROM PatientPortalUser p WHERE p.phoneNumber = :phoneNumber AND p.phoneVerified = true")
    List<PatientPortalUser> findByVerifiedPhoneNumber(@Param("phoneNumber") String phoneNumber);
    
    @Query("SELECT p FROM PatientPortalUser p WHERE p.accountStatus = 'ACTIVE' AND p.emailVerified = true " +
           "AND p.phoneVerified = true AND p.twoFactorEnabled = true")
    List<PatientPortalUser> findFullyVerifiedUsers();

    // Password security queries
    @Query("SELECT COUNT(p) FROM PatientPortalUser p WHERE p.passwordChangedAt >= :since")
    Long countPasswordChangesInTimeRange(@Param("since") LocalDateTime since);
    
    @Query("SELECT p FROM PatientPortalUser p WHERE p.passwordExpiresAt < :now AND p.accountStatus = 'ACTIVE'")
    List<PatientPortalUser> findUsersWithExpiredPasswords(@Param("now") LocalDateTime now);
}
