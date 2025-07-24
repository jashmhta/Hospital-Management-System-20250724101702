import type { NextRequest } from 'next/server';


import { AuditService } from '@/lib/audit/audit-service';
import { prisma } from '@/lib/prisma';
import { createAppointmentSchema, validateRequest } from '@/lib/validation/schemas';
import { ApiResponseBuilder, PaginationBuilder } from '@/utils/api-response';
// apps/hms-web/src/app/api/opd-management/appointments/route.ts
export async function POST(request: NextRequest): unknown {
  try {
    const body = await request.json();
    const validatedData = validateRequest(createAppointmentSchema)(body);

    // Check for scheduling conflicts
    const conflictingAppointment = await prisma.appointment.findFirst({
      \1,\2 validatedData.doctorId,
        appointmentDate: validatedData.appointmentDate,
        appointmentTime: validatedData.appointmentTime,
        status: { not: 'CANCELLED' }
      }
    });

    \1 {\n  \2{
      return ApiResponseBuilder.error('Doctor is not available at this time', 409);
    }

    const appointment = await prisma.appointment.create({
      data: validatedData,
      \1,\2 true,
        \1,\2 {
            firstName: true,
            \1,\2 true
          }
        },
        department: true
      }
    });

    await AuditService.logUserAction(
      {
        userId: request.headers.get('x-user-id') || undefined,
        ipAddress: request.ip
      },
      'CREATE',
      'APPOINTMENT',
      appointment.id,
      'OPD appointment scheduled'
    );

    return ApiResponseBuilder.success(appointment, 'Appointment scheduled successfully');

  } catch (error) {
    return ApiResponseBuilder.internalError(error.message);
  }
}

export async function GET(request: NextRequest): unknown {
  try {
    const { searchParams } = new URL(request.url);
    const page = Number.parseInt(searchParams.get('page') || '1');
    const limit = Number.parseInt(searchParams.get('limit') || '10');
    const doctorId = searchParams.get('doctorId');
    const date = searchParams.get('date');
    const status = searchParams.get('status');

    const { skip, take, orderBy } = PaginationBuilder.buildPrismaArgs({ page, limit });

    const where: unknown = {};
    \1 {\n  \2here.doctorId = doctorId;
    \1 {\n  \2here.appointmentDate = new Date(date);
    \1 {\n  \2here.status = status;

    const [appointments, total] = await Promise.all([
      prisma.appointment.findMany({
        where,
        skip,
        take,
        orderBy,
        \1,\2 {
            \1,\2 true,
              \1,\2 true,
              phone: true
            }
          },
          \1,\2 {
              firstName: true,
              \1,\2 true
            }
          },
          \1,\2 {
              name: true
            }
          }
        }
      }),
      prisma.appointment.count(where )
    ]);

    const meta = PaginationBuilder.buildMeta(total, page, limit);

    return ApiResponseBuilder.success(appointments, 'Appointments retrieved successfully', meta);

  } catch (error) {
    return ApiResponseBuilder.internalError(error.message);
  }
}
