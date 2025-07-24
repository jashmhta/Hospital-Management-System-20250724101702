package com.hospital.hms.mpiintegration.repository;

import com.hospital.hms.mpiintegration.entity.PatientIdentity;
import com.hospital.hms.mpiintegration.entity.IdentityStatus;
import com.hospital.hms.mpiintegration.entity.VerificationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Repository interface for PatientIdentity entity operations
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Repository
public interface PatientIdentityRepository extends JpaRepository<PatientIdentity, UUID> {

    // Find by MPI ID
    Optional<PatientIdentity> findByMpiId(String mpiId);

    // Find by external patient ID and source system
    Optional<PatientIdentity> findByExternalPatientIdAndSourceSystem(String externalPatientId, String sourceSystem);

    // Find by SSN
    List<PatientIdentity> findBySsn(String ssn);

    // Find by MRN
    List<PatientIdentity> findByMrn(String mrn);

    // Find by FHIR Patient ID
    Optional<PatientIdentity> findByFhirPatientId(String fhirPatientId);

    // Find by master patient ID
    List<PatientIdentity> findByMasterPatientId(UUID masterPatientId);

    // Find master identities
    List<PatientIdentity> findByIsMasterIdentityTrue();

    // Find by identity status
    List<PatientIdentity> findByIdentityStatus(IdentityStatus identityStatus);

    // Find by verification status
    List<PatientIdentity> findByVerificationStatus(VerificationStatus verificationStatus);

    // Demographics-based search
    @Query("SELECT pi FROM PatientIdentity pi WHERE " +
           "LOWER(pi.firstName) = LOWER(:firstName) AND " +
           "LOWER(pi.lastName) = LOWER(:lastName) AND " +
           "pi.dateOfBirth = :dateOfBirth")
    List<PatientIdentity> findByDemographics(
        @Param("firstName") String firstName,
        @Param("lastName") String lastName,
        @Param("dateOfBirth") LocalDate dateOfBirth);

    // Fuzzy search by name and date of birth
    @Query("SELECT pi FROM PatientIdentity pi WHERE " +
           "(LOWER(pi.firstName) LIKE LOWER(CONCAT('%', :firstName, '%')) OR " +
           " LOWER(pi.lastName) LIKE LOWER(CONCAT('%', :lastName, '%'))) AND " +
           "pi.dateOfBirth = :dateOfBirth")
    List<PatientIdentity> findByFuzzyNameAndDateOfBirth(
        @Param("firstName") String firstName,
        @Param("lastName") String lastName,
        @Param("dateOfBirth") LocalDate dateOfBirth);

    // Find potential duplicates
    @Query("SELECT pi FROM PatientIdentity pi WHERE " +
           "pi.id != :excludeId AND " +
           "((LOWER(pi.firstName) = LOWER(:firstName) AND LOWER(pi.lastName) = LOWER(:lastName)) OR " +
           " pi.ssn = :ssn OR " +
           " (pi.email = :email AND pi.email IS NOT NULL)) AND " +
           "pi.identityStatus = 'ACTIVE'")
    List<PatientIdentity> findPotentialDuplicates(
        @Param("excludeId") UUID excludeId,
        @Param("firstName") String firstName,
        @Param("lastName") String lastName,
        @Param("ssn") String ssn,
        @Param("email") String email);

    // Find by source system
    List<PatientIdentity> findBySourceSystem(String sourceSystem);

    // Find by source system with pagination
    Page<PatientIdentity> findBySourceSystem(String sourceSystem, Pageable pageable);

    // Find by confidence score range
    @Query("SELECT pi FROM PatientIdentity pi WHERE " +
           "pi.confidenceScore >= :minScore AND pi.confidenceScore <= :maxScore")
    List<PatientIdentity> findByConfidenceScoreRange(
        @Param("minScore") Double minScore,
        @Param("maxScore") Double maxScore);

    // Find identities requiring verification
    @Query("SELECT pi FROM PatientIdentity pi WHERE " +
           "pi.verificationStatus IN ('UNVERIFIED', 'VERIFICATION_REQUIRED') AND " +
           "pi.identityStatus = 'ACTIVE'")
    List<PatientIdentity> findIdentitiesRequiringVerification();

    // Find recently created identities
    @Query("SELECT pi FROM PatientIdentity pi WHERE " +
           "pi.createdDate >= :since ORDER BY pi.createdDate DESC")
    List<PatientIdentity> findRecentlyCreated(@Param("since") LocalDateTime since);

    // Find by phone number
    @Query("SELECT pi FROM PatientIdentity pi WHERE " +
           "pi.phoneHome = :phone OR pi.phoneMobile = :phone OR pi.phoneWork = :phone")
    List<PatientIdentity> findByPhoneNumber(@Param("phone") String phone);

    // Find by email
    List<PatientIdentity> findByEmail(String email);

    // Find by address components
    @Query("SELECT pi FROM PatientIdentity pi WHERE " +
           "LOWER(pi.addressLine1) LIKE LOWER(CONCAT('%', :address, '%')) AND " +
           "LOWER(pi.city) = LOWER(:city) AND " +
           "LOWER(pi.state) = LOWER(:state)")
    List<PatientIdentity> findByAddressComponents(
        @Param("address") String address,
        @Param("city") String city,
        @Param("state") String state);

    // Data quality queries
    @Query("SELECT pi FROM PatientIdentity pi WHERE " +
           "pi.dataQualityScore < :threshold ORDER BY pi.dataQualityScore ASC")
    List<PatientIdentity> findLowDataQuality(@Param("threshold") Double threshold);

    @Query("SELECT pi FROM PatientIdentity pi WHERE " +
           "pi.completenessScore < :threshold ORDER BY pi.completenessScore ASC")
    List<PatientIdentity> findIncompleteIdentities(@Param("threshold") Double threshold);

    // Statistics queries
    @Query("SELECT COUNT(pi) FROM PatientIdentity pi WHERE pi.identityStatus = :status")
    Long countByIdentityStatus(@Param("status") IdentityStatus status);

    @Query("SELECT COUNT(pi) FROM PatientIdentity pi WHERE pi.sourceSystem = :sourceSystem")
    Long countBySourceSystem(@Param("sourceSystem") String sourceSystem);

    @Query("SELECT AVG(pi.confidenceScore) FROM PatientIdentity pi WHERE pi.identityStatus = 'ACTIVE'")
    Double averageConfidenceScore();

    @Query("SELECT AVG(pi.dataQualityScore) FROM PatientIdentity pi WHERE pi.identityStatus = 'ACTIVE'")
    Double averageDataQualityScore();

    // Identity management operations
    @Query("SELECT pi FROM PatientIdentity pi WHERE " +
           "pi.masterPatientId IS NULL AND pi.identityStatus = 'ACTIVE'")
    List<PatientIdentity> findUnlinkedIdentities();

    @Query("SELECT pi FROM PatientIdentity pi WHERE " +
           "pi.identityStatus = 'DUPLICATE' AND pi.masterPatientId = :masterPatientId")
    List<PatientIdentity> findDuplicatesByMasterPatient(@Param("masterPatientId") UUID masterPatientId);

    // FHIR integration queries
    @Query("SELECT pi FROM PatientIdentity pi WHERE " +
           "pi.fhirLastUpdated IS NULL OR pi.fhirLastUpdated < :since")
    List<PatientIdentity> findRequiringFhirSync(@Param("since") LocalDateTime since);

    // Access tracking
    @Query("UPDATE PatientIdentity pi SET " +
           "pi.lastAccessedDate = :accessDate, " +
           "pi.accessCount = pi.accessCount + 1 " +
           "WHERE pi.id = :id")
    void updateAccessTracking(@Param("id") UUID id, @Param("accessDate") LocalDateTime accessDate);

    // Advanced search with multiple criteria
    @Query("SELECT pi FROM PatientIdentity pi WHERE " +
           "(:firstName IS NULL OR LOWER(pi.firstName) LIKE LOWER(CONCAT('%', :firstName, '%'))) AND " +
           "(:lastName IS NULL OR LOWER(pi.lastName) LIKE LOWER(CONCAT('%', :lastName, '%'))) AND " +
           "(:dateOfBirth IS NULL OR pi.dateOfBirth = :dateOfBirth) AND " +
           "(:ssn IS NULL OR pi.ssn = :ssn) AND " +
           "(:sourceSystem IS NULL OR pi.sourceSystem = :sourceSystem) AND " +
           "(:identityStatus IS NULL OR pi.identityStatus = :identityStatus)")
    Page<PatientIdentity> findByMultipleCriteria(
        @Param("firstName") String firstName,
        @Param("lastName") String lastName,
        @Param("dateOfBirth") LocalDate dateOfBirth,
        @Param("ssn") String ssn,
        @Param("sourceSystem") String sourceSystem,
        @Param("identityStatus") IdentityStatus identityStatus,
        Pageable pageable);

    // Identity matching candidates
    @Query("SELECT pi FROM PatientIdentity pi WHERE " +
           "pi.id != :excludeId AND " +
           "pi.identityStatus = 'ACTIVE' AND " +
           "(" +
           "  (LOWER(pi.firstName) LIKE LOWER(CONCAT('%', :firstName, '%')) AND " +
           "   LOWER(pi.lastName) LIKE LOWER(CONCAT('%', :lastName, '%'))) OR " +
           "  (pi.ssn = :ssn AND :ssn IS NOT NULL) OR " +
           "  (pi.dateOfBirth = :dateOfBirth AND " +
           "   (LOWER(pi.firstName) = LOWER(:firstName) OR LOWER(pi.lastName) = LOWER(:lastName)))" +
           ") ORDER BY " +
           "CASE " +
           "  WHEN pi.ssn = :ssn THEN 1 " +
           "  WHEN LOWER(pi.firstName) = LOWER(:firstName) AND LOWER(pi.lastName) = LOWER(:lastName) THEN 2 " +
           "  ELSE 3 " +
           "END")
    List<PatientIdentity> findMatchingCandidates(
        @Param("excludeId") UUID excludeId,
        @Param("firstName") String firstName,
        @Param("lastName") String lastName,
        @Param("dateOfBirth") LocalDate dateOfBirth,
        @Param("ssn") String ssn);
}
