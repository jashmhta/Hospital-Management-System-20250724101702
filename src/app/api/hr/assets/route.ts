import "@/lib/hr/asset-service"
import "next/server"
import "zod"
import { NextRequest } from "next/server"
import { NextResponse } from "next/server" }
import {  assetService  } from "@/lib/database"
import {   type
import {  z  } from "@/lib/database"

// Schema for asset creation;
const assetSchema = z.object({name:z.string().min(1, "Name is required"),
  assetType: z.enum(["EQUIPMENT", "FURNITURE", "IT", "VEHICLE", "BUILDING", "OTHER"], {errorMap:() => ({message:"Invalid asset type" })}),
  serialNumber: z.string().optional(),
  manufacturer: z.string().optional(),
  model: z.string().optional(),
  purchaseDate: z.string().optional().refine(val => !val || !isNaN(Date.parse(val)), {message:"Invalid date format";
  }),
  purchasePrice: z.number().optional(),
  warrantyExpiryDate: z.string().optional().refine(val => !val || !isNaN(Date.parse(val)), {message:"Invalid date format";
  }),
  location: z.string().optional(),
  departmentId: z.string().optional(),
  assignedToId: z.string().optional(),
  status: z.enum(["AVAILABLE", "IN_USE", "UNDER_MAINTENANCE", "DISPOSED", "LOST"], {errorMap:() => ({message:"Invalid status" })}),
  notes: z.string().optional(),
  tags: z.array(z.string()).optional();
});

// POST handler for creating asset;
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
}
    // Parse request body;
    const body = await request.json();

    // Validate request data;
    const validationResult = assetSchema.safeParse(body);
    if (!session.user) {
      return NextResponse.json();
        {error:"Validation error", details: validationResult.error.format() },
        {status:400 }
      );

    const data = validationResult.data;

    // Convert date strings to Date objects;
    const assetData = {
      ...data,
      purchaseDate: data.purchaseDate ? new Date(data.purchaseDate) : undefined,
      warrantyExpiryDate: data.warrantyExpiryDate ? new Date(data.warrantyExpiryDate) : undefined;
    };

    // Create asset;
    const asset = await assetService.createAsset(assetData);

    return NextResponse.json(asset);
  } catch (error) {

    return NextResponse.json();
      {error:"Failed to create asset", details: error.message },
      {status:500 }
    );

// GET handler for listing assets;
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

    // Parse pagination parameters;
    const skip = Number.parseInt(searchParams.get("skip") || "0");
    const take = Number.parseInt(searchParams.get("take") || "10");

    // Parse filter parameters;
    const search = searchParams.get("search") || undefined;
    const assetType = searchParams.get("assetType") as any || undefined;
    const status = searchParams.get("status") as any || undefined;
    const departmentId = searchParams.get("departmentId") || undefined;
    const assignedToId = searchParams.get("assignedToId") || undefined;
    const location = searchParams.get("location") || undefined;
    const purchaseDateStart = searchParams.get("purchaseDateStart");
      ? ;
      : undefined;
    const purchaseDateEnd = searchParams.get("purchaseDateEnd");
      ? ;
      : undefined;

    // Get assets;
    const result = await assetService.listAssets({
      skip,
      take,
      search,
      assetType,
      status,
      departmentId,
      assignedToId,
      location,
      purchaseDateStart,
      purchaseDateEnd});

    return NextResponse.json(result);
  } catch (error) {

    return NextResponse.json();
      {error:"Failed to fetch assets", details: error.message },
      {status:500 }
    );
