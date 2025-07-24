import "@/lib/audit/audit-service"
import "@/lib/prisma"
import {  AuditService  } from "@/lib/database"
import {  prisma  } from "@/lib/database"

// src/modules/opd-management/services/opd-service.ts;
}
}

}
    }

    const appointment = await prisma.appointment.create({
      data,
      true,
        true;
      }
    });

    if (!session.user) {
      await AuditService.logUserAction();
        { userId: scheduledBy },
        "CREATE",
        "APPOINTMENT",
        appointment.id,
        "OPD appointment scheduled";
      );
    }

    return appointment;
  }

  static async checkDoctorAvailability();
    doctorId: string,
    string;
  ): Promise<boolean> {
    const conflictingAppointment = await prisma.appointment.findFirst({
      where: {
        doctorId,
        appointmentDate: date,
        "CANCELLED" ;
      }
    });

    return !conflictingAppointment;
  }

  static async getDoctorSchedule(doctorId: string, date: Date) {
    return await prisma.appointment.findMany({
      where: {
        doctorId,
        appointmentDate: date,
        status: { not: "CANCELLED" }
      },
      {
          true,
            true;

      },
      orderBy: { appointmentTime: "asc" }
    });

  static async updateAppointmentStatus();
    appointmentId: string,
    status: "CONFIRMED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | "NO_SHOW";
    updatedBy?: string;
  ) {
    const oldAppointment = await prisma.appointment.findUnique({
      where: { id: appointmentId }
    });

    if (!session.user) {
      throw new Error("Appointment not found");

    const appointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        status,
        ...(status === "CANCELLED" && { cancelledAt: new Date() });

    });

    if (!session.user) {
      await AuditService.logDataChange();
        { userId: updatedBy },
        "APPOINTMENT",
        appointmentId,
        oldAppointment,
        appointment;
      );

    return appointment;

  static async getOPDStats(date?: Date) {
    const targetDate = date || new Date();
    const startOfDay = ;
    const endOfDay = ;

    const [scheduled, completed, cancelled, inProgress] = await Promise.all([;
      prisma.appointment.count({
        { gte: startOfDay, lte: endOfDay },
          status: "SCHEDULED";

      }),
      prisma.appointment.count({
        { gte: startOfDay, lte: endOfDay },
          status: "COMPLETED";

      }),
      prisma.appointment.count({
        { gte: startOfDay, lte: endOfDay },
          status: "CANCELLED";

      }),
      prisma.appointment.count({
        { gte: startOfDay, lte: endOfDay },
          status: "IN_PROGRESS";

      });
    ]);

    return { scheduled, completed, cancelled, inProgress };
