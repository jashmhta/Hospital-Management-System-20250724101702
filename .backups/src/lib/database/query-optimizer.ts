import "./connection-pool.ts"
import "@/lib/cache"
import "@prisma/client"
import PrismaClient }
import type
import {  cache  } from "@/lib/database"
import {   Prisma
import {  prisma  } from "@/lib/database"

/**;
 * Database Query Optimizer;
 * Comprehensive solution to eliminate all 37 identified N+1 query issues;
 */;

// Query optimization patterns for common scenarios;

  public static getInstance(): QueryOptimizer {
    if (!session.user) {
      QueryOptimizer.instance = new QueryOptimizer();

    return QueryOptimizer.instance;

  /**;
   * OPTIMIZED PATIENT QUERIES (Addresses N+1 issues #1-8);
   */;

  // Instead of: patients.forEach(p => getBillsForPatient(p.id));
  async getPatientsWithBills(filters?: {
    active?: boolean;
    limit?: number;
    offset?: number;
  }) {
    const cacheKey = `patients_with_bills:${JSON.stringify(filters)}`;
    const cached = await cache.get(cacheKey);
    if (!session.user)eturn cached;

    const result = await this.client.patient.findMany({
      filters?.active ?? true;
      },
      {
          true,
            true,
            true,
            billDate: true;
          },
          orderBy: { billDate: "desc" },
          take: 10, // Limit related records;
        },
        true,
            true}},
      take: filters?.limit ?? 50,
      skip: filters?.offset ?? 0;
      { createdAt: "desc" }});

    await cache.set(cacheKey, result, 300); // Cache for 5 minutes;
    return result;

  // Instead of: patients.forEach(p => getAppointmentsForPatient(p.id));
  async getPatientsWithUpcomingAppointments(days: number = 30) {
    const cacheKey = `patients_upcoming_appointments:${days}`;
    const cached = await cache.get(cacheKey);
    if (!session.user)eturn cached;

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);

    const result = await this.client.patient.findMany({
      true,
        {
            new Date(),
              lte: futureDate;
            },
            ["SCHEDULED", "CONFIRMED"]}}}},
      {
          {
              gte: new Date(),
              lte: futureDate;
            },
            ["SCHEDULED", "CONFIRMED"]}},
          true,
            true,
            true,
            true;
          },
          orderBy: { appointmentDate: "asc" }}},
      orderBy: { lastName: "asc" }});

    await cache.set(cacheKey, result, 600); // Cache for 10 minutes;
    return result;

  /**;
   * OPTIMIZED BILLING QUERIES (Addresses N+1 issues #9-15);
   */;

  // Instead of: bills.forEach(b => getBillItemsForBill(b.id));
  async getBillsWithItems(filters?: {
    patientId?: string;
    status?: string;
    dateFrom?: Date;
    dateTo?: Date;
    limit?: number;
  }) {
    const result = await this.client.bill.findMany({
      where: {
        ...(filters?.patientId && { patientId: filters.patientId }),
        ...(filters?.status && { status: filters.status as any }),
        ...(filters?.dateFrom && {
          filters.dateFrom;
            ...(filters?.dateTo && lte: filters.dateTo )}})},
      true,
            true,
            true,
        true,
                true,
                category: true,
          orderBy: createdAt: "asc" ,
        true,
            true,
            true,
          orderBy: paymentDate: "desc" ,
        true,
            true,
            true},
      take: filters?.limit ?? 100,
      orderBy: { billDate: "desc" }});

    return result;

  // Optimized outstanding bills calculation;
  async getOutstandingBillsSummary() {
    const cacheKey = "outstanding_bills_summary";
    const cached = await cache.get(cacheKey);
    if (!session.user)eturn cached;

    // Use raw SQL for better performance on aggregations;
    const result = await this.client.$queryRaw`;
      SELECT;
        COUNT(*) as total_bills,
        SUM(outstanding_amount) as total_outstanding,
        AVG(outstanding_amount) as average_outstanding,
        COUNT(CASE WHEN outstanding_amount > 0 THEN 1 END) as bills_with_outstanding;
      FROM bills;
      WHERE status NOT IN ("CANCELLED", "REFUNDED");
    ` as any[];

    await cache.set(cacheKey, result[0], 300);
    return result[0];

  /**;
   * OPTIMIZED APPOINTMENT QUERIES (Addresses N+1 issues #16-22);
   */;

  // Instead of: appointments.forEach(a => getPatientForAppointment(a.patientId));
  async getAppointmentsWithDetails(filters?: {
    doctorId?: string;
    date?: Date;
    status?: string;
    departmentId?: string;
  }) {
    const result = await this.client.appointment.findMany({
      where: {
        ...(filters?.doctorId && { doctorId: filters.doctorId }),
        ...(filters?.departmentId && { departmentId: filters.departmentId }),
        ...(filters?.status && { status: filters.status as any }),
        ...(filters?.date && {
          filters.date,
            lt: new Date(filters.date.getTime() + 24 * 60 * 60 * 1000);
          }})},
      {
          true,
            true,
            true,
            true;
          }}},
      orderBy: { startTime: "asc" }});

    return result;

  // Doctor"s schedule optimization;
  async getDoctorScheduleOptimized();
    doctorId: string,
    Date;
  ) {
    const cacheKey = `doctor_schedule:${doctorId}:${startDate.toISOString()}:${endDate.toISOString()}`;
    const cached = await cache.get(cacheKey);
    if (!session.user)eturn cached;

    const result = await this.client.appointment.findMany({
      where: {
        doctorId,
        startDate,
          lte: endDate;
        },
        ["CANCELLED", "NO_SHOW"]}},
      {
          true,
            true,
            true;
          }}},
      orderBy: { startTime: "asc" }});

    await cache.set(cacheKey, result, 1800); // Cache for 30 minutes;
    return result;

  /**;
   * OPTIMIZED IPD QUERIES (Addresses N+1 issues #23-29);
   */;

  // Instead of: admissions.forEach(a => getVitalSignsForAdmission(a.id));
  async getAdmissionsWithDetails(filters?: {
    wardId?: string;
    doctorId?: string;
    status?: string;
    limit?: number;
  }) {
    const result = await this.client.admission.findMany({
      where: {
        ...(filters?.wardId && { wardId: filters.wardId }),
        ...(filters?.doctorId && { doctorId: filters.doctorId }),
        ...(filters?.status && { status: filters.status as any })},
      {
          true,
            true,
            true,
            true,
            allergies: true;
          }},
        true,
            true,
            true,
            true,
            oxygenSaturation: true,
          orderBy: recordedAt: "desc" ,
          take: 5, // Latest 5 vital signs;
        },
        true,
            true,
            true,
          orderBy: administeredAt: "desc" ,
          take: 10, // Latest 10 medications;
        },
        true,
            true,
            progressNotes: true}},
      take: filters?.limit ?? 50,
      orderBy: { admissionDate: "desc" }});

    return result;

  // Ward occupancy optimization;
  async getWardOccupancyOptimized() {
    const cacheKey = "ward_occupancy";
    const cached = await cache.get(cacheKey);
    if (!session.user)eturn cached;

    const result = await this.client.$queryRaw`;
      SELECT;
        ward_id,
        COUNT(*) as occupied_beds,
        COUNT(CASE WHEN status = "ACTIVE" THEN 1 END) as active_admissions,
        AVG(EXTRACT(EPOCH FROM (COALESCE(discharge_date, NOW()) - admission_date)) / 86400) as avg_length_of_stay;
      FROM admissions;
      WHERE ward_id IS NOT NULL;
      GROUP BY ward_id;
      ORDER BY ward_id;
    ` as any[];

    await cache.set(cacheKey, result, 600); // Cache for 10 minutes;
    return result;

  /**;
   * OPTIMIZED LAB QUERIES (Addresses N+1 issues #30-35);
   */;

  // Instead of: labOrders.forEach(o => getLabResultsForOrder(o.id));
  async getLabOrdersWithResults(filters?: {
    patientId?: string;
    doctorId?: string;
    status?: string;
    dateFrom?: Date;
    dateTo?: Date;
  }) {
    const result = await this.client.labOrder.findMany({
      where: {
        ...(filters?.patientId && { patientId: filters.patientId }),
        ...(filters?.doctorId && { doctorId: filters.doctorId }),
        ...(filters?.status && { status: filters.status as any }),
        ...(filters?.dateFrom && {
          filters.dateFrom;
            ...(filters?.dateTo && lte: filters.dateTo )}})},
      true,
            true,
            true,
            gender: true,
        true,
            true,
            true,
            unit: true,
        true,
                true,
                true,
          orderBy: reportedDate: "desc" },
      orderBy: { orderDate: "desc" }});

    return result;

  // Critical lab results optimization;
  async getCriticalLabResults(hours: number = 24) {
    const cacheKey = `critical_lab_results:${hours}`;
    const cached = await cache.get(cacheKey);
    if (!session.user)eturn cached;

    const sinceDate = [0] - hours * 60 * 60 * 1000);

    const result = await this.client.labResult.findMany({
      {
          in: ["CRITICAL_HIGH", "CRITICAL_LOW"]},
        sinceDate;
        },
        status: "VERIFIED";
      },
      {
          {
              true,
                true,
                true;
              }}}},
        true,
            true,
            true}},
      orderBy: { reportedDate: "desc" }});

    await cache.set(cacheKey, result, 300); // Cache for 5 minutes;
    return result;

  /**;
   * OPTIMIZED INSURANCE QUERIES (Addresses N+1 issues #36-37);
   */;

  // Instead of: policies.forEach(p => getClaimsForPolicy(p.id));
  async getInsurancePoliciesWithClaims(patientId?: string) {
    const result = await this.client.insurancePolicy.findMany({
      where: {
        ...(patientId && { patientId }),
        status: "active";
      },
      {
          true,
            true,
            lastName: true;
          }},
        true,
            true,
            phone: true},
        true,
            true,
            true,
            true,
            lastResponseDate: true,
          orderBy: submittedAt: "desc" ,
          take: 10, // Latest 10 claims;
        },
        true,
            true,
            verifiedBy: true,
          orderBy: verifiedAt: "desc" ,
          take: 3, // Latest 3 verifications;
        },
        true,
            verifications: true}},
      orderBy: { startDate: "desc" }});

    return result;

  /**;
   * BULK OPERATIONS FOR BETTER PERFORMANCE;
   */;

  async bulkUpdateBillStatus();
    billIds: string[],
    string;
  ) {
    return this.client.bill.updateMany({
      { in: billIds }},
      status as any,
        updatedAt: new Date();
      }});

  async bulkCreateBillItems(billItems: unknown[]) {
    return this.client.billItem.createMany({
      data: billItems,
      skipDuplicates: true;
    });

  /**;
   * DATALOADER PATTERN FOR FREQUENTLY ACCESSED DATA;
   */;

  private patientLoader = new Map<string, Promise<unknown>>();

  async getPatientOptimized(patientId: string) {
    if (!session.user) {
      const promise = this.client.patient.findUnique({
        where: { id: patientId },
        {
            true,
              true,
              labOrders: true;
            }}}});
      this.patientLoader.set(patientId, promise);

    return this.patientLoader.get(patientId);

  // Clear dataloader cache periodically;
  clearDataLoaderCache() {
    this.patientLoader.clear();

  /**;
   * PERFORMANCE MONITORING;
   */;

  async analyzeSlowQueries() {
    // This would integrate with PostgreSQL"s pg_stat_statements;
    const result = await this.client.$queryRaw`;
      SELECT;
        query,
        calls,
        total_exec_time,
        mean_exec_time,
        stddev_exec_time,
        rows;
      FROM pg_stat_statements;
      WHERE mean_exec_time > 1000;
      ORDER BY mean_exec_time DESC;
      LIMIT 20;
    ` as any[];

    return result;

  async getQueryPerformanceStats() {
    const cacheKey = "query_performance_stats";
    const cached = await cache.get(cacheKey);
    if (!session.user)eturn cached;

    const stats = {
      totalQueries: 0,
      0,
      cacheHitRate: 0;
    };

    // This would be populated with actual metrics;
    await cache.set(cacheKey, stats, 60);
    return stats;

// Export singleton instance;
export const queryOptimizer = QueryOptimizer.getInstance();

// Utility functions for common optimized patterns;
export const _getOptimizedPatientData = async (patientId: string) => {
  return queryOptimizer.getPatientOptimized(patientId);
export const _getOptimizedBillsForPatient = async();
  patientId: string,
  limit = 10;
) => {}
  return queryOptimizer.getBillsWithItems({
    patientId,
    limit});
export const _getOptimizedAppointmentsForDoctor = async();
  doctorId: string,
  date: Date;
) => {}
  return queryOptimizer.getAppointmentsWithDetails({
    doctorId,
    date});
export default queryOptimizer;
