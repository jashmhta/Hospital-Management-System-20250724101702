package com.hospital.hms.patientmanagement.config;

import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.transaction.annotation.EnableTransactionManagement;

/**
 * Database and JPA configuration for Patient Management Service
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Configuration
@EnableJpaRepositories(basePackages = "com.hospital.hms.patientmanagement.repository")
@EntityScan(basePackages = "com.hospital.hms.patientmanagement.entity")
@EnableJpaAuditing
@EnableTransactionManagement
public class DatabaseConfig {
    
    // Additional database configuration can be added here if needed
    // For example, custom data source configurations, connection pooling, etc.
}
