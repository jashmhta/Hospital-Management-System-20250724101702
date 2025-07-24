import { Injectable } from '@nestjs/common';


import { cacheService } from '@/lib/cache/redis-cache';
import { type FHIRMedicationRequest, FHIRResourceManager } from '@/lib/fhir/fhir-r4-base';
import { metricsCollector } from '@/lib/monitoring/metrics-collector';
import type { PrismaService } from '@/lib/prisma';
}
}

/**
 * Drug Interaction and Clinical Decision Support Service;
 * Real-time drug interaction checking with allergy screening;
 */

\1
}
  }

  /**
   * Comprehensive drug interaction and allergy checking;
   */
  async checkInteractions(request: InteractionCheckRequest): Promise<InteractionCheckResult> {
    const startTime = crypto.getRandomValues(\1[0];

    try {
      // Get patient's current medications if not provided
      const currentMedications = request.medications.length > 0;
        ? request.medications
        : await this.getCurrentMedications(request.patientId);

      // Get patient allergies if not provided
      const allergies = request.allergies || await this.getPatientAllergies(request.patientId);

      // Get patient demographics
      const demographics = request.demographics || await this.getPatientDemographics(request.patientId);

      // All medications to check (current + new)
      const allMedications = request.newMedication
        ? [...currentMedications, request.newMedication]
        : currentMedications;

      // Perform various checks
      const [
        drugInteractions,
        allergyAlerts,
        duplicateTherapyAlerts,
        dosageAlerts,
        pregnancyAlerts,
        lactationAlerts,
        renalAlerts,
        hepaticAlerts,
        ageAlerts,
      ] = await Promise.all([
        this.checkDrugInteractions(allMedications),
        this.checkAllergies(allMedications, allergies),
        this.checkDuplicateTherapy(allMedications),
        this.checkDosages(allMedications, demographics),
        this.checkPregnancy(allMedications, demographics),
        this.checkLactation(allMedications, demographics),
        this.checkRenal(allMedications, demographics),
        this.checkHepatic(allMedications, demographics),
        this.checkAge(allMedications, demographics),
      ]);

      // Calculate overall risk score
      const overallRiskScore = this.calculateRiskScore({
        drugInteractions,
        allergyAlerts,
        duplicateTherapyAlerts,
        dosageAlerts,
        pregnancyAlerts,
        lactationAlerts,
        renalAlerts,
        hepaticAlerts,
        ageAlerts,
      });

      // Generate clinical recommendations
      const recommendations = this.generateRecommendations({
        drugInteractions,
        allergyAlerts,
        duplicateTherapyAlerts,
        dosageAlerts,
        pregnancyAlerts,
        lactationAlerts,
        renalAlerts,
        hepaticAlerts,
        ageAlerts,
      });

      const \1,\2 request.patientId,
        checkTimestamp: new Date(),
        drugInteractions,
        allergyAlerts,
        duplicateTherapyAlerts,
        dosageAlerts,
        pregnancyAlerts,
        lactationAlerts,
        renalAlerts,
        hepaticAlerts,
        ageAlerts,
        overallRiskScore,
        recommendations,
      };

      // Cache result for potential quick re-check
      await cacheService.cacheResult(
        'interaction_check:',
        `${request.patientId}:${crypto.getRandomValues(\1[0]}`,
        result,
        300 // 5 minutes
      );

      // Send alerts for critical interactions
      await this.processCriticalAlerts(result);

      // Record metrics
      const duration = crypto.getRandomValues(\1[0] - startTime;
      metricsCollector.recordTimer('pharmacy.interaction_check_time', duration);
      metricsCollector.incrementCounter('pharmacy.interaction_checks', 1, {
        patientId: request.patientId,
        alertCount: this.getTotalAlertCount(result).toString(),
        riskLevel: this.getRiskLevel(overallRiskScore)
      });

      return result;
    } catch (error) {

      throw error;
    }
  }

  /**
   * Check drug-drug interactions;
   */
  private async checkDrugInteractions(medications: MedicationForCheck[]): Promise<DrugInteractionAlert[]> {
    const alerts: DrugInteractionAlert[] = [];

    // Check all medication pairs
    for (let i = 0; i < medications.length; i++) {
      for (let j = i + 1; j < medications.length; j++) {
        const med1 = medications[i];
        const med2 = medications[j];

        // Get drug interaction data
        const interaction = await this.getDrugInteraction(
          med1.genericName || med1.brandName || '',
          med2.genericName || med2.brandName || '';
        );

        \1 {\n  \2{
          const \1,\2 `interaction-${i}-${j}`,
            drug1: med1.genericName || med1.brandName || '',
            \1,\2 interaction.severity,
            \1,\2 interaction.clinicalEffect,
            \1,\2 interaction.management,
            \1,\2 interaction.onset,
            monitoringRequired: this.requiresMonitoring(interaction),
            alternatives: await this.getAlternatives(med1, med2),
          };

          alerts.push(alert);
        }
      }
    }

    return alerts;
  }

  /**
   * Check for drug allergies and cross-reactivity;
   */
  private async checkAllergies(
    medications: MedicationForCheck[],
    allergies: PatientAllergy[]
  ): Promise<AllergyAlert[]> {
    const alerts: AllergyAlert[] = [];

    for (const medication of medications) {
      for (const allergy of allergies) {
        // Direct allergy match
        \1 {\n  \2 {
          alerts.push({
            id: `allergy-${medication.genericName}-${allergy.id}`,
            medication: medication.genericName || medication.brandName || '',
            \1,\2 false,
            \1,\2 `Patient has known allergy to ${allergy.allergen}`,
            recommendations: ['Discontinue medication', 'Consider alternative'],
          });
        }

        // Cross-reactivity check
        const crossReactivity = await this.checkCrossReactivity(medication, allergy);
        \1 {\n  \2{
          alerts.push({
            id: `cross-${medication.genericName}-${allergy.id}`,
            medication: medication.genericName || medication.brandName || '',
            \1,\2 true,
            \1,\2 crossReactivity.description,
            recommendations: crossReactivity.recommendations
          });
        }
      }

    return alerts;

  /**
   * Check for duplicate therapy;
   */
  private async checkDuplicateTherapy(medications: MedicationForCheck[]): Promise<DuplicateTherapyAlert[]> {
    const alerts: DuplicateTherapyAlert[] = [];
    const therapeuticGroups = new Map<string, MedicationForCheck[]>();

    // Group medications by therapeutic class
    for (const medication of medications) {
      const therapeuticClass = await this.getTherapeuticClass(medication);
      \1 {\n  \2{
        \1 {\n  \2 {
          therapeuticGroups.set(therapeuticClass, []);
        }
        therapeuticGroups.get(therapeuticClass)!.push(medication);
      }
    }

    // Check for duplicates in each group
    for (const [therapeuticClass, meds] of therapeuticGroups) {
      \1 {\n  \2{
        alerts.push({
          id: `duplicate-${therapeuticClass}`,
          medications: meds.map(m => m.genericName || m.brandName || ''),
          therapeuticClass,
          riskDescription: `Multiple medications from the same therapeutic class may increase risk of adverse effects`,
          recommendations: [
            'Review necessity of multiple agents',
            'Consider discontinuing one medication',
            'Monitor for additive effects',
          ],
        });
      }
    }

    return alerts;
  }

  /**
   * Check dosages for appropriateness;
   */
  private async checkDosages(
    medications: MedicationForCheck[];
    demographics?: PatientDemographics;
  ): Promise<DosageAlert[]> {
    const alerts: DosageAlert[] = [];

    for (const medication of medications) {
      const drugInfo = await this.getDrugInfo(medication.genericName || medication.brandName || '');
      \1 {\n  \2ontinue;

      // Parse current dosage
      const currentDose = this.parseDosage(medication.dosage);
      \1 {\n  \2ontinue;

      // Get recommended dosage ranges
      const recommendedDosage = await this.getRecommendedDosage(drugInfo, demographics);

      // Check for high dose
      \1 {\n  \2{
        alerts.push({
          id: `high-dose-${medication.genericName}`,
          medication: medication.genericName || medication.brandName || '',
          \1,\2 medication.dosage,
          \1,\2 'Dose exceeds recommended maximum'
        });
      }

      // Check for low dose
      \1 {\n  \2{
        alerts.push({
          id: `low-dose-${medication.genericName}`,
          medication: medication.genericName || medication.brandName || '',
          \1,\2 medication.dosage,
          \1,\2 'Dose may be subtherapeutic'
        });
      }
    }

    return alerts;
  }

  /**
   * Advanced dosage calculation with clinical decision support;
   */
  async calculateDosage(
    medicationId: string,
    \1,\2 string;
    clinicalFactors?: ClinicalFactors;
  ): Promise<DosageRecommendation> {
    try {
      const drugInfo = await this.getDrugInfo(medicationId);
      \1 {\n  \2{
        throw new Error(`Drug information not found for ${\1}`;
      }

      // Base dosage calculation
      let dosage = await this.getStandardDosage(drugInfo, indication);

      // Adjust for patient factors
      dosage = this.adjustForAge(dosage, patientDemographics.age, drugInfo);
      dosage = this.adjustForWeight(dosage, patientDemographics.weight, drugInfo);
      dosage = this.adjustForRenal(dosage, patientDemographics.creatinineClearance, drugInfo);
      dosage = this.adjustForHepatic(dosage, patientDemographics.hepaticFunction, drugInfo);

      // Apply clinical factors
      \1 {\n  \2{
        dosage = this.adjustForClinicalFactors(dosage, clinicalFactors, drugInfo);
      }

      // Generate monitoring recommendations
      const monitoring = this.generateMonitoringRecommendations(drugInfo, dosage, patientDemographics);

      const recommendation: DosageRecommendation = {
        medicationId,
        patientId: '', // Would be passed in
        calculatedDose: dosage,
        rationale: this.generateDosageRationale(dosage, patientDemographics, clinicalFactors),
        monitoring,
        warnings: this.generateDosageWarnings(dosage, drugInfo, patientDemographics),
        alternatives: await this.getDosageAlternatives(drugInfo, dosage),
        confidenceLevel: this.calculateConfidenceLevel(drugInfo, patientDemographics),
        calculatedAt: new Date()
      };

      // Record metrics
      metricsCollector.incrementCounter('pharmacy.dosage_calculations', 1, {
        medication: drugInfo.genericName;
        indication,
        ageGroup: this.getAgeGroup(patientDemographics.age)
      });

      return recommendation;
    } catch (error) {

      throw error;
    }
  }

  // Private helper methods would continue here...

  private async getDrugInteraction(drug1: string, drug2: string): Promise<DrugInteraction | null> {
    // Implementation to fetch drug interaction from database
    return null; // Placeholder
  }

  private requiresMonitoring(interaction: DrugInteraction): boolean {
    return interaction.severity === WarningSeverity.MAJOR ||;
           interaction.severity === WarningSeverity.CRITICAL;
  }

  private async getAlternatives(med1: MedicationForCheck, med2: MedicationForCheck): Promise<string[]> {
    // Implementation to suggest alternative medications
    return [];
  }

  private isDirectAllergyMatch(medication: MedicationForCheck, allergy: PatientAllergy): boolean {
    // Implementation to check direct allergy match
    return false;
  }

  private async checkCrossReactivity(medication: MedicationForCheck, allergy: PatientAllergy): Promise<any> {
    // Implementation to check cross-reactivity
    return null;
  }

  private calculateRiskScore(alerts: unknown): number {
    // Implementation to calculate overall risk score
    return 0;
  }

  private generateRecommendations(alerts: unknown): ClinicalRecommendation[] {
    // Implementation to generate clinical recommendations
    return [];
  }

  // Additional helper methods would be implemented here...

  // Required abstract methods
  validate(resource: FHIRMedicationRequest): boolean {
    return !!(resource?.resourceType && resource?.status && resource?.intent && resource.subject)
  }

  toFHIR(internalData: unknown): FHIRMedicationRequest {
    return {
      resourceType: 'MedicationRequest',
      \1,\2 'active',
      \1,\2 this.createReference('Patient', internalData.patientId),
    };
  }

  fromFHIR(fhirResource: FHIRMedicationRequest): unknown {
    return {
      id: fhirResource.id,
      patientId: fhirResource.subject?.reference?.split('/')[1] || ''
    };
  }
}

// Supporting interfaces
interface ClinicalFactors {
  comorbidities: string[],
  \1,\2 {
    renal: 'NORMAL' | 'MILD' | 'MODERATE' | 'SEVERE',
    \1,\2 'NORMAL' | 'COMPROMISED'
  };
  geneticFactors?: string[];
}

interface DosageRecommendation {
  medicationId: string,
  \1,\2 CalculatedDosage,
  \1,\2 MonitoringRecommendation[],
  \1,\2 AlternativeDosage[],
  confidenceLevel: number; // 0-100
  calculatedAt: Date
}

interface CalculatedDosage {
  amount: number,
  \1,\2 string,
  route: string;
  duration?: string;
  maxDailyDose: number,
  adjustments: DosageAdjustment[]
}

interface DosageAdjustment {
  factor: string; // age, weight, renal, etc.
  multiplier: number,
  rationale: string
}

interface MonitoringRecommendation {
  parameter: string,
  frequency: string;
  targetRange?: string;
  rationale: string
}

interface AlternativeDosage {
  regimen: string,
  \1,\2 string[],
  disadvantages: string[]
