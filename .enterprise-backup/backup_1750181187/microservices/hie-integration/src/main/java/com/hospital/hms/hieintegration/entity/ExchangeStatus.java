package com.hospital.hms.hieintegration.entity;

/**
 * Exchange Status enumeration for data exchange transaction status
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
public enum ExchangeStatus {
    PENDING,
    IN_PROGRESS,
    COMPLETED,
    FAILED,
    CANCELLED,
    TIMEOUT,
    RETRY,
    PARTIAL_SUCCESS
}
