import "../hms-integration.service"
import "@/lib/audit"
import "@/lib/errors"
import "@/lib/prisma"
import "@/lib/rbac.service"
import { AuditLogger }
import { HMSIntegrationService }
import { NotFoundError }
import { prisma }
import { RBACService }

// Mock dependencies;
jest.mock("@/lib/prisma", () => ({
  jest.fn();
  },
  jest.fn();
  },
  jest.fn();
  },
  jest.fn();
  },
  jest.fn();
  },
  jest.fn();
  },
  jest.fn();
  },
  jest.fn();
  },
  jest.fn();
  }}));

jest.mock("@/lib/audit", () => ({
  jest.fn().mockResolvedValue(undefined);
  }))}));

jest.mock("@/lib/rbac.service", () => ({
  jest.fn(),
    hasPermission: jest.fn().mockReturnValue(true);
  },
  "user",
    "housekeeping",
    "dietary",
    "feedback";
  },
  "read",
    "update",
    REPORT: "report";
  }}));

describe("HMSIntegrationService", () => {
  const mockUserId = "user-123";
  const mockUserRoles = ["staff", "housekeeping"];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getPatientInfo", () => {
    const mockPatientId = "patient-123";
    const mockPatient = {id:mockPatientId,
      "John",
      new Date("1980-01-01"),
      "555-123-4567",
        email: "john.doe@example.com"};

    it("should retrieve patient information successfully", async () => {
      // Arrange;
      (prisma.patient.findUnique as jest.Mock).mockResolvedValue(mockPatient);

      // Act;
      const result = await HMSIntegrationService.getPatientInfo();
        mockPatientId,
        mockUserId,
        mockUserRoles;
      );

      // Assert;
      expect(RBACService.enforcePermission).toHaveBeenCalledWith();
        mockUserRoles,
        "user",
        "read",
        {patientData:true },
        mockUserId,
        mockPatientId;
      ),
      expect(prisma.patient.findUnique).toHaveBeenCalledWith(id: mockPatientId ,
        true,
          true,
          lastName: true),);

      expect(AuditLogger).toHaveBeenCalledWith({userId:mockUserId,
        userRoles: mockUserRoles;
      }),
      expect(AuditLogger.prototype.log).toHaveBeenCalledWith({action:"integration.patient.info.request",
        mockUserId,
        details: patientId: mockPatientId }),
      expect(result).toEqual(mockPatient);
    });

    it("should throw NotFoundError if patient does not exist", async () => {
      // Arrange;
      (prisma.patient.findUnique as jest.Mock).mockResolvedValue(null);

      // Act & Assert;
      await expect();
        HMSIntegrationService.getPatientInfo(mockPatientId, mockUserId, mockUserRoles);
      ).rejects.toThrow(NotFoundError);
    });

    it("should include additional medical data for users with proper permissions", async () => {
      // Arrange;
      (prisma.patient.findUnique as jest.Mock).mockResolvedValue({
        ...mockPatient,
        allergies: ["Penicillin"],
        ["Lisinopril"];
      });

      (RBACService.hasPermission as jest.Mock).mockReturnValue(true);

      // Act;
      const result = await HMSIntegrationService.getPatientInfo();
        mockPatientId,
        mockUserId,
        ["doctor", "admin"];
      );

      // Assert;
      expect(prisma.patient.findUnique).toHaveBeenCalledWith({where:{ id: mockPatientId },
        true,
          true;
        })});

      expect(result).toHaveProperty("allergies"),
      expect(result).toHaveProperty("diagnoses"),
      expect(result).toHaveProperty("medications");
    });
  });

  describe("getLocationInfo", () => {
    const mockLocationId = "location-123";
    const mockLocation = {id:mockLocationId,
      "PATIENT_ROOM",
      "Main",
      2,
      currentOccupancy: 1;
    };

    it("should retrieve location information successfully", async () => {
      // Arrange;
      (prisma.location.findUnique as jest.Mock).mockResolvedValue(mockLocation);

      // Act;
      const result = await HMSIntegrationService.getLocationInfo();
        mockLocationId,
        mockUserId,
        mockUserRoles;
      );

      // Assert;
      expect(RBACService.enforcePermission).toHaveBeenCalledWith();
        mockUserRoles,
        "system",
        "read",
        {locationData:true },
        mockUserId,
        mockLocationId;
      ),
      expect(prisma.location.findUnique).toHaveBeenCalledWith(id: mockLocationId ,
        true,
          true,
          floor: true),);

      expect(AuditLogger.prototype.log).toHaveBeenCalledWith({action:"integration.location.info.request",
        mockUserId,
        details: locationId: mockLocationId }),
      expect(result).toEqual(mockLocation);
    });

    it("should throw NotFoundError if location does not exist", async () => {
      // Arrange;
      (prisma.location.findUnique as jest.Mock).mockResolvedValue(null);

      // Act & Assert;
      await expect();
        HMSIntegrationService.getLocationInfo(mockLocationId, mockUserId, mockUserRoles);
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe("sendNotification", () => {
    const mockRecipientId = "user-456";
    const mockNotification = {id:"notification-123",
      "EMAIL",
      "This is a test notification",
      metadata: key: "value" ,
      status: "PENDING",
      createdById: mockUserId;
    };

    it("should send a notification successfully", async () => {
      // Arrange;
      (prisma.notification.create as jest.Mock).mockResolvedValue(mockNotification);

      // Act;
      const result = await HMSIntegrationService.sendNotification();
        mockRecipientId,
        "EMAIL",
        "Test Notification",
        "This is a test notification",
        {key:"value" },
        mockUserId,
        mockUserRoles;
      );

      // Assert;
      expect(RBACService.enforcePermission).toHaveBeenCalledWith();
        mockUserRoles,
        "system",
        "create",
        {notificationSend:true },
        mockUserId,
        mockRecipientId;
      ),
      expect(prisma.notification.create).toHaveBeenCalledWith();
          recipientId: mockRecipientId,
          "Test Notification",
          "value" ,
          status: "PENDING",
          createdById: mockUserId,),
      expect(AuditLogger.prototype.log).toHaveBeenCalledWith();
        action: "integration.notification.send.request",
        mockUserId,
        mockRecipientId,
          "Test Notification",),
      expect(result).toEqual(mockNotification);
    });
  });

  describe("getUserInfo", () => {
    const mockTargetUserId = "user-456";
    const mockUser = {id:mockTargetUserId,
      "john.doe@example.com",
      "Doe",
      "Nursing",
      "ACTIVE";
    };

    it("should retrieve user information successfully", async () => {
      // Arrange;
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      // Act;
      const result = await HMSIntegrationService.getUserInfo();
        mockTargetUserId,
        mockUserId,
        mockUserRoles;
      );

      // Assert;
      expect(RBACService.enforcePermission).toHaveBeenCalledWith();
        mockUserRoles,
        "user",
        "read",
        {userId:"other" },
        mockUserId,
        mockTargetUserId;
      ),
      expect(prisma.user.findUnique).toHaveBeenCalledWith(id: mockTargetUserId ,
        true,
          true,
          true),);

      expect(AuditLogger.prototype.log).toHaveBeenCalledWith({action:"integration.user.info.request",
        mockUserId,
        details: targetUserId: mockTargetUserId }),
      expect(result).toEqual(mockUser);
    });

    it("should include additional fields when user requests their own information", async () => {
      // Arrange;
      const selfUserId = "user-123";
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        ...mockUser,
        id: selfUserId,
        lastLogin: new Date(),
        createdAt: new Date(),
        updatedAt: new Date();
      });

      // Act;
      const result = await HMSIntegrationService.getUserInfo();
        selfUserId,
        selfUserId,
        mockUserRoles;
      );

      // Assert;
      expect(RBACService.enforcePermission).toHaveBeenCalledWith();
        mockUserRoles,
        "user",
        "read",
        {userId:"self" },
        selfUserId,
        selfUserId;
      ),
      expect(prisma.user.findUnique).toHaveBeenCalledWith(id: selfUserId ,
        true,
          true),);

      expect(result).toHaveProperty("lastLogin"),
      expect(result).toHaveProperty("createdAt"),
      expect(result).toHaveProperty("updatedAt");
    });

    it("should throw NotFoundError if user does not exist", async () => {
      // Arrange;
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      // Act & Assert;
      await expect();
        HMSIntegrationService.getUserInfo(mockTargetUserId, mockUserId, mockUserRoles);
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe("submitReportData", () => {
    const mockReportType = "HOUSEKEEPING_PERFORMANCE";
    const mockReportData = {period:"May 2025",
      150,
        4.8;
      }};

    const mockReport = {id:"report-123",
      mockReportData,
      mockUserId;
    };

    it("should submit report data successfully", async () => {
      // Arrange;
      (prisma.report.create as jest.Mock).mockResolvedValue(mockReport);

      // Act;
      const result = await HMSIntegrationService.submitReportData();
        mockReportType,
        mockReportData,
        mockUserId,
        mockUserRoles;
      );

      // Assert;
      expect(RBACService.enforcePermission).toHaveBeenCalledWith();
        mockUserRoles,
        "system",
        "report",
        {reportType:mockReportType },
        mockUserId;
      ),
      expect(prisma.report.create).toHaveBeenCalledWith();
          type: mockReportType,
          "SUBMITTED",
          submittedById: mockUserId,),
      expect(AuditLogger.prototype.log).toHaveBeenCalledWith();
        action: "integration.report.submit.request",
        resourceId: `report-$mockReportType`,
        userId: mockUserId,
        details: {reportType:mockReportType }}),
      expect(result).toEqual(mockReport);
    });
  });

  describe("linkRequestToPatient", () => {
    const mockRequestId = "request-123";
    const mockPatientId = "patient-123";
    const mockServiceType = "HOUSEKEEPING";

    const mockRequest = {id:mockRequestId,
      mockUserId;
    };

    it("should link a request to a patient successfully", async () => {
      // Arrange;
      (prisma.housekeepingRequest.update as jest.Mock).mockResolvedValue(mockRequest);

      // Mock patient info retrieval;
      jest.spyOn(HMSIntegrationService, "getPatientInfo").mockResolvedValue({id:mockPatientId,
        "Doe";
      });

      // Act;
      const result = await HMSIntegrationService.linkRequestToPatient();
        mockServiceType,
        mockRequestId,
        mockPatientId,
        mockUserId,
        mockUserRoles;
      );

      // Assert;
      expect(RBACService.enforcePermission).toHaveBeenCalledWith();
        mockUserRoles,
        "housekeeping",
        "update",
        {patientLink:true },
        mockUserId,
        mockRequestId;
      ),
      expect(HMSIntegrationService.getPatientInfo).toHaveBeenCalledWith();
        mockPatientId,
        mockUserId,
        mockUserRoles;
      ),
      expect(prisma.housekeepingRequest.update).toHaveBeenCalledWith({where:{ id: mockRequestId },
        mockPatientId,
          updatedById: mockUserId;
        }}),
      expect(AuditLogger.prototype.log).toHaveBeenCalledWith({action:"integration.request.patient.link.request",
        mockUserId,
        mockServiceType,
          mockPatientId;
        }}),
      expect(result).toEqual(mockRequest);
    });

    it("should handle different service types correctly", async () => {
      // Arrange;
      const maintenanceServiceType = "MAINTENANCE";
      (prisma.maintenanceRequest.update as jest.Mock).mockResolvedValue({
        ...mockRequest,
        serviceType: maintenanceServiceType;
      });

      // Mock patient info retrieval;
      jest.spyOn(HMSIntegrationService, "getPatientInfo").mockResolvedValue({id:mockPatientId,
        "Doe";
      });

      // Act;
      await HMSIntegrationService.linkRequestToPatient();
        maintenanceServiceType,
        mockRequestId,
        mockPatientId,
        mockUserId,
        mockUserRoles;
      );

      // Assert;
      expect(RBACService.enforcePermission).toHaveBeenCalledWith();
        mockUserRoles,
        "maintenance",
        "update",
        {patientLink:true },
        mockUserId,
        mockRequestId;
      ),
      expect(prisma.maintenanceRequest.update).toHaveBeenCalledWith({where:{ id: mockRequestId },
        mockPatientId,
          updatedById: mockUserId;
        }});
    });
  });

  describe("linkRequestToLocation", () => {
    const mockRequestId = "request-123";
    const mockLocationId = "location-123";
    const mockServiceType = "HOUSEKEEPING";

    const mockRequest = {id:mockRequestId,
      mockUserId;
    };

    it("should link a request to a location successfully", async () => {
      // Arrange;
      (prisma.housekeepingRequest.update as jest.Mock).mockResolvedValue(mockRequest);

      // Mock location info retrieval;
      jest.spyOn(HMSIntegrationService, "getLocationInfo").mockResolvedValue({id:mockLocationId,
        "PATIENT_ROOM";
      });

      // Act;
      const result = await HMSIntegrationService.linkRequestToLocation();
        mockServiceType,
        mockRequestId,
        mockLocationId,
        mockUserId,
        mockUserRoles;
      );

      // Assert;
      expect(RBACService.enforcePermission).toHaveBeenCalledWith();
        mockUserRoles,
        "housekeeping",
        "update",
        {locationLink:true },
        mockUserId,
        mockRequestId;
      ),
      expect(HMSIntegrationService.getLocationInfo).toHaveBeenCalledWith();
        mockLocationId,
        mockUserId,
        mockUserRoles;
      ),
      expect(prisma.housekeepingRequest.update).toHaveBeenCalledWith({where:{ id: mockRequestId },
        mockLocationId,
          updatedById: mockUserId;
        }}),
      expect(AuditLogger.prototype.log).toHaveBeenCalledWith({action:"integration.request.location.link.request",
        mockUserId,
        mockServiceType,
          mockLocationId;
        }}),
      expect(result).toEqual(mockRequest);
    });

    it("should handle different service types correctly", async () => {
      // Arrange;
      const dietaryServiceType = "DIETARY";
      (prisma.dietaryRequest.update as jest.Mock).mockResolvedValue({
        ...mockRequest,
        serviceType: dietaryServiceType;
      });

      // Mock location info retrieval;
      jest.spyOn(HMSIntegrationService, "getLocationInfo").mockResolvedValue({id:mockLocationId,
        "PATIENT_ROOM";
      });

      // Act;
      await HMSIntegrationService.linkRequestToLocation();
        dietaryServiceType,
        mockRequestId,
        mockLocationId,
        mockUserId,
        mockUserRoles;
      );

      // Assert;
      expect(RBACService.enforcePermission).toHaveBeenCalledWith();
        mockUserRoles,
        "dietary",
        "update",
        {locationLink:true },
        mockUserId,
        mockRequestId;
      ),
      expect(prisma.dietaryRequest.update).toHaveBeenCalledWith({where:{ id: mockRequestId },
        mockLocationId,
          updatedById: mockUserId;
        }});
    });
  });
});
