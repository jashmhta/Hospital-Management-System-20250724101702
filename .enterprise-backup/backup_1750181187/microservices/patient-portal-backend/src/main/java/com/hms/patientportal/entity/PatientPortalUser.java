package com.hms.patientportal.entity;

import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * Patient Portal User Entity
 * 
 * Represents a patient user account in the patient portal system.
 * Includes authentication, profile information, and portal preferences.
 */
@Entity
@Table(name = "patient_portal_users",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = "email"),
        @UniqueConstraint(columnNames = "patient_id"),
        @UniqueConstraint(columnNames = "portal_username")
    },
    indexes = {
        @Index(name = "idx_portal_user_email", columnList = "email"),
        @Index(name = "idx_portal_user_patient", columnList = "patient_id"),
        @Index(name = "idx_portal_user_status", columnList = "account_status"),
        @Index(name = "idx_portal_user_last_login", columnList = "last_login_at")
    }
)
@EntityListeners(AuditingEntityListener.class)
public class PatientPortalUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "patient_id", nullable = false, unique = true)
    private Long patientId;

    @Column(name = "portal_username", nullable = false, unique = true, length = 50)
    private String portalUsername;

    @Column(name = "email", nullable = false, unique = true, length = 255)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(name = "first_name", nullable = false, length = 100)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 100)
    private String lastName;

    @Column(name = "middle_name", length = 100)
    private String middleName;

    @Column(name = "date_of_birth", nullable = false)
    private LocalDate dateOfBirth;

    @Column(name = "phone_number", length = 20)
    private String phoneNumber;

    @Column(name = "address_line1", length = 255)
    private String addressLine1;

    @Column(name = "address_line2", length = 255)
    private String addressLine2;

    @Column(name = "city", length = 100)
    private String city;

    @Column(name = "state", length = 50)
    private String state;

    @Column(name = "zip_code", length = 10)
    private String zipCode;

    @Column(name = "country", length = 50)
    private String country = "USA";

    @Enumerated(EnumType.STRING)
    @Column(name = "account_status", nullable = false)
    private AccountStatus accountStatus = AccountStatus.ACTIVE;

    @Column(name = "email_verified", nullable = false)
    private Boolean emailVerified = false;

    @Column(name = "phone_verified", nullable = false)
    private Boolean phoneVerified = false;

    @Column(name = "two_factor_enabled", nullable = false)
    private Boolean twoFactorEnabled = false;

    @Column(name = "two_factor_secret")
    private String twoFactorSecret;

    @Column(name = "account_locked", nullable = false)
    private Boolean accountLocked = false;

    @Column(name = "locked_until")
    private LocalDateTime lockedUntil;

    @Column(name = "failed_login_attempts", nullable = false)
    private Integer failedLoginAttempts = 0;

    @Column(name = "last_login_at")
    private LocalDateTime lastLoginAt;

    @Column(name = "last_login_ip", length = 45)
    private String lastLoginIp;

    @Column(name = "password_changed_at")
    private LocalDateTime passwordChangedAt;

    @Column(name = "password_expires_at")
    private LocalDateTime passwordExpiresAt;

    @Column(name = "activation_token")
    private String activationToken;

    @Column(name = "activation_token_expires_at")
    private LocalDateTime activationTokenExpiresAt;

    @Column(name = "password_reset_token")
    private String passwordResetToken;

    @Column(name = "password_reset_token_expires_at")
    private LocalDateTime passwordResetTokenExpiresAt;

    @Embedded
    private PortalPreferences preferences;

    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<AppointmentRequest> appointmentRequests = new HashSet<>();

    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<PortalMessage> messages = new HashSet<>();

    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<FamilyMember> familyMembers = new HashSet<>();

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
    public PatientPortalUser() {}

    public PatientPortalUser(Long patientId, String portalUsername, String email, 
                           String firstName, String lastName, LocalDate dateOfBirth) {
        this.patientId = patientId;
        this.portalUsername = portalUsername;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.dateOfBirth = dateOfBirth;
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

    public boolean isActive() {
        return accountStatus == AccountStatus.ACTIVE && !accountLocked;
    }

    public boolean isLocked() {
        return accountLocked || (lockedUntil != null && LocalDateTime.now().isBefore(lockedUntil));
    }

    public boolean canLogin() {
        return isActive() && !isLocked() && emailVerified;
    }

    public void incrementFailedAttempts() {
        this.failedLoginAttempts++;
        if (this.failedLoginAttempts >= 5) {
            this.accountLocked = true;
            this.lockedUntil = LocalDateTime.now().plusHours(1); // Lock for 1 hour
        }
    }

    public void resetFailedAttempts() {
        this.failedLoginAttempts = 0;
        this.accountLocked = false;
        this.lockedUntil = null;
    }

    public String getFullAddress() {
        StringBuilder address = new StringBuilder();
        if (addressLine1 != null) address.append(addressLine1);
        if (addressLine2 != null) address.append(", ").append(addressLine2);
        if (city != null) address.append(", ").append(city);
        if (state != null) address.append(", ").append(state);
        if (zipCode != null) address.append(" ").append(zipCode);
        return address.toString();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getPatientId() { return patientId; }
    public void setPatientId(Long patientId) { this.patientId = patientId; }

    public String getPortalUsername() { return portalUsername; }
    public void setPortalUsername(String portalUsername) { this.portalUsername = portalUsername; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getMiddleName() { return middleName; }
    public void setMiddleName(String middleName) { this.middleName = middleName; }

    public LocalDate getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getAddressLine1() { return addressLine1; }
    public void setAddressLine1(String addressLine1) { this.addressLine1 = addressLine1; }

    public String getAddressLine2() { return addressLine2; }
    public void setAddressLine2(String addressLine2) { this.addressLine2 = addressLine2; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getZipCode() { return zipCode; }
    public void setZipCode(String zipCode) { this.zipCode = zipCode; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public AccountStatus getAccountStatus() { return accountStatus; }
    public void setAccountStatus(AccountStatus accountStatus) { this.accountStatus = accountStatus; }

    public Boolean getEmailVerified() { return emailVerified; }
    public void setEmailVerified(Boolean emailVerified) { this.emailVerified = emailVerified; }

    public Boolean getPhoneVerified() { return phoneVerified; }
    public void setPhoneVerified(Boolean phoneVerified) { this.phoneVerified = phoneVerified; }

    public Boolean getTwoFactorEnabled() { return twoFactorEnabled; }
    public void setTwoFactorEnabled(Boolean twoFactorEnabled) { this.twoFactorEnabled = twoFactorEnabled; }

    public String getTwoFactorSecret() { return twoFactorSecret; }
    public void setTwoFactorSecret(String twoFactorSecret) { this.twoFactorSecret = twoFactorSecret; }

    public Boolean getAccountLocked() { return accountLocked; }
    public void setAccountLocked(Boolean accountLocked) { this.accountLocked = accountLocked; }

    public LocalDateTime getLockedUntil() { return lockedUntil; }
    public void setLockedUntil(LocalDateTime lockedUntil) { this.lockedUntil = lockedUntil; }

    public Integer getFailedLoginAttempts() { return failedLoginAttempts; }
    public void setFailedLoginAttempts(Integer failedLoginAttempts) { this.failedLoginAttempts = failedLoginAttempts; }

    public LocalDateTime getLastLoginAt() { return lastLoginAt; }
    public void setLastLoginAt(LocalDateTime lastLoginAt) { this.lastLoginAt = lastLoginAt; }

    public String getLastLoginIp() { return lastLoginIp; }
    public void setLastLoginIp(String lastLoginIp) { this.lastLoginIp = lastLoginIp; }

    public LocalDateTime getPasswordChangedAt() { return passwordChangedAt; }
    public void setPasswordChangedAt(LocalDateTime passwordChangedAt) { this.passwordChangedAt = passwordChangedAt; }

    public LocalDateTime getPasswordExpiresAt() { return passwordExpiresAt; }
    public void setPasswordExpiresAt(LocalDateTime passwordExpiresAt) { this.passwordExpiresAt = passwordExpiresAt; }

    public String getActivationToken() { return activationToken; }
    public void setActivationToken(String activationToken) { this.activationToken = activationToken; }

    public LocalDateTime getActivationTokenExpiresAt() { return activationTokenExpiresAt; }
    public void setActivationTokenExpiresAt(LocalDateTime activationTokenExpiresAt) { this.activationTokenExpiresAt = activationTokenExpiresAt; }

    public String getPasswordResetToken() { return passwordResetToken; }
    public void setPasswordResetToken(String passwordResetToken) { this.passwordResetToken = passwordResetToken; }

    public LocalDateTime getPasswordResetTokenExpiresAt() { return passwordResetTokenExpiresAt; }
    public void setPasswordResetTokenExpiresAt(LocalDateTime passwordResetTokenExpiresAt) { this.passwordResetTokenExpiresAt = passwordResetTokenExpiresAt; }

    public PortalPreferences getPreferences() { return preferences; }
    public void setPreferences(PortalPreferences preferences) { this.preferences = preferences; }

    public Set<AppointmentRequest> getAppointmentRequests() { return appointmentRequests; }
    public void setAppointmentRequests(Set<AppointmentRequest> appointmentRequests) { this.appointmentRequests = appointmentRequests; }

    public Set<PortalMessage> getMessages() { return messages; }
    public void setMessages(Set<PortalMessage> messages) { this.messages = messages; }

    public Set<FamilyMember> getFamilyMembers() { return familyMembers; }
    public void setFamilyMembers(Set<FamilyMember> familyMembers) { this.familyMembers = familyMembers; }

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

    // Enums and Embedded Classes
    public enum AccountStatus {
        ACTIVE,
        INACTIVE,
        SUSPENDED,
        CLOSED,
        PENDING_VERIFICATION
    }

    @Embeddable
    public static class PortalPreferences {
        @Column(name = "email_notifications", nullable = false)
        private Boolean emailNotifications = true;

        @Column(name = "sms_notifications", nullable = false)
        private Boolean smsNotifications = false;

        @Column(name = "appointment_reminders", nullable = false)
        private Boolean appointmentReminders = true;

        @Column(name = "test_result_notifications", nullable = false)
        private Boolean testResultNotifications = true;

        @Column(name = "billing_notifications", nullable = false)
        private Boolean billingNotifications = true;

        @Column(name = "prescription_reminders", nullable = false)
        private Boolean prescriptionReminders = true;

        @Column(name = "marketing_communications", nullable = false)
        private Boolean marketingCommunications = false;

        @Enumerated(EnumType.STRING)
        @Column(name = "language_preference")
        private LanguagePreference languagePreference = LanguagePreference.ENGLISH;

        @Enumerated(EnumType.STRING)
        @Column(name = "communication_preference")
        private CommunicationPreference communicationPreference = CommunicationPreference.EMAIL;

        @Column(name = "data_sharing_consent", nullable = false)
        private Boolean dataSharingConsent = false;

        @Column(name = "research_participation_consent", nullable = false)
        private Boolean researchParticipationConsent = false;

        // Getters and Setters
        public Boolean getEmailNotifications() { return emailNotifications; }
        public void setEmailNotifications(Boolean emailNotifications) { this.emailNotifications = emailNotifications; }

        public Boolean getSmsNotifications() { return smsNotifications; }
        public void setSmsNotifications(Boolean smsNotifications) { this.smsNotifications = smsNotifications; }

        public Boolean getAppointmentReminders() { return appointmentReminders; }
        public void setAppointmentReminders(Boolean appointmentReminders) { this.appointmentReminders = appointmentReminders; }

        public Boolean getTestResultNotifications() { return testResultNotifications; }
        public void setTestResultNotifications(Boolean testResultNotifications) { this.testResultNotifications = testResultNotifications; }

        public Boolean getBillingNotifications() { return billingNotifications; }
        public void setBillingNotifications(Boolean billingNotifications) { this.billingNotifications = billingNotifications; }

        public Boolean getPrescriptionReminders() { return prescriptionReminders; }
        public void setPrescriptionReminders(Boolean prescriptionReminders) { this.prescriptionReminders = prescriptionReminders; }

        public Boolean getMarketingCommunications() { return marketingCommunications; }
        public void setMarketingCommunications(Boolean marketingCommunications) { this.marketingCommunications = marketingCommunications; }

        public LanguagePreference getLanguagePreference() { return languagePreference; }
        public void setLanguagePreference(LanguagePreference languagePreference) { this.languagePreference = languagePreference; }

        public CommunicationPreference getCommunicationPreference() { return communicationPreference; }
        public void setCommunicationPreference(CommunicationPreference communicationPreference) { this.communicationPreference = communicationPreference; }

        public Boolean getDataSharingConsent() { return dataSharingConsent; }
        public void setDataSharingConsent(Boolean dataSharingConsent) { this.dataSharingConsent = dataSharingConsent; }

        public Boolean getResearchParticipationConsent() { return researchParticipationConsent; }
        public void setResearchParticipationConsent(Boolean researchParticipationConsent) { this.researchParticipationConsent = researchParticipationConsent; }

        public enum LanguagePreference {
            ENGLISH, SPANISH, FRENCH, GERMAN, CHINESE, JAPANESE, KOREAN, ARABIC
        }

        public enum CommunicationPreference {
            EMAIL, SMS, PHONE, POSTAL_MAIL
        }
    }
}
