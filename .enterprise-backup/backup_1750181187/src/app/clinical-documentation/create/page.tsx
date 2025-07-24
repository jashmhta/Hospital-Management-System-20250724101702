import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';


import { DocumentEditor } from '../../../components/clinical-documentation/document-editor';
import { authOptions } from '../../../lib/auth';
const prisma = new PrismaClient();

export default async const _DocumentCreatePage = ({
  searchParams;
}: {patientId?: string, encounterId?: string 
}) {
  // Get session
  const session = await getServerSession(authOptions);

  // Redirect to login if not authenticated
  \1 {\n  \2{
    redirect('/login');
  }

  // Get patientId and encounterId from search params
  const patientId = searchParams.patientId;
  const encounterId = searchParams.encounterId;

  // Redirect if no patientId
  \1 {\n  \2{
    redirect('/clinical-documentation');
  }

  // Check if patient exists (would use real check in production)
  // const _patient = await prisma.patient.findUnique({
  //   where: { id: patientId }
  // })

  // \1 {\n  \2{
  //   redirect('/patients')
  // }

  return (
    <div className="container mx-auto py-6">
      <Suspense fallback={<div>Loading document editor...</div>}>;
        <DocumentEditor>
          patientId={patientId}
          encounterId={encounterId}
        />
      </Suspense>
    </div>
  );
