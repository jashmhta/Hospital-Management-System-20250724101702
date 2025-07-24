package com.hospital.hms.billing.dto;

import com.hospital.hms.billing.entity.InvoicePriority;
import com.hospital.hms.billing.entity.InvoiceType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

/**
 * DTO for creating new invoices
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Schema(description = "Request DTO for creating a new invoice")
public class InvoiceCreateRequestDto {

    @Schema(description = "Patient ID", required = true)
    @NotNull(message = "Patient ID is required")
    private UUID patientId;

    @Schema(description = "Patient name", required = true)
    @NotBlank(message = "Patient name is required")
    @Size(max = 200, message = "Patient name must not exceed 200 characters")
    private String patientName;

    @Schema(description = "Patient date of birth")
    private LocalDate patientDateOfBirth;

    @Schema(description = "Provider ID", required = true)
    @NotNull(message = "Provider ID is required")
    private UUID providerId;

    @Schema(description = "Provider name", required = true)
    @NotBlank(message = "Provider name is required")
    @Size(max = 200, message = "Provider name must not exceed 200 characters")
    private String providerName;

    @Schema(description = "Service date from", required = true)
    @NotNull(message = "Service date from is required")
    private LocalDate serviceDateFrom;

    @Schema(description = "Service date to")
    private LocalDate serviceDateTo;

    @Schema(description = "Invoice type", required = true)
    @NotNull(message = "Invoice type is required")
    private InvoiceType invoiceType;

    @Schema(description = "Priority")
    private InvoicePriority priority;

    @Schema(description = "Subtotal", required = true)
    @NotNull(message = "Subtotal is required")
    @DecimalMin(value = "0.0", message = "Subtotal must be non-negative")
    private BigDecimal subtotal;

    @Schema(description = "Tax amount")
    @DecimalMin(value = "0.0", message = "Tax amount must be non-negative")
    private BigDecimal taxAmount;

    @Schema(description = "Discount amount")
    @DecimalMin(value = "0.0", message = "Discount amount must be non-negative")
    private BigDecimal discountAmount;

    @Schema(description = "Total amount", required = true)
    @NotNull(message = "Total amount is required")
    @DecimalMin(value = "0.0", message = "Total amount must be non-negative")
    private BigDecimal totalAmount;

    @Schema(description = "Description")
    private String description;

    @Schema(description = "Notes")
    private String notes;

    // Constructors
    public InvoiceCreateRequestDto() {}

    // Getters and Setters
    public UUID getPatientId() {
        return patientId;
    }

    public void setPatientId(UUID patientId) {
        this.patientId = patientId;
    }

    public String getPatientName() {
        return patientName;
    }

    public void setPatientName(String patientName) {
        this.patientName = patientName;
    }

    public LocalDate getPatientDateOfBirth() {
        return patientDateOfBirth;
    }

    public void setPatientDateOfBirth(LocalDate patientDateOfBirth) {
        this.patientDateOfBirth = patientDateOfBirth;
    }

    public UUID getProviderId() {
        return providerId;
    }

    public void setProviderId(UUID providerId) {
        this.providerId = providerId;
    }

    public String getProviderName() {
        return providerName;
    }

    public void setProviderName(String providerName) {
        this.providerName = providerName;
    }

    public LocalDate getServiceDateFrom() {
        return serviceDateFrom;
    }

    public void setServiceDateFrom(LocalDate serviceDateFrom) {
        this.serviceDateFrom = serviceDateFrom;
    }

    public LocalDate getServiceDateTo() {
        return serviceDateTo;
    }

    public void setServiceDateTo(LocalDate serviceDateTo) {
        this.serviceDateTo = serviceDateTo;
    }

    public InvoiceType getInvoiceType() {
        return invoiceType;
    }

    public void setInvoiceType(InvoiceType invoiceType) {
        this.invoiceType = invoiceType;
    }

    public InvoicePriority getPriority() {
        return priority;
    }

    public void setPriority(InvoicePriority priority) {
        this.priority = priority;
    }

    public BigDecimal getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(BigDecimal subtotal) {
        this.subtotal = subtotal;
    }

    public BigDecimal getTaxAmount() {
        return taxAmount;
    }

    public void setTaxAmount(BigDecimal taxAmount) {
        this.taxAmount = taxAmount;
    }

    public BigDecimal getDiscountAmount() {
        return discountAmount;
    }

    public void setDiscountAmount(BigDecimal discountAmount) {
        this.discountAmount = discountAmount;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
