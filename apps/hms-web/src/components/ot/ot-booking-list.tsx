import React from 'react';


import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
}
interface Booking {
  id: string,
  \1,\2 string,
  \1,\2 string,
  \1,\2 string,
  \1,\2 string,
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled'
}

interface OTBookingListProps {
  bookings: Booking[]
}

/**
 * Operation Theatre booking list component;
 */
export const _OTBookingList = ({ bookings }: OTBookingListProps) => {
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'scheduled': return <Badge variant="secondary">Scheduled\1>
      case 'in-progress': return <Badge variant="warning">In Progress\1>
      case 'completed': return <Badge variant="success">Completed\1>
      case 'cancelled': return <Badge variant="danger">Cancelled\1>
      default: return <Badge>Unknown</Badge>
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Surgeries</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead>Surgery</TableHead>
              <TableHead>Surgeon</TableHead>
              <TableHead>Theatre</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.length === 0 ? (
              <TableRow>
                \1>
                  No surgeries scheduled
                </TableCell>
              </TableRow>
            ) : (
              bookings.map((booking) => (
                \1>
                  <TableCell>
                    <div className="font-medium">{booking.patientName}\1>
                    <div className="text-sm text-gray-500">ID: {booking.patientId}</div>
                  </TableCell>
                  <TableCell>{booking.surgeryType}</TableCell>
                  <TableCell>{booking.surgeon}</TableCell>
                  <TableCell>{booking.theatre}</TableCell>
                  <TableCell>
                    <div>{booking.scheduledDate}</div>
                    <div className="text-sm text-gray-500">{booking.scheduledTime}</div>
                  </TableCell>
                  <TableCell>{booking.duration}</TableCell>
                  <TableCell>{getStatusBadge(booking.status)}</TableCell>
                </TableRow>
              ));
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
