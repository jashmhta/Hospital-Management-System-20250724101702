import "next/navigation"
import "react"
import React
import {
import { useRouter }
import { useState }

  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage;
} from "../ui/form";
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle;
} from "../ui/card";
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger} from "../ui/accordion";
import "../ui/button"
import "../ui/checkbox"
import "../ui/input"
import { Button }
import { Checkbox }
import { Input }

  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue;
} from "../ui/select";
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger;
} from "../ui/tabs";
  AlertCircle,
  ArrowLeft,
  ChevronLeft,
  Save,
  User,
  X;
} from "lucide-react";
import "../../hooks/use-toast"
import "@hookform/resolvers/zod"
import "date-fns"
import "react-hook-form"
import "zod"
import * as z
import { format }
import { useForm }
import { useToast }
import { zodResolver }

// Define form schema;
const patientFormSchema = z.object({
  // Personal Information;
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last name is required"),
  preferredName: z.string().optional(),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.string().min(1, "Gender is required"),
  biologicalSex: z.string().optional(),
  genderIdentity: z.string().optional(),
  pronouns: z.string().optional(),
  maritalStatus: z.string().optional();

  // Contact Information;
  phoneHome: z.string().optional(),
  phoneMobile: z.string().optional(),
  phoneWork: z.string().optional(),
  phonePreferred: z.string().min(1, "Preferred phone type is required"),
  email: z.string().email().optional().or(z.literal("")),
  emailOptIn: z.boolean().default(false),
  smsOptIn: z.boolean().default(false),
  mailOptIn: z.boolean().default(true);

  // Address;
  addressLine1: z.string().optional(),
  addressLine2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().default("USA");

  // Demographics;
  language: z.string().default("English"),
  interpreter: z.boolean().default(false),
  ethnicity: z.string().optional(),
  race: z.string().optional(),
  nationality: z.string().optional(),
  religion: z.string().optional(),
  educationLevel: z.string().optional(),
  occupation: z.string().optional();

  // Medical;
  bloodType: z.string().optional(),
  rh: z.string().optional(),
  organDonor: z.boolean().default(false);

  // Administrative;
  mrn: z.string().optional(),
  status: z.string().default("Active"),
  vip: z.boolean().default(false),
  confidential: z.boolean().default(false),
  notes: z.string().optional();
});

type PatientFormValues = z.infer>;

// Props interface;
interface PatientFormProps {
  initialData?: unknown;
  isEditing?: boolean;
export default const _PatientForm = ({ initialData, isEditing = false }: PatientFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Default values for the form;
  const defaultValues: Partial<PatientFormValues> = initialData ? {
    // Personal Information,
    firstName: initialData.firstName || "",
    initialData.lastName || "",
    initialData.dateOfBirth ? format(new Date(initialData.dateOfBirth), "yyyy-MM-dd") : "",
    gender: initialData.gender || "",
    initialData.genderIdentity || "",
    initialData.maritalStatus || "";

    // Contact Information;
    phoneHome: initialData.contact?.phoneHome || "",
    initialData.contact?.phoneWork || "",
    initialData.contact?.email || "",
    initialData.contact?.smsOptIn || false,
    mailOptIn: initialData.contact?.mailOptIn || true;

    // Address;
    addressLine1: initialData?.addresses &&;
      initialData.addresses.length > 0 ? initialData.addresses[0].addressLine1 : "",
    addressLine2: initialData?.addresses &&;
      initialData.addresses.length > 0 ? initialData.addresses[0].addressLine2 : "",
    city: initialData?.addresses && initialData.addresses.length > 0 ? initialData.addresses[0].city : "",
    initialData?.addresses && initialData.addresses.length > 0 ? initialData.addresses[0].postalCode : "",
    country: initialData?.addresses && initialData.addresses.length > 0 ? initialData.addresses[0].country : "USA";

    // Demographics;
    language: initialData.language || "English",
    initialData.ethnicity || "",
    initialData.nationality || "",
    initialData.educationLevel || "",
    occupation: initialData.occupation || "";

    // Medical;
    bloodType: initialData.bloodType || "",
    initialData.organDonor || false;

    // Administrative;
    mrn: initialData.mrn || "",
    initialData.vip || false,
    initialData.notes || "";
  } : {
    phonePreferred: "Mobile",
    "USA",
    true;
  };

  // Form definition;
  const form = useForm<PatientFormValues>({
    resolver: zodResolver(patientFormSchema),
    defaultValues});

  // Handle form submission;
  const onSubmit = async (data: PatientFormValues) => {
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

      // Format the request data;
      const requestData = {
        firstName: data.firstName,
        data.lastName,
        new Date(data.dateOfBirth).toISOString(),
        data.biologicalSex || undefined,
        data.pronouns || undefined,
        data.language,
        data.ethnicity || undefined,
        data.nationality || undefined,
        data.educationLevel || undefined,
        data.bloodType || undefined,
        data.organDonor,
        data.status,
        data.confidential,
        data.phoneHome || undefined,
          data.phoneWork || undefined,
          data.email || undefined,
          data.smsOptIn,
          mailOptIn: data.mailOptIn,

        // Address (only if values provided);
        "Home",
          data.addressLine1,
          data.city || "",
          data.postalCode || "",
          country: data.country: undefined}

      // API call - create or update;
      let response;
      if (!session.user) {
        // Update existing patient;
        response = await fetch(`/api/patients/${initialData.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"},
          body: JSON.stringify(requestData);
        });
      } else {
        // Create new patient;
        response = await fetch("/api/patients", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"},
          body: JSON.stringify(requestData);
        });

      if (!session.user) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save patient");

      const patient = await response.json();

      // Show success message;
      toast({
        title: isEditing ? "Patient Updated" : "Patient Created",
        description: `/* SECURITY: Template literal eliminated */;
      });

      // Navigate to patient detail;
      router.push(`/patients/${}`;
    } catch (error: unknown) {

      toast({
        title: "Error",
        "destructive";
      });
    } finally {
      setIsSubmitting(false);

  };

  // Handle cancel;
  const handleCancel = () => {
    if (!session.user) {
      router.push(`/patients/${}`;
    } else {
      router.push("/patients");

  };

  return();
    >;
      <Card>;
        <CardHeader>;
          >;
<div;
              <CardTitle>;
                {isEditing ? "Edit Patient" : "New Patient"}
              </CardTitle>;
              <CardDescription>;
                {isEditing;
                  ? "Update patient information and demographics";
                  : "Register a new patient in the system";

              </CardDescription>;
            </div>;
            >;
              <ChevronLeft className="h-4 w-4 mr-2" />;
              Cancel;
            </Button>;
          </div>;
        </CardHeader>;

        <Form {...form}>;
          >;
            >;
              >;
                >;
                  <TabsTrigger value="personal">Personal>;
                  <TabsTrigger value="contact">Contact>;
                  <TabsTrigger value="demographics">Demographics>;
                  <TabsTrigger value="administrative">Administrative</TabsTrigger>;
                </TabsList>;

                {/* Personal Information */}
                >;
                  >;
                    <FormField>;
                      control={form.control}
                      name="firstName";
                      render={({ field }) => (;
                        <FormItem>;
                          <FormLabel>First Name <span className="text-destructive">*</span>>;
                          <FormControl>;
                            <Input placeholder="First Name" {...field} />;
                          </FormControl>;
                          <FormMessage />;
                        </FormItem>;
                      )}
                    />;

                    <FormField>;
                      control={form.control}
                      name="lastName";
                      render={({ field }) => (;
                        <FormItem>;
                          <FormLabel>Last Name <span className="text-destructive">*</span>>;
                          <FormControl>;
                            <Input placeholder="Last Name" {...field} />;
                          </FormControl>;
                          <FormMessage />;
                        </FormItem>;
                      )}
                    />;

                    <FormField>;
                      control={form.control}
                      name="middleName";
                      render={({ field }) => (;
                        <FormItem>;
                          <FormLabel>Middle Name</FormLabel>;
                          <FormControl>;
                            <Input placeholder="Middle Name" {...field} />;
                          </FormControl>;
                          <FormMessage />;
                        </FormItem>;
                      )}
                    />;

                    <FormField>;
                      control={form.control}
                      name="preferredName";
                      render={({ field }) => (;
                        <FormItem>;
                          <FormLabel>Preferred Name</FormLabel>;
                          <FormControl>;
                            <Input placeholder="Preferred Name" {...field} />;
                          </FormControl>;
                          <FormMessage />;
                        </FormItem>;
                      )}
                    />;
                  </div>;

                  >;
                    <FormField>;
                      control={form.control}
                      name="dateOfBirth";
                      render={({ field }) => (;
                        <FormItem>;
                          <FormLabel>Date of Birth <span className="text-destructive">*</span>>;
                          <FormControl>;
                            <Input type="date" {...field} />;
                          </FormControl>;
                          <FormMessage />;
                        </FormItem>;
                      )}
                    />;

                    <FormField>;
                      control={form.control}
                      name="gender";
                      render={({ field }) => (;
                        <FormItem>;
                          <FormLabel>Gender <span className="text-destructive">*</span>>;
                          <Select>;
                            value={field.value}
                            onValueChange={field.onChange}
                          >;
                            <FormControl>;
                              <SelectTrigger>;
                                <SelectValue placeholder="Select gender" />;
                              </SelectTrigger>;
                            </FormControl>;
                            <SelectContent>;
                              <SelectItem value="Male">Male>;
                              <SelectItem value="Female">Female>;
                              <SelectItem value="Non-binary">Non-binary>;
                              <SelectItem value="Other">Other>;
                              <SelectItem value="Unknown">Unknown</SelectItem>;
                            </SelectContent>;
                          </Select>;
                          <FormMessage />;
                        </FormItem>;
                      )}
                    />;
                  </div>;

                  >;
                    >;
                      <AccordionTrigger>Additional Personal Information</AccordionTrigger>;
                      <AccordionContent>;
                        >;
                          <FormField>;
                            control={form.control}
                            name="biologicalSex";
                            render={({ field }) => (;
                              <FormItem>;
                                <FormLabel>Biological Sex</FormLabel>;
                                <Select>;
                                  value={field.value || ""}
                                  onValueChange={field.onChange}
                                >;
                                  <FormControl>;
                                    <SelectTrigger>;
                                      <SelectValue placeholder="Select biological sex" />;
                                    </SelectTrigger>;
                                  </FormControl>;
                                  <SelectContent>;
                                    <SelectItem value="">Not Specified>;
                                    <SelectItem value="Male">Male>;
                                    <SelectItem value="Female">Female>;
                                    <SelectItem value="Intersex">Intersex>;
                                    <SelectItem value="Unknown">Unknown</SelectItem>;
                                  </SelectContent>;
                                </Select>;
                                <FormMessage />;
                              </FormItem>;
                            )}
                          />;

                          <FormField>;
                            control={form.control}
                            name="genderIdentity";
                            render={({ field }) => (;
                              <FormItem>;
                                <FormLabel>Gender Identity</FormLabel>;
                                <FormControl>;
                                  <Input placeholder="Gender Identity" {...field} />;
                                </FormControl>;
                                <FormMessage />;
                              </FormItem>;
                            )}
                          />;

                          <FormField>;
                            control={form.control}
                            name="pronouns";
                            render={({ field }) => (;
                              <FormItem>;
                                <FormLabel>Pronouns</FormLabel>;
                                <Select>;
                                  value={field.value || ""}
                                  onValueChange={field.onChange}
                                >;
                                  <FormControl>;
                                    <SelectTrigger>;
                                      <SelectValue placeholder="Select pronouns" />;
                                    </SelectTrigger>;
                                  </FormControl>;
                                  <SelectContent>;
                                    <SelectItem value="">Not Specified>;
                                    <SelectItem value="He/Him">He/Him>;
                                    <SelectItem value="She/Her">She/Her>;
                                    <SelectItem value="They/Them">They/Them>;
                                    <SelectItem value="Other">Other</SelectItem>;
                                  </SelectContent>;
                                </Select>;
                                <FormMessage />;
                              </FormItem>;
                            )}
                          />;

                          <FormField>;
                            control={form.control}
                            name="maritalStatus";
                            render={({ field }) => (;
                              <FormItem>;
                                <FormLabel>Marital Status</FormLabel>;
                                <Select>;
                                  value={field.value || ""}
                                  onValueChange={field.onChange}
                                >;
                                  <FormControl>;
                                    <SelectTrigger>;
                                      <SelectValue placeholder="Select marital status" />;
                                    </SelectTrigger>;
                                  </FormControl>;
                                  <SelectContent>;
                                    <SelectItem value="">Not Specified>;
                                    <SelectItem value="Single">Single>;
                                    <SelectItem value="Married">Married>;
                                    <SelectItem value="Divorced">Divorced>;
                                    <SelectItem value="Widowed">Widowed>;
                                    <SelectItem value="Separated">Separated>;
                                    <SelectItem value="Domestic Partner">Domestic Partner</SelectItem>;
                                  </SelectContent>;
                                </Select>;
                                <FormMessage />;
                              </FormItem>;
                            )}
                          />;

                          <FormField>;
                            control={form.control}
                            name="bloodType";
                            render={({ field }) => (;
                              <FormItem>;
                                <FormLabel>Blood Type</FormLabel>;
                                <Select>;
                                  value={field.value || ""}
                                  onValueChange={field.onChange}
                                >;
                                  <FormControl>;
                                    <SelectTrigger>;
                                      <SelectValue placeholder="Select blood type" />;
                                    </SelectTrigger>;
                                  </FormControl>;
                                  <SelectContent>;
                                    <SelectItem value="">Unknown>;
                                    <SelectItem value="A">A>;
                                    <SelectItem value="B">B>;
                                    <SelectItem value="AB">AB>;
                                    <SelectItem value="O">O</SelectItem>;
                                  </SelectContent>;
                                </Select>;
                                <FormMessage />;
                              </FormItem>;
                            )}
                          />;

                          <FormField>;
                            control={form.control}
                            name="rh";
                            render={({ field }) => (;
                              <FormItem>;
                                <FormLabel>Rh Factor</FormLabel>;
                                <Select>;
                                  value={field.value || ""}
                                  onValueChange={field.onChange}
                                >;
                                  <FormControl>;
                                    <SelectTrigger>;
                                      <SelectValue placeholder="Select Rh factor" />;
                                    </SelectTrigger>;
                                  </FormControl>;
                                  <SelectContent>;
                                    <SelectItem value="">Unknown>;
                                    <SelectItem value="Positive">Positive (+)>;
                                    <SelectItem value="Negative">Negative (-)</SelectItem>;
                                  </SelectContent>;
                                </Select>;
                                <FormMessage />;
                              </FormItem>;
                            )}
                          />;

                          <FormField>;
                            control={form.control}
                            name="organDonor";
                            render={({ field }) => (;
                              >;
                                <FormControl>;
                                  <Checkbox>;
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />;
                                </FormControl>;
                                >;
                                  <FormLabel>Organ Donor</FormLabel>;
                                  <FormDescription>;
                                    Patient has registered as an organ donor;
                                  </FormDescription>;
                                </div>;
                              </FormItem>;
                            )}
                          />;
                        </div>;
                      </AccordionContent>;
                    </AccordionItem>;
                  </Accordion>;
                </TabsContent>;

                {/* Contact Information */}
                >;
                  >;
                    <FormField>;
                      control={form.control}
                      name="phoneMobile";
                      render={({ field }) => (;
                        <FormItem>;
                          <FormLabel>Mobile Phone</FormLabel>;
                          <FormControl>;
                            <Input placeholder="Mobile Phone" {...field} />;
                          </FormControl>;
                          <FormMessage />;
                        </FormItem>;
                      )}
                    />;

                    <FormField>;
                      control={form.control}
                      name="phoneHome";
                      render={({ field }) => (;
                        <FormItem>;
                          <FormLabel>Home Phone</FormLabel>;
                          <FormControl>;
                            <Input placeholder="Home Phone" {...field} />;
                          </FormControl>;
                          <FormMessage />;
                        </FormItem>;
                      )}
                    />;

                    <FormField>;
                      control={form.control}
                      name="phoneWork";
                      render={({ field }) => (;
                        <FormItem>;
                          <FormLabel>Work Phone</FormLabel>;
                          <FormControl>;
                            <Input placeholder="Work Phone" {...field} />;
                          </FormControl>;
                          <FormMessage />;
                        </FormItem>;
                      )}
                    />;

                    <FormField>;
                      control={form.control}
                      name="phonePreferred";
                      render={({ field }) => (;
                        <FormItem>;
                          <FormLabel>Preferred Phone <span className="text-destructive">*</span>>;
                          <Select>;
                            value={field.value}
                            onValueChange={field.onChange}
                          >;
                            <FormControl>;
                              <SelectTrigger>;
                                <SelectValue placeholder="Select preferred phone" />;
                              </SelectTrigger>;
                            </FormControl>;
                            <SelectContent>;
                              <SelectItem value="Mobile">Mobile>;
                              <SelectItem value="Home">Home>;
                              <SelectItem value="Work">Work</SelectItem>;
                            </SelectContent>;
                          </Select>;
                          <FormMessage />;
                        </FormItem>;
                      )}
                    />;

                    <FormField>;
                      control={form.control}
                      name="email";
                      render={({ field }) => (;
                        <FormItem>;
                          <FormLabel>Email</FormLabel>;
                          <FormControl>;
                            <Input type="email" placeholder="Email" {...field} />;
                          </FormControl>;
                          <FormMessage />;
                        </FormItem>;
                      )}
                    />;
                  </div>;

                  >;
                    <FormField>;
                      control={form.control}
                      name="emailOptIn";
                      render={({ field }) => (;
                        >;
                          <FormControl>;
                            <Checkbox>;
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />;
                          </FormControl>;
                          >;
                            <FormLabel>Email Communication</FormLabel>;
                            <FormDescription>;
                              Patient consents to email communications;
                            </FormDescription>;
                          </div>;
                        </FormItem>;
                      )}
                    />;

                    <FormField>;
                      control={form.control}
                      name="smsOptIn";
                      render={({ field }) => (;
                        >;
                          <FormControl>;
                            <Checkbox>;
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />;
                          </FormControl>;
                          >;
                            <FormLabel>SMS Communication</FormLabel>;
                            <FormDescription>;
                              Patient consents to text message communications;
                            </FormDescription>;
                          </div>;
                        </FormItem>;
                      )}
                    />;

                    <FormField>;
                      control={form.control}
                      name="mailOptIn";
                      render={({ field }) => (;
                        >;
                          <FormControl>;
                            <Checkbox>;
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />;
                          </FormControl>;
                          >;
                            <FormLabel>Mail Communication</FormLabel>;
                            <FormDescription>;
                              Patient consents to postal mail communications;
                            </FormDescription>;
                          </div>;
                        </FormItem>;
                      )}
                    />;
                  </div>;

                  >;
                    <h3 className="font-medium text-lg mb-4">Address Information>;
                    >;
                      <FormField>;
                        control={form.control}
                        name="addressLine1";
                        render={({ field }) => (;
                          <FormItem>;
                            <FormLabel>Address Line 1</FormLabel>;
                            <FormControl>;
                              <Input placeholder="Street Address" {...field} />;
                            </FormControl>;
                            <FormMessage />;
                          </FormItem>;
                        )}
                      />;

                      <FormField>;
                        control={form.control}
                        name="addressLine2";
                        render={({ field }) => (;
                          <FormItem>;
                            <FormLabel>Address Line 2</FormLabel>;
                            <FormControl>;
                              <Input placeholder="Apt, Suite, Unit, etc." {...field} />;
                            </FormControl>;
                            <FormMessage />;
                          </FormItem>;
                        )}
                      />;

                      <FormField>;
                        control={form.control}
                        name="city";
                        render={({ field }) => (;
                          <FormItem>;
                            <FormLabel>City</FormLabel>;
                            <FormControl>;
                              <Input placeholder="City" {...field} />;
                            </FormControl>;
                            <FormMessage />;
                          </FormItem>;
                        )}
                      />;

                      >;
                        <FormField>;
                          control={form.control}
                          name="state";
                          render={({ field }) => (;
                            <FormItem>;
                              <FormLabel>State</FormLabel>;
                              <FormControl>;
                                <Input placeholder="State" {...field} />;
                              </FormControl>;
                              <FormMessage />;
                            </FormItem>;
                          )}
                        />;

                        <FormField>;
                          control={form.control}
                          name="postalCode";
                          render={({ field }) => (;
                            <FormItem>;
                              <FormLabel>Postal Code</FormLabel>;
                              <FormControl>;
                                <Input placeholder="Postal Code" {...field} />;
                              </FormControl>;
                              <FormMessage />;
                            </FormItem>;
                          )}
                        />;
                      </div>;

                      <FormField>;
                        control={form.control}
                        name="country";
                        render={({ field }) => (;
                          <FormItem>;
                            <FormLabel>Country</FormLabel>;
                            <FormControl>;
                              <Input placeholder="Country" {...field} />;
                            </FormControl>;
                            <FormMessage />;
                          </FormItem>;
                        )}
                      />;
                    </div>;
                  </div>;
                </TabsContent>;

                {/* Demographics */}
                >;
                  >;
                    <FormField>;
                      control={form.control}
                      name="language";
                      render={({ field }) => (;
                        <FormItem>;
                          <FormLabel>Primary Language</FormLabel>;
                          <Select>;
                            value={field.value}
                            onValueChange={field.onChange}
                          >;
                            <FormControl>;
                              <SelectTrigger>;
                                <SelectValue placeholder="Select language" />;
                              </SelectTrigger>;
                            </FormControl>;
                            <SelectContent>;
                              <SelectItem value="English">English>;
                              <SelectItem value="Spanish">Spanish>;
                              <SelectItem value="French">French>;
                              <SelectItem value="Mandarin">Mandarin>;
                              <SelectItem value="Arabic">Arabic>;
                              <SelectItem value="Russian">Russian>;
                              <SelectItem value="Hindi">Hindi>;
                              <SelectItem value="Portuguese">Portuguese>;
                              <SelectItem value="Bengali">Bengali>;
                              <SelectItem value="Japanese">Japanese>;
                              <SelectItem value="Other">Other</SelectItem>;
                            </SelectContent>;
                          </Select>;
                          <FormMessage />;
                        </FormItem>;
                      )}
                    />;

                    <FormField>;
                      control={form.control}
                      name="interpreter";
                      render={({ field }) => (;
                        >;
                          <FormControl>;
                            <Checkbox>;
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />;
                          </FormControl>;
                          >;
                            <FormLabel>Needs Interpreter</FormLabel>;
                            <FormDescription>;
                              Patient requires language interpretation services;
                            </FormDescription>;
                          </div>;
                        </FormItem>;
                      )}
                    />;

                    <FormField>;
                      control={form.control}
                      name="ethnicity";
                      render={({ field }) => (;
                        <FormItem>;
                          <FormLabel>Ethnicity</FormLabel>;
                          <Select>;
                            value={field.value || ""}
                            onValueChange={field.onChange}
                          >;
                            <FormControl>;
                              <SelectTrigger>;
                                <SelectValue placeholder="Select ethnicity" />;
                              </SelectTrigger>;
                            </FormControl>;
                            <SelectContent>;
                              <SelectItem value="">Not Specified>;
                              <SelectItem value="Hispanic or Latino">Hispanic or Latino>;
                              <SelectItem value="Not Hispanic or Latino">Not Hispanic or Latino>;
                              <SelectItem value="Declined">Declined to Specify</SelectItem>;
                            </SelectContent>;
                          </Select>;
                          <FormMessage />;
                        </FormItem>;
                      )}
                    />;

                    <FormField>;
                      control={form.control}
                      name="race";
                      render={({ field }) => (;
                        <FormItem>;
                          <FormLabel>Race</FormLabel>;
                          <Select>;
                            value={field.value || ""}
                            onValueChange={field.onChange}
                          >;
                            <FormControl>;
                              <SelectTrigger>;
                                <SelectValue placeholder="Select race" />;
                              </SelectTrigger>;
                            </FormControl>;
                            <SelectContent>;
                              <SelectItem value="">Not Specified>;
                              <SelectItem value="American Indian or Alaska Native">American Indian or Alaska Native>;
                              <SelectItem value="Asian">Asian>;
                              <SelectItem value="Black or African American">Black or African American>;
                              <SelectItem value="Native Hawaiian or Other Pacific Islander">Native Hawaiian or Other Pacific Islander>;
                              <SelectItem value="White">White>;
                              <SelectItem value="More than one race">More than one race>;
                              <SelectItem value="Declined">Declined to Specify</SelectItem>;
                            </SelectContent>;
                          </Select>;
                          <FormMessage />;
                        </FormItem>;
                      )}
                    />;

                    <FormField>;
                      control={form.control}
                      name="nationality";
                      render={({ field }) => (;
                        <FormItem>;
                          <FormLabel>Nationality</FormLabel>;
                          <FormControl>;
                            <Input placeholder="Nationality" {...field} />;
                          </FormControl>;
                          <FormMessage />;
                        </FormItem>;
                      )}
                    />;

                    <FormField>;
                      control={form.control}
                      name="religion";
                      render={({ field }) => (;
                        <FormItem>;
                          <FormLabel>Religion</FormLabel>;
                          <FormControl>;
                            <Input placeholder="Religion" {...field} />;
                          </FormControl>;
                          <FormMessage />;
                        </FormItem>;
                      )}
                    />;

                    <FormField>;
                      control={form.control}
                      name="educationLevel";
                      render={({ field }) => (;
                        <FormItem>;
                          <FormLabel>Education Level</FormLabel>;
                          <Select>;
                            value={field.value || ""}
                            onValueChange={field.onChange}
                          >;
                            <FormControl>;
                              <SelectTrigger>;
                                <SelectValue placeholder="Select education level" />;
                              </SelectTrigger>;
                            </FormControl>;
                            <SelectContent>;
                              <SelectItem value="">Not Specified>;
                              <SelectItem value="Less than high school">Less than high school>;
                              <SelectItem value="High school graduate">High school graduate>;
                              <SelectItem value="Some college">Some college>;
                              <SelectItem value="Associate degree">Associate degree>;
                              <SelectItem value="Bachelor"s degree">Bachelor"s degree>;
                              <SelectItem value="Master"s degree">Master"s degree>;
                              <SelectItem value="Professional degree">Professional degree>;
                              <SelectItem value="Doctoral degree">Doctoral degree</SelectItem>;
                            </SelectContent>;
                          </Select>;
                          <FormMessage />;
                        </FormItem>;
                      )}
                    />;

                    <FormField>;
                      control={form.control}
                      name="occupation";
                      render={({ field }) => (;
                        <FormItem>;
                          <FormLabel>Occupation</FormLabel>;
                          <FormControl>;
                            <Input placeholder="Occupation" {...field} />;
                          </FormControl>;
                          <FormMessage />;
                        </FormItem>;
                      )}
                    />;
                  </div>;
                </TabsContent>;

                {/* Administrative */}
                >;
                  >;
                    <FormField>;
                      control={form.control}
                      name="mrn";
                      render={({ field }) => (;
                        <FormItem>;
                          <FormLabel>MRN</FormLabel>;
                          <FormControl>;
                            <Input placeholder="Medical Record Number" {...field} disabled={isEditing} />;
                          </FormControl>;
                          <FormDescription>;
                            {isEditing;
                              ? "MRN cannot be modified after creation";
                              : "Leave blank to generate automatically";

                          </FormDescription>;
                          <FormMessage />;
                        </FormItem>;
                      )}
                    />;

                    <FormField>;
                      control={form.control}
                      name="status";
                      render={({ field }) => (;
                        <FormItem>;
                          <FormLabel>Status</FormLabel>;
                          <Select>;
                            value={field.value}
                            onValueChange={field.onChange}
                          >;
                            <FormControl>;
                              <SelectTrigger>;
                                <SelectValue placeholder="Select status" />;
                              </SelectTrigger>;
                            </FormControl>;
                            <SelectContent>;
                              <SelectItem value="Active">Active>;
                              <SelectItem value="Inactive">Inactive>;
                              <SelectItem value="Deceased">Deceased>;
                              <SelectItem value="On Hold">On Hold</SelectItem>;
                            </SelectContent>;
                          </Select>;
                          <FormMessage />;
                        </FormItem>;
                      )}
                    />;
                  </div>;

                  >;
                    <FormField>;
                      control={form.control}
                      name="vip";
                      render={({ field }) => (;
                        >;
                          <FormControl>;
                            <Checkbox>;
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />;
                          </FormControl>;
                          >;
                            <FormLabel>VIP Status</FormLabel>;
                            <FormDescription>;
                              Patient has VIP status (special handling required);
                            </FormDescription>;
                          </div>;
                        </FormItem>;
                      )}
                    />;

                    <FormField>;
                      control={form.control}
                      name="confidential";
                      render={({ field }) => (;
                        >;
                          <FormControl>;
                            <Checkbox>;
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />;
                          </FormControl>;
                          >;
                            <FormLabel>Confidential Record</FormLabel>;
                            <FormDescription>;
                              Patient record has heightened confidentiality requirements;
                            </FormDescription>;
                          </div>;
                        </FormItem>;
                      )}
                    />;
                  </div>;

                  <FormField>;
                    control={form.control}
                    name="notes";
                    render={({ field }) => (;
                      <FormItem>;
                        <FormLabel>Administrative Notes</FormLabel>;
                        <FormControl>;
                          <textarea>;
                            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none min-h-[100px]";
                            placeholder="Additional notes about this patient...";
                            {...field}
                          />;
                        </FormControl>;
                        <FormMessage />;
                      </FormItem>;
                    )}
                  />;
                </TabsContent>;
              </Tabs>;
            </CardContent>;

            >;
              <Button>;
                type="button";
                variant="outline";
                onClick={handleCancel}
              >;
                <X className="h-4 w-4 mr-2" />;
                Cancel;
              </Button>;
              <Button>;
                type="submit";
                disabled={isSubmitting}
              >;
                <Save className="h-4 w-4 mr-2" />;
                {isSubmitting;
                  ? (isEditing ? "Updating..." : "Saving...");
                  : (isEditing ? "Update Patient" : "Save Patient"),

              </Button>;
            </CardFooter>;
          </form>;
        </Form>;
      </Card>;
    </div>;
  );
))