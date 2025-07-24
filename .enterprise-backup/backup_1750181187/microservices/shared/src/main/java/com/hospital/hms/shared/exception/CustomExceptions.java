package com.hospital.hms.shared.exception;

/**
 * Custom Exception Classes for Hospital Management System Microservices
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */

/**
 * Business Exception for business logic errors
 */
public class BusinessException extends RuntimeException {
    private final String errorCode;

    public BusinessException(String message, String errorCode) {
        super(message);
        this.errorCode = errorCode;
    }

    public String getErrorCode() {
        return errorCode;
    }
}

/**
 * Resource Not Found Exception
 */
public class ResourceNotFoundException extends RuntimeException {
    private final String resourceId;
    private final String resourceType;

    public ResourceNotFoundException(String message, String resourceId, String resourceType) {
        super(message);
        this.resourceId = resourceId;
        this.resourceType = resourceType;
    }

    public String getResourceId() {
        return resourceId;
    }

    public String getResourceType() {
        return resourceType;
    }
}

/**
 * Service Communication Exception
 */
public class ServiceCommunicationException extends RuntimeException {
    private final String serviceName;

    public ServiceCommunicationException(String message, String serviceName) {
        super(message);
        this.serviceName = serviceName;
    }

    public ServiceCommunicationException(String message, String serviceName, Throwable cause) {
        super(message, cause);
        this.serviceName = serviceName;
    }

    public String getServiceName() {
        return serviceName;
    }
}

/**
 * Authentication Exception
 */
public class AuthenticationException extends RuntimeException {
    public AuthenticationException(String message) {
        super(message);
    }

    public AuthenticationException(String message, Throwable cause) {
        super(message, cause);
    }
}

/**
 * Authorization Exception
 */
public class AuthorizationException extends RuntimeException {
    public AuthorizationException(String message) {
        super(message);
    }

    public AuthorizationException(String message, Throwable cause) {
        super(message, cause);
    }
}

/**
 * Data Integrity Exception
 */
public class DataIntegrityException extends RuntimeException {
    public DataIntegrityException(String message) {
        super(message);
    }

    public DataIntegrityException(String message, Throwable cause) {
        super(message, cause);
    }
}
