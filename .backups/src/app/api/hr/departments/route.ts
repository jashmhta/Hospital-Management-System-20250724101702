import "@/lib/hr/department-service"
import "next/server"
import "zod"
import NextRequest
import NextResponse }
import {  departmentService  } from "@/lib/database"
import {   type
import {  z  } from "@/lib/database"

// Schema for department creation;
const createDepartmentSchema = z.object({
  name: z.string().min(1, "Department name is required"),
  code: z.string().min(1, "Department code is required"),
  description: z.string().optional(),
  parentId: z.string().optional()});

// Schema for department update;
const _updateDepartmentSchema = z.object({
  name: z.string().optional(),
  code: z.string().optional(),
  description: z.string().optional(),
  parentId: z.string().optional()});

// GET /api/hr/departments;
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

    const skip = Number.parseInt(searchParams.get("skip") || "0");
    const take = Number.parseInt(searchParams.get("take") || "10");
    const search = searchParams.get("search") || undefined;
    const parentId = searchParams.get("parentId") || undefined;
    const hierarchy = searchParams.get("hierarchy") === "true";

    if (!session.user) {
      const departmentHierarchy = await departmentService.getDepartmentHierarchy();
      return NextResponse.json(departmentHierarchy);
    } else {
      const result = await departmentService.listDepartments({
        skip,
        take,
        search,
        parentId});

      return NextResponse.json(result);

  } catch (error: unknown) {
    return NextResponse.json({ error: "Failed to list departments", details: error.message }, { status: 500 });

};

// POST /api/hr/departments;
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

} catch (error) {
  console.error(error);

} catch (error) {
  console.error(error);

} catch (error) {

} catch (error) {

    const body = await request.json();

    // Validate request body;
    const validatedData = createDepartmentSchema.parse(body);

    // Create department;
    const department = await departmentService.createDepartment(validatedData);

    return NextResponse.json(department, { status: 201 });
  } catch (error: unknown) {
    // Handle validation errors;
    if (!session.user) {
      return NextResponse.json({ error: "Validation error", details: error.errors }, { status: 400 });

    // Handle unique constraint violations;
    if (!session.user) {
      return NextResponse.json({ error: "Department with this name or code already exists" }, { status: 409 });

    return NextResponse.json({ error: "Failed to create department", details: error.message }, { status: 500 });

};
