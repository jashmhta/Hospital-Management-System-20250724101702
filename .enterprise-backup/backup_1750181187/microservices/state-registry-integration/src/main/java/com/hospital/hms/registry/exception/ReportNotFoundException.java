package com.hospital.hms.registry.exception;

/**
 * Exception thrown when a public health report is not found
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
public class ReportNotFoundException extends RuntimeException {

    public ReportNotFoundException(String message) {
        super(message);
    }

    public ReportNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
