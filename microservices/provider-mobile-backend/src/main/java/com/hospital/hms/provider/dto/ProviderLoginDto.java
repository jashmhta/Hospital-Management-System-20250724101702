package com.hospital.hms.provider.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Provider Login Data Transfer Object
 * 
 * Contains authentication credentials for healthcare provider login.
 * Supports multiple authentication methods and mobile-specific features.
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ProviderLoginDto {

    /**
     * Provider username or employee ID
     */
    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    private String username;

    /**
     * Provider password
     */
    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    private String password;

    /**
     * Two-factor authentication code (if enabled)
     */
    private String twoFactorCode;

    /**
     * Device information for mobile tracking
     */
    private DeviceInfo deviceInfo;

    /**
     * Biometric authentication data (fingerprint, face ID)
     */
    private String biometricData;

    /**
     * Remember device flag
     */
    private Boolean rememberDevice;

    /**
     * Login location coordinates
     */
    private LocationInfo location;

    /**
     * Device information nested class
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class DeviceInfo {
        
        /**
         * Device unique identifier
         */
        private String deviceId;
        
        /**
         * Device type (mobile, tablet)
         */
        private String deviceType;
        
        /**
         * Operating system
         */
        private String operatingSystem;
        
        /**
         * OS version
         */
        private String osVersion;
        
        /**
         * App version
         */
        private String appVersion;
        
        /**
         * Device model
         */
        private String deviceModel;
        
        /**
         * Device manufacturer
         */
        private String manufacturer;
        
        /**
         * Screen resolution
         */
        private String screenResolution;
        
        /**
         * Push notification token
         */
        private String pushToken;
    }

    /**
     * Location information nested class
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class LocationInfo {
        
        /**
         * Latitude coordinate
         */
        private Double latitude;
        
        /**
         * Longitude coordinate
         */
        private Double longitude;
        
        /**
         * Location accuracy in meters
         */
        private Double accuracy;
        
        /**
         * Location timestamp
         */
        private Long timestamp;
        
        /**
         * Location source (GPS, network, passive)
         */
        private String source;
    }
}
