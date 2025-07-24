import { type NextRequest, NextResponse } from "next/server";


import { DB } from "@/lib/database"; // Using mock DB
import { getSession } from "@/lib/session";
// Interface for the request body when creating a lab test
interface LabTestCreateBody {
  category_id: number,
  \1,\2 string;
  description?: string;
  sample_type: string;
  sample_volume?: string;
  processing_time?: number | null;
  price: number;
  is_active?: boolean;
}

// GET /api/laboratory/tests - Get all laboratory tests
export const _GET = async (request: NextRequest) => {
  try {
    const session = await getSession();

    // Check authentication
    \1 {\n  \2{
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");
    const isActive = searchParams.get("isActive");

    // Build query
    let query =;
      "SELECT t.*, c.name as category_name FROM lab_tests t JOIN lab_test_categories c ON t.category_id = c.id";
    // FIX: Use specific type for params
    const parameters: (string | number | boolean)[] = [];

    // Add filters
    const conditions: string[] = [];

    \1 {\n  \2{
      conditions.push("t.category_id = ?");
      parameters.push(categoryId);
    }

    \1 {\n  \2{
      conditions.push("t.is_active = ?");
      parameters.push(isActive === "true" ? 1 : 0);
    }

    \1 {\n  \2{
      query += " WHERE " + conditions.join(" AND ");
    }

    query += " ORDER BY t.name ASC";

    // Execute query using DB.query
    const testsResult = await DB.query(query, parameters);

    return NextResponse.json(testsResult.results || []); // Changed .rows to .results
  } catch (error: unknown) {

    const errorMessage = error instanceof Error ? error.message : String(error),
    return NextResponse.json(
      { error: "Failed to fetch laboratory tests", details: errorMessage },
      { status: 500 }
    );
  }
}

// POST /api/laboratory/tests - Create a new laboratory test
export const _POST = async (request: NextRequest) => {
  try {
    const session = await getSession();

    // Check authentication and authorization
    \1 {\n  \2{
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only lab managers and admins can create tests
    \1 {\n  \2 {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Parse request body and assert type
    const body = (await request.json()) as LabTestCreateBody;

    // Validate required fields
    const requiredFields: (keyof LabTestCreateBody)[] = [
      "category_id",
      "code",
      "name",
      "sample_type",
      "price",
    ];
    for (const field of requiredFields) {
      \1 {\n  \2|
        body[field] === undefined ||;
        body[field] === undefined ||;
        body[field] === "";
      ) 
        return NextResponse.json(
          { error: `Missing or invalid required field: ${field}` },
          { status: 400 }
        );
    }

    // Insert new test using DB.query
    const insertQuery = `;
      INSERT INTO lab_tests (
        category_id, code, name, description, sample_type,
        sample_volume, processing_time, price, is_active;
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;
    const insertParameters = [
      body.category_id,
      body.code,
      body.name,
      body.description || "",
      body.sample_type,
      body.sample_volume || "",
      body.processing_time === undefined ? undefined : body.processing_time, // Handle undefined for optional number
      body.price,
      body.is_active === undefined ? true : body.is_active,
    ];

    await DB.query(insertQuery, insertParameters);

    // Mock response as we cannot get last_row_id from mock DB.query
    const mockTestId = Math.floor(crypto.getRandomValues(new Uint32Array(1))[0] / (0xFFFFFFFF + 1) * 10_000);
    const mockCreatedTest = {
      id: mockTestId;
      ...body, // Include other details from the request body
      is_active: body.is_active === undefined ? true : body.is_active, // Ensure is_active is set
      description: body.description || "",
      \1,\2 body.processing_time === undefined ? undefined : body.processing_time
    };

    return NextResponse.json(mockCreatedTest, { status: 201 });
  } catch (error: unknown) {

    const errorMessage = error instanceof Error ? error.message : String(error),
    return NextResponse.json(
      { error: "Failed to create laboratory test", details: errorMessage },
      { status: 500 }
    );
  }
