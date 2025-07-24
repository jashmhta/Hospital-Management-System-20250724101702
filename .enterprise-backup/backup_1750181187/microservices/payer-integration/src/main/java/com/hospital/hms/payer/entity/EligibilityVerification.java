package com.hospital.hms.payer.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Eligibility Verification Entity
 * 
 * Represents insurance eligibility verification requests and responses
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Entity
@Table(name = "eligibility_verifications", indexes = {
    @Index(name = "idx_patient_id", columnList = "patientId"),
    @Index(name = "idx_payer_id", columnList = "payerId"),
    @Index(name = "idx_verification_date", columnList = "verificationDate"),
    @Index(name = "idx_verification_status", columnList = "verificationStatus"),
    @Index(name = "idx_policy_number", columnList = "policyNumber"),
    @Index(name = "idx_member_id", columnList = "memberId")
})
@EntityListeners(AuditingEntityListener.class)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EligibilityVerification {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @NotNull
    @Column(name = "patient_id", nullable = false)
    private UUID patientId;

    @NotNull
    @Column(name = "payer_id", nullable = false)
    private UUID payerId;

    @Size(max = 200)
    @Column(name = "payer_name")
    private String payerName;

    @Size(max = 50)
    @Column(name = "member_id")
    private String memberId;

    @Size(max = 50)
    @Column(name = "policy_number")
    private String policyNumber;

    @Size(max = 50)
    @Column(name = "group_number")
    private String groupNumber;

    @Column(name = "verification_date")
    private LocalDateTime verificationDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "verification_status")
    private VerificationStatus verificationStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "coverage_status")
    private CoverageStatus coverageStatus;

    @Column(name = "effective_date")
    private LocalDateTime effectiveDate;

    @Column(name = "termination_date")
    private LocalDateTime terminationDate;

    @Column(name = "plan_begin_date")
    private LocalDateTime planBeginDate;

    @Column(name = "plan_end_date")
    private LocalDateTime planEndDate;

    // Coverage Details
    @Size(max = 200)
    @Column(name = "plan_name")
    private String planName;

    @Size(max = 100)
    @Column(name = "plan_type")
    private String planType;

    @Size(max = 100)
    @Column(name = "network_status")
    private String networkStatus;

    @Column(name = "is_active")
    private Boolean isActive;

    // Benefit Information
    @Column(name = "deductible_amount", precision = 12, scale = 2)
    private BigDecimal deductibleAmount;

    @Column(name = "deductible_remaining", precision = 12, scale = 2)
    private BigDecimal deductibleRemaining;

    @Column(name = "out_of_pocket_max", precision = 12, scale = 2)
    private BigDecimal outOfPocketMax;

    @Column(name = "out_of_pocket_remaining", precision = 12, scale = 2)
    private BigDecimal outOfPocketRemaining;

    @Column(name = "copay_amount", precision = 12, scale = 2)
    private BigDecimal copayAmount;

    @Column(name = "coinsurance_percentage")
    private Integer coinsurancePercentage;

    @Column(name = "lifetime_maximum", precision = 12, scale = 2)
    private BigDecimal lifetimeMaximum;

    @Column(name = "lifetime_remaining", precision = 12, scale = 2)
    private BigDecimal lifetimeRemaining;

    // Service-Specific Coverage
    @Column(name = "office_visit_copay", precision = 12, scale = 2)
    private BigDecimal officeVisitCopay;

    @Column(name = "specialist_copay", precision = 12, scale = 2)
    private BigDecimal specialistCopay;

    @Column(name = "emergency_copay", precision = 12, scale = 2)
    private BigDecimal emergencyCopay;

    @Column(name = "urgent_care_copay", precision = 12, scale = 2)
    private BigDecimal urgentCareCopay;

    @Column(name = "inpatient_covered")
    private Boolean inpatientCovered;

    @Column(name = "outpatient_covered")
    private Boolean outpatientCovered;

    @Column(name = "emergency_covered")
    private Boolean emergencyCovered;

    @Column(name = "mental_health_covered")
    private Boolean mentalHealthCovered;

    @Column(name = "substance_abuse_covered")
    private Boolean substanceAbuseCovered;

    @Column(name = "maternity_covered")
    private Boolean maternityCovered;

    @Column(name = "prescription_covered")
    private Boolean prescriptionCovered;

    @Column(name = "vision_covered")
    private Boolean visionCovered;

    @Column(name = "dental_covered")
    private Boolean dentalCovered;

    @Column(name = "preventive_covered")
    private Boolean preventiveCovered;

    @Column(name = "rehab_covered")
    private Boolean rehabCovered;

    @Column(name = "home_health_covered")
    private Boolean homeHealthCovered;

    @Column(name = "dme_covered")
    private Boolean dmeCovered;

    // Primary Care Provider Information
    @Size(max = 200)
    @Column(name = "pcp_name")
    private String pcpName;

    @Size(max = 20)
    @Column(name = "pcp_npi")
    private String pcpNpi;

    @Size(max = 100)
    @Column(name = "pcp_phone")
    private String pcpPhone;

    @Column(name = "referral_required")
    private Boolean referralRequired;

    // Authorization Information
    @Column(name = "authorization_required")
    private Boolean authorizationRequired;

    @Size(max = 1000)
    @Column(name = "services_requiring_auth")
    private String servicesRequiringAuth;

    // Additional Coverage
    @Column(name = "has_secondary_insurance")
    private Boolean hasSecondaryInsurance;

    @Size(max = 200)
    @Column(name = "secondary_payer_name")
    private String secondaryPayerName;

    @Size(max = 50)
    @Column(name = "secondary_member_id")
    private String secondaryMemberId;

    @Size(max = 50)
    @Column(name = "secondary_policy_number")
    private String secondaryPolicyNumber;

    @Enumerated(EnumType.STRING)
    @Column(name = "coordination_of_benefits")
    private CoordinationOfBenefits coordinationOfBenefits;

    // Request Information
    @Size(max = 100)
    @Column(name = "requesting_provider_npi")
    private String requestingProviderNpi;

    @Size(max = 200)
    @Column(name = "requesting_provider_name")
    private String requestingProviderName;

    @Size(max = 50)
    @Column(name = "service_type_code")
    private String serviceTypeCode;

    @Size(max = 200)
    @Column(name = "service_type_description")
    private String serviceTypeDescription;

    @Column(name = "service_date")
    private LocalDateTime serviceDate;

    // Response Information
    @Size(max = 50)
    @Column(name = "transaction_id")
    private String transactionId;

    @Size(max = 50)
    @Column(name = "trace_number")
    private String traceNumber;

    @Column(name = "response_date")
    private LocalDateTime responseDate;

    @Size(max = 2000)
    @Column(name = "response_message")
    private String responseMessage;

    @Size(max = 1000)
    @Column(name = "error_message")
    private String errorMessage;

    @Size(max = 500)
    @Column(name = "rejection_reason")
    private String rejectionReason;

    // Cache Information
    @Column(name = "cache_expiry")
    private LocalDateTime cacheExpiry;

    @Column(name = "is_cached_response")
    private Boolean isCachedResponse;

    // EDI Information
    @Size(max = 50)
    @Column(name = "edi_transaction_set")
    private String ediTransactionSet;

    @Column(name = "edi_raw_request", columnDefinition = "TEXT")
    private String ediRawRequest;

    @Column(name = "edi_raw_response", columnDefinition = "TEXT")
    private String ediRawResponse;

    // Notes
    @Size(max = 2000)
    @Column(name = "notes")
    private String notes;

    @Size(max = 1000)
    @Column(name = "internal_notes")
    private String internalNotes;

    // FHIR Integration
    @Size(max = 100)
    @Column(name = "fhir_resource_id")
    private String fhirResourceId;

    @Size(max = 50)
    @Column(name = "fhir_resource_type")
    private String fhirResourceType;

    // Audit Information
    @CreatedBy
    @Size(max = 100)
    @Column(name = "created_by", updatable = false)
    private String createdBy;

    @CreatedDate
    @Column(name = "created_date", updatable = false)
    private LocalDateTime createdDate;

    @LastModifiedBy
    @Size(max = 100)
    @Column(name = "last_modified_by")
    private String lastModifiedBy;

    @LastModifiedDate
    @Column(name = "last_modified_date")
    private LocalDateTime lastModifiedDate;

    // Helper Methods
    public boolean isVerified() {
        return verificationStatus == VerificationStatus.VERIFIED;
    }

    public boolean isActive() {
        return Boolean.TRUE.equals(isActive) && 
               coverageStatus == CoverageStatus.ACTIVE &&
               (terminationDate == null || LocalDateTime.now().isBefore(terminationDate));
    }

    public boolean isExpired() {
        return cacheExpiry != null && LocalDateTime.now().isAfter(cacheExpiry);
    }

    public boolean hasCoverage() {
        return isActive() && coverageStatus == CoverageStatus.ACTIVE;
    }

    public boolean requiresReferral() {
        return Boolean.TRUE.equals(referralRequired);
    }

    public boolean requiresAuthorization() {
        return Boolean.TRUE.equals(authorizationRequired);
    }

    public boolean hasSecondaryInsurance() {
        return Boolean.TRUE.equals(hasSecondaryInsurance);
    }

    public boolean isInNetwork() {
        return "IN_NETWORK".equalsIgnoreCase(networkStatus);
    }

    public BigDecimal getEffectiveCopay(String serviceType) {
        if (serviceType == null) return copayAmount;
        
        switch (serviceType.toUpperCase()) {
            case "OFFICE_VISIT":
                return officeVisitCopay != null ? officeVisitCopay : copayAmount;
            case "SPECIALIST":
                return specialistCopay != null ? specialistCopay : copayAmount;
            case "EMERGENCY":
                return emergencyCopay != null ? emergencyCopay : copayAmount;
            case "URGENT_CARE":
                return urgentCareCopay != null ? urgentCareCopay : copayAmount;
            default:
                return copayAmount;
        }
    }
}
