package com.hospital.hms.patientmanagement.client;

import com.hospital.hms.patientmanagement.dto.AppointmentDto;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;
import io.github.resilience4j.timelimiter.annotation.TimeLimiter;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

/**
 * Feign Client for Appointment Service Integration
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@FeignClient(
    name = "appointment-service",
    url = "${microservices.appointment-service.url:http://appointment-service:8081}",
    fallback = AppointmentServiceClient.AppointmentServiceClientFallback.class
)
public interface AppointmentServiceClient {

    @GetMapping("/api/v1/appointments/patient/{patientId}")
    @CircuitBreaker(name = "appointment-service", fallbackMethod = "getPatientAppointmentsFallback")
    @Retry(name = "appointment-service")
    @TimeLimiter(name = "appointment-service")
    CompletableFuture<List<AppointmentDto>> getPatientAppointments(@PathVariable UUID patientId);

    @GetMapping("/api/v1/appointments/patient/{patientId}/upcoming")
    @CircuitBreaker(name = "appointment-service", fallbackMethod = "getUpcomingAppointmentsFallback")
    @Retry(name = "appointment-service")
    List<AppointmentDto> getUpcomingAppointments(@PathVariable UUID patientId);

    @GetMapping("/api/v1/appointments/check-conflicts")
    @CircuitBreaker(name = "appointment-service", fallbackMethod = "checkConflictsFallback")
    boolean checkAppointmentConflicts(@RequestParam UUID patientId, @RequestParam String dateTime);

    // Fallback methods
    default CompletableFuture<List<AppointmentDto>> getPatientAppointmentsFallback(UUID patientId, Exception ex) {
        return CompletableFuture.completedFuture(Collections.emptyList());
    }

    default List<AppointmentDto> getUpcomingAppointmentsFallback(UUID patientId, Exception ex) {
        return Collections.emptyList();
    }

    default boolean checkConflictsFallback(UUID patientId, String dateTime, Exception ex) {
        return false; // Assume no conflicts when service is down
    }

    /**
     * Fallback implementation for circuit breaker
     */
    class AppointmentServiceClientFallback implements AppointmentServiceClient {
        
        @Override
        public CompletableFuture<List<AppointmentDto>> getPatientAppointments(UUID patientId) {
            return CompletableFuture.completedFuture(Collections.emptyList());
        }

        @Override
        public List<AppointmentDto> getUpcomingAppointments(UUID patientId) {
            return Collections.emptyList();
        }

        @Override
        public boolean checkAppointmentConflicts(UUID patientId, String dateTime) {
            return false;
        }
    }
}
