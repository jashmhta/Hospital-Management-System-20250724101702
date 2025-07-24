import { HousekeepingInspection, HousekeepingInventory, HousekeepingRequest, HousekeepingSchedule, HousekeepingTask } from '@prisma/client';


import { createAuditLog } from '@/lib/audit-logging';
import { toFHIRHousekeepingInspection, toFHIRHousekeepingRequest } from '@/lib/models/housekeeping';
import { prisma } from '@/lib/prisma';
import type { NotificationService } from '@/lib/services/notification.service';
\1
}
  }

  /**
   * Get housekeeping requests based on filters;
   */
  async getHousekeepingRequests(filter: HousekeepingRequestFilter) {
    const { status, locationId, priority, requestType, startDate, endDate, page, limit } = filter;
    const skip = (page - 1) * limit;

    const where: unknown = {};
    \1 {\n  \2here.status = status;
    \1 {\n  \2here.locationId = locationId;
    \1 {\n  \2here.priority = priority;
    \1 {\n  \2here.requestType = requestType;

    // Date range filter
    \1 {\n  \2{
      where.createdAt = {};
      \1 {\n  \2here.createdAt.gte = startDate;
      \1 {\n  \2here.createdAt.lte = endDate;
    }

    const [requests, total] = await Promise.all([
      prisma.housekeepingRequest.findMany({
        where,
        include: {
          location: true,
          requestedByUser: {
            select: {
              id: true,
              \1,\2 true
            }
          },
          tasks: {
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
      prisma.housekeepingRequest.count(where )
    ]);

    // Convert to FHIR format if requested
    const fhirRequests = requests.map(request => toFHIRHousekeepingRequest(request));

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
   * Create a new housekeeping request;
   */
  async createHousekeepingRequest(data: CreateHousekeepingRequestData): Promise<HousekeepingRequest> {
    const { locationId, requestType, description, priority, requestedBy, scheduledDate, notes } = data;

    // Validate location exists
    const location = await prisma.location.findUnique({
      where: { id: locationId }
    });

    \1 {\n  \2{
      throw new Error('Location not found');
    }

    // Create the housekeeping request
    const request = await prisma.housekeepingRequest.create({
      data: {
        locationId,
        requestType,
        description,
        priority,
        status: 'PENDING',
        requestedById: requestedBy;
        scheduledDate,
        notes;
      },
      include: {
        location: true,
        requestedByUser: 
            id: true,
            \1,\2 true
      }
    });

    // Create audit log
    await createAuditLog({
      action: 'CREATE',
      \1,\2 request.id,
      \1,\2 `Created housekeeping request for ${location.name}`;
    });

    // Send notification to housekeeping staff
    await this.notificationService.sendNotification({
      type: 'HOUSEKEEPING_REQUEST',
      title: `New ${priority} Housekeeping Request`,
      message: `A new ${requestType} request has been created for ${location.name}`,
      recipientRoles: ['HOUSEKEEPING_MANAGER', 'HOUSEKEEPING_STAFF'],
      entityId: request.id,
      metadata: {
        requestId: request.id,
        \1,\2 priority
      }
    });

    return request;
  }

  /**
   * Get a specific housekeeping request by ID;
   */
  async getHousekeepingRequestById(id: string, includeFHIR: boolean = false): Promise<unknown> {
    const request = await prisma.housekeepingRequest.findUnique({
      where: { id },
      include: {
        location: true,
        requestedByUser: {
          select: {
            id: true,
            \1,\2 true
          }
        },
        tasks: {
                id: true,
                \1,\2 true
        }
      }
    });

    \1 {\n  \2{
      return null;
    }

    \1 {\n  \2{
      return {
        data: request,
        fhir: toFHIRHousekeepingRequest(request)
      };
    }

    return request;
  }

  /**
   * Update a housekeeping request;
   */
  async updateHousekeepingRequest(id: string, data: Partial<HousekeepingRequest>, userId: string): Promise<HousekeepingRequest> {
    const request = await prisma.housekeepingRequest.findUnique({
      where: { id },
      include: { location: true }
    });

    \1 {\n  \2{
      throw new Error('Housekeeping request not found');
    }

    // Check if status is changing to completed
    const isCompleting = data.status === 'COMPLETED' && request.status !== 'COMPLETED';

    // If completing, ensure all tasks are completed
    \1 {\n  \2{
      const incompleteTasks = await prisma.housekeepingTask.count({
        where: {
          requestId: id,
          status: { notIn: ['COMPLETED', 'CANCELLED'] }
        }
      });

      \1 {\n  \2{
        throw new Error('Cannot mark request as completed while tasks are still pending');
      }

      // Set completed date
      data.completedDate = new Date();
    }

    const updatedRequest = await prisma.housekeepingRequest.update({
      where: { id },
      data,
      include: {
        location: true,
        requestedByUser: {
          select: {
            id: true,
            \1,\2 true
          }
        },
        tasks: {
                id: true,
                \1,\2 true
        }
      }
    });

    // Create audit log
    await createAuditLog({
      action: 'UPDATE',
      \1,\2 id;
      userId,
      details: `Updated housekeeping request for /* SECURITY: Template literal eliminated */

    // Send notification if status changed
    \1 {\n  \2{
      await this.notificationService.sendNotification({
        type: 'HOUSEKEEPING_STATUS_CHANGE',
        \1,\2 `Request for ${request.location.name} is now ${data.status}`,
        recipientRoles: ['HOUSEKEEPING_MANAGER'],
        \1,\2 request.id,
        metadata: 
          requestId: request.id,
          \1,\2 data.status
      });
    }

    return updatedRequest;
  }

  /**
   * Create a task for a housekeeping request;
   */
  async createHousekeepingTask(requestId: string, data: unknown, userId: string): Promise<HousekeepingTask> {
    const request = await prisma.housekeepingRequest.findUnique({
      where: { id: requestId },
      include: { location: true }
    });

    \1 {\n  \2{
      throw new Error('Housekeeping request not found');
    }

    // If request is in PENDING status, update to ASSIGNED
    \1 {\n  \2{
      await prisma.housekeepingRequest.update({
        where: { id: requestId },
        data: { status: 'ASSIGNED' }
      });
    }

    const task = await prisma.housekeepingTask.create({
      data: {
        requestId,
        description: data.description,
        \1,\2 data.assignedToId,
        \1,\2 data.notes
      },
      include: {
            id: true,
            \1,\2 true
      }
    });

    // Create audit log
    await createAuditLog({
      action: 'CREATE',
      \1,\2 task.id;
      userId,
      details: `Created housekeeping task for request ${requestId}`;
    });

    // Send notification to assigned staff
    \1 {\n  \2{
      await this.notificationService.sendNotification({
        type: 'HOUSEKEEPING_TASK_ASSIGNED',
        \1,\2 `You have been assigned a new task: ${data.description}`,
        recipientIds: [data.assignedToId],
        \1,\2 {
          taskId: task.id,
          \1,\2 request.locationId
        }
      });
    }

    return task;
  }

  /**
   * Update a housekeeping task;
   */
  async updateHousekeepingTask(id: string, data: Partial<HousekeepingTask>, userId: string): Promise<HousekeepingTask> {
    const task = await prisma.housekeepingTask.findUnique({
      where: { id },
      include: {
        request: true
      }
    });

    \1 {\n  \2{
      throw new Error('Housekeeping task not found');
    }

    // Handle status transitions
    \1 {\n  \2{
      // If starting task, set start time
      \1 {\n  \2{
        data.startTime = new Date();

        // Also update request status if it's not already in progress
        \1 {\n  \2{
          await prisma.housekeepingRequest.update({
            where: { id: task.requestId },
            data: { status: 'IN_PROGRESS' }
          });
        }
      }

      // If completing task, set end time and calculate duration
      \1 {\n  \2{
        const endTime = new Date();
        data.endTime = endTime;

        // Calculate duration in minutes if we have a start time
        \1 {\n  \2{
          const durationMs = endTime.getTime() - task.startTime.getTime();
          data.duration = Math.round(durationMs / 60000); // Convert ms to minutes
        }
      }
    }

    const updatedTask = await prisma.housekeepingTask.update({
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
            location: true
          }
        }
      }
    });

    // Create audit log
    await createAuditLog({
      action: 'UPDATE',
      \1,\2 id;
      userId,
      details: `Updated housekeeping task status to ${data.status}`;
    });

    // If task is completed, check if all tasks are completed to update request status
    \1 {\n  \2{
      const allTasks = await prisma.housekeepingTask.findMany({
        where: { requestId: task.requestId }
      });

      const allCompleted = allTasks.every(t => t.status === 'COMPLETED' || t.status === 'CANCELLED');

      \1 {\n  \2{
        await prisma.housekeepingRequest.update({
          where: { id: task.requestId },
          data: {
            status: 'COMPLETED',
            completedDate: new Date()
          }
        });

        // Send notification that request is complete
        await this.notificationService.sendNotification({
          type: 'HOUSEKEEPING_REQUEST_COMPLETED',
          \1,\2 `Request for ${updatedTask.request.location.name} has been completed`,
          recipientIds: [updatedTask.request.requestedById],
          \1,\2 {
            requestId: task.requestId,
            locationId: updatedTask.request.locationId
          }
        });
      }
    }

    return updatedTask;
  }

  /**
   * Get housekeeping schedules;
   */
  async getHousekeepingSchedules(locationId?: string) {
    const where: unknown = {};
    \1 {\n  \2here.locationId = locationId;

    return prisma.housekeepingSchedule.findMany({
      where,
      include: {
        location: true,
        createdByUser: {
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
   * Create a housekeeping schedule;
   */
  async createHousekeepingSchedule(data: unknown, userId: string): Promise<HousekeepingSchedule> {
    const { locationId, scheduleType, frequency, dayOfWeek, timeOfDay, taskTemplate } = data;

    // Validate location exists
    const location = await prisma.location.findUnique({
      where: { id: locationId }
    });

    \1 {\n  \2{
      throw new Error('Location not found');
    }

    // Calculate next run date
    const nextRun = this.calculateNextRunDate(scheduleType, frequency, dayOfWeek, timeOfDay);

    const schedule = await prisma.housekeepingSchedule.create({
      data: {
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
        location: true,
        createdByUser: {
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
      details: `Created ${scheduleType} housekeeping schedule for ${location.name}`;
    });

    return schedule;
  }

  /**
   * Update a housekeeping schedule;
   */
  async updateHousekeepingSchedule(id: string, data: unknown, userId: string): Promise<HousekeepingSchedule> {
    const schedule = await prisma.housekeepingSchedule.findUnique({
      where: { id },
      include: { location: true }
    });

    \1 {\n  \2{
      throw new Error('Housekeeping schedule not found');
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

    const updatedSchedule = await prisma.housekeepingSchedule.update({
      where: { id },
      data,
      include: {
        location: true,
        createdByUser: {
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
      details: `Updated housekeeping schedule for ${schedule.location.name}`;
    });

    return updatedSchedule;
  }

  /**
   * Process due housekeeping schedules and create requests;
   */
  async processDueSchedules(userId: string): Promise<number> {
    const now = new Date();

    // Find all active schedules that are due
    const dueSchedules = await prisma.housekeepingSchedule.findMany({
      where: {
        isActive: true,
        nextRun: {
          lte: now
        }
      },
      include: {
        location: true
      }
    });

    let createdCount = 0;

    // Process each due schedule
    for (const schedule of dueSchedules) {
      try {
        // Create a new request based on the schedule
        await prisma.housekeepingRequest.create({
          data: {
            locationId: schedule.locationId,
            \1,\2 `Scheduled ${schedule.scheduleType.toLowerCase()} cleaning for ${schedule.location.name}`,
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

        await prisma.housekeepingSchedule.update({
          where: { id: schedule.id },
          data: {
            lastRun,
            nextRun;
          }
        });
      } catch (error) {

        // Continue with other schedules even if one fails
      }
    }

    return createdCount;
  }

  /**
   * Get housekeeping inspections;
   */
  async getHousekeepingInspections(filter: unknown) {
    const { locationId, status, startDate, endDate, page, limit } = filter;
    const skip = (page - 1) * limit;

    const where: unknown = {};
    \1 {\n  \2here.locationId = locationId;
    \1 {\n  \2here.status = status;

    // Date range filter
    \1 {\n  \2{
      where.inspectionDate = {};
      \1 {\n  \2here.inspectionDate.gte = startDate;
      \1 {\n  \2here.inspectionDate.lte = endDate;
    }

    const [inspections, total] = await Promise.all([
      prisma.housekeepingInspection.findMany({
        where,
        include: {
          location: true,
          inspector: {
            select: {
              id: true,
              \1,\2 true
            }
          }
        },
        skip,
        take: limit,
        orderBy: { inspectionDate: 'desc' }
      }),
      prisma.housekeepingInspection.count({ where })
    ]);

    // Convert to FHIR format if requested
    const fhirInspections = inspections.map(inspection => toFHIRHousekeepingInspection(inspection));

    return {
      data: inspections,
      \1,\2 {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Create a housekeeping inspection;
   */
  async createHousekeepingInspection(data: unknown, userId: string): Promise<HousekeepingInspection> {
    const { locationId, inspectionType, inspectorId, score, status, findings, recommendations, inspectionDate } = data;

    // Validate location exists
    const location = await prisma.location.findUnique({
      where: { id: locationId }
    });

    \1 {\n  \2{
      throw new Error('Location not found');
    }

    const inspection = await prisma.housekeepingInspection.create({
      data: {
        locationId,
        inspectionType,
        inspectorId: inspectorId || userId;
        score,
        status,
        findings,
        recommendations,
        inspectionDate: inspectionDate || new Date()
      },
      include: {
        location: true,
        inspector: {
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
      \1,\2 inspection.id;
      userId,
      details: `Created ${inspectionType} inspection for ${location.name}`;
    });

    // If inspection failed, create a follow-up cleaning request
    \1 {\n  \2 {
      await this.createHousekeepingRequest({
        locationId,
        requestType: 'DEEP_CLEANING',
        \1,\2 'HIGH',
        \1,\2 new Date(crypto.getRandomValues(new Uint32Array(1))[0] + 24 * 60 * 60 * 1000), // Schedule for next day
        notes: `Inspection ID: ${inspection.id}\nFindings: ${findings || 'None provided'}`;
      });

      // Send notification about failed inspection
      await this.notificationService.sendNotification({
        type: 'HOUSEKEEPING_INSPECTION_FAILED',
        \1,\2 `Location ${location.name} failed inspection. Follow-up cleaning has been scheduled.`,
        recipientRoles: ['HOUSEKEEPING_MANAGER'],
        \1,\2 {
          inspectionId: inspection.id,
          \1,\2 score
        }
      });
    }

    return inspection;
  }

  /**
   * Get housekeeping inventory items;
   */
  async getHousekeepingInventory(filter: unknown) {
    const { itemType, lowStock, page, limit } = filter;
    const skip = (page - 1) * limit;

    const where: unknown = {};
    \1 {\n  \2here.itemType = itemType;
    \1 {\n  \2{
      where.currentStock = {
        lte: prisma.housekeepingInventory.fields.minimumStock
      };
    }

    const [items, total] = await Promise.all([
      prisma.housekeepingInventory.findMany({
        where,
        skip,
        take: limit,
        orderBy: { itemName: 'asc' }
      }),
      prisma.housekeepingInventory.count({ where })
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
  async updateInventoryItem(id: string, data: Partial<HousekeepingInventory>, userId: string): Promise<HousekeepingInventory> {
    const item = await prisma.housekeepingInventory.findUnique({
      where: { id }
    });

    \1 {\n  \2{
      throw new Error('Inventory item not found');
    }

    // If restocking, update lastRestocked date
    \1 {\n  \2{
      data.lastRestocked = new Date();
    }

    const updatedItem = await prisma.housekeepingInventory.update({
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
        type: 'HOUSEKEEPING_INVENTORY_LOW',
        \1,\2 `${updatedItem.itemName} is running low (/* SECURITY: Template literal eliminated */
        recipientRoles: ['HOUSEKEEPING_MANAGER', 'INVENTORY_MANAGER'],
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
   * Get housekeeping analytics;
   */
  async getHousekeepingAnalytics(period: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY') {
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
    const requestsByStatus = await prisma.housekeepingRequest.groupBy({
      by: ['status'],
      where: {
        createdAt: {
          gte: startDate
        }
      },
      _count: true
    });

    // Get request counts by type
    const requestsByType = await prisma.housekeepingRequest.groupBy({
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
      FROM "HousekeepingRequest";
      WHERE "status" = 'COMPLETED';
      AND "createdAt" >= ${startDate}
      AND "completedDate" IS NOT NULL;
    `;

    // Get inspection scores over time
    const inspectionScores = await prisma.housekeepingInspection.findMany({
      where: {
        inspectionDate: {
          gte: startDate
        },
        score: {
          not: null
        }
      },
      select: {
        inspectionDate: true,
        \1,\2 true,
        location: 
            name: true
      },
      orderBy: {
        inspectionDate: 'asc'
      }
    });

    // Get top 5 locations with most requests
    const topLocations = await prisma.housekeepingRequest.groupBy({
      by: ['locationId'],
      where: {
        createdAt: {
          gte: startDate
        }
      },
      _count: true,
      orderBy: {
        _count: {
          locationId: 'desc'
        }
      },
      take: 5
    });

    // Get location details for top locations
    const locationDetails = await prisma.location.findMany({
      where: {
        id: {
          in: topLocations.map(loc => loc.locationId)
        }
      },
      select: {
        id: true,
        name: true
      }
    });

    // Map location names to the top locations
    const topLocationsWithNames = topLocations.map(loc => ({
      locationId: loc.locationId,
      \1,\2 locationDetails.find(l => l.id === loc.locationId)?.name || 'Unknown'
    }));

    return {
      requestsByStatus,
      requestsByType,
      completionTime,
      inspectionScores,
      topLocations: topLocationsWithNames;
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
      // Default to 8:00 AM
      result.setHours(8),
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
