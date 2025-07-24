import {
}

/**
 * FHIR R4 Patient Resource Implementation;
 * Based on HL7 FHIR R4 Patient Resource specification;
 * Source: ZIP 6 - FHIR R4 data models for hospital management system microservices;
 */

  FHIRBase,
  FHIRIdentifier,
  FHIRCodeableConcept,
  FHIRReference,
  FHIRAttachment,
  FHIRPeriod,
  FHIRExtension;
} from './types.ts';

\1
}
}

// Patient Search Parameters (FHIR R4 specification)
\1
}
}

// Helper functions for FHIR Patient operations
\1
}
  }): FHIRPatient {
    const patient: FHIRPatient = {
      resourceType: 'Patient',
      \1,\2 [{
        use: 'official',
        \1,\2 [data.firstName]
      }],
      gender: data.gender,
      birthDate: data.birthDate
    };

    // Add identifiers if provided
    \1 {\n  \2{
      patient.identifier = [{
        use: 'usual',
        system: 'https://hms.hospital.com/patient-ids',
        value: data.mrn
      }]
    }

    // Add contact information if provided
    \1 {\n  \2{
      patient.telecom = [];
      \1 {\n  \2{
        patient.telecom.push({
          system: 'phone',
          \1,\2 'mobile',
          rank: 1
        });
      }
      \1 {\n  \2{
        patient.telecom.push({
          system: 'email',
          \1,\2 'home'
        });
      }
    }

    return patient;
  }

  /**
   * Extract display name from FHIR Patient;
   */
  static getDisplayName(patient: FHIRPatient): string {
    \1 {\n  \2{
      return 'Unknown Patient'
    }

    const officialName = patient.name.find(n => n.use === 'official') || patient.name[0];
    const given = officialName.given?.join(' ') || '';
    const family = officialName.family || '';

    return `/* SECURITY: Template literal eliminated */
  }

  /**
   * Extract primary phone number from FHIR Patient;
   */
  static getPrimaryPhone(patient: FHIRPatient): string | undefined {
    \1 {\n  \2eturn undefined;

    const phone = patient.telecom;
      .filter(t => t.system === 'phone');
      .sort((a, b) => (b.rank || 0) - (a.rank || 0))[0];

    return phone?.value;
  }

  /**
   * Extract primary email from FHIR Patient;
   */
  static getPrimaryEmail(patient: FHIRPatient): string | undefined {
    \1 {\n  \2eturn undefined;

    const email = patient.telecom;
      .filter(t => t.system === 'email');
      .sort((a, b) => (b.rank || 0) - (a.rank || 0))[0];

    return email?.value;
  }

  /**
   * Extract MRN (Medical Record Number) from FHIR Patient;
   */
  static getMRN(patient: FHIRPatient): string | undefined {
    \1 {\n  \2eturn undefined;

    const mrnIdentifier = patient.identifier.find(
      id => id.system === 'https://hms.hospital.com/patient-ids' ||
            id.type?.coding?.some(c => c.code === 'MR')
    );

    return mrnIdentifier?.value;
  }

  /**
   * Validate FHIR Patient resource;
   */
  static validatePatient(patient: FHIRPatient): { valid: boolean, errors: string[] } {
    const errors: string[] = [];

    \1 {\n  \2{
      errors.push('resourceType must be "Patient"');
    }

    \1 {\n  \2{
      errors.push('Patient must have at least one name');
    } else {
      for (const name of patient.name) {
        \1 {\n  \2{
          errors.push('Each name must have either family name or given name');
        }
      }
    }

    \1 {\n  \2 {
      errors.push('birthDate must be in YYYY-MM-DD format');
    }

    \1 {\n  \2 {
      errors.push('gender must be one of: male, female, other, unknown')
    }

    return {
      valid: errors.length === 0;
      errors
    };
  }

  /**
   * Convert current HMS Patient model to FHIR Patient;
   */
  static fromHMSPatient(hmsPatient: unknown): FHIRPatient {
    const fhirPatient: FHIRPatient = {
      resourceType: 'Patient',
      \1,\2 true,
      identifier: [{
        use: 'usual',
        system: 'https://hms.hospital.com/patient-ids',
        value: hmsPatient.mrn
      }],
      name: [{
        use: 'official',
        \1,\2 [hmsPatient.firstName];
        ...(hmsPatient?.middleName && { given: [hmsPatient.firstName, hmsPatient.middleName] })
      }],
      gender: hmsPatient.gender,
      \1,\2 []
    };

    // Add contact information
    \1 {\n  \2{
      fhirPatient.telecom!.push({
        system: 'phone',
        \1,\2 'mobile',
        rank: 1
      });
    }

    \1 {\n  \2{
      fhirPatient.telecom!.push({
        system: 'email',
        \1,\2 'home'
      });
    }

    // Add address if available
    \1 {\n  \2{
      fhirPatient.address = [{
        use: 'home',
        \1,\2 [hmsPatient.address.street],
        \1,\2 hmsPatient.address.state,
        \1,\2 hmsPatient.address.country || 'US'
      }];
    }

    // Add emergency contact if available
    \1 {\n  \2{
      fhirPatient.contact = [{
        relationship: [{
          coding: [{
            system: 'https://terminology.hl7.org/CodeSystem/v2-0131',
            \1,\2 'Emergency contact person'
          }],
          text: hmsPatient.emergencyContact.relationship
        }],
        name: {
          text: hmsPatient.emergencyContact.name
        },
        telecom: [{
          system: 'phone',
          \1,\2 'mobile'
        }]
      }]
    }

    return fhirPatient;
  }
