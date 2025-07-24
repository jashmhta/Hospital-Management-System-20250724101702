/**;
 * FHIR R4 Base Types and Interfaces;
 * Implementation based on HL7 FHIR R4 specification;
 * Source: ZIP 6 - FHIR R4 data models for hospital management system microservices;
 */;

// Base FHIR Types;

  };
  request?: {method:"GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH",
    url: string;
    ifNoneMatch?: string;
    ifModifiedSince?: string;
    ifMatch?: string;
    ifNoneExist?: string
  };
  response?: {status:string;
    location?: string;
    etag?: string;
    lastModified?: string;
    outcome?: unknown;
  };
