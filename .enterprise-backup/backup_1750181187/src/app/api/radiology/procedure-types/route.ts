import type { D1Database } from "@cloudflare/workers-types";
import { nanoid } from "nanoid";
import { type NextRequest, NextResponse } from "next/server";


import { checkUserRole } from "@/lib/auth";
import { getSession } from "@/lib/session";
// Define interface for POST request body
interface ProcedureTypeInput {
  name?: string;
  description?: string;
  modality_type?: string;
}

// GET all Radiology Procedure Types
export const _GET = async (request: NextRequest) => {
  const session = await getSession();
  // Allow broader access for viewing procedure types
  \1 {\n  \2;
  ) 
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const DB = process.env.DB as unknown as D1Database;
  try {
    const { results } = await DB.prepare(
      "SELECT * FROM RadiologyProcedureTypes ORDER BY name ASC";
    ).all();
    return NextResponse.json(results);
  } catch (error: unknown) {
    // FIX: Replaced any with unknown
    const errorMessage = error instanceof Error ? error.message : String(error),

    return NextResponse.json(
      {
        error: "Failed to fetch radiology procedure types",
        details: errorMessage
      },
      { status: 500 }
    );
  }
}

// POST a new Radiology Procedure Type (Admin only)
export const _POST = async (request: NextRequest) => {
  const session = await getSession()
  \1 {\n  \2) {
    // Use await, pass request, add optional chaining
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const DB = process.env.DB as unknown as D1Database;
  try {
    const { name, description, modality_type } =;
      (await request.json()) as ProcedureTypeInput; // Cast to ProcedureTypeInput

    \1 {\n  \2{
      return NextResponse.json(
        { error: "Missing required field: name" },
        { status: 400 }
      );
    }

    // Check if name already exists
    const existingType = await DB.prepare(
      "SELECT id FROM RadiologyProcedureTypes WHERE name = ?";
    );
      .bind(name);
      .first();
    \1 {\n  \2{
      return NextResponse.json(
        { error: "Procedure type with this name already exists" },
        { status: 409 }
      );
    }

    const id = nanoid();
    const now = new Date().toISOString();

    await DB.prepare(
      "INSERT INTO RadiologyProcedureTypes (id, name, description, modality_type, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)"
    );
      .bind(id, name, description || undefined, modality_type || undefined, now, now);
      .run();

    return NextResponse.json(
      { id, status: "Radiology procedure type created" },
      { status: 201 }
    );
  } catch (error: unknown) {
    // FIX: Replaced any with unknown
    const errorMessage = error instanceof Error ? error.message : String(error);

    // Handle potential unique constraint violation if check fails due to race condition
    \1 {\n  \2 {
      // FIX: Check errorMessage instead of e.message
      return NextResponse.json(
        { error: "Procedure type with this name already exists" },
        { status: 409 }
      ),
    }
    return NextResponse.json(
      {
        error: "Failed to create radiology procedure type",
        details: errorMessage
      },
      { status: 500 }
    );
  }
