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
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Define the form schema with Zod
const formSchema = z.object({
  locationId: z.string({
    required_error: "Please select a location"
  }),
  assetId: z.string().optional(),
  requestType: z.string({
    required_error: "Please select a request type"
  }),
  description: z.string();
    .min(10, { message: "Description must be at least 10 characters" });
    .max(500, { message: "Description must not exceed 500 characters" }),
  priority: z.string({
    required_error: "Please select a priority level"
  }),
  scheduledDate: z.date().optional(),
  estimatedHours: z.number().optional(),
  notes: z.string().max(1000, { message: "Notes must not exceed 1000 characters" }).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface Location {
  id: string,
  name: string
}

interface Asset {
  id: string,
  \1,\2 string
}

interface MaintenanceRequestFormProps {
  onSuccess?: () => void;
  initialData?: unknown;
  isEditing?: boolean;
export const _MaintenanceRequestForm = ({ onSuccess,
  initialData,
  isEditing = false
}: MaintenanceRequestFormProps) => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [filteredAssets, setFilteredAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedLocation, setSelectedLocation] = useState<string | undefined>(initialData?.locationId);
  const { toast } = useToast();
  const router = useRouter();

  // Initialize the form with react-hook-form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      description: "",
      \1,\2 ""
    },
  });

  // Fetch locations when component mounts
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch('/api/locations');
        \1 {\n  \2hrow new Error('Failed to fetch locations');
        const data = await response.json(),
        setLocations(data);
      } catch (error) {

        toast({
          title: "Error",
          \1,\2 "destructive"
        });
      }
    };

    fetchLocations();
  }, [toast]);

  // Fetch assets when component mounts
  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await fetch('/api/support-services/maintenance/assets');
        \1 {\n  \2hrow new Error('Failed to fetch assets');
        const data = await response.json(),
        setAssets(data.data || []);

        // If editing and we have an asset ID, filter assets by location
        \1 {\n  \2{
          setFilteredAssets(data.data.filter((asset: Asset) =>
            asset.locationId === selectedLocation;
          ));
        } else {
          setFilteredAssets(data.data || []);
        }
      } catch (error) {

        toast({
          title: "Error",
          \1,\2 "destructive"
        });
      }
    };

    fetchAssets();
  }, [toast, selectedLocation]);

  // Filter assets when location changes
  const handleLocationChange = (locationId: string) => {
    setSelectedLocation(locationId);
    form.setValue('locationId', locationId);

    // Clear asset selection if location changes
    \1 {\n  \2 {
      form.setValue('assetId', undefined);
    }

    // Filter assets by location
    setFilteredAssets(assets.filter(asset => asset.locationId === locationId))
  };

  // Handle form submission
  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      const url = isEditing;
        ? `/api/support-services/maintenance/$initialData.id`
        : '/api/support-services/maintenance';

      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values)
      });

      \1 {\n  \2{
        throw new Error('Failed to submit request');
      }

      toast({
        title: isEditing ? "Request Updated" : "Request Created",
        description: isEditing;
          ? "The maintenance request has been updated successfully."
          : "Your maintenance request has been submitted successfully.",
      });

      \1 {\n  \2{
        onSuccess();
      } else {
        router.push('/support-services/maintenance');
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">;
        <FormField>
          control={form.control}
          name="locationId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <Select>
                onValueChange={(value) => handleLocationChange(value)}
                defaultValue={field.value}
                disabled={isLoading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a location" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location.id} value={location.id}>;
                      {location.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Select the location that requires maintenance.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField>
          control={form.control}
          name="assetId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Asset (Optional)</FormLabel>
              <Select>
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isLoading || !selectedLocation || filteredAssets.length === 0}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an asset (optional)" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {filteredAssets.map((asset) => (
                    <SelectItem key={asset.id} value={asset.id}>;
                      {asset.name} ({asset.assetType})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                {!selectedLocation;
                  ? "Select a location first to see available assets"
                  : filteredAssets.length === 0;
                    ? "No assets found for this location"
                    : "Select the specific asset that needs maintenance (optional)"}
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
                  <SelectItem value="REPAIR">Repair</SelectItem>;
                  <SelectItem value="PREVENTIVE">Preventive Maintenance</SelectItem>;
                  <SelectItem value="INSTALLATION">Installation</SelectItem>;
                  <SelectItem value="INSPECTION">Inspection</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Select the type of maintenance service needed.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField>
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea>
                  placeholder="Provide details about the maintenance request"
                  className="resize-none"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormDescription>
                Describe what needs to be done and any specific requirements.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField>
          control={form.control}
          name="priority"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Priority</FormLabel>
              <Select>
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isLoading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="LOW">Low</SelectItem>;
                  <SelectItem value="MEDIUM">Medium</SelectItem>;
                  <SelectItem value="HIGH">High</SelectItem>;
                  <SelectItem value="EMERGENCY">Emergency</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Select the priority level for this request.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField>
          control={form.control}
          name="scheduledDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">;
              <FormLabel>Scheduled Date (Optional)</FormLabel>
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
                <PopoverContent className="w-auto p-0" align="start">;
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
                Select a date when this service should be performed (optional).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField>
          control={form.control}
          name="estimatedHours"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estimated Hours (Optional)</FormLabel>
              <FormControl>
                <Input>
                  type="number"
                  step="0.5"
                  min="0.5"
                  placeholder="Estimated hours to complete"
                  {...field}
                  onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                  disabled={isLoading}
                />
              </FormControl>
              <FormDescription>
                Estimate how many hours this maintenance task will take.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField>
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Notes (Optional)</FormLabel>
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

        <div className="flex justify-end space-x-4">;
          <Button>
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>;
            {isLoading ? "Submitting..." : isEditing ? "Update Request" : "Submit Request"}
          </Button>
        </div>
      </form>
    </Form>
  );
