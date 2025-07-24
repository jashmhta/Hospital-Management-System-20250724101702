package com.hms.patientportal.exception;

/**
 * Validation Exception
 * 
 * Thrown when input validation fails or business rules are violated
 */
public class ValidationException extends PatientPortalException {

    public ValidationException(String message) {
        super(message, "VALIDATION_FAILED");
    }

    public ValidationException(String message, Throwable cause) {
        super(message, cause, "VALIDATION_FAILED");
    }

    public ValidationException(String message, String errorCode) {
        super(message, errorCode);
    }

    public ValidationException(String message, String errorCode, Object... errorArgs) {
        super(message, errorCode, errorArgs);
    }
}
