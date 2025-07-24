package com.hms.providermobile.entity;

import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

/**
 * Mobile Session Entity
 * 
 * Tracks provider mobile app sessions including device information,
 * authentication status, and session management for healthcare providers.
 */
@Entity
@Table(name = "mobile_sessions",
    indexes = {
        @Index(name = "idx_session_provider", columnList = "provider_id"),
        @Index(name = "idx_session_token", columnList = "session_token"),
        @Index(name = "idx_session_device", columnList = "device_id"),
        @Index(name = "idx_session_status", columnList = "status"),
        @Index(name = "idx_session_created", columnList = "created_at")
    }
)
@EntityListeners(AuditingEntityListener.class)
public class MobileSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "provider_id", nullable = false)
    private Provider provider;

    @Column(name = "session_token", nullable = false, unique = true)
    private String sessionToken;

    @Column(name = "refresh_token")
    private String refreshToken;

    @Column(name = "device_id", nullable = false)
    private String deviceId;

    @Column(name = "device_name")
    private String deviceName;

    @Enumerated(EnumType.STRING)
    @Column(name = "device_type", nullable = false)
    private DeviceType deviceType;

    @Column(name = "app_version")
    private String appVersion;

    @Column(name = "os_version")
    private String osVersion;

    @Column(name = "ip_address")
    private String ipAddress;

    @Column(name = "user_agent")
    private String userAgent;

    @Column(name = "location_latitude")
    private Double locationLatitude;

    @Column(name = "location_longitude")
    private Double locationLongitude;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private SessionStatus status = SessionStatus.ACTIVE;

    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

    @Column(name = "last_activity")
    private LocalDateTime lastActivity;

    @Column(name = "logout_time")
    private LocalDateTime logoutTime;

    @Column(name = "push_notification_token")
    private String pushNotificationToken;

    @Column(name = "is_biometric_enabled")
    private Boolean biometricEnabled = false;

    @Column(name = "failed_attempts")
    private Integer failedAttempts = 0;

    @Column(name = "locked_until")
    private LocalDateTime lockedUntil;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Version
    private Long version;

    // Constructors
    public MobileSession() {}

    public MobileSession(Provider provider, String sessionToken, String deviceId, 
                        DeviceType deviceType, LocalDateTime expiresAt) {
        this.provider = provider;
        this.sessionToken = sessionToken;
        this.deviceId = deviceId;
        this.deviceType = deviceType;
        this.expiresAt = expiresAt;
        this.lastActivity = LocalDateTime.now();
    }

    // Utility methods
    public boolean isExpired() {
        return LocalDateTime.now().isAfter(expiresAt);
    }

    public boolean isLocked() {
        return lockedUntil != null && LocalDateTime.now().isBefore(lockedUntil);
    }

    public boolean isActive() {
        return status == SessionStatus.ACTIVE && !isExpired() && !isLocked();
    }

    public void updateLastActivity() {
        this.lastActivity = LocalDateTime.now();
    }

    public void incrementFailedAttempts() {
        this.failedAttempts = (this.failedAttempts == null) ? 1 : this.failedAttempts + 1;
        
        // Lock session after 5 failed attempts for 30 minutes
        if (this.failedAttempts >= 5) {
            this.lockedUntil = LocalDateTime.now().plusMinutes(30);
            this.status = SessionStatus.LOCKED;
        }
    }

    public void resetFailedAttempts() {
        this.failedAttempts = 0;
        this.lockedUntil = null;
        if (this.status == SessionStatus.LOCKED) {
            this.status = SessionStatus.ACTIVE;
        }
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Provider getProvider() { return provider; }
    public void setProvider(Provider provider) { this.provider = provider; }

    public String getSessionToken() { return sessionToken; }
    public void setSessionToken(String sessionToken) { this.sessionToken = sessionToken; }

    public String getRefreshToken() { return refreshToken; }
    public void setRefreshToken(String refreshToken) { this.refreshToken = refreshToken; }

    public String getDeviceId() { return deviceId; }
    public void setDeviceId(String deviceId) { this.deviceId = deviceId; }

    public String getDeviceName() { return deviceName; }
    public void setDeviceName(String deviceName) { this.deviceName = deviceName; }

    public DeviceType getDeviceType() { return deviceType; }
    public void setDeviceType(DeviceType deviceType) { this.deviceType = deviceType; }

    public String getAppVersion() { return appVersion; }
    public void setAppVersion(String appVersion) { this.appVersion = appVersion; }

    public String getOsVersion() { return osVersion; }
    public void setOsVersion(String osVersion) { this.osVersion = osVersion; }

    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }

    public String getUserAgent() { return userAgent; }
    public void setUserAgent(String userAgent) { this.userAgent = userAgent; }

    public Double getLocationLatitude() { return locationLatitude; }
    public void setLocationLatitude(Double locationLatitude) { this.locationLatitude = locationLatitude; }

    public Double getLocationLongitude() { return locationLongitude; }
    public void setLocationLongitude(Double locationLongitude) { this.locationLongitude = locationLongitude; }

    public SessionStatus getStatus() { return status; }
    public void setStatus(SessionStatus status) { this.status = status; }

    public LocalDateTime getExpiresAt() { return expiresAt; }
    public void setExpiresAt(LocalDateTime expiresAt) { this.expiresAt = expiresAt; }

    public LocalDateTime getLastActivity() { return lastActivity; }
    public void setLastActivity(LocalDateTime lastActivity) { this.lastActivity = lastActivity; }

    public LocalDateTime getLogoutTime() { return logoutTime; }
    public void setLogoutTime(LocalDateTime logoutTime) { this.logoutTime = logoutTime; }

    public String getPushNotificationToken() { return pushNotificationToken; }
    public void setPushNotificationToken(String pushNotificationToken) { this.pushNotificationToken = pushNotificationToken; }

    public Boolean getBiometricEnabled() { return biometricEnabled; }
    public void setBiometricEnabled(Boolean biometricEnabled) { this.biometricEnabled = biometricEnabled; }

    public Integer getFailedAttempts() { return failedAttempts; }
    public void setFailedAttempts(Integer failedAttempts) { this.failedAttempts = failedAttempts; }

    public LocalDateTime getLockedUntil() { return lockedUntil; }
    public void setLockedUntil(LocalDateTime lockedUntil) { this.lockedUntil = lockedUntil; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public Long getVersion() { return version; }
    public void setVersion(Long version) { this.version = version; }

    // Enums
    public enum DeviceType {
        IOS_IPHONE,
        IOS_IPAD,
        ANDROID_PHONE,
        ANDROID_TABLET,
        WEB_MOBILE,
        UNKNOWN
    }

    public enum SessionStatus {
        ACTIVE,
        EXPIRED,
        TERMINATED,
        LOCKED,
        SUSPENDED
    }
}
