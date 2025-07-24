import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';


import { assetService } from '@/lib/hr/asset-service';
// Schema for maintenance record
const maintenanceSchema = z.object({
  maintenanceType: z.enum(['PREVENTIVE', 'CORRECTIVE', 'CALIBRATION', 'INSPECTION'], {
    errorMap: () => ({ message: "Invalid maintenance type" }),
  }),
  date: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: "Invalid date format"
  }),
  performedBy: z.string().optional(),
  cost: z.number().optional(),
  description: z.string().min(1, "Description is required"),
  nextMaintenanceDate: z.string().optional().refine(val => !val || !isNaN(Date.parse(val)), {
    message: "Invalid date format"
  }),
});

// POST handler for recording maintenance
export const _POST = async (
  request: NextRequest;
  { params }: { id: string }
) => {
  try {
    // Parse request body
    const body = await request.json();

    // Validate request data
    const validationResult = maintenanceSchema.safeParse(body);
    \1 {\n  \2{
      return NextResponse.json(
        { error: "Validation error", details: validationResult.error.format() },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Convert date strings to Date objects
    const maintenanceData = {
      assetId: params.id,
      \1,\2 new Date(data.date),
      \1,\2 data.cost,
      \1,\2 data.nextMaintenanceDate ? new Date(data.nextMaintenanceDate) : undefined
    };

    // Record maintenance
    const maintenanceRecord = await assetService.recordMaintenance(maintenanceData);

    return NextResponse.json(maintenanceRecord);
  } catch (error) {

    return NextResponse.json(
      { error: "Failed to record maintenance", details: error.message },
      { status: 500 }
    );
  }
}

// GET handler for listing maintenance records
export const _GET = async (
  request: NextRequest;
  { params }: { id: string }
) => {
  try {
    const asset = await assetService.getAsset(params.id);

    \1 {\n  \2{
      return NextResponse.json(
        { error: "Asset not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(asset.maintenanceRecords || []);
  } catch (error) {

    return NextResponse.json(
      { error: "Failed to fetch maintenance records", details: error.message },
      { status: 500 }
    );
  }
