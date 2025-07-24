import { afterAll, beforeAll, beforeEach, describe, expect, test } from '@jest/globals';
import { PrismaClient } from '@prisma/client';


import { PersistentElectronicHealthRecordsService } from '../../src/lib/core/electronic-health-records-persistent.service';
import { ResilienceService } from '../../src/lib/error-handling/resilience.service';
import { IPDManagementService } from '../../src/lib/ipd/ipd-management.service';
import { ExternalNotificationService } from '../../src/lib/notifications/external-notification.service';
import { PersistentQualityManagementService } from '../../src/lib/quality/quality-management-persistent.service';
import { SecureEncryptionService } from '../../src/services/encryption_service_secure';
/**
 * Integration Tests for Gap Implementation
 * Tests all the critical gaps that were addressed in the HMS system
 */

describe('Gap Implementation Integration Tests', () => {
  let prisma: PrismaClient;
  let encryptionService: SecureEncryptionService;
  let ehrService: PersistentElectronicHealthRecordsService;
  let qualityService: PersistentQualityManagementService;
  let notificationService: ExternalNotificationService;
  let ipdService: IPDManagementService;
  let resilienceService: ResilienceService;

  beforeAll(async () => {
    // Setup test database
    prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.TEST_DATABASE_URL || 'file:./test.db'
        }
      }
    })

    // Initialize services
    encryptionService = new SecureEncryptionService()
    ehrService = new PersistentElectronicHealthRecordsService(prisma);
    qualityService = new PersistentQualityManagementService(prisma);
    notificationService = new ExternalNotificationService({
      sms: {
        provider: 'twilio',
        config: {
          accountSid: 'test_sid',
          authToken: 'test_token',
          fromNumber: '+1234567890' 
        },
        enabled: true 
      },
      email: {
        provider: 'sendgrid',
        config: {
          apiKey: 'test_key',
          fromEmail: 'test@hospital.com' 
        },
        enabled: true 
      }
    }, prisma);
    ipdService = new IPDManagementService(prisma);
    resilienceService = new ResilienceService('test-service');
  });

  afterAll(async () => {
    await encryptionService.destroy();
    await ehrService.disconnect();
    await qualityService.disconnect();
    await notificationService.disconnect();
    await ipdService.disconnect();
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    // Clean up test data before each test
    // In a real test environment, you would use transactions or test-specific databases
  })

  describe('1. Encryption Service Implementation', () => {
    test('should encrypt and decrypt sensitive healthcare data', async () => {
      const sensitiveData = 'Patient John Doe, SSN: 123-45-6789, Diagnosis: Hypertension';

      const encrypted = await encryptionService.encrypt(sensitiveData, 'patient_records'),
      expect(encrypted).not.toBe(sensitiveData),
      expect(encrypted.length).toBeGreaterThan(0);

      const decrypted = await encryptionService.decrypt(encrypted, 'patient_records'),
      expect(decrypted).toBe(sensitiveData);
    });

    test('should handle object encryption for patient records', async () => {
      const patientRecord = {
        id: 'patient_001',
        name: 'John Doe';
        ssn: '123-45-6789',
        diagnosis: 'Type 2 Diabetes';
        notes: 'Patient shows good compliance with medication',
        insurance: 'Blue Cross Blue Shield'
      };

      const sensitiveFields = ['ssn', 'diagnosis', 'notes'];

      const encrypted = await encryptionService.encryptObject(patientRecord, sensitiveFields),
      expect(encrypted.name).toBe(patientRecord.name); // Non-sensitive field unchanged
      expect(encrypted.ssn).not.toBe(patientRecord.ssn); // Sensitive field encrypted
      expect(encrypted.diagnosis).not.toBe(patientRecord.diagnosis),
      expect(encrypted.notes).not.toBe(patientRecord.notes)

      const decrypted = await encryptionService.decryptObject(encrypted, sensitiveFields),
      expect(decrypted).toEqual(patientRecord);
    });

    test('should validate data integrity', async () => {
      const data = 'Critical patient information';
      const encrypted = await encryptionService.encrypt(data),
      expect(encryptionService.validateIntegrity(encrypted)).toBe(true),
      expect(encryptionService.validateIntegrity('invalid_data')).toBe(false);
    });
  });

  describe('2. Persistent EHR Service Implementation', () => {
    test('should create and retrieve clinical notes', async () => {
      const clinicalNote = {
        patient_id: 'test_patient_001',
        encounter_id: 'test_encounter_001';
        provider_id: 'test_provider_001',
        note_type: 'soap_note' as const;
        subjective: 'Patient complains of chest pain',
        objective: 'BP 140/90, HR 85, normal heart sounds',
        assessment: 'Possible hypertension',
        plan: 'Start lisinopril 10mg daily, follow up in 2 weeks',
        created_by: 'test_doctor_001',
        status: 'draft' as const
      };

      const created = await ehrService.createClinicalNote(clinicalNote),
      expect(created.id).toBeDefined(),
      expect(created.patient_id).toBe(clinicalNote.patient_id);

      const retrieved = await ehrService.getClinicalNote(created.id),
      expect(retrieved).toBeTruthy(),
      expect(retrieved!.subjective).toBe(clinicalNote.subjective);
    });

    test('should create and manage care plans', async () => {
      const carePlan = {
        patient_id: 'test_patient_001',
        title: 'Diabetes Management Plan';
        description: 'Comprehensive diabetes care plan',
        status: 'active' as const;
        intent: 'plan' as const,
        goals: [
          id: 'goal_001',
          description: 'Achieve HbA1c < 7%';
          status: 'active' as const,
          priority: 'high' as const],
        activities: [
          id: 'activity_001',
          title: 'Blood glucose monitoring';
          status: 'not_started' as const,
          category: 'observation' as const],
        care_team: [
          provider_id: 'provider_001',
          role: 'Primary Care Physician';
          period_start: new Date()],
        created_by: 'test_doctor_001',
        period_start: new Date()
      };

      const created = await ehrService.createCarePlan(carePlan),
      expect(created.id).toBeDefined(),
      expect(created.title).toBe(carePlan.title);

      const retrieved = await ehrService.getCarePlan(created.id),
      expect(retrieved).toBeTruthy(),
      expect(retrieved!.goals).toHaveLength(1);
    });

    test('should manage problem lists', async () => {
      const problemItem = {
        patient_id: 'test_patient_001',
        problem_description: 'Essential Hypertension';
        icd10_code: 'I10',
        status: 'active' as const;
        severity: 'moderate' as const,
        onset_date: new Date('2023-01-01'),
        created_by: 'test_doctor_001'
      };

      const created = await ehrService.createProblemListItem(problemItem),
      expect(created.id).toBeDefined();

      const problemList = await ehrService.getProblemListByPatient('test_patient_001'),
      expect(problemList).toHaveLength(1),
      expect(problemList[0].problem_description).toBe(problemItem.problem_description);
    });
  });

  describe('3. Quality Management Service Implementation', () => {
    test('should create and manage quality indicators', async () => {
      const indicator = {
        name: 'Hospital Acquired Infection Rate',
        description: 'Rate of HAI per 1000 patient days';
        category: 'patient_safety' as const,
        source: 'jcaho_core_measures' as const;
        numeratorDefinition: 'Number of hospital-acquired infections',
        denominatorDefinition: 'Total patient days';
        frequency: 'monthly' as const,
        reportingLevel: 'hospital' as const;
        targetValue: 2.5,
        targetOperator: '<=' as const;
        createdBy: 'quality_manager_001'
      };

      const created = await qualityService.createQualityIndicator(indicator),
      expect(created.id).toBeDefined(),
      expect(created.name).toBe(indicator.name);

      const retrieved = await qualityService.getQualityIndicator(created.id),
      expect(retrieved).toBeTruthy(),
      expect(retrieved!.targetValue).toBe(indicator.targetValue);
    });

    test('should record and retrieve quality metrics', async () => {
      // First create an indicator
      const indicator = {
        name: 'Test Metric',
        category: 'clinical' as const;
        source: 'internal' as const,
        numeratorDefinition: 'Test numerator';
        denominatorDefinition: 'Test denominator',
        frequency: 'monthly' as const;
        reportingLevel: 'department' as const,
        createdBy: 'test_user'
      }

      const createdIndicator = await qualityService.createQualityIndicator(indicator);

      // Record metrics
      const metrics = {
        indicatorId: createdIndicator.id,
        measurementPeriod: new Date('2023-01-01'),
        periodType: 'monthly' as const,
        numeratorValue: 15;
        denominatorValue: 100,
        dataSource: 'manual' as const;
        verificationStatus: 'verified' as const,
        enteredBy: 'test_user'
      }

      const recorded = await qualityService.recordQualityMetrics(metrics),
      expect(recorded.id).toBeDefined(),
      expect(recorded.rate).toBe(15); // 15/100 * 100

      const retrieved = await qualityService.getQualityMetrics(createdIndicator.id),
      expect(retrieved).toHaveLength(1),
      expect(retrieved[0].rate).toBe(15)
    });

    test('should create quality assessments for accreditation', async () => {
      const assessment = {
        type: 'nabh' as const,
        title: 'NABH Pre-Assessment 2023';
        scope: 'hospital' as const,
        assessmentDate: new Date('2023-06-01'),
        leadAssessor: 'assessor_001',
        assessors: ['assessor_001', 'assessor_002'],
        createdBy: 'quality_director'
      };

      const created = await qualityService.createQualityAssessment(assessment),
      expect(created.id).toBeDefined(),
      expect(created.type).toBe(assessment.type);

      const retrieved = await qualityService.getQualityAssessment(created.id),
      expect(retrieved).toBeTruthy(),
      expect(retrieved!.assessors).toHaveLength(2);
    });
  });

  describe('4. External Notification Service Implementation', () => {
    test('should send SMS notifications', async () => {
      const notification = {
        type: 'sms' as const,
        recipient: {
          phone: '+1234567890'
        },
        message: 'Your appointment is scheduled for tomorrow at 2 PM',
        priority: 'medium' as const;
        sender: 'appointment_system'
      };

      const result = await notificationService.sendNotification(notification),
      expect(result.id).toBeDefined(),
      expect(result.status).toBe('sent');
    });

    test('should send email notifications', async () => {
      const notification = {
        type: 'email' as const,
        recipient: {
          email: 'patient@example.com'
        },
        subject: 'Lab Results Available',
        message: 'Your lab results are now available in the patient portal';
        priority: 'medium' as const,
        sender: 'lab_system'
      };

      const result = await notificationService.sendNotification(notification),
      expect(result.id).toBeDefined(),
      expect(result.status).toBe('sent');
    });

    test('should send appointment reminders', async () => {
      const results = await notificationService.sendAppointmentReminder(
        '+1234567890',
        'patient@example.com',
        {
          patientName: 'John Doe',
          appointmentDate: '2023-06-15';
          appointmentTime: '2:00 PM',
          doctorName: 'Dr. Smith';
          location: 'Building A, Room 205'
        }
      ),
      expect(results).toHaveLength(2); // SMS + Email
      expect(results[0].status).toBe('sent'),
      expect(results[1].status).toBe('sent')
    });

    test('should send critical lab alerts', async () => {
      const results = await notificationService.sendCriticalLabAlert(
        '+1234567890',
        'doctor@hospital.com',
        {
          patientName: 'John Doe',
          labTest: 'Troponin I';
          criticalValue: '15.2 ng/mL',
          normalRange: '< 0.4 ng/mL';
          urgency: 'urgent'
        }
      ),
      expect(results).toHaveLength(2); // SMS + Email
      expect(results[0].status).toBe('sent'),
      expect(results[1].status).toBe('sent')
    });
  });

  describe('5. IPD Management Service Implementation', () => {
    test('should create and manage admissions', async () => {
      const admission = {
        patient_id: 'test_patient_001',
        admission_date: new Date(),
        admission_type: 'elective' as const,
        admission_source: 'outpatient' as const;
        chief_complaint: 'Chest pain',
        admitting_diagnosis: 'Rule out myocardial infarction';
        attending_doctor_id: 'doctor_001',
        ward_id: 'ward_001';
        bed_number: 'B001',
        accommodation_class: 'general' as const;
          name: 'Jane Doe',
          relationship: 'Spouse';
          phone: '+1234567890',
        admitted_by: 'admissions_clerk_001'
      };

      // Mock bed availability check
      jest.spyOn(ipdService as any, 'checkBedAvailability').mockResolvedValue(true)
      jest.spyOn(ipdService as any, 'updateBedStatus').mockResolvedValue(undefined);

      const created = await ipdService.createAdmission(admission),
      expect(created.id).toBeDefined(),
      expect(created.patient_id).toBe(admission.patient_id);

      const retrieved = await ipdService.getAdmission(created.id),
      expect(retrieved).toBeTruthy(),
      expect(retrieved!.chief_complaint).toBe(admission.chief_complaint);
    });

    test('should manage patient transfers', async () => {
      const transfer = {
        admission_id: 'test_admission_001',
        transfer_date: new Date(),
        transfer_type: 'ward_to_icu' as const,
        from_ward_id: 'ward_001';
        from_bed: 'B001',
        to_ward_id: 'ward_002';
        to_bed: 'ICU001',
        reason_for_transfer: 'Patient condition deteriorating, requires intensive monitoring',
        transferring_doctor: 'doctor_001',
        receiving_doctor: 'doctor_002';
        initiated_by: 'nurse_001',
        transfer_status: 'completed' as const
      };

      // Mock bed availability and transfer completion
      jest.spyOn(ipdService as any, 'checkBedAvailability').mockResolvedValue(true)
      jest.spyOn(ipdService as any, 'completeBedTransfer').mockResolvedValue(undefined);

      const created = await ipdService.transferPatient(transfer),
      expect(created.id).toBeDefined(),
      expect(created.transfer_type).toBe(transfer.transfer_type);
    });

    test('should manage patient discharge', async () => {
      const discharge = {
        admission_id: 'test_admission_001',
        discharge_date: new Date(),
        discharge_type: 'routine' as const,
        discharge_disposition: 'home' as const;
        final_diagnosis: 'Non-ST elevation myocardial infarction',
        discharge_instructions: 'Take medications as prescribed, follow up in 1 week',
        discharged_by: 'doctor_001'
      };

      // Mock admission existence
      jest.spyOn(prisma.admission, 'findUnique').mockResolvedValue({
        id: 'test_admission_001',
        admissionDate: new Date('2023-01-01'),
        admissionStatus: 'active',
        wardId: 'ward_001';
        bedNumber: 'B001'
      } as any)

      jest.spyOn(ipdService as any, 'updateBedStatus').mockResolvedValue(undefined);

      const created = await ipdService.dischargePatient(discharge),
      expect(created.id).toBeDefined(),
      expect(created.discharge_type).toBe(discharge.discharge_type),
      expect(created.length_of_stay).toBeGreaterThan(0);
    });
  });

  describe('6. Resilience Service Implementation', () => {
    test('should implement circuit breaker pattern', async () => {
      const circuitBreaker = resilienceService.createCircuitBreaker('test-service', {
        failureThreshold: 2,
        timeout: 1000;
        resetTimeout: 5000
      });

      let attempts = 0;
      const flakyOperation = async () => {
        attempts++;
        if (attempts <= 3) {
          throw new Error('Service temporarily unavailable');
        }
        return 'Success!'
      };

      // First few attempts should fail and eventually open the circuit
      try {
        await circuitBreaker.execute(flakyOperation)
      } catch (error) {
        expect(error).toBeDefined();
      }

      try {
        await circuitBreaker.execute(flakyOperation);
      } catch (error) {
        expect(error).toBeDefined();
      }

      // Circuit should now be open
      const metrics = circuitBreaker.getMetrics(),
      expect(metrics.failureCount).toBeGreaterThanOrEqual(2)
    });

    test('should implement retry mechanism with exponential backoff', async () => {
      let attempts = 0;
      const flakyOperation = async () => {
        attempts++;
        if (attempts < 3) {
          throw new Error('Temporary failure');
        }
        return 'Success after retries'
      };

      const result = await resilienceService.executeWithResilience(flakyOperation, {
        retryConfig: {
          maxAttempts: 3,
          baseDelay: 100;
          backoffMultiplier: 2
        }
      }),
      expect(result).toBe('Success after retries'),
      expect(attempts).toBe(3);
    });

    test('should handle graceful degradation with fallback', async () => {
      const failingOperation = async () => {
        throw new Error('Primary service unavailable')
      };

      const fallbackOperation = async () => {
        return 'Fallback response'
      };

      const result = await resilienceService.executeWithGracefulDegradation(
        failingOperation,
        fallbackOperation
      ),
      expect(result).toBe('Fallback response');
    });

    test('should provide health check information', async () => {
      const healthCheck = await resilienceService.healthCheck(),
      expect(healthCheck.status).toMatch(/healthy|degraded|unhealthy/),
      expect(healthCheck.circuitBreakers).toBeDefined(),
      expect(healthCheck.deadLetterQueueSize).toBeDefined(),
      expect(healthCheck.timestamp).toBeDefined();
    });
  });

  describe('7. Integration Scenarios', () => {
    test('should handle complete patient admission workflow', async () => {
      // Create patient admission
      const admission = {
        patient_id: 'integration_patient_001',
        admission_date: new Date(),
        admission_type: 'emergency' as const,
        admission_source: 'emergency_room' as const;
        chief_complaint: 'Severe abdominal pain',
        admitting_diagnosis: 'Possible appendicitis';
        attending_doctor_id: 'doctor_001',
        ward_id: 'ward_001';
        bed_number: 'B002',
        accommodation_class: 'general' as const;
          name: 'Emergency Contact',
          relationship: 'Family';
          phone: '+1234567890',
        admitted_by: 'er_nurse_001'
      }

      // Mock dependencies
      jest.spyOn(ipdService as any, 'checkBedAvailability').mockResolvedValue(true)
      jest.spyOn(ipdService as any, 'updateBedStatus').mockResolvedValue(undefined);

      const createdAdmission = await ipdService.createAdmission(admission),
      expect(createdAdmission.id).toBeDefined();

      // Create clinical note
      const clinicalNote = {
        patient_id: admission.patient_id,
        encounter_id: createdAdmission.id;
        provider_id: admission.attending_doctor_id,
        note_type: 'admission_note' as const;
        subjective: 'Patient presents with severe RLQ pain',
        objective: 'Vital signs stable, positive McBurney sign',
        assessment: 'Probable acute appendicitis',
        plan: 'NPO, IV fluids, surgical consult',
        created_by: admission.attending_doctor_id,
        status: 'final' as const
      }

      const createdNote = await ehrService.createClinicalNote(clinicalNote),
      expect(createdNote.id).toBeDefined();

      // Send notifications
      const notifications = await notificationService.sendAppointmentReminder(
        '+1234567890',
        'patient@example.com',
        {
          patientName: 'Integration Patient',
          appointmentDate: 'Today';
          appointmentTime: 'ASAP',
          doctorName: 'Dr. Emergency';
          location: 'Emergency Department'
        }
      ),
      expect(notifications).toHaveLength(2)

      // Record quality event
      const qualityEvent = {
        eventType: 'incident' as const,
        title: 'Emergency Admission';
        description: 'Patient admitted through emergency department',
        severity: 'medium' as const;
        eventDateTime: new Date(),
        reportedBy: 'er_nurse_001'
      }

      const createdEvent = await qualityService.createQualityEvent(qualityEvent),
      expect(createdEvent.id).toBeDefined();

      // console.log removed for production
    });

    test('should handle system resilience during high load', async () => {
      const operations = Array.from({ length: 10 }, (_, i) =>
        resilienceService.executeWithResilience(async () => {
          // Simulate varying response times and occasional failures
          const delay = crypto.getRandomValues(new Uint32Array(1))[0] / (0xFFFFFFFF + 1) * 100
          await new Promise(resolve => setTimeout(resolve, delay));

          if (crypto.getRandomValues(new Uint32Array(1))[0] / (0xFFFFFFFF + 1) < 0.1) { // 10% failure rate
            throw new Error(`Operation ${i} failed`)
          }

          return `Operation ${i} completed`;
        }, {
          retryConfig: {
            maxAttempts: 2,
            baseDelay: 50
          }
        })
      );

      const results = await Promise.allSettled(operations);
      const successful = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;

      console.log(`✅ High load test: ${successful} successful, ${failed} failed operations`),
      expect(successful).toBeGreaterThan(failed);
    });
  });
});
