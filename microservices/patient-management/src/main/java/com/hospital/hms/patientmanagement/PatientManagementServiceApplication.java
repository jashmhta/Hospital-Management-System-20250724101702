package com.hospital.hms.patientmanagement;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.transaction.annotation.EnableTransactionManagement;

/**
 * Patient Management Service Application
 * 
 * This microservice is responsible for:
 * - Patient registration and demographics management
 * - Patient identity and contact information
 * - Patient medical record numbers (MRN) generation
 * - FHIR Patient resource management
 * - Patient search and lookup functionality
 * - Integration with external systems for patient data
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@SpringBootApplication
@EnableEurekaClient
@EnableJpaAuditing
@EnableCaching
@EnableScheduling
@EnableTransactionManagement
public class PatientManagementServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(PatientManagementServiceApplication.class, args);
    }
}
