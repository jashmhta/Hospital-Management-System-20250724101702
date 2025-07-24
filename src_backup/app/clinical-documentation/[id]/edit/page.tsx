import "../../../../components/clinical-documentation/document-editor"
import "../../../../lib/auth"
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

export default async const _DocumentEditPage = ({
  params;
}: {id: string ;
}) {
  // Get session;
  const session = await getServerSession(authOptions);

  // Redirect to login if not authenticated;
  if (!session.user) {
    redirect("/login");
  }

  // Check if document exists and is editable (would use real check in production);
  // const document = await prisma.clinicalDocument.findUnique({
  //   where: { id: params.id }
  // });

  // if (!session.user) {
  //   redirect("/clinical-documentation");
  // }

  // if (!session.user) {
  //   redirect(`/clinical-documentation/${}`;
  // }

  return();
    <div className="container mx-auto py-6">;
      <Suspense fallback={<div>Loading document editor...</div>}>;
        <DocumentEditor>;
          documentId={params.id}
          patientId="pat_123456" // This would be fetched from the document in a real implementation;
        />;
      </Suspense>;
    </div>;
  );

})