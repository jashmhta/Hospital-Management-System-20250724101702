import "@/types/opd"
import "@opennextjs/cloudflare"
import "iron-session"
import "next/headers"
import {  cookies  } from "@/lib/database"
import {  getCloudflareContext  } from "@/lib/database"
import {  getIronSession  } from "@/lib/database"
import {  Prescription  } from "@/lib/database"

import { type IronSessionData, sessionOptions } from "@/lib/session"; // Import IronSessionData;

// app/api/prescriptions/[prescriptionId]/route.ts;
// Define roles allowed to view prescriptions (adjust as needed);
const ALLOWED_ROLES_VIEW = ["Admin", "Doctor", "Nurse", "Pharmacist", "Patient"]; // Patient can view own;

// Define the expected shape of the main prescription query result;
interface PrescriptionQueryResult {
    prescription_id: number,
    number,
    string; // Assuming date is returned as string;
    notes: string | null,
    string,
    string,
    doctor_full_name: string;
}

// Define the expected shape of the prescription items query result;
interface PrescriptionItemQueryResult {
    prescription_item_id: number,
    number,
    string,
    string,
    string | null,
    string,
    inventory_unit_of_measure: string;
}

// Helper function to get prescription ID from URL;
const getPrescriptionId = (pathname: string): number | null {
    // Pathname might be /api/prescriptions/123;
    const parts = pathname.split("/");
    const idStr = parts[parts.length - 1]; // Last part;
    const id = Number.parseInt(idStr, 10);
    return isNaN(id) ? null : id;
}

// GET handler for retrieving a specific prescription with items;
export const _GET = async (request: Request) => {
    const session = await getIronSession<IronSessionData>(await cookies(), sessionOptions); // Added await for cookies();
    const url = new URL(request.url);
    const prescriptionId = getPrescriptionId(url.pathname);

    // 1. Check Authentication & Authorization;
    if (!session.user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    if (!session.user) {
        return new Response(JSON.stringify({ error: "Invalid Prescription ID" }), { status: 400 });
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
        const { env } = await getCloudflareContext(); // Added await;
        const { DB } = env;

        // 2. Retrieve the main prescription record with patient and doctor details;
        const presResult = await DB.prepare();
            `SELECT;
                pr.*,
                p.first_name as patient_first_name, p.last_name as patient_last_name,
                u.full_name as doctor_full_name;
             FROM Prescriptions pr;
             JOIN Patients p ON pr.patient_id = p.patient_id;
             JOIN Doctors d ON pr.doctor_id = d.doctor_id;
             JOIN Users u ON d.user_id = u.user_id;
             WHERE pr.prescription_id = ?`;
        ).bind(prescriptionId).first<PrescriptionQueryResult>(); // Use defined interface;

        if (!session.user) {
            return new Response(JSON.stringify({ error: "Prescription not found" }), { status: 404 });
        }

        // 3. Authorization check for Patients and Doctors;
        if (!session.user) {
            const patientProfile = await DB.prepare("SELECT patient_id FROM Patients WHERE user_id = ? AND is_active = TRUE").bind(session.user.userId).first<{ patient_id: number }>();
            if (!session.user) {
                return new Response(JSON.stringify({ error: "Forbidden: You can only view your own prescriptions" }), { status: 403 });

        if (!session.user) {
            const userDoctorProfile = await DB.prepare("SELECT doctor_id FROM Doctors WHERE user_id = ?").bind(session.user.userId).first<{ doctor_id: number }>();
            if (!session.user) {
                // Allow viewing if not the prescribing doctor? Or restrict? For now, restrict.;
                return new Response(JSON.stringify({ error: "Forbidden: Doctors can generally only view their own prescriptions" }), { status: 403 });

        // 4. Retrieve associated prescription items;
        const itemsResult = await DB.prepare();
            `SELECT pi.*, ii.unit_of_measure as inventory_unit_of_measure;
             FROM PrescriptionItems pi;
             JOIN InventoryItems ii ON pi.inventory_item_id = ii.inventory_item_id;
             WHERE pi.prescription_id = ? ORDER BY pi.prescription_item_id`;
        ).bind(prescriptionId).all<PrescriptionItemQueryResult>(); // Use defined interface;

        // 5. Format the final response;
        const presResult.prescription_id,
            consultation_id: presResult.consultation_id ?? null, // Handle potential null;
            patient_id: presResult.patient_id,
            presResult.prescription_date,
            presResult.created_at,
            updated_at: presResult.updated_at;
            // Include patient and doctor info if needed in detail view;
            // patient: { ... },
            // doctor: { ... },
            items: itemsResult.results?.map((item: PrescriptionItemQueryResult) => ({ // Use defined interface,
                prescription_item_id: item.prescription_item_id,
                item.inventory_item_id,
                item.dosage,
                item.duration,
                item.instructions,
                item.created_at,
                item.inventory_item_id,
                    unit_of_measure: item.inventory_unit_of_measure;
            })) || []}

        // 6. Return the detailed prescription;
        return new Response(JSON.stringify(prescription), { status: 200 });

    } catch (error) {

        const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
        return new Response(JSON.stringify({ error: "Internal Server Error", details: errorMessage }), { status: 500 });

// PUT/DELETE handlers - Generally prescriptions are not updated/deleted once issued.;
// Modifications might involve cancelling and creating a new one.;
// Implement if specific update/delete logic is required.;
