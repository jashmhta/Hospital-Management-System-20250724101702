import { NextRequest, NextResponse } from "next/server";

interface ERVisit {id:string | number;
  patient_id: string | number;
  patient_name?: string;
  mrn?: string;
  arrival_timestamp: string;
  chief_complaint: string;
  mode_of_arrival?: string;
  triage_level?: number | undefined;
  assigned_physician_id?: string | number | undefined;
  assigned_nurse_id?: string | number | undefined;
  current_location?: string | undefined;
  current_status?: string | undefined;
  disposition?: string | undefined;
  discharge_timestamp?: string | undefined;
  created_at?: string;
  updated_at?: string;
}

const mockVisits: ERVisit[] = [
  {id:1,
    patient_name: "John Doe",
    mrn: "MRN001",
    patient_id: 1,
    arrival_timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    chief_complaint: "Chest pain",
    triage_level: 2,
    current_status: "Pending Triage",
    created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
  },
  {id:2,
    patient_name: "Jane Smith",
    patient_id: 2,
    arrival_timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    chief_complaint: "Shortness of breath",
    triage_level: 3,
    current_location: "Triage Room 1",
    assigned_physician_id: 201,
    assigned_nurse_id: 301,
    created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 30 * 60 * 1000).toISOString()
  }
];

let nextVisitId = 3;

interface ERVisitInput {patient_id:number | string;
  chief_complaint: string;
  mode_of_arrival?: string;
  arrival_timestamp?: string;
}
interface ERVisitFilters {
  status?: string | undefined;
  location?: string | undefined;
  date?: string | undefined;
}

async function getERVisitsFromDB(filters: ERVisitFilters = {}) {
  let filtered = [...mockVisits];
  
  if (filters.status) {
    filtered = filtered.filter(
      (v) => v.current_status?.toLowerCase() === filters.status!.toLowerCase()
    );
  }
  
  if (filters.location) {
    filtered = filtered.filter(
      (v) => v.current_location?.toLowerCase() === filters.location!.toLowerCase()
    );
  }

  return filtered.sort(
    (a, b) => new Date(b.arrival_timestamp).getTime() - new Date(a.arrival_timestamp).getTime()
  );
}

async function createERVisitInDB(data: ERVisitInput): Promise<ERVisit> {
  const now = new Date().toISOString();
  const newVisit: ERVisit = {id:nextVisitId++,
    patient_id: data.patient_id,
    patient_name: `Patient ${data.patient_id}`,
    mrn: `MRN${String(data.patient_id).padStart(3, "0")}`,
    arrival_timestamp: data.arrival_timestamp || now,
    chief_complaint: data.chief_complaint,
    mode_of_arrival: data.mode_of_arrival || "Unknown",
    current_status: "Pending Triage",
    created_at: now,
    updated_at: now
  };
  
  mockVisits.push(newVisit);
  return newVisit;
}

export const GET = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const filters: ERVisitFilters = {status:searchParams.get("status") ?? undefined,
      location: searchParams.get("location") ?? undefined,
      date: searchParams.get("date") ?? undefined
    };

    const visits = await getERVisitsFromDB(filters);
    return NextResponse.json({ visits });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      {error:"Failed to fetch ER visits", details: errorMessage },
      {status:500 }
    );
  }
};

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();
    const visitData = body as ERVisitInput;

    if (!visitData.patient_id || !visitData.chief_complaint) {
      return NextResponse.json(
        {error:"Missing required fields (patient_id, chief_complaint)" },
        {status:400 }
      );
    }

    const newVisit = await createERVisitInDB(visitData);
    return NextResponse.json({visit:newVisit }, {status:201 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      {error:"Failed to create ER visit", details: errorMessage },
      {status:500 }
    );
  }
};
