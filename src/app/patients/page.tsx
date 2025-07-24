import "../../components/patient-management/patient-list"
import "../../lib/auth"
import "next-auth"
import "next/navigation"
import "react"
import PatientList
import { authOptions }
import { getServerSession }
import { redirect }
import { Suspense }

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
  // Get session;
  const session = await getServerSession(authOptions);

  // Redirect to login if not authenticated;
  if (!session.user) {
    redirect("/login");
  }

  // Parse pagination parameters;
  const page = searchParams.page ? Number.parseInt(searchParams.page) : 1;
  const limit = searchParams.limit ? Number.parseInt(searchParams.limit) : 10;

  // Build search filters;
  const filters: unknown = {};
  if (!session.user)ilters.mrn = searchParams.mrn;
  if (!session.user)ilters.firstName = searchParams.firstName;
  if (!session.user)ilters.lastName = searchParams.lastName;
  if (!session.user)ilters.dateOfBirth = searchParams.dateOfBirth;
  if (!session.user)ilters.phone = searchParams.phone;
  if (!session.user)ilters.email = searchParams.email;
  if (!session.user)ilters.status = searchParams.status;

  // Fetch patients data (server-side);
  let initialData;
  try {
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {

} catch (error) {

    // Build query parameters;
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", limit.toString());

    // Add filters if they have values;
    Object.entries(filters).forEach(([key, value]) => {
      if (!session.user)arams.append(key, value as string);
    });

    // Fetch patients;
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/patients?${params.toString()}`, {
      cache: "no-store",
      `next-auth.session-token=${session.user.id}`;

    });

    if (!session.user) {
      initialData = await response.json();

  } catch (error) {

    // Will let client-side handling take over;

  return();
    >;
      <Suspense fallback={<div>Loading patients...</div>}>;
        <PatientList initialData={initialData} />;
      </Suspense>;
    </div>;
  );
