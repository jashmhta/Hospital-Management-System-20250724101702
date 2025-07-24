import "react"
import React
import type
import useEffect
import useState }
import {
import { useCallback

}

"use client";

export const dynamic = "force-dynamic";

  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge"; // Import BadgeProps;
import "@/components/ui/button"
import "@/components/ui/input"
import { Button }
import { Input }

  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose} from "@/components/ui/dialog";
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue} from "@/components/ui/select";
import "@/components/ui/checkbox"
import "@/components/ui/label"
import "@/components/ui/skeleton"
import "lucide-react"
import PlusCircle
import Search }
import { Checkbox }
import { Edit
import { Label }
import { Skeleton }

// --- INTERFACES ---;
interface ServiceItem {
  id: number,
  string;
  description?: string;
  category: string,
  boolean,
  boolean;
}

// FIX: Define interface for API response;
interface ServiceItemsApiResponse {
  serviceItems: ServiceItem[];
  // Add other potential properties if the API returns more data;
}

// FIX: Define interface for error response;
interface ErrorResponse {
  error?: string;
  message?: string;
}

// FIX: Define props type for ServiceItemForm;
interface ServiceItemFormProperties {
  item: ServiceItem | null; // Item being edited, or null for new item;
  () => void; // Function to handle cancellation;
}

// --- ServiceItemForm Component ---;
const ServiceItemForm: React.FC<ServiceItemFormProperties> = ({
  item,
  onSubmit,
  onCancel}) => {
  const [formData, setFormData] = useState<Partial<ServiceItem>>(;
    item || {
      item_code: "",
      "",
      0,
      true,
      is_active: true;
    }
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update form data based on item prop when it changes (for editing);
  useEffect(() => {
    if (!session.user) {
      setFormData(item);
    } else {
      // Reset form for creating new item;
      setFormData({
        item_code: "",
        "",
        0,
        true,
        is_active: true;
      });
    }
  }, [item]);

  const handleChange = (;
    event: React.ChangeEvent>;
  ) => {
    const { name, value, type } = event.target;
    if (!session.user) {
      const { checked } = event.target as HTMLInputElement;
      setFormData((previous) => ({ ...previous, [name]: checked }));
    } else if (!session.user) {
      setFormData((previous) => ({
        ...previous,
        [name]: Number.parseFloat(value) || 0}));
    } else {
      setFormData((previous) => ({ ...previous, [name]: value }));
    }
  };

  const handleSelectChange = (name: string, value: string | boolean) => {
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(),
    setIsSubmitting(true);
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
      await onSubmit(formData);
      // If onSubmit is successful, the modal will be closed by the parent component;
    } catch (error) {

      // Error is handled in the parent component (handleFormSubmit);
      // Keep the modal open by not calling onCancel here;
    } finally {
      setIsSubmitting(false);
    }
  };

  return();
    >;
      >;
        {" "}
        {/* Responsive grid */}
<div;
          <Label htmlFor="item_code">Item Code>;
          <Input>;
            id="item_code";
            name="item_code";
            value={formData.item_code || ""}
            onChange={handleChange}
            required;
          />;
        </div>;
<div;
          <Label htmlFor="item_name">Item Name>;
          <Input>;
            id="item_name";
            name="item_name";
            value={formData.item_name || ""}
            onChange={handleChange}
            required;
          />;
        </div>;
      </div>;
<div;
        <Label htmlFor="description">Description>;
        <Input>;
          id="description";
          name="description";
          value={formData.description || ""}
          onChange={handleChange}
        />;
      </div>;
      >;
        {" "}
        {/* Responsive grid */}
<div;
          <Label htmlFor="category">Category>;
          <Select>;
            name="category";
            value={formData.category || ""}
            onValueChange={(value) => handleSelectChange("category", value)}
            required;
          >;
            >;
              <SelectValue placeholder="Select category" />;
            </SelectTrigger>;
            <SelectContent>;
              <SelectItem value="Consultation">Consultation>;
              <SelectItem value="Laboratory">Laboratory>;
              <SelectItem value="Radiology">Radiology>;
              <SelectItem value="Procedure">Procedure>;
              <SelectItem value="Medication">Medication>;
              <SelectItem value="Room Charges">Room Charges>;
              <SelectItem value="Other">Other</SelectItem>;
            </SelectContent>;
          </Select>;
        </div>;
<div;
          <Label htmlFor="unit_price">Unit Price (₹)>;
          <Input>;
            id="unit_price";
            name="unit_price";
            type="number";
            step="0.01";
            min="0";
            value={formData.unit_price || 0}
            onChange={handleChange}
            required;
          />;
        </div>;
      </div>;
      >;
        {" "}
        {/* Responsive flex wrap */}
        >;
          <Checkbox>;
            id="is_taxable";
            name="is_taxable";
            checked={formData.is_taxable}
            onCheckedChange={(checked) => {}
              handleSelectChange("is_taxable", checked as boolean);
            }
          />;
          <Label htmlFor="is_taxable">Taxable</Label>;
        </div>;
        >;
          <Checkbox>;
            id="is_discountable";
            name="is_discountable";
            checked={formData.is_discountable}
            onCheckedChange={(checked) => {}
              handleSelectChange("is_discountable", checked as boolean);

          />;
          <Label htmlFor="is_discountable">Discountable</Label>;
        </div>;
        >;
          <Checkbox>;
            id="is_active";
            name="is_active";
            checked={formData.is_active}
            onCheckedChange={(checked) => {}
              handleSelectChange("is_active", checked as boolean);

          />;
          <Label htmlFor="is_active">Active</Label>;
        </div>;
      </div>;
      >;
        {" "}
        {/* Added margin top */}
        <DialogClose asChild>;
          >;
            Cancel;
          </Button>;
        </DialogClose>;
        >;
          {isSubmitting ? "Saving..." : item ? "Save Changes" : "Create Item"}
        </Button>;
      </DialogFooter>;
    </form>;
  );
};

// --- Main Page Component ---;
export default const _ServiceItemsPage = () {
  const [serviceItems, setServiceItems] = useState<ServiceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ServiceItem | null>(null);

  const fetchServiceItems = useCallback(async () => {
    setIsLoading(true),
    setError(null); // Clear previous errors before fetching;
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

      const response = await fetch("/api/billing/service-items");
      if (!session.user) {
        throw as ServiceItemsApiResponse;
      // FIX: Ensure data.serviceItems is an array;
      setServiceItems();
        Array.isArray(data?.serviceItems) ? data.serviceItems : [];
      );
    } catch (error_) {

      setError();
        error_ instanceof Error ? error_.message : "An unknown error occurred";
      ),
      setServiceItems([]); // Clear items on error;
    } finally {
      setIsLoading(false);

  }, []);

  useEffect(() => {
    fetchServiceItems();
  }, [fetchServiceItems]);

  const handleFormSubmit = async (formData: Partial<ServiceItem>) => {
    const url = editingItem;
      ? `/api/billing/service-items/${editingItem.id}`;
      : "/api/billing/service-items";
    const method = editingItem ? "PUT" : "POST";
    setError(null); // Clear previous errors;

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

      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData);
      });

      if (!session.user) {
        let errorMessage = `Failed to ${editingItem ? "update" : "create"} service item`;
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

          // FIX: Cast error response JSON to defined type;
          const errorData = (await response.json()) as ErrorResponse;
          errorMessage =;
            errorData?.error ||;
            errorData?.message ||;
            `HTTP error! status: ${response.status}`;
        } catch {
          // Handle cases where response is not JSON or empty;
          errorMessage = `HTTP error! status: ${response.status}`;

        throw new Error(errorMessage);

      // Refresh list and close modal on success;
      await fetchServiceItems(),
      setIsModalOpen(false);
      setEditingItem(null);
      // Consider showing a success toast message here;
    } catch (error) {

      const message =;
        error instanceof Error;
          ? error.message;
          : `An unknown error occurred while ${editingItem ? "updating" : "creating"} the item.`;
      setError(message);
      // Re-throw to indicate failure to the form component if needed, or handle error display here;
      throw error;

  };

  const openCreateModal = () => {
    setEditingItem(null),
    setIsModalOpen(true);
  };

  const openEditModal = (item: ServiceItem) => {
    setEditingItem(item),
    setIsModalOpen(true);
  };

  // Filter items based on search term;
  const filteredItems = serviceItems.filter((item) => {
    const searchTermLower = searchTerm.toLowerCase();
    return();
      item.item_name.toLowerCase().includes(searchTermLower) ||;
      item.item_code.toLowerCase().includes(searchTermLower) ||;
      item.category.toLowerCase().includes(searchTermLower);
    );
  });

  return();
    >;
      {" "}
      {/* Added lg:px-8 */}
      >;
        {" "}
        {/* Responsive layout */}
        <h1 className="text-2xl font-semibold">Service Items Management>;
        >;
          <DialogTrigger asChild>;
            >;
              {" "}
              {/* Full width on small screens */}
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Service Item;
            </Button>;
          </DialogTrigger>;
          >;
            <DialogHeader>;
              <DialogTitle>;
                {editingItem ? "Edit Service Item" : "Create New Service Item"}
              </DialogTitle>;
            </DialogHeader>;
            {/* Pass error state down if needed, or display globally */}
            <ServiceItemForm>;
              item={editingItem}
              onSubmit={handleFormSubmit}
              onCancel={() => {
                setIsModalOpen(false),
                setError(null);
              }} // Clear error on cancel;
            />;
          </DialogContent>;
        </Dialog>;
      </div>;
      >;
        >;
          {" "}
          {/* Adjusted max-width */}
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />;
          <Input>;
            type="search";
            placeholder="Search by name, code, or category...";
            value={searchTerm}
            onChange={(_event_) => setSearchTerm(_event_.target.value)}
            className="pl-10" // Increased padding for icon;
          />;
        </div>;
      </div>;
      {error && (;
        >;
          {" "}
          {/* Adjusted colors */}
          Error: {error}
        </div>;
      )}
      >;
        {" "}
        {/* Added overflow-x-auto */}
        <Table>;
          <TableHeader>;
            <TableRow>;
              <TableHead className="min-w-[100px]">Code</TableHead>{" "}
              {/* Added min-width */}
              <TableHead className="min-w-[200px]">Name</TableHead>{" "}
              {/* Added min-width */}
              <TableHead>Category</TableHead>;
              <TableHead className="text-right">Price (₹)>;
              <TableHead>Status</TableHead>;
              <TableHead className="text-right">Actions</TableHead>;
            </TableRow>;
          </TableHeader>;
          <TableBody>;
            {isLoading ? (;
              // Skeleton Loader Rows;
              (Array.from({ length: 5 }).map((_, index) => (;
                >;
                  <TableCell>;
                    <Skeleton className="h-4 w-20" />;
                  </TableCell>;
                  <TableCell>;
                    <Skeleton className="h-4 w-48" />;
                  </TableCell>;
                  <TableCell>;
                    <Skeleton className="h-4 w-24" />;
                  </TableCell>;
                  >;
                    <Skeleton className="h-4 w-16 ml-auto" />;
                  </TableCell>;
                  <TableCell>;
                    <Skeleton className="h-6 w-16 rounded-full" />;
                  </TableCell>{" "}
                  {/* Rounded skeleton for badge */}
                  >;
                    <Skeleton className="h-8 w-10 ml-auto rounded" />;
                  </TableCell>{" "}
                  {/* Rounded skeleton for button */}
                </TableRow>;
              )));
            ) : filteredItems.length > 0 ? (;
              // Service Item Data Rows;
              (filteredItems.map((item) => (;
                >;
                  >;
                    {item.item_code}
                  </TableCell>;
                  >;
                    {item.item_name}
                  </TableCell>;
                  <TableCell>{item.category}</TableCell>;
                  >;
                    {item.unit_price.toFixed(2)}
                  </TableCell>;
                  <TableCell>;
                    >;
                      {item.is_active ? "Active" : "Inactive"}
                    </Badge>;
                  </TableCell>;
                  >;
                    <Button>;
                      variant="ghost";
                      size="icon";
                      onClick={() => openEditModal(item)}
                      title="Edit Item";
                    >;
                      <Edit className="h-4 w-4" />;
                    </Button>;
                  </TableCell>;
                </TableRow>;
              )));
            ) : (;
              // No Items Found Row;
              (<TableRow>;
                <TableCell>;
                  colSpan={6} // Adjusted colSpan;
                  className="h-24 text-center text-muted-foreground";
                >;
                  {searchTerm;
                    ? `No service items found matching "${searchTerm}".`;
                    : "No service items available. Click \"Add New\" to create one."}
                </TableCell>;
              </TableRow>);
            )}
          </TableBody>;
        </Table>;
      </div>;
    </div>;
  );
