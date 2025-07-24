package com.hospital.hms.servicediscovery.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * Service Event Entity
 * 
 * JPA entity for storing service discovery events and audit trail.
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Entity
@Table(name = "service_events", indexes = {
    @Index(name = "idx_event_type", columnList = "eventType"),
    @Index(name = "idx_event_timestamp", columnList = "eventTimestamp"),
    @Index(name = "idx_event_service", columnList = "service_registry_id")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ServiceEventEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id")
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_registry_id", nullable = false)
    private ServiceRegistryEntity serviceRegistry;

    @Enumerated(EnumType.STRING)
    @Column(name = "event_type", nullable = false)
    private EventType eventType;

    @Column(name = "event_description", columnDefinition = "TEXT")
    private String eventDescription;

    @Column(name = "event_data", columnDefinition = "TEXT")
    private String eventData;

    @Column(name = "severity")
    private String severity;

    @Column(name = "source")
    private String source;

    @CreationTimestamp
    @Column(name = "event_timestamp", nullable = false, updatable = false)
    private LocalDateTime eventTimestamp;

    /**
     * Event type enumeration
     */
    public enum EventType {
        SERVICE_REGISTERED,
        SERVICE_DEREGISTERED,
        SERVICE_STATUS_CHANGED,
        HEARTBEAT_RECEIVED,
        HEARTBEAT_MISSED,
        SERVICE_HEALTH_CHECK_FAILED,
        SERVICE_HEALTH_CHECK_PASSED,
        SERVICE_METADATA_UPDATED,
        SERVICE_EXPIRED,
        SERVICE_RENEWED
    }
}
