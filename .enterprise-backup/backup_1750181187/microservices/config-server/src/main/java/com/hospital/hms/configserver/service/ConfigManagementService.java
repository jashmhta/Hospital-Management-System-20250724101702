package com.hospital.hms.configserver.service;

import com.hospital.hms.configserver.dto.ConfigurationDto;
import com.hospital.hms.configserver.dto.ConfigurationHistoryDto;
import com.hospital.hms.configserver.dto.ConfigurationValidationDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Map;

/**
 * Configuration Management Service Interface
 * 
 * Defines business operations for advanced configuration management.
 * Provides enterprise-grade functionality for configuration lifecycle management.
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
public interface ConfigManagementService {

    /**
     * Get configuration for specific application and profile
     */
    ConfigurationDto getApplicationConfiguration(String applicationName, String profile, String label);

    /**
     * Update configuration for specific application and profile
     */
    void updateApplicationConfiguration(String applicationName, String profile, String label, 
                                      ConfigurationDto configurationDto);

    /**
     * Validate configuration before applying
     */
    ConfigurationValidationDto validateConfiguration(ConfigurationDto configurationDto);

    /**
     * Get configuration history for an application
     */
    Page<ConfigurationHistoryDto> getConfigurationHistory(String applicationName, String profile, 
                                                         Pageable pageable);

    /**
     * Rollback configuration to a previous version
     */
    void rollbackConfiguration(String applicationName, String profile, String version);

    /**
     * Get all applications managed by config server
     */
    List<String> getAllApplications();

    /**
     * Get all profiles for an application
     */
    List<String> getApplicationProfiles(String applicationName);

    /**
     * Create configuration from template
     */
    void createConfigurationFromTemplate(String applicationName, String profile, String templateName, 
                                       Map<String, Object> templateVariables);

    /**
     * Encrypt a configuration value
     */
    String encryptValue(String plainText);

    /**
     * Decrypt a configuration value
     */
    String decryptValue(String encryptedText);

    /**
     * Refresh configuration for application instances
     */
    Map<String, Object> refreshApplicationConfiguration(String applicationName, String instanceId);

    /**
     * Get config server health and statistics
     */
    Map<String, Object> getConfigServerHealth();

    /**
     * Export configurations
     */
    Map<String, Object> exportConfigurations(String applicationName, String profile);

    /**
     * Import configurations
     */
    Map<String, Object> importConfigurations(Map<String, Object> configurationsData, boolean overwrite);

    /**
     * Get configuration templates
     */
    List<Map<String, Object>> getConfigurationTemplates();

    /**
     * Save configuration template
     */
    void saveConfigurationTemplate(String templateName, Map<String, Object> templateData);

    /**
     * Delete configuration template
     */
    void deleteConfigurationTemplate(String templateName);

    /**
     * Validate configuration against schema
     */
    ConfigurationValidationDto validateConfigurationSchema(ConfigurationDto configurationDto, String schemaVersion);

    /**
     * Get configuration diff between versions
     */
    Map<String, Object> getConfigurationDiff(String applicationName, String profile, 
                                            String fromVersion, String toVersion);

    /**
     * Search configurations by criteria
     */
    Page<ConfigurationDto> searchConfigurations(Map<String, Object> searchCriteria, Pageable pageable);

    /**
     * Get configuration usage analytics
     */
    Map<String, Object> getConfigurationAnalytics(String applicationName, String profile);

    /**
     * Backup configurations
     */
    String backupConfigurations(List<String> applicationNames);

    /**
     * Restore configurations from backup
     */
    Map<String, Object> restoreConfigurations(String backupId);

    /**
     * Get configuration compliance report
     */
    Map<String, Object> getComplianceReport(String applicationName);

    /**
     * Apply configuration policies
     */
    void applyConfigurationPolicies(String applicationName, List<String> policyIds);
}
