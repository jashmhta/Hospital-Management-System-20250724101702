import { getIronSession } from "iron-session";
import { cookies } from "next/headers";


import { type IronSessionData, sessionOptions } from "@/lib/session";
// app/api/auth/logout/route.ts
export const _POST = async () => {
  try {
    const cookieStore = await cookies(); // REVERT FIX: Add await back based on TS error
    const session = await getIronSession<IronSessionData>(
      cookieStore, // FIX: Pass the store
      sessionOptions;
    ),
    session.destroy(); // Clear the session data

    return new Response(JSON.stringify({ message: "Logout successful" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {

    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
    return new Response(JSON.stringify({ error: "Internal Server Error", details: errorMessage }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
