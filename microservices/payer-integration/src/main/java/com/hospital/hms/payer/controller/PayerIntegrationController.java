package com.hospital.hms.payer.controller;

import com.hospital.hms.payer.dto.*;
import com.hospital.hms.payer.service.PayerIntegrationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * Payer Integration REST Controller
 * Handles insurance processing, claims management, and eligibility verification
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@RestController
@RequestMapping("/api/v1/payer-integration")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Payer Integration", description = "Insurance processing and claims management APIs")
public class PayerIntegrationController {

    private final PayerIntegrationService payerIntegrationService;

    // ===============================
    // Insurance Claims Management
    // ===============================

    @PostMapping("/claims")
    @PreAuthorize("hasRole('BILLING_MANAGER') or hasRole('CLAIMS_SPECIALIST')")
    @Operation(summary = "Create a new insurance claim", description = "Creates a new insurance claim for a patient")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Claim created successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid request data"),
        @ApiResponse(responseCode = "403", description = "Access denied"),
        @ApiResponse(responseCode = "409", description = "Duplicate claim detected")
    })
    public ResponseEntity<InsuranceClaimResponseDto> createClaim(
            @Valid @RequestBody InsuranceClaimCreateRequestDto request) {
        log.info("Creating insurance claim for patient: {}", request.getPatientId());
        
        InsuranceClaimResponseDto response = payerIntegrationService.createClaim(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/claims/{claimId}")
    @PreAuthorize("hasRole('BILLING_MANAGER') or hasRole('CLAIMS_SPECIALIST') or hasRole('PROVIDER')")
    @Operation(summary = "Get claim by ID", description = "Retrieves an insurance claim by its ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Claim found"),
        @ApiResponse(responseCode = "404", description = "Claim not found"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public ResponseEntity<InsuranceClaimResponseDto> getClaimById(
            @Parameter(description = "Claim ID") @PathVariable UUID claimId) {
        log.debug("Retrieving claim: {}", claimId);
        
        InsuranceClaimResponseDto response = payerIntegrationService.getClaimById(claimId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/claims/number/{claimNumber}")
    @PreAuthorize("hasRole('BILLING_MANAGER') or hasRole('CLAIMS_SPECIALIST') or hasRole('PROVIDER')")
    @Operation(summary = "Get claim by number", description = "Retrieves an insurance claim by its claim number")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Claim found"),
        @ApiResponse(responseCode = "404", description = "Claim not found"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public ResponseEntity<InsuranceClaimResponseDto> getClaimByNumber(
            @Parameter(description = "Claim number") @PathVariable String claimNumber) {
        log.debug("Retrieving claim by number: {}", claimNumber);
        
        InsuranceClaimResponseDto response = payerIntegrationService.getClaimByNumber(claimNumber);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/claims/{claimId}")
    @PreAuthorize("hasRole('BILLING_MANAGER') or hasRole('CLAIMS_SPECIALIST')")
    @Operation(summary = "Update a claim", description = "Updates an existing insurance claim")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Claim updated successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid request data"),
        @ApiResponse(responseCode = "404", description = "Claim not found"),
        @ApiResponse(responseCode = "403", description = "Access denied"),
        @ApiResponse(responseCode = "409", description = "Claim cannot be updated in current status")
    })
    public ResponseEntity<InsuranceClaimResponseDto> updateClaim(
            @Parameter(description = "Claim ID") @PathVariable UUID claimId,
            @Valid @RequestBody InsuranceClaimUpdateRequestDto request) {
        log.info("Updating claim: {}", claimId);
        
        InsuranceClaimResponseDto response = payerIntegrationService.updateClaim(claimId, request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/claims/{claimId}/submit")
    @PreAuthorize("hasRole('BILLING_MANAGER') or hasRole('CLAIMS_SPECIALIST')")
    @Operation(summary = "Submit a claim", description = "Submits an insurance claim to the payer")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Claim submitted successfully"),
        @ApiResponse(responseCode = "404", description = "Claim not found"),
        @ApiResponse(responseCode = "403", description = "Access denied"),
        @ApiResponse(responseCode = "409", description = "Claim cannot be submitted in current status"),
        @ApiResponse(responseCode = "500", description = "Submission failed")
    })
    public ResponseEntity<InsuranceClaimResponseDto> submitClaim(
            @Parameter(description = "Claim ID") @PathVariable UUID claimId) {
        log.info("Submitting claim: {}", claimId);
        
        InsuranceClaimResponseDto response = payerIntegrationService.submitClaim(claimId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/claims/search")
    @PreAuthorize("hasRole('BILLING_MANAGER') or hasRole('CLAIMS_SPECIALIST') or hasRole('PROVIDER')")
    @Operation(summary = "Search claims", description = "Searches insurance claims based on criteria")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Claims retrieved successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid search criteria"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public ResponseEntity<Page<InsuranceClaimResponseDto>> searchClaims(
            @Parameter(description = "Search criteria") @ModelAttribute ClaimSearchCriteria criteria,
            @PageableDefault(size = 20) Pageable pageable) {
        log.debug("Searching claims with criteria: {}", criteria);
        
        Page<InsuranceClaimResponseDto> response = payerIntegrationService.searchClaims(criteria, pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/claims/{claimId}/status")
    @PreAuthorize("hasRole('BILLING_MANAGER') or hasRole('CLAIMS_SPECIALIST') or hasRole('PROVIDER')")
    @Operation(summary = "Get claim status", description = "Retrieves the current status of an insurance claim")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Status retrieved successfully"),
        @ApiResponse(responseCode = "404", description = "Claim not found"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public ResponseEntity<ClaimStatusResponseDto> getClaimStatus(
            @Parameter(description = "Claim ID") @PathVariable UUID claimId) {
        log.debug("Retrieving claim status: {}", claimId);
        
        ClaimStatusResponseDto response = payerIntegrationService.getClaimStatus(claimId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/claims/{claimId}/payment")
    @PreAuthorize("hasRole('BILLING_MANAGER') or hasRole('FINANCE_MANAGER')")
    @Operation(summary = "Process claim payment", description = "Processes payment for an approved claim")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Payment processed successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid payment data"),
        @ApiResponse(responseCode = "404", description = "Claim not found"),
        @ApiResponse(responseCode = "403", description = "Access denied"),
        @ApiResponse(responseCode = "409", description = "Claim not eligible for payment")
    })
    public ResponseEntity<ClaimPaymentResponseDto> processPayment(
            @Parameter(description = "Claim ID") @PathVariable UUID claimId,
            @Valid @RequestBody ClaimPaymentRequestDto request) {
        log.info("Processing payment for claim: {}", claimId);
        
        ClaimPaymentResponseDto response = payerIntegrationService.processPayment(claimId, request);
        return ResponseEntity.ok(response);
    }

    // ===============================
    // Eligibility Verification
    // ===============================

    @PostMapping("/eligibility/verify")
    @PreAuthorize("hasRole('REGISTRATION_STAFF') or hasRole('PROVIDER') or hasRole('BILLING_MANAGER')")
    @Operation(summary = "Verify patient eligibility", description = "Verifies patient insurance eligibility")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Eligibility verified successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid request data"),
        @ApiResponse(responseCode = "403", description = "Access denied"),
        @ApiResponse(responseCode = "500", description = "Verification failed")
    })
    public ResponseEntity<EligibilityVerificationResponseDto> verifyEligibility(
            @Valid @RequestBody EligibilityVerificationRequestDto request) {
        log.info("Verifying eligibility for patient: {}", request.getPatientId());
        
        EligibilityVerificationResponseDto response = payerIntegrationService.verifyEligibility(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/eligibility/{verificationId}")
    @PreAuthorize("hasRole('REGISTRATION_STAFF') or hasRole('PROVIDER') or hasRole('BILLING_MANAGER')")
    @Operation(summary = "Get eligibility verification", description = "Retrieves an eligibility verification by ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Verification found"),
        @ApiResponse(responseCode = "404", description = "Verification not found"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public ResponseEntity<EligibilityVerificationResponseDto> getEligibilityById(
            @Parameter(description = "Verification ID") @PathVariable UUID verificationId) {
        log.debug("Retrieving eligibility verification: {}", verificationId);
        
        EligibilityVerificationResponseDto response = payerIntegrationService.getEligibilityById(verificationId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/eligibility/patient/{patientId}")
    @PreAuthorize("hasRole('REGISTRATION_STAFF') or hasRole('PROVIDER') or hasRole('BILLING_MANAGER')")
    @Operation(summary = "Get patient eligibilities", description = "Retrieves all eligibility verifications for a patient")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Eligibilities retrieved successfully"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public ResponseEntity<List<EligibilityVerificationResponseDto>> getPatientEligibilities(
            @Parameter(description = "Patient ID") @PathVariable UUID patientId) {
        log.debug("Retrieving eligibilities for patient: {}", patientId);
        
        List<EligibilityVerificationResponseDto> response = payerIntegrationService.getPatientEligibilities(patientId);
        return ResponseEntity.ok(response);
    }

    // ===============================
    // Dashboard and Reporting
    // ===============================

    @GetMapping("/dashboard/stats")
    @PreAuthorize("hasRole('BILLING_MANAGER') or hasRole('FINANCE_MANAGER') or hasRole('ADMIN')")
    @Operation(summary = "Get dashboard statistics", description = "Retrieves payer integration dashboard statistics")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Statistics retrieved successfully"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public ResponseEntity<PayerDashboardStatsDto> getDashboardStats() {
        log.debug("Retrieving dashboard statistics");
        
        PayerDashboardStatsDto response = payerIntegrationService.getDashboardStats();
        return ResponseEntity.ok(response);
    }

    // ===============================
    // Health Check
    // ===============================

    @GetMapping("/health")
    @Operation(summary = "Health check", description = "Checks the health of the payer integration service")
    @ApiResponse(responseCode = "200", description = "Service is healthy")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("Payer Integration Service is healthy");
    }
}
