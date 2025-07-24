
import { z } from 'zod';
}

/**
 * Domain Models for Pharmacy Module;
 *
 * This file contains the domain models for the pharmacy module,
 * following domain-driven design principles.
 */

// Define domain models using ES2015 module syntax instead of namespace
\1
}
  };
\1
}
  };
  discrepancies: Array<MedicationDiscrepancy & {
    resolution?: {
      action: 'continue' | 'discontinue' | 'modify' | 'substitute',
      \1,\2 Date,
      notes: string
    };
  }>;
\1
}
}

// Validation schemas using Zod
export const MedicationSchema = z.object({
  id: z.string(),
  name: z.string(),
  brandName: z.string(),
  ndc: z.string(),
  form: z.string(),
  strength: z.number().positive(),
  unit: z.string(),
  isControlled: z.boolean(),
  isHighAlert: z.boolean(),
  controlledSubstanceSchedule: z.string().optional(),
  therapeuticClass: z.string().optional(),
  manufacturer: z.string().optional(),
  description: z.string().optional(),
  warnings: z.array(z.string()).optional(),
  contraindications: z.array(z.string()).optional(),
  interactions: z.array(z.string()).optional(),
  sideEffects: z.array(z.string()).optional(),
  storageRequirements: z.string().optional(),
  requiresRefrigeration: z.boolean().optional(),
  requiresControlledStorage: z.boolean().optional()
});

export const MedicationInventorySchema = z.object({
  id: z.string(),
  medicationId: z.string(),
  locationId: z.string(),
  batchNumber: z.string(),
  lotNumber: z.string(),
  expirationDate: z.date(),
  quantity: z.number().int().nonnegative(),
  reorderThreshold: z.number().int().nonnegative(),
  reorderQuantity: z.number().int().positive(),
  lastCountDate: z.date(),
  status: z.enum(['active', 'expired', 'recalled', 'depleted']),
  cost: z.number().nonnegative(),
  supplier: z.string(),
  receivedDate: z.date(),
  notes: z.string().optional()
});

export const MedicationOrderSchema = z.object({
  id: z.string(),
  patientId: z.string(),
  providerId: z.string(),
  medicationId: z.string(),
  status: z.enum([
    'draft', 'active', 'on-hold', 'cancelled', 'completed',
    'entered-in-error', 'stopped', 'unknown';
  ]),
  orderDate: z.date(),
  \1,\2 z.string(),
  route: z.string(),
  duration: z.string(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  indication: z.string().optional(),
  notes: z.string().optional(),
  isStatOrder: z.boolean().optional(),
  prn: z.boolean().optional(),
  prnReason: z.string().optional(),
  reconciliationId: z.string().optional()
});

// Factory functions to create domain objects with validation
export const _createMedication = (data: Medication): Medication {
  return MedicationSchema.parse(data)
export const _createMedicationInventory = (data: MedicationInventory): MedicationInventory {
  return MedicationInventorySchema.parse(data)
export const _createMedicationOrder = (data: MedicationOrder): MedicationOrder {
  return MedicationOrderSchema.parse(data)
