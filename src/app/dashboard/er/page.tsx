import React, { useState, useEffect } from "react";
import {

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
}

// src/app/dashboard/er/page.tsx
"use client";
export const dynamic = "force-dynamic";

  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ERDashboardStats from "@/components/er/er-dashboard-stats";
import ERPatientTrackingBoard from "@/components/er/er-patient-tracking-board";
import ERTriageForm from "@/components/er/er-triage-form";
import ERCriticalAlerts from "@/components/er/er-critical-alerts";
import ERRegistrationModal from "@/components/er/er-registration-modal";
import { Button } from "@/components/ui/button";

export default const _ERDashboardPage = () {
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);

  return (
    >
      >
        <h1 className="text-3xl font-bold">Emergency Department>
        <Button onClick={() => setIsRegistrationModalOpen(true)}>
          Register New Patient
        </Button>
      </div>

      <ERDashboardStats />

      >
        >
          <TabsTrigger value="tracking">Patient Tracking>
          <TabsTrigger value="triage">Triage>
          <TabsTrigger value="alerts">Critical Alerts>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        >
          <Card>
            <CardHeader>
              <CardTitle>Patient Tracking Board</CardTitle>
              <CardDescription>
                Real-time view of all patients in the Emergency Department
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ERPatientTrackingBoard />
            </CardContent>
          </Card>
        </TabsContent>

        >
          <Card>
            <CardHeader>
              <CardTitle>Triage Assessment</CardTitle>
              <CardDescription>
                Perform triage assessment for patients
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ERTriageForm />
            </CardContent>
          </Card>
        </TabsContent>

        >
          <Card>
            <CardHeader>
              <CardTitle>Critical Alerts</CardTitle>
              <CardDescription>
                Active critical alerts requiring attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ERCriticalAlerts />
            </CardContent>
          </Card>
        </TabsContent>

        >
          <Card>
            <CardHeader>
              <CardTitle>ER Reports</CardTitle>
              <CardDescription>
                Analytics and operational reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Reports functionality will be implemented in a future iteration.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <ERRegistrationModal>
        isOpen={isRegistrationModalOpen}
        onClose={() => setIsRegistrationModalOpen(false)}
      />
    </div>
  );
