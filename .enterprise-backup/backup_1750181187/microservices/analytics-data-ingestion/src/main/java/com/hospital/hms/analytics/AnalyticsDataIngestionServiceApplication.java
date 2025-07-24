package com.hospital.hms.analytics;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.kafka.annotation.EnableKafkaStreams;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * Analytics Data Ingestion Service Application
 * 
 * Real-time data streaming and ETL processing providing:
 * - Real-time data stream processing
 * - ETL pipeline management
 * - Data quality validation
 * - Data transformation and enrichment
 * - Analytics data warehousing
 * - Stream analytics and aggregation
 * - Data lineage tracking
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@SpringBootApplication
@EnableFeignClients
@EnableCaching
@EnableJpaAuditing
@EnableAsync
@EnableScheduling
@EnableKafka
@EnableKafkaStreams
public class AnalyticsDataIngestionServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(AnalyticsDataIngestionServiceApplication.class, args);
    }
}
