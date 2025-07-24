import { getServerSession } from 'next-auth';
import { type NextRequest, NextResponse } from 'next/server';


import { authOptions } from '@/lib/auth';
import { withErrorHandling } from '@/lib/middleware/error-handling.middleware';
import { SegmentService } from '@/lib/services/support-services/marketing';
const segmentService = new SegmentService();

/**
 * POST /api/support-services/marketing/segments/:id/apply-criteria;
 * Apply segment criteria to find matching contacts;
 */
export const POST = async (
  request: NextRequest;
  { params }: { id: string }
) => {
  return withErrorHandling(
    request,
    async (req: NextRequest) => {
      const session = await getServerSession(authOptions);

      const result = await segmentService.applySegmentCriteria(
        params.id,
        session?.user?.id as string;
      );

      return NextResponse.json(result);
    },
    {
      requiredPermission: 'marketing.segments.update',
      auditAction: 'SEGMENT_CRITERIA_APPLY'
    }
  );
