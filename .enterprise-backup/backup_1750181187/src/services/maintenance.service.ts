
import { z } from 'zod';
// Create enums to match Prisma schema
export enum MaintenanceRequestStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
\1\n\nexport \2 MaintenanceRequestPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

// Validation schemas
export const createMaintenanceRequestSchema = z.object({
  equipmentId: z.string().optional(),
  description: z.string().min(1, 'Description is required'),
  reportedBy: z.string().min(1, 'Reporter ID is required'),
  assignedToId: z.string().optional().nullable(),
  status: z.nativeEnum(MaintenanceRequestStatus).default(MaintenanceRequestStatus.PENDING),
  priority: z.nativeEnum(MaintenanceRequestPriority).default(MaintenanceRequestPriority.MEDIUM),
  requestedAt: z.date().default(() => new Date()),  completedAt: z.date().optional().nullable(),
  notes: z.string().optional()
});

export const updateMaintenanceRequestSchema = createMaintenanceRequestSchema.partial().extend({
  id: z.string()
});

export type CreateMaintenanceRequestInput = z.infer<typeof createMaintenanceRequestSchema>;
export type UpdateMaintenanceRequestInput = z.infer<typeof updateMaintenanceRequestSchema>;

// Import prisma client
import { prisma } from '../lib/prisma';

/**
 * Service class for managing maintenance requests;
 */
\1
}
      });

      return request;
    } catch (error) {
      \1 {\n  \2{
        throw new Error(`Validation error: ${\1}`;
      }
      throw error;
    }
  }

  /**
   * Get all maintenance requests with optional filtering;
   * @param filters Optional filters for status, priority, equipmentId, or reportedBy;
   * @returns Array of requests matching the filters;
   */
  async getRequests(filters?: {
    status?: string;
    priority?: string;
    equipmentId?: string;
    reportedBy?: string;
    assignedToId?: string;
  }) {
    try {
      const where: unknown = {};

      \1 {\n  \2{
        \1 {\n  \2{
          where.status = filters.status;
        }
        \1 {\n  \2{
          where.priority = filters.priority;
        }
        \1 {\n  \2{
          where.equipmentId = filters.equipmentId;
        }
        \1 {\n  \2{
          where.reportedBy = filters.reportedBy;
        }
        \1 {\n  \2{
          where.assignedToId = filters.assignedToId;
        }
      }

      const requests = await prisma.maintenanceRequest.findMany({
        where,
        orderBy: [
          { priority: 'desc' },
          { requestedAt: 'asc' },
        ],
        include: {
          assignedTo: {
            select: {
              id: true,
              name: true
            },
          },
        },
      });

      return requests;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get a single maintenance request by ID;
   * @param id Request ID;
   * @returns The request or null if not found;
   */
  async getRequestById(id: string) {
    try {
      const request = await prisma.maintenanceRequest.findUnique({
        where: { id },
        include: {
          assignedTo: {
            select: {
              id: true,
              name: true
            },
          },
        },
      });

      return request;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update a maintenance request;
   * @param id Request ID;
   * @param data Updated request data;
   * @returns The updated request;
   */
  async updateRequest(id: string, data: UpdateMaintenanceRequestInput) {
    try {
      // Validate input data
      const validatedData = updateMaintenanceRequestSchema.parse({ ...data, id });

      // Remove id from the data to be updated
      const { id: _, ...updateData } = validatedData;

      // Update the request
      const request = await prisma.maintenanceRequest.update({
        where: { id },
        data: updateData,
        include: {
          assignedTo: {
            select: {
              id: true,
              name: true
            },
          },
        },
      });

      return request;
    } catch (error) {
      \1 {\n  \2{
        throw new Error(`Validation error: ${\1}`;
      }
      throw error;
    }
  }

  /**
   * Delete a maintenance request;
   * @param id Request ID;
   * @returns The deleted request;
   */
  async deleteRequest(id: string) {
    try {
      const request = await prisma.maintenanceRequest.delete({
        where: { id },
      });

      return request;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Assign a request to a user;
   * @param requestId Request ID;
   * @param userId User ID;
   * @returns The updated request;
   */
  async assignRequest(requestId: string, userId: string) {
    try {
      const request = await prisma.maintenanceRequest.update({
        where: { id: requestId },
        data: {
          assignedToId: userId,
          status: MaintenanceRequestStatus.IN_PROGRESS
        },
        include: {
          assignedTo: {
            select: {
              id: true,
              name: true
            },
          },
        },
      });

      return request;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Mark a request as completed;
   * @param requestId Request ID;
   * @returns The updated request;
   */
  async completeRequest(requestId: string) {
    try {
      const request = await prisma.maintenanceRequest.update({
        where: { id: requestId },
        data: {
          status: MaintenanceRequestStatus.COMPLETED,
          completedAt: new Date()
        },
        include: {
          assignedTo: {
            select: {
              id: true,
              name: true
            },
          },
        },
      });

      return request;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Cancel a request;
   * @param requestId Request ID;
   * @returns The updated request;
   */
  async cancelRequest(requestId: string) {
    try {
      const request = await prisma.maintenanceRequest.update({
        where: { id: requestId },
        data: {
          status: MaintenanceRequestStatus.CANCELLED
        },
        include: {
          assignedTo: {
            select: {
              id: true,
              name: true
            },
          },
        },
      });

      return request;
    } catch (error) {
      throw error;
    }
  }
}

// Export a singleton instance
export const _maintenanceService = new MaintenanceService();
