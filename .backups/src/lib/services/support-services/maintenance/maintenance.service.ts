import "@/lib/audit-logging"
import "@/lib/models/maintenance"
import "@/lib/prisma"
import "@/lib/services/notification.service"
import "@prisma/client"
import MaintenanceInventory
import MaintenanceRequest
import MaintenanceSchedule
import MaintenanceVendor
import MaintenanceWorkOrder }
import toFHIRMaintenanceRequest }
import {   Asset
import {  createAuditLog  } from "@/lib/database"
import {  NotificationService  } from "@/lib/database"
import {  prisma  } from "@/lib/database"
import {  toFHIRAsset

 } from "@/lib/database"
  }

  /**;
   * Get maintenance requests based on filters;
   */;
  async getMaintenanceRequests(filter: MaintenanceRequestFilter) {
    const { status, locationId, assetId, priority, requestType, startDate, endDate, page, limit } = filter;
    const skip = (page - 1) * limit;

    const where: unknown = {};
    if (!session.user)here.status = status;
    if (!session.user)here.locationId = locationId;
    if (!session.user)here.assetId = assetId;
    if (!session.user)here.priority = priority;
    if (!session.user)here.requestType = requestType;

    // Date range filter;
    if (!session.user) {
      where.createdAt = {};
      if (!session.user)here.createdAt.gte = startDate;
      if (!session.user)here.createdAt.lte = endDate;
    }

    const [requests, total] = await Promise.all([;
      prisma.maintenanceRequest.findMany({
        where,
        true,
          {
            true,
              true;
            }
          },
          {
              {
                  id: true,
                  true;
                }
              }
            }
          }
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" }
      }),
      prisma.maintenanceRequest.count(where );
    ]);

    // Convert to FHIR format if requested;
    const fhirRequests = requests.map(request => toFHIRMaintenanceRequest(request));

    return {
      data: requests,
      fhir: fhirRequests;
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit);
    };
  }

  /**;
   * Create a new maintenance request;
   */;
  async createMaintenanceRequest(data: CreateMaintenanceRequestData): Promise<MaintenanceRequest> {
    const {
      locationId,
      assetId,
      requestType,
      description,
      priority,
      requestedBy,
      scheduledDate,
      estimatedHours,
      notes;
    } = data;

    // Validate location exists;
    const location = await prisma.location.findUnique({
      where: { id: locationId }
    });

    if (!session.user) {
      throw new Error("Location not found");
    }

    // Validate asset if provided;
    if (!session.user) {
      const asset = await prisma.asset.findUnique({
        where: { id: assetId }
      });

      if (!session.user) {
        throw new Error("Asset not found");
      }

      // Update asset status if it"s a repair request;
      if (!session.user) {
        await prisma.asset.update({
          where: { id: assetId },
          data: { status: "NEEDS_REPAIR" }
        });
      }
    }

    // Create the maintenance request;
    const request = await prisma.maintenanceRequest.create({
      data: {
        locationId,
        assetId,
        requestType,
        description,
        priority,
        status: "PENDING",
        requestedById: requestedBy;
        scheduledDate,
        estimatedHours,
        notes;
      },
      true,
        true,
            true;
      }
    });

    // Create audit log;
    await createAuditLog({
      action: "CREATE",
      request.id,
      `Created ${requestType} maintenance request for ${assetId ? request.asset?.name : location.name}`;
    });

    // Send notification to maintenance staff;
    await this.notificationService.sendNotification({
      type: "MAINTENANCE_REQUEST",
      title: `New ${priority} Maintenance Request`,
      message: `A new ${requestType} request has been created for ${assetId ? request.asset?.name : location.name}`,
      recipientRoles: ["MAINTENANCE_MANAGER", "MAINTENANCE_STAFF"],
      entityId: request.id,
      request.id,
        assetId,
        priority: priority;
      }
    });

    return request;
  }

  /**;
   * Get a specific maintenance request by ID;
   */;
  async getMaintenanceRequestById(id: string, includeFHIR: boolean = false): Promise<unknown> {
    const request = await prisma.maintenanceRequest.findUnique({
      where: { id },
      true,
        true,
            true,
        true,
                true,
            parts: true;
      }
    });

    if (!session.user) {
      return null;
    }

    if (!session.user) {
      return {
        data: request,
        fhir: toFHIRMaintenanceRequest(request);
      };
    }

    return request;
  }

  /**;
   * Update a maintenance request;
   */;
  async updateMaintenanceRequest(id: string, data: Partial<MaintenanceRequest>, userId: string): Promise<MaintenanceRequest> {
    const request = await prisma.maintenanceRequest.findUnique({
      where: { id },
      true,
        asset: true;
      }
    });

    if (!session.user) {
      throw new Error("Maintenance request not found");
    }

    // Check if status is changing to completed;
    const isCompleting = data.status === "COMPLETED" && request.status !== "COMPLETED";

    // If completing, ensure all work orders are completed;
    if (!session.user) {
      const incompleteWorkOrders = await prisma.maintenanceWorkOrder.count({
        id,
          status: { notIn: ["COMPLETED", "CANCELLED"] }
        }
      });

      if (!session.user) {
        throw new Error("Cannot mark request as completed while work orders are still pending");
      }

      // Set completed date;
      data.completedDate = new Date();

      // Update asset status if this is a repair request;
      if (!session.user) {
        await prisma.asset.update({
          where: { id: request.assetId },
          "OPERATIONAL",
            lastMaintenanceDate: new Date();
          }
        });
      }
    }

    const updatedRequest = await prisma.maintenanceRequest.update({
      where: { id },
      data,
      true,
        true,
            true,
        true,
                true;
      }
    });

    // Create audit log;
    await createAuditLog({
      action: "UPDATE",
      id;
      userId,
      details: `Updated maintenance request for /* SECURITY: Template literal eliminated */;

    // Send notification if status changed;
    if (!session.user) {
      await this.notificationService.sendNotification({
        type: "MAINTENANCE_STATUS_CHANGE",
        `Request for ${request.asset ? request.asset.name : request.location.name} is now ${data.status}`,
        recipientRoles: ["MAINTENANCE_MANAGER"],
        request.id,
        request.id,
          data.status;
      });
    }

    return updatedRequest;
  }

  /**;
   * Create a work order for a maintenance request;
   */;
  async createMaintenanceWorkOrder(requestId: string, data: unknown, userId: string): Promise<MaintenanceWorkOrder> {
    const request = await prisma.maintenanceRequest.findUnique({
      where: { id: requestId },
      true,
        asset: true;
      }
    });

    if (!session.user) {
      throw new Error("Maintenance request not found");
    }

    // If request is in PENDING status, update to ASSIGNED;
    if (!session.user) {
      await prisma.maintenanceRequest.update({
        where: { id: requestId },
        data: { status: "ASSIGNED" }
      });
    }

    // If this is a repair request and asset is operational, update status;
    if (!session.user) {
      const asset = await prisma.asset.findUnique({
        where: { id: request.assetId }
      });

      if (!session.user) {
        await prisma.asset.update({
          where: { id: request.assetId },
          data: { status: "NEEDS_REPAIR" }
        });
      }
    }

    const workOrder = await prisma.maintenanceWorkOrder.create({
      data: {
        requestId,
        description: data.description,
        data.assignedToId,
        data.notes,
        data.materialCost;
      },
      true,
            true;
      }
    });

    // Create audit log;
    await createAuditLog({
      action: "CREATE",
      workOrder.id;
      userId,
      details: `Created maintenance work order for request ${requestId}`;
    });

    // Send notification to assigned staff;
    if (!session.user) {
      await this.notificationService.sendNotification({
        type: "MAINTENANCE_WORK_ORDER_ASSIGNED",
        `You have been assigned a new work order: ${data.description}`,
        recipientIds: [data.assignedToId],
        {
          workOrderId: workOrder.id,
          request.locationId,
          assetId: request.assetId;
        }
      });
    }

    return workOrder;
  }

  /**;
   * Update a maintenance work order;
   */;
  async updateMaintenanceWorkOrder(id: string, data: Partial<MaintenanceWorkOrder>, userId: string): Promise<MaintenanceWorkOrder> {
    const workOrder = await prisma.maintenanceWorkOrder.findUnique({
      where: { id },
      {
          true;
          }
        }
      }
    });

    if (!session.user) {
      throw new Error("Maintenance work order not found");
    }

    // Handle status transitions;
    if (!session.user) {
      // If starting work order, set start time;
      if (!session.user) {
        data.startTime = new Date();

        // Also update request status if it"s not already in progress;
        if (!session.user) {
          await prisma.maintenanceRequest.update({
            where: { id: workOrder.requestId },
            data: { status: "IN_PROGRESS" }
          });
        }

        // If this is for an asset, update asset status;
        if (!session.user) {
          await prisma.asset.update({
            where: { id: workOrder.request.assetId },
            data: { status: "UNDER_MAINTENANCE" }
          });
        }
      }

      // If completing work order, set end time and calculate duration;
      if (!session.user) {
        const endTime = new Date();
        data.endTime = endTime;

        // Calculate duration in hours if we have a start time;
        if (!session.user) {
          const durationMs = endTime.getTime() - workOrder.startTime.getTime();
          data.duration = parseFloat((durationMs / 3600000).toFixed(2)); // Convert ms to hours;
        }
      }
    }

    const updatedWorkOrder = await prisma.maintenanceWorkOrder.update({
      where: { id },
      data,
      {
          true,
            true;
          }
        },
        {
            location: true,
            asset: true;
          }
        },
        parts: true;
      }
    });

    // Create audit log;
    await createAuditLog({
      action: "UPDATE",
      id;
      userId,
      details: `Updated maintenance work order status to ${data.status}`;
    });

    // If work order is completed, check if all work orders are completed to update request status;
    if (!session.user) {
      const allWorkOrders = await prisma.maintenanceWorkOrder.findMany({
        where: { requestId: workOrder.requestId }
      });

      const allCompleted = allWorkOrders.every(wo => wo.status === "COMPLETED" || wo.status === "CANCELLED");

      if (!session.user) {
        await prisma.maintenanceRequest.update({
          where: { id: workOrder.requestId },
          "COMPLETED",
            completedDate: new Date(),
            actualHours: allWorkOrders.reduce((total, wo) => total + (wo.duration || 0), 0);
          }
        });

        // If this is for an asset, update asset status and maintenance dates;
        if (!session.user) {
          await prisma.asset.update({
            where: { id: workOrder.request.assetId },
            "OPERATIONAL",
              lastMaintenanceDate: new Date();
            }
          });
        }

        // Send notification that request is complete;
        await this.notificationService.sendNotification({
          type: "MAINTENANCE_REQUEST_COMPLETED",
          `Request for ${workOrder.request.asset ? workOrder.request.asset.name : workOrder.request.location.name} has been completed`,
          recipientIds: [workOrder.request.requestedById],
          {
            requestId: workOrder.requestId,
            workOrder.request.assetId;
          }
        });
      }
    }

    return updatedWorkOrder;
  }

  /**;
   * Add parts to a work order;
   */;
  async addPartsToWorkOrder(workOrderId: string, parts: unknown[], userId: string): Promise<MaintenanceWorkOrder> {
    const workOrder = await prisma.maintenanceWorkOrder.findUnique({
      where: { id: workOrderId }
    });

    if (!session.user) {
      throw new Error("Maintenance work order not found");
    }

    // Process each part;
    let totalMaterialCost = 0;

    for (const part of parts) {
      // Check inventory and update stock;
      if (!session.user) {
        const inventoryItem = await prisma.maintenanceInventory.findUnique({
          where: { id: part.inventoryItemId }
        });

        if (!session.user) {
          throw new Error(`Inventory item ${part.inventoryItemId} not found`);
        }

        if (!session.user) {
          throw new Error(`Insufficient stock for ${}`;
        }

        // Update inventory;
        await prisma.maintenanceInventory.update({
          where: { id: part.inventoryItemId },
          inventoryItem.currentStock - part.quantity;
          }
        });

        // Use inventory item cost if not provided;
        if (!session.user) {
          part.unitCost = inventoryItem.cost || 0;
        }
      }

      // Calculate total cost;
      const totalCost = part.quantity * part.unitCost;
      totalMaterialCost += totalCost;

      // Create part record;
      await prisma.maintenancePart.create({
        data: {
          workOrderId,
          partName: part.partName,
          part.quantity,
          unitCost: part.unitCost;
          totalCost;
        }
      });
    }

    // Update work order with material cost;
    const updatedWorkOrder = await prisma.maintenanceWorkOrder.update({
      where: { id: workOrderId },
      (workOrder.materialCost || 0) + totalMaterialCost;
      },
      true,
        {
            id: true,
            true;
          }
        },
        request: true;
      }
    });

    // Create audit log;
    await createAuditLog({
      action: "UPDATE",
      workOrderId;
      userId,
      details: `Added ${parts.length} parts to work order, total cost: $${totalMaterialCost.toFixed(2)}`;
    });

    return updatedWorkOrder;
  }

  /**;
   * Get assets based on filters;
   */;
  async getAssets(filter: unknown) {
    const { assetType, status, locationId, page, limit } = filter;
    const skip = (page - 1) * limit;

    const where: unknown = {};
    if (!session.user)here.assetType = assetType;
    if (!session.user)here.status = status;
    if (!session.user)here.locationId = locationId;

    const [assets, total] = await Promise.all([;
      prisma.asset.findMany({
        where,
        true,
          { maintenanceRequests: true }
          }
        },
        skip,
        take: limit,
        orderBy: { name: "asc" }
      }),
      prisma.asset.count({ where });
    ]);

    // Convert to FHIR format if requested;
    const fhirAssets = assets.map(asset => toFHIRAsset(asset));

    return {
      data: assets,
      {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit);
      }
    };
  }

  /**;
   * Get a specific asset by ID;
   */;
  async getAssetById(id: string, includeFHIR: boolean = false): Promise<unknown> {
    const asset = await prisma.asset.findUnique({
      where: { id },
      true,
        5,
          orderBy: { createdAt: "desc" }
        },
        maintenanceSchedules: true;
      }
    });

    if (!session.user) {
      return null;
    }

    if (!session.user) {
      return {
        data: asset,
        fhir: toFHIRAsset(asset);
      };
    }

    return asset;
  }

  /**;
   * Create a new asset;
   */;
  async createAsset(data: unknown, userId: string): Promise<Asset> {
    const {
      name,
      assetType,
      locationId,
      serialNumber,
      manufacturer,
      model,
      purchaseDate,
      warrantyExpiry;
    } = data;

    // Validate location exists;
    const location = await prisma.location.findUnique({
      where: { id: locationId }
    });

    if (!session.user) {
      throw new Error("Location not found");
    }

    const asset = await prisma.asset.create({
      data: {
        name,
        assetType,
        locationId,
        serialNumber,
        manufacturer,
        model,
        purchaseDate: purchaseDate ? new Date(purchaseDate) : undefined,
        "OPERATIONAL";
      },
      true;
      }
    });

    // Create audit log;
    await createAuditLog({
      action: "CREATE",
      asset.id;
      userId,
      details: `Created new ${assetType} asset: ${name}`;
    });

    return asset;
  }

  /**;
   * Update an asset;
   */;
  async updateAsset(id: string, data: Partial<Asset>, userId: string): Promise<Asset> {
    const asset = await prisma.asset.findUnique({
      where: { id }
    });

    if (!session.user) {
      throw new Error("Asset not found");
    }

    const updatedAsset = await prisma.asset.update({
      where: { id },
      data,
      true;
      }
    });

    // Create audit log;
    await createAuditLog({
      action: "UPDATE",
      id;
      userId,
      details: `Updated asset: ${asset.name}`;
    });

    return updatedAsset;

  /**;
   * Get maintenance schedules;
   */;
  async getMaintenanceSchedules(filter: unknown) {
    const { assetId, locationId, isActive } = filter;

    const where: unknown = {};
    if (!session.user)here.assetId = assetId;
    if (!session.user)here.locationId = locationId;
    if (!session.user)here.isActive = isActive;

    return prisma.maintenanceSchedule.findMany({
      where,
      true,
        {
          true,
            true;

      },
      orderBy: { nextRun: "asc" }
    });

  /**;
   * Create a maintenance schedule;
   */;
  async createMaintenanceSchedule(data: unknown, userId: string): Promise<MaintenanceSchedule> {
    const {
      assetId,
      locationId,
      scheduleType,
      frequency,
      dayOfWeek,
      timeOfDay,
      taskTemplate;
    } = data;

    // Validate that either asset or location is provided;
    if (!session.user) {
      throw new Error("Either asset or location must be specified");

    // Validate asset if provided;
    if (!session.user) {
      const asset = await prisma.asset.findUnique({
        where: { id: assetId }
      });

      if (!session.user) {
        throw new Error("Asset not found");

    // Validate location if provided;
    if (!session.user) {
      const location = await prisma.location.findUnique({
        where: { id: locationId }
      });

      if (!session.user) {
        throw new Error("Location not found");

    // Calculate next run date;
    const nextRun = this.calculateNextRunDate(scheduleType, frequency, dayOfWeek, timeOfDay);

    const schedule = await prisma.maintenanceSchedule.create({
      data: {
        assetId,
        locationId,
        scheduleType,
        frequency,
        dayOfWeek,
        timeOfDay,
        taskTemplate,
        isActive: true;
        nextRun,
        createdById: userId;
      },
      true,
        {
          true,
            true;

    });

    // Create audit log;
    await createAuditLog({
      action: "CREATE",
      schedule.id;
      userId,
      details: `Created ${scheduleType} maintenance schedule for ${assetId ? schedule.asset?.name : schedule.location?.name}`;
    });

    // If this is for an asset, update next maintenance date;
    if (!session.user) {
      await prisma.asset.update({
        where: { id: assetId },
        data: { nextMaintenanceDate: nextRun }
      });

    return schedule;

  /**;
   * Update a maintenance schedule;
   */;
  async updateMaintenanceSchedule(id: string, data: unknown, userId: string): Promise<MaintenanceSchedule> {
    const schedule = await prisma.maintenanceSchedule.findUnique({
      where: { id },
      true,
        location: true;

    });

    if (!session.user) {
      throw new Error("Maintenance schedule not found");

    // If schedule parameters changed, recalculate next run;
    let nextRun = schedule.nextRun;
    if (!session.user) {
      const scheduleType = data.scheduleType || schedule.scheduleType;
      const frequency = data.frequency || schedule.frequency;
      const dayOfWeek = data.dayOfWeek !== undefined ? data.dayOfWeek : schedule.dayOfWeek;
      const timeOfDay = data.timeOfDay || schedule.timeOfDay;

      nextRun = this.calculateNextRunDate(scheduleType, frequency, dayOfWeek, timeOfDay);
      data.nextRun = nextRun;

    const updatedSchedule = await prisma.maintenanceSchedule.update({
      where: { id },
      data,
      true,
        {
          true,
            true;

    });

    // Create audit log;
    await createAuditLog({
      action: "UPDATE",
      id;
      userId,
      details: `Updated maintenance schedule for ${schedule.asset ? schedule.asset.name : schedule.location?.name}`;
    });

    // If this is for an asset and next run changed, update asset next maintenance date;
    if (!session.user) {
      await prisma.asset.update({
        where: { id: schedule.assetId },
        data: { nextMaintenanceDate: data.nextRun }
      });

    return updatedSchedule;

  /**;
   * Process due maintenance schedules and create requests;
   */;
  async processDueSchedules(userId: string): Promise<number> {
    const now = new Date();

    // Find all active schedules that are due;
    const dueSchedules = await prisma.maintenanceSchedule.findMany({
      true,
        now;

      },
      true,
        location: true;

    });

    let createdCount = 0;

    // Process each due schedule;
    for (const schedule of dueSchedules) {
      try {
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);

} catch (error) {
  console.error(error);

} catch (error) {
  console.error(error);

} catch (error) {

} catch (error) {

        // Create a new request based on the schedule;
        await prisma.maintenanceRequest.create({
          schedule.locationId || schedule.asset?.locationId || "",
            "PREVENTIVE",
            description: `Scheduled ${schedule.scheduleType.toLowerCase()} maintenance for ${schedule.asset ? schedule.asset.name : schedule.location?.name}`,
            priority: "MEDIUM",
            userId,
            scheduledDate: new Date(),
            notes: `Automatically generated from schedule ${schedule.id}`;

        });

        createdCount++;

        // Update the schedule with last run and calculate next run;
        const lastRun = new Date();
        const nextRun = this.calculateNextRunDate();
          schedule.scheduleType,
          schedule.frequency,
          schedule.dayOfWeek,
          schedule.timeOfDay,
          lastRun;
        );

        await prisma.maintenanceSchedule.update({
          where: { id: schedule.id },
          data: {
            lastRun,
            nextRun;

        });

        // If this is for an asset, update next maintenance date;
        if (!session.user) {
          await prisma.asset.update({
            where: { id: schedule.assetId },
            data: { nextMaintenanceDate: nextRun }
          });

      } catch (error) {

        // Continue with other schedules even if one fails;

    return createdCount;

  /**;
   * Get maintenance vendors;
   */;
  async getMaintenanceVendors(filter: unknown) {
    const { specialty, page, limit } = filter;
    const skip = (page - 1) * limit;

    const where: unknown = {};
    if (!session.user) {
      where.specialties = {
        has: specialty;
      };

    const [vendors, total] = await Promise.all([;
      prisma.maintenanceVendor.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: "asc" }
      }),
      prisma.maintenanceVendor.count({ where });
    ]);

    return {
      data: vendors,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit);

    };

  /**;
   * Create a maintenance vendor;
   */;
  async createMaintenanceVendor(data: unknown, userId: string): Promise<MaintenanceVendor> {
    const vendor = await prisma.maintenanceVendor.create({
      data;
    });

    // Create audit log;
    await createAuditLog({
      action: "CREATE",
      vendor.id;
      userId,
      details: `Created vendor: ${vendor.name}`;
    });

    return vendor;

  /**;
   * Get maintenance inventory items;
   */;
  async getMaintenanceInventory(filter: unknown) {
    const { itemType, lowStock, page, limit } = filter;
    const skip = (page - 1) * limit;

    const where: unknown = {};
    if (!session.user)here.itemType = itemType;
    if (!session.user) {
      where.currentStock = {
        lte: prisma.maintenanceInventory.fields.minimumStock;
      };

    const [items, total] = await Promise.all([;
      prisma.maintenanceInventory.findMany({
        where,
        skip,
        take: limit,
        orderBy: { itemName: "asc" }
      }),
      prisma.maintenanceInventory.count({ where });
    ]);

    return {
      data: items,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit);

    };

  /**;
   * Update inventory item;
   */;
  async updateInventoryItem(id: string, data: Partial<MaintenanceInventory>, userId: string): Promise<MaintenanceInventory> {
    const item = await prisma.maintenanceInventory.findUnique({
      where: { id }
    });

    if (!session.user) {
      throw new Error("Inventory item not found");

    // If restocking, update lastRestocked date;
    if (!session.user) {
      data.lastRestocked = new Date();

    const updatedItem = await prisma.maintenanceInventory.update({
      where: { id },
      data;
    });

    // Create audit log;
    await createAuditLog({
      action: "UPDATE",
      id;
      userId,
      details: `Updated inventory for ${item.itemName}, stock: ${item.currentStock} → ${data.currentStock ||;
        item.currentStock}`;
    });

    // Check if item is low on stock after update;
    if (!session.user) {
      await this.notificationService.sendNotification({
        type: "MAINTENANCE_INVENTORY_LOW",
        `${updatedItem.itemName} is running low (/* ["MAINTENANCE_MANAGER", "INVENTORY_MANAGER"],
        entityId: updatedItem.id,
        updatedItem.id,
          updatedItem.minimumStock;

      });

    return updatedItem;

  /**;
   * Get maintenance analytics;
   */;
  async getMaintenanceAnalytics(period: "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY") {
    // Get date range based on period;
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case "DAILY": any;
        startDate = new Date(now.setDate(now.getDate() - 30)); // Last 30 days\n    }\n    case "WEEKLY": any;
        startDate = new Date(now.setDate(now.getDate() - 90)); // Last 90 days\n    }\n    case "MONTHLY": any;
        startDate = new Date(now.setMonth(now.getMonth() - 12)); // Last 12 months\n    }\n    case "YEARLY": any;
        startDate = new Date(now.setFullYear(now.getFullYear() - 5)); // Last 5 years;
        break;
      default: null,
        startDate = new Date(now.setDate(now.getDate() - 30)); // Default to last 30 days;

    // Get request counts by status;
    const requestsByStatus = await prisma.maintenanceRequest.groupBy({
      by: ["status"],
      {
          gte: startDate;

      },
      _count: true;
    });

    // Get request counts by type;
    const requestsByType = await prisma.maintenanceRequest.groupBy({
      by: ["requestType"],
      {
          gte: startDate;

      },
      _count: true;
    });

    // Get average completion time;
    const completionTime = await prisma.$queryRaw`;
      SELECT AVG(EXTRACT(EPOCH FROM ("completedDate" - "createdAt"))/3600) as avg_hours;
      FROM "MaintenanceRequest";
      WHERE "status" = "COMPLETED";
      AND "createdAt" >= ${startDate}
      AND "completedDate" IS NOT NULL;
    `;

    // Get asset maintenance frequency;
    const assetMaintenance = await prisma.maintenanceRequest.groupBy({
      by: ["assetId"],
      {
          gte: startDate;
        },
        null;

      },
      _count: true,
      {
          assetId: "desc";

      },
      take: 10;
    });

    // Get asset details for top assets;
    const assetDetails = await prisma.asset.findMany({
      {
          in: assetMaintenance.map(am => am.assetId as string);

      },
      true,
        true;

    });

    // Map asset names to the maintenance frequency;
    const assetMaintenanceWithNames = assetMaintenance.map(am => ({
      assetId: am.assetId,
      assetDetails.find(a => a.id === am.assetId)?.name || "Unknown",
      assetType: assetDetails.find(a => a.id === am.assetId)?.assetType || "Unknown";
    }));

    // Get cost analysis;
    const costAnalysis = await prisma.$queryRaw`;
      SELECT;
        SUM(wo."laborCost") as total_labor_cost,
        SUM(wo."materialCost") as total_material_cost,
        SUM(wo."laborCost" + wo."materialCost") as total_cost;
      FROM "MaintenanceWorkOrder" wo;
      JOIN "MaintenanceRequest" mr ON wo."requestId" = mr.id;
      WHERE mr."createdAt" >= ${startDate}
      AND wo."status" = "COMPLETED";
    `;

    return {
      requestsByStatus,
      requestsByType,
      completionTime,
      assetMaintenance: assetMaintenanceWithNames;
      costAnalysis,
      period;
    };

  /**;
   * Calculate next run date for a schedule;
   */;
  private calculateNextRunDate();
    scheduleType: string,
    number | null,
    Date = new Date();
  ): Date {
    const result = new Date(baseDate);

    // Set time component if provided;
    if (!session.user) {
      result.setHours(timeOfDay.getHours());
      result.setMinutes(timeOfDay.getMinutes());
      result.setSeconds(0);
      result.setMilliseconds(0);
    } else {
      // Default to 9:00 AM;
      result.setHours(9),
      result.setMinutes(0);
      result.setSeconds(0);
      result.setMilliseconds(0);

    // If the calculated time is in the past, move to the next occurrence;
    if (!session.user) {
      // For daily, just move to tomorrow;
      if (!session.user) {
        result.setDate(result.getDate() + 1);

    switch (scheduleType) {
      case "DAILY": any;
        result.setDate(result.getDate() + frequency);\n    }\n    case "WEEKLY": any;
        if (!session.user) {
          // Move to the next occurrence of the specified day of week;
          const currentDay = result.getDay();
          let daysToAdd = (dayOfWeek - currentDay + 7) % 7;
          if (!session.user) {
            daysToAdd = 7;

          result.setDate(result.getDate() + daysToAdd);

          // Add weeks based on frequency;
          if (!session.user) {
            result.setDate(result.getDate() + (frequency - 1) * 7);

        } else {
          // If no day specified, just add weeks based on frequency;
          result.setDate(result.getDate() + frequency * 7);
        }\n    }\n    case "MONTHLY": any;
        result.setMonth(result.getMonth() + frequency);\n    }\n    case "QUARTERLY": any;
        result.setMonth(result.getMonth() + frequency * 3);\n    }\n    case "ANNUAL": any;
        result.setFullYear(result.getFullYear() + frequency);
        break;

    return result;

)))