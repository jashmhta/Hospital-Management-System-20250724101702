package com.hospital.hms.patientportal.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/**
 * Patient Portal Service Interface
 * 
 * Comprehensive patient self-service API backend with appointments,
 * medical records, billing, and communication capabilities.
 * 
 * Features:
 * - Patient authentication and profile management
 * - Appointment scheduling and management
 * - Medical records and health information access
 * - Prescription management and refills
 * - Bill payment and insurance management
 * - Provider communication and messaging
 * - Health tracking and wellness programs
 * - Family member management
 * - Document uploads and management
 * - Telehealth integration
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Service
public interface PatientPortalService {

    // Patient Authentication & Profile Management
    Map<String, Object> authenticatePatient(String username, String password, String mfaCode);
    Map<String, Object> refreshPatientToken(String refreshToken);
    Map<String, Object> getPatientProfile(String patientId);
    Map<String, Object> updatePatientProfile(String patientId, Map<String, Object> profileData);
    void changePassword(String patientId, String currentPassword, String newPassword);
    void enableTwoFactorAuth(String patientId);
    
    // Appointment Management
    Page<Map<String, Object>> getPatientAppointments(String patientId, String status, Pageable pageable);
    Map<String, Object> scheduleAppointment(String patientId, Map<String, Object> appointmentData);
    void cancelAppointment(String patientId, String appointmentId, String reason);
    void rescheduleAppointment(String patientId, String appointmentId, Map<String, Object> newSchedule);
    List<Map<String, Object>> getAvailableTimeSlots(String providerId, String date);
    Page<Map<String, Object>> getProviderSearch(String specialty, String location, Pageable pageable);
    
    // Medical Records & Health Information
    Map<String, Object> getPatientMedicalRecords(String patientId);
    Page<Map<String, Object>> getLabResults(String patientId, String fromDate, String toDate, Pageable pageable);
    Page<Map<String, Object>> getImagingResults(String patientId, Pageable pageable);
    Map<String, Object> getVitalSigns(String patientId, int days);
    Page<Map<String, Object>> getAllergies(String patientId, Pageable pageable);
    Page<Map<String, Object>> getMedicalHistory(String patientId, Pageable pageable);
    void addPatientReportedData(String patientId, Map<String, Object> healthData);
    
    // Prescription Management
    Page<Map<String, Object>> getCurrentPrescriptions(String patientId, Pageable pageable);
    Page<Map<String, Object>> getPrescriptionHistory(String patientId, Pageable pageable);
    Map<String, Object> requestPrescriptionRefill(String patientId, String prescriptionId);
    void transferPrescription(String patientId, String prescriptionId, String newPharmacy);
    List<Map<String, Object>> getNearbyPharmacies(String patientId, double radius);
    
    // Billing & Insurance
    Page<Map<String, Object>> getPatientBills(String patientId, String status, Pageable pageable);
    Map<String, Object> getBillDetails(String patientId, String billId);
    Map<String, Object> makePayment(String patientId, Map<String, Object> paymentData);
    Page<Map<String, Object>> getPaymentHistory(String patientId, Pageable pageable);
    Map<String, Object> getInsuranceInformation(String patientId);
    void updateInsuranceInformation(String patientId, Map<String, Object> insuranceData);
    Map<String, Object> getEstimatedCost(String patientId, String procedureCode);
    
    // Provider Communication
    Page<Map<String, Object>> getMessages(String patientId, Pageable pageable);
    Map<String, Object> sendMessage(String patientId, Map<String, Object> messageData);
    void markMessageAsRead(String patientId, String messageId);
    Map<String, Object> requestProviderCallback(String patientId, Map<String, Object> callbackRequest);
    
    // Health Tracking & Wellness
    Map<String, Object> getHealthMetrics(String patientId);
    void recordHealthMetric(String patientId, Map<String, Object> metricData);
    List<Map<String, Object>> getHealthGoals(String patientId);
    void setHealthGoal(String patientId, Map<String, Object> goalData);
    Page<Map<String, Object>> getWellnessPrograms(String patientId, Pageable pageable);
    void enrollInWellnessProgram(String patientId, String programId);
    
    // Family Member Management
    List<Map<String, Object>> getFamilyMembers(String patientId);
    void addFamilyMember(String patientId, Map<String, Object> familyMemberData);
    void removeFamilyMember(String patientId, String familyMemberId);
    void requestFamilyAccess(String patientId, String familyMemberId, List<String> permissions);
    
    // Document Management
    Page<Map<String, Object>> getPatientDocuments(String patientId, String category, Pageable pageable);
    Map<String, Object> uploadDocument(String patientId, Map<String, Object> documentData);
    void deleteDocument(String patientId, String documentId);
    byte[] downloadDocument(String patientId, String documentId);
    
    // Telehealth Integration
    List<Map<String, Object>> getAvailableTelehealthSlots(String patientId, String providerId);
    Map<String, Object> scheduleTelehealthAppointment(String patientId, Map<String, Object> appointmentData);
    Map<String, Object> joinTelehealthSession(String patientId, String sessionId);
    
    // Notifications & Preferences
    Page<Map<String, Object>> getNotifications(String patientId, boolean unreadOnly, Pageable pageable);
    void markNotificationAsRead(String patientId, String notificationId);
    Map<String, Object> getNotificationPreferences(String patientId);
    void updateNotificationPreferences(String patientId, Map<String, Object> preferences);
    
    // Dashboard & Quick Actions
    Map<String, Object> getPatientDashboard(String patientId);
    Map<String, Object> getQuickStats(String patientId);
    List<Map<String, Object>> getRecentActivity(String patientId, int limit);
    List<Map<String, Object>> getUpcomingEvents(String patientId, int days);
    
    // Health Records Sharing
    Map<String, Object> generateHealthSummary(String patientId);
    String generateShareableLink(String patientId, List<String> dataTypes, int validityDays);
    void revokeSharedAccess(String patientId, String shareId);
    
    // Emergency Information
    Map<String, Object> getEmergencyContacts(String patientId);
    void updateEmergencyContacts(String patientId, Map<String, Object> emergencyData);
    Map<String, Object> getEmergencyMedicalInfo(String patientId);
    
    // Feedback & Reviews
    void submitFeedback(String patientId, Map<String, Object> feedbackData);
    void rateProvider(String patientId, String providerId, Map<String, Object> ratingData);
    Page<Map<String, Object>> getMyReviews(String patientId, Pageable pageable);
}
