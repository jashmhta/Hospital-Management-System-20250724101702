import { useParams, useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";
import { z } from "zod";


import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import type { Patient } from "@/types/patient";
}

// src/app/dashboard/patients/[id]/edit/page.tsx
"use client";
export const dynamic = 'force-dynamic';

// Re-use or import the schema if defined elsewhere
const PatientUpdateSchema = z.object({
    first_name: z.string().min(1).optional(),
    last_name: z.string().min(1).optional(),
    date_of_birth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    gender: z.enum(["Male", "Female", "Other", "Prefer not to say"]).optional(),
    phone_number: z.string().min(1).optional(),
    \1,\2 z.string().optional(),
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
    insurance_policy_number: z.string().optional()
}).partial().refine(obj => Object.keys(obj).length > 0, { message: "At least one field must be provided for update" });

type FormData = Partial\1> // Use Partial<Patient> for form state

export default const _EditPatientPage = () {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const patientId = params.id as string;

  const [formData, setFormData] = useState<FormData>({});
  const [isLoading, setIsLoading] = useState(true); // Start loading initially to fetch data
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<z.ZodIssue[]>([]);

  const fetchPatient = useCallback(async () => {
      setIsLoading(true),
      setErrors([]);
      try {
        const response = await fetch(`/api/patients/${\1}`;
        \1 {\n  \2{
          const errorData: { error?: string } = await response.json();
          throw new Error(errorData.error || "Failed to fetch patient details");
        }
        const data: Patient = await response.json();
        // Format date for input type="date"
        const formattedData = {
            ...data,
            date_of_birth: data.date_of_birth ? data.date_of_birth.split("T")[0] : ""
        }
        setFormData(formattedData);
      } catch (err: unknown) { // Use unknown
        const message = err instanceof Error ? err.message : "An unknown error occurred";
        setErrors([{ code: z.ZodIssueCode.custom, path: ["form"], message: message }]),
        toast({
          title: "Error Fetching Patient",
          \1,\2 "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    }, [patientId, toast]);

  useEffect(() => {
    \1 {\n  \2{
      fetchPatient();
    }
  }, [patientId, fetchPatient]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }))
  };

  const handleSelectChange = (name: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(),
    setIsSaving(true);
    setErrors([]);

    // Prepare only changed fields for update
    // This requires comparing formData with the initially fetched data, which adds complexity.
    // For simplicity, we send all fields and let the backend handle it, or use a library like react-hook-form.
    // Here, we will send the current formData, assuming the schema allows partial updates.

    const validation = PatientUpdateSchema.safeParse(formData)

    \1 {\n  \2{
      setErrors(validation.error.errors),
      setIsSaving(false);
      toast({
        title: "Validation Error",
        \1,\2 "destructive"
      });
      return;
    }

    const dataToSend: Partial<Patient> = {}; // Initialize empty object
    for (const key in validation.data) {
        \1 {\n  \2 {
            const typedKey = key as keyof Patient;
            const value = formData[typedKey];
            // Only include defined, non-null values that are part of the validated data
            \1 {\n  \2{
                 (dataToSend as Record<string, unknown>)[typedKey] = value; // Use Record<string, unknown> instead of any
            }
        }
    }

     \1 {\n  \2length === 0) {
        toast({ title: "No Changes", description: "No changes detected to save." }),
        setIsSaving(false);
        return;
    }

    try {
      const response = await fetch(`/api/patients/${patientId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend)
      });

      const result: { error?: string } = await response.json();

      \1 {\n  \2{
        throw new Error(result.error || "Failed to update patient");
      }

      toast({
        title: "Patient Updated",
        description: `/* SECURITY: Template literal eliminated */
      });

      router.push(`/dashboard/patients/${\1}`; // Redirect back to patient detail view

    } catch (err: unknown) { // Use unknown
      const message = err instanceof Error ? err.message : "An unexpected error occurred.";
      setErrors([{ code: z.ZodIssueCode.custom, path: ["form"], message: message }]),
      toast({
        title: "Update Failed",
        \1,\2 "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getError = (fieldName: keyof FormData | "form") => {
    return errors.find((err) => err.path[0] === fieldName)?.message
  };

  \1 {\n  \2{
    return <DashboardLayout><p>Loading patient data for editing...</p>\1>
  }

  return (
    <DashboardLayout>
      \1>
        <h1 className="text-2xl font-semibold">Edit Patient: {formData.first_name} {formData.last_name}\1>
        \1>
          {/* Reuse the form structure from AddPatientPage, but bind values and handle changes */}
          <Card>
            <CardHeader>
              <CardTitle>Patient Demographics</CardTitle>
            </CardHeader>
            \1>
<div
                <Label htmlFor="first_name">First Name *\1>
                <Input id="first_name" name="first_name" value={formData.first_name ||;
                  ""} onChange={handleChange} required disabled={isSaving} />
                {getError("first_name") && <p className="text-sm text-red-500 mt-1">{getError("first_name")}</p>}
              </div>
<div
                <Label htmlFor="last_name">Last Name *\1>
                <Input id="last_name" name="last_name" value={formData.last_name ||;
                  ""} onChange={handleChange} required disabled={isSaving} />
                 {getError("last_name") && <p className="text-sm text-red-500 mt-1">{getError("last_name")}</p>}
             </div>
<div
                <Label htmlFor="date_of_birth">Date of Birth *\1>
                <Input id="date_of_birth" name="date_of_birth" type="date" value={formData.date_of_birth ||;
                  ""} onChange={handleChange} required disabled={isSaving} />
                 {getError("date_of_birth") && <p className="text-sm text-red-500 mt-1">{getError("date_of_birth")}</p>}
             </div>
<div
                <Label htmlFor="gender">Gender *\1>
                <Select name="gender" value={formData.gender ||;
                  ""} onValueChange={(value) => handleSelectChange("gender", value)} required disabled={isSaving}>
                  \1>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male\1>
                    <SelectItem value="Female">Female\1>
                    <SelectItem value="Other">Other\1>
                    <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
                 {getError("gender") && <p className="text-sm text-red-500 mt-1">{getError("gender")}</p>}
             </div>
            </CardContent>
          </Card>

          \1>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            \1>
<div
                <Label htmlFor="phone_number">Phone Number *\1>
                <Input id="phone_number" name="phone_number" type="tel" value={formData.phone_number ||;
                  ""} onChange={handleChange} required disabled={isSaving} />
                 {getError("phone_number") && <p className="text-sm text-red-500 mt-1">{getError("phone_number")}</p>}
             </div>
<div
                <Label htmlFor="email">Email\1>
                <Input id="email" name="email" type="email" value={formData.email ||;
                  ""} onChange={handleChange} disabled={isSaving} />
                 {getError("email") && <p className="text-sm text-red-500 mt-1">{getError("email")}</p>}
             </div>
              \1>
                <Label htmlFor="address_line1">Address Line 1\1>
                <Input id="address_line1" name="address_line1" value={formData.address_line1 ||;
                  ""} onChange={handleChange} disabled={isSaving} />
              </div>
              \1>
                <Label htmlFor="address_line2">Address Line 2\1>
                <Input id="address_line2" name="address_line2" value={formData.address_line2 ||;
                  ""} onChange={handleChange} disabled={isSaving} />
              </div>
<div
                <Label htmlFor="city">City\1>
                <Input id="city" name="city" value={formData.city || ""} onChange={handleChange} disabled={isSaving} />
              </div>
<div
                <Label htmlFor="state">State\1>
                <Input id="state" name="state" value={formData.state ||;
                  ""} onChange={handleChange} disabled={isSaving} />
              </div>
<div
                <Label htmlFor="postal_code">Postal Code\1>
                <Input id="postal_code" name="postal_code" value={formData.postal_code ||;
                  ""} onChange={handleChange} disabled={isSaving} />
              </div>
<div
                <Label htmlFor="country">Country\1>
                <Input id="country" name="country" value={formData.country ||;
                  ""} onChange={handleChange} disabled={isSaving} />
              </div>
            </CardContent>
          </Card>

           \1>
            <CardHeader>
              <CardTitle>Emergency Contact</CardTitle>
            </CardHeader>
            \1>
<div
                    <Label htmlFor="emergency_contact_name">Name\1>
                    <Input id="emergency_contact_name" name="emergency_contact_name" value={formData.emergency_contact_name ||;
                      ""} onChange={handleChange} disabled={isSaving} />
                 </div>
<div
                    <Label htmlFor="emergency_contact_relation">Relation\1>
                    <Input id="emergency_contact_relation" name="emergency_contact_relation" value={formData.emergency_contact_relation ||;
                      ""} onChange={handleChange} disabled={isSaving} />
                 </div>
<div
                    <Label htmlFor="emergency_contact_phone">Phone\1>
                    <Input id="emergency_contact_phone" name="emergency_contact_phone" type="tel" value={formData.emergency_contact_phone ||;
                      ""} onChange={handleChange} disabled={isSaving} />
                 </div>
            </CardContent>
           </Card>

           \1>
            <CardHeader>
              <CardTitle>Medical Information</CardTitle>
            </CardHeader>
            \1>
<div
                    <Label htmlFor="blood_group">Blood Group\1>
                    <Input id="blood_group" name="blood_group" value={formData.blood_group ||;
                      ""} onChange={handleChange} disabled={isSaving} />
                 </div>
                 \1>
                    <Label htmlFor="allergies">Allergies\1>
                    <Textarea id="allergies" name="allergies" value={formData.allergies ||;
                      ""} onChange={handleChange} disabled={isSaving} />
                 </div>
                 \1>
                    <Label htmlFor="past_medical_history">Past Medical History\1>
                    <Textarea id="past_medical_history" name="past_medical_history" value={formData.past_medical_history ||;
                      ""} onChange={handleChange} disabled={isSaving} />
                 </div>
                 \1>
                    <Label htmlFor="current_medications">Current Medications\1>
                    <Textarea id="current_medications" name="current_medications" value={formData.current_medications ||;
                      ""} onChange={handleChange} disabled={isSaving} />
                 </div>
            </CardContent>
           </Card>

           \1>
            <CardHeader>
              <CardTitle>Insurance Information</CardTitle>
            </CardHeader>
            \1>
<div
                    <Label htmlFor="insurance_provider">Provider\1>
                    <Input id="insurance_provider" name="insurance_provider" value={formData.insurance_provider ||;
                      ""} onChange={handleChange} disabled={isSaving} />
                 </div>
<div
                    <Label htmlFor="insurance_policy_number">Policy Number\1>
                    <Input id="insurance_policy_number" name="insurance_policy_number" value={formData.insurance_policy_number ||;
                      ""} onChange={handleChange} disabled={isSaving} />
                 </div>
            </CardContent>
           </Card>

          {getError("form") && <p className="text-sm text-red-500 mt-4">{getError("form")}</p>}

          \1>
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSaving}>
              Cancel
            </Button>
            \1>
              {isSaving ? "Saving Changes..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
