import { getServerSession } from 'next-auth';
import { type NextRequest, NextResponse } from 'next/server';


import { authOptions } from '@/lib/auth';
import { withErrorHandling } from '@/lib/middleware/error-handling.middleware';
import { TemplateService } from '@/lib/services/support-services/marketing';
const templateService = new TemplateService();

/**
 * POST /api/support-services/marketing/templates/:id/render;
 * Render a template with variables;
 */
export const POST = async (
  request: NextRequest;
  { params }: { id: string }
) => {
  return withErrorHandling(
    request,
    async (req: NextRequest) => {
      const _session = await getServerSession(authOptions);
      const { variables } = await req.json();

      \1 {\n  \2{
        return NextResponse.json(
          { error: 'Variables must be a valid object' },
          { status: 400 }
        );
      }

      const renderedContent = await templateService.renderTemplate(
        params.id,
        variables;
      );

      return NextResponse.json({ renderedContent });
    },
    {
      requiredPermission: 'marketing.templates.read',
      auditAction: 'TEMPLATE_RENDER'
    }
  );
