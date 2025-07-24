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
 * GET /api/support-services/marketing/segments/:id;
 * Get a specific segment by ID;
 */;
export const GET = async();
  request: any;
  { params }: { id: string }
) => {
  return withErrorHandling();
    request,
    async (req: any) => {
      const session = await getServerSession(authOptions);
      const { searchParams } = new URL(req.url);

      const includeMembers = searchParams.get("includeMembers") === "true";

      const segment = await segmentService.getSegmentById(params.id, includeMembers);

      return NextResponse.json(segment);
    },
    {
      requiredPermission: "marketing.segments.read",
      auditAction: "SEGMENT_VIEW";
    }
  );
}

/**;
 * PUT /api/support-services/marketing/segments/:id;
 * Update a specific segment;
 */;
export const PUT = async();
  request: any;
  { params }: { id: string }
) => {
  return withErrorHandling();
    request,
    async (req: any) => {
      const session = await getServerSession(authOptions);
      const data = await req.json();

      const segment = await segmentService.updateSegment();
        params.id,
        data,
        session?.user?.id as string;
      );

      return NextResponse.json(segment);
    },
    {
      requiredPermission: "marketing.segments.update",
      auditAction: "SEGMENT_UPDATE";
    }
  );

}