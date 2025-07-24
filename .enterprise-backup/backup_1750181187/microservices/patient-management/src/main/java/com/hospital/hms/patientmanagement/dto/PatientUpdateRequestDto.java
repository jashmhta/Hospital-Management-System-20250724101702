package com.hospital.hms.patientmanagement.dto;

import com.hospital.hms.patientmanagement.entity.BloodType;
import com.hospital.hms.patientmanagement.entity.CommunicationPreference;
import com.hospital.hms.patientmanagement.entity.Gender;
import com.hospital.hms.patientmanagement.entity.MaritalStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO for updating patient information
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Schema(description = "Request DTO for updating patient information")
public class PatientUpdateRequestDto {

    @Schema(description = "Patient identifier value", example = "SSN123456789")
    @Size(max = 100, message = "Identifier value must not exceed 100 characters")
    private String identifierValue;

    @Schema(description = "Patient identifier system", example = "http://hl7.org/fhir/sid/us-ssn")
    @Size(max = 200, message = "Identifier system must not exceed 200 characters")
    private String identifierSystem;

    @Schema(description = "Whether the patient record is active", example = "true")
    private Boolean active;

    @Schema(description = "Patient family name (last name)", example = "Smith")
    @Size(max = 100, message = "Family name must not exceed 100 characters")
    private String familyName;

    @Schema(description = "Patient given name (first name)", example = "John")
    @Size(max = 100, message = "Given name must not exceed 100 characters")
    private String givenName;

    @Schema(description = "Patient middle name", example = "Michael")
    @Size(max = 100, message = "Middle name must not exceed 100 characters")
    private String middleName;

    @Schema(description = "Name prefix", example = "Mr.")
    @Size(max = 20, message = "Name prefix must not exceed 20 characters")
    private String prefix;

    @Schema(description = "Name suffix", example = "Jr.")
    @Size(max = 20, message = "Name suffix must not exceed 20 characters")
    private String suffix;

    @Schema(description = "Date of birth", example = "1990-05-15")
    @Past(message = "Date of birth must be in the past")
    private LocalDate dateOfBirth;

    @Schema(description = "Patient gender")
    private Gender gender;

    @Schema(description = "Marital status")
    private MaritalStatus maritalStatus;

    @Schema(description = "Primary phone number", example = "+1-555-123-4567")
    @Pattern(regexp = "^[\\+]?[1-9][\\d\\s\\-\\(\\)]{7,15}$", message = "Invalid phone number format")
    private String phonePrimary;

    @Schema(description = "Secondary phone number", example = "+1-555-987-6543")
    @Pattern(regexp = "^[\\+]?[1-9][\\d\\s\\-\\(\\)]{7,15}$", message = "Invalid phone number format")
    private String phoneSecondary;

    @Schema(description = "Email address", example = "john.smith@email.com")
    @Email(message = "Invalid email format")
    @Size(max = 100, message = "Email must not exceed 100 characters")
    private String email;

    @Schema(description = "Patient addresses")
    @Valid
    private List<PatientAddressDto> addresses;

    @Schema(description = "Emergency contact name", example = "Jane Smith")
    @Size(max = 100, message = "Emergency contact name must not exceed 100 characters")
    private String emergencyContactName;

    @Schema(description = "Emergency contact phone", example = "+1-555-111-2222")
    @Pattern(regexp = "^[\\+]?[1-9][\\d\\s\\-\\(\\)]{7,15}$", message = "Invalid emergency contact phone format")
    private String emergencyContactPhone;

    @Schema(description = "Emergency contact relationship", example = "Spouse")
    @Size(max = 50, message = "Emergency contact relationship must not exceed 50 characters")
    private String emergencyContactRelationship;

    @Schema(description = "Patient insurance information")
    @Valid
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
    @Size(max = 500, message = "Photo URL must not exceed 500 characters")
    private String photoUrl;

    // Constructors
    public PatientUpdateRequestDto() {}

    // Getters and Setters
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
}
