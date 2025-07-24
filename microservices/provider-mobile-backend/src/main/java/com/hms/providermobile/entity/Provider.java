package com.hms.providermobile.entity;

import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * Provider Entity
 * 
 * Represents a healthcare provider (doctor, nurse, specialist, etc.)
 * who uses the mobile application to access patient data and manage
 * clinical workflows.
 */
@Entity
@Table(name = "providers", 
    uniqueConstraints = {
        @UniqueConstraint(columnNames = "license_number"),
        @UniqueConstraint(columnNames = "email"),
        @UniqueConstraint(columnNames = "employee_id")
    },
    indexes = {
        @Index(name = "idx_provider_specialty", columnList = "specialty"),
        @Index(name = "idx_provider_department", columnList = "department_id"),
        @Index(name = "idx_provider_status", columnList = "status"),
        @Index(name = "idx_provider_last_login", columnList = "last_login")
    }
)
@EntityListeners(AuditingEntityListener.class)
public class Provider {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "employee_id", nullable = false, unique = true, length = 20)
    private String employeeId;

    @Column(name = "first_name", nullable = false, length = 100)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 100)
    private String lastName;

    @Column(name = "middle_name", length = 100)
    private String middleName;

    @Column(name = "email", nullable = false, unique = true, length = 255)
    private String email;

    @Column(name = "phone_number", length = 20)
    private String phoneNumber;

    @Column(name = "license_number", nullable = false, unique = true, length = 50)
    private String licenseNumber;

    @Enumerated(EnumType.STRING)
    @Column(name = "provider_type", nullable = false)
    private ProviderType providerType;

    @Column(name = "specialty", length = 100)
    private String specialty;

    @Column(name = "sub_specialty", length = 100)
    private String subSpecialty;

    @Column(name = "department_id")
    private Long departmentId;

    @Column(name = "department_name", length = 100)
    private String departmentName;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ProviderStatus status = ProviderStatus.ACTIVE;

    @Column(name = "hire_date")
    private LocalDateTime hireDate;

    @Column(name = "termination_date")
    private LocalDateTime terminationDate;

    @Column(name = "last_login")
    private LocalDateTime lastLogin;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(name = "two_factor_enabled", nullable = false)
    private Boolean twoFactorEnabled = false;

    @Column(name = "mobile_device_registered", nullable = false)
    private Boolean mobileDeviceRegistered = false;

    @Column(name = "profile_image_url")
    private String profileImageUrl;

    @Embedded
    private ProviderPreferences preferences;

    @OneToMany(mappedBy = "provider", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<MobileSession> mobileSessions = new HashSet<>();

    @OneToMany(mappedBy = "provider", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<ProviderSchedule> schedules = new HashSet<>();

    @OneToMany(mappedBy = "provider", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<ClinicalNote> clinicalNotes = new HashSet<>();

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "created_by", length = 100)
    private String createdBy;

    @Column(name = "updated_by", length = 100)
    private String updatedBy;

    @Version
    private Long version;

    // Constructors
    public Provider() {}

    public Provider(String employeeId, String firstName, String lastName, String email, 
                   String licenseNumber, ProviderType providerType) {
        this.employeeId = employeeId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.licenseNumber = licenseNumber;
        this.providerType = providerType;
    }

    // Utility methods
    public String getFullName() {
        StringBuilder fullName = new StringBuilder();
        fullName.append(firstName);
        if (middleName != null && !middleName.trim().isEmpty()) {
            fullName.append(" ").append(middleName);
        }
        fullName.append(" ").append(lastName);
        return fullName.toString();
    }

    public String getDisplayName() {
        return String.format("Dr. %s %s", firstName, lastName);
    }

    public boolean isActive() {
        return status == ProviderStatus.ACTIVE;
    }

    public boolean canAccessMobileApp() {
        return isActive() && mobileDeviceRegistered;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEmployeeId() { return employeeId; }
    public void setEmployeeId(String employeeId) { this.employeeId = employeeId; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getMiddleName() { return middleName; }
    public void setMiddleName(String middleName) { this.middleName = middleName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getLicenseNumber() { return licenseNumber; }
    public void setLicenseNumber(String licenseNumber) { this.licenseNumber = licenseNumber; }

    public ProviderType getProviderType() { return providerType; }
    public void setProviderType(ProviderType providerType) { this.providerType = providerType; }

    public String getSpecialty() { return specialty; }
    public void setSpecialty(String specialty) { this.specialty = specialty; }

    public String getSubSpecialty() { return subSpecialty; }
    public void setSubSpecialty(String subSpecialty) { this.subSpecialty = subSpecialty; }

    public Long getDepartmentId() { return departmentId; }
    public void setDepartmentId(Long departmentId) { this.departmentId = departmentId; }

    public String getDepartmentName() { return departmentName; }
    public void setDepartmentName(String departmentName) { this.departmentName = departmentName; }

    public ProviderStatus getStatus() { return status; }
    public void setStatus(ProviderStatus status) { this.status = status; }

    public LocalDateTime getHireDate() { return hireDate; }
    public void setHireDate(LocalDateTime hireDate) { this.hireDate = hireDate; }

    public LocalDateTime getTerminationDate() { return terminationDate; }
    public void setTerminationDate(LocalDateTime terminationDate) { this.terminationDate = terminationDate; }

    public LocalDateTime getLastLogin() { return lastLogin; }
    public void setLastLogin(LocalDateTime lastLogin) { this.lastLogin = lastLogin; }

    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }

    public Boolean getTwoFactorEnabled() { return twoFactorEnabled; }
    public void setTwoFactorEnabled(Boolean twoFactorEnabled) { this.twoFactorEnabled = twoFactorEnabled; }

    public Boolean getMobileDeviceRegistered() { return mobileDeviceRegistered; }
    public void setMobileDeviceRegistered(Boolean mobileDeviceRegistered) { this.mobileDeviceRegistered = mobileDeviceRegistered; }

    public String getProfileImageUrl() { return profileImageUrl; }
    public void setProfileImageUrl(String profileImageUrl) { this.profileImageUrl = profileImageUrl; }

    public ProviderPreferences getPreferences() { return preferences; }
    public void setPreferences(ProviderPreferences preferences) { this.preferences = preferences; }

    public Set<MobileSession> getMobileSessions() { return mobileSessions; }
    public void setMobileSessions(Set<MobileSession> mobileSessions) { this.mobileSessions = mobileSessions; }

    public Set<ProviderSchedule> getSchedules() { return schedules; }
    public void setSchedules(Set<ProviderSchedule> schedules) { this.schedules = schedules; }

    public Set<ClinicalNote> getClinicalNotes() { return clinicalNotes; }
    public void setClinicalNotes(Set<ClinicalNote> clinicalNotes) { this.clinicalNotes = clinicalNotes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }

    public String getUpdatedBy() { return updatedBy; }
    public void setUpdatedBy(String updatedBy) { this.updatedBy = updatedBy; }

    public Long getVersion() { return version; }
    public void setVersion(Long version) { this.version = version; }

    // Enums
    public enum ProviderType {
        PHYSICIAN,
        NURSE,
        NURSE_PRACTITIONER,
        PHYSICIAN_ASSISTANT,
        SPECIALIST,
        SURGEON,
        ANESTHESIOLOGIST,
        RADIOLOGIST,
        PATHOLOGIST,
        PHARMACIST,
        THERAPIST,
        TECHNICIAN,
        ADMINISTRATOR
    }

    public enum ProviderStatus {
        ACTIVE,
        INACTIVE,
        SUSPENDED,
        TERMINATED,
        ON_LEAVE,
        RETIRED
    }

    // Embedded class for provider preferences
    @Embeddable
    public static class ProviderPreferences {
        @Column(name = "notification_enabled", nullable = false)
        private Boolean notificationEnabled = true;

        @Column(name = "push_notifications", nullable = false)
        private Boolean pushNotifications = true;

        @Column(name = "email_notifications", nullable = false)
        private Boolean emailNotifications = true;

        @Column(name = "sms_notifications", nullable = false)
        private Boolean smsNotifications = false;

        @Column(name = "critical_alerts_only", nullable = false)
        private Boolean criticalAlertsOnly = false;

        @Column(name = "offline_sync_enabled", nullable = false)
        private Boolean offlineSyncEnabled = true;

        @Column(name = "auto_logout_minutes", nullable = false)
        private Integer autoLogoutMinutes = 30;

        @Enumerated(EnumType.STRING)
        @Column(name = "theme_preference")
        private ThemePreference themePreference = ThemePreference.LIGHT;

        @Enumerated(EnumType.STRING)
        @Column(name = "language_preference")
        private LanguagePreference languagePreference = LanguagePreference.ENGLISH;

        // Getters and Setters
        public Boolean getNotificationEnabled() { return notificationEnabled; }
        public void setNotificationEnabled(Boolean notificationEnabled) { this.notificationEnabled = notificationEnabled; }

        public Boolean getPushNotifications() { return pushNotifications; }
        public void setPushNotifications(Boolean pushNotifications) { this.pushNotifications = pushNotifications; }

        public Boolean getEmailNotifications() { return emailNotifications; }
        public void setEmailNotifications(Boolean emailNotifications) { this.emailNotifications = emailNotifications; }

        public Boolean getSmsNotifications() { return smsNotifications; }
        public void setSmsNotifications(Boolean smsNotifications) { this.smsNotifications = smsNotifications; }

        public Boolean getCriticalAlertsOnly() { return criticalAlertsOnly; }
        public void setCriticalAlertsOnly(Boolean criticalAlertsOnly) { this.criticalAlertsOnly = criticalAlertsOnly; }

        public Boolean getOfflineSyncEnabled() { return offlineSyncEnabled; }
        public void setOfflineSyncEnabled(Boolean offlineSyncEnabled) { this.offlineSyncEnabled = offlineSyncEnabled; }

        public Integer getAutoLogoutMinutes() { return autoLogoutMinutes; }
        public void setAutoLogoutMinutes(Integer autoLogoutMinutes) { this.autoLogoutMinutes = autoLogoutMinutes; }

        public ThemePreference getThemePreference() { return themePreference; }
        public void setThemePreference(ThemePreference themePreference) { this.themePreference = themePreference; }

        public LanguagePreference getLanguagePreference() { return languagePreference; }
        public void setLanguagePreference(LanguagePreference languagePreference) { this.languagePreference = languagePreference; }

        public enum ThemePreference {
            LIGHT, DARK, AUTO
        }

        public enum LanguagePreference {
            ENGLISH, SPANISH, FRENCH, GERMAN, CHINESE, JAPANESE
        }
    }
}
