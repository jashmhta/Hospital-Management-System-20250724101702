package com.hospital.hms.appointmentscheduling.service.impl;

import com.hospital.hms.appointmentscheduling.dto.AppointmentCreateRequestDto;
import com.hospital.hms.appointmentscheduling.dto.AppointmentResponseDto;
import com.hospital.hms.appointmentscheduling.entity.Appointment;
import com.hospital.hms.appointmentscheduling.entity.AppointmentStatus;
import com.hospital.hms.appointmentscheduling.exception.AppointmentNotFoundException;
import com.hospital.hms.appointmentscheduling.mapper.AppointmentMapper;
import com.hospital.hms.appointmentscheduling.repository.AppointmentRepository;
import com.hospital.hms.appointmentscheduling.service.AppointmentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
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
import java.util.concurrent.ThreadLocalRandom;

/**
 * Implementation of AppointmentService
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Service
@Transactional
public class AppointmentServiceImpl implements AppointmentService {

    private static final Logger logger = LoggerFactory.getLogger(AppointmentServiceImpl.class);
    
    private final AppointmentRepository appointmentRepository;
    private final AppointmentMapper appointmentMapper;

    @Autowired
    public AppointmentServiceImpl(AppointmentRepository appointmentRepository, AppointmentMapper appointmentMapper) {
        this.appointmentRepository = appointmentRepository;
        this.appointmentMapper = appointmentMapper;
    }

    @Override
    public AppointmentResponseDto createAppointment(AppointmentCreateRequestDto createRequest) {
        logger.info("Creating new appointment for patient: {} with provider: {}", 
                   createRequest.getPatientName(), createRequest.getProviderName());
        
        Appointment appointment = appointmentMapper.toEntity(createRequest);
        appointment.setAppointmentNumber(generateAppointmentNumber());
        appointment.setEndDateTime(createRequest.getAppointmentDateTime().plusMinutes(createRequest.getDurationMinutes()));
        appointment.setCreatedBy(getCurrentUser());
        appointment.setLastModifiedBy(getCurrentUser());
        
        Appointment savedAppointment = appointmentRepository.save(appointment);
        
        logger.info("Appointment created successfully with ID: {} and number: {}", 
                   savedAppointment.getId(), savedAppointment.getAppointmentNumber());
        
        return appointmentMapper.toResponseDto(savedAppointment);
    }

    @Override
    @CacheEvict(value = "appointments", key = "#appointmentId")
    public AppointmentResponseDto updateAppointment(UUID appointmentId, AppointmentCreateRequestDto updateRequest) {
        logger.info("Updating appointment: {}", appointmentId);
        
        Appointment existingAppointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new AppointmentNotFoundException(appointmentId));
        
        appointmentMapper.updateEntityFromDto(updateRequest, existingAppointment);
        existingAppointment.setLastModifiedBy(getCurrentUser());
        
        if (updateRequest.getAppointmentDateTime() != null && updateRequest.getDurationMinutes() != null) {
            existingAppointment.setEndDateTime(updateRequest.getAppointmentDateTime().plusMinutes(updateRequest.getDurationMinutes()));
        }
        
        Appointment updatedAppointment = appointmentRepository.save(existingAppointment);
        
        return appointmentMapper.toResponseDto(updatedAppointment);
    }

    @Override
    @Cacheable(value = "appointments", key = "#appointmentId")
    @Transactional(readOnly = true)
    public AppointmentResponseDto getAppointmentById(UUID appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new AppointmentNotFoundException(appointmentId));
        
        return appointmentMapper.toResponseDto(appointment);
    }

    @Override
    @Cacheable(value = "appointments", key = "#appointmentNumber")
    @Transactional(readOnly = true)
    public AppointmentResponseDto getAppointmentByNumber(String appointmentNumber) {
        Appointment appointment = appointmentRepository.findByAppointmentNumber(appointmentNumber)
                .orElseThrow(() -> new AppointmentNotFoundException("appointment number", appointmentNumber));
        
        return appointmentMapper.toResponseDto(appointment);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AppointmentResponseDto> searchAppointments(String searchTerm, Pageable pageable) {
        Page<Appointment> appointments = appointmentRepository.fullTextSearch(searchTerm, pageable);
        return appointments.map(appointmentMapper::toResponseDto);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AppointmentResponseDto> getPatientAppointments(UUID patientId) {
        List<Appointment> appointments = appointmentRepository.findByPatientId(patientId);
        return appointmentMapper.toResponseDtoList(appointments);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AppointmentResponseDto> getProviderSchedule(UUID providerId, LocalDateTime startDate, LocalDateTime endDate) {
        List<Appointment> appointments = appointmentRepository.findProviderSchedule(providerId, startDate, endDate);
        return appointmentMapper.toResponseDtoList(appointments);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AppointmentResponseDto> getAppointmentsByStatus(AppointmentStatus status) {
        List<Appointment> appointments = appointmentRepository.findByStatus(status);
        return appointmentMapper.toResponseDtoList(appointments);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AppointmentResponseDto> getAppointmentsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        List<Appointment> appointments = appointmentRepository.findByDateTimeRange(startDate, endDate);
        return appointmentMapper.toResponseDtoList(appointments);
    }

    @Override
    @CacheEvict(value = "appointments", key = "#appointmentId")
    public AppointmentResponseDto updateAppointmentStatus(UUID appointmentId, AppointmentStatus newStatus) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new AppointmentNotFoundException(appointmentId));
        
        if (!appointment.getStatus().canTransitionTo(newStatus)) {
            throw new IllegalStateException(String.format("Cannot transition from %s to %s", appointment.getStatus(), newStatus));
        }
        
        appointment.setStatus(newStatus);
        appointment.setLastModifiedBy(getCurrentUser());
        
        Appointment updatedAppointment = appointmentRepository.save(appointment);
        
        return appointmentMapper.toResponseDto(updatedAppointment);
    }

    @Override
    public AppointmentResponseDto checkInAppointment(UUID appointmentId) {
        logger.info("Checking in appointment: {}", appointmentId);
        
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new AppointmentNotFoundException(appointmentId));
        
        appointment.setStatus(AppointmentStatus.CHECKED_IN);
        appointment.setCheckinTime(LocalDateTime.now());
        appointment.setLastModifiedBy(getCurrentUser());
        
        Appointment updatedAppointment = appointmentRepository.save(appointment);
        
        return appointmentMapper.toResponseDto(updatedAppointment);
    }

    @Override
    public AppointmentResponseDto completeAppointment(UUID appointmentId) {
        logger.info("Completing appointment: {}", appointmentId);
        
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new AppointmentNotFoundException(appointmentId));
        
        appointment.setStatus(AppointmentStatus.COMPLETED);
        appointment.setCompletionTime(LocalDateTime.now());
        appointment.setLastModifiedBy(getCurrentUser());
        
        Appointment updatedAppointment = appointmentRepository.save(appointment);
        
        return appointmentMapper.toResponseDto(updatedAppointment);
    }

    @Override
    public AppointmentResponseDto cancelAppointment(UUID appointmentId, String reason) {
        logger.info("Cancelling appointment: {} with reason: {}", appointmentId, reason);
        
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new AppointmentNotFoundException(appointmentId));
        
        appointment.setStatus(AppointmentStatus.CANCELLED);
        appointment.setCancellationReason(reason);
        appointment.setLastModifiedBy(getCurrentUser());
        
        Appointment updatedAppointment = appointmentRepository.save(appointment);
        
        return appointmentMapper.toResponseDto(updatedAppointment);
    }

    @Override
    public AppointmentResponseDto rescheduleAppointment(UUID appointmentId, LocalDateTime newDateTime) {
        logger.info("Rescheduling appointment: {} to {}", appointmentId, newDateTime);
        
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new AppointmentNotFoundException(appointmentId));
        
        appointment.setAppointmentDateTime(newDateTime);
        appointment.setEndDateTime(newDateTime.plusMinutes(appointment.getDurationMinutes()));
        appointment.setStatus(AppointmentStatus.RESCHEDULED);
        appointment.setLastModifiedBy(getCurrentUser());
        
        Appointment updatedAppointment = appointmentRepository.save(appointment);
        
        return appointmentMapper.toResponseDto(updatedAppointment);
    }

    @Override
    public String generateAppointmentNumber() {
        String prefix = "APT";
        String dateComponent = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        
        String appointmentNumber;
        int attempts = 0;
        int maxAttempts = 10;
        
        do {
            int randomNumber = ThreadLocalRandom.current().nextInt(1000, 9999);
            appointmentNumber = prefix + dateComponent + randomNumber;
            attempts++;
            
            if (attempts >= maxAttempts) {
                throw new RuntimeException("Failed to generate unique appointment number after " + maxAttempts + " attempts");
            }
        } while (appointmentRepository.existsByAppointmentNumber(appointmentNumber));
        
        return appointmentNumber;
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isProviderAvailable(UUID providerId, LocalDateTime startTime, LocalDateTime endTime) {
        long conflictingAppointments = appointmentRepository.countProviderAppointments(providerId, startTime, endTime);
        return conflictingAppointments == 0;
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getAppointmentStatistics() {
        LocalDateTime startOfMonth = LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
        Object[] stats = appointmentRepository.getAppointmentStatistics(startOfMonth);
        
        Map<String, Object> statistics = new HashMap<>();
        if (stats != null && stats.length >= 4) {
            statistics.put("totalAppointments", stats[0]);
            statistics.put("scheduledCount", stats[1]);
            statistics.put("completedCount", stats[2]);
            statistics.put("cancelledCount", stats[3]);
        }
        
        return statistics;
    }

    @Override
    @Transactional(readOnly = true)
    public List<AppointmentResponseDto> getOverdueAppointments() {
        List<Appointment> appointments = appointmentRepository.findOverdueAppointments(LocalDateTime.now());
        return appointmentMapper.toResponseDtoList(appointments);
    }

    private String getCurrentUser() {
        return "system"; // In production, get from security context
    }
}
