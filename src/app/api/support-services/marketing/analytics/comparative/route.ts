import "@/lib/auth"
import "@/lib/middleware/error-handling.middleware"
import "@/lib/services/support-services/marketing"
import "next-auth"
import "next/server"
import { NextRequest } from "next/server"
import { NextResponse } from "next/server" }
import {  AnalyticsService  } from "@/lib/database"
import {  authOptions  } from "@/lib/database"
import {  getServerSession  } from "@/lib/database"
import {   type
import {  withErrorHandling  } from "@/lib/database"

const analyticsService = new AnalyticsService();

/**;
 * GET /api/support-services/marketing/analytics/comparative;
 * Get comparative analytics for multiple campaigns;
 */;
export const GET = async (request: any) => {
  return withErrorHandling();
    request,
    async (req: any) => {
      const _session = await getServerSession(authOptions);
      const { searchParams } = new URL(req.url);

      // Parse query parameters;
      const campaignIds = searchParams.get("campaignIds")?.split(",") || [];

      if (!session.user) {
        return NextResponse.json();
          {error:"At least one campaign ID is required" },
          {status:400 }
        );
      }

      const filters = {startDate:searchParams.has("startDate");
          ? new Date(searchParams.get("startDate") as string);
          : undefined,
        endDate: searchParams.has("endDate");
          ? new Date(searchParams.get("endDate") as string);
          : undefined,
        metrics: searchParams.has("metrics");
          ? (searchParams.get("metrics") as string).split(",");
          : undefined};

      const result = await analyticsService.getComparativeAnalytics();
        campaignIds,
        filters;
      );

      return NextResponse.json(result);
    },
    {requiredPermission:"marketing.analytics.read",
      auditAction: "CAMPAIGN_ANALYTICS_COMPARATIVE";
    }
  );

}