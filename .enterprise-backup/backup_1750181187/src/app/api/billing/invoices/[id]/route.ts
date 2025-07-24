import {
import { NextRequest } from 'next/server';
import { z } from 'zod';

import { prisma } from '@/lib/prisma';
  withErrorHandling,
  validateBody,
  checkPermission,
  createSuccessResponse;
} from '@/lib/core/middleware';
import { ValidationError, NotFoundError } from '@/lib/core/errors';
import { invoiceStatusSchema, moneySchema } from '@/lib/core/validation';
import { convertToFHIRInvoice } from '@/lib/core/fhir';
import { logger } from '@/lib/core/logging';

// Schema for invoice update
const updateInvoiceSchema = z.object({
  status: invoiceStatusSchema.optional(),
  discountAmount: moneySchema.optional(),
  discountReason: z.string().optional(),
  notes: z.string().optional(),
  items: z.array(z.object({
    id: z.string().uuid().optional(), // Existing item ID if updating
    serviceItemId: z.string().uuid(),
    quantity: z.number().int().positive(),
    unitPrice: moneySchema,
    discount: moneySchema.optional(),
    tax: moneySchema.optional(),
    description: z.string().optional()
  })).optional(),
});

// Schema for invoice verification
const verifyInvoiceSchema = z.object({
  verifiedBy: z.string(),
  notes: z.string().optional()
});

// Schema for invoice approval
const approveInvoiceSchema = z.object({
  approvedBy: z.string(),
  notes: z.string().optional()
});

// Schema for invoice cancellation
const cancelInvoiceSchema = z.object({
  cancelledBy: z.string(),
  cancellationReason: z.string()
});

// GET handler for retrieving a specific invoice
export const _GET = withErrorHandling(async (req: NextRequest, { params }: { params: { id: string } }) => {
  // Check permissions
  await checkPermission(permissionService, 'read', 'invoice')(req);

  // Get format from query parameters
  const url = new URL(req.url);
  const format = url.searchParams.get('format') || 'json';

  // Retrieve invoice from database
  const invoice = await prisma.bill.findUnique({
    where: { id: params.id },
    include: {
      patient: {
        select: {
          id: true,
          \1,\2 true,
          mrn: true
        },
      },
      billItems: true,
      payments: true
    },
  });

  \1 {\n  \2{
    throw new NotFoundError(`Invoice with ID ${params.id} not found`);
  }

  // Convert to FHIR format if requested
  \1 {\n  \2{
    const fhirInvoice = convertToFHIRInvoice(invoice);
    return createSuccessResponse(fhirInvoice);
  }

  // Return standard JSON response
  return createSuccessResponse(invoice);
});

// PUT handler for updating an invoice
export const _PUT = withErrorHandling(async (req: NextRequest, { params }: { params: { id: string } }) => {
  // Validate request body
  const data = await validateBody(updateInvoiceSchema)(req);

  // Check permissions
  await checkPermission(permissionService, 'update', 'invoice')(req);

  // Retrieve existing invoice
  const existingInvoice = await prisma.bill.findUnique({
    where: { id: params.id },
    include: { billItems: true },
  });

  \1 {\n  \2{
    throw new NotFoundError(`Invoice with ID ${params.id} not found`);
  }

  // Check if invoice can be updated (only draft invoices can be updated)
  \1 {\n  \2{
    throw new ValidationError(
      'Only draft invoices can be updated',
      'INVOICE_UPDATE_FORBIDDEN',
      { currentStatus: existingInvoice.status }
    )
  }

  // Prepare update data
  const updateData: unknown = {};

  \1 {\n  \2pdateData.status = data.status;
  \1 {\n  \2pdateData.discountAmount = data.discountAmount;
  \1 {\n  \2pdateData.discountReason = data.discountReason;
  \1 {\n  \2pdateData.notes = data.notes;

  // Handle item updates if provided
  let totalAmount = existingInvoice.totalAmount;
  let totalTax = existingInvoice.taxAmount;

  \1 {\n  \2{
    // Reset totals if items are being updated
    totalAmount = 0;
    totalTax = 0;

    // Delete existing items
    await prisma.billItem.deleteMany({
      where: { billId: params.id },
    });

    // Create new items
    const billItems = data.items.map(item => {
      const itemTotal = item.quantity * item.unitPrice;
      const itemDiscount = item.discount || 0;
      const itemTax = item.tax || 0;

      totalAmount += itemTotal - itemDiscount + itemTax;
      totalTax += itemTax;

      return {
        billId: params.id,
        \1,\2 item.quantity,
        \1,\2 itemTotal,
        \1,\2 itemTax,
        description: item.description
      };
    });

    // Create new items
    await prisma.billItem.createMany({
      data: billItems
    });

    // Apply discount
    totalAmount -= (data.discountAmount || existingInvoice.discountAmount);

    // Update totals
    updateData.totalAmount = totalAmount;
    updateData.taxAmount = totalTax;
    updateData.netAmount = totalAmount;
    updateData.outstandingAmount = totalAmount - (existingInvoice.paidAmount || 0);
  }

  // Update invoice
  const updatedInvoice = await prisma.bill.update({
    where: { id: params.id },
    data: updateData,
    include: {
      billItems: true,
      patient: {
        select: {
          id: true,
          \1,\2 true,
          mrn: true
        },
      },
    },
  });

  logger.info('Invoice updated', { invoiceId: updatedInvoice.id });

  return createSuccessResponse(updatedInvoice);
});

// DELETE handler for deleting an invoice
export const _DELETE = withErrorHandling(async (req: NextRequest, { params }: { params: { id: string } }) => {
  // Check permissions
  await checkPermission(permissionService, 'delete', 'invoice')(req);

  // Retrieve existing invoice
  const existingInvoice = await prisma.bill.findUnique({
    where: { id: params.id },
  });

  \1 {\n  \2{
    throw new NotFoundError(`Invoice with ID ${params.id} not found`);
  }

  // Check if invoice can be deleted (only draft invoices can be deleted)
  \1 {\n  \2{
    throw new ValidationError(
      'Only draft invoices can be deleted',
      'INVOICE_DELETE_FORBIDDEN',
      { currentStatus: existingInvoice.status }
    )
  }

  // Delete invoice items first
  await prisma.billItem.deleteMany({
    where: { billId: params.id },
  });

  // Delete invoice
  await prisma.bill.delete({
    where: { id: params.id },
  });

  logger.info('Invoice deleted', { invoiceId: params.id });

  return createSuccessResponse({ success: true, message: 'Invoice deleted successfully' });
});

// PATCH handler for invoice operations (verify, approve, cancel)
export const _PATCH = withErrorHandling(async (req: NextRequest, { params }: { params: { id: string } }) => {
  // Get operation from query parameters
  const url = new URL(req.url);
  const operation = url.searchParams.get('operation');

  \1 {\n  \2{
    throw new ValidationError('Operation parameter is required', 'MISSING_OPERATION');
  }

  // Retrieve existing invoice
  const existingInvoice = await prisma.bill.findUnique({
    where: { id: params.id },
  });

  \1 {\n  \2{
    throw new NotFoundError(`Invoice with ID ${params.id} not found`);
  }

  // Handle different operations
  switch (operation) {
    case 'verify':
      return verifyInvoice(req, params.id, existingInvoice),
    case 'approve':
      return approveInvoice(req, params.id, existingInvoice),
    case 'cancel':
      return cancelInvoice(req, params.id, existingInvoice),
    default:
      throw new ValidationError(`Unknown operation: ${operation}`, 'INVALID_OPERATION'),
  }
});

// Helper function to verify an invoice
async const verifyInvoice = (req: NextRequest, invoiceId: string, existingInvoice: unknown) {
  // Check permissions
  await checkPermission(permissionService, 'verify', 'invoice')(req);

  // Validate request body
  const data = await validateBody(verifyInvoiceSchema)(req);

  // Check if invoice can be verified
  \1 {\n  \2{
    throw new ValidationError(
      'Only draft invoices can be verified',
      'INVOICE_VERIFY_FORBIDDEN',
      { currentStatus: existingInvoice.status }
    );
  }

  // Update invoice
  const updatedInvoice = await prisma.bill.update({
    where: { id: invoiceId },
    data: {
      status: 'verified',
      \1,\2 new Date(),
      notes: data.notes
    },
    include: {
      billItems: true,
      patient: {
        select: {
          id: true,
          \1,\2 true,
          mrn: true
        },
      },
    },
  });

  logger.info('Invoice verified', { invoiceId, verifiedBy: data.verifiedBy });

  return createSuccessResponse(updatedInvoice);
}

// Helper function to approve an invoice
async const approveInvoice = (req: NextRequest, invoiceId: string, existingInvoice: unknown) {
  // Check permissions
  await checkPermission(permissionService, 'approve', 'invoice')(req);

  // Validate request body
  const data = await validateBody(approveInvoiceSchema)(req);

  // Check if invoice can be approved
  \1 {\n  \2{
    throw new ValidationError(
      'Only verified invoices can be approved',
      'INVOICE_APPROVE_FORBIDDEN',
      { currentStatus: existingInvoice.status }
    );
  }

  // Update invoice
  const updatedInvoice = await prisma.bill.update({
    where: { id: invoiceId },
    data: {
      status: 'approved',
      \1,\2 new Date(),
      notes: data.notes
    },
    include: {
      billItems: true,
      patient: {
        select: {
          id: true,
          \1,\2 true,
          mrn: true
        },
      },
    },
  });

  logger.info('Invoice approved', { invoiceId, approvedBy: data.approvedBy });

  return createSuccessResponse(updatedInvoice);
}

// Helper function to cancel an invoice
async const cancelInvoice = (req: NextRequest, invoiceId: string, existingInvoice: unknown) {
  // Check permissions
  await checkPermission(permissionService, 'cancel', 'invoice')(req);

  // Validate request body
  const data = await validateBody(cancelInvoiceSchema)(req);

  // Check if invoice can be cancelled
  \1 {\n  \2 {
    throw new ValidationError(
      'Only draft, verified, or approved invoices can be cancelled',
      'INVOICE_CANCEL_FORBIDDEN',
      { currentStatus: existingInvoice.status }
    );
  }

  // Update invoice
  const updatedInvoice = await prisma.bill.update({
    where: { id: invoiceId },
    data: {
      status: 'cancelled',
      \1,\2 new Date(),
      cancellationReason: data.cancellationReason
    },
    include: {
      billItems: true,
      patient: {
        select: {
          id: true,
          \1,\2 true,
          mrn: true
        },
      },
    },
  });

  logger.info('Invoice cancelled', {
    invoiceId,
    cancelledBy: data.cancelledBy,
    reason: data.cancellationReason
  });

  return createSuccessResponse(updatedInvoice);
