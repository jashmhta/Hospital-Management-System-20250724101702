package com.hospital.hms.payer.repository;

import com.hospital.hms.payer.entity.EligibilityVerification;
import com.hospital.hms.payer.entity.VerificationStatus;
import com.hospital.hms.payer.entity.CoverageStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Repository interface for EligibilityVerification entity
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Repository
public interface EligibilityVerificationRepository extends JpaRepository<EligibilityVerification, UUID>, JpaSpecificationExecutor<EligibilityVerification> {

    /**
     * Find verification by patient and payer
     */
    Optional<EligibilityVerification> findByPatientIdAndPayerIdOrderByVerificationDateDesc(UUID patientId, UUID payerId);

    /**
     * Find verifications by patient ID
     */
    Page<EligibilityVerification> findByPatientId(UUID patientId, Pageable pageable);

    /**
     * Find verifications by payer ID
     */
    Page<EligibilityVerification> findByPayerId(UUID payerId, Pageable pageable);

    /**
     * Find verifications by status
     */
    Page<EligibilityVerification> findByVerificationStatus(VerificationStatus verificationStatus, Pageable pageable);

    /**
     * Find verifications by coverage status
     */
    Page<EligibilityVerification> findByCoverageStatus(CoverageStatus coverageStatus, Pageable pageable);

    /**
     * Find verifications by member ID
     */
    List<EligibilityVerification> findByMemberId(String memberId);

    /**
     * Find verifications by policy number
     */
    List<EligibilityVerification> findByPolicyNumber(String policyNumber);

    /**
     * Find active verifications
     */
    @Query("SELECT e FROM EligibilityVerification e WHERE e.isActive = true AND e.coverageStatus = 'ACTIVE'")
    Page<EligibilityVerification> findActiveVerifications(Pageable pageable);

    /**
     * Find expired verifications
     */
    @Query("SELECT e FROM EligibilityVerification e WHERE e.cacheExpiry < :currentDate")
    List<EligibilityVerification> findExpiredVerifications(@Param("currentDate") LocalDateTime currentDate);

    /**
     * Find recent verification for patient and payer
     */
    @Query("SELECT e FROM EligibilityVerification e WHERE e.patientId = :patientId AND e.payerId = :payerId " +
           "AND e.verificationDate > :cutoffDate ORDER BY e.verificationDate DESC")
    Optional<EligibilityVerification> findRecentVerification(@Param("patientId") UUID patientId,
                                                            @Param("payerId") UUID payerId,
                                                            @Param("cutoffDate") LocalDateTime cutoffDate);

    /**
     * Count verifications by status
     */
    long countByVerificationStatus(VerificationStatus verificationStatus);

    /**
     * Count verifications by coverage status
     */
    long countByCoverageStatus(CoverageStatus coverageStatus);
}
