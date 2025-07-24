package com.hospital.hms.billing.repository;

import com.hospital.hms.billing.entity.Invoice;
import com.hospital.hms.billing.entity.InvoiceStatus;
import com.hospital.hms.billing.entity.InvoiceType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.cache.annotation.Cacheable;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Invoice Repository Interface
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, UUID>, JpaSpecificationExecutor<Invoice> {

    @Cacheable(value = "invoices", key = "#invoiceNumber")
    Optional<Invoice> findByInvoiceNumber(String invoiceNumber);

    Optional<Invoice> findByAccountNumber(String accountNumber);

    List<Invoice> findByPatientId(UUID patientId);

    List<Invoice> findByProviderId(UUID providerId);

    List<Invoice> findByStatus(InvoiceStatus status);

    List<Invoice> findByInvoiceType(InvoiceType invoiceType);

    @Query("SELECT i FROM Invoice i WHERE i.dueDate < :currentDate AND i.status NOT IN ('PAID', 'CANCELLED', 'REFUNDED')")
    List<Invoice> findOverdueInvoices(@Param("currentDate") LocalDate currentDate);

    @Query("SELECT i FROM Invoice i WHERE i.patientId = :patientId AND i.status = :status")
    List<Invoice> findByPatientIdAndStatus(@Param("patientId") UUID patientId, @Param("status") InvoiceStatus status);

    @Query("SELECT i FROM Invoice i WHERE i.invoiceDate BETWEEN :startDate AND :endDate")
    List<Invoice> findByInvoiceDateBetween(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT i FROM Invoice i WHERE i.totalAmount >= :minAmount AND i.totalAmount <= :maxAmount")
    List<Invoice> findByTotalAmountBetween(@Param("minAmount") BigDecimal minAmount, @Param("maxAmount") BigDecimal maxAmount);

    @Query("SELECT SUM(i.totalAmount) FROM Invoice i WHERE i.status = 'PAID' AND i.invoiceDate BETWEEN :startDate AND :endDate")
    BigDecimal getTotalRevenueByDateRange(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT SUM(i.totalAmount) FROM Invoice i WHERE i.status IN ('PENDING', 'SENT', 'OVERDUE') AND i.patientId = :patientId")
    BigDecimal getPatientOutstandingBalance(@Param("patientId") UUID patientId);

    @Query("SELECT COUNT(i) as totalInvoices, " +
           "COUNT(CASE WHEN i.status = 'PAID' THEN 1 END) as paidCount, " +
           "COUNT(CASE WHEN i.status = 'PENDING' THEN 1 END) as pendingCount, " +
           "COUNT(CASE WHEN i.status = 'OVERDUE' THEN 1 END) as overdueCount, " +
           "SUM(i.totalAmount) as totalAmount, " +
           "SUM(CASE WHEN i.status = 'PAID' THEN i.totalAmount ELSE 0 END) as paidAmount " +
           "FROM Invoice i WHERE i.invoiceDate >= :startDate")
    Object[] getInvoiceStatistics(@Param("startDate") LocalDate startDate);

    boolean existsByInvoiceNumber(String invoiceNumber);

    boolean existsByAccountNumber(String accountNumber);

    @Query("SELECT i FROM Invoice i WHERE LOWER(i.patientName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(i.providerName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(i.invoiceNumber) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(i.accountNumber) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    Page<Invoice> fullTextSearch(@Param("searchTerm") String searchTerm, Pageable pageable);
}
