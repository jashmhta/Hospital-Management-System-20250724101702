package com.hms.patientportal;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.Bean;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.cache.annotation.EnableCaching;

import java.util.Arrays;
import java.util.Collections;

/**
 * HMS Patient Portal Backend Application
 * 
 * Comprehensive patient self-service portal backend providing:
 * - Patient authentication and profile management
 * - Appointment scheduling and management
 * - Medical records and test results access
 * - Billing and insurance information
 * - Secure patient-provider communication
 * - Prescription management and refill requests
 * - Health tracking and wellness features
 * - Family member account management
 * - HIPAA-compliant patient data access
 * 
 * Target Users:
 * - Patients and their families
 * - Caregivers and guardians
 * - Patient advocates
 * 
 * @author HMS Development Team
 * @version 3.0.0
 * @since 2024-01-15
 */
@SpringBootApplication
@EnableEurekaClient
@EnableFeignClients
@EnableAsync
@EnableScheduling
@EnableJpaAuditing
@EnableCaching
public class PatientPortalBackendApplication {

    public static void main(String[] args) {
        System.setProperty("spring.config.name", "patient-portal-backend");
        SpringApplication.run(PatientPortalBackendApplication.class, args);
    }

    /**
     * CORS configuration for patient portal web applications
     * Allows secure access from patient portal websites and mobile apps
     */
    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowCredentials(true);
        configuration.setAllowedOriginPatterns(Collections.singletonList("*"));
        configuration.setAllowedHeaders(Arrays.asList(
            "Origin", "Access-Control-Allow-Origin", "Content-Type", 
            "Accept", "Authorization", "Origin, Accept", "X-Requested-With",
            "Access-Control-Request-Method", "Access-Control-Request-Headers",
            "X-Patient-ID", "X-Portal-Session", "X-App-Version", "X-Device-Type"
        ));
        configuration.setExposedHeaders(Arrays.asList(
            "Origin", "Content-Type", "Accept", "Authorization",
            "Access-Control-Allow-Origin", "Access-Control-Allow-Credentials",
            "X-Patient-ID", "X-Portal-Session", "X-Message-Count"
        ));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        
        UrlBasedCorsConfigurationSource urlBasedCorsConfigurationSource = new UrlBasedCorsConfigurationSource();
        urlBasedCorsConfigurationSource.registerCorsConfiguration("/**", configuration);
        
        return new CorsFilter(urlBasedCorsConfigurationSource);
    }
}
