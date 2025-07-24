package com.hospital.hms.patientmanagement.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

/**
 * Patient Entity
 * 
 * Represents a patient in the hospital management system.
 * This entity is designed to be FHIR R4 Patient resource compliant.
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Entity
@Table(name = "patients", indexes = {
    @Index(name = "idx_patient_mrn", columnList = "medical_record_number", unique = true),
    @Index(name = "idx_patient_identifier", columnList = "identifier_value"),
    @Index(name = "idx_patient_name", columnList = "family_name, given_name"),
    @Index(name = "idx_patient_dob", columnList = "date_of_birth"),
    @Index(name = "idx_patient_active", columnList = "active"),
    @Index(name = "idx_patient_created", columnList = "created_date")
})
@EntityListeners(AuditingEntityListener.class)
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "medical_record_number", unique = true, nullable = false, length = 50)
    @NotBlank(message = "Medical Record Number is required")
    @Size(max = 50, message = "Medical Record Number must not exceed 50 characters")
    private String medicalRecordNumber;

    @Column(name = "identifier_value", length = 100)
    @Size(max = 100, message = "Identifier value must not exceed 100 characters")
    private String identifierValue;

    @Column(name = "identifier_system", length = 200)
    @Size(max = 200, message = "Identifier system must not exceed 200 characters")
    private String identifierSystem;

    @Column(name = "active", nullable = false)
    private Boolean active = true;

    // Name components
    @Column(name = "family_name", nullable = false, length = 100)
    @NotBlank(message = "Family name is required")
    @Size(max = 100, message = "Family name must not exceed 100 characters")
    private String familyName;

    @Column(name = "given_name", nullable = false, length = 100)
    @NotBlank(message = "Given name is required")
    @Size(max = 100, message = "Given name must not exceed 100 characters")
    private String givenName;

    @Column(name = "middle_name", length = 100)
    @Size(max = 100, message = "Middle name must not exceed 100 characters")
    private String middleName;

    @Column(name = "prefix", length = 20)
    @Size(max = 20, message = "Name prefix must not exceed 20 characters")
    private String prefix;

    @Column(name = "suffix", length = 20)
    @Size(max = 20, message = "Name suffix must not exceed 20 characters")
    private String suffix;

    // Demographics
    @Column(name = "date_of_birth")
    @Past(message = "Date of birth must be in the past")
    private LocalDate dateOfBirth;

    @Column(name = "gender", length = 10)
    @Enumerated(EnumType.STRING)
    private Gender gender;

    @Column(name = "marital_status", length = 20)
    @Enumerated(EnumType.STRING)
    private MaritalStatus maritalStatus;

    // Contact Information
    @Column(name = "phone_primary", length = 20)
    @Pattern(regexp = "^[\\+]?[1-9][\\d\\s\\-\\(\\)]{7,15}$", message = "Invalid phone number format")
    private String phonePrimary;

    @Column(name = "phone_secondary", length = 20)
    @Pattern(regexp = "^[\\+]?[1-9][\\d\\s\\-\\(\\)]{7,15}$", message = "Invalid phone number format")
    private String phoneSecondary;

    @Column(name = "email", length = 100)
    @Email(message = "Invalid email format")
    @Size(max = 100, message = "Email must not exceed 100 characters")
    private String email;

    // Address components
    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<PatientAddress> addresses = new HashSet<>();

    // Emergency Contact
    @Column(name = "emergency_contact_name", length = 100)
    @Size(max = 100, message = "Emergency contact name must not exceed 100 characters")
    private String emergencyContactName;

    @Column(name = "emergency_contact_phone", length = 20)
    @Pattern(regexp = "^[\\+]?[1-9][\\d\\s\\-\\(\\)]{7,15}$", message = "Invalid emergency contact phone format")
    private String emergencyContactPhone;

    @Column(name = "emergency_contact_relationship", length = 50)
    @Size(max = 50, message = "Emergency contact relationship must not exceed 50 characters")
    private String emergencyContactRelationship;

    // Insurance Information
    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<PatientInsurance> insurances = new HashSet<>();

    // Medical Information
    @Column(name = "blood_type", length = 5)
    @Enumerated(EnumType.STRING)
    private BloodType bloodType;

    @Column(name = "allergies", columnDefinition = "TEXT")
    private String allergies;

    @Column(name = "medical_history", columnDefinition = "TEXT")
    private String medicalHistory;

    @Column(name = "current_medications", columnDefinition = "TEXT")
    private String currentMedications;

    // Language and Communication
    @Column(name = "preferred_language", length = 10)
    private String preferredLanguage;

    @Column(name = "communication_preference", length = 20)
    @Enumerated(EnumType.STRING)
    private CommunicationPreference communicationPreference;

    @Column(name = "interpreter_required")
    private Boolean interpreterRequired = false;

    // Deceased information
    @Column(name = "deceased")
    private Boolean deceased = false;

    @Column(name = "deceased_date_time")
    private LocalDateTime deceasedDateTime;

    // Multiple Birth
    @Column(name = "multiple_birth_boolean")
    private Boolean multipleBirthBoolean;

    @Column(name = "multiple_birth_integer")
    private Integer multipleBirthInteger;

    // Photo
    @Column(name = "photo_url", length = 500)
    @Size(max = 500, message = "Photo URL must not exceed 500 characters")
    private String photoUrl;

    // FHIR Resource Information
    @Column(name = "fhir_id", length = 64)
    @Size(max = 64, message = "FHIR ID must not exceed 64 characters")
    private String fhirId;

    @Column(name = "fhir_version_id", length = 64)
    @Size(max = 64, message = "FHIR Version ID must not exceed 64 characters")
    private String fhirVersionId;

    @Column(name = "fhir_last_updated")
    private LocalDateTime fhirLastUpdated;

    // Audit fields
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

    @Version
    @Column(name = "version")
    private Long version;

    // Constructors
    public Patient() {
        this.id = UUID.randomUUID();
    }

    public Patient(String medicalRecordNumber, String familyName, String givenName) {
        this();
        this.medicalRecordNumber = medicalRecordNumber;
        this.familyName = familyName;
        this.givenName = givenName;
    }

    // Business Methods
    
    /**
     * Get full name of the patient
     */
    public String getFullName() {
        StringBuilder fullName = new StringBuilder();
        
        if (prefix != null && !prefix.trim().isEmpty()) {
            fullName.append(prefix).append(" ");
        }
        
        if (givenName != null) {
            fullName.append(givenName);
        }
        
        if (middleName != null && !middleName.trim().isEmpty()) {
            fullName.append(" ").append(middleName);
        }
        
        if (familyName != null) {
            fullName.append(" ").append(familyName);
        }
        
        if (suffix != null && !suffix.trim().isEmpty()) {
            fullName.append(", ").append(suffix);
        }
        
        return fullName.toString().trim();
    }

    /**
     * Calculate age based on date of birth
     */
    public Integer getAge() {
        if (dateOfBirth == null) {
            return null;
        }
        
        LocalDate now = deceased != null && deceased && deceasedDateTime != null 
            ? deceasedDateTime.toLocalDate() 
            : LocalDate.now();
            
        return dateOfBirth.until(now).getYears();
    }

    /**
     * Check if patient is a minor (under 18)
     */
    public boolean isMinor() {
        Integer age = getAge();
        return age != null && age < 18;
    }

    /**
     * Get primary address
     */
    public PatientAddress getPrimaryAddress() {
        return addresses.stream()
            .filter(PatientAddress::isPrimary)
            .findFirst()
            .orElse(null);
    }

    /**
     * Get primary insurance
     */
    public PatientInsurance getPrimaryInsurance() {
        return insurances.stream()
            .filter(PatientInsurance::isPrimary)
            .findFirst()
            .orElse(null);
    }

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getMedicalRecordNumber() { return medicalRecordNumber; }
    public void setMedicalRecordNumber(String medicalRecordNumber) { this.medicalRecordNumber = medicalRecordNumber; }

    public String getIdentifierValue() { return identifierValue; }
    public void setIdentifierValue(String identifierValue) { this.identifierValue = identifierValue; }

    public String getIdentifierSystem() { return identifierSystem; }
    public void setIdentifierSystem(String identifierSystem) { this.identifierSystem = identifierSystem; }

    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }

    public String getFamilyName() { return familyName; }
    public void setFamilyName(String familyName) { this.familyName = familyName; }

    public String getGivenName() { return givenName; }
    public void setGivenName(String givenName) { this.givenName = givenName; }

    public String getMiddleName() { return middleName; }
    public void setMiddleName(String middleName) { this.middleName = middleName; }

    public String getPrefix() { return prefix; }
    public void setPrefix(String prefix) { this.prefix = prefix; }

    public String getSuffix() { return suffix; }
    public void setSuffix(String suffix) { this.suffix = suffix; }

    public LocalDate getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }

    public Gender getGender() { return gender; }
    public void setGender(Gender gender) { this.gender = gender; }

    public MaritalStatus getMaritalStatus() { return maritalStatus; }
    public void setMaritalStatus(MaritalStatus maritalStatus) { this.maritalStatus = maritalStatus; }

    public String getPhonePrimary() { return phonePrimary; }
    public void setPhonePrimary(String phonePrimary) { this.phonePrimary = phonePrimary; }

    public String getPhoneSecondary() { return phoneSecondary; }
    public void setPhoneSecondary(String phoneSecondary) { this.phoneSecondary = phoneSecondary; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public Set<PatientAddress> getAddresses() { return addresses; }
    public void setAddresses(Set<PatientAddress> addresses) { this.addresses = addresses; }

    public String getEmergencyContactName() { return emergencyContactName; }
    public void setEmergencyContactName(String emergencyContactName) { this.emergencyContactName = emergencyContactName; }

    public String getEmergencyContactPhone() { return emergencyContactPhone; }
    public void setEmergencyContactPhone(String emergencyContactPhone) { this.emergencyContactPhone = emergencyContactPhone; }

    public String getEmergencyContactRelationship() { return emergencyContactRelationship; }
    public void setEmergencyContactRelationship(String emergencyContactRelationship) { this.emergencyContactRelationship = emergencyContactRelationship; }

    public Set<PatientInsurance> getInsurances() { return insurances; }
    public void setInsurances(Set<PatientInsurance> insurances) { this.insurances = insurances; }

    public BloodType getBloodType() { return bloodType; }
    public void setBloodType(BloodType bloodType) { this.bloodType = bloodType; }

    public String getAllergies() { return allergies; }
    public void setAllergies(String allergies) { this.allergies = allergies; }

    public String getMedicalHistory() { return medicalHistory; }
    public void setMedicalHistory(String medicalHistory) { this.medicalHistory = medicalHistory; }

    public String getCurrentMedications() { return currentMedications; }
    public void setCurrentMedications(String currentMedications) { this.currentMedications = currentMedications; }

    public String getPreferredLanguage() { return preferredLanguage; }
    public void setPreferredLanguage(String preferredLanguage) { this.preferredLanguage = preferredLanguage; }

    public CommunicationPreference getCommunicationPreference() { return communicationPreference; }
    public void setCommunicationPreference(CommunicationPreference communicationPreference) { this.communicationPreference = communicationPreference; }

    public Boolean getInterpreterRequired() { return interpreterRequired; }
    public void setInterpreterRequired(Boolean interpreterRequired) { this.interpreterRequired = interpreterRequired; }

    public Boolean getDeceased() { return deceased; }
    public void setDeceased(Boolean deceased) { this.deceased = deceased; }

    public LocalDateTime getDeceasedDateTime() { return deceasedDateTime; }
    public void setDeceasedDateTime(LocalDateTime deceasedDateTime) { this.deceasedDateTime = deceasedDateTime; }

    public Boolean getMultipleBirthBoolean() { return multipleBirthBoolean; }
    public void setMultipleBirthBoolean(Boolean multipleBirthBoolean) { this.multipleBirthBoolean = multipleBirthBoolean; }

    public Integer getMultipleBirthInteger() { return multipleBirthInteger; }
    public void setMultipleBirthInteger(Integer multipleBirthInteger) { this.multipleBirthInteger = multipleBirthInteger; }

    public String getPhotoUrl() { return photoUrl; }
    public void setPhotoUrl(String photoUrl) { this.photoUrl = photoUrl; }

    public String getFhirId() { return fhirId; }
    public void setFhirId(String fhirId) { this.fhirId = fhirId; }

    public String getFhirVersionId() { return fhirVersionId; }
    public void setFhirVersionId(String fhirVersionId) { this.fhirVersionId = fhirVersionId; }

    public LocalDateTime getFhirLastUpdated() { return fhirLastUpdated; }
    public void setFhirLastUpdated(LocalDateTime fhirLastUpdated) { this.fhirLastUpdated = fhirLastUpdated; }

    public LocalDateTime getCreatedDate() { return createdDate; }
    public void setCreatedDate(LocalDateTime createdDate) { this.createdDate = createdDate; }

    public LocalDateTime getLastModifiedDate() { return lastModifiedDate; }
    public void setLastModifiedDate(LocalDateTime lastModifiedDate) { this.lastModifiedDate = lastModifiedDate; }

    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }

    public String getLastModifiedBy() { return lastModifiedBy; }
    public void setLastModifiedBy(String lastModifiedBy) { this.lastModifiedBy = lastModifiedBy; }

    public Long getVersion() { return version; }
    public void setVersion(Long version) { this.version = version; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Patient)) return false;
        Patient patient = (Patient) o;
        return id != null && id.equals(patient.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    @Override
    public String toString() {
        return "Patient{" +
                "id=" + id +
                ", medicalRecordNumber='" + medicalRecordNumber + '\'' +
                ", fullName='" + getFullName() + '\'' +
                ", dateOfBirth=" + dateOfBirth +
                ", gender=" + gender +
                ", active=" + active +
                '}';
    }
}
