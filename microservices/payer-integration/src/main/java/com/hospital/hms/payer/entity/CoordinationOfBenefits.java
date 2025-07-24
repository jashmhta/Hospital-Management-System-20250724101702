package com.hospital.hms.payer.entity;

/**
 * Enumeration for coordination of benefits
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
public enum CoordinationOfBenefits {
    PRIMARY,          // Primary payer
    SECONDARY,        // Secondary payer
    TERTIARY,         // Tertiary payer
    WORKERS_COMP,     // Workers compensation
    AUTO_INSURANCE,   // Auto insurance
    LIABILITY,        // Liability insurance
    OTHER,            // Other coordination
    UNKNOWN           // Unknown coordination
}
