package com.hms.analytics.dto;

import com.hms.analytics.entity.DataSource;
import jakarta.validation.constraints.*;

/**
 * Data Source Creation Request DTO
 */
public class DataSourceCreateRequest {

    @NotBlank(message = "Source name is required")
    @Size(max = 200, message = "Source name cannot exceed 200 characters")
    private String sourceName;

    @NotBlank(message = "Source code is required")
    @Size(max = 50, message = "Source code cannot exceed 50 characters")
    @Pattern(regexp = "^[A-Z0-9_]+$", message = "Source code must contain only uppercase letters, numbers, and underscores")
    private String sourceCode;

    @NotNull(message = "Source type is required")
    private DataSource.SourceType sourceType;

    @NotNull(message = "Data category is required")
    private DataSource.DataCategory category;

    @Size(max = 1000, message = "Description cannot exceed 1000 characters")
    private String description;

    @Size(max = 1000, message = "Connection string cannot exceed 1000 characters")
    private String connectionString;

    @Size(max = 500, message = "API endpoint cannot exceed 500 characters")
    private String apiEndpoint;

    @Size(max = 50, message = "Authentication type cannot exceed 50 characters")
    private String authenticationType;

    @Min(value = 1, message = "Sync frequency must be at least 1 minute")
    @Max(value = 10080, message = "Sync frequency cannot exceed 10080 minutes (1 week)")
    private Integer syncFrequencyMinutes = 60;

    @Min(value = 1, message = "Batch size must be at least 1")
    @Max(value = 100000, message = "Batch size cannot exceed 100000")
    private Integer batchSize = 1000;

    @Size(max = 50, message = "Data format cannot exceed 50 characters")
    private String dataFormat;

    private Boolean schemaValidation = true;

    private Boolean dataEncryption = true;

    private Boolean hipaaCompliant = true;

    // Constructors
    public DataSourceCreateRequest() {}

    public DataSourceCreateRequest(String sourceName, String sourceCode, 
                                 DataSource.SourceType sourceType, DataSource.DataCategory category) {
        this.sourceName = sourceName;
        this.sourceCode = sourceCode;
        this.sourceType = sourceType;
        this.category = category;
    }

    // Getters and Setters
    public String getSourceName() { return sourceName; }
    public void setSourceName(String sourceName) { this.sourceName = sourceName; }

    public String getSourceCode() { return sourceCode; }
    public void setSourceCode(String sourceCode) { this.sourceCode = sourceCode; }

    public DataSource.SourceType getSourceType() { return sourceType; }
    public void setSourceType(DataSource.SourceType sourceType) { this.sourceType = sourceType; }

    public DataSource.DataCategory getCategory() { return category; }
    public void setCategory(DataSource.DataCategory category) { this.category = category; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getConnectionString() { return connectionString; }
    public void setConnectionString(String connectionString) { this.connectionString = connectionString; }

    public String getApiEndpoint() { return apiEndpoint; }
    public void setApiEndpoint(String apiEndpoint) { this.apiEndpoint = apiEndpoint; }

    public String getAuthenticationType() { return authenticationType; }
    public void setAuthenticationType(String authenticationType) { this.authenticationType = authenticationType; }

    public Integer getSyncFrequencyMinutes() { return syncFrequencyMinutes; }
    public void setSyncFrequencyMinutes(Integer syncFrequencyMinutes) { this.syncFrequencyMinutes = syncFrequencyMinutes; }

    public Integer getBatchSize() { return batchSize; }
    public void setBatchSize(Integer batchSize) { this.batchSize = batchSize; }

    public String getDataFormat() { return dataFormat; }
    public void setDataFormat(String dataFormat) { this.dataFormat = dataFormat; }

    public Boolean getSchemaValidation() { return schemaValidation; }
    public void setSchemaValidation(Boolean schemaValidation) { this.schemaValidation = schemaValidation; }

    public Boolean getDataEncryption() { return dataEncryption; }
    public void setDataEncryption(Boolean dataEncryption) { this.dataEncryption = dataEncryption; }

    public Boolean getHipaaCompliant() { return hipaaCompliant; }
    public void setHipaaCompliant(Boolean hipaaCompliant) { this.hipaaCompliant = hipaaCompliant; }
}
