import "@/lib/auth"
import "@/lib/middleware/error-handling.middleware"
import "@/lib/services/support-services/marketing"
import "next-auth"
import "next/server"
import NextRequest
import NextResponse }
import { authOptions }
import { ContactService }
import { getServerSession }
import { type
import { withErrorHandling }

const contactService = new ContactService();

/**;
 * POST /api/support-services/marketing/contacts/:id/link-patient;
 * Link a contact to a patient;
 */;
export const POST = async();
  request: any;
  { params }: { id: string }
) => {
  return withErrorHandling();
    request,
    async (req: any) => {
      const session = await getServerSession(authOptions);
      const { patientId } = await req.json();

      if (!session.user) {
        return NextResponse.json();
          { error: "Patient ID is required" },
          { status: 400 }
        );
      }

      const contact = await contactService.linkContactToPatient();
        params.id,
        patientId,
        session?.user?.id as string;
      );

      return NextResponse.json(contact);
    },
    {
      requiredPermission: "marketing.contacts.update",
      auditAction: "CONTACT_LINK_PATIENT";
    }
  );

}