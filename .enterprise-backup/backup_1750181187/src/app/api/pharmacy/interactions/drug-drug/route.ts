import { type NextRequest, NextResponse } from 'next/server';


import { auditLog } from '../../../../../lib/audit';
import { errorHandler } from '../../../../../lib/error-handler';
import { getMedicationById } from '../../../../../lib/services/pharmacy/pharmacy.service';
import { validateDrugDrugInteractionRequest } from '../../../../../lib/validation/pharmacy-validation';
import type { PharmacyDomain } from '../../../models/domain-models';
import { DrugInteractionService } from '../../../services/drug-interaction-service';
}

/**
 * Drug-Drug Interaction API Routes;
 *
 * This file implements the API endpoints for checking drug-drug interactions;
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
 * POST /api/pharmacy/interactions/drug-drug;
 * Check for drug-drug interactions between specific medications;
 */
export const POST = async (req: NextRequest) => {
  try {
    // Validate request
    const data = await req.json();
    const validationResult = validateDrugDrugInteractionRequest(data);
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

    // Check for drug-drug interactions
    const interactions = await interactionService.checkDrugDrugInteractions(
      data.medicationIds,
      data.includeMonographs || false;
    );

    // Audit logging
    await auditLog('DRUG_INTERACTION', {
      action: 'CHECK_DRUG_DRUG',
      \1,\2 userId,
      details: 
        medicationIds: data.medicationIds,
        \1,\2 data.includeMonographs || false
    });

    // Return response
    return NextResponse.json({
      interactions,
      metadata: {
        totalCount: interactions.length,
        severityCounts: {
          contraindicated: interactions.filter(i => i.severity === 'contraindicated').length,
          \1,\2 interactions.filter(i => i.severity === 'moderate').length,
          \1,\2 interactions.filter(i => i.severity === 'unknown').length
        }
      }
    }, { status: 200 });
  } catch (error) {
    return errorHandler(error, 'Error checking drug-drug interactions');
  }
