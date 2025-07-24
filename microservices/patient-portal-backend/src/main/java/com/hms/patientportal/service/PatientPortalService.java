package com.hms.patientportal.service;

import com.hms.patientportal.entity.PatientPortalUser;
import com.hms.patientportal.entity.AppointmentRequest;
import com.hms.patientportal.entity.PortalMessage;
import com.hms.patientportal.entity.FamilyMember;
import com.hms.patientportal.repository.PatientPortalUserRepository;
import com.hms.patientportal.exception.PatientPortalException;
import com.hms.patientportal.exception.AuthenticationException;
import com.hms.patientportal.exception.ValidationException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;
import java.security.SecureRandom;
import java.util.regex.Pattern;

/**
 * Patient Portal Service
 * 
 * Comprehensive business logic service for patient portal operations including
 * user management, authentication, appointment requests, messaging, family member
 * management, medical record access, and healthcare communication.
 */
@Service
@Transactional
public class PatientPortalService {

    private static final Logger logger = LoggerFactory.getLogger(PatientPortalService.class);
    
    // Constants for security and validation
    private static final int MAX_FAILED_LOGIN_ATTEMPTS = 5;
    private static final int ACCOUNT_LOCKOUT_DURATION_HOURS = 24;
    private static final int PASSWORD_MIN_LENGTH = 8;
    private static final int ACTIVATION_TOKEN_EXPIRY_HOURS = 48;
    private static final int PASSWORD_RESET_TOKEN_EXPIRY_HOURS = 2;
    private static final int MAX_FAMILY_MEMBERS = 10;
    private static final int MESSAGE_RETENTION_DAYS = 365;
    
    // Password validation patterns
    private static final Pattern PASSWORD_PATTERN = Pattern.compile(
        "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=\\S+$).{8,}$"
    );
    private static final Pattern EMAIL_PATTERN = Pattern.compile(
        "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
    );
    private static final Pattern PHONE_PATTERN = Pattern.compile(
        "^\\+?[1-9]\\d{1,14}$"
    );

    @Autowired
    private PatientPortalUserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private EmailNotificationService emailService;
    
    @Autowired
    private AuditLogService auditService;
    
    @Autowired
    private SecurityService securityService;
    
    @Autowired
    private MedicalRecordService medicalRecordService;
    
    @Autowired
    private AppointmentService appointmentService;
    
    private final SecureRandom secureRandom = new SecureRandom();

    /**
     * Register new patient portal user
     */
    public PatientPortalUser registerUser(PatientPortalUser user, String password) {
        logger.info("Registering new patient portal user: {}", user.getEmail());
        
        try {
            // Validate input data
            validateUserRegistration(user, password);
            
            // Check for existing user
            if (userRepository.findByEmail(user.getEmail()).isPresent()) {
                throw new ValidationException("User with email already exists: " + user.getEmail());
            }
            
            if (user.getPortalUsername() != null && 
                userRepository.findByPortalUsername(user.getPortalUsername()).isPresent()) {
                throw new ValidationException("Username already taken: " + user.getPortalUsername());
            }
            
            // Set default values and security settings
            user.setPasswordHash(passwordEncoder.encode(password));
            user.setAccountStatus(PatientPortalUser.AccountStatus.PENDING_VERIFICATION);
            user.setActivationToken(generateSecureToken());
            user.setActivationTokenExpiresAt(LocalDateTime.now().plusHours(ACTIVATION_TOKEN_EXPIRY_HOURS));
            user.setEmailVerified(false);
            user.setPhoneVerified(false);
            user.setTwoFactorEnabled(false);
            user.setAccountLocked(false);
            user.setFailedLoginAttempts(0);
            user.setPasswordChangedAt(LocalDateTime.now());
            user.setPasswordExpiresAt(LocalDateTime.now().plusDays(90)); // 90-day password expiry
            
            // Initialize preferences with secure defaults
            if (user.getPreferences() == null) {
                user.setPreferences(createDefaultPreferences());
            }
            
            // Save user
            PatientPortalUser savedUser = userRepository.save(user);
            
            // Send activation email
            emailService.sendActivationEmail(savedUser.getEmail(), savedUser.getActivationToken());
            
            // Log registration
            auditService.logUserRegistration(savedUser.getId(), savedUser.getEmail());
            
            logger.info("Successfully registered user: {} with ID: {}", savedUser.getEmail(), savedUser.getId());
            return savedUser;
            
        } catch (Exception e) {
            logger.error("Error registering user: {}", e.getMessage(), e);
            auditService.logRegistrationFailure(user.getEmail(), e.getMessage());
            throw new PatientPortalException("Registration failed", e);
        }
    }

    /**
     * Authenticate user login
     */
    public PatientPortalUser authenticateUser(String emailOrUsername, String password, String ipAddress) {
        logger.info("Authenticating user: {}", emailOrUsername);
        
        try {
            // Find user by email or username
            Optional<PatientPortalUser> userOpt = userRepository.findByEmail(emailOrUsername);
            if (userOpt.isEmpty()) {
                userOpt = userRepository.findByPortalUsername(emailOrUsername);
            }
            
            if (userOpt.isEmpty()) {
                auditService.logFailedLogin(emailOrUsername, ipAddress, "User not found");
                throw new AuthenticationException("Invalid credentials");
            }
            
            PatientPortalUser user = userOpt.get();
            
            // Check account status
            if (user.getAccountStatus() != PatientPortalUser.AccountStatus.ACTIVE) {
                auditService.logFailedLogin(emailOrUsername, ipAddress, "Account not active");
                throw new AuthenticationException("Account is not active");
            }
            
            // Check if account is locked
            if (user.getAccountLocked()) {
                if (user.getLockedUntil() != null && LocalDateTime.now().isAfter(user.getLockedUntil())) {
                    // Auto-unlock expired lockout
                    user.setAccountLocked(false);
                    user.setLockedUntil(null);
                    user.setFailedLoginAttempts(0);
                    userRepository.save(user);
                } else {
                    auditService.logFailedLogin(emailOrUsername, ipAddress, "Account locked");
                    throw new AuthenticationException("Account is locked");
                }
            }
            
            // Verify password
            if (!passwordEncoder.matches(password, user.getPasswordHash())) {
                handleFailedLogin(user, ipAddress);
                auditService.logFailedLogin(emailOrUsername, ipAddress, "Invalid password");
                throw new AuthenticationException("Invalid credentials");
            }
            
            // Check password expiry
            if (user.getPasswordExpiresAt() != null && LocalDateTime.now().isAfter(user.getPasswordExpiresAt())) {
                auditService.logFailedLogin(emailOrUsername, ipAddress, "Password expired");
                throw new AuthenticationException("Password has expired");
            }
            
            // Successful login - reset failed attempts and update login info
            user.setFailedLoginAttempts(0);
            user.setLastLoginAt(LocalDateTime.now());
            user.setLastLoginIp(ipAddress);
            user.setLoginCount(user.getLoginCount() + 1);
            userRepository.save(user);
            
            auditService.logSuccessfulLogin(user.getId(), ipAddress);
            
            logger.info("Successfully authenticated user: {} (ID: {})", user.getEmail(), user.getId());
            return user;
            
        } catch (AuthenticationException e) {
            throw e;
        } catch (Exception e) {
            logger.error("Error during authentication: {}", e.getMessage(), e);
            throw new PatientPortalException("Authentication failed", e);
        }
    }

    /**
     * Activate user account with token
     */
    @Transactional
    public void activateAccount(String activationToken) {
        logger.info("Activating account with token");
        
        PatientPortalUser user = userRepository.findByValidActivationToken(activationToken, LocalDateTime.now())
            .orElseThrow(() -> new ValidationException("Invalid or expired activation token"));
        
        user.setEmailVerified(true);
        user.setAccountStatus(PatientPortalUser.AccountStatus.ACTIVE);
        user.setActivationToken(null);
        user.setActivationTokenExpiresAt(null);
        
        userRepository.save(user);
        auditService.logAccountActivation(user.getId());
        
        // Send welcome email
        emailService.sendWelcomeEmail(user.getEmail(), user.getFirstName());
        
        logger.info("Successfully activated account for user ID: {}", user.getId());
    }

    /**
     * Request password reset
     */
    public void requestPasswordReset(String email) {
        logger.info("Password reset requested for: {}", email);
        
        Optional<PatientPortalUser> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            // Don't reveal if email exists for security
            logger.warn("Password reset requested for non-existent email: {}", email);
            return;
        }
        
        PatientPortalUser user = userOpt.get();
        user.setPasswordResetToken(generateSecureToken());
        user.setPasswordResetTokenExpiresAt(LocalDateTime.now().plusHours(PASSWORD_RESET_TOKEN_EXPIRY_HOURS));
        
        userRepository.save(user);
        emailService.sendPasswordResetEmail(user.getEmail(), user.getPasswordResetToken());
        auditService.logPasswordResetRequest(user.getId());
    }

    /**
     * Reset password with token
     */
    @Transactional
    public void resetPassword(String resetToken, String newPassword) {
        logger.info("Resetting password with token");
        
        PatientPortalUser user = userRepository.findByValidPasswordResetToken(resetToken, LocalDateTime.now())
            .orElseThrow(() -> new ValidationException("Invalid or expired reset token"));
        
        validatePassword(newPassword);
        
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        user.setPasswordResetToken(null);
        user.setPasswordResetTokenExpiresAt(null);
        user.setPasswordChangedAt(LocalDateTime.now());
        user.setPasswordExpiresAt(LocalDateTime.now().plusDays(90));
        user.setFailedLoginAttempts(0);
        user.setAccountLocked(false);
        user.setLockedUntil(null);
        
        userRepository.save(user);
        auditService.logPasswordReset(user.getId());
        
        emailService.sendPasswordChangeNotification(user.getEmail());
        
        logger.info("Successfully reset password for user ID: {}", user.getId());
    }

    /**
     * Update user profile
     */
    @PreAuthorize("hasRole('PATIENT') or hasRole('ADMIN')")
    @CacheEvict(value = "userProfiles", key = "#userId")
    public PatientPortalUser updateProfile(Long userId, PatientPortalUser updatedInfo) {
        logger.info("Updating profile for user ID: {}", userId);
        
        PatientPortalUser user = getUserById(userId);
        
        // Validate email change
        if (!user.getEmail().equals(updatedInfo.getEmail())) {
            if (userRepository.existsByEmailAndIdNot(updatedInfo.getEmail(), userId)) {
                throw new ValidationException("Email already in use");
            }
            user.setEmail(updatedInfo.getEmail());
            user.setEmailVerified(false); // Require re-verification
        }
        
        // Update basic information
        user.setFirstName(updatedInfo.getFirstName());
        user.setLastName(updatedInfo.getLastName());
        user.setMiddleName(updatedInfo.getMiddleName());
        user.setDateOfBirth(updatedInfo.getDateOfBirth());
        user.setGender(updatedInfo.getGender());
        user.setPhoneNumber(updatedInfo.getPhoneNumber());
        user.setAddress(updatedInfo.getAddress());
        user.setCity(updatedInfo.getCity());
        user.setState(updatedInfo.getState());
        user.setZipCode(updatedInfo.getZipCode());
        user.setCountry(updatedInfo.getCountry());
        
        // Update preferences if provided
        if (updatedInfo.getPreferences() != null) {
            user.setPreferences(updatedInfo.getPreferences());
        }
        
        PatientPortalUser savedUser = userRepository.save(user);
        auditService.logProfileUpdate(userId);
        
        logger.info("Successfully updated profile for user ID: {}", userId);
        return savedUser;
    }

    /**
     * Submit appointment request
     */
    @PreAuthorize("hasRole('PATIENT')")
    public AppointmentRequest submitAppointmentRequest(Long userId, AppointmentRequest request) {
        logger.info("Submitting appointment request for user ID: {}", userId);
        
        PatientPortalUser user = getUserById(userId);
        
        // Validate appointment request
        validateAppointmentRequest(request);
        
        // Check for duplicate recent requests
        LocalDateTime recentCutoff = LocalDateTime.now().minusHours(1);
        boolean hasDuplicateRequest = user.getAppointmentRequests().stream()
            .anyMatch(req -> req.getCreatedAt().isAfter(recentCutoff) &&
                           req.getRequestedProviderId().equals(request.getRequestedProviderId()) &&
                           req.getStatus() == AppointmentRequest.RequestStatus.PENDING);
        
        if (hasDuplicateRequest) {
            throw new ValidationException("Duplicate appointment request within the last hour");
        }
        
        request.setPatient(user);
        request.setPatientPhone(user.getPhoneNumber());
        request.setPatientEmail(user.getEmail());
        request.setStatus(AppointmentRequest.RequestStatus.PENDING);
        
        // Auto-prioritize based on keywords in reason
        if (containsUrgentKeywords(request.getReasonForVisit()) || 
            containsUrgentKeywords(request.getSymptoms())) {
            request.setPriority(AppointmentRequest.Priority.URGENT);
        }
        
        user.getAppointmentRequests().add(request);
        userRepository.save(user);
        
        // Notify staff of urgent requests
        if (request.getPriority() == AppointmentRequest.Priority.URGENT || 
            request.getPriority() == AppointmentRequest.Priority.EMERGENCY) {
            emailService.sendUrgentAppointmentNotification(request);
        }
        
        auditService.logAppointmentRequest(userId, request.getId());
        
        logger.info("Successfully submitted appointment request ID: {} for user ID: {}", 
                   request.getId(), userId);
        return request;
    }

    /**
     * Send secure message
     */
    @PreAuthorize("hasRole('PATIENT')")
    public PortalMessage sendMessage(Long userId, PortalMessage message) {
        logger.info("Sending message from user ID: {}", userId);
        
        PatientPortalUser user = getUserById(userId);
        
        // Validate message
        validateMessage(message);
        
        message.setPatient(user);
        message.setSenderId(userId);
        message.setSenderName(user.getFullName());
        message.setSenderType(PortalMessage.SenderType.PATIENT);
        message.setIsEncrypted(true);
        message.setEncryptionKeyId(securityService.getCurrentEncryptionKeyId());
        message.setHipaaLoggingId(auditService.generateHipaaLoggingId());
        
        // Generate thread ID if new conversation
        if (message.getThreadId() == null) {
            message.setThreadId(generateMessageThreadId());
        }
        
        user.getMessages().add(message);
        userRepository.save(user);
        
        // Notify recipient if it's a provider
        if (message.getRecipientType() == PortalMessage.RecipientType.PROVIDER) {
            emailService.sendNewMessageNotification(message);
        }
        
        auditService.logMessageSent(userId, message.getId(), message.getRecipientId());
        
        logger.info("Successfully sent message ID: {} from user ID: {}", message.getId(), userId);
        return message;
    }

    /**
     * Add family member
     */
    @PreAuthorize("hasRole('PATIENT')")
    public FamilyMember addFamilyMember(Long userId, FamilyMember familyMember) {
        logger.info("Adding family member for user ID: {}", userId);
        
        PatientPortalUser user = getUserById(userId);
        
        // Check family member limit
        if (user.getFamilyMembers().size() >= MAX_FAMILY_MEMBERS) {
            throw new ValidationException("Maximum number of family members reached");
        }
        
        // Validate family member data
        validateFamilyMember(familyMember);
        
        familyMember.setPatient(user);
        familyMember.setVerificationStatus(FamilyMember.VerificationStatus.PENDING);
        familyMember.setCreatedBy(user.getFullName());
        
        // Set default access levels based on relationship
        setDefaultFamilyMemberAccess(familyMember);
        
        user.getFamilyMembers().add(familyMember);
        userRepository.save(user);
        
        auditService.logFamilyMemberAdded(userId, familyMember.getId());
        
        logger.info("Successfully added family member ID: {} for user ID: {}", 
                   familyMember.getId(), userId);
        return familyMember;
    }

    /**
     * Get user medical records access
     */
    @PreAuthorize("hasRole('PATIENT') or hasRole('FAMILY_MEMBER')")
    @Cacheable(value = "medicalRecords", key = "#userId")
    public List<Object> getMedicalRecords(Long userId, String accessLevel) {
        logger.info("Retrieving medical records for user ID: {} with access level: {}", userId, accessLevel);
        
        PatientPortalUser user = getUserById(userId);
        
        // Apply HIPAA filtering based on access level
        List<Object> records = medicalRecordService.getFilteredRecords(user.getPatientId(), accessLevel);
        
        auditService.logMedicalRecordAccess(userId, user.getPatientId(), accessLevel);
        
        return records;
    }

    /**
     * Get user dashboard data
     */
    @PreAuthorize("hasRole('PATIENT')")
    @Cacheable(value = "userDashboard", key = "#userId")
    public Map<String, Object> getUserDashboard(Long userId) {
        logger.info("Getting dashboard data for user ID: {}", userId);
        
        PatientPortalUser user = getUserById(userId);
        
        Map<String, Object> dashboard = new HashMap<>();
        dashboard.put("user", user);
        dashboard.put("upcomingAppointments", appointmentService.getUpcomingAppointments(user.getPatientId()));
        dashboard.put("pendingRequests", user.getAppointmentRequests().stream()
            .filter(req -> req.getStatus() == AppointmentRequest.RequestStatus.PENDING)
            .count());
        dashboard.put("unreadMessages", user.getMessages().stream()
            .filter(msg -> msg.getReadAt() == null)
            .count());
        dashboard.put("familyMembers", user.getFamilyMembers().size());
        dashboard.put("lastLogin", user.getLastLoginAt());
        
        return dashboard;
    }

    /**
     * Search users (admin function)
     */
    @PreAuthorize("hasRole('ADMIN')")
    public Page<PatientPortalUser> searchUsers(String searchTerm, Pageable pageable) {
        logger.info("Searching users with term: {}", searchTerm);
        return userRepository.searchActiveUsers(searchTerm, pageable);
    }

    /**
     * Get user analytics (admin function)
     */
    @PreAuthorize("hasRole('ADMIN')")
    public Map<String, Object> getUserAnalytics() {
        logger.info("Generating user analytics");
        
        Map<String, Object> analytics = new HashMap<>();
        
        LocalDateTime monthAgo = LocalDateTime.now().minusDays(30);
        analytics.put("activeUsers", userRepository.countActiveUsersInTimeRange(monthAgo));
        analytics.put("registrationsByState", userRepository.getUserCountByState());
        analytics.put("dailyRegistrations", userRepository.getDailyRegistrationCounts(monthAgo));
        analytics.put("twoFactorEnabled", userRepository.countUsersWithTwoFactorEnabled());
        
        return analytics;
    }

    // Helper Methods

    private PatientPortalUser getUserById(Long userId) {
        return userRepository.findById(userId)
            .orElseThrow(() -> new ValidationException("User not found: " + userId));
    }

    private void validateUserRegistration(PatientPortalUser user, String password) {
        if (user.getFirstName() == null || user.getFirstName().trim().isEmpty()) {
            throw new ValidationException("First name is required");
        }
        if (user.getLastName() == null || user.getLastName().trim().isEmpty()) {
            throw new ValidationException("Last name is required");
        }
        if (user.getEmail() == null || !EMAIL_PATTERN.matcher(user.getEmail()).matches()) {
            throw new ValidationException("Valid email is required");
        }
        validatePassword(password);
    }

    private void validatePassword(String password) {
        if (password == null || password.length() < PASSWORD_MIN_LENGTH) {
            throw new ValidationException("Password must be at least " + PASSWORD_MIN_LENGTH + " characters");
        }
        if (!PASSWORD_PATTERN.matcher(password).matches()) {
            throw new ValidationException("Password must contain uppercase, lowercase, number, and special character");
        }
    }

    private void validateAppointmentRequest(AppointmentRequest request) {
        if (request.getAppointmentType() == null) {
            throw new ValidationException("Appointment type is required");
        }
        if (request.getReasonForVisit() == null || request.getReasonForVisit().trim().isEmpty()) {
            throw new ValidationException("Reason for visit is required");
        }
        if (request.getRequestedDate() == null || request.getRequestedDate().isBefore(LocalDateTime.now())) {
            throw new ValidationException("Valid future date is required");
        }
    }

    private void validateMessage(PortalMessage message) {
        if (message.getSubject() == null || message.getSubject().trim().isEmpty()) {
            throw new ValidationException("Message subject is required");
        }
        if (message.getMessageBody() == null || message.getMessageBody().trim().isEmpty()) {
            throw new ValidationException("Message body is required");
        }
        if (message.getRecipientId() == null) {
            throw new ValidationException("Message recipient is required");
        }
    }

    private void validateFamilyMember(FamilyMember familyMember) {
        if (familyMember.getFirstName() == null || familyMember.getFirstName().trim().isEmpty()) {
            throw new ValidationException("Family member first name is required");
        }
        if (familyMember.getLastName() == null || familyMember.getLastName().trim().isEmpty()) {
            throw new ValidationException("Family member last name is required");
        }
        if (familyMember.getRelationship() == null) {
            throw new ValidationException("Relationship is required");
        }
        if (familyMember.getAccessLevel() == null) {
            throw new ValidationException("Access level is required");
        }
    }

    private void handleFailedLogin(PatientPortalUser user, String ipAddress) {
        user.setFailedLoginAttempts(user.getFailedLoginAttempts() + 1);
        
        if (user.getFailedLoginAttempts() >= MAX_FAILED_LOGIN_ATTEMPTS) {
            user.setAccountLocked(true);
            user.setLockedUntil(LocalDateTime.now().plusHours(ACCOUNT_LOCKOUT_DURATION_HOURS));
            emailService.sendAccountLockedNotification(user.getEmail());
        }
        
        userRepository.save(user);
    }

    private PatientPortalUser.PortalPreferences createDefaultPreferences() {
        PatientPortalUser.PortalPreferences prefs = new PatientPortalUser.PortalPreferences();
        prefs.setEmailNotifications(true);
        prefs.setSmsNotifications(false);
        prefs.setAppointmentReminders(true);
        prefs.setTestResultNotifications(true);
        prefs.setBillingNotifications(true);
        prefs.setLanguagePreference("en");
        prefs.setTimezone("America/New_York");
        prefs.setDataSharingConsent(false);
        prefs.setMarketingConsent(false);
        return prefs;
    }

    private void setDefaultFamilyMemberAccess(FamilyMember familyMember) {
        switch (familyMember.getRelationship()) {
            case SPOUSE:
                familyMember.setCanViewMedicalRecords(true);
                familyMember.setCanScheduleAppointments(true);
                familyMember.setCanAccessBilling(true);
                familyMember.setCanCommunicateProviders(true);
                break;
            case PARENT:
            case GUARDIAN:
                familyMember.setCanViewMedicalRecords(true);
                familyMember.setCanScheduleAppointments(true);
                familyMember.setCanAccessBilling(true);
                familyMember.setCanCommunicateProviders(true);
                break;
            case CHILD:
                if (familyMember.isMinor()) {
                    familyMember.setCanViewMedicalRecords(false);
                    familyMember.setCanScheduleAppointments(false);
                }
                break;
            default:
                familyMember.setCanViewMedicalRecords(false);
                familyMember.setCanScheduleAppointments(false);
                familyMember.setCanAccessBilling(false);
                familyMember.setCanCommunicateProviders(false);
        }
    }

    private boolean containsUrgentKeywords(String text) {
        if (text == null) return false;
        String lowerText = text.toLowerCase();
        return lowerText.contains("urgent") || lowerText.contains("emergency") || 
               lowerText.contains("severe") || lowerText.contains("critical") ||
               lowerText.contains("chest pain") || lowerText.contains("difficulty breathing");
    }

    private String generateSecureToken() {
        byte[] tokenBytes = new byte[32];
        secureRandom.nextBytes(tokenBytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(tokenBytes);
    }

    private String generateMessageThreadId() {
        return "MSG_" + System.currentTimeMillis() + "_" + 
               secureRandom.nextInt(1000);
    }

    // Service cleanup and maintenance methods
    
    @Transactional
    public void cleanupExpiredTokens() {
        LocalDateTime now = LocalDateTime.now();
        List<PatientPortalUser> usersWithExpiredTokens = userRepository.findUnverifiedUsersOlderThan(
            now.minusHours(ACTIVATION_TOKEN_EXPIRY_HOURS));
        
        for (PatientPortalUser user : usersWithExpiredTokens) {
            user.setActivationToken(null);
            user.setActivationTokenExpiresAt(null);
            user.setPasswordResetToken(null);
            user.setPasswordResetTokenExpiresAt(null);
        }
        
        userRepository.saveAll(usersWithExpiredTokens);
        logger.info("Cleaned up expired tokens for {} users", usersWithExpiredTokens.size());
    }

    @Transactional
    public void unlockExpiredAccounts() {
        List<PatientPortalUser> lockedUsers = userRepository.findAccountsToUnlock(LocalDateTime.now());
        
        for (PatientPortalUser user : lockedUsers) {
            user.setAccountLocked(false);
            user.setLockedUntil(null);
            user.setFailedLoginAttempts(0);
        }
        
        userRepository.saveAll(lockedUsers);
        logger.info("Unlocked {} expired accounts", lockedUsers.size());
    }
}