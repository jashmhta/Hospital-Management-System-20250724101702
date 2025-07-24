package com.hospital.hms.procedure.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Surgical Procedure Entity
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Entity
@Table(name = "surgical_procedures", indexes = {
    @Index(name = "idx_patient_id", columnList = "patientId"),
    @Index(name = "idx_scheduled_date", columnList = "scheduledDateTime"),
    @Index(name = "idx_procedure_status", columnList = "procedureStatus"),
    @Index(name = "idx_operating_room", columnList = "operatingRoomId"),
    @Index(name = "idx_primary_surgeon", columnList = "primarySurgeonId")
})
@EntityListeners(AuditingEntityListener.class)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SurgicalProcedure {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotNull
    @Column(name = "patient_id", nullable = false)
    private UUID patientId;

    @Size(max = 200)
    @Column(name = "patient_name")
    private String patientName;

    @Size(max = 50)
    @Column(name = "procedure_code")
    private String procedureCode;

    @Size(max = 500)
    @Column(name = "procedure_name")
    private String procedureName;

    @Enumerated(EnumType.STRING)
    @Column(name = "procedure_type")
    private ProcedureType procedureType;

    @Enumerated(EnumType.STRING)
    @Column(name = "procedure_status")
    private ProcedureStatus procedureStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "urgency_level")
    private UrgencyLevel urgencyLevel;

    @Column(name = "scheduled_date_time")
    private LocalDateTime scheduledDateTime;

    @Column(name = "estimated_duration_minutes")
    private Integer estimatedDurationMinutes;

    @Column(name = "actual_start_time")
    private LocalDateTime actualStartTime;

    @Column(name = "actual_end_time")
    private LocalDateTime actualEndTime;

    // Operating Room Information
    @Column(name = "operating_room_id")
    private UUID operatingRoomId;

    @Size(max = 100)
    @Column(name = "operating_room_name")
    private String operatingRoomName;

    // Surgical Team
    @Column(name = "primary_surgeon_id")
    private UUID primarySurgeonId;

    @Size(max = 200)
    @Column(name = "primary_surgeon_name")
    private String primarySurgeonName;

    @Column(name = "assistant_surgeon_id")
    private UUID assistantSurgeonId;

    @Size(max = 200)
    @Column(name = "assistant_surgeon_name")
    private String assistantSurgeonName;

    @Column(name = "anesthesiologist_id")
    private UUID anesthesiologistId;

    @Size(max = 200)
    @Column(name = "anesthesiologist_name")
    private String anesthesiologistName;

    @Column(name = "nursing_team", columnDefinition = "TEXT")
    private String nursingTeam;

    @Column(name = "tech_team", columnDefinition = "TEXT")
    private String techTeam;

    // Pre-operative Information
    @Size(max = 1000)
    @Column(name = "pre_op_diagnosis")
    private String preOpDiagnosis;

    @Size(max = 1000)
    @Column(name = "pre_op_notes")
    private String preOpNotes;

    @Enumerated(EnumType.STRING)
    @Column(name = "anesthesia_type")
    private AnesthesiaType anesthesiaType;

    @Column(name = "pre_op_checklist_completed")
    private Boolean preOpChecklistCompleted;

    @Column(name = "consent_obtained")
    private Boolean consentObtained;

    @Column(name = "consent_date")
    private LocalDateTime consentDate;

    // Intra-operative Information
    @Size(max = 2000)
    @Column(name = "operative_notes")
    private String operativeNotes;

    @Size(max = 1000)
    @Column(name = "procedure_details")
    private String procedureDetails;

    @Size(max = 500)
    @Column(name = "complications")
    private String complications;

    @Column(name = "blood_loss_ml")
    private Integer bloodLossMl;

    @Column(name = "fluid_intake_ml")
    private Integer fluidIntakeMl;

    @Column(name = "specimens_collected")
    private String specimensCollected;

    @Column(name = "implants_used")
    private String implantsUsed;

    // Post-operative Information
    @Size(max = 1000)
    @Column(name = "post_op_diagnosis")
    private String postOpDiagnosis;

    @Size(max = 1000)
    @Column(name = "post_op_instructions")
    private String postOpInstructions;

    @Enumerated(EnumType.STRING)
    @Column(name = "recovery_status")
    private RecoveryStatus recoveryStatus;

    @Column(name = "estimated_recovery_time_days")
    private Integer estimatedRecoveryTimeDays;

    @Column(name = "follow_up_date")
    private LocalDateTime followUpDate;

    // Equipment and Supplies
    @Column(name = "equipment_used", columnDefinition = "TEXT")
    private String equipmentUsed;

    @Column(name = "supplies_used", columnDefinition = "TEXT")
    private String suppliesUsed;

    @Column(name = "special_equipment_required")
    private String specialEquipmentRequired;

    // Cost Information
    @Column(name = "estimated_cost", precision = 12, scale = 2)
    private BigDecimal estimatedCost;

    @Column(name = "actual_cost", precision = 12, scale = 2)
    private BigDecimal actualCost;

    @Column(name = "surgeon_fee", precision = 12, scale = 2)
    private BigDecimal surgeonFee;

    @Column(name = "facility_fee", precision = 12, scale = 2)
    private BigDecimal facilityFee;

    @Column(name = "anesthesia_fee", precision = 12, scale = 2)
    private BigDecimal anesthesiaFee;

    // Quality and Safety
    @Column(name = "surgical_site_infection")
    private Boolean surgicalSiteInfection;

    @Column(name = "readmission_within_30_days")
    private Boolean readmissionWithin30Days;

    @Column(name = "mortality_risk_score")
    private Double mortalityRiskScore;

    @Column(name = "complication_risk_score")
    private Double complicationRiskScore;

    @Column(name = "quality_metrics", columnDefinition = "TEXT")
    private String qualityMetrics;

    // Documentation
    @Column(name = "pathology_report_id")
    private UUID pathologyReportId;

    @Column(name = "imaging_studies", columnDefinition = "TEXT")
    private String imagingStudies;

    @Column(name = "lab_results", columnDefinition = "TEXT")
    private String labResults;

    // FHIR Integration
    @Size(max = 100)
    @Column(name = "fhir_resource_id")
    private String fhirResourceId;

    @Size(max = 50)
    @Column(name = "fhir_resource_type")
    private String fhirResourceType;

    // Audit Information
    @CreatedBy
    @Size(max = 100)
    @Column(name = "created_by", updatable = false)
    private String createdBy;

    @CreatedDate
    @Column(name = "created_date", updatable = false)
    private LocalDateTime createdDate;

    @LastModifiedBy
    @Size(max = 100)
    @Column(name = "last_modified_by")
    private String lastModifiedBy;

    @LastModifiedDate
    @Column(name = "last_modified_date")
    private LocalDateTime lastModifiedDate;

    // Helper Methods
    public boolean isCompleted() {
        return procedureStatus == ProcedureStatus.COMPLETED;
    }

    public boolean isInProgress() {
        return procedureStatus == ProcedureStatus.IN_PROGRESS;
    }

    public boolean isScheduled() {
        return procedureStatus == ProcedureStatus.SCHEDULED;
    }

    public boolean isEmergency() {
        return urgencyLevel == UrgencyLevel.EMERGENCY || urgencyLevel == UrgencyLevel.STAT;
    }

    public Integer getActualDurationMinutes() {
        if (actualStartTime != null && actualEndTime != null) {
            return (int) java.time.Duration.between(actualStartTime, actualEndTime).toMinutes();
        }
        return null;
    }

    public boolean isOverdue() {
        return scheduledDateTime != null && 
               LocalDateTime.now().isAfter(scheduledDateTime) && 
               !isCompleted();
    }
}
