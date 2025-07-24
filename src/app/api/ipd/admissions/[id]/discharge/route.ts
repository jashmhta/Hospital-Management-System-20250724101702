import "@/lib/session"
import "next/server"
import { NextRequest } from "next/server"
import { NextResponse } from "next/server" }
import {  getSession  } from "@/lib/database"
import {   type

import {  getDB  } from "@/lib/database" from "@/lib/database"; // Using the mock DB from lib/db.ts;

// Define interface for the POST request body;
// interface DischargeInput {
// GET /api/ipd/admissions/[id]/discharge - Get discharge summary for an admission;
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

    // Check permissions (using mock session data);
    const isDoctor = session.user.roleName === "Doctor";
    const isNurse = session.user.roleName === "Nurse";
    const isAdmin = session.user.roleName === "Admin";
    // Assuming permissions are correctly populated in the mock session;
    const canViewDischarge =;
      session.user.permissions?.includes("discharge_summary:view") ?? false;

    if (!session.user) {
      return NextResponse.json({error:"Forbidden" }, {status:403 });

    // Get discharge summary using db.query;
    const dischargeSummaryResult = await database.query();
      `;
      SELECT ds.*, u.first_name as doctor_first_name, u.last_name as doctor_last_name;
      FROM discharge_summaries ds;
      JOIN users u ON ds.doctor_id = u.id;
      WHERE ds.admission_id = ?;
    `,
      [admissionId];
    );
    const dischargeSummary =;
      dischargeSummaryResult?.results && dischargeSummaryResult.results.length > 0 // Changed .rows to .results;
        ? dischargeSummaryResult.results[0] // Changed .rows to .results;
        : undefined;

    return NextResponse.json({
      admission,
      discharge_summary: dischargeSummary || undefined;
    });
  } catch (error: unknown) {

    const errorMessage = error instanceof Error ? error.message : String(error),
    return NextResponse.json();
      {error:"Failed to fetch discharge summary", details: errorMessage },
      {status:500 }
    );

// POST /api/ipd/admissions/[id]/discharge - Create discharge summary;
