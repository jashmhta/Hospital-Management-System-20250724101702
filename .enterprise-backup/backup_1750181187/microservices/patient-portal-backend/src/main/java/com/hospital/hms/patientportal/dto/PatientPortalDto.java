package com.hospital.hms.patientportal.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * Patient Portal Data Transfer Objects
 * 
 * Comprehensive DTOs for patient portal operations including registration,
 * authentication, health records, appointments, and communication.
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
public class PatientPortalDto {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonInclude(JsonInclude.Include.NON_NULL)
    @Schema(description = "Patient registration request")
    public static class PatientRegistrationDto {
        
        @NotBlank(message = "First name is required")
        @Size(min = 2, max = 50, message = "First name must be between 2 and 50 characters")
        @Schema(description = "Patient's first name", example = "John")
        private String firstName;

        @NotBlank(message = "Last name is required")
        @Size(min = 2, max = 50, message = "Last name must be between 2 and 50 characters")
        @Schema(description = "Patient's last name", example = "Doe")
        private String lastName;

        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        @Schema(description = "Patient's email address", example = "john.doe@email.com")
        private String email;

        @NotBlank(message = "Phone number is required")
        @Pattern(regexp = "^\\+?[1-9]\\d{1,14}$", message = "Invalid phone number format")
        @Schema(description = "Patient's phone number", example = "+1234567890")
        private String phoneNumber;

        @NotNull(message = "Date of birth is required")
        @Past(message = "Date of birth must be in the past")
        @JsonFormat(pattern = "yyyy-MM-dd")
        @Schema(description = "Patient's date of birth", example = "1990-01-15")
        private LocalDate dateOfBirth;

        @NotBlank(message = "Gender is required")
        @Pattern(regexp = "^(MALE|FEMALE|OTHER|PREFER_NOT_TO_SAY)$", message = "Invalid gender value")
        @Schema(description = "Patient's gender", example = "MALE")
        private String gender;

        @NotBlank(message = "Address is required")
        @Size(max = 200, message = "Address cannot exceed 200 characters")
        @Schema(description = "Patient's address")
        private String address;

        @NotBlank(message = "City is required")
        @Size(max = 50, message = "City cannot exceed 50 characters")
        @Schema(description = "Patient's city")
        private String city;

        @NotBlank(message = "State is required")
        @Size(max = 50, message = "State cannot exceed 50 characters")
        @Schema(description = "Patient's state")
        private String state;

        @NotBlank(message = "Postal code is required")
        @Pattern(regexp = "^\\d{5}(-\\d{4})?$", message = "Invalid postal code format")
        @Schema(description = "Patient's postal code", example = "12345")
        private String postalCode;

        @NotBlank(message = "Country is required")
        @Size(max = 50, message = "Country cannot exceed 50 characters")
        @Schema(description = "Patient's country", example = "United States")
        private String country;

        @Size(max = 20, message = "SSN cannot exceed 20 characters")
        @Pattern(regexp = "^\\d{3}-\\d{2}-\\d{4}$", message = "Invalid SSN format")
        @Schema(description = "Patient's SSN", example = "123-45-6789")
        private String ssn;

        @Size(max = 20, message = "Insurance number cannot exceed 20 characters")
        @Schema(description = "Patient's insurance number")
        private String insuranceNumber;

        @Schema(description = "Emergency contact information")
        private EmergencyContactDto emergencyContact;

        @Schema(description = "Medical history summary")
        private String medicalHistory;

        @Schema(description = "Current medications")
        private List<String> currentMedications;

        @Schema(description = "Known allergies")
        private List<String> allergies;

        @Schema(description = "Preferred language", example = "English")
        private String preferredLanguage;

        @Schema(description = "Communication preferences")
        private Map<String, Boolean> communicationPreferences;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonInclude(JsonInclude.Include.NON_NULL)
    @Schema(description = "Patient login request")
    public static class PatientLoginDto {
        
        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        @Schema(description = "Patient's email", example = "john.doe@email.com")
        private String email;

        @NotBlank(message = "Password is required")
        @Size(min = 8, message = "Password must be at least 8 characters")
        @Schema(description = "Patient's password")
        private String password;

        @Schema(description = "Remember me flag")
        private Boolean rememberMe = false;

        @Schema(description = "Two-factor authentication code")
        private String twoFactorCode;

        @Schema(description = "Device fingerprint for security")
        private String deviceFingerprint;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonInclude(JsonInclude.Include.NON_NULL)
    @Schema(description = "Patient authentication response")
    public static class PatientAuthResponseDto {
        
        @Schema(description = "JWT access token")
        private String accessToken;

        @Schema(description = "JWT refresh token")
        private String refreshToken;

        @Schema(description = "Token expiration time")
        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
        private LocalDateTime expiresAt;

        @Schema(description = "Patient profile summary")
        private PatientProfileDto patient;

        @Schema(description = "User permissions")
        private List<String> permissions;

        @Schema(description = "Authentication method used")
        private String authMethod;

        @Schema(description = "Session ID")
        private String sessionId;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonInclude(JsonInclude.Include.NON_NULL)
    @Schema(description = "Patient profile information")
    public static class PatientProfileDto {
        
        @Schema(description = "Patient ID")
        private Long patientId;

        @Schema(description = "Patient's full name")
        private String fullName;

        @Schema(description = "Patient's email")
        private String email;

        @Schema(description = "Patient's phone number")
        private String phoneNumber;

        @Schema(description = "Patient's date of birth")
        @JsonFormat(pattern = "yyyy-MM-dd")
        private LocalDate dateOfBirth;

        @Schema(description = "Patient's gender")
        private String gender;

        @Schema(description = "Patient's address")
        private AddressDto address;

        @Schema(description = "Profile picture URL")
        private String profilePictureUrl;

        @Schema(description = "Account status")
        private String accountStatus;

        @Schema(description = "Verification status")
        private Boolean isVerified;

        @Schema(description = "Last login time")
        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
        private LocalDateTime lastLogin;

        @Schema(description = "Created at timestamp")
        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
        private LocalDateTime createdAt;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonInclude(JsonInclude.Include.NON_NULL)
    @Schema(description = "Address information")
    public static class AddressDto {
        
        @Schema(description = "Street address")
        private String street;

        @Schema(description = "City")
        private String city;

        @Schema(description = "State")
        private String state;

        @Schema(description = "Postal code")
        private String postalCode;

        @Schema(description = "Country")
        private String country;

        @Schema(description = "Address type", example = "HOME")
        private String addressType;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonInclude(JsonInclude.Include.NON_NULL)
    @Schema(description = "Emergency contact information")
    public static class EmergencyContactDto {
        
        @NotBlank(message = "Emergency contact name is required")
        @Schema(description = "Emergency contact's full name")
        private String fullName;

        @NotBlank(message = "Emergency contact phone is required")
        @Pattern(regexp = "^\\+?[1-9]\\d{1,14}$", message = "Invalid phone number format")
        @Schema(description = "Emergency contact's phone number")
        private String phoneNumber;

        @Email(message = "Invalid email format")
        @Schema(description = "Emergency contact's email")
        private String email;

        @NotBlank(message = "Relationship is required")
        @Schema(description = "Relationship to patient", example = "Spouse")
        private String relationship;

        @Schema(description = "Emergency contact's address")
        private AddressDto address;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonInclude(JsonInclude.Include.NON_NULL)
    @Schema(description = "Appointment request")
    public static class AppointmentRequestDto {
        
        @NotNull(message = "Provider ID is required")
        @Schema(description = "Healthcare provider ID")
        private Long providerId;

        @NotNull(message = "Appointment date is required")
        @Future(message = "Appointment date must be in the future")
        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
        @Schema(description = "Requested appointment date and time")
        private LocalDateTime appointmentDateTime;

        @NotBlank(message = "Appointment type is required")
        @Schema(description = "Type of appointment", example = "CONSULTATION")
        private String appointmentType;

        @Size(max = 500, message = "Reason cannot exceed 500 characters")
        @Schema(description = "Reason for appointment")
        private String reason;

        @Schema(description = "Special instructions or notes")
        private String notes;

        @Schema(description = "Preferred communication method")
        private String preferredCommunication;

        @Schema(description = "Insurance information")
        private InsuranceDto insurance;

        @Schema(description = "Symptoms or concerns")
        private List<String> symptoms;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonInclude(JsonInclude.Include.NON_NULL)
    @Schema(description = "Insurance information")
    public static class InsuranceDto {
        
        @Schema(description = "Insurance provider name")
        private String providerName;

        @Schema(description = "Policy number")
        private String policyNumber;

        @Schema(description = "Group number")
        private String groupNumber;

        @Schema(description = "Subscriber ID")
        private String subscriberId;

        @Schema(description = "Plan type")
        private String planType;

        @Schema(description = "Coverage details")
        private Map<String, Object> coverageDetails;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonInclude(JsonInclude.Include.NON_NULL)
    @Schema(description = "Health record summary")
    public static class HealthRecordDto {
        
        @Schema(description = "Record ID")
        private Long recordId;

        @Schema(description = "Record type", example = "LAB_RESULT")
        private String recordType;

        @Schema(description = "Record title")
        private String title;

        @Schema(description = "Record description")
        private String description;

        @Schema(description = "Record date")
        @JsonFormat(pattern = "yyyy-MM-dd")
        private LocalDate recordDate;

        @Schema(description = "Healthcare provider")
        private String provider;

        @Schema(description = "Record status")
        private String status;

        @Schema(description = "Document attachments")
        private List<DocumentDto> attachments;

        @Schema(description = "Lab values or measurements")
        private Map<String, Object> values;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonInclude(JsonInclude.Include.NON_NULL)
    @Schema(description = "Document attachment")
    public static class DocumentDto {
        
        @Schema(description = "Document ID")
        private Long documentId;

        @Schema(description = "Document name")
        private String fileName;

        @Schema(description = "Document type")
        private String fileType;

        @Schema(description = "File size in bytes")
        private Long fileSize;

        @Schema(description = "Download URL")
        private String downloadUrl;

        @Schema(description = "Upload date")
        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
        private LocalDateTime uploadedAt;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonInclude(JsonInclude.Include.NON_NULL)
    @Schema(description = "Secure message")
    public static class MessageDto {
        
        @Schema(description = "Message ID")
        private Long messageId;

        @Schema(description = "Message subject")
        private String subject;

        @Schema(description = "Message content")
        private String content;

        @Schema(description = "Sender information")
        private ContactDto sender;

        @Schema(description = "Recipient information")
        private ContactDto recipient;

        @Schema(description = "Message thread ID")
        private Long threadId;

        @Schema(description = "Message priority")
        private String priority;

        @Schema(description = "Message status")
        private String status;

        @Schema(description = "Sent timestamp")
        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
        private LocalDateTime sentAt;

        @Schema(description = "Read timestamp")
        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
        private LocalDateTime readAt;

        @Schema(description = "Message attachments")
        private List<DocumentDto> attachments;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonInclude(JsonInclude.Include.NON_NULL)
    @Schema(description = "Contact information")
    public static class ContactDto {
        
        @Schema(description = "Contact ID")
        private Long contactId;

        @Schema(description = "Contact name")
        private String name;

        @Schema(description = "Contact type", example = "PROVIDER")
        private String contactType;

        @Schema(description = "Contact email")
        private String email;

        @Schema(description = "Contact phone")
        private String phone;

        @Schema(description = "Department or specialty")
        private String department;
    }
}
