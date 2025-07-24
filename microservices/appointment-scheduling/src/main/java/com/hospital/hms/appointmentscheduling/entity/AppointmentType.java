package com.hospital.hms.appointmentscheduling.entity;

/**
 * Appointment Type enumeration
 * 
 * Defines the different types of healthcare appointments.
 * Based on healthcare industry standards and FHIR R4 specifications.
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
public enum AppointmentType {
    CONSULTATION("consultation", "Consultation", 30),
    FOLLOW_UP("follow_up", "Follow-up", 20),
    EMERGENCY("emergency", "Emergency", 15),
    ROUTINE_CHECKUP("routine_checkup", "Routine Checkup", 30),
    PREVENTIVE_CARE("preventive_care", "Preventive Care", 45),
    DIAGNOSTIC("diagnostic", "Diagnostic", 60),
    PROCEDURE("procedure", "Procedure", 120),
    SURGERY("surgery", "Surgery", 240),
    PHYSICAL_THERAPY("physical_therapy", "Physical Therapy", 45),
    MENTAL_HEALTH("mental_health", "Mental Health", 50),
    TELEHEALTH("telehealth", "Telehealth", 25),
    VACCINATION("vaccination", "Vaccination", 15),
    LABORATORY("laboratory", "Laboratory", 30),
    IMAGING("imaging", "Imaging", 45),
    SPECIALIST_REFERRAL("specialist_referral", "Specialist Referral", 40),
    SECOND_OPINION("second_opinion", "Second Opinion", 60),
    POST_OPERATIVE("post_operative", "Post-operative", 30),
    WELLNESS_EXAM("wellness_exam", "Wellness Exam", 45),
    CHRONIC_CARE("chronic_care", "Chronic Care Management", 35),
    PEDIATRIC("pediatric", "Pediatric", 30),
    GERIATRIC("geriatric", "Geriatric", 40),
    OBSTETRIC("obstetric", "Obstetric", 30),
    GYNECOLOGIC("gynecologic", "Gynecologic", 35),
    DENTAL("dental", "Dental", 30),
    OPHTHALMOLOGY("ophthalmology", "Ophthalmology", 30),
    DERMATOLOGY("dermatology", "Dermatology", 25),
    CARDIOLOGY("cardiology", "Cardiology", 45),
    ONCOLOGY("oncology", "Oncology", 60),
    NEUROLOGY("neurology", "Neurology", 45),
    ORTHOPEDICS("orthopedics", "Orthopedics", 30),
    ENDOCRINOLOGY("endocrinology", "Endocrinology", 40),
    PSYCHIATRY("psychiatry", "Psychiatry", 60),
    UROLOGY("urology", "Urology", 30),
    GASTROENTEROLOGY("gastroenterology", "Gastroenterology", 45),
    PULMONOLOGY("pulmonology", "Pulmonology", 40),
    NEPHROLOGY("nephrology", "Nephrology", 45),
    RHEUMATOLOGY("rheumatology", "Rheumatology", 45),
    ALLERGY_IMMUNOLOGY("allergy_immunology", "Allergy & Immunology", 30),
    INFECTIOUS_DISEASE("infectious_disease", "Infectious Disease", 45),
    EMERGENCY_MEDICINE("emergency_medicine", "Emergency Medicine", 30),
    FAMILY_MEDICINE("family_medicine", "Family Medicine", 30),
    INTERNAL_MEDICINE("internal_medicine", "Internal Medicine", 40),
    PEDIATRIC_SURGERY("pediatric_surgery", "Pediatric Surgery", 60),
    PLASTIC_SURGERY("plastic_surgery", "Plastic Surgery", 45),
    ANESTHESIOLOGY("anesthesiology", "Anesthesiology", 30),
    RADIOLOGY("radiology", "Radiology", 30),
    PATHOLOGY("pathology", "Pathology", 30),
    REHABILITATION("rehabilitation", "Rehabilitation", 45),
    PAIN_MANAGEMENT("pain_management", "Pain Management", 40),
    OCCUPATIONAL_THERAPY("occupational_therapy", "Occupational Therapy", 45),
    SPEECH_THERAPY("speech_therapy", "Speech Therapy", 45),
    NUTRITION_COUNSELING("nutrition_counseling", "Nutrition Counseling", 30),
    SOCIAL_WORK("social_work", "Social Work", 45),
    CASE_MANAGEMENT("case_management", "Case Management", 30),
    OTHER("other", "Other", 30);

    private final String code;
    private final String display;
    private final int defaultDurationMinutes;

    AppointmentType(String code, String display, int defaultDurationMinutes) {
        this.code = code;
        this.display = display;
        this.defaultDurationMinutes = defaultDurationMinutes;
    }

    public String getCode() {
        return code;
    }

    public String getDisplay() {
        return display;
    }

    public int getDefaultDurationMinutes() {
        return defaultDurationMinutes;
    }

    public static AppointmentType fromCode(String code) {
        for (AppointmentType type : AppointmentType.values()) {
            if (type.code.equals(code)) {
                return type;
            }
        }
        throw new IllegalArgumentException("Unknown appointment type code: " + code);
    }

    /**
     * Check if appointment type is urgent/high priority
     */
    public boolean isUrgent() {
        return this == EMERGENCY || this == POST_OPERATIVE || this == ONCOLOGY;
    }

    /**
     * Check if appointment type supports telehealth
     */
    public boolean supportsTelehealth() {
        return this == CONSULTATION || this == FOLLOW_UP || this == MENTAL_HEALTH || 
               this == TELEHEALTH || this == CHRONIC_CARE || this == PSYCHIATRY ||
               this == NUTRITION_COUNSELING || this == CASE_MANAGEMENT;
    }

    /**
     * Check if appointment type requires special preparation
     */
    public boolean requiresPreparation() {
        return this == SURGERY || this == PROCEDURE || this == DIAGNOSTIC || 
               this == IMAGING || this == LABORATORY;
    }
}
