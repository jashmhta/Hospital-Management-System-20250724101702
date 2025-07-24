package com.hms.discovery;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

/**
 * HMS Service Discovery (Eureka Server) Application
 * 
 * Enterprise Netflix Eureka Server implementation with security, monitoring,
 * cluster support, and comprehensive service registry management for the
 * Hospital Management System microservices ecosystem.
 */
@SpringBootApplication
@EnableEurekaServer
@EnableDiscoveryClient
public class EurekaServerApplication {

    public static void main(String[] args) {
        SpringApplication.run(EurekaServerApplication.class, args);
    }

    /**
     * Security Configuration for Eureka Server
     */
    @Configuration
    @EnableWebSecurity
    public static class SecurityConfig {

        @Bean
        public PasswordEncoder passwordEncoder() {
            return new BCryptPasswordEncoder();
        }

        @Bean
        public UserDetailsService userDetailsService() {
            UserDetails admin = User.builder()
                .username("admin")
                .password(passwordEncoder().encode("${eureka.security.admin.password:admin123}"))
                .roles("ADMIN")
                .build();

            UserDetails monitor = User.builder()
                .username("monitor")
                .password(passwordEncoder().encode("${eureka.security.monitor.password:monitor123}"))
                .roles("MONITOR")
                .build();

            return new InMemoryUserDetailsManager(admin, monitor);
        }

        @Bean
        public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
            http.csrf().disable()
                .authorizeHttpRequests(authz -> authz
                    .requestMatchers("/actuator/health", "/actuator/info").permitAll()
                    .requestMatchers("/eureka/css/**", "/eureka/js/**", "/eureka/fonts/**").permitAll()
                    .requestMatchers("/eureka/apps/**").hasRole("ADMIN")
                    .anyRequest().authenticated()
                )
                .httpBasic();
            
            return http.build();
        }
    }

    /**
     * CORS Configuration for Cross-Origin Requests
     */
    @Configuration
    public static class WebConfig implements WebMvcConfigurer {
        
        @Override
        public void addCorsMappings(CorsRegistry registry) {
            registry.addMapping("/**")
                .allowedOrigins(
                    "https://admin.hospital.com",
                    "https://dashboard.hospital.com",
                    "http://localhost:3000"
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
        }
    }
}
