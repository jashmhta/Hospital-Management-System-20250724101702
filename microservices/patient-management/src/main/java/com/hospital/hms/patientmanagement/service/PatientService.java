package com.hospital.hms.patientmanagement.service;

import com.hospital.hms.patientmanagement.dto.*;
import com.hospital.hms.patientmanagement.entity.Gender;
import com.hospital.hms.patientmanagement.entity.Patient;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

/**
 * Service interface for Patient Management operations
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
public interface PatientService {

    /**
     * Create a new patient
     * 
     * @param createRequest Patient creation request
     * @return Created patient response
     */
    PatientResponseDto createPatient(PatientCreateRequestDto createRequest);

    /**
     * Update an existing patient
     * 
     * @param patientId Patient ID
     * @param updateRequest Patient update request
     * @return Updated patient response
     */
    PatientResponseDto updatePatient(UUID patientId, PatientUpdateRequestDto updateRequest);

    /**
     * Get patient by ID
     * 
     * @param patientId Patient ID
     * @return Patient response
     */
    PatientResponseDto getPatientById(UUID patientId);

    /**
     * Get patient by medical record number
     * 
     * @param medicalRecordNumber Medical record number
     * @return Patient response
     */
    PatientResponseDto getPatientByMrn(String medicalRecordNumber);

    /**
     * Get patient by identifier
     * 
     * @param identifierValue Identifier value
     * @param identifierSystem Identifier system
     * @return Patient response
     */
    Optional<PatientResponseDto> getPatientByIdentifier(String identifierValue, String identifierSystem);

    /**
     * Get patient by FHIR ID
     * 
     * @param fhirId FHIR resource ID
     * @return Patient response
     */
    Optional<PatientResponseDto> getPatientByFhirId(String fhirId);

    /**
     * Search patients with criteria
     * 
     * @param criteria Search criteria
     * @param pageable Pagination information
     * @return Page of patient responses
     */
    Page<PatientResponseDto> searchPatients(PatientSearchCriteria criteria, Pageable pageable);

    /**
     * Get all active patients
     * 
     * @param pageable Pagination information
     * @return Page of active patients
     */
    Page<PatientResponseDto> getActivePatients(Pageable pageable);

    /**
     * Full-text search across patient data
     * 
     * @param searchTerm Search term
     * @param pageable Pagination information
     * @return Page of matching patients
     */
    Page<PatientResponseDto> fullTextSearch(String searchTerm, Pageable pageable);

    /**
     * Find patients by name
     * 
     * @param familyName Family name
     * @param givenName Given name
     * @return List of matching patients
     */
    List<PatientResponseDto> findPatientsByName(String familyName, String givenName);

    /**
     * Find patients by date of birth
     * 
     * @param dateOfBirth Date of birth
     * @return List of matching patients
     */
    List<PatientResponseDto> findPatientsByDateOfBirth(LocalDate dateOfBirth);

    /**
     * Find patients by date of birth range
     * 
     * @param startDate Start date
     * @param endDate End date
     * @return List of matching patients
     */
    List<PatientResponseDto> findPatientsByDateOfBirthRange(LocalDate startDate, LocalDate endDate);

    /**
     * Find patients by age range
     * 
     * @param minAge Minimum age
     * @param maxAge Maximum age
     * @return List of matching patients
     */
    List<PatientResponseDto> findPatientsByAgeRange(int minAge, int maxAge);

    /**
     * Find minor patients (under 18)
     * 
     * @return List of minor patients
     */
    List<PatientResponseDto> findMinorPatients();

    /**
     * Find patients by gender
     * 
     * @param gender Gender
     * @return List of matching patients
     */
    List<PatientResponseDto> findPatientsByGender(Gender gender);

    /**
     * Find patients by phone number
     * 
     * @param phoneNumber Phone number
     * @return List of matching patients
     */
    List<PatientResponseDto> findPatientsByPhone(String phoneNumber);

    /**
     * Find patient by email
     * 
     * @param email Email address
     * @return Patient response if found
     */
    Optional<PatientResponseDto> findPatientByEmail(String email);

    /**
     * Find patients with specific allergies
     * 
     * @param allergy Allergy name
     * @return List of matching patients
     */
    List<PatientResponseDto> findPatientsByAllergy(String allergy);

    /**
     * Find patients requiring interpreter
     * 
     * @return List of patients requiring interpreter
     */
    List<PatientResponseDto> findPatientsRequiringInterpreter();

    /**
     * Find deceased patients
     * 
     * @return List of deceased patients
     */
    List<PatientResponseDto> findDeceasedPatients();

    /**
     * Find patients with emergency contact
     * 
     * @return List of patients with emergency contact
     */
    List<PatientResponseDto> findPatientsWithEmergencyContact();

    /**
     * Find potential duplicate patients
     * 
     * @return List of potential duplicate patients
     */
    List<PatientResponseDto> findPotentialDuplicates();

    /**
     * Find patients with missing critical information
     * 
     * @return List of patients with missing info
     */
    List<PatientResponseDto> findPatientsWithMissingInfo();

    /**
     * Find recently updated patients
     * 
     * @param since Date since when to check for updates
     * @return List of recently updated patients
     */
    List<PatientResponseDto> findRecentlyUpdatedPatients(LocalDate since);

    /**
     * Deactivate patient
     * 
     * @param patientId Patient ID
     * @return Updated patient response
     */
    PatientResponseDto deactivatePatient(UUID patientId);

    /**
     * Reactivate patient
     * 
     * @param patientId Patient ID
     * @return Updated patient response
     */
    PatientResponseDto reactivatePatient(UUID patientId);

    /**
     * Mark patient as deceased
     * 
     * @param patientId Patient ID
     * @param deceasedDateTime Date and time of death
     * @return Updated patient response
     */
    PatientResponseDto markPatientAsDeceased(UUID patientId, java.time.LocalDateTime deceasedDateTime);

    /**
     * Generate medical record number
     * 
     * @return Generated MRN
     */
    String generateMedicalRecordNumber();

    /**
     * Check if medical record number exists
     * 
     * @param medicalRecordNumber MRN to check
     * @return True if exists, false otherwise
     */
    boolean medicalRecordNumberExists(String medicalRecordNumber);

    /**
     * Check if email exists
     * 
     * @param email Email to check
     * @return True if exists, false otherwise
     */
    boolean emailExists(String email);

    /**
     * Check if identifier exists
     * 
     * @param identifierValue Identifier value
     * @param identifierSystem Identifier system
     * @return True if exists, false otherwise
     */
    boolean identifierExists(String identifierValue, String identifierSystem);

    /**
     * Get patient statistics
     * 
     * @return Patient statistics
     */
    Map<String, Object> getPatientStatistics();

    /**
     * Get patient count by gender
     * 
     * @return Gender distribution
     */
    Map<String, Long> getPatientCountByGender();

    /**
     * Get patient count by age groups
     * 
     * @return Age group distribution
     */
    Map<String, Long> getPatientCountByAgeGroup();

    /**
     * Validate patient data for business rules
     * 
     * @param patient Patient to validate
     * @param isUpdate Whether this is an update operation
     */
    void validatePatientBusinessRules(Patient patient, boolean isUpdate);

    /**
     * Merge duplicate patients
     * 
     * @param primaryPatientId Primary patient ID (to keep)
     * @param duplicatePatientId Duplicate patient ID (to merge and deactivate)
     * @return Merged patient response
     */
    PatientResponseDto mergeDuplicatePatients(UUID primaryPatientId, UUID duplicatePatientId);

    /**
     * Export patients data
     * 
     * @param criteria Search criteria for export
     * @return List of all matching patients
     */
    List<PatientResponseDto> exportPatients(PatientSearchCriteria criteria);

    /**
     * Bulk update patients
     * 
     * @param patientIds List of patient IDs
     * @param updateRequest Update request
     * @return Number of updated patients
     */
    int bulkUpdatePatients(List<UUID> patientIds, PatientUpdateRequestDto updateRequest);
}
