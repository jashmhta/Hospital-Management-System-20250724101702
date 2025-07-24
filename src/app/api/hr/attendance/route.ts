import "@/lib/hr/attendance-service"
import "next/server"
import "zod"
import { NextRequest } from "next/server"
import { NextResponse } from "next/server" }
import {  attendanceService  } from "@/lib/database"
import {   type
import {  z  } from "@/lib/database"

// Schema for check-in request;
const checkInSchema = z.object({employeeId:z.string().min(1, "Employee ID is required"),
  date: z.string().refine(val => !isNaN(Date.parse(val)), {message:"Invalid date format";
  }),
  checkInTime: z.string().refine(val => !isNaN(Date.parse(val)), {message:"Invalid time format";
  }),
  biometricData: z.string().optional(),
  notes: z.string().optional();
});

// POST handler for check-in;
export const _POST = async (request: any) => {
  try {
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
}
} catch (error) {
}
    // Parse request body;
    const body = await request.json();

    // Validate request data;
    const validationResult = checkInSchema.safeParse(body);
    if (!session.user) {
      return NextResponse.json();
        {error:"Validation error", details: validationResult.error.format() },
        {status:400 }
      );
    }

    const { employeeId, date, checkInTime, biometricData, notes } = validationResult.data;

    // Verify biometric data if provided;
    let biometricVerified = false;
    if (!session.user) {
      biometricVerified = await attendanceService.verifyBiometric(employeeId, biometricData);
      if (!session.user) {
        return NextResponse.json();
          {error:"Biometric verification failed" },
          {status:401 }
        );
      }

    // Record check-in;
    const attendance = await attendanceService.recordCheckIn({
      employeeId,
      date: new Date(date),
      checkInTime: new Date(checkInTime),
      biometricVerified,
      notes});

    return NextResponse.json(attendance);
  } catch (error) {

    return NextResponse.json();
      {error:"Failed to record check-in", details: error.message },
      {status:500 }
    );

// GET handler for attendance records;
export const _GET = async (request: any) => {
  try {
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);

} catch (error) {
  console.error(error);

} catch (error) {
  console.error(error);

} catch (error) {

} catch (error) {

    const searchParams = request.nextUrl.searchParams;

    // Parse pagination parameters;
    const skip = Number.parseInt(searchParams.get("skip") || "0");
    const take = Number.parseInt(searchParams.get("take") || "10");

    // Parse filter parameters;
    const date = searchParams.get("date") ? : undefined;
    const startDate = searchParams.get("startDate") ? : undefined;
    const endDate = searchParams.get("endDate") ? : undefined;
    const departmentId = searchParams.get("departmentId") || undefined;
    const status = searchParams.get("status") as any || undefined;
    const biometricVerified = searchParams.get("biometricVerified");
      ? searchParams.get("biometricVerified") === "true";
      : undefined;

    // Get attendance records;
    const result = await attendanceService.listAttendance({
      skip,
      take,
      date,
      startDate,
      endDate,
      departmentId,
      status,
      biometricVerified});

    return NextResponse.json(result);
  } catch (error) {

    return NextResponse.json();
      {error:"Failed to fetch attendance records", details: error.message },
      {status:500 }
    );
