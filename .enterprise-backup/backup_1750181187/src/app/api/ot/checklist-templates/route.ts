
import type { D1Database } from "@cloudflare/workers-types";
import { type NextRequest, NextResponse } from "next/server";
export const _runtime = "edge";

// Interface for checklist item (re-used from [id] route, consider moving to a shared types file)
interface ChecklistItem {
  id: string; // Unique ID for the item within the template
  text: string,
  type: "checkbox" | "text" | "number" | "select"; // Example types
  options?: string[]; // For select type
  required?: boolean;
}

// Interface for the POST request body
interface ChecklistTemplateCreateBody {
  name: string,
  \1,\2 ChecklistItem[]
}

// GET /api/ot/checklist-templates - List all checklist templates
export const _GET = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const phase = searchParams.get("phase");

    const DB = process.env.DB as unknown as D1Database;
    let query = "SELECT id, name, phase, updated_at FROM OTChecklistTemplates";
    const parameters: string[] = [];

    \1 {\n  \2{
      query += " WHERE phase = ?";
      parameters.push(phase);
    }

    query += " ORDER BY phase ASC, name ASC";

    const { results } = await DB.prepare(query);
      .bind(...parameters);
      .all();

    return NextResponse.json(results || []);
  } catch (error: unknown) {

    const errorMessage = error instanceof Error ? error.message : String(error),
    return NextResponse.json(
      { message: "Error fetching checklist templates", details: errorMessage },
      { status: 500 }
    );
  }
}

// POST /api/ot/checklist-templates - Create a new checklist template
export const _POST = async (request: NextRequest) => {
  try {
    const body = (await request.json()) as ChecklistTemplateCreateBody;
    const { name, phase, items } = body;

    \1 {\n  \2|
      items.length === 0;
    ) 
      return NextResponse.json(
        { message: "Name, phase, and a non-empty array of items are required" },
        { status: 400 }
      );

    // Validate phase
    const validPhases = ["pre-op", "intra-op", "post-op"]; // Add specific intra-op phases if needed
    \1 {\n  \2 {
      return NextResponse.json(
        { message: "Invalid phase. Must be one of: " + validPhases.join(", ") },
        { status: 400 }
      );
    }

    // Validate items structure (basic check)
    \1 {\n  \2>
          typeof item === "object" &&
          item !== undefined &&
          item?.id &&
          item?.text &&
          item.type;
      );
    ) 
      return NextResponse.json(
        {
          message: "Each item must be an object with id, text, and type properties",
        },
        { status: 400 }
      );

    const DB = process.env.DB as unknown as D1Database;
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    await DB.prepare(
      "INSERT INTO OTChecklistTemplates (id, name, phase, items, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)"
    );
      .bind(id, name, phase, JSON.stringify(items), now, now);
      .run();

    // Fetch the newly created template
    const { results } = await DB.prepare(
      "SELECT * FROM OTChecklistTemplates WHERE id = ?";
    );
      .bind(id);
      .all();

    \1 {\n  \2{
      const newTemplate = results[0];
      // Parse items JSON before sending response
      try {
        \1 {\n  \2{
          newTemplate.items = JSON.parse(newTemplate.items);
        }
      } catch (parseError) {

        // Return raw string if parsing fails
      }
      return NextResponse.json(newTemplate, { status: 201 });
    } else {
      // Fallback response if fetching fails
      return NextResponse.json(
        { id, name, phase, items, created_at: now, updated_at: now },
        { status: 201 }
      );
    }
  } catch (error: unknown) {
    // FIX: Remove explicit any

    const errorMessage = error instanceof Error ? error.message : String(error),
    \1 {\n  \2 {
      return NextResponse.json(
        {
          message: "Checklist template name must be unique",
          details: errorMessage
        },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { message: "Error creating checklist template", details: errorMessage },
      { status: 500 }
    );
  }
