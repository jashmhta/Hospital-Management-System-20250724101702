package com.hospital.hms.provider.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Provider Mobile Session Entity
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Entity
@Table(name = "provider_mobile_sessions", indexes = {
    @Index(name = "idx_provider_id", columnList = "providerId"),
    @Index(name = "idx_session_token", columnList = "sessionToken"),
    @Index(name = "idx_device_id", columnList = "deviceId"),
    @Index(name = "idx_session_status", columnList = "sessionStatus"),
    @Index(name = "idx_last_activity", columnList = "lastActivityTime")
})
@EntityListeners(AuditingEntityListener.class)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProviderMobileSession {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotNull
    @Column(name = "provider_id", nullable = false)
    private UUID providerId;

    @Size(max = 200)
    @Column(name = "provider_name")
    private String providerName;

    @Size(max = 50)
    @Column(name = "provider_npi")
    private String providerNpi;

    @Size(max = 100)
    @Column(name = "provider_role")
    private String providerRole;

    @NotNull
    @Size(max = 255)
    @Column(name = "session_token", nullable = false, unique = true)
    private String sessionToken;

    @Size(max = 255)
    @Column(name = "refresh_token")
    private String refreshToken;

    @Size(max = 255)
    @Column(name = "device_id")
    private String deviceId;

    @Size(max = 50)
    @Column(name = "device_type")
    private String deviceType;

    @Size(max = 50)
    @Column(name = "platform")
    private String platform;

    @Size(max = 50)
    @Column(name = "app_version")
    private String appVersion;

    @Size(max = 100)
    @Column(name = "device_model")
    private String deviceModel;

    @Size(max = 50)
    @Column(name = "os_version")
    private String osVersion;

    @Enumerated(EnumType.STRING)
    @Column(name = "session_status")
    private SessionStatus sessionStatus;

    @Column(name = "login_time")
    private LocalDateTime loginTime;

    @Column(name = "last_activity_time")
    private LocalDateTime lastActivityTime;

    @Column(name = "logout_time")
    private LocalDateTime logoutTime;

    @Column(name = "expiry_time")
    private LocalDateTime expiryTime;

    @Size(max = 100)
    @Column(name = "login_ip_address")
    private String loginIpAddress;

    @Size(max = 200)
    @Column(name = "user_agent")
    private String userAgent;

    @Size(max = 100)
    @Column(name = "location")
    private String location;

    // Security Features
    @Column(name = "biometric_auth_enabled")
    private Boolean biometricAuthEnabled;

    @Column(name = "face_id_enabled")
    private Boolean faceIdEnabled;

    @Column(name = "touch_id_enabled")
    private Boolean touchIdEnabled;

    @Column(name = "pin_enabled")
    private Boolean pinEnabled;

    @Column(name = "remote_wipe_enabled")
    private Boolean remoteWipeEnabled;

    @Column(name = "screen_lock_timeout_minutes")
    private Integer screenLockTimeoutMinutes;

    // Push Notifications
    @Size(max = 500)
    @Column(name = "firebase_token")
    private String firebaseToken;

    @Column(name = "push_notifications_enabled")
    private Boolean pushNotificationsEnabled;

    @Column(name = "clinical_alerts_enabled")
    private Boolean clinicalAlertsEnabled;

    @Column(name = "patient_updates_enabled")
    private Boolean patientUpdatesEnabled;

    @Column(name = "schedule_notifications_enabled")
    private Boolean scheduleNotificationsEnabled;

    // Clinical Decision Support
    @Column(name = "cdss_enabled")
    private Boolean cdssEnabled;

    @Column(name = "drug_interaction_alerts")
    private Boolean drugInteractionAlerts;

    @Column(name = "allergy_alerts")
    private Boolean allergyAlerts;

    @Column(name = "clinical_guidelines_enabled")
    private Boolean clinicalGuidelinesEnabled;

    @Column(name = "best_practice_alerts")
    private Boolean bestPracticeAlerts;

    // Mobile Features
    @Column(name = "voice_dictation_enabled")
    private Boolean voiceDictationEnabled;

    @Column(name = "offline_mode_enabled")
    private Boolean offlineModeEnabled;

    @Column(name = "camera_access_enabled")
    private Boolean cameraAccessEnabled;

    @Column(name = "photo_capture_enabled")
    private Boolean photoCaptureEnabled;

    @Column(name = "barcode_scanning_enabled")
    private Boolean barcodeScanningEnabled;

    @Column(name = "signature_capture_enabled")
    private Boolean signatureCaptureEnabled;

    // Accessibility
    @Column(name = "large_font_enabled")
    private Boolean largeFontEnabled;

    @Column(name = "high_contrast_enabled")
    private Boolean highContrastEnabled;

    @Column(name = "voice_over_enabled")
    private Boolean voiceOverEnabled;

    @Size(max = 10)
    @Column(name = "preferred_language")
    private String preferredLanguage;

    // Activity Tracking
    @Column(name = "total_login_count")
    private Long totalLoginCount;

    @Column(name = "total_session_time_minutes")
    private Long totalSessionTimeMinutes;

    @Column(name = "total_patients_accessed")
    private Long totalPatientsAccessed;

    @Column(name = "total_orders_placed")
    private Long totalOrdersPlaced;

    @Column(name = "total_notes_created")
    private Long totalNotesCreated;

    @Column(name = "last_sync_time")
    private LocalDateTime lastSyncTime;

    // Data Usage
    @Column(name = "data_downloaded_mb")
    private Long dataDownloadedMb;

    @Column(name = "data_uploaded_mb")
    private Long dataUploadedMb;

    @Column(name = "cache_size_mb")
    private Long cacheSizeMb;

    @Column(name = "offline_data_size_mb")
    private Long offlineDataSizeMb;

    // Workflow Preferences
    @Enumerated(EnumType.STRING)
    @Column(name = "default_workflow")
    private WorkflowType defaultWorkflow;

    @Column(name = "quick_actions", columnDefinition = "TEXT")
    private String quickActions;

    @Column(name = "favorite_shortcuts", columnDefinition = "TEXT")
    private String favoriteShortcuts;

    @Column(name = "custom_templates", columnDefinition = "TEXT")
    private String customTemplates;

    // Compliance and Audit
    @Column(name = "hipaa_compliance_acknowledged")
    private Boolean hipaaComplianceAcknowledged;

    @Column(name = "privacy_training_completed")
    private Boolean privacyTrainingCompleted;

    @Column(name = "last_policy_acceptance_date")
    private LocalDateTime lastPolicyAcceptanceDate;

    @Column(name = "audit_trail_enabled")
    private Boolean auditTrailEnabled;

    // Emergency Features
    @Column(name = "emergency_access_enabled")
    private Boolean emergencyAccessEnabled;

    @Column(name = "panic_button_enabled")
    private Boolean panicButtonEnabled;

    @Column(name = "emergency_contact_info", columnDefinition = "TEXT")
    private String emergencyContactInfo;

    // Integration Settings
    @Column(name = "emr_integration_enabled")
    private Boolean emrIntegrationEnabled;

    @Column(name = "lab_integration_enabled")
    private Boolean labIntegrationEnabled;

    @Column(name = "pharmacy_integration_enabled")
    private Boolean pharmacyIntegrationEnabled;

    @Column(name = "imaging_integration_enabled")
    private Boolean imagingIntegrationEnabled;

    // FHIR Integration
    @Size(max = 100)
    @Column(name = "fhir_resource_id")
    private String fhirResourceId;

    @Size(max = 50)
    @Column(name = "fhir_resource_type")
    private String fhirResourceType;

    // Audit Information
    @CreatedBy
    @Size(max = 100)
    @Column(name = "created_by", updatable = false)
    private String createdBy;

    @CreatedDate
    @Column(name = "created_date", updatable = false)
    private LocalDateTime createdDate;

    @LastModifiedBy
    @Size(max = 100)
    @Column(name = "last_modified_by")
    private String lastModifiedBy;

    @LastModifiedDate
    @Column(name = "last_modified_date")
    private LocalDateTime lastModifiedDate;

    // Helper Methods
    public boolean isActive() {
        return sessionStatus == SessionStatus.ACTIVE;
    }

    public boolean isExpired() {
        return expiryTime != null && LocalDateTime.now().isAfter(expiryTime);
    }

    public boolean isIdle() {
        if (lastActivityTime == null || screenLockTimeoutMinutes == null) return false;
        return LocalDateTime.now().isAfter(lastActivityTime.plusMinutes(screenLockTimeoutMinutes));
    }

    public Long getCurrentSessionTimeMinutes() {
        if (loginTime == null) return 0L;
        LocalDateTime endTime = logoutTime != null ? logoutTime : LocalDateTime.now();
        return java.time.Duration.between(loginTime, endTime).toMinutes();
    }

    public boolean hasSecureAuth() {
        return Boolean.TRUE.equals(biometricAuthEnabled) || 
               Boolean.TRUE.equals(faceIdEnabled) || 
               Boolean.TRUE.equals(touchIdEnabled) ||
               Boolean.TRUE.equals(pinEnabled);
    }

    public boolean canReceivePushNotifications() {
        return Boolean.TRUE.equals(pushNotificationsEnabled) && firebaseToken != null;
    }

    public boolean isClinicalAlertsEnabled() {
        return Boolean.TRUE.equals(clinicalAlertsEnabled) && canReceivePushNotifications();
    }

    public boolean isOfflineCapable() {
        return Boolean.TRUE.equals(offlineModeEnabled);
    }
}
