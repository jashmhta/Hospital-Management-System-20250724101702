package com.hospital.hms.patientmanagement.service.impl;

import com.hospital.hms.patientmanagement.dto.*;
import com.hospital.hms.patientmanagement.entity.Gender;
import com.hospital.hms.patientmanagement.entity.Patient;
import com.hospital.hms.patientmanagement.entity.PatientAddress;
import com.hospital.hms.patientmanagement.entity.PatientInsurance;
import com.hospital.hms.patientmanagement.exception.*;
import com.hospital.hms.patientmanagement.mapper.PatientMapper;
import com.hospital.hms.patientmanagement.repository.PatientRepository;
import com.hospital.hms.patientmanagement.service.PatientService;
import com.hospital.hms.patientmanagement.service.SecurityContextService;
import com.hospital.hms.patientmanagement.service.EventPublishingService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import jakarta.persistence.criteria.Predicate;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;

/**
 * Implementation of PatientService
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Service
@Transactional
public class PatientServiceImpl implements PatientService {

    private static final Logger logger = LoggerFactory.getLogger(PatientServiceImpl.class);
    
    private final PatientRepository patientRepository;
    private final PatientMapper patientMapper;
    private final SecurityContextService securityContextService;
    private final EventPublishingService eventPublishingService;

    @Autowired
    public PatientServiceImpl(PatientRepository patientRepository, PatientMapper patientMapper,
                              SecurityContextService securityContextService, EventPublishingService eventPublishingService) {
        this.patientRepository = patientRepository;
        this.patientMapper = patientMapper;
        this.securityContextService = securityContextService;
        this.eventPublishingService = eventPublishingService;
    }

    @Override
    public PatientResponseDto createPatient(PatientCreateRequestDto createRequest) {
        logger.info("Creating new patient: {} {}", createRequest.getGivenName(), createRequest.getFamilyName());
        
        try {
            // Validate request
            validateCreateRequest(createRequest);
            
            // Convert DTO to entity
            Patient patient = patientMapper.toEntity(createRequest);
            
            // Generate MRN
            patient.setMedicalRecordNumber(generateMedicalRecordNumber());
            
            // Set audit fields
            patient.setCreatedBy(getCurrentUser());
            patient.setLastModifiedBy(getCurrentUser());
            
            // Validate business rules
            validatePatientBusinessRules(patient, false);
            
            // Handle addresses
            if (createRequest.getAddresses() != null) {
                Set<PatientAddress> addresses = createRequest.getAddresses().stream()
                        .map(patientMapper::toAddressEntity)
                        .collect(Collectors.toSet());
                addresses.forEach(addr -> addr.setPatient(patient));
                patient.setAddresses(addresses);
            }
            
            // Handle insurances
            if (createRequest.getInsurances() != null) {
                Set<PatientInsurance> insurances = createRequest.getInsurances().stream()
                        .map(patientMapper::toInsuranceEntity)
                        .collect(Collectors.toSet());
                insurances.forEach(ins -> ins.setPatient(patient));
                patient.setInsurances(insurances);
            }
            
            // Save patient
            Patient savedPatient = patientRepository.save(patient);
            
            logger.info("Patient created successfully with ID: {} and MRN: {}", 
                       savedPatient.getId(), savedPatient.getMedicalRecordNumber());
            
            // Publish patient created event
            eventPublishingService.publishPatientCreated(savedPatient);
            
            return patientMapper.toResponseDto(savedPatient);
            
        } catch (Exception e) {
            logger.error("Error creating patient: {}", e.getMessage(), e);
            throw new PatientServiceException("createPatient", "Failed to create patient", e);
        }
    }

    @Override
    @CacheEvict(value = "patients", key = "#patientId")
    public PatientResponseDto updatePatient(UUID patientId, PatientUpdateRequestDto updateRequest) {
        logger.info("Updating patient with ID: {}", patientId);
        
        try {
            // Find existing patient
            Patient existingPatient = patientRepository.findById(patientId)
                    .orElseThrow(() -> new PatientNotFoundException(patientId));
            
            // Update fields
            patientMapper.updateEntityFromDto(updateRequest, existingPatient);
            existingPatient.setLastModifiedBy(getCurrentUser());
            
            // Validate business rules
            validatePatientBusinessRules(existingPatient, true);
            
            // Handle addresses update
            if (updateRequest.getAddresses() != null) {
                existingPatient.getAddresses().clear();
                Set<PatientAddress> updatedAddresses = updateRequest.getAddresses().stream()
                        .map(patientMapper::toAddressEntity)
                        .collect(Collectors.toSet());
                updatedAddresses.forEach(addr -> addr.setPatient(existingPatient));
                existingPatient.setAddresses(updatedAddresses);
            }
            
            // Handle insurances update
            if (updateRequest.getInsurances() != null) {
                existingPatient.getInsurances().clear();
                Set<PatientInsurance> updatedInsurances = updateRequest.getInsurances().stream()
                        .map(patientMapper::toInsuranceEntity)
                        .collect(Collectors.toSet());
                updatedInsurances.forEach(ins -> ins.setPatient(existingPatient));
                existingPatient.setInsurances(updatedInsurances);
            }
            
            // Save updated patient
            Patient updatedPatient = patientRepository.save(existingPatient);
            
            logger.info("Patient updated successfully: {}", patientId);
            
            return patientMapper.toResponseDto(updatedPatient);
            
        } catch (PatientNotFoundException e) {
            throw e;
        } catch (Exception e) {
            logger.error("Error updating patient {}: {}", patientId, e.getMessage(), e);
            throw new PatientServiceException("updatePatient", "Failed to update patient", e);
        }
    }

    @Override
    @Cacheable(value = "patients", key = "#patientId")
    @Transactional(readOnly = true)
    public PatientResponseDto getPatientById(UUID patientId) {
        logger.debug("Retrieving patient by ID: {}", patientId);
        
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new PatientNotFoundException(patientId));
        
        return patientMapper.toResponseDto(patient);
    }

    @Override
    @Cacheable(value = "patients", key = "#medicalRecordNumber")
    @Transactional(readOnly = true)
    public PatientResponseDto getPatientByMrn(String medicalRecordNumber) {
        logger.debug("Retrieving patient by MRN: {}", medicalRecordNumber);
        
        Patient patient = patientRepository.findByMedicalRecordNumber(medicalRecordNumber)
                .orElseThrow(() -> new PatientNotFoundException("Medical Record Number", medicalRecordNumber));
        
        return patientMapper.toResponseDto(patient);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<PatientResponseDto> getPatientByIdentifier(String identifierValue, String identifierSystem) {
        logger.debug("Retrieving patient by identifier: {} - {}", identifierSystem, identifierValue);
        
        return patientRepository.findByIdentifierValueAndIdentifierSystem(identifierValue, identifierSystem)
                .map(patientMapper::toResponseDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<PatientResponseDto> getPatientByFhirId(String fhirId) {
        logger.debug("Retrieving patient by FHIR ID: {}", fhirId);
        
        return patientRepository.findByFhirId(fhirId)
                .map(patientMapper::toResponseDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PatientResponseDto> searchPatients(PatientSearchCriteria criteria, Pageable pageable) {
        logger.debug("Searching patients with criteria: {}", criteria);
        
        try {
            Specification<Patient> spec = buildSearchSpecification(criteria);
            Page<Patient> patients = patientRepository.findAll(spec, pageable);
            
            return patients.map(patientMapper::toSummaryDto);
            
        } catch (Exception e) {
            logger.error("Error searching patients: {}", e.getMessage(), e);
            throw new PatientServiceException("searchPatients", "Failed to search patients", e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PatientResponseDto> getActivePatients(Pageable pageable) {
        logger.debug("Retrieving active patients");
        
        PatientSearchCriteria criteria = new PatientSearchCriteria();
        criteria.setActive(true);
        criteria.setIncludeDeceased(false);
        
        return searchPatients(criteria, pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PatientResponseDto> fullTextSearch(String searchTerm, Pageable pageable) {
        logger.debug("Performing full-text search: {}", searchTerm);
        
        Page<Patient> patients = patientRepository.fullTextSearch(searchTerm, pageable);
        return patients.map(patientMapper::toSummaryDto);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PatientResponseDto> findPatientsByName(String familyName, String givenName) {
        logger.debug("Finding patients by name: {} {}", givenName, familyName);
        
        List<Patient> patients = patientRepository.findByNameIgnoreCase(familyName, givenName);
        return patientMapper.toSummaryDtoList(patients);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PatientResponseDto> findPatientsByDateOfBirth(LocalDate dateOfBirth) {
        logger.debug("Finding patients by date of birth: {}", dateOfBirth);
        
        List<Patient> patients = patientRepository.findByDateOfBirth(dateOfBirth);
        return patientMapper.toSummaryDtoList(patients);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PatientResponseDto> findPatientsByDateOfBirthRange(LocalDate startDate, LocalDate endDate) {
        logger.debug("Finding patients by date of birth range: {} to {}", startDate, endDate);
        
        List<Patient> patients = patientRepository.findByDateOfBirthBetween(startDate, endDate);
        return patientMapper.toSummaryDtoList(patients);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PatientResponseDto> findPatientsByAgeRange(int minAge, int maxAge) {
        logger.debug("Finding patients by age range: {} to {}", minAge, maxAge);
        
        List<Patient> patients = patientRepository.findByAgeRange(minAge, maxAge);
        return patientMapper.toSummaryDtoList(patients);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PatientResponseDto> findMinorPatients() {
        logger.debug("Finding minor patients");
        
        List<Patient> patients = patientRepository.findMinorPatients();
        return patientMapper.toSummaryDtoList(patients);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PatientResponseDto> findPatientsByGender(Gender gender) {
        logger.debug("Finding patients by gender: {}", gender);
        
        List<Patient> patients = patientRepository.findByGender(gender);
        return patientMapper.toSummaryDtoList(patients);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PatientResponseDto> findPatientsByPhone(String phoneNumber) {
        logger.debug("Finding patients by phone: {}", phoneNumber);
        
        List<Patient> patients = patientRepository.findByPhoneNumber(phoneNumber);
        return patientMapper.toSummaryDtoList(patients);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<PatientResponseDto> findPatientByEmail(String email) {
        logger.debug("Finding patient by email: {}", email);
        
        return patientRepository.findByEmail(email)
                .map(patientMapper::toResponseDto);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PatientResponseDto> findPatientsByAllergy(String allergy) {
        logger.debug("Finding patients with allergy: {}", allergy);
        
        List<Patient> patients = patientRepository.findByAllergy(allergy);
        return patientMapper.toSummaryDtoList(patients);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PatientResponseDto> findPatientsRequiringInterpreter() {
        logger.debug("Finding patients requiring interpreter");
        
        List<Patient> patients = patientRepository.findByInterpreterRequiredTrue();
        return patientMapper.toSummaryDtoList(patients);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PatientResponseDto> findDeceasedPatients() {
        logger.debug("Finding deceased patients");
        
        List<Patient> patients = patientRepository.findByDeceasedTrue();
        return patientMapper.toSummaryDtoList(patients);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PatientResponseDto> findPatientsWithEmergencyContact() {
        logger.debug("Finding patients with emergency contact");
        
        List<Patient> patients = patientRepository.findPatientsWithEmergencyContact();
        return patientMapper.toSummaryDtoList(patients);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PatientResponseDto> findPotentialDuplicates() {
        logger.debug("Finding potential duplicate patients");
        
        List<Patient> patients = patientRepository.findPotentialDuplicates();
        return patientMapper.toSummaryDtoList(patients);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PatientResponseDto> findPatientsWithMissingInfo() {
        logger.debug("Finding patients with missing information");
        
        List<Patient> patients = patientRepository.findPatientsWithMissingInfo();
        return patientMapper.toSummaryDtoList(patients);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PatientResponseDto> findRecentlyUpdatedPatients(LocalDate since) {
        logger.debug("Finding recently updated patients since: {}", since);
        
        List<Patient> patients = patientRepository.findRecentlyUpdated(since);
        return patientMapper.toSummaryDtoList(patients);
    }

    @Override
    @CacheEvict(value = "patients", key = "#patientId")
    public PatientResponseDto deactivatePatient(UUID patientId) {
        logger.info("Deactivating patient: {}", patientId);
        
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new PatientNotFoundException(patientId));
        
        patient.setActive(false);
        patient.setLastModifiedBy(getCurrentUser());
        
        Patient updatedPatient = patientRepository.save(patient);
        
        logger.info("Patient deactivated: {}", patientId);
        
        return patientMapper.toResponseDto(updatedPatient);
    }

    @Override
    @CacheEvict(value = "patients", key = "#patientId")
    public PatientResponseDto reactivatePatient(UUID patientId) {
        logger.info("Reactivating patient: {}", patientId);
        
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new PatientNotFoundException(patientId));
        
        patient.setActive(true);
        patient.setLastModifiedBy(getCurrentUser());
        
        Patient updatedPatient = patientRepository.save(patient);
        
        logger.info("Patient reactivated: {}", patientId);
        
        return patientMapper.toResponseDto(updatedPatient);
    }

    @Override
    @CacheEvict(value = "patients", key = "#patientId")
    public PatientResponseDto markPatientAsDeceased(UUID patientId, LocalDateTime deceasedDateTime) {
        logger.info("Marking patient as deceased: {}", patientId);
        
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new PatientNotFoundException(patientId));
        
        patient.setDeceased(true);
        patient.setDeceasedDateTime(deceasedDateTime);
        patient.setActive(false);
        patient.setLastModifiedBy(getCurrentUser());
        
        Patient updatedPatient = patientRepository.save(patient);
        
        logger.info("Patient marked as deceased: {}", patientId);
        
        return patientMapper.toResponseDto(updatedPatient);
    }

    @Override
    public String generateMedicalRecordNumber() {
        String prefix = "MRN";
        String dateComponent = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        
        String mrn;
        int attempts = 0;
        int maxAttempts = 10;
        
        do {
            int randomNumber = ThreadLocalRandom.current().nextInt(1000, 9999);
            mrn = prefix + dateComponent + randomNumber;
            attempts++;
            
            if (attempts >= maxAttempts) {
                throw new PatientServiceException("generateMRN", 
                    "Failed to generate unique MRN after " + maxAttempts + " attempts");
            }
        } while (patientRepository.existsByMedicalRecordNumber(mrn));
        
        logger.debug("Generated MRN: {}", mrn);
        return mrn;
    }

    @Override
    @Transactional(readOnly = true)
    public boolean medicalRecordNumberExists(String medicalRecordNumber) {
        return patientRepository.existsByMedicalRecordNumber(medicalRecordNumber);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean emailExists(String email) {
        return patientRepository.existsByEmail(email);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean identifierExists(String identifierValue, String identifierSystem) {
        return patientRepository.existsByIdentifierValueAndIdentifierSystem(identifierValue, identifierSystem);
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getPatientStatistics() {
        logger.debug("Retrieving patient statistics");
        
        LocalDate startOfMonth = LocalDate.now().withDayOfMonth(1);
        Object[] stats = patientRepository.getPatientStatistics(startOfMonth);
        
        Map<String, Object> statistics = new HashMap<>();
        if (stats != null && stats.length >= 4) {
            statistics.put("totalPatients", stats[0]);
            statistics.put("activePatients", stats[1]);
            statistics.put("newThisMonth", stats[2]);
            statistics.put("minorPatients", stats[3]);
        }
        
        return statistics;
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Long> getPatientCountByGender() {
        logger.debug("Retrieving patient count by gender");
        
        List<Object[]> results = patientRepository.countPatientsByGender();
        
        Map<String, Long> genderCounts = new HashMap<>();
        for (Object[] result : results) {
            Gender gender = (Gender) result[0];
            Long count = (Long) result[1];
            genderCounts.put(gender != null ? gender.name() : "UNKNOWN", count);
        }
        
        return genderCounts;
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Long> getPatientCountByAgeGroup() {
        logger.debug("Retrieving patient count by age group");
        
        List<Object[]> results = patientRepository.countPatientsByAgeGroup();
        
        Map<String, Long> ageCounts = new HashMap<>();
        for (Object[] result : results) {
            String ageGroup = (String) result[0];
            Long count = (Long) result[1];
            ageCounts.put(ageGroup, count);
        }
        
        return ageCounts;
    }

    @Override
    public void validatePatientBusinessRules(Patient patient, boolean isUpdate) {
        Map<String, List<String>> errors = new HashMap<>();
        
        // Validate required fields
        if (!StringUtils.hasText(patient.getFamilyName())) {
            errors.computeIfAbsent("familyName", k -> new ArrayList<>())
                   .add("Family name is required");
        }
        
        if (!StringUtils.hasText(patient.getGivenName())) {
            errors.computeIfAbsent("givenName", k -> new ArrayList<>())
                   .add("Given name is required");
        }
        
        // Validate age constraints
        if (patient.getDateOfBirth() != null) {
            if (patient.getDateOfBirth().isAfter(LocalDate.now())) {
                errors.computeIfAbsent("dateOfBirth", k -> new ArrayList<>())
                       .add("Date of birth cannot be in the future");
            }
            
            int age = java.time.Period.between(patient.getDateOfBirth(), LocalDate.now()).getYears();
            if (age > 150) {
                errors.computeIfAbsent("dateOfBirth", k -> new ArrayList<>())
                       .add("Patient age cannot exceed 150 years");
            }
        }
        
        // Validate unique constraints only for new patients or when values change
        if (!isUpdate || patient.getId() == null) {
            if (patient.getEmail() != null && emailExists(patient.getEmail())) {
                errors.computeIfAbsent("email", k -> new ArrayList<>())
                       .add("Email address already exists");
            }
            
            if (patient.getIdentifierValue() != null && patient.getIdentifierSystem() != null) {
                if (identifierExists(patient.getIdentifierValue(), patient.getIdentifierSystem())) {
                    errors.computeIfAbsent("identifier", k -> new ArrayList<>())
                           .add("Patient identifier already exists");
                }
            }
        }
        
        // Validate deceased logic
        if (Boolean.TRUE.equals(patient.getDeceased())) {
            if (patient.getDeceasedDateTime() == null) {
                errors.computeIfAbsent("deceasedDateTime", k -> new ArrayList<>())
                       .add("Deceased date and time is required when patient is marked as deceased");
            } else if (patient.getDeceasedDateTime().isAfter(LocalDateTime.now())) {
                errors.computeIfAbsent("deceasedDateTime", k -> new ArrayList<>())
                       .add("Deceased date and time cannot be in the future");
            }
        }
        
        // Validate multiple birth logic
        if (Boolean.TRUE.equals(patient.getMultipleBirthBoolean()) && patient.getMultipleBirthInteger() == null) {
            errors.computeIfAbsent("multipleBirthInteger", k -> new ArrayList<>())
                   .add("Birth order is required for multiple birth patients");
        }
        
        if (!errors.isEmpty()) {
            throw new PatientValidationException("Patient validation failed", errors);
        }
    }

    @Override
    public PatientResponseDto mergeDuplicatePatients(UUID primaryPatientId, UUID duplicatePatientId) {
        logger.info("Merging duplicate patients: primary={}, duplicate={}", primaryPatientId, duplicatePatientId);
        
        Patient primaryPatient = patientRepository.findById(primaryPatientId)
                .orElseThrow(() -> new PatientNotFoundException(primaryPatientId));
        
        Patient duplicatePatient = patientRepository.findById(duplicatePatientId)
                .orElseThrow(() -> new PatientNotFoundException(duplicatePatientId));
        
        // Merge data (business logic for merging)
        mergePatientData(primaryPatient, duplicatePatient);
        
        // Deactivate duplicate
        duplicatePatient.setActive(false);
        duplicatePatient.setLastModifiedBy(getCurrentUser());
        
        // Save both
        patientRepository.save(duplicatePatient);
        Patient mergedPatient = patientRepository.save(primaryPatient);
        
        logger.info("Patients merged successfully");
        
        return patientMapper.toResponseDto(mergedPatient);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PatientResponseDto> exportPatients(PatientSearchCriteria criteria) {
        logger.info("Exporting patients with criteria");
        
        Specification<Patient> spec = buildSearchSpecification(criteria);
        List<Patient> patients = patientRepository.findAll(spec);
        
        return patientMapper.toResponseDtoList(patients);
    }

    @Override
    public int bulkUpdatePatients(List<UUID> patientIds, PatientUpdateRequestDto updateRequest) {
        logger.info("Bulk updating {} patients", patientIds.size());
        
        int updatedCount = 0;
        
        for (UUID patientId : patientIds) {
            try {
                updatePatient(patientId, updateRequest);
                updatedCount++;
            } catch (Exception e) {
                logger.warn("Failed to update patient {}: {}", patientId, e.getMessage());
            }
        }
        
        logger.info("Bulk update completed: {}/{} patients updated", updatedCount, patientIds.size());
        
        return updatedCount;
    }

    // Private helper methods
    
    private void validateCreateRequest(PatientCreateRequestDto request) {
        if (request == null) {
            throw new IllegalArgumentException("Patient creation request cannot be null");
        }
        
        if (!StringUtils.hasText(request.getFamilyName())) {
            throw new PatientValidationException("Family name is required");
        }
        
        if (!StringUtils.hasText(request.getGivenName())) {
            throw new PatientValidationException("Given name is required");
        }
    }

    private Specification<Patient> buildSearchSpecification(PatientSearchCriteria criteria) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
            
            if (StringUtils.hasText(criteria.getMedicalRecordNumber())) {
                predicates.add(criteriaBuilder.equal(root.get("medicalRecordNumber"), 
                                                   criteria.getMedicalRecordNumber()));
            }
            
            if (StringUtils.hasText(criteria.getFamilyName())) {
                predicates.add(criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("familyName")),
                    "%" + criteria.getFamilyName().toLowerCase() + "%"));
            }
            
            if (StringUtils.hasText(criteria.getGivenName())) {
                predicates.add(criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("givenName")),
                    "%" + criteria.getGivenName().toLowerCase() + "%"));
            }
            
            if (criteria.getDateOfBirth() != null) {
                predicates.add(criteriaBuilder.equal(root.get("dateOfBirth"), criteria.getDateOfBirth()));
            }
            
            if (criteria.getDateOfBirthFrom() != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("dateOfBirth"), 
                                                                   criteria.getDateOfBirthFrom()));
            }
            
            if (criteria.getDateOfBirthTo() != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("dateOfBirth"), 
                                                               criteria.getDateOfBirthTo()));
            }
            
            if (criteria.getGender() != null) {
                predicates.add(criteriaBuilder.equal(root.get("gender"), criteria.getGender()));
            }
            
            if (StringUtils.hasText(criteria.getEmail())) {
                predicates.add(criteriaBuilder.equal(
                    criteriaBuilder.lower(root.get("email")),
                    criteria.getEmail().toLowerCase()));
            }
            
            if (criteria.getActive() != null) {
                predicates.add(criteriaBuilder.equal(root.get("active"), criteria.getActive()));
            }
            
            if (!criteria.getIncludeDeceased()) {
                predicates.add(criteriaBuilder.or(
                    criteriaBuilder.isNull(root.get("deceased")),
                    criteriaBuilder.equal(root.get("deceased"), false)));
            }
            
            if (StringUtils.hasText(criteria.getSearchTerm())) {
                String searchPattern = "%" + criteria.getSearchTerm().toLowerCase() + "%";
                predicates.add(criteriaBuilder.or(
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("familyName")), searchPattern),
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("givenName")), searchPattern),
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("medicalRecordNumber")), searchPattern),
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("email")), searchPattern)
                ));
            }
            
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }

    private void mergePatientData(Patient primary, Patient duplicate) {
        // Merge addresses if primary has none
        if (primary.getAddresses().isEmpty() && !duplicate.getAddresses().isEmpty()) {
            duplicate.getAddresses().forEach(addr -> addr.setPatient(primary));
            primary.getAddresses().addAll(duplicate.getAddresses());
        }
        
        // Merge insurances if primary has none
        if (primary.getInsurances().isEmpty() && !duplicate.getInsurances().isEmpty()) {
            duplicate.getInsurances().forEach(ins -> ins.setPatient(primary));
            primary.getInsurances().addAll(duplicate.getInsurances());
        }
        
        // Merge other fields if primary has null values
        if (primary.getEmail() == null && duplicate.getEmail() != null) {
            primary.setEmail(duplicate.getEmail());
        }
        
        if (primary.getPhoneSecondary() == null && duplicate.getPhonePrimary() != null) {
            primary.setPhoneSecondary(duplicate.getPhonePrimary());
        }
        
        // Add more merge logic as needed
        primary.setLastModifiedBy(getCurrentUser());
    }

    private String getCurrentUser() {
        return securityContextService.getCurrentUser();
    }
}
