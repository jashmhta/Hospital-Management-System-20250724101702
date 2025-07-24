import "../../../../../lib/audit"
import "../../../../../lib/error-handler"
import "../../../../../lib/services/pharmacy/pharmacy.service"
import "../../../../../lib/validation/pharmacy-validation"
import "../../../models/domain-models"
import "../../../services/drug-interaction-service"
import "next/server"
import NextRequest
import NextResponse }
import {  auditLog  } from "@/lib/database"
import {  DrugInteractionService  } from "@/lib/database"
import {  errorHandler  } from "@/lib/database"
import {  getMedicationById  } from "@/lib/database"
import {  PharmacyDomain  } from "@/lib/database"
import {   type
import {  validateDrugDrugInteractionRequest  } from "@/lib/database"

}

/**;
 * Drug-Drug Interaction API Routes;
 *;
 * This file implements the API endpoints for checking drug-drug interactions;
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
 * POST /api/pharmacy/interactions/drug-drug;
 * Check for drug-drug interactions between specific medications;
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

} catch (error) {

} catch (error) {

    // Validate request;
    const data = await req.json();
    const validationResult = validateDrugDrugInteractionRequest(data);
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

    // Check for drug-drug interactions;
    const interactions = await interactionService.checkDrugDrugInteractions();
      data.medicationIds,
      data.includeMonographs || false;
    );

    // Audit logging;
    await auditLog("DRUG_INTERACTION", {
      action: "CHECK_DRUG_DRUG",
      userId,
      data.medicationIds,
        data.includeMonographs || false;
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
    return errorHandler(error, "Error checking drug-drug interactions");
