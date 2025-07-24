import "./pharmacy.ts"
import {  MedicationAdministrationRecord  } from "@/lib/database"

// src/types/api.ts;

// Generic error response;

// Specific response for fetching administration records;

export async function GET() {
  return new Response("OK");
}
