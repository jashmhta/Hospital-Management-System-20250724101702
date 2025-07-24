package com.hospital.hms.patientmanagement.repository;

import com.hospital.hms.patientmanagement.entity.Gender;
import com.hospital.hms.patientmanagement.entity.Patient;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.cache.annotation.Cacheable;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Patient Repository Interface
 * 
 * Provides data access operations for Patient entities.
 * Includes advanced search and query capabilities.
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Repository
public interface PatientRepository extends JpaRepository<Patient, UUID>, JpaSpecificationExecutor<Patient> {

    /**
     * Find patient by medical record number
     */
    @Cacheable(value = "patients", key = "#medicalRecordNumber")
    Optional<Patient> findByMedicalRecordNumber(String medicalRecordNumber);

    /**
     * Find patient by identifier value and system
     */
    Optional<Patient> findByIdentifierValueAndIdentifierSystem(String identifierValue, String identifierSystem);

    /**
     * Find patient by FHIR ID
     */
    Optional<Patient> findByFhirId(String fhirId);

    /**
     * Find active patients
     */
    List<Patient> findByActiveTrue();

    /**
     * Find patients by name (case-insensitive search)
     */
    @Query("SELECT p FROM Patient p WHERE " +
           "LOWER(p.familyName) LIKE LOWER(CONCAT('%', :familyName, '%')) AND " +
           "LOWER(p.givenName) LIKE LOWER(CONCAT('%', :givenName, '%'))")
    List<Patient> findByNameIgnoreCase(@Param("familyName") String familyName, 
                                      @Param("givenName") String givenName);

    /**
     * Search patients by partial name match
     */
    @Query("SELECT p FROM Patient p WHERE " +
           "LOWER(CONCAT(p.givenName, ' ', p.familyName)) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(CONCAT(p.familyName, ' ', p.givenName)) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    Page<Patient> searchByName(@Param("searchTerm") String searchTerm, Pageable pageable);

    /**
     * Find patients by date of birth
     */
    List<Patient> findByDateOfBirth(LocalDate dateOfBirth);

    /**
     * Find patients by date of birth range
     */
    @Query("SELECT p FROM Patient p WHERE p.dateOfBirth BETWEEN :startDate AND :endDate")
    List<Patient> findByDateOfBirthBetween(@Param("startDate") LocalDate startDate, 
                                          @Param("endDate") LocalDate endDate);

    /**
     * Find patients by gender
     */
    List<Patient> findByGender(Gender gender);

    /**
     * Find patients by phone number
     */
    @Query("SELECT p FROM Patient p WHERE p.phonePrimary = :phone OR p.phoneSecondary = :phone")
    List<Patient> findByPhoneNumber(@Param("phone") String phone);

    /**
     * Find patients by email
     */
    Optional<Patient> findByEmail(String email);

    /**
     * Advanced search combining multiple criteria
     */
    @Query("SELECT p FROM Patient p WHERE " +
           "(:familyName IS NULL OR LOWER(p.familyName) LIKE LOWER(CONCAT('%', :familyName, '%'))) AND " +
           "(:givenName IS NULL OR LOWER(p.givenName) LIKE LOWER(CONCAT('%', :givenName, '%'))) AND " +
           "(:dateOfBirth IS NULL OR p.dateOfBirth = :dateOfBirth) AND " +
           "(:gender IS NULL OR p.gender = :gender) AND " +
           "(:active IS NULL OR p.active = :active)")
    Page<Patient> searchPatients(@Param("familyName") String familyName,
                                @Param("givenName") String givenName,
                                @Param("dateOfBirth") LocalDate dateOfBirth,
                                @Param("gender") Gender gender,
                                @Param("active") Boolean active,
                                Pageable pageable);

    /**
     * Find patients created within date range
     */
    @Query("SELECT p FROM Patient p WHERE p.createdDate BETWEEN :startDate AND :endDate")
    List<Patient> findByCreatedDateBetween(@Param("startDate") LocalDate startDate, 
                                          @Param("endDate") LocalDate endDate);

    /**
     * Find patients by age range (calculated)
     */
    @Query("SELECT p FROM Patient p WHERE " +
           "FUNCTION('YEAR', CURRENT_DATE) - FUNCTION('YEAR', p.dateOfBirth) BETWEEN :minAge AND :maxAge")
    List<Patient> findByAgeRange(@Param("minAge") int minAge, @Param("maxAge") int maxAge);

    /**
     * Find minor patients (under 18)
     */
    @Query("SELECT p FROM Patient p WHERE " +
           "FUNCTION('YEAR', CURRENT_DATE) - FUNCTION('YEAR', p.dateOfBirth) < 18")
    List<Patient> findMinorPatients();

    /**
     * Find patients with specific allergies
     */
    @Query("SELECT p FROM Patient p WHERE LOWER(p.allergies) LIKE LOWER(CONCAT('%', :allergy, '%'))")
    List<Patient> findByAllergy(@Param("allergy") String allergy);

    /**
     * Find patients requiring interpreter
     */
    List<Patient> findByInterpreterRequiredTrue();

    /**
     * Find deceased patients
     */
    List<Patient> findByDeceasedTrue();

    /**
     * Find patients with emergency contact
     */
    @Query("SELECT p FROM Patient p WHERE p.emergencyContactName IS NOT NULL AND p.emergencyContactPhone IS NOT NULL")
    List<Patient> findPatientsWithEmergencyContact();

    /**
     * Full-text search across multiple fields
     */
    @Query("SELECT p FROM Patient p WHERE " +
           "LOWER(CONCAT(p.givenName, ' ', p.familyName, ' ', p.medicalRecordNumber, ' ', " +
           "COALESCE(p.email, ''), ' ', COALESCE(p.phonePrimary, ''))) " +
           "LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    Page<Patient> fullTextSearch(@Param("searchTerm") String searchTerm, Pageable pageable);

    /**
     * Count active patients
     */
    @Query("SELECT COUNT(p) FROM Patient p WHERE p.active = true")
    long countActivePatients();

    /**
     * Count patients by gender
     */
    @Query("SELECT p.gender, COUNT(p) FROM Patient p WHERE p.active = true GROUP BY p.gender")
    List<Object[]> countPatientsByGender();

    /**
     * Count patients by age groups
     */
    @Query("SELECT " +
           "CASE " +
           "  WHEN FUNCTION('YEAR', CURRENT_DATE) - FUNCTION('YEAR', p.dateOfBirth) < 18 THEN 'Minor' " +
           "  WHEN FUNCTION('YEAR', CURRENT_DATE) - FUNCTION('YEAR', p.dateOfBirth) BETWEEN 18 AND 64 THEN 'Adult' " +
           "  ELSE 'Senior' " +
           "END as ageGroup, " +
           "COUNT(p) " +
           "FROM Patient p WHERE p.active = true GROUP BY " +
           "CASE " +
           "  WHEN FUNCTION('YEAR', CURRENT_DATE) - FUNCTION('YEAR', p.dateOfBirth) < 18 THEN 'Minor' " +
           "  WHEN FUNCTION('YEAR', CURRENT_DATE) - FUNCTION('YEAR', p.dateOfBirth) BETWEEN 18 AND 64 THEN 'Adult' " +
           "  ELSE 'Senior' " +
           "END")
    List<Object[]> countPatientsByAgeGroup();

    /**
     * Find duplicate patients by name and DOB
     */
    @Query("SELECT p FROM Patient p WHERE " +
           "EXISTS (SELECT p2 FROM Patient p2 WHERE " +
           "p2.id != p.id AND " +
           "LOWER(p2.familyName) = LOWER(p.familyName) AND " +
           "LOWER(p2.givenName) = LOWER(p.givenName) AND " +
           "p2.dateOfBirth = p.dateOfBirth)")
    List<Patient> findPotentialDuplicates();

    /**
     * Find patients with missing critical information
     */
    @Query("SELECT p FROM Patient p WHERE " +
           "p.dateOfBirth IS NULL OR " +
           "p.gender IS NULL OR " +
           "p.phonePrimary IS NULL OR " +
           "(SELECT COUNT(a) FROM PatientAddress a WHERE a.patient = p AND a.primary = true) = 0")
    List<Patient> findPatientsWithMissingInfo();

    /**
     * Check if medical record number exists
     */
    boolean existsByMedicalRecordNumber(String medicalRecordNumber);

    /**
     * Check if email exists
     */
    boolean existsByEmail(String email);

    /**
     * Check if identifier exists
     */
    boolean existsByIdentifierValueAndIdentifierSystem(String identifierValue, String identifierSystem);

    /**
     * Find recently updated patients
     */
    @Query("SELECT p FROM Patient p WHERE p.lastModifiedDate >= :since ORDER BY p.lastModifiedDate DESC")
    List<Patient> findRecentlyUpdated(@Param("since") LocalDate since);

    /**
     * Custom query for patient dashboard statistics
     */
    @Query("SELECT " +
           "COUNT(p) as totalPatients, " +
           "COUNT(CASE WHEN p.active = true THEN 1 END) as activePatients, " +
           "COUNT(CASE WHEN p.createdDate >= :startOfMonth THEN 1 END) as newThisMonth, " +
           "COUNT(CASE WHEN FUNCTION('YEAR', CURRENT_DATE) - FUNCTION('YEAR', p.dateOfBirth) < 18 THEN 1 END) as minorPatients " +
           "FROM Patient p")
    Object[] getPatientStatistics(@Param("startOfMonth") LocalDate startOfMonth);
}
