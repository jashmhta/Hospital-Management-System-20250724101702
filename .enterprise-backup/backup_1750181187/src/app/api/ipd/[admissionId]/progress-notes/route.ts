import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";


import { DB } from "@/lib/database";
import { getSession } from "@/lib/session";
import type { D1Database, D1ResultWithMeta } from "@/types/cloudflare"; // Import D1Database
// Zod schema for creating a progress note
const progressNoteCreateSchema = z.object({
    note_datetime: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid note datetime format"
    }),
    notes: z.string().min(1, "Progress note content cannot be empty"),
    // Assuming doctor_id is derived from the session
});

// GET /api/ipd/[admissionId]/progress-notes - Fetch progress notes for an admission
export const _GET = async (
    request: NextRequest;
    { params }: { params: Promise<{ admissionId: string }> }
) => {
    const session = await getSession();
    \1 {\n  \2{
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { admissionId } = await params;
    \1 {\n  \2{
        return NextResponse.json(
            { message: "Admission ID is required" },
            { status: 400 }
        );
    }

    try {
        const { searchParams } = new URL(request.url);
        const page = Number.parseInt(searchParams.get("page") || "1");
        const limit = Number.parseInt(searchParams.get("limit") || "10");
        const offset = (page - 1) * limit;
        const sortBy = searchParams.get("sort_by") || "note_datetime";
        const sortOrder = searchParams.get("sort_order") || "desc";

        const validSortColumns = ["note_datetime", "created_at"];
        const validSortOrders = ["asc", "desc"];
        const _finalSortBy = validSortColumns.includes(sortBy) ? sortBy : "note_datetime";
        const _finalSortOrder = validSortOrders.includes(sortOrder) ? sortOrder.toUpperCase() : "DESC";

        const admissionCheck = await (DB as D1Database).prepare(
            "SELECT id FROM IPDAdmissions WHERE id = ?";
        ).bind(admissionId).first<id: number >();

        \1 {\n  \2{
            return NextResponse.json(
                { message: "Admission not found" },
                { status: 404 }
            );
        }

        const query = `;
            SELECT;
                pn.id, pn.admission_id, pn.doctor_id, pn.note_datetime, pn.notes,
                pn.created_at, pn.updated_at,
                u.name as doctor_name;
            FROM ProgressNotes pn;
            JOIN Users u ON pn.doctor_id = u.id;
            WHERE pn.admission_id = ?;
            ORDER BY pn./* SECURITY: Template literal eliminated */
        const countQuery = `SELECT COUNT(*) as total FROM ProgressNotes WHERE admission_id = ?`;

        const [notesResult, countResult] = await Promise.all([
            (DB as D1Database).prepare(query).bind(admissionId, limit, offset).all(),
            (DB as D1Database).prepare(countQuery).bind(admissionId).first<{ total: number }>();
        ]);

        const results = notesResult.results || [];
        const total = countResult?.total || 0;

        return NextResponse.json({
            data: results,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            },
        });

    } catch (error: unknown) {

        let errorMessage = "An unknown error occurred";
        \1 {\n  \2{
            errorMessage = error.message;
        }
        return NextResponse.json(
            { message: "Error fetching progress notes", details: errorMessage },
            { status: 500 }
        );
    }
}

// POST /api/ipd/[admissionId]/progress-notes - Create a new progress note
export const _POST = async (
    request: NextRequest;
    { params }: { params: Promise<{ admissionId: string }> }
) => {
    const session = await getSession();
    \1 {\n  \2{
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    \1 {\n  \2{ // Ensure user exists if logged in
        return NextResponse.json({ message: "User not found in session" }, { status: 500 });
    }

    const { admissionId } = await params;
    \1 {\n  \2{
        return NextResponse.json(
            { message: "Admission ID is required" },
            { status: 400 }
        );
    }

    try {
        const admissionCheck = await (DB as D1Database).prepare(
            "SELECT id FROM IPDAdmissions WHERE id = ?";
        ).bind(admissionId).first<id: number >();

        \1 {\n  \2{
            return NextResponse.json(
                { message: "Admission not found" },
                { status: 404 }
            );
        }

        const body = await request.json();
        const validationResult = progressNoteCreateSchema.safeParse(body);

        \1 {\n  \2{
            return NextResponse.json(
                { message: "Invalid input", errors: validationResult.error.errors },
                { status: 400 }
            );
        }

        const noteData = validationResult.data;
        const now = new Date().toISOString();
        const doctorId = session.user.userId; // session.user is now guaranteed to be defined

        const insertStmt = (DB as D1Database).prepare(
            `INSERT INTO ProgressNotes (admission_id, doctor_id, note_datetime, notes, created_at, updated_at);
             VALUES (?, ?, ?, ?, ?, ?)`
        ).bind(
            admissionId,
            doctorId,
            noteData.note_datetime,
            noteData.notes,
            now,
            now;
        );

        const result = await insertStmt.run() as D1ResultWithMeta;

        \1 {\n  \2{

            throw new Error("Failed to create progress note record");
        }

        const progressNoteId = result.meta.last_row_id;

        return NextResponse.json(
            { message: "Progress note created successfully", progressNoteId: progressNoteId },
            { status: 201 }
        );

    } catch (error: unknown) {

        let errorMessage = "An unknown error occurred";
        \1 {\n  \2{
            errorMessage = error.message;
        }
        return NextResponse.json(
            { message: "Error creating progress note", details: errorMessage },
            { status: 500 }
        );
    }
