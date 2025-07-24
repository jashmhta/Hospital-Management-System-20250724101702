package com.hospital.hms.mpiintegration.service.impl;

import com.hospital.hms.mpiintegration.dto.PatientIdentityCreateRequestDto;
import com.hospital.hms.mpiintegration.dto.PatientIdentityResponseDto;
import com.hospital.hms.mpiintegration.entity.*;
import com.hospital.hms.mpiintegration.mapper.PatientIdentityMapper;
import com.hospital.hms.mpiintegration.repository.PatientIdentityRepository;
import com.hospital.hms.mpiintegration.service.PatientIdentityService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;

/**
 * Implementation of PatientIdentityService for Master Patient Index operations
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Service
@Transactional
public class PatientIdentityServiceImpl implements PatientIdentityService {

    private static final Logger logger = LoggerFactory.getLogger(PatientIdentityServiceImpl.class);
    
    private static final String MPI_PREFIX = "MPI";
    private static final Double DEFAULT_CONFIDENCE_THRESHOLD = 85.0;
    private static final Double DEFAULT_DATA_QUALITY_THRESHOLD = 70.0;
    
    @Autowired
    private PatientIdentityRepository patientIdentityRepository;
    
    @Autowired
    private PatientIdentityMapper patientIdentityMapper;

    @Override
    @Transactional
    @CacheEvict(value = "patientIdentities", allEntries = true)
    public PatientIdentityResponseDto createPatientIdentity(PatientIdentityCreateRequestDto requestDto) {
        logger.info("Creating new patient identity for external ID: {} from system: {}", 
                   requestDto.getExternalPatientId(), requestDto.getSourceSystem());
        
        // Validate the request
        validatePatientIdentity(requestDto);
        
        // Check for existing identity with same external ID and source system
        Optional<PatientIdentity> existingIdentity = patientIdentityRepository
                .findByExternalPatientIdAndSourceSystem(requestDto.getExternalPatientId(), requestDto.getSourceSystem());
        
        if (existingIdentity.isPresent()) {
            throw new IllegalArgumentException("Patient identity already exists for external ID: " + 
                                             requestDto.getExternalPatientId() + " in system: " + requestDto.getSourceSystem());
        }
        
        // Convert DTO to entity
        PatientIdentity identity = patientIdentityMapper.toEntity(requestDto);
        
        // Generate MPI ID
        identity.setMpiId(generateMpiId());
        
        // Set initial verification status based on auto-verify flag
        if (requestDto.getAutoVerify() != null && requestDto.getAutoVerify()) {
            identity.setVerificationStatus(VerificationStatus.AUTO_VERIFIED);
            identity.setVerificationDate(LocalDateTime.now());
            identity.setVerifiedBy("SYSTEM");
        }
        
        // Calculate initial scores
        identity.setConfidenceScore(calculateConfidenceScore(identity));
        identity.setDataQualityScore(calculateDataQualityScore(identity));
        identity.setCompletenessScore(calculateCompletenessScore(identity));
        
        // Set FHIR last updated if FHIR patient ID is provided
        if (StringUtils.hasText(requestDto.getFhirPatientId())) {
            identity.setFhirLastUpdated(LocalDateTime.now());
        }
        
        // Save the identity
        PatientIdentity savedIdentity = patientIdentityRepository.save(identity);
        
        logger.info("Created patient identity with MPI ID: {}", savedIdentity.getMpiId());
        
        // Perform identity matching asynchronously
        try {
            performIdentityMatching(savedIdentity.getId());
        } catch (Exception e) {
            logger.warn("Identity matching failed for MPI ID: {}, Error: {}", savedIdentity.getMpiId(), e.getMessage());
        }
        
        return patientIdentityMapper.toResponseDto(savedIdentity);
    }

    @Override
    @Transactional
    @CacheEvict(value = "patientIdentities", key = "#id")
    public PatientIdentityResponseDto updatePatientIdentity(UUID id, PatientIdentityCreateRequestDto requestDto) {
        logger.info("Updating patient identity with ID: {}", id);
        
        // Validate the request
        validatePatientIdentity(requestDto);
        
        // Find existing identity
        PatientIdentity existingIdentity = patientIdentityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient identity not found with ID: " + id));
        
        // Update entity from DTO
        patientIdentityMapper.updateEntityFromDto(requestDto, existingIdentity);
        
        // Recalculate scores
        existingIdentity.setConfidenceScore(calculateConfidenceScore(existingIdentity));
        existingIdentity.setDataQualityScore(calculateDataQualityScore(existingIdentity));
        existingIdentity.setCompletenessScore(calculateCompletenessScore(existingIdentity));
        
        // Update FHIR timestamp if FHIR data changed
        if (StringUtils.hasText(requestDto.getFhirPatientId()) && 
            !Objects.equals(requestDto.getFhirPatientId(), existingIdentity.getFhirPatientId())) {
            existingIdentity.setFhirLastUpdated(LocalDateTime.now());
        }
        
        // Save updated identity
        PatientIdentity updatedIdentity = patientIdentityRepository.save(existingIdentity);
        
        logger.info("Updated patient identity with MPI ID: {}", updatedIdentity.getMpiId());
        
        return patientIdentityMapper.toResponseDto(updatedIdentity);
    }

    @Override
    @Cacheable(value = "patientIdentities", key = "#id")
    public Optional<PatientIdentityResponseDto> getPatientIdentityById(UUID id) {
        logger.debug("Retrieving patient identity by ID: {}", id);
        
        // Track access
        trackAccess(id);
        
        return patientIdentityRepository.findById(id)
                .map(patientIdentityMapper::toResponseDto);
    }

    @Override
    @Cacheable(value = "patientIdentities", key = "#mpiId")
    public Optional<PatientIdentityResponseDto> getPatientIdentityByMpiId(String mpiId) {
        logger.debug("Retrieving patient identity by MPI ID: {}", mpiId);
        
        Optional<PatientIdentity> identity = patientIdentityRepository.findByMpiId(mpiId);
        if (identity.isPresent()) {
            trackAccess(identity.get().getId());
        }
        
        return identity.map(patientIdentityMapper::toResponseDto);
    }

    @Override
    public Optional<PatientIdentityResponseDto> getPatientIdentityByExternalId(String externalPatientId, String sourceSystem) {
        logger.debug("Retrieving patient identity by external ID: {} from system: {}", externalPatientId, sourceSystem);
        
        Optional<PatientIdentity> identity = patientIdentityRepository
                .findByExternalPatientIdAndSourceSystem(externalPatientId, sourceSystem);
        if (identity.isPresent()) {
            trackAccess(identity.get().getId());
        }
        
        return identity.map(patientIdentityMapper::toResponseDto);
    }

    @Override
    public Optional<PatientIdentityResponseDto> getPatientIdentityByFhirId(String fhirPatientId) {
        logger.debug("Retrieving patient identity by FHIR ID: {}", fhirPatientId);
        
        Optional<PatientIdentity> identity = patientIdentityRepository.findByFhirPatientId(fhirPatientId);
        if (identity.isPresent()) {
            trackAccess(identity.get().getId());
        }
        
        return identity.map(patientIdentityMapper::toResponseDto);
    }

    @Override
    public List<PatientIdentityResponseDto> searchByDemographics(String firstName, String lastName, LocalDate dateOfBirth) {
        logger.debug("Searching patient identities by demographics: {} {}, DOB: {}", firstName, lastName, dateOfBirth);
        
        List<PatientIdentity> identities = patientIdentityRepository.findByDemographics(firstName, lastName, dateOfBirth);
        return patientIdentityMapper.toResponseDtoList(identities);
    }

    @Override
    public List<PatientIdentityResponseDto> fuzzySearch(String firstName, String lastName, LocalDate dateOfBirth) {
        logger.debug("Performing fuzzy search for: {} {}, DOB: {}", firstName, lastName, dateOfBirth);
        
        List<PatientIdentity> identities = patientIdentityRepository
                .findByFuzzyNameAndDateOfBirth(firstName, lastName, dateOfBirth);
        return patientIdentityMapper.toResponseDtoList(identities);
    }

    @Override
    public Page<PatientIdentityResponseDto> advancedSearch(String firstName, String lastName, LocalDate dateOfBirth,
                                                          String ssn, String sourceSystem, IdentityStatus identityStatus,
                                                          Pageable pageable) {
        logger.debug("Performing advanced search with multiple criteria");
        
        Page<PatientIdentity> identities = patientIdentityRepository.findByMultipleCriteria(
                firstName, lastName, dateOfBirth, ssn, sourceSystem, identityStatus, pageable);
        
        return identities.map(patientIdentityMapper::toResponseDto);
    }

    @Override
    public List<PatientIdentityResponseDto> findPotentialDuplicates(UUID excludeId, String firstName, String lastName,
                                                                   String ssn, String email) {
        logger.debug("Finding potential duplicates for identity: {}", excludeId);
        
        List<PatientIdentity> duplicates = patientIdentityRepository
                .findPotentialDuplicates(excludeId, firstName, lastName, ssn, email);
        return patientIdentityMapper.toResponseDtoList(duplicates);
    }

    @Override
    public List<PatientIdentityResponseDto> findMatchingCandidates(UUID excludeId, String firstName, String lastName,
                                                                  LocalDate dateOfBirth, String ssn) {
        logger.debug("Finding matching candidates for identity: {}", excludeId);
        
        List<PatientIdentity> candidates = patientIdentityRepository
                .findMatchingCandidates(excludeId, firstName, lastName, dateOfBirth, ssn);
        return patientIdentityMapper.toResponseDtoList(candidates);
    }

    @Override
    @Transactional
    public void performIdentityMatching(UUID patientIdentityId) {
        logger.info("Performing identity matching for patient ID: {}", patientIdentityId);
        
        PatientIdentity identity = patientIdentityRepository.findById(patientIdentityId)
                .orElseThrow(() -> new RuntimeException("Patient identity not found: " + patientIdentityId));
        
        // Find matching candidates
        List<PatientIdentity> candidates = patientIdentityRepository.findMatchingCandidates(
                identity.getId(), identity.getFirstName(), identity.getLastName(), 
                identity.getDateOfBirth(), identity.getSsn());
        
        // Create match records for high-confidence matches
        for (PatientIdentity candidate : candidates) {
            double matchScore = calculateMatchScore(identity, candidate);
            
            if (matchScore >= DEFAULT_CONFIDENCE_THRESHOLD) {
                IdentityMatch match = new IdentityMatch();
                match.setPatientIdentity(identity);
                match.setCandidateIdentityId(candidate.getId());
                match.setMatchScore(matchScore);
                match.setMatchAlgorithm("DEMOGRAPHIC_FUZZY");
                match.setMatchType(MatchType.PROBABILISTIC);
                match.setIsAutoMatch(true);
                match.setCreatedBy("SYSTEM");
                
                if (matchScore >= 95.0) {
                    match.setMatchStatus(MatchStatus.AUTO_CONFIRMED);
                } else {
                    match.setMatchStatus(MatchStatus.PENDING);
                }
                
                identity.getIdentityMatches().add(match);
            }
        }
        
        patientIdentityRepository.save(identity);
        logger.info("Identity matching completed for patient ID: {}, found {} potential matches", 
                   patientIdentityId, candidates.size());
    }

    @Override
    @Transactional
    @CacheEvict(value = "patientIdentities", allEntries = true)
    public PatientIdentityResponseDto mergePatientIdentities(UUID masterIdentityId, UUID duplicateIdentityId, String mergedBy) {
        logger.info("Merging patient identities: master={}, duplicate={}", masterIdentityId, duplicateIdentityId);
        
        PatientIdentity masterIdentity = patientIdentityRepository.findById(masterIdentityId)
                .orElseThrow(() -> new RuntimeException("Master identity not found: " + masterIdentityId));
        
        PatientIdentity duplicateIdentity = patientIdentityRepository.findById(duplicateIdentityId)
                .orElseThrow(() -> new RuntimeException("Duplicate identity not found: " + duplicateIdentityId));
        
        // Mark duplicate as merged
        duplicateIdentity.setIdentityStatus(IdentityStatus.MERGED);
        duplicateIdentity.setMasterPatientId(masterIdentity.getMasterPatientId() != null ? 
                                           masterIdentity.getMasterPatientId() : masterIdentity.getId());
        duplicateIdentity.setLastModifiedBy(mergedBy);
        
        // Mark master as master identity if not already
        if (!Boolean.TRUE.equals(masterIdentity.getIsMasterIdentity())) {
            masterIdentity.setIsMasterIdentity(true);
            if (masterIdentity.getMasterPatientId() == null) {
                masterIdentity.setMasterPatientId(masterIdentity.getId());
            }
        }
        
        // Update confidence and data quality scores
        masterIdentity.setConfidenceScore(Math.max(masterIdentity.getConfidenceScore() != null ? 
                                                 masterIdentity.getConfidenceScore() : 0.0,
                                                 duplicateIdentity.getConfidenceScore() != null ? 
                                                 duplicateIdentity.getConfidenceScore() : 0.0));
        
        patientIdentityRepository.save(masterIdentity);
        patientIdentityRepository.save(duplicateIdentity);
        
        logger.info("Successfully merged patient identities");
        return patientIdentityMapper.toResponseDto(masterIdentity);
    }

    @Override
    @Transactional
    @CacheEvict(value = "patientIdentities", key = "#identityId")
    public PatientIdentityResponseDto linkToMasterPatient(UUID identityId, UUID masterPatientId) {
        logger.info("Linking identity {} to master patient {}", identityId, masterPatientId);
        
        PatientIdentity identity = patientIdentityRepository.findById(identityId)
                .orElseThrow(() -> new RuntimeException("Patient identity not found: " + identityId));
        
        identity.setMasterPatientId(masterPatientId);
        identity.setIsMasterIdentity(false);
        
        PatientIdentity savedIdentity = patientIdentityRepository.save(identity);
        return patientIdentityMapper.toResponseDto(savedIdentity);
    }

    @Override
    @Transactional
    @CacheEvict(value = "patientIdentities", key = "#identityId")
    public PatientIdentityResponseDto unlinkFromMasterPatient(UUID identityId) {
        logger.info("Unlinking identity {} from master patient", identityId);
        
        PatientIdentity identity = patientIdentityRepository.findById(identityId)
                .orElseThrow(() -> new RuntimeException("Patient identity not found: " + identityId));
        
        identity.setMasterPatientId(null);
        identity.setIsMasterIdentity(false);
        
        PatientIdentity savedIdentity = patientIdentityRepository.save(identity);
        return patientIdentityMapper.toResponseDto(savedIdentity);
    }

    @Override
    @Transactional
    @CacheEvict(value = "patientIdentities", key = "#id")
    public PatientIdentityResponseDto verifyPatientIdentity(UUID id, String verifiedBy) {
        logger.info("Verifying patient identity: {}", id);
        
        PatientIdentity identity = patientIdentityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient identity not found: " + id));
        
        identity.setVerificationStatus(VerificationStatus.MANUALLY_VERIFIED);
        identity.setVerificationDate(LocalDateTime.now());
        identity.setVerifiedBy(verifiedBy);
        identity.setAccuracyValidated(true);
        
        // Increase confidence score for verified identities
        if (identity.getConfidenceScore() != null) {
            identity.setConfidenceScore(Math.min(100.0, identity.getConfidenceScore() + 10.0));
        }
        
        PatientIdentity savedIdentity = patientIdentityRepository.save(identity);
        return patientIdentityMapper.toResponseDto(savedIdentity);
    }

    @Override
    @Transactional
    @CacheEvict(value = "patientIdentities", key = "#id")
    public PatientIdentityResponseDto markForVerification(UUID id, String reason) {
        logger.info("Marking patient identity for verification: {}", id);
        
        PatientIdentity identity = patientIdentityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient identity not found: " + id));
        
        identity.setVerificationStatus(VerificationStatus.VERIFICATION_REQUIRED);
        
        PatientIdentity savedIdentity = patientIdentityRepository.save(identity);
        return patientIdentityMapper.toResponseDto(savedIdentity);
    }

    @Override
    @Transactional
    @CacheEvict(value = "patientIdentities", key = "#id")
    public PatientIdentityResponseDto updateIdentityStatus(UUID id, IdentityStatus newStatus, String reason) {
        logger.info("Updating identity status for {}: {}", id, newStatus);
        
        PatientIdentity identity = patientIdentityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient identity not found: " + id));
        
        identity.setIdentityStatus(newStatus);
        
        PatientIdentity savedIdentity = patientIdentityRepository.save(identity);
        return patientIdentityMapper.toResponseDto(savedIdentity);
    }

    @Override
    @Transactional
    @CacheEvict(value = "patientIdentities", key = "#id")
    public PatientIdentityResponseDto updateVerificationStatus(UUID id, VerificationStatus newStatus, String verifiedBy) {
        logger.info("Updating verification status for {}: {}", id, newStatus);
        
        PatientIdentity identity = patientIdentityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient identity not found: " + id));
        
        identity.setVerificationStatus(newStatus);
        if (newStatus == VerificationStatus.VERIFIED || newStatus == VerificationStatus.MANUALLY_VERIFIED) {
            identity.setVerificationDate(LocalDateTime.now());
            identity.setVerifiedBy(verifiedBy);
        }
        
        PatientIdentity savedIdentity = patientIdentityRepository.save(identity);
        return patientIdentityMapper.toResponseDto(savedIdentity);
    }

    @Override
    @Transactional
    @CacheEvict(value = "patientIdentities", key = "#id")
    public PatientIdentityResponseDto updateConfidenceScore(UUID id) {
        logger.debug("Updating confidence score for identity: {}", id);
        
        PatientIdentity identity = patientIdentityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient identity not found: " + id));
        
        identity.setConfidenceScore(calculateConfidenceScore(identity));
        
        PatientIdentity savedIdentity = patientIdentityRepository.save(identity);
        return patientIdentityMapper.toResponseDto(savedIdentity);
    }

    @Override
    @Transactional
    @CacheEvict(value = "patientIdentities", key = "#id")
    public PatientIdentityResponseDto updateDataQualityScores(UUID id) {
        logger.debug("Updating data quality scores for identity: {}", id);
        
        PatientIdentity identity = patientIdentityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient identity not found: " + id));
        
        identity.setDataQualityScore(calculateDataQualityScore(identity));
        identity.setCompletenessScore(calculateCompletenessScore(identity));
        
        PatientIdentity savedIdentity = patientIdentityRepository.save(identity);
        return patientIdentityMapper.toResponseDto(savedIdentity);
    }

    @Override
    public List<PatientIdentityResponseDto> getLinkedIdentities(UUID masterPatientId) {
        logger.debug("Getting linked identities for master patient: {}", masterPatientId);
        
        List<PatientIdentity> identities = patientIdentityRepository.findByMasterPatientId(masterPatientId);
        return patientIdentityMapper.toResponseDtoList(identities);
    }

    @Override
    public Optional<PatientIdentityResponseDto> getMasterIdentity(UUID masterPatientId) {
        logger.debug("Getting master identity for patient: {}", masterPatientId);
        
        List<PatientIdentity> identities = patientIdentityRepository.findByMasterPatientId(masterPatientId);
        Optional<PatientIdentity> masterIdentity = identities.stream()
                .filter(identity -> Boolean.TRUE.equals(identity.getIsMasterIdentity()))
                .findFirst();
        
        return masterIdentity.map(patientIdentityMapper::toResponseDto);
    }

    @Override
    public Page<PatientIdentityResponseDto> getIdentitiesBySourceSystem(String sourceSystem, Pageable pageable) {
        logger.debug("Getting identities by source system: {}", sourceSystem);
        
        Page<PatientIdentity> identities = patientIdentityRepository.findBySourceSystem(sourceSystem, pageable);
        return identities.map(patientIdentityMapper::toResponseDto);
    }

    @Override
    public List<PatientIdentityResponseDto> getIdentitiesRequiringVerification() {
        logger.debug("Getting identities requiring verification");
        
        List<PatientIdentity> identities = patientIdentityRepository.findIdentitiesRequiringVerification();
        return patientIdentityMapper.toResponseDtoList(identities);
    }

    @Override
    public List<PatientIdentityResponseDto> getRecentlyCreatedIdentities(LocalDateTime since) {
        logger.debug("Getting recently created identities since: {}", since);
        
        List<PatientIdentity> identities = patientIdentityRepository.findRecentlyCreated(since);
        return patientIdentityMapper.toResponseDtoList(identities);
    }

    @Override
    public List<PatientIdentityResponseDto> getLowDataQualityIdentities(Double threshold) {
        logger.debug("Getting low data quality identities with threshold: {}", threshold);
        
        List<PatientIdentity> identities = patientIdentityRepository.findLowDataQuality(threshold);
        return patientIdentityMapper.toResponseDtoList(identities);
    }

    @Override
    public List<PatientIdentityResponseDto> getIncompleteIdentities(Double threshold) {
        logger.debug("Getting incomplete identities with threshold: {}", threshold);
        
        List<PatientIdentity> identities = patientIdentityRepository.findIncompleteIdentities(threshold);
        return patientIdentityMapper.toResponseDtoList(identities);
    }

    @Override
    public List<PatientIdentityResponseDto> getUnlinkedIdentities() {
        logger.debug("Getting unlinked identities");
        
        List<PatientIdentity> identities = patientIdentityRepository.findUnlinkedIdentities();
        return patientIdentityMapper.toResponseDtoList(identities);
    }

    @Override
    public List<PatientIdentityResponseDto> getIdentitiesRequiringFhirSync(LocalDateTime since) {
        logger.debug("Getting identities requiring FHIR sync since: {}", since);
        
        List<PatientIdentity> identities = patientIdentityRepository.findRequiringFhirSync(since);
        return patientIdentityMapper.toResponseDtoList(identities);
    }

    @Override
    @Transactional
    @CacheEvict(value = "patientIdentities", key = "#id")
    public PatientIdentityResponseDto syncWithFhir(UUID id) {
        logger.info("Synchronizing identity with FHIR: {}", id);
        
        PatientIdentity identity = patientIdentityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient identity not found: " + id));
        
        // TODO: Implement actual FHIR synchronization logic
        identity.setFhirLastUpdated(LocalDateTime.now());
        
        PatientIdentity savedIdentity = patientIdentityRepository.save(identity);
        return patientIdentityMapper.toResponseDto(savedIdentity);
    }

    @Override
    @Transactional
    public List<PatientIdentityResponseDto> batchSyncWithFhir(List<UUID> ids) {
        logger.info("Batch synchronizing {} identities with FHIR", ids.size());
        
        List<PatientIdentityResponseDto> results = new ArrayList<>();
        for (UUID id : ids) {
            try {
                results.add(syncWithFhir(id));
            } catch (Exception e) {
                logger.error("Failed to sync identity {} with FHIR: {}", id, e.getMessage());
            }
        }
        
        return results;
    }

    @Override
    @Transactional
    @CacheEvict(value = "patientIdentities", key = "#id")
    public void deletePatientIdentity(UUID id, String deletedBy) {
        logger.info("Deleting patient identity: {}", id);
        
        PatientIdentity identity = patientIdentityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient identity not found: " + id));
        
        identity.setIdentityStatus(IdentityStatus.ARCHIVED);
        identity.setLastModifiedBy(deletedBy);
        
        patientIdentityRepository.save(identity);
    }

    @Override
    @Transactional
    @CacheEvict(value = "patientIdentities", key = "#id")
    public PatientIdentityResponseDto restorePatientIdentity(UUID id, String restoredBy) {
        logger.info("Restoring patient identity: {}", id);
        
        PatientIdentity identity = patientIdentityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient identity not found: " + id));
        
        identity.setIdentityStatus(IdentityStatus.ACTIVE);
        identity.setLastModifiedBy(restoredBy);
        
        PatientIdentity savedIdentity = patientIdentityRepository.save(identity);
        return patientIdentityMapper.toResponseDto(savedIdentity);
    }

    // Statistics methods
    @Override
    public long getIdentityCountBySourceSystem(String sourceSystem) {
        return patientIdentityRepository.countBySourceSystem(sourceSystem);
    }

    @Override
    public long getIdentityCountByStatus(IdentityStatus status) {
        return patientIdentityRepository.countByIdentityStatus(status);
    }

    @Override
    public Double getAverageConfidenceScore() {
        return patientIdentityRepository.averageConfidenceScore();
    }

    @Override
    public Double getAverageDataQualityScore() {
        return patientIdentityRepository.averageDataQualityScore();
    }

    // Utility methods
    @Override
    public String generateMpiId() {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        int randomSuffix = ThreadLocalRandom.current().nextInt(1000, 9999);
        return MPI_PREFIX + timestamp + randomSuffix;
    }

    @Override
    public void validatePatientIdentity(PatientIdentityCreateRequestDto requestDto) {
        if (!StringUtils.hasText(requestDto.getExternalPatientId())) {
            throw new IllegalArgumentException("External patient ID is required");
        }
        if (!StringUtils.hasText(requestDto.getSourceSystem())) {
            throw new IllegalArgumentException("Source system is required");
        }
        if (!StringUtils.hasText(requestDto.getFirstName())) {
            throw new IllegalArgumentException("First name is required");
        }
        if (!StringUtils.hasText(requestDto.getLastName())) {
            throw new IllegalArgumentException("Last name is required");
        }
        if (requestDto.getDateOfBirth() == null) {
            throw new IllegalArgumentException("Date of birth is required");
        }
        if (requestDto.getDateOfBirth().isAfter(LocalDate.now())) {
            throw new IllegalArgumentException("Date of birth cannot be in the future");
        }
    }

    @Override
    public Double calculateConfidenceScore(PatientIdentity identity) {
        double score = 0.0;
        
        // Base score for required fields
        if (StringUtils.hasText(identity.getFirstName())) score += 15;
        if (StringUtils.hasText(identity.getLastName())) score += 15;
        if (identity.getDateOfBirth() != null) score += 20;
        
        // Additional score for optional but important fields
        if (StringUtils.hasText(identity.getSsn())) score += 25;
        if (StringUtils.hasText(identity.getEmail())) score += 10;
        if (StringUtils.hasText(identity.getPhoneMobile()) || StringUtils.hasText(identity.getPhoneHome())) score += 10;
        if (StringUtils.hasText(identity.getAddressLine1())) score += 5;
        
        return Math.min(100.0, score);
    }

    @Override
    public Double calculateDataQualityScore(PatientIdentity identity) {
        double score = 0.0;
        int totalFields = 0;
        int completedFields = 0;
        
        // Check required fields
        String[] requiredFields = {identity.getFirstName(), identity.getLastName(), 
                                 identity.getExternalPatientId(), identity.getSourceSystem()};
        for (String field : requiredFields) {
            totalFields++;
            if (StringUtils.hasText(field)) {
                completedFields++;
                score += 20; // Required fields have higher weight
            }
        }
        
        // Check date fields
        if (identity.getDateOfBirth() != null) {
            totalFields++;
            completedFields++;
            score += 20;
        }
        
        // Check optional fields
        String[] optionalFields = {identity.getMiddleName(), identity.getSsn(), identity.getMrn(),
                                 identity.getEmail(), identity.getPhoneHome(), identity.getPhoneMobile(),
                                 identity.getAddressLine1(), identity.getCity(), identity.getState()};
        for (String field : optionalFields) {
            totalFields++;
            if (StringUtils.hasText(field)) {
                completedFields++;
                score += 2; // Optional fields have lower weight
            }
        }
        
        return Math.min(100.0, score);
    }

    @Override
    public Double calculateCompletenessScore(PatientIdentity identity) {
        int totalFields = 0;
        int completedFields = 0;
        
        // Count all fields
        String[] allStringFields = {
            identity.getFirstName(), identity.getMiddleName(), identity.getLastName(),
            identity.getSsn(), identity.getMrn(), identity.getEmail(),
            identity.getPhoneHome(), identity.getPhoneMobile(), identity.getPhoneWork(),
            identity.getAddressLine1(), identity.getAddressLine2(), identity.getCity(),
            identity.getState(), identity.getPostalCode(), identity.getCountry()
        };
        
        for (String field : allStringFields) {
            totalFields++;
            if (StringUtils.hasText(field)) {
                completedFields++;
            }
        }
        
        // Count date fields
        if (identity.getDateOfBirth() != null) {
            totalFields++;
            completedFields++;
        }
        
        // Count enum fields
        if (identity.getGender() != null) {
            totalFields++;
            completedFields++;
        }
        
        return totalFields > 0 ? (completedFields * 100.0 / totalFields) : 0.0;
    }

    @Override
    @Transactional
    public void trackAccess(UUID id) {
        try {
            patientIdentityRepository.updateAccessTracking(id, LocalDateTime.now());
        } catch (Exception e) {
            logger.warn("Failed to track access for identity {}: {}", id, e.getMessage());
        }
    }

    @Override
    @Transactional
    public void createIdentityAlias(UUID identityId, String aliasType, String firstName, String lastName, String reason) {
        logger.info("Creating identity alias for identity: {}", identityId);
        
        PatientIdentity identity = patientIdentityRepository.findById(identityId)
                .orElseThrow(() -> new RuntimeException("Patient identity not found: " + identityId));
        
        IdentityAlias alias = new IdentityAlias();
        alias.setPatientIdentity(identity);
        alias.setAliasType(AliasType.valueOf(aliasType));
        alias.setAliasFirstName(firstName);
        alias.setAliasLastName(lastName);
        alias.setFullAliasName(firstName + " " + lastName);
        alias.setReason(reason);
        alias.setEffectiveDate(LocalDateTime.now());
        alias.setCreatedBy("SYSTEM");
        
        identity.getIdentityAliases().add(alias);
        patientIdentityRepository.save(identity);
    }

    @Override
    @Transactional
    public void removeIdentityAlias(UUID identityId, UUID aliasId) {
        logger.info("Removing identity alias {} for identity: {}", aliasId, identityId);
        
        PatientIdentity identity = patientIdentityRepository.findById(identityId)
                .orElseThrow(() -> new RuntimeException("Patient identity not found: " + identityId));
        
        identity.getIdentityAliases().removeIf(alias -> alias.getId().equals(aliasId));
        patientIdentityRepository.save(identity);
    }

    @Override
    @Transactional
    public void confirmIdentityMatch(UUID matchId, String confirmedBy) {
        // TODO: Implement identity match confirmation logic
        logger.info("Confirming identity match: {} by {}", matchId, confirmedBy);
    }

    @Override
    @Transactional
    public void rejectIdentityMatch(UUID matchId, String rejectedBy, String reason) {
        // TODO: Implement identity match rejection logic
        logger.info("Rejecting identity match: {} by {} for reason: {}", matchId, rejectedBy, reason);
    }

    @Override
    @Transactional
    public void autoResolveMatches(Double confidenceThreshold) {
        // TODO: Implement auto-resolution of identity matches
        logger.info("Auto-resolving matches with confidence threshold: {}", confidenceThreshold);
    }

    @Override
    public List<PatientIdentityResponseDto> exportIdentities(String sourceSystem, LocalDateTime since) {
        logger.info("Exporting identities for source system: {} since: {}", sourceSystem, since);
        
        List<PatientIdentity> identities = patientIdentityRepository.findBySourceSystem(sourceSystem);
        if (since != null) {
            identities = identities.stream()
                    .filter(identity -> identity.getLastModifiedDate() == null || 
                           identity.getLastModifiedDate().isAfter(since))
                    .collect(Collectors.toList());
        }
        
        return patientIdentityMapper.toResponseDtoList(identities);
    }

    @Override
    @Transactional
    public List<PatientIdentityResponseDto> importIdentities(List<PatientIdentityCreateRequestDto> identities, String sourceSystem) {
        logger.info("Importing {} identities for source system: {}", identities.size(), sourceSystem);
        
        List<PatientIdentityResponseDto> results = new ArrayList<>();
        for (PatientIdentityCreateRequestDto requestDto : identities) {
            try {
                requestDto.setSourceSystem(sourceSystem);
                results.add(createPatientIdentity(requestDto));
            } catch (Exception e) {
                logger.error("Failed to import identity for external ID {}: {}", 
                           requestDto.getExternalPatientId(), e.getMessage());
            }
        }
        
        return results;
    }

    @Override
    @Transactional
    public void performDataQualityChecks() {
        logger.info("Performing data quality checks on all identities");
        
        List<PatientIdentity> allIdentities = patientIdentityRepository.findAll();
        for (PatientIdentity identity : allIdentities) {
            identity.setDataQualityScore(calculateDataQualityScore(identity));
            identity.setCompletenessScore(calculateCompletenessScore(identity));
        }
        
        patientIdentityRepository.saveAll(allIdentities);
        logger.info("Data quality checks completed for {} identities", allIdentities.size());
    }

    @Override
    @Transactional
    public void performDeduplication() {
        logger.info("Performing identity deduplication process");
        
        List<PatientIdentity> activeIdentities = patientIdentityRepository.findByIdentityStatus(IdentityStatus.ACTIVE);
        
        for (PatientIdentity identity : activeIdentities) {
            performIdentityMatching(identity.getId());
        }
        
        logger.info("Deduplication process completed for {} identities", activeIdentities.size());
    }

    @Override
    public Object generateIdentityReport(LocalDateTime fromDate, LocalDateTime toDate) {
        logger.info("Generating identity management report from {} to {}", fromDate, toDate);
        
        Map<String, Object> report = new HashMap<>();
        
        // Basic statistics
        report.put("totalIdentities", patientIdentityRepository.count());
        report.put("activeIdentities", getIdentityCountByStatus(IdentityStatus.ACTIVE));
        report.put("mergedIdentities", getIdentityCountByStatus(IdentityStatus.MERGED));
        report.put("duplicateIdentities", getIdentityCountByStatus(IdentityStatus.DUPLICATE));
        
        // Quality metrics
        report.put("averageConfidenceScore", getAverageConfidenceScore());
        report.put("averageDataQualityScore", getAverageDataQualityScore());
        
        // Recent activity
        if (fromDate != null) {
            List<PatientIdentity> recentIdentities = patientIdentityRepository.findRecentlyCreated(fromDate);
            report.put("recentlyCreated", recentIdentities.size());
        }
        
        // Verification status
        report.put("identitiesRequiringVerification", getIdentitiesRequiringVerification().size());
        report.put("unlinkedIdentities", getUnlinkedIdentities().size());
        
        return report;
    }

    /**
     * Calculate match score between two patient identities
     */
    private double calculateMatchScore(PatientIdentity identity1, PatientIdentity identity2) {
        double score = 0.0;
        
        // Exact matches
        if (Objects.equals(identity1.getSsn(), identity2.getSsn()) && 
            StringUtils.hasText(identity1.getSsn())) {
            score += 40; // SSN match is very strong
        }
        
        if (Objects.equals(identity1.getEmail(), identity2.getEmail()) && 
            StringUtils.hasText(identity1.getEmail())) {
            score += 20; // Email match is strong
        }
        
        if (Objects.equals(identity1.getDateOfBirth(), identity2.getDateOfBirth())) {
            score += 25; // DOB match is important
        }
        
        // Name similarity (simplified - in real implementation would use phonetic/fuzzy matching)
        if (StringUtils.hasText(identity1.getFirstName()) && StringUtils.hasText(identity2.getFirstName())) {
            if (identity1.getFirstName().equalsIgnoreCase(identity2.getFirstName())) {
                score += 10;
            } else if (identity1.getFirstName().toLowerCase().contains(identity2.getFirstName().toLowerCase()) ||
                      identity2.getFirstName().toLowerCase().contains(identity1.getFirstName().toLowerCase())) {
                score += 5;
            }
        }
        
        if (StringUtils.hasText(identity1.getLastName()) && StringUtils.hasText(identity2.getLastName())) {
            if (identity1.getLastName().equalsIgnoreCase(identity2.getLastName())) {
                score += 15;
            } else if (identity1.getLastName().toLowerCase().contains(identity2.getLastName().toLowerCase()) ||
                      identity2.getLastName().toLowerCase().contains(identity1.getLastName().toLowerCase())) {
                score += 7;
            }
        }
        
        // Phone number match
        String[] phones1 = {identity1.getPhoneHome(), identity1.getPhoneMobile(), identity1.getPhoneWork()};
        String[] phones2 = {identity2.getPhoneHome(), identity2.getPhoneMobile(), identity2.getPhoneWork()};
        
        for (String phone1 : phones1) {
            if (StringUtils.hasText(phone1)) {
                for (String phone2 : phones2) {
                    if (Objects.equals(phone1, phone2)) {
                        score += 10;
                        break;
                    }
                }
            }
        }
        
        return Math.min(100.0, score);
    }
}
