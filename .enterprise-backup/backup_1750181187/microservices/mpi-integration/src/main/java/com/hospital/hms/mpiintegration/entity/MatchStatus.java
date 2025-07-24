package com.hospital.hms.mpiintegration.entity;

/**
 * Match Status enumeration for identity matching
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
public enum MatchStatus {
    PENDING,
    CONFIRMED,
    REJECTED,
    UNDER_REVIEW,
    AUTO_CONFIRMED,
    POSSIBLE_MATCH,
    NO_MATCH
}
