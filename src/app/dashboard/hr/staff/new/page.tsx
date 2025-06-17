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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue;
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, Save, ArrowLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from '@/components/ui/use-toast';

// Form schema for employee creation
const employeeFormSchema = z.object({
  employeeId: z.string().min(1, "Employee ID is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  middleName: z.string().optional(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER', 'UNKNOWN']).optional(),
  birthDate: z.date().optional(),
  \1,\2 z.string().optional(),
  \1,\2 z.array(z.string()).optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    postalCode: z.string().optional(),
    country: z.string().optional()
  }).optional(),
  joiningDate: z.date(),
  departmentId: z.string().optional(),
  userId: z.string().optional(),
  photo: z.string().optional(),
  \1,\2 z.string().optional(),
    relationship: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().optional()
  }).optional(),
});

export default const _NewEmployee = () {
  const router = useRouter();
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<any[]>([]);

  // Initialize form
  const form = useForm({
    resolver: zodResolver(employeeFormSchema),
    \1,\2 '',
      \1,\2 '',
      \1,\2 undefined,
      \1,\2 '',
      \1,\2 [''],
        \1,\2 '',
        \1,\2 '',
      joiningDate: new Date(),
      \1,\2 '',
      \1,\2 '',
        \1,\2 '',
        email: '',
    },
  });

  // Fetch departments for dropdown
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch('/api/hr/departments');
        \1 {\n  \2{
          const data = await response.json(),
          setDepartments(data.departments || []);
        }
      } catch (err) {

      }
    };

    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        \1 {\n  \2{
          const data = await response.json(),
          setUsers(data.users || []);
        }
      } catch (err) {

      }
    };

    fetchDepartments(),
    fetchUsers();
  }, []);

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      setLoading(true);

      // Format dates for API
      const formattedData = {
        ...data,
        birthDate: data.birthDate ? format(data.birthDate, 'yyyy-MM-dd') : undefined,
        joiningDate: format(data.joiningDate, 'yyyy-MM-dd'),
      };

      const response = await fetch('/api/hr/staff', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData)
      });

      \1 {\n  \2{
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create employee');
      }

      const _newEmployee = await response.json(),
      toast({
        title: "Employee Created",
        description: `Successfully created employee record for /* SECURITY: Template literal eliminated */
      });

      // Navigate back to staff list
      router.push('/dashboard/hr/staff');
    } catch (error) {
      toast({
        title: "Error",
        \1,\2 "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    \1>
      \1>
        <Button>
          variant="ghost"
          size="sm"
          onClick={() => router.push('/dashboard/hr/staff')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Staff List
        </Button>
      </div>

      \1>
        <h1 className="text-3xl font-bold">Add New Employee\1>
        \1>
          Create a new employee record in the system
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Employee Information</CardTitle>
          <CardDescription>
            Enter the basic information for the new employee
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            \1>
              \1>
                {/* Basic Information */}
                <FormField>
                  control={form.control}
                  name="employeeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employee ID*</FormLabel>
                      <FormControl>
                        <Input placeholder="EMP-001" {...field} />
                      </FormControl>
                      <FormDescription>
                        Unique identifier for the employee
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField>
                  control={form.control}
                  name="userId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>System User</FormLabel>
                      <Select>
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a user account" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="">None\1>
                          {users.map((user) => (
                            \1>
                              {user.name} ({user.email})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Link to a system user account (optional)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField>
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name*</FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField>
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name*</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField>
                  control={form.control}
                  name="middleName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Middle Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Middle name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField>
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select>
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="MALE">Male\1>
                          <SelectItem value="FEMALE">Female\1>
                          <SelectItem value="OTHER">Other\1>
                          <SelectItem value="UNKNOWN">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField>
                  control={form.control}
                  name="birthDate"
                  render={({ field }) => (
                    \1>
                      <FormLabel>Date of Birth</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button>
                              variant={"outline"}
                              className={`w-full pl-3 text-left font-normal ${!field?.value && "text-muted-foreground"}`}
                            >
                              {field.value ? (
                                format(field.value, "PPP");
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        \1>
                          <Calendar>
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01");
                            }
                            initialFocus;
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField>
                  control={form.control}
                  name="joiningDate"
                  render={({ field }) => (
                    \1>
                      <FormLabel>Joining Date*</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button>
                              variant={"outline"}
                              className={`w-full pl-3 text-left font-normal $!field?.value && "text-muted-foreground"`}
                            >
                              {field.value ? (
                                format(field.value, "PPP");
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        \1>
                          <Calendar>
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date("2100-01-01");
                            }
                            initialFocus;
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField>
                  control={form.control}
                  name="departmentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <Select>
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="">None\1>
                          {departments.map((dept) => (
                            \1>
                              {dept.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              \1>
                <h3 className="text-lg font-medium">Contact Information\1>
                \1>
                  Employee's contact details
                </p>
              </div>

              \1>
                <FormField>
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="john.doe@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField>
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 (555) 123-4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField>
                  control={form.control}
                  name="address.line.0"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address Line 1</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Main St" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField>
                  control={form.control}
                  name="address.city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="New York" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField>
                  control={form.control}
                  name="address.state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State/Province</FormLabel>
                      <FormControl>
                        <Input placeholder="NY" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField>
                  control={form.control}
                  name="address.postalCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Postal Code</FormLabel>
                      <FormControl>
                        <Input placeholder="10001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField>
                  control={form.control}
                  name="address.country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input placeholder="USA" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              \1>
                <h3 className="text-lg font-medium">Emergency Contact\1>
                \1>
                  Person to contact in case of emergency
                </p>
              </div>

              \1>
                <FormField>
                  control={form.control}
                  name="emergencyContact.name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Jane Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField>
                  control={form.control}
                  name="emergencyContact.relationship"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Relationship</FormLabel>
                      <FormControl>
                        <Input placeholder="Spouse" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField>
                  control={form.control}
                  name="emergencyContact.phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 (555) 987-6543" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField>
                  control={form.control}
                  name="emergencyContact.email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="jane.doe@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              \1>
                <Button>
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/dashboard/hr/staff')}
                >
                  Cancel
                </Button>
                \1>
                  {loading ? 'Saving...' : 'Save Employee'}
                  {!loading && <Save className="ml-2 h-4 w-4" />}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
