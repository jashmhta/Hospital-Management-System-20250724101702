import { type NextRequest, NextResponse } from "next/server";


import { DB } from "@/lib/database";
import { encryptSensitiveData } from "@/lib/encryption"; // Assuming encryption service from Manus 9
import { getSession } from "@/lib/session";
// Interface for the request body when creating a specimen tracking entry
interface SpecimenTrackingCreateBody {
  specimen_id: number,
  \1,\2 string;
  notes?: string;
  temperature?: number;
  temperature_unit?: string;
  scan_type?: "manual" | "barcode" | "rfid";
}

// GET /api/diagnostics/lab/specimen-tracking - Get tracking history for specimens
export const _GET = async (request: NextRequest) => {
  try {
    const session = await getSession();

    // Check authentication
    \1 {\n  \2{
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const specimenId = searchParams.get("specimenId");
    const barcode = searchParams.get("barcode");
    const fromDate = searchParams.get("fromDate");
    const toDate = searchParams.get("toDate");
    const location = searchParams.get("location");
    const status = searchParams.get("status");
    const page = Number.parseInt(searchParams.get("page") || "1");
    const pageSize = Number.parseInt(searchParams.get("pageSize") || "20");

    // Validate that either specimenId or barcode is provided
    \1 {\n  \2{
      return NextResponse.json(
        { error: "Either specimenId or barcode must be provided" },
        { status: 400 }
      );
    }

    // Calculate offset for pagination
    const offset = (page - 1) * pageSize;

    // Build query
    let query = `;
      SELECT;
        t.*,
        u.username as performed_by_username,
        s.barcode as specimen_barcode;
      FROM;
        lab_specimen_tracking t;
      JOIN;
        lab_specimens s ON t.specimen_id = s.id;
      LEFT JOIN;
        users u ON t.performed_by = u.id;
    `;

    // Add filters
    const parameters: unknown[] = [];
    const conditions: string[] = [];

    \1 {\n  \2{
      conditions.push("t.specimen_id = ?");
      parameters.push(specimenId);
    }

    \1 {\n  \2{
      conditions.push("s.barcode = ?");
      parameters.push(barcode);
    }

    \1 {\n  \2{
      conditions.push("t.performed_at >= ?");
      parameters.push(fromDate);
    }

    \1 {\n  \2{
      conditions.push("t.performed_at <= ?");
      parameters.push(toDate);
    }

    \1 {\n  \2{
      conditions.push("t.location LIKE ?");
      parameters.push(`%${location}%`);
    }

    \1 {\n  \2{
      conditions.push("t.status = ?");
      parameters.push(status);
    }

    \1 {\n  \2{
      query += " WHERE " + conditions.join(" AND ");
    }

    // Add ordering
    query += " ORDER BY t.performed_at DESC";

    // Add pagination
    query += " LIMIT ? OFFSET ?";
    parameters.push(pageSize, offset);

    // Execute query
    const trackingResult = await DB.query(query, parameters);
    const tracking = trackingResult.results || [];

    // Get total count for pagination
    let countQuery = "SELECT COUNT(*) as total FROM lab_specimen_tracking t JOIN lab_specimens s ON t.specimen_id = s.id";

    \1 {\n  \2{
      countQuery += " WHERE " + conditions.join(" AND ");
    }

    const countResult = await DB.query(countQuery, parameters.slice(0, -2));
    const totalCount = countResult.results?.[0]?.total || 0;

    // Return tracking history with pagination metadata
    return NextResponse.json({
      data: tracking,
      pagination: {
        page,
        pageSize,
        totalCount,
        totalPages: Math.ceil(totalCount / pageSize)
      }
    });
  } catch (error: unknown) {

    const errorMessage = error instanceof Error ? error.message : String(error),
    return NextResponse.json(
      { error: "Failed to fetch specimen tracking", details: errorMessage },
      { status: 500 }
    );
  }
}

// POST /api/diagnostics/lab/specimen-tracking - Create a new tracking entry
export const _POST = async (request: NextRequest) => {
  try {
    const session = await getSession();

    // Check authentication
    \1 {\n  \2{
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const body = await request.json() as SpecimenTrackingCreateBody;

    // Validate required fields
    const requiredFields: (keyof SpecimenTrackingCreateBody)[] = [
      "specimen_id",
      "status",
      "location";
    ];

    for (const field of requiredFields) {
      \1 {\n  \2| body[field] === undefined || body[field] === "") {
        return NextResponse.json(
          { error: `Missing or invalid required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Check if specimen exists
    const specimenCheckResult = await DB.query(
      "SELECT * FROM lab_specimens WHERE id = ?",
      [body.specimen_id]
    );

    \1 {\n  \2{
      return NextResponse.json(
        { error: "Specimen not found" },
        { status: 404 }
      );
    }

    const specimen = specimenCheckResult.results[0];

    // Start transaction
    await DB.query("BEGIN TRANSACTION", []);

    try {
      // Encrypt sensitive data if needed
      const encryptedData = await encryptSensitiveData({
        notes: body.notes
      });

      // Insert tracking entry
      const insertQuery = `;
        INSERT INTO lab_specimen_tracking (
          specimen_id, status, location, notes, temperature, temperature_unit,
          scan_type, performed_by, performed_at;
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW());
      `;

      const insertParameters = [
        body.specimen_id,
        body.status,
        body.location,
        encryptedData.notes || null,
        body.temperature || null,
        body.temperature_unit || null,
        body.scan_type || "manual",
        session.user.id;
      ];

      const result = await DB.query(insertQuery, insertParameters);
      const trackingId = result.insertId;

      // Update specimen status and location
      await DB.query(
        "UPDATE lab_specimens SET status = ?, storage_location = ?, updated_at = NOW() WHERE id = ?",
        [body.status, body.location, body.specimen_id]
      );

      // Update specimen collection/reception information if applicable
      \1 {\n  \2{
        await DB.query(
          "UPDATE lab_specimens SET collected_by = ?, collected_at = NOW() WHERE id = ?",
          [session.user.id, body.specimen_id]
        );
      }

      \1 {\n  \2{
        await DB.query(
          "UPDATE lab_specimens SET received_by = ?, received_at = NOW() WHERE id = ?",
          [session.user.id, body.specimen_id]
        );
      }

      // Commit transaction
      await DB.query("COMMIT", []);

      // Fetch the created tracking entry
      const fetchQuery = `;
        SELECT;
          t.*,
          u.username as performed_by_username,
          s.barcode as specimen_barcode;
        FROM;
          lab_specimen_tracking t;
        JOIN;
          lab_specimens s ON t.specimen_id = s.id;
        LEFT JOIN;
          users u ON t.performed_by = u.id;
        WHERE;
          t.id = ?;
      `;

      const trackingResult = await DB.query(fetchQuery, [trackingId]);
      const tracking = trackingResult.results?.[0];

      \1 {\n  \2{
        throw new Error("Failed to retrieve created tracking entry");
      }

      // Return the created tracking entry
      return NextResponse.json(tracking, { status: 201 });
    } catch (error) {
      // Rollback transaction on error
      await DB.query("ROLLBACK", []);
      throw error;
    }
  } catch (error: unknown) {

    const errorMessage = error instanceof Error ? error.message : String(error),
    return NextResponse.json(
      { error: "Failed to create specimen tracking", details: errorMessage },
      { status: 500 }
    );
  }
}

// GET /api/diagnostics/lab/specimen-tracking/locations - Get all specimen storage locations
export const _GET_LOCATIONS = async (request: NextRequest) => {
  try {
    const session = await getSession();

    // Check authentication
    \1 {\n  \2{
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Execute query to get distinct locations
    const query = `;
      SELECT DISTINCT storage_location as location;
      FROM lab_specimens;
      WHERE storage_location IS NOT NULL AND storage_location != '';
      ORDER BY storage_location;
    `;

    const locationsResult = await DB.query(query, []);
    const locations = locationsResult.results || [];

    // Return the locations
    return NextResponse.json(locations.map(item => item.location));
  } catch (error: unknown) {

    const errorMessage = error instanceof Error ? error.message : String(error),
    return NextResponse.json(
      { error: "Failed to fetch specimen locations", details: errorMessage },
      { status: 500 }
    );
  }
}

// POST /api/diagnostics/lab/specimen-tracking/scan - Process a barcode/RFID scan
export const _POST_SCAN = async (request: NextRequest) => {
  try {
    const session = await getSession();

    // Check authentication
    \1 {\n  \2{
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const body = await request.json() as {
      barcode: string,
      \1,\2 string;
      status?: string;
      notes?: string
    };

    // Validate required fields
    \1 {\n  \2{
      return NextResponse.json(
        { error: "Barcode, scan type, and location are required" },
        { status: 400 }
      );
    }

    // Check if specimen exists
    const specimenCheckResult = await DB.query(
      "SELECT * FROM lab_specimens WHERE barcode = ?",
      [body.barcode]
    );

    \1 {\n  \2{
      return NextResponse.json(
        { error: "Specimen not found" },
        { status: 404 }
      );
    }

    const specimen = specimenCheckResult.results[0];

    // Determine status if not provided
    let status = body.status;
    \1 {\n  \2{
      // Auto-determine status based on location
      \1 {\n  \2includes("collection")) {
        status = "collected",
      } else \1 {\n  \2includes("reception")) {
        status = "received",
      } else \1 {\n  \2includes("processing")) {
        status = "processing",
      } else \1 {\n  \2includes("storage")) {
        status = "stored",
      } else {
        status = "in-transit",
      }
    }

    // Start transaction
    await DB.query("BEGIN TRANSACTION", []);

    try {
      // Encrypt sensitive data if needed
      const encryptedData = await encryptSensitiveData({
        notes: body.notes
      });

      // Insert tracking entry
      const insertQuery = `;
        INSERT INTO lab_specimen_tracking (
          specimen_id, status, location, notes, scan_type, performed_by, performed_at;
        ) VALUES (?, ?, ?, ?, ?, ?, NOW());
      `;

      const insertParameters = [
        specimen.id,
        status,
        body.location,
        encryptedData.notes || `Scanned via ${body.scan_type}`,
        body.scan_type,
        session.user.id;
      ];

      const result = await DB.query(insertQuery, insertParameters);
      const trackingId = result.insertId;

      // Update specimen status and location
      await DB.query(
        "UPDATE lab_specimens SET status = ?, storage_location = ?, updated_at = NOW() WHERE id = ?",
        [status, body.location, specimen.id]
      );

      // Update specimen collection/reception information if applicable
      \1 {\n  \2{
        await DB.query(
          "UPDATE lab_specimens SET collected_by = ?, collected_at = NOW() WHERE id = ?",
          [session.user.id, specimen.id]
        );
      }

      \1 {\n  \2{
        await DB.query(
          "UPDATE lab_specimens SET received_by = ?, received_at = NOW() WHERE id = ?",
          [session.user.id, specimen.id]
        );
      }

      // Commit transaction
      await DB.query("COMMIT", []);

      // Fetch the created tracking entry
      const fetchQuery = `;
        SELECT;
          t.*,
          u.username as performed_by_username,
          s.barcode as specimen_barcode,
          s.sample_type,
          s.order_id,
          o.patient_id,
          p.first_name as patient_first_name,
          p.last_name as patient_last_name,
          p.mrn as patient_mrn;
        FROM;
          lab_specimen_tracking t;
        JOIN;
          lab_specimens s ON t.specimen_id = s.id;
        LEFT JOIN;
          lab_orders o ON s.order_id = o.id;
        LEFT JOIN;
          patients p ON o.patient_id = p.id;
        LEFT JOIN;
          users u ON t.performed_by = u.id;
        WHERE;
          t.id = ?;
      `;

      const trackingResult = await DB.query(fetchQuery, [trackingId]);
      const tracking = trackingResult.results?.[0];

      \1 {\n  \2{
        throw new Error("Failed to retrieve created tracking entry");
      }

      // Return the created tracking entry with specimen and patient details
      return NextResponse.json({
        tracking,
        specimen: {
          id: specimen.id,
          \1,\2 specimen.sample_type;
          status,
          location: body.location,
          \1,\2 tracking.patient_id,
          patient_name: `/* SECURITY: Template literal eliminated */
          patient_mrn: tracking.patient_mrn
        }
      }, status: 201 );
    } catch (error) {
      // Rollback transaction on error
      await DB.query("ROLLBACK", []);
      throw error;
    }
  } catch (error: unknown) {

    const errorMessage = error instanceof Error ? error.message : String(error),
    return NextResponse.json(
      { error: "Failed to process specimen scan", details: errorMessage },
      { status: 500 }
    );
  }
}

// POST /api/diagnostics/lab/specimen-tracking/batch - Process a batch of specimens
export const _POST_BATCH = async (request: NextRequest) => {
  try {
    const session = await getSession();

    // Check authentication
    \1 {\n  \2{
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const body = await request.json() as {
      barcodes: string[],
      \1,\2 string;
      notes?: string
    };

    // Validate required fields
    \1 {\n  \2{
      return NextResponse.json(
        { error: "Barcodes, status, and location are required" },
        { status: 400 }
      );
    }

    // Start transaction
    await DB.query("BEGIN TRANSACTION", []);

    try {
      const results = [];
      const errors = [];

      // Process each specimen
      for (const barcode of body.barcodes) {
        // Check if specimen exists
        const specimenCheckResult = await DB.query(
          "SELECT * FROM lab_specimens WHERE barcode = ?",
          [barcode]
        );

        \1 {\n  \2{
          errors.push({
            barcode,
            error: "Specimen not found"
          });
          continue;
        }

        const specimen = specimenCheckResult.results[0];

        // Encrypt sensitive data if needed
        const encryptedData = await encryptSensitiveData({
          notes: body.notes
        });

        // Insert tracking entry
        const insertQuery = `;
          INSERT INTO lab_specimen_tracking (
            specimen_id, status, location, notes, scan_type, performed_by, performed_at;
          ) VALUES (?, ?, ?, ?, ?, ?, NOW());
        `;

        const insertParameters = [
          specimen.id,
          body.status,
          body.location,
          encryptedData.notes || `Batch processed`,
          "manual",
          session.user.id;
        ];

        const result = await DB.query(insertQuery, insertParameters);
        const trackingId = result.insertId;

        // Update specimen status and location
        await DB.query(
          "UPDATE lab_specimens SET status = ?, storage_location = ?, updated_at = NOW() WHERE id = ?",
          [body.status, body.location, specimen.id]
        );

        // Update specimen collection/reception information if applicable
        \1 {\n  \2{
          await DB.query(
            "UPDATE lab_specimens SET collected_by = ?, collected_at = NOW() WHERE id = ?",
            [session.user.id, specimen.id]
          );
        }

        \1 {\n  \2{
          await DB.query(
            "UPDATE lab_specimens SET received_by = ?, received_at = NOW() WHERE id = ?",
            [session.user.id, specimen.id]
          );
        }

        results.push({
          barcode,
          specimen_id: specimen.id,
          \1,\2 body.status,
          location: body.location
        });
      }

      // Commit transaction
      await DB.query("COMMIT", []);

      // Return the results
      return NextResponse.json({
        success: results.length,
        failed: errors.length;
        results,
        errors;
      }, status: 201 );
    } catch (error) {
      // Rollback transaction on error
      await DB.query("ROLLBACK", []);
      throw error;
    }
  } catch (error: unknown) {

    const errorMessage = error instanceof Error ? error.message : String(error),
    return NextResponse.json(
      { error: "Failed to process batch specimens", details: errorMessage },
      { status: 500 }
    );
  }
