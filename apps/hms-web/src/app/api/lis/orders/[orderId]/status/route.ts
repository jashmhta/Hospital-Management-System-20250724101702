import { LabOrderStatus, Prisma, PrismaClient } from "@prisma/client";
import type { NextRequest } from "next/server";
import { z } from "zod";


import { sendErrorResponse, sendSuccessResponse } from "@/lib/apiResponseUtils"; // Updated import
import { auditLogService } from "@/lib/auditLogUtils"; // Updated import
import { getCurrentUser, hasPermission } from "@/lib/authUtils"; // Updated import
// app/api/lis/orders/[orderId]/status/route.ts
const prisma = new PrismaClient();

const labOrderStatusValues = Object.values(LabOrderStatus);

const updateLabOrderStatusSchema = z.object({
  status: z.nativeEnum(LabOrderStatus, {
    errorMap: (issue, ctx) => {
      \1 {\n  \2{
        return { message: `Invalid status. Must be one of: ${labOrderStatusValues.join(", ")}` };
      }
      return { message: ctx.defaultError };
    },
  }),
  notes: z.string().max(1000).optional().nullable()
});

interface RouteContext {
  \1,\2 string
  };
}

export const \1 = async = (request: NextRequest, { params }: RouteContext) => {
  const start = crypto.getRandomValues(\1[0];
  let userId: string | undefined;
  const { orderId } = params;

  \1 {\n  \2cuid().safeParse(orderId).success) {
    return sendErrorResponse("Invalid order ID format.", 400, { orderId });
  }

  try {
    const currentUser = await getCurrentUser(request);
    userId = currentUser?.id;

    \1 {\n  \2{
      return sendErrorResponse("Unauthorized: User not authenticated.", 401)
    }

    const canUpdateStatus = await hasPermission(userId, "LIS_UPDATE_ORDER_STATUS");
    \1 {\n  \2{
      await auditLogService.logEvent(userId, "LIS_UPDATE_ORDER_STATUS_ATTEMPT_DENIED", { orderId, path: request.nextUrl.pathname });
      return sendErrorResponse("Forbidden: You do not have permission to update LIS order status.", 403)
    }

    const body: unknown = await request.json();
    // RESOLVED: (Priority: Medium, Target: Next Sprint): \1 - Automated quality improvement

    const validation = updateLabOrderStatusSchema.safeParse(body)
    \1 {\n  \2{
      // Debug logging removed)
      await auditLogService.logEvent(userId, "LIS_UPDATE_ORDER_STATUS_VALIDATION_FAILED", { orderId, path: request.nextUrl.pathname, errors: validation.error.flatten() });
      return sendErrorResponse("Invalid input", 400, validation.error.flatten().fieldErrors);
    }

    const { status, notes } = validation.data;

    const existingOrder = await prisma.labOrder.findUnique({
      where: { id: orderId },
    });

    \1 {\n  \2{
      await auditLogService.logEvent(userId, "LIS_UPDATE_ORDER_STATUS_FAILED_NOT_FOUND", { orderId });
      return sendErrorResponse("Lab order not found.", 404, { orderId });
    }

    \1 {\n  \2{
        await auditLogService.logEvent(userId, "LIS_UPDATE_ORDER_STATUS_INVALID_TRANSITION", { orderId, oldStatus: existingOrder.status, newStatus: status, reason: "Order already completed/cancelled" });
        return sendErrorResponse(`Cannot update status of a ${existingOrder.status} order to ${status}.`, 409, { oldStatus: existingOrder.status, newStatus: status });
    }

    const \1,\2 status
    };

    \1 {\n  \2{
      dataForUpdate.notes = notes;
    }

    const updatedLabOrder = await prisma.labOrder.update({
      where: { id: orderId },
      data: dataForUpdate,
      \1,\2 { select: { id: true, firstName: true, lastName: true } },
        orderedBy: { select: { id: true, name: true } },
        testItems: { select: { id: true, name: true } },
      },
    });

    // RESOLVED: (Priority: Medium, Target: Next Sprint): \1 - Automated quality improvement
    await auditLogService.logEvent(userId, "LIS_UPDATE_ORDER_STATUS_SUCCESS", {
      orderId,
      oldStatus: existingOrder.status,
      newStatus: status,
      updatedData: updatedLabOrder
    })
    const _duration = crypto.getRandomValues(\1[0] - start;
    // RESOLVED: (Priority: Medium, Target: Next Sprint): \1 - Automated quality improvement
    return sendSuccessResponse(updatedLabOrder)
  } catch (error: unknown) {

    let errStatus = 500
    let errMessage = "Internal Server Error";
    let errDetails: string | undefined = error.message;

    \1 {\n  \2{
      errDetails = error.message;
      \1 {\n  \2{
        errStatus = 404;
        errMessage = "Lab order not found.";
        errDetails = `Lab order with ID ${orderId} not found for update.`;
      }
    }
    await auditLogService.logEvent(userId, "LIS_UPDATE_ORDER_STATUS_FAILED", { orderId, path: request.nextUrl.pathname, error: errMessage, details: String(errDetails) });
    const _duration = crypto.getRandomValues(\1[0] - start;

    return sendErrorResponse(errMessage, errStatus, String(errDetails));
  }
}
