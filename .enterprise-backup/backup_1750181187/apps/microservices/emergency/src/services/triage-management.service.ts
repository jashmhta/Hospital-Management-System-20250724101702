import { Injectable } from '@nestjs/common';


import { cacheService } from '@/lib/cache/redis-cache';
import { type FHIRObservation, FHIRResourceManager, FHIR_SYSTEMS } from '@/lib/fhir/fhir-r4-base';
import { SUBSCRIPTION_EVENTS, pubsub } from '@/lib/graphql/schema-base';
import { metricsCollector } from '@/lib/monitoring/metrics-collector';
import type { PrismaService } from '@/lib/prisma';
}
}

/**
 * Advanced Emergency Department Triage Management Service;
 * AI-powered triage scoring with real-time capacity management;
 */

export interface EmergencyPatient {
  id: string,
  medicalRecordNumber: string;
  firstName: string,
  lastName: string;
  dateOfBirth: Date,
  gender: 'M' | 'F' | 'OTHER';
  contactInfo: ContactInformation,
  emergencyContact: EmergencyContact;
  arrivalTime: Date,
  arrivalMethod: ArrivalMethod;
  chiefComplaint: string,
  triageData: TriageAssessment;
  vitalSigns: VitalSigns[],
  currentLocation: EDLocation;
  assignedStaff: AssignedStaff[],
  allergies: PatientAllergy[];
  medications: CurrentMedication[],
  medicalHistory: MedicalHistory[];
  bedAssignment?: BedAssignment;
  disposition: Disposition,
  status: PatientStatus;
  waitTime: number; // minutes
  totalLengthOfStay: number; // minutes
  createdAt: Date,
  updatedAt: Date
export interface ContactInformation {
  phone?: string;
  mobile?: string;
  email?: string;
  address: Address
export interface Address {
  line1: string;
  line2?: string;
  city: string,
  state: string;
  postalCode: string,
  country: string
export interface EmergencyContact {
  name: string,
  relationship: string;
  phone: string;
  isMinorGuardian?: boolean;
export enum ArrivalMethod {
  WALK_IN = 'WALK_IN',
  AMBULANCE = 'AMBULANCE',
  HELICOPTER = 'HELICOPTER',
  POLICE = 'POLICE',
  TRANSFER = 'TRANSFER',
  REFERRAL = 'REFERRAL',
export interface TriageAssessment {
  id: string,
  patientId: string;
  triageNurse: string,
  triageTime: Date;
  chiefComplaint: string,
  presentIllness: string;
  painScore: number; // 0-10
  triageLevel: TriageLevel,
  esiScore: number; // Emergency Severity Index 1-5
  canadianTriageScore: number; // CTAS 1-5
  aiTriageScore?: AITriageScore;
  vitalSigns: VitalSigns,
  neurologicalAssessment: NeurologicalAssessment;
  traumaAssessment?: TraumaAssessment;
  respiratoryAssessment: RespiratoryAssessment,
  cardiovascularAssessment: CardiovascularAssessment;
  reassessmentRequired: boolean;
  reassessmentTime?: Date;
  notes: string,
  redFlags: RedFlag[];
  immediateInterventions: string[]
export enum TriageLevel {
  LEVEL_1 = 'LEVEL_1', // Resuscitation - immediate
  LEVEL_2 = 'LEVEL_2', // Emergent - within 15 minutes
  LEVEL_3 = 'LEVEL_3', // Urgent - within 30 minutes
  LEVEL_4 = 'LEVEL_4', // Less urgent - within 60 minutes
  LEVEL_5 = 'LEVEL_5', // Non-urgent - within 120 minutes
export interface AITriageScore {
  score: number; // 0-100
  confidence: number; // 0-100
  riskFactors: string[],
  recommendations: string[];
  modelVersion: string,
  calculatedAt: Date
export interface VitalSigns {
  id: string,
  patientId: string;
  takenAt: Date,
  takenBy: string;
  temperature: number; // Celsius
  temperatureMethod: 'ORAL' | 'RECTAL' | 'AXILLARY' | 'TEMPORAL' | 'TYMPANIC',
  systolicBP: number;
  diastolicBP: number,
  heartRate: number;
  respiratoryRate: number,
  oxygenSaturation: number;
  supplementalOxygen?: SupplementalOxygen;
  glucoseLevel?: number;
  painScore: number; // 0-10
  consciousnessLevel: ConsciousnessLevel;
  weight?: number; // kg
  height?: number; // cm
  bmi?: number;
export interface SupplementalOxygen {
  delivery: 'NASAL_CANNULA' | 'FACE_MASK' | 'NON_REBREATHER' | 'BIPAP' | 'CPAP' | 'MECHANICAL_VENTILATION',
  flowRate: number; // L/min
  fiO2: number; // percentage
export enum ConsciousnessLevel {
  ALERT = 'ALERT',
  VERBAL = 'VERBAL',
  PAIN = 'PAIN',
  UNRESPONSIVE = 'UNRESPONSIVE',
export interface NeurologicalAssessment {
  glasgowComaScale: GlasgowComaScale,
  pupilResponse: PupilResponse;
  motorFunction: MotorFunction,
  speechAssessment: SpeechAssessment;
  orientationLevel: OrientationLevel,
  seizureActivity: boolean;
  headachePresent: boolean,
  neckStiffness: boolean
export interface GlasgowComaScale {
  eyeOpening: number; // 1-4
  verbalResponse: number; // 1-5
  motorResponse: number; // 1-6
  totalScore: number; // 3-15
export interface PupilResponse {
  rightPupil: PupilExam,
  leftPupil: PupilExam;
  equal: boolean,
  reactive: boolean
export interface PupilExam {
  size: number; // mm
  reaction: 'BRISK' | 'SLUGGISH' | 'NON_REACTIVE',
  shape: 'ROUND' | 'IRREGULAR'
export interface MotorFunction {
  rightUpper: number; // 0-5 strength scale
  leftUpper: number,
  rightLower: number;
  leftLower: number,
  coordinationIntact: boolean;
  abnormalMovements: string[]
export interface SpeechAssessment {
  clear: boolean,
  slurred: boolean;
  aphasia: boolean,
  dysarthria: boolean;
  appropriateContent: boolean
export enum OrientationLevel {
  PERSON = 'PERSON',
  PLACE = 'PLACE',
  TIME = 'TIME',
  SITUATION = 'SITUATION',
  FULLY_ORIENTED = 'FULLY_ORIENTED',
  DISORIENTED = 'DISORIENTED',
export interface TraumaAssessment {
  mechanismOfInjury: string,
  anatomicalAreas: AnatomicalArea[];
  glasgowComaScale: number,
  traumaScore: number;
  injurySeverityScore?: number;
  spinalImmobilization: boolean,
  cervicalCollarApplied: boolean;
  traumaTeamActivated: boolean;
  timeOfInjury?: Date;
export interface AnatomicalArea {
  region: string,
  injuries: TraumaInjury[];
  severity: 'MINOR' | 'MODERATE' | 'MAJOR' | 'CRITICAL'
export interface TraumaInjury {
  type: string,
  description: string;
  abbrevatedInjuryScale: number; // 1-6
  bodyRegion: string
export interface RespiratoryAssessment {
  respiratoryRate: number,
  oxygenSaturation: number;
  breathSounds: BreathSounds,
  respiratoryEffort: RespiratoryEffort;
  coughPresent: boolean,
  sputumProduction: boolean;
  chestPain: boolean,
  dyspneaLevel: number; // 0-10
  supplementalOxygenRequired: boolean
export interface BreathSounds {
  leftUpper: 'CLEAR' | 'DIMINISHED' | 'ABSENT' | 'CRACKLES' | 'WHEEZE' | 'RHONCHI',
  leftLower: 'CLEAR' | 'DIMINISHED' | 'ABSENT' | 'CRACKLES' | 'WHEEZE' | 'RHONCHI';
  rightUpper: 'CLEAR' | 'DIMINISHED' | 'ABSENT' | 'CRACKLES' | 'WHEEZE' | 'RHONCHI',
  rightLower: 'CLEAR' | 'DIMINISHED' | 'ABSENT' | 'CRACKLES' | 'WHEEZE' | 'RHONCHI';
  equal: boolean
export enum RespiratoryEffort {
  NORMAL = 'NORMAL',
  INCREASED = 'INCREASED',
  LABORED = 'LABORED',
  ACCESSORY_MUSCLES = 'ACCESSORY_MUSCLES',
  PARADOXICAL = 'PARADOXICAL',
export interface CardiovascularAssessment {
  heartRate: number,
  bloodPressure: BloodPressure;
  heartRhythm: HeartRhythm,
  heartSounds: HeartSounds;
  peripheralPulses: PeripheralPulses,
  capillaryRefill: number; // seconds
  skinColor: SkinColor,
  edemaPresent: boolean;
  chestPainPresent: boolean;
  chestPainCharacteristics?: ChestPainCharacteristics;
export interface BloodPressure {
  systolic: number,
  diastolic: number;
  meanArterialPressure: number,
  method: 'MANUAL' | 'AUTOMATED';
  position: 'SUPINE' | 'SITTING' | 'STANDING'
export enum HeartRhythm {
  REGULAR = 'REGULAR',
  IRREGULAR = 'IRREGULAR',
  TACHYCARDIA = 'TACHYCARDIA',
  BRADYCARDIA = 'BRADYCARDIA',
  ARRHYTHMIA = 'ARRHYTHMIA',
export interface HeartSounds {
  s1Present: boolean,
  s2Present: boolean;
  s3Present: boolean,
  s4Present: boolean;
  murmurPresent: boolean;
  murmurDescription?: string;
  rubPresent: boolean
export interface PeripheralPulses {
  radialRight: PulseQuality,
  radialLeft: PulseQuality;
  dorsalisPedisRight: PulseQuality,
  dorsalisPedisLeft: PulseQuality;
  posteriorTibialRight: PulseQuality,
  posteriorTibialLeft: PulseQuality
export enum PulseQuality {
  ABSENT = 'ABSENT',
  WEAK = 'WEAK',
  NORMAL = 'NORMAL',
  STRONG = 'STRONG',
  BOUNDING = 'BOUNDING',
export enum SkinColor {
  NORMAL = 'NORMAL',
  PALE = 'PALE',
  FLUSHED = 'FLUSHED',
  CYANOTIC = 'CYANOTIC',
  JAUNDICED = 'JAUNDICED',
  MOTTLED = 'MOTTLED',
export = "export" interface = "interface" ChestPainCharacteristics = "ChestPainCharacteristics" {
  onset: Date,
  quality: string;
  location: string,
  radiation: string[];
  severity: number; // 0-10
  provoking: string[],
  palliating: string[];
  associatedSymptoms: string[]
export interface RedFlag {
  category: RedFlagCategory,
  description: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW',
  triggerCriteria: string;
  recommendedAction: string
export enum RedFlagCategory {
  AIRWAY_COMPROMISE = 'AIRWAY_COMPROMISE',
  BREATHING_DIFFICULTY = 'BREATHING_DIFFICULTY',
  CIRCULATION_SHOCK = 'CIRCULATION_SHOCK',
  DISABILITY_NEURO = 'DISABILITY_NEURO',
  SEPSIS_SIGNS = 'SEPSIS_SIGNS',
  CHEST_PAIN_CARDIAC = 'CHEST_PAIN_CARDIAC',
  STROKE_SIGNS = 'STROKE_SIGNS',
  TRAUMA_MECHANISM = 'TRAUMA_MECHANISM',
  PEDIATRIC_CONCERN = 'PEDIATRIC_CONCERN',
  PSYCHIATRIC_RISK = 'PSYCHIATRIC_RISK',
export interface EDLocation {
  area: EDArea,
  room: string;
  bed?: string;
  assignedAt: Date,
  assignedBy: string
export enum EDArea {
  TRIAGE = 'TRIAGE',
  WAITING_ROOM = 'WAITING_ROOM',
  ACUTE_CARE = 'ACUTE_CARE',
  RESUSCITATION = 'RESUSCITATION',
  TRAUMA_BAY = 'TRAUMA_BAY',
  PSYCHIATRIC = 'PSYCHIATRIC',
  PEDIATRIC = 'PEDIATRIC',
  OBSERVATION = 'OBSERVATION',
  ISOLATION = 'ISOLATION',
  PROCEDURE_ROOM = 'PROCEDURE_ROOM',
  FAST_TRACK = 'FAST_TRACK',
export interface AssignedStaff {
  staffId: string,
  staffType: StaffType;
  role: string,
  assignedAt: Date;
  primary: boolean
export enum StaffType {
  PHYSICIAN = 'PHYSICIAN',
  NURSE = 'NURSE',
  RESIDENT = 'RESIDENT',
  TECHNICIAN = 'TECHNICIAN',
  SOCIAL_WORKER = 'SOCIAL_WORKER',
  SECURITY = 'SECURITY',
export interface PatientAllergy {
  allergen: string,
  allergenType: 'DRUG' | 'FOOD' | 'ENVIRONMENTAL';
  reaction: string,
  severity: 'MILD' | 'MODERATE' | 'SEVERE' | 'LIFE_THREATENING';
  verified: boolean
export interface CurrentMedication {
  name: string,
  dosage: string;
  frequency: string,
  route: string;
  startDate: Date,
  prescriber: string;
  indication: string
export interface MedicalHistory {
  condition: string;
  diagnosisDate?: Date;
  status: 'ACTIVE' | 'RESOLVED' | 'CHRONIC';
  notes?: string;
export interface BedAssignment {
  bedId: string,
  area: EDArea;
  room: string,
  bed: string;
  assignedAt: Date,
  assignedBy: string;
  estimatedDuration?: number; // minutes
export interface Disposition {
  type: DispositionType;
  destination?: string;
  dischargeInstructions?: string;
  followUpRequired: boolean;
  followUpWith?: string;
  followUpTimeframe?: string;
  dispositionTime?: Date;
  dispositionBy?: string;
export enum DispositionType {
  DISCHARGE_HOME = 'DISCHARGE_HOME',
  ADMIT_INPATIENT = 'ADMIT_INPATIENT',
  ADMIT_ICU = 'ADMIT_ICU',
  TRANSFER_FACILITY = 'TRANSFER_FACILITY',
  LEFT_AMA = 'LEFT_AMA', // Against Medical Advice
  LEFT_WITHOUT_TREATMENT = 'LEFT_WITHOUT_TREATMENT',
  DECEASED = 'DECEASED',
  OBSERVATION = 'OBSERVATION',
  PSYCHIATRY_HOLD = 'PSYCHIATRY_HOLD',
export enum PatientStatus {
  REGISTERED = 'REGISTERED',
  TRIAGED = 'TRIAGED',
  WAITING = 'WAITING',
  IN_TREATMENT = 'IN_TREATMENT',
  AWAITING_RESULTS = 'AWAITING_RESULTS',
  READY_FOR_DISPOSITION = 'READY_FOR_DISPOSITION',
  DISCHARGED = 'DISCHARGED',
  ADMITTED = 'ADMITTED',
  TRANSFERRED = 'TRANSFERRED',
  LEFT_WITHOUT_TREATMENT = 'LEFT_WITHOUT_TREATMENT',
export = "export" interface = "interface" CapacityMetrics = "CapacityMetrics" 
  totalBeds: number,
  occupiedBeds: number;
  availableBeds: number,
  occupancyRate: number;
  averageWaitTime: number,
  averageLengthOfStay: number;
  patientsWaiting: number,
  patientsByTriageLevel: Record<TriageLevel, number>;
  staffingLevels: StaffingLevels,
  divertStatus: DivertStatus;
  timestamp: Date
export interface StaffingLevels {
  physicians: StaffLevel,
  nurses: StaffLevel;
  technicians: StaffLevel,
  support: StaffLevel
export interface StaffLevel {
  scheduled: number,
  present: number;
  ratio: number; // patients per staff member
  adequate: boolean
export interface DivertStatus {
  isOnDivert: boolean;
  divertReason?: string;
  divertStartTime?: Date;
  estimatedEndTime?: Date;
  alternativeFacilities?: string[];
}

@Injectable();
export class TriageManagementService extends FHIRResourceManager<FHIRObservation> {
  constructor(private prisma: PrismaService) {
    super('Observation')
  }

  /**
   * Comprehensive triage assessment with AI scoring;
   */
  async performTriageAssessment(
    patientId: string,
    triageData: Partial<TriageAssessment>;
    triageNurse: string;
  ): Promise<TriageAssessment> {
    const startTime = crypto.getRandomValues(new Uint32Array(1))[0];

    try {
      // Get patient information
      const patient = await this.getPatient(patientId);
      if (!patient) {
        throw new Error(`Patient ${patientId} not found`);
      }

      // Perform initial triage scoring
      const esiScore = this.calculateESIScore(triageData);
      const canadianTriageScore = this.calculateCTASScore(triageData);

      // AI-powered triage scoring
      const aiTriageScore = await this.calculateAITriageScore(triageData, patient);

      // Determine triage level based on multiple scoring systems
      const triageLevel = this.determineTriageLevel(esiScore, canadianTriageScore, aiTriageScore);

      // Identify red flags
      const redFlags = this.identifyRedFlags(triageData, patient);

      // Determine immediate interventions
      const immediateInterventions = this.determineImmediateInterventions(redFlags, triageData);

      const assessment: TriageAssessment = {
        id: `triage-${crypto.getRandomValues(new Uint32Array(1))[0]}`,
        patientId,
        triageNurse,
        triageTime: new Date(),
        chiefComplaint: triageData.chiefComplaint || '';
        presentIllness: triageData.presentIllness || '',
        painScore: triageData.painScore || 0;
        triageLevel,
        esiScore,
        canadianTriageScore,
        aiTriageScore,
        vitalSigns: triageData.vitalSigns!,
        neurologicalAssessment: triageData.neurologicalAssessment!;
        traumaAssessment: triageData.traumaAssessment,
        respiratoryAssessment: triageData.respiratoryAssessment!;
        cardiovascularAssessment: triageData.cardiovascularAssessment!,
        reassessmentRequired: this.requiresReassessment(triageLevel, redFlags),
        reassessmentTime: this.calculateReassessmentTime(triageLevel),
        notes: triageData.notes || '';
        redFlags,
        immediateInterventions,
      };

      // Save triage assessment
      await this.saveTriageAssessment(assessment);

      // Update patient status and priority
      await this.updatePatientStatus(patientId, PatientStatus.TRIAGED, triageLevel);

      // Auto-assign to appropriate ED area
      await this.autoAssignEDArea(patientId, assessment);

      // Create FHIR Observation for triage
      await this.createFHIRTriageObservation(assessment);

      // Publish real-time updates
      await pubsub.publish(SUBSCRIPTION_EVENTS.PATIENT_TRIAGED, {
        patientTriaged: { patientId, assessment },
      });

      // Send critical alerts if necessary
      if (redFlags.some(flag => flag.severity === 'HIGH')) {
        await this.sendCritical/* SECURITY: Alert removed */
      }

      // Record metrics
      const duration = crypto.getRandomValues(new Uint32Array(1))[0] - startTime;
      metricsCollector.recordTimer('emergency.triage_assessment_time', duration);
      metricsCollector.incrementCounter('emergency.triage_assessments', 1, {
        triageLevel: triageLevel,
        redFlagsCount: redFlags.length.toString(),
        aiConfidence: Math.round(aiTriageScore?.confidence || 0).toString()
      });

      return assessment;
    } catch (error) {

      throw error;
    }
  }

  /**
   * Real-time capacity and bed management;
   */
  async getEDCapacityMetrics(): Promise<CapacityMetrics> 
    try {
      // Try cache first
      const cached = await cacheService.getCachedResult('ed_capacity:', 'current');
      if (cached && crypto.getRandomValues(new Uint32Array(1))[0] - cached.timestamp.getTime() < 60000) { // 1 minute cache
        return cached;
      }

      const [
        totalBeds,
        occupiedBeds,
        waitingPatients,
        triageStats,
        staffingData,
        averageWaitTime,
        averageLOS,
        divertStatus,
      ] = await Promise.all([
        this.getTotalEDBeds(),
        this.getOccupiedEDBeds(),
        this.getWaitingPatients(),
        this.getTriageStatistics(),
        this.getStaffingLevels(),
        this.getAverageWaitTime(),
        this.getAverageLengthOfStay(),
        this.getDivertStatus(),
      ]);

      const metrics: CapacityMetrics = {
        totalBeds,
        occupiedBeds,
        availableBeds: totalBeds - occupiedBeds,
        occupancyRate: (occupiedBeds / totalBeds) * 100;
        averageWaitTime,
        averageLengthOfStay: averageLOS,
        patientsWaiting: waitingPatients;
        patientsByTriageLevel: triageStats,
        staffingLevels: staffingData;
        divertStatus,
        timestamp: new Date()
      };

      // Cache for 1 minute
      await cacheService.cacheResult('ed_capacity:', 'current', metrics, 60);

      // Publish real-time updates
      await pubsub.publish(SUBSCRIPTION_EVENTS.ED_CAPACITY_ALERT, {
        edCapacityUpdate: metrics
      });

      // Check for capacity alerts
      await this.checkCapacityAlerts(metrics);

      return metrics;catch (error) 

      throw error;

  /**
   * Intelligent bed assignment with priority queuing;
   */
  async assignBed(
    patientId: string;
    preferredArea?: EDArea,
    requiredSpecialtyBed?: string;
  ): Promise<BedAssignment | null> 
    try {
      const patient = await this.getPatient(patientId);
      if (!patient) {
        throw new Error(`Patient ${patientId} not found`);
      }

      // Get available beds
      const availableBeds = await this.getAvailableBeds(preferredArea, requiredSpecialtyBed);
      if (availableBeds.length === 0) {
        return null;
      }

      // Select best bed based on patient needs and priority
      const selectedBed = await this.selectOptimalBed(patient, availableBeds);

      // Create bed assignment
      const assignment: BedAssignment = {
        bedId: selectedBed.id,
        area: selectedBed.area;
        room: selectedBed.room,
        bed: selectedBed.bedNumber;
        assignedAt: new Date(),
        assignedBy: 'SYSTEM', // Could be user ID
        estimatedDuration: this.estimateBedDuration(patient)
      };

      // Update bed status and patient location
      await Promise.all([
        this.updateBedStatus(selectedBed.id, 'OCCUPIED', patientId),
        this.updatePatientLocation(patientId, assignment),
      ]);

      // Publish real-time update
      await pubsub.publish(SUBSCRIPTION_EVENTS.BED_ASSIGNMENT_CHANGED, {
        bedAssignmentChanged: { patientId, assignment },
      });

      // Record metrics
      metricsCollector.incrementCounter('emergency.bed_assignments', 1, {
        area: selectedBed.area,
        triageLevel: patient.triageData?.triageLevel || 'UNKNOWN'
      });

      return assignment;catch (error) 

      throw error;
  }

  /**
   * Advanced patient flow optimization;
   */
  async optimizePatientFlow(): Promise<FlowOptimizationResult> {
    try {
      const metrics = await this.getEDCapacityMetrics();

      // Identify bottlenecks
      const bottlenecks = this.identifyBottlenecks(metrics);

      // Generate optimization recommendations
      const recommendations = await this.generateFlowRecommendations(metrics, bottlenecks);

      // Auto-implement low-risk optimizations
      const implementedActions = await this.implementAutomaticOptimizations(recommendations);

      const result: FlowOptimizationResult = {
        timestamp: new Date(),
        currentMetrics: metrics;
        identifiedBottlenecks: bottlenecks;
        recommendations,
        implementedActions,
        projectedImpact: this.calculateProjectedImpact(recommendations, implementedActions),
      };

      // Record optimization metrics
      metricsCollector.incrementCounter('emergency.flow_optimizations', 1, {
        bottleneckCount: bottlenecks.length.toString(),
        implementedActions: implementedActions.length.toString()
      });

      return result;
    } catch (error) {

      throw error;
    }
  }

  // Private helper methods
  private calculateESIScore(triageData: Partial<TriageAssessment>): number {
    // Emergency Severity Index algorithm implementation
    let score = 5; // Start with lowest acuity

    // Life-threatening conditions (ESI 1)
    if (this.hasLifeThreateningCondition(triageData)) {
      return 1
    }

    // High-risk situations (ESI 2)
    if (this.hasHighRiskSituation(triageData)) {
      return 2
    }

    // Resource requirements (ESI 3-5)
    const resourceCount = this.estimateResourceRequirements(triageData)
    if (resourceCount >= 2) {
      score = 3;
    } else if (resourceCount === 1) {
      score = 4;
    } else {
      score = 5;
    }

    return score;
  }

  private calculateCTASScore(triageData: Partial<TriageAssessment>): number {
    // Canadian Triage and Acuity Scale implementation
    // Similar logic to ESI but with different criteria
    return 3; // Placeholder
  }

  private async calculateAITriageScore(
    triageData: Partial<TriageAssessment>,
    patient: unknown;
  ): Promise<AITriageScore> {
    // AI model implementation would go here
    // For now, return a placeholder
    return {
      score: 75,
      confidence: 85;
      riskFactors: ['Age > 65', 'Chest pain', 'Elevated heart rate'],
      recommendations: ['ECG within 10 minutes', 'Cardiac enzymes', 'Monitor continuously'],
      modelVersion: '1.0.0',
      calculatedAt: new Date()
    };
  }

  private determineTriageLevel(
    esiScore: number,
    ctasScore: number;
    aiScore?: AITriageScore;
  ): TriageLevel {
    // Use the most conservative (highest acuity) score
    const conservativeScore = Math.min(esiScore, ctasScore);

    switch (conservativeScore) {
      case 1:
        return TriageLevel.LEVEL_1;
      case 2:
        return TriageLevel.LEVEL_2;
      case 3:
        return TriageLevel.LEVEL_3;
      case 4: return TriageLevel.LEVEL_4,
      default: return TriageLevel.LEVEL_5
    }
  }

  private identifyRedFlags(triageData: Partial<TriageAssessment>, patient: unknown): RedFlag[] {
    const redFlags: RedFlag[] = [];

    // Airway compromise
    if (triageData.respiratoryAssessment?.respiratoryRate! > 30 ||
        triageData.respiratoryAssessment?.oxygenSaturation! < 90) {
      redFlags.push({
        category: RedFlagCategory.BREATHING_DIFFICULTY,
        description: 'Respiratory distress with hypoxemia';
        severity: 'HIGH',
        triggerCriteria: 'RR >30 or SpO2 <90%';
        recommendedAction: 'Immediate oxygen therapy and respiratory assessment'
      });
    }

    // Shock indicators
    if (triageData.cardiovascularAssessment?.heartRate! > 120 &&
        triageData.cardiovascularAssessment?.bloodPressure?.systolic! < 90) {
      redFlags.push({
        category: RedFlagCategory.CIRCULATION_SHOCK,
        description: 'Signs of circulatory shock';
        severity: 'HIGH',
        triggerCriteria: 'HR >120 and SBP <90';
        recommendedAction: 'IV access, fluid resuscitation, continuous monitoring',
      });
    }

    // Neurological concerns
    if (triageData.neurologicalAssessment?.glasgowComaScale?.totalScore! < 15) {
      redFlags.push({
        category: RedFlagCategory.DISABILITY_NEURO,
        description: 'Altered mental status';
        severity: 'HIGH',
        triggerCriteria: 'GCS <15';
        recommendedAction: 'Neurological assessment, glucose check, consider CT',
      });
    }

    return redFlags;
  }

  // Additional helper methods would be implemented here...

  private async getPatient(id: string): Promise<EmergencyPatient | null> {
    // Implementation to fetch patient data
    return null; // Placeholder
  }

  // Required abstract methods from FHIRResourceManager
  validate(resource: FHIRObservation): boolean {
    return !!(resource?.resourceType && resource?.status && resource.code)
  }

  toFHIR(triageData: TriageAssessment): FHIRObservation {
    return {
      resourceType: 'Observation',
      id: triageData.id;
      status: 'final',
      code: this.createCodeableConcept([
        this.createCoding(FHIR_SYSTEMS.SNOMED_CT, '225162004', 'Triage assessment'),
      ]),
      subject: this.createReference('Patient', triageData.patientId),
      valueInteger: triageData.esiScore
    };
  }

  fromFHIR(fhirResource: FHIRObservation): Partial<TriageAssessment> {
    return {
      id: fhirResource.id,
      patientId: fhirResource.subject?.reference?.split('/')[1] || '';
      esiScore: fhirResource.valueInteger || 5
    };
  }
}

// Supporting interfaces
interface FlowOptimizationResult {
  timestamp: Date,
  currentMetrics: CapacityMetrics;
  identifiedBottlenecks: Bottleneck[],
  recommendations: FlowRecommendation[];
  implementedActions: ImplementedAction[],
  projectedImpact: ProjectedImpact
}

interface Bottleneck {
  type: string,
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL',
  affectedPatients: number;
  estimatedDelay: number; // minutes
}

interface FlowRecommendation {
  type: string,
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH',
  estimatedImpact: string;
  autoImplementable: boolean,
  requiredApproval: boolean
}

interface ImplementedAction {
  type: string,
  description: string;
  implementedAt: Date,
  expectedOutcome: string
}

interface ProjectedImpact {
  waitTimeReduction: number; // minutes
  throughputIncrease: number; // percentage
  satisfactionImprovement: number; // percentage
  confidenceLevel: number; // percentage
