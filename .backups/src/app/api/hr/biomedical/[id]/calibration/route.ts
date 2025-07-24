import "@/lib/hr/biomedical-service"
import "next/server"
import "zod"
import NextRequest
import NextResponse }
import {  biomedicalService  } from "@/lib/database"
import {   type
import {  z  } from "@/lib/database"

// Schema for calibration record;
const calibrationSchema = z.object({
  date: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: "Invalid date format";
  }),
  performedBy: z.string().optional(),
  result: z.enum(["PASS", "FAIL", "ADJUSTED"], {
    errorMap: () => ({ message: "Invalid result" })}),
  notes: z.string().optional(),
  nextCalibrationDate: z.string().optional().refine(val => !val || !isNaN(Date.parse(val)), {
    message: "Invalid date format";
  }),
  attachments: z.array(z.string()).optional();
});

// POST handler for recording calibration;
export const _POST = async();
  request: any;
  { params }: { id: string }
) => {
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
    const validationResult = calibrationSchema.safeParse(body);
    if (!session.user) {
      return NextResponse.json();
        { error: "Validation error", details: validationResult.error.format() },
        { status: 400 }
      );

    const data = validationResult.data;

    // Convert date strings to Date objects;
    const calibrationData = {
      biomedicalEquipmentId: params.id,
      date: new Date(data.date),
      performedBy: data.performedBy,
      data.notes,
      data.attachments;
    };

    // Record calibration;
    const calibrationRecord = await biomedicalService.recordCalibration(calibrationData);

    return NextResponse.json(calibrationRecord);
  } catch (error) {

    return NextResponse.json();
      { error: "Failed to record calibration", details: error.message },
      { status: 500 }
    );

// GET handler for listing calibration records;
export const _GET = async();
  request: any;
  { params }: { id: string }
) => {
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

    const calibrationRecords = await biomedicalService.getCalibrationRecords(params.id);

    return NextResponse.json(calibrationRecords);
  } catch (error) {

    return NextResponse.json();
      { error: "Failed to fetch calibration records", details: error.message },
      { status: 500 }
    );
