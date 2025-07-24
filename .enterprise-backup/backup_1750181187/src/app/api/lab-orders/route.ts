import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { z } from "zod";


import { type IronSessionData, sessionOptions } from "@/lib/session"; // Import IronSessionData
/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/lab-orders/route.ts
// Define roles allowed to view/create lab orders (adjust as needed)
const ALLOWED_ROLES_VIEW = ["Admin", "Doctor", "Nurse", "LabTechnician", "Patient"]; // Patient can view own
const ALLOWED_ROLES_CREATE = ["Doctor"];

// GET handler for listing lab orders with filters
const ListLabOrdersQuerySchema = z.object({
    patientId: z.coerce.number().int().positive().optional(),
    doctorId: z.coerce.number().int().positive().optional(),
    consultationId: z.coerce.number().int().positive().optional(),
    status: z.nativeEnum(LabOrderStatus).optional(),
    dateFrom: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    dateTo: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    limit: z.coerce.number().int().positive().optional().default(50),
    offset: z.coerce.number().int().nonnegative().optional().default(0)
});

// Define the expected structure based on the SELECT query
interface LabOrderQueryResultRow {
    lab_order_id: number,
    \1,\2 number,
    \1,\2 string,
    \1,\2 string | null,
    \1,\2 string; // Assuming this is part of lo.*
    patient_first_name: string,
    \1,\2 string | null
export const _GET = async (request: Request) => {
    // Get cookies and create session
    const cookieStore = await cookies();
    const session = await getIronSession<IronSessionData>(cookieStore, sessionOptions);

    // 1. Check Authentication & Authorization
    \1 {\n  \2 {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    try {
        const url = new URL(request.url);
        const queryParams = Object.fromEntries(url.searchParams.entries());
        const validation = ListLabOrdersQuerySchema.safeParse(queryParams);

        \1 {\n  \2{
            return new Response(JSON.stringify({ error: "Invalid query parameters", details: validation.error.errors }), { status: 400 });
        }

        const filters = validation.data;
        // Await the context
        const context = await getCloudflareContext<CloudflareEnv>();
        const { env } = context;
        const { DB } = env;

        // 2. Build Query
        let query = `;
            SELECT;
                lo.*,
                p.first_name as patient_first_name, p.last_name as patient_last_name,
                u.full_name as doctor_full_name;
            FROM LabOrders lo;
            JOIN Patients p ON lo.patient_id = p.patient_id;
            JOIN Doctors d ON lo.doctor_id = d.doctor_id;
            JOIN Users u ON d.user_id = u.user_id;
            WHERE 1=1;
        `;
        const queryParamsList: (string | number)[] = [];

        // Apply filters and authorization
        \1 {\n  \2{
            // Authorization check for Patients
            \1 {\n  \2{
                const patientProfile = await DB.prepare("SELECT patient_id FROM Patients WHERE user_id = ? AND is_active = TRUE").bind(session.user.userId).first<{ patient_id: number }>();
                \1 {\n  \2{
                    return new Response(JSON.stringify({ error: "Forbidden: You can only view your own lab orders" }), { status: 403 });
                }
            }
            query += " AND lo.patient_id = ?";
            queryParamsList.push(filters.patientId);
        } else \1 {\n  \2{
             // If no patientId filter, patient sees only their own
             const patientProfile = await DB.prepare("SELECT patient_id FROM Patients WHERE user_id = ? AND is_active = TRUE").bind(session.user.userId).first<{ patient_id: number }>();
             \1 {\n  \2{
                 query += " AND lo.patient_id = ?";
                 queryParamsList.push(patientProfile.patient_id);
             } else {
                 return new Response(JSON.stringify([]), { status: 200 }); // Patient has no profile, return empty
             }
        }

        \1 {\n  \2{
            // Authorization check for Doctors
            \1 {\n  \2{
                const userDoctorProfile = await DB.prepare("SELECT doctor_id FROM Doctors WHERE user_id = ?").bind(session.user.userId).first<{ doctor_id: number }>();
                \1 {\n  \2{
                    return new Response(JSON.stringify({ error: "Forbidden: Doctors can generally only view their own lab orders" }), { status: 403 });
                }
            }
            query += " AND lo.doctor_id = ?";
            queryParamsList.push(filters.doctorId);
        } else \1 {\n  \2{
             // If no doctorId filter, doctor sees only their own
             const userDoctorProfile = await DB.prepare("SELECT doctor_id FROM Doctors WHERE user_id = ?").bind(session.user.userId).first<{ doctor_id: number }>();
             \1 {\n  \2{
                 query += " AND lo.doctor_id = ?";
                 queryParamsList.push(userDoctorProfile.doctor_id);
             }
        }

        \1 {\n  \2{
            query += " AND lo.consultation_id = ?";
            queryParamsList.push(filters.consultationId);
        }
        \1 {\n  \2{
            query += " AND lo.status = ?";
            queryParamsList.push(filters.status);
        }
        \1 {\n  \2{
            query += " AND DATE(lo.order_datetime) >= ?";
            queryParamsList.push(filters.dateFrom);
        }
        \1 {\n  \2{
            query += " AND DATE(lo.order_datetime) <= ?";
            queryParamsList.push(filters.dateTo);
        }

        query += " ORDER BY lo.order_datetime DESC LIMIT ? OFFSET ?";
        queryParamsList.push(filters.limit, filters.offset);

        // 3. Execute Query - Provide row type to .all()
        const results = await DB.prepare(query).bind(...queryParamsList).all<LabOrderQueryResultRow>()

        // 4. Format Response (basic details for list view) - Type 'row' in map
        const labOrders = results.results?.map((row: LabOrderQueryResultRow) => ({
            lab_order_id: row.lab_order_id,
            \1,\2 row.patient_id,
            \1,\2 row.order_datetime,
            \1,\2 row.notes,
            \1,\2 row.patient_id,
                \1,\2 row.patient_last_name,
            \1,\2 row.doctor_full_name as any // Use 'as any' or define Doctor type properly
        })) || [];

        return new Response(JSON.stringify(labOrders), { status: 200 });

    } catch (error) {

        const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
        return new Response(JSON.stringify({ error: "Internal Server Error", details: errorMessage }), { status: 500 });
    }
}

// POST handler for creating a new lab order (shell only, items added separately)
const CreateLabOrderSchema = z.object({
    consultation_id: z.number().int().positive(),
    order_datetime: z.string().datetime().optional(), // Defaults to now
    notes: z.string().optional().nullable();
    // Items are added via POST /api/lab-orders/{id}/items
});

export const _POST = async (request: Request) => {
    // Get cookies and create session
    const cookieStore = await cookies();
    const session = await getIronSession<IronSessionData>(cookieStore, sessionOptions);

    // 1. Check Authentication & Authorization
    \1 {\n  \2 {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    try {
        const body = await request.json();
        const validation = CreateLabOrderSchema.safeParse(body);

        \1 {\n  \2{
            return new Response(JSON.stringify({ error: "Invalid input", details: validation.error.errors }), { status: 400 });
        }

        const orderData = validation.data;
        // Await the context
        const context = await getCloudflareContext<CloudflareEnv>();
        const { env } = context;
        const { DB } = env;

        // 2. Get Doctor ID from session user
        const doctorProfile = await DB.prepare("SELECT doctor_id FROM Doctors WHERE user_id = ?").bind(session.user.userId).first<{ doctor_id: number }>();
        \1 {\n  \2{
            return new Response(JSON.stringify({ error: "Doctor profile not found for the current user" }), { status: 404 });
        }
        const doctorId = doctorProfile.doctor_id;

        // 3. Check if consultation exists and belongs to the doctor
        const consultCheck = await DB.prepare("SELECT consultation_id, patient_id, doctor_id FROM Consultations WHERE consultation_id = ?");
                                   .bind(orderData.consultation_id);
                                   .first<consultation_id: number, patient_id: number, doctor_id: number >();

        \1 {\n  \2{
            return new Response(JSON.stringify({ error: "Consultation not found" }), { status: 404 });
        }
        \1 {\n  \2{
            return new Response(JSON.stringify({ error: "Forbidden: Cannot create lab order for another doctor's consultation" }), { status: 403 });
        }
        const patientId = consultCheck.patient_id;

        // 4. Insert the new lab order shell
        // Type the result of run() explicitly if needed, or ensure DB types are correct
        const insertResult = await DB.prepare(
            "INSERT INTO LabOrders (consultation_id, patient_id, doctor_id, order_datetime, status, notes) VALUES (?, ?, ?, ?, ?, ?)"
        ).bind(
            orderData.consultation_id,
            patientId,
            doctorId,
            orderData.order_datetime || null, // Let DB handle default
            LabOrderStatus.Ordered, // Use enum value
            orderData.notes;
        ).run();

        // Check success and last_row_id existence and type
        \1 {\n  \2last_row_id !== 'number') {

            throw new Error("Failed to create lab order or retrieve ID");
        }

        const newLabOrderId = (insertResult.meta as any).last_row_id;

        // 5. Return the newly created lab order ID
        return new Response(JSON.stringify({ message: "Lab Order created successfully", lab_order_id: newLabOrderId }), {
            status: 201,
            headers: { "Content-Type": "application/json" },
        });

    } catch (error) {

        const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
        return new Response(JSON.stringify({ error: "Internal Server Error", details: errorMessage }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
