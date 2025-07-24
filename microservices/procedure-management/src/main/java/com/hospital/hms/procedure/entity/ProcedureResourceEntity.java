package com.hospital.hms.procedure.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;

/**
 * Procedure Resource Entity
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Entity
@Table(name = "procedure_resources", indexes = {
    @Index(name = "idx_proc_res_procedure_id", columnList = "procedure_id"),
    @Index(name = "idx_proc_res_resource_type", columnList = "resource_type"),
    @Index(name = "idx_proc_res_allocation_time", columnList = "allocated_at")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProcedureResourceEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "resource_id")
    private String resourceId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "procedure_id", nullable = false)
    private ProcedureEntity procedure;

    @NotBlank
    @Column(name = "resource_type", nullable = false)
    private String resourceType; // STAFF, EQUIPMENT, ROOM, MEDICATION

    @NotBlank
    @Column(name = "resource_name", nullable = false)
    private String resourceName;

    @Column(name = "resource_identifier")
    private String resourceIdentifier;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "allocation_status", nullable = false)
    private AllocationStatus allocationStatus;

    @Column(name = "allocated_from")
    private LocalDateTime allocatedFrom;

    @Column(name = "allocated_to")
    private LocalDateTime allocatedTo;

    @Column(name = "quantity")
    private Integer quantity;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @CreationTimestamp
    @Column(name = "allocated_at", nullable = false)
    private LocalDateTime allocatedAt;

    @Column(name = "allocated_by")
    private String allocatedBy;

    @Column(name = "released_at")
    private LocalDateTime releasedAt;

    @Column(name = "released_by")
    private String releasedBy;

    public enum AllocationStatus {
        RESERVED,
        ALLOCATED,
        IN_USE,
        RELEASED,
        UNAVAILABLE
    }
}
