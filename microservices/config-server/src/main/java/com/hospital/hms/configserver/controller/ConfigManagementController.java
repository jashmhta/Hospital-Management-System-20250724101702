package com.hospital.hms.configserver.controller;

import com.hospital.hms.configserver.dto.ConfigurationDto;
import com.hospital.hms.configserver.dto.ConfigurationHistoryDto;
import com.hospital.hms.configserver.dto.ConfigurationValidationDto;
import com.hospital.hms.configserver.service.ConfigManagementService;
import io.micrometer.core.annotation.Timed;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Configuration Management Controller
 * 
 * Provides REST endpoints for advanced configuration management operations.
 * Offers enterprise-grade features for configuration administration, validation,
 * and lifecycle management.
 * 
 * Features:
 * - Configuration validation and testing
 * - Configuration history and versioning
 * - Bulk configuration operations
 * - Configuration templates management
 * - Environment-specific configuration
 * - Configuration encryption/decryption
 * - Configuration audit and compliance
 * - Configuration rollback capabilities
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/config")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class ConfigManagementController {

    private final ConfigManagementService configManagementService;

    /**
     * Get all configurations for an application and profile
     */
    @GetMapping("/applications/{applicationName}/profiles/{profile}")
    @Timed(value = "config.management.get.application.profile", description = "Time taken to get application profile config")
    public ResponseEntity<ConfigurationDto> getApplicationConfiguration(
            @PathVariable String applicationName,
            @PathVariable String profile,
            @RequestParam(defaultValue = "main") String label) {
        log.info("Fetching configuration - Application: {}, Profile: {}, Label: {}", 
                applicationName, profile, label);
        
        ConfigurationDto configuration = configManagementService.getApplicationConfiguration(
                applicationName, profile, label);
        
        log.info("Retrieved configuration with {} properties for application: {}", 
                configuration.getProperties().size(), applicationName);
        return ResponseEntity.ok(configuration);
    }

    /**
     * Update configuration for an application and profile
     */
    @PutMapping("/applications/{applicationName}/profiles/{profile}")
    @Timed(value = "config.management.update.application.profile", description = "Time taken to update application profile config")
    public ResponseEntity<Void> updateApplicationConfiguration(
            @PathVariable String applicationName,
            @PathVariable String profile,
            @RequestParam(defaultValue = "main") String label,
            @Valid @RequestBody ConfigurationDto configurationDto) {
        log.info("Updating configuration - Application: {}, Profile: {}, Label: {}", 
                applicationName, profile, label);
        
        configManagementService.updateApplicationConfiguration(
                applicationName, profile, label, configurationDto);
        
        log.info("Successfully updated configuration for application: {}", applicationName);
        return ResponseEntity.ok().build();
    }

    /**
     * Validate configuration before applying
     */
    @PostMapping("/validate")
    @Timed(value = "config.management.validate", description = "Time taken to validate configuration")
    public ResponseEntity<ConfigurationValidationDto> validateConfiguration(
            @Valid @RequestBody ConfigurationDto configurationDto) {
        log.info("Validating configuration with {} properties", configurationDto.getProperties().size());
        
        ConfigurationValidationDto validation = configManagementService.validateConfiguration(configurationDto);
        
        log.info("Configuration validation completed - Valid: {}, Errors: {}, Warnings: {}", 
                validation.isValid(), validation.getErrors().size(), validation.getWarnings().size());
        return ResponseEntity.ok(validation);
    }

    /**
     * Get configuration history for an application
     */
    @GetMapping("/applications/{applicationName}/history")
    @Timed(value = "config.management.history", description = "Time taken to get configuration history")
    public ResponseEntity<Page<ConfigurationHistoryDto>> getConfigurationHistory(
            @PathVariable String applicationName,
            @RequestParam(required = false) String profile,
            Pageable pageable) {
        log.info("Fetching configuration history for application: {}, profile: {}", applicationName, profile);
        
        Page<ConfigurationHistoryDto> history = configManagementService.getConfigurationHistory(
                applicationName, profile, pageable);
        
        log.info("Retrieved {} configuration history entries", history.getTotalElements());
        return ResponseEntity.ok(history);
    }

    /**
     * Rollback configuration to a previous version
     */
    @PostMapping("/applications/{applicationName}/profiles/{profile}/rollback/{version}")
    @Timed(value = "config.management.rollback", description = "Time taken to rollback configuration")
    public ResponseEntity<Void> rollbackConfiguration(
            @PathVariable String applicationName,
            @PathVariable String profile,
            @PathVariable String version) {
        log.warn("Rolling back configuration - Application: {}, Profile: {}, Version: {}", 
                applicationName, profile, version);
        
        configManagementService.rollbackConfiguration(applicationName, profile, version);
        
        log.info("Successfully rolled back configuration for application: {} to version: {}", 
                applicationName, version);
        return ResponseEntity.ok().build();
    }

    /**
     * Get all applications managed by the config server
     */
    @GetMapping("/applications")
    @Timed(value = "config.management.applications.list", description = "Time taken to list all applications")
    public ResponseEntity<List<String>> getAllApplications() {
        log.info("Fetching all managed applications");
        
        List<String> applications = configManagementService.getAllApplications();
        
        log.info("Retrieved {} managed applications", applications.size());
        return ResponseEntity.ok(applications);
    }

    /**
     * Get all profiles for an application
     */
    @GetMapping("/applications/{applicationName}/profiles")
    @Timed(value = "config.management.profiles.list", description = "Time taken to list application profiles")
    public ResponseEntity<List<String>> getApplicationProfiles(
            @PathVariable String applicationName) {
        log.info("Fetching profiles for application: {}", applicationName);
        
        List<String> profiles = configManagementService.getApplicationProfiles(applicationName);
        
        log.info("Retrieved {} profiles for application: {}", profiles.size(), applicationName);
        return ResponseEntity.ok(profiles);
    }

    /**
     * Create a new configuration from template
     */
    @PostMapping("/applications/{applicationName}/profiles/{profile}/from-template/{templateName}")
    @Timed(value = "config.management.create.from.template", description = "Time taken to create config from template")
    public ResponseEntity<Void> createConfigurationFromTemplate(
            @PathVariable String applicationName,
            @PathVariable String profile,
            @PathVariable String templateName,
            @RequestBody(required = false) Map<String, Object> templateVariables) {
        log.info("Creating configuration from template - Application: {}, Profile: {}, Template: {}", 
                applicationName, profile, templateName);
        
        configManagementService.createConfigurationFromTemplate(
                applicationName, profile, templateName, templateVariables);
        
        log.info("Successfully created configuration from template: {}", templateName);
        return ResponseEntity.created(null).build();
    }

    /**
     * Encrypt a configuration value
     */
    @PostMapping("/encrypt")
    @Timed(value = "config.management.encrypt", description = "Time taken to encrypt configuration value")
    public ResponseEntity<Map<String, String>> encryptValue(
            @RequestBody Map<String, String> request) {
        String plainText = request.get("value");
        log.info("Encrypting configuration value");
        
        String encryptedValue = configManagementService.encryptValue(plainText);
        
        log.info("Successfully encrypted configuration value");
        return ResponseEntity.ok(Map.of("encrypted", encryptedValue));
    }

    /**
     * Decrypt a configuration value
     */
    @PostMapping("/decrypt")
    @Timed(value = "config.management.decrypt", description = "Time taken to decrypt configuration value")
    public ResponseEntity<Map<String, String>> decryptValue(
            @RequestBody Map<String, String> request) {
        String encryptedText = request.get("value");
        log.info("Decrypting configuration value");
        
        String decryptedValue = configManagementService.decryptValue(encryptedText);
        
        log.info("Successfully decrypted configuration value");
        return ResponseEntity.ok(Map.of("decrypted", decryptedValue));
    }

    /**
     * Refresh configuration for specific application instances
     */
    @PostMapping("/refresh/{applicationName}")
    @Timed(value = "config.management.refresh", description = "Time taken to refresh application configuration")
    public ResponseEntity<Map<String, Object>> refreshApplicationConfiguration(
            @PathVariable String applicationName,
            @RequestParam(required = false) String instanceId) {
        log.info("Refreshing configuration for application: {}, instance: {}", applicationName, instanceId);
        
        Map<String, Object> refreshResult = configManagementService.refreshApplicationConfiguration(
                applicationName, instanceId);
        
        log.info("Configuration refresh completed for application: {}", applicationName);
        return ResponseEntity.ok(refreshResult);
    }

    /**
     * Get configuration server health and statistics
     */
    @GetMapping("/health")
    @Timed(value = "config.management.health", description = "Time taken to get config server health")
    public ResponseEntity<Map<String, Object>> getConfigServerHealth() {
        log.debug("Fetching config server health information");
        
        Map<String, Object> health = configManagementService.getConfigServerHealth();
        
        log.debug("Retrieved config server health information");
        return ResponseEntity.ok(health);
    }

    /**
     * Export all configurations
     */
    @GetMapping("/export")
    @Timed(value = "config.management.export", description = "Time taken to export all configurations")
    public ResponseEntity<Map<String, Object>> exportConfigurations(
            @RequestParam(required = false) String applicationName,
            @RequestParam(required = false) String profile) {
        log.info("Exporting configurations - Application: {}, Profile: {}", applicationName, profile);
        
        Map<String, Object> export = configManagementService.exportConfigurations(applicationName, profile);
        
        log.info("Successfully exported configurations");
        return ResponseEntity.ok(export);
    }

    /**
     * Import configurations
     */
    @PostMapping("/import")
    @Timed(value = "config.management.import", description = "Time taken to import configurations")
    public ResponseEntity<Map<String, Object>> importConfigurations(
            @RequestBody Map<String, Object> configurationsData,
            @RequestParam(defaultValue = "false") boolean overwrite) {
        log.info("Importing configurations - Overwrite: {}", overwrite);
        
        Map<String, Object> importResult = configManagementService.importConfigurations(
                configurationsData, overwrite);
        
        log.info("Successfully imported configurations");
        return ResponseEntity.ok(importResult);
    }

    /**
     * Get configuration templates
     */
    @GetMapping("/templates")
    @Timed(value = "config.management.templates.list", description = "Time taken to list configuration templates")
    public ResponseEntity<List<Map<String, Object>>> getConfigurationTemplates() {
        log.info("Fetching configuration templates");
        
        List<Map<String, Object>> templates = configManagementService.getConfigurationTemplates();
        
        log.info("Retrieved {} configuration templates", templates.size());
        return ResponseEntity.ok(templates);
    }

    /**
     * Create or update a configuration template
     */
    @PutMapping("/templates/{templateName}")
    @Timed(value = "config.management.templates.save", description = "Time taken to save configuration template")
    public ResponseEntity<Void> saveConfigurationTemplate(
            @PathVariable String templateName,
            @Valid @RequestBody Map<String, Object> templateData) {
        log.info("Saving configuration template: {}", templateName);
        
        configManagementService.saveConfigurationTemplate(templateName, templateData);
        
        log.info("Successfully saved configuration template: {}", templateName);
        return ResponseEntity.ok().build();
    }

    /**
     * Delete a configuration template
     */
    @DeleteMapping("/templates/{templateName}")
    @Timed(value = "config.management.templates.delete", description = "Time taken to delete configuration template")
    public ResponseEntity<Void> deleteConfigurationTemplate(@PathVariable String templateName) {
        log.info("Deleting configuration template: {}", templateName);
        
        configManagementService.deleteConfigurationTemplate(templateName);
        
        log.info("Successfully deleted configuration template: {}", templateName);
        return ResponseEntity.noContent().build();
    }
}
