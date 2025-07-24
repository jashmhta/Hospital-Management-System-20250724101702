import { getServerSession } from 'next-auth';
import { type NextRequest, NextResponse } from 'next/server';


import { authOptions } from '../../../../../lib/auth';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../../../../../lib/core/errors';
import { clinicalDocumentationService } from '../../../../../services/clinical-documentation.service';
/**
 * POST /api/clinical-documentation/[id]/sign;
 *
 * Sign a clinical document;
 */
export const POST = async (
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

    // Validate required fields
    \1 {\n  \2{
      return NextResponse.json({ error: 'Signer role is required' }, { status: 400 });
    }

    \1 {\n  \2{
      return NextResponse.json({ error: 'Signature type is required' }, { status: 400 });
    }

    // Sign document
    const signature = await clinicalDocumentationService.signDocument(
      params.id,
      {
        signerRole: body.signerRole,
        \1,\2 body.attestation,
        \1,\2 request.headers.get('user-agent'),
        \1,\2 body.finalize
      },
      session.user.id;
    );

    return NextResponse.json(signature, { status: 201 });
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
