package com.hospital.hms.procedure.mapper;

import com.hospital.hms.procedure.dto.ProcedureRequestDto;
import com.hospital.hms.procedure.dto.ProcedureResponseDto;
import com.hospital.hms.procedure.entity.ProcedureEntity;
import com.hospital.hms.procedure.entity.ProcedureEventEntity;
import com.hospital.hms.procedure.entity.ProcedureResourceEntity;
import org.mapstruct.*;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Procedure MapStruct Mapper
 * 
 * Comprehensive mapping between entities and DTOs for procedure management.
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Mapper(
    componentModel = "spring",
    unmappedTargetPolicy = ReportingPolicy.IGNORE,
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
    nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS,
    uses = {ProcedureResourceMapper.class, ProcedureEventMapper.class}
)
public interface ProcedureMapper {

    /**
     * Map ProcedureRequestDto to ProcedureEntity
     */
    @Mapping(target = "procedureId", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "status", constant = "SCHEDULED")
    @Mapping(target = "actualStartTime", ignore = true)
    @Mapping(target = "actualEndTime", ignore = true)
    @Mapping(target = "actualDurationMinutes", ignore = true)
    @Mapping(target = "postProcedureNotes", ignore = true)
    @Mapping(target = "complications", ignore = true)
    @Mapping(target = "cancellationReason", ignore = true)
    @Mapping(target = "rescheduledFrom", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(target = "resources", ignore = true)
    @Mapping(target = "events", ignore = true)
    @Mapping(target = "priority", source = "priority", qualifiedByName = "mapStringToPriority")
    @Mapping(target = "assignedStaff", source = "assignedStaff", qualifiedByName = "mapListToJson")
    @Mapping(target = "requiredEquipment", source = "requiredEquipment", qualifiedByName = "mapListToJson")
    ProcedureEntity toEntity(ProcedureRequestDto dto);

    /**
     * Map ProcedureEntity to ProcedureResponseDto
     */
    @Mapping(target = "patientName", ignore = true) // Will be set by service
    @Mapping(target = "primaryPhysicianName", ignore = true) // Will be set by service
    @Mapping(target = "allocatedResources", source = "resources")
    @Mapping(target = "events", source = "events")
    @Mapping(target = "statusDisplayName", ignore = true) // Will be computed
    @Mapping(target = "priorityDisplayName", ignore = true) // Will be computed
    @Mapping(target = "isOverdue", ignore = true) // Will be computed
    @Mapping(target = "canStart", ignore = true) // Will be computed
    @Mapping(target = "canComplete", ignore = true) // Will be computed
    @Mapping(target = "canCancel", ignore = true) // Will be computed
    @Mapping(target = "progressPercentage", ignore = true) // Will be computed
    @Mapping(target = "nextAction", ignore = true) // Will be computed
    @Mapping(target = "hasAlerts", ignore = true) // Will be computed
    @Mapping(target = "alertMessages", ignore = true) // Will be computed
    @Mapping(target = "metadata", ignore = true) // Will be set by service
    @Mapping(target = "priority", source = "priority", qualifiedByName = "mapPriorityToString")
    @Mapping(target = "assignedStaff", source = "assignedStaff", qualifiedByName = "mapJsonToList")
    @Mapping(target = "requiredEquipment", source = "requiredEquipment", qualifiedByName = "mapJsonToList")
    ProcedureResponseDto toDto(ProcedureEntity entity);

    /**
     * Map list of entities to DTOs
     */
    List<ProcedureResponseDto> toDtoList(List<ProcedureEntity> entities);

    /**
     * Map list of DTOs to entities
     */
    List<ProcedureEntity> toEntityList(List<ProcedureRequestDto> dtos);

    /**
     * Update entity from DTO
     */
    @Mapping(target = "procedureId", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "resources", ignore = true)
    @Mapping(target = "events", ignore = true)
    @Mapping(target = "priority", source = "priority", qualifiedByName = "mapStringToPriority")
    @Mapping(target = "assignedStaff", source = "assignedStaff", qualifiedByName = "mapListToJson")
    @Mapping(target = "requiredEquipment", source = "requiredEquipment", qualifiedByName = "mapListToJson")
    void updateEntityFromDto(ProcedureRequestDto dto, @MappingTarget ProcedureEntity entity);

    /**
     * Partial update of entity from DTO
     */
    @Mapping(target = "procedureId", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "resources", ignore = true)
    @Mapping(target = "events", ignore = true)
    void partialUpdateEntityFromDto(ProcedureRequestDto dto, @MappingTarget ProcedureEntity entity);

    // Custom mapping methods

    /**
     * Map priority string to enum
     */
    @Named("mapStringToPriority")
    default ProcedureEntity.ProcedurePriority mapStringToPriority(String priority) {
        if (priority == null) {
            return ProcedureEntity.ProcedurePriority.ROUTINE;
        }
        try {
            return ProcedureEntity.ProcedurePriority.valueOf(priority.toUpperCase());
        } catch (IllegalArgumentException e) {
            return ProcedureEntity.ProcedurePriority.ROUTINE;
        }
    }

    /**
     * Map priority enum to string
     */
    @Named("mapPriorityToString")
    default String mapPriorityToString(ProcedureEntity.ProcedurePriority priority) {
        return priority != null ? priority.name() : "ROUTINE";
    }

    /**
     * Map list to JSON string
     */
    @Named("mapListToJson")
    default String mapListToJson(List<String> list) {
        if (list == null || list.isEmpty()) {
            return null;
        }
        // In real implementation, use Jackson ObjectMapper
        return String.join(",", list);
    }

    /**
     * Map JSON string to list
     */
    @Named("mapJsonToList")
    default List<String> mapJsonToList(String json) {
        if (json == null || json.trim().isEmpty()) {
            return List.of();
        }
        // In real implementation, use Jackson ObjectMapper
        return List.of(json.split(","));
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
     * After mapping post-processing for ProcedureEntity
     */
    @AfterMapping
    default void afterMappingToEntity(@MappingTarget ProcedureEntity entity, ProcedureRequestDto dto) {
        // Set default values and perform validations
        if (entity.getStatus() == null) {
            entity.setStatus("SCHEDULED");
        }
        
        if (entity.getPriority() == null) {
            entity.setPriority(ProcedureEntity.ProcedurePriority.ROUTINE);
        }
        
        // Set urgent flag based on priority
        if (entity.getPriority() == ProcedureEntity.ProcedurePriority.EMERGENCY ||
            entity.getPriority() == ProcedureEntity.ProcedurePriority.URGENT) {
            entity.setUrgent(true);
        }
        
        // Validate consent for certain procedures
        if (requiresConsent(dto.getProcedureType()) && entity.getConsentObtained() != Boolean.TRUE) {
            // Log warning or set flag for consent requirement
        }
    }

    /**
     * After mapping post-processing for ProcedureResponseDto
     */
    @AfterMapping
    default void afterMappingToDto(@MappingTarget ProcedureResponseDto dto, ProcedureEntity entity) {
        // Set computed fields
        dto.setStatusDisplayName(computeStatusDisplayName(entity.getStatus()));
        dto.setPriorityDisplayName(computePriorityDisplayName(entity.getPriority()));
        dto.setIsOverdue(computeIsOverdue(entity));
        dto.setCanStart(computeCanStart(entity));
        dto.setCanComplete(computeCanComplete(entity));
        dto.setCanCancel(computeCanCancel(entity));
        dto.setProgressPercentage(computeProgressPercentage(entity));
        dto.setNextAction(computeNextAction(entity));
        dto.setHasAlerts(computeHasAlerts(entity));
        
        // Set actual duration if procedure is completed
        if (entity.getActualStartTime() != null && entity.getActualEndTime() != null) {
            long duration = java.time.Duration.between(entity.getActualStartTime(), entity.getActualEndTime()).toMinutes();
            dto.setActualDurationMinutes((int) duration);
        }
    }

    /**
     * Helper methods for computed fields
     */
    default String computeStatusDisplayName(String status) {
        return switch (status != null ? status : "UNKNOWN") {
            case "SCHEDULED" -> "Scheduled";
            case "CONFIRMED" -> "Confirmed";
            case "IN_PROGRESS" -> "In Progress";
            case "COMPLETED" -> "Completed";
            case "CANCELLED" -> "Cancelled";
            case "POSTPONED" -> "Postponed";
            case "NO_SHOW" -> "No Show";
            case "WAITING" -> "Waiting";
            case "PREP" -> "Preparation";
            case "RECOVERY" -> "Recovery";
            default -> "Unknown";
        };
    }

    default String computePriorityDisplayName(ProcedureEntity.ProcedurePriority priority) {
        if (priority == null) return "Routine";
        return switch (priority) {
            case EMERGENCY -> "Emergency";
            case URGENT -> "Urgent";
            case SEMI_URGENT -> "Semi-Urgent";
            case ROUTINE -> "Routine";
        };
    }

    default Boolean computeIsOverdue(ProcedureEntity entity) {
        if (entity.getScheduledDateTime() == null) return false;
        if ("COMPLETED".equals(entity.getStatus()) || "CANCELLED".equals(entity.getStatus())) return false;
        return entity.getScheduledDateTime().isBefore(LocalDateTime.now());
    }

    default Boolean computeCanStart(ProcedureEntity entity) {
        return "CONFIRMED".equals(entity.getStatus()) || "SCHEDULED".equals(entity.getStatus());
    }

    default Boolean computeCanComplete(ProcedureEntity entity) {
        return "IN_PROGRESS".equals(entity.getStatus());
    }

    default Boolean computeCanCancel(ProcedureEntity entity) {
        return !"COMPLETED".equals(entity.getStatus()) && !"CANCELLED".equals(entity.getStatus());
    }

    default Integer computeProgressPercentage(ProcedureEntity entity) {
        return switch (entity.getStatus() != null ? entity.getStatus() : "SCHEDULED") {
            case "SCHEDULED" -> 0;
            case "CONFIRMED" -> 10;
            case "PREP" -> 25;
            case "IN_PROGRESS" -> 50;
            case "RECOVERY" -> 75;
            case "COMPLETED" -> 100;
            case "CANCELLED" -> 0;
            default -> 0;
        };
    }

    default String computeNextAction(ProcedureEntity entity) {
        return switch (entity.getStatus() != null ? entity.getStatus() : "SCHEDULED") {
            case "SCHEDULED" -> "Confirm procedure";
            case "CONFIRMED" -> "Start procedure";
            case "IN_PROGRESS" -> "Complete procedure";
            case "COMPLETED" -> "Follow-up if needed";
            case "CANCELLED" -> "No action required";
            default -> "Review status";
        };
    }

    default Boolean computeHasAlerts(ProcedureEntity entity) {
        if (entity.getUrgent() != null && entity.getUrgent()) return true;
        if (computeIsOverdue(entity)) return true;
        if (entity.getConsentObtained() != Boolean.TRUE && requiresConsent(entity.getProcedureType())) return true;
        return false;
    }

    default boolean requiresConsent(String procedureType) {
        if (procedureType == null) return true;
        String type = procedureType.toUpperCase();
        return type.contains("SURGERY") || type.contains("INVASIVE") || 
               type.contains("BIOPSY") || type.contains("INTERVENTION");
    }
}

/**
 * Procedure Resource Mapper for specialized resource-related mappings
 */
@Mapper(componentModel = "spring")
interface ProcedureResourceMapper {
    
    ProcedureResponseDto.ProcedureResourceDto toDto(ProcedureResourceEntity entity);
    
    List<ProcedureResponseDto.ProcedureResourceDto> toDtoList(List<ProcedureResourceEntity> entities);
}

/**
 * Procedure Event Mapper for specialized event-related mappings
 */
@Mapper(componentModel = "spring")
interface ProcedureEventMapper {
    
    ProcedureResponseDto.ProcedureEventDto toDto(ProcedureEventEntity entity);
    
    List<ProcedureResponseDto.ProcedureEventDto> toDtoList(List<ProcedureEventEntity> entities);
}
