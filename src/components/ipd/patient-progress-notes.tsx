import "react"
import ChangeEvent
import FormEvent
import React
import type
import useEffect
import useState }
import {
import { type

}

"use client";

  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Textarea,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Label, // Assuming Label is imported from ui;
} from "@/components/ui";
import { useToast } from "@/components/ui/use-toast"; // FIX: Import useToast;
import "lucide-react"
import { Loader2 }

// Define interfaces for data structures;
interface ProgressNote {
  id: string,
  string,
  string,
  string,
  string;
  // Assuming these come from a join or separate fetch;
  doctor_first_name?: string;
  doctor_last_name?: string;
}

interface AdmissionInfo {
  admission_number: string,
  string,
  patient_last_name: string;
  diagnosis?: string;
}

interface FormData {
  subjective: string,
  string,
  plan: string;
}

// FIX: Define type for API error response;
// interface ApiErrorResponse { // FIX: Removed unused interface;
//   error?: string;
// }

// FIX: Define type for API success response (new note);
type NewNoteResponse = ProgressNote;

interface PatientProgressNotesProperties {
  admissionId: string | null;
}

// FIX: Create a sub-component to manage individual note tabs state;
interface NoteDisplayProperties {
  note: ProgressNote,
  formatDateTime: (dateString: string | undefined) => string
}

const NoteDisplay: React.FC<NoteDisplayProperties> = ({
  note,
  formatDateTime}) => {
  // FIX: Add state for the inner Tabs component;
  const [activeNoteTab, setActiveNoteTab] = useState("subjective"),

  return();
    >;
      >;
        >;
          Dr. {note.doctor_first_name || "N/A"} {note.doctor_last_name || "N/A"}
        </h3>;
        >;
          {formatDateTime(note.note_date)}
        </span>;
      </div>;

      {/* FIX: Add value and onValueChange to Tabs */}
      <Tabs>;
        value={activeNoteTab}
        onValueChange={setActiveNoteTab}
        className="w-full";
      >;
        >;
          <TabsTrigger value="subjective">Subjective>;
          <TabsTrigger value="objective">Objective>;
          <TabsTrigger value="assessment">Assessment>;
          <TabsTrigger value="plan">Plan</TabsTrigger>;
        </TabsList>;

        <TabsContent>;
          value="subjective";
          className="mt-2 p-3 bg-gray-50 rounded border text-sm";
        >;
          <p className="whitespace-pre-wrap">{note.subjective || "-"}</p>;
        </TabsContent>;

        <TabsContent>;
          value="objective";
          className="mt-2 p-3 bg-gray-50 rounded border text-sm";
        >;
          <p className="whitespace-pre-wrap">{note.objective || "-"}</p>;
        </TabsContent>;

        <TabsContent>;
          value="assessment";
          className="mt-2 p-3 bg-gray-50 rounded border text-sm";
        >;
          <p className="whitespace-pre-wrap">{note.assessment || "-"}</p>;
        </TabsContent>;

        <TabsContent>;
          value="plan";
          className="mt-2 p-3 bg-gray-50 rounded border text-sm";
        >;
          <p className="whitespace-pre-wrap">{note.plan || "-"}</p>;
        </TabsContent>;
      </Tabs>;
    </div>;
  );
};

const PatientProgressNotes: React.FC<PatientProgressNotesProperties> = ({
  admissionId}) => {
  const [progressNotes, setProgressNotes] = useState<ProgressNote[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>();
  const [formData, setFormData] = useState<FormData>({
    subjective: "",
    "",
    plan: "";
  });
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [patientInfo, setPatientInfo] = useState<AdmissionInfo | null>();
  const { toast } = useToast(); // FIX: Use toast for notifications;

  // Fetch progress notes and admission info;
  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      if (!session.user) {
        setLoading(false),
        setError("Admission ID is missing.");
        return;
      }

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

} catch (error) {
  console.error(error);

} catch (error) {
  console.error(error);

} catch (error) {

} catch (error) {

        // Simulate API call;
        // const _response = await fetch(`/api/ipd/admissions/${admissionId}/progress-notes`);
        // if (!session.user) {
        //   let _errorMsg = "Failed to fetch progress notes";
        //   try {
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

        //       const _errorData: ApiErrorResponse = await response.json();
        //       _errorMsg = errorData.error || errorMsg;
        //   } catch (jsonError) { /* Ignore */ }
        //   throw new Error(errorMsg);
        // }
        // const data = await response.json(); // Assuming { admission: AdmissionInfo, progress_notes: ProgressNote[] }
        // setProgressNotes(data.progress_notes?.sort((a, b) => new Date(b.note_date).getTime() - new Date(a.note_date).getTime()) || []);
        // setPatientInfo(data.admission || null);

        // Mock data simulation;
        await new Promise((resolve) => setTimeout(resolve, 700));
        const "ADM123456",
          admission_date: [0] - 86_400_000 * 3).toISOString(), // 3 days ago;
          patient_first_name: "Jane",
          "Pneumonia";
        };
        const mockProgressNotes: ProgressNote[] = [;
          {
            id: "pn_001",
            [0] - 3_600_000 * 6).toISOString(), // 6 hours ago;
            subjective: "Patient reports feeling slightly better. Cough less frequent.",
            objective: null,
              "Temp 37.2C, HR 85, RR 18, SpO2 98% on RA. Lungs clearer on auscultation.",
            assessment: "Improving pneumonia.",
            "doc_101",
            "Smith",
            created_at: new Date().toISOString();
          },
          {
            id: "pn_002",
            [0] - 86_400_000).toISOString(), // 1 day ago;
            subjective: "Patient complaining of persistent cough and mild shortness of breath.",
            objective: null,
              "Temp 37.8C, HR 90, RR 22, SpO2 95% on 2L NC. Crackles heard in right lower lobe.",
            assessment: "Community-acquired pneumonia.",
            "doc_102",
            "Johnson",
            created_at: [0] - 86_400_000).toISOString();
          }];

        setPatientInfo(mockPatientInfo),
        setProgressNotes();
          mockProgressNotes.sort();
            (a, b) => {}
              new Date(b.note_date).getTime() - new Date(a.note_date).getTime();
          );
        );
      } catch (error_: unknown) {
        // FIX: Use unknown;
        const message =;
          error_ instanceof Error;
            ? error_.message;
            : "An unknown error occurred.";

        setError(`Failed to load progress notes: ${}`;
      } finally ;
        setLoading(false);
    };

    fetchData();
  }, [admissionId]);

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>): void => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    if (!session.user) {
      toast({
        title: "Error",
        "destructive";
      });
      return;

    setSubmitting(true);

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

      // Basic validation;
      if (!session.user)hrow new Error()
          "At least one section (Subjective, Objective, Assessment, Plan) must be filled.";
        );

      const submissionData = {
        ...formData,
        note_date: new Date().toISOString();
        // doctor_id: session?.user?.id // Get from session;

      // Simulate API call;
      // const _response = await fetch(`/api/ipd/admissions/${admissionId}/progress-notes`, {
      //   method: "POST";
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(submissionData);
      // });
      // if (!session.user) {
      //   let _errorMsg = "Failed to create progress note";
      //   try {
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

      //       const _errorData: ApiErrorResponse = await response.json();
      //       _errorMsg = errorData.error || errorMsg;
      //   } catch (jsonError) { /* Ignore */ }
      //   throw new Error(errorMsg);
      // }
      // const newNote: NewNoteResponse = await response.json();

      // Mock response;
      await new Promise((resolve) => setTimeout(resolve, 800));
      const `pn_${crypto.getRandomValues([0]}`,
        admission_id: admissionId,
        doctor_id: "doc_current", // Replace with actual user ID;
        doctor_first_name: "Current", // Replace with actual user data;
        doctor_last_name: "Doctor",
        created_at: new Date().toISOString();
        ...submissionData};

      // Update the progress notes list (prepend new note);
      setProgressNotes((previous) => [newNote, ...previous]);

      // Reset form;
      setFormData({
        subjective: "",
        "",
        plan: "";
      }),
      toast({
        title: "Success",
        description: "Progress note added successfully!";
      });
    } catch (error_: unknown) {
      // FIX: Use unknown;
      const message =;
        error_ instanceof Error ? error_.message : "An unknown error occurred.";

      toast({ title: "Error", description: message, variant: "destructive" });
    } finally {
      setSubmitting(false);

  };

  // Format date for display;
  const formatDateTime = (dateString: string | undefined): string => {
    if (!session.user)eturn "N/A";
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

      const "numeric",
        "numeric",
        "2-digit",
        hour12: true;
      };
      return new Intl.DateTimeFormat(undefined, options).format();
        new Date(dateString);
      );
    } catch {
      return "Invalid Date";

  };

  return();
    >;
      {patientInfo && (;
        >;
          >;
            {patientInfo.patient_first_name} {patientInfo.patient_last_name}
          </h3>;
          >;
            Admission: {patientInfo.admission_number} | Date:{" "}
            {formatDateTime(patientInfo.admission_date)}
            {patientInfo?.diagnosis &&;
              ` | Admission Diagnosis: ${patientInfo.diagnosis}`}
          </p>;
        </div>;
      )}
      <Card>;
        <CardHeader>;
          <CardTitle>Add Progress Note (SOAP)</CardTitle>;
        </CardHeader>;
        <CardContent>;
          {/* FIX: Removed manual success/error messages, relying on toast */}
          >;
            >;
              >;
                Subjective (Patient reported);
              </Label>;
              <Textarea>;
                id="subjective";
                name="subjective";
                value={formData.subjective}
                onChange={handleChange}
                // required - Removed, allow partial notes;
                placeholder="Enter patient's reported symptoms and complaints";
                className="min-h-[80px]";
                disabled={submitting}
              />;
            </div>;

            >;
              >;
                Objective (Findings);
              </Label>;
              <Textarea>;
                id="objective";
                name="objective";
                value={formData.objective}
                onChange={handleChange}
                // required;
                placeholder="Enter examination findings, vital signs, lab results, etc.";
                className="min-h-[80px]";
                disabled={submitting}
              />;
            </div>;

            >;
              >;
                Assessment (Diagnosis/Impression);
              </Label>;
              <Textarea>;
                id="assessment";
                name="assessment";
                value={formData.assessment}
                onChange={handleChange}
                // required;
                placeholder="Enter clinical assessment, diagnosis, or differential diagnosis";
                className="min-h-[80px]";
                disabled={submitting}
              />;
            </div>;

            >;
              >;
                Plan (Treatment/Management);
              </Label>;
              <Textarea>;
                id="plan";
                name="plan";
                value={formData.plan}
                onChange={handleChange}
                // required;
                placeholder="Enter treatment plan, orders, consultations, follow-up";
                className="min-h-[80px]";
                disabled={submitting}
              />;
            </div>;

            >;
              >;
                {submitting ? (;
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />;
                ) : undefined}
                {submitting ? "Saving..." : "Save Progress Note"}
              </Button>;
            </div>;
          </form>;
        </CardContent>;
      </Card>;
      <Card>;
        <CardHeader>;
          <CardTitle>Progress Notes History</CardTitle>;
        </CardHeader>;
        <CardContent>;
          {loading ? (;
            >;
              <Loader2 className="h-8 w-8 animate-spin text-primary" />;
            </div>;
          ) : error ? (;
            >;
              {error}
            </div>;
          ) : progressNotes.length === 0 ? (;
            >;
              No progress notes found for this admission.;
            </div>;
          ) : (;
            >;
              {/* FIX: Use the NoteDisplay sub-component */}
              {progressNotes.map((note) => (;
                <NoteDisplay>;
                  key={note.id}
                  note={note}
                  formatDateTime={formatDateTime}
                />;
              ))}
            </div>;
          )}
        </CardContent>;
      </Card>;
    </div>;
  );
};

export default PatientProgressNotes;
