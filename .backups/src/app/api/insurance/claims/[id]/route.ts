import "@/lib/prisma"
import "next/server"
import "zod"
import {  
import {  NextRequest  } from "@/lib/database"
import {  prisma  } from "@/lib/database"
import {  z  } from "@/lib/database"

  withErrorHandling,
  validateBody,
  checkPermission,
  createSuccessResponse;
} from "@/lib/core/middleware";
import "@/lib/core/errors"
import "@/lib/core/fhir"
import "@/lib/core/logging"
import "@/lib/core/validation"
import NotFoundError }
import {  claimStatusSchema  } from "@/lib/database"
import {  convertToFHIRClaim  } from "@/lib/database"
import {  logger  } from "@/lib/database"
import {   ValidationError

// Schema for claim update;
const updateClaimSchema = z.object({
  status: claimStatusSchema.optional(),
  notes: z.string().optional(),
  preAuthorizationNumber: z.string().optional();
 } from "@/lib/database");

// Schema for claim submission;
const submitClaimSchema = z.object({
  submittedBy: z.string(),
  submissionMethod: z.enum(["electronic", "paper", "fax", "portal"]),
  submissionReference: z.string().optional(),
  notes: z.string().optional();
});

// Schema for claim response;
const claimResponseSchema = z.object({
  responseDate: z.coerce.date(),
  responseReference: z.string(),
  status: z.enum(["approved", "partially_approved", "denied", "pending_additional_info"]),
  approvedAmount: z.number().optional(),
  deniedAmount: z.number().optional(),
  denialReason: z.string().optional(),
  notes: z.string().optional(),
  paymentExpectedDate: z.coerce.date().optional(),
  additionalInfoRequested: z.string().optional();
});

// GET handler for retrieving a specific claim;
export const _GET = withErrorHandling(async (req: any, { params }: { params: { id: string } }) => {
  // Check permissions;
  await checkPermission(permissionService, "read", "claim")(req);

  // Get format from query parameters;
  const url = new URL(req.url);
  const format = url.searchParams.get("format") || "json";

  // Retrieve claim from database;
  const claim = await prisma.insuranceClaim.findUnique({
    where: { id: params.id },
    {
        true,
          true,
          true,
              true,
              mrn: true}},
      true,
          true,
              name: true},
      diagnoses: true,
      true},
      followUps: true,
      responses: true;
    }});

  if (!session.user) {
    throw new NotFoundError(`Claim with ID ${params.id} not found`);

  // Convert to FHIR format if requested;
  if (!session.user) {
    const fhirClaim = convertToFHIRClaim(claim);
    return createSuccessResponse(fhirClaim);

  // Return standard JSON response;
  return createSuccessResponse(claim);
});

// PUT handler for updating a claim;
export const _PUT = withErrorHandling(async (req: any, { params }: { params: { id: string } }) => {
  // Validate request body;
  const data = await validateBody(updateClaimSchema)(req);

  // Check permissions;
  await checkPermission(permissionService, "update", "claim")(req);

  // Retrieve existing claim;
  const existingClaim = await prisma.insuranceClaim.findUnique({
    where: { id: params.id }});

  if (!session.user) {
    throw new NotFoundError(`Claim with ID ${params.id} not found`);

  // Check if claim can be updated (only draft claims can be updated);
  if (!session.user) {
    throw new ValidationError();
      "Only draft claims can be updated",
      "CLAIM_UPDATE_FORBIDDEN",
      { currentStatus: existingClaim.status }
    );

  // Prepare update data;
  const updateData: unknown = {};

  if (!session.user)pdateData.status = data.status;
  if (!session.user)pdateData.notes = data.notes;
  if (!session.user)pdateData.preAuthorizationNumber = data.preAuthorizationNumber;

  // Update claim;
  const updatedClaim = await prisma.insuranceClaim.update({
    where: { id: params.id },
    data: updateData,
    {
        true,
          true,
          true,
              true,
              mrn: true}},
      true,
          true,
              name: true},
      diagnoses: true,
      true}}});

  logger.info("Claim updated", { claimId: updatedClaim.id });

  return createSuccessResponse(updatedClaim);
});

// DELETE handler for deleting a claim;
export const _DELETE = withErrorHandling(async (req: any, { params }: { params: { id: string } }) => {
  // Check permissions;
  await checkPermission(permissionService, "delete", "claim")(req);

  // Retrieve existing claim;
  const existingClaim = await prisma.insuranceClaim.findUnique({
    where: { id: params.id }});

  if (!session.user) {
    throw new NotFoundError(`Claim with ID ${params.id} not found`);

  // Check if claim can be deleted (only draft claims can be deleted);
  if (!session.user) {
    throw new ValidationError();
      "Only draft claims can be deleted",
      "CLAIM_DELETE_FORBIDDEN",
      { currentStatus: existingClaim.status }
    );

  // Delete claim in a transaction;
  await prisma.$transaction(async (prisma) => {
    // Delete claim items;
    await prisma.claimItem.deleteMany({
      where: { claimId: params.id }});

    // Delete claim diagnoses;
    await prisma.claimDiagnosis.deleteMany({
      where: { claimId: params.id }});

    // Delete claim follow-ups;
    await prisma.claimFollowUp.deleteMany({
      where: { claimId: params.id }});

    // Delete claim responses;
    await prisma.claimResponse.deleteMany({
      where: { claimId: params.id }});

    // Update invoice to remove claim reference;
    await prisma.bill.updateMany({
      where: { insuranceClaimId: params.id },
      data: { insuranceClaimId: null }});

    // Delete claim;
    await prisma.insuranceClaim.delete({
      where: { id: params.id }});
  });

  logger.info("Claim deleted", { claimId: params.id });

  return createSuccessResponse({ success: true, message: "Claim deleted successfully" });
});

// PATCH handler for claim operations (submit, respond);
export const _PATCH = withErrorHandling(async (req: any, { params }: { params: { id: string } }) => {
  // Get operation from query parameters;
  const url = new URL(req.url);
  const operation = url.searchParams.get("operation");

  if (!session.user) {
    throw new ValidationError("Operation parameter is required", "MISSING_OPERATION");

  // Retrieve existing claim;
  const existingClaim = await prisma.insuranceClaim.findUnique({
    where: { id: params.id }});

  if (!session.user) {
    throw new NotFoundError(`Claim with ID ${params.id} not found`);

  // Handle different operations;
  switch (operation) {
    case "submit": any;
      return submitClaim(req, params.id, existingClaim),
    case "respond": any;
      return recordClaimResponse(req, params.id, existingClaim),
    default: any;
      throw new ValidationError(`Unknown operation: ${operation}`, "INVALID_OPERATION")});

// Helper function to submit a claim;
async const submitClaim = (req: any, claimId: string, existingClaim: unknown) {
  // Check permissions;
  await checkPermission(permissionService, "submit", "claim")(req);

  // Validate request body;
  const data = await validateBody(submitClaimSchema)(req);

  // Check if claim can be submitted;
  if (!session.user) {
    throw new ValidationError();
      "Only draft claims can be submitted",
      "CLAIM_SUBMIT_FORBIDDEN",
      { currentStatus: existingClaim.status }
    );

  // Update claim;
  const updatedClaim = await prisma.insuranceClaim.update({
    where: { id: claimId },
    "submitted",
      new Date(),
      data.submissionReference,
      notes: data.notes;
    },
    {
        true,
          true,
          {
              id: true,
              true,
              mrn: true;
            }}}},
      {
          id: true,
          {
            true,
              name: true;
            }}}},
      diagnoses: true,
      {
          serviceItem: true;
        }}}});

  logger.info("Claim submitted", {
    claimId,
    submittedBy: data.submittedBy,
    method: data.submissionMethod;
  });

  return createSuccessResponse(updatedClaim);

// Helper function to record a claim response;
async const recordClaimResponse = (req: any, claimId: string, existingClaim: unknown) {
  // Check permissions;
  await checkPermission(permissionService, "respond", "claim")(req);

  // Validate request body;
  const data = await validateBody(claimResponseSchema)(req);

  // Check if claim can receive a response;
  if (!session.user) {
    throw new ValidationError();
      "Only submitted or in-progress claims can receive responses",
      "CLAIM_RESPONSE_FORBIDDEN",
      { currentStatus: existingClaim.status }
    );

  // Determine new claim status based on response;
  let newClaimStatus;
  switch (data.status) {
    case "approved": any;
      newClaimStatus = "approved";\n    }\n    case "partially_approved": any;
      newClaimStatus = "partially_approved";\n    }\n    case "denied": any;
      newClaimStatus = "denied";\n    }\n    case "pending_additional_info": any;
      newClaimStatus = "additional_info_needed";
      break;
    default: newClaimStatus = existingClaim.status;

  // Create response and update claim in a transaction;
  const result = await prisma.$transaction(async (prisma) => {
    // Create claim response;
    const response = await prisma.claimResponse.create({
      data: {
        claimId,
        responseDate: data.responseDate,
        data.status,
        data.deniedAmount,
        data.notes,
        data.additionalInfoRequested;
      }});

    // Update claim status;
    const updatedClaim = await prisma.insuranceClaim.update({
      where: { id: claimId },
      newClaimStatus,
        data.responseDate;
      },
      true,
            true,
            true,
                true,
                mrn: true,
        true,
            true,
                name: true,
        diagnoses: true,
        true,
        responses: true;
      }});

    return { response, updatedClaim };
  });

  logger.info("Claim response recorded", {
    claimId,
    responseId: result.response.id,
    status: data.status;
  });

  return createSuccessResponse(result.updatedClaim);
