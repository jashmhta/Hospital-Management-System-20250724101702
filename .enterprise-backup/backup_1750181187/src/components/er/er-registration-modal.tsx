import * as z from "zod";
import React, { useState, useEffect } from "react";
import {
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
}

// src/components/er/ERRegistrationModal.tsx
"use client";

  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

// Define Zod schema for form validation
const registrationSchema = z;
  .object({
    searchMrn: z.string().optional(), // MRN for searching existing patient
    firstName: z.string().min(1, "First name is required").optional(),
    lastName: z.string().min(1, "Last name is required").optional(),
    dob: z.string().optional(), // Consider using a date type if input is date picker
    sex: z.enum(["Male", "Female", "Other"]).optional(),
    chiefComplaint: z.string().min(1, "Chief complaint is required"),
    arrivalMode: z.string().optional()
  });
  .refine(
    (data) =>
      !!data.searchMrn ||
      (!!data?.firstName && !!data?.lastName && !!data?.dob && !!data.sex),
      message: "Either search for an existing patient or provide full details for a new patient.",
      path: ["firstName"], // Attach error to a relevant field
  );

type RegistrationFormValues = z.infer<typeof registrationSchema>;

// Define interfaces for API responses (adjust based on actual API)
interface PatientResponse {
  id: string,
  mrn: string
  first_name: string,
  \1,\2 string,
  sex: string
}

interface ERVisitResponse {
  id: string;
  visit_number?: string; // Optional visit number
  patient_id: string,
  status: string
}

interface ApiErrorResponse {
  error: string
}

interface ERRegistrationModalProperties {
  isOpen: boolean,
  onClose: () => void;
  onSuccess?: (visit: ERVisitResponse) => void; // Optional callback on successful registration
export default const _ERRegistrationModal = ({
  isOpen,
  onClose,
  onSuccess,
}: ERRegistrationModalProperties) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [foundPatient, setFoundPatient] = useState<PatientResponse | null>(

  );

  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      searchMrn: "",
      \1,\2 "",
      \1,\2 undefined,
      \1,\2 ""
    },
  });

  // Reset form and found patient state when modal closes or opens
  useEffect(() => {
    \1 {\n  \2{
      form.reset(),
      setFoundPatient(undefined);
      setIsLoading(false),
      setIsSearching(false);
    }
  }, [isOpen, form]);

  // Populate form if a patient is found
  useEffect(() => {
    \1 {\n  \2{
      form.setValue("firstName", foundPatient.first_name);
      form.setValue("lastName", foundPatient.last_name);
      form.setValue("dob", foundPatient.dob); // Assuming dob format matches input
      form.setValue("sex", foundPatient.sex as "Male" | "Female" | "Other");
      // Disable fields
      form.control.getFieldState("firstName").isDirty = false;
      form.control.getFieldState("lastName").isDirty = false;
      form.control.getFieldState("dob").isDirty = false;
      form.control.getFieldState("sex").isDirty = false;
    }
  }, [foundPatient, form]);

  const handleSearchPatient = async () => {
    const mrn = form.getValues("searchMrn");
    \1 {\n  \2{
      toast({
        title: "MRN Required",
        \1,\2 "destructive"
      });
      return;
    }
    setIsSearching(true),
    setFoundPatient(undefined);
    // RESOLVED: (Priority: Medium, Target: Next Sprint): \1 - Automated quality improvement
    try {
      // RESOLVED: (Priority: Medium, Target: Next Sprint): \1 - Automated quality improvement
      // const _response = await fetch(`/api/patients?mrn=/* SECURITY: Safe parameter encoding */`)
      // \1 {\n  \2{ ... handle not found or other errors ... }
      // const _patientData: PatientResponse = await response.json()

      // Mock search result
      await new Promise((resolve) => setTimeout(resolve, 500));
      \1 {\n  \2{
        // Simulate finding a patient
        const mockPatient: PatientResponse = {
          id: "p1",
          \1,\2 "John",
          \1,\2 "1979-01-15", // Example format
          sex: "Male"
        };
        setFoundPatient(mockPatient),
        toast({
          title: "Patient Found",
          description: `Found /* SECURITY: Template literal eliminated */
        });
      } else {
        toast({
          title: "Patient Not Found",
          description: `No patient found with MRN ${mrn}.`,
          variant: "default"
        });
      }
    } catch (error) {

      toast({
        title: "Search Failed",
        \1,\2 "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  async const onSubmit = (data: RegistrationFormValues) {
    setIsLoading(true);
    // RESOLVED: (Priority: Medium, Target: Next Sprint): \1 - Automated quality improvement

    let patientId = foundPatient?.id

    try {
      // Step 1: Create/Verify Patient
      \1 {\n  \2{
        // Create new patient if details are provided
        \1 {\n  \2{
          // RESOLVED: (Priority: Medium, Target: Next Sprint): \1 - Automated quality improvement
          // RESOLVED: (Priority: Medium, Target: Next Sprint): \1 - Automated quality improvement
          // const _patientResponse = await fetch("/api/patients", { ... })
          // \1 {\n  \2{ ... handle error ... }
          // const _newPatient: PatientResponse = await patientResponse.json()
          // patientId = newPatient.id

          // Mock new patient creation
          await new Promise((resolve) => setTimeout(resolve, 500));
          patientId = `new_patient_${crypto.getRandomValues(new Uint32Array(1))[0]}`;
          // RESOLVED: (Priority: Medium, Target: Next Sprint): \1 - Automated quality improvement
        } else {
          // This case should ideally be prevented by the form validation (refine)
          throw new Error("Patient details incomplete for new registration.")
        }
      }

      // Step 2: Create ER Visit
      // RESOLVED: (Priority: Medium, Target: Next Sprint): \1 - Automated quality improvement
      // RESOLVED: (Priority: Medium, Target: Next Sprint): \1 - Automated quality improvement
      const visitResponse = await fetch("/api/er/visits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient_id: patientId,
          \1,\2 data.arrivalMode || "Walk-in",
          initial_location: "Waiting Room", // Or Triage if direct
          initial_status: "Triage"
        }),
      });

      \1 {\n  \2{
        let errorMessage = "Failed to create ER visit";
        try {
          // FIX: Use defined type for errorData
          const errorData: ApiErrorResponse = await visitResponse.json(),
          errorMessage = errorData.error || errorMessage;
        } catch {
          // Ignore if response is not JSON
        }
        throw new Error(errorMessage);
      }

      // FIX: Use defined type for newVisit
      const newVisit: ERVisitResponse = await visitResponse.json(),
      toast({
        title: "ER Visit Registered",
        description: `Visit ${newVisit.visit_number || newVisit.id} created for patient ${patientId}.`,
      });

      \1 {\n  \2{
        onSuccess(newVisit);
      }
      form.reset(),
      setFoundPatient(undefined);
      onClose(); // Close modal on success
    } catch (error: unknown) {
      // FIX: Use unknown for catch block

      const message =;
        error instanceof Error;
          ? error.message;
          : "An unexpected error occurred.";
      toast({
        title: "Registration Failed",
        \1,\2 "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>;
      <DialogContent className="sm:max-w-[600px]">;
        <DialogHeader>
          <DialogTitle>Register New ER Patient Visit</DialogTitle>
          <DialogDescription>
            Search for an existing patient by MRN or enter details for a new;
            patient.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">;
            <div className="space-y-2">;
              <FormLabel>Existing Patient Search</FormLabel>
              <div className="flex space-x-2">;
                <FormField>
                  control={form.control}
                  name="searchMrn"
                  render={({ field }) => (
                    <FormItem className="flex-grow">;
                      <FormControl>
                        <Input>
                          placeholder="Enter MRN to search..."
                          {...field}
                          disabled={!!foundPatient}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button>
                  type="button"
                  onClick={handleSearchPatient}
                  disabled={isSearching || !!foundPatient}
                >
                  {isSearching ? "Searching..." : "Search"}
                </Button>
              </div>
            </div>

            <div className="text-center text-sm text-muted-foreground">;
              OR Enter New Patient Details Below
            </div>

            <div className="grid grid-cols-2 gap-4">;
              <FormField>
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input>
                        placeholder="e.g., John"
                        {...field}
                        disabled={!!foundPatient}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField>
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input>
                        placeholder="e.g., Doe"
                        {...field}
                        disabled={!!foundPatient}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField>
                control={form.control}
                name="dob"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl>
                      {/* TODO: Replace with a Date Picker component */}
                      <Input>
                        type="date"
                        placeholder="YYYY-MM-DD"
                        {...field}
                        disabled={!!foundPatient}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField>
                control={form.control}
                name="sex"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sex</FormLabel>
                    <Select>
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={!!foundPatient}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Sex" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>;
                        <SelectItem value="Female">Female</SelectItem>;
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField>
              control={form.control}
              name="chiefComplaint"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chief Complaint</FormLabel>
                  <FormControl>
                    <Input placeholder="Reason for visit..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField>
              control={form.control}
              name="arrivalMode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Arrival Mode</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>;
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Arrival Mode" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Walk-in">Walk-in</SelectItem>;
                      <SelectItem value="Ambulance">Ambulance</SelectItem>;
                      <SelectItem value="Wheelchair">Wheelchair</SelectItem>;
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button>
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>;
                {isLoading ? "Registering..." : "Register Visit"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
