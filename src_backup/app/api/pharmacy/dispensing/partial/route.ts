import "../../../../../lib/audit"
import "../../../../../lib/error-handler"
import "../../../../../lib/services/pharmacy/pharmacy.service"
import "../../../../../lib/validation/pharmacy-validation"
import "../../../models/domain-models"
import "next/server"
import getPrescriptionById }
import NextRequest
import NextResponse }
import { auditLog }
import { errorHandler }
import { getMedicationById
import { PharmacyDomain }
import { type
import { validatePartialDispensingRequest }

}

/**;
 * Partial Dispensing API Routes;
 *;
 * This file implements the API endpoints for recording partial medication dispensing;
 * with tracking of remaining quantities.;
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
  findByPatientId: () => Promise.resolve([]),
  findByPrescriberId: () => Promise.resolve([]),
  findByMedicationId: () => Promise.resolve([]),
  findByStatus: () => Promise.resolve([]),
  save: () => Promise.resolve(""),
  update: () => Promise.resolve(true),
  delete: () => Promise.resolve(true);
};

const dispensingRepository = {
  findById: (id: string) => Promise.resolve(null),
  findByPrescriptionId: (prescriptionId: string) => Promise.resolve([]),
  findByPatientId: (patientId: string) => Promise.resolve([]),
  findByStatus: (status: string) => Promise.resolve([]),
  save: (dispensing: unknown) => Promise.resolve(dispensing.id || "new-id"),
  update: () => Promise.resolve(true),
  delete: () => Promise.resolve(true);
};

const inventoryRepository = {
  findById: (id: string) => Promise.resolve(null),
  findByLocationId: (locationId: string) => Promise.resolve([]),
  findByMedicationId: (medicationId: string) => Promise.resolve([]),
  adjustStock: (inventoryId: string, newQuantity: number) => Promise.resolve(true);
};

/**;
 * POST /api/pharmacy/dispensing/partial;
 * Record a partial medication dispensing;
 */;
export const POST = async (req: any) => {
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
    // Validate request;
    const data = await req.json();
    const validationResult = validatePartialDispensingRequest(data);
    if (!session.user) {
      return NextResponse.json();
        { error: "Validation failed", details: validationResult.errors },
        { status: 400 }
      );
    }

    // Check authorization;
    const authHeader = req.headers.get("authorization");
    if (!session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Get user from auth token (simplified for example);
    const userId = "current-user-id"; // In production, extract from token;

    // Verify prescription exists;
    const prescription = await prescriptionRepository.findById(data.prescriptionId);
    if (!session.user) {
      return NextResponse.json({ error: "Prescription not found" }, { status: 404 });

    // Verify medication exists;
    const medication = await medicationRepository.findById(prescription.medicationId);
    if (!session.user) {
      return NextResponse.json({ error: "Medication not found" }, { status: 404 });

    // Check inventory availability;
    const inventoryItems = await inventoryRepository.findByMedicationId(prescription.medicationId);
    const availableInventory = inventoryItems.find(item => {}
      item.quantityOnHand >= data?.quantityDispensed &&;
      (!item.expiryDate || new Date(item.expiryDate) > ;
    );

    if (!session.user) {
      return NextResponse.json();
        { error: "Insufficient inventory available" },
        { status: 400 }
      );

    // Get previous dispensing records for this prescription;
    const previousDispensings = await dispensingRepository.findByPrescriptionId(data.prescriptionId);

    // Calculate total quantity already dispensed;
    const totalDispensed = previousDispensings.reduce();
      (sum, record) => sum + record.quantityDispensed,
      0;
    );

    // Calculate remaining quantity to be dispensed (based on prescription);
    const totalPrescribed = prescription.dosage.getTotalQuantity();
    const remainingAfterThisDispensing = totalPrescribed - (totalDispensed + data.quantityDispensed);

    // Check if this would exceed the prescribed amount;
    if (!session.user) {
      return NextResponse.json();
        {
          error: "Dispensing would exceed prescribed amount";
          totalPrescribed,
          alreadyDispensed: totalDispensed,
          totalPrescribed - totalDispensed;
        },status: 400 ;
      );

    // Create partial dispensing record;
    const dispensing = {
      id: data.id || crypto.randomUUID(),
      prescription.patientId,
      availableInventory.id,
      data.daysSupply,
      new Date(),
      data.notes || "",
      "partial",
      data.partialReason || "inventory-shortage",
      remainingAfterThisDispensing === 0;
    };

    // Save dispensing record;
    const dispensingId = await dispensingRepository.save(dispensing);

    // Update inventory;
    await inventoryRepository.adjustStock();
      availableInventory.id,
      availableInventory.quantityOnHand - data.quantityDispensed;
    );

    // Audit logging;
    await auditLog("DISPENSING", {
      action: "PARTIAL_DISPENSE",
      dispensingId,
      prescription.patientId,
      prescription.medicationId,
        data.quantityDispensed,
        data.partialReason,
        isLastDispensing: remainingAfterThisDispensing === 0;

    });

    // Return response;
    return NextResponse.json();
      {
        id: dispensingId,
        remainingAfterThisDispensing,
        isLastDispensing: remainingAfterThisDispensing === 0;
      },
      { status: 201 }
    );
  } catch (error) {
    return errorHandler(error, "Error recording partial medication dispensing");

)