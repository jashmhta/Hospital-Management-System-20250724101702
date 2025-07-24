package com.hospital.hms.billing.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.money.MonetaryAmount;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Invoice Entity
 * 
 * Represents a healthcare billing invoice for patient services.
 * Central entity for revenue cycle management and financial operations.
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Entity
@Table(name = "invoices", indexes = {
    @Index(name = "idx_invoice_patient", columnList = "patient_id"),
    @Index(name = "idx_invoice_number", columnList = "invoice_number"),
    @Index(name = "idx_invoice_status", columnList = "status"),
    @Index(name = "idx_invoice_date", columnList = "invoice_date"),
    @Index(name = "idx_invoice_due_date", columnList = "due_date"),
    @Index(name = "idx_invoice_account", columnList = "account_number"),
    @Index(name = "idx_invoice_provider", columnList = "provider_id"),
    @Index(name = "idx_invoice_insurance", columnList = "primary_insurance_id"),
    @Index(name = "idx_invoice_created", columnList = "created_date")
})
@EntityListeners(AuditingEntityListener.class)
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "invoice_number", unique = true, nullable = false, length = 50)
    @NotBlank(message = "Invoice number is required")
    @Size(max = 50, message = "Invoice number must not exceed 50 characters")
    private String invoiceNumber;

    @Column(name = "account_number", nullable = false, length = 50)
    @NotBlank(message = "Account number is required")
    @Size(max = 50, message = "Account number must not exceed 50 characters")
    private String accountNumber;

    // Patient Information
    @Column(name = "patient_id", nullable = false)
    @NotNull(message = "Patient ID is required")
    private UUID patientId;

    @Column(name = "patient_name", nullable = false, length = 200)
    @NotBlank(message = "Patient name is required")
    @Size(max = 200, message = "Patient name must not exceed 200 characters")
    private String patientName;

    @Column(name = "patient_date_of_birth")
    private LocalDate patientDateOfBirth;

    @Column(name = "patient_ssn", length = 11)
    @Pattern(regexp = "^\\d{3}-\\d{2}-\\d{4}$", message = "Invalid SSN format")
    private String patientSsn;

    @Column(name = "patient_address", columnDefinition = "TEXT")
    private String patientAddress;

    @Column(name = "patient_phone", length = 20)
    @Pattern(regexp = "^[\\+]?[1-9][\\d\\s\\-\\(\\)]{7,15}$", message = "Invalid patient phone format")
    private String patientPhone;

    @Column(name = "patient_email", length = 100)
    @Email(message = "Invalid patient email format")
    @Size(max = 100, message = "Patient email must not exceed 100 characters")
    private String patientEmail;

    // Provider Information
    @Column(name = "provider_id", nullable = false)
    @NotNull(message = "Provider ID is required")
    private UUID providerId;

    @Column(name = "provider_name", nullable = false, length = 200)
    @NotBlank(message = "Provider name is required")
    @Size(max = 200, message = "Provider name must not exceed 200 characters")
    private String providerName;

    @Column(name = "provider_npi", length = 20)
    @Size(max = 20, message = "Provider NPI must not exceed 20 characters")
    private String providerNpi;

    @Column(name = "provider_tax_id", length = 20)
    @Size(max = 20, message = "Provider Tax ID must not exceed 20 characters")
    private String providerTaxId;

    @Column(name = "facility_name", length = 200)
    @Size(max = 200, message = "Facility name must not exceed 200 characters")
    private String facilityName;

    @Column(name = "department", length = 100)
    @Size(max = 100, message = "Department must not exceed 100 characters")
    private String department;

    // Invoice Details
    @Column(name = "invoice_date", nullable = false)
    @NotNull(message = "Invoice date is required")
    private LocalDate invoiceDate;

    @Column(name = "service_date_from", nullable = false)
    @NotNull(message = "Service date from is required")
    private LocalDate serviceDateFrom;

    @Column(name = "service_date_to")
    private LocalDate serviceDateTo;

    @Column(name = "due_date", nullable = false)
    @NotNull(message = "Due date is required")
    private LocalDate dueDate;

    @Column(name = "status", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    @NotNull(message = "Invoice status is required")
    private InvoiceStatus status;

    @Column(name = "invoice_type", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    @NotNull(message = "Invoice type is required")
    private InvoiceType invoiceType;

    @Column(name = "priority", length = 20)
    @Enumerated(EnumType.STRING)
    private InvoicePriority priority;

    // Financial Information
    @Column(name = "subtotal", precision = 19, scale = 2, nullable = false)
    @NotNull(message = "Subtotal is required")
    @DecimalMin(value = "0.0", message = "Subtotal must be non-negative")
    private BigDecimal subtotal;

    @Column(name = "tax_amount", precision = 19, scale = 2)
    @DecimalMin(value = "0.0", message = "Tax amount must be non-negative")
    private BigDecimal taxAmount;

    @Column(name = "discount_amount", precision = 19, scale = 2)
    @DecimalMin(value = "0.0", message = "Discount amount must be non-negative")
    private BigDecimal discountAmount;

    @Column(name = "adjustment_amount", precision = 19, scale = 2)
    private BigDecimal adjustmentAmount;

    @Column(name = "total_amount", precision = 19, scale = 2, nullable = false)
    @NotNull(message = "Total amount is required")
    @DecimalMin(value = "0.0", message = "Total amount must be non-negative")
    private BigDecimal totalAmount;

    @Column(name = "paid_amount", precision = 19, scale = 2)
    @DecimalMin(value = "0.0", message = "Paid amount must be non-negative")
    private BigDecimal paidAmount;

    @Column(name = "balance_due", precision = 19, scale = 2)
    @DecimalMin(value = "0.0", message = "Balance due must be non-negative")
    private BigDecimal balanceDue;

    @Column(name = "currency_code", length = 3)
    @Size(min = 3, max = 3, message = "Currency code must be 3 characters")
    private String currencyCode = "USD";

    // Insurance Information
    @Column(name = "primary_insurance_id")
    private UUID primaryInsuranceId;

    @Column(name = "primary_insurance_name", length = 200)
    @Size(max = 200, message = "Primary insurance name must not exceed 200 characters")
    private String primaryInsuranceName;

    @Column(name = "primary_claim_number", length = 50)
    @Size(max = 50, message = "Primary claim number must not exceed 50 characters")
    private String primaryClaimNumber;

    @Column(name = "primary_coverage_amount", precision = 19, scale = 2)
    @DecimalMin(value = "0.0", message = "Primary coverage amount must be non-negative")
    private BigDecimal primaryCoverageAmount;

    @Column(name = "secondary_insurance_id")
    private UUID secondaryInsuranceId;

    @Column(name = "secondary_insurance_name", length = 200)
    @Size(max = 200, message = "Secondary insurance name must not exceed 200 characters")
    private String secondaryInsuranceName;

    @Column(name = "secondary_claim_number", length = 50)
    @Size(max = 50, message = "Secondary claim number must not exceed 50 characters")
    private String secondaryClaimNumber;

    @Column(name = "secondary_coverage_amount", precision = 19, scale = 2)
    @DecimalMin(value = "0.0", message = "Secondary coverage amount must be non-negative")
    private BigDecimal secondaryCoverageAmount;

    @Column(name = "patient_responsibility", precision = 19, scale = 2)
    @DecimalMin(value = "0.0", message = "Patient responsibility must be non-negative")
    private BigDecimal patientResponsibility;

    @Column(name = "copay_amount", precision = 19, scale = 2)
    @DecimalMin(value = "0.0", message = "Copay amount must be non-negative")
    private BigDecimal copayAmount;

    @Column(name = "deductible_amount", precision = 19, scale = 2)
    @DecimalMin(value = "0.0", message = "Deductible amount must be non-negative")
    private BigDecimal deductibleAmount;

    @Column(name = "coinsurance_amount", precision = 19, scale = 2)
    @DecimalMin(value = "0.0", message = "Coinsurance amount must be non-negative")
    private BigDecimal coinsuranceAmount;

    // Payment Information
    @Column(name = "payment_terms", length = 50)
    @Size(max = 50, message = "Payment terms must not exceed 50 characters")
    private String paymentTerms;

    @Column(name = "payment_method", length = 20)
    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod;

    @Column(name = "last_payment_date")
    private LocalDate lastPaymentDate;

    @Column(name = "last_payment_amount", precision = 19, scale = 2)
    @DecimalMin(value = "0.0", message = "Last payment amount must be non-negative")
    private BigDecimal lastPaymentAmount;

    @Column(name = "days_outstanding")
    private Integer daysOutstanding;

    @Column(name = "collection_status", length = 20)
    @Enumerated(EnumType.STRING)
    private CollectionStatus collectionStatus;

    // Billing Codes and References
    @Column(name = "encounter_id")
    private UUID encounterId;

    @Column(name = "appointment_id")
    private UUID appointmentId;

    @Column(name = "admission_id")
    private UUID admissionId;

    @Column(name = "diagnosis_codes", columnDefinition = "TEXT")
    private String diagnosisCodes; // JSON array of ICD-10 codes

    @Column(name = "procedure_codes", columnDefinition = "TEXT")
    private String procedureCodes; // JSON array of CPT codes

    @Column(name = "revenue_codes", columnDefinition = "TEXT")
    private String revenueCodes; // JSON array of UB-04 revenue codes

    // Processing Information
    @Column(name = "bill_type", length = 10)
    @Size(max = 10, message = "Bill type must not exceed 10 characters")
    private String billType;

    @Column(name = "statement_date")
    private LocalDate statementDate;

    @Column(name = "statement_number", length = 50)
    @Size(max = 50, message = "Statement number must not exceed 50 characters")
    private String statementNumber;

    @Column(name = "cycle_number")
    private Integer cycleNumber;

    @Column(name = "follow_up_required", nullable = false)
    private Boolean followUpRequired = false;

    @Column(name = "next_follow_up_date")
    private LocalDate nextFollowUpDate;

    // Authorization and Approval
    @Column(name = "authorization_number", length = 50)
    @Size(max = 50, message = "Authorization number must not exceed 50 characters")
    private String authorizationNumber;

    @Column(name = "approved_by")
    private UUID approvedBy;

    @Column(name = "approved_by_name", length = 200)
    @Size(max = 200, message = "Approved by name must not exceed 200 characters")
    private String approvedByName;

    @Column(name = "approval_date")
    private LocalDateTime approvalDate;

    // Notes and Comments
    @Column(name = "billing_notes", columnDefinition = "TEXT")
    private String billingNotes;

    @Column(name = "patient_notes", columnDefinition = "TEXT")
    private String patientNotes;

    @Column(name = "collection_notes", columnDefinition = "TEXT")
    private String collectionNotes;

    @Column(name = "internal_notes", columnDefinition = "TEXT")
    private String internalNotes;

    // System Information
    @Column(name = "electronic_claim_sent", nullable = false)
    private Boolean electronicClaimSent = false;

    @Column(name = "electronic_claim_sent_date")
    private LocalDateTime electronicClaimSentDate;

    @Column(name = "paper_claim_sent", nullable = false)
    private Boolean paperClaimSent = false;

    @Column(name = "paper_claim_sent_date")
    private LocalDateTime paperClaimSentDate;

    @Column(name = "statement_sent", nullable = false)
    private Boolean statementSent = false;

    @Column(name = "statement_sent_date")
    private LocalDateTime statementSentDate;

    @Column(name = "hold_billing", nullable = false)
    private Boolean holdBilling = false;

    @Column(name = "hold_reason", length = 200)
    @Size(max = 200, message = "Hold reason must not exceed 200 characters")
    private String holdReason;

    @Column(name = "batch_number", length = 50)
    @Size(max = 50, message = "Batch number must not exceed 50 characters")
    private String batchNumber;

    @Column(name = "submission_count")
    private Integer submissionCount = 0;

    @Column(name = "denial_count")
    private Integer denialCount = 0;

    @Column(name = "correction_count")
    private Integer correctionCount = 0;

    // Audit fields
    @CreatedDate
    @Column(name = "created_date", nullable = false, updatable = false)
    private LocalDateTime createdDate;

    @LastModifiedDate
    @Column(name = "last_modified_date")
    private LocalDateTime lastModifiedDate;

    @Column(name = "created_by", nullable = false)
    @NotNull(message = "Created by is required")
    private UUID createdBy;

    @Column(name = "created_by_name", nullable = false, length = 200)
    @NotBlank(message = "Created by name is required")
    @Size(max = 200, message = "Created by name must not exceed 200 characters")
    private String createdByName;

    @Version
    @Column(name = "version")
    private Long version;

    // Related entities
    @OneToMany(mappedBy = "invoice", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<InvoiceLineItem> lineItems = new ArrayList<>();

    @OneToMany(mappedBy = "invoice", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Payment> payments = new ArrayList<>();

    @OneToMany(mappedBy = "invoice", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<InvoiceAdjustment> adjustments = new ArrayList<>();

    @OneToMany(mappedBy = "invoice", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ClaimSubmission> claimSubmissions = new ArrayList<>();

    // Constructors
    public Invoice() {
        this.id = UUID.randomUUID();
    }

    public Invoice(String invoiceNumber, String accountNumber, UUID patientId, String patientName,
                  UUID providerId, String providerName, LocalDate invoiceDate, LocalDate serviceDateFrom) {
        this();
        this.invoiceNumber = invoiceNumber;
        this.accountNumber = accountNumber;
        this.patientId = patientId;
        this.patientName = patientName;
        this.providerId = providerId;
        this.providerName = providerName;
        this.invoiceDate = invoiceDate;
        this.serviceDateFrom = serviceDateFrom;
        this.status = InvoiceStatus.DRAFT;
        this.invoiceType = InvoiceType.PROFESSIONAL;
        this.subtotal = BigDecimal.ZERO;
        this.totalAmount = BigDecimal.ZERO;
        this.paidAmount = BigDecimal.ZERO;
        this.balanceDue = BigDecimal.ZERO;
    }

    // Business Methods
    
    /**
     * Calculate total amount from subtotal, tax, discount, and adjustments
     */
    public void calculateTotalAmount() {
        BigDecimal total = subtotal != null ? subtotal : BigDecimal.ZERO;
        
        if (taxAmount != null) {
            total = total.add(taxAmount);
        }
        
        if (discountAmount != null) {
            total = total.subtract(discountAmount);
        }
        
        if (adjustmentAmount != null) {
            total = total.add(adjustmentAmount);
        }
        
        this.totalAmount = total;
        calculateBalanceDue();
    }

    /**
     * Calculate balance due from total amount and paid amount
     */
    public void calculateBalanceDue() {
        BigDecimal total = totalAmount != null ? totalAmount : BigDecimal.ZERO;
        BigDecimal paid = paidAmount != null ? paidAmount : BigDecimal.ZERO;
        this.balanceDue = total.subtract(paid);
        
        // Update status based on balance
        if (balanceDue.compareTo(BigDecimal.ZERO) <= 0) {
            this.status = InvoiceStatus.PAID;
        } else if (paid.compareTo(BigDecimal.ZERO) > 0) {
            this.status = InvoiceStatus.PARTIALLY_PAID;
        }
    }

    /**
     * Calculate days outstanding
     */
    public void calculateDaysOutstanding() {
        if (invoiceDate != null) {
            this.daysOutstanding = (int) java.time.temporal.ChronoUnit.DAYS.between(invoiceDate, LocalDate.now());
        }
    }

    /**
     * Check if invoice is overdue
     */
    public boolean isOverdue() {
        return dueDate != null && LocalDate.now().isAfter(dueDate) && 
               balanceDue != null && balanceDue.compareTo(BigDecimal.ZERO) > 0;
    }

    /**
     * Check if invoice is eligible for collection
     */
    public boolean isEligibleForCollection() {
        return isOverdue() && daysOutstanding != null && daysOutstanding > 90;
    }

    /**
     * Add payment to invoice
     */
    public void addPayment(BigDecimal amount) {
        if (paidAmount == null) {
            paidAmount = BigDecimal.ZERO;
        }
        paidAmount = paidAmount.add(amount);
        calculateBalanceDue();
        this.lastPaymentDate = LocalDate.now();
        this.lastPaymentAmount = amount;
    }

    /**
     * Apply adjustment to invoice
     */
    public void applyAdjustment(BigDecimal amount, String reason) {
        if (adjustmentAmount == null) {
            adjustmentAmount = BigDecimal.ZERO;
        }
        adjustmentAmount = adjustmentAmount.add(amount);
        calculateTotalAmount();
    }

    /**
     * Submit for billing
     */
    public void submitForBilling() {
        this.status = InvoiceStatus.SUBMITTED;
        this.submissionCount = submissionCount != null ? submissionCount + 1 : 1;
    }

    /**
     * Approve invoice
     */
    public void approve(UUID approvedBy, String approvedByName) {
        this.status = InvoiceStatus.APPROVED;
        this.approvedBy = approvedBy;
        this.approvedByName = approvedByName;
        this.approvalDate = LocalDateTime.now();
    }

    /**
     * Place on hold
     */
    public void placeOnHold(String reason) {
        this.holdBilling = true;
        this.holdReason = reason;
        this.status = InvoiceStatus.ON_HOLD;
    }

    /**
     * Release from hold
     */
    public void releaseFromHold() {
        this.holdBilling = false;
        this.holdReason = null;
        this.status = InvoiceStatus.SUBMITTED;
    }

    /**
     * Mark as denied
     */
    public void markDenied() {
        this.status = InvoiceStatus.DENIED;
        this.denialCount = denialCount != null ? denialCount + 1 : 1;
    }

    /**
     * Mark as voided
     */
    public void markVoided() {
        this.status = InvoiceStatus.VOIDED;
    }

    /**
     * Check if invoice can be edited
     */
    public boolean canBeEdited() {
        return status == InvoiceStatus.DRAFT || status == InvoiceStatus.ON_HOLD;
    }

    /**
     * Check if invoice requires patient statement
     */
    public boolean requiresPatientStatement() {
        return patientResponsibility != null && 
               patientResponsibility.compareTo(BigDecimal.ZERO) > 0 &&
               !statementSent;
    }

    /**
     * Get effective service date
     */
    public LocalDate getEffectiveServiceDate() {
        return serviceDateTo != null ? serviceDateTo : serviceDateFrom;
    }

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getInvoiceNumber() { return invoiceNumber; }
    public void setInvoiceNumber(String invoiceNumber) { this.invoiceNumber = invoiceNumber; }

    public String getAccountNumber() { return accountNumber; }
    public void setAccountNumber(String accountNumber) { this.accountNumber = accountNumber; }

    public UUID getPatientId() { return patientId; }
    public void setPatientId(UUID patientId) { this.patientId = patientId; }

    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }

    public LocalDate getPatientDateOfBirth() { return patientDateOfBirth; }
    public void setPatientDateOfBirth(LocalDate patientDateOfBirth) { this.patientDateOfBirth = patientDateOfBirth; }

    public String getPatientSsn() { return patientSsn; }
    public void setPatientSsn(String patientSsn) { this.patientSsn = patientSsn; }

    public String getPatientAddress() { return patientAddress; }
    public void setPatientAddress(String patientAddress) { this.patientAddress = patientAddress; }

    public String getPatientPhone() { return patientPhone; }
    public void setPatientPhone(String patientPhone) { this.patientPhone = patientPhone; }

    public String getPatientEmail() { return patientEmail; }
    public void setPatientEmail(String patientEmail) { this.patientEmail = patientEmail; }

    public UUID getProviderId() { return providerId; }
    public void setProviderId(UUID providerId) { this.providerId = providerId; }

    public String getProviderName() { return providerName; }
    public void setProviderName(String providerName) { this.providerName = providerName; }

    public String getProviderNpi() { return providerNpi; }
    public void setProviderNpi(String providerNpi) { this.providerNpi = providerNpi; }

    public String getProviderTaxId() { return providerTaxId; }
    public void setProviderTaxId(String providerTaxId) { this.providerTaxId = providerTaxId; }

    public String getFacilityName() { return facilityName; }
    public void setFacilityName(String facilityName) { this.facilityName = facilityName; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public LocalDate getInvoiceDate() { return invoiceDate; }
    public void setInvoiceDate(LocalDate invoiceDate) { this.invoiceDate = invoiceDate; }

    public LocalDate getServiceDateFrom() { return serviceDateFrom; }
    public void setServiceDateFrom(LocalDate serviceDateFrom) { this.serviceDateFrom = serviceDateFrom; }

    public LocalDate getServiceDateTo() { return serviceDateTo; }
    public void setServiceDateTo(LocalDate serviceDateTo) { this.serviceDateTo = serviceDateTo; }

    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }

    public InvoiceStatus getStatus() { return status; }
    public void setStatus(InvoiceStatus status) { this.status = status; }

    public InvoiceType getInvoiceType() { return invoiceType; }
    public void setInvoiceType(InvoiceType invoiceType) { this.invoiceType = invoiceType; }

    public InvoicePriority getPriority() { return priority; }
    public void setPriority(InvoicePriority priority) { this.priority = priority; }

    public BigDecimal getSubtotal() { return subtotal; }
    public void setSubtotal(BigDecimal subtotal) { 
        this.subtotal = subtotal; 
        calculateTotalAmount();
    }

    public BigDecimal getTaxAmount() { return taxAmount; }
    public void setTaxAmount(BigDecimal taxAmount) { 
        this.taxAmount = taxAmount; 
        calculateTotalAmount();
    }

    public BigDecimal getDiscountAmount() { return discountAmount; }
    public void setDiscountAmount(BigDecimal discountAmount) { 
        this.discountAmount = discountAmount; 
        calculateTotalAmount();
    }

    public BigDecimal getAdjustmentAmount() { return adjustmentAmount; }
    public void setAdjustmentAmount(BigDecimal adjustmentAmount) { 
        this.adjustmentAmount = adjustmentAmount; 
        calculateTotalAmount();
    }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

    public BigDecimal getPaidAmount() { return paidAmount; }
    public void setPaidAmount(BigDecimal paidAmount) { 
        this.paidAmount = paidAmount; 
        calculateBalanceDue();
    }

    public BigDecimal getBalanceDue() { return balanceDue; }
    public void setBalanceDue(BigDecimal balanceDue) { this.balanceDue = balanceDue; }

    public String getCurrencyCode() { return currencyCode; }
    public void setCurrencyCode(String currencyCode) { this.currencyCode = currencyCode; }

    public UUID getPrimaryInsuranceId() { return primaryInsuranceId; }
    public void setPrimaryInsuranceId(UUID primaryInsuranceId) { this.primaryInsuranceId = primaryInsuranceId; }

    public String getPrimaryInsuranceName() { return primaryInsuranceName; }
    public void setPrimaryInsuranceName(String primaryInsuranceName) { this.primaryInsuranceName = primaryInsuranceName; }

    public String getPrimaryClaimNumber() { return primaryClaimNumber; }
    public void setPrimaryClaimNumber(String primaryClaimNumber) { this.primaryClaimNumber = primaryClaimNumber; }

    public BigDecimal getPrimaryCoverageAmount() { return primaryCoverageAmount; }
    public void setPrimaryCoverageAmount(BigDecimal primaryCoverageAmount) { this.primaryCoverageAmount = primaryCoverageAmount; }

    public UUID getSecondaryInsuranceId() { return secondaryInsuranceId; }
    public void setSecondaryInsuranceId(UUID secondaryInsuranceId) { this.secondaryInsuranceId = secondaryInsuranceId; }

    public String getSecondaryInsuranceName() { return secondaryInsuranceName; }
    public void setSecondaryInsuranceName(String secondaryInsuranceName) { this.secondaryInsuranceName = secondaryInsuranceName; }

    public String getSecondaryClaimNumber() { return secondaryClaimNumber; }
    public void setSecondaryClaimNumber(String secondaryClaimNumber) { this.secondaryClaimNumber = secondaryClaimNumber; }

    public BigDecimal getSecondaryCoverageAmount() { return secondaryCoverageAmount; }
    public void setSecondaryCoverageAmount(BigDecimal secondaryCoverageAmount) { this.secondaryCoverageAmount = secondaryCoverageAmount; }

    public BigDecimal getPatientResponsibility() { return patientResponsibility; }
    public void setPatientResponsibility(BigDecimal patientResponsibility) { this.patientResponsibility = patientResponsibility; }

    public BigDecimal getCopayAmount() { return copayAmount; }
    public void setCopayAmount(BigDecimal copayAmount) { this.copayAmount = copayAmount; }

    public BigDecimal getDeductibleAmount() { return deductibleAmount; }
    public void setDeductibleAmount(BigDecimal deductibleAmount) { this.deductibleAmount = deductibleAmount; }

    public BigDecimal getCoinsuranceAmount() { return coinsuranceAmount; }
    public void setCoinsuranceAmount(BigDecimal coinsuranceAmount) { this.coinsuranceAmount = coinsuranceAmount; }

    public String getPaymentTerms() { return paymentTerms; }
    public void setPaymentTerms(String paymentTerms) { this.paymentTerms = paymentTerms; }

    public PaymentMethod getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(PaymentMethod paymentMethod) { this.paymentMethod = paymentMethod; }

    public LocalDate getLastPaymentDate() { return lastPaymentDate; }
    public void setLastPaymentDate(LocalDate lastPaymentDate) { this.lastPaymentDate = lastPaymentDate; }

    public BigDecimal getLastPaymentAmount() { return lastPaymentAmount; }
    public void setLastPaymentAmount(BigDecimal lastPaymentAmount) { this.lastPaymentAmount = lastPaymentAmount; }

    public Integer getDaysOutstanding() { return daysOutstanding; }
    public void setDaysOutstanding(Integer daysOutstanding) { this.daysOutstanding = daysOutstanding; }

    public CollectionStatus getCollectionStatus() { return collectionStatus; }
    public void setCollectionStatus(CollectionStatus collectionStatus) { this.collectionStatus = collectionStatus; }

    public UUID getEncounterId() { return encounterId; }
    public void setEncounterId(UUID encounterId) { this.encounterId = encounterId; }

    public UUID getAppointmentId() { return appointmentId; }
    public void setAppointmentId(UUID appointmentId) { this.appointmentId = appointmentId; }

    public UUID getAdmissionId() { return admissionId; }
    public void setAdmissionId(UUID admissionId) { this.admissionId = admissionId; }

    public String getDiagnosisCodes() { return diagnosisCodes; }
    public void setDiagnosisCodes(String diagnosisCodes) { this.diagnosisCodes = diagnosisCodes; }

    public String getProcedureCodes() { return procedureCodes; }
    public void setProcedureCodes(String procedureCodes) { this.procedureCodes = procedureCodes; }

    public String getRevenueCodes() { return revenueCodes; }
    public void setRevenueCodes(String revenueCodes) { this.revenueCodes = revenueCodes; }

    public String getBillType() { return billType; }
    public void setBillType(String billType) { this.billType = billType; }

    public LocalDate getStatementDate() { return statementDate; }
    public void setStatementDate(LocalDate statementDate) { this.statementDate = statementDate; }

    public String getStatementNumber() { return statementNumber; }
    public void setStatementNumber(String statementNumber) { this.statementNumber = statementNumber; }

    public Integer getCycleNumber() { return cycleNumber; }
    public void setCycleNumber(Integer cycleNumber) { this.cycleNumber = cycleNumber; }

    public Boolean getFollowUpRequired() { return followUpRequired; }
    public void setFollowUpRequired(Boolean followUpRequired) { this.followUpRequired = followUpRequired; }

    public LocalDate getNextFollowUpDate() { return nextFollowUpDate; }
    public void setNextFollowUpDate(LocalDate nextFollowUpDate) { this.nextFollowUpDate = nextFollowUpDate; }

    public String getAuthorizationNumber() { return authorizationNumber; }
    public void setAuthorizationNumber(String authorizationNumber) { this.authorizationNumber = authorizationNumber; }

    public UUID getApprovedBy() { return approvedBy; }
    public void setApprovedBy(UUID approvedBy) { this.approvedBy = approvedBy; }

    public String getApprovedByName() { return approvedByName; }
    public void setApprovedByName(String approvedByName) { this.approvedByName = approvedByName; }

    public LocalDateTime getApprovalDate() { return approvalDate; }
    public void setApprovalDate(LocalDateTime approvalDate) { this.approvalDate = approvalDate; }

    public String getBillingNotes() { return billingNotes; }
    public void setBillingNotes(String billingNotes) { this.billingNotes = billingNotes; }

    public String getPatientNotes() { return patientNotes; }
    public void setPatientNotes(String patientNotes) { this.patientNotes = patientNotes; }

    public String getCollectionNotes() { return collectionNotes; }
    public void setCollectionNotes(String collectionNotes) { this.collectionNotes = collectionNotes; }

    public String getInternalNotes() { return internalNotes; }
    public void setInternalNotes(String internalNotes) { this.internalNotes = internalNotes; }

    public Boolean getElectronicClaimSent() { return electronicClaimSent; }
    public void setElectronicClaimSent(Boolean electronicClaimSent) { this.electronicClaimSent = electronicClaimSent; }

    public LocalDateTime getElectronicClaimSentDate() { return electronicClaimSentDate; }
    public void setElectronicClaimSentDate(LocalDateTime electronicClaimSentDate) { this.electronicClaimSentDate = electronicClaimSentDate; }

    public Boolean getPaperClaimSent() { return paperClaimSent; }
    public void setPaperClaimSent(Boolean paperClaimSent) { this.paperClaimSent = paperClaimSent; }

    public LocalDateTime getPaperClaimSentDate() { return paperClaimSentDate; }
    public void setPaperClaimSentDate(LocalDateTime paperClaimSentDate) { this.paperClaimSentDate = paperClaimSentDate; }

    public Boolean getStatementSent() { return statementSent; }
    public void setStatementSent(Boolean statementSent) { this.statementSent = statementSent; }

    public LocalDateTime getStatementSentDate() { return statementSentDate; }
    public void setStatementSentDate(LocalDateTime statementSentDate) { this.statementSentDate = statementSentDate; }

    public Boolean getHoldBilling() { return holdBilling; }
    public void setHoldBilling(Boolean holdBilling) { this.holdBilling = holdBilling; }

    public String getHoldReason() { return holdReason; }
    public void setHoldReason(String holdReason) { this.holdReason = holdReason; }

    public String getBatchNumber() { return batchNumber; }
    public void setBatchNumber(String batchNumber) { this.batchNumber = batchNumber; }

    public Integer getSubmissionCount() { return submissionCount; }
    public void setSubmissionCount(Integer submissionCount) { this.submissionCount = submissionCount; }

    public Integer getDenialCount() { return denialCount; }
    public void setDenialCount(Integer denialCount) { this.denialCount = denialCount; }

    public Integer getCorrectionCount() { return correctionCount; }
    public void setCorrectionCount(Integer correctionCount) { this.correctionCount = correctionCount; }

    public LocalDateTime getCreatedDate() { return createdDate; }
    public void setCreatedDate(LocalDateTime createdDate) { this.createdDate = createdDate; }

    public LocalDateTime getLastModifiedDate() { return lastModifiedDate; }
    public void setLastModifiedDate(LocalDateTime lastModifiedDate) { this.lastModifiedDate = lastModifiedDate; }

    public UUID getCreatedBy() { return createdBy; }
    public void setCreatedBy(UUID createdBy) { this.createdBy = createdBy; }

    public String getCreatedByName() { return createdByName; }
    public void setCreatedByName(String createdByName) { this.createdByName = createdByName; }

    public Long getVersion() { return version; }
    public void setVersion(Long version) { this.version = version; }

    public List<InvoiceLineItem> getLineItems() { return lineItems; }
    public void setLineItems(List<InvoiceLineItem> lineItems) { this.lineItems = lineItems; }

    public List<Payment> getPayments() { return payments; }
    public void setPayments(List<Payment> payments) { this.payments = payments; }

    public List<InvoiceAdjustment> getAdjustments() { return adjustments; }
    public void setAdjustments(List<InvoiceAdjustment> adjustments) { this.adjustments = adjustments; }

    public List<ClaimSubmission> getClaimSubmissions() { return claimSubmissions; }
    public void setClaimSubmissions(List<ClaimSubmission> claimSubmissions) { this.claimSubmissions = claimSubmissions; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Invoice)) return false;
        Invoice invoice = (Invoice) o;
        return id != null && id.equals(invoice.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    @Override
    public String toString() {
        return "Invoice{" +
                "id=" + id +
                ", invoiceNumber='" + invoiceNumber + '\'' +
                ", patientName='" + patientName + '\'' +
                ", totalAmount=" + totalAmount +
                ", status=" + status +
                ", invoiceDate=" + invoiceDate +
                '}';
    }
}
