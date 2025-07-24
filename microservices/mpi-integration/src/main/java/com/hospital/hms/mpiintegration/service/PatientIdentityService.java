package com.hospital.hms.mpiintegration.service;

import com.hospital.hms.mpiintegration.dto.PatientIdentityCreateRequestDto;
import com.hospital.hms.mpiintegration.dto.PatientIdentityResponseDto;
import com.hospital.hms.mpiintegration.entity.PatientIdentity;
import com.hospital.hms.mpiintegration.entity.IdentityStatus;
import com.hospital.hms.mpiintegration.entity.VerificationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Service interface for Patient Identity Management operations
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
public interface PatientIdentityService {

    /**
     * Create a new patient identity
     */
    PatientIdentityResponseDto createPatientIdentity(PatientIdentityCreateRequestDto requestDto);

    /**
     * Update an existing patient identity
     */
    PatientIdentityResponseDto updatePatientIdentity(UUID id, PatientIdentityCreateRequestDto requestDto);

    /**
     * Get patient identity by ID
     */
    Optional<PatientIdentityResponseDto> getPatientIdentityById(UUID id);

    /**
     * Get patient identity by MPI ID
     */
    Optional<PatientIdentityResponseDto> getPatientIdentityByMpiId(String mpiId);

    /**
     * Get patient identity by external patient ID and source system
     */
    Optional<PatientIdentityResponseDto> getPatientIdentityByExternalId(String externalPatientId, String sourceSystem);

    /**
     * Get patient identity by FHIR Patient ID
     */
    Optional<PatientIdentityResponseDto> getPatientIdentityByFhirId(String fhirPatientId);

    /**
     * Search patient identities by demographics
     */
    List<PatientIdentityResponseDto> searchByDemographics(String firstName, String lastName, LocalDate dateOfBirth);

    /**
     * Fuzzy search patient identities
     */
    List<PatientIdentityResponseDto> fuzzySearch(String firstName, String lastName, LocalDate dateOfBirth);

    /**
     * Advanced search with multiple criteria
     */
    Page<PatientIdentityResponseDto> advancedSearch(String firstName, String lastName, LocalDate dateOfBirth, 
                                                   String ssn, String sourceSystem, IdentityStatus identityStatus, 
                                                   Pageable pageable);

    /**
     * Find potential duplicate identities
     */
    List<PatientIdentityResponseDto> findPotentialDuplicates(UUID excludeId, String firstName, String lastName, 
                                                            String ssn, String email);

    /**
     * Find matching candidates for identity resolution
     */
    List<PatientIdentityResponseDto> findMatchingCandidates(UUID excludeId, String firstName, String lastName, 
                                                           LocalDate dateOfBirth, String ssn);

    /**
     * Perform identity matching and create match records
     */
    void performIdentityMatching(UUID patientIdentityId);

    /**
     * Merge two patient identities
     */
    PatientIdentityResponseDto mergePatientIdentities(UUID masterIdentityId, UUID duplicateIdentityId, String mergedBy);

    /**
     * Link patient identity to master patient
     */
    PatientIdentityResponseDto linkToMasterPatient(UUID identityId, UUID masterPatientId);

    /**
     * Unlink patient identity from master patient
     */
    PatientIdentityResponseDto unlinkFromMasterPatient(UUID identityId);

    /**
     * Verify patient identity
     */
    PatientIdentityResponseDto verifyPatientIdentity(UUID id, String verifiedBy);

    /**
     * Mark identity as requiring verification
     */
    PatientIdentityResponseDto markForVerification(UUID id, String reason);

    /**
     * Update identity status
     */
    PatientIdentityResponseDto updateIdentityStatus(UUID id, IdentityStatus newStatus, String reason);

    /**
     * Update verification status
     */
    PatientIdentityResponseDto updateVerificationStatus(UUID id, VerificationStatus newStatus, String verifiedBy);

    /**
     * Calculate and update confidence score
     */
    PatientIdentityResponseDto updateConfidenceScore(UUID id);

    /**
     * Calculate and update data quality scores
     */
    PatientIdentityResponseDto updateDataQualityScores(UUID id);

    /**
     * Get all identities linked to a master patient
     */
    List<PatientIdentityResponseDto> getLinkedIdentities(UUID masterPatientId);

    /**
     * Get master identity for a patient
     */
    Optional<PatientIdentityResponseDto> getMasterIdentity(UUID masterPatientId);

    /**
     * Get identities by source system
     */
    Page<PatientIdentityResponseDto> getIdentitiesBySourceSystem(String sourceSystem, Pageable pageable);

    /**
     * Get identities requiring verification
     */
    List<PatientIdentityResponseDto> getIdentitiesRequiringVerification();

    /**
     * Get recently created identities
     */
    List<PatientIdentityResponseDto> getRecentlyCreatedIdentities(LocalDateTime since);

    /**
     * Get identities with low data quality
     */
    List<PatientIdentityResponseDto> getLowDataQualityIdentities(Double threshold);

    /**
     * Get incomplete identities
     */
    List<PatientIdentityResponseDto> getIncompleteIdentities(Double threshold);

    /**
     * Get unlinked identities (not linked to any master patient)
     */
    List<PatientIdentityResponseDto> getUnlinkedIdentities();

    /**
     * Get identities requiring FHIR synchronization
     */
    List<PatientIdentityResponseDto> getIdentitiesRequiringFhirSync(LocalDateTime since);

    /**
     * Synchronize with FHIR server
     */
    PatientIdentityResponseDto syncWithFhir(UUID id);

    /**
     * Batch synchronize multiple identities with FHIR
     */
    List<PatientIdentityResponseDto> batchSyncWithFhir(List<UUID> ids);

    /**
     * Delete patient identity (soft delete)
     */
    void deletePatientIdentity(UUID id, String deletedBy);

    /**
     * Restore deleted patient identity
     */
    PatientIdentityResponseDto restorePatientIdentity(UUID id, String restoredBy);

    /**
     * Get identity statistics by source system
     */
    long getIdentityCountBySourceSystem(String sourceSystem);

    /**
     * Get identity statistics by status
     */
    long getIdentityCountByStatus(IdentityStatus status);

    /**
     * Get average confidence score
     */
    Double getAverageConfidenceScore();

    /**
     * Get average data quality score
     */
    Double getAverageDataQualityScore();

    /**
     * Generate MPI ID for new identity
     */
    String generateMpiId();

    /**
     * Validate patient identity data
     */
    void validatePatientIdentity(PatientIdentityCreateRequestDto requestDto);

    /**
     * Calculate confidence score for identity
     */
    Double calculateConfidenceScore(PatientIdentity identity);

    /**
     * Calculate data quality score for identity
     */
    Double calculateDataQualityScore(PatientIdentity identity);

    /**
     * Calculate completeness score for identity
     */
    Double calculateCompletenessScore(PatientIdentity identity);

    /**
     * Track access to patient identity
     */
    void trackAccess(UUID id);

    /**
     * Create identity alias
     */
    void createIdentityAlias(UUID identityId, String aliasType, String firstName, String lastName, String reason);

    /**
     * Remove identity alias
     */
    void removeIdentityAlias(UUID identityId, UUID aliasId);

    /**
     * Process identity match confirmation
     */
    void confirmIdentityMatch(UUID matchId, String confirmedBy);

    /**
     * Process identity match rejection
     */
    void rejectIdentityMatch(UUID matchId, String rejectedBy, String reason);

    /**
     * Auto-resolve identity matches based on confidence scores
     */
    void autoResolveMatches(Double confidenceThreshold);

    /**
     * Export patient identities for external systems
     */
    List<PatientIdentityResponseDto> exportIdentities(String sourceSystem, LocalDateTime since);

    /**
     * Import patient identities from external systems
     */
    List<PatientIdentityResponseDto> importIdentities(List<PatientIdentityCreateRequestDto> identities, String sourceSystem);

    /**
     * Perform data quality checks on all identities
     */
    void performDataQualityChecks();

    /**
     * Perform identity deduplication process
     */
    void performDeduplication();

    /**
     * Generate identity management report
     */
    Object generateIdentityReport(LocalDateTime fromDate, LocalDateTime toDate);
}
