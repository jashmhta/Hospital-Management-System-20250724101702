package com.hospital.hms.configserver.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * Configuration Entity
 * 
 * Stores configuration properties for microservices with versioning and encryption support.
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Entity
@Table(name = "configurations", indexes = {
    @Index(name = "idx_config_application", columnList = "application"),
    @Index(name = "idx_config_profile", columnList = "profile"),
    @Index(name = "idx_config_label", columnList = "label"),
    @Index(name = "idx_config_key", columnList = "property_key"),
    @Index(name = "idx_config_version", columnList = "version"),
    @Index(name = "idx_config_active", columnList = "is_active"),
    @Index(name = "idx_config_composite", columnList = "application, profile, label, property_key")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConfigurationEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "config_id")
    private String configId;

    @Column(name = "application", nullable = false, length = 100)
    private String application;

    @Column(name = "profile", nullable = false, length = 50)
    @Builder.Default
    private String profile = "default";

    @Column(name = "label", length = 50)
    @Builder.Default
    private String label = "master";

    @Column(name = "property_key", nullable = false, length = 200)
    private String propertyKey;

    @Column(name = "property_value", columnDefinition = "TEXT")
    private String propertyValue;

    @Column(name = "property_type", length = 50)
    @Builder.Default
    private String propertyType = "STRING";

    @Column(name = "description", length = 1000)
    private String description;

    @Column(name = "category", length = 100)
    private String category;

    @Column(name = "subcategory", length = 100)
    private String subcategory;

    @Column(name = "version", nullable = false)
    @Builder.Default
    private Integer version = 1;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    @Column(name = "is_encrypted")
    @Builder.Default
    private Boolean isEncrypted = false;

    @Column(name = "encryption_key_id")
    private String encryptionKeyId;

    @Column(name = "is_sensitive")
    @Builder.Default
    private Boolean isSensitive = false;

    @Column(name = "is_required")
    @Builder.Default
    private Boolean isRequired = false;

    @Column(name = "default_value", length = 2000)
    private String defaultValue;

    @Column(name = "validation_regex", length = 500)
    private String validationRegex;

    @Column(name = "validation_message", length = 500)
    private String validationMessage;

    @Column(name = "min_value")
    private Double minValue;

    @Column(name = "max_value")
    private Double maxValue;

    @Column(name = "allowed_values", length = 2000)
    private String allowedValues;

    @Enumerated(EnumType.STRING)
    @Column(name = "priority")
    @Builder.Default
    private Priority priority = Priority.NORMAL;

    @Enumerated(EnumType.STRING)
    @Column(name = "scope")
    @Builder.Default
    private Scope scope = Scope.APPLICATION;

    @Column(name = "requires_restart")
    @Builder.Default
    private Boolean requiresRestart = false;

    @Column(name = "is_deprecated")
    @Builder.Default
    private Boolean isDeprecated = false;

    @Column(name = "deprecation_message", length = 500)
    private String deprecationMessage;

    @Column(name = "replacement_key", length = 200)
    private String replacementKey;

    @Column(name = "environment_specific")
    @Builder.Default
    private Boolean environmentSpecific = false;

    @Column(name = "override_allowed")
    @Builder.Default
    private Boolean overrideAllowed = true;

    @Column(name = "audit_enabled")
    @Builder.Default
    private Boolean auditEnabled = true;

    @Column(name = "last_validated")
    private LocalDateTime lastValidated;

    @Column(name = "validation_status", length = 50)
    @Builder.Default
    private String validationStatus = "PENDING";

    @Column(name = "tags", length = 500)
    private String tags;

    @Column(name = "source", length = 100)
    @Builder.Default
    private String source = "DATABASE";

    @Column(name = "source_path", length = 500)
    private String sourcePath;

    @Column(name = "git_commit_hash", length = 40)
    private String gitCommitHash;

    @Column(name = "created_at", nullable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @Column(name = "created_by", length = 100)
    private String createdBy;

    @Column(name = "updated_by", length = 100)
    private String updatedBy;

    // Enums
    public enum Priority {
        LOW, NORMAL, HIGH, CRITICAL
    }

    public enum Scope {
        GLOBAL, APPLICATION, PROFILE, INSTANCE
    }

    // Helper methods
    public String getFullKey() {
        return String.format("%s/%s/%s/%s", application, profile, label, propertyKey);
    }

    public boolean isValid() {
        if (validationRegex != null && propertyValue != null) {
            return propertyValue.matches(validationRegex);
        }
        
        if (minValue != null || maxValue != null) {
            try {
                double value = Double.parseDouble(propertyValue);
                if (minValue != null && value < minValue) return false;
                if (maxValue != null && value > maxValue) return false;
            } catch (NumberFormatException e) {
                return false;
            }
        }
        
        if (allowedValues != null && propertyValue != null) {
            String[] allowed = allowedValues.split(",");
            for (String allowedValue : allowed) {
                if (allowedValue.trim().equals(propertyValue)) {
                    return true;
                }
            }
            return false;
        }
        
        return true;
    }

    public boolean needsEncryption() {
        return isSensitive && !isEncrypted;
    }

    public boolean isExpired() {
        // Define expiration logic based on business rules
        return false; // Simplified for now
    }

    public String getMaskedValue() {
        if (isSensitive && propertyValue != null) {
            if (propertyValue.length() <= 4) {
                return "****";
            }
            return propertyValue.substring(0, 2) + "***" + propertyValue.substring(propertyValue.length() - 2);
        }
        return propertyValue;
    }

    @PrePersist
    protected void onCreate() {
        if (source == null) {
            source = "DATABASE";
        }
        if (validationStatus == null) {
            validationStatus = "PENDING";
        }
    }

    @PreUpdate
    protected void onUpdate() {
        // Increment version on property value change
        // In real implementation, this would be handled at service level
    }
}