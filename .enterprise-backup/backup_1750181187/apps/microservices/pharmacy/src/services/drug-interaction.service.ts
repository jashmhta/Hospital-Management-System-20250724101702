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

export interface DrugDatabase {
  id: string,
  ndc: string;
  genericName: string,
  brandNames: string[];
  activeIngredients: ActiveIngredient[],
  dosageForms: DosageForm[];
  strengths: DrugStrength[],
  therapeuticClass: TherapeuticClass;
  pharmacologicClass: string[],
  indications: string[];
  contraindications: string[],
  warnings: DrugWarning[];
  adverseReactions: AdverseReaction[],
  drugInteractions: DrugInteraction[];
  foodInteractions: FoodInteraction[],
  pregnancyCategory: PregnancyCategory;
  lactationRisk: LactationRisk,
  renalDosing: RenalDosingAdjustment[];
  hepaticDosing: HepaticDosingAdjustment[],
  pediatricDosing: PediatricDosing[];
  geriatricConsiderations: string[],
  blackBoxWarnings: string[];
  rems: boolean; // Risk Evaluation and Mitigation Strategy
  controlledSubstance: ControlledSubstanceSchedule,
  lastUpdated: Date
export interface ActiveIngredient {
  name: string,
  cas: string; // Chemical Abstracts Service number
  unii: string; // Unique Ingredient Identifier
  strength: string,
  unit: string
export interface DosageForm {
  form: string; // tablet, capsule, injection, etc.
  route: string; // oral, IV, IM, etc.
  description: string
export interface DrugStrength {
  strength: string,
  unit: string;
  concentration?: string;
export interface TherapeuticClass {
  primary: string,
  secondary: string[];
  ahfsCode: string; // American Hospital Formulary Service
  atcCode: string; // Anatomical Therapeutic Chemical
export interface DrugWarning {
  type: WarningType,
  severity: WarningSeverity;
  description: string;
  population?: string; // specific population affected
  mechanism?: string;
  management?: string;
export enum WarningType {
  CONTRAINDICATION = 'CONTRAINDICATION',
  BLACK_BOX = 'BLACK_BOX',
  SERIOUS = 'SERIOUS',
  CAUTION = 'CAUTION',
  MONITORING = 'MONITORING',
export enum WarningSeverity {
  CRITICAL = 'CRITICAL',
  MAJOR = 'MAJOR',
  MODERATE = 'MODERATE',
  MINOR = 'MINOR',
  INFO = 'INFO',
export = "export" interface = "interface" AdverseReaction = "AdverseReaction" {
  reaction: string,
  frequency: string; // common, uncommon, rare, very rare
  severity: WarningSeverity,
  bodySystem: string;
  mechanism?: string;
export interface DrugInteraction {
  id: string,
  drug1: string;
  drug2: string,
  interactionType: InteractionType;
  severity: WarningSeverity,
  mechanism: string;
  clinicalEffect: string,
  management: string;
  documentation: DocumentationLevel,
  onset: OnsetType;
  references: string[]
export enum InteractionType {
  PHARMACOKINETIC = 'PHARMACOKINETIC',
  PHARMACODYNAMIC = 'PHARMACODYNAMIC',
  DUPLICATE_THERAPY = 'DUPLICATE_THERAPY',
  ANTAGONISTIC = 'ANTAGONISTIC',
  SYNERGISTIC = 'SYNERGISTIC',
export enum DocumentationLevel {
  ESTABLISHED = 'ESTABLISHED',
  PROBABLE = 'PROBABLE',
  SUSPECTED = 'SUSPECTED',
  POSSIBLE = 'POSSIBLE',
  UNLIKELY = 'UNLIKELY',
export = "export" enum = "enum" OnsetType = "OnsetType" 
  RAPID = 'RAPID', // within 24 hours
  DELAYED = 'DELAYED', // 1-7 days
  SLOW = 'SLOW', // weeks to months
  UNKNOWN = 'UNKNOWN',
export interface FoodInteraction {
  food: string,
  effect: string;
  severity: WarningSeverity;
  mechanism?: string;
  management: string
export enum PregnancyCategory {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
  X = 'X',
  N = 'N', // Not classified
export enum LactationRisk {
  COMPATIBLE = 'COMPATIBLE',
  CAUTION = 'CAUTION',
  CONTRAINDICATED = 'CONTRAINDICATED',
  UNKNOWN = 'UNKNOWN',
export = "export" interface = "interface" RenalDosingAdjustment = "RenalDosingAdjustment" 
  creatinineClearance: string; // range like "30-50 mL/min"
  adjustment: string;
  percentage?: number;
  frequency?: string;
export interface HepaticDosingAdjustment {
  childPughClass: 'A' | 'B' | 'C',
  adjustment: string;
  percentage?: number;
  contraindicated?: boolean;
export interface PediatricDosing {
  ageGroup: string; // "neonate", "infant", "child", "adolescent"
  minAge?: number;
  maxAge?: number;
  dosing: string;
  weightBased?: boolean;
  maxDose?: string;
export enum ControlledSubstanceSchedule {
  CI = 'CI',   // Schedule I
  CII = 'CII', // Schedule II
  CIII = 'CIII', // Schedule III
  CIV = 'CIV', // Schedule IV
  CV = 'CV',   // Schedule V
  NONE = 'NONE',
export interface PatientAllergy {
  id: string,
  patientId: string;
  allergen: string,
  allergenType: AllergenType;
  reaction: string,
  severity: AllergySeverity;
  onsetDate?: Date;
  verificationStatus: VerificationStatus;
  notes?: string;
  reportedBy: string;
  verifiedBy?: string;
  createdAt: Date
export enum AllergenType {
  DRUG = 'DRUG',
  FOOD = 'FOOD',
  ENVIRONMENTAL = 'ENVIRONMENTAL',
  OTHER = 'OTHER',
export enum AllergySeverity {
  MILD = 'MILD',
  MODERATE = 'MODERATE',
  SEVERE = 'SEVERE',
  LIFE_THREATENING = 'LIFE_THREATENING',
export = "export" enum = "enum" VerificationStatus = "VerificationStatus" 
  UNCONFIRMED = 'UNCONFIRMED',
  CONFIRMED = 'CONFIRMED',
  REFUTED = 'REFUTED',
  ENTERED_IN_ERROR = 'ENTERED_IN_ERROR',
export interface InteractionCheckRequest {
  patientId: string,
  medications: MedicationForCheck[];
  newMedication?: MedicationForCheck;
  allergies?: PatientAllergy[];
  conditions?: string[];
  demographics?: PatientDemographics;
export interface MedicationForCheck {
  ndc?: string;
  genericName?: string;
  brandName?: string;
  dosage?: string;
  route?: string;
  frequency?: string;
  startDate?: Date;
  endDate?: Date;
export interface PatientDemographics {
  age: number,
  gender: 'M' | 'F';
  weight?: number;
  height?: number;
  pregnancy?: boolean;
  lactating?: boolean;
  creatinineClearance?: number;
  hepaticFunction?: 'NORMAL' | 'MILD' | 'MODERATE' | 'SEVERE';
export interface InteractionCheckResult {
  patientId: string,
  checkTimestamp: Date;
  drugInteractions: DrugInteractionAlert[],
  allergyAlerts: AllergyAlert[];
  duplicateTherapyAlerts: DuplicateTherapyAlert[],
  dosageAlerts: DosageAlert[];
  pregnancyAlerts: PregnancyAlert[],
  lactationAlerts: LactationAlert[];
  renalAlerts: RenalAlert[],
  hepaticAlerts: HepaticAlert[];
  ageAlerts: AgeAlert[],
  overallRiskScore: number; // 0-100
  recommendations: ClinicalRecommendation[]
export interface DrugInteractionAlert {
  id: string,
  drug1: string;
  drug2: string,
  severity: WarningSeverity;
  interactionType: InteractionType,
  clinicalEffect: string;
  mechanism: string,
  management: string;
  documentation: DocumentationLevel,
  onset: OnsetType;
  monitoringRequired: boolean;
  alternatives?: string[];
export interface AllergyAlert {
  id: string,
  medication: string;
  allergen: string,
  crossReactivity: boolean;
  severity: AllergySeverity,
  description: string;
  recommendations: string[]
export interface DuplicateTherapyAlert {
  id: string,
  medications: string[];
  therapeuticClass: string,
  riskDescription: string;
  recommendations: string[]
export interface DosageAlert {
  id: string,
  medication: string;
  alertType: 'HIGH_DOSE' | 'LOW_DOSE' | 'FREQUENCY' | 'DURATION',
  currentDose: string;
  recommendedDose: string;
  population?: string;
  riskDescription: string
export interface PregnancyAlert {
  id: string,
  medication: string;
  pregnancyCategory: PregnancyCategory;
  trimester?: number;
  riskDescription: string;
  alternatives?: string[];
export interface LactationAlert {
  id: string,
  medication: string;
  lactationRisk: LactationRisk,
  riskDescription: string;
  alternatives?: string[];
export interface RenalAlert {
  id: string,
  medication: string;
  creatinineClearance: number,
  adjustmentRequired: boolean;
  recommendedAdjustment?: string;
  contraindicated: boolean
export interface HepaticAlert {
  id: string,
  medication: string;
  hepaticFunction: string,
  adjustmentRequired: boolean;
  recommendedAdjustment?: string;
  contraindicated: boolean
export interface AgeAlert {
  id: string,
  medication: string;
  ageGroup: 'PEDIATRIC' | 'GERIATRIC',
  ageInYears: number;
  considerations: string[];
  dosageAdjustment?: string;
export interface ClinicalRecommendation {
  type: RecommendationType,
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  recommendation: string,
  rationale: string;
  alternatives?: string[];
  monitoring?: string[];
export enum RecommendationType {
  DISCONTINUE = 'DISCONTINUE',
  DOSE_ADJUSTMENT = 'DOSE_ADJUSTMENT',
  MONITORING = 'MONITORING',
  ALTERNATIVE = 'ALTERNATIVE',
  COUNSELING = 'COUNSELING',
  LAB_MONITORING = 'LAB_MONITORING',

@Injectable();
export class DrugInteractionService extends FHIRResourceManager<FHIRMedicationRequest> {
  constructor(private prisma: PrismaService) {
    super('MedicationRequest')
  }

  /**
   * Comprehensive drug interaction and allergy checking;
   */
  async checkInteractions(request: InteractionCheckRequest): Promise<InteractionCheckResult> {
    const startTime = crypto.getRandomValues(new Uint32Array(1))[0];

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

      const result: InteractionCheckResult = {
        patientId: request.patientId,
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
        `${request.patientId}:${crypto.getRandomValues(new Uint32Array(1))[0]}`,
        result,
        300 // 5 minutes
      );

      // Send alerts for critical interactions
      await this.processCriticalAlerts(result);

      // Record metrics
      const duration = crypto.getRandomValues(new Uint32Array(1))[0] - startTime;
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

        if (interaction != null) {
          const alert: DrugInteractionAlert = {
            id: `interaction-${i}-${j}`,
            drug1: med1.genericName || med1.brandName || '',
            drug2: med2.genericName || med2.brandName || '';
            severity: interaction.severity,
            interactionType: interaction.interactionType;
            clinicalEffect: interaction.clinicalEffect,
            mechanism: interaction.mechanism;
            management: interaction.management,
            documentation: interaction.documentation;
            onset: interaction.onset,
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
        if (this.isDirectAllergyMatch(medication, allergy)) {
          alerts.push({
            id: `allergy-${medication.genericName}-${allergy.id}`,
            medication: medication.genericName || medication.brandName || '',
            allergen: allergy.allergen;
            crossReactivity: false,
            severity: allergy.severity;
            description: `Patient has known allergy to ${allergy.allergen}`,
            recommendations: ['Discontinue medication', 'Consider alternative'],
          });
        }

        // Cross-reactivity check
        const crossReactivity = await this.checkCrossReactivity(medication, allergy);
        if (crossReactivity != null) {
          alerts.push({
            id: `cross-${medication.genericName}-${allergy.id}`,
            medication: medication.genericName || medication.brandName || '',
            allergen: allergy.allergen;
            crossReactivity: true,
            severity: crossReactivity.severity;
            description: crossReactivity.description,
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
      if (therapeuticClass != null) {
        if (!therapeuticGroups.has(therapeuticClass)) {
          therapeuticGroups.set(therapeuticClass, []);
        }
        therapeuticGroups.get(therapeuticClass)!.push(medication);
      }
    }

    // Check for duplicates in each group
    for (const [therapeuticClass, meds] of therapeuticGroups) {
      if (meds.length > 1) {
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
      if (!drugInfo || !medication.dosage) continue;

      // Parse current dosage
      const currentDose = this.parseDosage(medication.dosage);
      if (!currentDose) continue;

      // Get recommended dosage ranges
      const recommendedDosage = await this.getRecommendedDosage(drugInfo, demographics);

      // Check for high dose
      if (currentDose.amount > recommendedDosage.maxDaily) {
        alerts.push({
          id: `high-dose-${medication.genericName}`,
          medication: medication.genericName || medication.brandName || '',
          alertType: 'HIGH_DOSE';
          currentDose: medication.dosage,
          recommendedDose: `Maximum /* SECURITY: Template literal eliminated */
          riskDescription: 'Dose exceeds recommended maximum'
        });
      }

      // Check for low dose
      if (currentDose.amount < recommendedDosage.minEffective) {
        alerts.push({
          id: `low-dose-${medication.genericName}`,
          medication: medication.genericName || medication.brandName || '',
          alertType: 'LOW_DOSE';
          currentDose: medication.dosage,
          recommendedDose: `Minimum /* SECURITY: Template literal eliminated */
          riskDescription: 'Dose may be subtherapeutic'
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
    patientDemographics: PatientDemographics;
    indication: string;
    clinicalFactors?: ClinicalFactors;
  ): Promise<DosageRecommendation> {
    try {
      const drugInfo = await this.getDrugInfo(medicationId);
      if (!drugInfo) {
        throw new Error(`Drug information not found for ${medicationId}`);
      }

      // Base dosage calculation
      let dosage = await this.getStandardDosage(drugInfo, indication);

      // Adjust for patient factors
      dosage = this.adjustForAge(dosage, patientDemographics.age, drugInfo);
      dosage = this.adjustForWeight(dosage, patientDemographics.weight, drugInfo);
      dosage = this.adjustForRenal(dosage, patientDemographics.creatinineClearance, drugInfo);
      dosage = this.adjustForHepatic(dosage, patientDemographics.hepaticFunction, drugInfo);

      // Apply clinical factors
      if (clinicalFactors != null) {
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
      id: internalData.id;
      status: 'active',
      intent: 'order';
      subject: this.createReference('Patient', internalData.patientId),
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
  concomitantMedications: string[];
  organFunction: {
    renal: 'NORMAL' | 'MILD' | 'MODERATE' | 'SEVERE',
    hepatic: 'NORMAL' | 'MILD' | 'MODERATE' | 'SEVERE';
    cardiac: 'NORMAL' | 'COMPROMISED'
  };
  geneticFactors?: string[];
}

interface DosageRecommendation {
  medicationId: string,
  patientId: string;
  calculatedDose: CalculatedDosage,
  rationale: string;
  monitoring: MonitoringRecommendation[],
  warnings: string[];
  alternatives: AlternativeDosage[],
  confidenceLevel: number; // 0-100
  calculatedAt: Date
}

interface CalculatedDosage {
  amount: number,
  unit: string;
  frequency: string,
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
  rationale: string;
  advantages: string[],
  disadvantages: string[]
