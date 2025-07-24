package com.hospital.hms.payer.dto;

import com.hospital.hms.payer.entity.ClaimType;
import com.hospital.hms.payer.entity.PriorityLevel;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

/**
 * Insurance Claim Create Request DTO
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InsuranceClaimCreateRequestDto {
    
    @NotNull(message = "Patient ID is required")
    private UUID patientId;
    
    @NotNull(message = "Provider ID is required")
    private UUID providerId;
    
    @NotNull(message = "Payer ID is required")
    private UUID payerId;
    
    @NotNull(message = "Claim type is required")
    private ClaimType claimType;
    
    @Builder.Default
    private PriorityLevel priorityLevel = PriorityLevel.NORMAL;
    
    @NotNull(message = "Service date is required")
    @PastOrPresent(message = "Service date cannot be in the future")
    private LocalDate serviceDate;
    
    @NotBlank(message = "Diagnosis code is required")
    @Size(max = 20, message = "Diagnosis code cannot exceed 20 characters")
    private String diagnosisCode;
    
    @NotBlank(message = "Procedure code is required")
    @Size(max = 20, message = "Procedure code cannot exceed 20 characters")
    private String procedureCode;
    
    @NotBlank(message = "Service description is required")
    @Size(max = 500, message = "Service description cannot exceed 500 characters")
    private String serviceDescription;
    
    @NotNull(message = "Total amount is required")
    @DecimalMin(value = "0.01", message = "Total amount must be greater than zero")
    @Digits(integer = 10, fraction = 2, message = "Invalid amount format")
    private BigDecimal totalAmount;
    
    @Size(max = 50, message = "Authorization number cannot exceed 50 characters")
    private String authorizationNumber;
    
    @Size(max = 50, message = "Referral number cannot exceed 50 characters")
    private String referralNumber;
    
    @NotBlank(message = "Member number is required")
    @Size(max = 50, message = "Member number cannot exceed 50 characters")
    private String memberNumber;
    
    @Size(max = 50, message = "Group number cannot exceed 50 characters")
    private String groupNumber;
    
    @Size(max = 1000, message = "Notes cannot exceed 1000 characters")
    private String notes;
}
