package com.hospital.hms.registry;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * State Registry Integration Service Application
 * 
 * Public health reporting and state registry integration providing:
 * - Birth registration and certification
 * - Death registration and certification  
 * - Immunization registry reporting
 * - Disease surveillance and reporting
 * - Cancer registry submissions
 * - Vital statistics reporting
 * - Public health compliance monitoring
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
public class StateRegistryIntegrationServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(StateRegistryIntegrationServiceApplication.class, args);
    }
}
