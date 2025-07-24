package com.hms.patientportal.entity;

import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Family Member Entity
 * 
 * Represents family members linked to a patient portal account,
 * allowing patients to manage healthcare information for dependents
 * and family members with appropriate permissions.
 */
@Entity
@Table(name = "family_members",
    indexes = {
        @Index(name = "idx_family_patient", columnList = "patient_id"),
        @Index(name = "idx_family_linked_patient", columnList = "linked_patient_id"),
        @Index(name = "idx_family_relationship", columnList = "relationship"),
        @Index(name = "idx_family_access_level", columnList = "access_level")
    }
)
@EntityListeners(AuditingEntityListener.class)
public class FamilyMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private PatientPortalUser patient;

    @Column(name = "linked_patient_id")
    private Long linkedPatientId;

    @Column(name = "first_name", nullable = false, length = 100)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 100)
    private String lastName;

    @Column(name = "middle_name", length = 100)
    private String middleName;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Enumerated(EnumType.STRING)
    @Column(name = "relationship", nullable = false)
    private Relationship relationship;

    @Column(name = "phone_number", length = 20)
    private String phoneNumber;

    @Column(name = "email", length = 255)
    private String email;

    @Column(name = "emergency_contact", nullable = false)
    private Boolean emergencyContact = false;

    @Column(name = "primary_contact", nullable = false)
    private Boolean primaryContact = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "access_level", nullable = false)
    private AccessLevel accessLevel;

    @Column(name = "can_view_medical_records", nullable = false)
    private Boolean canViewMedicalRecords = false;

    @Column(name = "can_schedule_appointments", nullable = false)
    private Boolean canScheduleAppointments = false;

    @Column(name = "can_receive_notifications", nullable = false)
    private Boolean canReceiveNotifications = false;

    @Column(name = "can_access_billing", nullable = false)
    private Boolean canAccessBilling = false;

    @Column(name = "can_communicate_providers", nullable = false)
    private Boolean canCommunicateProviders = false;

    @Column(name = "consent_form_signed", nullable = false)
    private Boolean consentFormSigned = false;

    @Column(name = "consent_signed_date")
    private LocalDateTime consentSignedDate;

    @Column(name = "consent_expires_date")
    private LocalDateTime consentExpiresDate;

    @Column(name = "hipaa_authorization_signed", nullable = false)
    private Boolean hipaaAuthorizationSigned = false;

    @Column(name = "hipaa_signed_date")
    private LocalDateTime hipaaSignedDate;

    @Column(name = "legal_guardian", nullable = false)
    private Boolean legalGuardian = false;

    @Column(name = "power_of_attorney", nullable = false)
    private Boolean powerOfAttorney = false;

    @Column(name = "power_of_attorney_type", length = 100)
    private String powerOfAttorneyType;

    @Column(name = "verification_status", nullable = false)
    @Enumerated(EnumType.STRING)
    private VerificationStatus verificationStatus = VerificationStatus.PENDING;

    @Column(name = "verification_method", length = 100)
    private String verificationMethod;

    @Column(name = "verified_by")
    private String verifiedBy;

    @Column(name = "verified_date")
    private LocalDateTime verifiedDate;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @Column(name = "deactivated_date")
    private LocalDateTime deactivatedDate;

    @Column(name = "deactivated_reason", length = 500)
    private String deactivatedReason;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

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
    public FamilyMember() {}

    public FamilyMember(PatientPortalUser patient, String firstName, String lastName, 
                       Relationship relationship, AccessLevel accessLevel) {
        this.patient = patient;
        this.firstName = firstName;
        this.lastName = lastName;
        this.relationship = relationship;
        this.accessLevel = accessLevel;
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

    public boolean canAccessMedicalData() {
        return isActive && verificationStatus == VerificationStatus.VERIFIED && 
               canViewMedicalRecords && hipaaAuthorizationSigned;
    }

    public boolean canMakeAppointments() {
        return isActive && verificationStatus == VerificationStatus.VERIFIED && 
               canScheduleAppointments && consentFormSigned;
    }

    public boolean hasValidConsent() {
        return consentFormSigned && (consentExpiresDate == null || 
               LocalDateTime.now().isBefore(consentExpiresDate));
    }

    public boolean isMinor() {
        return dateOfBirth != null && 
               LocalDate.now().minusYears(18).isBefore(dateOfBirth);
    }

    public boolean requiresLegalGuardianship() {
        return isMinor() && !legalGuardian && accessLevel.ordinal() > AccessLevel.VIEW_ONLY.ordinal();
    }

    public void activate() {
        this.isActive = true;
        this.deactivatedDate = null;
        this.deactivatedReason = null;
    }

    public void deactivate(String reason) {
        this.isActive = false;
        this.deactivatedDate = LocalDateTime.now();
        this.deactivatedReason = reason;
    }

    public void verify(String verifiedBy, String method) {
        this.verificationStatus = VerificationStatus.VERIFIED;
        this.verifiedBy = verifiedBy;
        this.verificationMethod = method;
        this.verifiedDate = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public PatientPortalUser getPatient() { return patient; }
    public void setPatient(PatientPortalUser patient) { this.patient = patient; }

    public Long getLinkedPatientId() { return linkedPatientId; }
    public void setLinkedPatientId(Long linkedPatientId) { this.linkedPatientId = linkedPatientId; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getMiddleName() { return middleName; }
    public void setMiddleName(String middleName) { this.middleName = middleName; }

    public LocalDate getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }

    public Relationship getRelationship() { return relationship; }
    public void setRelationship(Relationship relationship) { this.relationship = relationship; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public Boolean getEmergencyContact() { return emergencyContact; }
    public void setEmergencyContact(Boolean emergencyContact) { this.emergencyContact = emergencyContact; }

    public Boolean getPrimaryContact() { return primaryContact; }
    public void setPrimaryContact(Boolean primaryContact) { this.primaryContact = primaryContact; }

    public AccessLevel getAccessLevel() { return accessLevel; }
    public void setAccessLevel(AccessLevel accessLevel) { this.accessLevel = accessLevel; }

    public Boolean getCanViewMedicalRecords() { return canViewMedicalRecords; }
    public void setCanViewMedicalRecords(Boolean canViewMedicalRecords) { this.canViewMedicalRecords = canViewMedicalRecords; }

    public Boolean getCanScheduleAppointments() { return canScheduleAppointments; }
    public void setCanScheduleAppointments(Boolean canScheduleAppointments) { this.canScheduleAppointments = canScheduleAppointments; }

    public Boolean getCanReceiveNotifications() { return canReceiveNotifications; }
    public void setCanReceiveNotifications(Boolean canReceiveNotifications) { this.canReceiveNotifications = canReceiveNotifications; }

    public Boolean getCanAccessBilling() { return canAccessBilling; }
    public void setCanAccessBilling(Boolean canAccessBilling) { this.canAccessBilling = canAccessBilling; }

    public Boolean getCanCommunicateProviders() { return canCommunicateProviders; }
    public void setCanCommunicateProviders(Boolean canCommunicateProviders) { this.canCommunicateProviders = canCommunicateProviders; }

    public Boolean getConsentFormSigned() { return consentFormSigned; }
    public void setConsentFormSigned(Boolean consentFormSigned) { this.consentFormSigned = consentFormSigned; }

    public LocalDateTime getConsentSignedDate() { return consentSignedDate; }
    public void setConsentSignedDate(LocalDateTime consentSignedDate) { this.consentSignedDate = consentSignedDate; }

    public LocalDateTime getConsentExpiresDate() { return consentExpiresDate; }
    public void setConsentExpiresDate(LocalDateTime consentExpiresDate) { this.consentExpiresDate = consentExpiresDate; }

    public Boolean getHipaaAuthorizationSigned() { return hipaaAuthorizationSigned; }
    public void setHipaaAuthorizationSigned(Boolean hipaaAuthorizationSigned) { this.hipaaAuthorizationSigned = hipaaAuthorizationSigned; }

    public LocalDateTime getHipaaSignedDate() { return hipaaSignedDate; }
    public void setHipaaSignedDate(LocalDateTime hipaaSignedDate) { this.hipaaSignedDate = hipaaSignedDate; }

    public Boolean getLegalGuardian() { return legalGuardian; }
    public void setLegalGuardian(Boolean legalGuardian) { this.legalGuardian = legalGuardian; }

    public Boolean getPowerOfAttorney() { return powerOfAttorney; }
    public void setPowerOfAttorney(Boolean powerOfAttorney) { this.powerOfAttorney = powerOfAttorney; }

    public String getPowerOfAttorneyType() { return powerOfAttorneyType; }
    public void setPowerOfAttorneyType(String powerOfAttorneyType) { this.powerOfAttorneyType = powerOfAttorneyType; }

    public VerificationStatus getVerificationStatus() { return verificationStatus; }
    public void setVerificationStatus(VerificationStatus verificationStatus) { this.verificationStatus = verificationStatus; }

    public String getVerificationMethod() { return verificationMethod; }
    public void setVerificationMethod(String verificationMethod) { this.verificationMethod = verificationMethod; }

    public String getVerifiedBy() { return verifiedBy; }
    public void setVerifiedBy(String verifiedBy) { this.verifiedBy = verifiedBy; }

    public LocalDateTime getVerifiedDate() { return verifiedDate; }
    public void setVerifiedDate(LocalDateTime verifiedDate) { this.verifiedDate = verifiedDate; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public LocalDateTime getDeactivatedDate() { return deactivatedDate; }
    public void setDeactivatedDate(LocalDateTime deactivatedDate) { this.deactivatedDate = deactivatedDate; }

    public String getDeactivatedReason() { return deactivatedReason; }
    public void setDeactivatedReason(String deactivatedReason) { this.deactivatedReason = deactivatedReason; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

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
    public enum Relationship {
        SPOUSE,
        CHILD,
        PARENT,
        SIBLING,
        GRANDPARENT,
        GRANDCHILD,
        GUARDIAN,
        CAREGIVER,
        POWER_OF_ATTORNEY,
        OTHER
    }

    public enum AccessLevel {
        VIEW_ONLY,
        LIMITED_ACCESS,
        FULL_ACCESS,
        ADMINISTRATIVE
    }

    public enum VerificationStatus {
        PENDING,
        VERIFIED,
        REJECTED,
        EXPIRED
    }
}
