package com.hms.providermobile.repository;

import com.hms.providermobile.entity.MobileSession;
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
 * Mobile Session Repository
 * 
 * Advanced repository for managing mobile application sessions
 * with security, audit trail, and performance optimization features.
 */
@Repository
public interface MobileSessionRepository extends JpaRepository<MobileSession, Long>, JpaSpecificationExecutor<MobileSession> {

    // Session authentication and validation
    Optional<MobileSession> findBySessionToken(String sessionToken);
    
    Optional<MobileSession> findByRefreshToken(String refreshToken);
    
    @Query("SELECT ms FROM MobileSession ms WHERE ms.sessionToken = :token AND ms.status = 'ACTIVE' AND ms.expiresAt > :now")
    Optional<MobileSession> findValidSessionByToken(@Param("token") String token, @Param("now") LocalDateTime now);

    // Provider-specific session queries
    List<MobileSession> findByProviderIdAndStatus(Long providerId, MobileSession.SessionStatus status);
    
    @Query("SELECT ms FROM MobileSession ms WHERE ms.provider.id = :providerId AND ms.status = 'ACTIVE' ORDER BY ms.lastActivity DESC")
    List<MobileSession> findActiveSessionsByProviderId(@Param("providerId") Long providerId);
    
    @Query("SELECT ms FROM MobileSession ms WHERE ms.provider.id = :providerId AND ms.status = 'ACTIVE' AND ms.expiresAt > :now")
    List<MobileSession> findValidSessionsByProviderId(@Param("providerId") Long providerId, @Param("now") LocalDateTime now);

    // Device management
    Optional<MobileSession> findByProviderIdAndDeviceIdAndStatus(Long providerId, String deviceId, MobileSession.SessionStatus status);
    
    @Query("SELECT ms FROM MobileSession ms WHERE ms.deviceId = :deviceId AND ms.status = 'ACTIVE' ORDER BY ms.createdAt DESC")
    List<MobileSession> findActiveSessionsByDeviceId(@Param("deviceId") String deviceId);
    
    @Query("SELECT COUNT(ms) FROM MobileSession ms WHERE ms.provider.id = :providerId AND ms.status = 'ACTIVE'")
    Long countActiveSessionsByProviderId(@Param("providerId") Long providerId);

    // Session cleanup and maintenance
    @Query("SELECT ms FROM MobileSession ms WHERE ms.expiresAt < :now AND ms.status = 'ACTIVE'")
    List<MobileSession> findExpiredActiveSessions(@Param("now") LocalDateTime now);
    
    @Query("SELECT ms FROM MobileSession ms WHERE ms.lastActivity < :threshold AND ms.status = 'ACTIVE'")
    List<MobileSession> findStaleActiveSessions(@Param("threshold") LocalDateTime threshold);
    
    @Query("SELECT ms FROM MobileSession ms WHERE ms.createdAt < :threshold AND ms.status != 'ACTIVE'")
    List<MobileSession> findOldInactiveSessions(@Param("threshold") LocalDateTime threshold);

    // Bulk operations
    @Modifying
    @Transactional
    @Query("UPDATE MobileSession ms SET ms.status = 'EXPIRED' WHERE ms.expiresAt < :now AND ms.status = 'ACTIVE'")
    int expireOldSessions(@Param("now") LocalDateTime now);
    
    @Modifying
    @Transactional
    @Query("UPDATE MobileSession ms SET ms.status = 'TERMINATED', ms.logoutTime = :logoutTime WHERE ms.provider.id = :providerId AND ms.status = 'ACTIVE'")
    int terminateAllProviderSessions(@Param("providerId") Long providerId, @Param("logoutTime") LocalDateTime logoutTime);
    
    @Modifying
    @Transactional
    @Query("UPDATE MobileSession ms SET ms.lastActivity = :now WHERE ms.sessionToken = :token")
    int updateLastActivity(@Param("token") String token, @Param("now") LocalDateTime now);

    // Security and monitoring queries
    @Query("SELECT ms FROM MobileSession ms WHERE ms.failedAttempts >= :threshold AND ms.status != 'LOCKED'")
    List<MobileSession> findSessionsWithHighFailedAttempts(@Param("threshold") Integer threshold);
    
    @Query("SELECT ms FROM MobileSession ms WHERE ms.lockedUntil < :now AND ms.status = 'LOCKED'")
    List<MobileSession> findSessionsToUnlock(@Param("now") LocalDateTime now);
    
    @Query("SELECT ms FROM MobileSession ms WHERE ms.ipAddress = :ipAddress AND ms.createdAt >= :since ORDER BY ms.createdAt DESC")
    List<MobileSession> findSessionsByIpAddressSince(@Param("ipAddress") String ipAddress, @Param("since") LocalDateTime since);

    // Analytics and reporting
    @Query("SELECT ms.deviceType, COUNT(ms) FROM MobileSession ms WHERE ms.createdAt >= :since GROUP BY ms.deviceType ORDER BY COUNT(ms) DESC")
    List<Object[]> getSessionCountByDeviceType(@Param("since") LocalDateTime since);
    
    @Query("SELECT ms.status, COUNT(ms) FROM MobileSession ms WHERE ms.createdAt >= :since GROUP BY ms.status ORDER BY COUNT(ms) DESC")
    List<Object[]> getSessionCountByStatus(@Param("since") LocalDateTime since);
    
    @Query("SELECT DATE(ms.createdAt) as sessionDate, COUNT(ms) FROM MobileSession ms WHERE ms.createdAt >= :since GROUP BY DATE(ms.createdAt) ORDER BY sessionDate DESC")
    List<Object[]> getDailySessionCounts(@Param("since") LocalDateTime since);

    // Push notification management
    @Query("SELECT DISTINCT ms.pushNotificationToken FROM MobileSession ms WHERE ms.status = 'ACTIVE' " +
           "AND ms.pushNotificationToken IS NOT NULL AND ms.provider.preferences.pushNotifications = true")
    List<String> findActivePushNotificationTokens();
    
    @Query("SELECT ms FROM MobileSession ms WHERE ms.status = 'ACTIVE' AND ms.pushNotificationToken IS NOT NULL " +
           "AND ms.provider.preferences.pushNotifications = true AND ms.provider.specialty IN :specialties")
    List<MobileSession> findActiveSessionsForSpecialtyNotifications(@Param("specialties") List<String> specialties);

    // Performance and optimization queries
    @Query("SELECT ms FROM MobileSession ms JOIN FETCH ms.provider p WHERE ms.sessionToken = :token AND ms.status = 'ACTIVE'")
    Optional<MobileSession> findValidSessionWithProvider(@Param("token") String token);
    
    @Query("SELECT COUNT(DISTINCT ms.provider.id) FROM MobileSession ms WHERE ms.lastActivity >= :since AND ms.status = 'ACTIVE'")
    Long countActiveProvidersInTimeRange(@Param("since") LocalDateTime since);

    // Geolocation and compliance
    @Query("SELECT ms FROM MobileSession ms WHERE ms.locationLatitude IS NOT NULL AND ms.locationLongitude IS NOT NULL " +
           "AND ms.status = 'ACTIVE' AND ms.lastActivity >= :since")
    List<MobileSession> findActiveSessionsWithLocation(@Param("since") LocalDateTime since);
    
    @Query("SELECT ms FROM MobileSession ms WHERE ms.biometricEnabled = true AND ms.status = 'ACTIVE'")
    List<MobileSession> findBiometricEnabledSessions();

    // Session history and audit
    @Query("SELECT ms FROM MobileSession ms WHERE ms.provider.id = :providerId AND ms.createdAt >= :startDate " +
           "AND ms.createdAt <= :endDate ORDER BY ms.createdAt DESC")
    Page<MobileSession> findProviderSessionHistory(@Param("providerId") Long providerId, 
                                                  @Param("startDate") LocalDateTime startDate, 
                                                  @Param("endDate") LocalDateTime endDate, 
                                                  Pageable pageable);
    
    @Query("SELECT ms FROM MobileSession ms WHERE ms.logoutTime IS NOT NULL AND ms.logoutTime >= :since ORDER BY ms.logoutTime DESC")
    List<MobileSession> findRecentLogouts(@Param("since") LocalDateTime since);

    // Custom validation and security checks
    @Query("SELECT COUNT(ms) FROM MobileSession ms WHERE ms.provider.id = :providerId AND ms.deviceId = :deviceId " +
           "AND ms.status = 'ACTIVE' AND ms.id != :sessionId")
    Long countActiveSessionsForProviderAndDevice(@Param("providerId") Long providerId, 
                                               @Param("deviceId") String deviceId, 
                                               @Param("sessionId") Long sessionId);
    
    @Query("SELECT ms FROM MobileSession ms WHERE ms.provider.email = :email AND ms.status = 'ACTIVE' " +
           "AND ms.expiresAt > :now ORDER BY ms.lastActivity DESC")
    List<MobileSession> findValidSessionsByProviderEmail(@Param("email") String email, @Param("now") LocalDateTime now);

    // Critical care and emergency access
    @Query("SELECT ms FROM MobileSession ms WHERE ms.provider.specialty IN ('Emergency Medicine', 'Critical Care') " +
           "AND ms.status = 'ACTIVE' AND ms.lastActivity >= :recentThreshold")
    List<MobileSession> findRecentEmergencyCareProviderSessions(@Param("recentThreshold") LocalDateTime recentThreshold);
    
    @Query("SELECT ms FROM MobileSession ms WHERE ms.provider.preferences.criticalAlertsOnly = true " +
           "AND ms.status = 'ACTIVE' AND ms.pushNotificationToken IS NOT NULL")
    List<MobileSession> findCriticalAlertEligibleSessions();
}
