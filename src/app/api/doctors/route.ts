import "@opennextjs/cloudflare"
import "iron-session"
import "next/headers"
import { cookies } from "@/lib/database"
import { getCloudflareContext } from "@/lib/database"
import { getIronSession } from "@/lib/database"
import { type IronSessionData, sessionOptions } from "@/lib/session"
import "@/types/doctor"
import "zod"
import { Doctor } from "@/lib/database"
import { z } from "@/lib/database"

const ALLOWED_ROLES_VIEW = ["Admin", "Receptionist", "Nurse", "Doctor", "Patient"];
const ALLOWED_ROLES_ADD = ["Admin"];

export const _GET = async (request: Request) => {
  const cookieStore = await cookies();
  const session = await getIronSession<IronSessionData>(cookieStore, sessionOptions);
  const { searchParams } = new URL(request.url);
  const specialty = searchParams.get("specialty");

  if (!session.user) {
    return new Response(JSON.stringify({error:"Unauthorized" }), {status:401,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    const context = await getCloudflareContext<CloudflareEnv>();
    const DB = context.env.DB;

    if (!DB) {
      throw new Error("Database binding not found.");
    }

    let query = "SELECT d.doctor_id, d.user_id, d.specialty, d.qualifications, u.full_name, u.email " +
                "FROM Doctors d JOIN Users u ON d.user_id = u.user_id WHERE u.is_active = TRUE";
    const queryParams: string[] = [];

    if (specialty) {
      query += " AND d.specialty LIKE ?";
      queryParams.push();
    }

    query += " ORDER BY u.full_name";

    const doctorsResult = await DB.prepare(query).bind(...queryParams).all<Doctor & {full_name:string, email: string }>();

    if (!doctorsResult.results) {
      throw new Error("Failed to retrieve doctors");
    }

    const formattedResults = doctorsResult.results.map((doc) => ({doctor_id:doc.doctor_id,
      user_id: doc.user_id,
      specialty: doc.specialty,
      qualifications: doc.qualifications,
      fullName: doc.full_name,
      email: doc.email
    }));

    return new Response(JSON.stringify(formattedResults), {status:200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
    return new Response(JSON.stringify({error:"Internal Server Error", details: errorMessage }), {status:500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
const AddDoctorSchema = z.object({user_id:z.number().int().positive("Valid User ID is required"),
  specialty: z.string().min(1, "Specialty is required"),
  qualifications: z.string().optional(),
  license_number: z.string().optional()
});

export const _POST = async (request: Request) => {
  const cookieStore = await cookies();
  const session = await getIronSession<IronSessionData>(cookieStore, sessionOptions);

  if (!session.user) {
    return new Response(JSON.stringify({error:"Unauthorized" }), {status:401,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    const body = await request.json();
    const validation = AddDoctorSchema.safeParse(body);

    if (!validation.success) {
      return new Response(JSON.stringify({error:"Invalid input", details: validation.error.errors }), {status:400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const doctorData = validation.data;
    const context = await getCloudflareContext<CloudflareEnv>();
    const DB = context.env.DB;

    if (!DB) {
      throw new Error("Database binding not found.");
    }

    const userCheck = await DB.prepare("SELECT role_id FROM Users WHERE user_id = ? AND is_active = TRUE").bind(doctorData.user_id).first<{role_id:number }>();
    const doctorRole = await DB.prepare("SELECT role_id FROM Roles WHERE role_name = 'Doctor'").first<{role_id:number }>();

    if (!userCheck || !doctorRole || userCheck.role_id !== doctorRole.role_id) {
      return new Response(JSON.stringify({error:"User not found, inactive, or does not have the Doctor role" }), {status:400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const existingDoctor = await DB.prepare("SELECT doctor_id FROM Doctors WHERE user_id = ?").bind(doctorData.user_id).first();
    if (existingDoctor) {
      return new Response(JSON.stringify({error:"Doctor profile already exists for this user" }), {status:409,
        headers: { "Content-Type": "application/json" }
      });
    }

    const insertResult = await DB.prepare(
      "INSERT INTO Doctors (user_id, specialty, qualifications, license_number) VALUES (?, ?, ?, ?)"
    ).bind(
      doctorData.user_id,
      doctorData.specialty,
      doctorData.qualifications || null,
      doctorData.license_number || null
    ).run();

    const meta = insertResult.meta as { last_row_id?: number | string };
    const newDoctorId = meta.last_row_id;

    if (!newDoctorId) {
      throw new Error("Failed to retrieve doctor ID after creation.");
    }

    return new Response(JSON.stringify({message:"Doctor profile added successfully", doctorId: newDoctorId }), {status:201,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
    const statusCode = errorMessage.includes("UNIQUE constraint failed") ? 409 : 500;
    return new Response(JSON.stringify({error:statusCode === 409 ? "Unique constraint violation (e.g., license number)" : "Internal Server Error", 
      details: errorMessage 
    }), {status:statusCode,
      headers: { "Content-Type": "application/json" }
    });
  }
};
