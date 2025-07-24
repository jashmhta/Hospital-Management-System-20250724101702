package com.hospital.hms.pacs.repository;

import com.hospital.hms.pacs.entity.DicomInstance;
import com.hospital.hms.pacs.entity.InstanceProcessingStatus;
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
 * Repository interface for DicomInstance entity
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Repository
public interface DicomInstanceRepository extends JpaRepository<DicomInstance, UUID>, JpaSpecificationExecutor<DicomInstance> {

    /**
     * Find instance by SOP Instance UID
     */
    Optional<DicomInstance> findBySopInstanceUid(String sopInstanceUid);

    /**
     * Find instances by series ID
     */
    List<DicomInstance> findBySeriesIdOrderByInstanceNumber(UUID seriesId);

    /**
     * Find instances by series and processing status
     */
    List<DicomInstance> findBySeriesIdAndProcessingStatus(UUID seriesId, InstanceProcessingStatus processingStatus);

    /**
     * Find instances by SOP Class UID
     */
    List<DicomInstance> findBySopClassUid(String sopClassUid);

    /**
     * Find instances by content date range
     */
    Page<DicomInstance> findByContentDateBetween(LocalDateTime startDate, LocalDateTime endDate, Pageable pageable);

    /**
     * Find instances by acquisition number
     */
    List<DicomInstance> findBySeriesIdAndAcquisitionNumber(UUID seriesId, Integer acquisitionNumber);

    /**
     * Count instances by series
     */
    long countBySeriesId(UUID seriesId);

    /**
     * Count instances by processing status
     */
    long countByProcessingStatus(InstanceProcessingStatus processingStatus);

    /**
     * Find instances needing processing
     */
    @Query("SELECT i FROM DicomInstance i WHERE i.processingStatus IN ('RECEIVED', 'PARSING', 'FAILED') " +
           "ORDER BY i.contentDate ASC")
    List<DicomInstance> findInstancesNeedingProcessing();

    /**
     * Find cached instances
     */
    List<DicomInstance> findByIsCachedTrue();

    /**
     * Find instances not cached
     */
    List<DicomInstance> findByIsCachedFalse();

    /**
     * Find instances by file size range
     */
    @Query("SELECT i FROM DicomInstance i WHERE i.fileSizeBytes BETWEEN :minSize AND :maxSize")
    List<DicomInstance> findByFileSizeRange(@Param("minSize") Long minSize, @Param("maxSize") Long maxSize);

    /**
     * Find large instances
     */
    @Query("SELECT i FROM DicomInstance i WHERE i.fileSizeBytes > :sizeThreshold ORDER BY i.fileSizeBytes DESC")
    List<DicomInstance> findLargeInstances(@Param("sizeThreshold") Long sizeThreshold, Pageable pageable);

    /**
     * Find multi-frame instances
     */
    @Query("SELECT i FROM DicomInstance i WHERE i.numberOfFrames > 1")
    List<DicomInstance> findMultiFrameInstances();

    /**
     * Find color instances
     */
    @Query("SELECT i FROM DicomInstance i WHERE i.samplesPerPixel > 1")
    List<DicomInstance> findColorInstances();

    /**
     * Find compressed instances
     */
    @Query("SELECT i FROM DicomInstance i WHERE i.transferSyntaxUid != '1.2.840.10008.1.2'")
    List<DicomInstance> findCompressedInstances();

    /**
     * Find instances with lossy compression
     */
    List<DicomInstance> findByLossyImageCompression(String lossyImageCompression);

    /**
     * Find instances by image dimensions
     */
    @Query("SELECT i FROM DicomInstance i WHERE i.rows = :rows AND i.columns = :columns")
    List<DicomInstance> findByImageDimensions(@Param("rows") Integer rows, @Param("columns") Integer columns);

    /**
     * Find instances by photometric interpretation
     */
    List<DicomInstance> findByPhotometricInterpretation(String photometricInterpretation);

    /**
     * Update processing status
     */
    @Modifying
    @Query("UPDATE DicomInstance i SET i.processingStatus = :processingStatus, i.processingDate = :processingDate, " +
           "i.processingErrors = :processingErrors WHERE i.id = :instanceId")
    void updateProcessingStatus(@Param("instanceId") UUID instanceId,
                               @Param("processingStatus") InstanceProcessingStatus processingStatus,
                               @Param("processingDate") LocalDateTime processingDate,
                               @Param("processingErrors") String processingErrors);

    /**
     * Update access information
     */
    @Modifying
    @Query("UPDATE DicomInstance i SET i.accessCount = i.accessCount + 1, i.lastAccessedDate = :accessDate " +
           "WHERE i.id = :instanceId")
    void updateAccessInfo(@Param("instanceId") UUID instanceId, @Param("accessDate") LocalDateTime accessDate);

    /**
     * Update cache status
     */
    @Modifying
    @Query("UPDATE DicomInstance i SET i.isCached = :isCached, i.cacheLocation = :cacheLocation " +
           "WHERE i.id = :instanceId")
    void updateCacheStatus(@Param("instanceId") UUID instanceId,
                          @Param("isCached") Boolean isCached,
                          @Param("cacheLocation") String cacheLocation);

    /**
     * Update validation status
     */
    @Modifying
    @Query("UPDATE DicomInstance i SET i.isValidated = :isValidated, i.validationErrors = :validationErrors, " +
           "i.validationDate = :validationDate WHERE i.id = :instanceId")
    void updateValidationStatus(@Param("instanceId") UUID instanceId,
                               @Param("isValidated") Boolean isValidated,
                               @Param("validationErrors") String validationErrors,
                               @Param("validationDate") LocalDateTime validationDate);

    /**
     * Get instance statistics by SOP Class
     */
    @Query("SELECT i.sopClassUid, COUNT(i), SUM(i.fileSizeBytes), AVG(i.fileSizeBytes) " +
           "FROM DicomInstance i WHERE i.contentDate BETWEEN :startDate AND :endDate " +
           "GROUP BY i.sopClassUid ORDER BY COUNT(i) DESC")
    List<Object[]> getInstanceStatisticsBySopClass(@Param("startDate") LocalDateTime startDate,
                                                   @Param("endDate") LocalDateTime endDate);

    /**
     * Get compression statistics
     */
    @Query("SELECT i.transferSyntaxUid, COUNT(i), AVG(i.fileSizeBytes), " +
           "SUM(CASE WHEN i.lossyImageCompression = '01' THEN 1 ELSE 0 END) " +
           "FROM DicomInstance i WHERE i.contentDate BETWEEN :startDate AND :endDate " +
           "GROUP BY i.transferSyntaxUid ORDER BY COUNT(i) DESC")
    List<Object[]> getCompressionStatistics(@Param("startDate") LocalDateTime startDate,
                                           @Param("endDate") LocalDateTime endDate);

    /**
     * Get image quality statistics
     */
    @Query("SELECT AVG(i.rows * i.columns), MIN(i.rows * i.columns), MAX(i.rows * i.columns), " +
           "AVG(i.bitsStored), COUNT(DISTINCT i.photometricInterpretation) " +
           "FROM DicomInstance i WHERE i.contentDate BETWEEN :startDate AND :endDate")
    Object[] getImageQualityStatistics(@Param("startDate") LocalDateTime startDate,
                                      @Param("endDate") LocalDateTime endDate);

    /**
     * Find instances with overlay data
     */
    List<DicomInstance> findByHasOverlayTrue();

    /**
     * Find instances by anonymization status
     */
    List<DicomInstance> findByIsAnonymized(Boolean isAnonymized);

    /**
     * Find instances by validation status
     */
    List<DicomInstance> findByIsValidated(Boolean isValidated);

    /**
     * Find instances by file hash
     */
    Optional<DicomInstance> findByFileHash(String fileHash);

    /**
     * Find duplicate instances (same hash)
     */
    @Query("SELECT i.fileHash, COUNT(i) FROM DicomInstance i WHERE i.fileHash IS NOT NULL " +
           "GROUP BY i.fileHash HAVING COUNT(i) > 1")
    List<Object[]> findDuplicateInstances();

    /**
     * Find instances frequently accessed
     */
    @Query("SELECT i FROM DicomInstance i WHERE i.accessCount > :accessThreshold " +
           "ORDER BY i.accessCount DESC")
    List<DicomInstance> findFrequentlyAccessedInstances(@Param("accessThreshold") Long accessThreshold, Pageable pageable);

    /**
     * Find instances rarely accessed
     */
    @Query("SELECT i FROM DicomInstance i WHERE i.lastAccessedDate < :accessDate OR i.lastAccessedDate IS NULL " +
           "ORDER BY i.lastAccessedDate ASC")
    List<DicomInstance> findRarelyAccessedInstances(@Param("accessDate") LocalDateTime accessDate, Pageable pageable);

    /**
     * Get storage usage by transfer syntax
     */
    @Query("SELECT i.transferSyntaxUid, COUNT(i), SUM(i.fileSizeBytes) " +
           "FROM DicomInstance i GROUP BY i.transferSyntaxUid ORDER BY SUM(i.fileSizeBytes) DESC")
    List<Object[]> getStorageUsageByTransferSyntax();

    /**
     * Find corrupted instances
     */
    List<DicomInstance> findByProcessingStatus(InstanceProcessingStatus processingStatus);

    /**
     * Update anonymization status
     */
    @Modifying
    @Query("UPDATE DicomInstance i SET i.isAnonymized = :isAnonymized, i.anonymizationMethod = :anonymizationMethod, " +
           "i.anonymizationDate = :anonymizationDate WHERE i.id = :instanceId")
    void updateAnonymizationStatus(@Param("instanceId") UUID instanceId,
                                  @Param("isAnonymized") Boolean isAnonymized,
                                  @Param("anonymizationMethod") String anonymizationMethod,
                                  @Param("anonymizationDate") LocalDateTime anonymizationDate);

    /**
     * Bulk update processing status
     */
    @Modifying
    @Query("UPDATE DicomInstance i SET i.processingStatus = :processingStatus WHERE i.id IN :instanceIds")
    void updateProcessingStatusBulk(@Param("instanceIds") List<UUID> instanceIds,
                                   @Param("processingStatus") InstanceProcessingStatus processingStatus);
}
