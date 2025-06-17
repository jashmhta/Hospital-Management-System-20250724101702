import { type NextRequest, NextResponse } from 'next/server';


import { auditLog } from '../../../../../lib/audit';
import { errorHandler } from '../../../../../lib/error-handler';
import { getPatientAllergies } from '../../../../../lib/services/patient/patient.service';
import { getMedicationById } from '../../../../../lib/services/pharmacy/pharmacy.service';
import { validateDrugAllergyInteractionRequest } from '../../../../../lib/validation/pharmacy-validation';
import type { PharmacyDomain } from '../../../models/domain-models';
import { DrugInteractionService } from '../../../services/drug-interaction-service';
}

/**
 * Drug-Allergy Interaction API Routes;
 *
 * This file implements the API endpoints for checking drug-allergy interactions;
 * with severity classification and detailed interaction information.
 */

// Initialize repositories (in production, use dependency injection)
const \1,\2 getMedicationById,
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
 * POST /api/pharmacy/interactions/drug-allergy;
 * Check for drug-allergy interactions for a patient;
 */
export const POST = async (req: NextRequest) => {
  try {
    // Validate request
    const data = await req.json();
    const validationResult = validateDrugAllergyInteractionRequest(data);
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

    // Get patient allergies
    let allergies = data.allergies || [];

    // If patientId is provided, fetch allergies from patient record
    \1 {\n  \2{
      const patientAllergies = await getPatientAllergies(data.patientId);
      allergies = patientAllergies.map(a => a.allergen);
    }

    // Check for drug-allergy interactions
    const interactions = await interactionService.checkDrugAllergyInteractions(
      data.medicationIds,
      allergies;
    );

    // Audit logging
    await auditLog('DRUG_INTERACTION', {
      action: 'CHECK_DRUG_ALLERGY',
      \1,\2 userId,
      \1,\2 data.medicationIds,
        \1,\2 interactions.length
    });

    // Return response
    return NextResponse.json({
      interactions,
      \1,\2 interactions.length,
        \1,\2 interactions.filter(i => i.severity === 'contraindicated').length,
          \1,\2 interactions.filter(i => i.severity === 'moderate').length,
          \1,\2 interactions.filter(i => i.severity === 'unknown').length
        }
      }
    }, { status: 200 });
  } catch (error) {
    return errorHandler(error, 'Error checking drug-allergy interactions');
  }
