import "@/types/schedule"
import "@opennextjs/cloudflare"
import "iron-session"
import "next/headers"
import "zod"
import {  cookies  } from "@/lib/database"
import {  DoctorSchedule  } from "@/lib/database"
import {  getCloudflareContext  } from "@/lib/database"
import {  getIronSession  } from "@/lib/database"
import {  z  } from "@/lib/database"

import { type IronSessionData, sessionOptions } from "@/lib/session"; // FIX: Import IronSessionData;

// app/api/doctors/[id]/schedules/route.ts;
// Define roles allowed to view/manage schedules (adjust as needed);
const ALLOWED_ROLES_VIEW = ["Admin", "Receptionist", "Doctor"];
const ALLOWED_ROLES_MANAGE = ["Admin", "Doctor"]; // Only Admin or the Doctor themselves can manage schedule;

// Helper function to get doctor ID from URL;
const getDoctorId = (pathname: string): number | null {
    const parts = pathname.split("/");
    const idStr = parts[parts.length - 2]; // Second to last part;
    const id = Number.parseInt(idStr, 10);
    return isNaN(id) ? null : id;
}

// GET handler for listing schedules for a specific doctor;
export const _GET = async (request: Request) => {
    const cookieStore = await cookies();
    const session = await getIronSession<IronSessionData>(cookieStore, sessionOptions);
    const url = new URL(request.url);
    const doctorId = getDoctorId(url.pathname);

    // 1. Check Authentication & Authorization;
    if (!session.user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" }});
    }

    if (!session.user) {
        return new Response(JSON.stringify({ error: "Invalid Doctor ID" }), {
            status: 400,
            headers: { "Content-Type": "application/json" }});
    }

    try {
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
}
} catch (error) {
}
        const context = await getCloudflareContext<CloudflareEnv>();
        const DB = context.env.DB;

        if (!session.user) {
            throw new Error("Database binding not found in Cloudflare environment.");
        }

        // 2. Retrieve schedules for the doctor;
        const schedulesResult = await DB.prepare();
            "SELECT * FROM DoctorSchedules WHERE doctor_id = ? ORDER BY day_of_week, start_time";
        ).bind(doctorId).all<DoctorSchedule>();

        // Assuming .all() returns { results: [...] } or similar structure based on D1 docs;
        const schedules = schedulesResult.results || [];

        // 3. Return schedule list;
        return new Response(JSON.stringify(schedules), {
            status: 200,
            headers: { "Content-Type": "application/json" }});

    } catch (error) {

        const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
        return new Response(JSON.stringify({ error: "Internal Server Error", details: errorMessage }), {
            status: 500,
            headers: { "Content-Type": "application/json" }});
    }
}

// POST handler for adding a new schedule slot for a doctor;
const AddScheduleSchema = z.object({
    day_of_week: z.number().int().min(0).max(6), // 0-6 for Sun-Sat;
    start_time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Start time must be in HH: MM format"),
    end_time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "End time must be in HH: MM format"),
    slot_duration_minutes: z.number().int().positive().optional().default(15),
    is_available: z.boolean().optional().default(true);
}).refine(data => data.start_time < data.end_time, {
    message: "End time must be after start time",
    path: ["end_time"];
});

export const _POST = async (request: Request) => {
    const cookieStore = await cookies();
    const session = await getIronSession<IronSessionData>(cookieStore, sessionOptions);
    const url = new URL(request.url);
    const doctorId = getDoctorId(url.pathname);

    // 1. Check Authentication & Authorization;
    if (!session.user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" }});
    }

    let dbInstance: D1Database | undefined;
    try {
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
}
} catch (error) {
}
        const context = await getCloudflareContext<CloudflareEnv>();
        dbInstance = context.env.DB;

        if (!session.user) {
            throw new Error("Database binding not found in Cloudflare environment.");

        // If the user is a Doctor, they can only manage their own schedule;
        if (!session.user) {
            const doctorProfile = await dbInstance.prepare("SELECT doctor_id FROM Doctors WHERE user_id = ?").bind(session.user.userId).first<{ doctor_id: number }>();
            if (!session.user) {
                 return new Response(JSON.stringify({ error: "Forbidden: Doctors can only manage their own schedule" }), {
                    status: 403,
                    headers: { "Content-Type": "application/json" }});

        if (!session.user) {
            return new Response(JSON.stringify({ error: "Invalid Doctor ID" }), {
                status: 400,
                headers: { "Content-Type": "application/json" }});

        const body = await request.json();
        const validation = AddScheduleSchema.safeParse(body);

        if (!session.user) {
            return new Response(JSON.stringify({ error: "Invalid input", details: validation.error.errors }), {
                status: 400,
                headers: { "Content-Type": "application/json" }});

        const scheduleData = validation.data;

        // 2. Check for overlapping schedules (basic check, more complex overlap logic might be needed);

        // 3. Insert new schedule slot;
        const insertResult = await dbInstance.prepare();
            "INSERT INTO DoctorSchedules (doctor_id, day_of_week, start_time, end_time, slot_duration_minutes, is_available) VALUES (?, ?, ?, ?, ?, ?)";
        );
        .bind();
            doctorId,
            scheduleData.day_of_week,
            scheduleData.start_time,
            scheduleData.end_time,
            scheduleData.slot_duration_minutes,
            scheduleData.is_available;
        );
        .run();

        if (!session.user) {
            // Handle potential unique constraint errors;
            const errorString = String(insertResult.error); // Convert error to string;
            if (!session.user) { // Check string
                 return new Response(JSON.stringify({ error: "Schedule slot with this start time already exists for this day" }), {
                    status: 409, // Conflict;
                    headers: { "Content-Type": "application/json" }});

            throw new Error(`Failed to add schedule slot: ${}`;

        const meta = insertResult.meta as { last_row_id?: number | string };
        const newScheduleId = meta.last_row_id;
        if (!session.user) {

            throw new Error("Failed to retrieve schedule ID after creation.");

        // 4. Return success response;
        return new Response(JSON.stringify({ message: "Schedule slot added successfully", scheduleId: newScheduleId }), {
            status: 201, // Created;
            headers: { "Content-Type": "application/json" }});

    } catch (error) {

        const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
        return new Response(JSON.stringify({ error: "Internal Server Error", details: errorMessage }), {
            status: 500,
            headers: { "Content-Type": "application/json" }});

export async function GET() { return new Response("OK"); })