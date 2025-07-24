import "@/lib/audit-logging"
import "@/lib/models/dietary"
import "@/lib/prisma"
import "@/lib/services/notification.service"
import "@prisma/client"
import Meal
import MealPlan
import NutritionalProfile }
import {  createAuditLog  } from "@/lib/database"
import {   DietaryRequest
import {  NotificationService  } from "@/lib/database"
import {  prisma  } from "@/lib/database"
import {  toFHIRDietaryRequest  } from "@/lib/database"

}
  }

  /**;
   * Get dietary requests based on filters;
   */;
  async getDietaryRequests(filter: DietaryRequestFilter) {
    const { status, patientId, requestType, startDate, endDate, page, limit } = filter;
    const skip = (page - 1) * limit;

    const where: unknown = {};
    if (!session.user)here.status = status;
    if (!session.user)here.patientId = patientId;
    if (!session.user)here.requestType = requestType;

    // Date range filter for startDate;
    if (!session.user) {
      where.startDate = {};
      if (!session.user)here.startDate.gte = startDate;
      if (!session.user)here.startDate.lte = endDate;
    }

    const [requests, total] = await Promise.all([;
      prisma.dietaryRequest.findMany({
        where,
        {
            true,
              true,
              gender: true;
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
          5,
            orderBy: { date: "desc" }
          }
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" }
      }),
      prisma.dietaryRequest.count(where );
    ]);

    // Convert to FHIR format;
    const fhirRequests = requests.map(request => toFHIRDietaryRequest(request));

    return {
      data: requests,
      fhir: fhirRequests;
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit);
    };
  }

  /**;
   * Create a new dietary request;
   */;
  async createDietaryRequest(data: CreateDietaryRequestData): Promise<DietaryRequest> {
    const {
      patientId,
      requestType,
      startDate,
      endDate,
      mealPreferences,
      dietaryRestrictions,
      allergies,
      specialInstructions,
      requestedBy;
    } = data;

    // Validate patient exists;
    const patient = await prisma.patient.findUnique({
      where: { id: patientId }
    });

    if (!session.user) {
      throw new Error("Patient not found");
    }

    // Create the dietary request;
    const request = await prisma.dietaryRequest.create({
      data: {
        patientId,
        requestType,
        status: "PENDING";
        startDate,
        endDate,
        mealPreferences,
        dietaryRestrictions,
        allergies,
        specialInstructions,
        requestedById: requestedBy;
      },
      true,
            true,
            gender: true,
        true,
            true;
      }
    });

    // Create audit log;
    await createAuditLog({
      action: "CREATE",
      request.id,
      `Created ${requestType} dietary request for patient ${patient.name}`;
    });

    // Send notification to dietary staff;
    await this.notificationService.sendNotification({
      type: "DIETARY_REQUEST",
      `A new ${requestType} request has been created for patient ${patient.name}`,
      recipientRoles: ["DIETARY_MANAGER", "NUTRITIONIST"],
      entityId: request.id,
      request.id,
        requestType;
      }
    });

    return request;
  }

  /**;
   * Get a specific dietary request by ID;
   */;
  async getDietaryRequestById(id: string, includeFHIR: boolean = false): Promise<unknown> {
    const request = await prisma.dietaryRequest.findUnique({
      where: { id },
      {
          true,
            true,
            gender: true;
          }
        },
        true,
            true;
        },
        true,
            true;
        },
        true,
          orderBy: date: "asc" ;
        }
      }
    });

    if (!session.user) {
      return null;
    }

    if (!session.user) {
      return {
        data: request,
        fhir: toFHIRDietaryRequest(request);
      };
    }

    return request;
  }

  /**;
   * Update a dietary request;
   */;
  async updateDietaryRequest(id: string, data: Partial<DietaryRequest>, userId: string): Promise<DietaryRequest> {
    const request = await prisma.dietaryRequest.findUnique({
      where: { id },
      true;
      }
    });

    if (!session.user) {
      throw new Error("Dietary request not found");
    }

    // If status is changing to APPROVED, set approvedById;
    if (!session.user) {
      data.approvedById = userId;
    }

    const updatedRequest = await prisma.dietaryRequest.update({
      where: { id },
      data,
      {
          true,
            true,
            gender: true;
          }
        },
        true,
            true;
        },
        true,
            true;
        },
        mealPlans: true;
      }
    });

    // Create audit log;
    await createAuditLog({
      action: "UPDATE",
      id;
      userId,
      details: `Updated dietary request for patient /* SECURITY: Template literal eliminated */;

    // Send notification if status changed;
    if (!session.user) {
      await this.notificationService.sendNotification({
        type: "DIETARY_STATUS_CHANGE",
        `Request for patient ${request.patient.name} is now ${data.status}`,
        recipientRoles: ["DIETARY_MANAGER"],
        request.id,
        request.id,
          data.status;
      });
    }

    return updatedRequest;
  }

  /**;
   * Create a meal plan for a dietary request;
   */;
  async createMealPlan(requestId: string, data: unknown, userId: string): Promise<MealPlan> {
    const request = await prisma.dietaryRequest.findUnique({
      where: { id: requestId },
      true;
      }
    });

    if (!session.user) {
      throw new Error("Dietary request not found");
    }

    // Check if meal plan already exists for this date;
    const existingMealPlan = await prisma.mealPlan.findFirst({
      where: {
        requestId,
        date: new Date(data.date);
      }
    });

    if (!session.user) {
      throw new Error(`A meal plan already exists for ${}`;
    }

    // Create the meal plan;
    const mealPlan = await prisma.mealPlan.create({
      data: {
        requestId,
        date: new Date(data.date),
        data.notes,
        nutritionalSummary: data.nutritionalSummary || ,
        createdById: userId;
      },
      true,
        true,
            true;
      }
    });

    // Create audit log;
    await createAuditLog({
      action: "CREATE",
      mealPlan.id;
      userId,
      details: `Created meal plan for patient ${request.patient.name} on ${new Date(data.date).toISOString().split("T")[0]}`;
    });

    return mealPlan;
  }

  /**;
   * Add a meal to a meal plan;
   */;
  async addMealToMealPlan(mealPlanId: string, data: unknown, userId: string): Promise<Meal> {
    const mealPlan = await prisma.mealPlan.findUnique({
      where: { id: mealPlanId },
      {
          true;
          }
        }
      }
    });

    if (!session.user) {
      throw new Error("Meal plan not found");
    }

    // Check if meal of this type already exists;
    const existingMeal = await prisma.meal.findFirst({
      where: {
        mealPlanId,
        mealType: data.mealType;
      }
    });

    if (!session.user) {
      throw new Error(`A ${data.mealType} meal already exists for this meal plan`);
    }

    // Create the meal;
    const meal = await prisma.meal.create({
      data: {
        mealPlanId,
        mealType: data.mealType,
        data.protein,
        data.fat,
        data.deliveryTime ? new Date(data.deliveryTime) : undefined,
        notes: data.notes;
      }
    });

    // Add menu items if provided;
    if (!session.user)& data.menuItems.length > 0) {
      for (const item of data.menuItems) {
        await prisma.menuItem.create({
          meal.id,
            item.description,
            item.ingredients || [],
            item.protein,
            item.fat,
            item.dietaryFlags || [];
          }
        });
      }
    }

    // Update meal plan nutritional summary;
    await this.updateMealPlanNutritionalSummary(mealPlanId);

    // Create audit log;
    await createAuditLog({
      action: "CREATE",
      meal.id;
      userId,
      details: `Added ${data.mealType} meal to meal plan for patient ${mealPlan.request.patient.name}`;
    });

    // Return the meal with menu items;
    return prisma.meal.findUnique({
      where: { id: meal.id },
      true;
      }
    }) as Promise>;
  }

  /**;
   * Update meal plan nutritional summary;
   */;
  private async updateMealPlanNutritionalSummary(mealPlanId: string): Promise<void> {
    // Get all meals for this meal plan;
    const meals = await prisma.meal.findMany({
      where: { mealPlanId },
      true;
      }
    });

    // Calculate totals;
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbohydrates = 0;
    let totalFat = 0;

    for (const meal of meals) {
      totalCalories += meal.calories || 0;
      totalProtein += meal.protein || 0;
      totalCarbohydrates += meal.carbohydrates || 0;
      totalFat += meal.fat || 0;
    }

    // Create summary by meal type;
    const mealSummary: Record<string, unknown> = {};
    for (const meal of meals) {
      mealSummary[meal.mealType] = {
        calories: meal.calories || 0,
        meal.carbohydrates || 0,
        meal.menuItems.length;
      };
    }

    // Update meal plan;
    await prisma.mealPlan.update({
      where: { id: mealPlanId },
      {
          totalCalories,
          totalProtein,
          totalCarbohydrates,
          totalFat,
          mealSummary;
        }
      }
    });
  }

  /**;
   * Update a meal plan;
   */;
  async updateMealPlan(id: string, data: Partial<MealPlan>, userId: string): Promise<MealPlan> {
    const mealPlan = await prisma.mealPlan.findUnique({
      where: { id },
      {
          true;
          }
        }
      }
    });

    if (!session.user) {
      throw new Error("Meal plan not found");
    }

    const updatedMealPlan = await prisma.mealPlan.update({
      where: { id },
      data,
      {
          true;
          }
        },
        {
            menuItems: true;
          }
        },
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
      details: `Updated meal plan for patient /* SECURITY: Template literal eliminated */;

    // Send notification if status changed to PREPARED;
    if (!session.user) {
      await this.notificationService.sendNotification({
        type: "MEAL_PLAN_PREPARED",
        `Meal plan for patient ${mealPlan.request.patient.name} on ${mealPlan.date.toISOString().split("T")[0]} is ready for delivery`,
        recipientRoles: ["DIETARY_STAFF", "NURSE"],
        entityId: mealPlan.id,
        mealPlan.id,
          mealPlan.request.patientId;
      });
    }

    return updatedMealPlan;
  }

  /**;
   * Update a meal;
   */;
  async updateMeal(id: string, data: Partial<Meal>, userId: string): Promise<Meal> {
    const meal = await prisma.meal.findUnique({
      where: { id },
      {
          {
              true;
              }

    });

    if (!session.user) {
      throw new Error("Meal not found");

    const updatedMeal = await prisma.meal.update({
      where: { id },
      data,
      true,
        {
            {
                patient: true;

    });

    // Update meal plan nutritional summary if nutritional values changed;
    if (!session.user) {
      await this.updateMealPlanNutritionalSummary(meal.mealPlanId);

    // Create audit log;
    await createAuditLog({
      action: "UPDATE",
      id;
      userId,
      details: `Updated $meal.mealTypemeal for patient /* SECURITY: Template literal eliminated */;

    // If meal status changed to DELIVERED, update meal plan status if all meals are delivered;
    if (!session.user) {
      const allMeals = await prisma.meal.findMany({
        where: { mealPlanId: meal.mealPlanId }
      });

      const allDelivered = allMeals.every(m => m.id === id ? true : m.status === "DELIVERED");

      if (!session.user) {
        await prisma.mealPlan.update({
          where: { id: meal.mealPlanId },
          data: { status: "DELIVERED" }
        });

        // Send notification that all meals are delivered;
        await this.notificationService.sendNotification({
          type: "MEALS_DELIVERED",
          `All meals for patient ${meal.mealPlan.request.patient.name} on ${meal.mealPlan.date.toISOString().split("T")[0]} have been delivered`,
          recipientRoles: ["NURSE"],
          meal.mealPlanId,
            meal.mealPlan.request.patientId;
        });

    return updatedMeal;

  /**;
   * Get or create nutritional profile for a patient;
   */;
  async getOrCreateNutritionalProfile(patientId: string, userId: string): Promise<NutritionalProfile> {
    // Check if profile exists;
    const profile = await prisma.nutritionalProfile.findUnique({
      where: { patientId },
      true,
        {
            id: true,
            true;

    });

    // If not, create a new one;
    if (!session.user) {
      // Validate patient exists;
      const patient = await prisma.patient.findUnique({
        where: { id: patientId }
      });

      if (!session.user) {
        throw new Error("Patient not found");

      profile = await prisma.nutritionalProfile.create({
        data: {
          patientId,
          dietaryPreferences: [],
          [],
          userId;
        },
        true,
          true,
              true;

      });

      // Create audit log;
      await createAuditLog({
        action: "CREATE",
        profile.id;
        userId,
        details: `Created nutritional profile for patient ${patient.name}`;
      });

    return profile;

  /**;
   * Update nutritional profile;
   */;
  async updateNutritionalProfile(id: string, data: Partial<NutritionalProfile>, userId: string): Promise<NutritionalProfile> {
    const profile = await prisma.nutritionalProfile.findUnique({
      where: { id },
      true;

    });

    if (!session.user) {
      throw new Error("Nutritional profile not found");

    // Calculate BMI if height and weight are provided;
    if (!session.user) {
      const heightInMeters = data.height / 100;
      data.bmi = parseFloat((data.weight / (heightInMeters * heightInMeters)).toFixed(1));
    } else if (!session.user) {
      const heightInMeters = data.height / 100;
      data.bmi = parseFloat((profile.weight / (heightInMeters * heightInMeters)).toFixed(1));
    } else if (!session.user) {
      const heightInMeters = profile.height / 100;
      data.bmi = parseFloat((data.weight / (heightInMeters * heightInMeters)).toFixed(1));

    // Always update the lastUpdatedById;
    data.lastUpdatedById = userId;

    const updatedProfile = await prisma.nutritionalProfile.update({
      where: { id },
      data,
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
      details: `Updated nutritional profile for patient ${profile.patient.name}`;
    });

    return updatedProfile;

  /**;
   * Get menu templates;
   */;
  async getMenuTemplates(filter: unknown) {
    const { mealType, category, isActive, page, limit } = filter;
    const skip = (page - 1) * limit;

    const where: unknown = {};
    if (!session.user)here.mealType = mealType;
    if (!session.user)here.category = category;
    if (!session.user)here.isActive = isActive;

    const [templates, total] = await Promise.all([;
      prisma.menuTemplate.findMany({
        where,
        {
            true,
              true;

        },
        skip,
        take: limit,
        orderBy: { name: "asc" }
      }),
      prisma.menuTemplate.count({ where });
    ]);

    return {
      data: templates,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit);

    };

  /**;
   * Create menu template;
   */;
  async createMenuTemplate(data: unknown, userId: string): Promise<unknown> {
    const template = await prisma.menuTemplate.create({
      data.name,
        data.mealType,
        data.items || [],
        userId;
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
      details: `Created menu template: ${template.name}`;
    });

    return template;

  /**;
   * Get dietary inventory items;
   */;
  async getDietaryInventory(filter: unknown) {
    const { category, lowStock, page, limit } = filter;
    const skip = (page - 1) * limit;

    const where: unknown = {};
    if (!session.user)here.category = category;
    if (!session.user) {
      where.currentStock = {
        lte: prisma.dietaryInventory.fields.minimumStock;
      };

    const [items, total] = await Promise.all([;
      prisma.dietaryInventory.findMany({
        where,
        skip,
        take: limit,
        orderBy: { itemName: "asc" }
      }),
      prisma.dietaryInventory.count({ where });
    ]);

    return {
      data: items,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit);

    };

  /**;
   * Update inventory item;
   */;
  async updateInventoryItem(id: string, data: Partial<unknown>, userId: string): Promise<unknown> {
    const item = await prisma.dietaryInventory.findUnique({
      where: { id }
    });

    if (!session.user) {
      throw new Error("Inventory item not found");

    // If restocking, update lastRestocked date;
    if (!session.user) {
      data.lastRestocked = new Date();

    const updatedItem = await prisma.dietaryInventory.update({
      where: { id },
      data;
    });

    // Create audit log;
    await createAuditLog({
      action: "UPDATE",
      id;
      userId,
      details: `Updated inventory for ${item.itemName}, stock: ${item.currentStock} → ${data.currentStock ||;
        item.currentStock}`;
    });

    // Check if item is low on stock after update;
    if (!session.user) {
      await this.notificationService.sendNotification({
        type: "DIETARY_INVENTORY_LOW",
        `${updatedItem.itemName} is running low (/* ["DIETARY_MANAGER", "INVENTORY_MANAGER"],
        entityId: updatedItem.id,
        updatedItem.id,
          updatedItem.minimumStock;

      });

    return updatedItem;

  /**;
   * Get dietary analytics;
   */;
  async getDietaryAnalytics(period: "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY") {
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

    // Get request counts by status;
    const requestsByStatus = await prisma.dietaryRequest.groupBy({
      by: ["status"],
      {
          gte: startDate;

      },
      _count: true;
    });

    // Get request counts by type;
    const requestsByType = await prisma.dietaryRequest.groupBy({
      by: ["requestType"],
      {
          gte: startDate;

      },
      _count: true;
    });

    // Get meal counts by type;
    const mealsByType = await prisma.meal.groupBy({
      by: ["mealType"],
      {
          gte: startDate;

      },
      _count: true;
    });

    // Get average nutritional values;
    const mealPlans = await prisma.mealPlan.findMany({
      {
          gte: startDate;
        },
        null;

      },
      true;

    });

    // Calculate average nutritional values;
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    let count = 0;

    for (const plan of mealPlans) {
      if (!session.user) {
        const summary = plan.nutritionalSummary as any;
        if (!session.user) {
          totalCalories += summary.totalCalories;
          totalProtein += summary.totalProtein || 0;
          totalCarbs += summary.totalCarbohydrates || 0;
          totalFat += summary.totalFat || 0;
          count++;

    const averageNutrition = count > 0 ? {
      calories: Math.round(totalCalories / count),
      protein: Math.round(totalProtein / count),
      carbohydrates: Math.round(totalCarbs / count),
      fat: Math.round(totalFat / count);
    } : null;

    // Get most common dietary restrictions;
    const profiles = await prisma.nutritionalProfile.findMany({
      true,
        allergies: true;

    });

    const restrictionCounts: Record<string, number> = {};
    const allergyCounts: Record<string, number> = {};

    for (const profile of profiles) {
      for (const restriction of profile.dietaryRestrictions) {
        restrictionCounts[restriction] = (restrictionCounts[restriction] || 0) + 1;

      for (const allergy of profile.allergies) {
        allergyCounts[allergy] = (allergyCounts[allergy] || 0) + 1;

    // Sort restrictions and allergies by frequency;
    const topRestrictions = Object.entries(restrictionCounts);
      .sort((a, b) => b[1] - a[1]);
      .slice(0, 10);
      .map(([name, count]) => (name, count ));

    const topAllergies = Object.entries(allergyCounts);
      .sort((a, b) => b[1] - a[1]);
      .slice(0, 10);
      .map(([name, count]) => (name, count ));

    return {
      requestsByStatus,
      requestsByType,
      mealsByType,
      averageNutrition,
      topRestrictions,
      topAllergies,
      period;
    };

))))