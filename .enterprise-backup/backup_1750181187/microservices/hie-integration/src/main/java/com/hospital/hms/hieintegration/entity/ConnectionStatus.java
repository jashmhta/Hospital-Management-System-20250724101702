package com.hospital.hms.hieintegration.entity;

/**
 * Connection Status enumeration for HIE connection test results
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
public enum ConnectionStatus {
    CONNECTED,
    DISCONNECTED,
    TIMEOUT,
    ERROR,
    AUTHENTICATION_FAILED,
    SSL_ERROR,
    NETWORK_ERROR,
    SERVICE_UNAVAILABLE,
    MAINTENANCE
}
