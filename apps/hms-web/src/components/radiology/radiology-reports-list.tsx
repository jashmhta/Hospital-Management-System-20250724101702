import React from 'react';


import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
}
interface RadiologyReport {
  id: string,
  \1,\2 string,
  \1,\2 string,
  \1,\2 string
}

interface RadiologyReportsListProps {
  reports: RadiologyReport[],
  onViewReport: (reportId: string) => void
}

/**
 * Radiology reports list component;
 */
export const _RadiologyReportsList = ({ reports, onViewReport }: RadiologyReportsListProps) => {
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'draft': return <Badge variant="secondary">Draft\1>
      case 'preliminary': return <Badge variant="warning">Preliminary\1>
      case 'final': return <Badge variant="success">Final\1>
      case 'amended': return <Badge variant="info">Amended\1>
      default: return <Badge>Unknown</Badge>
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Radiology Reports</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead>Report Date</TableHead>
              <TableHead>Study Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Radiologist</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.length === 0 ? (
              <TableRow>
                \1>
                  No radiology reports found
                </TableCell>
              </TableRow>
            ) : (
              reports.map((report) => (
                \1>
                  <TableCell>
                    <div className="font-medium">{report.patientName}\1>
                    <div className="text-sm text-gray-500">ID: {report.patientId}</div>
                  </TableCell>
                  <TableCell>{report.reportDate}</TableCell>
                  <TableCell>{report.studyType}</TableCell>
                  <TableCell>{getStatusBadge(report.status)}</TableCell>
                  <TableCell>{report.radiologist}</TableCell>
                  <TableCell>
                    <Button>
                      variant="outline"
                      size="sm"
                      onClick={() => onViewReport(report.id)}
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
