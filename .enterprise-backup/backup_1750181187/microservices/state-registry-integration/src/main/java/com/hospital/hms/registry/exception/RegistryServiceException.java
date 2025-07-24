package com.hospital.hms.registry.exception;

/**
 * General exception for State Registry Integration Service
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
public class RegistryServiceException extends RuntimeException {

    public RegistryServiceException(String message) {
        super(message);
    }

    public RegistryServiceException(String message, Throwable cause) {
        super(message, cause);
    }
}
