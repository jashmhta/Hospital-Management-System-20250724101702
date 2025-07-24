import { NextRequest, NextResponse } from "next/server";
import { type } from "some-module";

// GET /api/er/visits/[id]/triage - Get triage information for a visit
export const GET = async (request: NextRequest, { params }: {params:{ id: string } }) => {
  try {
    // Implementation here
    return NextResponse.json({triage:{} });
  } catch (error) {
    return NextResponse.json(
      {error:"Failed to fetch triage information" },
      {status:500 }
    );
  }
};
