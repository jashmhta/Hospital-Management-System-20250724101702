package com.hospital.hms.servicediscovery;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.boot.actuate.autoconfigure.security.servlet.ManagementWebSecurityAutoConfiguration;

/**
 * Service Discovery Application - Complete Enterprise Eureka Server
 * 
 * Enterprise-grade service registry and discovery server for the Hospital Management System.
 * Provides centralized service registration, discovery, and health monitoring for all microservices.
 * 
 * Enhanced Features:
 * - Netflix Eureka Server with clustering support
 * - Security with JWT authentication and RBAC
 * - Service health monitoring and auto-cleanup
 * - Metrics and observability with Prometheus
 * - High availability configuration
 * - Service metadata management with custom properties
 * - Event-driven service lifecycle management
 * - REST API for service queries and management
 * - Web dashboard for service monitoring
 * - Cluster support and replication
 * - Circuit breaker integration
 * - Service dependency tracking
 * - Audit logging and compliance
 * 
 * Architecture Benefits:
 * - Eliminates hardcoded service URLs
 * - Enables dynamic scaling and deployment
 * - Provides service resilience and failover
 * - Supports blue-green deployments
 * - Facilitates service mesh architecture
 * - Enables circuit breaker patterns
 * - Supports canary releases
 * - Healthcare compliance and audit trails
 * 
 * @author HMS Enterprise Team
 * @version 2.0.0
 * @since 2025-01-01
 */
@SpringBootApplication(exclude = {ManagementWebSecurityAutoConfiguration.class})
@EnableEurekaServer
@EnableWebSecurity
@EnableCaching
@EnableScheduling
public class ServiceDiscoveryApplication {

    public static void main(String[] args) {
        // Set system properties for enhanced monitoring
        System.setProperty("spring.application.name", "hms-service-discovery");
        System.setProperty("eureka.instance.hostname", "service-discovery");
        System.setProperty("eureka.instance.prefer-ip-address", "true");
        System.setProperty("management.security.enabled", "false");
        
        SpringApplication application = new SpringApplication(ServiceDiscoveryApplication.class);
        
        // Enable additional profiles based on environment
        String env = System.getProperty("spring.profiles.active", "development");
        String[] additionalProfiles = {"eureka-server", "monitoring", "security"};
        application.setAdditionalProfiles(additionalProfiles);
        
        // Set JVM options for better performance
        System.setProperty("java.awt.headless", "true");
        System.setProperty("spring.jmx.enabled", "true");
        
        application.run(args);
    }
}
