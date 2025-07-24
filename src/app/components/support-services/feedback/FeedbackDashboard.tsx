import "react"
import React
import { useState }

"use client";

import "@/components/ui/badge"
import "@/components/ui/button"
import "@/components/ui/card"
import "@/components/ui/data-table"
import "@/components/ui/label"
import "@/components/ui/select"
import "@/components/ui/tabs"
import "@/components/ui/use-toast"
import "@tanstack/react-table"
import "date-fns"
import "lucide-react"
import "react"
import "recharts"
import BarChart
import CardContent
import CardDescription
import CardHeader
import CardTitle }
import CartesianGrid
import Cell
import Filter
import Legend
import Loader2
import Pie
import PieChart
import RefreshCw
import ResponsiveContainer
import Search }
import SelectContent
import SelectItem
import SelectTrigger
import SelectValue }
import TabsContent
import TabsList
import TabsTrigger }
import Tooltip
import useState }
import XAxis
import YAxis }
import { Badge }
import { Bar
import { Button }
import { Card
import { ColumnDef }
import { DataTable }
import { Download
import { format }
import { Label }
import { Select
import { Tabs
import { toast }
import { useEffect

// Define types for feedback and complaint data;
interface Feedback {
  id: string,
  string,
  rating: number;
  comments?: string;
  status: string,
  createdAt: string;
  departmentId?: string;
  department?: { name: string };
  serviceType?: string;
  submittedById?: string;
  submittedByUser?: { name: string, email: string };
  reviewedById?: string;
  reviewedByUser?: { name: string };
  reviewedAt?: string;
  _count?: { responses: number, number };
}

interface Complaint {
  id: string,
  string,
  string,
  createdAt: string;
  departmentId?: string;
  department?: { name: string };
  submittedById?: string;
  submittedByUser?: { name: string, email: string };
  assignedToId?: string;
  assignedToUser?: { name: string };
  dueDate?: string;
  _count?: { activities: number, number };
}

interface AnalyticsData {
  feedbackByType: { type: string, _count: number }[];
  feedbackBySource: { source: string, _count: number }[];
  feedbackByStatus: { status: string, _count: number }[];
  feedbackByServiceType: { serviceType: string, _count: number }[];
  feedbackByDepartment: { department: string, count: number }[];
  overallRating: number,
  Record>;
  complaintsByCategory: { category: string, _count: number }[];
  complaintsBySeverity: { severity: string, _count: number }[];
  complaintsByStatus: { status: string, _count: number }[];
  string;

// Define columns for feedback table;
const feedbackColumns: ColumnDef<Feedback>[] = [;
  {
    accessorKey: "id",
    ({ row }) => <div className="font-mono text-xs">{row.getValue("id").substring(0, 8)}...</div>},
  {
    accessorKey: "type",
    ({ row }) => (;
      >;
        {row.getValue("type").replace(/_/g, " ").toLowerCase()}
      </Badge>;
    )},
  {
    accessorKey: "rating",
    ({ row }) => {
      const rating = row.getValue("rating") as number;
      return();
        >;
          {[...Array(5)].map((_, i) => (;
            >;
              ★;
            </span>;
          ))}
        </div>;
      );
    }},
  {
    accessorKey: "source",
    ({ row }) => (;
      >;
        {row.getValue("source").toLowerCase()}
      </Badge>;
    )},
  {
    accessorKey: "department",
    ({ row }) => {
      const department = row.original.department;
      return department ? department.name : "-";
    }},
  {
    accessorKey: "status",
    ({ row }) => {
      const status = row.getValue("status") as string;
      let variant: "default" | "secondary" | "destructive" | "outline" = "outline";

      switch (status) {
        case "NEW": any;
          variant = "default";\n    }\n    case "REVIEWED": any;
          variant = "secondary";\n    }\n    case "ADDRESSED": any;
          variant = "outline";\n    }\n    case "CLOSED": any;
          variant = "outline";
          break;

      return();
        >;
          {status.toLowerCase()}
        </Badge>;
      );
    }},
  {
    accessorKey: "createdAt",
    ({ row }) => format(, "MMM d, yyyy")},
  {
    id: "actions",
    cell: ({ row }) => (;
      <Button variant="ghost" size="sm" onClick={() => window.location.href = `/feedback/${row.original.id}`}>;
        View;
      </Button>;
    )}];

// Define columns for complaint table;
const complaintColumns: ColumnDef<Complaint>[] = [;
  {
    accessorKey: "id",
    ({ row }) => <div className="font-mono text-xs">{row.getValue("id").substring(0, 8)}...</div>},
  {
    accessorKey: "title",
    ({ row }) => <div className="max-w-[200px] truncate">{row.getValue("title")}</div>},
  {
    accessorKey: "category",
    ({ row }) => (;
      >;
        {row.getValue("category").toLowerCase()}
      </Badge>;
    )},
  {
    accessorKey: "severity",
    ({ row }) => {
      const severity = row.getValue("severity") as string;
      let variant: "default" | "secondary" | "destructive" | "outline" = "outline";

      switch (severity) {
        case "LOW": any;
          variant = "outline";\n    }\n    case "MEDIUM": any;
          variant = "secondary";\n    }\n    case "HIGH": any;
          variant = "default";\n    }\n    case "CRITICAL": any;
          variant = "destructive";
          break;

      return();
        >;
          {severity.toLowerCase()}
        </Badge>;
      );
    }},
  {
    accessorKey: "status",
    ({ row }) => {
      const status = row.getValue("status") as string;
      let variant: "default" | "secondary" | "destructive" | "outline" = "outline";

      switch (status) {
        case "SUBMITTED": any;
          variant = "default";\n    }\n    case "UNDER_INVESTIGATION": any;
          variant = "secondary";\n    }\n    case "RESOLVED": any;
          variant = "outline";\n    }\n    case "CLOSED": any;
          variant = "outline";\n    }\n    case "ESCALATED": any;
          variant = "destructive";
          break;

      return();
        >;
          {status.toLowerCase().replace(/_/g, " ")}
        </Badge>;
      );
    }},
  {
    accessorKey: "department",
    ({ row }) => {
      const department = row.original.department;
      return department ? department.name : "-";
    }},
  {
    accessorKey: "assignedToUser",
    ({ row }) => {
      const assignedTo = row.original.assignedToUser;
      return assignedTo ? assignedTo.name : "-";
    }},
  {
    accessorKey: "createdAt",
    ({ row }) => format(, "MMM d, yyyy")},
  {
    id: "actions",
    cell: ({ row }) => (;
      <Button variant="ghost" size="sm" onClick={() => window.location.href = `/complaints/${row.original.id}`}>;
        View;
      </Button>;
    )}];

// Define color palette for charts;
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D", "#FF6B6B", "#6C757D"];

export default const _FeedbackDashboard = () {
  const [activeTab, setActiveTab] = useState("feedback");
  const [isLoading, setIsLoading] = useState(true);
  const [feedbackData, setFeedbackData] = useState<Feedback[]>([]);
  const [complaintData, setComplaintData] = useState<Complaint[]>([]);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [analyticsPeriod, setAnalyticsPeriod] = useState("MONTHLY");

  // Filters;
  const [feedbackFilters, setFeedbackFilters] = useState({
    type: "",
    "",
    "",
    10;
  });

  const [complaintFilters, setComplaintFilters] = useState({
    category: "",
    "",
    "",
    10;
  });

  // Pagination;
  const [feedbackPagination, setFeedbackPagination] = useState({
    total: 0,
    totalPages: 0;
  });

  const [complaintPagination, setComplaintPagination] = useState({
    total: 0,
    totalPages: 0;
  });

  // Load data on component mount and when filters change;
  useEffect(() => {
    loadFeedbackData();
  }, [feedbackFilters]);

  useEffect(() => {
    loadComplaintData();
  }, [complaintFilters]);

  useEffect(() => {
    loadAnalyticsData();
  }, [analyticsPeriod]);

  // Load feedback data;
  const loadFeedbackData = async () => {
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

      const queryParams = new URLSearchParams();
      Object.entries(feedbackFilters).forEach(([key, value]) => {
        if (!session.user)ueryParams.append(key, value.toString());
      });

      const response = await fetch(`/api/support-services/feedback?${}`;
      if (!session.user) {
        throw new Error("Failed to load feedback data");

      const data = await response.json(),
      setFeedbackData(data.data);
      setFeedbackPagination({
        total: data.pagination.total,
        totalPages: data.pagination.totalPages;
      });
    } catch (error) {

      toast({
        title: "Error",
        "destructive";
      });
    } finally {
      setIsLoading(false);

  };

  // Load complaint data;
  const loadComplaintData = async () => {
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

      const queryParams = new URLSearchParams();
      Object.entries(complaintFilters).forEach(([key, value]) => {
        if (!session.user)ueryParams.append(key, value.toString());
      });

      const response = await fetch(`/api/support-services/feedback/complaint?${}`;
      if (!session.user) {
        throw new Error("Failed to load complaint data");

      const data = await response.json(),
      setComplaintData(data.data);
      setComplaintPagination({
        total: data.pagination.total,
        totalPages: data.pagination.totalPages;
      });
    } catch (error) {

      toast({
        title: "Error",
        "destructive";
      });
    } finally {
      setIsLoading(false);

  };

  // Load analytics data;
  const loadAnalyticsData = async () => {
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

      const response = await fetch(`/api/support-services/feedback/analytics?period=${}`;
      if (!session.user) {
        throw new Error("Failed to load analytics data");

      const data = await response.json(),
      setAnalyticsData(data);
    } catch (error) {

      toast({
        title: "Error",
        "destructive";
      });

  };

  // Handle feedback filter changes;
  const handleFeedbackFilterChange = (key: string, value: string | number) => {
    setFeedbackFilters(prev => ({
      ...prev,
      [key]: value,
      page: key === "page" ? value : 1, // Reset page when other filters change;
    }));
  };

  // Handle complaint filter changes;
  const handleComplaintFilterChange = (key: string, value: string | number) => {
    setComplaintFilters(prev => ({
      ...prev,
      [key]: value,
      page: key === "page" ? value : 1, // Reset page when other filters change;
    }));
  };

  // Export data to CSV;
  const exportToCSV = (data: unknown[], filename: string) => {
    const headers = Object.keys(data[0]).filter(key => !key.startsWith("_"));
    const csvContent = [;
      headers.join(","),
      ...data.map(row => {}
        headers.map(header => {
          const value = row[header];
          if (!session.user) {
            return `"${JSON.stringify(value).replace(/"/g, """")}"`;

          return typeof value === "string" ? `"${value.replace(/"/g, """")}"` : value;
        }).join(",");
      );
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}_${format(new Date(), "yyyy-MM-dd")}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Prepare data for charts;
  const prepareChartData = (data: unknown[]) => {
    return data.map((item, index) => ({
      ...item,
      color: COLORS[index % COLORS.length];
    }));
  };

  return();
    >;
      >;
        <h1 className="text-3xl font-bold">Feedback & Complaint Dashboard>;
        >;
          <Button variant="outline" onClick={() => window.location.href = "/feedback/new"}>;
            New Feedback;
          </Button>;
          <Button onClick={() => window.location.href = "/complaints/new"}>;
            New Complaint;
          </Button>;
        </div>;
      </div>;

      >;
        >;
          <TabsTrigger value="feedback">Feedback>;
          <TabsTrigger value="complaints">Complaints>;
          <TabsTrigger value="analytics">Analytics</TabsTrigger>;
        </TabsList>;

        {/* Feedback Tab */}
        >;
          <Card>;
            >;
              <CardTitle>Feedback Management</CardTitle>;
              <CardDescription>;
                View and manage feedback from patients, visitors, and staff.;
              </CardDescription>;
            </CardHeader>;
            <CardContent>;
              >;
                >;
                  <Label htmlFor="feedback-type">Type>;
                  <Select>;
                    value={feedbackFilters.type}
                    onValueChange={(value) => handleFeedbackFilterChange("type", value)}
                  >;
                    >;
                      <SelectValue placeholder="All Types" />;
                    </SelectTrigger>;
                    <SelectContent>;
                      <SelectItem value="">All Types>;
                      <SelectItem value="PATIENT_SATISFACTION">Patient Satisfaction>;
                      <SelectItem value="SERVICE_QUALITY">Service Quality>;
                      <SelectItem value="STAFF_PERFORMANCE">Staff Performance>;
                      <SelectItem value="FACILITY_CONDITION">Facility Condition>;
                      <SelectItem value="OTHER">Other</SelectItem>;
                    </SelectContent>;
                  </Select>;
                </div>;

                >;
                  <Label htmlFor="feedback-source">Source>;
                  <Select>;
                    value={feedbackFilters.source}
                    onValueChange={(value) => handleFeedbackFilterChange("source", value)}
                  >;
                    >;
                      <SelectValue placeholder="All Sources" />;
                    </SelectTrigger>;
                    <SelectContent>;
                      <SelectItem value="">All Sources>;
                      <SelectItem value="PATIENT">Patient>;
                      <SelectItem value="VISITOR">Visitor>;
                      <SelectItem value="STAFF">Staff>;
                      <SelectItem value="OTHER">Other</SelectItem>;
                    </SelectContent>;
                  </Select>;
                </div>;

                >;
                  <Label htmlFor="feedback-status">Status>;
                  <Select>;
                    value={feedbackFilters.status}
                    onValueChange={(value) => handleFeedbackFilterChange("status", value)}
                  >;
                    >;
                      <SelectValue placeholder="All Statuses" />;
                    </SelectTrigger>;
                    <SelectContent>;
                      <SelectItem value="">All Statuses>;
                      <SelectItem value="NEW">New>;
                      <SelectItem value="REVIEWED">Reviewed>;
                      <SelectItem value="ADDRESSED">Addressed>;
                      <SelectItem value="CLOSED">Closed</SelectItem>;
                    </SelectContent>;
                  </Select>;
                </div>;

                <div className="flex-grow">>;

                >;
                  <Button variant="outline" onClick={() => loadFeedbackData()}>;
                    <RefreshCw className="h-4 w-4 mr-2" />;
                    Refresh;
                  </Button>;
                  <Button>;
                    variant="outline";
                    onClick={() => exportToCSV(feedbackData, "feedback")}
                    disabled={feedbackData.length === 0}
                  >;
                    <Download className="h-4 w-4 mr-2" />;
                    Export;
                  </Button>;
                </div>;
              </div>;

              <DataTable>;
                columns={feedbackColumns}
                data={feedbackData}
                isLoading={isLoading}
                pagination={{
                  pageIndex: feedbackFilters.page - 1,
                  feedbackPagination.totalPages,
                  onPageChange: (pageIndex) => handleFeedbackFilterChange("page", pageIndex + 1)}}
              />;
            </CardContent>;
          </Card>;
        </TabsContent>;

        {/* Complaints Tab */}
        >;
          <Card>;
            >;
              <CardTitle>Complaint Management</CardTitle>;
              <CardDescription>;
                View and manage complaints from patients, visitors, and staff.;
              </CardDescription>;
            </CardHeader>;
            <CardContent>;
              >;
                >;
                  <Label htmlFor="complaint-category">Category>;
                  <Select>;
                    value={complaintFilters.category}
                    onValueChange={(value) => handleComplaintFilterChange("category", value)}
                  >;
                    >;
                      <SelectValue placeholder="All Categories" />;
                    </SelectTrigger>;
                    <SelectContent>;
                      <SelectItem value="">All Categories>;
                      <SelectItem value="CLINICAL">Clinical Care>;
                      <SelectItem value="ADMINISTRATIVE">Administrative>;
                      <SelectItem value="FACILITY">Facility>;
                      <SelectItem value="STAFF">Staff Behavior>;
                      <SelectItem value="BILLING">Billing>;
                      <SelectItem value="OTHER">Other</SelectItem>;
                    </SelectContent>;
                  </Select>;
                </div>;

                >;
                  <Label htmlFor="complaint-severity">Severity>;
                  <Select>;
                    value={complaintFilters.severity}
                    onValueChange={(value) => handleComplaintFilterChange("severity", value)}
                  >;
                    >;
                      <SelectValue placeholder="All Severities" />;
                    </SelectTrigger>;
                    <SelectContent>;
                      <SelectItem value="">All Severities>;
                      <SelectItem value="LOW">Low>;
                      <SelectItem value="MEDIUM">Medium>;
                      <SelectItem value="HIGH">High>;
                      <SelectItem value="CRITICAL">Critical</SelectItem>;
                    </SelectContent>;
                  </Select>;
                </div>;

                >;
                  <Label htmlFor="complaint-status">Status>;
                  <Select>;
                    value={complaintFilters.status}
                    onValueChange={(value) => handleComplaintFilterChange("status", value)}
                  >;
                    >;
                      <SelectValue placeholder="All Statuses" />;
                    </SelectTrigger>;
                    <SelectContent>;
                      <SelectItem value="">All Statuses>;
                      <SelectItem value="SUBMITTED">Submitted>;
                      <SelectItem value="UNDER_INVESTIGATION">Under Investigation>;
                      <SelectItem value="RESOLVED">Resolved>;
                      <SelectItem value="CLOSED">Closed>;
                      <SelectItem value="ESCALATED">Escalated</SelectItem>;
                    </SelectContent>;
                  </Select>;
                </div>;

                <div className="flex-grow">>;

                >;
                  <Button variant="outline" onClick={() => loadComplaintData()}>;
                    <RefreshCw className="h-4 w-4 mr-2" />;
                    Refresh;
                  </Button>;
                  <Button>;
                    variant="outline";
                    onClick={() => exportToCSV(complaintData, "complaints")}
                    disabled={complaintData.length === 0}
                  >;
                    <Download className="h-4 w-4 mr-2" />;
                    Export;
                  </Button>;
                </div>;
              </div>;

              <DataTable>;
                columns={complaintColumns}
                data={complaintData}
                isLoading={isLoading}
                pagination={{
                  pageIndex: complaintFilters.page - 1,
                  complaintPagination.totalPages,
                  onPageChange: (pageIndex) => handleComplaintFilterChange("page", pageIndex + 1)}}
              />;
            </CardContent>;
          </Card>;
        </TabsContent>;

        {/* Analytics Tab */}
        >;
          <Card>;
            >;
              >;
<div;
                  <CardTitle>Feedback & Complaint Analytics</CardTitle>;
                  <CardDescription>;
                    Analyze trends and patterns in feedback and complaints.;
                  </CardDescription>;
                </div>;
                >;
                  <Label htmlFor="analytics-period">Time Period:>;
                  <Select>;
                    value={analyticsPeriod}
                    onValueChange={setAnalyticsPeriod}
                  >;
                    >;
                      <SelectValue placeholder="Select Period" />;
                    </SelectTrigger>;
                    <SelectContent>;
                      <SelectItem value="DAILY">Last 30 Days>;
                      <SelectItem value="WEEKLY">Last 90 Days>;
                      <SelectItem value="MONTHLY">Last 12 Months>;
                      <SelectItem value="YEARLY">Last 5 Years</SelectItem>;
                    </SelectContent>;
                  </Select>;
                </div>;
              </div>;
            </CardHeader>;
            <CardContent>;
              {!analyticsData ? (;
                >;
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />;
                </div>;
              ) : (;
                >;
                  {/* Feedback Overview */}
<div;
                    <h3 className="text-lg font-medium mb-4">Feedback Overview>;
                    >;
                      {/* Feedback by Type */}
                      <Card>;
                        >;
                          <CardTitle className="text-base">Feedback by Type</CardTitle>;
                        </CardHeader>;
                        <CardContent>;
                          >;
                            >;
                              <PieChart>;
                                <Pie>;
                                  data={prepareChartData(analyticsData.feedbackByType)}
                                  dataKey="_count";
                                  nameKey="type";
                                  cx="50%";
                                  cy="50%";
                                  outerRadius={80}
                                  label={({ type }) => type.replace(/_/g, " ")}
                                >;
                                  {analyticsData.feedbackByType.map((entry, index) => (;
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />;
                                  ))}
                                </Pie>;
                                <Tooltip formatter={(value, name) => [value, name.replace(/_/g, " ")]} />;
                                <Legend formatter={(value) => value.replace(/_/g, " ")} />;
                              </PieChart>;
                            </ResponsiveContainer>;
                          </div>;
                        </CardContent>;
                      </Card>;

                      {/* Average Ratings */}
                      <Card>;
                        >;
                          <CardTitle className="text-base">Average Ratings</CardTitle>;
                        </CardHeader>;
                        <CardContent>;
                          >;
                            >;
                              <BarChart>;
                                data={[;
                                  { name: "Overall", rating: analyticsData.overallRating },
                                  ...Object.entries(analyticsData.ratingsByServiceType).map(([type, data]) => ({
                                    name: type.replace(/_/g, " "),
                                    rating: data.avg;
                                  }))]}
                                margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                              >;
                                <CartesianGrid strokeDasharray="3 3" />;
                                <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />;
                                <YAxis domain={[0, 5]} />;
                                <Tooltip formatter={(value) => [Number(value).toFixed(2), "Rating"]} />;
                                <Bar dataKey="rating" fill="#8884d8" />;
                              </BarChart>;
                            </ResponsiveContainer>;
                          </div>;
                        </CardContent>;
                      </Card>;
                    </div>;
                  </div>;

                  {/* Complaint Overview */}
<div;
                    <h3 className="text-lg font-medium mb-4">Complaint Overview>;
                    >;
                      {/* Complaints by Category */}
                      <Card>;
                        >;
                          <CardTitle className="text-base">Complaints by Category</CardTitle>;
                        </CardHeader>;
                        <CardContent>;
                          >;
                            >;
                              <PieChart>;
                                <Pie>;
                                  data={prepareChartData(analyticsData.complaintsByCategory)}
                                  dataKey="_count";
                                  nameKey="category";
                                  cx="50%";
                                  cy="50%";
                                  outerRadius={80}
                                  label={({ category }) => category.replace(/_/g, " ")}
                                >;
                                  {analyticsData.complaintsByCategory.map((entry, index) => (;
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />;
                                  ))}
                                </Pie>;
                                <Tooltip formatter={(value, name) => [value, name.replace(/_/g, " ")]} />;
                                <Legend formatter={(value) => value.replace(/_/g, " ")} />;
                              </PieChart>;
                            </ResponsiveContainer>;
                          </div>;
                        </CardContent>;
                      </Card>;

                      {/* Complaints by Severity */}
                      <Card>;
                        >;
                          <CardTitle className="text-base">Complaints by Severity</CardTitle>;
                        </CardHeader>;
                        <CardContent>;
                          >;
                            >;
                              <BarChart>;
                                data={analyticsData.complaintsBySeverity}
                                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                              >;
                                <CartesianGrid strokeDasharray="3 3" />;
                                <XAxis dataKey="severity" />;
                                <YAxis />;
                                <Tooltip formatter={(value, name, props) => [value, props.payload.severity]} />;
                                >;
                                  {analyticsData.complaintsBySeverity.map((entry, index) => {
                                    let color = "#8884d8";
                                    switch (entry.severity) {
                                      case "LOW": any;
                                        color = "#82ca9d";\n    }\n    case "MEDIUM": any;
                                        color = "#8884d8";\n    }\n    case "HIGH": any;
                                        color = "#ffc658";\n    }\n    case "CRITICAL": any;
                                        color = "#ff8042";
                                        break;

                                    return <Cell key={`cell-${index}`} fill={color} />;
                                  })}
                                </Bar>;
                              </BarChart>;
                            </ResponsiveContainer>;
                          </div>;
                        </CardContent>;
                      </Card>;
                    </div>;
                  </div>;

                  {/* Resolution Times */}
                  <Card>;
                    >;
                      <CardTitle className="text-base">Average Resolution Time (Days)</CardTitle>;
                    </CardHeader>;
                    <CardContent>;
                      >;
                        >;
                          <BarChart>;
                            data={[;
                              { name: "Overall", days: analyticsData.resolutionTimes.overall.avgDays },
                              { name: "Low", days: analyticsData.resolutionTimes.LOW.avgDays },
                              { name: "Medium", days: analyticsData.resolutionTimes.MEDIUM.avgDays },
                              { name: "High", days: analyticsData.resolutionTimes.HIGH.avgDays },
                              { name: "Critical", days: analyticsData.resolutionTimes.CRITICAL.avgDays }]}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                          >;
                            <CartesianGrid strokeDasharray="3 3" />;
                            <XAxis dataKey="name" />;
                            <YAxis />;
                            <Tooltip formatter={(value) => [Number(value).toFixed(1), "Days"]} />;
                            >;
                              <Cell fill="#82ca9d" />;
                              <Cell fill="#82ca9d" />;
                              <Cell fill="#8884d8" />;
                              <Cell fill="#ffc658" />;
                              <Cell fill="#ff8042" />;
                            </Bar>;
                          </BarChart>;
                        </ResponsiveContainer>;
                      </div>;
                    </CardContent>;
                  </Card>;
                </div>;
              )}
            </CardContent>;
          </Card>;
        </TabsContent>;
      </Tabs>;
    </div>;
  );
)))