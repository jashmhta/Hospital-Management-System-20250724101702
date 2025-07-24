package com.hospital.hms.servicediscovery.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * Service Metadata Entity
 * 
 * JPA entity for storing service metadata and custom properties.
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Entity
@Table(name = "service_metadata", indexes = {
    @Index(name = "idx_metadata_key", columnList = "metadataKey"),
    @Index(name = "idx_metadata_service", columnList = "service_registry_id")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ServiceMetadataEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id")
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_registry_id", nullable = false)
    private ServiceRegistryEntity serviceRegistry;

    @Column(name = "metadata_key", nullable = false)
    private String metadataKey;

    @Column(name = "metadata_value", columnDefinition = "TEXT")
    private String metadataValue;

    @Column(name = "metadata_type")
    private String metadataType;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
