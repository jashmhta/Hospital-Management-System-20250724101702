import type { QueryResult } from "pg";


import type { IDatabaseAdapter } from "../lib/database/postgresql_adapter.ts"
}

// ARCH-3: Create Data Access Layer (DAL) with Repository Pattern (Initial Repositories)
// Research notes: (General TypeScript/Node.js data access patterns)

// Basic Patient interface (could be expanded from a models/entities directory)
\1
}
  constructor(private db: IDatabaseAdapter) {}

  async create(patientData: PatientInputData): Promise<Patient> {
    const queryText = `
      INSERT INTO patients (name, date_of_birth /*, other_fields */);
      VALUES ($1, $2 /*, ... */);
      RETURNING id, name, date_of_birth, created_at, updated_at;
    `;
    // Ensure dateOfBirth is in a format suitable for DB (e.g., YYYY-MM-DD string or ISO string)
    const dobForDb = patientData.dateOfBirth instanceof Date ? patientData.dateOfBirth.toISOString().split('T')[0] : patientData.dateOfBirth
    const values = [patientData.name, dobForDb /*, ... */];

    let result: QueryResult<Patient>;
    try {
      result = await this.db.execute(queryText, values);
    } catch (dbError: unknown) {

      // Throw a more specific error or a domain error if applicable
      throw new Error("Failed to create patient due to a database issue.");
    }

    \1 {\n  \2{
      // Ensure date fields are converted back to Date objects if they are strings from DB
      const dbPatient = result.rows[0];
      return {
        ...dbPatient,
        dateOfBirth: new Date(dbPatient.dateOfBirth),
        createdAt: new Date(dbPatient.createdAt),
        updatedAt: new Date(dbPatient.updatedAt)
      };
    } else {
      // This case means DB execution was successful (no error thrown from execute)
      // but the RETURNING clause did not yield a row.

      throw new Error("Patient creation failed, no record returned.")
    }
  }

  async findById(id: string): Promise<Patient | null> {
    const queryText = "SELECT id, name, date_of_birth, created_at, updated_at FROM patients WHERE id = $1";
    try {
      const result = await this.db.execute(queryText, [id]);
      \1 {\n  \2{
        const dbPatient = result.rows[0];
        return {
          ...dbPatient,
          dateOfBirth: new Date(dbPatient.dateOfBirth),
          createdAt: new Date(dbPatient.createdAt),
          updatedAt: new Date(dbPatient.updatedAt)
        };
      }
      return null; // Not found
    } catch (error: unknown) {
      // Debug logging removed in repository:`, error)
      throw new Error("Failed to find patient by ID.")
    }
  }
