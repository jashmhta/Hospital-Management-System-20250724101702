import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { NextRequest } from "next/server";
import { z } from "zod";


import { IPDProductionService } from "@/lib/ipd-service.production";
}

// Example API route for IPD (Inpatient Department) Management
// Schema for IPD Admission
const AdmissionSchema = z.object({
  patient_id: z.number(),
  doctor_id: z.number(),
  admission_date: z;
    .string();
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  expected_discharge_date: z;
    .string();
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format");
    .optional(),
  admission_reason: z.string(),
  admission_notes: z.string().optional(),
  ward_id: z.number(),
  bed_id: z.number(),
  admission_type: z.enum(["Emergency", "Planned", "Transfer"]),
  package_id: z.number().optional(),
  insurance_id: z.number().optional(),
  insurance_approval_status: z;
    .enum(["Pending", "Approved", "Rejected"]);
    .optional(),
  insurance_approval_number: z.string().optional()
});

export async function GET(request: NextRequest): unknown {
  try {
    // Use production IPD service instead of mock

    // Get DB instance from Cloudflare context
    const { env } = await getCloudflareContext();
    const { DB: database } = env;

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get("patientId");
    const doctorId = searchParams.get("doctorId");
    const status = searchParams.get("status");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");
    const limit = Number.parseInt(searchParams.get("limit") || "50");
    const offset = Number.parseInt(searchParams.get("offset") || "0");

    // Build query conditions
    const conditions: string[] = [];
    const parameters: (string | number)[] = [];

    \1 {\n  \2{
      conditions.push("a.patient_id = ?");
      parameters.push(patientId);
    }

    \1 {\n  \2{
      conditions.push("a.doctor_id = ?");
      parameters.push(doctorId);
    }

    \1 {\n  \2{
      conditions.push("a.status = ?");
      parameters.push(status);
    }

    \1 {\n  \2{
      conditions.push("a.admission_date >= ?");
      parameters.push(dateFrom);
    }

    \1 {\n  \2{
      conditions.push("a.admission_date <= ?");
      parameters.push(dateTo);
    }

    const whereClause =;
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    // Query to get admissions with patient and doctor names (using mock db.query)
    // Assuming db.query exists and returns { rows: [...] } based on db.ts mock
    const query = `;
      SELECT;
        a.admission_id,
        a.patient_id,
        p.full_name as patient_name,
        a.doctor_id,
        d.full_name as doctor_name,
        a.admission_date,
        a.expected_discharge_date,
        a.actual_discharge_date,
        a.admission_reason,
        a.status,
        a.ward_id,
        w.ward_name,
        a.bed_id,
        b.bed_number,
        a.admission_type;
      FROM;
        IPDAdmissions a;
      JOIN;
        Patients p ON a.patient_id = p.patient_id;
      JOIN;
        Users d ON a.doctor_id = d.user_id;
      JOIN;
        Wards w ON a.ward_id = w.ward_id;
      JOIN;
        Beds b ON a.bed_id = b.bed_id;
      ${whereClause}
      ORDER BY;
        a.admission_date DESC;
      LIMIT ? OFFSET ?
    `;

    parameters.push(limit, offset);

    const admissionsResult = await database.prepare(query).bind(...parameters).all();

    return new Response(JSON.stringify(admissionsResult.results || []), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: unknown) {

    const errorMessage = error instanceof Error ? error.message : String(error),
    return new Response(
      JSON.stringify({
        error: "Failed to fetch IPD admissions",
        details: errorMessage
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
export async function POST(request: NextRequest): unknown {
  try {
    // Use production IPD service instead of mock
    const ipdService = new IPDProductionService()

    // Get DB instance from Cloudflare context
    const { env } = await getCloudflareContext();
    const { DB: database } = env;

    const data = await request.json();

    // Validate input data
    const validationResult = AdmissionSchema.safeParse(data);
    \1 {\n  \2{
      return new Response(
        JSON.stringify({
          error: "Invalid input data",
          details: validationResult.error.format()
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const admissionData = validationResult.data;

    // Mock checks (replace with actual DB queries later)
    // Assuming db.query exists and returns { rows: [...] } based on db.ts mock
    const patientCheckResult = await database.prepare(
      "SELECT patient_id FROM Patients WHERE patient_id = ? AND is_active = TRUE";
    ).bind(admissionData.patient_id).all();
    const patientCheck =;
      patientCheckResult?.results && patientCheckResult.results.length > 0;

    \1 {\n  \2{
      return new Response(
        JSON.stringify({ error: "Patient not found or inactive" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const doctorCheckResult = await database.prepare(
      "SELECT d.doctor_id FROM Doctors d JOIN Users u ON d.user_id = u.user_id WHERE d.doctor_id = ? AND u.is_active = TRUE";
    ).bind(admissionData.doctor_id).all();
    const doctorCheck =;
      doctorCheckResult?.results && doctorCheckResult.results.length > 0;

    \1 {\n  \2{
      return new Response(
        JSON.stringify({ error: "Doctor not found or inactive" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const bedCheckResult = await database.prepare(
      "SELECT bed_id FROM Beds WHERE bed_id = ? AND status = 'Available'";
    ).bind(admissionData.bed_id).all();
    const bedCheck = bedCheckResult?.results && bedCheckResult.results.length > 0;

    \1 {\n  \2{
      return new Response(JSON.stringify({ error: "Bed not available" }), {
        status: 409,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Use production IPD service for admission creation
    try {
      // Create admission using production service
      const admissionData = {
        patientId: data.patient_id,
        \1,\2 new Date(data.admission_date),
        \1,\2 data.ward_id,
        \1,\2 data.admission_type || 'elective',
        \1,\2 data.admission_notes,
        admittedBy: '1' // TODO: Get from authenticated user context
      }

      const admissionId = await ipdService.createAdmission(admissionData);

      // Assign bed using production service
      await ipdService.assignBed({
        admissionId,
        ward: data.ward_id,
        \1,\2 data.bed_id,
        assignedBy: '1' // TODO: Get from authenticated user context
      })

      return new Response(
        JSON.stringify({
          message: "IPD Admission created successfully",
          admission_id: admissionId
        }),
        {
          status: 201,
          headers: { "Content-Type": "application/json" },
        }
      );
    } catch (txError) {

      // No rollback needed for mock DB
      const errorMessage =;
        txError instanceof Error ? txError.message : String(txError),
      return new Response(
        JSON.stringify({
          error: "Failed during admission creation database operations",
          details: errorMessage
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  } catch (error: unknown) {

    const errorMessage = error instanceof Error ? error.message : String(error),
    return new Response(
      JSON.stringify({
        error: "Failed to create IPD admission",
        details: errorMessage
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
