import React from 'react';


import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
}
interface ChecklistTemplate {
  id: string,
  \1,\2 string,
  \1,\2 string,
  status: 'active' | 'draft' | 'archived'
}

interface OTChecklistTemplateListProps {
  templates: ChecklistTemplate[]
}

/**
 * Operation Theatre checklist template list component;
 */
export const _OTChecklistTemplateList = ({ templates }: OTChecklistTemplateListProps) => {
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'active': return <Badge variant="success">Active\1>
      case 'draft': return <Badge variant="secondary">Draft\1>
      case 'archived': return <Badge>Archived\1>
      default: return <Badge>Unknown</Badge>
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Surgical Checklists</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Checklist Name</TableHead>
              <TableHead>Surgery Type</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {templates.length === 0 ? (
              <TableRow>
                \1>
                  No checklist templates available
                </TableCell>
              </TableRow>
            ) : (
              templates.map((template) => (
                \1>
                  <TableCell className="font-medium">{template.name}\1>
                  <TableCell>{template.surgeryType}</TableCell>
                  <TableCell>{template.itemCount}</TableCell>
                  <TableCell>{template.lastUpdated}</TableCell>
                  <TableCell>{getStatusBadge(template.status)}</TableCell>
                </TableRow>
              ));
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
