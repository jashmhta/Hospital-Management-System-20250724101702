package com.hospital.hms.appointmentscheduling.entity;

/**
 * Collection of enumerations for Appointment entities
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */

/**
 * Visit Type enumeration
 */
enum VisitType {
    IN_PERSON("in-person", "In Person"),
    TELEHEALTH("telehealth", "Telehealth"),
    PHONE("phone", "Phone Call"),
    VIDEO("video", "Video Call"),
    HOME_VISIT("home-visit", "Home Visit"),
    MOBILE_CLINIC("mobile-clinic", "Mobile Clinic");

    private final String code;
    private final String display;

    VisitType(String code, String display) {
        this.code = code;
        this.display = display;
    }

    public String getCode() { return code; }
    public String getDisplay() { return display; }
}

/**
 * Appointment Priority enumeration
 */
enum AppointmentPriority {
    ROUTINE("routine", "Routine", 1),
    URGENT("urgent", "Urgent", 2),
    ASAP("asap", "As Soon As Possible", 3),
    STAT("stat", "Stat/Immediate", 4),
    EMERGENCY("emergency", "Emergency", 5);

    private final String code;
    private final String display;
    private final int level;

    AppointmentPriority(String code, String display, int level) {
        this.code = code;
        this.display = display;
        this.level = level;
    }

    public String getCode() { return code; }
    public String getDisplay() { return display; }
    public int getLevel() { return level; }
}

/**
 * Booking Source enumeration
 */
enum BookingSource {
    PATIENT_PORTAL("patient-portal", "Patient Portal"),
    PHONE("phone", "Phone Call"),
    WALK_IN("walk-in", "Walk-in"),
    REFERRAL("referral", "Provider Referral"),
    EMERGENCY("emergency", "Emergency Department"),
    ONLINE("online", "Online Booking"),
    MOBILE_APP("mobile-app", "Mobile Application"),
    KIOSK("kiosk", "Self-Service Kiosk"),
    STAFF("staff", "Staff/Administrative"),
    AUTOMATED("automated", "Automated System"),
    THIRD_PARTY("third-party", "Third Party System");

    private final String code;
    private final String display;

    BookingSource(String code, String display) {
        this.code = code;
        this.display = display;
    }

    public String getCode() { return code; }
    public String getDisplay() { return display; }
}

/**
 * Cancellation Reason enumeration
 */
enum CancellationReason {
    PATIENT_REQUEST("patient-request", "Patient Request"),
    PROVIDER_UNAVAILABLE("provider-unavailable", "Provider Unavailable"),
    MEDICAL_EMERGENCY("medical-emergency", "Medical Emergency"),
    WEATHER("weather", "Weather Conditions"),
    FACILITY_CLOSURE("facility-closure", "Facility Closure"),
    EQUIPMENT_FAILURE("equipment-failure", "Equipment Failure"),
    SCHEDULING_ERROR("scheduling-error", "Scheduling Error"),
    INSURANCE_ISSUE("insurance-issue", "Insurance Issue"),
    PATIENT_ILLNESS("patient-illness", "Patient Illness"),
    TRANSPORTATION("transportation", "Transportation Issue"),
    PERSONAL_REASONS("personal-reasons", "Personal Reasons"),
    DUPLICATE_BOOKING("duplicate-booking", "Duplicate Booking"),
    RESCHEDULED("rescheduled", "Rescheduled"),
    NO_LONGER_NEEDED("no-longer-needed", "No Longer Needed"),
    PROVIDER_ILLNESS("provider-illness", "Provider Illness"),
    SYSTEM_ERROR("system-error", "System Error"),
    OTHER("other", "Other");

    private final String code;
    private final String display;

    CancellationReason(String code, String display) {
        this.code = code;
        this.display = display;
    }

    public String getCode() { return code; }
    public String getDisplay() { return display; }
}

/**
 * Participant Type enumeration
 */
enum ParticipantType {
    PATIENT("patient", "Patient"),
    PRACTITIONER("practitioner", "Practitioner"),
    RELATED_PERSON("related-person", "Related Person"),
    DEVICE("device", "Device"),
    HEALTHCARE_SERVICE("healthcare-service", "Healthcare Service"),
    LOCATION("location", "Location");

    private final String code;
    private final String display;

    ParticipantType(String code, String display) {
        this.code = code;
        this.display = display;
    }

    public String getCode() { return code; }
    public String getDisplay() { return display; }
}

/**
 * Participant Status enumeration
 */
enum ParticipantStatus {
    ACCEPTED("accepted", "Accepted"),
    DECLINED("declined", "Declined"),
    TENTATIVE("tentative", "Tentative"),
    NEEDS_ACTION("needs-action", "Needs Action");

    private final String code;
    private final String display;

    ParticipantStatus(String code, String display) {
        this.code = code;
        this.display = display;
    }

    public String getCode() { return code; }
    public String getDisplay() { return display; }
}

/**
 * Resource Type enumeration
 */
enum ResourceType {
    ROOM("room", "Room"),
    EQUIPMENT("equipment", "Equipment"),
    VEHICLE("vehicle", "Vehicle"),
    BED("bed", "Bed"),
    OPERATING_ROOM("operating-room", "Operating Room"),
    EXAMINATION_ROOM("examination-room", "Examination Room"),
    PROCEDURE_ROOM("procedure-room", "Procedure Room"),
    DIAGNOSTIC_EQUIPMENT("diagnostic-equipment", "Diagnostic Equipment"),
    THERAPEUTIC_EQUIPMENT("therapeutic-equipment", "Therapeutic Equipment"),
    AMBULANCE("ambulance", "Ambulance"),
    WHEELCHAIR("wheelchair", "Wheelchair"),
    STRETCHER("stretcher", "Stretcher"),
    COMPUTER("computer", "Computer"),
    PHONE("phone", "Phone"),
    OTHER("other", "Other");

    private final String code;
    private final String display;

    ResourceType(String code, String display) {
        this.code = code;
        this.display = display;
    }

    public String getCode() { return code; }
    public String getDisplay() { return display; }
}

/**
 * Resource Status enumeration
 */
enum ResourceStatus {
    AVAILABLE("available", "Available"),
    RESERVED("reserved", "Reserved"),
    IN_USE("in-use", "In Use"),
    MAINTENANCE("maintenance", "Under Maintenance"),
    OUT_OF_SERVICE("out-of-service", "Out of Service"),
    CLEANING("cleaning", "Being Cleaned"),
    SETUP("setup", "Being Setup");

    private final String code;
    private final String display;

    ResourceStatus(String code, String display) {
        this.code = code;
        this.display = display;
    }

    public String getCode() { return code; }
    public String getDisplay() { return display; }
}
