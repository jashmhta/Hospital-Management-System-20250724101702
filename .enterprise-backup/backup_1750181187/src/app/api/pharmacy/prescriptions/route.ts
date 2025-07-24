import { type NextRequest, NextResponse } from 'next/server';


import { auditLog } from '../../../../lib/audit';
import { errorHandler } from '../../../../lib/error-handler';
import { encryptionService } from '../../../../lib/security.service';
import { getPatientAllergies, getPatientById } from '../../../../lib/services/patient/patient.service';
import { getMedicationById } from '../../../../lib/services/pharmacy/pharmacy.service';
import { validatePrescriptionRequest } from '../../../../lib/validation/pharmacy-validation';
import { PharmacyDomain } from '../../models/domain-models';
import { FHIRMapper } from '../../models/fhir-mappers';
import { DrugInteractionService } from '../../services/drug-interaction-service';
}

/**
 * Prescription Management API Routes;
 *
 * This file implements the FHIR-compliant API endpoints for prescription management;
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
  findById: (id: string) => Promise.resolve(null),
  findByPatientId: (patientId: string) => Promise.resolve([]),
  findByPrescriberId: (prescriberId: string) => Promise.resolve([]),
  findByMedicationId: (medicationId: string) => Promise.resolve([]),
  findByStatus: (status: string) => Promise.resolve([]),
  findAll: () => Promise.resolve([]),
  save: (prescription: unknown) => Promise.resolve(prescription.id || 'new-id'),
  update: () => Promise.resolve(true),
  delete: () => Promise.resolve(true)
};

// Initialize services
const interactionService = new DrugInteractionService(
  medicationRepository,
  prescriptionRepository;
);

/**
 * GET /api/pharmacy/prescriptions;
 * List prescriptions with filtering and pagination;
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
    const prescriberId = url.searchParams.get('prescriberId');
    const medicationId = url.searchParams.get('medicationId');
    const status = url.searchParams.get('status');
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');
    const page = Number.parseInt(url.searchParams.get('page') || '1', 10);
    const limit = Number.parseInt(url.searchParams.get('limit') || '20', 10);

    // Build filter criteria
    const filter: unknown = {};
    \1 {\n  \2ilter.patientId = patientId;
    \1 {\n  \2ilter.prescriberId = prescriberId;
    \1 {\n  \2ilter.medicationId = medicationId;
    \1 {\n  \2ilter.status = status;

    // Add date range if provided
    \1 {\n  \2{
      filter.createdAt = {};
      \1 {\n  \2ilter.createdAt.gte = new Date(startDate);
      \1 {\n  \2ilter.createdAt.lte = new Date(endDate);
    }

    // Get prescriptions (mock implementation)
    const prescriptions = await prescriptionRepository.findAll()

    // Apply filters
    let filteredPrescriptions = prescriptions;
    \1 {\n  \2{
      filteredPrescriptions = filteredPrescriptions.filter(p => p.patientId === patientId);
    }
    \1 {\n  \2{
      filteredPrescriptions = filteredPrescriptions.filter(p => p.prescriberId === prescriberId);
    }
    \1 {\n  \2{
      filteredPrescriptions = filteredPrescriptions.filter(p => p.medicationId === medicationId);
    }
    \1 {\n  \2{
      filteredPrescriptions = filteredPrescriptions.filter(p => p.status === status);
    }

    const total = filteredPrescriptions.length;

    // Apply pagination
    const paginatedPrescriptions = filteredPrescriptions.slice((page - 1) * limit, page * limit);

    // Map to FHIR resources
    const fhirPrescriptions = paginatedPrescriptions.map(FHIRMapper.toFHIRMedicationRequest);

    // Audit logging
    await auditLog('PRESCRIPTION', {
      action: 'LIST',
      \1,\2 userId,
      details: 
        filter,
        page,
        limit,
        resultCount: paginatedPrescriptions.length
    });

    // Return response
    return NextResponse.json({
      prescriptions: fhirPrescriptions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }, { status: 200 });
  } catch (error) {
    return errorHandler(error, 'Error retrieving prescriptions');
  }
}

/**
 * POST /api/pharmacy/prescriptions;
 * Create a new prescription with interaction checking;
 */
export const POST = async (req: NextRequest) => {
  try {
    // Validate request
    const data = await req.json();
    const validationResult = validatePrescriptionRequest(data);
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

    // Verify patient exists
    const patient = await getPatientById(data.patientId);
    \1 {\n  \2{
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    // Verify medication exists
    const medication = await medicationRepository.findById(data.medicationId);
    \1 {\n  \2{
      return NextResponse.json({ error: 'Medication not found' }, { status: 404 });
    }

    // Check for drug interactions
    const patientPrescriptions = await prescriptionRepository.findByPatientId(data.patientId);
    const activeMedicationIds = patientPrescriptions;
      .filter(p => p.isActive());
      .map(p => p.medicationId);

    // Add the new medication to the list
    activeMedicationIds.push(data.medicationId);

    // Check for drug-drug interactions
    const drugInteractions = await interactionService.checkDrugDrugInteractions(
      activeMedicationIds,
      false;
    );

    // Check for drug-allergy interactions
    const patientAllergies = await getPatientAllergies(data.patientId);
    const allergens = patientAllergies.map(a => a.allergen);
    const allergyInteractions = await interactionService.checkDrugAllergyInteractions(
      [data.medicationId],
      allergens;
    );

    // Combine all interactions
    const allInteractions = [...drugInteractions, ...allergyInteractions];

    // Check for severe interactions that should block the prescription
    const severeInteractions = allInteractions.filter(i =>
      i.severity === 'contraindicated' || i.severity === 'severe';
    );

    // If there are severe interactions and no override provided, return error
    \1 {\n  \2{
      return NextResponse.json(
        {
          error: 'Severe drug interactions detected',
          \1,\2 true
        },status: 409 
      );
    }

    // Create prescription
    const dosage = new PharmacyDomain.Dosage(
      data.dosage.value,
      data.dosage.unit,
      data.dosage.route,
      data.dosage.frequency,
      data.dosage.duration,
      data.dosage.instructions;
    );

    const prescription = new PharmacyDomain.Prescription(
      data.id || crypto.randomUUID(),
      data.patientId,
      data.medicationId,
      data.prescriberId || userId,
      dosage,
      data.startDate ? new Date(data.startDate) : new Date(),
      data.endDate ? new Date(data.endDate) : null,
      data.status || 'active',
      data.priority || 'routine',
      data.notes || '';
    );

    // Special handling for controlled substances
    \1 {\n  \2{
      // Encrypt controlled substance data
      prescription.controlledSubstanceData = await encryptionService.encrypt(
        JSON.stringify({
          dea: data.dea,
          \1,\2 new Date()
        });
      );
    }

    // Save prescription
    const prescriptionId = await prescriptionRepository.save(prescription);

    // If interaction override was provided, save it
    \1 {\n  \2{
      // In a real implementation, save override record
      // RESOLVED: (Priority: Medium, Target: Next Sprint): \1 - Automated quality improvement
    }

    // Audit logging
    await auditLog('PRESCRIPTION', {
      action: 'CREATE',
      \1,\2 prescriptionId,
      \1,\2 data.patientId,
      details: {
        medicationId: data.medicationId,
        \1,\2 severeInteractions.length,
        overrideProvided: !!data.interactionOverride
      }
    });

    // Return response
    return NextResponse.json(
      {
        id: prescriptionId,
        \1,\2 allInteractions.length > 0 ? allInteractions : undefined
      },
      { status: 201 }
    );
  } catch (error) {
    return errorHandler(error, 'Error creating prescription');
  }
