package com.hospital.hms.registry.exception;

/**
 * Exception thrown when a report update is not allowed
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
public class ReportUpdateNotAllowedException extends RuntimeException {

    public ReportUpdateNotAllowedException(String message) {
        super(message);
    }

    public ReportUpdateNotAllowedException(String message, Throwable cause) {
        super(message, cause);
    }
}
