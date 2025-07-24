package com.hospital.hms.patientmanagement.exception;

import java.util.List;
import java.util.Map;

/**
 * Exception thrown when patient data validation fails
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
public class PatientValidationException extends RuntimeException {

    private final Map<String, List<String>> validationErrors;

    public PatientValidationException(String message) {
        super(message);
        this.validationErrors = null;
    }

    public PatientValidationException(String message, Map<String, List<String>> validationErrors) {
        super(message);
        this.validationErrors = validationErrors;
    }

    public PatientValidationException(String message, Throwable cause) {
        super(message, cause);
        this.validationErrors = null;
    }

    public PatientValidationException(String message, Map<String, List<String>> validationErrors, Throwable cause) {
        super(message, cause);
        this.validationErrors = validationErrors;
    }

    public Map<String, List<String>> getValidationErrors() {
        return validationErrors;
    }

    public boolean hasValidationErrors() {
        return validationErrors != null && !validationErrors.isEmpty();
    }
}
