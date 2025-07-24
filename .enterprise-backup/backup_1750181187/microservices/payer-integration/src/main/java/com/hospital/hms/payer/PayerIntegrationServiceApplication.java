package com.hospital.hms.payer;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * Payer Integration Service Application
 * 
 * Insurance processing and claims management providing:
 * - Insurance eligibility verification
 * - Claims submission and processing
 * - Prior authorization management
 * - Claims status tracking
 * - Payment reconciliation
 * - EDI transaction processing
 * - Payer contract management
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
public class PayerIntegrationServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(PayerIntegrationServiceApplication.class, args);
    }
}
