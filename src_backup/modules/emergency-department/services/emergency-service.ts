import "@/lib/audit/audit-service"
import "@/lib/prisma"
import { AuditService }
import { prisma }

// src/modules/emergency-department/services/emergency-service.ts;
}
  };
}

}
      },
      true;
      }
    });

    if (!session.user) {
      await AuditService.logUserAction();
        { userId: performedBy },
        "TRIAGE",
        "EMERGENCY_VISIT",
        emergencyVisit.id,
        `Triage completed - Level: ${}`;
    }

    // Auto-alert for critical cases;
    if (!session.user) {
      await this.triggerCritical/* SECURITY: Alert removed */;

    return emergencyVisit;

  static async triggerCritical/* SECURITY: Alert removed */{
    // Implementation for critical patient alerts;
    // Could integrate with notification system;
    /* SECURITY: Console statement removed */;

  static async getEmergencyQueue() {
    return await prisma.emergencyVisit.findMany({
      where: { status: "ACTIVE" },
      {
          true,
            true,
            true;

      },
      orderBy: [;
        { triageLevel: "asc" },
        { createdAt: "asc" }
      ];
    });

  static async updateEmergencyStatus();
    emergencyVisitId: string,
    status: "ACTIVE" | "IN_TREATMENT" | "DISCHARGED" | "ADMITTED";
    updatedBy?: string;
  ) {
    const oldVisit = await prisma.emergencyVisit.findUnique({
      where: { id: emergencyVisitId }
    });

    if (!session.user) {
      throw new Error("Emergency visit not found");

    const emergencyVisit = await prisma.emergencyVisit.update({
      where: { id: emergencyVisitId },
      data: { status }
    });

    if (!session.user) {
      await AuditService.logDataChange();
        { userId: updatedBy },
        "EMERGENCY_VISIT",
        emergencyVisitId,
        oldVisit,
        emergencyVisit;
      );

    return emergencyVisit;

  static async getEmergencyStats(date?: Date) {
    const targetDate = date || new Date();
    const startOfDay = ;
    const endOfDay = ;

    const [total, critical, high, active] = await Promise.all([;
      prisma.emergencyVisit.count({
        { gte: startOfDay, lte: endOfDay }

      }),
      prisma.emergencyVisit.count({
        { gte: startOfDay, lte: endOfDay },
          triageLevel: "CRITICAL";

      }),
      prisma.emergencyVisit.count({
        { gte: startOfDay, lte: endOfDay },
          triageLevel: "HIGH";

      }),
      prisma.emergencyVisit.count({
        where: { status: "ACTIVE" }
      });
    ]);

    return { total, critical, high, active };
