package com.hospital.hms.cds.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Clinical Rule Entity
 * 
 * Represents clinical decision support rules that can trigger
 * alerts, recommendations, or automated actions based on
 * patient data and clinical conditions.
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Entity
@Table(name = "clinical_rules", indexes = {
    @Index(name = "idx_rule_code", columnList = "rule_code", unique = true),
    @Index(name = "idx_rule_category", columnList = "category"),
    @Index(name = "idx_rule_severity", columnList = "severity"),
    @Index(name = "idx_rule_status", columnList = "status"),
    @Index(name = "idx_rule_priority", columnList = "priority"),
    @Index(name = "idx_rule_effective_date", columnList = "effective_date"),
    @Index(name = "idx_rule_expiry_date", columnList = "expiry_date")
})
@EntityListeners(AuditingEntityListener.class)
@Data
@EqualsAndHashCode(of = "id")
public class ClinicalRule {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "rule_code", unique = true, nullable = false, length = 100)
    @NotBlank(message = "Rule code is required")
    @Size(max = 100, message = "Rule code must not exceed 100 characters")
    @Pattern(regexp = "^[A-Z0-9_-]+$", message = "Rule code must contain only uppercase letters, numbers, underscores, and hyphens")
    private String ruleCode;

    @Column(name = "name", nullable = false, length = 200)
    @NotBlank(message = "Rule name is required")
    @Size(max = 200, message = "Rule name must not exceed 200 characters")
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "category", nullable = false, length = 50)
    @Enumerated(EnumType.STRING)
    @NotNull(message = "Rule category is required")
    private RuleCategory category;

    @Column(name = "severity", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    @NotNull(message = "Rule severity is required")
    private RuleSeverity severity;

    @Column(name = "priority", nullable = false)
    @Min(value = 1, message = "Priority must be at least 1")
    @Max(value = 100, message = "Priority must not exceed 100")
    private Integer priority;

    @Column(name = "status", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    @NotNull(message = "Rule status is required")
    private RuleStatus status = RuleStatus.ACTIVE;

    // Rule Logic
    @Column(name = "condition_expression", columnDefinition = "TEXT", nullable = false)
    @NotBlank(message = "Condition expression is required")
    private String conditionExpression;

    @Column(name = "action_type", nullable = false, length = 30)
    @Enumerated(EnumType.STRING)
    @NotNull(message = "Action type is required")
    private ActionType actionType;

    @Column(name = "action_configuration", columnDefinition = "TEXT")
    private String actionConfiguration;

    @Column(name = "recommendation_text", columnDefinition = "TEXT")
    private String recommendationText;

    @Column(name = "alert_message", length = 500)
    @Size(max = 500, message = "Alert message must not exceed 500 characters")
    private String alertMessage;

    // Clinical Context
    @Column(name = "clinical_domain", length = 100)
    @Size(max = 100, message = "Clinical domain must not exceed 100 characters")
    private String clinicalDomain;

    @Column(name = "specialty", length = 100)
    @Size(max = 100, message = "Specialty must not exceed 100 characters")
    private String specialty;

    @Column(name = "patient_population", length = 200)
    @Size(max = 200, message = "Patient population must not exceed 200 characters")
    private String patientPopulation;

    @Column(name = "age_min")
    @Min(value = 0, message = "Minimum age must be non-negative")
    private Integer ageMin;

    @Column(name = "age_max")
    @Min(value = 0, message = "Maximum age must be non-negative")
    private Integer ageMax;

    @Column(name = "gender", length = 10)
    @Pattern(regexp = "^(MALE|FEMALE|ALL)$", message = "Gender must be MALE, FEMALE, or ALL")
    private String gender;

    // Evidence and References
    @Column(name = "evidence_level", length = 20)
    @Enumerated(EnumType.STRING)
    private EvidenceLevel evidenceLevel;

    @Column(name = "guideline_source", length = 200)
    @Size(max = 200, message = "Guideline source must not exceed 200 characters")
    private String guidelineSource;

    @Column(name = "reference_url", length = 500)
    @Size(max = 500, message = "Reference URL must not exceed 500 characters")
    private String referenceUrl;

    @Column(name = "literature_references", columnDefinition = "TEXT")
    private String literatureReferences;

    // Timing and Frequency
    @Column(name = "effective_date", nullable = false)
    @NotNull(message = "Effective date is required")
    private LocalDateTime effectiveDate;

    @Column(name = "expiry_date")
    private LocalDateTime expiryDate;

    @Column(name = "evaluation_frequency", length = 20)
    @Enumerated(EnumType.STRING)
    private EvaluationFrequency evaluationFrequency = EvaluationFrequency.ON_DEMAND;

    @Column(name = "max_alerts_per_day")
    @Min(value = 1, message = "Max alerts per day must be at least 1")
    private Integer maxAlertsPerDay;

    @Column(name = "suppress_duration_hours")
    @Min(value = 1, message = "Suppress duration must be at least 1 hour")
    private Integer suppressDurationHours;

    // Performance and Analytics
    @Column(name = "times_triggered")
    @Min(value = 0, message = "Times triggered must be non-negative")
    private Long timesTriggered = 0L;

    @Column(name = "times_accepted")
    @Min(value = 0, message = "Times accepted must be non-negative")
    private Long timesAccepted = 0L;

    @Column(name = "times_overridden")
    @Min(value = 0, message = "Times overridden must be non-negative")
    private Long timesOverridden = 0L;

    @Column(name = "last_triggered_date")
    private LocalDateTime lastTriggeredDate;

    @Column(name = "average_response_time_ms")
    @Min(value = 0, message = "Average response time must be non-negative")
    private Long averageResponseTimeMs;

    // Configuration
    @Column(name = "is_enabled", nullable = false)
    private Boolean isEnabled = true;

    @Column(name = "is_interruptive", nullable = false)
    private Boolean isInterruptive = false;

    @Column(name = "requires_acknowledgment", nullable = false)
    private Boolean requiresAcknowledgment = false;

    @Column(name = "auto_resolve", nullable = false)
    private Boolean autoResolve = false;

    @Column(name = "tags", length = 500)
    @Size(max = 500, message = "Tags must not exceed 500 characters")
    private String tags;

    @Column(name = "metadata", columnDefinition = "TEXT")
    private String metadata;

    // Relationships
    @OneToMany(mappedBy = "rule", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ClinicalAlert> alerts = new ArrayList<>();

    @OneToMany(mappedBy = "rule", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<RuleExecution> executions = new ArrayList<>();

    // Audit Fields
    @CreatedDate
    @Column(name = "created_date", nullable = false, updatable = false)
    private LocalDateTime createdDate;

    @LastModifiedDate
    @Column(name = "last_modified_date")
    private LocalDateTime lastModifiedDate;

    @Column(name = "created_by", length = 100)
    @Size(max = 100, message = "Created by must not exceed 100 characters")
    private String createdBy;

    @Column(name = "last_modified_by", length = 100)
    @Size(max = 100, message = "Last modified by must not exceed 100 characters")
    private String lastModifiedBy;

    @Column(name = "version")
    @Version
    private Long version;

    // Constructors
    public ClinicalRule() {}

    // Helper methods
    
    public boolean isActive() {
        return RuleStatus.ACTIVE.equals(status) && 
               Boolean.TRUE.equals(isEnabled) &&
               effectiveDate != null && effectiveDate.isBefore(LocalDateTime.now()) &&
               (expiryDate == null || expiryDate.isAfter(LocalDateTime.now()));
    }

    public double getAcceptanceRate() {
        if (timesTriggered == 0) {
            return 0.0;
        }
        return (double) timesAccepted / timesTriggered * 100.0;
    }

    public double getOverrideRate() {
        if (timesTriggered == 0) {
            return 0.0;
        }
        return (double) timesOverridden / timesTriggered * 100.0;
    }

    public boolean shouldSuppressAlert() {
        if (suppressDurationHours == null || lastTriggeredDate == null) {
            return false;
        }
        
        LocalDateTime suppressUntil = lastTriggeredDate.plusHours(suppressDurationHours);
        return LocalDateTime.now().isBefore(suppressUntil);
    }

    public void incrementTriggered() {
        this.timesTriggered++;
        this.lastTriggeredDate = LocalDateTime.now();
    }

    public void incrementAccepted() {
        this.timesAccepted++;
    }

    public void incrementOverridden() {
        this.timesOverridden++;
    }
}