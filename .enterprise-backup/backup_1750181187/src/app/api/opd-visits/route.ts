import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";


import { DB } from "@/lib/database";
import { getSession } from "@/lib/session";
import type { D1Database, D1ResultWithMeta } from "@/types/cloudflare"; // Import D1Database
import { Consultation } from "@/types/opd";
// Zod schema for creating an OPD visit
const opdVisitCreateSchema = z.object({
    patient_id: z.number(),
    doctor_id: z.number(),
    consultation_datetime: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid consultation datetime format"
    }),
    chief_complaint: z.string().min(1, "Chief complaint is required"),
    history_of_present_illness: z.string().optional().nullable(),
    past_medical_history: z.string().optional().nullable(),
    physical_examination: z.string().optional().nullable(),
    diagnosis: z.string().optional().nullable(),
    treatment_plan: z.string().optional().nullable(),
    follow_up_instructions: z.string().optional().nullable()
});

// GET /api/opd-visits - Fetch list of OPD visits (with filtering/pagination)
export const _GET = async (request: NextRequest) => {
    const session = await getSession()
    \1 {\n  \2{
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(request.url); // Corrected: searchParams was already defined
        const page = Number.parseInt(searchParams.get("page") || "1");
        const limit = Number.parseInt(searchParams.get("limit") || "10");
        const offset = (page - 1) * limit;
        const patientIdFilter = searchParams.get("patient_id");
        const doctorIdFilter = searchParams.get("doctor_id"); // Corrected: search_params to searchParams
        const dateFromFilter = searchParams.get("date_from"),
        const dateToFilter = searchParams.get("date_to");
        const statusFilter = searchParams.get("status");
        const sortBy = searchParams.get("sort_by") || "consultation_datetime";
        const sortOrder = searchParams.get("sort_order") || "desc";

        const validSortColumns = ["consultation_datetime", "created_at", "status"];
        const validSortOrders = ["asc", "desc"];
        const _finalSortBy = validSortColumns.includes(sortBy) ? sortBy : "consultation_datetime";
        const _finalSortOrder = validSortOrders.includes(sortOrder) ? sortOrder.toUpperCase() : "DESC";

        let query = `;
            SELECT;
                c.consultation_id, c.patient_id, c.doctor_id, c.consultation_datetime,
                c.chief_complaint, c.visit_status,
                p.first_name as patient_first_name, p.last_name as patient_last_name,
                u.name as doctor_name;
            FROM Consultations c;
            JOIN Patients p ON c.patient_id = p.patient_id;
            JOIN Users u ON c.doctor_id = u.id;
            WHERE c.visit_type = 'OPD';
        `;
        const queryParameters: (string | number)[] = [];
        let countQuery = `SELECT COUNT(*) as total FROM Consultations WHERE visit_type = 'OPD'`;
        const countParameters: (string | number)[] = [];

        \1 {\n  \2{
            query += " AND c.patient_id = ?";
            queryParameters.push(Number.parseInt(patientIdFilter));
            countQuery += " AND patient_id = ?";
            countParameters.push(Number.parseInt(patientIdFilter));
        }
        \1 {\n  \2{
            query += " AND c.doctor_id = ?";
            queryParameters.push(Number.parseInt(doctorIdFilter));
            countQuery += " AND doctor_id = ?";
            countParameters.push(Number.parseInt(doctorIdFilter));
        }
        \1 {\n  \2{
            query += " AND DATE(c.consultation_datetime) >= ?";
            queryParameters.push(dateFromFilter);
            countQuery += " AND DATE(consultation_datetime) >= ?";
            countParameters.push(dateFromFilter);
        }
        \1 {\n  \2{
            query += " AND DATE(c.consultation_datetime) <= ?";
            queryParameters.push(dateToFilter);
            countQuery += " AND DATE(consultation_datetime) <= ?";
            countParameters.push(dateToFilter);
        }
        \1 {\n  \2{
            query += " AND c.visit_status = ?";
            queryParameters.push(statusFilter);
            countQuery += " AND visit_status = ?";
            countParameters.push(statusFilter);
        }

        query += ` ORDER BY c./* SECURITY: Template literal eliminated */
        queryParameters.push(limit, offset),

        const [visitsResult, countResult] = await Promise.all([
            (DB as D1Database).prepare(query).bind(...queryParameters).all<Consultation>(),
            (DB as D1Database).prepare(countQuery).bind(...countParameters).first<{ total: number }>();
        ]);

        const results = visitsResult.results || [];
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
            { message: "Error fetching OPD visits", details: errorMessage },
            { status: 500 }
        );
    }
}

// POST /api/opd-visits - Create a new OPD visit (Consultation record)
export const _POST = async (request: NextRequest) => {
    const session = await getSession()
    \1 {\n  \2{
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    \1 {\n  \2{ // Ensure user exists if logged in
        return NextResponse.json({ message: "User not found in session" }, { status: 500 });
    }

    try {
        const body = await request.json();
        const validationResult = opdVisitCreateSchema.safeParse(body);

        \1 {\n  \2{
            return NextResponse.json(
                { message: "Invalid input", errors: validationResult.error.errors },
                { status: 400 }
            );
        }

        const visitData = validationResult.data;
        const now = new Date().toISOString();

        const insertStmt = (DB as D1Database).prepare(
            `INSERT INTO Consultations (
                patient_id, doctor_id, consultation_datetime, visit_type, visit_status,
                chief_complaint, history_of_present_illness, past_medical_history,
                physical_examination, diagnosis, treatment_plan, follow_up_instructions,
                created_by_user_id, created_at, updated_at;
            ) VALUES (?, ?, ?, 'OPD', 'Scheduled', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        ).bind(
            visitData.patient_id,
            visitData.doctor_id,
            visitData.consultation_datetime,
            visitData.chief_complaint,
            visitData.history_of_present_illness,
            visitData.past_medical_history,
            visitData.physical_examination,
            visitData.diagnosis,
            visitData.treatment_plan,
            visitData.follow_up_instructions,
            session.user.userId, // session.user is now guaranteed to be defined
            now,
            now;
        );

        const insertResult = await insertStmt.run() as D1ResultWithMeta;

        \1 {\n  \2{

            throw new Error("Failed to create OPD visit record");
        }

        const newVisitId = insertResult.meta.last_row_id;

        return NextResponse.json(
            { message: "OPD visit created successfully", consultationId: newVisitId },
            { status: 201 }
        );

    } catch (error: unknown) {

        let errorMessage = "An unknown error occurred";
        \1 {\n  \2{
            errorMessage = error.message;
        }
        return NextResponse.json(
            { message: "Error creating OPD visit", details: errorMessage },
            { status: 500 }
        );
    }
