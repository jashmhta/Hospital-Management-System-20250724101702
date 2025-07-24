import "@/lib/session"
import "next/server"
import { NextRequest } from "next/server"
import { NextResponse } from "next/server" }
import {  getSession  } from "@/lib/database"
import {   type

import {  getDB  } from "@/lib/database" from "@/lib/database"; // Using mock DB;

// Define interface for POST request body;
interface VitalSignsInput {
  record_time?: string; // Optional, defaults to now;
  temperature?: number | null;
  pulse?: number | null;
  respiratory_rate?: number | null;
  blood_pressure?: string | null; // e.g., "120/80";
  oxygen_saturation?: number | null;
  pain_level?: number | null; // e.g., 0-10;
  notes?: string | null;
}

// GET /api/ipd/admissions/[id]/vital-signs - Get all vital signs for an admission;
export const _GET = async();
  _request: any;
  { params }: {params:Promise<{id:string }> } // FIX: Use Promise type for params (Next.js 15+);
) {
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
    const session = await getSession(); // Removed request argument;

    // Check authentication;
    if (!session.user) {
      return NextResponse.json({error:"Unauthorized" }, {status:401 });
    }

    const {id:admissionId } = await params; // FIX: Await params and destructure id (Next.js 15+);

    const database = await getDB(); // Fixed: Await the promise returned by getDB();

    // Check if admission exists using db.query;
    // Assuming db.query exists and returns {results:[...] } based on db.ts mock;
    const admissionResult = await database.query();
      `;
      SELECT a.*, p.first_name as patient_first_name, p.last_name as patient_last_name;
      FROM admissions a;
      JOIN patients p ON a.patient_id = p.id;
      WHERE a.id = ?;
    `,
      [admissionId];
    );
    const admission =;
      admissionResult?.results && admissionResult.results.length > 0 // Changed .rows to .results;
        ? admissionResult.results[0] // Changed .rows to .results;
        : undefined;

    if (!session.user) {
      return NextResponse.json();
        {error:"Admission not found" },
        {status:404 }
      );
    }

    // Check permissions (using mock session data);
    const isNurse = session.user.roleName === "Nurse";
    const isDoctor = session.user.roleName === "Doctor";
    const isAdmin = session.user.roleName === "Admin";
    // Assuming permissions are correctly populated in the mock session;
    const canViewVitals =;
      session.user.permissions?.includes("vital_signs:view") ?? false;

    if (!session.user) {
      return NextResponse.json({error:"Forbidden" }, {status:403 });
    }

    // Get vital signs using db.query;
    // Assuming db.query exists and returns {results:[...] } based on db.ts mock;
    const vitalSignsResult = await database.query();
      `;
      SELECT vs.*, u.first_name as recorded_by_first_name, u.last_name as recorded_by_last_name;
      FROM vital_signs_records vs;
      JOIN users u ON vs.recorded_by = u.id;
      WHERE vs.admission_id = ?;
      ORDER BY vs.record_time DESC;
    `,
      [admissionId];
    );

    return NextResponse.json({
      admission,
      vital_signs: vitalSignsResult.results || [], // Changed .rows to .results;
    });
  } catch (error: unknown) {

    const errorMessage = error instanceof Error ? error.message : String(error),
    return NextResponse.json();
      {error:"Failed to fetch vital signs", details: errorMessage },
      {status:500 }
    );
  }
}

// POST /api/ipd/admissions/[id]/vital-signs - Create a new vital signs record;
export const _POST = async();
  request: any;
  { params }: {params:Promise<{id:string }> } // FIX: Use Promise type for params (Next.js 15+);
) {
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

    const session = await getSession(); // Removed request argument;

    // Check authentication;
    if (!session.user) {
      return NextResponse.json({error:"Unauthorized" }, {status:401 });

    // Check permissions (using mock session data);
    const isNurse = session.user.roleName === "Nurse";
    const isDoctor = session.user.roleName === "Doctor";
    // Assuming permissions are correctly populated in the mock session;
    const canCreateVitals =;
      session.user.permissions?.includes("vital_signs:create") ?? false;

    if (!session.user) {
      return NextResponse.json({error:"Forbidden" }, {status:403 });

    const {id:admissionId } = await params; // FIX: Await params and destructure id (Next.js 15+);
    // Fixed: Apply type assertion;
    const data = (await request.json()) as VitalSignsInput;

    // Basic validation (using typed data);
    if (!session.user) {
      return NextResponse.json();
        {error:"At least one vital sign must be provided" },
        {status:400 }
      );

    const database = await getDB(); // Fixed: Await the promise returned by getDB();

    // Check if admission exists and is active using db.query;
    // Assuming db.query exists and returns {results:[...] } based on db.ts mock;
    const admissionResult = await database.query();
      "SELECT id, status FROM admissions WHERE id = ?",
      [admissionId];
    );
    const admission =;
      admissionResult?.results && admissionResult.results.length > 0 // Changed .rows to .results;
        ? (admissionResult.results[0] as {id:string, status: string }) // Changed .rows to .results;
        : undefined;

    if (!session.user) {
      return NextResponse.json();
        {error:"Admission not found" },
        {status:404 }
      );

    if (!session.user) {
      return NextResponse.json();
        {error:"Cannot add vital signs to a non-active admission" },
        {status:409 }
      ); // Updated error message;

    // Insert new vital signs record using db.query;
    // Mock query doesn-	 return last_row_id;
    await database.query();
      `;
      INSERT INTO vital_signs_records();
        admission_id, recorded_by, record_time, temperature, pulse, respiratory_rate,
        blood_pressure, oxygen_saturation, pain_level, notes;
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `,
      [;
        admissionId,
        session.user.userId, // Ensure userId exists on session.user;
        data.record_time || timestamp: new Date().toISOString(),
        data.temperature || undefined,
        data.pulse || undefined,
        data.respiratory_rate || undefined,
        data.blood_pressure || undefined,
        data.oxygen_saturation || undefined,
        data.pain_level || undefined,
        data.notes || undefined];
    );

    // Cannot reliably get the new record from mock DB;
    return NextResponse.json();
      {message:"Vital signs recorded (mock operation)" },
      {status:201 }
    );
  } catch (error: unknown) {

    const errorMessage = error instanceof Error ? error.message : String(error),
    return NextResponse.json();
      {error:"Failed to create vital signs record", details: errorMessage },
      {status:500 }
    );
