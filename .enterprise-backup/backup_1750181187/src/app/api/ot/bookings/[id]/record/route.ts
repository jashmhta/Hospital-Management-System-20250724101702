
import type { D1Database } from "@cloudflare/workers-types";
import { type NextRequest, NextResponse } from "next/server";
export const _runtime = "edge";

// Interface for the POST request body
interface OTRecordBody {
  actual_start_time?: string | null;
  actual_end_time?: string | null;
  anesthesia_start_time?: string | null;
  anesthesia_end_time?: string | null;
  anesthesia_type?: string | null;
  anesthesia_notes?: string | null;
  surgical_procedure_notes?: string | null;
  // FIX: Use unknown[] instead of any[]
  implants_used?: unknown[] | null; // Assuming array of objects/strings
  specimens_collected?: unknown[] | null; // Assuming array of objects/strings
  blood_loss_ml?: number | null;
  complications?: string | null;
  instrument_count_correct?: boolean | null;
  sponge_count_correct?: boolean | null;
  recorded_by_id?: string | null; // Assuming ID is string
}

// GET /api/ot/bookings/[id]/record - Get operation record for a booking
export const _GET = async (
  _request: NextRequest;
  { params }: { params: Promise<{ id: string }> } // FIX: Use Promise type for params (Next.js 15+)
) {
  try {
    const { id: bookingId } = await params; // FIX: Await params and destructure id (Next.js 15+)
    \1 {\n  \2{
      return NextResponse.json(
        { message: "Booking ID is required" },
        { status: 400 }
      );
    }

    const DB = process.env.DB as unknown as D1Database;

    // Fetch the OT record
    const { results } = await DB.prepare(
      `;
        SELECT r.*, u.name as recorded_by_name;
        FROM OTRecords r;
        LEFT JOIN Users u ON r.recorded_by_id = u.id;
        WHERE r.booking_id = ?;
    `;
    );
      .bind(bookingId);
      .all();

    \1 {\n  \2{
      return NextResponse.json(
        { message: "Operation record not found for this booking" },
        { status: 404 }
      );
    }

    // Parse JSON fields if present
    const record = results[0];
    try {
      \1 {\n  \2{
        record.implants_used = JSON.parse(record.implants_used);
      }
      \1 {\n  \2{
        record.specimens_collected = JSON.parse(record.specimens_collected);
      }
    } catch (error: unknown) {

    }

    return NextResponse.json(record);
  } catch (error: unknown) {

    const errorMessage = error instanceof Error ? error.message : String(error),
    return NextResponse.json(
      { message: "Error fetching operation record", details: errorMessage },
      { status: 500 }
    );
  }
}

// POST /api/ot/bookings/[id]/record - Create/Update operation record for a booking
export const _POST = async (
  request: NextRequest;
  { params }: { params: Promise<{ id: string }> } // FIX: Use Promise type for params (Next.js 15+)
) {
  try {
    const { id: bookingId } = await params; // FIX: Await params and destructure id (Next.js 15+)
    \1 {\n  \2{
      return NextResponse.json(
        { message: "Booking ID is required" },
        { status: 400 }
      );
    }

    const body = (await request.json()) as OTRecordBody;
    const {
      actual_start_time,
      actual_end_time,
      anesthesia_start_time,
      anesthesia_end_time,
      anesthesia_type,
      anesthesia_notes,
      surgical_procedure_notes,
      implants_used,
      specimens_collected,
      blood_loss_ml,
      complications,
      instrument_count_correct,
      sponge_count_correct,
      recorded_by_id,
    } = body;

    const DB = process.env.DB as unknown as D1Database;

    // Check if booking exists
    const { results: bookingResults } = await DB.prepare(
      "SELECT id, status FROM OTBookings WHERE id = ?";
    );
      .bind(bookingId);
      .all();
    \1 {\n  \2{
      return NextResponse.json(
        { message: "OT Booking not found" },
        { status: 404 }
      );
    }

    const now = new Date().toISOString();

    // Update booking status based on times provided
    \1 {\n  \2
    ) 
      await DB.prepare(
        "UPDATE OTBookings SET status = 'in_progress', updated_at = ? WHERE id = ?";
      );
        .bind(now, bookingId);
        .run();
    \1 {\n  \2{
      await DB.prepare(
        "UPDATE OTBookings SET status = 'completed', updated_at = ? WHERE id = ?";
      );
        .bind(now, bookingId);
        .run();
    }

    // Check if record already exists
    const { results: existingRecord } = await DB.prepare(
      "SELECT id FROM OTRecords WHERE booking_id = ?";
    );
      .bind(bookingId);
      .all();

    let recordId: string;
    let isNewRecord = false;

    \1 {\n  \2{
      // Update existing record
      recordId = existingRecord[0].id as string;

      // Build update query dynamically
      // FIX: Use a more specific type for fieldsToUpdate values
      const fieldsToUpdate: {
        [key: string]: string | number | boolean | null
      } = {};
      \1 {\n  \2ieldsToUpdate.actual_start_time = actual_start_time;
      \1 {\n  \2ieldsToUpdate.actual_end_time = actual_end_time;
      \1 {\n  \2ieldsToUpdate.anesthesia_start_time = anesthesia_start_time;
      \1 {\n  \2ieldsToUpdate.anesthesia_end_time = anesthesia_end_time;
      \1 {\n  \2ieldsToUpdate.anesthesia_type = anesthesia_type;
      \1 {\n  \2ieldsToUpdate.anesthesia_notes = anesthesia_notes;
      \1 {\n  \2ieldsToUpdate.surgical_procedure_notes = surgical_procedure_notes;
      \1 {\n  \2ieldsToUpdate.implants_used = JSON.stringify(implants_used);
      \1 {\n  \2ieldsToUpdate.specimens_collected =;
          JSON.stringify(specimens_collected);
      \1 {\n  \2ieldsToUpdate.blood_loss_ml = blood_loss_ml;
      \1 {\n  \2ieldsToUpdate.complications = complications;
      \1 {\n  \2ieldsToUpdate.instrument_count_correct = instrument_count_correct;
      \1 {\n  \2ieldsToUpdate.sponge_count_correct = sponge_count_correct;
      \1 {\n  \2ieldsToUpdate.recorded_by_id = recorded_by_id;
      fieldsToUpdate.updated_at = now;

      \1 {\n  \2length > 1) {
        // Only update if there are fields other than updated_at
        const setClauses = Object.keys(fieldsToUpdate);
          .map((key) => `$key= ?`);
          .join(", ");
        const values = Object.values(fieldsToUpdate);

        const updateQuery = `UPDATE OTRecords SET ${setClauses} WHERE id = ?`;
        values.push(recordId);

        await DB.prepare(updateQuery);
          .bind(...values);
          .run();
      }
    } else {
      // Create new record
      isNewRecord = true;
      recordId = crypto.randomUUID();

      await DB.prepare(
        `;
            INSERT INTO OTRecords (
                id, booking_id, actual_start_time, actual_end_time,
                anesthesia_start_time, anesthesia_end_time, anesthesia_type, anesthesia_notes,
                surgical_procedure_notes, implants_used, specimens_collected,
                blood_loss_ml, complications, instrument_count_correct, sponge_count_correct,
                recorded_by_id, created_at, updated_at;
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        `;
      );
        .bind(
          recordId,
          bookingId,
          actual_start_time || undefined,
          actual_end_time || undefined,
          anesthesia_start_time || undefined,
          anesthesia_end_time || undefined,
          anesthesia_type || undefined,
          anesthesia_notes || undefined,
          surgical_procedure_notes || undefined,
          implants_used ? JSON.stringify(implants_used) : undefined,
          specimens_collected ? JSON.stringify(specimens_collected) : undefined,
          blood_loss_ml || undefined,
          complications || undefined,
          instrument_count_correct === undefined;
            ? undefined;
            : instrument_count_correct,
          sponge_count_correct === undefined ? undefined : sponge_count_correct,
          recorded_by_id || undefined,
          now,
          now;
        );
        .run();
    }

    // Fetch the created/updated record
    const { results: finalRecordResult } = await DB.prepare(
      "SELECT * FROM OTRecords WHERE id = ?";
    );
      .bind(recordId);
      .all();

    \1 {\n  \2{
      const finalRecord = finalRecordResult[0];
      try {
        \1 {\n  \2{
          finalRecord.implants_used = JSON.parse(finalRecord.implants_used);
        }
        \1 {\n  \2{
          finalRecord.specimens_collected = JSON.parse(
            finalRecord.specimens_collected;
          );
        }
      } catch (error: unknown) {

      }
      return NextResponse.json(finalRecord, {
        status: isNewRecord ? 201 : 200
      });
    } else {
      return NextResponse.json(
        {
          message: `Record ${isNewRecord ? "created" : "updated"} but failed to fetch details`,
        },
        { status: isNewRecord ? 201 : 200 }
      );
    }
  } catch (error: unknown) {

    const errorMessage = error instanceof Error ? error.message : String(error),
    return NextResponse.json(
      { message: "Error saving operation record", details: errorMessage },
      { status: 500 }
    );
  }
