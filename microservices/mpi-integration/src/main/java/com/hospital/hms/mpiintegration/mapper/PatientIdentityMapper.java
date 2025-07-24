package com.hospital.hms.mpiintegration.mapper;

import com.hospital.hms.mpiintegration.dto.PatientIdentityCreateRequestDto;
import com.hospital.hms.mpiintegration.dto.PatientIdentityResponseDto;
import com.hospital.hms.mpiintegration.entity.PatientIdentity;
import com.hospital.hms.mpiintegration.entity.IdentityMatch;
import com.hospital.hms.mpiintegration.entity.IdentityAlias;
import org.mapstruct.*;

import java.util.List;

/**
 * MapStruct mapper for PatientIdentity entity and DTOs
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Mapper(componentModel = "spring", 
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface PatientIdentityMapper {

    /**
     * Convert PatientIdentityCreateRequestDto to PatientIdentity entity
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "mpiId", ignore = true)
    @Mapping(target = "identityStatus", constant = "ACTIVE")
    @Mapping(target = "verificationStatus", constant = "UNVERIFIED")
    @Mapping(target = "isMasterIdentity", constant = "false")
    @Mapping(target = "accessCount", constant = "0L")
    @Mapping(target = "identityMatches", ignore = true)
    @Mapping(target = "identityAliases", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "lastModifiedDate", ignore = true)
    @Mapping(target = "verificationDate", ignore = true)
    @Mapping(target = "fhirLastUpdated", ignore = true)
    @Mapping(target = "lastAccessedDate", ignore = true)
    PatientIdentity toEntity(PatientIdentityCreateRequestDto requestDto);

    /**
     * Convert PatientIdentity entity to PatientIdentityResponseDto
     */
    @Mapping(target = "identityMatches", source = "identityMatches", qualifiedByName = "mapIdentityMatches")
    @Mapping(target = "identityAliases", source = "identityAliases", qualifiedByName = "mapIdentityAliases")
    PatientIdentityResponseDto toResponseDto(PatientIdentity entity);

    /**
     * Convert list of PatientIdentity entities to list of response DTOs
     */
    List<PatientIdentityResponseDto> toResponseDtoList(List<PatientIdentity> entities);

    /**
     * Update PatientIdentity entity from PatientIdentityCreateRequestDto
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "mpiId", ignore = true)
    @Mapping(target = "identityStatus", ignore = true)
    @Mapping(target = "verificationStatus", ignore = true)
    @Mapping(target = "verificationDate", ignore = true)
    @Mapping(target = "verifiedBy", ignore = true)
    @Mapping(target = "masterPatientId", ignore = true)
    @Mapping(target = "isMasterIdentity", ignore = true)
    @Mapping(target = "confidenceScore", ignore = true)
    @Mapping(target = "dataQualityScore", ignore = true)
    @Mapping(target = "completenessScore", ignore = true)
    @Mapping(target = "accuracyValidated", ignore = true)
    @Mapping(target = "identityMatches", ignore = true)
    @Mapping(target = "identityAliases", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "lastModifiedDate", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "lastModifiedBy", ignore = true)
    @Mapping(target = "lastAccessedDate", ignore = true)
    @Mapping(target = "accessCount", ignore = true)
    @Mapping(target = "fhirLastUpdated", ignore = true)
    void updateEntityFromDto(PatientIdentityCreateRequestDto requestDto, @MappingTarget PatientIdentity entity);

    /**
     * Map IdentityMatch entities to summary DTOs
     */
    @Named("mapIdentityMatches")
    default List<PatientIdentityResponseDto.IdentityMatchSummaryDto> mapIdentityMatches(List<IdentityMatch> matches) {
        if (matches == null) {
            return null;
        }
        return matches.stream()
                .map(this::mapIdentityMatch)
                .toList();
    }

    /**
     * Map single IdentityMatch to summary DTO
     */
    @Mapping(target = "matchStatus", expression = "java(match.getMatchStatus().name())")
    @Mapping(target = "matchType", expression = "java(match.getMatchType() != null ? match.getMatchType().name() : null)")
    PatientIdentityResponseDto.IdentityMatchSummaryDto mapIdentityMatch(IdentityMatch match);

    /**
     * Map IdentityAlias entities to summary DTOs
     */
    @Named("mapIdentityAliases")
    default List<PatientIdentityResponseDto.IdentityAliasSummaryDto> mapIdentityAliases(List<IdentityAlias> aliases) {
        if (aliases == null) {
            return null;
        }
        return aliases.stream()
                .map(this::mapIdentityAlias)
                .toList();
    }

    /**
     * Map single IdentityAlias to summary DTO
     */
    @Mapping(target = "aliasType", expression = "java(alias.getAliasType().name())")
    PatientIdentityResponseDto.IdentityAliasSummaryDto mapIdentityAlias(IdentityAlias alias);

    /**
     * Create a minimal PatientIdentity for matching purposes
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "mpiId", ignore = true)
    @Mapping(target = "sourceSystem", constant = "SEARCH")
    @Mapping(target = "identityStatus", constant = "ACTIVE")
    @Mapping(target = "verificationStatus", constant = "UNVERIFIED")
    @Mapping(target = "isMasterIdentity", constant = "false")
    @Mapping(target = "accessCount", constant = "0L")
    @Mapping(target = "identityMatches", ignore = true)
    @Mapping(target = "identityAliases", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "lastModifiedDate", ignore = true)
    @Mapping(target = "verificationDate", ignore = true)
    @Mapping(target = "fhirLastUpdated", ignore = true)
    @Mapping(target = "lastAccessedDate", ignore = true)
    @Mapping(target = "masterPatientId", ignore = true)
    @Mapping(target = "confidenceScore", ignore = true)
    @Mapping(target = "dataQualityScore", ignore = true)
    @Mapping(target = "completenessScore", ignore = true)
    @Mapping(target = "accuracyValidated", ignore = true)
    @Mapping(target = "verifiedBy", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "lastModifiedBy", ignore = true)
    @Mapping(target = "fhirPatientId", ignore = true)
    @Mapping(target = "fhirResourceVersion", ignore = true)
    @Mapping(target = "sourceSystemVersion", ignore = true)
    @Mapping(target = "externalPatientId", ignore = true)
    PatientIdentity createSearchEntity(String firstName, String lastName, java.time.LocalDate dateOfBirth, String ssn);

    /**
     * After mapping operations for setting computed fields
     */
    @AfterMapping
    default void setComputedFields(@MappingTarget PatientIdentity entity, PatientIdentityCreateRequestDto requestDto) {
        // Set default values
        if (entity.getCountry() == null) {
            entity.setCountry("USA");
        }
        
        // Auto-generate full alias name if needed
        if (entity.getPreferredName() != null && !entity.getPreferredName().isEmpty()) {
            // Could add logic to create an alias for preferred name
        }
    }

    /**
     * After mapping operations for response DTOs
     */
    @AfterMapping
    default void setResponseComputedFields(@MappingTarget PatientIdentityResponseDto responseDto, PatientIdentity entity) {
        // Mask sensitive information if needed (e.g., partial SSN)
        if (responseDto.getSsn() != null && responseDto.getSsn().length() >= 4) {
            String maskedSsn = "***-**-" + responseDto.getSsn().substring(responseDto.getSsn().length() - 4);
            responseDto.setSsn(maskedSsn);
        }
    }
}
