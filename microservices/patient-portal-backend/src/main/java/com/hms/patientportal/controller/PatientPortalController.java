package com.hms.patientportal.controller;

import com.hms.patientportal.service.PatientPortalService;
import com.hms.patientportal.entity.PatientPortalUser;
import com.hms.patientportal.entity.AppointmentRequest;
import com.hms.patientportal.entity.PortalMessage;
import com.hms.patientportal.entity.FamilyMember;
import com.hms.patientportal.dto.*;
import com.hms.patientportal.exception.PatientPortalException;
import com.hms.patientportal.exception.ValidationException;
import com.hms.patientportal.exception.AuthenticationException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.Map;

/**
 * Patient Portal REST Controller
 * 
 * Comprehensive RESTful API for patient portal operations including user management,
 * authentication, appointment requests, secure messaging, family member management,
 * and healthcare data access with full security and validation.
 */
@RestController
@RequestMapping("/api/v1/patient-portal")
@Validated
@CrossOrigin(origins = {"https://portal.hospital.com", "https://app.hospital.com"}, 
             allowedHeaders = "*", 
             methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class PatientPortalController {

    private static final Logger logger = LoggerFactory.getLogger(PatientPortalController.class);

    @Autowired
    private PatientPortalService portalService;

    // ==================== AUTHENTICATION ENDPOINTS ====================

    /**
     * Register new patient portal user
     */
    @PostMapping("/auth/register")
    public ResponseEntity<ApiResponse<PatientPortalUserDTO>> registerUser(
            @Valid @RequestBody PatientRegistrationRequest request,
            HttpServletRequest httpRequest) {
        
        logger.info("User registration request received for email: {}", request.getEmail());
        
        try {
            PatientPortalUser user = mapToEntity(request);
            PatientPortalUser registeredUser = portalService.registerUser(user, request.getPassword());
            
            PatientPortalUserDTO userDTO = mapToDTO(registeredUser);
            
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, "User registered successfully. Please check your email for activation.", userDTO));
                
        } catch (ValidationException e) {
            logger.warn("Registration validation failed: {}", e.getMessage());
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>(false, e.getMessage(), null));
        } catch (Exception e) {
            logger.error("Registration failed: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse<>(false, "Registration failed. Please try again.", null));
        }
    }

    /**
     * Authenticate user login
     */
    @PostMapping("/auth/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletRequest httpRequest) {
        
        logger.info("Login attempt for user: {}", request.getEmailOrUsername());
        
        try {
            String clientIp = getClientIpAddress(httpRequest);
            PatientPortalUser user = portalService.authenticateUser(
                request.getEmailOrUsername(), 
                request.getPassword(), 
                clientIp
            );
            
            // Generate JWT token and create response
            LoginResponse response = new LoginResponse();
            response.setUser(mapToDTO(user));
            response.setToken(generateJwtToken(user));
            response.setExpiresIn(3600); // 1 hour
            response.setTokenType("Bearer");
            
            return ResponseEntity.ok(new ApiResponse<>(true, "Login successful", response));
            
        } catch (AuthenticationException e) {
            logger.warn("Login failed for user {}: {}", request.getEmailOrUsername(), e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new ApiResponse<>(false, e.getMessage(), null));
        } catch (Exception e) {
            logger.error("Login error: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse<>(false, "Login failed. Please try again.", null));
        }
    }

    /**
     * Activate user account
     */
    @PostMapping("/auth/activate")
    public ResponseEntity<ApiResponse<String>> activateAccount(
            @Valid @RequestBody ActivationRequest request) {
        
        logger.info("Account activation request received");
        
        try {
            portalService.activateAccount(request.getActivationToken());
            return ResponseEntity.ok(new ApiResponse<>(true, "Account activated successfully", null));
            
        } catch (ValidationException e) {
            logger.warn("Account activation failed: {}", e.getMessage());
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>(false, e.getMessage(), null));
        } catch (Exception e) {
            logger.error("Account activation error: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse<>(false, "Activation failed. Please try again.", null));
        }
    }

    /**
     * Request password reset
     */
    @PostMapping("/auth/forgot-password")
    public ResponseEntity<ApiResponse<String>> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest request) {
        
        logger.info("Password reset requested for email: {}", request.getEmail());
        
        try {
            portalService.requestPasswordReset(request.getEmail());
            return ResponseEntity.ok(new ApiResponse<>(true, "Password reset instructions sent to your email", null));
            
        } catch (Exception e) {
            logger.error("Password reset request error: {}", e.getMessage(), e);
            // Don't reveal whether email exists for security
            return ResponseEntity.ok(new ApiResponse<>(true, "Password reset instructions sent if email exists", null));
        }
    }

    /**
     * Reset password with token
     */
    @PostMapping("/auth/reset-password")
    public ResponseEntity<ApiResponse<String>> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request) {
        
        logger.info("Password reset with token received");
        
        try {
            portalService.resetPassword(request.getResetToken(), request.getNewPassword());
            return ResponseEntity.ok(new ApiResponse<>(true, "Password reset successful", null));
            
        } catch (ValidationException e) {
            logger.warn("Password reset failed: {}", e.getMessage());
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>(false, e.getMessage(), null));
        } catch (Exception e) {
            logger.error("Password reset error: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse<>(false, "Password reset failed. Please try again.", null));
        }
    }

    // ==================== USER PROFILE ENDPOINTS ====================

    /**
     * Get user profile
     */
    @GetMapping("/profile")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<ApiResponse<PatientPortalUserDTO>> getProfile() {
        
        try {
            Long userId = getCurrentUserId();
            PatientPortalUser user = portalService.getUserById(userId);
            PatientPortalUserDTO userDTO = mapToDTO(user);
            
            return ResponseEntity.ok(new ApiResponse<>(true, "Profile retrieved successfully", userDTO));
            
        } catch (Exception e) {
            logger.error("Error retrieving profile: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse<>(false, "Failed to retrieve profile", null));
        }
    }

    /**
     * Update user profile
     */
    @PutMapping("/profile")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<ApiResponse<PatientPortalUserDTO>> updateProfile(
            @Valid @RequestBody ProfileUpdateRequest request) {
        
        try {
            Long userId = getCurrentUserId();
            PatientPortalUser updatedInfo = mapToEntity(request);
            PatientPortalUser updatedUser = portalService.updateProfile(userId, updatedInfo);
            PatientPortalUserDTO userDTO = mapToDTO(updatedUser);
            
            return ResponseEntity.ok(new ApiResponse<>(true, "Profile updated successfully", userDTO));
            
        } catch (ValidationException e) {
            logger.warn("Profile update validation failed: {}", e.getMessage());
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>(false, e.getMessage(), null));
        } catch (Exception e) {
            logger.error("Profile update error: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse<>(false, "Profile update failed", null));
        }
    }

    /**
     * Get user dashboard data
     */
    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboard() {
        
        try {
            Long userId = getCurrentUserId();
            Map<String, Object> dashboardData = portalService.getUserDashboard(userId);
            
            return ResponseEntity.ok(new ApiResponse<>(true, "Dashboard data retrieved successfully", dashboardData));
            
        } catch (Exception e) {
            logger.error("Error retrieving dashboard: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse<>(false, "Failed to retrieve dashboard data", null));
        }
    }

    // ==================== APPOINTMENT REQUEST ENDPOINTS ====================

    /**
     * Submit appointment request
     */
    @PostMapping("/appointments/request")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<ApiResponse<AppointmentRequestDTO>> submitAppointmentRequest(
            @Valid @RequestBody AppointmentRequestSubmission request) {
        
        try {
            Long userId = getCurrentUserId();
            AppointmentRequest appointmentRequest = mapToEntity(request);
            AppointmentRequest submittedRequest = portalService.submitAppointmentRequest(userId, appointmentRequest);
            AppointmentRequestDTO requestDTO = mapToDTO(submittedRequest);
            
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, "Appointment request submitted successfully", requestDTO));
                
        } catch (ValidationException e) {
            logger.warn("Appointment request validation failed: {}", e.getMessage());
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>(false, e.getMessage(), null));
        } catch (Exception e) {
            logger.error("Appointment request error: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse<>(false, "Failed to submit appointment request", null));
        }
    }

    /**
     * Get user appointment requests
     */
    @GetMapping("/appointments/requests")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<ApiResponse<List<AppointmentRequestDTO>>> getAppointmentRequests(
            @RequestParam(defaultValue = "ALL") String status) {
        
        try {
            Long userId = getCurrentUserId();
            List<AppointmentRequest> requests = portalService.getUserAppointmentRequests(userId, status);
            List<AppointmentRequestDTO> requestDTOs = mapToDTO(requests);
            
            return ResponseEntity.ok(new ApiResponse<>(true, "Appointment requests retrieved successfully", requestDTOs));
            
        } catch (Exception e) {
            logger.error("Error retrieving appointment requests: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse<>(false, "Failed to retrieve appointment requests", null));
        }
    }

    /**
     * Cancel appointment request
     */
    @DeleteMapping("/appointments/requests/{requestId}")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<ApiResponse<String>> cancelAppointmentRequest(
            @PathVariable @NotNull Long requestId) {
        
        try {
            Long userId = getCurrentUserId();
            portalService.cancelAppointmentRequest(userId, requestId);
            
            return ResponseEntity.ok(new ApiResponse<>(true, "Appointment request cancelled successfully", null));
            
        } catch (ValidationException e) {
            logger.warn("Appointment cancellation failed: {}", e.getMessage());
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>(false, e.getMessage(), null));
        } catch (Exception e) {
            logger.error("Appointment cancellation error: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse<>(false, "Failed to cancel appointment request", null));
        }
    }

    // ==================== MESSAGING ENDPOINTS ====================

    /**
     * Send secure message
     */
    @PostMapping("/messages")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<ApiResponse<PortalMessageDTO>> sendMessage(
            @Valid @RequestBody MessageSubmission request) {
        
        try {
            Long userId = getCurrentUserId();
            PortalMessage message = mapToEntity(request);
            PortalMessage sentMessage = portalService.sendMessage(userId, message);
            PortalMessageDTO messageDTO = mapToDTO(sentMessage);
            
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, "Message sent successfully", messageDTO));
                
        } catch (ValidationException e) {
            logger.warn("Message validation failed: {}", e.getMessage());
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>(false, e.getMessage(), null));
        } catch (Exception e) {
            logger.error("Message sending error: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse<>(false, "Failed to send message", null));
        }
    }

    /**
     * Get user messages
     */
    @GetMapping("/messages")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<ApiResponse<Page<PortalMessageDTO>>> getMessages(
            @RequestParam(defaultValue = "false") boolean includeArchived,
            Pageable pageable) {
        
        try {
            Long userId = getCurrentUserId();
            Page<PortalMessage> messages = portalService.getUserMessages(userId, includeArchived, pageable);
            Page<PortalMessageDTO> messageDTOs = messages.map(this::mapToDTO);
            
            return ResponseEntity.ok(new ApiResponse<>(true, "Messages retrieved successfully", messageDTOs));
            
        } catch (Exception e) {
            logger.error("Error retrieving messages: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse<>(false, "Failed to retrieve messages", null));
        }
    }

    /**
     * Mark message as read
     */
    @PutMapping("/messages/{messageId}/read")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<ApiResponse<String>> markMessageAsRead(
            @PathVariable @NotNull Long messageId) {
        
        try {
            Long userId = getCurrentUserId();
            portalService.markMessageAsRead(userId, messageId);
            
            return ResponseEntity.ok(new ApiResponse<>(true, "Message marked as read", null));
            
        } catch (Exception e) {
            logger.error("Error marking message as read: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse<>(false, "Failed to mark message as read", null));
        }
    }

    /**
     * Archive message
     */
    @PutMapping("/messages/{messageId}/archive")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<ApiResponse<String>> archiveMessage(
            @PathVariable @NotNull Long messageId) {
        
        try {
            Long userId = getCurrentUserId();
            portalService.archiveMessage(userId, messageId);
            
            return ResponseEntity.ok(new ApiResponse<>(true, "Message archived successfully", null));
            
        } catch (Exception e) {
            logger.error("Error archiving message: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse<>(false, "Failed to archive message", null));
        }
    }

    // ==================== FAMILY MEMBER ENDPOINTS ====================

    /**
     * Add family member
     */
    @PostMapping("/family-members")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<ApiResponse<FamilyMemberDTO>> addFamilyMember(
            @Valid @RequestBody FamilyMemberRequest request) {
        
        try {
            Long userId = getCurrentUserId();
            FamilyMember familyMember = mapToEntity(request);
            FamilyMember addedMember = portalService.addFamilyMember(userId, familyMember);
            FamilyMemberDTO memberDTO = mapToDTO(addedMember);
            
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, "Family member added successfully", memberDTO));
                
        } catch (ValidationException e) {
            logger.warn("Family member validation failed: {}", e.getMessage());
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>(false, e.getMessage(), null));
        } catch (Exception e) {
            logger.error("Family member addition error: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse<>(false, "Failed to add family member", null));
        }
    }

    /**
     * Get family members
     */
    @GetMapping("/family-members")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<ApiResponse<List<FamilyMemberDTO>>> getFamilyMembers() {
        
        try {
            Long userId = getCurrentUserId();
            List<FamilyMember> familyMembers = portalService.getFamilyMembers(userId);
            List<FamilyMemberDTO> memberDTOs = familyMembers.stream()
                .map(this::mapToDTO)
                .toList();
            
            return ResponseEntity.ok(new ApiResponse<>(true, "Family members retrieved successfully", memberDTOs));
            
        } catch (Exception e) {
            logger.error("Error retrieving family members: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse<>(false, "Failed to retrieve family members", null));
        }
    }

    /**
     * Update family member
     */
    @PutMapping("/family-members/{memberId}")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<ApiResponse<FamilyMemberDTO>> updateFamilyMember(
            @PathVariable @NotNull Long memberId,
            @Valid @RequestBody FamilyMemberUpdateRequest request) {
        
        try {
            Long userId = getCurrentUserId();
            FamilyMember updatedInfo = mapToEntity(request);
            FamilyMember updatedMember = portalService.updateFamilyMember(userId, memberId, updatedInfo);
            FamilyMemberDTO memberDTO = mapToDTO(updatedMember);
            
            return ResponseEntity.ok(new ApiResponse<>(true, "Family member updated successfully", memberDTO));
            
        } catch (ValidationException e) {
            logger.warn("Family member update validation failed: {}", e.getMessage());
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>(false, e.getMessage(), null));
        } catch (Exception e) {
            logger.error("Family member update error: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse<>(false, "Failed to update family member", null));
        }
    }

    /**
     * Remove family member
     */
    @DeleteMapping("/family-members/{memberId}")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<ApiResponse<String>> removeFamilyMember(
            @PathVariable @NotNull Long memberId) {
        
        try {
            Long userId = getCurrentUserId();
            portalService.removeFamilyMember(userId, memberId);
            
            return ResponseEntity.ok(new ApiResponse<>(true, "Family member removed successfully", null));
            
        } catch (Exception e) {
            logger.error("Error removing family member: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse<>(false, "Failed to remove family member", null));
        }
    }

    // ==================== MEDICAL RECORDS ENDPOINTS ====================

    /**
     * Get medical records
     */
    @GetMapping("/medical-records")
    @PreAuthorize("hasRole('PATIENT') or hasRole('FAMILY_MEMBER')")
    public ResponseEntity<ApiResponse<List<Object>>> getMedicalRecords(
            @RequestParam(defaultValue = "PATIENT") String accessLevel) {
        
        try {
            Long userId = getCurrentUserId();
            List<Object> records = portalService.getMedicalRecords(userId, accessLevel);
            
            return ResponseEntity.ok(new ApiResponse<>(true, "Medical records retrieved successfully", records));
            
        } catch (Exception e) {
            logger.error("Error retrieving medical records: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse<>(false, "Failed to retrieve medical records", null));
        }
    }

    // ==================== ADMIN ENDPOINTS ====================

    /**
     * Search users (admin only)
     */
    @GetMapping("/admin/users/search")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Page<PatientPortalUserDTO>>> searchUsers(
            @RequestParam String searchTerm,
            Pageable pageable) {
        
        try {
            Page<PatientPortalUser> users = portalService.searchUsers(searchTerm, pageable);
            Page<PatientPortalUserDTO> userDTOs = users.map(this::mapToDTO);
            
            return ResponseEntity.ok(new ApiResponse<>(true, "Users retrieved successfully", userDTOs));
            
        } catch (Exception e) {
            logger.error("Error searching users: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse<>(false, "Failed to search users", null));
        }
    }

    /**
     * Get user analytics (admin only)
     */
    @GetMapping("/admin/analytics")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getUserAnalytics() {
        
        try {
            Map<String, Object> analytics = portalService.getUserAnalytics();
            
            return ResponseEntity.ok(new ApiResponse<>(true, "Analytics retrieved successfully", analytics));
            
        } catch (Exception e) {
            logger.error("Error retrieving analytics: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse<>(false, "Failed to retrieve analytics", null));
        }
    }

    // ==================== HEALTH CHECK ENDPOINT ====================

    /**
     * Health check endpoint
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> health = Map.of(
            "status", "UP",
            "service", "patient-portal-backend",
            "timestamp", System.currentTimeMillis(),
            "version", "1.0.0"
        );
        return ResponseEntity.ok(health);
    }

    // ==================== HELPER METHODS ====================

    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        
        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty()) {
            return xRealIp;
        }
        
        return request.getRemoteAddr();
    }

    private Long getCurrentUserId() {
        // In a real implementation, this would extract user ID from JWT token
        // For now, returning a placeholder
        return 1L; // TODO: Implement JWT token extraction
    }

    private String generateJwtToken(PatientPortalUser user) {
        // TODO: Implement JWT token generation
        return "jwt-token-placeholder";
    }

    // Mapping methods (simplified - in real implementation, use MapStruct)
    private PatientPortalUser mapToEntity(PatientRegistrationRequest request) {
        PatientPortalUser user = new PatientPortalUser();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setDateOfBirth(request.getDateOfBirth());
        return user;
    }

    private PatientPortalUserDTO mapToDTO(PatientPortalUser user) {
        PatientPortalUserDTO dto = new PatientPortalUserDTO();
        dto.setId(user.getId());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setEmail(user.getEmail());
        dto.setAccountStatus(user.getAccountStatus().toString());
        return dto;
    }

    private AppointmentRequest mapToEntity(AppointmentRequestSubmission request) {
        AppointmentRequest appointment = new AppointmentRequest();
        appointment.setRequestedProviderId(request.getProviderId());
        appointment.setRequestedDate(request.getRequestedDate());
        appointment.setAppointmentType(request.getAppointmentType());
        appointment.setReasonForVisit(request.getReasonForVisit());
        return appointment;
    }

    private AppointmentRequestDTO mapToDTO(AppointmentRequest request) {
        AppointmentRequestDTO dto = new AppointmentRequestDTO();
        dto.setId(request.getId());
        dto.setRequestedDate(request.getRequestedDate());
        dto.setStatus(request.getStatus().toString());
        dto.setReasonForVisit(request.getReasonForVisit());
        return dto;
    }

    private PortalMessage mapToEntity(MessageSubmission request) {
        PortalMessage message = new PortalMessage();
        message.setRecipientId(request.getRecipientId());
        message.setSubject(request.getSubject());
        message.setMessageBody(request.getMessageBody());
        message.setMessageType(request.getMessageType());
        return message;
    }

    private PortalMessageDTO mapToDTO(PortalMessage message) {
        PortalMessageDTO dto = new PortalMessageDTO();
        dto.setId(message.getId());
        dto.setSubject(message.getSubject());
        dto.setMessageBody(message.getMessageBody());
        dto.setCreatedAt(message.getCreatedAt());
        dto.setReadAt(message.getReadAt());
        return dto;
    }

    private FamilyMember mapToEntity(FamilyMemberRequest request) {
        FamilyMember member = new FamilyMember();
        member.setFirstName(request.getFirstName());
        member.setLastName(request.getLastName());
        member.setRelationship(request.getRelationship());
        member.setAccessLevel(request.getAccessLevel());
        return member;
    }

    private FamilyMemberDTO mapToDTO(FamilyMember member) {
        FamilyMemberDTO dto = new FamilyMemberDTO();
        dto.setId(member.getId());
        dto.setFirstName(member.getFirstName());
        dto.setLastName(member.getLastName());
        dto.setRelationship(member.getRelationship().toString());
        dto.setAccessLevel(member.getAccessLevel().toString());
        return dto;
    }

    // Additional mapping methods would be implemented for other DTOs...
}
