import { type NextRequest, NextResponse } from 'next/server';


import { auditLog } from '../../../../../lib/audit';
import { errorHandler } from '../../../../../lib/error-handler';
import { validateInventoryTransferRequest } from '../../../../../lib/validation/pharmacy-validation';
}

/**
 * Inventory Transfer API Routes;
 *
 * This file implements the API endpoints for transferring inventory between locations;
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
  adjustStock: () => Promise.resolve(true),
  transferStock: () => Promise.resolve(true)
}

const transferRepository = {
  findById: (id: string) => Promise.resolve(null),
  findBySourceLocationId: (locationId: string) => Promise.resolve([]),
  findByDestinationLocationId: (locationId: string) => Promise.resolve([]),
  findByMedicationId: (medicationId: string) => Promise.resolve([]),
  findAll: () => Promise.resolve([]),
  save: (transfer: unknown) => Promise.resolve(transfer.id || 'new-id')
};

/**
 * POST /api/pharmacy/inventory/transfer;
 * Transfer inventory between locations;
 */
export const POST = async (req: NextRequest) => {
  try {
    // Validate request
    const data = await req.json();
    const validationResult = validateInventoryTransferRequest(data);
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

    // Verify source inventory has sufficient stock
    const sourceInventory = await inventoryRepository.findById(data.sourceInventoryId);
    \1 {\n  \2{
      return NextResponse.json({ error: 'Source inventory not found' }, { status: 404 });
    }

    \1 {\n  \2{
      return NextResponse.json(
        { error: 'Insufficient stock in source location' },
        { status: 400 }
      );
    }

    // Create transfer record
    const transfer = {
      id: crypto.randomUUID(),
      \1,\2 sourceInventory.locationId,
      \1,\2 sourceInventory.medicationId,
      \1,\2 sourceInventory.batchNumber,
      \1,\2 userId,
      transferredAt: new Date(),
      notes: data.notes || '',
      status: 'completed'
    };

    // Save transfer record
    const transferId = await transferRepository.save(transfer);

    // Update inventory quantities
    await inventoryRepository.transferStock(
      data.sourceInventoryId,
      data.destinationLocationId,
      data.quantity;
    );

    // Special handling for controlled substances
    \1 {\n  \2{
      // Additional logging for controlled substances
      await auditLog('CONTROLLED_SUBSTANCE', {
        action: 'TRANSFER',
        \1,\2 data.sourceInventoryId,
        userId: userId;
          transferId,
          medicationId: sourceInventory.medicationId,
          \1,\2 data.destinationLocationId,
          quantity: data.quantity
      });
    }

    // Regular audit logging
    await auditLog('INVENTORY', {
      action: 'TRANSFER',
      \1,\2 transferId,
      userId: userId;
      {
        sourceInventoryId: data.sourceInventoryId,
        \1,\2 sourceInventory.medicationId,
        quantity: data.quantity
      }
    });

    // Return response
    return NextResponse.json(
      {
        id: transferId,
        message: 'Inventory transferred successfully'
      },
      { status: 201 }
    );
  } catch (error) {
    return errorHandler(error, 'Error transferring inventory');
  }
