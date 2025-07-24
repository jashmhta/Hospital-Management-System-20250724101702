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
				\1>
					\1>
						\1><Label htmlFor="patientId">Patient\1>
							<Select>
								id="patientId" options=
								{[{ value: "", label: "Select patient" }]}
							</Select>
						</div>
						\1><Label htmlFor="admissionType">Admission Type\1>
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
					\1>
						\1><Label htmlFor="admissionDate">Admission Date\1>
							<Input id="admissionDate" type="date" />
						</div>
						\1><Label htmlFor="admissionTime">Admission Time\1>
							<Input id="admissionTime" type="time" />
						</div>
					</div>
					\1><Label htmlFor="diagnosis">Provisional Diagnosis\1>
						<Textarea id="diagnosis" placeholder="Enter provisional diagnosis" />
					</div>
					\1>
						\1><Label htmlFor="attendingDoctor">Attending Doctor\1>
							<Select>
								id="attendingDoctor" options=
								{[{ value: "", label: "Select doctor" }]}
							</Select>
						</div>
						\1><Label htmlFor="department">Department\1>
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
					\1>
						\1><Label htmlFor="ward">Ward\1>
							<Select>id="ward" options={[{ value: "", label: "Select ward" }]}</Select>
						</div>
						\1><Label htmlFor="bed">Bed\1>
							<Select>id="bed" options={[{ value: "", label: "Select bed" }]}</Select>
						</div>
					</div>
					\1><Label htmlFor="notes">Additional Notes\1>
						<Textarea id="notes" placeholder="Enter any additional notes" />
					</div>
					\1><Button variant="outline">Cancel\1><Button>Admit Patient</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	);
};
