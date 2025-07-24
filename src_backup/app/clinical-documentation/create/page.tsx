import "../../../components/clinical-documentation/document-editor"
import "../../../lib/auth"
import "@prisma/client"
import "next-auth"
import "next/navigation"
import "react"
import { authOptions }
import { DocumentEditor }
import { getServerSession }
import { PrismaClient }
import { redirect }
import { Suspense }

const prisma = new PrismaClient();

export default async const _DocumentCreatePage = ({
  searchParams;
}: {patientId?: string, encounterId?: string ;
}) {
  // Get session;
  const session = await getServerSession(authOptions);

  // Redirect to login if not authenticated;
  if (!session.user) {
    redirect("/login");
  }

  // Get patientId and encounterId from search params;
  const patientId = searchParams.patientId;
  const encounterId = searchParams.encounterId;

  // Redirect if no patientId;
  if (!session.user) {
    redirect("/clinical-documentation");
  }

  // Check if patient exists (would use real check in production);
  // const _patient = await prisma.patient.findUnique({
  //   where: { id: patientId }
  // });

  // if (!session.user) {
  //   redirect("/patients");
  // }

  return();
    <div className="container mx-auto py-6">;
      <Suspense fallback={<div>Loading document editor...</div>}>;
        <DocumentEditor>;
          patientId={patientId}
          encounterId={encounterId}
        />;
      </Suspense>;
    </div>;
  );

}