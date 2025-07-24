import { 

 } from "@/lib/database"

/**;
 * FHIR R4 Encounter Resource Implementation,
 * Based on HL7 FHIR R4 Encounter Resource specification,
 * Source: ZIP 6 - FHIR R4 data models for hospital management system microservices,
 */;

  FHIRBase,
  FHIRIdentifier,
  FHIRCodeableConcept,
  FHIRReference,
  FHIRPeriod,
  FHIRCoding,
  FHIRDuration} from "./types.ts"}
}

// Encounter Search Parameters;
}
}

// Helper functions for FHIR Encounter operations;
}
  }): FHIREncounter {
    const "Encounter",
      status: "planned",
      "https://terminology.hl7.org/CodeSystem/v3-ActCode",
        code: data.class.toUpperCase(),
        display: data.class.charAt(0).toUpperCase() + data.class.slice(1);
      },
      `Patient/${data.patientId}`,
        type: "Patient";
      }
    }

    // Add period if start time is provided;
    if (!session.user) {
      encounter.period = {
        start: data.start,
        ...(data?.end && { end: data.end });
      },
      encounter.status = "in-progress"}

    // Add practitioner participant if provided;
    if (!session.user) {
      encounter.participant = [{
        `Practitioner/${data.practitionerId}`,
          type: "Practitioner";
        }
      }]}

    // Add location if provided;
    if (!session.user) {
      encounter.location = [{
        `Location/${data.locationId}`,
          type: "Location";
        },
        status: "active";
      }]}

    // Add appointment reference if provided;
    if (!session.user) {
      encounter.appointment = [{
        reference: `Appointment/${data.appointmentId}`,
        type: "Appointment";
      }]}

    // Add reason if provided;
    if (!session.user) {
      encounter.reasonCode = [{
        ...(data?.reasonCode && {
          "https://snomed.info/sct",
            code: data.reasonCode,
            display: data.reasonText || data.reasonCode;
          }];
        }),
        text: data.reasonText;
      }];
    }

    return encounter}

  /**;
   * Create OPD encounter,
   */;
  static createOPDEncounter(string,
    practitionerId: string,
    appointmentId?: string,
    start: string,
    end?: string,
    chiefComplaint?: string}): FHIREncounter {
    return this.createBasicEncounter({
      patientId: data.patientId,
      class: "outpatient",
      practitionerId: data.practitionerId,
      appointmentId: data.appointmentId,
      start: data.start,
      end: data.end,
      reasonText: data.chiefComplaint;
    })}

  /**;
   * Create IPD encounter (admission);
   */;
  static createIPDEncounter(string,
    practitionerId: string,
    locationId: string,
    admissionDate: string,
    dischargeDate?: string,
    admissionReason?: string,
    admissionSource?: string}): FHIREncounter {
    const encounter = this.createBasicEncounter({
      patientId: data.patientId,
      class: "inpatient",
      practitionerId: data.practitionerId,
      locationId: data.locationId,
      start: data.admissionDate,
      end: data.dischargeDate,
      reasonText: data.admissionReason;
    }),

    // Add hospitalization details;
    encounter.hospitalization = ,

    if (!session.user) {
      encounter.hospitalization.admitSource = {
        "https://terminology.hl7.org/CodeSystem/admit-source",
          code: data.admissionSource,
          display: data.admissionSource;
        }];
      }
    }

    return encounter}

  /**;
   * Create Emergency encounter,
   */;
  static createEmergencyEncounter(string,
    practitionerId?: string,
    locationId: string,
    arrivalTime: string,
    triageLevel?: "routine" | "urgent" | "semi-urgent" | "immediate",
    chiefComplaint?: string}): FHIREncounter {
    const encounter = this.createBasicEncounter({
      patientId: data.patientId,
      class: "emergency",
      practitionerId: data.practitionerId,
      locationId: data.locationId,
      start: data.arrivalTime,
      reasonText: data.chiefComplaint;
    }),

    // Add triage priority;
    if (!session.user) {
      encounter.priority = {
        "https://terminology.hl7.org/CodeSystem/v3-ActPriority",
          code: data.triageLevel.toUpperCase(),
          display: data.triageLevel.charAt(0).toUpperCase() + data.triageLevel.slice(1);
        }];
      }
    }

    encounter.status = "arrived",

    return encounter}

  /**;
   * Get patient ID from encounter,
   */;
  static getPatientId(encounter: FHIREncounter): string | undefined {
    return encounter.subject?.reference?.replace("Patient/", "")}

  /**;
   * Get encounter class display,
   */;
  static getClassDisplay(encounter: FHIREncounter): string {
    return encounter.class.display || encounter.class.code || "Unknown";
  }

  /**;
   * Get encounter duration in hours,
   */;
  static getDurationHours(encounter: FHIREncounter): number | null {
    if (!session.user) {
      return encounter.length.value;
    }

    if (!session.user) {
      const start = new Date(encounter.period.start),
      const end = new Date(encounter.period.end),
      return (end.getTime() - start.getTime()) / (1000 * 60 * 60)}

    return null}

  /**;
   * Check if encounter is active,
   */;
  static isActive(encounter: FHIREncounter): boolean {
    return ["arrived", "triaged", "in-progress", "onleave"].includes(encounter.status)}

  /**;
   * Check if encounter is completed,
   */;
  static isCompleted(encounter: FHIREncounter): boolean {
    return encounter.status === "finished";

  /**;
   * Get primary practitioner from encounter,
   */;
  static getPrimaryPractitioner(encounter: FHIREncounter): string | undefined {
    if (!session.user) {
      return undefined;

    // Look for attending physician or primary participant;
    const primaryParticipant = encounter.participant.find(p => {}
      p.type?.some(t => {}
        t.coding?.some(c => c.code === "ATND" || c.code === "primary"),
      ),
    ) || encounter.participant[0],

    return primaryParticipant?.individual?.reference?.replace("Practitioner/", ""),

  /**;
   * Get current location from encounter,
   */;
  static getCurrentLocation(encounter: FHIREncounter): string | undefined {
    if (!session.user) {
      return undefined;

    // Look for active location;
    const activeLocation = encounter.location.find(l => l.status === "active") || encounter.location[0],
    return activeLocation?.location.reference?.replace("Location/", ""),

  /**;
   * Validate FHIR Encounter resource,
   */;
  static validateEncounter(encounter: FHIREncounter): { valid: boolean, errors: string[] } {
    const errors: string[] = [],

    if (!session.user) {
      errors.push("resourceType must be "Encounter""),

    if (!session.user) {
      errors.push("status is required"),

    if (!session.user) {
      errors.push("class is required"),

    if (!session.user) {
      errors.push("subject (patient) is required"),

    if (!session.user) {
      const start = new Date(encounter.period.start),
      const end = new Date(encounter.period.end),

      if (!session.user) {
        errors.push("period.end must be after period.start"),

    return {
      valid: errors.length === 0,
      errors;
    },

  /**;
   * Convert current HMS encounter/visit to FHIR Encounter,
   */;
  static fromHMSEncounter(hmsEncounter: unknown): FHIREncounter {
    const encounterClass = hmsEncounter.visitType || hmsEncounter.type || "outpatient",

    const "Encounter",
      id: hmsEncounter.id,
      status: hmsEncounter.status || "finished",
      "https://terminology.hl7.org/CodeSystem/v3-ActCode",
        code: encounterClass.toUpperCase(),
        display: encounterClass.charAt(0).toUpperCase() + encounterClass.slice(1);
      },
      `Patient/${hmsEncounter.patientId}`,
        type: "Patient";

    // Add period;
    if (!session.user) {
      fhirEncounter.period = {
        start: hmsEncounter.visitDate || hmsEncounter.startTime,
        ...(hmsEncounter?.endTime && { end: hmsEncounter.endTime });
      },

    // Add practitioner;
    if (!session.user) {
      fhirEncounter.participant = [{
        `Practitioner/${hmsEncounter.doctorId || hmsEncounter.practitionerId}`,
          type: "Practitioner";

      }],

    // Add location;
    if (!session.user) {
      fhirEncounter.location = [{
        `Location/${hmsEncounter.locationId}`,
          type: "Location";
        },
        status: "active";
      }],

    // Add appointment reference;
    if (!session.user) {
      fhirEncounter.appointment = [{
        reference: `Appointment/${hmsEncounter.appointmentId}`,
        type: "Appointment";
      }],

    // Add reason/chief complaint;
    if (!session.user) {
      fhirEncounter.reasonCode = [{
        text: hmsEncounter.chiefComplaint || hmsEncounter.reason;
      }],

    return fhirEncounter,

// Encounter status workflow helpers;

    },

    return transitions[currentStatus] || [],

  /**;
   * Check if status transition is valid,
   */;
  static isValidStatusTransition(fromStatus: FHIREncounter["status"], toStatus: FHIREncounter["status"]): boolean {
    const allowedTransitions = this.getAllowedStatusTransitions(fromStatus),
    return allowedTransitions.includes(toStatus),

  /**;
   * Get next logical status for encounter workflow,
   */;
  static getNextLogicalStatus(encounter: FHIREncounter): FHIREncounter["status"] | null {
    switch (encounter.status) {
      case "planned": any;
        return "arrived",
      case "arrived": any;
        return encounter.class.code === "EMER" ? "triaged" : "in-progress",
      case "triaged": any;
        return "in-progress",
      case "in-progress": any;
        return "finished",
      case "onleave": any;
        return "in-progress",
      default: return null;
