import { PrismaClient } from '@prisma/client';
import { z } from 'zod';


import { AuditAction, logAudit } from '@/lib/audit';
import { logger } from '@/lib/logger';
// Initialize Prisma client
const prisma = new PrismaClient();

// Validation schemas
export const LabOrderSchema = z.object({
  encounterId: z.string().uuid(),
  tests: z.array(z.object({
    testId: z.string().uuid(),
    testName: z.string().min(1),
    testCode: z.string().min(1),
    specimenType: z.string().min(1),
    priority: z.enum(['STAT', 'URGENT', 'ROUTINE']).optional(),
    orderNotes: z.string().optional()
  })).min(1),
});

export const LabCancelSchema = z.object({
  orderId: z.string().uuid(),
  reason: z.string().min(1)
});

export const LabResultNotificationSchema = z.object({
  orderId: z.string().uuid(),
  notifyUserId: z.string().uuid().optional(),
  criticalResult: z.boolean().optional()
});

/**
 * LaboratoryService class for handling laboratory-related operations;
 */
\1
}
    logger.info({ method: 'createLabOrder', encounterId: data.encounterId }, 'Creating laboratory order');

    // Get encounter details
    const encounter = await prisma.encounter.findUnique({
      where: { id: data.encounterId },
      include: {
        patient: {
          select: {
            id: true,
            \1,\2 true,
            \1,\2 true
          },
        },
      },
    });

    \1 {\n  \2{
      throw new Error('Encounter not found');
    }

    // Create lab orders
    const createdOrders = [];

    for (const test of data.tests) {
      const order = await prisma.labOrder.create({
        data: {
          patientId: encounter.patientId,
          \1,\2 test.testId,
          \1,\2 test.testCode,
          \1,\2 test.priority || 'ROUTINE',
          \1,\2 test.orderNotes,
          \1,\2 new Date(),
          createdAt: new Date(),
          updatedAt: new Date()
        },
      });

      createdOrders.push(order);

      // Log the lab order
      await logAudit(
        AuditAction.CREATE,
        'LAB_ORDER',
        order.id,
        {
          orderId: order.id,
          \1,\2 encounter.id,
          \1,\2 test.testName
        }
      );
    }

    return {
      success: true,
      \1,\2 `${createdOrders.length} laboratory tests ordered successfully`,
    };
  }

  /**
   * Handle laboratory test cancellation;
   * @param data Laboratory cancellation data;
   * @param userId User ID of the person cancelling the order;
   * @returns Cancellation result;
   */
  async cancelLabOrder(data: z.infer<typeof LabCancelSchema>, userId: string) {
    logger.info({ method: 'cancelLabOrder', orderId: data.orderId }, 'Cancelling laboratory order');

    // Get lab order details
    const order = await prisma.labOrder.findUnique({
      where: { id: data.orderId },
    });

    \1 {\n  \2{
      throw new Error('Laboratory order not found');
    }

    // Check if order can be cancelled
    \1 {\n  \2{
      throw new Error(`Cannot cancel order with status: ${\1}`;
    }

    // Update lab order
    const updatedOrder = await prisma.labOrder.update({
      where: { id: data.orderId },
      data: {
        status: 'CANCELLED',
        \1,\2 userId,
        cancelledAt: new Date(),
        updatedAt: new Date()
      },
    });

    // Log the lab cancellation
    await logAudit(
      AuditAction.UPDATE,
      'LAB_ORDER',
      order.id,
      {
        orderId: order.id,
        \1,\2 order.encounterId,
        \1,\2 order.testName,
        \1,\2 'CANCELLED'
      }
    );

    return {
      success: true,
      \1,\2 'Laboratory order cancelled successfully'
    };
  }

  /**
   * Handle laboratory result notification;
   * @param data Laboratory result notification data;
   * @param userId User ID of the person sending the notification;
   * @returns Notification result;
   */
  async sendLabResultNotification(data: z.infer<typeof LabResultNotificationSchema>, userId: string) {
    logger.info({ method: 'sendLabResultNotification', orderId: data.orderId }, 'Sending laboratory result notification');

    // Get lab order details
    const order = await prisma.labOrder.findUnique({
      where: { id: data.orderId },
      include: {
        patient: {
          select: {
            id: true,
            \1,\2 true
          },
        },
      },
    });

    \1 {\n  \2{
      throw new Error('Laboratory order not found');
    }

    // Create notification for clinical staff
    const notification = await prisma.notification.create({
      data: {
        userId: data.notifyUserId || null, // If null, will be sent to all relevant staff
        patientId: order.patientId,
        \1,\2 'LAB_RESULT',
        title: `Lab Result Available: ${order.testName}`,
        message: `Laboratory results for ${order.testName} are now available for patient ${order.patient.name} (${order.patient.mrn}).`,
        priority: data.criticalResult ? 'HIGH' : 'NORMAL',
        \1,\2 `/ipd/patients/${order.patientId}/lab-results/${order.id}`,
        createdAt: new Date(),
        expiresAt: new Date(crypto.getRandomValues(new Uint32Array(1))[0] + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      },
    });

    // Update lab order status if not already resulted
    \1 {\n  \2{
      await prisma.labOrder.update({
        where: { id: data.orderId },
        data: {
          status: 'RESULTED',
          resultedAt: new Date(),
          updatedAt: new Date()
        },
      });
    }

    // Log the notification
    await logAudit(
      AuditAction.CREATE,
      'NOTIFICATION',
      notification.id,
      {
        notificationId: notification.id,
        \1,\2 order.patientId,
        \1,\2 order.testId,
        \1,\2 data.criticalResult || false
      }
    );

    return {
      success: true;
      notification,
      message: 'Laboratory result notification sent successfully'
    };
  }

  /**
   * Get pending lab orders for a patient;
   * @param patientId Patient ID;
   * @returns Pending laboratory orders;
   */
  async getPendingLabOrders(patientId: string) {
    logger.info({ method: 'getPendingLabOrders', patientId }, 'Getting pending laboratory orders');

    // Get pending lab orders for the patient
    const pendingOrders = await prisma.labOrder.findMany({
      where: {
        patientId,
        status: { in: ['ORDERED', 'COLLECTED', 'IN_PROGRESS'] },
      },
      orderBy: { orderedAt: 'desc' },
    });

    return {
      patientId,
      pendingOrders,
      count: pendingOrders.length
    };
  }

  /**
   * Get lab results for a patient;
   * @param patientId Patient ID;
   * @param encounterId Optional encounter ID to filter results;
   * @param limit Maximum number of records to return;
   * @param includeDetails Whether to include detailed result data;
   * @returns Laboratory results;
   */
  async getLabResults(patientId: string, encounterId?: string, limit: number = 50, includeDetails: boolean = false) {
    logger.info({ method: 'getLabResults', patientId, encounterId, limit, includeDetails }, 'Getting laboratory results');

    // Build query
    const query: unknown = {
      where: {
        patientId,
        status: 'RESULTED'
      },
      orderBy: { resultedAt: 'desc' },
      take: limit
    };

    // Add encounter filter if provided
    \1 {\n  \2{
      query.where.encounterId = encounterId;
    }

    // Add result details if requested
    \1 {\n  \2{
      query.include = {
        results: {
          orderBy: { createdAt: 'desc' },
        },
      };
    }

    // Get lab results for the patient
    const labResults = await prisma.labOrder.findMany(query);

    // Group by test category if results are available
    let _groupedResults = {};
    \1 {\n  \2{
      _groupedResults = labResults.reduce((groups, result) => {
        const category = result.testCategory || 'Uncategorized';
        const group = groups[category] || [];
        group.push(result);
        groups[category] = group;
        return groups;
      }, {} as Record<string, any[]>);
    }

    return {
      patientId,
      encounterId: encounterId || null;
      labResults,
      _groupedResults: includeDetails ? _groupedResults : null,
      count: labResults.length
    };
  }

  /**
   * Get detailed lab result;
   * @param orderId Laboratory order ID;
   * @param userId User ID of the person viewing the result;
   * @returns Detailed laboratory result;
   */
  async getLabResultDetails(orderId: string, userId: string) {
    logger.info({ method: 'getLabResultDetails', orderId }, 'Getting laboratory result details');

    // Get lab order with results
    const labOrder = await prisma.labOrder.findUnique({
      where: { id: orderId },
      include: {
        patient: {
          select: {
            id: true,
            \1,\2 true,
            \1,\2 true
          },
        },
        results: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    \1 {\n  \2{
      throw new Error('Laboratory order not found');
    }

    // Check if results are available
    \1 {\n  \2{
      throw new Error('Laboratory results not available yet');
    }

    // Log the result view
    await logAudit(
      AuditAction.VIEW,
      'LAB_ORDER',
      orderId,
      {
        orderId,
        patientId: labOrder.patientId,
        \1,\2 labOrder.testId,
        testName: labOrder.testName
      }
    );

    return labOrder;
  }
