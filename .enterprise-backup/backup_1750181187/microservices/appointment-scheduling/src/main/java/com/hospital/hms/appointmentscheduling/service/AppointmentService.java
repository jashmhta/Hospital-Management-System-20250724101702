package com.hospital.hms.appointmentscheduling.service;

import com.hospital.hms.appointmentscheduling.dto.AppointmentCreateRequestDto;
import com.hospital.hms.appointmentscheduling.dto.AppointmentResponseDto;
import com.hospital.hms.appointmentscheduling.entity.AppointmentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Service interface for Appointment Management operations
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
public interface AppointmentService {

    AppointmentResponseDto createAppointment(AppointmentCreateRequestDto createRequest);

    AppointmentResponseDto updateAppointment(UUID appointmentId, AppointmentCreateRequestDto updateRequest);

    AppointmentResponseDto getAppointmentById(UUID appointmentId);

    AppointmentResponseDto getAppointmentByNumber(String appointmentNumber);

    Page<AppointmentResponseDto> searchAppointments(String searchTerm, Pageable pageable);

    List<AppointmentResponseDto> getPatientAppointments(UUID patientId);

    List<AppointmentResponseDto> getProviderSchedule(UUID providerId, LocalDateTime startDate, LocalDateTime endDate);

    List<AppointmentResponseDto> getAppointmentsByStatus(AppointmentStatus status);

    List<AppointmentResponseDto> getAppointmentsByDateRange(LocalDateTime startDate, LocalDateTime endDate);

    AppointmentResponseDto updateAppointmentStatus(UUID appointmentId, AppointmentStatus newStatus);

    AppointmentResponseDto checkInAppointment(UUID appointmentId);

    AppointmentResponseDto completeAppointment(UUID appointmentId);

    AppointmentResponseDto cancelAppointment(UUID appointmentId, String reason);

    AppointmentResponseDto rescheduleAppointment(UUID appointmentId, LocalDateTime newDateTime);

    String generateAppointmentNumber();

    boolean isProviderAvailable(UUID providerId, LocalDateTime startTime, LocalDateTime endTime);

    Map<String, Object> getAppointmentStatistics();

    List<AppointmentResponseDto> getOverdueAppointments();
}
