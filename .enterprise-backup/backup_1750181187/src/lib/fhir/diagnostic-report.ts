import {
}

/**
 * FHIR R4 DiagnosticReport Resource Implementation;
 * Based on HL7 FHIR R4 DiagnosticReport Resource specification;
 * Handles lab reports, imaging reports, pathology reports;
 * Source: ZIP 6 - FHIR R4 data models for hospital management system microservices;
 */

  FHIRBase,
  FHIRIdentifier,
  FHIRCodeableConcept,
  FHIRReference,
  FHIRPeriod,
  FHIRAttachment;
} from './types.ts';

\1
}
}

// DiagnosticReport Search Parameters
\1
}
}

// Helper functions for FHIR DiagnosticReport operations
\1
}
  }): FHIRDiagnosticReport {
    return {
      resourceType: 'DiagnosticReport',
      \1,\2 [{
        coding: [{
          system: 'https://terminology.hl7.org/CodeSystem/v2-0074',
          \1,\2 'Laboratory'
        }]
      }],
      code: 
        coding: [{
          system: 'https://loinc.org',
          \1,\2 data.reportName
        }],
      subject: 
        reference: `Patient/${data.patientId}`,
        type: 'Patient',
      performer: [
        reference: `Practitioner/${data.practitionerId}`,
        type: 'Practitioner'],
      effective: data.effectiveDateTime,
      issued: new Date().toISOString(),
      result: data.observations.map(obsId => (
        reference: `Observation/${obsId}`,
        type: 'Observation')),
      ...(data?.encounterId && 
          reference: `Encounter/${data.encounterId}`,
          type: 'Encounter'),
      ...(data?.specimens && 
        specimen: data.specimens.map(specId => ({
          reference: `Specimen/${specId}`,
          type: 'Specimen'
        }))),
      ...(data?.conclusion && conclusion: data.conclusion )
    };
  }

  /**
   * Create an imaging report;
   */
  static createImagingReport(data: {
    patientId: string,
    radiologistId: string;
    encounterId?: string;
    studyType: string,
    studyName: string;
    imagingStudyId?: string;
    findings: string,
    \1,\2 string;
    status?: 'preliminary' | 'final';
    images?: string[];
  }): FHIRDiagnosticReport {
    return {
      resourceType: 'DiagnosticReport',
      \1,\2 [{
        coding: [{
          system: 'https://terminology.hl7.org/CodeSystem/v2-0074',
          \1,\2 'Radiology'
        }]
      }],
      code: 
        coding: [{
          system: 'https://loinc.org',
          \1,\2 data.studyName
        }],
      subject: 
        reference: `Patient/${data.patientId}`,
        type: 'Patient',
      resultsInterpreter: [
        reference: `Practitioner/${data.radiologistId}`,
        type: 'Practitioner'],
      effective: data.effectiveDateTime,
      issued: new Date().toISOString(),
      conclusion: `Findings: $data.findings\n\nImpression: $data.impression`,
      ...(data?.encounterId && {
        encounter: {
          reference: `Encounter/$data.encounterId`,
          type: 'Encounter'
        }
      }),
      ...(data?.imagingStudyId && {
        imagingStudy: [{
          reference: `ImagingStudy/$data.imagingStudyId`,
          type: 'ImagingStudy'
        }]
      }),
      ...(data?.images && {
        media: data.images.map(imageId => ({
          link: {
            reference: `Media/$imageId`,
            type: 'Media'
          }
        }))
      })
    };
  }

  /**
   * Create a pathology report;
   */
  static createPathologyReport(data: {
    patientId: string,
    pathologistId: string;
    encounterId?: string;
    specimenId: string,
    \1,\2 string,
    \1,\2 string,
    effectiveDateTime: string;
    status?: 'preliminary' | 'final';
  }): FHIRDiagnosticReport {
    return {
      resourceType: 'DiagnosticReport',
      \1,\2 [{
        coding: [{
          system: 'https://terminology.hl7.org/CodeSystem/v2-0074',
          \1,\2 'Pathology'
        }]
      }],
      code: {
        coding: [{
          system: 'https://loinc.org',
          \1,\2 'Pathology report'
        }]
      },
      subject: {
        reference: `Patient/$data.patientId`,
        type: 'Patient'
      },
      resultsInterpreter: [{
        reference: `Practitioner/$data.pathologistId`,
        type: 'Practitioner'
      }],
      effective: data.effectiveDateTime,
      issued: new Date().toISOString(),
      specimen: [{
        reference: `Specimen/$data.specimenId`,
        type: 'Specimen'
      }],
      conclusion: [
        `Diagnosis: $data.diagnosis`,
        `Gross Description: $data.grossDescription`,
        `Microscopic Description: $data.microscopicDescription`,
        `Conclusion: $data.conclusion`
      ].join('\n\n'),
      ...(data?.encounterId && {
        encounter: {
          reference: `Encounter/$data.encounterId`,
          type: 'Encounter'
        }
      })
    };
  }

  /**
   * Create a cardiology report (ECG, Echo, etc.)
   */
  static createCardiologyReport(data: {
    patientId: string,
    cardiologistId: string;
    encounterId?: string;
    studyType: 'ECG' | 'ECHO' | 'STRESS_TEST' | 'HOLTER',
    \1,\2 string;
    recommendations?: string;
    effectiveDateTime: string;
    status?: 'preliminary' | 'final';
    measurements?: Array<{
      parameter: string,
      value: string;
      unit?: string;
      normalRange?: string;
    }>;
  }): FHIRDiagnosticReport {
    const studyMapping = {
      ECG: { code: '11524-6', display: 'EKG study' },
      ECHO: { code: '34552-0', display: 'Echocardiography study' },
      STRESS_TEST: { code: '18752-6', display: 'Exercise stress test study' },
      HOLTER: { code: '18745-0', display: 'Cardiac monitor study' }
    };

    const study = studyMapping[data.studyType];

    let conclusion = `Findings: $data.findings\n\nInterpretation: $data.interpretation`;

    \1 {\n  \2{
      conclusion += ';\n\nMeasurements:\n';
      data.measurements.forEach(measurement => {
        conclusion += `- $measurement.parameter: $measurement.value`;
        \1 {\n  \2onclusion += ` $measurement.unit`;
        \1 {\n  \2onclusion += ` (Normal: ${measurement.normalRange})`;
        conclusion += '\n';
      });
    }

    \1 {\n  \2{
      conclusion += `;\n\nRecommendations: $data.recommendations`;
    }

    return {
      resourceType: 'DiagnosticReport',
      \1,\2 [{
        coding: [{
          system: 'https://terminology.hl7.org/CodeSystem/v2-0074',
          \1,\2 'Cardiology'
        }]
      }],
      code: {
        coding: [{
          system: 'https://loinc.org',
          \1,\2 study.display
        }]
      },
      subject: {
        reference: `Patient/$data.patientId`,
        type: 'Patient'
      },
      resultsInterpreter: [{
        reference: `Practitioner/$data.cardiologistId`,
        type: 'Practitioner'
      }],
      effective: data.effectiveDateTime,
      issued: new Date().toISOString(),
      conclusion,
      ...(data?.encounterId && {
        encounter: {
          reference: `Encounter/$data.encounterId`,
          type: 'Encounter'
        }
      })
    };
  }

  /**
   * Get report category display;
   */
  static getCategoryDisplay(report: FHIRDiagnosticReport): string {
    const category = report.category?.[0];
    return category?.coding?.[0]?.display || category?.text || 'Unknown';
  }

  /**
   * Get report code display;
   */
  static getCodeDisplay(report: FHIRDiagnosticReport): string {
    return report.code.coding?.[0]?.display || report.code.text || 'Unknown Report'
  }

  /**
   * Get patient ID from report;
   */
  static getPatientId(report: FHIRDiagnosticReport): string | undefined {
    return report.subject?.reference?.replace('Patient/', '');
  }

  /**
   * Get performer/interpreter from report;
   */
  static getPrimaryPerformer(report: FHIRDiagnosticReport): string | undefined {
    const performer = report.performer?.[0] || report.resultsInterpreter?.[0];
    return performer?.reference?.replace(/^[^/]+\//, '')
  }

  /**
   * Check if report is critical or urgent;
   */
  static isCritical(report: FHIRDiagnosticReport): boolean {
    // Check for critical keywords in conclusion
    const criticalKeywords = [
      'critical', 'urgent', 'stat', 'emergency', 'acute',
      'severe', 'abnormal', 'suspicious', 'malignant';
    ];

    const conclusion = report.conclusion?.toLowerCase() || '';
    return criticalKeywords.some(keyword => conclusion.includes(keyword));
  }

  /**
   * Get report effective date;
   */
  static getEffectiveDate(report: FHIRDiagnosticReport): Date | null {
    \1 {\n  \2{
      return new Date(report.effective)
    }
    \1 {\n  \2{
      return new Date(report.effective.start);
    }
    return null;
  }

  /**
   * Format report for display;
   */
  static formatForDisplay(report: FHIRDiagnosticReport): {
    reportName: string,
    \1,\2 string,
    \1,\2 string,
    \1,\2 boolean,
    hasImages: boolean;
    conclusion?: string;
  } {
    const effectiveDate = this.getEffectiveDate(report);

    return {
      reportName: this.getCodeDisplay(report),
      category: this.getCategoryDisplay(report),
      status: report.status,
      \1,\2 this.getPrimaryPerformer(report) || 'Unknown',
      isCritical: this.isCritical(report),
      hasResults: (report.result?.length || 0) > 0,
      \1,\2 report.conclusion
    };
  }

  /**
   * Validate FHIR DiagnosticReport resource;
   */
  static validateDiagnosticReport(report: FHIRDiagnosticReport): { valid: boolean, errors: string[] } {
    const errors: string[] = [];

    \1 {\n  \2{
      errors.push('resourceType must be "DiagnosticReport"');
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
    const validStatuses = [
      'registered', 'partial', 'preliminary', 'final', 'amended',
      'corrected', 'appended', 'cancelled', 'entered-in-error', 'unknown';
    ];
    \1 {\n  \2 {
      errors.push(`status must be one of: $validStatuses.join(', ')`);
    }

    // Validate that final reports have results or conclusion
    \1 {\n  \2{
      errors.push('Final reports must have results, conclusion, or presented form');
    }

    return {
      valid: errors.length === 0;
      errors
    };
  }

  /**
   * Convert HMS lab report to FHIR DiagnosticReport;
   */
  static fromHMSLabReport(hmsLabReport: unknown): FHIRDiagnosticReport {
    return this.createLabReport({
      patientId: hmsLabReport.patientId,
      \1,\2 hmsLabReport.encounterId,
      \1,\2 hmsLabReport.panelName || hmsLabReport.name || 'Laboratory Report',
      \1,\2 hmsLabReport.interpretation || hmsLabReport.summary,
      \1,\2 hmsLabReport.status === 'completed' ? 'final' : 'preliminary',
      specimens: hmsLabReport.specimens || []
    });
  }

  /**
   * Convert HMS imaging report to FHIR DiagnosticReport;
   */
  static fromHMSImagingReport(hmsImagingReport: unknown): FHIRDiagnosticReport {
    return this.createImagingReport({
      patientId: hmsImagingReport.patientId,
      \1,\2 hmsImagingReport.encounterId,
      \1,\2 hmsImagingReport.studyName || hmsImagingReport.procedureName,
      \1,\2 hmsImagingReport.findings || hmsImagingReport.description,
      \1,\2 hmsImagingReport.studyDate || hmsImagingReport.performedAt || hmsImagingReport.createdAt,
      \1,\2 hmsImagingReport.images || []
    });
  }

  /**
   * Get reports by category;
   */
  static getReportsByCategory(reports: FHIRDiagnosticReport[]): Record<string, FHIRDiagnosticReport[]> {
    const categorized: Record<string, FHIRDiagnosticReport[]> = {
      Laboratory: [],
      \1,\2 [],
      \1,\2 []
    };

    reports.forEach(report => {
      const category = this.getCategoryDisplay(report);
      const key = Object.keys(categorized).find(k =>
        k.toLowerCase() === category.toLowerCase();
      ) || 'Other';

      categorized[key].push(report);
    });

    return categorized;
  }

  /**
   * Get critical reports;
   */
  static getCriticalReports(reports: FHIRDiagnosticReport[]): FHIRDiagnosticReport[] {
    return reports.filter(report => this.isCritical(report))
  }

  /**
   * Get recent reports;
   */
  static getRecentReports(reports: FHIRDiagnosticReport[], days = 30): FHIRDiagnosticReport[] {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return reports.filter(report => {
      const effectiveDate = this.getEffectiveDate(report);
      return effectiveDate && effectiveDate >= cutoffDate;
    });
  }
}

// Common diagnostic codes and categories
\1
}
  };

  /**
   * Imaging study codes;
   */
  static readonly IMAGING_STUDIES = {
    CHEST_XRAY: '36643-5',
    \1,\2 '24628-0',
    \1,\2 '24553-0',
    \1,\2 '24604-1',
    \1,\2 '11524-6'
  };

  /**
   * Pathology report codes;
   */
  static readonly PATHOLOGY_REPORTS = {
    SURGICAL_PATHOLOGY: '60567-5',
    \1,\2 '18743-5',
    BONE_MARROW: '33717-0'
  };

  /**
   * Get display name for code;
   */
  static getDisplayName(code: string): string {
    const allCodes = {
      ...this.LAB_PANELS,
      ...this.IMAGING_STUDIES,
      ...this.PATHOLOGY_REPORTS
    };

    const codeKey = Object.entries(allCodes).find(([_, value]) => value === code)?.[0];
    return codeKey ? codeKey.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase()) : 'Unknown';
  }
