package com.hospital.hms.appointmentscheduling.exception;

import java.util.UUID;

/**
 * Exception thrown when an appointment is not found
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
public class AppointmentNotFoundException extends RuntimeException {

    private final String searchCriteria;
    private final Object searchValue;

    public AppointmentNotFoundException(String message) {
        super(message);
        this.searchCriteria = "unknown";
        this.searchValue = null;
    }

    public AppointmentNotFoundException(String searchCriteria, Object searchValue) {
        super(String.format("Appointment not found with %s: %s", searchCriteria, searchValue));
        this.searchCriteria = searchCriteria;
        this.searchValue = searchValue;
    }

    public AppointmentNotFoundException(UUID appointmentId) {
        super(String.format("Appointment not found with ID: %s", appointmentId));
        this.searchCriteria = "ID";
        this.searchValue = appointmentId;
    }

    public String getSearchCriteria() {
        return searchCriteria;
    }

    public Object getSearchValue() {
        return searchValue;
    }
}
