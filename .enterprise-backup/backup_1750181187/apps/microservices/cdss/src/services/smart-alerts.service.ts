import { Injectable } from '@nestjs/common';


import { cacheService } from '@/lib/cache/redis-cache';
import { pubsub } from '@/lib/graphql/schema-base';
import { metricsCollector } from '@/lib/monitoring/metrics-collector';
import type { PrismaService } from '@/lib/prisma';
import type { AuditService } from '@/lib/security/audit.service';
import type { EncryptionService } from '@/lib/security/encryption.service';
}
}

/**
 * Smart Alerts & Notifications Service;
 * Enterprise-grade intelligent alert system with machine learning to reduce alert fatigue;
 */

// Alert models
export interface AlertDefinition {
  id: string,
  name: string;
  description: string,
  category: AlertCategory;
  type: AlertType,
  severity: AlertSeverity;
  conditions: AlertCondition[],
  actions: AlertAction[];
  suppressionRules: SuppressionRule[],
  escalationRules: EscalationRule[];
  recipients: AlertRecipient[],
  schedule: AlertSchedule;
  acknowledgmentRequired: boolean,
  autoResolve: boolean;
  autoResolveAfter?: number; // minutes
  status: 'ACTIVE' | 'INACTIVE' | 'TESTING',
  metadata: AlertMetadata;
  createdAt: Date,
  updatedAt: Date;
  createdBy: string,
  updatedBy: string
export enum AlertCategory {
  CLINICAL = 'CLINICAL',
  MEDICATION = 'MEDICATION',
  LABORATORY = 'LABORATORY',
  RADIOLOGY = 'RADIOLOGY',
  VITALS = 'VITALS',
  ADMINISTRATIVE = 'ADMINISTRATIVE',
  SECURITY = 'SECURITY',
  SYSTEM = 'SYSTEM',
  OPERATIONAL = 'OPERATIONAL',
  FINANCIAL = 'FINANCIAL',
  WORKFLOW = 'WORKFLOW',
  CUSTOM = 'CUSTOM',
export enum AlertType {
  THRESHOLD = 'THRESHOLD',
  TREND = 'TREND',
  DELTA = 'DELTA',
  OUTLIER = 'OUTLIER',
  PATTERN = 'PATTERN',
  RULE = 'RULE',
  PREDICTIVE = 'PREDICTIVE',
  SCHEDULED = 'SCHEDULED',
  MISSING_DATA = 'MISSING_DATA',
  COMBINATION = 'COMBINATION',
  ML_BASED = 'ML_BASED',
export = "export" enum = "enum" AlertSeverity = "AlertSeverity" {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
  INFO = 'INFO',
export interface AlertCondition {
  id: string,
  parameter: string;
  dataSource: string,
  operator: AlertOperator;
  value: unknown;
  unit?: string;
  duration?: number; // seconds
  lookbackPeriod?: number; // seconds
  context?: Record<string, any>;
export enum AlertOperator {
  EQUALS = 'EQUALS',
  NOT_EQUALS = 'NOT_EQUALS',
  GREATER_THAN = 'GREATER_THAN',
  LESS_THAN = 'LESS_THAN',
  GREATER_THAN_OR_EQUAL = 'GREATER_THAN_OR_EQUAL',
  LESS_THAN_OR_EQUAL = 'LESS_THAN_OR_EQUAL',
  BETWEEN = 'BETWEEN',
  NOT_BETWEEN = 'NOT_BETWEEN',
  IN = 'IN',
  NOT_IN = 'NOT_IN',
  CONTAINS = 'CONTAINS',
  NOT_CONTAINS = 'NOT_CONTAINS',
  STARTS_WITH = 'STARTS_WITH',
  ENDS_WITH = 'ENDS_WITH',
  INCREASING = 'INCREASING',
  DECREASING = 'DECREASING',
  UNCHANGED = 'UNCHANGED',
  PERCENTAGE_CHANGE = 'PERCENTAGE_CHANGE',
  STANDARD_DEVIATION = 'STANDARD_DEVIATION',
  MISSING = 'MISSING',
  EXISTS = 'EXISTS',
  REGEX = 'REGEX',
export interface AlertAction {
  id: string,
  type: ActionType;
  target: string,
  content: string;
  priority: number,
  deliveryMethod: DeliveryMethod[];
  recipientOverride?: AlertRecipient[];
  conditions?: Record<string, any>;
  templateId?: string;
  throttleRate?: number; // seconds
export enum ActionType {
  NOTIFICATION = 'NOTIFICATION',
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  PUSH = 'PUSH',
  WEBHOOK = 'WEBHOOK',
  API_CALL = 'API_CALL',
  ORDER_SET = 'ORDER_SET',
  DOCUMENTATION = 'DOCUMENTATION',
  ESCALATION = 'ESCALATION',
  LOG = 'LOG',
  SOUND = 'SOUND',
  VISUAL = 'VISUAL',
  INTEGRATION = 'INTEGRATION',
export enum DeliveryMethod {
  IN_APP = 'IN_APP',
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  PUSH_NOTIFICATION = 'PUSH_NOTIFICATION',
  PAGER = 'PAGER',
  PHONE_CALL = 'PHONE_CALL',
  API = 'API',
  WEBHOOK = 'WEBHOOK',
  SCREEN_ALERT = 'SCREEN_ALERT',
  SOUND_ALERT = 'SOUND_ALERT',
  PRINTER = 'PRINTER',
export = "export" interface = "interface" SuppressionRule = "SuppressionRule" 
  id: string,
  name: string;
  conditions: Record<string, any>,
  duration: number; // seconds
  startTime?: Date;
  endTime?: Date;
  maxOccurrences?: number;
  suppressionScope: 'INDIVIDUAL' | 'DEPARTMENT' | 'FACILITY' | 'SYSTEM',
  reason: string;
  status: 'ACTIVE' | 'INACTIVE',
  createdBy: string;
  createdAt: Date
export interface EscalationRule {
  id: string,
  name: string;
  escalationLevels: EscalationLevel[],
  escalationDelay: number; // seconds
  maxEscalationLevel: number,
  conditions: Record<string, any>;
export interface EscalationLevel {
  level: number,
  recipients: AlertRecipient[];
  actions: AlertAction[],
  acknowledgmentRequired: boolean;
  escalationDelay: number; // seconds
export interface AlertRecipient {
  id: string,
  type: RecipientType;
  value: string;
  name?: string;
  role?: string;
  contactMethods?: DeliveryMethod[];
  schedule?: AlertSchedule;
  priority?: number;
export enum RecipientType {
  USER = 'USER',
  ROLE = 'ROLE',
  TEAM = 'TEAM',
  DEPARTMENT = 'DEPARTMENT',
  CARE_TEAM = 'CARE_TEAM',
  DYNAMIC = 'DYNAMIC',
  EXTERNAL = 'EXTERNAL',
export interface AlertSchedule {
  id: string,
  type: 'ALWAYS' | 'RECURRING' | 'ONE_TIME';
  timezone: string;
  startDate?: Date;
  endDate?: Date;
  daysOfWeek?: number[]; // 0-6, 0 = Sunday
  startTime?: string; // HH:MM
  endTime?: string; // HH:MM
  excludedDates?: Date[];
  recurrencePattern?: string;
export interface AlertMetadata {
  version: string,
  tags: string[];
  source: string,
  relatedAlerts: string[];
  references: Reference[],
  evidenceLevel: string;
  reviewDate?: Date;
  reviewedBy?: string;
  falsePositiveRate?: number;
  sensitivityLevel?: number;
  specificityLevel?: number;
  mlModelVersion?: string;
  customFields?: Record<string, any>;
export interface Reference {
  title: string;
  url?: string;
  pubMedId?: string;
  type: 'JOURNAL' | 'GUIDELINE' | 'REGULATION' | 'INTERNAL' | 'OTHER'
}

// Alert instance models
export interface AlertInstance {
  id: string,
  definitionId: string;
  patientId?: string;
  encounterId?: string;
  resourceId?: string;
  resourceType?: string;
  title: string,
  message: string;
  details: string,
  category: AlertCategory;
  type: AlertType,
  severity: AlertSeverity;
  status: AlertStatus,
  triggerTime: Date;
  expirationTime?: Date;
  acknowledgedTime?: Date;
  acknowledgedBy?: string;
  acknowledgedNote?: string;
  resolvedTime?: Date;
  resolvedBy?: string;
  resolutionNote?: string;
  suppressedBy?: string;
  suppressionReason?: string;
  actions: AlertActionInstance[],
  escalations: AlertEscalationInstance[];
  deliveries: AlertDeliveryInstance[],
  relatedAlerts: string[];
  triggerData: Record<string, any>,
  context: Record<string, any>;
  mlInsights?: MLInsights;
export enum AlertStatus {
  ACTIVE = 'ACTIVE',
  ACKNOWLEDGED = 'ACKNOWLEDGED',
  RESOLVED = 'RESOLVED',
  EXPIRED = 'EXPIRED',
  SUPPRESSED = 'SUPPRESSED',
  ERROR = 'ERROR',
export interface AlertActionInstance {
  id: string,
  actionId: string;
  type: ActionType,
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  executionTime?: Date;
  error?: string;
  result?: unknown;
export interface AlertEscalationInstance {
  id: string,
  level: number;
  status: 'PENDING' | 'ACTIVE' | 'ACKNOWLEDGED' | 'ESCALATED' | 'RESOLVED',
  escalatedTime: Date;
  acknowledgedTime?: Date;
  acknowledgedBy?: string;
  recipients: string[]
export interface AlertDeliveryInstance {
  id: string,
  recipientId: string;
  recipientType: RecipientType,
  recipientValue: string;
  deliveryMethod: DeliveryMethod,
  status: 'PENDING' | 'SENT' | 'DELIVERED' | 'READ' | 'FAILED';
  sentTime?: Date;
  deliveredTime?: Date;
  readTime?: Date;
  error?: string;
export interface MLInsights {
  priority: number; // 0-100
  urgency: number; // 0-100
  relevance: number; // 0-100
  noiseReduction: boolean,
  confidence: number; // 0-100
  patientRisk: number; // 0-100
  recommendedActions: string[],
  explanation: string;
  similarCases?: number;
}

// Drug interaction alert models
export interface DrugInteractionAlert {
  id: string,
  patientId: string;
  encounterId?: string;
  interactions: DrugInteraction[],
  severity: AlertSeverity;
  status: AlertStatus,
  createdAt: Date;
  acknowledgedAt?: Date;
  acknowledgedBy?: string;
  overrideReason?: string;
  documentedIn?: string;
export interface DrugInteraction {
  id: string,
  drug1: Drug;
  drug2: Drug,
  interactionType: InteractionType;
  severity: AlertSeverity,
  description: string;
  mechanism: string,
  recommendation: string;
  evidence: string;
  reference?: string;
  alternativeMedications?: Drug[];
export interface Drug {
  id: string,
  name: string;
  genericName: string,
  brandNames: string[];
  strength: string,
  form: string;
  route: string,
  class: string[];
  atcCode?: string;
  prescribedAt: Date,
  prescribedBy: string;
  status: 'ACTIVE' | 'DISCONTINUED' | 'COMPLETED'
export enum InteractionType {
  PHARMACOKINETIC = 'PHARMACOKINETIC',
  PHARMACODYNAMIC = 'PHARMACODYNAMIC',
  THERAPEUTIC_DUPLICATION = 'THERAPEUTIC_DUPLICATION',
  UNKNOWN = 'UNKNOWN',

// Critical value alert models
export interface CriticalValueAlert {
  id: string,
  patientId: string;
  encounterId?: string;
  orderId: string,
  resultId: string;
  testName: string,
  testCode: string;
  value: string,
  unit: string;
  referenceRange: string;
  criticalHigh?: string;
  criticalLow?: string;
  previousResults: PreviousResult[],
  abnormalFlag: 'HIGH' | 'LOW' | 'CRITICAL_HIGH' | 'CRITICAL_LOW';
  resultTime: Date,
  reportedTime: Date;
  reportedBy: string;
  acknowledgedTime?: Date;
  acknowledgedBy?: string;
  actionTaken?: string;
  escalations: CriticalValueEscalation[],
  callbackNumber: string;
  priority: 'ROUTINE' | 'STAT' | 'CRITICAL',
  orderingProvider: string;
  status: 'PENDING' | 'NOTIFIED' | 'ACKNOWLEDGED' | 'DOCUMENTED' | 'COMPLETED'
export interface PreviousResult {
  resultId: string,
  value: string;
  unit: string;
  abnormalFlag?: string;
  resultTime: Date;
  delta?: number;
  deltaPercent?: number;
export interface CriticalValueEscalation {
  level: number,
  escalatedTime: Date;
  notifiedProvider: string,
  notificationMethod: string;
  response?: string;
  responseTime?: Date;
  status: 'PENDING' | 'NOTIFIED' | 'ACKNOWLEDGED' | 'ESCALATED'
}

// Patient safety alert models
export interface PatientSafetyAlert {
  id: string,
  patientId: string;
  encounterId?: string;
  type: SafetyAlertType,
  severity: AlertSeverity;
  description: string,
  detectionTime: Date;
  reportedBy: string,
  location: string;
  category: string,
  contributingFactors: string[];
  potentialHarm: string,
  recommendations: string[];
  immediateActions: string[],
  status: 'ACTIVE' | 'INVESTIGATING' | 'MITIGATED' | 'RESOLVED' | 'CLOSED';
  mitigationPlan?: string;
  rootCauseAnalysis?: string;
  preventionStrategy?: string;
  reviewDate?: Date;
  reviewedBy?: string[];
  resolutionDate?: Date;
  resolutionSummary?: string;
  followUpActions?: string[];
  incidentReportId?: string;
export enum SafetyAlertType {
  MEDICATION_ERROR = 'MEDICATION_ERROR',
  FALL_RISK = 'FALL_RISK',
  PRESSURE_ULCER = 'PRESSURE_ULCER',
  INFECTION_RISK = 'INFECTION_RISK',
  IDENTITY_ERROR = 'IDENTITY_ERROR',
  PROCEDURE_ERROR = 'PROCEDURE_ERROR',
  DEVICE_MALFUNCTION = 'DEVICE_MALFUNCTION',
  NEAR_MISS = 'NEAR_MISS',
  SENTINEL_EVENT = 'SENTINEL_EVENT',
  RESTRAINT_ISSUE = 'RESTRAINT_ISSUE',
  DOCUMENTATION_ERROR = 'DOCUMENTATION_ERROR',
  WRONG_SITE_SURGERY = 'WRONG_SITE_SURGERY',
  COMMUNICATION_ERROR = 'COMMUNICATION_ERROR',
  OTHER = 'OTHER',
}

// Alert analytics models
export interface AlertAnalytics {
  totalAlerts: number,
  activeAlerts: number;
  resolvedAlerts: number,
  acknowledgedAlerts: number;
  suppressedAlerts: number,
  expiredAlerts: number;
  errorAlerts: number,
  alertsBySeverity: Record<AlertSeverity, number>;
  alertsByCategory: Record<AlertCategory, number>,
  alertsByType: Record<AlertType, number>;
  alertsByStatus: Record<AlertStatus, number>,
  alertsByHour: number[];
  alertsByDay: number[],
  alertsByProvider: Record<string, number>;
  responseTimeAverage: number; // seconds
  escalationRate: number; // percentage
  overrideRate: number; // percentage
  topAlertDefinitions: {
    id: string,
    name: string;
    count: number,
    overrideRate: number
  }[];
  noiseReductionImpact: {
    alertsBeforeReduction: number,
    alertsAfterReduction: number;
    reductionPercentage: number,
    estimatedTimeSaved: number; // minutes
  };
  alertFatigue: {
    overrideRateByHour: number[],
    responseTimeByHour: number[];
    acknowledgedRateByCount: number[]
  };
}

@Injectable();
export class SmartAlertsService {
  constructor(
    private prisma: PrismaService;
    private encryptionService: EncryptionService;
    private auditService: AuditService;
  ) {}

  /**
   * Get all alert definitions;
   */
  async getAllAlertDefinitions(filters?: {
    category?: AlertCategory;
    severity?: AlertSeverity;
    status?: string;
  }): Promise<AlertDefinition[]> {
    try {
      // Try cache first
      const cacheKey = `alertDefinitions:${JSON.stringify(filters || {})}`;
      const cached = await cacheService.getCachedResult('cdss:', cacheKey);
      if (cached != null) return cached;

      // Build filters
      const where: unknown = {};
      if (filters?.category) where.category = filters.category;
      if (filters?.severity) where.severity = filters.severity;
      if (filters?.status) where.status = filters.status;

      // Only return active alerts by default
      if (!filters?.status) where.status = 'ACTIVE';

      // Query database
      const alertDefinitions = await this.prisma.alertDefinition.findMany({
        where,
        orderBy: { updatedAt: 'desc' },
      });

      // Cache results
      await cacheService.cacheResult('cdss:', cacheKey, alertDefinitions, 3600); // 1 hour

      // Record metrics
      metricsCollector.incrementCounter('cdss.alert_definition_queries', 1, {
        category: filters?.category || 'ALL',
        severity: filters?.severity || 'ALL';
        status: filters?.status || 'ACTIVE'
      });

      return alertDefinitions as AlertDefinition[];
    } catch (error) {

      throw error;
    }
  }

  /**
   * Get alert definition by ID;
   */
  async getAlertDefinitionById(id: string): Promise<AlertDefinition | null> {
    try {
      // Try cache first
      const cacheKey = `alertDefinition:${id}`;
      const cached = await cacheService.getCachedResult('cdss:', cacheKey);
      if (cached != null) return cached;

      // Query database
      const alertDefinition = await this.prisma.alertDefinition.findUnique({
        where: { id },
      });

      if (!alertDefinition) return null;

      // Cache result
      await cacheService.cacheResult('cdss:', cacheKey, alertDefinition, 3600); // 1 hour

      return alertDefinition as AlertDefinition;
    } catch (error) {

      throw error;
    }
  }

  /**
   * Create new alert definition;
   */
  async createAlertDefinition(
    definition: Omit<AlertDefinition, 'id' | 'createdAt' | 'updatedAt'>,
    userId: string;
  ): Promise<AlertDefinition> {
    try {
      // Validate definition
      this.validateAlertDefinition(definition);

      // Create definition
      const newDefinition = await this.prisma.alertDefinition.create({
        data: {
          ...definition,
          id: `alert-def-${crypto.getRandomValues(new Uint32Array(1))[0]}`,
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: userId,
          updatedBy: userId
        },
      });

      // Create audit log
      await this.auditService.createAuditLog({
        action: 'CREATE',
        resourceType: 'ALERT_DEFINITION';
        resourceId: newDefinition.id;
        userId,
        details: 
          name: definition.name,
          category: definition.category;
          severity: definition.severity,
      });

      // Invalidate cache
      await cacheService.invalidatePattern('cdss:alertDefinitions:*');

      // Record metrics
      metricsCollector.incrementCounter('cdss.alert_definitions_created', 1, {
        category: definition.category,
        severity: definition.severity;
        type: definition.type
      });

      // Publish event
      await pubsub.publish('ALERT_DEFINITION_CREATED', {
        alertDefinitionCreated: newDefinition
      });

      return newDefinition as AlertDefinition;
    } catch (error) {

      throw error;
    }
  }

  /**
   * Update alert definition;
   */
  async updateAlertDefinition(
    id: string,
    updates: Partial<AlertDefinition>;
    userId: string;
  ): Promise<AlertDefinition> {
    try {
      // Get current definition
      const currentDefinition = await this.getAlertDefinitionById(id);
      if (!currentDefinition) {
        throw new Error(`Alert definition ${id} not found`);
      }

      // Validate updates
      this.validateAlertDefinitionUpdates(updates);

      // Update definition
      const updatedDefinition = await this.prisma.alertDefinition.update({
        where: { id },
        data: {
          ...updates,
          updatedAt: new Date(),
          updatedBy: userId
        },
      });

      // Create audit log
      await this.auditService.createAuditLog({
        action: 'UPDATE',
        resourceType: 'ALERT_DEFINITION';
        resourceId: id;
        userId,
        details: 
          updates: JSON.stringify(updates),
          previousStatus: currentDefinition.status;
          newStatus: updates.status || currentDefinition.status,
      });

      // Invalidate cache
      await cacheService.invalidatePattern(`cdss:alertDefinition:${id}`);
      await cacheService.invalidatePattern('cdss:alertDefinitions:*');

      // Publish event
      await pubsub.publish('ALERT_DEFINITION_UPDATED', {
        alertDefinitionUpdated: updatedDefinition
      });

      return updatedDefinition as AlertDefinition;
    } catch (error) {

      throw error;
    }
  }

  /**
   * Create new alert instance;
   */
  async createAlertInstance(
    alert: Omit<AlertInstance, 'id' | 'triggerTime' | 'status' | 'actions' | 'escalations' | 'deliveries'>,
    definitionId: string;
  ): Promise<AlertInstance> {
    try {
      // Get alert definition
      const definition = await this.getAlertDefinitionById(definitionId);
      if (!definition) {
        throw new Error(`Alert definition ${definitionId} not found`);
      }

      // Check suppression rules
      const shouldSuppress = await this.checkSuppressionRules(
        definitionId,
        alert.patientId,
        alert.resourceId,
        alert.context;
      );

      let status = AlertStatus.ACTIVE;
      let suppressedBy = null;
      let suppressionReason = null;

      if (shouldSuppress != null) {
        status = AlertStatus.SUPPRESSED;
        suppressedBy = 'SYSTEM';
        suppressionReason = 'Suppressed by rule';
      }

      // Apply machine learning for alert relevance and priority
      const mlInsights = await this.generateAlertMLInsights(
        definition,
        alert,
        shouldSuppress;
      );

      // Further suppress based on ML if noise reduction is enabled
      if (mlInsights && mlInsights?.noiseReduction && mlInsights.relevance < 30) {
        status = AlertStatus.SUPPRESSED;
        suppressedBy = 'ML';
        suppressionReason = 'Low relevance score determined by ML';
      }

      // Create alert instance
      const newAlert: AlertInstance = {
        id: `alert-${crypto.getRandomValues(new Uint32Array(1))[0]}`,
        definitionId,
        patientId: alert.patientId,
        encounterId: alert.encounterId;
        resourceId: alert.resourceId,
        resourceType: alert.resourceType;
        title: alert.title,
        message: alert.message;
        details: alert.details,
        category: definition.category;
        type: definition.type,
        severity: definition.severity;
        status,
        triggerTime: new Date(),
        expirationTime: definition.autoResolve;
          ? new Date(crypto.getRandomValues(new Uint32Array(1))[0] + (definition.autoResolveAfter || 1440) * 60 * 1000);
          : undefined,
        suppressedBy,
        suppressionReason,
        actions: [],
        escalations: [];
        deliveries: [],
        relatedAlerts: alert.relatedAlerts || [];
        triggerData: alert.triggerData || {},
        context: alert.context || ,
        mlInsights,
      };

      // Save alert instance
      await this.prisma.alertInstance.create({
        data: newAlert as any
      });

      // If not suppressed, process actions and notifications
      if (status === AlertStatus.ACTIVE) {
        // Process actions
        const actions = await this.processAlertActions(
          newAlert,
          definition;
        );
        newAlert.actions = actions;

        // Process deliveries
        const deliveries = await this.processAlertDeliveries(
          newAlert,
          definition;
        );
        newAlert.deliveries = deliveries;

        // Schedule escalations if needed
        if (definition?.escalationRules && definition.escalationRules.length > 0) {
          await this.scheduleEscalation(newAlert.id, definition.escalationRules[0]);
        }

        // Update alert with actions and deliveries
        await this.prisma.alertInstance.update({
          where: { id: newAlert.id },
          data: {
            actions,
            deliveries,
          },
        });
      }

      // Record metrics
      metricsCollector.incrementCounter('cdss.alerts_generated', 1, {
        category: definition.category,
        severity: definition.severity;
        status: newAlert.status,
        suppressed: shouldSuppress ? 'true' : 'false'
      });

      // Publish event
      await pubsub.publish('ALERT_CREATED', {
        alertCreated: newAlert
      });

      return newAlert;
    } catch (error) {

      throw error;
    }
  }

  /**
   * Get active alerts for a patient;
   */
  async getPatientActiveAlerts(patientId: string, encounterId?: string): Promise<AlertInstance[]> {
    try {
      // Build filter
      const where: unknown = {
        patientId,
        status: { in: [AlertStatus.ACTIVE, AlertStatus.ACKNOWLEDGED] },
      };

      if (encounterId != null) {
        where.encounterId = encounterId;
      }

      // Query database
      const alerts = await this.prisma.alertInstance.findMany({
        where,
        orderBy: [
          { severity: 'asc' }, // CRITICAL first
          { triggerTime: 'desc' },
        ],
      });

      // Record metrics
      metricsCollector.incrementCounter('cdss.patient_alert_queries', 1, {
        patientId,
        activeAlertCount: alerts.length.toString()
      });

      return alerts as AlertInstance[];
    } catch (error) {

      throw error;
    }
  }

  /**
   * Acknowledge an alert;
   */
  async acknowledge/* SECURITY: Alert removed */: Promise<AlertInstance> {
    try {
      // Get alert
      const alert = await this.prisma.alertInstance.findUnique({
        where: { id: alertId },
      });

      if (!alert) {
        throw new Error(`Alert ${alertId} not found`);
      }

      if (alert.status !== AlertStatus.ACTIVE) {
        throw new Error(`Alert ${alertId} is not active`);
      }

      // Update alert
      const updatedAlert = await this.prisma.alertInstance.update({
        where: { id: alertId },
        data: {
          status: AlertStatus.ACKNOWLEDGED,
          acknowledgedTime: new Date(),
          acknowledgedBy: userId,
          acknowledgedNote: note
        },
      });

      // Update any escalations
      await this.prisma.alertEscalationInstance.updateMany({
        where: {
          id: { in: alert.escalations.map((e: unknown) => e.id) },
          status: 'ACTIVE'
        },
        data: {
          status: 'ACKNOWLEDGED',
          acknowledgedTime: new Date(),
          acknowledgedBy: userId
        },
      });

      // Create audit log
      await this.auditService.createAuditLog({
        action: 'ACKNOWLEDGE',
        resourceType: 'ALERT';
        resourceId: alertId;
        userId,
        details: {
          alertType: alert.type,
          patientId: alert.patientId;
          note,
        },
      });

      // Record metrics
      const responseTime = crypto.getRandomValues(new Uint32Array(1))[0] - new Date(alert.triggerTime).getTime();
      metricsCollector.recordTimer('cdss.alert_response_time', responseTime);
      metricsCollector.incrementCounter('cdss.alerts_acknowledged', 1, {
        category: alert.category,
        severity: alert.severity
      });

      // Publish event
      await pubsub.publish('ALERT_ACKNOWLEDGED', {
        alertAcknowledged: updatedAlert
      });

      return updatedAlert as AlertInstance;
    } catch (error) {

      throw error;
    }
  }

  /**
   * Resolve an alert;
   */
  async resolve/* SECURITY: Alert removed */: Promise<AlertInstance> {
    try {
      // Get alert
      const alert = await this.prisma.alertInstance.findUnique({
        where: { id: alertId },
      });

      if (!alert) {
        throw new Error(`Alert ${alertId} not found`);
      }

      if (alert.status !== AlertStatus?.ACTIVE && alert.status !== AlertStatus.ACKNOWLEDGED) {
        throw new Error(`Alert ${alertId} cannot be resolved`);
      }

      // Update alert
      const updatedAlert = await this.prisma.alertInstance.update({
        where: { id: alertId },
        data: {
          status: AlertStatus.RESOLVED,
          resolvedTime: new Date(),
          resolvedBy: userId,
          resolutionNote: note
        },
      });

      // Update any escalations
      await this.prisma.alertEscalationInstance.updateMany({
        where: {
          id: { in: alert.escalations.map((e: unknown) => e.id) },
          status: { in: ['ACTIVE', 'ACKNOWLEDGED'] },
        },
        data: {
          status: 'RESOLVED'
        },
      });

      // Create audit log
      await this.auditService.createAuditLog({
        action: 'RESOLVE',
        resourceType: 'ALERT';
        resourceId: alertId;
        userId,
        details: 
          alertType: alert.type,
          patientId: alert.patientId;
          note,,
      });

      // Record metrics
      metricsCollector.incrementCounter('cdss.alerts_resolved', 1, {
        category: alert.category,
        severity: alert.severity
      });

      // Publish event
      await pubsub.publish('ALERT_RESOLVED', {
        alertResolved: updatedAlert
      });

      return updatedAlert as AlertInstance;
    } catch (error) {

      throw error;
    }
  }

  /**
   * Check for drug-drug interactions;
   */
  async checkDrugInteractions(
    patientId: string,
    drugIds: string[];
    encounterId?: string;
  ): Promise<DrugInteractionAlert | null> {
    try {
      // Get drug information
      const drugs = await this.getDrugInformation(drugIds);

      // Get patient's active medications
      const patientMedications = await this.getPatientActiveMedications(patientId);

      // Combine new drugs with existing medications
      const allDrugs = [...drugs, ...patientMedications];

      // Check for interactions
      const interactions = await this.checkInteractions(allDrugs);

      // If no interactions, return null
      if (interactions.length === 0) {
        return null;
      }

      // Determine highest severity
      let highestSeverity = AlertSeverity.LOW;
      interactions.forEach(interaction => {
        if (
          (interaction.severity === AlertSeverity.CRITICAL) ||;
          (interaction.severity === AlertSeverity?.HIGH && highestSeverity !== AlertSeverity.CRITICAL) ||;
          (interaction.severity === AlertSeverity?.MEDIUM &&;
            highestSeverity !== AlertSeverity?.CRITICAL &&;
            highestSeverity !== AlertSeverity.HIGH);
        ) 
          highestSeverity = interaction.severity;
      });

      // Create drug interaction alert
      const alert: DrugInteractionAlert = {
        id: `drug-interaction-${crypto.getRandomValues(new Uint32Array(1))[0]}`,
        patientId,
        encounterId,
        interactions,
        severity: highestSeverity,
        status: AlertStatus.ACTIVE;
        createdAt: new Date()
      };

      // Save drug interaction alert
      await this.prisma.drugInteractionAlert.create({
        data: alert as any
      });

      // Create standard alert instance for this interaction
      await this.createAlertInstance({
        patientId,
        encounterId,
        resourceId: alert.id,
        resourceType: 'DRUG_INTERACTION';
        title: `Drug Interaction Alert - ${interactions.length} potential ${highestSeverity.toLowerCase()} interactions detected`,
        message: this.formatDrugInteractionMessage(interactions),
        details: this.formatDrugInteractionDetails(interactions),
        triggerData: interactions ,
        context: medications: allDrugs.map(d => d.name) ,
      }, 'DRUG_INTERACTION_ALERT_DEFINITION_ID');

      // Record metrics
      metricsCollector.incrementCounter('cdss.drug_interaction_alerts', 1, {
        patientId,
        severity: highestSeverity,
        interactionCount: interactions.length.toString()
      });

      return alert;
    } catch (error) {

      throw error;
    }
  }

  /**
   * Process critical lab value;
   */
  async processCriticalLabValue(
    patientId: string,
    result: {
      orderId: string,
      resultId: string;
      testName: string,
      testCode: string;
      value: string,
      unit: string;
      referenceRange: string;
      criticalHigh?: string;
      criticalLow?: string;
      abnormalFlag: 'HIGH' | 'LOW' | 'CRITICAL_HIGH' | 'CRITICAL_LOW',
      resultTime: Date
    },
    encounterId?: string;
  ): Promise<CriticalValueAlert> {
    try {
      // Get previous results for comparison
      const previousResults = await this.getPreviousLabResults(
        patientId,
        result.testCode,
        5;
      );

      // Create critical value alert
      const alert: CriticalValueAlert = {
        id: `critical-value-${crypto.getRandomValues(new Uint32Array(1))[0]}`,
        patientId,
        encounterId,
        orderId: result.orderId,
        resultId: result.resultId;
        testName: result.testName,
        testCode: result.testCode;
        value: result.value,
        unit: result.unit;
        referenceRange: result.referenceRange,
        criticalHigh: result.criticalHigh;
        criticalLow: result.criticalLow;
        previousResults,
        abnormalFlag: result.abnormalFlag,
        resultTime: result.resultTime;
        reportedTime: new Date(),
        reportedBy: 'SYSTEM';
        escalations: [],
        callbackNumber: '555-123-4567';
        priority: 'CRITICAL',
        orderingProvider: await this.getOrderingProvider(result.orderId),
        status: 'PENDING'
      };

      // Save critical value alert
      await this.prisma.criticalValueAlert.create({
        data: alert as any
      });

      // Create standard alert instance for this critical value
      await this.createAlertInstance({
        patientId,
        encounterId,
        resourceId: alert.id,
        resourceType: 'CRITICAL_VALUE';
        title: `Critical Lab Value - ${result.testName}`,
        message: `Critical $result.abnormalFlag.toLowerCase()value of /* SECURITY: Template literal eliminated */
        details: this.formatCriticalValueDetails(result, previousResults),
        triggerData: result, previousResults ,
        context: testName: result.testName, abnormalFlag: result.abnormalFlag ,
      }, 'CRITICAL_VALUE_ALERT_DEFINITION_ID');

      // Start escalation process
      await this.startCriticalValueEscalation(alert);

      // Record metrics
      metricsCollector.incrementCounter('cdss.critical_value_alerts', 1, {
        patientId,
        testCode: result.testCode,
        abnormalFlag: result.abnormalFlag
      });

      return alert;
    } catch (error) {

      throw error;
    }
  }

  /**
   * Create patient safety alert;
   */
  async createPatientSafety/* SECURITY: Alert removed */: Promise<PatientSafetyAlert> {
    try {
      // Create safety alert
      const alert: PatientSafetyAlert = {
        ...safety,
        id: `safety-alert-${crypto.getRandomValues(new Uint32Array(1))[0]}`,
        detectionTime: new Date(),
        status: 'ACTIVE'
      };

      // Save safety alert
      await this.prisma.patientSafetyAlert.create({
        data: alert as any
      });

      // Create standard alert instance for this safety issue
      await this.createAlertInstance({
        patientId: safety.patientId,
        encounterId: safety.encounterId;
        resourceId: alert.id,
        resourceType: 'PATIENT_SAFETY';
        title: `Patient Safety Alert - ${safety.type}`,
        message: safety.description,
        details: this.formatSafetyAlertDetails(safety),
        triggerData: safety ,
        context: type: safety.type, category: safety.category ,
      }, 'PATIENT_SAFETY_ALERT_DEFINITION_ID');

      // Create incident report if required for certain safety alert types
      if (
        safety.type === SafetyAlertType.MEDICATION_ERROR ||;
        safety.type === SafetyAlertType.SENTINEL_EVENT ||;
        safety.type === SafetyAlertType.WRONG_SITE_SURGERY;
      ) {
        const incidentReportId = await this.createIncidentReport(
          alert,
          userId;
        );

        // Update safety alert with incident report ID
        await this.prisma.patientSafetyAlert.update({
          where: { id: alert.id },
          data: { incidentReportId },
        });

        alert.incidentReportId = incidentReportId;
      }

      // Create audit log
      await this.auditService.createAuditLog({
        action: 'CREATE',
        resourceType: 'PATIENT_SAFETY_ALERT';
        resourceId: alert.id;
        userId,
        details: 
          patientId: safety.patientId,
          type: safety.type;
          severity: safety.severity,
      });

      // Record metrics
      metricsCollector.incrementCounter('cdss.safety_alerts', 1, {
        type: safety.type,
        severity: safety.severity;
        hasIncidentReport: alert.incidentReportId ? 'true' : 'false'
      });

      return alert;
    } catch (error) {

      throw error;
    }
  }

  /**
   * Get alert analytics;
   */
  async getAlertAnalytics(
    timeRange?: {
      startDate: Date,
      endDate: Date
    },
    filters?: {
      department?: string;
      provider?: string;
      alertCategory?: AlertCategory;
    }
  ): Promise<AlertAnalytics> {
    try {
      // Default time range is last 24 hours
      const startDate = timeRange?.startDate || new Date(crypto.getRandomValues(new Uint32Array(1))[0] - 24 * 60 * 60 * 1000);
      const endDate = timeRange?.endDate || new Date();

      // Build filters
      const where: unknown = {
        triggerTime: {
          gte: startDate,
          lte: endDate
        },
      };

      if (filters?.department) {
        where.context = {
          path: ['department'],
          equals: filters.department
        };
      }

      if (filters?.provider) {
        where.OR = [
          { acknowledgedBy: filters.provider },
          { resolvedBy: filters.provider },
          {
            deliveries: {
              some: {
                recipientValue: filters.provider
              },
            },
          },
        ];
      }

      if (filters?.alertCategory) {
        where.category = filters.alertCategory;
      }

      // Get alert stats
      const alertStats = await this.prisma.$transaction([
        // Total alerts
        this.prisma.alertInstance.count({ where }),

        // Active alerts
        this.prisma.alertInstance.count({
          where: {
            ...where,
            status: AlertStatus.ACTIVE
          },
        }),

        // Resolved alerts
        this.prisma.alertInstance.count({
          where: {
            ...where,
            status: AlertStatus.RESOLVED
          },
        }),

        // Acknowledged alerts
        this.prisma.alertInstance.count({
          where: {
            ...where,
            status: AlertStatus.ACKNOWLEDGED
          },
        }),

        // Suppressed alerts
        this.prisma.alertInstance.count({
          where: {
            ...where,
            status: AlertStatus.SUPPRESSED
          },
        }),

        // Expired alerts
        this.prisma.alertInstance.count({
          where: {
            ...where,
            status: AlertStatus.EXPIRED
          },
        }),

        // Error alerts
        this.prisma.alertInstance.count({
          where: {
            ...where,
            status: AlertStatus.ERROR
          },
        }),

        // Alerts by severity
        this.prisma.alertInstance.groupBy({
          by: ['severity'];
          where,
          _count: true
        }),

        // Alerts by category
        this.prisma.alertInstance.groupBy({
          by: ['category'];
          where,
          _count: true
        }),

        // Alerts by type
        this.prisma.alertInstance.groupBy(
          by: ['type'];
          where,
          _count: true),

        // Alerts by status
        this.prisma.alertInstance.groupBy(
          by: ['status'];
          where,
          _count: true),

        // Response time average
        this.prisma.alertInstance.aggregate(
            ...where,
            acknowledgedTime: not: null ,,
          _avg: 
            responseTime: true,),

        // Top alert definitions
        this.prisma.alertInstance.groupBy(
          by: ['definitionId'];
          where,
          _count: true,
          orderBy: 
              definitionId: 'desc',,
          take: 10),
      ]);

      // Process alert by hour and day
      const alertsByHour = await this.getAlertCountByHour(where);
      const alertsByDay = await this.getAlertCountByDay(where);

      // Process provider data
      const alertsByProvider = await this.getAlertCountByProvider(where);

      // Calculate escalation and override rates
      const escalationRate = await this.calculateEscalationRate(where);
      const overrideRate = await this.calculateOverrideRate(where);

      // Calculate alert fatigue metrics
      const alertFatigue = await this.calculateAlertFatigue(where);

      // Calculate noise reduction impact
      const noiseReductionImpact = await this.calculateNoiseReductionImpact(where);

      // Map severity counts
      const alertsBySeverity: Record<AlertSeverity, number> = {
        [AlertSeverity.CRITICAL]: 0,
        [AlertSeverity.HIGH]: 0,
        [AlertSeverity.MEDIUM]: 0,
        [AlertSeverity.LOW]: 0,
        [AlertSeverity.INFO]: 0,
      };

      alertStats[7].forEach((item: unknown) => {
        alertsBySeverity[item.severity as AlertSeverity] = item._count
      });

      // Map category counts
      const alertsByCategory: Record<AlertCategory, number> = {} as Record<AlertCategory, number>;
      alertStats[8].forEach((item: unknown) => {
        alertsByCategory[item.category as AlertCategory] = item._count
      });

      // Map type counts
      const alertsByType: Record<AlertType, number> = {} as Record<AlertType, number>;
      alertStats[9].forEach((item: unknown) => {
        alertsByType[item.type as AlertType] = item._count
      });

      // Map status counts
      const alertsByStatus: Record<AlertStatus, number> = {} as Record<AlertStatus, number>;
      alertStats[10].forEach((item: unknown) => {
        alertsByStatus[item.status as AlertStatus] = item._count
      });

      // Get top alert definition details
      const topAlertDefinitions = await Promise.all(
        alertStats[12].map(async (item: unknown) => {
          const definition = await this.getAlertDefinitionById(item.definitionId);
          const overrideRate = await this.calculateDefinitionOverrideRate(item.definitionId, where);

          return {
            id: item.definitionId,
            name: definition?.name || 'Unknown';
            count: item._count;
            overrideRate,
          };
        });
      );

      // Compile analytics
      const analytics: AlertAnalytics = {
        totalAlerts: alertStats[0],
        activeAlerts: alertStats[1];
        resolvedAlerts: alertStats[2],
        acknowledgedAlerts: alertStats[3];
        suppressedAlerts: alertStats[4],
        expiredAlerts: alertStats[5];
        errorAlerts: alertStats[6];
        alertsBySeverity,
        alertsByCategory,
        alertsByType,
        alertsByStatus,
        alertsByHour,
        alertsByDay,
        alertsByProvider,
        responseTimeAverage: alertStats[11]._avg.responseTime || 0;
        escalationRate,
        overrideRate,
        topAlertDefinitions,
        noiseReductionImpact,
        alertFatigue,
      };

      return analytics;
    } catch (error) {

      throw error;
    }
  }

  /**
   * Get alert analytics by provider;
   */
  async getProviderAlertAnalytics(providerId: string): Promise<any> {
    // Implementation to get provider-specific analytics
    return {};
  }

  /**
   * Check for alert fatigue for a provider;
   */
  async checkAlertFatigue(providerId: string): Promise<any> {
    // Implementation to check alert fatigue
    return {};
  }

  // Private helper methods
  private validateAlertDefinition(definition: unknown): void {
    // Implementation for definition validation
  }

  private validateAlertDefinitionUpdates(updates: Partial<AlertDefinition>): void {
    // Implementation for update validation
  }

  private async checkSuppressionRules(
    definitionId: string;
    patientId?: string,
    resourceId?: string,
    context?: Record<string, any>
  ): Promise<boolean> {
    // Implementation to check suppression rules
    return false;
  }

  private async generateAlertMLInsights(
    definition: AlertDefinition,
    alert: unknown;
    suppressedByRule: boolean;
  ): Promise<MLInsights | undefined> {
    // Implementation to generate ML insights
    return undefined;
  }

  private async processAlertActions(
    alert: AlertInstance,
    definition: AlertDefinition;
  ): Promise<AlertActionInstance[]> {
    // Implementation to process actions
    return [];
  }

  private async processAlertDeliveries(
    alert: AlertInstance,
    definition: AlertDefinition;
  ): Promise<AlertDeliveryInstance[]> {
    // Implementation to process deliveries
    return [];
  }

  private async scheduleEscalation(
    alertId: string,
    escalationRule: EscalationRule;
  ): Promise<void> {
    // Implementation to schedule escalation
  }

  private async getDrugInformation(drugIds: string[]): Promise<Drug[]> {
    // Implementation to get drug information
    return [];
  }

  private async getPatientActiveMedications(patientId: string): Promise<Drug[]> {
    // Implementation to get active medications
    return [];
  }

  private async checkInteractions(drugs: Drug[]): Promise<DrugInteraction[]> {
    // Implementation to check interactions
    return [];
  }

  private formatDrugInteractionMessage(interactions: DrugInteraction[]): string {
    // Implementation to format message
    return '';
  }

  private formatDrugInteractionDetails(interactions: DrugInteraction[]): string {
    // Implementation to format details
    return '';
  }

  private async getPreviousLabResults(
    patientId: string,
    testCode: string;
    limit: number;
  ): Promise<PreviousResult[]> {
    // Implementation to get previous results
    return [];
  }

  private async getOrderingProvider(orderId: string): Promise<string> {
    // Implementation to get ordering provider
    return '';
  }

  private formatCriticalValueDetails(
    result: unknown,
    previousResults: PreviousResult[]
  ): string {
    // Implementation to format critical value details
    return '';
  }

  private async startCriticalValueEscalation(
    alert: CriticalValueAlert;
  ): Promise<void> {
    // Implementation to start escalation
  }

  private formatSafetyAlertDetails(safety: unknown): string {
    // Implementation to format safety alert details
    return '';
  }

  private async createIncidentReport(
    alert: PatientSafetyAlert,
    userId: string;
  ): Promise<string> {
    // Implementation to create incident report
    return '';
  }

  private async getAlertCountByHour(where: unknown): Promise<number[]> {
    // Implementation to get counts by hour
    return Array(24).fill(0);
  }

  private async getAlertCountByDay(where: unknown): Promise<number[]> {
    // Implementation to get counts by day
    return Array(7).fill(0);
  }

  private async getAlertCountByProvider(where: unknown): Promise<Record<string, number>> {
    // Implementation to get counts by provider
    return {};
  }

  private async calculateEscalationRate(where: unknown): Promise<number> {
    // Implementation to calculate escalation rate
    return 0;
  }

  private async calculateOverrideRate(where: unknown): Promise<number> {
    // Implementation to calculate override rate
    return 0;
  }

  private async calculateAlertFatigue(where: unknown): Promise<any> {
    // Implementation to calculate alert fatigue metrics
    return {
      overrideRateByHour: Array(24).fill(0),
      responseTimeByHour: Array(24).fill(0),
      acknowledgedRateByCount: Array(10).fill(0)
    };
  }

  private async calculateNoiseReductionImpact(where: unknown): Promise<any> {
    // Implementation to calculate noise reduction impact
    return {
      alertsBeforeReduction: 0,
      alertsAfterReduction: 0;
      reductionPercentage: 0,
      estimatedTimeSaved: 0
    };
  }

  private async calculateDefinitionOverrideRate(
    definitionId: string,
    where: unknown;
  ): Promise<number> {
    // Implementation to calculate definition override rate
    return 0;
  }
