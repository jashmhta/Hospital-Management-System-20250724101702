package com.hospital.hms.analytics.mapper;

import com.hospital.hms.analytics.dto.DataIngestionRequestDto;
import com.hospital.hms.analytics.dto.DataRetentionPolicyDto;
import com.hospital.hms.analytics.entity.DataIngestionEntity;
import com.hospital.hms.analytics.entity.DataRetentionPolicyEntity;
import org.mapstruct.*;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Analytics Data MapStruct Mapper
 * 
 * Comprehensive mapping between entities and DTOs for analytics data ingestion.
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Mapper(
    componentModel = "spring",
    unmappedTargetPolicy = ReportingPolicy.IGNORE,
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
    nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS,
    uses = {DataQualityMapper.class, StreamingAnalyticsMapper.class}
)
public interface AnalyticsDataMapper {

    /**
     * Map DataIngestionRequestDto to DataIngestionEntity
     */
    @Mapping(target = "ingestionId", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "status", constant = "PENDING")
    @Mapping(target = "processedAt", ignore = true)
    @Mapping(target = "processedBy", ignore = true)
    @Mapping(target = "errorMessage", ignore = true)
    @Mapping(target = "retryCount", constant = "0")
    @Mapping(target = "dataList", source = "dataList", qualifiedByName = "mapDataListToJson")
    @Mapping(target = "metadata", source = "metadata", qualifiedByName = "mapMetadataToJson")
    @Mapping(target = "processingOptions", source = "processingOptions", qualifiedByName = "mapProcessingOptionsToJson")
    DataIngestionEntity toEntity(DataIngestionRequestDto dto);

    /**
     * Map DataIngestionEntity to DataIngestionRequestDto
     */
    @Mapping(source = "dataList", target = "dataList", qualifiedByName = "mapJsonToDataList")
    @Mapping(source = "metadata", target = "metadata", qualifiedByName = "mapJsonToMetadata")
    @Mapping(source = "processingOptions", target = "processingOptions", qualifiedByName = "mapJsonToProcessingOptions")
    DataIngestionRequestDto toDto(DataIngestionEntity entity);

    /**
     * Map list of entities to DTOs
     */
    List<DataIngestionRequestDto> toDtoList(List<DataIngestionEntity> entities);

    /**
     * Map list of DTOs to entities
     */
    List<DataIngestionEntity> toEntityList(List<DataIngestionRequestDto> dtos);

    /**
     * Map DataRetentionPolicyDto to DataRetentionPolicyEntity
     */
    @Mapping(target = "policyId", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "isActive", constant = "true")
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(target = "lastExecuted", ignore = true)
    @Mapping(target = "nextExecution", ignore = true)
    @Mapping(target = "executionCount", constant = "0")
    DataRetentionPolicyEntity toEntity(DataRetentionPolicyDto dto);

    /**
     * Map DataRetentionPolicyEntity to DataRetentionPolicyDto
     */
    DataRetentionPolicyDto toDto(DataRetentionPolicyEntity entity);

    /**
     * Update entity from DTO
     */
    @Mapping(target = "policyId", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "lastExecuted", ignore = true)
    @Mapping(target = "nextExecution", ignore = true)
    @Mapping(target = "executionCount", ignore = true)
    void updateEntityFromDto(DataRetentionPolicyDto dto, @MappingTarget DataRetentionPolicyEntity entity);

    /**
     * Partial update of entity from DTO
     */
    @Mapping(target = "ingestionId", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "batchId", ignore = true)
    @Mapping(target = "correlationId", ignore = true)
    @Mapping(target = "sourceSystem", ignore = true)
    void updateEntityFromDto(DataIngestionRequestDto dto, @MappingTarget DataIngestionEntity entity);

    // Custom mapping methods

    /**
     * Map data list to JSON string
     */
    @Named("mapDataListToJson")
    default String mapDataListToJson(List<Object> dataList) {
        if (dataList == null || dataList.isEmpty()) {
            return null;
        }
        // In real implementation, use Jackson ObjectMapper
        return dataList.toString();
    }

    /**
     * Map JSON string to data list
     */
    @Named("mapJsonToDataList")
    default List<Object> mapJsonToDataList(String json) {
        if (json == null || json.trim().isEmpty()) {
            return null;
        }
        // In real implementation, use Jackson ObjectMapper
        return List.of(); // Simplified
    }

    /**
     * Map metadata to JSON string
     */
    @Named("mapMetadataToJson")
    default String mapMetadataToJson(Object metadata) {
        if (metadata == null) {
            return null;
        }
        // In real implementation, use Jackson ObjectMapper
        return metadata.toString();
    }

    /**
     * Map JSON string to metadata
     */
    @Named("mapJsonToMetadata")
    default Object mapJsonToMetadata(String json) {
        if (json == null || json.trim().isEmpty()) {
            return null;
        }
        // In real implementation, use Jackson ObjectMapper
        return json;
    }

    /**
     * Map processing options to JSON string
     */
    @Named("mapProcessingOptionsToJson")
    default String mapProcessingOptionsToJson(Object processingOptions) {
        if (processingOptions == null) {
            return null;
        }
        // In real implementation, use Jackson ObjectMapper
        return processingOptions.toString();
    }

    /**
     * Map JSON string to processing options
     */
    @Named("mapJsonToProcessingOptions")
    default Object mapJsonToProcessingOptions(String json) {
        if (json == null || json.trim().isEmpty()) {
            return null;
        }
        // In real implementation, use Jackson ObjectMapper
        return json;
    }

    /**
     * Map LocalDateTime to String
     */
    default String mapLocalDateTimeToString(LocalDateTime dateTime) {
        return dateTime != null ? dateTime.toString() : null;
    }

    /**
     * Map String to LocalDateTime
     */
    default LocalDateTime mapStringToLocalDateTime(String dateTimeString) {
        if (dateTimeString == null || dateTimeString.trim().isEmpty()) {
            return null;
        }
        try {
            return LocalDateTime.parse(dateTimeString);
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * Map enum to string safely
     */
    default String mapEnumToString(Enum<?> enumValue) {
        return enumValue != null ? enumValue.name() : null;
    }

    /**
     * After mapping post-processing for DataIngestionEntity
     */
    @AfterMapping
    default void afterMappingToEntity(@MappingTarget DataIngestionEntity entity, DataIngestionRequestDto dto) {
        // Set default values and perform validations
        if (entity.getIngestionTime() == null) {
            entity.setIngestionTime(LocalDateTime.now());
        }
        
        if (entity.getStatus() == null) {
            entity.setStatus("PENDING");
        }
        
        // Calculate priority based on source system
        if (dto.getSourceSystem() != null) {
            entity.setPriority(calculatePriority(dto.getSourceSystem()));
        }
        
        // Set estimated processing time
        if (dto.getDataList() != null) {
            entity.setEstimatedProcessingTime(estimateProcessingTime(dto.getDataList().size()));
        }
    }

    /**
     * After mapping post-processing for DataIngestionRequestDto
     */
    @AfterMapping
    default void afterMappingToDto(@MappingTarget DataIngestionRequestDto dto, DataIngestionEntity entity) {
        // Add computed fields or enrichment
        if (entity.getCreatedAt() != null && entity.getProcessedAt() != null) {
            // Add processing duration to metadata if available
            // dto.getMetadata().put("processingDurationMs", calculateDuration(entity));
        }
    }

    /**
     * Calculate priority based on source system
     */
    default Integer calculatePriority(String sourceSystem) {
        if (sourceSystem == null) {
            return 5; // Default priority
        }
        
        switch (sourceSystem.toUpperCase()) {
            case "EMERGENCY":
            case "CRITICAL_CARE":
                return 1; // Highest priority
            case "PATIENT_MONITORING":
            case "LAB_RESULTS":
                return 2; // High priority
            case "BILLING":
            case "PHARMACY":
                return 3; // Medium priority
            case "SCHEDULING":
            case "REPORTING":
                return 4; // Low priority
            default:
                return 5; // Default priority
        }
    }

    /**
     * Estimate processing time based on data size
     */
    default Integer estimateProcessingTime(int dataSize) {
        // Base time + time per record
        int baseTimeMs = 100;
        int timePerRecordMs = 5;
        return baseTimeMs + (dataSize * timePerRecordMs);
    }
}

/**
 * Data Quality Mapper for specialized quality-related mappings
 */
@Mapper(componentModel = "spring")
interface DataQualityMapper {
    // Add quality-specific mapping methods here
}

/**
 * Streaming Analytics Mapper for real-time data mappings
 */
@Mapper(componentModel = "spring")
interface StreamingAnalyticsMapper {
    // Add streaming-specific mapping methods here
}
