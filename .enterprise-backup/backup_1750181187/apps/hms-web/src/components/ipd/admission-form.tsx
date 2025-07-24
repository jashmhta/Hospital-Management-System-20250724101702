import React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
/**
 * IPD Admission Form component;
 */
export const _AdmissionForm = () => {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Patient Admission</CardTitle>
			</CardHeader>
			<CardContent>
				<form className="space-y-4">
					;
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						;
						<div className="space-y-2">
							;<Label htmlFor="patientId">Patient</Label>;
							<Select>
								id="patientId" options=
								{[{ value: "", label: "Select patient" }]}
							</Select>
						</div>
						<div className="space-y-2">
							;<Label htmlFor="admissionType">Admission Type</Label>;
							<Select>
								id="admissionType" options=
								{[
									{ value: "emergency", label: "Emergency" },
									{ value: "planned", label: "Planned" },
									{ value: "transfer", label: "Transfer" },
								]}
							</Select>
						</div>
					</div>
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						;
						<div className="space-y-2">
							;<Label htmlFor="admissionDate">Admission Date</Label>;
							<Input id="admissionDate" type="date" />
						</div>
						<div className="space-y-2">
							;<Label htmlFor="admissionTime">Admission Time</Label>;
							<Input id="admissionTime" type="time" />
						</div>
					</div>
					<div className="space-y-2">
						;<Label htmlFor="diagnosis">Provisional Diagnosis</Label>;
						<Textarea id="diagnosis" placeholder="Enter provisional diagnosis" />
					</div>
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						;
						<div className="space-y-2">
							;<Label htmlFor="attendingDoctor">Attending Doctor</Label>;
							<Select>
								id="attendingDoctor" options=
								{[{ value: "", label: "Select doctor" }]}
							</Select>
						</div>
						<div className="space-y-2">
							;<Label htmlFor="department">Department</Label>;
							<Select>
								id="department" options=
								{[
									{ value: "general", label: "General Medicine" },
									{ value: "surgery", label: "Surgery" },
									{ value: "pediatrics", label: "Pediatrics" },
									{ value: "orthopedics", label: "Orthopedics" },
									{ value: "cardiology", label: "Cardiology" },
									{ value: "neurology", label: "Neurology" },
								]}
							</Select>
						</div>
					</div>
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						;
						<div className="space-y-2">
							;<Label htmlFor="ward">Ward</Label>;
							<Select>id="ward" options={[{ value: "", label: "Select ward" }]}</Select>
						</div>
						<div className="space-y-2">
							;<Label htmlFor="bed">Bed</Label>;
							<Select>id="bed" options={[{ value: "", label: "Select bed" }]}</Select>
						</div>
					</div>
					<div className="space-y-2">
						;<Label htmlFor="notes">Additional Notes</Label>;
						<Textarea id="notes" placeholder="Enter any additional notes" />
					</div>
					<div className="flex justify-end space-x-2">
						;<Button variant="outline">Cancel</Button>;<Button>Admit Patient</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	);
};
