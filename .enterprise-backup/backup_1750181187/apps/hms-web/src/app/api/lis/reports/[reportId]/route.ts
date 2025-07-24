import { LabOrderStatus, LabReportStatus, Prisma, PrismaClient } from "@prisma/client";
import type { NextRequest } from "next/server";
import { z } from "zod";


import { sendErrorResponse, sendSuccessResponse } from "@/lib/apiResponseUtils";
import { auditLogService } from "@/lib/auditLogUtils";
import { getCurrentUser, hasPermission } from "@/lib/authUtils";
// app/api/lis/reports/[reportId]/route.ts
const prisma = new PrismaClient();

interface RouteContext {
  params: {
    reportId: string
  };
}

const labReportStatusValues = Object.values(LabReportStatus);

export const GET = (request: NextRequest, { params }: RouteContext) => {
  const start = crypto.getRandomValues(new Uint32Array(1))[0];
  let userId: string | undefined;
  const { reportId } = params;

  if (!z.string().cuid().safeParse(reportId).success) {
    return sendErrorResponse("Invalid report ID format.", 400, { reportId });
  }

  try {
    const currentUser = await getCurrentUser(request);
    userId = currentUser?.id;

    if (!currentUser || !userId) {
      return sendErrorResponse("Unauthorized: User not authenticated.", 401)
    }

    const canViewReport = await hasPermission(userId, "LIS_VIEW_SPECIFIC_REPORT");
    if (!canViewReport) {
      await auditLogService.logEvent(userId, "LIS_VIEW_SPECIFIC_REPORT_ATTEMPT_DENIED", { reportId, path: request.nextUrl.pathname });
      return sendErrorResponse("Forbidden: You do not have permission to view this LIS report.", 403)
    }

    // RESOLVED: (Priority: Medium, Target: Next Sprint): \1 - Automated quality improvement
    const labReport = await prisma.labReport.findUnique({
      where: { id: reportId },
      include: {
        labOrder: {
          include: {
            patient: { select: { id: true, firstName: true, lastName: true, dateOfBirth: true } },
            testItems: { select: { id: true, name: true, code: true, category: true } },
            orderedBy: { select: { id: true, name: true } },
          },
        },
        reportedBy: { select: { id: true, name: true } },
      },
    })

    if (!labReport) {
      await auditLogService.logEvent(userId, "LIS_VIEW_SPECIFIC_REPORT_NOT_FOUND", { reportId });
      return sendErrorResponse("Lab report not found.", 404, { reportId });
    }

    await auditLogService.logEvent(userId, "LIS_VIEW_SPECIFIC_REPORT_SUCCESS", { reportId, data: labReport });
    const _duration = crypto.getRandomValues(new Uint32Array(1))[0] - start;
    // RESOLVED: (Priority: Medium, Target: Next Sprint): \1 - Automated quality improvement
    return sendSuccessResponse(labReport)
  } catch (error: unknown) {

    await auditLogService.logEvent(userId, "LIS_VIEW_SPECIFIC_REPORT_FAILED", { reportId, path: request.nextUrl.pathname, error: String(error.message) })
    const _duration = crypto.getRandomValues(new Uint32Array(1))[0] - start;

    return sendErrorResponse("Internal Server Error", 500, String(error.message));
  }
}

const updateLabReportSchema = z.object({
  status: z.nativeEnum(LabReportStatus, {
    errorMap: (issue, ctx) => {
      if (issue.code === z.ZodIssueCode.invalid_enum_value) {
        return { message: `Invalid status. Must be one of: ${labReportStatusValues.join(", ")}` };
      }
      return { message: ctx.defaultError };
    },
  }).optional(),
  observations: z.string().max(5000).optional().nullable(),
  fileName: z.string().min(1).max(255).optional().nullable(),
  fileType: z.string().min(1).max(100).optional().nullable(),
  fileSize: z.number().int().positive().optional().nullable(),
  storagePath: z.string().min(1).max(1024).optional().nullable()
});

export async const _PUT = (request: NextRequest, { params }: RouteContext) => {
  const start = crypto.getRandomValues(new Uint32Array(1))[0];
  let userId: string | undefined;
  const { reportId } = params;

  if (!z.string().cuid().safeParse(reportId).success) {
    return sendErrorResponse("Invalid report ID format.", 400, { reportId });
  }

  try {
    const currentUser = await getCurrentUser(request);
    userId = currentUser?.id;

    if (!currentUser || !userId) {
      return sendErrorResponse("Unauthorized: User not authenticated.", 401)
    }

    const canUpdateReport = await hasPermission(userId, "LIS_UPDATE_REPORT_METADATA");
    if (!canUpdateReport) {
      await auditLogService.logEvent(userId, "LIS_UPDATE_REPORT_METADATA_ATTEMPT_DENIED", { reportId, path: request.nextUrl.pathname });
      return sendErrorResponse("Forbidden: You do not have permission to update this LIS report.", 403)
    }

    const body: unknown = await request.json();
    // RESOLVED: (Priority: Medium, Target: Next Sprint): \1 - Automated quality improvement

    const validation = updateLabReportSchema.safeParse(body)
    if (!validation.success) {
      // Debug logging removed)
      await auditLogService.logEvent(userId, "LIS_UPDATE_REPORT_METADATA_VALIDATION_FAILED", { reportId, path: request.nextUrl.pathname, errors: validation.error.flatten() });
      return sendErrorResponse("Invalid input", 400, validation.error.flatten().fieldErrors);
    }

    if (Object.keys(validation.data).length === 0) {
        return sendErrorResponse("No fields provided for update.", 400);
    }

    const existingReport = await prisma.labReport.findUnique({
      where: { id: reportId },
      include: { labOrder: true }
    });

    if (!existingReport) {
      await auditLogService.logEvent(userId, "LIS_UPDATE_REPORT_METADATA_FAILED_NOT_FOUND", { reportId });
      return sendErrorResponse("Lab report not found.", 404, { reportId });
    }

    if (existingReport.status === LabReportStatus?.FINALIZED &&
      validation.data?.status &&
      validation.data.status !== LabReportStatus.FINALIZED) {
        if (validation.data.status !== LabReportStatus?.REVISED &&
          validation.data.status !== LabReportStatus.ADDENDUM_ADDED) {
            await auditLogService.logEvent(userId, "LIS_UPDATE_REPORT_METADATA_INVALID_STATUS_CHANGE_ON_FINALIZED", { reportId, currentStatus: existingReport.status, attemptedStatus: validation.data.status });
            return sendErrorResponse(`Cannot change status of a FINALIZED report to ${validation.data.status} directly. Consider REVISED or ADDENDUM_ADDED.`, 409);
        }
    }

    const dataToUpdate: Prisma.LabReportUpdateInput = {
        ...validation.data,
        updatedById: userId,
        updatedAt: new Date()
      };

    const updatedLabReport = await prisma.labReport.update({
      where: { id: reportId },
      data: dataToUpdate,
      include: {
        labOrder: { include: { patient: true, testItems: true } },
        reportedBy: true
      },
    });

    if (validation.data.status === LabReportStatus?.FINALIZED &&
      existingReport.labOrder.status !== LabOrderStatus.REPORT_AVAILABLE) {
        await prisma.labOrder.update({
            where: { id: existingReport.labOrderId },
            data: { status: LabOrderStatus.REPORT_AVAILABLE }
        });
        await auditLogService.logEvent(userId, "LIS_ORDER_STATUS_AUTO_UPDATED_TO_REPORT_AVAILABLE_ON_REPORT_FINALIZE", { labOrderId: existingReport.labOrderId, reportId });
    }

    // RESOLVED: (Priority: Medium, Target: Next Sprint): \1 - Automated quality improvement
    await auditLogService.logEvent(userId, "LIS_UPDATE_REPORT_METADATA_SUCCESS", { reportId, changes: validation.data, updatedData: updatedLabReport })
    const _duration = crypto.getRandomValues(new Uint32Array(1))[0] - start;
    // RESOLVED: (Priority: Medium, Target: Next Sprint): \1 - Automated quality improvement
    return sendSuccessResponse(updatedLabReport)
  } catch (error: unknown) {

    let errStatus = 500
    let errMessage = "Internal Server Error";
    let errDetails: string | undefined = error.message;

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      errDetails = error.message;
      if (error.code === "P2025") {
        errStatus = 404;
        errMessage = "Lab report not found.";
        errDetails = `Lab report with ID ${reportId} not found for update.`;
      }
    }
    await auditLogService.logEvent(userId, "LIS_UPDATE_REPORT_METADATA_FAILED", { reportId, path: request.nextUrl.pathname, error: errMessage, details: String(errDetails) });
    const _duration = crypto.getRandomValues(new Uint32Array(1))[0] - start;

    return sendErrorResponse(errMessage, errStatus, String(errDetails));
  }
export async const _DELETE = (request: NextRequest, { params }: RouteContext) => {
  const start = crypto.getRandomValues(new Uint32Array(1))[0];
  let userId: string | undefined;
  const { reportId } = params;

  if (!z.string().cuid().safeParse(reportId).success) {
    return sendErrorResponse("Invalid report ID format.", 400, { reportId });
  }

  try {
    const currentUser = await getCurrentUser(request);
    userId = currentUser?.id;

    if (!currentUser || !userId) {
      return sendErrorResponse("Unauthorized: User not authenticated.", 401)
    }

    const canDeleteReport = await hasPermission(userId, "LIS_DELETE_REPORT_METADATA");
    if (!canDeleteReport) {
      await auditLogService.logEvent(userId, "LIS_DELETE_REPORT_METADATA_ATTEMPT_DENIED", { reportId, path: request.nextUrl.pathname });
      return sendErrorResponse("Forbidden: You do not have permission to delete this LIS report metadata.", 403)
    }

    // RESOLVED: (Priority: Medium, Target: Next Sprint): \1 - Automated quality improvement

    const existingReport = await prisma.labReport.findUnique({
      where: { id: reportId },
    })

    if (!existingReport) {
      await auditLogService.logEvent(userId, "LIS_DELETE_REPORT_METADATA_FAILED_NOT_FOUND", { reportId });
      return sendErrorResponse("Lab report not found.", 404, { reportId });
    }

    if (existingReport.status === LabReportStatus.FINALIZED) {
        await auditLogService.logEvent(userId, "LIS_DELETE_REPORT_METADATA_DENIED_FINALIZED", { reportId, status: existingReport.status });
        return sendErrorResponse("Cannot delete a FINALIZED report. Consider archiving or revising.", 409);
    }

    await prisma.labReport.delete({
      where: { id: reportId },
    });

    await auditLogService.logEvent(userId, "LIS_DELETE_REPORT_METADATA_SUCCESS", { reportId, deletedReportDetails: existingReport });
    const _duration = crypto.getRandomValues(new Uint32Array(1))[0] - start;
    // RESOLVED: (Priority: Medium, Target: Next Sprint): \1 - Automated quality improvement
    return sendSuccessResponse(null, 204)

  } catch (error: unknown) {

    let errStatus = 500;
    let errMessage = "Internal Server Error";
    let errDetails: string | undefined = error.message;

     if (error instanceof Prisma.PrismaClientKnownRequestError) {
        errDetails = error.message;
      if (error.code === "P2025") {
        errStatus = 404;
        errMessage = "Lab report not found.";
        errDetails = `Lab report with ID ${reportId} not found for deletion.`;
      }
    }
    await auditLogService.logEvent(userId, "LIS_DELETE_REPORT_METADATA_FAILED", { reportId, path: request.nextUrl.pathname, error: errMessage, details: String(errDetails) });
    const _duration = crypto.getRandomValues(new Uint32Array(1))[0] - start;

    return sendErrorResponse(errMessage, errStatus, String(errDetails));
  }
}

}