package com.hospital.hms.clinicalnotes;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.elasticsearch.repository.config.EnableElasticsearchRepositories;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * Clinical Notes Service Application
 * 
 * Enterprise-grade microservice for Electronic Medical Records (EMR) and clinical documentation.
 * Provides comprehensive clinical note management, medical documentation, and healthcare data analytics.
 * 
 * Features:
 * - Electronic Medical Records (EMR) management
 * - Clinical note creation and management
 * - Progress notes and discharge summaries
 * - Medical dictation and voice recognition
 * - Natural language processing for medical text
 * - FHIR R4 compliant clinical resources
 * - Advanced search and clinical data mining
 * - Medical terminology and coding support
 * - Digital signatures and authentication
 * - Clinical decision support integration
 * - Medical image and document management
 * - Clinical workflow automation
 * - Audit trails and compliance tracking
 * - Multi-provider collaboration
 * - Template-based documentation
 * 
 * Advanced Capabilities:
 * - AI-powered clinical insights
 * - Medical text analytics and NLP
 * - Clinical quality metrics
 * - Population health analytics
 * - Evidence-based medicine integration
 * - Clinical research data collection
 * - Interoperability with external EMRs
 * - Real-time clinical alerts
 * - Clinical performance dashboards
 * - Regulatory compliance reporting
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@SpringBootApplication
@EnableEurekaClient
@EnableFeignClients
@EnableJpaAuditing
@EnableElasticsearchRepositories
@EnableAsync
@EnableScheduling
public class ClinicalNotesServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(ClinicalNotesServiceApplication.class, args);
    }
}
