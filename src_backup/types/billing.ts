}

// types/billing.ts;

export enum ItemType {
    Service = "Service",
    Procedure = "Procedure",
    Pharmacy = "Pharmacy",
    Consumable = "Consumable",
    EquipmentUsage = "EquipmentUsage",
    Package = "Package",
export = "export" interface = "interface" BillableItem = "BillableItem" {
    item_id: number;
    item_code?: string | null;
    item_name: string;
    description?: string | null;
    item_type: ItemType; // Use enum;
    unit_price: number;
    department?: string | null;
    is_taxable: boolean,
    string,
    updated_at: string;
export enum InvoiceStatus {
    Draft = "Draft",
    Issued = "Issued",
    Paid = "Paid",
    PartiallyPaid = "PartiallyPaid",
    Overdue = "Overdue",
    Cancelled = "Cancelled",
export = "export" interface = "interface" Invoice = "Invoice" ;
    invoice_id: number,
    number;
    appointment_id?: number | null;
    admission_id?: number | null;
    invoice_date: string;
    due_date?: string | null;
    total_amount: number,
    number,
    InvoiceStatus; // Use enum;
    notes?: string | null;
    created_by_user_id?: number | null;
    created_at: string,
    updated_at: string;
    // Optional expanded details;
    patient?: { patient_id: number, string ;
    items?: InvoiceItem[];
    payments?: Payment[];
}
\n\nexport PaymentMethod {
    Cash = "Cash",
    Card = "Card",
    BankTransfer = "BankTransfer",
    Insurance = "Insurance",
    Online = "Online"}
}
}