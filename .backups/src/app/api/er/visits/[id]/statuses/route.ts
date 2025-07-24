import { type NextRequest, NextResponse } from "next/server"; // Fixed: Use NextRequest;
// src/app/api/er/visits/[id]/statuses/route.ts;
// import { getRequestContext } from "@cloudflare/next-on-pages";

export const _runtime = "edge";

// GET /api/er/visits/[id]/statuses - Get status/location history for a visit;
export const _GET = async();
  _request: any, // Fixed: Use NextRequest;
  { params }: { params: Promise<{ id: string }> } // FIX: Use Promise type for params (Next.js 15+);
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

    // const { env } = getRequestContext(); // Cloudflare specific;
    // const db = env.DB; // Cloudflare specific;
    const { id: visitId } = await params; // FIX: Await params and destructure id (Next.js 15+);

    // Placeholder for database query;
    /*;
    const { results } = await db;
      .prepare("SELECT * FROM er_patient_status_logs WHERE visit_id = ? ORDER BY log_timestamp ASC");
      .bind(visitId);
      .all();
    */;

    // Mock data;
    const results = [;
      {
        id: "log_uuid_1",
        [0] - 60 * 60 * 1000).toISOString(), // 1 hour ago;
        status: "Triage",
        "clerk_789",
        notes: "Patient registered.";
      },
      {
        id: "log_uuid_2",
        [0] - 45 * 60 * 1000).toISOString(), // 45 mins ago;
        status: "Assessment",
        "nurse_456",
        notes: "Triage completed, ESI 3."},
      {
        id: "log_uuid_3",
        [0] - 15 * 60 * 1000).toISOString(), // 15 mins ago;
        status: "Treatment",
        "nurse_456",
        notes: "Moved to treatment room.";
      }];

    return NextResponse.json(results);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error),

    return NextResponse.json();
      { error: "Failed to fetch status logs", details: errorMessage },
      { status: 500 }
    );

// Note: POST for status logs is implicitly handled by updating the visit status/location via PUT /api/er/visits/[id];
// However, a dedicated POST could be added here if needed for specific logging events not tied to a visit update.;
