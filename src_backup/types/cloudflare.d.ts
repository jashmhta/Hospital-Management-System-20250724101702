import "@cloudflare/workers-types"
import D1PreparedStatement
import D1Result }
import { D1Database

// Define a more specific type for D1Result that includes expected meta properties;

  };

// Re-export D1Database, D1PreparedStatement, and D1Result so they can be imported from "@/types/cloudflare";
// This ensures that API routes can use these types directly from this local type definition file.;
export type { D1Database, D1PreparedStatement, D1Result;
