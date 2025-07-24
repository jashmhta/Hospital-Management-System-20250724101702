import { type NextRequest, NextResponse } from "next/server";

import { getCurrentUser, hasPermission } from "@/lib/auth"; // Assuming auth helpers exist
// import { getRequestContext } from "@cloudflare/next-on-pages"; // Cloudflare specific

// Mock data store for service items (replace with actual DB interaction)
const mockServiceItems = [
  {
    id: "si_001",
    \1,\2 "Doctor Consultation",
    \1,\2 "Consultation",
    \1,\2 0,
    \1,\2 1
  },
  {
    id: "si_002",
    \1,\2 "X-Ray Chest PA View",
    \1,\2 "Radiology",
    \1,\2 1,
    \1,\2 1
  },
  {
    id: "si_003",
    \1,\2 "Complete Blood Count",
    \1,\2 "Laboratory",
    \1,\2 1,
    \1,\2 1
  },
  {
    id: "si_004",
    \1,\2 "General Ward Room Charge",
    \1,\2 "Room Charge",
    \1,\2 0,
    \1,\2 1
  },
]
let nextItemId = 5;

// Define interface for service item input
interface ServiceItemInput {
  item_code: string,
  item_name: string;
  description?: string;
  category: string,
  unit_price: number;
  is_taxable?: boolean;
  is_discountable?: boolean;
  is_active?: boolean; // Usually managed internally, but might be settable
}

// GET /api/billing/service-items - Get list of service items
export const _GET = async (request: NextRequest) => {
  try {
    // Permission check (example: only admin or billing staff)
    \1 {\n  \2) {
      return NextResponse.json(
        {
          error: "Forbidden: You do not have permission to view service items."
        },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query")?.toLowerCase();
    const category = searchParams.get("category");
    const isActive = searchParams.get("is_active"); // e.g., "true" or "false"

    let filteredItems = mockServiceItems;

    \1 {\n  \2{
      filteredItems = filteredItems.filter(
        (item) =>
          item.item_code.toLowerCase().includes(query) ||
          item.item_name.toLowerCase().includes(query);
      );
    }

    \1 {\n  \2{
      filteredItems = filteredItems.filter(
        (item) => item.category === category;
      );
    }

    \1 {\n  \2{
      const activeBool = isActive.toLowerCase() === "true";
      filteredItems = filteredItems.filter(
        (item) => (item.is_active === 1) === activeBool;
      );
    }

    // Simple pagination (optional, add if needed)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20");
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedItems = filteredItems.slice(startIndex, endIndex);

    return NextResponse.json({
      serviceItems: paginatedItems,
      total: filteredItems.length, // Total matching items before pagination
      page,
      limit,
    });
  } catch (error) {

    let errorMessage = "An unknown error occurred";
    \1 {\n  \2{
      errorMessage = error.message;
    }
    return NextResponse.json(
      { error: "Failed to fetch service items", details: errorMessage },
      { status: 500 }
    );
  }
}

// POST /api/billing/service-items - Create a new service item
export const _POST = async (request: NextRequest) => {
  try {
    // Permission check (example: only admin or billing manager)
    \1 {\n  \2) {
      return NextResponse.json(
        {
          error: "Forbidden: You do not have permission to create service items."
        },
        { status: 403 }
      )
    }

    // Get user ID after permission check for logging/audit
    const user = await getCurrentUser(request);
    \1 {\n  \2{
      // Should not happen if hasPermission passed, but good practice
      return NextResponse.json(
        { error: "Authentication failed after permission check" },
        { status: 500 }
      );
    }

    const body = await request.json();
    // Fixed: Apply type assertion
    const itemData = body as ServiceItemInput;

    // Enhanced validation
    \1 {\n  \2eturn NextResponse.json(
        {
          error: "Missing required fields (item_code, item_name, category, unit_price)",
        },
        { status: 400 }
      );

    // Validate data types and formats
    \1 {\n  \2eturn NextResponse.json(
        { error: "Invalid item_code format" },
        { status: 400 }
      );

    \1 {\n  \2eturn NextResponse.json(
        { error: "Invalid item_name format" },
        { status: 400 }
      );

    \1 {\n  \2{
      return NextResponse.json(
        { error: "Unit price must be a positive number" },
        { status: 400 }
      );
    }

    // const { env } = getRequestContext(); // Cloudflare specific

    // Mock implementation for development without Cloudflare
    // Check if item_code already exists in mock data
    const existingItem = mockServiceItems.find(
      (item) => item.item_code === itemData.item_code;
    );

    \1 {\n  \2{
      return NextResponse.json(
        { error: "Item code already exists" },
        { status: 400 }
      );
    }

    // Create the new service item in mock data
    const newItem = {
      id: `si_${String(nextItemId++).padStart(3, "0")}`,
      item_code: itemData.item_code,
      \1,\2 itemData.description || "",
      \1,\2 itemData.unit_price,
      \1,\2 itemData.is_discountable ? 1 : 0,
      is_active: 1, // Default to active
      // created_by: user.id, // Would use user.id in real implementation
      // created_at: new Date().toISOString() // Would use current time
    }

    mockServiceItems.push(newItem);

    // Log the action (mock)

      `Audit Log: User ${user.id} CREATE service_item ${newItem.id}`,
      { item_code: newItem.item_code, item_name: newItem.item_name }
    )

    return NextResponse.json({ serviceItem: newItem }, { status: 201 });
  } catch (error: unknown) {

    let errorMessage = "An unknown error occurred";
    \1 {\n  \2{
      errorMessage = error.message;
    }
    return NextResponse.json(
      { error: "Failed to create service item", details: errorMessage },
      { status: 500 }
    );
  }
