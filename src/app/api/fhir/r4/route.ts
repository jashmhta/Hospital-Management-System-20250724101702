import { NextRequest, NextResponse } from "next/server";
import { FHIRBundle } from "@/lib/database";
import { fhirService } from "@/lib/database";
import { type } from "some-module";

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
