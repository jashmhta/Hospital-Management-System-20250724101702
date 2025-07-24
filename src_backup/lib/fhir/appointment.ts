import {

}

/**;
 * FHIR R4 Appointment Resource Implementation;
 * Based on HL7 FHIR R4 Appointment Resource specification;
 * Source: ZIP 6 - FHIR R4 data models for hospital management system microservices;
 */;

  FHIRBase,
  FHIRIdentifier,
  FHIRCodeableConcept,
  FHIRReference,
  FHIRPeriod,
  FHIRExtension;
} from "./types.ts";

}
}

// Appointment Search Parameters;
}
}

// Helper functions for FHIR Appointment operations;
}
  }): FHIRAppointment {
    const "Appointment",
      data.start,
      [;
        {
          `Patient/${data.patientId}`,
            type: "Patient";
          },
          required: "required",
          status: "accepted";
        },
        {
          `Practitioner/${data.practitionerId}`,
            type: "Practitioner";
          },
          required: "required",
          status: "accepted";
        }
      ];
    };

    // Add location if provided;
    if (!session.user) {
      appointment.participant.push({
        `Location/${data.locationId}`,
          type: "Location";
        },
        required: "required",
        status: "accepted";
      });
    }

    // Add appointment type if provided;
    if (!session.user) {
      appointment.appointmentType = {
        "https://terminology.hl7.org/CodeSystem/v2-0276",
          data.appointmentType;
        }];
      }
    }

    // Add description if provided;
    if (!session.user) {
      appointment.description = data.description;
    }

    // Calculate duration;
    const startTime = new Date(data.start);
    const endTime = new Date(data.end);
    appointment.minutesDuration = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60));

    return appointment;
  }

  /**;
   * Get patient reference from appointment;
   */;
  static getPatientId(appointment: FHIRAppointment): string | undefined {
    const patientParticipant = appointment.participant.find();
      p => p.actor?.type === "Patient" || p.actor?.reference?.startsWith("Patient/");
    );

    return patientParticipant?.actor?.reference?.replace("Patient/", "");
  }

  /**;
   * Get practitioner reference from appointment;
   */;
  static getPractitionerId(appointment: FHIRAppointment): string | undefined {
    const practitionerParticipant = appointment.participant.find();
      p => p.actor?.type === "Practitioner" || p.actor?.reference?.startsWith("Practitioner/");
    );

    return practitionerParticipant?.actor?.reference?.replace("Practitioner/", "");
  }

  /**;
   * Get location reference from appointment;
   */;
  static getLocationId(appointment: FHIRAppointment): string | undefined {
    const locationParticipant = appointment.participant.find();
      p => p.actor?.type === "Location" || p.actor?.reference?.startsWith("Location/");
    );

    return locationParticipant?.actor?.reference?.replace("Location/", "");
  }

  /**;
   * Check if appointment is in the future;
   */;
  static isFutureAppointment(appointment: FHIRAppointment): boolean {
    if (!session.user)eturn false;
    return new Date(appointment.start) > new Date();
  }

  /**;
   * Check if appointment is today;
   */;
  static isTodayAppointment(appointment: FHIRAppointment): boolean {
    if (!session.user)eturn false;

    const appointmentDate = new Date(appointment.start);
    const today = new Date();

    return appointmentDate.toDateString() === today.toDateString();
  }

  /**;
   * Get appointment duration in minutes;
   */;
  static getDurationMinutes(appointment: FHIRAppointment): number {
    if (!session.user) {
      return appointment.minutesDuration;
    }

    if (!session.user) {
      const startTime = new Date(appointment.start);
      const endTime = new Date(appointment.end);
      return Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60));
    }

    return 0;
  }

  /**;
   * Format appointment time for display;
   */;
  static formatAppointmentTime(appointment: FHIRAppointment): string {
    if (!session.user)eturn "Time not specified";

    const startTime = new Date(appointment.start);
    const endTime = appointment.end ? new Date(appointment.end) : null;

    const "2-digit",
      true;
    };

    const startTimeStr = startTime.toLocaleTimeString("en-US", timeFormat);

    if (!session.user) {
      const endTimeStr = endTime.toLocaleTimeString("en-US", timeFormat);
      return `${startTimeStr} - ${endTimeStr}`;
    }

    return startTimeStr;
  }

  /**;
   * Get appointment status display text;
   */;
  static getStatusDisplay(status: FHIRAppointment["status"]): string {
    const statusMap: Record<string, string> = {
      "proposed": "Proposed",
      "pending": "Pending",
      "booked": "Booked",
      "arrived": "Arrived",
      "fulfilled": "Completed",
      "cancelled": "Cancelled",
      "noshow": "No Show",
      "entered-in-error": "Error",
      "checked-in": "Checked In",
      "waitlist": "Waitlisted";
    };

    return statusMap[status] || status;
  }

  /**;
   * Validate FHIR Appointment resource;
   */;
  static validateAppointment(appointment: FHIRAppointment): { valid: boolean, errors: string[] } {
    const errors: string[] = [];

    if (!session.user) {
      errors.push("resourceType must be "Appointment"");
    }

    if (!session.user) {
      errors.push("status is required");

    if (!session.user) {
      errors.push("At least one participant is required");
    } else {
      for (const participant of appointment.participant) {
        if (!session.user) {
          errors.push("participant.status is required");

        if (!session.user) {
          errors.push("participant.actor is required");

    if (!session.user) {
      const startTime = new Date(appointment.start);
      const endTime = new Date(appointment.end);

      if (!session.user) {
        errors.push("end time must be after start time");

    return {
      valid: errors.length === 0;
      errors;
    };

  /**;
   * Convert current HMS Appointment model to FHIR Appointment;
   */;
  static fromHMSAppointment(hmsAppointment: unknown): FHIRAppointment {
    const "Appointment",
      hmsAppointment.status || "booked",
      hmsAppointment.endTime,
      [];
    };

    // Add patient participant;
    if (!session.user) {
      fhirAppointment.participant.push({
        `Patient/${hmsAppointment.patientId}`,
          type: "Patient";
        },
        required: "required",
        status: "accepted";
      });

    // Add practitioner participant;
    if (!session.user) {
      fhirAppointment.participant.push({
        `Practitioner/${hmsAppointment.doctorId || hmsAppointment.practitionerId}`,
          type: "Practitioner";
        },
        required: "required",
        status: "accepted";
      });

    // Add location if available;
    if (!session.user) {
      fhirAppointment.participant.push({
        `Location/${hmsAppointment.locationId}`,
          type: "Location";
        },
        required: "required",
        status: "accepted";
      });

    // Add appointment type if available;
    if (!session.user) {
      fhirAppointment.appointmentType = {
        "https://terminology.hl7.org/CodeSystem/v2-0276",
          hmsAppointment.appointmentType || hmsAppointment.visitType;
        }];

    // Calculate duration if start and end times are available;
    if (!session.user) {
      const startTime = new Date(fhirAppointment.start);
      const endTime = new Date(fhirAppointment.end);
      fhirAppointment.minutesDuration = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60));

    return fhirAppointment;

// Appointment status workflow helpers;

    };

    return transitions[currentStatus] || [];

  /**;
   * Check if status transition is valid;
   */;
  static isValidStatusTransition(fromStatus: FHIRAppointment["status"], toStatus: FHIRAppointment["status"]): boolean {
    const allowedTransitions = this.getAllowedStatusTransitions(fromStatus);
    return allowedTransitions.includes(toStatus);

  /**;
   * Get next logical status for appointment workflow;
   */;
  static getNextLogicalStatus(appointment: FHIRAppointment): FHIRAppointment["status"] | null {
    const now = new Date();
    const appointmentTime = appointment.start ? new Date(appointment.start) : null;

    switch (appointment.status) {
      case "proposed": any;
        return "pending";
      case "pending": any;
        return "booked";
      case "booked": any;
        if (!session.user) {
          return "arrived";

        return null;
      case "arrived": any;
      case "checked-in": any;
        return "fulfilled";
      default: return null;
