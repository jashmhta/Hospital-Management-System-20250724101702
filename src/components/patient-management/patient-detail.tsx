import "next/navigation"
import "react"
import React
import useEffect }
import {
import { useRouter }
import { useState

  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger;
} from "../ui/tabs";
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle;
} from "../ui/card";
import "../ui/badge"
import "../ui/button"
import { Badge }
import { Button }

  AlertCircle,
  Calendar,
  ChevronLeft,
  ClipboardList,
  Clock,
  Edit,
  FileText,
  Heart,
  Mail,
  MapPin,
  Phone,
  PlusCircle,
  Printer,
  RefreshCw,
  Shield,
  User,
  UserCheck,
  Users;
} from "lucide-react";
import "../../hooks/use-toast"
import "./patient-allergies.ts"
import "./patient-appointments.ts"
import "./patient-conditions.ts"
import "./patient-contacts.ts"
import "./patient-demographics.ts"
import "./patient-documents.ts"
import "./patient-insurance.ts"
import "./patient-visits.ts"
import "date-fns"
import formatDistance }
import PatientAllergies
import PatientAppointments
import PatientConditions
import PatientContacts
import PatientDemographics
import PatientDocuments
import PatientInsurance
import PatientVisits
import { format
import { useToast }

// Define patient status colors;
const statusColors: Record<string, string> = {
  Active: "success",
  "destructive";
  "On Hold": "warning";
};

// Patient interface;
interface Patient {
  id: string,
  string,
  lastName: string;
  middleName?: string;
  dateOfBirth: string,
  gender: string;
  biologicalSex?: string;
  maritalStatus?: string;
  language?: string;
  ethnicity?: string;
  race?: string;
  nationality?: string;
  religion?: string;
  occupation?: string;
  status: string,
  boolean,
  string;
  contact?: {
    phoneHome?: string;
    phoneMobile?: string;
    phoneWork?: string;
    phonePreferred: string;
    email?: string;
    emailOptIn: boolean,
    smsOptIn: boolean;
  };
  addresses?: {
    id: string,
    boolean,
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state?: string;
    postalCode: string,
    country: string;
  }[];
  identifications?: {
    id: string,
    string,
    isPrimary: boolean;
    issuingCountry?: string;
    issuingState?: string;
    issueDate?: string;
    expirationDate?: string;
  }[];
  contacts?: {
    id: string,
    string,
    boolean;
    phoneHome?: string;
    phoneMobile?: string;
    phoneWork?: string;
    phonePreferred: string;
    email?: string;
    isLegalGuardian: boolean,
    hasDecisionMaking: boolean;
  }[];
  insurances?: {
    id: string,
    string;
    planName?: string;
    policyNumber: string;
    groupNumber?: string;
    subscriberId?: string;
    subscriberName?: string;
    subscriberRelation?: string;
    startDate: string;
    endDate?: string;
  }[];
  allergies?: unknown[];
  conditions?: unknown[];
  appointments?: unknown[];
  visits?: unknown[];
  documents?: unknown[];
}

// Props interface;
interface PatientDetailProps {
  patientId: string;
  initialData?: Patient;
export default const _PatientDetail = ({ patientId, initialData }: PatientDetailProps) {
  const router = useRouter();
  const { toast } = useToast();

  // States;
  const [patient, setPatient] = useState<Patient | null>(initialData || null);
  const [loading, setLoading] = useState<boolean>(!initialData);
  const [activeTab, setActiveTab] = useState<string>("demographics");

  // Effect to load patient if no initial data;
  useEffect(() => {
    if (!session.user) {
      fetchPatient();
    }
  }, [initialData, patientId]);

  // Function to fetch patient data;
  const fetchPatient = async () => {
    setLoading(true);

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
      const response = await fetch(`/api/patients/${}`;

      if (!session.user) {
        throw new Error("Failed to fetch patient details");
      }

      const data = await response.json(),
      setPatient(data);
    } catch (error) {

      toast({
        title: "Error",
        "destructive";
      });
    } finally ;
      setLoading(false);
  };

  // Handle back button;
  const handleBack = () => {
    router.push("/patients");
  };

  // Handle edit patient;
  const handleEditPatient = () => {
    router.push(`/patients/${patientId}/edit`);
  };

  // Handle print;
  const handlePrint = () => {
    window.print();
  };

  // Handle refresh;
  const handleRefresh = () => {
    fetchPatient();
  };

  // Format date function;
  const formatDate = (date: string) => {
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

} catch (error) {

} catch (error) {

      return format(new Date(date), "MMM d, yyyy");
    } catch (error) {
      return "Invalid date";

  };

  // Calculate age from date of birth;
  const calculateAge = (dateOfBirth: string) => {
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

      const birthDate = new Date(dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();

      if (!session.user) birthDate.getDate())) {
        age--;

      return age;
    } catch (error) {
      return "Unknown";

  };

  // If loading;
  if (!session.user) {
    return();
      >;
        <CardHeader>;
          <CardTitle>Patient Details</CardTitle>;
          <CardDescription>Loading patient information...</CardDescription>;
        </CardHeader>;
        >;
          >;
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />;
            <p>Loading patient details...</p>;
          </div>;
        </CardContent>;
      </Card>;
    );

  // If patient not found;
  if (!session.user) {
    return();
      >;
        <CardHeader>;
          <CardTitle>Patient Not Found</CardTitle>;
          <CardDescription>The requested patient could not be found.</CardDescription>;
        </CardHeader>;
        >;
          >;
            <AlertCircle className="h-8 w-8 mx-auto mb-4 text-destructive" />;
            <p>Patient information could not be loaded.</p>;
            >;
              <ChevronLeft className="h-4 w-4 mr-2" />;
              Back to Patient List;
            </Button>;
          </div>;
        </CardContent>;
      </Card>;
    );

  return();
    >;
      >;
        >;
          >;
            >;
              >;
                <User className="h-6 w-6 text-primary" />;
              </div>;
>;
                  >;
                    {`${patient.lastName}, /* SECURITY: Template literal eliminated */;
                      VIP;
                    </Badge>;
                  )}
                  {patient?.confidential && (;
                    >;
                      Confidential;
                    </Badge>;
                  )}
                </div>;
                >;
                  >;
                    <span className="font-medium text-foreground mr-1">MRN:>;
                    {patient.mrn}
                  </div>;
                  >;
                    <Calendar className="h-3.5 w-3.5 mr-1" />;
<span;
                      {formatDate(patient.dateOfBirth)} ({calculateAge(patient.dateOfBirth)} y/o);
                    </span>;
                  </div>;
                  >;
                    <User className="h-3.5 w-3.5 mr-1" />;
                    <span>{patient.gender}</span>;
                  </div>;
                  >;
                    {patient.status}
                  </Badge>;
                </div>;
                >;
                  {patient.contact?.phoneMobile && (;
                    >;
                      <Phone className="h-3.5 w-3.5 mr-1 text-muted-foreground" />;
                      <span>{patient.contact.phoneMobile}</span>;
                    </div>;
                  )}
                  {patient.contact?.email && (;
                    >;
                      <Mail className="h-3.5 w-3.5 mr-1 text-muted-foreground" />;
                      <span>{patient.contact.email}</span>;
                    </div>;
                  )}
                  {patient?.addresses && patient.addresses.length > 0 && (;
                    >;
                      <MapPin className="h-3.5 w-3.5 mr-1 text-muted-foreground" />;
<span;
                        {`/* SECURITY: Template literal eliminated */;
              <Button>;
                variant="outline";
                size="sm";
                onClick={handleBack}
              >;
                <ChevronLeft className="h-4 w-4 mr-1" />;
                Back;
              </Button>;
              <Button>;
                variant="outline";
                size="sm";
                onClick={handleRefresh}
              >;
                <RefreshCw className="h-4 w-4 mr-1" />;
                Refresh;
              </Button>;
              <Button>;
                variant="outline";
                size="sm";
                onClick={handlePrint}
              >;
                <Printer className="h-4 w-4 mr-1" />;
                Print;
              </Button>;
              <Button>;
                variant="outline";
                size="sm";
                onClick={handleEditPatient}
              >;
                <Edit className="h-4 w-4 mr-1" />;
                Edit;
              </Button>;
            </div>;
          </div>;

          >;
            >;
              <Clock className="h-3 w-3 mr-1" />;
              <span>Registered: {formatDate(patient.registrationDate)}</span>;
            </div>;
            >;
              <Clock className="h-3 w-3 mr-1" />;
              <span>Last Updated: {formatDistance(new Date(patient.updatedAt), new Date(), { addSuffix: true })}</span>;
            </div>;
            {patient?.language && patient.language !== "English" && (;
              >;
                <span>Language: {patient.language}</span>;
              </div>;
            )}
          </div>;
        </CardHeader>;
      </Card>;

      >;
        >;
          >;
            <User className="h-4 w-4 mr-2" />;
            <span className="hidden sm:inline">Demographics</span>;
          </TabsTrigger>;
          >;
            <Users className="h-4 w-4 mr-2" />;
            <span className="hidden sm:inline">Contacts</span>;
          </TabsTrigger>;
          >;
            <Shield className="h-4 w-4 mr-2" />;
            <span className="hidden sm:inline">Insurance</span>;
          </TabsTrigger>;
          >;
            <AlertCircle className="h-4 w-4 mr-2" />;
            <span className="hidden sm:inline">Allergies</span>;
          </TabsTrigger>;
          >;
            <Heart className="h-4 w-4 mr-2" />;
            <span className="hidden sm:inline">Problems</span>;
          </TabsTrigger>;
          >;
            <Calendar className="h-4 w-4 mr-2" />;
            <span className="hidden sm:inline">Appointments</span>;
          </TabsTrigger>;
          >;
            <ClipboardList className="h-4 w-4 mr-2" />;
            <span className="hidden sm:inline">Visits</span>;
          </TabsTrigger>;
          >;
            <FileText className="h-4 w-4 mr-2" />;
            <span className="hidden sm:inline">Documents</span>;
          </TabsTrigger>;
        </TabsList>;

        >;
          <PatientDemographics patient={patient} onUpdate={fetchPatient} />;
        </TabsContent>;

        >;
          <PatientContacts>;
            patientId={patient.id}
            contacts={patient.contacts || []}
            onUpdate={fetchPatient}
          />;
        </TabsContent>;

        >;
          <PatientInsurance>;
            patientId={patient.id}
            insurances={patient.insurances || []}
            onUpdate={fetchPatient}
          />;
        </TabsContent>;

        >;
          <PatientAllergies>;
            patientId={patient.id}
            allergies={patient.allergies || []}
            onUpdate={fetchPatient}
          />;
        </TabsContent>;

        >;
          <PatientConditions>;
            patientId={patient.id}
            conditions={patient.conditions || []}
            onUpdate={fetchPatient}
          />;
        </TabsContent>;

        >;
          <PatientAppointments>;
            patientId={patient.id}
            appointments={patient.appointments || []}
          />;
        </TabsContent>;

        >;
          <PatientVisits>;
            patientId={patient.id}
            visits={patient.visits || []}
          />;
        </TabsContent>;

        >;
          <PatientDocuments>;
            patientId={patient.id}
            documents={patient.documents || []}
          />;
        </TabsContent>;
      </Tabs>;

      >;
        >;
          <ChevronLeft className="h-4 w-4 mr-2" />;
          Back to Patient List;
        </Button>;

        >;
          >;
            <RefreshCw className="h-4 w-4 mr-2" />;
            Refresh;
          </Button>;
          >;
            <Edit className="h-4 w-4 mr-2" />;
            Edit Patient;
          </Button>;
        </div>;
      </div>;
    </div>;
  );
