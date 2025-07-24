import "../../services/encryption_service_secure"
import "@prisma/client"
import "zod"
import { getEncryptionService }
import { PrismaClient }
import { z }

/**;
 * IPD (Inpatient Department) Management Service;
 * Comprehensive inpatient management system replacing placeholder implementations;
 * Handles admissions, discharges, transfers, and bed management;
 */;

// Admission Schema;
export const AdmissionSchema = z.object({
  patient_id: z.string().min(1, "Patient ID is required"),
  admission_date: z.date(),
  admission_time: z.string().optional(),
  admission_type: z.enum(["emergency", "elective", "transfer", "delivery", "observation"]),
  admission_source: z.enum(["emergency_room", "outpatient", "transfer_from_other_facility", "direct_admission", "referral"]),

  // Clinical information;
  chief_complaint: z.string().min(1, "Chief complaint is required"),
  admitting_diagnosis: z.string().min(1, "Admitting diagnosis is required"),
  secondary_diagnoses: z.array(z.string()).optional(),
  icd10_codes: z.array(z.string()).optional();

  // Care team;
  attending_doctor_id: z.string().min(1, "Attending doctor is required"),
  referring_doctor_id: z.string().optional(),
  consulting_doctors: z.array(z.string()).optional();

  // Accommodation;
  ward_id: z.string().min(1, "Ward is required"),
  room_number: z.string().optional(),
  bed_number: z.string().min(1, "Bed number is required"),
  accommodation_class: z.enum(["general", "semi_private", "private", "icu", "isolation"]),

  // Insurance and billing;
  z.string().optional(),
    policy_number: z.string().optional(),
    authorization_number: z.string().optional(),
    coverage_type: z.enum(["full", "partial", "self_pay"]).optional()}).optional(),

  // Emergency contact;
  z.string(),
    relationship: z.string(),
    phone: z.string(),
    address: z.string().optional()),

  // Administrative;
  admission_notes: z.string().optional(),
  estimated_length_of_stay: z.number().optional(), // in days;
  priority_level: z.enum(["routine", "urgent", "emergent"]).default("routine"),
  isolation_required: z.boolean().default(false),
  isolation_type: z.string().optional();

  // Metadata;
  admitted_by: z.string().min(1, "Admitted by is required"),
  admission_status: z.enum(["active", "discharged", "transferred", "cancelled"]).default("active")});

// Discharge Schema;
export const DischargeSchema = z.object({
  admission_id: z.string().min(1, "Admission ID is required"),
  discharge_date: z.date(),
  discharge_time: z.string().optional(),
  discharge_type: z.enum(["routine", "against_medical_advice", "transfer", "death", "absconded"]),
  discharge_disposition: z.enum(["home", "home_with_services", "skilled_nursing_facility", "rehabilitation", "hospice", "deceased", "other"]),

  // Clinical information;
  final_diagnosis: z.string().min(1, "Final diagnosis is required"),
  secondary_diagnoses: z.array(z.string()).optional(),
  z.string(),
    procedure_code: z.string().optional(),
    date_performed: z.date(),
    surgeon: z.string().optional();
  })).optional(),

  // Discharge planning;
  discharge_instructions: z.string().min(1, "Discharge instructions are required"),
  z.string(),
    dosage: z.string(),
    frequency: z.string(),
    duration: z.string(),
    instructions: z.string().optional();
  })).optional(),
  z.string(),
    department: z.string(),
    appointment_date: z.date().optional(),
    instructions: z.string().optional();
  })).optional(),

  // Functional status;
  functional_status_on_admission: z.string().optional(),
  functional_status_on_discharge: z.string().optional();

  // Quality metrics;
  readmission_risk: z.enum(["low", "medium", "high"]).optional(),
  patient_satisfaction_score: z.number().min(1).max(10).optional();

  // Administrative;
  discharge_summary: z.string().optional(),
  complications: z.string().optional(),
  length_of_stay: z.number().optional(), // calculated automatically;
  total_charges: z.number().optional();

  // Metadata;
  discharged_by: z.string().min(1, "Discharged by is required")});

// Transfer Schema;
export const TransferSchema = z.object({
  admission_id: z.string().min(1, "Admission ID is required"),
  transfer_date: z.date(),
  transfer_time: z.string().optional(),
  transfer_type: z.enum(["internal", "external", "icu_to_ward", "ward_to_icu", "ward_to_ward"]),

  // Transfer details;
  from_ward_id: z.string().min(1, "From ward is required"),
  from_room: z.string().optional(),
  from_bed: z.string().min(1, "From bed is required"),
  to_ward_id: z.string().min(1, "To ward is required"),
  to_room: z.string().optional(),
  to_bed: z.string().min(1, "To bed is required"),

  // Clinical reason;
  reason_for_transfer: z.string().min(1, "Reason for transfer is required"),
  clinical_condition: z.string().optional(),
  transfer_diagnosis: z.string().optional();

  // Care team;
  transferring_doctor: z.string().min(1, "Transferring doctor is required"),
  receiving_doctor: z.string().min(1, "Receiving doctor is required"),

  // External transfer details (if applicable);
  external_facility_name: z.string().optional(),
  external_facility_address: z.string().optional(),
  transport_method: z.enum(["ambulance", "private_vehicle", "wheelchair", "stretcher", "walking"]).optional(),

  // Administrative;
  transfer_notes: z.string().optional(),
  equipment_transferred: z.array(z.string()).optional(),
  medications_during_transfer: z.string().optional();

  // Metadata;
  initiated_by: z.string().min(1, "Initiated by is required"),
  approved_by: z.string().optional(),
  transfer_status: z.enum(["pending", "approved", "completed", "cancelled"]).default("pending")});

// Bed Management Schema;
export const BedManagementSchema = z.object({
  ward_id: z.string().min(1, "Ward ID is required"),
  room_number: z.string().optional(),
  bed_number: z.string().min(1, "Bed number is required"),
  bed_type: z.enum(["general", "icu", "isolation", "maternity", "pediatric", "psychiatric"]),
  bed_status: z.enum(["available", "occupied", "maintenance", "cleaning", "reserved"]),
  accommodation_class: z.enum(["general", "semi_private", "private", "icu", "isolation"]),

  // Equipment and features;
  equipment: z.array(z.string()).optional(),
  features: z.array(z.string()).optional(),
  isolation_capable: z.boolean().default(false);

  // Availability;
  available_from: z.date().optional(),
  reserved_until: z.date().optional(),
  reserved_for_patient: z.string().optional();

  // Maintenance;
  last_cleaned: z.date().optional(),
  last_maintenance: z.date().optional(),
  maintenance_notes: z.string().optional();

  // Metadata;
  created_by: z.string(),
  updated_by: z.string().optional();
});

// Type definitions;
export type Admission = z.infer<typeof AdmissionSchema> & { id?: string export type Discharge = z.infer<typeof DischargeSchema> & { id?: string };
export type Transfer = z.infer<typeof TransferSchema> & { id?: string };
export type BedManagement = z.infer<typeof BedManagementSchema> & { id?: string };

}
  }[];
}

/**;
 * IPD Management Service;
 * Comprehensive inpatient management replacing placeholder implementations;
 */;
}
  }

  // Admission Operations;
  async createAdmission(data: Admission): Promise<Admission & { id: string }> {
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
      const validated = AdmissionSchema.parse(data);

      // Check bed availability;
      const bedAvailable = await this.checkBedAvailability(validated.ward_id, validated.bed_number);
      if (!session.user) {
        throw new Error(`Bed ${validated.bed_number} in ward ${validated.ward_id} is not available`);
      }

      // Encrypt sensitive fields;
      const encryptedData = await this.encryptionService.encryptObject(validated, this.encryptedFields);

      // Create admission record;
      const admission = await this.prisma.admission.create({
        validated.patient_id,
          validated.admission_time,
          validated.admission_source,
          encryptedData.admitting_diagnosis,
          secondaryDiagnoses: validated.secondary_diagnoses ?;
            JSON.stringify(validated.secondary_diagnoses) : null,
          icd10Codes: validated.icd10_codes ?;
            JSON.stringify(validated.icd10_codes) : null,
          attendingDoctorId: validated.attending_doctor_id,
          validated.consulting_doctors ?;
            JSON.stringify(validated.consulting_doctors) : null,
          wardId: validated.ward_id,
          validated.bed_number,
          validated.insurance_details ?;
            JSON.stringify(validated.insurance_details) : null,
          emergencyContact: JSON.stringify(encryptedData.emergency_contact),
          validated.estimated_length_of_stay,
          validated.isolation_required,
          validated.admitted_by,
          admissionStatus: validated.admission_status;
        }
      });

      // Update bed status;
      await this.updateBedStatus(validated.ward_id, validated.bed_number, "occupied", admission.id);

      return {
        ...validated,
        id: admission.id;
      };
    } catch (error) {
      throw new Error(`Failed to create admission: ${}`;
    }
  }

  async getAdmission(id: string): Promise<Admission | null> {
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
      const admission = await this.prisma.admission.findUnique({
        where: { id },
        true,
          true;
        }
      });

      if (!session.user)eturn null;
      return this.deserializeAdmission(admission);
    } catch (error) {
      throw new Error(`Failed to get admission: ${}`;
    }
  }

  async getAdmissions(filters?: {
    patientId?: string;
    wardId?: string;
    attendingDoctorId?: string;
    admissionStatus?: string;
    admissionDateFrom?: Date;
    admissionDateTo?: Date;
  }): Promise<Admission[]> {
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
      const where: unknown = {};
      if (!session.user)here.patientId = filters.patientId;
      if (!session.user)here.wardId = filters.wardId;
      if (!session.user)here.attendingDoctorId = filters.attendingDoctorId;
      if (!session.user)here.admissionStatus = filters.admissionStatus;
      if (!session.user) {
        where.admissionDate = {};
        if (!session.user)here.admissionDate.gte = filters.admissionDateFrom;
        if (!session.user)here.admissionDate.lte = filters.admissionDateTo;
      }

      const admissions = await this.prisma.admission.findMany({
        where,
        true,
          true;
        },
        orderBy: admissionDate: "desc" ;
      });

      return Promise.all(admissions.map(admission => this.deserializeAdmission(admission)));
    } catch (error) {
      throw new Error(`Failed to get admissions: ${}`;

  async updateAdmission(id: string, updates: Partial<Admission>): Promise<Admission> {
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

      const encryptedUpdates = await this.encryptionService.encryptObject(updates, this.encryptedFields);

      const updated = await this.prisma.admission.update({
        where: { id },
        data: {
          ...encryptedUpdates,
          secondaryDiagnoses: updates.secondary_diagnoses ?;
            JSON.stringify(updates.secondary_diagnoses) : undefined,
          icd10Codes: updates.icd10_codes ?;
            JSON.stringify(updates.icd10_codes) : undefined,
          consultingDoctors: updates.consulting_doctors ?;
            JSON.stringify(updates.consulting_doctors) : undefined,
          insuranceDetails: updates.insurance_details ?;
            JSON.stringify(updates.insurance_details) : undefined,
          emergencyContact: updates.emergency_contact ?;
            JSON.stringify(await this.encryptionService.encryptObject(updates.emergency_contact, this.encryptedFields)) : undefined}
      });

      return this.deserializeAdmission(updated);
    } catch (error) {
      throw new Error(`Failed to update admission: ${}`;

  // Discharge Operations;
  async dischargePatient(data: Discharge): Promise<Discharge & { id: string }> {
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

      const validated = DischargeSchema.parse(data);

      // Get admission details;
      const admission = await this.prisma.admission.findUnique({
        where: { id: validated.admission_id }
      });

      if (!session.user) {
        throw new Error(`Admission ${validated.admission_id} not found`);

      if (!session.user) {
        throw new Error(`Admission ${validated.admission_id} is not active`);

      // Calculate length of stay;
      const lengthOfStay = Math.ceil();
        (validated.discharge_date.getTime() - admission.admissionDate.getTime()) / (1000 * 60 * 60 * 24);
      );

      // Encrypt sensitive fields;
      const encryptedData = await this.encryptionService.encryptObject(validated, this.encryptedFields);

      // Create discharge record;
      const discharge = await this.prisma.discharge.create({
        validated.admission_id,
          validated.discharge_time,
          validated.discharge_disposition,
          validated.secondary_diagnoses ?;
            JSON.stringify(validated.secondary_diagnoses) : null,
          proceduresPerformed: validated.procedures_performed ?;
            JSON.stringify(validated.procedures_performed) : null,
          dischargeInstructions: encryptedData.discharge_instructions,
          medicationsOnDischarge: validated.medications_on_discharge ?;
            JSON.stringify(await this.encryptionService.encryptObject(validated.medications_on_discharge, this.encryptedFields)) : null,
          followUpAppointments: validated.follow_up_appointments ?;
            JSON.stringify(await this.encryptionService.encryptObject(validated.follow_up_appointments, this.encryptedFields)) : null,
          functionalStatusOnAdmission: encryptedData.functional_status_on_admission,
          validated.readmission_risk,
          encryptedData.discharge_summary,
          lengthOfStay,
          validated.discharged_by;

      });

      // Update admission status;
      await this.prisma.admission.update({id: validated.admission_id ,
        data: admissionStatus: "discharged" ;
      });

      // Free up the bed;
      await this.updateBedStatus(admission.wardId, admission.bedNumber, "available");

      return {
        ...validated,
        id: discharge.id,
        length_of_stay: lengthOfStay;
      };
    } catch (error) {
      throw new Error(`Failed to discharge patient: ${}`;

  // Transfer Operations;
  async transferPatient(data: Transfer): Promise<Transfer & { id: string }> {
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

      const validated = TransferSchema.parse(data);

      // Check if destination bed is available;
      const bedAvailable = await this.checkBedAvailability(validated.to_ward_id, validated.to_bed);
      if (!session.user) {
        throw new Error(`Destination bed ${validated.to_bed} in ward ${validated.to_ward_id} is not available`);

      // Encrypt sensitive fields;
      const encryptedData = await this.encryptionService.encryptObject(validated, this.encryptedFields);

      // Create transfer record;
      const transfer = await this.prisma.transfer.create({
        validated.admission_id,
          validated.transfer_time,
          validated.from_ward_id,
          validated.from_bed,
          validated.to_room,
          encryptedData.reason_for_transfer,
          validated.transfer_diagnosis,
          validated.receiving_doctor,
          validated.external_facility_address,
          encryptedData.transfer_notes,
          equipmentTransferred: validated.equipment_transferred ?;
            JSON.stringify(validated.equipment_transferred) : null,
          medicationsDuringTransfer: validated.medications_during_transfer,
          validated.approved_by,
          transferStatus: validated.transfer_status;

      });

      // If transfer is completed, update bed statuses and admission record;
      if (!session.user) {
        await this.completeBedTransfer(validated);

      return {
        ...validated,
        id: transfer.id;
      };
    } catch (error) {
      throw new Error(`Failed to transfer patient: ${}`;

  private async completeBedTransfer(transfer: Transfer): Promise<void> {
    // Free up the old bed;
    await this.updateBedStatus(transfer.from_ward_id, transfer.from_bed, "available");

    // Occupy the new bed;
    await this.updateBedStatus(transfer.to_ward_id, transfer.to_bed, "occupied", transfer.admission_id);

    // Update admission record with new location;
    await this.prisma.admission.update({
      where: { id: transfer.admission_id },
      transfer.to_ward_id,
        transfer.to_bed;

    });

  // Bed Management Operations;
  async getBedAvailability(wardId?: string): Promise<BedAvailability[]> {
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

      const where = wardId ? { id: wardId } : {}

      const wards = await this.prisma.ward.findMany({
        where,
        true;

      });

      return wards.map(ward => {
        const totalBeds = ward.beds.length;
        const availableBeds = ward.beds.filter(bed => bed.bedStatus === "available");
        const occupiedBeds = ward.beds.filter(bed => bed.bedStatus === "occupied");
        const maintenanceBeds = ward.beds.filter(bed => bed.bedStatus === "maintenance");

        return {
          ward_id: ward.id,
          totalBeds,
          occupiedBeds.length,
          totalBeds > 0 ? (occupiedBeds.length / totalBeds) * 100 : 0,
          bed.bedNumber,
            bed.bedType,
            accommodation_class: bed.accommodationClass));
        };
      });
    } catch (error) {
      throw new Error(`Failed to get bed availability: ${}`;

  async reserveBed(wardId: string, bedNumber: string, patientId: string, reservedUntil: Date): Promise<void> {
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

      await this.prisma.bed.updateMany({
        where: {
          wardId,
          bedNumber,
          bedStatus: "available";
        },
        "reserved",
          reservedForPatient: patientId;
          reservedUntil});
    } catch (error) {
      throw new Error(`Failed to reserve bed: ${}`;

  private async checkBedAvailability(wardId: string, bedNumber: string): Promise<boolean> {
    const bed = await this.prisma.bed.findFirst({
      where: {
        wardId,
        bedNumber,
        bedStatus: "available";

    });
    return !!bed;

  private async updateBedStatus();
    wardId: string,
    "available" | "occupied" | "maintenance" | "cleaning" | "reserved";
    occupiedByAdmissionId?: string;
  ): Promise<void> {
    await this.prisma.bed.updateMany({
      where: { wardId, bedNumber },
      status,
        status === "available" ? null : undefined,
        reservedUntil: status === "available" ? null : undefined;

    });

  // Analytics and Reporting;
  async getIPDStatistics(dateRange?: { from: Date, to: Date }): Promise<IPDStatistics> {
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

      const whereClause = dateRange ? {
        dateRange.from,
          lte: dateRange.to;

      } : {};

      const [;
        totalAdmissions,
        activeAdmissions,
        discharges,
        totalBeds,
        availableBeds] = await Promise.all([;
        this.prisma.admission.count({ where: whereClause }),
        this.prisma.admission.count({
          where: { ...whereClause, admissionStatus: "active" }
        }),
        this.prisma.discharge.findMany({
          {
              gte: dateRange.from,
              lte: dateRange.to;

          } : {},
          select: { lengthOfStay: true }
        }),
        this.prisma.bed.count(),
        this.prisma.bed.count({ where: { bedStatus: "available" } })]);

      const averageLengthOfStay = discharges.length > 0 ?;
        discharges.reduce((sum, d) => sum + (d.lengthOfStay || 0), 0) / discharges.length : 0;

      const bedOccupancyRate = totalBeds > 0 ?;
        ((totalBeds - availableBeds) / totalBeds) * 100 : 0;

      return {
        total_admissions: totalAdmissions,
        Math.round(averageLengthOfStay * 100) / 100,
        availableBeds,
        0, // Would need complex query to calculate;
        mortality_rate: 0, // Would need complex query to calculate;

    } catch (error) {
      throw new Error(`Failed to get IPD statistics: ${}`;

  // Helper method for deserialization;
  private async deserializeAdmission(admission: unknown): Promise<Admission> {
    const decrypted = await this.encryptionService.decryptObject(admission, this.encryptedFields);

    return {
      patient_id: admission.patientId,
      admission.admissionTime,
      admission.admissionSource,
      decrypted.admittingDiagnosis,
      secondary_diagnoses: admission.secondaryDiagnoses ?;
        JSON.parse(admission.secondaryDiagnoses) : undefined,
      icd10_codes: admission.icd10Codes ?;
        JSON.parse(admission.icd10Codes) : undefined,
      attending_doctor_id: admission.attendingDoctorId,
      admission.consultingDoctors ?;
        JSON.parse(admission.consultingDoctors) : undefined,
      ward_id: admission.wardId,
      admission.bedNumber,
      admission.insuranceDetails ?;
        JSON.parse(admission.insuranceDetails) : undefined,
      emergency_contact: JSON.parse(decrypted.emergencyContact),
      admission.estimatedLengthOfStay,
      admission.isolationRequired,
      admission.admittedBy,
      admission_status: admission.admissionStatus;
    };

  // Cleanup;
  async disconnect(): Promise<void> {
    await this.prisma.$disconnect();

// Export singleton instance;
let ipdServiceInstance: IPDManagementService | null = null;

export const getIPDService = (prismaClient?: PrismaClient): IPDManagementService => {
  if (!session.user) {
    ipdServiceInstance = new IPDManagementService(prismaClient);

  return ipdServiceInstance;
};

// Legacy compatibility - replace placeholder functions;
export const _getAdmissionsFromDB = async (filters?: unknown): Promise<Admission[]> => {
  const service = getIPDService();
  return service.getAdmissions(filters);
};

export const _createAdmissionInDB = async (admission: Admission): Promise<Admission & { id: string }> => {
  const service = getIPDService();
  return service.createAdmission(admission);
};

export const _updateAdmissionInDB = async (id: string, updates: Partial<Admission>): Promise<Admission> => {
  const service = getIPDService();
  return service.updateAdmission(id, updates);
};

export const _dischargePatientFromDB = async (discharge: Discharge): Promise<Discharge & { id: string }> => {
  const service = getIPDService();
  return service.dischargePatient(discharge);
};

export const _getBedAvailabilityFromDB = async (wardId?: string): Promise<BedAvailability[]> => {
  const service = getIPDService();
  return service.getBedAvailability(wardId);
};
