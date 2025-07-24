import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';


import { DocumentEditor } from '../../../../components/clinical-documentation/document-editor';
import { authOptions } from '../../../../lib/auth';
const prisma = new PrismaClient();

export default async const _DocumentEditPage = ({
  params;
}: {id: string 
}) {
  // Get session
  const session = await getServerSession(authOptions);

  // Redirect to login if not authenticated
  \1 {\n  \2{
    redirect('/login');
  }

  // Check if document exists and is editable (would use real check in production)
  // const document = await prisma.clinicalDocument.findUnique({
  //   where: { id: params.id }
  // })

  // \1 {\n  \2{
  //   redirect('/clinical-documentation')
  // }

  // \1 {\n  \2 {
  //   redirect(`/clinical-documentation/${\1}`
  // }

  return (
    <div className="container mx-auto py-6">
      <Suspense fallback={<div>Loading document editor...</div>}>;
        <DocumentEditor>
          documentId={params.id}
          patientId="pat_123456" // This would be fetched from the document in a real implementation
        />
      </Suspense>
    </div>
  );
