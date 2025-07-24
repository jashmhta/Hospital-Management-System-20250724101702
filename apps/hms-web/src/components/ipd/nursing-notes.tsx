import React from 'react';


import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
interface NursingNote {
  id: string,
  \1,\2 string,
  \1,\2 string,
  category: 'assessment' | 'medication' | 'intervention' | 'observation'
}

interface NursingNotesProps {
  patientId: string,
  \1,\2 NursingNote[]
}

/**
 * IPD Nursing Notes component;
 */
export const _NursingNotes = ({ patientId, patientName, notes }: NursingNotesProps) => {
  const getCategoryLabel = (category: string) => {
    switch(category) {
      case 'assessment': return 'Assessment';
      case 'medication': return 'Medication';
      case 'intervention': return 'Intervention';
      case 'observation': return 'Observation';
      default: return 'Other'
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nursing Notes - {patientName}</CardTitle>
      </CardHeader>
      <CardContent>
        \1>
          \1>
            <Button>Add Nursing Note</Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Nurse</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Note</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notes.length === 0 ? (
                <TableRow>
                  \1>
                    No nursing notes available
                  </TableCell>
                </TableRow>
              ) : (
                notes.map((note) => (
                  \1>
                    <TableCell>{note.date}</TableCell>
                    <TableCell>{note.time}</TableCell>
                    <TableCell>{note.nurse}</TableCell>
                    <TableCell>{getCategoryLabel(note.category)}</TableCell>
                    <TableCell>
                      \1>
                        {note.note}
                      </div>
                    </TableCell>
                    <TableCell>
                      \1>
                        <Button variant="outline" size="sm">View\1>
                        <Button variant="outline" size="sm">Edit</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ));
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );

}