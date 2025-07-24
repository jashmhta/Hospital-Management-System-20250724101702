package com.hms.configserver;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.config.server.EnableConfigServer;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.context.annotation.Bean;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;

/**
 * HMS Config Server Application
 * Enterprise-grade Spring Cloud Config Server implementation
 * 
 * Features:
 * - Git-based configuration management
 * - Environment-specific property profiles
 * - Encryption/Decryption of sensitive properties
 * - Service discovery integration
 * - Health monitoring and metrics
 * - HIPAA-compliant configuration management
 * 
 * @author HMS Development Team
 * @version 3.0.0
 * @since 2024-01-15
 */
@SpringBootApplication
@EnableConfigServer
@EnableEurekaClient
public class ConfigServerApplication {

    public static void main(String[] args) {
        System.setProperty("spring.config.name", "config-server");
        SpringApplication.run(ConfigServerApplication.class, args);
    }

    /**
     * Security configuration for Config Server
     * Enables basic authentication for configuration access
     * while maintaining security for healthcare data
     */
    @EnableWebSecurity
    public static class SecurityConfig {

        @Bean
        public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
            http.csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(authz -> authz
                    .requestMatchers("/actuator/**", "/health", "/info").permitAll()
                    .requestMatchers("/encrypt/**", "/decrypt/**").hasRole("ADMIN")
                    .anyRequest().authenticated()
                )
                .httpBasic(httpBasic -> {});
            
            return http.build();
        }
    }
}
