package com.hms.procedure;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Procedure Management Service Application
 * 
 * Enterprise clinical procedure workflow management with scheduling,
 * documentation, resource allocation, and comprehensive compliance tracking.
 */
@SpringBootApplication
@EnableEurekaClient
@EnableFeignClients
@EnableAsync
@EnableScheduling
@EnableJpaAuditing
@EnableCaching
@EnableKafka
public class ProcedureManagementApplication {

    public static void main(String[] args) {
        SpringApplication.run(ProcedureManagementApplication.class, args);
    }

    /**
     * CORS Configuration for Procedure Management APIs
     */
    @Configuration
    public static class WebConfig implements WebMvcConfigurer {
        
        @Override
        public void addCorsMappings(CorsRegistry registry) {
            registry.addMapping("/api/**")
                .allowedOrigins(
                    "https://procedures.hospital.com",
                    "https://clinical.hospital.com", 
                    "https://admin.hospital.com"
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
        }
    }
}
