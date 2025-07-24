package com.hospital.hms.provider;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * Provider Mobile Backend Service Application
 * 
 * Healthcare provider mobile workflows backend providing:
 * - Provider authentication and profile management
 * - Patient chart access and documentation
 * - Clinical decision support tools
 * - Mobile order entry and prescribing
 * - Real-time patient monitoring
 * - Secure communication and messaging
 * - Clinical workflow optimization
 * - Mobile alerts and notifications
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
public class ProviderMobileBackendServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(ProviderMobileBackendServiceApplication.class, args);
    }
}
