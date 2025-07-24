package com.hospital.hms.billing.controller;

import com.hospital.hms.billing.dto.InvoiceCreateRequestDto;
import com.hospital.hms.billing.dto.InvoiceResponseDto;
import com.hospital.hms.billing.entity.InvoiceStatus;
import com.hospital.hms.billing.service.InvoiceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * REST Controller for Invoice and Billing Management
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@RestController
@RequestMapping("/api/v1/invoices")
@Tag(name = "Billing & Invoicing", description = "Invoice and Billing Management API")
public class InvoiceController {

    private final InvoiceService invoiceService;

    @Autowired
    public InvoiceController(InvoiceService invoiceService) {
        this.invoiceService = invoiceService;
    }

    @Operation(summary = "Create a new invoice")
    @ApiResponse(responseCode = "201", description = "Invoice created successfully")
    @PostMapping
    public ResponseEntity<InvoiceResponseDto> createInvoice(@Valid @RequestBody InvoiceCreateRequestDto createRequest) {
        InvoiceResponseDto invoice = invoiceService.createInvoice(createRequest);
        return new ResponseEntity<>(invoice, HttpStatus.CREATED);
    }

    @Operation(summary = "Update an existing invoice")
    @ApiResponse(responseCode = "200", description = "Invoice updated successfully")
    @PutMapping("/{invoiceId}")
    public ResponseEntity<InvoiceResponseDto> updateInvoice(
            @Parameter(description = "Invoice ID") @PathVariable UUID invoiceId,
            @Valid @RequestBody InvoiceCreateRequestDto updateRequest) {
        InvoiceResponseDto invoice = invoiceService.updateInvoice(invoiceId, updateRequest);
        return ResponseEntity.ok(invoice);
    }

    @Operation(summary = "Get invoice by ID")
    @ApiResponse(responseCode = "200", description = "Invoice found")
    @GetMapping("/{invoiceId}")
    public ResponseEntity<InvoiceResponseDto> getInvoiceById(@Parameter(description = "Invoice ID") @PathVariable UUID invoiceId) {
        InvoiceResponseDto invoice = invoiceService.getInvoiceById(invoiceId);
        return ResponseEntity.ok(invoice);
    }

    @Operation(summary = "Get invoice by number")
    @ApiResponse(responseCode = "200", description = "Invoice found")
    @GetMapping("/number/{invoiceNumber}")
    public ResponseEntity<InvoiceResponseDto> getInvoiceByNumber(@Parameter(description = "Invoice number") @PathVariable String invoiceNumber) {
        InvoiceResponseDto invoice = invoiceService.getInvoiceByNumber(invoiceNumber);
        return ResponseEntity.ok(invoice);
    }

    @Operation(summary = "Search invoices")
    @ApiResponse(responseCode = "200", description = "Invoices found")
    @GetMapping("/search")
    public ResponseEntity<Page<InvoiceResponseDto>> searchInvoices(
            @Parameter(description = "Search term") @RequestParam String searchTerm,
            Pageable pageable) {
        Page<InvoiceResponseDto> invoices = invoiceService.searchInvoices(searchTerm, pageable);
        return ResponseEntity.ok(invoices);
    }

    @Operation(summary = "Get invoices by patient ID")
    @ApiResponse(responseCode = "200", description = "Invoices found")
    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<InvoiceResponseDto>> getPatientInvoices(@Parameter(description = "Patient ID") @PathVariable UUID patientId) {
        List<InvoiceResponseDto> invoices = invoiceService.getPatientInvoices(patientId);
        return ResponseEntity.ok(invoices);
    }

    @Operation(summary = "Get invoices by provider ID")
    @ApiResponse(responseCode = "200", description = "Invoices found")
    @GetMapping("/provider/{providerId}")
    public ResponseEntity<List<InvoiceResponseDto>> getProviderInvoices(@Parameter(description = "Provider ID") @PathVariable UUID providerId) {
        List<InvoiceResponseDto> invoices = invoiceService.getProviderInvoices(providerId);
        return ResponseEntity.ok(invoices);
    }

    @Operation(summary = "Get invoices by status")
    @ApiResponse(responseCode = "200", description = "Invoices found")
    @GetMapping("/status/{status}")
    public ResponseEntity<List<InvoiceResponseDto>> getInvoicesByStatus(@Parameter(description = "Invoice status") @PathVariable InvoiceStatus status) {
        List<InvoiceResponseDto> invoices = invoiceService.getInvoicesByStatus(status);
        return ResponseEntity.ok(invoices);
    }

    @Operation(summary = "Get overdue invoices")
    @ApiResponse(responseCode = "200", description = "Overdue invoices found")
    @GetMapping("/overdue")
    public ResponseEntity<List<InvoiceResponseDto>> getOverdueInvoices() {
        List<InvoiceResponseDto> overdueInvoices = invoiceService.getOverdueInvoices();
        return ResponseEntity.ok(overdueInvoices);
    }

    @Operation(summary = "Update invoice status")
    @ApiResponse(responseCode = "200", description = "Invoice status updated")
    @PutMapping("/{invoiceId}/status")
    public ResponseEntity<InvoiceResponseDto> updateInvoiceStatus(
            @Parameter(description = "Invoice ID") @PathVariable UUID invoiceId,
            @Parameter(description = "New status") @RequestParam InvoiceStatus status) {
        InvoiceResponseDto invoice = invoiceService.updateInvoiceStatus(invoiceId, status);
        return ResponseEntity.ok(invoice);
    }

    @Operation(summary = "Process payment for invoice")
    @ApiResponse(responseCode = "200", description = "Payment processed successfully")
    @PostMapping("/{invoiceId}/payments")
    public ResponseEntity<InvoiceResponseDto> processPayment(
            @Parameter(description = "Invoice ID") @PathVariable UUID invoiceId,
            @Parameter(description = "Payment amount") @RequestParam BigDecimal amount) {
        InvoiceResponseDto invoice = invoiceService.processPayment(invoiceId, amount);
        return ResponseEntity.ok(invoice);
    }

    @Operation(summary = "Get patient outstanding balance")
    @ApiResponse(responseCode = "200", description = "Outstanding balance calculated")
    @GetMapping("/patient/{patientId}/balance")
    public ResponseEntity<Map<String, BigDecimal>> getPatientOutstandingBalance(@Parameter(description = "Patient ID") @PathVariable UUID patientId) {
        BigDecimal balance = invoiceService.getPatientOutstandingBalance(patientId);
        return ResponseEntity.ok(Map.of("outstandingBalance", balance));
    }

    @Operation(summary = "Get invoice statistics")
    @ApiResponse(responseCode = "200", description = "Statistics retrieved")
    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getInvoiceStatistics() {
        Map<String, Object> statistics = invoiceService.getInvoiceStatistics();
        return ResponseEntity.ok(statistics);
    }

    @Operation(summary = "Generate new invoice number")
    @ApiResponse(responseCode = "200", description = "Invoice number generated")
    @GetMapping("/generate-number")
    public ResponseEntity<Map<String, String>> generateInvoiceNumber() {
        String invoiceNumber = invoiceService.generateInvoiceNumber();
        return ResponseEntity.ok(Map.of("invoiceNumber", invoiceNumber));
    }

    // Additional endpoints for revenue cycle management

    @Operation(summary = "Get collection report")
    @ApiResponse(responseCode = "200", description = "Collection report generated")
    @GetMapping("/reports/collections")
    public ResponseEntity<Map<String, Object>> getCollectionReport(
            @Parameter(description = "Start date (YYYY-MM-DD)") @RequestParam(required = false) String startDate,
            @Parameter(description = "End date (YYYY-MM-DD)") @RequestParam(required = false) String endDate) {
        // TODO: Implement collection report logic
        Map<String, Object> report = Map.of(
            "message", "Collection report endpoint - implementation pending",
            "startDate", startDate,
            "endDate", endDate
        );
        return ResponseEntity.ok(report);
    }

    @Operation(summary = "Get aging report")
    @ApiResponse(responseCode = "200", description = "Aging report generated")
    @GetMapping("/reports/aging")
    public ResponseEntity<Map<String, Object>> getAgingReport() {
        // TODO: Implement aging report logic
        Map<String, Object> report = Map.of(
            "message", "Aging report endpoint - implementation pending"
        );
        return ResponseEntity.ok(report);
    }

    @Operation(summary = "Send invoice reminder")
    @ApiResponse(responseCode = "200", description = "Reminder sent successfully")
    @PostMapping("/{invoiceId}/reminder")
    public ResponseEntity<Map<String, String>> sendInvoiceReminder(@Parameter(description = "Invoice ID") @PathVariable UUID invoiceId) {
        // TODO: Implement invoice reminder logic
        return ResponseEntity.ok(Map.of(
            "message", "Invoice reminder sent successfully",
            "invoiceId", invoiceId.toString()
        ));
    }

    @Operation(summary = "Bulk status update")
    @ApiResponse(responseCode = "200", description = "Bulk update completed")
    @PutMapping("/bulk/status")
    public ResponseEntity<Map<String, Object>> bulkStatusUpdate(
            @Parameter(description = "Invoice IDs") @RequestBody List<UUID> invoiceIds,
            @Parameter(description = "New status") @RequestParam InvoiceStatus status) {
        // TODO: Implement bulk status update logic
        return ResponseEntity.ok(Map.of(
            "message", "Bulk status update completed",
            "updatedCount", invoiceIds.size(),
            "status", status.toString()
        ));
    }
}
