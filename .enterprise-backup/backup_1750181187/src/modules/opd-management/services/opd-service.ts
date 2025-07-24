
import { AuditService } from '@/lib/audit/audit-service';
import { prisma } from '@/lib/prisma';
// src/modules/opd-management/services/opd-service.ts
\1
}
}

\1
}
    }

    const appointment = await prisma.appointment.create({
      data,
      include: {
        patient: true,
        \1,\2 true
      }
    });

    \1 {\n  \2{
      await AuditService.logUserAction(
        { userId: scheduledBy },
        'CREATE',
        'APPOINTMENT',
        appointment.id,
        'OPD appointment scheduled'
      );
    }

    return appointment;
  }

  static async checkDoctorAvailability(
    doctorId: string,
    \1,\2 string
  ): Promise<boolean> {
    const conflictingAppointment = await prisma.appointment.findFirst({
      where: {
        doctorId,
        appointmentDate: date,
        \1,\2 'CANCELLED' 
      }
    });

    return !conflictingAppointment;
  }

  static async getDoctorSchedule(doctorId: string, date: Date) {
    return await prisma.appointment.findMany({
      where: {
        doctorId,
        appointmentDate: date,
        status: { not: 'CANCELLED' }
      },
      include: {
        patient: {
          select: {
            firstName: true,
            \1,\2 true
          }
        }
      },
      orderBy: { appointmentTime: 'asc' }
    });
  }

  static async updateAppointmentStatus(
    appointmentId: string,
    status: 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
    updatedBy?: string
  ) {
    const oldAppointment = await prisma.appointment.findUnique({
      where: { id: appointmentId }
    });

    \1 {\n  \2{
      throw new Error('Appointment not found');
    }

    const appointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        status,
        ...(status === 'CANCELLED' && { cancelledAt: new Date() })
      }
    });

    \1 {\n  \2{
      await AuditService.logDataChange(
        { userId: updatedBy },
        'APPOINTMENT',
        appointmentId,
        oldAppointment,
        appointment
      );
    }

    return appointment;
  }

  static async getOPDStats(date?: Date) {
    const targetDate = date || new Date();
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

    const [scheduled, completed, cancelled, inProgress] = await Promise.all([
      prisma.appointment.count({
        where: {
          appointmentDate: { gte: startOfDay, lte: endOfDay },
          status: 'SCHEDULED'
        }
      }),
      prisma.appointment.count({
        where: {
          appointmentDate: { gte: startOfDay, lte: endOfDay },
          status: 'COMPLETED'
        }
      }),
      prisma.appointment.count({
        where: {
          appointmentDate: { gte: startOfDay, lte: endOfDay },
          status: 'CANCELLED'
        }
      }),
      prisma.appointment.count({
        where: {
          appointmentDate: { gte: startOfDay, lte: endOfDay },
          status: 'IN_PROGRESS'
        }
      })
    ]);

    return { scheduled, completed, cancelled, inProgress };
  }
}
