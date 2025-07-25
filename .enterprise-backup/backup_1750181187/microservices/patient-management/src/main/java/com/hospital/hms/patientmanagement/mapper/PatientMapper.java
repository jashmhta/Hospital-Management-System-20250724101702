package com.hospital.hms.patientmanagement.mapper;

import com.hospital.hms.patientmanagement.dto.*;
import com.hospital.hms.patientmanagement.entity.Patient;
import com.hospital.hms.patientmanagement.entity.PatientAddress;
import com.hospital.hms.patientmanagement.entity.PatientInsurance;
import org.mapstruct.*;

import java.time.LocalDate;
import java.time.Period;
import java.util.List;

/**
 * MapStruct mapper for Patient entities and DTOs
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Mapper(
    componentModel = "spring",
    unmappedTargetPolicy = ReportingPolicy.IGNORE,
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
public interface PatientMapper {

    /**
     * Convert Patient entity to PatientResponseDto
     */
    @Mapping(target = "fullName", expression = "java(buildFullName(patient))")
    @Mapping(target = "age", expression = "java(calculateAge(patient.getDateOfBirth()))")
    PatientResponseDto toResponseDto(Patient patient);

    /**
     * Convert PatientCreateRequestDto to Patient entity
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "medicalRecordNumber", ignore = true) // Will be generated by service
    @Mapping(target = "active", constant = "true")
    @Mapping(target = "fhirId", ignore = true)
    @Mapping(target = "fhirVersionId", ignore = true)
    @Mapping(target = "fhirLastUpdated", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "lastModifiedDate", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "lastModifiedBy", ignore = true)
    Patient toEntity(PatientCreateRequestDto dto);

    /**
     * Update Patient entity from PatientUpdateRequestDto
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "medicalRecordNumber", ignore = true)
    @Mapping(target = "fhirId", ignore = true)
    @Mapping(target = "fhirVersionId", ignore = true)
    @Mapping(target = "fhirLastUpdated", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "lastModifiedDate", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "lastModifiedBy", ignore = true)
    void updateEntityFromDto(PatientUpdateRequestDto dto, @MappingTarget Patient patient);

    /**
     * Convert list of Patient entities to list of PatientResponseDto
     */
    List<PatientResponseDto> toResponseDtoList(List<Patient> patients);

    /**
     * Convert PatientAddress entity to PatientAddressDto
     */
    @Mapping(target = "id", source = "id")
    PatientAddressDto toAddressDto(PatientAddress address);

    /**
     * Convert PatientAddressDto to PatientAddress entity
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "patient", ignore = true)
    PatientAddress toAddressEntity(PatientAddressDto dto);

    /**
     * Convert list of PatientAddress entities to list of PatientAddressDto
     */
    List<PatientAddressDto> toAddressDtoList(List<PatientAddress> addresses);

    /**
     * Convert list of PatientAddressDto to list of PatientAddress entities
     */
    List<PatientAddress> toAddressEntityList(List<PatientAddressDto> dtos);

    /**
     * Convert PatientInsurance entity to PatientInsuranceDto
     */
    @Mapping(target = "id", source = "id")
    PatientInsuranceDto toInsuranceDto(PatientInsurance insurance);

    /**
     * Convert PatientInsuranceDto to PatientInsurance entity
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "patient", ignore = true)
    PatientInsurance toInsuranceEntity(PatientInsuranceDto dto);

    /**
     * Convert list of PatientInsurance entities to list of PatientInsuranceDto
     */
    List<PatientInsuranceDto> toInsuranceDtoList(List<PatientInsurance> insurances);

    /**
     * Convert list of PatientInsuranceDto to list of PatientInsurance entities
     */
    List<PatientInsurance> toInsuranceEntityList(List<PatientInsuranceDto> dtos);

    /**
     * Build full name from patient name components
     */
    default String buildFullName(Patient patient) {
        if (patient == null) {
            return null;
        }

        StringBuilder fullName = new StringBuilder();
        
        if (patient.getPrefix() != null && !patient.getPrefix().trim().isEmpty()) {
            fullName.append(patient.getPrefix().trim()).append(" ");
        }
        
        if (patient.getGivenName() != null && !patient.getGivenName().trim().isEmpty()) {
            fullName.append(patient.getGivenName().trim()).append(" ");
        }
        
        if (patient.getMiddleName() != null && !patient.getMiddleName().trim().isEmpty()) {
            fullName.append(patient.getMiddleName().trim()).append(" ");
        }
        
        if (patient.getFamilyName() != null && !patient.getFamilyName().trim().isEmpty()) {
            fullName.append(patient.getFamilyName().trim());
        }
        
        if (patient.getSuffix() != null && !patient.getSuffix().trim().isEmpty()) {
            fullName.append(" ").append(patient.getSuffix().trim());
        }
        
        return fullName.toString().trim();
    }

    /**
     * Calculate age from date of birth
     */
    default Integer calculateAge(LocalDate dateOfBirth) {
        if (dateOfBirth == null) {
            return null;
        }
        return Period.between(dateOfBirth, LocalDate.now()).getYears();
    }

    /**
     * After mapping methods to handle relationships
     */
    @AfterMapping
    default void linkAddresses(@MappingTarget Patient patient) {
        if (patient.getAddresses() != null) {
            patient.getAddresses().forEach(address -> address.setPatient(patient));
        }
    }

    @AfterMapping
    default void linkInsurances(@MappingTarget Patient patient) {
        if (patient.getInsurances() != null) {
            patient.getInsurances().forEach(insurance -> insurance.setPatient(patient));
        }
    }

    /**
     * Create summary DTO for list views
     */
    @Mapping(target = "fullName", expression = "java(buildFullName(patient))")
    @Mapping(target = "age", expression = "java(calculateAge(patient.getDateOfBirth()))")
    @Mapping(target = "addresses", ignore = true)
    @Mapping(target = "insurances", ignore = true)
    @Mapping(target = "allergies", ignore = true)
    @Mapping(target = "medicalHistory", ignore = true)
    @Mapping(target = "currentMedications", ignore = true)
    PatientResponseDto toSummaryDto(Patient patient);

    /**
     * Convert list of Patient entities to summary DTOs
     */
    List<PatientResponseDto> toSummaryDtoList(List<Patient> patients);
}
