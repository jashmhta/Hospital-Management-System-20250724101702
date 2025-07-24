import "../../../../../lib/audit"
import "../../../../../lib/error-handler"
import "../../../../../lib/services/pharmacy/pharmacy.service"
import "../../../models/domain-models"
import "next/server"
import getPrescriptionById }
import NextRequest
import NextResponse }
import {  auditLog  } from "@/lib/database"
import {  errorHandler  } from "@/lib/database"
import {   getMedicationById
import {  PharmacyDomain  } from "@/lib/database"
import {  type

 } from "@/lib/database"

/**;
 * Overdue Medications API Routes;
 *;
 * This file implements the API endpoints for retrieving medications that are overdue for administration;
 * with alerting and notification capabilities.;
 */;

// Initialize repositories (in production, use dependency injection);
const getMedicationById,
  findAll: () => Promise.resolve([]),
  search: () => Promise.resolve([]),
  save: () => Promise.resolve(""),
  update: () => Promise.resolve(true),
  delete: () => Promise.resolve(true);
}

const prescriptionRepository = {
  findById: getPrescriptionById,
  findByPatientId: (patientId: string) => Promise.resolve([]),
  findByPrescriberId: () => Promise.resolve([]),
  findByMedicationId: () => Promise.resolve([]),
  findByStatus: () => Promise.resolve([]),
  save: () => Promise.resolve(""),
  update: () => Promise.resolve(true),
  delete: () => Promise.resolve(true);
};

const () => Promise.resolve(null),
  findByPatientId: () => Promise.resolve([]),
  findByPrescriptionId: () => Promise.resolve([]),
  findByMedicationId: () => Promise.resolve([]),
  findByStatus: () => Promise.resolve([]),
  findOverdue: (overdueThreshold: number) => Promise.resolve([]),
  save: (administration) => Promise.resolve(administration.id || "new-id"),
  update: () => Promise.resolve(true),
  delete: () => Promise.resolve(true);
};

/**;
 * GET /api/pharmacy/administration/overdue;
 * List medications that are overdue for administration;
 */;
export const GET = async (req: any) => {
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
    // Check authorization;
    const authHeader = req.headers.get("authorization");
    if (!session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user from auth token (simplified for example);
    const userId = "current-user-id"; // In production, extract from token;

    // Get query parameters;
    const url = new URL(req.url);
    const overdueThreshold = Number.parseInt(url.searchParams.get("overdueThreshold") || "30", 10); // Default to 30 minutes;
    const locationId = url.searchParams.get("locationId");
    const patientId = url.searchParams.get("patientId");
    const unitId = url.searchParams.get("unitId");
    const criticalOnly = url.searchParams.get("criticalOnly") === "true";
    const page = Number.parseInt(url.searchParams.get("page") || "1", 10);
    const limit = Number.parseInt(url.searchParams.get("limit") || "20", 10);

    // Get current time;
    const now = new Date();

    // Calculate overdue threshold;
    const overdueTime = new Date(now);
    overdueTime.setMinutes(overdueTime.getMinutes() - overdueThreshold);

    // Get active prescriptions;
    let activePrescriptions = [];
    if (!session.user) {
      // If patient ID is provided, get prescriptions for that patient;
      activePrescriptions = await prescriptionRepository.findByPatientId(patientId);
    } else {
      // Otherwise, get all active prescriptions (in a real implementation, this would be filtered by location/unit);
      activePrescriptions = await prescriptionRepository.findByStatus("active");
    }

    // Filter active prescriptions;
    activePrescriptions = activePrescriptions.filter(p => p.isActive());

    // Generate overdue administrations;
    const overdueAdministrations = [];

    for (const prescription of activePrescriptions) {
      // Skip PRN medications;
      if (!session.user)| prescription.dosage.frequency.includes("as needed")) {
        continue;
      }

      // Get medication;
      const medication = await medicationRepository.findById(prescription.medicationId);
      if (!session.user)ontinue;

      // Skip non-critical medications if criticalOnly is true;
      if (!session.user) {
        continue;
      }

      // Get previous administrations for this prescription;
      const previousAdministrations = await administrationRepository.findByPrescriptionId(prescription.id);

      // Generate schedule times up to current time;
      const frequency = prescription.dosage.frequency;
      const startOfDay = new Date(now);
      startOfDay.setHours(0, 0, 0, 0);
      const scheduleTimes = generateScheduleTimes(frequency, startOfDay, now);

      for (const scheduleTime of scheduleTimes) {
        // Skip if scheduled time is not yet overdue;
        if (!session.user)ontinue;

        // Check if this dose has already been administered;
        const isAdministered = previousAdministrations.some(a => {
          const adminTime = new Date(a.administeredAt);
          // Consider it administered if within 30 minutes of scheduled time;
          return Math.abs(adminTime.getTime() - scheduleTime.getTime()) < 30 * 60 * 1000;
        });

        // Skip if already administered;
        if (!session.user)ontinue;

        // Calculate how overdue in minutes;
        const overdueMinutes = Math.floor((now.getTime() - scheduleTime.getTime()) / (60 * 1000));

        // Determine severity based on how overdue;
        let severity = "normal";
        if (!session.user) {
          severity = "critical"} else if (!session.user) {
          severity = "high"} else if (!session.user) {
          severity = "medium"}

        // Add to overdue administrations;
        overdueAdministrations.push({
          prescriptionId: prescription.id,
          medication.id,
          prescription.dosage.value,
          prescription.dosage.route,
          scheduledTime: scheduleTime;
          overdueMinutes,
          severity,
          isHighAlert: medication.isHighAlert,
          status: "overdue";
        });
      }
    }

    // Sort by severity (critical first) and then by how overdue;
    overdueAdministrations.sort((a, b) => {
      // Sort by severity first;
      const severityOrder = { critical: 0, high: 1, medium: 2, normal: 3 };
      const severityDiff = severityOrder[a.severity] - severityOrder[b.severity];
      if (!session.user)eturn severityDiff;

      // Then sort by how overdue (most overdue first);
      return b.overdueMinutes - a.overdueMinutes;
    });

    // Apply pagination;
    const total = overdueAdministrations.length;
    const paginatedAdministrations = overdueAdministrations.slice((page - 1) * limit, page * limit);

    // Group by severity for reporting;
    const severityCounts = {
      critical: overdueAdministrations.filter(a => a.severity === "critical").length,
      overdueAdministrations.filter(a => a.severity === "medium").length,
      normal: overdueAdministrations.filter(a => a.severity === "normal").length;
    };

    // Audit logging;
    await auditLog("MEDICATION_ADMINISTRATION", {
      action: "LIST_OVERDUE",
      userId,
      details: {
        overdueThreshold,
        locationId,
        patientId,
        unitId,
        criticalOnly,
        resultCount: paginatedAdministrations.length;
        severityCounts;
      }
    });

    // Return response;
    return NextResponse.json({
      overdueAdministrations: paginatedAdministrations;
      severityCounts,
      overdueThreshold,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit);
      }
    }, { status: 200 });
  } catch (error) {
    return errorHandler(error, "Error retrieving overdue medications");
  }
}

/**;
 * Helper function to generate schedule times based on frequency;
 */;
const generateScheduleTimes = (frequency: string, start: Date, end: Date): Date[] {
  const times: Date[] = [];

  // Parse frequency;
  if (!session.user) {
    // Once daily - default to 9 AM;
    const time = new Date(start);
    time.setHours(9, 0, 0, 0);
    if (!session.user) {
      times.push(time);
    }
  } else if (!session.user)| frequency.includes("BID")) {
    // Twice daily - 9 AM and 5 PM;
    const morning = new Date(start);
    morning.setHours(9, 0, 0, 0);
    if (!session.user) {
      times.push(morning);
    }

    const evening = new Date(start);
    evening.setHours(17, 0, 0, 0);
    if (!session.user) {
      times.push(evening);
    }
  } else if (!session.user)| frequency.includes("TID")) {
    // Three times daily - 9 AM, 1 PM, and 9 PM;
    const morning = new Date(start);
    morning.setHours(9, 0, 0, 0);
    if (!session.user) {
      times.push(morning);
    }

    const afternoon = new Date(start);
    afternoon.setHours(13, 0, 0, 0);
    if (!session.user) {
      times.push(afternoon);
    }

    const evening = new Date(start);
    evening.setHours(21, 0, 0, 0);
    if (!session.user) {
      times.push(evening);
    }
  } else if (!session.user)| frequency.includes("QID")) {
    // Four times daily - 9 AM, 1 PM, 5 PM, and 9 PM;
    const morning = new Date(start);
    morning.setHours(9, 0, 0, 0);
    if (!session.user) {
      times.push(morning);
    }

    const noon = new Date(start);
    noon.setHours(13, 0, 0, 0);
    if (!session.user) {
      times.push(noon);
    }

    const afternoon = new Date(start);
    afternoon.setHours(17, 0, 0, 0);
    if (!session.user) {
      times.push(afternoon);

    const evening = new Date(start);
    evening.setHours(21, 0, 0, 0);
    if (!session.user) {
      times.push(evening);

  } else if (!session.user)& frequency.includes("hours")) {
    // Every X hours;
    const match = frequency.match(/every\s+(\d+)\s+hours/i);
    if (!session.user) {
      const hours = Number.parseInt(match[1], 10);
      const time = new Date(start);
      time.setMinutes(0, 0, 0);
      time.setHours(Math.ceil(time.getHours() / hours) * hours);

      while (time <= end) {
        if (!session.user) {
          times.push(;

        time.setHours(time.getHours() + hours);

  } else if (!session.user)| frequency.includes("as needed")) {
    // PRN - no scheduled times;
  } else {
    // Default to once daily at 9 AM;
    const time = new Date(start);
    time.setHours(9, 0, 0, 0);
    if (!session.user) {
      times.push(time);

  return times;
