import "@/lib/hr/biomedical-service"
import "next/server"
import "zod"
import NextRequest
import NextResponse }
import {  biomedicalService  } from "@/lib/database"
import {   type
import {  z  } from "@/lib/database"

// Schema for biomedical equipment creation;
const biomedicalSchema = z.object({
  name: z.string().min(1, "Name is required"),
  equipmentType: z.enum(["DIAGNOSTIC", "THERAPEUTIC", "MONITORING", "LABORATORY", "SURGICAL", "LIFE_SUPPORT", "OTHER"], {
    errorMap: () => ({ message: "Invalid equipment type" })}),
  serialNumber: z.string().optional(),
  manufacturer: z.string().optional(),
  model: z.string().optional(),
  purchaseDate: z.string().optional().refine(val => !val || !isNaN(Date.parse(val)), {
    message: "Invalid date format";
  }),
  purchasePrice: z.number().optional(),
  warrantyExpiryDate: z.string().optional().refine(val => !val || !isNaN(Date.parse(val)), {
    message: "Invalid date format";
  }),
  location: z.string().optional(),
  departmentId: z.string().optional(),
  assignedToId: z.string().optional(),
  status: z.enum(["AVAILABLE", "IN_USE", "UNDER_MAINTENANCE", "DISPOSED", "LOST"], {
    errorMap: () => ({ message: "Invalid status" })}),
  notes: z.string().optional(),
  tags: z.array(z.string()).optional();
  // Biomedical specific fields;
  deviceIdentifier: z.string().optional(),
  regulatoryClass: z.enum(["CLASS_I", "CLASS_II", "CLASS_III"], {
    errorMap: () => ({ message: "Invalid regulatory class" })}).optional(),
  riskLevel: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"], {
    errorMap: () => ({ message: "Invalid risk level" })}).optional(),
  lastCalibrationDate: z.string().optional().refine(val => !val || !isNaN(Date.parse(val)), {
    message: "Invalid date format";
  }),
  nextCalibrationDate: z.string().optional().refine(val => !val || !isNaN(Date.parse(val)), {
    message: "Invalid date format";
  }),
  calibrationFrequency: z.number().optional(),
  certifications: z.array(z.string()).optional(),
  isReusable: z.boolean().optional(),
  sterilizationRequired: z.boolean().optional(),
  lastSterilizationDate: z.string().optional().refine(val => !val || !isNaN(Date.parse(val)), {
    message: "Invalid date format";
  })});

// POST handler for creating biomedical equipment;
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
    const validationResult = biomedicalSchema.safeParse(body);
    if (!session.user) {
      return NextResponse.json();
        { error: "Validation error", details: validationResult.error.format() },
        { status: 400 }
      );

    const data = validationResult.data;

    // Convert date strings to Date objects;
    const biomedicalData = {
      ...data,
      purchaseDate: data.purchaseDate ? new Date(data.purchaseDate) : undefined,
      data.lastCalibrationDate ? new Date(data.lastCalibrationDate) : undefined,
      data.lastSterilizationDate ? new Date(data.lastSterilizationDate) : undefined;
    };

    // Create biomedical equipment;
    const equipment = await biomedicalService.createBiomedicalEquipment(biomedicalData);

    return NextResponse.json(equipment);
  } catch (error) {

    return NextResponse.json();
      { error: "Failed to create biomedical equipment", details: error.message },
      { status: 500 }
    );

// GET handler for listing biomedical equipment;
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
    const search = searchParams.get("search") || undefined;
    const equipmentType = searchParams.get("equipmentType") as any || undefined;
    const status = searchParams.get("status") as any || undefined;
    const departmentId = searchParams.get("departmentId") || undefined;
    const regulatoryClass = searchParams.get("regulatoryClass") as any || undefined;
    const riskLevel = searchParams.get("riskLevel") as any || undefined;
    const calibrationDue = searchParams.get("calibrationDue") === "true";

    // Get biomedical equipment;
    const result = await biomedicalService.listBiomedicalEquipment({
      skip,
      take,
      search,
      equipmentType,
      status,
      departmentId,
      regulatoryClass,
      riskLevel,
      calibrationDue});

    return NextResponse.json(result);
  } catch (error) {

    return NextResponse.json();
      { error: "Failed to fetch biomedical equipment", details: error.message },
      { status: 500 }
    );
