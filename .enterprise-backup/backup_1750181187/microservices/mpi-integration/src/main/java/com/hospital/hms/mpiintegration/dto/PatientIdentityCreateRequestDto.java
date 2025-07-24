package com.hospital.hms.mpiintegration.dto;

import com.hospital.hms.mpiintegration.entity.Gender;
import jakarta.validation.constraints.*;
import java.time.LocalDate;

/**
 * DTO for creating patient identity requests
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
public class PatientIdentityCreateRequestDto {

    @NotBlank(message = "External patient ID is required")
    @Size(max = 100, message = "External patient ID must not exceed 100 characters")
    private String externalPatientId;

    @NotBlank(message = "Source system is required")
    @Size(max = 50, message = "Source system must not exceed 50 characters")
    private String sourceSystem;

    @Size(max = 20, message = "Source system version must not exceed 20 characters")
    private String sourceSystemVersion;

    // Demographics
    @NotBlank(message = "First name is required")
    @Size(max = 100, message = "First name must not exceed 100 characters")
    private String firstName;

    @Size(max = 100, message = "Middle name must not exceed 100 characters")
    private String middleName;

    @NotBlank(message = "Last name is required")
    @Size(max = 100, message = "Last name must not exceed 100 characters")
    private String lastName;

    @Size(max = 20, message = "Suffix must not exceed 20 characters")
    private String suffix;

    @Size(max = 100, message = "Preferred name must not exceed 100 characters")
    private String preferredName;

    @NotNull(message = "Date of birth is required")
    @Past(message = "Date of birth must be in the past")
    private LocalDate dateOfBirth;

    private Gender gender;

    @Pattern(regexp = "^\\d{3}-\\d{2}-\\d{4}$", message = "Invalid SSN format")
    private String ssn;

    @Size(max = 50, message = "MRN must not exceed 50 characters")
    private String mrn;

    // Contact Information
    @Pattern(regexp = "^[\\+]?[1-9][\\d\\s\\-\\(\\)]{7,15}$", message = "Invalid home phone format")
    private String phoneHome;

    @Pattern(regexp = "^[\\+]?[1-9][\\d\\s\\-\\(\\)]{7,15}$", message = "Invalid mobile phone format")
    private String phoneMobile;

    @Pattern(regexp = "^[\\+]?[1-9][\\d\\s\\-\\(\\)]{7,15}$", message = "Invalid work phone format")
    private String phoneWork;

    @Email(message = "Invalid email format")
    @Size(max = 100, message = "Email must not exceed 100 characters")
    private String email;

    // Address Information
    @Size(max = 200, message = "Address line 1 must not exceed 200 characters")
    private String addressLine1;

    @Size(max = 200, message = "Address line 2 must not exceed 200 characters")
    private String addressLine2;

    @Size(max = 100, message = "City must not exceed 100 characters")
    private String city;

    @Size(max = 50, message = "State must not exceed 50 characters")
    private String state;

    @Size(max = 20, message = "Postal code must not exceed 20 characters")
    private String postalCode;

    @Size(max = 50, message = "Country must not exceed 50 characters")
    private String country = "USA";

    // FHIR Information
    @Size(max = 100, message = "FHIR patient ID must not exceed 100 characters")
    private String fhirPatientId;

    @Size(max = 20, message = "FHIR resource version must not exceed 20 characters")
    private String fhirResourceVersion;

    // Auto-verification flag
    private Boolean autoVerify = false;

    // Constructors
    public PatientIdentityCreateRequestDto() {}\n\n    // Getters and Setters\n    public String getExternalPatientId() {\n        return externalPatientId;\n    }\n\n    public void setExternalPatientId(String externalPatientId) {\n        this.externalPatientId = externalPatientId;\n    }\n\n    public String getSourceSystem() {\n        return sourceSystem;\n    }\n\n    public void setSourceSystem(String sourceSystem) {\n        this.sourceSystem = sourceSystem;\n    }\n\n    public String getSourceSystemVersion() {\n        return sourceSystemVersion;\n    }\n\n    public void setSourceSystemVersion(String sourceSystemVersion) {\n        this.sourceSystemVersion = sourceSystemVersion;\n    }\n\n    public String getFirstName() {\n        return firstName;\n    }\n\n    public void setFirstName(String firstName) {\n        this.firstName = firstName;\n    }\n\n    public String getMiddleName() {\n        return middleName;\n    }\n\n    public void setMiddleName(String middleName) {\n        this.middleName = middleName;\n    }\n\n    public String getLastName() {\n        return lastName;\n    }\n\n    public void setLastName(String lastName) {\n        this.lastName = lastName;\n    }\n\n    public String getSuffix() {\n        return suffix;\n    }\n\n    public void setSuffix(String suffix) {\n        this.suffix = suffix;\n    }\n\n    public String getPreferredName() {\n        return preferredName;\n    }\n\n    public void setPreferredName(String preferredName) {\n        this.preferredName = preferredName;\n    }\n\n    public LocalDate getDateOfBirth() {\n        return dateOfBirth;\n    }\n\n    public void setDateOfBirth(LocalDate dateOfBirth) {\n        this.dateOfBirth = dateOfBirth;\n    }\n\n    public Gender getGender() {\n        return gender;\n    }\n\n    public void setGender(Gender gender) {\n        this.gender = gender;\n    }\n\n    public String getSsn() {\n        return ssn;\n    }\n\n    public void setSsn(String ssn) {\n        this.ssn = ssn;\n    }\n\n    public String getMrn() {\n        return mrn;\n    }\n\n    public void setMrn(String mrn) {\n        this.mrn = mrn;\n    }\n\n    public String getPhoneHome() {\n        return phoneHome;\n    }\n\n    public void setPhoneHome(String phoneHome) {\n        this.phoneHome = phoneHome;\n    }\n\n    public String getPhoneMobile() {\n        return phoneMobile;\n    }\n\n    public void setPhoneMobile(String phoneMobile) {\n        this.phoneMobile = phoneMobile;\n    }\n\n    public String getPhoneWork() {\n        return phoneWork;\n    }\n\n    public void setPhoneWork(String phoneWork) {\n        this.phoneWork = phoneWork;\n    }\n\n    public String getEmail() {\n        return email;\n    }\n\n    public void setEmail(String email) {\n        this.email = email;\n    }\n\n    public String getAddressLine1() {\n        return addressLine1;\n    }\n\n    public void setAddressLine1(String addressLine1) {\n        this.addressLine1 = addressLine1;\n    }\n\n    public String getAddressLine2() {\n        return addressLine2;\n    }\n\n    public void setAddressLine2(String addressLine2) {\n        this.addressLine2 = addressLine2;\n    }\n\n    public String getCity() {\n        return city;\n    }\n\n    public void setCity(String city) {\n        this.city = city;\n    }\n\n    public String getState() {\n        return state;\n    }\n\n    public void setState(String state) {\n        this.state = state;\n    }\n\n    public String getPostalCode() {\n        return postalCode;\n    }\n\n    public void setPostalCode(String postalCode) {\n        this.postalCode = postalCode;\n    }\n\n    public String getCountry() {\n        return country;\n    }\n\n    public void setCountry(String country) {\n        this.country = country;\n    }\n\n    public String getFhirPatientId() {\n        return fhirPatientId;\n    }\n\n    public void setFhirPatientId(String fhirPatientId) {\n        this.fhirPatientId = fhirPatientId;\n    }\n\n    public String getFhirResourceVersion() {\n        return fhirResourceVersion;\n    }\n\n    public void setFhirResourceVersion(String fhirResourceVersion) {\n        this.fhirResourceVersion = fhirResourceVersion;\n    }\n\n    public Boolean getAutoVerify() {\n        return autoVerify;\n    }\n\n    public void setAutoVerify(Boolean autoVerify) {\n        this.autoVerify = autoVerify;\n    }\n}
