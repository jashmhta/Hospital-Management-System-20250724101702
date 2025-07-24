package com.hospital.hms.patientportal.mapper;

import com.hospital.hms.patientportal.dto.PatientPortalDto;
import com.hospital.hms.patientportal.entity.*;
import org.mapstruct.*;
import org.springframework.data.domain.Page;

import java.time.LocalDateTime;
import java.util.List;

/**
 * MapStruct Patient Portal Mapper
 * 
 * Comprehensive mapping between patient portal entities and DTOs with
 * security-aware transformations, validation, and HIPAA compliance.
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
public interface PatientPortalMapper {

    /**
     * Map PatientEntity to PatientProfileDto
     */
    @Mapping(target = "patientId", source = "id")
    @Mapping(target = "fullName", expression = "java(entity.getFirstName() + \" \" + entity.getLastName())")
    @Mapping(target = "address", source = ".", qualifiedByName = "mapEntityToAddress")
    @Mapping(target = "isVerified", source = "verified")
    @Mapping(target = "accountStatus", source = "status")
    @Mapping(target = "profilePictureUrl", expression = "java(generateProfilePictureUrl(entity.getId()))")
    PatientPortalDto.PatientProfileDto toProfileDto(PatientEntity entity);

    /**
     * Map PatientRegistrationDto to PatientEntity
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "lastLogin", ignore = true)
    @Mapping(target = "verified", constant = "false")
    @Mapping(target = "status", constant = "PENDING_VERIFICATION")
    @Mapping(target = "passwordHash", ignore = true) // Will be set by service
    @Mapping(target = "salt", ignore = true) // Will be set by service
    PatientEntity toEntity(PatientPortalDto.PatientRegistrationDto dto);

    /**
     * Map AppointmentEntity to AppointmentRequestDto
     */
    @Mapping(target = "providerId", source = "provider.id")
    @Mapping(target = "appointmentDateTime", source = "scheduledDateTime")
    @Mapping(target = "appointmentType", source = "type")
    @Mapping(target = "insurance", source = ".", qualifiedByName = "mapEntityToInsurance")
    @Mapping(target = "symptoms", expression = "java(parseSymptoms(entity.getNotes()))")
    PatientPortalDto.AppointmentRequestDto toAppointmentDto(AppointmentEntity entity);

    /**
     * Map AppointmentRequestDto to AppointmentEntity
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "scheduledDateTime", source = "appointmentDateTime")
    @Mapping(target = "type", source = "appointmentType")
    @Mapping(target = "status", constant = "REQUESTED")
    @Mapping(target = "provider", ignore = true) // Will be set by service
    @Mapping(target = "patient", ignore = true) // Will be set by service
    AppointmentEntity toAppointmentEntity(PatientPortalDto.AppointmentRequestDto dto);

    /**
     * Map PatientDocumentEntity to DocumentDto
     */
    @Mapping(target = "documentId", source = "id")
    @Mapping(target = "downloadUrl", expression = "java(generateDownloadUrl(entity.getId()))")
    @Mapping(target = "uploadedAt", source = "createdAt")
    PatientPortalDto.DocumentDto toDocumentDto(PatientDocumentEntity entity);

    /**
     * Map PatientInsuranceEntity to InsuranceDto
     */
    @Mapping(target = "providerName", source = "insuranceProvider")
    @Mapping(target = "coverageDetails", expression = "java(parseCoverageDetails(entity.getCoverageInfo()))")
    PatientPortalDto.InsuranceDto toInsuranceDto(PatientInsuranceEntity entity);

    /**
     * Map InsuranceDto to PatientInsuranceEntity
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "patient", ignore = true)
    @Mapping(target = "insuranceProvider", source = "providerName")
    @Mapping(target = "coverageInfo", expression = "java(serializeCoverageDetails(dto.getCoverageDetails()))")
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    PatientInsuranceEntity toInsuranceEntity(PatientPortalDto.InsuranceDto dto);

    /**
     * Map list of entities to DTOs
     */
    List<PatientPortalDto.PatientProfileDto> toProfileDtoList(List<PatientEntity> entities);

    /**
     * Map Page content
     */
    default List<PatientPortalDto.PatientProfileDto> mapPageContent(Page<PatientEntity> page) {
        return toProfileDtoList(page.getContent());
    }

    /**
     * Update entity from registration DTO (for updates)
     */
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", expression = "java(java.time.LocalDateTime.now())")
    @Mapping(target = "passwordHash", ignore = true)
    @Mapping(target = "salt", ignore = true)
    @Mapping(target = "verified", ignore = true)
    @Mapping(target = "status", ignore = true)
    void updateEntityFromRegistration(PatientPortalDto.PatientRegistrationDto dto, @MappingTarget PatientEntity entity);

    /**
     * Named mapping for entity to address
     */
    @Named("mapEntityToAddress")
    default PatientPortalDto.AddressDto mapEntityToAddress(PatientEntity entity) {
        return PatientPortalDto.AddressDto.builder()
                .street(entity.getAddress())
                .city(entity.getCity())
                .state(entity.getState())
                .postalCode(entity.getPostalCode())
                .country(entity.getCountry())
                .addressType("HOME")
                .build();
    }

    /**
     * Named mapping for entity to insurance
     */
    @Named("mapEntityToInsurance")
    default PatientPortalDto.InsuranceDto mapEntityToInsurance(AppointmentEntity entity) {
        if (entity.getPatient() == null || entity.getPatient().getInsurance() == null) {
            return null;
        }
        return toInsuranceDto(entity.getPatient().getInsurance());
    }

    /**
     * Generate profile picture URL
     */
    default String generateProfilePictureUrl(Long patientId) {
        if (patientId == null) return null;
        return "/api/patients/" + patientId + "/profile-picture";
    }

    /**
     * Generate download URL for documents
     */
    default String generateDownloadUrl(Long documentId) {
        if (documentId == null) return null;
        return "/api/patients/documents/" + documentId + "/download";
    }

    /**
     * Parse symptoms from notes
     */
    default List<String> parseSymptoms(String notes) {
        if (notes == null || notes.trim().isEmpty()) {
            return List.of();
        }
        
        // Look for symptoms section in notes
        String symptomsSection = extractSection(notes, "Symptoms:", "Notes:");
        if (symptomsSection != null) {
            return List.of(symptomsSection.split("[,;\\n]"))
                    .stream()
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .toList();
        }
        
        return List.of();
    }

    /**
     * Parse coverage details from JSON string
     */
    default java.util.Map<String, Object> parseCoverageDetails(String coverageInfo) {
        if (coverageInfo == null || coverageInfo.trim().isEmpty()) {
            return new java.util.HashMap<>();
        }
        
        try {
            // Simple JSON parsing for coverage details
            java.util.Map<String, Object> details = new java.util.HashMap<>();
            
            // Parse key-value pairs from string format
            String[] pairs = coverageInfo.split(",");
            for (String pair : pairs) {
                String[] keyValue = pair.split(":");
                if (keyValue.length == 2) {
                    details.put(keyValue[0].trim(), keyValue[1].trim());
                }
            }
            
            return details;
        } catch (Exception e) {
            return new java.util.HashMap<>();
        }
    }

    /**
     * Serialize coverage details to JSON string
     */
    default String serializeCoverageDetails(java.util.Map<String, Object> coverageDetails) {
        if (coverageDetails == null || coverageDetails.isEmpty()) {
            return "";
        }
        
        return coverageDetails.entrySet().stream()
                .map(entry -> entry.getKey() + ":" + entry.getValue())
                .collect(java.util.stream.Collectors.joining(","));
    }

    /**
     * Extract section from text
     */
    default String extractSection(String text, String startMarker, String endMarker) {
        int startIndex = text.indexOf(startMarker);
        if (startIndex == -1) return null;
        
        startIndex += startMarker.length();
        int endIndex = text.indexOf(endMarker, startIndex);
        if (endIndex == -1) {
            endIndex = text.length();
        }
        
        return text.substring(startIndex, endIndex).trim();
    }

    /**
     * Mask sensitive information for logging/auditing
     */
    @Named("maskSensitiveData")
    default PatientPortalDto.PatientProfileDto maskSensitiveData(PatientEntity entity) {
        PatientPortalDto.PatientProfileDto dto = toProfileDto(entity);
        
        // Mask sensitive fields
        if (dto.getEmail() != null) {
            dto.setEmail(maskEmail(dto.getEmail()));
        }
        
        if (dto.getPhoneNumber() != null) {
            dto.setPhoneNumber(maskPhoneNumber(dto.getPhoneNumber()));
        }
        
        // Mask address details
        if (dto.getAddress() != null) {
            dto.getAddress().setStreet("***MASKED***");
            dto.getAddress().setPostalCode("***MASKED***");
        }
        
        return dto;
    }

    /**
     * Mask email address
     */
    default String maskEmail(String email) {
        if (email == null || !email.contains("@")) return email;
        
        String[] parts = email.split("@");
        String localPart = parts[0];
        String domain = parts[1];
        
        if (localPart.length() <= 2) {
            return "***@" + domain;
        }
        
        return localPart.substring(0, 2) + "***@" + domain;
    }

    /**
     * Mask phone number
     */
    default String maskPhoneNumber(String phone) {
        if (phone == null || phone.length() < 4) return "***";
        
        return "***-***-" + phone.substring(phone.length() - 4);
    }

    /**
     * After mapping method for security and compliance
     */
    @AfterMapping
    default void afterMappingProfile(@MappingTarget PatientPortalDto.PatientProfileDto dto, PatientEntity entity) {
        // Add computed fields for UI
        if (entity.getDateOfBirth() != null) {
            int age = java.time.Period.between(entity.getDateOfBirth(), java.time.LocalDate.now()).getYears();
            // Store age in metadata if needed (not exposing directly for privacy)
        }
        
        // Set display preferences
        if (entity.getPreferredLanguage() != null) {
            // Could set locale-specific formatting preferences
        }
    }

    /**
     * Audit mapping for compliance tracking
     */
    @Named("auditMapping")
    default void auditDataAccess(PatientEntity entity, String accessType, String userId) {
        // Log data access for HIPAA compliance
        // This would integrate with audit logging service
        String logMessage = String.format(
            "Patient data accessed: PatientID=%d, AccessType=%s, UserID=%s, Timestamp=%s",
            entity.getId(), accessType, userId, LocalDateTime.now()
        );
        
        // In a real implementation, this would call audit service
        System.out.println("AUDIT: " + logMessage);
    }
}
