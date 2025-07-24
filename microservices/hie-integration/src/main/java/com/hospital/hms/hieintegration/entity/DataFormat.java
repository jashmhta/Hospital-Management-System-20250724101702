package com.hospital.hms.hieintegration.entity;

/**
 * Data Format enumeration for exchange data formats
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
public enum DataFormat {
    FHIR_R4,
    FHIR_R5,
    HL7_V2,
    HL7_V3,
    CDA,
    JSON,
    XML,
    CSV,
    DICOM,
    PDF,
    CUSTOM
}
