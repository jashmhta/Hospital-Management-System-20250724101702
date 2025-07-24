package com.hospital.hms.configserver;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.config.server.EnableConfigServer;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.boot.actuate.autoconfigure.security.servlet.ManagementWebSecurityAutoConfiguration;
import org.springframework.context.annotation.EnableAspectJAutoProxy;

/**
 * Config Server Application - Enterprise Configuration Management
 * 
 * Enterprise-grade centralized configuration management server for the Hospital Management System.
 * Provides externalized configuration for all microservices with version control and environment-specific settings.
 * 
 * Enhanced Features:
 * - Centralized configuration management with Git integration
 * - Environment-specific configurations (dev/test/staging/prod)
 * - Configuration versioning and rollback capabilities
 * - Real-time configuration updates with refresh events
 * - Encrypted configuration properties with symmetric/asymmetric keys
 * - Configuration validation and schema enforcement
 * - Multi-profile support with inheritance
 * - Service-specific configuration isolation
 * - Configuration audit and change tracking
 * - Health checks and monitoring integration
 * - Security with JWT authentication and RBAC
 * - Configuration caching and performance optimization
 * - Backup and restore capabilities
 * - Configuration drift detection
 * - Compliance and regulatory support (HIPAA)
 * 
 * Architecture Benefits:
 * - Eliminates configuration duplication across services
 * - Enables configuration changes without service deployment
 * - Provides configuration consistency across environments
 * - Supports configuration inheritance and overrides
 * - Enables compliance and audit requirements
 * - Facilitates DevOps and CI/CD practices
 * - Supports configuration encryption for sensitive healthcare data
 * - Provides configuration rollback and disaster recovery
 * 
 * Configuration Sources:
 * - Git repositories (primary with branch/tag support)
 * - Local file system (development and testing)
 * - HashiCorp Vault integration (secrets management)
 * - Database configurations (optional persistence)
 * - Environment variables and system properties
 * - Consul integration (service mesh configs)
 * 
 * @author HMS Enterprise Team
 * @version 2.0.0
 * @since 2025-01-01
 */
@SpringBootApplication(exclude = {ManagementWebSecurityAutoConfiguration.class})
@EnableConfigServer
@EnableEurekaClient
@EnableWebSecurity
@EnableCaching
@EnableScheduling
@EnableAspectJAutoProxy
public class ConfigServerApplication {

    public static void main(String[] args) {
        // Set system properties for enhanced configuration
        System.setProperty("spring.application.name", "hms-config-server");
        System.setProperty("config.server.hostname", "config-server");
        System.setProperty("spring.cloud.config.server.git.clone-on-start", "true");
        
        SpringApplication application = new SpringApplication(ConfigServerApplication.class);
        
        // Enable additional profiles based on environment
        String env = System.getProperty("spring.profiles.active", "development");
        String[] additionalProfiles = {"config-server", "monitoring", "security", "git"};
        application.setAdditionalProfiles(additionalProfiles);
        
        // Set JVM options for better performance
        System.setProperty("java.awt.headless", "true");
        System.setProperty("spring.jmx.enabled", "true");
        
        application.run(args);
    }
}
