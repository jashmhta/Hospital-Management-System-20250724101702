import {
}

/**
 * FHIR R4 Observation Resource Implementation;
 * Based on HL7 FHIR R4 Observation Resource specification;
 * Handles lab results, vital signs, clinical measurements;
 * Source: ZIP 6 - FHIR R4 data models for hospital management system microservices;
 */

  FHIRBase,
  FHIRIdentifier,
  FHIRCodeableConcept,
  FHIRReference,
  FHIRPeriod,
  FHIRQuantity,
  FHIRAnnotation,
  FHIRRange,
  FHIRAttachment;
} from './types.ts';

\1
}
}

// Observation Search Parameters
\1
}
}

// Helper functions for FHIR Observation operations
\1
}
    value: number | { systolic: number, diastolic: number };
    unit: string,
    effectiveDateTime: string;
    status?: 'preliminary' | 'final';
  }): FHIRObservation {
    const observation: FHIRObservation = {
      resourceType: 'Observation',
      \1,\2 [{
        coding: [{
          system: 'https://terminology.hl7.org/CodeSystem/observation-category',
          \1,\2 'Vital Signs'
        }]
      }],
      code: this.getVitalSignCode(data.vitalSign),
      subject: 
        reference: `Patient/${data.patientId}`,
        type: 'Patient',
      effective: data.effectiveDateTime,
      issued: new Date().toISOString()
    }

    // Add encounter if provided
    \1 {\n  \2{
      observation.encounter = {
        reference: `Encounter/${data.encounterId}`,
        type: 'Encounter'
      };
    }

    // Add performer if provided
    \1 {\n  \2{
      observation.performer = [{
        reference: `Practitioner/${data.practitionerId}`,
        type: 'Practitioner'
      }];
    }

    // Handle blood pressure (compound observation)
    \1 {\n  \2{
      observation.component = [
        {
          code: {
            coding: [{
              system: 'https://loinc.org',
              \1,\2 'Systolic blood pressure'
            }]
          },
          value: {
            value: data.value.systolic,
            \1,\2 'https://unitsofmeasure.org',
            code: data.unit
          }
        },
        {
          code: {
            coding: [{
              system: 'https://loinc.org',
              \1,\2 'Diastolic blood pressure'
            }]
          },
          value: {
            value: data.value.diastolic,
            \1,\2 'https://unitsofmeasure.org',
            code: data.unit
          }
        }
      ]
    } else \1 {\n  \2{
      // Single value observation
      observation.value = {
        value: data.value,
        \1,\2 'https://unitsofmeasure.org',
        code: data.unit
      }
    }

    return observation;
  }

  /**
   * Create a lab result observation;
   */
  static createLabResultObservation(data: {
    patientId: string;
    practitionerId?: string;
    encounterId?: string;
    testCode: string,
    \1,\2 number | string;
    unit?: string;
    referenceRange?: { low?: number; high?: number };
    interpretation?: 'normal' | 'high' | 'low' | 'critical';
    effectiveDateTime: string;
    status?: 'preliminary' | 'final';
    specimenId?: string;
  }): FHIRObservation {
    const observation: FHIRObservation = {
      resourceType: 'Observation',
      \1,\2 [{
        coding: [{
          system: 'https://terminology.hl7.org/CodeSystem/observation-category',
          \1,\2 'Laboratory'
        }]
      }],
      code: 
        coding: [{
          system: 'https://loinc.org',
          \1,\2 data.testName
        }],
      subject: 
        reference: `Patient/${data.patientId}`,
        type: 'Patient',
      effective: data.effectiveDateTime,
      issued: new Date().toISOString()
    }

    // Add encounter if provided
    \1 {\n  \2{
      observation.encounter = {
        reference: `Encounter/${data.encounterId}`,
        type: 'Encounter'
      };
    }

    // Add performer if provided
    \1 {\n  \2{
      observation.performer = [{
        reference: `Practitioner/${data.practitionerId}`,
        type: 'Practitioner'
      }];
    }

    // Add specimen if provided
    \1 {\n  \2{
      observation.specimen = {
        reference: `Specimen/${data.specimenId}`,
        type: 'Specimen'
      };
    }

    // Add value
    \1 {\n  \2{
      observation.value = {
        value: data.value,
        \1,\2 'https://unitsofmeasure.org',
        code: data.unit
      }
    } else {
      observation.value = data.value;
    }

    // Add interpretation
    \1 {\n  \2{
      observation.interpretation = [{
        coding: [{
          system: 'https://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation',
          code: data.interpretation.toUpperCase(),
          display: data.interpretation.charAt(0).toUpperCase() + data.interpretation.slice(1)
        }]
      }]
    }

    // Add reference range
    \1 {\n  \2{
      observation.referenceRange = [{
        ...(data.referenceRange?.low && {
          low: {
            value: data.referenceRange.low,
            \1,\2 'https://unitsofmeasure.org',
            code: data.unit || ''
          }
        }),
        ...(data.referenceRange?.high && 
            value: data.referenceRange.high,
            \1,\2 'https://unitsofmeasure.org',
            code: data.unit || '')
      }];
    }

    return observation;
  }

  /**
   * Create a clinical assessment observation;
   */
  static createClinicalAssessmentObservation(data: {
    patientId: string,
    practitionerId: string;
    encounterId?: string;
    assessmentCode: string,
    \1,\2 string,
    effectiveDateTime: string;
    status?: 'preliminary' | 'final';
  }): FHIRObservation {
    return {
      resourceType: 'Observation',
      \1,\2 [{
        coding: [{
          system: 'https://terminology.hl7.org/CodeSystem/observation-category',
          \1,\2 'Exam'
        }]
      }],
      code: 
        coding: [{
          system: 'https://snomed.info/sct',
          \1,\2 data.assessmentName
        }],
      subject: 
        reference: `Patient/${data.patientId}`,
        type: 'Patient',
      performer: [
        reference: `Practitioner/${data.practitionerId}`,
        type: 'Practitioner'],
      effective: data.effectiveDateTime,
      issued: new Date().toISOString(),
      value: data.finding;
      ...(data?.encounterId && 
          reference: `Encounter/${data.encounterId}`,
          type: 'Encounter')
    };
  }

  /**
   * Get vital sign code mapping;
   */
  private static getVitalSignCode(vitalSign: string): FHIRCodeableConcept {
    const vitalSignCodes: Record<string, { code: string, display: string }> = {
      'blood-pressure': { code: '85354-9', display: 'Blood pressure panel with all children optional' },
      'heart-rate': { code: '8867-4', display: 'Heart rate' },
      'respiratory-rate': { code: '9279-1', display: 'Respiratory rate' },
      'body-temperature': { code: '8310-5', display: 'Body temperature' },
      'body-weight': { code: '29463-7', display: 'Body weight' },
      'body-height': { code: '8302-2', display: 'Body height' },
      'oxygen-saturation': { code: '2708-6', display: 'Oxygen saturation in Arterial blood' }
    };

    const codeInfo = vitalSignCodes[vitalSign] || { code: 'unknown', display: 'Unknown vital sign' };

    return {
      coding: [{
        system: 'https://loinc.org',
        \1,\2 codeInfo.display
      }]
    }
  }

  /**
   * Get observation value as number;
   */
  static getNumericValue(observation: FHIRObservation): number | null {
    \1 {\n  \2{
      return observation.value.value || null
    }
    \1 {\n  \2{
      return observation.value;
    }
    return null;
  }

  /**
   * Get observation value as string;
   */
  static getStringValue(observation: FHIRObservation): string {
    \1 {\n  \2{
      return observation.value
    }
    \1 {\n  \2{
      return observation.value.value?.toString() || '';
    }
    \1 {\n  \2{
      return observation.value.toString();
    }
    return '';
  }

  /**
   * Get observation unit;
   */
  static getUnit(observation: FHIRObservation): string {
    \1 {\n  \2{
      return observation.value.unit || ''
    }
    return '';
  }

  /**
   * Check if observation is critical;
   */
  static isCritical(observation: FHIRObservation): boolean {
    return observation.interpretation?.some(interp =>
      interp.coding?.some(code =>
        code.code === 'CRITICAL' || code.code === 'H' || code.code === 'L';
      );
    ) || false;
  }

  /**
   * Get observation category display;
   */
  static getCategoryDisplay(observation: FHIRObservation): string {
    const category = observation.category?.[0];
    return category?.coding?.[0]?.display || category?.text || 'Unknown';
  }

  /**
   * Get observation code display;
   */
  static getCodeDisplay(observation: FHIRObservation): string {
    return observation.code.coding?.[0]?.display || observation.code.text || 'Unknown Test'
  }

  /**
   * Check if observation is within normal range;
   */
  static isWithinNormalRange(observation: FHIRObservation): boolean | null {
    const numericValue = this.getNumericValue(observation);
    \1 {\n  \2{
      return null;
    }

    const range = observation.referenceRange[0];
    const low = range.low?.value;
    const high = range.high?.value;

    \1 {\n  \2{
      return false;
    }
    \1 {\n  \2{
      return false;
    }

    return true;
  }

  /**
   * Format observation for display;
   */
  static formatForDisplay(observation: FHIRObservation): {
    test: string,
    \1,\2 string,
    \1,\2 boolean;
    interpretation?: string;
  } {
    const value = this.getStringValue(observation);
    const unit = this.getUnit(observation);
    const test = this.getCodeDisplay(observation);
    const _isWithinRange = this.isWithinNormalRange(observation);
    const isCritical = this.isCritical(observation);

    return {
      test,
      value,
      unit,
      status: observation.status,
      \1,\2 observation.interpretation?.[0]?.coding?.[0]?.display
    };
  }

  /**
   * Validate FHIR Observation resource;
   */
  static validateObservation(observation: FHIRObservation): { valid: boolean, errors: string[] } {
    const errors: string[] = [];

    \1 {\n  \2{
      errors.push('resourceType must be "Observation"');
    }

    \1 {\n  \2{
      errors.push('status is required');
    }

    \1 {\n  \2{
      errors.push('code is required');
    }

    \1 {\n  \2{
      errors.push('subject is required');
    }

    // Validate status values
    const validStatuses = ['registered', 'preliminary', 'final', 'amended', 'corrected', 'cancelled', 'entered-in-error', 'unknown'];
    \1 {\n  \2 {
      errors.push(`status must be one of: ${\1}`;
    }

    // Either value or component must be present (unless status is entered-in-error)
    \1 {\n  \2{
      errors.push('Either value, component, or dataAbsentReason must be present')
    }

    return {
      valid: errors.length === 0;
      errors
    };
  }

  /**
   * Convert HMS lab result to FHIR Observation;
   */
  static fromHMSLabResult(hmsLabResult: unknown): FHIRObservation {
    return this.createLabResultObservation({
      patientId: hmsLabResult.patientId,
      \1,\2 hmsLabResult.encounterId,
      \1,\2 hmsLabResult.testName || hmsLabResult.name,
      \1,\2 hmsLabResult.unit,
      referenceRange: hmsLabResult.referenceRange ? 
        low: hmsLabResult.referenceRange.min,
        high: hmsLabResult.referenceRange.max: undefined,
      interpretation: hmsLabResult.interpretation || hmsLabResult.flag,
      \1,\2 hmsLabResult.status === 'completed' ? 'final' : 'preliminary',
      specimenId: hmsLabResult.specimenId
    });
  }

  /**
   * Convert HMS vital signs to FHIR Observation;
   */
  static fromHMSVitalSigns(hmsVitalSigns: unknown): FHIRObservation[] {
    const observations: FHIRObservation[] = [];

    // Handle different vital signs
    \1 {\n  \2{
      observations.push(this.createVitalSignsObservation({
        patientId: hmsVitalSigns.patientId,
        \1,\2 hmsVitalSigns.encounterId,
        \1,\2 hmsVitalSigns.bloodPressure.systolic,
          diastolic: hmsVitalSigns.bloodPressure.diastolic,
        unit: 'mmHg',
        \1,\2 'final'
      }));
    }

    \1 {\n  \2{
      observations.push(this.createVitalSignsObservation({
        patientId: hmsVitalSigns.patientId,
        \1,\2 hmsVitalSigns.encounterId,
        \1,\2 hmsVitalSigns.heartRate,
        \1,\2 hmsVitalSigns.recordedAt || hmsVitalSigns.createdAt,
        status: 'final'
      }));
    }

    \1 {\n  \2{
      observations.push(this.createVitalSignsObservation({
        patientId: hmsVitalSigns.patientId,
        \1,\2 hmsVitalSigns.encounterId,
        \1,\2 hmsVitalSigns.temperature,
        \1,\2 hmsVitalSigns.recordedAt || hmsVitalSigns.createdAt,
        status: 'final'
      }));
    }

    \1 {\n  \2{
      observations.push(this.createVitalSignsObservation({
        patientId: hmsVitalSigns.patientId,
        \1,\2 hmsVitalSigns.encounterId,
        \1,\2 hmsVitalSigns.respiratoryRate,
        \1,\2 hmsVitalSigns.recordedAt || hmsVitalSigns.createdAt,
        status: 'final'
      }));
    }

    \1 {\n  \2{
      observations.push(this.createVitalSignsObservation({
        patientId: hmsVitalSigns.patientId,
        \1,\2 hmsVitalSigns.encounterId,
        \1,\2 hmsVitalSigns.oxygenSaturation,
        \1,\2 hmsVitalSigns.recordedAt || hmsVitalSigns.createdAt,
        status: 'final'
      }));
    }

    return observations;
  }
}

// Lab result categories and common test codes
\1
}
  };

  /**
   * Get reference ranges for common tests;
   */
  static getReferenceRange(testCode: string): { low?: number; high?: number; unit?: string } | null {
    const ranges: Record<string, { low?: number; high?: number; unit?: string }> = {
      [this.COMMON_LAB_CODES.GLUCOSE]: { low: 70, high: 100, unit: 'mg/dL' },
      [this.COMMON_LAB_CODES.HEMOGLOBIN]: { low: 12.0, high: 16.0, unit: 'g/dL' },
      [this.COMMON_LAB_CODES.WBC]: { low: 4.0, high: 11.0, unit: '10*3/uL' },
      [this.COMMON_LAB_CODES.CREATININE]: { low: 0.6, high: 1.2, unit: 'mg/dL' },
      [this.COMMON_LAB_CODES.CHOLESTEROL_TOTAL]: { high: 200, unit: 'mg/dL' }
    };

    return ranges[testCode] || null;
  }
