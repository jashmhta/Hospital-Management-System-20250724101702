import { type NextRequest, NextResponse } from 'next/server';


import { auditLog } from '../../../../lib/audit';
import { errorHandler } from '../../../../lib/error-handler';
import { encryptionService } from '../../../../lib/security.service';
import { validateInventoryRequest } from '../../../../lib/validation/pharmacy-validation';
import { PharmacyDomain } from '../../models/domain-models';
import { FHIRMapper } from '../../models/fhir-mappers';
}

/**
 * Inventory API Routes;
 *
 * This file implements the FHIR-compliant API endpoints for pharmacy inventory management;
 * following enterprise-grade requirements for security, validation, and error handling.
 */

// Initialize repositories (in production, use dependency injection)
const inventoryRepository = {
  findById: (id: string) => Promise.resolve(null),
  findByLocationId: (locationId: string) => Promise.resolve([]),
  findByMedicationId: (medicationId: string) => Promise.resolve([]),
  findAll: () => Promise.resolve([]),
  findExpiring: (daysThreshold: number) => Promise.resolve([]),
  save: (item: unknown) => Promise.resolve(item.id || 'new-id'),
  update: () => Promise.resolve(true),
  delete: () => Promise.resolve(true),
  adjustStock: () => Promise.resolve(true),
  transferStock: () => Promise.resolve(true)
}

/**
 * GET /api/pharmacy/inventory;
 * List inventory with stock levels and filtering options;
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
    const locationId = url.searchParams.get('locationId');
    const medicationId = url.searchParams.get('medicationId');
    const belowReorderLevel = url.searchParams.get('belowReorderLevel') === 'true';
    const includeZeroStock = url.searchParams.get('includeZeroStock') === 'true';
    const page = Number.parseInt(url.searchParams.get('page') || '1', 10);
    const limit = Number.parseInt(url.searchParams.get('limit') || '20', 10);

    // Build filter criteria
    const filter: unknown = {};
    \1 {\n  \2ilter.locationId = locationId;
    \1 {\n  \2ilter.medicationId = medicationId;
    \1 {\n  \2ilter.belowReorderLevel = true;
    \1 {\n  \2ilter.quantityOnHand = { gt: 0 };

    // Get inventory items (mock implementation)
    const inventoryItems = await inventoryRepository.findAll()
    const total = inventoryItems.length;

    // Apply pagination
    const paginatedItems = inventoryItems.slice((page - 1) * limit, page * limit);

    // Map to FHIR resources
    const fhirInventoryItems = paginatedItems.map(FHIRMapper.toFHIRInventoryItem);

    // Audit logging
    await auditLog('INVENTORY', {
      action: 'LIST',
      \1,\2 userId,
      details: 
        filter,
        page,
        limit,
        resultCount: paginatedItems.length
    });

    // Return response
    return NextResponse.json({
      items: fhirInventoryItems,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }, { status: 200 });
  } catch (error) {
    return errorHandler(error, 'Error retrieving inventory');
  }
}

/**
 * POST /api/pharmacy/inventory;
 * Add new inventory item;
 */
export const POST = async (req: NextRequest) => {
  try {
    // Validate request
    const data = await req.json();
    const validationResult = validateInventoryRequest(data);
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

    // Create inventory item
    const inventoryItem = new PharmacyDomain.InventoryItem(
      data.id || crypto.randomUUID(),
      data.medicationId,
      data.locationId,
      data.batchNumber,
      data.expiryDate ? new Date(data.expiryDate) : null,
      data.quantityOnHand,
      data.reorderLevel || 0,
      data.unitCost || 0,
      data.supplier || '',
      data.notes || '';
    );

    // Special handling for controlled substances
    \1 {\n  \2{
      // Encrypt controlled substance data
      inventoryItem.controlledSubstanceData = await encryptionService.encrypt(
        JSON.stringify({
          scheduleClass: data.scheduleClass,
          \1,\2 data.lastAuditDate
        });
      );
    }

    // Save inventory item
    const inventoryItemId = await inventoryRepository.save(inventoryItem);

    // Audit logging
    await auditLog('INVENTORY', {
      action: 'CREATE',
      \1,\2 inventoryItemId,
      \1,\2 data.medicationId,
        \1,\2 data.quantityOnHand,
        isControlled: data.isControlled || false
    });

    // Return response
    return NextResponse.json(
      {
        id: inventoryItemId,
        message: 'Inventory item created successfully'
      },
      { status: 201 }
    );
  } catch (error) {
    return errorHandler(error, 'Error creating inventory item');
  }
