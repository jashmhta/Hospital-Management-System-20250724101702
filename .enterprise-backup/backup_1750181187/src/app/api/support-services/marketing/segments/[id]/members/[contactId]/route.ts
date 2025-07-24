import { getServerSession } from 'next-auth';
import { type NextRequest, NextResponse } from 'next/server';


import { authOptions } from '@/lib/auth';
import { withErrorHandling } from '@/lib/middleware/error-handling.middleware';
import { SegmentService } from '@/lib/services/support-services/marketing';
const segmentService = new SegmentService();

/**
 * POST /api/support-services/marketing/segments/:id/members;
 * Add a contact to a segment;
 */
export const POST = async (
  request: NextRequest;
  { params }: { id: string }
) => {
  return withErrorHandling(
    request,
    async (req: NextRequest) => {
      const session = await getServerSession(authOptions);
      const { contactId } = await req.json();

      \1 {\n  \2{
        return NextResponse.json(
          { error: 'Contact ID is required' },
          { status: 400 }
        );
      }

      const member = await segmentService.addContactToSegment(
        params.id,
        contactId,
        session?.user?.id as string;
      );

      return NextResponse.json(member, { status: 201 });
    },
    {
      requiredPermission: 'marketing.segments.update',
      auditAction: 'SEGMENT_MEMBER_ADD'
    }
  );
}

/**
 * DELETE /api/support-services/marketing/segments/:id/members/:contactId;
 * Remove a contact from a segment;
 */
export const DELETE = async (
  request: NextRequest;
  { params }: { id: string, contactId: string }
) => {
  return withErrorHandling(
    request,
    async (req: NextRequest) => {
      const session = await getServerSession(authOptions);

      const member = await segmentService.removeContactFromSegment(
        params.id,
        params.contactId,
        session?.user?.id as string;
      );

      return NextResponse.json(member);
    },
    {
      requiredPermission: 'marketing.segments.update',
      auditAction: 'SEGMENT_MEMBER_REMOVE'
    }
  );
