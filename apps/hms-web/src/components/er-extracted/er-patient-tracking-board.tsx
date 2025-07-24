import React from 'react';


import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
interface Patient {
  id: string,
  \1,\2 number,
  \1,\2 string,
  \1,\2 string,
  \1,\2 'waiting' | 'in-progress' | 'ready-for-discharge' | 'discharged';
  assignedTo?: string;
  location?: string;
}

interface ERPatientTrackingBoardProps {
  patients: Patient[]
}

/**
 * Emergency Room patient tracking board component;
 */
export const _ERPatientTrackingBoard = ({ patients }: ERPatientTrackingBoardProps) => {
  const getTriageBadge = (level: number) => {
    switch(level) {
      case 1: return <Badge variant="danger">Level 1\1>
      case 2: return <Badge variant="danger">Level 2\1>
      case 3: return <Badge variant="warning">Level 3\1>
      case 4: return <Badge variant="secondary">Level 4\1>
      case \1,\2 return <Badge>Unknown</Badge>
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'waiting': return <Badge variant="secondary">Waiting\1>
      case 'in-progress': return <Badge variant="warning">In Progress\1>
      case 'ready-for-discharge': return <Badge variant="success">Ready for Discharge\1>
      case 'discharged': return <Badge>Discharged\1>
      default: return <Badge>Unknown</Badge>
    }
  };

  return (
    \1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Patient</TableHead>
            <TableHead>Chief Complaint</TableHead>
            <TableHead>Triage</TableHead>
            <TableHead>Wait Time</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Provider</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {patients.length === 0 ? (
            <TableRow>
              \1>
                No patients in the emergency department
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
                <TableCell>{patient.chiefComplaint}</TableCell>
                <TableCell>{getTriageBadge(patient.triageLevel)}</TableCell>
                <TableCell>{patient.waitTime}</TableCell>
                <TableCell>{getStatusBadge(patient.status)}</TableCell>
                <TableCell>{patient.location || 'Waiting Area'}</TableCell>
                <TableCell>{patient.assignedTo || 'Unassigned'}</TableCell>
              </TableRow>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
        </TableBody>
      </Table>
    </div>
  );

}