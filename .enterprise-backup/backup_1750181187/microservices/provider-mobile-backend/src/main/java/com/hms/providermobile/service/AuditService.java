package com.hms.providermobile.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Audit Service
 * 
 * Handles HIPAA-compliant audit logging for all provider mobile activities.
 * Tracks authentication, data access, and security events.
 */
@Service
public class AuditService {

    private static final Logger auditLogger = LoggerFactory.getLogger("AUDIT");

    public void logProviderLogin(Long providerId, String deviceId, String ipAddress, boolean success) {
        auditLogger.info("PROVIDER_LOGIN: providerId={}, deviceId={}, ipAddress={}, success={}, timestamp={}", 
            providerId, deviceId, ipAddress, success, LocalDateTime.now());
    }

    public void logProviderLogout(Long providerId, String deviceId) {
        auditLogger.info("PROVIDER_LOGOUT: providerId={}, deviceId={}, timestamp={}", 
            providerId, deviceId, LocalDateTime.now());
    }

    public void logSessionRefresh(Long providerId, String deviceId) {
        auditLogger.info("SESSION_REFRESH: providerId={}, deviceId={}, timestamp={}", 
            providerId, deviceId, LocalDateTime.now());
    }

    public void logDeviceRegistration(Long providerId, String deviceId, String deviceType) {
        auditLogger.info("DEVICE_REGISTRATION: providerId={}, deviceId={}, deviceType={}, timestamp={}", 
            providerId, deviceId, deviceType, LocalDateTime.now());
    }

    public void logPreferencesUpdate(Long providerId) {
        auditLogger.info("PREFERENCES_UPDATE: providerId={}, timestamp={}", 
            providerId, LocalDateTime.now());
    }

    public void logFailedAuthentication(Long providerId, String deviceId, String ipAddress) {
        auditLogger.warn("FAILED_AUTH: providerId={}, deviceId={}, ipAddress={}, timestamp={}", 
            providerId, deviceId, ipAddress, LocalDateTime.now());
    }

    public void logBulkNotification(List<String> specialties, int recipientCount) {
        auditLogger.info("BULK_NOTIFICATION: specialties={}, recipientCount={}, timestamp={}", 
            specialties, recipientCount, LocalDateTime.now());
    }

    public void logDataAccess(Long providerId, String dataType, String patientId, String action) {
        auditLogger.info("DATA_ACCESS: providerId={}, dataType={}, patientId={}, action={}, timestamp={}", 
            providerId, dataType, patientId, action, LocalDateTime.now());
    }

    public void logSecurityEvent(String eventType, Long providerId, String details) {
        auditLogger.warn("SECURITY_EVENT: eventType={}, providerId={}, details={}, timestamp={}", 
            eventType, providerId, details, LocalDateTime.now());
    }
}
