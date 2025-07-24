package com.hms.procedure.entity;

import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.util.List;

/**
 * Clinical Procedure Entity
 * 
 * Represents clinical procedures with comprehensive workflow management,
 * scheduling, documentation, and resource allocation capabilities.
 */
@Entity
@Table(name = "clinical_procedures",
    indexes = {
        @Index(name = "idx_procedure_patient", columnList = "patient_id"),
        @Index(name = "idx_procedure_status", columnList = "status"),
        @Index(name = "idx_procedure_type", columnList = "procedure_type_id"),
        @Index(name = "idx_procedure_scheduled_date", columnList = "scheduled_date"),
        @Index(name = "idx_procedure_department", columnList = "department_id"),
        @Index(name = "idx_procedure_priority", columnList = "priority")
    }
)
@EntityListeners(AuditingEntityListener.class)
public class ClinicalProcedure {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "procedure_code", nullable = false, unique = true, length = 50)
    private String procedureCode;

    @Column(name = "patient_id", nullable = false)
    private Long patientId;

    @Column(name = "patient_name", nullable = false, length = 200)
    private String patientName;

    @Column(name = "patient_mrn", nullable = false, length = 50)
    private String patientMrn;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "procedure_type_id", nullable = false)
    private ProcedureType procedureType;

    @Column(name = "procedure_name", nullable = false, length = 300)
    private String procedureName;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ProcedureStatus status = ProcedureStatus.SCHEDULED;

    @Enumerated(EnumType.STRING)
    @Column(name = "priority", nullable = false)
    private ProcedurePriority priority = ProcedurePriority.ROUTINE;

    @Enumerated(EnumType.STRING)
    @Column(name = "urgency", nullable = false)
    private ProcedureUrgency urgency = ProcedureUrgency.SCHEDULED;

    @Column(name = "department_id", nullable = false)
    private Long departmentId;

    @Column(name = "department_name", nullable = false, length = 200)
    private String departmentName;

    @Column(name = "primary_physician_id", nullable = false)
    private Long primaryPhysicianId;

    @Column(name = "primary_physician_name", nullable = false, length = 200)
    private String primaryPhysicianName;

    @Column(name = "attending_physician_id")
    private Long attendingPhysicianId;

    @Column(name = "attending_physician_name", length = 200)
    private String attendingPhysicianName;

    @Column(name = "scheduled_date", nullable = false)
    private LocalDateTime scheduledDate;

    @Column(name = "estimated_duration_minutes", nullable = false)
    private Integer estimatedDurationMinutes;

    @Column(name = "actual_start_time")
    private LocalDateTime actualStartTime;

    @Column(name = "actual_end_time")
    private LocalDateTime actualEndTime;

    @Column(name = "actual_duration_minutes")
    private Integer actualDurationMinutes;

    @Column(name = "location_id")
    private Long locationId;

    @Column(name = "location_name", length = 200)
    private String locationName;

    @Column(name = "room_number", length = 50)
    private String roomNumber;

    @Column(name = "preparation_instructions", columnDefinition = "TEXT")
    private String preparationInstructions;

    @Column(name = "pre_procedure_checklist_completed", nullable = false)
    private Boolean preProcedureChecklistCompleted = false;

    @Column(name = "post_procedure_checklist_completed", nullable = false)
    private Boolean postProcedureChecklistCompleted = false;

    @Column(name = "consent_obtained", nullable = false)
    private Boolean consentObtained = false;

    @Column(name = "consent_date")
    private LocalDateTime consentDate;

    @Column(name = "consent_obtained_by", length = 200)
    private String consentObtainedBy;

    @Column(name = "anesthesia_required", nullable = false)
    private Boolean anesthesiaRequired = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "anesthesia_type")
    private AnesthesiaType anesthesiaType;

    @Column(name = "anesthesiologist_id")
    private Long anesthesiologistId;

    @Column(name = "anesthesiologist_name", length = 200)
    private String anesthesiologistName;

    @Column(name = "special_equipment_required", columnDefinition = "TEXT")
    private String specialEquipmentRequired;

    @Column(name = "medications_administered", columnDefinition = "TEXT")
    private String medicationsAdministered;

    @Column(name = "complications_noted", columnDefinition = "TEXT")
    private String complicationsNoted;

    @Column(name = "procedure_notes", columnDefinition = "TEXT")
    private String procedureNotes;

    @Column(name = "pathology_required", nullable = false)
    private Boolean pathologyRequired = false;

    @Column(name = "pathology_specimens", columnDefinition = "TEXT")
    private String pathologySpecimens;

    @Column(name = "imaging_required", nullable = false)
    private Boolean imagingRequired = false;

    @Column(name = "imaging_studies", columnDefinition = "TEXT")
    private String imagingStudies;

    @Column(name = "lab_work_required", nullable = false)
    private Boolean labWorkRequired = false;

    @Column(name = "lab_orders", columnDefinition = "TEXT")
    private String labOrders;

    @Column(name = "discharge_instructions", columnDefinition = "TEXT")
    private String dischargeInstructions;

    @Column(name = "follow_up_required", nullable = false)
    private Boolean followUpRequired = false;

    @Column(name = "follow_up_date")
    private LocalDateTime followUpDate;

    @Column(name = "follow_up_instructions", columnDefinition = "TEXT")
    private String followUpInstructions;

    @Column(name = "billing_code", length = 50)
    private String billingCode;

    @Column(name = "estimated_cost", precision = 10, scale = 2)
    private BigDecimal estimatedCost;

    @Column(name = "actual_cost", precision = 10, scale = 2)
    private BigDecimal actualCost;

    @Column(name = "insurance_authorization_required", nullable = false)
    private Boolean insuranceAuthorizationRequired = false;

    @Column(name = "insurance_authorization_number", length = 100)
    private String insuranceAuthorizationNumber;

    @Column(name = "insurance_authorization_date")
    private LocalDateTime insuranceAuthorizationDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "outcome")
    private ProcedureOutcome outcome;

    @Column(name = "outcome_notes", columnDefinition = "TEXT")
    private String outcomeNotes;

    @Column(name = "quality_metrics_json", columnDefinition = "JSONB")
    private String qualityMetricsJson;

    @Column(name = "risk_assessment_json", columnDefinition = "JSONB")
    private String riskAssessmentJson;

    @Column(name = "compliance_checklist_json", columnDefinition = "JSONB")
    private String complianceChecklistJson;

    @Column(name = "cancelled_reason", columnDefinition = "TEXT")
    private String cancelledReason;

    @Column(name = "cancelled_date")
    private LocalDateTime cancelledDate;

    @Column(name = "cancelled_by", length = 200)
    private String cancelledBy;

    @Column(name = "rescheduled_from_date")
    private LocalDateTime rescheduledFromDate;

    @Column(name = "reschedule_reason", columnDefinition = "TEXT")
    private String rescheduleReason;

    @Column(name = "emergency_procedure", nullable = false)
    private Boolean emergencyProcedure = false;

    @Column(name = "same_day_surgery", nullable = false)
    private Boolean sameDaySurgery = false;

    @Column(name = "inpatient_procedure", nullable = false)
    private Boolean inpatientProcedure = false;

    @Column(name = "admission_id")
    private Long admissionId;

    @OneToMany(mappedBy = "clinicalProcedure", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ProcedureResource> requiredResources;

    @OneToMany(mappedBy = "clinicalProcedure", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ProcedureStaff> assignedStaff;

    @OneToMany(mappedBy = "clinicalProcedure", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ProcedureDocument> documents;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "created_by", length = 100)
    private String createdBy;

    @Column(name = "updated_by", length = 100)
    private String updatedBy;

    @Version
    private Long version;

    // Constructors
    public ClinicalProcedure() {}

    public ClinicalProcedure(String procedureCode, Long patientId, String patientName, 
                           ProcedureType procedureType, LocalDateTime scheduledDate) {
        this.procedureCode = procedureCode;
        this.patientId = patientId;
        this.patientName = patientName;
        this.procedureType = procedureType;
        this.scheduledDate = scheduledDate;
    }

    // Utility methods
    public boolean isScheduled() {
        return status == ProcedureStatus.SCHEDULED;
    }

    public boolean isInProgress() {
        return status == ProcedureStatus.IN_PROGRESS;
    }

    public boolean isCompleted() {
        return status == ProcedureStatus.COMPLETED;
    }

    public boolean isCancelled() {
        return status == ProcedureStatus.CANCELLED;
    }

    public boolean isEmergency() {
        return urgency == ProcedureUrgency.EMERGENCY || emergencyProcedure;
    }

    public boolean isOverdue() {
        return status == ProcedureStatus.SCHEDULED && 
               LocalDateTime.now().isAfter(scheduledDate.plusMinutes(estimatedDurationMinutes));
    }

    public void startProcedure() {
        this.status = ProcedureStatus.IN_PROGRESS;
        this.actualStartTime = LocalDateTime.now();
    }

    public void completeProcedure() {
        this.status = ProcedureStatus.COMPLETED;
        this.actualEndTime = LocalDateTime.now();
        if (actualStartTime != null) {
            this.actualDurationMinutes = (int) java.time.Duration.between(actualStartTime, actualEndTime).toMinutes();
        }
    }

    public void cancelProcedure(String reason, String cancelledBy) {
        this.status = ProcedureStatus.CANCELLED;
        this.cancelledReason = reason;
        this.cancelledBy = cancelledBy;
        this.cancelledDate = LocalDateTime.now();
    }

    public void rescheduleProcedure(LocalDateTime newDate, String reason) {
        this.rescheduledFromDate = this.scheduledDate;
        this.scheduledDate = newDate;
        this.rescheduleReason = reason;
        this.status = ProcedureStatus.SCHEDULED;
    }

    // Getters and Setters (abbreviated for space - full implementation would include all)
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getProcedureCode() { return procedureCode; }
    public void setProcedureCode(String procedureCode) { this.procedureCode = procedureCode; }

    public Long getPatientId() { return patientId; }
    public void setPatientId(Long patientId) { this.patientId = patientId; }

    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }

    public String getPatientMrn() { return patientMrn; }
    public void setPatientMrn(String patientMrn) { this.patientMrn = patientMrn; }

    public ProcedureType getProcedureType() { return procedureType; }
    public void setProcedureType(ProcedureType procedureType) { this.procedureType = procedureType; }

    public String getProcedureName() { return procedureName; }
    public void setProcedureName(String procedureName) { this.procedureName = procedureName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public ProcedureStatus getStatus() { return status; }
    public void setStatus(ProcedureStatus status) { this.status = status; }

    public ProcedurePriority getPriority() { return priority; }
    public void setPriority(ProcedurePriority priority) { this.priority = priority; }

    public ProcedureUrgency getUrgency() { return urgency; }
    public void setUrgency(ProcedureUrgency urgency) { this.urgency = urgency; }

    public Long getDepartmentId() { return departmentId; }
    public void setDepartmentId(Long departmentId) { this.departmentId = departmentId; }

    public String getDepartmentName() { return departmentName; }
    public void setDepartmentName(String departmentName) { this.departmentName = departmentName; }

    public LocalDateTime getScheduledDate() { return scheduledDate; }
    public void setScheduledDate(LocalDateTime scheduledDate) { this.scheduledDate = scheduledDate; }

    public Integer getEstimatedDurationMinutes() { return estimatedDurationMinutes; }
    public void setEstimatedDurationMinutes(Integer estimatedDurationMinutes) { this.estimatedDurationMinutes = estimatedDurationMinutes; }

    public LocalDateTime getActualStartTime() { return actualStartTime; }
    public void setActualStartTime(LocalDateTime actualStartTime) { this.actualStartTime = actualStartTime; }

    public LocalDateTime getActualEndTime() { return actualEndTime; }
    public void setActualEndTime(LocalDateTime actualEndTime) { this.actualEndTime = actualEndTime; }

    public Boolean getConsentObtained() { return consentObtained; }
    public void setConsentObtained(Boolean consentObtained) { this.consentObtained = consentObtained; }

    public Boolean getAnesthesiaRequired() { return anesthesiaRequired; }
    public void setAnesthesiaRequired(Boolean anesthesiaRequired) { this.anesthesiaRequired = anesthesiaRequired; }

    public ProcedureOutcome getOutcome() { return outcome; }
    public void setOutcome(ProcedureOutcome outcome) { this.outcome = outcome; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public Long getVersion() { return version; }
    public void setVersion(Long version) { this.version = version; }

    // Additional getters/setters would be included in full implementation...

    // Enums
    public enum ProcedureStatus {
        SCHEDULED,
        CONFIRMED,
        IN_PROGRESS,
        COMPLETED,
        CANCELLED,
        POSTPONED,
        NO_SHOW
    }

    public enum ProcedurePriority {
        LOW,
        ROUTINE,
        HIGH,
        URGENT,
        CRITICAL
    }

    public enum ProcedureUrgency {
        SCHEDULED,
        URGENT,
        EMERGENCY,
        STAT
    }

    public enum AnesthesiaType {
        LOCAL,
        REGIONAL,
        GENERAL,
        SEDATION,
        MONITORED_ANESTHESIA_CARE
    }

    public enum ProcedureOutcome {
        SUCCESSFUL,
        SUCCESSFUL_WITH_COMPLICATIONS,
        UNSUCCESSFUL,
        ABORTED,
        PARTIAL
    }
}
