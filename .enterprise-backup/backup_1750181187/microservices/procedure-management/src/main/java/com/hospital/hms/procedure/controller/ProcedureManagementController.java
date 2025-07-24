package com.hospital.hms.procedure.controller;

import com.hospital.hms.procedure.dto.ProcedureRequestDto;
import com.hospital.hms.procedure.dto.ProcedureResponseDto;
import com.hospital.hms.procedure.dto.ProcedureSearchCriteriaDto;
import com.hospital.hms.procedure.service.ProcedureManagementService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * Procedure Management REST Controller
 * 
 * Comprehensive API for clinical procedure workflow management including scheduling,
 * documentation, resource allocation, and real-time tracking.
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@RestController
@RequestMapping("/api/v1/procedures")
@RequiredArgsConstructor
@Validated
@Slf4j
@Tag(name = "Procedure Management", description = "Clinical procedure workflow management APIs")
public class ProcedureManagementController {

    private final ProcedureManagementService procedureManagementService;

    /**
     * Schedule a new procedure
     */
    @PostMapping
    @Operation(summary = "Schedule new procedure", description = "Schedule a new clinical procedure with resource allocation")
    @ApiResponse(responseCode = "201", description = "Procedure scheduled successfully")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('NURSE') or hasRole('ADMIN')")
    public ResponseEntity<ProcedureResponseDto> scheduleProcedure(
            @Valid @RequestBody ProcedureRequestDto request) {
        log.info("Scheduling procedure for patient: {}", request.getPatientId());
        
        ProcedureResponseDto response = procedureManagementService.scheduleProcedure(request);
        return ResponseEntity.status(201).body(response);
    }

    /**
     * Update existing procedure
     */
    @PutMapping("/{procedureId}")
    @Operation(summary = "Update procedure", description = "Update procedure details, status, or scheduling")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('NURSE') or hasRole('ADMIN')")
    public ResponseEntity<ProcedureResponseDto> updateProcedure(
            @PathVariable @NotBlank String procedureId,
            @Valid @RequestBody ProcedureRequestDto request) {
        log.info("Updating procedure: {}", procedureId);
        
        ProcedureResponseDto response = procedureManagementService.updateProcedure(procedureId, request);
        return ResponseEntity.ok(response);
    }

    /**
     * Get procedure by ID
     */
    @GetMapping("/{procedureId}")
    @Operation(summary = "Get procedure details", description = "Retrieve comprehensive procedure information")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('NURSE') or hasRole('ADMIN') or hasRole('PATIENT')")
    public ResponseEntity<ProcedureResponseDto> getProcedure(
            @PathVariable @NotBlank String procedureId) {
        log.info("Retrieving procedure: {}", procedureId);
        
        ProcedureResponseDto response = procedureManagementService.getProcedure(procedureId);
        return ResponseEntity.ok(response);
    }

    /**
     * Search procedures with advanced criteria
     */
    @PostMapping("/search")
    @Operation(summary = "Search procedures", description = "Advanced procedure search with multiple criteria")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('NURSE') or hasRole('ADMIN')")
    public ResponseEntity<Page<ProcedureResponseDto>> searchProcedures(
            @Valid @RequestBody ProcedureSearchCriteriaDto criteria,
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "20") @Min(1) int size) {
        log.info("Searching procedures with criteria: {}", criteria);
        
        Pageable pageable = PageRequest.of(page, size);
        Page<ProcedureResponseDto> response = procedureManagementService.searchProcedures(criteria, pageable);
        return ResponseEntity.ok(response);
    }

    /**
     * Get procedures by patient ID
     */
    @GetMapping("/patient/{patientId}")
    @Operation(summary = "Get patient procedures", description = "Get all procedures for a specific patient")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('NURSE') or hasRole('ADMIN') or (hasRole('PATIENT') and #patientId == authentication.name)")
    public ResponseEntity<List<ProcedureResponseDto>> getPatientProcedures(
            @PathVariable @NotBlank String patientId) {
        log.info("Retrieving procedures for patient: {}", patientId);
        
        List<ProcedureResponseDto> response = procedureManagementService.getPatientProcedures(patientId);
        return ResponseEntity.ok(response);
    }

    /**
     * Get procedures by department and date
     */
    @GetMapping("/department/{department}")
    @Operation(summary = "Get department procedures", description = "Get procedures by department and date")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('NURSE') or hasRole('ADMIN')")
    public ResponseEntity<List<ProcedureResponseDto>> getDepartmentProcedures(
            @PathVariable @NotBlank String department,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        log.info("Retrieving procedures for department: {} on date: {}", department, date);
        
        List<ProcedureResponseDto> response = procedureManagementService.getDepartmentProcedures(department, date);
        return ResponseEntity.ok(response);
    }

    /**
     * Start procedure execution
     */
    @PostMapping("/{procedureId}/start")
    @Operation(summary = "Start procedure", description = "Mark procedure as started and begin execution tracking")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<ProcedureResponseDto> startProcedure(
            @PathVariable @NotBlank String procedureId,
            @RequestParam @NotBlank String performedBy) {
        log.info("Starting procedure: {} by: {}", procedureId, performedBy);
        
        ProcedureResponseDto response = procedureManagementService.startProcedure(procedureId, performedBy);
        return ResponseEntity.ok(response);
    }

    /**
     * Complete procedure
     */
    @PostMapping("/{procedureId}/complete")
    @Operation(summary = "Complete procedure", description = "Mark procedure as completed with final notes")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<ProcedureResponseDto> completeProcedure(
            @PathVariable @NotBlank String procedureId,
            @RequestParam @NotBlank String performedBy,
            @RequestParam(required = false) String notes,
            @RequestParam(required = false) String complications) {
        log.info("Completing procedure: {} by: {}", procedureId, performedBy);
        
        ProcedureResponseDto response = procedureManagementService.completeProcedure(
            procedureId, performedBy, notes, complications);
        return ResponseEntity.ok(response);
    }

    /**
     * Cancel procedure
     */
    @PostMapping("/{procedureId}/cancel")
    @Operation(summary = "Cancel procedure", description = "Cancel scheduled procedure with reason")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN')")
    public ResponseEntity<ProcedureResponseDto> cancelProcedure(
            @PathVariable @NotBlank String procedureId,
            @RequestParam @NotBlank String reason,
            @RequestParam @NotBlank String cancelledBy) {
        log.info("Cancelling procedure: {} by: {} for reason: {}", procedureId, cancelledBy, reason);
        
        ProcedureResponseDto response = procedureManagementService.cancelProcedure(procedureId, reason, cancelledBy);
        return ResponseEntity.ok(response);
    }

    /**
     * Add procedure event/note
     */
    @PostMapping("/{procedureId}/events")
    @Operation(summary = "Add procedure event", description = "Add real-time event or note to procedure")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<Void> addProcedureEvent(
            @PathVariable @NotBlank String procedureId,
            @RequestParam @NotBlank String eventType,
            @RequestParam @NotBlank String description,
            @RequestParam @NotBlank String performedBy,
            @RequestParam(required = false) String severity) {
        log.info("Adding event to procedure: {} type: {}", procedureId, eventType);
        
        procedureManagementService.addProcedureEvent(procedureId, eventType, description, performedBy, severity);
        return ResponseEntity.ok().build();
    }

    /**
     * Get procedure timeline/events
     */
    @GetMapping("/{procedureId}/timeline")
    @Operation(summary = "Get procedure timeline", description = "Get chronological events for procedure")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('NURSE') or hasRole('ADMIN')")
    public ResponseEntity<List<Map<String, Object>>> getProcedureTimeline(
            @PathVariable @NotBlank String procedureId) {
        log.info("Retrieving timeline for procedure: {}", procedureId);
        
        List<Map<String, Object>> timeline = procedureManagementService.getProcedureTimeline(procedureId);
        return ResponseEntity.ok(timeline);
    }

    /**
     * Allocate resource to procedure
     */
    @PostMapping("/{procedureId}/resources")
    @Operation(summary = "Allocate resource", description = "Allocate staff, equipment, or room to procedure")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('NURSE') or hasRole('ADMIN')")
    public ResponseEntity<Void> allocateResource(
            @PathVariable @NotBlank String procedureId,
            @RequestParam @NotBlank String resourceType,
            @RequestParam @NotBlank String resourceIdentifier,
            @RequestParam @NotBlank String allocatedBy,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime allocatedFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime allocatedTo) {
        log.info("Allocating resource to procedure: {} type: {} id: {}", procedureId, resourceType, resourceIdentifier);
        
        procedureManagementService.allocateResource(
            procedureId, resourceType, resourceIdentifier, allocatedBy, allocatedFrom, allocatedTo);
        return ResponseEntity.ok().build();
    }

    /**
     * Release resource from procedure
     */
    @DeleteMapping("/{procedureId}/resources/{resourceId}")
    @Operation(summary = "Release resource", description = "Release allocated resource from procedure")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('NURSE') or hasRole('ADMIN')")
    public ResponseEntity<Void> releaseResource(
            @PathVariable @NotBlank String procedureId,
            @PathVariable @NotBlank String resourceId,
            @RequestParam @NotBlank String releasedBy) {
        log.info("Releasing resource: {} from procedure: {}", resourceId, procedureId);
        
        procedureManagementService.releaseResource(procedureId, resourceId, releasedBy);
        return ResponseEntity.ok().build();
    }

    /**
     * Get procedure resources
     */
    @GetMapping("/{procedureId}/resources")
    @Operation(summary = "Get procedure resources", description = "Get all allocated resources for procedure")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('NURSE') or hasRole('ADMIN')")
    public ResponseEntity<List<Map<String, Object>>> getProcedureResources(
            @PathVariable @NotBlank String procedureId) {
        log.info("Retrieving resources for procedure: {}", procedureId);
        
        List<Map<String, Object>> resources = procedureManagementService.getProcedureResources(procedureId);
        return ResponseEntity.ok(resources);
    }

    /**
     * Check resource conflicts
     */
    @PostMapping("/resources/conflicts")
    @Operation(summary = "Check resource conflicts", description = "Check for resource allocation conflicts")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('NURSE') or hasRole('ADMIN')")
    public ResponseEntity<List<Map<String, Object>>> checkResourceConflicts(
            @RequestParam @NotBlank String resourceIdentifier,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startTime,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endTime) {
        log.info("Checking conflicts for resource: {} from: {} to: {}", resourceIdentifier, startTime, endTime);
        
        List<Map<String, Object>> conflicts = procedureManagementService.checkResourceConflicts(
            resourceIdentifier, startTime, endTime);
        return ResponseEntity.ok(conflicts);
    }

    /**
     * Get today's procedures
     */
    @GetMapping("/today")
    @Operation(summary = "Get today's procedures", description = "Get all procedures scheduled for today")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('NURSE') or hasRole('ADMIN')")
    public ResponseEntity<List<ProcedureResponseDto>> getTodaysProcedures() {
        log.info("Retrieving today's procedures");
        
        List<ProcedureResponseDto> procedures = procedureManagementService.getTodaysProcedures();
        return ResponseEntity.ok(procedures);
    }

    /**
     * Get overdue procedures
     */
    @GetMapping("/overdue")
    @Operation(summary = "Get overdue procedures", description = "Get procedures that are overdue")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('NURSE') or hasRole('ADMIN')")
    public ResponseEntity<List<ProcedureResponseDto>> getOverdueProcedures() {
        log.info("Retrieving overdue procedures");
        
        List<ProcedureResponseDto> procedures = procedureManagementService.getOverdueProcedures();
        return ResponseEntity.ok(procedures);
    }

    /**
     * Get procedure statistics
     */
    @GetMapping("/statistics")
    @Operation(summary = "Get procedure statistics", description = "Get comprehensive procedure statistics")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    public ResponseEntity<Map<String, Object>> getProcedureStatistics(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) String department) {
        log.info("Retrieving procedure statistics from: {} to: {} department: {}", startDate, endDate, department);
        
        Map<String, Object> statistics = procedureManagementService.getProcedureStatistics(startDate, endDate, department);
        return ResponseEntity.ok(statistics);
    }

    /**
     * Health check endpoint
     */
    @GetMapping("/health")
    @Operation(summary = "Health check", description = "Service health check endpoint")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> health = Map.of(
            "status", "UP",
            "service", "procedure-management",
            "timestamp", LocalDateTime.now()
        );
        return ResponseEntity.ok(health);
    }
}
