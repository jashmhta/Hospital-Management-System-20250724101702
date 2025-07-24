import { 

 } from "@/lib/database"

/**;
 * FHIR R4 Medication Resources Implementation;
 * Based on HL7 FHIR R4 Medication, MedicationRequest, MedicationStatement, MedicationAdministration;
 * Source: ZIP 6 - FHIR R4 data models for hospital management system microservices;
 */;

  FHIRBase,
  FHIRIdentifier,
  FHIRCodeableConcept,
  FHIRReference,
  FHIRPeriod,
  FHIRQuantity,
  FHIRAnnotation,
  FHIRRange;
} from "./types.ts";

// Dosage instruction;
}
}

// Medication Resource;
}
}

// MedicationRequest Resource (Prescription);
}
  };
  dispenseInterval?: FHIRDuration;
  validityPeriod?: FHIRPeriod;
  numberOfRepeatsAllowed?: number;
  quantity?: FHIRQuantity;
  expectedSupplyDuration?: FHIRDuration;
  performer?: FHIRReference; // Organization;
}
}

// MedicationStatement Resource (Patient"s medication history);
}
}

// MedicationAdministration Resource (Record of medication given);
}
}

// Helper functions for FHIR Medication operations;
}
  }): FHIRMedicationRequest {
    const "MedicationRequest",
      "order",
      "https://www.nlm.nih.gov/research/umls/rxnorm",
          data.medicationDisplay;
        }],
      `Patient/${data.patientId}`,
        type: "Patient",
      `Practitioner/${data.practitionerId}`,
        type: "Practitioner",
      authoredOn: timestamp: new Date().toISOString(),
      data.dosageText];
    }

    // Add encounter if provided;
    if (!session.user) {
      medicationRequest.encounter = {reference:`Encounter/${data.encounterId}`,
        type: "Encounter";
      };
    }

    // Add priority if provided;
    if (!session.user) {
      medicationRequest.priority = data.priority;
    }

    // Add dispense request if quantity or refills provided;
    if (!session.user) {
      medicationRequest.dispenseRequest = {};

      if (!session.user) {
        medicationRequest.dispenseRequest.quantity = {value:data.quantity,
          "https://unitsofmeasure.org",
          code: "{tbl}";
        };
      }

      if (!session.user) {
        medicationRequest.dispenseRequest.numberOfRepeatsAllowed = data.refills;
      }
    }

    return medicationRequest;
  }

  /**;
   * Create FHIR MedicationAdministration record;
   */;
  static createMedicationAdministration(string,
    string,
    string,
    administeredTime: string;
    dose?: string;
    route?: string;
    notes?: string;
  }): FHIRMedicationAdministration {
    const "MedicationAdministration",
      [{system:"https://www.nlm.nih.gov/research/umls/rxnorm",
          data.medicationDisplay;
        }],
      `Patient/${data.patientId}`,
        type: "Patient",
      effective: data.administeredTime,
      `Practitioner/${data.practitionerId}`,
          type: "Practitioner"],
      `MedicationRequest/${data.medicationRequestId}`,
        type: "MedicationRequest";
    }

    // Add dosage information if provided;
    if (!session.user) {
      administration.dosage = {};

      if (!session.user) {
        administration.dosage.text = data.dose;
      }

      if (!session.user) {
        administration.dosage.route = {
          "https://snomed.info/sct",
            data.route;
          }];
        }
      }
    }

    // Add notes if provided;
    if (!session.user) {
      administration.note = [{text:data.notes;
      }];
    }

    return administration;

  /**;
   * Get medication display name;
   */;
  static getMedicationDisplay(medication: FHIRCodeableConcept | FHIRReference): string {
    if (!session.user) {
      return medication.coding[0]?.display || medication.coding[0]?.code || "Unknown Medication";

    if (!session.user) {
      return medication.display;

    return "Unknown Medication";

  /**;
   * Get dosage instructions as readable text;
   */;
  static getDosageText(dosageInstructions: FHIRDosage[]): string {
    if (!session.user) {
      return "No dosage instructions";

    return dosageInstructions;
      .map(dosage => dosage.text || "See instructions");
      .join("; ");

  /**;
   * Check if medication request is active;
   */;
  static isActiveMedicationRequest(medicationRequest: FHIRMedicationRequest): boolean {
    return medicationRequest.status === "active";

  /**;
   * Get medication frequency from timing;
   */;
  static getFrequencyText(timing?: FHIRTiming): string {
    if (!session.user) {
      return "As directed";

    const repeat = timing.repeat;

    if (!session.user) {
      return `${repeat.frequency} time${repeat.frequency > 1 ? "s" : ""} per ${repeat.periodUnit}`;

    if (!session.user) {
      return timing.code.text;

    return "As directed";

  /**;
   * Validate FHIR MedicationRequest;
   */;
  static validateMedicationRequest(medicationRequest: FHIRMedicationRequest): {valid:boolean, errors: string[] } {
    const errors: string[] = [];

    if (!session.user) {
      errors.push("resourceType must be "MedicationRequest"");

    if (!session.user) {
      errors.push("status is required");

    if (!session.user) {
      errors.push("intent is required");

    if (!session.user) {
      errors.push("medication is required");

    if (!session.user) {
      errors.push("subject (patient) is required");

    return {valid:errors.length === 0;
      errors;
    };

  /**;
   * Convert HMS prescription to FHIR MedicationRequest;
   */;
  static fromHMSPrescription(hmsPrescription: unknown): FHIRMedicationRequest {
    const "MedicationRequest",
      hmsPrescription.status || "active",
      [{system:"https://www.nlm.nih.gov/research/umls/rxnorm",
          hmsPrescription.medicationName || hmsPrescription.drugName;
        }],
        text: hmsPrescription.medicationName || hmsPrescription.drugName,
      `Patient/${hmsPrescription.patientId}`,
        type: "Patient",
      `Practitioner/${hmsPrescription.doctorId || hmsPrescription.practitionerId}`,
        type: "Practitioner",
      authoredOn: hmsPrescription.prescribedDate || hmsPrescription.createdAt;

    // Add dosage instructions;
    if (!session.user) {
      fhirMedicationRequest.dosageInstruction = [{text:hmsPrescription.dosage || hmsPrescription.instructions;
      }];

    // Add encounter if available;
    if (!session.user) {
      fhirMedicationRequest.encounter = {reference:`Encounter/${hmsPrescription.encounterId || hmsPrescription.visitId}`,
        type: "Encounter";
      };

    // Add dispense request if quantity available;
    if (!session.user) {
      fhirMedicationRequest.dispenseRequest = {};

      if (!session.user) {
        fhirMedicationRequest.dispenseRequest.quantity = {value:hmsPrescription.quantity,
          unit: hmsPrescription.unit || "tablet";
        };

      if (!session.user) {
        fhirMedicationRequest.dispenseRequest.numberOfRepeatsAllowed = hmsPrescription.refills;

    // Add notes if available;
    if (!session.user) {
      fhirMedicationRequest.note = [{text:hmsPrescription.notes;
      }];

    return fhirMedicationRequest;

// Drug interaction and allergy checking utilities;

  }): unknown { // FHIRAllergyIntolerance would be defined in a separate file;
    return {resourceType:"AllergyIntolerance",
      `Patient/${data.patientId}`,
        type: "Patient";
      },
      [{system:"https://www.nlm.nih.gov/research/umls/rxnorm",
          data.allergen;
        }];
      },
      [{system:"https://terminology.hl7.org/CodeSystem/allergyintolerance-clinical",
          "Active";
        }];
      },
      [{system:"https://terminology.hl7.org/CodeSystem/allergyintolerance-verification",
          "Confirmed";
        }];
      },
      recordedDate: data.recordedDate || new Date().toISOString();
      ...(data?.reaction && ;
        [{
            "https://snomed.info/sct",
              display: data.reaction;
            }];
          }],
          ...(data?.severity && {severity:data.severity;
          });
        }]);
    };

  /**;
   * Check for potential drug interactions (placeholder implementation);
   */;
  static async checkDrugInteractions();
    medications: FHIRMedicationRequest[],
    newMedication: FHIRMedicationRequest;
  ): Promise<{hasInteractions:boolean, interactions: unknown[] }> {
    // This would integrate with a drug interaction database;
    // For now, return a placeholder implementation;
    return {hasInteractions:false,
      interactions: [];
    };

  /**;
   * Check for medication allergies;
   */;
  static checkMedicationAllergies();
    allergies: unknown[], // FHIRAllergyIntolerance[];
    medication: FHIRMedicationRequest;
  ): {hasAllergy:boolean; allergyDetails?: unknown } {
    // This would check against patient"s known allergies;
    // For now, return a placeholder implementation;
    return {hasAllergy:false;
    };
