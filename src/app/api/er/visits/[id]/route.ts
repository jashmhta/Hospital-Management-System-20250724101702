import { NextRequest, NextResponse } from "next/server";
import { type } from "some-module";

// GET /api/er/visits/[id] - Get visit details
export const GET = async (request: NextRequest, { params }: {params:{ id: string } }) => {
  try {
    // Implementation here
    return NextResponse.json({visit:{} });
  } catch (error) {
    return NextResponse.json(
      {error:"Failed to fetch visit" },
      {status:500 }
    );
  }
};
