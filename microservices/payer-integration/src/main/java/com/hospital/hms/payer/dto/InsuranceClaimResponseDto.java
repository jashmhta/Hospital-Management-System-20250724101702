package com.hospital.hms.payer.dto;

import com.hospital.hms.payer.entity.ClaimStatus;
import com.hospital.hms.payer.entity.ClaimType;
import com.hospital.hms.payer.entity.PriorityLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Insurance Claim Response DTO
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InsuranceClaimResponseDto {
    
    private UUID id;
    private String claimNumber;
    private UUID patientId;
    private String patientName;
    private UUID providerId;
    private String providerName;
    private UUID payerId;
    private String payerName;
    private ClaimType claimType;
    private ClaimStatus claimStatus;
    private PriorityLevel priorityLevel;
    
    private LocalDate serviceDate;
    private LocalDate submissionDate;
    private String diagnosisCode;
    private String procedureCode;
    private String serviceDescription;
    
    private BigDecimal totalAmount;
    private BigDecimal approvedAmount;
    private BigDecimal paymentAmount;
    private BigDecimal patientResponsibility;
    
    private String authorizationNumber;
    private String referralNumber;
    private String memberNumber;
    private String groupNumber;
    
    private LocalDateTime statusDate;
    private String statusReason;
    private String denialReason;
    private LocalDate paymentDate;
    
    private String ediTransactionId;
    private String clearinghouseId;
    private String externalClaimId;
    
    private String notes;
    private LocalDateTime createdDate;
    private LocalDateTime lastModifiedDate;
    private String createdBy;
    private String lastModifiedBy;
}
