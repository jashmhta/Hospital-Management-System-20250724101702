package com.hospital.hms.billing.entity;

/**
 * Invoice Status enumeration
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
public enum InvoiceStatus {
    DRAFT, PENDING, SENT, PAID, OVERDUE, CANCELLED, REFUNDED, DISPUTED, PARTIALLY_PAID
}
