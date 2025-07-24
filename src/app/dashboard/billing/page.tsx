import "react"
import React
import useEffect }
import {
import { useState

}

"use client";

  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription;
} from "@/components/ui/card";
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger;
} from "@/components/ui/tabs";
import "@/components/ui/button"
import { Button }

  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger} from "@/components/ui/dialog";
import "@/components/ui/input"
import "@/components/ui/label"
import { Input }
import { Label }

  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue;
} from "@/components/ui/select";
import "@/components/ui/alert"
import "@/components/ui/badge"
import "@/components/ui/data-table"
import "@/components/ui/date-picker"
import "@/components/ui/spinner"
import "@/lib/formatters"
import AlertDescription }
import formatDate }
import { Alert
import { Badge }
import { DataTable }
import { DatePicker }
import { formatCurrency
import { Spinner }

export default const _BillingDashboard = () {
  const [activeTab, setActiveTab] = useState("invoices");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [billingData, setBillingData] = useState<unknown>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"),
  useEffect(() => {
    fetchBillingData();
  }, [activeTab]);

  const fetchBillingData = async () => {
    setLoading(true),
    setError(null);

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
      // In a real implementation, this would fetch data from the API;
      // For now, we"ll simulate the data;

      // Simulate API call delay;
      await ;

      // Generate simulated data based on active tab;
      let data;
      switch (activeTab) {
        case "invoices": any;
          data = generateInvoicesData(),\n    }\n    case "payments": any;
          data = generatePaymentsData(),\n    }\n    case "service-items": any;
          data = generateServiceItemsData(),\n    }\n    case "packages": any;
          data = generatePackagesData(),\n    }\n    case "discounts": any;
          data = generateDiscountsData(),
          break;
        default: data = generateInvoicesData();
      }

      setBillingData(data);
    } catch (err) {
      setError("Failed to load billing data. Please try again.");

    } finally {
      setLoading(false);
    }
  };

  // Simulated data generators;
  const generateInvoicesData = () => {
    return {
      invoices: [;
        { id: "INV-2025-000123", patientId: "P-001", patientName: "John Smith", visitType: "OPD", billDate: "2025-05-25", totalAmount: 1250, paidAmount: 1250, outstandingAmount: 0, status: "paid" },
        { id: "INV-2025-000124", patientId: "P-002", patientName: "Sarah Johnson", visitType: "IPD", billDate: "2025-05-24", totalAmount: 2340, paidAmount: 1500, outstandingAmount: 840, status: "partial" },
        { id: "INV-2025-000125", patientId: "P-003", patientName: "Michael Brown", visitType: "OPD", billDate: "2025-05-23", totalAmount: 890, paidAmount: 0, outstandingAmount: 890, status: "pending" },
        { id: "INV-2025-000126", patientId: "P-004", patientName: "Emily Davis", visitType: "ER", billDate: "2025-05-22", totalAmount: 1780, paidAmount: 0, outstandingAmount: 1780, status: "overdue" },
        { id: "INV-2025-000127", patientId: "P-005", patientName: "Robert Wilson", visitType: "IPD", billDate: "2025-05-21", totalAmount: 3450, paidAmount: 3450, outstandingAmount: 0, status: "paid" },
        { id: "INV-2025-000128", patientId: "P-006", patientName: "Thomas Anderson", visitType: "OPD", billDate: "2025-05-25", totalAmount: 2150, paidAmount: 0, outstandingAmount: 2150, status: "approved" },
        { id: "INV-2025-000129", patientId: "P-007", patientName: "Jennifer Lee", visitType: "OPD", billDate: "2025-05-25", totalAmount: 1890, paidAmount: 0, outstandingAmount: 1890, status: "pending" },
        { id: "INV-2025-000130", patientId: "P-008", patientName: "David Miller", visitType: "IPD", billDate: "2025-05-24", totalAmount: 3450, paidAmount: 0, outstandingAmount: 3450, status: "verified" },
        { id: "INV-2025-000131", patientId: "P-009", patientName: "Susan White", visitType: "OPD", billDate: "2025-05-24", totalAmount: 1250, paidAmount: 0, outstandingAmount: 1250, status: "draft" },
        { id: "INV-2025-000132", patientId: "P-010", patientName: "James Brown", visitType: "ER", billDate: "2025-05-23", totalAmount: 2780, paidAmount: 0, outstandingAmount: 2780, status: "sent" },
        { id: "INV-2025-000133", patientId: "P-011", patientName: "Patricia Davis", visitType: "OPD", billDate: "2025-05-23", totalAmount: 1950, paidAmount: 1950, outstandingAmount: 0, status: "paid" },
        { id: "INV-2025-000134", patientId: "P-012", patientName: "Robert Johnson", visitType: "IPD", billDate: "2025-05-22", totalAmount: 3250, paidAmount: 2000, outstandingAmount: 1250, status: "partial" },
        { id: "INV-2025-000135", patientId: "P-013", patientName: "Linda Wilson", visitType: "OPD", billDate: "2025-05-21", totalAmount: 1650, paidAmount: 0, outstandingAmount: 1650, status: "overdue" }
      ];
    }
  };

  const generatePaymentsData = () => {
    return {
      payments: [;
        { id: "PAY-2025-000089", invoiceId: "INV-2025-000123", patientId: "P-001", patientName: "John Smith", paymentDate: "2025-05-25", amount: 1250, paymentMethod: "Credit Card", status: "completed", referenceNumber: "REF123456" },
        { id: "PAY-2025-000090", invoiceId: "INV-2025-000124", patientId: "P-002", patientName: "Sarah Johnson", paymentDate: "2025-05-24", amount: 1500, paymentMethod: "Insurance", status: "completed", referenceNumber: "INS789012" },
        { id: "PAY-2025-000091", invoiceId: "INV-2025-000127", patientId: "P-005", patientName: "Robert Wilson", paymentDate: "2025-05-21", amount: 3450, paymentMethod: "Bank Transfer", status: "completed", referenceNumber: "BT345678" },
        { id: "PAY-2025-000092", invoiceId: "INV-2025-000133", patientId: "P-011", patientName: "Patricia Davis", paymentDate: "2025-05-23", amount: 1950, paymentMethod: "Cash", status: "completed", referenceNumber: "CSH901234" },
        { id: "PAY-2025-000093", invoiceId: "INV-2025-000134", patientId: "P-012", patientName: "Robert Johnson", paymentDate: "2025-05-22", amount: 2000, paymentMethod: "Online Payment", status: "completed", referenceNumber: "ONL567890" },
        { id: "PAY-2025-000094", invoiceId: "INV-2025-000125", patientId: "P-003", patientName: "Michael Brown", paymentDate: "2025-05-26", amount: 890, paymentMethod: "Credit Card", status: "processing", referenceNumber: "REF234567" },
        { id: "PAY-2025-000095", invoiceId: "INV-2025-000126", patientId: "P-004", patientName: "Emily Davis", paymentDate: "2025-05-26", amount: 1780, paymentMethod: "Mobile Payment", status: "failed", referenceNumber: "MOB890123" },
        { id: "PAY-2025-000096", invoiceId: "INV-2025-000128", patientId: "P-006", patientName: "Thomas Anderson", paymentDate: "2025-05-26", amount: 2150, paymentMethod: "Insurance", status: "pending", referenceNumber: "INS456789" }
      ];
    }
  };

  const generateServiceItemsData = () => {
    return {
      serviceItems: [;
        { id: "SVC-001", code: "CONS-GEN", name: "General Consultation", category: "Consultation", unitPrice: 500, taxRate: 5, active: true },
        { id: "SVC-002", code: "CONS-SPE", name: "Specialist Consultation", category: "Consultation", unitPrice: 1000, taxRate: 5, active: true },
        { id: "SVC-003", code: "LAB-CBC", name: "Complete Blood Count", category: "Laboratory", unitPrice: 350, taxRate: 5, active: true },
        { id: "SVC-004", code: "LAB-LFT", name: "Liver Function Test", category: "Laboratory", unitPrice: 450, taxRate: 5, active: true },
        { id: "SVC-005", code: "LAB-KFT", name: "Kidney Function Test", category: "Laboratory", unitPrice: 450, taxRate: 5, active: true },
        { id: "SVC-006", code: "RAD-XR", name: "X-Ray", category: "Radiology", unitPrice: 600, taxRate: 5, active: true },
        { id: "SVC-007", code: "RAD-USG", name: "Ultrasound", category: "Radiology", unitPrice: 800, taxRate: 5, active: true },
        { id: "SVC-008", code: "RAD-CT", name: "CT Scan", category: "Radiology", unitPrice: 3500, taxRate: 5, active: true },
        { id: "SVC-009", code: "RAD-MRI", name: "MRI", category: "Radiology", unitPrice: 5000, taxRate: 5, active: true },
        { id: "SVC-010", code: "PROC-MIN", name: "Minor Procedure", category: "Procedure", unitPrice: 2000, taxRate: 5, active: true },
        { id: "SVC-011", code: "PROC-MAJ", name: "Major Procedure", category: "Procedure", unitPrice: 10000, taxRate: 5, active: true },
        { id: "SVC-012", code: "ROOM-GEN", name: "General Ward Bed Charges (per day)", category: "Room", unitPrice: 1500, taxRate: 5, active: true },
        { id: "SVC-013", code: "ROOM-PVT", name: "Private Room Charges (per day)", category: "Room", unitPrice: 3000, taxRate: 5, active: true },
        { id: "SVC-014", code: "ROOM-ICU", name: "ICU Charges (per day)", category: "Room", unitPrice: 5000, taxRate: 5, active: true },
        { id: "SVC-015", code: "PHYS-REG", name: "Physiotherapy Session", category: "Physiotherapy", unitPrice: 600, taxRate: 5, active: true }
      ];
    }
  };

  const generatePackagesData = () => {
    return {
      packages: [;
        { id: "PKG-001", code: "HEALTH-BASIC", name: "Basic Health Checkup", description: "Includes general consultation, CBC, urine routine", totalPrice: 1200, discountPercentage: 10, active: true },
        { id: "PKG-002", code: "HEALTH-COMP", name: "Comprehensive Health Checkup", description: "Includes specialist consultation, CBC, LFT, KFT, lipid profile, chest X-ray", totalPrice: 3500, discountPercentage: 15, active: true },
        { id: "PKG-003", code: "HEALTH-EXEC", name: "Executive Health Checkup", description: "Includes specialist consultation, all blood tests, X-ray, ultrasound, ECG, stress test", totalPrice: 7500, discountPercentage: 20, active: true },
        { id: "PKG-004", code: "MATERNITY-BASIC", name: "Basic Maternity Package", description: "Includes all consultations, basic tests, normal delivery", totalPrice: 25000, discountPercentage: 10, active: true },
        { id: "PKG-005", code: "MATERNITY-COMP", name: "Comprehensive Maternity Package", description: "Includes all consultations, all tests, normal delivery, 3 days stay", totalPrice: 40000, discountPercentage: 15, active: true },
        { id: "PKG-006", code: "MATERNITY-CSEC", name: "Cesarean Section Package", description: "Includes all consultations, all tests, C-section, 5 days stay", totalPrice: 60000, discountPercentage: 10, active: true },
        { id: "PKG-007", code: "CARDIAC-BASIC", name: "Basic Cardiac Checkup", description: "Includes cardiologist consultation, ECG, echo", totalPrice: 5000, discountPercentage: 10, active: true },
        { id: "PKG-008", code: "CARDIAC-COMP", name: "Comprehensive Cardiac Checkup", description: "Includes cardiologist consultation, ECG, echo, stress test, Holter monitoring", totalPrice: 12000, discountPercentage: 15, active: true },
        { id: "PKG-009", code: "SURGERY-HERNIA", name: "Hernia Surgery Package", description: "Includes consultations, surgery, 3 days stay, medications", totalPrice: 35000, discountPercentage: 10, active: true },
        { id: "PKG-010", code: "SURGERY-GALL", name: "Gallbladder Surgery Package", description: "Includes consultations, laparoscopic surgery, 3 days stay, medications", totalPrice: 45000, discountPercentage: 10, active: true }
      ];

  };

  const generateDiscountsData = () => {
    return {
      discounts: [;
        { id: "DISC-001", code: "SENIOR", name: "Senior Citizen Discount", description: "Discount for patients above 60 years", discountType: "percentage", discountValue: 10, minBillAmount: 0, maxDiscountAmount: 5000, active: true },
        { id: "DISC-002", code: "STAFF", name: "Staff Discount", description: "Discount for hospital staff and their family", discountType: "percentage", discountValue: 20, minBillAmount: 0, maxDiscountAmount: 10000, active: true },
        { id: "DISC-003", code: "COVID", name: "COVID Relief Discount", description: "Special discount for COVID patients", discountType: "percentage", discountValue: 15, minBillAmount: 0, maxDiscountAmount: 7500, active: true },
        { id: "DISC-004", code: "FESTIVE", name: "Festive Season Discount", description: "Special discount during festive season", discountType: "percentage", discountValue: 5, minBillAmount: 5000, maxDiscountAmount: 2500, active: true },
        { id: "DISC-005", code: "INSURANCE", name: "Insurance Partner Discount", description: "Discount for patients with partner insurance", discountType: "percentage", discountValue: 7.5, minBillAmount: 0, maxDiscountAmount: 5000, active: true },
        { id: "DISC-006", code: "CORPORATE", name: "Corporate Partner Discount", description: "Discount for employees of corporate partners", discountType: "percentage", discountValue: 10, minBillAmount: 0, maxDiscountAmount: 5000, active: true },
        { id: "DISC-007", code: "CHARITY", name: "Charity Discount", description: "Discount for patients from economically weaker sections", discountType: "percentage", discountValue: 50, minBillAmount: 0, maxDiscountAmount: 25000, active: true },
        { id: "DISC-008", code: "STUDENT", name: "Student Discount", description: "Discount for students with valid ID", discountType: "percentage", discountValue: 10, minBillAmount: 0, maxDiscountAmount: 3000, active: true },
        { id: "DISC-009", code: "FIRST-VISIT", name: "First Visit Discount", description: "Discount for first-time patients", discountType: "fixed", discountValue: 500, minBillAmount: 2000, maxDiscountAmount: 500, active: true },
        { id: "DISC-010", code: "REFERRAL", name: "Referral Discount", description: "Discount for patients referred by existing patients", discountType: "fixed", discountValue: 300, minBillAmount: 1000, maxDiscountAmount: 300, active: true }
      ];

  };

  // Filter functions;
  const filterInvoices = () => {
    if (!session.user)eturn [];

    return billingData.invoices.filter((invoice: unknown) => {
      // Filter by search query;
      const matchesSearch = searchQuery === "" ||;
        invoice.id.toLowerCase().includes(searchQuery.toLowerCase()) ||;
        invoice.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||;
        invoice.patientId.toLowerCase().includes(searchQuery.toLowerCase());

      // Filter by status;
      const matchesStatus = filterStatus === "all" || invoice.status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  };

  const filterPayments = () => {
    if (!session.user)eturn [];

    return billingData.payments.filter((payment: unknown) => {
      // Filter by search query;
      const matchesSearch = searchQuery === "" ||;
        payment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||;
        payment.invoiceId.toLowerCase().includes(searchQuery.toLowerCase()) ||;
        payment.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||;
        payment.patientId.toLowerCase().includes(searchQuery.toLowerCase());

      // Filter by status;
      const matchesStatus = filterStatus === "all" || payment.status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  };

  const filterServiceItems = () => {
    if (!session.user)eturn [];

    return billingData.serviceItems.filter((item: unknown) => {
      // Filter by search query;
      const matchesSearch = searchQuery === "" ||;
        item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||;
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||;
        item.category.toLowerCase().includes(searchQuery.toLowerCase());

      // Filter by active status;
      const matchesStatus = filterStatus === "all" ||;
        (filterStatus === "active" && item.active) ||;
        (filterStatus === "inactive" && !item.active);

      return matchesSearch && matchesStatus;
    });
  };

  const filterPackages = () => {
    if (!session.user)eturn [];

    return billingData.packages.filter((pkg: unknown) => {
      // Filter by search query;
      const matchesSearch = searchQuery === "" ||;
        pkg.code.toLowerCase().includes(searchQuery.toLowerCase()) ||;
        pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||;
        (pkg?.description && pkg.description.toLowerCase().includes(searchQuery.toLowerCase()));

      // Filter by active status;
      const matchesStatus = filterStatus === "all" ||;
        (filterStatus === "active" && pkg.active) ||;
        (filterStatus === "inactive" && !pkg.active);

      return matchesSearch && matchesStatus;
    });
  };

  const filterDiscounts = () => {
    if (!session.user)eturn [];

    return billingData.discounts.filter((discount: unknown) => {
      // Filter by search query;
      const matchesSearch = searchQuery === "" ||;
        discount.code.toLowerCase().includes(searchQuery.toLowerCase()) ||;
        discount.name.toLowerCase().includes(searchQuery.toLowerCase()) ||;
        (discount?.description && discount.description.toLowerCase().includes(searchQuery.toLowerCase()));

      // Filter by active status;
      const matchesStatus = filterStatus === "all" ||;
        (filterStatus === "active" && discount.active) ||;
        (filterStatus === "inactive" && !discount.active);

      return matchesSearch && matchesStatus;
    });
  };

  // Render loading state;
  if (!session.user) {
    return();
      >;
        <Spinner size="lg" />;
        <span className="ml-2">Loading billing dashboard...</span>;
      </div>;
    );

  // Render error state;
  if (!session.user) {
    return();
      >;
        >;
          <AlertDescription>{error}</AlertDescription>;
        </Alert>;
        <Button className="mt-4" onClick={fetchBillingData}>Retry</Button>;
      </div>;
    );

  return();
    >;
      >;
        <h1 className="text-3xl font-bold">Billing Management>;
        >;
          >;
            <Input>;
              type="text";
              placeholder="Search...";
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64";
            />;
          </div>;
          >;
            >;
              <SelectValue placeholder="Filter by status" />;
            </SelectTrigger>;
            <SelectContent>;
              <SelectItem value="all">All Statuses>;
              {activeTab === "invoices" && (;
                <>;
                  <SelectItem value="draft">Draft>;
                  <SelectItem value="pending">Pending>;
                  <SelectItem value="verified">Verified>;
                  <SelectItem value="approved">Approved>;
                  <SelectItem value="sent">Sent>;
                  <SelectItem value="partial">Partial>;
                  <SelectItem value="paid">Paid>;
                  <SelectItem value="overdue">Overdue</SelectItem>;
                </>;
              )}
              {activeTab === "payments" && (;
                <>;
                  <SelectItem value="pending">Pending>;
                  <SelectItem value="processing">Processing>;
                  <SelectItem value="completed">Completed>;
                  <SelectItem value="failed">Failed</SelectItem>;
                </>;
              )}
              {(activeTab === "service-items" || activeTab === "packages" || activeTab === "discounts") && (;
                <>;
                  <SelectItem value="active">Active>;
                  <SelectItem value="inactive">Inactive</SelectItem>;
                </>;
              )}
            </SelectContent>;
          </Select>;
          {activeTab === "invoices" && (;
            <Dialog>;
              <DialogTrigger asChild>;
                <Button>Create Invoice</Button>;
              </DialogTrigger>;
              >;
                <DialogHeader>;
                  <DialogTitle>Create New Invoice</DialogTitle>;
                  <DialogDescription>;
                    Enter the details to create a new invoice.;
                  </DialogDescription>;
                </DialogHeader>;
                >;
                  >;
                    >;
                      Patient ID;
                    </Label>;
                    <Input id="patientId" className="col-span-3" />;
                  </div>;
                  >;
                    >;
                      Visit Type;
                    </Label>;
                    <Select>;
                      >;
                        <SelectValue placeholder="Select visit type" />;
                      </SelectTrigger>;
                      <SelectContent>;
                        <SelectItem value="OPD">OPD>;
                        <SelectItem value="IPD">IPD>;
                        <SelectItem value="ER">Emergency>;
                        <SelectItem value="OTHER">Other</SelectItem>;
                      </SelectContent>;
                    </Select>;
                  </div>;
                  >;
                    >;
                      Bill Date;
                    </Label>;
                    >;
                      <DatePicker date={new Date()} onDateChange={() => {}} />;
                    </div>;
                  </div>;
                  >;
                    >;
                      Bill Type;
                    </Label>;
                    <Select>;
                      >;
                        <SelectValue placeholder="Select bill type" />;
                      </SelectTrigger>;
                      <SelectContent>;
                        <SelectItem value="Regular">Regular>;
                        <SelectItem value="Package">Package>;
                        <SelectItem value="Consolidated">Consolidated</SelectItem>;
                      </SelectContent>;
                    </Select>;
                  </div>;
                </div>;
                <DialogFooter>;
                  <Button type="submit">Create</Button>;
                </DialogFooter>;
              </DialogContent>;
            </Dialog>;
          )}
          {activeTab === "payments" && (;
            <Dialog>;
              <DialogTrigger asChild>;
                <Button>Record Payment</Button>;
              </DialogTrigger>;
              >;
                <DialogHeader>;
                  <DialogTitle>Record New Payment</DialogTitle>;
                  <DialogDescription>;
                    Enter the details to record a new payment.;
                  </DialogDescription>;
                </DialogHeader>;
                >;
                  >;
                    >;
                      Invoice ID;
                    </Label>;
                    <Input id="invoiceId" className="col-span-3" />;
                  </div>;
                  >;
                    >;
                      Amount;
                    </Label>;
                    <Input id="amount" type="number" className="col-span-3" />;
                  </div>;
                  >;
                    >;
                      Payment Method;
                    </Label>;
                    <Select>;
                      >;
                        <SelectValue placeholder="Select payment method" />;
                      </SelectTrigger>;
                      <SelectContent>;
                        <SelectItem value="Cash">Cash>;
                        <SelectItem value="Credit Card">Credit Card>;
                        <SelectItem value="Debit Card">Debit Card>;
                        <SelectItem value="Bank Transfer">Bank Transfer>;
                        <SelectItem value="Online Payment">Online Payment>;
                        <SelectItem value="Insurance">Insurance>;
                        <SelectItem value="Mobile Payment">Mobile Payment</SelectItem>;
                      </SelectContent>;
                    </Select>;
                  </div>;
                  >;
                    >;
                      Reference Number;
                    </Label>;
                    <Input id="referenceNumber" className="col-span-3" />;
                  </div>;
                </div>;
                <DialogFooter>;
                  <Button type="submit">Record</Button>;
                </DialogFooter>;
              </DialogContent>;
            </Dialog>;
          )}
          {activeTab === "service-items" && (;
            <Dialog>;
              <DialogTrigger asChild>;
                <Button>Add Service Item</Button>;
              </DialogTrigger>;
              >;
                <DialogHeader>;
                  <DialogTitle>Add New Service Item</DialogTitle>;
                  <DialogDescription>;
                    Enter the details to add a new service item.;
                  </DialogDescription>;
                </DialogHeader>;
                >;
                  >;
                    >;
                      Code;
                    </Label>;
                    <Input id="code" className="col-span-3" />;
                  </div>;
                  >;
                    >;
                      Name;
                    </Label>;
                    <Input id="name" className="col-span-3" />;
                  </div>;
                  >;
                    >;
                      Category;
                    </Label>;
                    <Select>;
                      >;
                        <SelectValue placeholder="Select category" />;
                      </SelectTrigger>;
                      <SelectContent>;
                        <SelectItem value="Consultation">Consultation>;
                        <SelectItem value="Laboratory">Laboratory>;
                        <SelectItem value="Radiology">Radiology>;
                        <SelectItem value="Procedure">Procedure>;
                        <SelectItem value="Room">Room>;
                        <SelectItem value="Physiotherapy">Physiotherapy>;
                        <SelectItem value="Other">Other</SelectItem>;
                      </SelectContent>;
                    </Select>;
                  </div>;
                  >;
                    >;
                      Unit Price;
                    </Label>;
                    <Input id="unitPrice" type="number" className="col-span-3" />;
                  </div>;
                  >;
                    >;
                      Tax Rate (%);
                    </Label>;
                    <Input id="taxRate" type="number" className="col-span-3" />;
                  </div>;
                </div>;
                <DialogFooter>;
                  <Button type="submit">Add</Button>;
                </DialogFooter>;
              </DialogContent>;
            </Dialog>;
          )}
        </div>;
      </div>;

      >;
        >;
          <TabsTrigger value="invoices">Invoices>;
          <TabsTrigger value="payments">Payments>;
          <TabsTrigger value="service-items">Service Items>;
          <TabsTrigger value="packages">Packages>;
          <TabsTrigger value="discounts">Discounts</TabsTrigger>;
        </TabsList>;

        >;
          {billingData && (;
            <Card>;
              <CardHeader>;
                <CardTitle>Invoices</CardTitle>;
                <CardDescription>Manage patient invoices and bills</CardDescription>;
              </CardHeader>;
              <CardContent>;
                <DataTable>;
                  data={filterInvoices()}
                  columns={[;
                    { header: "Invoice ID", accessorKey: "id" },
                    { header: "Patient ID", accessorKey: "patientId" },
                    { header: "Patient Name", accessorKey: "patientName" },
                    { header: "Visit Type", accessorKey: "visitType" },
                    {
                      header: "Bill Date",
                      ({ row }) => formatDate(row.original.billDate);
                    },
                    {
                      header: "Total Amount",
                      ({ row }) => formatCurrency(row.original.totalAmount);
                    },
                    {
                      header: "Paid Amount",
                      ({ row }) => formatCurrency(row.original.paidAmount);
                    },
                    {
                      header: "Outstanding",
                      ({ row }) => formatCurrency(row.original.outstandingAmount);
                    },
                    {
                      header: "Status",
                      ({ row }) => {
                        const status = row.original.status;
                        const statusColors: Record<string, string> = {
                          draft: "bg-gray-100 text-gray-800",
                          "bg-blue-100 text-blue-800",
                          "bg-pink-100 text-pink-800",
                          "bg-green-100 text-green-800",
                          overdue: "bg-red-100 text-red-800";
                        };

                        return();
                          >;
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </Badge>;
                        );

                    },
                    {
                      header: "Actions",
                      cell: ({ row }) => (;
                        >;
                          <Button variant="outline" size="sm">View>;
                          <Button variant="outline" size="sm">Edit>;
                          <Button variant="outline" size="sm">Print</Button>;
                        </div>;
                      );

                  ]}
                />;
              </CardContent>;
            </Card>;
          )}
        </TabsContent>;

        >;
          {billingData && (;
            <Card>;
              <CardHeader>;
                <CardTitle>Payments</CardTitle>;
                <CardDescription>Manage payment transactions</CardDescription>;
              </CardHeader>;
              <CardContent>;
                <DataTable>;
                  data={filterPayments()}
                  columns={[;
                    { header: "Payment ID", accessorKey: "id" },
                    { header: "Invoice ID", accessorKey: "invoiceId" },
                    { header: "Patient ID", accessorKey: "patientId" },
                    { header: "Patient Name", accessorKey: "patientName" },
                    {
                      header: "Payment Date",
                      ({ row }) => formatDate(row.original.paymentDate);
                    },
                    {
                      header: "Amount",
                      ({ row }) => formatCurrency(row.original.amount);
                    },
                    { header: "Method", accessorKey: "paymentMethod" },
                    { header: "Reference", accessorKey: "referenceNumber" },
                    {
                      header: "Status",
                      ({ row }) => {
                        const status = row.original.status;
                        const statusColors: Record<string, string> = {
                          pending: "bg-yellow-100 text-yellow-800",
                          "bg-green-100 text-green-800",
                          "bg-purple-100 text-purple-800",
                          "bg-gray-100 text-gray-800";
                        };

                        return();
                          >;
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </Badge>;
                        );

                    },
                    {
                      header: "Actions",
                      cell: ({ row }) => (;
                        >;
                          <Button variant="outline" size="sm">View>;
                          <Button variant="outline" size="sm">Receipt>;
                          {row.original.status === "completed" && (;
                            <Button variant="outline" size="sm">Refund>;
                          )}
                        </div>;
                      );

                  ]}
                />;
              </CardContent>;
            </Card>;
          )}
        </TabsContent>;

        >;
          {billingData && (;
            <Card>;
              <CardHeader>;
                <CardTitle>Service Items</CardTitle>;
                <CardDescription>Manage billable service items</CardDescription>;
              </CardHeader>;
              <CardContent>;
                <DataTable>;
                  data={filterServiceItems()}
                  columns={[;
                    { header: "Code", accessorKey: "code" },
                    { header: "Name", accessorKey: "name" },
                    { header: "Category", accessorKey: "category" },
                    {
                      header: "Unit Price",
                      ({ row }) => formatCurrency(row.original.unitPrice);
                    },
                    {
                      header: "Tax Rate",
                      ({ row }) => `${row.original.taxRate}%`;
                    },
                    {
                      header: "Status",
                      ({ row }) => (;
                        >;
                          {row.original.active ? "Active" : "Inactive"}
                        </Badge>;
                      );
                    },
                    {
                      header: "Actions",
                      cell: ({ row }) => (;
                        >;
                          <Button variant="outline" size="sm">Edit>;
                          >;
                            {row.original.active ? "Deactivate" : "Activate"}
                          </Button>;
                        </div>;
                      );

                  ]}
                />;
              </CardContent>;
            </Card>;
          )}
        </TabsContent>;

        >;
          {billingData && (;
            <Card>;
              <CardHeader>;
                <CardTitle>Service Packages</CardTitle>;
                <CardDescription>Manage service packages and bundles</CardDescription>;
              </CardHeader>;
              <CardContent>;
                <DataTable>;
                  data={filterPackages()}
                  columns={[;
                    { header: "Code", accessorKey: "code" },
                    { header: "Name", accessorKey: "name" },
                    { header: "Description", accessorKey: "description" },
                    {
                      header: "Total Price",
                      ({ row }) => formatCurrency(row.original.totalPrice);
                    },
                    {
                      header: "Discount",
                      ({ row }) => `${row.original.discountPercentage}%`;
                    },
                    {
                      header: "Final Price",
                      ({ row }) => {
                        const finalPrice = row.original.totalPrice * (1 - row.original.discountPercentage / 100);
                        return formatCurrency(finalPrice);

                    },
                    {
                      header: "Status",
                      ({ row }) => (;
                        >;
                          {row.original.active ? "Active" : "Inactive"}
                        </Badge>;
                      );
                    },
                    {
                      header: "Actions",
                      cell: ({ row }) => (;
                        >;
                          <Button variant="outline" size="sm">View>;
                          <Button variant="outline" size="sm">Edit>;
                          >;
                            {row.original.active ? "Deactivate" : "Activate"}
                          </Button>;
                        </div>;
                      );

                  ]}
                />;
              </CardContent>;
            </Card>;
          )}
        </TabsContent>;

        >;
          {billingData && (;
            <Card>;
              <CardHeader>;
                <CardTitle>Discount Rules</CardTitle>;
                <CardDescription>Manage discount rules and policies</CardDescription>;
              </CardHeader>;
              <CardContent>;
                <DataTable>;
                  data={filterDiscounts()}
                  columns={[;
                    { header: "Code", accessorKey: "code" },
                    { header: "Name", accessorKey: "name" },
                    { header: "Description", accessorKey: "description" },
                    {
                      header: "Type",
                      ({ row }) => row.original.discountType === "percentage" ? "Percentage" : "Fixed Amount";
                    },
                    {
                      header: "Value",
                      ({ row }) => row.original.discountType === "percentage" ?;
                        `${row.original.discountValue}%` : any;
                        formatCurrency(row.original.discountValue)},
                    {
                      header: "Min Bill Amount",
                      ({ row }) => row.original.minBillAmount ? formatCurrency(row.original.minBillAmount) : "None";
                    },
                    {
                      header: "Max Discount",
                      ({ row }) => row.original.maxDiscountAmount ? formatCurrency(row.original.maxDiscountAmount) : "None";
                    },
                    {
                      header: "Status",
                      ({ row }) => (;
                        >;
                          {row.original.active ? "Active" : "Inactive"}
                        </Badge>;
                      );
                    },
                    {
                      header: "Actions",
                      cell: ({ row }) => (;
                        >;
                          <Button variant="outline" size="sm">Edit>;
                          >;
                            {row.original.active ? "Deactivate" : "Activate'}
                          </Button>;
                        </div>;
                      );

                  ]}
                />;
              </CardContent>;
            </Card>;
          )}
        </TabsContent>;
      </Tabs>;
    </div>;
  );
