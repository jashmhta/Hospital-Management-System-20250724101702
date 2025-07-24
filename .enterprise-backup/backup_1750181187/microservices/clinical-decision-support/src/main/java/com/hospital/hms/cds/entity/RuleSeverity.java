package com.hospital.hms.cds.entity;

/**
 * Rule Severity enumeration for clinical alert severity levels
 */
public enum RuleSeverity {
    LOW, MEDIUM, HIGH, CRITICAL, EMERGENCY
}

/**
 * Rule Status enumeration for clinical rule lifecycle
 */
enum RuleStatus {
    DRAFT, ACTIVE, INACTIVE, SUSPENDED, RETIRED, UNDER_REVIEW
}

/**
 * Action Type enumeration for rule actions
 */
enum ActionType {
    ALERT, RECOMMENDATION, AUTO_ORDER, WORKFLOW_TRIGGER, DOCUMENTATION_REMINDER, STOP_ORDER, MODIFY_ORDER
}

/**
 * Evidence Level enumeration for clinical evidence quality
 */
enum EvidenceLevel {
    LEVEL_I, LEVEL_II, LEVEL_III, LEVEL_IV, EXPERT_OPINION, CONSENSUS_GUIDELINE
}

/**
 * Evaluation Frequency enumeration for rule evaluation timing
 */
enum EvaluationFrequency {
    ON_DEMAND, REAL_TIME, SCHEDULED, DAILY, WEEKLY, MONTHLY, ON_ADMISSION, ON_DISCHARGE
}