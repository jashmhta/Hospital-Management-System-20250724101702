import {
}

/**
 * FHIR R4 Medication Resources Implementation;
 * Based on HL7 FHIR R4 Medication, MedicationRequest, MedicationStatement, MedicationAdministration;
 * Source: ZIP 6 - FHIR R4 data models for hospital management system microservices;
 */

  FHIRBase,
  FHIRIdentifier,
  FHIRCodeableConcept,
  FHIRReference,
  FHIRPeriod,
  FHIRQuantity,
  FHIRAnnotation,
  FHIRRange;
} from './types.ts';

// Dosage instruction
\1
}
}

// Medication Resource
\1
}
}

// MedicationRequest Resource (Prescription)
\1
}
  };
  dispenseInterval?: FHIRDuration;
  validityPeriod?: FHIRPeriod;
  numberOfRepeatsAllowed?: number;
  quantity?: FHIRQuantity;
  expectedSupplyDuration?: FHIRDuration;
  performer?: FHIRReference; // Organization
\1
}
}

// MedicationStatement Resource (Patient's medication history)
\1
}
}

// MedicationAdministration Resource (Record of medication given)
\1
}
}

// Helper functions for FHIR Medication operations
\1
}
  }): FHIRMedicationRequest {
    const medicationRequest: FHIRMedicationRequest = {
      resourceType: 'MedicationRequest',
      \1,\2 'order',
      medication: 
        coding: [{
          system: 'https://www.nlm.nih.gov/research/umls/rxnorm',
          \1,\2 data.medicationDisplay
        }],
      subject: 
        reference: `Patient/${data.patientId}`,
        type: 'Patient',
      requester: 
        reference: `Practitioner/${data.practitionerId}`,
        type: 'Practitioner',
      authoredOn: new Date().toISOString(),
      dosageInstruction: [
        text: data.dosageText]
    }

    // Add encounter if provided
    \1 {\n  \2{
      medicationRequest.encounter = {
        reference: `Encounter/${data.encounterId}`,
        type: 'Encounter'
      };
    }

    // Add priority if provided
    \1 {\n  \2{
      medicationRequest.priority = data.priority;
    }

    // Add dispense request if quantity or refills provided
    \1 {\n  \2{
      medicationRequest.dispenseRequest = {};

      \1 {\n  \2{
        medicationRequest.dispenseRequest.quantity = {
          value: data.quantity,
          \1,\2 'https://unitsofmeasure.org',
          code: '{tbl}'
        };
      }

      \1 {\n  \2{
        medicationRequest.dispenseRequest.numberOfRepeatsAllowed = data.refills;
      }
    }

    return medicationRequest;
  }

  /**
   * Create FHIR MedicationAdministration record;
   */
  static createMedicationAdministration(data: {
    patientId: string,
    \1,\2 string,
    \1,\2 string,
    administeredTime: string;
    dose?: string;
    route?: string;
    notes?: string;
  }): FHIRMedicationAdministration {
    const administration: FHIRMedicationAdministration = {
      resourceType: 'MedicationAdministration',
      \1,\2 [{
          system: 'https://www.nlm.nih.gov/research/umls/rxnorm',
          \1,\2 data.medicationDisplay
        }],
      subject: 
        reference: `Patient/${data.patientId}`,
        type: 'Patient',
      effective: data.administeredTime,
      performer: [
          reference: `Practitioner/${data.practitionerId}`,
          type: 'Practitioner'],
      request: 
        reference: `MedicationRequest/${data.medicationRequestId}`,
        type: 'MedicationRequest'
    }

    // Add dosage information if provided
    \1 {\n  \2{
      administration.dosage = {};

      \1 {\n  \2{
        administration.dosage.text = data.dose;
      }

      \1 {\n  \2{
        administration.dosage.route = {
          coding: [{
            system: 'https://snomed.info/sct',
            \1,\2 data.route
          }]
        }
      }
    }

    // Add notes if provided
    \1 {\n  \2{
      administration.note = [{
        text: data.notes
      }];
    }

    return administration;
  }

  /**
   * Get medication display name;
   */
  static getMedicationDisplay(medication: FHIRCodeableConcept | FHIRReference): string {
    \1 {\n  \2{
      return medication.coding[0]?.display || medication.coding[0]?.code || 'Unknown Medication'
    }

    \1 {\n  \2{
      return medication.display;
    }

    return 'Unknown Medication';
  }

  /**
   * Get dosage instructions as readable text;
   */
  static getDosageText(dosageInstructions: FHIRDosage[]): string {
    \1 {\n  \2{
      return 'No dosage instructions'
    }

    return dosageInstructions;
      .map(dosage => dosage.text || 'See instructions');
      .join('; ');
  }

  /**
   * Check if medication request is active;
   */
  static isActiveMedicationRequest(medicationRequest: FHIRMedicationRequest): boolean {
    return medicationRequest.status === 'active'
  }

  /**
   * Get medication frequency from timing;
   */
  static getFrequencyText(timing?: FHIRTiming): string {
    \1 {\n  \2{
      return 'As directed';
    }

    const repeat = timing.repeat;

    \1 {\n  \2{
      return `${repeat.frequency} time${repeat.frequency > 1 ? 's' : ''} per ${repeat.periodUnit}`;
    }

    \1 {\n  \2{
      return timing.code.text;
    }

    return 'As directed';
  }

  /**
   * Validate FHIR MedicationRequest;
   */
  static validateMedicationRequest(medicationRequest: FHIRMedicationRequest): { valid: boolean, errors: string[] } {
    const errors: string[] = [];

    \1 {\n  \2{
      errors.push('resourceType must be "MedicationRequest"');
    }

    \1 {\n  \2{
      errors.push('status is required');
    }

    \1 {\n  \2{
      errors.push('intent is required');
    }

    \1 {\n  \2{
      errors.push('medication is required');
    }

    \1 {\n  \2{
      errors.push('subject (patient) is required');
    }

    return {
      valid: errors.length === 0;
      errors
    };
  }

  /**
   * Convert HMS prescription to FHIR MedicationRequest;
   */
  static fromHMSPrescription(hmsPrescription: unknown): FHIRMedicationRequest {
    const fhirMedicationRequest: FHIRMedicationRequest = {
      resourceType: 'MedicationRequest',
      \1,\2 hmsPrescription.status || 'active',
      \1,\2 [{
          system: 'https://www.nlm.nih.gov/research/umls/rxnorm',
          \1,\2 hmsPrescription.medicationName || hmsPrescription.drugName
        }],
        text: hmsPrescription.medicationName || hmsPrescription.drugName,
      subject: 
        reference: `Patient/${hmsPrescription.patientId}`,
        type: 'Patient',
      requester: 
        reference: `Practitioner/${hmsPrescription.doctorId || hmsPrescription.practitionerId}`,
        type: 'Practitioner',
      authoredOn: hmsPrescription.prescribedDate || hmsPrescription.createdAt
    }

    // Add dosage instructions
    \1 {\n  \2{
      fhirMedicationRequest.dosageInstruction = [{
        text: hmsPrescription.dosage || hmsPrescription.instructions
      }];
    }

    // Add encounter if available
    \1 {\n  \2{
      fhirMedicationRequest.encounter = {
        reference: `Encounter/${hmsPrescription.encounterId || hmsPrescription.visitId}`,
        type: 'Encounter'
      };
    }

    // Add dispense request if quantity available
    \1 {\n  \2{
      fhirMedicationRequest.dispenseRequest = {};

      \1 {\n  \2{
        fhirMedicationRequest.dispenseRequest.quantity = {
          value: hmsPrescription.quantity,
          unit: hmsPrescription.unit || 'tablet'
        };
      }

      \1 {\n  \2{
        fhirMedicationRequest.dispenseRequest.numberOfRepeatsAllowed = hmsPrescription.refills;
      }
    }

    // Add notes if available
    \1 {\n  \2{
      fhirMedicationRequest.note = [{
        text: hmsPrescription.notes
      }];
    }

    return fhirMedicationRequest;
  }
}

// Drug interaction and allergy checking utilities
\1
}
  }): unknown { // FHIRAllergyIntolerance would be defined in a separate file
    return {
      resourceType: 'AllergyIntolerance',
      patient: {
        reference: `Patient/${data.patientId}`,
        type: 'Patient'
      },
      code: {
        coding: [{
          system: 'https://www.nlm.nih.gov/research/umls/rxnorm',
          \1,\2 data.allergen
        }]
      },
      clinicalStatus: {
        coding: [{
          system: 'https://terminology.hl7.org/CodeSystem/allergyintolerance-clinical',
          \1,\2 'Active'
        }]
      },
      verificationStatus: {
        coding: [{
          system: 'https://terminology.hl7.org/CodeSystem/allergyintolerance-verification',
          \1,\2 'Confirmed'
        }]
      },
      recordedDate: data.recordedDate || new Date().toISOString();
      ...(data?.reaction && 
        reaction: [{
          manifestation: [{
            coding: [{
              system: 'https://snomed.info/sct',
              display: data.reaction
            }]
          }],
          ...(data?.severity && {
            severity: data.severity
          })
        }])
    };
  }

  /**
   * Check for potential drug interactions (placeholder implementation)
   */
  static async checkDrugInteractions(
    medications: FHIRMedicationRequest[],
    newMedication: FHIRMedicationRequest;
  ): Promise<{ hasInteractions: boolean, interactions: unknown[] }> {
    // This would integrate with a drug interaction database
    // For now, return a placeholder implementation
    return {
      hasInteractions: false,
      interactions: []
    };
  }

  /**
   * Check for medication allergies;
   */
  static checkMedicationAllergies(
    allergies: unknown[], // FHIRAllergyIntolerance[]
    medication: FHIRMedicationRequest
  ): { hasAllergy: boolean; allergyDetails?: unknown } {
    // This would check against patient's known allergies
    // For now, return a placeholder implementation
    return {
      hasAllergy: false
    };
  }
