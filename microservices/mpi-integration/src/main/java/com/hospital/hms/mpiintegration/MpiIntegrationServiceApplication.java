package com.hospital.hms.mpiintegration;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/**
 * Master Patient Index Integration Service Application
 * 
 * Enterprise patient identity management service providing:
 * - Patient identity resolution and deduplication
 * - Cross-facility patient matching
 * - FHIR R4 compliance for patient identity
 * - Integration with external patient registries
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@SpringBootApplication
@EnableDiscoveryClient
@EnableFeignClients
@EnableCaching
@EnableJpaAuditing
public class MpiIntegrationServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(MpiIntegrationServiceApplication.class, args);
    }
}
