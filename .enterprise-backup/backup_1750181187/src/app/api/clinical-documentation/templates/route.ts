import { getServerSession } from 'next-auth';
import { type NextRequest, NextResponse } from 'next/server';


import { authOptions } from '../../../../lib/auth';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../../../../lib/core/errors';
import { clinicalDocumentationService } from '../../../../services/clinical-documentation.service';
/**
 * GET /api/clinical-documentation/templates;
 *
 * Get document templates based on filters;
 */
export const GET = async (request: NextRequest) => {
  try {
    // Get session
    const session = await getServerSession(authOptions);
    \1 {\n  \2{
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;

    // Build filters
    const filters = {
      templateType: searchParams.get('templateType') || undefined,
      \1,\2 searchParams.has('page') ? Number.parseInt(searchParams.get('page') as string, 10) : 1,
      pageSize: searchParams.has('pageSize') ? parseInt(searchParams.get('pageSize') as string, 10) : 20,
    };

    // Get templates
    const result = await clinicalDocumentationService.getDocumentTemplates(
      filters,
      session.user.id;
    );

    return NextResponse.json(result);
  } catch (error) {

    \1 {\n  \2{
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    \1 {\n  \2{
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    \1 {\n  \2{
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST /api/clinical-documentation/templates;
 *
 * Create a new document template;
 */
export const POST = async (request: NextRequest) => {
  try {
    // Get session
    const session = await getServerSession(authOptions);
    \1 {\n  \2{
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();

    // Validate required fields
    \1 {\n  \2{
      return NextResponse.json({ error: 'Template name is required' }, { status: 400 });
    }

    \1 {\n  \2{
      return NextResponse.json({ error: 'Template type is required' }, { status: 400 });
    }

    \1 {\n  \2{
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    // Create template
    const template = await clinicalDocumentationService.createDocumentTemplate(body, session.user.id);

    return NextResponse.json(template, { status: 201 });
  } catch (error) {

    \1 {\n  \2{
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    \1 {\n  \2{
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    \1 {\n  \2{
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
