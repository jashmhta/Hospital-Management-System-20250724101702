package com.hospital.hms.patientmanagement.entity;

/**
 * Communication Preference enumeration
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
public enum CommunicationPreference {
    EMAIL("email", "Email"),
    PHONE("phone", "Phone"),
    SMS("sms", "SMS/Text"),
    MAIL("mail", "Postal Mail"),
    PORTAL("portal", "Patient Portal"),
    NONE("none", "No Communication");

    private final String code;
    private final String display;

    CommunicationPreference(String code, String display) {
        this.code = code;
        this.display = display;
    }

    public String getCode() {
        return code;
    }

    public String getDisplay() {
        return display;
    }

    public static CommunicationPreference fromCode(String code) {
        for (CommunicationPreference preference : CommunicationPreference.values()) {
            if (preference.code.equals(code)) {
                return preference;
            }
        }
        throw new IllegalArgumentException("Unknown communication preference code: " + code);
    }
}
