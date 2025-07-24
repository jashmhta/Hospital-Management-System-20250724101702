package com.hospital.hms.billing.service;

import com.hospital.hms.billing.dto.InvoiceCreateRequestDto;
import com.hospital.hms.billing.dto.InvoiceResponseDto;
import com.hospital.hms.billing.entity.InvoiceStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Service interface for Invoice Management operations
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
public interface InvoiceService {

    InvoiceResponseDto createInvoice(InvoiceCreateRequestDto createRequest);

    InvoiceResponseDto updateInvoice(UUID invoiceId, InvoiceCreateRequestDto updateRequest);

    InvoiceResponseDto getInvoiceById(UUID invoiceId);

    InvoiceResponseDto getInvoiceByNumber(String invoiceNumber);

    Page<InvoiceResponseDto> searchInvoices(String searchTerm, Pageable pageable);

    List<InvoiceResponseDto> getPatientInvoices(UUID patientId);

    List<InvoiceResponseDto> getProviderInvoices(UUID providerId);

    List<InvoiceResponseDto> getInvoicesByStatus(InvoiceStatus status);

    List<InvoiceResponseDto> getOverdueInvoices();

    InvoiceResponseDto updateInvoiceStatus(UUID invoiceId, InvoiceStatus newStatus);

    InvoiceResponseDto processPayment(UUID invoiceId, BigDecimal paymentAmount);

    String generateInvoiceNumber();

    BigDecimal getPatientOutstandingBalance(UUID patientId);

    Map<String, Object> getInvoiceStatistics();
}
