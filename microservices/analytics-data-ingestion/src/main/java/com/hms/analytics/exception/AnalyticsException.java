package com.hms.analytics.exception;

/**
 * Base Analytics Exception
 */
public class AnalyticsException extends RuntimeException {

    private String errorCode;

    public AnalyticsException(String message) {
        super(message);
    }

    public AnalyticsException(String message, Throwable cause) {
        super(message, cause);
    }

    public AnalyticsException(String errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
    }

    public AnalyticsException(String errorCode, String message, Throwable cause) {
        super(message, cause);
        this.errorCode = errorCode;
    }

    public String getErrorCode() { return errorCode; }
    public void setErrorCode(String errorCode) { this.errorCode = errorCode; }
}
