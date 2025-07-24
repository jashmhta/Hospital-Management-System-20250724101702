package com.hospital.hms.configserver.mapper;

import com.hospital.hms.configserver.dto.ConfigurationDto;
import com.hospital.hms.configserver.dto.ConfigurationHistoryDto;
import com.hospital.hms.configserver.dto.ConfigurationValidationDto;
import com.hospital.hms.configserver.entity.ConfigurationEntity;
import com.hospital.hms.configserver.entity.ConfigurationHistoryEntity;
import org.mapstruct.*;
import org.springframework.data.domain.Page;

import java.time.LocalDateTime;
import java.util.List;

/**
 * MapStruct Configuration Mapper
 * 
 * Advanced mapping between configuration entities and DTOs with
 * custom transformations, validation support, and audit tracking.
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Mapper(
    componentModel = "spring",
    nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS,
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
    injectionStrategy = InjectionStrategy.CONSTRUCTOR,
    unmappedTargetPolicy = ReportingPolicy.WARN
)
public interface ConfigurationMapper {

    /**
     * Map ConfigurationEntity to ConfigurationDto
     */
    @Mapping(target = "hasHistory", expression = "java(entity.getHistoryCount() > 0)")
    @Mapping(target = "isEncrypted", expression = "java(isValueEncrypted(entity.getConfigValue()))")
    @Mapping(target = "lastUpdatedBy", source = "updatedBy")
    @Mapping(target = "lastUpdatedAt", source = "updatedAt")
    ConfigurationDto toDto(ConfigurationEntity entity);

    /**
     * Map ConfigurationDto to ConfigurationEntity
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "version", ignore = true)
    @Mapping(target = "historyCount", ignore = true)
    @Mapping(target = "lastAccessed", ignore = true)
    @Mapping(target = "accessCount", ignore = true)
    ConfigurationEntity toEntity(ConfigurationDto dto);

    /**
     * Map list of entities to DTOs
     */
    List<ConfigurationDto> toDtoList(List<ConfigurationEntity> entities);

    /**
     * Map Page of entities to DTOs
     */
    @Named("mapPageContent")
    default List<ConfigurationDto> mapPageContent(Page<ConfigurationEntity> page) {
        return toDtoList(page.getContent());
    }

    /**
     * Map ConfigurationHistoryEntity to ConfigurationHistoryDto
     */
    @Mapping(target = "configurationId", source = "configuration.id")
    @Mapping(target = "configurationKey", source = "configuration.configKey")
    @Mapping(target = "changeType", source = "operation")
    @Mapping(target = "changedBy", source = "changedBy")
    @Mapping(target = "changedAt", source = "changeTimestamp")
    @Mapping(target = "previousValue", source = "oldValue")
    @Mapping(target = "newValue", source = "newValue")
    ConfigurationHistoryDto toHistoryDto(ConfigurationHistoryEntity entity);

    /**
     * Map list of history entities to DTOs
     */
    List<ConfigurationHistoryDto> toHistoryDtoList(List<ConfigurationHistoryEntity> entities);

    /**
     * Map ConfigurationEntity to ConfigurationValidationDto
     */
    @Mapping(target = "validationRules", expression = "java(parseValidationRules(entity.getValidationRules()))")
    @Mapping(target = "isValid", expression = "java(validateConfiguration(entity))")
    @Mapping(target = "validationErrors", expression = "java(getValidationErrors(entity))")
    @Mapping(target = "lastValidated", source = "updatedAt")
    ConfigurationValidationDto toValidationDto(ConfigurationEntity entity);

    /**
     * Update entity from DTO (for PATCH operations)
     */
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", expression = "java(java.time.LocalDateTime.now())")
    @Mapping(target = "version", ignore = true)
    @Mapping(target = "historyCount", ignore = true)
    @Mapping(target = "lastAccessed", ignore = true)
    @Mapping(target = "accessCount", ignore = true)
    void updateEntityFromDto(ConfigurationDto dto, @MappingTarget ConfigurationEntity entity);

    /**
     * Map for configuration search/filter operations
     */
    @Mapping(target = "searchScore", expression = "java(calculateSearchScore(entity, searchTerm))")
    @Mapping(target = "highlighted", expression = "java(highlightSearchTerms(entity, searchTerm))")
    ConfigurationDto toDtoWithSearch(ConfigurationEntity entity, @Context String searchTerm);

    /**
     * Custom method to check if value is encrypted
     */
    default boolean isValueEncrypted(String value) {
        return value != null && (value.startsWith("{cipher}") || value.contains("ENC("));
    }

    /**
     * Custom method to parse validation rules
     */
    default List<String> parseValidationRules(String validationRules) {
        if (validationRules == null || validationRules.trim().isEmpty()) {
            return List.of();
        }
        return List.of(validationRules.split(","));
    }

    /**
     * Custom method to validate configuration
     */
    default boolean validateConfiguration(ConfigurationEntity entity) {
        if (entity.getConfigValue() == null || entity.getConfigValue().trim().isEmpty()) {
            return false;
        }
        
        // Validate based on data type
        String dataType = entity.getDataType();
        String value = entity.getConfigValue();
        
        try {
            switch (dataType.toUpperCase()) {
                case "INTEGER":
                    Integer.parseInt(value);
                    break;
                case "LONG":
                    Long.parseLong(value);
                    break;
                case "DOUBLE":
                case "FLOAT":
                    Double.parseDouble(value);
                    break;
                case "BOOLEAN":
                    if (!"true".equalsIgnoreCase(value) && !"false".equalsIgnoreCase(value)) {
                        return false;
                    }
                    break;
                case "JSON":
                    // Basic JSON validation - starts with { or [
                    return value.trim().startsWith("{") || value.trim().startsWith("[");
                case "URL":
                    return value.matches("^https?://.*");
                case "EMAIL":
                    return value.matches("^[A-Za-z0-9+_.-]+@([A-Za-z0-9.-]+\\.[A-Za-z]{2,})$");
                default:
                    // For STRING and other types, just check not empty
                    return !value.trim().isEmpty();
            }
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Custom method to get validation errors
     */
    default List<String> getValidationErrors(ConfigurationEntity entity) {
        List<String> errors = new java.util.ArrayList<>();
        
        if (entity.getConfigKey() == null || entity.getConfigKey().trim().isEmpty()) {
            errors.add("Configuration key is required");
        }
        
        if (entity.getConfigValue() == null || entity.getConfigValue().trim().isEmpty()) {
            errors.add("Configuration value is required");
        }
        
        if (entity.getServiceName() == null || entity.getServiceName().trim().isEmpty()) {
            errors.add("Service name is required");
        }
        
        if (!validateConfiguration(entity)) {
            errors.add("Value does not match expected data type: " + entity.getDataType());
        }
        
        // Check environment-specific validation
        if (entity.getEnvironment() != null && entity.getEnvironment().equals("production")) {
            if (entity.isSensitive() && !isValueEncrypted(entity.getConfigValue())) {
                errors.add("Sensitive values must be encrypted in production environment");
            }
        }
        
        return errors;
    }

    /**
     * Custom method to calculate search score
     */
    default double calculateSearchScore(ConfigurationEntity entity, String searchTerm) {
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            return 1.0;
        }
        
        String lowerSearchTerm = searchTerm.toLowerCase();
        double score = 0.0;
        
        // Exact key match gets highest score
        if (entity.getConfigKey().toLowerCase().equals(lowerSearchTerm)) {
            score += 10.0;
        }
        // Key contains search term
        else if (entity.getConfigKey().toLowerCase().contains(lowerSearchTerm)) {
            score += 5.0;
        }
        
        // Service name match
        if (entity.getServiceName() != null && entity.getServiceName().toLowerCase().contains(lowerSearchTerm)) {
            score += 3.0;
        }
        
        // Description match
        if (entity.getDescription() != null && entity.getDescription().toLowerCase().contains(lowerSearchTerm)) {
            score += 2.0;
        }
        
        // Value match (lower priority for security)
        if (entity.getConfigValue() != null && !entity.isSensitive() && 
            entity.getConfigValue().toLowerCase().contains(lowerSearchTerm)) {
            score += 1.0;
        }
        
        return score;
    }

    /**
     * Custom method to highlight search terms
     */
    default String highlightSearchTerms(ConfigurationEntity entity, String searchTerm) {
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            return entity.getConfigKey();
        }
        
        return entity.getConfigKey().replaceAll(
            "(?i)" + java.util.regex.Pattern.quote(searchTerm),
            "<mark>$0</mark>"
        );
    }

    /**
     * After mapping method to set computed fields
     */
    @AfterMapping
    default void afterMapping(@MappingTarget ConfigurationDto dto, ConfigurationEntity entity) {
        // Set computed fields
        dto.setFullKey(entity.getServiceName() + "." + entity.getConfigKey());
        
        // Set security level
        if (entity.isSensitive()) {
            dto.setSecurityLevel("HIGH");
        } else if (entity.getEnvironment() != null && entity.getEnvironment().equals("production")) {
            dto.setSecurityLevel("MEDIUM");
        } else {
            dto.setSecurityLevel("LOW");
        }
        
        // Set change frequency
        if (entity.getHistoryCount() != null) {
            if (entity.getHistoryCount() > 10) {
                dto.setChangeFrequency("HIGH");
            } else if (entity.getHistoryCount() > 3) {
                dto.setChangeFrequency("MEDIUM");
            } else {
                dto.setChangeFrequency("LOW");
            }
        }
    }
}
