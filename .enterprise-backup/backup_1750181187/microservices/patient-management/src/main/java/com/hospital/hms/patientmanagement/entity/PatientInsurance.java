package com.hospital.hms.patientmanagement.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Patient Insurance Entity
 * 
 * Represents a patient's insurance coverage information.
 * Based on FHIR R4 Coverage resource.
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Entity
@Table(name = "patient_insurances", indexes = {
    @Index(name = "idx_insurance_patient", columnList = "patient_id"),
    @Index(name = "idx_insurance_primary", columnList = "is_primary"),
    @Index(name = "idx_insurance_policy", columnList = "policy_number"),
    @Index(name = "idx_insurance_payer", columnList = "payer_name"),
    @Index(name = "idx_insurance_active", columnList = "active")
})
@EntityListeners(AuditingEntityListener.class)
public class PatientInsurance {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @Column(name = "is_primary", nullable = false)
    private Boolean primary = false;

    @Column(name = "rank_order", nullable = false)
    @Min(value = 1, message = "Rank order must be at least 1")
    private Integer rankOrder = 1;

    @Column(name = "payer_name", nullable = false, length = 200)
    @NotBlank(message = "Payer name is required")
    @Size(max = 200, message = "Payer name must not exceed 200 characters")
    private String payerName;

    @Column(name = "payer_id", length = 100)
    @Size(max = 100, message = "Payer ID must not exceed 100 characters")
    private String payerId;

    @Column(name = "plan_name", length = 200)
    @Size(max = 200, message = "Plan name must not exceed 200 characters")
    private String planName;

    @Column(name = "plan_type", length = 50)
    @Enumerated(EnumType.STRING)
    private InsurancePlanType planType;

    @Column(name = "policy_number", nullable = false, length = 100)
    @NotBlank(message = "Policy number is required")
    @Size(max = 100, message = "Policy number must not exceed 100 characters")
    private String policyNumber;

    @Column(name = "policy_holder_name", length = 200)
    @Size(max = 200, message = "Policy holder name must not exceed 200 characters")
    private String policyHolderName;

    @Column(name = "policy_holder_relationship", length = 50)
    @Enumerated(EnumType.STRING)
    private PolicyHolderRelationship policyHolderRelationship;

    @Column(name = "group_number", length = 100)
    @Size(max = 100, message = "Group number must not exceed 100 characters")
    private String groupNumber;

    @Column(name = "member_id", length = 100)
    @Size(max = 100, message = "Member ID must not exceed 100 characters")
    private String memberId;

    @Column(name = "dependent_number", length = 20)
    @Size(max = 20, message = "Dependent number must not exceed 20 characters")
    private String dependentNumber;

    @Column(name = "effective_date")
    private LocalDate effectiveDate;

    @Column(name = "expiration_date")
    private LocalDate expirationDate;

    @Column(name = "copay_amount")
    @DecimalMin(value = "0.0", message = "Copay amount must be non-negative")
    private Double copayAmount;

    @Column(name = "deductible_amount")
    @DecimalMin(value = "0.0", message = "Deductible amount must be non-negative")
    private Double deductibleAmount;

    @Column(name = "coverage_percentage")
    @DecimalMin(value = "0.0", message = "Coverage percentage must be non-negative")
    @DecimalMax(value = "100.0", message = "Coverage percentage must not exceed 100")
    private Double coveragePercentage;

    @Column(name = "authorization_required")
    private Boolean authorizationRequired = false;

    @Column(name = "referral_required")
    private Boolean referralRequired = false;

    @Column(name = "verification_status", length = 20)
    @Enumerated(EnumType.STRING)
    private VerificationStatus verificationStatus;

    @Column(name = "verification_date")
    private LocalDate verificationDate;

    @Column(name = "verified_by", length = 100)
    @Size(max = 100, message = "Verified by must not exceed 100 characters")
    private String verifiedBy;

    @Column(name = "eligibility_status", length = 20)
    @Enumerated(EnumType.STRING)
    private EligibilityStatus eligibilityStatus;

    @Column(name = "eligibility_checked_date")
    private LocalDate eligibilityCheckedDate;

    @Column(name = "payer_phone", length = 20)
    @Pattern(regexp = "^[\\+]?[1-9][\\d\\s\\-\\(\\)]{7,15}$", message = "Invalid payer phone format")
    private String payerPhone;

    @Column(name = "payer_website", length = 500)
    @Size(max = 500, message = "Payer website must not exceed 500 characters")
    private String payerWebsite;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @Column(name = "active", nullable = false)
    private Boolean active = true;

    // Audit fields
    @CreatedDate
    @Column(name = "created_date", nullable = false, updatable = false)
    private LocalDateTime createdDate;

    @LastModifiedDate
    @Column(name = "last_modified_date")
    private LocalDateTime lastModifiedDate;

    @Version
    @Column(name = "version")
    private Long version;

    // Constructors
    public PatientInsurance() {
        this.id = UUID.randomUUID();
    }

    public PatientInsurance(Patient patient, String payerName, String policyNumber) {
        this();
        this.patient = patient;
        this.payerName = payerName;
        this.policyNumber = policyNumber;
    }

    // Business Methods
    
    /**
     * Check if insurance is currently active based on dates
     */
    public boolean isCurrentlyActive() {
        if (!active) {
            return false;
        }
        
        LocalDate today = LocalDate.now();
        
        if (effectiveDate != null && today.isBefore(effectiveDate)) {
            return false;
        }
        
        if (expirationDate != null && today.isAfter(expirationDate)) {
            return false;
        }
        
        return true;
    }

    /**
     * Check if insurance needs verification
     */
    public boolean needsVerification() {
        if (verificationStatus == null || verificationStatus == VerificationStatus.NOT_VERIFIED) {
            return true;
        }
        
        if (verificationDate == null) {
            return true;
        }
        
        // Need verification if last verified more than 30 days ago
        return verificationDate.isBefore(LocalDate.now().minusDays(30));
    }

    /**
     * Check if eligibility needs to be verified
     */
    public boolean needsEligibilityCheck() {
        if (eligibilityStatus == null || eligibilityStatus == EligibilityStatus.UNKNOWN) {
            return true;
        }
        
        if (eligibilityCheckedDate == null) {
            return true;
        }
        
        // Need eligibility check if last checked more than 7 days ago
        return eligibilityCheckedDate.isBefore(LocalDate.now().minusDays(7));
    }

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Patient getPatient() { return patient; }
    public void setPatient(Patient patient) { this.patient = patient; }

    public Boolean isPrimary() { return primary; }
    public void setPrimary(Boolean primary) { this.primary = primary; }

    public Integer getRankOrder() { return rankOrder; }
    public void setRankOrder(Integer rankOrder) { this.rankOrder = rankOrder; }

    public String getPayerName() { return payerName; }
    public void setPayerName(String payerName) { this.payerName = payerName; }

    public String getPayerId() { return payerId; }
    public void setPayerId(String payerId) { this.payerId = payerId; }

    public String getPlanName() { return planName; }
    public void setPlanName(String planName) { this.planName = planName; }

    public InsurancePlanType getPlanType() { return planType; }
    public void setPlanType(InsurancePlanType planType) { this.planType = planType; }

    public String getPolicyNumber() { return policyNumber; }
    public void setPolicyNumber(String policyNumber) { this.policyNumber = policyNumber; }

    public String getPolicyHolderName() { return policyHolderName; }
    public void setPolicyHolderName(String policyHolderName) { this.policyHolderName = policyHolderName; }

    public PolicyHolderRelationship getPolicyHolderRelationship() { return policyHolderRelationship; }
    public void setPolicyHolderRelationship(PolicyHolderRelationship policyHolderRelationship) { this.policyHolderRelationship = policyHolderRelationship; }

    public String getGroupNumber() { return groupNumber; }
    public void setGroupNumber(String groupNumber) { this.groupNumber = groupNumber; }

    public String getMemberId() { return memberId; }
    public void setMemberId(String memberId) { this.memberId = memberId; }

    public String getDependentNumber() { return dependentNumber; }
    public void setDependentNumber(String dependentNumber) { this.dependentNumber = dependentNumber; }

    public LocalDate getEffectiveDate() { return effectiveDate; }
    public void setEffectiveDate(LocalDate effectiveDate) { this.effectiveDate = effectiveDate; }

    public LocalDate getExpirationDate() { return expirationDate; }
    public void setExpirationDate(LocalDate expirationDate) { this.expirationDate = expirationDate; }

    public Double getCopayAmount() { return copayAmount; }
    public void setCopayAmount(Double copayAmount) { this.copayAmount = copayAmount; }

    public Double getDeductibleAmount() { return deductibleAmount; }
    public void setDeductibleAmount(Double deductibleAmount) { this.deductibleAmount = deductibleAmount; }

    public Double getCoveragePercentage() { return coveragePercentage; }
    public void setCoveragePercentage(Double coveragePercentage) { this.coveragePercentage = coveragePercentage; }

    public Boolean getAuthorizationRequired() { return authorizationRequired; }
    public void setAuthorizationRequired(Boolean authorizationRequired) { this.authorizationRequired = authorizationRequired; }

    public Boolean getReferralRequired() { return referralRequired; }
    public void setReferralRequired(Boolean referralRequired) { this.referralRequired = referralRequired; }

    public VerificationStatus getVerificationStatus() { return verificationStatus; }
    public void setVerificationStatus(VerificationStatus verificationStatus) { this.verificationStatus = verificationStatus; }

    public LocalDate getVerificationDate() { return verificationDate; }
    public void setVerificationDate(LocalDate verificationDate) { this.verificationDate = verificationDate; }

    public String getVerifiedBy() { return verifiedBy; }
    public void setVerifiedBy(String verifiedBy) { this.verifiedBy = verifiedBy; }

    public EligibilityStatus getEligibilityStatus() { return eligibilityStatus; }
    public void setEligibilityStatus(EligibilityStatus eligibilityStatus) { this.eligibilityStatus = eligibilityStatus; }

    public LocalDate getEligibilityCheckedDate() { return eligibilityCheckedDate; }
    public void setEligibilityCheckedDate(LocalDate eligibilityCheckedDate) { this.eligibilityCheckedDate = eligibilityCheckedDate; }

    public String getPayerPhone() { return payerPhone; }
    public void setPayerPhone(String payerPhone) { this.payerPhone = payerPhone; }

    public String getPayerWebsite() { return payerWebsite; }
    public void setPayerWebsite(String payerWebsite) { this.payerWebsite = payerWebsite; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }

    public LocalDateTime getCreatedDate() { return createdDate; }
    public void setCreatedDate(LocalDateTime createdDate) { this.createdDate = createdDate; }

    public LocalDateTime getLastModifiedDate() { return lastModifiedDate; }
    public void setLastModifiedDate(LocalDateTime lastModifiedDate) { this.lastModifiedDate = lastModifiedDate; }

    public Long getVersion() { return version; }
    public void setVersion(Long version) { this.version = version; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof PatientInsurance)) return false;
        PatientInsurance that = (PatientInsurance) o;
        return id != null && id.equals(that.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    @Override
    public String toString() {
        return "PatientInsurance{" +
                "id=" + id +
                ", payerName='" + payerName + '\'' +
                ", policyNumber='" + policyNumber + '\'' +
                ", primary=" + primary +
                ", active=" + active +
                '}';
    }
}

/**
 * Insurance Plan Type enumeration
 */
enum InsurancePlanType {
    HMO("HMO", "Health Maintenance Organization"),
    PPO("PPO", "Preferred Provider Organization"),
    EPO("EPO", "Exclusive Provider Organization"),
    POS("POS", "Point of Service"),
    INDEMNITY("INDEMNITY", "Indemnity"),
    MEDICARE("MEDICARE", "Medicare"),
    MEDICAID("MEDICAID", "Medicaid"),
    TRICARE("TRICARE", "TRICARE"),
    SELF_PAY("SELF_PAY", "Self Pay"),
    OTHER("OTHER", "Other");

    private final String code;
    private final String display;

    InsurancePlanType(String code, String display) {
        this.code = code;
        this.display = display;
    }

    public String getCode() { return code; }
    public String getDisplay() { return display; }
}

/**
 * Policy Holder Relationship enumeration
 */
enum PolicyHolderRelationship {
    SELF("self", "Self"),
    SPOUSE("spouse", "Spouse"),
    CHILD("child", "Child"),
    PARENT("parent", "Parent"),
    SIBLING("sibling", "Sibling"),
    GUARDIAN("guardian", "Guardian"),
    OTHER("other", "Other");

    private final String code;
    private final String display;

    PolicyHolderRelationship(String code, String display) {
        this.code = code;
        this.display = display;
    }

    public String getCode() { return code; }
    public String getDisplay() { return display; }
}

/**
 * Verification Status enumeration
 */
enum VerificationStatus {
    VERIFIED("verified", "Verified"),
    NOT_VERIFIED("not_verified", "Not Verified"),
    PENDING("pending", "Pending Verification"),
    FAILED("failed", "Verification Failed"),
    EXPIRED("expired", "Verification Expired");

    private final String code;
    private final String display;

    VerificationStatus(String code, String display) {
        this.code = code;
        this.display = display;
    }

    public String getCode() { return code; }
    public String getDisplay() { return display; }
}

/**
 * Eligibility Status enumeration
 */
enum EligibilityStatus {
    ELIGIBLE("eligible", "Eligible"),
    NOT_ELIGIBLE("not_eligible", "Not Eligible"),
    UNKNOWN("unknown", "Unknown"),
    PENDING("pending", "Pending Check"),
    ERROR("error", "Check Error");

    private final String code;
    private final String display;

    EligibilityStatus(String code, String display) {
        this.code = code;
        this.display = display;
    }

    public String getCode() { return code; }
    public String getDisplay() { return display; }
}
