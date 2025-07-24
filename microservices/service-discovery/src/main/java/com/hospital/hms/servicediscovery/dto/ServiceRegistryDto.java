package com.hospital.hms.servicediscovery.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Positive;
import java.time.LocalDateTime;
import java.util.Map;

/**
 * Service Registry Data Transfer Object
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ServiceRegistryDto {

    private String serviceId;

    @NotBlank(message = "Service name is required")
    @Pattern(regexp = "^[a-zA-Z0-9-_]+$", message = "Service name must contain only alphanumeric characters, hyphens, and underscores")
    private String serviceName;

    @NotBlank(message = "Service host is required")
    private String serviceHost;

    @NotNull(message = "Service port is required")
    @Positive(message = "Service port must be positive")
    private Integer servicePort;

    @NotBlank(message = "Service URL is required")
    private String serviceUrl;

    @NotBlank(message = "Health check URL is required")
    private String healthCheckUrl;

    @Builder.Default
    private String status = "UP";

    @Builder.Default
    private String version = "1.0.0";

    private String description;

    private Map<String, String> tags;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime registrationTime;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime lastHeartbeat;

    @Builder.Default
    private Integer priority = 1;

    @Builder.Default
    private Integer weight = 100;

    @Builder.Default
    private Boolean isSecure = false;

    private String zone;

    private String environment;

    private Map<String, Object> metadata;
}
