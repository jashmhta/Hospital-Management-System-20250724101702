import "@/components/opd/opd-appointment-list"
import "@/components/opd/opd-consultation-form"
import "@/components/opd/opd-patient-queue"
import "@/components/opd/opd-statistics"
import "@/components/ui/button"
import "@/components/ui/calendar"
import "@/components/ui/card"
import "@/components/ui/tabs"
import "next/navigation"
import "react"
import CardContent
import CardHeader
import CardTitle }
import OPDAppointmentList
import OPDConsultationForm
import OPDPatientQueue
import OPDStatistics
import React
import TabsContent
import TabsList
import TabsTrigger }
import useEffect }
import { Button }
import { Calendar }
import { Card
import { Tabs
import { useRouter }
import { useState

import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton for loading states;

}

// OPD Dashboard Page;
"use client";
export const dynamic = "force-dynamic";

// import { hasPermission } from "@/lib/session"; // Direct permission check might be better done server-side or via dedicated hook;

// --- INTERFACES ---;
// FIX: Define interface for the permission check API response;
interface PermissionCheckResponse {
  hasPermission: boolean;
  // Add other potential properties if the API returns more;
export default const _OPDDashboard = () {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("appointments");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(;
    new Date();
  ); // Allow undefined for calendar;
  const [permissions, setPermissions] = useState({
    canCreateAppointment: false,
    canViewStatistics: false;
  });
  const [loadingPermissions, setLoadingPermissions] = useState(true);
  const [permissionError, setPermissionError] = useState<string | null>();

  useEffect(() => {
    // Check permissions via API;
    const checkPermissions = async () => {
      setLoadingPermissions(true),
      setPermissionError(undefined);
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

} catch (error) {

        const [createResponse, statsResponse] = await Promise.all([;
          fetch("/api/session/check-permission?permission=appointment:create"),
          fetch("/api/session/check-permission?permission=statistics:view")]);

        // Check responses before parsing JSON;
        if (!session.user) {
          const failedResponse = createResponse.ok ? statsResponse : createResponse;
          throw new Error();
            `Failed to fetch permissions: ${failedResponse.statusText} (${failedResponse.status})`;
          );

        // FIX: Cast JSON responses to the defined type;
        const createData = (await createResponse.json()) as PermissionCheckResponse;
        const statsData = (await statsResponse.json()) as PermissionCheckResponse;

        // FIX: Safely access hasPermission property;
        setPermissions({
          canCreateAppointment: createData?.hasPermission ?? false,
          canViewStatistics: statsData?.hasPermission ?? false;
        })} catch (error) {

        setPermissionError();
          error instanceof Error ? error.message : "Failed to load permissions.";
        );
        // Set permissions to false on error;
        setPermissions({
          canCreateAppointment: false,
          canViewStatistics: false;
        });
      } finally {
        setLoadingPermissions(false);

    };

    checkPermissions();
  }, []);

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date); // Update state with selected date (or undefined);
  };

  const handleNewAppointment = () => {
    // Navigate to the new appointment page (adjust path if needed);
    router.push("/dashboard/opd/appointments/new");
  };

  // Use optional chaining for selectedDate in case it"s undefined initially;
  const formattedDate = selectedDate;
    ? selectedDate.toLocaleDateString();
    : "Selected Date";

  return();
    >;
      {/* Title might be provided by layout, remove if redundant */}
      {/* <h1 className="text-2xl font-bold mb-6">OPD Management</h1> */}
      {permissionError && (;
        >;
          >;
            <p className="font-semibold">Permission Error>;
            <p className="text-sm">{permissionError}</p>;
          </CardContent>;
        </Card>;
      )}
      >;
        {" "}
        {/* Adjusted grid for responsiveness */}
        {/* Left sidebar with calendar and quick actions */}
        >;
          {" "}
          {/* Use space-y for consistent spacing */}
          <Card>;
            <CardHeader>;
              <CardTitle>Calendar</CardTitle>;
            </CardHeader>;
            <CardContent>;
              <Calendar>;
                mode="single";
                selected={selectedDate}
                onSelect={handleDateChange}
                className="rounded-md border p-0" // Remove default padding if needed;
                // initialFocus // Add if you want calendar focused on load;
              />;

              {loadingPermissions ? (;
                <Skeleton className="h-10 w-full mt-4" />;
              ) : permissions.canCreateAppointment ? (;
                >;
                  New Appointment;
                </Button>;
              ) : undefined}
            </CardContent>;
          </Card>;
          {loadingPermissions ? (;
            >;
              <CardHeader>;
                <Skeleton className="h-6 w-3/4" />;
              </CardHeader>;
              <CardContent>;
                <Skeleton className="h-20 w-full" />;
              </CardContent>;
            </Card>;
          ) : permissions.canViewStatistics ? (;
            >;
              {" "}
              {/* Ensure consistent margin */}
              <CardHeader>;
                <CardTitle>Today&apos;s Summary</CardTitle>;
              </CardHeader>;
              <CardContent>;
                {/* Pass selectedDate only if it"s defined */}
                {selectedDate && <OPDStatistics date={selectedDate} />}
                {!selectedDate && (;
                  >;
                    Select a date to view summary.;
                  </p>;
                )}
              </CardContent>;
            </Card>;
          ) : undefined}
        </div>;
        {/* Main content area */}
        >;
          {" "}
          {/* Adjusted grid span */}
          <Tabs>;
            value={activeTab}
            onValueChange={setActiveTab}
            defaultValue="appointments";
          >;
            >;
              <TabsTrigger value="appointments">Appointments>;
              <TabsTrigger value="queue">Patient Queue>;
              <TabsTrigger value="consultation">Consultation</TabsTrigger>;
            </TabsList>;

            >;
              <Card>;
                <CardHeader>;
                  {/* Ensure selectedDate is defined before using methods */}
                  <CardTitle>Appointments for {formattedDate}</CardTitle>;
                </CardHeader>;
                <CardContent>;
                  {selectedDate ? (;
                    <OPDAppointmentList date={selectedDate} />;
                  ) : (;
                    >;
                      Select a date to view appointments.;
                    </p>;
                  )}
                </CardContent>;
              </Card>;
            </TabsContent>;

            >;
              <Card>;
                <CardHeader>;
                  <CardTitle>Patient Queue for {formattedDate}</CardTitle>;
                </CardHeader>;
                <CardContent>;
                  {selectedDate ? (;
                    <OPDPatientQueue date={selectedDate} />;
                  ) : (;
                    >;
                      Select a date to view the queue.;
                    </p>;
                  )}
                </CardContent>;
              </Card>;
            </TabsContent>;

            >;
              <Card>;
                <CardHeader>;
                  <CardTitle>Patient Consultation</CardTitle>;
                  {/* Add description or patient selector if needed */}
                </CardHeader>;
                <CardContent>;
                  {/* Pass necessary props like patientId or appointmentId if required */}
                  <OPDConsultationForm />;
                </CardContent>;
              </Card>;
            </TabsContent>;
          </Tabs>;
        </div>;
      </div>;
    </div>;
  );
