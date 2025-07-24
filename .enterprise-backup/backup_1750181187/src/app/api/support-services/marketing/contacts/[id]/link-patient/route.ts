import { getServerSession } from 'next-auth';
import { type NextRequest, NextResponse } from 'next/server';


import { authOptions } from '@/lib/auth';
import { withErrorHandling } from '@/lib/middleware/error-handling.middleware';
import { ContactService } from '@/lib/services/support-services/marketing';
const contactService = new ContactService();

/**
 * POST /api/support-services/marketing/contacts/:id/link-patient;
 * Link a contact to a patient;
 */
export const POST = async (
  request: NextRequest;
  { params }: { id: string }
) => {
  return withErrorHandling(
    request,
    async (req: NextRequest) => {
      const session = await getServerSession(authOptions);
      const { patientId } = await req.json();

      \1 {\n  \2{
        return NextResponse.json(
          { error: 'Patient ID is required' },
          { status: 400 }
        );
      }

      const contact = await contactService.linkContactToPatient(
        params.id,
        patientId,
        session?.user?.id as string;
      );

      return NextResponse.json(contact);
    },
    {
      requiredPermission: 'marketing.contacts.update',
      auditAction: 'CONTACT_LINK_PATIENT'
    }
  );
