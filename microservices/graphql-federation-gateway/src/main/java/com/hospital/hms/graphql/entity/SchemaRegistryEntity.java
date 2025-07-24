package com.hospital.hms.graphql.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * Schema Registry Entity for GraphQL Federation
 * 
 * Manages federated GraphQL schema registration, versioning, and metadata
 * for healthcare microservices integration.
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Entity
@Table(name = "schema_registry")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class SchemaRegistryEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(name = "service_name", nullable = false, unique = true)
    private String serviceName;

    @NotBlank
    @Column(name = "schema_definition", columnDefinition = "TEXT", nullable = false)
    private String schemaDefinition;

    @NotBlank
    @Column(name = "schema_version", nullable = false)
    private String schemaVersion;

    @NotNull
    @Column(name = "service_url", nullable = false)
    private String serviceUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private SchemaStatus status = SchemaStatus.ACTIVE;

    @Column(name = "health_endpoint")
    private String healthEndpoint;

    @Column(name = "schema_hash")
    private String schemaHash;

    @ElementCollection
    @CollectionTable(name = "schema_metadata", joinColumns = @JoinColumn(name = "schema_id"))
    @MapKeyColumn(name = "metadata_key")
    @Column(name = "metadata_value")
    private Map<String, String> metadata;

    @Column(name = "priority_level")
    private Integer priorityLevel = 1;

    @Column(name = "timeout_ms")
    private Long timeoutMs = 30000L;

    @Column(name = "retry_attempts")
    private Integer retryAttempts = 3;

    @Column(name = "circuit_breaker_enabled")
    private Boolean circuitBreakerEnabled = true;

    @Column(name = "rate_limit_per_minute")
    private Integer rateLimitPerMinute = 1000;

    @Column(name = "authentication_required")
    private Boolean authenticationRequired = true;

    @Column(name = "admin_contact")
    private String adminContact;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @CreatedDate
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "last_health_check")
    private LocalDateTime lastHealthCheck;

    @Column(name = "health_status")
    @Enumerated(EnumType.STRING)
    private HealthStatus healthStatus = HealthStatus.UNKNOWN;

    @Column(name = "error_count")
    private Long errorCount = 0L;

    @Column(name = "success_count")
    private Long successCount = 0L;

    @Column(name = "average_response_time")
    private Double averageResponseTime = 0.0;

    public enum SchemaStatus {
        ACTIVE,
        INACTIVE,
        DEPRECATED,
        MAINTENANCE,
        ERROR
    }

    public enum HealthStatus {
        HEALTHY,
        UNHEALTHY,
        UNKNOWN,
        DEGRADED
    }

    /**
     * Calculate health score based on success rate and response time
     */
    @Transient
    public double getHealthScore() {
        if (successCount + errorCount == 0) return 0.0;
        
        double successRate = (double) successCount / (successCount + errorCount);
        double responseTimeFactor = Math.max(0, 1.0 - (averageResponseTime / 1000.0)); // Normalize to 1 second
        
        return (successRate * 0.7) + (responseTimeFactor * 0.3);
    }

    /**
     * Check if schema is available for federation
     */
    @Transient
    public boolean isAvailableForFederation() {
        return status == SchemaStatus.ACTIVE && 
               healthStatus != HealthStatus.UNHEALTHY &&
               getHealthScore() > 0.5;
    }

    /**
     * Get display name for UI
     */
    @Transient
    public String getDisplayName() {
        return serviceName.replace("-", " ").replace("_", " ")
                .replaceAll("\\b\\w", m -> m.group().toUpperCase());
    }
}
