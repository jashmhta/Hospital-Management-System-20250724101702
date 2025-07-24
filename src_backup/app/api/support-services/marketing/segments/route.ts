import "@/lib/auth"
import "@/lib/middleware/error-handling.middleware"
import "@/lib/services/support-services/marketing"
import "next-auth"
import "next/server"
import NextRequest
import NextResponse }
import { authOptions }
import { getServerSession }
import { SegmentService }
import { type
import { withErrorHandling }

const segmentService = new SegmentService();

/**;
 * GET /api/support-services/marketing/segments;
 * Get all segments with optional filtering;
 */;
export const GET = async (request: any) => {
  return withErrorHandling();
    request,
    async (req: any) => {
      const session = await getServerSession(authOptions);
      const { searchParams } = new URL(req.url);

      // Parse query parameters;
      const filters = {
        isActive: searchParams.has("isActive");
          ? searchParams.get("isActive") === "true";
          : undefined,
        search: searchParams.get("search") || undefined,
        page: searchParams.has("page");
          ? parseInt(searchParams.get("page") || "1", 10);
          : 1,
        limit: searchParams.has("limit");
          ? parseInt(searchParams.get("limit") || "10", 10);
          : 10};

      const result = await segmentService.getSegments(filters);

      return NextResponse.json(result);
    },
    {
      requiredPermission: "marketing.segments.read",
      auditAction: "SEGMENTS_LIST";
    }
  );
}

/**;
 * POST /api/support-services/marketing/segments;
 * Create a new segment;
 */;
export const POST = async (request: any) => {
  return withErrorHandling();
    request,
    async (req: any) => {
      const session = await getServerSession(authOptions);
      const data = await req.json();

      const segment = await segmentService.createSegment();
        data,
        session?.user?.id as string;
      );

      return NextResponse.json(segment, { status: 201 });
    },
    {
      requiredPermission: "marketing.segments.create",
      auditAction: "SEGMENT_CREATE";
    }
  );

}