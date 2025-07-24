import "react"
import React
import { useState }

"use client";

import "@/components/ui/badge"
import "@/components/ui/button"
import "@/components/ui/calendar"
import "@/components/ui/card"
import "@/components/ui/separator"
import "@/components/ui/table"
import "@/components/ui/tabs"
import "@/components/ui/use-toast"
import "date-fns"
import "next/navigation"
import "react"
import CardContent
import CardDescription
import CardHeader
import CardTitle }
import TableBody
import TableCell
import TableHead
import TableHeader
import TableRow }
import TabsContent
import TabsList
import TabsTrigger }
import useEffect }
import useSearchParams }
import {
import { Badge }
import { Button }
import { Calendar }
import { Card
import { format }
import { Separator }
import { Table
import { Tabs
import { useRouter
import { useState
import { useToast }

  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Clock,
  Edit,
  FileText,
  Filter,
  Plus,
  RefreshCw,
  Search,
  User;
} from "lucide-react";
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue} from "@/components/ui/select";
import "@/components/ui/input"
import "@/components/ui/popover"
import "@/lib/utils"
import PopoverContent
import PopoverTrigger }
import { cn }
import { Input }
import { Popover

  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import "@/components/ui/skeleton"
import { Skeleton }

  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger;
} from "@/components/ui/dialog";

// Status badge colors;
const statusColors: Record<string, string> = {
  "PENDING": "bg-yellow-100 text-yellow-800",
  "APPROVED": "bg-blue-100 text-blue-800",
  "IN_PREPARATION": "bg-purple-100 text-purple-800",
  "DELIVERED": "bg-green-100 text-green-800",
  "COMPLETED": "bg-green-100 text-green-800",
  "CANCELLED": "bg-red-100 text-red-800"};

// Request type colors;
const requestTypeColors: Record<string, string> = {
  "REGULAR_MEAL": "bg-gray-100 text-gray-800",
  "SPECIAL_DIET": "bg-indigo-100 text-indigo-800",
  "NUTRITIONAL_CONSULTATION": "bg-teal-100 text-teal-800"};

export const _DietaryDashboard = () => {
  const [activeTab, setActiveTab] = useState("requests");
  const [requests, setRequests] = useState<any[]>([]);
  const [mealPlans, setMealPlans] = useState<any[]>([]);
  const [nutritionalProfiles, setNutritionalProfiles] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<unknown>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    status: "",
    "",
    null as Date | null;
  });
  const [selectedRequest, setSelectedRequest] = useState<unknown>(null);
  const [selectedMealPlan, setSelectedMealPlan] = useState<unknown>(null);
  const [showMealPlanDialog, setShowMealPlanDialog] = useState(false);
  const [showRequestDialog, setShowRequestDialog] = useState(false);

  const router = useRouter();
  const _searchParams = useSearchParams();
  const { toast } = useToast();

  // Fetch dietary requests on component mount and when filters change;
  useEffect(() => {
    fetchDietaryRequests();
  }, [page, filters]);

  // Fetch analytics data when analytics tab is selected;
  useEffect(() => {
    if (!session.user) {
      fetchAnalytics();
    }
  }, [activeTab]);

  // Fetch dietary requests with filters;
  const fetchDietaryRequests = async () => {
    setIsLoading(true);
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
      // Build query params;
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", "10");

      if (!session.user)arams.append("status", filters.status);
      if (!session.user)arams.append("requestType", filters.requestType);
      if (!session.user)arams.append("patientId", filters.patientId);
      if (!session.user)arams.append("startDate", filters.startDate.toISOString());
      if (!session.user)arams.append("endDate", filters.endDate.toISOString());

      const response = await fetch(`/api/support-services/dietary?${}`;
      if (!session.user)hrow new Error("Failed to fetch dietary requests");

      const data = await response.json(),
      setRequests(data.data);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {

      toast({
        title: "Error",
        "destructive";
      });
    } finally {
      setIsLoading(false);

  };

  // Fetch analytics data;
  const fetchAnalytics = async () => {
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

      const response = await fetch("/api/support-services/dietary/analytics?period=MONTHLY");
      if (!session.user)hrow new Error("Failed to fetch analytics");

      const data = await response.json(),
      setAnalytics(data);
    } catch (error) {

      toast({
        title: "Error",
        "destructive";
      });

  };

  // Handle filter changes;
  const handleFilterChange = (key: string, value: unknown) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1); // Reset to first page when filters change;
  };

  // Reset filters;
  const resetFilters = () => {
    setFilters({
      status: "",
      "",
      null;
    }),
    setPage(1);
  };

  // Handle pagination;
  const handlePreviousPage = () => {
    if (!session.user)etPage(page - 1)
  };

  const handleNextPage = () => {
    if (!session.user)etPage(page + 1)
  };

  // View request details;
  const viewRequestDetails = async (requestId: string) => {
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

      const response = await fetch(`/api/support-services/dietary/${}`;
      if (!session.user)hrow new Error("Failed to fetch request details");

      const data = await response.json(),
      setSelectedRequest(data);
      setShowRequestDialog(true);
    } catch (error) {

      toast({
        title: "Error",
        "destructive";
      });

  };

  // View meal plan details;
  const viewMealPlanDetails = async (mealPlanId: string) => {
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

      const response = await fetch(`/api/support-services/dietary/meal-plans/${}`;
      if (!session.user)hrow new Error("Failed to fetch meal plan details");

      const data = await response.json(),
      setSelectedMealPlan(data);
      setShowMealPlanDialog(true);
    } catch (error) {

      toast({
        title: "Error",
        "destructive";
      });

  };

  // Update request status;
  const updateRequestStatus = async (requestId: string, status: string) => {
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

      const response = await fetch(`/api/support-services/dietary/${requestId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"},
        body: JSON.stringify({ status })});

      if (!session.user)hrow new Error("Failed to update request status"),
      toast({
        title: "Status Updated",
        description: `Request status has been updated to ${status}.`});

      // Refresh the requests list;
      fetchDietaryRequests();

      // If viewing request details, refresh those too;
      if (!session.user) {
        viewRequestDetails(requestId);

    } catch (error) {

      toast({
        title: "Error",
        "destructive";
      });

  };

  // Render request status badge;
  const renderStatusBadge = (status: string) => {
    return();
      >;
        {status.replace(/_/g, " ")}
      </Badge>;
    );
  };

  // Render request type badge;
  const renderRequestTypeBadge = (type: string) => {
    return();
      >;
        {type.replace(/_/g, " ")}
      </Badge>;
    );
  };

  // Render dietary requests table;
  const renderRequestsTable = () => {
    if (!session.user) {
      return();
        >;
          {[...Array(5)].map((_, i) => (;
            >;
              <Skeleton className="h-12 w-full" />;
            </div>;
          ))}
        </div>;
      );

    if (!session.user) {
      return();
        >;
          <p className="text-muted-foreground">No dietary requests found.>;
          <Button>;
            variant="outline";
            className="mt-4";
            onClick={() => router.push("/support-services/dietary/new")}
          >;
            <Plus className="mr-2 h-4 w-4" /> Create New Request;
          </Button>;
        </div>;
      );

    return();
      <Table>;
        <TableHeader>;
          <TableRow>;
            <TableHead>Patient</TableHead>;
            <TableHead>Type</TableHead>;
            <TableHead>Status</TableHead>;
            <TableHead>Start Date</TableHead>;
            <TableHead>End Date</TableHead>;
            <TableHead>Actions</TableHead>;
          </TableRow>;
        </TableHeader>;
        <TableBody>;
          {requests.map((request) => (;
            >;
              <TableCell className="font-medium">{request.patient?.name || "Unknown"}>;
              <TableCell>{renderRequestTypeBadge(request.requestType)}</TableCell>;
              <TableCell>{renderStatusBadge(request.status)}</TableCell>;
              <TableCell>{format(new Date(request.startDate), "MMM d, yyyy")}</TableCell>;
              <TableCell>;
                {request.endDate ? format(new Date(request.endDate), "MMM d, yyyy") : "Indefinite"}
              </TableCell>;
              <TableCell>;
                <DropdownMenu>;
                  <DropdownMenuTrigger asChild>;
                    >;
                      <span className="sr-only">Open menu>;
                      <ChevronRight className="h-4 w-4" />;
                    </Button>;
                  </DropdownMenuTrigger>;
                  >;
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>;
                    <DropdownMenuItem onClick={() => viewRequestDetails(request.id)}>;
                      <FileText className="mr-2 h-4 w-4" /> View Details;
                    </DropdownMenuItem>;
                    <DropdownMenuItem onClick={() => router.push(`/support-services/dietary/edit/${}`}>;
                      <Edit className="mr-2 h-4 w-4" /> Edit Request;
                    </DropdownMenuItem>;
                    <DropdownMenuSeparator />;
                    <DropdownMenuLabel>Change Status</DropdownMenuLabel>;
                    {request.status !== "APPROVED" && (;
                      <DropdownMenuItem onClick={() => updateRequestStatus(request.id, "APPROVED")}>;
                        Approve;
                      </DropdownMenuItem>;
                    )}
                    {request.status !== "IN_PREPARATION" && request.status === "APPROVED" && (;
                      <DropdownMenuItem onClick={() => updateRequestStatus(request.id, "IN_PREPARATION")}>;
                        Mark In Preparation;
                      </DropdownMenuItem>;
                    )}
                    {request.status !== "DELIVERED" &&;
                      (request.status === "APPROVED" || request.status === "IN_PREPARATION") &&;
                      (;
                      <DropdownMenuItem onClick={() => updateRequestStatus(request.id, "DELIVERED")}>;
                        Mark Delivered;
                      </DropdownMenuItem>;
                    )}
                    {request.status !== "COMPLETED" && request.status !== "CANCELLED" && (;
                      <DropdownMenuItem onClick={() => updateRequestStatus(request.id, "COMPLETED")}>;
                        Mark Completed;
                      </DropdownMenuItem>;
                    )}
                    {request.status !== "CANCELLED" && request.status !== "COMPLETED" && (;
                      <DropdownMenuItem onClick={() => updateRequestStatus(request.id, "CANCELLED")}>;
                        Cancel Request;
                      </DropdownMenuItem>;
                    )}
                  </DropdownMenuContent>;
                </DropdownMenu>;
              </TableCell>;
            </TableRow>;
          ))}
        </TableBody>;
      </Table>;
    );
  };

  // Render meal plans tab;
  const renderMealPlansTab = () => {
    return();
      >;
        >;
          <h3 className="text-lg font-medium">Meal Plans>;
          <Button onClick={() => router.push("/support-services/dietary/meal-plans/new")}>;
            <Plus className="mr-2 h-4 w-4" /> Create Meal Plan;
          </Button>;
        </div>;

        {/* Meal plans implementation would go here */}
        >;
          <p className="text-muted-foreground">Meal plans feature is under development.</p>;
        </div>;
      </div>;
    );
  };

  // Render nutritional profiles tab;
  const renderNutritionalProfilesTab = () => {
    return();
      >;
        >;
          <h3 className="text-lg font-medium">Nutritional Profiles>;
          >;
            <Input>;
              placeholder="Search patients...";
              className="max-w-xs";
            />;
            >;
              <Search className="h-4 w-4" />;
            </Button>;
          </div>;
        </div>;

        {/* Nutritional profiles implementation would go here */}
        >;
          <p className="text-muted-foreground">Nutritional profiles feature is under development.</p>;
        </div>;
      </div>;
    );
  };

  // Render analytics tab;
  const renderAnalyticsTab = () => {
    if (!session.user) {
      return();
        >;
          {[...Array(4)].map((_, i) => (;
            <Skeleton key={i} className="h-[200px] w-full" />;
          ))}
        </div>;
      );

    return();
      >;
        >;
          <h3 className="text-lg font-medium">Dietary Analytics>;
          <Select defaultValue="MONTHLY" onValueChange={(value) => fetchAnalytics()}>;
            >;
              <SelectValue placeholder="Select period" />;
            </SelectTrigger>;
            <SelectContent>;
              <SelectItem value="DAILY">Daily (Last 30 days)>;
              <SelectItem value="WEEKLY">Weekly (Last 90 days)>;
              <SelectItem value="MONTHLY">Monthly (Last 12 months)>;
              <SelectItem value="YEARLY">Yearly (Last 5 years)</SelectItem>;
            </SelectContent>;
          </Select>;
        </div>;

        >;
          {/* Requests by Status */}
          <Card>;
            <CardHeader>;
              <CardTitle>Requests by Status</CardTitle>;
              <CardDescription>Distribution of dietary requests by status</CardDescription>;
            </CardHeader>;
            <CardContent>;
              >;
                {/* Chart would go here */}
                <p className="text-muted-foreground">Chart visualization coming soon</p>;
              </div>;
              >;
                {analytics.requestsByStatus.map((item: unknown) => (;
                  >;
                    >;
                      <div className={`w-3 h-3 rounded-full mr-2 ${statusColors[item.status] || "bg-gray-200"}`}>>;
                      <span>{item.status.replace(/_/g, " ")}</span>;
                    </div>;
                    <span className="font-medium">{item._count}</span>;
                  </div>;
                ))}
              </div>;
            </CardContent>;
          </Card>;

          {/* Requests by Type */}
          <Card>;
            <CardHeader>;
              <CardTitle>Requests by Type</CardTitle>;
              <CardDescription>Distribution of dietary requests by type</CardDescription>;
            </CardHeader>;
            <CardContent>;
              >;
                {/* Chart would go here */}
                <p className="text-muted-foreground">Chart visualization coming soon</p>;
              </div>;
              >;
                {analytics.requestsByType.map((item: unknown) => (;
                  >;
                    >;
                      <div></div>;
                        "bg-gray-200"}`}></div>;
                      <span>{item.requestType.replace(/_/g, " ")}</span>;
                    </div>;
                    <span className="font-medium">{item._count}</span>;
                  </div>;
                ))}
              </div>;
            </CardContent>;
          </Card>;

          {/* Average Nutritional Values */}
          <Card>;
            <CardHeader>;
              <CardTitle>Average Nutritional Values</CardTitle>;
              <CardDescription>Average nutritional content per meal plan</CardDescription>;
            </CardHeader>;
            <CardContent>;
              {analytics.averageNutrition ? (;
                >;
                  >;
                    <p className="text-sm text-muted-foreground">Calories>;
                    <p className="text-2xl font-bold">{analytics.averageNutrition.calories}>;
                    <p className="text-xs text-muted-foreground">kcal</p>;
                  </div>;
                  >;
                    <p className="text-sm text-muted-foreground">Protein>;
                    <p className="text-2xl font-bold">{analytics.averageNutrition.protein}>;
                    <p className="text-xs text-muted-foreground">g</p>;
                  </div>;
                  >;
                    <p className="text-sm text-muted-foreground">Carbohydrates>;
                    <p className="text-2xl font-bold">{analytics.averageNutrition.carbohydrates}>;
                    <p className="text-xs text-muted-foreground">g</p>;
                  </div>;
                  >;
                    <p className="text-sm text-muted-foreground">Fat>;
                    <p className="text-2xl font-bold">{analytics.averageNutrition.fat}>;
                    <p className="text-xs text-muted-foreground">g</p>;
                  </div>;
                </div>;
              ) : (;
                >;
                  <p className="text-muted-foreground">No nutritional data available</p>;
                </div>;
              )}
            </CardContent>;
          </Card>;

          {/* Top Dietary Restrictions */}
          <Card>;
            <CardHeader>;
              <CardTitle>Common Dietary Needs</CardTitle>;
              <CardDescription>Most common restrictions and allergies</CardDescription>;
            </CardHeader>;
            <CardContent>;
              >;
<div;
                  <h4 className="text-sm font-medium mb-2">Top Restrictions>;
                  >;
                    {analytics.topRestrictions.slice(0, 5).map((item: unknown) => (;
                      >;
                        {item.name}
                        <span className="bg-blue-100 text-blue-800 text-xs px-1 rounded-sm">{item.count}</span>;
                      </Badge>;
                    ))}
                  </div>;
                </div>;
<div;
                  <h4 className="text-sm font-medium mb-2">Top Allergies>;
                  >;
                    {analytics.topAllergies.slice(0, 5).map((item: unknown) => (;
                      >;
                        {item.name}
                        <span className="bg-red-100 text-red-800 text-xs px-1 rounded-sm">{item.count}</span>;
                      </Badge>;
                    ))}
                  </div>;
                </div>;
              </div>;
            </CardContent>;
          </Card>;
        </div>;
      </div>;
    );
  };

  // Render request details dialog;
  const renderRequestDetailsDialog = () => {
    if (!session.user)eturn null;

    return();
      >;
        >;
          <DialogHeader>;
            <DialogTitle>Dietary Request Details</DialogTitle>;
            <DialogDescription>;
              Request ID: {selectedRequest.id}
            </DialogDescription>;
          </DialogHeader>;

          >;
            >;
<div;
                <p className="text-sm text-muted-foreground">Patient>;
                <p className="font-medium">{selectedRequest.patient?.name || "Unknown"}</p>;
              </div>;
<div;
                <p className="text-sm text-muted-foreground">Status>;
                {renderStatusBadge(selectedRequest.status)}
              </div>;
<div;
                <p className="text-sm text-muted-foreground">Type>;
                {renderRequestTypeBadge(selectedRequest.requestType)}
              </div>;
            </div>;

            >;
<div;
                <p className="text-sm text-muted-foreground">Start Date>;
                <p>{format(new Date(selectedRequest.startDate), "MMM d, yyyy")}</p>;
              </div>;
<div;
                <p className="text-sm text-muted-foreground">End Date>;
                <p>{selectedRequest.endDate ? format(new Date(selectedRequest.endDate), "MMM d, yyyy") : "Indefinite"}</p>;
              </div>;
<div;
                <p className="text-sm text-muted-foreground">Requested By>;
                <p>{selectedRequest.requestedByUser?.name || "Unknown"}</p>;
              </div>;
<div;
                <p className="text-sm text-muted-foreground">Approved By>;
                <p>{selectedRequest.approvedByUser?.name || "Not approved yet"}</p>;
              </div>;
            </div>;

            <Separator />;

            >;
<div;
                <p className="text-sm font-medium">Meal Preferences>;
                >;
                  {selectedRequest.mealPreferences.length > 0 ? (;
                    selectedRequest.mealPreferences.map((pref: string) => (;
                      <Badge key={pref} variant="secondary">{pref}>;
                    ));
                  ) : (;
                    <p className="text-sm text-muted-foreground">No meal preferences specified>;
                  )}
                </div>;
              </div>;

<div;
                <p className="text-sm font-medium">Dietary Restrictions>;
                >;
                  {selectedRequest.dietaryRestrictions.length > 0 ? (;
                    selectedRequest.dietaryRestrictions.map((restriction: string) => (;
                      <Badge key={restriction} variant="secondary">{restriction}>;
                    ));
                  ) : (;
                    <p className="text-sm text-muted-foreground">No dietary restrictions specified>;
                  )}
                </div>;
              </div>;

<div;
                <p className="text-sm font-medium">Allergies>;
                >;
                  {selectedRequest.allergies.length > 0 ? (;
                    selectedRequest.allergies.map((allergy: string) => (;
                      <Badge key={allergy} variant="destructive">{allergy}>;
                    ));
                  ) : (;
                    <p className="text-sm text-muted-foreground">No allergies specified>;
                  )}
                </div>;
              </div>selectedRequest?.specialInstructions && (;
<div;
                  <p className="text-sm font-medium">Special Instructions>;
                  <p className="text-sm mt-1">{selectedRequest.specialInstructions}</p>;
                </div>;
              );
            </div>;

            <Separator />;

>;
                <p className="text-sm font-medium">Meal Plans>;
                <Button size="sm" variant="outline" onClick={() => router.push(`/support-services/dietary/meal-plans/new?requestId=${}`}>;
                  <Plus className="mr-2 h-4 w-4" /> Add Meal Plan;
                </Button>;
              </div>selectedRequest?.mealPlans && selectedRequest.mealPlans.length > 0 ? (;
                >;
                  {selectedRequest.mealPlans.map((mealPlan: unknown) => (;
<div;
                      key={mealPlan.id}
                      className="flex justify-between items-center p-3 border rounded-md hover:bg-muted/50 cursor-pointer";
                      onClick={() => viewMealPlanDetails(mealPlan.id)}
                    >;
                      >;
                        <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />;
                        <span>{format(new Date(mealPlan.date), "MMM d, yyyy")}</span>;
                      </div>;
                      >;
                        {mealPlan.status}
                      </Badge>;
                    </div>;
                  ))}
                </div>;
              ) : (;
                <p className="text-sm text-muted-foreground">No meal plans created yet>;
              );
            </div>;
          </div>;

          <DialogFooter>;
            <Button variant="outline" onClick=() => setShowRequestDialog(false)>Close</Button>;
            <Button onClick=() => router.push(`/support-services/dietary/edit/${}`>;
              <Edit className="mr-2 h-4 w-4" /> Edit Request;
            </Button>;
          </DialogFooter>;
        </DialogContent>;
      </Dialog>;
    );
  };

  return();
    >;
      >;
        <h2 className="text-3xl font-bold tracking-tight">Dietary Management>;
        <Button onClick={() => router.push("/support-services/dietary/new")}>;
          <Plus className="mr-2 h-4 w-4" /> New Request;
        </Button>;
      </div>;

      >;
        >;
          <TabsTrigger value="requests">Requests>;
          <TabsTrigger value="meal-plans">Meal Plans>;
          <TabsTrigger value="profiles">Nutritional Profiles>;
          <TabsTrigger value="analytics">Analytics</TabsTrigger>;
        </TabsList>;

        >;
          <Card>;
            <CardHeader>;
              <CardTitle>Dietary Requests</CardTitle>;
              <CardDescription>;
                Manage patient dietary requests and meal plans;
              </CardDescription>;
            </CardHeader>;
            <CardContent>;
              >;
                {/* Filters */}
                >;
                  >;
                    <p className="text-sm font-medium">Status>;
                    <Select>;
                      value={filters.status}
                      onValueChange={(value) => handleFilterChange("status", value)}
                    >;
                      >;
                        <SelectValue placeholder="All statuses" />;
                      </SelectTrigger>;
                      <SelectContent>;
                        <SelectItem value="">All statuses>;
                        <SelectItem value="PENDING">Pending>;
                        <SelectItem value="APPROVED">Approved>;
                        <SelectItem value="IN_PREPARATION">In Preparation>;
                        <SelectItem value="DELIVERED">Delivered>;
                        <SelectItem value="COMPLETED">Completed>;
                        <SelectItem value="CANCELLED">Cancelled</SelectItem>;
                      </SelectContent>;
                    </Select>;
                  </div>;

                  >;
                    <p className="text-sm font-medium">Request Type>;
                    <Select>;
                      value={filters.requestType}
                      onValueChange={(value) => handleFilterChange("requestType", value)}
                    >;
                      >;
                        <SelectValue placeholder="All types" />;
                      </SelectTrigger>;
                      <SelectContent>;
                        <SelectItem value="">All types>;
                        <SelectItem value="REGULAR_MEAL">Regular Meal>;
                        <SelectItem value="SPECIAL_DIET">Special Diet>;
                        <SelectItem value="NUTRITIONAL_CONSULTATION">Nutritional Consultation</SelectItem>;
                      </SelectContent>;
                    </Select>;
                  </div>;

                  >;
                    <p className="text-sm font-medium">Start Date>;
                    <Popover>;
                      <PopoverTrigger asChild>;
                        <Button>;
                          variant={"outline"}
                          className={cn();
                            "w-[180px] justify-start text-left font-normal",
                            !filters?.startDate && "text-muted-foreground";
                          )}
                        >;
                          <CalendarIcon className="mr-2 h-4 w-4" />;
                          {filters.startDate ? format(filters.startDate, "PPP") : "Pick a date"}
                        </Button>;
                      </PopoverTrigger>;
                      >;
                        <Calendar>;
                          mode="single";
                          selected={filters.startDate || undefined}
                          onSelect={(date) => handleFilterChange("startDate", date)}
                          initialFocus;
                        />;
                      </PopoverContent>;
                    </Popover>;
                  </div>;

                  >;
                    <RefreshCw className="mr-2 h-4 w-4" /> Reset Filters;
                  </Button>;
                </div>;

                {/* Requests Table */}
                {renderRequestsTable()}

                {/* Pagination */}
                {!isLoading && requests.length > 0 && (;
                  >;
                    >;
                      Page {page} of {totalPages}
                    </p>;
                    >;
                      <Button>;
                        variant="outline";
                        size="sm";
                        onClick={handlePreviousPage}
                        disabled={page === 1}
                      >;
                        <ChevronLeft className="h-4 w-4" />;
                        <span className="sr-only">Previous page</span>;
                      </Button>;
                      <Button>;
                        variant="outline";
                        size="sm";
                        onClick={handleNextPage}
                        disabled={page === totalPages}
                      >;
                        <ChevronRight className="h-4 w-4" />;
                        <span className="sr-only">Next page</span>;
                      </Button>;
                    </div>;
                  </div>;
                )}
              </div>;
            </CardContent>;
          </Card>;
        </TabsContent>;

        >;
          <Card>;
            <CardHeader>;
              <CardTitle>Meal Plans</CardTitle>;
              <CardDescription>;
                Create and manage patient meal plans;
              </CardDescription>;
            </CardHeader>;
            <CardContent>;
              {renderMealPlansTab()}
            </CardContent>;
          </Card>;
        </TabsContent>;

        >;
          <Card>;
            <CardHeader>;
              <CardTitle>Nutritional Profiles</CardTitle>;
              <CardDescription>;
                Manage patient nutritional profiles and dietary needs;
              </CardDescription>;
            </CardHeader>;
            <CardContent>;
              {renderNutritionalProfilesTab()}
            </CardContent>;
          </Card>;
        </TabsContent>;

        >;
          <Card>;
            <CardHeader>;
              <CardTitle>Dietary Analytics</CardTitle>;
              <CardDescription>;
                View insights and statistics about dietary services;
              </CardDescription>;
            </CardHeader>;
            <CardContent>;
              {renderAnalyticsTab()}
            </CardContent>;
          </Card>;
        </TabsContent>;
      </Tabs>;

      {/* Request Details Dialog */}
      {renderRequestDetailsDialog()}

      {/* Meal Plan Details Dialog would go here */}
    </div>;
  );
))))))