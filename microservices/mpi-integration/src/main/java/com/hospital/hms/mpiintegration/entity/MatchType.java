package com.hospital.hms.mpiintegration.entity;

/**
 * Match Type enumeration for identity matching algorithms
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
public enum MatchType {
    EXACT,
    PROBABILISTIC,
    DETERMINISTIC,
    FUZZY,
    PHONETIC,
    MANUAL,
    RULE_BASED,
    MACHINE_LEARNING
}
