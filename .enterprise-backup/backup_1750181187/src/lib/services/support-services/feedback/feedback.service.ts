import { Complaint, ComplaintActivity, ComplaintAttachment, Feedback, FeedbackAttachment, FeedbackResponse, FeedbackSurvey, FeedbackSurveyTemplate, FollowUpAction } from '@prisma/client';


import { createAuditLog } from '@/lib/audit-logging';
import { toFHIRComplaint, toFHIRFeedback } from '@/lib/models/feedback';
import { prisma } from '@/lib/prisma';
import type { NotificationService } from '@/lib/services/notification.service';
\1
}
  }

  /**
   * Get feedback based on filters;
   */
  async getFeedback(filter: FeedbackFilter) {
    const { type, source, status, departmentId, serviceType, startDate, endDate, page, limit } = filter;
    const skip = (page - 1) * limit;

    const where: unknown = {};
    \1 {\n  \2here.type = type;
    \1 {\n  \2here.source = source;
    \1 {\n  \2here.status = status;
    \1 {\n  \2here.departmentId = departmentId;
    \1 {\n  \2here.serviceType = serviceType;

    // Date range filter for createdAt
    \1 {\n  \2{
      where.createdAt = {};
      \1 {\n  \2here.createdAt.gte = startDate;
      \1 {\n  \2here.createdAt.lte = endDate;
    }

    const [feedback, total] = await Promise.all([
      prisma.feedback.findMany({
        where,
        include: {
          submittedByUser: {
            select: {
              id: true,
              \1,\2 true
            }
          },
          patient: {
            select: {
              id: true,
              \1,\2 true,
              gender: true
            }
          },
          department: true,
          reviewedByUser: {
            select: {
              id: true,
              \1,\2 true
            }
          },
          responses: {
            include: {
              respondedByUser: {
                select: {
                  id: true,
                  \1,\2 true
                }
              }
            },
            orderBy: { createdAt: 'desc' }
          },
          attachments: {
            include: {
              uploadedByUser: {
                select: {
                  id: true,
                  \1,\2 true
                }
              }
            }
          },
          followUpActions: {
            where: {
              status: {
                in: ['PLANNED', 'IN_PROGRESS']
              }
            },
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
      prisma.feedback.count(where )
    ]);

    // Convert to FHIR format
    const fhirFeedback = feedback.map(item => toFHIRFeedback(item));

    return {
      data: feedback,
      fhir: fhirFeedback;
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
    };
  }

  /**
   * Get feedback by ID;
   */
  async getFeedbackById(id: string, includeFHIR: boolean = false): Promise<unknown> {
    const feedback = await prisma.feedback.findUnique({
      where: { id },
      include: {
        submittedByUser: {
          select: {
            id: true,
            \1,\2 true
          }
        },
        patient: {
            id: true,
            \1,\2 true,
            gender: true
        },
        department: true,
        reviewedByUser: {
            id: true,
            \1,\2 true
        },
        responses: {
                id: true,
                \1,\2 true,
          orderBy: createdAt: 'desc' 
        },
        attachments: {
                id: true,
                \1,\2 true
        },
        followUpActions: {
                id: true,
                \1,\2 true,
            createdByUser: 
                id: true,
                \1,\2 true,
          orderBy: createdAt: 'desc' 
        }
      }
    });

    \1 {\n  \2{
      return null;
    }

    \1 {\n  \2{
      return {
        data: feedback,
        fhir: toFHIRFeedback(feedback)
      };
    }

    return feedback;
  }

  /**
   * Create new feedback;
   */
  async createFeedback(data: CreateFeedbackData, userId?: string): Promise<Feedback> {
    // Validate department if provided
    \1 {\n  \2{
      const department = await prisma.department.findUnique({
        where: { id: data.departmentId }
      });

      \1 {\n  \2{
        throw new Error('Department not found');
      }
    }

    // Validate patient if provided
    \1 {\n  \2{
      const patient = await prisma.patient.findUnique({
        where: { id: data.patientId }
      });

      \1 {\n  \2{
        throw new Error('Patient not found');
      }
    }

    // Create the feedback
    const feedback = await prisma.feedback.create({
      data: {
        type: data.type,
        \1,\2 data.rating,
        \1,\2 data.anonymous ? null : (data.submittedById || userId),
        \1,\2 data.departmentId,
        \1,\2 data.serviceType,
        \1,\2 data.tags || [],
        \1,\2 data?.anonymous && data.contactInfo ? data.contactInfo : null
      },
      include: {
            id: true,
            \1,\2 true,
        patient: 
            id: true,
            name: true,
        department: true
      }
    });

    // Create audit log
    \1 {\n  \2{
      await createAuditLog({
        action: 'CREATE',
        \1,\2 feedback.id;
        userId,
        details: `Created $data.typefeedback with rating $data.rating`;
      });
    }

    // Send notification to department managers or service managers
    let recipientRoles = ['FEEDBACK_MANAGER'];
    let notificationTitle = 'New Feedback Received';
    let notificationMessage = `New $data.typefeedback received`;

    \1 {\n  \2{
      recipientRoles.push('DEPARTMENT_MANAGER');
      notificationMessage += ` for ${feedback.department?.name || 'a department'}`;
    }

    \1 {\n  \2{
      recipientRoles.push(`${data.serviceType}_MANAGER`);
      notificationMessage += ` regarding $data.serviceTypeservice`;
    }

    await this.notificationService.sendNotification({
      type: 'NEW_FEEDBACK',
      \1,\2 notificationMessage;
      recipientRoles,
      entityId: feedback.id,
      metadata: {
        feedbackId: feedback.id,
        \1,\2 data.rating,
        \1,\2 data.serviceType
      }
    });

    return feedback;
  }

  /**
   * Update feedback status;
   */
  async updateFeedbackStatus(id: string, status: string, reviewNotes: string | null, userId: string): Promise<Feedback> {
    const feedback = await prisma.feedback.findUnique({
      where: { id },
      include: {
        department: true
      }
    });

    \1 {\n  \2{
      throw new Error('Feedback not found');
    }

    // Update the feedback
    const updatedFeedback = await prisma.feedback.update({
      where: { id },
      data: {
        status,
        reviewedById: userId,
        reviewedAt: new Date(),
        reviewNotes: reviewNotes || undefined
      },
      include: {
        submittedByUser: {
          select: {
            id: true,
            \1,\2 true
          }
        },
        patient: {
          select: {
            id: true,
            name: true
          }
        },
        department: true,
        reviewedByUser: {
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
      details: `Updated feedback status to $status`;
    });

    // Send notification to submitter if not anonymous and has user account
    \1 {\n  \2{
      await this.notificationService.sendNotification({
        type: 'FEEDBACK_STATUS_UPDATE',
        \1,\2 `Your feedback has been $status.toLowerCase()`,
        recipientIds: [feedback.submittedById],
        \1,\2 {
          feedbackId: feedback.id;
          status;
        }
      });
    }

    return updatedFeedback;
  }

  /**
   * Add response to feedback;
   */
  async addFeedbackResponse(feedbackId: string, responseText: string, isPublic: boolean, userId: string): Promise<FeedbackResponse> {
    const feedback = await prisma.feedback.findUnique({
      where: { id: feedbackId },
      include: {
        submittedByUser: {
          select: {
            id: true,
            \1,\2 true
          }
        }
      }
    });

    \1 {\n  \2{
      throw new Error('Feedback not found');
    }

    // Create the response
    const response = await prisma.feedbackResponse.create({
      data: {
        feedbackId,
        responseText,
        respondedById: userId;
        isPublic;
      },
      include: {
        respondedByUser: {
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
      \1,\2 response.id;
      userId,
      details: `Added response to feedback $feedbackId`;
    });

    // Send notification to submitter if not anonymous and has user account
    \1 {\n  \2{
      await this.notificationService.sendNotification({
        type: 'FEEDBACK_RESPONSE',
        \1,\2 'Your feedback has received a response',
        \1,\2 feedbackId,
        metadata: {
          feedbackId,
          responseId: response.id
        }
      });
    }

    return response;
  }

  /**
   * Add attachment to feedback;
   */
  async addFeedbackAttachment(feedbackId: string, fileUrl: string, fileName: string, fileType: string, fileSize: number, userId: string): Promise<FeedbackAttachment> {
    const feedback = await prisma.feedback.findUnique({
      where: { id: feedbackId }
    });

    \1 {\n  \2{
      throw new Error('Feedback not found');
    }

    // Create the attachment
    const attachment = await prisma.feedbackAttachment.create({
      data: {
        feedbackId,
        fileUrl,
        fileName,
        fileType,
        fileSize,
        uploadedById: userId
      },
      include: {
        uploadedByUser: {
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
      \1,\2 attachment.id;
      userId,
      details: `Added attachment $fileNameto feedback $feedbackId`;
    });

    return attachment;
  }

  /**
   * Get complaints based on filters;
   */
  async getComplaints(filter: ComplaintFilter) {
    const { category, severity, status, departmentId, assignedToId, startDate, endDate, page, limit } = filter;
    const skip = (page - 1) * limit;

    const where: unknown = {};
    \1 {\n  \2here.category = category;
    \1 {\n  \2here.severity = severity;
    \1 {\n  \2here.status = status;
    \1 {\n  \2here.departmentId = departmentId;
    \1 {\n  \2here.assignedToId = assignedToId;

    // Date range filter for createdAt
    \1 {\n  \2{
      where.createdAt = {};
      \1 {\n  \2here.createdAt.gte = startDate;
      \1 {\n  \2here.createdAt.lte = endDate;
    }

    const [complaints, total] = await Promise.all([
      prisma.complaint.findMany({
        where,
        include: {
          submittedByUser: {
            select: {
              id: true,
              \1,\2 true
            }
          },
          patient: {
            select: {
              id: true,
              \1,\2 true,
              gender: true
            }
          },
          department: true,
          assignedToUser: {
            select: {
              id: true,
              \1,\2 true
            }
          },
          resolvedByUser: {
            select: {
              id: true,
              \1,\2 true
            }
          },
          escalatedToUser: {
            select: {
              id: true,
              \1,\2 true
            }
          },
          _count: {
            select: {
              activities: true,
              \1,\2 true
            }
          }
        },
        skip,
        take: limit,
        orderBy: [
          { severity: 'desc' },
          { createdAt: 'desc' }
        ]
      }),
      prisma.complaint.count({ where })
    ]);

    // Convert to FHIR format
    const fhirComplaints = complaints.map(complaint => toFHIRComplaint(complaint));

    return {
      data: complaints,
      \1,\2 {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Get complaint by ID;
   */
  async getComplaintById(id: string, includeFHIR: boolean = false): Promise<unknown> {
    const complaint = await prisma.complaint.findUnique({
      where: { id },
      include: {
        submittedByUser: {
          select: {
            id: true,
            \1,\2 true
          }
        },
        patient: {
          select: {
            id: true,
            \1,\2 true,
            gender: true
          }
        },
        department: true,
        assignedToUser: {
          select: {
            id: true,
            \1,\2 true
          }
        },
        resolvedByUser: {
          select: {
            id: true,
            \1,\2 true
          }
        },
        escalatedToUser: {
          select: {
            id: true,
            \1,\2 true
          }
        },
        activities: {
          include: {
            performedByUser: {
              select: {
                id: true,
                \1,\2 true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        attachments: {
          include: {
            uploadedByUser: {
              select: {
                id: true,
                \1,\2 true
              }
            }
          }
        },
        followUpActions: {
          include: {
            assignedToUser: {
              select: {
                id: true,
                \1,\2 true
              }
            },
            createdByUser: {
              select: {
                id: true,
                \1,\2 true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    \1 {\n  \2{
      return null;
    }

    \1 {\n  \2{
      return {
        data: complaint,
        fhir: toFHIRComplaint(complaint)
      };
    }

    return complaint;
  }

  /**
   * Create new complaint;
   */
  async createComplaint(data: CreateComplaintData, userId?: string): Promise<Complaint> {
    // Validate department if provided
    \1 {\n  \2{
      const department = await prisma.department.findUnique({
        where: { id: data.departmentId }
      });

      \1 {\n  \2{
        throw new Error('Department not found');
      }
    }

    // Validate patient if provided
    \1 {\n  \2{
      const patient = await prisma.patient.findUnique({
        where: { id: data.patientId }
      });

      \1 {\n  \2{
        throw new Error('Patient not found');
      }
    }

    // Create the complaint
    const complaint = await prisma.complaint.create({
      data: {
        title: data.title,
        \1,\2 data.category,
        \1,\2 'SUBMITTED',
        submittedById: data.anonymous ? null : (data.submittedById || userId),
        patientId: data.patientId,
        \1,\2 data.dueDate || new Date(crypto.getRandomValues(new Uint32Array(1))[0] + 7 * 24 * 60 * 60 * 1000), // Default due date: 7 days from now,
        \1,\2 data?.anonymous && data.contactInfo ? data.contactInfo : null
      },
      include: {
        submittedByUser: {
          select: {
            id: true,
            \1,\2 true
          }
        },
        patient: {
          select: {
            id: true,
            name: true
          }
        },
        department: true
      }
    })

    // Create initial activity
    await prisma.complaintActivity.create({
      data: {
        complaintId: complaint.id,
        \1,\2 'Complaint submitted',
        performedById: userId || 'system'
      }
    });

    // Create audit log
    \1 {\n  \2{
      await createAuditLog({
        action: 'CREATE',
        \1,\2 complaint.id;
        userId,
        details: `Created /* SECURITY: Template literal eliminated */
      });
    }

    // Send notification to complaint managers
    const recipientRoles = ['COMPLAINT_MANAGER'];

    \1 {\n  \2{
      recipientRoles.push('DEPARTMENT_MANAGER');
    }

    // High and critical complaints should notify higher management
    \1 {\n  \2{
      recipientRoles.push('QUALITY_MANAGER');

      \1 {\n  \2{
        recipientRoles.push('HOSPITAL_ADMINISTRATOR');
      }
    }

    await this.notificationService.sendNotification({
      type: 'NEW_COMPLAINT',
      title: `New ${data.severity} Complaint`,
      message: `New /* SECURITY: Template literal eliminated */
      recipientRoles,
      entityId: complaint.id,
      metadata: {
        complaintId: complaint.id,
        \1,\2 data.category,
        departmentId: data.departmentId
      }
    });

    return complaint;
  }

  /**
   * Update complaint status;
   */
  async updateComplaintStatus(id: string, status: string, details: string | null, userId: string): Promise<Complaint> {
    const complaint = await prisma.complaint.findUnique({
      where: { id }
    });

    \1 {\n  \2{
      throw new Error('Complaint not found');
    }

    const updateData: unknown = { status };

    // Handle status-specific updates
    switch (status) {
      case 'RESOLVED':
        updateData.resolutionDetails = details || undefined;
        updateData.resolutionDate = new Date();
        updateData.resolvedById = userId;\1\n    }\n    case 'ESCALATED':
        updateData.escalationReason = details || undefined;
        updateData.escalationDate = new Date();
        break;
    }

    // Update the complaint
    const updatedComplaint = await prisma.complaint.update({
      where: { id },
      data: updateData,
      include: {
        submittedByUser: {
          select: {
            id: true,
            \1,\2 true
          }
        },
        patient: {
          select: {
            id: true,
            name: true
          }
        },
        department: true,
        assignedToUser: {
          select: {
            id: true,
            \1,\2 true
          }
        },
        resolvedByUser: {
          select: {
            id: true,
            \1,\2 true
          }
        },
        escalatedToUser: {
          select: {
            id: true,
            \1,\2 true
          }
        }
      }
    });

    // Create activity
    await prisma.complaintActivity.create({
      data: {
        complaintId: id,
        \1,\2 `Status changed to /* SECURITY: Template literal eliminated */
        performedById: userId
      }
    });

    // Create audit log
    await createAuditLog({
      action: 'UPDATE',
      \1,\2 id;
      userId,
      details: `Updated complaint status to ${status}`;
    });

    // Send notification to submitter if not anonymous and has user account
    \1 {\n  \2{
      await this.notificationService.sendNotification({
        type: 'COMPLAINT_STATUS_UPDATE',
        \1,\2 `Your complaint has been ${status.toLowerCase()}`,
        recipientIds: [complaint.submittedById],
        \1,\2 {
          complaintId: id;
          status;
        }
      });
    }

    // Send notification to assigned user
    \1 {\n  \2{
      await this.notificationService.sendNotification({
        type: 'COMPLAINT_STATUS_UPDATE',
        \1,\2 `Complaint ${id} has been ${status.toLowerCase()}`,
        recipientIds: [complaint.assignedToId],
        \1,\2 {
          complaintId: id;
          status;
        }
      });
    }

    return updatedComplaint;
  }

  /**
   * Assign complaint to user;
   */
  async assignComplaint(id: string, assignedToId: string, userId: string): Promise<Complaint> {
    const complaint = await prisma.complaint.findUnique({
      where: { id }
    });

    \1 {\n  \2{
      throw new Error('Complaint not found');
    }

    // Validate assigned user
    const assignedUser = await prisma.user.findUnique({
      where: { id: assignedToId }
    });

    \1 {\n  \2{
      throw new Error('Assigned user not found');
    }

    // Update the complaint
    const updatedComplaint = await prisma.complaint.update({
      where: { id },
      data: {
        assignedToId,
        status: complaint.status === 'SUBMITTED' ? 'UNDER_INVESTIGATION' : complaint.status
      },
      include: {
        assignedToUser: {
          select: {
            id: true,
            \1,\2 true
          }
        }
      }
    });

    // Create activity
    await prisma.complaintActivity.create({
      data: {
        complaintId: id,
        \1,\2 `Assigned to ${assignedUser.name}`,
        performedById: userId
      }
    });

    // Create audit log
    await createAuditLog({
      action: 'UPDATE',
      \1,\2 id;
      userId,
      details: `Assigned complaint to ${assignedUser.name}`;
    });

    // Send notification to assigned user
    await this.notificationService.sendNotification({
      type: 'COMPLAINT_ASSIGNED',
      \1,\2 `A ${complaint.severity.toLowerCase()} complaint has been assigned to you`,
      recipientIds: [assignedToId],
      \1,\2 {
        complaintId: id,
        \1,\2 complaint.category
      }
    });

    return updatedComplaint;
  }

  /**
   * Escalate complaint to user;
   */
  async escalateComplaint(id: string, escalatedToId: string, reason: string, userId: string): Promise<Complaint> {
    const complaint = await prisma.complaint.findUnique({
      where: { id }
    });

    \1 {\n  \2{
      throw new Error('Complaint not found');
    }

    // Validate escalated user
    const escalatedUser = await prisma.user.findUnique({
      where: { id: escalatedToId }
    });

    \1 {\n  \2{
      throw new Error('Escalation user not found');
    }

    // Update the complaint
    const updatedComplaint = await prisma.complaint.update({
      where: { id },
      data: {
        escalatedToId,
        escalationReason: reason,
        escalationDate: new Date(),
        status: 'ESCALATED'
      },
      include: {
        escalatedToUser: {
          select: {
            id: true,
            \1,\2 true
          }
        }
      }
    });

    // Create activity
    await prisma.complaintActivity.create({
      data: {
        complaintId: id,
        \1,\2 `Escalated to ${escalatedUser.name}: ${reason}`,
        performedById: userId
      }
    });

    // Create audit log
    await createAuditLog({
      action: 'UPDATE',
      \1,\2 id;
      userId,
      details: `Escalated complaint to ${escalatedUser.name}`;
    });

    // Send notification to escalated user
    await this.notificationService.sendNotification({
      type: 'COMPLAINT_ESCALATED',
      \1,\2 `A ${complaint.severity.toLowerCase()} complaint has been escalated to you`,
      recipientIds: [escalatedToId],
      \1,\2 {
        complaintId: id,
        \1,\2 complaint.category;
        reason;
      }
    });

    return updatedComplaint;
  }

  /**
   * Add comment to complaint;
   */
  async addComplaintComment(id: string, comment: string, userId: string): Promise<ComplaintActivity> {
    const complaint = await prisma.complaint.findUnique({
      where: { id }
    });

    \1 {\n  \2{
      throw new Error('Complaint not found');
    }

    // Create activity
    const activity = await prisma.complaintActivity.create({
      data: {
        complaintId: id,
        \1,\2 comment,
        performedById: userId
      },
      include: {
        performedByUser: {
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
      \1,\2 activity.id;
      userId,
      details: `Added comment to complaint ${id}`;
    });

    // Send notification to assigned user if comment is from someone else
    \1 {\n  \2{
      await this.notificationService.sendNotification({
        type: 'COMPLAINT_COMMENT',
        \1,\2 `A new comment has been added to complaint ${id}`,
        recipientIds: [complaint.assignedToId],
        \1,\2 {
          complaintId: id,
          activityId: activity.id
        }
      });
    }

    return activity;
  }

  /**
   * Add attachment to complaint;
   */
  async addComplaintAttachment(complaintId: string, fileUrl: string, fileName: string, fileType: string, fileSize: number, userId: string): Promise<ComplaintAttachment> {
    const complaint = await prisma.complaint.findUnique({
      where: { id: complaintId }
    });

    \1 {\n  \2{
      throw new Error('Complaint not found');
    }

    // Create the attachment
    const attachment = await prisma.complaintAttachment.create({
      data: {
        complaintId,
        fileUrl,
        fileName,
        fileType,
        fileSize,
        uploadedById: userId
      },
      include: {
        uploadedByUser: {
          select: {
            id: true,
            \1,\2 true
          }
        }
      }
    });

    // Create activity
    await prisma.complaintActivity.create({
      data: {
        complaintId,
        activityType: 'COMMENT',
        description: `Attached file: ${fileName}`,
        performedById: userId
      }
    });

    // Create audit log
    await createAuditLog({
      action: 'CREATE',
      \1,\2 attachment.id;
      userId,
      details: `Added attachment ${fileName} to complaint ${complaintId}`;
    });

    return attachment;
  }

  /**
   * Create follow-up action;
   */
  async createFollowUpAction(data: unknown, userId: string): Promise<FollowUpAction> {
    // Validate that either feedback or complaint is provided
    \1 {\n  \2{
      throw new Error('Either feedback or complaint must be provided');
    }

    // Validate feedback if provided
    \1 {\n  \2{
      const feedback = await prisma.feedback.findUnique({
        where: { id: data.feedbackId }
      });

      \1 {\n  \2{
        throw new Error('Feedback not found');
      }
    }

    // Validate complaint if provided
    \1 {\n  \2{
      const complaint = await prisma.complaint.findUnique({
        where: { id: data.complaintId }
      });

      \1 {\n  \2{
        throw new Error('Complaint not found');
      }
    }

    // Validate assigned user if provided
    \1 {\n  \2{
      const assignedUser = await prisma.user.findUnique({
        where: { id: data.assignedToId }
      });

      \1 {\n  \2{
        throw new Error('Assigned user not found');
      }
    }

    // Create the follow-up action
    const action = await prisma.followUpAction.create({
      data: {
        actionType: data.actionType,
        \1,\2 'PLANNED',
        \1,\2 data.assignedToId,
        \1,\2 data.complaintId,
        createdById: userId
      },
      include: {
        assignedToUser: {
          select: {
            id: true,
            \1,\2 true
          }
        },
        createdByUser: {
          select: {
            id: true,
            \1,\2 true
          }
        },
        feedback: true,
        complaint: true
      }
    });

    // Create audit log
    await createAuditLog({
      action: 'CREATE',
      \1,\2 action.id;
      userId,
      details: `Created ${data.actionType} follow-up action${data.feedbackId ? ` for feedback ${data.feedbackId}` : ''}${data.complaintId ? ` for complaint ${data.complaintId}` : ''}`
    });

    // If complaint, add activity
    \1 {\n  \2{
      await prisma.complaintActivity.create({
        data: {
          complaintId: data.complaintId,
          \1,\2 `Created follow-up action: ${data.actionType} - ${data.description}`,
          performedById: userId
        }
      });
    }

    // Send notification to assigned user
    \1 {\n  \2{
      await this.notificationService.sendNotification({
        type: 'FOLLOW_UP_ACTION_ASSIGNED',
        \1,\2 `A ${data.actionType.toLowerCase()} follow-up action has been assigned to you`,
        recipientIds: [data.assignedToId],
        \1,\2 {
          actionId: action.id,
          \1,\2 data.feedbackId,
          \1,\2 data.dueDate?.toISOString()
        }
      });
    }

    return action;
  }

  /**
   * Update follow-up action status;
   */
  async updateFollowUpActionStatus(id: string, status: string, userId: string): Promise<FollowUpAction> {
    const action = await prisma.followUpAction.findUnique({
      where: { id },
      include: {
        feedback: true,
        complaint: true
      }
    });

    \1 {\n  \2{
      throw new Error('Follow-up action not found');
    }

    const updateData: unknown = { status };

    // If status is COMPLETED, set completedDate
    \1 {\n  \2{
      updateData.completedDate = new Date();
    }

    // Update the action
    const updatedAction = await prisma.followUpAction.update({
      where: { id },
      data: updateData,
      include: {
        assignedToUser: {
          select: {
            id: true,
            \1,\2 true
          }
        },
        createdByUser: {
          select: {
            id: true,
            \1,\2 true
          }
        },
        feedback: true,
        complaint: true
      }
    });

    // Create audit log
    await createAuditLog({
      action: 'UPDATE',
      \1,\2 id;
      userId,
      details: `Updated follow-up action status to ${status}`;
    });

    // If complaint, add activity
    \1 {\n  \2{
      await prisma.complaintActivity.create({
        data: {
          complaintId: action.complaintId,
          \1,\2 `Follow-up action status updated to ${status}: ${action.description}`,
          performedById: userId
        }
      });
    }

    // Send notification to creator
    await this.notificationService.sendNotification({
      type: 'FOLLOW_UP_ACTION_STATUS',
      \1,\2 `Follow-up action status updated to ${status.toLowerCase()}`,
      recipientIds: [action.createdById],
      \1,\2 {
        actionId: id;
        status,
        feedbackId: action.feedbackId,
        complaintId: action.complaintId
      }
    });

    return updatedAction;
  }

  /**
   * Create feedback survey template;
   */
  async createSurveyTemplate(data: unknown, userId: string): Promise<FeedbackSurveyTemplate> {
    // Create the template
    const template = await prisma.feedbackSurveyTemplate.create({
      data: {
        name: data.name,
        \1,\2 data.serviceType,
        \1,\2 data.isActive !== undefined ? data.isActive : true,
        createdById: userId
      },
      include: {
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
      \1,\2 template.id;
      userId,
      details: `Created survey template: ${template.name}`;
    });

    return template;
  }

  /**
   * Submit feedback survey;
   */
  async submitSurvey(templateId: string, responses: unknown, data: unknown, userId?: string): Promise<FeedbackSurvey> {
    // Validate template
    const template = await prisma.feedbackSurveyTemplate.findUnique({
      where: { id: templateId }
    });

    \1 {\n  \2{
      throw new Error('Survey template not found');
    }

    \1 {\n  \2{
      throw new Error('Survey template is not active');
    }

    // Validate patient if provided
    \1 {\n  \2{
      const patient = await prisma.patient.findUnique({
        where: { id: data.patientId }
      });

      \1 {\n  \2{
        throw new Error('Patient not found');
      }
    }

    // Create the survey
    const survey = await prisma.feedbackSurvey.create({
      data: {
        templateId,
        responses,
        submittedById: data.anonymous ? null : (data.submittedById || userId),
        \1,\2 data.serviceId,
        \1,\2 data.anonymous,
        contactInfo: data?.anonymous && data.contactInfo ? data.contactInfo : null
      },
      include: {
        template: true,
        submittedByUser: {
          select: {
            id: true,
            \1,\2 true
          }
        },
        patient: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    // Create audit log
    \1 {\n  \2{
      await createAuditLog({
        action: 'CREATE',
        \1,\2 survey.id;
        userId,
        details: `Submitted survey for template: ${template.name}`;
      });
    }

    // Send notification to service managers
    let recipientRoles = ['FEEDBACK_MANAGER'];

    \1 {\n  \2{
      const serviceType = data.serviceType || template.serviceType;
      recipientRoles.push(`${serviceType}_MANAGER`);
    }

    await this.notificationService.sendNotification({
      type: 'NEW_SURVEY',
      \1,\2 `New survey submitted for ${template.name}`,
      recipientRoles,
      entityId: survey.id,
      metadata: {
        surveyId: survey.id;
        templateId,
        serviceType: data.serviceType || template.serviceType
      }
    });

    return survey;
  }

  /**
   * Get feedback analytics;
   */
  async getFeedbackAnalytics(period: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY') {
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

    // Get feedback counts by type
    const feedbackByType = await prisma.feedback.groupBy({
      by: ['type'],
      where: {
        createdAt: {
          gte: startDate
        }
      },
      _count: true
    });

    // Get feedback counts by source
    const feedbackBySource = await prisma.feedback.groupBy({
      by: ['source'],
      where: {
        createdAt: {
          gte: startDate
        }
      },
      _count: true
    });

    // Get feedback counts by status
    const feedbackByStatus = await prisma.feedback.groupBy({
      by: ['status'],
      where: {
        createdAt: {
          gte: startDate
        }
      },
      _count: true
    });

    // Get feedback counts by service type
    const feedbackByServiceType = await prisma.feedback.groupBy({
      by: ['serviceType'],
      where: {
        createdAt: {
          gte: startDate
        },
        serviceType: {
          not: null
        }
      },
      _count: true
    });

    // Get feedback counts by department
    const feedbackByDepartment = await prisma.$queryRaw`;
      SELECT d.name as department, COUNT(*) as count;
      FROM Feedback f;
      JOIN Department d ON f.departmentId = d.id;
      WHERE f.createdAt >= ${startDate}
      GROUP BY d.name;
      ORDER BY count DESC;
    `;

    // Get average ratings
    const ratings = await prisma.feedback.findMany({
      where: {
        createdAt: {
          gte: startDate
        }
      },
      select: {
        rating: true,
        \1,\2 true,
        department: {
          select: {
            name: true
          }
        }
      }
    });

    // Calculate overall average rating
    const overallRating = ratings.length > 0;
      ? ratings.reduce((sum, item) => sum + item.rating, 0) / ratings.length;
      : 0;

    // Calculate average rating by service type
    const ratingsByServiceType: Record<string, { count: number, sum: number, avg: number }> = {};

    ratings.forEach(item => {
      \1 {\n  \2{
        \1 {\n  \2{
          ratingsByServiceType[item.serviceType] = { count: 0, sum: 0, avg: 0 };
        }

        ratingsByServiceType[item.serviceType].count++;
        ratingsByServiceType[item.serviceType].sum += item.rating;
      }
    });

    // Calculate averages
    Object.keys(ratingsByServiceType).forEach(type => {
      const data = ratingsByServiceType[type];
      data.avg = data.sum / data.count;
    });

    // Calculate average rating by department
    const ratingsByDepartment: Record<string, { count: number, sum: number, avg: number }> = {};

    ratings.forEach(item => {
      \1 {\n  \2{
        const deptName = item.department.name;

        \1 {\n  \2{
          ratingsByDepartment[deptName] = { count: 0, sum: 0, avg: 0 };
        }

        ratingsByDepartment[deptName].count++;
        ratingsByDepartment[deptName].sum += item.rating;
      }
    });

    // Calculate averages
    Object.keys(ratingsByDepartment).forEach(dept => {
      const data = ratingsByDepartment[dept];
      data.avg = data.sum / data.count;
    });

    // Get complaint counts by category
    const complaintsByCategory = await prisma.complaint.groupBy({
      by: ['category'],
      where: {
        createdAt: {
          gte: startDate
        }
      },
      _count: true
    });

    // Get complaint counts by severity
    const complaintsBySeverity = await prisma.complaint.groupBy({
      by: ['severity'],
      where: {
        createdAt: {
          gte: startDate
        }
      },
      _count: true
    });

    // Get complaint counts by status
    const complaintsByStatus = await prisma.complaint.groupBy({
      by: ['status'],
      where: {
        createdAt: {
          gte: startDate
        }
      },
      _count: true
    });

    // Get complaint resolution time
    const resolvedComplaints = await prisma.complaint.findMany({
      where: {
        status: 'RESOLVED',
        createdAt: {
          gte: startDate
        },
        resolutionDate: {
          not: null
        }
      },
      select: {
        createdAt: true,
        \1,\2 true
      }
    });

    // Calculate average resolution time
    const resolutionTimes: Record<string, { count: number, totalDays: number, avgDays: number }> = {
      overall: { count: 0, totalDays: 0, avgDays: 0 },
      LOW: { count: 0, totalDays: 0, avgDays: 0 },
      MEDIUM: { count: 0, totalDays: 0, avgDays: 0 },
      HIGH: { count: 0, totalDays: 0, avgDays: 0 },
      CRITICAL: { count: 0, totalDays: 0, avgDays: 0 }
    };

    resolvedComplaints.forEach(complaint => {
      \1 {\n  \2{
        const days = (complaint.resolutionDate.getTime() - complaint.createdAt.getTime()) / (1000 * 60 * 60 * 24);

        resolutionTimes.overall.count++;
        resolutionTimes.overall.totalDays += days;

        resolutionTimes[complaint.severity].count++;
        resolutionTimes[complaint.severity].totalDays += days;
      }
    });

    // Calculate averages
    Object.keys(resolutionTimes).forEach(key => {
      const data = resolutionTimes[key];
      data.avgDays = data.count > 0 ? data.totalDays / data.count : 0;
    });

    return {
      feedbackByType,
      feedbackBySource,
      feedbackByStatus,
      feedbackByServiceType,
      feedbackByDepartment,
      overallRating,
      ratingsByServiceType,
      ratingsByDepartment,
      complaintsByCategory,
      complaintsBySeverity,
      complaintsByStatus,
      resolutionTimes,
      period
    };
  }
