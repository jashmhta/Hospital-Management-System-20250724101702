package com.hospital.hms.provider.controller;

import com.hospital.hms.provider.dto.*;
import com.hospital.hms.provider.service.ProviderMobileService;
import io.micrometer.core.annotation.Timed;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Provider Mobile Backend Controller
 * 
 * Provides comprehensive mobile API endpoints for healthcare providers.
 * Supports clinical workflows, patient management, scheduling, and documentation.
 * 
 * Features:
 * - Provider authentication and profile management
 * - Patient data access and clinical workflows
 * - Appointment scheduling and management
 * - Clinical documentation and notes
 * - Real-time notifications and alerts
 * - Medication management and prescriptions
 * - Diagnostic data and lab results
 * - Mobile-optimized responses
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/provider/mobile")
@RequiredArgsConstructor
@PreAuthorize("hasRole('PROVIDER') or hasRole('DOCTOR') or hasRole('NURSE')")
public class ProviderMobileController {

    private final ProviderMobileService providerMobileService;

    /**
     * Provider authentication and session management
     */
    @PostMapping("/auth/login")
    @Timed(value = "provider.mobile.auth.login", description = "Time taken for provider login")
    public ResponseEntity<ProviderAuthResponseDto> login(@Valid @RequestBody ProviderLoginDto loginDto) {
        log.info("Provider login attempt for: {}", loginDto.getUsername());
        
        ProviderAuthResponseDto response = providerMobileService.authenticateProvider(loginDto);
        
        log.info("Provider login successful for: {}", loginDto.getUsername());
        return ResponseEntity.ok(response);
    }

    /**
     * Refresh authentication token
     */
    @PostMapping("/auth/refresh")
    @Timed(value = "provider.mobile.auth.refresh", description = "Time taken to refresh token")
    public ResponseEntity<ProviderAuthResponseDto> refreshToken(@RequestBody Map<String, String> request) {
        String refreshToken = request.get("refreshToken");
        log.info("Refreshing provider token");
        
        ProviderAuthResponseDto response = providerMobileService.refreshToken(refreshToken);
        
        log.info("Provider token refreshed successfully");
        return ResponseEntity.ok(response);
    }

    /**
     * Get provider profile and dashboard data
     */
    @GetMapping("/profile")
    @Timed(value = "provider.mobile.profile", description = "Time taken to get provider profile")
    public ResponseEntity<ProviderProfileDto> getProviderProfile() {
        log.info("Fetching provider profile");
        
        ProviderProfileDto profile = providerMobileService.getProviderProfile();
        
        log.info("Provider profile retrieved successfully");
        return ResponseEntity.ok(profile);
    }

    /**
     * Update provider profile
     */
    @PutMapping("/profile")
    @Timed(value = "provider.mobile.profile.update", description = "Time taken to update provider profile")
    public ResponseEntity<ProviderProfileDto> updateProviderProfile(
            @Valid @RequestBody ProviderProfileDto profileDto) {
        log.info("Updating provider profile");
        
        ProviderProfileDto updatedProfile = providerMobileService.updateProviderProfile(profileDto);
        
        log.info("Provider profile updated successfully");
        return ResponseEntity.ok(updatedProfile);
    }

    /**
     * Get provider dashboard summary
     */
    @GetMapping("/dashboard")
    @Timed(value = "provider.mobile.dashboard", description = "Time taken to get dashboard data")
    public ResponseEntity<ProviderDashboardDto> getDashboard() {
        log.info("Fetching provider dashboard");
        
        ProviderDashboardDto dashboard = providerMobileService.getProviderDashboard();
        
        log.info("Provider dashboard retrieved successfully");
        return ResponseEntity.ok(dashboard);
    }

    /**
     * Get provider's patient list
     */
    @GetMapping("/patients")
    @Timed(value = "provider.mobile.patients.list", description = "Time taken to get patient list")
    public ResponseEntity<Page<MobilePatientDto>> getPatients(
            @RequestParam(required = false) String searchTerm,
            @RequestParam(required = false) String status,
            Pageable pageable) {
        log.info("Fetching provider patients - Search: {}, Status: {}", searchTerm, status);
        
        Page<MobilePatientDto> patients = providerMobileService.getProviderPatients(
                searchTerm, status, pageable);
        
        log.info("Retrieved {} patients for provider", patients.getTotalElements());
        return ResponseEntity.ok(patients);
    }

    /**
     * Get detailed patient information
     */
    @GetMapping("/patients/{patientId}")
    @Timed(value = "provider.mobile.patient.details", description = "Time taken to get patient details")
    public ResponseEntity<MobilePatientDetailDto> getPatientDetails(@PathVariable String patientId) {
        log.info("Fetching patient details for ID: {}", patientId);
        
        MobilePatientDetailDto patientDetails = providerMobileService.getPatientDetails(patientId);
        
        log.info("Patient details retrieved for ID: {}", patientId);
        return ResponseEntity.ok(patientDetails);
    }

    /**
     * Get patient's medical history
     */
    @GetMapping("/patients/{patientId}/history")
    @Timed(value = "provider.mobile.patient.history", description = "Time taken to get patient history")
    public ResponseEntity<MobilePatientHistoryDto> getPatientHistory(
            @PathVariable String patientId,
            @RequestParam(defaultValue = "30") int days) {
        log.info("Fetching patient history for ID: {}, days: {}", patientId, days);
        
        MobilePatientHistoryDto history = providerMobileService.getPatientHistory(patientId, days);
        
        log.info("Patient history retrieved for ID: {}", patientId);
        return ResponseEntity.ok(history);
    }

    /**
     * Get provider's appointments
     */
    @GetMapping("/appointments")
    @Timed(value = "provider.mobile.appointments.list", description = "Time taken to get appointments")
    public ResponseEntity<Page<MobileAppointmentDto>> getAppointments(
            @RequestParam(required = false) String date,
            @RequestParam(required = false) String status,
            Pageable pageable) {
        log.info("Fetching provider appointments - Date: {}, Status: {}", date, status);
        
        Page<MobileAppointmentDto> appointments = providerMobileService.getProviderAppointments(
                date, status, pageable);
        
        log.info("Retrieved {} appointments for provider", appointments.getTotalElements());
        return ResponseEntity.ok(appointments);
    }

    /**
     * Get appointment details
     */
    @GetMapping("/appointments/{appointmentId}")
    @Timed(value = "provider.mobile.appointment.details", description = "Time taken to get appointment details")
    public ResponseEntity<MobileAppointmentDetailDto> getAppointmentDetails(@PathVariable String appointmentId) {
        log.info("Fetching appointment details for ID: {}", appointmentId);
        
        MobileAppointmentDetailDto details = providerMobileService.getAppointmentDetails(appointmentId);
        
        log.info("Appointment details retrieved for ID: {}", appointmentId);
        return ResponseEntity.ok(details);
    }

    /**
     * Start appointment consultation
     */
    @PostMapping("/appointments/{appointmentId}/start")
    @Timed(value = "provider.mobile.appointment.start", description = "Time taken to start appointment")
    public ResponseEntity<MobileConsultationDto> startAppointment(@PathVariable String appointmentId) {
        log.info("Starting appointment consultation for ID: {}", appointmentId);
        
        MobileConsultationDto consultation = providerMobileService.startAppointment(appointmentId);
        
        log.info("Appointment consultation started for ID: {}", appointmentId);
        return ResponseEntity.ok(consultation);
    }

    /**
     * Complete appointment consultation
     */
    @PostMapping("/appointments/{appointmentId}/complete")
    @Timed(value = "provider.mobile.appointment.complete", description = "Time taken to complete appointment")
    public ResponseEntity<Void> completeAppointment(
            @PathVariable String appointmentId,
            @Valid @RequestBody MobileConsultationDto consultationDto) {
        log.info("Completing appointment consultation for ID: {}", appointmentId);
        
        providerMobileService.completeAppointment(appointmentId, consultationDto);
        
        log.info("Appointment consultation completed for ID: {}", appointmentId);
        return ResponseEntity.ok().build();
    }

    /**
     * Add clinical notes
     */
    @PostMapping("/patients/{patientId}/notes")
    @Timed(value = "provider.mobile.notes.add", description = "Time taken to add clinical notes")
    public ResponseEntity<MobileClinicalNoteDto> addClinicalNote(
            @PathVariable String patientId,
            @Valid @RequestBody MobileClinicalNoteDto noteDto) {
        log.info("Adding clinical note for patient ID: {}", patientId);
        
        MobileClinicalNoteDto savedNote = providerMobileService.addClinicalNote(patientId, noteDto);
        
        log.info("Clinical note added for patient ID: {}", patientId);
        return ResponseEntity.ok(savedNote);
    }

    /**
     * Get patient's clinical notes
     */
    @GetMapping("/patients/{patientId}/notes")
    @Timed(value = "provider.mobile.notes.list", description = "Time taken to get clinical notes")
    public ResponseEntity<Page<MobileClinicalNoteDto>> getClinicalNotes(
            @PathVariable String patientId,
            Pageable pageable) {
        log.info("Fetching clinical notes for patient ID: {}", patientId);
        
        Page<MobileClinicalNoteDto> notes = providerMobileService.getClinicalNotes(patientId, pageable);
        
        log.info("Retrieved {} clinical notes for patient ID: {}", notes.getTotalElements(), patientId);
        return ResponseEntity.ok(notes);
    }

    /**
     * Create prescription
     */
    @PostMapping("/patients/{patientId}/prescriptions")
    @Timed(value = "provider.mobile.prescription.create", description = "Time taken to create prescription")
    public ResponseEntity<MobilePrescriptionDto> createPrescription(
            @PathVariable String patientId,
            @Valid @RequestBody MobilePrescriptionDto prescriptionDto) {
        log.info("Creating prescription for patient ID: {}", patientId);
        
        MobilePrescriptionDto savedPrescription = providerMobileService.createPrescription(patientId, prescriptionDto);
        
        log.info("Prescription created for patient ID: {}", patientId);
        return ResponseEntity.ok(savedPrescription);
    }

    /**
     * Get patient's prescriptions
     */
    @GetMapping("/patients/{patientId}/prescriptions")
    @Timed(value = "provider.mobile.prescriptions.list", description = "Time taken to get prescriptions")
    public ResponseEntity<Page<MobilePrescriptionDto>> getPrescriptions(
            @PathVariable String patientId,
            @RequestParam(defaultValue = "false") boolean activeOnly,
            Pageable pageable) {
        log.info("Fetching prescriptions for patient ID: {}, activeOnly: {}", patientId, activeOnly);
        
        Page<MobilePrescriptionDto> prescriptions = providerMobileService.getPatientPrescriptions(
                patientId, activeOnly, pageable);
        
        log.info("Retrieved {} prescriptions for patient ID: {}", prescriptions.getTotalElements(), patientId);
        return ResponseEntity.ok(prescriptions);
    }

    /**
     * Order lab tests
     */
    @PostMapping("/patients/{patientId}/lab-orders")
    @Timed(value = "provider.mobile.lab.order", description = "Time taken to order lab tests")
    public ResponseEntity<MobileLabOrderDto> orderLabTests(
            @PathVariable String patientId,
            @Valid @RequestBody MobileLabOrderDto labOrderDto) {
        log.info("Ordering lab tests for patient ID: {}", patientId);
        
        MobileLabOrderDto savedOrder = providerMobileService.orderLabTests(patientId, labOrderDto);
        
        log.info("Lab tests ordered for patient ID: {}", patientId);
        return ResponseEntity.ok(savedOrder);
    }

    /**
     * Get lab results
     */
    @GetMapping("/patients/{patientId}/lab-results")
    @Timed(value = "provider.mobile.lab.results", description = "Time taken to get lab results")
    public ResponseEntity<Page<MobileLabResultDto>> getLabResults(
            @PathVariable String patientId,
            @RequestParam(required = false) String fromDate,
            @RequestParam(required = false) String toDate,
            Pageable pageable) {
        log.info("Fetching lab results for patient ID: {}", patientId);
        
        Page<MobileLabResultDto> results = providerMobileService.getLabResults(
                patientId, fromDate, toDate, pageable);
        
        log.info("Retrieved {} lab results for patient ID: {}", results.getTotalElements(), patientId);
        return ResponseEntity.ok(results);
    }

    /**
     * Get provider notifications
     */
    @GetMapping("/notifications")
    @Timed(value = "provider.mobile.notifications.list", description = "Time taken to get notifications")
    public ResponseEntity<Page<MobileNotificationDto>> getNotifications(
            @RequestParam(defaultValue = "false") boolean unreadOnly,
            Pageable pageable) {
        log.info("Fetching provider notifications, unreadOnly: {}", unreadOnly);
        
        Page<MobileNotificationDto> notifications = providerMobileService.getNotifications(
                unreadOnly, pageable);
        
        log.info("Retrieved {} notifications for provider", notifications.getTotalElements());
        return ResponseEntity.ok(notifications);
    }

    /**
     * Mark notification as read
     */
    @PutMapping("/notifications/{notificationId}/read")
    @Timed(value = "provider.mobile.notification.read", description = "Time taken to mark notification as read")
    public ResponseEntity<Void> markNotificationAsRead(@PathVariable String notificationId) {
        log.info("Marking notification as read: {}", notificationId);
        
        providerMobileService.markNotificationAsRead(notificationId);
        
        log.info("Notification marked as read: {}", notificationId);
        return ResponseEntity.ok().build();
    }

    /**
     * Get provider's schedule for the day
     */
    @GetMapping("/schedule")
    @Timed(value = "provider.mobile.schedule", description = "Time taken to get provider schedule")
    public ResponseEntity<MobileScheduleDto> getProviderSchedule(
            @RequestParam(required = false) String date) {
        log.info("Fetching provider schedule for date: {}", date);
        
        MobileScheduleDto schedule = providerMobileService.getProviderSchedule(date);
        
        log.info("Provider schedule retrieved for date: {}", date);
        return ResponseEntity.ok(schedule);
    }

    /**
     * Get quick stats for mobile dashboard
     */
    @GetMapping("/quick-stats")
    @Timed(value = "provider.mobile.quick.stats", description = "Time taken to get quick stats")
    public ResponseEntity<Map<String, Object>> getQuickStats() {
        log.info("Fetching provider quick stats");
        
        Map<String, Object> stats = providerMobileService.getQuickStats();
        
        log.info("Provider quick stats retrieved");
        return ResponseEntity.ok(stats);
    }

    /**
     * Emergency patient lookup
     */
    @GetMapping("/emergency/patient-lookup")
    @Timed(value = "provider.mobile.emergency.lookup", description = "Time taken for emergency patient lookup")
    public ResponseEntity<List<MobilePatientDto>> emergencyPatientLookup(
            @RequestParam String searchTerm) {
        log.info("Emergency patient lookup for: {}", searchTerm);
        
        List<MobilePatientDto> patients = providerMobileService.emergencyPatientLookup(searchTerm);
        
        log.info("Emergency patient lookup completed, found {} patients", patients.size());
        return ResponseEntity.ok(patients);
    }

    /**
     * Get patient vitals
     */
    @GetMapping("/patients/{patientId}/vitals")
    @Timed(value = "provider.mobile.patient.vitals", description = "Time taken to get patient vitals")
    public ResponseEntity<MobileVitalsDto> getPatientVitals(@PathVariable String patientId) {
        log.info("Fetching patient vitals for ID: {}", patientId);
        
        MobileVitalsDto vitals = providerMobileService.getPatientVitals(patientId);
        
        log.info("Patient vitals retrieved for ID: {}", patientId);
        return ResponseEntity.ok(vitals);
    }

    /**
     * Record patient vitals
     */
    @PostMapping("/patients/{patientId}/vitals")
    @Timed(value = "provider.mobile.vitals.record", description = "Time taken to record patient vitals")
    public ResponseEntity<MobileVitalsDto> recordPatientVitals(
            @PathVariable String patientId,
            @Valid @RequestBody MobileVitalsDto vitalsDto) {
        log.info("Recording patient vitals for ID: {}", patientId);
        
        MobileVitalsDto savedVitals = providerMobileService.recordPatientVitals(patientId, vitalsDto);
        
        log.info("Patient vitals recorded for ID: {}", patientId);
        return ResponseEntity.ok(savedVitals);
    }

    /**
     * Provider logout
     */
    @PostMapping("/auth/logout")
    @Timed(value = "provider.mobile.auth.logout", description = "Time taken for provider logout")
    public ResponseEntity<Void> logout() {
        log.info("Provider logout");
        
        providerMobileService.logout();
        
        log.info("Provider logout successful");
        return ResponseEntity.ok().build();
    }
}
