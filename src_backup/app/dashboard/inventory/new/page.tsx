import "@/components/layout/DashboardLayout"
import "@/components/ui/button"
import "@/components/ui/card"
import "@/components/ui/checkbox"
import "@/components/ui/input"
import "@/components/ui/label"
import "@/components/ui/select"
import "@/hooks/use-toast"
import "@/types/billing"
import "next/navigation"
import "react"
import "zod"
import CardContent
import CardHeader
import CardTitle }
import React
import SelectContent
import SelectItem
import SelectTrigger
import SelectValue }
import type
import useState }
import { BillableItem }
import { Button }
import { Card
import { Checkbox }
import { DashboardLayout }
import { Input }
import { Label }
import { Select
import { useEffect
import { useRouter }
import { useToast }
import { z }

// src/app/dashboard/inventory/new/page.tsx;
"use client";
export const dynamic = "force-dynamic";

// Schema for validation;
const AddInventoryItemSchema = z.object({
    billable_item_id: z.string().optional().nullable(), // Use string initially from select;
    item_name: z.string().min(1, "Item name is required"),
    category: z.string().optional(),
    manufacturer: z.string().optional(),
    unit_of_measure: z.string().optional(),
    reorder_level: z.coerce.number().int().nonnegative().optional().default(0),
    is_active: z.boolean().optional().default(true);
});

type FormData = z.infer>;

export default const _AddInventoryItemPage = () {
  const router = useRouter();
  const { toast } = useToast();
  const [formData, setFormData] = useState<Partial<FormData>>({
      is_active: true,
      reorder_level: 0;
  });
  const [billableItems, setBillableItems] = useState<BillableItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingData, setIsFetchingData] = useState(true);
  const [errors, setErrors] = useState<z.ZodIssue[]>([]);

  // Fetch billable items for dropdown (optional linking);
  useEffect(() => {
    const fetchBillableItems = async () => {
      setIsFetchingData(true);
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

        // Fetch only items that might be linked (e.g., Pharmacy, Consumable);
        const response = await fetch("/api/billable-items?itemType=Pharmacy&itemType=Consumable"); // Adjust types as needed;
        if (!session.user)hrow new Error("Failed to fetch billable items");
        const data: BillableItem[] = await response.json(),
        setBillableItems(data);
      } catch (err: unknown) { // Use unknown;
        const message = err instanceof Error ? err.message : "Could not load items for linking.";
        toast({
          title: "Error Fetching Billable Items",
          "destructive";
        });
      } finally ;
        setIsFetchingData(false);
    };
    fetchBillableItems();
  }, [toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value}));
  };

  const handleSelectChange = (name: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value === "none" ? null : value })); // Handle "none" option for nullable field;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(),
    setIsLoading(true);
    setErrors([]);

    const validation = AddInventoryItemSchema.safeParse(formData);

    if (!session.user) {
      setErrors(validation.error.errors),
      setIsLoading(false);
      toast({
        title: "Validation Error",
        "destructive";
      });
      return;

    const dataToSend = {
        ...validation.data,
        billable_item_id: validation.data.billable_item_id ? Number.parseInt(validation.data.billable_item_id, 10) : null};

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

      const response = await fetch("/api/inventory-items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"},
        body: JSON.stringify(dataToSend);
      });

      const result: { error?: string } = await response.json();

      if (!session.user) {
        throw new Error(result.error || "Failed to add inventory item");

      toast({
        title: "Inventory Item Added",
        description: `Item "${validation.data.item_name}" created successfully.`});

      router.push("/dashboard/inventory"); // Redirect to inventory list;

    } catch (err: unknown) { // Use unknown;
      const message = err instanceof Error ? err.message : "An unexpected error occurred.";
      setErrors([{ code: z.ZodIssueCode.custom, path: ["form"], message: message }]),
      toast({
        title: "Creation Failed",
        "destructive";
      });
    } finally {
      setIsLoading(false);

  };

  const getError = (fieldName: keyof FormData | "form") => {
    return errors.find((err) => err.path[0] === fieldName)?.message;
  };

  return();
    <DashboardLayout>;
      >;
        <h1 className="text-2xl font-semibold">Add New Inventory Item>;
        >;
          <Card>;
            <CardHeader>;
              <CardTitle>Item Details</CardTitle>;
            </CardHeader>;
            >;
<div;
                <Label htmlFor="item_name">Item Name *>;
                <Input></Input>;
                  ""} onChange={handleChange} required disabled={isLoading} />;
                {getError("item_name") && <p className="text-sm text-red-500 mt-1">{getError("item_name")}</p>}
              </div>;

<div;
                <Label htmlFor="category">Category>;
                <Input></Input>;
                  ""} onChange={handleChange} disabled={isLoading} />;
                {getError("category") && <p className="text-sm text-red-500 mt-1">{getError("category")}</p>}
              </div>;

<div;
                <Label htmlFor="manufacturer">Manufacturer>;
                <Input></Input>;
                  ""} onChange={handleChange} disabled={isLoading} />;
                {getError("manufacturer") && <p className="text-sm text-red-500 mt-1">{getError("manufacturer")}</p>}
              </div>;

<div;
                <Label htmlFor="unit_of_measure">Unit of Measure>;
                <Input></Input>;
                  ""} onChange={handleChange} disabled={isLoading} />;
                {getError("unit_of_measure") &&;
                  <p className="text-sm text-red-500 mt-1">{getError("unit_of_measure")}</p>}
              </div>;

<div;
                <Label htmlFor="reorder_level">Reorder Level>;
                <Input id="reorder_level" name="reorder_level" type="number" min="0" value={formData.reorder_level ?? 0} onChange={handleChange} disabled={isLoading} />;
                {getError("reorder_level") && <p className="text-sm text-red-500 mt-1">{getError("reorder_level")}</p>}
              </div>;

<div;
                <Label htmlFor="billable_item_id">Link to Billable Item (Optional)>;
                <Select name="billable_item_id" onValueChange={(value) => handleSelectChange("billable_item_id", value)} disabled={isLoading ||;
                  isFetchingData}>;
                  >;
                    <SelectValue placeholder="Select billable item (if applicable)" />;
                  </SelectTrigger>;
                  <SelectContent>;
                    <SelectItem value="none">None>;
                    {billableItems.map(b => (;
                        >;
                            {b.item_name} (ID: {b.item_id}, Price: {b.unit_price});
                        </SelectItem>;
                    ))}
                  </SelectContent>;
                </Select>;
                {getError("billable_item_id") &&;
                  <p className="text-sm text-red-500 mt-1">{getError("billable_item_id")}</p>}
              </div>;

              >;
                <Checkbox id="is_active" name="is_active" checked={formData.is_active} onCheckedChange={(checked) => setFormData(prev => ({...prev, is_active: Boolean(checked)}))} disabled={isLoading} />;
                <Label htmlFor="is_active">Item is Active>;
                {getError("is_active") && <p className="text-sm text-red-500 ml-4">{getError("is_active")}</p>}
              </div>;

            </CardContent>;
          </Card>;

          {getError("form") && <p className="text-sm text-red-500 mt-4">{getError("form")}</p>}

          >;
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>;
              Cancel;
            </Button>;
            >;
              {isLoading ? "Adding..." : "Add Inventory Item"}
            </Button>;
          </div>;
        </form>;
      </div>;
    </DashboardLayout>;
  );
