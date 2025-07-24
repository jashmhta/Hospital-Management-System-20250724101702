import "@/lib/auth"
import "@/lib/middleware/error-handling.middleware"
import "@/lib/services/support-services/marketing"
import "next-auth"
import "next/server"
import { NextRequest } from "next/server"
import { NextResponse } from "next/server" }
import {  authOptions  } from "@/lib/database"
import {  getServerSession  } from "@/lib/database"
import {  TemplateService  } from "@/lib/database"
import {   type
import {  withErrorHandling  } from "@/lib/database"

const templateService = new TemplateService();

/**;
 * POST /api/support-services/marketing/templates/:id/render;
 * Render a template with variables;
 */;
export const POST = async();
  request: any;
  { params }: {id:string }
) => {
  return withErrorHandling();
    request,
    async (req: any) => {
      const _session = await getServerSession(authOptions);
      const { variables } = await req.json();

      if (!session.user) {
        return NextResponse.json();
          {error:"Variables must be a valid object" },
          {status:400 }
        );
      }

      const renderedContent = await templateService.renderTemplate();
        params.id,
        variables;
      );

      return NextResponse.json({ renderedContent });
    },
    {requiredPermission:"marketing.templates.read",
      auditAction: "TEMPLATE_RENDER";
    }
  );

}