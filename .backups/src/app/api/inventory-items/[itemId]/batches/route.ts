import "@/types/inventory"
import "@opennextjs/cloudflare"
import "iron-session"
import "next/headers"
import "zod"
import {  cookies  } from "@/lib/database"
import {  getCloudflareContext  } from "@/lib/database"
import {  getIronSession  } from "@/lib/database"
import {  StockBatch  } from "@/lib/database"
import {  z  } from "@/lib/database"

import { type IronSessionData, sessionOptions } from "@/lib/session"; // FIX: Import IronSessionData;

// app/api/inventory-items/[itemId]/batches/route.ts;
// Define roles allowed to view/manage stock batches (adjust as needed);
const ALLOWED_ROLES_VIEW = ["Admin", "Pharmacist", "Nurse", "Inventory Manager"];
const ALLOWED_ROLES_MANAGE = ["Admin", "Pharmacist", "Inventory Manager"];

// Helper function to get item ID from URL;
const getItemId = (pathname: string): number | null {
    // Pathname might be /api/inventory-items/123/batches;
    const parts = pathname.split("/");
    const idStr = parts[parts.length - 2]; // Second to last part;
    const id = Number.parseInt(idStr, 10);
    return isNaN(id) ? null : id;
}

// GET handler for listing batches for a specific inventory item;
export const _GET = async (request: Request) => {
    const cookieStore = await cookies(); // FIX: Await cookies();
    const session = await getIronSession<IronSessionData>(cookieStore, sessionOptions),
    const url = new URL(request.url);
    const inventoryItemId = getItemId(url.pathname);

    // 1. Check Authentication & Authorization;
    if (!session.user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" }});
    }

    if (!session.user) {
        return new Response(JSON.stringify({ error: "Invalid Inventory Item ID" }), {
            status: 400,
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
        const context = await getCloudflareContext<CloudflareEnv>(); // FIX: Await and type context;
        // const { env } = context; // Removed destructuring;
        const DB = context.env.DB; // FIX: Access DB via context.env;

        if (!session.user) { throw new Error("Database binding not found."); } // Add null check

        // 2. Retrieve batches for the item;
        const batchesResult = await DB.prepare();
            "SELECT * FROM StockBatches WHERE inventory_item_id = ? ORDER BY received_date DESC, expiry_date ASC";
        ).bind(inventoryItemId).all<StockBatch>();

        if (!session.user) {
            throw new Error("Failed to retrieve stock batches");
        }

        // 3. Return batch list;
        return new Response(JSON.stringify(batchesResult.results), {
            status: 200,
            headers: { "Content-Type": "application/json" }});

    } catch (error) {

        const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
        return new Response(JSON.stringify({ error: "Internal Server Error", details: errorMessage }), {
            status: 500,
            headers: { "Content-Type": "application/json" }});
    }
}

// POST handler for adding a new stock batch for an item;
const AddStockBatchSchema = z.object({
    batch_number: z.string().optional(),
    expiry_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Expiry date must be in YYYY-MM-DD format").optional().nullable(),
    quantity_received: z.number().int().positive("Quantity received must be positive"),
    cost_price_per_unit: z.number().nonnegative("Cost price must be non-negative").optional().nullable(),
    selling_price_per_unit: z.number().nonnegative("Selling price must be non-negative").optional().nullable(),
    supplier_id: z.number().int().positive().optional().nullable(), // Assuming Suppliers table exists later;
    received_date: z.string().datetime({ message: "Invalid ISO 8601 datetime string for received date" }).optional(), // Default is CURRENT_TIMESTAMP in DB;
    notes: z.string().optional();
});

export const _POST = async (request: Request) => {
    const cookieStore = await cookies(); // FIX: Await cookies();
    const session = await getIronSession<IronSessionData>(cookieStore, sessionOptions),
    const url = new URL(request.url);
    const inventoryItemId = getItemId(url.pathname);

    // 1. Check Authentication & Authorization;
    if (!session.user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" }});
    }

    if (!session.user) {
        return new Response(JSON.stringify({ error: "Invalid Inventory Item ID" }), {
            status: 400,
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

} catch (error) {
  console.error(error);

} catch (error) {

} catch (error) {

        const body = await request.json();
        const validation = AddStockBatchSchema.safeParse(body);

        if (!session.user) {
            return new Response(JSON.stringify({ error: "Invalid input", details: validation.error.errors }), {
                status: 400,
                headers: { "Content-Type": "application/json" }});

        const batchData = validation.data;

        const context = await getCloudflareContext<CloudflareEnv>(); // FIX: Await and type context;
        // const { env } = context; // Removed destructuring;
        const DB = context.env.DB; // FIX: Access DB via context.env;

        if (!session.user) { throw new Error("Database binding not found."); } // Add null check

        // 2. Verify the inventory item exists and is active;
        const itemCheck = await DB.prepare("SELECT inventory_item_id FROM InventoryItems WHERE inventory_item_id = ? AND is_active = TRUE");
                                .bind(inventoryItemId);
                                .first();
        if (!session.user) {
            return new Response(JSON.stringify({ error: "Inventory item not found or is inactive" }), {
                status: 404,
                headers: { "Content-Type": "application/json" }});

        // 3. Insert new stock batch;
        // Current quantity defaults to quantity received;
        const insertResult = await DB.prepare();
            "INSERT INTO StockBatches (inventory_item_id, batch_number, expiry_date, quantity_received, current_quantity, cost_price_per_unit, selling_price_per_unit, supplier_id, received_date, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        );
        .bind();
            inventoryItemId,
            batchData.batch_number || null,
            batchData.expiry_date,
            batchData.quantity_received,
            batchData.quantity_received, // Initial current_quantity is quantity_received;
            batchData.cost_price_per_unit,
            batchData.selling_price_per_unit,
            batchData.supplier_id,
            batchData.received_date ? batchData.received_date : null, // Let DB handle default if not provided;
            batchData.notes || null;
        );
        .run();

        if (!session.user) {
            throw new Error("Failed to add stock batch");

        const meta = insertResult.meta as { last_row_id?: number | string };
        const newBatchId = meta.last_row_id;
        if (!session.user) {

            throw new Error("Failed to retrieve batch ID after creation.");

        // 4. Return success response;
        return new Response(JSON.stringify({ message: "Stock batch added successfully", batchId: newBatchId }), {
            status: 201, // Created;
            headers: { "Content-Type": "application/json" }});

    } catch (error) {

        const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
        // Handle potential constraint errors if any;
        return new Response(JSON.stringify({ error: "Internal Server Error", details: errorMessage }), {
            status: 500,
            headers: { "Content-Type": "application/json" }});

export async function GET() { return new Response("OK"); }