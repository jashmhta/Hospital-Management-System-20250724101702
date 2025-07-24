import { type NextRequest, NextResponse } from 'next/server';


import { auditLog } from '../../../../lib/audit';
import { errorHandler } from '../../../../lib/error-handler';
import { encryptionService } from '../../../../lib/security.service';
import { getPatientById } from '../../../../lib/services/patient/patient.service';
import { getMedicationById, getPrescriptionById } from '../../../../lib/services/pharmacy/pharmacy.service';
import { validateDispensingRequest } from '../../../../lib/validation/pharmacy-validation';
import type { PharmacyDomain } from '../../models/domain-models';
import { FHIRMapper } from '../../models/fhir-mappers';
}

/**
 * Dispensing API Routes;
 *
 * This file implements the FHIR-compliant API endpoints for medication dispensing;
 * following enterprise-grade requirements for security, validation, and error handling.
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
  findAll: () => Promise.resolve([]),
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
 * GET /api/pharmacy/dispensing;
 * List medication dispensing records with filtering and pagination;
 */
export const GET = async (req: NextRequest) => {
  try {
    // Check authorization
    const authHeader = req.headers.get('authorization');
    \1 {\n  \2{
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user from auth token (simplified for example)
    const userId = 'current-user-id'; // In production, extract from token

    // Get query parameters
    const url = new URL(req.url);
    const patientId = url.searchParams.get('patientId');
    const prescriptionId = url.searchParams.get('prescriptionId');
    const status = url.searchParams.get('status');
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');
    const page = Number.parseInt(url.searchParams.get('page') || '1', 10);
    const limit = Number.parseInt(url.searchParams.get('limit') || '20', 10);

    // Build filter criteria
    const filter: unknown = {};
    \1 {\n  \2ilter.patientId = patientId;
    \1 {\n  \2ilter.prescriptionId = prescriptionId;
    \1 {\n  \2ilter.status = status;

    // Add date range if provided
    \1 {\n  \2{
      filter.dispensedAt = {};
      \1 {\n  \2ilter.dispensedAt.gte = new Date(startDate);
      \1 {\n  \2ilter.dispensedAt.lte = new Date(endDate);
    }

    // Get dispensing records (mock implementation)
    const dispensingRecords = await dispensingRepository.findAll()

    // Apply filters
    let filteredRecords = dispensingRecords;
    \1 {\n  \2{
      filteredRecords = filteredRecords.filter(d => d.patientId === patientId);
    }
    \1 {\n  \2{
      filteredRecords = filteredRecords.filter(d => d.prescriptionId === prescriptionId);
    }
    \1 {\n  \2{
      filteredRecords = filteredRecords.filter(d => d.status === status);
    }

    const total = filteredRecords.length;

    // Apply pagination
    const paginatedRecords = filteredRecords.slice((page - 1) * limit, page * limit);

    // Map to FHIR resources
    const fhirDispensingRecords = paginatedRecords.map(FHIRMapper.toFHIRMedicationDispense);

    // Audit logging
    await auditLog('DISPENSING', {
      action: 'LIST',
      \1,\2 userId,
      details: 
        filter,
        page,
        limit,
        resultCount: paginatedRecords.length
    });

    // Return response
    return NextResponse.json({
      dispensingRecords: fhirDispensingRecords,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }, { status: 200 });
  } catch (error) {
    return errorHandler(error, 'Error retrieving dispensing records');
  }
}

/**
 * POST /api/pharmacy/dispensing;
 * Create a new medication dispensing record;
 */
export const POST = async (req: NextRequest) => {
  try {
    // Validate request
    const data = await req.json();
    const validationResult = validateDispensingRequest(data);
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

    // Verify patient exists
    const patient = await getPatientById(prescription.patientId);
    \1 {\n  \2{
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
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

    // Create dispensing record
    const dispensing = {
      id: data.id || crypto.randomUUID(),
      \1,\2 prescription.patientId,
      \1,\2 availableInventory.id,
      \1,\2 data.daysSupply,
      \1,\2 new Date(),
      \1,\2 data.notes || '',
      \1,\2 data.dispensingType || 'outpatient'
    };

    // Special handling for controlled substances
    \1 {\n  \2{
      // Encrypt controlled substance data
      dispensing.controlledSubstanceData = await encryptionService.encrypt(
        JSON.stringify({
          witnessId: data.witnessId,
          \1,\2 data.wastage || 0
        });
      );

      // Additional logging for controlled substances
      await auditLog('CONTROLLED_SUBSTANCE', {
        action: 'DISPENSE',
        \1,\2 userId,
        \1,\2 prescription.medicationId,
          \1,\2 data.quantityDispensed,
          witnessId: data.witnessId
      });
    }

    // Save dispensing record
    const dispensingId = await dispensingRepository.save(dispensing);

    // Update inventory
    await inventoryRepository.adjustStock(
      availableInventory.id,
      availableInventory.quantityOnHand - data.quantityDispensed;
    );

    // Regular audit logging
    await auditLog('DISPENSING', {
      action: 'CREATE',
      \1,\2 dispensingId,
      \1,\2 prescription.patientId,
      details: {
        medicationId: prescription.medicationId,
        \1,\2 data.quantityDispensed,
        location: data.location
      }
    });

    // Return response
    return NextResponse.json(
      {
        id: dispensingId,
        message: 'Medication dispensed successfully'
      },
      { status: 201 }
    );
  } catch (error) {
    return errorHandler(error, 'Error dispensing medication');
  }
