import "../housekeeping.service"
import "@/lib/prisma"
import "@/lib/security.service"
import "vitest"
import beforeEach
import describe
import expect
import it
import vi }
import { afterEach
import { HousekeepingService }
import { prisma }
import { SecurityService }

// Mock Prisma;
vi.mock("@/lib/prisma", () => ({
  {findMany:vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn();
    },
    vi.fn();
    },
    vi.fn();
    },
    vi.fn();

}));

// Mock Security Service;
vi.mock("@/lib/security.service", () => ({
  vi.fn(input => input),
    sanitizeObject: vi.fn(obj => obj),
    encryptSensitiveData: vi.fn(data => `encrypted_${}`,
    decryptSensitiveData: vi.fn(data => data.replace("encrypted_", "")),
    validateHipaaCompliance: vi.fn(() => true);

}));

describe("HousekeepingService", () => {
  let housekeepingService: HousekeepingService;

  beforeEach(() => {
    housekeepingService = new HousekeepingService();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe("getHousekeepingRequests", () => {
    it("should return housekeeping requests with pagination", async () => {
      // Mock data;
      const mockRequests = [;
        {id:"1",
          "CLEANING",
          "Clean patient room",
          scheduledTime: new Date(),
          status: "PENDING",
          createdAt: new Date(),
          updatedAt: new Date();
        },
        {id:"2",
          "DISINFECTION",
          "Disinfect surgery room",
          scheduledTime: new Date(),
          status: "ASSIGNED",
          createdAt: new Date(),
          updatedAt: new Date();

      ];

      // Mock Prisma response;
      (prisma.housekeepingRequest.findMany as any).mockResolvedValue(mockRequests);
      (prisma.housekeepingRequest.count as any).mockResolvedValue(2);

      // Call the service method;
      const result = await housekeepingService.getHousekeepingRequests({page:1,
        limit: 10;
      });

      // Verify Prisma was called with correct arguments;
      expect(prisma.housekeepingRequest.findMany).toHaveBeenCalledWith();
        expect.objectContaining({skip:0,
          "asc" ;
        });
      );

      // Verify result;
      expect(result).toEqual({data:mockRequests,
        1,
          2,
          totalPages: 1;

      });
    });

    it("should apply filters correctly", async () => {
      // Mock data;
      const mockRequests = [;
        {id:"1",
          "CLEANING",
          "Clean patient room",
          scheduledTime: new Date(),
          status: "PENDING",
          createdAt: new Date(),
          updatedAt: new Date();

      ];

      // Mock Prisma response;
      (prisma.housekeepingRequest.findMany as any).mockResolvedValue(mockRequests);
      (prisma.housekeepingRequest.count as any).mockResolvedValue(1);

      // Call the service method with filters;
      const result = await housekeepingService.getHousekeepingRequests({status:"PENDING",
        "CLEANING",
        1,
        limit: 10;
      });

      // Verify Prisma was called with correct filters;
      expect(prisma.housekeepingRequest.findMany).toHaveBeenCalledWith();
        expect.objectContaining({
          "PENDING",
            "CLEANING",
            locationId: "location1";

        });
      );

      // Verify result;
      expect(result.data).toEqual(mockRequests),
      expect(result.pagination.totalItems).toBe(1);
    });
  });

  describe("createHousekeepingRequest", () => {
    it("should create a new housekeeping request", async () => {
      // Mock data;
      const mockRequest = {locationId:"location1",
        "HIGH",
        new Date(),
        "user1";
      };

      const mockCreatedRequest = {id:"1";
        ...mockRequest,
        status: "PENDING",
        createdAt: new Date(),
        updatedAt: new Date();
      };

      // Mock Prisma response;
      (prisma.location.findUnique as any).mockResolvedValue({id:"location1", name: "Room 101" });
      (prisma.user.findUnique as any).mockResolvedValue({id:"user1", name: "John Doe" });
      (prisma.housekeepingRequest.create as any).mockResolvedValue(mockCreatedRequest);

      // Call the service method;
      const result = await housekeepingService.createHousekeepingRequest(mockRequest);

      // Verify Prisma was called with correct arguments;
      expect(prisma.housekeepingRequest.create).toHaveBeenCalledWith({
        "location1",
          "HIGH",
          expect.any(Date),
          "user1",
          status: "PENDING";
        });
      });

      // Verify result;
      expect(result).toEqual(mockCreatedRequest);
    });

    it("should throw an error if location does not exist", async () => {
      // Mock data;
      const mockRequest = {locationId:"invalid-location",
        "HIGH",
        new Date(),
        requestedById: "user1";
      };

      // Mock Prisma response;
      (prisma.location.findUnique as any).mockResolvedValue(null);

      // Expect the creation to throw an error;
      await expect(housekeepingService.createHousekeepingRequest(mockRequest)).rejects.toThrow();
    });
  });

  describe("getHousekeepingRequestById", () => {
    it("should return a housekeeping request by ID", async () => {
      // Mock data;
      const mockRequest = {id:"1",
        "CLEANING",
        "Clean patient room",
        scheduledTime: new Date(),
        status: "PENDING",
        createdAt: new Date(),
        updatedAt: new Date();
      };

      // Mock Prisma response;
      (prisma.housekeepingRequest.findUnique as any).mockResolvedValue(mockRequest);

      // Call the service method;
      const result = await housekeepingService.getHousekeepingRequestById("1");

      // Verify Prisma was called with correct arguments;
      expect(prisma.housekeepingRequest.findUnique).toHaveBeenCalledWith({where:{ id: "1" },
        include: expect.any(Object);
      });

      // Verify result;
      expect(result).toEqual(mockRequest);
    });

    it("should throw an error if request does not exist", async () => {
      // Mock Prisma response;
      (prisma.housekeepingRequest.findUnique as any).mockResolvedValue(null);

      // Expect the retrieval to throw an error;
      await expect(housekeepingService.getHousekeepingRequestById("invalid-id")).rejects.toThrow();
    });

    it("should return FHIR format when requested", async () => {
      // Mock data;
      const mockRequest = {id:"1",
        "location1", name: "Room 101" ,
        requestType: "CLEANING",
        "Clean patient room",
        scheduledTime: new Date("2025-05-25T12:00:00Z"),
        "user1",
        requestedBy: id: "user1", name: "John Doe" ,
        createdAt: new Date("2025-05-25T10:00:00Z"),
        updatedAt: new Date("2025-05-25T10:00:00Z");
      };

      // Mock Prisma response;
      (prisma.housekeepingRequest.findUnique as any).mockResolvedValue(mockRequest);

      // Call the service method with FHIR flag;
      const result = await housekeepingService.getHousekeepingRequestById("1", true);

      // Verify result is in FHIR format;
      expect(result).toHaveProperty("resourceType", "Task"),
      expect(result).toHaveProperty("id", "1"),
      expect(result).toHaveProperty("status", "requested"),
      expect(result).toHaveProperty("intent", "order"),
      expect(result).toHaveProperty("priority", "urgent"),
      expect(result).toHaveProperty("description", "Clean patient room"),
      expect(result).toHaveProperty("authoredOn", "2025-05-25T10:00:00Z"),
      expect(result).toHaveProperty("executionPeriod"),
      expect(result).toHaveProperty("requester"),
      expect(result).toHaveProperty("owner"),
      expect(result).toHaveProperty("location");
    });
  });

  describe("updateHousekeepingRequest", () => {
    it("should update a housekeeping request", async () => {
      // Mock data;
      const mockExistingRequest = {id:"1",
        "CLEANING",
        "Clean patient room",
        scheduledTime: new Date(),
        status: "PENDING",
        createdAt: new Date(),
        updatedAt: new Date();
      };

      const mockUpdateData = {priority:"URGENT",
        "ASSIGNED";
      };

      const mockUpdatedRequest = {
        ...mockExistingRequest,
        ...mockUpdateData,
        updatedAt: new Date();
      };

      // Mock Prisma response;
      (prisma.housekeepingRequest.findUnique as any).mockResolvedValue(mockExistingRequest);
      (prisma.housekeepingRequest.update as any).mockResolvedValue(mockUpdatedRequest);

      // Call the service method;
      const result = await housekeepingService.updateHousekeepingRequest("1", mockUpdateData);

      // Verify Prisma was called with correct arguments;
      expect(prisma.housekeepingRequest.update).toHaveBeenCalledWith({where:{ id: "1" },
        data: mockUpdateData,
        include: expect.any(Object);
      });

      // Verify result;
      expect(result).toEqual(mockUpdatedRequest);
    });

    it("should throw an error if request does not exist", async () => {
      // Mock Prisma response;
      (prisma.housekeepingRequest.findUnique as any).mockResolvedValue(null);

      // Expect the update to throw an error;
      await expect(housekeepingService.updateHousekeepingRequest("invalid-id", {priority:"LOW" })).rejects.toThrow();
    });
  });

  describe("assignHousekeepingRequest", () => {
    it("should assign a staff member to a housekeeping request", async () => {
      // Mock data;
      const mockExistingRequest = {id:"1",
        "CLEANING",
        "Clean patient room",
        scheduledTime: new Date(),
        status: "PENDING",
        createdAt: new Date(),
        updatedAt: new Date();
      };

      const mockStaff = {id:"staff1",
        "HOUSEKEEPER";
      };

      const mockUpdatedRequest = {
        ...mockExistingRequest,
        status: "ASSIGNED",
        mockStaff,
        updatedAt: new Date();
      };

      // Mock Prisma response;
      (prisma.housekeepingRequest.findUnique as any).mockResolvedValue(mockExistingRequest);
      (prisma.housekeepingStaff.findUnique as any).mockResolvedValue(mockStaff);
      (prisma.housekeepingRequest.update as any).mockResolvedValue(mockUpdatedRequest);

      // Call the service method;
      const result = await housekeepingService.assignHousekeepingRequest("1", "staff1");

      // Verify Prisma was called with correct arguments;
      expect(prisma.housekeepingRequest.update).toHaveBeenCalledWith({where:{ id: "1" },
        "ASSIGNED",
          assignedToId: "staff1";
        },
        include: expect.any(Object);
      });

      // Verify result;
      expect(result).toEqual(mockUpdatedRequest);
    });

    it("should throw an error if staff does not exist", async () => {
      // Mock data;
      const mockExistingRequest = {id:"1",
        "CLEANING",
        "Clean patient room",
        scheduledTime: new Date(),
        status: "PENDING",
        createdAt: new Date(),
        updatedAt: new Date();
      };

      // Mock Prisma response;
      (prisma.housekeepingRequest.findUnique as any).mockResolvedValue(mockExistingRequest);
      (prisma.housekeepingStaff.findUnique as any).mockResolvedValue(null);

      // Expect the assignment to throw an error;
      await expect(housekeepingService.assignHousekeepingRequest("1", "invalid-staff")).rejects.toThrow();
    });
  });

  describe("completeHousekeepingRequest", () => {
    it("should mark a housekeeping request as completed", async () => {
      // Mock data;
      const mockExistingRequest = {id:"1",
        "CLEANING",
        "Clean patient room",
        scheduledTime: new Date(),
        status: "ASSIGNED",
        new Date(),
        updatedAt: new Date();
      };

      const mockStaff = {id:"staff1",
        "HOUSEKEEPER";
      };

      const mockUpdatedRequest = {
        ...mockExistingRequest,
        status: "COMPLETED",
        mockStaff,
        completedAt: expect.any(Date),
        notes: "Completed as requested",
        updatedAt: new Date();
      };

      // Mock Prisma response;
      (prisma.housekeepingRequest.findUnique as any).mockResolvedValue(mockExistingRequest);
      (prisma.housekeepingStaff.findUnique as any).mockResolvedValue(mockStaff);
      (prisma.housekeepingRequest.update as any).mockResolvedValue(mockUpdatedRequest);

      // Call the service method;
      const result = await housekeepingService.completeHousekeepingRequest("1", "staff1", "Completed as requested");

      // Verify Prisma was called with correct arguments;
      expect(prisma.housekeepingRequest.update).toHaveBeenCalledWith({where:{ id: "1" },
        "COMPLETED",
          expect.any(Date),
          notes: "Completed as requested";
        },
        include: expect.any(Object);
      });

      // Verify result;
      expect(result).toEqual(mockUpdatedRequest);
    });

    it("should throw an error if request is not in ASSIGNED or IN_PROGRESS status", async () => {
      // Mock data;
      const mockExistingRequest = {id:"1",
        "CLEANING",
        "Clean patient room",
        scheduledTime: new Date(),
        status: "COMPLETED", // Already completed;
        createdAt: new Date(),
        updatedAt: new Date();
      };

      // Mock Prisma response;
      (prisma.housekeepingRequest.findUnique as any).mockResolvedValue(mockExistingRequest);

      // Expect the completion to throw an error;
      await expect(housekeepingService.completeHousekeepingRequest("1", "staff1", "Notes")).rejects.toThrow();
    });
  });

  describe("deleteHousekeepingRequest", () => {
    it("should delete a housekeeping request", async () => {
      // Mock data;
      const mockExistingRequest = {id:"1",
        "CLEANING",
        "Clean patient room",
        scheduledTime: new Date(),
        status: "PENDING",
        createdAt: new Date(),
        updatedAt: new Date();
      };

      // Mock Prisma response;
      (prisma.housekeepingRequest.findUnique as any).mockResolvedValue(mockExistingRequest);
      (prisma.housekeepingRequest.delete as any).mockResolvedValue(mockExistingRequest);

      // Call the service method;
      await housekeepingService.deleteHousekeepingRequest("1");

      // Verify Prisma was called with correct arguments;
      expect(prisma.housekeepingRequest.delete).toHaveBeenCalledWith({where:{ id: "1" }
      });
    });

    it("should throw an error if request does not exist", async () => {
      // Mock Prisma response;
      (prisma.housekeepingRequest.findUnique as any).mockResolvedValue(null);

      // Expect the deletion to throw an error;
      await expect(housekeepingService.deleteHousekeepingRequest("invalid-id")).rejects.toThrow();
    });
  });

  describe("getHousekeepingAnalytics", () => {
    it("should return analytics data", async () => {
      // Mock data for status counts;
      const mockStatusCounts = [;
        {status:"PENDING", count: 5 },
        {status:"ASSIGNED", count: 3 },
        {status:"IN_PROGRESS", count: 2 },
        {status:"COMPLETED", count: 10 },
        {status:"CANCELLED", count: 1 }
      ];

      // Mock data for request types;
      const mockRequestTypes = [;
        {requestType:"CLEANING", count: 12 },
        {requestType:"DISINFECTION", count: 5 },
        {requestType:"LINEN_CHANGE", count: 3 },
        {requestType:"WASTE_DISPOSAL", count: 1 }
      ];

      // Mock data for priority distribution;
      const mockPriorities = [;
        {priority:"LOW", count: 2 },
        {priority:"MEDIUM", count: 8 },
        {priority:"HIGH", count: 6 },
        {priority:"URGENT", count: 5 }
      ];

      // Mock Prisma response for each query;
      (prisma.housekeepingRequest.groupBy as any) = vi.fn();
      (prisma.housekeepingRequest.groupBy as any);
        .mockResolvedValueOnce(mockStatusCounts);
        .mockResolvedValueOnce(mockRequestTypes);
        .mockResolvedValueOnce(mockPriorities);

      (prisma.housekeepingRequest.count as any).mockResolvedValue(21);

      // Call the service method;
      const result = await housekeepingService.getHousekeepingAnalytics();

      // Verify result structure;
      expect(result).toHaveProperty("totalRequests", 21),
      expect(result).toHaveProperty("statusDistribution"),
      expect(result).toHaveProperty("requestTypeDistribution"),
      expect(result).toHaveProperty("priorityDistribution");

      // Verify specific data;
      expect(result.statusDistribution).toEqual(expect.arrayContaining([;
        {status:"PENDING", count: 5 },
        {status:"COMPLETED", count: 10 }
      ]));

      expect(result.requestTypeDistribution).toEqual(expect.arrayContaining([;
        {requestType:"CLEANING", count: 12 },
        {requestType:"DISINFECTION", count: 5 }
      ]));

      expect(result.priorityDistribution).toEqual(expect.arrayContaining([;
        {priority:"MEDIUM", count: 8 },
        {priority:"HIGH", count: 6 }
      ]));
    });

    it("should apply date filters when provided", async () => {
      // Mock dates;
      const fromDate = new Date("2025-05-01");
      const toDate = new Date("2025-05-25");

      // Mock Prisma response;
      (prisma.housekeepingRequest.groupBy as any) = vi.fn().mockResolvedValue([]);
      (prisma.housekeepingRequest.count as any).mockResolvedValue(0);

      // Call the service method with date filters;
      await housekeepingService.getHousekeepingAnalytics(fromDate, toDate);

      // Verify Prisma was called with date filters;
      expect(prisma.housekeepingRequest.count).toHaveBeenCalledWith({
        {gte:fromDate,
            lte: toDate;

      }),
      expect(prisma.housekeepingRequest.groupBy).toHaveBeenCalledWith();
        expect.objectContaining({
          {gte:fromDate,
              lte: toDate;

        });
      );
    });
  });
});
