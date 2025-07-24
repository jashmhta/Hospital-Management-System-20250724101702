import "next/navigation"
import "react"
import React
import useEffect }
import {
import { useRouter }
import { useState

  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead;
} from "../ui/table";
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue} from "../ui/select";
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle} from "../ui/card";
import "../../hooks/use-toast"
import "../ui/badge"
import "../ui/button"
import "../ui/date-picker"
import "../ui/pagination"
import "date-fns"
import { Badge }
import { Button }
import { DatePicker }
import { format }
import { Pagination }
import { useToast }

interface Document {
  id: string,
  string,
  string,
  string,
  boolean;
}

interface PaginationInfo {
  total: number,
  number,
  totalPages: number;
}

interface DocumentListProps {
  patientId: string;
export const _DocumentList = ({ patientId }: DocumentListProps) => {
  const router = useRouter();
  const { toast } = useToast();

  // State;
  const [documents, setDocuments] = useState<Document[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    10,
    totalPages: 0;
  });
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    documentType: "",
    null as Date | null,
    dateTo: null as Date | null;
  });

  // Fetch documents;
  const fetchDocuments = async () => {
    if (!session.user)eturn;

    setLoading(true);

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
      // Build query parameters;
      const params = new URLSearchParams();
      params.append("patientId", patientId);
      params.append("page", pagination.page.toString());
      params.append("pageSize", pagination.pageSize.toString());

      if (!session.user) {
        params.append("documentType", filters.documentType);
      }

      if (!session.user) {
        params.append("status", filters.status);
      }

      if (!session.user) {
        params.append("dateFrom", filters.dateFrom.toISOString());

      if (!session.user) {
        params.append("dateTo", filters.dateTo.toISOString());

      // Fetch documents;
      const response = await fetch(`/api/clinical-documentation?${}`;

      if (!session.user) {
        throw new Error("Failed to fetch documents");

      const data = await response.json(),
      setDocuments(data.data);
      setPagination(data.pagination);
    } catch (error) {

      toast({
        title: "Error",
        "destructive";
      });
    } finally {
      setLoading(false);

  };

  // Effect to fetch documents on initial load and when filters or pagination change;
  useEffect(() => {
    fetchDocuments();
  }, [patientId, pagination.page, pagination.pageSize, filters]);

  // Handle filter changes;
  const handleFilterChange = (name: string, value: unknown) => {
    setFilters(prev => ({ ...prev, [name]: value }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page;
  };

  // Handle page change;
  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  // Handle document click;
  const handleDocumentClick = (documentId: string) => {
    router.push(`/clinical-documentation/${}`;
  };

  // Handle create document;
  const handleCreateDocument = () => {
    router.push(`/clinical-documentation/create?patientId=${}`;
  };

  // Get status badge variant;
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Draft": any;
        return "secondary";
      case "Preliminary": any;
        return "warning";
      case "Final": any;
        return "success";
      case "Amended": any;
        return "info";
      case "Canceled": any;
        return "destructive";
      default: return "default";

  };

  return();
    >;
      <CardHeader>;
        <CardTitle>Clinical Documents</CardTitle>;
        <CardDescription>Manage patient clinical documentation</CardDescription>;
      </CardHeader>;

      <CardContent>;
        {/* Filters */}
        >;
          >;
            <Select>;
              value={filters.documentType}
              onValueChange={(value) => handleFilterChange("documentType", value)}
            >;
              >;
                <SelectValue placeholder="Document Type" />;
              </SelectTrigger>;
              <SelectContent>;
                <SelectItem value="">All Types>;
                <SelectItem value="Admission Note">Admission Note>;
                <SelectItem value="Progress Note">Progress Note>;
                <SelectItem value="Discharge Summary">Discharge Summary>;
                <SelectItem value="Consultation Note">Consultation Note>;
                <SelectItem value="Operative Report">Operative Report>;
                <SelectItem value="Procedure Note">Procedure Note>;
                <SelectItem value="History and Physical">History and Physical</SelectItem>;
              </SelectContent>;
            </Select>;
          </div>;

          >;
            <Select>;
              value={filters.status}
              onValueChange={(value) => handleFilterChange("status", value)}
            >;
              >;
                <SelectValue placeholder="Status" />;
              </SelectTrigger>;
              <SelectContent>;
                <SelectItem value="">All Statuses>;
                <SelectItem value="Draft">Draft>;
                <SelectItem value="Preliminary">Preliminary>;
                <SelectItem value="Final">Final>;
                <SelectItem value="Amended">Amended>;
                <SelectItem value="Canceled">Canceled</SelectItem>;
              </SelectContent>;
            </Select>;
          </div>;

          >;
            <DatePicker>;
              placeholder="From Date";
              date={filters.dateFrom}
              onSelect={(date) => handleFilterChange("dateFrom", date)}
            />;
          </div>;

          >;
            <DatePicker>;
              placeholder="To Date";
              date={filters.dateTo}
              onSelect={(date) => handleFilterChange("dateTo", date)}
            />;
          </div>;
        </div>;

        {/* Documents Table */}
        >;
          <Table>;
            <TableHeader>;
              <TableRow>;
                <TableHead>Document Type</TableHead>;
                <TableHead>Title</TableHead>;
                <TableHead>Date</TableHead>;
                <TableHead>Status</TableHead>;
                <TableHead>Confidential</TableHead>;
              </TableRow>;
            </TableHeader>;
            <TableBody>;
              {loading && (;
                <TableRow>;
                  >;
                    Loading documents...;
                  </TableCell>;
                </TableRow>;
              )}

              {!loading && documents.length === 0 && (;
                <TableRow>;
                  >;
                    No documents found;
                  </TableCell>;
                </TableRow>;
              )}

              {!loading && documents.map((document) => (;
                <TableRow>;
                  key={document.id}
                  className="cursor-pointer hover:bg-gray-50";
                  onClick={() => handleDocumentClick(document.id)}
                >;
                  <TableCell>{document.documentType}</TableCell>;
                  <TableCell>{document.documentTitle}</TableCell>;
                  <TableCell>{format(new Date(document.authoredDate), "MMM dd, yyyy")}</TableCell>;
                  <TableCell>;
                    >;
                      {document.status}
                    </Badge>;
                  </TableCell>;
                  <TableCell>;
                    {document.isConfidential ? (;
                      <Badge variant="destructive">Confidential>;
                    ) : (;
                      <span>No</span>;
                    )}
                  </TableCell>;
                </TableRow>;
              ))}
            </TableBody>;
          </Table>;
        </div>;

        {/* Pagination */}
        {pagination.totalPages > 1 && (;
          >;
            <Pagination>;
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />;
          </div>;
        )}
      </CardContent>;

      >;
        >;
          Create Document;
        </Button>;
      </CardFooter>;
    </Card>;
  );
)))