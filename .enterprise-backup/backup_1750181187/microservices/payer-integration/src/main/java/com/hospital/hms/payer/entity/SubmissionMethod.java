package com.hospital.hms.payer.entity;

/**
 * Enumeration for submission methods
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
public enum SubmissionMethod {
    ELECTRONIC_EDI,      // Electronic Data Interchange
    PAPER,               // Paper submission
    CLEARINGHOUSE,       // Through clearinghouse
    DIRECT_PAYER,        // Direct to payer
    PORTAL,              // Payer portal
    EMAIL,               // Email submission
    FAX,                 // Fax submission
    API,                 // API submission
    BATCH_FILE,          // Batch file processing
    REAL_TIME            // Real-time processing
}
