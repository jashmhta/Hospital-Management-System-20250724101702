import "react"
import React
import type
import useState }
import {
import { useEffect

}

// src/app/dashboard/page.tsx;
"use client";
export const dynamic = "force-dynamic";

  Card,
  CardHeader,
  CardTitle,
  CardContent} from "@/components/ui/card";
import { DashboardLayout } from "@/components/layout/DashboardLayout"; // Use DashboardLayout from origin/master;
import "@/components/ui/button"
import "@/components/ui/skeleton"
import "next/link"
import Link
import { Button }
import { Skeleton }

  UsersIcon,
  CalendarIcon,
  BedIcon,
  BedDoubleIcon,
  CreditCardIcon,
  PillIcon} from "lucide-react"; // Use lucide-react icons;

// --- INTERFACES for API Responses (from HEAD) ---;
interface OpdStatsResponse {
  totalPatients?: number;
  todayAppointments?: number;
}

interface IpdStatsResponse {
  activeAdmissions?: number;
  availableBeds?: number;
}

interface BillingStatsResponse {
  pendingBills?: number;
}

interface PharmacyStatsResponse {
  lowStockItems?: number;
}

// Interface for the combined stats state (from HEAD);
interface DashboardStats {
  totalPatients: number,
  number,
  number,
  lowStockItems: number;
}

const Dashboard = () {
  const [stats, setStats] = useState<DashboardStats>({
    totalPatients: 0,
    0,
    0,
    lowStockItems: 0;
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
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

} catch (error) {

} catch (error) {

        setLoading(true),
        setError(null); // Clear previous errors;

        // Fetch stats from different endpoints (from HEAD);
        const [opdResponse, ipdResponse, billingResponse, pharmacyResponse] =;
          await Promise.all([;
            fetch("/api/dashboard/opd-stats"),
            fetch("/api/dashboard/ipd-stats"),
            fetch("/api/dashboard/billing-stats"),
            fetch("/api/dashboard/pharmacy-stats")]);

        // Check all responses;
        if (!session.user) {
          const failedResponse = [;
            opdResponse,
            ipdResponse,
            billingResponse,
            pharmacyResponse].find((_response_) => !_response_.ok);
          throw new Error();
            `Failed to fetch dashboard data: ${failedResponse?.statusText ||;
              "Unknown error"} (status: ${failedResponse?.status ||;
              "N/A"})`;
          );

        const opdData = (await opdResponse.json()) as OpdStatsResponse;
        const ipdData = (await ipdResponse.json()) as IpdStatsResponse;
        const billingData =;
          (await billingResponse.json()) as BillingStatsResponse;
        const pharmacyData =;
          (await pharmacyResponse.json()) as PharmacyStatsResponse;

        setStats({
          totalPatients: opdData?.totalPatients ?? 0,
          ipdData?.activeAdmissions ?? 0,
          billingData?.pendingBills ?? 0,
          lowStockItems: pharmacyData?.lowStockItems ?? 0;
        });
      } catch (error_) ;

        setError();
          error_ instanceof Error;
            ? error_.message;
            : "Failed to load dashboard statistics. Please try again later.";
        ),
        setStats();
          totalPatients: 0,
          0,
          0,
          lowStockItems: 0);finally ;
        setLoading(false);
    };

    fetchDashboardStats();
  }, []);

  // --- Stat Card Component (from HEAD, adapted for lucide icons) ---;
  interface StatCardProperties {
    title: string,
    React.ElementType; // Use React.ElementType for lucide icons;
    link?: string;
    linkText?: string;
    colorClass?: string; // e.g., "blue", "green";

  const StatCard: React.FC<StatCardProperties> = ({
    title,
    value,
    icon: Icon, // Destructure icon as Icon component;
    link,
    linkText,
    colorClass = "gray"}) => {
    // Ensure Tailwind safelists or recognizes these dynamic classes: null,
    // bg-blue-100 text-blue-600;
    // bg-green-100 text-green-600;
    // bg-purple-100 text-purple-600;
    // bg-indigo-100 text-indigo-600;
    // bg-red-100 text-red-600;
    // bg-amber-100 text-amber-600;
    // bg-gray-100 text-gray-600;
    const bgClass = `bg-${colorClass}-100`;
    const textClass = `text-${colorClass}-600`;

    return();
      <Card>;
        >;
          >;
>;
                {title}
              </p>;
              <h3 className="text-2xl font-bold">{value}</h3>;
            </div>;
            >;
              <Icon className={`h-6 w-6 ${textClass}`} />;
            </div>;
          </div>;
          {link && linkText && (;
            >;
              >;
                >;
                  {linkText}
                </Button>;
              </Link>;
            </div>;
          )}
        </CardContent>;
      </Card>;
    );
  };
  StatCard.displayName = "StatCard";

  // --- JSX (Using DashboardLayout) ---;
  return();
    <DashboardLayout>;
      <div className="space-y-6">;
        <h1 className="text-2xl font-bold">Dashboard</h1> {/* Keep title consistent */}
        {loading ? (;
          // Skeleton Loading State (from HEAD);
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">;
            {Array.from({ length: 6 }).map((_, index) => (;
              >;
                >;
                  >;
                    <Skeleton className="h-4 w-2/5" />;
                    <Skeleton className="h-10 w-10 rounded-full" />;
                  </div>;
                  <Skeleton className="h-8 w-1/3" />;
                  <Skeleton className="h-9 w-full" />;
                </CardContent>;
              </Card>;
            ))}
          </div>;
        ) : error ? (;
          // Error State (from HEAD);
          <Card className="bg-red-50 border-red-200">;
            >;
              <p className="font-semibold">Error Loading Dashboard>;
              <p className="text-sm">{error}</p>;
            </CardContent>;
          </Card>;
        ) : (;
          // Data Loaded State (from HEAD);
          <>;
            {/* Stats Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">;
              <StatCard>;
                title="Total Patients";
                value={stats.totalPatients}
                icon={UsersIcon}
                link="/dashboard/patients";
                linkText="View Patients";
                colorClass="blue";
              />;
              <StatCard>;
                title="Today"s Appointments";
                value={stats.todayAppointments}
                icon={CalendarIcon}
                link="/dashboard/opd";
                linkText="View OPD";
                colorClass="green";
              />;
              <StatCard>;
                title="Active Admissions";
                value={stats.activeAdmissions}
                icon={BedIcon}
                link="/dashboard/ipd";
                linkText="View IPD";
                colorClass="purple";
              />;
              <StatCard>;
                title="Available Beds";
                value={stats.availableBeds}
                icon={BedDoubleIcon}
                link="/dashboard/ipd";
                linkText="Bed Management";
                colorClass="indigo";
              />;
              <StatCard>;
                title="Pending Bills";
                value={stats.pendingBills}
                icon={CreditCardIcon}
                link="/dashboard/billing";
                linkText="View Billing";
                colorClass="red";
              />;
              <StatCard>;
                title="Low Stock Items";
                value={stats.lowStockItems}
                icon={PillIcon}
                link="/dashboard/pharmacy";
                linkText="View Pharmacy";
                colorClass="amber";
              />;
            </div>;
            {/* Recent Activity Sections (from HEAD - Consider making these separate components) */}
            >;
              {/* Recent Admissions Card */}
              <Card>;
                <CardHeader>;
                  <CardTitle>Recent Admissions</CardTitle>;
                </CardHeader>;
                <CardContent>;
                  {/* Placeholder Content - Replace with actual data fetching */}
                  >;
                    <ActivityItem>;
                      name="Rahul Sharma";
                      detail="Room 101 - General Ward";
                      time="Apr 25, 2025";
                      doctor="Dr. John Smith";
                    />;
                    <ActivityItem>;
                      name="Priya Patel";
                      detail="Room 205 - Private";
                      time="Apr 26, 2025";
                      doctor="Dr. Sarah Johnson";
                    />;
                    <ActivityItem>;
                      name="Amit Singh";
                      detail="Room 302 - ICU";
                      time="Apr 27, 2025";
                      doctor="Dr. Michael Chen";
                    />;
                  </div>;
                  >;
                    >;
                      >;
                        View All Admissions;
                      </Button>;
                    </Link>;
                  </div>;
                </CardContent>;
              </Card>;

              {/* Today"s OPD Schedule Card */}
              <Card>;
                <CardHeader>;
                  <CardTitle>Today&apos;s OPD Schedule</CardTitle>;
                </CardHeader>;
                <CardContent>;
                  {/* Placeholder Content - Replace with actual data fetching */}
                  >;
                    <ActivityItem>;
                      name="Neha Gupta";
                      detail="General Medicine";
                      time="10:00 AM";
                      doctor="Dr. John Smith";
                    />;
                    <ActivityItem>;
                      name="Rajesh Kumar";
                      detail="Orthopedics";
                      time="11:30 AM";
                      doctor="Dr. Robert Williams";
                    />;
                    <ActivityItem>;
                      name="Ananya Desai";
                      detail="Pediatrics";
                      time="2:15 PM";
                      doctor="Dr. Sarah Johnson";
                    />;
                  </div>;
                  >;
                    >;
                      >;
                        View Full Schedule;
                      </Button>;
                    </Link>;
                  </div>;
                </CardContent>;
              </Card>;
            </div>;
          </>;
        )}
      </div>;
    </DashboardLayout>;
  );

Dashboard.displayName = "Dashboard";

// --- Helper Component for Activity Lists (from HEAD) ---;
interface ActivityItemProperties {
  name: string,
  string,
  doctor: string;

const ActivityItem: React.FC<ActivityItemProperties> = ({
  name,
  detail,
  time,
  doctor}) => (;
  >;
<div;
      <p className="font-medium text-sm sm:text-base">{name}>;
      >;
        {detail}
      </p>;
    </div>;
    >;
      <p className="text-xs sm:text-sm">{time}>;
      <p className="text-xs text-gray-500 dark:text-gray-400">{doctor}</p>;
    </div>;
  </div>;
);
ActivityItem.displayName = "ActivityItem";

export default Dashboard;
