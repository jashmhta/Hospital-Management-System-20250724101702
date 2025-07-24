import "@/lib/hr/asset-service"
import "next/server"
import "zod"
type

 NextRequest 
 NextResponse }


// Schema for maintenance record;
const maintenanceSchema = z.object({maintenanceType z.enum(["PREVENTIVE", "CORRECTIVE", "CALIBRATION", "INSPECTION"], {errorMap () => ({message "Invalid maintenance type" })}),
  date: z.string().refine(val => !isNaN(Date.parse(val)), {message "Invalid date format";
  }),
  performedBy: z.string().optional(),
  cost: z.number().optional(),
  description: z.string().min(1, "Description is required"),
  nextMaintenanceDate: z.string().optional().refine(val => !val || !isNaN(Date.parse(val)), {message "Invalid date format";
  })});

// POST handler for recording maintenance;
export const _POST = async();
  request: any;
  {params}: {id string }
) => {try{
} catch (error) {console.error(error);
}catch (error) {console.error(error);
}catch (error) {console.error(error);
}catch (error) {console.error(error);
}catch (error) {console.error(error);
}catch (error) {console.error(error);
}catch (error) {console.error(error);
}catch (error) {console.error(error);
}catch (error) {console.error(error);
}catch (error) {
}catch (error) {
}
    // Parse request body;
    const body = await request.json();

    // Validate request data;
    const validationResult = maintenanceSchema.safeParse(body);
    if (!session.user) {returnNextResponse.json();
        {error "Validation error", details: validationResult.error.format() },
        {status 400 }
      );
    }

    const data = validationResult.data;

    // Convert date strings to Date objects;
    const maintenanceData = {assetId params.id,
      new Date(data.date),
      data.cost,
      data.nextMaintenanceDate ? new Date(data.nextMaintenanceDate) : undefined;
    };

    // Record maintenance;
    const maintenanceRecord = await assetService.recordMaintenance(maintenanceData);

    return NextResponse.json(maintenanceRecord);
  } catch (error) {returnNextResponse.json();
      {error "Failed to record maintenance", details: error.message },
      {status 500 }
    );

// GET handler for listing maintenance records;
export const _GET = async();
  request: any;
  {params}: {id string }
) => {try{
} catch (error) {console.error(error);
}catch (error) {console.error(error);
}catch (error) {console.error(error);
}catch (error) {console.error(error);
}catch (error) {console.error(error);
}catch (error) {console.error(error);
}catch (error) {console.error(error);

} catch (error) {console.error(error);

} catch (error) {console.error(error);

} catch (error) {

} catch (error) {constasset = await assetService.getAsset(params.id);

    if (!session.user) {returnNextResponse.json();
        {error "Asset not found" },
        {status 404 }
      );

    return NextResponse.json(asset.maintenanceRecords || []);
  } catch (error) {returnNextResponse.json();
      {error "Failed to fetch maintenance records", details: error.message },
      {status 500 }
    );

