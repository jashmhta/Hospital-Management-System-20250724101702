package com.hospital.hms.procedure.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/**
 * Procedure Management Service Interface
 * 
 * Complete clinical procedure workflow management with scheduling,
 * documentation, resource allocation, and compliance tracking.
 * 
 * Features:
 * - Procedure scheduling and workflow management
 * - Resource allocation and equipment management
 * - Clinical documentation and compliance
 * - Pre-procedure and post-procedure care
 * - Staff assignment and coordination
 * - Quality metrics and outcomes tracking
 * - Billing integration and cost management
 * - Risk assessment and safety protocols
 * - Template and protocol management
 * - Real-time monitoring and alerts
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Service
public interface ProcedureManagementService {

    // Procedure Scheduling & Planning
    Map<String, Object> scheduleProcedure(Map<String, Object> procedureRequest);
    void updateProcedureSchedule(String procedureId, Map<String, Object> scheduleUpdate);
    void cancelProcedure(String procedureId, String reason, Map<String, Object> cancellationData);
    void rescheduleProcedure(String procedureId, Map<String, Object> newSchedule);
    Page<Map<String, Object>> getProcedureSchedule(String department, String date, Pageable pageable);
    List<Map<String, Object>> getAvailableTimeSlots(String procedureType, String date, String duration);
    Map<String, Object> getProcedureDetails(String procedureId);
    
    // Resource Management
    List<Map<String, Object>> checkResourceAvailability(String procedureType, String date, String time);
    void allocateResources(String procedureId, List<String> resourceIds);
    void deallocateResources(String procedureId, List<String> resourceIds);
    Map<String, Object> getResourceUtilization(String resourceId, String timeRange);
    List<Map<String, Object>> getAvailableRooms(String procedureType, String date, String time);
    List<Map<String, Object>> getAvailableEquipment(String equipmentType, String date, String time);
    void reserveResource(String resourceId, String procedureId, String startTime, String endTime);
    
    // Staff Assignment & Coordination
    void assignStaff(String procedureId, List<Map<String, Object>> staffAssignments);
    void updateStaffAssignment(String procedureId, String staffId, Map<String, Object> assignment);
    void removeStaffAssignment(String procedureId, String staffId);
    List<Map<String, Object>> getAvailableStaff(String procedureType, String date, String time);
    Map<String, Object> getStaffSchedule(String staffId, String date);
    void notifyStaffAssignment(String procedureId, String staffId);
    List<Map<String, Object>> getStaffWorkload(String department, String timeRange);
    
    // Procedure Workflow Management
    void startProcedure(String procedureId, Map<String, Object> startData);
    void updateProcedureStatus(String procedureId, String status, Map<String, Object> statusData);
    void completeProcedure(String procedureId, Map<String, Object> completionData);
    void pauseProcedure(String procedureId, String reason);
    void resumeProcedure(String procedureId);
    Map<String, Object> getProcedureProgress(String procedureId);
    List<Map<String, Object>> getActiveProcedures(String department);
    
    // Pre-Procedure Management
    Map<String, Object> createPreProcedureChecklist(String procedureId);
    void updatePreProcedureChecklist(String procedureId, Map<String, Object> checklistData);
    Map<String, Object> getPreProcedureInstructions(String procedureType);
    void recordPreProcedureAssessment(String procedureId, Map<String, Object> assessment);
    void verifyPreProcedureCompliance(String procedureId);
    List<Map<String, Object>> getPreProcedureTasks(String procedureId);
    
    // Procedure Documentation
    void createProcedureNote(String procedureId, Map<String, Object> procedureNote);
    void updateProcedureNote(String procedureId, String noteId, Map<String, Object> noteUpdate);
    Page<Map<String, Object>> getProcedureNotes(String procedureId, Pageable pageable);
    void addProcedureImage(String procedureId, Map<String, Object> imageData);
    void recordProcedureComplications(String procedureId, Map<String, Object> complications);
    void documentProcedureOutcome(String procedureId, Map<String, Object> outcome);
    Map<String, Object> generateProcedureReport(String procedureId);
    
    // Post-Procedure Management
    Map<String, Object> createPostProcedureInstructions(String procedureId);
    void scheduleFollowUp(String procedureId, Map<String, Object> followUpData);
    void recordPostProcedureAssessment(String procedureId, Map<String, Object> assessment);
    List<Map<String, Object>> getPostProcedureTasks(String procedureId);
    void updateDischargeInstructions(String procedureId, Map<String, Object> instructions);
    void notifyPrimaryProvider(String procedureId, Map<String, Object> notification);
    
    // Quality & Outcomes Tracking
    void recordQualityMetrics(String procedureId, Map<String, Object> metrics);
    Map<String, Object> getProcedureOutcomes(String procedureId);
    Map<String, Object> getQualityReport(String procedureType, String timeRange);
    void trackPatientSatisfaction(String procedureId, Map<String, Object> satisfaction);
    List<Map<String, Object>> getQualityIndicators(String department);
    void reportAdverseEvent(String procedureId, Map<String, Object> adverseEvent);
    
    // Templates & Protocols
    Map<String, Object> createProcedureTemplate(Map<String, Object> templateData);
    void updateProcedureTemplate(String templateId, Map<String, Object> templateData);
    void deleteProcedureTemplate(String templateId);
    List<Map<String, Object>> getProcedureTemplates(String procedureType);
    Map<String, Object> applyTemplate(String procedureId, String templateId);
    void createProtocol(Map<String, Object> protocolData);
    List<Map<String, Object>> getProtocols(String procedureType);
    
    // Billing Integration
    void generateProcedureBilling(String procedureId);
    void updateProcedureCodes(String procedureId, List<String> procedureCodes);
    Map<String, Object> getProcedureCosts(String procedureId);
    void recordAdditionalCharges(String procedureId, List<Map<String, Object>> charges);
    Map<String, Object> getBillingReport(String procedureId);
    List<Map<String, Object>> getUnbilledProcedures(String department);
    
    // Risk Assessment & Safety
    Map<String, Object> assessProcedureRisk(String procedureId);
    void recordSafetyChecklist(String procedureId, Map<String, Object> safetyData);
    void reportSafetyIncident(String procedureId, Map<String, Object> incident);
    List<Map<String, Object>> getSafetyProtocols(String procedureType);
    void updateRiskMitigation(String procedureId, Map<String, Object> mitigation);
    Map<String, Object> getSafetyMetrics(String department, String timeRange);
    
    // Equipment & Supplies Management
    void recordEquipmentUsage(String procedureId, List<Map<String, Object>> equipmentUsage);
    void recordSupplyConsumption(String procedureId, List<Map<String, Object>> supplies);
    Map<String, Object> getEquipmentStatus(String equipmentId);
    void scheduleEquipmentMaintenance(String equipmentId, Map<String, Object> maintenanceData);
    List<Map<String, Object>> getSupplyRequirements(String procedureType);
    void requestSupplies(String procedureId, List<Map<String, Object>> supplyRequests);
    
    // Analytics & Reporting
    Map<String, Object> getProcedureStatistics(String timeRange);
    Map<String, Object> getDepartmentMetrics(String department, String timeRange);
    Map<String, Object> getProviderPerformance(String providerId, String timeRange);
    List<Map<String, Object>> getTrendAnalysis(String metricType, String timeRange);
    Map<String, Object> getUtilizationReport(String resourceType, String timeRange);
    Map<String, Object> generateComplianceReport(String timeRange);
    
    // Notifications & Alerts
    void sendProcedureReminder(String procedureId, String recipientType);
    void createProcedureAlert(String procedureId, String alertType, Map<String, Object> alertData);
    List<Map<String, Object>> getProcedureAlerts(String department);
    void acknowledgeAlert(String alertId);
    void configureProcedureNotifications(String procedureType, Map<String, Object> notificationConfig);
    
    // Integration & Interoperability
    void syncWithEMR(String procedureId);
    void updateORManagementSystem(String procedureId, Map<String, Object> updateData);
    void notifyLabSystem(String procedureId, List<String> labOrders);
    void updatePharmacySystem(String procedureId, List<String> medications);
    void sendToRadiology(String procedureId, List<String> imagingOrders);
    Map<String, Object> getIntegrationStatus(String procedureId);
    
    // Configuration & Administration
    void updateProcedureConfiguration(Map<String, Object> configuration);
    Map<String, Object> getProcedureConfiguration();
    void createProcedureType(Map<String, Object> procedureTypeData);
    void updateProcedureType(String procedureTypeId, Map<String, Object> procedureTypeData);
    List<Map<String, Object>> getProcedureTypes();
    void configureDepartmentSettings(String department, Map<String, Object> settings);
    
    // Audit & Compliance
    Page<Map<String, Object>> getProcedureAuditLog(String procedureId, Pageable pageable);
    void recordComplianceCheck(String procedureId, Map<String, Object> complianceData);
    Map<String, Object> getComplianceStatus(String procedureId);
    List<Map<String, Object>> getComplianceViolations(String timeRange);
    void generateComplianceReport(String reportType, String timeRange);
    
    // Emergency Procedures
    void initiateEmergencyProcedure(Map<String, Object> emergencyData);
    void updateEmergencyStatus(String procedureId, String status);
    List<Map<String, Object>> getEmergencyProcedures();
    void activateEmergencyProtocol(String protocolId, String procedureId);
    Map<String, Object> getEmergencyResponse(String procedureId);
}
