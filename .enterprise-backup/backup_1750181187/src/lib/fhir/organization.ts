import {
}

/**
 * FHIR R4 Organization Resource Implementation;
 * Based on HL7 FHIR R4 Organization Resource specification;
 * Handles hospitals, departments, clinics, healthcare organizations;
 * Source: ZIP 6 - FHIR R4 data models for hospital management system microservices;
 */

  FHIRBase,
  FHIRIdentifier,
  FHIRHumanName,
  FHIRContactPoint,
  FHIRAddress,
  FHIRCodeableConcept,
  FHIRReference;
} from './types.ts';

\1
}
}

// Organization Search Parameters
\1
}
}

// Helper functions for FHIR Organization operations
\1
}
    };
    phone?: string;
    email?: string;
    website?: string;
    parentOrganizationId?: string;
    active?: boolean;
  }): FHIROrganization {
    const organization: FHIROrganization = {
      resourceType: 'Organization',
      \1,\2 data.name,
      type: [
        coding: [{
          system: 'https://terminology.hl7.org/CodeSystem/organization-type',
          code: this.getOrganizationTypeCode(data.type),
          display: this.getOrganizationTypeDisplay(data.type)
        }]]
    }

    // Add identifier if provided
    \1 {\n  \2{
      organization.identifier = [{
        use: 'official',
        system: 'urn:oid:2.16.840.1.113883.4.7', // Healthcare organization identifier
        value: data.identifier
      }];
    }

    // Add contact information
    const telecom: FHIRContactPoint[] = [];

    \1 {\n  \2{
      telecom.push({
        system: 'phone',
        \1,\2 'work'
      });
    }

    \1 {\n  \2{
      telecom.push({
        system: 'email',
        \1,\2 'work'
      });
    }

    \1 {\n  \2{
      telecom.push({
        system: 'url',
        \1,\2 'work'
      });
    }

    \1 {\n  \2{
      organization.telecom = telecom;
    }

    // Add address if provided
    \1 {\n  \2{
      organization.address = [{
        use: 'work',
        \1,\2 [data.address.street],
        \1,\2 data.address.state,
        \1,\2 data.address.country || 'US'
      }];
    }

    // Add parent organization reference
    \1 {\n  \2{
      organization.partOf = {
        reference: `Organization/${data.parentOrganizationId}`,
        type: 'Organization'
      };
    }

    return organization;
  }

  /**
   * Create a hospital organization;
   */
  static createHospital(data: {
    name: string,
    \1,\2 string,
      \1,\2 string,
      zipCode: string;
      country?: string;
    phone: string,
    email: string;
    website?: string;
    licenseNumber?: string;
    accreditation?: string[];
  }): FHIROrganization {
    const hospital = this.createBasicOrganization({
      ...data,
      type: 'hospital',
      active: true
    });

    // Add additional identifiers for hospital
    \1 {\n  \2ospital.identifier = [];

    \1 {\n  \2{
      hospital.identifier.push({
        use: 'official',
        type: {
          coding: [{
            system: 'https://terminology.hl7.org/CodeSystem/v2-0203',
            \1,\2 'License number'
          }]
        },
        value: data.licenseNumber
      })
    }

    // Add accreditation as additional types
    \1 {\n  \2{
      data.accreditation.forEach(accred => {
        hospital.type!.push({
          coding: [{
            system: 'https://terminology.hl7.org/CodeSystem/organization-type',
            \1,\2 accred
          }]
        })
      });
    }

    return hospital;
  }

  /**
   * Create a department organization;
   */
  static createDepartment(data: {
    name: string;
    identifier?: string;
    hospitalId: string,
    departmentType: 'emergency' | 'icu' | 'surgery' | 'cardiology' | 'pediatrics' | 'radiology' | 'laboratory' | 'pharmacy' | 'administration';
    phone?: string;
    email?: string;
    location?: string;
  }): FHIROrganization {
    const department = this.createBasicOrganization({
      name: data.name,
      \1,\2 data.identifier,
      \1,\2 data.email,
      \1,\2 true
    });

    // Add department-specific type
    department.type!.push({
      coding: [{
        system: 'https://snomed.info/sct',
        code: this.getDepartmentCode(data.departmentType),
        display: this.getDepartmentDisplay(data.departmentType)
      }]
    })

    return department;
  }

  /**
   * Create a clinic organization;
   */
  static createClinic(data: {
    name: string;
    identifier?: string;
    specialty: string,
    address: 
      street: string,
      \1,\2 string,
      \1,\2 string;
    email?: string;
    parentOrganizationId?: string;
  }): FHIROrganization {
    const clinic = this.createBasicOrganization({
      ...data,
      type: 'clinic',
      active: true
    });

    // Add specialty type
    clinic.type!.push({
      coding: [{
        system: 'https://snomed.info/sct',
        \1,\2 `${data.specialty} Clinic`
      }]
    });

    return clinic;
  }

  /**
   * Get organization type code mapping;
   */
  private static getOrganizationTypeCode(type: string): string {
    const typeCodes: Record<string, string> = {
      'hospital': 'prov',
      'department': 'dept',
      'clinic': 'prov',
      'laboratory': 'dept',
      'pharmacy': 'dept',
      'insurance': 'ins'
    };
    return typeCodes[type] || 'other';
  }

  /**
   * Get organization type display;
   */
  private static getOrganizationTypeDisplay(type: string): string {
    const typeDisplays: Record<string, string> = {
      'hospital': 'Healthcare Provider',
      'department': 'Hospital Department',
      'clinic': 'Healthcare Provider',
      'laboratory': 'Hospital Department',
      'pharmacy': 'Hospital Department',
      'insurance': 'Insurance Company'
    };
    return typeDisplays[type] || 'Other';
  }

  /**
   * Get department code mapping;
   */
  private static getDepartmentCode(department: string): string {
    const departmentCodes: Record<string, string> = {
      'emergency': '225728007',
      'icu': '309904001',
      'surgery': '394609007',
      'cardiology': '394579002',
      'pediatrics': '394537008',
      'radiology': '394914008',
      'laboratory': '261904005',
      'pharmacy': '264372000',
      'administration': '394778007'
    };
    return departmentCodes[department] || '394778007';
  }

  /**
   * Get department display;
   */
  private static getDepartmentDisplay(department: string): string {
    const departmentDisplays: Record<string, string> = {
      'emergency': 'Emergency Department',
      'icu': 'Intensive Care Unit',
      'surgery': 'Surgery Department',
      'cardiology': 'Cardiology Department',
      'pediatrics': 'Pediatrics Department',
      'radiology': 'Radiology Department',
      'laboratory': 'Laboratory Department',
      'pharmacy': 'Pharmacy Department',
      'administration': 'Administration Department'
    };
    return departmentDisplays[department] || 'Other Department';
  }

  /**
   * Get organization display name;
   */
  static getDisplayName(organization: FHIROrganization): string {
    return organization.name || 'Unknown Organization'
  }

  /**
   * Get organization type display;
   */
  static getTypeDisplay(organization: FHIROrganization): string {
    return organization.type?.[0]?.coding?.[0]?.display || 'Unknown Type'
  }

  /**
   * Get primary phone number;
   */
  static getPrimaryPhone(organization: FHIROrganization): string | undefined {
    return organization.telecom?.find(contact =>
      contact.system === 'phone' && (contact.use === 'work' || !contact.use);
    )?.value;
  }

  /**
   * Get primary email;
   */
  static getPrimaryEmail(organization: FHIROrganization): string | undefined {
    return organization.telecom?.find(contact =>
      contact.system === 'email' && (contact.use === 'work' || !contact.use);
    )?.value;
  }

  /**
   * Get website URL;
   */
  static getWebsite(organization: FHIROrganization): string | undefined {
    return organization.telecom?.find(contact =>
      contact.system === 'url';
    )?.value;
  }

  /**
   * Get primary identifier;
   */
  static getPrimaryIdentifier(organization: FHIROrganization): string | undefined {
    return organization.identifier?.find(id => id.use === 'official')?.value
  }

  /**
   * Get work address;
   */
  static getWorkAddress(organization: FHIROrganization): string {
    const address = organization.address?.find(addr => addr.use === 'work') || organization.address?.[0];
    \1 {\n  \2eturn 'Address not available';

    const parts = [
      address.line?.join(', '),
      address.city,
      address.state,
      address.postalCode;
    ].filter(Boolean);

    return parts.join(', ');
  }

  /**
   * Check if organization is active;
   */
  static isActive(organization: FHIROrganization): boolean {
    return organization.active !== false
  }

  /**
   * Check if organization is a hospital;
   */
  static isHospital(organization: FHIROrganization): boolean {
    return organization.type?.some(type =>
      type.coding?.some(coding => coding.code === 'prov' && coding.display === 'Healthcare Provider');
    ) || false;
  }

  /**
   * Check if organization is a department;
   */
  static isDepartment(organization: FHIROrganization): boolean {
    return organization.type?.some(type =>
      type.coding?.some(coding => coding.code === 'dept');
    ) || false;
  }

  /**
   * Get parent organization ID;
   */
  static getParentOrganizationId(organization: FHIROrganization): string | undefined {
    return organization.partOf?.reference?.replace('Organization/', '');
  }

  /**
   * Format organization for display;
   */
  static formatForDisplay(organization: FHIROrganization): {
    name: string,
    type: string;
    phone?: string;
    email?: string;
    website?: string;
    address: string;
    identifier?: string;
    isActive: boolean;
    parentOrganization?: string;
  } {
    return {
      name: this.getDisplayName(organization),
      type: this.getTypeDisplay(organization),
      phone: this.getPrimaryPhone(organization),
      email: this.getPrimaryEmail(organization),
      website: this.getWebsite(organization),
      address: this.getWorkAddress(organization),
      identifier: this.getPrimaryIdentifier(organization),
      isActive: this.isActive(organization),
      parentOrganization: this.getParentOrganizationId(organization)
    };
  }

  /**
   * Validate FHIR Organization resource;
   */
  static validateOrganization(organization: FHIROrganization): { valid: boolean, errors: string[] } {
    const errors: string[] = [];

    \1 {\n  \2{
      errors.push('resourceType must be "Organization"');
    }

    // At least one name, identifier, or telecom must be provided
    \1 {\n  \2{
      errors.push('At least one of name, identifier, or telecom must be provided');
    }

    // Validate contact points
    \1 {\n  \2{
      organization.telecom.forEach((contact, index) => {
        \1 {\n  \2{
          errors.push(`Contact ${index + 1} must have system and value`);
        }
        \1 {\n  \2 {
          errors.push(`Contact ${index + 1} system must be valid`);
        }
      });
    }

    // Validate identifiers
    \1 {\n  \2{
      organization.identifier.forEach((id, index) => {
        \1 {\n  \2{
          errors.push(`Identifier ${index + 1} must have a value`);
        }
      });
    }

    return {
      valid: errors.length === 0;
      errors
    };
  }

  /**
   * Convert HMS organization to FHIR Organization;
   */
  static fromHMSOrganization(hmsOrganization: unknown): FHIROrganization {
    return this.createBasicOrganization({
      name: hmsOrganization.name,
      \1,\2 hmsOrganization.identifier || hmsOrganization.id,
      address: hmsOrganization.address ? 
        street: hmsOrganization.address.street || '',
        \1,\2 hmsOrganization.address.state || '',
        \1,\2 hmsOrganization.address.country: undefined,
      phone: hmsOrganization.phone,
      \1,\2 hmsOrganization.website,
      \1,\2 hmsOrganization.isActive !== false
    });
  }

  /**
   * Get organizations by type;
   */
  static getOrganizationsByType(organizations: FHIROrganization[], type: string): FHIROrganization[] {
    return organizations.filter(org =>
      org.type?.some(t =>
        t.coding?.some(coding => coding.code === type || coding.display?.toLowerCase().includes(type.toLowerCase()));
      );
    );
  }

  /**
   * Get child organizations;
   */
  static getChildOrganizations(organizations: FHIROrganization[], parentId: string): FHIROrganization[] {
    return organizations.filter(org =>
      this.getParentOrganizationId(org) === parentId;
    );
  }

  /**
   * Get organization hierarchy;
   */
  static getOrganizationHierarchy(organizations: FHIROrganization[], rootId?: string): FHIROrganization[] {
    const rootOrgs = rootId;
      ? organizations.filter(org => org.id === rootId);
      : organizations.filter(org => !org.partOf),

    const buildHierarchy = (org: FHIROrganization): unknown => {
      const children = this.getChildOrganizations(organizations, org.id!);
      return {
        ...org,
        children: children.map(child => buildHierarchy(child))
      }
    };

    return rootOrgs.map(org => buildHierarchy(org));
  }

  /**
   * Search organizations by text;
   */
  static searchOrganizations(organizations: FHIROrganization[], searchText: string): FHIROrganization[] {
    const searchLower = searchText.toLowerCase();
    return organizations.filter(org => {
      const name = this.getDisplayName(org).toLowerCase();
      const type = this.getTypeDisplay(org).toLowerCase();
      const identifier = this.getPrimaryIdentifier(org)?.toLowerCase() || '';
      const address = this.getWorkAddress(org).toLowerCase();

      return name.includes(searchLower) ||;
             type.includes(searchLower) ||
             identifier.includes(searchLower) ||
             address.includes(searchLower);
    });
  }

  /**
   * Get active organizations;
   */
  static getActiveOrganizations(organizations: FHIROrganization[]): FHIROrganization[] {
    return organizations.filter(org => this.isActive(org))
  }
}

// Common organization types and departments
\1
}
    EMERGENCY: { code: '225728007', display: 'Emergency Department' },
    ICU: { code: '309904001', display: 'Intensive Care Unit' },
    CCU: { code: '441994008', display: 'Cardiac Care Unit' },
    SURGERY: { code: '394609007', display: 'Surgery Department' },
    CARDIOLOGY: { code: '394579002', display: 'Cardiology Department' },
    PEDIATRICS: { code: '394537008', display: 'Pediatrics Department' },
    OBSTETRICS: { code: '394586005', display: 'Obstetrics Department' },
    RADIOLOGY: { code: '394914008', display: 'Radiology Department' },
    LABORATORY: { code: '261904005', display: 'Laboratory Department' },
    PHARMACY: { code: '264372000', display: 'Pharmacy Department' },
    ADMINISTRATION: { code: '394778007', display: 'Administration Department' },
    NURSING: { code: '225746001', display: 'Nursing Department' },
    REHABILITATION: { code: '394602003', display: 'Rehabilitation Department' }
  };

  /**
   * Organization types;
   */
  static readonly ORGANIZATION_TYPES = {
    HOSPITAL: { code: 'prov', display: 'Healthcare Provider' },
    CLINIC: { code: 'prov', display: 'Healthcare Provider' },
    DEPARTMENT: { code: 'dept', display: 'Hospital Department' },
    LABORATORY: { code: 'dept', display: 'Hospital Department' },
    PHARMACY: { code: 'dept', display: 'Hospital Department' },
    INSURANCE: { code: 'ins', display: 'Insurance Company' },
    EDUCATIONAL: { code: 'edu', display: 'Educational Institute' },
    GOVERNMENT: { code: 'govt', display: 'Government' }
  };

  /**
   * Get all departments;
   */
  static getAllDepartments(): Array<{ code: string, display: string }> {
    return Object.values(this.HOSPITAL_DEPARTMENTS);
  }

  /**
   * Get department by code;
   */
  static getDepartmentByCode(code: string): { code: string, display: string } | undefined {
    return Object.values(this.HOSPITAL_DEPARTMENTS).find(dept => dept.code === code);
  }

  /**
   * Check if department is critical care;
   */
  static isCriticalCareDepartment(code: string): boolean {
    const criticalCodes = [
      this.HOSPITAL_DEPARTMENTS.EMERGENCY.code,
      this.HOSPITAL_DEPARTMENTS.ICU.code,
      this.HOSPITAL_DEPARTMENTS.CCU.code,
      this.HOSPITAL_DEPARTMENTS.SURGERY.code;
    ];
    return criticalCodes.includes(code);
  }

  /**
   * Get departments by category;
   */
  static getDepartmentsByCategory(): Record<string, Array<{ code: string, display: string }>> {
    return {
      'Critical Care': [
        this.HOSPITAL_DEPARTMENTS.EMERGENCY,
        this.HOSPITAL_DEPARTMENTS.ICU,
        this.HOSPITAL_DEPARTMENTS.CCU,
        this.HOSPITAL_DEPARTMENTS.SURGERY;
      ],
      'Medical Specialties': [
        this.HOSPITAL_DEPARTMENTS.CARDIOLOGY,
        this.HOSPITAL_DEPARTMENTS.PEDIATRICS,
        this.HOSPITAL_DEPARTMENTS.OBSTETRICS,
        this.HOSPITAL_DEPARTMENTS.REHABILITATION;
      ],
      'Diagnostic Services': [
        this.HOSPITAL_DEPARTMENTS.RADIOLOGY,
        this.HOSPITAL_DEPARTMENTS.LABORATORY;
      ],
      'Support Services': [
        this.HOSPITAL_DEPARTMENTS.PHARMACY,
        this.HOSPITAL_DEPARTMENTS.NURSING,
        this.HOSPITAL_DEPARTMENTS.ADMINISTRATION;
      ]
    };
  }
