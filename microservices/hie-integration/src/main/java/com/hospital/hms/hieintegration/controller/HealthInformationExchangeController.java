package com.hospital.hms.hieintegration.controller;

import com.hospital.hms.hieintegration.dto.HieCreateRequestDto;
import com.hospital.hms.hieintegration.dto.HieResponseDto;
import com.hospital.hms.hieintegration.entity.HieStatus;
import com.hospital.hms.hieintegration.entity.HieType;
import com.hospital.hms.hieintegration.service.HealthInformationExchangeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * REST Controller for Health Information Exchange operations
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@RestController
@RequestMapping("/api/v1/hie")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Health Information Exchange", description = "HIE management operations")
@SecurityRequirement(name = "bearerAuth")
public class HealthInformationExchangeController {

    private final HealthInformationExchangeService hieService;

    @PostMapping
    @Operation(summary = "Create new HIE", description = "Create a new Health Information Exchange record")
    @ApiResponse(responseCode = "201", description = "HIE created successfully")
    @ApiResponse(responseCode = "400", description = "Invalid request data")
    @ApiResponse(responseCode = "409", description = "HIE with same code/name already exists")
    @PreAuthorize("hasRole('HIE_ADMIN') or hasRole('SYSTEM_ADMIN')")
    public ResponseEntity<HieResponseDto> createHie(@Valid @RequestBody HieCreateRequestDto createRequest) {
        log.info("Creating new HIE with code: {}", createRequest.getHieCode());
        HieResponseDto response = hieService.createHie(createRequest);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/{hieId}")
    @Operation(summary = "Update HIE", description = "Update an existing Health Information Exchange record")
    @ApiResponse(responseCode = "200", description = "HIE updated successfully")
    @ApiResponse(responseCode = "404", description = "HIE not found")
    @ApiResponse(responseCode = "400", description = "Invalid request data")
    @PreAuthorize("hasRole('HIE_ADMIN') or hasRole('SYSTEM_ADMIN')")
    public ResponseEntity<HieResponseDto> updateHie(
            @Parameter(description = "HIE ID") @PathVariable UUID hieId,
            @Valid @RequestBody HieCreateRequestDto updateRequest) {
        log.info("Updating HIE with ID: {}", hieId);
        HieResponseDto response = hieService.updateHie(hieId, updateRequest);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{hieId}")
    @Operation(summary = "Get HIE by ID", description = "Retrieve Health Information Exchange by ID")
    @ApiResponse(responseCode = "200", description = "HIE found")
    @ApiResponse(responseCode = "404", description = "HIE not found")
    @PreAuthorize("hasRole('HIE_USER') or hasRole('HIE_ADMIN') or hasRole('SYSTEM_ADMIN')")
    public ResponseEntity<HieResponseDto> getHieById(
            @Parameter(description = "HIE ID") @PathVariable UUID hieId) {
        log.debug("Fetching HIE by ID: {}", hieId);
        HieResponseDto response = hieService.getHieById(hieId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/code/{hieCode}")
    @Operation(summary = "Get HIE by code", description = "Retrieve Health Information Exchange by code")
    @ApiResponse(responseCode = "200", description = "HIE found")
    @ApiResponse(responseCode = "404", description = "HIE not found")
    @PreAuthorize("hasRole('HIE_USER') or hasRole('HIE_ADMIN') or hasRole('SYSTEM_ADMIN')")
    public ResponseEntity<HieResponseDto> getHieByCode(
            @Parameter(description = "HIE Code") @PathVariable String hieCode) {
        log.debug("Fetching HIE by code: {}", hieCode);
        HieResponseDto response = hieService.getHieByCode(hieCode);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/name/{hieName}")
    @Operation(summary = "Get HIE by name", description = "Retrieve Health Information Exchange by name")
    @ApiResponse(responseCode = "200", description = "HIE found")
    @ApiResponse(responseCode = "404", description = "HIE not found")
    @PreAuthorize("hasRole('HIE_USER') or hasRole('HIE_ADMIN') or hasRole('SYSTEM_ADMIN')")
    public ResponseEntity<HieResponseDto> getHieByName(
            @Parameter(description = "HIE Name") @PathVariable String hieName) {
        log.debug("Fetching HIE by name: {}", hieName);
        HieResponseDto response = hieService.getHieByName(hieName);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    @Operation(summary = "Get all HIEs", description = "Retrieve all Health Information Exchanges with pagination")
    @ApiResponse(responseCode = "200", description = "HIEs retrieved successfully")
    @PreAuthorize("hasRole('HIE_USER') or hasRole('HIE_ADMIN') or hasRole('SYSTEM_ADMIN')")
    public ResponseEntity<Page<HieResponseDto>> getAllHies(
            @PageableDefault(size = 20, sort = "hieName", direction = Sort.Direction.ASC) Pageable pageable) {
        log.debug("Fetching all HIEs with pagination: {}", pageable);
        Page<HieResponseDto> response = hieService.getAllHies(pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/status/{status}")
    @Operation(summary = "Get HIEs by status", description = "Retrieve HIEs filtered by status")
    @ApiResponse(responseCode = "200", description = "HIEs retrieved successfully")
    @PreAuthorize("hasRole('HIE_USER') or hasRole('HIE_ADMIN') or hasRole('SYSTEM_ADMIN')")
    public ResponseEntity<List<HieResponseDto>> getHiesByStatus(
            @Parameter(description = "HIE Status") @PathVariable HieStatus status) {
        log.debug("Fetching HIEs by status: {}", status);
        List<HieResponseDto> response = hieService.getHiesByStatus(status);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/type/{type}")
    @Operation(summary = "Get HIEs by type", description = "Retrieve HIEs filtered by type")
    @ApiResponse(responseCode = "200", description = "HIEs retrieved successfully")
    @PreAuthorize("hasRole('HIE_USER') or hasRole('HIE_ADMIN') or hasRole('SYSTEM_ADMIN')")
    public ResponseEntity<List<HieResponseDto>> getHiesByType(
            @Parameter(description = "HIE Type") @PathVariable HieType type) {
        log.debug("Fetching HIEs by type: {}", type);
        List<HieResponseDto> response = hieService.getHiesByType(type);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/region/{region}")
    @Operation(summary = "Get HIEs by region", description = "Retrieve HIEs filtered by geographic region")
    @ApiResponse(responseCode = "200", description = "HIEs retrieved successfully")
    @PreAuthorize("hasRole('HIE_USER') or hasRole('HIE_ADMIN') or hasRole('SYSTEM_ADMIN')")
    public ResponseEntity<List<HieResponseDto>> getHiesByRegion(
            @Parameter(description = "Geographic Region") @PathVariable String region) {
        log.debug("Fetching HIEs by region: {}", region);
        List<HieResponseDto> response = hieService.getHiesByGeographicRegion(region);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/search")
    @Operation(summary = "Search HIEs", description = "Search HIEs by name or description")
    @ApiResponse(responseCode = "200", description = "Search completed successfully")
    @PreAuthorize("hasRole('HIE_USER') or hasRole('HIE_ADMIN') or hasRole('SYSTEM_ADMIN')")
    public ResponseEntity<Page<HieResponseDto>> searchHies(
            @Parameter(description = "Search term") @RequestParam String searchTerm,
            @PageableDefault(size = 20, sort = "hieName", direction = Sort.Direction.ASC) Pageable pageable) {
        log.debug("Searching HIEs with term: {}", searchTerm);
        Page<HieResponseDto> response = hieService.searchHies(searchTerm, pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/active-agreements")
    @Operation(summary = "Get HIEs with active data sharing agreements", 
               description = "Retrieve HIEs that have active data sharing agreements")
    @ApiResponse(responseCode = "200", description = "HIEs retrieved successfully")
    @PreAuthorize("hasRole('HIE_USER') or hasRole('HIE_ADMIN') or hasRole('SYSTEM_ADMIN')")
    public ResponseEntity<List<HieResponseDto>> getHiesWithActiveAgreements() {
        log.debug("Fetching HIEs with active data sharing agreements");
        List<HieResponseDto> response = hieService.getHiesWithActiveDataSharingAgreements();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/fhir-support/{version}")
    @Operation(summary = "Get HIEs supporting FHIR version", 
               description = "Retrieve HIEs that support specific FHIR version")
    @ApiResponse(responseCode = "200", description = "HIEs retrieved successfully")
    @PreAuthorize("hasRole('HIE_USER') or hasRole('HIE_ADMIN') or hasRole('SYSTEM_ADMIN')")
    public ResponseEntity<List<HieResponseDto>> getHiesSupportingFhir(
            @Parameter(description = "FHIR Version") @PathVariable String version) {
        log.debug("Fetching HIEs supporting FHIR version: {}", version);
        List<HieResponseDto> response = hieService.getHiesSupportingFhirVersion(version);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/hl7-support/{version}")
    @Operation(summary = "Get HIEs supporting HL7 version", 
               description = "Retrieve HIEs that support specific HL7 version")
    @ApiResponse(responseCode = "200", description = "HIEs retrieved successfully")
    @PreAuthorize("hasRole('HIE_USER') or hasRole('HIE_ADMIN') or hasRole('SYSTEM_ADMIN')")
    public ResponseEntity<List<HieResponseDto>> getHiesSupportingHl7(
            @Parameter(description = "HL7 Version") @PathVariable String version) {
        log.debug("Fetching HIEs supporting HL7 version: {}", version);
        List<HieResponseDto> response = hieService.getHiesSupportingHl7Version(version);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/high-performance")
    @Operation(summary = "Get high-performance HIEs", 
               description = "Retrieve HIEs with excellent performance metrics")
    @ApiResponse(responseCode = "200", description = "HIEs retrieved successfully")
    @PreAuthorize("hasRole('HIE_USER') or hasRole('HIE_ADMIN') or hasRole('SYSTEM_ADMIN')")
    public ResponseEntity<List<HieResponseDto>> getHighPerformanceHies() {
        log.debug("Fetching high-performance HIEs");
        List<HieResponseDto> response = hieService.getHighPerformanceHies();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/performance-issues")
    @Operation(summary = "Get HIEs with performance issues", 
               description = "Retrieve HIEs that have performance problems")
    @ApiResponse(responseCode = "200", description = "HIEs retrieved successfully")
    @PreAuthorize("hasRole('HIE_ADMIN') or hasRole('SYSTEM_ADMIN')")
    public ResponseEntity<List<HieResponseDto>> getHiesWithPerformanceIssues() {
        log.debug("Fetching HIEs with performance issues");
        List<HieResponseDto> response = hieService.getHiesWithPerformanceIssues();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/due-for-test")
    @Operation(summary = "Get HIEs due for connection test", 
               description = "Retrieve HIEs that are due for connectivity testing")
    @ApiResponse(responseCode = "200", description = "HIEs retrieved successfully")
    @PreAuthorize("hasRole('HIE_ADMIN') or hasRole('SYSTEM_ADMIN')")
    public ResponseEntity<List<HieResponseDto>> getHiesDueForTest() {
        log.debug("Fetching HIEs due for connection test");
        List<HieResponseDto> response = hieService.getHiesDueForConnectionTest();
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{hieId}/status")
    @Operation(summary = "Update HIE status", description = "Update the status of an HIE")
    @ApiResponse(responseCode = "200", description = "Status updated successfully")
    @ApiResponse(responseCode = "404", description = "HIE not found")
    @PreAuthorize("hasRole('HIE_ADMIN') or hasRole('SYSTEM_ADMIN')")
    public ResponseEntity<HieResponseDto> updateHieStatus(
            @Parameter(description = "HIE ID") @PathVariable UUID hieId,
            @Parameter(description = "New status") @RequestParam HieStatus status) {
        log.info("Updating HIE status. ID: {}, Status: {}", hieId, status);
        HieResponseDto response = hieService.updateHieStatus(hieId, status);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{hieId}/test-connectivity")
    @Operation(summary = "Test HIE connectivity", description = "Test connectivity to an HIE")
    @ApiResponse(responseCode = "200", description = "Connectivity test completed")
    @ApiResponse(responseCode = "404", description = "HIE not found")
    @PreAuthorize("hasRole('HIE_ADMIN') or hasRole('SYSTEM_ADMIN')")
    public ResponseEntity<Map<String, Object>> testConnectivity(
            @Parameter(description = "HIE ID") @PathVariable UUID hieId) {
        log.info("Testing connectivity for HIE ID: {}", hieId);
        Map<String, Object> response = hieService.testHieConnectivity(hieId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{hieId}/test-all-endpoints")
    @Operation(summary = "Test all HIE endpoints", description = "Test all configured endpoints for an HIE")
    @ApiResponse(responseCode = "200", description = "Endpoint tests completed")
    @ApiResponse(responseCode = "404", description = "HIE not found")
    @PreAuthorize("hasRole('HIE_ADMIN') or hasRole('SYSTEM_ADMIN')")
    public ResponseEntity<Map<String, Object>> testAllEndpoints(
            @Parameter(description = "HIE ID") @PathVariable UUID hieId) {
        log.info("Testing all endpoints for HIE ID: {}", hieId);
        Map<String, Object> response = hieService.testAllHieEndpoints(hieId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{hieId}/validate-configuration")
    @Operation(summary = "Validate HIE configuration", description = "Validate the configuration of an HIE")
    @ApiResponse(responseCode = "200", description = "Validation completed")
    @ApiResponse(responseCode = "404", description = "HIE not found")
    @PreAuthorize("hasRole('HIE_ADMIN') or hasRole('SYSTEM_ADMIN')")
    public ResponseEntity<Map<String, Object>> validateConfiguration(
            @Parameter(description = "HIE ID") @PathVariable UUID hieId) {
        log.info("Validating configuration for HIE ID: {}", hieId);
        Map<String, Object> response = hieService.validateHieConfiguration(hieId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/statistics")
    @Operation(summary = "Get HIE statistics", description = "Retrieve overall HIE statistics")
    @ApiResponse(responseCode = "200", description = "Statistics retrieved successfully")
    @PreAuthorize("hasRole('HIE_USER') or hasRole('HIE_ADMIN') or hasRole('SYSTEM_ADMIN')")
    public ResponseEntity<Map<String, Object>> getStatistics() {
        log.debug("Fetching HIE statistics");
        Map<String, Object> response = hieService.getHieStatistics();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/status-distribution")
    @Operation(summary = "Get status distribution", description = "Retrieve HIE status distribution")
    @ApiResponse(responseCode = "200", description = "Distribution retrieved successfully")
    @PreAuthorize("hasRole('HIE_USER') or hasRole('HIE_ADMIN') or hasRole('SYSTEM_ADMIN')")
    public ResponseEntity<Map<HieStatus, Long>> getStatusDistribution() {
        log.debug("Fetching HIE status distribution");
        Map<HieStatus, Long> response = hieService.getHieStatusDistribution();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/type-distribution")
    @Operation(summary = "Get type distribution", description = "Retrieve HIE type distribution")
    @ApiResponse(responseCode = "200", description = "Distribution retrieved successfully")
    @PreAuthorize("hasRole('HIE_USER') or hasRole('HIE_ADMIN') or hasRole('SYSTEM_ADMIN')")
    public ResponseEntity<Map<HieType, Long>> getTypeDistribution() {
        log.debug("Fetching HIE type distribution");
        Map<HieType, Long> response = hieService.getHieTypeDistribution();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{hieId}/performance-summary")
    @Operation(summary = "Get HIE performance summary", description = "Retrieve performance summary for an HIE")
    @ApiResponse(responseCode = "200", description = "Performance summary retrieved")
    @ApiResponse(responseCode = "404", description = "HIE not found")
    @PreAuthorize("hasRole('HIE_USER') or hasRole('HIE_ADMIN') or hasRole('SYSTEM_ADMIN')")
    public ResponseEntity<Map<String, Object>> getPerformanceSummary(
            @Parameter(description = "HIE ID") @PathVariable UUID hieId,
            @Parameter(description = "Start date") @RequestParam 
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @Parameter(description = "End date") @RequestParam 
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        log.debug("Fetching performance summary for HIE ID: {}", hieId);
        Map<String, Object> response = hieService.getHiePerformanceSummary(hieId, startDate, endDate);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{hieId}/uptime-report")
    @Operation(summary = "Get HIE uptime report", description = "Retrieve uptime report for an HIE")
    @ApiResponse(responseCode = "200", description = "Uptime report retrieved")
    @ApiResponse(responseCode = "404", description = "HIE not found")
    @PreAuthorize("hasRole('HIE_USER') or hasRole('HIE_ADMIN') or hasRole('SYSTEM_ADMIN')")
    public ResponseEntity<Map<String, Object>> getUptimeReport(
            @Parameter(description = "HIE ID") @PathVariable UUID hieId,
            @Parameter(description = "Start date") @RequestParam 
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @Parameter(description = "End date") @RequestParam 
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        log.debug("Fetching uptime report for HIE ID: {}", hieId);
        Map<String, Object> response = hieService.getHieUptimeReport(hieId, startDate, endDate);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{hieId}/refresh-metrics")
    @Operation(summary = "Refresh HIE performance metrics", description = "Refresh performance metrics for an HIE")
    @ApiResponse(responseCode = "200", description = "Metrics refreshed successfully")
    @ApiResponse(responseCode = "404", description = "HIE not found")
    @PreAuthorize("hasRole('HIE_ADMIN') or hasRole('SYSTEM_ADMIN')")
    public ResponseEntity<Void> refreshMetrics(
            @Parameter(description = "HIE ID") @PathVariable UUID hieId) {
        log.info("Refreshing metrics for HIE ID: {}", hieId);
        hieService.refreshPerformanceMetrics(hieId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/refresh-all-metrics")
    @Operation(summary = "Refresh all HIE metrics", description = "Refresh performance metrics for all HIEs")
    @ApiResponse(responseCode = "200", description = "All metrics refreshed successfully")
    @PreAuthorize("hasRole('HIE_ADMIN') or hasRole('SYSTEM_ADMIN')")
    public ResponseEntity<Void> refreshAllMetrics() {
        log.info("Refreshing metrics for all HIEs");
        hieService.refreshAllPerformanceMetrics();
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{hieId}/archive")
    @Operation(summary = "Archive HIE", description = "Archive an inactive HIE")
    @ApiResponse(responseCode = "200", description = "HIE archived successfully")
    @ApiResponse(responseCode = "404", description = "HIE not found")
    @PreAuthorize("hasRole('HIE_ADMIN') or hasRole('SYSTEM_ADMIN')")
    public ResponseEntity<Void> archiveHie(
            @Parameter(description = "HIE ID") @PathVariable UUID hieId) {
        log.info("Archiving HIE with ID: {}", hieId);
        hieService.archiveHie(hieId);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{hieId}/reactivate")
    @Operation(summary = "Reactivate HIE", description = "Reactivate an archived HIE")
    @ApiResponse(responseCode = "200", description = "HIE reactivated successfully")
    @ApiResponse(responseCode = "404", description = "HIE not found")
    @PreAuthorize("hasRole('HIE_ADMIN') or hasRole('SYSTEM_ADMIN')")
    public ResponseEntity<Void> reactivateHie(
            @Parameter(description = "HIE ID") @PathVariable UUID hieId) {
        log.info("Reactivating HIE with ID: {}", hieId);
        hieService.reactivateHie(hieId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{hieId}")
    @Operation(summary = "Delete HIE", description = "Soft delete an HIE")
    @ApiResponse(responseCode = "204", description = "HIE deleted successfully")
    @ApiResponse(responseCode = "404", description = "HIE not found")
    @PreAuthorize("hasRole('SYSTEM_ADMIN')")
    public ResponseEntity<Void> deleteHie(
            @Parameter(description = "HIE ID") @PathVariable UUID hieId) {
        log.info("Soft deleting HIE with ID: {}", hieId);
        hieService.deleteHie(hieId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{hieId}/export-configuration")
    @Operation(summary = "Export HIE configuration", description = "Export HIE configuration as JSON")
    @ApiResponse(responseCode = "200", description = "Configuration exported successfully")
    @ApiResponse(responseCode = "404", description = "HIE not found")
    @PreAuthorize("hasRole('HIE_ADMIN') or hasRole('SYSTEM_ADMIN')")
    public ResponseEntity<Map<String, Object>> exportConfiguration(
            @Parameter(description = "HIE ID") @PathVariable UUID hieId) {
        log.info("Exporting configuration for HIE ID: {}", hieId);
        Map<String, Object> response = hieService.exportHieConfiguration(hieId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/import-configuration")
    @Operation(summary = "Import HIE configuration", description = "Import HIE configuration from JSON")
    @ApiResponse(responseCode = "201", description = "Configuration imported successfully")
    @ApiResponse(responseCode = "400", description = "Invalid configuration data")
    @PreAuthorize("hasRole('HIE_ADMIN') or hasRole('SYSTEM_ADMIN')")
    public ResponseEntity<HieResponseDto> importConfiguration(
            @RequestBody Map<String, Object> configuration) {
        log.info("Importing HIE configuration");
        HieResponseDto response = hieService.importHieConfiguration(configuration);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PatchMapping("/bulk-status-update")
    @Operation(summary = "Bulk update HIE status", description = "Update status for multiple HIEs")
    @ApiResponse(responseCode = "200", description = "Bulk update completed")
    @PreAuthorize("hasRole('HIE_ADMIN') or hasRole('SYSTEM_ADMIN')")
    public ResponseEntity<Map<String, Object>> bulkUpdateStatus(
            @Parameter(description = "HIE IDs") @RequestParam List<UUID> hieIds,
            @Parameter(description = "New status") @RequestParam HieStatus status) {
        log.info("Bulk updating status for {} HIEs to {}", hieIds.size(), status);
        int updated = hieService.bulkUpdateHieStatus(hieIds, status);
        
        Map<String, Object> response = Map.of(
            "totalRequested", hieIds.size(),
            "totalUpdated", updated,
            "status", status
        );
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{hieId}/health-status")
    @Operation(summary = "Get HIE health status", description = "Get current health status of an HIE")
    @ApiResponse(responseCode = "200", description = "Health status retrieved")
    @ApiResponse(responseCode = "404", description = "HIE not found")
    @PreAuthorize("hasRole('HIE_USER') or hasRole('HIE_ADMIN') or hasRole('SYSTEM_ADMIN')")
    public ResponseEntity<Map<String, String>> getHealthStatus(
            @Parameter(description = "HIE ID") @PathVariable UUID hieId) {
        log.debug("Getting health status for HIE ID: {}", hieId);
        String healthStatus = hieService.getHieHealthStatus(hieId);
        return ResponseEntity.ok(Map.of("healthStatus", healthStatus));
    }

    @GetMapping("/check-name-availability")
    @Operation(summary = "Check HIE name availability", description = "Check if HIE name is available")
    @ApiResponse(responseCode = "200", description = "Availability checked")
    @PreAuthorize("hasRole('HIE_USER') or hasRole('HIE_ADMIN') or hasRole('SYSTEM_ADMIN')")
    public ResponseEntity<Map<String, Boolean>> checkNameAvailability(
            @Parameter(description = "HIE name") @RequestParam String hieName) {
        log.debug("Checking name availability for: {}", hieName);
        boolean available = hieService.isHieNameAvailable(hieName);
        return ResponseEntity.ok(Map.of("available", available));
    }

    @GetMapping("/check-code-availability")
    @Operation(summary = "Check HIE code availability", description = "Check if HIE code is available")
    @ApiResponse(responseCode = "200", description = "Availability checked")
    @PreAuthorize("hasRole('HIE_USER') or hasRole('HIE_ADMIN') or hasRole('SYSTEM_ADMIN')")
    public ResponseEntity<Map<String, Boolean>> checkCodeAvailability(
            @Parameter(description = "HIE code") @RequestParam String hieCode) {
        log.debug("Checking code availability for: {}", hieCode);
        boolean available = hieService.isHieCodeAvailable(hieCode);
        return ResponseEntity.ok(Map.of("available", available));
    }

    @GetMapping("/connectivity-report")
    @Operation(summary = "Generate connectivity report", description = "Generate comprehensive connectivity report")
    @ApiResponse(responseCode = "200", description = "Report generated successfully")
    @PreAuthorize("hasRole('HIE_ADMIN') or hasRole('SYSTEM_ADMIN')")
    public ResponseEntity<Map<String, Object>> generateConnectivityReport(
            @Parameter(description = "Start date") @RequestParam 
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @Parameter(description = "End date") @RequestParam 
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        log.info("Generating connectivity report from {} to {}", startDate, endDate);
        Map<String, Object> response = hieService.generateConnectivityReport(startDate, endDate);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/schedule-connectivity-tests")
    @Operation(summary = "Schedule connectivity tests", description = "Schedule connectivity tests for all HIEs")
    @ApiResponse(responseCode = "200", description = "Tests scheduled successfully")
    @PreAuthorize("hasRole('HIE_ADMIN') or hasRole('SYSTEM_ADMIN')")
    public ResponseEntity<Void> scheduleConnectivityTests() {
        log.info("Scheduling connectivity tests for all HIEs");
        hieService.scheduleConnectivityTests();
        return ResponseEntity.ok().build();
    }
}