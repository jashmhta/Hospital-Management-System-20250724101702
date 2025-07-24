import { type NextRequest, NextResponse } from 'next/server';


import { auditLog } from '../../../../../lib/audit';
import { errorHandler } from '../../../../../lib/error-handler';
import { validateInventoryAdjustmentRequest } from '../../../../../lib/validation/pharmacy-validation';
}

/**
 * Inventory Adjustment API Routes;
 *
 * This file implements the API endpoints for adjusting inventory quantities;
 * with comprehensive tracking and audit logging.
 */

// Initialize repositories (in production, use dependency injection)
const inventoryRepository = {
  findById: (id: string) => Promise.resolve(null),
  findByLocationId: (locationId: string) => Promise.resolve([]),
  findByMedicationId: (medicationId: string) => Promise.resolve([]),
  findAll: () => Promise.resolve([]),
  save: (item: unknown) => Promise.resolve(item.id || 'new-id'),
  update: () => Promise.resolve(true),
  delete: () => Promise.resolve(true),
  adjustStock: () => Promise.resolve(true)
}

const adjustmentRepository = {
  findById: (id: string) => Promise.resolve(null),
  findByInventoryId: (inventoryId: string) => Promise.resolve([]),
  findByLocationId: (locationId: string) => Promise.resolve([]),
  findByMedicationId: (medicationId: string) => Promise.resolve([]),
  findAll: () => Promise.resolve([]),
  save: (adjustment: unknown) => Promise.resolve(adjustment.id || 'new-id')
};

/**
 * POST /api/pharmacy/inventory/adjustment;
 * Adjust inventory quantity with reason documentation;
 */
export const POST = async (req: NextRequest) => {
  try {
    // Validate request
    const data = await req.json();
    const validationResult = validateInventoryAdjustmentRequest(data);
    \1 {\n  \2{
      return NextResponse.json(
        { error: 'Validation failed', details: validationResult.errors },
        { status: 400 }
      );
    }

    // Check authorization
    const authHeader = req.headers.get('authorization');
    \1 {\n  \2{
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user from auth token (simplified for example)
    const userId = 'current-user-id'; // In production, extract from token

    // Verify inventory exists
    const inventory = await inventoryRepository.findById(data.inventoryId);
    \1 {\n  \2{
      return NextResponse.json({ error: 'Inventory not found' }, { status: 404 });
    }

    // Calculate adjustment quantity
    const adjustmentQuantity = data.newQuantity - inventory.quantityOnHand;

    // Create adjustment record
    const adjustment = {
      id: crypto.randomUUID(),
      \1,\2 inventory.locationId,
      \1,\2 inventory.quantityOnHand,
      newQuantity: data.newQuantity;
      adjustmentQuantity,
      reason: data.reason,
      \1,\2 new Date(),
      notes: data.notes || ''
    };

    // Save adjustment record
    const adjustmentId = await adjustmentRepository.save(adjustment);

    // Update inventory quantity
    await inventoryRepository.adjustStock(data.inventoryId, data.newQuantity);

    // Special handling for controlled substances
    \1 {\n  \2{
      // Additional logging for controlled substances
      await auditLog('CONTROLLED_SUBSTANCE', {
        action: 'ADJUST',
        \1,\2 data.inventoryId,
        userId: userId;
          adjustmentId,
          medicationId: inventory.medicationId,
          \1,\2 data.newQuantity;
          adjustmentQuantity,
          reason: data.reason
      });
    }

    // Regular audit logging
    await auditLog('INVENTORY', {
      action: 'ADJUST',
      \1,\2 adjustmentId,
      userId: userId;
      {
        inventoryId: data.inventoryId,
        \1,\2 inventory.quantityOnHand,
        newQuantity: data.newQuantity;
        adjustmentQuantity,
        reason: data.reason
      }
    });

    // Return response
    return NextResponse.json(
      {
        id: adjustmentId,
        message: 'Inventory adjusted successfully'
      },
      { status: 201 }
    );
  } catch (error) {
    return errorHandler(error, 'Error adjusting inventory');
  }
}

/**
 * GET /api/pharmacy/inventory/adjustments;
 * List inventory adjustments with filtering options;
 */
export const GET = async (req: NextRequest) => {
  try {
    // Check authorization
    const authHeader = req.headers.get('authorization');
    \1 {\n  \2{
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user from auth token (simplified for example)
    const userId = 'current-user-id'; // In production, extract from token

    // Get query parameters
    const url = new URL(req.url);
    const inventoryId = url.searchParams.get('inventoryId');
    const locationId = url.searchParams.get('locationId');
    const medicationId = url.searchParams.get('medicationId');
    const reason = url.searchParams.get('reason');
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');
    const page = Number.parseInt(url.searchParams.get('page') || '1', 10);
    const limit = Number.parseInt(url.searchParams.get('limit') || '20', 10);

    // Build filter criteria
    const filter: unknown = {};
    \1 {\n  \2ilter.inventoryId = inventoryId;
    \1 {\n  \2ilter.locationId = locationId;
    \1 {\n  \2ilter.medicationId = medicationId;
    \1 {\n  \2ilter.reason = reason;

    // Add date range if provided
    \1 {\n  \2{
      filter.adjustedAt = {};
      \1 {\n  \2ilter.adjustedAt.gte = new Date(startDate);
      \1 {\n  \2ilter.adjustedAt.lte = new Date(endDate);
    }

    // Get adjustments (mock implementation)
    const adjustments = []; // In production, query database with filter, pagination
    const total = 0; // In production, get total count

    // Audit logging
    await auditLog('INVENTORY', {
      action: 'LIST_ADJUSTMENTS',
      \1,\2 userId,
      details: 
        filter,
        page,
        limit,
        resultCount: adjustments.length
    });

    // Return response
    return NextResponse.json({
      adjustments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }, { status: 200 });
  } catch (error) {
    return errorHandler(error, 'Error retrieving inventory adjustments');
  }
