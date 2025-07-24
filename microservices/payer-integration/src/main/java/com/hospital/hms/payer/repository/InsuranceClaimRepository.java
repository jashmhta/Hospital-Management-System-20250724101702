package com.hospital.hms.payer.repository;

import com.hospital.hms.payer.entity.InsuranceClaim;
import com.hospital.hms.payer.entity.ClaimStatus;
import com.hospital.hms.payer.entity.ClaimType;
import com.hospital.hms.payer.entity.PriorityLevel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Repository interface for InsuranceClaim entity
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Repository
public interface InsuranceClaimRepository extends JpaRepository<InsuranceClaim, UUID>, JpaSpecificationExecutor<InsuranceClaim> {

    /**
     * Find claim by claim number
     */
    Optional<InsuranceClaim> findByClaimNumber(String claimNumber);

    /**
     * Find claims by patient ID
     */
    Page<InsuranceClaim> findByPatientId(UUID patientId, Pageable pageable);

    /**
     * Find claims by encounter ID
     */
    List<InsuranceClaim> findByEncounterId(UUID encounterId);

    /**
     * Find claims by payer ID
     */
    Page<InsuranceClaim> findByPayerId(UUID payerId, Pageable pageable);

    /**
     * Find claims by status
     */
    Page<InsuranceClaim> findByClaimStatus(ClaimStatus claimStatus, Pageable pageable);

    /**
     * Find claims by type
     */
    Page<InsuranceClaim> findByClaimType(ClaimType claimType, Pageable pageable);

    /**
     * Find claims by priority level
     */
    Page<InsuranceClaim> findByPriorityLevel(PriorityLevel priorityLevel, Pageable pageable);

    /**
     * Find claims by service date range
     */
    Page<InsuranceClaim> findByServiceDateBetween(LocalDateTime startDate, LocalDateTime endDate, Pageable pageable);

    /**
     * Find claims by submission date range
     */
    Page<InsuranceClaim> findBySubmissionDateBetween(LocalDateTime startDate, LocalDateTime endDate, Pageable pageable);

    /**
     * Find pending claims
     */
    @Query("SELECT c FROM InsuranceClaim c WHERE c.claimStatus IN ('SUBMITTED', 'UNDER_REVIEW', 'PENDING_INFO')")
    Page<InsuranceClaim> findPendingClaims(Pageable pageable);

    /**
     * Find overdue claims
     */
    @Query("SELECT c FROM InsuranceClaim c WHERE c.submissionDate < :cutoffDate AND " +
           "c.claimStatus IN ('SUBMITTED', 'UNDER_REVIEW', 'PENDING_INFO')")
    List<InsuranceClaim> findOverdueClaims(@Param("cutoffDate") LocalDateTime cutoffDate);

    /**
     * Find claims requiring authorization
     */
    @Query("SELECT c FROM InsuranceClaim c WHERE c.authorizationRequired = true AND " +
           "(c.authorizationObtained = false OR c.authorizationObtained IS NULL)")
    List<InsuranceClaim> findClaimsRequiringAuthorization();

    /**
     * Find claims with expired authorization
     */
    @Query("SELECT c FROM InsuranceClaim c WHERE c.authorizationRequired = true AND " +
           "c.authorizationExpiryDate < :currentDate")
    List<InsuranceClaim> findClaimsWithExpiredAuthorization(@Param("currentDate") LocalDateTime currentDate);

    /**
     * Find claims by billing provider
     */
    Page<InsuranceClaim> findByBillingProviderId(UUID billingProviderId, Pageable pageable);

    /**
     * Find claims by rendering provider
     */
    Page<InsuranceClaim> findByRenderingProviderId(UUID renderingProviderId, Pageable pageable);

    /**
     * Find claims by authorization number
     */
    List<InsuranceClaim> findByAuthorizationNumber(String authorizationNumber);

    /**
     * Find claims by policy number
     */
    List<InsuranceClaim> findByPolicyNumber(String policyNumber);

    /**
     * Find claims by primary diagnosis code
     */
    List<InsuranceClaim> findByPrimaryDiagnosisCode(String primaryDiagnosisCode);

    /**
     * Find denied claims
     */
    @Query("SELECT c FROM InsuranceClaim c WHERE c.claimStatus IN ('DENIED', 'REJECTED')")
    Page<InsuranceClaim> findDeniedClaims(Pageable pageable);

    /**
     * Find claims requiring manual review
     */
    @Query("SELECT c FROM InsuranceClaim c WHERE c.requiresManualReview = true")
    List<InsuranceClaim> findClaimsRequiringManualReview();

    /**
     * Find high priority claims
     */
    @Query("SELECT c FROM InsuranceClaim c WHERE c.priorityLevel IN ('HIGH', 'URGENT', 'STAT', 'EMERGENCY')")
    List<InsuranceClaim> findHighPriorityClaims();

    /**
     * Find corrected claims
     */
    @Query("SELECT c FROM InsuranceClaim c WHERE c.isCorrectedClaim = true")
    Page<InsuranceClaim> findCorrectedClaims(Pageable pageable);

    /**
     * Find original claim corrections
     */
    List<InsuranceClaim> findByOriginalClaimIdAndIsCorrectedClaimTrue(UUID originalClaimId);

    /**
     * Find claims by transaction control number
     */
    Optional<InsuranceClaim> findByTransactionControlNumber(String transactionControlNumber);

    /**
     * Find claims by claim control number
     */
    Optional<InsuranceClaim> findByClaimControlNumber(String claimControlNumber);

    /**
     * Count claims by status
     */
    long countByClaimStatus(ClaimStatus claimStatus);

    /**
     * Count claims by type
     */
    long countByClaimType(ClaimType claimType);

    /**
     * Count claims by payer
     */
    long countByPayerId(UUID payerId);

    /**
     * Get total charge amount by payer
     */
    @Query("SELECT SUM(c.totalChargeAmount) FROM InsuranceClaim c WHERE c.payerId = :payerId")
    BigDecimal getTotalChargeAmountByPayer(@Param("payerId") UUID payerId);

    /**
     * Get total paid amount by payer
     */
    @Query("SELECT SUM(c.totalPaidAmount) FROM InsuranceClaim c WHERE c.payerId = :payerId AND " +
           "c.claimStatus IN ('PAID', 'PARTIALLY_PAID')")
    BigDecimal getTotalPaidAmountByPayer(@Param("payerId") UUID payerId);

    /**
     * Get claims statistics by status
     */
    @Query("SELECT c.claimStatus, COUNT(c), SUM(c.totalChargeAmount), SUM(c.totalPaidAmount) " +
           "FROM InsuranceClaim c WHERE c.submissionDate BETWEEN :startDate AND :endDate " +
           "GROUP BY c.claimStatus ORDER BY COUNT(c) DESC")
    List<Object[]> getClaimsStatisticsByStatus(@Param("startDate") LocalDateTime startDate,
                                             @Param("endDate") LocalDateTime endDate);

    /**
     * Get claims statistics by payer
     */
    @Query("SELECT c.payerId, c.payerName, COUNT(c), SUM(c.totalChargeAmount), SUM(c.totalPaidAmount) " +
           "FROM InsuranceClaim c WHERE c.submissionDate BETWEEN :startDate AND :endDate " +
           "GROUP BY c.payerId, c.payerName ORDER BY COUNT(c) DESC")
    List<Object[]> getClaimsStatisticsByPayer(@Param("startDate") LocalDateTime startDate,
                                            @Param("endDate") LocalDateTime endDate);

    /**
     * Get daily submission volume
     */
    @Query("SELECT DATE(c.submissionDate), COUNT(c), SUM(c.totalChargeAmount) " +
           "FROM InsuranceClaim c WHERE c.submissionDate BETWEEN :startDate AND :endDate " +
           "GROUP BY DATE(c.submissionDate) ORDER BY DATE(c.submissionDate)")
    List<Object[]> getDailySubmissionVolume(@Param("startDate") LocalDateTime startDate,
                                          @Param("endDate") LocalDateTime endDate);

    /**
     * Get average adjudication time
     */
    @Query("SELECT AVG(DATEDIFF(day, c.submissionDate, c.adjudicationDate)) " +
           "FROM InsuranceClaim c WHERE c.adjudicationDate IS NOT NULL AND " +
           "c.submissionDate BETWEEN :startDate AND :endDate")
    Double getAverageAdjudicationTime(@Param("startDate") LocalDateTime startDate,
                                    @Param("endDate") LocalDateTime endDate);

    /**
     * Find claims with outstanding balance
     */
    @Query("SELECT c FROM InsuranceClaim c WHERE " +
           "(c.totalChargeAmount - COALESCE(c.totalPaidAmount, 0)) > 0 AND " +
           "c.claimStatus NOT IN ('DENIED', 'REJECTED', 'CANCELLED', 'VOIDED')")
    Page<InsuranceClaim> findClaimsWithOutstandingBalance(Pageable pageable);

    /**
     * Update claim status
     */
    @Modifying
    @Query("UPDATE InsuranceClaim c SET c.claimStatus = :claimStatus, c.lastModifiedDate = :modifiedDate " +
           "WHERE c.id = :claimId")
    void updateClaimStatus(@Param("claimId") UUID claimId,
                          @Param("claimStatus") ClaimStatus claimStatus,
                          @Param("modifiedDate") LocalDateTime modifiedDate);

    /**
     * Update adjudication information
     */
    @Modifying
    @Query("UPDATE InsuranceClaim c SET c.adjudicationDate = :adjudicationDate, " +
           "c.totalAllowedAmount = :allowedAmount, c.totalPaidAmount = :paidAmount, " +
           "c.patientResponsibility = :patientResponsibility WHERE c.id = :claimId")
    void updateAdjudicationInfo(@Param("claimId") UUID claimId,
                               @Param("adjudicationDate") LocalDateTime adjudicationDate,
                               @Param("allowedAmount") BigDecimal allowedAmount,
                               @Param("paidAmount") BigDecimal paidAmount,
                               @Param("patientResponsibility") BigDecimal patientResponsibility);

    /**
     * Search claims by multiple criteria
     */
    @Query("SELECT c FROM InsuranceClaim c WHERE " +
           "(:patientId IS NULL OR c.patientId = :patientId) AND " +
           "(:payerId IS NULL OR c.payerId = :payerId) AND " +
           "(:claimStatus IS NULL OR c.claimStatus = :claimStatus) AND " +
           "(:claimType IS NULL OR c.claimType = :claimType) AND " +
           "(:startDate IS NULL OR c.serviceDate >= :startDate) AND " +
           "(:endDate IS NULL OR c.serviceDate <= :endDate)")
    Page<InsuranceClaim> findByMultipleCriteria(
            @Param("patientId") UUID patientId,
            @Param("payerId") UUID payerId,
            @Param("claimStatus") ClaimStatus claimStatus,
            @Param("claimType") ClaimType claimType,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            Pageable pageable);

    /**
     * Find claims by FHIR resource ID
     */
    Optional<InsuranceClaim> findByFhirResourceId(String fhirResourceId);

    /**
     * Get reimbursement rate by payer
     */
    @Query("SELECT (SUM(c.totalPaidAmount) / SUM(c.totalChargeAmount)) * 100 " +
           "FROM InsuranceClaim c WHERE c.payerId = :payerId AND " +
           "c.totalChargeAmount > 0 AND c.totalPaidAmount > 0")
    Double getReimbursementRateByPayer(@Param("payerId") UUID payerId);

    /**
     * Get claims aging report
     */
    @Query("SELECT " +
           "COUNT(CASE WHEN DATEDIFF(day, c.submissionDate, CURRENT_DATE) BETWEEN 0 AND 30 THEN 1 END) as under30, " +
           "COUNT(CASE WHEN DATEDIFF(day, c.submissionDate, CURRENT_DATE) BETWEEN 31 AND 60 THEN 1 END) as thirtyTo60, " +
           "COUNT(CASE WHEN DATEDIFF(day, c.submissionDate, CURRENT_DATE) BETWEEN 61 AND 90 THEN 1 END) as sixtyTo90, " +
           "COUNT(CASE WHEN DATEDIFF(day, c.submissionDate, CURRENT_DATE) > 90 THEN 1 END) as over90 " +
           "FROM InsuranceClaim c WHERE c.claimStatus IN ('SUBMITTED', 'UNDER_REVIEW', 'PENDING_INFO')")
    Object[] getClaimsAgingReport();
}
