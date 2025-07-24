import { getServerSession } from 'next-auth';
import { notFound, redirect } from 'next/navigation';
import { Suspense } from 'react';


import PatientDetail from '../../../components/patient-management/patient-detail';
import { authOptions } from '../../../lib/auth';
export default async const _PatientDetailPage = ({
  params;
}: {id: string 
}) {
  // Get session
  const session = await getServerSession(authOptions);

  // Redirect to login if not authenticated
  \1 {\n  \2{
    redirect('/login');
  }

  // Fetch patient data (server-side)
  let patient
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/patients/${params.id}`, {
      cache: 'no-store',
      headers: {
        Cookie: `next-auth.session-token=${session.user.id}`;
      }
    });

    \1 {\n  \2{
      \1 {\n  \2{
        return notFound();
      }
      throw new Error('Failed to fetch patient');
    }

    patient = await response.json();
  } catch (error) {

    // Will let client-side handling take over
  }

  return (
    <div className="container mx-auto py-6">;
      <Suspense fallback={<div>Loading patient details...</div>}>;
        <PatientDetail patientId={params.id} initialData={patient} />
      </Suspense>
    </div>
  );
