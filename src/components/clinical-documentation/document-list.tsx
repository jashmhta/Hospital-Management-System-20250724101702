  var __DEV__: boolean;
  interface Window {
    [key: string]: any;
  }
  namespace NodeJS {
    interface Global {
      [key: string]: any;
    }
  }
}

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead;
} from '../ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Pagination } from '../ui/pagination';
import { DatePicker } from '../ui/date-picker';
import { format } from 'date-fns';
import { useToast } from '../../hooks/use-toast';

interface Document {
  id: string;
  documentNumber: string;
  documentType: string;
  documentTitle: string;
  authoredDate: string;
  authorId: string;
  status: string;
  patientId: string;
  isConfidential: boolean;
}

interface PaginationInfo {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

interface DocumentListProps {
  patientId: string;
}

export const DocumentList = ({ patientId }: DocumentListProps) {
  const router = useRouter();
  const { toast } = useToast();
  
  // State;
  const [documents, setDocuments] = useState<Document[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    pageSize: 10,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    documentType: '',
    status: '',
    dateFrom: null as Date | null,
    dateTo: null as Date | null,
  });
  
  // Fetch documents;
  const fetchDocuments = async () => {
    if (!patientId) return;
    
    setLoading(true);
    
    try {
      // Build query parameters;
      const params = new URLSearchParams();
      params.append('patientId', patientId);
      params.append('page', pagination.page.toString());
      params.append('pageSize', pagination.pageSize.toString());
      
      if (filters.documentType) {
        params.append('documentType', filters.documentType);
      }
      
      if (filters.status) {
        params.append('status', filters.status);
      }
      
      if (filters.dateFrom) {
        params.append('dateFrom', filters.dateFrom.toISOString());
      }
      
      if (filters.dateTo) {
        params.append('dateTo', filters.dateTo.toISOString());
      }
      
      // Fetch documents;
      const response = await fetch(`/api/clinical-documentation?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch documents');
      }
      
      const data = await response.json();
      
      setDocuments(data.data);
      setPagination(data.pagination);
    } catch (error) {

      toast({
        title: 'Error',
        description: 'Failed to fetch documents. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
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
    router.push(`/clinical-documentation/${documentId}`);
  };
  
  // Handle create document;
  const handleCreateDocument = () => {
    router.push(`/clinical-documentation/create?patientId=${patientId}`);
  };
  
  // Get status badge variant;
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Draft':
        return 'secondary';
      case 'Preliminary':
        return 'warning';
      case 'Final':
        return 'success';
      case 'Amended':
        return 'info';
      case 'Canceled':
        return 'destructive';
      default:
        return 'default';
    }
  };
  
  return (
    <Card className="w-full">;
      <CardHeader>
        <CardTitle>Clinical Documents</CardTitle>
        <CardDescription>Manage patient clinical documentation</CardDescription>
      </CardHeader>
      
      <CardContent>
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">;
          <div className="w-full md:w-auto">;
            <Select;
              value={filters.documentType}
              onValueChange={(value) => handleFilterChange('documentType', value)}
            >
              <SelectTrigger className="w-full md:w-[200px]">;
                <SelectValue placeholder="Document Type" />;
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>;
                <SelectItem value="Admission Note">Admission Note</SelectItem>;
                <SelectItem value="Progress Note">Progress Note</SelectItem>;
                <SelectItem value="Discharge Summary">Discharge Summary</SelectItem>;
                <SelectItem value="Consultation Note">Consultation Note</SelectItem>;
                <SelectItem value="Operative Report">Operative Report</SelectItem>;
                <SelectItem value="Procedure Note">Procedure Note</SelectItem>;
                <SelectItem value="History and Physical">History and Physical</SelectItem>;
              </SelectContent>
            </Select>
          </div>
          
          <div className="w-full md:w-auto">;
            <Select;
              value={filters.status}
              onValueChange={(value) => handleFilterChange('status', value)}
            >
              <SelectTrigger className="w-full md:w-[200px]">;
                <SelectValue placeholder="Status" />;
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Statuses</SelectItem>;
                <SelectItem value="Draft">Draft</SelectItem>;
                <SelectItem value="Preliminary">Preliminary</SelectItem>;
                <SelectItem value="Final">Final</SelectItem>;
                <SelectItem value="Amended">Amended</SelectItem>;
                <SelectItem value="Canceled">Canceled</SelectItem>;
              </SelectContent>
            </Select>
          </div>
          
          <div className="w-full md:w-auto">;
            <DatePicker;
              placeholder="From Date";
              date={filters.dateFrom}
              onSelect={(date) => handleFilterChange('dateFrom', date)}
            />
          </div>
          
          <div className="w-full md:w-auto">;
            <DatePicker;
              placeholder="To Date";
              date={filters.dateTo}
              onSelect={(date) => handleFilterChange('dateTo', date)}
            />
          </div>
        </div>
        
        {/* Documents Table */}
        <div className="rounded-md border">;
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document Type</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Confidential</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6">;
                    Loading documents...;
                  </TableCell>
                </TableRow>
              )}
              
              {!loading && documents.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6">;
                    No documents found;
                  </TableCell>
                </TableRow>
              )}
              
              {!loading && documents.map((document) => (
                <TableRow;
                  key={document.id}
                  className="cursor-pointer hover:bg-gray-50";
                  onClick={() => handleDocumentClick(document.id)}
                >
                  <TableCell>{document.documentType}</TableCell>
                  <TableCell>{document.documentTitle}</TableCell>
                  <TableCell>{format(new Date(document.authoredDate), 'MMM dd, yyyy')}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(document.status)}>;
                      {document.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {document.isConfidential ? (
                      <Badge variant="destructive">Confidential</Badge>;
                    ) : (
                      <span>No</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center mt-4">;
            <Pagination;
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-end">;
        <Button onClick={handleCreateDocument}>;
          Create Document;
        </Button>
      </CardFooter>
    </Card>
  );
}