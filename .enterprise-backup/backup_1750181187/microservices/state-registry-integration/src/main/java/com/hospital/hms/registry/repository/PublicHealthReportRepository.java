package com.hospital.hms.registry.repository;

import com.hospital.hms.registry.entity.PublicHealthReport;
import com.hospital.hms.registry.entity.ReportType;
import com.hospital.hms.registry.entity.RegistryType;
import com.hospital.hms.registry.entity.SubmissionStatus;
import com.hospital.hms.registry.entity.PriorityLevel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Repository interface for PublicHealthReport entity
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Repository
public interface PublicHealthReportRepository extends JpaRepository<PublicHealthReport, UUID>, JpaSpecificationExecutor<PublicHealthReport> {

    /**
     * Find reports by patient ID
     */
    Page<PublicHealthReport> findByPatientId(UUID patientId, Pageable pageable);

    /**
     * Find reports by encounter ID
     */
    List<PublicHealthReport> findByEncounterId(UUID encounterId);

    /**
     * Find reports by report type
     */
    Page<PublicHealthReport> findByReportType(ReportType reportType, Pageable pageable);

    /**
     * Find reports by registry type
     */
    Page<PublicHealthReport> findByRegistryType(RegistryType registryType, Pageable pageable);

    /**
     * Find reports by submission status
     */
    Page<PublicHealthReport> findBySubmissionStatus(SubmissionStatus submissionStatus, Pageable pageable);

    /**
     * Find reports by priority level
     */
    Page<PublicHealthReport> findByPriorityLevel(PriorityLevel priorityLevel, Pageable pageable);

    /**
     * Find reports by date range
     */
    Page<PublicHealthReport> findByReportDateBetween(LocalDateTime startDate, LocalDateTime endDate, Pageable pageable);

    /**
     * Find overdue reports
     */
    @Query("SELECT r FROM PublicHealthReport r WHERE r.reportingDeadline < :currentDate AND " +
           "r.submissionStatus NOT IN ('SUBMITTED', 'ACKNOWLEDGED', 'PROCESSED')")
    List<PublicHealthReport> findOverdueReports(@Param("currentDate") LocalDateTime currentDate);

    /**
     * Find mandatory reports not submitted
     */
    @Query("SELECT r FROM PublicHealthReport r WHERE r.isMandatory = true AND " +
           "r.submissionStatus NOT IN ('SUBMITTED', 'ACKNOWLEDGED', 'PROCESSED')")
    List<PublicHealthReport> findMandatoryReportsNotSubmitted();

    /**
     * Find high priority reports pending
     */
    @Query("SELECT r FROM PublicHealthReport r WHERE r.priorityLevel IN ('URGENT', 'STAT', 'IMMEDIATE') AND " +
           "r.submissionStatus IN ('DRAFT', 'PENDING_VALIDATION', 'READY_FOR_SUBMISSION')")
    List<PublicHealthReport> findHighPriorityReportsPending();

    /**
     * Find reports requiring follow-up
     */
    List<PublicHealthReport> findByRequiresFollowupTrue();

    /**
     * Find reports by external reference ID
     */
    Optional<PublicHealthReport> findByExternalReferenceId(String externalReferenceId);

    /**
     * Find reports by registry case ID
     */
    Optional<PublicHealthReport> findByRegistryCaseId(String registryCaseId);

    /**
     * Find reports by condition code
     */
    List<PublicHealthReport> findByConditionCode(String conditionCode);

    /**
     * Find reports by ICD-10 code
     */
    List<PublicHealthReport> findByIcd10Code(String icd10Code);

    /**
     * Find reports by reporting provider
     */
    Page<PublicHealthReport> findByReportingProviderId(UUID reportingProviderId, Pageable pageable);

    /**
     * Find reports by reporting facility
     */
    Page<PublicHealthReport> findByReportingFacilityContainingIgnoreCase(String facilityName, Pageable pageable);

    /**
     * Find reports by jurisdiction
     */
    Page<PublicHealthReport> findByRegistryJurisdiction(String jurisdiction, Pageable pageable);

    /**
     * Count reports by type and status
     */
    long countByReportTypeAndSubmissionStatus(ReportType reportType, SubmissionStatus submissionStatus);

    /**
     * Count reports by registry type
     */
    long countByRegistryType(RegistryType registryType);

    /**
     * Count overdue reports
     */
    @Query("SELECT COUNT(r) FROM PublicHealthReport r WHERE r.reportingDeadline < :currentDate AND " +
           "r.submissionStatus NOT IN ('SUBMITTED', 'ACKNOWLEDGED', 'PROCESSED')")
    long countOverdueReports(@Param("currentDate") LocalDateTime currentDate);

    /**
     * Get submission statistics by report type
     */
    @Query("SELECT r.reportType, COUNT(r), " +
           "SUM(CASE WHEN r.submissionStatus IN ('SUBMITTED', 'ACKNOWLEDGED', 'PROCESSED') THEN 1 ELSE 0 END) " +
           "FROM PublicHealthReport r WHERE r.reportDate BETWEEN :startDate AND :endDate " +
           "GROUP BY r.reportType ORDER BY COUNT(r) DESC")
    List<Object[]> getSubmissionStatisticsByReportType(@Param("startDate") LocalDateTime startDate,
                                                       @Param("endDate") LocalDateTime endDate);

    /**
     * Get submission statistics by registry type
     */
    @Query("SELECT r.registryType, COUNT(r), " +
           "SUM(CASE WHEN r.submissionStatus IN ('SUBMITTED', 'ACKNOWLEDGED', 'PROCESSED') THEN 1 ELSE 0 END) " +
           "FROM PublicHealthReport r WHERE r.reportDate BETWEEN :startDate AND :endDate " +
           "GROUP BY r.registryType ORDER BY COUNT(r) DESC")
    List<Object[]> getSubmissionStatisticsByRegistryType(@Param("startDate") LocalDateTime startDate,
                                                         @Param("endDate") LocalDateTime endDate);

    /**
     * Get daily submission volume
     */
    @Query("SELECT DATE(r.submissionDate), COUNT(r) " +
           "FROM PublicHealthReport r WHERE r.submissionDate BETWEEN :startDate AND :endDate " +
           "GROUP BY DATE(r.submissionDate) ORDER BY DATE(r.submissionDate)")
    List<Object[]> getDailySubmissionVolume(@Param("startDate") LocalDateTime startDate,
                                           @Param("endDate") LocalDateTime endDate);

    /**
     * Find reports by condition name
     */
    @Query("SELECT r FROM PublicHealthReport r WHERE LOWER(r.conditionName) LIKE LOWER(CONCAT('%', :conditionName, '%'))")
    List<PublicHealthReport> findByConditionNameContaining(@Param("conditionName") String conditionName);

    /**
     * Update submission status
     */
    @Modifying
    @Query("UPDATE PublicHealthReport r SET r.submissionStatus = :submissionStatus, r.submissionDate = :submissionDate, " +
           "r.lastModifiedDate = :modifiedDate WHERE r.id = :reportId")
    void updateSubmissionStatus(@Param("reportId") UUID reportId,
                               @Param("submissionStatus") SubmissionStatus submissionStatus,
                               @Param("submissionDate") LocalDateTime submissionDate,
                               @Param("modifiedDate") LocalDateTime modifiedDate);

    /**
     * Update acknowledgment information
     */
    @Modifying
    @Query("UPDATE PublicHealthReport r SET r.acknowledgmentId = :acknowledgmentId, r.acknowledgmentDate = :acknowledgmentDate " +
           "WHERE r.id = :reportId")
    void updateAcknowledgment(@Param("reportId") UUID reportId,
                             @Param("acknowledgmentId") String acknowledgmentId,
                             @Param("acknowledgmentDate") LocalDateTime acknowledgmentDate);

    /**
     * Update validation status
     */
    @Modifying
    @Query("UPDATE PublicHealthReport r SET r.validationStatus = :validationStatus, r.validationErrors = :validationErrors, " +
           "r.validationDate = :validationDate WHERE r.id = :reportId")
    void updateValidationStatus(@Param("reportId") UUID reportId,
                               @Param("validationStatus") String validationStatus,
                               @Param("validationErrors") String validationErrors,
                               @Param("validationDate") LocalDateTime validationDate);

    /**
     * Search reports by multiple criteria
     */
    @Query("SELECT r FROM PublicHealthReport r WHERE " +
           "(:reportType IS NULL OR r.reportType = :reportType) AND " +
           "(:registryType IS NULL OR r.registryType = :registryType) AND " +
           "(:submissionStatus IS NULL OR r.submissionStatus = :submissionStatus) AND " +
           "(:startDate IS NULL OR r.reportDate >= :startDate) AND " +
           "(:endDate IS NULL OR r.reportDate <= :endDate) AND " +
           "(:patientId IS NULL OR r.patientId = :patientId)")
    Page<PublicHealthReport> findByMultipleCriteria(
            @Param("reportType") ReportType reportType,
            @Param("registryType") RegistryType registryType,
            @Param("submissionStatus") SubmissionStatus submissionStatus,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            @Param("patientId") UUID patientId,
            Pageable pageable);

    /**
     * Find amendable reports
     */
    @Query("SELECT r FROM PublicHealthReport r WHERE r.submissionStatus IN ('SUBMITTED', 'ACKNOWLEDGED') AND " +
           "r.isAmendment = false")
    List<PublicHealthReport> findAmendableReports();

    /**
     * Find amendments for original report
     */
    List<PublicHealthReport> findByOriginalReportIdAndIsAmendmentTrue(UUID originalReportId);

    /**
     * Find reports by FHIR resource ID
     */
    Optional<PublicHealthReport> findByFhirResourceId(String fhirResourceId);

    /**
     * Get compliance statistics
     */
    @Query("SELECT " +
           "COUNT(CASE WHEN r.isMandatory = true THEN 1 END) as mandatoryReports, " +
           "COUNT(CASE WHEN r.isMandatory = true AND r.submissionStatus IN ('SUBMITTED', 'ACKNOWLEDGED', 'PROCESSED') THEN 1 END) as mandatorySubmitted, " +
           "COUNT(CASE WHEN r.reportingDeadline < :currentDate AND r.submissionStatus NOT IN ('SUBMITTED', 'ACKNOWLEDGED', 'PROCESSED') THEN 1 END) as overdueReports " +
           "FROM PublicHealthReport r WHERE r.reportDate BETWEEN :startDate AND :endDate")
    Object[] getComplianceStatistics(@Param("startDate") LocalDateTime startDate,
                                    @Param("endDate") LocalDateTime endDate,
                                    @Param("currentDate") LocalDateTime currentDate);
}
