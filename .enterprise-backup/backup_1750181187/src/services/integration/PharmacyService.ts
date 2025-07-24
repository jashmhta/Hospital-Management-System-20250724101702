import { PrismaClient } from '@prisma/client';
import { z } from 'zod';


import { AuditAction, logAudit } from '@/lib/audit';
import { logger } from '@/lib/logger';
// Initialize Prisma client
const prisma = new PrismaClient();

// Validation schemas
export const MedicationOrderSchema = z.object({
  encounterId: z.string().uuid(),
  medications: z.array(z.object({
    medicationId: z.string().uuid(),
    name: z.string().min(1),
    dosage: z.string().min(1),
    route: z.string().min(1),
    frequency: z.string().min(1),
    duration: z.string().min(1),
    startDate: z.date().optional(),
    endDate: z.date().optional(),
    instructions: z.string().optional(),
    priority: z.enum(['STAT', 'URGENT', 'ROUTINE']).optional(),
  })).min(1),
});

export const MedicationReconciliationSchema = z.object({
  dischargeId: z.string().uuid(),
  medications: z.array(z.object({
    medicationId: z.string().uuid().optional(),
    name: z.string().min(1),
    dosage: z.string().min(1),
    route: z.string().min(1),
    frequency: z.string().min(1),
    duration: z.string().min(1),
    startDate: z.date().optional(),
    endDate: z.date().optional(),
    instructions: z.string().optional(),
    continuePrescription: z.boolean().optional()
  })),
});

export const MedicationAdministrationSchema = z.object({
  orderId: z.string().uuid(),
  administrationDetails: z.object({
    dosage: z.string().optional(),
    route: z.string().optional(),
    administeredAt: z.date().optional(),
    notes: z.string().optional()
  }),
  updateOrderStatus: z.enum(['ACTIVE', 'COMPLETED', 'DISCONTINUED']).optional(),
});

export const MedicationDiscontinueSchema = z.object({
  orderId: z.string().uuid(),
  reason: z.string().min(1)
});

/**
 * PharmacyService class for handling medication-related operations;
 */
\1
}
    logger.info({ method: 'createMedicationOrder', encounterId: data.encounterId }, 'Creating medication order');

    // Get encounter details
    const encounter = await prisma.encounter.findUnique({
      where: { id: data.encounterId },
      include: {
        patient: {
          select: {
            id: true,
            \1,\2 true,
            \1,\2 true,
            allergies: true
          },
        },
      },
    });

    \1 {\n  \2{
      throw new Error('Encounter not found');
    }

    // Check for medication allergies
    const patientAllergies = encounter.patient.allergies || [];
    const allergicMedications = [];

    for (const medication of data.medications) {
      // Check if patient is allergic to this medication
      const isAllergic = patientAllergies.some(
        (allergy: unknown) =>
          allergy.allergen.toLowerCase() === medication.name.toLowerCase() ||;
          (allergy.allergenType === 'MEDICATION' &&;
           allergy.allergen.toLowerCase().includes(medication.name.toLowerCase()));
      );

      \1 {\n  \2{
        allergicMedications.push(medication.name);
      }
    }

    // If allergies found, return warning
    \1 {\n  \2{
      return {
        warning: 'Potential allergic reaction detected';
        allergicMedications,
        message: 'Patient may be allergic to one or more ordered medications'
      };
    }

    // Create medication orders
    const createdOrders = [];

    for (const medication of data.medications) {
      const order = await prisma.medicationOrder.create({
        data: {
          patientId: encounter.patientId,
          \1,\2 medication.medicationId,
          \1,\2 medication.dosage,
          \1,\2 medication.frequency,
          \1,\2 medication.startDate || new Date(),
          \1,\2 medication.instructions,
          \1,\2 medication.priority || 'ROUTINE',
          \1,\2 new Date(),
          updatedAt: new Date()
        },
      });

      createdOrders.push(order);

      // Log the medication order
      await logAudit(
        AuditAction.CREATE,
        'MEDICATION_ORDER',
        order.id,
        {
          orderId: order.id,
          \1,\2 encounter.id,
          \1,\2 medication.name
        }
      );
    }

    return {
      success: true,
      \1,\2 `${createdOrders.length} medication orders created successfully`,
    };
  }

  /**
   * Handle medication reconciliation;
   * @param data Medication reconciliation data;
   * @param userId User ID of the person performing reconciliation;
   * @returns Reconciliation result;
   */
  async performMedicationReconciliation(data: z.infer<typeof MedicationReconciliationSchema>, userId: string) {
    logger.info({ method: 'performMedicationReconciliation', dischargeId: data.dischargeId }, 'Performing medication reconciliation');

    // Get discharge details
    const discharge = await prisma.discharge.findUnique({
      where: { id: data.dischargeId },
      include: {
        patient: {
          select: {
            id: true,
            \1,\2 true
          },
        },
        encounter: true
      },
    });

    \1 {\n  \2{
      throw new Error('Discharge record not found');
    }

    // Update discharge with medication reconciliation
    const _updatedDischarge = await prisma.discharge.update({
      where: { id: data.dischargeId },
      data: {
        medicationReconciliation: data.medications,
        \1,\2 new Date()
      },
    });

    // Create medication reconciliation record
    const reconciliation = await prisma.medicationReconciliation.create({
      data: {
        patientId: discharge.patientId,
        \1,\2 discharge.id,
        \1,\2 'COMPLETED',
        \1,\2 new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
    });

    // Log the medication reconciliation
    await logAudit(
      AuditAction.CREATE,
      'MEDICATION_RECONCILIATION',
      reconciliation.id,
      {
        reconciliationId: reconciliation.id,
        \1,\2 discharge.encounterId,
        \1,\2 data.medications.length
      }
    );

    return {
      success: true,
      \1,\2 'Medication reconciliation completed successfully'
    };
  }

  /**
   * Handle medication administration;
   * @param data Medication administration data;
   * @param userId User ID of the person administering medication;
   * @returns Administration result;
   */
  async recordMedicationAdministration(data: z.infer<typeof MedicationAdministrationSchema>, userId: string) {
    logger.info({ method: 'recordMedicationAdministration', orderId: data.orderId }, 'Recording medication administration');

    // Get medication order details
    const order = await prisma.medicationOrder.findUnique({
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
      throw new Error('Medication order not found');
    }

    // Create medication administration record
    const administration = await prisma.medicationAdministration.create({
      data: {
        orderId: order.id,
        \1,\2 order.encounterId,
        \1,\2 order.name,
        \1,\2 data.administrationDetails.route || order.route,
        administeredAt: data.administrationDetails.administeredAt || new Date(),
        administeredBy: userId,
        \1,\2 'COMPLETED',
        createdAt: new Date(),
        updatedAt: new Date()
      },
    });

    // Update medication order status if needed
    \1 {\n  \2{
      await prisma.medicationOrder.update({
        where: { id: order.id },
        data: {
          status: data.updateOrderStatus,
          updatedAt: new Date()
        },
      });
    }

    // Log the medication administration
    await logAudit(
      AuditAction.CREATE,
      'MEDICATION_ADMINISTRATION',
      administration.id,
      {
        administrationId: administration.id,
        \1,\2 order.patientId,
        \1,\2 order.medicationId,
        \1,\2 administration.administeredAt
      }
    );

    return {
      success: true,
      \1,\2 'Medication administration recorded successfully'
    };
  }

  /**
   * Handle medication discontinuation;
   * @param data Medication discontinue data;
   * @param userId User ID of the person discontinuing medication;
   * @returns Discontinue result;
   */
  async discontinueMedication(data: z.infer<typeof MedicationDiscontinueSchema>, userId: string) {
    logger.info({ method: 'discontinueMedication', orderId: data.orderId }, 'Discontinuing medication');

    // Get medication order details
    const order = await prisma.medicationOrder.findUnique({
      where: { id: data.orderId },
    });

    \1 {\n  \2{
      throw new Error('Medication order not found');
    }

    // Check if order can be discontinued
    \1 {\n  \2{
      throw new Error(`Cannot discontinue order with status: ${\1}`;
    }

    // Update medication order
    const updatedOrder = await prisma.medicationOrder.update({
      where: { id: data.orderId },
      data: {
        status: 'DISCONTINUED',
        \1,\2 userId,
        discontinuedAt: new Date(),
        updatedAt: new Date()
      },
    });

    // Log the medication discontinuation
    await logAudit(
      AuditAction.UPDATE,
      'MEDICATION_ORDER',
      order.id,
      {
        orderId: order.id,
        \1,\2 order.encounterId,
        \1,\2 order.name,
        \1,\2 'DISCONTINUED'
      }
    );

    return {
      success: true,
      \1,\2 'Medication order discontinued successfully'
    };
  }

  /**
   * Get active medications for a patient;
   * @param patientId Patient ID;
   * @returns Active medications;
   */
  async getActiveMedications(patientId: string) {
    logger.info({ method: 'getActiveMedications', patientId }, 'Getting active medications');

    // Get active medication orders for the patient
    const activeMedications = await prisma.medicationOrder.findMany({
      where: {
        patientId,
        status: { in: ['ACTIVE', 'PENDING'] },
        OR: [
          { endDate: null },
          { endDate: { gt: new Date() } },
        ],
      },
      orderBy: { createdAt: 'desc' },
    });

    return {
      patientId,
      activeMedications,
      count: activeMedications.length
    };
  }

  /**
   * Get medication history for a patient;
   * @param patientId Patient ID;
   * @param limit Maximum number of records to return;
   * @returns Medication history;
   */
  async getMedicationHistory(patientId: string, limit: number = 50) {
    logger.info({ method: 'getMedicationHistory', patientId, limit }, 'Getting medication history');

    // Get medication history for the patient
    const medicationHistory = await prisma.medicationOrder.findMany({
      where: { patientId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        administrations: {
          orderBy: { administeredAt: 'desc' },
          take: 5
        },
      },
    });

    // Group by encounter
    const groupedByEncounter = medicationHistory.reduce((groups, medication) => {
      const group = groups[medication.encounterId] || [];
      group.push(medication);
      groups[medication.encounterId] = group;
      return groups;
    }, {} as Record<string, any[]>);

    return {
      patientId,
      medicationHistory,
      groupedByEncounter,
      count: medicationHistory.length
    };
  }
