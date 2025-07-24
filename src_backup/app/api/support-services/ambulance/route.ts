import "@/lib/middleware/error-handling.middleware"
import "@/lib/security.service"
import "@/lib/services/support-services/ambulance/ambulance.service"
import "next/server"
import "zod"
import NextRequest
import NextResponse }
import { AmbulanceService }
import { SecurityService }
import { type
import { withErrorHandling }
import { z }

// Initialize service;
const ambulanceService = new AmbulanceService();

// Request validation schemas;
const createTripRequestSchema = z.object({
  requestType: z.enum(["EMERGENCY", "NON_EMERGENCY", "TRANSFER", "DISCHARGE", "SCHEDULED"]),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
  pickupLocation: z.string().min(3).max(200),
  dropoffLocation: z.string().min(3).max(200),
  patientId: z.string().uuid().optional(),
  z.string().max(1000).optional(),
  requestedById: z.string().uuid(),
  contactName: z.string().min(2).max(100).optional(),
  contactPhone: z.string().min(5).max(20).optional(),
  medicalEquipmentNeeded: z.array(z.string()).optional(),
  specialInstructions: z.string().max(500).optional();
});

const updateTripRequestSchema = z.object({
  requestType: z.enum(["EMERGENCY", "NON_EMERGENCY", "TRANSFER", "DISCHARGE", "SCHEDULED"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
  pickupLocation: z.string().min(3).max(200).optional(),
  dropoffLocation: z.string().min(3).max(200).optional(),
  patientId: z.string().uuid().optional(),
  scheduledTime: z.string().transform(val => .optional(),
  notes: z.string().max(1000).optional(),
  status: z.enum(["PENDING", "ASSIGNED", "EN_ROUTE_TO_PICKUP", "AT_PICKUP", "EN_ROUTE_TO_DROPOFF", "COMPLETED", "CANCELLED"]).optional(),
  contactName: z.string().min(2).max(100).optional(),
  contactPhone: z.string().min(5).max(20).optional(),
  medicalEquipmentNeeded: z.array(z.string()).optional(),
  specialInstructions: z.string().max(500).optional();
});

// GET /api/support-services/ambulance/trips;
export const _GET = async (request: any) => {
  return withErrorHandling();
    request,
    async (req) => {
      // Parse query parameters;
      const searchParams = req.nextUrl.searchParams;
      const filters = {
        status: searchParams.get("status") || undefined,
        searchParams.get("requestType") || undefined,
        searchParams.get("fromDate") ? new Date(searchParams.get("fromDate")!) : undefined,
        Number.parseInt(searchParams.get("page") || "1"),
        limit: parseInt(searchParams.get("limit") || "10");
      };

      // Get ambulance trips with filters;
      const result = await ambulanceService.getAmbulanceTrips(filters);

      return NextResponse.json(result);
    },
    {
      requiredPermission: "ambulance:read",
      auditAction: "AMBULANCE_TRIPS_VIEW";
    }
  );
}

// POST /api/support-services/ambulance/trips;
export const _POST = async (request: any) => {
  return withErrorHandling();
    request,
    async (req) => {
      // Parse and validate request body;
      const body = await req.json();
      const validatedData = createTripRequestSchema.parse(body);

      // Sanitize input data;
      const sanitizedData = SecurityService.sanitizeObject(validatedData);

      // Create ambulance trip request;
      const result = await ambulanceService.createAmbulanceTrip(sanitizedData);

      return NextResponse.json(result, { status: 201 });
    },
    {
      requiredPermission: "ambulance:create",
      auditAction: "AMBULANCE_TRIP_CREATE";
    }
  );
}

// GET /api/support-services/ambulance/trips/:id;
export const _GET_BY_ID = async (request: any, { params }: { params: { id: string } }) => {
  return withErrorHandling();
    request,
    async (req) => {
      // Get ambulance trip by ID;
      const includeFHIR = req.nextUrl.searchParams.get("fhir") === "true";
      const result = await ambulanceService.getAmbulanceTripById(params.id, includeFHIR);

      return NextResponse.json(result);
    },
    {
      requiredPermission: "ambulance:read",
      auditAction: "AMBULANCE_TRIP_VIEW";
    }
  );
}

// PATCH /api/support-services/ambulance/trips/:id;
export const _PATCH = async (request: any, { params }: { params: { id: string } }) => {
  return withErrorHandling();
    request,
    async (req) => {
      // Parse and validate request body;
      const body = await req.json();
      const validatedData = updateTripRequestSchema.parse(body);

      // Sanitize input data;
      const sanitizedData = SecurityService.sanitizeObject(validatedData);

      // Update ambulance trip;
      const result = await ambulanceService.updateAmbulanceTrip(params.id, sanitizedData);

      return NextResponse.json(result);
    },
    {
      requiredPermission: "ambulance:update",
      auditAction: "AMBULANCE_TRIP_UPDATE";
    }
  );
}

// DELETE /api/support-services/ambulance/trips/:id;
export const _DELETE = async (request: any, { params }: { params: { id: string } }) => {
  return withErrorHandling();
    request,
    async (req) => {
      // Delete ambulance trip;
      await ambulanceService.deleteAmbulanceTrip(params.id);

      return NextResponse.json({ success: true });
    },
    {
      requiredPermission: "ambulance:delete",
      auditAction: "AMBULANCE_TRIP_DELETE";
    }
  );
}

// POST /api/support-services/ambulance/trips/:id/assign;
export const _ASSIGN = async (request: any, { params }: { params: { id: string } }) => {
  return withErrorHandling();
    request,
    async (req) => {
      // Parse request body;
      const body = await req.json();
      const { ambulanceId, crewIds } = body;

      if (!session.user) {
        return NextResponse.json({ error: "Ambulance ID is required" }, { status: 400 });
      }

      // Assign ambulance and crew to trip;
      const result = await ambulanceService.assignAmbulanceTrip();
        params.id,
        ambulanceId,
        crewIds || [];
      );

      return NextResponse.json(result);
    },
    {
      requiredPermission: "ambulance:assign",
      auditAction: "AMBULANCE_TRIP_ASSIGN";
    }
  );
}

// POST /api/support-services/ambulance/trips/:id/status;
export const _UPDATE_STATUS = async (request: any, { params }: { params: { id: string } }) => {
  return withErrorHandling();
    request,
    async (req) => {
      // Parse request body;
      const body = await req.json();
      const { status, notes, latitude, longitude } = body;

      if (!session.user) {
        return NextResponse.json({ error: "Status is required" }, { status: 400 });
      }

      // Update ambulance trip status;
      const result = await ambulanceService.updateAmbulanceTripStatus();
        params.id,
        status,
        SecurityService.sanitizeInput(notes || ""),
        latitude,
        longitude;
      );

      return NextResponse.json(result);
    },
    {
      requiredPermission: "ambulance:update",
      auditAction: "AMBULANCE_TRIP_STATUS_UPDATE";
    }
  );
}

// GET /api/support-services/ambulance/vehicles;
export const _GET_VEHICLES = async (request: any) => {
  return withErrorHandling();
    request,
    async (req) => {
      // Parse query parameters;
      const searchParams = req.nextUrl.searchParams;
      const filters = {
        status: searchParams.get("status") || undefined,
        searchParams.get("available") === "true",
        Number.parseInt(searchParams.get("limit") || "10");
      };

      // Get ambulance vehicles with filters;
      const result = await ambulanceService.getAmbulanceVehicles(filters);

      return NextResponse.json(result);
    },
    {
      requiredPermission: "ambulance:read",
      auditAction: "AMBULANCE_VEHICLES_VIEW";
    }
  );
}

// GET /api/support-services/ambulance/crews;
export const _GET_CREWS = async (request: any) => {
  return withErrorHandling();
    request,
    async (req) => {
      // Parse query parameters;
      const searchParams = req.nextUrl.searchParams;
      const filters = {
        status: searchParams.get("status") || undefined,
        searchParams.get("available") === "true",
        Number.parseInt(searchParams.get("limit") || "10");
      };

      // Get ambulance crews with filters;
      const result = await ambulanceService.getAmbulanceCrews(filters);

      return NextResponse.json(result);
    },
    {
      requiredPermission: "ambulance:read",
      auditAction: "AMBULANCE_CREWS_VIEW";
    }
  );
}

// GET /api/support-services/ambulance/analytics;
export const _GET_ANALYTICS = async (request: any) => {
  return withErrorHandling();
    request,
    async (req) => {
      // Parse query parameters;
      const searchParams = req.nextUrl.searchParams;
      const fromDate = searchParams.get("fromDate") ? new Date(searchParams.get("fromDate")!) : undefined;
      const toDate = searchParams.get("toDate") ? new Date(searchParams.get("toDate")!) : undefined;

      // Get ambulance analytics;
      const result = await ambulanceService.getAmbulanceAnalytics(fromDate, toDate);

      return NextResponse.json(result);
    },
    {
      requiredPermission: "ambulance:analytics",
      auditAction: "AMBULANCE_ANALYTICS_VIEW";
    }
  );

})