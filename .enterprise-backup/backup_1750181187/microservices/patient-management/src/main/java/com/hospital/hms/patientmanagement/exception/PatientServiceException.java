package com.hospital.hms.patientmanagement.exception;

/**
 * General service exception for patient management operations
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
public class PatientServiceException extends RuntimeException {

    private final String operation;
    private final String errorCode;

    public PatientServiceException(String message) {
        super(message);
        this.operation = "unknown";
        this.errorCode = "PATIENT_SERVICE_ERROR";
    }

    public PatientServiceException(String operation, String message) {
        super(message);
        this.operation = operation;
        this.errorCode = "PATIENT_SERVICE_ERROR";
    }

    public PatientServiceException(String operation, String message, String errorCode) {
        super(message);
        this.operation = operation;
        this.errorCode = errorCode;
    }

    public PatientServiceException(String message, Throwable cause) {
        super(message, cause);
        this.operation = "unknown";
        this.errorCode = "PATIENT_SERVICE_ERROR";
    }

    public PatientServiceException(String operation, String message, Throwable cause) {
        super(message, cause);
        this.operation = operation;
        this.errorCode = "PATIENT_SERVICE_ERROR";
    }

    public PatientServiceException(String operation, String message, String errorCode, Throwable cause) {
        super(message, cause);
        this.operation = operation;
        this.errorCode = errorCode;
    }

    public String getOperation() {
        return operation;
    }

    public String getErrorCode() {
        return errorCode;
    }
}
