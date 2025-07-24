package com.hospital.hms.patientportal.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * Patient Session Entity
 * 
 * Manages patient portal login sessions and authentication.
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Entity
@Table(name = "patient_sessions", indexes = {
    @Index(name = "idx_session_patient", columnList = "patient_id"),
    @Index(name = "idx_session_token", columnList = "session_token"),
    @Index(name = "idx_session_status", columnList = "status"),
    @Index(name = "idx_session_created", columnList = "created_at"),
    @Index(name = "idx_session_expires", columnList = "expires_at")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PatientSessionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "session_id")
    private String sessionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private PatientEntity patient;

    @Column(name = "session_token", unique = true, nullable = false, length = 500)
    private String sessionToken;

    @Column(name = "refresh_token", length = 500)
    private String refreshToken;

    @Column(name = "access_token", length = 500)
    private String accessToken;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    @Builder.Default
    private SessionStatus status = SessionStatus.ACTIVE;

    @Column(name = "ip_address", length = 45)
    private String ipAddress;

    @Column(name = "user_agent", length = 1000)
    private String userAgent;

    @Column(name = "device_type", length = 50)
    private String deviceType;

    @Column(name = "device_id", length = 100)
    private String deviceId;

    @Column(name = "browser", length = 100)
    private String browser;

    @Column(name = "operating_system", length = 100)
    private String operatingSystem;

    @Column(name = "location_country", length = 100)
    private String locationCountry;

    @Column(name = "location_city", length = 100)
    private String locationCity;

    @Column(name = "location_timezone", length = 50)
    private String locationTimezone;

    @Column(name = "login_method", length = 50)
    private String loginMethod;

    @Column(name = "mfa_verified")
    @Builder.Default
    private Boolean mfaVerified = false;

    @Column(name = "remember_me")
    @Builder.Default
    private Boolean rememberMe = false;

    @Column(name = "is_trusted_device")
    @Builder.Default
    private Boolean isTrustedDevice = false;

    @Column(name = "created_at", nullable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;

    @Column(name = "last_activity", nullable = false)
    private LocalDateTime lastActivity;

    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

    @Column(name = "terminated_at")
    private LocalDateTime terminatedAt;

    @Column(name = "termination_reason", length = 100)
    private String terminationReason;

    @Column(name = "page_views")
    @Builder.Default
    private Integer pageViews = 0;

    @Column(name = "actions_performed")
    @Builder.Default
    private Integer actionsPerformed = 0;

    @Column(name = "failed_attempts")
    @Builder.Default
    private Integer failedAttempts = 0;

    @Column(name = "security_warnings")
    @Builder.Default
    private Integer securityWarnings = 0;

    @Column(name = "is_concurrent_session")
    @Builder.Default
    private Boolean isConcurrentSession = false;

    @Column(name = "concurrent_session_count")
    @Builder.Default
    private Integer concurrentSessionCount = 1;

    @Column(name = "session_data", length = 4000)
    private String sessionData;

    @Column(name = "preferences", length = 2000)
    private String preferences;

    // Enums
    public enum SessionStatus {
        ACTIVE,
        EXPIRED,
        TERMINATED,
        SUSPICIOUS,
        LOCKED
    }

    // Helper methods
    public boolean isActive() {
        return status == SessionStatus.ACTIVE && 
               expiresAt.isAfter(LocalDateTime.now());
    }

    public boolean isExpired() {
        return expiresAt.isBefore(LocalDateTime.now()) || 
               status == SessionStatus.EXPIRED;
    }

    public boolean requiresRenewal() {
        return isActive() && 
               expiresAt.isBefore(LocalDateTime.now().plusMinutes(15));
    }

    public boolean isSuspicious() {
        return status == SessionStatus.SUSPICIOUS ||
               failedAttempts > 5 ||
               securityWarnings > 3;
    }

    public boolean isLongSession() {
        if (createdAt == null) return false;
        return java.time.Duration.between(createdAt, LocalDateTime.now()).toHours() > 8;
    }

    public boolean isFromDifferentLocation(String newIpAddress, String newLocationCountry) {
        return ipAddress != null && !ipAddress.equals(newIpAddress) &&
               locationCountry != null && !locationCountry.equals(newLocationCountry);
    }

    public void updateActivity() {
        this.lastActivity = LocalDateTime.now();
        this.pageViews++;
    }

    public void recordAction() {
        this.actionsPerformed++;
        updateActivity();
    }

    public void recordFailedAttempt() {
        this.failedAttempts++;
        if (this.failedAttempts > 5) {
            this.status = SessionStatus.SUSPICIOUS;
        }
    }

    public void recordSecurityWarning() {
        this.securityWarnings++;
        if (this.securityWarnings > 3) {
            this.status = SessionStatus.SUSPICIOUS;
        }
    }

    public void terminate(String reason) {
        this.status = SessionStatus.TERMINATED;
        this.terminatedAt = LocalDateTime.now();
        this.terminationReason = reason;
    }

    public void extend(int additionalMinutes) {
        if (isActive()) {
            this.expiresAt = this.expiresAt.plusMinutes(additionalMinutes);
        }
    }

    public long getRemainingMinutes() {
        if (!isActive()) return 0;
        return java.time.Duration.between(LocalDateTime.now(), expiresAt).toMinutes();
    }

    public double getSessionDurationHours() {
        LocalDateTime endTime = terminatedAt != null ? terminatedAt : LocalDateTime.now();
        return java.time.Duration.between(createdAt, endTime).toMinutes() / 60.0;
    }

    @PrePersist
    protected void onCreate() {
        if (lastActivity == null) {
            lastActivity = LocalDateTime.now();
        }
        if (expiresAt == null) {
            // Default session timeout: 8 hours for normal, 30 days for remember me
            int timeoutHours = Boolean.TRUE.equals(rememberMe) ? 24 * 30 : 8;
            expiresAt = LocalDateTime.now().plusHours(timeoutHours);
        }
    }

    @PreUpdate
    protected void onUpdate() {
        if (status == SessionStatus.EXPIRED && terminatedAt == null) {
            terminatedAt = LocalDateTime.now();
            terminationReason = "EXPIRED";
        }
    }
}