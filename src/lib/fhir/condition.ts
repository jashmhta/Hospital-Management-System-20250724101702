/**
 * FHIR R4 Condition Resource Implementation
 * Based on HL7 FHIR R4 Condition Resource specification
 * Handles diagnoses, medical conditions, problems, health concerns
 * Source: ZIP 6 - FHIR R4 data models for hospital management system microservices
 */

import {
  FHIRBase,
  FHIRIdentifier,
  FHIRCodeableConcept,
  FHIRReference,
  FHIRPeriod,
  FHIRAge,
  FHIRRange,
  FHIRAnnotation
} from './types';

export interface FHIRConditionStage {
  summary?: FHIRCodeableConcept;
  assessment?: FHIRReference[];
  type?: FHIRCodeableConcept;
}

export interface FHIRConditionEvidence {
  code?: FHIRCodeableConcept[];
  detail?: FHIRReference[];
}

export interface FHIRCondition extends FHIRBase {
  resourceType: 'Condition';
  identifier?: FHIRIdentifier[];
  clinicalStatus?: FHIRCodeableConcept;
  verificationStatus?: FHIRCodeableConcept;
  category?: FHIRCodeableConcept[];
  severity?: FHIRCodeableConcept;
  code?: FHIRCodeableConcept;
  bodySite?: FHIRCodeableConcept[];
  subject: FHIRReference; // Patient | Group
  encounter?: FHIRReference;
  onset?: string | FHIRAge | FHIRPeriod | FHIRRange;
  abatement?: string | FHIRAge | FHIRPeriod | FHIRRange | boolean;
  recordedDate?: string;
  recorder?: FHIRReference;
  asserter?: FHIRReference;
  stage?: FHIRConditionStage[];
  evidence?: FHIRConditionEvidence[];
  note?: FHIRAnnotation[];
}

// Condition Search Parameters
export interface FHIRConditionSearchParams {
  _id?: string;
  identifier?: string;
  patient?: string;
  subject?: string;
  encounter?: string;
  code?: string;
  category?: string;
  'clinical-status'?: string;
  'verification-status'?: string;
  severity?: string;
  'onset-date'?: string;
  'recorded-date'?: string;
  asserter?: string;
  _count?: number;
  _offset?: number;
  _sort?: string;
}

// Helper functions for FHIR Condition operations
export class FHIRConditionUtils {
  /**
   * Create a basic condition/diagnosis
   */
  static createBasicCondition(data: {
    patientId: string;
    practitionerId: string;
    encounterId?: string;
    conditionCode: string;
    conditionDisplay: string;
    category?: 'problem-list-item' | 'encounter-diagnosis';
    clinicalStatus?: 'active' | 'recurrence' | 'relapse' | 'inactive' | 'remission' | 'resolved';
    verificationStatus?: 'unconfirmed' | 'provisional' | 'differential' | 'confirmed' | 'refuted' | 'entered-in-error';
    severity?: 'mild' | 'moderate' | 'severe';
    onsetDate?: string;
    recordedDate?: string;
    notes?: string;
  }): FHIRCondition {
    const condition: FHIRCondition = {
      resourceType: 'Condition',
      clinicalStatus: {
        coding: [{
          system: 'http://terminology.hl7.org/CodeSystem/condition-clinical',
          code: data.clinicalStatus || 'active',
          display: (data.clinicalStatus || 'active').charAt(0).toUpperCase() + (data.clinicalStatus || 'active').slice(1)
        }]
      },
      verificationStatus: {
        coding: [{
          system: 'http://terminology.hl7.org/CodeSystem/condition-ver-status',
          code: data.verificationStatus || 'confirmed',
          display: (data.verificationStatus || 'confirmed').charAt(0).toUpperCase() + (data.verificationStatus || 'confirmed').slice(1)
        }]
      },
      category: [{
        coding: [{
          system: 'http://terminology.hl7.org/CodeSystem/condition-category',
          code: data.category || 'encounter-diagnosis',
          display: data.category === 'problem-list-item' ? 'Problem List Item' : 'Encounter Diagnosis'
        }]
      }],
      code: {
        coding: [{
          system: 'http://snomed.info/sct',
          code: data.conditionCode,
          display: data.conditionDisplay
        }]
      },
      subject: {
        reference: `Patient/${data.patientId}`,
        type: 'Patient'
      },
      asserter: {
        reference: `Practitioner/${data.practitionerId}`,
        type: 'Practitioner'
      },
      recordedDate: data.recordedDate || new Date().toISOString()
    };

    // Add encounter if provided
    if (data.encounterId) {
      condition.encounter = {
        reference: `Encounter/${data.encounterId}`,
        type: 'Encounter'
      };
    }

    // Add severity if provided
    if (data.severity) {
      condition.severity = {
        coding: [{
          system: 'http://snomed.info/sct',
          code: this.getSeverityCode(data.severity),
          display: data.severity.charAt(0).toUpperCase() + data.severity.slice(1)
        }]
      };
    }

    // Add onset date if provided
    if (data.onsetDate) {
      condition.onset = data.onsetDate;
    }

    // Add notes if provided
    if (data.notes) {
      condition.note = [{
        text: data.notes,
        time: new Date().toISOString()
      }];
    }

    return condition;
  }

  /**
   * Create a chronic condition
   */
  static createChronicCondition(data: {
    patientId: string;
    practitionerId: string;
    conditionCode: string;
    conditionDisplay: string;
    onsetDate: string;
    severity?: 'mild' | 'moderate' | 'severe';
    managementNotes?: string;
  }): FHIRCondition {
    return this.createBasicCondition({
      ...data,
      category: 'problem-list-item',
      clinicalStatus: 'active',
      verificationStatus: 'confirmed',
      recordedDate: new Date().toISOString(),
      notes: data.managementNotes
    });
  }

  /**
   * Create an acute condition
   */
  static createAcuteCondition(data: {
    patientId: string;
    practitionerId: string;
    encounterId: string;
    conditionCode: string;
    conditionDisplay: string;
    severity?: 'mild' | 'moderate' | 'severe';
    onsetDate?: string;
    clinicalNotes?: string;
  }): FHIRCondition {
    return this.createBasicCondition({
      ...data,
      category: 'encounter-diagnosis',
      clinicalStatus: 'active',
      verificationStatus: 'confirmed',
      recordedDate: new Date().toISOString(),
      notes: data.clinicalNotes
    });
  }

  /**
   * Create a resolved condition
   */
  static createResolvedCondition(data: {
    patientId: string;
    practitionerId: string;
    conditionCode: string;
    conditionDisplay: string;
    onsetDate: string;
    abatementDate: string;
    resolutionNotes?: string;
  }): FHIRCondition {
    const condition = this.createBasicCondition({
      ...data,
      category: 'problem-list-item',
      clinicalStatus: 'resolved',
      verificationStatus: 'confirmed',
      recordedDate: new Date().toISOString(),
      notes: data.resolutionNotes
    });

    condition.abatement = data.abatementDate;
    return condition;
  }

  /**
   * Get severity code for SNOMED CT
   */
  private static getSeverityCode(severity: string): string {
    const severityCodes: Record<string, string> = {
      'mild': '255604002',
      'moderate': '6736007',
      'severe': '24484000'
    };
    return severityCodes[severity] || '255604002';
  }

  /**
   * Get patient ID from condition
   */
  static getPatientId(condition: FHIRCondition): string | undefined {
    return condition.subject?.reference?.replace('Patient/', '');
  }

  /**
   * Get condition display name
   */
  static getConditionDisplay(condition: FHIRCondition): string {
    return condition.code?.coding?.[0]?.display || condition.code?.text || 'Unknown Condition';
  }

  /**
   * Get clinical status display
   */
  static getClinicalStatusDisplay(condition: FHIRCondition): string {
    return condition.clinicalStatus?.coding?.[0]?.display || 'Unknown';
  }

  /**
   * Get verification status display
   */
  static getVerificationStatusDisplay(condition: FHIRCondition): string {
    return condition.verificationStatus?.coding?.[0]?.display || 'Unknown';
  }

  /**
   * Get category display
   */
  static getCategoryDisplay(condition: FHIRCondition): string {
    return condition.category?.[0]?.coding?.[0]?.display || 'Unknown';
  }

  /**
   * Get severity display
   */
  static getSeverityDisplay(condition: FHIRCondition): string {
    return condition.severity?.coding?.[0]?.display || 'Not specified';
  }

  /**
   * Check if condition is active
   */
  static isActive(condition: FHIRCondition): boolean {
    const clinicalStatus = condition.clinicalStatus?.coding?.[0]?.code;
    return clinicalStatus === 'active' || clinicalStatus === 'recurrence' || clinicalStatus === 'relapse';
  }

  /**
   * Check if condition is chronic
   */
  static isChronic(condition: FHIRCondition): boolean {
    const category = condition.category?.[0]?.coding?.[0]?.code;
    return category === 'problem-list-item';
  }

  /**
   * Get onset date
   */
  static getOnsetDate(condition: FHIRCondition): Date | null {
    if (typeof condition.onset === 'string') {
      return new Date(condition.onset);
    }
    if (typeof condition.onset === 'object' && 'start' in condition.onset && condition.onset.start) {
      return new Date(condition.onset.start);
    }
    return null;
  }

  /**
   * Get abatement date
   */
  static getAbatementDate(condition: FHIRCondition): Date | null {
    if (typeof condition.abatement === 'string') {
      return new Date(condition.abatement);
    }
    if (typeof condition.abatement === 'object' && 'start' in condition.abatement && condition.abatement.start) {
      return new Date(condition.abatement.start);
    }
    return null;
  }

  /**
   * Get recorded date
   */
  static getRecordedDate(condition: FHIRCondition): Date | null {
    return condition.recordedDate ? new Date(condition.recordedDate) : null;
  }

  /**
   * Calculate condition duration
   */
  static getConditionDuration(condition: FHIRCondition): number | null {
    const onsetDate = this.getOnsetDate(condition);
    if (!onsetDate) return null;

    const endDate = this.getAbatementDate(condition) || new Date();
    return Math.floor((endDate.getTime() - onsetDate.getTime()) / (1000 * 60 * 60 * 24)); // days
  }

  /**
   * Format condition for display
   */
  static formatForDisplay(condition: FHIRCondition): {
    condition: string;
    clinicalStatus: string;
    verificationStatus: string;
    category: string;
    severity: string;
    onsetDate?: string;
    duration?: string;
    isActive: boolean;
    isChronic: boolean;
  } {
    const onsetDate = this.getOnsetDate(condition);
    const duration = this.getConditionDuration(condition);

    return {
      condition: this.getConditionDisplay(condition),
      clinicalStatus: this.getClinicalStatusDisplay(condition),
      verificationStatus: this.getVerificationStatusDisplay(condition),
      category: this.getCategoryDisplay(condition),
      severity: this.getSeverityDisplay(condition),
      onsetDate: onsetDate ? onsetDate.toLocaleDateString() : undefined,
      duration: duration ? `${duration} days` : undefined,
      isActive: this.isActive(condition),
      isChronic: this.isChronic(condition)
    };
  }

  /**
   * Validate FHIR Condition resource
   */
  static validateCondition(condition: FHIRCondition): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (condition.resourceType !== 'Condition') {
      errors.push('resourceType must be "Condition"');
    }

    if (!condition.subject) {
      errors.push('subject is required');
    }

    // Either code or category must be present
    if (!condition.code && !condition.category) {
      errors.push('Either code or category must be present');
    }

    // Validate clinical status values if present
    if (condition.clinicalStatus) {
      const validClinicalStatuses = ['active', 'recurrence', 'relapse', 'inactive', 'remission', 'resolved'];
      const clinicalStatus = condition.clinicalStatus.coding?.[0]?.code;
      if (clinicalStatus && !validClinicalStatuses.includes(clinicalStatus)) {
        errors.push(`clinicalStatus must be one of: ${validClinicalStatuses.join(', ')}`);
      }
    }

    // Validate verification status values if present
    if (condition.verificationStatus) {
      const validVerificationStatuses = ['unconfirmed', 'provisional', 'differential', 'confirmed', 'refuted', 'entered-in-error'];
      const verificationStatus = condition.verificationStatus.coding?.[0]?.code;
      if (verificationStatus && !validVerificationStatuses.includes(verificationStatus)) {
        errors.push(`verificationStatus must be one of: ${validVerificationStatuses.join(', ')}`);
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Convert HMS diagnosis to FHIR Condition
   */
  static fromHMSDiagnosis(hmsDiagnosis: any): FHIRCondition {
    return this.createBasicCondition({
      patientId: hmsDiagnosis.patientId,
      practitionerId: hmsDiagnosis.practitionerId || hmsDiagnosis.diagnosedBy,
      encounterId: hmsDiagnosis.encounterId || hmsDiagnosis.visitId,
      conditionCode: hmsDiagnosis.icdCode || hmsDiagnosis.code || 'unknown',
      conditionDisplay: hmsDiagnosis.diagnosis || hmsDiagnosis.name || hmsDiagnosis.description,
      category: hmsDiagnosis.type === 'chronic' ? 'problem-list-item' : 'encounter-diagnosis',
      clinicalStatus: hmsDiagnosis.status === 'resolved' ? 'resolved' : 'active',
      verificationStatus: hmsDiagnosis.confirmed ? 'confirmed' : 'provisional',
      severity: hmsDiagnosis.severity,
      onsetDate: hmsDiagnosis.onsetDate || hmsDiagnosis.diagnosedAt,
      recordedDate: hmsDiagnosis.recordedAt || hmsDiagnosis.createdAt,
      notes: hmsDiagnosis.notes || hmsDiagnosis.description
    });
  }

  /**
   * Get conditions by category
   */
  static getConditionsByCategory(conditions: FHIRCondition[]): Record<string, FHIRCondition[]> {
    const categorized: Record<string, FHIRCondition[]> = {
      'Active Problems': [],
      'Chronic Conditions': [],
      'Encounter Diagnoses': [],
      'Resolved Conditions': [],
      'Other': []
    };

    conditions.forEach(condition => {
      const isActive = this.isActive(condition);
      const isChronic = this.isChronic(condition);
      const clinicalStatus = condition.clinicalStatus?.coding?.[0]?.code;

      if (clinicalStatus === 'resolved') {
        categorized['Resolved Conditions'].push(condition);
      } else if (isChronic && isActive) {
        categorized['Chronic Conditions'].push(condition);
      } else if (isActive) {
        categorized['Active Problems'].push(condition);
      } else {
        const category = this.getCategoryDisplay(condition);
        if (category === 'Encounter Diagnosis') {
          categorized['Encounter Diagnoses'].push(condition);
        } else {
          categorized['Other'].push(condition);
        }
      }
    });

    return categorized;
  }

  /**
   * Get active conditions
   */
  static getActiveConditions(conditions: FHIRCondition[]): FHIRCondition[] {
    return conditions.filter(condition => this.isActive(condition));
  }

  /**
   * Get chronic conditions
   */
  static getChronicConditions(conditions: FHIRCondition[]): FHIRCondition[] {
    return conditions.filter(condition => this.isChronic(condition) && this.isActive(condition));
  }

  /**
   * Get conditions by severity
   */
  static getConditionsBySeverity(conditions: FHIRCondition[], severity: 'mild' | 'moderate' | 'severe'): FHIRCondition[] {
    return conditions.filter(condition => 
      condition.severity?.coding?.[0]?.display?.toLowerCase() === severity
    );
  }

  /**
   * Search conditions by text
   */
  static searchConditions(conditions: FHIRCondition[], searchText: string): FHIRCondition[] {
    const searchLower = searchText.toLowerCase();
    return conditions.filter(condition => {
      const conditionName = this.getConditionDisplay(condition).toLowerCase();
      const code = condition.code?.coding?.[0]?.code?.toLowerCase() || '';
      return conditionName.includes(searchLower) || code.includes(searchLower);
    });
  }
}

// Common condition codes and classifications
export class FHIRConditionCodes {
  /**
   * Common chronic conditions
   */
  static readonly CHRONIC_CONDITIONS = {
    DIABETES_TYPE_2: { code: '44054006', display: 'Diabetes mellitus type 2' },
    HYPERTENSION: { code: '38341003', display: 'Hypertensive disorder' },
    ASTHMA: { code: '195967001', display: 'Asthma' },
    COPD: { code: '13645005', display: 'Chronic obstructive lung disease' },
    HEART_DISEASE: { code: '56265001', display: 'Heart disease' },
    ARTHRITIS: { code: '3723001', display: 'Arthritis' },
    DEPRESSION: { code: '35489007', display: 'Depressive disorder' },
    ANXIETY: { code: '48694002', display: 'Anxiety' }
  };

  /**
   * Common acute conditions
   */
  static readonly ACUTE_CONDITIONS = {
    PNEUMONIA: { code: '233604007', display: 'Pneumonia' },
    BRONCHITIS: { code: '10509002', display: 'Acute bronchitis' },
    UTI: { code: '68566005', display: 'Urinary tract infectious disease' },
    GASTROENTERITIS: { code: '25374005', display: 'Gastroenteritis' },
    MIGRAINE: { code: '37796009', display: 'Migraine' },
    FRACTURE: { code: '125605004', display: 'Fracture of bone' },
    SPRAIN: { code: '44465007', display: 'Sprain' },
    LACERATION: { code: '312608009', display: 'Laceration' }
  };

  /**
   * Emergency conditions
   */
  static readonly EMERGENCY_CONDITIONS = {
    HEART_ATTACK: { code: '22298006', display: 'Myocardial infarction' },
    STROKE: { code: '230690007', display: 'Stroke' },
    ANAPHYLAXIS: { code: '39579001', display: 'Anaphylaxis' },
    SEPSIS: { code: '91302008', display: 'Sepsis' },
    RESPIRATORY_FAILURE: { code: '65710008', display: 'Acute respiratory failure' },
    CARDIAC_ARREST: { code: '410429000', display: 'Cardiac arrest' }
  };

  /**
   * Get condition severity based on code
   */
  static getConditionSeverity(code: string): 'mild' | 'moderate' | 'severe' | undefined {
    if (Object.values(this.EMERGENCY_CONDITIONS).some(cond => cond.code === code)) {
      return 'severe';
    }
    if (Object.values(this.CHRONIC_CONDITIONS).some(cond => cond.code === code)) {
      return 'moderate';
    }
    return undefined;
  }

  /**
   * Check if condition is chronic
   */
  static isChronicCondition(code: string): boolean {
    return Object.values(this.CHRONIC_CONDITIONS).some(cond => cond.code === code);
  }

  /**
   * Check if condition is emergency
   */
  static isEmergencyCondition(code: string): boolean {
    return Object.values(this.EMERGENCY_CONDITIONS).some(cond => cond.code === code);
  }

  /**
   * Get display name for condition code
   */
  static getDisplayName(code: string): string {
    const allConditions = {
      ...this.CHRONIC_CONDITIONS,
      ...this.ACUTE_CONDITIONS,
      ...this.EMERGENCY_CONDITIONS
    };

    const condition = Object.values(allConditions).find(cond => cond.code === code);
    return condition?.display || 'Unknown Condition';
  }
}
