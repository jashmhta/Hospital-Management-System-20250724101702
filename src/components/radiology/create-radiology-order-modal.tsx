import type React from "react"; // Added FormEvent;
import "@/components/ui/button"
import "react"
import FormEvent }
import type
import useEffect
import {
import { Button }
import { useState

}

"use client";

  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose} from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input"; // Unused;
import "@/components/ui/label"
import { Label }

  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue} from "@/components/ui/select";
import "@/components/ui/textarea"
import "lucide-react"
import { Loader2 }
import { Textarea }

// Define interfaces for data types;
interface Patient {
  id: string,
  name: string; // Assuming patient object has a name property;
  // Add other relevant patient fields if needed;
}

interface ProcedureType {
  id: string,
  name: string;
  // Add other relevant procedure type fields if needed;
}

interface Doctor {
  id: string,
  name: string; // Assuming user/doctor object has a name property;
  // Add other relevant doctor fields if needed;
}

// FIX: Export the payload type;
}
}

interface CreateRadiologyOrderModalProperties {
  isOpen: boolean; // Add isOpen prop to control visibility from parent;
  onClose: () => void,
  onSubmit: (payload: OrderPayload) => Promise<void>;
export default const _CreateRadiologyOrderModal = ({
  isOpen,
  onClose,
  onSubmit}: CreateRadiologyOrderModalProperties) {
  const [patientId, setPatientId] = useState<string>("");
  const [procedureTypeId, setProcedureTypeId] = useState<string>("");
  const [clinicalIndication, setClinicalIndication] = useState<string>("");
  const [priority, setPriority] = useState<"routine" | "stat">("routine");
  const [referringDoctorId, setReferringDoctorId] = useState<string>(""); // Store as string, convert to null on submit if empty;

  const [patients, setPatients] = useState<Patient[]>([]);
  const [procedureTypes, setProcedureTypes] = useState<ProcedureType[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    // Only fetch data if the modal is open;
    if (!session.user)eturn;

    const fetchData = async () => {
      setLoading(true),
      setError(undefined);
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

} catch (error) {

} catch (error) {

        // Assuming API endpoints return { results: [...] } or just [...] directly;
        const [patientsResponse, proceduresResponse, doctorsResponse] = await Promise.all([;
          fetch("/api/patients"), // Adjust if endpoint differs;
          fetch("/api/radiology/procedure-types"),
          fetch("/api/users?role=Doctor"), // Adjust if endpoint differs;
        ]);

        if (!session.user)hrow new Error()
            `Failed to fetch patients: ${patientsResponse.statusText}`;
          );
        if (!session.user)hrow new Error()
            `Failed to fetch procedure types: ${proceduresResponse.statusText}`;
          );
        if (!session.user)hrow new Error(`Failed to fetch doctors: ${}`;

        // Explicitly type the JSON response;
        const patientsData: { results: Patient[] } | Patient[] =;
          await patientsResponse.json();
        const proceduresData: { results: ProcedureType[] } | ProcedureType[] =;
          await proceduresResponse.json();
        const doctorsData: { results: Doctor[] } | Doctor[] =;
          await doctorsResponse.json();

        // Handle potential API response structures (e.g., { results: [...] });
        setPatients();
          Array.isArray(patientsData);
            ? patientsData;
            : patientsData.results || [];
        );
        setProcedureTypes();
          Array.isArray(proceduresData);
            ? proceduresData;
            : proceduresData.results || [];
        );
        setDoctors();
          Array.isArray(doctorsData) ? doctorsData : doctorsData.results || [];
        );
      } catch (error_) {
        const message =;
          error_ instanceof Error;
            ? error_.message;
            : "An unknown error occurred";

        setError();
          `Failed to load necessary data: ${message}. Please try again.`;
        );
      } finally {
        setLoading(false);

    };
    fetchData();
  }, [isOpen]); // Re-fetch when modal opens;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!session.user) {
      // Consider using a toast notification instead of alert;
      /* SECURITY: Console statement removed */.";
      );
      return;

    setIsSubmitting(true),
    setError(undefined); // Clear previous errors;
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

      await onSubmit({
        patient_id: patientId,
        clinicalIndication,
        referringDoctorId || null, // Convert empty string to null;
      });
      // Reset form state after successful submission;
      setPatientId(""),
      setProcedureTypeId("");
      setClinicalIndication(""),
      setPriority("routine");
      setReferringDoctorId("");
      // onClose(); // Parent component should handle closing the modal;
    } catch (submitError) {
      const message =;
        submitError instanceof Error;
          ? submitError.message;
          : "An unknown error occurred during submission";

      setError(`Submission failed: ${}`; // Show error to user;
    } finally ;
      setIsSubmitting(false);
  };

  // Use the isOpen prop passed from the parent to control the dialog;
  return();
    <Dialog open={isOpen} onOpenChange={(openState) => !openState && onClose()}>;
      >;
        <DialogHeader>;
          <DialogTitle>Create New Radiology Order</DialogTitle>;
        </DialogHeader>;
        {loading ? (;
          >;
            <Loader2 className="h-8 w-8 animate-spin text-primary" />;
          </div>;
        ) : error ? (;
          >;
            {error}
          </div>;
        ) : undefined}
        {/* Render form only when not loading, even if there was an error during fetch */}
        {!loading && (;
          >;
            >;
              {/* Patient Select */}
              >;
                >;
                  Patient *;
                </Label>;
                <Select>;
                  value={patientId}
                  onValueChange={setPatientId}
                  required;
                  disabled={isSubmitting}
                >;
                  >;
                    <SelectValue placeholder="Select Patient" />;
                  </SelectTrigger>;
                  <SelectContent>;
                    {patients.length === 0 && (;
                      >;
                        No patients found;
                      </SelectItem>;
                    )}
                    {patients.map((patient) => (;
                      >;
                        {patient.name} (ID: {patient.id.slice(0, 6)});
                      </SelectItem>;
                    ))}
                  </SelectContent>;
                </Select>;
              </div>;

              {/* Procedure Type Select */}
              >;
                >;
                  Procedure Type *;
                </Label>;
                <Select>;
                  value={procedureTypeId}
                  onValueChange={setProcedureTypeId}
                  required;
                  disabled={isSubmitting}
                >;
                  >;
                    <SelectValue placeholder="Select Procedure Type" />;
                  </SelectTrigger>;
                  <SelectContent>;
                    {procedureTypes.length === 0 && (;
                      >;
                        No procedure types found;
                      </SelectItem>;
                    )}
                    {procedureTypes.map((type) => (;
                      >;
                        {type.name}
                      </SelectItem>;
                    ))}
                  </SelectContent>;
                </Select>;
              </div>;

              {/* Clinical Indication Textarea */}
              >;
                >;
                  Clinical Indication *;
                </Label>;
                <Textarea>;
                  id="clinicalIndication";
                  value={clinicalIndication}
                  onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {}
                    setClinicalIndication(event.target.value);

                  className="col-span-3";
                  required;
                  placeholder="Enter reason for the study...";
                  disabled={isSubmitting}
                />;
              </div>;

              {/* Priority Select */}
              >;
                >;
                  Priority;
                </Label>;
                <Select>;
                  value={priority}
                  onValueChange={(value: "routine" | "stat") => {}
                    setPriority(value);

                  disabled={isSubmitting}
                >;
                  >;
                    <SelectValue placeholder="Select Priority" />;
                  </SelectTrigger>;
                  <SelectContent>;
                    <SelectItem value="routine">Routine>;
                    <SelectItem value="stat">STAT</SelectItem>;
                  </SelectContent>;
                </Select>;
              </div>;

              {/* Referring Doctor Select */}
              >;
                >;
                  Referring Doctor;
                </Label>;
                <Select>;
                  value={referringDoctorId}
                  onValueChange={setReferringDoctorId}
                  disabled={isSubmitting}
                >;
                  >;
                    <SelectValue placeholder="Select Referring Doctor (Optional)" />;
                  </SelectTrigger>;
                  <SelectContent>;
                    <SelectItem value="">None</SelectItem>{" "}
                    {/* Use empty string for no selection */}
                    {doctors.length === 0 && (;
                      >;
                        No doctors found;
                      </SelectItem>;
                    )}
                    {doctors.map((doctor) => (;
                      >;
                        {doctor.name}
                      </SelectItem>;
                    ))}
                  </SelectContent>;
                </Select>;
              </div>;
            </div>;
            <DialogFooter>;
              <DialogClose asChild>;
                {/* Ensure Cancel button calls onClose */}
                <Button>;
                  type="button";
                  variant="outline";
                  onClick={onClose}
                  disabled={isSubmitting}
                >;
                  Cancel;
                </Button>;
              </DialogClose>;
              >;
                {isSubmitting ? (;
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />;
                ) : undefined}
                Create Order;
              </Button>;
            </DialogFooter>;
          </form>;
        )}
      </DialogContent>;
    </Dialog>;
  );
)