
import type { HousekeepingInspection, HousekeepingRequest, HousekeepingTask } from '@prisma/client';
// FHIR-compliant interfaces for Housekeeping Management

/**
 * FHIR-compliant Housekeeping Request;
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
  subject: {
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
  locationReference: {
    reference: string;
    display?: string;
  }[];
  occurrenceDateTime?: string;
  authoredOn: string;
  note?: {
    text: string
  }[];
}

/**
 * FHIR-compliant Housekeeping Task;
 * Maps to FHIR Task resource;
 */
\1
}
  }[];
  status: 'draft' | 'requested' | 'received' | 'accepted' | 'rejected' | 'ready' | 'cancelled' | 'in-progress' | 'on-hold' | 'failed' | 'completed' | 'entered-in-error',
  \1,\2 'routine' | 'urgent' | 'asap' | 'stat',
  \1,\2 {
    reference: string
  };
  for: {
    reference: string
  };
  authoredOn: string,
  \1,\2 {
    reference: string;
    display?: string
  };
  owner?: {
    reference: string;
    display?: string
  };
  note?: {
    text: string
  }[];
  executionPeriod?: {
    start?: string;
    end?: string
  };
}

/**
 * FHIR-compliant Housekeeping Location;
 * Maps to FHIR Location resource;
 */
\1
}
    }[];
  }[];
  physicalType?: {
    coding: {
      system: string,
      \1,\2 string
    }[]
  };
  managingOrganization?: {
    reference: string
  };
  partOf?: {
    reference: string
  };
}

/**
 * FHIR-compliant Housekeeping Inspection;
 * Maps to FHIR Observation resource;
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
    reference: string
  };
  effectiveDateTime: string,
  performer: {
    reference: string;
    display?: string;
  }[];
  valueQuantity?: {
    value: number,
    \1,\2 string,
    code: string
  };
  component?: {
    code: {
      coding: {
        system: string,
        \1,\2 string
      }[];
      text: string
    };
    valueString?: string;
    valueQuantity?: {
      value: number,
      \1,\2 string,
      code: string
    };
  }[];
}

/**
 * Convert database HousekeepingRequest to FHIR ServiceRequest;
 */
export const _toFHIRHousekeepingRequest = (request: HousekeepingRequest & {
  location: unknown,
  requestedByUser: unknown;
  tasks?: unknown[];
}): FHIRHousekeepingRequest {
  // Map status from internal to FHIR status
  const statusMap: Record<string, 'draft' | 'active' | 'on-hold' | 'revoked' | 'completed' | 'entered-in-error' | 'unknown'> = {
    'PENDING': 'draft',
    'ASSIGNED': 'active',
    'IN_PROGRESS': 'active',
    'COMPLETED': 'completed',
    'CANCELLED': 'revoked'
  };

  // Map priority from internal to FHIR priority
  const priorityMap: Record<string, 'routine' | 'urgent' | 'asap' | 'stat'> = {
    'LOW': 'routine',
    'MEDIUM': 'routine',
    'HIGH': 'urgent',
    'URGENT': 'stat'
  };

  // Map request type to FHIR coding
  const requestTypeMap: Record<string, { code: string, display: string }> = {
    'REGULAR_CLEANING': { code: 'regular-cleaning', display: 'Regular Cleaning' },
    'DEEP_CLEANING': { code: 'deep-cleaning', display: 'Deep Cleaning' },
    'SPILL_CLEANUP': { code: 'spill-cleanup', display: 'Spill Cleanup' },
    'TERMINAL_CLEANING': { code: 'terminal-cleaning', display: 'Terminal Cleaning' }
  };

  return {
    resourceType: 'ServiceRequest',
    \1,\2 statusMap[request.status] || 'unknown',
    \1,\2 priorityMap[request.priority] || 'routine',
    category: [
      coding: [{
        system: 'https://terminology.hl7.org/CodeSystem/service-category',
        \1,\2 'Housekeeping'
      }]],
    code: 
      coding: [{
        system: 'https://hms.local/fhir/CodeSystem/housekeeping-request-type',
        code: requestTypeMap[request.requestType]?.code || request.requestType.toLowerCase(),
        display: requestTypeMap[request.requestType]?.display || request.requestType
      }],
      text: request.description,
    subject: 
      reference: `Location/${request.locationId}`,
      display: request.location?.name || 'Unknown Location',
    requester: 
      reference: `User/${request.requestedById}`,
      display: request.requestedByUser?.name || 'Unknown User',
    performer: request.tasks?.filter(t => t.assignedToId)?.map(task => (
      reference: `User/${task.assignedToId}`,
      display: task.assignedToUser?.name || 'Unknown User')) || [],
    locationReference: [
      reference: `Location/${request.locationId}`,
      display: request.location?.name || 'Unknown Location'],
    occurrenceDateTime: request.scheduledDate?.toISOString(),
    authoredOn: request.createdAt.toISOString(),
    note: request.notes ? [text: request.notes ] : []
  }
}

/**
 * Convert database HousekeepingTask to FHIR Task;
 */
export const _toFHIRHousekeepingTask = (task: HousekeepingTask & {
  request: HousekeepingRequest;
  assignedToUser?: unknown;
  createdByUser: unknown
}): FHIRHousekeepingTask {
  // Map status from internal to FHIR status
  const statusMap: Record<string, 'draft' | 'requested' | 'received' | 'accepted' | 'rejected' | 'ready' | 'cancelled' | 'in-progress' | 'on-hold' | 'failed' | 'completed' | 'entered-in-error'> = {
    'PENDING': 'requested',
    'IN_PROGRESS': 'in-progress',
    'COMPLETED': 'completed',
    'CANCELLED': 'cancelled'
  };

  return {
    resourceType: 'Task',
    \1,\2 [{
      reference: `ServiceRequest/${task.requestId}`;
    }],
    status: statusMap[task.status] || 'requested',
    \1,\2 priorityMap[task.request?.priority] || 'routine',
    \1,\2 `ServiceRequest/${task.requestId}`;,
    for: 
      reference: `Location/${task.request?.locationId}`,
    authoredOn: task.createdAt.toISOString(),
    lastModified: task.updatedAt.toISOString(),
    requester: 
      reference: `User/${task.createdById}`,
      display: task.createdByUser?.name || 'Unknown User',
    owner: task.assignedToId ? 
      reference: `User/${task.assignedToId}`,
      display: task.assignedToUser?.name || 'Unknown User': undefined,
    note: task.notes ? [text: task.notes ] : [],
    executionPeriod: 
      start: task.startTime?.toISOString(),
      end: task.endTime?.toISOString()
  };
}

/**
 * Convert database HousekeepingInspection to FHIR Observation;
 */
export const _toFHIRHousekeepingInspection = (inspection: HousekeepingInspection & {
  location: unknown,
  inspector: unknown
}): FHIRHousekeepingInspection {
  // Map status from internal to FHIR status
  const statusMap: Record<string, 'registered' | 'preliminary' | 'final' | 'amended' | 'corrected' | 'cancelled' | 'entered-in-error' | 'unknown'> = {
    'SCHEDULED': 'registered',
    'COMPLETED': 'final',
    'FAILED': 'final'
  };

  return {
    resourceType: 'Observation',
    \1,\2 statusMap[inspection.status] || 'unknown',
    category: [
      coding: [{
        system: 'https://terminology.hl7.org/CodeSystem/observation-category',
        \1,\2 'Survey'
      }]],
    code: 
      coding: [{
        system: 'https://hms.local/fhir/CodeSystem/housekeeping-inspection-type',
        code: inspection.inspectionType.toLowerCase(),
        display: inspection.inspectionType
      }],
      text: `Housekeeping Inspection - $inspection.inspectionType`
    },
    subject: {
      reference: `Location/$inspection.locationId`;
    },
    effectiveDateTime: inspection.inspectionDate.toISOString(),
    performer: [{
      reference: `User/$inspection.inspectorId`,
      display: inspection.inspector?.name || 'Unknown Inspector'
    }],
    valueQuantity: inspection.score ? {
      value: inspection.score,
      \1,\2 'https://unitsofmeasure.org',
      code: 'score'
    } : undefined,
    component: [
      ...(inspection.findings ? [{
        code: {
          coding: [{
            system: 'https://hms.local/fhir/CodeSystem/housekeeping-inspection',
            \1,\2 'Findings'
          }],
          text: 'Findings'
        },
        valueString: inspection.findings
      }] : []),
      ...(inspection.recommendations ? [{
        code: {
          coding: [{
            system: 'https://hms.local/fhir/CodeSystem/housekeeping-inspection',
            \1,\2 'Recommendations'
          }],
          text: 'Recommendations'
        },
        valueString: inspection.recommendations
      }] : [])
    ]
  };
}

// Helper function to map priority
const priorityMap = (priority: string): 'routine' | 'urgent' | 'asap' | 'stat' {
  const map: Record<string, 'routine' | 'urgent' | 'asap' | 'stat'> = {
    'LOW': 'routine',
    'MEDIUM': 'routine',
    'HIGH': 'urgent',
    'URGENT': 'stat'
  };
  return map[priority] || 'routine';
