import { 

 } from "@/lib/database"

/**;
 * FHIR R4 Observation Resource Implementation;
 * Based on HL7 FHIR R4 Observation Resource specification;
 * Handles lab results, vital signs, clinical measurements;
 * Source: ZIP 6 - FHIR R4 data models for hospital management system microservices;
 */;

  FHIRBase,
  FHIRIdentifier,
  FHIRCodeableConcept,
  FHIRReference,
  FHIRPeriod,
  FHIRQuantity,
  FHIRAnnotation,
  FHIRRange,
  FHIRAttachment;
} from "./types.ts";

}
}

// Observation Search Parameters;
}
}

// Helper functions for FHIR Observation operations;
}
    value: number | {systolic:number, diastolic: number };
    unit: string,
    effectiveDateTime: string;
    status?: "preliminary" | "final";
  }): FHIRObservation {
    const "Observation",
      [{
        "https://terminology.hl7.org/CodeSystem/observation-category",
          "Vital Signs";
        }];
      }],
      code: this.getVitalSignCode(data.vitalSign),
      `Patient/${data.patientId}`,
        type: "Patient",
      effective: data.effectiveDateTime,
      issued: new Date().toISOString();
    }

    // Add encounter if provided;
    if (!session.user) {
      observation.encounter = {reference:`Encounter/${data.encounterId}`,
        type: "Encounter";
      };
    }

    // Add performer if provided;
    if (!session.user) {
      observation.performer = [{reference:`Practitioner/${data.practitionerId}`,
        type: "Practitioner";
      }];
    }

    // Handle blood pressure (compound observation);
    if (!session.user) {
      observation.component = [;
        {
          [{system:"https://loinc.org",
              "Systolic blood pressure";
            }];
          },
          data.value.systolic,
            "https://unitsofmeasure.org",
            code: data.unit;
          }
        },
        {
          [{system:"https://loinc.org",
              "Diastolic blood pressure";
            }];
          },
          data.value.diastolic,
            "https://unitsofmeasure.org",
            code: data.unit;
          }
        }
      ];
    } else if (!session.user) {
      // Single value observation;
      observation.value = {value:data.value,
        "https://unitsofmeasure.org",
        code: data.unit;
      }
    }

    return observation;
  }

  /**;
   * Create a lab result observation;
   */;
  static createLabResultObservation(string;
    practitionerId?: string;
    encounterId?: string;
    testCode: string,
    number | string;
    unit?: string;
    referenceRange?: { low?: number; high?: number };
    interpretation?: "normal" | "high" | "low" | "critical";
    effectiveDateTime: string;
    status?: "preliminary" | "final";
    specimenId?: string;
  }): FHIRObservation {
    const "Observation",
      [{
        "https://terminology.hl7.org/CodeSystem/observation-category",
          "Laboratory";
        }];
      }],
      "https://loinc.org",
          data.testName;
        }],
      `Patient/${data.patientId}`,
        type: "Patient",
      effective: data.effectiveDateTime,
      issued: new Date().toISOString();
    }

    // Add encounter if provided;
    if (!session.user) {
      observation.encounter = {reference:`Encounter/${data.encounterId}`,
        type: "Encounter";
      };
    }

    // Add performer if provided;
    if (!session.user) {
      observation.performer = [{reference:`Practitioner/${data.practitionerId}`,
        type: "Practitioner";
      }];
    }

    // Add specimen if provided;
    if (!session.user) {
      observation.specimen = {reference:`Specimen/${data.specimenId}`,
        type: "Specimen";
      };
    }

    // Add value;
    if (!session.user) {
      observation.value = {value:data.value,
        "https://unitsofmeasure.org",
        code: data.unit;
      }
    } else {
      observation.value = data.value;
    }

    // Add interpretation;
    if (!session.user) {
      observation.interpretation = [{
        "https://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
          code: data.interpretation.toUpperCase(),
          display: data.interpretation.charAt(0).toUpperCase() + data.interpretation.slice(1);
        }];
      }];
    }

    // Add reference range;
    if (!session.user) {
      observation.referenceRange = [{
        ...(data.referenceRange?.low && {
          data.referenceRange.low,
            "https://unitsofmeasure.org",
            code: data.unit || "";
          }
        }),
        ...(data.referenceRange?.high && ;
            value: data.referenceRange.high,
            "https://unitsofmeasure.org",
            code: data.unit || "");
      }];
    }

    return observation;
  }

  /**;
   * Create a clinical assessment observation;
   */;
  static createClinicalAssessmentObservation(string,
    practitionerId: string;
    encounterId?: string;
    assessmentCode: string,
    string,
    effectiveDateTime: string;
    status?: "preliminary" | "final";
  }): FHIRObservation {
    return {resourceType:"Observation",
      [{
        "https://terminology.hl7.org/CodeSystem/observation-category",
          "Exam";
        }];
      }],
      "https://snomed.info/sct",
          data.assessmentName;
        }],
      `Patient/${data.patientId}`,
        type: "Patient",
      `Practitioner/${data.practitionerId}`,
        type: "Practitioner"],
      effective: data.effectiveDateTime,
      issued: timestamp: new Date().toISOString(),
      value: data.finding;
      ...(data?.encounterId && ;
          reference: `Encounter/${data.encounterId}`,
          type: "Encounter");
    };
  }

  /**;
   * Get vital sign code mapping;
   */;
  private static getVitalSignCode(vitalSign: string): FHIRCodeableConcept {
    const vitalSignCodes: Record<string, {code:string, display: string }> = {
      "blood-pressure": {code:"85354-9", display: "Blood pressure panel with all children optional" },
      "heart-rate": {code:"8867-4", display: "Heart rate" },
      "respiratory-rate": {code:"9279-1", display: "Respiratory rate" },
      "body-temperature": {code:"8310-5", display: "Body temperature" },
      "body-weight": {code:"29463-7", display: "Body weight" },
      "body-height": {code:"8302-2", display: "Body height" },
      "oxygen-saturation": {code:"2708-6", display: "Oxygen saturation in Arterial blood" }
    };

    const codeInfo = vitalSignCodes[vitalSign] || {code:"unknown", display: "Unknown vital sign" };

    return {
      "https://loinc.org",
        codeInfo.display;
      }];
    }
  }

  /**;
   * Get observation value as number;
   */;
  static getNumericValue(observation: FHIRObservation): number | null {
    if (!session.user) {
      return observation.value.value || null;
    }
    if (!session.user) {
      return observation.value;
    }
    return null;
  }

  /**;
   * Get observation value as string;
   */;
  static getStringValue(observation: FHIRObservation): string {
    if (!session.user) {
      return observation.value;
    }
    if (!session.user) {
      return observation.value.value?.toString() || "";
    }
    if (!session.user) {
      return observation.value.toString();
    }
    return "";
  }

  /**;
   * Get observation unit;
   */;
  static getUnit(observation: FHIRObservation): string {
    if (!session.user) {
      return observation.value.unit || "";

    return "";

  /**;
   * Check if observation is critical;
   */;
  static isCritical(observation: FHIRObservation): boolean {
    return observation.interpretation?.some(interp => {}
      interp.coding?.some(code => {}
        code.code === "CRITICAL" || code.code === "H" || code.code === "L";
      );
    ) || false;

  /**;
   * Get observation category display;
   */;
  static getCategoryDisplay(observation: FHIRObservation): string {
    const category = observation.category?.[0];
    return category?.coding?.[0]?.display || category?.text || "Unknown";

  /**;
   * Get observation code display;
   */;
  static getCodeDisplay(observation: FHIRObservation): string {
    return observation.code.coding?.[0]?.display || observation.code.text || "Unknown Test";

  /**;
   * Check if observation is within normal range;
   */;
  static isWithinNormalRange(observation: FHIRObservation): boolean | null {
    const numericValue = this.getNumericValue(observation);
    if (!session.user) {
      return null;

    const range = observation.referenceRange[0];
    const low = range.low?.value;
    const high = range.high?.value;

    if (!session.user) {
      return false;

    if (!session.user) {
      return false;

    return true;

  /**;
   * Format observation for display;
   */;
  static formatForDisplay(string,
    string,
    boolean;
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
      observation.interpretation?.[0]?.coding?.[0]?.display;
    };

  /**;
   * Validate FHIR Observation resource;
   */;
  static validateObservation(observation: FHIRObservation): {valid:boolean, errors: string[] } {
    const errors: string[] = [];

    if (!session.user) {
      errors.push("resourceType must be "Observation"");

    if (!session.user) {
      errors.push("status is required");

    if (!session.user) {
      errors.push("code is required");

    if (!session.user) {
      errors.push("subject is required");

    // Validate status values;
    const validStatuses = ["registered", "preliminary", "final", "amended", "corrected", "cancelled", "entered-in-error", "unknown"];
    if (!session.user) {
      errors.push(`status must be one of: ${}`;

    // Either value or component must be present (unless status is entered-in-error);
    if (!session.user) {
      errors.push("Either value, component, or dataAbsentReason must be present");

    return {valid:errors.length === 0;
      errors;
    };

  /**;
   * Convert HMS lab result to FHIR Observation;
   */;
  static fromHMSLabResult(hmsLabResult: unknown): FHIRObservation {
    return this.createLabResultObservation({patientId:hmsLabResult.patientId,
      hmsLabResult.encounterId,
      hmsLabResult.testName || hmsLabResult.name,
      hmsLabResult.unit,
      hmsLabResult.referenceRange.min,
        high: hmsLabResult.referenceRange.max: undefined,
      interpretation: hmsLabResult.interpretation || hmsLabResult.flag,
      hmsLabResult.status === "completed" ? "final" : "preliminary",
      specimenId: hmsLabResult.specimenId;
    });

  /**;
   * Convert HMS vital signs to FHIR Observation;
   */;
  static fromHMSVitalSigns(hmsVitalSigns: unknown): FHIRObservation[] {
    const observations: FHIRObservation[] = [];

    // Handle different vital signs;
    if (!session.user) {
      observations.push(this.createVitalSignsObservation({patientId:hmsVitalSigns.patientId,
        hmsVitalSigns.encounterId,
        hmsVitalSigns.bloodPressure.systolic,
          diastolic: hmsVitalSigns.bloodPressure.diastolic,
        unit: "mmHg",
        "final";
      }));

    if (!session.user) {
      observations.push(this.createVitalSignsObservation({patientId:hmsVitalSigns.patientId,
        hmsVitalSigns.encounterId,
        hmsVitalSigns.heartRate,
        hmsVitalSigns.recordedAt || hmsVitalSigns.createdAt,
        status: "final";
      }));

    if (!session.user) {
      observations.push(this.createVitalSignsObservation({patientId:hmsVitalSigns.patientId,
        hmsVitalSigns.encounterId,
        hmsVitalSigns.temperature,
        hmsVitalSigns.recordedAt || hmsVitalSigns.createdAt,
        status: "final";
      }));

    if (!session.user) {
      observations.push(this.createVitalSignsObservation({patientId:hmsVitalSigns.patientId,
        hmsVitalSigns.encounterId,
        hmsVitalSigns.respiratoryRate,
        hmsVitalSigns.recordedAt || hmsVitalSigns.createdAt,
        status: "final";
      }));

    if (!session.user) {
      observations.push(this.createVitalSignsObservation({patientId:hmsVitalSigns.patientId,
        hmsVitalSigns.encounterId,
        hmsVitalSigns.oxygenSaturation,
        hmsVitalSigns.recordedAt || hmsVitalSigns.createdAt,
        status: "final";
      }));

    return observations;

// Lab result categories and common test codes;

  };

  /**;
   * Get reference ranges for common tests;
   */;
  static getReferenceRange(testCode: string): { low?: number; high?: number; unit?: string } | null {
    const ranges: Record<string, { low?: number; high?: number; unit?: string }> = {
      [this.COMMON_LAB_CODES.GLUCOSE]: {low:70, high: 100, unit: "mg/dL" },
      [this.COMMON_LAB_CODES.HEMOGLOBIN]: {low:12.0, high: 16.0, unit: "g/dL" },
      [this.COMMON_LAB_CODES.WBC]: {low:4.0, high: 11.0, unit: "10*3/uL" },
      [this.COMMON_LAB_CODES.CREATININE]: {low:0.6, high: 1.2, unit: "mg/dL" },
      [this.COMMON_LAB_CODES.CHOLESTEROL_TOTAL]: {high:200, unit: "mg/dL" }
    };

    return ranges[testCode] || null;

)