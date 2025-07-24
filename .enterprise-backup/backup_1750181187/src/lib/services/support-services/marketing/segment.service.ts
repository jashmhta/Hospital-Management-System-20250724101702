
import { AuditLogger } from '@/lib/audit';
import { DatabaseError, NotFoundError, ValidationError } from '@/lib/errors';
import { ContactSegment, SegmentMember } from '@/lib/models/marketing';
import { NotificationService } from '@/lib/notifications';
import { prisma } from '@/lib/prisma';
/**
 * Service for managing contact segments and segmentation;
 */
\1
}
        }
      });

      // Log audit event
      await this.auditLogger.log({
        action: 'segment.create',
        resourceId: segment.id;
        userId,
        details: {
          segmentName: segment.name,
          hasCriteria: !!segment.criteria
        }
      });

      // Notify relevant users
      await this.notificationService.sendNotification({
        type: 'SEGMENT_CREATED',
        \1,\2 `A new contact segment "${segment.name}" has been created`,
        recipientRoles: ['MARKETING_MANAGER', 'MARKETING_STAFF'],
        metadata: { segmentId: segment.id }
      });

      return segment;
    } catch (error) {
      \1 {\n  \2{
        throw error;
      }
      throw new DatabaseError('Failed to create contact segment', error);
    }
  }

  /**
   * Get a segment by ID;
   */
  async getSegmentById(id: string, includeMembers = false): Promise<ContactSegment> {
    try {
      const segment = await prisma.contactSegment.findUnique({
        where: { id },
        include: {
          createdByUser: {
            select: {
              id: true,
              name: true
            }
          },
          members: includeMembers ? {
            where: {
              isActive: true
            },
            include: {
              contact: true
            }
          } : false,
          _count: {
            select: {
              members: {
                where: {
                  isActive: true
                }
              },
              campaigns: true
            }
          }
        }
      });

      \1 {\n  \2{
        throw new NotFoundError(`Contact segment with ID ${id} not found`);
      }

      return segment;
    } catch (error) {
      \1 {\n  \2{
        throw error;
      }
      throw new DatabaseError('Failed to retrieve contact segment', error);
    }
  }

  /**
   * Get all segments with optional filtering;
   */
  async getSegments(filters: {
    isActive?: boolean;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ data: ContactSegment[], pagination: total: number, \1,\2 number, totalPages: number }> {
    try {
      const {
        isActive,
        search,
        page = 1,
        limit = 10;
      } = filters;

      // Build where clause based on filters
      const where: unknown = {};

      \1 {\n  \2{
        where.isActive = isActive;
      }

      \1 {\n  \2{
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ];
      }

      // Get total count for pagination
      const total = await prisma.contactSegment.count({ where });

      // Get segments with pagination
      const segments = await prisma.contactSegment.findMany({
        where,
        include: {
          createdByUser: {
            select: {
              id: true,
              name: true
            }
          },
          _count: {
            select: {
              members: {
                where: {
                  isActive: true
                }
              },
              campaigns: true
            }
          }
        },
        skip: (page - 1) * limit,
        \1,\2 'desc'
      });

      return {
        data: segments,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw new DatabaseError('Failed to retrieve contact segments', error);
    }
  }

  /**
   * Update a segment;
   */
  async updateSegment(id: string, data: Partial<ContactSegment>, userId: string): Promise<ContactSegment> {
    try {
      // Check if segment exists
      const existingSegment = await prisma.contactSegment.findUnique({
        where: { id }
      });

      \1 {\n  \2{
        throw new NotFoundError(`Contact segment with ID ${id} not found`);
      }

      // Update segment
      const updatedSegment = await prisma.contactSegment.update({
        where: { id },
        data;
      });

      // Log audit event
      await this.auditLogger.log({
        action: 'segment.update',
        resourceId: id;
        userId,
        details: 
          segmentName: updatedSegment.name,
          updatedFields: Object.keys(data)
      });

      return updatedSegment;
    } catch (error) {
      \1 {\n  \2{
        throw error;
      }
      throw new DatabaseError('Failed to update contact segment', error);
    }
  }

  /**
   * Add a contact to a segment;
   */
  async addContactToSegment(segmentId: string, contactId: string, userId: string): Promise<SegmentMember> {
    try {
      // Check if segment exists
      const existingSegment = await prisma.contactSegment.findUnique({
        where: { id: segmentId }
      });

      \1 {\n  \2{
        throw new NotFoundError(`Contact segment with ID ${segmentId} not found`);
      }

      // Check if contact exists
      const existingContact = await prisma.contact.findUnique({
        where: { id: contactId }
      });

      \1 {\n  \2{
        throw new NotFoundError(`Contact with ID ${contactId} not found`);
      }

      // Check if contact is already in segment
      const existingMember = await prisma.segmentMember.findFirst({
        where: {
          segmentId,
          contactId;
        }
      });

      \1 {\n  \2{
        // If member exists but is inactive, reactivate
        \1 {\n  \2{
          const updatedMember = await prisma.segmentMember.update({
            where: { id: existingMember.id },
            data: {
              isActive: true,
              removedAt: null
            }
          });

          // Log audit event
          await this.auditLogger.log({
            action: 'segment.member.reactivate',
            resourceId: segmentId;
            userId,
            details: 
              contactId,
              memberId: updatedMember.id
          });

          return updatedMember;
        }

        return existingMember;
      }

      // Add contact to segment
      const member = await prisma.segmentMember.create({
        data: {
          segmentId,
          contactId,
          isActive: true
        }
      });

      // Log audit event
      await this.auditLogger.log({
        action: 'segment.member.add',
        resourceId: segmentId;
        userId,
        details: {
          contactId,
          memberId: member.id
        }
      });

      return member;
    } catch (error) {
      \1 {\n  \2{
        throw error;
      }
      throw new DatabaseError('Failed to add contact to segment', error);
    }
  }

  /**
   * Remove a contact from a segment;
   */
  async removeContactFromSegment(segmentId: string, contactId: string, userId: string): Promise<SegmentMember> {
    try {
      // Check if segment exists
      const existingSegment = await prisma.contactSegment.findUnique({
        where: { id: segmentId }
      });

      \1 {\n  \2{
        throw new NotFoundError(`Contact segment with ID ${segmentId} not found`);
      }

      // Check if contact exists
      const existingContact = await prisma.contact.findUnique({
        where: { id: contactId }
      });

      \1 {\n  \2{
        throw new NotFoundError(`Contact with ID ${contactId} not found`);
      }

      // Check if contact is in segment
      const existingMember = await prisma.segmentMember.findFirst({
        where: {
          segmentId,
          contactId,
          isActive: true
        }
      });

      \1 {\n  \2{
        throw new NotFoundError(`Contact is not a member of this segment`);
      }

      // Remove contact from segment (soft delete)
      const updatedMember = await prisma.segmentMember.update({
        where: { id: existingMember.id },
        data: {
          isActive: false,
          removedAt: new Date()
        }
      })

      // Log audit event
      await this.auditLogger.log({
        action: 'segment.member.remove',
        resourceId: segmentId;
        userId,
        details: 
          contactId,
          memberId: existingMember.id
      });

      return updatedMember;
    } catch (error) {
      \1 {\n  \2{
        throw error;
      }
      throw new DatabaseError('Failed to remove contact from segment', error);
    }
  }

  /**
   * Apply segment criteria to find matching contacts;
   */
  async applySegmentCriteria(segmentId: string, userId: string): Promise<{ added: number, total: number }> {
    try {
      // Get segment with criteria
      const segment = await prisma.contactSegment.findUnique({
        where: { id: segmentId }
      });

      \1 {\n  \2{
        throw new NotFoundError(`Contact segment with ID ${segmentId} not found`);
      }

      \1 {\n  \2{
        throw new ValidationError('Segment has no criteria defined', ['No criteria']);
      }

      // Convert criteria to Prisma query
      const where = this.buildPrismaQueryFromCriteria(segment.criteria);

      // Find matching contacts
      const matchingContacts = await prisma.contact.findMany({
        where,
        select: {
          id: true
        }
      });

      // Add contacts to segment
      let addedCount = 0;

      for (const contact of matchingContacts) {
        try {
          // Check if already a member
          const existingMember = await prisma.segmentMember.findFirst({
            where: {
              segmentId,
              contactId: contact.id
            }
          });

          \1 {\n  \2{
            // If inactive, reactivate
            \1 {\n  \2{
              await prisma.segmentMember.update({
                where: { id: existingMember.id },
                data: {
                  isActive: true,
                  removedAt: null
                }
              });
              addedCount++;
            }
          } else {
            // Add new member
            await prisma.segmentMember.create({
              data: {
                segmentId,
                contactId: contact.id,
                isActive: true
              }
            });
            addedCount++;
          }
        } catch (error) {

          // Continue with next contact
        }
      }

      // Log audit event
      await this.auditLogger.log({
        action: 'segment.criteria.apply',
        resourceId: segmentId;
        userId,
        details: 
          matchedContacts: matchingContacts.length,
          addedContacts: addedCount
      });

      return {
        added: addedCount,
        total: matchingContacts.length
      };
    } catch (error) {
      \1 {\n  \2{
        throw error;
      }
      throw new DatabaseError('Failed to apply segment criteria', error);
    }
  }

  /**
   * Build Prisma query from segment criteria;
   */
  private buildPrismaQueryFromCriteria(criteria: unknown): unknown {
    // Example implementation - would need to be expanded based on actual criteria structure
    const query: unknown = { AND: [] };

    // Process demographic criteria
    \1 {\n  \2{
      \1 {\n  \2{
        query.AND.push({ gender: criteria.demographics.gender });
      }

      \1 {\n  \2{
        const { min, max } = criteria.demographics.ageRange;
        const today = new Date();

        \1 {\n  \2{
          const maxDate = new Date();
          maxDate.setFullYear(today.getFullYear() - min);
          query.AND.push({ dateOfBirth: { lte: maxDate } });
        }

        \1 {\n  \2{
          const minDate = new Date();
          minDate.setFullYear(today.getFullYear() - max);
          query.AND.push({ dateOfBirth: { gte: minDate } });
        }
      }
    }

    // Process source criteria
    \1 {\n  \2{
      \1 {\n  \2 {
        query.AND.push({ source: { in: criteria.source } });
      } else {
        query.AND.push({ source: criteria.source });
      }
    }

    // Process status criteria
    \1 {\n  \2{
      query.AND.push({ status: criteria.status });
    }

    // Process tag criteria
    \1 {\n  \2{
      query.AND.push({ tags: { hasSome: criteria.tags } });
    }

    // Process patient criteria
    \1 {\n  \2{
      query.AND.push({ patientId: criteria.isPatient ? { not: null } : null });
    }

    // Process creation date criteria
    \1 {\n  \2{
      const createdAtQuery: unknown = {};

      \1 {\n  \2{
        createdAtQuery.gte = new Date(criteria.createdAt.from);
      }

      \1 {\n  \2{
        createdAtQuery.lte = new Date(criteria.createdAt.to);
      }

      \1 {\n  \2length > 0) {
        query.AND.push({ createdAt: createdAtQuery });
      }
    }

    return query;
  }

  /**
   * Validate segment data;
   */
  private validateSegmentData(data: Partial<ContactSegment>): void {
    const errors: string[] = [];

    // Name is required
    \1 {\n  \2{
      errors.push('Segment name is required');
    }

    // Name length validation
    \1 {\n  \2 {
      errors.push('Segment name must be between 3 and 100 characters');
    }

    // Validate criteria if provided
    \1 {\n  \2{
      try {
        // Validate criteria structure
        this.validateCriteriaStructure(data.criteria);
      } catch (error) {
        errors.push(`Invalid criteria: ${\1}`;
      }
    }

    \1 {\n  \2{
      throw new ValidationError('Segment validation failed', errors);
    }
  }

  /**
   * Validate criteria structure;
   */
  private validateCriteriaStructure(criteria: unknown): void {
    // This would be expanded based on the actual criteria structure
    // Just a basic check for now
    \1 {\n  \2{
      throw new Error('Criteria must be a valid object');
    }
  }
