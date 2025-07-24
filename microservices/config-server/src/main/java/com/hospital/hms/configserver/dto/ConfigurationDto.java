package com.hospital.hms.configserver.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * Configuration Data Transfer Object
 * 
 * Represents a complete configuration for an application and profile.
 * Contains all configuration properties, metadata, and versioning information.
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ConfigurationDto {

    /**
     * Application name
     */
    @NotBlank(message = "Application name is required")
    private String applicationName;

    /**
     * Configuration profile (e.g., development, production)
     */
    @NotBlank(message = "Profile is required")
    private String profile;

    /**
     * Configuration label (e.g., git branch/tag)
     */
    private String label;

    /**
     * Configuration version
     */
    private String version;

    /**
     * Configuration properties
     */
    @NotNull(message = "Properties are required")
    private Map<String, Object> properties;

    /**
     * Configuration metadata
     */
    private ConfigurationMetadata metadata;

    /**
     * Configuration source information
     */
    private ConfigurationSource source;

    /**
     * Configuration validation status
     */
    private ValidationStatus validationStatus;

    /**
     * Configuration tags for categorization
     */
    private List<String> tags;

    /**
     * Configuration description
     */
    private String description;

    /**
     * Configuration author
     */
    private String author;

    /**
     * Configuration last modified timestamp
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime lastModified;

    /**
     * Configuration creation timestamp
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime created;

    /**
     * Configuration checksum for integrity verification
     */
    private String checksum;

    /**
     * Whether configuration contains encrypted values
     */
    private Boolean encrypted;

    /**
     * Configuration dependencies (other applications this config depends on)
     */
    private List<String> dependencies;

    /**
     * Environment-specific overrides
     */
    private Map<String, Map<String, Object>> environmentOverrides;

    /**
     * Configuration templates used
     */
    private List<String> templates;

    /**
     * Configuration metadata nested class
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class ConfigurationMetadata {
        
        /**
         * Configuration format (properties, yaml, json)
         */
        private String format;
        
        /**
         * Configuration size in bytes
         */
        private Long size;
        
        /**
         * Number of configuration properties
         */
        private Integer propertyCount;
        
        /**
         * Configuration complexity score
         */
        private Double complexityScore;
        
        /**
         * Configuration quality metrics
         */
        private Map<String, Object> qualityMetrics;
        
        /**
         * Configuration access frequency
         */
        private Integer accessCount;
        
        /**
         * Last access timestamp
         */
        @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
        private LocalDateTime lastAccessed;
        
        /**
         * Configuration usage statistics
         */
        private Map<String, Object> usageStats;
    }

    /**
     * Configuration source nested class
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class ConfigurationSource {
        
        /**
         * Source type (git, file, vault, database)
         */
        private String type;
        
        /**
         * Source location/URI
         */
        private String location;
        
        /**
         * Source branch/label
         */
        private String branch;
        
        /**
         * Source commit hash (for git)
         */
        private String commitHash;
        
        /**
         * Source commit message
         */
        private String commitMessage;
        
        /**
         * Source commit timestamp
         */
        @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
        private LocalDateTime commitTime;
        
        /**
         * Source commit author
         */
        private String commitAuthor;
        
        /**
         * Source file path
         */
        private String filePath;
        
        /**
         * Source repository URL
         */
        private String repositoryUrl;
    }

    /**
     * Validation status enum
     */
    public enum ValidationStatus {
        VALID,
        INVALID,
        WARNING,
        NOT_VALIDATED,
        VALIDATING
    }
}
