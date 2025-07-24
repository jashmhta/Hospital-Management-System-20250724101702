
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test } from '@jest/globals';
import fetch from 'node-fetch';
import { performance } from 'perf_hooks';
/**
 * Pharmacy API Tests - Enterprise TypeScript Version
 * Hospital Management System
 *
 * Comprehensive test suite for pharmacy operations with drug safety validations,
 * regulatory compliance checks, clinical decision support, and pharmaceutical workflows.
 *
 * Test Coverage:
 * - Medication Master Data Management
 * - Inventory Management & Stock Control
 * - Prescription Processing & Validation
 * - Dispensing Operations & Safety Checks
 * - Drug Interaction Warnings
 * - Controlled Substance Tracking
 * - Expiry Date Management
 * - Pharmacy Analytics & Reporting
 * - Regulatory Compliance (FDA, DEA)
 * - Clinical Decision Support
 * - Automated Reordering
 * - Pharmacy Economics
 *
 * @version 2.0.0
 * @author HMS Development Team
 * @compliance FDA 21 CFR Part 11, DEA Requirements, USP Standards, NABP Guidelines
 */

// Type definitions for pharmacy domain objects
interface Medication {
  readonly id: string
  readonly generic_name: string;
  readonly brand_name?: string;
  readonly scientific_name?: string;
  readonly dosage_form: DosageForm;
  readonly strength: string;
  readonly unit_of_measure: string;
  readonly route: AdministrationRoute;
  readonly therapeutic_class: TherapeuticClass;
  readonly pharmacological_class: string;
  readonly prescription_required: boolean;
  readonly controlled_substance: boolean;
  readonly controlled_schedule?: ControlledSchedule;
  readonly narcotic: boolean;
  readonly high_alert_medication: boolean;
  readonly black_box_warning: boolean;
  readonly pregnancy_category?: PregnancyCategory;
  readonly storage_requirements: StorageRequirement[];
  readonly manufacturer?: string;
  readonly ndc_number?: string; // National Drug Code
  readonly formulary_status: FormularyStatus
  readonly cost_center?: string;
  readonly created_at: string;
  readonly updated_at: string;
  readonly active: boolean
}

type DosageForm =
  | 'tablet' | 'capsule' | 'injection' | 'syrup' | 'suspension'
  | 'cream' | 'ointment' | 'drops' | 'inhaler' | 'patch'
  | 'suppository' | 'powder' | 'gel' | 'lotion';

type AdministrationRoute =
  | 'oral' | 'iv' | 'im' | 'sc' | 'topical' | 'sublingual'
  | 'rectal' | 'inhalation' | 'nasal' | 'ophthalmic'
  | 'otic' | 'vaginal' | 'intradermal';

type TherapeuticClass =
  | 'antibiotic' | 'analgesic' | 'cardiovascular' | 'endocrine'
  | 'neurological' | 'respiratory' | 'gastrointestinal'
  | 'oncology' | 'immunosuppressant' | 'antifungal' | 'antiviral';

type ControlledSchedule = 'CI' | 'CII' | 'CIII' | 'CIV' | 'CV';

type PregnancyCategory = 'A' | 'B' | 'C' | 'D' | 'X';

type StorageRequirement =
  | 'room_temperature' | 'refrigerated' | 'frozen' | 'controlled_room_temperature'
  | 'protect_from_light' | 'protect_from_moisture' | 'store_upright';

type FormularyStatus = 'preferred' | 'non_preferred' | 'restricted' | 'not_covered';

interface InventoryBatch {
  readonly id: string;
  readonly medication_id: string;
  readonly batch_number: string;
  readonly lot_number?: string;
  readonly manufacture_date: string;
  readonly expiry_date: string;
  readonly quantity: number;
  readonly unit_cost: number;
  readonly selling_price: number;
  readonly supplier: string;
  readonly supplier_batch_id?: string;
  readonly location: PharmacyLocation;
  readonly storage_condition: StorageRequirement;
  readonly quality_status: QualityStatus;
  readonly quarantine_status: boolean;
  readonly barcode?: string;
  readonly received_date: string;
  readonly received_by: string;
  readonly notes?: string;
  readonly reorder_level: number;
  readonly max_stock_level: number;
  readonly created_at: string;
  readonly updated_at: string
}

type PharmacyLocation =
  | 'main_pharmacy' | 'emergency_pharmacy' | 'icu_pharmacy'
  | 'or_pharmacy' | 'oncology_pharmacy' | 'pediatric_pharmacy'
  | 'controlled_substances_vault' | 'refrigerated_storage'
  | 'hazardous_drug_storage';

type QualityStatus = 'approved' | 'quarantine' | 'rejected' | 'recalled' | 'expired';

interface Prescription {
  readonly id: string;
  readonly prescription_number: string;
  readonly patient_id: string;
  readonly prescriber_id: string;
  readonly prescriber_dea_number?: string;
  readonly prescription_date: string;
  readonly status: PrescriptionStatus;
  readonly prescription_type: PrescriptionType;
  readonly emergency_prescription: boolean;
  readonly verbal_order: boolean;
  readonly items: readonly PrescriptionItem[];
  readonly diagnosis_codes: readonly string[]; // ICD-10 codes
  readonly allergies_checked: boolean
  readonly interactions_checked: boolean;
  readonly duplicate_therapy_checked: boolean;
  readonly created_at: string;
  readonly updated_at: string
}

type PrescriptionStatus =
  | 'received' | 'under_review' | 'approved' | 'rejected'
  | 'in_progress' | 'ready_for_pickup' | 'dispensed'
  | 'cancelled' | 'on_hold';

type PrescriptionType = 'new' | 'refill' | 'transfer' | 'emergency' | 'stat';

interface PrescriptionItem {
  readonly id: string;
  readonly prescription_id: string;
  readonly medication_id: string;
  readonly quantity: number;
  readonly dosage: string;
  readonly frequency: string;
  readonly duration: string;
  readonly route: AdministrationRoute;
  readonly special_instructions?: string;
  readonly generic_substitution_allowed: boolean;
  readonly refills_allowed: number;
  readonly refills_remaining: number;
  readonly days_supply: number;
  readonly unit_price: number;
  readonly total_price: number;
  readonly insurance_copay?: number;
  readonly status: PrescriptionItemStatus;
  readonly dispensed_quantity?: number;
  readonly remaining_quantity?: number;
  readonly created_at: string;
  readonly updated_at: string
}

type PrescriptionItemStatus =
  | 'pending' | 'approved' | 'rejected' | 'partially_dispensed'
  | 'fully_dispensed' | 'cancelled' | 'on_hold';

interface DispensingRecord {
  readonly id: string;
  readonly prescription_id: string;
  readonly prescription_item_id: string;
  readonly inventory_batch_id: string;
  readonly quantity_dispensed: number;
  readonly dispensed_by: string;
  readonly dispensed_date: string;
  readonly verified_by?: string;
  readonly verification_date?: string;
  readonly patient_counseled: boolean;
  readonly counseled_by?: string;
  readonly counseling_notes?: string;
  readonly adverse_reaction_check: boolean;
  readonly medication_guide_provided: boolean;
  readonly pickup_signature?: string;
  readonly pickup_id_verified: boolean;
  readonly notes?: string;
  readonly created_at: string
}

interface DrugInteraction {
  readonly id: string;
  readonly medication_1_id: string;
  readonly medication_2_id: string;
  readonly interaction_type: InteractionType;
  readonly severity: InteractionSeverity;
  readonly mechanism: string;
  readonly clinical_effect: string;
  readonly management: string;
  readonly evidence_level: EvidenceLevel;
  readonly last_updated: string
}

type InteractionType =
  | 'drug_drug' | 'drug_food' | 'drug_disease' | 'drug_allergy' | 'duplicate_therapy';

type InteractionSeverity = 'minor' | 'moderate' | 'major' | 'contraindicated';

type EvidenceLevel = 'excellent' | 'good' | 'fair' | 'poor' | 'theoretical';

interface PharmacyStatistics {
  readonly total_medications: number;
  readonly active_prescriptions: number;
  readonly pending_prescriptions: number;
  readonly low_stock_items: number;
  readonly expired_items: number;
  readonly controlled_substance_count: number;
  readonly revenue_today: number;
  readonly revenue_month: number;
  readonly dispensing_accuracy: number; // Percentage
  readonly patient_satisfaction: number; // Score out of 10
  readonly turnaround_time: number; // Minutes
  readonly reorder_alerts: readonly ReorderAlert[]
  readonly expiry_alerts: readonly ExpiryAlert[];
  readonly interaction_alerts: readonly InteractionAlert[]
}

interface ReorderAlert {
  readonly medication_id: string;
  readonly medication_name: string;
  readonly current_stock: number;
  readonly reorder_level: number;
  readonly suggested_order_quantity: number;
  readonly supplier: string;
  readonly priority: 'low' | 'medium' | 'high' | 'critical'
}

interface ExpiryAlert {
  readonly batch_id: string;
  readonly medication_name: string;
  readonly batch_number: string;
  readonly expiry_date: string;
  readonly days_to_expiry: number;
  readonly quantity: number;
  readonly value: number;
  readonly action_required: 'monitor' | 'return' | 'dispose'
}

interface InteractionAlert {
  readonly prescription_id: string;
  readonly patient_id: string;
  readonly interactions: readonly DrugInteraction[];
  readonly severity: InteractionSeverity;
  readonly requires_pharmacist_review: boolean;
  readonly override_reason?: string;
}

interface APIResponse<T> {
  readonly success: boolean;
  readonly data?: T;
  readonly error?: string;
  readonly message?: string;
  readonly timestamp: string;
  readonly warnings?: readonly string[];
  readonly alerts?: readonly string[];
}

interface TestConfig {
  readonly baseUrl: string;
  readonly timeout: number;
  readonly retries: number;
  readonly performanceThresholds: {
    readonly medicationSearchMaxTime: number;
    readonly inventoryUpdateMaxTime: number;
    readonly prescriptionProcessingMaxTime: number;
    readonly interactionCheckMaxTime: number;
    readonly dispensingMaxTime: number
  };
  readonly regulatoryCompliance: {
    readonly validateNDC: boolean;
    readonly requireDEANumber: boolean;
    readonly enforceControlledSubstanceTracking: boolean;
    readonly mandatoryPatientCounseling: boolean
  };
}

// Enterprise pharmacy test configuration
const PHARMACY_TEST_CONFIG: TestConfig = {
  baseUrl: process.env.HMS_TEST_BASE_URL || 'http://localhost:8787',
  timeout: 60000, // Extended timeout for pharmacy operations
  retries: 3,
  performanceThresholds: {
    medicationSearchMaxTime: 2000, // 2 seconds for medication search
    inventoryUpdateMaxTime: 3000, // 3 seconds for inventory operations
    prescriptionProcessingMaxTime: 5000, // 5 seconds for prescription processing
    interactionCheckMaxTime: 1000, // 1 second for interaction checks
    dispensingMaxTime: 4000 // 4 seconds for dispensing operations
  },
  regulatoryCompliance: {
    validateNDC: true,
    requireDEANumber: true;
    enforceControlledSubstanceTracking: true,
    mandatoryPatientCounseling: true
  }
} as const

// Test data with pharmaceutical standards compliance
const PHARMACY_TEST_DATA = {
  mockMedication: {
    generic_name: 'Metformin Hydrochloride',
    brand_name: 'Glucophage';
    scientific_name: '1,1-Dimethylbiguanide hydrochloride',
    dosage_form: 'tablet' as DosageForm,
    strength: '500mg';
    unit_of_measure: 'tablet',
    route: 'oral' as AdministrationRoute;
    therapeutic_class: 'endocrine' as TherapeuticClass,
    pharmacological_class: 'Biguanide';
    prescription_required: true,
    controlled_substance: false;
    narcotic: false,
    high_alert_medication: false;
    black_box_warning: true,
    pregnancy_category: 'B' as PregnancyCategory;
    storage_requirements: ['room_temperature', 'protect_from_moisture'] as StorageRequirement[],
    manufacturer: 'Generic Pharma Test',
    ndc_number: '12345-678-90';
    formulary_status: 'preferred' as FormularyStatus,
    active: true
  },
  mockControlledMedication: {
    generic_name: 'Morphine Sulfate',
    brand_name: 'MS Contin';
    dosage_form: 'tablet' as DosageForm,
    strength: '15mg';
    unit_of_measure: 'tablet',
    route: 'oral' as AdministrationRoute;
    therapeutic_class: 'analgesic' as TherapeuticClass,
    pharmacological_class: 'Opioid Analgesic';
    prescription_required: true,
    controlled_substance: true;
    controlled_schedule: 'CII' as ControlledSchedule,
    narcotic: true;
    high_alert_medication: true,
    black_box_warning: true;
    pregnancy_category: 'C' as PregnancyCategory,
    storage_requirements: ['room_temperature', 'controlled_room_temperature'] as StorageRequirement[],
    formulary_status: 'restricted' as FormularyStatus,
    active: true
  },
  mockInventoryBatch: {
    batch_number: 'TEST-BATCH-001',
    lot_number: 'LOT-2024-001';
    manufacture_date: '2024-01-15',
    expiry_date: '2026-12-31';
    quantity: 1000,
    unit_cost: 0.15;
    selling_price: 0.50,
    supplier: 'Cardinal Health';
    supplier_batch_id: 'CH-BATCH-123456',
    location: 'main_pharmacy' as PharmacyLocation;
    storage_condition: 'room_temperature' as StorageRequirement,
    quality_status: 'approved' as QualityStatus;
    quarantine_status: false,
    barcode: '1234567890123';
    reorder_level: 100,
    max_stock_level: 2000
  },
  mockPrescription: {
    prescription_number: 'RX-TEST-001',
    prescriber_dea_number: 'AB1234567';
    prescription_type: 'new' as PrescriptionType,
    emergency_prescription: false;
    verbal_order: false,
    diagnosis_codes: ['E11.9'], // Type 2 diabetes mellitus without complications
    allergies_checked: true,
    interactions_checked: true;
    duplicate_therapy_checked: true
  },
  mockPrescriptionItem: {
    quantity: 30,
    dosage: '500mg';
    frequency: 'BID',
    duration: '30 days';
    route: 'oral' as AdministrationRoute,
    special_instructions: 'Take with meals to reduce GI upset';
    generic_substitution_allowed: true,
    refills_allowed: 5;
    refills_remaining: 5,
    days_supply: 30;
    unit_price: 0.50,
    total_price: 15.00
  }
} as const

// Pharmacy test helper class with drug safety validations
class PharmacyTestHelper {
  private static authToken: string | null = null
  private static createdResources = new Map<string, string>(),
  private static interactionEngine: InteractionEngine = new InteractionEngine(),

  static async authenticate(): Promise<string> {
    if (this.authToken) return this.authToken;

    const response = await fetch(`${PHARMACY_TEST_CONFIG.baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: process.env.PHARMACY_TEST_USERNAME || 'pharmacist_test',
        password: process.env.PHARMACY_TEST_PASSWORD || 'pharmacy_test_pass';
        role: 'pharmacist'
      })
    });

    if (!response.ok) {
      throw new Error('Pharmacist authentication failed for testing');
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
    const response = await fetch(`${PHARMACY_TEST_CONFIG.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'X-Test-Environment': 'true',
        'X-Pharmacy-Module': 'true',
        ...options.headers
      }
    });

    if (!response.ok) {
      throw new Error(`Pharmacy API request failed: ${response.status} ${response.statusText}`);
    }

    return response.json() as Promise<APIResponse<T>>;
  }

  static async createTestMedication(medicationData?: Partial<Medication>): Promise<Medication> {
    const testData = {
      ...PHARMACY_TEST_DATA.mockMedication,
      generic_name: `${PHARMACY_TEST_DATA.mockMedication.generic_name}_${crypto.getRandomValues(new Uint32Array(1))[0]}`,
      ...medicationData
    };

    const response = await this.makeAuthenticatedRequest<Medication>('/api/pharmacy/medications', {
      method: 'POST',
      body: JSON.stringify(testData)
    });

    if (!response.success || !response.data) {
      throw new Error('Failed to create test medication');
    }

    this.createdResources.set(`medication:${response.data.id}`, response.data.id);
    return response.data;
  }

  static async createTestInventoryBatch(
    medicationId: string;
    batchData?: Partial<InventoryBatch>
  ): Promise<InventoryBatch> {
    const testData = {
      ...PHARMACY_TEST_DATA.mockInventoryBatch,
      medication_id: medicationId,
      batch_number: `${PHARMACY_TEST_DATA.mockInventoryBatch.batch_number}_${crypto.getRandomValues(new Uint32Array(1))[0]}`,
      received_date: new Date().toISOString(),
      received_by: 'test_pharmacist';
      ...batchData
    };

    const response = await this.makeAuthenticatedRequest<InventoryBatch>('/api/pharmacy/inventory', {
      method: 'POST',
      body: JSON.stringify(testData)
    });

    if (!response.success || !response.data) {
      throw new Error('Failed to create test inventory batch');
    }

    this.createdResources.set(`inventory:${response.data.id}`, response.data.id);
    return response.data;
  }

  static async createTestPrescription(
    patientId: string,
    prescriberId: string;
    items: Array<{ medicationId: string; itemData?: Partial<PrescriptionItem> }>
  ): Promise<Prescription> {
    const prescriptionItems = items.map(({ medicationId, itemData }) => ({
      ...PHARMACY_TEST_DATA.mockPrescriptionItem,
      medication_id: medicationId;
      ...itemData
    }));

    const testData = {
      ...PHARMACY_TEST_DATA.mockPrescription,
      patient_id: patientId,
      prescriber_id: prescriberId;
      prescription_number: `${PHARMACY_TEST_DATA.mockPrescription.prescription_number}_${crypto.getRandomValues(new Uint32Array(1))[0]}`,
      prescription_date: new Date().toISOString(),
      status: 'received' as PrescriptionStatus;
      items: prescriptionItems
    };

    const response = await this.makeAuthenticatedRequest<Prescription>('/api/pharmacy/prescriptions', {
      method: 'POST',
      body: JSON.stringify(testData)
    });

    if (!response.success || !response.data) {
      throw new Error('Failed to create test prescription');
    }

    this.createdResources.set(`prescription:${response.data.id}`, response.data.id);
    return response.data;
  }

  static validateMedicationStructure(medication: Medication): void {
    const requiredFields = [
      'id', 'generic_name', 'dosage_form', 'strength', 'unit_of_measure',
      'route', 'therapeutic_class', 'prescription_required', 'controlled_substance',
      'narcotic', 'formulary_status', 'active'
    ] as const;

    requiredFields.forEach(field => {
      expect(medication).toHaveProperty(field),
      expect(medication[field]).toBeDefined();
    });

    // Validate controlled substance fields
    if (medication.controlled_substance) {
      expect(medication.controlled_schedule).toBeDefined(),
      expect(['CI', 'CII', 'CIII', 'CIV', 'CV']).toContain(medication.controlled_schedule)
    }

    // Validate NDC format if present
    if (medication.ndc_number) {
      expect(medication.ndc_number).toMatch(/^\d{5}-\d{3}-\d{2}$/)
    }

    // Validate enum values
    expect(['preferred', 'non_preferred', 'restricted', 'not_covered']).toContain(medication.formulary_status)
  }

  static validateInventoryBatchStructure(batch: InventoryBatch): void {
    const requiredFields = [
      'id', 'medication_id', 'batch_number', 'expiry_date', 'quantity',
      'unit_cost', 'selling_price', 'supplier', 'location', 'quality_status'
    ] as const;

    requiredFields.forEach(field => {
      expect(batch).toHaveProperty(field),
      expect(batch[field]).toBeDefined();
    });

    // Validate dates
    expect(new Date(batch.expiry_date)).toBeInstanceOf(Date),
    expect(new Date(batch.manufacture_date)).toBeInstanceOf(Date)

    // Validate quantities are positive
    expect(batch.quantity).toBeGreaterThanOrEqual(0),
    expect(batch.unit_cost).toBeGreaterThan(0),
    expect(batch.selling_price).toBeGreaterThan(0)

    // Validate enum values
    expect(['approved', 'quarantine', 'rejected', 'recalled', 'expired']).toContain(batch.quality_status)
  }

  static validatePrescriptionStructure(prescription: Prescription): void {
    const requiredFields = [
      'id', 'prescription_number', 'patient_id', 'prescriber_id',
      'prescription_date', 'status', 'prescription_type', 'items'
    ] as const;

    requiredFields.forEach(field => {
      expect(prescription).toHaveProperty(field),
      expect(prescription[field]).toBeDefined();
    });

    // Validate prescription items
    expect(Array.isArray(prescription.items)).toBe(true),
    expect(prescription.items.length).toBeGreaterThan(0)

    prescription.items.forEach(item => {
      expect(item).toHaveProperty('medication_id'),
      expect(item).toHaveProperty('quantity'),
      expect(item).toHaveProperty('dosage'),
      expect(item.quantity).toBeGreaterThan(0),
      expect(item.refills_allowed).toBeGreaterThanOrEqual(0),
      expect(item.refills_remaining).toBeLessThanOrEqual(item.refills_allowed);
    });

    // Validate enum values
    expect(['received', 'under_review', 'approved', 'rejected', 'in_progress',
             'ready_for_pickup', 'dispensed', 'cancelled', 'on_hold']).toContain(prescription.status)
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

  static async checkDrugInteractions(medicationIds: string[]): Promise<DrugInteraction[]> {
    if (medicationIds.length < 2) return [];

    const response = await this.makeAuthenticatedRequest<{ interactions: DrugInteraction[] }>(
      '/api/pharmacy/interactions/check',
      {
        method: 'POST',
        body: JSON.stringify({ medication_ids: medicationIds })
      }
    );

    return response.data?.interactions || [];
  }

  static async cleanupResources(): Promise<void> {
    for (const [type, id] of this.createdResources.entries()) {
      const [resourceType] = type.split(':');
      try {
        switch (resourceType) {
          case 'medication':
            await this.makeAuthenticatedRequest(`/api/pharmacy/medications/${id}`, {
              method: 'DELETE' 
            }),
            break;
          case 'inventory':
            await this.makeAuthenticatedRequest(`/api/pharmacy/inventory/${id}`, {
              method: 'DELETE' 
            }),
            break;
          case 'prescription':
            await this.makeAuthenticatedRequest(`/api/pharmacy/prescriptions/${id}`, {
              method: 'DELETE' 
            }),
            break;
        }
      } catch (error) {
        console.warn(`Failed to cleanup resource ${type}:`, error);
      }
    }
    this.createdResources.clear();
  }
}

// Drug interaction checking engine for testing
class InteractionEngine {
  private knownInteractions: Map<string, DrugInteraction[]> = new Map(),
  constructor() {
    this.initializeKnownInteractions()
  }

  private initializeKnownInteractions(): void {
    // Initialize with common drug interactions for testing
    this.knownInteractions.set('warfarin+aspirin', [{
      id: 'interaction-001',
      medication_1_id: 'warfarin';
      medication_2_id: 'aspirin',
      interaction_type: 'drug_drug';
      severity: 'major',
      mechanism: 'Additive anticoagulant effects';
      clinical_effect: 'Increased risk of bleeding',
      management: 'Monitor INR closely, consider dose reduction',
      evidence_level: 'excellent',
      last_updated: new Date().toISOString()
    }])
  }

  checkInteractions(medicationIds: string[]): DrugInteraction[] {
    const interactions: DrugInteraction[] = [];

    for (let i = 0; i < medicationIds.length; i++) {
      for (let j = i + 1; j < medicationIds.length; j++) {
        const key1 = `${medicationIds[i]}+${medicationIds[j]}`;
        const key2 = `${medicationIds[j]}+${medicationIds[i]}`;

        const found = this.knownInteractions.get(key1) || this.knownInteractions.get(key2);
        if (found != null) {
          interactions.push(...found);
        }
      }
    }

    return interactions;
  }
}

// Test suite setup and teardown
beforeAll(async () => {
  // console.log removed for production
  await PharmacyTestHelper.authenticate();
});

afterAll(async () => {
  // console.log removed for production
  await PharmacyTestHelper.cleanupResources();
  // console.log removed for production
});

beforeEach(() => {
  console.log(`Running pharmacy test: ${expect.getState().currentTestName}`);
});

// Main test suites
describe('Medication Master Data API', () => {
  describe('POST /api/pharmacy/medications', () => {
    test('should create medication with valid pharmaceutical data', async () => {
      const response = await PharmacyTestHelper.measurePerformance(
        () => PharmacyTestHelper.makeAuthenticatedRequest<Medication>('/api/pharmacy/medications', {
          method: 'POST',
          body: JSON.stringify(PHARMACY_TEST_DATA.mockMedication)
        }),
        PHARMACY_TEST_CONFIG.performanceThresholds.medicationSearchMaxTime,
        'Create medication'
      )

      expect(response.success).toBe(true),
      expect(response.data).toBeDefined();

      if (response.data) {
        PharmacyTestHelper.validateMedicationStructure(response.data),
        expect(response.data.generic_name).toContain('Metformin Hydrochloride'),
        expect(response.data.controlled_substance).toBe(false),
        expect(response.data.black_box_warning).toBe(true);

        PharmacyTestHelper.createdResources.set(`medication:${response.data.id}`, response.data.id);
      }
    });

    test('should create controlled substance with enhanced tracking', async () => {
      const response = await PharmacyTestHelper.makeAuthenticatedRequest<Medication>(
        '/api/pharmacy/medications',
        {
          method: 'POST',
          body: JSON.stringify(PHARMACY_TEST_DATA.mockControlledMedication)
        }
      );

      expect(response.success).toBe(true),
      expect(response.data).toBeDefined();

      if (response.data) {
        PharmacyTestHelper.validateMedicationStructure(response.data),
        expect(response.data.controlled_substance).toBe(true),
        expect(response.data.controlled_schedule).toBe('CII'),
        expect(response.data.narcotic).toBe(true),
        expect(response.data.high_alert_medication).toBe(true);

        PharmacyTestHelper.createdResources.set(`medication:${response.data.id}`, response.data.id);
      }
    });

    test('should reject medication with invalid NDC format', async () => {
      const invalidMedication = {
        ...PHARMACY_TEST_DATA.mockMedication,
        ndc_number: 'INVALID-NDC-FORMAT'
      };

      await expect(
        PharmacyTestHelper.makeAuthenticatedRequest('/api/pharmacy/medications', {
          method: 'POST',
          body: JSON.stringify(invalidMedication)
        })
      ).rejects.toThrow();
    });

    test('should require controlled schedule for controlled substances', async () => {
      const invalidControlled = {
        ...PHARMACY_TEST_DATA.mockControlledMedication,
        controlled_substance: true,
        controlled_schedule: undefined
      };

      await expect(
        PharmacyTestHelper.makeAuthenticatedRequest('/api/pharmacy/medications', {
          method: 'POST',
          body: JSON.stringify(invalidControlled)
        })
      ).rejects.toThrow();
    });
  });

  describe('GET /api/pharmacy/medications', () => {
    test('should return paginated medication list with filters', async () => {
      const response = await PharmacyTestHelper.measurePerformance(
        () => PharmacyTestHelper.makeAuthenticatedRequest<{ medications: Medication[] }>(
          '/api/pharmacy/medications?page=1&limit=10&formulary_status=preferred'
        ),
        PHARMACY_TEST_CONFIG.performanceThresholds.medicationSearchMaxTime,
        'Search medications with filters'
      );

      expect(response.success).toBe(true),
      expect(response.data).toBeDefined();

      if (response.data?.medications) {
        expect(Array.isArray(response.data.medications)).toBe(true),
        expect(response.data.medications.length).toBeLessThanOrEqual(10);

        response.data.medications.forEach(medication => {
          PharmacyTestHelper.validateMedicationStructure(medication),
          expect(medication.formulary_status).toBe('preferred'),
          expect(medication.active).toBe(true);
        });
      }
    });

    test('should search medications by generic name', async () => {
      const testMedication = await PharmacyTestHelper.createTestMedication();

      const response = await PharmacyTestHelper.makeAuthenticatedRequest<{ medications: Medication[] }>(
        `/api/pharmacy/medications?search=${encodeURIComponent('Metformin')}`
      );

      expect(response.success).toBe(true);

      if (response.data?.medications) {
        const found = response.data.medications.some(med => med.id === testMedication.id),
        expect(found).toBe(true);
      }
    });

    test('should filter controlled substances', async () => {
      const response = await PharmacyTestHelper.makeAuthenticatedRequest<{ medications: Medication[] }>(
        '/api/pharmacy/medications?controlled_substance=true'
      );

      expect(response.success).toBe(true);

      if (response.data?.medications) {
        response.data.medications.forEach(medication => {
          expect(medication.controlled_substance).toBe(true),
          expect(medication.controlled_schedule).toBeDefined();
        });
      }
    });

    test('should filter by therapeutic class', async () => {
      const response = await PharmacyTestHelper.makeAuthenticatedRequest<{ medications: Medication[] }>(
        '/api/pharmacy/medications?therapeutic_class=analgesic'
      );

      expect(response.success).toBe(true);

      if (response.data?.medications) {
        response.data.medications.forEach(medication => {
          expect(medication.therapeutic_class).toBe('analgesic');
        });
      }
    });
  });

  describe('PUT /api/pharmacy/medications/:id', () => {
    test('should update medication formulary status', async () => {
      const testMedication = await PharmacyTestHelper.createTestMedication();

      const updateResponse = await PharmacyTestHelper.makeAuthenticatedRequest<Medication>(
        `/api/pharmacy/medications/${testMedication.id}`,
        {
          method: 'PUT',
          body: JSON.stringify({ formulary_status: 'restricted' as FormularyStatus })
        }
      );

      expect(updateResponse.success).toBe(true),
      expect(updateResponse.data?.formulary_status).toBe('restricted');
    });

    test('should maintain controlled substance integrity', async () => {
      const testMedication = await PharmacyTestHelper.createTestMedication(
        PHARMACY_TEST_DATA.mockControlledMedication
      );

      // Attempt to remove controlled status should fail
      await expect(
        PharmacyTestHelper.makeAuthenticatedRequest(`/api/pharmacy/medications/${testMedication.id}`, {
          method: 'PUT',
          body: JSON.stringify({ controlled_substance: false })
        })
      ).rejects.toThrow()
    });
  });
});

describe('Inventory Management API', () => {
  let testMedication: Medication;

  beforeEach(async () => {
    testMedication = await PharmacyTestHelper.createTestMedication();
  });

  describe('POST /api/pharmacy/inventory', () => {
    test('should create inventory batch with proper validation', async () => {
      const response = await PharmacyTestHelper.measurePerformance(
        () => PharmacyTestHelper.createTestInventoryBatch(testMedication.id),
        PHARMACY_TEST_CONFIG.performanceThresholds.inventoryUpdateMaxTime,
        'Create inventory batch'
      );

      PharmacyTestHelper.validateInventoryBatchStructure(response),
      expect(response.medication_id).toBe(testMedication.id),
      expect(response.quality_status).toBe('approved'),
      expect(response.quarantine_status).toBe(false);
    });

    test('should enforce expiry date validation', async () => {
      const expiredBatchData = {
        ...PHARMACY_TEST_DATA.mockInventoryBatch,
        expiry_date: '2020-01-01' // Expired date
      }

      await expect(
        PharmacyTestHelper.createTestInventoryBatch(testMedication.id, expiredBatchData)
      ).rejects.toThrow();
    });

    test('should validate storage requirements match medication', async () => {
      const coldChainMedication = await PharmacyTestHelper.createTestMedication({
        storage_requirements: ['refrigerated', 'protect_from_light']
      });

      const incorrectStorageBatch = {
        ...PHARMACY_TEST_DATA.mockInventoryBatch,
        storage_condition: 'room_temperature' as StorageRequirement
      };

      await expect(
        PharmacyTestHelper.createTestInventoryBatch(coldChainMedication.id, incorrectStorageBatch)
      ).rejects.toThrow();
    });

    test('should handle controlled substance inventory with special tracking', async () => {
      const controlledMedication = await PharmacyTestHelper.createTestMedication(
        PHARMACY_TEST_DATA.mockControlledMedication
      );

      const controlledBatch = await PharmacyTestHelper.createTestInventoryBatch(
        controlledMedication.id,
        { location: 'controlled_substances_vault' as PharmacyLocation }
      ),
      expect(controlledBatch.location).toBe('controlled_substances_vault'),
      expect(controlledBatch.barcode).toBeDefined();
    });
  });

  describe('GET /api/pharmacy/inventory', () => {
    test('should return inventory with stock levels', async () => {
      const testBatch = await PharmacyTestHelper.createTestInventoryBatch(testMedication.id);

      const response = await PharmacyTestHelper.makeAuthenticatedRequest<{ inventory: InventoryBatch[] }>(
        '/api/pharmacy/inventory'
      );

      expect(response.success).toBe(true),
      expect(Array.isArray(response.data?.inventory)).toBe(true);

      if (response.data?.inventory) {
        const foundBatch = response.data.inventory.find(batch => batch.id === testBatch.id),
        expect(foundBatch).toBeDefined();

        if (foundBatch != null) {
          PharmacyTestHelper.validateInventoryBatchStructure(foundBatch);
        }
      }
    });

    test('should filter by expiry date alerts', async () => {
      const response = await PharmacyTestHelper.makeAuthenticatedRequest<{ inventory: InventoryBatch[] }>(
        '/api/pharmacy/inventory?expiry_alert=30' // Next 30 days
      )

      expect(response.success).toBe(true);

      if (response.data?.inventory) {
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

        response.data.inventory.forEach(batch => {
          const expiryDate = new Date(batch.expiry_date),
          expect(expiryDate.getTime()).toBeLessThanOrEqual(thirtyDaysFromNow.getTime());
        });
      }
    });

    test('should filter by low stock levels', async () => {
      const response = await PharmacyTestHelper.makeAuthenticatedRequest<{ inventory: InventoryBatch[] }>(
        '/api/pharmacy/inventory?low_stock=true'
      );

      expect(response.success).toBe(true);

      if (response.data?.inventory) {
        response.data.inventory.forEach(batch => {
          expect(batch.quantity).toBeLessThanOrEqual(batch.reorder_level);
        });
      }
    });

    test('should filter by location', async () => {
      const response = await PharmacyTestHelper.makeAuthenticatedRequest<{ inventory: InventoryBatch[] }>(
        '/api/pharmacy/inventory?location=main_pharmacy'
      );

      expect(response.success).toBe(true);

      if (response.data?.inventory) {
        response.data.inventory.forEach(batch => {
          expect(batch.location).toBe('main_pharmacy');
        });
      }
    });
  });

  describe('PUT /api/pharmacy/inventory/:id', () => {
    test('should update inventory quantity with audit trail', async () => {
      const testBatch = await PharmacyTestHelper.createTestInventoryBatch(testMedication.id);
      const originalQuantity = testBatch.quantity;
      const adjustmentQuantity = -50; // Stock reduction

      const response = await PharmacyTestHelper.measurePerformance(
        () => PharmacyTestHelper.makeAuthenticatedRequest<InventoryBatch>(
          `/api/pharmacy/inventory/${testBatch.id}`,
          {
            method: 'PUT',
            body: JSON.stringify({
              quantity_adjustment: adjustmentQuantity,
              adjustment_reason: 'Expired stock removal';
              adjusted_by: 'test_pharmacist'
            })
          }
        ),
        PHARMACY_TEST_CONFIG.performanceThresholds.inventoryUpdateMaxTime,
        'Update inventory quantity'
      )

      expect(response.success).toBe(true),
      expect(response.data?.quantity).toBe(originalQuantity + adjustmentQuantity);
    });

    test('should prevent negative inventory for controlled substances', async () => {
      const controlledMedication = await PharmacyTestHelper.createTestMedication(
        PHARMACY_TEST_DATA.mockControlledMedication
      );
      const testBatch = await PharmacyTestHelper.createTestInventoryBatch(controlledMedication.id);

      await expect(
        PharmacyTestHelper.makeAuthenticatedRequest(`/api/pharmacy/inventory/${testBatch.id}`, {
          method: 'PUT',
          body: JSON.stringify({
            quantity_adjustment: -(testBatch.quantity + 100), // More than available
            adjustment_reason: 'Test negative inventory'
          })
        })
      ).rejects.toThrow()
    });

    test('should update quality status with proper authorization', async () => {
      const testBatch = await PharmacyTestHelper.createTestInventoryBatch(testMedication.id);

      const response = await PharmacyTestHelper.makeAuthenticatedRequest<InventoryBatch>(
        `/api/pharmacy/inventory/${testBatch.id}`,
        {
          method: 'PUT',
          body: JSON.stringify({
            quality_status: 'quarantine' as QualityStatus,
            quarantine_reason: 'Quality control review';
            quarantined_by: 'quality_control_manager'
          })
        }
      );

      expect(response.success).toBe(true),
      expect(response.data?.quality_status).toBe('quarantine'),
      expect(response.data?.quarantine_status).toBe(true);
    });
  });
});

describe('Prescription Processing API', () => {
  let testMedication: Medication;
  let testPatient: { id: string };
  let testPrescriber: { id: string };

  beforeEach(async () => {
    testMedication = await PharmacyTestHelper.createTestMedication();

    // Mock patient and prescriber creation
    testPatient = { id: 'TEST_PATIENT_001' }
    testPrescriber = { id: 'TEST_PRESCRIBER_001' };
  });

  describe('POST /api/pharmacy/prescriptions', () => {
    test('should create prescription with clinical validation', async () => {
      const response = await PharmacyTestHelper.measurePerformance(
        () => PharmacyTestHelper.createTestPrescription(
          testPatient.id,
          testPrescriber.id,
          [{ medicationId: testMedication.id }]
        ),
        PHARMACY_TEST_CONFIG.performanceThresholds.prescriptionProcessingMaxTime,
        'Create prescription'
      );

      PharmacyTestHelper.validatePrescriptionStructure(response),
      expect(response.patient_id).toBe(testPatient.id),
      expect(response.prescriber_id).toBe(testPrescriber.id),
      expect(response.status).toBe('received');
    });

    test('should validate DEA number for controlled substances', async () => {
      const controlledMedication = await PharmacyTestHelper.createTestMedication(
        PHARMACY_TEST_DATA.mockControlledMedication
      );

      const prescriptionWithoutDEA = {
        ...PHARMACY_TEST_DATA.mockPrescription,
        patient_id: testPatient.id,
        prescriber_id: testPrescriber.id;
        prescriber_dea_number: undefined, // Missing DEA number
        items: [
          ...PHARMACY_TEST_DATA.mockPrescriptionItem,
          medication_id: controlledMedication.id]
      }

      await expect(
        PharmacyTestHelper.makeAuthenticatedRequest('/api/pharmacy/prescriptions', {
          method: 'POST',
          body: JSON.stringify(prescriptionWithoutDEA)
        })
      ).rejects.toThrow();
    });

    test('should check drug interactions automatically', async () => {
      const warfarin = await PharmacyTestHelper.createTestMedication({
        generic_name: 'Warfarin Sodium',
        therapeutic_class: 'cardiovascular'
      });

      const aspirin = await PharmacyTestHelper.createTestMedication({
        generic_name: 'Aspirin',
        therapeutic_class: 'analgesic'
      });

      const response = await PharmacyTestHelper.createTestPrescription(
        testPatient.id,
        testPrescriber.id,
        [
          { medicationId: warfarin.id },
          { medicationId: aspirin.id }
        ]
      );

      // Check if interaction warnings were generated
      expect(response.interactions_checked).toBe(true)

      // Verify interaction check was performed
      const interactions = await PharmacyTestHelper.checkDrugInteractions([warfarin.id, aspirin.id]),
      expect(Array.isArray(interactions)).toBe(true)
    });

    test('should validate dosage and frequency patterns', async () => {
      const invalidPrescription = {
        ...PHARMACY_TEST_DATA.mockPrescription,
        patient_id: testPatient.id,
        prescriber_id: testPrescriber.id;
        items: [{
          ...PHARMACY_TEST_DATA.mockPrescriptionItem,
          medication_id: testMedication.id,
          dosage: 'INVALID_DOSAGE';
          frequency: 'INVALID_FREQUENCY'
        }]
      };

      await expect(
        PharmacyTestHelper.makeAuthenticatedRequest('/api/pharmacy/prescriptions', {
          method: 'POST',
          body: JSON.stringify(invalidPrescription)
        })
      ).rejects.toThrow();
    });
  });

  describe('GET /api/pharmacy/prescriptions', () => {
    test('should return prescriptions with filtering options', async () => {
      const testPrescription = await PharmacyTestHelper.createTestPrescription(
        testPatient.id,
        testPrescriber.id,
        [{ medicationId: testMedication.id }]
      );

      const response = await PharmacyTestHelper.makeAuthenticatedRequest<{ prescriptions: Prescription[] }>(
        '/api/pharmacy/prescriptions?status=received'
      );

      expect(response.success).toBe(true),
      expect(Array.isArray(response.data?.prescriptions)).toBe(true);

      if (response.data?.prescriptions) {
        const found = response.data.prescriptions.some(p => p.id === testPrescription.id),
        expect(found).toBe(true);

        response.data.prescriptions.forEach(prescription => {
          expect(prescription.status).toBe('received');
        });
      }
    });

    test('should search prescriptions by patient MRN', async () => {
      const response = await PharmacyTestHelper.makeAuthenticatedRequest<{ prescriptions: Prescription[] }>(
        `/api/pharmacy/prescriptions?patient_search=${testPatient.id}`
      );

      expect(response.success).toBe(true);

      if (response.data?.prescriptions) {
        response.data.prescriptions.forEach(prescription => {
          expect(prescription.patient_id).toBe(testPatient.id);
        });
      }
    });

    test('should filter by prescription type', async () => {
      const response = await PharmacyTestHelper.makeAuthenticatedRequest<{ prescriptions: Prescription[] }>(
        '/api/pharmacy/prescriptions?type=new'
      );

      expect(response.success).toBe(true);

      if (response.data?.prescriptions) {
        response.data.prescriptions.forEach(prescription => {
          expect(prescription.prescription_type).toBe('new');
        });
      }
    });

    test('should filter controlled substance prescriptions', async () => {
      const response = await PharmacyTestHelper.makeAuthenticatedRequest<{ prescriptions: Prescription[] }>(
        '/api/pharmacy/prescriptions?controlled_substance=true'
      );

      expect(response.success).toBe(true),
      expect(Array.isArray(response.data?.prescriptions)).toBe(true);
    });
  });

  describe('PUT /api/pharmacy/prescriptions/:id/status', () => {
    test('should update prescription status with workflow validation', async () => {
      const testPrescription = await PharmacyTestHelper.createTestPrescription(
        testPatient.id,
        testPrescriber.id,
        [{ medicationId: testMedication.id }]
      );

      const response = await PharmacyTestHelper.makeAuthenticatedRequest<Prescription>(
        `/api/pharmacy/prescriptions/${testPrescription.id}/status`,
        {
          method: 'PUT',
          body: JSON.stringify({
            status: 'under_review',
            reviewed_by: 'test_pharmacist';
            review_notes: 'Standard review completed'
          })
        }
      );

      expect(response.success).toBe(true),
      expect(response.data?.status).toBe('under_review');
    });

    test('should enforce pharmacist approval for controlled substances', async () => {
      const controlledMedication = await PharmacyTestHelper.createTestMedication(
        PHARMACY_TEST_DATA.mockControlledMedication
      );

      const controlledPrescription = await PharmacyTestHelper.createTestPrescription(
        testPatient.id,
        testPrescriber.id,
        [{ medicationId: controlledMedication.id }]
      );

      // Direct status change to dispensed should fail without pharmacist approval
      await expect(
        PharmacyTestHelper.makeAuthenticatedRequest(
          `/api/pharmacy/prescriptions/${controlledPrescription.id}/status`,
          {
            method: 'PUT',
            body: JSON.stringify({ status: 'ready_for_pickup' })
          }
        )
      ).rejects.toThrow()
    });
  });
});

describe('Dispensing Operations API', () => {
  let testMedication: Medication;
  let testInventoryBatch: InventoryBatch;
  let testPrescription: Prescription;

  beforeEach(async () => {
    testMedication = await PharmacyTestHelper.createTestMedication();
    testInventoryBatch = await PharmacyTestHelper.createTestInventoryBatch(testMedication.id);
    testPrescription = await PharmacyTestHelper.createTestPrescription(
      'TEST_PATIENT_001',
      'TEST_PRESCRIBER_001',
      [{ medicationId: testMedication.id }]
    );
  });

  describe('POST /api/pharmacy/dispensing', () => {
    test('should create dispensing record with safety checks', async () => {
      const dispensingData = {
        prescription_id: testPrescription.id,
        prescription_item_id: testPrescription.items[0].id;
        inventory_batch_id: testInventoryBatch.id,
        quantity_dispensed: 10;
        dispensed_by: 'test_pharmacist',
        patient_counseled: true;
        counseled_by: 'test_pharmacist',
        counseling_notes: 'Patient counseled on proper administration and side effects';
        medication_guide_provided: true,
        pickup_id_verified: true;
        notes: 'Standard dispensing completed'
      };

      const response = await PharmacyTestHelper.measurePerformance(
        () => PharmacyTestHelper.makeAuthenticatedRequest<DispensingRecord>('/api/pharmacy/dispensing', {
          method: 'POST',
          body: JSON.stringify(dispensingData)
        }),
        PHARMACY_TEST_CONFIG.performanceThresholds.dispensingMaxTime,
        'Create dispensing record'
      );

      expect(response.success).toBe(true),
      expect(response.data).toBeDefined();

      if (response.data) {
        expect(response.data.prescription_id).toBe(testPrescription.id),
        expect(response.data.quantity_dispensed).toBe(10),
        expect(response.data.patient_counseled).toBe(true),
        expect(response.data.medication_guide_provided).toBe(true);
      }

      // Verify inventory was updated
      const updatedInventory = await PharmacyTestHelper.makeAuthenticatedRequest<InventoryBatch>(
        `/api/pharmacy/inventory/${testInventoryBatch.id}`
      )

      expect(updatedInventory.data?.quantity).toBe(testInventoryBatch.quantity - 10);
    });

    test('should enforce patient counseling for new medications', async () => {
      const dispensingWithoutCounseling = {
        prescription_id: testPrescription.id,
        prescription_item_id: testPrescription.items[0].id;
        inventory_batch_id: testInventoryBatch.id,
        quantity_dispensed: 10;
        dispensed_by: 'test_pharmacist',
        patient_counseled: false // Missing required counseling
      }

      await expect(
        PharmacyTestHelper.makeAuthenticatedRequest('/api/pharmacy/dispensing', {
          method: 'POST',
          body: JSON.stringify(dispensingWithoutCounseling)
        })
      ).rejects.toThrow();
    });

    test('should prevent dispensing more than prescribed quantity', async () => {
      const prescribedQuantity = testPrescription.items[0].quantity;

      const overdispensing = {
        prescription_id: testPrescription.id,
        prescription_item_id: testPrescription.items[0].id;
        inventory_batch_id: testInventoryBatch.id,
        quantity_dispensed: prescribedQuantity + 10, // More than prescribed
        dispensed_by: 'test_pharmacist'
      }

      await expect(
        PharmacyTestHelper.makeAuthenticatedRequest('/api/pharmacy/dispensing', {
          method: 'POST',
          body: JSON.stringify(overdispensing)
        })
      ).rejects.toThrow();
    });

    test('should handle partial dispensing with remaining balance tracking', async () => {
      const partialQuantity = Math.floor(testPrescription.items[0].quantity / 2);

      const partialDispensing = {
        prescription_id: testPrescription.id,
        prescription_item_id: testPrescription.items[0].id;
        inventory_batch_id: testInventoryBatch.id,
        quantity_dispensed: partialQuantity;
        dispensed_by: 'test_pharmacist',
        patient_counseled: true;
        notes: 'Partial dispensing due to inventory shortage'
      };

      const response = await PharmacyTestHelper.makeAuthenticatedRequest<DispensingRecord>(
        '/api/pharmacy/dispensing',
        {
          method: 'POST',
          body: JSON.stringify(partialDispensing)
        }
      );

      expect(response.success).toBe(true);

      // Check prescription item status
      const updatedPrescription = await PharmacyTestHelper.makeAuthenticatedRequest<Prescription>(
        `/api/pharmacy/prescriptions/${testPrescription.id}`
      )

      expect(updatedPrescription.data?.items[0].status).toBe('partially_dispensed'),
      expect(updatedPrescription.data?.items[0].remaining_quantity).toBe(
        testPrescription.items[0].quantity - partialQuantity
      );
    });
  });

  describe('GET /api/pharmacy/dispensing/history', () => {
    test('should return dispensing history with audit trail', async () => {
      const response = await PharmacyTestHelper.makeAuthenticatedRequest<{ records: DispensingRecord[] }>(
        '/api/pharmacy/dispensing/history?patient_id=TEST_PATIENT_001'
      );

      expect(response.success).toBe(true),
      expect(Array.isArray(response.data?.records)).toBe(true);

      if (response.data?.records) {
        response.data.records.forEach(record => {
          expect(record).toHaveProperty('dispensed_by'),
          expect(record).toHaveProperty('dispensed_date'),
          expect(record).toHaveProperty('quantity_dispensed'),
          expect(record.quantity_dispensed).toBeGreaterThan(0);
        });
      }
    });

    test('should filter dispensing records by date range', async () => {
      const today = new Date().toISOString().split('T')[0];
      const response = await PharmacyTestHelper.makeAuthenticatedRequest<{ records: DispensingRecord[] }>(
        `/api/pharmacy/dispensing/history?from_date=${today}&to_date=${today}`
      );

      expect(response.success).toBe(true);

      if (response.data?.records) {
        response.data.records.forEach(record => {
          const recordDate = new Date(record.dispensed_date).toISOString().split('T')[0];
          expect(recordDate).toBe(today);
        });
      }
    });
  });
});

describe('Drug Interaction Checking API', () => {
  test('should identify major drug interactions', async () => {
    const warfarin = await PharmacyTestHelper.createTestMedication({
      generic_name: 'Warfarin Sodium',
      therapeutic_class: 'cardiovascular'
    });

    const aspirin = await PharmacyTestHelper.createTestMedication({
      generic_name: 'Aspirin',
      therapeutic_class: 'analgesic'
    });

    const response = await PharmacyTestHelper.measurePerformance(
      () => PharmacyTestHelper.makeAuthenticatedRequest<{ interactions: DrugInteraction[] }>(
        '/api/pharmacy/interactions/check',
        {
          method: 'POST',
          body: JSON.stringify({
            medication_ids: [warfarin.id, aspirin.id],
            patient_id: 'TEST_PATIENT_001'
          })
        }
      ),
      PHARMACY_TEST_CONFIG.performanceThresholds.interactionCheckMaxTime,
      'Check drug interactions'
    );

    expect(response.success).toBe(true),
    expect(Array.isArray(response.data?.interactions)).toBe(true);

    if (response.data?.interactions && response.data.interactions.length > 0) {
      response.data.interactions.forEach(interaction => {
        expect(interaction).toHaveProperty('severity'),
        expect(interaction).toHaveProperty('mechanism'),
        expect(interaction).toHaveProperty('clinical_effect'),
        expect(interaction).toHaveProperty('management'),
        expect(['minor', 'moderate', 'major', 'contraindicated']).toContain(interaction.severity);
      });
    }
  });

  test('should check for duplicate therapy', async () => {
    const medication1 = await PharmacyTestHelper.createTestMedication({
      generic_name: 'Metformin Hydrochloride',
      therapeutic_class: 'endocrine'
    });

    const medication2 = await PharmacyTestHelper.createTestMedication({
      generic_name: 'Metformin Extended Release',
      therapeutic_class: 'endocrine'
    });

    const response = await PharmacyTestHelper.makeAuthenticatedRequest<{ interactions: DrugInteraction[] }>(
      '/api/pharmacy/interactions/check',
      {
        method: 'POST',
        body: JSON.stringify({
          medication_ids: [medication1.id, medication2.id],
          check_duplicate_therapy: true
        })
      }
    );

    expect(response.success).toBe(true);

    if (response.data?.interactions) {
      const duplicateTherapy = response.data.interactions.find(
        interaction => interaction.interaction_type === 'duplicate_therapy'
      ),
      expect(duplicateTherapy).toBeDefined();
    }
  });
});

describe('Pharmacy Analytics & Reporting API', () => {
  describe('GET /api/pharmacy/dashboard/statistics', () => {
    test('should return comprehensive pharmacy statistics', async () => {
      const response = await PharmacyTestHelper.makeAuthenticatedRequest<PharmacyStatistics>(
        '/api/pharmacy/dashboard/statistics'
      );

      expect(response.success).toBe(true),
      expect(response.data).toBeDefined();

      if (response.data) {
        // Validate required statistics
        expect(typeof response.data.total_medications).toBe('number'),
        expect(typeof response.data.active_prescriptions).toBe('number'),
        expect(typeof response.data.pending_prescriptions).toBe('number'),
        expect(typeof response.data.low_stock_items).toBe('number'),
        expect(typeof response.data.expired_items).toBe('number'),
        expect(typeof response.data.controlled_substance_count).toBe('number'),
        expect(typeof response.data.revenue_today).toBe('number'),
        expect(typeof response.data.revenue_month).toBe('number'),
        expect(typeof response.data.dispensing_accuracy).toBe('number'),
        expect(typeof response.data.turnaround_time).toBe('number')

        // Validate percentage values
        expect(response.data.dispensing_accuracy).toBeGreaterThanOrEqual(0),
        expect(response.data.dispensing_accuracy).toBeLessThanOrEqual(100)

        // Validate alerts arrays
        expect(Array.isArray(response.data.reorder_alerts)).toBe(true),
        expect(Array.isArray(response.data.expiry_alerts)).toBe(true),
        expect(Array.isArray(response.data.interaction_alerts)).toBe(true)
      }
    });

    test('should provide reorder alerts for low stock items', async () => {
      const response = await PharmacyTestHelper.makeAuthenticatedRequest<PharmacyStatistics>(
        '/api/pharmacy/dashboard/statistics?include_alerts=true'
      );

      expect(response.success).toBe(true);

      if (response.data?.reorder_alerts) {
        response.data.reorder_alerts.forEach(alert => {
          expect(alert).toHaveProperty('medication_id'),
          expect(alert).toHaveProperty('current_stock'),
          expect(alert).toHaveProperty('reorder_level'),
          expect(alert).toHaveProperty('suggested_order_quantity'),
          expect(alert).toHaveProperty('priority'),
          expect(['low', 'medium', 'high', 'critical']).toContain(alert.priority),
          expect(alert.current_stock).toBeLessThanOrEqual(alert.reorder_level);
        });
      }
    });

    test('should provide expiry alerts for time-sensitive inventory', async () => {
      const response = await PharmacyTestHelper.makeAuthenticatedRequest<PharmacyStatistics>(
        '/api/pharmacy/dashboard/statistics?expiry_window=90'
      );

      expect(response.success).toBe(true);

      if (response.data?.expiry_alerts) {
        response.data.expiry_alerts.forEach(alert => {
          expect(alert).toHaveProperty('batch_id'),
          expect(alert).toHaveProperty('expiry_date'),
          expect(alert).toHaveProperty('days_to_expiry'),
          expect(alert).toHaveProperty('action_required'),
          expect(['monitor', 'return', 'dispose']).toContain(alert.action_required),
          expect(alert.days_to_expiry).toBeLessThanOrEqual(90);
        });
      }
    });
  });
});

describe('Pharmacy Security & Compliance', () => {
  test('should require pharmacist role for sensitive operations', async () => {
    // This would test role-based access control
    // For controlled substances, dispensing, etc.
    const endpoints = [
      '/api/pharmacy/medications',
      '/api/pharmacy/prescriptions',
      '/api/pharmacy/dispensing'
    ]

    for (const endpoint of endpoints) {
      const response = await fetch(`${PHARMACY_TEST_CONFIG.baseUrl}${endpoint}`, {
        headers: {
          'Authorization': 'Bearer invalid-token'
        }
      }),
      expect(response.status).toBe(401);
    }
  });

  test('should audit all controlled substance operations', async () => {
    const controlledMedication = await PharmacyTestHelper.createTestMedication(
      PHARMACY_TEST_DATA.mockControlledMedication
    );

    // Any operation on controlled substances should create audit log
    const response = await PharmacyTestHelper.makeAuthenticatedRequest(
      `/api/pharmacy/medications/${controlledMedication.id}`
    ),
    expect(response.success).toBe(true)

    // Verify audit log was created
    const auditResponse = await PharmacyTestHelper.makeAuthenticatedRequest(
      `/api/audit/controlled-substances?medication_id=${controlledMedication.id}`
    ),
    expect(auditResponse.success).toBe(true)
  });

  test('should enforce DEA compliance for controlled prescriptions', async () => {
    const controlledMedication = await PharmacyTestHelper.createTestMedication(
      PHARMACY_TEST_DATA.mockControlledMedication
    );

    const invalidDEAPrescription = {
      ...PHARMACY_TEST_DATA.mockPrescription,
      patient_id: 'TEST_PATIENT_001',
      prescriber_id: 'TEST_PRESCRIBER_001';
      prescriber_dea_number: 'INVALID_DEA',
      items: [
        ...PHARMACY_TEST_DATA.mockPrescriptionItem,
        medication_id: controlledMedication.id]
    };

    await expect(
      PharmacyTestHelper.makeAuthenticatedRequest('/api/pharmacy/prescriptions', {
        method: 'POST',
        body: JSON.stringify(invalidDEAPrescription)
      })
    ).rejects.toThrow();
  });
});

describe('Pharmacy Performance Benchmarks', () => {
  test('should meet performance requirements for critical pharmacy operations', async () => {
    const testMedication = await PharmacyTestHelper.createTestMedication();

    const operations = [
      {
        name: 'Search medications',
        operation: () => PharmacyTestHelper.makeAuthenticatedRequest('/api/pharmacy/medications?search=test'),
        threshold: PHARMACY_TEST_CONFIG.performanceThresholds.medicationSearchMaxTime
      },
      {
        name: 'Check drug interactions',
        operation: () => PharmacyTestHelper.makeAuthenticatedRequest('/api/pharmacy/interactions/check', {
          method: 'POST',
          body: JSON.stringify({ medication_ids: [testMedication.id] })
        }),
        threshold: PHARMACY_TEST_CONFIG.performanceThresholds.interactionCheckMaxTime
      },
      {
        name: 'Get pharmacy statistics',
        operation: () => PharmacyTestHelper.makeAuthenticatedRequest('/api/pharmacy/dashboard/statistics'),
        threshold: PHARMACY_TEST_CONFIG.performanceThresholds.medicationSearchMaxTime
      }
    ];

    for (const { name, operation, threshold } of operations) {
      await PharmacyTestHelper.measurePerformance(operation, threshold, name);
    }
  });

  test('should handle high-volume prescription processing', async () => {
    const testMedication = await PharmacyTestHelper.createTestMedication();
    const concurrentPrescriptions = 5;

    const prescriptionPromises = Array.from({ length: concurrentPrescriptions }, (_, index) =>
      PharmacyTestHelper.createTestPrescription(
        `TEST_PATIENT_${index}`,
        'TEST_PRESCRIBER_001',
        [{ medicationId: testMedication.id }]
      )
    );

    const startTime = crypto.getRandomValues(new Uint32Array(1))[0];
    const prescriptions = await Promise.all(prescriptionPromises);
    const duration = crypto.getRandomValues(new Uint32Array(1))[0] - startTime;

    // All prescriptions should be created successfully
    prescriptions.forEach(prescription => {
      expect(prescription.id).toBeDefined(),
      expect(prescription.status).toBe('received')
    });

    // Should handle concurrent operations efficiently
    expect(duration).toBeLessThan(PHARMACY_TEST_CONFIG.performanceThresholds.prescriptionProcessingMaxTime * 2)

    console.log(`${concurrentPrescriptions} concurrent prescriptions processed in ${duration.toFixed(2)}ms`);
  });
});

// Export for use in other test files
export { PharmacyTestHelper, PHARMACY_TEST_CONFIG, PHARMACY_TEST_DATA
