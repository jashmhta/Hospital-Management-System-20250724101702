package com.hospital.hms.configserver.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * Configuration History Entity
 * 
 * Maintains audit trail and history of configuration changes.
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Entity
@Table(name = "configuration_history", indexes = {
    @Index(name = "idx_history_config", columnList = "configuration_id"),
    @Index(name = "idx_history_timestamp", columnList = "change_timestamp"),
    @Index(name = "idx_history_user", columnList = "changed_by"),
    @Index(name = "idx_history_action", columnList = "action_type")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConfigurationHistoryEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "history_id")
    private String historyId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "configuration_id", nullable = false)
    private ConfigurationEntity configuration;

    @Enumerated(EnumType.STRING)
    @Column(name = "action_type", nullable = false)
    private ActionType actionType;

    @Column(name = "old_value", columnDefinition = "TEXT")
    private String oldValue;

    @Column(name = "new_value", columnDefinition = "TEXT")
    private String newValue;

    @Column(name = "old_version")
    private Integer oldVersion;

    @Column(name = "new_version")
    private Integer newVersion;

    @Column(name = "change_reason", length = 1000)
    private String changeReason;

    @Column(name = "change_description", length = 2000)
    private String changeDescription;

    @Column(name = "impact_assessment", length = 1000)
    private String impactAssessment;

    @Column(name = "rollback_data", columnDefinition = "TEXT")
    private String rollbackData;

    @Column(name = "validation_result", length = 100)
    private String validationResult;

    @Column(name = "validation_message", length = 500)
    private String validationMessage;

    @Column(name = "approval_required")
    @Builder.Default
    private Boolean approvalRequired = false;

    @Column(name = "approved_by", length = 100)
    private String approvedBy;

    @Column(name = "approved_at")
    private LocalDateTime approvedAt;

    @Column(name = "deployment_status", length = 50)
    @Builder.Default
    private String deploymentStatus = "PENDING";

    @Column(name = "deployed_at")
    private LocalDateTime deployedAt;

    @Column(name = "deployment_target", length = 200)
    private String deploymentTarget;

    @Column(name = "git_commit_hash", length = 40)
    private String gitCommitHash;

    @Column(name = "source_system", length = 100)
    private String sourceSystem;

    @Column(name = "correlation_id", length = 100)
    private String correlationId;

    @Column(name = "session_id", length = 100)
    private String sessionId;

    @Column(name = "client_ip", length = 45)
    private String clientIp;

    @Column(name = "user_agent", length = 500)
    private String userAgent;

    @Column(name = "change_timestamp", nullable = false)
    @CreationTimestamp
    private LocalDateTime changeTimestamp;

    @Column(name = "changed_by", nullable = false, length = 100)
    private String changedBy;

    @Column(name = "changed_by_role", length = 100)
    private String changedByRole;

    // Enums
    public enum ActionType {
        CREATE,
        UPDATE,
        DELETE,
        ACTIVATE,
        DEACTIVATE,
        ENCRYPT,
        DECRYPT,
        VALIDATE,
        DEPLOY,
        ROLLBACK,
        IMPORT,
        EXPORT
    }

    // Helper methods
    public boolean isSignificantChange() {
        return actionType == ActionType.UPDATE || 
               actionType == ActionType.CREATE || 
               actionType == ActionType.DELETE;
    }

    public boolean requiresApproval() {
        return approvalRequired && approvedBy == null;
    }

    public boolean isDeployed() {
        return "DEPLOYED".equals(deploymentStatus);
    }

    public boolean isPending() {
        return "PENDING".equals(deploymentStatus);
    }

    public boolean hasFailed() {
        return "FAILED".equals(deploymentStatus);
    }

    public String getChangeDescription() {
        if (changeDescription != null) {
            return changeDescription;
        }
        
        StringBuilder desc = new StringBuilder();
        desc.append(actionType.toString().toLowerCase());
        
        if (actionType == ActionType.UPDATE) {
            desc.append(" value from '").append(maskSensitiveValue(oldValue))
                .append("' to '").append(maskSensitiveValue(newValue)).append("'");
        } else if (actionType == ActionType.CREATE) {
            desc.append(" with value '").append(maskSensitiveValue(newValue)).append("'");
        }
        
        return desc.toString();
    }

    private String maskSensitiveValue(String value) {
        if (value == null) return null;
        if (configuration != null && configuration.getIsSensitive()) {
            return "***";
        }
        return value;
    }

    public long getTimeSinceChange() {
        return java.time.Duration.between(changeTimestamp, LocalDateTime.now()).toMinutes();
    }

    @PrePersist
    protected void onCreate() {
        if (deploymentStatus == null) {
            deploymentStatus = "PENDING";
        }
    }
}