package com.hospital.hms.mpiintegration.entity;

/**
 * Verification Status enumeration for patient identity verification
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
public enum VerificationStatus {
    UNVERIFIED,
    VERIFIED,
    PARTIALLY_VERIFIED,
    VERIFICATION_REQUIRED,
    VERIFICATION_FAILED,
    AUTO_VERIFIED,
    MANUALLY_VERIFIED
}
