package com.hospital.hms.payer.service;

import com.hospital.hms.payer.dto.*;
import com.hospital.hms.payer.entity.*;
import com.hospital.hms.payer.exception.*;
import com.hospital.hms.payer.mapper.InsuranceClaimMapper;
import com.hospital.hms.payer.mapper.EligibilityVerificationMapper;
import com.hospital.hms.payer.repository.InsuranceClaimRepository;
import com.hospital.hms.payer.repository.EligibilityVerificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Payer Integration Service
 * Handles insurance processing, claims management, and eligibility verification
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class PayerIntegrationService {

    private final InsuranceClaimRepository claimRepository;
    private final EligibilityVerificationRepository eligibilityRepository;
    private final InsuranceClaimMapper claimMapper;
    private final EligibilityVerificationMapper eligibilityMapper;
    private final EdiTransactionService ediTransactionService;
    private final ClaimsProcessingService claimsProcessingService;
    private final EligibilityVerificationService eligibilityVerificationService;

    // ===============================
    // Insurance Claims Management
    // ===============================

    public InsuranceClaimResponseDto createClaim(InsuranceClaimCreateRequestDto request) {
        log.info("Creating new insurance claim for patient: {}", request.getPatientId());
        
        try {
            // Validate claim data
            validateClaimData(request);
            
            // Check for duplicate claims
            checkForDuplicateClaims(request);
            
            // Create claim entity
            InsuranceClaim claim = claimMapper.toEntity(request);
            claim.setClaimStatus(ClaimStatus.DRAFT);
            claim.setSubmissionDate(LocalDateTime.now());
            claim.setCreatedDate(LocalDateTime.now());
            
            // Generate claim number
            claim.setClaimNumber(generateClaimNumber());
            
            // Save claim
            InsuranceClaim savedClaim = claimRepository.save(claim);
            
            log.info("Insurance claim created successfully: {}", savedClaim.getClaimNumber());
            return claimMapper.toResponseDto(savedClaim);
            
        } catch (Exception e) {
            log.error("Error creating insurance claim: {}", e.getMessage(), e);
            throw new ClaimCreationException("Failed to create insurance claim", e);
        }
    }

    @Transactional(readOnly = true)
    public InsuranceClaimResponseDto getClaimById(UUID claimId) {
        log.debug("Retrieving insurance claim: {}", claimId);
        
        InsuranceClaim claim = claimRepository.findById(claimId)
            .orElseThrow(() -> new ClaimNotFoundException("Insurance claim not found: " + claimId));
        
        return claimMapper.toResponseDto(claim);
    }

    @Transactional(readOnly = true)
    public InsuranceClaimResponseDto getClaimByNumber(String claimNumber) {
        log.debug("Retrieving insurance claim by number: {}", claimNumber);
        
        InsuranceClaim claim = claimRepository.findByClaimNumber(claimNumber)
            .orElseThrow(() -> new ClaimNotFoundException("Insurance claim not found: " + claimNumber));
        
        return claimMapper.toResponseDto(claim);
    }

    public InsuranceClaimResponseDto updateClaim(UUID claimId, InsuranceClaimUpdateRequestDto request) {
        log.info("Updating insurance claim: {}", claimId);
        
        InsuranceClaim claim = claimRepository.findById(claimId)
            .orElseThrow(() -> new ClaimNotFoundException("Insurance claim not found: " + claimId));
        
        // Check if claim can be updated
        if (!canUpdateClaim(claim)) {
            throw new ClaimUpdateNotAllowedException("Claim cannot be updated in current status: " + claim.getClaimStatus());
        }
        
        // Update claim
        claimMapper.updateEntityFromDto(request, claim);
        claim.setLastModifiedDate(LocalDateTime.now());
        
        InsuranceClaim updatedClaim = claimRepository.save(claim);
        
        log.info("Insurance claim updated successfully: {}", claim.getClaimNumber());
        return claimMapper.toResponseDto(updatedClaim);
    }

    public InsuranceClaimResponseDto submitClaim(UUID claimId) {
        log.info("Submitting insurance claim: {}", claimId);
        
        InsuranceClaim claim = claimRepository.findById(claimId)
            .orElseThrow(() -> new ClaimNotFoundException("Insurance claim not found: " + claimId));
        
        // Validate claim before submission
        validateClaimForSubmission(claim);
        
        try {
            // Submit claim via EDI
            String transactionId = ediTransactionService.submitClaim837(claim);
            
            // Update claim status
            claim.setClaimStatus(ClaimStatus.SUBMITTED);
            claim.setSubmissionDate(LocalDateTime.now());
            claim.setEdiTransactionId(transactionId);
            
            InsuranceClaim submittedClaim = claimRepository.save(claim);
            
            log.info("Insurance claim submitted successfully: {}", claim.getClaimNumber());
            return claimMapper.toResponseDto(submittedClaim);
            
        } catch (Exception e) {
            log.error("Error submitting claim: {}", e.getMessage(), e);
            claim.setClaimStatus(ClaimStatus.SUBMISSION_FAILED);
            claimRepository.save(claim);
            throw new ClaimSubmissionException("Failed to submit claim", e);
        }
    }

    @Transactional(readOnly = true)
    public Page<InsuranceClaimResponseDto> searchClaims(ClaimSearchCriteria criteria, Pageable pageable) {
        log.debug("Searching insurance claims with criteria: {}", criteria);
        
        Page<InsuranceClaim> claims = claimRepository.findBySearchCriteria(
            criteria.getPatientId(),
            criteria.getProviderId(),
            criteria.getPayerId(),
            criteria.getClaimStatus(),
            criteria.getSubmissionDateFrom(),
            criteria.getSubmissionDateTo(),
            criteria.getClaimType(),
            pageable
        );
        
        return claims.map(claimMapper::toResponseDto);
    }

    // ===============================
    // Eligibility Verification
    // ===============================

    public EligibilityVerificationResponseDto verifyEligibility(EligibilityVerificationRequestDto request) {
        log.info("Verifying eligibility for patient: {}, payer: {}", request.getPatientId(), request.getPayerId());
        
        try {
            // Check for existing verification
            EligibilityVerification existingVerification = eligibilityRepository
                .findValidVerificationByPatientAndPayer(request.getPatientId(), request.getPayerId())
                .orElse(null);
            
            if (existingVerification != null && isVerificationValid(existingVerification)) {
                log.info("Using existing valid verification: {}", existingVerification.getId());
                return eligibilityMapper.toResponseDto(existingVerification);
            }
            
            // Perform new verification
            EligibilityVerification verification = eligibilityMapper.toEntity(request);
            verification.setVerificationDate(LocalDateTime.now());
            verification.setVerificationStatus(VerificationStatus.IN_PROGRESS);
            
            // Save initial verification
            verification = eligibilityRepository.save(verification);
            
            // Perform real-time verification via EDI 270/271
            EligibilityResponse response = eligibilityVerificationService.performVerification(verification);
            
            // Update verification with response
            updateVerificationWithResponse(verification, response);
            
            EligibilityVerification finalVerification = eligibilityRepository.save(verification);
            
            log.info("Eligibility verification completed: {}", finalVerification.getId());
            return eligibilityMapper.toResponseDto(finalVerification);
            
        } catch (Exception e) {
            log.error("Error during eligibility verification: {}", e.getMessage(), e);
            throw new EligibilityVerificationException("Failed to verify eligibility", e);
        }
    }

    @Transactional(readOnly = true)
    public EligibilityVerificationResponseDto getEligibilityById(UUID verificationId) {
        log.debug("Retrieving eligibility verification: {}", verificationId);
        
        EligibilityVerification verification = eligibilityRepository.findById(verificationId)
            .orElseThrow(() -> new EligibilityNotFoundException("Eligibility verification not found: " + verificationId));
        
        return eligibilityMapper.toResponseDto(verification);
    }

    @Transactional(readOnly = true)
    public List<EligibilityVerificationResponseDto> getPatientEligibilities(UUID patientId) {
        log.debug("Retrieving eligibilities for patient: {}", patientId);
        
        List<EligibilityVerification> verifications = eligibilityRepository.findByPatientIdOrderByVerificationDateDesc(patientId);
        
        return verifications.stream()
            .map(eligibilityMapper::toResponseDto)
            .toList();
    }

    // ===============================
    // Claims Status and Processing
    // ===============================

    public ClaimStatusResponseDto getClaimStatus(UUID claimId) {
        log.debug("Retrieving claim status: {}", claimId);
        
        InsuranceClaim claim = claimRepository.findById(claimId)
            .orElseThrow(() -> new ClaimNotFoundException("Insurance claim not found: " + claimId));
        
        // Get real-time status from payer if needed
        if (shouldUpdateClaimStatus(claim)) {
            updateClaimStatusFromPayer(claim);
        }
        
        return ClaimStatusResponseDto.builder()
            .claimId(claim.getId())
            .claimNumber(claim.getClaimNumber())
            .status(claim.getClaimStatus())
            .statusDate(claim.getStatusDate())
            .statusReason(claim.getStatusReason())
            .paymentAmount(claim.getPaymentAmount())
            .paymentDate(claim.getPaymentDate())
            .denialReason(claim.getDenialReason())
            .build();
    }

    public ClaimPaymentResponseDto processPayment(UUID claimId, ClaimPaymentRequestDto request) {
        log.info("Processing payment for claim: {}", claimId);
        
        InsuranceClaim claim = claimRepository.findById(claimId)
            .orElseThrow(() -> new ClaimNotFoundException("Insurance claim not found: " + claimId));
        
        // Validate payment processing
        validatePaymentProcessing(claim, request);
        
        // Process payment
        claim.setClaimStatus(ClaimStatus.PAID);
        claim.setPaymentAmount(request.getPaymentAmount());
        claim.setPaymentDate(request.getPaymentDate());
        claim.setStatusDate(LocalDateTime.now());
        claim.setStatusReason("Payment processed");
        
        InsuranceClaim paidClaim = claimRepository.save(claim);
        
        log.info("Payment processed for claim: {}, amount: {}", claim.getClaimNumber(), request.getPaymentAmount());
        
        return ClaimPaymentResponseDto.builder()
            .claimId(paidClaim.getId())
            .claimNumber(paidClaim.getClaimNumber())
            .paymentAmount(paidClaim.getPaymentAmount())
            .paymentDate(paidClaim.getPaymentDate())
            .status(paidClaim.getClaimStatus())
            .build();
    }

    // ===============================
    // Dashboard and Reporting
    // ===============================

    @Transactional(readOnly = true)
    public PayerDashboardStatsDto getDashboardStats() {
        log.debug("Retrieving payer dashboard statistics");
        
        return PayerDashboardStatsDto.builder()
            .totalClaims(claimRepository.count())
            .pendingClaims(claimRepository.countByClaimStatus(ClaimStatus.PENDING))
            .approvedClaims(claimRepository.countByClaimStatus(ClaimStatus.APPROVED))
            .deniedClaims(claimRepository.countByClaimStatus(ClaimStatus.DENIED))
            .paidClaims(claimRepository.countByClaimStatus(ClaimStatus.PAID))
            .totalClaimAmount(claimRepository.getTotalClaimAmount())
            .paidAmount(claimRepository.getPaidAmount())
            .pendingAmount(claimRepository.getPendingAmount())
            .activeEligibilities(eligibilityRepository.countActiveVerifications())
            .recentClaims(claimRepository.findRecentClaims(5).stream()
                .map(claimMapper::toResponseDto)
                .toList())
            .build();
    }

    // ===============================
    // Private Helper Methods
    // ===============================

    private void validateClaimData(InsuranceClaimCreateRequestDto request) {
        if (request.getPatientId() == null) {
            throw new InvalidClaimDataException("Patient ID is required");
        }
        if (request.getProviderId() == null) {
            throw new InvalidClaimDataException("Provider ID is required");
        }
        if (request.getPayerId() == null) {
            throw new InvalidClaimDataException("Payer ID is required");
        }
        if (request.getServiceDate() == null) {
            throw new InvalidClaimDataException("Service date is required");
        }
        if (request.getTotalAmount() == null || request.getTotalAmount().compareTo(java.math.BigDecimal.ZERO) <= 0) {
            throw new InvalidClaimDataException("Total amount must be greater than zero");
        }
    }

    private void checkForDuplicateClaims(InsuranceClaimCreateRequestDto request) {
        boolean duplicateExists = claimRepository.existsByPatientIdAndProviderIdAndServiceDateAndTotalAmount(
            request.getPatientId(),
            request.getProviderId(),
            request.getServiceDate(),
            request.getTotalAmount()
        );
        
        if (duplicateExists) {
            throw new DuplicateClaimException("Duplicate claim detected for same patient, provider, service date, and amount");
        }
    }

    private String generateClaimNumber() {
        return "CLM-" + System.currentTimeMillis() + "-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    private boolean canUpdateClaim(InsuranceClaim claim) {
        return claim.getClaimStatus() == ClaimStatus.DRAFT || 
               claim.getClaimStatus() == ClaimStatus.PENDING ||
               claim.getClaimStatus() == ClaimStatus.SUBMISSION_FAILED;
    }

    private void validateClaimForSubmission(InsuranceClaim claim) {
        if (claim.getClaimStatus() != ClaimStatus.DRAFT && claim.getClaimStatus() != ClaimStatus.SUBMISSION_FAILED) {
            throw new ClaimSubmissionException("Claim cannot be submitted in current status: " + claim.getClaimStatus());
        }
        
        if (claim.getPatientId() == null || claim.getProviderId() == null || claim.getPayerId() == null) {
            throw new ClaimSubmissionException("Claim is missing required information");
        }
    }

    private boolean isVerificationValid(EligibilityVerification verification) {
        if (verification.getVerificationStatus() != VerificationStatus.VERIFIED) {
            return false;
        }
        
        // Check if verification is still valid (e.g., within 30 days)
        LocalDateTime expiryDate = verification.getVerificationDate().plusDays(30);
        return LocalDateTime.now().isBefore(expiryDate);
    }

    private void updateVerificationWithResponse(EligibilityVerification verification, EligibilityResponse response) {
        verification.setVerificationStatus(response.getStatus());
        verification.setCoverageStatus(response.getCoverageStatus());
        verification.setCoordinationOfBenefits(response.getCoordinationOfBenefits());
        verification.setDeductibleAmount(response.getDeductibleAmount());
        verification.setCoinsurancePercentage(response.getCoinsurancePercentage());
        verification.setCopayAmount(response.getCopayAmount());
        verification.setOutOfPocketMax(response.getOutOfPocketMax());
        verification.setResponseData(response.getRawResponseData());
        verification.setLastModifiedDate(LocalDateTime.now());
    }

    private boolean shouldUpdateClaimStatus(InsuranceClaim claim) {
        if (claim.getClaimStatus() == ClaimStatus.SUBMITTED || claim.getClaimStatus() == ClaimStatus.PENDING) {
            // Check if status was last updated more than 1 hour ago
            return claim.getStatusDate() == null || 
                   claim.getStatusDate().isBefore(LocalDateTime.now().minusHours(1));
        }
        return false;
    }

    private void updateClaimStatusFromPayer(InsuranceClaim claim) {
        try {
            ClaimStatusResponse statusResponse = ediTransactionService.getClaimStatus276(claim.getClaimNumber());
            
            if (statusResponse != null) {
                claim.setClaimStatus(statusResponse.getStatus());
                claim.setStatusDate(LocalDateTime.now());
                claim.setStatusReason(statusResponse.getReason());
                
                if (statusResponse.getPaymentAmount() != null) {
                    claim.setPaymentAmount(statusResponse.getPaymentAmount());
                    claim.setPaymentDate(statusResponse.getPaymentDate());
                }
                
                claimRepository.save(claim);
            }
        } catch (Exception e) {
            log.warn("Failed to update claim status from payer: {}", e.getMessage());
        }
    }

    private void validatePaymentProcessing(InsuranceClaim claim, ClaimPaymentRequestDto request) {
        if (claim.getClaimStatus() != ClaimStatus.APPROVED) {
            throw new PaymentProcessingException("Claim must be approved before payment processing");
        }
        
        if (request.getPaymentAmount() == null || request.getPaymentAmount().compareTo(java.math.BigDecimal.ZERO) <= 0) {
            throw new PaymentProcessingException("Payment amount must be greater than zero");
        }
        
        if (request.getPaymentDate() == null) {
            throw new PaymentProcessingException("Payment date is required");
        }
    }
}
