package com.hospital.hms.registry.exception;

/**
 * Exception thrown when report validation fails
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
public class ReportValidationException extends RuntimeException {

    public ReportValidationException(String message) {
        super(message);
    }

    public ReportValidationException(String message, Throwable cause) {
        super(message, cause);
    }
}
