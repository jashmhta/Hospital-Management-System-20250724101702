package com.hospital.hms.mpiintegration.controller;

import com.hospital.hms.mpiintegration.dto.PatientIdentityCreateRequestDto;
import com.hospital.hms.mpiintegration.dto.PatientIdentityResponseDto;
import com.hospital.hms.mpiintegration.entity.IdentityStatus;
import com.hospital.hms.mpiintegration.entity.VerificationStatus;
import com.hospital.hms.mpiintegration.service.PatientIdentityService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

/**
 * REST Controller for Master Patient Index operations
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@RestController
@RequestMapping("/api/v1/mpi")
@Tag(name = "Master Patient Index", description = "Patient Identity Management API")
@CrossOrigin(origins = "*")
public class PatientIdentityController {

    private static final Logger logger = LoggerFactory.getLogger(PatientIdentityController.class);

    @Autowired
    private PatientIdentityService patientIdentityService;

    /**
     * Create a new patient identity
     */
    @PostMapping("/identities")
    @Operation(summary = "Create patient identity", description = "Create a new patient identity in the MPI")
    @PreAuthorize("hasRole('MPI_ADMIN') or hasRole('REGISTRATION_STAFF')")
    public ResponseEntity<PatientIdentityResponseDto> createPatientIdentity(
            @Valid @RequestBody PatientIdentityCreateRequestDto requestDto) {
        
        logger.info("Creating patient identity for external ID: {} from system: {}", 
                   requestDto.getExternalPatientId(), requestDto.getSourceSystem());
        
        try {
            PatientIdentityResponseDto response = patientIdentityService.createPatientIdentity(requestDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            logger.error("Failed to create patient identity: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    /**
     * Update an existing patient identity
     */
    @PutMapping("/identities/{id}")
    @Operation(summary = "Update patient identity", description = "Update an existing patient identity")
    @PreAuthorize("hasRole('MPI_ADMIN') or hasRole('REGISTRATION_STAFF')")
    public ResponseEntity<PatientIdentityResponseDto> updatePatientIdentity(
            @PathVariable UUID id,
            @Valid @RequestBody PatientIdentityCreateRequestDto requestDto) {
        
        logger.info("Updating patient identity: {}", id);
        
        try {
            PatientIdentityResponseDto response = patientIdentityService.updatePatientIdentity(id, requestDto);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            logger.error("Failed to update patient identity {}: {}", id, e.getMessage());
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            logger.error("Error updating patient identity {}: {}", id, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get patient identity by ID
     */
    @GetMapping("/identities/{id}")
    @Operation(summary = "Get patient identity by ID", description = "Retrieve a patient identity by its UUID")
    @PreAuthorize("hasRole('MPI_USER') or hasRole('CLINICAL_STAFF')")
    public ResponseEntity<PatientIdentityResponseDto> getPatientIdentityById(@PathVariable UUID id) {
        logger.debug("Retrieving patient identity: {}", id);
        
        Optional<PatientIdentityResponseDto> identity = patientIdentityService.getPatientIdentityById(id);
        return identity.map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get patient identity by MPI ID
     */
    @GetMapping("/identities/mpi/{mpiId}")
    @Operation(summary = "Get patient identity by MPI ID", description = "Retrieve a patient identity by MPI ID")
    @PreAuthorize("hasRole('MPI_USER') or hasRole('CLINICAL_STAFF')")
    public ResponseEntity<PatientIdentityResponseDto> getPatientIdentityByMpiId(@PathVariable String mpiId) {
        logger.debug("Retrieving patient identity by MPI ID: {}", mpiId);
        
        Optional<PatientIdentityResponseDto> identity = patientIdentityService.getPatientIdentityByMpiId(mpiId);
        return identity.map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get patient identity by external ID and source system
     */
    @GetMapping("/identities/external")
    @Operation(summary = "Get patient identity by external ID", description = "Retrieve patient identity by external ID and source system")
    @PreAuthorize("hasRole('MPI_USER') or hasRole('CLINICAL_STAFF')")
    public ResponseEntity<PatientIdentityResponseDto> getPatientIdentityByExternalId(
            @RequestParam String externalPatientId,
            @RequestParam String sourceSystem) {
        
        logger.debug("Retrieving patient identity by external ID: {} from system: {}", externalPatientId, sourceSystem);
        
        Optional<PatientIdentityResponseDto> identity = patientIdentityService
                .getPatientIdentityByExternalId(externalPatientId, sourceSystem);
        return identity.map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get patient identity by FHIR ID
     */
    @GetMapping("/identities/fhir/{fhirPatientId}")
    @Operation(summary = "Get patient identity by FHIR ID", description = "Retrieve patient identity by FHIR Patient ID")
    @PreAuthorize("hasRole('MPI_USER') or hasRole('CLINICAL_STAFF')")
    public ResponseEntity<PatientIdentityResponseDto> getPatientIdentityByFhirId(@PathVariable String fhirPatientId) {
        logger.debug("Retrieving patient identity by FHIR ID: {}", fhirPatientId);
        
        Optional<PatientIdentityResponseDto> identity = patientIdentityService.getPatientIdentityByFhirId(fhirPatientId);
        return identity.map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Search patient identities by demographics
     */
    @GetMapping("/identities/search/demographics")
    @Operation(summary = "Search by demographics", description = "Search patient identities by demographic information")
    @PreAuthorize("hasRole('MPI_USER') or hasRole('CLINICAL_STAFF')")
    public ResponseEntity<List<PatientIdentityResponseDto>> searchByDemographics(
            @RequestParam String firstName,
            @RequestParam String lastName,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateOfBirth) {
        
        logger.debug("Searching by demographics: {} {}, DOB: {}", firstName, lastName, dateOfBirth);
        
        List<PatientIdentityResponseDto> identities = patientIdentityService
                .searchByDemographics(firstName, lastName, dateOfBirth);
        return ResponseEntity.ok(identities);
    }

    /**
     * Fuzzy search patient identities
     */
    @GetMapping("/identities/search/fuzzy")
    @Operation(summary = "Fuzzy search", description = "Perform fuzzy search on patient identities")
    @PreAuthorize("hasRole('MPI_USER') or hasRole('CLINICAL_STAFF')")
    public ResponseEntity<List<PatientIdentityResponseDto>> fuzzySearch(
            @RequestParam String firstName,
            @RequestParam String lastName,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateOfBirth) {
        
        logger.debug("Performing fuzzy search: {} {}, DOB: {}", firstName, lastName, dateOfBirth);
        
        List<PatientIdentityResponseDto> identities = patientIdentityService
                .fuzzySearch(firstName, lastName, dateOfBirth);
        return ResponseEntity.ok(identities);
    }

    /**
     * Advanced search with multiple criteria
     */
    @GetMapping("/identities/search/advanced")
    @Operation(summary = "Advanced search", description = "Advanced search with multiple criteria and pagination")
    @PreAuthorize("hasRole('MPI_USER') or hasRole('CLINICAL_STAFF')")
    public ResponseEntity<Page<PatientIdentityResponseDto>> advancedSearch(
            @RequestParam(required = false) String firstName,
            @RequestParam(required = false) String lastName,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateOfBirth,
            @RequestParam(required = false) String ssn,
            @RequestParam(required = false) String sourceSystem,
            @RequestParam(required = false) IdentityStatus identityStatus,
            Pageable pageable) {
        
        logger.debug("Performing advanced search with pagination");
        
        Page<PatientIdentityResponseDto> identities = patientIdentityService
                .advancedSearch(firstName, lastName, dateOfBirth, ssn, sourceSystem, identityStatus, pageable);
        return ResponseEntity.ok(identities);
    }

    /**
     * Find potential duplicates
     */
    @GetMapping("/identities/{id}/duplicates")
    @Operation(summary = "Find potential duplicates", description = "Find potential duplicate identities")
    @PreAuthorize("hasRole('MPI_ADMIN') or hasRole('DATA_STEWARD')")
    public ResponseEntity<List<PatientIdentityResponseDto>> findPotentialDuplicates(
            @PathVariable UUID id,
            @RequestParam String firstName,
            @RequestParam String lastName,
            @RequestParam(required = false) String ssn,
            @RequestParam(required = false) String email) {
        
        logger.debug("Finding potential duplicates for identity: {}", id);
        
        List<PatientIdentityResponseDto> duplicates = patientIdentityService
                .findPotentialDuplicates(id, firstName, lastName, ssn, email);
        return ResponseEntity.ok(duplicates);
    }

    /**
     * Find matching candidates
     */
    @GetMapping("/identities/{id}/matches")
    @Operation(summary = "Find matching candidates", description = "Find matching candidate identities")
    @PreAuthorize("hasRole('MPI_ADMIN') or hasRole('DATA_STEWARD')")
    public ResponseEntity<List<PatientIdentityResponseDto>> findMatchingCandidates(
            @PathVariable UUID id,
            @RequestParam String firstName,
            @RequestParam String lastName,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateOfBirth,
            @RequestParam(required = false) String ssn) {
        
        logger.debug("Finding matching candidates for identity: {}", id);
        
        List<PatientIdentityResponseDto> candidates = patientIdentityService
                .findMatchingCandidates(id, firstName, lastName, dateOfBirth, ssn);
        return ResponseEntity.ok(candidates);
    }

    /**
     * Perform identity matching
     */
    @PostMapping("/identities/{id}/match")
    @Operation(summary = "Perform identity matching", description = "Perform identity matching for a patient")
    @PreAuthorize("hasRole('MPI_ADMIN') or hasRole('DATA_STEWARD')")
    public ResponseEntity<Void> performIdentityMatching(@PathVariable UUID id) {
        logger.info("Performing identity matching for patient: {}", id);
        
        try {
            patientIdentityService.performIdentityMatching(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            logger.error("Failed to perform identity matching for {}: {}", id, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Merge patient identities
     */
    @PostMapping("/identities/{masterId}/merge/{duplicateId}")
    @Operation(summary = "Merge patient identities", description = "Merge duplicate identity into master identity")
    @PreAuthorize("hasRole('MPI_ADMIN')")
    public ResponseEntity<PatientIdentityResponseDto> mergePatientIdentities(
            @PathVariable UUID masterId,
            @PathVariable UUID duplicateId,
            @RequestParam String mergedBy) {
        
        logger.info("Merging patient identities: master={}, duplicate={}", masterId, duplicateId);
        
        try {
            PatientIdentityResponseDto result = patientIdentityService
                    .mergePatientIdentities(masterId, duplicateId, mergedBy);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            logger.error("Failed to merge identities: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    /**
     * Link identity to master patient
     */
    @PostMapping("/identities/{identityId}/link/{masterPatientId}")
    @Operation(summary = "Link to master patient", description = "Link identity to a master patient")
    @PreAuthorize("hasRole('MPI_ADMIN')")
    public ResponseEntity<PatientIdentityResponseDto> linkToMasterPatient(
            @PathVariable UUID identityId,
            @PathVariable UUID masterPatientId) {
        
        logger.info("Linking identity {} to master patient {}", identityId, masterPatientId);
        
        try {
            PatientIdentityResponseDto result = patientIdentityService
                    .linkToMasterPatient(identityId, masterPatientId);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            logger.error("Failed to link identity to master patient: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    /**
     * Unlink identity from master patient
     */
    @DeleteMapping("/identities/{identityId}/link")
    @Operation(summary = "Unlink from master patient", description = "Unlink identity from master patient")
    @PreAuthorize("hasRole('MPI_ADMIN')")
    public ResponseEntity<PatientIdentityResponseDto> unlinkFromMasterPatient(@PathVariable UUID identityId) {
        logger.info("Unlinking identity {} from master patient", identityId);
        
        try {
            PatientIdentityResponseDto result = patientIdentityService.unlinkFromMasterPatient(identityId);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            logger.error("Failed to unlink identity from master patient: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    /**
     * Verify patient identity
     */
    @PostMapping("/identities/{id}/verify")
    @Operation(summary = "Verify patient identity", description = "Mark patient identity as verified")
    @PreAuthorize("hasRole('MPI_ADMIN') or hasRole('DATA_STEWARD')")
    public ResponseEntity<PatientIdentityResponseDto> verifyPatientIdentity(
            @PathVariable UUID id,
            @RequestParam String verifiedBy) {
        
        logger.info("Verifying patient identity: {}", id);
        
        try {
            PatientIdentityResponseDto result = patientIdentityService.verifyPatientIdentity(id, verifiedBy);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            logger.error("Failed to verify patient identity {}: {}", id, e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    /**
     * Mark identity for verification
     */
    @PostMapping("/identities/{id}/mark-verification")
    @Operation(summary = "Mark for verification", description = "Mark identity as requiring verification")
    @PreAuthorize("hasRole('MPI_ADMIN') or hasRole('DATA_STEWARD')")
    public ResponseEntity<PatientIdentityResponseDto> markForVerification(
            @PathVariable UUID id,
            @RequestParam String reason) {
        
        logger.info("Marking identity for verification: {}", id);
        
        try {
            PatientIdentityResponseDto result = patientIdentityService.markForVerification(id, reason);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            logger.error("Failed to mark identity for verification {}: {}", id, e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    /**
     * Update identity status
     */
    @PatchMapping("/identities/{id}/status")
    @Operation(summary = "Update identity status", description = "Update the status of a patient identity")
    @PreAuthorize("hasRole('MPI_ADMIN')")
    public ResponseEntity<PatientIdentityResponseDto> updateIdentityStatus(
            @PathVariable UUID id,
            @RequestParam IdentityStatus newStatus,
            @RequestParam(required = false) String reason) {
        
        logger.info("Updating identity status for {}: {}", id, newStatus);
        
        try {
            PatientIdentityResponseDto result = patientIdentityService.updateIdentityStatus(id, newStatus, reason);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            logger.error("Failed to update identity status {}: {}", id, e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    /**
     * Update verification status
     */
    @PatchMapping("/identities/{id}/verification-status")
    @Operation(summary = "Update verification status", description = "Update the verification status of a patient identity")
    @PreAuthorize("hasRole('MPI_ADMIN') or hasRole('DATA_STEWARD')")
    public ResponseEntity<PatientIdentityResponseDto> updateVerificationStatus(
            @PathVariable UUID id,
            @RequestParam VerificationStatus newStatus,
            @RequestParam String verifiedBy) {
        
        logger.info("Updating verification status for {}: {}", id, newStatus);
        
        try {
            PatientIdentityResponseDto result = patientIdentityService
                    .updateVerificationStatus(id, newStatus, verifiedBy);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            logger.error("Failed to update verification status {}: {}", id, e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    /**
     * Get linked identities for master patient
     */
    @GetMapping("/master-patients/{masterPatientId}/identities")
    @Operation(summary = "Get linked identities", description = "Get all identities linked to a master patient")
    @PreAuthorize("hasRole('MPI_USER') or hasRole('CLINICAL_STAFF')")
    public ResponseEntity<List<PatientIdentityResponseDto>> getLinkedIdentities(@PathVariable UUID masterPatientId) {
        logger.debug("Getting linked identities for master patient: {}", masterPatientId);
        
        List<PatientIdentityResponseDto> identities = patientIdentityService.getLinkedIdentities(masterPatientId);
        return ResponseEntity.ok(identities);
    }

    /**
     * Get master identity for patient
     */
    @GetMapping("/master-patients/{masterPatientId}/master-identity")
    @Operation(summary = "Get master identity", description = "Get the master identity for a patient")
    @PreAuthorize("hasRole('MPI_USER') or hasRole('CLINICAL_STAFF')")
    public ResponseEntity<PatientIdentityResponseDto> getMasterIdentity(@PathVariable UUID masterPatientId) {
        logger.debug("Getting master identity for patient: {}", masterPatientId);
        
        Optional<PatientIdentityResponseDto> masterIdentity = patientIdentityService.getMasterIdentity(masterPatientId);
        return masterIdentity.map(ResponseEntity::ok)
                            .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get identities by source system
     */
    @GetMapping("/identities/source-system/{sourceSystem}")
    @Operation(summary = "Get identities by source system", description = "Get identities from a specific source system")
    @PreAuthorize("hasRole('MPI_USER') or hasRole('SYSTEM_ADMIN')")
    public ResponseEntity<Page<PatientIdentityResponseDto>> getIdentitiesBySourceSystem(
            @PathVariable String sourceSystem,
            Pageable pageable) {
        
        logger.debug("Getting identities by source system: {}", sourceSystem);
        
        Page<PatientIdentityResponseDto> identities = patientIdentityService
                .getIdentitiesBySourceSystem(sourceSystem, pageable);
        return ResponseEntity.ok(identities);
    }

    /**
     * Get identities requiring verification
     */
    @GetMapping("/identities/requiring-verification")
    @Operation(summary = "Get identities requiring verification", description = "Get all identities that require verification")
    @PreAuthorize("hasRole('MPI_ADMIN') or hasRole('DATA_STEWARD')")
    public ResponseEntity<List<PatientIdentityResponseDto>> getIdentitiesRequiringVerification() {
        logger.debug("Getting identities requiring verification");
        
        List<PatientIdentityResponseDto> identities = patientIdentityService.getIdentitiesRequiringVerification();
        return ResponseEntity.ok(identities);
    }

    /**
     * Get recently created identities
     */
    @GetMapping("/identities/recent")
    @Operation(summary = "Get recent identities", description = "Get recently created identities")
    @PreAuthorize("hasRole('MPI_USER') or hasRole('SYSTEM_ADMIN')")
    public ResponseEntity<List<PatientIdentityResponseDto>> getRecentlyCreatedIdentities(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime since) {
        
        logger.debug("Getting recently created identities since: {}", since);
        
        List<PatientIdentityResponseDto> identities = patientIdentityService.getRecentlyCreatedIdentities(since);
        return ResponseEntity.ok(identities);
    }

    /**
     * Get identities with low data quality
     */
    @GetMapping("/identities/low-quality")
    @Operation(summary = "Get low quality identities", description = "Get identities with low data quality scores")
    @PreAuthorize("hasRole('MPI_ADMIN') or hasRole('DATA_STEWARD')")
    public ResponseEntity<List<PatientIdentityResponseDto>> getLowDataQualityIdentities(
            @RequestParam(defaultValue = "70.0") Double threshold) {
        
        logger.debug("Getting low data quality identities with threshold: {}", threshold);
        
        List<PatientIdentityResponseDto> identities = patientIdentityService.getLowDataQualityIdentities(threshold);
        return ResponseEntity.ok(identities);
    }

    /**
     * Get incomplete identities
     */
    @GetMapping("/identities/incomplete")
    @Operation(summary = "Get incomplete identities", description = "Get identities with low completeness scores")
    @PreAuthorize("hasRole('MPI_ADMIN') or hasRole('DATA_STEWARD')")
    public ResponseEntity<List<PatientIdentityResponseDto>> getIncompleteIdentities(
            @RequestParam(defaultValue = "70.0") Double threshold) {
        
        logger.debug("Getting incomplete identities with threshold: {}", threshold);
        
        List<PatientIdentityResponseDto> identities = patientIdentityService.getIncompleteIdentities(threshold);
        return ResponseEntity.ok(identities);
    }

    /**
     * Get unlinked identities
     */
    @GetMapping("/identities/unlinked")
    @Operation(summary = "Get unlinked identities", description = "Get identities not linked to any master patient")
    @PreAuthorize("hasRole('MPI_ADMIN') or hasRole('DATA_STEWARD')")
    public ResponseEntity<List<PatientIdentityResponseDto>> getUnlinkedIdentities() {
        logger.debug("Getting unlinked identities");
        
        List<PatientIdentityResponseDto> identities = patientIdentityService.getUnlinkedIdentities();
        return ResponseEntity.ok(identities);
    }

    /**
     * Synchronize with FHIR
     */
    @PostMapping("/identities/{id}/fhir-sync")
    @Operation(summary = "Sync with FHIR", description = "Synchronize identity with FHIR server")
    @PreAuthorize("hasRole('MPI_ADMIN') or hasRole('SYSTEM_ADMIN')")
    public ResponseEntity<PatientIdentityResponseDto> syncWithFhir(@PathVariable UUID id) {
        logger.info("Synchronizing identity with FHIR: {}", id);
        
        try {
            PatientIdentityResponseDto result = patientIdentityService.syncWithFhir(id);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            logger.error("Failed to sync identity with FHIR {}: {}", id, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Batch synchronize with FHIR
     */
    @PostMapping("/identities/batch-fhir-sync")
    @Operation(summary = "Batch sync with FHIR", description = "Batch synchronize identities with FHIR server")
    @PreAuthorize("hasRole('MPI_ADMIN') or hasRole('SYSTEM_ADMIN')")
    public ResponseEntity<List<PatientIdentityResponseDto>> batchSyncWithFhir(@RequestBody List<UUID> ids) {
        logger.info("Batch synchronizing {} identities with FHIR", ids.size());
        
        try {
            List<PatientIdentityResponseDto> results = patientIdentityService.batchSyncWithFhir(ids);
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            logger.error("Failed to batch sync identities with FHIR: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Delete patient identity
     */
    @DeleteMapping("/identities/{id}")
    @Operation(summary = "Delete patient identity", description = "Soft delete a patient identity")
    @PreAuthorize("hasRole('MPI_ADMIN')")
    public ResponseEntity<Void> deletePatientIdentity(
            @PathVariable UUID id,
            @RequestParam String deletedBy) {
        
        logger.info("Deleting patient identity: {}", id);
        
        try {
            patientIdentityService.deletePatientIdentity(id, deletedBy);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            logger.error("Failed to delete patient identity {}: {}", id, e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    /**
     * Restore patient identity
     */
    @PostMapping("/identities/{id}/restore")
    @Operation(summary = "Restore patient identity", description = "Restore a deleted patient identity")
    @PreAuthorize("hasRole('MPI_ADMIN')")
    public ResponseEntity<PatientIdentityResponseDto> restorePatientIdentity(
            @PathVariable UUID id,
            @RequestParam String restoredBy) {
        
        logger.info("Restoring patient identity: {}", id);
        
        try {
            PatientIdentityResponseDto result = patientIdentityService.restorePatientIdentity(id, restoredBy);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            logger.error("Failed to restore patient identity {}: {}", id, e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    /**
     * Get identity statistics
     */
    @GetMapping("/statistics")
    @Operation(summary = "Get identity statistics", description = "Get comprehensive identity management statistics")
    @PreAuthorize("hasRole('MPI_ADMIN') or hasRole('SYSTEM_ADMIN')")
    public ResponseEntity<Map<String, Object>> getIdentityStatistics() {
        logger.debug("Getting identity statistics");
        
        Map<String, Object> statistics = Map.of(
            "averageConfidenceScore", patientIdentityService.getAverageConfidenceScore(),
            "averageDataQualityScore", patientIdentityService.getAverageDataQualityScore(),
            "activeIdentitiesCount", patientIdentityService.getIdentityCountByStatus(IdentityStatus.ACTIVE),
            "mergedIdentitiesCount", patientIdentityService.getIdentityCountByStatus(IdentityStatus.MERGED),
            "duplicateIdentitiesCount", patientIdentityService.getIdentityCountByStatus(IdentityStatus.DUPLICATE),
            "archivedIdentitiesCount", patientIdentityService.getIdentityCountByStatus(IdentityStatus.ARCHIVED)
        );
        
        return ResponseEntity.ok(statistics);
    }

    /**
     * Generate identity management report
     */
    @GetMapping("/reports")
    @Operation(summary = "Generate identity report", description = "Generate comprehensive identity management report")
    @PreAuthorize("hasRole('MPI_ADMIN') or hasRole('SYSTEM_ADMIN')")
    public ResponseEntity<Object> generateIdentityReport(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime toDate) {
        
        logger.info("Generating identity management report from {} to {}", fromDate, toDate);
        
        try {
            Object report = patientIdentityService.generateIdentityReport(fromDate, toDate);
            return ResponseEntity.ok(report);
        } catch (Exception e) {
            logger.error("Failed to generate identity report: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Perform data quality checks
     */
    @PostMapping("/data-quality-checks")
    @Operation(summary = "Perform data quality checks", description = "Perform data quality checks on all identities")
    @PreAuthorize("hasRole('MPI_ADMIN')")
    public ResponseEntity<Void> performDataQualityChecks() {
        logger.info("Performing data quality checks");
        
        try {
            patientIdentityService.performDataQualityChecks();
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            logger.error("Failed to perform data quality checks: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Perform deduplication
     */
    @PostMapping("/deduplication")
    @Operation(summary = "Perform deduplication", description = "Perform identity deduplication process")
    @PreAuthorize("hasRole('MPI_ADMIN')")
    public ResponseEntity<Void> performDeduplication() {
        logger.info("Performing identity deduplication");
        
        try {
            patientIdentityService.performDeduplication();
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            logger.error("Failed to perform deduplication: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Import identities from external system
     */
    @PostMapping("/identities/import")
    @Operation(summary = "Import identities", description = "Import patient identities from external system")
    @PreAuthorize("hasRole('MPI_ADMIN') or hasRole('SYSTEM_ADMIN')")
    public ResponseEntity<List<PatientIdentityResponseDto>> importIdentities(
            @RequestBody List<PatientIdentityCreateRequestDto> identities,
            @RequestParam String sourceSystem) {
        
        logger.info("Importing {} identities from source system: {}", identities.size(), sourceSystem);
        
        try {
            List<PatientIdentityResponseDto> results = patientIdentityService.importIdentities(identities, sourceSystem);
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            logger.error("Failed to import identities: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    /**
     * Export identities for external system
     */
    @GetMapping("/identities/export")
    @Operation(summary = "Export identities", description = "Export patient identities for external system")
    @PreAuthorize("hasRole('MPI_ADMIN') or hasRole('SYSTEM_ADMIN')")
    public ResponseEntity<List<PatientIdentityResponseDto>> exportIdentities(
            @RequestParam String sourceSystem,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime since) {
        
        logger.info("Exporting identities for source system: {} since: {}", sourceSystem, since);
        
        try {
            List<PatientIdentityResponseDto> identities = patientIdentityService.exportIdentities(sourceSystem, since);
            return ResponseEntity.ok(identities);
        } catch (Exception e) {
            logger.error("Failed to export identities: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
