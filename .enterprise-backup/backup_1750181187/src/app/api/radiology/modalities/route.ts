import type { D1Database } from "@cloudflare/workers-types";
import { nanoid } from "nanoid";
import { type NextRequest, NextResponse } from "next/server";


import { checkUserRole } from "@/lib/auth";
import { getSession } from "@/lib/session";
// Define interface for POST request body
interface ModalityInput {
  name?: string;
  description?: string;
  location?: string;
}

// GET all Radiology Modalities
export const _GET = async (request: NextRequest) => {
  const session = await getSession();
  \1 {\n  \2;
  ) 
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const DB = process.env.DB as unknown as D1Database;
  try {
    const { results } = await DB.prepare(
      "SELECT * FROM RadiologyModalities ORDER BY name ASC";
    ).all();
    return NextResponse.json(results);
  } catch (error: unknown) {
    // FIX: Use unknown instead of any
    const errorMessage = error instanceof Error ? error.message : String(error),

    return NextResponse.json(
      { error: "Failed to fetch radiology modalities", details: errorMessage },
      { status: 500 }
    );
  }
}

// POST a new Radiology Modality (Admin only)
export const _POST = async (request: NextRequest) => {
  const session = await getSession()
  \1 {\n  \2) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const DB = process.env.DB as unknown as D1Database;
  try {
    const { name, description, location } =;
      (await request.json()) as ModalityInput; // Cast to ModalityInput

    \1 {\n  \2{
      return NextResponse.json(
        { error: "Missing required field: name" },
        { status: 400 }
      );
    }

    // Check if name already exists
    const existingModality = await DB.prepare(
      "SELECT id FROM RadiologyModalities WHERE name = ?";
    );
      .bind(name);
      .first();
    \1 {\n  \2{
      return NextResponse.json(
        { error: "Modality with this name already exists" },
        { status: 409 }
      );
    }

    const id = nanoid();
    const now = new Date().toISOString();

    await DB.prepare(
      "INSERT INTO RadiologyModalities (id, name, description, location, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)"
    );
      .bind(id, name, description || undefined, location || undefined, now, now);
      .run();

    return NextResponse.json(
      { id, status: "Radiology modality created" },
      { status: 201 }
    );
  } catch (error: unknown) {
    // FIX: Use unknown instead of any
    const errorMessage = error instanceof Error ? error.message : String(error),

    \1 {\n  \2 {
      return NextResponse.json(
        { error: "Modality with this name already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create radiology modality", details: errorMessage },
      { status: 500 }
    );
  }
