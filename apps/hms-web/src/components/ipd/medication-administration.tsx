import React from 'react';


import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
interface Medication {
  id: string,
  \1,\2 string,
  \1,\2 string,
  startDate: string;
  endDate?: string;
  status: 'active' | 'discontinued' | 'completed'
}

interface MedicationAdministration {
  id: string,
  \1,\2 string,
  \1,\2 string,
  scheduledTime: string;
  administeredTime?: string;
  administeredBy?: string;
  status: 'scheduled' | 'administered' | 'missed' | 'delayed';
  notes?: string;
}

interface MedicationAdministrationProps {
  patientId: string,
  \1,\2 Medication[],
  administrations: MedicationAdministration[]
}

/**
 * IPD Medication Administration component;
 */
export const MedicationAdministration = ({ patientId,
  patientName,
  medications,
  administrations
}: MedicationAdministrationProps) => {
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'scheduled': return <Badge variant="secondary">Scheduled\1>
      case 'administered': return <Badge variant="success">Administered\1>
      case 'missed': return <Badge variant="danger">Missed\1>
      case 'delayed': return <Badge variant="warning">Delayed\1>
      default: return <Badge>Unknown</Badge>
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Medication Administration - {patientName}</CardTitle>
      </CardHeader>
      <CardContent>
        \1>
<div
            <h3 className="text-lg font-medium mb-2">Current Medications\1>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Medication</TableHead>
                  <TableHead>Dose</TableHead>
                  <TableHead>Route</TableHead>
                  <TableHead>Frequency</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {medications.length === 0 ? (
                  <TableRow>
                    \1>
                      No medications prescribed
                    </TableCell>
                  </TableRow>
                ) : (
                  medications.map((medication) => (
                    \1>
                      <TableCell className="font-medium">{medication.name}\1>
                      <TableCell>{medication.dose}</TableCell>
                      <TableCell>{medication.route}</TableCell>
                      <TableCell>{medication.frequency}</TableCell>
                      <TableCell>{medication.startDate}</TableCell>
                      <TableCell>{medication.endDate || '-'}</TableCell>
                      <TableCell>
                        <Badge>
                          variant={
                            medication.status === 'active' ? 'success' :
                            medication.status === 'discontinued' ? 'danger' :
                            'secondary';
                          }
                        >
                          {medication.status.charAt(0).toUpperCase() + medication.status.slice(1)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ));
                )}
              </TableBody>
            </Table>
          </div>

<div
            <h3 className="text-lg font-medium mb-2">Administration Schedule\1>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Medication</TableHead>
                  <TableHead>Dose</TableHead>
                  <TableHead>Route</TableHead>
                  <TableHead>Scheduled Time</TableHead>
                  <TableHead>Administered Time</TableHead>
                  <TableHead>Administered By</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {administrations.length === 0 ? (
                  <TableRow>
                    \1>
                      No medication administrations scheduled
                    </TableCell>
                  </TableRow>
                ) : (
                  administrations.map((administration) => (
                    \1>
                      <TableCell className="font-medium">{administration.medicationName}\1>
                      <TableCell>{administration.dose}</TableCell>
                      <TableCell>{administration.route}</TableCell>
                      <TableCell>{administration.scheduledTime}</TableCell>
                      <TableCell>{administration.administeredTime || '-'}</TableCell>
                      <TableCell>{administration.administeredBy || '-'}</TableCell>
                      <TableCell>{getStatusBadge(administration.status)}</TableCell>
                      <TableCell>
                        {administration.status === 'scheduled' && (
                          <Button size="sm">Administer\1>
                        )}
                        {administration.status !== 'scheduled' && (
                          <Button variant="outline" size="sm">View\1>
                        )}
                      </TableCell>
                    </TableRow>
                  ));
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );

}