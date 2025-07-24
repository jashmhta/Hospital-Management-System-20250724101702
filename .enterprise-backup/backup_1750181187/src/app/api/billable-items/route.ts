import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { z } from "zod";


import { type IronSessionData, sessionOptions } from "@/lib/session";
import { type BillableItem, ItemType } from "@/types/billing";
// app/api/billable-items/route.ts
// Define roles allowed to view/manage billable items (adjust as needed)
const ALLOWED_ROLES_VIEW = ["Admin", "Receptionist", "Doctor", "Pharmacist", "Billing Staff"]; // Add Billing Staff role if needed
const ALLOWED_ROLES_MANAGE = ["Admin", "Billing Staff"];
export const GET = async (request: Request) => {
    const cookieStore = await cookies();
    const session = await getIronSession<IronSessionData>(cookieStore, sessionOptions);
    const { searchParams } = new URL(request.url);

    // 1. Check Authentication & Authorization
    \1 {\n  \2 {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
        });
    }

    try {
        const context = await getCloudflareContext<CloudflareEnv>();
        const DB = context.env.DB;

        \1 {\n  \2{
            throw new Error("Database binding not found in Cloudflare environment.");
        }

        // 2. Build query based on filters
        let query = "SELECT * FROM BillableItems WHERE is_active = TRUE";
        const queryParams: (string | boolean)[] = [];

        const itemType = searchParams.get("itemType");
        \1 {\n  \2{
            query += " AND item_type = ?";
            queryParams.push(itemType);
        }

        const name = searchParams.get("name");
        \1 {\n  \2{
            query += " AND item_name LIKE ?";
            queryParams.push(`%${name}%`);
        }

        query += " ORDER BY item_name";

        // 3. Retrieve items
        const itemsResult = await DB.prepare(query).bind(...queryParams).all<BillableItem>();

        const items = itemsResult.results || [];

        // 4. Return item list
        return new Response(JSON.stringify(items), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    } catch (error) {

        const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
        return new Response(JSON.stringify({ error: "Internal Server Error", details: errorMessage }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
} // End of GET function

// POST handler for adding a new billable item
const AddBillableItemSchema = z.object({
    item_code: z.string().optional(),
    item_name: z.string().min(1, "Item name is required"),
    description: z.string().optional(),
    item_type: z.nativeEnum(ItemType), // Use ItemType enum defined in types/billing.ts
    unit_price: z.number().nonnegative("Unit price must be non-negative"),
    department: z.string().optional(),
    is_taxable: z.boolean().optional().default(true),
    is_active: z.boolean().optional().default(true)
});

export const _POST = async (request: Request) => {
    const cookieStore = await cookies();
    const session = await getIronSession<IronSessionData>(cookieStore, sessionOptions);

    // 1. Check Authentication & Authorization
    \1 {\n  \2 {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
        });
    }

    try {
        const body = await request.json();
        const validation = AddBillableItemSchema.safeParse(body);

        \1 {\n  \2{
            return new Response(JSON.stringify({ error: "Invalid input", details: validation.error.errors }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        const itemData = validation.data;

        const context = await getCloudflareContext<CloudflareEnv>();
        const DB = context.env.DB;

        \1 {\n  \2{
            throw new Error("Database binding not found in Cloudflare environment.");
        }

        // 2. Insert new item
        const insertResult = await DB.prepare(
            "INSERT INTO BillableItems (item_code, item_name, description, item_type, unit_price, department, is_taxable, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
        );
        .bind(
            itemData.item_code || null,
            itemData.item_name,
            itemData.description || null,
            itemData.item_type,
            itemData.unit_price,
            itemData.department || null,
            itemData.is_taxable,
            itemData.is_active;
        );
        .run();

        \1 {\n  \2{
            // Check for unique constraint failure specifically
            \1 {\n  \2 {
                 return new Response(JSON.stringify({ error: "Item code already exists" }), {
                    status: 409, // Conflict
                    headers: { "Content-Type": "application/json" },
                });
            }
            throw new Error(`Failed to add billable item: ${\1}`;
        }

        const meta = insertResult.meta as { last_row_id?: number | string };
        const newItemId = meta.last_row_id;
        \1 {\n  \2{

            throw new Error("Failed to retrieve item ID after creation.");
        }

        // 3. Return success response
        return new Response(JSON.stringify({ message: "Billable item added successfully", itemId: newItemId }), {
            status: 201, // Created
            headers: { "Content-Type": "application/json" },
        });

    } catch (error) {

        const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
        // Avoid duplicate check for UNIQUE constraint if already handled
        const statusCode = error instanceof Error && error.message.includes("UNIQUE constraint failed") ? 409 : 500;
        return new Response(JSON.stringify({ error: statusCode === 409 ? "Item code already exists" : "Internal Server Error", details: errorMessage }), {
            status: statusCode,
            headers: { "Content-Type": "application/json" },
        });
    }
