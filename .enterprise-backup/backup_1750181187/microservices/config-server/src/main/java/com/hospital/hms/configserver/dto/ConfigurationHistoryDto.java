package com.hospital.hms.configserver.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * Configuration History Data Transfer Object
 * 
 * Represents historical changes to configurations including versioning,
 * change tracking, audit information, and rollback capabilities.
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ConfigurationHistoryDto {

    /**
     * History entry unique identifier
     */
    private String id;

    /**
     * Application name
     */
    private String applicationName;

    /**
     * Configuration profile
     */
    private String profile;

    /**
     * Configuration version
     */
    private String version;

    /**
     * Previous version (for change tracking)
     */
    private String previousVersion;

    /**
     * Change timestamp
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime timestamp;

    /**
     * Change author/user
     */
    private String author;

    /**
     * Change description/commit message
     */
    private String description;

    /**
     * Type of change
     */
    private ChangeType changeType;

    /**
     * Change source information
     */
    private ChangeSource source;

    /**
     * List of specific property changes
     */
    private List<PropertyChange> propertyChanges;

    /**
     * Change statistics
     */
    private ChangeStatistics statistics;

    /**
     * Validation status of this version
     */
    private String validationStatus;

    /**
     * Deployment information
     */
    private DeploymentInfo deploymentInfo;

    /**
     * Rollback information (if this entry represents a rollback)
     */
    private RollbackInfo rollbackInfo;

    /**
     * Change approval information
     */
    private ApprovalInfo approvalInfo;

    /**
     * Tags associated with this change
     */
    private List<String> tags;

    /**
     * Configuration checksum for integrity
     */
    private String checksum;

    /**
     * Size of configuration in bytes
     */
    private Long size;

    /**
     * Whether this version is currently active
     */
    private Boolean active;

    /**
     * Whether this version can be rolled back to
     */
    private Boolean rollbackable;

    /**
     * Risk assessment of this change
     */
    private RiskAssessment riskAssessment;

    /**
     * Impact analysis of this change
     */
    private ImpactAnalysis impactAnalysis;

    /**
     * Property change nested class
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class PropertyChange {
        
        /**
         * Property path/key
         */
        private String propertyPath;
        
        /**
         * Type of property change
         */
        private PropertyChangeType changeType;
        
        /**
         * Previous value (null for additions)
         */
        private Object oldValue;
        
        /**
         * New value (null for deletions)
         */
        private Object newValue;
        
        /**
         * Data type of the property
         */
        private String dataType;
        
        /**
         * Whether the property contains sensitive data
         */
        private Boolean sensitive;
        
        /**
         * Impact level of this property change
         */
        private String impactLevel;
        
        /**
         * Property change description
         */
        private String description;
    }

    /**
     * Change source nested class
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class ChangeSource {
        
        /**
         * Source type (git, manual, api, import)
         */
        private String type;
        
        /**
         * Source location/URI
         */
        private String location;
        
        /**
         * Git commit hash (if applicable)
         */
        private String commitHash;
        
        /**
         * Git branch name
         */
        private String branch;
        
        /**
         * Source system or tool
         */
        private String system;
        
        /**
         * Source IP address
         */
        private String ipAddress;
        
        /**
         * User agent (if via API)
         */
        private String userAgent;
    }

    /**
     * Change statistics nested class
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class ChangeStatistics {
        
        /**
         * Number of properties added
         */
        private Integer propertiesAdded;
        
        /**
         * Number of properties modified
         */
        private Integer propertiesModified;
        
        /**
         * Number of properties deleted
         */
        private Integer propertiesDeleted;
        
        /**
         * Total number of properties affected
         */
        private Integer totalChanges;
        
        /**
         * Size difference in bytes
         */
        private Long sizeDelta;
        
        /**
         * Complexity change score
         */
        private Double complexityDelta;
    }

    /**
     * Deployment information nested class
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class DeploymentInfo {
        
        /**
         * Deployment timestamp
         */
        @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
        private LocalDateTime deployedAt;
        
        /**
         * Environment deployed to
         */
        private String environment;
        
        /**
         * Deployment status
         */
        private String status;
        
        /**
         * Instances affected by deployment
         */
        private List<String> affectedInstances;
        
        /**
         * Deployment duration
         */
        private Long deploymentDurationMs;
        
        /**
         * Deployment method
         */
        private String deploymentMethod;
        
        /**
         * Deployment pipeline ID
         */
        private String pipelineId;
    }

    /**
     * Rollback information nested class
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class RollbackInfo {
        
        /**
         * Rollback timestamp
         */
        @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
        private LocalDateTime rolledBackAt;
        
        /**
         * Rollback reason
         */
        private String reason;
        
        /**
         * Rollback initiated by
         */
        private String initiatedBy;
        
        /**
         * Target version for rollback
         */
        private String targetVersion;
        
        /**
         * Rollback approval required
         */
        private Boolean approvalRequired;
        
        /**
         * Rollback strategy used
         */
        private String strategy;
    }

    /**
     * Approval information nested class
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class ApprovalInfo {
        
        /**
         * Approval status
         */
        private ApprovalStatus status;
        
        /**
         * Approver name
         */
        private String approver;
        
        /**
         * Approval timestamp
         */
        @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
        private LocalDateTime approvedAt;
        
        /**
         * Approval comments
         */
        private String comments;
        
        /**
         * Required approval level
         */
        private String requiredLevel;
        
        /**
         * Approval workflow ID
         */
        private String workflowId;
    }

    /**
     * Risk assessment nested class
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class RiskAssessment {
        
        /**
         * Overall risk level
         */
        private RiskLevel riskLevel;
        
        /**
         * Risk score (0-100)
         */
        private Double riskScore;
        
        /**
         * Identified risk factors
         */
        private List<String> riskFactors;
        
        /**
         * Mitigation strategies
         */
        private List<String> mitigationStrategies;
        
        /**
         * Risk assessment timestamp
         */
        @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
        private LocalDateTime assessedAt;
        
        /**
         * Risk assessor
         */
        private String assessor;
    }

    /**
     * Impact analysis nested class
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class ImpactAnalysis {
        
        /**
         * Overall impact level
         */
        private ImpactLevel impactLevel;
        
        /**
         * Services affected by this change
         */
        private List<String> affectedServices;
        
        /**
         * Estimated downtime
         */
        private Long estimatedDowntimeMs;
        
        /**
         * Performance impact
         */
        private String performanceImpact;
        
        /**
         * Security impact
         */
        private String securityImpact;
        
        /**
         * Business impact
         */
        private String businessImpact;
        
        /**
         * Recommended testing
         */
        private List<String> recommendedTesting;
    }

    /**
     * Change type enumeration
     */
    public enum ChangeType {
        CREATE,
        UPDATE,
        DELETE,
        ROLLBACK,
        MERGE,
        IMPORT,
        MIGRATION
    }

    /**
     * Property change type enumeration
     */
    public enum PropertyChangeType {
        ADDED,
        MODIFIED,
        DELETED,
        MOVED,
        RENAMED
    }

    /**
     * Approval status enumeration
     */
    public enum ApprovalStatus {
        PENDING,
        APPROVED,
        REJECTED,
        NOT_REQUIRED
    }

    /**
     * Risk level enumeration
     */
    public enum RiskLevel {
        CRITICAL,
        HIGH,
        MEDIUM,
        LOW,
        MINIMAL
    }

    /**
     * Impact level enumeration
     */
    public enum ImpactLevel {
        CRITICAL,
        HIGH,
        MEDIUM,
        LOW,
        MINIMAL
    }
}
