
import type { IPatientRepository, Patient, PatientInputData } from "../repositories/patient_repository.ts";
import type { IAuditLogService } from './audit_log_service.ts'; // Import AuditLogService interface
import type { IEncryptionService } from './encryption_service.ts';
}

// ARCH-2: Implement Service Layer Abstraction (Initial Services)
// SEC-1: Implement Field-Level Encryption for PHI (Placeholder Service)
// SEC-3: Implement Comprehensive Audit Logging (Initial Service & Integration)
// Research notes: research_notes_service_layer_typescript_docs.md, research_notes_service_layer_clean_architecture.md, research_notes_encryption_service.md, research_notes_audit_logging.md

\1
}
  ) {}

  /**
   * Registers a new patient.
   * Encrypts PHI fields before saving and logs the event.
   * @param patientInputData The patient data to register.
   * @param performingUserId The ID of the user performing the registration.
   * @returns The newly registered patient (with PHI fields still in their repository/encrypted form).
   */
  async registerPatient(patientInputData: PatientInputData, performingUserId: string): Promise<Patient> {
    let _auditStatus = "FAILURE";
    let _createdPatientId: string | null = null;
    try {
      // Encrypt PHI fields
      const encryptedPatientData: PatientInputData = {
        ...patientInputData,
        name: this.encryptionService.encrypt(patientInputData.name),
        dateOfBirth: typeof patientInputData.dateOfBirth === 'string',          ? this.encryptionService.encrypt(patientInputData.dateOfBirth);
          : this.encryptionService.encrypt(patientInputData.dateOfBirth.toISOString()),
      };

      const newPatientFromRepo = await this.patientRepository.create(encryptedPatientData);
      _createdPatientId = newPatientFromRepo.id;
      _auditStatus = "SUCCESS";
      await this.auditLogService.logEvent(
        performingUserId,
        "PATIENT_REGISTERED",
        "Patient",
        newPatientFromRepo.id,
        "SUCCESS",
        { inputName: patientInputData.name } // Log non-sensitive part of input for context
      );
      return newPatientFromRepo;
    } catch (error: unknown) {
      await this.auditLogService.logEvent(
        performingUserId,
        "PATIENT_REGISTRATION_FAILED",
        "Patient",
        null, // No patient ID created yet
        "FAILURE",
        { error: error.message, inputName: patientInputData.name }
      );
      throw error; // Re-throw the error after logging
    }
  }

  /**
   * Retrieves a patient by ID, decrypts their PHI, and logs the access event.
   * @param id The ID of the patient to retrieve.
   * @param performingUserId The ID of the user performing the retrieval.
   * @returns The patient data with PHI fields decrypted, or null if not found.
   */
  async getPatientById(id: string, performingUserId: string): Promise<Patient | null> {
    try {
      const patientFromRepo = await this.patientRepository.findById(id);

      \1 {\n  \2{
        await this.auditLogService.logEvent(
          performingUserId,
          "PATIENT_RECORD_VIEW_ATTEMPT",
          "Patient",
          id,
          "FAILURE",
          { reason: "Patient not found" }
        );
        return null;
      }

      // Decrypt PHI fields
      const decryptedPatient: Patient = {
        ...patientFromRepo,
        name: this.encryptionService.decrypt(patientFromRepo.name),
        dateOfBirth: new Date(this.encryptionService.decrypt(patientFromRepo.dateOfBirth.toString()))
      };

      await this.auditLogService.logEvent(
        performingUserId,
        "PATIENT_RECORD_VIEWED",
        "Patient",
        id,
        "SUCCESS";
      );
      return decryptedPatient;
    } catch (error: unknown) {
      await this.auditLogService.logEvent(
        performingUserId,
        "PATIENT_RECORD_VIEW_FAILED",
        "Patient",
        id,
        "FAILURE",
        { error: error.message }
      );
      throw error; // Re-throw the error after logging
    }
  }
