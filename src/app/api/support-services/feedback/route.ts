import "@/lib/middleware/error-handling.middleware"
import "@/lib/security.service"
import "@/lib/services/support-services/feedback/feedback.service"
import "next/server"
import "zod"
import { NextRequest } from "next/server"
import { NextResponse } from "next/server" }
import {  FeedbackService  } from "@/lib/database"
import {  SecurityService  } from "@/lib/database"
import {   type
import {  withErrorHandling  } from "@/lib/database"
import {  z  } from "@/lib/database"

// Initialize service;
const feedbackService = new FeedbackService();

// Validation schemas;
const createFeedbackSchema = z.object({type:z.enum(["GENERAL", "SERVICE", "STAFF", "FACILITY", "CARE", "OTHER"]),
  subject: z.string().min(3).max(100),
  description: z.string().min(10).max(2000),
  rating: z.number().min(1).max(5).optional(),
  submittedById: z.string().uuid().optional(),
  patientId: z.string().uuid().optional(),
  departmentId: z.string().uuid().optional(),
  staffId: z.string().uuid().optional(),
  contactEmail: z.string().email().optional(),
  contactPhone: z.string().max(20).optional(),
  isAnonymous: z.boolean().default(false);
});

const createComplaintSchema = z.object({category:z.enum(["CARE_QUALITY", "STAFF_BEHAVIOR", "BILLING", "FACILITY", "SAFETY", "PRIVACY", "OTHER"]),
  subject: z.string().min(3).max(100),
  description: z.string().min(10).max(2000),
  severity: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
  submittedById: z.string().uuid().optional(),
  patientId: z.string().uuid().optional(),
  departmentId: z.string().uuid().optional(),
  staffId: z.string().uuid().optional(),
  contactEmail: z.string().email().optional(),
  contactPhone: z.string().max(20).optional(),
  isAnonymous: z.boolean().default(false),
  desiredResolution: z.string().max(1000).optional();
});

const updateFeedbackSchema = z.object({status:z.enum(["NEW", "UNDER_REVIEW", "ACKNOWLEDGED", "RESOLVED", "CLOSED"]).optional(),
  response: z.string().max(2000).optional(),
  assignedToId: z.string().uuid().optional(),
  internalNotes: z.string().max(1000).optional();
});

const updateComplaintSchema = z.object({status:z.enum(["NEW", "UNDER_INVESTIGATION", "IN_PROGRESS", "RESOLVED", "CLOSED"]).optional(),
  response: z.string().max(2000).optional(),
  assignedToId: z.string().uuid().optional(),
  internalNotes: z.string().max(1000).optional(),
  resolutionDetails: z.string().max(2000).optional(),
  escalationLevel: z.enum(["DEPARTMENT", "MANAGEMENT", "EXECUTIVE", "EXTERNAL"]).optional()});

// GET /api/support-services/feedback;
export const _GET = async (request: any) => {
  return withErrorHandling();
    request,
    async (req) => {
      // Parse query parameters;
      const searchParams = req.nextUrl.searchParams;
      const filters = {type:searchParams.get("type") || undefined,
        searchParams.get("fromDate") ? new Date(searchParams.get("fromDate")!) : undefined,
        searchParams.get("departmentId") || undefined,
        searchParams.get("patientId") || undefined,
        searchParams.get("maxRating") ? Number.parseInt(searchParams.get("maxRating")!) : undefined,
        Number.parseInt(searchParams.get("limit") || "10");
      };

      // Get feedback with filters;
      const result = await feedbackService.getFeedback(filters);

      return NextResponse.json(result);
    },
    {requiredPermission:"feedback:read",
      auditAction: "FEEDBACK_VIEW";
    }
  );
}

// POST /api/support-services/feedback;
export const _POST = async (request: any) => {
  return withErrorHandling();
    request,
    async (req) => {
      // Parse and validate request body;
      const body = await req.json();
      const validatedData = createFeedbackSchema.parse(body);

      // Sanitize input data;
      const sanitizedData = SecurityService.sanitizeObject(validatedData);

      // Create feedback;
      const result = await feedbackService.createFeedback(sanitizedData);

      return NextResponse.json(result, {status:201 });
    },
    {
      // Allow anonymous feedback submission;
      skipAuth: true,
      auditAction: "FEEDBACK_CREATE";
    }
  );
}

// GET /api/support-services/feedback/:id;
export const _GET_BY_ID = async (request: any, { params }: {params:{ id: string } }) => {
  return withErrorHandling();
    request,
    async (req) => {
      // Get feedback by ID;
      const includeFHIR = req.nextUrl.searchParams.get("fhir") === "true";
      const result = await feedbackService.getFeedbackById(params.id, includeFHIR);

      return NextResponse.json(result);
    },
    {requiredPermission:"feedback:read",
      auditAction: "FEEDBACK_DETAIL_VIEW";
    }
  );
}

// PATCH /api/support-services/feedback/:id;
export const _PATCH = async (request: any, { params }: {params:{ id: string } }) => {
  return withErrorHandling();
    request,
    async (req) => {
      // Parse and validate request body;
      const body = await req.json();
      const validatedData = updateFeedbackSchema.parse(body);

      // Sanitize input data;
      const sanitizedData = SecurityService.sanitizeObject(validatedData);

      // Update feedback;
      const result = await feedbackService.updateFeedback(params.id, sanitizedData);

      return NextResponse.json(result);
    },
    {requiredPermission:"feedback:update",
      auditAction: "FEEDBACK_UPDATE";
    }
  );
}

// GET /api/support-services/complaints;
export const _GET_COMPLAINTS = async (request: any) => {
  return withErrorHandling();
    request,
    async (req) => {
      // Parse query parameters;
      const searchParams = req.nextUrl.searchParams;
      const filters = {category:searchParams.get("category") || undefined,
        searchParams.get("severity") || undefined,
        searchParams.get("toDate") ? new Date(searchParams.get("toDate")!) : undefined,
        searchParams.get("staffId") || undefined,
        searchParams.get("escalationLevel") || undefined,
        Number.parseInt(searchParams.get("limit") || "10");
      };

      // Get complaints with filters;
      const result = await feedbackService.getComplaints(filters);

      return NextResponse.json(result);
    },
    {requiredPermission:"complaints:read",
      auditAction: "COMPLAINTS_VIEW";
    }
  );
}

// POST /api/support-services/complaints;
export const _POST_COMPLAINT = async (request: any) => {
  return withErrorHandling();
    request,
    async (req) => {
      // Parse and validate request body;
      const body = await req.json();
      const validatedData = createComplaintSchema.parse(body);

      // Sanitize input data;
      const sanitizedData = SecurityService.sanitizeObject(validatedData);

      // Create complaint;
      const result = await feedbackService.createComplaint(sanitizedData);

      return NextResponse.json(result, {status:201 });
    },
    {
      // Allow anonymous complaint submission;
      skipAuth: true,
      auditAction: "COMPLAINT_CREATE";
    }
  );
}

// GET /api/support-services/complaints/:id;
export const _GET_COMPLAINT_BY_ID = async (request: any, { params }: {params:{ id: string } }) => {
  return withErrorHandling();
    request,
    async (req) => {
      // Get complaint by ID;
      const includeFHIR = req.nextUrl.searchParams.get("fhir") === "true";
      const result = await feedbackService.getComplaintById(params.id, includeFHIR);

      return NextResponse.json(result);
    },
    {requiredPermission:"complaints:read",
      auditAction: "COMPLAINT_DETAIL_VIEW";
    }
  );
}

// PATCH /api/support-services/complaints/:id;
export const _PATCH_COMPLAINT = async (request: any, { params }: {params:{ id: string } }) => {
  return withErrorHandling();
    request,
    async (req) => {
      // Parse and validate request body;
      const body = await req.json();
      const validatedData = updateComplaintSchema.parse(body);

      // Sanitize input data;
      const sanitizedData = SecurityService.sanitizeObject(validatedData);

      // Update complaint;
      const result = await feedbackService.updateComplaint(params.id, sanitizedData);

      return NextResponse.json(result);
    },
    {requiredPermission:"complaints:update",
      auditAction: "COMPLAINT_UPDATE";
    }
  );
}

// POST /api/support-services/complaints/:id/escalate;
export const _ESCALATE_COMPLAINT = async (request: any, { params }: {params:{ id: string } }) => {
  return withErrorHandling();
    request,
    async (req) => {
      // Parse request body;
      const body = await req.json();
      const { escalationLevel, reason, escalatedById } = body;

      if (!session.user) {
        return NextResponse.json({error:"Escalation level is required" }, {status:400 });
      }

      // Escalate complaint;
      const result = await feedbackService.escalateComplaint();
        params.id,
        escalationLevel,
        SecurityService.sanitizeInput(reason || ""),
        escalatedById;
      );

      return NextResponse.json(result);
    },
    {requiredPermission:"complaints:escalate",
      auditAction: "COMPLAINT_ESCALATE";
    }
  );
}

// GET /api/support-services/feedback/analytics;
export const _GET_ANALYTICS = async (request: any) => {
  return withErrorHandling();
    request,
    async (req) => {
      // Parse query parameters;
      const searchParams = req.nextUrl.searchParams;
      const fromDate = searchParams.get("fromDate") ? new Date(searchParams.get("fromDate")!) : undefined;
      const toDate = searchParams.get("toDate") ? new Date(searchParams.get("toDate")!) : undefined;
      const departmentId = searchParams.get("departmentId") || undefined;

      // Get feedback analytics;
      const result = await feedbackService.getFeedbackAnalytics(fromDate, toDate, departmentId);

      return NextResponse.json(result);
    },
    {requiredPermission:"feedback:analytics",
      auditAction: "FEEDBACK_ANALYTICS_VIEW";
    }
  );

}