package com.hospital.hms.shared.config;

import io.github.resilience4j.circuitbreaker.CircuitBreakerConfig;
import io.github.resilience4j.retry.RetryConfig;
import io.github.resilience4j.timelimiter.TimeLimiterConfig;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.cloud.stream.annotation.EnableBinding;
import org.springframework.cloud.stream.messaging.Source;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;

/**
 * Global Microservices Configuration
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Configuration
@EnableFeignClients(basePackages = "com.hospital.hms")
@EnableDiscoveryClient
@EnableBinding(Source.class)
public class MicroservicesConfiguration {

    /**
     * Load-balanced RestTemplate for inter-service communication
     */
    @Bean
    @LoadBalanced
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    /**
     * Circuit Breaker Configuration
     */
    @Bean
    public CircuitBreakerConfig circuitBreakerConfig() {
        return CircuitBreakerConfig.custom()
                .failureRateThreshold(50)
                .waitDurationInOpenState(Duration.ofMillis(1000))
                .slidingWindowSize(2)
                .minimumNumberOfCalls(2)
                .permittedNumberOfCallsInHalfOpenState(1)
                .automaticTransitionFromOpenToHalfOpenEnabled(true)
                .build();
    }

    /**
     * Retry Configuration
     */
    @Bean
    public RetryConfig retryConfig() {
        return RetryConfig.custom()
                .maxAttempts(3)
                .waitDuration(Duration.ofMillis(100))
                .exponentialBackoffMultiplier(2)
                .build();
    }

    /**
     * Time Limiter Configuration
     */
    @Bean
    public TimeLimiterConfig timeLimiterConfig() {
        return TimeLimiterConfig.custom()
                .timeoutDuration(Duration.ofSeconds(4))
                .cancelRunningFuture(true)
                .build();
    }

    /**
     * Service Discovery Configuration
     */
    @Bean
    @ConditionalOnProperty(name = "eureka.client.enabled", havingValue = "true", matchIfMissing = true)
    public ServiceDiscoveryConfiguration serviceDiscoveryConfiguration() {
        return new ServiceDiscoveryConfiguration();
    }

    /**
     * Event Streaming Configuration
     */
    @Bean
    public EventStreamConfiguration eventStreamConfiguration() {
        return new EventStreamConfiguration();
    }

    /**
     * Security Configuration for Inter-Service Communication
     */
    @Bean
    public InterServiceSecurityConfiguration interServiceSecurityConfiguration() {
        return new InterServiceSecurityConfiguration();
    }

    /**
     * Transaction Management Configuration
     */
    @Bean
    public DistributedTransactionConfiguration distributedTransactionConfiguration() {
        return new DistributedTransactionConfiguration();
    }

    /**
     * Service Discovery Configuration Class
     */
    public static class ServiceDiscoveryConfiguration {
        // Service discovery related beans and configuration
    }

    /**
     * Event Stream Configuration Class
     */
    public static class EventStreamConfiguration {
        // Event streaming related beans and configuration
    }

    /**
     * Inter-Service Security Configuration Class
     */
    public static class InterServiceSecurityConfiguration {
        // Security related beans and configuration
    }

    /**
     * Distributed Transaction Configuration Class
     */
    public static class DistributedTransactionConfiguration {
        // Transaction management related beans and configuration
    }
}
