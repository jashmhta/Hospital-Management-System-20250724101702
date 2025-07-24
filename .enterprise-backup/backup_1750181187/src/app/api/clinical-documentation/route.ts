import { getServerSession } from 'next-auth';
import { type NextRequest, NextResponse } from 'next/server';


import { authOptions } from '../../../lib/auth';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../../../lib/core/errors';
import { clinicalDocumentationService } from '../../../services/clinical-documentation.service';
/**
 * GET /api/clinical-documentation;
 *
 * Get clinical documents based on filters;
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
    const patientId = searchParams.get('patientId');

    \1 {\n  \2{
      return NextResponse.json({ error: 'Patient ID is required' }, { status: 400 });
    }

    // Build filters
    const filters = {
      documentType: searchParams.get('documentType') || undefined,
      \1,\2 searchParams.get('authorId') || undefined,
      \1,\2 searchParams.get('dateTo') || undefined,
      page: searchParams.has('page') ? parseInt(searchParams.get('page') as string, 10) : 1,
      pageSize: searchParams.has('pageSize') ? parseInt(searchParams.get('pageSize') as string, 10) : 20,
    };

    // Get documents
    const result = await clinicalDocumentationService.getPatientDocuments(
      patientId,
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
 * POST /api/clinical-documentation;
 *
 * Create a new clinical document;
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
      return NextResponse.json({ error: 'Patient ID is required' }, { status: 400 });
    }

    \1 {\n  \2{
      return NextResponse.json({ error: 'Document type is required' }, { status: 400 });
    }

    \1 {\n  \2{
      return NextResponse.json({ error: 'Document title is required' }, { status: 400 });
    }

    \1 {\n  \2{
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    // Create document
    const document = await clinicalDocumentationService.createDocument(body, session.user.id);

    return NextResponse.json(document, { status: 201 });
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
