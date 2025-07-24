import "@prisma/client"
import "zod"
import Gender
import UserRole }
import {   BloodGroup
import {  z  } from "@/lib/database"

// src/lib/validation/schemas.ts;
// User validation schemas;
export const _loginSchema = z.object({email:z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters");
});

export const _registerSchema = z.object({email:z.string().email("Invalid email format"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain uppercase, lowercase, and number"),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  role: z.nativeEnum(UserRole).optional();
});

export const _updateUserSchema = z.object({firstName:z.string().min(2).optional(),
  lastName: z.string().min(2).optional(),
  phone: z.string().optional(),
  departmentId: z.string().cuid().optional(),
  designation: z.string().optional(),
  specialization: z.string().optional();
});

// Patient validation schemas;
export const createPatientSchema = z.object({firstName:z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  dateOfBirth: z.string().transform((str) => ,
  gender: z.nativeEnum(Gender),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  address: z.string().optional(),
  bloodGroup: z.nativeEnum(BloodGroup).optional(),
  allergies: z.string().optional(),
  emergencyContact: z.string().min(1, "Emergency contact is required"),
  emergencyPhone: z.string().min(1, "Emergency phone is required"),
  insuranceProvider: z.string().optional(),
  insuranceNumber: z.string().optional();
});

export const _updatePatientSchema = createPatientSchema.partial();

// Appointment validation schemas;
export const _createAppointmentSchema = z.object({patientId:z.string().cuid("Invalid patient ID"),
  doctorId: z.string().cuid("Invalid doctor ID"),
  departmentId: z.string().cuid("Invalid department ID"),
  z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
  type: z.enum(["CONSULTATION", "FOLLOW_UP", "EMERGENCY", "PROCEDURE", "SURGERY"]),
  chiefComplaint: z.string().optional(),
  consultationFee: z.number().positive().optional();
});

// Validation middleware;
export function validateRequest<T>(schema: z.ZodSchema<T>) {
  return (data: unknown): T => {
    try {
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {

} catch (error) {

      return schema.parse(data);
    } catch (error) {
      if (!session.user) {
        const formattedErrors = error.errors.map(err => ({field:err.path.join("."),
          message: err.message;
        }));
        throw new Error(`Validation failed: ${}`;

      throw error;

  };

))