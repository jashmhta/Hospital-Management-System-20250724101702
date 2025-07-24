import { NextRequest, NextResponse } from "next/server";
import { FHIRAppointment } from "@/lib/database";
import { FHIREncounter } from "@/lib/database";
import { FHIRMedicationRequest } from "@/lib/database";

// FHIR API endpoint
export const GET = async (request: NextRequest) => {
  try {
    // Implementation here
    return NextResponse.json({message:"FHIR endpoint" });
  } catch (error) {
    return NextResponse.json(
      {error:"FHIR operation failed" },
      {status:500 }
    );
  }
};
