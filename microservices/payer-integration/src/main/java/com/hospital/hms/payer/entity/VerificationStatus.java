package com.hospital.hms.payer.entity;

/**
 * Enumeration for verification status
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
public enum VerificationStatus {
    PENDING,      // Verification request pending
    IN_PROGRESS,  // Verification in progress
    VERIFIED,     // Successfully verified
    FAILED,       // Verification failed
    ERROR,        // Error during verification
    TIMEOUT,      // Verification timeout
    REJECTED,     // Verification rejected
    EXPIRED       // Verification expired
}
