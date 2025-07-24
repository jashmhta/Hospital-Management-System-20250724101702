package com.hms.patientportal.repository;

import com.hms.patientportal.entity.FamilyMember;
import com.hms.patientportal.entity.PatientPortalUser;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Family Member Repository
 * 
 * Repository for managing family member relationships with comprehensive
 * access control, verification workflow, and healthcare permission management.
 */
@Repository
public interface FamilyMemberRepository extends JpaRepository<FamilyMember, Long>, JpaSpecificationExecutor<FamilyMember> {

    // Basic family member queries
    List<FamilyMember> findByPatientId(Long patientId);
    
    List<FamilyMember> findByPatient(PatientPortalUser patient);
    
    List<FamilyMember> findByPatientAndIsActiveTrue(PatientPortalUser patient);
    
    Page<FamilyMember> findByPatientAndIsActiveTrue(PatientPortalUser patient, Pageable pageable);

    // Linked patient queries
    @Query("SELECT fm FROM FamilyMember fm WHERE fm.linkedPatientId = :linkedPatientId AND fm.isActive = true")
    List<FamilyMember> findByLinkedPatientId(@Param("linkedPatientId") Long linkedPatientId);
    
    @Query("SELECT fm FROM FamilyMember fm WHERE fm.linkedPatientId = :linkedPatientId AND fm.verificationStatus = 'VERIFIED'")
    List<FamilyMember> findVerifiedByLinkedPatientId(@Param("linkedPatientId") Long linkedPatientId);

    // Relationship queries
    List<FamilyMember> findByRelationshipAndIsActiveTrue(FamilyMember.Relationship relationship);
    
    @Query("SELECT fm FROM FamilyMember fm WHERE fm.patient.id = :patientId AND fm.relationship = :relationship AND fm.isActive = true")
    List<FamilyMember> findByPatientAndRelationship(@Param("patientId") Long patientId, @Param("relationship") FamilyMember.Relationship relationship);

    // Access level and permission queries
    List<FamilyMember> findByAccessLevelAndIsActiveTrue(FamilyMember.AccessLevel accessLevel);
    
    @Query("SELECT fm FROM FamilyMember fm WHERE fm.patient.id = :patientId AND fm.canViewMedicalRecords = true AND fm.isActive = true AND fm.verificationStatus = 'VERIFIED'")
    List<FamilyMember> findWithMedicalRecordAccess(@Param("patientId") Long patientId);
    
    @Query("SELECT fm FROM FamilyMember fm WHERE fm.patient.id = :patientId AND fm.canScheduleAppointments = true AND fm.isActive = true AND fm.verificationStatus = 'VERIFIED'")
    List<FamilyMember> findWithAppointmentAccess(@Param("patientId") Long patientId);
    
    @Query("SELECT fm FROM FamilyMember fm WHERE fm.patient.id = :patientId AND fm.canAccessBilling = true AND fm.isActive = true AND fm.verificationStatus = 'VERIFIED'")
    List<FamilyMember> findWithBillingAccess(@Param("patientId") Long patientId);

    // Verification status queries
    List<FamilyMember> findByVerificationStatus(FamilyMember.VerificationStatus status);
    
    @Query("SELECT fm FROM FamilyMember fm WHERE fm.verificationStatus = 'PENDING' ORDER BY fm.createdAt ASC")
    List<FamilyMember> findPendingVerification();
    
    @Query("SELECT fm FROM FamilyMember fm WHERE fm.verificationStatus = 'VERIFIED' AND fm.isActive = true")
    List<FamilyMember> findVerifiedAndActive();

    // Contact and emergency queries
    @Query("SELECT fm FROM FamilyMember fm WHERE fm.patient.id = :patientId AND fm.emergencyContact = true AND fm.isActive = true")
    List<FamilyMember> findEmergencyContacts(@Param("patientId") Long patientId);
    
    @Query("SELECT fm FROM FamilyMember fm WHERE fm.patient.id = :patientId AND fm.primaryContact = true AND fm.isActive = true")
    Optional<FamilyMember> findPrimaryContact(@Param("patientId") Long patientId);
    
    @Query("SELECT fm FROM FamilyMember fm WHERE fm.phoneNumber = :phoneNumber AND fm.isActive = true")
    List<FamilyMember> findByPhoneNumber(@Param("phoneNumber") String phoneNumber);

    // Legal authorization queries
    @Query("SELECT fm FROM FamilyMember fm WHERE fm.patient.id = :patientId AND fm.legalGuardian = true AND fm.isActive = true")
    List<FamilyMember> findLegalGuardians(@Param("patientId") Long patientId);
    
    @Query("SELECT fm FROM FamilyMember fm WHERE fm.patient.id = :patientId AND fm.powerOfAttorney = true AND fm.isActive = true")
    List<FamilyMember> findPowerOfAttorneyHolders(@Param("patientId") Long patientId);
    
    @Query("SELECT fm FROM FamilyMember fm WHERE fm.hipaaAuthorizationSigned = true AND fm.isActive = true")
    List<FamilyMember> findWithHipaaAuthorization();

    // Consent and authorization tracking
    @Query("SELECT fm FROM FamilyMember fm WHERE fm.consentFormSigned = true AND (fm.consentExpiresDate IS NULL OR fm.consentExpiresDate > :now)")
    List<FamilyMember> findWithValidConsent(@Param("now") LocalDateTime now);
    
    @Query("SELECT fm FROM FamilyMember fm WHERE fm.consentExpiresDate IS NOT NULL AND fm.consentExpiresDate < :now AND fm.isActive = true")
    List<FamilyMember> findWithExpiredConsent(@Param("now") LocalDateTime now);

    // Age-based queries (minors, adults)
    @Query("SELECT fm FROM FamilyMember fm WHERE fm.dateOfBirth > :eighteenYearsAgo AND fm.isActive = true")
    List<FamilyMember> findMinors(@Param("eighteenYearsAgo") java.time.LocalDate eighteenYearsAgo);
    
    @Query("SELECT fm FROM FamilyMember fm WHERE fm.dateOfBirth <= :eighteenYearsAgo AND fm.isActive = true")
    List<FamilyMember> findAdults(@Param("eighteenYearsAgo") java.time.LocalDate eighteenYearsAgo);

    // Search functionality
    @Query("SELECT fm FROM FamilyMember fm WHERE fm.patient.id = :patientId AND " +
           "(LOWER(fm.firstName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(fm.lastName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(fm.email) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    List<FamilyMember> searchFamilyMembers(@Param("patientId") Long patientId, @Param("searchTerm") String searchTerm);

    // Analytics and reporting queries
    @Query("SELECT fm.relationship, COUNT(fm) FROM FamilyMember fm WHERE fm.isActive = true GROUP BY fm.relationship ORDER BY COUNT(fm) DESC")
    List<Object[]> getRelationshipCounts();
    
    @Query("SELECT fm.accessLevel, COUNT(fm) FROM FamilyMember fm WHERE fm.isActive = true GROUP BY fm.accessLevel")
    List<Object[]> getAccessLevelCounts();
    
    @Query("SELECT fm.verificationStatus, COUNT(fm) FROM FamilyMember fm GROUP BY fm.verificationStatus")
    List<Object[]> getVerificationStatusCounts();
    
    @Query("SELECT DATE(fm.createdAt) as addedDate, COUNT(fm) FROM FamilyMember fm WHERE fm.createdAt >= :since GROUP BY DATE(fm.createdAt) ORDER BY addedDate DESC")
    List<Object[]> getDailyAdditionCounts(@Param("since") LocalDateTime since);

    // Permission summary queries
    @Query("SELECT " +
           "SUM(CASE WHEN fm.canViewMedicalRecords = true THEN 1 ELSE 0 END) as medicalAccess, " +
           "SUM(CASE WHEN fm.canScheduleAppointments = true THEN 1 ELSE 0 END) as appointmentAccess, " +
           "SUM(CASE WHEN fm.canAccessBilling = true THEN 1 ELSE 0 END) as billingAccess, " +
           "SUM(CASE WHEN fm.canCommunicateProviders = true THEN 1 ELSE 0 END) as communicationAccess " +
           "FROM FamilyMember fm WHERE fm.patient.id = :patientId AND fm.isActive = true")
    Object[] getPermissionSummary(@Param("patientId") Long patientId);

    // Validation queries
    @Query("SELECT COUNT(fm) FROM FamilyMember fm WHERE fm.patient.id = :patientId AND fm.isActive = true")
    Long countActiveFamilyMembers(@Param("patientId") Long patientId);
    
    @Query("SELECT COUNT(fm) > 0 FROM FamilyMember fm WHERE fm.patient.id = :patientId AND fm.primaryContact = true AND fm.id != :excludeId AND fm.isActive = true")
    boolean hasPrimaryContactOtherThan(@Param("patientId") Long patientId, @Param("excludeId") Long excludeId);
    
    @Query("SELECT COUNT(fm) > 0 FROM FamilyMember fm WHERE fm.email = :email AND fm.patient.id = :patientId AND fm.id != :excludeId AND fm.isActive = true")
    boolean existsByEmailForPatientExcluding(@Param("email") String email, @Param("patientId") Long patientId, @Param("excludeId") Long excludeId);

    // Update operations
    @Modifying
    @Transactional
    @Query("UPDATE FamilyMember fm SET fm.verificationStatus = :status, fm.verifiedBy = :verifiedBy, fm.verifiedDate = :verifiedDate WHERE fm.id = :familyMemberId")
    int updateVerificationStatus(@Param("familyMemberId") Long familyMemberId, 
                               @Param("status") FamilyMember.VerificationStatus status, 
                               @Param("verifiedBy") String verifiedBy, 
                               @Param("verifiedDate") LocalDateTime verifiedDate);
    
    @Modifying
    @Transactional
    @Query("UPDATE FamilyMember fm SET fm.isActive = false, fm.deactivatedDate = :deactivatedDate, fm.deactivatedReason = :reason WHERE fm.id = :familyMemberId")
    int deactivateFamilyMember(@Param("familyMemberId") Long familyMemberId, 
                             @Param("deactivatedDate") LocalDateTime deactivatedDate, 
                             @Param("reason") String reason);
    
    @Modifying
    @Transactional
    @Query("UPDATE FamilyMember fm SET fm.isActive = true, fm.deactivatedDate = null, fm.deactivatedReason = null WHERE fm.id = :familyMemberId")
    int reactivateFamilyMember(@Param("familyMemberId") Long familyMemberId);

    // Consent management updates
    @Modifying
    @Transactional
    @Query("UPDATE FamilyMember fm SET fm.consentFormSigned = true, fm.consentSignedDate = :signedDate, fm.consentExpiresDate = :expiresDate WHERE fm.id = :familyMemberId")
    int signConsent(@Param("familyMemberId") Long familyMemberId, @Param("signedDate") LocalDateTime signedDate, @Param("expiresDate") LocalDateTime expiresDate);
    
    @Modifying
    @Transactional
    @Query("UPDATE FamilyMember fm SET fm.hipaaAuthorizationSigned = true, fm.hipaaSignedDate = :signedDate WHERE fm.id = :familyMemberId")
    int signHipaaAuthorization(@Param("familyMemberId") Long familyMemberId, @Param("signedDate") LocalDateTime signedDate);

    // Permission updates
    @Modifying
    @Transactional
    @Query("UPDATE FamilyMember fm SET fm.canViewMedicalRecords = :allowed WHERE fm.id = :familyMemberId")
    int updateMedicalRecordAccess(@Param("familyMemberId") Long familyMemberId, @Param("allowed") Boolean allowed);
    
    @Modifying
    @Transactional
    @Query("UPDATE FamilyMember fm SET fm.canScheduleAppointments = :allowed WHERE fm.id = :familyMemberId")
    int updateAppointmentAccess(@Param("familyMemberId") Long familyMemberId, @Param("allowed") Boolean allowed);
    
    @Modifying
    @Transactional
    @Query("UPDATE FamilyMember fm SET fm.canAccessBilling = :allowed WHERE fm.id = :familyMemberId")
    int updateBillingAccess(@Param("familyMemberId") Long familyMemberId, @Param("allowed") Boolean allowed);

    // Cleanup operations
    @Modifying
    @Transactional
    @Query("UPDATE FamilyMember fm SET fm.isActive = false WHERE fm.verificationStatus = 'PENDING' AND fm.createdAt < :threshold")
    int deactivateOldPendingMembers(@Param("threshold") LocalDateTime threshold);
    
    @Modifying
    @Transactional
    @Query("DELETE FROM FamilyMember fm WHERE fm.isActive = false AND fm.deactivatedDate < :threshold")
    int deleteOldDeactivatedMembers(@Param("threshold") LocalDateTime threshold);

    // Notification queries
    @Query("SELECT fm FROM FamilyMember fm WHERE fm.canReceiveNotifications = true AND fm.isActive = true AND fm.verificationStatus = 'VERIFIED'")
    List<FamilyMember> findEligibleForNotifications();
    
    @Query("SELECT fm FROM FamilyMember fm WHERE fm.patient.id = :patientId AND fm.canReceiveNotifications = true AND fm.email IS NOT NULL AND fm.isActive = true")
    List<FamilyMember> findForEmailNotifications(@Param("patientId") Long patientId);

    // Complex authorization queries
    @Query("SELECT fm FROM FamilyMember fm WHERE fm.patient.id = :patientId AND " +
           "fm.verificationStatus = 'VERIFIED' AND fm.isActive = true AND " +
           "fm.consentFormSigned = true AND (fm.consentExpiresDate IS NULL OR fm.consentExpiresDate > :now) AND " +
           "fm.hipaaAuthorizationSigned = true")
    List<FamilyMember> findFullyAuthorizedMembers(@Param("patientId") Long patientId, @Param("now") LocalDateTime now);
}
