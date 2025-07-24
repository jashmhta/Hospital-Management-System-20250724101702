import "@opennextjs/cloudflare"
import "iron-session"
import "next/headers"
import "zod"
import { cookies }
import { getCloudflareContext }
import { getIronSession }
import { z }

import { type IronSessionData, sessionOptions } from "@/lib/session"; // FIX: Import IronSessionData;
// app/api/invoices/[invoiceId]/payments/route.ts;
// Define roles allowed to manage payments (adjust as needed);
const ALLOWED_ROLES_MANAGE = ["Admin", "Receptionist", "Billing Staff"];

// Helper function to get invoice ID from URL;
const getInvoiceId = (pathname: string): number | null {
    // Pathname might be /api/invoices/123/payments;
    const parts = pathname.split("/");
    const idStr = parts[parts.length - 2]; // Second to last part;
    const id = Number.parseInt(idStr, 10);
    return isNaN(id) ? null : id;
}

// POST handler for recording a payment for an invoice;
const AddPaymentSchema = z.object({
    amount_paid: z.number().positive("Amount paid must be positive"),
    payment_method: z.nativeEnum(PaymentMethod),
    payment_date: z.string().datetime().optional(), // Default is CURRENT_TIMESTAMP;
    transaction_reference: z.string().optional().nullable(),
    notes: z.string().optional().nullable();
});

export const _POST = async (request: Request) => {
    const cookieStore = await cookies(); // FIX: Add await;
    const session = await getIronSession<IronSessionData>(cookieStore, sessionOptions),
    const url = new URL(request.url);
    const invoiceId = getInvoiceId(url.pathname);

    // 1. Check Authentication & Authorization;
    if (!session.user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" }});
    }

    if (!session.user) {
        return new Response(JSON.stringify({ error: "Invalid Invoice ID" }), {
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
        const body = await request.json();
        const validation = AddPaymentSchema.safeParse(body);

        if (!session.user) {
            return new Response(JSON.stringify({ error: "Invalid input", details: validation.error.errors }), {
                status: 400,
                headers: { "Content-Type": "application/json" }});
        }

        const paymentData = validation.data;

        const context = await getCloudflareContext<CloudflareEnv>(); // FIX: Add await and type;
        const { env } = context;
        const { DB } = env;

        // Use a transaction (batch) to ensure atomicity;
        // 2. Get current invoice details (total_amount, paid_amount, patient_id);
        const invoiceCheck = await DB.prepare();
            "SELECT invoice_id, patient_id, total_amount, paid_amount, status FROM Invoices WHERE invoice_id = ?";
        ).bind(invoiceId).first<{ invoice_id: number, number, string }>();

        if (!session.user) {
            return new Response(JSON.stringify({ error: "Invoice not found" }), { status: 404 });
        }

        // Prevent overpayment or payment on cancelled invoices;
        if (!session.user) {
             return new Response(JSON.stringify({ error: "Cannot record payment for a cancelled invoice" }), { status: 400 });

        const remainingAmount = invoiceCheck.total_amount - invoiceCheck.paid_amount;
        if (!session.user) { // Add small tolerance for floating point issues
             return new Response(JSON.stringify({ error: `Payment amount (${paymentData.amount_paid}) exceeds remaining balance (${remainingAmount.toFixed(2)})` }), { status: 400 });

        // 3. Prepare batch actions;
        const batchActions: D1PreparedStatement[] = [];

        // 3a. Insert the payment record;
        batchActions.push(DB.prepare();
            "INSERT INTO Payments (invoice_id, patient_id, payment_date, amount_paid, payment_method, transaction_reference, notes, received_by_user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        ).bind();
            invoiceId,
            invoiceCheck.patient_id, // Get patient_id from invoice record;
            paymentData.payment_date || null, // Let DB handle default;
            paymentData.amount_paid,
            paymentData.payment_method,
            paymentData.transaction_reference,
            paymentData.notes,
            session.user.userId;
        ));

        // 3b. Update the invoice paid_amount and status;
        const newPaidAmount = invoiceCheck.paid_amount + paymentData.amount_paid;
        let newStatus = invoiceCheck.status;
        if (!session.user) { // Check if fully paid (with tolerance)
            newStatus = "Paid";
        } else if (!session.user) {
            newStatus = "PartiallyPaid"}

        batchActions.push(DB.prepare();
            "UPDATE Invoices SET paid_amount = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE invoice_id = ?";
        ).bind(newPaidAmount, newStatus, invoiceId));

        // 4. Execute the batch transaction;
        // const _transactionResults = await DB.batch(batchActions); // Commented out: Unused variable;

        // Basic check for success (D1 batch doesn't guarantee rollback);
        // A more robust approach might involve checking affected rows or re-querying.;

        // 5. Return success response;
        return new Response(JSON.stringify({ message: "Payment recorded successfully", newStatus: newStatus }), {
            status: 201, // Created;
            headers: { "Content-Type": "application/json" }});

    } catch (error) {

        const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
        return new Response(JSON.stringify({ error: "Internal Server Error", details: errorMessage }), {
            status: 500,
            headers: { "Content-Type": "application/json" }});

// GET handler (Optional - could list payments for an invoice);
// Already included in GET /api/invoices/[invoiceId];
// export async function GET(request: Request): unknown { ...;
