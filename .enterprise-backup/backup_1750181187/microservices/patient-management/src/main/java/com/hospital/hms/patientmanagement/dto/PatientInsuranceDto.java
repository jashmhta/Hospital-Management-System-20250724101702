package com.hospital.hms.patientmanagement.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.util.UUID;

/**
 * DTO for patient insurance information
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Schema(description = "Patient insurance information")
public class PatientInsuranceDto {

    @Schema(description = "Insurance record unique identifier")
    private UUID id;

    @Schema(description = "Insurance sequence number", example = "1")
    private Integer sequence;

    @Schema(description = "Whether this is the primary insurance", example = "true")
    private Boolean primary = false;

    @Schema(description = "Insurance company name", example = "Blue Cross Blue Shield", required = true)
    @NotBlank(message = "Insurance company name is required")
    @Size(max = 200, message = "Insurance company name must not exceed 200 characters")
    private String insuranceCompany;

    @Schema(description = "Policy number", example = "POL123456789", required = true)
    @NotBlank(message = "Policy number is required")
    @Size(max = 100, message = "Policy number must not exceed 100 characters")
    private String policyNumber;

    @Schema(description = "Group number", example = "GRP987654321")
    @Size(max = 100, message = "Group number must not exceed 100 characters")
    private String groupNumber;

    @Schema(description = "Subscriber ID", example = "SUB123456")
    @Size(max = 100, message = "Subscriber ID must not exceed 100 characters")
    private String subscriberId;

    @Schema(description = "Subscriber name", example = "John Smith")
    @Size(max = 200, message = "Subscriber name must not exceed 200 characters")
    private String subscriberName;

    @Schema(description = "Relationship to subscriber", example = "self", allowableValues = {"self", "spouse", "child", "parent", "other"})
    @Size(max = 50, message = "Relationship must not exceed 50 characters")
    private String relationship;

    @Schema(description = "Coverage start date", example = "2023-01-01")
    private LocalDate coverageStartDate;

    @Schema(description = "Coverage end date", example = "2023-12-31")
    private LocalDate coverageEndDate;

    @Schema(description = "Coverage type", example = "medical", allowableValues = {"medical", "dental", "vision", "pharmacy", "mental_health"})
    @Size(max = 50, message = "Coverage type must not exceed 50 characters")
    private String coverageType;

    @Schema(description = "Insurance status", example = "active", allowableValues = {"active", "cancelled", "draft", "entered-in-error"})
    @Size(max = 20, message = "Status must not exceed 20 characters")
    private String status = "active";

    @Schema(description = "Copay amount", example = "25.00")
    private Double copayAmount;

    @Schema(description = "Deductible amount", example = "1000.00")
    private Double deductibleAmount;

    @Schema(description = "Authorization number")
    @Size(max = 100, message = "Authorization number must not exceed 100 characters")
    private String authorizationNumber;

    @Schema(description = "Plan name", example = "Premium Health Plan")
    @Size(max = 200, message = "Plan name must not exceed 200 characters")
    private String planName;

    @Schema(description = "Additional notes")
    private String notes;

    // Constructors
    public PatientInsuranceDto() {}

    public PatientInsuranceDto(String insuranceCompany, String policyNumber, Boolean primary) {
        this.insuranceCompany = insuranceCompany;
        this.policyNumber = policyNumber;
        this.primary = primary;
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public Integer getSequence() {
        return sequence;
    }

    public void setSequence(Integer sequence) {
        this.sequence = sequence;
    }

    public Boolean getPrimary() {
        return primary;
    }

    public void setPrimary(Boolean primary) {
        this.primary = primary;
    }

    public String getInsuranceCompany() {
        return insuranceCompany;
    }

    public void setInsuranceCompany(String insuranceCompany) {
        this.insuranceCompany = insuranceCompany;
    }

    public String getPolicyNumber() {
        return policyNumber;
    }

    public void setPolicyNumber(String policyNumber) {
        this.policyNumber = policyNumber;
    }

    public String getGroupNumber() {
        return groupNumber;
    }

    public void setGroupNumber(String groupNumber) {
        this.groupNumber = groupNumber;
    }

    public String getSubscriberId() {
        return subscriberId;
    }

    public void setSubscriberId(String subscriberId) {
        this.subscriberId = subscriberId;
    }

    public String getSubscriberName() {
        return subscriberName;
    }

    public void setSubscriberName(String subscriberName) {
        this.subscriberName = subscriberName;
    }

    public String getRelationship() {
        return relationship;
    }

    public void setRelationship(String relationship) {
        this.relationship = relationship;
    }

    public LocalDate getCoverageStartDate() {
        return coverageStartDate;
    }

    public void setCoverageStartDate(LocalDate coverageStartDate) {
        this.coverageStartDate = coverageStartDate;
    }

    public LocalDate getCoverageEndDate() {
        return coverageEndDate;
    }

    public void setCoverageEndDate(LocalDate coverageEndDate) {
        this.coverageEndDate = coverageEndDate;
    }

    public String getCoverageType() {
        return coverageType;
    }

    public void setCoverageType(String coverageType) {
        this.coverageType = coverageType;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Double getCopayAmount() {
        return copayAmount;
    }

    public void setCopayAmount(Double copayAmount) {
        this.copayAmount = copayAmount;
    }

    public Double getDeductibleAmount() {
        return deductibleAmount;
    }

    public void setDeductibleAmount(Double deductibleAmount) {
        this.deductibleAmount = deductibleAmount;
    }

    public String getAuthorizationNumber() {
        return authorizationNumber;
    }

    public void setAuthorizationNumber(String authorizationNumber) {
        this.authorizationNumber = authorizationNumber;
    }

    public String getPlanName() {
        return planName;
    }

    public void setPlanName(String planName) {
        this.planName = planName;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
