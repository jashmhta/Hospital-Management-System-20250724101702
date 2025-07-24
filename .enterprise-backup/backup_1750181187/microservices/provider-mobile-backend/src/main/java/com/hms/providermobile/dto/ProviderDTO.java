package com.hms.providermobile.dto;

import com.hms.providermobile.entity.Provider;
import java.time.LocalDateTime;

/**
 * Provider DTO
 * 
 * Data transfer object for provider information used in mobile applications.
 * Contains essential provider data without sensitive information.
 */
public class ProviderDTO {

    private Long id;

    private String employeeId;

    private String firstName;

    private String lastName;

    private String email;

    private String phoneNumber;

    private Provider.ProviderType providerType;

    private String specialty;

    private String subSpecialty;

    private String departmentName;

    private Provider.ProviderStatus status;

    private String profileImageUrl;

    private Boolean mobileDeviceRegistered;

    private Boolean twoFactorEnabled;

    private LocalDateTime lastLogin;

    private Provider.ProviderPreferences preferences;

    // Constructors
    public ProviderDTO() {}

    public ProviderDTO(Long id, String employeeId, String firstName, String lastName, String email) {
        this.id = id;
        this.employeeId = employeeId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
    }

    // Utility methods
    public String getFullName() {
        return firstName + " " + lastName;
    }

    public String getDisplayName() {
        return "Dr. " + firstName + " " + lastName;
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

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public Provider.ProviderType getProviderType() { return providerType; }
    public void setProviderType(Provider.ProviderType providerType) { this.providerType = providerType; }

    public String getSpecialty() { return specialty; }
    public void setSpecialty(String specialty) { this.specialty = specialty; }

    public String getSubSpecialty() { return subSpecialty; }
    public void setSubSpecialty(String subSpecialty) { this.subSpecialty = subSpecialty; }

    public String getDepartmentName() { return departmentName; }
    public void setDepartmentName(String departmentName) { this.departmentName = departmentName; }

    public Provider.ProviderStatus getStatus() { return status; }
    public void setStatus(Provider.ProviderStatus status) { this.status = status; }

    public String getProfileImageUrl() { return profileImageUrl; }
    public void setProfileImageUrl(String profileImageUrl) { this.profileImageUrl = profileImageUrl; }

    public Boolean getMobileDeviceRegistered() { return mobileDeviceRegistered; }
    public void setMobileDeviceRegistered(Boolean mobileDeviceRegistered) { this.mobileDeviceRegistered = mobileDeviceRegistered; }

    public Boolean getTwoFactorEnabled() { return twoFactorEnabled; }
    public void setTwoFactorEnabled(Boolean twoFactorEnabled) { this.twoFactorEnabled = twoFactorEnabled; }

    public LocalDateTime getLastLogin() { return lastLogin; }
    public void setLastLogin(LocalDateTime lastLogin) { this.lastLogin = lastLogin; }

    public Provider.ProviderPreferences getPreferences() { return preferences; }
    public void setPreferences(Provider.ProviderPreferences preferences) { this.preferences = preferences; }
}
