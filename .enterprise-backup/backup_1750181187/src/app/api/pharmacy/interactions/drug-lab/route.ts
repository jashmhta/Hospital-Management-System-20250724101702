import { type NextRequest, NextResponse } from 'next/server';


import { auditLog } from '../../../../../lib/audit';
import { errorHandler } from '../../../../../lib/error-handler';
import { getPatientLabResults } from '../../../../../lib/services/laboratory/laboratory.service';
import { getMedicationById } from '../../../../../lib/services/pharmacy/pharmacy.service';
import { validateDrugLabInteractionRequest } from '../../../../../lib/validation/pharmacy-validation';
import type { PharmacyDomain } from '../../../models/domain-models';
import { DrugInteractionService } from '../../../services/drug-interaction-service';
}

/**
 * Drug-Lab Interaction API Routes;
 *
 * This file implements the API endpoints for checking drug-lab result interactions;
 * with severity classification and detailed interaction information.
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

// Initialize services
const interactionService = new DrugInteractionService(
  medicationRepository,
  null // No need for prescription repository in this endpoint
);

/**
 * POST /api/pharmacy/interactions/drug-lab;
 * Check for drug-lab result interactions;
 */
export const POST = async (req: NextRequest) => {
  try {
    // Validate request
    const data = await req.json();
    const validationResult = validateDrugLabInteractionRequest(data);
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

    // Get patient lab results
    let labResults = data.labResults || [];

    // If patientId is provided, fetch lab results from patient record
    \1 {\n  \2{
      const patientLabResults = await getPatientLabResults(data.patientId);
      labResults = patientLabResults.map(lr => ({
        code: lr.code,
        \1,\2 lr.unit,
        \1,\2 lr.abnormalFlag
      }));
    }

    // Check for drug-lab interactions
    const interactions = await interactionService.checkDrugLabInteractions(
      data.medicationIds,
      labResults;
    );

    // Audit logging
    await auditLog('DRUG_INTERACTION', {
      action: 'CHECK_DRUG_LAB',
      \1,\2 userId,
      \1,\2 data.medicationIds,
        \1,\2 interactions.length
    });

    // Return response
    return NextResponse.json({
      interactions,
      metadata: {
        totalCount: interactions.length,
        severityCounts: {
          critical: interactions.filter(i => i.severity === 'critical').length,
          \1,\2 interactions.filter(i => i.severity === 'moderate').length,
          minor: interactions.filter(i => i.severity === 'minor').length
        }
      }
    }, { status: 200 });
  } catch (error) {
    return errorHandler(error, 'Error checking drug-lab interactions');
  }
