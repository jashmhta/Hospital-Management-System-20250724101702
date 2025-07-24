package com.hospital.hms.patientmanagement.entity;

/**
 * Blood Type enumeration
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
public enum BloodType {
    A_POSITIVE("A+", "A Positive"),
    A_NEGATIVE("A-", "A Negative"),
    B_POSITIVE("B+", "B Positive"),
    B_NEGATIVE("B-", "B Negative"),
    AB_POSITIVE("AB+", "AB Positive"),
    AB_NEGATIVE("AB-", "AB Negative"),
    O_POSITIVE("O+", "O Positive"),
    O_NEGATIVE("O-", "O Negative"),
    UNKNOWN("UNK", "Unknown");

    private final String code;
    private final String display;

    BloodType(String code, String display) {
        this.code = code;
        this.display = display;
    }

    public String getCode() {
        return code;
    }

    public String getDisplay() {
        return display;
    }

    public static BloodType fromCode(String code) {
        for (BloodType bloodType : BloodType.values()) {
            if (bloodType.code.equals(code)) {
                return bloodType;
            }
        }
        throw new IllegalArgumentException("Unknown blood type code: " + code);
    }
}
