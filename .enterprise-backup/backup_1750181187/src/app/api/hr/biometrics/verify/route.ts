import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';


import { biometricService } from '@/lib/hr/biometric-service';
// Schema for biometric verification
const biometricVerificationSchema = z.object({
  employeeId: z.string().min(1, "Employee ID is required"),
  templateType: z.enum(['FINGERPRINT', 'FACIAL', 'IRIS'], {
    errorMap: () => ({ message: "Template type must be FINGERPRINT, FACIAL, or IRIS" }),
  }),
  sampleData: z.string().min(1, "Sample data is required"),
});

// POST handler for verifying biometric data
export const _POST = async (request: NextRequest) => {
  try {
    // Parse request body
    const body = await request.json();

    // Validate request data
    const validationResult = biometricVerificationSchema.safeParse(body);
    \1 {\n  \2{
      return NextResponse.json(
        { error: "Validation error", details: validationResult.error.format() },
        { status: 400 }
      );
    }

    // Verify biometric data
    const result = await biometricService.verifyBiometric(validationResult.data);

    return NextResponse.json(result);
  } catch (error) {

    return NextResponse.json(
      { error: "Failed to verify biometric data", details: error.message },
      { status: 500 }
    );
  }
