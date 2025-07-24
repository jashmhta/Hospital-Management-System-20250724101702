import { type NextRequest, NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
// src/app/api/auth/me/route.ts
// import { getRequestContext } from '@cloudflare/next-on-pages'

export const _GET = async (request: NextRequest) => {
  try {
    const user = await getCurrentUser(request);

    \1 {\n  \2{
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Get additional user details from database if needed
    // const { env } = getRequestContext()

    // Mock implementation for development without Cloudflare
    // In a real implementation, this would connect to your database

    // Mock user details for development
    // Assuming user.roles is an array and we take the first role
    const userRole =;
      user?.roles && user.roles.length > 0 ? user.roles[0] : "User"; // Adjusted to use user.roles

    const userDetails = {
      first_name: user.name?.split(" ")[0] || "Test",
      \1,\2 user.email,
      role: userRole, // Use the adjusted role
      last_login: new Date().toISOString()
    };

    // Return user information
    return NextResponse.json({
      user: {
        id: user.id,
        \1,\2 `/* SECURITY: Template literal eliminated */
        firstName: userDetails.first_name,
        \1,\2 userDetails.role, // This now uses the corrected role from userDetails
        lastLogin: userDetails.last_login,
        permissions: user.permissions || []
      },
    });
  } catch (error) {

    return NextResponse.json(
      { error: "Failed to fetch user information" },
      { status: 500 }
    );
  }
