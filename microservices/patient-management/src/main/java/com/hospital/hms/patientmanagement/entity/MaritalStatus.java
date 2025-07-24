package com.hospital.hms.patientmanagement.entity;

/**
 * Marital Status enumeration based on FHIR R4 Marital Status value set
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
public enum MaritalStatus {
    UNMARRIED("U", "Unmarried"),
    MARRIED("M", "Married"),
    DIVORCED("D", "Divorced"),
    SEPARATED("L", "Separated"),
    WIDOWED("W", "Widowed"),
    COMMON_LAW("T", "Common Law"),
    UNKNOWN("UNK", "Unknown");

    private final String code;
    private final String display;

    MaritalStatus(String code, String display) {
        this.code = code;
        this.display = display;
    }

    public String getCode() {
        return code;
    }

    public String getDisplay() {
        return display;
    }

    public static MaritalStatus fromCode(String code) {
        for (MaritalStatus status : MaritalStatus.values()) {
            if (status.code.equals(code)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Unknown marital status code: " + code);
    }
}
