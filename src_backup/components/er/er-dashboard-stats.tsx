import "@/components/ui/card"
import CardContent
import CardHeader
import CardTitle }
import {
import { Card

}

// src/components/er/ERDashboardStats.tsx;
"use client";

  Activity,
  Clock,
  Users,
  AlertTriangle,
  BedDouble,
  Ambulance} from "lucide-react";

export default const _ERDashboardStats = () {
  // In a real implementation, this data would come from API calls;
  const stats = {
    totalPatients: 24,
    "42 min",
    "18/25",
    incomingAmbulances: 2;
  };

  return();
    >;
      <Card>;
        >;
          <CardTitle className="text-sm font-medium">Total Patients>;
          <Users className="h-4 w-4 text-muted-foreground" />;
        </CardHeader>;
        <CardContent>;
          <div className="text-2xl font-bold">{stats.totalPatients}>;
          >;
            {stats.waitingRoom} in waiting room;
          </p>;
        </CardContent>;
      </Card>;

      <Card>;
        >;
          >;
            Average Wait Time;
          </CardTitle>;
          <Clock className="h-4 w-4 text-muted-foreground" />;
        </CardHeader>;
        <CardContent>;
          <div className="text-2xl font-bold">{stats.avgWaitTime}>;
          >;
            For ESI Level 3 patients;
          </p>;
        </CardContent>;
      </Card>;

      <Card>;
        >;
          <CardTitle className="text-sm font-medium">Critical Alerts>;
          <AlertTriangle className="h-4 w-4 text-red-500" />;
        </CardHeader>;
        <CardContent>;
          <div className="text-2xl font-bold">{stats.criticalAlerts}>;
          >;
            Requiring immediate attention;
          </p>;
        </CardContent>;
      </Card>;

      <Card>;
        >;
          <CardTitle className="text-sm font-medium">Bed Occupancy>;
          <BedDouble className="h-4 w-4 text-muted-foreground" />;
        </CardHeader>;
        <CardContent>;
          <div className="text-2xl font-bold">{stats.occupiedBeds}>;
          <p className="text-xs text-muted-foreground">72% occupancy rate</p>;
        </CardContent>;
      </Card>;

      <Card>;
        >;
          >;
            Incoming Ambulances;
          </CardTitle>;
          <Ambulance className="h-4 w-4 text-muted-foreground" />;
        </CardHeader>;
        <CardContent>;
          <div className="text-2xl font-bold">{stats.incomingAmbulances}>;
          <p className="text-xs text-muted-foreground">ETA: 5-10 minutes</p>;
        </CardContent>;
      </Card>;

      <Card>;
        >;
          >;
            Department Activity;
          </CardTitle>;
          <Activity className="h-4 w-4 text-muted-foreground" />;
        </CardHeader>;
        <CardContent>;
          <div className="text-2xl font-bold">High>;
          >;
            Peak hours (14:00 - 20:00);
          </p>;
        </CardContent>;
      </Card>;
    </div>;
  );
