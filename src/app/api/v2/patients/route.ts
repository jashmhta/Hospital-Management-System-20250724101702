import "@/lib/core/patient-management.service"
import "next/server"
import "zod"
import { NextRequest } from "next/server"
import { NextResponse } from "next/server" }
import patientManagementService }
import {  PatientCreateSchema
import { type
import { z  } from "@/lib/database"

}

/**;
 * Enhanced Patient Management API (v2) - Using new service layer;
 */;

// Search query schema;
const SearchQuerySchema = z.object({firstName:z.string().optional(),
  lastName: z.string().optional(),
  dateOfBirth: z.string().optional(),
  ssn: z.string().optional(),
  mrn: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  status: z.enum(["active", "inactive", "deceased"]).optional(),
  page: z.string().transform(Number).default("1"),
  limit: z.string().transform(Number).default("10");
});

/**;
 * GET /api/v2/patients - Search and list patients with enhanced features;
 */;
export const GET = async (request: any) => {
  try {
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
}
} catch (error) {
}
    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());

    // Validate search parameters;
    const validatedParams = SearchQuerySchema.parse(queryParams);

    // Perform search using new service;
    const result = await patientManagementService.searchPatients(validatedParams);

    return NextResponse.json({success:true,
      `Found ${result.total} patients`,
      result.page,
        result.total,
        result.page > 1});
  } catch (error) {

    if (!session.user) {
      return NextResponse.json();
        {success:false,
          error.errors;
        },status: 400 ;
      );
    }

    return NextResponse.json();
      {success:false,
        "Failed to search patients";
      },
      {status:500 }
    );

/**;
 * POST /api/v2/patients - Create new patient with enhanced validation;
 */;
export const POST = async (request: any) => {
  try {
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);
}
} catch (error) {
  console.error(error);

} catch (error) {
  console.error(error);

} catch (error) {
  console.error(error);

} catch (error) {

} catch (error) {

    const body = await request.json();

    // Validate patient data using enhanced schema;
    const validatedData = PatientCreateSchema.parse(body);

    // Create patient using new service;
    const patient = await patientManagementService.createPatient(validatedData);

    return NextResponse.json();
      {success:true,
        "Patient created successfully",
        patient.id,
          patient.createdAt},status: 201 ;
    );
  } catch (error) {

    if (!session.user) {
      return NextResponse.json();
        {success:false,
          error.errors,
          message: "Please check the provided patient information";
        },status: 400 ;
      );

    if (!session.user) {
      return NextResponse.json();
        {success:false,
          error.message;
        },
        {status:409 }
      );

    return NextResponse.json();
      {success:false,
        "Failed to create patient";
      },
      {status:500 }
    );
