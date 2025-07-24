package com.hospital.hms.mpiintegration.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Identity Alias Entity for tracking patient name variations and aliases
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Entity
@Table(name = "identity_aliases", indexes = {
    @Index(name = "idx_alias_patient", columnList = "patient_identity_id"),
    @Index(name = "idx_alias_type", columnList = "alias_type"),
    @Index(name = "idx_alias_name", columnList = "alias_first_name, alias_last_name")
})
@EntityListeners(AuditingEntityListener.class)
public class IdentityAlias {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_identity_id", nullable = false)
    @NotNull(message = "Patient identity is required")
    private PatientIdentity patientIdentity;

    @Column(name = "alias_type", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    @NotNull(message = "Alias type is required")
    private AliasType aliasType;

    @Column(name = "alias_first_name", length = 100)
    @Size(max = 100, message = "Alias first name must not exceed 100 characters")
    private String aliasFirstName;

    @Column(name = "alias_middle_name", length = 100)
    @Size(max = 100, message = "Alias middle name must not exceed 100 characters")
    private String aliasMiddleName;

    @Column(name = "alias_last_name", length = 100)
    @Size(max = 100, message = "Alias last name must not exceed 100 characters")
    private String aliasLastName;

    @Column(name = "alias_suffix", length = 20)
    @Size(max = 20, message = "Alias suffix must not exceed 20 characters")
    private String aliasSuffix;

    @Column(name = "full_alias_name", length = 300)
    @Size(max = 300, message = "Full alias name must not exceed 300 characters")
    private String fullAliasName;

    @Column(name = "source_system", length = 50)
    @Size(max = 50, message = "Source system must not exceed 50 characters")
    private String sourceSystem;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "effective_date")
    private LocalDateTime effectiveDate;

    @Column(name = "end_date")
    private LocalDateTime endDate;

    @Column(name = "reason", columnDefinition = "TEXT")
    private String reason;

    @CreatedDate
    @Column(name = "created_date", nullable = false, updatable = false)
    private LocalDateTime createdDate;

    @Column(name = "created_by", length = 100)
    @Size(max = 100, message = "Created by must not exceed 100 characters")
    private String createdBy;

    // Constructors
    public IdentityAlias() {}

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public PatientIdentity getPatientIdentity() {
        return patientIdentity;
    }

    public void setPatientIdentity(PatientIdentity patientIdentity) {
        this.patientIdentity = patientIdentity;
    }

    public AliasType getAliasType() {
        return aliasType;
    }

    public void setAliasType(AliasType aliasType) {
        this.aliasType = aliasType;
    }

    public String getAliasFirstName() {
        return aliasFirstName;
    }

    public void setAliasFirstName(String aliasFirstName) {
        this.aliasFirstName = aliasFirstName;
    }

    public String getAliasMiddleName() {
        return aliasMiddleName;
    }

    public void setAliasMiddleName(String aliasMiddleName) {
        this.aliasMiddleName = aliasMiddleName;
    }

    public String getAliasLastName() {
        return aliasLastName;
    }

    public void setAliasLastName(String aliasLastName) {
        this.aliasLastName = aliasLastName;
    }

    public String getAliasSuffix() {
        return aliasSuffix;
    }

    public void setAliasSuffix(String aliasSuffix) {
        this.aliasSuffix = aliasSuffix;
    }

    public String getFullAliasName() {
        return fullAliasName;
    }

    public void setFullAliasName(String fullAliasName) {
        this.fullAliasName = fullAliasName;
    }

    public String getSourceSystem() {
        return sourceSystem;
    }

    public void setSourceSystem(String sourceSystem) {
        this.sourceSystem = sourceSystem;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public LocalDateTime getEffectiveDate() {
        return effectiveDate;
    }

    public void setEffectiveDate(LocalDateTime effectiveDate) {
        this.effectiveDate = effectiveDate;
    }

    public LocalDateTime getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDateTime endDate) {
        this.endDate = endDate;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public LocalDateTime getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(LocalDateTime createdDate) {
        this.createdDate = createdDate;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }
}
