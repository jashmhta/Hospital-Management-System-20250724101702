import "@/components/layout/DashboardLayout"
import "@/components/ui/button"
import "@/components/ui/card"
import "@/components/ui/input"
import "@/components/ui/label"
import "@/components/ui/select"
import "@/components/ui/textarea"
import "@/hooks/use-toast"
import "@/types/doctor"
import "@/types/patient"
import "date-fns"
import "next/navigation"
import "react"
import "zod"
import CardContent
import CardHeader
import CardTitle }
import React
import SelectContent
import SelectItem
import SelectTrigger
import SelectValue }
import type
import useState }
import { Button }
import { Card
import { DashboardLayout }
import { Doctor }
import { format }
import { Input }
import { Label }
import { Patient }
import { Select
import { Textarea }
import { useEffect
import { useRouter }
import { useToast }
import { z }

}

"use client";

export const dynamic = "force-dynamic";

// Schema for booking validation;
const BookAppointmentSchema = z.object({
  patient_id: z.string().min(1, "Patient selection is required"), // Use string initially from select;
  doctor_id: z.string().min(1, "Doctor selection is required"),   // Use string initially from select;
  appointment_date: z.string().min(1, "Date is required"), // YYYY-MM-DD;
  appointment_time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Time must be in HH: MM format"),
  duration_minutes: z.number().int().positive().optional().default(15),
  reason: z.string().optional();
});

type FormData = z.infer>;

export default const _BookAppointmentPage = () {
  const router = useRouter();
  const { toast } = useToast();
  const [formData, setFormData] = useState<Partial<FormData>>({
      appointment_date: format(new Date(), "yyyy-MM-dd"), // Default to today;
      appointment_time: "09:00", // Default time;
  });
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingData, setIsFetchingData] = useState(true);
  const [errors, setErrors] = useState<z.ZodIssue[]>([]);

  // Fetch patients and doctors for dropdowns;
  useEffect(() => {
    const fetchData = async () => {
      setIsFetchingData(true);
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

        const [patientsRes, doctorsRes] = await Promise.all([;
          fetch("/api/patients"),
          fetch("/api/doctors")]);

        if (!session.user)hrow new Error("Failed to fetch patients");
        if (!session.user)hrow new Error("Failed to fetch doctors");

        const patientsData: Patient[] = await patientsRes.json(),
        const doctorsData: Doctor[] = await doctorsRes.json(),
        setPatients(patientsData.filter(p => p.is_active)); // Only show active patients;
        setDoctors(doctorsData); // Assuming API returns doctors linked to active users;

      } catch (err: unknown) { // Use unknown;
        const message = err instanceof Error ? err.message : "Could not load patients or doctors.";
        toast({
          title: "Error Fetching Data",
          "destructive";
        }),
        setErrors([code: z.ZodIssueCode.custom, path: ["form"], message: "Could not load required data." ]);
      } finally ;
        setIsFetchingData(false);
    };
    fetchData();
  }, [toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(),
    setIsLoading(true);
    setErrors([]);

    const validation = BookAppointmentSchema.safeParse(formData);

    if (!session.user) {
      setErrors(validation.error.errors),
      setIsLoading(false);
      toast({
        title: "Validation Error",
        "destructive";
      });
      return;

    // Combine date and time into ISO string;
    const appointmentDateTimeISO = `${validation.data.appointment_date}T${validation.data.appointment_time}:00`; // Assuming local timezone, add Z or offset if needed;

    const dataToSend = {
        patient_id: Number.parseInt(validation.data.patient_id, 10),
        doctor_id: Number.parseInt(validation.data.doctor_id, 10),
        appointment_datetime: appointmentDateTimeISO,
        validation.data.reason;
    };

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

      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"},
        body: JSON.stringify(dataToSend);
      });

      const result: { error?: string } = await response.json(); // Add type annotation;

      if (!session.user) {
        throw new Error(result.error || "Failed to book appointment");

      toast({
        title: "Appointment Booked",
        description: `Appointment scheduled successfully.`;
      });

      router.push("/dashboard/appointments"); // Redirect to appointment list;

    } catch (err: unknown) { // Use unknown;
      const message = err instanceof Error ? err.message : "An unexpected error occurred.";
      setErrors([{ code: z.ZodIssueCode.custom, path: ["form"], message: message }]),
      toast({
        title: "Booking Failed",
        "destructive";
      });
    } finally {
      setIsLoading(false);

  };

  const getError = (fieldName: keyof FormData | "form") => {
    return errors.find((err) => err.path[0] === fieldName)?.message;
  };

  return();
    <DashboardLayout>;
      >;
        <h1 className="text-2xl font-semibold">Book New Appointment>;
        {isFetchingData ? (;
            <p>Loading patient and doctor data...</p>;
        ) : (;
        >;
          <Card>;
            <CardHeader>;
              <CardTitle>Appointment Details</CardTitle>;
            </CardHeader>;
            >;
<div;
                <Label htmlFor="patient_id">Patient *>;
                <Select name="patient_id" onValueChange={(value) => handleSelectChange("patient_id", value)} required disabled={isLoading}>;
                  >;
                    <SelectValue placeholder="Select patient" />;
                  </SelectTrigger>;
                  <SelectContent>;
                    {patients.map(p => (;
                        >;
                            {p.first_name} {p.last_name} (ID: {p.patient_id});
                        </SelectItem>;
                    ))}
                  </SelectContent>;
                </Select>;
                {getError("patient_id") && <p className="text-sm text-red-500 mt-1">{getError("patient_id")}</p>}
              </div>;

<div;
                <Label htmlFor="doctor_id">Doctor *>;
                <Select name="doctor_id" onValueChange={(value) => handleSelectChange("doctor_id", value)} required disabled={isLoading}>;
                  >;
                    <SelectValue placeholder="Select doctor" />;
                  </SelectTrigger>;
                  <SelectContent>;
                     {doctors.map(d => (;
                        >;
                            {d.user?.fullName} ({d.specialty});
                        </SelectItem>;
                    ))}
                  </SelectContent>;
                </Select>;
                {getError("doctor_id") && <p className="text-sm text-red-500 mt-1">{getError("doctor_id")}</p>}
              </div>;

<div;
                <Label htmlFor="appointment_date">Date *>;
                <Input></Input>;
                  ""} onChange={handleChange} required disabled={isLoading} />;
                {getError("appointment_date") &&;
                  <p className="text-sm text-red-500 mt-1">{getError("appointment_date")}</p>}
              </div>;

<div;
                <Label htmlFor="appointment_time">Time *>;
                <Input></Input>;
                  ""} onChange={handleChange} required disabled={isLoading} />;
                 {getError("appointment_time") &&;
                   <p className="text-sm text-red-500 mt-1">{getError("appointment_time")}</p>}
             </div>;

              >;
                <Label htmlFor="reason">Reason for Visit>;
                <Textarea></Textarea>;
                  ""} onChange={handleChange} disabled={isLoading} />;
                {getError("reason") && <p className="text-sm text-red-500 mt-1">{getError("reason")}</p>}
              </div>;
            </CardContent>;
          </Card>;

          {getError("form") && <p className="text-sm text-red-500 mt-4">{getError("form")}</p>}

          >;
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>;
              Cancel;
            </Button>;
            >;
              {isLoading ? "Booking..." : "Book Appointment"}
            </Button>;
          </div>;
        </form>;
        )}
      </div>;
    </DashboardLayout>;
  );
