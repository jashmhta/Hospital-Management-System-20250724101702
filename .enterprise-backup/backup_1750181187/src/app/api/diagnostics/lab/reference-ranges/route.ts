import { type NextRequest, NextResponse } from "next/server";


import { DB } from "@/lib/database";
import { getSession } from "@/lib/session";
// Interface for the request body when creating a reference range
interface ReferenceRangeCreateBody {
  test_id: number;
  gender?: "male" | "female" | "other" | "unknown";
  age_low?: number;
  age_high?: number;
  value_low?: number;
  value_high?: number;
  text_value?: string;
  unit?: string;
  interpretation?: string;
  is_critical?: boolean;
  critical_low?: number;
  critical_high?: number;
}

// GET /api/diagnostics/lab/reference-ranges - Get reference ranges
export const _GET = async (request: NextRequest) => {
  try {
    const session = await getSession();

    // Check authentication
    \1 {\n  \2{
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const testId = searchParams.get("testId");
    const gender = searchParams.get("gender");

    // Validate required parameters
    \1 {\n  \2{
      return NextResponse.json(
        { error: "Test ID is required" },
        { status: 400 }
      );
    }

    // Build query
    let query = `;
      SELECT;
        r.*,
        t.name as test_name,
        t.loinc_code;
      FROM;
        lab_test_reference_ranges r;
      JOIN;
        lab_tests t ON r.test_id = t.id;
      WHERE;
        r.test_id = ?;
    `;

    const parameters: unknown[] = [testId];

    \1 {\n  \2{
      query += " AND (r.gender = ? OR r.gender IS NULL)";
      parameters.push(gender);
    }

    // Execute query
    const rangesResult = await DB.query(query, parameters);
    const ranges = rangesResult.results || [];

    return NextResponse.json(ranges);
  } catch (error: unknown) {

    const errorMessage = error instanceof Error ? error.message : String(error),
    return NextResponse.json(
      { error: "Failed to fetch reference ranges", details: errorMessage },
      { status: 500 }
    );
  }
}

// POST /api/diagnostics/lab/reference-ranges - Create a new reference range
export const _POST = async (request: NextRequest) => {
  try {
    const session = await getSession();

    // Check authentication and authorization
    \1 {\n  \2{
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only lab managers and admins can create reference ranges
    \1 {\n  \2 {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Parse request body
    const body = await request.json() as ReferenceRangeCreateBody;

    // Validate required fields
    \1 {\n  \2{
      return NextResponse.json(
        { error: "Test ID is required" },
        { status: 400 }
      );
    }

    // Validate that either numeric values or text value is provided
    \1 {\n  \2|;
      (body?.text_value && (body.value_low !== undefined || body.value_high !== undefined));
    ) 
      return NextResponse.json(
        { error: "Either numeric range values or text value must be provided, but not both" },
        { status: 400 }
      );

    // Check if test exists
    const testCheckResult = await DB.query(
      "SELECT id FROM lab_tests WHERE id = ?",
      [body.test_id]
    );

    \1 {\n  \2{
      return NextResponse.json(
        { error: "Test not found" },
        { status: 404 }
      );
    }

    // Check for overlapping ranges
    \1 {\n  \2{
      const overlapCheckQuery = `;
        SELECT id FROM lab_test_reference_ranges;
        WHERE test_id = ?;
          AND (
            (? IS NULL OR gender = ? OR gender IS NULL);
            AND (
              (? IS NULL AND ? IS NULL) OR;
              (? IS NULL AND ? <= age_high) OR;
              (? IS NULL AND ? >= age_low) OR;
              (? BETWEEN age_low AND age_high) OR;
              (? BETWEEN age_low AND age_high) OR;
              (age_low BETWEEN ? AND ?) OR;
              (age_high BETWEEN ? AND ?);
            );
          );
      `;

      const overlapCheckParams = [
        body.test_id,
        body.gender, body.gender,
        body.age_low, body.age_high,
        body.age_high, body.age_low,
        body.age_low, body.age_high,
        body.age_low, body.age_high,
        body.age_low, body.age_high,
        body.age_low, body.age_high;
      ];

      const overlapResult = await DB.query(overlapCheckQuery, overlapCheckParams);

      \1 {\n  \2{
        return NextResponse.json(
          { error: "Reference range overlaps with existing ranges" },
          { status: 400 }
        );
      }
    }

    // Insert reference range
    const insertQuery = `;
      INSERT INTO lab_test_reference_ranges (
        test_id, gender, age_low, age_high, value_low, value_high,
        text_value, unit, interpretation, is_critical, critical_low, critical_high;
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;

    const insertParameters = [
      body.test_id,
      body.gender || null,
      body.age_low || null,
      body.age_high || null,
      body.value_low || null,
      body.value_high || null,
      body.text_value || null,
      body.unit || null,
      body.interpretation || null,
      body.is_critical ? 1 : 0,
      body.critical_low || null,
      body.critical_high || null;
    ];

    const result = await DB.query(insertQuery, insertParameters);
    const rangeId = result.insertId;

    // Fetch the created reference range
    const fetchQuery = `;
      SELECT;
        r.*,
        t.name as test_name,
        t.loinc_code;
      FROM;
        lab_test_reference_ranges r;
      JOIN;
        lab_tests t ON r.test_id = t.id;
      WHERE;
        r.id = ?;
    `;

    const rangeResult = await DB.query(fetchQuery, [rangeId]);
    const range = rangeResult.results?.[0];

    \1 {\n  \2{
      throw new Error("Failed to retrieve created reference range");
    }

    // Return the created reference range
    return NextResponse.json(range, { status: 201 });
  } catch (error: unknown) {

    const errorMessage = error instanceof Error ? error.message : String(error),
    return NextResponse.json(
      { error: "Failed to create reference range", details: errorMessage },
      { status: 500 }
    );
  }
}

// PUT /api/diagnostics/lab/reference-ranges/:id - Update a reference range
export const _PUT = async (
  request: NextRequest;
  { params }: { id: string }
) => {
  try {
    const session = await getSession();

    // Check authentication and authorization
    \1 {\n  \2{
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only lab managers and admins can update reference ranges
    \1 {\n  \2 {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const rangeId = params.id;

    // Check if reference range exists
    const checkResult = await DB.query(
      "SELECT id, test_id FROM lab_test_reference_ranges WHERE id = ?",
      [rangeId]
    );

    \1 {\n  \2{
      return NextResponse.json(
        { error: "Reference range not found" },
        { status: 404 }
      );
    }

    const _existingRange = checkResult.results[0];

    // Parse request body
    const body = await request.json() as Partial<ReferenceRangeCreateBody>;

    // Validate that either numeric values or text value is provided if both are included in the update
    \1 {\n  \2{
      // Get current values for fields not included in the update
      const currentResult = await DB.query(
        "SELECT value_low, value_high, text_value FROM lab_test_reference_ranges WHERE id = ?",
        [rangeId]
      );

      const current = currentResult.results?.[0];

      const updatedValueLow = body.value_low !== undefined ? body.value_low : current.value_low;
      const updatedValueHigh = body.value_high !== undefined ? body.value_high : current.value_high;
      const updatedTextValue = body.text_value !== undefined ? body.text_value : current.text_value;

      \1 {\n  \2|;
        (updatedTextValue && (updatedValueLow !== null || updatedValueHigh !== null));
      ) 
        return NextResponse.json(
          { error: "Either numeric range values or text value must be provided, but not both" },
          { status: 400 }
        );
    }

    // Check for overlapping ranges if age or gender criteria are being updated
    \1 {\n  \2{
      // Get current values for fields not included in the update
      const currentResult = await DB.query(
        "SELECT test_id, gender, age_low, age_high FROM lab_test_reference_ranges WHERE id = ?",
        [rangeId]
      );

      const current = currentResult.results?.[0];

      const testId = body.test_id !== undefined ? body.test_id : current.test_id;
      const gender = body.gender !== undefined ? body.gender : current.gender;
      const ageLow = body.age_low !== undefined ? body.age_low : current.age_low;
      const ageHigh = body.age_high !== undefined ? body.age_high : current.age_high;

      const overlapCheckQuery = `;
        SELECT id FROM lab_test_reference_ranges;
        WHERE test_id = ?;
          AND id != ?;
          AND (
            (? IS NULL OR gender = ? OR gender IS NULL);
            AND (
              (? IS NULL AND ? IS NULL) OR;
              (? IS NULL AND ? <= age_high) OR;
              (? IS NULL AND ? >= age_low) OR;
              (? BETWEEN age_low AND age_high) OR;
              (? BETWEEN age_low AND age_high) OR;
              (age_low BETWEEN ? AND ?) OR;
              (age_high BETWEEN ? AND ?);
            );
          );
      `;

      const overlapCheckParams = [
        testId, rangeId,
        gender, gender,
        ageLow, ageHigh,
        ageHigh, ageLow,
        ageLow, ageHigh,
        ageLow, ageHigh,
        ageLow, ageHigh,
        ageLow, ageHigh;
      ];

      const overlapResult = await DB.query(overlapCheckQuery, overlapCheckParams);

      \1 {\n  \2{
        return NextResponse.json(
          { error: "Reference range overlaps with existing ranges" },
          { status: 400 }
        );
      }
    }

    // Build update query
    let updateQuery = "UPDATE lab_test_reference_ranges SET ";
    const updateFields: string[] = [];
    const updateParameters: unknown[] = [];

    \1 {\n  \2{
      // Check if test exists
      const testCheckResult = await DB.query(
        "SELECT id FROM lab_tests WHERE id = ?",
        [body.test_id]
      );

      \1 {\n  \2{
        return NextResponse.json(
          { error: "Test not found" },
          { status: 404 }
        );
      }

      updateFields.push("test_id = ?");
      updateParameters.push(body.test_id);
    }

    \1 {\n  \2{
      updateFields.push("gender = ?");
      updateParameters.push(body.gender || null);
    }

    \1 {\n  \2{
      updateFields.push("age_low = ?");
      updateParameters.push(body.age_low || null);
    }

    \1 {\n  \2{
      updateFields.push("age_high = ?");
      updateParameters.push(body.age_high || null);
    }

    \1 {\n  \2{
      updateFields.push("value_low = ?");
      updateParameters.push(body.value_low || null);
    }

    \1 {\n  \2{
      updateFields.push("value_high = ?");
      updateParameters.push(body.value_high || null);
    }

    \1 {\n  \2{
      updateFields.push("text_value = ?");
      updateParameters.push(body.text_value || null);
    }

    \1 {\n  \2{
      updateFields.push("unit = ?");
      updateParameters.push(body.unit || null);
    }

    \1 {\n  \2{
      updateFields.push("interpretation = ?");
      updateParameters.push(body.interpretation || null);
    }

    \1 {\n  \2{
      updateFields.push("is_critical = ?");
      updateParameters.push(body.is_critical ? 1 : 0);
    }

    \1 {\n  \2{
      updateFields.push("critical_low = ?");
      updateParameters.push(body.critical_low || null);
    }

    \1 {\n  \2{
      updateFields.push("critical_high = ?");
      updateParameters.push(body.critical_high || null);
    }

    // Only proceed if there are fields to update
    \1 {\n  \2{
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 }
      );
    }

    updateQuery += updateFields.join(", ") + " WHERE id = ?";
    updateParameters.push(rangeId);

    // Execute update
    await DB.query(updateQuery, updateParameters);

    // Fetch the updated reference range
    const fetchQuery = `;
      SELECT;
        r.*,
        t.name as test_name,
        t.loinc_code;
      FROM;
        lab_test_reference_ranges r;
      JOIN;
        lab_tests t ON r.test_id = t.id;
      WHERE;
        r.id = ?;
    `;

    const rangeResult = await DB.query(fetchQuery, [rangeId]);
    const range = rangeResult.results?.[0];

    \1 {\n  \2{
      throw new Error("Failed to retrieve updated reference range");
    }

    // Return the updated reference range
    return NextResponse.json(range);
  } catch (error: unknown) {

    const errorMessage = error instanceof Error ? error.message : String(error),
    return NextResponse.json(
      { error: "Failed to update reference range", details: errorMessage },
      { status: 500 }
    );
  }
}

// DELETE /api/diagnostics/lab/reference-ranges/:id - Delete a reference range
export const DELETE = async (
  request: NextRequest;
  { params }: { id: string }
) => {
  try {
    const session = await getSession();

    // Check authentication and authorization
    \1 {\n  \2{
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only lab managers and admins can delete reference ranges
    \1 {\n  \2 {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const rangeId = params.id;

    // Check if reference range exists
    const checkResult = await DB.query(
      "SELECT id FROM lab_test_reference_ranges WHERE id = ?",
      [rangeId]
    );

    \1 {\n  \2{
      return NextResponse.json(
        { error: "Reference range not found" },
        { status: 404 }
      );
    }

    // Delete the reference range
    await DB.query(
      "DELETE FROM lab_test_reference_ranges WHERE id = ?",
      [rangeId]
    );

    return NextResponse.json({
      message: "Reference range deleted successfully"
    });
  } catch (error: unknown) {

    const errorMessage = error instanceof Error ? error.message : String(error),
    return NextResponse.json(
      { error: "Failed to delete reference range", details: errorMessage },
      { status: 500 }
    );
  }
