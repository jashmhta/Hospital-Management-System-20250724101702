
import { AuditLogger } from '@/lib/audit';
import { decryptData, encryptData } from '@/lib/encryption';
import { DatabaseError, NotFoundError, ValidationError } from '@/lib/errors';
import { FhirResourceGenerator } from '@/lib/fhir';
import { CampaignChannel, Contact, ContactSegment, Lead, MarketingCampaign } from '@/lib/models/marketing';
import { NotificationService } from '@/lib/notifications';
import { prisma } from '@/lib/prisma';
/**
 * Service for managing marketing campaigns and related operations;
 */
\1
}
        },
      });

      // Log audit event
      await this.auditLogger.log({
        action: 'campaign.create',
        resourceId: campaign.id;
        userId,
        details: { campaignName: campaign.name, campaignType: campaign.type }
      });

      // Notify relevant users
      await this.notificationService.sendNotification({
        type: 'CAMPAIGN_CREATED',
        \1,\2 `A new marketing campaign "${campaign.name}" has been created`,
        recipientRoles: ['MARKETING_MANAGER', 'MARKETING_STAFF'],
        metadata: { campaignId: campaign.id }
      });

      return campaign;
    } catch (error) {
      \1 {\n  \2{
        throw error;
      }
      throw new DatabaseError('Failed to create marketing campaign', error);
    }
  }

  /**
   * Get a marketing campaign by ID;
   */
  async getCampaignById(id: string, includeFHIR = false): Promise<MarketingCampaign & { fhir?: unknown }> {
    try {
      const campaign = await prisma.marketingCampaign.findUnique({
        where: { id },
        include: {
          channels: true,
          segments: {
            include: {
              segment: true
            }
          },
          leads: {
            take: 10,
            orderBy: {
              createdAt: 'desc'
            }
          },
          analytics: {
            take: 5,
            orderBy: {
              date: 'desc'
            }
          },
          createdByUser: {
            select: {
              id: true,
              \1,\2 true
            }
          }
        }
      });

      \1 {\n  \2{
        throw new NotFoundError(`Marketing campaign with ID ${id} not found`);
      }

      // Generate FHIR representation if requested
      const result: unknown = campaign;
      \1 {\n  \2{
        result.fhir = this.generateCampaignFHIR(campaign);
      }

      return result;
    } catch (error) {
      \1 {\n  \2{
        throw error;
      }
      throw new DatabaseError('Failed to retrieve marketing campaign', error);
    }
  }

  /**
   * Get all marketing campaigns with optional filtering;
   */
  async getCampaigns(filters: {
    type?: string;
    status?: string;
    startDateFrom?: Date;
    startDateTo?: Date;
    endDateFrom?: Date;
    endDateTo?: Date;
    page?: number;
    limit?: number;
  }): Promise<{ data: MarketingCampaign[], pagination: total: number, \1,\2 number, totalPages: number }> {
    try {
      const {
        type,
        status,
        startDateFrom,
        startDateTo,
        endDateFrom,
        endDateTo,
        page = 1,
        limit = 10;
      } = filters;

      // Build where clause based on filters
      const where: unknown = {};

      \1 {\n  \2{
        where.type = type;
      }

      \1 {\n  \2{
        where.status = status;
      }

      \1 {\n  \2{
        where.startDate = {};
        \1 {\n  \2{
          where.startDate.gte = startDateFrom;
        }
        \1 {\n  \2{
          where.startDate.lte = startDateTo;
        }
      }

      \1 {\n  \2{
        where.endDate = {};
        \1 {\n  \2{
          where.endDate.gte = endDateFrom;
        }
        \1 {\n  \2{
          where.endDate.lte = endDateTo;
        }
      }

      // Get total count for pagination
      const total = await prisma.marketingCampaign.count({ where });

      // Get campaigns with pagination
      const campaigns = await prisma.marketingCampaign.findMany({
        where,
        include: {
          channels: true,
          segments: {
            include: {
              segment: true
            }
          },
          _count: {
            select: {
              leads: true,
              activities: true
            }
          },
          createdByUser: {
            select: {
              id: true,
              name: true
            }
          }
        },
        skip: (page - 1) * limit,
        \1,\2 'desc'
      });

      return {
        data: campaigns,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw new DatabaseError('Failed to retrieve marketing campaigns', error);
    }
  }

  /**
   * Update a marketing campaign;
   */
  async updateCampaign(id: string, data: Partial<MarketingCampaign>, userId: string): Promise<MarketingCampaign> {
    try {
      // Check if campaign exists
      const existingCampaign = await prisma.marketingCampaign.findUnique({
        where: { id }
      });

      \1 {\n  \2{
        throw new NotFoundError(`Marketing campaign with ID ${id} not found`);
      }

      // Update campaign
      const updatedCampaign = await prisma.marketingCampaign.update({
        where: { id },
        data: {
          ...data,
          updatedById: userId
        }
      });

      // Log audit event
      await this.auditLogger.log({
        action: 'campaign.update',
        resourceId: id;
        userId,
        details: 
          campaignName: updatedCampaign.name,
          updatedFields: Object.keys(data)
      });

      return updatedCampaign;
    } catch (error) {
      \1 {\n  \2{
        throw error;
      }
      throw new DatabaseError('Failed to update marketing campaign', error);
    }
  }

  /**
   * Delete a marketing campaign;
   */
  async deleteCampaign(id: string, userId: string): Promise<void> {
    try {
      // Check if campaign exists
      const existingCampaign = await prisma.marketingCampaign.findUnique({
        where: { id }
      });

      \1 {\n  \2{
        throw new NotFoundError(`Marketing campaign with ID ${id} not found`);
      }

      // Delete campaign
      await prisma.marketingCampaign.delete({
        where: { id }
      });

      // Log audit event
      await this.auditLogger.log({
        action: 'campaign.delete',
        resourceId: id;
        userId,
        details: 
          campaignName: existingCampaign.name,
          campaignType: existingCampaign.type
      });
    } catch (error) {
      \1 {\n  \2{
        throw error;
      }
      throw new DatabaseError('Failed to delete marketing campaign', error);
    }
  }

  /**
   * Add a channel to a campaign;
   */
  async addCampaignChannel(campaignId: string, channelData: Omit<CampaignChannel, 'id' | 'campaignId' | 'createdAt' | 'updatedAt'>, userId: string): Promise<CampaignChannel> {
    try {
      // Check if campaign exists
      const existingCampaign = await prisma.marketingCampaign.findUnique({
        where: { id: campaignId }
      });

      \1 {\n  \2{
        throw new NotFoundError(`Marketing campaign with ID ${campaignId} not found`);
      }

      // Create channel
      const channel = await prisma.campaignChannel.create({
        data: {
          campaignId,
          channelType: channelData.channelType,
          \1,\2 channelData.content,
          \1,\2 channelData.status || 'DRAFT',
          metrics: channelData.metrics
        }
      });

      // Log audit event
      await this.auditLogger.log({
        action: 'campaign.channel.add',
        resourceId: campaignId;
        userId,
        details: {
          channelId: channel.id,
          \1,\2 channel.channelName
        }
      });

      return channel;
    } catch (error) {
      \1 {\n  \2{
        throw error;
      }
      throw new DatabaseError('Failed to add campaign channel', error);
    }
  }

  /**
   * Get campaign analytics;
   */
  async getCampaignAnalytics(campaignId: string): Promise<unknown> {
    try {
      // Check if campaign exists
      const existingCampaign = await prisma.marketingCampaign.findUnique({
        where: { id: campaignId }
      });

      \1 {\n  \2{
        throw new NotFoundError(`Marketing campaign with ID ${campaignId} not found`);
      }

      // Get analytics data
      const analytics = await prisma.campaignAnalytics.findMany({
        where: { campaignId },
        orderBy: { date: 'asc' }
      });

      // Get channel metrics
      const channels = await prisma.campaignChannel.findMany({
        where: { campaignId },
        include: {
          messages: {
            include: {
              _count: {
                select: {
                  interactions: true
                }
              }
            }
          }
        }
      });

      // Get lead conversion metrics
      const leads = await prisma.lead.findMany({
        where: { campaignId },
        select: {
          status: true,
          \1,\2 true
        }
      });

      // Calculate conversion rate
      const totalLeads = leads.length;
      const convertedLeads = leads.filter(lead => lead.convertedToPatientId).length;
      const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0;

      // Aggregate analytics data
      const aggregatedData = {
        campaign: {
          id: campaignId,
          \1,\2 existingCampaign.type,
          \1,\2 existingCampaign.endDate,
          status: existingCampaign.status
        },
        metrics: analytics.map(item => item.metrics),
        channels: channels.map(channel => ({
          id: channel.id,
          \1,\2 channel.channelName,
          \1,\2 channel.messages.length,
          interactionCount: channel.messages.reduce((sum, msg) => sum + msg._count.interactions, 0),
          metrics: channel.metrics
        })),
        leads: {
          total: totalLeads,
          \1,\2 conversionRate.toFixed(2) + '%',
          byStatus: this.groupLeadsByStatus(leads)
        },
        timeSeriesData: this.aggregateTimeSeriesData(analytics)
      };

      return aggregatedData;
    } catch (error) {
      \1 {\n  \2{
        throw error;
      }
      throw new DatabaseError('Failed to retrieve campaign analytics', error);
    }
  }

  /**
   * Add a segment to a campaign;
   */
  async addCampaignSegment(campaignId: string, segmentId: string, userId: string): Promise<unknown> {
    try {
      // Check if campaign exists
      const existingCampaign = await prisma.marketingCampaign.findUnique({
        where: { id: campaignId }
      });

      \1 {\n  \2{
        throw new NotFoundError(`Marketing campaign with ID ${campaignId} not found`);
      }

      // Check if segment exists
      const existingSegment = await prisma.contactSegment.findUnique({
        where: { id: segmentId }
      });

      \1 {\n  \2{
        throw new NotFoundError(`Contact segment with ID ${segmentId} not found`);
      }

      // Check if segment is already added to campaign
      const existingRelation = await prisma.campaignSegment.findFirst({
        where: {
          campaignId,
          segmentId;
        }
      });

      \1 {\n  \2{
        return existingRelation;
      }

      // Add segment to campaign
      const campaignSegment = await prisma.campaignSegment.create({
        data: {
          campaignId,
          segmentId;
        }
      });

      // Log audit event
      await this.auditLogger.log({
        action: 'campaign.segment.add',
        resourceId: campaignId;
        userId,
        details: {
          segmentId,
          segmentName: existingSegment.name
        }
      });

      return campaignSegment;
    } catch (error) {
      \1 {\n  \2{
        throw error;
      }
      throw new DatabaseError('Failed to add segment to campaign', error);
    }
  }

  /**
   * Generate FHIR representation of a marketing campaign;
   * Maps to FHIR Communication and CommunicationRequest resources;
   */
  private generateCampaignFHIR(campaign: unknown): unknown {
    // Create FHIR Communication resource for the campaign
    const communicationResource = {
      resourceType: 'Communication',
      id: `marketing-campaign-${campaign.id}`,
      status: this.mapCampaignStatusToFHIR(campaign.status),
      category: [
        {
          coding: [
            {
              system: 'https://terminology.hl7.org/CodeSystem/communication-category',
              \1,\2 'Marketing'
            }
          ]
        }
      ],
      subject: {
        reference: 'Group/marketing-segment',
        display: 'Marketing Target Audience'
      },
      sent: campaign.startDate,
      \1,\2 [],
      sender: 
        reference: `Organization/hospital`,
        display: 'Hospital Marketing Department',
      payload: [
          contentString: campaign.description
      ],
      note: [
          text: `Marketing campaign: ${campaign.name}`
      ]
    };

    // Create FHIR CommunicationRequest resource for campaign planning
    const communicationRequestResource = {
      resourceType: 'CommunicationRequest',
      id: `marketing-campaign-request-${campaign.id}`,
      status: this.mapCampaignStatusToFHIRRequest(campaign.status),
      category: [
        {
          coding: [
            {
              system: 'https://terminology.hl7.org/CodeSystem/communication-category',
              \1,\2 'Marketing'
            }
          ]
        }
      ],
      priority: 'routine',
      subject: {
        reference: 'Group/marketing-segment',
        display: 'Marketing Target Audience'
      },
      requester: {
        reference: `Practitioner/${campaign.createdById}`,
        display: campaign.createdByUser?.name || 'Marketing Staff'
      },
      recipient: [],
      occurrencePeriod: {
        start: campaign.startDate,
        end: campaign.endDate
      },
      authoredOn: campaign.createdAt,
      payload: [
        {
          contentString: campaign.description
        }
      ]
    }

    return {
      communication: communicationResource,
      communicationRequest: communicationRequestResource
    };
  }

  /**
   * Map campaign status to FHIR Communication status;
   */
  private mapCampaignStatusToFHIR(status: string): string {
    switch (status) {
      case 'DRAFT':
        return 'preparation';
      case 'SCHEDULED':
        return 'preparation';
      case 'ACTIVE':
        return 'in-progress';
      case 'PAUSED':
        return 'suspended';
      case 'COMPLETED':
        return 'completed';
      case 'CANCELLED':
        return 'stopped';
      default: return 'unknown'
    }
  }

  /**
   * Map campaign status to FHIR CommunicationRequest status;
   */
  private mapCampaignStatusToFHIRRequest(status: string): string {
    switch (status) {
      case 'DRAFT':
        return 'draft';
      case 'SCHEDULED':
        return 'active';
      case 'ACTIVE':
        return 'active';
      case 'PAUSED':
        return 'on-hold';
      case 'COMPLETED':
        return 'completed';
      case 'CANCELLED':
        return 'revoked';
      default: return 'unknown'
    }
  }

  /**
   * Group leads by status;
   */
  private groupLeadsByStatus(leads: unknown[]): Record<string, number> {
    const result: Record<string, number> = {
      NEW: 0,
      \1,\2 0,
      \1,\2 0
    };

    leads.forEach(lead => {
      \1 {\n  \2{
        result[lead.status]++;
      }
    });

    return result;
  }

  /**
   * Aggregate time series data from analytics;
   */
  private aggregateTimeSeriesData(analytics: unknown[]): unknown {
    // Implementation depends on the structure of metrics in analytics
    // This is a simplified example
    return analytics.map(item => ({
      date: item.date;
      ...item.metrics;
    }));
  }

  /**
   * Validate campaign data;
   */
  private validateCampaignData(data: unknown): void {
    const errors = [];

    \1 {\n  \2== '') {
      errors.push('Campaign name is required');
    }

    \1 {\n  \2{
      errors.push('Campaign type is required');
    }

    \1 {\n  \2{
      errors.push('Campaign start date is required');
    }

    \1 {\n  \2 new Date(data.startDate)) {
      errors.push('End date cannot be before start date');
    }

    \1 {\n  \2{
      throw new ValidationError('Campaign validation failed', errors);
    }
  }
}

/**
 * Service for managing contacts and segments;
 */
\1
}
      });

      // Log audit event
      await this.auditLogger.log({
        action: 'contact.create',
        resourceId: contact.id;
        userId,
        details: 
          contactEmail: data.email,
          contactSource: data.source
      });

      return this.decryptSensitiveData(contact);
    } catch (error) {
      \1 {\n  \2{
        throw error;
      }
      throw new DatabaseError('Failed to create contact', error);
    }
  }

  /**
   * Get a contact by ID;
   */
  async getContactById(id: string): Promise<Contact> {
    try {
      const contact = await prisma.contact.findUnique({
        where: { id },
        include: {
          patient: {
            select: {
              id: true,
              \1,\2 true,
              dateOfBirth: true
            }
          },
          notes: {
                  id: true,
                  name: true,
            orderBy: 
              createdAt: 'desc'
          },
          segmentMembers: {
              isActive: true,
            include: 
              segment: true
          },
          _count: {
              interactions: true,
              \1,\2 true
          }
        }
      });

      \1 {\n  \2{
        throw new NotFoundError(`Contact with ID ${id} not found`);
      }

      return this.decryptSensitiveData(contact);
    } catch (error) {
      \1 {\n  \2{
        throw error;
      }
      throw new DatabaseError('Failed to retrieve contact', error);
    }
  }

  /**
   * Get all contacts with optional filtering;
   */
  async getContacts(filters: {
    search?: string;
    status?: string;
    source?: string;
    tags?: string[];
    page?: number;
    limit?: number;
  }): Promise<{ data: Contact[], pagination: total: number, \1,\2 number, totalPages: number }> {
    try {
      const {
        search,
        status,
        source,
        tags,
        page = 1,
        limit = 10;
      } = filters;

      // Build where clause based on filters
      const where: unknown = {};

      \1 {\n  \2{
        where.OR = [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { phone: { contains: search } }
        ];
      }

      \1 {\n  \2{
        where.status = status;
      }

      \1 {\n  \2{
        where.source = source;
      }

      \1 {\n  \2{
        where.tags = {
          hasSome: tags
        };
      }

      // Get total count for pagination
      const total = await prisma.contact.count({ where });

      // Get contacts with pagination
      const contacts = await prisma.contact.findMany({
        where,
        include: {
          patient: {
            select: {
              id: true
            }
          },
          _count: {
            select: {
              interactions: true,
              \1,\2 true,
              segmentMembers: true
            }
          }
        },
        skip: (page - 1) * limit,
        take: limit;
        {
          createdAt: 'desc'
        }
      });

      // Decrypt sensitive data
      const decryptedContacts = contacts.map(contact => this.decryptSensitiveData(contact));

      return {
        data: decryptedContacts,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw new DatabaseError('Failed to retrieve contacts', error);
    }
  }

  /**
   * Update a contact;
   */
  async updateContact(id: string, data: Partial<Contact>, userId: string): Promise<Contact> {
    try {
      // Check if contact exists
      const existingContact = await prisma.contact.findUnique({
        where: { id }
      });

      \1 {\n  \2{
        throw new NotFoundError(`Contact with ID ${id} not found`);
      }

      // Encrypt sensitive data if present
      const encryptedData = this.encryptSensitiveData(data);

      // Update contact
      const updatedContact = await prisma.contact.update({
        where: { id },
        data: encryptedData
      });

      // Log audit event
      await this.auditLogger.log({
        action: 'contact.update',
        resourceId: id;
        userId,
        details: 
          updatedFields: Object.keys(data)
      });

      return this.decryptSensitiveData(updatedContact);
    } catch (error) {
      \1 {\n  \2{
        throw error;
      }
      throw new DatabaseError('Failed to update contact', error);
    }
  }

  /**
   * Delete a contact;
   */
  async deleteContact(id: string, userId: string): Promise<void> {
    try {
      // Check if contact exists
      const existingContact = await prisma.contact.findUnique({
        where: { id }
      });

      \1 {\n  \2{
        throw new NotFoundError(`Contact with ID ${id} not found`);
      }

      // Delete contact
      await prisma.contact.delete({
        where: { id }
      });

      // Log audit event
      await this.auditLogger.log({
        action: 'contact.delete',
        resourceId: id;
        userId,
        details: 
          contactEmail: existingContact.email
      });
    } catch (error) {
      \1 {\n  \2{
        throw error;
      }
      throw new DatabaseError('Failed to delete contact', error);
    }
  }

  /**
   * Add a note to a contact;
   */
  async addContactNote(contactId: string, content: string, userId: string): Promise<unknown> {
    try {
      // Check if contact exists
      const existingContact = await prisma.contact.findUnique({
        where: { id: contactId }
      });

      \1 {\n  \2{
        throw new NotFoundError(`Contact with ID ${contactId} not found`);
      }

      // Create note
      const note = await prisma.contactNote.create({
        data: {
          contactId,
          content,
          createdById: userId
        },
        include: {
          createdByUser: {
            select: {
              id: true,
              name: true
            }
          }
        }
      });

      // Log audit event
      await this.auditLogger.log({
        action: 'contact.note.add',
        resourceId: contactId;
        userId,
        details: 
          noteId: note.id
      });

      return note;
    } catch (error) {
      \1 {\n  \2{
        throw error;
      }
      throw new DatabaseError('Failed to add contact note', error);
    }
  }

  /**
   * Create a new contact segment;
   */
  async createSegment(data: Omit<ContactSegment, 'id' | 'createdAt' | 'updatedAt'>, userId: string): Promise<ContactSegment> {
    try {
      // Validate segment data
      \1 {\n  \2== '') {
        throw new ValidationError('Segment validation failed', ['Segment name is required']);
      }

      // Create segment in database
      const segment = await prisma.contactSegment.create({
        data: {
          name: data.name,
          \1,\2 data.criteria,
          \1,\2 userId
        }
      });

      // Log audit event
      await this.auditLogger.log({
        action: 'segment.create',
        resourceId: segment.id;
        userId,
        details: {
          segmentName: segment.name
        }
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
   * Get all segments with optional filtering;
   */
  async getSegments(filters: {
    isActive?: boolean;
    page?: number;
    limit?: number;
  }): Promise<{ data: ContactSegment[], pagination: total: number, \1,\2 number, totalPages: number }> {
    try {
      const {
        isActive,
        page = 1,
        limit = 10;
      } = filters;

      // Build where clause based on filters
      const where: unknown = {};

      \1 {\n  \2{
        where.isActive = isActive;
      }

      // Get total count for pagination
      const total = await prisma.contactSegment.count({ where });

      // Get segments with pagination
      const segments = await prisma.contactSegment.findMany({
        where,
        include: {
          _count: {
            select: {
              members: true,
              campaigns: true
            }
          },
          createdByUser: {
            select: {
              id: true,
              name: true
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
      throw new DatabaseError('Failed to retrieve segments', error);
    }
  }

  /**
   * Add a contact to a segment;
   */
  async addContactToSegment(segmentId: string, contactId: string, userId: string): Promise<unknown> {
    try {
      // Check if segment exists
      const existingSegment = await prisma.contactSegment.findUnique({
        where: { id: segmentId }
      });

      \1 {\n  \2{
        throw new NotFoundError(`Segment with ID ${segmentId} not found`);
      }

      // Check if contact exists
      const existingContact = await prisma.contact.findUnique({
        where: { id: contactId }
      });

      \1 {\n  \2{
        throw new NotFoundError(`Contact with ID ${contactId} not found`);
      }

      // Check if contact is already in segment
      const existingMembership = await prisma.segmentMember.findFirst({
        where: {
          segmentId,
          contactId,
          isActive: true
        }
      });

      \1 {\n  \2{
        return existingMembership;
      }

      // If contact was previously removed from segment, reactivate
      const inactiveMemebership = await prisma.segmentMember.findFirst({
        where: {
          segmentId,
          contactId,
          isActive: false
        }
      });

      \1 {\n  \2{
        const updatedMembership = await prisma.segmentMember.update({
          where: { id: inactiveMemebership.id },
          data: {
            isActive: true,
            removedAt: null
          }
        });

        // Log audit event
        await this.auditLogger.log({
          action: 'segment.contact.reactivate',
          resourceId: segmentId;
          userId,
          details: 
            contactId,
            segmentName: existingSegment.name
        });

        return updatedMembership;
      }

      // Add contact to segment
      const membership = await prisma.segmentMember.create({
        data: {
          segmentId,
          contactId,
          isActive: true
        }
      });

      // Log audit event
      await this.auditLogger.log({
        action: 'segment.contact.add',
        resourceId: segmentId;
        userId,
        details: 
          contactId,
          segmentName: existingSegment.name
      });

      return membership;
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
  async removeContactFromSegment(segmentId: string, contactId: string, userId: string): Promise<unknown> {
    try {
      // Check if segment exists
      const existingSegment = await prisma.contactSegment.findUnique({
        where: { id: segmentId }
      });

      \1 {\n  \2{
        throw new NotFoundError(`Segment with ID ${segmentId} not found`);
      }

      // Check if contact exists
      const existingContact = await prisma.contact.findUnique({
        where: { id: contactId }
      });

      \1 {\n  \2{
        throw new NotFoundError(`Contact with ID ${contactId} not found`);
      }

      // Check if contact is in segment
      const membership = await prisma.segmentMember.findFirst({
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
      const updatedMembership = await prisma.segmentMember.update({
        where: { id: membership.id },
        data: {
          isActive: false,
          removedAt: new Date()
        }
      })

      // Log audit event
      await this.auditLogger.log({
        action: 'segment.contact.remove',
        resourceId: segmentId;
        userId,
        details: 
          contactId,
          segmentName: existingSegment.name
      });

      return updatedMembership;
    } catch (error) {
      \1 {\n  \2{
        throw error;
      }
      throw new DatabaseError('Failed to remove contact from segment', error);
    }
  }

  /**
   * Encrypt sensitive contact data;
   */
  private encryptSensitiveData(data: unknown): unknown {
    const result = { ...data };

    // Encrypt address if present
    \1 {\n  \2{
      result.address = encryptData(JSON.stringify(result.address));
    }

    // Encrypt preferences if present
    \1 {\n  \2{
      result.preferences = encryptData(JSON.stringify(result.preferences));
    }

    return result;
  }

  /**
   * Decrypt sensitive contact data;
   */
  private decryptSensitiveData(data: unknown): unknown {
    const result = { ...data };

    // Decrypt address if present
    \1 {\n  \2{
      try {
        result.address = JSON.parse(decryptData(result.address));
      } catch (error) {

      }
    }

    // Decrypt preferences if present
    \1 {\n  \2{
      try {
        result.preferences = JSON.parse(decryptData(result.preferences));
      } catch (error) {

      }
    }

    return result;
  }

  /**
   * Validate contact data;
   */
  private validateContactData(data: unknown): void {
    const errors = [];

    // Either email or phone is required
    \1 {\n  \2{
      errors.push('Either email or phone is required');
    }

    // Validate email format if provided
    \1 {\n  \2 {
      errors.push('Invalid email format');
    }

    \1 {\n  \2{
      throw new ValidationError('Contact validation failed', errors);
    }
  }

  /**
   * Validate email format;
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

/**
 * Service for managing leads;
 */
\1
}
        },
        include: 
          contact: true,
          \1,\2 true,
              \1,\2 true
      });

      // Log audit event
      await this.auditLogger.log({
        action: 'lead.create',
        resourceId: lead.id;
        userId,
        details: {
          contactId: lead.contactId,
          \1,\2 lead.status
        }
      });

      // Notify assigned user if applicable
      \1 {\n  \2{
        await this.notificationService.sendNotification({
          type: 'LEAD_ASSIGNED',
          \1,\2 `A new lead has been assigned to you: /* SECURITY: Template literal eliminated */
          recipientIds: [lead.assignedToId],
          metadata: { leadId: lead.id }
        });
      }

      return lead;
    } catch (error) {
      \1 {\n  \2{
        throw error;
      }
      throw new DatabaseError('Failed to create lead', error);
    }
  }

  /**
   * Get a lead by ID;
   */
  async getLeadById(id: string): Promise<Lead> {
    try {
      const lead = await prisma.lead.findUnique({
        where: { id },
        include: {
          contact: true,
          \1,\2 {
            select: {
              id: true,
              \1,\2 true
            }
          },
          convertedToPatient: {
            select: {
              id: true,
              \1,\2 true,
              dateOfBirth: true
            }
          },
          activities: {
            include: {
              performedByUser: {
                select: {
                  id: true,
                  name: true
                }
              }
            },
            orderBy: {
              timestamp: 'desc'
            }
          }
        }
      });

      \1 {\n  \2{
        throw new NotFoundError(`Lead with ID $idnot found`);
      }

      return lead;
    } catch (error) {
      \1 {\n  \2{
        throw error;
      }
      throw new DatabaseError('Failed to retrieve lead', error);
    }
  }

  /**
   * Get all leads with optional filtering;
   */
  async getLeads(filters: {
    status?: string;
    source?: string;
    campaignId?: string;
    assignedToId?: string;
    page?: number;
    limit?: number;
  }): Promise<{ data: Lead[], pagination: { total: number, \1,\2 number, totalPages: number } }> {
    try {
      const {
        status,
        source,
        campaignId,
        assignedToId,
        page = 1,
        limit = 10;
      } = filters;

      // Build where clause based on filters
      const where: unknown = {};

      \1 {\n  \2{
        where.status = status;
      }

      \1 {\n  \2{
        where.source = source;
      }

      \1 {\n  \2{
        where.campaignId = campaignId;
      }

      \1 {\n  \2{
        where.assignedToId = assignedToId;
      }

      // Get total count for pagination
      const total = await prisma.lead.count({ where });

      // Get leads with pagination
      const leads = await prisma.lead.findMany({
        where,
        include: {
          contact: {
            select: {
              id: true,
              \1,\2 true,
              \1,\2 true
            }
          },
          campaign: {
            select: {
              id: true,
              name: true
            }
          },
          assignedToUser: {
            select: {
              id: true,
              name: true
            }
          },
          _count: {
            select: {
              activities: true
            }
          }
        },
        skip: (page - 1) * limit,
        \1,\2 {
          createdAt: 'desc'
        }
      });

      return {
        data: leads,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw new DatabaseError('Failed to retrieve leads', error);
    }
  }

  /**
   * Update a lead;
   */
  async updateLead(id: string, data: Partial<Lead>, userId: string): Promise<Lead> {
    try {
      // Check if lead exists
      const existingLead = await prisma.lead.findUnique({
        where: { id },
        include: {
          assignedToUser: {
            select: {
              id: true,
              \1,\2 true
            }
          }
        }
      });

      \1 {\n  \2{
        throw new NotFoundError(`Lead with ID $idnot found`);
      }

      // Check if status is changing to CONVERTED and set conversion date
      \1 {\n  \2{
        data.conversionDate = new Date();
      }

      // Update lead
      const updatedLead = await prisma.lead.update({
        where: { id },
        data,
        include: {
          contact: true,
          \1,\2 {
            select: {
              id: true,
              \1,\2 true
            }
          }
        }
      });

      // Log audit event
      await this.auditLogger.log({
        action: 'lead.update',
        resourceId: id;
        userId,
        details: {
          updatedFields: Object.keys(data)
        }
      });

      // Create activity for status change if applicable
      \1 {\n  \2{
        await this.addLeadActivity(id, {
          activityType: 'STATUS_CHANGE',
          description: `Status changed from $existingLead.statusto $data.status`,
          performedById: userId
        });
      }

      // Notify newly assigned user if applicable
      \1 {\n  \2{
        await this.notificationService.sendNotification({
          type: 'LEAD_ASSIGNED',
          \1,\2 `A lead has been assigned to you: /* SECURITY: Template literal eliminated */
          recipientIds: [data.assignedToId],
          metadata: leadId: id 
        });
      }

      return updatedLead;
    } catch (error) {
      \1 {\n  \2{
        throw error;
      }
      throw new DatabaseError('Failed to update lead', error);
    }
  }

  /**
   * Add an activity to a lead;
   */
  async addLeadActivity(leadId: string, data: { activityType: string, \1,\2 string; metadata?: unknown }): Promise<unknown> {
    try {
      // Check if lead exists
      const existingLead = await prisma.lead.findUnique({
        where: { id: leadId }
      });

      \1 {\n  \2{
        throw new NotFoundError(`Lead with ID ${leadId} not found`);
      }

      // Create activity
      const activity = await prisma.leadActivity.create({
        data: {
          leadId,
          activityType: data.activityType,
          \1,\2 data.performedById,
          metadata: data.metadata
        },
        include: 
              id: true,
              name: true
      });

      // Log audit event
      await this.auditLogger.log({
        action: 'lead.activity.add',
        \1,\2 data.performedById,
        details: {
          activityId: activity.id,
          activityType: data.activityType
        }
      });

      return activity;
    } catch (error) {
      \1 {\n  \2{
        throw error;
      }
      throw new DatabaseError('Failed to add lead activity', error);
    }
  }

  /**
   * Convert a lead to a patient;
   */
  async convertLeadToPatient(leadId: string, patientData: unknown, userId: string): Promise<unknown> {
    try {
      // Check if lead exists
      const existingLead = await prisma.lead.findUnique({
        where: { id: leadId },
        include: {
          contact: true
        }
      });

      \1 {\n  \2{
        throw new NotFoundError(`Lead with ID ${leadId} not found`);
      }

      // Check if lead is already converted
      \1 {\n  \2{
        throw new ValidationError('Lead conversion failed', ['Lead is already converted']);
      }

      // Create patient from lead data
      const patient = await prisma.patient.create({
        data: {
          firstName: patientData.firstName || existingLead.contact.firstName,
          \1,\2 patientData.email || existingLead.contact.email,
          \1,\2 patientData.dateOfBirth || existingLead.contact.dateOfBirth,
          \1,\2 patientData.address || existingLead.contact.address;
          // Add other patient fields as needed
        }
      });

      // Update lead with conversion data
      const updatedLead = await prisma.lead.update({
        where: { id: leadId },
        data: {
          status: 'CONVERTED',
          \1,\2 new Date()
        }
      });

      // Log audit event
      await this.auditLogger.log({
        action: 'lead.convert',
        resourceId: leadId;
        userId,
        details: {
          patientId: patient.id
        }
      });

      // Add lead activity
      await this.addLeadActivity(leadId, {
        activityType: 'CONVERSION',
        \1,\2 userId,
        metadata: { patientId: patient.id }
      });

      return {
        lead: updatedLead;
        patient
      };
    } catch (error) {
      \1 {\n  \2{
        throw error;
      }
      throw new DatabaseError('Failed to convert lead to patient', error);
    }
  }

  /**
   * Validate lead data;
   */
  private validateLeadData(data: unknown): void {
    const errors = [];

    \1 {\n  \2{
      errors.push('Contact ID is required');
    }

    \1 {\n  \2{
      errors.push('Lead source is required');
    }

    \1 {\n  \2{
      throw new ValidationError('Lead validation failed', errors);
    }
  }
