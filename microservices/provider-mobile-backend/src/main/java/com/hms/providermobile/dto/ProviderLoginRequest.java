package com.hms.providermobile.dto;

import com.hms.providermobile.entity.MobileSession;
import jakarta.validation.constraints.*;

/**
 * Provider Login Request DTO
 * 
 * Data transfer object for provider mobile application login requests.
 * Contains credentials, device information, and security parameters.
 */
public class ProviderLoginRequest {

    @NotBlank(message = "Email is required")
    @Email(message = "Valid email address is required")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 8, max = 100, message = "Password must be between 8 and 100 characters")
    private String password;

    @NotBlank(message = "Device ID is required")
    private String deviceId;

    private String deviceName;

    @NotNull(message = "Device type is required")
    private MobileSession.DeviceType deviceType;

    private String appVersion;

    private String osVersion;

    private String ipAddress;

    private String userAgent;

    private String pushNotificationToken;

    private String twoFactorCode;

    private Boolean biometricEnabled = false;

    private Double latitude;

    private Double longitude;

    // Constructors
    public ProviderLoginRequest() {}

    public ProviderLoginRequest(String email, String password, String deviceId, MobileSession.DeviceType deviceType) {
        this.email = email;
        this.password = password;
        this.deviceId = deviceId;
        this.deviceType = deviceType;
    }

    // Getters and Setters
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getDeviceId() { return deviceId; }
    public void setDeviceId(String deviceId) { this.deviceId = deviceId; }

    public String getDeviceName() { return deviceName; }
    public void setDeviceName(String deviceName) { this.deviceName = deviceName; }

    public MobileSession.DeviceType getDeviceType() { return deviceType; }
    public void setDeviceType(MobileSession.DeviceType deviceType) { this.deviceType = deviceType; }

    public String getAppVersion() { return appVersion; }
    public void setAppVersion(String appVersion) { this.appVersion = appVersion; }

    public String getOsVersion() { return osVersion; }
    public void setOsVersion(String osVersion) { this.osVersion = osVersion; }

    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }

    public String getUserAgent() { return userAgent; }
    public void setUserAgent(String userAgent) { this.userAgent = userAgent; }

    public String getPushNotificationToken() { return pushNotificationToken; }
    public void setPushNotificationToken(String pushNotificationToken) { this.pushNotificationToken = pushNotificationToken; }

    public String getTwoFactorCode() { return twoFactorCode; }
    public void setTwoFactorCode(String twoFactorCode) { this.twoFactorCode = twoFactorCode; }

    public Boolean getBiometricEnabled() { return biometricEnabled; }
    public void setBiometricEnabled(Boolean biometricEnabled) { this.biometricEnabled = biometricEnabled; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
}
