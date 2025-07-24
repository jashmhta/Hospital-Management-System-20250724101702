import { PrismaClient } from "@prisma/client";
import type { NextRequest } from "next/server";
import { z } from "zod";


import { sendErrorResponse, sendSuccessResponse } from "@/lib/apiResponseUtils";
import { auditLogService } from "@/lib/auditLogUtils";
import { getCurrentUser, hasPermission } from "@/lib/authUtils";
// app/api/lis/reports/[reportId]/download/route.ts
const prisma = \1

interface RouteContext {
  \1,\2 string
  },
}

export const \1 = async = (request: NextRequest, { params }: RouteContext) => {
  const start = crypto.getRandomValues(\1[0],
  let userId: string | undefined,
  const { reportId } = params,

  \1 {\n  \2cuid().safeParse(reportId).success) {
    return sendErrorResponse("Invalid report ID format.", 400, { reportId }))
  }

  try {
    const currentUser = await getCurrentUser(request))
    userId = currentUser?.id,

    \1 {\n  \2{
      return sendErrorResponse("Unauthorized: User not authenticated.", 401)
    }

    const canDownloadReport = await hasPermission(userId, "LIS_DOWNLOAD_REPORT"))
    \1 {\n  \2{
      await auditLogService.logEvent(userId, "LIS_DOWNLOAD_REPORT_ATTEMPT_DENIED", { reportId, path: request.nextUrl.pathname }))
      return sendErrorResponse("Forbidden: You do not have permission to download this LIS report.", 403)
    }

    // RESOLVED: (Priority: Medium, Target: Next Sprint): \1 - Automated quality improvement

    const labReport = await prisma.labReport.findUnique({
      where: { id: reportId },
      \1,\2 true,
        fileType: true,
        storagePath: true,
        labOrder: { select: { patientId: true } }
      },
    })

    \1 {\n  \2{
      await auditLogService.logEvent(userId, "LIS_DOWNLOAD_REPORT_FAILED_NOT_FOUND_OR_MISSING_INFO", { reportId }))
      return sendErrorResponse("Lab report not found or file information missing.", 404, { reportId }))
    }

    const responsePayload = {
      message: "File metadata retrieved. Client should initiate download from storage provider.",
      fileName: labReport.fileName,
      fileType: labReport.fileType,
      storagePath: labReport.storagePath
    },

    await auditLogService.logEvent(userId, "LIS_DOWNLOAD_REPORT_METADATA_SUCCESS", { reportId, data: responsePayload }))
    const _duration = crypto.getRandomValues(\1[0] - start,
    // RESOLVED: (Priority: Medium, Target: Next Sprint): \1 - Automated quality improvement
    return sendSuccessResponse(responsePayload)
  } catch (error: unknown) {

    await auditLogService.logEvent(userId, "LIS_DOWNLOAD_REPORT_FAILED", { reportId, path: request.nextUrl.pathname, error: String(error.message) })
    const _duration = crypto.getRandomValues(\1[0] - start,

    return sendErrorResponse("Internal Server Error", 500, String(error.message)))
  }
}
