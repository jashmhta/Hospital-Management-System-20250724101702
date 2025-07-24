package com.hospital.hms.appointmentscheduling.controller;

import com.hospital.hms.appointmentscheduling.dto.AppointmentCreateRequestDto;
import com.hospital.hms.appointmentscheduling.dto.AppointmentResponseDto;
import com.hospital.hms.appointmentscheduling.entity.AppointmentStatus;
import com.hospital.hms.appointmentscheduling.service.AppointmentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * REST Controller for Appointment Management operations
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@RestController
@RequestMapping("/api/v1/appointments")
@Tag(name = "Appointment Management", description = "APIs for managing healthcare appointments")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AppointmentController {

    private final AppointmentService appointmentService;

    @Autowired
    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @Operation(summary = "Create a new appointment")
    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('REGISTRATION_STAFF')")
    public ResponseEntity<AppointmentResponseDto> createAppointment(
            @Valid @RequestBody AppointmentCreateRequestDto createRequest) {
        
        AppointmentResponseDto response = appointmentService.createAppointment(createRequest);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @Operation(summary = "Update appointment information")
    @PutMapping("/{appointmentId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('REGISTRATION_STAFF')")
    public ResponseEntity<AppointmentResponseDto> updateAppointment(
            @PathVariable UUID appointmentId,
            @Valid @RequestBody AppointmentCreateRequestDto updateRequest) {
        
        AppointmentResponseDto response = appointmentService.updateAppointment(appointmentId, updateRequest);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Get appointment by ID")
    @GetMapping("/{appointmentId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE') or hasRole('REGISTRATION_STAFF')")
    public ResponseEntity<AppointmentResponseDto> getAppointmentById(@PathVariable UUID appointmentId) {
        AppointmentResponseDto response = appointmentService.getAppointmentById(appointmentId);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Get appointment by appointment number")
    @GetMapping("/number/{appointmentNumber}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE') or hasRole('REGISTRATION_STAFF')")
    public ResponseEntity<AppointmentResponseDto> getAppointmentByNumber(@PathVariable String appointmentNumber) {
        AppointmentResponseDto response = appointmentService.getAppointmentByNumber(appointmentNumber);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Search appointments")
    @GetMapping("/search")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE') or hasRole('REGISTRATION_STAFF')")
    public ResponseEntity<Page<AppointmentResponseDto>> searchAppointments(
            @RequestParam String searchTerm,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<AppointmentResponseDto> response = appointmentService.searchAppointments(searchTerm, pageable);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Get patient appointments")
    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE') or hasRole('REGISTRATION_STAFF')")
    public ResponseEntity<List<AppointmentResponseDto>> getPatientAppointments(@PathVariable UUID patientId) {
        List<AppointmentResponseDto> response = appointmentService.getPatientAppointments(patientId);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Get provider schedule")
    @GetMapping("/provider/{providerId}/schedule")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE') or hasRole('REGISTRATION_STAFF')")
    public ResponseEntity<List<AppointmentResponseDto>> getProviderSchedule(
            @PathVariable UUID providerId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        
        List<AppointmentResponseDto> response = appointmentService.getProviderSchedule(providerId, startDate, endDate);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Update appointment status")
    @PutMapping("/{appointmentId}/status")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('NURSE') or hasRole('REGISTRATION_STAFF')")
    public ResponseEntity<AppointmentResponseDto> updateAppointmentStatus(
            @PathVariable UUID appointmentId,
            @RequestParam AppointmentStatus status) {
        
        AppointmentResponseDto response = appointmentService.updateAppointmentStatus(appointmentId, status);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Check in appointment")
    @PutMapping("/{appointmentId}/checkin")
    @PreAuthorize("hasRole('ADMIN') or hasRole('REGISTRATION_STAFF') or hasRole('NURSE')")
    public ResponseEntity<AppointmentResponseDto> checkInAppointment(@PathVariable UUID appointmentId) {
        AppointmentResponseDto response = appointmentService.checkInAppointment(appointmentId);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Complete appointment")
    @PutMapping("/{appointmentId}/complete")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    public ResponseEntity<AppointmentResponseDto> completeAppointment(@PathVariable UUID appointmentId) {
        AppointmentResponseDto response = appointmentService.completeAppointment(appointmentId);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Cancel appointment")
    @PutMapping("/{appointmentId}/cancel")
    @PreAuthorize("hasRole('ADMIN') or hasRole('REGISTRATION_STAFF') or hasRole('DOCTOR')")
    public ResponseEntity<AppointmentResponseDto> cancelAppointment(
            @PathVariable UUID appointmentId,
            @RequestParam(required = false) String reason) {
        
        AppointmentResponseDto response = appointmentService.cancelAppointment(appointmentId, reason);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Reschedule appointment")
    @PutMapping("/{appointmentId}/reschedule")
    @PreAuthorize("hasRole('ADMIN') or hasRole('REGISTRATION_STAFF')")
    public ResponseEntity<AppointmentResponseDto> rescheduleAppointment(
            @PathVariable UUID appointmentId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime newDateTime) {
        
        AppointmentResponseDto response = appointmentService.rescheduleAppointment(appointmentId, newDateTime);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Get appointment statistics")
    @GetMapping("/statistics")
    @PreAuthorize("hasRole('ADMIN') or hasRole('ANALYTICS')")
    public ResponseEntity<Map<String, Object>> getAppointmentStatistics() {
        Map<String, Object> response = appointmentService.getAppointmentStatistics();
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Generate appointment number")
    @GetMapping("/generate-number")
    @PreAuthorize("hasRole('ADMIN') or hasRole('REGISTRATION_STAFF')")
    public ResponseEntity<Map<String, String>> generateAppointmentNumber() {
        String appointmentNumber = appointmentService.generateAppointmentNumber();
        Map<String, String> response = Map.of("appointmentNumber", appointmentNumber);
        return ResponseEntity.ok(response);
    }
}
