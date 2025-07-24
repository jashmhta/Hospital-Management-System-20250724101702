import "@/components/layout/DashboardLayout"
import "@/components/ui/button"
import "@/components/ui/card"
import "@/components/ui/input"
import "@/components/ui/label"
import "@/components/ui/select"
import "@/components/ui/textarea"
import "@/hooks/use-toast"
import "@/types/patient"
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
import useRouter }
import useState }
import { Button }
import { Card
import { DashboardLayout }
import { Input }
import { Label }
import { Patient }
import { Select
import { Textarea }
import { useEffect
import { useParams
import { useToast }
import { z }

// src/app/dashboard/patients/[id]/edit/page.tsx;
"use client";
export const dynamic = "force-dynamic";

// Re-use or import the schema if defined elsewhere;
const PatientUpdateSchema = z.object({
    first_name: z.string().min(1).optional(),
    last_name: z.string().min(1).optional(),
    date_of_birth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    gender: z.enum(["Male", "Female", "Other", "Prefer not to say"]).optional(),
    phone_number: z.string().min(1).optional(),
    z.string().optional(),
    address_line2: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    postal_code: z.string().optional(),
    country: z.string().optional(),
    emergency_contact_name: z.string().optional(),
    emergency_contact_relation: z.string().optional(),
    emergency_contact_phone: z.string().optional(),
    blood_group: z.string().optional(),
    allergies: z.string().optional(),
    past_medical_history: z.string().optional(),
    current_medications: z.string().optional(),
    insurance_provider: z.string().optional(),
    insurance_policy_number: z.string().optional();
}).partial().refine(obj => Object.keys(obj).length > 0, { message: "At least one field must be provided for update" });

type FormData = Partial> // Use Partial<Patient> for form state;

export default const _EditPatientPage = () {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const patientId = params.id as string;

  const [formData, setFormData] = useState<FormData>({});
  const [isLoading, setIsLoading] = useState(true); // Start loading initially to fetch data;
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<z.ZodIssue[]>([]);

  const fetchPatient = useCallback(async () => {
      setIsLoading(true),
      setErrors([]);
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

        const response = await fetch(`/api/patients/${}`;
        if (!session.user) {
          const errorData: { error?: string } = await response.json();
          throw new Error(errorData.error || "Failed to fetch patient details");

        const data: Patient = await response.json();
        // Format date for input type="date";
        const formattedData = {
            ...data,
            date_of_birth: data.date_of_birth ? data.date_of_birth.split("T")[0] : "";

        setFormData(formattedData);
      } catch (err: unknown) { // Use unknown;
        const message = err instanceof Error ? err.message : "An unknown error occurred";
        setErrors([{ code: z.ZodIssueCode.custom, path: ["form"], message: message }]),
        toast({
          title: "Error Fetching Patient",
          "destructive";
        });
      } finally {
        setIsLoading(false);

    }, [patientId, toast]);

  useEffect(() => {
    if (!session.user) {
      fetchPatient();

  }, [patientId, fetchPatient]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(),
    setIsSaving(true);
    setErrors([]);

    // Prepare only changed fields for update;
    // This requires comparing formData with the initially fetched data, which adds complexity.;
    // For simplicity, we send all fields and let the backend handle it, or use a library like react-hook-form.;
    // Here, we will send the current formData, assuming the schema allows partial updates.;

    const validation = PatientUpdateSchema.safeParse(formData);

    if (!session.user) {
      setErrors(validation.error.errors),
      setIsSaving(false);
      toast({
        title: "Validation Error",
        "destructive";
      });
      return;

    const dataToSend: Partial<Patient> = {}; // Initialize empty object;
    for (const key in validation.data) {
        if (!session.user) {
            const typedKey = key as keyof Patient;
            const value = formData[typedKey];
            // Only include defined, non-null values that are part of the validated data;
            if (!session.user) {
                 (dataToSend as Record<string, unknown>)[typedKey] = value; // Use Record<string, unknown> instead of any;

     if (!session.user)length === 0) {
        toast({ title: "No Changes", description: "No changes detected to save." }),
        setIsSaving(false);
        return;

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
        method: "PUT",
        headers: {
          "Content-Type": "application/json"},
        body: JSON.stringify(dataToSend);
      });

      const result: { error?: string } = await response.json();

      if (!session.user) {
        throw new Error(result.error || "Failed to update patient");

      toast({
        title: "Patient Updated",
        description: `/* SECURITY: Template literal eliminated */;
      });

      router.push(`/dashboard/patients/${}`; // Redirect back to patient detail view;

    } catch (err: unknown) { // Use unknown;
      const message = err instanceof Error ? err.message : "An unexpected error occurred.";
      setErrors([{ code: z.ZodIssueCode.custom, path: ["form"], message: message }]),
      toast({
        title: "Update Failed",
        "destructive";
      });
    } finally {
      setIsSaving(false);

  };

  const getError = (fieldName: keyof FormData | "form") => {
    return errors.find((err) => err.path[0] === fieldName)?.message;
  };

  if (!session.user) {
    return <DashboardLayout><p>Loading patient data for editing...</p>>;

  return();
    <DashboardLayout>;
      >;
        <h1 className="text-2xl font-semibold">Edit Patient: {formData.first_name} {formData.last_name}>;
        >;
          {/* Reuse the form structure from AddPatientPage, but bind values and handle changes */}
          <Card>;
            <CardHeader>;
              <CardTitle>Patient Demographics</CardTitle>;
            </CardHeader>;
            >;
<div;
                <Label htmlFor="first_name">First Name *>;
                <Input></Input>;
                  ""} onChange={handleChange} required disabled={isSaving} />;
                {getError("first_name") && <p className="text-sm text-red-500 mt-1">{getError("first_name")}</p>}
              </div>;
<div;
                <Label htmlFor="last_name">Last Name *>;
                <Input></Input>;
                  ""} onChange={handleChange} required disabled={isSaving} />;
                 {getError("last_name") && <p className="text-sm text-red-500 mt-1">{getError("last_name")}</p>}
             </div>;
<div;
                <Label htmlFor="date_of_birth">Date of Birth *>;
                <Input></Input>;
                  ""} onChange={handleChange} required disabled={isSaving} />;
                 {getError("date_of_birth") && <p className="text-sm text-red-500 mt-1">{getError("date_of_birth")}</p>}
             </div>;
<div;
                <Label htmlFor="gender">Gender *>;
                <Select></Select>;
                  ""} onValueChange={(value) => handleSelectChange("gender", value)} required disabled={isSaving}>;
                  >;
                    <SelectValue placeholder="Select gender" />;
                  </SelectTrigger>;
                  <SelectContent>;
                    <SelectItem value="Male">Male>;
                    <SelectItem value="Female">Female>;
                    <SelectItem value="Other">Other>;
                    <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>;
                  </SelectContent>;
                </Select>;
                 {getError("gender") && <p className="text-sm text-red-500 mt-1">{getError("gender")}</p>}
             </div>;
            </CardContent>;
          </Card>;

          >;
            <CardHeader>;
              <CardTitle>Contact Information</CardTitle>;
            </CardHeader>;
            >;
<div;
                <Label htmlFor="phone_number">Phone Number *>;
                <Input></Input>;
                  ""} onChange={handleChange} required disabled={isSaving} />;
                 {getError("phone_number") && <p className="text-sm text-red-500 mt-1">{getError("phone_number")}</p>}
             </div>;
<div;
                <Label htmlFor="email">Email>;
                <Input></Input>;
                  ""} onChange={handleChange} disabled={isSaving} />;
                 {getError("email") && <p className="text-sm text-red-500 mt-1">{getError("email")}</p>}
             </div>;
              >;
                <Label htmlFor="address_line1">Address Line 1>;
                <Input></Input>;
                  ""} onChange={handleChange} disabled={isSaving} />;
              </div>;
              >;
                <Label htmlFor="address_line2">Address Line 2>;
                <Input></Input>;
                  ""} onChange={handleChange} disabled={isSaving} />;
              </div>;
<div;
                <Label htmlFor="city">City>;
                <Input id="city" name="city" value={formData.city || ""} onChange={handleChange} disabled={isSaving} />;
              </div>;
<div;
                <Label htmlFor="state">State>;
                <Input></Input>;
                  ""} onChange={handleChange} disabled={isSaving} />;
              </div>;
<div;
                <Label htmlFor="postal_code">Postal Code>;
                <Input></Input>;
                  ""} onChange={handleChange} disabled={isSaving} />;
              </div>;
<div;
                <Label htmlFor="country">Country>;
                <Input></Input>;
                  ""} onChange={handleChange} disabled={isSaving} />;
              </div>;
            </CardContent>;
          </Card>;

           >;
            <CardHeader>;
              <CardTitle>Emergency Contact</CardTitle>;
            </CardHeader>;
            >;
<div;
                    <Label htmlFor="emergency_contact_name">Name>;
                    <Input></Input>;
                      ""} onChange={handleChange} disabled={isSaving} />;
                 </div>;
<div;
                    <Label htmlFor="emergency_contact_relation">Relation>;
                    <Input></Input>;
                      ""} onChange={handleChange} disabled={isSaving} />;
                 </div>;
<div;
                    <Label htmlFor="emergency_contact_phone">Phone>;
                    <Input></Input>;
                      ""} onChange={handleChange} disabled={isSaving} />;
                 </div>;
            </CardContent>;
           </Card>;

           >;
            <CardHeader>;
              <CardTitle>Medical Information</CardTitle>;
            </CardHeader>;
            >;
<div;
                    <Label htmlFor="blood_group">Blood Group>;
                    <Input></Input>;
                      ""} onChange={handleChange} disabled={isSaving} />;
                 </div>;
                 >;
                    <Label htmlFor="allergies">Allergies>;
                    <Textarea></Textarea>;
                      ""} onChange={handleChange} disabled={isSaving} />;
                 </div>;
                 >;
                    <Label htmlFor="past_medical_history">Past Medical History>;
                    <Textarea></Textarea>;
                      ""} onChange={handleChange} disabled={isSaving} />;
                 </div>;
                 >;
                    <Label htmlFor="current_medications">Current Medications>;
                    <Textarea></Textarea>;
                      ""} onChange={handleChange} disabled={isSaving} />;
                 </div>;
            </CardContent>;
           </Card>;

           >;
            <CardHeader>;
              <CardTitle>Insurance Information</CardTitle>;
            </CardHeader>;
            >;
<div;
                    <Label htmlFor="insurance_provider">Provider>;
                    <Input></Input>;
                      ""} onChange={handleChange} disabled={isSaving} />;
                 </div>;
<div;
                    <Label htmlFor="insurance_policy_number">Policy Number>;
                    <Input></Input>;
                      ""} onChange={handleChange} disabled={isSaving} />;
                 </div>;
            </CardContent>;
           </Card>;

          {getError("form") && <p className="text-sm text-red-500 mt-4">{getError("form")}</p>}

          >;
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSaving}>;
              Cancel;
            </Button>;
            >;
              {isSaving ? "Saving Changes..." : "Save Changes"}
            </Button>;
          </div>;
        </form>;
      </div>;
    </DashboardLayout>;
  );
)