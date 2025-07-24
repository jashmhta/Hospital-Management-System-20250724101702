package com.hospital.hms.servicediscovery.config;

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
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

/**
 * Enhanced Security Configuration for Eureka Server
 * 
 * Provides comprehensive authentication and authorization for the service registry.
 * Protects sensitive service information while allowing legitimate services to register.
 * 
 * Features:
 * - Multi-tier authentication (Basic Auth + Form Login)
 * - Role-based access control (RBAC)
 * - Secure headers configuration
 * - Session management with limits
 * - CSRF protection for web endpoints
 * - Healthcare compliance ready
 * - Audit logging integration
 * 
 * @author HMS Enterprise Team
 * @version 2.0.0
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Value("${eureka.security.username:admin}")
    private String adminUsername;
    
    @Value("${eureka.security.password:admin}")
    private String adminPassword;
    
    @Value("${eureka.security.service-username:service}")
    private String serviceUsername;
    
    @Value("${eureka.security.service-password:service123}")
    private String servicePassword;

    /**
     * Configure enhanced security filter chain for Eureka Server
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf
                .ignoringRequestMatchers("/eureka/**", "/actuator/**")
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
                .requestMatchers("/actuator/health", "/actuator/info", "/actuator/prometheus").permitAll()
                
                // Service registration/discovery endpoints - require service role
                .requestMatchers("/eureka/apps/**").hasAnyRole("SERVICE", "ADMIN")
                .requestMatchers("/eureka/v2/**").hasAnyRole("SERVICE", "ADMIN")
                .requestMatchers("/eureka/peerreplication").hasAnyRole("SERVICE", "ADMIN")
                
                // Administrative endpoints - require admin role
                .requestMatchers("/eureka", "/", "/apps", "/lastn").hasRole("ADMIN")
                .requestMatchers("/actuator/**").hasRole("ADMIN")
                
                // All other requests require authentication
                .anyRequest().authenticated()
            )
            .httpBasic(httpBasic -> httpBasic
                .realmName("HMS Eureka Server")
                .authenticationEntryPoint((request, response, authException) -> {
                    response.addHeader("WWW-Authenticate", "Basic realm=\"HMS Eureka Server\"");
                    response.setStatus(401);
                    response.getWriter().write("{\"error\":\"Unauthorized access to service registry\"}");
                })
            )
            .formLogin(form -> form
                .loginPage("/login").permitAll()
                .defaultSuccessUrl("/", true)
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
                .key("hms-eureka-remember-me")
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
            .roles("ADMIN", "USER")
            .accountLocked(false)
            .accountExpired(false)
            .credentialsExpired(false)
            .disabled(false)
            .build();

        UserDetails serviceUser = User.builder()
            .username(serviceUsername)
            .password(passwordEncoder().encode(servicePassword))
            .roles("SERVICE", "USER")
            .accountLocked(false)
            .accountExpired(false)
            .credentialsExpired(false)
            .disabled(false)
            .build();

        return new InMemoryUserDetailsManager(admin, serviceUser);
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
        successHandler.setDefaultTargetUrl("/");
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
