package com.hospital.hms.hieintegration.entity;

/**
 * Endpoint Type enumeration for HIE connection endpoints
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
public enum EndpointType {
    FHIR,
    HL7,
    REST,
    SOAP,
    WEBSOCKET,
    FTP,
    SFTP,
    EMAIL,
    DATABASE,
    FILE_SHARE
}
