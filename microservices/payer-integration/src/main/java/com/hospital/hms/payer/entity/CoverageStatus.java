package com.hospital.hms.payer.entity;

/**
 * Enumeration for coverage status
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
public enum CoverageStatus {
    ACTIVE,           // Coverage is active
    INACTIVE,         // Coverage is inactive
    SUSPENDED,        // Coverage is suspended
    TERMINATED,       // Coverage is terminated
    PENDING,          // Coverage is pending
    CANCELLED,        // Coverage is cancelled
    LAPSED,           // Coverage has lapsed
    CONVERTED,        // Coverage has been converted
    UNKNOWN           // Coverage status unknown
}
