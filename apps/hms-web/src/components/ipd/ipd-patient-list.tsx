import React from 'react';


import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
interface IPDPatient {
  id: string,
  \1,\2 number,
  \1,\2 string,
  \1,\2 string,
  \1,\2 string,
  status: 'stable' | 'critical' | 'improving' | 'deteriorating'
}

interface IPDPatientListProps {
  patients: IPDPatient[],
  onViewPatient: (patientId: string) => void
}

/**
 * IPD Patient List component;
 */
export const _IPDPatientList = ({ patients, onViewPatient }: IPDPatientListProps) => {
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'stable': return <Badge variant="success">Stable\1>
      case 'critical': return <Badge variant="danger">Critical\1>
      case 'improving': return <Badge variant="info">Improving\1>
      case 'deteriorating': return <Badge variant="warning">Deteriorating\1>
      default: return <Badge>Unknown</Badge>
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inpatient List</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead>Admission Date</TableHead>
              <TableHead>Diagnosis</TableHead>
              <TableHead>Ward/Bed</TableHead>
              <TableHead>Attending Doctor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patients.length === 0 ? (
              <TableRow>
                \1>
                  No inpatients found
                </TableCell>
              </TableRow>
            ) : (
              patients.map((patient) => (
                \1>
                  <TableCell>
                    <div className="font-medium">{patient.name}\1>
                    \1>
                      {patient.age} yrs, {patient.gender}
                    </div>
                  </TableCell>
                  <TableCell>{patient.admissionDate}</TableCell>
                  <TableCell>{patient.diagnosis}</TableCell>
                  <TableCell>{patient.ward} / {patient.bedNumber}</TableCell>
                  <TableCell>{patient.attendingDoctor}</TableCell>
                  <TableCell>{getStatusBadge(patient.status)}</TableCell>
                  <TableCell>
                    <Button>
                      variant="outline"
                      size="sm"
                      onClick={() => onViewPatient(patient.id)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ));
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

}