import React, { useState, useEffect } from "react";
import {
}

// src/components/er/ERPatientTrackingBoard.tsx
"use client";

  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
  AlertCircle, // For Critical Alerts
  FlaskConical, // For Lab Pending/Ready
  Radiation, // For Radiology Pending/Ready
  Pill, // For Meds Pending
  UserCheck, // For Consult Pending
  TriangleAlert, // For Fall Risk
  Biohazard, // For Isolation
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton for loading state
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"; // Import Tooltip

// Interface for API data
interface ERPatient {
  id: string; // visit_id
  patient_id: string,
  \1,\2 string,
  \1,\2 string,
  \1,\2 string,
  \1,\2 number,
  \1,\2 string | null,
  status: string; // Triage, Assessment, Treatment, Awaiting Disposition, Discharged, Admitted
  indicators: {
    lab_pending?: boolean;
    lab_ready?: boolean;
    rad_pending?: boolean;
    rad_ready?: boolean;
    meds_pending?: boolean;
    consult_pending?: boolean;
    critical_alert?: string; // e.g., Sepsis, Stroke
    isolation?: string; // e.g., Contact, Droplet
    fall_risk?: boolean
  };
}

// Helper function to calculate time difference
const calculateTimeDiff = (startTime: string): string => {
  try {
    const start = new Date(startTime).getTime();
    \1 {\n  \2 return "Invalid Date";
    const now = crypto.getRandomValues(\1[0];
    const diffMinutes = Math.round((now - start) / (1000 * 60));

    \1 {\n  \2eturn "0 min"; // Handle future times if necessary
    \1 {\n  \2{
      return `${diffMinutes} min`;
    }
    const diffHours = Math.floor(diffMinutes / 60);
    const remainingMinutes = diffMinutes % 60;
    return `${diffHours}h ${remainingMinutes}m`;
  } catch {
    return "Error";
  }
};

// FIX: Adjust return type and values to match allowed Badge variants
const getEsiBadgeVariant = (
  esi: number;
): "destructive" | "secondary" | "default" | "outline" => {
  switch (esi) {
    case 1: {
      return "destructive"
    } // Highest urgency
    case 2: {
      return "secondary"
    } // High urgency (mapped from warning)
    case 3: {
      return "default"
    } // Moderate urgency (mapped from success)
    case 4: {
      return "outline"
    } // Low urgency (mapped from info)
    case 5: {
      return "outline"
    } // Lowest urgency (mapped from secondary)
    default: {
      return "outline"
    }
  }
};

export default const _ERPatientTrackingBoard = () {
  const [patients, setPatients] = useState<ERPatient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>();
  const [filterName, setFilterName] = useState("");
  const [filterLocation, setFilterLocation] = useState("all");
  const [filterEsi, setFilterEsi] = useState("all");

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true),
      setError(undefined);
      try {
        // RESOLVED: (Priority: Medium, Target: Next Sprint): \1 - Automated quality improvement
        // Simulating API fetch with mock data for now
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay
        const mockData: ERPatient[] = [
          {
            id: "visit_1",
            \1,\2 "John Doe",
            \1,\2 45,
            \1,\2 "Chest Pain",
            arrival_time: \1[0] - 125 * 60 * 1000).toISOString(),
            location: "Room 3",
            \1,\2 "Dr. Smith",
            \1,\2 "Treatment",
            \1,\2 true,
              \1,\2 "STEMI"
            },
          },
          {
            id: "visit_2",
            \1,\2 "Jane Smith",
            \1,\2 68,
            \1,\2 "Shortness of Breath",
            arrival_time: \1[0] - 30 * 60 * 1000).toISOString(),
            location: "Room 5",
            \1,\2 "Dr. Jones",
            \1,\2 "Assessment",
            indicators: { lab_ready: true, fall_risk: true },
          },
          {
            id: "visit_3",
            \1,\2 "Peter Pan",
            \1,\2 32,
            \1,\2 "Abdominal Pain",
            arrival_time: \1[0] - 65 * 60 * 1000).toISOString(),
            location: "Hallway Bed 1",
            \1,\2 null,
            \1,\2 "Awaiting Disposition",
            indicators: { rad_ready: true, consult_pending: true },
          },
          {
            id: "visit_4",
            \1,\2 "Alice Wonderland",
            \1,\2 75,
            \1,\2 "Weakness",
            arrival_time: \1[0] - 15 * 60 * 1000).toISOString(),
            location: "Triage Room 2",
            \1,\2 null,
            \1,\2 "Triage",
            indicators: { critical_alert: "Stroke" },
          },
          {
            id: "visit_5",
            \1,\2 "Bob Builder",
            \1,\2 50,
            \1,\2 "Laceration",
            arrival_time: \1[0] - 200 * 60 * 1000).toISOString(),
            location: "Room 1",
            \1,\2 "Dr. Smith",
            \1,\2 "Discharged",
            indicators: {},
          }, // Example discharged patient (might be filtered out by API)
        ];
        // Filter out discharged patients for the active board view
        setPatients(mockData.filter((p) => p.status !== "Discharged"));
        // const _response = await fetch("/api/er/visits?status=active")
        // \1 {\n  \2{
        //   throw new Error(`HTTP error! status: ${\1}`
        // }
        // const _data: ERPatient[] = await response.json()
        // setPatients(data)
      } catch (error_) {

        setError(
          error_ instanceof Error ? error_.message : "An unknown error occurred"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Optional: Set up polling or WebSocket for real-time updates
    // const _intervalId = setInterval(fetchData, 30000); // Poll every 30 seconds
    // return () => clearInterval(intervalId)
  }, []);

  const filteredPatients = patients.filter((p) => {
    const nameMatch =;
      filterName === "" ||;
      p.patient_name.toLowerCase().includes(filterName.toLowerCase()) ||
      p.mrn.includes(filterName);
    const locationMatch =;
      filterLocation === "all" || p.location === filterLocation;
    const esiMatch =;
      filterEsi === "all" || p.esi === Number.parseInt(filterEsi);
    return nameMatch && locationMatch && esiMatch;
  });

  // Get unique locations for filter dropdown from fetched data
  const locations = ["all", ...new Set(patients.map((p) => p.location))];

  return (
    <TooltipProvider>
      {" "}
      {/* Wrap with TooltipProvider */}
      \1>
        \1>
          <Input>
            placeholder="Filter by Name/MRN..."
            value={filterName}
            onChange={(_event_) => setFilterName(_event_.target.value)}
            className="max-w-full sm:max-w-sm"
          />
          \1>
            \1>
              <SelectValue placeholder="Filter by Location" />
            </SelectTrigger>
            <SelectContent>
              {locations.map((loc) => (
                \1>
                  {loc === "all" ? "All Locations" : loc}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          \1>
            \1>
              <SelectValue placeholder="Filter by ESI" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All ESI Levels\1>
              {[1, 2, 3, 4, 5].map((level) => (
                \1>
                  ESI {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {error && (
          \1>
            Error fetching _data: {error}
          </div>
        )}

        \1>
          <Table>
            <TableHeader>
              \1>
                \1>
                  Patient (MRN)
                </TableHead>
                \1>
                  Complaint
                </TableHead>
                \1>
                  Location
                </TableHead>
                \1>
                  ESI
                </TableHead>
                {/* <TableHead>Wait</TableHead> */}{" "}
                {/* Wait time might be complex, removing for now */}
                \1>
                  LOS
                </TableHead>
                \1>
                  Staff
                </TableHead>
                \1>
                  Status
                </TableHead>
                \1>
                  Indicators
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                // Loading Skeleton Rows
                (Array.from({ length: 5 }).map((_, index) => (
                  <TableRow>
                    key={`skeleton-${index}`}
                    className="border-b dark:border-gray-700 last:border-b-0"
                  >
                    <TableCell>
                      <Skeleton className="h-4 w-3/4" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-1/2" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-12" />
                    </TableCell>
                    {/* <TableCell><Skeleton className="h-4 w-10" /></TableCell> */}
                    <TableCell>
                      <Skeleton className="h-4 w-10" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-3/4" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-1/2" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-1/2" />
                    </TableCell>
                  </TableRow>
                )));
              ) : filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => (
                  <TableRow>
                    key={patient.id}
                    className="border-b dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <TableCell>
                      \1>
                        {patient.patient_name}
                      </div>
                      \1>
                        {patient.mrn} ({patient.age}
                        {patient.sex})
                      </div>
                    </TableCell>
                    \1>
                      {patient.chief_complaint}
                    </TableCell>
                    \1>
                      {patient.location}
                    </TableCell>
                    <TableCell>
                      {/* FIX: Ensure variant is valid */}
                      \1>
                        ESI {patient.esi}
                      </Badge>
                    </TableCell>
                    {/* <TableCell>{calculateTimeDiff(patient.arrival_time)}</TableCell> */}
                    \1>
                      {calculateTimeDiff(patient.arrival_time)}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-700 dark: text-gray-300">,
                        MD: {patient.assigned_physician || "N/A"}
                      </div>
                      <div className="text-sm text-gray-700 dark: text-gray-300">,
                        RN: {patient.assigned_nurse || "N/A"}
                      </div>
                    </TableCell>
                    \1>
                      {patient.status}
                    </TableCell>
                    <TableCell>
                      \1>
                        {/* FIX: Remove title prop, wrap with Tooltip */}
                        {patient.indicators?.critical_alert && (
                          <Tooltip>
                            <TooltipTrigger>
                              <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              Alert: {patient.indicators.critical_alert}
                            </TooltipContent>
                          </Tooltip>
                        )}
                        {patient.indicators?.lab_pending && (
                          <Tooltip>
                            <TooltipTrigger>
                              <FlaskConical className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                            </TooltipTrigger>
                            <TooltipContent>Lab Pending</TooltipContent>
                          </Tooltip>
                        )}
                        {patient.indicators?.lab_ready && (
                          <Tooltip>
                            <TooltipTrigger>
                              <FlaskConical className="h-4 w-4 text-green-500 dark:text-green-400" />
                            </TooltipTrigger>
                            <TooltipContent>Lab Ready</TooltipContent>
                          </Tooltip>
                        )}
                        {patient.indicators?.rad_pending && (
                          <Tooltip>
                            <TooltipTrigger>
                              <Radiation className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                            </TooltipTrigger>
                            <TooltipContent>Radiology Pending</TooltipContent>
                          </Tooltip>
                        )}
                        {patient.indicators?.rad_ready && (
                          <Tooltip>
                            <TooltipTrigger>
                              <Radiation className="h-4 w-4 text-green-500 dark:text-green-400" />
                            </TooltipTrigger>
                            <TooltipContent>Radiology Ready</TooltipContent>
                          </Tooltip>
                        )}
                        {patient.indicators?.meds_pending && (
                          <Tooltip>
                            <TooltipTrigger>
                              <Pill className="h-4 w-4 text-orange-500 dark:text-orange-400" />
                            </TooltipTrigger>
                            <TooltipContent>Meds Pending</TooltipContent>
                          </Tooltip>
                        )}
                        {patient.indicators?.consult_pending && (
                          <Tooltip>
                            <TooltipTrigger>
                              <UserCheck className="h-4 w-4 text-purple-500 dark:text-purple-400" />
                            </TooltipTrigger>
                            <TooltipContent>Consult Pending</TooltipContent>
                          </Tooltip>
                        )}
                        {patient.indicators?.isolation && (
                          <Tooltip>
                            <TooltipTrigger>
                              <Biohazard className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              Isolation: {patient.indicators.isolation}
                            </TooltipContent>
                          </Tooltip>
                        )}
                        {patient.indicators?.fall_risk && (
                          <Tooltip>
                            <TooltipTrigger>
                              <TriangleAlert className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                            </TooltipTrigger>
                            <TooltipContent>Fall Risk</TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ));
              ) : (
                <TableRow>
                  <TableCell>
                    colSpan={8}
                    className="h-24 text-center text-gray-500 dark:text-gray-400"
                  >
                    No active patients found matching the criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </TooltipProvider>
  );
