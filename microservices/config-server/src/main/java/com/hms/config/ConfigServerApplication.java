package com.hms.config;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.config.server.EnableConfigServer;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
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
 * HMS Config Server Application
 * 
 * Enterprise Spring Cloud Config Server with Git integration, encryption,
 * environment profiles, and comprehensive configuration management for
 * the Hospital Management System microservices ecosystem.
 */
@SpringBootApplication
@EnableConfigServer
@EnableEurekaClient
public class ConfigServerApplication {

    public static void main(String[] args) {
        SpringApplication.run(ConfigServerApplication.class, args);
    }

    /**
     * Security Configuration for Config Server
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
            UserDetails configUser = User.builder()
                .username("config-user")
                .password(passwordEncoder().encode("${config.security.user.password:config123}"))
                .roles("CONFIG_USER")
                .build();

            UserDetails admin = User.builder()
                .username("config-admin")
                .password(passwordEncoder().encode("${config.security.admin.password:admin123}"))
                .roles("CONFIG_ADMIN", "CONFIG_USER")
                .build();

            return new InMemoryUserDetailsManager(configUser, admin);
        }

        @Bean
        public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
            http.csrf().disable()
                .authorizeHttpRequests(authz -> authz
                    .requestMatchers("/actuator/health", "/actuator/info").permitAll()
                    .requestMatchers("/encrypt/**", "/decrypt/**").hasRole("CONFIG_ADMIN")
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
                    "https://config.hospital.com",
                    "http://localhost:3000"
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
        }
    }
}
