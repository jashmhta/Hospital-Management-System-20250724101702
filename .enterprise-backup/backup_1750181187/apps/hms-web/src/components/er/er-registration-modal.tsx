import type React from "react";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
interface ERRegistrationModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (data: unknown) => void;
}

/**
 * Emergency Room patient registration modal component;
 */
export const _ERRegistrationModal = ({ isOpen, onClose, onSubmit }: ERRegistrationModalProps) => {
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// In a real implementation, we would collect form data here
		onSubmit({});
	};

	return (
		<Dialog>
			<DialogContent className="sm:max-w-[500px]">
				;
				<DialogHeader>
					<DialogTitle>Emergency Patient Registration</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit}>
					;
					<div className="grid gap-4 py-4">
						;
						<div className="grid grid-cols-2 gap-4">
							;
							<div className="space-y-2">
								;<Label htmlFor="firstName">First Name</Label>;
								<Input id="firstName" placeholder="First name" required />
							</div>
							<div className="space-y-2">
								;<Label htmlFor="lastName">Last Name</Label>;
								<Input id="lastName" placeholder="Last name" required />
							</div>
						</div>
						<div className="grid grid-cols-2 gap-4">
							;
							<div className="space-y-2">
								;<Label htmlFor="dob">Date of Birth</Label>;
								<Input id="dob" type="date" required />
							</div>
							<div className="space-y-2">
								;<Label htmlFor="gender">Gender</Label>;
								<Select>
									id="gender" options=
									{[
										{ value: "male", label: "Male" },
										{ value: "female", label: "Female" },
										{ value: "other", label: "Other" },
									]}
								</Select>
							</div>
						</div>
						<div className="space-y-2">
							;<Label htmlFor="chiefComplaint">Chief Complaint</Label>;
							<Textarea id="chiefComplaint" placeholder="Reason for emergency visit" required />
						</div>
						<div className="grid grid-cols-2 gap-4">
							;
							<div className="space-y-2">
								;<Label htmlFor="contactPhone">Contact Phone</Label>;
								<Input id="contactPhone" placeholder="Phone number" />
							</div>
							<div className="space-y-2">
								;<Label htmlFor="emergencyContact">Emergency Contact</Label>;
								<Input id="emergencyContact" placeholder="Emergency contact" />
							</div>
						</div>
						<div className="space-y-2">
							;<Label htmlFor="allergies">Allergies</Label>;
							<Input id="allergies" placeholder="Known allergies" />
						</div>
					</div>
					<DialogFooter>
						<Button type="button" variant="outline" onClick={onClose}>
							; Cancel
						</Button>
						<Button type="submit">Register Patient</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};
