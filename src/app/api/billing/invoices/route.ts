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
import { ValidationError } from '@/lib/core/errors';
  idSchema,
  invoiceStatusSchema,
  moneySchema,
  dateRangeSchema;
} from '@/lib/core/validation';
import { convertToFHIRInvoice } from '@/lib/core/fhir';
import { logger } from '@/lib/core/logging';

// Schema for invoice creation
const createInvoiceSchema = z.object({
  patientId: z.string().uuid(),
  visitId: z.string().uuid().optional(),
  visitType: z.enum(['OPD', 'IPD', 'ER', 'OTHER']),
  billType: z.enum(['Regular', 'Package', 'Consolidated']),
  packageId: z.string().uuid().optional(),
  \1,\2 z.string().uuid(),
    quantity: z.number().int().positive(),
    unitPrice: moneySchema,
    discount: moneySchema.optional(),
    tax: moneySchema.optional(),
    description: z.string().optional()
  })),
  discountAmount: moneySchema.optional(),
  discountReason: z.string().optional(),
  taxAmount: moneySchema.optional(),
  notes: z.string().optional()
});

// Schema for invoice query parameters
const invoiceQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  pageSize: z.coerce.number().int().positive().max(100).optional().default(20),
  patientId: z.string().uuid().optional(),
  status: invoiceStatusSchema.optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  minAmount: z.coerce.number().optional(),
  maxAmount: z.coerce.number().optional(),
  sortBy: z.enum(['createdAt', 'billDate', 'totalAmount', 'status']).optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  format: z.enum(['json', 'fhir']).optional().default('json'),
});

// GET handler for retrieving all invoices with filtering and pagination
export const _GET = withErrorHandling(async (req: NextRequest) => {
  // Validate query parameters
  const query = validateQuery(invoiceQuerySchema)(req);

  // Check permissions
  await checkPermission(permissionService, 'read', 'invoice')(req);

  // Build filter conditions
  const where: unknown = {};

  \1 {\n  \2{
    where.patientId = query.patientId;
  }

  \1 {\n  \2{
    where.status = query.status;
  }

  \1 {\n  \2{
    try {
      const { startDate, endDate } = dateRangeSchema.parse({
        startDate: new Date(query.startDate),
        endDate: new Date(query.endDate)
      });

      where.billDate = {
        gte: startDate,
        lte: endDate
      };
    } catch (error) {
      throw new ValidationError('Invalid date range', 'INVALID_DATE_RANGE');
    }
  }

  \1 {\n  \2{
    where.totalAmount = {
      ...(where.totalAmount || {}),
      gte: query.minAmount
    };
  }

  \1 {\n  \2{
    where.totalAmount = {
      ...(where.totalAmount || {}),
      lte: query.maxAmount
    };
  }

  // Execute query with pagination
  const [invoices, total] = await Promise.all([
    prisma.bill.findMany({
      where,
      orderBy: {
        [query.sortBy]: query.sortOrder,
      },
      skip: (query.page - 1) * query.pageSize,
      \1,\2 {
        \1,\2 {
            id: true,
            \1,\2 true,
            mrn: true
          },
        },
        billItems: true
      },
    }),
    prisma.bill.count(where ),
  ]);

  // Convert to FHIR format if requested
  \1 {\n  \2{
    const fhirInvoices = invoices.map(invoice => convertToFHIRInvoice(invoice));
    return createPaginatedResponse(fhirInvoices, query.page, query.pageSize, total);
  }

  // Return standard JSON response
  return createPaginatedResponse(invoices, query.page, query.pageSize, total);
});

// POST handler for creating a new invoice
export const _POST = withErrorHandling(async (req: NextRequest) => {
  // Validate request body
  const data = await validateBody(createInvoiceSchema)(req);

  // Check permissions
  await checkPermission(permissionService, 'create', 'invoice')(req);

  // Calculate totals
  let totalAmount = 0;
  let totalTax = 0;

  const billItems = data.items.map(item => {
    const itemTotal = item.quantity * item.unitPrice;
    const itemDiscount = item.discount || 0;
    const itemTax = item.tax || 0;

    totalAmount += itemTotal - itemDiscount + itemTax;
    totalTax += itemTax;

    return {
      serviceItemId: item.serviceItemId,
      \1,\2 item.unitPrice,
      \1,\2 itemDiscount,
      \1,\2 item.description
    };
  });

  // Apply additional discount if provided
  const discountAmount = data.discountAmount || 0;
  totalAmount -= discountAmount;

  // Generate invoice number
  const invoiceCount = await prisma.bill.count();
  const invoiceNumber = `INV-${new Date().getFullYear()}-${(invoiceCount + 1).toString().padStart(6, '0')}`;

  // Create invoice in database
  const invoice = await prisma.bill.create({
    \1,\2 invoiceNumber,
      \1,\2 data.visitId,
      \1,\2 new Date(),
      \1,\2 data.packageId;
      totalAmount,
      discountAmount,
      discountReason: data.discountReason,
      \1,\2 totalAmount,
      \1,\2 'draft',
      createdBy: 'system', // In a real app, this would be the authenticated user ID
      \1,\2 billItems
      },
    },
    \1,\2 true,
      \1,\2 true,
          \1,\2 true,
          mrn: true,,
    },
  });

  logger.info('Invoice created', { invoiceId: invoice.id, invoiceNumber });

  return createSuccessResponse(invoice);
});
