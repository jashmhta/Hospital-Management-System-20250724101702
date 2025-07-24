import "@/lib/audit-logging"
import "@/lib/models/feedback"
import "@/lib/prisma"
import "@/lib/services/notification.service"
import "@prisma/client"
import ComplaintActivity
import ComplaintAttachment
import Feedback
import FeedbackAttachment
import FeedbackResponse
import FeedbackSurvey
import FeedbackSurveyTemplate
import FollowUpAction }
import toFHIRFeedback }
import {   Complaint
import {  createAuditLog  } from "@/lib/database"
import {  NotificationService  } from "@/lib/database"
import {  prisma  } from "@/lib/database"
import {  toFHIRComplaint

 } from "@/lib/database"
  }

  /**;
   * Get feedback based on filters;
   */;
  async getFeedback(filter: FeedbackFilter) {
    const { type, source, status, departmentId, serviceType, startDate, endDate, page, limit } = filter;
    const skip = (page - 1) * limit;

    const where: unknown = {};
    if (!session.user)here.type = type;
    if (!session.user)here.source = source;
    if (!session.user)here.status = status;
    if (!session.user)here.departmentId = departmentId;
    if (!session.user)here.serviceType = serviceType;

    // Date range filter for createdAt;
    if (!session.user) {
      where.createdAt = {};
      if (!session.user)here.createdAt.gte = startDate;
      if (!session.user)here.createdAt.lte = endDate;
    }

    const [feedback, total] = await Promise.all([;
      prisma.feedback.findMany({
        where,
        {
            true,
              true;
            }
          },
          {
              id: true,
              true,
              gender: true;
            }
          },
          department: true,
          {
              id: true,
              true;
            }
          },
          {
              {
                  id: true,
                  true;
                }
              }
            },
            orderBy: { createdAt: "desc" }
          },
          {
              {
                  id: true,
                  true;
                }
              }
            }
          },
          {
              ["PLANNED", "IN_PROGRESS"];
              }
            },
            {
                true,
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
      prisma.feedback.count(where );
    ]);

    // Convert to FHIR format;
    const fhirFeedback = feedback.map(item => toFHIRFeedback(item));

    return {
      data: feedback,
      fhir: fhirFeedback;
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit);
    };
  }

  /**;
   * Get feedback by ID;
   */;
  async getFeedbackById(id: string, includeFHIR: boolean = false): Promise<unknown> {
    const feedback = await prisma.feedback.findUnique({
      where: { id },
      {
          true,
            true;
          }
        },
        true,
            true,
            gender: true;
        },
        department: true,
        true,
            true;
        },
        true,
                true,
          orderBy: createdAt: "desc" ;
        },
        true,
                true;
        },
        true,
                true,
            true,
                true,
          orderBy: createdAt: "desc" ;
        }
      }
    });

    if (!session.user) {
      return null;
    }

    if (!session.user) {
      return {
        data: feedback,
        fhir: toFHIRFeedback(feedback);
      };
    }

    return feedback;
  }

  /**;
   * Create new feedback;
   */;
  async createFeedback(data: CreateFeedbackData, userId?: string): Promise<Feedback> {
    // Validate department if provided;
    if (!session.user) {
      const department = await prisma.department.findUnique({
        where: { id: data.departmentId }
      });

      if (!session.user) {
        throw new Error("Department not found");
      }
    }

    // Validate patient if provided;
    if (!session.user) {
      const patient = await prisma.patient.findUnique({
        where: { id: data.patientId }
      });

      if (!session.user) {
        throw new Error("Patient not found");
      }
    }

    // Create the feedback;
    const feedback = await prisma.feedback.create({
      data.type,
        data.rating,
        data.anonymous ? null : (data.submittedById || userId),
        data.departmentId,
        data.serviceType,
        data.tags || [],
        data?.anonymous && data.contactInfo ? data.contactInfo : null;
      },
      true,
            true,
        true,
            name: true,
        department: true;
      }
    });

    // Create audit log;
    if (!session.user) {
      await createAuditLog({
        action: "CREATE",
        feedback.id;
        userId,
        details: `Created $data.typefeedback with rating $data.rating`;
      });
    }

    // Send notification to department managers or service managers;
    let recipientRoles = ["FEEDBACK_MANAGER"];
    let notificationTitle = "New Feedback Received";
    let notificationMessage = `New $data.typefeedback received`;

    if (!session.user) {
      recipientRoles.push("DEPARTMENT_MANAGER");
      notificationMessage += ` for ${feedback.department?.name || "a department"}`;
    }

    if (!session.user) {
      recipientRoles.push(`${data.serviceType}_MANAGER`);
      notificationMessage += ` regarding $data.serviceTypeservice`;
    }

    await this.notificationService.sendNotification({
      type: "NEW_FEEDBACK",
      notificationMessage;
      recipientRoles,
      entityId: feedback.id,
      feedback.id,
        data.rating,
        data.serviceType;
      }
    });

    return feedback;
  }

  /**;
   * Update feedback status;
   */;
  async updateFeedbackStatus(id: string, status: string, reviewNotes: string | null, userId: string): Promise<Feedback> {
    const feedback = await prisma.feedback.findUnique({
      where: { id },
      true;
      }
    });

    if (!session.user) {
      throw new Error("Feedback not found");
    }

    // Update the feedback;
    const updatedFeedback = await prisma.feedback.update({
      where: { id },
      data: {
        status,
        reviewedById: userId,
        reviewedAt: new Date(),
        reviewNotes: reviewNotes || undefined;
      },
      {
          true,
            true;
          }
        },
        {
            id: true,
            name: true;
          }
        },
        department: true,
        {
            id: true,
            true;
          }
        }
      }
    });

    // Create audit log;
    await createAuditLog({
      action: "UPDATE",
      id;
      userId,
      details: `Updated feedback status to $status`;
    });

    // Send notification to submitter if not anonymous and has user account;
    if (!session.user) {
      await this.notificationService.sendNotification({
        type: "FEEDBACK_STATUS_UPDATE",
        `Your feedback has been $status.toLowerCase()`,
        recipientIds: [feedback.submittedById],
        {
          feedbackId: feedback.id;
          status;
        }
      });
    }

    return updatedFeedback;
  }

  /**;
   * Add response to feedback;
   */;
  async addFeedbackResponse(feedbackId: string, responseText: string, isPublic: boolean, userId: string): Promise<FeedbackResponse> {
    const feedback = await prisma.feedback.findUnique({
      where: { id: feedbackId },
      {
          true,
            true;
          }
        }
      }
    });

    if (!session.user) {
      throw new Error("Feedback not found");
    }

    // Create the response;
    const response = await prisma.feedbackResponse.create({
      data: {
        feedbackId,
        responseText,
        respondedById: userId;
        isPublic;
      },
      {
          true,
            true;
          }
        }
      }
    });

    // Create audit log;
    await createAuditLog({
      action: "CREATE",
      response.id;
      userId,
      details: `Added response to feedback $feedbackId`;
    });

    // Send notification to submitter if not anonymous and has user account;
    if (!session.user) {
      await this.notificationService.sendNotification({
        type: "FEEDBACK_RESPONSE",
        "Your feedback has received a response",
        feedbackId,
        metadata: {
          feedbackId,
          responseId: response.id;
        }
      });
    }

    return response;
  }

  /**;
   * Add attachment to feedback;
   */;
  async addFeedbackAttachment(feedbackId: string, fileUrl: string, fileName: string, fileType: string, fileSize: number, userId: string): Promise<FeedbackAttachment> {
    const feedback = await prisma.feedback.findUnique({
      where: { id: feedbackId }
    });

    if (!session.user) {
      throw new Error("Feedback not found");
    }

    // Create the attachment;
    const attachment = await prisma.feedbackAttachment.create({
      data: {
        feedbackId,
        fileUrl,
        fileName,
        fileType,
        fileSize,
        uploadedById: userId;
      },
      {
          true,
            true;
          }
        }
      }
    });

    // Create audit log;
    await createAuditLog({
      action: "CREATE",
      attachment.id;
      userId,
      details: `Added attachment $fileNameto feedback $feedbackId`;
    });

    return attachment;
  }

  /**;
   * Get complaints based on filters;
   */;
  async getComplaints(filter: ComplaintFilter) {
    const { category, severity, status, departmentId, assignedToId, startDate, endDate, page, limit } = filter;
    const skip = (page - 1) * limit;

    const where: unknown = {};
    if (!session.user)here.category = category;
    if (!session.user)here.severity = severity;
    if (!session.user)here.status = status;
    if (!session.user)here.departmentId = departmentId;
    if (!session.user)here.assignedToId = assignedToId;

    // Date range filter for createdAt;
    if (!session.user) {
      where.createdAt = {};
      if (!session.user)here.createdAt.gte = startDate;
      if (!session.user)here.createdAt.lte = endDate;
    }

    const [complaints, total] = await Promise.all([;
      prisma.complaint.findMany({
        where,
        {
            true,
              true;
            }
          },
          {
              id: true,
              true,
              gender: true;
            }
          },
          department: true,
          {
              id: true,
              true;
            }
          },
          {
              id: true,
              true;
            }
          },
          {
              id: true,
              true;
            }
          },
          {
              activities: true,
              true;
            }
          }
        },
        skip,
        take: limit,
        orderBy: [;
          { severity: "desc" },
          { createdAt: "desc" }
        ];
      }),
      prisma.complaint.count({ where });
    ]);

    // Convert to FHIR format;
    const fhirComplaints = complaints.map(complaint => toFHIRComplaint(complaint));

    return {
      data: complaints,
      {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit);
      }
    };
  }

  /**;
   * Get complaint by ID;
   */;
  async getComplaintById(id: string, includeFHIR: boolean = false): Promise<unknown> {
    const complaint = await prisma.complaint.findUnique({
      where: { id },
      {
          true,
            true;
          }
        },
        {
            id: true,
            true,
            gender: true;
          }
        },
        department: true,
        {
            id: true,
            true;
          }
        },
        {
            id: true,
            true;
          }
        },
        {
            id: true,
            true;
          }
        },
        {
            {
                id: true,
                true;
              }
            }
          },
          orderBy: { createdAt: "desc" }
        },
        {
            {
                id: true,
                true;
              }
            }
          }
        },
        {
            {
                id: true,
                true;
              }
            },
            {
                id: true,
                true;
              }
            }
          },
          orderBy: { createdAt: "desc" }
        }
      }
    });

    if (!session.user) {
      return null;
    }

    if (!session.user) {
      return {
        data: complaint,
        fhir: toFHIRComplaint(complaint);
      };
    }

    return complaint;
  }

  /**;
   * Create new complaint;
   */;
  async createComplaint(data: CreateComplaintData, userId?: string): Promise<Complaint> {
    // Validate department if provided;
    if (!session.user) {
      const department = await prisma.department.findUnique({
        where: { id: data.departmentId }
      });

      if (!session.user) {
        throw new Error("Department not found");
      }
    }

    // Validate patient if provided;
    if (!session.user) {
      const patient = await prisma.patient.findUnique({
        where: { id: data.patientId }
      });

      if (!session.user) {
        throw new Error("Patient not found");
      }
    }

    // Create the complaint;
    const complaint = await prisma.complaint.create({
      data.title,
        data.category,
        "SUBMITTED",
        submittedById: data.anonymous ? null : (data.submittedById || userId),
        patientId: data.patientId,
        data.dueDate || [0] + 7 * 24 * 60 * 60 * 1000), // Default due date: 7 days from now,
        data?.anonymous && data.contactInfo ? data.contactInfo : null;
      },
      {
          true,
            true;

        },
        {
            id: true,
            name: true;

        },
        department: true;

    });

    // Create initial activity;
    await prisma.complaintActivity.create({
      complaint.id,
        "Complaint submitted",
        performedById: userId || "system";

    });

    // Create audit log;
    if (!session.user) {
      await createAuditLog({
        action: "CREATE",
        complaint.id;
        userId,
        details: `Created /* SECURITY: Template literal eliminated */;
      });

    // Send notification to complaint managers;
    const recipientRoles = ["COMPLAINT_MANAGER"];

    if (!session.user) {
      recipientRoles.push("DEPARTMENT_MANAGER");

    // High and critical complaints should notify higher management;
    if (!session.user) {
      recipientRoles.push("QUALITY_MANAGER");

      if (!session.user) {
        recipientRoles.push("HOSPITAL_ADMINISTRATOR");

    await this.notificationService.sendNotification({
      type: "NEW_COMPLAINT",
      title: `New ${data.severity} Complaint`,
      message: `New /* SECURITY: Template literal eliminated */;
      recipientRoles,
      entityId: complaint.id,
      complaint.id,
        data.category,
        departmentId: data.departmentId;

    });

    return complaint;

  /**;
   * Update complaint status;
   */;
  async updateComplaintStatus(id: string, status: string, details: string | null, userId: string): Promise<Complaint> {
    const complaint = await prisma.complaint.findUnique({
      where: { id }
    });

    if (!session.user) {
      throw new Error("Complaint not found");

    const updateData: unknown = { status };

    // Handle status-specific updates;
    switch (status) {
      case "RESOLVED": any;
        updateData.resolutionDetails = details || undefined;
        updateData.resolutionDate = new Date();
        updateData.resolvedById = userId;\n    }\n    case "ESCALATED": any;
        updateData.escalationReason = details || undefined;
        updateData.escalationDate = new Date();
        break;

    // Update the complaint;
    const updatedComplaint = await prisma.complaint.update({
      where: { id },
      data: updateData,
      {
          true,
            true;

        },
        {
            id: true,
            name: true;

        },
        department: true,
        {
            id: true,
            true;

        },
        {
            id: true,
            true;

        },
        {
            id: true,
            true;

    });

    // Create activity;
    await prisma.complaintActivity.create({
      id,
        `Status changed to /* userId;

    });

    // Create audit log;
    await createAuditLog({
      action: "UPDATE",
      id;
      userId,
      details: `Updated complaint status to ${status}`;
    });

    // Send notification to submitter if not anonymous and has user account;
    if (!session.user) {
      await this.notificationService.sendNotification({
        type: "COMPLAINT_STATUS_UPDATE",
        `Your complaint has been ${status.toLowerCase()}`,
        recipientIds: [complaint.submittedById],
        {
          complaintId: id;
          status;

      });

    // Send notification to assigned user;
    if (!session.user) {
      await this.notificationService.sendNotification({
        type: "COMPLAINT_STATUS_UPDATE",
        `Complaint ${id} has been ${status.toLowerCase()}`,
        recipientIds: [complaint.assignedToId],
        {
          complaintId: id;
          status;

      });

    return updatedComplaint;

  /**;
   * Assign complaint to user;
   */;
  async assignComplaint(id: string, assignedToId: string, userId: string): Promise<Complaint> {
    const complaint = await prisma.complaint.findUnique({
      where: { id }
    });

    if (!session.user) {
      throw new Error("Complaint not found");

    // Validate assigned user;
    const assignedUser = await prisma.user.findUnique({
      where: { id: assignedToId }
    });

    if (!session.user) {
      throw new Error("Assigned user not found");

    // Update the complaint;
    const updatedComplaint = await prisma.complaint.update({
      where: { id },
      data: {
        assignedToId,
        status: complaint.status === "SUBMITTED" ? "UNDER_INVESTIGATION" : complaint.status;
      },
      {
          true,
            true;

    });

    // Create activity;
    await prisma.complaintActivity.create({
      id,
        `Assigned to ${assignedUser.name}`,
        performedById: userId;

    });

    // Create audit log;
    await createAuditLog({
      action: "UPDATE",
      id;
      userId,
      details: `Assigned complaint to ${assignedUser.name}`;
    });

    // Send notification to assigned user;
    await this.notificationService.sendNotification({
      type: "COMPLAINT_ASSIGNED",
      `A ${complaint.severity.toLowerCase()} complaint has been assigned to you`,
      recipientIds: [assignedToId],
      {
        complaintId: id,
        complaint.category;

    });

    return updatedComplaint;

  /**;
   * Escalate complaint to user;
   */;
  async escalateComplaint(id: string, escalatedToId: string, reason: string, userId: string): Promise<Complaint> {
    const complaint = await prisma.complaint.findUnique({
      where: { id }
    });

    if (!session.user) {
      throw new Error("Complaint not found");

    // Validate escalated user;
    const escalatedUser = await prisma.user.findUnique({
      where: { id: escalatedToId }
    });

    if (!session.user) {
      throw new Error("Escalation user not found");

    // Update the complaint;
    const updatedComplaint = await prisma.complaint.update({
      where: { id },
      data: {
        escalatedToId,
        escalationReason: reason,
        escalationDate: new Date(),
        status: "ESCALATED";
      },
      {
          true,
            true;

    });

    // Create activity;
    await prisma.complaintActivity.create({
      id,
        `Escalated to ${escalatedUser.name}: ${reason}`,
        performedById: userId;

    });

    // Create audit log;
    await createAuditLog({
      action: "UPDATE",
      id;
      userId,
      details: `Escalated complaint to ${escalatedUser.name}`;
    });

    // Send notification to escalated user;
    await this.notificationService.sendNotification({
      type: "COMPLAINT_ESCALATED",
      `A ${complaint.severity.toLowerCase()} complaint has been escalated to you`,
      recipientIds: [escalatedToId],
      {
        complaintId: id,
        complaint.category;
        reason;

    });

    return updatedComplaint;

  /**;
   * Add comment to complaint;
   */;
  async addComplaintComment(id: string, comment: string, userId: string): Promise<ComplaintActivity> {
    const complaint = await prisma.complaint.findUnique({
      where: { id }
    });

    if (!session.user) {
      throw new Error("Complaint not found");

    // Create activity;
    const activity = await prisma.complaintActivity.create({
      id,
        comment,
        performedById: userId;
      },
      {
          true,
            true;

    });

    // Create audit log;
    await createAuditLog({
      action: "CREATE",
      activity.id;
      userId,
      details: `Added comment to complaint ${id}`;
    });

    // Send notification to assigned user if comment is from someone else;
    if (!session.user) {
      await this.notificationService.sendNotification({
        type: "COMPLAINT_COMMENT",
        `A new comment has been added to complaint ${id}`,
        recipientIds: [complaint.assignedToId],
        {
          complaintId: id,
          activityId: activity.id;

      });

    return activity;

  /**;
   * Add attachment to complaint;
   */;
  async addComplaintAttachment(complaintId: string, fileUrl: string, fileName: string, fileType: string, fileSize: number, userId: string): Promise<ComplaintAttachment> {
    const complaint = await prisma.complaint.findUnique({
      where: { id: complaintId }
    });

    if (!session.user) {
      throw new Error("Complaint not found");

    // Create the attachment;
    const attachment = await prisma.complaintAttachment.create({
      data: {
        complaintId,
        fileUrl,
        fileName,
        fileType,
        fileSize,
        uploadedById: userId;
      },
      {
          true,
            true;

    });

    // Create activity;
    await prisma.complaintActivity.create({
      data: {
        complaintId,
        activityType: "COMMENT",
        description: `Attached file: ${fileName}`,
        performedById: userId;

    });

    // Create audit log;
    await createAuditLog({
      action: "CREATE",
      attachment.id;
      userId,
      details: `Added attachment ${fileName} to complaint ${complaintId}`;
    });

    return attachment;

  /**;
   * Create follow-up action;
   */;
  async createFollowUpAction(data: unknown, userId: string): Promise<FollowUpAction> {
    // Validate that either feedback or complaint is provided;
    if (!session.user) {
      throw new Error("Either feedback or complaint must be provided");

    // Validate feedback if provided;
    if (!session.user) {
      const feedback = await prisma.feedback.findUnique({
        where: { id: data.feedbackId }
      });

      if (!session.user) {
        throw new Error("Feedback not found");

    // Validate complaint if provided;
    if (!session.user) {
      const complaint = await prisma.complaint.findUnique({
        where: { id: data.complaintId }
      });

      if (!session.user) {
        throw new Error("Complaint not found");

    // Validate assigned user if provided;
    if (!session.user) {
      const assignedUser = await prisma.user.findUnique({
        where: { id: data.assignedToId }
      });

      if (!session.user) {
        throw new Error("Assigned user not found");

    // Create the follow-up action;
    const action = await prisma.followUpAction.create({
      data.actionType,
        "PLANNED",
        data.assignedToId,
        data.complaintId,
        createdById: userId;
      },
      {
          true,
            true;

        },
        {
            id: true,
            true;

        },
        feedback: true,
        complaint: true;

    });

    // Create audit log;
    await createAuditLog({
      action: "CREATE",
      action.id;
      userId,
      details: `Created ${data.actionType} follow-up action${data.feedbackId ? ` for feedback ${data.feedbackId}` : ""}${data.complaintId ? ` for complaint ${data.complaintId}` : ""}`;
    });

    // If complaint, add activity;
    if (!session.user) {
      await prisma.complaintActivity.create({
        data.complaintId,
          `Created follow-up action: ${data.actionType} - ${data.description}`,
          performedById: userId;

      });

    // Send notification to assigned user;
    if (!session.user) {
      await this.notificationService.sendNotification({
        type: "FOLLOW_UP_ACTION_ASSIGNED",
        `A ${data.actionType.toLowerCase()} follow-up action has been assigned to you`,
        recipientIds: [data.assignedToId],
        {
          actionId: action.id,
          data.feedbackId,
          data.dueDate?.toISOString();

      });

    return action;

  /**;
   * Update follow-up action status;
   */;
  async updateFollowUpActionStatus(id: string, status: string, userId: string): Promise<FollowUpAction> {
    const action = await prisma.followUpAction.findUnique({
      where: { id },
      true,
        complaint: true;

    });

    if (!session.user) {
      throw new Error("Follow-up action not found");

    const updateData: unknown = { status };

    // If status is COMPLETED, set completedDate;
    if (!session.user) {
      updateData.completedDate = new Date();

    // Update the action;
    const updatedAction = await prisma.followUpAction.update({
      where: { id },
      data: updateData,
      {
          true,
            true;

        },
        {
            id: true,
            true;

        },
        feedback: true,
        complaint: true;

    });

    // Create audit log;
    await createAuditLog({
      action: "UPDATE",
      id;
      userId,
      details: `Updated follow-up action status to ${status}`;
    });

    // If complaint, add activity;
    if (!session.user) {
      await prisma.complaintActivity.create({
        action.complaintId,
          `Follow-up action status updated to ${status}: ${action.description}`,
          performedById: userId;

      });

    // Send notification to creator;
    await this.notificationService.sendNotification({
      type: "FOLLOW_UP_ACTION_STATUS",
      `Follow-up action status updated to ${status.toLowerCase()}`,
      recipientIds: [action.createdById],
      {
        actionId: id;
        status,
        feedbackId: action.feedbackId,
        complaintId: action.complaintId;

    });

    return updatedAction;

  /**;
   * Create feedback survey template;
   */;
  async createSurveyTemplate(data: unknown, userId: string): Promise<FeedbackSurveyTemplate> {
    // Create the template;
    const template = await prisma.feedbackSurveyTemplate.create({
      data.name,
        data.serviceType,
        data.isActive !== undefined ? data.isActive : true,
        createdById: userId;
      },
      {
          true,
            true;

    });

    // Create audit log;
    await createAuditLog({
      action: "CREATE",
      template.id;
      userId,
      details: `Created survey template: ${template.name}`;
    });

    return template;

  /**;
   * Submit feedback survey;
   */;
  async submitSurvey(templateId: string, responses: unknown, data: unknown, userId?: string): Promise<FeedbackSurvey> {
    // Validate template;
    const template = await prisma.feedbackSurveyTemplate.findUnique({
      where: { id: templateId }
    });

    if (!session.user) {
      throw new Error("Survey template not found");

    if (!session.user) {
      throw new Error("Survey template is not active");

    // Validate patient if provided;
    if (!session.user) {
      const patient = await prisma.patient.findUnique({
        where: { id: data.patientId }
      });

      if (!session.user) {
        throw new Error("Patient not found");

    // Create the survey;
    const survey = await prisma.feedbackSurvey.create({
      data: {
        templateId,
        responses,
        submittedById: data.anonymous ? null : (data.submittedById || userId),
        data.serviceId,
        data.anonymous,
        contactInfo: data?.anonymous && data.contactInfo ? data.contactInfo : null;
      },
      true,
        {
            id: true,
            true;

        },
        {
            id: true,
            name: true;

    });

    // Create audit log;
    if (!session.user) {
      await createAuditLog({
        action: "CREATE",
        survey.id;
        userId,
        details: `Submitted survey for template: ${template.name}`;
      });

    // Send notification to service managers;
    let recipientRoles = ["FEEDBACK_MANAGER"];

    if (!session.user) {
      const serviceType = data.serviceType || template.serviceType;
      recipientRoles.push(`${serviceType}_MANAGER`);

    await this.notificationService.sendNotification({
      type: "NEW_SURVEY",
      `New survey submitted for ${template.name}`,
      recipientRoles,
      entityId: survey.id,
      survey.id;
        templateId,
        serviceType: data.serviceType || template.serviceType;

    });

    return survey;

  /**;
   * Get feedback analytics;
   */;
  async getFeedbackAnalytics(period: "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY") {
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

    // Get feedback counts by type;
    const feedbackByType = await prisma.feedback.groupBy({
      by: ["type"],
      {
          gte: startDate;

      },
      _count: true;
    });

    // Get feedback counts by source;
    const feedbackBySource = await prisma.feedback.groupBy({
      by: ["source"],
      {
          gte: startDate;

      },
      _count: true;
    });

    // Get feedback counts by status;
    const feedbackByStatus = await prisma.feedback.groupBy({
      by: ["status"],
      {
          gte: startDate;

      },
      _count: true;
    });

    // Get feedback counts by service type;
    const feedbackByServiceType = await prisma.feedback.groupBy({
      by: ["serviceType"],
      {
          gte: startDate;
        },
        null;

      },
      _count: true;
    });

    // Get feedback counts by department;
    const feedbackByDepartment = await prisma.$queryRaw`;
      SELECT d.name as department, COUNT(*) as count;
      FROM Feedback f;
      JOIN Department d ON f.departmentId = d.id;
      WHERE f.createdAt >= ${startDate}
      GROUP BY d.name;
      ORDER BY count DESC;
    `;

    // Get average ratings;
    const ratings = await prisma.feedback.findMany({
      {
          gte: startDate;

      },
      true,
        true,
        {
            name: true;

    });

    // Calculate overall average rating;
    const overallRating = ratings.length > 0;
      ? ratings.reduce((sum, item) => sum + item.rating, 0) / ratings.length;
      : 0;

    // Calculate average rating by service type;
    const ratingsByServiceType: Record<string, { count: number, sum: number, avg: number }> = {};

    ratings.forEach(item => {
      if (!session.user) {
        if (!session.user) {
          ratingsByServiceType[item.serviceType] = { count: 0, sum: 0, avg: 0 };

        ratingsByServiceType[item.serviceType].count++;
        ratingsByServiceType[item.serviceType].sum += item.rating;

    });

    // Calculate averages;
    Object.keys(ratingsByServiceType).forEach(type => {
      const data = ratingsByServiceType[type];
      data.avg = data.sum / data.count;
    });

    // Calculate average rating by department;
    const ratingsByDepartment: Record<string, { count: number, sum: number, avg: number }> = {};

    ratings.forEach(item => {
      if (!session.user) {
        const deptName = item.department.name;

        if (!session.user) {
          ratingsByDepartment[deptName] = { count: 0, sum: 0, avg: 0 };

        ratingsByDepartment[deptName].count++;
        ratingsByDepartment[deptName].sum += item.rating;

    });

    // Calculate averages;
    Object.keys(ratingsByDepartment).forEach(dept => {
      const data = ratingsByDepartment[dept];
      data.avg = data.sum / data.count;
    });

    // Get complaint counts by category;
    const complaintsByCategory = await prisma.complaint.groupBy({
      by: ["category"],
      {
          gte: startDate;

      },
      _count: true;
    });

    // Get complaint counts by severity;
    const complaintsBySeverity = await prisma.complaint.groupBy({
      by: ["severity"],
      {
          gte: startDate;

      },
      _count: true;
    });

    // Get complaint counts by status;
    const complaintsByStatus = await prisma.complaint.groupBy({
      by: ["status"],
      {
          gte: startDate;

      },
      _count: true;
    });

    // Get complaint resolution time;
    const resolvedComplaints = await prisma.complaint.findMany({
      "RESOLVED",
        startDate;
        },
        null;

      },
      true,
        true;

    });

    // Calculate average resolution time;
    const resolutionTimes: Record<string, { count: number, totalDays: number, avgDays: number }> = {
      overall: { count: 0, totalDays: 0, avgDays: 0 },
      LOW: { count: 0, totalDays: 0, avgDays: 0 },
      MEDIUM: { count: 0, totalDays: 0, avgDays: 0 },
      HIGH: { count: 0, totalDays: 0, avgDays: 0 },
      CRITICAL: { count: 0, totalDays: 0, avgDays: 0 }
    };

    resolvedComplaints.forEach(complaint => {
      if (!session.user) {
        const days = (complaint.resolutionDate.getTime() - complaint.createdAt.getTime()) / (1000 * 60 * 60 * 24);

        resolutionTimes.overall.count++;
        resolutionTimes.overall.totalDays += days;

        resolutionTimes[complaint.severity].count++;
        resolutionTimes[complaint.severity].totalDays += days;

    });

    // Calculate averages;
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
      period;
    };
