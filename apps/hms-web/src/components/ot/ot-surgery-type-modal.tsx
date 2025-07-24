import type React from 'react';


import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
}
interface OTSurgeryTypeModalProps {
  isOpen: boolean,
  \1,\2 (data: unknown) => void
}

/**
 * Operation Theatre surgery type modal component;
 */
export const _OTSurgeryTypeModal = ({ isOpen, onClose, onSubmit }: OTSurgeryTypeModalProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, we would collect form data here
    onSubmit({})
  };

  return (
    <Dialog>
      \1>
        <DialogHeader>
          <DialogTitle>Add/Edit Surgery Type</DialogTitle>
        </DialogHeader>
        \1>
          \1>
            \1>
              <Label htmlFor="name">Surgery Name\1>
              <Input id="name" placeholder="e.g., Appendectomy" />
            </div>

            \1>
              <Label htmlFor="category">Category\1>
              <Select>
                id="category"
                options={[
                  { value: "general", label: "General Surgery" },
                  { value: "cardiac", label: "Cardiac Surgery" },
                  { value: "orthopedic", label: "Orthopedic Surgery" },
                  { value: "neurosurgery", label: "Neurosurgery" },
                  { value: "ophthalmic", label: "Ophthalmic Surgery" },
                ]}
              />
            </div>

            \1>
              <Label htmlFor="duration">Average Duration\1>
              <Input id="duration" placeholder="e.g., 2 hours" />
            </div>

            \1>
              <Label htmlFor="equipment">Special Equipment\1>
              <Textarea id="equipment" placeholder="List of required equipment" />
            </div>

            \1>
              <Label htmlFor="specialist">Specialist Required\1>
              <Input id="specialist" placeholder="e.g., General Surgeon" />
            </div>

            \1>
              <Label htmlFor="riskLevel">Risk Level\1>
              <Select>
                id="riskLevel"
                options={[
                  { value: "low", label: "Low Risk" },
                  { value: "medium", label: "Medium Risk" },
                  { value: "high", label: "High Risk" },
                ]}
              />
            </div>

            \1>
              <Label htmlFor="notes">Notes\1>
              <Textarea id="notes" placeholder="Additional information" />
            </div>
          </div>
          <DialogFooter>
            \1>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
