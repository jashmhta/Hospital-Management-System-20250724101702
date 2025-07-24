package com.hospital.hms.pacs.repository;

import com.hospital.hms.pacs.entity.StudyAnnotation;
import com.hospital.hms.pacs.entity.AnnotationType;
import com.hospital.hms.pacs.entity.AnnotationStatus;
import com.hospital.hms.pacs.entity.SeverityLevel;
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
import java.util.UUID;

/**
 * Repository interface for StudyAnnotation entity
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Repository
public interface StudyAnnotationRepository extends JpaRepository<StudyAnnotation, UUID>, JpaSpecificationExecutor<StudyAnnotation> {

    /**
     * Find annotations by study ID
     */
    List<StudyAnnotation> findByStudyIdOrderByAnnotationDateDesc(UUID studyId);

    /**
     * Find annotations by study and type
     */
    List<StudyAnnotation> findByStudyIdAndAnnotationType(UUID studyId, AnnotationType annotationType);

    /**
     * Find annotations by study and status
     */
    List<StudyAnnotation> findByStudyIdAndAnnotationStatus(UUID studyId, AnnotationStatus annotationStatus);

    /**
     * Find annotations by annotation type
     */
    Page<StudyAnnotation> findByAnnotationType(AnnotationType annotationType, Pageable pageable);

    /**
     * Find annotations by status
     */
    Page<StudyAnnotation> findByAnnotationStatus(AnnotationStatus annotationStatus, Pageable pageable);

    /**
     * Find annotations by creator
     */
    Page<StudyAnnotation> findByCreatedBy(String createdBy, Pageable pageable);

    /**
     * Find annotations by date range
     */
    Page<StudyAnnotation> findByAnnotationDateBetween(LocalDateTime startDate, LocalDateTime endDate, Pageable pageable);

    /**
     * Find key image annotations
     */
    List<StudyAnnotation> findByStudyIdAndIsKeyImageTrue(UUID studyId);

    /**
     * Find teaching file annotations
     */
    List<StudyAnnotation> findByIsTeachingFileTrue();

    /**
     * Find shared annotations
     */
    List<StudyAnnotation> findByIsSharedTrue();

    /**
     * Find AI-generated annotations
     */
    List<StudyAnnotation> findByIsAiGeneratedTrue();

    /**
     * Find annotations requiring approval
     */
    Page<StudyAnnotation> findByRequiresApprovalTrueAndAnnotationStatus(AnnotationStatus annotationStatus, Pageable pageable);

    /**
     * Find annotations by severity level
     */
    List<StudyAnnotation> findBySeverityLevel(SeverityLevel severityLevel);

    /**
     * Find high-severity annotations
     */
    @Query("SELECT a FROM StudyAnnotation a WHERE a.severityLevel IN ('HIGH', 'CRITICAL') " +
           "ORDER BY a.annotationDate DESC")
    List<StudyAnnotation> findHighSeverityAnnotations();

    /**
     * Find annotations by confidence level range
     */
    @Query("SELECT a FROM StudyAnnotation a WHERE a.confidenceLevel BETWEEN :minConfidence AND :maxConfidence")
    List<StudyAnnotation> findByConfidenceLevelRange(@Param("minConfidence") Double minConfidence,
                                                     @Param("maxConfidence") Double maxConfidence);

    /**
     * Find high-confidence AI annotations
     */
    @Query("SELECT a FROM StudyAnnotation a WHERE a.isAiGenerated = true AND a.aiConfidenceScore > :threshold")
    List<StudyAnnotation> findHighConfidenceAIAnnotations(@Param("threshold") Double threshold);

    /**
     * Find annotations by AI model
     */
    List<StudyAnnotation> findByAiModelName(String aiModelName);

    /**
     * Find annotations by clinical finding
     */
    @Query("SELECT a FROM StudyAnnotation a WHERE LOWER(a.clinicalFinding) LIKE LOWER(CONCAT('%', :finding, '%'))")
    List<StudyAnnotation> findByClinicalFinding(@Param("finding") String finding);

    /**
     * Find annotations by diagnosis code
     */
    List<StudyAnnotation> findByDiagnosisCode(String diagnosisCode);

    /**
     * Find annotations with measurements
     */
    @Query("SELECT a FROM StudyAnnotation a WHERE a.measurementValue IS NOT NULL AND a.measurementUnit IS NOT NULL")
    List<StudyAnnotation> findAnnotationsWithMeasurements();

    /**
     * Find geometric annotations
     */
    @Query("SELECT a FROM StudyAnnotation a WHERE a.shapeType IS NOT NULL AND a.coordinates IS NOT NULL")
    List<StudyAnnotation> findGeometricAnnotations();

    /**
     * Count annotations by study
     */
    long countByStudyId(UUID studyId);

    /**
     * Count annotations by type
     */
    long countByAnnotationType(AnnotationType annotationType);

    /**
     * Count annotations by status
     */
    long countByAnnotationStatus(AnnotationStatus annotationStatus);

    /**
     * Count AI-generated annotations
     */
    long countByIsAiGeneratedTrue();

    /**
     * Count annotations requiring approval
     */
    long countByRequiresApprovalTrueAndAnnotationStatus(AnnotationStatus annotationStatus);

    /**
     * Get annotation statistics by type
     */
    @Query("SELECT a.annotationType, COUNT(a), AVG(a.confidenceLevel) " +
           "FROM StudyAnnotation a WHERE a.annotationDate BETWEEN :startDate AND :endDate " +
           "GROUP BY a.annotationType ORDER BY COUNT(a) DESC")
    List<Object[]> getAnnotationStatisticsByType(@Param("startDate") LocalDateTime startDate,
                                                 @Param("endDate") LocalDateTime endDate);

    /**
     * Get annotation statistics by creator
     */
    @Query("SELECT a.createdBy, COUNT(a), COUNT(CASE WHEN a.annotationStatus = 'APPROVED' THEN 1 END) " +
           "FROM StudyAnnotation a WHERE a.annotationDate BETWEEN :startDate AND :endDate " +
           "GROUP BY a.createdBy ORDER BY COUNT(a) DESC")
    List<Object[]> getAnnotationStatisticsByCreator(@Param("startDate") LocalDateTime startDate,
                                                    @Param("endDate") LocalDateTime endDate);

    /**
     * Get AI model performance statistics
     */
    @Query("SELECT a.aiModelName, a.aiModelVersion, COUNT(a), AVG(a.aiConfidenceScore), " +
           "COUNT(CASE WHEN a.annotationStatus = 'APPROVED' THEN 1 END) " +
           "FROM StudyAnnotation a WHERE a.isAiGenerated = true AND a.annotationDate BETWEEN :startDate AND :endDate " +
           "GROUP BY a.aiModelName, a.aiModelVersion ORDER BY COUNT(a) DESC")
    List<Object[]> getAIModelPerformanceStatistics(@Param("startDate") LocalDateTime startDate,
                                                   @Param("endDate") LocalDateTime endDate);

    /**
     * Update annotation status
     */
    @Modifying
    @Query("UPDATE StudyAnnotation a SET a.annotationStatus = :annotationStatus, a.lastModifiedDate = :modifiedDate, " +
           "a.lastModifiedBy = :modifiedBy WHERE a.id = :annotationId")
    void updateAnnotationStatus(@Param("annotationId") UUID annotationId,
                               @Param("annotationStatus") AnnotationStatus annotationStatus,
                               @Param("modifiedDate") LocalDateTime modifiedDate,
                               @Param("modifiedBy") String modifiedBy);

    /**
     * Update approval information
     */
    @Modifying
    @Query("UPDATE StudyAnnotation a SET a.annotationStatus = 'APPROVED', a.approvedBy = :approvedBy, " +
           "a.approvedDate = :approvedDate, a.approvalNotes = :approvalNotes, " +
           "a.lastModifiedDate = :modifiedDate WHERE a.id = :annotationId")
    void updateApprovalInfo(@Param("annotationId") UUID annotationId,
                           @Param("approvedBy") String approvedBy,
                           @Param("approvedDate") LocalDateTime approvedDate,
                           @Param("approvalNotes") String approvalNotes,
                           @Param("modifiedDate") LocalDateTime modifiedDate);

    /**
     * Update quality score
     */
    @Modifying
    @Query("UPDATE StudyAnnotation a SET a.qualityScore = :qualityScore, a.lastModifiedDate = :modifiedDate " +
           "WHERE a.id = :annotationId")
    void updateQualityScore(@Param("annotationId") UUID annotationId,
                           @Param("qualityScore") Double qualityScore,
                           @Param("modifiedDate") LocalDateTime modifiedDate);

    /**
     * Find annotations by series instance UID
     */
    List<StudyAnnotation> findBySeriesInstanceUid(String seriesInstanceUid);

    /**
     * Find annotations by SOP instance UID
     */
    List<StudyAnnotation> findBySopInstanceUid(String sopInstanceUid);

    /**
     * Find annotations by template
     */
    List<StudyAnnotation> findByTemplateId(UUID templateId);

    /**
     * Find annotations by coding scheme
     */
    List<StudyAnnotation> findByCodingScheme(String codingScheme);

    /**
     * Find annotations by coding value
     */
    List<StudyAnnotation> findByCodingValue(String codingValue);

    /**
     * Search annotations by content
     */
    @Query("SELECT a FROM StudyAnnotation a WHERE " +
           "LOWER(a.annotationContent) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(a.annotationTitle) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(a.clinicalFinding) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    Page<StudyAnnotation> searchAnnotations(@Param("searchTerm") String searchTerm, Pageable pageable);

    /**
     * Find annotations with quality issues
     */
    @Query("SELECT a FROM StudyAnnotation a WHERE " +
           "a.qualityScore IS NOT NULL AND a.qualityScore < :qualityThreshold")
    List<StudyAnnotation> findAnnotationsWithQualityIssues(@Param("qualityThreshold") Double qualityThreshold);

    /**
     * Find annotations pending validation
     */
    @Query("SELECT a FROM StudyAnnotation a WHERE a.validationStatus = 'PENDING'")
    List<StudyAnnotation> findAnnotationsPendingValidation();

    /**
     * Find recent annotations by user
     */
    @Query("SELECT a FROM StudyAnnotation a WHERE a.createdBy = :userId AND " +
           "a.annotationDate >= :sinceDate ORDER BY a.annotationDate DESC")
    List<StudyAnnotation> findRecentAnnotationsByUser(@Param("userId") String userId,
                                                     @Param("sinceDate") LocalDateTime sinceDate);

    /**
     * Find annotations for review
     */
    @Query("SELECT a FROM StudyAnnotation a WHERE " +
           "a.annotationStatus IN ('DRAFT', 'PENDING_APPROVAL') AND " +
           "a.requiresApproval = true ORDER BY a.annotationDate ASC")
    List<StudyAnnotation> findAnnotationsForReview();

    /**
     * Bulk update annotation status
     */
    @Modifying
    @Query("UPDATE StudyAnnotation a SET a.annotationStatus = :annotationStatus WHERE a.id IN :annotationIds")
    void updateAnnotationStatusBulk(@Param("annotationIds") List<UUID> annotationIds,
                                   @Param("annotationStatus") AnnotationStatus annotationStatus);

    /**
     * Delete old annotations by status
     */
    @Modifying
    @Query("DELETE FROM StudyAnnotation a WHERE a.annotationStatus = :annotationStatus AND " +
           "a.lastModifiedDate < :cutoffDate")
    void deleteOldAnnotationsByStatus(@Param("annotationStatus") AnnotationStatus annotationStatus,
                                     @Param("cutoffDate") LocalDateTime cutoffDate);
}
