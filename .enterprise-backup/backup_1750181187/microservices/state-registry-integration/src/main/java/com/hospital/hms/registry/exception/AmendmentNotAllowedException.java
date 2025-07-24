package com.hospital.hms.registry.exception;

/**
 * Exception thrown when an amendment is not allowed
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
public class AmendmentNotAllowedException extends RuntimeException {

    public AmendmentNotAllowedException(String message) {
        super(message);
    }

    public AmendmentNotAllowedException(String message, Throwable cause) {
        super(message, cause);
    }
}
