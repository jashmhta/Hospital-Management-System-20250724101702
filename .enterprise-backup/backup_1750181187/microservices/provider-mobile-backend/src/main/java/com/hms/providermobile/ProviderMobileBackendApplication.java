package com.hms.providermobile;

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
 * HMS Provider Mobile Backend Application
 * Enterprise-grade mobile API backend for healthcare providers
 * 
 * Features:
 * - Mobile-optimized REST APIs for healthcare providers
 * - Real-time patient data synchronization
 * - Clinical workflow management for mobile devices
 * - Offline capability support with data synchronization
 * - Push notifications for critical alerts
 * - HIPAA-compliant mobile data access
 * - Provider authentication and authorization
 * - Performance optimization for mobile networks
 * 
 * Target Users:
 * - Doctors and physicians
 * - Nurses and clinical staff
 * - Specialists and consultants
 * - Emergency responders
 * - Healthcare administrators
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
public class ProviderMobileBackendApplication {

    public static void main(String[] args) {
        System.setProperty("spring.config.name", "provider-mobile-backend");
        SpringApplication.run(ProviderMobileBackendApplication.class, args);
    }

    /**
     * CORS configuration for mobile applications
     * Allows secure cross-origin requests from mobile apps
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
            "X-Provider-ID", "X-Device-ID", "X-App-Version", "X-Session-Token"
        ));
        configuration.setExposedHeaders(Arrays.asList(
            "Origin", "Content-Type", "Accept", "Authorization",
            "Access-Control-Allow-Origin", "Access-Control-Allow-Credentials",
            "X-Provider-ID", "X-Sync-Token", "X-Cache-Version"
        ));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        
        UrlBasedCorsConfigurationSource urlBasedCorsConfigurationSource = new UrlBasedCorsConfigurationSource();
        urlBasedCorsConfigurationSource.registerCorsConfiguration("/**", configuration);
        
        return new CorsFilter(urlBasedCorsConfigurationSource);
    }
}
