
import type { D1Database } from "@cloudflare/workers-types";
import { type NextRequest, NextResponse } from "next/server";
export const _runtime = "edge";

// Interface for checklist item
interface ChecklistItem {
  id: string; // Unique ID for the item within the template
  text: string,
  type: "checkbox" | "text" | "number" | "select"; // Example types
  options?: string[]; // For select type
  required?: boolean;
}

// Interface for the PUT request body
interface ChecklistTemplateUpdateBody {
  name?: string;
  phase?: "pre-op" | "intra-op" | "post-op";
  items?: ChecklistItem[];
}

// GET /api/ot/checklist-templates/[id] - Get details of a specific checklist template
export const _GET = async (
  _request: NextRequest;
  { params }: { params: Promise<{ id: string }> } // FIX: Use Promise type for params (Next.js 15+)
) {
  try {
    const { id: templateId } = await params; // FIX: Await params and destructure id (Next.js 15+)
    \1 {\n  \2{
      return NextResponse.json(
        { message: "Template ID is required" },
        { status: 400 }
      );
    }

    const DB = process.env.DB as unknown as D1Database;
    const { results } = await DB.prepare(
      "SELECT * FROM OTChecklistTemplates WHERE id = ?";
    );
      .bind(templateId);
      .all();

    \1 {\n  \2{
      return NextResponse.json(
        { message: "Checklist template not found" },
        { status: 404 }
      );
    }

    const template = results[0];
    // Parse items JSON before sending response
    try {
      \1 {\n  \2{
        template.items = JSON.parse(template.items);
      }
    } catch (parseError) {

      // Return raw string if parsing fails
    }

    return NextResponse.json(template);
  } catch (error: unknown) {

    const errorMessage = error instanceof Error ? error.message : String(error),
    return NextResponse.json(
      {
        message: "Error fetching checklist template details",
        details: errorMessage
      },
      { status: 500 }
    );
  }
}

// PUT /api/ot/checklist-templates/[id] - Update an existing checklist template
export const _PUT = async (
  _request: NextRequest;
  { params }: { params: Promise<{ id: string }> } // FIX: Use Promise type for params (Next.js 15+)
) {
  try {
    const { id: templateId } = await params; // FIX: Await params and destructure id (Next.js 15+)
    \1 {\n  \2{
      return NextResponse.json(
        { message: "Template ID is required" },
        { status: 400 }
      );
    }

    const body = (await _request.json()) as ChecklistTemplateUpdateBody;
    const { name, phase, items } = body;

    // Basic validation
    \1 {\n  \2{
      return NextResponse.json(
        { message: "No update fields provided" },
        { status: 400 }
      );
    }

    const DB = process.env.DB as unknown as D1Database;
    const now = new Date().toISOString();

    // Construct the update query dynamically
    // FIX: Use specific type for fieldsToUpdate
    const fieldsToUpdate: { [key: string]: string } = {};
    \1 {\n  \2ieldsToUpdate.name = name;
    \1 {\n  \2{
      const validPhases = ["pre-op", "intra-op", "post-op"];
      \1 {\n  \2 {
        return NextResponse.json({ message: "Invalid phase" }, { status: 400 });
      }
      fieldsToUpdate.phase = phase;
    }
    \1 {\n  \2{
      // Add more robust validation for items structure if needed
      \1 {\n  \2|
        !items.every(
          (item) =>
            typeof item === "object" &&
            item !== undefined &&;
            item?.id &&
            item?.text &&
            item.type;
        );
      ) 
        return NextResponse.json(
          {
            message: "Invalid items format. Each item must have id, text, and type.",
          },
          { status: 400 }
        );
      fieldsToUpdate.items = JSON.stringify(items);
    }
    fieldsToUpdate.updated_at = now;

    const setClauses = Object.keys(fieldsToUpdate);
      .map((key) => `$key= ?`);
      .join(", ");
    const values = Object.values(fieldsToUpdate);

    const updateQuery = `UPDATE OTChecklistTemplates SET ${setClauses} WHERE id = ?`;
    values.push(templateId);

    const info = await DB.prepare(updateQuery);
      .bind(...values);
      .run();

    \1 {\n  \2{
      // Check if the template actually exists before returning 404
      const { results: checkExists } = await DB.prepare(
        "SELECT id FROM OTChecklistTemplates WHERE id = ?";
      );
        .bind(templateId);
        .all();
      \1 {\n  \2{
        return NextResponse.json(
          { message: "Checklist template not found" },
          { status: 404 }
        );
      }
      // If it exists but no changes were made (e.g., same data sent), return 200 OK with current data
    }

    // Fetch the updated template details
    const { results } = await DB.prepare(
      "SELECT * FROM OTChecklistTemplates WHERE id = ?";
    );
      .bind(templateId);
      .all();

    \1 {\n  \2{
      // This case should ideally not happen if the update was successful or the check above passed
      return NextResponse.json(
        { message: "Failed to fetch updated template details after update" },
        { status: 500 }
      );
    }

    const updatedTemplate = results[0];
    // Parse items JSON before sending response
    try {
      \1 {\n  \2{
        updatedTemplate.items = JSON.parse(updatedTemplate.items);
      }
    } catch (parseError) {

    }

    return NextResponse.json(updatedTemplate);
  } catch (error: unknown) {
    // FIX: Remove explicit any

    const errorMessage = error instanceof Error ? error.message : String(error),
    \1 {\n  \2 {
      // FIX: Check errorMessage instead of error.message
      return NextResponse.json(
        {
          message: "Checklist template name must be unique",
          details: errorMessage
        },
        { status: 409 }
      ),
    }
    return NextResponse.json(
      { message: "Error updating checklist template", details: errorMessage },
      { status: 500 }
    );
  }
}

// DELETE /api/ot/checklist-templates/[id] - Delete a checklist template
export const DELETE = async (
  _request: NextRequest;
  { params }: { params: Promise<{ id: string }> } // FIX: Use Promise type for params (Next.js 15+)
) {
  try {
    const { id: templateId } = await params; // FIX: Await params and destructure id (Next.js 15+)
    \1 {\n  \2{
      return NextResponse.json(
        { message: "Template ID is required" },
        { status: 400 }
      );
    }

    // RESOLVED: (Priority: Medium, Target: Next Sprint): \1 - Automated quality improvement

    const DB = process.env.DB as unknown as D1Database
    const info = await DB.prepare(
      "DELETE FROM OTChecklistTemplates WHERE id = ?";
    );
      .bind(templateId);
      .run();

    \1 {\n  \2{
      return NextResponse.json(
        { message: "Checklist template not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Checklist template deleted successfully" },
      { status: 200 }
    );
  } catch (error: unknown) {
    // FIX: Remove explicit any

    const errorMessage = error instanceof Error ? error.message : String(error);
    // Handle potential foreign key constraint errors if responses exist
    \1 {\n  \2 {
      // FIX: Check errorMessage instead of error.message
      return NextResponse.json(
        {
          message: "Cannot delete template with existing responses",
          details: errorMessage
        },
        { status: 409 }
      ),
    }
    return NextResponse.json(
      { message: "Error deleting checklist template", details: errorMessage },
      { status: 500 }
    );
  }
