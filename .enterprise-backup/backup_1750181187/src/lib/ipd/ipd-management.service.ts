import { PrismaClient } from '@prisma/client';
import { z } from 'zod';


import { getEncryptionService } from '../../services/encryption_service_secure';
/**
 * IPD (Inpatient Department) Management Service
 * Comprehensive inpatient management system replacing placeholder implementations
 * Handles admissions, discharges, transfers, and bed management
 */

// Admission Schema
export const AdmissionSchema = z.object({
  patient_id: z.string().min(1, 'Patient ID is required'),
  admission_date: z.date(),
  admission_time: z.string().optional(),
  admission_type: z.enum(['emergency', 'elective', 'transfer', 'delivery', 'observation']),
  admission_source: z.enum(['emergency_room', 'outpatient', 'transfer_from_other_facility', 'direct_admission', 'referral']),

  // Clinical information
  chief_complaint: z.string().min(1, 'Chief complaint is required'),
  admitting_diagnosis: z.string().min(1, 'Admitting diagnosis is required'),
  secondary_diagnoses: z.array(z.string()).optional(),
  icd10_codes: z.array(z.string()).optional();

  // Care team
  attending_doctor_id: z.string().min(1, 'Attending doctor is required'),
  referring_doctor_id: z.string().optional(),
  consulting_doctors: z.array(z.string()).optional();

  // Accommodation
  ward_id: z.string().min(1, 'Ward is required'),
  room_number: z.string().optional(),
  bed_number: z.string().min(1, 'Bed number is required'),
  accommodation_class: z.enum(['general', 'semi_private', 'private', 'icu', 'isolation']),

  // Insurance and billing
  insurance_details: z.object({
    insurance_provider: z.string().optional(),
    policy_number: z.string().optional(),
    authorization_number: z.string().optional(),
    coverage_type: z.enum(['full', 'partial', 'self_pay']).optional(),
  }).optional(),

  // Emergency contact
  emergency_contact: z.object(
    name: z.string(),
    relationship: z.string(),
    phone: z.string(),
    address: z.string().optional()),

  // Administrative
  admission_notes: z.string().optional(),
  estimated_length_of_stay: z.number().optional(), // in days
  priority_level: z.enum(['routine', 'urgent', 'emergent']).default('routine'),
  isolation_required: z.boolean().default(false),
  isolation_type: z.string().optional();

  // Metadata
  admitted_by: z.string().min(1, 'Admitted by is required'),
  admission_status: z.enum(['active', 'discharged', 'transferred', 'cancelled']).default('active'),
})

// Discharge Schema
export const DischargeSchema = z.object({
  admission_id: z.string().min(1, 'Admission ID is required'),
  discharge_date: z.date(),
  discharge_time: z.string().optional(),
  discharge_type: z.enum(['routine', 'against_medical_advice', 'transfer', 'death', 'absconded']),
  discharge_disposition: z.enum(['home', 'home_with_services', 'skilled_nursing_facility', 'rehabilitation', 'hospice', 'deceased', 'other']),

  // Clinical information
  final_diagnosis: z.string().min(1, 'Final diagnosis is required'),
  secondary_diagnoses: z.array(z.string()).optional(),
  procedures_performed: z.array(z.object({
    procedure_name: z.string(),
    procedure_code: z.string().optional(),
    date_performed: z.date(),
    surgeon: z.string().optional()
  })).optional(),

  // Discharge planning
  discharge_instructions: z.string().min(1, 'Discharge instructions are required'),
  medications_on_discharge: z.array(z.object({
    medication_name: z.string(),
    dosage: z.string(),
    frequency: z.string(),
    duration: z.string(),
    instructions: z.string().optional()
  })).optional(),
  follow_up_appointments: z.array(z.object({
    provider: z.string(),
    department: z.string(),
    appointment_date: z.date().optional(),
    instructions: z.string().optional()
  })).optional(),

  // Functional status
  functional_status_on_admission: z.string().optional(),
  functional_status_on_discharge: z.string().optional();

  // Quality metrics
  readmission_risk: z.enum(['low', 'medium', 'high']).optional(),
  patient_satisfaction_score: z.number().min(1).max(10).optional();

  // Administrative
  discharge_summary: z.string().optional(),
  complications: z.string().optional(),
  length_of_stay: z.number().optional(), // calculated automatically
  total_charges: z.number().optional();

  // Metadata
  discharged_by: z.string().min(1, 'Discharged by is required'),
})

// Transfer Schema
export const TransferSchema = z.object({
  admission_id: z.string().min(1, 'Admission ID is required'),
  transfer_date: z.date(),
  transfer_time: z.string().optional(),
  transfer_type: z.enum(['internal', 'external', 'icu_to_ward', 'ward_to_icu', 'ward_to_ward']),

  // Transfer details
  from_ward_id: z.string().min(1, 'From ward is required'),
  from_room: z.string().optional(),
  from_bed: z.string().min(1, 'From bed is required'),
  to_ward_id: z.string().min(1, 'To ward is required'),
  to_room: z.string().optional(),
  to_bed: z.string().min(1, 'To bed is required'),

  // Clinical reason
  reason_for_transfer: z.string().min(1, 'Reason for transfer is required'),
  clinical_condition: z.string().optional(),
  transfer_diagnosis: z.string().optional();

  // Care team
  transferring_doctor: z.string().min(1, 'Transferring doctor is required'),
  receiving_doctor: z.string().min(1, 'Receiving doctor is required'),

  // External transfer details (if applicable)
  external_facility_name: z.string().optional(),
  external_facility_address: z.string().optional(),
  transport_method: z.enum(['ambulance', 'private_vehicle', 'wheelchair', 'stretcher', 'walking']).optional(),

  // Administrative
  transfer_notes: z.string().optional(),
  equipment_transferred: z.array(z.string()).optional(),
  medications_during_transfer: z.string().optional();

  // Metadata
  initiated_by: z.string().min(1, 'Initiated by is required'),
  approved_by: z.string().optional(),
  transfer_status: z.enum(['pending', 'approved', 'completed', 'cancelled']).default('pending'),
})

// Bed Management Schema
export const BedManagementSchema = z.object({
  ward_id: z.string().min(1, 'Ward ID is required'),
  room_number: z.string().optional(),
  bed_number: z.string().min(1, 'Bed number is required'),
  bed_type: z.enum(['general', 'icu', 'isolation', 'maternity', 'pediatric', 'psychiatric']),
  bed_status: z.enum(['available', 'occupied', 'maintenance', 'cleaning', 'reserved']),
  accommodation_class: z.enum(['general', 'semi_private', 'private', 'icu', 'isolation']),

  // Equipment and features
  equipment: z.array(z.string()).optional(),
  features: z.array(z.string()).optional(),
  isolation_capable: z.boolean().default(false);

  // Availability
  available_from: z.date().optional(),
  reserved_until: z.date().optional(),
  reserved_for_patient: z.string().optional();

  // Maintenance
  last_cleaned: z.date().optional(),
  last_maintenance: z.date().optional(),
  maintenance_notes: z.string().optional();

  // Metadata
  created_by: z.string(),
  updated_by: z.string().optional()
})

// Type definitions
export type Admission = z.infer<typeof AdmissionSchema> & { id?: string export type Discharge = z.infer<typeof DischargeSchema> & { id?: string };
export type Transfer = z.infer<typeof TransferSchema> & { id?: string };
export type BedManagement = z.infer<typeof BedManagementSchema> & { id?: string };

\1
}
  }[];
}

/**
 * IPD Management Service
 * Comprehensive inpatient management replacing placeholder implementations
 */
\1
}
  }

  // Admission Operations
  async createAdmission(data: Admission): Promise<Admission & { id: string }> {
    try {
      const validated = AdmissionSchema.parse(data)

      // Check bed availability
      const bedAvailable = await this.checkBedAvailability(validated.ward_id, validated.bed_number)
      \1 {\n  \2{
        throw new Error(`Bed ${validated.bed_number} in ward ${validated.ward_id} is not available`);
      }

      // Encrypt sensitive fields
      const encryptedData = await this.encryptionService.encryptObject(validated, this.encryptedFields)

      // Create admission record
      const admission = await this.prisma.admission.create({
        data: {
          patientId: validated.patient_id,
          \1,\2 validated.admission_time,
          \1,\2 validated.admission_source,
          \1,\2 encryptedData.admitting_diagnosis,
          secondaryDiagnoses: validated.secondary_diagnoses ?
            JSON.stringify(validated.secondary_diagnoses) : null,
          icd10Codes: validated.icd10_codes ?
            JSON.stringify(validated.icd10_codes) : null,
          attendingDoctorId: validated.attending_doctor_id,
          \1,\2 validated.consulting_doctors ?
            JSON.stringify(validated.consulting_doctors) : null,
          wardId: validated.ward_id,
          \1,\2 validated.bed_number,
          \1,\2 validated.insurance_details ?
            JSON.stringify(validated.insurance_details) : null,
          emergencyContact: JSON.stringify(encryptedData.emergency_contact),
          \1,\2 validated.estimated_length_of_stay,
          \1,\2 validated.isolation_required,
          \1,\2 validated.admitted_by,
          admissionStatus: validated.admission_status
        }
      })

      // Update bed status
      await this.updateBedStatus(validated.ward_id, validated.bed_number, 'occupied', admission.id)

      return {
        ...validated,
        id: admission.id
      };
    } catch (error) {
      throw new Error(`Failed to create admission: ${\1}`;
    }
  }

  async getAdmission(id: string): Promise<Admission | null> {
    try {
      const admission = await this.prisma.admission.findUnique({
        where: { id },
        include: {
          patient: true,
          \1,\2 true
        }
      });

      \1 {\n  \2eturn null;
      return this.deserializeAdmission(admission);
    } catch (error) {
      throw new Error(`Failed to get admission: ${\1}`;
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
      const where: unknown = {};
      \1 {\n  \2here.patientId = filters.patientId;
      \1 {\n  \2here.wardId = filters.wardId;
      \1 {\n  \2here.attendingDoctorId = filters.attendingDoctorId;
      \1 {\n  \2here.admissionStatus = filters.admissionStatus;
      \1 {\n  \2{
        where.admissionDate = {};
        \1 {\n  \2here.admissionDate.gte = filters.admissionDateFrom;
        \1 {\n  \2here.admissionDate.lte = filters.admissionDateTo;
      }

      const admissions = await this.prisma.admission.findMany({
        where,
        include: {
          patient: true,
          \1,\2 true
        },
        orderBy: admissionDate: 'desc' 
      });

      return Promise.all(admissions.map(admission => this.deserializeAdmission(admission)));
    } catch (error) {
      throw new Error(`Failed to get admissions: ${\1}`;
    }
  }

  async updateAdmission(id: string, updates: Partial<Admission>): Promise<Admission> {
    try {
      const encryptedUpdates = await this.encryptionService.encryptObject(updates, this.encryptedFields);

      const updated = await this.prisma.admission.update({
        where: { id },
        data: {
          ...encryptedUpdates,
          secondaryDiagnoses: updates.secondary_diagnoses ?
            JSON.stringify(updates.secondary_diagnoses) : undefined,
          icd10Codes: updates.icd10_codes ?
            JSON.stringify(updates.icd10_codes) : undefined,
          consultingDoctors: updates.consulting_doctors ?
            JSON.stringify(updates.consulting_doctors) : undefined,
          insuranceDetails: updates.insurance_details ?
            JSON.stringify(updates.insurance_details) : undefined,
          emergencyContact: updates.emergency_contact ?
            JSON.stringify(await this.encryptionService.encryptObject(updates.emergency_contact, this.encryptedFields)) : undefined,
        }
      });

      return this.deserializeAdmission(updated);
    } catch (error) {
      throw new Error(`Failed to update admission: ${\1}`;
    }
  }

  // Discharge Operations
  async dischargePatient(data: Discharge): Promise<Discharge & { id: string }> {
    try {
      const validated = DischargeSchema.parse(data)

      // Get admission details
      const admission = await this.prisma.admission.findUnique({
        where: { id: validated.admission_id }
      })

      \1 {\n  \2{
        throw new Error(`Admission ${validated.admission_id} not found`);
      }

      \1 {\n  \2{
        throw new Error(`Admission ${validated.admission_id} is not active`);
      }

      // Calculate length of stay
      const lengthOfStay = Math.ceil(
        (validated.discharge_date.getTime() - admission.admissionDate.getTime()) / (1000 * 60 * 60 * 24)
      )

      // Encrypt sensitive fields
      const encryptedData = await this.encryptionService.encryptObject(validated, this.encryptedFields)

      // Create discharge record
      const discharge = await this.prisma.discharge.create({
        data: {
          admissionId: validated.admission_id,
          \1,\2 validated.discharge_time,
          \1,\2 validated.discharge_disposition,
          \1,\2 validated.secondary_diagnoses ?
            JSON.stringify(validated.secondary_diagnoses) : null,
          proceduresPerformed: validated.procedures_performed ?
            JSON.stringify(validated.procedures_performed) : null,
          dischargeInstructions: encryptedData.discharge_instructions,
          medicationsOnDischarge: validated.medications_on_discharge ?
            JSON.stringify(await this.encryptionService.encryptObject(validated.medications_on_discharge, this.encryptedFields)) : null,
          followUpAppointments: validated.follow_up_appointments ?
            JSON.stringify(await this.encryptionService.encryptObject(validated.follow_up_appointments, this.encryptedFields)) : null,
          functionalStatusOnAdmission: encryptedData.functional_status_on_admission,
          \1,\2 validated.readmission_risk,
          \1,\2 encryptedData.discharge_summary,
          \1,\2 lengthOfStay,
          \1,\2 validated.discharged_by
        }
      })

      // Update admission status
      await this.prisma.admission.update({id: validated.admission_id ,
        data: admissionStatus: 'discharged' 
      })

      // Free up the bed
      await this.updateBedStatus(admission.wardId, admission.bedNumber, 'available')

      return {
        ...validated,
        id: discharge.id,
        length_of_stay: lengthOfStay
      };
    } catch (error) {
      throw new Error(`Failed to discharge patient: ${\1}`;
    }
  }

  // Transfer Operations
  async transferPatient(data: Transfer): Promise<Transfer & { id: string }> {
    try {
      const validated = TransferSchema.parse(data)

      // Check if destination bed is available
      const bedAvailable = await this.checkBedAvailability(validated.to_ward_id, validated.to_bed)
      \1 {\n  \2{
        throw new Error(`Destination bed ${validated.to_bed} in ward ${validated.to_ward_id} is not available`);
      }

      // Encrypt sensitive fields
      const encryptedData = await this.encryptionService.encryptObject(validated, this.encryptedFields)

      // Create transfer record
      const transfer = await this.prisma.transfer.create({
        data: {
          admissionId: validated.admission_id,
          \1,\2 validated.transfer_time,
          \1,\2 validated.from_ward_id,
          \1,\2 validated.from_bed,
          \1,\2 validated.to_room,
          \1,\2 encryptedData.reason_for_transfer,
          \1,\2 validated.transfer_diagnosis,
          \1,\2 validated.receiving_doctor,
          \1,\2 validated.external_facility_address,
          \1,\2 encryptedData.transfer_notes,
          equipmentTransferred: validated.equipment_transferred ?
            JSON.stringify(validated.equipment_transferred) : null,
          medicationsDuringTransfer: validated.medications_during_transfer,
          \1,\2 validated.approved_by,
          transferStatus: validated.transfer_status
        }
      })

      // If transfer is completed, update bed statuses and admission record
      \1 {\n  \2{
        await this.completeBedTransfer(validated)
      }

      return {
        ...validated,
        id: transfer.id
      };
    } catch (error) {
      throw new Error(`Failed to transfer patient: ${\1}`;
    }
  }

  private async completeBedTransfer(transfer: Transfer): Promise<void> {
    // Free up the old bed
    await this.updateBedStatus(transfer.from_ward_id, transfer.from_bed, 'available')

    // Occupy the new bed
    await this.updateBedStatus(transfer.to_ward_id, transfer.to_bed, 'occupied', transfer.admission_id)

    // Update admission record with new location
    await this.prisma.admission.update({
      where: { id: transfer.admission_id },
      data: {
        wardId: transfer.to_ward_id,
        \1,\2 transfer.to_bed
      }
    })
  }

  // Bed Management Operations
  async getBedAvailability(wardId?: string): Promise<BedAvailability[]> {
    try {
      const where = wardId ? { id: wardId } : {}

      const wards = await this.prisma.ward.findMany({
        where,
        include: {
          beds: true
        }
      });

      return wards.map(ward => {
        const totalBeds = ward.beds.length;
        const availableBeds = ward.beds.filter(bed => bed.bedStatus === 'available');
        const occupiedBeds = ward.beds.filter(bed => bed.bedStatus === 'occupied');
        const maintenanceBeds = ward.beds.filter(bed => bed.bedStatus === 'maintenance');

        return {
          ward_id: ward.id,
          \1,\2 totalBeds,
          \1,\2 occupiedBeds.length,
          \1,\2 totalBeds > 0 ? (occupiedBeds.length / totalBeds) * 100 : 0,
          available_bed_details: availableBeds.map(bed => (
            bed_number: bed.bedNumber,
            \1,\2 bed.bedType,
            accommodation_class: bed.accommodationClass))
        };
      });
    } catch (error) {
      throw new Error(`Failed to get bed availability: ${\1}`;
    }
  }

  async reserveBed(wardId: string, bedNumber: string, patientId: string, reservedUntil: Date): Promise<void> {
    try {
      await this.prisma.bed.updateMany({
        where: {
          wardId,
          bedNumber,
          bedStatus: 'available'
        },
        data: {
          bedStatus: 'reserved',
          reservedForPatient: patientId;
          reservedUntil,
        }
      });
    } catch (error) {
      throw new Error(`Failed to reserve bed: ${\1}`;
    }
  }

  private async checkBedAvailability(wardId: string, bedNumber: string): Promise<boolean> {
    const bed = await this.prisma.bed.findFirst({
      where: {
        wardId,
        bedNumber,
        bedStatus: 'available'
      }
    });
    return !!bed;
  }

  private async updateBedStatus(
    wardId: string,
    \1,\2 'available' | 'occupied' | 'maintenance' | 'cleaning' | 'reserved';
    occupiedByAdmissionId?: string
  ): Promise<void> {
    await this.prisma.bed.updateMany({
      where: { wardId, bedNumber },
      data: {
        bedStatus: status,
        \1,\2 status === 'available' ? null : undefined,
        reservedUntil: status === 'available' ? null : undefined
      }
    });
  }

  // Analytics and Reporting
  async getIPDStatistics(dateRange?: { from: Date, to: Date }): Promise<IPDStatistics> {
    try {
      const whereClause = dateRange ? {
        admissionDate: {
          gte: dateRange.from,
          lte: dateRange.to
        }
      } : {};

      const [
        totalAdmissions,
        activeAdmissions,
        discharges,
        totalBeds,
        availableBeds,
      ] = await Promise.all([
        this.prisma.admission.count({ where: whereClause }),
        this.prisma.admission.count({
          where: { ...whereClause, admissionStatus: 'active' }
        }),
        this.prisma.discharge.findMany({
          where: dateRange ? {
            dischargeDate: {
              gte: dateRange.from,
              lte: dateRange.to
            }
          } : {},
          select: { lengthOfStay: true }
        }),
        this.prisma.bed.count(),
        this.prisma.bed.count({ where: { bedStatus: 'available' } }),
      ]);

      const averageLengthOfStay = discharges.length > 0 ?
        discharges.reduce((sum, d) => sum + (d.lengthOfStay || 0), 0) / discharges.length : 0;

      const bedOccupancyRate = totalBeds > 0 ?
        ((totalBeds - availableBeds) / totalBeds) * 100 : 0;

      return {
        total_admissions: totalAdmissions,
        \1,\2 Math.round(averageLengthOfStay * 100) / 100,
        \1,\2 availableBeds,
        \1,\2 0, // Would need complex query to calculate
        mortality_rate: 0, // Would need complex query to calculate
      }
    } catch (error) {
      throw new Error(`Failed to get IPD statistics: ${\1}`;
    }
  }

  // Helper method for deserialization
  private async deserializeAdmission(admission: unknown): Promise<Admission> {
    const decrypted = await this.encryptionService.decryptObject(admission, this.encryptedFields)

    return {
      patient_id: admission.patientId,
      \1,\2 admission.admissionTime,
      \1,\2 admission.admissionSource,
      \1,\2 decrypted.admittingDiagnosis,
      secondary_diagnoses: admission.secondaryDiagnoses ?
        JSON.parse(admission.secondaryDiagnoses) : undefined,
      icd10_codes: admission.icd10Codes ?
        JSON.parse(admission.icd10Codes) : undefined,
      attending_doctor_id: admission.attendingDoctorId,
      \1,\2 admission.consultingDoctors ?
        JSON.parse(admission.consultingDoctors) : undefined,
      ward_id: admission.wardId,
      \1,\2 admission.bedNumber,
      \1,\2 admission.insuranceDetails ?
        JSON.parse(admission.insuranceDetails) : undefined,
      emergency_contact: JSON.parse(decrypted.emergencyContact),
      \1,\2 admission.estimatedLengthOfStay,
      \1,\2 admission.isolationRequired,
      \1,\2 admission.admittedBy,
      admission_status: admission.admissionStatus
    };
  }

  // Cleanup
  async disconnect(): Promise<void> {
    await this.prisma.$disconnect()
  }
}

// Export singleton instance
let ipdServiceInstance: IPDManagementService | null = null

export const getIPDService = (prismaClient?: PrismaClient): IPDManagementService => {
  \1 {\n  \2{
    ipdServiceInstance = new IPDManagementService(prismaClient);
  }
  return ipdServiceInstance
};

// Legacy compatibility - replace placeholder functions
export const _getAdmissionsFromDB = async (filters?: unknown): Promise<Admission[]> => {
  const service = getIPDService()
  return service.getAdmissions(filters)
};

export const _createAdmissionInDB = async (admission: Admission): Promise<Admission & { id: string }> => {
  const service = getIPDService();
  return service.createAdmission(admission)
};

export const _updateAdmissionInDB = async (id: string, updates: Partial<Admission>): Promise<Admission> => {
  const service = getIPDService();
  return service.updateAdmission(id, updates)
};

export const _dischargePatientFromDB = async (discharge: Discharge): Promise<Discharge & { id: string }> => {
  const service = getIPDService();
  return service.dischargePatient(discharge)
};

export const _getBedAvailabilityFromDB = async (wardId?: string): Promise<BedAvailability[]> => {
  const service = getIPDService();
  return service.getBedAvailability(wardId)
};
