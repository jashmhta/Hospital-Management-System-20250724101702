package com.hospital.hms.appointmentscheduling.repository;

import com.hospital.hms.appointmentscheduling.entity.Appointment;
import com.hospital.hms.appointmentscheduling.entity.AppointmentStatus;
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
 * Appointment Repository Interface
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, UUID>, JpaSpecificationExecutor<Appointment> {

    @Cacheable(value = "appointments", key = "#appointmentNumber")
    Optional<Appointment> findByAppointmentNumber(String appointmentNumber);

    Optional<Appointment> findByFhirId(String fhirId);

    List<Appointment> findByPatientId(UUID patientId);

    List<Appointment> findByProviderId(UUID providerId);

    List<Appointment> findByStatus(AppointmentStatus status);

    @Query("SELECT a FROM Appointment a WHERE a.appointmentDateTime BETWEEN :startDate AND :endDate")
    List<Appointment> findByDateTimeRange(@Param("startDate") LocalDateTime startDate, 
                                         @Param("endDate") LocalDateTime endDate);

    @Query("SELECT a FROM Appointment a WHERE a.patientId = :patientId AND a.appointmentDateTime >= :fromDate ORDER BY a.appointmentDateTime")
    List<Appointment> findUpcomingAppointmentsByPatient(@Param("patientId") UUID patientId, 
                                                        @Param("fromDate") LocalDateTime fromDate);

    @Query("SELECT a FROM Appointment a WHERE a.providerId = :providerId AND a.appointmentDateTime BETWEEN :startDate AND :endDate ORDER BY a.appointmentDateTime")
    List<Appointment> findProviderSchedule(@Param("providerId") UUID providerId,
                                          @Param("startDate") LocalDateTime startDate,
                                          @Param("endDate") LocalDateTime endDate);

    @Query("SELECT a FROM Appointment a WHERE a.status = :status AND a.appointmentDateTime BETWEEN :startTime AND :endTime")
    List<Appointment> findByStatusAndDateTimeRange(@Param("status") AppointmentStatus status,
                                                  @Param("startTime") LocalDateTime startTime,
                                                  @Param("endTime") LocalDateTime endTime);

    @Query("SELECT COUNT(a) FROM Appointment a WHERE a.providerId = :providerId AND a.appointmentDateTime BETWEEN :startTime AND :endTime AND a.status != 'CANCELLED'")
    long countProviderAppointments(@Param("providerId") UUID providerId,
                                  @Param("startTime") LocalDateTime startTime,
                                  @Param("endTime") LocalDateTime endTime);

    @Query("SELECT a FROM Appointment a WHERE a.appointmentDateTime < :dateTime AND a.status = 'SCHEDULED'")
    List<Appointment> findOverdueAppointments(@Param("dateTime") LocalDateTime dateTime);

    boolean existsByAppointmentNumber(String appointmentNumber);

    @Query("SELECT a FROM Appointment a WHERE LOWER(a.patientName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR LOWER(a.providerName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR LOWER(a.appointmentNumber) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    Page<Appointment> fullTextSearch(@Param("searchTerm") String searchTerm, Pageable pageable);

    @Query("SELECT COUNT(a) as totalAppointments, " +
           "COUNT(CASE WHEN a.status = 'SCHEDULED' THEN 1 END) as scheduledCount, " +
           "COUNT(CASE WHEN a.status = 'COMPLETED' THEN 1 END) as completedCount, " +
           "COUNT(CASE WHEN a.status = 'CANCELLED' THEN 1 END) as cancelledCount " +
           "FROM Appointment a WHERE a.appointmentDateTime >= :startDate")
    Object[] getAppointmentStatistics(@Param("startDate") LocalDateTime startDate);
}
