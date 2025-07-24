package com.hospital.hms.patientmanagement.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

/**
 * Swagger/OpenAPI configuration for Patient Management Service
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Configuration
public class SwaggerConfig {

    @Value("${server.port:8081}")
    private String serverPort;

    @Value("${spring.application.name:patient-management-service}")
    private String applicationName;

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(apiInfo())
                .servers(List.of(
                    new Server().url("http://localhost:" + serverPort).description("Local server"),
                    new Server().url("https://api.hospital.com").description("Production server")
                ))
                .components(new Components()
                    .addSecuritySchemes("bearerAuth", new SecurityScheme()
                        .type(SecurityScheme.Type.HTTP)
                        .scheme("bearer")
                        .bearerFormat("JWT")
                        .description("JWT token authentication")))
                .addSecurityItem(new SecurityRequirement().addList("bearerAuth"));
    }

    private Info apiInfo() {
        return new Info()
                .title("Patient Management Service API")
                .description("RESTful API for managing patient demographics, registration, and related operations in the Hospital Management System")
                .version("1.0.0")
                .contact(new Contact()
                    .name("HMS Enterprise Team")
                    .email("support@hospital.com")
                    .url("https://hospital.com/support"))
                .license(new License()
                    .name("Proprietary License")
                    .url("https://hospital.com/license"));
    }
}
