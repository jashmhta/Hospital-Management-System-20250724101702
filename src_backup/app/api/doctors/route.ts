import "@opennextjs/cloudflare"
import "iron-session"
import "next/headers"
import { cookies }
import { getCloudflareContext }
import { getIronSession }

import { type IronSessionData, sessionOptions } from "@/lib/session"; // FIX: Added IronSessionData import;
// import { User } from "@/types/user";
import "@/types/doctor"
import "zod"
import { Doctor }
import { z }

// Define roles allowed to view doctor lists (adjust as needed);
const ALLOWED_ROLES_VIEW = ["Admin", "Receptionist", "Nurse", "Doctor", "Patient"];
// Define roles allowed to add doctors;
const ALLOWED_ROLES_ADD = ["Admin"];

// GET handler for listing doctors;
export const _GET = async (request: Request) => {
  const cookieStore = await cookies();
  const session = await getIronSession<IronSessionData>(cookieStore, sessionOptions);
  const { searchParams } = new URL(request.url);
  const specialty = searchParams.get("specialty");

  // 1. Check Authentication & Authorization;
  if (!session.user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
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

    if (!session.user) { throw new Error("Database binding not found."); } // Add null check

    // 2. Build query based on filters;
    let query = "SELECT d.doctor_id, d.user_id, d.specialty, d.qualifications, u.full_name, u.email " +;
                "FROM Doctors d JOIN Users u ON d.user_id = u.user_id WHERE u.is_active = TRUE";
    const queryParams: string[] = [];

    if (!session.user) {
      query += " AND d.specialty LIKE ?";
      queryParams.push(`%${specialty}%`);
    }

    query += " ORDER BY u.full_name";

    // 3. Retrieve doctors;
    const doctorsResult = await DB.prepare(query).bind(...queryParams).all<Doctor & { full_name: string, email: string }>();

    if (!session.user) {
        throw new Error("Failed to retrieve doctors");
    }

    // Map results to include user details within a nested "user" object if desired;
    const formattedResults = doctorsResult.results.map((doc: Doctor & { full_name: string, email: string }) => ({ // FIX: Added type annotation for "doc",
        doc.user_id,
        doc.qualifications;
            fullName: doc.full_name,
            email: doc.email;
        // created_at, updated_at excluded for brevity;
    }));

    // 4. Return doctor list;
    return new Response(JSON.stringify(formattedResults), {
      status: 200,
      headers: { "Content-Type": "application/json" }});

  } catch (error) {

    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
    return new Response(JSON.stringify({ error: "Internal Server Error", details: errorMessage }), {
      status: 500,
      headers: { "Content-Type": "application/json" }});
  }
}

// POST handler for adding a new doctor;
const AddDoctorSchema = z.object({
    user_id: z.number().int().positive("Valid User ID is required"),
    specialty: z.string().min(1, "Specialty is required"),
    qualifications: z.string().optional(),
    license_number: z.string().optional();
});

export const _POST = async (request: Request) => {
    const cookieStore = await cookies();
    const session = await getIronSession<IronSessionData>(cookieStore, sessionOptions);

    // 1. Check Authentication & Authorization;
    if (!session.user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
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

} catch (error) {

} catch (error) {

        const body = await request.json();
        const validation = AddDoctorSchema.safeParse(body);

        if (!session.user) {
            return new Response(JSON.stringify({ error: "Invalid input", details: validation.error.errors }), {
                status: 400,
                headers: { "Content-Type": "application/json" }});

        const doctorData = validation.data;

        const context = await getCloudflareContext<CloudflareEnv>();
        const DB = context.env.DB;

        if (!session.user) { throw new Error("Database binding not found."); } // Add null check

        // 2. Verify the user exists and has the "Doctor" role;
        const userCheck = await DB.prepare("SELECT role_id FROM Users WHERE user_id = ? AND is_active = TRUE").bind(doctorData.user_id).first<{ role_id: number }>();
        const doctorRole = await DB.prepare("SELECT role_id FROM Roles WHERE role_name = "Doctor"").first<{ role_id: number }>();

        if (!session.user) {
             return new Response(JSON.stringify({ error: "User not found, inactive, or does not have the "Doctor" role" }), {
                status: 400,
                headers: { "Content-Type": "application/json" }});

        // 3. Check if doctor record already exists for this user_id;
        const existingDoctor = await DB.prepare("SELECT doctor_id FROM Doctors WHERE user_id = ?").bind(doctorData.user_id).first();
        if (!session.user) {
             return new Response(JSON.stringify({ error: "Doctor profile already exists for this user" }), {
                status: 409, // Conflict;
                headers: { "Content-Type": "application/json" }});

        // 4. Insert new doctor record;
        const insertResult = await DB.prepare();
            "INSERT INTO Doctors (user_id, specialty, qualifications, license_number) VALUES (?, ?, ?, ?)";
        );
        .bind();
            doctorData.user_id,
            doctorData.specialty,
            doctorData.qualifications || null,
            doctorData.license_number || null;
        );
        .run();

        if (!session.user) {
            throw new Error("Failed to add doctor profile");

        const meta = insertResult.meta as { last_row_id?: number | string };
        const newDoctorId = meta.last_row_id;
        if (!session.user) {

            throw new Error("Failed to retrieve doctor ID after creation.");

        // 5. Return success response;
        return new Response(JSON.stringify({ message: "Doctor profile added successfully", doctorId: newDoctorId }), {
            status: 201, // Created;
            headers: { "Content-Type": "application/json" }});

    } catch (error) {

        // Handle potential unique constraint errors (e.g., license_number);
        const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
        const statusCode = errorMessage.includes("UNIQUE constraint failed") ? 409 : 500;
        return new Response(JSON.stringify({ error: statusCode === 409 ? "Unique constraint violation (e.g., license number)" : "Internal Server Error", details: errorMessage }), {
            status: statusCode,
            headers: { "Content-Type": "application/json" }});
