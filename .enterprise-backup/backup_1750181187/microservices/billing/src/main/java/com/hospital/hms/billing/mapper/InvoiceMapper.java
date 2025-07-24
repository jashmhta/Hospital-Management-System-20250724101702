package com.hospital.hms.billing.mapper;

import com.hospital.hms.billing.dto.InvoiceCreateRequestDto;
import com.hospital.hms.billing.dto.InvoiceResponseDto;
import com.hospital.hms.billing.entity.Invoice;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import java.util.List;

/**
 * MapStruct mapper for Invoice entity and DTOs
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Mapper(
    componentModel = "spring",
    unmappedTargetPolicy = ReportingPolicy.IGNORE,
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
public interface InvoiceMapper {

    /**
     * Convert Invoice entity to InvoiceResponseDto
     */
    InvoiceResponseDto toResponseDto(Invoice invoice);

    /**
     * Convert InvoiceCreateRequestDto to Invoice entity
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "invoiceNumber", ignore = true)
    @Mapping(target = "accountNumber", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "invoiceDate", ignore = true)
    @Mapping(target = "dueDate", ignore = true)
    @Mapping(target = "amountPaid", ignore = true)
    @Mapping(target = "balanceDue", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "lastModifiedDate", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "lastModifiedBy", ignore = true)
    Invoice toEntity(InvoiceCreateRequestDto createRequestDto);

    /**
     * Update existing Invoice entity from InvoiceCreateRequestDto
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "invoiceNumber", ignore = true)
    @Mapping(target = "accountNumber", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "invoiceDate", ignore = true)
    @Mapping(target = "dueDate", ignore = true)
    @Mapping(target = "amountPaid", ignore = true)
    @Mapping(target = "balanceDue", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "lastModifiedDate", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "lastModifiedBy", ignore = true)
    void updateEntityFromDto(InvoiceCreateRequestDto updateRequestDto, @MappingTarget Invoice invoice);

    /**
     * Convert list of Invoice entities to list of InvoiceResponseDto
     */
    List<InvoiceResponseDto> toResponseDtoList(List<Invoice> invoices);

    /**
     * Partial mapping for update operations
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "invoiceNumber", ignore = true)
    @Mapping(target = "accountNumber", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    void partialUpdate(InvoiceCreateRequestDto updateDto, @MappingTarget Invoice invoice);
}
