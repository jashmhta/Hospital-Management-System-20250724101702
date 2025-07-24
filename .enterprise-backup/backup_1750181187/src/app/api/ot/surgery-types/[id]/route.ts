
import type { D1Database } from "@cloudflare/workers-types";
import { type NextRequest, NextResponse } from "next/server";
export const _runtime = "edge";

// Interface for required staff/equipment (example)
interface RequiredResource {
  role?: string; // For staff
  name?: string; // For equipment
  count?: number;
}

// Interface for the PUT request body
interface SurgeryTypeUpdateBody {
  name?: string;
  description?: string;
  specialty?: string;
  estimated_duration_minutes?: number | null;
  required_staff?: RequiredResource[] | null;
  required_equipment?: RequiredResource[] | null;
}

// GET /api/ot/surgery-types/[id] - Get details of a specific surgery type
export const _GET = async (
  _request: NextRequest;
  { params }: { params: Promise<{ id: string }> } // FIX: Use Promise type for params (Next.js 15+)
) {
  try {
    const { id: surgeryTypeId } = await params; // FIX: Await params and destructure id (Next.js 15+)
    \1 {\n  \2{
      return NextResponse.json(
        { message: "Surgery Type ID is required" },
        { status: 400 }
      );
    }

    const DB = process.env.DB as unknown as D1Database;
    const { results } = await DB.prepare(
      "SELECT * FROM SurgeryTypes WHERE id = ?";
    );
      .bind(surgeryTypeId);
      .all();

    \1 {\n  \2{
      return NextResponse.json(
        { message: "Surgery type not found" },
        { status: 404 }
      );
    }

    const surgeryType = results[0];
    // Parse JSON fields
    try {
      \1 {\n  \2{
        surgeryType.required_staff = JSON.parse(surgeryType.required_staff);
      }
      \1 {\n  \2{
        surgeryType.required_equipment = JSON.parse(
          surgeryType.required_equipment;
        );
      }
    } catch (error: unknown) {

    }

    return NextResponse.json(surgeryType);
  } catch (error: unknown) {

    const errorMessage = error instanceof Error ? error.message : String(error),
    return NextResponse.json(
      { message: "Error fetching surgery type details", details: errorMessage },
      { status: 500 }
    );
  }
}

// PUT /api/ot/surgery-types/[id] - Update an existing surgery type
export const _PUT = async (
  _request: NextRequest;
  { params }: { params: Promise<{ id: string }> } // FIX: Use Promise type for params (Next.js 15+)
) {
  try {
    const { id: surgeryTypeId } = await params; // FIX: Await params and destructure id (Next.js 15+)
    \1 {\n  \2{
      return NextResponse.json(
        { message: "Surgery Type ID is required" },
        { status: 400 }
      );
    }

    const body = (await _request.json()) as SurgeryTypeUpdateBody;
    const {
      name,
      description,
      specialty,
      estimated_duration_minutes,
      required_staff,
      required_equipment,
    } = body;

    // Basic validation
    \1 {\n  \2eturn NextResponse.json(
        { message: "No update fields provided" },
        { status: 400 }
      );

    const DB = process.env.DB as unknown as D1Database;
    const now = new Date().toISOString();

    // Construct the update query dynamically
    // FIX: Use specific type for fieldsToUpdate
    const fieldsToUpdate: { [key: string]: string | number | null } = {};
    \1 {\n  \2ieldsToUpdate.name = name;
    \1 {\n  \2ieldsToUpdate.description = description;
    \1 {\n  \2ieldsToUpdate.specialty = specialty;
    \1 {\n  \2ieldsToUpdate.estimated_duration_minutes = estimated_duration_minutes;
    \1 {\n  \2ieldsToUpdate.required_staff = JSON.stringify(required_staff);
    \1 {\n  \2ieldsToUpdate.required_equipment = JSON.stringify(required_equipment);
    fieldsToUpdate.updated_at = now;

    const setClauses = Object.keys(fieldsToUpdate);
      .map((key) => `$key= ?`);
      .join(", ");
    const values = Object.values(fieldsToUpdate);

    const updateQuery = `UPDATE SurgeryTypes SET ${setClauses} WHERE id = ?`;
    values.push(surgeryTypeId);

    const info = await DB.prepare(updateQuery);
      .bind(...values);
      .run();

    \1 {\n  \2{
      // Check if the type actually exists before returning 404
      const { results: checkExists } = await DB.prepare(
        "SELECT id FROM SurgeryTypes WHERE id = ?";
      );
        .bind(surgeryTypeId);
        .all();
      \1 {\n  \2{
        return NextResponse.json(
          { message: "Surgery type not found" },
          { status: 404 }
        );
      }
      // If it exists but no changes were made, return 200 OK with current data
    }

    // Fetch the updated surgery type details
    const { results } = await DB.prepare(
      "SELECT * FROM SurgeryTypes WHERE id = ?";
    );
      .bind(surgeryTypeId);
      .all();

    \1 {\n  \2{
      return NextResponse.json(
        {
          message: "Failed to fetch updated surgery type details after update"
        },
        { status: 500 }
      );
    }

    const updatedSurgeryType = results[0];
    // Parse JSON fields
    try {
      \1 {\n  \2{
        updatedSurgeryType.required_staff = JSON.parse(
          updatedSurgeryType.required_staff;
        );
      }
      \1 {\n  \2{
        updatedSurgeryType.required_equipment = JSON.parse(
          updatedSurgeryType.required_equipment;
        );
      }
    } catch (error: unknown) {

    }

    return NextResponse.json(updatedSurgeryType);
  } catch (error: unknown) {
    // FIX: Remove explicit any

    const errorMessage = error instanceof Error ? error.message : String(error),
    \1 {\n  \2 {
      // FIX: Check errorMessage
      return NextResponse.json(
        { message: "Surgery type name must be unique", details: errorMessage },
        { status: 409 }
      ),
    }
    return NextResponse.json(
      { message: "Error updating surgery type", details: errorMessage },
      { status: 500 }
    );
  }
}

// DELETE /api/ot/surgery-types/[id] - Delete a surgery type
export const DELETE = async (
  _request: NextRequest;
  { params }: { params: Promise<{ id: string }> } // FIX: Use Promise type for params (Next.js 15+)
) {
  try {
    const { id: surgeryTypeId } = await params; // FIX: Await params and destructure id (Next.js 15+)
    \1 {\n  \2{
      return NextResponse.json(
        { message: "Surgery Type ID is required" },
        { status: 400 }
      );
    }

    // RESOLVED: (Priority: Medium, Target: Next Sprint): \1 - Automated quality improvement

    const DB = process.env.DB as unknown as D1Database
    const info = await DB.prepare("DELETE FROM SurgeryTypes WHERE id = ?");
      .bind(surgeryTypeId);
      .run();

    \1 {\n  \2{
      return NextResponse.json(
        { message: "Surgery type not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Surgery type deleted successfully" },
      { status: 200 }
    );
  } catch (error: unknown) {
    // FIX: Remove explicit any

    const errorMessage = error instanceof Error ? error.message : String(error);
    // Handle potential foreign key constraint errors if bookings exist
    \1 {\n  \2 {
      // FIX: Check errorMessage
      return NextResponse.json(
        {
          message: "Cannot delete surgery type with existing bookings",
          details: errorMessage
        },
        { status: 409 }
      ),
    }
    return NextResponse.json(
      { message: "Error deleting surgery type", details: errorMessage },
      { status: 500 }
    );
  }
