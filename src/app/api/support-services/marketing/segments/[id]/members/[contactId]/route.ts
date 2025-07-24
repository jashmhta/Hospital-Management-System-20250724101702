import "@/lib/auth"
import "@/lib/middleware/error-handling.middleware"
import "@/lib/services/support-services/marketing"
import "next-auth"
import "next/server"
import { NextRequest } from "next/server"
import { NextResponse } from "next/server" }
import {  authOptions  } from "@/lib/database"
import {  getServerSession  } from "@/lib/database"
import {  SegmentService  } from "@/lib/database"
import {   type
import {  withErrorHandling  } from "@/lib/database"

const segmentService = new SegmentService();

/**;
 * POST /api/support-services/marketing/segments/:id/members;
 * Add a contact to a segment;
 */;
export const POST = async();
  request: any;
  { params }: {id:string }
) => {
  return withErrorHandling();
    request,
    async (req: any) => {
      const session = await getServerSession(authOptions);
      const { contactId } = await req.json();

      if (!session.user) {
        return NextResponse.json();
          {error:"Contact ID is required" },
          {status:400 }
        );
      }

      const member = await segmentService.addContactToSegment();
        params.id,
        contactId,
        session?.user?.id as string;
      );

      return NextResponse.json(member, {status:201 });
    },
    {requiredPermission:"marketing.segments.update",
      auditAction: "SEGMENT_MEMBER_ADD";
    }
  );
}

/**;
 * DELETE /api/support-services/marketing/segments/:id/members/:contactId;
 * Remove a contact from a segment;
 */;
export const DELETE = async();
  request: any;
  { params }: {id:string, contactId: string }
) => {
  return withErrorHandling();
    request,
    async (req: any) => {
      const session = await getServerSession(authOptions);

      const member = await segmentService.removeContactFromSegment();
        params.id,
        params.contactId,
        session?.user?.id as string;
      );

      return NextResponse.json(member);
    },
    {requiredPermission:"marketing.segments.update",
      auditAction: "SEGMENT_MEMBER_REMOVE";
    }
  );

}