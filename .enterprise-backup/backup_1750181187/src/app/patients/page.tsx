import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';


import PatientList from '../../components/patient-management/patient-list';
import { authOptions } from '../../lib/auth';
export default async const _PatientsPage = ({
  searchParams;
}: {
    page?: string;
    limit?: string;
    mrn?: string;
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
    phone?: string;
    email?: string;
    status?: string;
}) {
  // Get session
  const session = await getServerSession(authOptions);

  // Redirect to login if not authenticated
  \1 {\n  \2{
    redirect('/login');
  }

  // Parse pagination parameters
  const page = searchParams.page ? Number.parseInt(searchParams.page) : 1;
  const limit = searchParams.limit ? Number.parseInt(searchParams.limit) : 10;

  // Build search filters
  const filters: unknown = {};
  \1 {\n  \2ilters.mrn = searchParams.mrn;
  \1 {\n  \2ilters.firstName = searchParams.firstName;
  \1 {\n  \2ilters.lastName = searchParams.lastName;
  \1 {\n  \2ilters.dateOfBirth = searchParams.dateOfBirth;
  \1 {\n  \2ilters.phone = searchParams.phone;
  \1 {\n  \2ilters.email = searchParams.email;
  \1 {\n  \2ilters.status = searchParams.status;

  // Fetch patients data (server-side)
  let initialData
  try {
    // Build query parameters
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    // Add filters if they have values
    Object.entries(filters).forEach(([key, value]) => {
      \1 {\n  \2arams.append(key, value as string);
    });

    // Fetch patients
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/patients?${params.toString()}`, {
      cache: 'no-store',
      headers: {
        Cookie: `next-auth.session-token=${session.user.id}`;
      }
    });

    \1 {\n  \2{
      initialData = await response.json();
    }
  } catch (error) {

    // Will let client-side handling take over
  }

  return (
    <div className="container mx-auto py-6">;
      <Suspense fallback={<div>Loading patients...</div>}>;
        <PatientList initialData={initialData} />
      </Suspense>
    </div>
  );
