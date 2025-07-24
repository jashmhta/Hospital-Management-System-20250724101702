package com.hms.providermobile.exception;

/**
 * Authentication Exception
 * 
 * Thrown when provider authentication fails due to invalid credentials,
 * expired sessions, or security violations.
 */
public class AuthenticationException extends ProviderMobileException {

    public AuthenticationException(String message) {
        super("AUTH_FAILED", message, "Authentication failed. Please check your credentials and try again.");
    }

    public AuthenticationException(String message, Throwable cause) {
        super("AUTH_FAILED", message, "Authentication failed. Please check your credentials and try again.", cause);
    }

    public AuthenticationException(String errorCode, String message, String userMessage) {
        super(errorCode, message, userMessage);
    }
}
