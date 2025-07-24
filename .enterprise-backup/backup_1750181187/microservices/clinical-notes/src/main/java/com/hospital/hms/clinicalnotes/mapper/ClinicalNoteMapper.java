package com.hospital.hms.clinicalnotes.mapper;

import com.hospital.hms.clinicalnotes.dto.ClinicalNoteCreateRequestDto;
import com.hospital.hms.clinicalnotes.dto.ClinicalNoteResponseDto;
import com.hospital.hms.clinicalnotes.entity.ClinicalNote;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import java.util.List;

/**
 * MapStruct mapper for ClinicalNote entity and DTOs
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Mapper(
    componentModel = "spring",
    unmappedTargetPolicy = ReportingPolicy.IGNORE,
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
public interface ClinicalNoteMapper {

    /**
     * Convert ClinicalNote entity to ClinicalNoteResponseDto
     */
    ClinicalNoteResponseDto toResponseDto(ClinicalNote clinicalNote);

    /**
     * Convert ClinicalNoteCreateRequestDto to ClinicalNote entity
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "noteNumber", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "signed", ignore = true)
    @Mapping(target = "signedDate", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "lastModifiedDate", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "lastModifiedBy", ignore = true)
    ClinicalNote toEntity(ClinicalNoteCreateRequestDto createRequestDto);

    /**
     * Update existing ClinicalNote entity from ClinicalNoteCreateRequestDto
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "noteNumber", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "signed", ignore = true)
    @Mapping(target = "signedDate", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "lastModifiedDate", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "lastModifiedBy", ignore = true)
    void updateEntityFromDto(ClinicalNoteCreateRequestDto updateRequestDto, @MappingTarget ClinicalNote clinicalNote);

    /**
     * Convert list of ClinicalNote entities to list of ClinicalNoteResponseDto
     */
    List<ClinicalNoteResponseDto> toResponseDtoList(List<ClinicalNote> clinicalNotes);

    /**
     * Partial mapping for update operations
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "noteNumber", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    void partialUpdate(ClinicalNoteCreateRequestDto updateDto, @MappingTarget ClinicalNote clinicalNote);
}
