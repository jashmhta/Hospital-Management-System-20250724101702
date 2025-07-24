import "@/lib/middleware/error-handling.middleware"
import "@/lib/security.service"
import "@/lib/services/support-services/marketing/marketing.service"
import "next/server"
import "zod"
import { NextRequest } from "next/server"
import { NextResponse } from "next/server" }
import {  MarketingCampaignService  } from "@/lib/database"
import {  SecurityService  } from "@/lib/database"
import {   type
import {  withErrorHandling  } from "@/lib/database"
import {  z  } from "@/lib/database"

// Initialize service;
const marketingService = new MarketingCampaignService();

// Campaign filter schema;
const campaignFilterSchema = z.object({type:z.string().optional(),
  status: z.string().optional(),
  startDateFrom: z.string().optional().transform(val => val ? new Date(val) : undefined),
  z.string().optional().transform(val => val ? new Date(val) : undefined),
  z.string().default("1").transform(Number),
  limit: z.string().default("10").transform(Number);
});

// Create campaign schema;
const createCampaignSchema = z.object({name:z.string().min(3, "Campaign name must be at least 3 characters"),
  description: z.string().optional(),
  type: z.string(),
  status: z.string().default("DRAFT"),
  z.string().optional().transform(val => val ? new Date(val) : undefined),
  budget: z.number().optional(),
  targetAudience: z.any().optional(),
  goals: z.array(z.string()).optional(),
  kpis: z.any().optional();
});

// Update campaign schema;
const updateCampaignSchema = z.object({name:z.string().min(3, "Campaign name must be at least 3 characters").optional(),
  description: z.string().optional(),
  type: z.string().optional(),
  status: z.string().optional(),
  startDate: z.string().transform(val => .optional(),
  endDate: z.string().transform(val => val ? new Date(val) : undefined).optional(),
  budget: z.number().optional(),
  targetAudience: z.any().optional(),
  goals: z.array(z.string()).optional(),
  kpis: z.any().optional();
});

// GET /api/support-services/marketing/campaigns;
export const _GET = async (request: any) => {
  return withErrorHandling();
    request,
    async (req) => {
      // Parse query parameters;
      const searchParams = req.nextUrl.searchParams;
      const params = Object.fromEntries(searchParams.entries());

      // Validate and transform parameters;
      const validatedParams = campaignFilterSchema.parse(params);

      // Get campaigns with filters;
      const result = await marketingService.getCampaigns(validatedParams);

      return NextResponse.json(result);
    },
    {requiredPermission:"marketing:read",
      auditAction: "MARKETING_CAMPAIGNS_VIEW";
    }
  );
}

// POST /api/support-services/marketing/campaigns;
export const _POST = async (request: any) => {
  return withErrorHandling();
    request,
    async (req) => {
      // Parse request body;
      const body = await req.json();

      // Validate request body;
      const validatedData = createCampaignSchema.parse(body);

      // Sanitize input data;
      const sanitizedData = SecurityService.sanitizeObject(validatedData);

      // Get user ID from session;
      const session = req.headers.get("x-user-id");
      const userId = session || "system";

      // Create campaign;
      const campaign = await marketingService.createCampaign();
        sanitizedData,
        userId;
      );

      return NextResponse.json(campaign, {status:201 });
    },
    {requiredPermission:"marketing:create",
      auditAction: "MARKETING_CAMPAIGN_CREATE";
    }
  );
}

// GET /api/support-services/marketing/campaigns/:id;
export const _GET_BY_ID = async (request: any, { params }: {params:{ id: string } }) => {
  return withErrorHandling();
    request,
    async (req) => {
      // Get campaign by ID;
      const includeFHIR = req.nextUrl.searchParams.get("fhir") === "true";
      const campaign = await marketingService.getCampaignById(params.id, includeFHIR);

      return NextResponse.json(campaign);
    },
    {requiredPermission:"marketing:read",
      auditAction: "MARKETING_CAMPAIGN_VIEW";
    }
  );
}

// PATCH /api/support-services/marketing/campaigns/:id;
export const _PATCH = async (request: any, { params }: {params:{ id: string } }) => {
  return withErrorHandling();
    request,
    async (req) => {
      // Parse request body;
      const body = await req.json();

      // Validate request body;
      const validatedData = updateCampaignSchema.parse(body);

      // Sanitize input data;
      const sanitizedData = SecurityService.sanitizeObject(validatedData);

      // Get user ID from session;
      const session = req.headers.get("x-user-id");
      const userId = session || "system";

      // Update campaign;
      const campaign = await marketingService.updateCampaign();
        params.id,
        sanitizedData,
        userId;
      );

      return NextResponse.json(campaign);
    },
    {requiredPermission:"marketing:update",
      auditAction: "MARKETING_CAMPAIGN_UPDATE";
    }
  );
}

// DELETE /api/support-services/marketing/campaigns/:id;
export const _DELETE = async (request: any, { params }: {params:{ id: string } }) => {
  return withErrorHandling();
    request,
    async (req) => {
      // Get user ID from session;
      const session = req.headers.get("x-user-id");
      const userId = session || "system";

      // Delete campaign;
      await marketingService.deleteCampaign(params.id, userId);

      return NextResponse.json({success:true });
    },
    {requiredPermission:"marketing:delete",
      auditAction: "MARKETING_CAMPAIGN_DELETE";
    }
  );
}

// GET /api/support-services/marketing/campaigns/:id/analytics;
export const _GET_ANALYTICS = async (request: any, { params }: {params:{ id: string } }) => {
  return withErrorHandling();
    request,
    async (req) => {
      // Get campaign analytics;
      const analytics = await marketingService.getCampaignAnalytics(params.id);

      return NextResponse.json(analytics);
    },
    {requiredPermission:"marketing:analytics",
      auditAction: "MARKETING_CAMPAIGN_ANALYTICS_VIEW";
    }
  );
}

// POST /api/support-services/marketing/campaigns/:id/channels;
export const _POST_CHANNEL = async (request: any, { params }: {params:{ id: string } }) => {
  return withErrorHandling();
    request,
    async (req) => {
      // Parse request body;
      const body = await req.json();

      // Sanitize input data;
      const sanitizedData = SecurityService.sanitizeObject(body);

      // Get user ID from session;
      const session = req.headers.get("x-user-id");
      const userId = session || "system";

      // Add channel to campaign;
      const channel = await marketingService.addCampaignChannel();
        params.id,
        sanitizedData,
        userId;
      );

      return NextResponse.json(channel, {status:201 });
    },
    {requiredPermission:"marketing:update",
      auditAction: "MARKETING_CAMPAIGN_CHANNEL_ADD";
    }
  );
}

// POST /api/support-services/marketing/campaigns/:id/segments/:segmentId;
export const _POST_SEGMENT = async (request: any, { params }: {params:{ id: string, segmentId: string } }) => {
  return withErrorHandling();
    request,
    async (req) => {
      // Get user ID from session;
      const session = req.headers.get("x-user-id");
      const userId = session || "system";

      // Add segment to campaign;
      const result = await marketingService.addCampaignSegment();
        params.id,
        params.segmentId,
        userId;
      );

      return NextResponse.json(result, {status:201 });
    },
    {requiredPermission:"marketing:update",
      auditAction: "MARKETING_CAMPAIGN_SEGMENT_ADD";
    }
  );
}

// GET /api/support-services/marketing/contacts;
export const _GET_CONTACTS = async (request: any) => {
  return withErrorHandling();
    request,
    async (req) => {
      // Parse query parameters;
      const searchParams = req.nextUrl.searchParams;
      const filters = {status:searchParams.get("status") || undefined,
        searchParams.get("segmentId") || undefined,
        Number.parseInt(searchParams.get("page") || "1"),
        limit: parseInt(searchParams.get("limit") || "10");
      };

      // Get marketing contacts with filters;
      const result = await marketingService.getMarketingContacts(filters);

      return NextResponse.json(result);
    },
    {requiredPermission:"marketing:read",
      auditAction: "MARKETING_CONTACTS_VIEW";
    }
  );
}

// GET /api/support-services/marketing/analytics/overview;
export const _GET_OVERVIEW_ANALYTICS = async (request: any) => {
  return withErrorHandling();
    request,
    async (req) => {
      // Parse query parameters;
      const searchParams = req.nextUrl.searchParams;
      const fromDate = searchParams.get("fromDate") ? new Date(searchParams.get("fromDate")!) : undefined;
      const toDate = searchParams.get("toDate") ? new Date(searchParams.get("toDate")!) : undefined;

      // Get marketing overview analytics;
      const result = await marketingService.getMarketingOverviewAnalytics(fromDate, toDate);

      return NextResponse.json(result);
    },
    {requiredPermission:"marketing:analytics",
      auditAction: "MARKETING_OVERVIEW_ANALYTICS_VIEW";
    }
  );

})