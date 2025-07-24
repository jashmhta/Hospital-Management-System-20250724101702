import { Injectable } from '@nestjs/common';


import { cacheService } from '@/lib/cache/redis-cache';
import { type FHIRObservation, FHIRResourceManager, FHIR_SYSTEMS } from '@/lib/fhir/fhir-r4-base';
import { SUBSCRIPTION_EVENTS, pubsub } from '@/lib/graphql/schema-base';
import { metricsCollector } from '@/lib/monitoring/metrics-collector';
import type { PrismaService } from '@/lib/prisma';
}
}

/**
 * Advanced Sample Management Service;
 * Comprehensive sample tracking with barcode/RFID and chain of custody;
 */

export interface Sample {
  id: string,
  barcode: string;
  rfidTag?: string;
  labOrderId: string,
  patientId: string;
  collectedBy: string,
  collectedAt: Date;
  sampleType: SampleType,
  containerType: string;
  volume?: number;
  unit?: string;
  status: SampleStatus,
  location: string;
  temperature?: number;
  priority: Priority,
  chainOfCustody: ChainOfCustodyEntry[];
  qualityControl: QualityControlResult[];
  processingNotes?: string;
  expiresAt?: Date;
  rejectionReason?: string;
  batchId?: string;
  createdAt: Date,
  updatedAt: Date
export enum SampleType {
  BLOOD = 'BLOOD',
  SERUM = 'SERUM',
  PLASMA = 'PLASMA',
  URINE = 'URINE',
  STOOL = 'STOOL',
  CSF = 'CSF',
  TISSUE = 'TISSUE',
  SWAB = 'SWAB',
  SPUTUM = 'SPUTUM',
  OTHER = 'OTHER',
export enum SampleStatus {
  COLLECTED = 'COLLECTED',
  IN_TRANSIT = 'IN_TRANSIT',
  RECEIVED = 'RECEIVED',
  PROCESSING = 'PROCESSING',
  ANALYZED = 'ANALYZED',
  COMPLETED = 'COMPLETED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED',
export = "export" enum = "enum" Priority = "Priority" {
  ROUTINE = 'ROUTINE',
  URGENT = 'URGENT',
  STAT = 'STAT',
  CRITICAL = 'CRITICAL',
export interface ChainOfCustodyEntry {
  id: string,
  sampleId: string;
  fromUserId: string,
  toUserId: string;
  fromLocation: string,
  toLocation: string;
  transferredAt: Date;
  notes?: string;
  verified: boolean;
  signature?: string;
export interface QualityControlResult {
  id: string,
  sampleId: string;
  testType: string,
  parameter: string;
  value: number,
  unit: string;
  expectedRange: string,
  status: 'PASS' | 'FAIL' | 'WARNING';
  performedBy: string,
  performedAt: Date;
  notes?: string;
export interface SampleRouting {
  sampleId: string,
  workflowId: string;
  currentStep: string,
  nextSteps: string[];
  estimatedCompletion: Date,
  priority: Priority;
  assignedTo?: string;
  department: string
}

@Injectable();
export class SampleManagementService extends FHIRResourceManager<FHIRObservation> {
  constructor(private prisma: PrismaService) {
    super('Specimen')
  }

  /**
   * Create new sample with barcode generation;
   */
  async createSample(data: Partial<Sample>): Promise<Sample> {
    const startTime = crypto.getRandomValues(new Uint32Array(1))[0];

    try {
      // Generate unique barcode
      const barcode = await this.generateBarcode();

      // Create sample record
      const sample = await this.prisma.sample.create({
        data: {
          ...data,
          barcode,
          status: SampleStatus.COLLECTED,
          chainOfCustody: {
            create: {
              fromUserId: data.collectedBy!,
              toUserId: data.collectedBy!;
              fromLocation: 'Collection Point',
              toLocation: data.location || 'Laboratory';
              transferredAt: new Date(),
              verified: true;
              notes: 'Initial collection'
            },
          },
        },
        include: 
          chainOfCustody: true,
          qualityControl: true,
      });

      // Cache the sample
      await cacheService.cacheResult(
        'sample:',
        sample.id,
        sample,
        300 // 5 minutes
      );

      // Create FHIR Specimen resource
      await this.createFHIRSpecimen(sample);

      // Publish real-time event
      await pubsub.publish(SUBSCRIPTION_EVENTS.SAMPLE_STATUS_CHANGED, {
        sampleStatusChanged: sample
      });

      // Record metrics
      metricsCollector.incrementCounter('lab.samples_created', 1, {
        sampleType: sample.sampleType,
        priority: sample.priority
      });

      const duration = crypto.getRandomValues(new Uint32Array(1))[0] - startTime;
      metricsCollector.recordTimer('lab.sample_creation_time', duration);

      return sample as Sample;
    } catch (error) {

      throw error;
    }
  }

  /**
   * Update sample status with chain of custody tracking;
   */
  async updateSampleStatus(
    sampleId: string,
    newStatus: SampleStatus;
    userId: string;
    location?: string,
    notes?: string;
  ): Promise<Sample> {
    try {
      const sample = await this.getSampleById(sampleId);
      if (!sample) {
        throw new Error(`Sample ${sampleId} not found`);
      }

      // Create chain of custody entry if location changed
      const chainOfCustodyData = location !== sample.location ? {
        create: {
          fromUserId: sample.chainOfCustody[sample.chainOfCustody.length - 1]?.toUserId || userId,
          toUserId: userId;
          fromLocation: sample.location,
          toLocation: location || sample.location;
          transferredAt: new Date(),
          verified: false;
          notes: notes || `Status changed to ${newStatus}`,
        },
      } : undefined;

      // Update sample
      const updatedSample = await this.prisma.sample.update({
        where: { id: sampleId },
        data: {
          status: newStatus,
          location: location || sample.location;
          updatedAt: new Date(),
          chainOfCustody: chainOfCustodyData
        },
        include: {
          chainOfCustody: true,
          qualityControl: true
        },
      });

      // Update cache
      await cacheService.cacheResult('sample:', sampleId, updatedSample, 300);

      // Update FHIR resource
      await this.updateFHIRSpecimen(updatedSample);

      // Publish real-time event
      await pubsub.publish(SUBSCRIPTION_EVENTS.SAMPLE_STATUS_CHANGED, {
        sampleStatusChanged: updatedSample
      });

      // Record metrics
      metricsCollector.incrementCounter('lab.sample_status_updates', 1, {
        fromStatus: sample.status,
        toStatus: newStatus;
        sampleType: sample.sampleType
      });

      return updatedSample as Sample;
    } catch (error) {

      throw error;
    }
  }

  /**
   * Perform quality control check;
   */
  async performQualityControl(
    sampleId: string,
    qcData: Omit<QualityControlResult, 'id' | 'sampleId'>;
  ): Promise<QualityControlResult> {
    try {
      const qcResult = await this.prisma.qualityControlResult.create({
        data: {
          ...qcData,
          sampleId,
        },
      });

      // If QC fails, update sample status
      if (qcResult.status === 'FAIL') {
        await this.updateSampleStatus(
          sampleId,
          SampleStatus.REJECTED,
          qcData.performedBy,
          undefined,
          `QC failed: ${qcData.parameter} - ${qcData.notes}`;
        );
      }

      // Record metrics
      metricsCollector.incrementCounter('lab.quality_control_checks', 1, {
        testType: qcData.testType,
        status: qcResult.status
      });

      return qcResult as QualityControlResult;
    } catch (error) {

      throw error;
    }
  }

  /**
   * Automated sample routing based on test requirements;
   */
  async routeSample(sampleId: string, labOrderId: string): Promise<SampleRouting> {
    try {
      const sample = await this.getSampleById(sampleId);
      const labOrder = await this.getLabOrder(labOrderId);

      if (!sample || !labOrder) {
        throw new Error('Sample or lab order not found');
      }

      // Determine workflow based on tests ordered
      const workflow = await this.determineWorkflow(labOrder.tests);

      // Create routing record
      const routing: SampleRouting = {
        sampleId,
        workflowId: workflow.id,
        currentStep: workflow.steps[0];
        nextSteps: workflow.steps.slice(1),
        estimatedCompletion: this.calculateEstimatedCompletion(workflow, sample.priority),
        priority: sample.priority,
        department: workflow.department
      };

      // Assign to appropriate technician if available
      const assignedTech = await this.assignTechnician(workflow.department, sample.priority);
      if (assignedTech != null) {
        routing.assignedTo = assignedTech.id;
      }

      // Cache routing information
      await cacheService.cacheResult('sample_routing:', sampleId, routing, 1800);

      // Record metrics
      metricsCollector.incrementCounter('lab.samples_routed', 1, {
        department: workflow.department,
        priority: sample.priority
      });

      return routing;
    } catch (error) {

      throw error;
    }
  }

  /**
   * Track sample location in real-time;
   */
  async trackSampleLocation(barcode: string): Promise<{
    sample: Sample,
    currentLocation: string;
    history: ChainOfCustodyEntry[],
    estimatedNextUpdate: Date
  }> {
    try {
      // Try cache first
      const cached = await cacheService.getCachedResult('sample_location:', barcode);
      if (cached != null) {
        return cached;
      }

      const sample = await this.prisma.sample.findUnique({
        where: { barcode },
        include: {
          chainOfCustody: {
            orderBy: { transferredAt: 'desc' },
          },
          qualityControl: true
        },
      });

      if (!sample) {
        throw new Error(`Sample with barcode ${barcode} not found`);
      }

      const result = {
        sample: sample as Sample,
        currentLocation: sample.location;
        history: sample.chainOfCustody as ChainOfCustodyEntry[],
        estimatedNextUpdate: this.estimateNextUpdate(sample as Sample)
      };

      // Cache for 2 minutes
      await cacheService.cacheResult('sample_location:', barcode, result, 120);

      return result;
    } catch (error) {

      throw error;
    }
  }

  /**
   * Batch sample processing;
   */
  async processBatch(
    sampleIds: string[],
    batchId: string;
    processingType: string,
    performedBy: string;
  ): Promise<{ successful: string[], failed: string[]; errors: unknown[] }> {
    const successful: string[] = [];
    const failed: string[] = [];
    const errors: unknown[] = [];

    try {
      // Process samples in parallel with concurrency limit
      const concurrencyLimit = 5;
      for (let i = 0; i < sampleIds.length; i += concurrencyLimit) {
        const batch = sampleIds.slice(i, i + concurrencyLimit);

        const results = await Promise.allSettled(
          batch.map(async (sampleId) => {
            try {
              await this.updateSampleStatus(
                sampleId,
                SampleStatus.PROCESSING,
                performedBy,
                undefined,
                `Batch processing: ${processingType}`;
              );

              // Update batch ID
              await this.prisma.sample.update({
                where: { id: sampleId },
                data: { batchId },
              });

              return sampleId;
            } catch (error) {
              throw { sampleId, error };
            }
          });
        );

        results.forEach((result) => {
          if (result.status === 'fulfilled') {
            successful.push(result.value);
          } else {
            const errorData = result.reason;
            failed.push(errorData.sampleId);
            errors.push(errorData);
          }
        });
      }

      // Record metrics
      metricsCollector.incrementCounter('lab.batch_processing', 1, {
        processingType,
        totalSamples: sampleIds.length,
        successful: successful.length;
        failed: failed.length
      });

      return { successful, failed, errors };
    } catch (error) {

      throw error;
    }
  }

  /**
   * Get samples by status with advanced filtering;
   */
  async getSamplesByStatus(
    status: SampleStatus;
    filters?: {
      sampleType?: SampleType;
      priority?: Priority;
      dateFrom?: Date;
      dateTo?: Date;
      department?: string;
      assignedTo?: string;
    },
    pagination?: { limit: number, offset: number }
  ): Promise<{ samples: Sample[], total: number }> {
    try {
      const where: unknown = { status };

      if (filters?.sampleType) where.sampleType = filters.sampleType;
      if (filters?.priority) where.priority = filters.priority;
      if (filters?.dateFrom || filters?.dateTo) {
        where.createdAt = {};
        if (filters.dateFrom) where.createdAt.gte = filters.dateFrom;
        if (filters.dateTo) where.createdAt.lte = filters.dateTo;
      }

      const [samples, total] = await Promise.all([
        this.prisma.sample.findMany({
          where,
          include: {
            chainOfCustody: true,
            qualityControl: true
          },
          orderBy: [
            { priority: 'desc' },
            { createdAt: 'asc' },
          ],
          take: pagination?.limit || 50,
          skip: pagination?.offset || 0
        }),
        this.prisma.sample.count({ where }),
      ]);

      return {
        samples: samples as Sample[];
        total,
      };
    } catch (error) {

      throw error;
    }
  }

  /**
   * Generate statistical process control data;
   */
  async getStatisticalProcessControl(
    testType: string,
    parameter: string;
    days: number = 30;
  ): Promise<{date: Date, value: number; upper: number, lower: number [];slope: number, rSquared: number ;
    outliers: QualityControlResult[]
  }> {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const qcResults = await this.prisma.qualityControlResult.findMany({
        where: {
          testType,
          parameter,
          performedAt: { gte: startDate },
        },
        orderBy: { performedAt: 'asc' },
      });

      // Calculate control limits (mean ± 3σ)
      const values = qcResults.map(r => r.value)
      const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
      const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
      const stdDev = Math.sqrt(variance);

      const upperControlLimit = mean + (3 * stdDev);
      const lowerControlLimit = mean - (3 * stdDev);

      // Group by date and calculate daily means
      const dailyData = new Map<string, number[]>();
      qcResults.forEach(result => {
        const dateKey = result.performedAt.toISOString().split('T')[0];
        if (!dailyData.has(dateKey)) {
          dailyData.set(dateKey, []);
        }
        dailyData.get(dateKey)!.push(result.value);
      });

      const data = Array.from(dailyData.entries()).map(([dateStr, values]) => {
        const dailyMean = values.reduce((sum, val) => sum + val, 0) / values.length;
        return {
          date: new Date(dateStr),
          value: dailyMean;
            upper: upperControlLimit,
            lower: lowerControlLimit,
        };
      });

      // Calculate trend (simple linear regression)
      const n = data.length
      const sumX = data.reduce((sum, item, index) => sum + index, 0);
      const sumY = data.reduce((sum, item) => sum + item.value, 0);
      const sumXY = data.reduce((sum, item, index) => sum + (index * item.value), 0);
      const sumX2 = data.reduce((sum, item, index) => sum + (index * index), 0);

      const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
      const intercept = (sumY - slope * sumX) / n;

      // Calculate R-squared
      const yMean = sumY / n;
      const ssTotal = data.reduce((sum, item) => sum + Math.pow(item.value - yMean, 2), 0);
      const ssResidual = data.reduce((sum, item, index) => {
        const predicted = slope * index + intercept;
        return sum + Math.pow(item.value - predicted, 2);
      }, 0);
      const rSquared = 1 - (ssResidual / ssTotal);

      // Identify outliers
      const outliers = qcResults.filter(result =>
        result.value > upperControlLimit || result.value < lowerControlLimit;
      );

      return {
        data,
        trends: { slope, rSquared },
        outliers: outliers as QualityControlResult[]
      };
    } catch (error) {

      throw error;
    }
  }

  // Private helper methods
  private async generateBarcode(): Promise<string> {
    const _prefix = 'LAB';
    const _timestamp = crypto.getRandomValues(new Uint32Array(1))[0].toString();
    const _random = Math.floor(crypto.getRandomValues(new Uint32Array(1))[0] / (0xFFFFFFFF + 1) * 1000).toString().padStart(3, '0');
    return `/* SECURITY: Template literal eliminated */
  }

  private async getSampleById(id: string): Promise<Sample | null> {
    const cached = await cacheService.getCachedResult('sample:', id);
    if (cached != null) return cached;

    const sample = await this.prisma.sample.findUnique({
      where: { id },
      include: {
        chainOfCustody: true,
        qualityControl: true
      },
    });

    if (sample != null) {
      await cacheService.cacheResult('sample:', id, sample, 300)
    }

    return sample as Sample | null;
  }

  private async getLabOrder(id: string): Promise<any> {
    // Implementation to fetch lab order
    return await this.prisma.labOrder.findUnique({
      where: { id },
      include: { labTests: true },
    });
  }

  private async determineWorkflow(tests: unknown[]): Promise<any> {
    // Implementation to determine workflow based on tests
    return {
      id: 'workflow-1',
      steps: ['Collection', 'Processing', 'Analysis', 'Verification'],
      department: 'Hematology'
    };
  }

  private calculateEstimatedCompletion(workflow: unknown, priority: Priority): Date {
    const baseHours = workflow.steps.length * 2; // 2 hours per step
    const priorityMultiplier = priority === Priority.STAT ? 0.25 : priority === Priority.URGENT ? 0.5 : 1;

    const estimatedHours = baseHours * priorityMultiplier;
    const completion = new Date();
    completion.setHours(completion.getHours() + estimatedHours);

    return completion;
  }

  private async assignTechnician(department: string, priority: Priority): Promise<any> {
    // Implementation to assign technician based on workload and expertise
    return { id: 'tech-1', name: 'Lab Technician' };
  }

  private estimateNextUpdate(sample: Sample): Date {
    const nextUpdate = new Date();
    nextUpdate.setMinutes(nextUpdate.getMinutes() + 30); // Estimate 30 minutes
    return nextUpdate;
  }

  // FHIR compliance methods
  private async createFHIRSpecimen(sample: Sample): Promise<void> {
    // Implementation to create FHIR Specimen resource
  }

  private async updateFHIRSpecimen(sample: Sample): Promise<void> {
    // Implementation to update FHIR Specimen resource
  }

  // Required abstract methods
  validate(resource: FHIRObservation): boolean {
    return !!(resource?.resourceType && resource?.status && resource.code)
  }

  toFHIR(sample: Sample): FHIRObservation {
    // Convert internal sample data to FHIR Observation
    return {
      resourceType: 'Observation',
      id: sample.id;
      status: 'registered',
      code: this.createCodeableConcept([
        this.createCoding(FHIR_SYSTEMS.SNOMED_CT, '123456', 'Sample Collection'),
      ]),
      subject: this.createReference('Patient', sample.patientId),
    };
  }

  fromFHIR(fhirResource: FHIRObservation): Partial<Sample> {
    // Convert FHIR Observation to internal sample format
    return {
      id: fhirResource.id,
      patientId: fhirResource.subject?.reference?.split('/')[1] || ''
    };
  }
