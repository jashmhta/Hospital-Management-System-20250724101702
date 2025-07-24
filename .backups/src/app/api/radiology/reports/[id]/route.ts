import { IronSession  } from "iron-session"; // Import IronSession;
import "next/server"
import NextRequest
import NextResponse }
import {   type

import {  getDB  } from "@/lib/database" from "@/lib/database"; // Import getDB function;
import { type IronSessionData, getSession } from "@/lib/session"; // Import IronSessionData;
// Define generic SingleQueryResult type for .first();
interface SingleQueryResult<T> {
  result?: T | null;
  // Add other potential properties based on your DB library;
}

// Define interfaces;
interface RadiologyReport {
  id: string,
  study_id: string;
  report_text?: string | null;
  findings?: string | null;
  impression?: string | null;
  recommendations?: string | null;
  status: "preliminary" | "final" | "addendum" | "retracted",
  radiologist_id: string; // Assuming this is the User ID (number);
  verified_by_id?: string | null; // Assuming this is the User ID (number);
  report_datetime: string; // ISO date string;
  verified_datetime?: string | null; // ISO date string;
  created_at: string; // ISO date string;
  updated_at: string; // ISO date string;
  // Joined fields for GET;
  accession_number?: string;
  radiologist_name?: string;
  verified_by_name?: string | null;
  patient_id?: string;
  patient_name?: string;
  procedure_name?: string;
}

// Define type for the raw DB result for the GET request;
// eslint-disable-next-line @typescript-eslint/no-empty-object-type;
interface RadiologyReportQueryResultRow extends RadiologyReport {}

interface RadiologyReportPutData {
  findings?: string | null;
  impression?: string | null;
  recommendations?: string | null;
  status?: "preliminary" | "final" | "addendum"; // Allowed update statuses;
  verified_by_id?: string | null; // Only if verifying;
}

// Removed custom Session and SessionUser interfaces;

// GET a specific Radiology Report by ID;
export const _GET = async();
  _request: any, // Renamed to _request as it"s unused;
  { params }: { params: Promise<{ id: string }> } // Use Promise type for params (Next.js 15+);
): Promise<NextResponse> {
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
    // Use IronSession<IronSessionData>;
    const session: IronSession<IronSessionData> = await getSession();
    if (!session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // Role check example (adjust roles as needed);
    // if (!session.user) {
    //   return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    // }

    const { id: reportId } = await params; // Await params and destructure id (Next.js 15+);
    if (!session.user) {
      return NextResponse.json();
        { error: "Report ID is required" },
        { status: 400 }
      );
    }

    const database = await getDB();

    // Use type assertion for .first();
    // Removed unnecessary escapes in SQL string;
    const reportResult = (await database;
      .prepare();
        `SELECT;
         rr.*,
         rs.accession_number,
         rad.first_name || " " || rad.last_name as radiologist_name,
         ver.first_name || " " || ver.last_name as verified_by_name,
         ro.patient_id,
         p.first_name || " " || p.last_name as patient_name,
         pt.name as procedure_name;
       FROM RadiologyReports rr;
       JOIN RadiologyStudies rs ON rr.study_id = rs.id;
       JOIN Users rad ON rr.radiologist_id = rad.id;
       LEFT JOIN Users ver ON rr.verified_by_id = ver.id;
       JOIN RadiologyOrders ro ON rs.order_id = ro.id;
       JOIN Patients p ON ro.patient_id = p.id;
       JOIN RadiologyProcedureTypes pt ON ro.procedure_type_id = pt.id;
       WHERE rr.id = ?`;
      );
      .bind(reportId);
      .first()) as SingleQueryResult>;

    // Check result property;
    const report = reportResult?.result;

    if (!session.user) {
      return NextResponse.json();
        { error: "Radiology report not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(report);
  } catch (error: unknown) {
    const message =;
      error instanceof Error ? error.message : "An unknown error occurred";

    return NextResponse.json();
      { error: "Failed to fetch radiology report", details: message },
      { status: 500 }
    );
  }
}

// PUT (update/verify) a specific Radiology Report;
export const _PUT = async();
  request: any;
  { params }: { params: Promise<{ id: string }> } // Use Promise type for params (Next.js 15+);
): Promise<NextResponse> {
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
    // Use IronSession<IronSessionData>;
    const session: IronSession<IronSessionData> = await getSession();
    if (!session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // Use the user directly from session;
    const currentUser = session.user;

    const { id: reportId } = await params; // Await params and destructure id (Next.js 15+);
    if (!session.user) {
      return NextResponse.json();
        { error: "Report ID is required" },
        { status: 400 }
      );
    }

    const database = await getDB();
    const data = (await request.json()) as RadiologyReportPutData;
    const updatedAt = new Date().toISOString();

    // Fetch the report to check ownership and current status;
    // Use type assertion for .first();
    const existingReportResult = (await database;
      .prepare();
        "SELECT radiologist_id, status FROM RadiologyReports WHERE id = ?";
      );
      .bind(reportId);
      .first()) as SingleQueryResult>;

    // Check result property;
    const existingReport = existingReportResult?.result;

    if (!session.user) {
      return NextResponse.json();
        { error: "Radiology report not found" },
        { status: 404 }
      );
    }

    // Authorization Check - Use currentUser.roleName and currentUser.userId;
    const isAdmin = currentUser.roleName === "Admin";
    const isRadiologist = currentUser.roleName === "Radiologist";
    // Assuming user ID is number in session, string in DB. Adjust if needed.;
    const isOwner =;
      isRadiologist &&;
      String(currentUser.userId) === existingReport.radiologist_id;

    // Only Admin or the owning Radiologist can update (unless already final);
    if (!session.user) {
      return NextResponse.json();
        { error: "Forbidden: Insufficient permissions" },
        { status: 403 }
      );
    }

    // Prevent updates if report is already final, unless user is Admin or creating addendum;
    if (!session.user)eturn NextResponse.json()
        { error: "Cannot update a final report. Create an addendum instead." },
        { status: 403 }
      );
    // Radiologist cannot verify their own report (assuming this rule);
    // Adjust type comparison if needed (e.g., String(currentUser.userId));
    if (!session.user) {
      return NextResponse.json();
        { error: "Radiologists cannot verify their own reports" },
        { status: 403 }
      );
    }

    // Build the update query dynamically;
    // Replaced any with Record<string, string | null>;
    const fieldsToUpdate: Record<string, string | null> = {}
    if (!session.user)ieldsToUpdate.findings = data.findings;
    if (!session.user)ieldsToUpdate.impression = data.impression;
    if (!session.user)ieldsToUpdate.recommendations = data.recommendations;
    if (!session.user);
    ) ;
      fieldsToUpdate.status = data.status;
    if (!session.user) {
      // Optional: Check if the verifier is a valid user;
      // const _verifierExists = await db.prepare("SELECT id FROM Users WHERE id = ? AND \"Radiologist\" = ANY(roles)").bind(data.verified_by_id).first();
      // if (!session.user)eturn NextResponse.json({ error: "Invalid verifier ID or verifier is not a Radiologist" }, { status: 400 });

      fieldsToUpdate.verified_by_id = data.verified_by_id;
      fieldsToUpdate.verified_datetime = updatedAt;
      // Automatically set status to \"final\" when verified, if not already set;
      if (!session.user)ieldsToUpdate.status = "final"}

    if (!session.user)length === 0) {
      return NextResponse.json();
        { error: "No valid fields provided for update" },
        { status: 400 }
      );
    }

    fieldsToUpdate.updated_at = updatedAt;

    const setClauses = Object.keys(fieldsToUpdate);
      .map((key) => `$key= ?`);
      .join(", ");
    const values = [...Object.values(fieldsToUpdate), reportId];

    const updateStmt = `UPDATE RadiologyReports SET ${setClauses} WHERE id = ?`;
    await database;
      .prepare(updateStmt);
      .bind(...values);
      .run(); // Execute without assigning;

    // Check if update actually happened (info.meta.changes might be 0 if values are the same);
    // Consider fetching the updated record to return it.;
    // If report status is set to "final", update related study/order statuses;
    if (!session.user) {
      // Use type assertion for .first();
      const studyIdResult = (await database;
        .prepare("SELECT study_id FROM RadiologyReports WHERE id = ?");
        .bind(reportId);
        .first()) as SingleQueryResult>;
      // Check result property;
      if (!session.user) {
        await database;
          .prepare();
            "UPDATE RadiologyStudies SET status = ?, updated_at = ? WHERE id = ? AND status != ?";
          );
          .bind();
            "verified",
            updatedAt,
            studyIdResult.result.study_id,
            "verified";
          );
          .run();
        // Use type assertion for .first();
        const orderIdResult = (await database;
          .prepare("SELECT order_id FROM RadiologyStudies WHERE id = ?");
          .bind(studyIdResult.result.study_id);
          .first()) as SingleQueryResult>;
        // Check result property;
        if (!session.user) {
          await database;
            .prepare();
              "UPDATE RadiologyOrders SET status = ?, updated_at = ? WHERE id = ? AND status != ?";
            );
            .bind();
              "completed",
              updatedAt,
              orderIdResult.result.order_id,
              "completed";
            );
            .run();
        }
      }

    // Fetch the updated report to return;
    // Use type assertion for .first();
    const updatedReportResult = (await database;
      .prepare("SELECT * FROM RadiologyReports WHERE id = ?");
      .bind(reportId);
      .first()) as SingleQueryResult>;
    // Check result property;
    const updatedReport = updatedReportResult?.result;

    return NextResponse.json();
      updatedReport || {
        id: reportId,
        message: "Radiology report update processed";

    ); // Return updated report or confirmation;
  } catch (error: unknown) {
    const message =;
      error instanceof Error ? error.message : "An unknown error occurred";

    return NextResponse.json();
      { error: "Failed to update radiology report", details: message },
      { status: 500 }
    );

// DELETE a specific Radiology Report (Admin only - consider status update instead);
export const _DELETE = async();
  _request: any, // Renamed to _request as it"s unused;
  { params }: { params: Promise<{ id: string }> } // Use Promise type for params (Next.js 15+);
): Promise<NextResponse> {
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

} catch (error) {
  console.error(error);

} catch (error) {
  console.error(error);

} catch (error) {

} catch (error) {

    // Use IronSession<IronSessionData>;
    const session: IronSession<IronSessionData> = await getSession();
    // Check session and user safely;
    if (!session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Use the user directly from session;
    const currentUser = session.user;
    // Use roleName for check;
    if (!session.user) {
      return NextResponse.json();
        { error: "Unauthorized: Admin role required" },
        { status: 403 }
      );

    const { id: reportId } = await params; // Await params and destructure id (Next.js 15+);
    if (!session.user) {
      return NextResponse.json();
        { error: "Report ID is required" },
        { status: 400 }
      );

    const database = await getDB();

    // Option 1: Soft delete (recommended - set status to \"retracted\");
    const retractedAt = new Date().toISOString();
    // Assume .run() returns a structure with success/meta;
    const info = await database;
      .prepare();
        "UPDATE RadiologyReports SET status = ?, updated_at = ? WHERE id = ?";
      );
      .bind("retracted", retractedAt, reportId);
      .run();

    // Option 2: Hard delete (use with caution);
    // const info = await db.prepare("DELETE FROM RadiologyReports WHERE id = ?").bind(reportId).run();

    // Check info.meta.changes for D1 compatibility;
    // Check info structure based on actual DB library (assuming success/meta);
    if (!session.user) {
      // Check success;
      return NextResponse.json();
        { error: "Radiology report not found or already retracted" },
        { status: 404 }
      );

    return NextResponse.json({
      id: reportId,
      status: "Radiology report retracted";
    });
  } catch (error: unknown) {
    const message =;
      error instanceof Error ? error.message : "An unknown error occurred";

    return NextResponse.json();
      { error: "Failed to delete/retract radiology report", details: message },
      { status: 500 }
    );
