package com.hospital.hms.clinicalnotes.service;

import com.hospital.hms.clinicalnotes.dto.ClinicalNoteCreateRequestDto;
import com.hospital.hms.clinicalnotes.dto.ClinicalNoteResponseDto;
import com.hospital.hms.clinicalnotes.entity.NoteStatus;
import com.hospital.hms.clinicalnotes.entity.NoteType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Service interface for Clinical Note Management operations
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
public interface ClinicalNoteService {

    ClinicalNoteResponseDto createNote(ClinicalNoteCreateRequestDto createRequest);

    ClinicalNoteResponseDto updateNote(UUID noteId, ClinicalNoteCreateRequestDto updateRequest);

    ClinicalNoteResponseDto getNoteById(UUID noteId);

    ClinicalNoteResponseDto getNoteByNumber(String noteNumber);

    Page<ClinicalNoteResponseDto> searchNotes(String searchTerm, Pageable pageable);

    List<ClinicalNoteResponseDto> getPatientNotes(UUID patientId);

    List<ClinicalNoteResponseDto> getProviderNotes(UUID providerId);

    List<ClinicalNoteResponseDto> getNotesByType(NoteType noteType);

    List<ClinicalNoteResponseDto> getNotesByStatus(NoteStatus status);

    ClinicalNoteResponseDto updateNoteStatus(UUID noteId, NoteStatus newStatus);

    ClinicalNoteResponseDto signNote(UUID noteId);

    String generateNoteNumber();

    Map<String, Object> getNoteStatistics();
}
