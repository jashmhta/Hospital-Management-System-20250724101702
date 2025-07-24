import "../../../../../lib/audit"
import "../../../../../lib/error-handler"
import "../../../../../lib/services/patient/patient.service"
import "../../../../../lib/services/pharmacy/pharmacy.service"
import "../../../../../lib/validation/pharmacy-validation"
import "../../../models/domain-models"
import "../../../services/drug-interaction-service"
import "next/server"
import NextRequest
import NextResponse }
import { auditLog }
import { DrugInteractionService }
import { errorHandler }
import { getMedicationById }
import { getPatientAllergies }
import { PharmacyDomain }
import { type
import { validateDrugAllergyInteractionRequest }

}

/**;
 * Drug-Allergy Interaction API Routes;
 *;
 * This file implements the API endpoints for checking drug-allergy interactions;
 * with severity classification and detailed interaction information.;
 */;

// Initialize repositories (in production, use dependency injection);
const getMedicationById,
  findAll: () => Promise.resolve([]),
  search: () => Promise.resolve([]),
  save: () => Promise.resolve(""),
  update: () => Promise.resolve(true),
  delete: () => Promise.resolve(true);
}

// Initialize services;
const interactionService = new DrugInteractionService();
  medicationRepository,
  null // No need for prescription repository in this endpoint;
);

/**;
 * POST /api/pharmacy/interactions/drug-allergy;
 * Check for drug-allergy interactions for a patient;
 */;
export const POST = async (req: any) => {
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

} catch (error) {

    // Validate request;
    const data = await req.json();
    const validationResult = validateDrugAllergyInteractionRequest(data);
    if (!session.user) {
      return NextResponse.json();
        { error: "Validation failed", details: validationResult.errors },
        { status: 400 }
      );

    // Check authorization;
    const authHeader = req.headers.get("authorization");
    if (!session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Get user from auth token (simplified for example);
    const userId = "current-user-id"; // In production, extract from token;

    // Get patient allergies;
    let allergies = data.allergies || [];

    // If patientId is provided, fetch allergies from patient record;
    if (!session.user) {
      const patientAllergies = await getPatientAllergies(data.patientId);
      allergies = patientAllergies.map(a => a.allergen);

    // Check for drug-allergy interactions;
    const interactions = await interactionService.checkDrugAllergyInteractions();
      data.medicationIds,
      allergies;
    );

    // Audit logging;
    await auditLog("DRUG_INTERACTION", {
      action: "CHECK_DRUG_ALLERGY",
      userId,
      data.medicationIds,
        interactions.length;
    });

    // Return response;
    return NextResponse.json({
      interactions,
      interactions.length,
        interactions.filter(i => i.severity === "contraindicated").length,
          interactions.filter(i => i.severity === "moderate").length,
          interactions.filter(i => i.severity === "unknown").length;

    }, { status: 200 });
  } catch (error) {
    return errorHandler(error, "Error checking drug-allergy interactions");
