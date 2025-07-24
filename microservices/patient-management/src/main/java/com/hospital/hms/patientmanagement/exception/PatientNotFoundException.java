package com.hospital.hms.patientmanagement.exception;

import java.util.UUID;

/**
 * Exception thrown when a patient is not found
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
public class PatientNotFoundException extends RuntimeException {

    private final String searchCriteria;
    private final Object searchValue;

    public PatientNotFoundException(String message) {
        super(message);
        this.searchCriteria = "unknown";
        this.searchValue = null;
    }

    public PatientNotFoundException(String searchCriteria, Object searchValue) {
        super(String.format("Patient not found with %s: %s", searchCriteria, searchValue));
        this.searchCriteria = searchCriteria;
        this.searchValue = searchValue;
    }

    public PatientNotFoundException(UUID patientId) {
        super(String.format("Patient not found with ID: %s", patientId));
        this.searchCriteria = "ID";
        this.searchValue = patientId;
    }

    public PatientNotFoundException(String searchCriteria, Object searchValue, Throwable cause) {
        super(String.format("Patient not found with %s: %s", searchCriteria, searchValue), cause);
        this.searchCriteria = searchCriteria;
        this.searchValue = searchValue;
    }

    public String getSearchCriteria() {
        return searchCriteria;
    }

    public Object getSearchValue() {
        return searchValue;
    }
}
