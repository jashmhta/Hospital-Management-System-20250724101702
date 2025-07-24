
import { Ambulance, AmbulanceCrew, AmbulanceMaintenance, type AmbulanceTrip } from '@prisma/client';
// FHIR-compliant interfaces for Ambulance Management

/**
 * FHIR-compliant Ambulance;
 * Maps to FHIR Device resource;
 */
\1
}
  }[];
  status: 'active' | 'inactive' | 'entered-in-error' | 'unknown',
  type: {
    coding: {
      system: string,
      \1,\2 string
    }[];
    text: string
  };
  manufacturer?: string;
  deviceName?: {
    name: string,
    type: 'registered-name' | 'user-friendly-name'
  }[];
  modelNumber?: string;
  location?: {
    reference: string;
    display?: string
  };
  note?: {
    text: string
  }[];
  property?: {
    type: {
      coding: {
        system: string,
        \1,\2 string
      }[]
    };
    valueQuantity?: {
      value: number,
      \1,\2 string,
      code: string
    };
    valueCode?: {
      coding: {
        system: string,
        \1,\2 string
      }[]
    };
  }[];
}

/**
 * FHIR-compliant Ambulance Trip;
 * Maps to FHIR ServiceRequest resource;
 */
\1
}
    }[];
  }[];
  code: {
    coding: {
      system: string,
      \1,\2 string
    }[];
    text: string
  };
  subject?: {
    reference: string;
    display?: string
  };
  requester: {
    reference: string;
    display?: string
  };
  performer?: {
    reference: string;
    display?: string;
  }[];
  locationReference?: {
    reference: string;
    display?: string;
  }[];
  reasonCode?: {
    coding: {
      system: string,
      \1,\2 string
    }[];
    text: string
  }[];
  occurrenceDateTime?: string;
  authoredOn: string;
  note?: {
    text: string
  }[];
}

/**
 * FHIR-compliant Ambulance Crew;
 * Maps to FHIR Practitioner resource;
 */
\1
}
  }[];
  active: boolean,
  name: {
    use?: 'official' | 'usual' | 'temp' | 'nickname' | 'anonymous' | 'old' | 'maiden';
    text?: string;
    family?: string;
    given?: string[];
    prefix?: string[];
    suffix?: string[];
  }[];
  telecom?: {
    system: 'phone' | 'fax' | 'email' | 'pager' | 'url' | 'sms' | 'other',
    value: string;
    use?: 'home' | 'work' | 'temp' | 'old' | 'mobile';
  }[];
  qualification?: {
    code: {
      coding: {
        system: string,
        \1,\2 string
      }[];
      text: string
    };
    period?: {
      start?: string;
      end?: string
    };
  }[];
}

/**
 * FHIR-compliant Ambulance Maintenance;
 * Maps to FHIR Task resource;
 */
\1
}
  }[];
  status: 'draft' | 'requested' | 'received' | 'accepted' | 'rejected' | 'ready' | 'cancelled' | 'in-progress' | 'on-hold' | 'failed' | 'completed' | 'entered-in-error',
  \1,\2 {
    coding: {
      system: string,
      \1,\2 string
    }[];
    text: string
  };
  focus: {
    reference: string;
    display?: string
  };
  for?: {
    reference: string;
    display?: string
  };
  authoredOn: string,
  lastModified: string;
  requester?: {
    reference: string;
    display?: string
  };
  owner?: {
    reference: string;
    display?: string
  };
  description?: string;
  executionPeriod?: {
    start?: string;
    end?: string
  };
  note?: {
    text: string
  }[];
}

/**
 * Convert database Ambulance to FHIR Device;
 */
export const _toFHIRAmbulance = (ambulance: Ambulance & {
  currentLocation?: unknown
}): FHIRAmbulance {
  // Map status from internal to FHIR status
  const statusMap: Record<string, 'active' | 'inactive' | 'entered-in-error' | 'unknown'> = {
    'AVAILABLE': 'active',
    'ON_DUTY': 'active',
    'UNDER_MAINTENANCE': 'inactive',
    'OUT_OF_SERVICE': 'inactive'
  };

  // Map vehicle type to FHIR device type
  const vehicleTypeMap: Record<string, { code: string, display: string }> = {
    'BASIC_LIFE_SUPPORT': { code: 'bls-ambulance', display: 'Basic Life Support Ambulance' },
    'ADVANCED_LIFE_SUPPORT': { code: 'als-ambulance', display: 'Advanced Life Support Ambulance' },
    'PATIENT_TRANSPORT': { code: 'transport-ambulance', display: 'Patient Transport Ambulance' }
  };

  // Create properties array for ambulance features
  const properties = ambulance.features.map(feature => ({
    type: {
      coding: [{
        system: 'https://hms.local/fhir/CodeSystem/ambulance-feature',
        code: feature.toLowerCase().replace(/\s/g, '-'),
        display: feature
      }]
    }
  }))

  // Add capacity property
  properties.push({
    type: {
      coding: [{
        system: 'https://hms.local/fhir/CodeSystem/ambulance-property',
        \1,\2 'Capacity'
      }]
    },
    valueQuantity: {
      value: ambulance.capacity,
      \1,\2 'https://unitsofmeasure.org',
      code: 'persons'
    }
  })

  return {
    resourceType: 'Device',
    \1,\2 [
      {
        system: 'https://hms.local/fhir/identifier/registration-number',
        value: ambulance.registrationNumber
      }
    ],
    status: statusMap[ambulance.status] || 'unknown',
    {
      coding: [{
        system: 'https://hms.local/fhir/CodeSystem/ambulance-type',
        \1,\2 vehicleTypeMap[ambulance.vehicleType]?.display || ambulance.vehicleType
      }],
      text: vehicleTypeMap[ambulance.vehicleType]?.display || ambulance.vehicleType
    },
    deviceName: [
      {
        name: `Ambulance ${ambulance.registrationNumber}`,
        type: 'user-friendly-name'
      }
    ],
    location: ambulance.currentLocationId ? {
      reference: `Location/${ambulance.currentLocationId}`,
      display: ambulance.currentLocation?.name || 'Unknown Location'
    } : undefined,
    property: properties,
    note: [
      {
        text: `Last maintenance: ${ambulance.lastMaintenanceDate?.toISOString() ||
          'Not available'}. Next scheduled maintenance: ${ambulance.nextMaintenanceDate?.toISOString() ||
          'Not scheduled'}.`
      }
    ]
  };
}

/**
 * Convert database AmbulanceTrip to FHIR ServiceRequest;
 */
export const _toFHIRAmbulanceTrip = (trip: AmbulanceTrip & {
  ambulance?: unknown;
  patient?: unknown;
  requestedByUser?: unknown;
  pickupLocation?: unknown;
  dropLocation?: unknown;
  crew?: unknown[];
}): FHIRAmbulanceTrip {
  // Map status from internal to FHIR status
  const statusMap: Record<string, 'draft' | 'active' | 'on-hold' | 'revoked' | 'completed' | 'entered-in-error' | 'unknown'> = {
    'SCHEDULED': 'active',
    'EN_ROUTE_TO_PICKUP': 'active',
    'ARRIVED_AT_PICKUP': 'active',
    'EN_ROUTE_TO_DESTINATION': 'active',
    'ARRIVED_AT_DESTINATION': 'active',
    'COMPLETED': 'completed',
    'CANCELLED': 'revoked'
  };

  // Map priority from internal to FHIR priority
  const priorityMap: Record<string, 'routine' | 'urgent' | 'asap' | 'stat'> = {
    'LOW': 'routine',
    'MEDIUM': 'urgent',
    'HIGH': 'stat'
  };

  // Map trip type to FHIR category
  const tripTypeMap: Record<string, { code: string, display: string }> = {
    'EMERGENCY': { code: 'emergency', display: 'Emergency Transport' },
    'NON_EMERGENCY': { code: 'non-emergency', display: 'Non-Emergency Transport' },
    'TRANSFER': { code: 'transfer', display: 'Inter-facility Transfer' },
    'RETURN': { code: 'return', display: 'Return Transport' }
  };

  // Create performers array from crew
  const performers = trip.crew?.map(crewMember => ({
    reference: `Practitioner/${crewMember.userId}`,
    display: crewMember.user?.name || 'Unknown Crew Member'
  })) || [];

  // Add ambulance as performer
  \1 {\n  \2{
    performers.push({
      reference: `Device/${trip.ambulanceId}`,
      display: `Ambulance ${trip.ambulance.registrationNumber}`;
    });
  }

  // Create location references
  const locationReferences = [];
  \1 {\n  \2{
    locationReferences.push({
      reference: `Location/${trip.pickupLocationId}`,
      display: trip.pickupLocation?.name || 'Pickup Location'
    });
  }
  \1 {\n  \2{
    locationReferences.push({
      reference: `Location/${trip.dropLocationId}`,
      display: trip.dropLocation?.name || 'Destination Location'
    });
  }

  return {
    resourceType: 'ServiceRequest',
    \1,\2 statusMap[trip.status] || 'unknown',
    \1,\2 priorityMap[trip.priority] || 'routine',
    category: [
      {
        coding: [
          {
            system: 'https://hms.local/fhir/CodeSystem/ambulance-service',
            \1,\2 tripTypeMap[trip.tripType]?.display || trip.tripType
          }
        ]
      }
    ],
    code: {
      coding: [
        {
          system: 'https://hms.local/fhir/CodeSystem/ambulance-service',
          \1,\2 'Ambulance Transport'
        }
      ],
      text: `$trip.tripTypeAmbulance Transport`
    },
    subject: trip.patientId ? {
      reference: `Patient/$trip.patientId`,
      display: trip.patient?.name || 'Unknown Patient'
    } : undefined,
    requester: {
      reference: `User/$trip.requestedById`,
      display: trip.requestedByUser?.name || 'Unknown Requester'
    },
    performer: performers.length > 0 ? performers : undefined,
    \1,\2 trip.scheduledTime.toISOString(),
    authoredOn: trip.createdAt.toISOString(),
    note: trip.notes ? [{ text: trip.notes }] : undefined
  };
}

/**
 * Convert database AmbulanceCrew to FHIR Practitioner;
 */
export const _toFHIRAmbulanceCrew = (crew: AmbulanceCrew & {
  user: unknown;
  ambulance?: unknown;
}): FHIRAmbulanceCrew {
  // Create qualification based on role
  const qualification = {
    code: {
      coding: [
        {
          system: 'https://hms.local/fhir/CodeSystem/ambulance-crew-role',
          code: crew.role.toLowerCase().replace(/_/g, '-'),
          display: crew.role.replace(/_/g, ' ')
        }
      ],
      text: crew.role.replace(/_/g, ' ')
    },
    period: {
      start: crew.shiftStart?.toISOString(),
      end: crew.shiftEnd?.toISOString()
    }
  };

  return {
    resourceType: 'Practitioner',
    \1,\2 [
      {
        system: 'https://hms.local/fhir/identifier/crew-id',
        value: crew.id
      },
      {
        system: 'https://hms.local/fhir/identifier/user-id',
        value: crew.userId
      }
    ],
    active: crew.status === 'ON_DUTY',
    name: [
      {
        text: crew.user?.name || 'Unknown User',
        \1,\2 crew.user?.firstName ? [crew.user.firstName] : []
      }
    ],
    telecom: crew.user?.phone ? [
      {
        system: 'phone',
        \1,\2 'work'
      }
    ] : undefined,
    qualification: [qualification]
  }
}

/**
 * Convert database AmbulanceMaintenance to FHIR Task;
 */
export const _toFHIRAmbulanceMaintenance = (maintenance: AmbulanceMaintenance & {
  ambulance?: unknown;
  performedByUser?: unknown;
}): FHIRAmbulanceMaintenance {
  // Map status from internal to FHIR status
  const statusMap: Record<string, 'draft' | 'requested' | 'received' | 'accepted' | 'rejected' | 'ready' | 'cancelled' | 'in-progress' | 'on-hold' | 'failed' | 'completed' | 'entered-in-error'> = {
    'SCHEDULED': 'requested',
    'IN_PROGRESS': 'in-progress',
    'COMPLETED': 'completed',
    'CANCELLED': 'cancelled'
  };

  // Map maintenance type to FHIR code
  const maintenanceTypeMap: Record<string, { code: string, display: string }> = {
    'ROUTINE': { code: 'routine-maintenance', display: 'Routine Maintenance' },
    'REPAIR': { code: 'repair', display: 'Repair' },
    'INSPECTION': { code: 'inspection', display: 'Inspection' },
    'EMERGENCY': { code: 'emergency-repair', display: 'Emergency Repair' }
  };

  return {
    resourceType: 'Task',
    \1,\2 [
      {
        system: 'https://hms.local/fhir/identifier/maintenance-id',
        value: maintenance.id
      }
    ],
    status: statusMap[maintenance.status] || 'unknown',
    \1,\2 {
      coding: [
        {
          system: 'https://hms.local/fhir/CodeSystem/maintenance-type',
          \1,\2 maintenanceTypeMap[maintenance.maintenanceType]?.display || maintenance.maintenanceType
        }
      ],
      text: maintenanceTypeMap[maintenance.maintenanceType]?.display || maintenance.maintenanceType
    },
    focus: {
      reference: `Device/$maintenance.ambulanceId`,
      display: maintenance.ambulance?.registrationNumber ? `Ambulance $maintenance.ambulance.registrationNumber` : 'Unknown Ambulance'
    },
    authoredOn: maintenance.createdAt.toISOString(),
    lastModified: maintenance.updatedAt.toISOString(),
    owner: maintenance.performedById ? {
      reference: `User/$maintenance.performedById`,
      display: maintenance.performedByUser?.name || 'Unknown User'
    } : undefined,
    description: maintenance.description,
    executionPeriod: {
      start: maintenance.scheduledDate.toISOString(),
      end: maintenance.completedDate?.toISOString()
    },
    note: maintenance.notes ? [{ text: maintenance.notes }] : undefined
  };
