package com.hospital.hms.patientmanagement.exception;

/**
 * Exception thrown when attempting to create a duplicate patient
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
public class DuplicatePatientException extends RuntimeException {

    private final String duplicateField;
    private final Object duplicateValue;

    public DuplicatePatientException(String message) {
        super(message);
        this.duplicateField = "unknown";
        this.duplicateValue = null;
    }

    public DuplicatePatientException(String duplicateField, Object duplicateValue) {
        super(String.format("Patient already exists with %s: %s", duplicateField, duplicateValue));
        this.duplicateField = duplicateField;
        this.duplicateValue = duplicateValue;
    }

    public DuplicatePatientException(String duplicateField, Object duplicateValue, Throwable cause) {
        super(String.format("Patient already exists with %s: %s", duplicateField, duplicateValue), cause);
        this.duplicateField = duplicateField;
        this.duplicateValue = duplicateValue;
    }

    public String getDuplicateField() {
        return duplicateField;
    }

    public Object getDuplicateValue() {
        return duplicateValue;
    }
}
