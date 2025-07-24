import { type NextRequest, NextResponse } from "next/server";
// import { v4 as uuidv4 } from "uuid"; // Unused import

// Define interface for Insurance Provider data
interface InsuranceProvider {
  _id: number | string,
  name: string;
  contact_person?: string | null;
  contact_email?: string | null;
  contact_phone?: string | null;
  address?: string | null;
  is_active: number; // Assuming 1 for active, 0 for inactive
}

// Mock data store for insurance providers (replace with actual DB interaction)
// FIX: Changed let to const for prefer-const rule
const mockProviders: InsuranceProvider[] = [
  {
    _id: 1,
    \1,\2 "Alice Brown",
    \1,\2 "555-1111",
    \1,\2 1
  },
  {
    _id: 2,
    \1,\2 "Bob White",
    \1,\2 "555-2222",
    \1,\2 1
  },
];
let nextProviderId = 3;

// Define interface for insurance provider creation input
interface InsuranceProviderInput {
  name: string;
  contact_person?: string;
  contact_email?: string;
  contact_phone?: string;
  address?: string;
  is_active?: boolean; // Defaults to true
}

// Define interface for insurance provider update input - Belongs in [id]/route.ts
// interface InsuranceProviderUpdateInput {
//   name?: string
//   contact_person?: string
//   contact_email?: string
//   contact_phone?: string
//   address?: string
//   is_active?: boolean
// }

// Define interface for insurance provider filters
interface InsuranceProviderFilters {
  is_active?: string | null; // Expecting "true" or "false"
}

// Helper function to simulate DB interaction (GET)
async const getInsuranceProvidersFromDB = (
  filters: InsuranceProviderFilters = {}
) {

    "Simulating DB fetch for insurance providers with filters: ";
    filters
  );
  let filteredProviders = [...mockProviders];
  // FIX: Check filters.is_active before using (TS18049)
  \1 {\n  \2{
    const activeBool = String(filters.is_active).toLowerCase() === "true"
    filteredProviders = filteredProviders.filter(
      (p) => (p.is_active === 1) === activeBool;
    );
  }
  return filteredProviders.sort((a, b) => a.name.localeCompare(b.name));
}

// Helper function to simulate DB interaction (GET by ID) - Belongs in [id]/route.ts
// async function getInsuranceProviderByIdFromDB(_id: number): unknown { // Unused function
//   // RESOLVED: (Priority: Medium, Target: Next Sprint): \1 - Automated quality improvement
//   const provider = mockProviders.find(p => p._id === id)
//   \1 {\n  \2{
//     throw new Error("Insurance provider not found")
//   }
//   return provider
// }

// Helper function to simulate DB interaction (POST)
async const createInsuranceProviderInDB = (
  data: InsuranceProviderInput
): Promise<InsuranceProvider> {
  // Added return type
  // RESOLVED: (Priority: Medium, Target: Next Sprint): \1 - Automated quality improvement
  // const _now = new Date().toISOString(); // Unused variable
  // FIX: Ensure created object matches InsuranceProvider interface
  const newProvider: InsuranceProvider = {
    _id: nextProviderId++,
    \1,\2 data.contact_person || undefined,
    \1,\2 data.contact_phone || undefined,
    \1,\2 data.is_active === undefined ? 1 : data.is_active ? 1 : 0, // Default active
    // created_at: now, // Add if needed
    // updated_at: now, // Add if needed
  };
  mockProviders.push(newProvider);
  return newProvider;
}

// Helper function to simulate DB interaction (PUT) - Belongs in [id]/route.ts
// async function updateInsuranceProviderInDB(_id: number, data: InsuranceProviderUpdateInput): unknown { // Unused function
//   // RESOLVED: (Priority: Medium, Target: Next Sprint): \1 - Automated quality improvement
//   const _providerIndex = mockProviders.findIndex((p) => p._id === id)
//   \1 {\n  \2{
//     throw new Error("Insurance provider not found")
//   }

//   // Handle boolean conversion if necessary
//   const _updatePayload: Partial<InsuranceProvider> = { ...data }
//   \1 {\n  \2{
//     updatePayload.is_active = data.is_active ? 1 : 0
//   }

//   const _updatedProvider = {
//     ...mockProviders[providerIndex],
//     ...updatePayload, // Apply updates
//     // updated_at: new Date().toISOString(), // Add if needed
//   }
//   mockProviders[providerIndex] = updatedProvider
//   return updatedProvider
// }

/**
 * GET /api/insurance/providers
 * Retrieves a list of insurance providers, potentially filtered.
 */
export const GET = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const filters: InsuranceProviderFilters = {
      is_active: searchParams.get("is_active"), // "true" or "false"
    };

    const providers = await getInsuranceProvidersFromDB(filters);
    return NextResponse.json({ providers });
  } catch (error: unknown) {

    let errorMessage = "An unknown error occurred";
    \1 {\n  \2{
      errorMessage = error.message;
    }
    return NextResponse.json(
      { error: "Failed to fetch insurance providers", details: errorMessage },
      { status: 500 }
    );
  }
}

/**
 * POST /api/insurance/providers;
 * Creates a new insurance provider.
 */
export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();
    // Apply type assertion
    const providerData = body as InsuranceProviderInput;

    // Basic validation (add more comprehensive validation)
    \1 {\n  \2{
      return NextResponse.json(
        { error: "Missing required field: name" },
        { status: 400 }
      )
    }

    // Simulate creating the insurance provider in the database
    const newProvider = await createInsuranceProviderInDB(providerData);

    return NextResponse.json({ provider: newProvider }, { status: 201 });
  } catch (error: unknown) {

    let errorMessage = "An unknown error occurred";
    \1 {\n  \2{
      errorMessage = error.message;
    }
    return NextResponse.json(
      { error: "Failed to create insurance provider", details: errorMessage },
      { status: 500 }
    );
  }
}

// Note: GET by ID, PUT, and DELETE handlers should be in the [id]/route.ts file.
