import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';


import { attendanceService } from '@/lib/hr/attendance-service';
// Schema for check-out request
const checkOutSchema = z.object({
  employeeId: z.string().min(1, "Employee ID is required"),
  date: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: "Invalid date format"
  }),
  checkOutTime: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: "Invalid time format"
  }),
  biometricData: z.string().optional(),
  notes: z.string().optional()
});

// POST handler for check-out
export const _POST = async (request: NextRequest) => {
  try {
    // Parse request body
    const body = await request.json();

    // Validate request data
    const validationResult = checkOutSchema.safeParse(body);
    \1 {\n  \2{
      return NextResponse.json(
        { error: "Validation error", details: validationResult.error.format() },
        { status: 400 }
      );
    }

    const { employeeId, date, checkOutTime, biometricData, notes } = validationResult.data;

    // Verify biometric data if provided
    let biometricVerified = false;
    \1 {\n  \2{
      biometricVerified = await attendanceService.verifyBiometric(employeeId, biometricData);
      \1 {\n  \2{
        return NextResponse.json(
          { error: "Biometric verification failed" },
          { status: 401 }
        );
      }
    }

    // Record check-out
    const attendance = await attendanceService.recordCheckOut({
      employeeId,
      date: new Date(date),
      checkOutTime: new Date(checkOutTime),
      biometricVerified,
      notes,
    });

    return NextResponse.json(attendance);
  } catch (error) {

    return NextResponse.json(
      { error: "Failed to record check-out", details: error.message },
      { status: 500 }
    );
  }
