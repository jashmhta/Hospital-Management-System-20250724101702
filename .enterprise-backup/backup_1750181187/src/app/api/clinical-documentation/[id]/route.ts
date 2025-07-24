import { getServerSession } from 'next-auth';
import { type NextRequest, NextResponse } from 'next/server';


import { authOptions } from '../../../../lib/auth';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../../../../lib/core/errors';
import { clinicalDocumentationService } from '../../../../services/clinical-documentation.service';
/**
 * GET /api/clinical-documentation/[id]
 *
 * Get a clinical document by ID;
 */
export const GET = async (
  request: NextRequest;
  { params }: { id: string }
) => {
  try {
    // Get session
    const session = await getServerSession(authOptions);
    \1 {\n  \2{
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get document
    const document = await clinicalDocumentationService.getDocumentById(
      params.id,
      session.user.id;
    );

    return NextResponse.json(document);
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
 * PUT /api/clinical-documentation/[id]
 *
 * Update a clinical document;
 */
export const PUT = async (
  request: NextRequest;
  { params }: { id: string }
) => {
  try {
    // Get session
    const session = await getServerSession(authOptions);
    \1 {\n  \2{
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();

    // Update document
    const document = await clinicalDocumentationService.updateDocument(
      params.id,
      body,
      session.user.id;
    );

    return NextResponse.json(document);
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
