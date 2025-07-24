package com.hospital.hms.billing.dto;

import com.hospital.hms.billing.entity.InvoicePriority;
import com.hospital.hms.billing.entity.InvoiceStatus;
import com.hospital.hms.billing.entity.InvoiceType;
import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * DTO for invoice responses
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Schema(description = "Response DTO for invoice information")
public class InvoiceResponseDto {

    @Schema(description = "Invoice ID")
    private UUID id;

    @Schema(description = "Invoice number")
    private String invoiceNumber;

    @Schema(description = "Account number")
    private String accountNumber;

    @Schema(description = "Patient ID")
    private UUID patientId;

    @Schema(description = "Patient name")
    private String patientName;

    @Schema(description = "Patient date of birth")
    private LocalDate patientDateOfBirth;

    @Schema(description = "Patient SSN")
    private String patientSsn;

    @Schema(description = "Patient address")
    private String patientAddress;

    @Schema(description = "Patient phone")
    private String patientPhone;

    @Schema(description = "Patient email")
    private String patientEmail;

    @Schema(description = "Provider ID")
    private UUID providerId;

    @Schema(description = "Provider name")
    private String providerName;

    @Schema(description = "Provider NPI")
    private String providerNpi;

    @Schema(description = "Provider tax ID")
    private String providerTaxId;

    @Schema(description = "Facility name")
    private String facilityName;

    @Schema(description = "Department")
    private String department;

    @Schema(description = "Invoice date")
    private LocalDate invoiceDate;

    @Schema(description = "Service date from")
    private LocalDate serviceDateFrom;

    @Schema(description = "Service date to")
    private LocalDate serviceDateTo;

    @Schema(description = "Due date")
    private LocalDate dueDate;

    @Schema(description = "Invoice status")
    private InvoiceStatus status;

    @Schema(description = "Invoice type")
    private InvoiceType invoiceType;

    @Schema(description = "Priority")
    private InvoicePriority priority;

    @Schema(description = "Subtotal")
    private BigDecimal subtotal;

    @Schema(description = "Tax amount")
    private BigDecimal taxAmount;

    @Schema(description = "Discount amount")
    private BigDecimal discountAmount;

    @Schema(description = "Total amount")
    private BigDecimal totalAmount;

    @Schema(description = "Amount paid")
    private BigDecimal paidAmount;

    @Schema(description = "Balance due")
    private BigDecimal balanceDue;

    @Schema(description = "Description")
    private String description;

    @Schema(description = "Notes")
    private String notes;

    @Schema(description = "Created date")
    private LocalDateTime createdDate;

    @Schema(description = "Last modified date")
    private LocalDateTime lastModifiedDate;

    @Schema(description = "Created by")
    private String createdBy;

    @Schema(description = "Last modified by")
    private String lastModifiedBy;

    // Constructors
    public InvoiceResponseDto() {}

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getInvoiceNumber() {
        return invoiceNumber;
    }

    public void setInvoiceNumber(String invoiceNumber) {
        this.invoiceNumber = invoiceNumber;
    }

    public String getAccountNumber() {
        return accountNumber;
    }

    public void setAccountNumber(String accountNumber) {
        this.accountNumber = accountNumber;
    }

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

    public String getPatientSsn() {
        return patientSsn;
    }

    public void setPatientSsn(String patientSsn) {
        this.patientSsn = patientSsn;
    }

    public String getPatientAddress() {
        return patientAddress;
    }

    public void setPatientAddress(String patientAddress) {
        this.patientAddress = patientAddress;
    }

    public String getPatientPhone() {
        return patientPhone;
    }

    public void setPatientPhone(String patientPhone) {
        this.patientPhone = patientPhone;
    }

    public String getPatientEmail() {
        return patientEmail;
    }

    public void setPatientEmail(String patientEmail) {
        this.patientEmail = patientEmail;
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

    public String getProviderNpi() {
        return providerNpi;
    }

    public void setProviderNpi(String providerNpi) {
        this.providerNpi = providerNpi;
    }

    public String getProviderTaxId() {
        return providerTaxId;
    }

    public void setProviderTaxId(String providerTaxId) {
        this.providerTaxId = providerTaxId;
    }

    public String getFacilityName() {
        return facilityName;
    }

    public void setFacilityName(String facilityName) {
        this.facilityName = facilityName;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public LocalDate getInvoiceDate() {
        return invoiceDate;
    }

    public void setInvoiceDate(LocalDate invoiceDate) {
        this.invoiceDate = invoiceDate;
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

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public InvoiceStatus getStatus() {
        return status;
    }

    public void setStatus(InvoiceStatus status) {
        this.status = status;
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

    public BigDecimal getPaidAmount() {
        return paidAmount;
    }

    public void setPaidAmount(BigDecimal paidAmount) {
        this.paidAmount = paidAmount;
    }

    public BigDecimal getBalanceDue() {
        return balanceDue;
    }

    public void setBalanceDue(BigDecimal balanceDue) {
        this.balanceDue = balanceDue;
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

    public LocalDateTime getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(LocalDateTime createdDate) {
        this.createdDate = createdDate;
    }

    public LocalDateTime getLastModifiedDate() {
        return lastModifiedDate;
    }

    public void setLastModifiedDate(LocalDateTime lastModifiedDate) {
        this.lastModifiedDate = lastModifiedDate;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public String getLastModifiedBy() {
        return lastModifiedBy;
    }

    public void setLastModifiedBy(String lastModifiedBy) {
        this.lastModifiedBy = lastModifiedBy;
    }
}
