import React from 'react';


import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
interface ProgressNote {
  id: string,
  \1,\2 string,
  \1,\2 string
}

interface PatientProgressNotesProps {
  patientId: string,
  \1,\2 ProgressNote[]
}

/**
 * IPD Patient Progress Notes component;
 */
export const _PatientProgressNotes = ({ patientId, patientName, notes }: PatientProgressNotesProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Progress Notes - {patientName}</CardTitle>
      </CardHeader>
      <CardContent>
        \1>
          \1>
            <Button>Add Progress Note</Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead>Note</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notes.length === 0 ? (
                <TableRow>
                  \1>
                    No progress notes available
                  </TableCell>
                </TableRow>
              ) : (
                notes.map((note) => (
                  \1>
                    <TableCell>{note.date}</TableCell>
                    <TableCell>{note.time}</TableCell>
                    <TableCell>{note.doctor}</TableCell>
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