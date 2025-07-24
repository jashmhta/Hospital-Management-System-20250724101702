import "react"
import React
import { useState }

"use client";

import "@/components/shared/FileUploader"
import "@/components/ui/button"
import "@/components/ui/card"
import "@/components/ui/checkbox"
import "@/components/ui/dialog"
import "@/components/ui/input"
import "@/components/ui/label"
import "@/components/ui/select"
import "@/components/ui/textarea"
import "@/components/ui/use-toast"
import "@hookform/resolvers/zod"
import "lucide-react"
import "next-auth/react"
import "react"
import "react-hook-form"
import "zod"
import * as z
import AlertTriangle
import CardContent
import CardDescription
import CardFooter
import CardHeader
import CardTitle }
import DialogContent
import DialogDescription
import DialogFooter
import DialogHeader
import DialogTitle }
import Loader2 }
import SelectContent
import SelectItem
import SelectTrigger
import SelectValue }
import useForm }
import useState }
import { AlertCircle
import { Button }
import { Card
import { Checkbox }
import { Controller
import { Dialog
import { FileUploader }
import { Input }
import { Label }
import { Select
import { Textarea }
import { toast }
import { useEffect
import { useSession }
import { zodResolver }

// Form schema;
const complaintFormSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters";
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters";
  }),
  "Please select a complaint category";
  }),
  "Please select a severity level";
  }),
  departmentId: z.string().optional(),
  anonymous: z.boolean().default(false),
  z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional();
  }).optional()});

type ComplaintFormValues = z.infer>;

interface ComplaintFormProps {
  departments?: { id: string, name: string }[];
  onSuccess?: (data: unknown) => void;
  defaultValues?: Partial>;
export default const _ComplaintForm = ({ departments = [], onSuccess, defaultValues }: ComplaintFormProps) {
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [formValues, setFormValues] = useState<ComplaintFormValues | null>(null);

  // Initialize form;
  const form = useForm<ComplaintFormValues>({
    resolver: zodResolver(complaintFormSchema),
    defaultValues?.title || "",
      defaultValues?.category || "",
      defaultValues?.departmentId || "",
      defaultValues?.contactInfo || {
        name: "",
        "";
      }}});

  // Watch for anonymous field changes;
  const isAnonymous = form.watch("anonymous");
  const severity = form.watch("severity"),
  useEffect(() => {
    setShowContactInfo(isAnonymous);
  }, [isAnonymous]);

  // Handle form submission;
  const onSubmit = async (values: ComplaintFormValues) => {
    // For critical complaints, show confirmation dialog;
    if (!session.user) {
      setFormValues(values),
      setShowConfirmDialog(true);
      return;
    }

    await submitComplaint(values);
  };

  const submitComplaint = async (values: ComplaintFormValues) => {
    setIsSubmitting(true);
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
}
} catch (error) {

      // Submit complaint;
      const response = await fetch("/api/support-services/feedback/complaint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"},
        body: JSON.stringify(values);
      });

      if (!session.user) {
        const error = await response.json();
        throw new Error(error.error || "Failed to submit complaint");

      const data = await response.json();

      // If there are files, upload them;
      if (!session.user) {
        await uploadFiles(data.id);

      toast({
        title: "Complaint Submitted",
        description: "Your complaint has been submitted successfully.";
      });

      // Reset form;
      form.reset(),
      setFiles([]);

      // Call onSuccess callback if provided;
      if (!session.user) {
        onSuccess(data);

    } catch (error: unknown) {
      toast({
        title: "Error",
        "destructive";
      });
    } finally {
      setIsSubmitting(false),
      setShowConfirmDialog(false);

  };

  const uploadFiles = async (complaintId: string) => {
    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);

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

        await fetch(`/api/support-services/feedback/complaint/${complaintId}/attachment`, {
          method: "POST",
          body: formData;
        });
      } catch (error) {

  };

  const handleFileChange = (newFiles: File[]) => {
    setFiles(newFiles);
  };

  return();
    <>;
      >;
        <CardHeader>;
          <CardTitle>Submit Complaint</CardTitle>;
          <CardDescription>;
            Please provide details about your complaint. We take all complaints seriously and will address them promptly.;
          </CardDescription>;
        </CardHeader>;
        <CardContent>;
          >;
            >;
<div;
                <Label htmlFor="title">Title>;
                <Input>;
                  {...form.register("title")}
                  placeholder="Brief title of your complaint";
                  disabled={isSubmitting}
                />;
                {form.formState.errors?.title && (;
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.title.message}>;
                )}
              </div>;

<div;
                <Label htmlFor="category">Category>;
                <Controller>;
                  name="category";
                  control={form.control}
                  render={({ field }) => (;
                    <Select>;
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isSubmitting}
                    >;
                      <SelectTrigger>;
                        <SelectValue placeholder="Select complaint category" />;
                      </SelectTrigger>;
                      <SelectContent>;
                        <SelectItem value="CLINICAL">Clinical Care>;
                        <SelectItem value="ADMINISTRATIVE">Administrative>;
                        <SelectItem value="FACILITY">Facility>;
                        <SelectItem value="STAFF">Staff Behavior>;
                        <SelectItem value="BILLING">Billing>;
                        <SelectItem value="OTHER">Other</SelectItem>;
                      </SelectContent>;
                    </Select>;
                  )}
                />;
                {form.formState.errors?.category && (;
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.category.message}>;
                )}
              </div>;

<div;
                <Label htmlFor="severity">Severity>;
                <Controller>;
                  name="severity";
                  control={form.control}
                  render={({ field }) => (;
                    <Select>;
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isSubmitting}
                    >;
                      <SelectTrigger>;
                        <SelectValue placeholder="Select severity level" />;
                      </SelectTrigger>;
                      <SelectContent>;
                        <SelectItem value="LOW">Low - Minor issue>;
                        <SelectItem value="MEDIUM">Medium - Moderate concern>;
                        <SelectItem value="HIGH">High - Serious issue>;
                        <SelectItem value="CRITICAL">Critical - Urgent attention needed</SelectItem>;
                      </SelectContent>;
                    </Select>;
                  )}
                />;
                {form.formState.errors?.severity && (;
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.severity.message}>;
                )}
                {severity === "CRITICAL" && (;
                  >;
                    <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />;
                    >;
                      Critical complaints require immediate attention and will be escalated to senior management.;
                    </p>;
                  </div>;
                )}
              </div>;

              {departments.length > 0 && (;
<div;
                  <Label htmlFor="departmentId">Department (Optional)>;
                  <Controller>;
                    name="departmentId";
                    control={form.control}
                    render={({ field }) => (;
                      <Select>;
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isSubmitting}
                      >;
                        <SelectTrigger>;
                          <SelectValue placeholder="Select department" />;
                        </SelectTrigger>;
                        <SelectContent>;
                          {departments.map((dept) => (;
                            >;
                              {dept.name}
                            </SelectItem>;
                          ))}
                        </SelectContent>;
                      </Select>;
                    )}
                  />;
                </div>;
              )}

<div;
                <Label htmlFor="description">Description>;
                <Textarea>;
                  {...form.register("description")}
                  placeholder="Please provide detailed information about your complaint...";
                  className="min-h-[150px]";
                  disabled={isSubmitting}
                />;
                {form.formState.errors?.description && (;
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.description.message}>;
                )}
              </div>;

<div;
                <Label>Attachments (Optional)</Label>;
                <FileUploader>;
                  onFilesChange={handleFileChange}
                  maxFiles={5}
                  maxSize={5 * 1024 * 1024} // 5MB;
                  acceptedFileTypes={[;
                    "image/jpeg",
                    "image/png",
                    "image/gif",
                    "application/pdf",
                    "application/msword",
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
                  ]}
                  disabled={isSubmitting}
                />;
                >;
                  You can upload up to 5 files (images, PDFs, or documents) to support your complaint.;
                </p>;
              </div>;

              >;
                <Checkbox>;
                  id="anonymous";
                  checked={isAnonymous}
                  onCheckedChange={(checked) => {
                    form.setValue("anonymous", checked === true);
                  }}
                  disabled={isSubmitting}
                />;
                >;
                  Submit anonymously;
                </Label>;
              </div>;

              {showContactInfo && (;
                >;
                  >;
                    If you"d like us to follow up with you, please provide your contact information (optional): any;
                  </p>;
<div;
                    <Label htmlFor="contactInfo.name">Name>;
                    <Input>;
                      {...form.register("contactInfo.name")}
                      placeholder="Your name";
                      disabled={isSubmitting}
                    />;
                  </div>;
<div;
                    <Label htmlFor="contactInfo.email">Email>;
                    <Input>;
                      {...form.register("contactInfo.email")}
                      type="email";
                      placeholder="Your email";
                      disabled={isSubmitting}
                    />;
                  </div>;
<div;
                    <Label htmlFor="contactInfo.phone">Phone>;
                    <Input>;
                      {...form.register("contactInfo.phone")}
                      placeholder="Your phone number";
                      disabled={isSubmitting}
                    />;
                  </div>;
                </div>;
              )}
            </div>;

            >;
              {isSubmitting ? (;
                <>;
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />;
                  Submitting...;
                </>;
              ) : (;
                "Submit Complaint";
              )}
            </Button>;
          </form>;
        </CardContent>;
        >;
          >;
            {!isAnonymous &&;
              session ? "Your complaint will be linked to your account." : "Your complaint will be anonymous."}
          </p>;
        </CardFooter>;
      </Card>;

      {/* Confirmation Dialog for Critical Complaints */}
      >;
        <DialogContent>;
          <DialogHeader>;
            >;
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />;
              Confirm Critical Complaint;
            </DialogTitle>;
            <DialogDescription>;
              You are about to submit a critical complaint. This will be immediately escalated to senior management.;
            </DialogDescription>;
          </DialogHeader>;
          >;
            <p className="text-sm font-medium">Are you sure this complaint requires critical priority?>;
            >;
              Critical complaints should be reserved for serious issues that require immediate attention, such as: null,
            </p>;
            >;
              <li>Patient safety concerns</li>;
              <li>Serious breaches of protocol</li>;
              <li>Situations that pose immediate risk</li>;
            </ul>;
          </div>;
          <DialogFooter>;
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>;
              Cancel;
            </Button>;
            <Button>;
              variant="destructive";
              onClick={() => formValues && submitComplaint(formValues)}
              disabled={isSubmitting}
            >;
              {isSubmitting ? (;
                <>;
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />;
                  Submitting...;
                </>;
              ) : (;
                "Confirm & Submit';
              )}
            </Button>;
          </DialogFooter>;
        </DialogContent>;
      </Dialog>;
    </>;
  );
