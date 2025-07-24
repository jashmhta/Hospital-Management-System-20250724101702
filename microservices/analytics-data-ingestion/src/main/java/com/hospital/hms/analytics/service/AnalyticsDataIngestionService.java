package com.hospital.hms.analytics.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

/**
 * Analytics Data Ingestion Service Interface
 * 
 * Complete ETL service with real-time data streaming, transformation,
 * and analytics pipeline for comprehensive hospital data processing.
 * 
 * Features:
 * - Real-time data streaming and ingestion
 * - ETL pipeline management and orchestration
 * - Data transformation and normalization
 * - Data quality monitoring and validation
 * - Stream processing and event handling
 * - Batch processing and scheduled jobs
 * - Data lake and warehouse integration
 * - Machine learning pipeline integration
 * - Data governance and compliance
 * - Performance monitoring and optimization
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Service
public interface AnalyticsDataIngestionService {

    // Real-time Data Streaming
    CompletableFuture<Void> ingestRealTimeData(String sourceSystem, String dataType, Map<String, Object> data);
    void startDataStream(String streamId, Map<String, Object> streamConfig);
    void stopDataStream(String streamId);
    Map<String, Object> getStreamStatus(String streamId);
    List<Map<String, Object>> getActiveStreams();
    void pauseDataStream(String streamId);
    void resumeDataStream(String streamId);
    
    // Batch Data Processing
    String submitBatchJob(Map<String, Object> jobConfig);
    Map<String, Object> getBatchJobStatus(String jobId);
    void cancelBatchJob(String jobId);
    Page<Map<String, Object>> getBatchJobHistory(Pageable pageable);
    void scheduleBatchJob(String jobId, String cronExpression);
    void retryFailedBatchJob(String jobId);
    
    // Data Source Management
    void registerDataSource(Map<String, Object> dataSourceConfig);
    void updateDataSource(String sourceId, Map<String, Object> dataSourceConfig);
    void removeDataSource(String sourceId);
    List<Map<String, Object>> getDataSources();
    Map<String, Object> getDataSourceMetrics(String sourceId);
    void testDataSourceConnection(String sourceId);
    
    // Data Transformation
    String createTransformation(Map<String, Object> transformationConfig);
    void updateTransformation(String transformationId, Map<String, Object> config);
    void deleteTransformation(String transformationId);
    List<Map<String, Object>> getTransformations();
    Map<String, Object> executeTransformation(String transformationId, Map<String, Object> inputData);
    void validateTransformation(Map<String, Object> transformationConfig);
    
    // Data Quality Management
    Map<String, Object> validateDataQuality(String datasetId, Map<String, Object> data);
    void createDataQualityRule(Map<String, Object> ruleConfig);
    void updateDataQualityRule(String ruleId, Map<String, Object> ruleConfig);
    void deleteDataQualityRule(String ruleId);
    List<Map<String, Object>> getDataQualityRules();
    Page<Map<String, Object>> getDataQualityIssues(String severity, Pageable pageable);
    Map<String, Object> getDataQualityReport(String datasetId);
    
    // Pipeline Management
    String createPipeline(Map<String, Object> pipelineConfig);
    void updatePipeline(String pipelineId, Map<String, Object> pipelineConfig);
    void deletePipeline(String pipelineId);
    void startPipeline(String pipelineId);
    void stopPipeline(String pipelineId);
    Map<String, Object> getPipelineStatus(String pipelineId);
    List<Map<String, Object>> getPipelines();
    Map<String, Object> getPipelineMetrics(String pipelineId);
    
    // Event Processing
    void processEvent(String eventType, Map<String, Object> eventData);
    void subscribeToEvents(String eventType, String subscriberId, Map<String, Object> config);
    void unsubscribeFromEvents(String eventType, String subscriberId);
    List<Map<String, Object>> getEventSubscriptions();
    Page<Map<String, Object>> getEventHistory(String eventType, Pageable pageable);
    void configureEventRouting(String eventType, Map<String, Object> routingConfig);
    
    // Data Lake Integration
    void writeToDataLake(String bucket, String path, Map<String, Object> data);
    Map<String, Object> readFromDataLake(String bucket, String path);
    void createDataLakePartition(String dataset, Map<String, Object> partitionConfig);
    List<Map<String, Object>> getDataLakeDatasets();
    Map<String, Object> getDataLakeMetrics();
    void optimizeDataLakeStorage(String dataset);
    
    // Data Warehouse Integration
    void loadToDataWarehouse(String table, List<Map<String, Object>> data);
    Map<String, Object> executeWarehouseQuery(String query);
    void createWarehouseTable(String tableName, Map<String, Object> schema);
    void updateWarehouseSchema(String tableName, Map<String, Object> schemaChanges);
    List<Map<String, Object>> getWarehouseTables();
    Map<String, Object> getWarehouseMetrics();
    
    // Machine Learning Integration
    void trainModel(String modelId, Map<String, Object> trainingConfig);
    Map<String, Object> predictWithModel(String modelId, Map<String, Object> inputData);
    void deployModel(String modelId, Map<String, Object> deploymentConfig);
    Map<String, Object> getModelMetrics(String modelId);
    List<Map<String, Object>> getModels();
    void retrainModel(String modelId);
    
    // Data Governance
    void applyDataGovernancePolicies(String datasetId, List<String> policyIds);
    void classifyData(String datasetId, Map<String, Object> data);
    void applyDataMasking(String datasetId, Map<String, Object> maskingRules);
    Map<String, Object> getDataLineage(String datasetId);
    void auditDataAccess(String userId, String datasetId, String operation);
    Page<Map<String, Object>> getDataAccessAudit(Pageable pageable);
    
    // Performance Monitoring
    Map<String, Object> getIngestionMetrics();
    Map<String, Object> getProcessingMetrics();
    Map<String, Object> getSystemHealth();
    List<Map<String, Object>> getPerformanceAlerts();
    void acknowledgeAlert(String alertId);
    Map<String, Object> getThroughputMetrics(String timeRange);
    
    // Configuration Management
    void updateIngestionConfig(Map<String, Object> config);
    Map<String, Object> getIngestionConfig();
    void createEnvironmentConfig(String environment, Map<String, Object> config);
    void switchEnvironment(String environment);
    void backupConfiguration();
    void restoreConfiguration(String backupId);
    
    // Data Archival
    void archiveOldData(String datasetId, String archivalPolicy);
    void restoreArchivedData(String datasetId, String restoreRequest);
    List<Map<String, Object>> getArchivalPolicies();
    void createArchivalPolicy(Map<String, Object> policyConfig);
    Map<String, Object> getArchivalStatus(String datasetId);
    
    // Real-time Analytics
    Map<String, Object> executeRealTimeQuery(String query);
    void createRealTimeAlert(Map<String, Object> alertConfig);
    void updateRealTimeAlert(String alertId, Map<String, Object> alertConfig);
    List<Map<String, Object>> getRealTimeAlerts();
    Map<String, Object> getRealTimeDashboard(String dashboardId);
    void refreshRealTimeCache();
    
    // Data Export
    String exportData(String datasetId, String format, Map<String, Object> exportConfig);
    Map<String, Object> getExportStatus(String exportId);
    byte[] downloadExport(String exportId);
    void scheduleDataExport(String datasetId, String schedule, Map<String, Object> exportConfig);
    List<Map<String, Object>> getScheduledExports();
    
    // Integration Management
    void createIntegration(Map<String, Object> integrationConfig);
    void updateIntegration(String integrationId, Map<String, Object> config);
    void deleteIntegration(String integrationId);
    List<Map<String, Object>> getIntegrations();
    void testIntegration(String integrationId);
    Map<String, Object> getIntegrationMetrics(String integrationId);
    
    // Error Handling & Recovery
    void retryFailedIngestion(String ingestionId);
    Page<Map<String, Object>> getFailedIngestions(Pageable pageable);
    void configureErrorHandling(Map<String, Object> errorConfig);
    Map<String, Object> getErrorStatistics();
    void clearErrorQueue(String errorType);
    
    // Schema Management
    void registerSchema(String schemaId, Map<String, Object> schema);
    void updateSchema(String schemaId, Map<String, Object> schema);
    void validateDataAgainstSchema(String schemaId, Map<String, Object> data);
    List<Map<String, Object>> getSchemas();
    Map<String, Object> getSchemaVersion(String schemaId, String version);
    void evolveSchema(String schemaId, Map<String, Object> evolution);
}
