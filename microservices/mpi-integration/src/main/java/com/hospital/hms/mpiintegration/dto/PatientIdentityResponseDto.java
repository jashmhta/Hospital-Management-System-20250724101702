package com.hospital.hms.mpiintegration.dto;

import com.hospital.hms.mpiintegration.entity.Gender;
import com.hospital.hms.mpiintegration.entity.IdentityStatus;
import com.hospital.hms.mpiintegration.entity.VerificationStatus;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * DTO for patient identity responses
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
public class PatientIdentityResponseDto {

    private UUID id;
    private String mpiId;
    private String externalPatientId;
    private String sourceSystem;
    private String sourceSystemVersion;

    // Demographics
    private String firstName;
    private String middleName;
    private String lastName;
    private String suffix;
    private String preferredName;
    private LocalDate dateOfBirth;
    private Gender gender;
    private String ssn;
    private String mrn;

    // Contact Information
    private String phoneHome;
    private String phoneMobile;
    private String phoneWork;
    private String email;

    // Address Information
    private String addressLine1;
    private String addressLine2;
    private String city;
    private String state;
    private String postalCode;
    private String country;

    // Identity Management
    private IdentityStatus identityStatus;
    private Double confidenceScore;
    private VerificationStatus verificationStatus;
    private LocalDateTime verificationDate;
    private String verifiedBy;

    // Master Patient Identity Linking
    private UUID masterPatientId;
    private Boolean isMasterIdentity;

    // FHIR Compliance
    private String fhirPatientId;
    private String fhirResourceVersion;
    private LocalDateTime fhirLastUpdated;

    // Data Quality
    private Double dataQualityScore;
    private Double completenessScore;
    private Boolean accuracyValidated;

    // Related entities (summary information)
    private List<IdentityMatchSummaryDto> identityMatches;
    private List<IdentityAliasSummaryDto> identityAliases;

    // Audit Fields
    private LocalDateTime createdDate;
    private LocalDateTime lastModifiedDate;
    private String createdBy;
    private String lastModifiedBy;
    private LocalDateTime lastAccessedDate;
    private Long accessCount;

    // Constructors
    public PatientIdentityResponseDto() {}

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

    public List<IdentityMatchSummaryDto> getIdentityMatches() {
        return identityMatches;
    }

    public void setIdentityMatches(List<IdentityMatchSummaryDto> identityMatches) {
        this.identityMatches = identityMatches;
    }

    public List<IdentityAliasSummaryDto> getIdentityAliases() {
        return identityAliases;
    }

    public void setIdentityAliases(List<IdentityAliasSummaryDto> identityAliases) {
        this.identityAliases = identityAliases;
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

    /**
     * Summary DTO for Identity Match information
     */
    public static class IdentityMatchSummaryDto {
        private UUID id;
        private UUID candidateIdentityId;
        private Double matchScore;
        private String matchAlgorithm;
        private String matchStatus;
        private String matchType;
        private Boolean isAutoMatch;
        private LocalDateTime createdDate;

        // Getters and setters
        public UUID getId() { return id; }
        public void setId(UUID id) { this.id = id; }
        public UUID getCandidateIdentityId() { return candidateIdentityId; }
        public void setCandidateIdentityId(UUID candidateIdentityId) { this.candidateIdentityId = candidateIdentityId; }
        public Double getMatchScore() { return matchScore; }
        public void setMatchScore(Double matchScore) { this.matchScore = matchScore; }
        public String getMatchAlgorithm() { return matchAlgorithm; }
        public void setMatchAlgorithm(String matchAlgorithm) { this.matchAlgorithm = matchAlgorithm; }
        public String getMatchStatus() { return matchStatus; }
        public void setMatchStatus(String matchStatus) { this.matchStatus = matchStatus; }
        public String getMatchType() { return matchType; }
        public void setMatchType(String matchType) { this.matchType = matchType; }
        public Boolean getIsAutoMatch() { return isAutoMatch; }
        public void setIsAutoMatch(Boolean isAutoMatch) { this.isAutoMatch = isAutoMatch; }
        public LocalDateTime getCreatedDate() { return createdDate; }
        public void setCreatedDate(LocalDateTime createdDate) { this.createdDate = createdDate; }
    }

    /**
     * Summary DTO for Identity Alias information
     */
    public static class IdentityAliasSummaryDto {
        private UUID id;
        private String aliasType;
        private String aliasFirstName;
        private String aliasLastName;
        private String fullAliasName;
        private Boolean isActive;
        private LocalDateTime effectiveDate;

        // Getters and setters
        public UUID getId() { return id; }
        public void setId(UUID id) { this.id = id; }
        public String getAliasType() { return aliasType; }
        public void setAliasType(String aliasType) { this.aliasType = aliasType; }
        public String getAliasFirstName() { return aliasFirstName; }
        public void setAliasFirstName(String aliasFirstName) { this.aliasFirstName = aliasFirstName; }
        public String getAliasLastName() { return aliasLastName; }
        public void setAliasLastName(String aliasLastName) { this.aliasLastName = aliasLastName; }
        public String getFullAliasName() { return fullAliasName; }
        public void setFullAliasName(String fullAliasName) { this.fullAliasName = fullAliasName; }
        public Boolean getIsActive() { return isActive; }
        public void setIsActive(Boolean isActive) { this.isActive = isActive; }
        public LocalDateTime getEffectiveDate() { return effectiveDate; }
        public void setEffectiveDate(LocalDateTime effectiveDate) { this.effectiveDate = effectiveDate; }
    }
}
