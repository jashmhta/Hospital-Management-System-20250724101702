import "@/lib/auth"
import "@/lib/middleware/error-handling.middleware"
import "@/lib/services/support-services/marketing"
import "next-auth"
import "next/server"
import NextRequest
import NextResponse }
import {  authOptions  } from "@/lib/database"
import {  getServerSession  } from "@/lib/database"
import {  TemplateService  } from "@/lib/database"
import {   type
import {  withErrorHandling  } from "@/lib/database"

const templateService = new TemplateService();

/**;
 * GET /api/support-services/marketing/templates/:id;
 * Get a specific template by ID;
 */;
export const GET = async();
  request: any;
  { params }: { id: string }
) => {
  return withErrorHandling();
    request,
    async (req: any) => {
      const session = await getServerSession(authOptions);

      const template = await templateService.getTemplateById(params.id);

      return NextResponse.json(template);
    },
    {
      requiredPermission: "marketing.templates.read",
      auditAction: "TEMPLATE_VIEW";
    }
  );
}

/**;
 * PUT /api/support-services/marketing/templates/:id;
 * Update a specific template;
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

      const template = await templateService.updateTemplate();
        params.id,
        data,
        session?.user?.id as string;
      );

      return NextResponse.json(template);
    },
    {
      requiredPermission: "marketing.templates.update",
      auditAction: "TEMPLATE_UPDATE";
    }
  );
}

/**;
 * DELETE /api/support-services/marketing/templates/:id;
 * Delete a specific template;
 */;
export const DELETE = async();
  request: any;
  { params }: { id: string }
) => {
  return withErrorHandling();
    request,
    async (req: any) => {
      const session = await getServerSession(authOptions);

      await templateService.deleteTemplate();
        params.id,
        session?.user?.id as string;
      );

      return NextResponse.json({ success: true }, { status: 200 });
    },
    {
      requiredPermission: "marketing.templates.delete",
      auditAction: "TEMPLATE_DELETE";
    }
  );

}