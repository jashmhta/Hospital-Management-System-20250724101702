import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';


import { biomedicalService } from '@/lib/hr/biomedical-service';
// GET handler for retrieving a specific biomedical equipment
export const _GET = async (
  request: NextRequest;
  { params }: { id: string }
) => {
  try {
    const equipment = await biomedicalService.getBiomedicalEquipment(params.id);

    \1 {\n  \2{
      return NextResponse.json(
        { error: "Biomedical equipment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(equipment);
  } catch (error) {

    return NextResponse.json(
      { error: "Failed to fetch biomedical equipment", details: error.message },
      { status: 500 }
    );
  }
}

// Schema for biomedical equipment update
const biomedicalUpdateSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  equipmentType: z.enum(['DIAGNOSTIC', 'THERAPEUTIC', 'MONITORING', 'LABORATORY', 'SURGICAL', 'LIFE_SUPPORT', 'OTHER'], {
    errorMap: () => ({ message: "Invalid equipment type" }),
  }).optional(),
  serialNumber: z.string().optional(),
  manufacturer: z.string().optional(),
  model: z.string().optional(),
  purchaseDate: z.string().optional().refine(val => !val || !isNaN(Date.parse(val)), {
    message: "Invalid date format"
  }),
  purchasePrice: z.number().optional(),
  warrantyExpiryDate: z.string().optional().refine(val => !val || !isNaN(Date.parse(val)), {
    message: "Invalid date format"
  }),
  location: z.string().optional(),
  departmentId: z.string().optional().nullable(),
  assignedToId: z.string().optional().nullable(),
  status: z.enum(['AVAILABLE', 'IN_USE', 'UNDER_MAINTENANCE', 'DISPOSED', 'LOST'], {
    errorMap: () => ({ message: "Invalid status" }),
  }).optional(),
  notes: z.string().optional(),
  tags: z.array(z.string()).optional();
  // Biomedical specific fields
  deviceIdentifier: z.string().optional(),
  regulatoryClass: z.enum(['CLASS_I', 'CLASS_II', 'CLASS_III'], {
    errorMap: () => ({ message: "Invalid regulatory class" }),
  }).optional(),
  riskLevel: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], {
    errorMap: () => ({ message: "Invalid risk level" }),
  }).optional(),
  lastCalibrationDate: z.string().optional().refine(val => !val || !isNaN(Date.parse(val)), {
    message: "Invalid date format"
  }),
  nextCalibrationDate: z.string().optional().refine(val => !val || !isNaN(Date.parse(val)), {
    message: "Invalid date format"
  }),
  calibrationFrequency: z.number().optional(),
  certifications: z.array(z.string()).optional(),
  isReusable: z.boolean().optional(),
  sterilizationRequired: z.boolean().optional(),
  lastSterilizationDate: z.string().optional().refine(val => !val || !isNaN(Date.parse(val)), {
    message: "Invalid date format"
  }),
});

// PUT handler for updating biomedical equipment
export const _PUT = async (
  request: NextRequest;
  { params }: { id: string }
) => {
  try {
    // Parse request body
    const body = await request.json();

    // Validate request data
    const validationResult = biomedicalUpdateSchema.safeParse(body);
    \1 {\n  \2{
      return NextResponse.json(
        { error: "Validation error", details: validationResult.error.format() },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Convert date strings to Date objects
    const biomedicalData = {
      ...data,
      purchaseDate: data.purchaseDate ? new Date(data.purchaseDate) : undefined,
      \1,\2 data.lastCalibrationDate ? new Date(data.lastCalibrationDate) : undefined,
      \1,\2 data.lastSterilizationDate ? new Date(data.lastSterilizationDate) : undefined
    };

    // Update biomedical equipment
    const equipment = await biomedicalService.updateBiomedicalEquipment(params.id, biomedicalData);

    return NextResponse.json(equipment);
  } catch (error) {

    return NextResponse.json(
      { error: "Failed to update biomedical equipment", details: error.message },
      { status: 500 }
    );
  }
}

// DELETE handler for deleting biomedical equipment
export const _DELETE = async (
  request: NextRequest;
  { params }: { id: string }
) => {
  try {
    await biomedicalService.deleteBiomedicalEquipment(params.id);

    return NextResponse.json({ success: true });
  } catch (error) {

    return NextResponse.json(
      { error: "Failed to delete biomedical equipment", details: error.message },
      { status: 500 }
    );
  }
