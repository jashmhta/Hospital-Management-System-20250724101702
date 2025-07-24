package com.hospital.hms.hieintegration;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.EnableAsync;

/**
 * Health Information Exchange Integration Service Application
 * 
 * Enterprise HIE integration service providing:
 * - External health network connectivity
 * - FHIR R4 compliant data exchange
 * - HL7 message processing
 * - Real-time and batch data synchronization
 * - Care quality and continuity support
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@SpringBootApplication
@EnableDiscoveryClient
@EnableFeignClients
@EnableCaching
@EnableJpaAuditing
@EnableScheduling
@EnableAsync
public class HieIntegrationServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(HieIntegrationServiceApplication.class, args);
    }
}
