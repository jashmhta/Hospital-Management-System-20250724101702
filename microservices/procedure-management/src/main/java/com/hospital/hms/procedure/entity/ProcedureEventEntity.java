package com.hospital.hms.procedure.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;

/**
 * Procedure Event Entity
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Entity
@Table(name = "procedure_events", indexes = {
    @Index(name = "idx_proc_event_procedure_id", columnList = "procedure_id"),
    @Index(name = "idx_proc_event_type", columnList = "event_type"),
    @Index(name = "idx_proc_event_time", columnList = "event_time")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProcedureEventEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "event_id")
    private String eventId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "procedure_id", nullable = false)
    private ProcedureEntity procedure;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "event_type", nullable = false)
    private EventType eventType;

    @NotBlank
    @Column(name = "event_description", nullable = false)
    private String eventDescription;

    @Column(name = "event_details", columnDefinition = "TEXT")
    private String eventDetails; // JSON format

    @CreationTimestamp
    @Column(name = "event_time", nullable = false)
    private LocalDateTime eventTime;

    @Column(name = "performed_by")
    private String performedBy;

    @Column(name = "severity")
    private String severity; // LOW, MEDIUM, HIGH, CRITICAL

    @Column(name = "location")
    private String location;

    @Column(name = "patient_condition")
    private String patientCondition;

    @Column(name = "vital_signs", columnDefinition = "TEXT")
    private String vitalSigns; // JSON format

    @Column(name = "medication_administered", columnDefinition = "TEXT")
    private String medicationAdministered; // JSON format

    @Column(name = "equipment_used", columnDefinition = "TEXT")
    private String equipmentUsed; // JSON format

    @Column(name = "complications_noted")
    private String complicationsNoted;

    @Column(name = "next_action_required")
    private String nextActionRequired;

    @Column(name = "notification_sent")
    @Builder.Default
    private Boolean notificationSent = false;

    public enum EventType {
        SCHEDULED,
        CONFIRMED,
        STARTED,
        PAUSED,
        RESUMED,
        COMPLETED,
        CANCELLED,
        DELAYED,
        RESCHEDULED,
        CONSENT_OBTAINED,
        PRE_PROCEDURE_CHECK,
        ANESTHESIA_START,
        ANESTHESIA_END,
        INCISION,
        CLOSURE,
        POST_PROCEDURE_CHECK,
        RECOVERY_START,
        RECOVERY_END,
        DISCHARGE,
        COMPLICATION,
        MEDICATION_GIVEN,
        EQUIPMENT_CHANGE,
        STAFF_CHANGE,
        PATIENT_RESPONSE,
        VITAL_SIGNS_CHECK
    }
}
