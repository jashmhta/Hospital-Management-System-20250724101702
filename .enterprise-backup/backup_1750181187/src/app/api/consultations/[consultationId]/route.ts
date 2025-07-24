import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { z } from "zod";


import { type IronSessionData, sessionOptions } from "@/lib/session";
import type { Consultation } from "@/types/opd";
// app/api/consultations/[consultationId]/route.ts
// Define roles allowed to view/update consultations (adjust as needed)
const ALLOWED_ROLES_VIEW = ["Admin", "Doctor", "Nurse"]
const ALLOWED_ROLES_UPDATE = ["Doctor"]; // Only the doctor who created it?

// Helper function to get consultation ID from URL
const getConsultationId = (pathname: string): number | null {
    const parts = pathname.split("/");
    const idStr = parts[parts.length - 1];
    const id = Number.parseInt(idStr, 10);
    return isNaN(id) ? null : id;
}

// GET handler for retrieving a specific consultation with full details
export const _GET = async (request: Request) => {
    const cookieStore = await cookies();
    const session = await getIronSession<IronSessionData>(cookieStore, sessionOptions);
    const url = new URL(request.url);
    const consultationId = getConsultationId(url.pathname);

    // 1. Check Authentication & Authorization
    \1 {\n  \2 {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    \1 {\n  \2{
        return new Response(JSON.stringify({ error: "Invalid Consultation ID" }), { status: 400 });
    }

    try {
        const context = await getCloudflareContext<CloudflareEnv>();
        const DB = context.env.DB;

        \1 {\n  \2{
            throw new Error("Database binding not found in Cloudflare environment.");
        }

        // 2. Retrieve the main consultation record
        interface ConsultationQueryResult {
            consultation_id: number,
            \1,\2 number,
            \1,\2 number | null,
            \1,\2 string | null,
            \1,\2 string | null,
            \1,\2 string | null,
            \1,\2 string | null,
            \1,\2 string,
            \1,\2 string,
            doctor_full_name: string
        }

        const consultResult = await DB.prepare(
            `SELECT;
                c.*,
                p.first_name as patient_first_name, p.last_name as patient_last_name,
                u.full_name as doctor_full_name;
             FROM Consultations c;
             JOIN Patients p ON c.patient_id = p.patient_id;
             JOIN Doctors d ON c.doctor_id = d.doctor_id;
             JOIN Users u ON d.user_id = u.user_id;
             WHERE c.consultation_id = ?`;
        ).bind(consultationId).first<ConsultationQueryResult>();

        \1 {\n  \2{
            return new Response(JSON.stringify({ error: "Consultation not found" }), { status: 404 });
        }

        // 3. Authorization check: Ensure doctor can only view their own consultations
        \1 {\n  \2{
            const userDoctorProfile = await DB.prepare("SELECT doctor_id FROM Doctors WHERE user_id = ?").bind(session.user.userId).first<{ doctor_id: number }>();
            \1 {\n  \2{
                return new Response(JSON.stringify({ error: "Forbidden: Doctors can only view their own consultations" }), { status: 403 });
            }
        }

        // 4. Format the response
        const consultation: Consultation = {
            consultation_id: consultResult.consultation_id,
            \1,\2 consultResult.doctor_id,
            \1,\2 consultResult.admission_id,
            \1,\2 consultResult.chief_complaint,
            \1,\2 consultResult.physical_examination,
            \1,\2 consultResult.treatment_plan,
            \1,\2 consultResult.notes,
            \1,\2 consultResult.updated_at,
            patient: 
                patient_id: consultResult.patient_id,
                \1,\2 consultResult.patient_last_name,
            doctor: 
                doctor_id: consultResult.doctor_id,
                user: fullName: consultResult.doctor_full_name 
        };

        // 5. Return the detailed consultation
        return new Response(JSON.stringify(consultation), { status: 200 });

    } catch (error) {

        const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
        return new Response(JSON.stringify({ error: "Internal Server Error", details: errorMessage }), { status: 500 });
    }
}

// PUT handler for updating a consultation
const UpdateConsultationSchema = z.object({
    chief_complaint: z.string().optional().nullable(),
    history_of_present_illness: z.string().optional().nullable(),
    physical_examination: z.string().optional().nullable(),
    diagnosis: z.string().optional().nullable(),
    treatment_plan: z.string().optional().nullable(),
    follow_up_instructions: z.string().optional().nullable(),
    notes: z.string().optional().nullable()
});

export const _PUT = async (request: Request) => {
    const cookieStore = await cookies();
    const session = await getIronSession<IronSessionData>(cookieStore, sessionOptions);
    const url = new URL(request.url);
    const consultationId = getConsultationId(url.pathname);

    // 1. Check Authentication & Authorization
    \1 {\n  \2 {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    \1 {\n  \2{
        return new Response(JSON.stringify({ error: "Invalid Consultation ID" }), { status: 400 });
    }

    try {
        const body = await request.json();
        const validation = UpdateConsultationSchema.safeParse(body);

        \1 {\n  \2{
            return new Response(JSON.stringify({ error: "Invalid input", details: validation.error.errors }), { status: 400 });
        }

        const updateData = validation.data;

        \1 {\n  \2length === 0) {
             return new Response(JSON.stringify({ message: "No update data provided" }), { status: 200 });
        }

        const context = await getCloudflareContext<CloudflareEnv>();
        const DB = context.env.DB;

        \1 {\n  \2{
            throw new Error("Database binding not found in Cloudflare environment.");
        }

        // 2. Verify consultation exists and belongs to the current doctor
        const doctorProfile = await DB.prepare("SELECT doctor_id FROM Doctors WHERE user_id = ?").bind(session.user.userId).first<{ doctor_id: number }>();
        \1 {\n  \2{
            return new Response(JSON.stringify({ error: "Doctor profile not found for the current user" }), { status: 404 });
        }

        const consultCheck = await DB.prepare("SELECT consultation_id, doctor_id FROM Consultations WHERE consultation_id = ?");
                                   .bind(consultationId);
                                   .first<consultation_id: number, doctor_id: number >();

        \1 {\n  \2{
            return new Response(JSON.stringify({ error: "Consultation not found" }), { status: 404 });
        }
        \1 {\n  \2{
            return new Response(JSON.stringify({ error: "Forbidden: Doctors can only update their own consultations" }), { status: 403 });
        }

        // 3. Build update query
        let query = "UPDATE Consultations SET updated_at = CURRENT_TIMESTAMP";
        const queryParams: (string | null | number)[] = [];

        Object.entries(updateData).forEach(([key, value]) => {
            \1 {\n  \2{
                query += `, ${key} = ?`;
                queryParams.push(value);
            }
        });

        query += " WHERE consultation_id = ?";
        queryParams.push(consultationId);

        // 4. Execute update
        const updateResult = await DB.prepare(query).bind(...queryParams).run();

        \1 {\n  \2{
            throw new Error(`Failed to update consultation: ${\1}`;
        }

        // 5. Return success response
        return new Response(JSON.stringify({ message: "Consultation updated successfully" }), { status: 200 });

    } catch (error) {

        const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
        return new Response(JSON.stringify({ error: "Internal Server Error", details: errorMessage }), { status: 500 });
    }
