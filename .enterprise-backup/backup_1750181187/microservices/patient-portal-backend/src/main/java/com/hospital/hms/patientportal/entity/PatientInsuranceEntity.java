package com.hospital.hms.patientportal.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Patient Insurance Entity
 * 
 * Manages patient insurance information and coverage details.
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Entity
@Table(name = "patient_insurance", indexes = {
    @Index(name = "idx_insurance_patient", columnList = "patient_id"),
    @Index(name = "idx_insurance_policy", columnList = "policy_number"),
    @Index(name = "idx_insurance_status", columnList = "status"),
    @Index(name = "idx_insurance_primary", columnList = "is_primary"),
    @Index(name = "idx_insurance_effective", columnList = "effective_date"),
    @Index(name = "idx_insurance_expiry", columnList = "expiry_date")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PatientInsuranceEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "insurance_id")
    private String insuranceId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private PatientEntity patient;

    @Column(name = "insurance_company", nullable = false, length = 200)
    private String insuranceCompany;

    @Column(name = "insurance_company_id", length = 50)
    private String insuranceCompanyId;

    @Column(name = "plan_name", length = 200)
    private String planName;

    @Column(name = "plan_type", length = 100)
    private String planType;

    @Column(name = "policy_number", nullable = false, length = 100)
    private String policyNumber;

    @Column(name = "group_number", length = 100)
    private String groupNumber;

    @Column(name = "member_id", length = 100)
    private String memberId;

    @Column(name = "subscriber_name", length = 200)
    private String subscriberName;

    @Column(name = "subscriber_id", length = 100)
    private String subscriberId;

    @Column(name = "subscriber_date_of_birth")
    private LocalDate subscriberDateOfBirth;

    @Enumerated(EnumType.STRING)
    @Column(name = "relationship_to_subscriber")
    private RelationshipToSubscriber relationshipToSubscriber;

    @Column(name = "is_primary", nullable = false)
    @Builder.Default
    private Boolean isPrimary = false;

    @Column(name = "coverage_order")
    @Builder.Default
    private Integer coverageOrder = 1;

    @Column(name = "effective_date", nullable = false)
    private LocalDate effectiveDate;

    @Column(name = "expiry_date")
    private LocalDate expiryDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    @Builder.Default
    private InsuranceStatus status = InsuranceStatus.ACTIVE;

    @Column(name = "deductible_amount")
    private Double deductibleAmount;

    @Column(name = "deductible_met_amount")
    @Builder.Default
    private Double deductibleMetAmount = 0.0;

    @Column(name = "out_of_pocket_max")
    private Double outOfPocketMax;

    @Column(name = "out_of_pocket_met")
    @Builder.Default
    private Double outOfPocketMet = 0.0;

    @Column(name = "copay_primary_care")
    private Double copayPrimaryCare;

    @Column(name = "copay_specialist")
    private Double copaySpecialist;

    @Column(name = "copay_emergency")
    private Double copayEmergency;

    @Column(name = "copay_urgent_care")
    private Double copayUrgentCare;

    @Column(name = "coinsurance_percentage")
    private Double coinsurancePercentage;

    @Column(name = "network_tier", length = 50)
    private String networkTier;

    @Column(name = "requires_referral")
    @Builder.Default
    private Boolean requiresReferral = false;

    @Column(name = "requires_authorization")
    @Builder.Default
    private Boolean requiresAuthorization = false;

    @Column(name = "prescription_coverage")
    @Builder.Default
    private Boolean prescriptionCoverage = true;

    @Column(name = "dental_coverage")
    @Builder.Default
    private Boolean dentalCoverage = false;

    @Column(name = "vision_coverage")
    @Builder.Default
    private Boolean visionCoverage = false;

    @Column(name = "mental_health_coverage")
    @Builder.Default
    private Boolean mentalHealthCoverage = true;

    @Column(name = "pharmacy_network", length = 200)
    private String pharmacyNetwork;

    @Column(name = "customer_service_phone", length = 20)
    private String customerServicePhone;

    @Column(name = "claims_address", length = 500)
    private String claimsAddress;

    @Column(name = "employer_name", length = 200)
    private String employerName;

    @Column(name = "employer_id", length = 50)
    private String employerId;

    @Column(name = "card_front_image_url", length = 500)
    private String cardFrontImageUrl;

    @Column(name = "card_back_image_url", length = 500)
    private String cardBackImageUrl;

    @Column(name = "verification_status", length = 50)
    @Builder.Default
    private String verificationStatus = "PENDING";

    @Column(name = "last_verified_date")
    private LocalDateTime lastVerifiedDate;

    @Column(name = "eligibility_checked_date")
    private LocalDateTime eligibilityCheckedDate;

    @Column(name = "eligibility_status", length = 50)
    private String eligibilityStatus;

    @Column(name = "eligibility_response", length = 2000)
    private String eligibilityResponse;

    @Column(name = "benefits_summary", length = 2000)
    private String benefitsSummary;

    @Column(name = "prior_authorization_required")
    @Builder.Default
    private Boolean priorAuthorizationRequired = false;

    @Column(name = "step_therapy_required")
    @Builder.Default
    private Boolean stepTherapyRequired = false;

    @Column(name = "formulary_restrictions")
    @Builder.Default
    private Boolean formularyRestrictions = false;

    @Column(name = "notes", length = 1000)
    private String notes;

    @Column(name = "is_verified")
    @Builder.Default
    private Boolean isVerified = false;

    @Column(name = "verified_by", length = 100)
    private String verifiedBy;

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
    public enum RelationshipToSubscriber {
        SELF,
        SPOUSE,
        CHILD,
        PARENT,
        SIBLING,
        DOMESTIC_PARTNER,
        OTHER
    }

    public enum InsuranceStatus {
        ACTIVE,
        INACTIVE,
        PENDING,
        SUSPENDED,
        TERMINATED,
        EXPIRED
    }

    // Helper methods
    public boolean isActive() {
        return status == InsuranceStatus.ACTIVE && 
               !isExpired() && 
               isEffective();
    }

    public boolean isExpired() {
        return expiryDate != null && expiryDate.isBefore(LocalDate.now());
    }

    public boolean isEffective() {
        return effectiveDate.isBefore(LocalDate.now()) || 
               effectiveDate.equals(LocalDate.now());
    }

    public boolean isNearExpiry(int daysWarning) {
        return expiryDate != null && 
               expiryDate.isBefore(LocalDate.now().plusDays(daysWarning));
    }

    public boolean hasDeductible() {
        return deductibleAmount != null && deductibleAmount > 0;
    }

    public boolean isDeductibleMet() {
        return hasDeductible() && 
               deductibleMetAmount != null &&
               deductibleMetAmount >= deductibleAmount;
    }

    public Double getRemainingDeductible() {
        if (!hasDeductible()) return 0.0;
        double remaining = deductibleAmount - (deductibleMetAmount != null ? deductibleMetAmount : 0.0);
        return Math.max(0.0, remaining);
    }

    public boolean hasOutOfPocketMax() {
        return outOfPocketMax != null && outOfPocketMax > 0;
    }

    public boolean isOutOfPocketMaxMet() {
        return hasOutOfPocketMax() && 
               outOfPocketMet != null &&
               outOfPocketMet >= outOfPocketMax;
    }

    public Double getRemainingOutOfPocket() {
        if (!hasOutOfPocketMax()) return null;
        double remaining = outOfPocketMax - (outOfPocketMet != null ? outOfPocketMet : 0.0);
        return Math.max(0.0, remaining);
    }

    public boolean needsVerification() {
        return !isVerified || 
               lastVerifiedDate == null ||
               lastVerifiedDate.isBefore(LocalDateTime.now().minusMonths(6));
    }

    public boolean needsEligibilityCheck() {
        return eligibilityCheckedDate == null ||
               eligibilityCheckedDate.isBefore(LocalDateTime.now().minusDays(30));
    }

    public String getCoverageLevel() {
        if (isPrimary) return "Primary";
        if (coverageOrder == 2) return "Secondary";
        if (coverageOrder == 3) return "Tertiary";
        return "Additional";
    }

    public boolean hasSpecialtyServices() {
        return dentalCoverage || visionCoverage || mentalHealthCoverage;
    }

    public Double getEstimatedCopay(String serviceType) {
        switch (serviceType.toUpperCase()) {
            case "PRIMARY_CARE":
                return copayPrimaryCare;
            case "SPECIALIST":
                return copaySpecialist;
            case "EMERGENCY":
                return copayEmergency;
            case "URGENT_CARE":
                return copayUrgentCare;
            default:
                return null;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        // Auto-update status based on dates
        if (isExpired() && status == InsuranceStatus.ACTIVE) {
            status = InsuranceStatus.EXPIRED;
        }
        
        // Auto-set primary insurance logic
        // Note: In real implementation, this would be handled at service level
        // to ensure only one primary insurance per patient
    }
}