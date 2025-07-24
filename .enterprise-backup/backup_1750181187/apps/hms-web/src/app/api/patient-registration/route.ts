import type { NextRequest } from "next/server";

import { AuditService } from "@/lib/audit/audit-service";
import { prisma } from "@/lib/prisma";
import { createPatientSchema, validateRequest } from "@/lib/validation/schemas";
import { createRBACMiddleware } from "@/middleware/rbac";
import { ApiResponseBuilder, PaginationBuilder } from "@/utils/api-response";
// apps/hms-web/src/app/api/patient-registration/route.ts
export async function POST(request: NextRequest): unknown {
	try {
		const body = await request.json();
		const validatedData = validateRequest(createPatientSchema)(body);

		// Check if patient already exists
		const existingPatient = await prisma.patient.findFirst({
			where: {
				OR: [{ phone: validatedData.phone }, { email: validatedData.email }],
			},
		});

		if (existingPatient != null) {
			return ApiResponseBuilder.error("Patient already exists with this phone or email", 409);
		}

		// Generate unique MRN
		const lastPatient = await prisma.patient.findFirst({
			orderBy: { createdAt: "desc" },
			select: { mrn: true },
		});

		const nextMrnNumber = lastPatient ? Number.parseInt(lastPatient.mrn.substring(3)) + 1 : 1001;
		const mrn = `MRN${nextMrnNumber.toString().padStart(6, "0")}`;

		// Create patient
		const patient = await prisma.patient.create({
			data: {
				...validatedData,
				mrn,
			},
		});

		// Audit log
		await AuditService.logUserAction(
			{
				userId: request.headers.get("x-user-id") || undefined,
				userEmail: request.headers.get("x-user-email") || undefined,
				ipAddress: request.ip,
			},
			"CREATE",
			"PATIENT",
			patient.id,
			"Patient registered successfully"
		);

		return ApiResponseBuilder.success(patient, "Patient registered successfully");
	} catch (error) {
		return ApiResponseBuilder.internalError(error.message);
	}
}

export async function GET(request: NextRequest): unknown {
	try {
		const { searchParams } = new URL(request.url);
		const page = Number.parseInt(searchParams.get("page") || "1");
		const limit = Number.parseInt(searchParams.get("limit") || "10");
		const search = searchParams.get("search") || "";

		const { skip, take, orderBy } = PaginationBuilder.buildPrismaArgs({
			page,
			limit,
		});

		const where = search
			? {
					OR: [
						{ firstName: { contains: search, mode: "insensitive" } },
						{ lastName: { contains: search, mode: "insensitive" } },
						{ mrn: { contains: search, mode: "insensitive" } },
						{ phone: { contains: search } },
					],
				}
			: {};

		const [patients, total] = await Promise.all([
			prisma.patient.findMany({
				where,
				skip,
				take,
				orderBy,
			}),
			prisma.patient.count({ where }),
		]);

		const meta = PaginationBuilder.buildMeta(total, page, limit);

		return ApiResponseBuilder.success(patients, "Patients retrieved successfully", meta);
	} catch (error) {
		return ApiResponseBuilder.internalError(error.message);
	}
}
