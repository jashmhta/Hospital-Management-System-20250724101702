package com.hospital.hms.pacs.repository;

import com.hospital.hms.pacs.entity.DicomStudy;
import com.hospital.hms.pacs.entity.DicomModality;
import com.hospital.hms.pacs.entity.StudyStatus;
import com.hospital.hms.pacs.entity.WorkflowState;
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
 * Repository interface for DicomStudy entity
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Repository
public interface DicomStudyRepository extends JpaRepository<DicomStudy, UUID>, JpaSpecificationExecutor<DicomStudy> {

    /**
     * Find study by Study Instance UID
     */
    Optional<DicomStudy> findByStudyInstanceUid(String studyInstanceUid);

    /**
     * Find studies by patient ID
     */
    Page<DicomStudy> findByPatientId(UUID patientId, Pageable pageable);

    /**
     * Find studies by patient ID and modality
     */
    Page<DicomStudy> findByPatientIdAndModality(UUID patientId, DicomModality modality, Pageable pageable);

    /**
     * Find studies by accession number
     */
    Optional<DicomStudy> findByAccessionNumber(String accessionNumber);

    /**
     * Find studies by study status
     */
    Page<DicomStudy> findByStudyStatus(StudyStatus studyStatus, Pageable pageable);

    /**
     * Find studies by workflow state
     */
    Page<DicomStudy> findByWorkflowState(WorkflowState workflowState, Pageable pageable);

    /**
     * Find studies by modality
     */
    Page<DicomStudy> findByModality(DicomModality modality, Pageable pageable);

    /**
     * Find studies by referring physician
     */
    Page<DicomStudy> findByReferringPhysicianNameContainingIgnoreCase(String physicianName, Pageable pageable);

    /**
     * Find studies by institution
     */
    Page<DicomStudy> findByInstitutionNameContainingIgnoreCase(String institutionName, Pageable pageable);

    /**
     * Find studies by date range
     */
    Page<DicomStudy> findByStudyDateBetween(LocalDateTime startDate, LocalDateTime endDate, Pageable pageable);

    /**
     * Find urgent studies
     */
    Page<DicomStudy> findByIsUrgentTrueOrderByStudyDateDesc(Pageable pageable);

    /**
     * Find studies requiring validation
     */
    Page<DicomStudy> findByIsValidatedFalseOrderByStudyDateAsc(Pageable pageable);

    /**
     * Find studies requiring review
     */
    @Query("SELECT s FROM DicomStudy s WHERE s.workflowState IN ('PENDING_REVIEW', 'IN_REVIEW') ORDER BY s.studyDate ASC")
    Page<DicomStudy> findStudiesRequiringReview(Pageable pageable);

    /**
     * Find studies by multiple criteria
     */
    @Query("SELECT s FROM DicomStudy s WHERE " +
           "(:patientId IS NULL OR s.patientId = :patientId) AND " +
           "(:modality IS NULL OR s.modality = :modality) AND " +
           "(:studyStatus IS NULL OR s.studyStatus = :studyStatus) AND " +
           "(:startDate IS NULL OR s.studyDate >= :startDate) AND " +
           "(:endDate IS NULL OR s.studyDate <= :endDate) AND " +
           "(:isUrgent IS NULL OR s.isUrgent = :isUrgent)")
    Page<DicomStudy> findByMultipleCriteria(
            @Param("patientId") UUID patientId,
            @Param("modality") DicomModality modality,
            @Param("studyStatus") StudyStatus studyStatus,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            @Param("isUrgent") Boolean isUrgent,
            Pageable pageable);

    /**
     * Count studies by status
     */
    long countByStudyStatus(StudyStatus studyStatus);

    /**
     * Count studies by modality
     */
    long countByModality(DicomModality modality);

    /**
     * Count studies requiring validation
     */
    long countByIsValidatedFalse();

    /**
     * Count urgent studies
     */
    long countByIsUrgentTrue();

    /**
     * Get study statistics by modality
     */
    @Query("SELECT s.modality, COUNT(s), SUM(s.studySizeBytes), AVG(s.numberOfSeries), AVG(s.numberOfInstances) " +
           "FROM DicomStudy s WHERE s.studyDate BETWEEN :startDate AND :endDate " +
           "GROUP BY s.modality ORDER BY COUNT(s) DESC")
    List<Object[]> getStudyStatisticsByModality(@Param("startDate") LocalDateTime startDate,
                                                @Param("endDate") LocalDateTime endDate);

    /**
     * Get study statistics by institution
     */
    @Query("SELECT s.institutionName, COUNT(s), SUM(s.studySizeBytes) " +
           "FROM DicomStudy s WHERE s.studyDate BETWEEN :startDate AND :endDate " +
           "GROUP BY s.institutionName ORDER BY COUNT(s) DESC")
    List<Object[]> getStudyStatisticsByInstitution(@Param("startDate") LocalDateTime startDate,
                                                   @Param("endDate") LocalDateTime endDate);

    /**
     * Get daily study volume
     */
    @Query("SELECT DATE(s.studyDate), COUNT(s), SUM(s.studySizeBytes) " +
           "FROM DicomStudy s WHERE s.studyDate BETWEEN :startDate AND :endDate " +
           "GROUP BY DATE(s.studyDate) ORDER BY DATE(s.studyDate)")
    List<Object[]> getDailyStudyVolume(@Param("startDate") LocalDateTime startDate,
                                       @Param("endDate") LocalDateTime endDate);

    /**
     * Find studies needing archival
     */
    @Query("SELECT s FROM DicomStudy s WHERE " +
           "s.archiveStatus = 'ONLINE' AND " +
           "s.lastAccessedDate < :cutoffDate AND " +
           "s.studyDate < :studyCutoffDate")
    List<DicomStudy> findStudiesForArchival(@Param("cutoffDate") LocalDateTime cutoffDate,
                                           @Param("studyCutoffDate") LocalDateTime studyCutoffDate);

    /**
     * Find large studies for optimization
     */
    @Query("SELECT s FROM DicomStudy s WHERE s.studySizeBytes > :sizeThreshold ORDER BY s.studySizeBytes DESC")
    List<DicomStudy> findLargeStudies(@Param("sizeThreshold") Long sizeThreshold, Pageable pageable);

    /**
     * Update last accessed date
     */
    @Modifying
    @Query("UPDATE DicomStudy s SET s.lastAccessedDate = :accessDate WHERE s.id = :studyId")
    void updateLastAccessedDate(@Param("studyId") UUID studyId, @Param("accessDate") LocalDateTime accessDate);

    /**
     * Update workflow state
     */
    @Modifying
    @Query("UPDATE DicomStudy s SET s.workflowState = :workflowState, s.lastModifiedDate = :modifiedDate, " +
           "s.lastModifiedBy = :modifiedBy WHERE s.id = :studyId")
    void updateWorkflowState(@Param("studyId") UUID studyId,
                            @Param("workflowState") WorkflowState workflowState,
                            @Param("modifiedDate") LocalDateTime modifiedDate,
                            @Param("modifiedBy") String modifiedBy);

    /**
     * Update study validation status
     */
    @Modifying
    @Query("UPDATE DicomStudy s SET s.isValidated = :isValidated, s.validationErrors = :validationErrors, " +
           "s.lastModifiedDate = :modifiedDate WHERE s.id = :studyId")
    void updateValidationStatus(@Param("studyId") UUID studyId,
                               @Param("isValidated") Boolean isValidated,
                               @Param("validationErrors") String validationErrors,
                               @Param("modifiedDate") LocalDateTime modifiedDate);

    /**
     * Bulk update archive status
     */
    @Modifying
    @Query("UPDATE DicomStudy s SET s.archiveStatus = :archiveStatus WHERE s.id IN :studyIds")
    void updateArchiveStatusBulk(@Param("studyIds") List<UUID> studyIds,
                                @Param("archiveStatus") String archiveStatus);

    /**
     * Find studies by order ID
     */
    List<DicomStudy> findByOrderId(UUID orderId);

    /**
     * Find studies by appointment ID
     */
    List<DicomStudy> findByAppointmentId(UUID appointmentId);

    /**
     * Find studies by encounter ID
     */
    List<DicomStudy> findByEncounterId(UUID encounterId);

    /**
     * Find studies by RIS study ID
     */
    Optional<DicomStudy> findByRisStudyId(String risStudyId);

    /**
     * Find studies by FHIR ImagingStudy ID
     */
    Optional<DicomStudy> findByFhirImagingStudyId(String fhirImagingStudyId);

    /**
     * Search studies by patient name or study description
     */
    @Query("SELECT s FROM DicomStudy s WHERE " +
           "LOWER(s.patientName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(s.studyDescription) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "s.accessionNumber LIKE CONCAT('%', :searchTerm, '%')")
    Page<DicomStudy> searchStudies(@Param("searchTerm") String searchTerm, Pageable pageable);

    /**
     * Find studies with quality issues
     */
    @Query("SELECT s FROM DicomStudy s WHERE " +
           "s.qualityScore IS NOT NULL AND s.qualityScore < :qualityThreshold")
    List<DicomStudy> findStudiesWithQualityIssues(@Param("qualityThreshold") Double qualityThreshold);

    /**
     * Get storage usage statistics
     */
    @Query("SELECT SUM(s.studySizeBytes), COUNT(s), AVG(s.studySizeBytes), MAX(s.studySizeBytes) " +
           "FROM DicomStudy s WHERE s.studyDate BETWEEN :startDate AND :endDate")
    Object[] getStorageStatistics(@Param("startDate") LocalDateTime startDate,
                                 @Param("endDate") LocalDateTime endDate);

    /**
     * Find studies ready for AI analysis
     */
    @Query("SELECT s FROM DicomStudy s WHERE " +
           "s.studyStatus = 'COMPLETED' AND " +
           "s.isValidated = true AND " +
           "s.workflowState = 'FINALIZED' AND " +
           "s.modality IN :supportedModalities")
    List<DicomStudy> findStudiesForAIAnalysis(@Param("supportedModalities") List<DicomModality> supportedModalities);
}
