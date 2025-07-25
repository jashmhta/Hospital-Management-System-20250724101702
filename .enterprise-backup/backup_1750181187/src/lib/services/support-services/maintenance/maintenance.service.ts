import { Asset, MaintenanceInventory, MaintenanceRequest, MaintenanceSchedule, MaintenanceVendor, MaintenanceWorkOrder } from '@prisma/client';


import { createAuditLog } from '@/lib/audit-logging';
import { toFHIRAsset, toFHIRMaintenanceRequest } from '@/lib/models/maintenance';
import { prisma } from '@/lib/prisma';
import type { NotificationService } from '@/lib/services/notification.service';
\1
}
  }

  /**
   * Get maintenance requests based on filters;
   */
  async getMaintenanceRequests(filter: MaintenanceRequestFilter) {
    const { status, locationId, assetId, priority, requestType, startDate, endDate, page, limit } = filter;
    const skip = (page - 1) * limit;

    const where: unknown = {};
    \1 {\n  \2here.status = status;
    \1 {\n  \2here.locationId = locationId;
    \1 {\n  \2here.assetId = assetId;
    \1 {\n  \2here.priority = priority;
    \1 {\n  \2here.requestType = requestType;

    // Date range filter
    \1 {\n  \2{
      where.createdAt = {};
      \1 {\n  \2here.createdAt.gte = startDate;
      \1 {\n  \2here.createdAt.lte = endDate;
    }

    const [requests, total] = await Promise.all([
      prisma.maintenanceRequest.findMany({
        where,
        include: {
          location: true,
          \1,\2 {
            select: {
              id: true,
              \1,\2 true
            }
          },
          workOrders: {
            include: {
              assignedToUser: {
                select: {
                  id: true,
                  \1,\2 true
                }
              }
            }
          }
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.maintenanceRequest.count(where )
    ]);

    // Convert to FHIR format if requested
    const fhirRequests = requests.map(request => toFHIRMaintenanceRequest(request));

    return {
      data: requests,
      fhir: fhirRequests;
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
    };
  }

  /**
   * Create a new maintenance request;
   */
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

    // Validate location exists
    const location = await prisma.location.findUnique({
      where: { id: locationId }
    });

    \1 {\n  \2{
      throw new Error('Location not found');
    }

    // Validate asset if provided
    \1 {\n  \2{
      const asset = await prisma.asset.findUnique({
        where: { id: assetId }
      });

      \1 {\n  \2{
        throw new Error('Asset not found');
      }

      // Update asset status if it's a repair request
      \1 {\n  \2{
        await prisma.asset.update({
          where: { id: assetId },
          data: { status: 'NEEDS_REPAIR' }
        });
      }
    }

    // Create the maintenance request
    const request = await prisma.maintenanceRequest.create({
      data: {
        locationId,
        assetId,
        requestType,
        description,
        priority,
        status: 'PENDING',
        requestedById: requestedBy;
        scheduledDate,
        estimatedHours,
        notes;
      },
      include: {
        location: true,
        \1,\2 true,
            \1,\2 true
      }
    });

    // Create audit log
    await createAuditLog({
      action: 'CREATE',
      \1,\2 request.id,
      \1,\2 `Created ${requestType} maintenance request for ${assetId ? request.asset?.name : location.name}`
    });

    // Send notification to maintenance staff
    await this.notificationService.sendNotification({
      type: 'MAINTENANCE_REQUEST',
      title: `New ${priority} Maintenance Request`,
      message: `A new ${requestType} request has been created for ${assetId ? request.asset?.name : location.name}`,
      recipientRoles: ['MAINTENANCE_MANAGER', 'MAINTENANCE_STAFF'],
      entityId: request.id,
      metadata: {
        requestId: request.id,
        \1,\2 assetId,
        priority: priority
      }
    });

    return request;
  }

  /**
   * Get a specific maintenance request by ID;
   */
  async getMaintenanceRequestById(id: string, includeFHIR: boolean = false): Promise<unknown> {
    const request = await prisma.maintenanceRequest.findUnique({
      where: { id },
      include: {
        location: true,
        \1,\2 true,
            \1,\2 true,
        workOrders: 
                id: true,
                \1,\2 true,
            parts: true
      }
    });

    \1 {\n  \2{
      return null;
    }

    \1 {\n  \2{
      return {
        data: request,
        fhir: toFHIRMaintenanceRequest(request)
      };
    }

    return request;
  }

  /**
   * Update a maintenance request;
   */
  async updateMaintenanceRequest(id: string, data: Partial<MaintenanceRequest>, userId: string): Promise<MaintenanceRequest> {
    const request = await prisma.maintenanceRequest.findUnique({
      where: { id },
      include: {
        location: true,
        asset: true
      }
    });

    \1 {\n  \2{
      throw new Error('Maintenance request not found');
    }

    // Check if status is changing to completed
    const isCompleting = data.status === 'COMPLETED' && request.status !== 'COMPLETED';

    // If completing, ensure all work orders are completed
    \1 {\n  \2{
      const incompleteWorkOrders = await prisma.maintenanceWorkOrder.count({
        where: {
          requestId: id,
          status: { notIn: ['COMPLETED', 'CANCELLED'] }
        }
      });

      \1 {\n  \2{
        throw new Error('Cannot mark request as completed while work orders are still pending');
      }

      // Set completed date
      data.completedDate = new Date();

      // Update asset status if this is a repair request
      \1 {\n  \2{
        await prisma.asset.update({
          where: { id: request.assetId },
          data: {
            status: 'OPERATIONAL',
            lastMaintenanceDate: new Date()
          }
        });
      }
    }

    const updatedRequest = await prisma.maintenanceRequest.update({
      where: { id },
      data,
      include: {
        location: true,
        \1,\2 true,
            \1,\2 true,
        workOrders: 
                id: true,
                \1,\2 true
      }
    });

    // Create audit log
    await createAuditLog({
      action: 'UPDATE',
      \1,\2 id;
      userId,
      details: `Updated maintenance request for /* SECURITY: Template literal eliminated */

    // Send notification if status changed
    \1 {\n  \2{
      await this.notificationService.sendNotification({
        type: 'MAINTENANCE_STATUS_CHANGE',
        \1,\2 `Request for ${request.asset ? request.asset.name : request.location.name} is now ${data.status}`,
        recipientRoles: ['MAINTENANCE_MANAGER'],
        \1,\2 request.id,
        metadata: 
          requestId: request.id,
          \1,\2 data.status
      });
    }

    return updatedRequest;
  }

  /**
   * Create a work order for a maintenance request;
   */
  async createMaintenanceWorkOrder(requestId: string, data: unknown, userId: string): Promise<MaintenanceWorkOrder> {
    const request = await prisma.maintenanceRequest.findUnique({
      where: { id: requestId },
      include: {
        location: true,
        asset: true
      }
    });

    \1 {\n  \2{
      throw new Error('Maintenance request not found');
    }

    // If request is in PENDING status, update to ASSIGNED
    \1 {\n  \2{
      await prisma.maintenanceRequest.update({
        where: { id: requestId },
        data: { status: 'ASSIGNED' }
      });
    }

    // If this is a repair request and asset is operational, update status
    \1 {\n  \2{
      const asset = await prisma.asset.findUnique({
        where: { id: request.assetId }
      });

      \1 {\n  \2{
        await prisma.asset.update({
          where: { id: request.assetId },
          data: { status: 'NEEDS_REPAIR' }
        });
      }
    }

    const workOrder = await prisma.maintenanceWorkOrder.create({
      data: {
        requestId,
        description: data.description,
        \1,\2 data.assignedToId,
        \1,\2 data.notes,
        \1,\2 data.materialCost
      },
      include: {
            id: true,
            \1,\2 true
      }
    });

    // Create audit log
    await createAuditLog({
      action: 'CREATE',
      \1,\2 workOrder.id;
      userId,
      details: `Created maintenance work order for request ${requestId}`;
    });

    // Send notification to assigned staff
    \1 {\n  \2{
      await this.notificationService.sendNotification({
        type: 'MAINTENANCE_WORK_ORDER_ASSIGNED',
        \1,\2 `You have been assigned a new work order: ${data.description}`,
        recipientIds: [data.assignedToId],
        \1,\2 {
          workOrderId: workOrder.id,
          \1,\2 request.locationId,
          assetId: request.assetId
        }
      });
    }

    return workOrder;
  }

  /**
   * Update a maintenance work order;
   */
  async updateMaintenanceWorkOrder(id: string, data: Partial<MaintenanceWorkOrder>, userId: string): Promise<MaintenanceWorkOrder> {
    const workOrder = await prisma.maintenanceWorkOrder.findUnique({
      where: { id },
      include: {
        request: {
          include: {
            asset: true
          }
        }
      }
    });

    \1 {\n  \2{
      throw new Error('Maintenance work order not found');
    }

    // Handle status transitions
    \1 {\n  \2{
      // If starting work order, set start time
      \1 {\n  \2{
        data.startTime = new Date();

        // Also update request status if it's not already in progress
        \1 {\n  \2{
          await prisma.maintenanceRequest.update({
            where: { id: workOrder.requestId },
            data: { status: 'IN_PROGRESS' }
          });
        }

        // If this is for an asset, update asset status
        \1 {\n  \2{
          await prisma.asset.update({
            where: { id: workOrder.request.assetId },
            data: { status: 'UNDER_MAINTENANCE' }
          });
        }
      }

      // If completing work order, set end time and calculate duration
      \1 {\n  \2{
        const endTime = new Date();
        data.endTime = endTime;

        // Calculate duration in hours if we have a start time
        \1 {\n  \2{
          const durationMs = endTime.getTime() - workOrder.startTime.getTime();
          data.duration = parseFloat((durationMs / 3600000).toFixed(2)); // Convert ms to hours
        }
      }
    }

    const updatedWorkOrder = await prisma.maintenanceWorkOrder.update({
      where: { id },
      data,
      include: {
        assignedToUser: {
          select: {
            id: true,
            \1,\2 true
          }
        },
        request: {
          include: {
            location: true,
            asset: true
          }
        },
        parts: true
      }
    });

    // Create audit log
    await createAuditLog({
      action: 'UPDATE',
      \1,\2 id;
      userId,
      details: `Updated maintenance work order status to ${data.status}`;
    });

    // If work order is completed, check if all work orders are completed to update request status
    \1 {\n  \2{
      const allWorkOrders = await prisma.maintenanceWorkOrder.findMany({
        where: { requestId: workOrder.requestId }
      });

      const allCompleted = allWorkOrders.every(wo => wo.status === 'COMPLETED' || wo.status === 'CANCELLED');

      \1 {\n  \2{
        await prisma.maintenanceRequest.update({
          where: { id: workOrder.requestId },
          data: {
            status: 'COMPLETED',
            completedDate: new Date(),
            actualHours: allWorkOrders.reduce((total, wo) => total + (wo.duration || 0), 0)
          }
        });

        // If this is for an asset, update asset status and maintenance dates
        \1 {\n  \2{
          await prisma.asset.update({
            where: { id: workOrder.request.assetId },
            data: {
              status: 'OPERATIONAL',
              lastMaintenanceDate: new Date()
            }
          });
        }

        // Send notification that request is complete
        await this.notificationService.sendNotification({
          type: 'MAINTENANCE_REQUEST_COMPLETED',
          \1,\2 `Request for ${workOrder.request.asset ? workOrder.request.asset.name : workOrder.request.location.name} has been completed`,
          recipientIds: [workOrder.request.requestedById],
          \1,\2 {
            requestId: workOrder.requestId,
            \1,\2 workOrder.request.assetId
          }
        });
      }
    }

    return updatedWorkOrder;
  }

  /**
   * Add parts to a work order;
   */
  async addPartsToWorkOrder(workOrderId: string, parts: unknown[], userId: string): Promise<MaintenanceWorkOrder> {
    const workOrder = await prisma.maintenanceWorkOrder.findUnique({
      where: { id: workOrderId }
    });

    \1 {\n  \2{
      throw new Error('Maintenance work order not found');
    }

    // Process each part
    let totalMaterialCost = 0;

    for (const part of parts) {
      // Check inventory and update stock
      \1 {\n  \2{
        const inventoryItem = await prisma.maintenanceInventory.findUnique({
          where: { id: part.inventoryItemId }
        });

        \1 {\n  \2{
          throw new Error(`Inventory item ${part.inventoryItemId} not found`);
        }

        \1 {\n  \2{
          throw new Error(`Insufficient stock for ${\1}`;
        }

        // Update inventory
        await prisma.maintenanceInventory.update({
          where: { id: part.inventoryItemId },
          data: {
            currentStock: inventoryItem.currentStock - part.quantity
          }
        });

        // Use inventory item cost if not provided
        \1 {\n  \2{
          part.unitCost = inventoryItem.cost || 0;
        }
      }

      // Calculate total cost
      const totalCost = part.quantity * part.unitCost;
      totalMaterialCost += totalCost;

      // Create part record
      await prisma.maintenancePart.create({
        data: {
          workOrderId,
          partName: part.partName,
          \1,\2 part.quantity,
          unitCost: part.unitCost;
          totalCost;
        }
      });
    }

    // Update work order with material cost
    const updatedWorkOrder = await prisma.maintenanceWorkOrder.update({
      where: { id: workOrderId },
      data: {
        materialCost: (workOrder.materialCost || 0) + totalMaterialCost
      },
      include: {
        parts: true,
        assignedToUser: {
          select: {
            id: true,
            \1,\2 true
          }
        },
        request: true
      }
    });

    // Create audit log
    await createAuditLog({
      action: 'UPDATE',
      \1,\2 workOrderId;
      userId,
      details: `Added ${parts.length} parts to work order, total cost: $${totalMaterialCost.toFixed(2)}`;
    });

    return updatedWorkOrder;
  }

  /**
   * Get assets based on filters;
   */
  async getAssets(filter: unknown) {
    const { assetType, status, locationId, page, limit } = filter;
    const skip = (page - 1) * limit;

    const where: unknown = {};
    \1 {\n  \2here.assetType = assetType;
    \1 {\n  \2here.status = status;
    \1 {\n  \2here.locationId = locationId;

    const [assets, total] = await Promise.all([
      prisma.asset.findMany({
        where,
        include: {
          location: true,
          _count: {
            select: { maintenanceRequests: true }
          }
        },
        skip,
        take: limit,
        orderBy: { name: 'asc' }
      }),
      prisma.asset.count({ where })
    ]);

    // Convert to FHIR format if requested
    const fhirAssets = assets.map(asset => toFHIRAsset(asset));

    return {
      data: assets,
      \1,\2 {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Get a specific asset by ID;
   */
  async getAssetById(id: string, includeFHIR: boolean = false): Promise<unknown> {
    const asset = await prisma.asset.findUnique({
      where: { id },
      include: {
        location: true,
        maintenanceRequests: {
          take: 5,
          orderBy: { createdAt: 'desc' }
        },
        maintenanceSchedules: true
      }
    });

    \1 {\n  \2{
      return null;
    }

    \1 {\n  \2{
      return {
        data: asset,
        fhir: toFHIRAsset(asset)
      };
    }

    return asset;
  }

  /**
   * Create a new asset;
   */
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

    // Validate location exists
    const location = await prisma.location.findUnique({
      where: { id: locationId }
    });

    \1 {\n  \2{
      throw new Error('Location not found');
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
        \1,\2 'OPERATIONAL'
      },
      include: {
        location: true
      }
    });

    // Create audit log
    await createAuditLog({
      action: 'CREATE',
      \1,\2 asset.id;
      userId,
      details: `Created new ${assetType} asset: ${name}`;
    });

    return asset;
  }

  /**
   * Update an asset;
   */
  async updateAsset(id: string, data: Partial<Asset>, userId: string): Promise<Asset> {
    const asset = await prisma.asset.findUnique({
      where: { id }
    });

    \1 {\n  \2{
      throw new Error('Asset not found');
    }

    const updatedAsset = await prisma.asset.update({
      where: { id },
      data,
      include: {
        location: true
      }
    });

    // Create audit log
    await createAuditLog({
      action: 'UPDATE',
      \1,\2 id;
      userId,
      details: `Updated asset: ${asset.name}`;
    });

    return updatedAsset;
  }

  /**
   * Get maintenance schedules;
   */
  async getMaintenanceSchedules(filter: unknown) {
    const { assetId, locationId, isActive } = filter;

    const where: unknown = {};
    \1 {\n  \2here.assetId = assetId;
    \1 {\n  \2here.locationId = locationId;
    \1 {\n  \2here.isActive = isActive;

    return prisma.maintenanceSchedule.findMany({
      where,
      include: {
        asset: true,
        \1,\2 {
          select: {
            id: true,
            \1,\2 true
          }
        }
      },
      orderBy: { nextRun: 'asc' }
    });
  }

  /**
   * Create a maintenance schedule;
   */
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

    // Validate that either asset or location is provided
    \1 {\n  \2{
      throw new Error('Either asset or location must be specified');
    }

    // Validate asset if provided
    \1 {\n  \2{
      const asset = await prisma.asset.findUnique({
        where: { id: assetId }
      });

      \1 {\n  \2{
        throw new Error('Asset not found');
      }
    }

    // Validate location if provided
    \1 {\n  \2{
      const location = await prisma.location.findUnique({
        where: { id: locationId }
      });

      \1 {\n  \2{
        throw new Error('Location not found');
      }
    }

    // Calculate next run date
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
        createdById: userId
      },
      include: {
        asset: true,
        \1,\2 {
          select: {
            id: true,
            \1,\2 true
          }
        }
      }
    });

    // Create audit log
    await createAuditLog({
      action: 'CREATE',
      \1,\2 schedule.id;
      userId,
      details: `Created ${scheduleType} maintenance schedule for ${assetId ? schedule.asset?.name : schedule.location?.name}`
    });

    // If this is for an asset, update next maintenance date
    \1 {\n  \2{
      await prisma.asset.update({
        where: { id: assetId },
        data: { nextMaintenanceDate: nextRun }
      });
    }

    return schedule;
  }

  /**
   * Update a maintenance schedule;
   */
  async updateMaintenanceSchedule(id: string, data: unknown, userId: string): Promise<MaintenanceSchedule> {
    const schedule = await prisma.maintenanceSchedule.findUnique({
      where: { id },
      include: {
        asset: true,
        location: true
      }
    });

    \1 {\n  \2{
      throw new Error('Maintenance schedule not found');
    }

    // If schedule parameters changed, recalculate next run
    let nextRun = schedule.nextRun;
    \1 {\n  \2{
      const scheduleType = data.scheduleType || schedule.scheduleType;
      const frequency = data.frequency || schedule.frequency;
      const dayOfWeek = data.dayOfWeek !== undefined ? data.dayOfWeek : schedule.dayOfWeek;
      const timeOfDay = data.timeOfDay || schedule.timeOfDay;

      nextRun = this.calculateNextRunDate(scheduleType, frequency, dayOfWeek, timeOfDay);
      data.nextRun = nextRun;
    }

    const updatedSchedule = await prisma.maintenanceSchedule.update({
      where: { id },
      data,
      include: {
        asset: true,
        \1,\2 {
          select: {
            id: true,
            \1,\2 true
          }
        }
      }
    });

    // Create audit log
    await createAuditLog({
      action: 'UPDATE',
      \1,\2 id;
      userId,
      details: `Updated maintenance schedule for ${schedule.asset ? schedule.asset.name : schedule.location?.name}`
    });

    // If this is for an asset and next run changed, update asset next maintenance date
    \1 {\n  \2{
      await prisma.asset.update({
        where: { id: schedule.assetId },
        data: { nextMaintenanceDate: data.nextRun }
      });
    }

    return updatedSchedule;
  }

  /**
   * Process due maintenance schedules and create requests;
   */
  async processDueSchedules(userId: string): Promise<number> {
    const now = new Date();

    // Find all active schedules that are due
    const dueSchedules = await prisma.maintenanceSchedule.findMany({
      where: {
        isActive: true,
        nextRun: {
          lte: now
        }
      },
      include: {
        asset: true,
        location: true
      }
    });

    let createdCount = 0;

    // Process each due schedule
    for (const schedule of dueSchedules) {
      try {
        // Create a new request based on the schedule
        await prisma.maintenanceRequest.create({
          data: {
            locationId: schedule.locationId || schedule.asset?.locationId || '',
            \1,\2 'PREVENTIVE',
            description: `Scheduled ${schedule.scheduleType.toLowerCase()} maintenance for ${schedule.asset ? schedule.asset.name : schedule.location?.name}`,
            priority: 'MEDIUM',
            \1,\2 userId,
            scheduledDate: new Date(),
            notes: `Automatically generated from schedule ${schedule.id}`;
          }
        });

        createdCount++;

        // Update the schedule with last run and calculate next run
        const lastRun = new Date();
        const nextRun = this.calculateNextRunDate(
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
          }
        });

        // If this is for an asset, update next maintenance date
        \1 {\n  \2{
          await prisma.asset.update({
            where: { id: schedule.assetId },
            data: { nextMaintenanceDate: nextRun }
          });
        }
      } catch (error) {

        // Continue with other schedules even if one fails
      }
    }

    return createdCount;
  }

  /**
   * Get maintenance vendors;
   */
  async getMaintenanceVendors(filter: unknown) {
    const { specialty, page, limit } = filter;
    const skip = (page - 1) * limit;

    const where: unknown = {};
    \1 {\n  \2{
      where.specialties = {
        has: specialty
      };
    }

    const [vendors, total] = await Promise.all([
      prisma.maintenanceVendor.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: 'asc' }
      }),
      prisma.maintenanceVendor.count({ where })
    ]);

    return {
      data: vendors,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Create a maintenance vendor;
   */
  async createMaintenanceVendor(data: unknown, userId: string): Promise<MaintenanceVendor> {
    const vendor = await prisma.maintenanceVendor.create({
      data
    });

    // Create audit log
    await createAuditLog({
      action: 'CREATE',
      \1,\2 vendor.id;
      userId,
      details: `Created vendor: ${vendor.name}`;
    });

    return vendor;
  }

  /**
   * Get maintenance inventory items;
   */
  async getMaintenanceInventory(filter: unknown) {
    const { itemType, lowStock, page, limit } = filter;
    const skip = (page - 1) * limit;

    const where: unknown = {};
    \1 {\n  \2here.itemType = itemType;
    \1 {\n  \2{
      where.currentStock = {
        lte: prisma.maintenanceInventory.fields.minimumStock
      };
    }

    const [items, total] = await Promise.all([
      prisma.maintenanceInventory.findMany({
        where,
        skip,
        take: limit,
        orderBy: { itemName: 'asc' }
      }),
      prisma.maintenanceInventory.count({ where })
    ]);

    return {
      data: items,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Update inventory item;
   */
  async updateInventoryItem(id: string, data: Partial<MaintenanceInventory>, userId: string): Promise<MaintenanceInventory> {
    const item = await prisma.maintenanceInventory.findUnique({
      where: { id }
    });

    \1 {\n  \2{
      throw new Error('Inventory item not found');
    }

    // If restocking, update lastRestocked date
    \1 {\n  \2{
      data.lastRestocked = new Date();
    }

    const updatedItem = await prisma.maintenanceInventory.update({
      where: { id },
      data;
    });

    // Create audit log
    await createAuditLog({
      action: 'UPDATE',
      \1,\2 id;
      userId,
      details: `Updated inventory for ${item.itemName}, stock: ${item.currentStock} → ${data.currentStock ||
        item.currentStock}`;
    });

    // Check if item is low on stock after update
    \1 {\n  \2{
      await this.notificationService.sendNotification({
        type: 'MAINTENANCE_INVENTORY_LOW',
        \1,\2 `${updatedItem.itemName} is running low (/* SECURITY: Template literal eliminated */
        recipientRoles: ['MAINTENANCE_MANAGER', 'INVENTORY_MANAGER'],
        entityId: updatedItem.id,
        metadata: {
          itemId: updatedItem.id,
          \1,\2 updatedItem.minimumStock
        }
      });
    }

    return updatedItem;
  }

  /**
   * Get maintenance analytics;
   */
  async getMaintenanceAnalytics(period: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY') {
    // Get date range based on period
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'DAILY':
        startDate = new Date(now.setDate(now.getDate() - 30)); // Last 30 days\1\n    }\n    case 'WEEKLY':
        startDate = new Date(now.setDate(now.getDate() - 90)); // Last 90 days\1\n    }\n    case 'MONTHLY':
        startDate = new Date(now.setMonth(now.getMonth() - 12)); // Last 12 months\1\n    }\n    case 'YEARLY':
        startDate = new Date(now.setFullYear(now.getFullYear() - 5)); // Last 5 years
        break;
      default:
        startDate = new Date(now.setDate(now.getDate() - 30)); // Default to last 30 days
    }

    // Get request counts by status
    const requestsByStatus = await prisma.maintenanceRequest.groupBy({
      by: ['status'],
      where: {
        createdAt: {
          gte: startDate
        }
      },
      _count: true
    });

    // Get request counts by type
    const requestsByType = await prisma.maintenanceRequest.groupBy({
      by: ['requestType'],
      where: {
        createdAt: {
          gte: startDate
        }
      },
      _count: true
    });

    // Get average completion time
    const completionTime = await prisma.$queryRaw`;
      SELECT AVG(EXTRACT(EPOCH FROM ("completedDate" - "createdAt"))/3600) as avg_hours;
      FROM "MaintenanceRequest";
      WHERE "status" = 'COMPLETED';
      AND "createdAt" >= ${startDate}
      AND "completedDate" IS NOT NULL;
    `;

    // Get asset maintenance frequency
    const assetMaintenance = await prisma.maintenanceRequest.groupBy({
      by: ['assetId'],
      where: {
        createdAt: {
          gte: startDate
        },
        assetId: {
          not: null
        }
      },
      _count: true,
      orderBy: {
        _count: {
          assetId: 'desc'
        }
      },
      take: 10
    });

    // Get asset details for top assets
    const assetDetails = await prisma.asset.findMany({
      where: {
        id: {
          in: assetMaintenance.map(am => am.assetId as string)
        }
      },
      select: {
        id: true,
        \1,\2 true
      }
    });

    // Map asset names to the maintenance frequency
    const assetMaintenanceWithNames = assetMaintenance.map(am => ({
      assetId: am.assetId,
      \1,\2 assetDetails.find(a => a.id === am.assetId)?.name || 'Unknown',
      assetType: assetDetails.find(a => a.id === am.assetId)?.assetType || 'Unknown'
    }));

    // Get cost analysis
    const costAnalysis = await prisma.$queryRaw`;
      SELECT;
        SUM(wo."laborCost") as total_labor_cost,
        SUM(wo."materialCost") as total_material_cost,
        SUM(wo."laborCost" + wo."materialCost") as total_cost;
      FROM "MaintenanceWorkOrder" wo;
      JOIN "MaintenanceRequest" mr ON wo."requestId" = mr.id;
      WHERE mr."createdAt" >= ${startDate}
      AND wo."status" = 'COMPLETED';
    `;

    return {
      requestsByStatus,
      requestsByType,
      completionTime,
      assetMaintenance: assetMaintenanceWithNames;
      costAnalysis,
      period
    };
  }

  /**
   * Calculate next run date for a schedule;
   */
  private calculateNextRunDate(
    scheduleType: string,
    \1,\2 number | null,
    \1,\2 Date = new Date();
  ): Date {
    const result = new Date(baseDate);

    // Set time component if provided
    \1 {\n  \2{
      result.setHours(timeOfDay.getHours());
      result.setMinutes(timeOfDay.getMinutes());
      result.setSeconds(0);
      result.setMilliseconds(0);
    } else {
      // Default to 9:00 AM
      result.setHours(9),
      result.setMinutes(0);
      result.setSeconds(0);
      result.setMilliseconds(0);
    }

    // If the calculated time is in the past, move to the next occurrence
    \1 {\n  \2{
      // For daily, just move to tomorrow
      \1 {\n  \2{
        result.setDate(result.getDate() + 1);
      }
    }

    switch (scheduleType) {
      case 'DAILY':
        result.setDate(result.getDate() + frequency);\1\n    }\n    case 'WEEKLY':
        \1 {\n  \2{
          // Move to the next occurrence of the specified day of week
          const currentDay = result.getDay();
          let daysToAdd = (dayOfWeek - currentDay + 7) % 7;
          \1 {\n  \2{
            daysToAdd = 7;
          }
          result.setDate(result.getDate() + daysToAdd);

          // Add weeks based on frequency
          \1 {\n  \2{
            result.setDate(result.getDate() + (frequency - 1) * 7);
          }
        } else {
          // If no day specified, just add weeks based on frequency
          result.setDate(result.getDate() + frequency * 7);
        }\1\n    }\n    case 'MONTHLY':
        result.setMonth(result.getMonth() + frequency);\1\n    }\n    case 'QUARTERLY':
        result.setMonth(result.getMonth() + frequency * 3);\1\n    }\n    case 'ANNUAL':
        result.setFullYear(result.getFullYear() + frequency);
        break;
    }

    return result;
  }
