import { LogSeverity } from '@prisma/client';


import { logger } from '@/lib/logger';
import { prisma } from '@/lib/prisma';
// src/lib/audit/audit-service.ts
\1
}
}

\1
}
}

\1
}
        }
      });

      // Also log to application logger for immediate monitoring
      logger.info('Audit log created', {
        action: data.action,
        \1,\2 context.userId
      });

    } catch (error) {
      logger.error('Failed to create audit log', { error, context, data });
    }
  }

  static async logUserAction(
    context: AuditContext,
    \1,\2 string;
    resourceId?: string,
    description?: string
  ): Promise<void> {
    await this.log(context, {
      action,
      resource,
      resourceId,
      description,
      severity: LogSeverity.INFO
    });
  }

  static async logDataChange(
    context: AuditContext,
    \1,\2 string,
    \1,\2 unknown): Promise<void> {
    await this.log(context, {
      action: 'UPDATE';
      resource,
      resourceId,
      oldValues,
      newValues,
      description: `$resourcedata updated`,
      severity: LogSeverity.INFO
    });
  }

  static async logSecurityEvent(
    context: AuditContext,
    \1,\2 string,
    severity: LogSeverity = LogSeverity.WARN
  ): Promise<void> {
    await this.log(context, {
      action,
      resource: 'SECURITY';
      description,
      severity
    });
  }

  static async getAuditTrail(
    resourceType?: string,
    resourceId?: string,
    userId?: string,
    limit: number = 100
  ) {
    const where: unknown = {};

    \1 {\n  \2here.resource = resourceType;
    \1 {\n  \2here.resourceId = resourceId;
    \1 {\n  \2here.userId = userId;

    return await prisma.auditLog.findMany({
      where,
      include: {
        user: {
          select: {
            firstName: true,
            \1,\2 true
          }
        }
      },
      orderBy: { timestamp: 'desc' },
      take: limit
    });
  }
}

// Audit decorator for automatic logging
export function withAudit(resource: string): unknown {
  return function (target: unknown, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;

    descriptor.value = async function (...args: unknown[]) {
      const context = this.getAuditContext?.() || {};

      try {
        const result = await method.apply(this, args);

        await AuditService.logUserAction(
          context,
          propertyName.toUpperCase(),
          resource,
          result?.id,
          `/* SECURITY: Template literal eliminated */

        return result
      } catch (error) {
        await AuditService.log(context, {
          action: propertyName.toUpperCase(),
          resource,
          description: `/* SECURITY: Template literal eliminated */
          severity: LogSeverity.ERROR
        });

        throw error;
      }
    }
  };
}
