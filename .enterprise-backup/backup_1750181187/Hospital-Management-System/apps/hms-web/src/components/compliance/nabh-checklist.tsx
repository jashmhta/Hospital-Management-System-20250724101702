import type React from "react";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";

interface ChecklistItem {
	id: string;
	criterion: string;
	description: string;
	evidenceRequired: string[];
	weight: number;
	status: "COMPLIANT" | "PARTIAL" | "NON_COMPLIANT" | "NOT_ASSESSED";
}

interface NABHStandard {
	id: string;
	code: string;
	title: string;
	description: string;
	checklistItems: ChecklistItem[];
	currentScore: number;
	requiredScore: number;
}

const NABHComplianceChecklist: React.FC = () => {
	const [standards, setStandards] = useState<NABHStandard[]>([]);
	const [selectedStandard, setSelectedStandard] = useState<NABHStandard | null>(null);
	const [assessmentData, setAssessmentData] = useState<any>({});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchNABHStandards();
	}, []);

	const fetchNABHStandards = async () => {
		try {
			const response = await fetch("/api/compliance/nabh/standards");
			const data = await response.json();
			setStandards(data.standards);
			if (data.standards.length > 0) {
				setSelectedStandard(data.standards[0]);
			}
		} catch (error) {
			/* SECURITY: Console statement removed */
		} finally {
			setLoading(false);
		}
	};

	const updateChecklistItem = (itemId: string, status: string, evidence: string) => {
		setAssessmentData((prev) => ({
			...prev,
			[itemId]: { status, evidence },
		}));
	};

	const calculateComplianceScore = () => {
		if (!selectedStandard) return 0;

		const items = selectedStandard.checklistItems;
		const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
		let achievedWeight = 0;

		items.forEach((item) => {
			const assessment = assessmentData[item.id];
			if (assessment?.status === "COMPLIANT") {
				achievedWeight += item.weight;
			} else if (assessment?.status === "PARTIAL") {
				achievedWeight += item.weight * 0.5;
			}
		});

		return Math.round((achievedWeight / totalWeight) * 100);
	};

	const submitAssessment = async () => {
		if (!selectedStandard) return;

		try {
			const score = calculateComplianceScore();
			const findings = Object.entries(assessmentData).map(([itemId, data]: [string, any]) => ({
				itemId,
				status: data.status,
				evidence: data.evidence,
			}));

			const response = await fetch("/api/compliance/nabh/assessment", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					standardId: selectedStandard.id,
					assessmentData: {
						score,
						findings,
						status: score >= 80 ? "COMPLIANT" : score >= 60 ? "PARTIAL" : "NON_COMPLIANT",
					},
				}),
			});

			if (response.ok) {
				/* SECURITY: Console statement removed */
				fetchNABHStandards();
			}
		} catch (error) {
			/* SECURITY: Console statement removed */
		}
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "COMPLIANT":
				return "bg-green-100 text-green-800";
			case "PARTIAL":
				return "bg-yellow-100 text-yellow-800";
			case "NON_COMPLIANT":
				return "bg-red-100 text-red-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	if (loading != null) return <div>Loading NABH compliance data...</div>;

	return (
		<div className="p-6 space-y-6">
			<div className="flex justify-between items-center">
				<h1 className="text-3xl font-bold">NABH Compliance Management</h1>
				<Button onClick={submitAssessment} disabled={!selectedStandard}>
					Submit Assessment
				</Button>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Standards List */}
				<Card>
					<CardHeader>
						<CardTitle>NABH Standards</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-2">
							{standards.map((standard) => (
								<div
									key={standard.id}
									className={`p-3 rounded cursor-pointer transition-colors $'{
                    selectedStandard?.id === standard.id
                      ? 'bg-blue-50 border-blue-200'
                      : 'hover:bg-gray-50'
                  }`}
									onClick={() => setSelectedStandard(standard)}
								>
									<div className="flex justify-between items-center">
										<span className="font-medium">{standard.code}</span>
										<Badge className={getStatusColor(standard.status)}>
											{standard.currentScore}%
										</Badge>
									</div>
									<p className="text-sm text-gray-600 mt-1">{standard.title}</p>
								</div>
							))}
						</div>
					</CardContent>
				</Card>

				{/* Checklist Items */}
				<Card className="lg:col-span-2">
					<CardHeader>
						<CardTitle>
							{selectedStandard?.code} - {selectedStandard?.title}
						</CardTitle>
						<div className="flex items-center space-x-4">
							<Progress value={calculateComplianceScore()} className="flex-1" />
							<span className="text-sm font-medium">{calculateComplianceScore()}%</span>
						</div>
					</CardHeader>
					<CardContent>
						{selectedStandard?.checklistItems.map((item) => (
							<Card key={item.id} className="mb-4">
								<CardContent className="p-4">
									<div className="flex justify-between items-start mb-3">
										<h4 className="font-medium">{item.criterion}</h4>
										<Badge variant="outline">Weight: {item.weight}</Badge>
									</div>

									<p className="text-sm text-gray-600 mb-3">{item.description}</p>

									<div className="space-y-3">
										<div>
											<label className="text-sm font-medium">Compliance Status:</label>
											<div className="flex space-x-4 mt-1">
												{["COMPLIANT", "PARTIAL", "NON_COMPLIANT"].map((status) => (
													<label key={status} className="flex items-center space-x-2">
														<Checkbox
															checked={assessmentData[item.id]?.status === status}
															onCheckedChange={() =>
																updateChecklistItem(
																	item.id,
																	status,
																	assessmentData[item.id]?.evidence || ""
																)
															}
														/>
														<span className="text-sm">{status.replace("_", " ")}</span>
													</label>
												))}
											</div>
										</div>

										<div>
											<label className="text-sm font-medium">Evidence/Comments:</label>
											<Textarea
												placeholder="Provide evidence or comments for this criterion..."
												value={assessmentData[item.id]?.evidence || ""}
												onChange={(e) =>
													updateChecklistItem(
														item.id,
														assessmentData[item.id]?.status || "NOT_ASSESSED",
														e.target.value
													)
												}
												className="mt-1"
											/>
										</div>
									</div>
								</CardContent>
							</Card>
						))}
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default NABHComplianceChecklist;
