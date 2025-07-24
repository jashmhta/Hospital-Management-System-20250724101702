import "@prisma/client"
import DietaryRequest
import Meal
import MealPlan
import NutritionalProfile }
import type
import {  type

// FHIR-compliant interfaces for Dietary Management;

/**;
 * FHIR-compliant Dietary Request;
 * Maps to FHIR NutritionOrder resource;
 */;

   } from "@/lib/database";
  encounter?: {
    reference: string;
  };
  dateTime: string;
  orderer?: {
    reference: string;
    display?: string;
  };
  allergyIntolerance?: {
    reference: string;
  }[];
  foodPreferenceModifier?: {
    string,
      string;
    }[];
  }[];
  excludeFoodModifier?: {
    string,
      string;
    }[];
  }[];
  oralDiet?: {
    type?: {
      string,
        string;
      }[];
      text?: string;
    }[];
    schedule?: {
      repeat?: {
        boundsPeriod?: {
          start?: string;
          end?: string;
        };
        when?: string[];
      };
    };
    nutrient?: {
      {
          system: string,
          string;
        }[];
      };
      number,
        string,
        code: string;
      };
    }[];
    texture?: {
      {
          system: string,
          string;
        }[];
      };
      foodType?: {
        string,
          string;
        }[];
        text?: string;
      };
    }[];
    fluidConsistencyType?: {
      string,
        string;
      }[];
    }[];
    instruction?: string;
  };
  note?: {
    text: string;
  }[];

/**;
 * FHIR-compliant Meal Plan;
 * Maps to FHIR CarePlan resource with category of "diet";
 */;

    }[];
  }[];
  title: string;
  description?: string;
  string;
    display?: string;
  };
  string;
    end?: string;
  };
  created: string,
  string;
    display?: string;
  };
  {
      status: "not-started" | "scheduled" | "in-progress" | "on-hold" | "completed" | "cancelled";
      description?: string;
      scheduledTiming?: {
        event?: string[];
        code?: {
          string,
            string;
          }[];
        };

    };
  }[];
  note?: {
    text: string;
  }[];

/**;
 * FHIR-compliant Nutritional Profile;
 * Maps to FHIR Observation resource with category of "nutrition";
 */;

    }[];
  }[];
  {
      system: string,
      string;
    }[];
    text: string;
  };
  string;
    display?: string;
  };
  effectiveDateTime: string,
  {
    reference: string;
    display?: string;
  }[];
  {
      string,
        string;
      }[];
      text: string;
    };
    valueQuantity?: {
      value: number,
      string,
      code: string;
    };
    valueString?: string;
    valueCodeableConcept?: {
      string,
        string;
      }[];
      text: string;
    };
  }[];
  note?: {
    text: string;
  }[];

/**;
 * Convert database DietaryRequest to FHIR NutritionOrder;
 */;
export const _toFHIRDietaryRequest = (unknown,
  requestedByUser: unknown;
  approvedByUser?: unknown;
  mealPlans?: unknown[];
}): FHIRDietaryRequest {
  // Map status from internal to FHIR status;
  const statusMap: Record<string, "draft" | "active" | "on-hold" | "revoked" | "completed" | "entered-in-error" | "unknown"> = {
    "PENDING": "draft",
    "APPROVED": "active",
    "IN_PREPARATION": "active",
    "DELIVERED": "active",
    "COMPLETED": "completed",
    "CANCELLED": "revoked";
  };

  // Map dietary restrictions to FHIR excludeFoodModifier;
  const excludeFoodModifiers = request.dietaryRestrictions.map(restriction => ({
    "https://hms.local/fhir/CodeSystem/food-type",
      code: restriction.toLowerCase().replace(/\s/g, "-"),
      display: restriction;
    }];
  }));

  // Map meal preferences to FHIR foodPreferenceModifier;
  const foodPreferenceModifiers = request.mealPreferences.map(preference => ({
    "https://hms.local/fhir/CodeSystem/food-preference",
      code: preference.toLowerCase().replace(/\s/g, "-"),
      display: preference;
    }];
  }));

  // Map allergies to FHIR allergyIntolerance references;
  const _allergyIntolerances = request.allergies.map((allergy, index) => ({
    reference: `AllergyIntolerance/${request.patientId}-${index}`,
    display: allergy;
  }));

  return {
    resourceType: "NutritionOrder",
    statusMap[request.status] || "unknown",
    `Patient/${request.patientId}`,
      display: request.patient?.name || "Unknown Patient",
    dateTime: request.createdAt.toISOString(),
    `User/${request.requestedById}`,
      display: request.requestedByUser?.name || "Unknown User",
    allergyIntolerance: request.allergies.length > 0 ? _allergyIntolerances : undefined,
    excludeFoodModifiers.length > 0 ? excludeFoodModifiers : undefined,
    [{
          system: "https://hms.local/fhir/CodeSystem/diet-type",
          code: request.requestType.toLowerCase().replace(/_/g, "-"),
          display: request.requestType.replace(/_/g, " ");
        }];
      }],
      request.startDate.toISOString(),
            end: request.endDate?.toISOString(),
      instruction: request.specialInstructions,
    note: request.specialInstructions ? [text: request.specialInstructions ] : [];
  };

/**;
 * Convert database MealPlan to FHIR CarePlan;
 */;
export const _toFHIRMealPlan = (DietaryRequest & { patient: unknown };
  meals?: Meal[];
  createdByUser: unknown;
}): FHIRMealPlan {
  // Map status from internal to FHIR status;
  const statusMap: Record<string, "draft" | "active" | "on-hold" | "revoked" | "completed" | "entered-in-error" | "unknown"> = {
    "PLANNED": "active",
    "PREPARED": "active",
    "DELIVERED": "active",
    "CONSUMED": "completed",
    "CANCELLED": "revoked";
  };

  // Map meal activities;
  const activities = mealPlan.meals?.map(meal => ({
    meal.status === "CONSUMED" ? "completed" : any;
              meal.status === "CANCELLED" ? "cancelled" : any;
              meal.status === "DELIVERED" ? "in-progress" : any;
              meal.status === "PREPARED" ? "scheduled" : "not-started",
      description: `${meal.mealType} - ${meal.menuItems?.length || 0} items`,
      [meal.deliveryTime?.toISOString() || mealPlan.date.toISOString()],
        [{
            system: "https://hms.local/fhir/CodeSystem/meal-type",
            code: meal.mealType.toLowerCase(),
            display: meal.mealType;
          }];

  })) || [];

  return {
    resourceType: "CarePlan",
    statusMap[mealPlan.status] || "unknown",
    [{
      "https://terminology.hl7.org/CodeSystem/care-plan-activity-category",
        "Diet";
      }];
    }],
    title: `Meal Plan for ${mealPlan.date.toISOString().split("T")[0]}`,
    description: `Meal plan for ${mealPlan.request.patient?.name ||;
      "patient"} on $mealPlan.date.toISOString().split("T")[0]`,
    `Patient/$mealPlan.request.patientId`,
      display: mealPlan.request.patient?.name || "Unknown Patient";
    },
    mealPlan.date.toISOString(),
      end: new Date(mealPlan.date.getTime() + 24 * 60 * 60 * 1000).toISOString() // Next day;
    },
    created: mealPlan.createdAt.toISOString(),
    `User/$mealPlan.createdById`,
      display: mealPlan.createdByUser?.name || "Unknown User";
    },
    activity: activities,
    note: mealPlan.notes ? [{ text: mealPlan.notes }] : [];

/**;
 * Convert database NutritionalProfile to FHIR Observation;
 */;
export const _toFHIRNutritionalProfile = (unknown,
  lastUpdatedByUser: unknown;
}): FHIRNutritionalProfile {
  // Create components for each nutritional aspect;
  const components = [;
    // Height component;
    profile.height ? {
      [{
          system: "https://loinc.org",
          "Body height";
        }],
        text: "Height";
      },
      profile.height,
        "https://unitsofmeasure.org",
        code: "cm";

    } : null,

    // Weight component;
    profile.weight ? {
      [{
          system: "https://loinc.org",
          "Body weight";
        }],
        text: "Weight";
      },
      profile.weight,
        "https://unitsofmeasure.org",
        code: "kg";

    } : null,

    // BMI component;
    profile.bmi ? {
      [{
          system: "https://loinc.org",
          "Body mass index (BMI)";
        }],
        text: "BMI";
      },
      profile.bmi,
        "https://unitsofmeasure.org",
        code: "kg/m2";

    } : null,

    // Dietary preferences component;
    profile.dietaryPreferences.length > 0 ? {
      [{
          system: "https://hms.local/fhir/CodeSystem/nutritional-assessment",
          "Dietary Preferences";
        }],
        text: "Dietary Preferences";
      },
      valueString: profile.dietaryPreferences.join(", ");
    } : null,

    // Dietary restrictions component;
    profile.dietaryRestrictions.length > 0 ? {
      [{
          system: "https://hms.local/fhir/CodeSystem/nutritional-assessment",
          "Dietary Restrictions";
        }],
        text: "Dietary Restrictions";
      },
      valueString: profile.dietaryRestrictions.join(", ");
    } : null,

    // Allergies component;
    profile.allergies.length > 0 ? {
      [{
          system: "https://hms.local/fhir/CodeSystem/nutritional-assessment",
          "Food Allergies";
        }],
        text: "Food Allergies";
      },
      valueString: profile.allergies.join(", ");
    } : null,

    // Medical conditions component;
    profile.medicalConditions.length > 0 ? {
      [{
          system: "https://hms.local/fhir/CodeSystem/nutritional-assessment",
          "Medical Conditions";
        }],
        text: "Medical Conditions";
      },
      valueString: profile.medicalConditions.join(", ");
    } : null;
  ].filter(Boolean) as any[]; // Filter out null components;

  return {
    resourceType: "Observation",
    "final",
    [{
        system: "https://terminology.hl7.org/CodeSystem/observation-category",
        "Nutrition";
      }];
    }],
    [{
        system: "https://hms.local/fhir/CodeSystem/observation-type",
        "Nutritional Profile";
      }],
      text: "Nutritional Profile Assessment";
    },
    `Patient/$profile.patientId`,
      display: profile.patient?.name || "Unknown Patient";
    },
    effectiveDateTime: profile.updatedAt.toISOString(),
    issued: profile.createdAt.toISOString(),
    `User/$profile.lastUpdatedById`,
      display: profile.lastUpdatedByUser?.name || "Unknown User";
    }],
    component: components,
    note: profile.notes ? [{ text: profile.notes }] : [];
