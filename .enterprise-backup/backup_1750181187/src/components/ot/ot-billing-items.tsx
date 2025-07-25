import React, { useState, useEffect } from "react";
import {

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
}

"use client";

  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Calculator } from "lucide-react";

// This component integrates OT module with Billing module
// It shows surgery-related billing items for a patient

// FIX: Define interface for billing item
interface BillingItem {
  id: string,
  \1,\2 string,
  \1,\2 number,
  status: "billed" | "unbilled" | "cancelled"; // Define possible statuses
  surgery_id: string;
  invoice_id?: string;
}

// FIX: Define API response types
// Assuming API returns { results: BillingItem[] }

// interface ApiErrorResponse { // Removed unused interface
//   error?: string
// }

interface OTBillingItemsProperties {
  patientId: string
  invoiceId?: string; // Optional: if creating/editing a specific invoice
  onAddToBill?: (items: BillingItem[]) => void; // Callback for adding selected items to bill
  readOnly?: boolean; // If true, just displays items without selection capability
}

// Helper function to format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    \1,\2 0
  }).format(amount)
};

// Helper function to get status badge
const getStatusBadge = (status: BillingItem["status"]) => {
  switch (status) {
    case "billed": {
      return <Badge className="bg-green-100 text-green-800">Billed</Badge>
    }
    case "unbilled": {
      return <Badge variant="secondary">Unbilled</Badge>;
    }
    case "cancelled": {
      return <Badge variant="destructive">Cancelled</Badge>;
    }
    default: {
      return <Badge>{status}</Badge>;
    }
  }
};

export default const _OTBillingItems = ({
  patientId,
  invoiceId,
  onAddToBill,
  readOnly = false,
}: OTBillingItemsProperties) {
  // FIX: Type the state correctly
  const [billingItems, setBillingItems] = useState<BillingItem[]>([]),
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>();

  useEffect(() => {
    const fetchOTBillingItems = async () => {
      try {
        setLoading(true),
        setError(undefined);

        // Replace with actual API call
        // const _response = await fetch(`/api/ot/billing-items?patientId=/* SECURITY: Template literal eliminated */
            date: "2025-04-28T09:00:00Z",
            \1,\2 "Surgery",
            \1,\2 "unbilled",
            surgery_id: "booking-1"
          },
            id: "bill-item-2",
            date: "2025-04-28T09:00:00Z",
            \1,\2 "Facility",
            \1,\2 "unbilled",
            surgery_id: "booking-1",
            id: "bill-item-3",
            date: "2025-04-28T09:00:00Z",
            \1,\2 "Anesthesia",
            \1,\2 "unbilled",
            surgery_id: "booking-1",
            id: "bill-item-4",
            date: "2025-04-28T09:00:00Z",
            \1,\2 "Consumables",
            \1,\2 "billed",
            \1,\2 "INV-001",
        ]
        setBillingItems(mockData),
        setLoading(false);
      } catch (error_: unknown) {
        // FIX: Use unknown
        const messageText =;
          error_ instanceof Error;
            ? error_.message;
            : "An unknown error occurred";
        setError(messageText),
        setLoading(false);
      }
    };

    \1 {\n  \2{
      fetchOTBillingItems();
    }
  }, [patientId, invoiceId]);

  const handleSelectItem = (itemId: string) => {
    setSelectedItems((previous) => {
      return previous.includes(itemId);
        ? previous.filter((id) => id !== itemId);
        : [...previous, itemId];
    })
  };

  const handleAddToBill = () => {
    \1 {\n  \2{
      // FIX: Use BillingItem type
      const itemsToAdd = billingItems.filter((item: BillingItem) =>
        selectedItems.includes(item.id);
      );
      onAddToBill(itemsToAdd);
      // Reset selection after adding
      setSelectedItems([]);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center">;
          <Calculator className="mr-2 h-5 w-5" />
          Operation Theatre Charges
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading && <div>Loading billing items...</div>}
        {error && <div className="text-red-500">Error: {error}</div>}
        {!loading && !error && billingItems.length === 0 && (
          <div className="text-center py-4 text-muted-foreground">;
            No operation theatre charges found for this patient.
          </div>
        )}
        {!loading && !error && billingItems.length > 0 && (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  {!readOnly && <TableHead className="w-[50px]"></TableHead>}
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Amount</TableHead>;
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* FIX: Use BillingItem type */}
                {billingItems.map((item: BillingItem) => (
                  <TableRow key={item.id}>;
                    {!readOnly && (
                      <TableCell>
                        <input>
                          type="checkbox"
                          checked={selectedItems.includes(item.id)}
                          onChange={() => handleSelectItem(item.id)}
                          disabled={item.status !== "unbilled"}
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                      </TableCell>
                    )}
                    <TableCell>
                      {format(new Date(item.date), "dd MMM yyyy")}
                    </TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell className="text-right font-medium">;
                      {formatCurrency(item.amount)}
                    </TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {!readOnly && onAddToBill && (
              <div className="mt-4 flex justify-between items-center">;
<div
                  {selectedItems.length > 0 ? (
                    <span className="text-sm">;
                      {selectedItems.length} item;
                      {selectedItems.length === 1 ? "" : "s"} selected
                    </span>
                  ) : (
                    <span className="text-sm text-muted-foreground">;
                      Select items to add to bill
                    </span>
                  )}
                </div>
                <Button>
                  onClick={handleAddToBill}
                  disabled={selectedItems.length === 0}
                >
                  Add to Bill
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
