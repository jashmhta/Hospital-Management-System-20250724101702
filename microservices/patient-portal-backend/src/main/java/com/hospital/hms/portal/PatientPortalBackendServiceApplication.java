package com.hospital.hms.portal;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * Patient Portal Backend Service Application
 * 
 * Mobile patient engagement platform backend providing:
 * - Patient authentication and registration
 * - Medical record access and viewing
 * - Appointment scheduling and management
 * - Prescription management
 * - Lab results and imaging access
 * - Secure messaging with providers
 * - Health tracking and monitoring
 * - Push notifications and alerts
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@SpringBootApplication
@EnableFeignClients
@EnableCaching
@EnableJpaAuditing
@EnableAsync
@EnableScheduling
@EnableKafka
public class PatientPortalBackendServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(PatientPortalBackendServiceApplication.class, args);
    }
}
