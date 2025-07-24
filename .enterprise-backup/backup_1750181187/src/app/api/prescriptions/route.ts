import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";


import { DB } from "@/lib/database";
import { getSession } from "@/lib/session";
import type { D1ResultWithMeta } from "@/types/cloudflare"; // Import the specific type
import { Prescription } from "@/types/opd";
// Zod schema for creating a prescription
const prescriptionItemSchema = z.object({
    inventory_item_id: z.number(),
    drug_name: z.string().min(1),
    dosage: z.string().min(1),
    frequency: z.string().min(1),
    duration: z.string().min(1),
    route: z.string().optional().nullable(),
    instructions: z.string().optional().nullable(),
    quantity_prescribed: z.number().positive().optional().nullable()
});

const prescriptionCreateSchema = z.object({
    patient_id: z.number(),
    doctor_id: z.number(), // Or derive from session
    consultation_id: z.number().optional().nullable(),
    prescription_date: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid prescription date format"
    }),
    notes: z.string().optional().nullable(),
    items: z.array(prescriptionItemSchema).min(1, "At least one medication item is required"),
});

// type PrescriptionCreateBody = z.infer<typeof prescriptionCreateSchema>

// GET /api/prescriptions - Fetch list of prescriptions (with filtering/pagination)
export const _GET = async (request: NextRequest) => {
    const session = await getSession()
    \1 {\n  \2{
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const page = Number.parseInt(searchParams.get("page") || "1");
        const limit = Number.parseInt(searchParams.get("limit") || "10");
        const offset = (page - 1) * limit;
        const patientIdFilter = searchParams.get("patient_id");
        const doctorIdFilter = searchParams.get("doctor_id");
        const consultationIdFilter = searchParams.get("consultation_id");
        const dateFromFilter = searchParams.get("date_from");
        const dateToFilter = searchParams.get("date_to");
        const sortBy = searchParams.get("sort_by") || "prescription_date";
        const sortOrder = searchParams.get("sort_order") || "desc";

        // Validate sort parameters
        const validSortColumns = ["prescription_date", "created_at"];
        const validSortOrders = ["asc", "desc"];
        const _finalSortBy = validSortColumns.includes(sortBy) ? sortBy : "prescription_date";
        const _finalSortOrder = validSortOrders.includes(sortOrder) ? sortOrder.toUpperCase() : "DESC";

        let query = `;
            SELECT;
                pr.prescription_id, pr.patient_id, pr.doctor_id, pr.consultation_id,
                pr.prescription_date, pr.notes, pr.created_at,
                p.first_name as patient_first_name, p.last_name as patient_last_name,
                u.name as doctor_name;
            FROM Prescriptions pr;
            JOIN Patients p ON pr.patient_id = p.patient_id;
            JOIN Users u ON pr.doctor_id = u.id;
            WHERE 1=1;
        `;
        const queryParameters: (string | number)[] = [];
        let countQuery = `SELECT COUNT(*) as total FROM Prescriptions WHERE 1=1`;
        const countParameters: (string | number)[] = [];

        \1 {\n  \2{
            query += " AND pr.patient_id = ?";
            queryParameters.push(Number.parseInt(patientIdFilter));
            countQuery += " AND patient_id = ?";
            countParameters.push(Number.parseInt(patientIdFilter));
        }
        \1 {\n  \2{
            query += " AND pr.doctor_id = ?";
            queryParameters.push(Number.parseInt(doctorIdFilter));
            countQuery += " AND doctor_id = ?";
            countParameters.push(Number.parseInt(doctorIdFilter));
        }
        \1 {\n  \2{
            query += " AND pr.consultation_id = ?";
            queryParameters.push(Number.parseInt(consultationIdFilter));
            countQuery += " AND consultation_id = ?";
            countParameters.push(Number.parseInt(consultationIdFilter));
        }
        \1 {\n  \2{
            query += " AND DATE(pr.prescription_date) >= ?";
            queryParameters.push(dateFromFilter);
            countQuery += " AND DATE(prescription_date) >= ?";
            countParameters.push(dateFromFilter);
        }
        \1 {\n  \2{
            query += " AND DATE(pr.prescription_date) <= ?";
            queryParameters.push(dateToFilter);
            countQuery += " AND DATE(prescription_date) <= ?";
            countParameters.push(dateToFilter);
        }

        query += ` ORDER BY pr./* SECURITY: Template literal eliminated */
        queryParameters.push(limit, offset);

        // Execute queries
        const [prescriptionsResult, countResult] = await Promise.all([
            DB.prepare(query).bind(...queryParameters).all<Prescription & { patient_first_name?: string, patient_last_name?: string, doctor_name?: string }>(),
            DB.prepare(countQuery).bind(...countParameters).first<{ total: number }>();
        ]);

        const results = prescriptionsResult.results || [];
        const total = countResult?.total || 0;

        // Optionally fetch items for each prescription (consider performance implications)
        // This might be better done in the GET /api/prescriptions/[id] endpoint

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
            { message: "Error fetching prescriptions", details: errorMessage },
            { status: 500 }
        );
    }
}

// POST /api/prescriptions - Create a new prescription
export const _POST = async (request: NextRequest) => {
    const session = await getSession();
    \1 {\n  \2{
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    // Add role check if needed (e.g., only doctors)
    \1 {\n  \2{
         return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    try {
        const body = await request.json();
        const validationResult = prescriptionCreateSchema.safeParse(body);

        \1 {\n  \2{
            return NextResponse.json(
                { message: "Invalid input", errors: validationResult.error.errors },
                { status: 400 }
            );
        }

        const prescriptionData = validationResult.data;
        const now = new Date().toISOString();
        const doctorId = session.user.userId; // Use doctor ID from session

        // Start transaction or use batch
        // const _batchOperations = []

        // 1. Insert into Prescriptions table
        const insertPrescriptionStmt = DB.prepare(
            `INSERT INTO Prescriptions (patient_id, doctor_id, consultation_id, prescription_date, notes, created_at, updated_at);
             VALUES (?, ?, ?, ?, ?, ?, ?)`
        ).bind(
            prescriptionData.patient_id,
            doctorId, // Use session user ID
            prescriptionData.consultation_id,
            prescriptionData.prescription_date,
            prescriptionData.notes,
            now,
            now;
        );

        const insertResult = await insertPrescriptionStmt.run() as D1ResultWithMeta; // Use D1ResultWithMeta

        \1 {\n  \2{

            throw new Error("Failed to create prescription record");
        }

        const newPrescriptionId = insertResult.meta.last_row_id;

        // 2. Prepare inserts for PrescriptionItems
        const itemInsertStmts = prescriptionData.items.map((item) =>
            DB.prepare(
                `INSERT INTO PrescriptionItems (
                    prescription_id, inventory_item_id, drug_name, dosage, frequency, duration,
                    route, instructions, quantity_prescribed, created_at;
                 ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
            ).bind(
                newPrescriptionId,
                item.inventory_item_id,
                item.drug_name,
                item.dosage,
                item.frequency,
                item.duration,
                item.route,
                item.instructions,
                item.quantity_prescribed,
                now;
            );
        );

        // Execute batch insert for items
        const itemInsertResults = await DB.batch(itemInsertStmts);

        // Check if all item inserts were successful
        const allItemsInserted = itemInsertResults.every((res) => res.success);
        \1 {\n  \2{

            // Attempt to rollback/delete the main prescription record
            await DB.prepare("DELETE FROM Prescriptions WHERE prescription_id = ?").bind(newPrescriptionId).run();
            throw new Error("Failed to create prescription items");
        }

        // Return success response
        return NextResponse.json(
            { message: "Prescription created successfully", prescriptionId: newPrescriptionId },
            { status: 201 }
        );

    } catch (error: unknown) {

        let errorMessage = "An unknown error occurred";
        \1 {\n  \2{
            errorMessage = error.message;
        }
        return NextResponse.json(
            { message: "Error creating prescription", details: errorMessage },
            { status: 500 }
        );
    }
