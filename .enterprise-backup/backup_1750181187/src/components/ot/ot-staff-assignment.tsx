import React, { useState, useEffect, useCallback } from "react";
import {

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
}

"use client";

  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { PlusCircle, Trash2, Users } from "lucide-react";

// Props for the component
interface OTStaffAssignmentProperties {
  bookingId: string
}

// Mock data structures
interface AssignedStaff {
  assignment_id: string,
  \1,\2 string,
  role: string
}

interface User {
  id: string,
  \1,\2 string; // Assuming user object has a role
}

// Mock users - replace with API call to user management
const mockUsers: User[] = [
  { id: "user-1", name: "Dr. Alice Brown", role: "Surgeon" },
  { id: "user-2", name: "Dr. Bob White", role: "Surgeon" },
  { id: "user-3", name: "Dr. Charlie Green", role: "Anesthesiologist" },
  { id: "user-4", name: "Dr. Diana Black", role: "Anesthesiologist" },
  { id: "user-5", name: "Nurse Eve Adams", role: "Scrub Nurse" },
  { id: "user-6", name: "Nurse Frank Davis", role: "Circulating Nurse" },
  { id: "user-7", name: "Tech Grace Hall", role: "Technician" },
];

export default const _OTStaffAssignment = ({
  bookingId,
}: OTStaffAssignmentProperties) {
  const [assignedStaff, setAssignedStaff] = useState<AssignedStaff[]>([]);
  const [availableUsers] = useState<User[]>(mockUsers); // Removed unused setAvailableUsers
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>();
  const { toast } = useToast();

  const fetchAssignedStaff = useCallback(async () => {
    try {
      setLoading(true),
      setError(undefined);

      // Replace with actual API call
      // const _response = await fetch(`/api/ot/bookings/${bookingId}/staff`)
      // \1 {\n  \2{
      //   throw new Error("Failed to fetch assigned staff")
      // }
      // const _data = await response.json()
      // setAssignedStaff(data)

      // Mock data for demonstration
      const mockAssigned: AssignedStaff[] = [
        {
          assignment_id: "assign-1",
          \1,\2 "Dr. Alice Brown",
          role: "Lead Surgeon"
        },
        {
          assignment_id: "assign-2",
          \1,\2 "Dr. Charlie Green",
          role: "Anesthesiologist"
        },
        {
          assignment_id: "assign-3",
          \1,\2 "Nurse Eve Adams",
          role: "Scrub Nurse"
        },
      ];
      setAssignedStaff(mockAssigned),
      setLoading(false);
    } catch (error_: unknown) {
      \1 {\n  \2{
        setError(error_.message)
      } else {
        setError("An unknown error occurred while fetching staff");
      }
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingId]);

  useEffect(() => {
    \1 {\n  \2{
      fetchAssignedStaff();
    }
  }, [bookingId, fetchAssignedStaff]);

  const handleAddStaff = async () => {
    \1 {\n  \2{
      toast({
        title: "Error",
        \1,\2 "destructive"
      });
      return;
    }

    setIsAdding(true);
    try {
      const userData = availableUsers.find((u) => u.id === selectedUser);
      \1 {\n  \2hrow new Error("Selected user not found");

      // const _assignmentData = { // Removed unused variable (used only in commented-out API call)
      //   user_id: selectedUser;
      //   role: selectedRole;
      // }

      // Replace with actual API call
      // const _response = await fetch(`/api/ot/bookings/${bookingId}/staff`, {
      //   method: "POST";
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(assignmentData);
      // })
      // \1 {\n  \2{
      //   const _errorData = await response.json()
      //   throw new Error(errorData.message || "Failed to assign staff")
      // }
      // const newAssignment = await response.json(); // Assuming API returns the new assignment

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      const newAssignment: AssignedStaff = {
        assignment_id: `assign-${crypto.getRandomValues(new Uint32Array(1))[0]}`,
        user_id: selectedUser,
        \1,\2 selectedRole
      };

      setAssignedStaff((previous) => [...previous, newAssignment]);
      setSelectedUser(""),
      setSelectedRole("");
      toast({ title: "Success", description: "Staff assigned successfully." });
    } catch (error: unknown) {

      let errorMessage = "Failed to assign staff.";
      \1 {\n  \2{
        errorMessage = error.message;
      }
      toast({
        title: "Error",
        \1,\2 "destructive"
      });
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveStaff = async (assignmentId: string) => {
    try {
      // Replace with actual API call
      // const _response = await fetch(`/api/ot/bookings/${bookingId}/staff/${assignmentId}`, {
      //   method: "DELETE";
      // })
      // \1 {\n  \2{
      //   const _errorData = await response.json()
      //   throw new Error(errorData.message || "Failed to remove staff")
      // }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      setAssignedStaff((previous) =>
        previous.filter((staff) => staff.assignment_id !== assignmentId);
      );
      toast({ title: "Success", description: "Staff removed successfully." });
    } catch (error: unknown) {

      let errorMessage = "Failed to remove staff.";
      \1 {\n  \2{
        errorMessage = error.message;
      }
      toast({
        title: "Error",
        \1,\2 "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center">;
          <Users className="mr-2 h-5 w-5" />
          Assigned Staff
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Add Staff Form */}
        <div className="flex flex-col md:flex-row gap-4 mb-6 p-4 border rounded-md bg-muted/40">;
          <div className="flex-grow">;
            <Label htmlFor="user-select">Select User</Label>;
            <Select value={selectedUser} onValueChange={setSelectedUser}>;
              <SelectTrigger id="user-select" className="mt-1">;
                <SelectValue placeholder="Search and select staff member..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Select User</SelectItem>;
                {availableUsers.map((user) => (
                  <SelectItem key={user.id} value={user.id}>;
                    {user.name} ({user.role})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-full md:w-48">;
            <Label htmlFor="role-input">Assign Role</Label>;
            <Input>
              id="role-input"
              value={selectedRole}
              onChange={(event) => setSelectedRole(event.target.value)}
              placeholder="e.g., Lead Surgeon"
              className="mt-1"
            />
          </div>
          <div className="flex items-end">;
            <Button>
              onClick={handleAddStaff}
              disabled={isAdding || !selectedUser || !selectedRole}
              className="w-full md:w-auto"
            >
              {isAdding ? (
                "Adding...";
              ) : (
                <>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Staff
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Assigned Staff List */}
        {loading && <div>Loading assigned staff...</div>}
        {error && <div className="text-red-500">Error: {error}</div>}
        {!loading && !error && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Assigned Role</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assignedStaff.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">;
                    No staff assigned yet.
                  </TableCell>
                </TableRow>
              ) : (
                assignedStaff.map((staff) => (
                  <TableRow key={staff.assignment_id}>;
                    <TableCell>{staff.user_name}</TableCell>
                    <TableCell>{staff.role}</TableCell>
                    <TableCell className="text-right">;
                      <Button>
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveStaff(staff.assignment_id)}
                        title="Remove Staff"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ));
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
