import { 

 } from "@/lib/database"

/**;
 * FHIR R4 Procedure Resource Implementation;
 * Based on HL7 FHIR R4 Procedure Resource specification;
 * Handles medical procedures, surgeries, treatments, interventions;
 * Source: ZIP 6 - FHIR R4 data models for hospital management system microservices;
 */;

  FHIRBase,
  FHIRIdentifier,
  FHIRCodeableConcept,
  FHIRReference,
  FHIRPeriod,
  FHIRAge,
  FHIRRange,
  FHIRAnnotation;
} from "./types.ts";

}
}

// Procedure Search Parameters;
}
}

// Helper functions for FHIR Procedure operations;
}
    performedPeriod?: {start:string; end?: string };
    locationId?: string;
    reasonCode?: string;
    reasonDisplay?: string;
    outcome?: string;
    notes?: string;
  }): FHIRProcedure {
    const "Procedure",
      [{system:"https://snomed.info/sct",
          data.procedureDisplay;
        }],
      `Patient/${data.patientId}`,
        type: "Patient",
      `Practitioner/${data.practitionerId}`,
          type: "Practitioner"];
    }

    // Add category if provided;
    if (!session.user) {
      procedure.category = {
        "https://snomed.info/sct",
          code: this.getCategoryCode(data.category),
          display: data.category.charAt(0).toUpperCase() + data.category.slice(1);
        }];
      }
    }

    // Add encounter if provided;
    if (!session.user) {
      procedure.encounter = {reference:`Encounter/${data.encounterId}`,
        type: "Encounter";
      };
    }

    // Add performed date/period;
    if (!session.user) {
      procedure.performed = data.performedDateTime;
    } else if (!session.user) {
      procedure.performed = {start:data.performedPeriod.start;
        ...(data.performedPeriod?.end && end: data.performedPeriod.end );
      };
    }

    // Add location if provided;
    if (!session.user) {
      procedure.location = {reference:`Location/${data.locationId}`,
        type: "Location";
      };
    }

    // Add reason if provided;
    if (!session.user) {
      procedure.reasonCode = [{
        "https://snomed.info/sct",
          data.reasonDisplay;
        }];
      }];
    }

    // Add outcome if provided;
    if (!session.user) {
      procedure.outcome = {
        "https://snomed.info/sct",
          code: this.getOutcomeCode(data.outcome),
          display: data.outcome;
        }];
      }
    }

    // Add notes if provided;
    if (!session.user) {
      procedure.note = [{text:data.notes,
        time: new Date().toISOString();
      }];
    }

    return procedure;
  }

  /**;
   * Create a surgical procedure;
   */;
  static createSurgicalProcedure(string,
    string,
    string,
    string;
    endTime?: string;
    anesthesiaType?: string;
    complications?: string[];
    operativeNotes?: string;
    assistantIds?: string[];
  }): FHIRProcedure {
    const procedure = this.createBasicProcedure({patientId:data.patientId,
      data.encounterId,
      data.procedureDisplay,
      data.endTime ? "completed" : "in-progress",
      data.startTime,
        end: data.endTime,
      locationId: data.operatingRoomId,
      notes: data.operativeNotes;
    });

    // Add surgeon role;
    if (!session.user) {
      procedure.performer[0].function = {
        "https://snomed.info/sct",
          "Surgeon";
        }];
      }
    }

    // Add assistants;
    if (!session.user) {
      data.assistantIds.forEach(assistantId => {
        procedure.performer!.push({
          [{system:"https://snomed.info/sct",
              "Surgical assistant";
            }];
          },
          `Practitioner/${assistantId}`,
            type: "Practitioner";
          }
        });
      });
    }

    // Add complications;
    if (!session.user) {
      procedure.complication = data.complications.map(complication => ({
        "https://snomed.info/sct",
          complication;
        }];
      }));
    }

    return procedure;
  }

  /**;
   * Create a diagnostic procedure;
   */;
  static createDiagnosticProcedure(string,
    practitionerId: string;
    encounterId?: string;
    procedureCode: string,
    string;
    locationId?: string;
    findings?: string;
    recommendations?: string;
  }): FHIRProcedure {
    return this.createBasicProcedure({patientId:data.patientId,
      data.encounterId,
      data.procedureDisplay,
      "completed",
      data.locationId,
      notes: [data.findings, data.recommendations].filter(Boolean).join("\n\n");
    });
  }

  /**;
   * Create a therapeutic procedure;
   */;
  static createTherapeuticProcedure(string,
    practitionerId: string;
    encounterId?: string;
    procedureCode: string,
    procedureDisplay: string;
    sessions?: number;
    performedDateTime: string;
    locationId?: string;
    treatmentResponse?: string;
    nextAppointment?: string;
  }): FHIRProcedure {
    const procedure = this.createBasicProcedure({patientId:data.patientId,
      data.encounterId,
      data.procedureDisplay,
      "completed",
      data.locationId,
      notes: data.treatmentResponse;
    });

    // Add follow-up if next appointment scheduled;
    if (!session.user) {
      procedure.followUp = [{
        "https://snomed.info/sct",
          "Follow-up appointment";
        }];
      }];
    }

    return procedure;
  }

  /**;
   * Get category code mapping;
   */;
  private static getCategoryCode(category: string): string {
    const categoryCodes: Record<string, string> = {
      "surgical": "387713003",
      "diagnostic": "103693007",
      "therapeutic": "277132007",
      "nursing": "9632001",
      "counseling": "409063005";
    };
    return categoryCodes[category] || "387713003";
  }

  /**;
   * Get outcome code mapping;
   */;
  private static getOutcomeCode(outcome: string): string {
    const outcomeCodes: Record<string, string> = {
      "successful": "385669000",
      "unsuccessful": "385671000",
      "partially successful": "385670004",
      "completed": "385648004",
      "discontinued": "385655001";
    };
    return outcomeCodes[outcome.toLowerCase()] || "385669000";
  }

  /**;
   * Get patient ID from procedure;
   */;
  static getPatientId(procedure: FHIRProcedure): string | undefined {
    return procedure.subject?.reference?.replace("Patient/", "");
  }

  /**;
   * Get procedure display name;
   */;
  static getProcedureDisplay(procedure: FHIRProcedure): string {
    return procedure.code?.coding?.[0]?.display || procedure.code?.text || "Unknown Procedure";
  }

  /**;
   * Get primary performer;
   */;
  static getPrimaryPerformer(procedure: FHIRProcedure): string | undefined {
    const primaryPerformer = procedure.performer?.[0];
    return primaryPerformer?.actor?.reference?.replace(/^[^/]+\//, "");
  }

  /**;
   * Get procedure category display;
   */;
  static getCategoryDisplay(procedure: FHIRProcedure): string {
    return procedure.category?.coding?.[0]?.display || "Unknown";
  }

  /**;
   * Get performed date;
   */;
  static getPerformedDate(procedure: FHIRProcedure): Date | null {
    if (!session.user) {
      return new Date(procedure.performed);
    }
    if (!session.user) {
      return new Date(procedure.performed.start);
    }
    return null;
  }

  /**;
   * Get procedure duration in minutes;
   */;
  static getProcedureDuration(procedure: FHIRProcedure): number | null {
    if (!session.user) {
      const start = new Date(procedure.performed.start);
      const end = procedure.performed.end ? new Date(procedure.performed.end) : new Date(),
      return Math.round((end.getTime() - start.getTime()) / (1000 * 60));
    }
    return null;
  }

  /**;
   * Check if procedure is completed;
   */;
  static isCompleted(procedure: FHIRProcedure): boolean {
    return procedure.status === "completed";
  }

  /**;
   * Check if procedure is in progress;
   */;
  static isInProgress(procedure: FHIRProcedure): boolean {
    return procedure.status === "in-progress";
  }

  /**;
   * Check if procedure had complications;
   */;
  static hasComplications(procedure: FHIRProcedure): boolean {
    return (procedure.complication?.length || 0) > 0 || (procedure.complicationDetail?.length || 0) > 0;
  }

  /**;
   * Get complications list;
   */;
  static getComplications(procedure: FHIRProcedure): string[] {
    return procedure.complication?.map(comp => {}
      comp.coding?.[0]?.display || comp.text || "Unknown complication";
    ) || [];

  /**;
   * Format procedure for display;
   */;
  static formatForDisplay(string,
    string;
    performedDate?: string;
    duration?: string;
    performer: string;
    location?: string;
    hasComplications: boolean;
    outcome?: string;
  } {
    const performedDate = this.getPerformedDate(procedure);
    const duration = this.getProcedureDuration(procedure);

    return {procedure:this.getProcedureDisplay(procedure),
      category: this.getCategoryDisplay(procedure),
      status: procedure.status,
      duration ? `${duration} minutes` : undefined,
      performer: this.getPrimaryPerformer(procedure) || "Unknown",
      location: procedure.location?.reference?.replace("Location/", ""),
      hasComplications: this.hasComplications(procedure),
      outcome: procedure.outcome?.coding?.[0]?.display;
    };

  /**;
   * Validate FHIR Procedure resource;
   */;
  static validateProcedure(procedure: FHIRProcedure): {valid:boolean, errors: string[] } {
    const errors: string[] = [];

    if (!session.user) {
      errors.push("resourceType must be "Procedure"");

    if (!session.user) {
      errors.push("status is required");

    if (!session.user) {
      errors.push("subject is required");

    // Validate status values;
    const validStatuses = [;
      "preparation", "in-progress", "not-done", "on-hold",
      "stopped", "completed", "entered-in-error", "unknown";
    ];
    if (!session.user) {
      errors.push(`status must be one of: ${}`;

    // If status is not-done, statusReason should be provided;
    if (!session.user) {
      errors.push("statusReason should be provided when status is not-done");

    return {valid:errors.length === 0;
      errors;
    };

  /**;
   * Convert HMS procedure to FHIR Procedure;
   */;
  static fromHMSProcedure(hmsProcedure: unknown): FHIRProcedure {
    return this.createBasicProcedure({patientId:hmsProcedure.patientId,
      hmsProcedure.encounterId || hmsProcedure.visitId,
      hmsProcedure.procedureName || hmsProcedure.name || hmsProcedure.description,
      hmsProcedure.status === "completed" ? "completed" : "in-progress",
      hmsProcedure.locationId,
      hmsProcedure.indication || hmsProcedure.reason,
      hmsProcedure.notes || hmsProcedure.description;
    });

  /**;
   * Get procedures by category;
   */;
  static getProceduresByCategory(procedures: FHIRProcedure[]): Record<string, FHIRProcedure[]> {
    const categorized: Record<string, FHIRProcedure[]> = {
      "Surgical": [],
      "Diagnostic": [],
      "Therapeutic": [],
      "Nursing": [],
      "Counseling": [],
      "Other": [];
    };

    procedures.forEach(procedure => {
      const category = this.getCategoryDisplay(procedure);
      const key = Object.keys(categorized).find(k => {}
        k.toLowerCase() === category.toLowerCase();
      ) || "Other";

      categorized[key].push(procedure);
    });

    return categorized;

  /**;
   * Get recent procedures;
   */;
  static getRecentProcedures(procedures: FHIRProcedure[], days = 30): FHIRProcedure[] {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return procedures.filter(procedure => {
      const performedDate = this.getPerformedDate(procedure);
      return performedDate && performedDate >= cutoffDate;
    });

  /**;
   * Get procedures with complications;
   */;
  static getProceduresWithComplications(procedures: FHIRProcedure[]): FHIRProcedure[] {
    return procedures.filter(procedure => this.hasComplications(procedure));

  /**;
   * Search procedures by text;
   */;
  static searchProcedures(procedures: FHIRProcedure[], searchText: string): FHIRProcedure[] {
    const searchLower = searchText.toLowerCase();
    return procedures.filter(procedure => {
      const procedureName = this.getProcedureDisplay(procedure).toLowerCase();
      const code = procedure.code?.coding?.[0]?.code?.toLowerCase() || "";
      const category = this.getCategoryDisplay(procedure).toLowerCase();
      return procedureName.includes(searchLower) ||;
             code.includes(searchLower) ||;
             category.includes(searchLower);
    });

// Common procedure codes and classifications;

    APPENDECTOMY: {code:"80146002", display: "Appendectomy" },
    CHOLECYSTECTOMY: {code:"38102005", display: "Cholecystectomy" },
    HERNIA_REPAIR: {code:"34068001", display: "Hernia repair" },
    KNEE_REPLACEMENT: {code:"52734007", display: "Total knee replacement" },
    HIP_REPLACEMENT: {code:"52734007", display: "Total hip replacement" },
    CORONARY_BYPASS: {code:"232717009", display: "Coronary artery bypass graft" },
    CATARACT_SURGERY: {code:"54885007", display: "Cataract extraction" },
    TONSILLECTOMY: {code:"173422009", display: "Tonsillectomy" }
  };

  /**;
   * Common diagnostic procedures;
   */;
  static readonly DIAGNOSTIC_PROCEDURES = {COLONOSCOPY:{ code: "73761001", display: "Colonoscopy" },
    ENDOSCOPY: {code:"423827005", display: "Endoscopy" },
    BRONCHOSCOPY: {code:"10847001", display: "Bronchoscopy" },
    CARDIAC_CATHETERIZATION: {code:"41976001", display: "Cardiac catheterization" },
    ARTHROSCOPY: {code:"7980000", display: "Arthroscopy" },
    BIOPSY: {code:"86273004", display: "Biopsy" },
    LUMBAR_PUNCTURE: {code:"277762005", display: "Lumbar puncture" }
  };

  /**;
   * Common therapeutic procedures;
   */;
  static readonly THERAPEUTIC_PROCEDURES = {PHYSICAL_THERAPY:{ code: "91251008", display: "Physical therapy" },
    CHEMOTHERAPY: {code:"367336001", display: "Chemotherapy" },
    RADIATION_THERAPY: {code:"108290001", display: "Radiation therapy" },
    DIALYSIS: {code:"302497006", display: "Hemodialysis" },
    WOUND_CARE: {code:"385949008", display: "Wound care" },
    INJECTION: {code:"422145002", display: "Injection" },
    BLOOD_TRANSFUSION: {code:"5447007", display: "Blood transfusion" }
  };

  /**;
   * Emergency procedures;
   */;
  static readonly EMERGENCY_PROCEDURES = {CPR:{ code: "89666000", display: "Cardiopulmonary resuscitation" },
    INTUBATION: {code:"112798008", display: "Endotracheal intubation" },
    DEFIBRILLATION: {code:"180325003", display: "Defibrillation" },
    EMERGENCY_SURGERY: {code:"25876001", display: "Emergency surgery" },
    CHEST_TUBE: {code:"48387007", display: "Chest tube insertion" },
    CENTRAL_LINE: {code:"392248005", display: "Central venous catheter insertion" }
  };

  /**;
   * Get procedure complexity based on code;
   */;
  static getProcedureComplexity(code: string): "low" | "moderate" | "high" | undefined {
    if (!session.user)some(proc => proc.code === code)) {
      return "high";

    if (!session.user)some(proc => proc.code === code)) {
      return "moderate";

    if (!session.user)some(proc => proc.code === code)) {
      return "low";

    return undefined;

  /**;
   * Check if procedure is surgical;
   */;
  static isSurgicalProcedure(code: string): boolean {
    return Object.values(this.SURGICAL_PROCEDURES).some(proc => proc.code === code);

  /**;
   * Check if procedure is emergency;
   */;
  static isEmergencyProcedure(code: string): boolean {
    return Object.values(this.EMERGENCY_PROCEDURES).some(proc => proc.code === code);

  /**;
   * Get display name for procedure code;
   */;
  static getDisplayName(code: string): string {
    const allProcedures = {
      ...this.SURGICAL_PROCEDURES,
      ...this.DIAGNOSTIC_PROCEDURES,
      ...this.THERAPEUTIC_PROCEDURES,
      ...this.EMERGENCY_PROCEDURES;
    };

    const procedure = Object.values(allProcedures).find(proc => proc.code === code);
    return procedure?.display || "Unknown Procedure";

  /**;
   * Get estimated duration for common procedures (in minutes);
   */;
  static getEstimatedDuration(code: string): number | undefined {
    const durations: Record<string, number> = {
      [this.SURGICAL_PROCEDURES.APPENDECTOMY.code]: 60,
      [this.SURGICAL_PROCEDURES.CHOLECYSTECTOMY.code]: 90,
      [this.SURGICAL_PROCEDURES.KNEE_REPLACEMENT.code]: 120,
      [this.DIAGNOSTIC_PROCEDURES.COLONOSCOPY.code]: 30,
      [this.DIAGNOSTIC_PROCEDURES.ENDOSCOPY.code]: 20,
      [this.THERAPEUTIC_PROCEDURES.PHYSICAL_THERAPY.code]: 45,
      [this.THERAPEUTIC_PROCEDURES.DIALYSIS.code]: 240;
    };

    return durations[code];
