package com.hospital.hms.graphql;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.boot.actuate.autoconfigure.security.servlet.ManagementWebSecurityAutoConfiguration;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.transaction.annotation.EnableTransactionManagement;

/**
 * GraphQL Federation Gateway Application - Enterprise API Orchestration
 * 
 * Comprehensive GraphQL federation gateway providing unified API access across all HMS microservices.
 * This service acts as the single entry point for all GraphQL operations in the hospital ecosystem.
 * 
 * Core Features:
 * - Advanced schema federation with automatic service discovery
 * - Unified query interface with type-safe operations
 * - Real-time subscriptions via WebSocket and Server-Sent Events
 * - Intelligent query optimization and caching strategies
 * - Multi-layered authentication and authorization (JWT + RBAC)
 * - Performance monitoring and detailed analytics
 * - Load balancing with circuit breakers and fallbacks
 * - Request/response transformation and validation
 * - Healthcare-specific data filtering and compliance
 * 
 * Enterprise Features:
 * - Schema stitching with dependency resolution
 * - Query complexity analysis and rate limiting
 * - Distributed tracing and observability
 * - Multi-tenant data isolation
 * - FHIR R4 compliance and medical terminology support
 * - Healthcare audit logging and compliance reporting
 * - Emergency service priority routing
 * - Clinical workflow optimization
 * - Patient data privacy controls (HIPAA compliance)
 * 
 * Federation Architecture:
 * - Patient Management Schema (patient, medical records, demographics)
 * - Clinical Documentation Schema (notes, reports, assessments)
 * - Pharmacy Schema (medications, prescriptions, drug interactions)
 * - Billing Schema (invoices, payments, insurance)
 * - Appointment Scheduling Schema (slots, bookings, calendars)
 * - Emergency Services Schema (triage, critical alerts)
 * - Laboratory Schema (tests, results, specimens)
 * - Radiology Schema (studies, images, reports)
 * - Analytics Schema (metrics, dashboards, insights)
 * 
 * Real-time Capabilities:
 * - Live patient status updates
 * - Critical alert notifications
 * - Real-time bed management
 * - Emergency department tracking
 * - Medication administration monitoring
 * - Laboratory result streaming
 * 
 * @author HMS Enterprise Team
 * @version 2.0.0
 * @since 2025-01-01
 */
@SpringBootApplication(exclude = {ManagementWebSecurityAutoConfiguration.class})
@EnableEurekaClient
@EnableFeignClients
@EnableCaching
@EnableAsync
@EnableScheduling
@EnableWebSecurity
@EnableAspectJAutoProxy
@EnableTransactionManagement
public class GraphQLFederationGatewayApplication {

    public static void main(String[] args) {
        // Set system properties for enhanced GraphQL performance
        System.setProperty("spring.application.name", "hms-graphql-federation-gateway");
        System.setProperty("graphql.federation.hostname", "graphql-gateway");
        System.setProperty("graphql.query.timeout", "30000");
        System.setProperty("graphql.introspection.enabled", "true");
        
        SpringApplication application = new SpringApplication(GraphQLFederationGatewayApplication.class);
        
        // Enable additional profiles based on environment
        String env = System.getProperty("spring.profiles.active", "development");
        String[] additionalProfiles = {"graphql", "federation", "monitoring", "security"};
        application.setAdditionalProfiles(additionalProfiles);
        
        // Set GraphQL-specific JVM options
        System.setProperty("java.awt.headless", "true");
        System.setProperty("spring.jmx.enabled", "true");
        System.setProperty("graphql.servlet.asyncTimeout", "30000");
        
        application.run(args);
    }
}