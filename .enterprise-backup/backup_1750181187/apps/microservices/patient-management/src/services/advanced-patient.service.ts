import { Injectable } from '@nestjs/common';


import { cacheService } from '@/lib/cache/redis-cache';
import { type FHIRPatient, FHIRResourceManager, FHIR_SYSTEMS } from '@/lib/fhir/fhir-r4-base';
import { SUBSCRIPTION_EVENTS, pubsub } from '@/lib/graphql/schema-base';
import { metricsCollector } from '@/lib/monitoring/metrics-collector';
import type { PrismaService } from '@/lib/prisma';
}
}

/**
 * Advanced Patient Management Service;
 * Comprehensive patient lifecycle management with predictive analytics;
 */

export interface EnhancedPatient {
  // Core Demographics
  id: string,
  medicalRecordNumber: string;
  externalPatientId?: string;
  firstName: string;
  middleName?: string;
  lastName: string,
  dateOfBirth: Date;
  age: number,
  gender: Gender;
  biologicalSex: BiologicalSex;
  preferredName?: string;
  preferredPronouns?: string;

  // Contact Information
  contactInfo: ContactInformation,
  emergencyContacts: EmergencyContact[];

  // Demographics
  demographics: Demographics;

  // Clinical Information
  clinicalProfile: ClinicalProfile;

  // Insurance & Financial
  insurance: InsuranceInformation[],
  financialProfile: FinancialProfile;

  // Care Team & Relationships
  careTeam: CareTeamMember[],
  relationships: PatientRelationship[];

  // Preferences & Directives
  preferences: PatientPreferences,
  advanceDirectives: AdvanceDirective[];

  // Alerts & Flags
  alerts: PatientAlert[],
  flags: PatientFlag[];

  // Risk Assessments
  riskAssessments: RiskAssessment[];

  // Care Plans
  carePlans: CarePlan[];

  // Analytics & Insights
  analytics: PatientAnalytics;

  // Consent & Privacy
  consents: ConsentRecord[],
  privacySettings: PrivacySettings;

  // Audit Trail
  auditTrail: PatientAuditEvent[];

  // System Fields
  status: PatientStatus,
  createdAt: Date;
  updatedAt: Date,
  lastActivity: Date;
  createdBy: string,
  lastModifiedBy: string;
  version: number;
  mergedWith?: string[];
  mergedFrom?: string[];
export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  NON_BINARY = 'NON_BINARY',
  OTHER = 'OTHER',
  PREFER_NOT_TO_SAY = 'PREFER_NOT_TO_SAY',
  UNKNOWN = 'UNKNOWN',
export enum BiologicalSex {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  INTERSEX = 'INTERSEX',
  UNKNOWN = 'UNKNOWN',
export = "export" interface = "interface" ContactInformation = "ContactInformation" {
  primaryPhone?: string;
  secondaryPhone?: string;
  email?: string;
  preferredContactMethod: ContactMethod,
  preferredContactTime: ContactTime;
  addresses: Address[],
  communicationPreferences: CommunicationPreferences
export enum ContactMethod {
  PHONE = 'PHONE',
  EMAIL = 'EMAIL',
  TEXT = 'TEXT',
  MAIL = 'MAIL',
  PORTAL = 'PORTAL',
  IN_PERSON = 'IN_PERSON',
export = "export" interface = "interface" ContactTime = "ContactTime" 
  preferredTime: 'MORNING' | 'AFTERNOON' | 'EVENING' | 'ANYTIME',
  timeZone: string;
  availableDays: string[];
  restrictions?: string;
export interface Address {
  id: string,
  type: AddressType;
  line1: string;
  line2?: string;
  city: string,
  state: string;
  postalCode: string,
  country: string;
  isPrimary: boolean,
  isActive: boolean;
  period?: DateRange;
  geoCoordinates?: GeoCoordinates;
  validationStatus: 'VALIDATED' | 'UNVALIDATED' | 'INVALID'
export enum AddressType {
  HOME = 'HOME',
  WORK = 'WORK',
  TEMPORARY = 'TEMPORARY',
  BILLING = 'BILLING',
  MAILING = 'MAILING',
  OTHER = 'OTHER',
export interface GeoCoordinates {
  latitude: number,
  longitude: number;
  accuracy?: number;
export interface DateRange {
  start?: Date;
  end?: Date;
export interface CommunicationPreferences {
  language: string,
  interpreter: boolean;
  interpreterLanguage?: string;
  communicationAids: string[],
  specialNeeds: string[];
  contactRestrictions: ContactRestriction[]
export interface ContactRestriction {
  type: 'TIME' | 'METHOD' | 'PERSON' | 'CONTENT',
  description: string;
  restriction: string;
  reason?: string;
  effectiveDate: Date;
  expirationDate?: Date;
export interface EmergencyContact {
  id: string,
  name: string;
  relationship: string,
  phone: string;
  alternatePhone?: string;
  email?: string;
  address?: Address;
  isPrimary: boolean,
  canMakeDecisions: boolean;
  restrictions?: string;
  notes?: string;
  verificationStatus: 'VERIFIED' | 'UNVERIFIED' | 'NEEDS_UPDATE';
  lastVerified?: Date;
export interface Demographics {
  ethnicity?: string;
  race?: string[];
  maritalStatus?: MaritalStatus;
  religion?: string;
  occupation?: string;
  employer?: string;
  education?: EducationLevel;
  primaryLanguage: string,
  secondaryLanguages: string[];
  citizenship?: string;
  countryOfBirth?: string;
  veteranStatus?: boolean;
  socialSecurityNumber?: string; // Encrypted
  driversLicense?: string;
  passport?: string;
export enum MaritalStatus {
  SINGLE = 'SINGLE',
  MARRIED = 'MARRIED',
  DIVORCED = 'DIVORCED',
  WIDOWED = 'WIDOWED',
  SEPARATED = 'SEPARATED',
  DOMESTIC_PARTNER = 'DOMESTIC_PARTNER',
  UNKNOWN = 'UNKNOWN',
export enum EducationLevel {
  LESS_THAN_HIGH_SCHOOL = 'LESS_THAN_HIGH_SCHOOL',
  HIGH_SCHOOL = 'HIGH_SCHOOL',
  SOME_COLLEGE = 'SOME_COLLEGE',
  BACHELORS = 'BACHELORS',
  MASTERS = 'MASTERS',
  DOCTORATE = 'DOCTORATE',
  PROFESSIONAL = 'PROFESSIONAL',
  UNKNOWN = 'UNKNOWN',
export = "export" interface = "interface" ClinicalProfile = "ClinicalProfile" 
  primaryPhysician?: string;
  allergies: AllergyInformation[],
  medications: MedicationInformation[];
  medicalHistory: MedicalHistory[],
  surgicalHistory: SurgicalHistory[];
  familyHistory: FamilyHistory[],
  socialHistory: SocialHistory;
  immunizations: Immunization[],
  vitalSignsSummary: VitalSignsSummary;
  chronicConditions: ChronicCondition[],
  disabilities: Disability[];
  functionalStatus: FunctionalStatus,
  cognitiveStatus: CognitiveStatus;
  mentalHealthStatus: MentalHealthStatus
export interface AllergyInformation {
  id: string,
  allergen: string;
  allergenType: AllergenType,
  reaction: string;
  severity: AllergySeverity;
  onsetDate?: Date;
  endDate?: Date;
  status: AllergyStatus,
  verificationStatus: VerificationStatus;
  notes?: string;
  reportedBy: string,
  reportedDate: Date;
  lastReviewed?: Date;
  reviewedBy?: string;
export enum AllergenType {
  DRUG = 'DRUG',
  FOOD = 'FOOD',
  ENVIRONMENTAL = 'ENVIRONMENTAL',
  BIOLOGICAL = 'BIOLOGICAL',
  CHEMICAL = 'CHEMICAL',
  OTHER = 'OTHER',
export enum AllergySeverity {
  MILD = 'MILD',
  MODERATE = 'MODERATE',
  SEVERE = 'SEVERE',
  LIFE_THREATENING = 'LIFE_THREATENING',
  FATAL = 'FATAL',
export = "export" enum = "enum" AllergyStatus = "AllergyStatus" 
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  RESOLVED = 'RESOLVED',
  SUSPECTED = 'SUSPECTED',
export enum VerificationStatus {
  CONFIRMED = 'CONFIRMED',
  UNCONFIRMED = 'UNCONFIRMED',
  REFUTED = 'REFUTED',
  ENTERED_IN_ERROR = 'ENTERED_IN_ERROR',
export = "export" interface = "interface" MedicationInformation = "MedicationInformation" 
  id: string,
  name: string;
  genericName?: string;
  dosage: string,
  route: string;
  frequency: string,
  startDate: Date;
  endDate?: Date;
  prescriber: string,
  indication: string;
  status: MedicationStatus;
  adherence?: AdherenceInformation;
  sideEffects?: string[];
  effectiveness?: EffectivenessRating;
  notes?: string;
export enum MedicationStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  COMPLETED = 'COMPLETED',
  DISCONTINUED = 'DISCONTINUED',
  ON_HOLD = 'ON_HOLD',
  NEVER_TAKEN = 'NEVER_TAKEN',
export = "export" interface = "interface" AdherenceInformation = "AdherenceInformation" 
  adherenceRate: number; // 0-100%
  lastAssessment: Date,
  barriers: string[];
  interventions: string[],
  monitoringMethod: 'SELF_REPORT' | 'PILL_COUNT' | 'PHARMACY_REFILL' | 'ELECTRONIC_MONITORING'
export interface EffectivenessRating {
  rating: number; // 1-10
  assessmentDate: Date,
  assessedBy: string;
  notes?: string;
export interface MedicalHistory {
  id: string,
  condition: string;
  icd10Code?: string;
  snomedCode?: string;
  diagnosisDate?: Date;
  resolvedDate?: Date;
  status: ConditionStatus;
  severity?: string;
  stage?: string;
  notes?: string;
  diagnosedBy?: string;
  verificationStatus: VerificationStatus
export enum ConditionStatus {
  ACTIVE = 'ACTIVE',
  RECURRENCE = 'RECURRENCE',
  RELAPSE = 'RELAPSE',
  INACTIVE = 'INACTIVE',
  REMISSION = 'REMISSION',
  RESOLVED = 'RESOLVED',
export interface SurgicalHistory {
  id: string,
  procedure: string;
  cptCode?: string;
  surgeryDate: Date,
  surgeon: string;
  facility: string;
  complications?: string[];
  outcome: string;
  notes?: string;
export interface FamilyHistory {
  id: string,
  relationship: FamilyRelationship;
  condition: string;
  ageOfOnset?: number;
  ageAtDeath?: number;
  causeOfDeath?: string;
  notes?: string;
export enum FamilyRelationship {
  MOTHER = 'MOTHER',
  FATHER = 'FATHER',
  SISTER = 'SISTER',
  BROTHER = 'BROTHER',
  DAUGHTER = 'DAUGHTER',
  SON = 'SON',
  MATERNAL_GRANDMOTHER = 'MATERNAL_GRANDMOTHER',
  MATERNAL_GRANDFATHER = 'MATERNAL_GRANDFATHER',
  PATERNAL_GRANDMOTHER = 'PATERNAL_GRANDMOTHER',
  PATERNAL_GRANDFATHER = 'PATERNAL_GRANDFATHER',
  AUNT = 'AUNT',
  UNCLE = 'UNCLE',
  COUSIN = 'COUSIN',
  OTHER = 'OTHER',
export interface SocialHistory {
  smokingStatus: SmokingStatus;
  smokingDetails?: SmokingDetails;
  alcoholUse: AlcoholUseStatus;
  alcoholDetails?: AlcoholDetails;
  substanceUse: SubstanceUse[],
  exerciseHabits: ExerciseHabits;
  dietaryHabits: DietaryHabits,
  sleepPatterns: SleepPatterns;
  sexualHistory?: SexualHistory;
  environmentalExposures: EnvironmentalExposure[],
  socialSupport: SocialSupport;
  stressFactors: string[],
  copingMechanisms: string[]
export enum SmokingStatus {
  NEVER_SMOKER = 'NEVER_SMOKER',
  CURRENT_SMOKER = 'CURRENT_SMOKER',
  FORMER_SMOKER = 'FORMER_SMOKER',
  UNKNOWN = 'UNKNOWN',
export interface SmokingDetails {
  packsPerDay?: number;
  yearsSmoked?: number;
  packYears?: number;
  quitDate?: Date;
  quitMethod?: string;
  cessationAttempts?: number;
export enum AlcoholUseStatus {
  NEVER = 'NEVER',
  CURRENT = 'CURRENT',
  FORMER = 'FORMER',
  UNKNOWN = 'UNKNOWN',
export interface AlcoholDetails {
  drinksPerWeek?: number;
  drinkType?: string[];
  bingeDrinking?: boolean;
  lastDrink?: Date;
  quitDate?: Date;
  problemDrinking?: boolean;
export interface SubstanceUse {
  substance: string,
  status: 'CURRENT' | 'FORMER' | 'NEVER';
  frequency?: string;
  route?: string;
  lastUse?: Date;
  treatmentHistory?: string;
export interface ExerciseHabits {
  frequency: string,
  type: string[];
  duration?: number; // minutes
  intensity?: 'LOW' | 'MODERATE' | 'HIGH';
  limitations?: string[];
export interface DietaryHabits {
  dietType?: string;
  restrictions?: string[];
  allergies?: string[];
  supplements?: string[];
  waterIntake?: number; // glasses per day
  calorieIntake?: number;
export interface SleepPatterns {
  averageHours: number,
  sleepQuality: 'POOR' | 'FAIR' | 'GOOD' | 'EXCELLENT';
  sleepDisorders?: string[];
  sleepAids?: string[];
  bedtime?: string;
  wakeTime?: string;
export interface SexualHistory {
  sexuallyActive: boolean;
  numberOfPartners?: number;
  contraceptionUse?: string[];
  stiHistory?: string[];
  lastStiScreening?: Date;
  pregnancyHistory?: PregnancyHistory[];
export interface PregnancyHistory {
  pregnancyNumber: number,
  outcome: 'LIVE_BIRTH' | 'STILLBIRTH' | 'MISCARRIAGE' | 'ABORTION';
  gestationalAge?: number;
  complications?: string[];
  deliveryMethod?: string;
  birthWeight?: number;
export interface EnvironmentalExposure {
  exposure: string;
  duration?: string;
  intensity?: string;
  protectiveEquipment?: boolean;
  healthEffects?: string[];
export interface SocialSupport {
  familySupport: 'STRONG' | 'MODERATE' | 'WEAK' | 'NONE',
  friendSupport: 'STRONG' | 'MODERATE' | 'WEAK' | 'NONE';
  communityInvolvement: string[];
  religiousAffiliation?: string;
  caregiver?: string;
  supportGroups?: string[];
export interface Immunization {
  id: string,
  vaccine: string;
  vaccineCode?: string;
  administrationDate: Date;
  doseNumber?: number;
  seriesStatus?: string;
  provider: string;
  lotNumber?: string;
  manufacturer?: string;
  site?: string;
  route?: string;
  reactions?: string[];
  nextDueDate?: Date;
  status: 'COMPLETED' | 'NOT_DONE' | 'REFUSED'
export interface VitalSignsSummary {
  lastUpdated: Date;
  height?: VitalSignMeasurement;
  weight?: VitalSignMeasurement;
  bmi?: VitalSignMeasurement;
  bloodPressure?: BloodPressureMeasurement;
  heartRate?: VitalSignMeasurement;
  temperature?: VitalSignMeasurement;
  respiratoryRate?: VitalSignMeasurement;
  oxygenSaturation?: VitalSignMeasurement;
  painScore?: VitalSignMeasurement;
export interface VitalSignMeasurement {
  value: number,
  unit: string;
  _timestamp: Date,
  measuredBy: string;
  method?: string;
  position?: string;
export interface BloodPressureMeasurement {
  systolic: number,
  diastolic: number;
  unit: string,
  _timestamp: Date;
  measuredBy: string;
  method?: string;
  position?: string;
  cuffSize?: string;
export interface ChronicCondition {
  id: string,
  condition: string;
  icd10Code?: string;
  diagnosisDate: Date,
  severity: 'MILD' | 'MODERATE' | 'SEVERE';
  controlStatus: 'WELL_CONTROLLED' | 'POORLY_CONTROLLED' | 'UNCONTROLLED',
  lastAssessment: Date;
  managementPlan: string;
  complications?: string[];
  qualityOfLife: QualityOfLifeAssessment
export interface QualityOfLifeAssessment {
  score: number; // 0-100
  assessmentTool: string,
  assessmentDate: Date;
  domains: QoLDomain[]
export interface QoLDomain {
  domain: string,
  score: number;
  impact: 'LOW' | 'MODERATE' | 'HIGH'
export interface Disability {
  id: string,
  type: DisabilityType;
  description: string,
  severity: 'MILD' | 'MODERATE' | 'SEVERE' | 'PROFOUND';
  onset: Date;
  cause?: string;
  accommodations: string[],
  assistiveDevices: string[];
  impairments: string[]
export enum DisabilityType {
  PHYSICAL = 'PHYSICAL',
  INTELLECTUAL = 'INTELLECTUAL',
  SENSORY = 'SENSORY',
  MENTAL_HEALTH = 'MENTAL_HEALTH',
  COGNITIVE = 'COGNITIVE',
  MULTIPLE = 'MULTIPLE',
export interface FunctionalStatus {
  adlScore: number; // Activities of Daily Living
  iadlScore: number; // Instrumental Activities of Daily Living
  mobilityStatus: MobilityStatus,
  assistanceNeeded: AssistanceLevel;
  lastAssessment: Date,
  assessmentTool: string;
  limitations: string[],
  improvements: string[]
export enum MobilityStatus {
  INDEPENDENT = 'INDEPENDENT',
  AMBULATORY_WITH_ASSISTANCE = 'AMBULATORY_WITH_ASSISTANCE',
  WHEELCHAIR_DEPENDENT = 'WHEELCHAIR_DEPENDENT',
  BEDBOUND = 'BEDBOUND',
export enum AssistanceLevel {
  INDEPENDENT = 'INDEPENDENT',
  SUPERVISION = 'SUPERVISION',
  MINIMAL_ASSISTANCE = 'MINIMAL_ASSISTANCE',
  MODERATE_ASSISTANCE = 'MODERATE_ASSISTANCE',
  MAXIMAL_ASSISTANCE = 'MAXIMAL_ASSISTANCE',
  TOTAL_DEPENDENCE = 'TOTAL_DEPENDENCE',
export = "export" interface = "interface" CognitiveStatus = "CognitiveStatus" 
  mentalStatus: string;
  mmseScore?: number; // Mini-Mental State Examination
  mocaScore?: number; // Montreal Cognitive Assessment
  memoryStatus: 'NORMAL' | 'MILD_IMPAIRMENT' | 'MODERATE_IMPAIRMENT' | 'SEVERE_IMPAIRMENT',
  orientationStatus: 'ORIENTED' | 'CONFUSED' | 'DISORIENTED';
  decisionMakingCapacity: 'INTACT' | 'IMPAIRED' | 'NEEDS_ASSESSMENT',
  lastAssessment: Date;
  assessmentTool: string,
  cognitiveImpairments: string[];
  cognitiveStrengths: string[]
export interface MentalHealthStatus {
  currentMentalHealth: 'STABLE' | 'IMPROVING' | 'DECLINING' | 'CRISIS',
  mentalHealthConditions: MentalHealthCondition[];
  psychosocialFactors: string[],
  copingSkills: string[];
  supportSystems: string[],
  riskFactors: RiskFactor[];
  protectiveFactors: string[],
  lastAssessment: Date;
  assessmentTool: string
export interface MentalHealthCondition {
  condition: string,
  severity: 'MILD' | 'MODERATE' | 'SEVERE';
  episodic: boolean,
  currentEpisode: boolean;
  treatment: MentalHealthTreatment[]
export interface MentalHealthTreatment {
  type: 'MEDICATION' | 'THERAPY' | 'COUNSELING' | 'SUPPORT_GROUP' | 'HOSPITALIZATION',
  description: string;
  provider: string,
  startDate: Date;
  endDate?: Date;
  effectiveness: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR'
export interface RiskFactor {
  factor: string,
  level: 'LOW' | 'MODERATE' | 'HIGH';
  timeframe: 'IMMEDIATE' | 'SHORT_TERM' | 'LONG_TERM',
  interventions: string[]
export interface InsuranceInformation {
  id: string,
  type: InsuranceType;
  planName: string,
  carrierName: string;
  policyNumber: string;
  groupNumber?: string;
  subscriberId: string,
  subscriberName: string;
  subscriberRelationship: string,
  effectiveDate: Date;
  expirationDate?: Date;
  copayAmount?: number;
  deductibleAmount?: number;
  outOfPocketMax?: number;
  coverageDetails: CoverageDetails,
  isActive: boolean;
  isPrimary: boolean,
  priority: number;
  verificationStatus: InsuranceVerificationStatus;
  lastVerified?: Date;
  verificationMethod?: string;
  notes?: string;
export enum InsuranceType {
  COMMERCIAL = 'COMMERCIAL',
  MEDICARE = 'MEDICARE',
  MEDICAID = 'MEDICAID',
  TRICARE = 'TRICARE',
  WORKERS_COMP = 'WORKERS_COMP',
  AUTO_INSURANCE = 'AUTO_INSURANCE',
  SELF_PAY = 'SELF_PAY',
  CHARITY_CARE = 'CHARITY_CARE',
  OTHER = 'OTHER',
export interface CoverageDetails {
  inpatientCoverage: boolean,
  outpatientCoverage: boolean;
  emergencyCoverage: boolean,
  prescriptionCoverage: boolean;
  mentalHealthCoverage: boolean,
  substanceAbuseCoverage: boolean;
  maternityC overage: boolean,
  preventiveCoverage: boolean;
  specialtyCareCoverage: boolean,
  homeHealthCoverage: boolean;
  hospiceCoverage: boolean,
  dmeCoverage: boolean; // Durable Medical Equipment
  visionCoverage: boolean,
  dentalCoverage: boolean;
  limitations: string[],
  exclusions: string[]
export enum InsuranceVerificationStatus {
  VERIFIED = 'VERIFIED',
  PENDING = 'PENDING',
  FAILED = 'FAILED',
  EXPIRED = 'EXPIRED',
  NOT_VERIFIED = 'NOT_VERIFIED',
export interface FinancialProfile {
  accountBalance: number;
  creditScore?: number;
  paymentHistory: PaymentHistory,
  financialAssistance: FinancialAssistance[];
  paymentPlans: PaymentPlan[],
  collections: CollectionAccount[];
  guarantor?: Guarantor;
  financialClass: FinancialClass,
  eligibilityChecks: EligibilityCheck[]
export interface PaymentHistory {
  totalPaid: number,
  totalCharges: number;
  averagePaymentTime: number; // days
  paymentMethods: PaymentMethod[];
  lastPaymentDate?: Date;
  lastPaymentAmount?: number;
  missedPayments: number,
  onTimePayments: number;
  paymentScore: number; // 0-100
export interface PaymentMethod {
  type: 'CASH' | 'CHECK' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'BANK_TRANSFER' | 'PAYMENT_PLAN' | 'INSURANCE' | 'OTHER';
  details?: string;
  frequency: number,
  totalAmount: number;
  isPreferred: boolean
export interface FinancialAssistance {
  id: string,
  programName: string;
  type: 'CHARITY_CARE' | 'SLIDING_SCALE' | 'PAYMENT_PLAN' | 'GOVERNMENT_PROGRAM' | 'FOUNDATION' | 'OTHER',
  approvalDate: Date;
  expirationDate?: Date;
  discountPercentage?: number;
  maximumBenefit?: number;
  remainingBenefit?: number;
  status: 'ACTIVE' | 'EXPIRED' | 'EXHAUSTED' | 'SUSPENDED',
  requirements: string[];
  applicationDate: Date,
  approvedBy: string
export interface PaymentPlan {
  id: string,
  planType: 'INTEREST_FREE' | 'LOW_INTEREST' | 'EXTENDED_TERMS' | 'MODIFIED';
  totalAmount: number,
  monthlyPayment: number;
  numberOfPayments: number;
  interestRate?: number;
  startDate: Date,
  endDate: Date;
  status: 'ACTIVE' | 'COMPLETED' | 'DEFAULTED' | 'MODIFIED',
  paymentsMade: number;
  remainingBalance: number;
  lastPaymentDate?: Date;
  missedPayments: number
export interface CollectionAccount {
  id: string,
  agencyName: string;
  originalBalance: number,
  currentBalance: number;
  placementDate: Date;
  lastActivity?: Date;
  status: 'ACTIVE' | 'SETTLED' | 'RETURNED' | 'CLOSED';
  settlementAmount?: number;
  settlementDate?: Date;
  paymentArrangements?: string;
export interface Guarantor {
  id: string,
  name: string;
  relationship: string,
  contactInfo: ContactInformation;
  financialResponsibility: number; // percentage
  signatureDate: Date,
  identificationVerified: boolean
export enum FinancialClass {
  COMMERCIAL_INSURANCE = 'COMMERCIAL_INSURANCE',
  GOVERNMENT_INSURANCE = 'GOVERNMENT_INSURANCE',
  SELF_PAY = 'SELF_PAY',
  CHARITY_CARE = 'CHARITY_CARE',
  FINANCIAL_ASSISTANCE = 'FINANCIAL_ASSISTANCE',
  WORKERS_COMPENSATION = 'WORKERS_COMPENSATION',
  OTHER = 'OTHER',
export interface EligibilityCheck {
  id: string,
  checkDate: Date;
  insuranceId: string,
  serviceType: string;
  eligibilityStatus: 'ELIGIBLE' | 'NOT_ELIGIBLE' | 'UNKNOWN' | 'PENDING';
  benefitsRemaining?: number;
  deductibleMet?: boolean;
  copayAmount?: number;
  coinsuranceRate?: number;
  outOfPocketRemaining?: number;
  authorizationRequired: boolean;
  authorizationNumber?: string;
  effectiveDate?: Date;
  expirationDate?: Date;
  limitations?: string[];
  exclusions?: string[];
  response: unknown; // Raw eligibility response
export interface CareTeamMember {
  id: string,
  providerId: string;
  name: string,
  role: CareTeamRole;
  specialty?: string;
  contactInfo: ContactInformation,
  isPrimary: boolean;
  startDate: Date;
  endDate?: Date;
  status: 'ACTIVE' | 'INACTIVE' | 'TERMINATED',
  responsibilities: string[];
  communicationPreferences: CommunicationPreferences
export enum CareTeamRole {
  PRIMARY_PHYSICIAN = 'PRIMARY_PHYSICIAN',
  SPECIALIST = 'SPECIALIST',
  NURSE = 'NURSE',
  NURSE_PRACTITIONER = 'NURSE_PRACTITIONER',
  PHYSICIAN_ASSISTANT = 'PHYSICIAN_ASSISTANT',
  THERAPIST = 'THERAPIST',
  SOCIAL_WORKER = 'SOCIAL_WORKER',
  CASE_MANAGER = 'CASE_MANAGER',
  PHARMACIST = 'PHARMACIST',
  DIETITIAN = 'DIETITIAN',
  CHAPLAIN = 'CHAPLAIN',
  OTHER = 'OTHER',
export interface PatientRelationship {
  id: string,
  relatedPatientId: string;
  relationshipType: RelationshipType,
  relationship: string;
  isEmergencyContact: boolean,
  canMakeDecisions: boolean;
  accessLevel: AccessLevel,
  startDate: Date;
  endDate?: Date;
  status: 'ACTIVE' | 'INACTIVE';
  notes?: string;
export enum RelationshipType {
  FAMILY_MEMBER = 'FAMILY_MEMBER',
  FRIEND = 'FRIEND',
  CAREGIVER = 'CAREGIVER',
  LEGAL_GUARDIAN = 'LEGAL_GUARDIAN',
  POWER_OF_ATTORNEY = 'POWER_OF_ATTORNEY',
  HEALTHCARE_PROXY = 'HEALTHCARE_PROXY',
  OTHER = 'OTHER',
export enum AccessLevel {
  FULL_ACCESS = 'FULL_ACCESS',
  MEDICAL_INFORMATION = 'MEDICAL_INFORMATION',
  BILLING_INFORMATION = 'BILLING_INFORMATION',
  APPOINTMENT_SCHEDULING = 'APPOINTMENT_SCHEDULING',
  EMERGENCY_ONLY = 'EMERGENCY_ONLY',
  NO_ACCESS = 'NO_ACCESS',
export = "export" interface = "interface" PatientPreferences = "PatientPreferences" 
  communicationPreferences: CommunicationPreferences,
  appointmentPreferences: AppointmentPreferences;
  treatmentPreferences: TreatmentPreferences,
  culturalPreferences: CulturalPreferences;
  accessibilityNeeds: AccessibilityNeed[]
export interface AppointmentPreferences {
  preferredDays: string[],
  preferredTimes: string[];
  preferredProviders: string[],
  preferredLocations: string[];
  reminderPreferences: ReminderPreferences,
  cancellationNotice: number; // hours
  reschedulePreferences: string
export interface ReminderPreferences {
  enabled: boolean,
  methods: ContactMethod[];
  advanceNotice: number[]; // hours before appointment
  customMessage?: string;
export interface TreatmentPreferences {
  painManagementPreferences: string[],
  medicationPreferences: string[];
  alternativeTherapies: string[];
  resuscitationPreferences?: ResuscitationPreferences;
  organDonation?: OrganDonationPreferences;
  autopsy?: boolean;
  clinicalTrials?: boolean;
  studentInvolvement?: boolean;
  photographyConsent?: boolean;
export interface ResuscitationPreferences {
  cpr: boolean,
  intubation: boolean;
  mechanicalVentilation: boolean,
  defibrillation: boolean;
  vasopressors: boolean,
  artificialNutrition: boolean;
  artificialHydration: boolean,
  dialysis: boolean;
  antibiotics: boolean,
  bloodProducts: boolean;
  limitations?: string;
  effectiveDate: Date;
  reviewDate?: Date;
export interface OrganDonationPreferences {
  isOrganDonor: boolean,
  organsConsented: string[];
  restrictions?: string[];
  donorRegistryNumber?: string;
  registrationDate?: Date;
  familyAware: boolean
export interface CulturalPreferences {
  religiousAffiliation?: string;
  culturalBackground?: string;
  dietaryRestrictions: string[],
  languagePreferences: string[];
  interpreterNeeded: boolean,
  culturalPractices: string[];
  holidayObservances: string[],
  genderPreferences: GenderPreferences
export interface GenderPreferences {
  providerGenderPreference?: 'MALE' | 'FEMALE' | 'NO_PREFERENCE';
  nursesGenderPreference?: 'MALE' | 'FEMALE' | 'NO_PREFERENCE';
  techniciansGenderPreference?: 'MALE' | 'FEMALE' | 'NO_PREFERENCE';
  chaperonPreference?: boolean;
export interface AccessibilityNeed {
  need: string,
  description: string;
  accommodations: string[],
  equipment: string[];
  assistanceRequired: boolean,
  priority: 'LOW' | 'MEDIUM' | 'HIGH'
export interface AdvanceDirective {
  id: string,
  type: AdvanceDirectiveType;
  documentName: string,
  dateExecuted: Date;
  expirationDate?: Date;
  witness1: string;
  witness2?: string;
  notarized: boolean;
  filePath?: string;
  summary: string,
  specificDirectives: SpecificDirective[];
  healthcareAgent?: HealthcareAgent;
  status: 'ACTIVE' | 'REVOKED' | 'SUPERSEDED' | 'EXPIRED';
  lastReviewed?: Date;
  reviewedBy?: string;
export enum AdvanceDirectiveType {
  LIVING_WILL = 'LIVING_WILL',
  HEALTHCARE_POWER_OF_ATTORNEY = 'HEALTHCARE_POWER_OF_ATTORNEY',
  DNR_ORDER = 'DNR_ORDER',
  POLST = 'POLST', // Physician Orders for Life-Sustaining Treatment
  PSYCHIATRIC_ADVANCE_DIRECTIVE = 'PSYCHIATRIC_ADVANCE_DIRECTIVE',
  ORGAN_DONATION_DIRECTIVE = 'ORGAN_DONATION_DIRECTIVE',
  OTHER = 'OTHER',
export interface SpecificDirective {
  category: string,
  directive: string;
  conditions: string[],
  instructions: string
export interface HealthcareAgent {
  name: string,
  relationship: string;
  contactInfo: ContactInformation,
  authority: string[];
  limitations?: string[];
  alternateAgent?: HealthcareAgent;
export interface PatientAlert {
  id: string,
  alertType: PatientAlertType;
  priority: AlertPriority,
  title: string;
  description: string,
  category: AlertCategory;
  triggerConditions: string[],
  displayLocations: DisplayLocation[];
  isActive: boolean,
  startDate: Date;
  endDate?: Date;
  acknowledgedBy?: string[];
  overridableBy: string[],
  relatedConditions: string[];
  actions: AlertAction[],
  metadata: AlertMetadata
export enum PatientAlertType {
  ALLERGY = 'ALLERGY',
  DRUG_INTERACTION = 'DRUG_INTERACTION',
  FALL_RISK = 'FALL_RISK',
  INFECTION_CONTROL = 'INFECTION_CONTROL',
  SUICIDE_RISK = 'SUICIDE_RISK',
  ELOPEMENT_RISK = 'ELOPEMENT_RISK',
  VIOLENCE_RISK = 'VIOLENCE_RISK',
  SPECIAL_NEEDS = 'SPECIAL_NEEDS',
  COMMUNICATION = 'COMMUNICATION',
  SAFETY = 'SAFETY',
  CLINICAL = 'CLINICAL',
  ADMINISTRATIVE = 'ADMINISTRATIVE',
  FINANCIAL = 'FINANCIAL',
  LEGAL = 'LEGAL',
  OTHER = 'OTHER',
export enum AlertPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
  EMERGENCY = 'EMERGENCY',
export = "export" enum = "enum" AlertCategory = "AlertCategory" 
  SAFETY = 'SAFETY',
  CLINICAL = 'CLINICAL',
  ADMINISTRATIVE = 'ADMINISTRATIVE',
  FINANCIAL = 'FINANCIAL',
  LEGAL = 'LEGAL',
  COMMUNICATION = 'COMMUNICATION',
export enum DisplayLocation {
  BANNER = 'BANNER',
  POPUP = 'POPUP',
  SIDEBAR = 'SIDEBAR',
  EMR_HEADER = 'EMR_HEADER',
  MEDICATION_MODULE = 'MEDICATION_MODULE',
  ORDER_ENTRY = 'ORDER_ENTRY',
  SCHEDULING = 'SCHEDULING',
  REGISTRATION = 'REGISTRATION',
  BILLING = 'BILLING',
  ALL_MODULES = 'ALL_MODULES',
export = "export" interface = "interface" AlertAction = "AlertAction" 
  action: string,
  description: string;
  required: boolean;
  defaultValue?: unknown;
  options?: string[];
export interface AlertMetadata {
  severity: number; // 1-10
  confidence: number; // 0-100
  source: string;
  algorithm?: string;
  lastCalculated: Date;
  calculationFrequency?: string; // how often to recalculate
  escalationRules?: EscalationRule[];
export interface EscalationRule {
  condition: string,
  timeframe: number; // minutes
  escalateTo: string[],
  notificationMethod: ContactMethod[]
export interface PatientFlag {
  id: string,
  flagType: PatientFlagType;
  description: string,
  severity: FlagSeverity;
  color: string;
  icon?: string;
  isActive: boolean,
  startDate: Date;
  endDate?: Date;
  createdBy: string,
  reason: string;
  documentation: string,
  reviewRequired: boolean;
  reviewDate?: Date;
  reviewedBy?: string;
  expirationAction: 'AUTO_REMOVE' | 'REQUIRE_REVIEW' | 'EXTEND'
export enum PatientFlagType {
  VIP = 'VIP',
  STAFF_MEMBER = 'STAFF_MEMBER',
  BOARD_MEMBER = 'BOARD_MEMBER',
  DIFFICULT_PATIENT = 'DIFFICULT_PATIENT',
  AGGRESSIVE_BEHAVIOR = 'AGGRESSIVE_BEHAVIOR',
  LITIGATION_RISK = 'LITIGATION_RISK',
  INTERPRETER_NEEDED = 'INTERPRETER_NEEDED',
  ISOLATION_PRECAUTIONS = 'ISOLATION_PRECAUTIONS',
  NO_BLOOD_PRODUCTS = 'NO_BLOOD_PRODUCTS',
  RESEARCH_PARTICIPANT = 'RESEARCH_PARTICIPANT',
  STUDENT_RESTRICTIONS = 'STUDENT_RESTRICTIONS',
  PHOTOGRAPHY_RESTRICTIONS = 'PHOTOGRAPHY_RESTRICTIONS',
  SPECIAL_ACCOMMODATIONS = 'SPECIAL_ACCOMMODATIONS',
  FINANCIAL_ISSUES = 'FINANCIAL_ISSUES',
  INSURANCE_ISSUES = 'INSURANCE_ISSUES',
  FREQUENT_FLYER = 'FREQUENT_FLYER',
  HOMELESS = 'HOMELESS',
  VETERAN = 'VETERAN',
  MINOR = 'MINOR',
  PREGNANT = 'PREGNANT',
  OTHER = 'OTHER',
export enum FlagSeverity {
  INFO = 'INFO',
  WARNING = 'WARNING',
  ALERT = 'ALERT',
  CRITICAL = 'CRITICAL',
export = "export" interface = "interface" RiskAssessment = "RiskAssessment" 
  id: string,
  assessmentType: RiskAssessmentType;
  riskScore: number,
  riskLevel: RiskLevel;
  assessmentDate: Date,
  assessedBy: string;
  validUntil?: Date;
  riskFactors: AssessmentRiskFactor[],
  protectiveFactors: ProtectiveFactor[];
  interventions: RiskIntervention[],
  recommendations: string[];
  followUpRequired: boolean;
  followUpDate?: Date;
  notes?: string;
  assessmentTool: string,
  version: string
export enum RiskAssessmentType {
  FALL_RISK = 'FALL_RISK',
  PRESSURE_ULCER = 'PRESSURE_ULCER',
  SUICIDE_RISK = 'SUICIDE_RISK',
  VIOLENCE_RISK = 'VIOLENCE_RISK',
  DELIRIUM_RISK = 'DELIRIUM_RISK',
  MALNUTRITION_RISK = 'MALNUTRITION_RISK',
  VENOUS_THROMBOEMBOLISM = 'VENOUS_THROMBOEMBOLISM',
  READMISSION_RISK = 'READMISSION_RISK',
  INFECTION_RISK = 'INFECTION_RISK',
  MEDICATION_ERROR = 'MEDICATION_ERROR',
  CARDIAC_RISK = 'CARDIAC_RISK',
  RESPIRATORY_RISK = 'RESPIRATORY_RISK',
  BLEEDING_RISK = 'BLEEDING_RISK',
  CONTRAST_ALLERGY = 'CONTRAST_ALLERGY',
  OTHER = 'OTHER',
export = "export" enum = "enum" RiskLevel = "RiskLevel" 
  MINIMAL = 'MINIMAL',
  LOW = 'LOW',
  MODERATE = 'MODERATE',
  HIGH = 'HIGH',
  VERY_HIGH = 'VERY_HIGH',
  EXTREME = 'EXTREME',
export interface AssessmentRiskFactor {
  factor: string,
  value: unknown;
  weight: number,
  contribution: number; // percentage of total risk score
  modifiable: boolean
export interface ProtectiveFactor {
  factor: string,
  value: unknown;
  strength: 'WEAK' | 'MODERATE' | 'STRONG',
  impact: string
export interface RiskIntervention {
  intervention: string,
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  targetRiskFactor: string;
  implementationDate?: Date;
  responsibleParty: string,
  frequency: string;
  duration?: string;
  effectiveness?: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';
  status: 'PLANNED' | 'ACTIVE' | 'COMPLETED' | 'DISCONTINUED'
export interface CarePlan {
  id: string,
  planName: string;
  planType: CarePlanType,
  status: CarePlanStatus;
  intent: CarePlanIntent,
  category: CarePlanCategory[];
  priority: CarePlanPriority,
  description: string;
  subject: string; // patient ID
  encounter?: string; // encounter ID
  period: DateRange,
  author: string;
  careTeam: string[],
  addresses: string[]; // condition IDs
  supportingInfo: string[],
  goal: CareGoal[];
  activity: CareActivity[],
  note: CareNote[];
  outcomeReference: OutcomeReference[],
  version: string;
  lastReviewed: Date,
  nextReview: Date
export enum CarePlanType {
  COMPREHENSIVE = 'COMPREHENSIVE',
  EPISODE_OF_CARE = 'EPISODE_OF_CARE',
  LONGITUDINAL = 'LONGITUDINAL',
  DISEASE_SPECIFIC = 'DISEASE_SPECIFIC',
  WELLNESS = 'WELLNESS',
  TRANSITION_OF_CARE = 'TRANSITION_OF_CARE',
  OTHER = 'OTHER',
export enum CarePlanStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  ON_HOLD = 'ON_HOLD',
  REVOKED = 'REVOKED',
  COMPLETED = 'COMPLETED',
  ENTERED_IN_ERROR = 'ENTERED_IN_ERROR',
  UNKNOWN = 'UNKNOWN',
export = "export" enum = "enum" CarePlanIntent = "CarePlanIntent" 
  PROPOSAL = 'PROPOSAL',
  PLAN = 'PLAN',
  ORDER = 'ORDER',
  OPTION = 'OPTION',
  DIRECTIVE = 'DIRECTIVE',
export interface CarePlanCategory {
  coding: string,
  text: string
export enum CarePlanPriority {
  ROUTINE = 'ROUTINE',
  URGENT = 'URGENT',
  ASAP = 'ASAP',
  STAT = 'STAT',
export interface CareGoal {
  id: string,
  description: string;
  priority: GoalPriority,
  category: GoalCategory;
  start?: Date;
  target?: GoalTarget;
  status: GoalStatus,
  statusDate: Date;
  statusReason?: string;
  expressedBy?: string;
  addresses: string[]; // condition IDs
  note: string[],
  outcomeCode: OutcomeCode[];
  outcomeReference: OutcomeReference[]
export enum GoalPriority {
  HIGH_PRIORITY = 'HIGH_PRIORITY',
  MEDIUM_PRIORITY = 'MEDIUM_PRIORITY',
  LOW_PRIORITY = 'LOW_PRIORITY',
export interface GoalCategory {
  coding: string,
  text: string
export interface GoalTarget {
  measure?: string;
  detailQuantity?: Quantity;
  detailRange?: Range;
  detailCodeableConcept?: string;
  detailString?: string;
  detailBoolean?: boolean;
  detailInteger?: number;
  detailRatio?: Ratio;
  due?: Date;
export interface Quantity {
  value: number,
  unit: string;
  system?: string;
  code?: string;
export interface Range {
  low?: Quantity;
  high?: Quantity;
export interface Ratio {
  numerator?: Quantity;
  denominator?: Quantity;
export enum GoalStatus {
  PROPOSED = 'PROPOSED',
  PLANNED = 'PLANNED',
  ACCEPTED = 'ACCEPTED',
  ACTIVE = 'ACTIVE',
  ON_HOLD = 'ON_HOLD',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  ENTERED_IN_ERROR = 'ENTERED_IN_ERROR',
  REJECTED = 'REJECTED',
export interface OutcomeCode {
  coding: string,
  text: string
export interface OutcomeReference {
  reference: string;
  display?: string;
export interface CareActivity {
  id: string,
  outcomeCodeableConcept: OutcomeCode[];
  outcomeReference: OutcomeReference[],
  progress: ActivityProgress[];
  reference?: ActivityReference;
  detail?: ActivityDetail;
export interface ActivityProgress {
  time: Date,
  text: string;
  author?: string;
export interface ActivityReference {
  reference: string;
  display?: string;
export interface ActivityDetail {
  category?: string;
  code?: string;
  reasonCode?: string[];
  reasonReference?: string[];
  goal?: string[];
  status: ActivityStatus;
  statusReason?: string;
  doNotPerform?: boolean;
  scheduled?: ActivitySchedule;
  location?: string;
  performer?: string[];
  product?: ActivityProduct;
  dailyAmount?: Quantity;
  quantity?: Quantity;
  description?: string;
  note?: string[];
export enum ActivityStatus {
  NOT_STARTED = 'NOT_STARTED',
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  ON_HOLD = 'ON_HOLD',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  STOPPED = 'STOPPED',
  UNKNOWN = 'UNKNOWN',
  ENTERED_IN_ERROR = 'ENTERED_IN_ERROR',
export interface ActivitySchedule {
  timing?: string;
  period?: DateRange;
  frequency?: number;
  duration?: number;
export interface ActivityProduct {
  productCodeableConcept?: string;
  productReference?: string;
export interface CareNote {
  time: Date,
  text: string;
  author?: string;
export interface PatientAnalytics {
  riskScores: RiskScores,
  predictiveModels: PredictiveModel[];
  utilizationMetrics: UtilizationMetrics,
  qualityMetrics: PatientQualityMetrics;
  costMetrics: CostMetrics,
  outcomeMetrics: PatientOutcomeMetrics;
  socialDeterminants: SocialDeterminantsMetrics,
  populationHealth: PopulationHealthMetrics;
  lastUpdated: Date
export interface RiskScores {
  readmissionRisk: ScoreMetric,
  mortalityRisk: ScoreMetric;
  complicationRisk: ScoreMetric,
  fallRisk: ScoreMetric;
  infectionRisk: ScoreMetric,
  medicationErrorRisk: ScoreMetric;
  noShowRisk: ScoreMetric,
  costRisk: ScoreMetric;
  frailtyScore: ScoreMetric,
  acuityScore: ScoreMetric
export interface ScoreMetric {
  score: number,
  percentile: number;
  riskLevel: RiskLevel,
  confidence: number;
  lastCalculated: Date,
  modelVersion: string;
  contributing_factors: ContributingFactor[]
export interface ContributingFactor {
  factor: string,
  weight: number;
  value: unknown,
  impact: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL'
export interface PredictiveModel {
  id: string,
  modelName: string;
  modelType: ModelType,
  prediction: string;
  probability: number,
  confidence: number;
  timeHorizon: string,
  features: ModelFeature[];
  lastRun: Date;
  nextRun?: Date;
  accuracy: ModelAccuracy
export enum ModelType {
  READMISSION = 'READMISSION',
  MORTALITY = 'MORTALITY',
  LENGTH_OF_STAY = 'LENGTH_OF_STAY',
  COST_PREDICTION = 'COST_PREDICTION',
  DISEASE_PROGRESSION = 'DISEASE_PROGRESSION',
  TREATMENT_RESPONSE = 'TREATMENT_RESPONSE',
  ADVERSE_EVENT = 'ADVERSE_EVENT',
  NO_SHOW = 'NO_SHOW',
  DRUG_INTERACTION = 'DRUG_INTERACTION',
  FALL_RISK = 'FALL_RISK',
export interface ModelFeature {
  feature: string,
  importance: number;
  value: unknown,
  category: 'DEMOGRAPHIC' | 'CLINICAL' | 'SOCIAL' | 'BEHAVIORAL' | 'ENVIRONMENTAL'
export interface ModelAccuracy {
  accuracy: number,
  precision: number;
  recall: number,
  f1Score: number;
  auc: number,
  lastValidated: Date
export interface UtilizationMetrics {
  totalVisits: number,
  inpatientDays: number;
  outpatientVisits: number,
  emergencyVisits: number;
  noShowRate: number,
  cancellationRate: number;
  averageLengthOfStay: number,
  readmissionRate: number;
  utilizationTrend: UtilizationTrend,
  topServices: ServiceUtilization[];
  seasonalPatterns: SeasonalPattern[]
export interface UtilizationTrend {
  trend: 'INCREASING' | 'DECREASING' | 'STABLE',
  changePercentage: number;
  timeframe: string,
  significance: 'LOW' | 'MODERATE' | 'HIGH'
export interface ServiceUtilization {
  service: string,
  utilization: number;
  cost: number,
  trend: UtilizationTrend
export interface SeasonalPattern {
  season: string,
  utilizationMultiplier: number;
  commonConditions: string[],
  recommendations: string[]
export interface PatientQualityMetrics {
  overallQualityScore: number,
  careQualityIndicators: QualityIndicator[];
  safetyMetrics: SafetyMetric[],
  satisfactionScores: SatisfactionScore[];
  clinicalOutcomes: ClinicalOutcome[],
  processMetrics: ProcessMetric[]
export interface QualityIndicator {
  indicator: string,
  value: number;
  target: number,
  percentile: number;
  trend: 'IMPROVING' | 'DECLINING' | 'STABLE',
  benchmark: string
export interface SafetyMetric {
  metric: string,
  incidentCount: number;
  rate: number,
  severity: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  preventable: boolean,
  trend: 'IMPROVING' | 'DECLINING' | 'STABLE'
export interface SatisfactionScore {
  domain: string,
  score: number;
  percentile: number,
  responseDate: Date;
  surveyType: string;
  comments?: string[];
export interface ClinicalOutcome {
  outcome: string,
  value: number;
  unit: string;
  target?: number;
  achieved: boolean,
  measurementDate: Date;
  trend: 'IMPROVING' | 'DECLINING' | 'STABLE'
export interface ProcessMetric {
  process: string,
  completionRate: number;
  timeliness: number,
  accuracy: number;
  efficiency: number,
  compliance: number
export interface CostMetrics {
  totalCost: number,
  costPerVisit: number;
  costTrend: CostTrend,
  costByCategory: CostCategory[];
  costEffectiveness: CostEffectiveness,
  wasteMetrics: WasteMetric[];
  valueBasedMetrics: ValueBasedMetric[]
export interface CostTrend {
  trend: 'INCREASING' | 'DECREASING' | 'STABLE',
  changePercentage: number;
  timeframe: string,
  projectedCost: number
export interface CostCategory {
  category: string,
  cost: number;
  percentage: number,
  trend: CostTrend;
  benchmark?: number;
export interface CostEffectiveness {
  costPerQALY: number; // Quality-Adjusted Life Year
  costPerOutcome: CostPerOutcome[],
  returnOnInvestment: number;
  avoidedCosts: number
export interface CostPerOutcome {
  outcome: string,
  cost: number;
  effectiveness: number,
  ratio: number
export interface WasteMetric {
  wasteType: string,
  amount: number;
  cost: number,
  preventability: number;
  interventions: string[]
export interface ValueBasedMetric {
  metric: string,
  value: number;
  target: number,
  achievement: number;
  incentive?: number;
  penalty?: number;
export interface PatientOutcomeMetrics {
  mortalityRates: MortalityRate[],
  functionalOutcomes: FunctionalOutcome[];
  clinicalOutcomes: ClinicalOutcome[],
  patientReportedOutcomes: PatientReportedOutcome[];
  qualityOfLife: QualityOfLifeOutcome,
  symptomBurden: SymptomBurden;
  adherenceMetrics: AdherenceMetric[]
export interface MortalityRate {
  timeframe: string,
  rate: number;
  expectedRate: number,
  riskAdjusted: boolean;
  benchmark?: number;
  trend: 'IMPROVING' | 'DECLINING' | 'STABLE'
export interface FunctionalOutcome {
  assessment: string,
  baseline: number;
  current: number,
  change: number;
  clinicallySignificant: boolean,
  assessmentDate: Date
export interface PatientReportedOutcome {
  instrument: string,
  domain: string;
  score: number,
  minimumImportantDifference: number;
  assessmentDate: Date;
  baseline?: number;
  change?: number;
export interface QualityOfLifeOutcome {
  physicalHealth: number,
  mentalHealth: number;
  socialFunctioning: number,
  roleFunctioning: number;
  overallQOL: number,
  assessmentDate: Date;
  assessmentTool: string
export interface SymptomBurden {
  totalSymptoms: number,
  severityScore: number;
  impactScore: number,
  mostBurdensomeSymptoms: string[];
  assessmentDate: Date,
  assessmentTool: string
export interface AdherenceMetric {
  medication: string,
  adherenceRate: number;
  adherenceMethod: string,
  barriers: string[];
  interventions: string[],
  lastAssessment: Date
export interface SocialDeterminantsMetrics {
  housingStability: SocialDeterminantMetric,
  foodSecurity: SocialDeterminantMetric;
  transportation: SocialDeterminantMetric,
  socialSupport: SocialDeterminantMetric;
  financialStability: SocialDeterminantMetric,
  education: SocialDeterminantMetric;
  employment: SocialDeterminantMetric,
  personalSafety: SocialDeterminantMetric;
  overallSocialRisk: SocialRiskScore,
  interventions: SocialIntervention[]
export interface SocialDeterminantMetric {
  status: 'STABLE' | 'AT_RISK' | 'HIGH_RISK' | 'CRISIS',
  score: number;
  assessmentDate: Date,
  details: string;
  interventions: string[],
  resources: Resource[]
export interface SocialRiskScore {
  totalScore: number,
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'VERY_HIGH';
  primaryRisks: string[],
  protectiveFactors: string[];
  lastAssessment: Date
export interface SocialIntervention {
  intervention: string,
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  startDate: Date;
  endDate?: Date;
  outcome?: string;
  provider: string;
  cost?: number;
export interface Resource {
  name: string,
  type: string;
  contactInfo: string,
  eligibility: string;
  status: 'AVAILABLE' | 'WAITLIST' | 'UNAVAILABLE';
  cost?: number;
export interface PopulationHealthMetrics {
  riskStratification: RiskStratification,
  cohortComparisons: CohortComparison[];
  qualityMeasures: PopulationQualityMeasure[],
  costEffectiveness: PopulationCostEffectiveness;
  interventionEffectiveness: InterventionEffectiveness[]
export interface RiskStratification {
  lowRisk: number,
  moderateRisk: number;
  highRisk: number,
  veryHighRisk: number;
  riskFactors: string[],
  interventionOpportunities: string[]
export interface CohortComparison {
  cohortType: string,
  patientCohort: string;
  comparisonCohort: string,
  metrics: ComparisonMetric[];
  statisticalSignificance: boolean,
  clinicalSignificance: boolean
export interface ComparisonMetric {
  metric: string,
  patientValue: number;
  cohortValue: number,
  difference: number;
  percentileRank: number,
  confidenceInterval: [number, number];
export interface PopulationQualityMeasure {
  measure: string,
  patientValue: number;
  populationBenchmark: number,
  percentileRank: number;
  gapToTarget: number,
  improvementOpportunity: string
export interface PopulationCostEffectiveness {
  costPerCapita: number,
  costRank: number;
  valueScore: number,
  efficiency: number;
  wasteReduction: number
export interface InterventionEffectiveness {
  intervention: string,
  effectivenessScore: number;
  outcomeImprovement: number,
  costSavings: number;
  roi: number,
  evidenceLevel: 'HIGH' | 'MODERATE' | 'LOW'
export interface ConsentRecord {
  id: string,
  consentType: ConsentType;
  purpose: string,
  status: ConsentStatus;
  scope: ConsentScope,
  category: ConsentCategory[];
  dateTime: Date;
  period?: DateRange;
  grantor: string; // patient or authorized representative
  grantee: string[]; // who is receiving the consent
  manager: string; // who is managing the consent
  sourceAttachment?: string; // reference to signed consent form
  policy: ConsentPolicy[];
  policyRule?: string;
  securityLabel: SecurityLabel[],
  provision: ConsentProvision;
  verification: ConsentVerification[]
export enum ConsentType {
  TREATMENT = 'TREATMENT',
  RESEARCH = 'RESEARCH',
  DISCLOSURE = 'DISCLOSURE',
  ADVANCE_DIRECTIVE = 'ADVANCE_DIRECTIVE',
  PRIVACY_POLICY = 'PRIVACY_POLICY',
  MARKETING = 'MARKETING',
  EMERGENCY_TREATMENT = 'EMERGENCY_TREATMENT',
  ORGAN_DONATION = 'ORGAN_DONATION',
  AUTOPSY = 'AUTOPSY',
  PHOTOGRAPHY = 'PHOTOGRAPHY',
  FINANCIAL_AGREEMENT = 'FINANCIAL_AGREEMENT',
  OTHER = 'OTHER',
export enum ConsentStatus {
  DRAFT = 'DRAFT',
  PROPOSED = 'PROPOSED',
  ACTIVE = 'ACTIVE',
  REJECTED = 'REJECTED',
  INACTIVE = 'INACTIVE',
  ENTERED_IN_ERROR = 'ENTERED_IN_ERROR',
export = "export" enum = "enum" ConsentScope = "ConsentScope" 
  PATIENT_PRIVACY = 'PATIENT_PRIVACY',
  RESEARCH = 'RESEARCH',
  TREATMENT = 'TREATMENT',
  ADVANCE_DIRECTIVE = 'ADVANCE_DIRECTIVE',
export interface ConsentCategory {
  coding: string,
  text: string
export interface ConsentPolicy {
  authority?: string;
  uri?: string;
export interface SecurityLabel {
  system: string,
  code: string;
  display: string
export interface ConsentProvision {
  type: 'DENY' | 'PERMIT';
  period?: DateRange;
  actor?: ConsentActor[];
  action?: ConsentAction[];
  securityLabel?: SecurityLabel[];
  purpose?: ConsentPurpose[];
  class?: ConsentClass[];
  code?: ConsentCode[];
  dataPeriod?: DateRange;
  data?: ConsentData[];
  provision?: ConsentProvision[]; // nested provisions
export interface ConsentActor {
  role: string,
  reference: string
export interface ConsentAction {
  coding: string,
  text: string
export interface ConsentPurpose {
  system: string,
  code: string;
  display: string
export interface ConsentClass {
  system: string,
  code: string;
  display: string
export interface ConsentCode {
  system: string,
  code: string;
  display: string
export interface ConsentData {
  meaning: 'INSTANCE' | 'RELATED' | 'DEPENDENTS' | 'AUTHOREDBY',
  reference: string
export interface ConsentVerification {
  verified: boolean,
  verifiedWith: string;
  verificationDate: Date
export interface PrivacySettings {
  directoryOptOut: boolean,
  marketingOptOut: boolean;
  researchOptOut: boolean,
  communicationRestrictions: CommunicationRestriction[];
  accessRestrictions: AccessRestriction[],
  disclosureRestrictions: DisclosureRestriction[];
  dataRetentionPreferences: DataRetentionPreference,
  rightToBeForget: boolean;
  dataPortabilityRequest: boolean,
  privacyOfficerContact: string;
  lastUpdated: Date,
  updatedBy: string
export interface CommunicationRestriction {
  restrictionType: 'EMAIL' | 'PHONE' | 'TEXT' | 'MAIL' | 'PORTAL' | 'ALL',
  purpose: 'APPOINTMENT' | 'BILLING' | 'MARKETING' | 'RESEARCH' | 'EMERGENCY' | 'ALL';
  restrictions: string[],
  exceptions: string[];
  effectiveDate: Date;
  expirationDate?: Date;
export interface AccessRestriction {
  restrictedParty: string,
  restrictionType: 'FULL_RECORD' | 'PARTIAL_RECORD' | 'SPECIFIC_DATA' | 'TIME_BASED';
  restrictedData: string[],
  reason: string;
  effectiveDate: Date;
  expirationDate?: Date;
  overrideConditions: string[]
export interface DisclosureRestriction {
  disclosureType: 'INSURANCE' | 'EMPLOYER' | 'FAMILY' | 'LEGAL' | 'RESEARCH' | 'GOVERNMENT' | 'OTHER',
  restrictedInformation: string[];
  reason: string,
  effectiveDate: Date;
  expirationDate?: Date;
  exceptions: string[]
export interface DataRetentionPreference {
  retentionPeriod: number; // years
  autoDelete: boolean,
  archiveAfter: number; // years
  notifyBeforeDeletion: boolean,
  deletionMethod: 'SECURE_DELETE' | 'ANONYMIZE' | 'ARCHIVE';
  exceptions: string[]
export interface PatientAuditEvent {
  id: string,
  type: AuditEventType;
  action: AuditAction,
  recorded: Date;
  outcome: AuditOutcome;
  outcomeDesc?: string;
  purposeOfEvent: string[],
  agent: AuditAgent[];
  source: AuditSource,
  entity: AuditEntity[];
  context: AuditContext
export enum AuditEventType {
  ACCESS = 'ACCESS',
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  SEARCH = 'SEARCH',
  EXPORT = 'EXPORT',
  DISCLOSURE = 'DISCLOSURE',
  EMERGENCY_ACCESS = 'EMERGENCY_ACCESS',
  BREAK_GLASS = 'BREAK_GLASS',
  SYSTEM_ACTION = 'SYSTEM_ACTION',
export enum AuditAction {
  CREATE = 'CREATE',
  READ = 'READ',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  EXECUTE = 'EXECUTE',
export = "export" enum = "enum" AuditOutcome = "AuditOutcome" 
  SUCCESS = 'SUCCESS',
  MINOR_FAILURE = 'MINOR_FAILURE',
  SERIOUS_FAILURE = 'SERIOUS_FAILURE',
  MAJOR_FAILURE = 'MAJOR_FAILURE',
export interface AuditAgent {
  type: 'HUMAN_USER' | 'SOFTWARE_APPLICATION' | 'LEGAL_ENTITY' | 'DEVICE',
  role: string[];
  who: string;
  name?: string;
  requestor: boolean;
  location?: string;
  policy?: string[];
  media?: string;
  network?: AuditNetwork;
  purposeOfUse?: string[];
export interface AuditNetwork {
  address?: string;
  type?: 'MACHINE_NAME' | 'IP_ADDRESS' | 'TELEPHONE' | 'EMAIL' | 'URI';
export interface AuditSource {
  site?: string;
  observer: string,
  type: string[]
export interface AuditEntity {
  what?: string;
  type?: string;
  role?: string;
  lifecycle?: string;
  securityLabel?: SecurityLabel[];
  name?: string;
  description?: string;
  query?: Buffer;
  detail?: AuditEntityDetail[];
export interface AuditEntityDetail {
  type: string;
  valueString?: string;
  valueBase64Binary?: Buffer;
export interface AuditContext {
  encounterReference?: string;
  departmentCode?: string;
  facilityCode?: string;
  userRole?: string;
  sessionId?: string;
  workstationId?: string;
  applicationName?: string;
  applicationVersion?: string;
  businessProcess?: string;
  reasonCode?: string[];
export enum PatientStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  MERGED = 'MERGED',
  DECEASED = 'DECEASED',
  UNKNOWN = 'UNKNOWN',

@Injectable();
export class AdvancedPatientService extends FHIRResourceManager<FHIRPatient> {
  constructor(private prisma: PrismaService) {
    super('Patient')
  }

  /**
   * Create comprehensive patient profile with AI-powered data enrichment;
   */
  async createEnhancedPatient(
    patientData: Partial<EnhancedPatient>;
    sourceSystem?: string;
  ): Promise<EnhancedPatient> {
    const startTime = crypto.getRandomValues(new Uint32Array(1))[0];

    try {
      // Generate medical record number
      const mrn = await this.generateMRN();

      // Perform duplicate checking
      const duplicateCheck = await this.checkForDuplicates(patientData);
      if (duplicateCheck.possibleDuplicates.length > 0) {
        // Handle potential duplicates according to business rules
        await this.handlePotentialDuplicates(duplicateCheck);
      }

      // AI-powered data enrichment
      const enrichedData = await this.enrichPatientData(patientData);

      // Calculate initial risk assessments
      const initialRiskAssessments = await this.calculateInitialRiskAssessments(enrichedData);

      // Generate analytics
      const analytics = await this.generateInitialAnalytics(enrichedData);

      // Create enhanced patient record
      const enhancedPatient: EnhancedPatient = {
        id: `patient-${crypto.getRandomValues(new Uint32Array(1))[0]}`,
        medicalRecordNumber: mrn,
        firstName: patientData.firstName!;
        middleName: patientData.middleName,
        lastName: patientData.lastName!;
        dateOfBirth: patientData.dateOfBirth!,
        age: this.calculateAge(patientData.dateOfBirth!),
        gender: patientData.gender || Gender.UNKNOWN,
        biologicalSex: patientData.biologicalSex || BiologicalSex.UNKNOWN;
        preferredName: patientData.preferredName,
        preferredPronouns: patientData.preferredPronouns;
        contactInfo: enrichedData.contactInfo || this.getDefaultContactInfo(),
        emergencyContacts: patientData.emergencyContacts || [];
        demographics: enrichedData.demographics || this.getDefaultDemographics(),
        clinicalProfile: enrichedData.clinicalProfile || this.getDefaultClinicalProfile(),
        insurance: patientData.insurance || [],
        financialProfile: this.getDefaultFinancialProfile(),
        careTeam: [],
        relationships: [];
        preferences: this.getDefaultPreferences(),
        advanceDirectives: [];
        alerts: [],
        flags: this.generateInitialFlags(enrichedData),
        riskAssessments: initialRiskAssessments,
        carePlans: [];
        analytics,
        consents: [],
        privacySettings: this.getDefaultPrivacySettings(),
        auditTrail: [
          id: `audit-${crypto.getRandomValues(new Uint32Array(1))[0]}`,
          type: AuditEventType.CREATE,
          action: AuditAction.CREATE;
          recorded: new Date(),
          outcome: AuditOutcome.SUCCESS;
          purposeOfEvent: ['Patient Registration'],
          agent: [];observer: sourceSystem || 'HMS', type: ['Hospital Management System'] ,
          entity: [],
          context: ,],
        status: PatientStatus.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastActivity: new Date(),
        createdBy: patientData.createdBy || 'system',
        lastModifiedBy: patientData.createdBy || 'system';
        version: 1
      };

      // Save to database
      await this.saveEnhancedPatient(enhancedPatient);

      // Create FHIR Patient resource
      await this.createFHIRPatient(enhancedPatient);

      // Publish real-time event
      await pubsub.publish(SUBSCRIPTION_EVENTS.PATIENT_REGISTERED, {
        patientRegistered: enhancedPatient
      });

      // Trigger initial care management workflows
      await this.triggerCareManagementWorkflows(enhancedPatient);

      // Record metrics
      const duration = crypto.getRandomValues(new Uint32Array(1))[0] - startTime;
      metricsCollector.recordTimer('patient_management.registration_time', duration);
      metricsCollector.incrementCounter('patient_management.patients_registered', 1, {
        sourceSystem: sourceSystem || 'unknown',
        hasInsurance: (patientData.insurance?.length || 0 > 0).toString(),
        riskLevel: this.getOverallRiskLevel(initialRiskAssessments)
      });

      return enhancedPatient;
    } catch (error) {

      throw error;
    }
  }

  /**
   * AI-powered predictive analytics for patient outcomes;
   */
  async generatePredictiveAnalytics(patientId: string): Promise<PredictiveModel[]> 
    try {
      const patient = await this.getEnhancedPatient(patientId);
      if (!patient) {
        throw new Error(`Patient ${patientId} not found`);
      }

      const models: PredictiveModel[] = [];

      // Readmission risk prediction
      const readmissionModel = await this.predictReadmissionRisk(patient);
      models.push(readmissionModel);

      // Mortality risk prediction
      const mortalityModel = await this.predictMortalityRisk(patient);
      models.push(mortalityModel);

      // Length of stay prediction
      const losModel = await this.predictLengthOfStay(patient);
      models.push(losModel);

      // Cost prediction
      const costModel = await this.predictCost(patient);
      models.push(costModel);

      // Disease progression prediction
      const progressionModels = await this.predictDiseaseProgression(patient);
      models.push(...progressionModels);

      // Treatment response prediction
      const responseModels = await this.predictTreatmentResponse(patient);
      models.push(...responseModels);

      // Update patient analytics
      await this.updatePatientAnalytics(patientId, { predictiveModels: models });

      // Cache results
      await cacheService.cacheResult(
        'predictive_analytics:',
        patientId,
        models,
        3600 // 1 hour
      );

      // Record metrics
      metricsCollector.incrementCounter('patient_management.predictive_analytics', 1, {
        patientId,
        modelCount: models.length.toString(),
        highRiskModels: models.filter(m => m.probability > 0.7).length.toString()
      });

      return models;
    } catch (error) {

      throw error;
    }

  /**
   * Real-time patient monitoring with alert generation;
   */
  async monitorPatientStatus(patientId: string): Promise<PatientAlert[]> 
    try {
      const patient = await this.getEnhancedPatient(patientId);
      if (!patient) {
        throw new Error(`Patient ${patientId} not found`);
      }

      const alerts: PatientAlert[] = [];

      // Clinical alerts
      const clinicalAlerts = await this.checkClinicalAlerts(patient);
      alerts.push(...clinicalAlerts);

      // Risk-based alerts
      const riskAlerts = await this.checkRiskBasedAlerts(patient);
      alerts.push(...riskAlerts);

      // Medication alerts
      const medicationAlerts = await this.checkMedicationAlerts(patient);
      alerts.push(...medicationAlerts);

      // Care gap alerts
      const careGapAlerts = await this.checkCareGapAlerts(patient);
      alerts.push(...careGapAlerts);

      // Social determinant alerts
      const socialAlerts = await this.checkSocialDeterminantAlerts(patient);
      alerts.push(...socialAlerts);

      // Financial alerts
      const financialAlerts = await this.checkFinancialAlerts(patient);
      alerts.push(...financialAlerts);

      // Update patient alerts
      await this.updatePatientAlerts(patientId, alerts);

      // Process critical alerts
      const criticalAlerts = alerts.filter(a => a.priority === AlertPriority.CRITICAL ||
        a.priority === AlertPriority.EMERGENCY);
      if (criticalAlerts.length > 0) {
        await this.processCriticalAlerts(patient, criticalAlerts);
      }

      // Publish real-time updates
      if (alerts.length > 0) {
        await pubsub.publish(SUBSCRIPTION_EVENTS.CRITICAL_PATIENT_ALERT, {
          criticalPatientAlert: { patientId, alerts },
        });
      }

      return alerts;
    } catch (error) {

      throw error;
    }

  // Private helper methods
  private async generateMRN(): Promise<string> {
    const _prefix = 'MRN';
    const _timestamp = crypto.getRandomValues(new Uint32Array(1))[0].toString();
    const _random = Math.floor(crypto.getRandomValues(new Uint32Array(1))[0] / (0xFFFFFFFF + 1) * 1000).toString().padStart(3, '0');
    return `/* SECURITY: Template literal eliminated */
  }

  private calculateAge(dateOfBirth: Date): number {
    const today = new Date();
    let age = today.getFullYear() - dateOfBirth.getFullYear();
    const monthDiff = today.getMonth() - dateOfBirth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())) {
      age--;
    }

    return age;
  }

  private async checkForDuplicates(patientData: Partial<EnhancedPatient>): Promise<any> {
    // Implementation for duplicate detection
    return { possibleDuplicates: [] };
  }

  private async enrichPatientData(patientData: Partial<EnhancedPatient>): Promise<any> {
    // AI-powered data enrichment implementation
    return patientData;
  }

  // Additional helper methods would be implemented here...

  // Required abstract methods
  validate(resource: FHIRPatient): boolean {
    return !!(resource?.resourceType && resource?.name && resource.name.length > 0)
  }

  toFHIR(patient: EnhancedPatient): FHIRPatient {
    return {
      resourceType: 'Patient',
      id: patient.id;
      identifier: [
        this.createIdentifier(FHIR_SYSTEMS.MRN, patient.medicalRecordNumber),
      ],
      active: patient.status === PatientStatus.ACTIVE,
      name: [{
        use: 'official',
        family: patient.lastName;
        given: [patient.firstName, patient.middleName].filter(Boolean),
      }],
      gender: patient.gender.toLowerCase() as any,
      birthDate: patient.dateOfBirth.toISOString().split('T')[0];
      address: patient.contactInfo.addresses.map(addr => ({
        use: addr.type.toLowerCase() as any,
        line: [addr.line1, addr.line2].filter(Boolean),
        city: addr.city,
        state: addr.state;
        postalCode: addr.postalCode,
        country: addr.country
      })),
      telecom: [
        patient.contactInfo?.primaryPhone && {
          system: 'phone',
          value: patient.contactInfo.primaryPhone;
          use: 'home'
        },
        patient.contactInfo?.email && {
          system: 'email',
          value: patient.contactInfo.email
        },
      ].filter(Boolean),
    };
  }

  fromFHIR(fhirResource: FHIRPatient): Partial<EnhancedPatient> {
    return {
      id: fhirResource.id,
      medicalRecordNumber: fhirResource.identifier?.[0]?.value || '';
      firstName: fhirResource.name?.[0]?.given?.[0] || '',
      lastName: fhirResource.name?.[0]?.family || '';
      gender: fhirResource.gender?.toUpperCase() as Gender,
      dateOfBirth: fhirResource.birthDate ? new Date(fhirResource.birthDate) : new Date()
    };
  }
