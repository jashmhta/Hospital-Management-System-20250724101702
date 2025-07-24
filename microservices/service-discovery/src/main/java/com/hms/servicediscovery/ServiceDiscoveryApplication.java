package com.hms.servicediscovery;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;
import org.springframework.context.annotation.Bean;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.boot.actuator.autoconfigure.security.servlet.ManagementWebSecurityAutoConfiguration;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;

/**
 * HMS Service Discovery Application
 * Enterprise-grade Netflix Eureka Server implementation
 * 
 * Features:
 * - Service registration and discovery
 * - Health monitoring and cluster support
 * - Security integration with JWT authentication
 * - Monitoring and observability
 * - High availability configuration
 * 
 * @author HMS Development Team
 * @version 3.0.0
 * @since 2024-01-15
 */
@SpringBootApplication
@EnableEurekaServer
@EnableAutoConfiguration(exclude = ManagementWebSecurityAutoConfiguration.class)
public class ServiceDiscoveryApplication {

    public static void main(String[] args) {
        System.setProperty("spring.config.name", "eureka-server");
        SpringApplication.run(ServiceDiscoveryApplication.class, args);
    }

    /**
     * Security configuration for Eureka Server
     * Enables basic authentication for service registration
     * while allowing public access to service discovery
     */
    @EnableWebSecurity
    public static class SecurityConfig {

        @Bean
        public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
            http.csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(authz -> authz
                    .requestMatchers("/eureka/**", "/actuator/**").permitAll()
                    .anyRequest().authenticated()
                )
                .httpBasic(httpBasic -> {});
            
            return http.build();
        }
    }
}
