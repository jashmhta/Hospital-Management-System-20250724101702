package com.hms.analytics;

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
 * Analytics Data Ingestion Service Application
 * 
 * Enterprise ETL service for real-time healthcare data streaming, transformation,
 * and analytics pipeline with comprehensive HIPAA-compliant data processing.
 */
@SpringBootApplication
@EnableEurekaClient
@EnableFeignClients
@EnableAsync
@EnableScheduling
@EnableJpaAuditing
@EnableCaching
@EnableKafka
public class AnalyticsDataIngestionApplication {

    public static void main(String[] args) {
        SpringApplication.run(AnalyticsDataIngestionApplication.class, args);
    }

    /**
     * CORS Configuration for Analytics Data Access
     */
    @Configuration
    public static class WebConfig implements WebMvcConfigurer {
        
        @Override
        public void addCorsMappings(CorsRegistry registry) {
            registry.addMapping("/api/**")
                .allowedOrigins(
                    "https://analytics.hospital.com",
                    "https://dashboard.hospital.com", 
                    "https://admin.hospital.com"
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
        }
    }
}
