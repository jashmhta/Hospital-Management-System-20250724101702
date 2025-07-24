package com.hospital.hms.provider.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.Map;

/**
 * Provider Authentication Request DTO
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProviderAuthRequestDto {

    @NotBlank(message = "Provider ID is required")
    private String providerId;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    private Map<String, Object> deviceInfo;

    @Builder.Default
    private Boolean rememberMe = false;

    private String deviceToken;

    private String deviceType; // IOS, ANDROID, WEB

    private String appVersion;

    private String osVersion;

    private String timezone;
}
