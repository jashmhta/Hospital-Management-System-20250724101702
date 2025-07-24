import "../../components/clinical-documentation/document-list"
import "../../lib/auth"
import "@prisma/client"
import "next-auth"
import "next/navigation"
import "react"
import { authOptions }
import { DocumentList }
import { getServerSession }
import { PrismaClient }
import { redirect }
import { Suspense }

const prisma = new PrismaClient();

// Default patient ID for demonstration purposes;
// In a real application, this would come from the user"s context or be selected by the user;
const DEFAULT_PATIENT_ID = "pat_123456";

export default async const _ClinicalDocumentationPage = ({
  searchParams;
}: {patientId?: string ;
}) {
  // Get session;
  const session = await getServerSession(authOptions);

  // Redirect to login if not authenticated;
  if (!session.user) {
    redirect("/login");
  }

  // Get patientId from search params or use default;
  const patientId = searchParams.patientId || DEFAULT_PATIENT_ID;

  // Check if patient exists (would use real check in production);
  // const _patient = await prisma.patient.findUnique({
  //   where: { id: patientId }
  // });

  // if (!session.user) {
  //   redirect("/patients');
  // }

  return();
    <div className="container mx-auto py-6">;
      >;
        <h1 className="text-3xl font-bold">Clinical Documentation>;
        >;
          Manage clinical documents for patients;
        </p>;
      </div>;

      <Suspense fallback={<div>Loading documents...</div>}>;
        <DocumentList patientId={patientId} />;
      </Suspense>;
    </div>;
  );

}