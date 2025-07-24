package com.hms.providermobile.exception;

/**
 * Base exception for Provider Mobile Backend Service
 * 
 * Custom exception class for handling provider mobile specific errors
 * including authentication, session management, and clinical workflow issues.
 */
public class ProviderMobileException extends RuntimeException {

    private String errorCode;
    private String userMessage;

    public ProviderMobileException(String message) {
        super(message);
    }

    public ProviderMobileException(String message, Throwable cause) {
        super(message, cause);
    }

    public ProviderMobileException(String errorCode, String message, String userMessage) {
        super(message);
        this.errorCode = errorCode;
        this.userMessage = userMessage;
    }

    public ProviderMobileException(String errorCode, String message, String userMessage, Throwable cause) {
        super(message, cause);
        this.errorCode = errorCode;
        this.userMessage = userMessage;
    }

    public String getErrorCode() { return errorCode; }
    public void setErrorCode(String errorCode) { this.errorCode = errorCode; }

    public String getUserMessage() { return userMessage; }
    public void setUserMessage(String userMessage) { this.userMessage = userMessage; }
}
