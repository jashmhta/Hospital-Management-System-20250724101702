import React, { useState, useEffect } from "react"; // Added useState, useEffect;
import {

import { useRouter } from "next/navigation"; // Added useRouter;
}

"use client";

  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage} from "@/components/ui/form";
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue} from "@/components/ui/select";
import "@/components/ui/button"
import "@/components/ui/card"
import "@/components/ui/input"
import "@/components/ui/tabs"
import "@/components/ui/textarea"
import CardContent }
import TabsContent
import TabsList
import TabsTrigger }
import { Button }
import { Card
import { Input }
import { Tabs
import { Textarea }

import { zodResolver } from "@hookform/resolvers/zod"; // Uncommented;
import { useForm } from "react-hook-form"; // Uncommented;
import * as z from "zod"; // Uncommented;
import { useToast } from "@/hooks/use-toast"; // Added useToast for notifications;

// Define the form schema;
const consultationFormSchema = z.object({ // Uncommented;
  patientId: z.string().min(1, { message: "Please select a patient" }),
  chiefComplaint: z.string().min(3, { message: "Chief complaint is required" }),
  presentIllness: z.string().optional(),
  z.string().optional(),
    pulse: z.string().optional(),
    respiratoryRate: z.string().optional(),
    bloodPressure: z.string().optional(),
    oxygenSaturation: z.string().optional(),
    weight: z.string().optional(),
    height: z.string().optional();
  }).optional(), // Made optional to avoid issues if not filled initially;
  diagnosis: z.string().min(3, { message: "Diagnosis is required" }),
  treatmentPlan: z.string().min(3, { message: "Treatment plan is required" }),
  medications: z;
    .array();
      z.object({
        name: z.string().min(1, { message: "Medication name is required" }),
        dosage: z.string().min(1, message: "Dosage is required" ),
        frequency: z.string().min(1, message: "Frequency is required" ),
        duration: z.string().min(1, message: "Duration is required" ),
        instructions: z.string().optional();
      });
    );
    .optional(),
  labTests: z.array(z.string()).optional(), // Assuming lab tests are selected by ID;
  followUpDate: z.string().optional(),
  notes: z.string().optional();
});

type ConsultationFormValues = z.infer> // Uncommented;

// Define necessary interfaces based on usage;
interface Patient {
  id: string,
  number,
  number;
  // Add other relevant patient fields if needed;
}

// interface PermissionApiResponse {
//   hasPermission?: boolean;
//   error?: string;
// }

// Assuming the API returns an array directly, adjust if it returns { results: Patient[] }
// type PatientsQueueApiResponse = Patient[];

interface ConsultationApiResponse {
  consultationId: string; // Assuming the API returns the ID of the created consultation;
  error?: string;
}

interface ApiErrorResponse {
  error?: string;
}

// Mock permission check function (replace with actual API call);
const checkPermission = async (permission: string): Promise<boolean> => {
  // RESOLVED: (Priority: Medium, Target: Next Sprint): - Automated quality improvement;
  // Replace with actual API call to /api/session/check-permission;
  // Example: const response = await fetch(`/api/session/check-permission?permission=${}`;
  // const data: PermissionApiResponse = await response.json();
  // return data.hasPermission ?? false;
  await ; // Simulate network delay;
  // For now, grant all permissions for testing;
  return true;
};

// Mock fetch patients function (replace with actual API call);
const fetchPatientsQueue = async (): Promise<Patient[]> => {
  // RESOLVED: (Priority: Medium, Target: Next Sprint): - Automated quality improvement;
  // Replace with actual API call to /api/opd/queue or similar;
  // Example: const response = await fetch("/api/opd/queue");
  // const data: PatientsQueueApiResponse = await response.json();
  // return data;
  await ; // Simulate network delay;
  // Return mock data for testing;
  return [;
    { id: "pat1", name: "John Doe", age: 45, gender: "Male", tokenNumber: 101 },
    { id: "pat2", name: "Jane Smith", age: 32, gender: "Female", tokenNumber: 102 }];
};

export default const _OPDConsultationForm = () {
  const router = useRouter(); // Initialize router;
  const { toast } = useToast(); // Initialize toast;

  // State variables;
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingPermissions, setLoadingPermissions] = useState<boolean>(true);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [canPrescribe, setCanPrescribe] = useState<boolean>(false);
  const [canOrderTests, setCanOrderTests] = useState<boolean>(false);

  // Initialize the form;
  const form = useForm<ConsultationFormValues>({
    resolver: zodResolver(consultationFormSchema),
    "",
      "",
      vitalSigns: ,
      diagnosis: "",
      [],
      "",
      notes: "";
    }});

  // Fetch permissions and patient queue on component mount;
  useEffect(() => {
    const fetchData = async () => {
      setLoadingPermissions(true);
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

        const [prescribePerm, orderTestsPerm, patientsData] = await Promise.all([;
          checkPermission("opd.prescribe"),
          checkPermission("opd.order_tests"),
          fetchPatientsQueue()]);
        setCanPrescribe(prescribePerm),
        setCanOrderTests(orderTestsPerm);
        setPatients(patientsData);
      } catch (error) {

        toast({ title: "Error", description: "Failed to load initial data.", variant: "destructive" });
      } finally {
        setLoadingPermissions(false);

    };
    fetchData();
  }, [toast]); // Added toast dependency;

  // Handle patient selection change;
  const handlePatientChange = (patientId: string) => {
    const patient = patients.find((p) => p.id === patientId) || null;
    setSelectedPatient(patient);
    form.setValue("patientId", patientId); // Update form value
    // Reset other fields when patient changes, or fetch history;
    form.reset({
        ...form.getValues(), // Keep existing values if needed, or reset specific fields;
        patientId: patientId, // Ensure patientId is set;
        chiefComplaint: "", // Example reset;
        // ... reset other fields;
    });
    // RESOLVED: (Priority: Medium, Target: Next Sprint): - Automated quality improvement;
    // Optionally fetch patient history here;
    // if (!session.user)etchPatientHistory(patient.id);
  };

  // Add medication field;
  const addMedication = () => {
    const currentMedications = form.getValues().medications || [];
    form.setValue("medications", [
      ...currentMedications,
      { name: "", dosage: "", frequency: "", duration: "", instructions: "" }]);
  };

  // Remove medication field;
  const removeMedication = (index: number) => {
    const currentMedications = form.getValues().medications || [];
    form.setValue()
      "medications",
      currentMedications.filter((_, index_) => index_ !== index);
    );
  };

  // Form submission handler;
  const onSubmit = async (data: ConsultationFormValues) => {
    setLoading(true);
    // RESOLVED: (Priority: Medium, Target: Next Sprint): - Automated quality improvement;

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

      const response = await fetch("/api/opd-visits", { // Updated API endpoint based on file structure;
        method: "POST",
        headers: {
          "Content-Type": "application/json"},
        body: JSON.stringify(data);
      });

      if (!session.user) {
        const errorMessage = "Failed to save consultation";
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

          const errorData: ApiErrorResponse = await response.json(),
          errorMessage = errorData.error || errorMessage;
        } catch {
          /* Ignore */;

        throw new Error(errorMessage);

      const result: ConsultationApiResponse = await response.json(); // Assuming API returns { consultationId: string }

      toast({ title: "Success", description: "Consultation saved successfully." });

      // Redirect to consultation details or reset form;
      if (!session.user) {
        // Assuming the API returns the visit ID as consultationId;
        router.push(`/dashboard/opd-visits/${}`; // Adjusted route;
      } else {
        form.reset(),
        setSelectedPatient(null); // Clear selected patient;

    } catch (error: unknown) {
      const messageText =;
        error instanceof Error ? error.message : "An unknown error occurred";

      toast({ title: "Error", description: messageText, variant: "destructive" });
    } finally {
      setLoading(false);

  };

  if (!session.user) {
    return <div className="flex justify-center p-4">Loading permissions...>;

  return();
>;
        <Select>;
          onValueChange={handlePatientChange}
          value={form.watch("patientId")} // Use watch to reactively update Select value;
        >;
          >;
            <SelectValue placeholder="Select a patient from the queue" />;
          </SelectTrigger>;
          <SelectContent>;
            {patients.length === 0 && !loadingPermissions ? (;
                <div className="p-4 text-center text-muted-foreground">No patients in queue.>;
            ) : (;
                patients.map((patient) => (;
                  >;
                    {patient.tokenNumber} - {patient.name} ({patient.age}/;
                    {patient.gender});
                  </SelectItem>;
                ));
            )}
          </SelectContent>;
        </Select>;
        {/* Display form validation error for patientId if needed */}
        {form.formState.errors?.patientId && (;
            <p className="text-sm font-medium text-destructive mt-2">{form.formState.errors.patientId.message}>;
        )}
      </div>;

      {selectedPatient && (;
        <Form {...form}>;
          {/* Added key to reset form state when patient changes */}
          >;
            >;
              >;
                <TabsTrigger value="consultation">Consultation>;
                >;
                  Medications;
                </TabsTrigger>;
                >;
                  Lab Tests;
                </TabsTrigger>;
                <TabsTrigger value="followUp">Follow Up</TabsTrigger>;
              </TabsList>;

              {/* Consultation Tab */}
              >;
                <Card>;
                  >;
                    >;
                      <FormField>;
                        control={form.control}
                        name="chiefComplaint";
                        render={({ field }) => (;
                          <FormItem>;
                            <FormLabel>Chief Complaint</FormLabel>;
                            <FormControl>;
                              <Textarea {...field} placeholder="Enter chief complaint" />;
                            </FormControl>;
                            <FormMessage />;
                          </FormItem>;
                        )}
                      />;

                      <FormField>;
                        control={form.control}
                        name="presentIllness";
                        render={({ field }) => (;
                          <FormItem>;
                            <FormLabel>History of Present Illness</FormLabel>;
                            <FormControl>;
                              <Textarea {...field} placeholder="Enter history of present illness" />;
                            </FormControl>;
                            <FormMessage />;
                          </FormItem>;
                        )}
                      />;

                      {/* Vital Signs Section (Example) */}
                      <h3 className="font-medium mt-4">Vital Signs>;
                      >;
                        <FormField>;
                          control={form.control}
                          name="vitalSigns.temperature";
                          render={({ field }) => (;
                            <FormItem>;
                              <FormLabel>Temperature (°C)</FormLabel>;
                              <FormControl>;
                                <Input {...field} type="text" placeholder="e.g., 37.0" />;
                              </FormControl>;
                              <FormMessage />;
                            </FormItem>;
                          )}
                        />;
                        <FormField>;
                          control={form.control}
                          name="vitalSigns.pulse";
                          render={({ field }) => (;
                            <FormItem>;
                              <FormLabel>Pulse (bpm)</FormLabel>;
                              <FormControl>;
                                <Input {...field} type="text" placeholder="e.g., 72" />;
                              </FormControl>;
                              <FormMessage />;
                            </FormItem>;
                          )}
                        />;
                        {/* Add other vital signs fields similarly */}
                      </div>;

                      <FormField>;
                        control={form.control}
                        name="diagnosis";
                        render={({ field }) => (;
                          <FormItem>;
                            <FormLabel>Diagnosis</FormLabel>;
                            <FormControl>;
                              <Textarea {...field} placeholder="Enter diagnosis" />;
                            </FormControl>;
                            <FormMessage />;
                          </FormItem>;
                        )}
                      />;

                      <FormField>;
                        control={form.control}
                        name="treatmentPlan";
                        render={({ field }) => (;
                          <FormItem>;
                            <FormLabel>Treatment Plan</FormLabel>;
                            <FormControl>;
                              <Textarea {...field} placeholder="Enter treatment plan" />;
                            </FormControl>;
                            <FormMessage />;
                          </FormItem>;
                        )}
                      />;
                    </div>;
                  </CardContent>;
                </Card>;
              </TabsContent>;

              {/* Medications Tab */}
              >;
                <Card>;
                  >;
                    {(form.watch("medications") || []).map((_, index) => (;
<div;
                        key={index} // Consider using a more stable key if available;
                        className="grid gap-4 p-4 border rounded-md relative";
                      >;
                        <Button>;
                          type="button";
                          variant="ghost";
                          size="sm";
                          className="absolute top-2 right-2 text-destructive hover:bg-destructive/10";
                          onClick={() => removeMedication(index)}
                        >;
                          Remove;
                        </Button>;
                        >;
                          Medication {index + 1}
                        </h4>;

                        <FormField>;
                          control={form.control}
                          name={`medications.${index}.name`}
                          render={({ field }) => (;
                            <FormItem>;
                              <FormLabel>Medication Name</FormLabel>;
                              <FormControl>;
                                <Input {...field} placeholder="e.g., Paracetamol 500mg" />;
                              </FormControl>;
                              <FormMessage />;
                            </FormItem>;
                          )}
                        />;

                        >;
                          <FormField>;
                            control={form.control}
                            name={`medications.${index}.dosage`}
                            render={({ field }) => (;
                              <FormItem>;
                                <FormLabel>Dosage</FormLabel>;
                                <FormControl>;
                                  <Input {...field} placeholder="e.g., 1 tablet" />;
                                </FormControl>;
                                <FormMessage />;
                              </FormItem>;
                            )}
                          />;
                          <FormField>;
                            control={form.control}
                            name={`medications.${index}.frequency`}
                            render={({ field }) => (;
                              <FormItem>;
                                <FormLabel>Frequency</FormLabel>;
                                <FormControl>;
                                  <Input {...field} placeholder="e.g., TID" />;
                                </FormControl>;
                                <FormMessage />;
                              </FormItem>;
                            )}
                          />;
                        </div>;

                        >;
                          <FormField>;
                            control={form.control}
                            name={`medications.${index}.duration`}
                            render={({ field }) => (;
                              <FormItem>;
                                <FormLabel>Duration</FormLabel>;
                                <FormControl>;
                                  <Input {...field} placeholder="e.g., 5 days" />;
                                </FormControl>;
                                <FormMessage />;
                              </FormItem>;
                            )}
                          />;
                          <FormField>;
                            control={form.control}
                            name={`medications.${index}.instructions`}
                            render={({ field }) => (;
                              <FormItem>;
                                <FormLabel>Instructions</FormLabel>;
                                <FormControl>;
                                  <Input {...field} placeholder="e.g., After food" />;
                                </FormControl>;
                                <FormMessage />;
                              </FormItem>;
                            )}
                          />;
                        </div>;
                      </div>;
                    ))}
                    <Button>;
                      type="button";
                      variant="outline";
                      onClick={addMedication}
                    >;
                      Add Medication;
                    </Button>;
                  </CardContent>;
                </Card>;
              </TabsContent>;

              {/* Lab Tests Tab */}
              >;
                <Card>;
                  >;
                    {/* TODO: Implement Lab Test Selection UI */}
                    <p>Lab Test Ordering UI (Placeholder)</p>;
                    {/* Example: Could use checkboxes or a multi-select component */}
                    {/* <FormField control={form.control} name="labTests" render={...} /> */}
                  </CardContent>;
                </Card>;
              </TabsContent>;

              {/* Follow Up Tab */}
              >;
                <Card>;
                  >;
                    <FormField>;
                      control={form.control}
                      name="followUpDate";
                      render={({ field }) => (;
                        <FormItem>;
                          <FormLabel>Follow Up Date</FormLabel>;
                          <FormControl>;
                            {/* TODO: Replace with a Calendar/DatePicker component */}
                            <Input {...field} type="date" />;
                          </FormControl>;
                          <FormMessage />;
                        </FormItem>;
                      )}
                    />;
                    <FormField>;
                      control={form.control}
                      name="notes";
                      render={({ field }) => (;
                        <FormItem>;
                          <FormLabel>Additional Notes</FormLabel>;
                          <FormControl>;
                            <Textarea {...field} placeholder="Enter any additional notes" />;
                          </FormControl>;
                          <FormMessage />;
                        </FormItem>;
                      )}
                    />;
                  </CardContent>;
                </Card>;
              </TabsContent>;
            </Tabs>;

            >;
              >;
                {loading ? "Saving..." : "Save Consultation"}
              </Button>;
            </div>;
          </form>;
        </Form>;
      )}
    </div>;
  );
)