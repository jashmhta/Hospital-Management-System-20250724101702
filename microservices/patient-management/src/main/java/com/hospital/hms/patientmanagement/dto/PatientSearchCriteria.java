package com.hospital.hms.patientmanagement.dto;

import com.hospital.hms.patientmanagement.entity.Gender;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDate;

/**
 * DTO for patient search criteria
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Schema(description = "Search criteria for finding patients")
public class PatientSearchCriteria {

    @Schema(description = "Medical record number", example = "MRN123456")
    private String medicalRecordNumber;

    @Schema(description = "Patient identifier value", example = "SSN123456789")
    private String identifierValue;

    @Schema(description = "Patient identifier system", example = "http://hl7.org/fhir/sid/us-ssn")
    private String identifierSystem;

    @Schema(description = "Family name (last name)", example = "Smith")
    private String familyName;

    @Schema(description = "Given name (first name)", example = "John")
    private String givenName;

    @Schema(description = "Date of birth", example = "1990-05-15")
    private LocalDate dateOfBirth;

    @Schema(description = "Date of birth range start", example = "1990-01-01")
    private LocalDate dateOfBirthFrom;

    @Schema(description = "Date of birth range end", example = "1990-12-31")
    private LocalDate dateOfBirthTo;

    @Schema(description = "Patient gender")
    private Gender gender;

    @Schema(description = "Phone number", example = "+1-555-123-4567")
    private String phoneNumber;

    @Schema(description = "Email address", example = "john.smith@email.com")
    private String email;

    @Schema(description = "Whether to include only active patients", example = "true")
    private Boolean active;

    @Schema(description = "Minimum age", example = "18")
    private Integer minAge;

    @Schema(description = "Maximum age", example = "65")
    private Integer maxAge;

    @Schema(description = "City", example = "Springfield")
    private String city;

    @Schema(description = "State", example = "IL")
    private String state;

    @Schema(description = "Postal code", example = "62701")
    private String postalCode;

    @Schema(description = "Free text search term", example = "John Smith")
    private String searchTerm;

    @Schema(description = "Whether to include deceased patients", example = "false")
    private Boolean includeDeceased = true;

    @Schema(description = "Records created after this date", example = "2023-01-01")
    private LocalDate createdAfter;

    @Schema(description = "Records created before this date", example = "2023-12-31")
    private LocalDate createdBefore;

    // Constructors
    public PatientSearchCriteria() {}

    public PatientSearchCriteria(String searchTerm) {
        this.searchTerm = searchTerm;
    }

    // Getters and Setters
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

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public LocalDate getDateOfBirthFrom() {
        return dateOfBirthFrom;
    }

    public void setDateOfBirthFrom(LocalDate dateOfBirthFrom) {
        this.dateOfBirthFrom = dateOfBirthFrom;
    }

    public LocalDate getDateOfBirthTo() {
        return dateOfBirthTo;
    }

    public void setDateOfBirthTo(LocalDate dateOfBirthTo) {
        this.dateOfBirthTo = dateOfBirthTo;
    }

    public Gender getGender() {
        return gender;
    }

    public void setGender(Gender gender) {
        this.gender = gender;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public Integer getMinAge() {
        return minAge;
    }

    public void setMinAge(Integer minAge) {
        this.minAge = minAge;
    }

    public Integer getMaxAge() {
        return maxAge;
    }

    public void setMaxAge(Integer maxAge) {
        this.maxAge = maxAge;
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

    public String getSearchTerm() {
        return searchTerm;
    }

    public void setSearchTerm(String searchTerm) {
        this.searchTerm = searchTerm;
    }

    public Boolean getIncludeDeceased() {
        return includeDeceased;
    }

    public void setIncludeDeceased(Boolean includeDeceased) {
        this.includeDeceased = includeDeceased;
    }

    public LocalDate getCreatedAfter() {
        return createdAfter;
    }

    public void setCreatedAfter(LocalDate createdAfter) {
        this.createdAfter = createdAfter;
    }

    public LocalDate getCreatedBefore() {
        return createdBefore;
    }

    public void setCreatedBefore(LocalDate createdBefore) {
        this.createdBefore = createdBefore;
    }
}
