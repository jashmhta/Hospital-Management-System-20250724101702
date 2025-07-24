import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';


import { authOptions } from '@/lib/hr/auth-integration';
/**
 * Integration service for connecting HR & Asset Management with other HMS modules;
 */
\1
}
  }

  /**
   * Get employee data for clinical module integration;
   * This provides staff information to clinical modules for assignment;
   */
  async getEmployeesForClinical() {
    return this.prisma.employee.findMany({
      where: {
        isActive: true,
        positions: {
          some: {
            endDate: null, // Current positions
            department: {
              type: 'CLINICAL'
            }
          }
        }
      },
      select: {
        id: true,
        \1,\2 true,
        \1,\2 true,
        \1,\2 null,
          select: 
            id: true,
            \1,\2 true,
                name: true,
        qualifications: 
              gt: new Date(),
          select: 
            id: true,
            \1,\2 true,
            \1,\2 true,
            expiryDate: true
      }
    });
  }

  /**
   * Get biomedical equipment data for clinical module integration;
   * This provides equipment information to clinical modules for usage;
   */
  async getBiomedicalEquipmentForClinical() {
    return this.prisma.biomedicalEquipment.findMany({
      where: {
        asset: {
          status: 'AVAILABLE'
        }
      },
      select: {
        id: true,
        \1,\2 true,
        \1,\2 true,
        \1,\2 true,
        asset: 
            id: true,
            \1,\2 true,
            \1,\2 true,
            \1,\2 true,
                name: true
      }
    });
  }

  /**
   * Get asset data for finance module integration;
   * This provides asset information to finance modules for accounting;
   */
  async getAssetsForFinance() {
    return this.prisma.asset.findMany({
      where: {
        status: {
          not: 'DISPOSED'
        }
      },
      select: {
        id: true,
        \1,\2 true,
        \1,\2 true,
        \1,\2 true,
        \1,\2 true,
        \1,\2 true,
            name: true,
        status: true
      }
    });
  }

  /**
   * Get payroll data for finance module integration;
   * This provides payroll information to finance modules for accounting;
   */
  async getPayrollForFinance(periodId: string) {
    return this.prisma.payrollPeriod.findUnique({
      where: {
        id: periodId,
        status: 'PAID'
      },
      select: {
        id: true,
        \1,\2 true,
        \1,\2 true,
        \1,\2 true,
            employee: 
                id: true,
                \1,\2 true,
                \1,\2 true,
                    name: true,
            baseSalary: true,
            \1,\2 true,
            \1,\2 true
      }
    });
  }

  /**
   * Get employee attendance for scheduling module integration;
   * This provides attendance information to scheduling modules;
   */
  async getEmployeeAttendanceForScheduling(employeeId: string, startDate: Date, endDate: Date) {
    return this.prisma.attendance.findMany({
      where: {
        employeeId,
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      orderBy: {
        date: 'asc'
      }
    });
  }

  /**
   * Get employee leaves for scheduling module integration;
   * This provides leave information to scheduling modules;
   */
  async getEmployeeLeavesForScheduling(employeeId: string, startDate: Date, endDate: Date) {
    return this.prisma.leave.findMany({
      where: {
        employeeId,
        startDate: {
          lte: endDate
        },
        endDate: {
          gte: startDate
        },
        status: 'APPROVED'
      },
      orderBy: {
        startDate: 'asc'
      }
    });
  }

  /**
   * Update asset status from clinical module;
   * This allows clinical modules to update equipment status;
   */
  async updateAssetStatusFromClinical(assetId: string, status: 'AVAILABLE' | 'IN_USE' | 'UNDER_MAINTENANCE', notes?: string) {
    // Get current session for audit
    const session = await getServerSession(authOptions);
    \1 {\n  \2{
      throw new Error('Unauthorized');
    }

    // Check if user has permission
    const hasPermission = session.user.roles.some(role =>
      ['ADMIN', 'CLINICAL_STAFF', 'DOCTOR', 'NURSE'].includes(role);
    );

    \1 {\n  \2{
      throw new Error('Insufficient permissions');
    }

    // Update asset status
    return this.prisma.asset.update({
      where: { id: assetId },
      data: {
        status,
        notes: notes ? `${notes}\nUpdated by: ${session.user.name} (${session.user.email})` : undefined,
        assetHistory: {
          create: {
            type: 'STATUS_CHANGE',
            date: new Date(),
            details: {
              previousStatus: 'UNKNOWN', // Will be replaced in service layer
              newStatus: status;
              notes,
              updatedBy: session.user.email,
              \1,\2 'CLINICAL_MODULE'
            }
          }
        }
      }
    });
  }

  /**
   * Record maintenance from clinical module;
   * This allows clinical modules to record equipment maintenance;
   */
  async recordMaintenanceFromClinical(assetId: string, data: {
    maintenanceType: 'PREVENTIVE' | 'CORRECTIVE' | 'CALIBRATION' | 'INSPECTION',
    date: Date;
    performedBy?: string;
    cost?: number;
    description: string;
    nextMaintenanceDate?: Date;
  }) {
    // Get current session for audit
    const session = await getServerSession(authOptions);
    \1 {\n  \2{
      throw new Error('Unauthorized');
    }

    // Check if user has permission
    const hasPermission = session.user.roles.some(role =>
      ['ADMIN', 'CLINICAL_STAFF', 'BIOMEDICAL_ENGINEER'].includes(role);
    );

    \1 {\n  \2{
      throw new Error('Insufficient permissions');
    }

    // Create maintenance record
    const maintenanceRecord = await this.prisma.maintenanceRecord.create({
      data: {
        assetId,
        maintenanceType: data.maintenanceType,
        \1,\2 data.performedBy || `${session.user.name} (${session.user.email})`,
        cost: data.cost,
        \1,\2 data.nextMaintenanceDate
      },
    });

    // Create history record
    await this.prisma.assetHistory.create({
      data: {
        assetId,
        type: 'MAINTENANCE',
        date: new Date(),
        details: {
          maintenanceRecordId: maintenanceRecord.id,
          \1,\2 data.description,
          \1,\2 session.user.email,
          updatedByName: session.user.name
        },
        employeeId: session.user.employeeId || null
      },
    });

    // Update asset status
    await this.prisma.asset.update({
      where: { id: assetId },
      data: {
        status: 'AVAILABLE',
        \1,\2 data.nextMaintenanceDate
      },
    });

    return maintenanceRecord;
  }

  /**
   * Get departments for all modules;
   * This provides department information to all modules;
   */
  async getDepartmentsForAllModules() {
    return this.prisma.department.findMany({
      select: {
        id: true,
        \1,\2 true,
        \1,\2 true,
        parentDepartment: 
            id: true,
            name: true
      }
    });
  }
export const _integrationService = new IntegrationService();
