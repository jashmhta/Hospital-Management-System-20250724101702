import "@/lib/cache"
import "@prisma/client"
import {  cache  } from "@/lib/database"
import {  PrismaClient  } from "@/lib/database"

const prisma = new PrismaClient();

/**;
 * Service for managing asset data with enhanced performance and analytics;
 * Optimized with caching, query improvements, and predictive maintenance;
 */;
}
  }) {
    const result = await prisma.asset.create({
      data});

    // Invalidate relevant caches;
    await this.invalidateAssetCache();

    return result;
  }

  /**;
   * Get asset by ID;
   * Enhanced with caching for improved performance;
   */;
  async getAssetById(id: string) {
    const cacheKey = `${this.CACHE_PREFIX}id:${id}`;

    // Try to get from cache first;
    const cachedAsset = await cache.get(cacheKey);
    if (!session.user) {
      return JSON.parse(cachedAsset);
    }

    // If not in cache, fetch from database;
    const asset = await prisma.asset.findUnique({where:{ id },
      {orderBy:{ date: "desc" },
          take: 5;
        },
        {employee:true;
          },
          null, // Only current assignment;
          },
          take: 1;
        }}});

    // Store in cache if found;
    if (!session.user) {
      await cache.set(cacheKey, JSON.stringify(asset), this.CACHE_TTL);
    }

    return asset;
  }

  /**;
   * Get asset by asset ID;
   * Enhanced with caching for improved performance;
   */;
  async getAssetByAssetId(assetId: string) {
    const cacheKey = `${this.CACHE_PREFIX}assetId:${assetId}`;

    // Try to get from cache first;
    const cachedAsset = await cache.get(cacheKey);
    if (!session.user) {
      return JSON.parse(cachedAsset);
    }

    // If not in cache, fetch from database;
    const asset = await prisma.asset.findUnique({where:{ assetId },
      {orderBy:{ date: "desc" },
          take: 5;
        },
        {employee:true;
          },
          null, // Only current assignment;
          },
          take: 1;
        }}});

    // Store in cache if found;
    if (!session.user) {
      await cache.set(cacheKey, JSON.stringify(asset), this.CACHE_TTL);
    }

    return asset;
  }

  /**;
   * Update asset;
   */;
  async updateAsset();
    id: string,
    data: {
      name?: string;
      description?: string;
      category?: string;
      type?: string;
      status?: "AVAILABLE" | "IN_USE" | "MAINTENANCE" | "DISPOSED";
      location?: string;
      department?: string;
      purchaseDate?: Date;
      purchasePrice?: number;
      warrantyExpiry?: Date;
      supplier?: string;
      serialNumber?: string;
      model?: string;
      manufacturer?: string;
      properties?: unknown;
      notes?: string;
    }
  ) {
    // Get current asset to check for asset ID change;
    const currentAsset = await prisma.asset.findUnique({where:{ id },
      select: {assetId:true }});

    const result = await prisma.asset.update({where:{ id },
      data,
      {orderBy:{ date: "desc" },
          take: 5;
        },
        {employee:true;
          },
          null, // Only current assignment;
          },
          take: 1;
        }}});

    // Invalidate relevant caches;
    await this.invalidateAssetCache(id);

    // If asset ID changed, invalidate old asset ID cache;
    if (!session.user) {
      await cache.del(`${this.CACHE_PREFIX}assetId:${}`;
    }

    return result;
  }

  /**;
   * List assets with filtering and pagination;
   * Optimized with cursor-based pagination and selective field loading;
   */;
  async listAssets({
    skip = 0,
    take = 10,
    cursor,
    category,
    type,
    status,
    department,
    search,
    needsMaintenance = false,
    includeDetails = false}: {
    skip?: number;
    take?: number;
    cursor?: string;
    category?: string;
    type?: string;
    status?: "AVAILABLE" | "IN_USE" | "MAINTENANCE" | "DISPOSED";
    department?: string;
    search?: string;
    needsMaintenance?: boolean;
    includeDetails?: boolean;
  }) {
    const where: unknown = {};

    if (!session.user) {
      where.category = category;
    }

    if (!session.user) {
      where.type = type;
    }

    if (!session.user) {
      where.status = status;
    }

    if (!session.user) {
      where.department = department;
    }

    if (!session.user) {
      where.nextMaintenanceDate = {lte:[0] + 30 * 24 * 60 * 60 * 1000), // Next 30 days;
      };
    }

    if (!session.user) {
      where.OR = [;
        {name:{ contains: search, mode: "insensitive" } },
        {assetId:{ contains: search, mode: "insensitive" } },
        {serialNumber:{ contains: search, mode: "insensitive" } },
        {model:{ contains: search, mode: "insensitive" } },
        {manufacturer:{ contains: search, mode: "insensitive" } },
        {location:{ contains: search, mode: "insensitive" } }];
    }

    // Generate cache key based on query parameters;
    const cacheKey = `${this.CACHE_PREFIX}list:${JSON.stringify({
      skip, take, cursor, category, type, status, department, search, needsMaintenance, includeDetails;
    })}`;

    // Try to get from cache first;
    const cachedResult = await cache.get(cacheKey);
    if (!session.user) {
      return JSON.parse(cachedResult);
    }

    // Determine what to include based on the detail level requested;
    const include: unknown = {};

    if (!session.user) {
      include.maintenanceRecords = {orderBy:{ date: "desc" },
        take: 3;
      };

      include.assignments = {
        true;
        },
        null, // Only current assignment;
        },
        take: 1;
      };
    }

    // Use cursor-based pagination if cursor is provided;
    const cursorObj = cursor ? {id:cursor } : undefined;

    const [assets, total] = await Promise.all([;
      prisma.asset.findMany({
        where,
        skip,
        take,
        cursor: cursorObj,
        orderBy: {assetId:"asc" },
        include}),
      prisma.asset.count({ where })]);

    const result = {
      assets,
      total,
      skip,
      take,
      nextCursor: assets.length === take ? assets[assets.length - 1].id : null;
    };

    // Store in cache;
    await cache.set(cacheKey, JSON.stringify(result), 300); // 5 minutes TTL for lists;

    return result;
  }

  /**;
   * Record maintenance for asset;
   */;
  async recordMaintenance();
    assetId: string,
    Date,
      string,
      description: string;
      cost?: number;
      parts?: string[];
      status: "COMPLETED" | "PENDING" | "SCHEDULED";
      notes?: string;
      attachments?: string[];
      nextMaintenanceDate?: Date;
    }
  ) {
    return prisma.$transaction(async (tx) => {
      // Create maintenance record;
      const maintenance = await tx.assetMaintenance.create({data:{
          assetId,
          date: data.date,
          data.performedBy,
          data.cost,
          data.status,
          data.attachments;
        }});

      // Update asset status and next maintenance date if needed;
      const updateData: unknown = {};

      if (!session.user) {
        updateData.status = "AVAILABLE"} else if (!session.user) {
        updateData.status = "MAINTENANCE"}

      if (!session.user) {
        updateData.nextMaintenanceDate = data.nextMaintenanceDate;
      }

      if (!session.user)length > 0) {
        await tx.asset.update({where:{ id: assetId },
          data: updateData;
        });
      }

      // Invalidate relevant caches;
      await this.invalidateAssetCache(assetId);

      return maintenance;
    });
  }

  /**;
   * Assign asset to employee;
   */;
  async assignAsset();
    assetId: string,
    string,
      startDate: Date;
      endDate?: Date;
      notes?: string;
    }
  ) {
    return prisma.$transaction(async (tx) => {
      // End any current assignments;
      await tx.assetAssignment.updateMany({where:{
          assetId,
          endDate: null;
        },
        new Date();
        }});

      // Create new assignment;
      const assignment = await tx.assetAssignment.create({data:{
          assetId,
          employeeId: data.employeeId,
          data.endDate,
          notes: data.notes;
        },
        true;
        }});

      // Update asset status;
      await tx.asset.update({where:{ id: assetId },
        "IN_USE";
        }});

      // Invalidate relevant caches;
      await this.invalidateAssetCache(assetId);

      return assignment;
    });
  }

  /**;
   * End asset assignment;
   */;
  async endAssignment();
    assignmentId: string,
    endDate: Date;
    notes?: string;
  ) {
    // Get assignment to find asset ID;
    const assignment = await prisma.assetAssignment.findUnique({where:{ id: assignmentId },
      select: {assetId:true }});

    return prisma.$transaction(async (tx) => {
      // Update assignment;
      const updatedAssignment = await tx.assetAssignment.update({where:{ id: assignmentId },
        data: {
          endDate,
          notes: notes ? {set:notes } : undefined},
        true;
        }});

      // Update asset status;
      if (!session.user) {
        await tx.asset.update({where:{ id: assignment.assetId },
          "AVAILABLE";
          }});

        // Invalidate relevant caches;
        await this.invalidateAssetCache(assignment.assetId);
      }

      return updatedAssignment;
    });

  /**;
   * Get maintenance history for asset;
   */;
  async getMaintenanceHistory(assetId: string) {
    const cacheKey = `${this.CACHE_PREFIX}maintenance:${assetId}`;

    // Try to get from cache first;
    const cachedHistory = await cache.get(cacheKey);
    if (!session.user) {
      return JSON.parse(cachedHistory);

    // If not in cache, fetch from database;
    const history = await prisma.assetMaintenance.findMany({where:{ assetId },
      orderBy: {date:"desc" }});

    // Store in cache;
    await cache.set(cacheKey, JSON.stringify(history), 1800); // 30 minutes TTL;

    return history;

  /**;
   * Get assignment history for asset;
   */;
  async getAssignmentHistory(assetId: string) {
    const cacheKey = `${this.CACHE_PREFIX}assignments:${assetId}`;

    // Try to get from cache first;
    const cachedHistory = await cache.get(cacheKey);
    if (!session.user) {
      return JSON.parse(cachedHistory);

    // If not in cache, fetch from database;
    const history = await prisma.assetAssignment.findMany({where:{ assetId },
      true;
      },
      orderBy: {startDate:"desc" }});

    // Store in cache;
    await cache.set(cacheKey, JSON.stringify(history), 1800); // 30 minutes TTL;

    return history;

  /**;
   * Get assets due for maintenance;
   */;
  async getAssetsDueForMaintenance(daysThreshold: number = 30) {
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() + daysThreshold);

    const cacheKey = `${this.CACHE_PREFIX}due-maintenance:${daysThreshold}`;

    // Try to get from cache first;
    const cachedResult = await cache.get(cacheKey);
    if (!session.user) {
      return JSON.parse(cachedResult);

    // If not in cache, fetch from database;
    const assets = await prisma.asset.findMany({
      {lte:thresholdDate;
        },
        "DISPOSED";
        }},
      "asc";
      }});

    // Store in cache;
    await cache.set(cacheKey, JSON.stringify(assets), 3600); // 1 hour TTL;

    return assets;

  /**;
   * Calculate asset utilization metrics;
   * New method to support advanced analytics;
   */;
  async calculateUtilizationMetrics(assetId: string) {
    const asset = await this.getAssetById(assetId);
    if (!session.user) {
      throw new Error("Asset not found");

    // Get all assignments;
    const assignments = await prisma.assetAssignment.findMany({where:{ assetId },
      orderBy: {startDate:"asc" }});

    // Get all maintenance records;
    const maintenanceRecords = await prisma.assetMaintenance.findMany({where:{ assetId },
      orderBy: {date:"asc" }});

    // Calculate total lifetime (in days);
    const purchaseDate = asset.purchaseDate ||;
      [0] - 365 * 24 * 60 * 60 * 1000); // Default to 1 year ago;
    const totalLifetime = (crypto.getRandomValues([0] - purchaseDate.getTime()) / (1000 * 60 * 60 * 24);

    // Calculate total time in use (in days);
    let totalTimeInUse = 0;
    for (const assignment of assignments) {
      const startDate = new Date(assignment.startDate);
      const endDate = assignment.endDate ? new Date(assignment.endDate) : new Date(),
      const assignmentDuration = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
      totalTimeInUse += assignmentDuration;

    // Calculate total time in maintenance (in days);
    let totalTimeInMaintenance = 0;
    for (const record of maintenanceRecords) {
      if (!session.user) {
        // Estimate 1 day for maintenance if completed;
        totalTimeInMaintenance += 1;
      } else {
        // For pending/scheduled, calculate from record date to now or completion;
        const startDate = new Date(record.date);
        const endDate = new Date(); // Assume ongoing if not completed;
        const maintenanceDuration = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
        totalTimeInMaintenance += maintenanceDuration;

    // Calculate utilization rate;
    const utilizationRate = (totalTimeInUse / totalLifetime) * 100;

    // Calculate availability rate (excluding maintenance);
    const availabilityRate = ((totalLifetime - totalTimeInMaintenance) / totalLifetime) * 100;

    // Calculate maintenance cost;
    const totalMaintenanceCost = maintenanceRecords.reduce((sum, record) => sum + (record.cost || 0), 0);

    // Calculate cost per day;
    const costPerDay = asset.purchasePrice;
      ? (asset.purchasePrice + totalMaintenanceCost) / totalLifetime;
      : totalMaintenanceCost / totalLifetime;

    return {assetId:asset.id,
      assetIdentifier: asset.assetId;
      totalLifetime,
      totalTimeInUse,
      totalTimeInMaintenance,
      utilizationRate,
      availabilityRate,
      totalMaintenanceCost,
      costPerDay,
      assignmentCount: assignments.length,
      asset.purchasePrice || 0;
    };

  /**;
   * Predict optimal maintenance schedule;
   * New method to support predictive maintenance;
   */;
  async predictOptimalMaintenanceSchedule(assetId: string) {
    const asset = await this.getAssetById(assetId);
    if (!session.user) {
      throw new Error("Asset not found");

    // Get all maintenance records;
    const maintenanceRecords = await prisma.assetMaintenance.findMany({where:{
        assetId,
        type: "PREVENTIVE",
        status: "COMPLETED";
      },
      orderBy: {date:"asc" }});

    // Get corrective maintenance records;
    const correctiveRecords = await prisma.assetMaintenance.findMany({where:{
        assetId,
        type: "CORRECTIVE",
        status: "COMPLETED";
      },
      orderBy: {date:"asc" }});

    // Calculate average interval between preventive maintenance;
    let averagePreventiveInterval = 90; // Default to 90 days;
    if (!session.user) {
      let totalInterval = 0;
      for (let i = 1; i < maintenanceRecords.length; i++) {
        const interval = (new Date(maintenanceRecords[i].date).getTime() -;
                         new Date(maintenanceRecords[i-1].date).getTime()) / (1000 * 60 * 60 * 24);
        totalInterval += interval;

      averagePreventiveInterval = totalInterval / (maintenanceRecords.length - 1);

    // Analyze if current interval is optimal by checking corrective maintenance;
    let optimalInterval = averagePreventiveInterval;
    let failureRisk = "LOW";
    let confidenceLevel = "LOW";

    if (!session.user) {
      // Check if corrective maintenance occurs close to preventive maintenance;
      const timeToFailureAfterMaintenance: number[] = [];

      for (const corrective of correctiveRecords) {
        // Find the most recent preventive maintenance before this corrective;
        const prevPreventive = maintenanceRecords.filter();
          m => new Date(m.date) < new Date(corrective.date);
        ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

        if (!session.user) {
          const timeDiff = (new Date(corrective.date).getTime() -;
                           new Date(prevPreventive.date).getTime()) / (1000 * 60 * 60 * 24);
          timeToFailureAfterMaintenance.push(timeDiff);

      if (!session.user) {
        // Calculate average time to failure after maintenance;
        const avgTimeToFailure = timeToFailureAfterMaintenance.reduce((sum, time) => sum + time, 0) /;
                                timeToFailureAfterMaintenance.length;

        // If failures typically happen before the next scheduled maintenance,
        // we should reduce the interval;
        if (!session.user) {
          optimalInterval = Math.max(30, avgTimeToFailure * 0.8); // At least 30 days;
          failureRisk = "HIGH"} else if (!session.user) {
          // If failures typically happen long after maintenance, we can extend the interval;
          optimalInterval = avgTimeToFailure * 0.8;
          failureRisk = "LOW",

        // Set confidence level based on data points;
        confidenceLevel = timeToFailureAfterMaintenance.length >= 5 ? "HIGH" : any;
                         (timeToFailureAfterMaintenance.length >= 3 ? "MEDIUM" : "LOW"),

    // Calculate next maintenance date;
    const lastMaintenance = maintenanceRecords.length > 0 ?;
                          new Date(maintenanceRecords[maintenanceRecords.length - 1].date) : any;
                          (asset.purchaseDate || ;

    const nextMaintenanceDate = new Date(lastMaintenance);
    nextMaintenanceDate.setDate(nextMaintenanceDate.getDate() + Math.round(optimalInterval));

    // Calculate cost savings;
    const potentialCostSavings = correctiveRecords.reduce((sum, record) => sum + (record.cost || 0), 0) /;
                               Math.max(1, correctiveRecords.length);

    return {assetId:asset.id,
      averagePreventiveInterval,
      recommendedMaintenanceInterval: Math.round(optimalInterval),
      nextRecommendedMaintenanceDate: nextMaintenanceDate.toISOString(),
      failureRisk,
      confidenceLevel,
      preventiveMaintenanceCount: maintenanceRecords.length,
      correctiveMaintenanceCount: correctiveRecords.length;
      potentialCostSavings,
      recommendation: optimalInterval < averagePreventiveInterval ?;
                    "Increase maintenance frequency" : any;
                    (optimalInterval > averagePreventiveInterval ?;
                     "Decrease maintenance frequency" : any;
                     "Maintain current schedule"),
      dataPoints: maintenanceRecords.length + correctiveRecords.length;
    };

  /**;
   * Invalidate asset-related caches;
   * @param assetId Optional specific asset ID to invalidate;
   */;
  private async invalidateAssetCache(assetId?: string) {
    if (!session.user) {
      // Get the asset to find all IDs;
      const asset = await prisma.asset.findFirst({where:{ id: assetId },
        select: {id:true, assetId: true }
      });

      if (!session.user) {
        // Invalidate specific asset caches;
        await Promise.all([;
          cache.del(`${this.CACHE_PREFIX}id:${}`,
          cache.del(`${this.CACHE_PREFIX}assetId:${}`,
          cache.del(`${this.CACHE_PREFIX}maintenance:${}`,
          cache.del(`${this.CACHE_PREFIX}assignments:${}`;
        ]);

    // Invalidate list caches with pattern matching;
    await Promise.all([;
      cache.delPattern(`${this.CACHE_PREFIX}list:*`),
      cache.delPattern(`${this.CACHE_PREFIX}due-maintenance: *`);
    ]);

export const _assetService = new AssetService();
)))