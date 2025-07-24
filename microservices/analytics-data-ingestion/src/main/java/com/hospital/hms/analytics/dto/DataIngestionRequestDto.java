package com.hospital.hms.analytics.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * Data Ingestion Request DTO
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DataIngestionRequestDto {

    @NotEmpty(message = "Data list cannot be empty")
    @Size(max = 1000, message = "Batch size cannot exceed 1000 records")
    private List<Map<String, Object>> dataList;

    private String batchId;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime ingestionTime;

    private Map<String, Object> metadata;

    @Builder.Default
    private Boolean validateData = true;

    @Builder.Default
    private Boolean transformData = true;

    private String correlationId;

    private String sourceSystem;

    private Map<String, Object> processingOptions;
}
