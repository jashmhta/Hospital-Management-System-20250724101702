package com.hospital.hms.appointmentscheduling;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * Appointment Scheduling Service Application
 * 
 * Enterprise-grade microservice for managing healthcare appointments.
 * Provides comprehensive appointment scheduling, management, and coordination.
 * 
 * Features:
 * - Appointment scheduling and management
 * - Provider availability management
 * - Patient appointment history
 * - Automated reminders and notifications
 * - Calendar integration
 * - Resource scheduling (rooms, equipment)
 * - Waitlist management
 * - Appointment conflicts resolution
 * - Real-time slot availability
 * - Multi-location support
 * - FHIR R4 Appointment resource compliance
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@SpringBootApplication
@EnableEurekaClient
@EnableFeignClients
@EnableJpaAuditing
@EnableAsync
@EnableScheduling
public class AppointmentSchedulingServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(AppointmentSchedulingServiceApplication.class, args);
    }
}
