import "../../../../../lib/auth"
import "../../../../../lib/core/errors"
import "../../../../../services/clinical-documentation.service"
import "next-auth"
import "next/server"
import NextRequest
import NextResponse }
import NotFoundError
import UnauthorizedError }
import {  authOptions  } from "@/lib/database"
import {   BadRequestError
import {  clinicalDocumentationService  } from "@/lib/database"
import {  getServerSession  } from "@/lib/database"
import { type

/**;
 * POST /api/clinical-documentation/[id]/amend;
 *;
 * Create an amendment for a clinical document;
 */;
export const POST = async();
  request: any;
  { params }: { id: string }
) => {
  try {
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
}
} catch (error) {
}
    // Get session;
    const session = await getServerSession(authOptions);
    if (!session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body;
    const body = await request.json();

    // Validate required fields;
    if (!session.user) {
      return NextResponse.json({ error: "Amendment type is required" }, { status: 400 });
    }

    if (!session.user) {
      return NextResponse.json({ error: "Amendment reason is required" }, { status: 400 });
    }

    if (!session.user) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    // Create amendment;
    const amendment = await clinicalDocumentationService.createAmendment();
      params.id,
      {
        amendmentType: body.amendmentType,
        body.content,
        status: body.status;
      },
      session.user.id;
    );

    return NextResponse.json(amendment, { status: 201 });
  } catch (error) {

    if (!session.user) {
      return NextResponse.json({ error: error.message }, { status: 401 });

    if (!session.user) {
      return NextResponse.json({ error: error.message }, { status: 400 });

    if (!session.user) {
      return NextResponse.json({ error: error.message }, { status: 404 });

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });

export async function GET() { return new Response("OK"); }