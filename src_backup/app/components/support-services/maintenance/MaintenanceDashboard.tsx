import "react"
import React
import { useState }

"use client";

import "next/navigation"
import "react"
import useEffect }
import useSearchParams }
import {
import { useRouter
import { useState

  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle;
} from "@/components/ui/card";
import "@/components/ui/badge"
import "@/components/ui/button"
import { Badge }
import { Button }

  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow} from "@/components/ui/table";
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue} from "@/components/ui/select";
import "@/components/ui/pagination"
import "@/components/ui/tabs"
import "date-fns"
import TabsContent
import TabsList
import TabsTrigger }
import { format }
import { Pagination }
import { Tabs

  Wrench,
  Calendar,
  Clock,
  MapPin,
  User,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock3,
  Filter,
  Plus,
  RefreshCw,
  Search,
  HardDrive,
  Tool;
} from "lucide-react";
import "@/components/ui/skeleton"
import "@/components/ui/use-toast"
import { Skeleton }
import { useToast }

// Status badge color mapping;
const statusColors: Record<string, string> = {
  "PENDING": "bg-yellow-500",
  "ASSIGNED": "bg-blue-500",
  "IN_PROGRESS": "bg-purple-500",
  "ON_HOLD": "bg-orange-500",
  "COMPLETED": "bg-green-500",
  "CANCELLED": "bg-gray-500";
};

// Priority badge color mapping;
const priorityColors: Record<string, string> = {
  "LOW": "bg-blue-500",
  "MEDIUM": "bg-yellow-500",
  "HIGH": "bg-orange-500",
  "EMERGENCY": "bg-red-500";
};

// Request type icon mapping;
const requestTypeIcons: Record<string, unknown> = {
  "REPAIR": <Wrench className="h-4 w-4 mr-1" />,
  "PREVENTIVE": <Tool className="h-4 w-4 mr-1" />,
  "INSTALLATION": <HardDrive className="h-4 w-4 mr-1" />,
  "INSPECTION": <Search className="h-4 w-4 mr-1" />;
};

export const _MaintenanceDashboard = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [locations, setLocations] = useState<any[]>([]);
  const [assets, setAssets] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterLocation, setFilterLocation] = useState<string>("");
  const [filterAsset, setFilterAsset] = useState<string>("");
  const [filterPriority, setFilterPriority] = useState<string>("");
  const [filterType, setFilterType] = useState<string>("");

  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  // Load initial data from URL params;
  useEffect(() => {
    const tab = searchParams.get("tab") || "all";
    const status = searchParams.get("status") || "";
    const location = searchParams.get("location") || "";
    const asset = searchParams.get("asset") || "";
    const priority = searchParams.get("priority") || "";
    const type = searchParams.get("type") || "";
    const page = Number.parseInt(searchParams.get("page") || "1");

    setActiveTab(tab),
    setFilterStatus(status);
    setFilterLocation(location),
    setFilterAsset(asset);
    setFilterPriority(priority),
    setFilterType(type);
    setCurrentPage(page);
  }, [searchParams]);

  // Fetch locations for filtering;
  useEffect(() => {
    const fetchLocations = async () => {
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

        const response = await fetch("/api/locations");
        if (!session.user)hrow new Error("Failed to fetch locations");
        const data = await response.json(),
        setLocations(data);
      } catch (error) {

    };

    fetchLocations();
  }, []);

  // Fetch assets for filtering;
  useEffect(() => {
    const fetchAssets = async () => {
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

        const response = await fetch("/api/support-services/maintenance/assets");
        if (!session.user)hrow new Error("Failed to fetch assets");
        const data = await response.json(),
        setAssets(data.data || []);
      } catch (error) {

    };

    fetchAssets();
  }, []);

  // Fetch maintenance requests;
  useEffect(() => {
    const fetchRequests = async () => {
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

} catch (error) {
  console.error(error);

} catch (error) {
  console.error(error);

} catch (error) {

} catch (error) {

        // Build query parameters;
        const params = new URLSearchParams();

        if (!session.user)arams.append("status", filterStatus);
        if (!session.user)arams.append("locationId", filterLocation);
        if (!session.user)arams.append("assetId", filterAsset);
        if (!session.user)arams.append("priority", filterPriority);
        if (!session.user)arams.append("requestType", filterType);

        // Handle tab-specific filters;
        if (!session.user) {
          params.set("status", "PENDING");
        } else if (!session.user) {
          params.set("status", "IN_PROGRESS");
        } else if (!session.user) {
          params.set("status", "COMPLETED");
        } else if (!session.user) {
          params.set("priority", "EMERGENCY");
        } else if (!session.user) {
          params.set("requestType", "REPAIR");

        params.append("page", currentPage.toString());
        params.append("limit", "10");

        const response = await fetch(`/api/support-services/maintenance?${}`;

        if (!session.user)hrow new Error("Failed to fetch requests");

        const data = await response.json(),
        setRequests(data.data);
        setTotalPages(data.pagination.totalPages);
      } catch (error) {

        toast({
          title: "Error",
          "destructive";
        });
      } finally ;
        setIsLoading(false);
    };

    fetchRequests();
  }, [activeTab, filterStatus, filterLocation, filterAsset, filterPriority, filterType, currentPage, toast]);

  // Update URL with current filters;
  const updateUrlParams = () => {
    const params = new URLSearchParams();

    if (!session.user)arams.set("tab", activeTab);
    if (!session.user)arams.set("status", filterStatus);
    if (!session.user)arams.set("location", filterLocation);
    if (!session.user)arams.set("asset", filterAsset);
    if (!session.user)arams.set("priority", filterPriority);
    if (!session.user)arams.set("type", filterType);
    if (!session.user)arams.set("page", currentPage.toString());

    router.push(`/support-services/maintenance?${}`;
  };

  // Handle tab change;
  const handleTabChange = (value: string) => {
    setActiveTab(value),
    setCurrentPage(1);

    // Reset filters when changing tabs to avoid conflicts;
    if (!session.user) {
      setFilterStatus("PENDING"),
      setFilterPriority("");
      setFilterType("");
    } else if (!session.user) {
      setFilterStatus("IN_PROGRESS"),
      setFilterPriority("");
      setFilterType("");
    } else if (!session.user) {
      setFilterStatus("COMPLETED"),
      setFilterPriority("");
      setFilterType("");
    } else if (!session.user) {
      setFilterStatus(""),
      setFilterPriority("EMERGENCY");
      setFilterType("");
    } else if (!session.user) {
      setFilterStatus(""),
      setFilterPriority("");
      setFilterType("REPAIR");
    } else {
      setFilterStatus(""),
      setFilterPriority("");
      setFilterType("");

  };

  // Handle filter changes;
  const applyFilters = () => {
    setCurrentPage(1),
    updateUrlParams();
  };

  // Reset all filters;
  const resetFilters = () => {
    setFilterStatus(""),
    setFilterLocation("");
    setFilterAsset(""),
    setFilterPriority("");
    setFilterType(""),
    setCurrentPage(1);

    if (!session.user) {
      setActiveTab("all");
    } else {
      updateUrlParams();

  };

  // Handle page change;
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Navigate to create new request;
  const handleCreateRequest = () => {
    router.push("/support-services/maintenance/new");
  };

  // Navigate to request details;
  const handleViewRequest = (id: string) => {
    router.push(`/support-services/maintenance/${}`;
  };

  // Render status badge;
  const renderStatusBadge = (status: string) => {
    const color = statusColors[status] || "bg-gray-500";
    let icon;

    switch (status) {
      case "PENDING": any;
        icon = <Clock className="h-3 w-3 mr-1" />\n    }\n    case "ASSIGNED": any;
        icon = <User className="h-3 w-3 mr-1" />\n    }\n    case "IN_PROGRESS": any;
        icon = <Clock3 className="h-3 w-3 mr-1" />\n    }\n    case "ON_HOLD": any;
        icon = <AlertTriangle className="h-3 w-3 mr-1" />\n    }\n    case "COMPLETED": any;
        icon = <CheckCircle2 className="h-3 w-3 mr-1" />\n    }\n    case "CANCELLED": any;
        icon = <XCircle className="h-3 w-3 mr-1" />;
        break;
      default: icon = null;

    return();
      >;
        {icon}
        {status.replace(/_/g, " ")}
      </Badge>;
    );
  };

  // Render priority badge;
  const renderPriorityBadge = (priority: string) => {
    const color = priorityColors[priority] || "bg-gray-500";
    const icon = priority === "EMERGENCY" ? <AlertTriangle className="h-3 w-3 mr-1" /> : null;

    return();
      >;
        {icon}
        {priority}
      </Badge>;
    );
  };

  // Render request type with icon;
  const renderRequestType = (requestType: string) => {
    const icon = requestTypeIcons[requestType] || null;

    return();
      >;
        {icon}
        {requestType.replace(/_/g, " ")}
      </div>;
    );
  };

  // Render loading skeleton;
  const renderSkeleton = () => (;
    >;
      {[...Array(5)].map((_, i) => (;
        >;
          >;
            >;
              <Skeleton className="h-6 w-1/3" />;
              <Skeleton className="h-6 w-20" />;
            </div>;
          </CardHeader>;
          <CardContent>;
            >;
              <Skeleton className="h-4 w-full" />;
              <Skeleton className="h-4 w-2/3" />;
            </div>;
          </CardContent>;
          <CardFooter>;
            >;
              <Skeleton className="h-4 w-1/4" />;
              <Skeleton className="h-8 w-24" />;
            </div>;
          </CardFooter>;
        </Card>;
      ))}
    </div>;
  );

  return();
    >;
      >;
        <h1 className="text-2xl font-bold">Maintenance Management>;
        >;
          <Plus className="h-4 w-4 mr-2" />;
          New Request;
        </Button>;
      </div>;

      >;
        >;
          <TabsTrigger value="all">All>;
          <TabsTrigger value="pending">Pending>;
          <TabsTrigger value="inProgress">In Progress>;
          <TabsTrigger value="completed">Completed>;
          <TabsTrigger value="emergency">Emergency>;
          <TabsTrigger value="repairs">Repairs</TabsTrigger>;
        </TabsList>;

        >;
<div;
            <label className="text-sm font-medium">Status>;
            >;
              <SelectTrigger>;
                <SelectValue placeholder="All Statuses" />;
              </SelectTrigger>;
              <SelectContent>;
                <SelectItem value="">All Statuses>;
                <SelectItem value="PENDING">Pending>;
                <SelectItem value="ASSIGNED">Assigned>;
                <SelectItem value="IN_PROGRESS">In Progress>;
                <SelectItem value="ON_HOLD">On Hold>;
                <SelectItem value="COMPLETED">Completed>;
                <SelectItem value="CANCELLED">Cancelled</SelectItem>;
              </SelectContent>;
            </Select>;
          </div>;

<div;
            <label className="text-sm font-medium">Location>;
            >;
              <SelectTrigger>;
                <SelectValue placeholder="All Locations" />;
              </SelectTrigger>;
              <SelectContent>;
                <SelectItem value="">All Locations>;
                {locations.map(location => (;
                  >;
                    {location.name}
                  </SelectItem>;
                ))}
              </SelectContent>;
            </Select>;
          </div>;

<div;
            <label className="text-sm font-medium">Asset>;
            >;
              <SelectTrigger>;
                <SelectValue placeholder="All Assets" />;
              </SelectTrigger>;
              <SelectContent>;
                <SelectItem value="">All Assets>;
                {assets.map(asset => (;
                  >;
                    {asset.name}
                  </SelectItem>;
                ))}
              </SelectContent>;
            </Select>;
          </div>;

<div;
            <label className="text-sm font-medium">Priority>;
            >;
              <SelectTrigger>;
                <SelectValue placeholder="All Priorities" />;
              </SelectTrigger>;
              <SelectContent>;
                <SelectItem value="">All Priorities>;
                <SelectItem value="LOW">Low>;
                <SelectItem value="MEDIUM">Medium>;
                <SelectItem value="HIGH">High>;
                <SelectItem value="EMERGENCY">Emergency</SelectItem>;
              </SelectContent>;
            </Select>;
          </div>;

          >;
            >;
              <Filter className="h-4 w-4 mr-2" />;
              Apply Filters;
            </Button>;
            >;
              <RefreshCw className="h-4 w-4" />;
            </Button>;
          </div>;
        </div>;

        >;
          {isLoading ? (;
            renderSkeleton();
          ) : requests.length === 0 ? (;
            <Card>;
              >;
                <Wrench className="h-12 w-12 text-gray-400 mb-4" />;
                <p className="text-lg font-medium text-gray-900">No requests found>;
                >;
                  {activeTab === "all";
                    ? "There are no maintenance requests matching your filters.";
                    : `There are no ${activeTab === "inProgress" ? "in progress" : activeTab} maintenance requests.`}
                </p>;
                >;
                  <Plus className="h-4 w-4 mr-2" />;
                  Create New Request;
                </Button>;
              </CardContent>;
            </Card>;
          ) : (;
            >requests.map((request) => (;
                >;
                  >;
                    >;
>;
                          {renderRequestType(request.requestType)}
                        </CardTitle>;
                        >;
                          <MapPin className="h-3 w-3 mr-1" />;
                          {request.location?.name || "Unknown Location"}
                          {request?.asset && (;
                            <span className="ml-2">• {request.asset.name}>;
                          )}
                        </CardDescription>;
                      </div>;
                      >;
                        {renderPriorityBadge(request.priority)}
                        {renderStatusBadge(request.status)}
                      </div>;
                    </div>;
                  </CardHeader>;
                  <CardContent>;
                    <p className="text-sm line-clamp-2">{request.description}>;
                    >;
                      >;
                        <Calendar className="h-3 w-3 mr-1" />;
                        Created: {format(new Date(request.createdAt), "MMM d, yyyy")}
                      </div>;
                      {request?.scheduledDate && (;
                        >;
                          <Clock className="h-3 w-3 mr-1" />;
                          Scheduled: {format(new Date(request.scheduledDate), "MMM d, yyyy")}
                        </div>;
                      )}
                      >;
                        <User className="h-3 w-3 mr-1" />;
                        By: {request.requestedByUser?.name || "Unknown"}
                      </div>;
                      {request?.estimatedHours && (;
                        >;
                          <Clock3 className="h-3 w-3 mr-1" />;
                          Est. Hours: {request.estimatedHours}
                        </div>;
                      )}
                    </div>;
                  </CardContent>;
                  >;
                    >;
                      {request.workOrders?.length || 0} work order(s);
                    </div>;
                    <Button>;
                      variant="outline";
                      size="sm";
                      onClick={() => handleViewRequest(request.id)}
                    >;
                      View Details;
                    </Button>;
                  </CardFooter>;
                </Card>;
              ))totalPages > 1 && (;
                <Pagination>;
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />;
              )}
            </div>;
          );
        </TabsContent>;
      </Tabs>;
    </div>;
  );
)))