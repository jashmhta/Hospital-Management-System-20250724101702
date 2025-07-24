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
 * Configuration Validation Data Transfer Object
 * 
 * Contains validation results for configuration properties including
 * errors, warnings, suggestions, and validation metadata.
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ConfigurationValidationDto {

    /**
     * Overall validation status
     */
    private boolean valid;

    /**
     * Validation score (0-100)
     */
    private Double validationScore;

    /**
     * List of validation errors
     */
    private List<ValidationMessage> errors;

    /**
     * List of validation warnings
     */
    private List<ValidationMessage> warnings;

    /**
     * List of validation suggestions for improvement
     */
    private List<ValidationMessage> suggestions;

    /**
     * Validation metadata
     */
    private ValidationMetadata metadata;

    /**
     * Property-specific validation results
     */
    private Map<String, PropertyValidationResult> propertyValidations;

    /**
     * Schema validation results
     */
    private SchemaValidationResult schemaValidation;

    /**
     * Security validation results
     */
    private SecurityValidationResult securityValidation;

    /**
     * Performance impact analysis
     */
    private PerformanceValidationResult performanceValidation;

    /**
     * Compliance validation results
     */
    private ComplianceValidationResult complianceValidation;

    /**
     * Validation message nested class
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class ValidationMessage {
        
        /**
         * Message severity level
         */
        private Severity severity;
        
        /**
         * Validation message code
         */
        private String code;
        
        /**
         * Human-readable message
         */
        private String message;
        
        /**
         * Property path that caused the issue
         */
        private String propertyPath;
        
        /**
         * Suggested fix or remedy
         */
        private String suggestion;
        
        /**
         * Rule or constraint that was violated
         */
        private String rule;
        
        /**
         * Expected value or format
         */
        private String expected;
        
        /**
         * Actual value that caused the issue
         */
        private String actual;
        
        /**
         * Additional context information
         */
        private Map<String, Object> context;
    }

    /**
     * Validation metadata nested class
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class ValidationMetadata {
        
        /**
         * Validation timestamp
         */
        @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
        private LocalDateTime validatedAt;
        
        /**
         * Validation duration in milliseconds
         */
        private Long validationDurationMs;
        
        /**
         * Validator version
         */
        private String validatorVersion;
        
        /**
         * Total properties validated
         */
        private Integer totalProperties;
        
        /**
         * Number of valid properties
         */
        private Integer validProperties;
        
        /**
         * Number of invalid properties
         */
        private Integer invalidProperties;
        
        /**
         * Validation rules applied
         */
        private List<String> rulesApplied;
        
        /**
         * Validation context
         */
        private Map<String, Object> context;
    }

    /**
     * Property validation result nested class
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class PropertyValidationResult {
        
        /**
         * Property validation status
         */
        private boolean valid;
        
        /**
         * Property value type
         */
        private String valueType;
        
        /**
         * Expected type or format
         */
        private String expectedType;
        
        /**
         * Validation messages for this property
         */
        private List<ValidationMessage> messages;
        
        /**
         * Property constraints applied
         */
        private List<String> constraints;
        
        /**
         * Property security classification
         */
        private String securityLevel;
        
        /**
         * Whether property contains sensitive data
         */
        private Boolean sensitive;
    }

    /**
     * Schema validation result nested class
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class SchemaValidationResult {
        
        /**
         * Schema validation status
         */
        private boolean valid;
        
        /**
         * Schema version used for validation
         */
        private String schemaVersion;
        
        /**
         * Missing required properties
         */
        private List<String> missingProperties;
        
        /**
         * Unknown/unexpected properties
         */
        private List<String> unknownProperties;
        
        /**
         * Type mismatches
         */
        private Map<String, String> typeMismatches;
        
        /**
         * Schema violations
         */
        private List<ValidationMessage> violations;
    }

    /**
     * Security validation result nested class
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class SecurityValidationResult {
        
        /**
         * Security validation status
         */
        private boolean secure;
        
        /**
         * Security risk level
         */
        private SecurityRiskLevel riskLevel;
        
        /**
         * Unencrypted sensitive properties
         */
        private List<String> unencryptedSensitive;
        
        /**
         * Weak encryption detected
         */
        private List<String> weakEncryption;
        
        /**
         * Security policy violations
         */
        private List<ValidationMessage> policyViolations;
        
        /**
         * Recommended security actions
         */
        private List<String> recommendations;
    }

    /**
     * Performance validation result nested class
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class PerformanceValidationResult {
        
        /**
         * Performance impact level
         */
        private PerformanceImpact impact;
        
        /**
         * Configuration size analysis
         */
        private Long configurationSize;
        
        /**
         * Estimated load time
         */
        private Long estimatedLoadTimeMs;
        
        /**
         * Memory usage estimate
         */
        private Long estimatedMemoryUsage;
        
        /**
         * Performance recommendations
         */
        private List<String> recommendations;
        
        /**
         * Potential bottlenecks
         */
        private List<String> bottlenecks;
    }

    /**
     * Compliance validation result nested class
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class ComplianceValidationResult {
        
        /**
         * Compliance status
         */
        private boolean compliant;
        
        /**
         * Compliance standards checked
         */
        private List<String> standardsChecked;
        
        /**
         * Compliance violations
         */
        private List<ValidationMessage> violations;
        
        /**
         * Required approvals
         */
        private List<String> requiredApprovals;
        
        /**
         * Compliance score (0-100)
         */
        private Double complianceScore;
        
        /**
         * Compliance recommendations
         */
        private List<String> recommendations;
    }

    /**
     * Message severity levels
     */
    public enum Severity {
        ERROR,
        WARNING,
        INFO,
        SUGGESTION
    }

    /**
     * Security risk levels
     */
    public enum SecurityRiskLevel {
        CRITICAL,
        HIGH,
        MEDIUM,
        LOW,
        MINIMAL
    }

    /**
     * Performance impact levels
     */
    public enum PerformanceImpact {
        HIGH,
        MEDIUM,
        LOW,
        MINIMAL
    }
}
