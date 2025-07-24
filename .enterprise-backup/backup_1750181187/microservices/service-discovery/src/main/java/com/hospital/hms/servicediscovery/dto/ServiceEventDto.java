package com.hospital.hms.servicediscovery.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import java.time.LocalDateTime;

/**
 * Service Event Data Transfer Object
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ServiceEventDto {

    private String eventId;

    @NotBlank(message = "Service ID is required")
    private String serviceId;

    @NotBlank(message = "Event type is required")
    private String eventType;

    private String eventDescription;

    private String eventData;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime eventTime;

    private String severity;

    private String source;
}
