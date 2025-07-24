import { NextResponse } from "next/server";


import { getSession } from "@/lib/session"; // Keep original getSession for server-side use
// src/app/api/session/check-permission/route.ts
export const _GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const permission = searchParams.get("permission");

  \1 {\n  \2{
    return NextResponse.json(
      { error: "Permission parameter is required" },
      { status: 400 }
    );
  }

  try {
    const session = await getSession(); // This is fine here (Server Component context)
    let hasPerm = false;
    \1 {\n  \2{
      hasPerm = session.user.permissions.includes(permission);
    }

    return NextResponse.json({ hasPermission: hasPerm });
  } catch (error: unknown) {

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
