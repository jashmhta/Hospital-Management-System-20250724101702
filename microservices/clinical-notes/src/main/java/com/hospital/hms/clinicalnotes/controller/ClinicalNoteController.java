package com.hospital.hms.clinicalnotes.controller;

import com.hospital.hms.clinicalnotes.dto.ClinicalNoteCreateRequestDto;
import com.hospital.hms.clinicalnotes.dto.ClinicalNoteResponseDto;
import com.hospital.hms.clinicalnotes.entity.NoteStatus;
import com.hospital.hms.clinicalnotes.entity.NoteType;
import com.hospital.hms.clinicalnotes.service.ClinicalNoteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * REST Controller for Clinical Note Management
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@RestController
@RequestMapping("/api/v1/clinical-notes")
@Tag(name = "Clinical Notes", description = "Clinical Note Management API")
public class ClinicalNoteController {

    private final ClinicalNoteService clinicalNoteService;

    @Autowired
    public ClinicalNoteController(ClinicalNoteService clinicalNoteService) {
        this.clinicalNoteService = clinicalNoteService;
    }

    @Operation(summary = "Create a new clinical note")
    @ApiResponse(responseCode = "201", description = "Clinical note created successfully")
    @PostMapping
    public ResponseEntity<ClinicalNoteResponseDto> createNote(@Valid @RequestBody ClinicalNoteCreateRequestDto createRequest) {
        ClinicalNoteResponseDto note = clinicalNoteService.createNote(createRequest);
        return new ResponseEntity<>(note, HttpStatus.CREATED);
    }

    @Operation(summary = "Update an existing clinical note")
    @ApiResponse(responseCode = "200", description = "Clinical note updated successfully")
    @PutMapping("/{noteId}")
    public ResponseEntity<ClinicalNoteResponseDto> updateNote(
            @Parameter(description = "Note ID") @PathVariable UUID noteId,
            @Valid @RequestBody ClinicalNoteCreateRequestDto updateRequest) {
        ClinicalNoteResponseDto note = clinicalNoteService.updateNote(noteId, updateRequest);
        return ResponseEntity.ok(note);
    }

    @Operation(summary = "Get clinical note by ID")
    @ApiResponse(responseCode = "200", description = "Clinical note found")
    @GetMapping("/{noteId}")
    public ResponseEntity<ClinicalNoteResponseDto> getNoteById(@Parameter(description = "Note ID") @PathVariable UUID noteId) {
        ClinicalNoteResponseDto note = clinicalNoteService.getNoteById(noteId);
        return ResponseEntity.ok(note);
    }

    @Operation(summary = "Get clinical note by number")
    @ApiResponse(responseCode = "200", description = "Clinical note found")
    @GetMapping("/number/{noteNumber}")
    public ResponseEntity<ClinicalNoteResponseDto> getNoteByNumber(@Parameter(description = "Note number") @PathVariable String noteNumber) {
        ClinicalNoteResponseDto note = clinicalNoteService.getNoteByNumber(noteNumber);
        return ResponseEntity.ok(note);
    }

    @Operation(summary = "Search clinical notes")
    @ApiResponse(responseCode = "200", description = "Clinical notes found")
    @GetMapping("/search")
    public ResponseEntity<Page<ClinicalNoteResponseDto>> searchNotes(
            @Parameter(description = "Search term") @RequestParam String searchTerm,
            Pageable pageable) {
        Page<ClinicalNoteResponseDto> notes = clinicalNoteService.searchNotes(searchTerm, pageable);
        return ResponseEntity.ok(notes);
    }

    @Operation(summary = "Get clinical notes by patient ID")
    @ApiResponse(responseCode = "200", description = "Clinical notes found")
    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<ClinicalNoteResponseDto>> getPatientNotes(@Parameter(description = "Patient ID") @PathVariable UUID patientId) {
        List<ClinicalNoteResponseDto> notes = clinicalNoteService.getPatientNotes(patientId);
        return ResponseEntity.ok(notes);
    }

    @Operation(summary = "Get clinical notes by provider ID")
    @ApiResponse(responseCode = "200", description = "Clinical notes found")
    @GetMapping("/provider/{providerId}")
    public ResponseEntity<List<ClinicalNoteResponseDto>> getProviderNotes(@Parameter(description = "Provider ID") @PathVariable UUID providerId) {
        List<ClinicalNoteResponseDto> notes = clinicalNoteService.getProviderNotes(providerId);
        return ResponseEntity.ok(notes);
    }

    @Operation(summary = "Get clinical notes by type")
    @ApiResponse(responseCode = "200", description = "Clinical notes found")
    @GetMapping("/type/{noteType}")
    public ResponseEntity<List<ClinicalNoteResponseDto>> getNotesByType(@Parameter(description = "Note type") @PathVariable NoteType noteType) {
        List<ClinicalNoteResponseDto> notes = clinicalNoteService.getNotesByType(noteType);
        return ResponseEntity.ok(notes);
    }

    @Operation(summary = "Get clinical notes by status")
    @ApiResponse(responseCode = "200", description = "Clinical notes found")
    @GetMapping("/status/{status}")
    public ResponseEntity<List<ClinicalNoteResponseDto>> getNotesByStatus(@Parameter(description = "Note status") @PathVariable NoteStatus status) {
        List<ClinicalNoteResponseDto> notes = clinicalNoteService.getNotesByStatus(status);
        return ResponseEntity.ok(notes);
    }

    @Operation(summary = "Update clinical note status")
    @ApiResponse(responseCode = "200", description = "Clinical note status updated")
    @PutMapping("/{noteId}/status")
    public ResponseEntity<ClinicalNoteResponseDto> updateNoteStatus(
            @Parameter(description = "Note ID") @PathVariable UUID noteId,
            @Parameter(description = "New status") @RequestParam NoteStatus status) {
        ClinicalNoteResponseDto note = clinicalNoteService.updateNoteStatus(noteId, status);
        return ResponseEntity.ok(note);
    }

    @Operation(summary = "Sign clinical note")
    @ApiResponse(responseCode = "200", description = "Clinical note signed")
    @PutMapping("/{noteId}/sign")
    public ResponseEntity<ClinicalNoteResponseDto> signNote(@Parameter(description = "Note ID") @PathVariable UUID noteId) {
        ClinicalNoteResponseDto note = clinicalNoteService.signNote(noteId);
        return ResponseEntity.ok(note);
    }

    @Operation(summary = "Get clinical note statistics")
    @ApiResponse(responseCode = "200", description = "Statistics retrieved")
    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getNoteStatistics() {
        Map<String, Object> statistics = clinicalNoteService.getNoteStatistics();
        return ResponseEntity.ok(statistics);
    }
}
