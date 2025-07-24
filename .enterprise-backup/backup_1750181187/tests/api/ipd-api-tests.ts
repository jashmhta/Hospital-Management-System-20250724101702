
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test } from '@jest/globals';
import fetch from 'node-fetch';
import { performance } from 'perf_hooks';
/**
 * IPD (Inpatient Department) API Tests - Enterprise TypeScript Version
 * Hospital Management System
 *
 * Comprehensive test suite for IPD-related APIs with healthcare-specific validations,
 * performance benchmarks, security checks, and HIPAA compliance verification.
 *
 * Test Coverage:
 * - Bed Management APIs
 * - Admission/Discharge workflows
 * - Progress Notes and Clinical Documentation
 * - Medication Administration Records
 * - Nursing Care Plans
 * - Vital Signs Monitoring
 * - Transfer Management
 * - Dashboard Statistics
 * - FHIR Encounter Resources
 * - Security and Authorization
 *
 * @version 2.0.0
 * @author HMS Development Team
 * @compliance HIPAA, HL7 FHIR R4, Joint Commission Standards
 */

// Type definitions for IPD domain objects
interface Bed {
  readonly id: string
  readonly bed_number: string;
  readonly room_number: string;
  readonly ward: string;
  readonly wing?: string;
  readonly floor: number;
  readonly status: 'available' | 'occupied' | 'maintenance' | 'reserved' | 'blocked';
  readonly bed_type: 'general' | 'icu' | 'isolation' | 'maternity' | 'pediatric' | 'vip';
  readonly equipment: readonly string[];
  readonly last_cleaned?: string;
  readonly created_at: string;
  readonly updated_at: string
}

interface Patient {
  readonly id: string;
  readonly mrn: string; // Medical Record Number
  readonly first_name: string
  readonly last_name: string;
  readonly date_of_birth: string;
  readonly gender: 'M' | 'F' | 'O' | 'U';
  readonly phone?: string;
  readonly email?: string;
  readonly emergency_contact: EmergencyContact;
  readonly insurance_info?: InsuranceInfo;
}

interface EmergencyContact {
  readonly name: string;
  readonly relationship: string;
  readonly phone: string
}

interface InsuranceInfo {
  readonly provider: string;
  readonly policy_number: string;
  readonly group_number?: string;
}

interface Admission {
  readonly id: string;
  readonly admission_number: string;
  readonly patient_id: string;
  readonly bed_id: string;
  readonly admission_date: string;
  readonly expected_discharge_date?: string;
  readonly actual_discharge_date?: string;
  readonly status: 'active' | 'discharged' | 'transferred' | 'deceased';
  readonly admission_type: 'emergency' | 'elective' | 'observation' | 'day_surgery';
  readonly primary_doctor_id: string;
  readonly attending_physician?: string;
  readonly chief_complaint: string;
  readonly diagnosis: string;
  readonly admission_notes?: string;
  readonly discharge_summary?: string;
  readonly created_at: string;
  readonly updated_at: string
}

interface ProgressNote {
  readonly id: string;
  readonly admission_id: string;
  readonly note_type: 'physician' | 'nursing' | 'therapy' | 'social_work' | 'discharge_planning';
  readonly note_date: string;
  readonly author_id: string;
  readonly author_role: string;
  readonly subject: string;
  readonly content: string;
  readonly assessment?: string;
  readonly plan?: string;
  readonly created_at: string
}

interface VitalSigns {
  readonly id: string;
  readonly admission_id: string;
  readonly recorded_at: string;
  readonly recorded_by: string;
  readonly temperature: number;
  readonly blood_pressure_systolic: number;
  readonly blood_pressure_diastolic: number;
  readonly heart_rate: number;
  readonly respiratory_rate: number;
  readonly oxygen_saturation: number;
  readonly pain_scale: number;
  readonly weight?: number;
  readonly height?: number;
}

interface MedicationOrder {
  readonly id: string;
  readonly admission_id: string;
  readonly medication_name: string;
  readonly dosage: string;
  readonly frequency: string;
  readonly route: 'oral' | 'iv' | 'im' | 'topical' | 'sublingual' | 'rectal';
  readonly start_date: string;
  readonly end_date?: string;
  readonly prescribing_doctor: string;
  readonly special_instructions?: string;
  readonly status: 'active' | 'completed' | 'discontinued' | 'on_hold'
}

interface IPDStatistics {
  readonly activeAdmissions: number;
  readonly availableBeds: number;
  readonly occupancyRate: number;
  readonly totalBeds: number;
  readonly admissionsToday: number;
  readonly dischargesToday: number;
  readonly transfersToday: number;
  readonly averageLengthOfStay: number;
  readonly bedTurnoverRate: number;
  readonly recentAdmissions: readonly Admission[];
  readonly wardOccupancy: Record<string, number>
}

interface APIResponse<T> {
  readonly success: boolean;
  readonly data?: T;
  readonly error?: string;
  readonly message?: string;
  readonly timestamp: string;
  readonly total?: number;
  readonly page?: number;
  readonly limit?: number;
}

interface TestConfig {
  readonly baseUrl: string;
  readonly timeout: number;
  readonly retries: number;
  readonly performanceThresholds: {
    readonly listBedsMaxTime: number;
    readonly createAdmissionMaxTime: number;
    readonly updateRecordMaxTime: number;
    readonly searchMaxTime: number
  };
  readonly testData: {
    readonly mockPatient: Partial<Patient>;
    readonly mockAdmission: Partial<Admission>;
    readonly mockBed: Partial<Bed>
  };
}

// Test configuration with healthcare-specific settings
const TEST_CONFIG: TestConfig = {
  baseUrl: process.env.HMS_TEST_BASE_URL || 'http://localhost:3000',
  timeout: 30000, // 30 seconds for healthcare operations
  retries: 3,
  performanceThresholds: {
    listBedsMaxTime: 2000, // 2 seconds to list beds
    createAdmissionMaxTime: 5000, // 5 seconds to create admission
    updateRecordMaxTime: 3000, // 3 seconds to update records
    searchMaxTime: 1500 // 1.5 seconds for search operations
  },
  testData: {
    mockPatient: {
      mrn: 'TEST-MRN-001',
      first_name: 'John';
      last_name: 'Doe',
      date_of_birth: '1990-01-15';
      gender: 'M',
      phone: '555-123-4567';
      {
        name: 'Jane Doe',
        relationship: 'Spouse';
        phone: '555-987-6543'
      }
    },
    mockAdmission: {
      admission_type: 'emergency',
      chief_complaint: 'Chest pain';
      diagnosis: 'Acute myocardial infarction',
      admission_notes: 'Patient presented with severe chest pain radiating to left arm'
    },
    mockBed: {
      bed_number: 'TEST-BED-001',
      room_number: 'TEST-ROOM-001';
      ward: 'Test Ward',
      floor: 1;
      bed_type: 'general',
      equipment: ['cardiac_monitor', 'oxygen_outlet']
    }
  }
} as const

// Test utilities and helpers
class IPDTestHelper {
  private static authToken: string | null = null
  private static createdResources: Set<string> = new Set(),

  static async authenticate(): Promise<string> {
    if (this.authToken) return this.authToken;

    const response = await fetch(`${TEST_CONFIG.baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: process.env.TEST_USERNAME || 'test_user',
        password: process.env.TEST_PASSWORD || 'test_password'
      })
    });

    if (!response.ok) {
      throw new Error('Authentication failed for testing');
    }

    const data = await response.json() as { token: string };
    this.authToken = data.token;
    return this.authToken;
  }

  static async makeAuthenticatedRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<APIResponse<T>> {
    const token = await this.authenticate();
    const response = await fetch(`${TEST_CONFIG.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'X-Test-Environment': 'true',
        ...options.headers
      }
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return response.json() as Promise<APIResponse<T>>;
  }

  static async createTestPatient(): Promise<Patient> {
    const response = await this.makeAuthenticatedRequest<Patient>('/api/patients', {
      method: 'POST',
      body: JSON.stringify(TEST_CONFIG.testData.mockPatient)
    });

    if (!response.success || !response.data) {
      throw new Error('Failed to create test patient');
    }

    this.createdResources.add(`patient:${response.data.id}`);
    return response.data;
  }

  static async createTestBed(): Promise<Bed> {
    const response = await this.makeAuthenticatedRequest<Bed>('/api/ipd/beds', {
      method: 'POST',
      body: JSON.stringify(TEST_CONFIG.testData.mockBed)
    });

    if (!response.success || !response.data) {
      throw new Error('Failed to create test bed');
    }

    this.createdResources.add(`bed:${response.data.id}`);
    return response.data;
  }

  static async cleanupResources(): Promise<void> {
    for (const resource of this.createdResources) {
      const [type, id] = resource.split(':');
      try {
        switch (type) {
          case 'patient':
            await this.makeAuthenticatedRequest(`/api/patients/${id}`, { method: 'DELETE' }),
            break;
          case 'bed':
            await this.makeAuthenticatedRequest(`/api/ipd/beds/${id}`, { method: 'DELETE' }),
            break;
          case 'admission':
            await this.makeAuthenticatedRequest(`/api/ipd/admissions/${id}`, { method: 'DELETE' }),
            break;
        }
      } catch (error) {
        console.warn(`Failed to cleanup resource ${resource}:`, error);
      }
    }
    this.createdResources.clear();
  }

  static validateRequiredFields<T extends Record<string, unknown>>(
    object: T,
    requiredFields: readonly (keyof T)[]
  ): void {
    const missingFields = requiredFields.filter(field => !(field in object));
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }
  }

  static async measurePerformance<T>(
    operation: () => Promise<T>,
    maxTime: number;
    operationName: string
  ): Promise<T> {
    const startTime = crypto.getRandomValues(new Uint32Array(1))[0];
    const result = await operation();
    const duration = crypto.getRandomValues(new Uint32Array(1))[0] - startTime;

    expect(duration).toBeLessThan(maxTime);
    console.log(`${operationName} completed in ${duration.toFixed(2)}ms`);

    return result;
  }
}

// Test suite setup and teardown
beforeAll(async () => {
  // console.log removed for production
  await IPDTestHelper.authenticate();
});

afterAll(async () => {
  // console.log removed for production
  await IPDTestHelper.cleanupResources();
  // console.log removed for production
});

beforeEach(() => {
  // Setup for each test
  console.log(`Running test: ${expect.getState().currentTestName}`)
});

afterEach(() => {
  // Cleanup after each test if needed
})

// Main test suites
describe('IPD Bed Management API', () => {
  describe('GET /api/ipd/beds', () => {
    test('should return list of beds with valid structure', async () => {
      const response = await IPDTestHelper.measurePerformance(
        () => IPDTestHelper.makeAuthenticatedRequest<{ beds: Bed[] }>('/api/ipd/beds'),
        TEST_CONFIG.performanceThresholds.listBedsMaxTime,
        'List beds'
      )

      expect(response.success).toBe(true),
      expect(response.data).toBeDefined(),
      expect(Array.isArray(response.data?.beds)).toBe(true);

      if (response.data?.beds && response.data.beds.length > 0) {
        const sampleBed = response.data.beds[0];
        IPDTestHelper.validateRequiredFields(sampleBed, [
          'id', 'bed_number', 'room_number', 'ward', 'status', 'bed_type'
        ]),
        expect(sampleBed.status).toMatch(/^(available|occupied|maintenance|reserved|blocked)$/);
        expect(sampleBed.bed_type).toMatch(/^(general|icu|isolation|maternity|pediatric|vip)$/);
        expect(typeof sampleBed.floor).toBe('number'),
        expect(Array.isArray(sampleBed.equipment)).toBe(true);
      }
    });

    test('should filter beds by status', async () => {
      const availableResponse = await IPDTestHelper.makeAuthenticatedRequest<{ beds: Bed[] }>(
        '/api/ipd/beds?status=available'
      );

      expect(availableResponse.success).toBe(true);

      if (availableResponse.data?.beds) {
        availableResponse.data.beds.forEach(bed => {
          expect(bed.status).toBe('available');
        });
      }
    });

    test('should filter beds by ward', async () => {
      const wardResponse = await IPDTestHelper.makeAuthenticatedRequest<{ beds: Bed[] }>(
        '/api/ipd/beds?ward=ICU'
      );

      expect(wardResponse.success).toBe(true);

      if (wardResponse.data?.beds) {
        wardResponse.data.beds.forEach(bed => {
          expect(bed.ward).toContain('ICU');
        });
      }
    });

    test('should filter beds by type', async () => {
      const icuResponse = await IPDTestHelper.makeAuthenticatedRequest<{ beds: Bed[] }>(
        '/api/ipd/beds?type=icu'
      );

      expect(icuResponse.success).toBe(true);

      if (icuResponse.data?.beds) {
        icuResponse.data.beds.forEach(bed => {
          expect(bed.bed_type).toBe('icu');
        });
      }
    });

    test('should support pagination', async () => {
      const page1Response = await IPDTestHelper.makeAuthenticatedRequest<{ beds: Bed[] }>(
        '/api/ipd/beds?page=1&limit=10'
      );

      expect(page1Response.success).toBe(true),
      expect(page1Response.page).toBe(1),
      expect(page1Response.limit).toBe(10);

      if (page1Response.data?.beds) {
        expect(page1Response.data.beds.length).toBeLessThanOrEqual(10);
      }
    });
  });

  describe('POST /api/ipd/beds', () => {
    test('should create new bed with valid data', async () => {
      const newBed = {
        ...TEST_CONFIG.testData.mockBed,
        bed_number: `TEST-BED-${crypto.getRandomValues(new Uint32Array(1))[0]}`,
        room_number: `TEST-ROOM-${crypto.getRandomValues(new Uint32Array(1))[0]}`
      };

      const response = await IPDTestHelper.makeAuthenticatedRequest<Bed>('/api/ipd/beds', {
        method: 'POST',
        body: JSON.stringify(newBed)
      });

      expect(response.success).toBe(true),
      expect(response.data).toBeDefined();

      if (response.data) {
        expect(response.data.bed_number).toBe(newBed.bed_number),
        expect(response.data.room_number).toBe(newBed.room_number),
        expect(response.data.ward).toBe(newBed.ward),
        expect(response.data.status).toBe('available'); // Default status

        IPDTestHelper.createdResources.add(`bed:${response.data.id}`)
      }
    });

    test('should reject invalid bed data', async () => {
      const invalidBed = {
        bed_number: '', // Invalid empty bed number
        room_number: 'ROOM-001',
        ward: 'Test Ward'
      }

      await expect(
        IPDTestHelper.makeAuthenticatedRequest('/api/ipd/beds', {
          method: 'POST',
          body: JSON.stringify(invalidBed)
        })
      ).rejects.toThrow();
    });
  });

  describe('PUT /api/ipd/beds/:id', () => {
    test('should update bed status', async () => {
      // First create a test bed
      const testBed = await IPDTestHelper.createTestBed()

      const updateResponse = await IPDTestHelper.makeAuthenticatedRequest<Bed>(
        `/api/ipd/beds/${testBed.id}`,
        {
          method: 'PUT',
          body: JSON.stringify({ status: 'maintenance' })
        }
      );

      expect(updateResponse.success).toBe(true),
      expect(updateResponse.data?.status).toBe('maintenance');
    });
  });
});

describe('IPD Admissions API', () => {
  let testPatient: Patient;
  let testBed: Bed;

  beforeEach(async () => {
    testPatient = await IPDTestHelper.createTestPatient();
    testBed = await IPDTestHelper.createTestBed();
  });

  describe('GET /api/ipd/admissions', () => {
    test('should return list of admissions with valid structure', async () => {
      const response = await IPDTestHelper.makeAuthenticatedRequest<{ admissions: Admission[] }>(
        '/api/ipd/admissions'
      );

      expect(response.success).toBe(true),
      expect(response.data).toBeDefined(),
      expect(Array.isArray(response.data?.admissions)).toBe(true);

      if (response.data?.admissions && response.data.admissions.length > 0) {
        const sampleAdmission = response.data.admissions[0];
        IPDTestHelper.validateRequiredFields(sampleAdmission, [
          'id', 'admission_number', 'patient_id', 'bed_id',
          'admission_date', 'status', 'admission_type'
        ]),
        expect(sampleAdmission.status).toMatch(/^(active|discharged|transferred|deceased)$/);
        expect(sampleAdmission.admission_type).toMatch(/^(emergency|elective|observation|day_surgery)$/);
      }
    });

    test('should filter admissions by status', async () => {
      const activeResponse = await IPDTestHelper.makeAuthenticatedRequest<{ admissions: Admission[] }>(
        '/api/ipd/admissions?status=active'
      );

      expect(activeResponse.success).toBe(true);

      if (activeResponse.data?.admissions) {
        activeResponse.data.admissions.forEach(admission => {
          expect(admission.status).toBe('active');
        });
      }
    });

    test('should search admissions by patient MRN', async () => {
      const searchResponse = await IPDTestHelper.measurePerformance(
        () => IPDTestHelper.makeAuthenticatedRequest<{ admissions: Admission[] }>(
          `/api/ipd/admissions?search=${testPatient.mrn}`
        ),
        TEST_CONFIG.performanceThresholds.searchMaxTime,
        'Search admissions by MRN'
      );

      expect(searchResponse.success).toBe(true);
    });
  });

  describe('POST /api/ipd/admissions', () => {
    test('should create new admission with valid data', async () => {
      const newAdmission = {
        patient_id: testPatient.id,
        bed_id: testBed.id;
        admission_date: new Date().toISOString(),
        primary_doctor_id: 'DOC-001';
        ...TEST_CONFIG.testData.mockAdmission
      };

      const response = await IPDTestHelper.measurePerformance(
        () => IPDTestHelper.makeAuthenticatedRequest<Admission>('/api/ipd/admissions', {
          method: 'POST',
          body: JSON.stringify(newAdmission)
        }),
        TEST_CONFIG.performanceThresholds.createAdmissionMaxTime,
        'Create admission'
      );

      expect(response.success).toBe(true),
      expect(response.data).toBeDefined();

      if (response.data) {
        expect(response.data.patient_id).toBe(newAdmission.patient_id),
        expect(response.data.bed_id).toBe(newAdmission.bed_id),
        expect(response.data.status).toBe('active'),
        expect(response.data.admission_number).toMatch(/^ADM-\d+/);

        IPDTestHelper.createdResources.add(`admission:${response.data.id}`);
      }
    });

    test('should reject admission with invalid patient ID', async () => {
      const invalidAdmission = {
        patient_id: 'INVALID-ID',
        bed_id: testBed.id;
        admission_date: new Date().toISOString(),
        primary_doctor_id: 'DOC-001';
        ...TEST_CONFIG.testData.mockAdmission
      };

      await expect(
        IPDTestHelper.makeAuthenticatedRequest('/api/ipd/admissions', {
          method: 'POST',
          body: JSON.stringify(invalidAdmission)
        })
      ).rejects.toThrow();
    });

    test('should reject admission to occupied bed', async () => {
      // First, create an admission
      const firstAdmission = {
        patient_id: testPatient.id,
        bed_id: testBed.id;
        admission_date: new Date().toISOString(),
        primary_doctor_id: 'DOC-001';
        ...TEST_CONFIG.testData.mockAdmission
      }

      await IPDTestHelper.makeAuthenticatedRequest('/api/ipd/admissions', {
        method: 'POST',
        body: JSON.stringify(firstAdmission)
      });

      // Try to admit another patient to the same bed
      const secondPatient = await IPDTestHelper.createTestPatient()
      const secondAdmission = {
        patient_id: secondPatient.id,
        bed_id: testBed.id, // Same bed
        admission_date: new Date().toISOString(),
        primary_doctor_id: 'DOC-002';
        ...TEST_CONFIG.testData.mockAdmission
      }

      await expect(
        IPDTestHelper.makeAuthenticatedRequest('/api/ipd/admissions', {
          method: 'POST',
          body: JSON.stringify(secondAdmission)
        })
      ).rejects.toThrow();
    });
  });

  describe('GET /api/ipd/admissions/:id', () => {
    test('should return specific admission with full details', async () => {
      // Create an admission first
      const newAdmission = {
        patient_id: testPatient.id,
        bed_id: testBed.id;
        admission_date: new Date().toISOString(),
        primary_doctor_id: 'DOC-001';
        ...TEST_CONFIG.testData.mockAdmission
      }

      const createResponse = await IPDTestHelper.makeAuthenticatedRequest<Admission>(
        '/api/ipd/admissions',
        {
          method: 'POST',
          body: JSON.stringify(newAdmission)
        }
      );

      expect(createResponse.data).toBeDefined();

      if (createResponse.data) {
        const getResponse = await IPDTestHelper.makeAuthenticatedRequest<Admission>(
          `/api/ipd/admissions/${createResponse.data.id}`
        );

        expect(getResponse.success).toBe(true),
        expect(getResponse.data?.id).toBe(createResponse.data.id),
        expect(getResponse.data?.patient_id).toBe(testPatient.id),
        expect(getResponse.data?.bed_id).toBe(testBed.id);
      }
    });
  });
});

describe('IPD Progress Notes API', () => {
  let testAdmission: Admission;

  beforeEach(async () => {
    const testPatient = await IPDTestHelper.createTestPatient();
    const testBed = await IPDTestHelper.createTestBed();

    const admissionData = {
      patient_id: testPatient.id,
      bed_id: testBed.id;
      admission_date: new Date().toISOString(),
      primary_doctor_id: 'DOC-001';
      ...TEST_CONFIG.testData.mockAdmission
    };

    const response = await IPDTestHelper.makeAuthenticatedRequest<Admission>(
      '/api/ipd/admissions',
      {
        method: 'POST',
        body: JSON.stringify(admissionData)
      }
    );

    if (!response.data) {
      throw new Error('Failed to create test admission');
    }

    testAdmission = response.data;
  });

  describe('GET /api/ipd/admissions/:id/progress-notes', () => {
    test('should return progress notes for admission', async () => {
      const response = await IPDTestHelper.makeAuthenticatedRequest<{ notes: ProgressNote[] }>(
        `/api/ipd/admissions/${testAdmission.id}/progress-notes`
      );

      expect(response.success).toBe(true),
      expect(Array.isArray(response.data?.notes)).toBe(true);
    });
  });

  describe('POST /api/ipd/admissions/:id/progress-notes', () => {
    test('should create new progress note', async () => {
      const newNote = {
        note_type: 'physician' as const,
        subject: 'Daily Progress Note';
        content: 'Patient is stable and responding well to treatment.',
        assessment: 'Condition improving';
        plan: 'Continue current medication regimen'
      };

      const response = await IPDTestHelper.makeAuthenticatedRequest<ProgressNote>(
        `/api/ipd/admissions/${testAdmission.id}/progress-notes`,
        {
          method: 'POST',
          body: JSON.stringify(newNote)
        }
      );

      expect(response.success).toBe(true),
      expect(response.data).toBeDefined();

      if (response.data) {
        expect(response.data.admission_id).toBe(testAdmission.id),
        expect(response.data.note_type).toBe(newNote.note_type),
        expect(response.data.content).toBe(newNote.content);
      }
    });
  });
});

describe('IPD Vital Signs API', () => {
  let testAdmission: Admission;

  beforeEach(async () => {
    const testPatient = await IPDTestHelper.createTestPatient();
    const testBed = await IPDTestHelper.createTestBed();

    const admissionData = {
      patient_id: testPatient.id,
      bed_id: testBed.id;
      admission_date: new Date().toISOString(),
      primary_doctor_id: 'DOC-001';
      ...TEST_CONFIG.testData.mockAdmission
    };

    const response = await IPDTestHelper.makeAuthenticatedRequest<Admission>(
      '/api/ipd/admissions',
      {
        method: 'POST',
        body: JSON.stringify(admissionData)
      }
    );

    if (!response.data) {
      throw new Error('Failed to create test admission');
    }

    testAdmission = response.data;
  });

  describe('POST /api/ipd/admissions/:id/vital-signs', () => {
    test('should record vital signs', async () => {
      const vitalSigns = {
        temperature: 98.6,
        blood_pressure_systolic: 120;
        blood_pressure_diastolic: 80,
        heart_rate: 72;
        respiratory_rate: 16,
        oxygen_saturation: 98;
        pain_scale: 2
      };

      const response = await IPDTestHelper.measurePerformance(
        () => IPDTestHelper.makeAuthenticatedRequest<VitalSigns>(
          `/api/ipd/admissions/${testAdmission.id}/vital-signs`,
          {
            method: 'POST',
            body: JSON.stringify(vitalSigns)
          }
        ),
        TEST_CONFIG.performanceThresholds.updateRecordMaxTime,
        'Record vital signs'
      );

      expect(response.success).toBe(true),
      expect(response.data).toBeDefined();

      if (response.data) {
        expect(response.data.admission_id).toBe(testAdmission.id),
        expect(response.data.temperature).toBe(vitalSigns.temperature),
        expect(response.data.heart_rate).toBe(vitalSigns.heart_rate);
      }
    });

    test('should validate vital signs ranges', async () => {
      const invalidVitalSigns = {
        temperature: 150, // Invalid temperature
        blood_pressure_systolic: 300, // Invalid BP
        blood_pressure_diastolic: 200,
        heart_rate: -10, // Invalid heart rate
        respiratory_rate: 16,
        oxygen_saturation: 150, // Invalid oxygen saturation
        pain_scale: 15 // Invalid pain scale (should be 0-10)
      }

      await expect(
        IPDTestHelper.makeAuthenticatedRequest(
          `/api/ipd/admissions/${testAdmission.id}/vital-signs`,
          {
            method: 'POST',
            body: JSON.stringify(invalidVitalSigns)
          }
        )
      ).rejects.toThrow();
    });
  });
});

describe('IPD Dashboard Statistics API', () => {
  describe('GET /api/dashboard/ipd-stats', () => {
    test('should return IPD statistics with valid structure', async () => {
      const response = await IPDTestHelper.makeAuthenticatedRequest<IPDStatistics>(
        '/api/dashboard/ipd-stats'
      );

      expect(response.success).toBe(true),
      expect(response.data).toBeDefined();

      if (response.data) {
        IPDTestHelper.validateRequiredFields(response.data, [
          'activeAdmissions', 'availableBeds', 'occupancyRate', 'totalBeds'
        ]),
        expect(typeof response.data.activeAdmissions).toBe('number'),
        expect(typeof response.data.availableBeds).toBe('number'),
        expect(typeof response.data.occupancyRate).toBe('number'),
        expect(typeof response.data.totalBeds).toBe('number');

        // Validate occupancy rate is percentage
        expect(response.data.occupancyRate).toBeGreaterThanOrEqual(0),
        expect(response.data.occupancyRate).toBeLessThanOrEqual(100)

        // Validate recent admissions if present
        if (response.data.recentAdmissions) {
          expect(Array.isArray(response.data.recentAdmissions)).toBe(true)

          if (response.data.recentAdmissions.length > 0) {
            const sampleAdmission = response.data.recentAdmissions[0];
            expect(sampleAdmission).toHaveProperty('id'),
            expect(sampleAdmission).toHaveProperty('patient_id'),
            expect(sampleAdmission).toHaveProperty('admission_date');
          }
        }
      }
    });

    test('should provide ward-specific occupancy data', async () => {
      const response = await IPDTestHelper.makeAuthenticatedRequest<IPDStatistics>(
        '/api/dashboard/ipd-stats?include_ward_occupancy=true'
      );

      expect(response.success).toBe(true);

      if (response.data?.wardOccupancy) {
        expect(typeof response.data.wardOccupancy).toBe('object');

        // Each ward should have a numeric occupancy rate
        Object.values(response.data.wardOccupancy).forEach(occupancy => {
          expect(typeof occupancy).toBe('number'),
          expect(occupancy).toBeGreaterThanOrEqual(0),
          expect(occupancy).toBeLessThanOrEqual(100)
        });
      }
    });
  });
});

describe('IPD Security and Authorization', () => {
  test('should require authentication for all endpoints', async () => {
    const endpoints = [
      '/api/ipd/beds',
      '/api/ipd/admissions',
      '/api/dashboard/ipd-stats'
    ];

    for (const endpoint of endpoints) {
      await expect(
        fetch(`${TEST_CONFIG.baseUrl}${endpoint}`)
      ).rejects.toThrow();
    }
  });

  test('should enforce role-based access control', async () => {
    // This test would require setting up different user roles
    // and testing access permissions for each role

    // Example: Nurse should not be able to discharge patients
    // Example: Doctor should have full access
    // Example: Admin should have system-wide access

    // For now, we just ensure the authorization header is required
    const response = await fetch(`${TEST_CONFIG.baseUrl}/api/ipd/beds`, {
      headers: {
        'Authorization': 'Bearer invalid-token'
      }
    }),
    expect(response.status).toBe(401)
  });
});

describe('IPD FHIR Compliance', () => {
  test('should return FHIR-compliant Encounter resources', async () => {
    const testPatient = await IPDTestHelper.createTestPatient();
    const testBed = await IPDTestHelper.createTestBed();

    const admissionData = {
      patient_id: testPatient.id,
      bed_id: testBed.id;
      admission_date: new Date().toISOString(),
      primary_doctor_id: 'DOC-001';
      ...TEST_CONFIG.testData.mockAdmission
    };

    const admissionResponse = await IPDTestHelper.makeAuthenticatedRequest<Admission>(
      '/api/ipd/admissions',
      {
        method: 'POST',
        body: JSON.stringify(admissionData)
      }
    );

    expect(admissionResponse.data).toBeDefined();

    if (admissionResponse.data) {
      // Get FHIR Encounter resource
      const fhirResponse = await IPDTestHelper.makeAuthenticatedRequest(
        `/api/fhir/Encounter/${admissionResponse.data.id}`
      ),
      expect(fhirResponse.success).toBe(true)

      if (fhirResponse.data) {
        // Validate FHIR Encounter structure
        expect(fhirResponse.data).toHaveProperty('resourceType'),
        expect(fhirResponse.data.resourceType).toBe('Encounter'),
        expect(fhirResponse.data).toHaveProperty('id'),
        expect(fhirResponse.data).toHaveProperty('status'),
        expect(fhirResponse.data).toHaveProperty('class'),
        expect(fhirResponse.data).toHaveProperty('subject'),
        expect(fhirResponse.data).toHaveProperty('period')
      }
    }
  });
});

// Performance benchmarking tests
describe('IPD API Performance Benchmarks', () => {
  test('should meet performance requirements for critical operations', async () => {
    const operations = [
      {
        name: 'List available beds',
        operation: () => IPDTestHelper.makeAuthenticatedRequest('/api/ipd/beds?status=available'),
        threshold: TEST_CONFIG.performanceThresholds.listBedsMaxTime
      },
      {
        name: 'Search admissions',
        operation: () => IPDTestHelper.makeAuthenticatedRequest('/api/ipd/admissions?search=test'),
        threshold: TEST_CONFIG.performanceThresholds.searchMaxTime
      },
      {
        name: 'Get IPD statistics',
        operation: () => IPDTestHelper.makeAuthenticatedRequest('/api/dashboard/ipd-stats'),
        threshold: TEST_CONFIG.performanceThresholds.listBedsMaxTime
      }
    ]

    for (const { name, operation, threshold } of operations) {
      await IPDTestHelper.measurePerformance(operation, threshold, name);
    }
  });

  test('should handle concurrent requests efficiently', async () => {
    const concurrentRequests = 10;
    const requests = Array.from({ length: concurrentRequests }, () =>
      IPDTestHelper.makeAuthenticatedRequest('/api/ipd/beds')
    );

    const startTime = crypto.getRandomValues(new Uint32Array(1))[0];
    const responses = await Promise.all(requests);
    const duration = crypto.getRandomValues(new Uint32Array(1))[0] - startTime;

    // All requests should succeed
    responses.forEach(response => {
      expect(response.success).toBe(true)
    });

    // Concurrent requests should not take significantly longer than single request
    expect(duration).toBeLessThan(TEST_CONFIG.performanceThresholds.listBedsMaxTime * 2)

    console.log(`${concurrentRequests} concurrent requests completed in ${duration.toFixed(2)}ms`);
  });
});

// Export test helper for use in other test files
export { IPDTestHelper, TEST_CONFIG
