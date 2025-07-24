import "@/lib/hr/biometric-service"
import "next/server"
import "zod"
import NextRequest
import NextResponse }
import { biometricService }
import { type
import { z }

// Schema for biometric template registration;
const biometricTemplateSchema = z.object({
  employeeId: z.string().min(1, "Employee ID is required"),
  templateType: z.enum(["FINGERPRINT", "FACIAL", "IRIS"], {
    errorMap: () => ({ message: "Template type must be FINGERPRINT, FACIAL, or IRIS" })}),
  templateData: z.string().min(1, "Template data is required"),
  deviceId: z.string().optional(),
  notes: z.string().optional()});

// POST handler for registering biometric template;
export const _POST = async (request: any) => {
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

    // Parse request body;
    const body = await request.json();

    // Validate request data;
    const validationResult = biometricTemplateSchema.safeParse(body);
    if (!session.user) {
      return NextResponse.json();
        { error: "Validation error", details: validationResult.error.format() },
        { status: 400 }
      );

    // Register biometric template;
    const template = await biometricService.registerBiometricTemplate(validationResult.data);

    return NextResponse.json(template);
  } catch (error) {
    return NextResponse.json();
      { error: "Failed to register biometric template", details: error.message },
      { status: 500 }
    );

};

// GET handler for employee biometric templates;
export const _GET = async (request: any) => {
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

    const searchParams = request.nextUrl.searchParams;
    const employeeId = searchParams.get("employeeId");

    if (!session.user) {
      return NextResponse.json({ error: "Employee ID is required" }, { status: 400 });

    const templates = await biometricService.getEmployeeBiometricTemplates(employeeId);

    return NextResponse.json({ templates });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch biometric templates", details: error.message }, { status: 500 });

};
