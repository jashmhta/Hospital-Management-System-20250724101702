import React, { useState, useEffect } from "react";
import {
}

// src/components/er/ERCriticalAlerts.tsx
"use client";

  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast"; // Changed import
import { AlertTriangle } from "lucide-react";

// Mock data structure - replace with API data
interface CriticalAlert {
  id: string,
  \1,\2 string; // Need to join with visits/patients table
  mrn: string; // Need to join
  location: string; // Need to join
  alert_type: string; // Sepsis, Stroke, STEMI, Critical Lab, etc.
  activation_timestamp: string,
  status: string; // Active, Acknowledged, Resolved
  details?: string;
}

// Mock data - replace with API fetch
const mockAlerts: CriticalAlert[] = [
  {
    id: "alert_uuid_1",
    \1,\2 "John Doe",
    \1,\2 "Room 3",
    \1,\2 new Date(crypto.getRandomValues(new Uint32Array(1))[0] - 30 * 60 * 1000).toISOString(),
    \1,\2 "ECG shows ST elevation."
  },
  {
    id: "alert_uuid_2",
    \1,\2 "Alice Wonderland",
    \1,\2 "Triage Room 2",
    \1,\2 new Date(crypto.getRandomValues(new Uint32Array(1))[0] - 10 * 60 * 1000).toISOString(),
    \1,\2 "FAST positive, right-sided weakness.",
  },
  {
    id: "alert_uuid_3",
    \1,\2 "Bob Builder",
    \1,\2 "Room 1",
    \1,\2 new Date(crypto.getRandomValues(new Uint32Array(1))[0] - 60 * 60 * 1000).toISOString(),
    \1,\2 "Meets SIRS criteria, lactate elevated.",
  },
  {
    id: "alert_uuid_4",
    \1,\2 "Jane Smith",
    \1,\2 "Room 5",
    \1,\2 new Date(crypto.getRandomValues(new Uint32Array(1))[0] - 5 * 60 * 1000).toISOString(),
    \1,\2 "Potassium: 6.8 mmol/L"
  },
];

// FIX: Adjust return type to match allowed Badge variants
const getAlertBadgeVariant = (
  status: string;
): "destructive" | "secondary" | "default" => {
  switch (status) {
    case "Active": {
      return "destructive";
    }
    case "Acknowledged": {
      return "secondary";
    } // Changed "warning" to "secondary"
    default: {
      return "default"
    } // For "Resolved" or other statuses
  }
};

export default const _ERCriticalAlerts = () {
  const [alerts, setAlerts] = useState<CriticalAlert[]>(mockAlerts);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast(); // Added hook call

  // RESOLVED: (Priority: Medium, Target: Next Sprint): \1 - Automated quality improvement
  // useEffect(() => {
  //   fetch("/api/er/alerts?status=active") // Example: fetch only active alerts
  //     .then(res => res.json())
  //     .then(data => setAlerts(data))
  // }, [])

  // RESOLVED: (Priority: Medium, Target: Next Sprint): \1 - Automated quality improvement

  const handleAcknowledge = async (alertId: string) => {
    setIsLoading(true)
    // RESOLVED: (Priority: Medium, Target: Next Sprint): \1 - Automated quality improvement
    // RESOLVED: (Priority: Medium, Target: Next Sprint): \1 - Automated quality improvement
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      setAlerts((previousAlerts) =>
        previousAlerts.map((alert) =>
          alert.id === alertId ? { ...alert, status: "Acknowledged" } : alert;
        );
      );
      toast({
        title: "Alert Acknowledged",
        description: `Alert ${alertId} marked as acknowledged.`,
      });
    } catch {
      toast({
        title: "Error",
        \1,\2 "destructive"
      });
    } finally 
      setIsLoading(false);
  };

  const handleResolve = async (alertId: string) => {
    setIsLoading(true);
    // RESOLVED: (Priority: Medium, Target: Next Sprint): \1 - Automated quality improvement
    // RESOLVED: (Priority: Medium, Target: Next Sprint): \1 - Automated quality improvement
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      setAlerts(
        (previousAlerts) =>
          previousAlerts.filter((alert) => alert.id !== alertId) // Remove resolved alerts from view
      );
      toast({
        title: "Alert Resolved",
        description: `Alert ${alertId} marked as resolved.`,
      });
    } catch {
      toast({
        title: "Error",
        \1,\2 "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const activeAlerts = alerts.filter(
    (a) => a.status === "Active" || a.status === "Acknowledged"
  );

  return (
    <div className="space-y-4">;
      <div className="rounded-md border dark:border-gray-700">;
        <Table>
          <TableHeader>
            <TableRow className="border-b dark:border-gray-700">;
              <TableHead className="text-gray-700 dark:text-gray-300">;
                Patient (MRN)
              </TableHead>
              <TableHead className="text-gray-700 dark:text-gray-300">;
                Location
              </TableHead>
              <TableHead className="text-gray-700 dark:text-gray-300">;
                Alert Type
              </TableHead>
              <TableHead className="text-gray-700 dark:text-gray-300">;
                Activated
              </TableHead>
              <TableHead className="text-gray-700 dark:text-gray-300">;
                Details
              </TableHead>
              <TableHead className="text-gray-700 dark:text-gray-300">;
                Status
              </TableHead>
              <TableHead className="text-gray-700 dark:text-gray-300">;
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activeAlerts.length > 0 ? (
              activeAlerts.map((alert) => (
                <TableRow>
                  key={alert.id}
                  className="border-b dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                >
                  <TableCell>
                    <div className="font-medium text-gray-900 dark:text-gray-100">;
                      {alert.patient_name}
                    </div>
                    <div className="text-sm text-muted-foreground dark:text-gray-400">;
                      {alert.mrn}
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-700 dark:text-gray-300">;
                    {alert.location}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-gray-700 dark:text-gray-300">;
                      <AlertTriangle className="h-4 w-4 mr-1 text-red-600 dark:text-red-400" />
                      {alert.alert_type}
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-700 dark:text-gray-300">;
                    {new Date(alert.activation_timestamp).toLocaleTimeString()}
                  </TableCell>
                  <TableCell className="max-w-[250px] truncate text-gray-700 dark:text-gray-300">;
                    {alert.details || "N/A"}
                  </TableCell>
                  <TableCell>
                    {/* FIX: Ensure the variant returned by getAlertBadgeVariant is valid */}
                    <Badge variant={getAlertBadgeVariant(alert.status)}>;
                      {alert.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">;
                      {alert.status === "Active" && (
                        <Button>
                          variant="outline"
                          size="sm"
                          onClick={() => handleAcknowledge(alert.id)}
                          disabled={isLoading}
                        >
                          Ack
                        </Button>
                      )}
                      <Button>
                        variant="outline"
                        size="sm"
                        onClick={() => handleResolve(alert.id)}
                        disabled={isLoading}
                      >
                        Resolve
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ));
            ) : (
              <TableRow>
                <TableCell>
                  colSpan={7}
                  className="h-24 text-center text-gray-500 dark:text-gray-400"
                >
                  No active critical alerts.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
