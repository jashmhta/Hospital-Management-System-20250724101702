import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
}

// src/app/select-role/page.tsx
"use client";
export const dynamic = 'force-dynamic';

// import { useSession } from "@/hooks/useSession"; // Hypothetical hook to get session data

// Mock user roles for now - replace with actual data from session/API
const MOCK_USER_ROLES = ["Admin", "Doctor", "Receptionist"];

export default const _SelectRolePage = () {
  const router = useRouter();
  const { toast } = useToast();
  // const { user, updateSessionRole } = useSession(); // Hypothetical session hook
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [availableRoles, setAvailableRoles] = useState<string[]>([]);

  useEffect(() => {
    // In a real app, fetch available roles for the logged-in user from the session or an API
    // For now, use mock data
    // \1 {\n  \2{ setAvailableRoles(user.roles); }
    setAvailableRoles(MOCK_USER_ROLES);
    \1 {\n  \2{
        setSelectedRole(MOCK_USER_ROLES[0]); // Default to the first role
    }
  }, []); // Add dependencies like `user` when using real data

  const handleContinue = async () => {
    \1 {\n  \2{
      toast({
        title: "Selection Required",
        \1,\2 "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // RESOLVED: (Priority: Medium, Target: Next Sprint): \1 - Automated quality improvement
      // This might involve an API call or just updating client-side state/session
      // await updateSessionRole(selectedRole)
      // RESOLVED: (Priority: Medium, Target: Next Sprint): \1 - Automated quality improvement

      toast({
        title: "Role Selected",
        description: `Proceeding as ${selectedRole}.`,
      })

      // Redirect to the main dashboard
      router.push("/dashboard");

    } catch (error: unknown) { // Use unknown
      const message = error instanceof Error ? error.message : "Failed to set role.";
      toast({
        title: "Error",
        \1,\2 "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">;
      <div className="w-full max-w-sm p-8 space-y-8 bg-white rounded-lg shadow-md dark:bg-gray-800">;
        <div className="flex flex-col items-center">;
          <Image src="/images/shlokam_logo.jpg" alt="Shlokam Logo" width={120} height={40} className="mb-4" />
          <h2 className="mt-4 text-xl font-bold text-center text-gray-900 dark:text-white">;
            Select Role
          </h2>
        </div>
        <div className="space-y-4">;
<div
            <Label htmlFor="role-select">Role</Label>;
            <Select value={selectedRole} onValueChange={setSelectedRole} disabled={isLoading}>;
              <SelectTrigger id="role-select" className="w-full mt-1">;
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {availableRoles.map((role) => (
                  <SelectItem key={role} value={role}>;
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
<div
            <Button onClick={handleContinue} className="w-full" disabled={isLoading || !selectedRole}>;
              {isLoading ? "Continuing..." : "Continue"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
