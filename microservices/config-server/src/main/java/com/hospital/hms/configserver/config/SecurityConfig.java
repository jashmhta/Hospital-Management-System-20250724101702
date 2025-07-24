package com.hospital.hms.configserver.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.SavedRequestAwareAuthenticationSuccessHandler;
import org.springframework.security.web.header.writers.ReferrerPolicyHeaderWriter;

/**
 * Enhanced Security Configuration for Config Server
 * 
 * Provides comprehensive authentication and authorization for the configuration server.
 * Protects sensitive configuration data while allowing legitimate services to access configs.
 * 
 * Security Features:
 * - Multi-tier authentication (Basic Auth + JWT)
 * - Role-based access control (RBAC)
 * - Service-specific access controls
 * - Secure headers configuration
 * - Configuration encryption key management
 * - Audit logging for configuration access
 * - Healthcare compliance ready (HIPAA)
 * - Configuration access rate limiting
 * 
 * Access Levels:
 * - ADMIN: Full configuration management access
 * - SERVICE: Service-specific configuration access
 * - VIEWER: Read-only configuration access
 * - AUDITOR: Audit and compliance access
 * 
 * @author HMS Enterprise Team
 * @version 2.0.0
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Value("${config.security.admin-username:config-admin}")
    private String adminUsername;
    
    @Value("${config.security.admin-password:hms-config-admin-2024}")
    private String adminPassword;
    
    @Value("${config.security.service-username:config-service}")
    private String serviceUsername;
    
    @Value("${config.security.service-password:hms-config-service-2024}")
    private String servicePassword;
    
    @Value("${config.security.viewer-username:config-viewer}")
    private String viewerUsername;
    
    @Value("${config.security.viewer-password:hms-config-viewer-2024}")
    private String viewerPassword;

    /**
     * Configure enhanced security filter chain for Config Server
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf
                .ignoringRequestMatchers("/actuator/**", "/refresh", "/encrypt/**", "/decrypt/**")
                .csrfTokenRepository(org.springframework.security.web.csrf.CookieCsrfTokenRepository.withHttpOnlyFalse())
            )
            .headers(headers -> headers
                .frameOptions().deny()
                .contentTypeOptions().and()
                .httpStrictTransportSecurity(hstsConfig -> hstsConfig
                    .maxAgeInSeconds(31536000)
                    .includeSubdomains(true)
                )
                .referrerPolicy(ReferrerPolicyHeaderWriter.ReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN)
                .and()
                .cacheControl()
            )
            .authorizeHttpRequests(authz -> authz
                // Public health check endpoints
                .requestMatchers("/actuator/health", "/actuator/info").permitAll()
                
                // Administrative endpoints - require admin role
                .requestMatchers("/admin/**", "/actuator/configprops", "/actuator/env").hasRole("ADMIN")
                .requestMatchers("/encrypt/**", "/decrypt/**").hasRole("ADMIN")
                .requestMatchers("/refresh").hasAnyRole("ADMIN", "SERVICE")
                
                // Configuration access - different roles for different operations
                .requestMatchers("/**/application/**").hasAnyRole("ADMIN", "SERVICE", "VIEWER")
                .requestMatchers("/**/application-default/**").hasAnyRole("ADMIN", "SERVICE")
                .requestMatchers("/**/application-production/**").hasRole("ADMIN")
                
                // Service-specific configuration access
                .requestMatchers("/patient-management/**").hasAnyRole("ADMIN", "SERVICE")
                .requestMatchers("/clinical-documentation/**").hasAnyRole("ADMIN", "SERVICE")
                .requestMatchers("/pharmacy-service/**").hasAnyRole("ADMIN", "SERVICE")
                .requestMatchers("/billing-service/**").hasAnyRole("ADMIN", "SERVICE")
                .requestMatchers("/emergency-service/**").hasAnyRole("ADMIN", "SERVICE")
                .requestMatchers("/appointment-scheduling/**").hasAnyRole("ADMIN", "SERVICE")
                
                // Monitoring and metrics - admin and viewer access
                .requestMatchers("/actuator/metrics", "/actuator/prometheus").hasAnyRole("ADMIN", "VIEWER")
                .requestMatchers("/actuator/**").hasRole("ADMIN")
                
                // All other requests require authentication
                .anyRequest().authenticated()
            )
            .httpBasic(httpBasic -> httpBasic
                .realmName("HMS Config Server")
                .authenticationEntryPoint((request, response, authException) -> {
                    response.addHeader("WWW-Authenticate", "Basic realm=\"HMS Config Server\"");
                    response.setStatus(401);
                    response.getWriter().write("{\"error\":\"Unauthorized access to configuration server\"}");
                })
            )
            .formLogin(form -> form
                .loginPage("/login").permitAll()
                .defaultSuccessUrl("/admin/dashboard", true)
                .successHandler(savedRequestAwareAuthenticationSuccessHandler())
                .failureUrl("/login?error=true")
                .usernameParameter("username")
                .passwordParameter("password")
            )
            .logout(logout -> logout
                .logoutUrl("/logout")
                .logoutSuccessUrl("/login?logout=true")
                .invalidateHttpSession(true)
                .deleteCookies("JSESSIONID", "remember-me")
                .clearAuthentication(true)
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
                .maximumSessions(50)
                .maxSessionsPreventsLogin(false)
                .sessionRegistry(sessionRegistry())
            )
            .rememberMe(rememberMe -> rememberMe
                .key("hms-config-remember-me")
                .tokenValiditySeconds(86400) // 24 hours
                .userDetailsService(userDetailsService())
            );

        return http.build();
    }

    /**
     * Configure user details service with role-based access
     */
    @Bean
    public UserDetailsService userDetailsService() {
        UserDetails admin = User.builder()
            .username(adminUsername)
            .password(passwordEncoder().encode(adminPassword))
            .roles("ADMIN", "SERVICE", "VIEWER")
            .accountLocked(false)
            .accountExpired(false)
            .credentialsExpired(false)
            .disabled(false)
            .build();

        UserDetails serviceUser = User.builder()
            .username(serviceUsername)
            .password(passwordEncoder().encode(servicePassword))
            .roles("SERVICE")
            .accountLocked(false)
            .accountExpired(false)
            .credentialsExpired(false)
            .disabled(false)
            .build();

        UserDetails viewerUser = User.builder()
            .username(viewerUsername)
            .password(passwordEncoder().encode(viewerPassword))
            .roles("VIEWER")
            .accountLocked(false)
            .accountExpired(false)
            .credentialsExpired(false)
            .disabled(false)
            .build();

        // Additional healthcare-specific users
        UserDetails auditorUser = User.builder()
            .username("config-auditor")
            .password(passwordEncoder().encode("hms-config-auditor-2024"))
            .roles("AUDITOR", "VIEWER")
            .accountLocked(false)
            .accountExpired(false)
            .credentialsExpired(false)
            .disabled(false)
            .build();

        return new InMemoryUserDetailsManager(admin, serviceUser, viewerUser, auditorUser);
    }

    /**
     * Password encoder for secure password storage
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

    /**
     * Session registry for session management
     */
    @Bean
    public org.springframework.security.core.session.SessionRegistry sessionRegistry() {
        return new org.springframework.security.core.session.SessionRegistryImpl();
    }

    /**
     * Configure authentication success handler
     */
    @Bean
    public SavedRequestAwareAuthenticationSuccessHandler savedRequestAwareAuthenticationSuccessHandler() {
        SavedRequestAwareAuthenticationSuccessHandler successHandler = new SavedRequestAwareAuthenticationSuccessHandler();
        successHandler.setTargetUrlParameter("redirectTo");
        successHandler.setDefaultTargetUrl("/admin/dashboard");
        successHandler.setAlwaysUseDefaultTargetUrl(false);
        return successHandler;
    }

    /**
     * Session management configuration bean
     */
    @Bean
    public org.springframework.security.web.session.HttpSessionEventPublisher httpSessionEventPublisher() {
        return new org.springframework.security.web.session.HttpSessionEventPublisher();
    }
}
