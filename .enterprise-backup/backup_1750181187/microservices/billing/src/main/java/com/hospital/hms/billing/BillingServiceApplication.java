package com.hospital.hms.billing;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * Billing Service Application
 * 
 * Enterprise-grade microservice for healthcare billing and revenue cycle management.
 * Provides comprehensive financial operations and revenue optimization.
 * 
 * Features:
 * - Invoice generation and management
 * - Insurance claims processing
 * - Payment processing and tracking
 * - Revenue cycle management
 * - Financial reporting and analytics
 * - Automated billing workflows
 * - Copay and deductible calculations
 * - Multi-payer support
 * - EDI transaction processing
 * - Claims denial management
 * - Patient statement generation
 * - Financial assistance programs
 * - Compliance and audit trails
 * - Real-time eligibility verification
 * - Automated posting and reconciliation
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@SpringBootApplication
@EnableEurekaClient
@EnableFeignClients
@EnableJpaAuditing
@EnableAsync
@EnableScheduling
public class BillingServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(BillingServiceApplication.class, args);
    }
}
