package com.hospital.hms.procedure.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Procedure Entity
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Entity
@Table(name = "procedures", indexes = {
    @Index(name = "idx_procedure_patient_id", columnList = "patient_id"),
    @Index(name = "idx_procedure_status", columnList = "status"),
    @Index(name = "idx_procedure_scheduled_time", columnList = "scheduled_date_time"),
    @Index(name = "idx_procedure_type", columnList = "procedure_type")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProcedureEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "procedure_id")
    private String procedureId;

    @NotBlank
    @Column(name = "patient_id", nullable = false)
    private String patientId;

    @NotBlank
    @Column(name = "procedure_type", nullable = false)
    private String procedureType;

    @NotBlank
    @Column(name = "procedure_name", nullable = false)
    private String procedureName;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ProcedureStatus status;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "priority", nullable = false)
    private ProcedurePriority priority;

    @Column(name = "scheduled_date_time")
    private LocalDateTime scheduledDateTime;

    @Column(name = "actual_start_time")
    private LocalDateTime actualStartTime;

    @Column(name = "actual_end_time")
    private LocalDateTime actualEndTime;

    @Column(name = "estimated_duration_minutes")
    private Integer estimatedDurationMinutes;

    @Column(name = "actual_duration_minutes")
    private Integer actualDurationMinutes;

    @Column(name = "assigned_room")
    private String assignedRoom;

    @Column(name = "primary_physician")
    private String primaryPhysician;

    @Column(name = "assigned_staff", columnDefinition = "TEXT")
    private String assignedStaff; // JSON format

    @Column(name = "required_equipment", columnDefinition = "TEXT")
    private String requiredEquipment; // JSON format

    @Column(name = "pre_procedure_notes", columnDefinition = "TEXT")
    private String preProcedureNotes;

    @Column(name = "post_procedure_notes", columnDefinition = "TEXT")
    private String postProcedureNotes;

    @Column(name = "complications", columnDefinition = "TEXT")
    private String complications;

    @Column(name = "consent_obtained")
    @Builder.Default
    private Boolean consentObtained = false;

    @Column(name = "consent_date_time")
    private LocalDateTime consentDateTime;

    @Column(name = "department")
    private String department;

    @Column(name = "specialty")
    private String specialty;

    @Column(name = "urgent")
    @Builder.Default
    private Boolean urgent = false;

    @Column(name = "cancellation_reason")
    private String cancellationReason;

    @Column(name = "rescheduled_from")
    private String rescheduledFrom;

    @Column(name = "workflow_id")
    private String workflowId;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "created_by")
    private String createdBy;

    @Column(name = "updated_by")
    private String updatedBy;

    @OneToMany(mappedBy = "procedure", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ProcedureResourceEntity> resources;

    @OneToMany(mappedBy = "procedure", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ProcedureEventEntity> events;

    public enum ProcedureStatus {
        SCHEDULED,
        CONFIRMED,
        IN_PROGRESS,
        COMPLETED,
        CANCELLED,
        POSTPONED,
        NO_SHOW,
        WAITING,
        PREP,
        RECOVERY
    }

    public enum ProcedurePriority {
        ROUTINE(4),
        SEMI_URGENT(3),
        URGENT(2),
        EMERGENCY(1);

        private final int level;

        ProcedurePriority(int level) {
            this.level = level;
        }

        public int getLevel() {
            return level;
        }
    }
}
