package com.hospital.hms.appointmentscheduling.mapper;

import com.hospital.hms.appointmentscheduling.dto.AppointmentCreateRequestDto;
import com.hospital.hms.appointmentscheduling.dto.AppointmentResponseDto;
import com.hospital.hms.appointmentscheduling.entity.Appointment;
import org.mapstruct.*;

import java.util.List;

/**
 * MapStruct mapper for Appointment entities and DTOs
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Mapper(
    componentModel = "spring",
    unmappedTargetPolicy = ReportingPolicy.IGNORE,
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
public interface AppointmentMapper {

    AppointmentResponseDto toResponseDto(Appointment appointment);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "appointmentNumber", ignore = true)
    @Mapping(target = "fhirId", ignore = true)
    @Mapping(target = "endDateTime", ignore = true)
    @Mapping(target = "checkinTime", ignore = true)
    @Mapping(target = "arrivalTime", ignore = true)
    @Mapping(target = "startTime", ignore = true)
    @Mapping(target = "completionTime", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "lastModifiedDate", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "lastModifiedBy", ignore = true)
    Appointment toEntity(AppointmentCreateRequestDto dto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "appointmentNumber", ignore = true)
    @Mapping(target = "fhirId", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "lastModifiedDate", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "lastModifiedBy", ignore = true)
    void updateEntityFromDto(AppointmentCreateRequestDto dto, @MappingTarget Appointment appointment);

    List<AppointmentResponseDto> toResponseDtoList(List<Appointment> appointments);
}
