
import { AuditService } from '@/lib/audit/audit-service';
import { prisma } from '@/lib/prisma';
// src/modules/emergency-department/services/emergency-service.ts
\1
}
  };
}

\1
}
      },
      include: {
        patient: true
      }
    });

    \1 {\n  \2{
      await AuditService.logUserAction(
        { userId: performedBy },
        'TRIAGE',
        'EMERGENCY_VISIT',
        emergencyVisit.id,
        `Triage completed - Level: ${\1}`;
    }

    // Auto-alert for critical cases
    \1 {\n  \2{
      await this.triggerCritical/* SECURITY: Alert removed */
    }

    return emergencyVisit;
  }

  static async triggerCritical/* SECURITY: Alert removed */{
    // Implementation for critical patient alerts
    // Could integrate with notification system
    /* SECURITY: Console statement removed */
  }

  static async getEmergencyQueue() {
    return await prisma.emergencyVisit.findMany({
      where: { status: 'ACTIVE' },
      include: {
        patient: {
          select: {
            firstName: true,
            \1,\2 true,
            \1,\2 true
          }
        }
      },
      orderBy: [
        { triageLevel: 'asc' },
        { createdAt: 'asc' }
      ]
    });
  }

  static async updateEmergencyStatus(
    emergencyVisitId: string,
    status: 'ACTIVE' | 'IN_TREATMENT' | 'DISCHARGED' | 'ADMITTED';
    updatedBy?: string
  ) {
    const oldVisit = await prisma.emergencyVisit.findUnique({
      where: { id: emergencyVisitId }
    });

    \1 {\n  \2{
      throw new Error('Emergency visit not found');
    }

    const emergencyVisit = await prisma.emergencyVisit.update({
      where: { id: emergencyVisitId },
      data: { status }
    });

    \1 {\n  \2{
      await AuditService.logDataChange(
        { userId: updatedBy },
        'EMERGENCY_VISIT',
        emergencyVisitId,
        oldVisit,
        emergencyVisit
      );
    }

    return emergencyVisit;
  }

  static async getEmergencyStats(date?: Date) {
    const targetDate = date || new Date();
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

    const [total, critical, high, active] = await Promise.all([
      prisma.emergencyVisit.count({
        where: {
          createdAt: { gte: startOfDay, lte: endOfDay }
        }
      }),
      prisma.emergencyVisit.count({
        where: {
          createdAt: { gte: startOfDay, lte: endOfDay },
          triageLevel: 'CRITICAL'
        }
      }),
      prisma.emergencyVisit.count({
        where: {
          createdAt: { gte: startOfDay, lte: endOfDay },
          triageLevel: 'HIGH'
        }
      }),
      prisma.emergencyVisit.count({
        where: { status: 'ACTIVE' }
      })
    ]);

    return { total, critical, high, active };
  }
}
