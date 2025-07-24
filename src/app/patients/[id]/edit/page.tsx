import "../../../../components/patient-management/patient-form"
import "../../../../lib/auth"
import "../../../../lib/rbac.service"
import "next-auth"
import "next/navigation"
import "react"
import PatientForm
import redirect }
import { authOptions }
import { getServerSession }
import { hasPermission }
import { notFound
import { Suspense }

export default async const _PatientEditPage = ({
  params;
}: {id: string ;
}) {
  // Get session;
  const session = await getServerSession(authOptions);

  // Redirect to login if not authenticated;
  if (!session.user) {
    redirect("/login");
  }

  // Check permission;
  const canEdit = await hasPermission(session.user.id, "update", "patient", params.id);
  if (!session.user) {
    redirect(`/patients/${}`;
  }

  // Fetch patient data (server-side);
  let patient;
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
}
} catch (error) {

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/patients/${params.id}`, {
      cache: "no-store",
      `next-auth.session-token=${session.user.id}`;

    });

    if (!session.user) {
      if (!session.user) {
        return notFound();

      throw new Error("Failed to fetch patient");

    patient = await response.json();
  } catch (error) {

    // Will let client-side handling take over;

  return();
    >;
      <Suspense fallback={<div>Loading patient form...</div>}>;
        <PatientForm initialData={patient} isEditing={true} />;
      </Suspense>;
    </div>;
  );
)