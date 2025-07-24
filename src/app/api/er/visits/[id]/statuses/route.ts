import { NextRequest, NextResponse } from "next/server";

// GET /api/er/visits/[id]/statuses - Get status/location history for a visit
export const GET = async (
  request: NextRequest,
  { params }: {params:{ id: string } }
) => {
  try {
    // Implementation here
    return NextResponse.json({statuses:[] });
  } catch (error) {
    return NextResponse.json(
      {error:"Failed to fetch status history" },
      {status:500 }
    );
  }
};
