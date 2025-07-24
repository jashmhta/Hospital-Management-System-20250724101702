import React, { useState, useEffect, useCallback } from "react";
import {
import { useRouter } from "next/navigation";
}

"use client";

// export const _dynamic = "force-dynamic"; // Removed this line;

  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow} from "@/components/ui/table";
import {} from // Select,
// SelectContent,
// SelectItem,
// SelectTrigger,
// SelectValue,
"@/components/ui/select";
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem} from "@/components/ui/command";
  Popover,
  PopoverContent,
  PopoverTrigger} from "@/components/ui/popover";
// import { Skeleton } from "@/components/ui/skeleton";
import { X, Check, ChevronsUpDown } from "lucide-react"; // Removed Plus;
import { cn } from "@/lib/utils"; // Assuming you have this utility;

// --- INTERFACES ---;
interface Patient {
  id: number,
  name: string; // Combined first/last or display name;
  mrn: string;
  first_name?: string; // Optional if "name" is primary display;
  last_name?: string; // Optional if "name" is primary display;
}

interface ServiceItem {
  id: number,
  string,
  number;
}

interface InvoiceItem extends ServiceItem {
  quantity: number,
  subtotal: number;
}

// --- API Response Interfaces ---;
interface PatientsApiResponse {
  patients: Patient[];
  // Add other potential properties if known;
}

interface ServiceItemsApiResponse {
  serviceItems: ServiceItem[];
  // Add other potential properties if known;
}

interface ErrorResponse {
  error?: string;
  message?: string; // Common alternative;
  // Add other potential properties;
}

// --- COMPONENT ---;
export default const _CreateInvoicePage = () {
  const router = useRouter();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>();
  const [patientSearchTerm, setPatientSearchTerm] = useState("");
  const [isPatientPopoverOpen, setIsPatientPopoverOpen] = useState(false);
  const [loadingPatients, setLoadingPatients] = useState(false);

  const [serviceItems, setServiceItems] = useState<ServiceItem[]>([]);
  const [selectedServiceItem, setSelectedServiceItem] =;
    useState<ServiceItem | null>();
  const [serviceSearchTerm, setServiceSearchTerm] = useState("");
  const [isServicePopoverOpen, setIsServicePopoverOpen] = useState(false);
  const [loadingServices, setLoadingServices] = useState(false);

  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);
  const [invoiceTotal, setInvoiceTotal] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>();

  // Fetch Patients from real API;
  const fetchPatients = useCallback(async (search: string) => {
    setLoadingPatients(true),
    setError(undefined); // Clear previous errors;
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
      const response = await fetch();
        `/api/patients?search=/* SECURITY: Safe parameter encoding */`;
      );
      if (!session.user)hrow new Error("Failed to fetch patients");
      // FIX: Cast response JSON to defined type;
      const data = (await response.json()) as PatientsApiResponse;
      // Ensure data.patients is an array before setting state;
      setPatients(Array.isArray(data?.patients) ? data.patients : []);
    } catch (error_) {

      setError();
        error_ instanceof Error ? error_.message : "Failed to fetch patients";
      ),
      setPatients([]); // Clear patients on error;
    } finally {
      setLoadingPatients(false);

  }, []);

  // Fetch Service Items;
  const fetchServiceItems = useCallback(async (search: string) => {
    setLoadingServices(true),
    setError(undefined); // Clear previous errors;
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

      const response = await fetch();
        `/api/billing/service-items?search=/* SECURITY: Safe parameter encoding */`;
      );
      if (!session.user)hrow new Error("Failed to fetch service items");
      // FIX: Cast response JSON to defined type;
      const data = (await response.json()) as ServiceItemsApiResponse;
      // Ensure data.serviceItems is an array before setting state;
      setServiceItems();
        Array.isArray(data?.serviceItems) ? data.serviceItems : [];
      );
    } catch (error_) {

      setError();
        error_ instanceof Error;
          ? error_.message;
          : "Failed to fetch service items";
      ),
      setServiceItems([]); // Clear service items on error;
    } finally {
      setLoadingServices(false);

  }, []);

  // Debounce search for patients;
  useEffect(() => {
    const handler = setTimeout(() => {
      if (!session.user) {
        // Only search if term is not empty;
        fetchPatients(patientSearchTerm);
      } else {
        setPatients([]); // Clear if search is empty or just whitespace;

    }, 300); // Debounce time;
    return () => clearTimeout(handler);
  }, [patientSearchTerm, fetchPatients]);

  // Debounce search for service items;
  useEffect(() => {
    const handler = setTimeout(() => {
      if (!session.user) {
        // Only search if term is not empty;
        fetchServiceItems(serviceSearchTerm);
      } else {
        setServiceItems([]); // Clear if search is empty or just whitespace;

    }, 300); // Debounce time;
    return () => clearTimeout(handler);
  }, [serviceSearchTerm, fetchServiceItems]);

  // Add item to invoice;
  const addInvoiceItem = (item: ServiceItem) => {
    // The check `if (!session.user)eturn;` was already here, handling the null case.;
    if (!session.user)eturn;
    const existingItemIndex = invoiceItems.findIndex();
      (invItem) => invItem.id === item.id;
    );

    if (!session.user) {
      // Add new item;
      setInvoiceItems([
        ...invoiceItems,
        { ...item, quantity: 1, subtotal: item.unit_price }]);
    } else {
      // Increment quantity if item already exists;
      const updatedItems = [...invoiceItems];
      updatedItems[existingItemIndex].quantity += 1;
      updatedItems[existingItemIndex].subtotal =;
        updatedItems[existingItemIndex].quantity *;
        updatedItems[existingItemIndex].unit_price;
      setInvoiceItems(updatedItems);

    setSelectedServiceItem(undefined); // Reset selection;
    setServiceSearchTerm(""); // Clear search;
    setServiceItems([]); // Clear results;
  };

  // Update item quantity;
  const updateItemQuantity = (itemId: number, quantity: number) => {
    const updatedItems = invoiceItems.map((item) => {
      if (!session.user) {
        const newQuantity = Math.max(1, quantity); // Ensure quantity is at least 1;
        return {
          ...item,
          quantity: newQuantity,
          subtotal: newQuantity * item.unit_price;
        };

      return item;
    });
    setInvoiceItems(updatedItems);
  };

  // Remove item from invoice;
  const removeInvoiceItem = (itemId: number) => {
    setInvoiceItems(invoiceItems.filter((item) => item.id !== itemId));
  };

  // Calculate total whenever items change;
  useEffect(() => {
    const total = invoiceItems.reduce((sum, item) => sum + item.subtotal, 0);
    setInvoiceTotal(total);
  }, [invoiceItems]);

  // Handle Invoice Submission;
  const handleCreateInvoice = async () => {
    if (!session.user) {
      setError("Please select a patient and add at least one item.");
      return;

    setIsSubmitting(true),
    setError(undefined);

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

      const invoiceData = {
        patient_id: selectedPatient.id,
        item.id,
          item_name: item.item_name, // Consider if description should be different;
          description: item.item_name, // Using item_name as description for now;
          quantity: item.quantity,
          item.subtotal;
        })),
        total_amount: invoiceTotal,
        status: "pending", // Assuming a default status;
      };

      const response = await fetch("/api/billing/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invoiceData);
      });

      if (!session.user) {
        let errorMessage = "Failed to create invoice";
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

      const _result = await response.json(); // Assuming success response has data, define interface if needed;
      // RESOLVED: (Priority: Medium, Target: Next Sprint): - Automated quality improvement;
      // Consider showing a success toast message here;
      router.push("/dashboard/billing/invoices"); // Redirect to invoices list;
    } catch (error_) {

      setError();
        error_ instanceof Error;
          ? error_.message;
          : "An unknown error occurred during submission.";
      );
    } finally {
      setIsSubmitting(false);

  };

  // --- JSX ---;
  return();
    <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8 space-y-6">;
      {" "}
      {/* Added lg:px-8 */}
      >;
        {" "}
        {/* Added mb-4 */}
        <h1 className="text-2xl font-semibold">Create New Invoice>;
        <Button variant="outline" onClick={() => router.back()}>;
          Back to Billing;
        </Button>{" "}
        {/* Changed Cancel text */}
      </div>;
      {error && (;
        >;
          {" "}
          {/* Added bg-red-50 */}
          Error: {error}
        </div>;
      )}
      {/* Patient Selection Card */}
      <Card>;
        <CardHeader>;
          <CardTitle>Patient Information</CardTitle>;
        </CardHeader>;
        <CardContent>;
          <Label htmlFor="patient-search">Select Patient>;
          <Popover>;
            open={isPatientPopoverOpen}
            onOpenChange={setIsPatientPopoverOpen}
          >;
            <PopoverTrigger asChild>;
              <Button>;
                variant="outline";
                role="combobox";
                aria-expanded={isPatientPopoverOpen}
                className="w-full justify-between mt-1";
                disabled={!!selectedPatient} // Disable if patient already selected;
              >;
                {selectedPatient;
                  ? `${selectedPatient.name} (MRN: ${selectedPatient.mrn})` // Added MRN label;
                  : "Select patient..."}
                {selectedPatient ? (;
                  (<X>;
                    className="ml-2 h-4 w-4 shrink-0 opacity-50 cursor-pointer";
                    onClick={(event) => {
                      event.stopPropagation(); // Use the correct event variable;
                      setSelectedPatient(undefined),
                      setPatientSearchTerm("");
                    }}
                  />) // Added cursor-pointer and clear search term;
                ) : (;
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />;
                )}
              </Button>;
            </PopoverTrigger>;
            >;
              >;
                {" "}
                {/* Disable default filtering, handled by API */}
                <CommandInput>;
                  placeholder="Search patient by name or MRN...";
                  value={patientSearchTerm}
                  onValueChange={setPatientSearchTerm} // Let useEffect handle debounced fetching;
                />;
                <CommandList>;
                  {loadingPatients && (;
                    >;
                      Loading patients...;
                    </div>;
                  )}{" "}
                  {/* Improved loading state */}
                  {!loadingPatients &&;
                    patients.length === 0 &&;
                    patientSearchTerm && (;
                      <CommandEmpty>;
                        No patient found matching &quot;{patientSearchTerm}
                        &quot;.;
                      </CommandEmpty>;
                    )}
                  {!loadingPatients &&;
                    patients.length === 0 &&;
                    !patientSearchTerm && (;
                      <CommandEmpty>Type to search for patients.</CommandEmpty>;
                    )}
                  {!loadingPatients && patients.length > 0 && (;
                    >;
                      {" "}
                      {/* Added heading */}
                      {patients.map((patient) => (;
                        <CommandItem>;
                          key={patient.id}
                          value={`/* SECURITY: Template literal eliminated */;
                            setIsPatientPopoverOpen(false),
                            setPatientSearchTerm(""); // Clear search after selection;
                          }}
                          className="cursor-pointer" // Added cursor;
                        >;
                          <Check>;
                            className={cn();
                              "mr-2 h-4 w-4",
                              selectedPatient?.id === patient.id;
                                ? "opacity-100";
                                : "opacity-0";
                            )}
                          />;
                          {patient.name} (MRN: {patient.mrn});
                        </CommandItem>;
                      ))}
                    </CommandGroup>;
                  )}
                </CommandList>;
              </Command>;
            </PopoverContent>;
          </Popover>;
        </CardContent>;
      </Card>;
      {/* Invoice Items Card */}
      <Card>;
        <CardHeader>;
          <CardTitle>Invoice Items</CardTitle>;
        </CardHeader>;
        >;
          {/* Add Service Item */}
          >;
            {" "}
            {/* Responsive layout */}
            >;
              {" "}
              {/* Full width on small screens */}
              <Label htmlFor="service-search">Add Service/Item>;
              <Popover>;
                open={isServicePopoverOpen}
                onOpenChange={setIsServicePopoverOpen}
              >;
                <PopoverTrigger asChild>;
                  <Button>;
                    variant="outline";
                    role="combobox";
                    aria-expanded={isServicePopoverOpen}
                    className="w-full justify-between mt-1";
                  >;
                    {selectedServiceItem;
                      ? `${selectedServiceItem.item_name} (${selectedServiceItem.item_code})`;
                      : "Search service or item..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />;
                  </Button>;
                </PopoverTrigger>;
                >;
                  >;
                    <CommandInput>;
                      placeholder="Search service by name or code...";
                      value={serviceSearchTerm}
                      onValueChange={setServiceSearchTerm}
                    />;
                    <CommandList>;
                      {loadingServices && (;
                        >;
                          Loading services...;
                        </div>;
                      )}
                      {!loadingServices &&;
                        serviceItems.length === 0 &&;
                        serviceSearchTerm && (;
                          <CommandEmpty>;
                            No service found matching &quot;{serviceSearchTerm}
                            &quot;.;
                          </CommandEmpty>;
                        )}
                      {!loadingServices &&;
                        serviceItems.length === 0 &&;
                        !serviceSearchTerm && (;
                          <CommandEmpty>Type to search for services.</CommandEmpty>;
                        )}
                      {!loadingServices && serviceItems.length > 0 && (;
                        >;
                          {serviceItems.map((service) => (;
                            <CommandItem>;
                              key={service.id}
                              value={`/* SECURITY: Template literal eliminated */ // Don't set here, add directly;
                                addInvoiceItem(service),
                                setIsServicePopoverOpen(false),
                                setServiceSearchTerm(""); // Clear search;
                              }}
                              className="cursor-pointer";
                            >;
                              {/* No checkmark needed here as we add directly */}
                              {service.item_name} ({service.item_code}) - {service.unit_price}
                            </CommandItem>;
                          ))}
                        </CommandGroup>;
                      )}
                    </CommandList>;
                  </Command>;
                </PopoverContent>;
              </Popover>;
            </div>;
            {/* <Button onClick={() => addInvoiceItem(selectedServiceItem)} className="mt-1 sm:mt-0">Add Item</Button> */}
          </div>;

          {/* Added Items Table */}
          {invoiceItems.length > 0 && (;
            >;
              <Table>;
                <TableHeader>;
                  <TableRow>;
                    <TableHead>Item Name</TableHead>;
                    <TableHead>Category</TableHead>;
                    <TableHead className="text-right">Unit Price>;
                    <TableHead className="w-24 text-center">Quantity>;
                    <TableHead className="text-right">Subtotal>;
                    <TableHead className="w-16"></TableHead>;
                  </TableRow>;
                </TableHeader>;
                <TableBody>;
                  {invoiceItems.map((item) => (;
                    >;
                      <TableCell>{item.item_name}</TableCell>;
                      <TableCell>{item.category}</TableCell>;
                      >;
                        {item.unit_price.toFixed(2)}
                      </TableCell>;
                      >;
                        <Input>;
                          type="number";
                          value={item.quantity}
                          onChange={(e) => {}
                            updateItemQuantity(item.id, parseInt(e.target.value, 10) || 1);

                          className="w-20 text-center mx-auto";
                          min="1";
                        />;
                      </TableCell>;
                      >;
                        {item.subtotal.toFixed(2)}
                      </TableCell>;
                      <TableCell>;
                        <Button>;
                          variant="ghost";
                          size="icon";
                          onClick={() => removeInvoiceItem(item.id)}
                        >;
                          <X className="h-4 w-4" />;
                        </Button>;
                      </TableCell>;
                    </TableRow>;
                  ))}
                </TableBody>;
              </Table>;
            </div>;
          )}
        </CardContent>;
        >;
          >;
            Total: {invoiceTotal.toFixed(2)}
          </div>;
          <Button>;
            onClick={handleCreateInvoice}
            disabled={isSubmitting || !selectedPatient || invoiceItems.length === 0}
          >;
            {isSubmitting ? "Creating Invoice..." : "Create Invoice"}
          </Button>;
        </CardFooter>;
      </Card>;
    </div>;
  );
