package com.hospital.hms.mpiintegration.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Identity Match Entity for tracking patient identity matches
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Entity
@Table(name = "identity_matches", indexes = {
    @Index(name = "idx_match_patient", columnList = "patient_identity_id"),
    @Index(name = "idx_match_candidate", columnList = "candidate_identity_id"),
    @Index(name = "idx_match_score", columnList = "match_score"),
    @Index(name = "idx_match_status", columnList = "match_status")
})
@EntityListeners(AuditingEntityListener.class)
public class IdentityMatch {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_identity_id", nullable = false)
    @NotNull(message = "Patient identity is required")
    private PatientIdentity patientIdentity;

    @Column(name = "candidate_identity_id", nullable = false)
    @NotNull(message = "Candidate identity ID is required")
    private UUID candidateIdentityId;

    @Column(name = "match_score", precision = 5, scale = 2, nullable = false)
    @NotNull(message = "Match score is required")
    @DecimalMin(value = "0.0", message = "Match score must be non-negative")
    @DecimalMax(value = "100.0", message = "Match score must not exceed 100")
    private Double matchScore;

    @Column(name = "match_algorithm", length = 50)
    @Size(max = 50, message = "Match algorithm must not exceed 50 characters")
    private String matchAlgorithm;

    @Column(name = "match_status", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    @NotNull(message = "Match status is required")
    private MatchStatus matchStatus;

    @Column(name = "match_type", length = 20)
    @Enumerated(EnumType.STRING)
    private MatchType matchType;

    @Column(name = "match_reason", columnDefinition = "TEXT")
    private String matchReason;

    @Column(name = "reviewed_by", length = 100)
    @Size(max = 100, message = "Reviewed by must not exceed 100 characters")
    private String reviewedBy;

    @Column(name = "reviewed_date")
    private LocalDateTime reviewedDate;

    @Column(name = "is_auto_match")
    private Boolean isAutoMatch = false;

    @CreatedDate
    @Column(name = "created_date", nullable = false, updatable = false)
    private LocalDateTime createdDate;

    @Column(name = "created_by", length = 100)
    @Size(max = 100, message = "Created by must not exceed 100 characters")
    private String createdBy;

    // Constructors
    public IdentityMatch() {}

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

    public UUID getCandidateIdentityId() {
        return candidateIdentityId;
    }

    public void setCandidateIdentityId(UUID candidateIdentityId) {
        this.candidateIdentityId = candidateIdentityId;
    }

    public Double getMatchScore() {
        return matchScore;
    }

    public void setMatchScore(Double matchScore) {
        this.matchScore = matchScore;
    }

    public String getMatchAlgorithm() {
        return matchAlgorithm;
    }

    public void setMatchAlgorithm(String matchAlgorithm) {
        this.matchAlgorithm = matchAlgorithm;
    }

    public MatchStatus getMatchStatus() {
        return matchStatus;
    }

    public void setMatchStatus(MatchStatus matchStatus) {
        this.matchStatus = matchStatus;
    }

    public MatchType getMatchType() {
        return matchType;
    }

    public void setMatchType(MatchType matchType) {
        this.matchType = matchType;
    }

    public String getMatchReason() {
        return matchReason;
    }

    public void setMatchReason(String matchReason) {
        this.matchReason = matchReason;
    }

    public String getReviewedBy() {
        return reviewedBy;
    }

    public void setReviewedBy(String reviewedBy) {
        this.reviewedBy = reviewedBy;
    }

    public LocalDateTime getReviewedDate() {
        return reviewedDate;
    }

    public void setReviewedDate(LocalDateTime reviewedDate) {
        this.reviewedDate = reviewedDate;
    }

    public Boolean getIsAutoMatch() {
        return isAutoMatch;
    }

    public void setIsAutoMatch(Boolean isAutoMatch) {
        this.isAutoMatch = isAutoMatch;
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
