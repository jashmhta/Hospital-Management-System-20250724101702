package com.hms.providermobile.controller;

import com.hms.providermobile.dto.*;
import com.hms.providermobile.entity.MobileSession;
import com.hms.providermobile.entity.Provider;
import com.hms.providermobile.service.ProviderMobileService;
import com.hms.providermobile.exception.ProviderMobileException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.servlet.http.HttpServletRequest;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

/**
 * Provider Mobile Controller
 * 
 * REST API endpoints for healthcare provider mobile applications including:
 * - Authentication and session management
 * - Provider profile and preferences
 * - Mobile device registration
 * - Push notifications and alerts
 * - Session history and analytics
 * - Security and audit features
 * 
 * All endpoints are secured and include comprehensive error handling,
 * validation, and audit logging for HIPAA compliance.
 */
@RestController
@RequestMapping("/api/v1/provider-mobile")
@Validated
@CrossOrigin(origins = "*")
public class ProviderMobileController {

    private static final Logger logger = LoggerFactory.getLogger(ProviderMobileController.class);

    @Autowired
    private ProviderMobileService providerMobileService;

    /**
     * Provider login endpoint
     * 
     * @param loginRequest Provider credentials and device information
     * @param request HTTP request for IP address
     * @return Authentication response with session tokens
     */
    @PostMapping("/auth/login")
    public ResponseEntity<ProviderLoginResponse> login(
            @Valid @RequestBody ProviderLoginRequest loginRequest,
            HttpServletRequest request) {
        
        try {
            // Set IP address from request
            loginRequest.setIpAddress(getClientIpAddress(request));
            loginRequest.setUserAgent(request.getHeader("User-Agent"));
            
            logger.info("Provider login attempt from: {}", loginRequest.getEmail());
            
            ProviderLoginResponse response = providerMobileService.authenticateProvider(loginRequest);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Login failed for: {}", loginRequest.getEmail(), e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(createErrorResponse("Authentication failed: " + e.getMessage()));
        }
    }

    /**
     * Refresh session token
     * 
     * @param refreshRequest Refresh token request
     * @return New session tokens
     */
    @PostMapping("/auth/refresh")
    public ResponseEntity<ProviderLoginResponse> refreshSession(
            @Valid @RequestBody RefreshTokenRequest refreshRequest) {
        
        try {
            logger.debug("Session refresh requested for device: {}", refreshRequest.getDeviceId());
            
            ProviderLoginResponse response = providerMobileService.refreshSession(
                refreshRequest.getRefreshToken(), 
                refreshRequest.getDeviceId()
            );
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Session refresh failed", e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(createErrorResponse("Session refresh failed: " + e.getMessage()));
        }
    }

    /**
     * Provider logout
     * 
     * @param sessionToken Session token to terminate
     * @return Logout confirmation
     */
    @PostMapping("/auth/logout")
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<Map<String, Object>> logout(
            @RequestHeader("Authorization") String authHeader) {
        
        try {
            String sessionToken = extractSessionToken(authHeader);
            
            providerMobileService.logoutProvider(sessionToken);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Logout successful");
            response.put("timestamp", LocalDateTime.now());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Logout failed", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createErrorMap("Logout failed: " + e.getMessage()));
        }
    }

    /**
     * Validate session and get provider information
     * 
     * @param authHeader Authorization header with session token
     * @return Provider information if session is valid
     */
    @GetMapping("/auth/validate")
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<ProviderDTO> validateSession(
            @RequestHeader("Authorization") String authHeader) {
        
        try {
            String sessionToken = extractSessionToken(authHeader);
            
            ProviderDTO provider = providerMobileService.validateSession(sessionToken);
            
            return ResponseEntity.ok(provider);
            
        } catch (Exception e) {
            logger.error("Session validation failed", e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    /**
     * Register mobile device
     * 
     * @param deviceRequest Device registration information
     * @return Registration confirmation
     */
    @PostMapping("/device/register")
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<Map<String, Object>> registerDevice(
            @Valid @RequestBody DeviceRegistrationRequest deviceRequest,
            @RequestHeader("Authorization") String authHeader) {
        
        try {
            String sessionToken = extractSessionToken(authHeader);
            ProviderDTO provider = providerMobileService.validateSession(sessionToken);
            
            providerMobileService.registerMobileDevice(
                provider.getId(),
                deviceRequest.getDeviceId(),
                deviceRequest.getDeviceType(),
                deviceRequest.getPushNotificationToken()
            );
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Device registered successfully");
            response.put("deviceId", deviceRequest.getDeviceId());
            response.put("timestamp", LocalDateTime.now());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Device registration failed", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(createErrorMap("Device registration failed: " + e.getMessage()));
        }
    }

    /**
     * Update provider preferences
     * 
     * @param preferences Updated preferences
     * @return Update confirmation
     */
    @PutMapping("/preferences")
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<Map<String, Object>> updatePreferences(
            @Valid @RequestBody Provider.ProviderPreferences preferences,
            @RequestHeader("Authorization") String authHeader) {
        
        try {
            String sessionToken = extractSessionToken(authHeader);
            ProviderDTO provider = providerMobileService.validateSession(sessionToken);
            
            providerMobileService.updateProviderPreferences(provider.getId(), preferences);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Preferences updated successfully");
            response.put("timestamp", LocalDateTime.now());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Preferences update failed", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(createErrorMap("Preferences update failed: " + e.getMessage()));
        }
    }

    /**
     * Get provider session history
     * 
     * @param startDate Start date for history
     * @param endDate End date for history
     * @param page Page number
     * @param size Page size
     * @return Provider session history
     */
    @GetMapping("/sessions/history")
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<Page<MobileSession>> getSessionHistory(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestHeader("Authorization") String authHeader) {
        
        try {
            String sessionToken = extractSessionToken(authHeader);
            ProviderDTO provider = providerMobileService.validateSession(sessionToken);
            
            Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
            Page<MobileSession> sessions = providerMobileService.getProviderSessionHistory(
                provider.getId(), startDate, endDate, pageable);
            
            return ResponseEntity.ok(sessions);
            
        } catch (Exception e) {
            logger.error("Failed to retrieve session history", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Search providers (admin function)
     * 
     * @param searchTerm Search term
     * @param page Page number
     * @param size Page size
     * @return Matching providers
     */
    @GetMapping("/providers/search")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROVIDER')")
    public ResponseEntity<Page<ProviderDTO>> searchProviders(
            @RequestParam String searchTerm,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        try {
            Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "lastName"));
            Page<ProviderDTO> providers = providerMobileService.searchProviders(searchTerm, pageable);
            
            return ResponseEntity.ok(providers);
            
        } catch (Exception e) {
            logger.error("Provider search failed", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Send notification to providers
     * 
     * @param notificationRequest Notification details
     * @return Notification confirmation
     */
    @PostMapping("/notifications/send")
    @PreAuthorize("hasRole('ADMIN') or hasRole('NOTIFICATION_SENDER')")
    public ResponseEntity<Map<String, Object>> sendNotification(
            @Valid @RequestBody NotificationRequest notificationRequest) {
        
        try {
            CompletableFuture<Void> result = providerMobileService.sendNotificationToProviders(
                notificationRequest.getSpecialties(),
                notificationRequest.getMessage(),
                notificationRequest.getPriority()
            );
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Notification sent successfully");
            response.put("specialties", notificationRequest.getSpecialties());
            response.put("timestamp", LocalDateTime.now());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Failed to send notification", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createErrorMap("Notification sending failed: " + e.getMessage()));
        }
    }

    /**
     * Get provider analytics (admin function)
     * 
     * @return Analytics data
     */
    @GetMapping("/analytics")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getAnalytics() {
        
        try {
            Map<String, Object> analytics = providerMobileService.getProviderAnalytics();
            
            return ResponseEntity.ok(analytics);
            
        } catch (Exception e) {
            logger.error("Failed to retrieve analytics", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createErrorMap("Analytics retrieval failed: " + e.getMessage()));
        }
    }

    /**
     * Health check endpoint
     * 
     * @return Service health status
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> health = new HashMap<>();
        health.put("service", "provider-mobile-backend");
        health.put("status", "UP");
        health.put("timestamp", LocalDateTime.now());
        health.put("version", "3.0.0");
        
        return ResponseEntity.ok(health);
    }

    // Exception handlers

    /**
     * Handle validation errors
     */
    @ExceptionHandler(jakarta.validation.ConstraintViolationException.class)
    public ResponseEntity<Map<String, Object>> handleValidationException(
            jakarta.validation.ConstraintViolationException e) {
        
        logger.warn("Validation error: {}", e.getMessage());
        
        Map<String, Object> error = new HashMap<>();
        error.put("error", "Validation failed");
        error.put("message", e.getMessage());
        error.put("timestamp", LocalDateTime.now());
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    /**
     * Handle provider mobile exceptions
     */
    @ExceptionHandler(ProviderMobileException.class)
    public ResponseEntity<Map<String, Object>> handleProviderMobileException(ProviderMobileException e) {
        
        logger.error("Provider mobile error: {}", e.getMessage(), e);
        
        Map<String, Object> error = new HashMap<>();
        error.put("error", "Provider mobile service error");
        error.put("message", e.getMessage());
        error.put("timestamp", LocalDateTime.now());
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }

    /**
     * Handle general exceptions
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGeneralException(Exception e) {
        
        logger.error("Unexpected error", e);
        
        Map<String, Object> error = new HashMap<>();
        error.put("error", "Internal server error");
        error.put("message", "An unexpected error occurred");
        error.put("timestamp", LocalDateTime.now());
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }

    // Private helper methods

    private String extractSessionToken(String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
        throw new IllegalArgumentException("Invalid authorization header");
    }

    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        
        String xRealIP = request.getHeader("X-Real-IP");
        if (xRealIP != null && !xRealIP.isEmpty()) {
            return xRealIP;
        }
        
        return request.getRemoteAddr();
    }

    private ProviderLoginResponse createErrorResponse(String message) {
        ProviderLoginResponse response = new ProviderLoginResponse();
        response.setMessage(message);
        return response;
    }

    private Map<String, Object> createErrorMap(String message) {
        Map<String, Object> error = new HashMap<>();
        error.put("error", message);
        error.put("timestamp", LocalDateTime.now());
        return error;
    }

    // Additional DTO classes for requests

    public static class RefreshTokenRequest {
        @NotBlank(message = "Refresh token is required")
        private String refreshToken;
        
        @NotBlank(message = "Device ID is required")
        private String deviceId;

        // Getters and Setters
        public String getRefreshToken() { return refreshToken; }
        public void setRefreshToken(String refreshToken) { this.refreshToken = refreshToken; }

        public String getDeviceId() { return deviceId; }
        public void setDeviceId(String deviceId) { this.deviceId = deviceId; }
    }

    public static class DeviceRegistrationRequest {
        @NotBlank(message = "Device ID is required")
        private String deviceId;
        
        @NotNull(message = "Device type is required")
        private MobileSession.DeviceType deviceType;
        
        private String pushNotificationToken;

        // Getters and Setters
        public String getDeviceId() { return deviceId; }
        public void setDeviceId(String deviceId) { this.deviceId = deviceId; }

        public MobileSession.DeviceType getDeviceType() { return deviceType; }
        public void setDeviceType(MobileSession.DeviceType deviceType) { this.deviceType = deviceType; }

        public String getPushNotificationToken() { return pushNotificationToken; }
        public void setPushNotificationToken(String pushNotificationToken) { this.pushNotificationToken = pushNotificationToken; }
    }

    public static class NotificationRequest {
        @NotNull(message = "Specialties are required")
        private List<String> specialties;
        
        @NotBlank(message = "Message is required")
        private String message;
        
        private String priority = "NORMAL";

        // Getters and Setters
        public List<String> getSpecialties() { return specialties; }
        public void setSpecialties(List<String> specialties) { this.specialties = specialties; }

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }

        public String getPriority() { return priority; }
        public void setPriority(String priority) { this.priority = priority; }
    }
}
