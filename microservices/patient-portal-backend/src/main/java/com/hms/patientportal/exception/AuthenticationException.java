package com.hms.patientportal.exception;

/**
 * Authentication Exception
 * 
 * Thrown when authentication fails during login or token validation
 */
public class AuthenticationException extends PatientPortalException {

    public AuthenticationException(String message) {
        super(message, "AUTH_FAILED");
    }

    public AuthenticationException(String message, Throwable cause) {
        super(message, cause, "AUTH_FAILED");
    }

    public AuthenticationException(String message, String errorCode) {
        super(message, errorCode);
    }
}
