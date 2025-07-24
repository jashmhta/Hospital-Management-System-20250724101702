package com.hospital.hms.procedure;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * Procedure Management Service Application
 * 
 * Surgical workflow coordination and OR management providing:
 * - Surgical procedure scheduling
 * - Operating room management
 * - Surgical team coordination
 * - Equipment and instrument tracking
 * - Procedure documentation
 * - Surgical workflow optimization
 * - Post-operative care coordination
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
public class ProcedureManagementServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(ProcedureManagementServiceApplication.class, args);
    }
}
