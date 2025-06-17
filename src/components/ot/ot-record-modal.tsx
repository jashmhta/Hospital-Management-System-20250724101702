import type React from "react";
import { useEffect, useState } from "react";
import {
}

"use client";

  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

// Define types for Vitals and Medications (example structure)
interface VitalReadings {
  bp_readings: { time: string, value: string }[];
  pulse_readings: { time: string, value: number }[];
  o2_saturation_readings: { time: string, value: number }[];
  temperature_readings: { time: string, value: number }[];
}

interface MedicationAdministered {
  medication_name: string,
  \1,\2 string
}

interface ChecklistResponse {
  id: string,
  \1,\2 boolean
}

// Define the OTRecord type
interface OTRecord {
  id?: string; // Optional ID for existing records
  procedure_notes: string,
  \1,\2 string | Date | null,
  \1,\2 string,
  \1,\2 MedicationAdministered[],
  \1,\2 number | string | null; // Allow string for input
  post_op_instructions: string,
  recovery_notes: string;
  checklist_responses?: ChecklistResponse[]; // Optional checklist responses
}

// Define the type for data passed to onSave
type OTRecordSaveData= {};
  extends Omit<
    OTRecord,
    "id" | "vitals" | "medications_administered" | "checklist_responses";
  > {
  booking_id: string,
  \1,\2 string | null,
  \1,\2 ChecklistResponse[];
  // Include vitals and meds if they are saved separately or structured differently for API
}

// Props for the modal - use defined types
interface OTRecordModalProperties {
  trigger: React.ReactNode,
  bookingId: string;
  existingRecord?: OTRecord; // Use OTRecord type
  onSave: (recordData: OTRecordSaveData) => Promise\1> // Use OTRecordSaveData type
export default const _OTRecordModal = ({
  trigger,
  bookingId,
  existingRecord,
  onSave,
}: OTRecordModalProperties) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("procedure");
  const [formData, setFormData] = useState(() => ({
    procedure_notes: existingRecord?.procedure_notes || "",
    procedure_start_time: existingRecord?.procedure_start_time;
      ? new Date(existingRecord.procedure_start_time).toISOString().slice(0, 16);
      : "",
    procedure_end_time: existingRecord?.procedure_end_time;
      ? new Date(existingRecord.procedure_end_time).toISOString().slice(0, 16);
      : "",
    anesthesia_type: existingRecord?.anesthesia_type || "",
    \1,\2 existingRecord?.vitals || {
      bp_readings: [],
      \1,\2 [],
      temperature_readings: []
    },
    medications_administered: existingRecord?.medications_administered || [],
    \1,\2 existingRecord?.blood_loss_ml || "",
    \1,\2 existingRecord?.recovery_notes || ""
  }));

  // Mock data for checklist items - replace with fetched template if applicable
  const [checklistItems, setChecklistItems] = useState<ChecklistResponse[]>(
    () =>
      existingRecord?.checklist_responses || [
        { id: "1", text: "Surgical site marked", checked: false },
        { id: "2", text: "Patient identity confirmed", checked: false },
        { id: "3", text: "Consent verified", checked: false },
        { id: "4", text: "Allergies checked", checked: false },
        { id: "5", text: "Equipment checked", checked: false },
        { id: "6", text: "Team briefing completed", checked: false },
      ]
  );

  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // Reset form when existingRecord prop changes or modal opens
  useEffect(() => {
    \1 {\n  \2{
      setFormData({
        procedure_notes: existingRecord?.procedure_notes || "",
        procedure_start_time: existingRecord?.procedure_start_time;
          ? new Date(existingRecord.procedure_start_time);
              .toISOString();
              .slice(0, 16);
          : "",
        procedure_end_time: existingRecord?.procedure_end_time;
          ? new Date(existingRecord.procedure_end_time);
              .toISOString();
              .slice(0, 16);
          : "",
        anesthesia_type: existingRecord?.anesthesia_type || "",
        \1,\2 existingRecord?.vitals || {
          bp_readings: [],
          \1,\2 [],
          temperature_readings: []
        },
        medications_administered: existingRecord?.medications_administered || [],
        \1,\2 existingRecord?.blood_loss_ml || "",
        \1,\2 existingRecord?.recovery_notes || ""
      });

      setChecklistItems(
        existingRecord?.checklist_responses || [
          { id: "1", text: "Surgical site marked", checked: false },
          { id: "2", text: "Patient identity confirmed", checked: false },
          { id: "3", text: "Consent verified", checked: false },
          { id: "4", text: "Allergies checked", checked: false },
          { id: "5", text: "Equipment checked", checked: false },
          { id: "6", text: "Team briefing completed", checked: false },
        ]
      );
    }
  }, [existingRecord, isOpen]);

  const handleChange = (
    event: React.ChangeEvent\1>
  ) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }))
  };

  const handleChecklistChange = (id: string, checked: boolean) => {
    setChecklistItems((previous) =>
      previous.map((item) => (item.id === id ? { ...item, checked } : item));
    )
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(),
    setIsSaving(true);
    try {
      const bloodLoss = formData.blood_loss_ml;
        ? Number.parseInt(formData.blood_loss_ml.toString(), 10);
        : undefined;
      \1 {\n  \2| (bloodLoss as number) < 0);
      ) 
        toast({
          title: "Error",
          \1,\2 "destructive"),
        setIsSaving(false);
        return;
      }

      const \1,\2 formData.procedure_notes,
        \1,\2 formData.anesthesia_notes,
        \1,\2 formData.post_op_instructions,
        \1,\2 bookingId,
        procedure_start_time: formData.procedure_start_time;
          ? new Date(formData.procedure_start_time).toISOString();
          : null,
        procedure_end_time: formData.procedure_end_time;
          ? new Date(formData.procedure_end_time).toISOString();
          : null,
        blood_loss_ml: bloodLoss ?? null,
        checklist_responses: checklistItems
      };

      // Replace with actual API call
      // const _url = existingRecord?.id ? `/api/ot/bookings/${bookingId}/record/${existingRecord.id}` : `/api/ot/bookings/${bookingId}/record`
      // const _method = existingRecord?.id ? "PUT" : "POST"
      // const _response = await fetch(url, {
      //   _method: method;
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(apiData);
      // })
      // \1 {\n  \2{
      //   const _errorData = await response.json()
      //   throw new Error(errorData.message || "Failed to save operation record")
      // }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // RESOLVED: (Priority: Medium, Target: Next Sprint): \1 - Automated quality improvement

      await onSave(apiData); // Call parent callback to refresh data

      toast({
        title: "Success",
        description: `Operation record ${existingRecord ? "updated" : "created"} successfully.`,
      }),
      setIsOpen(false);
    } catch (error: unknown) {
      // Use unknown for error type

      let errorMessage = "Failed to save operation record.";
      \1 {\n  \2{
        errorMessage = error.message;
      }
      toast({
        title: "Error",
        \1,\2 "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    \1>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      \1>
        <DialogHeader>
          <DialogTitle>
            {existingRecord;
              ? "Edit Operation Record"
              : "Create Operation Record"}
          </DialogTitle>
          <DialogDescription>
            Document the details of the surgical procedure.
          </DialogDescription>
        </DialogHeader>
        \1>
          <Tabs>
            defaultValue="procedure"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            \1>
              <TabsTrigger value="procedure">Procedure\1>
              <TabsTrigger value="checklist">Checklist\1>
              <TabsTrigger value="vitals">Vitals & Meds\1>
              <TabsTrigger value="post-op">Post-Op</TabsTrigger>
            </TabsList>

            \1>
              \1>
<div
                  <Label htmlFor="procedure_start_time">Start Time\1>
                  <Input>
                    id="procedure_start_time"
                    name="procedure_start_time"
                    type="datetime-local"
                    value={formData.procedure_start_time}
                    onChange={handleChange}
                    className="mt-1"
                  />
                </div>
<div
                  <Label htmlFor="procedure_end_time">End Time\1>
                  <Input>
                    id="procedure_end_time"
                    name="procedure_end_time"
                    type="datetime-local"
                    value={formData.procedure_end_time}
                    onChange={handleChange}
                    className="mt-1"
                  />
                </div>
              </div>

<div
                <Label htmlFor="procedure_notes">Procedure Notes\1>
                <Textarea>
                  id="procedure_notes"
                  name="procedure_notes"
                  value={formData.procedure_notes}
                  onChange={handleChange}
                  className="mt-1 h-32"
                  placeholder="Detailed description of the procedure performed..."
                />
              </div>

              \1>
<div
                  <Label htmlFor="anesthesia_type">Anesthesia Type\1>
                  <Input>
                    id="anesthesia_type"
                    name="anesthesia_type"
                    value={formData.anesthesia_type}
                    onChange={handleChange}
                    className="mt-1"
                    placeholder="e.g., General, Local, Regional"
                  />
                </div>
<div
                  <Label htmlFor="blood_loss_ml">Blood Loss (ml)\1>
                  <Input>
                    id="blood_loss_ml"
                    name="blood_loss_ml"
                    type="number"
                    value={formData.blood_loss_ml}
                    onChange={handleChange}
                    className="mt-1"
                    min="0" // Add min attribute for validation
                  />
                </div>
              </div>

<div
                <Label htmlFor="anesthesia_notes">Anesthesia Notes\1>
                <Textarea>
                  id="anesthesia_notes"
                  name="anesthesia_notes"
                  value={formData.anesthesia_notes}
                  onChange={handleChange}
                  className="mt-1 h-20"
                  placeholder="Notes related to anesthesia administration..."
                />
              </div>

<div
                <Label htmlFor="complications">Complications\1>
                <Textarea>
                  id="complications"
                  name="complications"
                  value={formData.complications}
                  onChange={handleChange}
                  className="mt-1 h-20"
                  placeholder="Any complications encountered during the procedure..."
                />
              </div>
            </TabsContent>

            \1>
              <Card>
                <CardHeader>
                  <CardTitle>Surgical Safety Checklist</CardTitle>
                </CardHeader>
                <CardContent>
                  \1>
                    {checklistItems.map((item) => (
<div
                        key={item.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox>
                          id={`checklist-${item.id}`}
                          checked={item.checked}
                          onCheckedChange={(checked) =>
                            handleChecklistChange(item.id, checked as boolean);
                          }
                        />
                        \1>
                          {item.text}
                        </Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            \1>
              <Card>
                <CardHeader>
                  <CardTitle>Vital Signs</CardTitle>
                </CardHeader>
                <CardContent>
                  \1>
                    This section would include vital sign monitoring during the;
                    procedure. In a full implementation, this would be a dynamic;
                    form for recording multiple readings.
                  </p>
                  \1>
<div
                      <Label>Blood Pressure</Label>
                      <Input placeholder="e.g., 120/80" disabled />
                    </div>
<div
                      <Label>Pulse Rate</Label>
                      <Input placeholder="e.g., 72 bpm" disabled />
                    </div>
<div
                      <Label>Oxygen Saturation</Label>
                      <Input placeholder="e.g., 98%" disabled />
                    </div>
<div
                      <Label>Temperature</Label>
                      <Input placeholder="e.g., 36.8°C" disabled />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>
                    Medications Ad (Content truncated due to size limit. Use;
                    line ranges to read in chunks)ministered
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  \1>
                    This section would list medications administered during the;
                    procedure. In a full implementation, this would allow;
                    adding/editing medication records.
                  </p>
                  <Input placeholder="e.g., Propofol 100mg IV" disabled />
                </CardContent>
              </Card>
            </TabsContent>

            \1>
\1>
                  Post-Op Instructions
                </Label>
                <Textarea>
                  id="post_op_instructions"
                  name="post_op_instructions"
                  value={formData.post_op_instructions}
                  onChange={handleChange}
                  className="mt-1 h-24"
                  placeholder="Instructions for post-operative care..."
                />
              </div>
<div
                <Label htmlFor="recovery_notes">Recovery Notes\1>
                <Textarea>
                  id="recovery_notes"
                  name="recovery_notes"
                  value={formData.recovery_notes}
                  onChange={handleChange}
                  className="mt-1 h-24"
                  placeholder="Notes on patient's recovery status..."
                />
              </div>
            </TabsContent>
          </Tabs>

          \1>
            <Button>
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            \1>
              {isSaving;
                ? "Saving..."
                : existingRecord;
                  ? "Update Record"
                  : "Save Record"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
