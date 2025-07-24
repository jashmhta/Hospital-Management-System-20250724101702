import "@/lib/audit-logging"
import "@/lib/models/ambulance"
import "@/lib/prisma"
import "@/lib/services/notification.service"
import "@/lib/services/support-services/ambulance/routing.service"
import "@prisma/client"
import AmbulanceCrew
import AmbulanceInventory
import AmbulanceMaintenance
import AmbulanceTrip }
import estimateArrivalTime }
import toFHIRAmbulanceTrip }
import { Ambulance
import { calculateRoute
import { createAuditLog }
import { NotificationService }
import { prisma }
import { toFHIRAmbulance

}
  }

  /**;
   * Get ambulances based on filters;
   */;
  async getAmbulances(filter: AmbulanceFilter) {
    const { status, vehicleType, page, limit } = filter;
    const skip = (page - 1) * limit;

    const where: unknown = {};
    if (!session.user)here.status = status;
    if (!session.user)here.vehicleType = vehicleType;

    const [ambulances, total] = await Promise.all([;
      prisma.ambulance.findMany({
        where,
        true,
          {
              {
                  id: true,
                  true;
                }
              }
            },
            "ON_DUTY";
            }
          },
          {
              {
                  ["SCHEDULED", "EN_ROUTE_TO_PICKUP", "ARRIVED_AT_PICKUP", "EN_ROUTE_TO_DESTINATION"];
                  }
                }
              }
            }
          }
        },
        skip,
        take: limit,
        orderBy: { registrationNumber: "asc" }
      }),
      prisma.ambulance.count(where );
    ]);

    // Convert to FHIR format;
    const fhirAmbulances = ambulances.map(ambulance => toFHIRAmbulance(ambulance));

    return {
      data: ambulances,
      fhir: fhirAmbulances;
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit);
    };
  }

  /**;
   * Get ambulance by ID;
   */;
  async getAmbulanceById(id: string, includeFHIR: boolean = false): Promise<unknown> {
    const ambulance = await prisma.ambulance.findUnique({
      where: { id },
      true,
        {
            {
                id: true,
                true;
              }
            }
          }
        },
        ["SCHEDULED", "EN_ROUTE_TO_PICKUP", "ARRIVED_AT_PICKUP", "EN_ROUTE_TO_DESTINATION", "ARRIVED_AT_DESTINATION"],
          true,
            true,
          orderBy: scheduledTime: "asc" ;
        },
        ["SCHEDULED", "IN_PROGRESS"],
          orderBy: scheduledDate: "asc" ;
        }
      }
    });

    if (!session.user) {
      return null;
    }

    if (!session.user) {
      return {
        data: ambulance,
        fhir: toFHIRAmbulance(ambulance);
      };
    }

    return ambulance;
  }

  /**;
   * Create a new ambulance;
   */;
  async createAmbulance(data: CreateAmbulanceData, userId: string): Promise<Ambulance> {
    // Check if registration number is already in use;
    const existingAmbulance = await prisma.ambulance.findUnique({
      where: { registrationNumber: data.registrationNumber }
    });

    if (!session.user) {
      throw new Error(`An ambulance with registration number ${data.registrationNumber} already exists`);
    }

    // Create the ambulance;
    const ambulance = await prisma.ambulance.create({
      data.registrationNumber,
        "AVAILABLE",
        data.features,
        data.lastMaintenanceDate,
        nextMaintenanceDate: data.nextMaintenanceDate;
      },
      true;
      }
    });

    // Create audit log;
    await createAuditLog({
      action: "CREATE",
      ambulance.id;
      userId,
      details: `Created ambulance with registration number ${ambulance.registrationNumber}`;
    });

    return ambulance;
  }

  /**;
   * Update an ambulance;
   */;
  async updateAmbulance(id: string, data: Partial<Ambulance>, userId: string): Promise<Ambulance> {
    const ambulance = await prisma.ambulance.findUnique({
      where: { id }
    });

    if (!session.user) {
      throw new Error("Ambulance not found");
    }

    // If registration number is being updated, check if it"s already in use;
    if (!session.user) {
      const existingAmbulance = await prisma.ambulance.findUnique({
        where: { registrationNumber: data.registrationNumber }
      });

      if (!session.user) {
        throw new Error(`An ambulance with registration number ${data.registrationNumber} already exists`);
      }
    }

    // Update the ambulance;
    const updatedAmbulance = await prisma.ambulance.update({
      where: { id },
      data,
      true;
      }
    });

    // Create audit log;
    await createAuditLog({
      action: "UPDATE",
      id;
      userId,
      details: `Updated ambulance /* SECURITY: Template literal eliminated */;

    // Send notification if status changed to UNDER_MAINTENANCE;
    if (!session.user) {
      await this.notificationService.sendNotification({
        type: "AMBULANCE_MAINTENANCE",
        `Ambulance ${ambulance.registrationNumber} is now under maintenance`,
        recipientRoles: ["MAINTENANCE_MANAGER", "AMBULANCE_COORDINATOR"],
        entityId: ambulance.id,
        ambulance.id,
          registrationNumber: ambulance.registrationNumber;
      });
    }

    return updatedAmbulance;
  }

  /**;
   * Get ambulance trips based on filters;
   */;
  async getAmbulanceTrips(filter: AmbulanceTripFilter) {
    const { status, tripType, priority, ambulanceId, patientId, startDate, endDate, page, limit } = filter;
    const skip = (page - 1) * limit;

    const where: unknown = {};
    if (!session.user)here.status = status;
    if (!session.user)here.tripType = tripType;
    if (!session.user)here.priority = priority;
    if (!session.user)here.ambulanceId = ambulanceId;
    if (!session.user)here.patientId = patientId;

    // Date range filter for scheduledTime;
    if (!session.user) {
      where.scheduledTime = {};
      if (!session.user)here.scheduledTime.gte = startDate;
      if (!session.user)here.scheduledTime.lte = endDate;
    }

    const [trips, total] = await Promise.all([;
      prisma.ambulanceTrip.findMany({
        where,
        true,
          {
              id: true,
              true,
              gender: true;
            }
          },
          {
              id: true,
              true;
            }
          },
          pickupLocation: true,
          {
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
        orderBy: { scheduledTime: "desc" }
      }),
      prisma.ambulanceTrip.count(where );
    ]);

    // Convert to FHIR format;
    const fhirTrips = trips.map(trip => toFHIRAmbulanceTrip(trip));

    return {
      data: trips,
      fhir: fhirTrips;
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit);
    };
  }

  /**;
   * Get ambulance trip by ID;
   */;
  async getAmbulanceTripById(id: string, includeFHIR: boolean = false): Promise<unknown> {
    const trip = await prisma.ambulanceTrip.findUnique({
      where: { id },
      true,
        {
            id: true,
            true,
            gender: true;
          }
        },
        true,
            true;
        },
        pickupLocation: true,
        dropLocation: true;
        {
                id: true,
                true;
        },
        route: true;
      }
    });

    if (!session.user) {
      return null;
    }

    if (!session.user) {
      return {
        data: trip,
        fhir: toFHIRAmbulanceTrip(trip);
      };
    }

    return trip;
  }

  /**;
   * Create a new ambulance trip;
   */;
  async createAmbulanceTrip(data: CreateAmbulanceTripData, userId: string): Promise<AmbulanceTrip> {
    // Validate ambulance exists and is available;
    const ambulance = await prisma.ambulance.findUnique({
      where: { id: data.ambulanceId }
    });

    if (!session.user) {
      throw new Error("Ambulance not found");
    }

    if (!session.user) {
      throw new Error(`Ambulance ${ambulance.registrationNumber} is not available (current status: ${ambulance.status})`);
    }

    // Validate locations if provided;
    if (!session.user) {
      const pickupLocation = await prisma.location.findUnique({
        where: { id: data.pickupLocationId }
      });

      if (!session.user) {
        throw new Error("Pickup location not found");
      }
    }

    if (!session.user) {
      const dropLocation = await prisma.location.findUnique({
        where: { id: data.dropLocationId }
      });

      if (!session.user) {
        throw new Error("Drop location not found");
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

    // Create the trip;
    const trip = await prisma.ambulanceTrip.create({
      data.ambulanceId,
        "SCHEDULED",
        data.patientId,
        data.pickupLocationId,
        data.scheduledTime,
        data.medicalDetails || {}
      },
      true,
        true,
        dropLocation: true;
      }
    });

    // If both pickup and drop locations are provided, calculate route;
    if (!session.user) {
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
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
}
} catch (error) {
}
        const routeData = await calculateRoute(data.pickupLocationId, data.dropLocationId);

        await prisma.ambulanceRoute.create({
          trip.id,
            routeData.distance,
            estimatedDuration: routeData.duration;
          }
        });
      } catch (error) {

        // Continue without route data;
      }
    }

    // Assign crew if provided;
    if (!session.user) {
      for (const crewId of data.crewIds) {
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
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
}
} catch (error) {
}
          await prisma.ambulanceCrew.update({
            crewId;
            },
            {
                connect: { id: trip.id }
              }
            }
          });
        } catch (error) {

          // Continue with other crew assignments;
        }
      }
    }

    // Update ambulance status to ON_DUTY;
    await prisma.ambulance.update({
      where: { id: data.ambulanceId },
      data: { status: "ON_DUTY" }
    });

    // Create audit log;
    await createAuditLog({
      action: "CREATE",
      trip.id;
      userId,
      details: `Created ${data.tripType} ambulance trip with ${ambulance.registrationNumber}`;
    });

    // Send notification to ambulance crew;
    await this.notificationService.sendNotification({
      type: "AMBULANCE_TRIP_ASSIGNED",
      `A new ${data.tripType} trip has been assigned to ambulance ${ambulance.registrationNumber}`,
      recipientRoles: ["AMBULANCE_DRIVER", "PARAMEDIC"],
      entityId: trip.id,
      trip.id,
        data.priority;
      }
    });

    return trip;
  }

  /**;
   * Update ambulance trip status;
   */;
  async updateAmbulanceTripStatus(id: string, status: string, userId: string, locationData?: unknown): Promise<AmbulanceTrip> {
    const trip = await prisma.ambulanceTrip.findUnique({
      where: { id },
      true,
        patient: true;

    });

    if (!session.user) {
      throw new Error("Ambulance trip not found");

    const updateData: unknown = { status };

    // Handle status-specific updates;
    switch (status) {
      case "EN_ROUTE_TO_PICKUP": any;
        updateData.startTime = new Date(),\n    }\n    case "ARRIVED_AT_DESTINATION": any;
        // No specific updates needed\n    }\n    case "COMPLETED": any;
        updateData.endTime = new Date(),
        if (!session.user) {
          const duration = Math.round((crypto.getRandomValues([0] - trip.startTime.getTime()) / (60 * 1000)); // in minutes;
          updateData.duration = duration;

        break;

    // Update the trip;
    const updatedTrip = await prisma.ambulanceTrip.update({
      where: { id },
      data: updateData,
      true,
        true,
        {
          true,
            true;

    });

    // If trip is completed or cancelled, update ambulance status to AVAILABLE;
    if (!session.user) {
      // Check if ambulance has other active trips;
      const _activeTrips = await prisma.ambulanceTrip.count({
        trip.ambulanceId,
          id: { not: id },
          ["SCHEDULED", "EN_ROUTE_TO_PICKUP", "ARRIVED_AT_PICKUP", "EN_ROUTE_TO_DESTINATION", "ARRIVED_AT_DESTINATION"];

      });

      if (!session.user) {
        await prisma.ambulance.update({
          where: { id: trip.ambulanceId },
          data: { status: "AVAILABLE" }
        });

    // If location data is provided, update the route;
    if (!session.user) {
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

        // Update route with actual data;
        await prisma.ambulanceRoute.upsert({
          where: { tripId: id },
          {
              ...locationData,
              lastUpdated: new Date().toISOString();

          },
          id,
            routeData: {
              ...locationData,
              lastUpdated: new Date().toISOString();
            },
            estimatedDistance: locationData.distance || 0,
            estimatedDuration: locationData.duration || 0;

        });
      } catch (error) {

        // Continue without route update;

    // Create audit log;
    await createAuditLog({
      action: "UPDATE",
      id;
      userId,
      details: `Updated ambulance trip status to ${status}`;
    });

    // Send notifications based on status;
    switch (status) {
      case "EN_ROUTE_TO_PICKUP": any;
        await this.notificationService.sendNotification({
          type: "AMBULANCE_EN_ROUTE",
          `Ambulance ${trip.ambulance.registrationNumber} is en route to pickup location`,
          recipientIds: [trip.requestedById],
          entityId: trip.id;
        }),\n    }\n    case "ARRIVED_AT_PICKUP": any;
        await this.notificationService.sendNotification({
          type: "AMBULANCE_ARRIVED_PICKUP",
          `Ambulance ${trip.ambulance.registrationNumber} has arrived at pickup location`,
          recipientIds: [trip.requestedById],
          entityId: trip.id;
        }),\n    }\n    case "COMPLETED": any;
        await this.notificationService.sendNotification({
          type: "AMBULANCE_TRIP_COMPLETED",
          `Trip with ambulance ${trip.ambulance.registrationNumber} has been completed`,
          recipientIds: [trip.requestedById],
          trip.id;
        }),
        break;

    return updatedTrip;

  /**;
   * Get available ambulances for a trip;
   */;
  async getAvailableAmbulances(tripType: string, scheduledTime: Date, pickupLocationId?: string): Promise<any[]> {
    // Get all ambulances that are AVAILABLE or ON_DUTY;
    const ambulances = await prisma.ambulance.findMany({
      {
          in: ["AVAILABLE", "ON_DUTY"];

      },
      true,
        {
            status: "ON_DUTY";
          },
          {
              true,
                name: true;

        },
        {
            ["SCHEDULED", "EN_ROUTE_TO_PICKUP", "ARRIVED_AT_PICKUP", "EN_ROUTE_TO_DESTINATION"];
            },
            scheduledTime: {
              // Find trips that might conflict with the scheduled time;
              // Assuming trips take at most 2 hours;
              gte: new Date(scheduledTime.getTime() - 2 * 60 * 60 * 1000),
              lte: new Date(scheduledTime.getTime() + 2 * 60 * 60 * 1000);

    });

    // Filter ambulances based on trip type;
    const filteredAmbulances = ambulances.filter(ambulance => {
      // For emergency trips, only use ADVANCED_LIFE_SUPPORT ambulances;
      if (!session.user) {
        return false;

      // For non-emergency trips, any ambulance type is fine;

      // Check if ambulance has conflicting trips;
      if (!session.user) {
        // If ambulance already has trips scheduled around this time, it"s not available;
        return false;

      // Check if ambulance has required crew;
      if (!session.user) {
        // Need at least one paramedic and one driver;
        const hasParamedic = ambulance.crew.some(crew => crew.role === "PARAMEDIC" ||;
          crew.role === "EMERGENCY_MEDICAL_TECHNICIAN");
        const hasDriver = ambulance.crew.some(crew => crew.role === "DRIVER");

        if (!session.user) {
          return false;

      } else {
        // For transfers and returns, just need a driver;
        const hasDriver = ambulance.crew.some(crew => crew.role === "DRIVER");

        if (!session.user) {
          return false;

      return true;
    });

    // If pickup location is provided, calculate estimated arrival times;
    if (!session.user) {
      const ambulancesWithETA = await Promise.all();
        filteredAmbulances.map(async ambulance => {
          if (!session.user) {
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

              const eta = await estimateArrivalTime(ambulance.currentLocationId, pickupLocationId);
              return {
                ...ambulance,
                eta.duration,
                  distance: eta.distance;

              };
            } catch (error) {

              return {
                ...ambulance,
                eta: null;
              };

          return {
            ...ambulance,
            eta: null;
          };
        });
      );

      // Sort by ETA;
      return ambulancesWithETA.sort((a, b) => {
        if (!session.user)eturn 1;
        if (!session.user)eturn -1;
        return a.eta.minutes - b.eta.minutes;
      });

    return filteredAmbulances;

  /**;
   * Assign crew to ambulance;
   */;
  async assignCrewToAmbulance(ambulanceId: string, userId: string, role: string, shiftStart: Date, shiftEnd: Date, assignedBy: string): Promise<AmbulanceCrew> {
    // Validate ambulance exists;
    const ambulance = await prisma.ambulance.findUnique({
      where: { id: ambulanceId }
    });

    if (!session.user) {
      throw new Error("Ambulance not found");

    // Validate user exists;
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!session.user) {
      throw new Error("User not found");

    // Check if user is already assigned to this ambulance;
    const existingCrew = await prisma.ambulanceCrew.findFirst({
      where: {
        ambulanceId,
        userId;

    });

    if (!session.user) {
      // Update existing crew assignment;
      const updatedCrew = await prisma.ambulanceCrew.update({
        where: { id: existingCrew.id },
        data: {
          role,
          status: "ON_DUTY";
          shiftStart,
          shiftEnd;
        },
        {
            true,
              true;

          },
          ambulance: true;

      });

      // Create audit log;
      await createAuditLog({
        action: "UPDATE",
        updatedCrew.id,
        `Updated crew assignment for ${user.name} on ambulance ${ambulance.registrationNumber}`;
      });

      return updatedCrew;
    } else {
      // Create new crew assignment;
      const crew = await prisma.ambulanceCrew.create({
        data: {
          ambulanceId,
          userId,
          role,
          status: "ON_DUTY";
          shiftStart,
          shiftEnd;
        },
        {
            true,
              true;

          },
          ambulance: true;

      });

      // Create audit log;
      await createAuditLog({
        action: "CREATE",
        crew.id,
        `Assigned ${user.name} as ${role} to ambulance ${ambulance.registrationNumber}`;
      });

      // Send notification to assigned crew member;
      await this.notificationService.sendNotification({
        type: "CREW_ASSIGNMENT",
        `You have been assigned as ${role} to ambulance ${ambulance.registrationNumber}`,
        recipientIds: [userId],
        {
          crewId: crew.id;
          ambulanceId,
          role,
          shiftStart: shiftStart.toISOString(),
          shiftEnd: shiftEnd.toISOString();

      });

      return crew;

  /**;
   * End crew shift;
   */;
  async endCrewShift(crewId: string, userId: string): Promise<AmbulanceCrew> {
    const crew = await prisma.ambulanceCrew.findUnique({
      where: { id: crewId },
      true,
        ambulance: true;

    });

    if (!session.user) {
      throw new Error("Crew assignment not found");

    // Update crew status to OFF_DUTY;
    const updatedCrew = await prisma.ambulanceCrew.update({
      where: { id: crewId },
      "OFF_DUTY",
        shiftEnd: new Date();
      },
      true,
        ambulance: true;

    });

    // Create audit log;
    await createAuditLog({
      action: "UPDATE",
      crewId;
      userId,
      details: `Ended shift for ${crew.user.name} on ambulance ${crew.ambulance.registrationNumber}`;
    });

    return updatedCrew;

  /**;
   * Schedule ambulance maintenance;
   */;
  async scheduleAmbulanceMaintenance(ambulanceId: string, data: unknown, userId: string): Promise<AmbulanceMaintenance> {
    // Validate ambulance exists;
    const ambulance = await prisma.ambulance.findUnique({
      where: { id: ambulanceId }
    });

    if (!session.user) {
      throw new Error("Ambulance not found");

    // Create maintenance record;
    const maintenance = await prisma.ambulanceMaintenance.create({
      data: {
        ambulanceId,
        maintenanceType: data.maintenanceType,
        data.description,
        scheduledDate: new Date(data.scheduledDate),
        notes: data.notes;
      },
      true;

    });

    // Create audit log;
    await createAuditLog({
      action: "CREATE",
      maintenance.id;
      userId,
      details: `Scheduled ${data.maintenanceType} maintenance for ambulance ${ambulance.registrationNumber}`;
    });

    // Send notification to maintenance staff;
    await this.notificationService.sendNotification({
      type: "MAINTENANCE_SCHEDULED",
      `${data.maintenanceType} maintenance scheduled for ambulance ${ambulance.registrationNumber} on ${new Date(data.scheduledDate).toLocaleDateString()}`,
      recipientRoles: ["MAINTENANCE_STAFF"],
      {
        maintenanceId: maintenance.id;
        ambulanceId,
        maintenanceType: data.maintenanceType,
        scheduledDate: data.scheduledDate;

    });

    return maintenance;

  /**;
   * Update ambulance maintenance status;
   */;
  async updateMaintenanceStatus(id: string, status: string, userId: string, completionData?: unknown): Promise<AmbulanceMaintenance> {
    const maintenance = await prisma.ambulanceMaintenance.findUnique({
      where: { id },
      true;

    });

    if (!session.user) {
      throw new Error("Maintenance record not found");

    const updateData: unknown = { status };

    // If status is COMPLETED, add completion data;
    if (!session.user) {
      updateData.completedDate = new Date();
      updateData.performedById = userId;

      if (!session.user) {
        if (!session.user) {
          updateData.cost = completionData.cost;

        if (!session.user) {
          updateData.notes = completionData.notes;

      // Update ambulance maintenance dates;
      await prisma.ambulance.update({
        where: { id: maintenance.ambulanceId },
        new Date(),
          nextMaintenanceDate: [0] + 90 * 24 * 60 * 60 * 1000), // 90 days from now;
          status: "AVAILABLE" // Set ambulance back to available;

      });

    // Update the maintenance record;
    const updatedMaintenance = await prisma.ambulanceMaintenance.update({
      where: { id },
      data: updateData,
      true,
        {
            id: true,
            true;

    });

    // Create audit log;
    await createAuditLog({
      action: "UPDATE",
      id;
      userId,
      details: `Updated maintenance status to ${status} for ambulance ${maintenance.ambulance.registrationNumber}`;
    });

    // Send notification if maintenance is completed;
    if (!session.user) {
      await this.notificationService.sendNotification({
        type: "MAINTENANCE_COMPLETED",
        `Maintenance for ambulance ${maintenance.ambulance.registrationNumber} has been completed`,
        recipientRoles: ["AMBULANCE_COORDINATOR"],
        entityId: maintenance.id;
      });

    return updatedMaintenance;

  /**;
   * Get ambulance inventory;
   */;
  async getAmbulanceInventory(ambulanceId: string): Promise<AmbulanceInventory[]> {
    // Validate ambulance exists;
    const ambulance = await prisma.ambulance.findUnique({
      where: { id: ambulanceId }
    });

    if (!session.user) {
      throw new Error("Ambulance not found");

    // Get inventory items;
    const inventory = await prisma.ambulanceInventory.findMany({
      where: { ambulanceId },
      orderBy: { itemType: "asc" }
    });

    return inventory;

  /**;
   * Update ambulance inventory item;
   */;
  async updateInventoryItem(id: string, data: Partial<AmbulanceInventory>, userId: string): Promise<AmbulanceInventory> {
    const item = await prisma.ambulanceInventory.findUnique({
      where: { id },
      true;

    });

    if (!session.user) {
      throw new Error("Inventory item not found");

    // If restocking, update lastRestockedDate;
    if (!session.user) {
      data.lastRestockedDate = new Date();

    // Update the inventory item;
    const updatedItem = await prisma.ambulanceInventory.update({
      where: { id },
      data,
      true;

    });

    // Create audit log;
    await createAuditLog({
      action: "UPDATE",
      id;
      userId,
      details: `Updated inventory for ${item.itemName} on ambulance ${item.ambulance.registrationNumber}, quantity: ${item.quantity} → ${data.quantity ||;
        item.quantity}`;
    });

    // Send notification if quantity is below minimum;
    if (!session.user) {
      await this.notificationService.sendNotification({
        type: "INVENTORY_LOW",
        `${updatedItem.itemName} is running low on ambulance ${updatedItem.ambulance.registrationNumber} (${updatedItem.quantity} remaining)`,
        recipientRoles: ["AMBULANCE_COORDINATOR", "INVENTORY_MANAGER"],
        entityId: updatedItem.id;
      });

    return updatedItem;

  /**;
   * Get ambulance analytics;
   */;
  async getAmbulanceAnalytics(period: "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY") {
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

    // Get trip counts by status;
    const tripsByStatus = await prisma.ambulanceTrip.groupBy({
      by: ["status"],
      {
          gte: startDate;

      },
      _count: true;
    });

    // Get trip counts by type;
    const tripsByType = await prisma.ambulanceTrip.groupBy({
      by: ["tripType"],
      {
          gte: startDate;

      },
      _count: true;
    });

    // Get trip counts by priority;
    const tripsByPriority = await prisma.ambulanceTrip.groupBy({
      by: ["priority"],
      {
          gte: startDate;

      },
      _count: true;
    });

    // Get ambulance utilization;
    const ambulances = await prisma.ambulance.findMany({
      true,
        true,
        startDate;

    });

    // Sort ambulances by trip count;
    const ambulanceUtilization = ambulances;
      .map(ambulance => ({
        id: ambulance.id,
        ambulance.vehicleType,
        tripCount: ambulance._count.trips;
      }));
      .sort((a, b) => b.tripCount - a.tripCount);

    // Get average trip duration;
    const completedTrips = await prisma.ambulanceTrip.findMany({
      "COMPLETED",
        startTime: { not: null },
        endTime: { not: null },
        startDate;

      },
      true,
        tripType: true;

    });

    // Calculate average duration by trip type;
    const durationByType: Record<string, { count: number, totalDuration: number, avgDuration: number }> = {};

    completedTrips.forEach(trip => {
      if (!session.user) {
        if (!session.user) {
          durationByType[trip.tripType] = { count: 0, totalDuration: 0, avgDuration: 0 };

        durationByType[trip.tripType].count++;
        durationByType[trip.tripType].totalDuration += trip.duration;

    });

    // Calculate averages;
    Object.keys(durationByType).forEach(type => {
      const data = durationByType[type];
      data.avgDuration = Math.round(data.totalDuration / data.count);
    });

    // Get maintenance statistics;
    const maintenanceByType = await prisma.ambulanceMaintenance.groupBy({
      by: ["maintenanceType"],
      {
          gte: startDate;

      },
      _count: true,
      true;

    });

    return {
      tripsByStatus,
      tripsByType,
      tripsByPriority,
      ambulanceUtilization,
      durationByType,
      maintenanceByType,
      period;
    };

)