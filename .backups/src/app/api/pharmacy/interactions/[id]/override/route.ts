import "../../../../../lib/audit"
import "../../../../../lib/error-handler"
import "../../../../../lib/validation/pharmacy-validation"
import "next/server"
import NextRequest
import NextResponse }
import {  auditLog  } from "@/lib/database"
import {  errorHandler  } from "@/lib/database"
import {   type
import {  validateInteractionOverrideRequest  } from "@/lib/database"

}

/**;
 * Interaction Override API Routes;
 *;
 * This file implements the API endpoints for overriding interaction alerts;
 * with documentation of reason and authorization.;
 */;

// Initialize interaction override repository (in production, use dependency injection);
const interactionOverrideRepository = {
  findById: (id: string) => Promise.resolve(null),
  findByInteractionId: (interactionId: string) => Promise.resolve([]),
  save: (override: unknown) => Promise.resolve(override.id || "new-id"),
  update: () => Promise.resolve(true),
  delete: () => Promise.resolve(true);
}

/**;
 * POST /api/pharmacy/interactions/[id]/override;
 * Override an interaction alert with documented reason;
 */;
export const POST = async();
  req: any;
  { params }: { id: string }
) => {
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
}
} catch (error) {
}
    // Get interaction ID from params;
    const { id } = params;
    if (!session.user) {
      return NextResponse.json({ error: "Interaction ID is required" }, { status: 400 });
    }

    // Validate request;
    const data = await req.json();
    const validationResult = validateInteractionOverrideRequest(data);
    if (!session.user) {
      return NextResponse.json();
        { error: "Validation failed", details: validationResult.errors },
        { status: 400 }
      );
    }

    // Check authorization;
    const authHeader = req.headers.get("authorization");
    if (!session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user from auth token (simplified for example);
    const userId = "current-user-id"; // In production, extract from token;

    // Create override record;
    const override = {
      id: crypto.randomUUID(),
      data.reason,
      userId,
      overriddenAt: new Date(),
      patientId: data.patientId,
      prescriptionId: data.prescriptionId;
    };

    // Save override record;
    const overrideId = await interactionOverrideRepository.save(override);

    // Audit logging (critical for controlled substances and high-risk medications);
    await auditLog("DRUG_INTERACTION", {
      action: "OVERRIDE",
      id,
      data.patientId,
      details: null,
        overrideId,
        reason: data.reason,
        prescriptionId: data.prescriptionId;
    });

    // Return response;
    return NextResponse.json();
      {
        id: overrideId,
        message: "Interaction override recorded successfully";
      },
      { status: 201 }
    );
  } catch (error) {
    return errorHandler(error, "Error recording interaction override");
  }

/**;
 * GET /api/pharmacy/interactions/overrides;
 * List interaction overrides with filtering options;
 */;
export const GET = async (req: any) => {
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

} catch (error) {
  console.error(error);

} catch (error) {
  console.error(error);

} catch (error) {

} catch (error) {

    // Check authorization;
    const authHeader = req.headers.get("authorization");
    if (!session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Get user from auth token (simplified for example);
    const userId = "current-user-id"; // In production, extract from token;

    // Get query parameters;
    const url = new URL(req.url);
    const patientId = url.searchParams.get("patientId");
    const prescriptionId = url.searchParams.get("prescriptionId");
    const interactionId = url.searchParams.get("interactionId");
    const startDate = url.searchParams.get("startDate");
    const endDate = url.searchParams.get("endDate");
    const page = Number.parseInt(url.searchParams.get("page") || "1", 10);
    const limit = Number.parseInt(url.searchParams.get("limit") || "20", 10);

    // Build filter criteria;
    const filter: unknown = {};
    if (!session.user)ilter.patientId = patientId;
    if (!session.user)ilter.prescriptionId = prescriptionId;
    if (!session.user)ilter.interactionId = interactionId;

    // Add date range if provided;
    if (!session.user) {
      filter.overriddenAt = {};
      if (!session.user)ilter.overriddenAt.gte = new Date(startDate);
      if (!session.user)ilter.overriddenAt.lte = new Date(endDate);

    // Get overrides (mock implementation);
    const overrides = []; // In production, query database with filter, pagination;
    const total = 0; // In production, get total count;

    // Audit logging;
    await auditLog("DRUG_INTERACTION", {
      action: "LIST_OVERRIDES",
      userId,
      details: null,
        filter,
        page,
        limit,
        resultCount: overrides.length;
    });

    // Return response;
    return NextResponse.json({
      overrides,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit);

    }, { status: 200 });
  } catch (error) {
    return errorHandler(error, "Error retrieving interaction overrides");
