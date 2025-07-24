package com.hospital.hms.servicediscovery.mapper;

import com.hospital.hms.servicediscovery.dto.ServiceInstanceDto;
import com.hospital.hms.servicediscovery.dto.ServiceRegistryStatsDto;
import com.hospital.hms.servicediscovery.entity.ServiceEventEntity;
import com.hospital.hms.servicediscovery.entity.ServiceMetadataEntity;
import com.hospital.hms.servicediscovery.entity.ServiceRegistryEntity;
import org.mapstruct.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Service Registry MapStruct Mapper
 * 
 * Comprehensive mapper for converting between entities and DTOs.
 * Uses MapStruct for efficient and type-safe mapping.
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Mapper(
    componentModel = "spring",
    unmappedTargetPolicy = ReportingPolicy.IGNORE,
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
    imports = {LocalDateTime.class}
)
public interface ServiceRegistryMapper {

    /**
     * Map entity to DTO
     */
    @Mapping(target = "registrationTime", source = "createdAt")
    @Mapping(target = "lastStatusUpdate", source = "updatedAt")
    @Mapping(target = "healthy", expression = "java(entity.getStatus() == ServiceRegistryEntity.ServiceStatus.UP)")
    @Mapping(target = "healthStatus", expression = "java(determineHealthStatus(entity))")
    @Mapping(target = "metadata", expression = "java(mapMetadataToMap(entity.getMetadata()))")
    @Mapping(target = "leaseInfo", expression = "java(mapToLeaseInfo(entity))")
    ServiceInstanceDto entityToDto(ServiceRegistryEntity entity);

    /**
     * Map DTO to entity
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "metadata", ignore = true)
    @Mapping(target = "events", ignore = true)
    @Mapping(target = "status", expression = "java(mapStatus(dto.getStatus()))")
    ServiceRegistryEntity dtoToEntity(ServiceInstanceDto dto);

    /**
     * Map list of entities to DTOs
     */
    List<ServiceInstanceDto> entitiesToDtos(List<ServiceRegistryEntity> entities);

    /**
     * Map list of DTOs to entities
     */
    List<ServiceRegistryEntity> dtosToEntities(List<ServiceInstanceDto> dtos);

    /**
     * Update entity from DTO
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", expression = "java(LocalDateTime.now())")
    @Mapping(target = "metadata", ignore = true)
    @Mapping(target = "events", ignore = true)
    void updateEntityFromDto(@MappingTarget ServiceRegistryEntity entity, ServiceInstanceDto dto);

    /**
     * Map metadata entities to map
     */
    default Map<String, String> mapMetadataToMap(List<ServiceMetadataEntity> metadata) {
        if (metadata == null) {
            return null;
        }
        return metadata.stream()
                .collect(Collectors.toMap(
                    ServiceMetadataEntity::getMetadataKey,
                    ServiceMetadataEntity::getMetadataValue,
                    (existing, replacement) -> existing
                ));
    }

    /**
     * Map entity to lease info DTO
     */
    default ServiceInstanceDto.LeaseInfoDto mapToLeaseInfo(ServiceRegistryEntity entity) {
        if (entity == null) {
            return null;
        }

        return ServiceInstanceDto.LeaseInfoDto.builder()
                .renewalIntervalInSecs(entity.getLeaseRenewalInterval())
                .durationInSecs(entity.getLeaseDuration())
                .registrationTimestamp(entity.getCreatedAt())
                .lastRenewalTimestamp(entity.getLastHeartbeat())
                .serviceUpTimestamp(entity.getCreatedAt())
                .build();
    }

    /**
     * Map status string to enum
     */
    default ServiceRegistryEntity.ServiceStatus mapStatus(String status) {
        if (status == null) {
            return ServiceRegistryEntity.ServiceStatus.UNKNOWN;
        }
        try {
            return ServiceRegistryEntity.ServiceStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            return ServiceRegistryEntity.ServiceStatus.UNKNOWN;
        }
    }

    /**
     * Determine health status
     */
    default String determineHealthStatus(ServiceRegistryEntity entity) {
        if (entity == null || entity.getStatus() == null) {
            return "UNKNOWN";
        }

        switch (entity.getStatus()) {
            case UP:
                return "HEALTHY";
            case DOWN:
                return "UNHEALTHY";
            case STARTING:
                return "STARTING";
            case OUT_OF_SERVICE:
                return "OUT_OF_SERVICE";
            default:
                return "UNKNOWN";
        }
    }

    /**
     * Map service registry statistics
     */
    @Mapping(target = "registryStartTime", expression = "java(LocalDateTime.now().minusSeconds(uptimeSeconds))")
    @Mapping(target = "lastUpdated", expression = "java(LocalDateTime.now())")
    ServiceRegistryStatsDto mapToStatsDto(
            int totalServices,
            int totalInstances,
            int healthyInstances,
            int unhealthyInstances,
            long uptimeSeconds);

    /**
     * Map event entity to map
     */
    @Mapping(target = "eventType", source = "eventType")
    @Mapping(target = "timestamp", source = "eventTimestamp")
    @Mapping(target = "serviceName", source = "serviceRegistry.serviceName")
    Map<String, Object> eventEntityToMap(ServiceEventEntity event);

    /**
     * Map list of events to maps
     */
    List<Map<String, Object>> eventEntitiesToMaps(List<ServiceEventEntity> events);

    /**
     * Partial update entity
     */
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", expression = "java(LocalDateTime.now())")
    void partialUpdateEntity(@MappingTarget ServiceRegistryEntity entity, ServiceInstanceDto dto);
}
