package com.hospital.hms.clinicalnotes.repository;

import com.hospital.hms.clinicalnotes.entity.ClinicalNote;
import com.hospital.hms.clinicalnotes.entity.NoteStatus;
import com.hospital.hms.clinicalnotes.entity.NoteType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.cache.annotation.Cacheable;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Clinical Note Repository Interface
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Repository
public interface ClinicalNoteRepository extends JpaRepository<ClinicalNote, UUID>, JpaSpecificationExecutor<ClinicalNote> {

    @Cacheable(value = "clinicalNotes", key = "#noteNumber")
    Optional<ClinicalNote> findByNoteNumber(String noteNumber);

    List<ClinicalNote> findByPatientId(UUID patientId);

    List<ClinicalNote> findByProviderId(UUID providerId);

    List<ClinicalNote> findByNoteType(NoteType noteType);

    List<ClinicalNote> findByStatus(NoteStatus status);

    @Query("SELECT n FROM ClinicalNote n WHERE n.patientId = :patientId AND n.noteType = :noteType ORDER BY n.noteDate DESC")
    List<ClinicalNote> findByPatientIdAndNoteType(@Param("patientId") UUID patientId, @Param("noteType") NoteType noteType);

    @Query("SELECT n FROM ClinicalNote n WHERE n.noteDate BETWEEN :startDate AND :endDate ORDER BY n.noteDate DESC")
    List<ClinicalNote> findByNoteDateBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query("SELECT n FROM ClinicalNote n WHERE n.status = 'DRAFT' AND n.createdDate < :cutoffDate")
    List<ClinicalNote> findStaleNotes(@Param("cutoffDate") LocalDateTime cutoffDate);

    @Query("SELECT n FROM ClinicalNote n WHERE LOWER(n.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(n.content) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(n.patientName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(n.providerName) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    Page<ClinicalNote> fullTextSearch(@Param("searchTerm") String searchTerm, Pageable pageable);

    boolean existsByNoteNumber(String noteNumber);

    @Query("SELECT COUNT(n) as totalNotes, " +
           "COUNT(CASE WHEN n.status = 'SIGNED' THEN 1 END) as signedCount, " +
           "COUNT(CASE WHEN n.status = 'DRAFT' THEN 1 END) as draftCount " +
           "FROM ClinicalNote n WHERE n.noteDate >= :startDate")
    Object[] getNoteStatistics(@Param("startDate") LocalDateTime startDate);
}
