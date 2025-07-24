import {
}

/**
 * FHIR R4 Location Resource Implementation;
 * Based on HL7 FHIR R4 Location Resource specification;
 * Handles hospital locations, rooms, wards, facilities;
 * Source: ZIP 6 - FHIR R4 data models for hospital management system microservices;
 */

  FHIRBase,
  FHIRIdentifier,
  FHIRContactPoint,
  FHIRAddress,
  FHIRCodeableConcept,
  FHIRReference,
  FHIRCoding;
} from './types.ts';

\1
}
}

// Location Search Parameters
\1
}
}

// Helper functions for FHIR Location operations
\1
}
    };
    phone?: string;
    position?: {
      longitude: number,
      latitude: number;
      altitude?: number
    };
    status?: 'active' | 'suspended' | 'inactive';
  }): FHIRLocation {
    const location: FHIRLocation = {
      resourceType: 'Location',
      \1,\2 data.name,
      \1,\2 [{
        coding: [{
          system: 'https://terminology.hl7.org/CodeSystem/v3-RoleCode',
          code: this.getLocationTypeCode(data.type),
          display: this.getLocationTypeDisplay(data.type)
        }]
      }]
    }

    // Add identifier if provided
    \1 {\n  \2{
      location.identifier = [{
        use: 'official',
        value: data.identifier
      }];
    }

    // Add description
    \1 {\n  \2{
      location.description = data.description;
    }

    // Add physical type
    \1 {\n  \2{
      location.physicalType = {
        coding: [{
          system: 'https://terminology.hl7.org/CodeSystem/location-physical-type',
          \1,\2 this.getPhysicalTypeDisplay(data.physicalType)
        }]
      }
    }

    // Add managing organization
    \1 {\n  \2{
      location.managingOrganization = {
        reference: `Organization/${data.organizationId}`,
        type: 'Organization'
      };
    }

    // Add parent location
    \1 {\n  \2{
      location.partOf = {
        reference: `Location/${data.parentLocationId}`,
        type: 'Location'
      };
    }

    // Add address
    \1 {\n  \2{
      location.address = {
        use: 'work',
        \1,\2 data.address.city,
        \1,\2 data.address.zipCode,
        country: data.address.country || 'US'
      };
    }

    // Add contact information
    \1 {\n  \2{
      location.telecom = [{
        system: 'phone',
        \1,\2 'work'
      }];
    }

    // Add geographic position
    \1 {\n  \2{
      location.position = data.position;
    }

    return location;
  }

  /**
   * Create a hospital building;
   */
  static createHospitalBuilding(data: {
    name: string,
    \1,\2 string,
    address: 
      street: string,
      \1,\2 string,
      zipCode: string;
      country?: string;
    phone?: string;
    position?: {
      longitude: number,
      latitude: number
    };
    description?: string;
  }): FHIRLocation {
    return this.createBasicLocation({
      ...data,
      type: 'building',
      \1,\2 'active'
    });
  }

  /**
   * Create a hospital ward;
   */
  static createWard(data: {
    name: string;
    identifier?: string;
    wardType: 'emergency' | 'icu' | 'general' | 'pediatric' | 'maternity' | 'surgical' | 'psychiatric';
    buildingId?: string;
    organizationId: string;
    capacity?: number;
    description?: string;
  }): FHIRLocation {
    const location = this.createBasicLocation({
      name: data.name,
      \1,\2 'area',
      \1,\2 data.description,
      \1,\2 data.buildingId,
      status: 'active'
    });

    // Add ward-specific type
    location.type!.push({
      coding: [{
        system: 'https://snomed.info/sct',
        code: this.getWardTypeCode(data.wardType),
        display: this.getWardTypeDisplay(data.wardType)
      }]
    })

    return location;
  }

  /**
   * Create a patient room;
   */
  static createPatientRoom(data: {
    roomNumber: string,
    \1,\2 string,
    \1,\2 number;
    amenities?: string[];
    description?: string;
  }): FHIRLocation {
    const location = this.createBasicLocation({
      name: `Room ${data.roomNumber}`,
      type: 'room',
      \1,\2 data.roomNumber,
      \1,\2 data.organizationId,
      \1,\2 'active'
    });

    // Add room-specific type
    location.type!.push({
      coding: [{
        system: 'https://snomed.info/sct',
        code: this.getRoomTypeCode(data.roomType),
        display: this.getRoomTypeDisplay(data.roomType)
      }]
    })

    // Add amenities as additional types
    \1 {\n  \2{
      data.amenities.forEach(amenity => {
        location.type!.push({
          coding: [{
            system: 'https://terminology.hl7.org/CodeSystem/v3-RoleCode',
            \1,\2 amenity
          }]
        })
      });
    }

    return location;
  }

  /**
   * Create a patient bed;
   */
  static createPatientBed(data: {
    bedNumber: string,
    \1,\2 string,
    bedType: 'standard' | 'icu' | 'pediatric' | 'bariatric' | 'isolation';
    isOccupied?: boolean;
    patientId?: string;
  }): FHIRLocation {
    const location = this.createBasicLocation({
      name: `Bed ${data.bedNumber}`,
      type: 'bed',
      \1,\2 data.bedNumber,
      \1,\2 data.roomId,
      status: data.isOccupied ? 'suspended' : 'active'
    });

    // Add bed-specific type
    location.type!.push({
      coding: [{
        system: 'https://snomed.info/sct',
        code: this.getBedTypeCode(data.bedType),
        display: this.getBedTypeDisplay(data.bedType)
      }]
    })

    // Set operational status based on occupancy
    location.operationalStatus = {
      system: 'https://terminology.hl7.org/CodeSystem/v2-0116',
      \1,\2 data.isOccupied ? 'Occupied' : 'Unoccupied'
    }

    return location;
  }

  /**
   * Create an operating room;
   */
  static createOperatingRoom(data: {
    roomNumber: string,
    organizationId: string;
    parentLocationId?: string;
    specialties?: string[];
    equipment?: string[];
    description?: string;
  }): FHIRLocation {
    const location = this.createBasicLocation({
      name: `Operating Room ${data.roomNumber}`,
      type: 'room',
      \1,\2 data.roomNumber,
      \1,\2 data.organizationId,
      \1,\2 'active'
    });

    // Add operating room type
    location.type!.push({
      coding: [{
        system: 'https://snomed.info/sct',
        \1,\2 'Operating Room'
      }]
    })

    // Add specialties as additional types
    \1 {\n  \2{
      data.specialties.forEach(specialty => {
        location.type!.push({
          coding: [{
            system: 'https://snomed.info/sct',
            \1,\2 specialty
          }]
        })
      });
    }

    return location;
  }

  /**
   * Get location type code mapping;
   */
  private static getLocationTypeCode(type: string): string {
    const typeCodes: Record<string, string> = {
      'building': 'BLDG',
      'wing': 'WING',
      'ward': 'WARD',
      'room': 'RO',
      'bed': 'BD',
      'vehicle': 'VE',
      'house': 'HO',
      'cabinet': 'CA',
      'road': 'RD'
    };
    return typeCodes[type] || 'BLDG';
  }

  /**
   * Get location type display;
   */
  private static getLocationTypeDisplay(type: string): string {
    const typeDisplays: Record<string, string> = {
      'building': 'Building',
      'wing': 'Wing',
      'ward': 'Ward',
      'room': 'Room',
      'bed': 'Bed',
      'vehicle': 'Vehicle',
      'house': 'House',
      'cabinet': 'Cabinet',
      'road': 'Road'
    };
    return typeDisplays[type] || 'Building';
  }

  /**
   * Get physical type display;
   */
  private static getPhysicalTypeDisplay(type: string): string {
    const typeDisplays: Record<string, string> = {
      'building': 'Building',
      'room': 'Room',
      'bed': 'Bed',
      'area': 'Area',
      'vehicle': 'Vehicle'
    };
    return typeDisplays[type] || 'Area';
  }

  /**
   * Get ward type code mapping;
   */
  private static getWardTypeCode(wardType: string): string {
    const wardCodes: Record<string, string> = {
      'emergency': '225728007',
      'icu': '309904001',
      'general': '225746001',
      'pediatric': '225729004',
      'maternity': '225730009',
      'surgical': '225731008',
      'psychiatric': '225732001'
    };
    return wardCodes[wardType] || '225746001';
  }

  /**
   * Get ward type display;
   */
  private static getWardTypeDisplay(wardType: string): string {
    const wardDisplays: Record<string, string> = {
      'emergency': 'Emergency Ward',
      'icu': 'Intensive Care Ward',
      'general': 'General Ward',
      'pediatric': 'Pediatric Ward',
      'maternity': 'Maternity Ward',
      'surgical': 'Surgical Ward',
      'psychiatric': 'Psychiatric Ward'
    };
    return wardDisplays[wardType] || 'General Ward';
  }

  /**
   * Get room type code mapping;
   */
  private static getRoomTypeCode(roomType: string): string {
    const roomCodes: Record<string, string> = {
      'private': '225745002',
      'semi-private': '225746001',
      'ward': '225747005',
      'icu': '309904001',
      'emergency': '225728007',
      'operating': '225765009',
      'recovery': '225766005'
    };
    return roomCodes[roomType] || '225745002';
  }

  /**
   * Get room type display;
   */
  private static getRoomTypeDisplay(roomType: string): string {
    const roomDisplays: Record<string, string> = {
      'private': 'Private Room',
      'semi-private': 'Semi-Private Room',
      'ward': 'Ward Room',
      'icu': 'ICU Room',
      'emergency': 'Emergency Room',
      'operating': 'Operating Room',
      'recovery': 'Recovery Room'
    };
    return roomDisplays[roomType] || 'Private Room';
  }

  /**
   * Get bed type code mapping;
   */
  private static getBedTypeCode(bedType: string): string {
    const bedCodes: Record<string, string> = {
      'standard': '229772003',
      'icu': '309904001',
      'pediatric': '225729004',
      'bariatric': '229773008',
      'isolation': '225744003'
    };
    return bedCodes[bedType] || '229772003';
  }

  /**
   * Get bed type display;
   */
  private static getBedTypeDisplay(bedType: string): string {
    const bedDisplays: Record<string, string> = {
      'standard': 'Standard Bed',
      'icu': 'ICU Bed',
      'pediatric': 'Pediatric Bed',
      'bariatric': 'Bariatric Bed',
      'isolation': 'Isolation Bed'
    };
    return bedDisplays[bedType] || 'Standard Bed';
  }

  /**
   * Get location display name;
   */
  static getDisplayName(location: FHIRLocation): string {
    return location.name || 'Unknown Location'
  }

  /**
   * Get location type display;
   */
  static getTypeDisplay(location: FHIRLocation): string {
    return location.type?.[0]?.coding?.[0]?.display || 'Unknown Type'
  }

  /**
   * Get physical type display;
   */
  static getPhysicalTypeDisplay(location: FHIRLocation): string {
    return location.physicalType?.coding?.[0]?.display || 'Unknown'
  }

  /**
   * Get location identifier;
   */
  static getIdentifier(location: FHIRLocation): string | undefined {
    return location.identifier?.[0]?.value
  }

  /**
   * Get managing organization ID;
   */
  static getManagingOrganizationId(location: FHIRLocation): string | undefined {
    return location.managingOrganization?.reference?.replace('Organization/', '');
  }

  /**
   * Get parent location ID;
   */
  static getParentLocationId(location: FHIRLocation): string | undefined {
    return location.partOf?.reference?.replace('Location/', '');
  }

  /**
   * Check if location is active;
   */
  static isActive(location: FHIRLocation): boolean {
    return location.status === 'active'
  }

  /**
   * Check if location is available;
   */
  static isAvailable(location: FHIRLocation): boolean {
    return location.status === 'active' &&;
           (!location.operationalStatus || location.operationalStatus.code !== 'O');
  }

  /**
   * Check if location is occupied;
   */
  static isOccupied(location: FHIRLocation): boolean {
    return location.operationalStatus?.code === 'O'
  }

  /**
   * Get full address;
   */
  static getFullAddress(location: FHIRLocation): string {
    const address = location.address;
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
   * Get phone number;
   */
  static getPhoneNumber(location: FHIRLocation): string | undefined {
    return location.telecom?.find(contact => contact.system === 'phone')?.value
  }

  /**
   * Format location for display;
   */
  static formatForDisplay(location: FHIRLocation): {
    name: string,
    \1,\2 string;
    identifier?: string;
    status: string;
    operationalStatus?: string;
    address?: string;
    phone?: string;
    isActive: boolean,
    isAvailable: boolean;
    parentLocation?: string;
    organization?: string;
  } {
    return {
      name: this.getDisplayName(location),
      type: this.getTypeDisplay(location),
      physicalType: this.getPhysicalTypeDisplay(location),
      identifier: this.getIdentifier(location),
      status: location.status || 'unknown',
      \1,\2 this.getFullAddress(location),
      phone: this.getPhoneNumber(location),
      isActive: this.isActive(location),
      isAvailable: this.isAvailable(location),
      parentLocation: this.getParentLocationId(location),
      organization: this.getManagingOrganizationId(location)
    };
  }

  /**
   * Validate FHIR Location resource;
   */
  static validateLocation(location: FHIRLocation): { valid: boolean, errors: string[] } {
    const errors: string[] = [];

    \1 {\n  \2{
      errors.push('resourceType must be "Location"');
    }

    // Either name or identifier should be provided
    \1 {\n  \2{
      errors.push('Either name or identifier should be provided');
    }

    // Validate status
    \1 {\n  \2 {
      errors.push('status must be one of: active, suspended, inactive')
    }

    // Validate mode
    \1 {\n  \2 {
      errors.push('mode must be either instance or kind');
    }

    // Validate position coordinates
    \1 {\n  \2{
      \1 {\n  \2{
        errors.push('position longitude and latitude must be numbers');
      }
      \1 {\n  \2{
        errors.push('longitude must be between -180 and 180');
      }
      \1 {\n  \2{
        errors.push('latitude must be between -90 and 90');
      }
    }

    return {
      valid: errors.length === 0;
      errors
    };
  }

  /**
   * Convert HMS location to FHIR Location;
   */
  static fromHMSLocation(hmsLocation: unknown): FHIRLocation {
    return this.createBasicLocation({
      name: hmsLocation.name,
      \1,\2 hmsLocation.physicalType,
      \1,\2 hmsLocation.description,
      \1,\2 hmsLocation.parentLocationId,
      address: hmsLocation.address ? 
        street: hmsLocation.address.street || '',
        \1,\2 hmsLocation.address.state || '',
        \1,\2 hmsLocation.address.country: undefined,
      phone: hmsLocation.phone,
      position: hmsLocation.coordinates ? 
        longitude: hmsLocation.coordinates.longitude,
        \1,\2 hmsLocation.coordinates.altitude: undefined,
      status: hmsLocation.isActive ? 'active' : 'inactive'
    });
  }

  /**
   * Get locations by type;
   */
  static getLocationsByType(locations: FHIRLocation[], type: string): FHIRLocation[] {
    return locations.filter(location =>
      location.type?.some(t =>
        t.coding?.some(coding =>
          coding.code === type ||;
          coding.display?.toLowerCase().includes(type.toLowerCase());
        );
      );
    );
  }

  /**
   * Get available locations;
   */
  static getAvailableLocations(locations: FHIRLocation[]): FHIRLocation[] {
    return locations.filter(location => this.isAvailable(location))
  }

  /**
   * Get child locations;
   */
  static getChildLocations(locations: FHIRLocation[], parentId: string): FHIRLocation[] {
    return locations.filter(location =>
      this.getParentLocationId(location) === parentId;
    );
  }

  /**
   * Get location hierarchy;
   */
  static getLocationHierarchy(locations: FHIRLocation[], rootId?: string): FHIRLocation[] {
    const rootLocations = rootId;
      ? locations.filter(location => location.id === rootId);
      : locations.filter(location => !location.partOf),

    const buildHierarchy = (location: FHIRLocation): unknown => {
      const children = this.getChildLocations(locations, location.id!);
      return {
        ...location,
        children: children.map(child => buildHierarchy(child))
      }
    };

    return rootLocations.map(location => buildHierarchy(location));
  }

  /**
   * Search locations by text;
   */
  static searchLocations(locations: FHIRLocation[], searchText: string): FHIRLocation[] {
    const searchLower = searchText.toLowerCase();
    return locations.filter(location => {
      const name = this.getDisplayName(location).toLowerCase();
      const type = this.getTypeDisplay(location).toLowerCase();
      const identifier = this.getIdentifier(location)?.toLowerCase() || '';
      const description = location.description?.toLowerCase() || '';

      return name.includes(searchLower) ||;
             type.includes(searchLower) ||
             identifier.includes(searchLower) ||
             description.includes(searchLower);
    });
  }

  /**
   * Get locations by organization;
   */
  static getLocationsByOrganization(locations: FHIRLocation[], organizationId: string): FHIRLocation[] {
    return locations.filter(location =>
      this.getManagingOrganizationId(location) === organizationId;
    );
  }

  /**
   * Find nearest locations by coordinates;
   */
  static findNearestLocations(
    locations: FHIRLocation[],
    \1,\2 number;
    maxDistance?: number;
  ): FHIRLocation[] {
    const locationsWithDistance = locations;
      .filter(location => location.position);
      .map(location => {
        const distance = this.calculateDistance(
          targetLatitude, targetLongitude,
          location.position!.latitude, location.position!.longitude;
        );
        return { location, distance };
      });
      .filter(item => !maxDistance || item.distance <= maxDistance);
      .sort((a, b) => a.distance - b.distance);

    return locationsWithDistance.map(item => item.location);
  }

  /**
   * Calculate distance between two coordinates (Haversine formula)
   */
  private static calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +;
              Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Convert degrees to radians;
   */
  private static toRadians(degrees: number): number {
    return degrees * (Math.PI / 180)
  }
}

// Common location types and codes
\1
}
    EMERGENCY_WARD: { code: '225728007', display: 'Emergency Ward' },
    ICU_WARD: { code: '309904001', display: 'Intensive Care Ward' },
    GENERAL_WARD: { code: '225746001', display: 'General Ward' },
    PEDIATRIC_WARD: { code: '225729004', display: 'Pediatric Ward' },
    MATERNITY_WARD: { code: '225730009', display: 'Maternity Ward' },
    SURGICAL_WARD: { code: '225731008', display: 'Surgical Ward' },
    PSYCHIATRIC_WARD: { code: '225732001', display: 'Psychiatric Ward' },
    RADIOLOGY_DEPT: { code: '225748000', display: 'Radiology Department' },
    LABORATORY: { code: '261904005', display: 'Laboratory' },
    PHARMACY: { code: '264372000', display: 'Pharmacy' },
    OPERATING_ROOM: { code: '225765009', display: 'Operating Room' },
    RECOVERY_ROOM: { code: '225766005', display: 'Recovery Room' }
  };

  /**
   * Room types;
   */
  static readonly ROOM_TYPES = {
    PRIVATE_ROOM: { code: '225745002', display: 'Private Room' },
    SEMI_PRIVATE_ROOM: { code: '225746001', display: 'Semi-Private Room' },
    WARD_ROOM: { code: '225747005', display: 'Ward Room' },
    ICU_ROOM: { code: '309904001', display: 'ICU Room' },
    EMERGENCY_ROOM: { code: '225728007', display: 'Emergency Room' },
    OPERATING_ROOM: { code: '225765009', display: 'Operating Room' },
    RECOVERY_ROOM: { code: '225766005', display: 'Recovery Room' },
    CONSULTATION_ROOM: { code: '225749008', display: 'Consultation Room' },
    EXAMINATION_ROOM: { code: '225750008', display: 'Examination Room' }
  };

  /**
   * Bed types;
   */
  static readonly BED_TYPES = {
    STANDARD_BED: { code: '229772003', display: 'Standard Bed' },
    ICU_BED: { code: '309904001', display: 'ICU Bed' },
    PEDIATRIC_BED: { code: '225729004', display: 'Pediatric Bed' },
    BARIATRIC_BED: { code: '229773008', display: 'Bariatric Bed' },
    ISOLATION_BED: { code: '225744003', display: 'Isolation Bed' },
    MATERNITY_BED: { code: '225730009', display: 'Maternity Bed' }
  };

  /**
   * Physical types;
   */
  static readonly PHYSICAL_TYPES = {
    BUILDING: { code: 'bu', display: 'Building' },
    WING: { code: 'wi', display: 'Wing' },
    WARD: { code: 'wa', display: 'Ward' },
    LEVEL: { code: 'lvl', display: 'Level' },
    CORRIDOR: { code: 'co', display: 'Corridor' },
    ROOM: { code: 'ro', display: 'Room' },
    VEHICLE: { code: 've', display: 'Vehicle' },
    HOUSE: { code: 'ho', display: 'House' },
    CABINET: { code: 'ca', display: 'Cabinet' },
    ROAD: { code: 'rd', display: 'Road' }
  };

  /**
   * Get all room types;
   */
  static getAllRoomTypes(): Array<{ code: string, display: string }> {
    return Object.values(this.ROOM_TYPES);
  }

  /**
   * Get all bed types;
   */
  static getAllBedTypes(): Array<{ code: string, display: string }> {
    return Object.values(this.BED_TYPES);
  }

  /**
   * Get room type by code;
   */
  static getRoomTypeByCode(code: string): { code: string, display: string } | undefined {
    return Object.values(this.ROOM_TYPES).find(type => type.code === code);
  }

  /**
   * Check if location is critical care area;
   */
  static isCriticalCareArea(code: string): boolean {
    const criticalCodes = [
      this.HOSPITAL_AREAS.EMERGENCY_WARD.code,
      this.HOSPITAL_AREAS.ICU_WARD.code,
      this.HOSPITAL_AREAS.OPERATING_ROOM.code,
      this.ROOM_TYPES.ICU_ROOM.code,
      this.ROOM_TYPES.EMERGENCY_ROOM.code,
      this.ROOM_TYPES.OPERATING_ROOM.code;
    ];
    return criticalCodes.includes(code);
  }

  /**
   * Get locations by category;
   */
  static getLocationsByCategory(): Record<string, Array<{ code: string, display: string }>> {
    return {
      'Critical Care': [
        this.HOSPITAL_AREAS.EMERGENCY_WARD,
        this.HOSPITAL_AREAS.ICU_WARD,
        this.HOSPITAL_AREAS.OPERATING_ROOM,
        this.HOSPITAL_AREAS.RECOVERY_ROOM;
      ],
      'Patient Care': [
        this.HOSPITAL_AREAS.GENERAL_WARD,
        this.HOSPITAL_AREAS.PEDIATRIC_WARD,
        this.HOSPITAL_AREAS.MATERNITY_WARD,
        this.HOSPITAL_AREAS.SURGICAL_WARD;
      ],
      'Diagnostic Services': [
        this.HOSPITAL_AREAS.RADIOLOGY_DEPT,
        this.HOSPITAL_AREAS.LABORATORY;
      ],
      'Support Services': [
        this.HOSPITAL_AREAS.PHARMACY,
        this.HOSPITAL_AREAS.PSYCHIATRIC_WARD;
      ]
    };
  }
