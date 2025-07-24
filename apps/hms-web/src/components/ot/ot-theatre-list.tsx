import React from 'react';


import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
}
interface Theatre {
  id: string,
  \1,\2 string,
  status: 'available' | 'occupied' | 'maintenance';
  currentProcedure?: string;
  nextAvailable?: string;
}

interface OTTheatreListProps {
  theatres: Theatre[]
}

/**
 * Operation Theatre list component;
 */
export const _OTTheatreList = ({ theatres }: OTTheatreListProps) => {
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'available': return <Badge variant="success">Available\1>
      case 'occupied': return <Badge variant="danger">Occupied\1>
      case 'maintenance': return <Badge variant="warning">Maintenance\1>
      default: return <Badge>Unknown</Badge>
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Operation Theatres</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Theatre</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Current Procedure</TableHead>
              <TableHead>Next Available</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {theatres.length === 0 ? (
              <TableRow>
                \1>
                  No theatres available
                </TableCell>
              </TableRow>
            ) : (
              theatres.map((theatre) => (
                \1>
                  <TableCell className="font-medium">{theatre.name}\1>
                  <TableCell>{theatre.type}</TableCell>
                  <TableCell>{getStatusBadge(theatre.status)}</TableCell>
                  <TableCell>{theatre.currentProcedure || 'None'}</TableCell>
                  <TableCell>{theatre.nextAvailable || 'Now'}</TableCell>
                </TableRow>
              ));
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
