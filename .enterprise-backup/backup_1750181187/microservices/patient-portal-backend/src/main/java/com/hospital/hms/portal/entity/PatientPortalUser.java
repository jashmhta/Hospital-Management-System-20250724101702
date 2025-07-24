package com.hospital.hms.portal.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
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
 * Patient Portal User Entity
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Entity
@Table(name = "patient_portal_users", indexes = {
    @Index(name = "idx_patient_id", columnList = "patientId"),
    @Index(name = "idx_username", columnList = "username"),
    @Index(name = "idx_email", columnList = "email"),
    @Index(name = "idx_mobile_device_id", columnList = "mobileDeviceId"),
    @Index(name = "idx_account_status", columnList = "accountStatus")
})
@EntityListeners(AuditingEntityListener.class)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PatientPortalUser {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotNull
    @Column(name = "patient_id", nullable = false, unique = true)
    private UUID patientId;

    @NotNull
    @Size(max = 100)
    @Column(name = "username", nullable = false, unique = true)
    private String username;

    @NotNull
    @Email
    @Size(max = 200)
    @Column(name = "email", nullable = false)
    private String email;

    @Size(max = 20)
    @Column(name = "phone_number")
    private String phoneNumber;

    @Size(max = 255)
    @Column(name = "password_hash")
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(name = "account_status")
    private AccountStatus accountStatus;

    @Column(name = "email_verified")
    private Boolean emailVerified;

    @Column(name = "phone_verified")
    private Boolean phoneVerified;

    @Column(name = "two_factor_enabled")
    private Boolean twoFactorEnabled;

    @Column(name = "last_login_date")
    private LocalDateTime lastLoginDate;

    @Size(max = 100)
    @Column(name = "last_login_ip")
    private String lastLoginIp;

    @Column(name = "failed_login_attempts")
    private Integer failedLoginAttempts;

    @Column(name = "account_locked_until")
    private LocalDateTime accountLockedUntil;

    @Column(name = "password_changed_date")
    private LocalDateTime passwordChangedDate;

    @Column(name = "terms_accepted")
    private Boolean termsAccepted;

    @Column(name = "terms_accepted_date")
    private LocalDateTime termsAcceptedDate;

    @Column(name = "privacy_policy_accepted")
    private Boolean privacyPolicyAccepted;

    @Column(name = "marketing_emails_consent")
    private Boolean marketingEmailsConsent;

    // Mobile App Integration
    @Size(max = 255)
    @Column(name = "mobile_device_id")
    private String mobileDeviceId;

    @Size(max = 50)
    @Column(name = "mobile_platform")
    private String mobilePlatform;

    @Size(max = 50)
    @Column(name = "app_version")
    private String appVersion;

    @Column(name = "push_notifications_enabled")
    private Boolean pushNotificationsEnabled;

    @Size(max = 500)
    @Column(name = "firebase_token")
    private String firebaseToken;

    @Column(name = "biometric_auth_enabled")
    private Boolean biometricAuthEnabled;

    // Preferences
    @Size(max = 10)
    @Column(name = "preferred_language")
    private String preferredLanguage;

    @Size(max = 50)
    @Column(name = "timezone")
    private String timezone;

    @Enumerated(EnumType.STRING)
    @Column(name = "notification_preference")
    private NotificationPreference notificationPreference;

    @Column(name = "appointment_reminders")
    private Boolean appointmentReminders;

    @Column(name = "medication_reminders")
    private Boolean medicationReminders;

    @Column(name = "lab_result_notifications")
    private Boolean labResultNotifications;

    @Column(name = "health_tips_enabled")
    private Boolean healthTipsEnabled;

    // Security
    @Size(max = 255)
    @Column(name = "recovery_email")
    private String recoveryEmail;

    @Size(max = 20)
    @Column(name = "recovery_phone")
    private String recoveryPhone;

    @Size(max = 500)
    @Column(name = "security_questions")
    private String securityQuestions;

    @Column(name = "session_timeout_minutes")
    private Integer sessionTimeoutMinutes;

    // Access Control
    @Column(name = "medical_records_access")
    private Boolean medicalRecordsAccess;

    @Column(name = "billing_access")
    private Boolean billingAccess;

    @Column(name = "appointment_booking_access")
    private Boolean appointmentBookingAccess;

    @Column(name = "prescription_access")
    private Boolean prescriptionAccess;

    @Column(name = "family_member_access")
    private Boolean familyMemberAccess;

    @Column(name = "proxy_access_granted_to")
    private UUID proxyAccessGrantedTo;

    @Column(name = "proxy_access_expiry")
    private LocalDateTime proxyAccessExpiry;

    // Activity Tracking
    @Column(name = "last_activity_date")
    private LocalDateTime lastActivityDate;

    @Column(name = "total_logins")
    private Long totalLogins;

    @Column(name = "total_appointments_booked")
    private Long totalAppointmentsBooked;

    @Column(name = "total_messages_sent")
    private Long totalMessagesSent;

    @Column(name = "profile_completion_percentage")
    private Integer profileCompletionPercentage;

    // Emergency Contacts (JSON stored as text)
    @Column(name = "emergency_contacts", columnDefinition = "TEXT")
    private String emergencyContacts;

    // Health Data Sharing
    @Column(name = "health_data_sharing_consent")
    private Boolean healthDataSharingConsent;

    @Column(name = "research_participation_consent")
    private Boolean researchParticipationConsent;

    @Column(name = "third_party_sharing_consent")
    private Boolean thirdPartySharingConsent;

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
        return accountStatus == AccountStatus.ACTIVE;
    }

    public boolean isLocked() {
        return accountLockedUntil != null && LocalDateTime.now().isBefore(accountLockedUntil);
    }

    public boolean isVerified() {
        return Boolean.TRUE.equals(emailVerified);
    }

    public boolean isPushNotificationsEnabled() {
        return Boolean.TRUE.equals(pushNotificationsEnabled) && firebaseToken != null;
    }

    public boolean canAccessMedicalRecords() {
        return Boolean.TRUE.equals(medicalRecordsAccess) && isActive();
    }

    public boolean canBookAppointments() {
        return Boolean.TRUE.equals(appointmentBookingAccess) && isActive();
    }

    public boolean hasTwoFactorEnabled() {
        return Boolean.TRUE.equals(twoFactorEnabled);
    }

    public boolean isSessionExpired() {
        if (sessionTimeoutMinutes == null || lastActivityDate == null) return false;
        return LocalDateTime.now().isAfter(lastActivityDate.plusMinutes(sessionTimeoutMinutes));
    }
}
