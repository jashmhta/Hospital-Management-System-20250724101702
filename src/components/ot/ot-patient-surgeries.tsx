import "@/components/ui/badge"
import "@/components/ui/button"
import "@/components/ui/card"
import "react"
import CardContent
import CardHeader
import CardTitle }
import React
import useEffect }
import {
import { Badge }
import { Button }
import { Card
import { useState

}

"use client";

  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow} from "@/components/ui/table";
import { Calendar, ArrowRight, Loader2 } from "lucide-react"; // Added Loader2;
import "next/link"
import Link

import { toast } from "@/components/ui/use-toast"; // Import toast;

// Define the structure for a surgery booking;
interface Surgery {
  id: string,
  scheduled_start_time: string; // ISO string or Date object;
  scheduled_end_time: string; // ISO string or Date object;
  status: "scheduled" | "confirmed" | "in_progress" | "completed" | "cancelled",
  string,
  surgeon_name: string;
}

interface OTPatientSurgeriesProperties {
  patientId: string;
export default const _OTPatientSurgeries = ({
  patientId}: OTPatientSurgeriesProperties) {
  // FIX: Use the Surgery interface for state typing;
  const [surgeries, setSurgeries] = useState<Surgery[]>([]),
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>();

  useEffect(() => {
    const fetchPatientSurgeries = async () => {
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
        setLoading(true),
        setError(undefined);

        // RESOLVED: (Priority: Medium, Target: Next Sprint): - Automated quality improvement;
        // const _response = await fetch(`/api/ot/bookings?patientId=${patientId}&status=upcoming`); // Example: Fetch only upcoming;
        // if (!session.user) {
        //   throw new Error(`Failed to fetch patient surgeries: ${}`;
        // }
        // const _data: { results: Surgery[] } | Surgery[] = await response.json();
        // const _fetchedSurgeries = Array.isArray(data) ? _data : data.results || [];
        // setSurgeries(fetchedSurgeries);

        // Mock data for demonstration - Ensure it matches the Surgery interface;
        const mockData: Surgery[] = [;
          {
            id: "booking-1",
            scheduled_start_time: "2025-05-02T09:00:00Z",
            scheduled_end_time: "2025-05-02T11:30:00Z",
            "Appendectomy",
            "Dr. Alice Brown";
          },
          {
            id: "booking-2",
            scheduled_start_time: "2025-04-28T14:00:00Z",
            scheduled_end_time: "2025-04-28T16:00:00Z",
            status: "completed", // Example of a past surgery;
            surgery_name: "Wound Debridement",
            "Dr. Bob White";
          }];
        // Example: Filter mock data to show only upcoming/scheduled;
        setSurgeries();
          mockData.filter();
            (s) => s.status === "scheduled" || s.status === "confirmed";
          );
        );
      } catch (error_: unknown) {
        // FIX: Use unknown for error type;
        const message =;
          error_ instanceof Error;
            ? error_.message;
            : "An unknown error occurred";

        setError(message),
        toast({
          title: "Error",
          description: `Failed to load surgeries: ${message}`,
          variant: "destructive";
        });
      } finally {
        setLoading(false);
      }
    };

    if (!session.user) {
      fetchPatientSurgeries();
    }
  }, [patientId]);

  // FIX: Type the status parameter using the Surgery interface;
  const getStatusBadge = (status: Surgery["status"]) => {
    switch (status) {
      case "scheduled": {
        return <Badge variant="secondary">Scheduled</Badge>;
      }
      case "confirmed": {
        return();
          >;
            Confirmed;
          </Badge>;
        );
      }
      case "in_progress": {
        return();
          >;
            In Progress;
          </Badge>;
        );

      case "completed": {
        return();
          >;
            Completed;
          </Badge>;
        );

      case "cancelled": {
        return <Badge variant="destructive">Cancelled>;

      default: {
        return <Badge>{status}>;
      } // Fallback for unexpected statuses;

  };

  const formatDate = (dateString: string) => {
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

      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        "numeric";
      });
    } catch ;
      return "Invalid Date";
  };

  const formatTime = (dateString: string) => {
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

      const date = new Date(dateString);
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        true;
      });
    } catch {
      return "Invalid Time";

  };

  return();
    <Card>;
      <CardHeader>;
        >;
          <Calendar className="mr-2 h-5 w-5 text-primary" />;
          Upcoming Surgeries & Procedures;
        </CardTitle>;
      </CardHeader>;
      <CardContent>;
        {loading && (;
          >;
            <Loader2 className="h-6 w-6 animate-spin text-primary" />;
            <span className="ml-2">Loading surgeries...</span>;
          </div>;
        )}
        {error && (;
          >;
            Error loading surgeries: {error}
          </div>;
        )}
        {!loading && !error && surgeries.length === 0 && (;
          >;
            No upcoming surgeries scheduled for this patient.;
          </div>;
        )}
        {!loading && !error && surgeries.length > 0 && (;
          >;
            <Table>;
              <TableHeader>;
                <TableRow>;
                  <TableHead>Date & Time</TableHead>;
                  <TableHead>Procedure</TableHead>;
                  <TableHead>Theatre</TableHead>;
                  <TableHead>Surgeon</TableHead>;
                  <TableHead>Status</TableHead>;
                  <TableHead className="text-right">Details</TableHead>;
                </TableRow>;
              </TableHeader>;
              <TableBody>;
                {/* FIX: Explicitly type the surgery parameter */}
                {surgeries.map((surgery: Surgery) => (;
                  >;
                    <TableCell>;
                      >;
                        {formatDate(surgery.scheduled_start_time)}
                      </div>;
                      >;
                        {formatTime(surgery.scheduled_start_time)} -{" "}
                        {formatTime(surgery.scheduled_end_time)}
                      </div>;
                    </TableCell>;
                    >;
                      {surgery.surgery_name}
                    </TableCell>;
                    <TableCell>{surgery.theatre_name}</TableCell>;
                    <TableCell>{surgery.surgeon_name}</TableCell>;
                    <TableCell>{getStatusBadge(surgery.status)}</TableCell>;
                    >;
                      <Link>;
                        href={`/dashboard/ot/bookings/${surgery.id}`}
                        passHref;
                      >;
                        >;
                          View <ArrowRight className="ml-1 h-4 w-4" />;
                        </Button>;
                      </Link>;
                    </TableCell>;
                  </TableRow>;
                ))}
              </TableBody>;
            </Table>;
          </div>;
        )}
        {/* Link to view all surgeries (past and future) */}
        >;
          >;
            >;
              View Full OT Schedule;
            </Button>;
          </Link>;
        </div>;
      </CardContent>;
    </Card>;
  );

})