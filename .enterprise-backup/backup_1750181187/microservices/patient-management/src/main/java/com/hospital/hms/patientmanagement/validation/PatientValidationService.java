package com.hospital.hms.patientmanagement.validation;

import com.hospital.hms.patientmanagement.dto.PatientCreateRequestDto;
import com.hospital.hms.patientmanagement.dto.PatientUpdateRequestDto;
import com.hospital.hms.patientmanagement.entity.Patient;
import com.hospital.hms.patientmanagement.exception.PatientValidationException;
import com.hospital.hms.patientmanagement.repository.PatientRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Period;
import java.util.*;
import java.util.regex.Pattern;

/**
 * Service for validating patient data against business rules
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Service
public class PatientValidationService {

    private static final Logger logger = LoggerFactory.getLogger(PatientValidationService.class);
    
    private static final Pattern EMAIL_PATTERN = Pattern.compile(
        "^[A-Za-z0-9+_.-]+@([A-Za-z0-9.-]+\\.[A-Za-z]{2,})$");
    
    private static final Pattern PHONE_PATTERN = Pattern.compile(
        "^[\\+]?[1-9][\\d\\s\\-\\(\\)]{7,15}$");
    
    private static final int MIN_AGE = 0;
    private static final int MAX_AGE = 150;
    private static final int MIN_ADULT_AGE = 18;
    
    private final PatientRepository patientRepository;

    @Autowired
    public PatientValidationService(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }

    /**
     * Validate patient creation request
     */
    public void validateCreateRequest(PatientCreateRequestDto request) {
        logger.debug("Validating patient creation request");
        
        Map<String, List<String>> errors = new HashMap<>();
        
        // Required field validations
        validateRequiredFields(request, errors);
        
        // Format validations
        validateFormats(request, errors);
        
        // Business rule validations
        validateBusinessRules(request, errors);
        
        // Uniqueness validations
        validateUniqueness(request, errors);
        
        if (!errors.isEmpty()) {
            throw new PatientValidationException("Patient creation validation failed", errors);
        }
    }

    /**
     * Validate patient update request
     */
    public void validateUpdateRequest(UUID patientId, PatientUpdateRequestDto request) {
        logger.debug("Validating patient update request for patient: {}", patientId);
        
        Map<String, List<String>> errors = new HashMap<>();
        
        // Format validations (only for non-null fields)
        validateUpdateFormats(request, errors);
        
        // Business rule validations
        validateUpdateBusinessRules(request, errors);
        
        // Uniqueness validations (excluding current patient)
        validateUpdateUniqueness(patientId, request, errors);
        
        if (!errors.isEmpty()) {
            throw new PatientValidationException("Patient update validation failed", errors);
        }
    }

    /**
     * Validate patient entity
     */
    public void validatePatientEntity(Patient patient, boolean isUpdate) {
        logger.debug("Validating patient entity: {}", patient.getId());
        
        Map<String, List<String>> errors = new HashMap<>();
        
        // Required field validations
        if (!StringUtils.hasText(patient.getFamilyName())) {
            addError(errors, "familyName", "Family name is required");
        }
        
        if (!StringUtils.hasText(patient.getGivenName())) {
            addError(errors, "givenName", "Given name is required");
        }
        
        // Age validations
        if (patient.getDateOfBirth() != null) {
            validateAge(patient.getDateOfBirth(), errors);
        }
        
        // Email validation
        if (StringUtils.hasText(patient.getEmail())) {
            validateEmailFormat(patient.getEmail(), errors);
            
            if (!isUpdate && patientRepository.existsByEmail(patient.getEmail())) {
                addError(errors, "email", "Email address already exists");
            }
        }
        
        // Phone validation
        if (StringUtils.hasText(patient.getPhonePrimary())) {
            validatePhoneFormat(patient.getPhonePrimary(), "phonePrimary", errors);
        }
        
        if (StringUtils.hasText(patient.getPhoneSecondary())) {
            validatePhoneFormat(patient.getPhoneSecondary(), "phoneSecondary", errors);
        }
        
        // Deceased validation
        validateDeceasedLogic(patient, errors);
        
        // Multiple birth validation
        validateMultipleBirthLogic(patient, errors);
        
        if (!errors.isEmpty()) {
            throw new PatientValidationException("Patient entity validation failed", errors);
        }
    }

    // Private validation methods
    
    private void validateRequiredFields(PatientCreateRequestDto request, Map<String, List<String>> errors) {
        if (!StringUtils.hasText(request.getFamilyName())) {
            addError(errors, "familyName", "Family name is required");
        }
        
        if (!StringUtils.hasText(request.getGivenName())) {
            addError(errors, "givenName", "Given name is required");
        }
    }

    private void validateFormats(PatientCreateRequestDto request, Map<String, List<String>> errors) {
        // Email format validation
        if (StringUtils.hasText(request.getEmail())) {
            validateEmailFormat(request.getEmail(), errors);
        }
        
        // Phone format validation
        if (StringUtils.hasText(request.getPhonePrimary())) {
            validatePhoneFormat(request.getPhonePrimary(), "phonePrimary", errors);
        }
        
        if (StringUtils.hasText(request.getPhoneSecondary())) {
            validatePhoneFormat(request.getPhoneSecondary(), "phoneSecondary", errors);
        }
        
        if (StringUtils.hasText(request.getEmergencyContactPhone())) {
            validatePhoneFormat(request.getEmergencyContactPhone(), "emergencyContactPhone", errors);
        }
    }

    private void validateUpdateFormats(PatientUpdateRequestDto request, Map<String, List<String>> errors) {
        // Only validate non-null fields for updates
        if (request.getEmail() != null) {
            validateEmailFormat(request.getEmail(), errors);
        }
        
        if (request.getPhonePrimary() != null) {
            validatePhoneFormat(request.getPhonePrimary(), "phonePrimary", errors);
        }
        
        if (request.getPhoneSecondary() != null) {
            validatePhoneFormat(request.getPhoneSecondary(), "phoneSecondary", errors);
        }
        
        if (request.getEmergencyContactPhone() != null) {
            validatePhoneFormat(request.getEmergencyContactPhone(), "emergencyContactPhone", errors);
        }
    }

    private void validateBusinessRules(PatientCreateRequestDto request, Map<String, List<String>> errors) {
        // Age validation
        if (request.getDateOfBirth() != null) {
            validateAge(request.getDateOfBirth(), errors);
        }
        
        // Multiple birth validation
        if (Boolean.TRUE.equals(request.getMultipleBirthBoolean()) && request.getMultipleBirthInteger() == null) {
            addError(errors, "multipleBirthInteger", "Birth order is required for multiple birth patients");
        }
        
        if (request.getMultipleBirthInteger() != null && request.getMultipleBirthInteger() < 1) {
            addError(errors, "multipleBirthInteger", "Birth order must be positive");
        }
        
        // Emergency contact validation
        validateEmergencyContact(request.getEmergencyContactName(), 
                               request.getEmergencyContactPhone(), 
                               request.getEmergencyContactRelationship(), errors);
    }

    private void validateUpdateBusinessRules(PatientUpdateRequestDto request, Map<String, List<String>> errors) {
        // Age validation
        if (request.getDateOfBirth() != null) {
            validateAge(request.getDateOfBirth(), errors);
        }
        
        // Deceased validation
        if (Boolean.TRUE.equals(request.getDeceased()) && request.getDeceasedDateTime() == null) {
            addError(errors, "deceasedDateTime", "Deceased date and time is required when patient is marked as deceased");
        }
        
        if (request.getDeceasedDateTime() != null && request.getDeceasedDateTime().isAfter(LocalDateTime.now())) {
            addError(errors, "deceasedDateTime", "Deceased date and time cannot be in the future");
        }
        
        // Multiple birth validation
        if (Boolean.TRUE.equals(request.getMultipleBirthBoolean()) && request.getMultipleBirthInteger() == null) {
            addError(errors, "multipleBirthInteger", "Birth order is required for multiple birth patients");
        }
        
        if (request.getMultipleBirthInteger() != null && request.getMultipleBirthInteger() < 1) {
            addError(errors, "multipleBirthInteger", "Birth order must be positive");
        }
    }

    private void validateUniqueness(PatientCreateRequestDto request, Map<String, List<String>> errors) {
        // Email uniqueness
        if (StringUtils.hasText(request.getEmail()) && patientRepository.existsByEmail(request.getEmail())) {
            addError(errors, "email", "Email address already exists");
        }
        
        // Identifier uniqueness
        if (StringUtils.hasText(request.getIdentifierValue()) && StringUtils.hasText(request.getIdentifierSystem())) {
            if (patientRepository.existsByIdentifierValueAndIdentifierSystem(
                    request.getIdentifierValue(), request.getIdentifierSystem())) {
                addError(errors, "identifier", "Patient identifier already exists");
            }
        }
    }

    private void validateUpdateUniqueness(UUID patientId, PatientUpdateRequestDto request, Map<String, List<String>> errors) {
        // For updates, we need to check uniqueness excluding the current patient
        // This requires custom repository methods or additional logic
        
        // Email uniqueness (simplified - in production, exclude current patient)
        if (StringUtils.hasText(request.getEmail()) && patientRepository.existsByEmail(request.getEmail())) {
            // TODO: Implement proper check excluding current patient
            // For now, just check existence
            Optional<Patient> existingPatient = patientRepository.findByEmail(request.getEmail());
            if (existingPatient.isPresent() && !existingPatient.get().getId().equals(patientId)) {
                addError(errors, "email", "Email address already exists");
            }
        }
    }

    private void validateAge(LocalDate dateOfBirth, Map<String, List<String>> errors) {
        if (dateOfBirth.isAfter(LocalDate.now())) {
            addError(errors, "dateOfBirth", "Date of birth cannot be in the future");
            return;
        }
        
        int age = Period.between(dateOfBirth, LocalDate.now()).getYears();
        
        if (age < MIN_AGE) {
            addError(errors, "dateOfBirth", "Invalid date of birth");
        }
        
        if (age > MAX_AGE) {
            addError(errors, "dateOfBirth", "Patient age cannot exceed " + MAX_AGE + " years");
        }
    }

    private void validateEmailFormat(String email, Map<String, List<String>> errors) {
        if (!EMAIL_PATTERN.matcher(email).matches()) {
            addError(errors, "email", "Invalid email format");
        }
    }

    private void validatePhoneFormat(String phone, String fieldName, Map<String, List<String>> errors) {
        if (!PHONE_PATTERN.matcher(phone).matches()) {
            addError(errors, fieldName, "Invalid phone number format");
        }
    }

    private void validateDeceasedLogic(Patient patient, Map<String, List<String>> errors) {
        if (Boolean.TRUE.equals(patient.getDeceased())) {
            if (patient.getDeceasedDateTime() == null) {
                addError(errors, "deceasedDateTime", "Deceased date and time is required when patient is marked as deceased");
            } else if (patient.getDeceasedDateTime().isAfter(LocalDateTime.now())) {
                addError(errors, "deceasedDateTime", "Deceased date and time cannot be in the future");
            }
            
            if (patient.getDateOfBirth() != null && patient.getDeceasedDateTime() != null) {
                if (patient.getDeceasedDateTime().toLocalDate().isBefore(patient.getDateOfBirth())) {
                    addError(errors, "deceasedDateTime", "Deceased date cannot be before date of birth");
                }
            }
        }
    }

    private void validateMultipleBirthLogic(Patient patient, Map<String, List<String>> errors) {
        if (Boolean.TRUE.equals(patient.getMultipleBirthBoolean()) && patient.getMultipleBirthInteger() == null) {
            addError(errors, "multipleBirthInteger", "Birth order is required for multiple birth patients");
        }
        
        if (patient.getMultipleBirthInteger() != null) {
            if (patient.getMultipleBirthInteger() < 1) {
                addError(errors, "multipleBirthInteger", "Birth order must be positive");
            }
            
            if (patient.getMultipleBirthInteger() > 10) {
                addError(errors, "multipleBirthInteger", "Birth order seems unusually high");
            }
        }
    }

    private void validateEmergencyContact(String name, String phone, String relationship, Map<String, List<String>> errors) {
        // If any emergency contact field is provided, validate the combination
        boolean hasName = StringUtils.hasText(name);
        boolean hasPhone = StringUtils.hasText(phone);
        boolean hasRelationship = StringUtils.hasText(relationship);
        
        if (hasName || hasPhone || hasRelationship) {
            if (!hasName) {
                addError(errors, "emergencyContactName", "Emergency contact name is required when emergency contact information is provided");
            }
            
            if (!hasPhone) {
                addError(errors, "emergencyContactPhone", "Emergency contact phone is required when emergency contact information is provided");
            }
            
            if (!hasRelationship) {
                addError(errors, "emergencyContactRelationship", "Emergency contact relationship is required when emergency contact information is provided");
            }
        }
    }

    private void addError(Map<String, List<String>> errors, String field, String message) {
        errors.computeIfAbsent(field, k -> new ArrayList<>()).add(message);
    }

    /**
     * Check if patient is minor
     */
    public boolean isMinor(LocalDate dateOfBirth) {
        if (dateOfBirth == null) {
            return false;
        }
        
        int age = Period.between(dateOfBirth, LocalDate.now()).getYears();
        return age < MIN_ADULT_AGE;
    }

    /**
     * Calculate patient age
     */
    public int calculateAge(LocalDate dateOfBirth) {
        if (dateOfBirth == null) {
            return 0;
        }
        
        return Period.between(dateOfBirth, LocalDate.now()).getYears();
    }

    /**
     * Validate patient for discharge (business rule example)
     */
    public void validatePatientForDischarge(Patient patient) {
        Map<String, List<String>> errors = new HashMap<>();
        
        if (Boolean.TRUE.equals(patient.getDeceased())) {
            addError(errors, "patient", "Cannot discharge a deceased patient");
        }
        
        if (!Boolean.TRUE.equals(patient.getActive())) {
            addError(errors, "patient", "Cannot discharge an inactive patient");
        }
        
        if (!errors.isEmpty()) {
            throw new PatientValidationException("Patient discharge validation failed", errors);
        }
    }

    /**
     * Validate patient for admission (business rule example)
     */
    public void validatePatientForAdmission(Patient patient) {
        Map<String, List<String>> errors = new HashMap<>();
        
        if (Boolean.TRUE.equals(patient.getDeceased())) {
            addError(errors, "patient", "Cannot admit a deceased patient");
        }
        
        if (!Boolean.TRUE.equals(patient.getActive())) {
            addError(errors, "patient", "Cannot admit an inactive patient");
        }
        
        // Check if patient has required emergency contact for minors
        if (isMinor(patient.getDateOfBirth())) {
            if (!StringUtils.hasText(patient.getEmergencyContactName()) || 
                !StringUtils.hasText(patient.getEmergencyContactPhone())) {
                addError(errors, "emergencyContact", "Emergency contact is required for minor patients");
            }
        }
        
        if (!errors.isEmpty()) {
            throw new PatientValidationException("Patient admission validation failed", errors);
        }
    }
}
