package com.hospital.hms.registry.exception;

/**
 * Exception thrown when registry submission fails
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
public class RegistrySubmissionException extends RuntimeException {

    public RegistrySubmissionException(String message) {
        super(message);
    }

    public RegistrySubmissionException(String message, Throwable cause) {
        super(message, cause);
    }
}
