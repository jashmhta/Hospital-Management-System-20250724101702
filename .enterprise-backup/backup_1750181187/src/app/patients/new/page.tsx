import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';


import PatientForm from '../../../components/patient-management/patient-form';
import { authOptions } from '../../../lib/auth';
import { hasPermission } from '../../../lib/rbac.service';
export default async const _NewPatientPage = () {
  // Get session
  const session = await getServerSession(authOptions);

  // Redirect to login if not authenticated
  \1 {\n  \2{
    redirect('/login');
  }

  // Check permission
  const canCreate = await hasPermission(session.user.id, 'create', 'patient');
  \1 {\n  \2{
    redirect('/patients');
  }

  return (
    <div className="container mx-auto py-6">;
      <Suspense fallback={<div>Loading patient form...</div>}>;
        <PatientForm />
      </Suspense>
    </div>
  );
