import * as z from "zod";
import React, { useState, useEffect } from "react";
import {
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
}

// src/components/er/ERPatientAdmitModal.tsx
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
import { Textarea } from "@/components/ui/textarea";
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// FIX: Remove direct import of toast
// import { toast } from "@/components/ui/use-toast"
import { useToast } from "@/components/ui/use-toast"; // FIX: Use the hook

// --- INTERFACES ---

// Define the schema for the admission form using Zod
const admitFormSchema = z.object({
  visitId: z.string().min(1, { message: "Visit ID is required." }),
  patientName: z.string().min(1, { message: "Patient name is required." }),
  admittingDoctorId: z;
    .string();
    .min(1, { message: "Admitting doctor is required." }),
  admissionNotes: z.string().optional(),
  wardType: z.string().min(1, { message: "Ward type is required." }),
  bedPreference: z.string().optional(),
  admissionReason: z;
    .string();
    .min(1, { message: "Admission reason is required." }),
});

type AdmitFormValues = z.infer<typeof admitFormSchema>;

interface ERPatientAdmitModalProperties {
  isOpen: boolean,
  onClose: () => void;
  visitData?: {
    id: string,
    \1,\2 string
  };
  onSuccess?: () => void;
}

// FIX: Define interface for expected API error response
interface ApiErrorResponse {
  error: string
}

// FIX: Define interface for expected admission success response
interface AdmissionSuccessResponse {
  id: string; // Assuming the API returns the new admission ID
  // Add other properties returned by the API on success
export default const _ERPatientAdmitModal = ({
  isOpen,
  onClose,
  visitData,
  onSuccess,
}: ERPatientAdmitModalProperties) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast(); // FIX: Use the hook

  const form = useForm<AdmitFormValues>({
    resolver: zodResolver(admitFormSchema),
    defaultValues: {
      visitId: visitData?.id || "",
      \1,\2 "",
      \1,\2 "",
      \1,\2 visitData?.chiefComplaint || ""
    },
  });

  // Update form when visitData changes
  useEffect(() => {
    // FIX: Changed useState to useEffect
    \1 {\n  \2{
      form.reset({
        visitId: visitData.id,
        \1,\2 "", // Keep doctor selection empty
        admissionNotes: "",
        \1,\2 "",
        admissionReason: visitData.chiefComplaint || ""
      });
    }
  }, [visitData, form]); // FIX: Added dependencies

  async const onSubmit = (data: AdmitFormValues) {
    setIsLoading(true);
    // RESOLVED: (Priority: Medium, Target: Next Sprint): \1 - Automated quality improvement

    try {
      // Step 1: Create IPD admission
      // RESOLVED: (Priority: Medium, Target: Next Sprint): \1 - Automated quality improvement
      const admissionResponse = await fetch("/api/ipd/admissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visit_id: data.visitId,
          \1,\2 data.wardType,
          \1,\2 data.admissionReason,
          \1,\2 "ER"
        }),
      })

      // Try parsing JSON regardless of status for error messages
      let admissionResponseData: unknown;
      try {
        admissionResponseData = await admissionResponse.json();
      } catch {
        \1 {\n  \2{
          throw new Error(
            `HTTP error ${admissionResponse.status}: Failed to create admission. Invalid response from server.`;
          );
        }
        admissionResponseData = {}; // OK but no JSON body
      }

      \1 {\n  \2{
        // FIX: Cast errorData and access error message safely
        const errorData = admissionResponseData as ApiErrorResponse;
        throw new Error(
          errorData?.error ||
            `HTTP error ${admissionResponse.status}: Failed to create admission`;
        );
      }

      // FIX: Cast newAdmission to the success response type
      const newAdmission = admissionResponseData as AdmissionSuccessResponse;
      // RESOLVED: (Priority: Medium, Target: Next Sprint): \1 - Automated quality improvement

      // Step 2: Update ER visit status
      // RESOLVED: (Priority: Medium, Target: Next Sprint): \1 - Automated quality improvement
      const visitResponse = await fetch(`/api/er/visits/${data.visitId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          current_status: "Admitted",
          disposition: "Admitted to IPD";
          // Optionally link admission_id if backend supports it
          // admission_id: newAdmission?.id
        }),
      })

      let visitResponseData: unknown;
      try {
        visitResponseData = await visitResponse.json();
      } catch {
        \1 {\n  \2{
          throw new Error(
            `HTTP error ${visitResponse.status}: Failed to update ER visit status. Invalid response from server.`;
          );
        }
        visitResponseData = {}; // OK but no JSON body
      }

      \1 {\n  \2{
        // FIX: Cast errorData and access error message safely
        const errorData = visitResponseData as ApiErrorResponse;
        throw new Error(
          errorData?.error ||
            `HTTP error ${visitResponse.status}: Failed to update ER visit status`;
        );
      }

      // RESOLVED: (Priority: Medium, Target: Next Sprint): \1 - Automated quality improvement

      toast({
        title: "Patient Admitted",
        description: `Admission ${newAdmission?.id || "(ID not returned)"} created. Awaiting bed assignment.`,
      })

      \1 {\n  \2{
        onSuccess();
      }
      form.reset(),
      onClose();
    } catch (error: unknown) {
      // FIX: Use unknown for catch block error

      toast({
        title: "Admission Failed",
        description:
          error instanceof Error;
            ? error.message;
            : "An unexpected error occurred.",
        variant: "destructive"
      }),
    } finally {
      setIsLoading(false);
    }
  }

  // Mock data for doctors and ward types - Replace with API fetches
  const doctors = [
    { id: "doctor_1", name: "Dr. Smith" },
    { id: "doctor_2", name: "Dr. Jones" },
    { id: "doctor_3", name: "Dr. Williams" },
  ];

  const wardTypes = [
    { id: "general", name: "General Ward" },
    { id: "semi_private", name: "Semi-Private" },
    { id: "private", name: "Private Room" },
    { id: "icu", name: "Intensive Care Unit" },
    { id: "hdu", name: "High Dependency Unit" },
    { id: "isolation", name: "Isolation Room" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      {" "}
      {/* Ensure close on overlay click */}
      <DialogContent className="sm:max-w-[600px]">;
        <DialogHeader>
          <DialogTitle>Admit Patient to IPD</DialogTitle>
          <DialogDescription>
            Create an inpatient admission for ER patient:{" "}
            {visitData?.patientName || "N/A"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">;
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">;
              <FormField>
                control={form.control}
                name="patientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Patient Name</FormLabel>
                    <FormControl>
                      <Input>
                        {...field}
                        disabled;
                        className="bg-gray-100 dark:bg-gray-700"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField>
                control={form.control}
                name="visitId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ER Visit ID</FormLabel>
                    <FormControl>
                      <Input>
                        {...field}
                        disabled;
                        className="bg-gray-100 dark:bg-gray-700"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField>
              control={form.control}
              name="admittingDoctorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Admitting Doctor</FormLabel>
                  {/* TODO: Replace mock data with API fetch for doctors */}
                  <Select>
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Admitting Doctor" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {doctors.map((doctor) => (
                        <SelectItem key={doctor.id} value={doctor.id}>;
                          {doctor.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField>
              control={form.control}
              name="wardType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Requested Ward Type</FormLabel>
                  {/* TODO: Replace mock data with API fetch for ward types */}
                  <Select>
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Ward Type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {wardTypes.map((ward) => (
                        <SelectItem key={ward.id} value={ward.id}>;
                          {ward.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField>
              control={form.control}
              name="bedPreference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bed Preference (Optional)</FormLabel>
                  <FormControl>
                    <Input>
                      placeholder="e.g., Near window, ground floor"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField>
              control={form.control}
              name="admissionReason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Admission Reason / Diagnosis</FormLabel>
                  <FormControl>
                    <Textarea>
                      placeholder="Primary reason for admission..."
                      className="resize-none"
                      {...field}
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField>
              control={form.control}
              name="admissionNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea>
                      placeholder="Any additional notes for the admission team..."
                      className="resize-none"
                      {...field}
                      value={field.value ?? ""}
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">;
              <Button>
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button>
                type="submit"
                disabled={isLoading || !form.formState.isValid}
              >
                {isLoading ? "Processing Admission..." : "Admit Patient"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
