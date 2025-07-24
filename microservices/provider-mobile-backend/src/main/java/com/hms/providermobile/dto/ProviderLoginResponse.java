package com.hms.providermobile.dto;

import java.time.LocalDateTime;

/**
 * Provider Login Response DTO
 * 
 * Data transfer object containing authentication tokens and provider information
 * returned after successful mobile login.
 */
public class ProviderLoginResponse {

    private String sessionToken;

    private String refreshToken;

    private LocalDateTime expiresAt;

    private ProviderDTO provider;

    private Boolean requiresTwoFactor;

    private String message;

    private LocalDateTime timestamp;

    // Constructors
    public ProviderLoginResponse() {
        this.timestamp = LocalDateTime.now();
    }

    public ProviderLoginResponse(String sessionToken, String refreshToken, LocalDateTime expiresAt, ProviderDTO provider) {
        this();
        this.sessionToken = sessionToken;
        this.refreshToken = refreshToken;
        this.expiresAt = expiresAt;
        this.provider = provider;
    }

    // Getters and Setters
    public String getSessionToken() { return sessionToken; }
    public void setSessionToken(String sessionToken) { this.sessionToken = sessionToken; }

    public String getRefreshToken() { return refreshToken; }
    public void setRefreshToken(String refreshToken) { this.refreshToken = refreshToken; }

    public LocalDateTime getExpiresAt() { return expiresAt; }
    public void setExpiresAt(LocalDateTime expiresAt) { this.expiresAt = expiresAt; }

    public ProviderDTO getProvider() { return provider; }
    public void setProvider(ProviderDTO provider) { this.provider = provider; }

    public Boolean getRequiresTwoFactor() { return requiresTwoFactor; }
    public void setRequiresTwoFactor(Boolean requiresTwoFactor) { this.requiresTwoFactor = requiresTwoFactor; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
