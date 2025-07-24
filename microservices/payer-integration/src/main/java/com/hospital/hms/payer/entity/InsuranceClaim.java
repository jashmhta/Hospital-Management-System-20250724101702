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
 * Insurance Claim Entity
 * 
 * Represents an insurance claim for medical services
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Entity
@Table(name = "insurance_claims", indexes = {
    @Index(name = "idx_claim_number", columnList = "claimNumber"),
    @Index(name = "idx_patient_id", columnList = "patientId"),
    @Index(name = "idx_encounter_id", columnList = "encounterId"),
    @Index(name = "idx_payer_id", columnList = "payerId"),
    @Index(name = "idx_claim_status", columnList = "claimStatus"),
    @Index(name = "idx_service_date", columnList = "serviceDate"),
    @Index(name = "idx_submission_date", columnList = "submissionDate"),
    @Index(name = "idx_auth_number", columnList = "authorizationNumber")
})
@EntityListeners(AuditingEntityListener.class)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InsuranceClaim {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @NotNull
    @Size(max = 50)
    @Column(name = "claim_number", unique = true, nullable = false)
    private String claimNumber;

    @NotNull
    @Column(name = "patient_id", nullable = false)
    private UUID patientId;

    @Column(name = "encounter_id")
    private UUID encounterId;

    @NotNull
    @Column(name = "payer_id", nullable = false)
    private UUID payerId;

    @Size(max = 200)
    @Column(name = "payer_name")
    private String payerName;

    @Size(max = 50)
    @Column(name = "policy_number")
    private String policyNumber;

    @Size(max = 50)
    @Column(name = "group_number")
    private String groupNumber;

    @Column(name = "service_date")
    private LocalDateTime serviceDate;

    @Column(name = "service_end_date")
    private LocalDateTime serviceEndDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "claim_type")
    private ClaimType claimType;

    @Enumerated(EnumType.STRING)
    @Column(name = "claim_status")
    private ClaimStatus claimStatus;

    @Column(name = "total_charge_amount", precision = 12, scale = 2)
    private BigDecimal totalChargeAmount;

    @Column(name = "total_allowed_amount", precision = 12, scale = 2)
    private BigDecimal totalAllowedAmount;

    @Column(name = "total_paid_amount", precision = 12, scale = 2)
    private BigDecimal totalPaidAmount;

    @Column(name = "patient_responsibility", precision = 12, scale = 2)
    private BigDecimal patientResponsibility;

    @Column(name = "deductible_amount", precision = 12, scale = 2)
    private BigDecimal deductibleAmount;

    @Column(name = "copay_amount", precision = 12, scale = 2)
    private BigDecimal copayAmount;

    @Column(name = "coinsurance_amount", precision = 12, scale = 2)
    private BigDecimal coinsuranceAmount;

    // Provider Information
    @Column(name = "billing_provider_id")
    private UUID billingProviderId;

    @Size(max = 200)
    @Column(name = "billing_provider_name")
    private String billingProviderName;

    @Size(max = 20)
    @Column(name = "billing_provider_npi")
    private String billingProviderNpi;

    @Size(max = 20)
    @Column(name = "billing_provider_tax_id")
    private String billingProviderTaxId;

    @Column(name = "rendering_provider_id")
    private UUID renderingProviderId;

    @Size(max = 200)
    @Column(name = "rendering_provider_name")
    private String renderingProviderName;

    @Size(max = 20)
    @Column(name = "rendering_provider_npi")
    private String renderingProviderNpi;

    // Authorization Information
    @Size(max = 50)
    @Column(name = "authorization_number")
    private String authorizationNumber;

    @Column(name = "authorization_required")
    private Boolean authorizationRequired;

    @Column(name = "authorization_obtained")
    private Boolean authorizationObtained;

    @Column(name = "authorization_expiry_date")
    private LocalDateTime authorizationExpiryDate;

    // Diagnosis Information
    @Size(max = 20)
    @Column(name = "primary_diagnosis_code")
    private String primaryDiagnosisCode;

    @Size(max = 500)
    @Column(name = "primary_diagnosis_description")
    private String primaryDiagnosisDescription;

    @Size(max = 1000)
    @Column(name = "secondary_diagnosis_codes")
    private String secondaryDiagnosisCodes;

    // Place of Service
    @Size(max = 10)
    @Column(name = "place_of_service_code")
    private String placeOfServiceCode;

    @Size(max = 100)
    @Column(name = "place_of_service_description")
    private String placeOfServiceDescription;

    // Submission Information
    @Column(name = "submission_date")
    private LocalDateTime submissionDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "submission_method")
    private SubmissionMethod submissionMethod;

    @Size(max = 50)
    @Column(name = "clearinghouse_id")
    private String clearinghouseId;

    @Size(max = 100)
    @Column(name = "clearinghouse_name")
    private String clearinghouseName;

    @Size(max = 50)
    @Column(name = "transaction_control_number")
    private String transactionControlNumber;

    // Response Information
    @Column(name = "acknowledgment_date")
    private LocalDateTime acknowledgmentDate;

    @Size(max = 50)
    @Column(name = "acknowledgment_id")
    private String acknowledgmentId;

    @Column(name = "adjudication_date")
    private LocalDateTime adjudicationDate;

    @Size(max = 50)
    @Column(name = "claim_control_number")
    private String claimControlNumber;

    @Size(max = 50)
    @Column(name = "remittance_advice_number")
    private String remittanceAdviceNumber;

    // Denial/Rejection Information
    @Size(max = 2000)
    @Column(name = "denial_reason")
    private String denialReason;

    @Size(max = 500)
    @Column(name = "denial_codes")
    private String denialCodes;

    @Column(name = "appeal_deadline")
    private LocalDateTime appealDeadline;

    @Column(name = "appeal_submitted")
    private Boolean appealSubmitted;

    @Column(name = "appeal_date")
    private LocalDateTime appealDate;

    // EDI Information
    @Size(max = 50)
    @Column(name = "edi_transaction_set")
    private String ediTransactionSet;

    @Size(max = 20)
    @Column(name = "edi_version")
    private String ediVersion;

    @Column(name = "edi_raw_data", columnDefinition = "TEXT")
    private String ediRawData;

    // Status Tracking
    @Column(name = "is_corrected_claim")
    private Boolean isCorrectedClaim;

    @Column(name = "original_claim_id")
    private UUID originalClaimId;

    @Column(name = "correction_sequence_number")
    private Integer correctionSequenceNumber;

    @Column(name = "is_electronic")
    private Boolean isElectronic;

    @Column(name = "requires_manual_review")
    private Boolean requiresManualReview;

    @Enumerated(EnumType.STRING)
    @Column(name = "priority_level")
    private PriorityLevel priorityLevel;

    // Financial Information
    @Column(name = "write_off_amount", precision = 12, scale = 2)
    private BigDecimal writeOffAmount;

    @Column(name = "contractual_adjustment", precision = 12, scale = 2)
    private BigDecimal contractualAdjustment;

    @Column(name = "interest_amount", precision = 12, scale = 2)
    private BigDecimal interestAmount;

    // Notes and Comments
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
    public boolean isPending() {
        return claimStatus == ClaimStatus.SUBMITTED || claimStatus == ClaimStatus.UNDER_REVIEW;
    }

    public boolean isPaid() {
        return claimStatus == ClaimStatus.PAID || claimStatus == ClaimStatus.PARTIALLY_PAID;
    }

    public boolean isDenied() {
        return claimStatus == ClaimStatus.DENIED || claimStatus == ClaimStatus.REJECTED;
    }

    public boolean isOverdue() {
        if (submissionDate == null) return false;
        return LocalDateTime.now().isAfter(submissionDate.plusDays(30)) && isPending();
    }

    public boolean requiresAuth() {
        return Boolean.TRUE.equals(authorizationRequired);
    }

    public boolean hasValidAuth() {
        return !requiresAuth() || 
               (Boolean.TRUE.equals(authorizationObtained) && 
                authorizationExpiryDate != null && 
                LocalDateTime.now().isBefore(authorizationExpiryDate));
    }

    public BigDecimal getBalanceAmount() {
        if (totalChargeAmount == null) return BigDecimal.ZERO;
        BigDecimal paid = totalPaidAmount != null ? totalPaidAmount : BigDecimal.ZERO;
        return totalChargeAmount.subtract(paid);
    }

    public double getAdjudicationDays() {
        if (submissionDate == null || adjudicationDate == null) return 0;
        return java.time.Duration.between(submissionDate, adjudicationDate).toDays();
    }
}
