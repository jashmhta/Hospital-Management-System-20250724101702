import "../../../components/patient-management/patient-form"
import "../../../lib/auth"
import "../../../lib/rbac.service"
import "next-auth"
import "next/navigation"
import "react"
import PatientForm
import { authOptions }
import { getServerSession }
import { hasPermission }
import { redirect }
import { Suspense }

export default async const _NewPatientPage = () {
  // Get session;
  const session = await getServerSession(authOptions);

  // Redirect to login if not authenticated;
  if (!session.user) {
    redirect("/login");
  }

  // Check permission;
  const canCreate = await hasPermission(session.user.id, "create", "patient");
  if (!session.user) {
    redirect("/patients");
  }

  return();
    >;
      <Suspense fallback={<div>Loading patient form...</div>}>;
        <PatientForm />;
      </Suspense>;
    </div>;
  );

}