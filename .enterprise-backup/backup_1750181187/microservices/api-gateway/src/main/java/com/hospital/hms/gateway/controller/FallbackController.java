package com.hospital.hms.gateway.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Fallback Controller for Circuit Breaker Patterns
 * 
 * Provides fallback responses when downstream services are unavailable.
 * Implements graceful degradation for better user experience.
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@RestController
@RequestMapping("/fallback")
public class FallbackController {

    /**
     * Patient Management Service Fallback
     */
    @GetMapping("/patient-management")
    public Mono<ResponseEntity<Map<String, Object>>> patientManagementFallback() {
        Map<String, Object> response = createFallbackResponse(
            "Patient Management Service",
            "The patient management service is temporarily unavailable. Please try again later.",
            "PATIENT_SERVICE_UNAVAILABLE"
        );
        
        return Mono.just(ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(response));
    }

    @PostMapping("/patient-management")
    public Mono<ResponseEntity<Map<String, Object>>> patientManagementPostFallback() {
        Map<String, Object> response = createFallbackResponse(
            "Patient Management Service",
            "Patient data operations are temporarily unavailable. Your request has been queued.",
            "PATIENT_SERVICE_UNAVAILABLE"
        );
        
        return Mono.just(ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(response));
    }

    /**
     * Appointment Scheduling Service Fallback
     */
    @GetMapping("/appointment-scheduling")
    public Mono<ResponseEntity<Map<String, Object>>> appointmentSchedulingFallback() {
        Map<String, Object> response = createFallbackResponse(
            "Appointment Scheduling Service",
            "The appointment scheduling service is temporarily unavailable. Please try again later.",
            "APPOINTMENT_SERVICE_UNAVAILABLE"
        );
        
        return Mono.just(ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(response));
    }

    @PostMapping("/appointment-scheduling")
    public Mono<ResponseEntity<Map<String, Object>>> appointmentSchedulingPostFallback() {
        Map<String, Object> response = createFallbackResponse(
            "Appointment Scheduling Service",
            "Appointment booking is temporarily unavailable. Please call our booking line.",
            "APPOINTMENT_SERVICE_UNAVAILABLE"
        );
        
        return Mono.just(ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(response));
    }

    /**
     * Clinical Notes Service Fallback
     */
    @GetMapping("/clinical-notes")
    public Mono<ResponseEntity<Map<String, Object>>> clinicalNotesFallback() {
        Map<String, Object> response = createFallbackResponse(
            "Clinical Notes Service",
            "The clinical notes service is temporarily unavailable. Medical records access is limited.",
            "CLINICAL_NOTES_SERVICE_UNAVAILABLE"
        );
        
        return Mono.just(ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(response));
    }

    @PostMapping("/clinical-notes")
    public Mono<ResponseEntity<Map<String, Object>>> clinicalNotesPostFallback() {
        Map<String, Object> response = createFallbackResponse(
            "Clinical Notes Service",
            "Clinical documentation is temporarily unavailable. Please use offline documentation.",
            "CLINICAL_NOTES_SERVICE_UNAVAILABLE"
        );
        
        return Mono.just(ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(response));
    }

    /**
     * Billing Service Fallback
     */
    @GetMapping("/billing")
    public Mono<ResponseEntity<Map<String, Object>>> billingFallback() {
        Map<String, Object> response = createFallbackResponse(
            "Billing Service",
            "The billing service is temporarily unavailable. Financial operations are limited.",
            "BILLING_SERVICE_UNAVAILABLE"
        );
        
        return Mono.just(ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(response));
    }

    @PostMapping("/billing")
    public Mono<ResponseEntity<Map<String, Object>>> billingPostFallback() {
        Map<String, Object> response = createFallbackResponse(
            "Billing Service",
            "Billing operations are temporarily unavailable. Charges will be processed when service resumes.",
            "BILLING_SERVICE_UNAVAILABLE"
        );
        
        return Mono.just(ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(response));
    }

    /**
     * Authentication Service Fallback
     */
    @GetMapping("/auth")
    public Mono<ResponseEntity<Map<String, Object>>> authFallback() {
        Map<String, Object> response = createFallbackResponse(
            "Authentication Service",
            "The authentication service is temporarily unavailable. Please try logging in again.",
            "AUTH_SERVICE_UNAVAILABLE"
        );
        
        return Mono.just(ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(response));
    }

    @PostMapping("/auth")
    public Mono<ResponseEntity<Map<String, Object>>> authPostFallback() {
        Map<String, Object> response = createFallbackResponse(
            "Authentication Service",
            "Login is temporarily unavailable. Please try again in a few minutes.",
            "AUTH_SERVICE_UNAVAILABLE"
        );
        
        return Mono.just(ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(response));
    }

    /**
     * FHIR Service Fallback
     */
    @GetMapping("/fhir")
    public Mono<ResponseEntity<Map<String, Object>>> fhirFallback() {
        Map<String, Object> response = createFallbackResponse(
            "FHIR Service",
            "The FHIR API is temporarily unavailable. Healthcare interoperability features are limited.",
            "FHIR_SERVICE_UNAVAILABLE"
        );
        
        return Mono.just(ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(response));
    }

    /**
     * General Service Fallback
     */
    @GetMapping("/general")
    public Mono<ResponseEntity<Map<String, Object>>> generalFallback() {
        Map<String, Object> response = createFallbackResponse(
            "Hospital Management System",
            "Some services are temporarily unavailable. Essential operations may continue with limited functionality.",
            "GENERAL_SERVICE_UNAVAILABLE"
        );
        
        return Mono.just(ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(response));
    }

    /**
     * Health Check Fallback
     */
    @GetMapping("/health")
    public Mono<ResponseEntity<Map<String, Object>>> healthFallback() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "DEGRADED");
        response.put("timestamp", LocalDateTime.now().toString());
        response.put("message", "Some services are experiencing issues");
        response.put("availableServices", "Limited functionality available");
        
        return Mono.just(ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(response));
    }

    /**
     * Create standardized fallback response
     */
    private Map<String, Object> createFallbackResponse(String serviceName, String message, String errorCode) {
        Map<String, Object> response = new HashMap<>();
        response.put("error", true);
        response.put("service", serviceName);
        response.put("message", message);
        response.put("errorCode", errorCode);
        response.put("timestamp", LocalDateTime.now().toString());
        response.put("fallback", true);
        response.put("retryAfter", "Please retry after a few minutes");
        response.put("supportContact", "For urgent matters, please contact support at +1-800-HMS-HELP");
        
        // Add troubleshooting tips
        Map<String, String> troubleshooting = new HashMap<>();
        troubleshooting.put("tip1", "Refresh the page and try again");
        troubleshooting.put("tip2", "Check your internet connection");
        troubleshooting.put("tip3", "Clear browser cache if the issue persists");
        response.put("troubleshooting", troubleshooting);
        
        return response;
    }
}
