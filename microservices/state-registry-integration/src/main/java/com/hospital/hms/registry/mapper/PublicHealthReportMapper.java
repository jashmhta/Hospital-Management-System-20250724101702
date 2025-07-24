package com.hospital.hms.registry.mapper;

import com.hospital.hms.registry.dto.PublicHealthReportResponseDto;
import com.hospital.hms.registry.entity.PublicHealthReport;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import java.time.LocalDateTime;

/**
 * MapStruct mapper for PublicHealthReport entity to DTO conversion
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Mapper(
    componentModel = "spring",
    unmappedTargetPolicy = ReportingPolicy.IGNORE,
    imports = { LocalDateTime.class }
)
public interface PublicHealthReportMapper {

    /**
     * Convert PublicHealthReport entity to response DTO
     */
    @Mapping(target = "isSubmitted", expression = "java(entity.isSubmitted())")
    @Mapping(target = "isAcknowledged", expression = "java(entity.isAcknowledged())")
    @Mapping(target = "isProcessed", expression = "java(entity.isProcessed())")
    @Mapping(target = "isOverdue", expression = "java(entity.isOverdue())")
    PublicHealthReportResponseDto toResponseDto(PublicHealthReport entity);
}
