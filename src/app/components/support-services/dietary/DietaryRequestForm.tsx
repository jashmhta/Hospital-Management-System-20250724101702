import React, { useState } from "react";
'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon, Plus, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Define the form schema with Zod
const formSchema = z.object({
  \1,\2 "Please select a patient"
  }),
  \1,\2 "Please select a request type"
  }),
  \1,\2 "Start date is required"
  }),
  endDate: z.date().optional(),
  mealPreferences: z.array(z.string()).default([]),
  dietaryRestrictions: z.array(z.string()).default([]),
  allergies: z.array(z.string()).default([]),
  specialInstructions: z.string().max(1000, { message: "Special instructions must not exceed 1000 characters" }).optional(),
});

type FormValues = z.infer\1>

interface Patient {
  id: string,
  name: string
}

interface DietaryRequestFormProps {
  onSuccess?: () => void;
  initialData?: unknown;
  isEditing?: boolean;
}

// Common dietary restrictions
const commonDietaryRestrictions = [
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

// Common meal preferences
const commonMealPreferences = [
  "No Spicy Food",
  "Soft Foods Only",
  "Pureed Foods",
  "Small Portions",
  "High Protein",
  "High Fiber",
  "Cold Foods",
  "Warm Foods";
];

// Common allergies
const commonAllergies = [
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
  isEditing = false
}: DietaryRequestFormProps) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [customPreference, setCustomPreference] = useState<string>('');
  const [customRestriction, setCustomRestriction] = useState<string>('');
  const [customAllergy, setCustomAllergy] = useState<string>('');
  const { toast } = useToast();
  const router = useRouter();

  // Initialize the form with react-hook-form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    \1,\2 [],
      \1,\2 [],
      specialInstructions: ""
    },
  });

  // Fetch patients when component mounts
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch('/api/patients');
        \1 {\n  \2hrow new Error('Failed to fetch patients');
        const data = await response.json(),
        setPatients(data);
      } catch (error) {

        toast({
          title: "Error",
          \1,\2 "destructive"
        });
      }
    };

    fetchPatients();
  }, [toast]);

  // Handle form submission
  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      const url = isEditing;
        ? `/api/support-services/dietary/$initialData.id`
        : '/api/support-services/dietary';

      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...values,
          startDate: values.startDate.toISOString(),
          endDate: values.endDate ? values.endDate.toISOString() : undefined
        }),
      });

      \1 {\n  \2{
        throw new Error('Failed to submit request');
      }

      toast({
        title: isEditing ? "Request Updated" : "Request Created",
        description: isEditing;
          ? "The dietary request has been updated successfully."
          : "Your dietary request has been submitted successfully.",
      });

      \1 {\n  \2{
        onSuccess();
      } else {
        router.push('/support-services/dietary');
        router.refresh();
      }
    } catch (error) {

      toast({
        title: "Error",
        \1,\2 "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle adding custom preference
  const addCustomPreference = () => {
    \1 {\n  \2== '') return;

    const currentPreferences = form.getValues('mealPreferences');
    \1 {\n  \2 {
      form.setValue('mealPreferences', [...currentPreferences, customPreference]);
    }
    setCustomPreference('')
  };

  // Handle adding custom restriction
  const addCustomRestriction = () => {
    \1 {\n  \2== '') return;

    const currentRestrictions = form.getValues('dietaryRestrictions');
    \1 {\n  \2 {
      form.setValue('dietaryRestrictions', [...currentRestrictions, customRestriction]);
    }
    setCustomRestriction('')
  };

  // Handle adding custom allergy
  const addCustomAllergy = () => {
    \1 {\n  \2== '') return;

    const currentAllergies = form.getValues('allergies');
    \1 {\n  \2 {
      form.setValue('allergies', [...currentAllergies, customAllergy]);
    }
    setCustomAllergy('')
  };

  // Handle removing preference
  const removePreference = (preference: string) => {
    const currentPreferences = form.getValues('mealPreferences');
    form.setValue('mealPreferences', currentPreferences.filter(p => p !== preference))
  };

  // Handle removing restriction
  const removeRestriction = (restriction: string) => {
    const currentRestrictions = form.getValues('dietaryRestrictions');
    form.setValue('dietaryRestrictions', currentRestrictions.filter(r => r !== restriction))
  };

  // Handle removing allergy
  const removeAllergy = (allergy: string) => {
    const currentAllergies = form.getValues('allergies');
    form.setValue('allergies', currentAllergies.filter(a => a !== allergy))
  };

  return (
    <Form {...form}>
      \1>
        <FormField>
          control={form.control}
          name="patientId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Patient</FormLabel>
              <Select>
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isLoading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a patient" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {patients.map((patient) => (
                    \1>
                      {patient.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Select the patient for this dietary request.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField>
          control={form.control}
          name="requestType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Request Type</FormLabel>
              <Select>
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isLoading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select request type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="REGULAR_MEAL">Regular Meal\1>
                  <SelectItem value="SPECIAL_DIET">Special Diet\1>
                  <SelectItem value="NUTRITIONAL_CONSULTATION">Nutritional Consultation</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Select the type of dietary service needed.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        \1>
          <FormField>
            control={form.control}
            name="startDate"
            render={({ field }) => (
              \1>
                <FormLabel>Start Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button>
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field?.value && "text-muted-foreground";
                        )}
                        disabled={isLoading}
                      >
                        {field.value ? (
                          format(field.value, "PPP");
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  \1>
                    <Calendar>
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date()}
                      initialFocus;
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  When should this dietary plan start?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField>
            control={form.control}
            name="endDate"
            render={({ field }) => (
              \1>
                <FormLabel>End Date (Optional)</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button>
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field?.value && "text-muted-foreground";
                        )}
                        disabled={isLoading}
                      >
                        {field.value ? (
                          format(field.value, "PPP");
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  \1>
                    <Calendar>
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < (form.getValues('startDate') || \1}
                      initialFocus;
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  When should this dietary plan end? (Leave blank for indefinite)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField>
          control={form.control}
          name="mealPreferences"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meal Preferences</FormLabel>
              \1>
                \1>
                  {field.value.map((preference) => (
                    \1>
                      {preference}
                      <Button>
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0"
                        onClick={() => removePreference(preference)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>

                \1>
                  {commonMealPreferences.map((preference) => (
                    \1>
                      <Checkbox>
                        id={`preference-$preference`}
                        checked={field.value.includes(preference)}
                        onCheckedChange={(checked) => {
                          \1 {\n  \2{
                            form.setValue('mealPreferences', [...field.value, preference]);
                          } else {
                            removePreference(preference);
                          }
                        }}
                      />
                      <label>
                        htmlFor={`preference-$preference`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {preference}
                      </label>
                    </div>
                  ))}
                </div>

                \1>
                  <Input>
                    placeholder="Add custom preference"
                    value={customPreference}
                    onChange={(e) => setCustomPreference(e.target.value)}
                    className="flex-1"
                    disabled={isLoading}
                  />
                  <Button>
                    type="button"
                    size="sm"
                    onClick={addCustomPreference}
                    disabled={isLoading || !customPreference.trim()}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add
                  </Button>
                </div>
              </div>
              <FormDescription>
                Select or add any meal preferences for the patient.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField>
          control={form.control}
          name="dietaryRestrictions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dietary Restrictions</FormLabel>
              \1>
                \1>
                  {field.value.map((restriction) => (
                    \1>
                      {restriction}
                      <Button>
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0"
                        onClick={() => removeRestriction(restriction)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>

                \1>
                  {commonDietaryRestrictions.map((restriction) => (
                    \1>
                      <Checkbox>
                        id={`restriction-$restriction`}
                        checked={field.value.includes(restriction)}
                        onCheckedChange={(checked) => {
                          \1 {\n  \2{
                            form.setValue('dietaryRestrictions', [...field.value, restriction]);
                          } else {
                            removeRestriction(restriction);
                          }
                        }}
                      />
                      <label>
                        htmlFor={`restriction-$restriction`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {restriction}
                      </label>
                    </div>
                  ))}
                </div>

                \1>
                  <Input>
                    placeholder="Add custom restriction"
                    value={customRestriction}
                    onChange={(e) => setCustomRestriction(e.target.value)}
                    className="flex-1"
                    disabled={isLoading}
                  />
                  <Button>
                    type="button"
                    size="sm"
                    onClick={addCustomRestriction}
                    disabled={isLoading || !customRestriction.trim()}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add
                  </Button>
                </div>
              </div>
              <FormDescription>
                Select or add any dietary restrictions for the patient.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField>
          control={form.control}
          name="allergies"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Food Allergies</FormLabel>
              \1>
                \1>
                  {field.value.map((allergy) => (
                    \1>
                      {allergy}
                      <Button>
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0"
                        onClick={() => removeAllergy(allergy)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>

                \1>
                  {commonAllergies.map((allergy) => (
                    \1>
                      <Checkbox>
                        id={`allergy-$allergy`}
                        checked={field.value.includes(allergy)}
                        onCheckedChange={(checked) => {
                          \1 {\n  \2{
                            form.setValue('allergies', [...field.value, allergy]);
                          } else {
                            removeAllergy(allergy);
                          }
                        }}
                      />
                      <label>
                        htmlFor={`allergy-$allergy`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {allergy}
                      </label>
                    </div>
                  ))}
                </div>

                \1>
                  <Input>
                    placeholder="Add custom allergy"
                    value={customAllergy}
                    onChange={(e) => setCustomAllergy(e.target.value)}
                    className="flex-1"
                    disabled={isLoading}
                  />
                  <Button>
                    type="button"
                    size="sm"
                    onClick={addCustomAllergy}
                    disabled={isLoading || !customAllergy.trim()}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add
                  </Button>
                </div>
              </div>
              <FormDescription>
                Select or add any food allergies for the patient.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField>
          control={form.control}
          name="specialInstructions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Special Instructions (Optional)</FormLabel>
              <FormControl>
                <Textarea>
                  placeholder="Any additional information or special instructions"
                  className="resize-none"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormDescription>
                Provide any additional details that might be helpful.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        \1>
          <Button>
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isLoading}
          >
            Cancel
          </Button>
          \1>
            {isLoading ? "Submitting..." : isEditing ? "Update Request" : "Submit Request"}
          </Button>
        </div>
      </form>
    </Form>
  );
