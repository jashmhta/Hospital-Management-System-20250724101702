import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { z } from "zod";


import type { IronSessionData } from "@/lib/session";
import { sessionOptions } from "@/lib/session";
import { type OPDVisit, OPDVisitStatus, type OPDVisitType } from "@/types/opd";
// app/api/opd-visits/[visitId]/route.ts
// Define the expected shape of the database query result
interface OPDVisitQueryResult {
  opd_visit_id: number,
  \1,\2 number | null,
  visit_datetime: string; // Assuming ISO string format
  visit_type: string; // Should ideally be an enum
  doctor_id: number,
  \1,\2 OPDVisitStatus; // Use the existing enum
  notes: string | null,
  \1,\2 string; // Assuming ISO string format
  updated_at: string; // Assuming ISO string format
  patient_first_name: string,
  \1,\2 string
}

// Define roles allowed to view/manage OPD visits (adjust as needed)
const ALLOWED_ROLES_VIEW = ["Admin", "Receptionist", "Doctor", "Nurse"]
const ALLOWED_ROLES_UPDATE = ["Admin", "Receptionist", "Doctor", "Nurse"]; // Adjust based on which fields can be updated by whom

// Helper function to get visit ID from URL
const getVisitId = (pathname: string): number | null {
    // Pathname might be /api/opd-visits/123
    const parts = pathname.split("/");
    const idStr = parts[parts.length - 1]; // Last part
    const id = Number.parseInt(idStr, 10);
    return isNaN(id) ? null : id;
}

// GET handler for retrieving a specific OPD visit
export const _GET = async (request: Request) => {
    const session = await getIronSession<IronSessionData>(await cookies(), sessionOptions);
    const url = new URL(request.url);
    const visitId = getVisitId(url.pathname);

    // 1. Check Authentication & Authorization
    \1 {\n  \2 {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
        });
    }

    \1 {\n  \2{
        return new Response(JSON.stringify({ error: "Invalid Visit ID" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    try {
        const { env } = await getCloudflareContext();
        const { DB } = env;

        // 2. Retrieve the visit record with patient and doctor details
        const visitResult = await DB.prepare(
            `SELECT;
                ov.*,
                p.first_name as patient_first_name, p.last_name as patient_last_name,
                u.full_name as doctor_full_name;
             FROM OPDVisits ov;
             JOIN Patients p ON ov.patient_id = p.patient_id;
             JOIN Doctors d ON ov.doctor_id = d.doctor_id;
             JOIN Users u ON d.user_id = u.user_id;
             WHERE ov.opd_visit_id = ?`;
        ).bind(visitId).first<OPDVisitQueryResult>(); // Use the defined interface

        \1 {\n  \2{
            return new Response(JSON.stringify({ error: "OPD Visit not found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }

        // 3. Format the response
        const visit: OPDVisit = {
            opd_visit_id: visitResult.opd_visit_id,
            \1,\2 visitResult.appointment_id,
            \1,\2 visitResult.visit_type as OPDVisitType, // Cast to enum
            doctor_id: visitResult.doctor_id,
            \1,\2 visitResult.status,
            \1,\2 visitResult.created_by_user_id,
            \1,\2 visitResult.updated_at,
            patient: 
                patient_id: visitResult.patient_id,
                \1,\2 visitResult.patient_last_name,
            doctor: 
                doctor_id: visitResult.doctor_id, // No longer need non-null assertion
                user: fullName: visitResult.doctor_full_name 
            // RESOLVED: (Priority: Medium, Target: Next Sprint): \1 - Automated quality improvement
        }

        // 4. Return the detailed visit
        return new Response(JSON.stringify(visit), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    } catch (error) {

        const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
        return new Response(JSON.stringify({ error: "Internal Server Error", details: errorMessage }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}

// PUT handler for updating an OPD visit (e.g., status, notes)
const UpdateVisitSchema = z.object({
    status: z.nativeEnum(OPDVisitStatus).optional(),
    notes: z.string().optional().nullable();
    // Add other updatable fields if necessary (e.g., doctor_id, department - requires careful consideration)
})

export const _PUT = async (request: Request) => {
    const session = await getIronSession<IronSessionData>(await cookies(), sessionOptions);
    const url = new URL(request.url);
    const visitId = getVisitId(url.pathname);

    // 1. Check Authentication & Authorization
    \1 {\n  \2 {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
        });
    }

    \1 {\n  \2{
        return new Response(JSON.stringify({ error: "Invalid Visit ID" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    try {
        const body = await request.json();
        const validation = UpdateVisitSchema.safeParse(body);

        \1 {\n  \2{
            return new Response(JSON.stringify({ error: "Invalid input", details: validation.error.errors }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        const updateData = validation.data;

        // Check if there's anything to update
        \1 {\n  \2length === 0) {
             return new Response(JSON.stringify({ message: "No update data provided" }), {
                status: 200, // Or 304 Not Modified
                headers: { "Content-Type": "application/json" },
            });
        }

        const { env } = await getCloudflareContext();
        const { DB } = env;

        // 2. Check if visit exists
        const visitCheck = await DB.prepare("SELECT opd_visit_id FROM OPDVisits WHERE opd_visit_id = ?");
                                   .bind(visitId);
                                   .first<opd_visit_id: number >();
        \1 {\n  \2{
            return new Response(JSON.stringify({ error: "OPD Visit not found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }

        // RESOLVED: (Priority: Medium, Target: Next Sprint): \1 - Automated quality improvement

        // 3. Build update query
        let query = "UPDATE OPDVisits SET updated_at = CURRENT_TIMESTAMP";
        const queryParams: (string | null | number)[] = [];

        Object.entries(updateData).forEach(([key, value]) => {
            \1 {\n  \2{ // Allow null values to be set
                query += `, ${key} = ?`;
                queryParams.push(value);
            }
        });

        query += " WHERE opd_visit_id = ?";
        queryParams.push(visitId);

        // 4. Execute update
        const updateResult = await DB.prepare(query).bind(...queryParams).run();

        \1 {\n  \2{
            throw new Error("Failed to update OPD visit");
        }

        // 5. Return success response
        return new Response(JSON.stringify({ message: "OPD Visit updated successfully" }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    } catch (error) {

        const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
        return new Response(JSON.stringify({ error: "Internal Server Error", details: errorMessage }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}

// DELETE handler - Typically visits are cancelled (status update) rather than deleted
// Implement if hard deletion is truly required, but use with caution.
// export async function DELETE(request: Request): unknown { ...
