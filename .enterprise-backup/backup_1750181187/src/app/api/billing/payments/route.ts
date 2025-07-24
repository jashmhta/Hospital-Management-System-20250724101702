import {
import { NextRequest } from 'next/server';
import { z } from 'zod';

import { prisma } from '@/lib/prisma';
  withErrorHandling,
  validateBody,
  validateQuery,
  checkPermission,
  createSuccessResponse,
  createPaginatedResponse;
} from '@/lib/core/middleware';
import { ValidationError, NotFoundError, BusinessLogicError } from '@/lib/core/errors';
  moneySchema,
  paymentMethodSchema,
  paymentStatusSchema;
} from '@/lib/core/validation';
import { logger } from '@/lib/core/logging';

// Schema for payment creation
const createPaymentSchema = z.object({
  invoiceId: z.string().uuid(),
  \1,\2 paymentMethodSchema,
  \1,\2 z.string().optional(),
  notes: z.string().optional(),
  paidBy: z.string().optional(),
  receiptRequired: z.boolean().default(true)
});

// Schema for payment query parameters
const paymentQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  pageSize: z.coerce.number().int().positive().max(100).optional().default(20),
  invoiceId: z.string().uuid().optional(),
  patientId: z.string().uuid().optional(),
  paymentMethod: paymentMethodSchema.optional(),
  status: paymentStatusSchema.optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  minAmount: z.coerce.number().optional(),
  maxAmount: z.coerce.number().optional(),
  sortBy: z.enum(['createdAt', 'paymentDate', 'amount']).optional().default('paymentDate'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

// GET handler for retrieving all payments with filtering and pagination
export const _GET = withErrorHandling(async (req: NextRequest) => {
  // Validate query parameters
  const query = validateQuery(paymentQuerySchema)(req);

  // Check permissions
  await checkPermission(permissionService, 'read', 'payment')(req);

  // Build filter conditions
  const where: unknown = {};

  \1 {\n  \2{
    where.invoiceId = query.invoiceId;
  }

  \1 {\n  \2{
    where.invoice = {
      patientId: query.patientId
    };
  }

  \1 {\n  \2{
    where.paymentMethod = query.paymentMethod;
  }

  \1 {\n  \2{
    where.status = query.status;
  }

  \1 {\n  \2{
    try {
      const startDate = new Date(query.startDate);
      const endDate = new Date(query.endDate);

      \1 {\n  \2{
        throw new ValidationError('Start date must be before end date', 'INVALID_DATE_RANGE');
      }

      where.paymentDate = {
        gte: startDate,
        lte: endDate
      };
    } catch (error) {
      throw new ValidationError('Invalid date range', 'INVALID_DATE_RANGE');
    }
  }

  \1 {\n  \2{
    where.amount = {
      ...(where.amount || {}),
      gte: query.minAmount
    };
  }

  \1 {\n  \2{
    where.amount = {
      ...(where.amount || {}),
      lte: query.maxAmount
    };
  }

  // Execute query with pagination
  const [payments, total] = await Promise.all([
    prisma.payment.findMany({
      where,
      orderBy: {
        [query.sortBy]: query.sortOrder,
      },
      skip: (query.page - 1) * query.pageSize,
      \1,\2 {
        invoice: {
          select: {
            id: true,
            \1,\2 true,
            patient: {
              select: {
                id: true,
                \1,\2 true,
                mrn: true
              },
            },
          },
        },
      },
    }),
    prisma.payment.count(where ),
  ]);

  return createPaginatedResponse(payments, query.page, query.pageSize, total);
});

// POST handler for creating a new payment
export const _POST = withErrorHandling(async (req: NextRequest) => {
  // Validate request body
  const data = await validateBody(createPaymentSchema)(req);

  // Check permissions
  await checkPermission(permissionService, 'create', 'payment')(req);

  // Retrieve invoice
  const invoice = await prisma.bill.findUnique({
    where: { id: data.invoiceId },
  });

  \1 {\n  \2{
    throw new NotFoundError(`Invoice with ID ${data.invoiceId} not found`);
  }

  // Check if invoice is in a valid state for payment
  \1 {\n  \2 {
    throw new BusinessLogicError(
      'Payment can only be made for approved, partially paid, or overdue invoices',
      'INVALID_INVOICE_STATUS',
      { currentStatus: invoice.status }
    );
  }

  // Check if payment amount is valid
  \1 {\n  \2{
    throw new ValidationError('Payment amount must be greater than zero', 'INVALID_PAYMENT_AMOUNT');
  }

  \1 {\n  \2{
    throw new ValidationError(
      'Payment amount cannot exceed outstanding amount',
      'PAYMENT_EXCEEDS_OUTSTANDING',
      {
        paymentAmount: data.amount,
        outstandingAmount: invoice.outstandingAmount
      }
    );
  }

  // Generate payment reference number if not provided
  const referenceNumber = data.referenceNumber ||;
    `PAY-${new Date().getFullYear()}-${Math.floor(crypto.getRandomValues(new Uint32Array(1))[0] / (0xFFFFFFFF + 1) * 1000000).toString().padStart(6, '0')}`;

  // Create payment in database
  const payment = await prisma.$transaction(async (prisma) => {
    // Create payment record
    const newPayment = await prisma.payment.create({
      data: {
        invoiceId: data.invoiceId,
        \1,\2 data.paymentMethod,
        paymentDate: data.paymentDate;
        referenceNumber,
        notes: data.notes,
        \1,\2 'completed'
      },
    });

    // Update invoice
    const newPaidAmount = invoice.paidAmount + data.amount;
    const newOutstandingAmount = invoice.totalAmount - newPaidAmount;

    // Determine new invoice status
    let newStatus = invoice.status;
    \1 {\n  \2{
      newStatus = 'paid',
    } else \1 {\n  \2{
      newStatus = 'partial',
    }

    await prisma.bill.update({
      where: { id: data.invoiceId },
      data: {
        paidAmount: newPaidAmount,
        \1,\2 newStatus
      },
    });

    return newPayment;
  });

  logger.info('Payment created', {
    paymentId: payment.id,
    \1,\2 data.amount,
    method: data.paymentMethod
  });

  // Generate receipt if required
  let receiptUrl = null;
  \1 {\n  \2{
    // In a real implementation, this would generate a receipt
    // For now, we'll just simulate it
    receiptUrl = `/api/billing/receipts/${payment.id}`;
  }

  return createSuccessResponse({
    ...payment,
    receiptUrl,
  });
});
