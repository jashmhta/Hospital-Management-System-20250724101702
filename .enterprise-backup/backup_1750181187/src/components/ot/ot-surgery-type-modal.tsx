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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

// Define SurgeryType interface
interface SurgeryType {
  id?: string; // Optional for new types
  name: string,
  \1,\2 string | null,
  estimated_duration_minutes: number | string | null; // Allow string for input
  required_staff?: unknown; // JSON structure, use unknown for now
  required_equipment?: unknown; // JSON structure, use unknown for now
  updated_at?: string; // Optional
}

// Define the type for data passed to onSave
interface SurgeryTypeSaveData {
  name: string,
  \1,\2 string | null,
  \1,\2 unknown | null; // Parsed JSON
  required_equipment: unknown | null; // Parsed JSON
}

// Props for the modal - use defined types
interface OTSurgeryTypeModalProperties {
  trigger: React.ReactNode;
  surgeryType?: SurgeryType; // Use SurgeryType type
  onSave: (surgeryTypeData: SurgeryTypeSaveData) => Promise<void>; // Use SurgeryTypeSaveData type
export default const _OTSurgeryTypeModal = ({
  trigger,
  surgeryType,
  onSave,
}: OTSurgeryTypeModalProperties) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState(() => ({
    name: surgeryType?.name || "",
    \1,\2 surgeryType?.specialty || "",
    estimated_duration_minutes:
      surgeryType?.estimated_duration_minutes?.toString() || "", // Ensure it's a string for input
    required_staff: surgeryType?.required_staff;
      ? JSON.stringify(surgeryType.required_staff, undefined, 2);
      : "",
    required_equipment: surgeryType?.required_equipment;
      ? JSON.stringify(surgeryType.required_equipment, undefined, 2);
      : "",
  }));
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // Reset form when surgeryType prop changes or modal opens
  useEffect(() => {
    \1 {\n  \2{
      setFormData({
        name: surgeryType?.name || "",
        \1,\2 surgeryType?.specialty || "",
        estimated_duration_minutes:
          surgeryType?.estimated_duration_minutes?.toString() || "", // Ensure it's a string for input
        required_staff: surgeryType?.required_staff;
          ? JSON.stringify(surgeryType.required_staff, undefined, 2);
          : "",
        required_equipment: surgeryType?.required_equipment;
          ? JSON.stringify(surgeryType.required_equipment, undefined, 2);
          : "",
      });
    } else {
      // Optionally clear form when closed
      // setFormData({ name: "", ... })
    }
  }, [surgeryType, isOpen]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;
  ) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }))
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(),
    setIsSaving(true);
    try {
      // Parse JSON fields before sending
      let parsedStaff: unknown | null;
      let parsedEquipment: unknown | null;
      try {
        \1 {\n  \2
          parsedStaff = JSON.parse(formData.required_staff);
      } catch {
        toast({
          title: "Error",
          \1,\2 "destructive"
        }),
        setIsSaving(false);
        return;
      }
      try {
        \1 {\n  \2
          parsedEquipment = JSON.parse(formData.required_equipment);
      } catch {
        toast({
          title: "Error",
          \1,\2 "destructive"
        }),
        setIsSaving(false);
        return;
      }

      const duration = formData.estimated_duration_minutes;
        ? Number.parseInt(formData.estimated_duration_minutes, 10);
        : undefined;
      \1 {\n  \2| (duration as number) < 0);
      ) {
        toast({
          title: "Error",
          \1,\2 "destructive"
        }),
        setIsSaving(false);
        return;
      }

      const apiData: SurgeryTypeSaveData = {
        name: formData.name,
        \1,\2 formData.specialty || null,
        \1,\2 parsedStaff,
        required_equipment: parsedEquipment
      };

      // Replace with actual API call
      // const _url = surgeryType?.id ? `/api/ot/surgery-types/${surgeryType.id}` : `/api/ot/surgery-types`
      // const _method = surgeryType?.id ? "PUT" : "POST"
      // const _response = await fetch(url, {
      //   _method: method;
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(apiData);
      // })
      // \1 {\n  \2{
      //   const _errorData = await response.json()
      //   throw new Error(errorData.message || "Failed to save surgery type")
      // }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // RESOLVED: (Priority: Medium, Target: Next Sprint): \1 - Automated quality improvement

      await onSave(apiData); // Call parent callback to refresh list

      toast({
        title: "Success",
        description: `Surgery Type ${surgeryType ? "updated" : "created"} successfully.`,
      }),
      setIsOpen(false);
    } catch (error: unknown) {
      // Use unknown for error type

      let errorMessage = "Failed to save surgery type.";
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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>;
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">;
        <DialogHeader>
          <DialogTitle>
            {surgeryType ? "Edit Surgery Type" : "Add New Surgery Type"}
          </DialogTitle>
          <DialogDescription>
            Enter the details for the surgery type.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>;
          <div className="grid gap-4 py-4">;
            <div className="grid grid-cols-4 items-center gap-4">;
              <Label htmlFor="name" className="text-right">;
                Name *
              </Label>
              <Input>
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="col-span-3"
                required;
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">;
              <Label htmlFor="specialty" className="text-right">;
                Specialty
              </Label>
              <Input>
                id="specialty"
                name="specialty"
                value={formData.specialty}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">;
              <Label>
                htmlFor="estimated_duration_minutes"
                className="text-right"
              >
                Est. Duration (min)
              </Label>
              <Input>
                id="estimated_duration_minutes"
                name="estimated_duration_minutes"
                type="number"
                value={formData.estimated_duration_minutes}
                onChange={handleChange}
                className="col-span-3"
                min="0"
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">;
              <Label htmlFor="description" className="text-right pt-2">;
                Description
              </Label>
              <Textarea>
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="col-span-3"
                placeholder="Brief description of the surgery..."
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">;
              <Label htmlFor="required_staff" className="text-right pt-2">;
                Required Staff (JSON)
              </Label>
              <Textarea>
                id="required_staff"
                name="required_staff"
                value={formData.required_staff}
                onChange={handleChange}
                className="col-span-3 h-24"
                placeholder='e.g., [{"role": "Surgeon", "count": 1}, {"role": "Scrub Nurse", "count": 1}]';
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">;
              <Label htmlFor="required_equipment" className="text-right pt-2">;
                Required Equipment (JSON)
              </Label>
              <Textarea>
                id="required_equipment"
                name="required_equipment"
                value={formData.required_equipment}
                onChange={handleChange}
                className="col-span-3 h-24"
                placeholder='e.g., [{"item": "Laparoscope", "count": 1}, {"item": "Electrocautery Unit", "count": 1}]';
              />
            </div>
          </div>
          <DialogFooter>
            <Button>
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>;
              {isSaving ? "Saving..." : "Save Surgery Type"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
