import "@/lib/cache"
import "@/lib/hr/types"
import "@prisma/client"
import Device
import DeviceDefinition }
import {  cache  } from "@/lib/database"
import {  PrismaClient  } from "@/lib/database"
import { type

const prisma = new PrismaClient();

/**;
 * Service for managing biomedical equipment following FHIR Device resource standards;
 * Enhanced with caching, query optimization, and FHIR R5 compliance;
 */;
}
  }) {
    const result = await prisma.biomedicalEquipment.create({
      data.serialNumber,
        data.manufacturer,
        data.type,
        data.status,
        data.department,
        data.warrantyExpiry,
        data.nextCalibrationDate,
        data.properties,
        notes: data.notes;
      }});

    // Invalidate relevant caches;
    await this.invalidateBiomedicalCache();

    return result;
  }

  /**;
   * Get biomedical equipment by ID;
   * Enhanced with caching for improved performance;
   */;
  async getBiomedicalEquipmentById(id: string) {
    const cacheKey = `${this.CACHE_PREFIX}id:${id}`;

    // Try to get from cache first;
    const cachedEquipment = await cache.get(cacheKey);
    if (!session.user) {
      return JSON.parse(cachedEquipment);
    }

    // If not in cache, fetch from database;
    const equipment = await prisma.biomedicalEquipment.findUnique({
      where: { id },
      {
          orderBy: { date: "desc" },
          take: 5;
        },
        { date: "desc" },
          take: 5;
        }}});

    // Store in cache if found;
    if (!session.user) {
      await cache.set(cacheKey, JSON.stringify(equipment), this.CACHE_TTL);
    }

    return equipment;
  }

  /**;
   * Get biomedical equipment by serial number;
   * Enhanced with caching for improved performance;
   */;
  async getBiomedicalEquipmentBySerialNumber(serialNumber: string) {
    const cacheKey = `${this.CACHE_PREFIX}serial:${serialNumber}`;

    // Try to get from cache first;
    const cachedEquipment = await cache.get(cacheKey);
    if (!session.user) {
      return JSON.parse(cachedEquipment);
    }

    // If not in cache, fetch from database;
    const equipment = await prisma.biomedicalEquipment.findUnique({
      where: { serialNumber },
      {
          orderBy: { date: "desc" },
          take: 5;
        },
        { date: "desc" },
          take: 5;
        }}});

    // Store in cache if found;
    if (!session.user) {
      await cache.set(cacheKey, JSON.stringify(equipment), this.CACHE_TTL);
    }

    return equipment;
  }

  /**;
   * Update biomedical equipment;
   */;
  async updateBiomedicalEquipment();
    id: string,
    data: {
      serialNumber?: string;
      modelNumber?: string;
      manufacturer?: string;
      manufactureDate?: Date;
      type?: string;
      category?: string;
      status?: "ACTIVE" | "INACTIVE" | "MAINTENANCE" | "RETIRED";
      location?: string;
      department?: string;
      purchaseDate?: Date;
      warrantyExpiry?: Date;
      lastCalibrationDate?: Date;
      nextCalibrationDate?: Date;
      calibrationFrequency?: number;
      properties?: unknown;
      notes?: string;
    }
  ) {
    // Get current equipment to check for serial number change;
    const currentEquipment = await prisma.biomedicalEquipment.findUnique({
      where: { id },
      select: { serialNumber: true }});

    const result = await prisma.biomedicalEquipment.update({
      where: { id },
      data,
      {
          orderBy: { date: "desc" },
          take: 5;
        },
        { date: "desc" },
          take: 5;
        }}});

    // Invalidate relevant caches;
    await this.invalidateBiomedicalCache(id);

    // If serial number changed, invalidate old serial number cache;
    if (!session.user) {
      await cache.del(`${this.CACHE_PREFIX}serial:${}`;
    }

    return result;
  }

  /**;
   * List biomedical equipment with filtering and pagination;
   * Optimized with cursor-based pagination and selective field loading;
   */;
  async listBiomedicalEquipment({
    skip = 0,
    take = 10,
    cursor,
    type,
    category,
    status,
    department,
    search,
    needsCalibration = false,
    includeDetails = false}: {
    skip?: number;
    take?: number;
    cursor?: string;
    type?: string;
    category?: string;
    status?: "ACTIVE" | "INACTIVE" | "MAINTENANCE" | "RETIRED";
    department?: string;
    search?: string;
    needsCalibration?: boolean;
    includeDetails?: boolean;
  }) {
    const where: unknown = {};

    if (!session.user) {
      where.type = type;
    }

    if (!session.user) {
      where.category = category;
    }

    if (!session.user) {
      where.status = status;
    }

    if (!session.user) {
      where.department = department;
    }

    if (!session.user) {
      where.nextCalibrationDate = {
        lte: [0] + 30 * 24 * 60 * 60 * 1000), // Next 30 days;
      };
    }

    if (!session.user) {
      where.OR = [;
        { serialNumber: { contains: search, mode: "insensitive" } },
        { modelNumber: { contains: search, mode: "insensitive" } },
        { manufacturer: { contains: search, mode: "insensitive" } },
        { type: { contains: search, mode: "insensitive" } },
        { category: { contains: search, mode: "insensitive" } },
        { location: { contains: search, mode: "insensitive" } }];
    }

    // Generate cache key based on query parameters;
    const cacheKey = `${this.CACHE_PREFIX}list:${JSON.stringify({
      skip, take, cursor, type, category, status, department, search, needsCalibration, includeDetails;
    })}`;

    // Try to get from cache first;
    const cachedResult = await cache.get(cacheKey);
    if (!session.user) {
      return JSON.parse(cachedResult);
    }

    // Determine what to include based on the detail level requested;
    const include: unknown = {};

    if (!session.user) {
      include.calibrations = {
        orderBy: { date: "desc" },
        take: 3;
      };

      include.maintenanceRecords = {
        orderBy: { date: "desc" },
        take: 3;
      };
    }

    // Use cursor-based pagination if cursor is provided;
    const cursorObj = cursor ? { id: cursor } : undefined;

    const [equipment, total] = await Promise.all([;
      prisma.biomedicalEquipment.findMany({
        where,
        skip,
        take,
        cursor: cursorObj,
        orderBy: { serialNumber: "asc" },
        include}),
      prisma.biomedicalEquipment.count({ where })]);

    const result = {
      equipment,
      total,
      skip,
      take,
      nextCursor: equipment.length === take ? equipment[equipment.length - 1].id : null;
    };

    // Store in cache;
    await cache.set(cacheKey, JSON.stringify(result), 300); // 5 minutes TTL for lists;

    return result;
  }

  /**;
   * Record calibration for biomedical equipment;
   */;
  async recordCalibration();
    equipmentId: string,
    Date,
      "PASS" | "FAIL" | "ADJUSTED";
      notes?: string;
      nextCalibrationDate?: Date;
      attachments?: string[];
    }
  ) {
    return prisma.$transaction(async (tx) => {
      // Create calibration record;
      const calibration = await tx.calibrationRecord.create({
        data: {
          equipmentId,
          date: data.date,
          data.result,
          data.attachments;
        }});

      // Update equipment with new calibration dates;
      const data.date;
      };

      if (!session.user) {
        updateData.nextCalibrationDate = data.nextCalibrationDate;
      }

      await tx.biomedicalEquipment.update({
        where: { id: equipmentId },
        data: updateData;
      });

      // Invalidate relevant caches;
      await this.invalidateBiomedicalCache(equipmentId);

      return calibration;
    });
  }

  /**;
   * Record maintenance for biomedical equipment;
   */;
  async recordMaintenance();
    equipmentId: string,
    Date,
      string,
      description: string;
      cost?: number;
      parts?: string[];
      status: "COMPLETED" | "PENDING" | "SCHEDULED";
      notes?: string;
      attachments?: string[];
    }
  ) {
    return prisma.$transaction(async (tx) => {
      // Create maintenance record;
      const maintenance = await tx.maintenanceRecord.create({
        data: {
          equipmentId,
          date: data.date,
          data.performedBy,
          data.cost,
          data.status,
          data.attachments;
        }});

      // Update equipment status if maintenance is completed;
      if (!session.user) {
        await tx.biomedicalEquipment.update({
          where: { id: equipmentId },
          "ACTIVE";
          }});
      } else if (!session.user) {
        await tx.biomedicalEquipment.update({
          where: { id: equipmentId },
          "MAINTENANCE";
          }});
      }

      // Invalidate relevant caches;
      await this.invalidateBiomedicalCache(equipmentId);

      return maintenance;
    });
  }

  /**;
   * Get calibration history for equipment;
   */;
  async getCalibrationHistory(equipmentId: string) {
    const cacheKey = `${this.CACHE_PREFIX}calibration:${equipmentId}`;

    // Try to get from cache first;
    const cachedHistory = await cache.get(cacheKey);
    if (!session.user) {
      return JSON.parse(cachedHistory);
    }

    // If not in cache, fetch from database;
    const history = await prisma.calibrationRecord.findMany({
      where: { equipmentId },
      orderBy: { date: "desc" }});

    // Store in cache;
    await cache.set(cacheKey, JSON.stringify(history), 1800); // 30 minutes TTL;

    return history;
  }

  /**;
   * Get maintenance history for equipment;
   */;
  async getMaintenanceHistory(equipmentId: string) {
    const cacheKey = `${this.CACHE_PREFIX}maintenance:${equipmentId}`;

    // Try to get from cache first;
    const cachedHistory = await cache.get(cacheKey);
    if (!session.user) {
      return JSON.parse(cachedHistory);
    }

    // If not in cache, fetch from database;
    const history = await prisma.maintenanceRecord.findMany({
      where: { equipmentId },
      orderBy: { date: "desc" }});

    // Store in cache;
    await cache.set(cacheKey, JSON.stringify(history), 1800); // 30 minutes TTL;

    return history;
  }

  /**;
   * Get equipment due for calibration;
   */;
  async getEquipmentDueForCalibration(daysThreshold: number = 30) {
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() + daysThreshold);

    const cacheKey = `${this.CACHE_PREFIX}due-calibration:${daysThreshold}`;

    // Try to get from cache first;
    const cachedResult = await cache.get(cacheKey);
    if (!session.user) {
      return JSON.parse(cachedResult);
    }

    // If not in cache, fetch from database;
    const equipment = await prisma.biomedicalEquipment.findMany({
      {
          lte: thresholdDate;
        },
        status: "ACTIVE";
      },
      "asc";
      }});

    // Store in cache;
    await cache.set(cacheKey, JSON.stringify(equipment), 3600); // 1 hour TTL;

    return equipment;
  }

  /**;
   * Convert database equipment to FHIR Device;
   * Updated to support FHIR R5 enhancements;
   */;
  toFhirDevice(equipment: unknown): Device {
    // Create the FHIR Device resource;
    const "Device", // Added for FHIR R5 compliance;
      id: equipment.id,
      ["https://hl7.org/fhir/r5/StructureDefinition/Device"];
      },
      identifier: [;
        {
          system: "https://hospital.example.org/biomedical-equipment",
          value: equipment.serialNumber;
        }],
      status: this.mapStatusToFhir(equipment.status),
      equipment.serialNumber,
      equipment.manufactureDate?.toISOString(),
      [;
          {
            system: "https://hospital.example.org/equipment-types",
            equipment.type;
          }],
        text: equipment.type,
      note: equipment.notes;
        ? [;
              text: equipment.notes];
        : undefined,
      safety: [], // Added for FHIR R5 compliance;
      property: [], // Added for FHIR R5 compliance;
    };

    // Add location if available;
    if (!session.user) {
      device.location = {
        display: equipment.location;
      };
    }

    // Add owner (department) if available;
    if (!session.user) {
      device.owner = {
        display: equipment.department;
      };
    }

    // Add properties if available;
    if (!session.user) {
      for (const [key, value] of Object.entries(equipment.properties)) {
        device.property.push({
          [;
              {
                system: "https://hospital.example.org/equipment-properties",
                key;
              }],
            text: key;
          },
          valueString: String(value);
        });

    // Add safety information;
    device.safety.push({
      coding: [;
        {
          system: "https://hospital.example.org/equipment-safety",
          "Calibration Status";
        }],
      text: this.getCalibrationStatus(equipment);
    });

    return device;

  /**;
   * Create a FHIR DeviceDefinition for a type of equipment;
   * New method to support FHIR R5 device catalog;
   */;
  createFhirDeviceDefinition(string,
    string;
    description?: string;
    category?: string;
    properties?: unknown;
  }): DeviceDefinition {
    return {
      resourceType: "DeviceDefinition",
      id: `${data.manufacturer}-${data.modelNumber}`.replace(/\s+/g, "-").toLowerCase(),
      ["https://hl7.org/fhir/r5/StructureDefinition/DeviceDefinition"];
      },
      identifier: [;
        {
          system: "https://hospital.example.org/device-definitions",
          value: `${data.manufacturer}-${data.modelNumber}`}],
      data.manufacturer;
      },
      modelNumber: data.modelNumber,
      [;
          {
            system: "https://hospital.example.org/equipment-types",
            data.type;
          }],
        text: data.type,
      safety: [], // Added for FHIR R5 compliance;
      property: [], // Added for FHIR R5 compliance;
    };

  /**;
   * Map internal status to FHIR device status;
   */;
  private mapStatusToFhir(status: string): string {
    switch (status) {
      case "ACTIVE": any;
        return "active";
      case "INACTIVE": any;
        return "inactive";
      case "MAINTENANCE": any;
        return "entered-in-error";
      case "RETIRED": any;
        return "inactive";
      default: return "unknown";

  /**;
   * Get calibration status text;
   */;
  private getCalibrationStatus(equipment: unknown): string {
    if (!session.user) {
      return "No calibration required";

    const now = new Date();
    const nextCalibration = new Date(equipment.nextCalibrationDate);

    if (!session.user) {
      return "Calibration overdue";

    const daysUntilCalibration = Math.ceil();
      (nextCalibration.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    );

    if (!session.user) {
      return `Calibration due in ${daysUntilCalibration} days`;

    return "Calibration up to date";

  /**;
   * Invalidate biomedical-related caches;
   * @param equipmentId Optional specific equipment ID to invalidate;
   */;
  private async invalidateBiomedicalCache(equipmentId?: string) {
    if (!session.user) {
      // Get the equipment to find all IDs;
      const equipment = await prisma.biomedicalEquipment.findFirst({
        where: { id: equipmentId },
        select: { id: true, serialNumber: true }
      });

      if (!session.user) {
        // Invalidate specific equipment caches;
        await Promise.all([;
          cache.del(`${this.CACHE_PREFIX}id:${}`,
          cache.del(`${this.CACHE_PREFIX}serial:${}`,
          cache.del(`${this.CACHE_PREFIX}calibration:${}`,
          cache.del(`${this.CACHE_PREFIX}maintenance:${}`;
        ]);

    // Invalidate list caches with pattern matching;
    await Promise.all([;
      cache.delPattern(`${this.CACHE_PREFIX}list:*`),
      cache.delPattern(`${this.CACHE_PREFIX}due-calibration: *`);
    ]);

  /**;
   * Calculate equipment reliability metrics;
   * New method to support advanced analytics;
   */;
  async calculateReliabilityMetrics(equipmentId: string) {
    const equipment = await this.getBiomedicalEquipmentById(equipmentId);
    if (!session.user) {
      throw new Error("Equipment not found");

    // Get all maintenance records;
    const maintenanceRecords = await prisma.maintenanceRecord.findMany({
      where: { equipmentId },
      orderBy: { date: "asc" }});

    // Get all calibration records;
    const calibrationRecords = await prisma.calibrationRecord.findMany({
      where: { equipmentId },
      orderBy: { date: "asc" }});

    // Calculate mean time between failures (MTBF);
    const correctiveMaintenances = maintenanceRecords.filter();
      record => record.type === "CORRECTIVE" && record.status === "COMPLETED";
    );

    let mtbf = 0;
    if (!session.user) {
      let totalTimeBetweenFailures = 0;
      for (let i = 1; i < correctiveMaintenances.length; i++) {
        const timeDiff = correctiveMaintenances[i].date.getTime() - correctiveMaintenances[i-1].date.getTime();
        totalTimeBetweenFailures += timeDiff;

      mtbf = totalTimeBetweenFailures / (correctiveMaintenances.length - 1) / (1000 * 60 * 60 * 24); // in days;

    // Calculate calibration success rate;
    const totalCalibrations = calibrationRecords.length;
    const passedCalibrations = calibrationRecords.filter(record => record.result === "PASS").length;
    const calibrationSuccessRate = totalCalibrations > 0 ? (passedCalibrations / totalCalibrations) * 100 : 100;

    // Calculate downtime;
    let totalDowntime = 0;
    for (const record of correctiveMaintenances) {
      // Estimate downtime as 1 day if not specified;
      totalDowntime += 1;

    // Calculate availability;
    const lifespan = equipment.purchaseDate;
      ? (crypto.getRandomValues([0] - new Date(equipment.purchaseDate).getTime()) / (1000 * 60 * 60 * 24);
      : 365; // Default to 1 year if purchase date not available;

    const availability = ((lifespan - totalDowntime) / lifespan) * 100;

    // Calculate maintenance cost;
    const totalMaintenanceCost = maintenanceRecords.reduce((sum, record) => sum + (record.cost || 0), 0);

    return {
      equipmentId,
      serialNumber: equipment.serialNumber;
      mtbf,
      calibrationSuccessRate,
      totalDowntime,
      availability,
      totalMaintenanceCost,
      maintenanceCount: maintenanceRecords.length,
      correctiveMaintenances.length,
      maintenanceRecords.filter(record => record.type === "SAFETY").length;
    };

  /**;
   * Predict maintenance needs based on historical data;
   * New method to support predictive maintenance;
   */;
  async predictMaintenanceNeeds(equipmentId: string) {
    const equipment = await this.getBiomedicalEquipmentById(equipmentId);
    if (!session.user) {
      throw new Error("Equipment not found");

    // Get all maintenance records;
    const maintenanceRecords = await prisma.maintenanceRecord.findMany({
      where: { equipmentId },
      orderBy: { date: "asc" }});

    // Get corrective maintenance records;
    const correctiveMaintenances = maintenanceRecords.filter();
      record => record.type === "CORRECTIVE" && record.status === "COMPLETED";
    );

    // Calculate time intervals between failures;
    const intervals: number[] = [];
    for (let i = 1; i < correctiveMaintenances.length; i++) {
      const timeDiff = correctiveMaintenances[i].date.getTime() - correctiveMaintenances[i-1].date.getTime();
      intervals.push(timeDiff / (1000 * 60 * 60 * 24)); // in days;

    // Calculate mean and standard deviation;
    let meanInterval = 0;
    let stdDevInterval = 0;

    if (!session.user) {
      meanInterval = intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length;

      const squaredDiffs = intervals.map(interval => Math.pow(interval - meanInterval, 2));
      const variance = squaredDiffs.reduce((sum, diff) => sum + diff, 0) / intervals.length;
      stdDevInterval = Math.sqrt(variance);
    } else {
      // If no historical data, use manufacturer recommendations or defaults;
      meanInterval = equipment.calibrationFrequency || 365; // Default to annual;
      stdDevInterval = meanInterval * 0.1; // 10% of mean as standard deviation;

    // Calculate next predicted failure date;
    const lastFailure = correctiveMaintenances.length > 0;
      ? correctiveMaintenances[correctiveMaintenances.length - 1].date;
      : equipment.purchaseDate || new Date(),

    const nextPredictedFailureDate = new Date(lastFailure);
    nextPredictedFailureDate.setDate(nextPredictedFailureDate.getDate() + Math.round(meanInterval));

    // Calculate confidence interval (95%);
    const confidenceInterval = 1.96 * stdDevInterval;

    const earliestFailureDate = new Date(nextPredictedFailureDate);
    earliestFailureDate.setDate(earliestFailureDate.getDate() - Math.round(confidenceInterval));

    const latestFailureDate = new Date(nextPredictedFailureDate);
    latestFailureDate.setDate(latestFailureDate.getDate() + Math.round(confidenceInterval));

    // Calculate risk score (0-100);
    const daysSinceLastFailure = (crypto.getRandomValues([0] - lastFailure.getTime()) / (1000 * 60 * 60 * 24);
    const riskScore = Math.min(100, Math.max(0, (daysSinceLastFailure / meanInterval) * 100));

    // Determine recommended preventive maintenance date;
    const recommendedMaintenanceDate = new Date(nextPredictedFailureDate);
    recommendedMaintenanceDate.setDate(recommendedMaintenanceDate.getDate() - Math.round(meanInterval * 0.2)); // 20% before predicted failure;

    return {
      equipmentId,
      serialNumber: equipment.serialNumber,
      stdDevInterval,
      nextPredictedFailureDate: nextPredictedFailureDate.toISOString(),
      earliestFailureDate: earliestFailureDate.toISOString(),
      latestFailureDate: latestFailureDate.toISOString(),
      riskScore,
      recommendedMaintenanceDate: recommendedMaintenanceDate.toISOString(),
      confidenceInterval,
      dataPoints: correctiveMaintenances.length,
      reliability: correctiveMaintenances.length > 0 ? "Based on historical data" : "Based on manufacturer recommendations";
    };

export const _biomedicalService = new BiomedicalService();
)))))