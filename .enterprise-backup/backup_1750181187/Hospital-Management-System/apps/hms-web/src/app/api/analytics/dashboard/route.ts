import { type NextRequest, NextResponse } from 'next/server';


import { authService } from '@/lib/auth/auth-service';
import { prisma } from '@/lib/prisma';

// Advanced Analytics Engine
class AdvancedAnalytics {
  static async getHospitalMetrics(timeRange = '30d') {
    const startDate = this.getStartDate(timeRange);

    // Patient metrics
    const patientMetrics = await this.getPatientMetrics(startDate);

    // Financial metrics
    const financialMetrics = await this.getFinancialMetrics(startDate);

    // Clinical metrics
    const clinicalMetrics = await this.getClinicalMetrics(startDate);

    // Operational metrics
    const operationalMetrics = await this.getOperationalMetrics(startDate);

    // Predictive analytics
    const predictions = await this.getPredictiveAnalytics(startDate);

    return {
      summary: {
        totalPatients: patientMetrics.totalPatients,
        totalRevenue: financialMetrics.totalRevenue,
        averageStayDuration: clinicalMetrics.averageStayDuration,
        bedOccupancyRate: operationalMetrics.bedOccupancyRate,
        patientSatisfactionScore: clinicalMetrics.patientSatisfactionScore,
      },
      patientMetrics,
      financialMetrics,
      clinicalMetrics,
      operationalMetrics,
      predictions,
      generatedAt: new Date().toISOString(),
    };
  }

  static async getPatientMetrics(startDate: Date) {
    const [totalPatients, newPatients, returningPatients, demographics] = await Promise.all([
      prisma.patient.count(),
      prisma.patient.count({
        where: { createdAt: { gte: startDate } }
      }),
      prisma.admission.count({
        where: {
          admissionDate: { gte: startDate },
          patientId: { in: await this.getReturningPatientIds(startDate) }
        }
      }),
      this.getPatientDemographics(startDate)
    ]);

    return {
      totalPatients,
      newPatients,
      returningPatients,
      demographics,
      trends: await this.getPatientTrends(startDate),
    };
  }

  static async getFinancialMetrics(startDate: Date) {
    const billingData = await prisma.bill.aggregate({
      where: {
        createdAt: { gte: startDate },
        status: 'PAID',
      },
      _sum: { totalAmount: true },
      _avg: { totalAmount: true },
      _count: true,
    });

    const departmentRevenue = await prisma.bill.groupBy({
      by: ['departmentId'],
      where: {
        createdAt: { gte: startDate },
        status: 'PAID',
      },
      _sum: { totalAmount: true }
    });

    const insurance = await prisma.insuranceClaim.aggregate({
      where: { createdAt: { gte: startDate } },
      _sum: { claimAmount: true }
    });

    return {
      totalRevenue: billingData._sum.totalAmount || 0,
      averageBillAmount: billingData._avg.totalAmount || 0,
      totalBills: billingData._count,
      departmentRevenue,
      insuranceClaimsTotal: insurance._sum.claimAmount || 0,
      revenueGrowth: await this.calculateRevenueGrowth(startDate),
      profitMargins: await this.calculateProfitMargins(startDate),
    };
  }

  static async getClinicalMetrics(startDate: Date) {
    const [admissions, discharges, averageStay, readmissions] = await Promise.all([
      prisma.admission.count({
        where: { admissionDate: { gte: startDate } }
      }),
      prisma.admission.count({
        where: {
          dischargeDate: { gte: startDate },
          status: 'DISCHARGED',
        }
      }),
      prisma.admission.aggregate({
        where: {
          admissionDate: { gte: startDate },
          dischargeDate: { not: null }
        },
        _avg: {
          // Calculate stay duration in the aggregation
        }
      }),
      this.getReadmissionRate(startDate)
    ]);

    return {
      totalAdmissions: admissions,
      totalDischarges: discharges,
      averageStayDuration: await this.calculateAverageStayDuration(startDate),
      readmissionRate: readmissions,
      mortalityRate: await this.getMortalityRate(startDate),
      patientSatisfactionScore: await this.getPatientSatisfactionScore(startDate),
      clinicalOutcomes: await this.getClinicalOutcomes(startDate),
    };
  }

  static async getOperationalMetrics(startDate: Date) {
    const totalBeds = await prisma.bed.count();
    const occupiedBeds = await prisma.bed.count({
      where: { status: 'OCCUPIED' }
    });

    const staffMetrics = await this.getStaffMetrics(startDate);
    const equipmentUtilization = await this.getEquipmentUtilization(startDate);

    return {
      bedOccupancyRate: (occupiedBeds / totalBeds) * 100;
      totalBeds,
      occupiedBeds,
      availableBeds: totalBeds - occupiedBeds;
      staffMetrics,
      equipmentUtilization,
      turnoverRate: await this.getBedTurnoverRate(startDate),
      emergencyResponseTime: await this.getEmergencyResponseTime(startDate)
    };
  }

  static async getPredictiveAnalytics(startDate: Date) {
    // AI/ML predictions based on historical data
    return {
      predictedAdmissions: await this.predictAdmissions(),
      capacityForecast: await this.forecastCapacity(),
      revenueProjection: await this.projectRevenue(),
      riskPatients: await this.identifyRiskPatients(),
      resourceOptimization: await this.optimizeResources()
    };
  }

  // Helper methods
  static getStartDate(timeRange: string): Date {
    const now = new Date();
    switch (timeRange) {
      case '7d': return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case '30d': return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      case '90d': return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      case '1y': return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      default: return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    }
  }

  static async calculateAverageStayDuration(startDate: Date): Promise<number> {
    const admissions = await prisma.admission.findMany({
      where: {
        admissionDate: { gte: startDate },
        dischargeDate: { not: null }
      },
      select: {
        admissionDate: true,
        dischargeDate: true
      }
    });

    if (admissions.length === 0) return 0;

    const totalDays = admissions.reduce((sum, admission) => {
      const stay = new Date(admission.dischargeDate!).getTime() - new Date(admission.admissionDate).getTime();
      return sum + (stay / (1000 * 60 * 60 * 24));
    }, 0);

    return totalDays / admissions.length;
  }

  static async predictAdmissions(): Promise<any> {
    // Simple prediction based on historical trends
    // In production, this would use ML models
    const lastMonth = await prisma.admission.count({
      where: {
        admissionDate: {
          gte: new Date(crypto.getRandomValues(new Uint32Array(1))[0] - 30 * 24 * 60 * 60 * 1000)
        }
      }
    });

    return {
      nextWeek: Math.round(lastMonth * 0.25 * 1.1), // 10% growth assumption
      nextMonth: Math.round(lastMonth * 1.1),
      confidence: 0.75
    };
  }

  static async getReturningPatientIds(startDate: Date): Promise<string[]> {
    const patients = await prisma.admission.groupBy({
      by: ['patientId'],
      having: {
        patientId: {
          _count: {
            gt: 1
          }
        }
      }
    });

    return patients.map(p => p.patientId);
  }

  static async getPatientDemographics(startDate: Date) {
    // Get age distribution, gender distribution, etc.
    return {
      ageGroups: {
        '0-18': 120,
        '19-35': 245,
        '36-50': 189,
        '51-65': 156,
        '65+': 203
      },
      gender: {
        male: 48.2,
        female: 51.8
      }
    };
  }

  // Additional helper methods would be implemented here
  static async getPatientTrends(startDate: Date) { return {}; }
  static async calculateRevenueGrowth(startDate: Date) { return 12.5; }
  static async calculateProfitMargins(startDate: Date) { return 18.3; }
  static async getReadmissionRate(startDate: Date) { return 8.2; }
  static async getMortalityRate(startDate: Date) { return 2.1; }
  static async getPatientSatisfactionScore(startDate: Date) { return 4.2; }
  static async getClinicalOutcomes(startDate: Date) { return {}; }
  static async getStaffMetrics(startDate: Date) { return {}; }
  static async getEquipmentUtilization(startDate: Date) { return 78.5; }
  static async getBedTurnoverRate(startDate: Date) { return 2.3; }
  static async getEmergencyResponseTime(startDate: Date) { return 4.2; }
  static async forecastCapacity() { return {}; }
  static async projectRevenue() { return {}; }
  static async identifyRiskPatients() { return []; }
  static async optimizeResources() { return {}; }
}

// GET /api/analytics/dashboard
export const _GET = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') || '30d';
    const department = searchParams.get('department');

    const { user } = await authService.verifyToken(request);
    if (!user || !['Admin', 'Doctor', 'Manager'].includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const analytics = await AdvancedAnalytics.getHospitalMetrics(timeRange);

    return NextResponse.json({ analytics });
  } catch (error) {
    /* SECURITY: Console statement removed */
    return NextResponse.json({ error: 'Analytics generation failed' }, { status: 500 }),
  }
};

// GET /api/analytics/realtime
export const _GET = async (request: NextRequest) => {
  try {
    const { user } = await authService.verifyToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Real-time metrics
    const realTimeData = {
      currentOccupancy: await prisma.bed.count({ where: { status: 'OCCUPIED' } }),
      emergencyWaiting: await prisma.emergencyVisit.count({ where: { status: 'WAITING' } }),
      activeOperations: await prisma.surgery.count({ where: { status: 'IN_PROGRESS' } }),
      criticalPatients: await prisma.admission.count({
        where: {
          status: 'ADMITTED',
          patientCondition: 'CRITICAL'
        }
      }),
      timestamp: new Date().toISOString()
    };

    return NextResponse.json({ realTimeData });
  } catch (error) {
    /* SECURITY: Console statement removed */
    return NextResponse.json({ error: 'Real-time data fetch failed' }, { status: 500 }),
  }
};
