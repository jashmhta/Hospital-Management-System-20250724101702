package com.hospital.hms.patientmanagement.dto;

import com.hospital.hms.patientmanagement.entity.BloodType;
import com.hospital.hms.patientmanagement.entity.CommunicationPreference;
import com.hospital.hms.patientmanagement.entity.Gender;
import com.hospital.hms.patientmanagement.entity.MaritalStatus;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * DTO for patient response data
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Schema(description = "Response DTO containing patient information")
public class PatientResponseDto {

    @Schema(description = "Patient unique identifier", example = "550e8400-e29b-41d4-a716-446655440000")
    private UUID id;

    @Schema(description = "Medical Record Number", example = "MRN123456")
    private String medicalRecordNumber;

    @Schema(description = "Patient identifier value", example = "SSN123456789")
    private String identifierValue;

    @Schema(description = "Patient identifier system", example = "http://hl7.org/fhir/sid/us-ssn")
    private String identifierSystem;

    @Schema(description = "Whether the patient record is active", example = "true")
    private Boolean active;

    @Schema(description = "Patient family name (last name)", example = "Smith")
    private String familyName;

    @Schema(description = "Patient given name (first name)", example = "John")
    private String givenName;

    @Schema(description = "Patient middle name", example = "Michael")
    private String middleName;

    @Schema(description = "Name prefix", example = "Mr.")
    private String prefix;

    @Schema(description = "Name suffix", example = "Jr.")
    private String suffix;

    @Schema(description = "Full formatted name", example = "Mr. John Michael Smith Jr.")
    private String fullName;

    @Schema(description = "Date of birth", example = "1990-05-15")
    private LocalDate dateOfBirth;

    @Schema(description = "Calculated age", example = "33")
    private Integer age;

    @Schema(description = "Patient gender")
    private Gender gender;

    @Schema(description = "Marital status")
    private MaritalStatus maritalStatus;

    @Schema(description = "Primary phone number", example = "+1-555-123-4567")
    private String phonePrimary;

    @Schema(description = "Secondary phone number", example = "+1-555-987-6543")
    private String phoneSecondary;

    @Schema(description = "Email address", example = "john.smith@email.com")
    private String email;

    @Schema(description = "Patient addresses")
    private List<PatientAddressDto> addresses;

    @Schema(description = "Emergency contact name", example = "Jane Smith")
    private String emergencyContactName;

    @Schema(description = "Emergency contact phone", example = "+1-555-111-2222")
    private String emergencyContactPhone;

    @Schema(description = "Emergency contact relationship", example = "Spouse")
    private String emergencyContactRelationship;

    @Schema(description = "Patient insurance information")
    private List<PatientInsuranceDto> insurances;

    @Schema(description = "Blood type")
    private BloodType bloodType;

    @Schema(description = "Known allergies", example = "Penicillin, Shellfish")
    private String allergies;

    @Schema(description = "Medical history summary")
    private String medicalHistory;

    @Schema(description = "Current medications")
    private String currentMedications;

    @Schema(description = "Preferred language", example = "en")
    private String preferredLanguage;

    @Schema(description = "Communication preference")
    private CommunicationPreference communicationPreference;

    @Schema(description = "Whether interpreter is required", example = "false")
    private Boolean interpreterRequired;

    @Schema(description = "Whether the patient is deceased", example = "false")
    private Boolean deceased;

    @Schema(description = "Date and time of death")
    private LocalDateTime deceasedDateTime;

    @Schema(description = "Multiple birth indicator", example = "false")
    private Boolean multipleBirthBoolean;

    @Schema(description = "Birth order for multiple births", example = "1")
    private Integer multipleBirthInteger;

    @Schema(description = "Patient photo URL")
    private String photoUrl;

    @Schema(description = "FHIR resource ID")
    private String fhirId;

    @Schema(description = "FHIR version ID")
    private String fhirVersionId;

    @Schema(description = "FHIR last updated timestamp")
    private LocalDateTime fhirLastUpdated;

    @Schema(description = "Record creation date")
    private LocalDateTime createdDate;

    @Schema(description = "Last modification date")
    private LocalDateTime lastModifiedDate;

    @Schema(description = "Created by user")
    private String createdBy;

    @Schema(description = "Last modified by user")
    private String lastModifiedBy;

    // Constructors
    public PatientResponseDto() {}

    public PatientResponseDto(UUID id, String medicalRecordNumber, String familyName, String givenName) {
        this.id = id;
        this.medicalRecordNumber = medicalRecordNumber;
        this.familyName = familyName;
        this.givenName = givenName;
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getMedicalRecordNumber() {
        return medicalRecordNumber;
    }

    public void setMedicalRecordNumber(String medicalRecordNumber) {
        this.medicalRecordNumber = medicalRecordNumber;
    }

    public String getIdentifierValue() {
        return identifierValue;
    }

    public void setIdentifierValue(String identifierValue) {
        this.identifierValue = identifierValue;
    }

    public String getIdentifierSystem() {
        return identifierSystem;
    }

    public void setIdentifierSystem(String identifierSystem) {
        this.identifierSystem = identifierSystem;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public String getFamilyName() {
        return familyName;
    }

    public void setFamilyName(String familyName) {
        this.familyName = familyName;
    }

    public String getGivenName() {
        return givenName;
    }

    public void setGivenName(String givenName) {
        this.givenName = givenName;
    }

    public String getMiddleName() {
        return middleName;
    }

    public void setMiddleName(String middleName) {
        this.middleName = middleName;
    }

    public String getPrefix() {
        return prefix;
    }

    public void setPrefix(String prefix) {
        this.prefix = prefix;
    }

    public String getSuffix() {
        return suffix;
    }

    public void setSuffix(String suffix) {
        this.suffix = suffix;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public Gender getGender() {
        return gender;
    }

    public void setGender(Gender gender) {
        this.gender = gender;
    }

    public MaritalStatus getMaritalStatus() {
        return maritalStatus;
    }

    public void setMaritalStatus(MaritalStatus maritalStatus) {
        this.maritalStatus = maritalStatus;
    }

    public String getPhonePrimary() {
        return phonePrimary;
    }

    public void setPhonePrimary(String phonePrimary) {
        this.phonePrimary = phonePrimary;
    }

    public String getPhoneSecondary() {
        return phoneSecondary;
    }

    public void setPhoneSecondary(String phoneSecondary) {
        this.phoneSecondary = phoneSecondary;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public List<PatientAddressDto> getAddresses() {
        return addresses;
    }

    public void setAddresses(List<PatientAddressDto> addresses) {
        this.addresses = addresses;
    }

    public String getEmergencyContactName() {
        return emergencyContactName;
    }

    public void setEmergencyContactName(String emergencyContactName) {
        this.emergencyContactName = emergencyContactName;
    }

    public String getEmergencyContactPhone() {
        return emergencyContactPhone;
    }

    public void setEmergencyContactPhone(String emergencyContactPhone) {
        this.emergencyContactPhone = emergencyContactPhone;
    }

    public String getEmergencyContactRelationship() {
        return emergencyContactRelationship;
    }

    public void setEmergencyContactRelationship(String emergencyContactRelationship) {
        this.emergencyContactRelationship = emergencyContactRelationship;
    }

    public List<PatientInsuranceDto> getInsurances() {
        return insurances;
    }

    public void setInsurances(List<PatientInsuranceDto> insurances) {
        this.insurances = insurances;
    }

    public BloodType getBloodType() {
        return bloodType;
    }

    public void setBloodType(BloodType bloodType) {
        this.bloodType = bloodType;
    }

    public String getAllergies() {
        return allergies;
    }

    public void setAllergies(String allergies) {
        this.allergies = allergies;
    }

    public String getMedicalHistory() {
        return medicalHistory;
    }

    public void setMedicalHistory(String medicalHistory) {
        this.medicalHistory = medicalHistory;
    }

    public String getCurrentMedications() {
        return currentMedications;
    }

    public void setCurrentMedications(String currentMedications) {
        this.currentMedications = currentMedications;
    }

    public String getPreferredLanguage() {
        return preferredLanguage;
    }

    public void setPreferredLanguage(String preferredLanguage) {
        this.preferredLanguage = preferredLanguage;
    }

    public CommunicationPreference getCommunicationPreference() {
        return communicationPreference;
    }

    public void setCommunicationPreference(CommunicationPreference communicationPreference) {
        this.communicationPreference = communicationPreference;
    }

    public Boolean getInterpreterRequired() {
        return interpreterRequired;
    }

    public void setInterpreterRequired(Boolean interpreterRequired) {
        this.interpreterRequired = interpreterRequired;
    }

    public Boolean getDeceased() {
        return deceased;
    }

    public void setDeceased(Boolean deceased) {
        this.deceased = deceased;
    }

    public LocalDateTime getDeceasedDateTime() {
        return deceasedDateTime;
    }

    public void setDeceasedDateTime(LocalDateTime deceasedDateTime) {
        this.deceasedDateTime = deceasedDateTime;
    }

    public Boolean getMultipleBirthBoolean() {
        return multipleBirthBoolean;
    }

    public void setMultipleBirthBoolean(Boolean multipleBirthBoolean) {
        this.multipleBirthBoolean = multipleBirthBoolean;
    }

    public Integer getMultipleBirthInteger() {
        return multipleBirthInteger;
    }

    public void setMultipleBirthInteger(Integer multipleBirthInteger) {
        this.multipleBirthInteger = multipleBirthInteger;
    }

    public String getPhotoUrl() {
        return photoUrl;
    }

    public void setPhotoUrl(String photoUrl) {
        this.photoUrl = photoUrl;
    }

    public String getFhirId() {
        return fhirId;
    }

    public void setFhirId(String fhirId) {
        this.fhirId = fhirId;
    }

    public String getFhirVersionId() {
        return fhirVersionId;
    }

    public void setFhirVersionId(String fhirVersionId) {
        this.fhirVersionId = fhirVersionId;
    }

    public LocalDateTime getFhirLastUpdated() {
        return fhirLastUpdated;
    }

    public void setFhirLastUpdated(LocalDateTime fhirLastUpdated) {
        this.fhirLastUpdated = fhirLastUpdated;
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
}
