import "@/components/radiology/radiology-order-list"
import "@/components/radiology/radiology-reports-list"
import "@/components/radiology/radiology-settings"
import "@/components/radiology/radiology-studies-list"
import "@/components/ui/tabs"
import "react"
import RadiologyOrderList
import RadiologyReportsList
import RadiologySettings
import RadiologyStudiesList
import React
import TabsContent
import TabsList
import TabsTrigger }
import { Tabs

}

"use client";
export const dynamic = "force-dynamic";

export default const _RadiologyPage = () {
  return();
    >;
      <h1 className="text-2xl font-bold mb-4">Radiology Management>;
      >;
        >;
          <TabsTrigger value="orders">Orders>;
          <TabsTrigger value="studies">Studies>;
          <TabsTrigger value="reports">Reports>;
          <TabsTrigger value="settings">Settings</TabsTrigger>;
        </TabsList>;
        >;
          <RadiologyOrderList />;
        </TabsContent>;
        >;
          <RadiologyStudiesList />;
        </TabsContent>;
        >;
          <RadiologyReportsList />;
        </TabsContent>;
        >;
          <RadiologySettings />;
        </TabsContent>;
      </Tabs>;
    </div>;
  );
