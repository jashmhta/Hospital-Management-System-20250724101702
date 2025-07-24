package com.hospital.hms.pacs.repository;

import com.hospital.hms.pacs.entity.DicomSeries;
import com.hospital.hms.pacs.entity.DicomModality;
import com.hospital.hms.pacs.entity.ProcessingStatus;
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
 * Repository interface for DicomSeries entity
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Repository
public interface DicomSeriesRepository extends JpaRepository<DicomSeries, UUID>, JpaSpecificationExecutor<DicomSeries> {

    /**
     * Find series by Series Instance UID
     */
    Optional<DicomSeries> findBySeriesInstanceUid(String seriesInstanceUid);

    /**
     * Find series by study ID
     */
    List<DicomSeries> findByStudyIdOrderBySeriesNumber(UUID studyId);

    /**
     * Find series by study and modality
     */
    List<DicomSeries> findByStudyIdAndModalityOrderBySeriesNumber(UUID studyId, DicomModality modality);

    /**
     * Find series by study and processing status
     */
    List<DicomSeries> findByStudyIdAndProcessingStatus(UUID studyId, ProcessingStatus processingStatus);

    /**
     * Find key series for study
     */
    List<DicomSeries> findByStudyIdAndIsKeySeriesTrue(UUID studyId);

    /**
     * Find series for presentation
     */
    List<DicomSeries> findByStudyIdAndIsForPresentationTrue(UUID studyId);

    /**
     * Find series by date range
     */
    Page<DicomSeries> findBySeriesDateBetween(LocalDateTime startDate, LocalDateTime endDate, Pageable pageable);

    /**
     * Find series by body part examined
     */
    List<DicomSeries> findByBodyPartExaminedContainingIgnoreCase(String bodyPart);

    /**
     * Find series by protocol name
     */
    List<DicomSeries> findByProtocolNameContainingIgnoreCase(String protocolName);

    /**
     * Find series by performing physician
     */
    Page<DicomSeries> findByPerformingPhysicianNameContainingIgnoreCase(String physicianName, Pageable pageable);

    /**
     * Count series by study
     */
    long countByStudyId(UUID studyId);

    /**
     * Count series by modality
     */
    long countByModality(DicomModality modality);

    /**
     * Count series by processing status
     */
    long countByProcessingStatus(ProcessingStatus processingStatus);

    /**
     * Get series statistics by modality
     */
    @Query("SELECT s.modality, COUNT(s), SUM(s.numberOfInstances), SUM(s.seriesSizeBytes), AVG(s.numberOfInstances) " +
           "FROM DicomSeries s WHERE s.seriesDate BETWEEN :startDate AND :endDate " +
           "GROUP BY s.modality ORDER BY COUNT(s) DESC")
    List<Object[]> getSeriesStatisticsByModality(@Param("startDate") LocalDateTime startDate,
                                                @Param("endDate") LocalDateTime endDate);

    /**
     * Get series statistics by body part
     */
    @Query("SELECT s.bodyPartExamined, COUNT(s), AVG(s.numberOfInstances) " +
           "FROM DicomSeries s WHERE s.seriesDate BETWEEN :startDate AND :endDate AND s.bodyPartExamined IS NOT NULL " +
           "GROUP BY s.bodyPartExamined ORDER BY COUNT(s) DESC")
    List<Object[]> getSeriesStatisticsByBodyPart(@Param("startDate") LocalDateTime startDate,
                                                 @Param("endDate") LocalDateTime endDate);

    /**
     * Find series with quality issues
     */
    @Query("SELECT s FROM DicomSeries s WHERE " +
           "s.imageQualityScore IS NOT NULL AND s.imageQualityScore < :qualityThreshold")
    List<DicomSeries> findSeriesWithQualityIssues(@Param("qualityThreshold") Double qualityThreshold);

    /**
     * Find large series
     */
    @Query("SELECT s FROM DicomSeries s WHERE s.seriesSizeBytes > :sizeThreshold ORDER BY s.seriesSizeBytes DESC")
    List<DicomSeries> findLargeSeries(@Param("sizeThreshold") Long sizeThreshold, Pageable pageable);

    /**
     * Find series with many instances
     */
    @Query("SELECT s FROM DicomSeries s WHERE s.numberOfInstances > :instanceThreshold ORDER BY s.numberOfInstances DESC")
    List<DicomSeries> findSeriesWithManyInstances(@Param("instanceThreshold") Integer instanceThreshold, Pageable pageable);

    /**
     * Update processing status
     */
    @Modifying
    @Query("UPDATE DicomSeries s SET s.processingStatus = :processingStatus, s.lastModifiedDate = :modifiedDate " +
           "WHERE s.id = :seriesId")
    void updateProcessingStatus(@Param("seriesId") UUID seriesId,
                               @Param("processingStatus") ProcessingStatus processingStatus,
                               @Param("modifiedDate") LocalDateTime modifiedDate);

    /**
     * Update series metrics
     */
    @Modifying
    @Query("UPDATE DicomSeries s SET s.numberOfInstances = :numberOfInstances, s.seriesSizeBytes = :seriesSizeBytes, " +
           "s.lastModifiedDate = :modifiedDate WHERE s.id = :seriesId")
    void updateSeriesMetrics(@Param("seriesId") UUID seriesId,
                            @Param("numberOfInstances") Integer numberOfInstances,
                            @Param("seriesSizeBytes") Long seriesSizeBytes,
                            @Param("modifiedDate") LocalDateTime modifiedDate);

    /**
     * Update image quality score
     */
    @Modifying
    @Query("UPDATE DicomSeries s SET s.imageQualityScore = :qualityScore, s.lastModifiedDate = :modifiedDate " +
           "WHERE s.id = :seriesId")
    void updateImageQualityScore(@Param("seriesId") UUID seriesId,
                                @Param("qualityScore") Double qualityScore,
                                @Param("modifiedDate") LocalDateTime modifiedDate);

    /**
     * Find series by slice thickness range
     */
    @Query("SELECT s FROM DicomSeries s WHERE " +
           "s.sliceThickness BETWEEN :minThickness AND :maxThickness")
    List<DicomSeries> findBySliceThicknessRange(@Param("minThickness") Double minThickness,
                                               @Param("maxThickness") Double maxThickness);

    /**
     * Find series by reconstruction type
     */
    List<DicomSeries> findByReconstructionTypeContainingIgnoreCase(String reconstructionType);

    /**
     * Find multi-frame series
     */
    @Query("SELECT s FROM DicomSeries s WHERE s.numberOfInstances = 1 AND " +
           "LOWER(s.seriesDescription) LIKE '%multiframe%'")
    List<DicomSeries> findMultiFrameSeries();

    /**
     * Find series needing processing
     */
    @Query("SELECT s FROM DicomSeries s WHERE s.processingStatus IN ('PENDING', 'FAILED') " +
           "ORDER BY s.seriesDate ASC")
    List<DicomSeries> findSeriesNeedingProcessing();

    /**
     * Find completed series by date range
     */
    @Query("SELECT s FROM DicomSeries s WHERE s.processingStatus = 'COMPLETED' AND " +
           "s.seriesDate BETWEEN :startDate AND :endDate ORDER BY s.seriesDate DESC")
    Page<DicomSeries> findCompletedSeriesByDateRange(@Param("startDate") LocalDateTime startDate,
                                                     @Param("endDate") LocalDateTime endDate,
                                                     Pageable pageable);

    /**
     * Search series by description
     */
    @Query("SELECT s FROM DicomSeries s WHERE " +
           "LOWER(s.seriesDescription) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    Page<DicomSeries> searchByDescription(@Param("searchTerm") String searchTerm, Pageable pageable);

    /**
     * Find series by contrast usage
     */
    List<DicomSeries> findByContrastAgentIsNotNull();

    /**
     * Find series without contrast
     */
    List<DicomSeries> findByContrastAgentIsNull();

    /**
     * Get contrast usage statistics
     */
    @Query("SELECT COUNT(CASE WHEN s.contrastAgent IS NOT NULL THEN 1 END), " +
           "COUNT(CASE WHEN s.contrastAgent IS NULL THEN 1 END), " +
           "COUNT(*) FROM DicomSeries s WHERE s.seriesDate BETWEEN :startDate AND :endDate")
    Object[] getContrastUsageStatistics(@Param("startDate") LocalDateTime startDate,
                                       @Param("endDate") LocalDateTime endDate);

    /**
     * Find series by compression type
     */
    List<DicomSeries> findByCompressionType(String compressionType);

    /**
     * Get compression statistics
     */
    @Query("SELECT s.compressionType, COUNT(s), AVG(s.seriesSizeBytes) " +
           "FROM DicomSeries s WHERE s.compressionType IS NOT NULL " +
           "GROUP BY s.compressionType ORDER BY COUNT(s) DESC")
    List<Object[]> getCompressionStatistics();

    /**
     * Find series by technical parameters
     */
    @Query("SELECT s FROM DicomSeries s WHERE " +
           "(:sliceThickness IS NULL OR s.sliceThickness = :sliceThickness) AND " +
           "(:repetitionTime IS NULL OR s.repetitionTime = :repetitionTime) AND " +
           "(:echoTime IS NULL OR s.echoTime = :echoTime) AND " +
           "(:magneticFieldStrength IS NULL OR s.magneticFieldStrength = :magneticFieldStrength)")
    List<DicomSeries> findByTechnicalParameters(@Param("sliceThickness") Double sliceThickness,
                                               @Param("repetitionTime") Double repetitionTime,
                                               @Param("echoTime") Double echoTime,
                                               @Param("magneticFieldStrength") Double magneticFieldStrength);
}
