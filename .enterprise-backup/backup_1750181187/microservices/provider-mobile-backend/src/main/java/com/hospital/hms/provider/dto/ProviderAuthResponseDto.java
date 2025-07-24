package com.hospital.hms.provider.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * Provider Authentication Response Data Transfer Object
 * 
 * Contains authentication tokens, provider information, and session details
 * for successful healthcare provider authentication.
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ProviderAuthResponseDto {

    /**
     * JWT access token
     */
    private String accessToken;

    /**
     * JWT refresh token
     */
    private String refreshToken;

    /**
     * Token type (usually "Bearer")
     */
    private String tokenType;

    /**
     * Token expiration time in seconds
     */
    private Long expiresIn;

    /**
     * Token scope/permissions
     */
    private String scope;

    /**
     * Provider basic information
     */
    private ProviderInfo provider;

    /**
     * Session information
     */
    private SessionInfo session;

    /**
     * Provider permissions and roles
     */
    private List<String> permissions;

    /**
     * Provider's assigned departments
     */
    private List<String> departments;

    /**
     * Provider's assigned locations/facilities
     */
    private List<String> facilities;

    /**
     * Mobile app configuration
     */
    private MobileConfig mobileConfig;

    /**
     * Authentication metadata
     */
    private Map<String, Object> metadata;

    /**
     * Provider information nested class
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class ProviderInfo {
        
        /**
         * Provider unique identifier
         */
        private String providerId;
        
        /**
         * Provider employee ID
         */
        private String employeeId;
        
        /**
         * Provider full name
         */
        private String fullName;
        
        /**
         * Provider first name
         */
        private String firstName;
        
        /**
         * Provider last name
         */
        private String lastName;
        
        /**
         * Provider email
         */
        private String email;
        
        /**
         * Provider phone number
         */
        private String phoneNumber;
        
        /**
         * Provider role (doctor, nurse, physician assistant, etc.)
         */
        private String role;
        
        /**
         * Provider specialty
         */
        private String specialty;
        
        /**
         * Provider license number
         */
        private String licenseNumber;
        
        /**
         * Provider profile picture URL
         */
        private String profilePictureUrl;
        
        /**
         * Provider status (active, inactive, suspended)
         */
        private String status;
        
        /**
         * Primary department
         */
        private String primaryDepartment;
        
        /**
         * Primary facility
         */
        private String primaryFacility;
    }

    /**
     * Session information nested class
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class SessionInfo {
        
        /**
         * Session ID
         */
        private String sessionId;
        
        /**
         * Session start time
         */
        @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
        private LocalDateTime sessionStart;
        
        /**
         * Session expiry time
         */
        @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
        private LocalDateTime sessionExpiry;
        
        /**
         * Last activity time
         */
        @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
        private LocalDateTime lastActivity;
        
        /**
         * Session timeout in minutes
         */
        private Integer sessionTimeoutMinutes;
        
        /**
         * Client IP address
         */
        private String clientIpAddress;
        
        /**
         * User agent
         */
        private String userAgent;
        
        /**
         * Device information
         */
        private String deviceInfo;
        
        /**
         * Session location
         */
        private String location;
        
        /**
         * Session security level
         */
        private String securityLevel;
    }

    /**
     * Mobile app configuration nested class
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class MobileConfig {
        
        /**
         * App theme preference
         */
        private String theme;
        
        /**
         * Language preference
         */
        private String language;
        
        /**
         * Timezone
         */
        private String timezone;
        
        /**
         * Notification preferences
         */
        private NotificationPreferences notifications;
        
        /**
         * Feature flags
         */
        private Map<String, Boolean> features;
        
        /**
         * Default page size for lists
         */
        private Integer defaultPageSize;
        
        /**
         * Offline mode enabled
         */
        private Boolean offlineModeEnabled;
        
        /**
         * Biometric authentication enabled
         */
        private Boolean biometricEnabled;
        
        /**
         * Quick actions configuration
         */
        private List<String> quickActions;
        
        /**
         * Dashboard configuration
         */
        private Map<String, Object> dashboardConfig;
    }

    /**
     * Notification preferences nested class
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class NotificationPreferences {
        
        /**
         * Push notifications enabled
         */
        private Boolean pushEnabled;
        
        /**
         * Email notifications enabled
         */
        private Boolean emailEnabled;
        
        /**
         * SMS notifications enabled
         */
        private Boolean smsEnabled;
        
        /**
         * Appointment reminders
         */
        private Boolean appointmentReminders;
        
        /**
         * Emergency alerts
         */
        private Boolean emergencyAlerts;
        
        /**
         * Lab result notifications
         */
        private Boolean labResults;
        
        /**
         * Patient updates
         */
        private Boolean patientUpdates;
        
        /**
         * Schedule changes
         */
        private Boolean scheduleChanges;
        
        /**
         * Quiet hours start
         */
        private String quietHoursStart;
        
        /**
         * Quiet hours end
         */
        private String quietHoursEnd;
        
        /**
         * Notification categories
         */
        private Map<String, Boolean> categories;
    }
}
