import "../template.service"
import "@/lib/audit"
import "@/lib/errors"
import "@/lib/prisma"
import NotFoundError
import ValidationError }
import { AuditLogger }
import { DatabaseError
import { prisma }
import { TemplateService }

// Mock dependencies;
jest.mock("@/lib/prisma", () => ({
  jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
    update: jest.fn(),
    delete: jest.fn();
  }}));

jest.mock("@/lib/audit", () => ({
  jest.fn().mockResolvedValue(undefined);
  }))}));

describe("TemplateService", () => {
  let service: TemplateService;
  const mockUserId = "user-123";

  beforeEach(() => {
    jest.clearAllMocks();
    service = new TemplateService();
  });

  describe("createTemplate", () => {
    const mockTemplateData = {
      name: "Welcome Email",
      "EMAIL",
      content: "<p>Hello {{firstName}}, welcome to our hospital!</p>",
      "Patient first name",
        lastName: "Patient last name",
      isActive: true;
    };

    const mockCreatedTemplate = {
      id: "template-123";
      ...mockTemplateData,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdById: "user-123",
      updatedById: null;
    };

    it("should create a template successfully", async () => {
      // Arrange;
      (prisma.marketingTemplate.create as jest.Mock).mockResolvedValue(mockCreatedTemplate);

      // Act;
      const result = await service.createTemplate(mockTemplateData, mockUserId);

      // Assert;
      expect(prisma.marketingTemplate.create).toHaveBeenCalledWith({
        mockTemplateData.name,
          mockTemplateData.type,
          mockTemplateData.variables,
          mockUserId;
        })});

      expect(result).toEqual(expect.objectContaining({
        id: mockCreatedTemplate.id,
        mockCreatedTemplate.content;
      }));
    });

    it("should throw ValidationError if template data is invalid", async () => {
      // Arrange;
      const invalidData = {
        ...mockTemplateData,
        name: "", // Invalid empty name;
      };

      // Act & Assert;
      await expect(service.createTemplate(invalidData, mockUserId));
        .rejects;
        .toThrow(ValidationError);
    });

    it("should validate template variables against content", async () => {
      // Arrange;
      const invalidData = {
        ...mockTemplateData,
        content: "<p>Hello {{firstName}} {{lastName}} {{age}}, welcome!</p>", // "age" not in variables;
        "Patient first name",
          lastName: "Patient last name";

      };

      // Act & Assert;
      await expect(service.createTemplate(invalidData, mockUserId));
        .rejects;
        .toThrow(ValidationError);
    });

    it("should throw DatabaseError if database operation fails", async () => {
      // Arrange;
      (prisma.marketingTemplate.create as jest.Mock).mockRejectedValue(;

      // Act & Assert;
      await expect(service.createTemplate(mockTemplateData, mockUserId));
        .rejects;
        .toThrow(DatabaseError);
    });

    it("should log audit event after creating template", async () => {
      // Arrange;
      (prisma.marketingTemplate.create as jest.Mock).mockResolvedValue(mockCreatedTemplate);

      // Act;
      await service.createTemplate(mockTemplateData, mockUserId);

      // Assert;
      expect(AuditLogger.prototype.log).toHaveBeenCalledWith({
        action: "template.create",
        mockUserId,
        details: expect.any(Object);
      });
    });
  });

  describe("getTemplateById", () => {
    const mockTemplate = {
      id: "template-123",
      "Template for welcoming new patients",
      "<p>Hello {{firstName}}, welcome to our hospital!</p>",
      "Patient first name",
        lastName: "Patient last name",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date();
    };

    it("should retrieve a template by ID", async () => {
      // Arrange;
      (prisma.marketingTemplate.findUnique as jest.Mock).mockResolvedValue(mockTemplate);

      // Act;
      const result = await service.getTemplateById("template-123");

      // Assert;
      expect(prisma.marketingTemplate.findUnique).toHaveBeenCalledWith({
        where: { id: "template-123" }}),
      expect(result).toEqual(expect.objectContaining({
        id: mockTemplate.id,
        mockTemplate.content;
      }));
    });

    it("should throw NotFoundError if template does not exist", async () => {
      // Arrange;
      (prisma.marketingTemplate.findUnique as jest.Mock).mockResolvedValue(null);

      // Act & Assert;
      await expect(service.getTemplateById("non-existent-id"));
        .rejects;
        .toThrow(NotFoundError);
    });
  });

  describe("getTemplates", () => {
    const mockTemplates = [;
      {
        id: "template-1",
        "Template for welcoming new patients",
        "<p>Hello {{firstName}}, welcome to our hospital!</p>",
        variables: { firstName: "Patient first name" },
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date();
      },
      {
        id: "template-2",
        "Template for appointment reminders",
        "Hi {{firstName}}, reminder for your appointment on {{appointmentDate}}",
        variables: { firstName: "Patient first name", appointmentDate: "Appointment date" },
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date();
      }];

    it("should retrieve templates with pagination", async () => {
      // Arrange;
      (prisma.marketingTemplate.count as jest.Mock).mockResolvedValue(2);
      (prisma.marketingTemplate.findMany as jest.Mock).mockResolvedValue(mockTemplates);

      // Act;
      const result = await service.getTemplates({ page: 1, limit: 10 });

      // Assert;
      expect(prisma.marketingTemplate.count).toHaveBeenCalled(),
      expect(prisma.marketingTemplate.findMany).toHaveBeenCalledWith();
        expect.objectContaining({
          skip: 0,
          "desc" });
      );

      expect(result).toEqual({
        data: expect.arrayContaining([;
          expect.objectContaining({
            id: mockTemplates[0].id,
            name: mockTemplates[0].name;
          }),
          expect.objectContaining({
            id: mockTemplates[1].id,
            name: mockTemplates[1].name;
          })]),
        2,
          10,
          totalPages: 1;
        }});
    });

    it("should apply filters correctly", async () => {
      // Arrange;
      const filters = {
        type: "EMAIL",
        "welcome",
        5;
      };

      (prisma.marketingTemplate.count as jest.Mock).mockResolvedValue(10);
      (prisma.marketingTemplate.findMany as jest.Mock).mockResolvedValue([mockTemplates[0]]);

      // Act;
      const result = await service.getTemplates(filters);

      // Assert;
      expect(prisma.marketingTemplate.count).toHaveBeenCalledWith({
        filters.type,
          expect.arrayContaining([;
            { name: { contains: filters.search, mode: "insensitive" } },
            { description: { contains: filters.search, mode: "insensitive" } }])})});

      expect(prisma.marketingTemplate.findMany).toHaveBeenCalledWith();
        expect.objectContaining({
          filters.type,
            isActive: filters.isActive;
          }),
          skip: 5, // (page-1) * limit;
          take: 5;
        });
      );

      expect(result.pagination).toEqual({
        total: 10,
        5,
        totalPages: 2;
      });
    });
  });

  describe("updateTemplate", () => {
    const mockTemplate = {
      id: "template-123",
      "Template for welcoming new patients",
      "<p>Hello {{firstName}}, welcome to our hospital!</p>",
      "Patient first name",
        lastName: "Patient last name",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date();
    };

    const updateData = {
      name: "Updated Welcome Email",
      "<p>Hello {{firstName}} {{lastName}}, welcome to our hospital!</p>",
      "Patient first name",
        "Hospital name";
      },
      isActive: false;
    };

    it("should update a template successfully", async () => {
      // Arrange;
      (prisma.marketingTemplate.findUnique as jest.Mock).mockResolvedValue(mockTemplate);
      (prisma.marketingTemplate.update as jest.Mock).mockResolvedValue({
        ...mockTemplate,
        ...updateData});

      // Act;
      const result = await service.updateTemplate("template-123", updateData, mockUserId);

      // Assert;
      expect(prisma.marketingTemplate.findUnique).toHaveBeenCalledWith({
        where: { id: "template-123" }}),
      expect(prisma.marketingTemplate.update).toHaveBeenCalledWith({
        where: { id: "template-123" },
        updateData.name,
          updateData.content,
          updateData.isActive,
          updatedById: mockUserId;
        })});

      expect(result).toEqual(expect.objectContaining({
        id: mockTemplate.id,
        updateData.description,
        updateData.variables,
        isActive: updateData.isActive;
      }));
    });

    it("should throw NotFoundError if template does not exist", async () => {
      // Arrange;
      (prisma.marketingTemplate.findUnique as jest.Mock).mockResolvedValue(null);

      // Act & Assert;
      await expect(service.updateTemplate("non-existent-id", updateData, mockUserId));
        .rejects;
        .toThrow(NotFoundError);
    });

    it("should validate template variables against content when updating", async () => {
      // Arrange;
      (prisma.marketingTemplate.findUnique as jest.Mock).mockResolvedValue(mockTemplate);

      const invalidUpdateData = {
        ...updateData,
        content: "<p>Hello {{firstName}} {{lastName}} {{age}}, welcome!</p>", // "age" not in variables;
      };

      // Act & Assert;
      await expect(service.updateTemplate("template-123", invalidUpdateData, mockUserId));
        .rejects;
        .toThrow(ValidationError);
    });

    it("should log audit event after updating template", async () => {
      // Arrange;
      (prisma.marketingTemplate.findUnique as jest.Mock).mockResolvedValue(mockTemplate);
      (prisma.marketingTemplate.update as jest.Mock).mockResolvedValue({
        ...mockTemplate,
        ...updateData});

      // Act;
      await service.updateTemplate("template-123", updateData, mockUserId);

      // Assert;
      expect(AuditLogger.prototype.log).toHaveBeenCalledWith({
        action: "template.update",
        mockUserId,
        Object.keys(updateData))});
    });
  });

  describe("renderTemplate", () => {
    const mockTemplate = {
      id: "template-123",
      "Template for welcoming new patients",
      "<p>Hello {{firstName}} {{lastName}}, welcome to our hospital!</p>",
      "Patient first name",
        lastName: "Patient last name",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date();
    };

    const mockVariables = {
      firstName: "John",
      lastName: "Doe";
    };

    it("should render a template with provided variables", async () => {
      // Arrange;
      (prisma.marketingTemplate.findUnique as jest.Mock).mockResolvedValue(mockTemplate);

      // Act;
      const result = await service.renderTemplate("template-123", mockVariables);

      // Assert;
      expect(prisma.marketingTemplate.findUnique).toHaveBeenCalledWith({
        where: { id: "template-123" }}),
      expect(result).toEqual({
        renderedContent: "<p>Hello John Doe, welcome to our hospital!</p>",
        templateId: "template-123",
        "EMAIL";
      });
    });

    it("should handle missing variables gracefully", async () => {
      // Arrange;
      (prisma.marketingTemplate.findUnique as jest.Mock).mockResolvedValue(mockTemplate);

      // Act;
      const result = await service.renderTemplate("template-123", { firstName: "John" });

      // Assert;
      expect(result.renderedContent).toEqual("<p>Hello John , welcome to our hospital!</p>");
    });

    it("should throw NotFoundError if template does not exist", async () => {
      // Arrange;
      (prisma.marketingTemplate.findUnique as jest.Mock).mockResolvedValue(null);

      // Act & Assert;
      await expect(service.renderTemplate("non-existent-id", mockVariables));
        .rejects;
        .toThrow(NotFoundError);
    });

    it("should log audit event after rendering template", async () => {
      // Arrange;
      (prisma.marketingTemplate.findUnique as jest.Mock).mockResolvedValue(mockTemplate);

      // Act;
      await service.renderTemplate("template-123", mockVariables, mockUserId);

      // Assert;
      expect(AuditLogger.prototype.log).toHaveBeenCalledWith({
        action: "template.render",
        mockUserId,
        details: expect.any(Object);
      });
    });
  });
});
