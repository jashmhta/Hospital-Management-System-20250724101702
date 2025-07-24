package com.hospital.hms.hieintegration.mapper;

import com.hospital.hms.hieintegration.dto.HieCreateRequestDto;
import com.hospital.hms.hieintegration.dto.HieResponseDto;
import com.hospital.hms.hieintegration.entity.HealthInformationExchange;
import org.mapstruct.*;

/**
 * MapStruct mapper for HealthInformationExchange entity and DTOs
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Mapper(
    componentModel = "spring",
    unmappedTargetPolicy = ReportingPolicy.IGNORE,
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
public interface HealthInformationExchangeMapper {

    /**
     * Convert create request DTO to entity
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "dataExchanges", ignore = true)
    @Mapping(target = "connections", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "lastModifiedDate", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "lastModifiedBy", ignore = true)
    @Mapping(target = "uptimePercentage", ignore = true)
    @Mapping(target = "averageResponseTimeMs", ignore = true)
    @Mapping(target = "successRatePercentage", ignore = true)
    @Mapping(target = "lastSuccessfulConnection", ignore = true)
    @Mapping(target = "lastFailedConnection", ignore = true)
    HealthInformationExchange toEntity(HieCreateRequestDto createRequestDto);

    /**
     * Convert entity to response DTO
     */
    @Mapping(target = "hasClientSecret", ignore = true)\n    @Mapping(target = "currentConnectionStatus", ignore = true)\n    @Mapping(target = "lastConnectionTest", ignore = true)\n    @Mapping(target = "isOperational", ignore = true)\n    @Mapping(target = "totalExchanges", ignore = true)\n    @Mapping(target = "successfulExchanges", ignore = true)\n    @Mapping(target = "failedExchanges", ignore = true)\n    @Mapping(target = "pendingExchanges", ignore = true)\n    @Mapping(target = "recentExchanges", ignore = true)\n    @Mapping(target = "recentConnections", ignore = true)\n    @Mapping(target = "healthStatus", ignore = true)\n    @Mapping(target = "daysSinceLastSuccess", ignore = true)\n    @Mapping(target = "daysSinceLastFailure", ignore = true)\n    @Mapping(target = "performanceRating", ignore = true)\n    HieResponseDto toResponseDto(HealthInformationExchange entity);\n\n    /**\n     * Update entity from DTO\n     */\n    @Mapping(target = "id", ignore = true)\n    @Mapping(target = "dataExchanges", ignore = true)\n    @Mapping(target = "connections", ignore = true)\n    @Mapping(target = "createdDate", ignore = true)\n    @Mapping(target = "lastModifiedDate", ignore = true)\n    @Mapping(target = "createdBy", ignore = true)\n    @Mapping(target = "lastModifiedBy", ignore = true)\n    @Mapping(target = "uptimePercentage", ignore = true)\n    @Mapping(target = "averageResponseTimeMs", ignore = true)\n    @Mapping(target = "successRatePercentage", ignore = true)\n    @Mapping(target = "lastSuccessfulConnection", ignore = true)\n    @Mapping(target = "lastFailedConnection", ignore = true)\n    void updateEntityFromDto(HieCreateRequestDto updateRequestDto, @MappingTarget HealthInformationExchange entity);\n\n    /**\n     * Post-mapping processing for response DTO\n     */\n    @AfterMapping\n    default void afterMappingToResponseDto(@MappingTarget HieResponseDto responseDto, HealthInformationExchange entity) {\n        // Set computed fields\n        responseDto.setHasClientSecret(entity.getClientSecret() != null && !entity.getClientSecret().isEmpty());\n        \n        // Performance rating based on metrics\n        if (entity.getUptimePercentage() != null && entity.getSuccessRatePercentage() != null && \n            entity.getAverageResponseTimeMs() != null) {\n            responseDto.setPerformanceRating(calculatePerformanceRating(\n                entity.getUptimePercentage(), \n                entity.getSuccessRatePercentage(), \n                entity.getAverageResponseTimeMs()));\n        }\n    }\n\n    /**\n     * Calculate performance rating based on metrics\n     */\n    default String calculatePerformanceRating(Double uptimePercentage, Double successRatePercentage, \n                                             Long averageResponseTimeMs) {\n        if (uptimePercentage >= 99.5 && successRatePercentage >= 99.0 && averageResponseTimeMs <= 1000) {\n            return \"EXCELLENT\";\n        } else if (uptimePercentage >= 98.0 && successRatePercentage >= 95.0 && averageResponseTimeMs <= 3000) {\n            return \"GOOD\";\n        } else if (uptimePercentage >= 95.0 && successRatePercentage >= 90.0 && averageResponseTimeMs <= 5000) {\n            return \"FAIR\";\n        } else {\n            return \"POOR\";\n        }\n    }\n}\n"
