package com.hospital.hms.payer.entity;

/**
 * Enumeration for claim types
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
public enum ClaimType {
    PROFESSIONAL,      // CMS-1500
    INSTITUTIONAL,     // UB-04
    DENTAL,           // ADA Dental Claim Form
    PHARMACY,         // Pharmacy Claims
    VISION,           // Vision Claims
    DURABLE_MEDICAL_EQUIPMENT, // DME Claims
    AMBULANCE,        // Ambulance Claims
    HOME_HEALTH,      // Home Health Claims
    HOSPICE,          // Hospice Claims
    CHIROPRACTIC,     // Chiropractic Claims
    MENTAL_HEALTH,    // Mental Health Claims
    SUBSTANCE_ABUSE,  // Substance Abuse Claims
    EMERGENCY,        // Emergency Claims
    OUTPATIENT,       // Outpatient Claims
    INPATIENT,        // Inpatient Claims
    PREVENTIVE,       // Preventive Care Claims
    MATERNITY,        // Maternity Claims
    PEDIATRIC,        // Pediatric Claims
    WORKERS_COMP,     // Workers Compensation
    AUTO_INSURANCE,   // Auto Insurance Claims
    OTHER             // Other Types
}
