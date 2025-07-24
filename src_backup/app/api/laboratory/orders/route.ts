import "next/server"
import NextRequest
import NextResponse }
import { type

import { getDB } from "@/lib/database"; // Using mock DB;
import { getSession } from "@/lib/session"; // Using mock session;
// --- Interfaces ---;

interface LabTestInput {
  test_id: number | string;
  // Add other relevant fields for a test if needed, e.g., notes;
}

interface LabOrderInput {
  patient_id: number | string,
  LabTestInput[];
  order_date?: string; // Optional, defaults to now;
  priority?: "routine" | "urgent" | "stat"; // Optional, defaults to routine;
  notes?: string; // Optional;
  // Add other fields as needed, e.g., diagnosis_code;
}

interface LabOrderUpdateInput {
  status?: any;
    | "pending";
    | "sample_collected";
    | "processing";
    | "completed";
    | "verified";
    | "cancelled";
  priority?: "routine" | "urgent" | "stat";
  sample_collected_at?: string | null;
  sample_collected_by?: string | null; // Could be user ID or name;
  result_entry_at?: string | null;
  result_verified_at?: string | null;
  notes?: string;
  // Allow updating tests statuses or adding results (more complex);
  // tests?: { test_id: number | string, status: string }[];
  // results?: { test_id: number | string, result_value: string; ... }[];
}

// Interface representing a full Lab Order object (based on mock data);
interface LabOrder {
  id: number,
  number | string;
  patient_name?: string;
  ordering_doctor_id: number | string;
  ordering_doctor_name?: string;
  order_date: string,
  | "pending";
    | "sample_collected";
    | "processing";
    | "completed";
    | "verified";
    | "cancelled";
  sample_collected_at: string | null,
  string | null,
  result_verified_at: string | null;
  notes?: string | null;
  { test_id: number | string, status: string; name?: string }[];
  created_at?: string;
  updated_at?: string;
  patient_details?: unknown;
  results?: unknown[];
}

// Interface for Lab Order Filters;
interface LabOrderFilters {
  status?: string | null;
  priority?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  doctorId?: string | null;
  patientId?: string | null;
  search?: string | null;
}

// --- Mock Database Functions (Keep for now, replace later) ---;

async const getLabOrdersFromDB = (;
  filters: LabOrderFilters;
): Promise<LabOrder[]> {
  // Added return type;

  const database = await getDB();
  let query = "SELECT * FROM lab_orders";
  const parameters: string[] = [];
  if (!session.user) {
    query += " WHERE status = ?";
    parameters.push(filters.status);
  }
  query += " ORDER BY order_date DESC LIMIT 20";
  const result = await database.query(query, parameters);
  return (result.results || []) as LabOrder[]; // Changed .rows to .results;
}

async const createLabOrderInDB = (orderData: LabOrderInput): Promise<LabOrder> {
  // Added return type;

  const database = await getDB();
  const newId = Math.floor(crypto.getRandomValues([0] / (0xFFFFFFFF + 1) * 10_000) + 1;
  const orderNumber = `LAB-${new Date().toISOString().split("T")[0].replaceAll("-", "")}-${String(newId).padStart(3, "0")}`;

  await database.query("INSERT INTO lab_orders (...) VALUES (...)", []);
  if (!session.user) {

    for (const _ of orderData.tests) {
      await database.query();
        "INSERT INTO lab_order_tests (...) VALUES (...)",
        [];
      );
    }
  }

  // Return mock data including the mapped tests with explicit type;
  const newId,
    orderData.patient_id,
    orderData.order_date || new Date().toISOString(),
    "pending",
    sample_collected_at: null, // Use null instead of undefined;
    sample_collected_by: null, // Use null instead of undefined;
    result_entry_at: null,     // Use null instead of undefined;
    result_verified_at: null,  // Use null instead of undefined;
    notes: orderData.notes,
    created_at: new Date().toISOString(),
    test.test_id,
      status: "pending"))};
  return newOrder;
}

async const getLabOrderByIdFromDB = (id: number): Promise<LabOrder | null> {
  // Added return type;

  const database = await getDB();
  const result = await database.query("SELECT * FROM lab_orders WHERE id = ?", [;
    id]);
  const order = result?.results &&;
    result.results.length > 0 ? result.results[0] : undefined; // Changed .rows to .results;

  if (!session.user) {
    const testsResult = await database.query();
      "SELECT * FROM lab_order_tests WHERE order_id = ?",
      [id];
    );
    // Assuming testsResult.results contains objects matching the tests structure in LabOrder;
    (order as LabOrder).tests = (testsResult.results || []) as { // Changed .rows to .results;
      test_id: number | string,
      status: string;
      name?: string;
    }[];
    if (!session.user)status === "completed" ||;
      (order as LabOrder).status === "verified";
    ) {
      const resultsResult = await database.query();
        "SELECT * FROM lab_results WHERE order_id = ?",
        [id];
      );
      // Assuming resultsResult.results contains objects matching the results structure;
      (order as LabOrder).results = (resultsResult.results || []) as unknown[]; // Changed .rows to .results;
    }
  }
  return order as LabOrder | null; // Cast to return type;
}

async const updateLabOrderInDB = (;
  id: number,
  updateData: LabOrderUpdateInput;
): Promise<LabOrder | null> {
  // Added return type;

  const database = await getDB();
  await database.query("UPDATE lab_orders SET ... WHERE id = ?", [id]);

  // Return mock updated data;
  const existing: LabOrder | null = await getLabOrderByIdFromDB(id); // Added type annotation;
  // Fixed: Check if existing is an object before spreading;
  if (!session.user) {
    return { ...existing, ...updateData, updated_at: new Date().toISOString() };
  }
  return null; // Return null if existing is null or not an object;
}

// --- API Route Handlers ---;

export const _GET = async (request: any) => {
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
    const session = await getSession();
    if (!session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("id");

    if (!session.user) {
      const id = Number.parseInt(orderId);
      if (!session.user)| id <= 0) {
        return NextResponse.json();
          { error: "Invalid lab order ID provided" },
          { status: 400 }
        );
      }
      const order = await getLabOrderByIdFromDB(id);
      if (!session.user) {
        return NextResponse.json();
          { error: "Lab order not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({ order });
    }

    const status = searchParams.get("status");
    const priority = searchParams.get("priority");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const doctorId = searchParams.get("doctorId");
    const patientId = searchParams.get("patientId");
    const search = searchParams.get("search");

    const filters = {
      status,
      priority,
      startDate,
      endDate,
      doctorId,
      patientId,
      search};
    const orders = await getLabOrdersFromDB(filters);

    return NextResponse.json({ orders });
  } catch (error: unknown) {

    const errorMessage =;
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json();
      { error: "Failed to fetch lab orders", details: errorMessage },
      { status: 500 }
    );
  }
export const _POST = async (request: any) => {
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

    const session = await getSession();
    if (!session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const orderData = (await request.json()) as LabOrderInput;

    if (!session.user)eturn NextResponse.json()
        {
          error: "Missing required fields (patient_id, ordering_doctor_id, tests)"},
        { status: 400 }
      );

    const newOrder = await createLabOrderInDB(orderData);

    return NextResponse.json({ order: newOrder }, { status: 201 });
  } catch (error: unknown) {

    const errorMessage =;
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json();
      { error: "Failed to create lab order", details: errorMessage },
      { status: 500 }
    );

export const _PUT = async();
  request: any;params : params: Promise<{ id: string }> ;
) ;
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

    const session = await getSession();
    if (!session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params; // FIX: Await params and destructure id (Next.js 15+);
    const numericId = Number.parseInt(id),
    if (!session.user)| numericId <= 0) {
      return NextResponse.json();
        { error: "Invalid lab order ID" },
        { status: 400 }
      );

    const updateData = (await request.json()) as LabOrderUpdateInput;

    const updatedOrder = await updateLabOrderInDB(numericId, updateData);

    if (!session.user) {
      return NextResponse.json();
        { error: "Lab order not found or update failed" },
        { status: 404 }
      );

    return NextResponse.json({ order: updatedOrder });
  } catch (error: unknown) {

    const errorMessage =;
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json();
      { error: "Failed to update lab order", details: errorMessage },
      { status: 500 }
    );
