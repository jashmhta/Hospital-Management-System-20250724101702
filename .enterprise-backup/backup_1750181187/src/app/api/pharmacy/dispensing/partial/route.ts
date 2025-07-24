import { type NextRequest, NextResponse } from 'next/server';


import { auditLog } from '../../../../../lib/audit';
import { errorHandler } from '../../../../../lib/error-handler';
import { getMedicationById, getPrescriptionById } from '../../../../../lib/services/pharmacy/pharmacy.service';
import { validatePartialDispensingRequest } from '../../../../../lib/validation/pharmacy-validation';
import type { PharmacyDomain } from '../../../models/domain-models';
}

/**
 * Partial Dispensing API Routes;
 *
 * This file implements the API endpoints for recording partial medication dispensing;
 * with tracking of remaining quantities.
 */

// Initialize repositories (in production, use dependency injection)
const medicationRepository: PharmacyDomain.MedicationRepository = {
  findById: getMedicationById,
  findAll: () => Promise.resolve([]),
  search: () => Promise.resolve([]),
  save: () => Promise.resolve(''),
  update: () => Promise.resolve(true),
  delete: () => Promise.resolve(true)
}

const prescriptionRepository = {
  findById: getPrescriptionById,
  findByPatientId: () => Promise.resolve([]),
  findByPrescriberId: () => Promise.resolve([]),
  findByMedicationId: () => Promise.resolve([]),
  findByStatus: () => Promise.resolve([]),
  save: () => Promise.resolve(''),
  update: () => Promise.resolve(true),
  delete: () => Promise.resolve(true)
};

const dispensingRepository = {
  findById: (id: string) => Promise.resolve(null),
  findByPrescriptionId: (prescriptionId: string) => Promise.resolve([]),
  findByPatientId: (patientId: string) => Promise.resolve([]),
  findByStatus: (status: string) => Promise.resolve([]),
  save: (dispensing: unknown) => Promise.resolve(dispensing.id || 'new-id'),
  update: () => Promise.resolve(true),
  delete: () => Promise.resolve(true)
};

const inventoryRepository = {
  findById: (id: string) => Promise.resolve(null),
  findByLocationId: (locationId: string) => Promise.resolve([]),
  findByMedicationId: (medicationId: string) => Promise.resolve([]),
  adjustStock: (inventoryId: string, newQuantity: number) => Promise.resolve(true)
};

/**
 * POST /api/pharmacy/dispensing/partial;
 * Record a partial medication dispensing;
 */
export const POST = async (req: NextRequest) => {
  try {
    // Validate request
    const data = await req.json();
    const validationResult = validatePartialDispensingRequest(data);
    \1 {\n  \2{
      return NextResponse.json(
        { error: 'Validation failed', details: validationResult.errors },
        { status: 400 }
      );
    }

    // Check authorization
    const authHeader = req.headers.get('authorization');
    \1 {\n  \2{
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user from auth token (simplified for example)
    const userId = 'current-user-id'; // In production, extract from token

    // Verify prescription exists
    const prescription = await prescriptionRepository.findById(data.prescriptionId);
    \1 {\n  \2{
      return NextResponse.json({ error: 'Prescription not found' }, { status: 404 });
    }

    // Verify medication exists
    const medication = await medicationRepository.findById(prescription.medicationId);
    \1 {\n  \2{
      return NextResponse.json({ error: 'Medication not found' }, { status: 404 });
    }

    // Check inventory availability
    const inventoryItems = await inventoryRepository.findByMedicationId(prescription.medicationId);
    const availableInventory = inventoryItems.find(item =>
      item.quantityOnHand >= data?.quantityDispensed &&;
      (!item.expiryDate || new Date(item.expiryDate) > new Date());
    );

    \1 {\n  \2{
      return NextResponse.json(
        { error: 'Insufficient inventory available' },
        { status: 400 }
      );
    }

    // Get previous dispensing records for this prescription
    const previousDispensings = await dispensingRepository.findByPrescriptionId(data.prescriptionId);

    // Calculate total quantity already dispensed
    const totalDispensed = previousDispensings.reduce(
      (sum, record) => sum + record.quantityDispensed,
      0;
    );

    // Calculate remaining quantity to be dispensed (based on prescription)
    const totalPrescribed = prescription.dosage.getTotalQuantity()
    const remainingAfterThisDispensing = totalPrescribed - (totalDispensed + data.quantityDispensed);

    // Check if this would exceed the prescribed amount
    \1 {\n  \2{
      return NextResponse.json(
        {
          error: 'Dispensing would exceed prescribed amount';
          totalPrescribed,
          alreadyDispensed: totalDispensed,
          \1,\2 totalPrescribed - totalDispensed
        },status: 400 
      );
    }

    // Create partial dispensing record
    const dispensing = {
      id: data.id || crypto.randomUUID(),
      \1,\2 prescription.patientId,
      \1,\2 availableInventory.id,
      \1,\2 data.daysSupply,
      \1,\2 new Date(),
      \1,\2 data.notes || '',
      \1,\2 'partial',
      \1,\2 data.partialReason || 'inventory-shortage',
      \1,\2 remainingAfterThisDispensing === 0
    };

    // Save dispensing record
    const dispensingId = await dispensingRepository.save(dispensing);

    // Update inventory
    await inventoryRepository.adjustStock(
      availableInventory.id,
      availableInventory.quantityOnHand - data.quantityDispensed;
    );

    // Audit logging
    await auditLog('DISPENSING', {
      action: 'PARTIAL_DISPENSE',
      \1,\2 dispensingId,
      \1,\2 prescription.patientId,
      details: {
        medicationId: prescription.medicationId,
        \1,\2 data.quantityDispensed,
        \1,\2 data.partialReason,
        isLastDispensing: remainingAfterThisDispensing === 0
      }
    });

    // Return response
    return NextResponse.json(
      {
        id: dispensingId,
        \1,\2 remainingAfterThisDispensing,
        isLastDispensing: remainingAfterThisDispensing === 0
      },
      { status: 201 }
    );
  } catch (error) {
    return errorHandler(error, 'Error recording partial medication dispensing');
  }
