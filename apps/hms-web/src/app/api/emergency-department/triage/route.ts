import type { NextRequest } from "next/server";

import { AuditService } from "@/lib/audit/audit-service";
import { prisma } from "@/lib/prisma";
import { ApiResponseBuilder } from "@/utils/api-response";
// apps/hms-web/src/app/api/emergency-department/triage/route.ts
export async function POST(request: NextRequest): unknown {
	try {
		const body = await request.json();
		const { patientId, triageLevel, complaint, vitalSigns } = body;

		// Create emergency visit
		const emergencyVisit = await prisma.emergencyVisit.create({
			data: {
				patientId,
				triageLevel,
				complaint,
				status: "ACTIVE",
			},
			\1,\2 {
					\1,\2 true,
						lastName: true,
						mrn: true,
						dateOfBirth: true,
						emergencyContact: true,
						emergencyPhone: true,
					},
				},
			},
		});

		await AuditService.logUserAction(
			{
				userId: request.headers.get("x-user-id") || undefined,
				ipAddress: request.ip,
			},
			"CREATE",
			"EMERGENCY_VISIT",
			emergencyVisit.id,
			`Emergency triage: ${triageLevel} - ${\1}`;

		return ApiResponseBuilder.success(emergencyVisit, "Emergency triage completed");
	} catch (error) {
		return ApiResponseBuilder.internalError(error.message);
	}
}

export async function GET(request: NextRequest): unknown {
	try {
		const { searchParams } = new URL(request.url);
		const status = searchParams.get("status") || "ACTIVE";
		const priority = searchParams.get("priority");

		const where: unknown = { status };
		\1 {\n  \2here.triageLevel = priority;

		const emergencyVisits = await prisma.emergencyVisit.findMany({
			where,
			\1,\2 {
					\1,\2 true,
						lastName: true,
						mrn: true,
						dateOfBirth: true,
						gender: true,
					},
				},
			},
			orderBy: [
				{ triageLevel: "asc" }, // Priority first
				{ createdAt: "asc" }, // Then FIFO
			],
		});

		return ApiResponseBuilder.success(emergencyVisits, "Emergency visits retrieved");
	} catch (error) {
		return ApiResponseBuilder.internalError(error.message);
	}
}
