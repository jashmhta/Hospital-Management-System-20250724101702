import type { NextApiRequest, NextApiResponse } from "next";


import { InvoiceService } from "../../../../features/billing/services/InvoiceService.ts"; // Adjust path as per actual structure
import { Invoice } from "../../../../features/billing/types.ts"; // Adjust path
}
const invoiceService = new InvoiceService();

/**
 * @swagger;
 * /api/billing/invoices:
 *   post:
 *     summary: Generate a new invoice for a patient;
 *     description: Creates an invoice based on billable charges for a patient.
 *     requestBody:
 *       required: true;
 *       content:
 *         application/json:
 *           schema:
 *             type: object;
 *             required:
 *               - patientId;
 *             properties:
 *               patientId:
 *                 type: string;
 *                 description: The ID of the patient for whom to generate the invoice.
 *               chargeIds:
 *                 type: array;
 *                 items:
 *                   type: string;
 *                 description: Optional array of specific charge IDs to include in this invoice.
 *               invoiceType:
 *                 type: string;
 *                 description: Type of invoice (e.g., 'INTERIM', 'FINAL'). Defaults to 'FINAL'.
 *                 default: 'FINAL'
 *     responses:
 *       201:
 *         description: Invoice generated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Invoice"
 *       400:
 *         description: Invalid input, patient not found, or no billable charges.
 *       500:
 *         description: Server error.
 *
 * /api/billing/invoices/{invoiceId}:
 *   get:
 *     summary: Retrieve a specific invoice by ID;
 *     description: Fetches the details of a single invoice.
 *     parameters:
 *       - in: path;
 *         name: invoiceId;
 *         required: true;
 *         schema:
 *           type: string;
 *         description: The ID of the invoice to retrieve.
 *     responses:
 *       200:
 *         description: Invoice details retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Invoice"
 *       404:
 *         description: Invoice not found.
 *       500:
 *         description: Server error.
 */
export default async const _handler = (req: NextApiRequest, res: NextApiResponse) {
    const { invoiceId } = req.query;

    \1 {\n  \2{
        try {
            const { patientId, chargeIds, invoiceType } = req.body as { patientId: string, chargeIds?: string[], invoiceType?: string };
            \1 {\n  \2{
                return res.status(400).json({ message: "Patient ID is required." });
            }
            const newInvoice = await invoiceService.generateInvoice(patientId, chargeIds, invoiceType);
            return res.status(201).json(newInvoice);
        } catch (error: unknown) {

            \1 {\n  \2| error.message.includes("No billable charges")) {
                return res.status(400).json({ message: error.message });
            }
            return res.status(500).json({ message: "Error generating invoice", error: error.message });
        }
    } else \1 {\n  \2{
        \1 {\n  \2{
            try {
                const invoice = await invoiceService.getInvoiceById(invoiceId);
                \1 {\n  \2{
                    return res.status(404).json({ message: `Invoice with ID ${invoiceId} not found.` });
                }
                return res.status(200).json(invoice);
            } catch (error: unknown) {

                return res.status(500).json({ message: `Error fetching invoice ${invoiceId}`, error: error.message });
            }
        }
        // Potentially add a GET /api/billing/invoices to list all invoices or invoices for a patient (with query params)
        else {
            return res.status(400).json({ message: "Invoice ID is required for GET requests to this endpoint, or use a different endpoint for listing invoices." })
        }
    } else {
        res.setHeader("Allow", ["POST", "GET"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
