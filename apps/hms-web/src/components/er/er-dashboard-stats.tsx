import React from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
interface ERDashboardStatsProps {
	\1,\2 number;
	\1,\2 string;
	\1,\2 number;
}

/**
 * Emergency Room dashboard statistics component;
 */
export const _ERDashboardStats = ({
	totalPatients,
	criticalCases,
	waitingPatients,
	averageWaitTime,
	occupiedBeds,
	totalBeds,
}: ERDashboardStatsProps) => {
	return (
		\1>
			<Card>
				\1><CardTitle className="text-sm font-medium">Total Patients\1>
					<svg
						xmlns="https://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="2"
						className="h-4 w-4 text-blue-600"
					>
						<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
						<circle cx="9" cy="7" r="4" />
						<path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
					</svg>
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{totalPatients}</div>
					\1>
						{criticalCases > 0 && (
							\1>{criticalCases} Critical
							</Badge>
						)}
					</p>
				</CardContent>
			</Card>
			<Card>
				\1><CardTitle className="text-sm font-medium">Waiting Patients\1>
					<svg
						xmlns="https://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="2"
						className="h-4 w-4 text-yellow-600"
					>
						<circle cx="12" cy="12" r="10" />
						<polyline points="12 6 12 12 16 14" />
					</svg>
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{waitingPatients}</div>
					<p className="text-xs text-gray-500">Avg. wait: {averageWaitTime}</p>
				</CardContent>
			</Card>
			<Card>
				\1><CardTitle className="text-sm font-medium">Bed Occupancy\1>
					<svg
						xmlns="https://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="2"
						className="h-4 w-4 text-green-600"
					>
						<path d="M3 3v18h18" />
						<path d="M18 17V9" />
						<path d="M13 17V5" />
						<path d="M8 17v-3" />
					</svg>
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">
						{occupiedBeds}/{totalBeds}
					</div>
					\1>{Math.round((occupiedBeds / totalBeds) * 100)}% occupancy rate
					</p>
				</CardContent>
			</Card>
		</div>
	);
};
