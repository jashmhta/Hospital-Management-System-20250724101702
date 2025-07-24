package com.hospital.hms.patientmanagement.event;

/**
 * Patient Event Types for inter-service communication
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
public enum PatientEventType {
    PATIENT_CREATED,
    PATIENT_UPDATED,
    PATIENT_STATUS_CHANGED,
    PATIENT_ADMITTED,
    PATIENT_DISCHARGED,
    PATIENT_EMERGENCY_CONTACT_UPDATED,
    PATIENT_INSURANCE_UPDATED,
    PATIENT_DEMOGRAPHICS_UPDATED,
    PATIENT_MERGED,
    PATIENT_ARCHIVED,
    PATIENT_CONTACT_UPDATED
}
