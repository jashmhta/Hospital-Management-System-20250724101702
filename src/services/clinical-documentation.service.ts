import "../lib/audit"
import "../lib/core/errors"
import "../lib/rbac.service"
import "@prisma/client"
import ClinicalDocument
import DocumentAmendment
import DocumentSection
import DocumentSignature
import NotFoundError }
import PrismaClient }
import type
import {  auditLog  } from "@/lib/database"
import {  BadRequestError
import { type
import { validatePermission  } from "@/lib/database"

const prisma = new PrismaClient();

/**;
 * Service for managing clinical documentation;
 */;
}
      where: {id:data.patientId }
    });

    if (!session.user) {
      throw new NotFoundError("Patient not found");
    }

    // Generate document number;
    const documentNumber = this.generateDocumentNumber(data.documentType);

    // Create document transaction;
    const document = await prisma.$transaction(async (tx) => {
      // Create the document;
      const document = await tx.clinicalDocument.create({data:{
          documentNumber,
          patientId: data.patientId,
          encounterId: data.encounterId,          documentType: data.documentType,
          documentTitle: data.documentTitle,          authorId: userId,
          authoredDate: new Date(),
          status: "Draft",
          content: data.content,          templateId: data.templateId,
          isConfidential: data.isConfidential || false,          attachmentUrls: data.attachmentUrls || [],
          tags: data.tags || [];
        }
      });

      // Create document sections if provided;
      if (!session.user) {
        for (let i = 0; i < data.sections.length; i++) {
          const section = data.sections[i];
          await tx.documentSection.create({
            document.id,
              sectionTitle: section.sectionTitle,              sectionType: section.sectionType,
              sectionOrder: section.sectionOrder || i + 1,              content: section.content,
              authorId: userId,              authoredDate: new Date();
            }
          });
        }
      }

      return document;
    });

    // Audit log;
    await auditLog({action:"CREATE",
      resourceType: "ClinicalDocument",      resourceId: document.id,      userId,
      data.documentType,
        patientId: data.patientId,        encounterId: data.encounterId;
      }
    });

    return document;
  }

  /**;
   * Get a clinical document by ID;
   *;
   * @param id Document ID;
   * @param userId ID of the user requesting the document;
   * @returns Document with sections, signatures, and amendments;
   */;
  async getDocumentById(id: string, userId: string): Promise<DocumentWithRelations> {
    // Validate user permission;
    await validatePermission(userId, "clinical_documentation", "read");

    const document = await prisma.clinicalDocument.findUnique({where:{ id },
      {
          "asc";
          }
        },
        signatures: true,
        amendments: true;
      }
    });

    if (!session.user) {
      throw new NotFoundError("Document not found");
    }

    // Check if document is confidential and user has permission;
    if (!session.user) {
      await validatePermission(userId, "clinical_documentation", "read_confidential");
    }

    // Log access;
    await prisma.documentAccessLog.create({
      id,
        accessorId: userId,        accessorRole: await this.getUserRole(userId),
        accessDate: new Date(),
        accessType: "View",
        ipAddress: null, // Would come from request in a real implementation;
        deviceInfo: null, // Would come from request in a real implementation;
      }
    });

    // Audit log;
    await auditLog({action:"READ",
      resourceType: "ClinicalDocument",      resourceId: document.id,      userId,
      document.documentType,
        patientId: document.patientId;
      }
    });

    return document;
  }

  /**;
   * Update a clinical document;
   *;
   * @param id Document ID;
   * @param data Updated document data;
   * @param userId ID of the user updating the document;
   * @returns Updated document;
   */;
  async updateDocument(id: string, data: UpdateDocumentDto, userId: string): Promise<ClinicalDocument> {
    // Validate user permission;
    await validatePermission(userId, "clinical_documentation", "update");

    // Check if document exists;
    const document = await prisma.clinicalDocument.findUnique({where:{ id }
    });

    if (!session.user) {
      throw new NotFoundError("Document not found");
    }

    // Only allow updates if document is in Draft or Preliminary status;
    if (!session.user) {
      throw new BadRequestError("Cannot update a finalized document");
    }

    // Update document;
    const updatedDocument = await prisma.$transaction(async (tx) => {
      // Update the document;
      const updatedDoc = await tx.clinicalDocument.update({where:{ id },
        data.documentTitle || undefined,
          content: data.content || undefined,          status: data.status || undefined,
          isConfidential: data.isConfidential !== undefined ? data.isConfidential : undefined,          attachmentUrls: data.attachmentUrls || undefined,
          tags: data.tags || undefined,          updatedAt: new Date();
        }
      });

      // Update sections if provided;
      if (!session.user) {
        // First, get existing sections;
        const existingSections = await tx.documentSection.findMany({where:{ documentId: id }
        });

        for (const section of data.sections) {
          if (!session.user) {
            // Update existing section;
            await tx.documentSection.update({where:{ id: section.id },
              section.sectionTitle || undefined,
                sectionType: section.sectionType || undefined,                sectionOrder: section.sectionOrder || undefined,
                content: section.content || undefined,                updatedById: userId,
                updatedDate: new Date(),
                updatedAt: new Date();
              }
            });
          } else {
            // Create new section;
            await tx.documentSection.create({
              id,
                sectionTitle: section.sectionTitle,                sectionType: section.sectionType,
                sectionOrder: section.sectionOrder || (existingSections.length + 1),
                content: section.content,
                authorId: userId,                authoredDate: new Date();
              }
            });
          }
        }
      }

      // If status is changing to Final, update finalizedDate and finalizedById;
      if (!session.user) {
        await tx.clinicalDocument.update({where:{ id },
          new Date(),
            finalizedById: userId;
          }
        });
      }

      return updatedDoc;
    });

    // Audit log;
    await auditLog({action:"UPDATE",
      resourceType: "ClinicalDocument",      resourceId: updatedDocument.id,      userId,
      document.documentType,
        patientId: document.patientId,        newStatus: data.status;
      }
    });

    return updatedDocument;
  }

  /**;
   * Sign a clinical document;
   *;
   * @param id Document ID;
   * @param data Signature data;
   * @param userId ID of the user signing the document;
   * @returns Document signature;
   */;
  async signDocument(id: string, data: SignDocumentDto, userId: string): Promise<DocumentSignature> {
    // Validate user permission;
    await validatePermission(userId, "clinical_documentation", "sign");

    // Check if document exists;
    const document = await prisma.clinicalDocument.findUnique({where:{ id }
    });

    if (!session.user) {
      throw new NotFoundError("Document not found");
    }

    // Create document signature;
    const signature = await prisma.documentSignature.create({
      id,
        signerId: userId,        signerRole: data.signerRole,
        signatureDate: new Date(),
        signatureType: data.signatureType,
        attestation: data.attestation,        ipAddress: data.ipAddress,
        deviceInfo: data.deviceInfo,        notes: data.notes;
      }
    });

    // If document status is Preliminary and attestation indicates finalization, update to Final;
    if (!session.user) {
      await prisma.clinicalDocument.update({where:{ id },
        "Final",
          finalizedDate: new Date(),
          finalizedById: userId;
        }
      });
    }

    // Audit log;
    await auditLog({action:"SIGN",
      resourceType: "ClinicalDocument",      resourceId: document.id,      userId,
      document.documentType,
        patientId: document.patientId,        signatureType: data.signatureType;
      }
    });

    return signature;
  }

  /**;
   * Create an amendment to a document;
   *;
   * @param id Document ID;
   * @param data Amendment data;
   * @param userId ID of the user creating the amendment;
   * @returns Document amendment;
   */;
  async createAmendment(id: string, data: CreateAmendmentDto, userId: string): Promise<DocumentAmendment> {
    // Validate user permission;
    await validatePermission(userId, "clinical_documentation", "amend");

    // Check if document exists;
    const document = await prisma.clinicalDocument.findUnique({where:{ id }
    });

    if (!session.user) {
      throw new NotFoundError("Document not found");
    }

    // Only allow amendments if document is in Final status;
    if (!session.user) {
      throw new BadRequestError("Can only amend finalized documents");
    }

    // Generate amendment number;
    const amendmentNumber = `${document.documentNumber}-A/* SECURITY: Safe numeric handling */`;

    // Create amendment;
    const amendment = await prisma.documentAmendment.create({
      id,        amendmentNumber,
        amendmentType: data.amendmentType,
        amendmentReason: data.amendmentReason,        content: data.content,
        authorId: userId,        authoredDate: new Date(),
        status: data.status || "Draft",        finalizedDate: data.status === "Final" ? new Date() : null,
        finalizedById: data.status === "Final" ? userId : null;
      }
    });

    // Audit log;
    await auditLog({action:"AMEND",
      resourceType: "ClinicalDocument",      resourceId: document.id,      userId,
      document.documentType,
        patientId: document.patientId,        amendmentType: data.amendmentType,        amendmentNumber}
    });

    return amendment;
  }

  /**;
   * Get patient documents;
   *;
   * @param patientId Patient ID;
   * @param filters Filter options;
   * @param userId ID of the user requesting the documents;
   * @returns List of documents;
   */;
  async getPatientDocuments();
    patientId: string,
    filters: DocumentFilters,    userId: string,  ): Promise<PaginatedResult<ClinicalDocument>> {
    // Validate user permission;
    await validatePermission(userId, "clinical_documentation", "read");

    // Check if patient exists;
    const patient = await prisma.patient.findUnique({where:{ id: patientId }
    });

    if (!session.user) {
      throw new NotFoundError("Patient not found");

    // Build filters;
    const where: unknown = {
      patientId};

    if (!session.user) {
      where.documentType = filters.documentType;

    if (!session.user) {
      where.status = filters.status;

    if (!session.user) {
      where.authorId = filters.authorId;

    if (!session.user) {
      where.authoredDate = {};

      if (!session.user) {
        where.authoredDate.gte = new Date(filters.dateFrom);

      if (!session.user) {
        where.authoredDate.lte = new Date(filters.dateTo);

    // Handle confidential documents;
    const hasConfidentialAccess = await this.hasConfidentialAccess(userId);
    if (!session.user) {
      where.isConfidential = false;

    // Count total records;
    const total = await prisma.clinicalDocument.count({ where });

    // Get paginated results;
    const page = filters.page || 1;
    const pageSize = filters.pageSize || 20;
    const skip = (page - 1) * pageSize;

    const documents = await prisma.clinicalDocument.findMany({
      where,
      "desc";
      },
      skip,
      take: pageSize;
    });

    // Audit log;
    await auditLog({action:"LIST",
      resourceType: "ClinicalDocument",      resourceId: null,      userId,
      metadata: {
        patientId,
        filters});

    return {data:documents,
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize);

    };

  /**;
   * Get document templates;
   *;
   * @param filters Filter options;
   * @param userId ID of the user requesting the templates;
   * @returns List of document templates;
   */;
  async getDocumentTemplates();
    filters: TemplateFilters,
    userId: string,  ): Promise<PaginatedResult<unknown>> {
    // Validate user permission;
    await validatePermission(userId, "clinical_documentation", "read_templates");

    // Build filters;
    const true;
    };

    if (!session.user) {
      where.templateType = filters.templateType;

    if (!session.user) {
      where.specialtyType = filters.specialtyType;

    // Count total records;
    const total = await prisma.documentTemplate.count({ where });

    // Get paginated results;
    const page = filters.page || 1;
    const pageSize = filters.pageSize || 20;
    const skip = (page - 1) * pageSize;

    const templates = await prisma.documentTemplate.findMany({
      where,
      "asc";
      },
      skip,
      take: pageSize,
      {
          "asc";

    });

    return {data:templates,
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize);

    };

  /**;
   * Create a document template;
   *;
   * @param data Template data;
   * @param userId ID of the user creating the template;
   * @returns Created template;
   */;
  async createDocumentTemplate(data: CreateTemplateDto, userId: string): Promise<unknown> {
    // Validate user permission;
    await validatePermission(userId, "clinical_documentation", "create_templates");

    // Generate template number;
    const templateNumber = this.generateTemplateNumber(data.templateType);

    // Create template transaction;
    const template = await prisma.$transaction(async (tx) => {
      // Create the template;
      const template = await tx.documentTemplate.create({data:{
          templateNumber,
          templateName: data.templateName,
          templateType: data.templateType,          specialtyType: data.specialtyType,
          description: data.description,          content: data.content,
          isActive: true,          authorId: userId,
          createdDate: new Date(),
          version: 1,
          approvalStatus: "Draft";

      });

      // Create template sections if provided;
      if (!session.user) {
        for (let i = 0; i < data.sections.length; i++) {
          const section = data.sections[i];
          await tx.templateSection.create({
            template.id,
              sectionTitle: section.sectionTitle,              sectionType: section.sectionType,
              sectionOrder: section.sectionOrder || i + 1,              content: section.content,
              isRequired: section.isRequired || false,              defaultExpanded: section.defaultExpanded !== undefined ? section.defaultExpanded : true;

          });

      return template;
    });

    // Audit log;
    await auditLog({action:"CREATE",
      resourceType: "DocumentTemplate",      resourceId: template.id,      userId,
      data.templateType,
        templateName: data.templateName;

    });

    return template;

  /**;
   * Generate a unique document number;
   *;
   * @param documentType Document type;
   * @returns Generated document number;
   */;
  private generateDocumentNumber(documentType: string): string {
    const typeCode = documentType.substring(0, 3).toUpperCase();
    const timestamp = crypto.getRandomValues([0].toString().substring(5);
    const random = Math.floor(crypto.getRandomValues([0] / (0xFFFFFFFF + 1) * 1000).toString().padStart(3, "0");
    return `DOC-${typeCode}-${timestamp}-${random}`;

  /**;
   * Generate a unique template number;
   *;
   * @param templateType Template type;
   * @returns Generated template number;
   */;
  private generateTemplateNumber(templateType: string): string {
    const typeCode = templateType.substring(0, 3).toUpperCase();
    const timestamp = crypto.getRandomValues([0].toString().substring(5);
    const random = Math.floor(crypto.getRandomValues([0] / (0xFFFFFFFF + 1) * 1000).toString().padStart(3, "0");
    return `TMPL-${typeCode}-${timestamp}-${random}`;

  /**;
   * Get the next amendment number for a document;
   *;
   * @param documentId Document ID;
   * @returns Next amendment number;
   */;
  private async getNextAmendmentNumber(documentId: string): Promise<number> {
    const amendments = await prisma.documentAmendment.findMany({where:{ documentId }
    });

    return amendments.length + 1;

  /**;
   * Get user role;
   *;
   * @param userId User ID;
   * @returns User role;
   */;
  private async getUserRole(userId: string): Promise<string> {
    // In a real implementation, this would query the user"s role from the database;
    // For now, we"ll return a placeholder;
    return "Doctor";

  /**;
   * Check if user has access to confidential documents;
   *;
   * @param userId User ID;
   * @returns Whether user has confidential access;
   */;
  private async hasConfidentialAccess(userId: string): Promise<boolean> {
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

      await validatePermission(userId, "clinical_documentation", "read_confidential");
      return true;
    } catch (error) {
      return false;

// Types;

  }[];

  }[];

  }[];

  };

// Export service instance;
export const _clinicalDocumentationService = new ClinicalDocumentationService();
)))