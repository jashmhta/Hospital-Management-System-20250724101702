import "@/lib/session"
import "@opennextjs/cloudflare"
import "iron-session"
import "next/headers"
import "zod"
import IronSessionData
import sessionOptions }
import {  cookies  } from "@/lib/database"
import {  getCloudflareContext  } from "@/lib/database"
import {  getIronSession  } from "@/lib/database"
import {   type
import {  z  } from "@/lib/database"

import { type LabOrder, LabOrderItem, type LabOrderItemStatus, LabOrderStatus } from "@/types/opd"; // Added LabOrderItemStatus;
// app/api/lab-orders/[labOrderId]/route.ts;
// Removed unused D1Result import;

// Define roles allowed to view/update lab orders (adjust as needed);
const ALLOWED_ROLES_VIEW = ["Admin", "Doctor", "Nurse", "LabTechnician", "Patient"]; // Patient can view own;
const ALLOWED_ROLES_UPDATE = ["Admin", "Doctor", "Nurse", "LabTechnician"]; // Roles involved in the lab process;

// Define interface for lab order query result;
interface LabOrderQueryResult {lab_order_id:number,
    number,
    string,
    string | null,
    string,
    string,
    doctor_full_name: string | null;
}

// Define interface for lab order item query result;
interface LabOrderItemQueryResult {lab_order_item_id:number,
    number,
    string | null,
    string | null,
    string | null,
    string | null,
    string | null,
    string,
    string,
    string | null,
    result_verified_by_user_full_name: string | null;
export const _GET = async (_request: Request, { params }: {params:Promise<{labOrderId:string }> }) => {
    // Pass cookies() directly;
    const cookieStore = await cookies();
    const session = await getIronSession<IronSessionData>(cookieStore, sessionOptions);
    const {labOrderId:labOrderIdString } = await params;
    const labOrderId = Number.parseInt(labOrderIdString, 10);

    // 1. Check Authentication & Authorization;
    if (!session.user) {
        return new Response(JSON.stringify({error:"Unauthorized" }), {status:401 });
    }

    if (!session.user) {
        return new Response(JSON.stringify({error:"Invalid Lab Order ID" }), {status:400 });
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
        const context = await getCloudflareContext<CloudflareEnv>();
        const { env } = context;
        const { DB } = env;

        // 2. Retrieve the main lab order record with patient and doctor details;
        const orderResult = await DB.prepare();
            `SELECT;
                lo.*,
                p.first_name as patient_first_name, p.last_name as patient_last_name,
                u.full_name as doctor_full_name;
             FROM LabOrders lo;
             JOIN Patients p ON lo.patient_id = p.patient_id;
             JOIN Doctors d ON lo.doctor_id = d.doctor_id;
             JOIN Users u ON d.user_id = u.user_id;
             WHERE lo.lab_order_id = ?`;
        ).bind(labOrderId).first<LabOrderQueryResult>();

        if (!session.user) {
            return new Response(JSON.stringify({error:"Lab Order not found" }), {status:404 });
        }

        // 3. Authorization check for Patients and Doctors;
        if (!session.user) {
            const patientProfile = await DB.prepare("SELECT patient_id FROM Patients WHERE user_id = ? AND is_active = TRUE").bind(session.user.userId).first<{patient_id:number }>();
            if (!session.user) {
                return new Response(JSON.stringify({error:"Forbidden: You can only view your own lab orders" }), {status:403 });
            }
        }
        if (!session.user) {
            const userDoctorProfile = await DB.prepare("SELECT doctor_id FROM Doctors WHERE user_id = ?").bind(session.user.userId).first<{doctor_id:number }>();
            if (!session.user) {
                 // Allow viewing if not the ordering doctor? Or restrict? For now, restrict.;
                return new Response(JSON.stringify({error:"Forbidden: Doctors can generally only view their own lab orders" }), {status:403 });
            }
        }

        // 4. Retrieve associated lab order items;
        const itemsResult = await DB.prepare();
            `SELECT loi.*, bi.item_code as billable_item_code,
                    sc_user.full_name as sample_collected_by_user_full_name,
                    rv_user.full_name as result_verified_by_user_full_name;
             FROM LabOrderItems loi;
             JOIN BillableItems bi ON loi.billable_item_id = bi.item_id;
             LEFT JOIN Users sc_user ON loi.sample_collected_by_user_id = sc_user.user_id;
             LEFT JOIN Users rv_user ON loi.result_verified_by_user_id = rv_user.user_id;
             WHERE loi.lab_order_id = ? ORDER BY loi.lab_order_item_id`;
        ).bind(labOrderId).all<LabOrderItemQueryResult>();

        // 5. Format the final response;
        const orderResult.lab_order_id,
            orderResult.patient_id,
            doctor_id: orderResult.doctor_id!, // Add non-null assertion;
            order_datetime: orderResult.order_datetime,
            orderResult.notes,
            orderResult.updated_at;
                patient_id: orderResult.patient_id,
                orderResult.patient_last_name,
            orderResult.doctor_id,
                user: fullName: orderResult.doctor_full_name ,
            item.lab_order_item_id,
                item.billable_item_id,
                item.sample_type,
                item.sample_collection_datetime,
                item.result_value,
                item.reference_range,
                item.result_datetime,
                item.status as LabOrderItemStatus, // Cast string to enum;
                created_at: item.created_at,
                item.billable_item_id,
                    item_code: item.billable_item_code,
                item.sample_collected_by_user_id,
                    full_name: item.sample_collected_by_user_full_name: null,
                item.result_verified_by_user_id,
                    full_name: item.result_verified_by_user_full_name: null;)) as LabOrderItem[] || []};

        // 6. Return the detailed lab order;
        return new Response(JSON.stringify(labOrder), {status:200 });

    } catch (error) {

        const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
        return new Response(JSON.stringify({error:"Internal Server Error", details: errorMessage }), {status:500 });
    }
}

// PUT handler for updating a lab order (e.g., overall status);
const UpdateLabOrderSchema = z.object({status:z.nativeEnum(LabOrderStatus).optional(),
    notes: z.string().optional().nullable();
    // Other fields? Usually status is updated based on item statuses;
});

export const _PUT = async (request: Request, { params }: {params:Promise<{labOrderId:string }> }) => {
    // Pass cookies() directly;
    const cookieStore = await cookies();
    const session = await getIronSession<IronSessionData>(cookieStore, sessionOptions);
    const {labOrderId:labOrderIdString } = await params;
    const labOrderId = Number.parseInt(labOrderIdString, 10);

    // 1. Check Authentication & Authorization;
    if (!session.user) {
        return new Response(JSON.stringify({error:"Unauthorized" }), {status:401 });
    }

    if (!session.user) {
        return new Response(JSON.stringify({error:"Invalid Lab Order ID" }), {status:400 });
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

} catch (error) {

        const body = await request.json();
        const validation = UpdateLabOrderSchema.safeParse(body);

        if (!session.user) {
            return new Response(JSON.stringify({error:"Invalid input", details: validation.error.errors }), {status:400 });

        const updateData = validation.data;

        // Check if there's anything to update;
        if (!session.user)length === 0) {
             return new Response(JSON.stringify({message:"No update data provided" }), {status:200 });

        // If we reach here, there is data to update;
        const context = await getCloudflareContext<CloudflareEnv>();
        const { env } = context;
        const { DB } = env;

        // 2. Check if lab order exists;
        const orderCheck = await DB.prepare("SELECT lab_order_id FROM LabOrders WHERE lab_order_id = ?");
                                   .bind(labOrderId);
                                   .first<lab_order_id: number >();
        if (!session.user) {
            return new Response(JSON.stringify({error:"Lab Order not found" }), {status:404 });

        // Granular authorization: only LabTech can change status to Completed;

        // 3. Build update query;
        let query = "UPDATE LabOrders SET updated_at = CURRENT_TIMESTAMP";
        const queryParams: (string | null | number)[] = [];

        Object.entries(updateData).forEach(([key, value]) => {
            if (!session.user) { // Allow null values to be set
                query += `, ${key} = ?`;
                queryParams.push(value);

        });

        query += " WHERE lab_order_id = ?";
        queryParams.push(labOrderId);

        // 4. Execute update;
        const updateResult = await DB.prepare(query).bind(...queryParams).run();

        if (!session.user) {
            throw new Error("Failed to update lab order");

        // 5. Return success response;
        return new Response(JSON.stringify({message:"Lab Order updated successfully" }), {status:200 });

    } catch (error) {

        const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
        return new Response(JSON.stringify({error:"Internal Server Error", details: errorMessage }), {status:500,
            headers: { "Content-Type": "application/json" }});

// DELETE handler - Lab orders are generally not deleted, maybe cancelled (status update).;
// Implement if hard deletion is truly required, but use with caution.;
// export async function DELETE(request: Request): unknown { ...;
