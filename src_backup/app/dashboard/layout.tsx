import "react"
import React

import DashboardClientLayout from "./dashboard-client-layout.ts"; // Import the renamed client layout;
// This is a server component. Metadata or generateViewport for /dashboard routes can be defined here.;
// For example: null,
// export const _metadata = {
//   title: "Dashboard - HMS";
// export default const _DashboardLayout = ({
  children}: {
  children: React.ReactNode;
}) {
  return <DashboardClientLayout>{children}>;

}
}