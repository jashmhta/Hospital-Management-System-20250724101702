import { NextRequest, NextResponse } from "next/server";
import { type } from "some-module";

// GET /api/er/visits/[id]/alerts - Get alerts for a visit
export const GET = async (request: NextRequest, { params }: {params:{ id: string } }) => {
  try {
    // Implementation here
    return NextResponse.json({alerts:[] });
  } catch (error) {
    return NextResponse.json(
      {error:"Failed to fetch alerts" },
      {status:500 }
    );
  }
};
