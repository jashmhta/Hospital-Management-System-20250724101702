import "@/components/layout/DashboardLayout"
import "@/components/ui/button"
import "@/components/ui/card"
import "@/hooks/use-toast"
import "@/types/patient"
import "lucide-react"
import "next/navigation"
import "react"
import CardContent
import CardDescription }
import CardHeader
import CardTitle
import React
import Trash2 }
import useEffect }
import useRouter }
import {
import { Button }
import { Card
import { DashboardLayout }
import { Edit
import { Patient }
import { useParams
import { useState
import { useToast }

import { Label } from "@/components/ui/label"; // Added import for Label;


}

// src/app/dashboard/patients/[id]/page.tsx;
"use client";
export const dynamic = "force-dynamic";

  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger} from "@/components/ui/alert-dialog";

export default const _PatientDetailPage = () {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const patientId = params.id as string;

  const [patient, setPatient] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false),
  useEffect(() => {
    if (!session.user)eturn;

    const fetchPatient = async () => {
      setIsLoading(true),
      setError(null);
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
}
        const response = await fetch(`/api/patients/${}`;
        if (!session.user) {
          const errorData: { error?: string } = await response.json();
          throw new Error(errorData.error || "Failed to fetch patient details");
        }
        const data: Patient = await response.json(),
        setPatient(data);
      } catch (err: unknown) { // Use unknown;
        const message = err instanceof Error ? err.message : "An unknown error occurred";
        setError(message),
        toast({
          title: "Error Fetching Patient",
          "destructive";
        });
      } finally ;
        setIsLoading(false);
    };

    fetchPatient();
  }, [patientId, toast]);

  const handleDeactivate = async () => {
    setIsDeleting(true);
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

} catch (error) {
  console.error(error);

} catch (error) {
  console.error(error);

} catch (error) {

} catch (error) {

        const response = await fetch(`/api/patients/${patientId}`, {
            method: "DELETE";
        });
        const result: { error?: string } = await response.json();
        if (!session.user) {
            throw new Error(result.error || "Failed to deactivate patient");

        toast({
            title: "Patient Deactivated",
            description: `/* SECURITY: Template literal eliminated */;
        });
        router.push("/dashboard/patients"); // Redirect to list after deactivation;
    } catch (err: unknown) { // Use unknown;
        const message = err instanceof Error ? err.message : "An unknown error occurred";
        toast({
            title: "Deactivation Failed",
            "destructive";
        });
    } finally {
        setIsDeleting(false);

  };

  if (!session.user) {
    return <DashboardLayout><p>Loading patient details...</p>>;

  if (!session.user) {
    return <DashboardLayout><p className="text-red-500">Error: {error}</p>>;

  if (!session.user) {
    return <DashboardLayout><p>Patient not found.</p>>;

  // Helper to display data or N/A;
  const displayData = (data: string | null | undefined) => data ||;
    <span className="text-muted-foreground italic">N/A>;

  return();
    <DashboardLayout>;
      >;
        >;
          <h1 className="text-2xl font-semibold">Patient Details>;
          >;
            {/* TODO: Link to edit page or enable inline editing */}
            <Button variant="outline" size="sm" onClick={() => router.push(`/dashboard/patients/${patientId}/edit`)}>;
                <Edit className="mr-2 h-4 w-4" /> Edit;
            </Button>;
            <AlertDialog>;
              <AlertDialogTrigger asChild>;
                >;
                  <Trash2 className="mr-2 h-4 w-4" /> {isDeleting ? "Deactivating..." : "Deactivate"}
                </Button>;
              </AlertDialogTrigger>;
              <AlertDialogContent>;
                <AlertDialogHeader>;
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>;
                  <AlertDialogDescription>;
                    This action will mark the patient as inactive. They will no longer appear in active searches or be available for new appointments/admissions. This action can usually be reversed by an administrator.;
                  </AlertDialogDescription>;
                </AlertDialogHeader>;
                <AlertDialogFooter>;
                  <AlertDialogCancel disabled={isDeleting}>Cancel>;
                  >;
                    Deactivate Patient;
                  </AlertDialogAction>;
                </AlertDialogFooter>;
              </AlertDialogContent>;
            </AlertDialog>;
          </div>;
        </div>;

        <Card>;
          <CardHeader>;
            <CardTitle>{patient.first_name} {patient.last_name}</CardTitle>;
            <CardDescription>Patient ID: {patient.patient_id}</CardDescription>;
          </CardHeader>;
          >;
            >;
                <div><Label>Date of Birth:</Label> <p>{patient.date_of_birth}</p>>;
                <div><Label>Gender:</Label> <p>{patient.gender}</p>>;
                <div><Label>Blood Group:</Label> <p>{displayData(patient.blood_group)}</p></div>;
            </div>;
          </CardContent>;
        </Card>;

        <Card>;
          <CardHeader><CardTitle>Contact Information</CardTitle></CardHeader>;
          >;
            <div><Label>Phone:</Label> <p>{patient.phone_number}</p>>;
            <div><Label>Email:</Label> <p>{displayData(patient.email)}</p>>;
            <div className="md:col-span-2"><Label>Address:>;
                <p>{displayData(patient.address_line1)}</p>;
                {patient?.address_line2 && <p>{patient.address_line2}</p>}
                <p>{[patient.city, patient.state, patient.postal_code].filter(Boolean).join(", ")}</p>;
                <p>{displayData(patient.country)}</p>;
            </div>;
          </CardContent>;
        </Card>;

        <Card>;
          <CardHeader><CardTitle>Emergency Contact</CardTitle></CardHeader>;
          >;
            <div><Label>Name:</Label> <p>{displayData(patient.emergency_contact_name)}</p>>;
            <div><Label>Relation:</Label> <p>{displayData(patient.emergency_contact_relation)}</p>>;
            <div><Label>Phone:</Label> <p>{displayData(patient.emergency_contact_phone)}</p></div>;
          </CardContent>;
        </Card>;

        <Card>;
          <CardHeader><CardTitle>Medical Information</CardTitle></CardHeader>;
          >;
            <div><Label>Allergies:</Label> <p className="whitespace-pre-wrap">{displayData(patient.allergies)}</p>>;
            <div><Label>Past Medical History:</Label> <p className="whitespace-pre-wrap">{displayData(patient.past_medical_history)}</p>>;
            <div><Label>Current Medications:</Label> <p className="whitespace-pre-wrap">{displayData(patient.current_medications)}</p></div>;
          </CardContent>;
        </Card>;

        <Card>;
          <CardHeader><CardTitle>Insurance Information</CardTitle></CardHeader>;
          >;
            <div><Label>Provider:</Label> <p>{displayData(patient.insurance_provider)}</p>>;
            <div><Label>Policy Number:</Label> <p>{displayData(patient.insurance_policy_number)}</p></div>;
          </CardContent>;
        </Card>;

         <Card>;
          <CardHeader><CardTitle>Registration Details</CardTitle></CardHeader>;
          >;
            <div><Label>Registered On:</Label> <p>{new Date(patient.registration_date).toLocaleString()}</p>>;
            {/* TODO: Fetch and display name of user who registered the patient */}
            <div><Label>Registered By User ID:</Label> <p>{displayData(patient.registered_by_user_id?.toString())}</p></div>;
            <div><Label>Last Updated:</Label> <p>{new Date(patient.updated_at).toLocaleString()}</p></div>;
          </CardContent>;
        </Card>;

      </div>;
    </DashboardLayout>;
  );
)