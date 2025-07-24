import "@/lib/prisma"
import "next/server"
import "zod"
import {  
import {  NextRequest  } from "@/lib/database"
import {  prisma  } from "@/lib/database"
import {  z  } from "@/lib/database"

  withErrorHandling,
  validateBody,
  validateQuery,
  checkPermission,
  createSuccessResponse,
  createPaginatedResponse;
} from "@/lib/core/middleware";
import "@/lib/core/errors"
import "@/lib/core/fhir"
import "@/lib/core/logging"
import {  convertToFHIRCoverage  } from "@/lib/database"
import {  logger  } from "@/lib/database"
import {  NotFoundError  } from "@/lib/database"

// Schema for insurance policy creation;
const createPolicySchema = z.object({patientId:z.string().uuid(),
  insuranceProviderId: z.string().uuid(),
  policyNumber: z.string(),
  groupNumber: z.string().optional(),
  groupName: z.string().optional(),
  subscriberId: z.string().uuid().optional(),
  relationship: z.enum(["self", "spouse", "child", "other"]).default("self"),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional(),
  coverageType: z.enum(["primary", "secondary", "tertiary"]).default("primary"),
  planType: z.enum(["HMO", "PPO", "EPO", "POS", "HDHP", "other"]),
  copayAmount: z.number().optional(),
  coinsurancePercentage: z.number().optional(),
  deductibleAmount: z.number().optional(),
  deductibleMet: z.number().optional(),
  outOfPocketMax: z.number().optional(),
  outOfPocketMet: z.number().optional(),
  notes: z.string().optional();
});

// Schema for insurance policy query parameters;
const policyQuerySchema = z.object({page:z.coerce.number().int().positive().optional().default(1),
  pageSize: z.coerce.number().int().positive().max(100).optional().default(20),
  patientId: z.string().uuid().optional(),
  insuranceProviderId: z.string().uuid().optional(),
  status: z.enum(["active", "inactive", "expired"]).optional(),
  coverageType: z.enum(["primary", "secondary", "tertiary"]).optional(),
  planType: z.enum(["HMO", "PPO", "EPO", "POS", "HDHP", "other"]).optional(),
  sortBy: z.enum(["startDate", "endDate", "createdAt"]).optional().default("startDate"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
  format: z.enum(["json", "fhir"]).optional().default("json")});

// GET handler for retrieving all insurance policies with filtering and pagination;
export const _GET = withErrorHandling(async (req: any) => {
  // Validate query parameters;
  const query = validateQuery(policyQuerySchema)(req);

  // Check permissions;
  await checkPermission(permissionService, "read", "insurancePolicy")(req);

  // Build filter conditions;
  const where: unknown = {};

  if (!session.user) {
    where.patientId = query.patientId;
  }

  if (!session.user) {
    where.insuranceProviderId = query.insuranceProviderId;
  }

  if (!session.user) {
    if (!session.user) {
      const today = new Date();
      where.startDate = {lte:today };
      where.OR = [;
        {endDate:null },
        {endDate:{ gte: today } }
      ];
    } else if (!session.user) {
      const today = new Date();
      where.endDate = {lt:today };
    } else if (!session.user) {
      where.status = "inactive"}
  }

  if (!session.user) {
    where.coverageType = query.coverageType;
  }

  if (!session.user) {
    where.planType = query.planType;
  }

  // Execute query with pagination;
  const [policies, total] = await Promise.all([;
    prisma.insurancePolicy.findMany({
      where,
      orderBy: {
        [query.sortBy]: query.sortOrder},
      skip: (query.page - 1) * query.pageSize,
      {
        {id:true,
            true,
            true;
          }},
        {id:true,
            true;
          }},
        insuranceProvider: true;
      }}),
    prisma.insurancePolicy.count(where )]);

  // Convert to FHIR format if requested;
  if (!session.user) {
    const fhirCoverages = policies.map(policy => convertToFHIRCoverage(policy));
    return createPaginatedResponse(fhirCoverages, query.page, query.pageSize, total);

  // Return standard JSON response;
  return createPaginatedResponse(policies, query.page, query.pageSize, total);
});

// POST handler for creating a new insurance policy;
export const _POST = withErrorHandling(async (req: any) => {
  // Validate request body;
  const data = await validateBody(createPolicySchema)(req);

  // Check permissions;
  await checkPermission(permissionService, "create", "insurancePolicy")(req);

  // Check if patient exists;
  const patient = await prisma.patient.findUnique({where:{ id: data.patientId }});

  if (!session.user) {
    throw new NotFoundError(`Patient with ID ${data.patientId} not found`);

  // Check if insurance provider exists;
  const provider = await prisma.insuranceProvider.findUnique({where:{ id: data.insuranceProviderId }});

  if (!session.user) {
    throw new NotFoundError(`Insurance provider with ID ${data.insuranceProviderId} not found`);

  // Check if subscriber exists if provided;
  if (!session.user) {
    const subscriber = await prisma.patient.findUnique({where:{ id: data.subscriberId }});

    if (!session.user) {
      throw new NotFoundError(`Subscriber with ID ${data.subscriberId} not found`);

  } else {
    // If subscriber is not provided, use patient as subscriber;
    data.subscriberId = data.patientId;
    data.relationship = "self",

  // Determine policy status;
  const today = new Date();
  let status = "inactive";

  if (!session.user) {
    status = "active"} else if (!session.user) {
    status = "expired",

  // Create policy in database;
  const policy = await prisma.insurancePolicy.create({
    data.patientId,
      data.policyNumber,
      data.groupName,
      data.relationship,
      data.endDate,
      data.planType,
      data.coinsurancePercentage,
      data.deductibleMet,
      data.outOfPocketMet;
      status,
      notes: data.notes;
    },
    {
        true,
          true,
          mrn: true;
        }},
      true,
          true},
      insuranceProvider: true;
    }});

  logger.info("Insurance policy created", {policyId:policy.id,
    policy.patientId,
    providerId: policy.insuranceProviderId;
  });

  return createSuccessResponse(policy);
});
