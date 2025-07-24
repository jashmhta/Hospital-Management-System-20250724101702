import React from 'react';


import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
}
interface SurgeryType {
  id: string,
  \1,\2 string,
  \1,\2 string[],
  \1,\2 'low' | 'medium' | 'high'
}

interface OTSurgeryTypeListProps {
  surgeryTypes: SurgeryType[]
}

/**
 * Operation Theatre surgery type list component;
 */
export const _OTSurgeryTypeList = ({ surgeryTypes }: OTSurgeryTypeListProps) => {
  const getRiskBadge = (risk: string) => {
    switch(risk) {
      case 'low': return <Badge variant="secondary">Low Risk\1>
      case 'medium': return <Badge variant="warning">Medium Risk\1>
      case 'high': return <Badge variant="danger">High Risk\1>
      default: return <Badge>Unknown</Badge>
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Surgery Types</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Surgery</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Specialist</TableHead>
              <TableHead>Risk Level</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {surgeryTypes.length === 0 ? (
              <TableRow>
                \1>
                  No surgery types defined
                </TableCell>
              </TableRow>
            ) : (
              surgeryTypes.map((surgeryType) => (
                \1>
                  <TableCell className="font-medium">{surgeryType.name}\1>
                  <TableCell>{surgeryType.category}</TableCell>
                  <TableCell>{surgeryType.averageDuration}</TableCell>
                  <TableCell>{surgeryType.specialistRequired}</TableCell>
                  <TableCell>{getRiskBadge(surgeryType.riskLevel)}</TableCell>
                </TableRow>
              ));
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
