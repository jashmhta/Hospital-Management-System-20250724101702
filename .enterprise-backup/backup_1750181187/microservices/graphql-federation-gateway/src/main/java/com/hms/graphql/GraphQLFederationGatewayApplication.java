package com.hms.graphql;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.context.annotation.Bean;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

import java.util.Arrays;
import java.util.Collections;

/**
 * HMS GraphQL Federation Gateway Application
 * Enterprise-grade GraphQL Federation Gateway implementation
 * 
 * Features:
 * - GraphQL schema federation and stitching
 * - Real-time subscriptions with WebSocket support
 * - Healthcare data security and HIPAA compliance
 * - Query optimization and caching
 * - Rate limiting and authentication
 * - Cross-service data aggregation
 * - Performance monitoring and metrics
 * 
 * @author HMS Development Team
 * @version 3.0.0
 * @since 2024-01-15
 */
@SpringBootApplication
@EnableEurekaClient
@EnableAsync
@EnableScheduling
public class GraphQLFederationGatewayApplication {

    public static void main(String[] args) {
        System.setProperty("spring.config.name", "graphql-federation-gateway");
        SpringApplication.run(GraphQLFederationGatewayApplication.class, args);
    }

    /**
     * CORS configuration for GraphQL endpoints
     * Allows secure cross-origin requests for healthcare frontends
     */
    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowCredentials(true);
        configuration.setAllowedOriginPatterns(Collections.singletonList("*"));
        configuration.setAllowedHeaders(Arrays.asList(
            "Origin", "Access-Control-Allow-Origin", "Content-Type", 
            "Accept", "Authorization", "Origin, Accept", "X-Requested-With",
            "Access-Control-Request-Method", "Access-Control-Request-Headers",
            "X-Patient-Context", "X-Healthcare-Role", "X-Audit-Trail"
        ));
        configuration.setExposedHeaders(Arrays.asList(
            "Origin", "Content-Type", "Accept", "Authorization",
            "Access-Control-Allow-Origin", "Access-Control-Allow-Origin",
            "Access-Control-Allow-Credentials", "X-Patient-Context", "X-Audit-Trail"
        ));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        
        UrlBasedCorsConfigurationSource urlBasedCorsConfigurationSource = new UrlBasedCorsConfigurationSource();
        urlBasedCorsConfigurationSource.registerCorsConfiguration("/**", configuration);
        
        return new CorsFilter(urlBasedCorsConfigurationSource);
    }
}
