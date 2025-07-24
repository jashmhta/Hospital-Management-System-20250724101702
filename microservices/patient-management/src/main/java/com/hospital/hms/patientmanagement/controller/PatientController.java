package com.hospital.hms.patientmanagement.controller;

import com.hospital.hms.patientmanagement.dto.*;
import com.hospital.hms.patientmanagement.entity.Gender;
import com.hospital.hms.patientmanagement.service.PatientService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

/**
 * REST Controller for Patient Management operations
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@RestController
@RequestMapping("/api/v1/patients")
@Tag(name = "Patient Management", description = "APIs for managing patient information")
@Validated
@CrossOrigin(origins = "*", maxAge = 3600)
public class PatientController {

    private static final Logger logger = LoggerFactory.getLogger(PatientController.class);
    
    private final PatientService patientService;

    @Autowired
    public PatientController(PatientService patientService) {
        this.patientService = patientService;
    }

    @Operation(summary = "Create a new patient", description = "Creates a new patient record in the system")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Patient created successfully",
                    content = @Content(schema = @Schema(implementation = PatientResponseDto.class))),
        @ApiResponse(responseCode = "400", description = "Invalid input data"),
        @ApiResponse(responseCode = "409", description = "Patient already exists")
    })
    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('REGISTRATION_STAFF')")
    public ResponseEntity<PatientResponseDto> createPatient(
            @Valid @RequestBody PatientCreateRequestDto createRequest) {
        
        logger.info("Creating new patient: {} {}", createRequest.getGivenName(), createRequest.getFamilyName());
        
        PatientResponseDto response = patientService.createPatient(createRequest);
        
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @Operation(summary = "Update patient information", description = "Updates an existing patient record")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Patient updated successfully",
                    content = @Content(schema = @Schema(implementation = PatientResponseDto.class))),
        @ApiResponse(responseCode = "404", description = "Patient not found"),
        @ApiResponse(responseCode = "400", description = "Invalid input data")
    })
    @PutMapping("/{patientId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('REGISTRATION_STAFF') or hasRole('NURSE')")
    public ResponseEntity<PatientResponseDto> updatePatient(
            @Parameter(description = "Patient ID", required = true)
            @PathVariable UUID patientId,
            @Valid @RequestBody PatientUpdateRequestDto updateRequest) {
        
        logger.info("Updating patient: {}", patientId);
        
        PatientResponseDto response = patientService.updatePatient(patientId, updateRequest);
        
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Get patient by ID", description = "Retrieves a patient by their unique identifier")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Patient found",
                    content = @Content(schema = @Schema(implementation = PatientResponseDto.class))),
        @ApiResponse(responseCode = "404", description = "Patient not found")
    })
    @GetMapping("/{patientId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE') or hasRole('REGISTRATION_STAFF')")
    public ResponseEntity<PatientResponseDto> getPatientById(
            @Parameter(description = "Patient ID", required = true)
            @PathVariable UUID patientId) {
        
        PatientResponseDto response = patientService.getPatientById(patientId);
        
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Get patient by Medical Record Number", 
               description = "Retrieves a patient by their medical record number")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Patient found",
                    content = @Content(schema = @Schema(implementation = PatientResponseDto.class))),
        @ApiResponse(responseCode = "404", description = "Patient not found")
    })
    @GetMapping("/mrn/{medicalRecordNumber}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE') or hasRole('REGISTRATION_STAFF')")
    public ResponseEntity<PatientResponseDto> getPatientByMrn(
            @Parameter(description = "Medical Record Number", required = true)
            @PathVariable String medicalRecordNumber) {
        
        PatientResponseDto response = patientService.getPatientByMrn(medicalRecordNumber);
        
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Get patient by identifier", 
               description = "Retrieves a patient by their external identifier")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Patient found",
                    content = @Content(schema = @Schema(implementation = PatientResponseDto.class))),
        @ApiResponse(responseCode = "404", description = "Patient not found")
    })
    @GetMapping("/identifier")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE') or hasRole('REGISTRATION_STAFF')")
    public ResponseEntity<PatientResponseDto> getPatientByIdentifier(
            @Parameter(description = "Identifier value", required = true)
            @RequestParam String identifierValue,
            @Parameter(description = "Identifier system", required = true)
            @RequestParam String identifierSystem) {
        
        Optional<PatientResponseDto> response = patientService.getPatientByIdentifier(identifierValue, identifierSystem);
        
        return response.map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Search patients", description = "Search patients using various criteria")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Search completed successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid search criteria")
    })
    @GetMapping("/search")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE') or hasRole('REGISTRATION_STAFF')")
    public ResponseEntity<Page<PatientResponseDto>> searchPatients(
            @Parameter(description = "Medical Record Number") 
            @RequestParam(required = false) String medicalRecordNumber,
            @Parameter(description = "Family name") 
            @RequestParam(required = false) String familyName,
            @Parameter(description = "Given name") 
            @RequestParam(required = false) String givenName,
            @Parameter(description = "Date of birth") 
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateOfBirth,
            @Parameter(description = "Date of birth from") 
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateOfBirthFrom,
            @Parameter(description = "Date of birth to") 
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateOfBirthTo,
            @Parameter(description = "Gender") 
            @RequestParam(required = false) Gender gender,
            @Parameter(description = "Phone number") 
            @RequestParam(required = false) String phoneNumber,
            @Parameter(description = "Email address") 
            @RequestParam(required = false) String email,
            @Parameter(description = "Active status") 
            @RequestParam(required = false) Boolean active,
            @Parameter(description = "Include deceased patients") 
            @RequestParam(required = false, defaultValue = "false") Boolean includeDeceased,
            @Parameter(description = "Search term") 
            @RequestParam(required = false) String searchTerm,
            @Parameter(description = "Page number") 
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @Parameter(description = "Page size") 
            @RequestParam(defaultValue = "20") @Min(1) @Max(100) int size,
            @Parameter(description = "Sort by field") 
            @RequestParam(defaultValue = "familyName") String sortBy,
            @Parameter(description = "Sort direction") 
            @RequestParam(defaultValue = "asc") String sortDirection) {
        
        // Build search criteria
        PatientSearchCriteria criteria = new PatientSearchCriteria();
        criteria.setMedicalRecordNumber(medicalRecordNumber);
        criteria.setFamilyName(familyName);
        criteria.setGivenName(givenName);
        criteria.setDateOfBirth(dateOfBirth);
        criteria.setDateOfBirthFrom(dateOfBirthFrom);
        criteria.setDateOfBirthTo(dateOfBirthTo);
        criteria.setGender(gender);
        criteria.setPhoneNumber(phoneNumber);
        criteria.setEmail(email);
        criteria.setActive(active);
        criteria.setIncludeDeceased(includeDeceased);
        criteria.setSearchTerm(searchTerm);
        
        // Build pageable
        Sort.Direction direction = sortDirection.equalsIgnoreCase("desc") ? 
                                  Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        
        Page<PatientResponseDto> response = patientService.searchPatients(criteria, pageable);
        
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Get active patients", description = "Retrieves all active patients")
    @GetMapping("/active")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE') or hasRole('REGISTRATION_STAFF')")
    public ResponseEntity<Page<PatientResponseDto>> getActivePatients(
            @Parameter(description = "Page number") 
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @Parameter(description = "Page size") 
            @RequestParam(defaultValue = "20") @Min(1) @Max(100) int size) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("familyName", "givenName"));
        Page<PatientResponseDto> response = patientService.getActivePatients(pageable);
        
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Full-text search", description = "Performs full-text search across patient data")
    @GetMapping("/search/fulltext")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE') or hasRole('REGISTRATION_STAFF')")
    public ResponseEntity<Page<PatientResponseDto>> fullTextSearch(
            @Parameter(description = "Search term", required = true) 
            @RequestParam String q,
            @Parameter(description = "Page number") 
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @Parameter(description = "Page size") 
            @RequestParam(defaultValue = "20") @Min(1) @Max(100) int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<PatientResponseDto> response = patientService.fullTextSearch(q, pageable);
        
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Find patients by name", description = "Finds patients by family and given name")
    @GetMapping("/search/name")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE') or hasRole('REGISTRATION_STAFF')")
    public ResponseEntity<List<PatientResponseDto>> findPatientsByName(
            @Parameter(description = "Family name", required = true) 
            @RequestParam String familyName,
            @Parameter(description = "Given name", required = true) 
            @RequestParam String givenName) {
        
        List<PatientResponseDto> response = patientService.findPatientsByName(familyName, givenName);
        
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Find patients by age range", description = "Finds patients within a specific age range")
    @GetMapping("/search/age-range")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE') or hasRole('REGISTRATION_STAFF')")
    public ResponseEntity<List<PatientResponseDto>> findPatientsByAgeRange(
            @Parameter(description = "Minimum age", required = true) 
            @RequestParam @Min(0) @Max(150) int minAge,
            @Parameter(description = "Maximum age", required = true) 
            @RequestParam @Min(0) @Max(150) int maxAge) {
        
        List<PatientResponseDto> response = patientService.findPatientsByAgeRange(minAge, maxAge);
        
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Find minor patients", description = "Finds all patients under 18 years old")
    @GetMapping("/search/minors")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE') or hasRole('PEDIATRICIAN')")
    public ResponseEntity<List<PatientResponseDto>> findMinorPatients() {
        
        List<PatientResponseDto> response = patientService.findMinorPatients();
        
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Find patients by gender", description = "Finds patients by gender")
    @GetMapping("/search/gender/{gender}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE') or hasRole('REGISTRATION_STAFF')")
    public ResponseEntity<List<PatientResponseDto>> findPatientsByGender(
            @Parameter(description = "Gender", required = true) 
            @PathVariable Gender gender) {
        
        List<PatientResponseDto> response = patientService.findPatientsByGender(gender);
        
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Find patients with allergies", description = "Finds patients with specific allergies")
    @GetMapping("/search/allergies")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE') or hasRole('PHARMACIST')")
    public ResponseEntity<List<PatientResponseDto>> findPatientsByAllergy(
            @Parameter(description = "Allergy name", required = true) 
            @RequestParam String allergy) {
        
        List<PatientResponseDto> response = patientService.findPatientsByAllergy(allergy);
        
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Find patients requiring interpreter", 
               description = "Finds patients who require interpreter services")
    @GetMapping("/search/interpreter-required")
    @PreAuthorize("hasRole('ADMIN') or hasRole('REGISTRATION_STAFF')")
    public ResponseEntity<List<PatientResponseDto>> findPatientsRequiringInterpreter() {
        
        List<PatientResponseDto> response = patientService.findPatientsRequiringInterpreter();
        
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Find potential duplicates", description = "Finds patients that might be duplicates")
    @GetMapping("/search/duplicates")
    @PreAuthorize("hasRole('ADMIN') or hasRole('REGISTRATION_STAFF')")
    public ResponseEntity<List<PatientResponseDto>> findPotentialDuplicates() {
        
        List<PatientResponseDto> response = patientService.findPotentialDuplicates();
        
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Find patients with missing information", 
               description = "Finds patients with incomplete critical information")
    @GetMapping("/search/missing-info")
    @PreAuthorize("hasRole('ADMIN') or hasRole('REGISTRATION_STAFF')")
    public ResponseEntity<List<PatientResponseDto>> findPatientsWithMissingInfo() {
        
        List<PatientResponseDto> response = patientService.findPatientsWithMissingInfo();
        
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Deactivate patient", description = "Deactivates a patient record")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Patient deactivated successfully"),
        @ApiResponse(responseCode = "404", description = "Patient not found")
    })
    @PutMapping("/{patientId}/deactivate")
    @PreAuthorize("hasRole('ADMIN') or hasRole('REGISTRATION_STAFF')")
    public ResponseEntity<PatientResponseDto> deactivatePatient(
            @Parameter(description = "Patient ID", required = true)
            @PathVariable UUID patientId) {
        
        logger.info("Deactivating patient: {}", patientId);
        
        PatientResponseDto response = patientService.deactivatePatient(patientId);
        
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Reactivate patient", description = "Reactivates a patient record")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Patient reactivated successfully"),
        @ApiResponse(responseCode = "404", description = "Patient not found")
    })
    @PutMapping("/{patientId}/reactivate")
    @PreAuthorize("hasRole('ADMIN') or hasRole('REGISTRATION_STAFF')")
    public ResponseEntity<PatientResponseDto> reactivatePatient(
            @Parameter(description = "Patient ID", required = true)
            @PathVariable UUID patientId) {
        
        logger.info("Reactivating patient: {}", patientId);
        
        PatientResponseDto response = patientService.reactivatePatient(patientId);
        
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Mark patient as deceased", description = "Marks a patient as deceased")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Patient marked as deceased successfully"),
        @ApiResponse(responseCode = "404", description = "Patient not found")
    })
    @PutMapping("/{patientId}/deceased")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    public ResponseEntity<PatientResponseDto> markPatientAsDeceased(
            @Parameter(description = "Patient ID", required = true)
            @PathVariable UUID patientId,
            @Parameter(description = "Date and time of death") 
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) 
            LocalDateTime deceasedDateTime) {
        
        logger.info("Marking patient as deceased: {}", patientId);
        
        if (deceasedDateTime == null) {
            deceasedDateTime = LocalDateTime.now();
        }
        
        PatientResponseDto response = patientService.markPatientAsDeceased(patientId, deceasedDateTime);
        
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Get patient statistics", description = "Retrieves patient statistics and metrics")
    @GetMapping("/statistics")
    @PreAuthorize("hasRole('ADMIN') or hasRole('ANALYTICS')")
    public ResponseEntity<Map<String, Object>> getPatientStatistics() {
        
        Map<String, Object> response = patientService.getPatientStatistics();
        
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Get patient count by gender", description = "Retrieves patient distribution by gender")
    @GetMapping("/statistics/gender")
    @PreAuthorize("hasRole('ADMIN') or hasRole('ANALYTICS')")
    public ResponseEntity<Map<String, Long>> getPatientCountByGender() {
        
        Map<String, Long> response = patientService.getPatientCountByGender();
        
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Get patient count by age group", description = "Retrieves patient distribution by age groups")
    @GetMapping("/statistics/age-groups")
    @PreAuthorize("hasRole('ADMIN') or hasRole('ANALYTICS')")
    public ResponseEntity<Map<String, Long>> getPatientCountByAgeGroup() {
        
        Map<String, Long> response = patientService.getPatientCountByAgeGroup();
        
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Generate Medical Record Number", description = "Generates a new unique MRN")
    @GetMapping("/generate-mrn")
    @PreAuthorize("hasRole('ADMIN') or hasRole('REGISTRATION_STAFF')")
    public ResponseEntity<Map<String, String>> generateMedicalRecordNumber() {
        
        String mrn = patientService.generateMedicalRecordNumber();
        
        Map<String, String> response = Map.of("medicalRecordNumber", mrn);
        
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Check if MRN exists", description = "Checks if a medical record number already exists")
    @GetMapping("/check-mrn/{medicalRecordNumber}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('REGISTRATION_STAFF')")
    public ResponseEntity<Map<String, Boolean>> checkMedicalRecordNumber(
            @Parameter(description = "Medical Record Number", required = true)
            @PathVariable String medicalRecordNumber) {
        
        boolean exists = patientService.medicalRecordNumberExists(medicalRecordNumber);
        
        Map<String, Boolean> response = Map.of("exists", exists);
        
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Check if email exists", description = "Checks if an email address already exists")
    @GetMapping("/check-email")
    @PreAuthorize("hasRole('ADMIN') or hasRole('REGISTRATION_STAFF')")
    public ResponseEntity<Map<String, Boolean>> checkEmail(
            @Parameter(description = "Email address", required = true)
            @RequestParam String email) {
        
        boolean exists = patientService.emailExists(email);
        
        Map<String, Boolean> response = Map.of("exists", exists);
        
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Merge duplicate patients", description = "Merges two duplicate patient records")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Patients merged successfully"),
        @ApiResponse(responseCode = "404", description = "One or both patients not found")
    })
    @PostMapping("/{primaryPatientId}/merge/{duplicatePatientId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PatientResponseDto> mergeDuplicatePatients(
            @Parameter(description = "Primary patient ID (to keep)", required = true)
            @PathVariable UUID primaryPatientId,
            @Parameter(description = "Duplicate patient ID (to merge)", required = true)
            @PathVariable UUID duplicatePatientId) {
        
        logger.info("Merging patients: primary={}, duplicate={}", primaryPatientId, duplicatePatientId);
        
        PatientResponseDto response = patientService.mergeDuplicatePatients(primaryPatientId, duplicatePatientId);
        
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Export patients", description = "Exports patient data based on search criteria")
    @PostMapping("/export")
    @PreAuthorize("hasRole('ADMIN') or hasRole('ANALYTICS')")
    public ResponseEntity<List<PatientResponseDto>> exportPatients(
            @RequestBody(required = false) PatientSearchCriteria criteria) {
        
        if (criteria == null) {
            criteria = new PatientSearchCriteria();
        }
        
        List<PatientResponseDto> response = patientService.exportPatients(criteria);
        
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Bulk update patients", description = "Updates multiple patients with the same data")
    @PutMapping("/bulk-update")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Integer>> bulkUpdatePatients(
            @Parameter(description = "List of patient IDs", required = true)
            @RequestParam List<UUID> patientIds,
            @Valid @RequestBody PatientUpdateRequestDto updateRequest) {
        
        logger.info("Bulk updating {} patients", patientIds.size());
        
        int updatedCount = patientService.bulkUpdatePatients(patientIds, updateRequest);
        
        Map<String, Integer> response = Map.of(
            "total", patientIds.size(),
            "updated", updatedCount,
            "failed", patientIds.size() - updatedCount
        );
        
        return ResponseEntity.ok(response);
    }
}
