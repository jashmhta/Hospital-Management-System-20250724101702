package com.hospital.hms.servicediscovery.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Service Registry Entity
 * 
 * JPA entity for storing service registration information and metadata.
 * Provides persistence layer for service discovery operations.
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Entity
@Table(name = "service_registry", indexes = {
    @Index(name = "idx_service_name", columnList = "serviceName"),
    @Index(name = "idx_status", columnList = "status"),
    @Index(name = "idx_environment", columnList = "environment"),
    @Index(name = "idx_created_at", columnList = "createdAt")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ServiceRegistryEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id")
    private String id;

    @Column(name = "instance_id", nullable = false, unique = true)
    private String instanceId;

    @Column(name = "service_name", nullable = false)
    private String serviceName;

    @Column(name = "host_name", nullable = false)
    private String hostName;

    @Column(name = "ip_address", nullable = false)
    private String ipAddress;

    @Column(name = "port", nullable = false)
    private Integer port;

    @Column(name = "secure_port")
    private Integer securePort;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ServiceStatus status;

    @Column(name = "health_status")
    private String healthStatus;

    @Column(name = "home_page_url")
    private String homePageUrl;

    @Column(name = "status_page_url")
    private String statusPageUrl;

    @Column(name = "health_check_url")
    private String healthCheckUrl;

    @Column(name = "vip_address")
    private String vipAddress;

    @Column(name = "secure_vip_address")
    private String secureVipAddress;

    @Column(name = "data_center_info")
    private String dataCenterInfo;

    @Column(name = "version")
    private String version;

    @Column(name = "build_info", columnDefinition = "TEXT")
    private String buildInfo;

    @Column(name = "environment")
    private String environment;

    @Column(name = "zone")
    private String zone;

    @Column(name = "secure_port_enabled")
    private Boolean securePortEnabled;

    @Column(name = "non_secure_port_enabled")
    private Boolean nonSecurePortEnabled;

    @Column(name = "uptime_ms")
    private Long uptimeMs;

    @Column(name = "lease_renewal_interval")
    private Integer leaseRenewalInterval;

    @Column(name = "lease_duration")
    private Integer leaseDuration;

    @Column(name = "last_heartbeat")
    private LocalDateTime lastHeartbeat;

    @Column(name = "last_status_update")
    private LocalDateTime lastStatusUpdate;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "serviceRegistry", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ServiceMetadataEntity> metadata;

    @OneToMany(mappedBy = "serviceRegistry", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ServiceEventEntity> events;

    /**
     * Service status enumeration
     */
    public enum ServiceStatus {
        UP,
        DOWN,
        STARTING,
        OUT_OF_SERVICE,
        UNKNOWN
    }
}
