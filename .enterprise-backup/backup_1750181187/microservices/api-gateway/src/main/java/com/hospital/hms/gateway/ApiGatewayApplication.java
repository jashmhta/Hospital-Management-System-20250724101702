package com.hospital.hms.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import java.time.Duration;
import java.util.Arrays;

/**
 * API Gateway Application
 * 
 * Enterprise-grade API Gateway for Hospital Management System.
 * Provides:
 * - Request routing to microservices
 * - Authentication and authorization
 * - Rate limiting and throttling
 * - Request/response transformation
 * - Circuit breaker patterns
 * - Monitoring and observability
 * - CORS handling
 * - Load balancing
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@SpringBootApplication
@EnableEurekaClient
public class ApiGatewayApplication {

    public static void main(String[] args) {
        SpringApplication.run(ApiGatewayApplication.class, args);
    }

    /**
     * Configure routes for microservices
     */
    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
            // Patient Management Service Routes
            .route("patient-management", r -> r
                .path("/api/v1/patients/**")
                .filters(f -> f
                    .circuitBreaker(config -> config
                        .setName("patient-management-cb")
                        .setFallbackUri("forward:/fallback/patient-management"))
                    .retry(config -> config
                        .setRetries(3)
                        .setMethods("GET")
                        .setBackoff(Duration.ofMillis(100), Duration.ofMillis(1000), 2, false))
                    .requestRateLimiter(config -> config
                        .setRateLimiter(redisRateLimiter())
                        .setKeyResolver(userKeyResolver()))
                    .addRequestHeader("X-Service", "patient-management")
                    .addResponseHeader("X-Response-Time", "#{T(System).currentTimeMillis()}")
                )
                .uri("lb://patient-management-service")
            )
            
            // Appointment Scheduling Service Routes
            .route("appointment-scheduling", r -> r
                .path("/api/v1/appointments/**")
                .filters(f -> f
                    .circuitBreaker(config -> config
                        .setName("appointment-scheduling-cb")
                        .setFallbackUri("forward:/fallback/appointment-scheduling"))
                    .retry(config -> config
                        .setRetries(3)
                        .setMethods("GET")
                        .setBackoff(Duration.ofMillis(100), Duration.ofMillis(1000), 2, false))
                    .requestRateLimiter(config -> config
                        .setRateLimiter(redisRateLimiter())
                        .setKeyResolver(userKeyResolver()))
                    .addRequestHeader("X-Service", "appointment-scheduling")
                )
                .uri("lb://appointment-scheduling-service")
            )
            
            // Clinical Notes Service Routes
            .route("clinical-notes", r -> r
                .path("/api/v1/clinical-notes/**", "/api/v1/records/**")
                .filters(f -> f
                    .circuitBreaker(config -> config
                        .setName("clinical-notes-cb")
                        .setFallbackUri("forward:/fallback/clinical-notes"))
                    .retry(config -> config
                        .setRetries(3)
                        .setMethods("GET")
                        .setBackoff(Duration.ofMillis(100), Duration.ofMillis(1000), 2, false))
                    .requestRateLimiter(config -> config
                        .setRateLimiter(redisRateLimiter())
                        .setKeyResolver(userKeyResolver()))
                    .addRequestHeader("X-Service", "clinical-notes")
                )
                .uri("lb://clinical-notes-service")
            )
            
            // Billing Service Routes
            .route("billing", r -> r
                .path("/api/v1/billing/**", "/api/v1/invoices/**")
                .filters(f -> f
                    .circuitBreaker(config -> config
                        .setName("billing-cb")
                        .setFallbackUri("forward:/fallback/billing"))
                    .retry(config -> config
                        .setRetries(3)
                        .setMethods("GET")
                        .setBackoff(Duration.ofMillis(100), Duration.ofMillis(1000), 2, false))
                    .requestRateLimiter(config -> config
                        .setRateLimiter(redisRateLimiter())
                        .setKeyResolver(userKeyResolver()))
                    .addRequestHeader("X-Service", "billing")
                )
                .uri("lb://billing-service")
            )
            
            // FHIR API Routes
            .route("fhir-patient", r -> r
                .path("/fhir/Patient/**")
                .filters(f -> f
                    .rewritePath("/fhir/Patient/(?<segment>.*)", "/api/v1/patients/${segment}")
                    .circuitBreaker(config -> config
                        .setName("fhir-patient-cb")
                        .setFallbackUri("forward:/fallback/fhir"))
                    .addRequestHeader("X-FHIR-Version", "4.0.1")
                    .addRequestHeader("X-Service", "fhir-patient")
                )
                .uri("lb://patient-management-service")
            )
            
            // Authentication Service Routes
            .route("auth", r -> r
                .path("/auth/**")
                .filters(f -> f
                    .circuitBreaker(config -> config
                        .setName("auth-cb")
                        .setFallbackUri("forward:/fallback/auth"))
                    .addRequestHeader("X-Service", "auth")
                )
                .uri("lb://auth-service")
            )
            
            // Health Check Aggregation
            .route("health-check", r -> r
                .path("/health/**")
                .filters(f -> f
                    .addRequestHeader("X-Health-Check", "true")
                )
                .uri("lb://service-discovery")
            )
            
            // API Documentation
            .route("api-docs", r -> r
                .path("/v3/api-docs/**")
                .filters(f -> f
                    .addRequestHeader("X-Documentation", "openapi")
                )
                .uri("http://localhost:8080")
            )
            
            // Swagger UI
            .route("swagger-ui", r -> r
                .path("/swagger-ui/**")
                .uri("http://localhost:8080")
            )
            
            .build();
    }

    /**
     * Configure CORS for cross-origin requests
     */
    @Bean
    public CorsWebFilter corsWebFilter() {
        CorsConfiguration corsConfig = new CorsConfiguration();
        corsConfig.setAllowedOriginPatterns(Arrays.asList("*"));
        corsConfig.setMaxAge(3600L);
        corsConfig.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        corsConfig.setAllowedHeaders(Arrays.asList("*"));
        corsConfig.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfig);

        return new CorsWebFilter(source);
    }

    /**
     * Redis-based rate limiter configuration
     */
    @Bean
    public org.springframework.cloud.gateway.filter.ratelimit.RedisRateLimiter redisRateLimiter() {
        return new org.springframework.cloud.gateway.filter.ratelimit.RedisRateLimiter(
            100, // requests per second
            200, // burst capacity
            1    // tokens per request
        );
    }

    /**
     * User-based key resolver for rate limiting
     */
    @Bean
    public org.springframework.cloud.gateway.filter.ratelimit.KeyResolver userKeyResolver() {
        return exchange -> exchange.getRequest().getQueryParams()
            .getFirst("user")
            != null ? 
            reactor.core.publisher.Mono.just(exchange.getRequest().getQueryParams().getFirst("user")) :
            reactor.core.publisher.Mono.just(exchange.getRequest().getRemoteAddress().getAddress().getHostAddress());
    }

    /**
     * IP-based key resolver for rate limiting
     */
    @Bean
    public org.springframework.cloud.gateway.filter.ratelimit.KeyResolver ipKeyResolver() {
        return exchange -> reactor.core.publisher.Mono.just(
            exchange.getRequest().getRemoteAddress().getAddress().getHostAddress()
        );
    }
}
