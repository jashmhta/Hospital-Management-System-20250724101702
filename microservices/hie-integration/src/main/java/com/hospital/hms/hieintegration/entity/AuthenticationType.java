package com.hospital.hms.hieintegration.entity;

/**
 * Authentication Type enumeration for HIE connection authentication methods
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
public enum AuthenticationType {
    NONE,
    BASIC_AUTH,
    OAUTH2,
    JWT,
    API_KEY,
    CERTIFICATE,
    SAML,
    MUTUAL_TLS,
    CUSTOM
}
