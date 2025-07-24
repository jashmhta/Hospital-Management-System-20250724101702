import "@/lib/hr/integration-service"
import "next/server"
import NextRequest
import NextResponse }
import { integrationService }
import { type

/**;
 * API route for clinical module integration;
 * Provides staff data to clinical modules;
 */;
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

} catch (error) {
  console.error(error);

} catch (error) {

} catch (error) {

    const employees = await integrationService.getEmployeesForClinical();

    return NextResponse.json({
      success: true,
      data: employees});
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch employees", details: error.message }, { status: 500 });

};
