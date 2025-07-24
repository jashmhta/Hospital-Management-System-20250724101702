package com.hospital.hms.clinicalnotes.service.impl;

import com.hospital.hms.clinicalnotes.dto.ClinicalNoteCreateRequestDto;
import com.hospital.hms.clinicalnotes.dto.ClinicalNoteResponseDto;
import com.hospital.hms.clinicalnotes.entity.ClinicalNote;
import com.hospital.hms.clinicalnotes.entity.NoteStatus;
import com.hospital.hms.clinicalnotes.entity.NoteType;
import com.hospital.hms.clinicalnotes.entity.NotePriority;
import com.hospital.hms.clinicalnotes.mapper.ClinicalNoteMapper;
import com.hospital.hms.clinicalnotes.repository.ClinicalNoteRepository;
import com.hospital.hms.clinicalnotes.service.ClinicalNoteService;
import com.hospital.hms.shared.exception.ResourceNotFoundException;
import com.hospital.hms.shared.exception.BusinessException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Implementation of ClinicalNoteService with comprehensive clinical documentation logic
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Service
@Transactional
public class ClinicalNoteServiceImpl implements ClinicalNoteService {

    private static final Logger logger = LoggerFactory.getLogger(ClinicalNoteServiceImpl.class);
    
    private final ClinicalNoteRepository clinicalNoteRepository;
    private final ClinicalNoteMapper clinicalNoteMapper;

    @Autowired
    public ClinicalNoteServiceImpl(ClinicalNoteRepository clinicalNoteRepository, ClinicalNoteMapper clinicalNoteMapper) {
        this.clinicalNoteRepository = clinicalNoteRepository;
        this.clinicalNoteMapper = clinicalNoteMapper;
    }

    @Override
    public ClinicalNoteResponseDto createNote(ClinicalNoteCreateRequestDto createRequest) {
        logger.info("Creating new clinical note for patient: {}, type: {}", 
            createRequest.getPatientId(), createRequest.getNoteType());

        try {
            // Validate business rules
            validateNoteCreation(createRequest);

            // Convert DTO to entity
            ClinicalNote clinicalNote = clinicalNoteMapper.toEntity(createRequest);

            // Set system-generated fields
            clinicalNote.setNoteNumber(generateNoteNumber(createRequest.getNoteType()));
            clinicalNote.setStatus(NoteStatus.DRAFT);
            clinicalNote.setSigned(false);

            // Set priority if not provided
            if (clinicalNote.getPriority() == null) {
                clinicalNote.setPriority(determinePriority(createRequest.getNoteType()));
            }

            // Set audit fields
            clinicalNote.setCreatedBy("system"); // TODO: Get from security context
            clinicalNote.setLastModifiedBy("system");

            // Validate note content requirements
            validateNoteContent(clinicalNote);

            // Save clinical note
            ClinicalNote savedNote = clinicalNoteRepository.save(clinicalNote);

            logger.info("Successfully created clinical note: {} for patient: {}", 
                savedNote.getNoteNumber(), savedNote.getPatientId());

            // TODO: Publish note created event
            // eventPublisher.publishNoteCreated(savedNote);

            return clinicalNoteMapper.toResponseDto(savedNote);

        } catch (Exception e) {
            logger.error("Error creating clinical note for patient: {}", createRequest.getPatientId(), e);
            throw new BusinessException("Failed to create clinical note: " + e.getMessage(), "NOTE_CREATION_FAILED");
        }
    }

    @Override
    public ClinicalNoteResponseDto updateNote(UUID noteId, ClinicalNoteCreateRequestDto updateRequest) {
        logger.info("Updating clinical note: {}", noteId);

        try {
            ClinicalNote existingNote = getNoteEntityById(noteId);

            // Validate update permissions
            validateNoteUpdate(existingNote, updateRequest);

            // Update entity from DTO
            clinicalNoteMapper.updateEntityFromDto(updateRequest, existingNote);

            // Validate updated content
            validateNoteContent(existingNote);

            // Update audit fields
            existingNote.setLastModifiedBy("system"); // TODO: Get from security context

            // If note was signed and content changed, mark as amended
            if (existingNote.getSigned() && existingNote.getStatus() == NoteStatus.SIGNED) {
                existingNote.setStatus(NoteStatus.AMENDED);
                existingNote.setSigned(false);
                existingNote.setSignedDate(null);
            }

            ClinicalNote updatedNote = clinicalNoteRepository.save(existingNote);

            logger.info("Successfully updated clinical note: {}", updatedNote.getNoteNumber());

            // TODO: Publish note updated event
            // eventPublisher.publishNoteUpdated(updatedNote);

            return clinicalNoteMapper.toResponseDto(updatedNote);

        } catch (Exception e) {
            logger.error("Error updating clinical note: {}", noteId, e);
            throw new BusinessException("Failed to update clinical note: " + e.getMessage(), "NOTE_UPDATE_FAILED");
        }
    }

    @Override
    @Transactional(readOnly = true)
    public ClinicalNoteResponseDto getNoteById(UUID noteId) {
        logger.debug("Retrieving clinical note by ID: {}", noteId);
        ClinicalNote note = getNoteEntityById(noteId);
        return clinicalNoteMapper.toResponseDto(note);
    }

    @Override
    @Transactional(readOnly = true)
    public ClinicalNoteResponseDto getNoteByNumber(String noteNumber) {
        logger.debug("Retrieving clinical note by number: {}", noteNumber);
        ClinicalNote note = clinicalNoteRepository.findByNoteNumber(noteNumber)
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Clinical note not found with number: " + noteNumber, 
                    noteNumber, 
                    "ClinicalNote"
                ));
        return clinicalNoteMapper.toResponseDto(note);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ClinicalNoteResponseDto> searchNotes(String searchTerm, Pageable pageable) {
        logger.debug("Searching clinical notes with term: {}", searchTerm);
        Page<ClinicalNote> notes = clinicalNoteRepository.fullTextSearch(searchTerm, pageable);
        return notes.map(clinicalNoteMapper::toResponseDto);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClinicalNoteResponseDto> getPatientNotes(UUID patientId) {
        logger.debug("Retrieving clinical notes for patient: {}", patientId);
        List<ClinicalNote> notes = clinicalNoteRepository.findByPatientId(patientId);
        return clinicalNoteMapper.toResponseDtoList(notes);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClinicalNoteResponseDto> getProviderNotes(UUID providerId) {
        logger.debug("Retrieving clinical notes for provider: {}", providerId);
        List<ClinicalNote> notes = clinicalNoteRepository.findByProviderId(providerId);
        return clinicalNoteMapper.toResponseDtoList(notes);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClinicalNoteResponseDto> getNotesByType(NoteType noteType) {
        logger.debug("Retrieving clinical notes with type: {}", noteType);
        List<ClinicalNote> notes = clinicalNoteRepository.findByNoteType(noteType);
        return clinicalNoteMapper.toResponseDtoList(notes);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClinicalNoteResponseDto> getNotesByStatus(NoteStatus status) {
        logger.debug("Retrieving clinical notes with status: {}", status);
        List<ClinicalNote> notes = clinicalNoteRepository.findByStatus(status);
        return clinicalNoteMapper.toResponseDtoList(notes);
    }

    @Override
    public ClinicalNoteResponseDto updateNoteStatus(UUID noteId, NoteStatus newStatus) {
        logger.info("Updating clinical note status: {} to {}", noteId, newStatus);

        try {
            ClinicalNote note = getNoteEntityById(noteId);
            NoteStatus oldStatus = note.getStatus();

            // Validate status transition
            validateStatusTransition(oldStatus, newStatus);

            note.setStatus(newStatus);
            note.setLastModifiedBy("system"); // TODO: Get from security context

            // Handle specific status changes
            handleStatusChange(note, oldStatus, newStatus);

            ClinicalNote updatedNote = clinicalNoteRepository.save(note);

            logger.info("Successfully updated clinical note status: {} from {} to {}", 
                note.getNoteNumber(), oldStatus, newStatus);

            // TODO: Publish note status changed event
            // eventPublisher.publishNoteStatusChanged(updatedNote, oldStatus, newStatus);

            return clinicalNoteMapper.toResponseDto(updatedNote);

        } catch (Exception e) {
            logger.error("Error updating clinical note status: {} to {}", noteId, newStatus, e);
            throw new BusinessException("Failed to update note status: " + e.getMessage(), "NOTE_STATUS_UPDATE_FAILED");
        }
    }

    @Override
    public ClinicalNoteResponseDto signNote(UUID noteId) {
        logger.info("Signing clinical note: {}", noteId);

        try {
            ClinicalNote note = getNoteEntityById(noteId);

            // Validate signing permissions
            validateNoteSigning(note);

            note.setSigned(true);
            note.setSignedDate(LocalDateTime.now());
            note.setStatus(NoteStatus.SIGNED);
            note.setLastModifiedBy("system"); // TODO: Get from security context

            ClinicalNote signedNote = clinicalNoteRepository.save(note);

            logger.info("Successfully signed clinical note: {}", signedNote.getNoteNumber());

            // TODO: Publish note signed event
            // eventPublisher.publishNoteSigned(signedNote);

            return clinicalNoteMapper.toResponseDto(signedNote);

        } catch (Exception e) {
            logger.error("Error signing clinical note: {}", noteId, e);
            throw new BusinessException("Failed to sign clinical note: " + e.getMessage(), "NOTE_SIGNING_FAILED");
        }
    }

    @Override
    public String generateNoteNumber() {
        return generateNoteNumber(NoteType.GENERAL_NOTE);
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getNoteStatistics() {
        logger.debug("Retrieving clinical note statistics");
        
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        Object[] stats = clinicalNoteRepository.getNoteStatistics(thirtyDaysAgo);
        
        Map<String, Object> statistics = new HashMap<>();
        if (stats != null && stats.length >= 3) {
            statistics.put("totalNotes", stats[0]);
            statistics.put("signedNotes", stats[1]);
            statistics.put("draftNotes", stats[2]);
            
            // Calculate derived metrics
            if (stats[0] != null && stats[1] != null) {
                Long totalNotes = (Long) stats[0];
                Long signedNotes = (Long) stats[1];
                
                if (totalNotes > 0) {
                    double signatureRate = (signedNotes.doubleValue() / totalNotes.doubleValue()) * 100;
                    statistics.put("signatureRate", Math.round(signatureRate * 100.0) / 100.0);
                }
                
                statistics.put("pendingSignatures", totalNotes - signedNotes);
            }
        }
        
        // Add note type distribution
        Map<String, Long> typeDistribution = new HashMap<>();
        for (NoteType noteType : NoteType.values()) {
            long count = clinicalNoteRepository.findByNoteType(noteType).size();
            typeDistribution.put(noteType.toString(), count);
        }
        statistics.put("noteTypeDistribution", typeDistribution);
        
        return statistics;
    }

    // Private helper methods

    private ClinicalNote getNoteEntityById(UUID noteId) {
        return clinicalNoteRepository.findById(noteId)
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Clinical note not found with ID: " + noteId, 
                    noteId.toString(), 
                    "ClinicalNote"
                ));
    }

    private void validateNoteCreation(ClinicalNoteCreateRequestDto createRequest) {
        // Validate required fields
        if (createRequest.getPatientId() == null) {
            throw new BusinessException("Patient ID is required", "PATIENT_ID_REQUIRED");
        }
        if (createRequest.getProviderId() == null) {
            throw new BusinessException("Provider ID is required", "PROVIDER_ID_REQUIRED");
        }
        if (createRequest.getNoteType() == null) {
            throw new BusinessException("Note type is required", "NOTE_TYPE_REQUIRED");
        }
        if (createRequest.getTitle() == null || createRequest.getTitle().trim().isEmpty()) {
            throw new BusinessException("Note title is required", "NOTE_TITLE_REQUIRED");
        }
        if (createRequest.getContent() == null || createRequest.getContent().trim().isEmpty()) {
            throw new BusinessException("Note content is required", "NOTE_CONTENT_REQUIRED");
        }
        if (createRequest.getNoteDate() == null) {
            throw new BusinessException("Note date is required", "NOTE_DATE_REQUIRED");
        }

        // Validate note date not in the future
        if (createRequest.getNoteDate().isAfter(LocalDateTime.now())) {
            throw new BusinessException("Note date cannot be in the future", "INVALID_NOTE_DATE");
        }
    }

    private void validateNoteUpdate(ClinicalNote existingNote, ClinicalNoteCreateRequestDto updateRequest) {
        // Cannot update final or cancelled notes
        if (existingNote.getStatus() == NoteStatus.FINAL || 
            existingNote.getStatus() == NoteStatus.CANCELLED) {
            throw new BusinessException(
                "Cannot update note with status: " + existingNote.getStatus(), 
                "INVALID_NOTE_STATUS_FOR_UPDATE"
            );
        }

        // Additional validation for signed notes
        if (existingNote.getSigned()) {
            logger.warn("Attempting to update signed note: {}", existingNote.getNoteNumber());
            // Allow update but will mark as amended
        }
    }

    private void validateNoteContent(ClinicalNote note) {
        // Validate content length requirements based on note type
        int minContentLength = getMinContentLength(note.getNoteType());
        if (note.getContent().length() < minContentLength) {
            throw new BusinessException(
                String.format("Note content must be at least %d characters for %s", 
                    minContentLength, note.getNoteType()),
                "INSUFFICIENT_NOTE_CONTENT"
            );
        }

        // Validate specific content requirements for certain note types
        validateSpecificNoteTypeContent(note);
    }

    private void validateNoteSigning(ClinicalNote note) {
        if (note.getStatus() == NoteStatus.DRAFT) {
            throw new BusinessException("Cannot sign a draft note. Please review first.", "CANNOT_SIGN_DRAFT_NOTE");
        }
        
        if (note.getStatus() == NoteStatus.CANCELLED) {
            throw new BusinessException("Cannot sign a cancelled note", "CANNOT_SIGN_CANCELLED_NOTE");
        }

        if (note.getSigned()) {
            throw new BusinessException("Note is already signed", "NOTE_ALREADY_SIGNED");
        }

        // Additional business rules for signing
        if (note.getContent().length() < 50) {
            throw new BusinessException("Note content too short for signing", "CONTENT_TOO_SHORT_FOR_SIGNING");
        }
    }

    private void validateStatusTransition(NoteStatus oldStatus, NoteStatus newStatus) {
        // Define valid status transitions
        Map<NoteStatus, List<NoteStatus>> validTransitions = Map.of(
            NoteStatus.DRAFT, List.of(NoteStatus.PENDING_REVIEW, NoteStatus.CANCELLED),
            NoteStatus.PENDING_REVIEW, List.of(NoteStatus.REVIEWED, NoteStatus.DRAFT, NoteStatus.CANCELLED),
            NoteStatus.REVIEWED, List.of(NoteStatus.SIGNED, NoteStatus.AMENDED, NoteStatus.CANCELLED),
            NoteStatus.SIGNED, List.of(NoteStatus.AMENDED, NoteStatus.FINAL),
            NoteStatus.AMENDED, List.of(NoteStatus.REVIEWED, NoteStatus.SIGNED, NoteStatus.CANCELLED),
            NoteStatus.FINAL, List.of(), // No transitions from final
            NoteStatus.CANCELLED, List.of() // No transitions from cancelled
        );

        List<NoteStatus> allowedTransitions = validTransitions.get(oldStatus);
        if (allowedTransitions == null || !allowedTransitions.contains(newStatus)) {
            throw new BusinessException(
                String.format("Invalid status transition from %s to %s", oldStatus, newStatus),
                "INVALID_STATUS_TRANSITION"
            );
        }
    }

    private String generateNoteNumber(NoteType noteType) {
        String prefix = getNoteTypePrefix(noteType);
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        String randomSuffix = String.format("%04d", (int) (Math.random() * 10000));
        return prefix + "-" + timestamp + "-" + randomSuffix;
    }

    private String getNoteTypePrefix(NoteType noteType) {
        return switch (noteType) {
            case PROGRESS_NOTE -> "PN";
            case CONSULTATION_NOTE -> "CN";
            case ADMISSION_NOTE -> "AN";
            case DISCHARGE_NOTE -> "DN";
            case SURGICAL_NOTE -> "SN";
            case NURSING_NOTE -> "NN";
            case THERAPY_NOTE -> "TN";
            case EMERGENCY_NOTE -> "EN";
            case FOLLOW_UP_NOTE -> "FN";
            case ASSESSMENT_NOTE -> "AS";
            case TREATMENT_PLAN -> "TP";
            case MEDICATION_NOTE -> "MN";
            case LABORATORY_NOTE -> "LN";
            case RADIOLOGY_NOTE -> "RN";
            case PATHOLOGY_NOTE -> "PN";
            default -> "GN";
        };
    }

    private NotePriority determinePriority(NoteType noteType) {
        return switch (noteType) {
            case EMERGENCY_NOTE -> NotePriority.URGENT;
            case SURGICAL_NOTE, DISCHARGE_NOTE -> NotePriority.HIGH;
            case CONSULTATION_NOTE, ASSESSMENT_NOTE -> NotePriority.HIGH;
            case ADMISSION_NOTE, TREATMENT_PLAN -> NotePriority.HIGH;
            default -> NotePriority.NORMAL;
        };
    }

    private int getMinContentLength(NoteType noteType) {
        return switch (noteType) {
            case PROGRESS_NOTE, NURSING_NOTE -> 100;
            case CONSULTATION_NOTE, ASSESSMENT_NOTE -> 200;
            case SURGICAL_NOTE, DISCHARGE_NOTE -> 300;
            case ADMISSION_NOTE -> 250;
            case EMERGENCY_NOTE -> 150;
            default -> 50;
        };
    }

    private void validateSpecificNoteTypeContent(ClinicalNote note) {
        // Implement specific validation rules based on note type
        switch (note.getNoteType()) {
            case SURGICAL_NOTE:
                validateSurgicalNoteContent(note);
                break;
            case DISCHARGE_NOTE:
                validateDischargeNoteContent(note);
                break;
            case MEDICATION_NOTE:
                validateMedicationNoteContent(note);
                break;
            default:
                // No specific validation required
                break;
        }
    }

    private void validateSurgicalNoteContent(ClinicalNote note) {
        String content = note.getContent().toLowerCase();
        // Check for required sections in surgical notes
        if (!content.contains("procedure") && !content.contains("operation")) {
            throw new BusinessException("Surgical note must contain procedure description", "MISSING_PROCEDURE_DESCRIPTION");
        }
    }

    private void validateDischargeNoteContent(ClinicalNote note) {
        String content = note.getContent().toLowerCase();
        // Check for required sections in discharge notes
        if (!content.contains("discharge") && !content.contains("disposition")) {
            throw new BusinessException("Discharge note must contain discharge disposition", "MISSING_DISCHARGE_DISPOSITION");
        }
    }

    private void validateMedicationNoteContent(ClinicalNote note) {
        String content = note.getContent().toLowerCase();
        // Check for medication-specific content
        if (!content.contains("medication") && !content.contains("drug") && !content.contains("prescription")) {
            throw new BusinessException("Medication note must contain medication information", "MISSING_MEDICATION_INFO");
        }
    }

    private void handleStatusChange(ClinicalNote note, NoteStatus oldStatus, NoteStatus newStatus) {
        // Handle specific business logic for status changes
        switch (newStatus) {
            case PENDING_REVIEW:
                // Notify reviewers, set review deadline
                break;
            case REVIEWED:
                // Mark as reviewed, eligible for signing
                break;
            case SIGNED:
                // Already handled in signNote method
                break;
            case FINAL:
                // Lock the note from further changes
                break;
            case CANCELLED:
                // Handle cancellation logic
                break;
            case AMENDED:
                // Reset signing status
                note.setSigned(false);
                note.setSignedDate(null);
                break;
            default:
                // No special handling needed
                break;
        }
    }
}
