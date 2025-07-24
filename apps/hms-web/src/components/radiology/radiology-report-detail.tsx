import React from 'react';


import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
}
interface RadiologyReport {
  id: string,
  \1,\2 string,
  \1,\2 string,
  \1,\2 'draft' | 'preliminary' | 'final' | 'amended',
  \1,\2 string,
  \1,\2 string
}

interface RadiologyReportDetailProps {
  report: RadiologyReport
}

/**
 * Radiology report detail component;
 */
export const _RadiologyReportDetail = ({ report }: RadiologyReportDetailProps) => {
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
        <CardTitle>Radiology Report</CardTitle>
      </CardHeader>
      <CardContent>
        \1>
          \1>
<div
              <h3 className="text-sm font-medium text-gray-500">Patient Information\1>
              \1>
                <p className="text-base font-medium">{report.patientName}\1>
                <p className="text-sm text-gray-500">ID: {report.patientId}</p>
              </div>
            </div>

<div
              <h3 className="text-sm font-medium text-gray-500">Report Information\1>
              \1>
                <p className="text-base font-medium">Report #{report.id}\1>
                <p className="text-sm text-gray-500">Date: {report.reportDate}</p>
              </div>
            </div>
          </div>

          \1>
<div
              <h3 className="text-sm font-medium text-gray-500">Study Type\1>
              <p className="mt-2 text-base">{report.studyType}</p>
            </div>

<div
              <h3 className="text-sm font-medium text-gray-500">Modality\1>
              <p className="mt-2 text-base">{report.modality}</p>
            </div>

<div
              <h3 className="text-sm font-medium text-gray-500">Status\1>
              <div className="mt-2">{getStatusBadge(report.status)}</div>
            </div>
          </div>

<div
            <h3 className="text-sm font-medium text-gray-500">Radiologist\1>
            <p className="mt-2 text-base">{report.radiologist}</p>
          </div>

<div
            <h3 className="text-sm font-medium text-gray-500">Findings\1>
            <p className="mt-2 text-base whitespace-pre-line">{report.findings}</p>
          </div>

<div
            <h3 className="text-sm font-medium text-gray-500">Impression\1>
            <p className="mt-2 text-base whitespace-pre-line">{report.impression}</p>
          </div>

<div
            <h3 className="text-sm font-medium text-gray-500">Recommendations\1>
            <p className="mt-2 text-base whitespace-pre-line">{report.recommendations}</p>
          </div>

          \1>
            <Button variant="outline">Print Report\1>report.status !== 'final' && (
              <Button>Finalize Report</Button>
            )report.status === 'final' && (
              <Button>Amend Report</Button>
            )
          </div>
        </div>
      </CardContent>
    </Card>
  );
