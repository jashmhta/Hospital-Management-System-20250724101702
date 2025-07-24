package com.hospital.hms.billing.service.impl;

import com.hospital.hms.billing.dto.InvoiceCreateRequestDto;
import com.hospital.hms.billing.dto.InvoiceResponseDto;
import com.hospital.hms.billing.entity.Invoice;
import com.hospital.hms.billing.entity.InvoiceStatus;
import com.hospital.hms.billing.entity.InvoicePriority;
import com.hospital.hms.billing.mapper.InvoiceMapper;
import com.hospital.hms.billing.repository.InvoiceRepository;
import com.hospital.hms.billing.service.InvoiceService;
import com.hospital.hms.shared.exception.ResourceNotFoundException;
import com.hospital.hms.shared.exception.BusinessException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Implementation of InvoiceService with comprehensive billing business logic
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Service
@Transactional
public class InvoiceServiceImpl implements InvoiceService {

    private static final Logger logger = LoggerFactory.getLogger(InvoiceServiceImpl.class);
    
    private final InvoiceRepository invoiceRepository;
    private final InvoiceMapper invoiceMapper;

    @Autowired
    public InvoiceServiceImpl(InvoiceRepository invoiceRepository, InvoiceMapper invoiceMapper) {
        this.invoiceRepository = invoiceRepository;
        this.invoiceMapper = invoiceMapper;
    }

    @Override
    public InvoiceResponseDto createInvoice(InvoiceCreateRequestDto createRequest) {
        logger.info("Creating new invoice for patient: {}", createRequest.getPatientId());

        try {
            // Validate business rules
            validateInvoiceCreation(createRequest);

            // Convert DTO to entity
            Invoice invoice = invoiceMapper.toEntity(createRequest);

            // Set system-generated fields
            invoice.setInvoiceNumber(generateInvoiceNumber());
            invoice.setAccountNumber(generateAccountNumber(createRequest.getPatientId()));
            invoice.setInvoiceDate(LocalDate.now());
            invoice.setDueDate(calculateDueDate(createRequest.getInvoiceType()));
            invoice.setStatus(InvoiceStatus.DRAFT);
            invoice.setPaidAmount(BigDecimal.ZERO);
            invoice.setBalanceDue(createRequest.getTotalAmount());

            // Set audit fields
            invoice.setCreatedBy("system"); // TODO: Get from security context
            invoice.setLastModifiedBy("system");

            // Set priority if not provided
            if (invoice.getPriority() == null) {
                invoice.setPriority(InvoicePriority.NORMAL);
            }

            // Calculate financial fields
            calculateFinancialFields(invoice);

            // Save invoice
            Invoice savedInvoice = invoiceRepository.save(invoice);

            logger.info("Successfully created invoice: {} for patient: {}", 
                savedInvoice.getInvoiceNumber(), savedInvoice.getPatientId());

            // TODO: Publish invoice created event
            // eventPublisher.publishInvoiceCreated(savedInvoice);

            return invoiceMapper.toResponseDto(savedInvoice);

        } catch (Exception e) {
            logger.error("Error creating invoice for patient: {}", createRequest.getPatientId(), e);
            throw new BusinessException("Failed to create invoice: " + e.getMessage(), "INVOICE_CREATION_FAILED");
        }
    }

    @Override
    public InvoiceResponseDto updateInvoice(UUID invoiceId, InvoiceCreateRequestDto updateRequest) {
        logger.info("Updating invoice: {}", invoiceId);

        try {
            Invoice existingInvoice = getInvoiceEntityById(invoiceId);

            // Validate update permissions
            validateInvoiceUpdate(existingInvoice, updateRequest);

            // Update entity from DTO
            invoiceMapper.updateEntityFromDto(updateRequest, existingInvoice);

            // Recalculate financial fields
            calculateFinancialFields(existingInvoice);

            // Update audit fields
            existingInvoice.setLastModifiedBy("system"); // TODO: Get from security context

            Invoice updatedInvoice = invoiceRepository.save(existingInvoice);

            logger.info("Successfully updated invoice: {}", updatedInvoice.getInvoiceNumber());

            // TODO: Publish invoice updated event
            // eventPublisher.publishInvoiceUpdated(updatedInvoice);

            return invoiceMapper.toResponseDto(updatedInvoice);

        } catch (Exception e) {
            logger.error("Error updating invoice: {}", invoiceId, e);
            throw new BusinessException("Failed to update invoice: " + e.getMessage(), "INVOICE_UPDATE_FAILED");
        }
    }

    @Override
    @Transactional(readOnly = true)
    public InvoiceResponseDto getInvoiceById(UUID invoiceId) {
        logger.debug("Retrieving invoice by ID: {}", invoiceId);
        Invoice invoice = getInvoiceEntityById(invoiceId);
        return invoiceMapper.toResponseDto(invoice);
    }

    @Override
    @Transactional(readOnly = true)
    public InvoiceResponseDto getInvoiceByNumber(String invoiceNumber) {
        logger.debug("Retrieving invoice by number: {}", invoiceNumber);
        Invoice invoice = invoiceRepository.findByInvoiceNumber(invoiceNumber)
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Invoice not found with number: " + invoiceNumber, 
                    invoiceNumber, 
                    "Invoice"
                ));
        return invoiceMapper.toResponseDto(invoice);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<InvoiceResponseDto> searchInvoices(String searchTerm, Pageable pageable) {
        logger.debug("Searching invoices with term: {}", searchTerm);
        Page<Invoice> invoices = invoiceRepository.fullTextSearch(searchTerm, pageable);
        return invoices.map(invoiceMapper::toResponseDto);
    }

    @Override
    @Transactional(readOnly = true)
    public List<InvoiceResponseDto> getPatientInvoices(UUID patientId) {
        logger.debug("Retrieving invoices for patient: {}", patientId);
        List<Invoice> invoices = invoiceRepository.findByPatientId(patientId);
        return invoiceMapper.toResponseDtoList(invoices);
    }

    @Override
    @Transactional(readOnly = true)
    public List<InvoiceResponseDto> getProviderInvoices(UUID providerId) {
        logger.debug("Retrieving invoices for provider: {}", providerId);
        List<Invoice> invoices = invoiceRepository.findByProviderId(providerId);
        return invoiceMapper.toResponseDtoList(invoices);
    }

    @Override
    @Transactional(readOnly = true)
    public List<InvoiceResponseDto> getInvoicesByStatus(InvoiceStatus status) {
        logger.debug("Retrieving invoices with status: {}", status);
        List<Invoice> invoices = invoiceRepository.findByStatus(status);
        return invoiceMapper.toResponseDtoList(invoices);
    }

    @Override
    @Transactional(readOnly = true)
    public List<InvoiceResponseDto> getOverdueInvoices() {
        logger.debug("Retrieving overdue invoices");
        List<Invoice> overdueInvoices = invoiceRepository.findOverdueInvoices(LocalDate.now());
        return invoiceMapper.toResponseDtoList(overdueInvoices);
    }

    @Override
    public InvoiceResponseDto updateInvoiceStatus(UUID invoiceId, InvoiceStatus newStatus) {
        logger.info("Updating invoice status: {} to {}", invoiceId, newStatus);

        try {
            Invoice invoice = getInvoiceEntityById(invoiceId);
            InvoiceStatus oldStatus = invoice.getStatus();

            // Validate status transition
            validateStatusTransition(oldStatus, newStatus);

            invoice.setStatus(newStatus);
            invoice.setLastModifiedBy("system"); // TODO: Get from security context

            // Handle specific status changes
            handleStatusChange(invoice, oldStatus, newStatus);

            Invoice updatedInvoice = invoiceRepository.save(invoice);

            logger.info("Successfully updated invoice status: {} from {} to {}", 
                invoice.getInvoiceNumber(), oldStatus, newStatus);

            // TODO: Publish invoice status changed event
            // eventPublisher.publishInvoiceStatusChanged(updatedInvoice, oldStatus, newStatus);

            return invoiceMapper.toResponseDto(updatedInvoice);

        } catch (Exception e) {
            logger.error("Error updating invoice status: {} to {}", invoiceId, newStatus, e);
            throw new BusinessException("Failed to update invoice status: " + e.getMessage(), "INVOICE_STATUS_UPDATE_FAILED");
        }
    }

    @Override
    public InvoiceResponseDto processPayment(UUID invoiceId, BigDecimal paymentAmount) {
        logger.info("Processing payment of {} for invoice: {}", paymentAmount, invoiceId);

        try {
            Invoice invoice = getInvoiceEntityById(invoiceId);

            // Validate payment
            validatePayment(invoice, paymentAmount);

            // Update payment amounts
            BigDecimal currentPaidAmount = invoice.getPaidAmount() != null ? invoice.getPaidAmount() : BigDecimal.ZERO;
            BigDecimal newPaidAmount = currentPaidAmount.add(paymentAmount);
            BigDecimal newBalanceDue = invoice.getTotalAmount().subtract(newPaidAmount);

            invoice.setPaidAmount(newPaidAmount);
            invoice.setBalanceDue(newBalanceDue);

            // Update status based on payment
            if (newBalanceDue.compareTo(BigDecimal.ZERO) == 0) {
                invoice.setStatus(InvoiceStatus.PAID);
            } else if (newPaidAmount.compareTo(BigDecimal.ZERO) > 0) {
                invoice.setStatus(InvoiceStatus.PARTIALLY_PAID);
            }

            invoice.setLastModifiedBy("system"); // TODO: Get from security context

            Invoice updatedInvoice = invoiceRepository.save(invoice);

            logger.info("Successfully processed payment of {} for invoice: {}", 
                paymentAmount, invoice.getInvoiceNumber());

            // TODO: Publish payment processed event
            // eventPublisher.publishPaymentProcessed(updatedInvoice, paymentAmount);

            return invoiceMapper.toResponseDto(updatedInvoice);

        } catch (Exception e) {
            logger.error("Error processing payment for invoice: {}", invoiceId, e);
            throw new BusinessException("Failed to process payment: " + e.getMessage(), "PAYMENT_PROCESSING_FAILED");
        }
    }

    @Override
    public String generateInvoiceNumber() {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        String randomSuffix = String.format("%04d", (int) (Math.random() * 10000));
        return "INV-" + timestamp + "-" + randomSuffix;
    }

    @Override
    @Transactional(readOnly = true)
    public BigDecimal getPatientOutstandingBalance(UUID patientId) {
        logger.debug("Calculating outstanding balance for patient: {}", patientId);
        BigDecimal balance = invoiceRepository.getPatientOutstandingBalance(patientId);
        return balance != null ? balance : BigDecimal.ZERO;
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getInvoiceStatistics() {
        logger.debug("Retrieving invoice statistics");
        
        LocalDate thirtyDaysAgo = LocalDate.now().minusDays(30);
        Object[] stats = invoiceRepository.getInvoiceStatistics(thirtyDaysAgo);
        
        Map<String, Object> statistics = new HashMap<>();
        if (stats != null && stats.length >= 6) {
            statistics.put("totalInvoices", stats[0]);
            statistics.put("paidInvoices", stats[1]);
            statistics.put("pendingInvoices", stats[2]);
            statistics.put("overdueInvoices", stats[3]);
            statistics.put("totalAmount", stats[4]);
            statistics.put("paidAmount", stats[5]);
            
            // Calculate derived metrics
            if (stats[4] != null && stats[5] != null) {
                BigDecimal totalAmount = (BigDecimal) stats[4];
                BigDecimal paidAmount = (BigDecimal) stats[5];
                statistics.put("outstandingAmount", totalAmount.subtract(paidAmount));
                
                if (totalAmount.compareTo(BigDecimal.ZERO) > 0) {
                    BigDecimal collectionRate = paidAmount.divide(totalAmount, 4, BigDecimal.ROUND_HALF_UP)
                            .multiply(BigDecimal.valueOf(100));
                    statistics.put("collectionRate", collectionRate);
                }
            }
        }
        
        return statistics;
    }

    // Private helper methods

    private Invoice getInvoiceEntityById(UUID invoiceId) {
        return invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Invoice not found with ID: " + invoiceId, 
                    invoiceId.toString(), 
                    "Invoice"
                ));
    }

    private void validateInvoiceCreation(InvoiceCreateRequestDto createRequest) {
        // Validate required fields
        if (createRequest.getPatientId() == null) {
            throw new BusinessException("Patient ID is required", "PATIENT_ID_REQUIRED");
        }
        if (createRequest.getProviderId() == null) {
            throw new BusinessException("Provider ID is required", "PROVIDER_ID_REQUIRED");
        }
        if (createRequest.getTotalAmount() == null || createRequest.getTotalAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new BusinessException("Total amount must be greater than zero", "INVALID_TOTAL_AMOUNT");
        }
        if (createRequest.getServiceDateFrom() == null) {
            throw new BusinessException("Service date from is required", "SERVICE_DATE_REQUIRED");
        }
    }

    private void validateInvoiceUpdate(Invoice existingInvoice, InvoiceCreateRequestDto updateRequest) {
        // Cannot update paid or cancelled invoices
        if (existingInvoice.getStatus() == InvoiceStatus.PAID || 
            existingInvoice.getStatus() == InvoiceStatus.CANCELLED) {
            throw new BusinessException(
                "Cannot update invoice with status: " + existingInvoice.getStatus(), 
                "INVALID_INVOICE_STATUS_FOR_UPDATE"
            );
        }
    }

    private void validateStatusTransition(InvoiceStatus oldStatus, InvoiceStatus newStatus) {
        // Define valid status transitions
        Map<InvoiceStatus, List<InvoiceStatus>> validTransitions = Map.of(
            InvoiceStatus.DRAFT, List.of(InvoiceStatus.PENDING, InvoiceStatus.CANCELLED),
            InvoiceStatus.PENDING, List.of(InvoiceStatus.SENT, InvoiceStatus.CANCELLED),
            InvoiceStatus.SENT, List.of(InvoiceStatus.PAID, InvoiceStatus.OVERDUE, InvoiceStatus.DISPUTED, InvoiceStatus.PARTIALLY_PAID, InvoiceStatus.CANCELLED),
            InvoiceStatus.OVERDUE, List.of(InvoiceStatus.PAID, InvoiceStatus.DISPUTED, InvoiceStatus.PARTIALLY_PAID, InvoiceStatus.CANCELLED),
            InvoiceStatus.PARTIALLY_PAID, List.of(InvoiceStatus.PAID, InvoiceStatus.DISPUTED, InvoiceStatus.CANCELLED),
            InvoiceStatus.DISPUTED, List.of(InvoiceStatus.PAID, InvoiceStatus.CANCELLED, InvoiceStatus.REFUNDED)
        );

        List<InvoiceStatus> allowedTransitions = validTransitions.get(oldStatus);
        if (allowedTransitions == null || !allowedTransitions.contains(newStatus)) {
            throw new BusinessException(
                String.format("Invalid status transition from %s to %s", oldStatus, newStatus),
                "INVALID_STATUS_TRANSITION"
            );
        }
    }

    private void validatePayment(Invoice invoice, BigDecimal paymentAmount) {
        if (paymentAmount == null || paymentAmount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BusinessException("Payment amount must be greater than zero", "INVALID_PAYMENT_AMOUNT");
        }

        if (invoice.getStatus() == InvoiceStatus.PAID) {
            throw new BusinessException("Cannot process payment for already paid invoice", "INVOICE_ALREADY_PAID");
        }

        if (invoice.getStatus() == InvoiceStatus.CANCELLED || invoice.getStatus() == InvoiceStatus.REFUNDED) {
            throw new BusinessException("Cannot process payment for cancelled or refunded invoice", "INVALID_INVOICE_STATUS_FOR_PAYMENT");
        }

        BigDecimal currentBalance = invoice.getBalanceDue();
        if (paymentAmount.compareTo(currentBalance) > 0) {
            throw new BusinessException("Payment amount exceeds outstanding balance", "PAYMENT_EXCEEDS_BALANCE");
        }
    }

    private void calculateFinancialFields(Invoice invoice) {
        // Calculate tax if not provided
        if (invoice.getTaxAmount() == null) {
            invoice.setTaxAmount(BigDecimal.ZERO);
        }

        // Calculate discount if not provided
        if (invoice.getDiscountAmount() == null) {
            invoice.setDiscountAmount(BigDecimal.ZERO);
        }

        // Calculate total amount
        BigDecimal totalAmount = invoice.getSubtotal()
                .add(invoice.getTaxAmount())
                .subtract(invoice.getDiscountAmount());
        invoice.setTotalAmount(totalAmount);

        // Calculate balance due
        BigDecimal paidAmount = invoice.getPaidAmount() != null ? invoice.getPaidAmount() : BigDecimal.ZERO;
        invoice.setBalanceDue(totalAmount.subtract(paidAmount));
    }

    private LocalDate calculateDueDate(com.hospital.hms.billing.entity.InvoiceType invoiceType) {
        LocalDate today = LocalDate.now();
        
        // Different payment terms based on invoice type
        return switch (invoiceType) {
            case EMERGENCY -> today.plusDays(15); // Faster payment for emergency services
            case INPATIENT, SURGERY -> today.plusDays(45); // Longer payment terms for major services
            case OUTPATIENT, CONSULTATION -> today.plusDays(30); // Standard payment terms
            default -> today.plusDays(30);
        };
    }

    private String generateAccountNumber(UUID patientId) {
        // Generate account number based on patient ID and timestamp
        String patientIdStr = patientId.toString().replace("-", "").substring(0, 8).toUpperCase();
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        return "ACC-" + patientIdStr + "-" + timestamp;
    }

    private void handleStatusChange(Invoice invoice, InvoiceStatus oldStatus, InvoiceStatus newStatus) {
        // Handle specific business logic for status changes
        switch (newStatus) {
            case SENT:
                // Set sent date, update due date if needed
                break;
            case OVERDUE:
                // Mark as overdue, trigger collection processes
                break;
            case CANCELLED:
                // Reset amounts, handle cancellation logic
                invoice.setBalanceDue(BigDecimal.ZERO);
                break;
            case REFUNDED:
                // Handle refund logic
                invoice.setPaidAmount(BigDecimal.ZERO);
                invoice.setBalanceDue(BigDecimal.ZERO);
                break;
            default:
                // No special handling needed
                break;
        }
    }
}
