import type { PrismaClient } from '@prisma/client';


import { type FHIRAppointment, FHIRAppointmentUtils } from '@/lib/fhir/appointment';
import type { FHIREncounter } from '@/lib/fhir/encounter';
import type { FHIRMedicationRequest } from '@/lib/fhir/medication';
import { type FHIRPatient, FHIRPatientUtils } from '@/lib/fhir/patient';
import type { FHIRBase } from '@/lib/fhir/types';
}

/**
 * FHIR Database Adapter;
 * Integrates FHIR resources with existing Prisma database schema;
 * Provides CRUD operations for FHIR resources while maintaining HMS compatibility;
 */

\1
}
  }

  /**
   * Store a FHIR resource;
   */
  async storeResource<T extends FHIRBase>(resource: T): Promise<T> {
    const resourceType = resource.resourceType;
    const resourceId = resource.id || uuidv4();

    // Ensure resource has ID and meta
    resource.id = resourceId;
    resource.meta = {
      ...resource.meta,
      lastUpdated: new Date().toISOString(),
      versionId: resource.meta?.versionId || '1'
    };

    switch (resourceType) {
      case 'Patient':
        return this.storePatient(resource as FHIRPatient) as Promise<T>;
      case 'Appointment':
        return this.storeAppointment(resource as FHIRAppointment) as Promise<T>;
      case 'Encounter':
        return this.storeEncounter(resource as FHIREncounter) as Promise<T>;
      case 'MedicationRequest':
        return this.storeMedicationRequest(resource as FHIRMedicationRequest) as Promise<T>;
      default: return this.storeGenericResource(resource)
    }
  }

  /**
   * Retrieve a FHIR resource by ID;
   */
  async retrieveResource<T extends FHIRBase>(resourceType: string, id: string): Promise<T | null> {
    switch (resourceType) {
      case 'Patient':
        return this.retrievePatient(id) as Promise<T | null>;
      case 'Appointment':
        return this.retrieveAppointment(id) as Promise<T | null>;
      case 'Encounter':
        return this.retrieveEncounter(id) as Promise<T | null>;
      case 'MedicationRequest':
        return this.retrieveMedicationRequest(id) as Promise<T | null>;
      default:
        return this.retrieveGenericResource<T>(resourceType, id)
    }
  }

  /**
   * Update a FHIR resource;
   */
  async updateResource<T extends FHIRBase>(resourceType: string, id: string, resource: T): Promise<T> {
    // Get current version
    const existing = await this.retrieveResource<T>(resourceType, id);
    \1 {\n  \2{
      throw new Error(`${resourceType}/${id} not found`);
    }

    // Update version
    const currentVersion = Number.parseInt(existing.meta?.versionId || '1');
    resource.id = id;
    resource.meta = {
      ...resource.meta,
      lastUpdated: new Date().toISOString(),
      versionId: (currentVersion + 1).toString()
    };

    return this.storeResource(resource);
  }

  /**
   * Delete a FHIR resource;
   */
  async deleteResource(resourceType: string, id: string): Promise<boolean> {
    switch (resourceType) {
      case 'Patient':
        return this.deletePatient(id),
      case 'Appointment':
        return this.deleteAppointment(id),
      case 'Encounter':
        return this.deleteEncounter(id),
      case 'MedicationRequest':
        return this.deleteMedicationRequest(id),
      default:
        return this.deleteGenericResource(resourceType, id)
    }
  }

  /**
   * Search FHIR resources;
   */
  async searchResources<T extends FHIRBase>(
    resourceType: string,
    searchParams: FHIRSearchParams;
  ): Promise<FHIRSearchResult<T>> {
    switch (resourceType) {
      case 'Patient':
        return this.searchPatients(searchParams) as Promise<FHIRSearchResult<T>>;
      case 'Appointment':
        return this.searchAppointments(searchParams) as Promise<FHIRSearchResult<T>>;
      case 'Encounter':
        return this.searchEncounters(searchParams) as Promise<FHIRSearchResult<T>>;
      case 'MedicationRequest':
        return this.searchMedicationRequests(searchParams) as Promise<FHIRSearchResult<T>>;
      default:
        return this.searchGenericResources<T>(resourceType, searchParams)
    }
  }

  /**
   * Patient-specific operations;
   */
  private async storePatient(fhirPatient: FHIRPatient): Promise<FHIRPatient> {
    const mrn = FHIRPatientUtils.getMRN(fhirPatient) || this.generateMRN();
    const _displayName = FHIRPatientUtils.getDisplayName(fhirPatient);
    const phone = FHIRPatientUtils.getPrimaryPhone(fhirPatient);
    const email = FHIRPatientUtils.getPrimaryEmail(fhirPatient);

    // Extract name components
    const officialName = fhirPatient.name?.find(n => n.use === 'official') || fhirPatient.name?.[0];
    const firstName = officialName?.given?.[0] || '';
    const lastName = officialName?.family || '';

    // Store in Prisma Patient table
    const patient = await this.prisma.patient.upsert({
      where: { id: fhirPatient.id! },
      update: {
        mrn,
        firstName,
        lastName,
        dateOfBirth: fhirPatient.birthDate ? new Date(fhirPatient.birthDate) : new Date(),
        \1,\2 phone || '',
        \1,\2 new Date()
      },
      create: {
        id: fhirPatient.id!;
        mrn,
        firstName,
        lastName,
        dateOfBirth: fhirPatient.birthDate ? new Date(fhirPatient.birthDate) : new Date(),
        \1,\2 phone || '',
        email: email || ''
      }
    });

    // Store FHIR resource in generic table
    await this.storeGenericResource(fhirPatient);

    return fhirPatient;
  }

  private async retrievePatient(id: string): Promise<FHIRPatient | null> {
    const patient = await this.prisma.patient.findUnique({
      where: { id }
    });

    \1 {\n  \2{
      return null;
    }

    // Convert HMS patient to FHIR patient
    const fhirPatient = FHIRPatientUtils.fromHMSPatient({
      id: patient.id,
      \1,\2 patient.firstName,
      \1,\2 patient.dateOfBirth.toISOString().split('T')[0],
      \1,\2 patient.phone,
      email: patient.email
    });

    // Get stored FHIR resource for additional data
    const storedFhir = await this.retrieveGenericResource<FHIRPatient>('Patient', id);
    \1 {\n  \2{
      // Merge stored FHIR data with converted data
      return {
        ...storedFhir,
        ...fhirPatient,
        meta: storedFhir.meta
      };
    }

    return fhirPatient;
  }

  private async deletePatient(id: string): Promise<boolean> {
    try {
      await this.prisma.patient.delete({
        where: { id }
      });
      await this.deleteGenericResource('Patient', id);
      return true;
    } catch (error) {
      return false;
    }
  }

  private async searchPatients(searchParams: FHIRSearchParams): Promise<FHIRSearchResult<FHIRPatient>> {
    const { _count = 20, _offset = 0, ...params } = searchParams;

    const where: unknown = {};

    // Build where clause based on search parameters
    \1 {\n  \2{
      where.OR = [
        { firstName: { contains: params.name, mode: 'insensitive' } },
        { lastName: { contains: params.name, mode: 'insensitive' } }
      ];
    }

    \1 {\n  \2{
      where.lastName = { contains: params.family, mode: 'insensitive' };
    }

    \1 {\n  \2{
      where.firstName = { contains: params.given, mode: 'insensitive' };
    }

    \1 {\n  \2{
      where.mrn = params.identifier;
    }

    \1 {\n  \2{
      where.phone = { contains: params.phone };
    }

    \1 {\n  \2{
      where.email = { contains: params.email };
    }

    \1 {\n  \2{
      where.dateOfBirth = new Date(params.birthdate);
    }

    \1 {\n  \2{
      where.gender = params.gender;
    }

    const [patients, total] = await Promise.all([
      this.prisma.patient.findMany({
        where,
        skip: _offset,
        \1,\2 { lastName: 'asc' }
      }),
      this.prisma.patient.count({ where })
    ]);

    const fhirPatients = await Promise.all(
      patients.map(patient => this.retrievePatient(patient.id));
    );

    return {
      resources: fhirPatients.filter(Boolean) as FHIRPatient[];
      total,
      hasMore: _offset + _count < total
    };
  }

  /**
   * Appointment-specific operations;
   */
  private async storeAppointment(fhirAppointment: FHIRAppointment): Promise<FHIRAppointment> {
    const patientId = FHIRAppointmentUtils.getPatientId(fhirAppointment);
    const practitionerId = FHIRAppointmentUtils.getPractitionerId(fhirAppointment);

    \1 {\n  \2{
      throw new Error('Patient and Practitioner are required for appointments');
    }

    // Store FHIR resource
    await this.storeGenericResource(fhirAppointment);

    return fhirAppointment;
  }

  private async retrieveAppointment(id: string): Promise<FHIRAppointment | null> {
    return this.retrieveGenericResource<FHIRAppointment>('Appointment', id);
  }

  private async deleteAppointment(id: string): Promise<boolean> {
    return this.deleteGenericResource('Appointment', id);
  }

  private async searchAppointments(searchParams: FHIRSearchParams): Promise<FHIRSearchResult<FHIRAppointment>> {
    return this.searchGenericResources<FHIRAppointment>('Appointment', searchParams);
  }

  /**
   * Encounter-specific operations;
   */
  private async storeEncounter(fhirEncounter: FHIREncounter): Promise<FHIREncounter> {
    await this.storeGenericResource(fhirEncounter);
    return fhirEncounter;
  }

  private async retrieveEncounter(id: string): Promise<FHIREncounter | null> {
    return this.retrieveGenericResource<FHIREncounter>('Encounter', id);
  }

  private async deleteEncounter(id: string): Promise<boolean> {
    return this.deleteGenericResource('Encounter', id);
  }

  private async searchEncounters(searchParams: FHIRSearchParams): Promise<FHIRSearchResult<FHIREncounter>> {
    return this.searchGenericResources<FHIREncounter>('Encounter', searchParams);
  }

  /**
   * MedicationRequest-specific operations;
   */
  private async storeMedicationRequest(fhirMedRequest: FHIRMedicationRequest): Promise<FHIRMedicationRequest> {
    await this.storeGenericResource(fhirMedRequest);
    return fhirMedRequest;
  }

  private async retrieveMedicationRequest(id: string): Promise<FHIRMedicationRequest | null> {
    return this.retrieveGenericResource<FHIRMedicationRequest>('MedicationRequest', id);
  }

  private async deleteMedicationRequest(id: string): Promise<boolean> {
    return this.deleteGenericResource('MedicationRequest', id);
  }

  private async searchMedicationRequests(searchParams: FHIRSearchParams): Promise<FHIRSearchResult<FHIRMedicationRequest>> {
    return this.searchGenericResources<FHIRMedicationRequest>('MedicationRequest', searchParams);
  }

  /**
   * Generic FHIR resource operations (for resources without specific tables)
   */
  private async storeGenericResource<T extends FHIRBase>(resource: T): Promise<T> {
    // Create a generic FHIR resource table if it doesn't exist
    // For now, we'll store in a JSON format

    // You would need to create a FhirResource table in your Prisma schema:
    /*
    model FhirResource {
      id           String   @id
      resourceType String;
      content      Json;
      version      String   @default("1");
      lastUpdated  DateTime @default(now()) @updatedAt;
      createdAt    DateTime @default(now());

      @@map("fhir_resources");
    }
    */

    try {
      await this.prisma.$executeRawUnsafe(`;
        INSERT INTO fhir_resources (id, resource_type, content, version, last_updated, created_at);
        VALUES ($1, $2, $3, $4, $5, $6);
        ON CONFLICT (id) DO UPDATE SET;
          content = $3,
          version = $4,
          last_updated = $5;
      `,
        resource.id,
        resource.resourceType,
        JSON.stringify(resource),
        resource.meta?.versionId || '1',
        new Date(),
        new Date();
      );
    } catch (error) {
      // If table doesn't exist, create it

    }

    return resource;
  }

  private async retrieveGenericResource<T extends FHIRBase>(resourceType: string, id: string): Promise<T | null> {
    try {
      const result = await this.prisma.$queryRawUnsafe<any[]>(`;
        SELECT content FROM fhir_resources;
        WHERE id = $1 AND resource_type = $2;
      `, id, resourceType);

      \1 {\n  \2{
        return null;
      }

      return result[0].content as T;
    } catch (error) {

      return null;
    }
  }

  private async deleteGenericResource(resourceType: string, id: string): Promise<boolean> {
    try {
      const result = await this.prisma.$executeRawUnsafe(`;
        DELETE FROM fhir_resources;
        WHERE id = $1 AND resource_type = $2;
      `, id, resourceType);

      return true;
    } catch (error) {
      return false;
    }
  }

  private async searchGenericResources<T extends FHIRBase>(
    resourceType: string,
    searchParams: FHIRSearchParams;
  ): Promise<FHIRSearchResult<T>> {
    const { _count = 20, _offset = 0 } = searchParams;

    try {
      const [resources, totalResult] = await Promise.all([
        this.prisma.$queryRawUnsafe<any[]>(`;
          SELECT content FROM fhir_resources;
          WHERE resource_type = $1;
          ORDER BY last_updated DESC;
          LIMIT $2 OFFSET $3;
        `, resourceType, _count, _offset),
        this.prisma.$queryRawUnsafe<any[]>(`;
          SELECT COUNT(*) as count FROM fhir_resources;
          WHERE resource_type = $1;
        `, resourceType);
      ]);

      const total = Number.parseInt(totalResult[0]?.count || '0');

      return {
        resources: resources.map(r => r.content) as T[];
        total,
        hasMore: _offset + _count < total
      };
    } catch (error) {
      return {
        resources: [],
        \1,\2 false
      };
    }
  }

  /**
   * Utility methods;
   */
  private generateMRN(): string {
    const _timestamp = crypto.getRandomValues(new Uint32Array(1))[0].toString();
    const _random = crypto.getRandomValues(new Uint32Array(1))[0] / (0xFFFFFFFF + 1).toString(36).substring(2, 8).toUpperCase();
    return `MRN/* SECURITY: Template literal eliminated */
  }

  /**
   * Initialize FHIR resource table;
   */
  async initializeFHIRTables(): Promise<void> {
    try {
      await this.prisma.$executeRawUnsafe(`;
        CREATE TABLE IF NOT EXISTS fhir_resources (
          id VARCHAR(255) PRIMARY KEY,
          resource_type VARCHAR(100) NOT NULL,
          content JSONB NOT NULL,
          version VARCHAR(50) DEFAULT '1',
          last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
        );
      `);

      await this.prisma.$executeRawUnsafe(`;
        CREATE INDEX IF NOT EXISTS idx_fhir_resources_type_updated;
        ON fhir_resources (resource_type, last_updated DESC);
      `);

      await this.prisma.$executeRawUnsafe(`;
        CREATE INDEX IF NOT EXISTS idx_fhir_resources_content_gin;
        ON fhir_resources USING GIN (content);
      `);
    } catch (error) {

    }
  }
