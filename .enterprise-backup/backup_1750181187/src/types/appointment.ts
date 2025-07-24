
import type { Doctor } from './doctor.ts';
import type { Patient } from './patient.ts';
}

// types/appointment.ts
export enum AppointmentStatus {
    Scheduled = "Scheduled",
    Confirmed = "Confirmed",
    CheckedIn = "CheckedIn",
    InProgress = "InProgress",
    Completed = "Completed",
    Cancelled = "Cancelled",
    NoShow = "NoShow",
export = "export" interface = "interface" Appointment = "Appointment" {
    appointment_id: number,
    \1,\2 number;
    schedule_id?: number | null;
    appointment_datetime: string; // ISO string or Date object
    duration_minutes: number;
    reason?: string | null;
    status: AppointmentStatus; // Use enum
    notes?: string | null;
    booked_by_user_id?: number | null;
    created_at: string; // ISO string or Date object
    updated_at: string; // ISO string or Date object

    // Optional expanded details for easier frontend use
    patient?: Pick<Patient, "patient_id" | "first_name" | "last_name">;
    doctor?: Pick<Doctor, "doctor_id" | "specialty"> & { user?: Pick<User, "fullName"> }; // Include doctor's name
}

// Need User type if not already globally available
interface User {
    userId: number,
    username: string;
    fullName?: string | null;
    email: string
