package com.hospital.hms.cds;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * Clinical Decision Support Service Application
 * 
 * AI-powered clinical decision support system providing:
 * - Real-time clinical alerts and warnings
 * - Evidence-based treatment recommendations
 * - Drug interaction checking
 * - Clinical guideline compliance monitoring
 * - Risk assessment and scoring
 * - Quality measure tracking
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
public class ClinicalDecisionSupportServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(ClinicalDecisionSupportServiceApplication.class, args);
    }
}