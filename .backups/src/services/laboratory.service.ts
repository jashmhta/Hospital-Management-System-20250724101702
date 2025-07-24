import "../lib/notifications"
import "./audit_log_service.ts"
import "./encryption_service.ts"
import "@prisma/client"
import "zod"
import * as z
import {  AuditService  } from "@/lib/database"
import {  EncryptionService  } from "@/lib/database"
import {  NotificationService  } from "@/lib/database"
import {  PrismaClient  } from "@/lib/database"

const prisma = new PrismaClient();

// Define schema for lab test;
const LabTestSchema = z.object({
  testCode: z.string().min(1, "Test code is required"),
  testName: z.string().min(1, "Test name is required"),
  shortName: z.string().optional(),
  description: z.string().optional(),
  testCategory: z.string().min(1, "Test category is required"),
  testType: z.string().min(1, "Test type is required"),
  sampleTypes: z.array(z.string()),
  containerTypes: z.array(z.string()),  defaultPriority: z.string().default("Routine"),
  defaultDepartment: z.string().optional(),
  methodUsed: z.string().optional(),
  equipmentUsed: z.string().optional(),
  loinc: z.string().optional(),
  cptCode: z.string().optional(),
  price: z.number().optional(),
  requiresConsent: z.boolean().default(false),
  processTime: z.number().optional(),
  turnaroundTime: z.number().optional(),
  specialInstructions: z.string().optional(),
  patientPreparation: z.string().optional(),
  samplePreservation: z.string().optional(),
  status: z.string().default("Active"),
  isVisible: z.boolean().default(true),
  referralTest: z.boolean().default(false),
  referralLabId: z.string().optional();
});

// Define schema for lab order;
const LabOrderSchema = z.object({
  patientId: z.string().min(1, "Patient ID is required"),
  encounterId: z.string().optional(),
  orderingProviderId: z.string().min(1, "Ordering provider ID is required"),
  orderingProviderName: z.string().min(1, "Ordering provider name is required"),
  orderDateTime: z.date().default(() => ,
  priority: z.string().default("Routine"),
  collectionType: z.string().default("Lab Draw"),
  clinicalInfo: z.string().optional(),
  diagnosis: z.string().optional(),
  diagnosisCode: z.string().optional(),
  isFasting: z.boolean().default(false),
  collectionDateTime: z.date().optional(),
  collectionSite: z.string().optional(),
  collectedBy: z.string().optional(),
  specimenReceivedDateTime: z.date().optional(),
  receivedBy: z.string().optional(),
  status: z.string().default("Ordered"),
  departmentId: z.string().optional(),
  locationId: z.string().optional(),
  notes: z.string().optional(),
  isRecurring: z.boolean().default(false),
  recurringPattern: z.string().optional(),
  z.string().optional(),
    profileId: z.string().optional(),
    status: z.string().default("Ordered"),
    priority: z.string().default("Routine"),
    scheduledDateTime: z.date().optional(),
    performingLabId: z.string().optional(),
    referralLabId: z.string().optional(),
    billable: z.boolean().default(true),
    notes: z.string().optional();
  })).min(1, "At least one test must be ordered")});

// Define schema for lab sample;
const LabSampleSchema = z.object({
  orderId: z.string().min(1, "Order ID is required"),
  patientId: z.string().min(1, "Patient ID is required"),
  sampleTypeId: z.string().min(1, "Sample type ID is required"),
  containerType: z.string().min(1, "Container type is required"),
  volume: z.string().optional(),
  collectionDateTime: z.date().optional(),
  collectedBy: z.string().optional(),
  collectionSite: z.string().optional(),
  collectionMethod: z.string().optional(),
  receivedDateTime: z.date().optional(),
  receivedBy: z.string().optional(),
  receivedCondition: z.string().optional(),
  status: z.string().default("Ordered"),
  storageLocation: z.string().optional(),
  parentSampleId: z.string().optional(),
  isAliquot: z.boolean().default(false),
  processingNotes: z.string().optional(),
  notes: z.string().optional();
});

// Define schema for lab result;
const LabResultSchema = z.object({
  orderId: z.string().min(1, "Order ID is required"),
  sampleId: z.string().optional(),
  parameterId: z.string().min(1, "Parameter ID is required"),
  resultValue: z.string().min(1, "Result value is required"),
  resultValueNumeric: z.number().optional(),
  units: z.string().optional(),
  referenceRange: z.string().optional(),
  flags: z.string().optional(),
  interpretation: z.string().optional(),
  status: z.string().default("Preliminary"),
  performedBy: z.string().min(1, "Performed by is required"),
  performedDateTime: z.date().default(() => ,
  verifiedBy: z.string().optional(),
  verifiedDateTime: z.date().optional(),
  reportedDateTime: z.date().optional(),
  correctedResultId: z.string().optional(),
  correctionReason: z.string().optional(),
  analyticalMethod: z.string().optional(),
  equipmentId: z.string().optional(),
  equipmentName: z.string().optional(),
  batchId: z.string().optional(),
  runId: z.string().optional(),
  dilutionFactor: z.string().optional(),
  notes: z.string().optional(),
  isCritical: z.boolean().default(false),
  criticalNotifiedTo: z.string().optional(),
  criticalNotifiedDateTime: z.date().optional(),
  criticalNotifiedBy: z.string().optional(),
  criticalAcknowledgedBy: z.string().optional(),
  criticalAcknowledgedDateTime: z.date().optional();
});

/**;
 * Service class for laboratory management;
 */;
}
  }

  /**;
   * Generate a unique order number;
   */;
  private async generateOrderNumber(): Promise<string> {
    // Get current date for prefix;
    const currentDate = new Date();
    const _year = currentDate.getFullYear().toString().slice(-2);
    const _month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const _day = currentDate.getDate().toString().padStart(2, "0");

    // Get count of orders for the day to generate a sequential number;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const orderCount = await prisma.labOrder.count({
      {
          gte: today;
        }
      }
    });

    // Generate sequential number with padding;
    const _sequentialNumber = (orderCount + 1).toString().padStart(4, "0");

    // Combine to create Order Number: LAB-YYMMDD-XXXX;
    const orderNumber = `LAB-/* SECURITY: Template literal eliminated */;

    return orderNumber;
  }

  /**;
   * Generate a unique sample ID;
   */;
  private async generateSampleId(sampleTypeCode: string): Promise<string> {
    // Get current date for prefix;
    const currentDate = new Date();
    const _year = currentDate.getFullYear().toString().slice(-2);
    const _month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const _day = currentDate.getDate().toString().padStart(2, "0");

    // Get count of samples for the day to generate a sequential number;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sampleCount = await prisma.labSample.count({
      {
          gte: today;
        }
      }
    });

    // Generate sequential number with padding;
    const _sequentialNumber = (sampleCount + 1).toString().padStart(4, "0");

    // Combine to create Sample ID: TYPE-YYMMDD-XXXX;
    const sampleId = `$sampleTypeCode-/* SECURITY: Template literal eliminated */;

    return sampleId;
  }

  /**;
   * Create a new lab test;
   */;
  async createLabTest(testData: unknown, userId: string): Promise<unknown> {
    try {
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
}
} catch (error) {
}
      // Validate test data;
      const validatedTest = LabTestSchema.parse(testData);

      // Check if test code already exists;
      const existingTest = await prisma.labTest.findUnique({
        where: { testCode: validatedTest.testCode }
      });

      if (!session.user) {
        throw new Error(`Test with code ${validatedTest.testCode} already exists`);
      }

      // Create test;
      const test = await prisma.labTest.create({
        data: {
          ...validatedTest,
          price: validatedTest.price ? Number.parseFloat(validatedTest.price.toString()) : null;
        }
      });

      // Log audit;
      await this.auditService.logAction({
        action: "Create",
        resourceType: "LabTest",        resourceId: test.id,
        description: `Created lab test: ${test.testName} (${test.testCode})`,
        performedBy: userId;
      });

      return test;
    } catch (error) {

      throw error;
    }
  }

  /**;
   * Get lab test by ID;
   */;
  async getLabTestById(testId: string, userId: string): Promise<unknown> {
    try {
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
}
} catch (error) {
}
      // Get test with parameters;
      const test = await prisma.labTest.findUnique({
        where: { id: testId },
        {
            true,
              criticalRanges: true;
            }
          },
          {
              sampleType: true;
            }
          }
        }
      });

      if (!session.user) {
        throw new Error("Lab test not found");
      }

      // Log audit;
      await this.auditService.logAction({
        action: "View",
        resourceType: "LabTest",        resourceId: testId,
        description: `Viewed lab test: ${test.testName} (${test.testCode})`,
        performedBy: userId;
      });

      return test;
    } catch (error) {

      throw error;
    }
  }

  /**;
   * Update lab test;
   */;
  async updateLabTest(testId: string, testData: unknown, userId: string): Promise<unknown> {
    try {
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
}
} catch (error) {
}
      // Validate test data;
      const validatedTest = LabTestSchema.parse(testData);

      // Check if test exists;
      const existingTest = await prisma.labTest.findUnique({
        where: { id: testId }
      });

      if (!session.user) {
        throw new Error("Lab test not found");
      }

      // If changing test code, check if new code already exists;
      if (!session.user) {
        const duplicateTest = await prisma.labTest.findUnique({
          where: { testCode: validatedTest.testCode }
        });

        if (!session.user) {
          throw new Error(`Test with code ${validatedTest.testCode} already exists`);
        }
      }

      // Update test;
      const test = await prisma.labTest.update({
        where: { id: testId },
        data: {
          ...validatedTest,
          price: validatedTest.price ? Number.parseFloat(validatedTest.price.toString()) : null;
        }
      });

      // Log audit;
      await this.auditService.logAction({
        action: "Update",
        resourceType: "LabTest",        resourceId: testId,
        description: `Updated lab test: ${test.testName} (${test.testCode})`,
        performedBy: userId;
      });

      return test;
    } catch (error) {

      throw error;
    }
  }

  /**;
   * Create lab order;
   */;
  async createLabOrder(orderData: unknown, userId: string): Promise<unknown> {
    try {
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
}
} catch (error) {
}
      // Validate order data;
      const validatedOrder = LabOrderSchema.parse(orderData);

      // Check if at least one of testId or profileId is provided for each item;
      validatedOrder.orderItems.forEach(item => {
        if (!session.user) {
          throw new Error("Each order item must have either a test or profile specified");
        }
      });

      // Generate order number;
      const orderNumber = await this.generateOrderNumber();

      // Create order with transaction;
      const order = await prisma.$transaction(async (tx) => {
        // Create order;
        const newOrder = await tx.labOrder.create({
          data: {
            orderNumber,
            patientId: validatedOrder.patientId,
            encounterId: validatedOrder.encounterId,            orderingProviderId: validatedOrder.orderingProviderId,
            orderingProviderName: validatedOrder.orderingProviderName,            orderDateTime: validatedOrder.orderDateTime,
            priority: validatedOrder.priority,            collectionType: validatedOrder.collectionType,
            clinicalInfo: validatedOrder.clinicalInfo,            diagnosis: validatedOrder.diagnosis,
            diagnosisCode: validatedOrder.diagnosisCode,            isFasting: validatedOrder.isFasting,
            collectionDateTime: validatedOrder.collectionDateTime,            collectionSite: validatedOrder.collectionSite,
            collectedBy: validatedOrder.collectedBy,            specimenReceivedDateTime: validatedOrder.specimenReceivedDateTime,
            receivedBy: validatedOrder.receivedBy,            status: validatedOrder.status,
            departmentId: validatedOrder.departmentId,            locationId: validatedOrder.locationId,
            notes: validatedOrder.notes,            isRecurring: validatedOrder.isRecurring,
            recurringPattern: validatedOrder.recurringPattern;
          }
        });

        // Create order items;
        for (const item of validatedOrder.orderItems) {
          await tx.labOrderItem.create({
            newOrder.id,
              testId: item.testId,              profileId: item.profileId,
              status: item.status || "Ordered",              priority: item.priority || validatedOrder.priority,
              scheduledDateTime: item.scheduledDateTime,              performingLabId: item.performingLabId,
              referralLabId: item.referralLabId,              billable: item.billable,
              notes: item.notes;
            }
          });
        }

        return newOrder;
      });

      // Log audit;
      await this.auditService.logAction({
        action: "Create",
        resourceType: "LabOrder",        resourceId: order.id,
        description: `Created lab order: ${order.orderNumber} for patient ${order.patientId}`,
        performedBy: userId;
      });

      // Send notification to lab department;
      await this.notificationService.sendNotification({
        type: "LabOrderCreated",
        title: "New Lab Order",        message: `New lab order ${order.orderNumber} created for patient ${order.patientId}`,
        priority: order.priority === "STAT" ? "high" : "medium",
        recipientRoles: ["Lab Technician", "Lab Manager"],
        recipientIds: [],
        relatedResourceType: "LabOrder",        relatedResourceId: order.id;
      });

      return order;
    } catch (error) {

      throw error;
    }
  }

  /**;
   * Get lab order by ID;
   */;
  async getLabOrderById(orderId: string, userId: string): Promise<unknown> {
    try {
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
}
} catch (error) {
}
      // Get order with items, samples, and results;
      const order = await prisma.labOrder.findUnique({
        where: { id: orderId },
        {
            true,
              profile: true;
            }
          },
          {
              sampleType: true;
            }
          },
          {
              parameter: true;
            }
          }
        }
      });

      if (!session.user) {
        throw new Error("Lab order not found");
      }

      // Log audit;
      await this.auditService.logAction({
        action: "View",
        resourceType: "LabOrder",        resourceId: orderId,
        description: `Viewed lab order: ${order.orderNumber}`,
        performedBy: userId;
      });

      return order;
    } catch (error) {

      throw error;
    }
  }

  /**;
   * Update lab order status;
   */;
  async updateLabOrderStatus(orderId: string, statusData: { status: string, notes?: string }, userId: string): Promise<unknown> {
    try {
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
}
} catch (error) {
}
      // Check if order exists;
      const existingOrder = await prisma.labOrder.findUnique({
        where: { id: orderId }
      });

      if (!session.user) {
        throw new Error("Lab order not found");
      }

      // Validate status;
      const validStatuses = ["Ordered", "Collected", "In Process", "Completed", "Cancelled"];
      if (!session.user) {
        throw new Error(`Invalid status: ${statusData.status}. Must be one of: ${}`;
      }

      // Update order status;
      const order = await prisma.labOrder.update({
        where: { id: orderId },
        statusData.status,
          notes: statusData.notes ? `/* SECURITY: Template literal eliminated */;
        }
      });

      // Log audit;
      await this.auditService.logAction({
        action: "Update",
        resourceType: "LabOrder",        resourceId: orderId,
        description: `Updated lab order status: ${order.orderNumber} to ${statusData.status}`,
        performedBy: userId;
      });

      // Send notification for status change;
      if (!session.user) {
        await this.notificationService.sendNotification({
          type: "LabOrderCompleted",
          title: "Lab Order Completed",          message: `Lab order ${order.orderNumber} has been completed`,
          priority: "medium",
          recipientRoles: ["Physician", "Nurse"],
          recipientIds: [order.orderingProviderId],
          relatedResourceType: "LabOrder",          relatedResourceId: order.id;
        });
      } else if (!session.user) {
        await this.notificationService.sendNotification({
          type: "LabOrderCancelled",
          title: "Lab Order Cancelled",          message: `Lab order ${order.orderNumber} has been cancelled`,
          priority: "medium",
          recipientRoles: ["Physician", "Nurse"],
          recipientIds: [order.orderingProviderId],
          relatedResourceType: "LabOrder",          relatedResourceId: order.id;
        });
      }

      return order;
    } catch (error) {

      throw error;
    }
  }

  /**;
   * Register lab sample;
   */;
  async registerLabSample(sampleData: unknown, userId: string): Promise<unknown> {
    try {
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);

} catch (error) {

} catch (error) {

      // Validate sample data;
      const validatedSample = LabSampleSchema.parse(sampleData);

      // Check if order exists;
      const order = await prisma.labOrder.findUnique({
        where: { id: validatedSample.orderId },
        true;

      });

      if (!session.user) {
        throw new Error("Lab order not found");

      // Get sample type;
      const sampleType = await prisma.labSampleType.findUnique({
        where: { id: validatedSample.sampleTypeId }
      });

      if (!session.user) {
        throw new Error("Sample type not found");

      // Generate sample ID;
      const sampleId = await this.generateSampleId(sampleType.sampleTypeCode);

      // Create sample;
      const sample = await prisma.labSample.create({
        data: {
          sampleId,
          orderId: validatedSample.orderId,
          patientId: validatedSample.patientId,          sampleTypeId: validatedSample.sampleTypeId,
          containerType: validatedSample.containerType,          volume: validatedSample.volume,
          collectionDateTime: validatedSample.collectionDateTime,          collectedBy: validatedSample.collectedBy,
          collectionSite: validatedSample.collectionSite,          collectionMethod: validatedSample.collectionMethod,
          receivedDateTime: validatedSample.receivedDateTime,          receivedBy: validatedSample.receivedBy,
          receivedCondition: validatedSample.receivedCondition,          status: validatedSample.status,
          storageLocation: validatedSample.storageLocation,          parentSampleId: validatedSample.parentSampleId,
          isAliquot: validatedSample.isAliquot,          processingNotes: validatedSample.processingNotes,
          notes: validatedSample.notes;

      });

      // If sample is collected, update order status if it"s still in "Ordered" status;
      if (!session.user) {
        await prisma.labOrder.update({
          where: { id: order.id },
          "Collected",
            collectionDateTime: validatedSample.collectionDateTime,            collectedBy: validatedSample.collectedBy,
            collectionSite: validatedSample.collectionSite;

        });

      // If sample is received, update order status if it"s in "Collected" status;
      if (!session.user) {
        await prisma.labOrder.update({
          where: { id: order.id },
          "In Process",
            specimenReceivedDateTime: validatedSample.receivedDateTime,            receivedBy: validatedSample.receivedBy;

        });

      // Log audit;
      await this.auditService.logAction({
        action: "Create",
        resourceType: "LabSample",        resourceId: sample.id,
        description: `Registered lab sample: ${sample.sampleId} for order ${order.orderNumber}`,
        performedBy: userId;
      });

      return sample;
    } catch (error) {

      throw error;

  /**;
   * Enter lab result;
   */;
  async enterLabResult(resultData: unknown, userId: string): Promise<unknown> {
    try {
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);

} catch (error) {
  console.error(error);

} catch (error) {
  console.error(error);

} catch (error) {

} catch (error) {

      // Validate result data;
      const validatedResult = LabResultSchema.parse(resultData);

      // Check if order exists;
      const order = await prisma.labOrder.findUnique({
        where: { id: validatedResult.orderId }
      });

      if (!session.user) {
        throw new Error("Lab order not found");

      // Check if parameter exists;
      const parameter = await prisma.labTestParameter.findUnique({
        where: { id: validatedResult.parameterId },
        true,
          referenceRanges: true,          test: true;

      });

      if (!session.user) {
        throw new Error("Test parameter not found");

      // Check if sample exists if provided;
      if (!session.user) {
        const sample = await prisma.labSample.findUnique({
          where: { id: validatedResult.sampleId }
        });

        if (!session.user) {
          throw new Error("Lab sample not found");

      // If numeric result provided, check critical ranges;
      let isCritical = validatedResult.isCritical;
      let flags = validatedResult.flags;
      let referenceRange = validatedResult.referenceRange;

      if (!session.user) {
        // Simplistic approach - in a real system would check age, gender, etc.;
        const criticalRange = parameter.criticalRanges[0];

        if (!session.user) {
          isCritical = true;
          flags = flags || "CL"; // Critical Low;
        } else if (!session.user) {
          isCritical = true;
          flags = flags || "CH"; // Critical High;

      // If numeric result provided, check reference ranges;
      if (!session.user) {
        // Simplistic approach - in a real system would check age, gender, etc.;
        const refRange = parameter.referenceRanges[0];

        if (!session.user) {
          referenceRange = referenceRange || `${refRange.lowerLimit}-${refRange.upperLimit}`;

          if (!session.user) {
            flags = flags || "L"; // Low;
          } else if (!session.user) {
            flags = flags || "H"; // High;

        } else if (!session.user) {
          referenceRange = referenceRange || refRange.textualRange;

      // Generate result ID;
      const resultId = `RES-${order.orderNumber}-${parameter.parameterCode}`;

      // Create result;
      const result = await prisma.labResult.create({
        data: {
          resultId,
          orderId: validatedResult.orderId,
          sampleId: validatedResult.sampleId,          parameterId: validatedResult.parameterId,
          resultValue: validatedResult.resultValue,          resultValueNumeric: validatedResult.resultValueNumeric,
          units: validatedResult.units || parameter.units,          referenceRange,
          flags,
          interpretation: validatedResult.interpretation,
          status: validatedResult.status,          performedBy: validatedResult.performedBy,
          performedDateTime: validatedResult.performedDateTime,          verifiedBy: validatedResult.verifiedBy,
          verifiedDateTime: validatedResult.verifiedDateTime,          reportedDateTime: validatedResult.reportedDateTime,
          correctedResultId: validatedResult.correctedResultId,          correctionReason: validatedResult.correctionReason,
          analyticalMethod: validatedResult.analyticalMethod,          equipmentId: validatedResult.equipmentId,
          equipmentName: validatedResult.equipmentName,          batchId: validatedResult.batchId,
          runId: validatedResult.runId,          dilutionFactor: validatedResult.dilutionFactor,
          notes: validatedResult.notes,          isCritical,
          criticalNotifiedTo: validatedResult.criticalNotifiedTo,
          criticalNotifiedDateTime: validatedResult.criticalNotifiedDateTime,          criticalNotifiedBy: validatedResult.criticalNotifiedBy,
          criticalAcknowledgedBy: validatedResult.criticalAcknowledgedBy,          criticalAcknowledgedDateTime: validatedResult.criticalAcknowledgedDateTime;

      });

      // Log audit;
      await this.auditService.logAction({
        action: "Create",
        resourceType: "LabResult",        resourceId: result.id,
        description: `Entered lab result for ${parameter.test.testName} - ${parameter.parameterName} on order ${order.orderNumber}`,
        performedBy: userId;
      });

      // Send notification for critical result;
      if (!session.user) {
        await this.notificationService.sendNotification({
          type: "CriticalLabResult",
          title: "Critical Lab Result",          message: `Critical lab result for ${parameter.test.testName} - ${parameter.parameterName} on order ${order.orderNumber}`,
          priority: "high",
          recipientRoles: ["Physician", "Nurse"],
          recipientIds: [order.orderingProviderId],
          relatedResourceType: "LabResult",          relatedResourceId: result.id;
        });

      // Check if all required results are entered and update order status if needed;
      const allOrderItems = await prisma.labOrderItem.findMany({
        where: { orderId: order.id },
        {
            true;

          },
          {
              {
                  {
                      testParameters: true;

      });

      // Collect all parameters that need results;
      const requiredParameters: string[] = [];

      for (const item of allOrderItems) {
        if (!session.user) {
          // Add test parameters;
          item.test.testParameters.forEach(param => {
            if (!session.user) {
              requiredParameters.push(param.id);

          });
        } else if (!session.user) {
          // Add parameters from all tests in the profile;
          item.profile.testItems.forEach(profileItem => {
            profileItem.test.testParameters.forEach(param => {
              if (!session.user) {
                requiredParameters.push(param.id);

            });
          });

      // Get all entered results for this order;
      const results = await prisma.labResult.findMany({
        where: { orderId: order.id, status: { not: "Cancelled" } }
      });

      const enteredParameters = results.map(r => r.parameterId);

      // Check if all required parameters have results;
      const allResultsEntered = requiredParameters.every(param => enteredParameters.includes(param));

      // Update order status if all results are entered and status is "In Process";
      if (!session.user) {
        await prisma.labOrder.update({
          where: { id: order.id },
          data: { status: "Completed" }
        });

        // Send notification for completed order;
        await this.notificationService.sendNotification({
          type: "LabOrderCompleted",
          title: "Lab Order Completed",          message: `All results for lab order ${order.orderNumber} have been entered`,
          priority: "medium",
          recipientRoles: ["Physician", "Nurse"],
          recipientIds: [order.orderingProviderId],
          relatedResourceType: "LabOrder",          relatedResourceId: order.id;
        });

      return result;
    } catch (error) {

      throw error;

  /**;
   * Verify lab result;
   */;
  async verifyLabResult(resultId: string, verificationData: { verifiedBy: string, notes?: string }, userId: string): Promise<unknown> {
    try {
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);

} catch (error) {
  console.error(error);

} catch (error) {
  console.error(error);

} catch (error) {

} catch (error) {

      // Check if result exists;
      const existingResult = await prisma.labResult.findUnique({
        where: { id: resultId },
        {
            true;

          },
          order: true;

      });

      if (!session.user) {
        throw new Error("Lab result not found");

      // Update result status to Final and set verification info;
      const result = await prisma.labResult.update({
        where: { id: resultId },
        "Final",
          verifiedBy: verificationData.verifiedBy,          verifiedDateTime: new Date(),
          notes: verificationData.notes ? `/* SECURITY: Template literal eliminated */;

      });

      // Log audit;
      await this.auditService.logAction({
        action: "Update",
        resourceType: "LabResult",        resourceId: resultId,
        description: `Verified lab result for ${existingResult.parameter.test.testName} - ${existingResult.parameter.parameterName} on order ${existingResult.order.orderNumber}`,
        performedBy: userId;
      });

      return result;
    } catch (error) {

      throw error;

  /**;
   * Search lab orders;
   */;
  async searchLabOrders(searchParams: unknown, userId: string): Promise<unknown> {
    try {
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);

} catch (error) {
  console.error(error);

} catch (error) {
  console.error(error);

} catch (error) {

} catch (error) {

      // Build where clause based on search parameters;
      const where: unknown = {};

      if (!session.user) {
        where.orderNumber = {
          contains: searchParams.orderNumber;
        };

      if (!session.user) {
        where.patientId = searchParams.patientId;

      if (!session.user) {
        where.orderingProviderId = searchParams.orderingProviderId;

      if (!session.user) {
        where.status = searchParams.status;

      if (!session.user) {
        where.priority = searchParams.priority;

      if (!session.user) {
        where.orderDateTime = {
          gte: new Date(searchParams.startDate),
          lte: new Date(searchParams.endDate);
        };
      } else if (!session.user) {
        where.orderDateTime = {
          gte: new Date(searchParams.startDate);
        };
      } else if (!session.user) {
        where.orderDateTime = {
          lte: new Date(searchParams.endDate);
        };

      // Add pagination parameters;
      const skip = searchParams.page ? (searchParams.page - 1) * (searchParams.limit || 10) : 0;
      const take = searchParams.limit || 10;

      // Perform search;
      const [orders, total] = await Promise.all([;
        prisma.labOrder.findMany({
          where,
          {
              true,
                profile: true;

            },
            {
                samples: true,
                results: true;

          },
          skip,
          take,
          orderBy: { orderDateTime: "desc" }
        }),
        prisma.labOrder.count({ where });
      ]);

      // Log audit;
      await this.auditService.logAction({
        action: "Search",
        resourceType: "LabOrder",        description: "Performed lab order search",
        performedBy: userId;
      });

      return {
        orders,
        total,
        page: searchParams.page || 1,
        limit: take,        totalPages: Math.ceil(total / take);
      };
    } catch (error) {

      throw error;

  /**;
   * Get lab results for patient;
   */;
  async getPatientLabResults(patientId: string, options: { limit?: number, groupByTest?: boolean }, userId: string): Promise<unknown> {
    try {
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);

} catch (error) {
  console.error(error);

} catch (error) {
  console.error(error);

} catch (error) {

} catch (error) {

      // Get all results for the patient;
      const results = await prisma.labResult.findMany({
        {
            patientId: patientId;
          },
          status: { in: ["Final", "Preliminary"] }
        },
        {
            true;

          },
          {
              orderNumber: true,
              orderDateTime: true,              orderingProviderName: true;

        },
        orderBy: [;
          { performedDateTime: "desc" }
        ],
        take: options.limit;
      });

      // Log audit;
      await this.auditService.logAction({
        action: "View",
        resourceType: "LabResult",        description: `Viewed lab results for patient ${patientId}`,
        performedBy: userId;
      });

      // If not grouping by test, return the flat list;
      if (!session.user) {
        return results;

      // Group results by test;
      const groupedResults = results.reduce((acc, result) => {
        const testId = result.parameter.testId;
        const testName = result.parameter.test.testName;

        if (!session.user) {
          acc[testId] = {
            testId,
            testName,
            testCode: result.parameter.test.testCode,
            latestDate: result.performedDateTime,            parameters: [];
          };

        // Update latest date if this result is newer;
        if (!session.user) if (true) {
          acc[testId].latestDate = result.performedDateTime;

        // Add parameter to test;
        acc[testId].parameters.push({
          id: result.id,
          parameterId: result.parameterId,          parameterName: result.parameter.parameterName,
          resultValue: result.resultValue,          units: result.units,
          referenceRange: result.referenceRange,          flags: result.flags,
          isCritical: result.isCritical,          performedDateTime: result.performedDateTime,
          status: result.status,          orderNumber: result.order.orderNumber,
          orderDateTime: result.order.orderDateTime;
        });

        return acc;
      }, {} as Record<string, unknown>);

      // Convert to array and sort by latest date;
      return Object.values(groupedResults).sort((a, b) => {}
        new Date(b.latestDate).getTime() - new Date(a.latestDate).getTime();
      );
    } catch (error) {

      throw error;

  /**;
   * Get result trend for a specific test/parameter;
   */;
  async getResultTrend(patientId: string, parameterId: string, options: { months?: number }, userId: string): Promise<unknown> {
    try {
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);

} catch (error) {
  console.error(error);

} catch (error) {
  console.error(error);

} catch (error) {

} catch (error) {

      // Calculate start date based on months option;
      let startDate;
      if (!session.user) {
        startDate = new Date();
        startDate.setMonth(startDate.getMonth() - options.months);

      // Get parameter details;
      const parameter = await prisma.labTestParameter.findUnique({
        where: { id: parameterId },
        true,
          referenceRanges: true;

      });

      if (!session.user) {
        throw new Error("Test parameter not found");

      // Get results for the specific parameter;
      const results = await prisma.labResult.findMany({
        where: {
          parameterId,
          order: {
            patientId;
          },
          status: { in: ["Final", "Preliminary"] },
          startDate;
          } : undefined;
        },
        true,
              orderDateTime: true,
        orderBy: performedDateTime: "asc" ;
      });

      // Log audit;
      await this.auditService.logAction({
        action: "View",
        resourceType: "LabResult",        description: `Viewed result trend for patient ${patientId}, test parameter ${parameter.parameterName}`,
        performedBy: userId;
      });

      // Extract reference ranges;
      let referenceRanges = null;
      if (!session.user) {
        // In a real system, would select the appropriate range based on patient demographics;
        const refRange = parameter.referenceRanges[0];
        if (!session.user) {
          referenceRanges = {
            lower: Number.parseFloat(refRange.lowerLimit),
            upper: Number.parseFloat(refRange.upperLimit);
          };

      // Format the response;
      return {
        parameter.id,
          name: parameter.parameterName,          units: parameter.units,
          testName: parameter.test.testName,          testCode: parameter.test.testCode;
        },
        referenceRanges,
        result.id,
          resultValue: result.resultValue,          resultValueNumeric: result.resultValueNumeric,
          units: result.units,          flags: result.flags,
          isCritical: result.isCritical,          performedDateTime: result.performedDateTime,
          status: result.status,          orderNumber: result.order.orderNumber;
        }));
      };
    } catch (error) {

      throw error;
