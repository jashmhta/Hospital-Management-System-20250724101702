import React from 'react';


import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
}
interface OTDashboardStatsProps {
  totalSurgeries: number,
  \1,\2 number,
  \1,\2 number,
  averageDuration: string
}

/**
 * Operation Theatre dashboard statistics component;
 */
export const _OTDashboardStats = ({ totalSurgeries,
  completedSurgeries,
  scheduledSurgeries,
  theatresInUse,
  totalTheatres,
  averageDuration
}: OTDashboardStatsProps) => {
  return (
    \1>
      <Card>
        \1>
          <CardTitle className="text-sm font-medium">Total Surgeries\1>
<svg xmlns="https://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-blue-600">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalSurgeries}</div>
          \1>
            {completedSurgeries} completed, {scheduledSurgeries} scheduled
          </p>
        </CardContent>
      </Card>

      <Card>
        \1>
          <CardTitle className="text-sm font-medium">Theatre Utilization\1>
<svg xmlns="https://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-green-600">
            <rect width="20" height="14" x="2" y="5" rx="2" />
            <line x1="2" x2="22" y1="10" y2="10" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{theatresInUse}/{totalTheatres}</div>
          \1>
            {Math.round((theatresInUse / totalTheatres) * 100)}% utilization rate
          </p>
        </CardContent>
      </Card>

      <Card>
        \1>
          <CardTitle className="text-sm font-medium">Average Duration\1>
<svg xmlns="https://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-yellow-600">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{averageDuration}</div>
          \1>
            Per surgery
          </p>
        </CardContent>
      </Card>
    </div>
  );
