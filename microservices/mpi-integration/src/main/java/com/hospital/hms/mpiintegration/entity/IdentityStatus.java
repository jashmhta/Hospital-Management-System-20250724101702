package com.hospital.hms.mpiintegration.entity;

/**
 * Identity Status enumeration for patient identity management
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
public enum IdentityStatus {
    ACTIVE,
    INACTIVE,
    MERGED,
    SUPERSEDED,
    DUPLICATE,
    ERROR,
    PENDING_VERIFICATION,
    ARCHIVED
}
