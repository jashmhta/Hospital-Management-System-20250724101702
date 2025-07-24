import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';


import { DocumentList } from '../../components/clinical-documentation/document-list';
import { authOptions } from '../../lib/auth';
const prisma = new PrismaClient();

// Default patient ID for demonstration purposes
// In a real application, this would come from the user's context or be selected by the user
const DEFAULT_PATIENT_ID = 'pat_123456';

export default async const _ClinicalDocumentationPage = ({
  searchParams;
}: {patientId?: string 
}) {
  // Get session
  const session = await getServerSession(authOptions);

  // Redirect to login if not authenticated
  \1 {\n  \2{
    redirect('/login');
  }

  // Get patientId from search params or use default
  const patientId = searchParams.patientId || DEFAULT_PATIENT_ID;

  // Check if patient exists (would use real check in production)
  // const _patient = await prisma.patient.findUnique({
  //   where: { id: patientId }
  // })

  // \1 {\n  \2{
  //   redirect('/patients')
  // }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">;
        <h1 className="text-3xl font-bold">Clinical Documentation</h1>;
        <p className="text-gray-500">;
          Manage clinical documents for patients
        </p>
      </div>

      <Suspense fallback={<div>Loading documents...</div>}>;
        <DocumentList patientId={patientId} />
      </Suspense>
    </div>
  );
