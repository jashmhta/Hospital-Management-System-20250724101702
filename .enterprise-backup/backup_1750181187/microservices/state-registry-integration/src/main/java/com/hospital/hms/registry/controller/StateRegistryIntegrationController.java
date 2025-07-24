package com.hospital.hms.registry.controller;

import com.hospital.hms.registry.dto.*;
import com.hospital.hms.registry.service.StateRegistryIntegrationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;

/**
 * REST Controller for State Registry Integration Service
 * 
 * Provides endpoints for public health reporting and state registry integration:
 * - Birth and death registration
 * - Disease surveillance reporting
 * - Immunization registry submissions
 * - Cancer registry reporting
 * - Vital statistics compilation
 * - Public health compliance monitoring
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@RestController
@RequestMapping("/api/v1/state-registry")
@RequiredArgsConstructor
@Slf4j
@Validated
@Tag(name = "State Registry Integration", description = "Public health reporting and state registry integration APIs")
@SecurityRequirement(name = "Bearer Authentication")
public class StateRegistryIntegrationController {

    private final StateRegistryIntegrationService stateRegistryIntegrationService;

    // ===== REPORT MANAGEMENT ENDPOINTS =====

    @PostMapping("/reports")
    @Operation(summary = "Create public health report", 
               description = "Create a new public health report for state registry submission")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Report created successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid request data"),
        @ApiResponse(responseCode = "401", description = "Unauthorized"),
        @ApiResponse(responseCode = "403", description = "Forbidden"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PreAuthorize("hasAnyRole('PUBLIC_HEALTH_REPORTER', 'ADMIN', 'PHYSICIAN', 'NURSE')")\n    public ResponseEntity<PublicHealthReportResponseDto> createReport(\n        @Valid @RequestBody PublicHealthReportCreateRequestDto request) {\n        \n        log.info(\"Creating public health report of type: {}\", request.getReportType());\n        \n        PublicHealthReportResponseDto response = stateRegistryIntegrationService.createReport(request);\n        \n        return ResponseEntity.status(HttpStatus.CREATED).body(response);\n    }\n\n    @GetMapping(\"/reports/{reportId}\")\n    @Operation(summary = \"Get report by ID\", \n               description = \"Retrieve a specific public health report by its ID\")\n    @ApiResponses(value = {\n        @ApiResponse(responseCode = \"200\", description = \"Report found\"),\n        @ApiResponse(responseCode = \"404\", description = \"Report not found\"),\n        @ApiResponse(responseCode = \"401\", description = \"Unauthorized\"),\n        @ApiResponse(responseCode = \"403\", description = \"Forbidden\")\n    })\n    @PreAuthorize(\"hasAnyRole('PUBLIC_HEALTH_REPORTER', 'ADMIN', 'PHYSICIAN', 'NURSE', 'VIEWER')\")\n    public ResponseEntity<PublicHealthReportResponseDto> getReport(\n        @Parameter(description = \"Report ID\", required = true) \n        @PathVariable UUID reportId) {\n        \n        log.debug(\"Retrieving public health report: {}\", reportId);\n        \n        PublicHealthReportResponseDto response = stateRegistryIntegrationService.getReport(reportId);\n        \n        return ResponseEntity.ok(response);\n    }\n\n    @PutMapping(\"/reports/{reportId}\")\n    @Operation(summary = \"Update report\", \n               description = \"Update an existing public health report\")\n    @ApiResponses(value = {\n        @ApiResponse(responseCode = \"200\", description = \"Report updated successfully\"),\n        @ApiResponse(responseCode = \"400\", description = \"Invalid request data\"),\n        @ApiResponse(responseCode = \"404\", description = \"Report not found\"),\n        @ApiResponse(responseCode = \"409\", description = \"Report cannot be updated (already submitted)\"),\n        @ApiResponse(responseCode = \"401\", description = \"Unauthorized\"),\n        @ApiResponse(responseCode = \"403\", description = \"Forbidden\")\n    })\n    @PreAuthorize(\"hasAnyRole('PUBLIC_HEALTH_REPORTER', 'ADMIN', 'PHYSICIAN', 'NURSE')\")\n    public ResponseEntity<PublicHealthReportResponseDto> updateReport(\n        @Parameter(description = \"Report ID\", required = true) \n        @PathVariable UUID reportId,\n        @Valid @RequestBody PublicHealthReportUpdateRequestDto request) {\n        \n        log.info(\"Updating public health report: {}\", reportId);\n        \n        PublicHealthReportResponseDto response = stateRegistryIntegrationService.updateReport(reportId, request);\n        \n        return ResponseEntity.ok(response);\n    }\n\n    // ===== SUBMISSION ENDPOINTS =====\n\n    @PostMapping(\"/reports/{reportId}/submit\")\n    @Operation(summary = \"Submit report to registry\", \n               description = \"Submit a public health report to the appropriate state registry\")\n    @ApiResponses(value = {\n        @ApiResponse(responseCode = \"200\", description = \"Report submitted successfully\"),\n        @ApiResponse(responseCode = \"400\", description = \"Report not ready for submission\"),\n        @ApiResponse(responseCode = \"404\", description = \"Report not found\"),\n        @ApiResponse(responseCode = \"502\", description = \"Registry submission failed\"),\n        @ApiResponse(responseCode = \"401\", description = \"Unauthorized\"),\n        @ApiResponse(responseCode = \"403\", description = \"Forbidden\")\n    })\n    @PreAuthorize(\"hasAnyRole('PUBLIC_HEALTH_REPORTER', 'ADMIN')\")\n    public ResponseEntity<SubmissionResponseDto> submitReport(\n        @Parameter(description = \"Report ID\", required = true) \n        @PathVariable UUID reportId,\n        @Valid @RequestBody SubmissionRequestDto request) {\n        \n        log.info(\"Submitting public health report: {} to registry\", reportId);\n        \n        SubmissionResponseDto response = stateRegistryIntegrationService.submitReport(reportId, request);\n        \n        return ResponseEntity.ok(response);\n    }\n\n    @PostMapping(\"/reports/{reportId}/amendments\")\n    @Operation(summary = \"Create amendment\", \n               description = \"Create an amendment to an existing submitted report\")\n    @ApiResponses(value = {\n        @ApiResponse(responseCode = \"201\", description = \"Amendment created successfully\"),\n        @ApiResponse(responseCode = \"400\", description = \"Invalid amendment request\"),\n        @ApiResponse(responseCode = \"404\", description = \"Original report not found\"),\n        @ApiResponse(responseCode = \"409\", description = \"Amendment not allowed\"),\n        @ApiResponse(responseCode = \"401\", description = \"Unauthorized\"),\n        @ApiResponse(responseCode = \"403\", description = \"Forbidden\")\n    })\n    @PreAuthorize(\"hasAnyRole('PUBLIC_HEALTH_REPORTER', 'ADMIN')\")\n    public ResponseEntity<PublicHealthReportResponseDto> createAmendment(\n        @Parameter(description = \"Original report ID\", required = true) \n        @PathVariable UUID reportId,\n        @Valid @RequestBody AmendmentRequestDto request) {\n        \n        log.info(\"Creating amendment for report: {}\", reportId);\n        \n        PublicHealthReportResponseDto response = stateRegistryIntegrationService.createAmendment(reportId, request);\n        \n        return ResponseEntity.status(HttpStatus.CREATED).body(response);\n    }\n\n    // ===== SEARCH AND QUERY ENDPOINTS =====\n\n    @GetMapping(\"/reports/search\")\n    @Operation(summary = \"Search reports\", \n               description = \"Search public health reports with multiple criteria\")\n    @ApiResponses(value = {\n        @ApiResponse(responseCode = \"200\", description = \"Search completed successfully\"),\n        @ApiResponse(responseCode = \"400\", description = \"Invalid search criteria\"),\n        @ApiResponse(responseCode = \"401\", description = \"Unauthorized\"),\n        @ApiResponse(responseCode = \"403\", description = \"Forbidden\")\n    })\n    @PreAuthorize(\"hasAnyRole('PUBLIC_HEALTH_REPORTER', 'ADMIN', 'PHYSICIAN', 'NURSE', 'VIEWER')\")\n    public ResponseEntity<Page<PublicHealthReportResponseDto>> searchReports(\n        @Parameter(description = \"Search criteria\")\n        @ModelAttribute PublicHealthReportSearchCriteria criteria,\n        @PageableDefault(size = 20) Pageable pageable) {\n        \n        log.debug(\"Searching public health reports with criteria: {}\", criteria);\n        \n        Page<PublicHealthReportResponseDto> response = stateRegistryIntegrationService.searchReports(criteria, pageable);\n        \n        return ResponseEntity.ok(response);\n    }\n\n    @GetMapping(\"/reports/patient/{patientId}\")\n    @Operation(summary = \"Get reports for patient\", \n               description = \"Retrieve all public health reports for a specific patient\")\n    @ApiResponses(value = {\n        @ApiResponse(responseCode = \"200\", description = \"Reports retrieved successfully\"),\n        @ApiResponse(responseCode = \"401\", description = \"Unauthorized\"),\n        @ApiResponse(responseCode = \"403\", description = \"Forbidden\")\n    })\n    @PreAuthorize(\"hasAnyRole('PUBLIC_HEALTH_REPORTER', 'ADMIN', 'PHYSICIAN', 'NURSE', 'VIEWER')\")\n    public ResponseEntity<Page<PublicHealthReportResponseDto>> getReportsForPatient(\n        @Parameter(description = \"Patient ID\", required = true) \n        @PathVariable UUID patientId,\n        @PageableDefault(size = 20) Pageable pageable) {\n        \n        log.debug(\"Retrieving reports for patient: {}\", patientId);\n        \n        Page<PublicHealthReportResponseDto> response = stateRegistryIntegrationService.getReportsForPatient(patientId, pageable);\n        \n        return ResponseEntity.ok(response);\n    }\n\n    @GetMapping(\"/reports/overdue\")\n    @Operation(summary = \"Get overdue reports\", \n               description = \"Retrieve reports that are past their submission deadline\")\n    @ApiResponses(value = {\n        @ApiResponse(responseCode = \"200\", description = \"Overdue reports retrieved successfully\"),\n        @ApiResponse(responseCode = \"401\", description = \"Unauthorized\"),\n        @ApiResponse(responseCode = \"403\", description = \"Forbidden\")\n    })\n    @PreAuthorize(\"hasAnyRole('PUBLIC_HEALTH_REPORTER', 'ADMIN', 'MANAGER')\")\n    public ResponseEntity<List<PublicHealthReportResponseDto>> getOverdueReports() {\n        \n        log.debug(\"Retrieving overdue public health reports\");\n        \n        List<PublicHealthReportResponseDto> response = stateRegistryIntegrationService.getOverdueReports();\n        \n        return ResponseEntity.ok(response);\n    }\n\n    @GetMapping(\"/reports/high-priority\")\n    @Operation(summary = \"Get high priority pending reports\", \n               description = \"Retrieve high priority reports that are pending submission\")\n    @ApiResponses(value = {\n        @ApiResponse(responseCode = \"200\", description = \"High priority reports retrieved successfully\"),\n        @ApiResponse(responseCode = \"401\", description = \"Unauthorized\"),\n        @ApiResponse(responseCode = \"403\", description = \"Forbidden\")\n    })\n    @PreAuthorize(\"hasAnyRole('PUBLIC_HEALTH_REPORTER', 'ADMIN', 'MANAGER')\")\n    public ResponseEntity<List<PublicHealthReportResponseDto>> getHighPriorityPendingReports() {\n        \n        log.debug(\"Retrieving high priority pending reports\");\n        \n        List<PublicHealthReportResponseDto> response = stateRegistryIntegrationService.getHighPriorityPendingReports();\n        \n        return ResponseEntity.ok(response);\n    }\n\n    // ===== DASHBOARD AND ANALYTICS ENDPOINTS =====\n\n    @GetMapping(\"/dashboard/stats\")\n    @Operation(summary = \"Get dashboard statistics\", \n               description = \"Retrieve registry dashboard statistics and metrics\")\n    @ApiResponses(value = {\n        @ApiResponse(responseCode = \"200\", description = \"Statistics retrieved successfully\"),\n        @ApiResponse(responseCode = \"401\", description = \"Unauthorized\"),\n        @ApiResponse(responseCode = \"403\", description = \"Forbidden\")\n    })\n    @PreAuthorize(\"hasAnyRole('PUBLIC_HEALTH_REPORTER', 'ADMIN', 'MANAGER', 'VIEWER')\")\n    public ResponseEntity<RegistryDashboardStatsDto> getDashboardStats() {\n        \n        log.debug(\"Retrieving registry dashboard statistics\");\n        \n        RegistryDashboardStatsDto response = stateRegistryIntegrationService.getDashboardStats();\n        \n        return ResponseEntity.ok(response);\n    }\n\n    // ===== HEALTH CHECK ENDPOINT =====\n\n    @GetMapping(\"/health\")\n    @Operation(summary = \"Health check\", \n               description = \"Check the health status of the state registry integration service\")\n    @ApiResponse(responseCode = \"200\", description = \"Service is healthy\")\n    public ResponseEntity<String> healthCheck() {\n        return ResponseEntity.ok(\"State Registry Integration Service is healthy\");\n    }\n}\n"
      }
    }
  ]
}
```

### Message: 
```json
{
  "role": "tool",
  "text": "Successfully created file /workspace/Hospital-Management-System/microservices/state-registry-integration/src/main/java/com/hospital/hms/registry/controller/StateRegistryIntegrationController.java",
  "tool_name": "str_replace_editor",
  "tool_call_id": "toolu_vrtx_01BJFpAsN39trdkuYyviPfvd",
  "is_error": false
}
```