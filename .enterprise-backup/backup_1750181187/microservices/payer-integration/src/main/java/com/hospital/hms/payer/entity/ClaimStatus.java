package com.hospital.hms.payer.entity;

/**
 * Enumeration for claim status
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
public enum ClaimStatus {
    DRAFT,                // Claim being prepared
    READY_FOR_SUBMISSION, // Ready to submit
    SUBMITTED,            // Submitted to payer
    ACKNOWLEDGED,         // Acknowledged by payer
    UNDER_REVIEW,         // Under payer review
    PENDING_INFO,         // Pending additional information
    SUSPENDED,            // Suspended for review
    PAID,                // Fully paid
    PARTIALLY_PAID,       // Partially paid
    DENIED,              // Denied by payer
    REJECTED,            // Rejected due to errors
    VOIDED,              // Voided claim
    CANCELLED,           // Cancelled claim
    APPEALED,            // Under appeal
    APPEAL_APPROVED,     // Appeal approved
    APPEAL_DENIED,       // Appeal denied
    CORRECTED,           // Corrected and resubmitted
    DUPLICATE,           // Duplicate claim
    EXPIRED,             // Claim expired
    CLOSED               // Claim closed
}
