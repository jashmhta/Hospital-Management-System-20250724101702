import type { NextRequest } from "next/server";

import { AuditService } from "@/lib/audit/audit-service";
import { prisma } from "@/lib/prisma";
import { ApiResponseBuilder, PaginationBuilder } from "@/utils/api-response";
// apps/hms-web/src/app/api/pharmacy-management/medications/route.ts
export async function POST(request: NextRequest): unknown {
	try {
		const body = await request.json();
		const medicationData = body;

		const medication = await prisma.medication.create({
			data: medicationData,
		});

		await AuditService.logUserAction(
			{
				userId: request.headers.get("x-user-id") || undefined,
				ipAddress: request.ip,
			},
			"CREATE",
			"MEDICATION",
			medication.id,
			`Medication added: ${medication.name}`
		);

		return ApiResponseBuilder.success(medication, "Medication added successfully");
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
		const category = searchParams.get("category");
		const lowStock = searchParams.get("lowStock") === "true";

		const { skip, take, orderBy } = PaginationBuilder.buildPrismaArgs({
			page,
			limit,
		});

		const where: unknown = { isActive: true };

		if (search != null) {
			where.OR = [
				{ name: { contains: search, mode: "insensitive" } },
				{ genericName: { contains: search, mode: "insensitive" } },
				{ manufacturer: { contains: search, mode: "insensitive" } },
			];
		}

		if (category != null) where.category = category;

		if (lowStock != null) {
			where.currentStock = { lte: { minimumStock: true } };
		}

		const [medications, total] = await Promise.all([
			prisma.medication.findMany({
				where,
				skip,
				take,
				orderBy,
			}),
			prisma.medication.count({ where }),
		]);

		const meta = PaginationBuilder.buildMeta(total, page, limit);

		return ApiResponseBuilder.success(medications, "Medications retrieved successfully", meta);
	} catch (error) {
		return ApiResponseBuilder.internalError(error.message);
	}
}
