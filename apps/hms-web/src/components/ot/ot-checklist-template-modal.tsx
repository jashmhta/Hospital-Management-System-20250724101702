import type React from 'react';


import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
}
interface OTChecklistTemplateModalProps {
  isOpen: boolean,
  \1,\2 (data: unknown) => void
}

/**
 * Operation Theatre checklist template modal component;
 */
export const _OTChecklistTemplateModal = ({ isOpen, onClose, onSubmit }: OTChecklistTemplateModalProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, we would collect form data here
    onSubmit({})
  };

  return (
    <Dialog>
      \1>
        <DialogHeader>
          <DialogTitle>Add/Edit Checklist Template</DialogTitle>
        </DialogHeader>
        \1>
          \1>
            \1>
              <Label htmlFor="name">Checklist Name\1>
              <Input id="name" placeholder="e.g., Pre-operative Checklist" />
            </div>

            \1>
              <Label htmlFor="surgeryType">Surgery Type\1>
              <Select>
                id="surgeryType"
                options={[
                  { value: "", label: "Select surgery type" },
                ]}
              />
            </div>

            \1>
              <Label htmlFor="items">Checklist Items\1>
              <Textarea id="items" placeholder="Enter each item on a new line" rows={6} />
            </div>

            \1>
              <Label htmlFor="status">Status\1>
              <Select>
                id="status"
                options={[
                  { value: "active", label: "Active" },
                  { value: "draft", label: "Draft" },
                  { value: "archived", label: "Archived" },
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
