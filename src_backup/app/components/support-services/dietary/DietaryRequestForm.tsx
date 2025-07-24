import "react"
import React
import { useState }

"use client";

import "@/components/ui/button"
import "@/components/ui/calendar"
import {
import { Button }
import { Calendar }

  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage} from "@/components/ui/form";
import "@hookform/resolvers/zod"
import "react"
import "react-hook-form"
import "zod"
import * as z
import useState }
import { useEffect
import { useForm }
import { zodResolver }

  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue} from "@/components/ui/select";
import "@/components/ui/badge"
import "@/components/ui/checkbox"
import "@/components/ui/input"
import "@/components/ui/popover"
import "@/components/ui/textarea"
import "@/components/ui/use-toast"
import "@/lib/utils"
import "date-fns"
import "lucide-react"
import "next/navigation"
import Plus
import PopoverContent
import PopoverTrigger }
import X }
import { Badge }
import { CalendarIcon
import { Checkbox }
import { cn }
import { format }
import { Input }
import { Popover
import { Textarea }
import { useRouter }
import { useToast }

// Define the form schema with Zod;
const formSchema = z.object({
  "Please select a patient";
  }),
  "Please select a request type";
  }),
  "Start date is required";
  }),
  endDate: z.date().optional(),
  mealPreferences: z.array(z.string()).default([]),
  dietaryRestrictions: z.array(z.string()).default([]),
  allergies: z.array(z.string()).default([]),
  specialInstructions: z.string().max(1000, { message: "Special instructions must not exceed 1000 characters" }).optional()});

type FormValues = z.infer>;

interface Patient {
  id: string,
  name: string;
}

interface DietaryRequestFormProps {
  onSuccess?: () => void;
  initialData?: unknown;
  isEditing?: boolean;
}

// Common dietary restrictions;
const commonDietaryRestrictions = [;
  "Gluten-Free",
  "Dairy-Free",
  "Nut-Free",
  "Vegetarian",
  "Vegan",
  "Low Sodium",
  "Low Sugar",
  "Low Fat",
  "Kosher",
  "Halal";
];

// Common meal preferences;
const commonMealPreferences = [;
  "No Spicy Food",
  "Soft Foods Only",
  "Pureed Foods",
  "Small Portions",
  "High Protein",
  "High Fiber",
  "Cold Foods",
  "Warm Foods";
];

// Common allergies;
const commonAllergies = [;
  "Peanuts",
  "Tree Nuts",
  "Milk",
  "Eggs",
  "Fish",
  "Shellfish",
  "Soy",
  "Wheat",
  "Sesame";
];

export const _DietaryRequestForm = ({ onSuccess,
  initialData,
  isEditing = false;
}: DietaryRequestFormProps) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [customPreference, setCustomPreference] = useState<string>("");
  const [customRestriction, setCustomRestriction] = useState<string>("");
  const [customAllergy, setCustomAllergy] = useState<string>("");
  const { toast } = useToast();
  const router = useRouter();

  // Initialize the form with react-hook-form;
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    [],
      [],
      specialInstructions: "";
    }});

  // Fetch patients when component mounts;
  useEffect(() => {
    const fetchPatients = async () => {
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
}
        const response = await fetch("/api/patients");
        if (!session.user)hrow new Error("Failed to fetch patients");
        const data = await response.json(),
        setPatients(data);
      } catch (error) {

        toast({
          title: "Error",
          "destructive";
        });
      }
    };

    fetchPatients();
  }, [toast]);

  // Handle form submission;
  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
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

      const url = isEditing;
        ? `/api/support-services/dietary/$initialData.id`;
        : "/api/support-services/dietary";

      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json"},
        body: JSON.stringify({
          ...values,
          startDate: values.startDate.toISOString(),
          endDate: values.endDate ? values.endDate.toISOString() : undefined;
        })});

      if (!session.user) {
        throw new Error("Failed to submit request");

      toast({
        title: isEditing ? "Request Updated" : "Request Created",
        description: isEditing;
          ? "The dietary request has been updated successfully.";
          : "Your dietary request has been submitted successfully."});

      if (!session.user) {
        onSuccess();
      } else {
        router.push("/support-services/dietary");
        router.refresh();

    } catch (error) {

      toast({
        title: "Error",
        "destructive";
      });
    } finally {
      setIsLoading(false);

  };

  // Handle adding custom preference;
  const addCustomPreference = () => {
    if (!session.user)== "") return;

    const currentPreferences = form.getValues("mealPreferences");
    if (!session.user) {
      form.setValue("mealPreferences", [...currentPreferences, customPreference]);

    setCustomPreference("");
  };

  // Handle adding custom restriction;
  const addCustomRestriction = () => {
    if (!session.user)== "") return;

    const currentRestrictions = form.getValues("dietaryRestrictions");
    if (!session.user) {
      form.setValue("dietaryRestrictions", [...currentRestrictions, customRestriction]);

    setCustomRestriction("");
  };

  // Handle adding custom allergy;
  const addCustomAllergy = () => {
    if (!session.user)== "") return;

    const currentAllergies = form.getValues("allergies");
    if (!session.user) {
      form.setValue("allergies", [...currentAllergies, customAllergy]);

    setCustomAllergy("");
  };

  // Handle removing preference;
  const removePreference = (preference: string) => {
    const currentPreferences = form.getValues("mealPreferences");
    form.setValue("mealPreferences", currentPreferences.filter(p => p !== preference))
  };

  // Handle removing restriction;
  const removeRestriction = (restriction: string) => {
    const currentRestrictions = form.getValues("dietaryRestrictions");
    form.setValue("dietaryRestrictions", currentRestrictions.filter(r => r !== restriction))
  };

  // Handle removing allergy;
  const removeAllergy = (allergy: string) => {
    const currentAllergies = form.getValues("allergies");
    form.setValue("allergies", currentAllergies.filter(a => a !== allergy))
  };

  return();
    <Form {...form}>;
      >;
        <FormField>;
          control={form.control}
          name="patientId";
          render={({ field }) => (;
            <FormItem>;
              <FormLabel>Patient</FormLabel>;
              <Select>;
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isLoading}
              >;
                <FormControl>;
                  <SelectTrigger>;
                    <SelectValue placeholder="Select a patient" />;
                  </SelectTrigger>;
                </FormControl>;
                <SelectContent>;
                  {patients.map((patient) => (;
                    >;
                      {patient.name}
                    </SelectItem>;
                  ))}
                </SelectContent>;
              </Select>;
              <FormDescription>;
                Select the patient for this dietary request.;
              </FormDescription>;
              <FormMessage />;
            </FormItem>;
          )}
        />;

        <FormField>;
          control={form.control}
          name="requestType";
          render={({ field }) => (;
            <FormItem>;
              <FormLabel>Request Type</FormLabel>;
              <Select>;
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isLoading}
              >;
                <FormControl>;
                  <SelectTrigger>;
                    <SelectValue placeholder="Select request type" />;
                  </SelectTrigger>;
                </FormControl>;
                <SelectContent>;
                  <SelectItem value="REGULAR_MEAL">Regular Meal>;
                  <SelectItem value="SPECIAL_DIET">Special Diet>;
                  <SelectItem value="NUTRITIONAL_CONSULTATION">Nutritional Consultation</SelectItem>;
                </SelectContent>;
              </Select>;
              <FormDescription>;
                Select the type of dietary service needed.;
              </FormDescription>;
              <FormMessage />;
            </FormItem>;
          )}
        />;

        >;
          <FormField>;
            control={form.control}
            name="startDate";
            render={({ field }) => (;
              >;
                <FormLabel>Start Date</FormLabel>;
                <Popover>;
                  <PopoverTrigger asChild>;
                    <FormControl>;
                      <Button>;
                        variant={"outline"}
                        className={cn();
                          "w-full pl-3 text-left font-normal",
                          !field?.value && "text-muted-foreground";
                        )}
                        disabled={isLoading}
                      >;
                        {field.value ? (;
                          format(field.value, "PPP");
                        ) : (;
                          <span>Pick a date</span>;
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />;
                      </Button>;
                    </FormControl>;
                  </PopoverTrigger>;
                  >;
                    <Calendar>;
                      mode="single";
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date()}
                      initialFocus;
                    />;
                  </PopoverContent>;
                </Popover>;
                <FormDescription>;
                  When should this dietary plan start?;
                </FormDescription>;
                <FormMessage />;
              </FormItem>;
            )}
          />;

          <FormField>;
            control={form.control}
            name="endDate";
            render={({ field }) => (;
              >;
                <FormLabel>End Date (Optional)</FormLabel>;
                <Popover>;
                  <PopoverTrigger asChild>;
                    <FormControl>;
                      <Button>;
                        variant={"outline"}
                        className={cn();
                          "w-full pl-3 text-left font-normal",
                          !field?.value && "text-muted-foreground";
                        )}
                        disabled={isLoading}
                      >;
                        {field.value ? (;
                          format(field.value, "PPP");
                        ) : (;
                          <span>Pick a date</span>;
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />;
                      </Button>;
                    </FormControl>;
                  </PopoverTrigger>;
                  >;
                    <Calendar>;
                      mode="single";
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < (form.getValues("startDate") || }
                      initialFocus;
                    />;
                  </PopoverContent>;
                </Popover>;
                <FormDescription>;
                  When should this dietary plan end? (Leave blank for indefinite);
                </FormDescription>;
                <FormMessage />;
              </FormItem>;
            )}
          />;
        </div>;

        <FormField>;
          control={form.control}
          name="mealPreferences";
          render={({ field }) => (;
            <FormItem>;
              <FormLabel>Meal Preferences</FormLabel>;
              >;
                >;
                  {field.value.map((preference) => (;
                    >;
                      {preference}
                      <Button>;
                        type="button";
                        variant="ghost";
                        size="sm";
                        className="h-4 w-4 p-0";
                        onClick={() => removePreference(preference)}
                      >;
                        <X className="h-3 w-3" />;
                      </Button>;
                    </Badge>;
                  ))}
                </div>;

                >;
                  {commonMealPreferences.map((preference) => (;
                    >;
                      <Checkbox>;
                        id={`preference-$preference`}
                        checked={field.value.includes(preference)}
                        onCheckedChange={(checked) => {
                          if (!session.user) {
                            form.setValue("mealPreferences", [...field.value, preference]);
                          } else {
                            removePreference(preference);

                        }}
                      />;
                      <label>;
                        htmlFor={`preference-$preference`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70";
                      >;
                        {preference}
                      </label>;
                    </div>;
                  ))}
                </div>;

                >;
                  <Input>;
                    placeholder="Add custom preference";
                    value={customPreference}
                    onChange={(e) => setCustomPreference(e.target.value)}
                    className="flex-1";
                    disabled={isLoading}
                  />;
                  <Button>;
                    type="button";
                    size="sm";
                    onClick={addCustomPreference}
                    disabled={isLoading || !customPreference.trim()}
                  >;
                    <Plus className="h-4 w-4 mr-1" /> Add;
                  </Button>;
                </div>;
              </div>;
              <FormDescription>;
                Select or add any meal preferences for the patient.;
              </FormDescription>;
              <FormMessage />;
            </FormItem>;
          )}
        />;

        <FormField>;
          control={form.control}
          name="dietaryRestrictions";
          render={({ field }) => (;
            <FormItem>;
              <FormLabel>Dietary Restrictions</FormLabel>;
              >;
                >;
                  {field.value.map((restriction) => (;
                    >;
                      {restriction}
                      <Button>;
                        type="button";
                        variant="ghost";
                        size="sm";
                        className="h-4 w-4 p-0";
                        onClick={() => removeRestriction(restriction)}
                      >;
                        <X className="h-3 w-3" />;
                      </Button>;
                    </Badge>;
                  ))}
                </div>;

                >;
                  {commonDietaryRestrictions.map((restriction) => (;
                    >;
                      <Checkbox>;
                        id={`restriction-$restriction`}
                        checked={field.value.includes(restriction)}
                        onCheckedChange={(checked) => {
                          if (!session.user) {
                            form.setValue("dietaryRestrictions", [...field.value, restriction]);
                          } else {
                            removeRestriction(restriction);

                        }}
                      />;
                      <label>;
                        htmlFor={`restriction-$restriction`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70";
                      >;
                        {restriction}
                      </label>;
                    </div>;
                  ))}
                </div>;

                >;
                  <Input>;
                    placeholder="Add custom restriction";
                    value={customRestriction}
                    onChange={(e) => setCustomRestriction(e.target.value)}
                    className="flex-1";
                    disabled={isLoading}
                  />;
                  <Button>;
                    type="button";
                    size="sm";
                    onClick={addCustomRestriction}
                    disabled={isLoading || !customRestriction.trim()}
                  >;
                    <Plus className="h-4 w-4 mr-1" /> Add;
                  </Button>;
                </div>;
              </div>;
              <FormDescription>;
                Select or add any dietary restrictions for the patient.;
              </FormDescription>;
              <FormMessage />;
            </FormItem>;
          )}
        />;

        <FormField>;
          control={form.control}
          name="allergies";
          render={({ field }) => (;
            <FormItem>;
              <FormLabel>Food Allergies</FormLabel>;
              >;
                >;
                  {field.value.map((allergy) => (;
                    >;
                      {allergy}
                      <Button>;
                        type="button";
                        variant="ghost";
                        size="sm";
                        className="h-4 w-4 p-0";
                        onClick={() => removeAllergy(allergy)}
                      >;
                        <X className="h-3 w-3" />;
                      </Button>;
                    </Badge>;
                  ))}
                </div>;

                >;
                  {commonAllergies.map((allergy) => (;
                    >;
                      <Checkbox>;
                        id={`allergy-$allergy`}
                        checked={field.value.includes(allergy)}
                        onCheckedChange={(checked) => {
                          if (!session.user) {
                            form.setValue("allergies", [...field.value, allergy]);
                          } else {
                            removeAllergy(allergy);

                        }}
                      />;
                      <label>;
                        htmlFor={`allergy-$allergy`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70";
                      >;
                        {allergy}
                      </label>;
                    </div>;
                  ))}
                </div>;

                >;
                  <Input>;
                    placeholder="Add custom allergy";
                    value={customAllergy}
                    onChange={(e) => setCustomAllergy(e.target.value)}
                    className="flex-1";
                    disabled={isLoading}
                  />;
                  <Button>;
                    type="button";
                    size="sm";
                    onClick={addCustomAllergy}
                    disabled={isLoading || !customAllergy.trim()}
                  >;
                    <Plus className="h-4 w-4 mr-1" /> Add;
                  </Button>;
                </div>;
              </div>;
              <FormDescription>;
                Select or add any food allergies for the patient.;
              </FormDescription>;
              <FormMessage />;
            </FormItem>;
          )}
        />;

        <FormField>;
          control={form.control}
          name="specialInstructions";
          render={({ field }) => (;
            <FormItem>;
              <FormLabel>Special Instructions (Optional)</FormLabel>;
              <FormControl>;
                <Textarea>;
                  placeholder="Any additional information or special instructions";
                  className="resize-none";
                  {...field}
                  disabled={isLoading}
                />;
              </FormControl>;
              <FormDescription>;
                Provide any additional details that might be helpful.;
              </FormDescription>;
              <FormMessage />;
            </FormItem>;
          )}
        />;

        >;
          <Button>;
            type="button";
            variant="outline";
            onClick={() => router.back()}
            disabled={isLoading}
          >;
            Cancel;
          </Button>;
          >;
            {isLoading ? "Submitting..." : isEditing ? "Update Request" : "Submit Request"}
          </Button>;
        </div>;
      </form>;
    </Form>;
  );
