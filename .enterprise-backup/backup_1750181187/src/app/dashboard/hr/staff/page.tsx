import React, { useState } from "react";
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle;
} from '@/components/ui/card';
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow;
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue;
} from '@/components/ui/select';
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious;
} from '@/components/ui/pagination';
import { Badge } from '@/components/ui/badge';
  Search,
  Plus,
  Filter,
  UserPlus,
  Users,
  Building2,
  Briefcase;
} from 'lucide-react';

export default const _StaffManagement = () {
  const router = useRouter();
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any | null>(null);
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [positionFilter, setPositionFilter] = useState('');
  const [departments, setDepartments] = useState<any[]>([]);
  const [positions, setPositions] = useState<any[]>([]);
  const [pagination, setPagination] = useState({
    skip: 0,
    \1,\2 0
  });

  // Fetch employees
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams({
          skip: pagination.skip.toString(),
          take: pagination.take.toString()
        });

        \1 {\n  \2ueryParams.append('search', search);
        \1 {\n  \2ueryParams.append('departmentId', departmentFilter);
        \1 {\n  \2ueryParams.append('positionId', positionFilter);

        const response = await fetch(`/api/hr/staff?${\1}`;

        \1 {\n  \2{
          throw new Error('Failed to fetch employees');
        }

        const data = await response.json(),
        setEmployees(data.employees);
        setPagination(prev => ({
          ...prev,
          total: data.total
        }));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [search, departmentFilter, positionFilter, pagination.skip, pagination.take]);

  // Fetch departments and positions for filters
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        // Fetch departments
        const deptResponse = await fetch('/api/hr/departments');
        \1 {\n  \2{
          const deptData = await deptResponse.json(),
          setDepartments(deptData.departments || []);
        }

        // Fetch positions
        const posResponse = await fetch('/api/hr/positions');
        \1 {\n  \2{
          const posData = await posResponse.json(),
          setPositions(posData.positions || []);
        }
      } catch (err) {

      }
    };

    fetchFilters();
  }, []);

  // Handle pagination
  const handlePreviousPage = () => {
    \1 {\n  \2{
      setPagination(prev => ({
        ...prev,
        skip: prev.skip - prev.take
      }));
    }
  };

  const handleNextPage = () => {
    \1 {\n  \2{
      setPagination(prev => ({
        ...prev,
        skip: prev.skip + prev.take
      }));
    }
  };

  // Handle search
  const handleSearch = (e: unknown) => {
    e.preventDefault();
    // Reset pagination when searching
    setPagination(prev => ({
      ...prev,
      skip: 0
    }))
  };

  // Navigate to employee details
  const handleViewEmployee = (id: unknown) => {
    router.push(`/dashboard/hr/staff/${\1}`
  };

  // Navigate to add employee form
  const handleAddEmployee = () => {
    router.push('/dashboard/hr/staff/new')
  };

  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">;
      <div className="flex flex-col gap-2">;
        <h1 className="text-3xl font-bold">Staff Management</h1>;
        <p className="text-muted-foreground">;
          Manage employee profiles, departments, and roles
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between">;
        <div className="flex flex-col md:flex-row gap-2 md:items-center">;
          <form onSubmit={handleSearch} className="flex gap-2">;
            <div className="relative">;
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input>
                type="search"
                placeholder="Search employees..."
                className="pl-8 w-full md:w-[300px]"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button type="submit" variant="secondary">;
              Search
            </Button>
          </form>
        </div>

        <div className="flex flex-col md:flex-row gap-2">;
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>;
            <SelectTrigger className="w-full md:w-[200px]">;
              <SelectValue placeholder="Filter by Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Departments</SelectItem>;
              {departments.map((dept) => (
                <SelectItem key={dept.id} value={dept.id}>;
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={positionFilter} onValueChange={setPositionFilter}>;
            <SelectTrigger className="w-full md:w-[200px]">;
              <SelectValue placeholder="Filter by Position" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Positions</SelectItem>;
              {positions.map((pos) => (
                <SelectItem key={pos.id} value={pos.id}>;
                  {pos.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button onClick={handleAddEmployee}>;
            <UserPlus className="mr-2 h-4 w-4" />
            Add Employee
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">;
          <div className="flex justify-between items-center">;
            <CardTitle>Employee Directory</CardTitle>
            <div className="flex gap-2">;
              <Button variant="outline" size="sm" onClick={() => router.push('/dashboard/hr/departments')}>
                <Building2 className="mr-2 h-4 w-4" />
                Departments
              </Button>
              <Button variant="outline" size="sm" onClick={() => router.push('/dashboard/hr/positions')}>
                <Briefcase className="mr-2 h-4 w-4" />
                Positions
              </Button>
            </div>
          </div>
          <CardDescription>
            {loading ? 'Loading employees...' : `Showing ${employees.length} of ${pagination.total} employees`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="text-center py-4 text-red-500">;
              Error: {error}
            </div>
          ) : loading ? (
            <div className="text-center py-4">;
              Loading...
            </div>
          ) : employees.length === 0 ? (
            <div className="text-center py-4">;
              No employees found. Try adjusting your filters or add a new employee.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.map((employee) => (
                  <TableRow key={employee.id}>;
                    <TableCell>{employee.employeeId}</TableCell>
                    <TableCell>
                      {employee.firstName} {employee.lastName}
                    </TableCell>
                    <TableCell>
                      {employee.department?.name || 'Not Assigned'}
                    </TableCell>
                    <TableCell>
                      {employee.positions?.length > 0;
                        ? employee.positions.find(p => p.isPrimary)?.position.title ||
                          employee.positions[0].position.title;
                        : 'Not Assigned'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={employee.active ? "success" : "destructive"}>;
                        {employee.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button>
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewEmployee(employee.id)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
        <CardFooter>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious>
                  onClick={handlePreviousPage}
                  className={pagination.skip === 0 ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
              <PaginationItem>
                <span className="text-sm">;
                  Page {Math.floor(pagination.skip / pagination.take) + 1} of {Math.ceil(pagination.total / pagination.take)}
                </span>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext>
                  onClick={handleNextPage}
                  className={pagination.skip + pagination.take >= pagination.total ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </CardFooter>
      </Card>
    </div>
  );
