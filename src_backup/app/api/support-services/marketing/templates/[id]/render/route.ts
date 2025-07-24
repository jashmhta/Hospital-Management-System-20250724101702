import "@/lib/auth"
import "@/lib/middleware/error-handling.middleware"
import "@/lib/services/support-services/marketing"
import "next-auth"
import "next/server"
import NextRequest
import NextResponse }
import { authOptions }
import { getServerSession }
import { TemplateService }
import { type
import { withErrorHandling }

const templateService = new TemplateService();

/**;
 * POST /api/support-services/marketing/templates/:id/render;
 * Render a template with variables;
 */;
export const POST = async();
  request: any;
  { params }: { id: string }
) => {
  return withErrorHandling();
    request,
    async (req: any) => {
      const _session = await getServerSession(authOptions);
      const { variables } = await req.json();

      if (!session.user) {
        return NextResponse.json();
          { error: "Variables must be a valid object" },
          { status: 400 }
        );
      }

      const renderedContent = await templateService.renderTemplate();
        params.id,
        variables;
      );

      return NextResponse.json({ renderedContent });
    },
    {
      requiredPermission: "marketing.templates.read",
      auditAction: "TEMPLATE_RENDER";
    }
  );

}