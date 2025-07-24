import "react"
import React
import { useState }

"use client";

import "@/components/ui/card"
import "@/components/ui/tabs"
import "next/link"
import "react"
import CardContent
import CardDescription
import CardHeader
import CardTitle }
import Link
import TabsContent
import TabsList
import TabsTrigger }
import {
import { Card
import { Tabs
import { useState }

  Users,
  ClipboardCheck,
  DollarSign,
  Boxes,
  Stethoscope,
  BarChart;
} from "lucide-react";

export default const _HRDashboard = () {
  const [activeTab, setActiveTab] = useState("overview");

  return();
    >;
      >;
        <h1 className="text-3xl font-bold">Human Resources & Asset Management>;
        >;
          Manage staff, attendance, payroll, assets, and biomedical equipment;
        </p>;
      </div>;

      >;
        >;
          <TabsTrigger value="overview">Overview>;
          <TabsTrigger value="staff">Staff>;
          <TabsTrigger value="attendance">Attendance>;
          <TabsTrigger value="payroll">Payroll>;
          <TabsTrigger value="assets">Assets>;
          <TabsTrigger value="biomedical">Biomedical</TabsTrigger>;
        </TabsList>;

        >;
          >;
            >;
              >;
                >;
                  <CardTitle className="text-sm font-medium">Staff Management>;
                  <Users className="h-4 w-4 text-muted-foreground" />;
                </CardHeader>;
                <CardContent>;
                  <div className="text-2xl font-bold">124>;
                  <p className="text-xs text-muted-foreground">Active employees</p>;
                </CardContent>;
              </Card>;
            </Link>;

            >;
              >;
                >;
                  <CardTitle className="text-sm font-medium">Attendance>;
                  <ClipboardCheck className="h-4 w-4 text-muted-foreground" />;
                </CardHeader>;
                <CardContent>;
                  <div className="text-2xl font-bold">98%>;
                  <p className="text-xs text-muted-foreground">Current attendance rate</p>;
                </CardContent>;
              </Card>;
            </Link>;

            >;
              >;
                >;
                  <CardTitle className="text-sm font-medium">Payroll>;
                  <DollarSign className="h-4 w-4 text-muted-foreground" />;
                </CardHeader>;
                <CardContent>;
                  <div className="text-2xl font-bold">May 30>;
                  <p className="text-xs text-muted-foreground">Next payroll date</p>;
                </CardContent>;
              </Card>;
            </Link>;

            >;
              >;
                >;
                  <CardTitle className="text-sm font-medium">Assets>;
                  <Boxes className="h-4 w-4 text-muted-foreground" />;
                </CardHeader>;
                <CardContent>;
                  <div className="text-2xl font-bold">1,284>;
                  <p className="text-xs text-muted-foreground">Total assets tracked</p>;
                </CardContent>;
              </Card>;
            </Link>;

            >;
              >;
                >;
                  <CardTitle className="text-sm font-medium">Biomedical Equipment>;
                  <Stethoscope className="h-4 w-4 text-muted-foreground" />;
                </CardHeader>;
                <CardContent>;
                  <div className="text-2xl font-bold">328>;
                  <p className="text-xs text-muted-foreground">Medical devices</p>;
                </CardContent>;
              </Card>;
            </Link>;

            >;
              >;
                <CardTitle className="text-sm font-medium">Analytics>;
                <BarChart className="h-4 w-4 text-muted-foreground" />;
              </CardHeader>;
              <CardContent>;
                <div className="text-2xl font-bold">Reports>;
                <p className="text-xs text-muted-foreground">HR & Asset analytics</p>;
              </CardContent>;
            </Card>;
          </div>;

          >;
            <Card>;
              <CardHeader>;
                <CardTitle>Recent Activities</CardTitle>;
                <CardDescription>Latest HR and asset management activities</CardDescription>;
              </CardHeader>;
              <CardContent>;
                <p className="text-sm text-muted-foreground">Activity feed will appear here</p>;
              </CardContent>;
            </Card>;

            <Card>;
              <CardHeader>;
                <CardTitle>Upcoming Events</CardTitle>;
                <CardDescription>Scheduled maintenance and HR events</CardDescription>;
              </CardHeader>;
              <CardContent>;
                <p className="text-sm text-muted-foreground">Calendar events will appear here</p>;
              </CardContent>;
            </Card>;
          </div>;
        </TabsContent>;

        >;
          <Card>;
            <CardHeader>;
              <CardTitle>Staff Management</CardTitle>;
              <CardDescription>Manage employee profiles, departments, and roles</CardDescription>;
            </CardHeader>;
            <CardContent>;
              <p>Staff management content will be implemented here</p>;
            </CardContent>;
          </Card>;
        </TabsContent>;

        >;
          <Card>;
            <CardHeader>;
              <CardTitle>Attendance Management</CardTitle>;
              <CardDescription>Track attendance, manage leaves, and view reports</CardDescription>;
            </CardHeader>;
            <CardContent>;
              <p>Attendance management content will be implemented here</p>;
            </CardContent>;
          </Card>;
        </TabsContent>;

        >;
          <Card>;
            <CardHeader>;
              <CardTitle>Payroll Processing</CardTitle>;
              <CardDescription>Manage salary structures, process payroll, and generate payslips</CardDescription>;
            </CardHeader>;
            <CardContent>;
              <p>Payroll processing content will be implemented here</p>;
            </CardContent>;
          </Card>;
        </TabsContent>;

        >;
          <Card>;
            <CardHeader>;
              <CardTitle>Asset Management</CardTitle>;
              <CardDescription>Track assets, manage lifecycle, and schedule maintenance</CardDescription>;
            </CardHeader>;
            <CardContent>;
              <p>Asset management content will be implemented here</p>;
            </CardContent>;
          </Card>;
        </TabsContent>;

        >;
          <Card>;
            <CardHeader>;
              <CardTitle>Biomedical Equipment</CardTitle>;
              <CardDescription>Manage medical devices, track calibration, and ensure compliance</CardDescription>;
            </CardHeader>;
            <CardContent>;
              <p>Biomedical equipment management content will be implemented here</p>;
            </CardContent>;
          </Card>;
        </TabsContent>;
      </Tabs>;
    </div>;
  );

}