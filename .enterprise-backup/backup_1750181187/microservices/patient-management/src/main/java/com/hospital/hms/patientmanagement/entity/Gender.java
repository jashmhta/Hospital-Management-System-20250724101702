package com.hospital.hms.patientmanagement.entity;

/**
 * Gender enumeration based on FHIR R4 Administrative Gender value set
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
public enum Gender {
    MALE("male", "Male"),
    FEMALE("female", "Female"),
    OTHER("other", "Other"),
    UNKNOWN("unknown", "Unknown");

    private final String code;
    private final String display;

    Gender(String code, String display) {
        this.code = code;
        this.display = display;
    }

    public String getCode() {
        return code;
    }

    public String getDisplay() {
        return display;
    }

    public static Gender fromCode(String code) {
        for (Gender gender : Gender.values()) {
            if (gender.code.equals(code)) {
                return gender;
            }
        }
        throw new IllegalArgumentException("Unknown gender code: " + code);
    }
}
