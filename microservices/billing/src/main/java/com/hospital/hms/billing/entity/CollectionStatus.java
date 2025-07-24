package com.hospital.hms.billing.entity;

/**
 * Collection Status enumeration
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
public enum CollectionStatus {
    CURRENT,
    EARLY_OUT,
    FIRST_NOTICE,
    SECOND_NOTICE,
    FINAL_NOTICE,
    COLLECTIONS_AGENCY,
    LEGAL_ACTION,
    PAYMENT_PLAN,
    BANKRUPTCY,
    UNCOLLECTIBLE,
    SETTLED,
    CLOSED
}
