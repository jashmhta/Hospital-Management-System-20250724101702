package com.hospital.hms.pacs;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * PACS Integration Service Application
 * 
 * Picture Archiving and Communication System integration providing:
 * - DICOM image storage and retrieval
 * - Medical imaging workflow management
 * - Radiology information system integration
 * - Image viewing and processing
 * - Healthcare imaging standards compliance
 * - Multi-modal imaging support
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
public class PacsIntegrationServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(PacsIntegrationServiceApplication.class, args);
    }
}