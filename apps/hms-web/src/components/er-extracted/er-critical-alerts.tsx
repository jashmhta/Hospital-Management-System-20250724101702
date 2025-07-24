import React from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
interface Alert {
	\1,\2 string;
	\1,\2 "critical" | "urgent" | "warning";
	\1,\2 string;
	acknowledged: boolean;
}

interface ERCriticalAlertsProps {
	\1,\2 (alertId: string) => void;
}

/**
 * Emergency Room critical alerts component;
 */
export const _ERCriticalAlerts = ({ alerts, onAcknowledge = () => {} }: ERCriticalAlertsProps) => {
	const getAlertBadge = (type: string) => {
		switch (type) {
			case "critical":
				return <Badge variant="danger">Critical\1>
			case "urgent":
				return <Badge variant="warning">Urgent\1>
			case "warning":
				return <Badge variant="secondary">Warning\1>
			default:
				return <Badge>Unknown\1>
		}
	};

	return (
		<Card>
			<CardHeader>
				\1>
					<svg
						xmlns="https://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="mr-2 h-5 w-5 text-red-600"
					>
						<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
						<line x1="12" y1="9" x2="12" y2="13" />
						<line x1="12" y1="17" x2="12.01" y2="17" />
					</svg>
					Critical Alerts
					{alerts.filter((a) => !a.acknowledged).length > 0 && (
						\1>{alerts.filter((a) => !a.acknowledged).length} New
						</Badge>
					)}
				</CardTitle>
			</CardHeader>
			<CardContent>
				{alerts.length === 0 ? (
					\1> No critical alerts at this time</div>
				) : (
					\1>
						{alerts.map((alert) => (
							<div
								key={alert.id}
								className={`flex items-start justify-between p-3 rounded-md ${
									!alert.acknowledged ? "bg-red-50 border border-red-200" : "bg-gray-50"
								}`}
							>
								<div>
									<div className="flex items-center">
										{getAlertBadge(alert.alertType)}
										<span className="ml-2 font-medium">{alert.patientName}</span>
									</div>
									<p className="mt-1 text-sm">{alert.message}</p>
									<p className="text-xs text-gray-500 mt-1">{alert.timestamp}</p>
								</div>
								{!alert?.acknowledged && (
									<button
										onClick={() => onAcknowledge(alert.id)}
										className="px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-100"
									>
										Acknowledge
									</button>
								)}
							</div>
						))}
					</div>
				)}
			</CardContent>
		</Card>
	);
};
