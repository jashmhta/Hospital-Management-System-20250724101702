package com.hospital.hms.mpiintegration.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Patient Identity Entity for Master Patient Index
 * 
 * Represents a unique patient identity across the healthcare enterprise
 * with support for identity resolution and deduplication.
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Entity
@Table(name = "patient_identities", indexes = {
    @Index(name = "idx_patient_mpi_id", columnList = "mpi_id", unique = true),
    @Index(name = "idx_patient_external_id", columnList = "external_patient_id, source_system"),
    @Index(name = "idx_patient_ssn", columnList = "ssn"),
    @Index(name = "idx_patient_name_dob", columnList = "last_name, first_name, date_of_birth"),
    @Index(name = "idx_patient_status", columnList = "identity_status"),
    @Index(name = "idx_patient_created", columnList = "created_date")
})
@EntityListeners(AuditingEntityListener.class)
public class PatientIdentity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "mpi_id", unique = true, nullable = false, length = 50)
    @NotBlank(message = "MPI ID is required")
    @Size(max = 50, message = "MPI ID must not exceed 50 characters")
    private String mpiId;

    @Column(name = "external_patient_id", nullable = false, length = 100)
    @NotBlank(message = "External patient ID is required")
    @Size(max = 100, message = "External patient ID must not exceed 100 characters")
    private String externalPatientId;

    @Column(name = "source_system", nullable = false, length = 50)
    @NotBlank(message = "Source system is required")
    @Size(max = 50, message = "Source system must not exceed 50 characters")
    private String sourceSystem;

    @Column(name = "source_system_version", length = 20)
    @Size(max = 20, message = "Source system version must not exceed 20 characters")
    private String sourceSystemVersion;

    // Demographics
    @Column(name = "first_name", nullable = false, length = 100)
    @NotBlank(message = "First name is required")
    @Size(max = 100, message = "First name must not exceed 100 characters")
    private String firstName;

    @Column(name = "middle_name", length = 100)
    @Size(max = 100, message = "Middle name must not exceed 100 characters")
    private String middleName;

    @Column(name = "last_name", nullable = false, length = 100)
    @NotBlank(message = "Last name is required")
    @Size(max = 100, message = "Last name must not exceed 100 characters")
    private String lastName;

    @Column(name = "suffix", length = 20)
    @Size(max = 20, message = "Suffix must not exceed 20 characters")
    private String suffix;

    @Column(name = "preferred_name", length = 100)
    @Size(max = 100, message = "Preferred name must not exceed 100 characters")
    private String preferredName;

    @Column(name = "date_of_birth", nullable = false)
    @NotNull(message = "Date of birth is required")
    private LocalDate dateOfBirth;

    @Column(name = "gender", length = 20)
    @Enumerated(EnumType.STRING)
    private Gender gender;

    @Column(name = "ssn", length = 11)
    @Pattern(regexp = "^\\d{3}-\\d{2}-\\d{4}$", message = "Invalid SSN format")
    private String ssn;

    @Column(name = "mrn", length = 50)
    @Size(max = 50, message = "MRN must not exceed 50 characters")
    private String mrn;

    // Contact Information
    @Column(name = "phone_home", length = 20)
    @Pattern(regexp = "^[\\+]?[1-9][\\d\\s\\-\\(\\)]{7,15}$", message = "Invalid home phone format")
    private String phoneHome;

    @Column(name = "phone_mobile", length = 20)
    @Pattern(regexp = "^[\\+]?[1-9][\\d\\s\\-\\(\\)]{7,15}$", message = "Invalid mobile phone format")
    private String phoneMobile;

    @Column(name = "phone_work", length = 20)
    @Pattern(regexp = "^[\\+]?[1-9][\\d\\s\\-\\(\\)]{7,15}$", message = "Invalid work phone format")
    private String phoneWork;

    @Column(name = "email", length = 100)
    @Email(message = "Invalid email format")
    @Size(max = 100, message = "Email must not exceed 100 characters")
    private String email;

    // Address Information
    @Column(name = "address_line1", length = 200)
    @Size(max = 200, message = "Address line 1 must not exceed 200 characters")
    private String addressLine1;

    @Column(name = "address_line2", length = 200)
    @Size(max = 200, message = "Address line 2 must not exceed 200 characters")
    private String addressLine2;

    @Column(name = "city", length = 100)
    @Size(max = 100, message = "City must not exceed 100 characters")
    private String city;

    @Column(name = "state", length = 50)
    @Size(max = 50, message = "State must not exceed 50 characters")
    private String state;

    @Column(name = "postal_code", length = 20)
    @Size(max = 20, message = "Postal code must not exceed 20 characters")
    private String postalCode;

    @Column(name = "country", length = 50)
    @Size(max = 50, message = "Country must not exceed 50 characters")
    private String country = "USA";

    // Identity Management
    @Column(name = "identity_status", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    @NotNull(message = "Identity status is required")
    private IdentityStatus identityStatus = IdentityStatus.ACTIVE;

    @Column(name = "confidence_score", precision = 5, scale = 2)
    @DecimalMin(value = "0.0", message = "Confidence score must be non-negative")
    @DecimalMax(value = "100.0", message = "Confidence score must not exceed 100")
    private Double confidenceScore;

    @Column(name = "verification_status", length = 20)
    @Enumerated(EnumType.STRING)
    private VerificationStatus verificationStatus = VerificationStatus.UNVERIFIED;

    @Column(name = "verification_date")
    private LocalDateTime verificationDate;

    @Column(name = "verified_by", length = 100)
    @Size(max = 100, message = "Verified by must not exceed 100 characters")
    private String verifiedBy;

    // Master Patient Identity Linking
    @Column(name = "master_patient_id")
    private UUID masterPatientId;

    @Column(name = "is_master_identity")
    private Boolean isMasterIdentity = false;

    // Identity Relationships
    @OneToMany(mappedBy = "patientIdentity", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<IdentityMatch> identityMatches = new ArrayList<>();

    @OneToMany(mappedBy = "patientIdentity", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<IdentityAlias> identityAliases = new ArrayList<>();

    // FHIR Compliance
    @Column(name = "fhir_patient_id", length = 100)
    @Size(max = 100, message = "FHIR patient ID must not exceed 100 characters")
    private String fhirPatientId;

    @Column(name = "fhir_resource_version", length = 20)
    @Size(max = 20, message = "FHIR resource version must not exceed 20 characters")
    private String fhirResourceVersion;

    @Column(name = "fhir_last_updated")
    private LocalDateTime fhirLastUpdated;

    // Data Quality
    @Column(name = "data_quality_score", precision = 5, scale = 2)
    @DecimalMin(value = "0.0", message = "Data quality score must be non-negative")
    @DecimalMax(value = "100.0", message = "Data quality score must not exceed 100")
    private Double dataQualityScore;

    @Column(name = "completeness_score", precision = 5, scale = 2)
    @DecimalMin(value = "0.0", message = "Completeness score must be non-negative")
    @DecimalMax(value = "100.0", message = "Completeness score must not exceed 100")
    private Double completenessScore;

    @Column(name = "accuracy_validated")
    private Boolean accuracyValidated = false;

    // Audit Fields
    @CreatedDate
    @Column(name = "created_date", nullable = false, updatable = false)
    private LocalDateTime createdDate;

    @LastModifiedDate
    @Column(name = "last_modified_date")
    private LocalDateTime lastModifiedDate;

    @Column(name = "created_by", length = 100)
    @Size(max = 100, message = "Created by must not exceed 100 characters")
    private String createdBy;

    @Column(name = "last_modified_by", length = 100)
    @Size(max = 100, message = "Last modified by must not exceed 100 characters")
    private String lastModifiedBy;

    @Column(name = "last_accessed_date")
    private LocalDateTime lastAccessedDate;

    @Column(name = "access_count")
    private Long accessCount = 0L;

    // Constructors
    public PatientIdentity() {}

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getMpiId() {
        return mpiId;
    }

    public void setMpiId(String mpiId) {
        this.mpiId = mpiId;
    }

    public String getExternalPatientId() {
        return externalPatientId;
    }

    public void setExternalPatientId(String externalPatientId) {
        this.externalPatientId = externalPatientId;
    }

    public String getSourceSystem() {
        return sourceSystem;
    }

    public void setSourceSystem(String sourceSystem) {
        this.sourceSystem = sourceSystem;
    }

    public String getSourceSystemVersion() {
        return sourceSystemVersion;
    }

    public void setSourceSystemVersion(String sourceSystemVersion) {
        this.sourceSystemVersion = sourceSystemVersion;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getMiddleName() {
        return middleName;
    }

    public void setMiddleName(String middleName) {
        this.middleName = middleName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getSuffix() {
        return suffix;
    }

    public void setSuffix(String suffix) {
        this.suffix = suffix;
    }

    public String getPreferredName() {
        return preferredName;
    }

    public void setPreferredName(String preferredName) {
        this.preferredName = preferredName;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public Gender getGender() {
        return gender;
    }

    public void setGender(Gender gender) {
        this.gender = gender;
    }

    public String getSsn() {
        return ssn;
    }

    public void setSsn(String ssn) {
        this.ssn = ssn;
    }

    public String getMrn() {
        return mrn;
    }

    public void setMrn(String mrn) {
        this.mrn = mrn;
    }

    public String getPhoneHome() {
        return phoneHome;
    }

    public void setPhoneHome(String phoneHome) {
        this.phoneHome = phoneHome;
    }

    public String getPhoneMobile() {
        return phoneMobile;
    }

    public void setPhoneMobile(String phoneMobile) {
        this.phoneMobile = phoneMobile;
    }

    public String getPhoneWork() {
        return phoneWork;
    }

    public void setPhoneWork(String phoneWork) {
        this.phoneWork = phoneWork;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAddressLine1() {
        return addressLine1;
    }

    public void setAddressLine1(String addressLine1) {
        this.addressLine1 = addressLine1;
    }

    public String getAddressLine2() {
        return addressLine2;
    }

    public void setAddressLine2(String addressLine2) {
        this.addressLine2 = addressLine2;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getPostalCode() {
        return postalCode;
    }

    public void setPostalCode(String postalCode) {
        this.postalCode = postalCode;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public IdentityStatus getIdentityStatus() {
        return identityStatus;
    }

    public void setIdentityStatus(IdentityStatus identityStatus) {
        this.identityStatus = identityStatus;
    }

    public Double getConfidenceScore() {
        return confidenceScore;
    }

    public void setConfidenceScore(Double confidenceScore) {
        this.confidenceScore = confidenceScore;
    }

    public VerificationStatus getVerificationStatus() {
        return verificationStatus;
    }

    public void setVerificationStatus(VerificationStatus verificationStatus) {
        this.verificationStatus = verificationStatus;
    }

    public LocalDateTime getVerificationDate() {
        return verificationDate;
    }

    public void setVerificationDate(LocalDateTime verificationDate) {
        this.verificationDate = verificationDate;
    }

    public String getVerifiedBy() {
        return verifiedBy;
    }

    public void setVerifiedBy(String verifiedBy) {
        this.verifiedBy = verifiedBy;
    }

    public UUID getMasterPatientId() {
        return masterPatientId;
    }

    public void setMasterPatientId(UUID masterPatientId) {
        this.masterPatientId = masterPatientId;
    }

    public Boolean getIsMasterIdentity() {
        return isMasterIdentity;
    }

    public void setIsMasterIdentity(Boolean isMasterIdentity) {
        this.isMasterIdentity = isMasterIdentity;
    }

    public List<IdentityMatch> getIdentityMatches() {
        return identityMatches;
    }

    public void setIdentityMatches(List<IdentityMatch> identityMatches) {
        this.identityMatches = identityMatches;
    }

    public List<IdentityAlias> getIdentityAliases() {
        return identityAliases;
    }

    public void setIdentityAliases(List<IdentityAlias> identityAliases) {
        this.identityAliases = identityAliases;
    }

    public String getFhirPatientId() {
        return fhirPatientId;
    }

    public void setFhirPatientId(String fhirPatientId) {
        this.fhirPatientId = fhirPatientId;
    }

    public String getFhirResourceVersion() {
        return fhirResourceVersion;
    }

    public void setFhirResourceVersion(String fhirResourceVersion) {
        this.fhirResourceVersion = fhirResourceVersion;
    }

    public LocalDateTime getFhirLastUpdated() {
        return fhirLastUpdated;
    }

    public void setFhirLastUpdated(LocalDateTime fhirLastUpdated) {
        this.fhirLastUpdated = fhirLastUpdated;
    }

    public Double getDataQualityScore() {
        return dataQualityScore;
    }

    public void setDataQualityScore(Double dataQualityScore) {
        this.dataQualityScore = dataQualityScore;
    }

    public Double getCompletenessScore() {
        return completenessScore;
    }

    public void setCompletenessScore(Double completenessScore) {
        this.completenessScore = completenessScore;
    }

    public Boolean getAccuracyValidated() {
        return accuracyValidated;
    }

    public void setAccuracyValidated(Boolean accuracyValidated) {
        this.accuracyValidated = accuracyValidated;
    }

    public LocalDateTime getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(LocalDateTime createdDate) {
        this.createdDate = createdDate;
    }

    public LocalDateTime getLastModifiedDate() {
        return lastModifiedDate;
    }

    public void setLastModifiedDate(LocalDateTime lastModifiedDate) {
        this.lastModifiedDate = lastModifiedDate;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public String getLastModifiedBy() {
        return lastModifiedBy;
    }

    public void setLastModifiedBy(String lastModifiedBy) {
        this.lastModifiedBy = lastModifiedBy;
    }

    public LocalDateTime getLastAccessedDate() {
        return lastAccessedDate;
    }

    public void setLastAccessedDate(LocalDateTime lastAccessedDate) {
        this.lastAccessedDate = lastAccessedDate;
    }

    public Long getAccessCount() {
        return accessCount;
    }

    public void setAccessCount(Long accessCount) {
        this.accessCount = accessCount;
    }
}
